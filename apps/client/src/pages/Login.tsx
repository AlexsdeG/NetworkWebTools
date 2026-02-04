import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LoginForm } from '../features/auth/LoginForm';

export const Login: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('app.title')}</h1>
          <p className="mt-2 text-slate-400">{t('app.description')}</p>
        </div>

        <Card>
          <div className="mb-6 text-center">
            <h2 className="text-lg font-medium text-white">{t('auth.loginTitle')}</h2>
            <p className="text-sm text-slate-500">{t('auth.instruction')}</p>
          </div>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
};