# Noor — Daily Hadees · نور

One authentic hadees every day — with its **backstory**, **history**, **narrator biography** and **meaning**, plus practical steps to live it. A free, open-source, offline-ready web app. No accounts, no ads, no tracking.

**Live app:** https://mohammedanasasif.github.io/noor-daily-hadees/

## Features

- **Daily hadees** — a deterministic hadees-of-the-day (same for everyone on the same date), with Arabic text, translation and full reference
- **Four detail tabs** — Backstory, History, Narrator bio, Meaning
- **Learn in easy steps** — 4 practical actions for every hadees
- **Search & curated collections** — find by theme, narrator, collection or text; browse playlists like *Steady Hearts* and *Gentle Homes*
- **Deep links & sharing** — every hadees has its own URL (`#hadees-id`); native share sheet with clipboard fallback
- **Listen** — Arabic recitation via device text-to-speech
- **Save & streaks** — bookmark favorites, track your daily streak, Export/Import as JSON backup
- **PWA** — installable on phone/desktop, works fully offline via service worker
- **Light/dark mode, font-size controls, accessible keyboard navigation**

## Run locally

No build step — it's plain HTML/CSS/JS:

1. Clone or download this folder
2. Open `index.html` in any browser

For PWA/service-worker testing, serve over localhost:

```bash
python -m http.server 8080
```

## Project structure

```
├── index.html            # single-page app shell + SEO/OG meta
├── css/styles.css        # design system: emerald/gold paper theme, dark mode
├── js/data.js            # hadees dataset + curated collections  ← extend here
├── js/app.js             # rendering, routing, search, storage, PWA glue
├── sw.js                 # service worker (offline cache)
├── manifest.webmanifest  # installable-app manifest
└── assets/               # icons + social share card
```

## Adding more hadees

Append an object to `HADITHS` in `js/data.js` following the existing schema:

```js
{
  id: "unique-slug",
  theme: "Short Theme Name",
  arabic: "النَّصُّ العَرَبِيُّ",
  translation: "English translation.",
  narrator: { name, title, bio },
  backstory, history, meaning,
  steps: ["step one", "step two", "step three", "step four"],
  source: { collection, number, alsoIn, grade }
}
```

The daily rotation, numbering, search, collections and deep links pick up new entries automatically.

## Content disclaimer

Compiled from the six canonical books and classical collections; numbering follows widely printed editions and gradings reflect mainstream hadith scholarship. This project is educational — for religious rulings please consult a qualified scholar, and have translations/backstories reviewed before relying on them.

## License

MIT — see [LICENSE](LICENSE).
