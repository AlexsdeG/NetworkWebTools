import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { toolsApi, SmtpResponse } from '../api/tools';

interface SmtpVariables {
  host: string;
  port: string;
  user?: string;
  password?: string;
  secure: boolean;
}

export const useSmtp = () => {
  const { t } = useTranslation();

  return useMutation<SmtpResponse, Error, SmtpVariables>({
    mutationFn: async (config) => {
      return await toolsApi.testSmtp(config);
    },
    onSuccess: () => {
      toast.success(t('smtp.toast.success'));
    },
    onError: (error) => {
      toast.error(t('smtp.toast.error') + ': ' + error.message);
    }
  });
};