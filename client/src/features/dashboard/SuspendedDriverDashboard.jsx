import ChatPage from "../chat/ChatPage";

export default function SuspendedDriverDashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      
      {/* Alert Banner */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-accent-rose/10 border border-accent-rose/25 p-6 rounded-2xl shadow-sm text-center md:text-left">
        <div className="w-12 h-12 rounded-xl bg-accent-rose/20 flex items-center justify-center text-accent-rose flex-shrink-0 animate-pulse">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-accent-rose">Operational Account Suspended</h2>
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Your driver account status is currently marked as <span className="font-bold">SUSPENDED</span>. You cannot view active trip dispatches or log odometer adjustments until unsuspended.
          </p>
          <p className="text-xs text-surface-500 font-medium">
            Please contact your Fleet Manager or Safety Officer to resolve any compliance issues (e.g. expired driving licenses).
          </p>
        </div>
      </div>

      {/* Embed Support Chat Directly */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider pl-1">Direct Reinstatement Channel</h3>
        <ChatPage />
      </div>

    </div>
  );
}
