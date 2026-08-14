# Artwork assets

The app ships **without** copyrighted artwork: every card renders a styled,
terrain-colored placeholder. If you own the game (or have rights to use the
images), drop JPG files into these folders and the app picks them up
automatically — no code changes needed. A missing file simply keeps the
placeholder.

| Folder      | File name pattern      | Example                        |
|-------------|------------------------|--------------------------------|
| `factions/` | `<faction-id>.jpg`     | `factions/halflings.jpg`       |
| `tiles/`    | `<tile-id>.jpg`        | `tiles/score1.jpg`             |
| `bonus/`    | `<card-id>.jpg`        | `bonus/bon4.jpg`               |
| `boards/`   | `<board-id>.jpg`       | `boards/original.jpg`          |

The ids are defined in [`js/data.js`](../js/data.js) — check that file for
the full list (e.g. faction ids `halflings`, `cultists`, …, `shapeshifters`;
scoring tiles `score1`–`score9`; bonus cards `bon1`–`bon10`; boards
`original`, `fireice`, `loonlakes`, `fjords`).

Recommended sizes: factions ~400×300px, tiles/cards ~300×200px,
boards ~600×400px. Any aspect ratio works — images are cropped with
`object-fit: cover`.
