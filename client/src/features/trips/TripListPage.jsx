import { useState } from "react";
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
import { createTripSchema, completeTripSchema } from "../../lib/schemas";

const emptyForm = { source: "", destination: "", vehicleId: "", driverId: "", cargoWeight: "", plannedDistance: "", startOdometer: "" };

export default function TripListPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [completeForm, setCompleteForm] = useState({ endOdometer: "", fuelConsumed: "" });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [completeErrors, setCompleteErrors] = useState({});
  const [search, setSearch] = useState("");

  const { data: tripsData, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: () => api.get("/trips?limit=50"),
  });

  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles-available"],
    queryFn: () => api.get("/vehicles?limit=100"),
  });

  const { data: driversData } = useQuery({
    queryKey: ["drivers-available"],
    queryFn: () => api.get("/drivers?limit=100"),
  });

  const createMutation = useMutation({
    mutationFn: (body) => api.post("/trips", body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["trips"] }); setShowForm(false); setForm(emptyForm); setErrors({}); toast("Trip created", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const dispatchMutation = useMutation({
    mutationFn: (id) => api.post(`/trips/${id}/dispatch`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["trips"] }); toast("Trip dispatched", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, data }) => api.post(`/trips/${id}/complete`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["trips"] }); setCompleteTarget(null); setCompleteForm({ endOdometer: "", fuelConsumed: "" }); setCompleteErrors({}); toast("Trip completed", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => api.post(`/trips/${id}/cancel`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["trips"] }); setCancelTarget(null); toast("Trip cancelled", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = createTripSchema.safeParse(form);
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

  const handleComplete = (e) => {
    e.preventDefault();
    const result = completeTripSchema.safeParse(completeForm);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setCompleteErrors(fieldErrors);
      return;
    }
    setCompleteErrors({});
    completeMutation.mutate({ id: completeTarget.id, data: result.data });
  };

  const trips = (tripsData?.trips || []).filter((t) => !search || (t.source || "").toLowerCase().includes(search.toLowerCase()) || (t.destination || "").toLowerCase().includes(search.toLowerCase()));
  const vehicles = vehiclesData?.vehicles?.filter((v) => v.status === "AVAILABLE") || [];
  const drivers = driversData?.drivers?.filter((d) => d.status === "AVAILABLE") || [];

  const columns = [
    { key: "id", label: "ID", render: (r) => `#${r.id}`, className: "font-semibold text-surface-900 dark:text-white" },
    { key: "route", label: "Route", render: (r) => `${r.source} → ${r.destination}`, className: "font-medium" },
    { key: "cargoWeight", label: "Cargo", render: (r) => `${r.cargoWeight} kg` },
    { key: "vehicle", label: "Vehicle", render: (r) => r.vehicle?.registrationNumber },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", label: "Actions", render: (r) => (
        <div className="flex gap-1.5">
          {r.status === "DRAFT" && <Button size="sm" variant="success" onClick={() => dispatchMutation.mutate(r.id)}>Dispatch</Button>}
          {r.status === "DISPATCHED" && <Button size="sm" variant="primary" onClick={() => { setCompleteTarget(r); setCompleteForm({ endOdometer: "", fuelConsumed: "" }); setCompleteErrors({}); }}>Complete</Button>}
          {(r.status === "DRAFT" || r.status === "DISPATCHED") && <Button size="sm" variant="danger" onClick={() => setCancelTarget(r)}>Cancel</Button>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Trips</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage and track cargo shipments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input placeholder="Search trips..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 rounded-xl text-sm text-surface-800 dark:text-surface-200 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all w-52" />
          </div>
          <Button onClick={() => setShowForm(true)}>+ Create Trip</Button>
        </div>
      </div>

      <Table columns={columns} data={trips} isLoading={isLoading} emptyMessage="No trips found" />

      <ConfirmModal open={!!cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={() => cancelMutation.mutate(cancelTarget.id)} title="Cancel Trip" message={`Cancel trip #${cancelTarget?.id} from ${cancelTarget?.source} to ${cancelTarget?.destination}?`} confirmLabel="Cancel Trip" loading={cancelMutation.isPending} />

      <Modal open={!!completeTarget} onClose={() => setCompleteTarget(null)} title="Complete Trip">
        <form onSubmit={handleComplete} className="space-y-4">
          <p className="text-xs text-surface-500 mb-2">Completing trip #{completeTarget?.id}: {completeTarget?.source} → {completeTarget?.destination}</p>
          <Input label="End Odometer Reading" type="number" value={completeForm.endOdometer} onChange={(e) => setCompleteForm({ ...completeForm, endOdometer: e.target.value })} error={completeErrors.endOdometer} required />
          <Input label="Fuel Consumed (liters)" type="number" step="0.1" value={completeForm.fuelConsumed} onChange={(e) => setCompleteForm({ ...completeForm, fuelConsumed: e.target.value })} error={completeErrors.fuelConsumed} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setCompleteTarget(null)}>Cancel</Button>
            <Button type="submit" loading={completeMutation.isPending}>Complete Trip</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create Trip">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} error={errors.source} required />
          <Input label="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} error={errors.destination} required />
          <Select label="Vehicle" options={vehicles.map((v) => ({ value: v.id, label: `${v.registrationNumber} — ${v.name} (${v.maxLoadCapacity}kg)` }))} value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} error={errors.vehicleId} placeholder="Select Vehicle" required />
          <Select label="Driver" options={drivers.map((d) => ({ value: d.id, label: `${d.user?.name} — ${d.licenseNumber}` }))} value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })} error={errors.driverId} placeholder="Select Driver" required />
          <Input label="Cargo Weight (kg)" type="number" value={form.cargoWeight} onChange={(e) => setForm({ ...form, cargoWeight: e.target.value })} error={errors.cargoWeight} required />
          <Input label="Planned Distance (km)" type="number" value={form.plannedDistance} onChange={(e) => setForm({ ...form, plannedDistance: e.target.value })} error={errors.plannedDistance} required />
          <Input label="Start Odometer (optional)" type="number" value={form.startOdometer} onChange={(e) => setForm({ ...form, startOdometer: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
