const statusConfig = {
  AVAILABLE:   { bg: "bg-accent-emerald/10", text: "text-accent-emerald", dot: "bg-accent-emerald" },
  ON_TRIP:     { bg: "bg-primary-500/10", text: "text-primary-600 dark:text-primary-400", dot: "bg-primary-500" },
  IN_SHOP:     { bg: "bg-accent-amber/10", text: "text-accent-amber", dot: "bg-accent-amber" },
  RETIRED:     { bg: "bg-surface-200 dark:bg-surface-700", text: "text-surface-500 dark:text-surface-400", dot: "bg-surface-400" },
  DRAFT:       { bg: "bg-surface-200/60 dark:bg-surface-700/60", text: "text-surface-600 dark:text-surface-400", dot: "bg-surface-400" },
  DISPATCHED:  { bg: "bg-primary-500/10", text: "text-primary-600 dark:text-primary-400", dot: "bg-primary-500" },
  COMPLETED:   { bg: "bg-accent-emerald/10", text: "text-accent-emerald", dot: "bg-accent-emerald" },
  CANCELLED:   { bg: "bg-accent-rose/10", text: "text-accent-rose", dot: "bg-accent-rose" },
  OPEN:        { bg: "bg-accent-amber/10", text: "text-accent-amber", dot: "bg-accent-amber" },
  CLOSED:      { bg: "bg-accent-emerald/10", text: "text-accent-emerald", dot: "bg-accent-emerald" },
  OFF_DUTY:    { bg: "bg-surface-200 dark:bg-surface-700", text: "text-surface-500 dark:text-surface-400", dot: "bg-surface-400" },
  SUSPENDED:   { bg: "bg-accent-rose/10", text: "text-accent-rose", dot: "bg-accent-rose" },
};

const defaultConfig = { bg: "bg-surface-200", text: "text-surface-600", dot: "bg-surface-400" };

export default function StatusBadge({ status }) {
  const c = statusConfig[status] || defaultConfig;
  const label = status?.replace(/_/g, " ") || "UNKNOWN";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg ${c.bg} ${c.text} uppercase tracking-wider`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label}
    </span>
  );
}
