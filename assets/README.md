# Artwork assets

The app ships **without** copyrighted artwork: every card renders a styled,
terrain-colored placeholder. If you own the game (or have rights to use the
images), drop image files into these folders and the app picks them up
automatically — no code changes needed. A missing file simply keeps the
placeholder.

**Accepted formats:** `.png`, `.jpg`, `.jpeg` and `.webp` — mix them freely,
the app tries each format until one loads.

| Folder      | File name pattern  | Examples                                  |
|-------------|--------------------|-------------------------------------------|
| `factions/` | `<faction-id>`     | `factions/halflings.png`, `Halflings.png` |
| `tiles/`    | `<tile-id>`        | `tiles/score1.jpg`                        |
| `bonus/`    | `<card-id>`        | `bonus/bon4.png`                          |
| `boards/`   | `<board-id>`       | `boards/original.jpg`                     |

**File name casing:** web servers are case-sensitive. For factions, both the
lowercase id (`chaosmagicians.png`) and the display name with spaces removed
(`ChaosMagicians.png`) are recognised, so either export convention works.

**Any other file name:** add an `image` value to the entry in
[`js/data.js`](../js/data.js) and it is used as-is, e.g.
`{ id: 'nomads', name: 'Nomads', image: 'nomads-alt-art.png', … }`.

The ids are defined in [`js/data.js`](../js/data.js) — check that file for
the full list (e.g. faction ids `halflings`, `cultists`, …, `shapeshifters`,
plus Fan Factions expansion ids like `architects`, `djinn`, `snowshamans`;
scoring tiles `score1`–`score9`; bonus cards `bon1`–`bon10`; boards
`original`, `fireice`, `loonlakes`, `fjords`).

Recommended sizes (matching the physical component shapes the app now
renders): factions ~400×300px, scoring tiles ~300×165px (landscape),
bonus cards ~200×595px (tall strip, like the real ~45×126 mm cards),
boards ~600×400px. Other aspect ratios still work — images are cropped
with `object-fit: cover`.
