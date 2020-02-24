let numHTiles = 15; // default 15
let numVTiles = 9; // default 9
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
let pop = [];
let world = [];
let ter = [];
let ress = [];
let towns = [];
let unhiddenTiles = [];
let perso = {};
let mygroups = [];
let myTracks = [];
let trackedTiles = '';
let selectedUnit = [];
let selectedTrack = [];
let selectedTile = [];
let selTer = [];
let selAddon = 'point';
let selCity = '';
let mapEditTemp = -1;
let mode = 'inspect';
let opChoice = false;
let uvp = ''; // unit view priority
let showTracks = false;
let expSquadDetail = false;
let expTileDetail = false;
let exploMLfactor = 1.5; // explo move loss = moveCost*exploMLfactor
let cartoMLfactor = 1;
let minCartoML = 60; // perte de move min (x3 si sans hab spéciale)
let maxMoveCost = 240; // 180 default
let baseMoveCost = 40; // moveCost is x baseMoveCost /30
let viewOutPerc = 0; // % qu'un tile soit perdu de vue en passant au jour suivant (defaut 5 / dev 0)
// FIGHT SETTINGS
// FALSE
// let attUnitId = Number(new URLSearchParams(document.location.search).get("aui"));
// if (attUnitId == null) {
//     attUnitId = 99;
// }
// let defUnitId = Number(new URLSearchParams(document.location.search).get("dui"));
// if (defUnitId == null) {
//     defUnitId = 126;
// }
// let duiIndex = pop.findIndex((obj => obj.id == defUnitId));
// let auiIndex = pop.findIndex((obj => obj.id == attUnitId));
// let fightOpp = pop[duiIndex].player;
// let fightOwn = pseudo;
// let fightMapId = pop[duiIndex].tileId;
// if (pop[duiIndex].tileId != pop[auiIndex].tileId) {
//     console.log('Attaquant et défenseur ne sont pas sur le même tile!');
//     fightMapId = 0;
// }
let attUnitId = 99;
let defUnitId = 126;
let fightMapId = 541;
let fightOpp = 'Zorglub';
let fightOwn = 'Bob';
// TRUE
let cTurn = 0;
let cPop = [];
let cTeams = {};
cTeams.own = {};
cTeams.opp = {};
cTeams.own.player = fightOwn;
cTeams.opp.player = fightOpp;
cTeams.own.count = 0;
cTeams.opp.count = 0;
cTeams.own.aCouvrir = 0;
cTeams.opp.aCouvrir = 0;
cTeams.own.couvreurs = 0;
cTeams.opp.couvreurs = 0;
cTeams.own.org = 0;
cTeams.opp.org = 0;
cTeams.own.protection = 0;
cTeams.opp.protection = 0;
let cpChoice = [];
let cppMelee = [];
let cppRange = [];
let cppNone = [];
let cppAssa = [];
let biomeCoverFac = 50; // terCover x biomeCoverFac / 100
let biomeDefFac = 100; // terDefense x biomeDefFac / 100
let rapiditeDice = 30; // dé rapidité (1-rapiditeDice)
let choiceDice = 50; // dé rapidité (1-choiceDice)
let prioDice = 100; // dé priorité (1-prioDice)
let critFac = 4; // multiplication des dégâts quand coup critique
let protectFac = 90; // protection x protectFac / 100
let defenseFac = 2; // parade et esquive x defenseFac
let divPAres = 10000;
let divPApow = 700;
let divPA = 100;
// UNITS CRUD
let unitTypes = [];
let skills = [];
let categs = [];
let fieldsOut = ['coverAdj','moveAdj'];
let unitsOut = [];
let filterAddMode = false;
let numOpt = 0;
let unitsTableSort = 'type';
let unitsTableRev = false;
let loopEditStop = false;
let fuckOut = 0;
