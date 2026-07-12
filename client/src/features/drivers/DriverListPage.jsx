import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";

const emptyForm = { userId: "", licenseNumber: "", licenseCategory: "CLASS_C", licenseExpiryDate: "", contactNumber: "", safetyScore: "5.0" };

export default function DriverListPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => api.get("/drivers?limit=50"),
  });

  const createMutation = useMutation({
    mutationFn: (body) => api.post("/drivers", body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["drivers"] }); setShowForm(false); setForm(emptyForm); setError(""); },
    onError: (err) => setError(err.message),
  });

  const suspendMutation = useMutation({
    mutationFn: (id) => api.patch(`/drivers/${id}/suspend`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drivers"] }),
  });

  const handleSubmit = (e) => { e.preventDefault(); createMutation.mutate(form); };

  const drivers = data?.drivers || [];

  if (isLoading) return <div className="animate-pulse space-y-2"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" /><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Drivers</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">+ Add Driver</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Name</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">License</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Expiry</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Score</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Status</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {drivers.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No drivers found</td></tr>}
            {drivers.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{d.user?.name}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{d.licenseNumber}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{new Date(d.licenseExpiryDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{d.safetyScore}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3">
                  {d.status !== "SUSPENDED" && <button onClick={() => suspendMutation.mutate(d.id)} className="text-xs text-red-600 hover:text-red-800 dark:text-red-400">Suspend</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Driver">
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="number" placeholder="User ID" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input placeholder="License Number" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <select value={form.licenseCategory} onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="CLASS_A">Class A</option>
            <option value="CLASS_B">Class B</option>
            <option value="CLASS_C">Class C</option>
            <option value="CLASS_D">Class D</option>
          </select>
          <input type="date" placeholder="License Expiry Date" value={form.licenseExpiryDate} onChange={(e) => setForm({ ...form, licenseExpiryDate: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="number" step="0.1" placeholder="Safety Score (0-10)" value={form.safetyScore} onChange={(e) => setForm({ ...form, safetyScore: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded dark:border-gray-600 dark:text-gray-300">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{createMutation.isPending ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
