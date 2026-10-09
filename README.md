# Meesman Monitor

Een onafhankelijke dashboard-app voor Meesman Wereldwijd Totaal. De app kan op GitHub worden gezet en live worden gepubliceerd met GitHub Pages.

## Belangrijk over gegevens
- De standaard holdings in `src.jsx` zijn **illustratieve voorbeeldposities/gewichten**, geen geverifieerde actuele portefeuille.
- De stijgers/dalers worden niet verzonnen: zonder een gecontroleerde holdings-feed en betrouwbare historische koersdata toont de app een duidelijke melding.
- Dit project bevat nog geen officiële Meesman-API of live marktdata-provider. Controleer altijd de actuele factsheet bij Meesman.
- Geen financieel advies.

## Lokaal draaien
1. Installeer Node.js 20 of hoger.
2. Voer in deze map uit:
   ```bash
   npm install
   npm run dev
   ```
3. Open de URL die Vite toont.

## Publiceren via GitHub Pages
1. Maak een nieuwe GitHub-repository, bijvoorbeeld `meesman-monitor`.
2. Upload alle bestanden uit deze map (niet de ZIP zelf).
3. Ga in GitHub naar **Settings → Pages**.
4. Kies **Build and deployment → Source: GitHub Actions**.
5. Commit/push. De workflow in `.github/workflows/deploy.yml` bouwt en publiceert de app.
6. Open **Settings → Pages** om de live URL te zien.

## Live rendementen toevoegen
Gebruik een betrouwbare marktdata-aanbieder en controleer licentie/rechten voor herpublicatie. Voor echte top 5's heb je nodig:
1. De volledige holdings op een vastgestelde peildatum (ticker/ISIN en gewicht).
2. Historische, voor splitsingen gecorrigeerde koersen en bij voorkeur dividend-/totaalrendement.
3. Een periodieke import en validatie van de gegevens.
4. Een backend/proxy als een provider een API-key vereist. Zet nooit een geheime API-key in React-code of een publieke GitHub-repository.

Een provider zonder API-key of een eigen gevalideerde statische CSV kan als eerste integratie dienen. Browser-API's en CORS-beperkingen kunnen live koersfeeds blokkeren; test dit voor je provider.
