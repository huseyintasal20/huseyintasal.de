# huseyintasal.de

Persönliche Bewerbungs- und Portfolioseite. Reines HTML, CSS und JavaScript, ohne Build-Schritt und ohne Framework.

## Ordnerstruktur

```
index.html          Startseite (alle Inhalte auf Deutsch, wichtig für Google)
impressum.html      Impressum
datenschutz.html    Datenschutzerklärung
404.html            Fehlerseite für GitHub Pages
about.html          Weiterleitung alte Adresse -> /#about
contact.html        Weiterleitung alte Adresse -> /#contact
CNAME               eigene Domain für GitHub Pages
.nojekyll           GitHub Pages liefert Dateien unverändert aus
robots.txt, sitemap.xml, site.webmanifest
assets/css/         styles.css (Design), fonts.css (lokale Schriften)
assets/js/          main.js (Funktionen), i18n.js (Englisch + Türkisch)
assets/fonts/       Schriften lokal (keine Verbindung zu Google, DSGVO)
assets/img/         Portrait (2 Größen), og-image.jpg (Vorschau bei LinkedIn/WhatsApp)
assets/img/projects/ Netzplan Homelab (Vorschau + Großansicht), Screenshot Karteikarten-App
assets/logo/        HT-Logo als SVG/PNG
```

## Projektbilder austauschen oder ergänzen

- Projektkarten mit Foto/Screenshot: `<button class="project-media media-zoom" data-full="GROSSES-BILD">` mit einem `<img>` darin. Klick öffnet die Großansicht.
- Projektkarten ohne Foto zeigen eine gezeichnete Skizze (SVG direkt in `index.html`).
- Neue Bilder in `assets/img/projects/` ablegen (JPG für Fotos/Screenshots, PNG für Netzpläne), Breite ca. 900–1800 px.

## Texte ändern

- **Deutsch:** direkt in `index.html`.
- **Englisch / Türkisch:** in `assets/js/i18n.js`, gleicher Schlüssel wie im `data-i18n="..."`-Attribut.
- Neue Texte immer in allen drei Sprachen anlegen.
- Sprache per Link vorwählen: `https://huseyintasal.de/?lang=en` oder `?lang=tr` (praktisch für englische Bewerbungen).

## Offene Platzhalter (Suche nach `ANPASSEN`)

Aktuell sind keine Platzhalter offen.

Nach der Azure-Prüfung (AZ-104): in `index.html` bei der Azure-Karte `data-i18n="c_prep"` durch `data-i18n="c_cert"` ersetzen, Text auf „Zertifiziert“ ändern und die Klasse `cert-meta-open` entfernen.

## Veröffentlichen mit GitHub Pages

1. Auf GitHub ein neues Repository anlegen, z. B. `huseyintasal.de` (öffentlich).
2. **Den Inhalt dieses Ordners** hochladen (nicht den Ordner selbst), sodass `index.html` im Hauptverzeichnis liegt:
   ```
   git init
   git add .
   git commit -m "Website v3"
   git branch -M main
   git remote add origin https://github.com/<BENUTZERNAME>/huseyintasal.de.git
   git push -u origin main
   ```
3. Im Repository: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)`** → Save.
4. Unter **Custom domain** `huseyintasal.de` eintragen (die Datei `CNAME` ist schon vorhanden).
5. Beim Domain-Anbieter die DNS-Einträge setzen (alte Einträge für den Homeserver/Cloudflare-Tunnel für die Hauptdomain vorher entfernen):

   | Typ | Name | Wert |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |
   | CNAME | www | `<BENUTZERNAME>.github.io` |

   Wird die Domain über Cloudflare verwaltet: Proxy (orange Wolke) für diese Einträge zunächst auf **DNS only** stellen, bis GitHub das Zertifikat ausgestellt hat.
6. Sobald GitHub die Domain bestätigt: **Enforce HTTPS** aktivieren (kann bis zu 24 h dauern).

## Bei Google gefunden werden

Die Seite ist technisch vorbereitet: Name im Titel und in der Hauptüberschrift, Schreibweisen „Hüseyin Tasal“ und „Huseyin Tasal“ in den Metadaten, strukturierte Daten (Person), Sitemap und Vorschaubild.

1. [Google Search Console](https://search.google.com/search-console) öffnen → **Property hinzufügen → Domain** → `huseyintasal.de`.
2. Den angezeigten **TXT-Eintrag** beim Domain-Anbieter eintragen und bestätigen.
3. Links **Sitemaps** → `sitemap.xml` einreichen.
4. Oben die URL `https://huseyintasal.de/` prüfen → **Indexierung beantragen**.
5. Website im LinkedIn- und Xing-Profil (und im GitHub-Profil) eintragen. Diese Verlinkungen sind der stärkste Hebel, damit Google die Seite dem Namen zuordnet.

Die Aufnahme dauert in der Regel einige Tage bis wenige Wochen. Optional zusätzlich bei den [Bing Webmaster Tools](https://www.bing.com/webmasters) anmelden (Import aus der Search Console ist möglich).

## Kontaktformular (Formspree)

- Das Formular sendet an Formspree mit derselben Formular-ID wie bisher (`xovpoylb`).
- Nach dem Go-live einmal eine Testnachricht schicken.
- Im Formspree-Dashboard empfehlenswert: unter den Formular-Einstellungen die erlaubte Domain auf `huseyintasal.de` beschränken.

## Lokal ansehen

`index.html` doppelklicken. Das Formular funktioniert erst richtig, wenn die Seite online ist.

**Intro:** erscheint beim ersten Öffnen im Tab und bei jedem Neuladen (F5). Kommt man von Impressum/Datenschutz zurück, erscheint es nicht erneut. Ein Klick oder eine Taste überspringt es.

**Laufbänder:** laufen immer automatisch, auch wenn in Windows „Animationseffekte“ ausgeschaltet sind. Sie stoppen, solange die Maus darüber ist, auf dem Handy per Antippen, und jederzeit über den Knopf „Anhalten“.
