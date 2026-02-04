import Evilscan from 'evilscan';

export interface ScanResult {
  port: number;
  status: string;
  banner?: string;
}

/**
 * Scannt ein Ziel auf offene Ports.
 * @param target IP-Adresse als String
 * @param ports Ports als kommagetrennter String (z.B. "80,443")
 */
export const scanTarget = (target: string, ports: string): Promise<ScanResult[]> => {
  return new Promise((resolve, reject) => {
    const options = {
      target,
      port: ports,
      status: 'O', // Nur offene Ports
      banner: true,
      timeout: 2000 // Hardcoded Timeout wie im Plan
    };

    const results: ScanResult[] = [];
    
    // Evilscan Instanz erstellen
    const scanner = new Evilscan(options);

    scanner.on('result', (data) => {
      // Wir sammeln nur offene Ports (wobei status:'O' das schon filtern sollte)
      if (data.status === 'open') {
        results.push({
          port: data.port,
          status: data.status,
          banner: data.banner
        });
      }
    });

    scanner.on('error', (err) => {
      // Bei Timeout oder Netzwerkfehlern nicht zwingend rejecten, 
      // sondern evtl. leeres Ergebnis? 
      // Hier rejecten wir echte Fehler.
      reject(new Error(`Scan fehlgeschlagen: ${err.message}`));
    });

    scanner.on('done', () => {
      resolve(results);
    });

    scanner.run();
  });
};