# Google Formulär – Kommentarswidget

Denna widget bäddar in ett Google Formulär som kommentarsfält.

## Så använder du

1. **Publicera formuläret**:
   - Öppna formuläret i Google Forms.
   - Klicka på **Skicka → `</>` (Embed)**.
   - Kopiera `src`-länken från iframe-koden.

2. **Byt ut länken i `index.html`** om du vill använda ett annat formulär.

3. **Publicera på GitHub Pages**:
   - Skapa ett nytt repo.
   - Ladda upp `index.html` och `README.md`.
   - Gå till **Settings → Pages** och välj `main` branch, root folder.
   - Din widget blir tillgänglig via `https://<användarnamn>.github.io/<repo>/`.

4. **Bädda in i Google Sites**:
   - Gå till din Site.
   - Välj **Infoga → Inbäddat → URL**.
   - Klistra in länken till din publicerade `index.html`.

## Anpassning

- Ändra höjden på formuläret i `index.html` genom att justera `height` i `<iframe>` eller CSS.
- Du kan lägga till fler stilar eller rubriker i HTML-filen.

