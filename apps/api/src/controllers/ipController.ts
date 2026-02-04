import { Request, Response } from 'express';
import * as ipService from '../services/ipService.js';

export const getMyIp = (req: Request, res: Response) => {
  try {
    const ip = ipService.getPublicIp(req);
    const geo = ipService.getGeoData(ip);

    // Fix: Cast res to any
    (res as any).status(200).json({
      ip,
      geo
    });
  } catch (error) {
    console.error('IP Service Error:', error);
    (res as any).status(500).json({ error: 'Fehler beim Abrufen der IP-Daten' });
  }
};