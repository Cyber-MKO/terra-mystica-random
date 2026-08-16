# Terra Mystica Randomizer

A responsive, static web app that randomizes a full **Terra Mystica** game
setup: factions (with legal home terrains), round scoring tiles, bonus cards
and — optionally — the game board. All randomization runs client-side with
cryptographically unbiased randomness, wrapped in a short dramatic reveal.

> Unofficial fan tool. Terra Mystica is © Feuerland Spiele /
> Helge Ostertag & Jens Drögemüller; artwork by Dennis Lohausen. The app
> needs no artwork to run — anything absent falls back to a styled
> placeholder. See [Artwork](#artwork).

## Features

- **Players** — two ways to set up:
  - **Enter names** — 2–5 named players (names must be non-empty and unique).
  - **Player count only** — skip typing entirely: pick 2–5 and randomize;
    seats are labelled Player 1–N.
- **Faction pools** — toggle groups or expand a group and include/exclude
  individual factions:
  - Base game (14 factions)
  - Fire & Ice expansion (6 factions)
  - Fan Factions expansion, base-game factions (14 factions: Architects,
    Archivists, Atlanteans, Chash Dallah, Children of the Wyrm,
    Conspirators, Djinn, Dynion Geifr, The Enlightened, Goblins,
    Prospectors, Time Travelers, Treasurers, Wisps)
  - Fan Factions expansion, Fire & Ice factions (6 factions: Snow Shamans
    and Selkies on Ice, Firewalkers and Kingdom of Ember on Volcano,
    Changelings and Geologists with a variable home terrain)
- **Legal assignments** —
  - each player gets exactly one unique faction;
  - exclusivity rules are enforced (only one Ice, one Volcano and one
    Variable faction per game — official or fan — since they share terrain
    pieces, and the Geologists even use the Shapeshifter ring);
  - factions without a fixed home terrain (Fire & Ice) are randomly dealt a
    legal, unclaimed home terrain;
  - optional **strict terrain lock**: no two players may share a home
    terrain;
  - a randomized backtracking solver guarantees a legal setup is found
    whenever one exists, and validation blocks impossible setups up front.
- **Scoring tiles** — 6 unique tiles in round order; the Spade tile is never
  placed in rounds 5–6 (official rule).
- **Bonus cards** — players + 3 unique cards (players + 4 when the
  Archivists are in play, per their setup rule; the count also adjusts
  automatically when a faction reroll adds or removes them).
- **Board** — optionally pick from the original board, the Fire & Ice board
  and fan maps (Loon Lakes, Fjords). The two fan maps ship without artwork;
  drop `loonlakes.*` / `fjords.*` into `assets/boards/` to add it.
- **Rerolls** — **Reroll everything** redraws the whole setup (factions,
  tiles, cards and board) with the full reveal animation, keeping the same
  players and options. Or reroll just one part: all factions, a single
  player's faction, the scoring tiles, the bonus cards or the board.
  "New game" returns to the setup screen.
- **Reveal animation** — ~2.6 s card shuffle + staggered flip-in reveal
  (skipped for `prefers-reduced-motion`), with optional synthesized sound
  effects (muted by default).
- **Unbiased randomness** — `crypto.getRandomValues` with rejection
  sampling and Fisher–Yates shuffling (`js/random.js`).
- **Languages** — the interface is available in English, German, French and
  Spanish, picked from the header and remembered between visits (it also
  follows the browser's language on a first visit). Switching re-renders a
  result already on screen. See [Translations](#translations).

## Running it

### Local

```bash
git clone https://github.com/Cyber-MKO/terra-mystica-random.git
cd terra-mystica-random
```

Then simply **open `index.html` in a browser** — there is no build step and
no backend, and the app works offline after the first load. If you prefer a
local server (nicer URLs, no `file://` quirks):

```bash
python3 -m http.server 8000   # or: npx serve .
# then visit http://localhost:8000
```

### GitHub Pages

The repo ships with a workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. In the repository settings, open **Settings → Pages** and set
   **Source** to **GitHub Actions** (one-time step).
2. Push to the default branch (`main`/`master`) — the workflow publishes the
   site to `https://<user>.github.io/terra-mystica-random/`.

Manual alternative (no Actions): **Settings → Pages → Deploy from a
branch**, pick the default branch and `/ (root)` — the site is static, so
serving the repo root directly works.

### Cloud (Netlify)

No server-side code is needed, so any static host works. Netlify example:

1. Sign in at [netlify.com](https://netlify.com) and choose
   **Add new site → Import an existing project**.
2. Connect this GitHub repository.
3. Leave **Build command** empty and set **Publish directory** to `.` —
   deploy. Every push redeploys automatically.

Zero-config alternatives: `npx vercel` (Vercel), `firebase init hosting`
with `public: .` (Firebase), or sync the folder to an S3 bucket behind
CloudFront (`aws s3 sync . s3://<bucket> --exclude ".git/*"`).

## Artwork

Cards fall back to styled, terrain-colored placeholders wherever artwork is
absent. To add images, drop `.png`, `.jpg`, `.jpeg` or `.webp` files into
the `assets/` folders using the naming scheme in
[`assets/README.md`](assets/README.md) — they are picked up automatically,
with no code changes. Artwork committed to this repository was added by the
repository owner from their own copies of the game and its rulebooks.

## Translations

All interface text lives in [`js/i18n.js`](js/i18n.js) as plain key/value
objects. Missing keys fall back to English, so a partial translation is
always safe. To add a language, add an entry to `LANGUAGES` (id + native
name) and an object to `STRINGS` with whatever you can translate — no other
file changes.

The interface, terrain names and board names are translated. **Faction
names and the scoring-tile / bonus-card texts intentionally stay in
English**: they identify physical components, and shipping invented
translations would be worse than showing them as printed. They are already
keyed — `faction.<id>`, `tile.<id>.action`, `tile.<id>.cult`, `bonus.<id>` —
so if you have an edition in hand you can add the official wording to a
language object and it will be used immediately. Artwork lookup always uses
the untranslated name, so translations never change which image loads.

## Extending the data

All content lives in [`js/data.js`](js/data.js) as plain objects — no other
code changes are needed to:

- **add a fan faction**: append to `FACTIONS` with an `id`, `name`,
  `group` (`'fan'` or `'fireice-fan'`), a `terrain` id (or `null` for a
  randomly-dealt home terrain) and optional `excludes` ids;
- **add scoring tiles / bonus cards / boards**: append to the respective
  arrays (`notRounds` restricts which rounds a scoring tile may occupy).

The fan faction groups contain the 20 factions of the official
**Fan Factions** expansion (Feuerland Spiele / Capstone Games, rulebook
v1.1): 14 base-game factions (two per terrain color) and 6 Fire & Ice
factions (two Ice, two Volcano, two Variable). Card/tile texts are short
table-reference summaries; double-check wording against your physical
components (the randomizer only depends on identity, count and round
restrictions).

## Project layout

```
index.html            app shell (two screens + reveal overlay)
css/style.css         responsive styling, animations, terrain colors
js/i18n.js            interface translations (en/de/fr/es) + language switch
js/random.js          crypto-backed unbiased RNG (randInt/shuffle/sample)
js/data.js            factions, terrains, tiles, cards, boards
js/randomizer.js      pure selection logic (validation, backtracking, picks)
js/sound.js           synthesized WebAudio effects (muted by default)
js/ui.js              DOM rendering + reveal animation helpers
js/app.js             state + event wiring
assets/               drop-in artwork (placeholders used when absent)
.github/workflows/    GitHub Pages deployment
```

Plain ES5-compatible scripts (no modules) are used deliberately so the app
runs when `index.html` is opened directly from disk.
