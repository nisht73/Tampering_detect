import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function StatCard({ label, value, icon: Icon, color = 'blue', description }) {
  const colorStyles = {
    blue: { bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300', iconBg: 'bg-blue-100 text-blue-600' },
    green: { bg: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300', iconBg: 'bg-green-100 text-green-600' },
    yellow: { bg: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300', iconBg: 'bg-yellow-100 text-yellow-600' },
    red: { bg: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300', iconBg: 'bg-red-100 text-red-600' },
    purple: { bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300', iconBg: 'bg-purple-100 text-purple-600' },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between space-x-2">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value ?? 0}</p>
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
          </div>
          {Icon && (
            <div className={`p-3 rounded-xl ${style.iconBg}`}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
