// UnitTypes
socket.on('unitDV_Load', function(dv) {
    unitDV = dv;
    // console.log(unitDV);
});
socket.on('unitTypes_Load', function(ut) {
    bareUnitTypes = ut;
    // $('#con').append('<br><span class="jaune">Second Weapon : ' + unitTypes[1].weapon2.name + '</span>');

    let newObj = {};
    bareUnitTypes.forEach(function(type) {
        newObj = Object.assign({}, unitDV, type);
        unitTypes.push(newObj)
    });
    // console.log(unitTypes);
    bareUnitTypes = [];
    createMap(15);
    showMap(zone);
});

function createMap(size) {
    let newTile = {};
    let i = 0;
    let theId = 0;
    let thisTerrain = "P";
    while (i < size*size) {
        newTile = {};
        newTile.id = i;
        newTile.terrain = nextTile(i, size);
        thisTerrain = newTile.terrain;
        newTile.seed = nextSeed(thisTerrain);
        zone.push(newTile);
        i++;
    }
    console.log(zone);
};

// Dessine la carte
function showMap(wmap) {
    // reset
    $('#zone_map').empty();
    // fill
    let minX = xOffset+1;
    let maxX = xOffset+numVTiles;
    let minY = yOffset+1;
    let maxY = yOffset+numHTiles;
    let terclass = '';
    let tertitle = '';
    zone.forEach(function(tile) {
        terclass = 'ter'+tile.terrain+tile.seed;
        $('#zone_map').append('<div id="'+tile.id+'" class="grid-item '+terclass+'"><span class="bigIcon" id="b'+tile.id+'"><img src="/static/img/wtiles/empty.png"></span><br></div>');
    });
    console.log(zone);
};

function isAdjacent(myTileIndex, thatTileIndex) {
    let myTileX = zone[myTileIndex].x;
    let myTileY = zone[myTileIndex].y;
    let thatTileX = zone[thatTileIndex].x;
    let thatTileY = zone[thatTileIndex].y;
    if (thatTileX == myTileX+1 || thatTileX == myTileX || thatTileX == myTileX-1) {
        if (thatTileY == myTileY+1 || thatTileY == myTileY || thatTileY == myTileY-1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

function nextTile(myTileIndex, size) {
    // définir le tile à vérifier
    let tileCheck = 0;
    if (myTileIndex >= size) {
        if (myTileIndex % size === 0) {
            // not first line, first col
            // console.log('not first line, first col');
            tileCheck = rand.rand(3,4);
        } else if (myTileIndex+1 % size === 0) {
            // not first line, last col
            // console.log('not first line, last col');
            tileCheck = rand.rand(1,3);
        } else {
            // middle
            // console.log('middle');
            tileCheck = rand.rand(1,4);
        }
    } else if (myTileIndex == 0) {
        // first tile
        // console.log('first tile');
        tileCheck = 0;
    } else {
        // first line, not first tile
        // console.log('first line, not first tile');
        tileCheck = 1;
    }

    // définir le terrain du tile à vérifier
    let checkTileTerrain = "P";
    let checkTileIndex = 0;
    if (tileCheck == 0) {
        checkTileTerrain = "X";
    } else {
        if (tileCheck == 1) {
            checkTileIndex = myTileIndex-1;
        }
        if (tileCheck == 2) {
            checkTileIndex = myTileIndex-size-1;
        }
        if (tileCheck == 3) {
            checkTileIndex = myTileIndex-size;
        }
        if (tileCheck == 4) {
            checkTileIndex = myTileIndex-size+1;
        }
        checkTileTerrain = zone[checkTileIndex].terrain;
    }

    // define next tile
    let diceMax = 16;
    if (checkTileTerrain != "X") {
        if (checkTileTerrain == "S") {
            diceMax = Math.round(diceMax*terSeed/1.5);
        } else {
            diceMax = diceMax*terSeed;
        }
    }
    let diceCheck = rand.rand(1,diceMax);
    let swampCheck = rand.rand(1,swampWater);
    let mountCheck = rand.rand(1,mountHills);
    if (diceCheck == 1) {
        return "M"; // Mountains
    }
    if (diceCheck == 2 || diceCheck == 3) {
        return "H"; // Hills
    }
    if (diceCheck == 4 || diceCheck == 5 || diceCheck == 6 || diceCheck == 16) {
        return "P"; // Plains
    }
    if (diceCheck == 7 || diceCheck == 8 || diceCheck == 9) {
        return "G"; // Grasslands
    }
    if (diceCheck == 10 || diceCheck == 11) {
        return "B"; // Bushes
    }
    if (diceCheck == 12 || diceCheck == 13) {
        return "F"; // Forest
    }
    if (diceCheck == 14) {
        return "S"; // Swamps
    }
    if (diceCheck == 15) {
        return "W"; // Water
    }
    if (diceCheck >= 17) {
        if (checkTileTerrain == "W" && swampCheck == 1) {
            return "S"; // Swamps
        } else {
            if (checkTileTerrain == "S" && swampCheck == 1) {
                return "W"; // Water
            } else {
                if (checkTileTerrain == "H" && mountCheck == 1) {
                    return "M"; // Mountains
                } else {
                    if (checkTileTerrain == "M" && mountCheck == 1) {
                        return "H"; // Hills
                    } else {
                        return checkTileTerrain; // Same as checkTile
                    }
                }
            }
        }
    }
};

function nextSeed(ter) {
    if (ter == "M") {
        return rand.rand(1,6);
    } else if (ter == "W") {
        return rand.rand(1,3);
    } else {
        return rand.rand(1,3);
    }
};
