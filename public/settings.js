let numHTiles = 17; // default 15
let numVTiles = 11; // default 9
let mapSize = 60; // default 60
let xOffsetForced = 0;
let xOffset = Number(new URLSearchParams(document.location.search).get("x"));
if (xOffset == null) {
    xOffset = 0;
} else {
    xOffsetForced = xOffset;
}
let yOffsetForced = 0;
let yOffset = Number(new URLSearchParams(document.location.search).get("y"));
if (yOffset == null) {
    yOffset = 0;
} else {
    yOffsetForced = yOffset;
}
let justReloaded = true;
let pageError = false;
// MAP GENERATOR
let modePlan = false;
let mped = {};
let theTileRes = {};
let theBatRes = {};
let theTilePacks = 'tungsten';
let theTileRuins = 'Habitations';
let modeSonde = false;
let maxMapsParDet = 5;
let impact = false;
let zoneFiles = [];
let terSeed = 12; // def 12 +grand = +grandes forêts etc...
let terSeedDiceMin = rand.rand(1,14);
let specialSeed = 10; // def 10 +grand = moins de terrains spéciaux
let riverSeed = 9;
let swampWater = 5; // def 5 chance d'avoir un swamps à la place d'un water (ou l'inverse)
let mountHills = 9; // def 9 chance d'avoir une montagne à la place d'une hills (ou l'inverse)
let riverEW = 4; // chance pour une rivière Est-Ouest (2- = 100%) +grand = moins de chance
let riverNS = 5; // chance pour une rivière Nord-Sud (2- = 100%) +grand = moins de chance
let riverSN = 5; // chance pour une rivière Nord-Sud (2- = 100%) +grand = moins de chance
let riverCurve = 3; // +grand = rivières plus droites (minimum 3)
let maxTileCheck = 5; // 4 = tendance transversale / 5 = tendance droite
let lastMapMinKind = 15; // % minimum de chaque race d'alien sur la carte finale
let terrainTypes = [];
let armorTypes = [];
let ammoTypes = [];
let mapTurn = false;
let mapFilters = [];
let filterEffect = 10;
let mapFilterDefault = "Normal"; // Normal!
let filterVariance = true; // true!
let terSeedVariance = true;
let baseFilterChance = 1; // minimum 1 !!! (1 = autant de chances pour chaque filtre)
let filterBase = {};
let isStartZone = false;
let zone = [];
let zonePrev = [];
let zoneBkp = [];
let resources = [];
let minedThisTurn = {};
let fretTuning = 2; // multiplie tous les Frets des unités : def 1
let landerFretTuning = 1.5; // multiplie tous les Frets des landers : def 1
let landerHPTuning = 10; // multiplie tous les HP des landers : def 1
let bldHPTuning = 1.2; // multiplie tous les HP des bâtiments : def 1
let bldTransTuning = 2; // multiplie tous les Transports des bâtiments : def 1
let rescueRateDiv = 150; // default 150
let mineRateDiv = 125; // divise le mining rate : def 200 (before: 125)
let resFoundDiv = 9; // default 9 (old = 8)
let resBatchDiv = 17; // divise la quantité de ressource (old = 14)
let scrapInRuins = 1.3;
let permaRes = false;
let resPersistance = 20; // default 10
let minResForRate = 20;
let maxResForRate = 500;
let alienResFactor = 8; // base: 10
let magmaZone = 3;
let eCrafting = 7; // base: 10 (x ressources pour 10 enargie)
let craftList = '#ALL';
let baseCrafts = 4;
let hasScraptruck = false;
let ruinRarity = 5; // default 8
let ruinsCompBase = 5; // 4 sur 350
let ruinsUnitBase = 5; // 4 sur 300
let ruinsResBase = 50; // 33%
let ruinsCitBase = 50; // def 50
let navCitFactor = 4; // def 10 (+ = + de cits)
let navBodFactor = 10; // def 10 (+ = + de cits)
let coffreTileId = -1;
let encounterTileId = -1;
let lastNeiTileId = -1;
let neiRoad = [false,false];
let ruinsCrimChance = 7; // 1/7 criminels au lieu de citoyens (15%)
let ruinsEmpty = true;
let ruinsAlien = false;
let ruinsBugBase = 25; // def 50
let ruinsDices = [1,1];
let selectedTile = -1;
let showMini = false;
let miniDots = 'units';
let showResOpen = false;
let showAllRes = true;
let showMarkedOnly = false;
let showOneRes = 'Toutes';
let oneResTileIds = [];
let allZoneRes = [];
let allCheckedZoneRes = [];
let undarkNow = [];
let viewBorders = [];
let stormChance = 10 // def 25/1000
// UNITS
let souteId = 1;
let navId = -1;
let inSoute = false;
let slId = 2; // selected lander id (en soute)
let souteFilter = 'all';
let armyFilter = -1;
let souteTab = 'unitz';
let modeLanding = false;
let changeVMTid = -1;
let unitTypes = [];
let unitDV = {}
let bataillons = [];
let batsInSpace = [];
let batList = [];
let alienList = [];
let alienOccupiedTiles = [];
let playerOccupiedTiles = [];
let visibleAliens = [];
let visibleHunts = [];
let visibleEggs = [];
// let prepaBld = {}; dans playerInfos.prepaLand
let vetBonus = {
    rof: 8,
    initiative: 10,
    ap: 1,
    stealth: 1.4
}
let levelXP = [0,50,150,400,800];
let gangLevelCit = [0,1000,1400,1800,2200,2600,3000,3400,3800,4200,4600,5000,5400,5850,6300,6800,7400,8000,8600,9200,10000,11000,50000];
let gangXPFactor = 25;
let myCompPoints = 0;
// ACTIONS
let isAdmin = {};
isAdmin.deep = false;
isAdmin.low = false;
isAdmin.fire = false;
let allowCheat = false;
let allowDSE = false;
let moveTuning = 1.2; // moveCost x moveTuning
let moveKzin = 0.85; // moveCost/moveKzin
let mcSudu = 0.8; // moveCost x mcSudu
let isReloaded = true;
let decButHere = false;
let mode = "select";
let selectedBat = {};
let selectedBatType = {};
let selectedWeap = {};
let targetBat = {};
let targetBatType = {};
let targetWeap = {};
let sWipe = false;
let tWipe = false;
let batHasTarget = false;
let baseLanderRange = 4;
let nextExplosion = 1;
let pansolFactor = 360; // divisé par 160
let coverFactor = 0.8; // multiplie la cover du terrain (enlevé à accuracy)
let coverAOE = -10;
let minPrec = 3 // minimum de précision (même après ajustements)
let hitBase = 9; // bonus to hit général (aliens et humains)
let alienHitBase = 2; // bonus précision aliens
let alienHPBase = 1; // hp x1
let alienMeleeROF = 1.25;  // ajustement rof aliens en mêlée
let rangeTerAdj = true; // ajustements de range selon le terrain et la taille de la cible
let meleeROF = 1; // ajustement rof players en mêlée
let meleePenet = 0.1; // ajustement armors players en mêlée
let bowPenet = 0.15; // ajustement armors players arcs et arbalètes
let alienInitiative = 15; // compense le bonus vet de 10*(0-4)
let initiativeDice = 15 // ajoute 0-15
let unitResist = 0;
let minFailSoins = 60; // def 60 : minimum 15/75 soins réussis
let stopMe = false;
let stopThem = false;
let nextTurnOK = false;
let toHit = 999;
let escapeValue = 1.45;
let escaped = false;
let activeTurn = 'player';
let watchInitBonus = 30; // ajoute au dé d'initiative si GUET
let minFireAP = -7; // ne peut pas tirer si moins d'AP (ni attaque ni riposte)
let stealthMaxChance = 95; // max chance de se rendre invisible
let berserkEnemyDamage = 1.5;
let berserkROF = 1.5;
let minesExploded = 0;
let deadBatsList = [];
let deadAliensList = [];
let luckCheck = [7,14,21,86,93,100];
let cheapWeapCost = 99;
let mecanoHP = 45;
let roadAPCost = 12;
let bonusTransRetour = 1.25;
let batDebarq = {};
let medicalTransports = [];
let mecaPatientAP = 6;
let landers = [];
let hasOwnLander = false;
let numLaserSat = 0;
let friendsAlert = false;
let noControlAlert = false;
let lastAlert = 'none';
let fogRange = 5;
let foggedTiles = [];
let doggedTiles = [];
let zombRange = 5;
let zombifiedTiles = [];
let roboRange = true;
let roboTiles = [];
let piloRange = 3;
let pilonedTiles = [];
let startLander = 5;
let deploySalvos = 4; // on part de 7
let deployTuning = {};
deployTuning.units = 10; // on part de 10
deployTuning.ammo = 10;
deployTuning.obus = 12; // weapon power 14+ et aoe squad+
deployTuning.eq = 10; // équipements et armures
let seeAllFret = true;
let seeLandersFret = false;
let landingNoise = 6;
let upkeepVM = 1.333 // upkeep/1.33
let prodVM = 1.333 // prod/1.33
let geoProdDiv = 7; // 10
let gangsBonus = false;
let gangFacts = getGangFactors();
let sondeCount = 'gff';
let homeCount = 'cy';
let apoCount = 375; // 435 / plus grand = plus facile
let apoModeVar = 45; // 500,450,400,350 / plus grand = plus de différence entre les modes (facile, normal etc...)
let gameOver = false;
let stressLevels = [5,15,35,100]; // stress,freeze,fear,terror
let teleCost = {};
teleCost['Energie'] = 50;
teleCost['Argon'] = 10;
teleCost['Bossium'] = 2;
let teleStationCost = {};
teleStationCost['Energie'] = 250;
teleStationCost['Argon'] = 50;
teleStationCost['Bossium'] = 10;
let defMaxRes = 25000;
let nextWarn = 1;
let uniRes = false; // Unified Resistance (quand il y a un Bastion et que le tag nomove est normal)
// ALIENS
let showSilh = true;
let isFFW = false;
let pointDeMire = 1830; // tileId
let possibleMoves = []; // list of tile ids
let isMelee = false;
let closeTargetRange = 4; // à ce range, se dirige vers ce bataillon plutôt que vers le point de mire
let closeTargetRangeDice = 8; // 1 dé 8
let attAlive = true;
let defAlive = true;
let venumDamage = 45; // 45 = 15-45 damage (30)
let poisonDamage = 15; // 15 = 5-15 damage (10)
let parasiteDamage = 180;
let genoChance = 0;
let morphedBats = [];
let blubDamage = 6;
let bugROF = 1;
let spiderRG = false;
let spiderMV = false;
let spiderROF = false;
let bugSHIELD = false;
let larveHIDE = false;
let eggSHIELD = false;
let regenPower = 10; // 10%
let slowregPower = 3; // 3%
let autoRepPower = 5; // 5%
let shownEggs = [];
let vomiChance = 5; // 5% par oeuf manquant
let coqueChance = 20; // 20% pour une coque
let eggCrashMinPA = 4; // présence alien minimum pour qu'un oeuf puisse tomber sur une unité
let stopForFight = false;
let alienTypesList = [];
let colonyTiles = [];
let spawnType = {};
let alienThreat = 0;
// CONSTRUCTION
let conselUnit = {};
let conselAmmos = ['xxx','xxx','xxx','xxx'];
let conselCat;
let conselUpgrade = '';
let conselInto = false;
let conselTriche;
let conselCosts = {};
let myNewGear = ['xxx','xxx','xxx','xxx'];
let spinsLanderRecup = 135; // plus grand = moins de récup
let spinsBldRecup = 15; // plus grand = moins de récup
let maxSlots = 300;
// INVASION
let zoneInfos = {};
let maxAliens = 250;
let eggsNum = 0;
let aliensNum = 0;
let coconSatLimit = 10;
let coconStats = {};
coconStats.level = 1;
coconStats.turns = 25;
coconStats.dome = false;
coconStats.volc = false;
coconStats.colo = false;
coconStats.nextColo = false;
let fuzzDiv = 33; // fuzzTotal/fuzzDiv = bonus mapDiff;
let cumDrop = 5; // Plus grand = moins méchant : Cumulmative Drop: ((x*mapDrop)+mapTurn)/(x+1)
let dropMod = 4; //
let eggLifeStart = 12; //
let coqLifeStart = 7; //
let noEggs = 15; // % pour un eggDrop sans oeufs
let eggPause = false;
let domeProtect = false;
let pauseCount = 15; // pause tous les 15 oeufs tués
let eggPauseBase = -15;
let eggPauseMin = 7; // 1 chance sur 12: fin de pause (+compte des oeufs)
let eggPauseMax = 20;
let eggDropCount = 0;
// SOUNDS
// let musicChance = 2;
// let musicTracks = ['amb_ambiant1','parallel_dimensions','amb_ambiant3','amb_trucsympa','amb_ambiant2','biosphere','amb_ambiant4','it_is_raped'];
// let trackNum = rand.rand(0,3)*2;
let musicChance = 12;
let musicTracks = ['wave1','wave2','wave3','wave4','wave5','wave6','wave7'];
let trackNum = rand.rand(0,6);
let radioTracks = 16;
let radioChance = 3;
let radioNum = rand.rand(1,radioTracks);
// let trackNum = 0;
let stationTracks = ['lh_twodogs','lh_oblivion','lh_bobdub','lh_whengone','lh_hanap'];
if (playerInfos.onShip) {
    trackNum = rand.rand(0,4);
}
let theMusic = new Howl({
    src: ['/static/sounds/music/silence.mp3']
});
let theRadio = new Howl({
    src: ['/static/sounds/music/silence.mp3']
});
let theRoom = new Howl({
    src: ['/static/sounds/rooms/station.mp3']
});
let theMove = new Howl({
    src: ['/static/sounds/moves/bip.mp3']
});
let theWork = new Howl({
    src: ['/static/sounds/rooms/work.mp3']
});
let clicSnd = new Howl({
    src: ['/static/sounds/fx/clic.mp3']
});
let okSnd = new Howl({
    src: ['/static/sounds/moves/bip.mp3']
});
let soundDuration = 2000;
