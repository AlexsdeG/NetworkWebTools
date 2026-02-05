import React from 'react';
import { Info, Cpu, Globe, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';

const portData = [
  { port: 21, service: 'FTP', desc: 'File Transfer Protocol - Legacy data transfer', type: 'system' },
  { port: 22, service: 'SSH', desc: 'Secure Shell - Remote access & secure login', type: 'system' },
  { port: 23, service: 'Telnet', desc: 'Unencrypted remote terminal access', type: 'system' },
  { port: 25, service: 'SMTP', desc: 'Simple Mail Transfer Protocol - Email sending', type: 'system' },
  { port: 53, service: 'DNS', desc: 'Domain Name System - Resolves hostnames', type: 'system' },
  { port: 80, service: 'HTTP', desc: 'Hypertext Transfer Protocol - Web traffic', type: 'system' },
  { port: 110, service: 'POP3', desc: 'Post Office Protocol v3 - Email retrieval', type: 'system' },
  { port: 143, service: 'IMAP', desc: 'Internet Message Access Protocol - Modern mail access', type: 'system' },
  { port: 443, service: 'HTTPS', desc: 'HTTP over TLS/SSL - Secure web traffic', type: 'system' },
  { port: 3306, service: 'MySQL', desc: 'MySQL Database - Common DB server port', type: 'registered' },
  { port: 3389, service: 'RDP', desc: 'Remote Desktop Protocol - Windows remote access', type: 'registered' },
  { port: 5432, service: 'PostgreSQL', desc: 'PostgreSQL Database - Modern DB server port', type: 'registered' },
  { port: 8080, service: 'HTTP-Alt', desc: 'Common alternate port for dev web servers', type: 'registered' },
];

const ranges = [
  { range: '0 - 1023', name: 'Well-Known Ports', desc: 'Reserved for core system services & protocols.', icon: Cpu, color: 'text-blue-400' },
  { range: '1024 - 49151', name: 'Registered Ports', desc: 'Use for specific applications & user-installed software.', icon: Globe, color: 'text-purple-400' },
  { range: '49152 - 65535', name: 'Dynamic / Private', desc: 'Ephemeral ports used for temporary connections.', icon: Info, color: 'text-slate-400' },
];

export const PortKnowledge: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card title="Port-Wissen & Referenz" icon={<Info className="h-5 w-5 text-blue-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {ranges.map((r, i) => (
            <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 transition-all hover:bg-slate-800/80">
              <div className="flex items-center space-x-3 mb-2">
                <r.icon className={`h-5 w-5 ${r.color}`} />
                <h3 className="font-semibold text-white">{r.name}</h3>
              </div>
              <p className="text-xl font-mono text-white mb-1">{r.range}</p>
              <p className="text-xs text-slate-400">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Port</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Beschreibung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {portData.map((p, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-blue-400 font-mono text-sm group-hover:bg-blue-500/10 transition-colors">
                      {p.port}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                       {p.port === 443 || p.port === 22 ? <Lock className="h-3 w-3 text-emerald-400" /> : null}
                       <span className="font-medium text-slate-200">{p.service}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {p.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          <div className="flex space-x-3">
            <Info className="h-5 w-5 text-emerald-400 shrink-0" />
            <p className="text-sm text-slate-300">
              <span className="text-emerald-400 font-semibold italic">Pro-Tipp:</span> Viele Server verbergen ihre Identität oder nutzen unkonventionelle Ports (z.B. SSH auf 2222), um automatisierte Angriffe zu erschweren (Security by Obscurity).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
