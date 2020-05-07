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
let riverSeed = 15;
let swampWater = 5; // def 5 chance d'avoir un swamps à la place d'un water (ou l'inverse)
let mountHills = 9; // def 9 chance d'avoir une montagne à la place d'une hills (ou l'inverse)
let riverEW = 5; // chance pour une rivière Est-Ouest (2- = 100%) +grand = moins de chance
let riverNS = 6; // chance pour une rivière Nord-Sud (2- = 100%) +grand = moins de chance
let riverSN = 6; // chance pour une rivière Nord-Sud (2- = 100%) +grand = moins de chance
let riverCurve = 3; // +grand = rivières plus droites (minimum 3)
let terrainTypes = [];
let mapFilters = [];
let mapFilterDefault = "Normal";
let terSeedVariance = true;
let filterVariance = true;
let filterBase = {};
let zone = [];
let resources = [];
// UNITS
let unitTypes = [];
let unitDV = {}
let bataillons = [];
let batList = [];
let alienList = [];
let alienOccupiedTiles = [];
let playerOccupiedTiles = [];
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
let levelXP = [0,10,25,45,70];
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
let toHit = 999;
let activeTurn = 'player';
let minPrec = 3 // minimum de précision (même après ajustements)
let watchInitBonus = 30; // retire à l'initiative si GUET
let minFireAP = -7; // ne peut pas tirer si moins d'AP (ni attaque ni riposte)
let stealthMaxChance = 93; // max chance de se rendre invisible
let berserkEnemyDamage = 1.5;
let berserkROF = 1.5;
let deadBatsList = [];
let deadAliensList = [];
let luckCheck = [7,14,21,86,93,100];
let toxChance = 30;
let cheapWeapCost = 99;
// ALIENS
let isFFW = false;
let pointDeMire = 1830; // tileId
let possibleMoves = []; // list of tile ids
let isMelee = false;
let closeTargetRange = 4; // à ce range, se dirige vers ce bataillon plutôt que vers le point de mire
let closeTargetRangeDice = 8; // 1 dé 8
let attAlive = true;
let defAlive = true;
let venumDamage = 33; // 33 = 11-33 damage (22) (shinda 40)
let poisonDamage = 12; // 12 = 4-12 damage (8)
let parasiteDamage = 90;
let blubDamage = 3;
let bugROF = 1;
let regenPower = 10; // 10 = 1/10 des HP de base chaque tour
let slowregPower = 3; // 10 = 1/10 des HP de base chaque tour
let shownEggs = [];
let vomiChance = 5; // 5% par oeuf manquant
let stopForFight = false;
// CONSTRUCTION
let conselUnit = {};
let conselAmmos = ['xxx','xxx'];
// INVASION
let cumDrop = 5; // Plus grand = moins méchant : Cumulmative Drop: ((x*mapDrop)+mapTurn)/(x+1)
let noEggs = 15; // % pour un eggDrop sans oeufs
let eggDropCount = 0;
