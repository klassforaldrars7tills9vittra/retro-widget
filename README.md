
# Flaskwidget – Grön bubblande vätska + nyckelpigor (auto‑uppdatering)

Responsiv widget för Google Sites som hämtar data från Google Sheet vid sidladdning. Flaskform med rundade kanter fylls med **grön bubblande vätska**; **nyckelpigor** flyter runt; **myntregn** vid delmål. Ingen graf och inget ljud.

## Innehåll
- `index.html` – widgeten (SVG‑flaska, inga grafer/ljud)
- `styles.css` – tema och layout (responsiv)
- `app.js` – GViz‑hämtning + vätske/bubbelfx + delmål/myntregn
- `assets/coin.svg`, `assets/ladybug.svg`

## Förutsättningar (Google Sheet)
1. Flik **Data**: `date` (YYYY‑MM‑DD), `value` (ackumulerad totalsumma)
2. Flik **Milestones**: `label`, `amount`, valfritt `target`
3. **Arkiv → Publicera på webben** för **båda** flikarna

> Widgeten läser via GViz: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?sheet=<FLIK>&tqx=out:json`

## Inbäddning i Google Sites
1. Publicera mappen på **GitHub Pages**/Netlify (HTTPS)
2. I Sites: **Infoga → Inbäddat → URL** → peka på `index.html`
3. Rek. storlek: 900–980 px bred, 620–700 px hög

## Anpassning
- Färger (vätska/glas): `styles.css` och gradienterna i `index.html`
- Antal nyckelpigor: `BUG_COUNT` i `app.js`
- Bubbelintensitet: intervall i `startFluidFX()`

## Sekretess
Publicera endast sammanställd data. För privat originalark, använd ett mellanark med `IMPORTRANGE()` och publicera mellanarket.
