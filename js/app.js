/**
 * Application controller: owns setup + result state and wires the DOM to
 * the randomizer (TMLogic) and renderer (TMUI).
 */
(function (global) {
  'use strict';

  var D = global.TMData;
  var L = global.TMLogic;
  var UI = global.TMUI;
  var I18N = global.TMI18n;
  var t = function (key, params, fallback) { return I18N.t(key, params, fallback); };

  var REVEAL_MS = 2600; // total suspense animation, within the 2–4s budget

  /** Per-faction enabled flags; group toggles flip these in bulk. */
  var factionEnabled = {};
  D.FACTIONS.forEach(function (f) {
    factionEnabled[f.id] = (f.group === 'base'); // base game on by default
  });

  /** Current game result (null until first randomize). */
  var game = null;

  /* =================================================================== *
   * Setup screen — players
   * =================================================================== */

  var playerList = document.getElementById('player-list');

  function playerInputs() {
    return Array.prototype.slice.call(playerList.querySelectorAll('input[type="text"]'));
  }

  /**
   * Seat labels for the current setup mode: the typed names in "names" mode,
   * or generated "Player N" labels when only a player count was chosen.
   */
  function playerNames() {
    if (!nameMode) {
      var out = [];
      for (var i = 1; i <= playerCount; i++) out.push(t('setup.seatLabel', { n: i }));
      return out;
    }
    return playerInputs().map(function (i) { return i.value.trim(); });
  }

  function addPlayerRow(name) {
    var row = UI.el('div', 'player-row');
    var input = UI.el('input');
    input.type = 'text';
    input.placeholder = t('setup.playerPlaceholder', { n: playerList.children.length + 1 });
    input.value = name || '';
    input.maxLength = 30;
    row.appendChild(input);

    var remove = UI.el('button', 'btn btn-icon remove', '✕');
    remove.type = 'button';
    remove.title = t('setup.removePlayer');
    remove.addEventListener('click', function () {
      if (playerList.children.length > D.MIN_PLAYERS) {
        row.remove();
        refreshCapacityHint();
      }
    });
    row.appendChild(remove);
    playerList.appendChild(row);
    refreshCapacityHint();
  }

  document.getElementById('add-player').addEventListener('click', function () {
    if (playerList.children.length >= D.MAX_PLAYERS) return;
    addPlayerRow();
  });

  /* ---------------- setup mode: names vs. player count ---------------- */

  var nameMode = true;       // true = type names, false = pick a count only
  var playerCount = 4;       // used in count mode

  var namesPane = document.getElementById('names-pane');
  var countPane = document.getElementById('count-pane');
  var btnNames = document.getElementById('mode-names');
  var btnCount = document.getElementById('mode-count');

  function setMode(useNames) {
    nameMode = useNames;
    namesPane.hidden = !useNames;
    countPane.hidden = useNames;
    btnNames.classList.toggle('on', useNames);
    btnCount.classList.toggle('on', !useNames);
    btnNames.setAttribute('aria-pressed', String(useNames));
    btnCount.setAttribute('aria-pressed', String(!useNames));
    showErrors([]);
    refreshCapacityHint();
  }
  btnNames.addEventListener('click', function () { setMode(true); });
  btnCount.addEventListener('click', function () { setMode(false); });

  // Player-count buttons (MIN_PLAYERS..MAX_PLAYERS).
  var countPicker = document.getElementById('count-picker');
  var countButtons = [];
  for (var n = D.MIN_PLAYERS; n <= D.MAX_PLAYERS; n++) {
    (function (value) {
      var b = UI.el('button', 'count-btn', String(value));
      b.type = 'button';
      b.setAttribute('aria-label', value + ' players');
      b.addEventListener('click', function () {
        playerCount = value;
        countButtons.forEach(function (x) {
          x.btn.classList.toggle('on', x.value === value);
          x.btn.setAttribute('aria-pressed', String(x.value === value));
        });
        showErrors([]);
        refreshCapacityHint();
      });
      countPicker.appendChild(b);
      countButtons.push({ value: value, btn: b });
    })(n);
  }
  countButtons.forEach(function (x) {
    x.btn.classList.toggle('on', x.value === playerCount);
    x.btn.setAttribute('aria-pressed', String(x.value === playerCount));
  });

  /* =================================================================== *
   * Setup screen — faction pools
   * =================================================================== */

  var groupsRoot = document.getElementById('faction-groups');

  function enabledPool() {
    return D.FACTIONS.filter(function (f) { return factionEnabled[f.id]; });
  }

  function currentOptions() {
    return {
      strictTerrain: document.getElementById('opt-strict-terrain').checked,
      randomBoard: document.getElementById('opt-random-board').checked,
      fireIceTiles: document.getElementById('opt-fireice-tiles').checked
    };
  }

  function refreshCapacityHint() {
    var hint = document.getElementById('capacity-hint');
    var capacity = L.poolCapacity(enabledPool(), currentOptions());
    hint.textContent = t('setup.capacity', { n: Math.min(capacity, D.MAX_PLAYERS) });
  }

  function buildGroupUI(group) {
    var factions = D.FACTIONS.filter(function (f) { return f.group === group.id; });
    var wrap = UI.el('div', 'group');

    var head = UI.el('div', 'group-head');
    var master = UI.el('input');
    master.type = 'checkbox';
    master.title = t('setup.pools.groupToggle');
    head.appendChild(master);
    head.appendChild(UI.el('span', 'group-name', t('group.' + group.id, null, group.name)));
    var count = UI.el('span', 'count');
    head.appendChild(count);
    head.appendChild(UI.el('span', 'chev', '▸'));
    wrap.appendChild(head);

    var body = UI.el('div', 'group-body');
    var chips = factions.map(function (f) {
      var chip = UI.el('span', 'faction-chip');
      chip.setAttribute('role', 'checkbox');
      chip.tabIndex = 0;
      var dot = UI.el('span', 'dot');
      dot.style.background = f.terrain ? UI.terrainColor(f.terrain) : 'linear-gradient(135deg,#7ec8e3 50%,#b03a2e 50%)';
      chip.appendChild(dot);
      chip.appendChild(document.createTextNode(
        UI.factionName(f) + (f.special ? ' · ' + t('special.' + f.special.toLowerCase()) : '')));
      function sync() {
        chip.classList.toggle('on', !!factionEnabled[f.id]);
        chip.setAttribute('aria-checked', String(!!factionEnabled[f.id]));
      }
      function toggle() {
        factionEnabled[f.id] = !factionEnabled[f.id];
        sync();
        syncMaster();
        refreshCapacityHint();
      }
      chip.addEventListener('click', toggle);
      chip.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
      });
      sync();
      return { faction: f, chip: chip, sync: sync };
    });
    chips.forEach(function (c) { body.appendChild(c.chip); });
    wrap.appendChild(body);

    function syncMaster() {
      var on = factions.filter(function (f) { return factionEnabled[f.id]; }).length;
      master.checked = on > 0;
      master.indeterminate = on > 0 && on < factions.length;
      count.textContent = on + '/' + factions.length;
    }

    master.addEventListener('click', function (e) {
      e.stopPropagation();
      var turnOn = master.checked;
      factions.forEach(function (f) { factionEnabled[f.id] = turnOn; });
      chips.forEach(function (c) { c.sync(); });
      syncMaster();
      refreshCapacityHint();
    });
    head.addEventListener('click', function (e) {
      if (e.target === master) return;
      wrap.classList.toggle('open');
    });
    syncMaster();
    return wrap;
  }

  Object.keys(D.FACTION_GROUPS).forEach(function (id) {
    groupsRoot.appendChild(buildGroupUI(D.FACTION_GROUPS[id]));
  });

  document.getElementById('opt-strict-terrain')
    .addEventListener('change', refreshCapacityHint);
  var soundToggle = document.getElementById('opt-sound');
  soundToggle.addEventListener('change', function (e) {
    global.TMSound.setEnabled(e.target.checked);
  });
  global.TMSound.setEnabled(soundToggle.checked);   // honour the default

  /* =================================================================== *
   * Randomize flow
   * =================================================================== */

  function showErrors(errors) {
    var box = document.getElementById('setup-errors');
    if (!errors.length) { box.hidden = true; return; }
    box.innerHTML = '';
    var ul = UI.el('ul');
    errors.forEach(function (e) {
      ul.appendChild(UI.el('li', null, typeof e === 'string' ? e : t(e.key, e.params)));
    });
    box.appendChild(ul);
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function tilePools(options) {
    var filter = function (item) {
      return item.group === 'base' || (options.fireIceTiles && item.group === 'fireice');
    };
    return {
      scoring: D.SCORING_TILES.filter(filter),
      bonus: D.BONUS_CARDS.filter(filter),
      boards: D.BOARDS // board pool is independent of the tile toggle
    };
  }

  /**
   * Draw every part of a setup at once: factions, scoring tiles, bonus
   * cards and (when enabled) the board.
   *
   * @returns {Object|null} a full game state, or null when no legal faction
   *                        assignment exists for the pool.
   */
  function rollGame(names, options, pool) {
    var assignments = L.assignFactions(names, pool, options);
    if (!assignments) return null;
    var pools = tilePools(options);
    return {
      names: names,
      options: options,
      pool: pool,
      pools: pools,
      assignments: assignments,
      scoringTiles: L.pickScoringTiles(pools.scoring),
      bonusCards: L.pickBonusCards(pools.bonus, names.length, assignments),
      board: options.randomBoard ? L.pickBoard(pools.boards) : null
    };
  }


  document.getElementById('randomize').addEventListener('click', function () {
    var names = playerNames();
    var options = currentOptions();
    var pool = enabledPool();

    var errors = L.validateSetup(names, pool, options);
    if (errors.length) { showErrors(errors); return; }
    showErrors([]);

    var next = rollGame(names, options, pool);
    if (!next) { showErrors([{ key: 'err.noAssignment' }]); return; }
    game = next;

    UI.playRevealAnimation(REVEAL_MS, function () {
      document.getElementById('setup-screen').hidden = true;
      document.getElementById('result-screen').hidden = false;
      renderResults();
      global.scrollTo({ top: 0 });
    });
  });

  /* =================================================================== *
   * Results rendering + rerolls
   * =================================================================== */

  function renderFactions() {
    var nodes = game.assignments.map(function (a, i) {
      return UI.factionCard(a, function () { rerollSeat(i); });
    });
    UI.renderStaggered(document.getElementById('result-players'), nodes, 150);
  }

  function renderTiles() {
    var nodes = game.scoringTiles.map(function (t, i) { return UI.scoringTile(t, i + 1); });
    UI.renderStaggered(document.getElementById('result-tiles'), nodes, 100);
  }

  function renderBonus() {
    var nodes = game.bonusCards.map(function (c) { return UI.bonusCard(c); });
    UI.renderStaggered(document.getElementById('result-bonus'), nodes, 100);
  }

  function renderBoard() {
    var panel = document.getElementById('board-panel');
    panel.hidden = !game.board;
    if (game.board) {
      UI.renderStaggered(document.getElementById('result-board'), [UI.boardCard(game.board)], 0);
    }
  }

  function renderResults() {
    renderFactions();
    renderTiles();
    renderBonus();
    renderBoard();
  }

  /**
   * The Archivists' setup rule adds one bonus card (players + 4 instead of
   * players + 3), so a faction change can alter how many cards are in the
   * game. Re-deal the bonus cards if the required count no longer matches.
   */
  function syncBonusCardCount() {
    var fresh = L.pickBonusCards(game.pools.bonus, game.names.length, game.assignments);
    if (fresh.length !== game.bonusCards.length) {
      game.bonusCards = fresh;
      renderBonus();
    }
  }

  function rerollSeat(i) {
    var next = L.rerollOne(game.names, game.pool, game.options, game.assignments, i);
    if (next) game.assignments = next;
    global.TMSound.reveal();
    renderFactions();
    syncBonusCardCount();
  }

  document.getElementById('reroll-factions').addEventListener('click', function () {
    var next = L.assignFactions(game.names, game.pool, game.options);
    if (next) game.assignments = next;
    global.TMSound.reveal();
    renderFactions();
    syncBonusCardCount();
  });

  document.getElementById('reroll-tiles').addEventListener('click', function () {
    game.scoringTiles = L.pickScoringTiles(game.pools.scoring);
    global.TMSound.reveal();
    renderTiles();
  });

  document.getElementById('reroll-bonus').addEventListener('click', function () {
    game.bonusCards = L.pickBonusCards(game.pools.bonus, game.names.length, game.assignments);
    global.TMSound.reveal();
    renderBonus();
  });

  document.getElementById('reroll-board').addEventListener('click', function () {
    game.board = L.pickBoard(game.pools.boards);
    global.TMSound.reveal();
    renderBoard();
  });

  // Redraw the entire setup — same players, pools and options — with the
  // full suspense animation, as if "Randomize" had been pressed again.
  document.getElementById('reroll-all').addEventListener('click', function () {
    var next = rollGame(game.names, game.options, game.pool);
    if (!next) return;   // pool was already proven solvable, so this is rare
    game = next;
    UI.playRevealAnimation(REVEAL_MS, function () {
      renderResults();
      global.scrollTo({ top: 0 });
    });
  });

  document.getElementById('new-game').addEventListener('click', function () {
    document.getElementById('result-screen').hidden = true;
    document.getElementById('setup-screen').hidden = false;
    global.scrollTo({ top: 0 });
  });

  /* =================================================================== *
   * Boot
   * =================================================================== */

  addPlayerRow();
  addPlayerRow();

  /* =================================================================== *
   * Language
   * =================================================================== */

  var langSelect = document.getElementById('lang-select');
  I18N.LANGUAGES.forEach(function (lang) {
    var opt = UI.el('option', null, lang.name);
    opt.value = lang.id;
    langSelect.appendChild(opt);
  });
  langSelect.value = I18N.getLanguage();
  langSelect.addEventListener('change', function () {
    I18N.setLanguage(langSelect.value);
  });

  /**
   * Re-render everything that holds translated text: the static markup, the
   * player rows, the faction pool list (rebuilt, keeping the enabled flags,
   * which live in factionEnabled) and any results already on screen.
   */
  I18N.onChange(function () {
    I18N.applyStatic();

    playerInputs().forEach(function (input, i) {
      input.placeholder = t('setup.playerPlaceholder', { n: i + 1 });
    });
    playerList.querySelectorAll('.remove').forEach(function (b) {
      b.title = t('setup.removePlayer');
    });

    var openGroups = {};
    Array.prototype.forEach.call(groupsRoot.children, function (node, i) {
      openGroups[i] = node.classList.contains('open');
    });
    groupsRoot.innerHTML = '';
    Object.keys(D.FACTION_GROUPS).forEach(function (id, i) {
      var node = buildGroupUI(D.FACTION_GROUPS[id]);
      if (openGroups[i]) node.classList.add('open');
      groupsRoot.appendChild(node);
    });

    refreshCapacityHint();
    if (game && !document.getElementById('result-screen').hidden) renderResults();
  });

  I18N.applyStatic();
  document.documentElement.lang = I18N.getLanguage();
  refreshCapacityHint();
})(window);
