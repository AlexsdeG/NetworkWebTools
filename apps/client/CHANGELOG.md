# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [0.0.7] - 2024-05-27

### Hinzugefügt
- **Feedback-System**: Integration von `sonner` für Toast-Benachrichtigungen.
- **Interaktives Feedback**: Erfolgs- und Fehlermeldungen für Scanner und SMTP-Tests.
- **Environment Konfiguration**: Vorbereitung für Produktions-Deployments via `VITE_API_URL`.

### Geändert
- `App.tsx` integriert nun die globale `Toaster` Komponente.
- Custom Hooks (`useScan`, `useSmtp`) lösen nun visuelle Benachrichtigungen aus.

## [0.0.6] - 2024-05-26

### Hinzugefügt
- **SMTP UX Verbesserung**: Automatische Erkennung und Konfiguration der SSL/TLS-Einstellungen basierend auf dem eingegebenen Port (465 -> SSL an, 587/25 -> SSL aus).
- **Log-Simulation**: Visuelle Simulation des Verbindungsaufbaus ("Terminal-Effekt") während der SMTP-Test läuft, um dem Benutzer direktes Feedback zu geben.
- Neue Übersetzungen für die SMTP-Verbindungsschritte.
- Integrations-Tests für die automatische Port-Konfiguration.

### Geändert
- `SmtpForm` Komponente erweitert um Logik für Port-Abhängigkeiten.
- `Smtp` Page Komponente erweitert um Log-Simulation während des Ladevorgangs.

## [0.0.5] - 2024-05-25

### Hinzugefügt
- **IP Metadaten Erweiterung**: Visualisierung des Standorts mittels interaktiver OpenStreetMap-Karte.
- **UI Polish**: Einführung von `Skeleton`-Loading-States für eine flüssigere User Experience beim Datenladen.
- **IpMap Komponente**: Neue Komponente zur Einbettung von Kartenansichten via Iframe.
- Erweiterte Typ-Definitionen für IP-Informationen (Breiten- und Längengrad).
- Aktualisierte Mock-Daten für realistischere Testszenarien.

### Geändert
- Layout der IP-Informations-Seite (`IpInfo`) optimiert (Split-View für Details und Karte).
- `IpDetails` Komponente refactored, um das neue Layout zu unterstützen.
- Erweiterte Tests für die IP-Informations-Seite.

## [0.0.4] - 2024-05-24

### Hinzugefügt
- Integration von `@tanstack/react-query` für effizientes State-Management von Server-Daten.
- Modularisierung der Features (Scanner, IP, SMTP) in dedizierte `src/features`-Komponenten.
- Custom Hooks (`useScan`, `useIpInfo`, `useSmtp`) zur Trennung von API-Logik und UI.
- Verbessertes Fehler- und Loading-Status-Handling durch React Query.
- Animierte Übergänge für Suchergebnisse und IP-Details.

### Geändert
- Refactoring der monolithischen Page-Komponenten in kleinere, wartbare Einheiten.
- `App.tsx` wrapped nun die Anwendung mit dem `QueryClientProvider`.

## [0.0.3] - 2024-05-23

### Hinzugefügt
- Vollständige Frontend-Implementierung der Web-Tools (Scanner, IP-Info, SMTP).
- Mobile Navigation (Hamburger Menü) für verbesserte Responsivität.
- Mock-API-Layer (`toolsApi`) für die Simulation von Backend-Antworten.
- Neue Seiten-Komponenten: `Scanner`, `IpInfo`, `Smtp`.
- UI-Komponente `Badge`.
- Erweiterte deutsche Übersetzungen für alle Tools.

### Geändert
- Fix für Import-Pfad in `index.tsx` (i18n).
- Layout-Anpassungen für mobile Geräte.

## [0.0.2] - 2024-05-22

### Hinzugefügt
- Sicherer Storage-Wrapper für LocalStorage-Zugriff (behebt SecurityError).
- Axios API-Client mit Interceptors für Auth-Token und 401-Handling.
- Refactoring der Authentifizierungs-Logik in `src/features/auth`.
- LoginForm Komponente separiert.
- Erweiterte deutsche Übersetzungen.
- Verbesserte Fehlerbehandlung im AuthContext.

## [0.0.1] - 2024-05-22

### Hinzugefügt
- Initiale Projektstruktur und Konfiguration.
- React, TypeScript und Tailwind CSS Setup.
- Internationalisierung (i18n) Unterstützung mit Deutsch als Standardsprache.
- Authentifizierungs-Kontext (AuthContext) für Login-Status-Verwaltung.
- Grundlegendes UI-Komponenten-Set (Button, Input, Card).
- Layout-Komponente mit Navigation.
- Login-Seite und Dashboard-Seite-Gerüste.
- Routing-Konfiguration (HashRouter).