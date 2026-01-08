// components/ui/ErrorPage.tsx
import { XCircleIcon } from '@heroicons/react/24/outline';

type ErrorPageProps = {
  error: string;
  onRetry?: () => void;
};

export function ErrorPage({ error, onRetry }: ErrorPageProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 px-4 text-center">
        {/* Icon */}
        <div className="rounded-full bg-red-100 p-3">
          <XCircleIcon className="h-10 w-10 text-red-600" />
        </div>

        {/* Title */}
        <div className="text-lg font-semibold text-gray-900">Something went wrong</div>

        {/* Error message box */}
        <div className="w-full max-w-lg rounded-lg border border-red-200 bg-red-50 p-4">
          <pre className="text-left font-mono text-sm break-words whitespace-pre-wrap text-red-700">
            {error}
          </pre>
        </div>

        {/* Retry button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white
              hover:bg-red-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
