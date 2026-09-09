import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are no items matching your criteria at this time.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-3">
      <div className="p-4 bg-slate-100 rounded-full text-slate-400">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
