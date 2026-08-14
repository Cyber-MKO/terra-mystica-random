/**
 * Terra Mystica Randomizer — game content data.
 *
 * Everything the randomizer knows about factions, terrains, scoring tiles,
 * bonus cards and boards lives in this file. To add fan content, append
 * entries to the arrays below — the UI and randomizer pick them up
 * automatically.
 *
 * Faction schema:
 *   id        unique string id (also used for image lookup: assets/factions/<id>.jpg)
 *   name      display name
 *   group     'base' | 'fireice' | 'fan' | 'fireice-fan'
 *   terrain   terrain id, or null if the faction has no fixed home terrain
 *             (a legal terrain is randomly assigned at setup)
 *   special   optional label shown instead of a terrain color (e.g. "Ice")
 *   excludes  array of faction ids that may NOT be in the same game
 *             (enforced symmetrically by the randomizer)
 *
 * NOTE: card/tile rule texts are short human-readable summaries for table
 * reference. Verify wording against your physical components; the
 * randomizer only cares about identity, count and round restrictions.
 */
(function (global) {
  'use strict';

  var TERRAINS = {
    plains:    { id: 'plains',    name: 'Plains',    color: '#a5692b' },
    swamp:     { id: 'swamp',     name: 'Swamp',     color: '#3d3a38' },
    lakes:     { id: 'lakes',     name: 'Lakes',     color: '#2e6db4' },
    forest:    { id: 'forest',    name: 'Forest',    color: '#2e7d32' },
    mountains: { id: 'mountains', name: 'Mountains', color: '#8d8d93' },
    wasteland: { id: 'wasteland', name: 'Wasteland', color: '#b03a2e' },
    desert:    { id: 'desert',    name: 'Desert',    color: '#d9a62e' }
  };

  var FACTION_GROUPS = {
    'base':        { id: 'base',        name: 'Base Game Factions' },
    'fireice':     { id: 'fireice',     name: 'Fire & Ice Factions' },
    'fan':         { id: 'fan',         name: 'Fan Factions' },
    'fireice-fan': { id: 'fireice-fan', name: 'Fire & Ice Fan Factions' }
  };

  var FACTIONS = [
    // ---- Base game (14) -------------------------------------------------
    { id: 'halflings',      name: 'Halflings',       group: 'base', terrain: 'plains' },
    { id: 'cultists',       name: 'Cultists',        group: 'base', terrain: 'plains' },
    { id: 'alchemists',     name: 'Alchemists',      group: 'base', terrain: 'swamp' },
    { id: 'darklings',      name: 'Darklings',       group: 'base', terrain: 'swamp' },
    { id: 'mermaids',       name: 'Mermaids',        group: 'base', terrain: 'lakes' },
    { id: 'swarmlings',     name: 'Swarmlings',      group: 'base', terrain: 'lakes' },
    { id: 'witches',        name: 'Witches',         group: 'base', terrain: 'forest' },
    { id: 'auren',          name: 'Auren',           group: 'base', terrain: 'forest' },
    { id: 'dwarves',        name: 'Dwarves',         group: 'base', terrain: 'mountains' },
    { id: 'engineers',      name: 'Engineers',       group: 'base', terrain: 'mountains' },
    { id: 'giants',         name: 'Giants',          group: 'base', terrain: 'wasteland' },
    { id: 'chaosmagicians', name: 'Chaos Magicians', group: 'base', terrain: 'wasteland' },
    { id: 'fakirs',         name: 'Fakirs',          group: 'base', terrain: 'desert' },
    { id: 'nomads',         name: 'Nomads',          group: 'base', terrain: 'desert' },

    // ---- Fire & Ice (6) -------------------------------------------------
    // These factions have no fixed home terrain: they claim a color at
    // setup. Only one Ice, one Volcano and one Variable faction may be in
    // the same game because each pair shares terrain pieces.
    { id: 'icemaidens',    name: 'Ice Maidens',   group: 'fireice', terrain: null, special: 'Ice',      excludes: ['yetis'] },
    { id: 'yetis',         name: 'Yetis',         group: 'fireice', terrain: null, special: 'Ice',      excludes: ['icemaidens'] },
    { id: 'acolytes',      name: 'Acolytes',      group: 'fireice', terrain: null, special: 'Volcano',  excludes: ['dragonlords'] },
    { id: 'dragonlords',   name: 'Dragonlords',   group: 'fireice', terrain: null, special: 'Volcano',  excludes: ['acolytes'] },
    { id: 'riverwalkers',  name: 'Riverwalkers',  group: 'fireice', terrain: null, special: 'Variable', excludes: ['shapeshifters'] },
    { id: 'shapeshifters', name: 'Shapeshifters', group: 'fireice', terrain: null, special: 'Variable', excludes: ['riverwalkers'] },

    // ---- Fan factions (sample set — replace/extend freely) --------------
    // These are illustrative entries so the group works out of the box.
    // Swap in your favourite community factions by editing this list.
    { id: 'trolls',   name: 'Trolls (fan)',   group: 'fan', terrain: 'mountains' },
    { id: 'druids',   name: 'Druids (fan)',   group: 'fan', terrain: 'forest' },
    { id: 'corsairs', name: 'Corsairs (fan)', group: 'fan', terrain: 'lakes' },
    { id: 'seers',    name: 'Seers (fan)',    group: 'fan', terrain: 'desert' },

    // ---- Fire & Ice fan factions (sample set) ---------------------------
    // Fan factions built on the Fire & Ice terrain mechanics. They share
    // terrain pieces with the official Ice/Volcano factions, so they
    // exclude them (and each other) accordingly.
    { id: 'frostgiants', name: 'Frost Giants (fan)', group: 'fireice-fan', terrain: null, special: 'Ice',
      excludes: ['icemaidens', 'yetis'] },
    { id: 'ashwalkers',  name: 'Ash Walkers (fan)',  group: 'fireice-fan', terrain: null, special: 'Volcano',
      excludes: ['acolytes', 'dragonlords'] }
  ];

  /**
   * Scoring tiles. `notRounds` lists 1-based round numbers the tile may not
   * occupy (official rule: the Spade tile may not score in rounds 5 or 6).
   */
  var SCORING_TILES = [
    { id: 'score1', group: 'base',    action: 'Spade » 2 VP',                  cult: 'Earth 4 → 1 Spade',  notRounds: [5, 6] },
    { id: 'score2', group: 'base',    action: 'Town » 5 VP',                   cult: 'Earth 4 → 1 Spade' },
    { id: 'score3', group: 'base',    action: 'Dwelling » 2 VP',               cult: 'Water 4 → 1 Priest' },
    { id: 'score4', group: 'base',    action: 'Stronghold/Sanctuary » 5 VP',   cult: 'Fire 2 → 1 Worker' },
    { id: 'score5', group: 'base',    action: 'Dwelling » 2 VP',               cult: 'Fire 4 → 4 Power' },
    { id: 'score6', group: 'base',    action: 'Trading House » 3 VP',          cult: 'Water 4 → 1 Spade' },
    { id: 'score7', group: 'base',    action: 'Stronghold/Sanctuary » 5 VP',   cult: 'Air 4 → 1 Worker' },
    { id: 'score8', group: 'base',    action: 'Trading House » 3 VP',          cult: 'Air 4 → 1 Spade' },
    { id: 'score9', group: 'fireice', action: 'Temple » 2 VP',                 cult: 'Priest 1 → 2 Coins' }
  ];

  /**
   * Bonus cards. A game uses (players + 3) cards.
   */
  var BONUS_CARDS = [
    { id: 'bon1',  group: 'base',    text: 'Special action: 1 Spade • Income: 2 Coins' },
    { id: 'bon2',  group: 'base',    text: 'Special action: 1 Cult advance • Income: 4 Coins' },
    { id: 'bon3',  group: 'base',    text: 'Income: 6 Coins' },
    { id: 'bon4',  group: 'base',    text: 'Income: 3 Power • +1 Shipping while held' },
    { id: 'bon5',  group: 'base',    text: 'Income: 3 Power, 1 Worker' },
    { id: 'bon6',  group: 'base',    text: 'Income: 2 Workers • Pass: 4 VP per Stronghold/Sanctuary' },
    { id: 'bon7',  group: 'base',    text: 'Income: 1 Worker • Pass: 2 VP per Trading House' },
    { id: 'bon8',  group: 'base',    text: 'Income: 1 Priest' },
    { id: 'bon9',  group: 'base',    text: 'Income: 2 Coins • Pass: 1 VP per Dwelling' },
    { id: 'bon10', group: 'fireice', text: 'Pass: 3 VP per Shipping level' }
  ];

  /**
   * Boards. Loon Lakes and Fjords are well-known community maps.
   */
  var BOARDS = [
    { id: 'original', name: 'Original Terra Mystica board', group: 'base' },
    { id: 'fireice',  name: 'Fire & Ice board',             group: 'fireice' },
    { id: 'loonlakes', name: 'Loon Lakes (fan map)',        group: 'fan' },
    { id: 'fjords',    name: 'Fjords (fan map)',            group: 'fan' }
  ];

  global.TMData = {
    TERRAINS: TERRAINS,
    TERRAIN_IDS: Object.keys(TERRAINS),
    FACTION_GROUPS: FACTION_GROUPS,
    FACTIONS: FACTIONS,
    SCORING_TILES: SCORING_TILES,
    BONUS_CARDS: BONUS_CARDS,
    BOARDS: BOARDS,
    SCORING_TILE_COUNT: 6,
    BONUS_CARD_EXTRA: 3, // cards used = players + 3
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 7
  };
})(window);
