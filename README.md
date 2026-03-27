# Kebap-Bestellung – Netlify Final

## Wichtige Netlify-Einstellungen

1. Repository mit **diesem Ordnerinhalt** deployen.
2. Umgebungsvariable anlegen:
   - `ADMIN_PIN=2610`
3. Nach Änderungen an Umgebungsvariablen immer neu deployen.

## Tests

- Bestellung: `/index.html`
- Azubi: `/azubi.html` oder `/azubi`
- Funktions-Healthcheck: `/.netlify/functions/orders?health=1`
- Funktions-Healthcheck mit PIN: `/.netlify/functions/orders?health=1&pin=2610`

## Hinweise

- `PIN falsch` wird jetzt nur noch bei echter 401 gezeigt.
- Andere Serverfehler werden auf der Azubi-Seite als Serverproblem angezeigt.
- Der Warenkorb speichert mehrere Artikel pro Mitarbeiter und Donnerstag.
