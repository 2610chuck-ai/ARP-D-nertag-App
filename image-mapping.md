# Bild-Zuordnung für die Web-App

Die Bilder aus `Döner.zip` wurden lokal in `images/menu/` integriert. Externe Unsplash-Bilder wurden aus der Web-App entfernt.

## Hauptzuordnung

- Döner `01-05` → `images/menu/doener.png`
- Yufka `07-10` → `images/menu/yufka.png`
- Teller `11-12` → `images/menu/teller.png`
- Dönerfleisch `13` → `images/menu/doenerfleisch.png`
- Boxen `15-20` → `images/menu/box.png`
- Pommes Box `21` → `images/menu/pommes-box.png`
- Lahmacun `25-27` → `images/menu/lahmacun.png`
- Fladenbrot `28` → `images/menu/fladenbrot.png`
- Ketchup / Mayo `29` → `images/menu/ketchup-mayonnaise.png`
- Extra Soße `30` → `images/menu/extra-sosse.png`
- Extra Fleisch `31` → `images/menu/extra-fleisch.png`
- Käse `32` → `images/menu/kaese.png`
- Pizzateig `33` → `images/menu/fladenbrot.png` (Fallback, kein eigenes Motiv vorhanden)
- Pide `35-42` → `images/menu/pide.png`
- Seele `50-53` → `images/menu/seele.png`
- Putenschnitzel `54` → `images/menu/schnitzel.png`
- Nuggets `55` → `images/menu/nuggets.png`
- Salate `56-59` → `images/menu/salat.png`
- Pizzen `60-85`, `X1` → `images/menu/pizza.png`
- Getränke `G01-G22` → `images/menu/getraenke.png`
- Warme Getränke `W01-W10` → `images/menu/warme-getraenke.png`

## Hinweise

- `calzone.png` wurde mit übernommen, ist in der aktuellen Speisekarte aber nicht verwendet.
- In der hochgeladenen ZIP war kein eigenes Bild für `Seele` vorhanden. Dafür wurde das passende, bereits in dieser Unterhaltung erzeugte Motiv als `images/menu/seele.png` ergänzt.
- Alle Bildpfade sind relativ, damit das Projekt lokal und im Hosting ohne Root-Anpassung läuft.
