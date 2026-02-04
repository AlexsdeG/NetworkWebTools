import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * POST /api/auth/login
 * Tauscht ein Passwort gegen ein JWT Token.
 */
export const login = async (req: Request, res: Response) => {
  // Fix: Cast req to any to access body
  const body = (req as any).body as { password?: unknown } | undefined;
  const password = body?.password;

  if (!password || typeof password !== 'string') {
    // Fix: Cast res to any for status
    return (res as any).status(400).json({ error: 'Passwort ist erforderlich' });
  }

  try {
    const token = await authService.login(password);

    if (!token) {
      return (res as any).status(401).json({ error: 'Ungültiges Passwort' });
    }

    (res as any).status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    (res as any).status(500).json({ error: 'Interner Serverfehler' });
  }
};

/**
 * GET /api/auth/verify
 * Prüft, ob das aktuelle Token noch gültig ist.
 */
export const verify = (req: AuthRequest, res: Response) => {
  // Wenn die Middleware durchlaufen wurde, ist das Token gültig
  (res as any).status(200).json({ status: 'valid', user: req.user });
};