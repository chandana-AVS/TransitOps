export default function Card({ children, title, subtitle, actions, className = "", noPadding = false }) {
  return (
    <div className={`bg-white dark:bg-surface-800/80 rounded-2xl shadow-sm border border-surface-200/60 dark:border-surface-700/50 hover:shadow-md transition-shadow duration-300 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 dark:border-surface-700/50">
          <div>
            {title && <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">{title}</h3>}
            {subtitle && <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  );
}
