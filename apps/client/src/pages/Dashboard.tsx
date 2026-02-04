import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, Globe, Mail, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const tools = [
    {
      id: 'scan',
      icon: Shield,
      title: t('dashboard.cards.scan.title'),
      desc: t('dashboard.cards.scan.desc'),
      link: '/scan',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      id: 'ip',
      icon: Globe,
      title: t('dashboard.cards.ip.title'),
      desc: t('dashboard.cards.ip.desc'),
      link: '/ip',
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    {
      id: 'smtp',
      icon: Mail,
      title: t('dashboard.cards.smtp.title'),
      desc: t('dashboard.cards.smtp.desc'),
      link: '/smtp',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard.welcome')}</h1>
        <p className="text-slate-400">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.id} to={tool.link} className="block group">
            <Card className="h-full transition-transform duration-200 hover:-translate-y-1 hover:ring-2 hover:ring-primary/50">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${tool.bg} ${tool.color}`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
              <p className="text-slate-400 text-sm">{tool.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};