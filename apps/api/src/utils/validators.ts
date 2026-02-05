import { z } from 'zod';

export const scanSchema = z.object({
  // Regex for IPv4 as z.string().ip() might be missing in some zod versions
  target: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, { message: "Ungültige IP-Adresse" }),
  // Erlaubt einzelne Ports (80), Listen (80,443) und Ranges (80-443).
  // Unterstützt auch optionale Leerzeichen nach Kommas.
  ports: z.string().regex(/^([0-9]+(-[0-9]+)?(,\s*[0-9]+(-[0-9]+)?)*)?$/, { 
    message: "Ports müssen als kommagetrennte Liste oder Range vorliegen (z.B. '80,443' oder '80-443')" 
  })
});

export const smtpSchema = z.object({
  host: z.string().min(1, "Hostname ist erforderlich"),
  port: z.coerce.number().int().min(1).max(65535, "Port muss zwischen 1 und 65535 liegen"),
  user: z.string().optional(),
  pass: z.string().optional(),
  secure: z.boolean().default(false),
  sendEmail: z.boolean().optional(),
  to: z.string().email().optional(),
  subject: z.string().optional(),
  text: z.string().optional()
});

export type ScanRequest = z.infer<typeof scanSchema>;
export type SmtpRequest = z.infer<typeof smtpSchema>;