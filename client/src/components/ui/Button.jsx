export default function Button({ children, variant = "primary", size = "md", loading, disabled, onClick, type = "button", className = "" }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-900 active:scale-[0.97]";
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 focus:ring-primary-500 shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30",
    danger: "bg-gradient-to-r from-accent-rose to-rose-500 text-white hover:from-rose-500 hover:to-rose-400 focus:ring-accent-rose shadow-md shadow-accent-rose/20 hover:shadow-lg hover:shadow-accent-rose/30",
    ghost: "text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 focus:ring-surface-400",
    success: "bg-gradient-to-r from-accent-emerald to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 focus:ring-accent-emerald shadow-md shadow-accent-emerald/20 hover:shadow-lg hover:shadow-accent-emerald/30",
    secondary: "bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700 focus:ring-surface-400 border border-surface-200 dark:border-surface-700",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}>
      {loading && <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      {children}
    </button>
  );
}
