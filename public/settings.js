let numHTiles = 15; // default 15
let numVTiles = 9; // default 9
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
// MAP GENERATOR
let modeSonde = false;
let maxMapsParDet = 4;
let impact = false;
let zoneFiles = [];
let terSeed = 12; // def 12 +grand = +grandes forêts etc...
let specialSeed = 10; // def 10 +grand = moins de terrains spéciaux
let riverSeed = 9;
let swampWater = 5; // def 5 chance d'avoir un swamps à la place d'un water (ou l'inverse)
let mountHills = 9; // def 9 chance d'avoir une montagne à la place d'une hills (ou l'inverse)
let riverEW = 4; // chance pour une rivière Est-Ouest (2- = 100%) +grand = moins de chance
let riverNS = 5; // chance pour une rivière Nord-Sud (2- = 100%) +grand = moins de chance
let riverSN = 5; // chance pour une rivière Nord-Sud (2- = 100%) +grand = moins de chance
let riverCurve = 3; // +grand = rivières plus droites (minimum 3)
let maxTileCheck = 5; // 4 = tendance transversale / 5 = tendance droite
let terrainTypes = [];
let armorTypes = [];
let ammoTypes = [];
let mapFilters = [];
let filterEffect = 10;
let mapFilterDefault = "Normal"; // Normal!
let terSeedVariance = true;
let filterVariance = true; // true!
let baseFilterChance = 3; // minimum 1 !!!
let filterBase = {};
let zone = [];
let zonePrev = [];
let resources = [];
let minedThisTurn = {};
let fretTuning = 2; // multiplie tous les Frets des unités : def 1
let landerFretTuning = 1.25; // multiplie tous les Frets des landers : def 1
let mineRateDiv = 150; // divise le mining rate : def 200 (before: 125)
let resFoundDiv = 8; // default 9
let resBatchDiv = 16;
let permaRes = false;
let resPersistance = 20; // default 10
let minResForRate = 50;
let maxResForRate = 500;
let alienResFactor = 7; // base: 10
let magmaZone = 3;
let eCrafting = 7; // base: 10 (x ressources pour 10 enargie)
let baseCrafts = 4;
let hasScraptruck = false;
let ruinRarity = 6; // default 8
let ruinsCompBase = 6; // 4 sur 300
let ruinsResBase = 50; // 33%
let coffreTileId = -1;
let encounterTileId = -1;
let ruinsCitBase = 100; // def 50
let ruinsCrimChance = 15; // 1/15 criminels au lieu de citoyens
let ruinsEmpty = true;
let ruinsBugBase = 25; // def 50
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
let inSoute = false;
let slId = 2; // selected lander id (en soute)
let souteFilter = 'all';
let souteTab = 'unitz';
let modeLanding = false;
let unitTypes = [];
let unitDV = {}
let bataillons = [];
let batsInSpace = [];
let batList = [];
let alienList = [];
let alienOccupiedTiles = [];
let playerOccupiedTiles = [];
let visibleAliens = [];
let visibleEggs = [];
let prepaBld = {};
let vetBonus = {
    rof: 6,
    initiative: 10,
    ap: 1,
    stealth: 1.4
}
let levelXP = [0,50,150,400,800];
let gangLevelCit = [0,1000,1400,1800,2200,2600,3000,3400,3800,4200,4600,5000,5400,5800,6200,6600,7000,7400,7800,8200,8600,9000,9400];
let myCompPoints = 0;
// ACTIONS
let moveTuning = 1.2; // moveCost x moveTuning
let moveKzin = 0.85;
let isReloaded = true;
let mode = "select";
let selectedBat = {};
let selectedBatType = {};
let selectedWeap = {};
let targetBat = {};
let targetBatType = {};
let targetWeap = {};
let batHasTarget = false;
let baseLanderRange = 4;
let nextExplosion = 1;
let pansolFactor = 100; // divisé par 160
let coverFactor = 0.8; // multiplie la cover du terrain (enlevé à accuracy)
let coverAOE = -10;
let minPrec = 3 // minimum de précision (même après ajustements)
let hitBase = 9; // bonus to hit général (aliens et humains)
let alienHitBase = 2; // bonus précision aliens
let alienHPBase = 1; // hp x1
let alienMeleeROF = 1.25;  // bonus rof aliens en mêlée
let alienInitiative = -15;
let initiativeDice = 15 // ajoute 0-15
let unitResist = 0;
let minFailSoins = 60; // def 60 : minimum 15/75 soins réussis
let stopMe = false;
let nextTurnOK = false;
let toHit = 999;
let escapeValue = 1.45;
let escaped = false;
let activeTurn = 'player';
let watchInitBonus = 30; // retire à l'initiative si GUET
let minFireAP = -7; // ne peut pas tirer si moins d'AP (ni attaque ni riposte)
let stealthMaxChance = 96; // max chance de se rendre invisible
let berserkEnemyDamage = 1.5;
let berserkROF = 1.5;
let minesExploded = 0;
let deadBatsList = [];
let deadAliensList = [];
let luckCheck = [7,14,21,86,93,100];
let cheapWeapCost = 99;
let mecanoHP = 90;
let roadAPCost = 8;
let bonusTransRetour = 1.25;
let batDebarq = {};
let medicalTransports = [];
let medicPatientAP = 3;
let landers = [];
let fogRange = 5;
let foggedTiles = [];
let zombRange = 5;
let zombifiedTiles = [];
let roboRange = true;
let roboTiles = [];
let startLander = 5;
let deploySalvos = 4; // on part de 7
let deployTuning = 6; // on part de 7 - PAS utilisé !!!
let seeAllFret = false;
let seeLandersFret = false;
let landingNoise = 6;
let upkeepVM = 1.333 // upkeep/1.33
let prodVM = 1.333 // prod/1.33
let gangsBonus = false;
let sondeCount = 'cy';
let homeCount = 'cy';
let apoCount = 435;
let stressLevels = [5,15,35,100]; // stress,freeze,fear,terror
// ALIENS
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
let parasiteDamage = 120;
let blubDamage = 6;
let bugROF = 1;
let spiderRG = false;
let spiderROF = false;
let bugSHIELD = false;
let larveHIDE = false;
let eggSHIELD = false;
let regenPower = 10; // 10%
let slowregPower = 3; // 3%
let shownEggs = [];
let vomiChance = 5; // 5% par oeuf manquant
let coqueChance = 20; // 20% pour une coque
let stopForFight = false;
let alienTypesList = [];
let colonyTiles = [];
let spawnType = {};
// CONSTRUCTION
let conselUnit = {};
let conselAmmos = ['xxx','xxx','xxx','xxx'];
let conselCat;
let conselUpgrade = '';
let conselTriche;
let conselCosts = {};
let myNewGear = ['xxx','xxx','xxx','xxx'];
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
let eggLifeFactor = 0.7; //
let coqLifeStart = 7; //
let coqLifeFactor = 0.5; //
let noEggs = 15; // % pour un eggDrop sans oeufs
let eggPause = false;
let domeProtect = false;
let pauseCount = 15; // pause tous les 15 oeufs tués
let eggPauseBase = -15;
let eggPauseMin = 7; // 1 chance sur 12: fin de pause (+compte des oeufs)
let eggPauseMax = 20;
let eggDropCount = 0;
// SOUNDS
let musicTracks = ['nero1','nero2','nero3','nero4','nero5','nero6','nero7','nero8'];
let theMusic = new Howl({
    src: ['/static/sounds/music/nero1.mp3']
});
// let theBack = new Howl({
//     src: ['/static/sounds/music/joao-janz_sha04.mp3']
// });
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
let musicChance = 8;
