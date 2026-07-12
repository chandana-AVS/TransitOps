export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{label}</label>}
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 bg-white dark:bg-surface-800/50 border rounded-xl text-sm text-surface-800 dark:text-surface-200 placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200 ${error ? "border-accent-rose ring-1 ring-accent-rose/20" : "border-surface-300 dark:border-surface-600"}`}
      />
      {error && <p className="mt-1.5 text-xs text-accent-rose flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>{error}</p>}
    </div>
  );
}
