import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ScannerForm } from '../features/scanner/ScannerForm';
import { ResultsGrid } from '../features/scanner/ResultsGrid';
import { PortKnowledge } from '../features/scanner/PortKnowledge';
import { useScan } from '../hooks/useScan';

export const Scanner: React.FC = () => {
  const { t } = useTranslation();
  const [target, setTarget] = useState('127.0.0.1');
  const { mutate, isPending, data } = useScan();

  const handleScan = (ports: string) => {
    mutate({ target, type: ports });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Shield className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{t('scanner.title')}</h1>
          <p className="text-slate-400">{t('dashboard.cards.scan.desc')}</p>
        </div>
      </div>

      <Card>
        <ScannerForm 
          target={target} 
          setTarget={setTarget} 
          onScan={handleScan} 
          isLoading={isPending} 
        />
      </Card>

      {isPending && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-400">{t('scanner.scanning')}</p>
        </div>
      )}

      {data && <ResultsGrid results={data} />}
      <PortKnowledge />
    </div>
  );
};