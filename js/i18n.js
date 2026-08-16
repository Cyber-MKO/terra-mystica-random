/**
 * Terra Mystica Randomizer — interface translations.
 *
 * Every user-visible string goes through `TMI18n.t(key, params)`. Missing
 * keys fall back to English, so a partial translation is always safe: add
 * only the strings you know and the rest stay in English.
 *
 * To add a language:
 *   1. add an entry to LANGUAGES below (id + native name),
 *   2. add a matching object to STRINGS with the keys you can translate, and
 *   3. optionally add a block to FACTION_NAMES for the faction names.
 * No other file needs to change.
 *
 * Scope note: the interface, terrain names and faction names are
 * translated. Faction names live in FACTION_NAMES (one compact block per
 * language) and are merged into STRINGS as `faction.<id>` keys at load.
 * They are translations of the English names, not verified reproductions of
 * every publisher's localized edition — if your edition words one
 * differently, correct that one entry and it is used everywhere.
 *
 * Scoring-tile and bonus-card texts are still English only. They are keyed
 * (`tile.<id>.action`, `tile.<id>.cult`, `bonus.<id>`) and can be filled in
 * the same way.
 */
(function (global) {
  'use strict';

  var LANGUAGES = [
    { id: 'en', name: 'English' },
    { id: 'de', name: 'Deutsch' },
    { id: 'fr', name: 'Français' },
    { id: 'es', name: 'Español' },
    { id: 'zh', name: '中文' },
    { id: 'ru', name: 'Русский' }
  ];

  var STRINGS = {

    /* ------------------------------------------------------------------ */
    en: {
      'app.suffix': 'Randomizer',
      'app.tagline': 'Factions · Terrains · Scoring Tiles · Bonus Cards · Boards',
      'app.language': 'Language',

      'setup.players': '1 · Players',
      'setup.mode.names': 'Enter names',
      'setup.mode.count': 'Player count only',
      'setup.names.hint': '2–5 players. All names must be non-empty and unique.',
      'setup.count.hint': 'Just pick how many are playing — seats are labelled Player 1–N.',
      'setup.seatLabel': 'Player {n}',
      'setup.addPlayer': '+ Add player',
      'setup.playerPlaceholder': 'Player {n} name',
      'setup.removePlayer': 'Remove player',
      'setup.capacity': 'Enabled pool supports up to {n} player(s).',

      'setup.pools': '2 · Faction pools',
      'setup.pools.hint': 'Toggle whole groups, or expand a group to include/exclude individual factions.',
      'setup.pools.groupToggle': 'Enable/disable whole group',

      'setup.options': '3 · Options',
      'opt.strict.title': 'Strict terrain lock',
      'opt.strict.desc': ' — no two players may share a home terrain',
      'opt.board.title': 'Randomize board',
      'opt.board.desc': ' — also pick a game board',
      'opt.fireice.title': 'Fire & Ice tiles/cards',
      'opt.fireice.desc': ' — include the F&I scoring tile and bonus card',
      'opt.sound.title': 'Sound effects',
      'opt.sound.desc': ' — short cues while shuffling and revealing',

      'action.randomize': '⚔️ Randomize setup',
      'action.rerollAll': '🎲 Reroll everything',
      'action.newGame': '↩️ New game',
      'action.rerollFactions': '🎲 Reroll all factions',
      'action.rerollTiles': '🎲 Reroll tiles',
      'action.rerollBonus': '🎲 Reroll cards',
      'action.rerollBoard': '🎲 Reroll board',
      'action.reroll': '🎲 Reroll',
      'action.rerollSeat': "Reroll {player}'s faction",

      'reveal.text': 'Consulting the cults…',

      'result.factions': 'Factions',
      'result.tiles': 'Round scoring tiles',
      'result.bonus': 'Bonus cards',
      'result.board': 'Board',
      'result.round': 'Round {n}',
      'result.cult': 'Cult: {text}',
      'result.home': 'home',
      'result.boardLabel': 'Game board',

      'err.minPlayers': 'At least {n} players are required.',
      'err.maxPlayers': 'At most {n} players are supported.',
      'err.emptyName': 'Every player needs a name.',
      'err.duplicateNames': 'Player names must be unique.',
      'err.noFactions': 'No factions are enabled — enable at least one faction group.',
      'err.capacityStrict': 'The enabled faction pool only supports {capacity} player(s) ' +
        '(exclusivity and terrain-lock rules included) but {players} players are set up. ' +
        'Enable more factions or remove players.',
      'err.capacity': 'The enabled faction pool only supports {capacity} player(s) ' +
        '(exclusivity rules included) but {players} players are set up. ' +
        'Enable more factions or remove players.',
      'err.noAssignment': 'Could not find a legal faction assignment for this pool — ' +
        'enable more factions or relax the strict terrain lock.',

      'group.base': 'Base Game Factions',
      'group.fireice': 'Fire & Ice Factions',
      'group.fan': 'Fan Factions',
      'group.fireice-fan': 'Fire & Ice Fan Factions',

      'terrain.plains': 'Plains',
      'terrain.swamp': 'Swamp',
      'terrain.lakes': 'Lakes',
      'terrain.forest': 'Forest',
      'terrain.mountains': 'Mountains',
      'terrain.wasteland': 'Wasteland',
      'terrain.desert': 'Desert',

      'special.ice': 'Ice',
      'special.volcano': 'Volcano',
      'special.variable': 'Variable',

      'board.original': 'Original Terra Mystica board',
      'board.fireice': 'Fire & Ice board',
      'board.loonlakes': 'Loon Lakes (fan map)',
      'board.fjords': 'Fjords (fan map)',

      'footer.notice': 'Unofficial fan tool. Terra Mystica is © Feuerland Spiele / ' +
        'Helge Ostertag & Jens Drögemüller. Drop official artwork into assets/ ' +
        'to replace the placeholders — see the README.'
    },

    /* ------------------------------------------------------------------ */
    de: {
      'app.suffix': 'Zufallsgenerator',
      'app.tagline': 'Völker · Terrains · Wertungsplättchen · Bonuskarten · Spielpläne',
      'app.language': 'Sprache',

      'setup.players': '1 · Spieler',
      'setup.mode.names': 'Namen eingeben',
      'setup.mode.count': 'Nur Spielerzahl',
      'setup.names.hint': '2–5 Spieler. Alle Namen müssen ausgefüllt und eindeutig sein.',
      'setup.count.hint': 'Einfach die Spielerzahl wählen — die Plätze heißen Spieler 1–N.',
      'setup.seatLabel': 'Spieler {n}',
      'setup.addPlayer': '+ Spieler hinzufügen',
      'setup.playerPlaceholder': 'Name von Spieler {n}',
      'setup.removePlayer': 'Spieler entfernen',
      'setup.capacity': 'Die aktive Auswahl reicht für bis zu {n} Spieler.',

      'setup.pools': '2 · Völkerauswahl',
      'setup.pools.hint': 'Ganze Gruppen umschalten oder eine Gruppe aufklappen, um einzelne Völker ein- und auszuschließen.',
      'setup.pools.groupToggle': 'Ganze Gruppe an-/abwählen',

      'setup.options': '3 · Optionen',
      'opt.strict.title': 'Strikte Terrain-Sperre',
      'opt.strict.desc': ' — keine zwei Spieler mit demselben Heimatterrain',
      'opt.board.title': 'Spielplan auslosen',
      'opt.board.desc': ' — auch einen Spielplan bestimmen',
      'opt.fireice.title': 'Feuer & Eis Plättchen/Karten',
      'opt.fireice.desc': ' — Wertungsplättchen und Bonuskarte aus Feuer & Eis einbeziehen',
      'opt.sound.title': 'Soundeffekte',
      'opt.sound.desc': ' — kurze Klänge beim Mischen und Aufdecken',

      'action.randomize': '⚔️ Aufbau auslosen',
      'action.rerollAll': '🎲 Alles neu auslosen',
      'action.newGame': '↩️ Neues Spiel',
      'action.rerollFactions': '🎲 Alle Völker neu',
      'action.rerollTiles': '🎲 Plättchen neu',
      'action.rerollBonus': '🎲 Karten neu',
      'action.rerollBoard': '🎲 Spielplan neu',
      'action.reroll': '🎲 Neu',
      'action.rerollSeat': 'Volk von {player} neu auslosen',

      'reveal.text': 'Die Kulte werden befragt …',

      'result.factions': 'Völker',
      'result.tiles': 'Wertungsplättchen der Runden',
      'result.bonus': 'Bonuskarten',
      'result.board': 'Spielplan',
      'result.round': 'Runde {n}',
      'result.cult': 'Kult: {text}',
      'result.home': 'Heimat',
      'result.boardLabel': 'Spielplan',

      'err.minPlayers': 'Es werden mindestens {n} Spieler benötigt.',
      'err.maxPlayers': 'Es werden höchstens {n} Spieler unterstützt.',
      'err.emptyName': 'Jeder Spieler braucht einen Namen.',
      'err.duplicateNames': 'Die Spielernamen müssen eindeutig sein.',
      'err.noFactions': 'Es ist kein Volk aktiv — aktiviere mindestens eine Gruppe.',
      'err.capacityStrict': 'Die aktive Völkerauswahl reicht nur für {capacity} Spieler ' +
        '(inklusive Ausschluss- und Terrain-Sperre-Regeln), es sind aber {players} Spieler eingetragen. ' +
        'Aktiviere mehr Völker oder entferne Spieler.',
      'err.capacity': 'Die aktive Völkerauswahl reicht nur für {capacity} Spieler ' +
        '(inklusive Ausschlussregeln), es sind aber {players} Spieler eingetragen. ' +
        'Aktiviere mehr Völker oder entferne Spieler.',
      'err.noAssignment': 'Für diese Auswahl wurde keine regelkonforme Verteilung gefunden — ' +
        'aktiviere mehr Völker oder deaktiviere die strikte Terrain-Sperre.',

      'group.base': 'Völker des Grundspiels',
      'group.fireice': 'Völker aus Feuer & Eis',
      'group.fan': 'Fan-Völker',
      'group.fireice-fan': 'Fan-Völker für Feuer & Eis',

      'terrain.plains': 'Ebene',
      'terrain.swamp': 'Sumpf',
      'terrain.lakes': 'Seen',
      'terrain.forest': 'Wald',
      'terrain.mountains': 'Gebirge',
      'terrain.wasteland': 'Ödland',
      'terrain.desert': 'Wüste',

      'special.ice': 'Eis',
      'special.volcano': 'Vulkan',
      'special.variable': 'Variabel',

      'board.original': 'Original-Spielplan',
      'board.fireice': 'Feuer & Eis Spielplan',
      'board.loonlakes': 'Loon Lakes (Fan-Plan)',
      'board.fjords': 'Fjords (Fan-Plan)',

      'footer.notice': 'Inoffizielles Fan-Werkzeug. Terra Mystica ist © Feuerland Spiele / ' +
        'Helge Ostertag & Jens Drögemüller. Lege offizielle Grafiken in assets/ ab, ' +
        'um die Platzhalter zu ersetzen — siehe README.'
    },

    /* ------------------------------------------------------------------ */
    fr: {
      'app.suffix': 'Tirage aléatoire',
      'app.tagline': 'Factions · Terrains · Tuiles de score · Cartes bonus · Plateaux',
      'app.language': 'Langue',

      'setup.players': '1 · Joueurs',
      'setup.mode.names': 'Saisir les noms',
      'setup.mode.count': 'Nombre de joueurs seulement',
      'setup.names.hint': '2 à 5 joueurs. Tous les noms doivent être remplis et uniques.',
      'setup.count.hint': 'Choisissez simplement le nombre de joueurs — les places sont nommées Joueur 1–N.',
      'setup.seatLabel': 'Joueur {n}',
      'setup.addPlayer': '+ Ajouter un joueur',
      'setup.playerPlaceholder': 'Nom du joueur {n}',
      'setup.removePlayer': 'Retirer le joueur',
      'setup.capacity': 'La sélection active permet jusqu’à {n} joueur(s).',

      'setup.pools': '2 · Sélection des factions',
      'setup.pools.hint': 'Activez des groupes entiers, ou dépliez un groupe pour inclure/exclure des factions.',
      'setup.pools.groupToggle': 'Activer/désactiver tout le groupe',

      'setup.options': '3 · Options',
      'opt.strict.title': 'Verrou de terrain strict',
      'opt.strict.desc': ' — deux joueurs ne peuvent pas partager un terrain d’origine',
      'opt.board.title': 'Tirer le plateau',
      'opt.board.desc': ' — choisir aussi un plateau de jeu',
      'opt.fireice.title': 'Tuiles/cartes Feu & Glace',
      'opt.fireice.desc': ' — inclure la tuile de score et la carte bonus Feu & Glace',
      'opt.sound.title': 'Effets sonores',
      'opt.sound.desc': ' — brefs sons pendant le mélange et la révélation',

      'action.randomize': '⚔️ Lancer le tirage',
      'action.rerollAll': '🎲 Tout retirer au sort',
      'action.newGame': '↩️ Nouvelle partie',
      'action.rerollFactions': '🎲 Retirer les factions',
      'action.rerollTiles': '🎲 Retirer les tuiles',
      'action.rerollBonus': '🎲 Retirer les cartes',
      'action.rerollBoard': '🎲 Retirer le plateau',
      'action.reroll': '🎲 Retirer',
      'action.rerollSeat': 'Retirer la faction de {player}',

      'reveal.text': 'Consultation des cultes…',

      'result.factions': 'Factions',
      'result.tiles': 'Tuiles de score des tours',
      'result.bonus': 'Cartes bonus',
      'result.board': 'Plateau',
      'result.round': 'Tour {n}',
      'result.cult': 'Culte : {text}',
      'result.home': 'origine',
      'result.boardLabel': 'Plateau de jeu',

      'err.minPlayers': 'Il faut au moins {n} joueurs.',
      'err.maxPlayers': 'Au maximum {n} joueurs sont pris en charge.',
      'err.emptyName': 'Chaque joueur doit avoir un nom.',
      'err.duplicateNames': 'Les noms des joueurs doivent être uniques.',
      'err.noFactions': 'Aucune faction active — activez au moins un groupe.',
      'err.capacityStrict': 'La sélection active ne permet que {capacity} joueur(s) ' +
        '(règles d’exclusivité et verrou de terrain compris) mais {players} joueurs sont configurés. ' +
        'Activez plus de factions ou retirez des joueurs.',
      'err.capacity': 'La sélection active ne permet que {capacity} joueur(s) ' +
        '(règles d’exclusivité comprises) mais {players} joueurs sont configurés. ' +
        'Activez plus de factions ou retirez des joueurs.',
      'err.noAssignment': 'Aucune répartition légale trouvée pour cette sélection — ' +
        'activez plus de factions ou désactivez le verrou de terrain strict.',

      'group.base': 'Factions du jeu de base',
      'group.fireice': 'Factions Feu & Glace',
      'group.fan': 'Factions fan',
      'group.fireice-fan': 'Factions fan Feu & Glace',

      'terrain.plains': 'Plaines',
      'terrain.swamp': 'Marais',
      'terrain.lakes': 'Lacs',
      'terrain.forest': 'Forêt',
      'terrain.mountains': 'Montagnes',
      'terrain.wasteland': 'Terres désolées',
      'terrain.desert': 'Désert',

      'special.ice': 'Glace',
      'special.volcano': 'Volcan',
      'special.variable': 'Variable',

      'board.original': 'Plateau Terra Mystica original',
      'board.fireice': 'Plateau Feu & Glace',
      'board.loonlakes': 'Loon Lakes (carte fan)',
      'board.fjords': 'Fjords (carte fan)',

      'footer.notice': 'Outil de fan non officiel. Terra Mystica est © Feuerland Spiele / ' +
        'Helge Ostertag & Jens Drögemüller. Déposez les illustrations officielles dans assets/ ' +
        'pour remplacer les images de substitution — voir le README.'
    },

    /* ------------------------------------------------------------------ */
    es: {
      'app.suffix': 'Aleatorizador',
      'app.tagline': 'Facciones · Terrenos · Losetas de puntuación · Cartas de bonificación · Tableros',
      'app.language': 'Idioma',

      'setup.players': '1 · Jugadores',
      'setup.mode.names': 'Escribir nombres',
      'setup.mode.count': 'Solo número de jugadores',
      'setup.names.hint': '2–5 jugadores. Todos los nombres deben estar rellenos y ser únicos.',
      'setup.count.hint': 'Solo elige cuántos juegan — los puestos se llaman Jugador 1–N.',
      'setup.seatLabel': 'Jugador {n}',
      'setup.addPlayer': '+ Añadir jugador',
      'setup.playerPlaceholder': 'Nombre del jugador {n}',
      'setup.removePlayer': 'Quitar jugador',
      'setup.capacity': 'La selección activa admite hasta {n} jugador(es).',

      'setup.pools': '2 · Selección de facciones',
      'setup.pools.hint': 'Activa grupos enteros, o despliega un grupo para incluir/excluir facciones concretas.',
      'setup.pools.groupToggle': 'Activar/desactivar todo el grupo',

      'setup.options': '3 · Opciones',
      'opt.strict.title': 'Bloqueo estricto de terreno',
      'opt.strict.desc': ' — dos jugadores no pueden compartir terreno de origen',
      'opt.board.title': 'Sortear tablero',
      'opt.board.desc': ' — elegir también un tablero de juego',
      'opt.fireice.title': 'Losetas/cartas de Fuego y Hielo',
      'opt.fireice.desc': ' — incluir la loseta de puntuación y la carta de bonificación de F&H',
      'opt.sound.title': 'Efectos de sonido',
      'opt.sound.desc': ' — sonidos breves al barajar y revelar',

      'action.randomize': '⚔️ Sortear la partida',
      'action.rerollAll': '🎲 Sortear todo de nuevo',
      'action.newGame': '↩️ Partida nueva',
      'action.rerollFactions': '🎲 Sortear facciones',
      'action.rerollTiles': '🎲 Sortear losetas',
      'action.rerollBonus': '🎲 Sortear cartas',
      'action.rerollBoard': '🎲 Sortear tablero',
      'action.reroll': '🎲 Sortear',
      'action.rerollSeat': 'Sortear la facción de {player}',

      'reveal.text': 'Consultando a los cultos…',

      'result.factions': 'Facciones',
      'result.tiles': 'Losetas de puntuación por ronda',
      'result.bonus': 'Cartas de bonificación',
      'result.board': 'Tablero',
      'result.round': 'Ronda {n}',
      'result.cult': 'Culto: {text}',
      'result.home': 'origen',
      'result.boardLabel': 'Tablero de juego',

      'err.minPlayers': 'Se necesitan al menos {n} jugadores.',
      'err.maxPlayers': 'Se admiten como máximo {n} jugadores.',
      'err.emptyName': 'Cada jugador necesita un nombre.',
      'err.duplicateNames': 'Los nombres de los jugadores deben ser únicos.',
      'err.noFactions': 'No hay facciones activas — activa al menos un grupo.',
      'err.capacityStrict': 'La selección activa solo admite {capacity} jugador(es) ' +
        '(incluidas las reglas de exclusividad y el bloqueo de terreno) pero hay {players} jugadores. ' +
        'Activa más facciones o quita jugadores.',
      'err.capacity': 'La selección activa solo admite {capacity} jugador(es) ' +
        '(incluidas las reglas de exclusividad) pero hay {players} jugadores. ' +
        'Activa más facciones o quita jugadores.',
      'err.noAssignment': 'No se encontró un reparto legal para esta selección — ' +
        'activa más facciones o desactiva el bloqueo estricto de terreno.',

      'group.base': 'Facciones del juego básico',
      'group.fireice': 'Facciones de Fuego y Hielo',
      'group.fan': 'Facciones fan',
      'group.fireice-fan': 'Facciones fan de Fuego y Hielo',

      'terrain.plains': 'Llanuras',
      'terrain.swamp': 'Pantano',
      'terrain.lakes': 'Lagos',
      'terrain.forest': 'Bosque',
      'terrain.mountains': 'Montañas',
      'terrain.wasteland': 'Páramo',
      'terrain.desert': 'Desierto',

      'special.ice': 'Hielo',
      'special.volcano': 'Volcán',
      'special.variable': 'Variable',

      'board.original': 'Tablero original de Terra Mystica',
      'board.fireice': 'Tablero de Fuego y Hielo',
      'board.loonlakes': 'Loon Lakes (mapa fan)',
      'board.fjords': 'Fjords (mapa fan)',

      'footer.notice': 'Herramienta fan no oficial. Terra Mystica es © Feuerland Spiele / ' +
        'Helge Ostertag & Jens Drögemüller. Coloca las ilustraciones oficiales en assets/ ' +
        'para sustituir los marcadores — consulta el README.'
    },

    /* ------------------------------------------------------------------ */
    zh: {
      'app.suffix': '随机器',
      'app.tagline': '种族 · 地形 · 计分板块 · 奖励卡 · 地图',
      'app.language': '语言',

      'setup.players': '1 · 玩家',
      'setup.mode.names': '输入名字',
      'setup.mode.count': '仅选择人数',
      'setup.names.hint': '2–5 名玩家。所有名字都必须填写且不重复。',
      'setup.count.hint': '只需选择游戏人数 — 座位标记为 玩家 1–N。',
      'setup.seatLabel': '玩家 {n}',
      'setup.addPlayer': '+ 添加玩家',
      'setup.playerPlaceholder': '玩家 {n} 的名字',
      'setup.removePlayer': '移除玩家',
      'setup.capacity': '当前启用的种族最多支持 {n} 名玩家。',

      'setup.pools': '2 · 种族选择',
      'setup.pools.hint': '可整组开关，或展开某一组单独包含/排除种族。',
      'setup.pools.groupToggle': '启用/停用整组',

      'setup.options': '3 · 选项',
      'opt.strict.title': '严格地形限制',
      'opt.strict.desc': ' — 任意两名玩家不可拥有相同的家乡地形',
      'opt.board.title': '随机地图',
      'opt.board.desc': ' — 同时随机选择一张游戏地图',
      'opt.fireice.title': '《冰与火》板块/卡牌',
      'opt.fireice.desc': ' — 包含《冰与火》的计分板块与奖励卡',
      'opt.sound.title': '音效',
      'opt.sound.desc': ' — 洗牌与揭晓时的短促提示音',

      'action.randomize': '⚔️ 开始随机',
      'action.rerollAll': '🎲 全部重新随机',
      'action.newGame': '↩️ 新游戏',
      'action.rerollFactions': '🎲 重新随机所有种族',
      'action.rerollTiles': '🎲 重新随机板块',
      'action.rerollBonus': '🎲 重新随机卡牌',
      'action.rerollBoard': '🎲 重新随机地图',
      'action.reroll': '🎲 重随',
      'action.rerollSeat': '重新随机 {player} 的种族',

      'reveal.text': '正在请示教派…',

      'result.factions': '种族',
      'result.tiles': '各轮计分板块',
      'result.bonus': '奖励卡',
      'result.board': '地图',
      'result.round': '第 {n} 轮',
      'result.cult': '教派：{text}',
      'result.home': '家乡',
      'result.boardLabel': '游戏地图',

      'err.minPlayers': '至少需要 {n} 名玩家。',
      'err.maxPlayers': '最多支持 {n} 名玩家。',
      'err.emptyName': '每名玩家都需要一个名字。',
      'err.duplicateNames': '玩家名字不能重复。',
      'err.noFactions': '没有启用任何种族 — 请至少启用一组。',
      'err.capacityStrict': '当前启用的种族只够 {capacity} 名玩家（已计入互斥与地形限制规则），' +
        '但设置了 {players} 名玩家。请启用更多种族或减少玩家。',
      'err.capacity': '当前启用的种族只够 {capacity} 名玩家（已计入互斥规则），' +
        '但设置了 {players} 名玩家。请启用更多种族或减少玩家。',
      'err.noAssignment': '无法为当前选择找到合法的种族分配 — 请启用更多种族，或关闭严格地形限制。',

      'group.base': '基础游戏种族',
      'group.fireice': '《冰与火》种族',
      'group.fan': '玩家自制种族',
      'group.fireice-fan': '《冰与火》玩家自制种族',

      'terrain.plains': '平原',
      'terrain.swamp': '沼泽',
      'terrain.lakes': '湖泊',
      'terrain.forest': '森林',
      'terrain.mountains': '山地',
      'terrain.wasteland': '荒地',
      'terrain.desert': '沙漠',

      'special.ice': '冰',
      'special.volcano': '火山',
      'special.variable': '可变',

      'board.original': 'Terra Mystica 原版地图',
      'board.fireice': '《冰与火》地图',
      'board.loonlakes': 'Loon Lakes（自制地图）',
      'board.fjords': 'Fjords（自制地图）',

      'footer.notice': '非官方粉丝工具。Terra Mystica © Feuerland Spiele / ' +
        'Helge Ostertag & Jens Drögemüller。将官方图片放入 assets/ 即可替换占位图 — 详见 README。'
    },

    /* ------------------------------------------------------------------ */
    ru: {
      'app.suffix': 'Генератор',
      'app.tagline': 'Фракции · Ландшафты · Тайлы очков · Бонусные карты · Поля',
      'app.language': 'Язык',

      'setup.players': '1 · Игроки',
      'setup.mode.names': 'Ввести имена',
      'setup.mode.count': 'Только число игроков',
      'setup.names.hint': '2–5 игроков. Все имена должны быть заполнены и уникальны.',
      'setup.count.hint': 'Просто выберите число игроков — места называются Игрок 1–N.',
      'setup.seatLabel': 'Игрок {n}',
      'setup.addPlayer': '+ Добавить игрока',
      'setup.playerPlaceholder': 'Имя игрока {n}',
      'setup.removePlayer': 'Убрать игрока',
      'setup.capacity': 'Активный набор рассчитан не более чем на {n} игрок(ов).',

      'setup.pools': '2 · Выбор фракций',
      'setup.pools.hint': 'Переключайте целые группы или разверните группу, чтобы включить/исключить отдельные фракции.',
      'setup.pools.groupToggle': 'Включить/выключить всю группу',

      'setup.options': '3 · Настройки',
      'opt.strict.title': 'Строгая блокировка ландшафта',
      'opt.strict.desc': ' — два игрока не могут иметь одинаковый родной ландшафт',
      'opt.board.title': 'Случайное поле',
      'opt.board.desc': ' — также выбрать игровое поле',
      'opt.fireice.title': 'Тайлы/карты «Огня и льда»',
      'opt.fireice.desc': ' — включить тайл очков и бонусную карту из «Огня и льда»',
      'opt.sound.title': 'Звуковые эффекты',
      'opt.sound.desc': ' — короткие звуки при перемешивании и раскрытии',

      'action.randomize': '⚔️ Сгенерировать',
      'action.rerollAll': '🎲 Перебросить всё',
      'action.newGame': '↩️ Новая игра',
      'action.rerollFactions': '🎲 Перебросить фракции',
      'action.rerollTiles': '🎲 Перебросить тайлы',
      'action.rerollBonus': '🎲 Перебросить карты',
      'action.rerollBoard': '🎲 Перебросить поле',
      'action.reroll': '🎲 Заново',
      'action.rerollSeat': 'Перебросить фракцию игрока {player}',

      'reveal.text': 'Совет с культами…',

      'result.factions': 'Фракции',
      'result.tiles': 'Тайлы очков по раундам',
      'result.bonus': 'Бонусные карты',
      'result.board': 'Поле',
      'result.round': 'Раунд {n}',
      'result.cult': 'Культ: {text}',
      'result.home': 'родной',
      'result.boardLabel': 'Игровое поле',

      'err.minPlayers': 'Нужно не менее {n} игроков.',
      'err.maxPlayers': 'Поддерживается не более {n} игроков.',
      'err.emptyName': 'У каждого игрока должно быть имя.',
      'err.duplicateNames': 'Имена игроков должны быть уникальными.',
      'err.noFactions': 'Не выбрано ни одной фракции — включите хотя бы одну группу.',
      'err.capacityStrict': 'Выбранных фракций хватает только на {capacity} игрок(ов) ' +
        '(с учётом правил взаимного исключения и блокировки ландшафта), а игроков — {players}. ' +
        'Включите больше фракций или уберите игроков.',
      'err.capacity': 'Выбранных фракций хватает только на {capacity} игрок(ов) ' +
        '(с учётом правил взаимного исключения), а игроков — {players}. ' +
        'Включите больше фракций или уберите игроков.',
      'err.noAssignment': 'Не удалось найти допустимое распределение фракций — ' +
        'включите больше фракций или отключите строгую блокировку ландшафта.',

      'group.base': 'Фракции базовой игры',
      'group.fireice': 'Фракции «Огня и льда»',
      'group.fan': 'Фанатские фракции',
      'group.fireice-fan': 'Фанатские фракции «Огня и льда»',

      'terrain.plains': 'Равнины',
      'terrain.swamp': 'Болото',
      'terrain.lakes': 'Озёра',
      'terrain.forest': 'Лес',
      'terrain.mountains': 'Горы',
      'terrain.wasteland': 'Пустошь',
      'terrain.desert': 'Пустыня',

      'special.ice': 'Лёд',
      'special.volcano': 'Вулкан',
      'special.variable': 'Переменный',

      'board.original': 'Оригинальное поле Terra Mystica',
      'board.fireice': 'Поле «Огня и льда»',
      'board.loonlakes': 'Loon Lakes (фанатская карта)',
      'board.fjords': 'Fjords (фанатская карта)',

      'footer.notice': 'Неофициальный фанатский инструмент. Terra Mystica © Feuerland Spiele / ' +
        'Helge Ostertag & Jens Drögemüller. Поместите официальные изображения в assets/, ' +
        'чтобы заменить заглушки — см. README.'
    }
  };

  /**
   * Faction names per language, merged into STRINGS as `faction.<id>` keys
   * below. English is omitted — it falls back to the name in js/data.js,
   * which is also what artwork file names are matched against, so a
   * translation never changes which image loads.
   */
  var FACTION_NAMES = {
    de: {
      halflings: 'Halblinge', cultists: 'Kultisten', alchemists: 'Alchemisten',
      darklings: 'Dunkellinge', mermaids: 'Meerjungfrauen', swarmlings: 'Schwarmlinge',
      witches: 'Hexen', auren: 'Auren', dwarves: 'Zwerge', engineers: 'Ingenieure',
      giants: 'Giganten', chaosmagicians: 'Chaosmagier', fakirs: 'Fakire', nomads: 'Nomaden',
      icemaidens: 'Eismaiden', yetis: 'Yetis', acolytes: 'Akolythen',
      dragonlords: 'Drachenfürsten', riverwalkers: 'Flusswanderer', shapeshifters: 'Gestaltwandler',
      prospectors: 'Goldsucher', timetravelers: 'Zeitreisende',
      childrenofthewyrm: 'Kinder des Wyrm', goblins: 'Goblins', atlanteans: 'Atlanter',
      wisps: 'Irrlichter', chashdallah: 'Chash Dallah', enlightened: 'Die Erleuchteten',
      conspirators: 'Verschwörer', dyniongeifr: 'Dynion Geifr', architects: 'Architekten',
      treasurers: 'Schatzmeister', archivists: 'Archivare', djinn: 'Dschinn',
      snowshamans: 'Schneeschamanen', selkies: 'Selkies', firewalkers: 'Feuerläufer',
      kingdomofember: 'Königreich der Glut', changelings: 'Wechselbälger', geologists: 'Geologen'
    },
    fr: {
      halflings: 'Halfelins', cultists: 'Cultistes', alchemists: 'Alchimistes',
      darklings: 'Ténébreux', mermaids: 'Sirènes', swarmlings: 'Grouillants',
      witches: 'Sorcières', auren: 'Auren', dwarves: 'Nains', engineers: 'Ingénieurs',
      giants: 'Géants', chaosmagicians: 'Mages du Chaos', fakirs: 'Fakirs', nomads: 'Nomades',
      icemaidens: 'Vierges de Glace', yetis: 'Yétis', acolytes: 'Acolytes',
      dragonlords: 'Seigneurs Dragons', riverwalkers: 'Marcheurs des Rivières',
      shapeshifters: 'Métamorphes',
      prospectors: 'Prospecteurs', timetravelers: 'Voyageurs du Temps',
      childrenofthewyrm: 'Enfants du Wyrm', goblins: 'Gobelins', atlanteans: 'Atlantes',
      wisps: 'Feux Follets', chashdallah: 'Chash Dallah', enlightened: 'Les Illuminés',
      conspirators: 'Conspirateurs', dyniongeifr: 'Dynion Geifr', architects: 'Architectes',
      treasurers: 'Trésoriers', archivists: 'Archivistes', djinn: 'Djinns',
      snowshamans: 'Chamans des Neiges', selkies: 'Selkies', firewalkers: 'Marcheurs de Feu',
      kingdomofember: 'Royaume de Braise', changelings: 'Changelins', geologists: 'Géologues'
    },
    es: {
      halflings: 'Medianos', cultists: 'Cultistas', alchemists: 'Alquimistas',
      darklings: 'Oscuros', mermaids: 'Sirenas', swarmlings: 'Enjambres',
      witches: 'Brujas', auren: 'Auren', dwarves: 'Enanos', engineers: 'Ingenieros',
      giants: 'Gigantes', chaosmagicians: 'Magos del Caos', fakirs: 'Faquires', nomads: 'Nómadas',
      icemaidens: 'Doncellas de Hielo', yetis: 'Yetis', acolytes: 'Acólitos',
      dragonlords: 'Señores Dragón', riverwalkers: 'Caminantes del Río',
      shapeshifters: 'Cambiaformas',
      prospectors: 'Prospectores', timetravelers: 'Viajeros del Tiempo',
      childrenofthewyrm: 'Hijos del Wyrm', goblins: 'Goblins', atlanteans: 'Atlantes',
      wisps: 'Fuegos Fatuos', chashdallah: 'Chash Dallah', enlightened: 'Los Iluminados',
      conspirators: 'Conspiradores', dyniongeifr: 'Dynion Geifr', architects: 'Arquitectos',
      treasurers: 'Tesoreros', archivists: 'Archiveros', djinn: 'Genios',
      snowshamans: 'Chamanes de las Nieves', selkies: 'Selkies', firewalkers: 'Caminantes del Fuego',
      kingdomofember: 'Reino de Brasas', changelings: 'Cambiados', geologists: 'Geólogos'
    },
    zh: {
      halflings: '半身人', cultists: '邪教徒', alchemists: '炼金术士',
      darklings: '暗影族', mermaids: '美人鱼', swarmlings: '虫群族',
      witches: '女巫', auren: '奥伦族', dwarves: '矮人', engineers: '工程师',
      giants: '巨人', chaosmagicians: '混沌法师', fakirs: '苦行僧', nomads: '游牧民',
      icemaidens: '冰霜少女', yetis: '雪人', acolytes: '侍僧',
      dragonlords: '龙领主', riverwalkers: '河行者', shapeshifters: '变形者',
      prospectors: '探矿者', timetravelers: '时间旅行者',
      childrenofthewyrm: '龙蛇之子', goblins: '哥布林', atlanteans: '亚特兰蒂斯人',
      wisps: '鬼火', chashdallah: '查什·达拉', enlightened: '觉悟者',
      conspirators: '阴谋家', dyniongeifr: '迪尼恩·盖弗', architects: '建筑师',
      treasurers: '司库', archivists: '档案官', djinn: '灯神',
      snowshamans: '雪之萨满', selkies: '海豹人', firewalkers: '火行者',
      kingdomofember: '余烬王国', changelings: '换生灵', geologists: '地质学家'
    },
    ru: {
      halflings: 'Полурослики', cultists: 'Культисты', alchemists: 'Алхимики',
      darklings: 'Тёмные', mermaids: 'Русалки', swarmlings: 'Роевики',
      witches: 'Ведьмы', auren: 'Аурен', dwarves: 'Гномы', engineers: 'Инженеры',
      giants: 'Великаны', chaosmagicians: 'Маги Хаоса', fakirs: 'Факиры', nomads: 'Кочевники',
      icemaidens: 'Ледяные девы', yetis: 'Йети', acolytes: 'Аколиты',
      dragonlords: 'Повелители драконов', riverwalkers: 'Речные странники',
      shapeshifters: 'Оборотни',
      prospectors: 'Старатели', timetravelers: 'Путешественники во времени',
      childrenofthewyrm: 'Дети Змея', goblins: 'Гоблины', atlanteans: 'Атланты',
      wisps: 'Блуждающие огни', chashdallah: 'Чаш Даллах', enlightened: 'Просветлённые',
      conspirators: 'Заговорщики', dyniongeifr: 'Динион Гейфр', architects: 'Архитекторы',
      treasurers: 'Казначеи', archivists: 'Архивариусы', djinn: 'Джинны',
      snowshamans: 'Снежные шаманы', selkies: 'Селки', firewalkers: 'Огнеходцы',
      kingdomofember: 'Королевство углей', changelings: 'Подменыши', geologists: 'Геологи'
    }
  };

  Object.keys(FACTION_NAMES).forEach(function (lang) {
    var names = FACTION_NAMES[lang];
    Object.keys(names).forEach(function (id) {
      STRINGS[lang]['faction.' + id] = names[id];
    });
  });

  var STORAGE_KEY = 'tm-randomizer-lang';
  var listeners = [];

  function supported(id) {
    return LANGUAGES.some(function (l) { return l.id === id; });
  }

  /** Stored choice, else the browser's language, else English. */
  function initialLanguage() {
    try {
      var saved = global.localStorage && global.localStorage.getItem(STORAGE_KEY);
      if (saved && supported(saved)) return saved;
    } catch (e) { /* storage unavailable (private mode, file://) */ }
    var nav = (global.navigator && (global.navigator.language || global.navigator.userLanguage)) || 'en';
    var short = String(nav).slice(0, 2).toLowerCase();
    return supported(short) ? short : 'en';
  }

  var current = initialLanguage();

  /**
   * Translate `key`, substituting {placeholders} from `params`.
   *
   * Falls back to English, then to `fallback` when given (used for game
   * content that has no translation keys yet, so it shows as printed
   * instead of as a raw key), then to the key itself.
   */
  function t(key, params, fallback) {
    var table = STRINGS[current] || {};
    var s = table[key];
    if (s === undefined) s = STRINGS.en[key];
    if (s === undefined) s = fallback;
    if (s === undefined) return key;
    if (params) {
      s = s.replace(/\{(\w+)\}/g, function (whole, name) {
        return params[name] !== undefined ? params[name] : whole;
      });
    }
    return s;
  }

  function setLanguage(id) {
    if (!supported(id) || id === current) return;
    current = id;
    try {
      if (global.localStorage) global.localStorage.setItem(STORAGE_KEY, id);
    } catch (e) { /* ignore */ }
    document.documentElement.lang = id;
    listeners.forEach(function (fn) { fn(id); });
  }

  /** Apply translations to every [data-i18n] element in the document. */
  function applyStatic(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t(node.getAttribute('data-i18n'));
    });
    (root || document).querySelectorAll('[data-i18n-title]').forEach(function (node) {
      node.title = t(node.getAttribute('data-i18n-title'));
    });
  }

  global.TMI18n = {
    LANGUAGES: LANGUAGES,
    t: t,
    setLanguage: setLanguage,
    getLanguage: function () { return current; },
    onChange: function (fn) { listeners.push(fn); },
    applyStatic: applyStatic
  };
})(window);
