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
let mapFilterDefault = "Normal";
let terSeedVariance = true;
let filterVariance = true;
let baseFilterChance = 4; // minimum 1 !!!
let filterBase = {};
let zone = [];
let zonePrev = [];
let resources = [];
let minedThisTurn = {};
let fretTuning = 2; // multiplie tous les Frets des unités : def 1
let mineRateDiv = 175; // divise le mining rate : def 200 (before: 125)
let resFoundDiv = 8; // default 9
let resBatchDiv = 16;
let permaRes = false;
let resPersistance = 20; // default 10
let minResForRate = 50;
let maxResForRate = 500;
let alienResFactor = 7; // base: 10
let magmaZone = 3;
let hasScraptruck = false;
let ruinRarity = 6; // default 8
let ruinsCompBase = 2; // 2 sur 150
let ruinsResBase = 50; // 33%
let coffreTileId = -1;
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
let stormChance = 10 // def 25/1000
// UNITS
let souteId = 1;
let inSoute = false;
let slId = 2; // selected lander id (en soute)
let souteFilter = 'infantry';
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
// let vetAccuracy = 4; // plus grand = moins de bonus (3 = x2.3) (2 = x3)
// let vetInitiative = 10; // plus grand = mieux (retire max vetInitiative*vet)
// let vetAP = 1; // 1 = +1 ap par niveau
// let vetStealth = 2; // 2 = +2 stealth par niveau (si 5+ de base)
let vetBonus = {
    rof: 6,
    initiative: 10,
    ap: 1,
    stealth: 1.4
}
let levelXP = [0,50,150,335,750];
let gangLevelCit = [0,500,1000,1500,2000,2400,2800,3200,3600,4000,4400,4800,5200,5600,6000,6400,6800,7200,7600,8000,8400,8800,9200];
let myCompPoints = 0;
// ACTIONS
let mode = "select";
let selectedBat = {};
let selectedBatType = {};
let selectedWeap = {};
let targetBat = {};
let targetBatType = {};
let targetWeap = {};
let baseLanderRange = 4;
let nextExplosion = 1;
let coverFactor = 0.8; // multiplie la cover du terrain (enlevé à accuracy)
let coverAOE = 0;
let hitBase = 9; // bonus to hit général (aliens et humains)
let alienHitBase = 2; // bonus to hit aliens
let initiativeDice = 15 // ajoute 0-15
let unitResist = 0;
let minFailSoins = 60; // def 60 : minimum 15/75 soins réussis
let stopMe = false;
let nextTurnOK = false;
let toHit = 999;
let escapeValue = 1.45;
let escaped = false;
let activeTurn = 'player';
let minPrec = 3 // minimum de précision (même après ajustements)
let watchInitBonus = 30; // retire à l'initiative si GUET
let minFireAP = -7; // ne peut pas tirer si moins d'AP (ni attaque ni riposte)
let stealthMaxChance = 96; // max chance de se rendre invisible
let berserkEnemyDamage = 1.5;
let berserkROF = 1.5;
let minesExploded = 0;
let deadBatsList = [];
let deadAliensList = [];
let luckCheck = [7,14,21,86,93,100];
let toxChance = 30;
let cheapWeapCost = 99;
let mecanoHP = 90;
let roadAPCost = 8;
let bonusTransRetour = 1.25;
let batDebarq = {};
let medicalTransports = [];
let medicPatientAP = 3;
let landers = [];
let fogRange = 5;
let foggersTiles = [];
let foggedTiles = [];
let zombRange = 5;
let zombifiersTiles = [];
let zombifiedTiles = [];
let startLander = 5;
let deploySalvos = 4; // on part de 7
let deployTuning = 6; // on part de 7 - PAS utilisé !!!
let seeAllFret = false;
let seeLandersFret = false;
let landingNoise = 6;
let upkeepVM = 1.33 // upkeep/1.33
let prodVM = 1.33 // prod/1.33
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
let eggsNum = 0;
let aliensNum = 0;
let coconSatLimit = 5;
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
let fuzzDiv = 33; // fuzzTotal/fuzzDiv = bonus mapDiff;
let cumDrop = 5; // Plus grand = moins méchant : Cumulmative Drop: ((x*mapDrop)+mapTurn)/(x+1)
let dropMod = 4; //
let eggLifeStart = 12; //
let eggLifeFactor = 0.7; //
let coqLifeStart = 6; //
let coqLifeFactor = 0.5; //
let noEggs = 15; // % pour un eggDrop sans oeufs
let eggPause = false;
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
let theRoom = new Howl({
    src: ['/static/sounds/rooms/station.mp3']
});
let theMove = new Howl({
    src: ['/static/sounds/moves/car.mp3']
});
let theWork = new Howl({
    src: ['/static/sounds/rooms/work.mp3']
});
let clicSnd = new Howl({
    src: ['/static/sounds/fx/clic.mp3']
});
let soundDuration = 2000;
let musicChance = 8;
