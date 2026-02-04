import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';

interface IpMapProps {
  lat: number;
  lon: number;
}

export const IpMap: React.FC<IpMapProps> = ({ lat, lon }) => {
  const { t } = useTranslation();
  
  // Calculate bounding box for the map view (approx 0.02 degrees padding)
  const delta = 0.02;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <Card className="h-full min-h-[300px] flex flex-col p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700 bg-surface">
        <h3 className="text-lg font-medium text-white">{t('ip.map')}</h3>
      </div>
      <div className="flex-1 bg-slate-900 relative">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={src}
          title="IP Location Map"
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        ></iframe>
      </div>
    </Card>
  );
};