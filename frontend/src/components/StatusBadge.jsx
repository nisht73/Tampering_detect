import React from 'react';

const StatusBadge = ({ status }) => {
  let config = { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-500' };
  let isPulse = false;

  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      config = { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' };
      break;
    case 'PROCESSING':
      config = { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' };
      isPulse = true;
      break;
    case 'UPLOADED':
      config = { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-500' };
      break;
    case 'FAILED':
      config = { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
      break;
    case 'REVIEW_REQUIRED':
      config = { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' };
      break;
    default:
      config = { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-500' };
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`mr-1.5 h-2 w-2 rounded-full ${config.dot} ${isPulse ? 'animate-pulse' : ''}`}></span>
      {status || 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
