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
      status: 'TRO', // Timeout, Refused, Open
      banner: false, // Banner fetching often causes timeouts on high ports/silent services
      timeout: 5000 
    };

    console.log(`Starte Scan auf ${target} für Ports: ${ports}`);
    const results: ScanResult[] = [];
    
    // Evilscan Instanz erstellen
    const scanner = new Evilscan(options);

    scanner.on('result', (data) => {
      console.log(`Scan Ergebnis für ${data.port}: ${data.status}`);
      
      let status: 'open' | 'closed' | 'timeout' = 'closed';
      if (data.status === 'open') status = 'open';
      else if (data.status.includes('timeout')) status = 'timeout';
      
      results.push({
        port: data.port,
        status,
        banner: data.banner
      });
    });

    scanner.on('error', (err) => {
      console.error(`Evilscan Fehler: ${err.message}`);
      // Bei Timeout oder Netzwerkfehlern nicht zwingend rejecten, 
      // sondern evtl. leeres Ergebnis? 
      // Hier rejecten wir echte Fehler.
      reject(new Error(`Scan fehlgeschlagen: ${err.message}`));
    });

    scanner.on('done', () => {
      console.log(`Scan auf ${target} abgeschlossen. Funde: ${results.length}`);
      resolve(results);
    });

    scanner.run();
  });
};