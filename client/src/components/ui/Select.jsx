export default function Select({ label, error, options, placeholder, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{label}</label>}
      <select
        {...props}
        className={`w-full px-3.5 py-2.5 bg-white dark:bg-surface-800/50 border rounded-xl text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNy41IDguMzMzTDEwIDEwLjgzM0wxMi41IDguMzMzIiBzdHJva2U9IiM5NEEzQjgiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-no-repeat bg-[position:right_12px_center] pr-10 ${error ? "border-accent-rose ring-1 ring-accent-rose/20" : "border-surface-300 dark:border-surface-600"}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-accent-rose flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>{error}</p>}
    </div>
  );
}
