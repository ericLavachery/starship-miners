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
let resources = [];
let mineRateDiv = 250; // divise le mining rate : def 100
let resFoundDiv = 9; // default 9
let resBatchDiv = 12;
let permaRes = false;
let minResForRate = 100;
let ruinRarity = 8;
let ruinsCitBase = 75; // def 50
let ruinsBugBase = 50; // def 50
let selectedTile = -1;
let showMini = false;
let miniDots = 'units';
let showResOpen = false;
let showAllRes = true;
let showOneRes = 'Toutes';
let oneResTileIds = [];
// UNITS
let unitTypes = [];
let unitDV = {}
let bataillons = [];
let batList = [];
let alienList = [];
let alienOccupiedTiles = [];
let playerOccupiedTiles = [];
let visibleAliens = [];
// let vetAccuracy = 4; // plus grand = moins de bonus (3 = x2.3) (2 = x3)
// let vetInitiative = 10; // plus grand = mieux (retire max vetInitiative*vet)
// let vetAP = 1; // 1 = +1 ap par niveau
// let vetStealth = 2; // 2 = +2 stealth par niveau (si 5+ de base)
let vetBonus = {
    accuracy: 4,
    initiative: 10,
    ap: 1,
    stealth: 1.4
}
let levelXP = [0,50,125,225,350];
// ACTIONS
let mode = "select";
let selectedBat = {};
let selectedBatType = {};
let selectedWeap = {};
let targetBat = {};
let targetBatType = {};
let targetWeap = {};
let nextExplosion = 1;
let coverFactor = 1; // multiplie la cover du terrain (enlevé à accuracy)
let initiativeDice = 15 // ajoute 0-15
let stopMe = false;
let nextTurnOK = false;
let toHit = 999;
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
let roadAPCost = 10;
let bonusTransRetour = 1.1;
let batDebarq = {};
let medicalTransports = [];
let landers = [];
// ALIENS
let fuzzDiv = 33; // fuzzTotal/fuzzDiv = bonus mapDiff;
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
let regenPower = 10; // 10%
let slowregPower = 3; // 3%
let shownEggs = [];
let vomiChance = 5; // 5% par oeuf manquant
let coqueChance = 20; // 20% pour une coque
let stopForFight = false;
let alienTypesList = [];
let spawnType = {};
let eggsNum = 0;
let aliensNum = 0;
// CONSTRUCTION
let conselUnit = {};
let conselAmmos = ['xxx','xxx','xxx'];
let conselCat;
let conselTriche;
// INVASION
let maxAliens = 250;
let cumDrop = 12; // Plus grand = moins méchant : Cumulmative Drop: ((x*mapDrop)+mapTurn)/(x+1)
let dropMod = 2.5; //
let eggLifeStart = 12; //
let eggLifeFactor = 0.7; //
let coqLifeStart = 6; //
let coqLifeFactor = 0.5; //
let noEggs = 15; // % pour un eggDrop sans oeufs
let eggPause = false;
let pauseCount = 15; // pause tous les 15 oeufs tués
let eggPauseBase = -15;
let eggPauseMin = 4; // 1 chance sur 12: fin de pause (+compte des oeufs)
let eggPauseMax = 20;
let eggDropCount = 0;
// SOUNDS
let musicVolume = 0.4;
let fxVolume = 0.6;
let musicTracks = ['nero1','nero2','nero3','nero4','nero5','nero6','nero7','nero8'];
let theMusic = new Howl({
    src: ['/static/sounds/music/nero1.mp3']
});
let musicChance = 8;
