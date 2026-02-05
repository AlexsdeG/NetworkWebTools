import React, { useState } from 'react';
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
  const [specificPort, setSpecificPort] = useState('');

  const handleSpecificScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (specificPort) {
      onScan(specificPort);
    }
  };

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
        <div className="space-y-3">
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
          
          <form onSubmit={handleSpecificScan} className="flex space-x-2 items-end">
            <div className="flex-1">
              <Input
                value={specificPort}
                onChange={(e) => setSpecificPort(e.target.value)}
                placeholder="22, 80, 8080"
                disabled={isLoading}
                label="Specific Port"
              />
            </div>
            <Button 
              type="submit"
              disabled={isLoading || !specificPort}
              className="h-[42px] mb-[2px]"
            >
              Scan
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};