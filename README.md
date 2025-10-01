
# Retro Coin – Klassresa (auto-uppdatering)

En 80-talsinspirerad widget för Google Sites som **automatiskt** hämtar data från Google Sheets (vid sidladdning) och visar progression mot mål. Myntregn + kling‑ljud vid delmål.

## Innehåll
- `index.html` – widgeten
- `styles.css` – retro-stil
- `app.js` – hämtning från Google Sheet (GViz) + logik
- `assets/coin.svg` – myntikon (lokal)

## Förutsättningar (Google Sheet)
1. Flik **Data** med kolumner `date` (YYYY-MM-DD), `value` (ackumulerad totalsumma)
2. Flik **Milestones** med `label`, `amount`, valfritt `target`
3. **Arkiv → Publicera på webben** för **båda** flikarna

> Widgeten läser via GViz-endpointen: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?sheet=<FLIK>&tqx=out:json`

## Inbäddning i Google Sites
1. Publicera mappen på t.ex. **GitHub Pages** eller **Netlify** (HTTPS krävs)
2. I Google Sites: **Infoga → Inbäddat → URL** och peka på `index.html`
3. Rekommenderad storlek: bredd 900–980 px, höjd 600–680 px

## Anpassning
- Byt figur: redigera `#rc-shape`/`#rc-cavity` i `index.html`
- Färger: i `styles.css`
- Ljud: funktionen `chime()` i `app.js`

## Sekretess
Publicera endast aggregerade värden. Vill ni behålla ert originalark privat, skapa ett **mellanark** som publiceras och hämtar data med `IMPORTRANGE()`.
