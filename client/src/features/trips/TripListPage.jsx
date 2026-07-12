import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";

const emptyForm = { source: "", destination: "", vehicleId: "", driverId: "", cargoWeight: "", plannedDistance: "", startOdometer: "" };

export default function TripListPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["trips"] }); setShowForm(false); setForm(emptyForm); setError(""); },
    onError: (err) => setError(err.message),
  });

  const dispatchMutation = useMutation({
    mutationFn: (id) => api.post(`/trips/${id}/dispatch`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
    onError: (err) => alert(err.message),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => api.post(`/trips/${id}/cancel`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
  });

  const handleSubmit = (e) => { e.preventDefault(); createMutation.mutate(form); };

  const trips = tripsData?.trips || [];
  const vehicles = vehiclesData?.vehicles?.filter((v) => v.status === "AVAILABLE") || [];
  const drivers = driversData?.drivers?.filter((d) => d.status === "AVAILABLE") || [];

  if (isLoading) return <div className="animate-pulse space-y-2"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" /><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trips</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">+ Create Trip</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">ID</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Route</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Cargo</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Vehicle</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Status</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {trips.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No trips found</td></tr>}
            {trips.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">#{t.id}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.source} → {t.destination}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.cargoWeight} kg</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.vehicle?.registrationNumber}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 space-x-2">
                  {t.status === "DRAFT" && <button onClick={() => dispatchMutation.mutate(t.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Dispatch</button>}
                  {(t.status === "DRAFT" || t.status === "DISPATCHED") && <button onClick={() => cancelMutation.mutate(t.id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create Trip">
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input placeholder="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber} — {v.name} ({v.maxLoadCapacity}kg)</option>)}
          </select>
          <select value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            <option value="">Select Driver</option>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.user?.name} — {d.licenseNumber}</option>)}
          </select>
          <input type="number" placeholder="Cargo Weight (kg)" value={form.cargoWeight} onChange={(e) => setForm({ ...form, cargoWeight: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="number" placeholder="Planned Distance (km)" value={form.plannedDistance} onChange={(e) => setForm({ ...form, plannedDistance: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="number" placeholder="Start Odometer (optional)" value={form.startOdometer} onChange={(e) => setForm({ ...form, startOdometer: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded dark:border-gray-600 dark:text-gray-300">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{createMutation.isPending ? "Creating..." : "Create"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
