import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { SmtpForm } from '../features/smtp/SmtpForm';
import { SmtpLog } from '../features/smtp/SmtpLog';
import { useSmtp } from '../hooks/useSmtp';

export const Smtp: React.FC = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    host: 'smtp.gmail.com',
    port: '587',
    user: '',
    password: '',
    secure: false,
    sendEmail: false,
    to: '',
    subject: '',
    text: ''
  });
  
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { mutate, isPending } = useSmtp();

  // Simulate logs appearing like a terminal during connection
  useEffect(() => {
    let timeoutIds: ReturnType<typeof setTimeout>[] = [];

    if (isPending) {
      setLogs([]); // Reset logs
      const steps = [
        t('smtp.steps.resolving'),
        t('smtp.steps.connecting'),
        t('smtp.steps.handshake'),
        t('smtp.steps.authenticating')
      ];

      // Add "fake" logs progressively
      steps.forEach((step, index) => {
        const id = setTimeout(() => {
          setLogs(prev => [...prev, step]);
        }, index * 400 + 100);
        timeoutIds.push(id);
      });
    }

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [isPending, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLogs([]);
    setStatus('idle');
    
    mutate(config, {
      onSuccess: (data) => {
        setLogs(data.logs || []); // Replace simulated logs with actual server logs
        setStatus('success');
      },
      onError: (error) => {
        setLogs(prev => [...prev, `Error: ${(error as Error).message}`]);
        setStatus('error');
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <Mail className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{t('smtp.title')}</h1>
          <p className="text-slate-400">{t('dashboard.cards.smtp.desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title={t('smtp.config')}>
            <SmtpForm 
              config={config} 
              setConfig={setConfig} 
              onSubmit={handleSubmit} 
              isLoading={isPending} 
            />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <SmtpLog logs={logs} status={status} />
        </div>
      </div>
    </div>
  );
};