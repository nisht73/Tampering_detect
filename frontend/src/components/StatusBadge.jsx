import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

export default function StatusBadge({ status }) {
  let variant = 'default';
  let icon = null;
  let label = status || 'UNKNOWN';

  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      variant = 'success';
      icon = <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />;
      break;
    case 'PROCESSING':
      variant = 'info';
      icon = <RefreshCw className="h-3 w-3 mr-1 text-blue-600 animate-spin" />;
      break;
    case 'QUEUED':
    case 'UPLOADED':
      variant = 'secondary';
      icon = <Clock className="h-3 w-3 mr-1 text-slate-500" />;
      break;
    case 'FAILED':
      variant = 'destructive';
      icon = <XCircle className="h-3 w-3 mr-1 text-white" />;
      break;
    case 'REVIEW_REQUIRED':
      variant = 'warning';
      icon = <AlertTriangle className="h-3 w-3 mr-1 text-yellow-700" />;
      break;
    default:
      variant = 'outline';
  }

  return (
    <Badge variant={variant} className="capitalize font-medium text-xs inline-flex items-center px-2 py-0.5">
      {icon}
      {label}
    </Badge>
  );
}
