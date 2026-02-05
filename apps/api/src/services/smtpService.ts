import nodemailer from 'nodemailer';
import { SmtpRequest } from '../utils/validators.js';

export interface SmtpResult {
  success: boolean;
  message: string;
  details?: any;
  logs?: string[];
}

/**
 * Überprüft die Verbindung zu einem SMTP Server.
 * Nutzt 'nodemailer' um einen Handshake durchzuführen, ohne eine E-Mail zu senden.
 */
export const verifyConnection = async (config: SmtpRequest): Promise<SmtpResult> => {
  const logs: string[] = [];
  const log = (msg: string) => {
    console.log(`[SMTP] ${msg}`);
    logs.push(msg);
  };

  // Transporter Konfiguration erstellen
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true für Port 465, false für andere (nutzt dann STARTTLS wenn verfügbar)
    auth: (config.user || config.pass) ? {
      user: config.user,
      pass: config.pass
    } : undefined,
    connectionTimeout: 5000, // 5 Sekunden Timeout (Hard limit gegen Hänger)
    tls: {
      // In Produktion sollte dies true sein, für Diagnosetools ist false oft hilfreich
      rejectUnauthorized: false 
    }
  });

  try {
    log(`Teste Verbindung zu ${config.host}:${config.port} (Secure: ${config.secure})`);
    
    // Führt den SMTP Handshake durch (EHLO -> AUTH -> QUIT)
    await transporter.verify();
    log('Handshake erfolgreich.');

    // Wenn E-Mail-Versand gewünscht ist
    if (config.sendEmail && config.to) {
      log(`Sende Test-E-Mail an ${config.to}...`);
      
      const fromAddress = config.user || 'test@networktools.local';
      
      const info = await transporter.sendMail({
        from: fromAddress,
        to: config.to,
        subject: config.subject || 'NetTools SMTP Test',
        text: config.text || 'Wenn Sie diese E-Mail lesen können, funktioniert Ihre SMTP-Konfiguration!',
      });
      
      log(`E-Mail erfolgreich gesendet. MessageID: ${info.messageId}`);
      
      return { 
        success: true, 
        message: 'Verbindung erfolgreich und Test-E-Mail gesendet.',
        details: { messageId: info.messageId, from: fromAddress },
        logs
      };
    }

    return { 
      success: true, 
      message: 'Verbindung zum SMTP-Server erfolgreich hergestellt.',
      logs
    };
  } catch (error: any) {
    log(`Fehler: ${error.message}`);
    console.error('[SMTP] Full Error:', error);
    
    let message = 'Verbindung fehlgeschlagen.';
    
    // Fehlercodes übersetzen
    if (error.code === 'EAUTH') {
      message = 'Authentifizierung fehlgeschlagen. Benutzername oder Passwort falsch.';
    } else if (error.code === 'ETIMEDOUT') {
      message = 'Zeitüberschreitung bei der Verbindung (Mögliche Firewall-Blockade).';
    } else if (error.code === 'ENOTFOUND') {
      message = 'Server nicht gefunden. Hostname überprüfen.';
    } else if (error.code === 'ESOCKET') {
      message = 'Socket-Fehler. Verbindung unterbrochen oder Server lehnt Verbindung ab.';
    } else if (error.code === 'ECONNREFUSED') {
      message = 'Verbindung abgelehnt. Läuft der SMTP-Server auf dem Ziel-Port?';
    }

    return { 
      success: false, 
      message,
      details: error.message || error.response || 'Unbekannter Fehler',
      logs
    };
  }
};