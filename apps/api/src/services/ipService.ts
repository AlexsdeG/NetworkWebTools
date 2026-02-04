import { Request } from 'express';
import requestIp from 'request-ip';
import geoip from 'geoip-lite';
import ipaddr from 'ipaddr.js';

/**
 * Extrahiert die echte Client-IP aus dem Request.
 * Normalisiert IPv6-mapped IPv4 Adressen (z.B. ::ffff:127.0.0.1) zu IPv4.
 */
export const getPublicIp = (req: Request): string => {
  const detectedIp = requestIp.getClientIp(req);
  
  if (!detectedIp) return '127.0.0.1';

  // Normalisierung von IPv6-Mapped-IPv4
  if (ipaddr.IPv6.isValid(detectedIp)) {
    try {
      const addr = ipaddr.IPv6.parse(detectedIp);
      if (addr.isIPv4MappedAddress()) {
        return addr.toIPv4Address().toString();
      }
    } catch (e) {
      // Fallback, falls Parsing fehlschlägt
      return detectedIp;
    }
  }

  return detectedIp;
};

/**
 * Ermittelt geografische Daten zu einer IP-Adresse.
 */
export const getGeoData = (ip: string) => {
  // geoip-lite gibt null zurück, wenn keine Daten gefunden wurden (z.B. localhost)
  const geo = geoip.lookup(ip);
  return geo;
};