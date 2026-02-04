import { Request, Response } from 'express';
import { smtpSchema } from '../utils/validators.js';
import * as smtpService from '../services/smtpService.js';

export const testSmtp = async (req: Request, res: Response) => {
  // Fix: Cast req to any
  const body = (req as any).body;
  
  // 1. Validierung
  const validation = smtpSchema.safeParse(body);

  if (!validation.success) {
    return (res as any).status(400).json({
      error: 'Validierungsfehler',
      details: validation.error.format()
    });
  }

  try {
    // 2. Service Aufruf
    const result = await smtpService.verifyConnection(validation.data);

    // 3. Antwort
    if (result.success) {
      (res as any).status(200).json(result);
    } else {
      // 422 Unprocessable Entity wird oft genutzt, wenn die Syntax ok ist, 
      // aber die Semantik (hier: Verbindung) fehlschlägt.
      (res as any).status(422).json(result);
    }
  } catch (error) {
    console.error('SMTP Controller Error:', error);
    (res as any).status(500).json({ error: 'Interner Serverfehler beim SMTP-Test' });
  }
};