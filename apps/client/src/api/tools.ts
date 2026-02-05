import { apiClient } from './client';

// Types aligned with backend responses
export interface ScanResult {
  port: number;
  status: 'open' | 'closed' | 'timeout';
  service?: string;
  banner?: string;
}

export interface ScanResponse {
  target: string;
  scanResults: ScanResult[];
}

export interface GeoData {
  range?: [number, number];
  country?: string;
  region?: string;
  eu?: string;
  timezone?: string;
  city?: string;
  ll?: [number, number];
  metro?: number;
  area?: number;
}

export interface IpResponse {
  ip: string;
  geo: GeoData | null;
}

export interface SmtpResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
  logs?: string[];
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
}

export const toolsApi = {
  /**
   * Scan ports on a target IP address.
   * @param target - Target IP address to scan
   * @param ports - Comma-separated port list (e.g., "80,443,8080") or preset like "common", "web"
   */
  scanPorts: async (target: string, ports: string): Promise<ScanResult[]> => {
    // Convert preset names to actual port lists for backend
    let portList: string;
    switch (ports) {
      case 'common':
        portList = '21,22,23,25,53,80,110,135,139,143,443,445,993,995,1433,3306,3389,5900,8080';
        break;
      case 'web':
        portList = '80,443,8080,8443';
        break;
      default:
        portList = ports;
    }

    const response = await apiClient.post<ScanResponse>('/tools/scan-ports', { 
      target, 
      ports: portList 
    });
    return response.data.scanResults;
  },

  /**
   * Get the requester's public IP address and geo-metadata.
   */
  getIpInfo: async (): Promise<IpResponse> => {
    const response = await apiClient.get<IpResponse>('/tools/my-ip');
    return response.data;
  },

  /**
   * Test SMTP server connectivity and authentication.
   */
  testSmtp: async (config: SmtpConfig): Promise<SmtpResponse> => {
    const response = await apiClient.post<SmtpResponse>('/tools/test-smtp', config);
    return response.data;
  }
};