
# Patch – Auto-uppdatering (60 s) + statusrad

Denna patch ersätter **app.js** i din flaskwidget (ladybug-version) och lägger till:

- **Auto-refresh var 60 s** (kan ändras via `REFRESH_MS`)
- **Uppdatering när fliken blir aktiv** (visibilitychange)
- **Statusrad** i sidfoten (wb-footer small) – visar "Hämtar…" / "Senast uppdaterad HH:MM:SS"

## Installera
1. I ditt GitHub-repo (widgeten):
   - Öppna `app.js` → **Edit** → ersätt innehållet med filen i denna patch
   - Alternativt: **Upload files** och skriv över `app.js`
2. **Commit changes**
3. Vänta 30–60 s tills GitHub Pages byggt om
4. Ladda om widgetens URL (testa först utanför Google Sites) och kontrollera sidfoten

## Obs
- Patchen utgår från att `index.html` redan tillåter anslutningar till `https://docs.google.com` via CSP
- Ingen ändring av `index.html` krävs (status visas i befintlig `<footer>`)
- `SHEET_ID`, fliknamn och övriga funktioner är oförändrade

## Ändra intervall
Byt värdet på `REFRESH_MS` (millisekunder), t.ex. `300000` för 5 minuter.
