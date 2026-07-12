export default function EmptyState({ message, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
      {icon && <div className="text-4xl mb-3">{icon}</div>}
      <p className="text-sm">{message}</p>
    </div>
  );
}
