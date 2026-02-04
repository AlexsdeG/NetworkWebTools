import nodemailer from 'nodemailer';
import { SmtpRequest } from '../utils/validators.js';

export interface SmtpResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Überprüft die Verbindung zu einem SMTP Server.
 * Nutzt 'nodemailer' um einen Handshake durchzuführen, ohne eine E-Mail zu senden.
 */
export const verifyConnection = async (config: SmtpRequest): Promise<SmtpResult> => {
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
    // Führt den SMTP Handshake durch (EHLO -> AUTH -> QUIT)
    await transporter.verify();
    return { success: true, message: 'Verbindung zum SMTP-Server erfolgreich hergestellt.' };
  } catch (error: any) {
    let message = 'Verbindung fehlgeschlagen.';
    
    // Fehlercodes übersetzen
    if (error.code === 'EAUTH') {
      message = 'Authentifizierung fehlgeschlagen. Benutzername oder Passwort falsch.';
    } else if (error.code === 'ETIMEDOUT') {
      message = 'Zeitüberschreitung bei der Verbindung (Mögliche Firewall-Blockade).';
    } else if (error.code === 'ENOTFOUND') {
      message = 'Server nicht gefunden. Hostname überprüfen.';
    } else if (error.code === 'ESOCKET') {
        message = 'Socket-Fehler. Verbindung unterbrochen.';
    }

    return { 
      success: false, 
      message,
      details: error.message || error.response
    };
  }
};