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
let terSeed = 5;
let pop = [];
let zone = [];
let terrains = [];
let resources = [];
let unitTypes = [];
