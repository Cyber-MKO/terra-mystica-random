# Terra Mystica Randomizer

A responsive, static web app that randomizes a full **Terra Mystica** game
setup: factions (with legal home terrains), round scoring tiles, bonus cards
and — optionally — the game board. All randomization runs client-side with
cryptographically unbiased randomness, wrapped in a short dramatic reveal.

> Unofficial fan tool. Terra Mystica is © Feuerland Spiele /
> Helge Ostertag & Jens Drögemüller. No copyrighted artwork is included —
> see [Artwork](#artwork) for how to drop in your own images.

## Features

- **Players** — 2–5 by default, add more while the enabled faction pool
  allows it (names must be non-empty and unique).
- **Faction pools** — toggle groups (Base, Fire & Ice, Fan, Fire & Ice Fan)
  or expand a group and include/exclude individual factions.
- **Legal assignments** —
  - each player gets exactly one unique faction;
  - exclusivity rules are enforced (e.g. only one Ice, one Volcano and one
    Variable faction per game, since each pair shares terrain pieces);
  - factions without a fixed home terrain (Fire & Ice) are randomly dealt a
    legal, unclaimed home terrain;
  - optional **strict terrain lock**: no two players may share a home
    terrain;
  - a randomized backtracking solver guarantees a legal setup is found
    whenever one exists, and validation blocks impossible setups up front.
- **Scoring tiles** — 6 unique tiles in round order; the Spade tile is never
  placed in rounds 5–6 (official rule).
- **Bonus cards** — players + 3 unique cards.
- **Board** — optionally pick from the original board, the Fire & Ice board
  and fan maps (Loon Lakes, Fjords).
- **Rerolls** — reroll all factions, a single player's faction, the scoring
  tiles, the bonus cards or the board individually; "New game" resets.
- **Reveal animation** — ~2.6 s card shuffle + staggered flip-in reveal
  (skipped for `prefers-reduced-motion`), with optional synthesized sound
  effects (muted by default).
- **Unbiased randomness** — `crypto.getRandomValues` with rejection
  sampling and Fisher–Yates shuffling (`js/random.js`).

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

The app renders styled, terrain-colored placeholders out of the box. To use
original images, drop JPGs into the `assets/` folders using the naming
scheme described in [`assets/README.md`](assets/README.md) — files are
picked up automatically, and missing files fall back to placeholders.

## Extending the data

All content lives in [`js/data.js`](js/data.js) as plain objects — no other
code changes are needed to:

- **add a fan faction**: append to `FACTIONS` with an `id`, `name`,
  `group` (`'fan'` or `'fireice-fan'`), a `terrain` id (or `null` for a
  randomly-dealt home terrain) and optional `excludes` ids;
- **add scoring tiles / bonus cards / boards**: append to the respective
  arrays (`notRounds` restricts which rounds a scoring tile may occupy).

The shipped fan factions are illustrative samples — replace them with your
group's favourites. Card/tile texts are short table-reference summaries;
double-check wording against your physical components (the randomizer only
depends on identity, count and round restrictions).

## Project layout

```
index.html            app shell (two screens + reveal overlay)
css/style.css         responsive styling, animations, terrain colors
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
