import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { toolsApi, SmtpResponse, SmtpConfig } from '../api/tools';

interface SmtpFormVariables {
  host: string;
  port: string;
  user?: string;
  password?: string;
  secure: boolean;
}

export const useSmtp = () => {
  const { t } = useTranslation();

  return useMutation<SmtpResponse, Error, SmtpFormVariables>({
    mutationFn: async (formData) => {
      // Transform form data to API format
      const config: SmtpConfig = {
        host: formData.host,
        port: parseInt(formData.port, 10) || 587,
        user: formData.user || '',
        pass: formData.password || '',
        secure: formData.secure
      };
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