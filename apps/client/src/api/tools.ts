import { apiClient } from './client';

// Types
export interface ScanResult {
  port: number;
  status: 'open' | 'closed';
  service?: string;
}

export interface IpInfo {
  ip: string;
  type: string;
  location: string;
  isp: string;
  timezone: string;
  lat: number;
  lon: number;
}

export interface SmtpResponse {
  success: boolean;
  logs: string[];
}

// Mock API Implementation
export const toolsApi = {
  scanPorts: async (target: string, ports: string): Promise<ScanResult[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const portList = ports === 'common' 
          ? [21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 443, 445, 993, 995, 1433, 3306, 3389, 5900, 8080] 
          : ports === 'web' ? [80, 443, 8080, 8443] : [80, 443];
        
        const results: ScanResult[] = portList.map(port => ({
          port,
          status: Math.random() > 0.7 ? 'open' : 'closed',
          service: 'unknown'
        }));
        resolve(results);
      }, 1500);
    });
  },

  getIpInfo: async (): Promise<IpInfo> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ip: '203.0.113.45',
          type: 'IPv4',
          location: 'Berlin, Deutschland',
          isp: 'Deutsche Telekom AG',
          timezone: 'Europe/Berlin',
          lat: 52.5200,
          lon: 13.4050
        });
      }, 1000);
    });
  },

  testSmtp: async (config: any): Promise<SmtpResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config.host.includes('error')) {
          reject(new Error('Connection timed out'));
        } else {
          resolve({
            success: true,
            logs: [
              `Connecting to ${config.host}:${config.port}...`,
              'Socket connected.',
              'Initiating handshake...',
              'TLS negotiation successful.',
              'Authenticating user...',
              'Authentication successful.',
              'Closing connection.'
            ]
          });
        }
      }, 2000);
    });
  }
};