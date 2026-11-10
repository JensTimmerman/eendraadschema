# Grondplan-editor

Een losse, offline HTML-tool om de **achtergrondplattegrond** van een
eendraadschema (`.eds`) aan te passen. Je kan muren, deuren, ramen en
labels tekenen of verplaatsen zonder de JSON van het `.eds`-bestand met
de hand te bewerken.

## Gebruik

1. Open `grondplan-editor.html` in een moderne browser (dubbelklikken).
2. Klik op **Open .eds** en kies je schema.
3. Kies de pagina (1–5).
4. Gebruik de tools:
   - **Muur**: sleep op het plan om een horizontale of verticale muur te tekenen.
   - **Deur**: klik op een bestaande muur; er wordt een opening van 70 px gemaakt.
   - **Raam**: klik op een muur; er wordt een opening met glaslijn gemaakt.
   - **Selecteren**: klik en sleep muren of teksten; `Delete` verwijdert.
   - **Tekst**: klik om een label toe te voegen; dubbelklik om te wijzigen.
   - **Undo/Redo** voor wijzigingen.
5. Klik op **Opslaan .eds (alle pagina's)**.
6. Open het gedownloade bestand (`...-aangepast.eds`) opnieuw in de
   online tool en klik op **Situatieschema**.

## Belangrijk

- Het originele `.eds`-bestand wordt **niet** overschreven. De browser
  downloadt een nieuw bestand.
- Bij het wisselen van pagina worden de wijzigingen van de huidige pagina
  automatisch bewaard; bij opslaan zitten alle 5 de pagina's in het
  nieuwe bestand.
- De editor bewerkt enkel de **achtergrond** (muren, deuren, ramen,
  labels). De elektrische symbolen blijven in het eendraadschema en
  worden door de app bovenop de achtergrond getekend.
- De achtergrond wordt opgebouwd uit rechthoeken en tekst. De live
  eendraadschema-app rendert bij een ingelezen SVG enkel `<rect>` en
  `<text>`; paden/lijnen worden niet getoond. De editor houdt zich
  daarom aan die beperking.
- De editor gebruikt de browser-API's `CompressionStream` en
  `DecompressionStream` (deflate) en werkt volledig lokaal.

## Beperkingen

- Geen volledige CAD-functionaliteit: alleen horizontale/verticale
  muren, rechthoekige openingen en tekst.
- De editor werkt per pagina; de symbolen zelf worden niet verplaatst.
- De app-versie waarin het `.eds` werd gemaakt moet dezelfde
  `.eds`-structuur (EDS0040000) gebruiken.
