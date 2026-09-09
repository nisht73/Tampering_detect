import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const STAGES = [
  { key: 'uploaded', label: 'Document uploaded' },
  { key: 'detection', label: 'Document detection' },
  { key: 'ocr', label: 'OCR analysis' },
  { key: 'tampering', label: 'Tampering analysis' },
  { key: 'report', label: 'Generating report' },
];

export default function ScreeningProgress({ status = 'PROCESSING', currentStageIndex = 3 }) {
  if (status === 'COMPLETED') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
        <h3 className="font-semibold text-emerald-900">Screening Complete</h3>
        <p className="text-xs text-emerald-700 mt-1">All AI analysis stages completed successfully.</p>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
        <h3 className="font-semibold text-red-900">Screening Failed</h3>
        <p className="text-xs text-red-700 mt-1">An error occurred during screening processing.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Processing Pipeline</h3>
        <span className="text-xs font-medium text-blue-600 flex items-center gap-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Analyzing document...
        </span>
      </div>
      <div className="space-y-3">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          return (
            <div key={stage.key} className="flex items-center space-x-3 text-sm">
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300 shrink-0" />
              )}
              <span className={`font-medium ${isDone ? 'text-slate-700' : isCurrent ? 'text-blue-700 font-semibold' : 'text-slate-400'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
