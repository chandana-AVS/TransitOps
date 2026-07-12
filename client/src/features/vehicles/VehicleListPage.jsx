import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import StatusBadge from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { createVehicleSchema } from "../../lib/schemas";

const emptyForm = { registrationNumber: "", name: "", model: "", type: "VAN", maxLoadCapacity: "", acquisitionCost: "", region: "" };
const typeOptions = [
  { value: "VAN", label: "Van" },
  { value: "TRUCK", label: "Truck" },
  { value: "BUS", label: "Bus" },
  { value: "CAR", label: "Car" },
];

export default function VehicleListPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [retireTarget, setRetireTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const columns = useMemo(() => [
    { key: "registrationNumber", label: "Reg #", className: "font-semibold text-surface-900 dark:text-white" },
    { key: "name", label: "Name", className: "font-medium" },
    { key: "type", label: "Type" },
    { key: "maxLoadCapacity", label: "Capacity", className: "tabular-nums", render: (r) => `${r.maxLoadCapacity} kg` },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", label: "Actions", render: (r) =>
        r.status === "AVAILABLE" ? (
          <Button size="sm" variant="danger" onClick={() => setRetireTarget(r)}>Retire</Button>
        ) : null,
    },
  ], []);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => api.get("/vehicles?limit=50"),
  });

  const createMutation = useMutation({
    mutationFn: (body) => api.post("/vehicles", body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["vehicles"] }); setShowForm(false); setForm(emptyForm); setErrors({}); toast("Vehicle created", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const retireMutation = useMutation({
    mutationFn: (id) => api.patch(`/vehicles/${id}/retire`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["vehicles"] }); setRetireTarget(null); toast("Vehicle retired", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = createVehicleSchema.safeParse(form);
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

  const vehicles = (data?.vehicles || []).filter((v) => !search || (v.registrationNumber || "").toLowerCase().includes(search.toLowerCase()) || (v.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Vehicles</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage your fleet inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input placeholder="Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 rounded-xl text-sm text-surface-800 dark:text-surface-200 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all w-52" />
          </div>
          <Button onClick={() => setShowForm(true)}>+ Add Vehicle</Button>
        </div>
      </div>

      <Table columns={columns} data={vehicles} isLoading={isLoading} emptyMessage="No vehicles found" />

      <ConfirmModal open={!!retireTarget} onClose={() => setRetireTarget(null)} onConfirm={() => retireMutation.mutate(retireTarget.id)} title="Retire Vehicle" message={`Are you sure you want to retire ${retireTarget?.registrationNumber}? This cannot be undone.`} confirmLabel="Retire" loading={retireMutation.isPending} />

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Vehicle">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Registration Number" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} error={errors.registrationNumber} required />
          <Input label="Vehicle Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
          <Input label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} error={errors.model} required />
          <Select label="Type" options={typeOptions} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} error={errors.type} />
          <Input label="Max Load Capacity (kg)" type="number" value={form.maxLoadCapacity} onChange={(e) => setForm({ ...form, maxLoadCapacity: e.target.value })} error={errors.maxLoadCapacity} required />
          <Input label="Acquisition Cost ($)" type="number" value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} error={errors.acquisitionCost} required />
          <Input label="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
