import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface ScannerFormProps {
  target: string;
  setTarget: (value: string) => void;
  onScan: (type: string) => void;
  isLoading: boolean;
}

export const ScannerForm: React.FC<ScannerFormProps> = ({ 
  target, 
  setTarget, 
  onScan, 
  isLoading 
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input 
        label={t('scanner.targetLabel')} 
        value={target} 
        onChange={(e) => setTarget(e.target.value)}
        placeholder="192.168.1.1"
        disabled={isLoading}
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">
          {t('scanner.portsLabel')}
        </label>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => onScan('common')}
            disabled={isLoading}
            className="flex-1 border border-slate-700 hover:bg-slate-800"
          >
            {t('scanner.presets.common')}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onScan('web')}
            disabled={isLoading}
            className="flex-1 border border-slate-700 hover:bg-slate-800"
          >
            {t('scanner.presets.web')}
          </Button>
        </div>
      </div>
    </div>
  );
};