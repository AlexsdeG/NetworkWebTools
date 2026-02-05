import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';

interface SmtpLogProps {
  logs: string[];
  status: 'idle' | 'success' | 'error';
}

export const SmtpLog: React.FC<SmtpLogProps> = ({ logs, status }) => {
  const { t } = useTranslation();
  const safeLogs = logs || []; // Defensive check

  return (
    <Card title={t('smtp.logTitle')} className="h-full flex flex-col">
      <div className="flex-1 bg-black/50 rounded-md p-4 font-mono text-sm space-y-2 min-h-[300px] overflow-y-auto border border-slate-800">
        {safeLogs.length === 0 && (
          <div className="text-slate-600 italic">Waiting for connection test...</div>
        )}
        {safeLogs.map((log, i) => (
          <div key={i} className="text-green-400 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-600 mr-2">{'>'}</span>
            {log}
          </div>
        ))}
      </div>
      {status !== 'idle' && (
        <div className={`mt-4 p-3 rounded-md flex items-center animate-in zoom-in duration-300 ${
          status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {status === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {status === 'success' ? t('smtp.success') : t('smtp.error')}
        </div>
      )}
    </Card>
  );
};