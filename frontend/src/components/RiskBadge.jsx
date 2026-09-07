import React from 'react';

const RiskBadge = ({ level }) => {
  let config = { bg: 'bg-slate-100', text: 'text-slate-800' };

  switch (level?.toUpperCase()) {
    case 'LOW':
      config = { bg: 'bg-green-100', text: 'text-green-800' };
      break;
    case 'MEDIUM':
      config = { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      break;
    case 'HIGH':
      config = { bg: 'bg-orange-100', text: 'text-orange-800' };
      break;
    case 'CRITICAL':
      config = { bg: 'bg-red-100', text: 'text-red-800' };
      break;
    default:
      config = { bg: 'bg-slate-100', text: 'text-slate-800' };
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {level || 'UNKNOWN'}
    </span>
  );
};

export default RiskBadge;
