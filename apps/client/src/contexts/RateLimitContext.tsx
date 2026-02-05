import React, { createContext, useContext, useState, useEffect } from 'react';

interface RateLimitContextType {
  isRateLimited: boolean;
  blockedUntil: number | null;
  remainingSeconds: number;
}

const RateLimitContext = createContext<RateLimitContextType>({
  isRateLimited: false,
  blockedUntil: null,
  remainingSeconds: 0,
});

export const useRateLimit = () => useContext(RateLimitContext);

export const RateLimitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    const handleRateLimit = (event: Event) => {
      const customEvent = event as CustomEvent<{ resetTime: number }>;
      const resetTime = customEvent.detail.resetTime;
      // Ensure resetTime is in format we expect (timestamp in ms)
      const now = Date.now();
      if (resetTime > now) {
        setBlockedUntil(resetTime);
      }
    };

    window.addEventListener('api-rate-limit', handleRateLimit);
    return () => window.removeEventListener('api-rate-limit', handleRateLimit);
  }, []);

  useEffect(() => {
    if (!blockedUntil) {
      setRemainingSeconds(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.ceil((blockedUntil - now) / 1000);
      
      if (diff <= 0) {
        setBlockedUntil(null);
        setRemainingSeconds(0);
      } else {
        setRemainingSeconds(diff);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [blockedUntil]);

  const value = {
    isRateLimited: !!blockedUntil,
    blockedUntil,
    remainingSeconds
  };

  return (
    <RateLimitContext.Provider value={value}>
      {children}
    </RateLimitContext.Provider>
  );
};
