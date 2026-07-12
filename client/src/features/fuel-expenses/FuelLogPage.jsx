import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../auth/AuthProvider";
import { createFuelLogSchema, createExpenseSchema } from "../../lib/schemas";

const emptyFuel = { vehicleId: "", liters: "", cost: "", odometerReading: "", loggedDate: new Date().toISOString().split("T")[0] };
const emptyExpense = { vehicleId: "", type: "TOLL", amount: "", description: "", expenseDate: new Date().toISOString().split("T")[0] };

const expenseTypeOptions = [
  { value: "TOLL", label: "Toll" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OTHER", label: "Other" },
];

export default function FuelLogPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showFuel, setShowFuel] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [fuelForm, setFuelForm] = useState(emptyFuel);
  const [expenseForm, setExpenseForm] = useState(emptyExpense);
  const [fuelErrors, setFuelErrors] = useState({});
  const [expenseErrors, setExpenseErrors] = useState({});
  const isDriver = user?.role === "DRIVER";

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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["fuel-logs"] }); queryClient.invalidateQueries({ queryKey: ["cost-report"] }); setShowFuel(false); setFuelForm(emptyFuel); setFuelErrors({}); toast("Fuel logged", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const expenseMutation = useMutation({
    mutationFn: (body) => api.post("/expenses", body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["expenses"] }); queryClient.invalidateQueries({ queryKey: ["cost-report"] }); setShowExpense(false); setExpenseForm(emptyExpense); setExpenseErrors({}); toast("Expense recorded", "success"); },
    onError: (err) => toast(err.message, "error"),
  });

  const handleFuelSubmit = (e) => {
    e.preventDefault();
    const result = createFuelLogSchema.safeParse(fuelForm);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setFuelErrors(fieldErrors);
      return;
    }
    setFuelErrors({});
    fuelMutation.mutate(result.data);
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const result = createExpenseSchema.safeParse(expenseForm);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setExpenseErrors(fieldErrors);
      return;
    }
    setExpenseErrors({});
    expenseMutation.mutate(result.data);
  };

  const logs = fuelData?.logs || [];
  const expenses = expenseData?.expenses || [];
  const vehicleOptions = vehicles?.vehicles || [];

  const fuelColumns = [
    { key: "registrationNumber", label: "Vehicle", className: "font-semibold text-surface-900 dark:text-white", render: (r) => r.vehicle?.registrationNumber },
    { key: "liters", label: "Liters", className: "tabular-nums" },
    { key: "cost", label: "Cost", className: "tabular-nums", render: (r) => `$${r.cost}` },
    { key: "date", label: "Date", render: (r) => new Date(r.loggedDate).toLocaleDateString() },
  ];

  const expenseColumns = [
    { key: "type", label: "Type", className: "font-semibold text-surface-900 dark:text-white" },
    { key: "amount", label: "Amount", className: "tabular-nums", render: (r) => `$${r.amount}` },
    { key: "description", label: "Description", className: "font-medium" },
    { key: "date", label: "Date", render: (r) => new Date(r.expenseDate).toLocaleDateString() },
  ];

  if (fuelLoading || expenseLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-surface-200 dark:bg-surface-700 rounded-xl w-48 animate-shimmer" /><div className="h-48 bg-surface-200 dark:bg-surface-700 rounded-2xl" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Fuel & Expenses</h1>
          <p className="text-sm text-surface-500 mt-0.5">Track resource consumption and operational costs</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowFuel(true)}>+ Log Fuel</Button>
          {!isDriver && <Button variant="success" onClick={() => setShowExpense(true)}>+ Add Expense</Button>}
        </div>
      </div>

      {costData && !isDriver && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Fuel Cost</p>
            <p className="text-xl font-bold text-surface-900 dark:text-white tabular-nums">${costData.totalFuelCost?.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Maintenance Cost</p>
            <p className="text-xl font-bold text-surface-900 dark:text-white tabular-nums">${costData.totalMaintenanceCost?.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Other Expenses</p>
            <p className="text-xl font-bold text-surface-900 dark:text-white tabular-nums">${costData.totalOtherExpenses?.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Total Op. Cost</p>
            <p className="text-xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">${costData.totalOperationalCost?.toLocaleString()}</p>
          </Card>
        </div>
      )}

      <div className={isDriver ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
        <Card title="Fuel Logs" noPadding>
          <Table columns={fuelColumns} data={logs} isLoading={fuelLoading} emptyMessage="No fuel logs" />
        </Card>
        {!isDriver && (
          <Card title="Expenses" noPadding>
            <Table columns={expenseColumns} data={expenses} isLoading={expenseLoading} emptyMessage="No expenses" />
          </Card>
        )}
      </div>

      <Modal open={showFuel} onClose={() => setShowFuel(false)} title="Log Fuel">
        <form onSubmit={handleFuelSubmit} className="space-y-4">
          <Select label="Vehicle" options={vehicleOptions.map((v) => ({ value: v.id, label: v.registrationNumber }))} value={fuelForm.vehicleId} onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: e.target.value })} error={fuelErrors.vehicleId} placeholder="Select Vehicle" required />
          <Input label="Liters" type="number" step="0.1" value={fuelForm.liters} onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })} error={fuelErrors.liters} required />
          <Input label="Cost ($)" type="number" step="0.01" value={fuelForm.cost} onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })} error={fuelErrors.cost} required />
          <Input label="Odometer Reading" type="number" value={fuelForm.odometerReading} onChange={(e) => setFuelForm({ ...fuelForm, odometerReading: e.target.value })} error={fuelErrors.odometerReading} required />
          <Input label="Date" type="date" value={fuelForm.loggedDate} onChange={(e) => setFuelForm({ ...fuelForm, loggedDate: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowFuel(false)}>Cancel</Button>
            <Button type="submit" loading={fuelMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>

      {!isDriver && (
      <Modal open={showExpense} onClose={() => setShowExpense(false)} title="Add Expense">
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          <Select label="Vehicle (optional)" options={vehicleOptions.map((v) => ({ value: v.id, label: v.registrationNumber }))} value={expenseForm.vehicleId} onChange={(e) => setExpenseForm({ ...expenseForm, vehicleId: e.target.value })} error={expenseErrors.vehicleId} placeholder="Select Vehicle" />
          <Select label="Expense Type" options={expenseTypeOptions} value={expenseForm.type} onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })} error={expenseErrors.type} />
          <Input label="Amount ($)" type="number" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} error={expenseErrors.amount} required />
          <Input label="Description" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} error={expenseErrors.description} required />
          <Input label="Date" type="date" value={expenseForm.expenseDate} onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowExpense(false)}>Cancel</Button>
            <Button type="submit" loading={expenseMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
      )}
    </div>
  );
}
