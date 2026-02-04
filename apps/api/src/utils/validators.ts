import { z } from 'zod';

export const scanSchema = z.object({
  // Regex for IPv4 as z.string().ip() might be missing in some zod versions
  target: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, { message: "Ungültige IP-Adresse" }),
  // Erlaubt einzelne Ports (80) oder Listen (80,443). Ranges (20-100) werden vorerst nicht explizit unterstützt durch Regex, aber evilscan kann sie.
  // Wir nutzen hier den Regex aus dem Plan für Sicherheit.
  ports: z.string().regex(/^([0-9]+(,[0-9]+)*)?$/, { 
    message: "Ports müssen als kommagetrennte Liste vorliegen (z.B. '80,443,8080')" 
  })
});

export const smtpSchema = z.object({
  host: z.string().min(1, "Hostname ist erforderlich"),
  port: z.number().int().min(1).max(65535, "Port muss zwischen 1 und 65535 liegen"),
  user: z.string().optional(),
  pass: z.string().optional(),
  secure: z.boolean().default(false)
});

export type ScanRequest = z.infer<typeof scanSchema>;
export type SmtpRequest = z.infer<typeof smtpSchema>;