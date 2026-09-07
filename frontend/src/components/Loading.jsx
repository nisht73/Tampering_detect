import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ fullPage = false, text = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
      {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      {content}
    </div>
  );
};

export default Loading;
