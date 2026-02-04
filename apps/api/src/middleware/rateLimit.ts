import rateLimit from 'express-rate-limit';

// Globaler API Limiter: 100 Anfragen pro 15 Minuten
// Schützt die generelle API vor Überlastung
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Limit jede IP auf 100 Anfragen pro Fenster
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Zu viele Anfragen von dieser IP, bitte versuchen Sie es später erneut.' }
});

// Strikter Scanner Limiter: 5 Anfragen pro Minute
// Verhindert Missbrauch der Port-Scan-Funktion und Banns durch Hosting-Provider
export const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 5, // Limit jede IP auf 5 Scan-Anfragen pro Minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Scan-Limit erreicht. Zu viele Scans in kurzer Zeit. Bitte warten Sie eine Minute.' }
});