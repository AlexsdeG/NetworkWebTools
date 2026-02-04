import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/ui/Badge';
import { ScanResult } from '../../api/tools';

interface ResultsGridProps {
  results: ScanResult[];
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ results }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {results.map((result) => (
        <div 
          key={result.port}
          className={`p-4 rounded-lg border ${
            result.status === 'open' 
              ? 'bg-green-500/5 border-green-500/20' 
              : 'bg-surface border-slate-700 opacity-50'
          } flex flex-col items-center justify-center transition-all animate-in fade-in duration-500`}
        >
          <span className="text-lg font-mono font-bold text-white">{result.port}</span>
          <Badge variant={result.status === 'open' ? 'success' : 'neutral'} className="mt-2">
            {result.status === 'open' ? t('scanner.status.open') : t('scanner.status.closed')}
          </Badge>
        </div>
      ))}
    </div>
  );
};