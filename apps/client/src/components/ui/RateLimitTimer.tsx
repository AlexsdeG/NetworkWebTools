import React from 'react';
import { useRateLimit } from '../../contexts/RateLimitContext';

export const RateLimitTimer: React.FC = () => {
  const { isRateLimited, remainingSeconds } = useRateLimit();

  if (!isRateLimited) return null;

  return (
    <div className="mx-4 mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg animate-in zoom-in slide-in-from-bottom duration-300">
      <div className="flex items-center space-x-3">
        <div className="relative h-10 w-10 flex items-center justify-center">
          <svg className="h-full w-full transform -rotate-90">
            <circle
              className="text-red-900"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="18"
              cx="20"
              cy="20"
            />
            <circle
              className="text-red-500 transition-all duration-1000 ease-linear"
              strokeWidth="4"
              strokeDasharray={113}
              strokeDashoffset={113 - (113 * (remainingSeconds % 60)) / 60}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="18"
              cx="20"
              cy="20"
            />
          </svg>
          <span className="absolute text-xs font-bold text-red-400">{remainingSeconds}</span>
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-red-400 uppercase tracking-wider">Rate Limit</div>
          <div className="text-[10px] text-red-300/70 leading-tight">Please wait before sending more requests.</div>
        </div>
      </div>
    </div>
  );
};
