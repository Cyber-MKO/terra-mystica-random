/**
 * Terra Mystica Randomizer — selection logic.
 *
 * Pure functions: no DOM access. All randomness comes from TMRandom
 * (crypto-backed, unbiased).
 */
(function (global) {
  'use strict';

  var D = global.TMData;
  var R = global.TMRandom;

  /* ------------------------------------------------------------------ *
   * Exclusion handling
   * ------------------------------------------------------------------ */

  /**
   * Build a symmetric exclusion map { factionId: Set(excludedIds) } from the
   * `excludes` arrays in the data. If A excludes B, B also excludes A even
   * if the data only declares one direction.
   */
  function buildExclusionMap(factions) {
    var map = {};
    factions.forEach(function (f) { map[f.id] = {}; });
    factions.forEach(function (f) {
      (f.excludes || []).forEach(function (other) {
        if (map[f.id]) map[f.id][other] = true;
        if (map[other]) map[other][f.id] = true;
      });
    });
    return map;
  }

  /**
   * Maximum number of players a pool can serve, accounting for mutual
   * exclusions: factions connected by exclusion rules form clusters, and
   * each fully mutually-exclusive cluster can supply at most one player.
   * (Clusters in the shipped data are cliques — Ice/Volcano/Variable pairs —
   * so cluster count is exact; for looser custom rules it is a safe lower
   * bound and the backtracking assigner remains the final authority.)
   */
  function poolCapacity(pool, options) {
    var exclusion = buildExclusionMap(pool);
    var seen = {};
    var capacity = 0;
    pool.forEach(function (f) {
      if (seen[f.id]) return;
      // Flood-fill the exclusion cluster containing f.
      var stack = [f.id];
      var cluster = [];
      while (stack.length) {
        var id = stack.pop();
        if (seen[id]) continue;
        seen[id] = true;
        cluster.push(id);
        Object.keys(exclusion[id] || {}).forEach(function (other) {
          if (!seen[other] && exclusion[other]) stack.push(other);
        });
      }
      capacity += 1; // each exclusion cluster supplies at most one faction
    });
    if (options && options.strictTerrain) {
      capacity = Math.min(capacity, D.TERRAIN_IDS.length);
    }
    return capacity;
  }

  /* ------------------------------------------------------------------ *
   * Faction assignment
   * ------------------------------------------------------------------ */

  /**
   * Legal home terrains for a faction given already-claimed terrains.
   *
   * - Fixed-terrain factions use their printed terrain. Under strict
   *   terrain lock the terrain must still be unclaimed.
   * - Variable factions (terrain === null) always choose from terrains not
   *   already claimed as a home terrain (matching the Fire & Ice rule that
   *   they claim an unused color).
   */
  function terrainOptions(faction, claimedTerrains, strict) {
    if (faction.terrain) {
      if (strict && claimedTerrains[faction.terrain]) return [];
      return [faction.terrain];
    }
    return D.TERRAIN_IDS.filter(function (t) { return !claimedTerrains[t]; });
  }

  /**
   * Assign one unique, legal faction (+ home terrain) to every player.
   *
   * Uses randomized backtracking: candidate order is crypto-shuffled, so
   * results are uniform-ish over legal assignments while guaranteeing that
   * a legal assignment is found whenever one exists.
   *
   * @param {string[]} players  player names, in seat order
   * @param {Object[]} pool     enabled factions
   * @param {Object}   options  { strictTerrain: boolean }
   * @param {Object[]} [fixed]  optional partial assignment to keep
   *                            (same length as players, null = reassign)
   * @returns {Object[]|null}   [{ player, faction, terrain }] or null
   */
  function assignFactions(players, pool, options, fixed) {
    var exclusion = buildExclusionMap(pool.concat(D.FACTIONS));
    var strict = !!(options && options.strictTerrain);
    var order = R.shuffle(pool);
    var result = new Array(players.length);
    var usedIds = {};
    var blocked = {};
    var claimed = {};

    // Pre-seed state from fixed assignments (used for single-player reroll).
    if (fixed) {
      fixed.forEach(function (a, i) {
        if (!a) return;
        result[i] = a;
        usedIds[a.faction.id] = true;
        claimed[a.terrain] = claimed[a.terrain] || 0;
        claimed[a.terrain]++;
        Object.keys(exclusion[a.faction.id] || {}).forEach(function (id) {
          blocked[id] = (blocked[id] || 0) + 1;
        });
      });
    }

    function claimedForStrict() {
      // strict lock cares about any claimed terrain; variable factions always
      // avoid claimed terrains regardless of the option.
      var m = {};
      Object.keys(claimed).forEach(function (t) { if (claimed[t] > 0) m[t] = true; });
      return m;
    }

    function backtrack(seat) {
      while (seat < players.length && result[seat]) seat++;
      if (seat >= players.length) return true;
      for (var i = 0; i < order.length; i++) {
        var f = order[i];
        if (usedIds[f.id] || blocked[f.id]) continue;
        var opts = R.shuffle(terrainOptions(f, claimedForStrict(), strict));
        for (var j = 0; j < opts.length; j++) {
          var t = opts[j];
          result[seat] = { player: players[seat], faction: f, terrain: t };
          usedIds[f.id] = true;
          claimed[t] = (claimed[t] || 0) + 1;
          Object.keys(exclusion[f.id] || {}).forEach(function (id) {
            blocked[id] = (blocked[id] || 0) + 1;
          });
          if (backtrack(seat + 1)) return true;
          // undo
          result[seat] = null;
          delete usedIds[f.id];
          claimed[t]--;
          Object.keys(exclusion[f.id] || {}).forEach(function (id) {
            blocked[id]--;
            if (!blocked[id]) delete blocked[id];
          });
        }
      }
      return false;
    }

    if (!backtrack(0)) return null;

    // Post-pass: variable factions claim an *unused* color (Fire & Ice rule).
    // Backtracking assigns seats in order, so a fixed-terrain faction dealt
    // later can land on a terrain a variable faction already took. When that
    // happens and a free terrain exists, move the variable faction there.
    result.forEach(function (a) {
      if (a.faction.terrain) return; // fixed-terrain factions never move
      var clash = result.some(function (b) { return b !== a && b.terrain === a.terrain; });
      if (!clash) return;
      var taken = {};
      result.forEach(function (b) { if (b !== a) taken[b.terrain] = true; });
      var free = D.TERRAIN_IDS.filter(function (t) { return !taken[t]; });
      if (free.length) a.terrain = free[R.randInt(free.length)];
    });

    return result;
  }

  /**
   * Reroll a single seat, keeping everyone else's faction. The new faction
   * is guaranteed to differ from the current one when an alternative exists.
   */
  function rerollOne(players, pool, options, assignments, seatIndex) {
    var current = assignments[seatIndex];
    var fixed = assignments.map(function (a, i) { return i === seatIndex ? null : a; });
    var poolWithoutCurrent = pool.filter(function (f) { return f.id !== current.faction.id; });
    var attempt = assignFactions(players, poolWithoutCurrent, options, fixed);
    if (attempt) return attempt;
    // No alternative faction fits — keep the pool as-is (may re-deal terrain
    // for a variable faction, or return the same faction).
    return assignFactions(players, pool, options, fixed);
  }

  /* ------------------------------------------------------------------ *
   * Tiles, cards, board
   * ------------------------------------------------------------------ */

  /**
   * Pick scoring tiles in round order, honoring per-tile round restrictions
   * (e.g. the Spade tile may not be in rounds 5–6).
   */
  function pickScoringTiles(tiles, count) {
    count = Math.min(count || D.SCORING_TILE_COUNT, tiles.length);
    for (var attempt = 0; attempt < 200; attempt++) {
      var picked = R.sample(tiles, count);
      var legal = picked.every(function (tile, i) {
        return !(tile.notRounds && tile.notRounds.indexOf(i + 1) !== -1);
      });
      if (legal) return picked;
    }
    // Deterministic fallback: place restricted tiles first in legal slots.
    var restricted = tiles.filter(function (t) { return t.notRounds; });
    var rest = R.shuffle(tiles.filter(function (t) { return !t.notRounds; }));
    var slots = new Array(count).fill(null);
    restricted.slice(0, count).forEach(function (tile) {
      for (var i = 0; i < count; i++) {
        if (!slots[i] && tile.notRounds.indexOf(i + 1) === -1) { slots[i] = tile; return; }
      }
    });
    for (var i = 0; i < count; i++) if (!slots[i]) slots[i] = rest.pop();
    return slots;
  }

  /**
   * Bonus cards used in a game: players + 3, or players + 4 when the
   * Archivists are in play (their setup rule adds one extra card).
   * Capped at pool size.
   */
  function pickBonusCards(cards, playerCount, assignments) {
    var extra = D.BONUS_CARD_EXTRA;
    if (assignments && assignments.some(function (a) {
      return a && a.faction.id === 'archivists';
    })) extra += 1;
    var n = Math.min(playerCount + extra, cards.length);
    return R.sample(cards, n);
  }

  function pickBoard(boards) {
    return boards.length ? R.pick(boards) : null;
  }

  /* ------------------------------------------------------------------ *
   * Validation
   * ------------------------------------------------------------------ */

  /**
   * Validate a setup before randomizing.
   *
   * Returns an array of `{ key, params }` problems (empty = valid). Keys are
   * translation ids resolved by the caller, so this stays language-agnostic.
   */
  function validateSetup(players, pool, options) {
    var errors = [];
    var names = players.map(function (p) { return p.trim(); });

    if (names.length < D.MIN_PLAYERS) {
      errors.push({ key: 'err.minPlayers', params: { n: D.MIN_PLAYERS } });
    }
    if (names.length > D.MAX_PLAYERS) {
      errors.push({ key: 'err.maxPlayers', params: { n: D.MAX_PLAYERS } });
    }
    if (names.some(function (n) { return !n; })) {
      errors.push({ key: 'err.emptyName' });
    }
    var lower = names.map(function (n) { return n.toLowerCase(); });
    var dupes = lower.filter(function (n, i) { return n && lower.indexOf(n) !== i; });
    if (dupes.length) {
      errors.push({ key: 'err.duplicateNames' });
    }
    if (!pool.length) {
      errors.push({ key: 'err.noFactions' });
    } else {
      var capacity = poolCapacity(pool, options);
      if (capacity < names.length) {
        errors.push({
          key: (options && options.strictTerrain) ? 'err.capacityStrict' : 'err.capacity',
          params: { capacity: capacity, players: names.length }
        });
      }
    }
    return errors;
  }

  global.TMLogic = {
    buildExclusionMap: buildExclusionMap,
    poolCapacity: poolCapacity,
    assignFactions: assignFactions,
    rerollOne: rerollOne,
    pickScoringTiles: pickScoringTiles,
    pickBonusCards: pickBonusCards,
    pickBoard: pickBoard,
    validateSetup: validateSetup
  };
})(window);
