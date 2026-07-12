import Button from "./Button";

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in" style={{ animationDuration: "0.15s" }} />
      <div
        className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in border border-surface-200/60 dark:border-surface-700/50 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-rose/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-6 pl-[52px]">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
