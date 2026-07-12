import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import StatusBadge from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { createMaintenanceSchema } from "../../lib/schemas";

const emptyForm = { vehicleId: "", description: "", cost: "" };

export default function MaintenanceListPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["maintenance"],
    queryFn: () => api.get("/maintenance?limit=50"),
  });

  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles-maint"],
    queryFn: () => api.get("/vehicles?limit=100"),
  });

  const createMutation = useMutation({
    mutationFn: (body) => api.post("/maintenance", body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["maintenance"] }); queryClient.invalidateQueries({ queryKey: ["vehicles"] }); setShowForm(false); setForm(emptyForm); setErrors({}); toast("Maintenance record created", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const closeMutation = useMutation({
    mutationFn: (id) => api.post(`/maintenance/${id}/close`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["maintenance"] }); queryClient.invalidateQueries({ queryKey: ["vehicles"] }); toast("Maintenance closed", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = createMaintenanceSchema.safeParse(form);
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

  const records = data?.records || [];
  const availableVehicles = vehiclesData?.vehicles?.filter((v) => v.status === "AVAILABLE" || v.status === "IN_SHOP") || [];

  const columns = useMemo(() => [
    { key: "vehicle", label: "Vehicle", className: "font-semibold text-surface-900 dark:text-white", render: (r) => r.vehicle?.registrationNumber },
    { key: "description", label: "Description", className: "font-medium" },
    { key: "cost", label: "Cost", render: (r) => `$${r.cost}` },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", label: "Actions", render: (r) =>
        r.status === "OPEN" ? (
          <Button size="sm" variant="success" onClick={() => closeMutation.mutate(r.id)}>Close</Button>
        ) : null,
    },
  ], [closeMutation]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Maintenance</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage and track fleet vehicle maintenance records</p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ New Record</Button>
      </div>

      <Table columns={columns} data={records} isLoading={isLoading} emptyMessage="No maintenance records" />

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Maintenance Record">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Vehicle" options={availableVehicles.map((v) => ({ value: v.id, label: `${v.registrationNumber} — ${v.name} (${v.status})` }))} value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} error={errors.vehicleId} placeholder="Select Vehicle" required />
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className={`w-full px-3.5 py-2.5 bg-white dark:bg-surface-800/50 border rounded-xl text-sm text-surface-800 dark:text-surface-200 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200 ${errors.description ? "border-accent-rose ring-1 ring-accent-rose/20" : "border-surface-300 dark:border-surface-600"}`} />
            {errors.description && <p className="mt-1.5 text-xs text-accent-rose flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>{errors.description}</p>}
          </div>
          <Input label="Cost ($)" type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} error={errors.cost} required />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
