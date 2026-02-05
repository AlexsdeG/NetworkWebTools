import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface SmtpConfig {
  host: string;
  port: string;
  user: string;
  password?: string;
  secure: boolean;
  sendEmail?: boolean;
  to?: string;
  subject?: string;
  text?: string;
}

interface SmtpFormProps {
  config: SmtpConfig;
  setConfig: React.Dispatch<React.SetStateAction<SmtpConfig>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SmtpForm: React.FC<SmtpFormProps> = ({ config, setConfig, onSubmit, isLoading }) => {
  const { t } = useTranslation();

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let secure = config.secure;
    
    // Auto-configure SSL based on common ports
    if (value === '465') {
      secure = true;
    } else if (value === '587' || value === '25') {
      secure = false;
    }

    setConfig({ ...config, port: value, secure });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label={t('smtp.host')}
        value={config.host}
        onChange={e => setConfig({ ...config, host: e.target.value })}
        required
        disabled={isLoading}
      />
      <Input
        label={t('smtp.port')}
        value={config.port}
        onChange={handlePortChange}
        required
        disabled={isLoading}
      />
      <Input
        label={t('smtp.user')}
        value={config.user}
        onChange={e => setConfig({ ...config, user: e.target.value })}
        placeholder="user@example.com"
        disabled={isLoading}
      />
      <Input
        label={t('smtp.password')}
        type="password"
        value={config.password}
        onChange={e => setConfig({ ...config, password: e.target.value })}
        disabled={isLoading}
      />
      
      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="secure"
          className="rounded border-slate-700 bg-surface text-primary focus:ring-primary"
          checked={config.secure}
          onChange={e => setConfig({ ...config, secure: e.target.checked })}
          disabled={isLoading}
        />
        <label htmlFor="secure" className="text-sm text-slate-300">
          {t('smtp.secure')}
        </label>
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sendEmail"
            className="rounded border-slate-700 bg-surface text-primary focus:ring-primary"
            checked={!!config.sendEmail}
            onChange={e => setConfig({ ...config, sendEmail: e.target.checked })}
            disabled={isLoading}
          />
          <label htmlFor="sendEmail" className="text-sm font-medium text-white">
            Send Test Email
          </label>
        </div>

        {config.sendEmail && (
          <div className="space-y-4 pl-4 border-l-2 border-slate-800 animate-in slide-in-from-top-2 duration-200">
            <Input
              label="Recipient"
              value={config.to || ''}
              onChange={e => setConfig({ ...config, to: e.target.value })}
              placeholder="recipient@example.com"
              disabled={isLoading}
            />
            <Input
              label="Subject"
              value={config.subject || ''}
              onChange={e => setConfig({ ...config, subject: e.target.value })}
              placeholder="Test Email Subject"
              disabled={isLoading}
            />
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
               <textarea 
                  className="w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  rows={3}
                  value={config.text || ''}
                  onChange={e => setConfig({ ...config, text: e.target.value })}
                  disabled={isLoading}
               />
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
        <Play className="h-4 w-4 mr-2" />
        {t('smtp.testBtn')}
      </Button>
    </form>
  );
};