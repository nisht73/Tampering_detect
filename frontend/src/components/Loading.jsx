import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading({ fullPage = false, text = 'Loading...', variant = 'spinner' }) {
  if (variant === 'skeleton') {
    return (
      <div className="space-y-4 w-full p-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
      {text && <p className="text-sm font-medium text-slate-600">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[200px] flex items-center justify-center">
      {content}
    </div>
  );
}
