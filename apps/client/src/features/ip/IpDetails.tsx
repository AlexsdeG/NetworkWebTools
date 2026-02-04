import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Server } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { IpMap } from './IpMap';
import { IpInfo } from '../../api/tools';

interface IpDetailsProps {
  data: IpInfo;
}

export const IpDetails: React.FC<IpDetailsProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <Card className="text-center py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
        <div className="relative z-10">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
            {t('ip.fields.ip')}
          </h2>
          <div className="text-5xl font-mono font-bold text-white tracking-tight mb-4">
            {data.ip}
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
            {data.type}
          </span>
        </div>
      </Card>

      {/* Details Grid & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="transition-colors hover:bg-slate-800/50">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                <MapPin className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-white">{t('ip.fields.location')}</h3>
            </div>
            <p className="text-xl text-slate-200 pl-12">{data.location}</p>
            <div className="mt-2 pl-12 text-sm text-slate-500 font-mono">
              {data.lat.toFixed(4)}, {data.lon.toFixed(4)}
            </div>
          </Card>

          <Card className="transition-colors hover:bg-slate-800/50">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg mr-3">
                <Server className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-white">{t('ip.fields.isp')}</h3>
            </div>
            <p className="text-xl text-slate-200 pl-12">{data.isp}</p>
          </Card>

          <Card className="transition-colors hover:bg-slate-800/50">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-white">{t('ip.fields.timezone')}</h3>
            </div>
            <p className="text-xl text-slate-200 pl-12">{data.timezone}</p>
          </Card>
        </div>

        <div className="min-h-[300px] lg:min-h-0">
          <IpMap lat={data.lat} lon={data.lon} />
        </div>
      </div>
    </div>
  );
};