import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import Modal from "../../components/ui/Modal";

const emptyFuel = { vehicleId: "", liters: "", cost: "", odometerReading: "", loggedDate: new Date().toISOString().split("T")[0] };
const emptyExpense = { vehicleId: "", type: "TOLL", amount: "", description: "", expenseDate: new Date().toISOString().split("T")[0] };

export default function FuelLogPage() {
  const queryClient = useQueryClient();
  const [showFuel, setShowFuel] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [fuelForm, setFuelForm] = useState(emptyFuel);
  const [expenseForm, setExpenseForm] = useState(emptyExpense);
  const [error, setError] = useState("");

  const { data: fuelData, isLoading: fuelLoading } = useQuery({
    queryKey: ["fuel-logs"],
    queryFn: () => api.get("/fuel-logs?limit=50"),
  });

  const { data: expenseData, isLoading: expenseLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => api.get("/expenses?limit=50"),
  });

  const { data: vehicles } = useQuery({
    queryKey: ["vehicles-fuel"],
    queryFn: () => api.get("/vehicles?limit=100"),
  });

  const { data: costData } = useQuery({
    queryKey: ["cost-report"],
    queryFn: () => api.get("/reports/cost"),
  });

  const fuelMutation = useMutation({
    mutationFn: (body) => api.post("/fuel-logs", body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["fuel-logs"] }); queryClient.invalidateQueries({ queryKey: ["cost-report"] }); setShowFuel(false); setFuelForm(emptyFuel); setError(""); },
    onError: (err) => setError(err.message),
  });

  const expenseMutation = useMutation({
    mutationFn: (body) => api.post("/expenses", body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["expenses"] }); queryClient.invalidateQueries({ queryKey: ["cost-report"] }); setShowExpense(false); setExpenseForm(emptyExpense); setError(""); },
    onError: (err) => setError(err.message),
  });

  const logs = fuelData?.logs || [];
  const expenses = expenseData?.expenses || [];
  const vehicleOptions = vehicles?.vehicles || [];

  if (fuelLoading && expenseLoading) return <div className="animate-pulse space-y-2"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" /><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fuel & Expenses</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowFuel(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">+ Log Fuel</button>
          <button onClick={() => setShowExpense(true)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">+ Add Expense</button>
        </div>
      </div>

      {costData && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-xs text-gray-500 uppercase">Fuel Cost</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${costData.totalFuelCost}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-xs text-gray-500 uppercase">Maintenance Cost</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${costData.totalMaintenanceCost}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-xs text-gray-500 uppercase">Other Expenses</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${costData.totalOtherExpenses}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-xs text-gray-500 uppercase">Total Operational Cost</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${costData.totalOperationalCost}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <h3 className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">Fuel Logs</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300">Vehicle</th>
                <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300">Liters</th>
                <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300">Cost</th>
                <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {logs.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-500">No fuel logs</td></tr>}
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{l.vehicle?.registrationNumber}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{l.liters}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">${l.cost}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{new Date(l.loggedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <h3 className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">Expenses</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300">Type</th>
                <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300">Amount</th>
                <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300">Description</th>
                <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {expenses.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-500">No expenses</td></tr>}
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{e.type}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">${e.amount}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{e.description}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{new Date(e.expenseDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showFuel} onClose={() => setShowFuel(false)} title="Log Fuel">
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-3">{error}</div>}
        <form onSubmit={(e) => { e.preventDefault(); fuelMutation.mutate(fuelForm); }} className="space-y-3">
          <select value={fuelForm.vehicleId} onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            <option value="">Select Vehicle</option>
            {vehicleOptions.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
          </select>
          <input type="number" step="0.1" placeholder="Liters" value={fuelForm.liters} onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="number" step="0.01" placeholder="Cost ($)" value={fuelForm.cost} onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="number" placeholder="Odometer Reading" value={fuelForm.odometerReading} onChange={(e) => setFuelForm({ ...fuelForm, odometerReading: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="date" value={fuelForm.loggedDate} onChange={(e) => setFuelForm({ ...fuelForm, loggedDate: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowFuel(false)} className="px-4 py-2 text-sm border rounded dark:border-gray-600 dark:text-gray-300">Cancel</button>
            <button type="submit" disabled={fuelMutation.isPending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{fuelMutation.isPending ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <Modal open={showExpense} onClose={() => setShowExpense(false)} title="Add Expense">
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-3">{error}</div>}
        <form onSubmit={(e) => { e.preventDefault(); expenseMutation.mutate(expenseForm); }} className="space-y-3">
          <select value={expenseForm.vehicleId} onChange={(e) => setExpenseForm({ ...expenseForm, vehicleId: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Select Vehicle (optional)</option>
            {vehicleOptions.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
          </select>
          <select value={expenseForm.type} onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="TOLL">Toll</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OTHER">Other</option>
          </select>
          <input type="number" step="0.01" placeholder="Amount ($)" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input placeholder="Description" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="date" value={expenseForm.expenseDate} onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })} className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowExpense(false)} className="px-4 py-2 text-sm border rounded dark:border-gray-600 dark:text-gray-300">Cancel</button>
            <button type="submit" disabled={expenseMutation.isPending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{expenseMutation.isPending ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
