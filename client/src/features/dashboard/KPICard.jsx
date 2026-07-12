const iconMap = {
  truck: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-4-4v4M4 11h16M4 15h16M4 19h16" /></svg>,
  check: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  wrench: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  route: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
  dollar: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  users: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

const colorMap = {
  blue:   { gradient: "from-primary-500 to-primary-600", shadow: "shadow-primary-500/20", bg: "bg-primary-50 dark:bg-primary-900/20", text: "text-primary-700 dark:text-primary-300", icon: "text-primary-500" },
  green:  { gradient: "from-accent-emerald to-emerald-600", shadow: "shadow-accent-emerald/20", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-300", icon: "text-accent-emerald" },
  yellow: { gradient: "from-accent-amber to-amber-600", shadow: "shadow-accent-amber/20", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-300", icon: "text-accent-amber" },
  red:    { gradient: "from-accent-rose to-rose-600", shadow: "shadow-accent-rose/20", bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-700 dark:text-rose-300", icon: "text-accent-rose" },
  gray:   { gradient: "from-surface-400 to-surface-500", shadow: "shadow-surface-400/20", bg: "bg-surface-100 dark:bg-surface-700/40", text: "text-surface-700 dark:text-surface-300", icon: "text-surface-500" },
};

export default function KPICard({ label, value, icon = "truck", color = "blue" }) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className="bg-white dark:bg-surface-800/80 rounded-2xl border border-surface-200/60 dark:border-surface-700/50 p-4 hover:shadow-md transition-all duration-300 group animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">{label}</p>
          <p className={`text-2xl font-bold ${c.text} animate-count-up tabular-nums`}>{value ?? "—"}</p>
        </div>
        <div className={`${c.bg} p-2.5 rounded-xl ${c.icon} group-hover:scale-110 transition-transform duration-300`}>
          {iconMap[icon] || iconMap.truck}
        </div>
      </div>
    </div>
  );
}
