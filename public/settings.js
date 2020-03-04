let numHTiles = 60; // default 15
let numVTiles = 60; // default 9
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
let terSeed = 12; // def 12 +grand = +grandes forêts etc...
let specialSeed = 8; // def 8 +grand = moins de terrains spéciaux
let swampWater = 5; // def 5 chance d'avoir un swamps à la place d'un water (ou l'inverse)
let mountHills = 9; // def 9 chance d'avoir une montagne à la place d'une hills (ou l'inverse)
let terrainTypes = [];
let mapFilters = [];
let mapFilterDefault = "Normal";
let terSeedVariance = true;
let filterVariance = true;
let filterBase = {};
let zone = [];
let resources = [];

let unitTypes = [];
let pop = [];
