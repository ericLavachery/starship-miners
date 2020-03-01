// UnitTypes
socket.on('unitDV_Load', function(dv) {
    unitDV = dv;
    // console.log(unitDV);
});
socket.on('unitTypes_Load', function(ut) {
    bareUnitTypes = ut;
    // $('#con').append('<br><span class="jaune">Second Weapon : ' + unitTypes[1].weapon2.name + '</span>');

    let newObj = {};
    let unitTypes = [];
    bareUnitTypes.forEach(function(type) {
        newObj = Object.assign({}, unitDV, type);
        unitTypes.push(newObj)
    });
    console.log(unitTypes);
    bareUnitTypes = [];



});

function createMap(size) {

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
    let visMap = _.filter(wmap, function(tile) {
        return (tile.x >= minX && tile.x <= maxX && tile.y >= minY && tile.y <= maxY);
    });
    let sortedVisMap = _.sortBy(_.sortBy(visMap,'y'),'x');
    let terclass = '';
    let tertitle = '';
    // sortedVisMap.forEach(function(tile) {
    //     if (perso.mapView.includes(tile.id) || mode == 'mapedit') {
    //         terclass = 'ter'+tile.terrainId+tile.seed;
    //         if (mode == 'mapedit') {
    //             let terIndex = ter.findIndex((obj => obj.id == tile.terrainId));
    //             tertitle = ter[terIndex].name+' ('+tile.seed+') #'+tile.id;
    //         } else {
    //             tertitle = '#'+tile.id;
    //         }
    //         $('#zone_map').append('<div id="'+tile.id+'" class="grid-item '+terclass+'" onclick="selectOrMove('+tile.id+')" title="'+tertitle+'"><span class="mapCity" id="c'+tile.id+'"></span><span class="mapNoteL" id="l'+tile.id+'"></span><span class="bigIcon" id="b'+tile.id+'"></span><span class="mapNoteR" id="r'+tile.id+'"></span><br><span class="smallIcons" id="s'+tile.id+'"></span><br></div>');
    //         showTileTags(tile.id);
    //     } else {
    //         $('#zone_map').append('<div id="'+tile.id+'" class="grid-item fog" onclick="selectOrMove('+tile.id+')" title="#'+tile.id+'"><span class="bigIcon" id="b'+tile.id+'"></span><br><span class="smallIcons" id="s'+tile.id+'"></span><br></div>');
    //     }
    // });
};

// function isAdjacent(myTileIndex, thatTileIndex, mapSize) {
//     if (thatTileIndex == myTileIndex+1 || thatTileIndex == myTileIndex-1 || thatTileIndex == myTileIndex+mapSize || thatTileIndex == myTileIndex+mapSize+1 || thatTileIndex == myTileIndex+mapSize-1 || thatTileIndex == myTileIndex-mapSize || thatTileIndex == myTileIndex-mapSize-1 || thatTileIndex == myTileIndex-mapSize+1) {
//         return true;
//     } else {
//         return false;
//     }
// };

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

function nextTile(myTileIndex, mapSize) {
    // définir le tile à vérifier
    let tileCheck = 0;
    if (myTileIndex >= mapSize) {
        if (myTileIndex % mapSize === 0) {
            // not first line, first col
            tileCheck = rand.rand(3,4);
        } else if (myTileIndex+1 % mapSize === 0) {
            // not first line, last col
            tileCheck = rand.rand(1,3);
        } else {
            // middle
            tileCheck = rand.rand(1,4);
        }
    } else if (myTileIndex != 0) {
        // first tile
        tileCheck = 0;
    } else {
        // first line, not first tile
        tileCheck = 1;
    }

    // définir le terrain du tile à vérifier
    let checkTileTerrain = "P";
    let checkTileIndex = 0;
    if (tileCheck == 0) {
        checkTileType = "X";
    }
    if (tileCheck == 1) {
        checkTileIndex = myTileIndex-1;
    }
    if (tileCheck == 2) {
        checkTileIndex = myTileIndex-mapSize-1;
    }
    if (tileCheck == 3) {
        checkTileIndex = myTileIndex-mapSize;
    }
    if (tileCheck == 4) {
        checkTileIndex = myTileIndex-mapSize+1;
    }
    checkTileTerrain = zone[checkTileIndex].terrain;

    // define next tile
    let diceMax = 15;
    if (checkTileTerrain != "X") {
        diceMax = diceMax*3;
    }
    let diceCheck = rand.rand(1,diceMax);
    if (diceCheck == 1) {
        return "M"; // Mountains
    }
    if (diceCheck == 2 || diceCheck == 3) {
        return "H"; // Hills
    }
    if (diceCheck == 4 || diceCheck == 5 || diceCheck == 6) {
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
    if (diceCheck >= 16) {
        return checkTileTerrain; // Same as checkTile
    }

};
