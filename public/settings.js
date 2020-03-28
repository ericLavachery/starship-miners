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
let levelXP = [0,10,25,45,70];
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
// let report = '';
// ALIENS
let pointDeMire = 1830; // tileId
let possibleMoves = []; // list of tile ids
let isMelee = false;
let closeTargetRange = 4; // à ce range, se dirige vers ce bataillon plutôt que vers le point de mire
let closeTargetRangeDice = 3; // 2 dés
let attAlive = true;
let defAlive = true;
