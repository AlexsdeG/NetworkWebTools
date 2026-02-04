import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Fix: Cast req to any to access .get() if types are missing
  const authHeader = (req as any).get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Fix: Cast res to any
    return (res as any).status(401).json({ error: 'Nicht autorisiert: Kein Token vorhanden' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Fix: Cast res to any
    return (res as any).status(403).json({ error: 'Verboten: Ungültiges Token' });
  }
};