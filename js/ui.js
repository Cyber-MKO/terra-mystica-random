/**
 * DOM rendering helpers. All functions here only draw — game state lives in
 * app.js, game logic in randomizer.js.
 *
 * Images: every card tries to load an image from assets/ (see paths below).
 * If the file is missing, the styled placeholder underneath stays visible,
 * so the app works with zero assets and upgrades automatically when
 * official artwork is dropped in.
 */
(function (global) {
  'use strict';

  var D = global.TMData;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /** <img> that removes itself if the asset file is missing. */
  function optionalImage(src, alt) {
    var img = el('img');
    img.src = src;
    img.alt = alt || '';
    img.loading = 'lazy';
    img.addEventListener('error', function () { img.remove(); });
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
    art.appendChild(optionalImage('assets/factions/' + f.id + '.jpg', f.name + ' artwork'));
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
    node.appendChild(optionalImage('assets/tiles/' + tile.id + '.jpg', 'Scoring tile ' + tile.id));
    return node;
  }

  // Tall narrow strip, like the physical bonus cards (~45x126 mm).
  function bonusCard(card) {
    var node = el('div', 'tile tile-tall flip-in');
    node.appendChild(el('p', 'round-label', card.id.toUpperCase()));
    node.appendChild(el('p', 'tile-main', card.text));
    node.appendChild(optionalImage('assets/bonus/' + card.id + '.jpg', 'Bonus card ' + card.id));
    return node;
  }

  function boardCard(board) {
    var node = el('div', 'tile flip-in');
    node.appendChild(el('p', 'round-label', 'Game board'));
    node.appendChild(el('p', 'tile-main', board.name));
    node.appendChild(optionalImage('assets/boards/' + board.id + '.jpg', board.name));
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
