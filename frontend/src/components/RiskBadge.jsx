import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

export default function RiskBadge({ level, result }) {
  const value = (level || result || 'UNKNOWN').toUpperCase();

  let variant = 'outline';
  let icon = <HelpCircle className="h-3 w-3 mr-1" />;

  if (value === 'LOW' || value === 'VERIFIED') {
    variant = 'success';
    icon = <ShieldCheck className="h-3 w-3 mr-1 text-green-600" />;
  } else if (value === 'MEDIUM' || value === 'SUSPICIOUS') {
    variant = 'warning';
    icon = <AlertTriangle className="h-3 w-3 mr-1 text-yellow-700" />;
  } else if (value === 'HIGH' || value === 'POTENTIALLY_TAMPERED') {
    variant = 'destructive';
    icon = <ShieldAlert className="h-3 w-3 mr-1 text-white" />;
  } else if (value === 'CRITICAL') {
    variant = 'destructive';
    icon = <AlertOctagon className="h-3 w-3 mr-1 text-white" />;
  }

  const formattedLabel = value.replace(/_/g, ' ');

  return (
    <Badge variant={variant} className="capitalize font-semibold text-xs inline-flex items-center px-2 py-0.5">
      {icon}
      {formattedLabel}
    </Badge>
  );
}
