import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";

const emptyForm = { registrationNumber: "", name: "", model: "", type: "VAN", maxLoadCapacity: "", acquisitionCost: "", region: "" };

export default function VehicleListPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => api.get("/vehicles?limit=50"),
  });

  const createMutation = useMutation({
    mutationFn: (body) => api.post("/vehicles", body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["vehicles"] }); setShowForm(false); setForm(emptyForm); setError(""); },
    onError: (err) => setError(err.message),
  });

  const retireMutation = useMutation({
    mutationFn: (id) => api.patch(`/vehicles/${id}/retire`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
  });

  const handleSubmit = (e) => { e.preventDefault(); createMutation.mutate(form); };

  const vehicles = data?.vehicles || [];

  if (isLoading) return <div className="animate-pulse space-y-2"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" /><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicles</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">+ Add Vehicle</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Reg #</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Name</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Type</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Capacity</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Status</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {vehicles.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No vehicles found</td></tr>}
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{v.registrationNumber}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{v.name}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{v.type}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{v.maxLoadCapacity} kg</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-4 py-3">
                  {v.status === "AVAILABLE" && <button onClick={() => retireMutation.mutate(v.id)} className="text-xs text-red-600 hover:text-red-800 dark:text-red-400">Retire</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Vehicle">
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Registration Number" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input placeholder="Vehicle Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="VAN">Van</option>
            <option value="TRUCK">Truck</option>
            <option value="BUS">Bus</option>
            <option value="CAR">Car</option>
          </select>
          <input type="number" placeholder="Max Load Capacity (kg)" value={form.maxLoadCapacity} onChange={(e) => setForm({ ...form, maxLoadCapacity: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="number" placeholder="Acquisition Cost ($)" value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input placeholder="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded dark:border-gray-600 dark:text-gray-300">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{createMutation.isPending ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
