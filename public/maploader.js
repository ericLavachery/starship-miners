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
    let visMap = _.filter(wmap, function(tile) {
        return (tile.x >= minX && tile.x <= maxX && tile.y >= minY && tile.y <= maxY);
    });
    let sortedVisMap = _.sortBy(_.sortBy(visMap,'y'),'x');
    sortedVisMap.forEach(function(tile) {
        terclass = 'ter'+tile.terrain+tile.seed;
        $('#zone_map').append('<div id="'+tile.id+'" class="grid-item '+terclass+'" onclick="clickTile('+tile.id+')"><span class="bigIcon" id="b'+tile.id+'"></span><br></div>');
        bataillons.forEach(function(bat) {
            if (bat.tileId === tile.id && bat.loc === "zone") {
                showBataillon(bat);
            }
        });
    });
    selectMode();
    // console.log(zone);
};

function showBataillon(bat) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
    let batPic = unitTypes[unitIndex].pic;
    $('#b'+bat.tileId).append('<img src="/static/img/units/'+batPic+'.svg" title="'+bat.squadsLeft+' '+bat.type+'">');
};

function writeMapStyles() {
    $('#mapStyles').empty();
    $('#mapStyles').append('.grid-container {grid-template-columns:');
    let i = 0;
    while (i < numHTiles) {
        $('#mapStyles').append(' 72px');
        i++;
    }
    $('#mapStyles').append(';grid-template-rows:');
    i = 0;
    while (i < numVTiles) {
        $('#mapStyles').append(' 72px');
        i++;
    }
    $('#mapStyles').append(';}');
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
