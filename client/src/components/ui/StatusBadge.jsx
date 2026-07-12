const statusColors = {
  AVAILABLE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  ON_TRIP: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  IN_SHOP: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  RETIRED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  DISPATCHED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  OPEN: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  CLOSED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  OFF_DUTY: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function StatusBadge({ status }) {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
  return <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colorClass}`}>{status}</span>;
}
