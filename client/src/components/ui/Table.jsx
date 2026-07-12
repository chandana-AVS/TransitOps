export default function Table({ columns, data, onRowClick, isLoading, emptyMessage = "No data found" }) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-surface-800/80 rounded-2xl border border-surface-200/60 dark:border-surface-700/50 overflow-hidden">
        <div className="p-5 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center" style={{ opacity: 1 - i * 0.15 }}>
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded-lg animate-shimmer flex-1" />
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded-lg animate-shimmer w-24" />
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded-lg animate-shimmer w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800/80 rounded-2xl border border-surface-200/60 dark:border-surface-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-100 dark:border-surface-700/50">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-surface-300 dark:text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    <p className="text-sm text-surface-400 dark:text-surface-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-surface-50 dark:border-surface-700/30 last:border-0 transition-colors duration-150 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 ${onRowClick ? "cursor-pointer" : ""}`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3.5 text-surface-700 dark:text-surface-300 ${col.className || ""}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
