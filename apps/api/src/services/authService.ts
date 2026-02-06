import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Authentifiziert einen Benutzer anhand des Passworts.
 * @param password Das vom Benutzer eingegebene Klartext-Passwort.
 * @returns Ein JWT Token, wenn das Passwort korrekt ist, sonst null.
 */
export const login = async (password: string): Promise<string | null> => {
  console.log('Using ADMIN_PASS_HASH:', env.ADMIN_PASS_HASH);
  console.log('Password to verify:', password, 'hashed:', await bcrypt.hash(password, 10));

  // Passwort-Hash überprüfen
  const isValid = await bcrypt.compare(password, env.ADMIN_PASS_HASH);
  
  if (!isValid) {
    return null;
  }

  // Token erstellen (Gültig für 24 Stunden)
  const token = jwt.sign({ role: 'admin' }, env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};