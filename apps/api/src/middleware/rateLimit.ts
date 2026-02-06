import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// Custom key generator that extracts real IP from proxied headers
// Required when running behind a proxy (nginx/load balancer) with trust proxy enabled
const getClientIp = (req: Request): string => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one (original client)
    const ips = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor.split(',')[0];
    return ips.trim();
  }
  return req.socket.remoteAddress || 'unknown';
};

// Globaler API Limiter: 100 Anfragen pro 15 Minuten
// Schützt die generelle API vor Überlastung
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Limit jede IP auf 100 Anfragen pro Fenster
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Zu viele Anfragen von dieser IP, bitte versuchen Sie es später erneut.' },
  keyGenerator: (req: Request) => getClientIp(req) // Extract real IP from proxy headers
});

// Strikter Scanner Limiter: 5 Anfragen pro Minute
// Verhindert Missbrauch der Port-Scan-Funktion und Banns durch Hosting-Provider
export const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 5, // Limit jede IP auf 5 Scan-Anfragen pro Minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Scan-Limit erreicht. Zu viele Scans in kurzer Zeit. Bitte warten Sie eine Minute.' },
  keyGenerator: (req: Request) => getClientIp(req) // Extract real IP from proxy headers
});