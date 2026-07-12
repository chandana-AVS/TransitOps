import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useAuth } from "../auth/AuthProvider";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import StatusBadge from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { createDriverSchema } from "../../lib/schemas";

const emptyForm = { userId: "", licenseNumber: "", licenseCategory: "CLASS_C", licenseExpiryDate: "", contactNumber: "", safetyScore: "5.0" };
const categoryOptions = [
  { value: "CLASS_A", label: "Class A" },
  { value: "CLASS_B", label: "Class B" },
  { value: "CLASS_C", label: "Class C" },
  { value: "CLASS_D", label: "Class D" },
];

export default function DriverListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [suspendTarget, setSuspendLocal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const isFleetManager = user?.role === "FLEET_MANAGER";

  const { data, isLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => api.get("/drivers?limit=50"),
  });

  const createMutation = useMutation({
    mutationFn: (body) => api.post("/drivers", body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["drivers"] }); setShowForm(false); setForm(emptyForm); setErrors({}); toast("Driver created", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const suspendMutation = useMutation({
    mutationFn: (id) => api.patch(`/drivers/${id}/suspend`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["drivers"] }); setSuspendLocal(null); toast("Driver suspended", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const unsuspendMutation = useMutation({
    mutationFn: (id) => api.patch(`/drivers/${id}/unsuspend`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["drivers"] }); toast("Driver unsuspended", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const columns = useMemo(() => [
    { key: "name", label: "Name", className: "font-semibold text-surface-900 dark:text-white", render: (r) => r.user?.name },
    { key: "licenseNumber", label: "License", className: "font-medium" },
    { key: "expiry", label: "Expiry", className: "tabular-nums", render: (r) => new Date(r.licenseExpiryDate).toLocaleDateString() },
    { key: "safetyScore", label: "Score", className: "tabular-nums font-bold text-surface-900 dark:text-white", render: (r) => r.safetyScore },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", label: "Actions", render: (r) => (
        <div className="flex gap-2">
          {r.status === "SUSPENDED" && isFleetManager ? (
            <Button size="sm" variant="success" onClick={() => unsuspendMutation.mutate(r.id)} loading={unsuspendMutation.isPending}>Rejoin</Button>
          ) : r.status !== "SUSPENDED" ? (
            <Button size="sm" variant="danger" onClick={() => setSuspendLocal(r)}>Suspend</Button>
          ) : null}
        </div>
      )
    },
  ], [unsuspendMutation, isFleetManager]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = createDriverSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    createMutation.mutate(result.data);
  };

  const drivers = (data?.drivers || []).filter((d) => !search || d.user?.name?.toLowerCase().includes(search.toLowerCase()) || d.licenseNumber?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Drivers</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage driver records and compliance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input placeholder="Search drivers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 rounded-xl text-sm text-surface-800 dark:text-surface-200 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all w-52" />
          </div>
          <Button onClick={() => setShowForm(true)}>+ Add Driver</Button>
        </div>
      </div>

      <Table columns={columns} data={drivers} isLoading={isLoading} emptyMessage="No drivers found" />

      <ConfirmModal open={!!suspendTarget} onClose={() => setSuspendLocal(null)} onConfirm={() => suspendMutation.mutate(suspendTarget.id)} title="Suspend Driver" message={`Suspend ${suspendTarget?.user?.name}? They will not be assignable to trips.`} confirmLabel="Suspend" loading={suspendMutation.isPending} />

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Driver">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="User ID" type="number" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} error={errors.userId} required />
          <Input label="License Number" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} error={errors.licenseNumber} required />
          <Select label="License Category" options={categoryOptions} value={form.licenseCategory} onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })} error={errors.licenseCategory} />
          <Input label="License Expiry Date" type="date" value={form.licenseExpiryDate} onChange={(e) => setForm({ ...form, licenseExpiryDate: e.target.value })} error={errors.licenseExpiryDate} required />
          <Input label="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} error={errors.contactNumber} required />
          <Input label="Safety Score (0-10)" type="number" step="0.1" value={form.safetyScore} onChange={(e) => setForm({ ...form, safetyScore: e.target.value })} error={errors.safetyScore} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
