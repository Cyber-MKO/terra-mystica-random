/**
 * DOM rendering helpers. All functions here only draw — game state lives in
 * app.js, game logic in randomizer.js.
 *
 * Images: every card tries to load an image from assets/. If no file is
 * found the styled placeholder underneath stays visible, so the app works
 * with zero assets and upgrades automatically when artwork is dropped in.
 */
(function (global) {
  'use strict';

  var D = global.TMData;

  /** Image formats accepted for drop-in artwork, tried in this order. */
  var IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /**
   * File names to try for an item, most likely first.
   *
   * Web servers (GitHub Pages included) are case-sensitive, and artwork is
   * commonly named after either the item id (`chaosmagicians.jpg`) or its
   * display name (`ChaosMagicians.png`), so both spellings are attempted in
   * every accepted format. An explicit `image` value in js/data.js — a bare
   * file name, with or without extension — always wins.
   */
  function imageCandidates(dir, item) {
    var names = [];
    function add(name) {
      if (name && names.indexOf(name) === -1) names.push(name);
    }
    add(item.image);
    add(item.id);
    // Display name with spaces and punctuation stripped, casing preserved.
    if (item.name) add(item.name.replace(/[^A-Za-z0-9]/g, ''));

    var paths = [];
    // Names that already carry an extension are used verbatim, first.
    names = names.filter(function (name) {
      if (!/\.[a-z0-9]+$/i.test(name)) return true;
      paths.push(dir + '/' + name);
      return false;
    });
    // Then sweep by format so the common ones are found with the fewest
    // misses, whichever spelling the file uses.
    IMAGE_EXTENSIONS.forEach(function (ext) {
      names.forEach(function (name) {
        paths.push(dir + '/' + name + '.' + ext);
      });
    });
    return paths;
  }

  /**
   * <img> that walks a candidate list until one loads, and removes itself
   * when none do (leaving the placeholder visible).
   */
  function optionalImage(candidates, alt) {
    var img = el('img');
    img.alt = alt || '';
    img.loading = 'lazy';
    var next = 0;
    function tryNext() {
      if (next >= candidates.length) { img.remove(); return; }
      img.src = candidates[next++];
    }
    img.addEventListener('error', tryNext);
    tryNext();
    return img;
  }

  function initials(name) {
    return name.split(/[\s(]+/).filter(Boolean).slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); }).join('');
  }

  function terrainColor(terrainId) {
    var t = D.TERRAINS[terrainId];
    return t ? t.color : '#555';
  }

  /* ---------------- faction result card ---------------- */

  /**
   * @param assignment { player, faction, terrain }
   * @param onReroll   callback for this seat's reroll button (or null)
   */
  function factionCard(assignment, onReroll) {
    var f = assignment.faction;
    var card = el('div', 'faction-card flip-in');
    card.style.setProperty('--terrain-color', terrainColor(assignment.terrain));

    var art = el('div', 'art');
    art.appendChild(el('span', 'initials', initials(f.name)));
    art.appendChild(optionalImage(imageCandidates('assets/factions', f), f.name + ' artwork'));
    card.appendChild(art);

    var meta = el('div', 'meta');
    meta.appendChild(el('p', 'player-name', assignment.player));
    meta.appendChild(el('h3', 'faction-name', f.name));

    var chip = el('span', 'terrain-chip');
    var dot = el('span', 'dot');
    dot.style.background = terrainColor(assignment.terrain);
    chip.appendChild(dot);
    var terrainName = D.TERRAINS[assignment.terrain].name;
    chip.appendChild(document.createTextNode(
      f.special ? f.special + ' · home: ' + terrainName : terrainName
    ));
    meta.appendChild(chip);

    if (onReroll) {
      var actions = el('div', 'actions');
      var btn = el('button', 'btn btn-icon', '🎲 Reroll');
      btn.type = 'button';
      btn.title = 'Reroll ' + assignment.player + "'s faction";
      btn.addEventListener('click', onReroll);
      actions.appendChild(btn);
      meta.appendChild(actions);
    }
    card.appendChild(meta);
    return card;
  }

  /* ---------------- tiles / cards / board ---------------- */

  // Landscape rectangle, like the physical scoring tiles (~300x165).
  function scoringTile(tile, roundNumber) {
    var node = el('div', 'tile tile-score flip-in');
    node.appendChild(el('p', 'round-label', 'Round ' + roundNumber));
    node.appendChild(el('p', 'tile-main', tile.action));
    node.appendChild(el('p', 'tile-sub', 'Cult: ' + tile.cult));
    node.appendChild(optionalImage(imageCandidates('assets/tiles', tile), 'Scoring tile ' + tile.id));
    return node;
  }

  // Tall narrow strip, like the physical bonus cards (~45x126 mm).
  function bonusCard(card) {
    var node = el('div', 'tile tile-tall flip-in');
    node.appendChild(el('p', 'round-label', card.id.toUpperCase()));
    node.appendChild(el('p', 'tile-main', card.text));
    node.appendChild(optionalImage(imageCandidates('assets/bonus', card), 'Bonus card ' + card.id));
    return node;
  }

  function boardCard(board) {
    var node = el('div', 'tile flip-in');
    node.appendChild(el('p', 'round-label', 'Game board'));
    node.appendChild(el('p', 'tile-main', board.name));
    node.appendChild(optionalImage(imageCandidates('assets/boards', board), board.name));
    return node;
  }

  /* ---------------- staggered rendering ---------------- */

  /**
   * Replace `container`'s children with `nodes`, revealing them one by one
   * for a short dramatic effect.
   *
   * Robustness: some browsers occasionally skip or fail to repaint delayed
   * CSS animations, leaving a card stuck invisible until a click forces a
   * repaint. So each card is snapped to its final visible state on
   * `animationend`, and a watchdog timer does the same for every card
   * shortly after the whole sequence should have finished.
   */
  function renderStaggered(container, nodes, stepMs) {
    container.innerHTML = '';
    var reduced = global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var step = stepMs || 120;

    function settle(node) {
      node.classList.remove('flip-in');
      node.style.animation = 'none';
      node.style.animationDelay = '';
      node.style.opacity = '1';
      node.style.transform = 'none';
    }

    nodes.forEach(function (node, i) {
      if (reduced) {
        settle(node);
      } else {
        node.style.animationDelay = (i * step) + 'ms';
        node.addEventListener('animationend', function () { settle(node); }, { once: true });
      }
      container.appendChild(node);
    });

    if (!reduced) {
      setTimeout(function () { nodes.forEach(settle); }, nodes.length * step + 900);
    }
  }

  /** Show the shuffle overlay for `durationMs`, then run `done`. */
  function playRevealAnimation(durationMs, done) {
    var overlay = document.getElementById('reveal-overlay');
    var reduced = global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { done(); return; }

    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    var ticker = setInterval(global.TMSound.tick, 220);
    setTimeout(function () {
      clearInterval(ticker);
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      global.TMSound.reveal();
      done();
    }, durationMs);
  }

  global.TMUI = {
    el: el,
    factionCard: factionCard,
    scoringTile: scoringTile,
    bonusCard: bonusCard,
    boardCard: boardCard,
    renderStaggered: renderStaggered,
    playRevealAnimation: playRevealAnimation,
    terrainColor: terrainColor
  };
})(window);
