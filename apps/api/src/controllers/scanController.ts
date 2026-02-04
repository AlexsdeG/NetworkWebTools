import { Request, Response } from 'express';
import { scanSchema } from '../utils/validators.js';
import * as scanService from '../services/scanService.js';

export const scanPorts = async (req: Request, res: Response) => {
  // 1. Validierung
  // Fix: Cast req to any
  const body = (req as any).body;
  const validation = scanSchema.safeParse(body);

  if (!validation.success) {
    return (res as any).status(400).json({ 
      error: 'Validierungsfehler', 
      details: validation.error.format() 
    });
  }

  const { target, ports } = validation.data;

  try {
    // 2. Service Aufruf
    const results = await scanService.scanTarget(target, ports);

    // 3. Antwort
    (res as any).status(200).json({
      target,
      scanResults: results
    });
  } catch (error: any) {
    console.error('Scan Error:', error);
    (res as any).status(500).json({ error: 'Interner Serverfehler beim Scannen' });
  }
};