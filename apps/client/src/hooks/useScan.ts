import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { toolsApi, ScanResult } from '../api/tools';

interface ScanVariables {
  target: string;
  type: string;
}

export const useScan = () => {
  const { t } = useTranslation();

  return useMutation<ScanResult[], Error, ScanVariables>({
    mutationFn: async ({ target, type }) => {
      return await toolsApi.scanPorts(target, type);
    },
    onSuccess: (data) => {
      toast.success(t('scanner.toast.success', { count: data.length }));
    },
    onError: (error) => {
      toast.error(t('common.toast.error') + ': ' + error.message);
    }
  });
};