import Button from "./Button";

export default function ErrorState({ message = "Something went wrong", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <div className="text-4xl mb-3">!</div>
      <p className="text-sm mb-4">{message}</p>
      {onRetry && <Button variant="ghost" size="sm" onClick={onRetry}>Try Again</Button>}
    </div>
  );
}
