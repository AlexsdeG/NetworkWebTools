export const de = {
  app: {
    title: "Netzwerk-Tools Suite",
    description: "Private Netzwerkdiagnose-Tools"
  },
  auth: {
    loginTitle: "Zugriffsbeschränkung",
    instruction: "Bitte authentifizieren Sie sich, um fortzufahren.",
    passwordLabel: "Zugangspasswort",
    loginButton: "Authentifizieren",
    logoutButton: "Sitzung beenden",
    error: "Das eingegebene Passwort ist ungültig.",
    mockHint: "Prototyp Zugang: 'admin'"
  },
  nav: {
    dashboard: "Übersicht",
    scanner: "Port Scanner",
    ipInfo: "IP Metadaten",
    smtp: "SMTP Tester"
  },
  dashboard: {
    welcome: "Willkommen zurück",
    subtitle: "Wählen Sie ein Werkzeug aus der Seitenleiste, um zu beginnen.",
    cards: {
      scan: {
        title: "Port Scanner",
        desc: "TCP-Ports auf Ziel-Hosts scannen."
      },
      ip: {
        title: "Meine IP",
        desc: "Detaillierte Geo- und ISP-Informationen."
      },
      smtp: {
        title: "SMTP Tester",
        desc: "Verbindung und Authentifizierung prüfen."
      }
    }
  },
  scanner: {
    title: "Port Scanner",
    targetLabel: "Ziel-Host / IP",
    portsLabel: "Ports",
    presets: {
      common: "Häufige (Top 20)",
      web: "Web (80, 443, 8080)",
      all: "Alle (Simuliert)"
    },
    startBtn: "Scan starten",
    scanning: "Scanne...",
    results: "Ergebnisse",
    status: {
      open: "Offen",
      closed: "Geschlossen"
    },
    toast: {
      success: "Scan abgeschlossen. {{count}} Ports überprüft."
    }
  },
  ip: {
    title: "IP Informationen",
    loading: "Lade IP-Daten...",
    details: "Details",
    map: "Kartenansicht",
    noGeoData: "Keine Geodaten verfügbar",
    fields: {
      ip: "IP Adresse",
      type: "Typ",
      location: "Standort",
      country: "Land",
      isp: "Internetanbieter",
      timezone: "Zeitzone"
    }
  },
  smtp: {
    title: "SMTP Verbindungs-Tester",
    config: "Konfiguration",
    host: "Hostname",
    port: "Port",
    user: "Benutzername",
    password: "Passwort",
    secure: "SSL/TLS nutzen",
    testBtn: "Verbindung testen",
    testing: "Teste...",
    logTitle: "Verbindungsprotokoll",
    success: "Verbindung erfolgreich hergestellt.",
    error: "Verbindungsfehler",
    steps: {
      resolving: "Löse Hostnamen auf...",
      connecting: "Verbinde mit Server...",
      handshake: "Führe Handshake aus...",
      authenticating: "Authentifiziere Benutzer..."
    },
    toast: {
      success: "SMTP Verbindung erfolgreich verifiziert.",
      error: "SMTP Verbindungsfehler"
    }
  },
  common: {
    loading: "Wird geladen...",
    error: "Ein Fehler ist aufgetreten",
    success: "Vorgang erfolgreich",
    toast: {
      error: "Ein Fehler ist aufgetreten"
    }
  }
};