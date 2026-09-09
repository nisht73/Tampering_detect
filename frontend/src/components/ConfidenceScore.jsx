import React from 'react';

export default function ConfidenceScore({ score = 0, label = 'Confidence' }) {
  const percentage = Math.round((score > 1 ? score : score * 100));
  
  let color = 'text-emerald-600 stroke-emerald-500';
  if (percentage < 60) color = 'text-red-600 stroke-red-500';
  else if (percentage < 85) color = 'text-amber-600 stroke-amber-500';

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative h-24 w-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 84 84">
          <circle
            cx="42"
            cy="42"
            r={radius}
            stroke="currentColor"
            strokeWidth="7"
            className="text-slate-100 fill-none"
          />
          <circle
            cx="42"
            cy="42"
            r={radius}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`fill-none transition-all duration-1000 ${color}`}
          />
        </svg>
        <span className="absolute text-xl font-bold text-slate-900">{percentage}%</span>
      </div>
      <span className="text-xs font-medium text-slate-500 mt-2">{label}</span>
    </div>
  );
}
