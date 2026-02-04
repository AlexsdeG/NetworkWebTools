import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export const Toaster: React.FC = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: 'bg-surface border border-slate-700 text-slate-200',
        descriptionClassName: 'text-slate-400',
      }}
    />
  );
};