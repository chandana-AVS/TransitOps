import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";

const emptyForm = { vehicleId: "", description: "", cost: "" };

export default function MaintenanceListPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["maintenance"] }); queryClient.invalidateQueries({ queryKey: ["vehicles"] }); setShowForm(false); setForm(emptyForm); setError(""); },
    onError: (err) => setError(err.message),
  });

  const closeMutation = useMutation({
    mutationFn: (id) => api.post(`/maintenance/${id}/close`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["maintenance"] }); queryClient.invalidateQueries({ queryKey: ["vehicles"] }); },
  });

  const handleSubmit = (e) => { e.preventDefault(); createMutation.mutate(form); };

  const records = data?.records || [];
  const availableVehicles = vehiclesData?.vehicles?.filter((v) => v.status === "AVAILABLE" || v.status === "IN_SHOP") || [];

  if (isLoading) return <div className="animate-pulse space-y-2"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" /><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">+ New Record</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Vehicle</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Description</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Cost</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Status</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {records.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No maintenance records</td></tr>}
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{r.vehicle?.registrationNumber}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.description}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">${r.cost}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  {r.status === "OPEN" && <button onClick={() => closeMutation.mutate(r.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Close</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Maintenance Record">
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            <option value="">Select Vehicle</option>
            {availableVehicles.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber} — {v.name} ({v.status})</option>)}
          </select>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} required />
          <input type="number" step="0.01" placeholder="Cost ($)" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded dark:border-gray-600 dark:text-gray-300">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{createMutation.isPending ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
