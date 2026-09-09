import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'Unable to load data. Please check your connection and try again.',
  onRetry,
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-3">
      <div className="p-3 bg-red-100 rounded-full text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-red-900">{title}</h3>
      <p className="text-sm text-red-700 max-w-md">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2 gap-2 border-red-300 hover:bg-red-100 text-red-800">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      )}
    </div>
  );
}
