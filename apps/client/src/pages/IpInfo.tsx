import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useIpInfo } from '../hooks/useIpInfo';
import { IpDetails } from '../features/ip/IpDetails';
import { Skeleton } from '../components/ui/Skeleton';

export const IpInfo: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useIpInfo();

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-500/10 text-red-400 text-center border border-red-500/20">
        {t('common.error')}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-green-500/10 rounded-lg">
          <Globe className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{t('ip.title')}</h1>
          <p className="text-slate-400">{t('dashboard.cards.ip.desc')}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-full min-h-[300px] w-full" />
          </div>
        </div>
      ) : (
        data && <IpDetails data={data} />
      )}
    </div>
  );
};