// Dessine la carte
function showMap(wmap,justMoved) {
    // reset
    $('#zone_map').empty();
    // fill
    let minX = xOffset+1;
    let maxX = xOffset+numVTiles;
    let minY = yOffset+1;
    let maxY = yOffset+numHTiles;
    let terclass = '';
    let tertitle = '';
    let resHere = '';
    let visMap = _.filter(wmap, function(tile) {
        return (tile.x >= minX && tile.x <= maxX && tile.y >= minY && tile.y <= maxY);
    });
    let sortedVisMap = _.sortBy(_.sortBy(visMap,'y'),'x');
    sortedVisMap.forEach(function(tile) {
        resHere = showRes(tile.id);
        terclass = 'ter'+tile.terrain+tile.seed;
        $('#zone_map').append('<div id="'+tile.id+'" class="grid-item '+terclass+'" onclick="clickTile('+tile.id+')" title="#'+tile.id+'"><span class="bigIcon" id="b'+tile.id+'">'+resHere+'</span><br></div>');
        bataillons.forEach(function(bat) {
            if (bat.tileId === tile.id && bat.loc === "zone") {
                if (bat.tileId === selectedBat.tileId) {
                    tileSelect(bat);
                }
                showBataillon(bat);
            }
        });
        aliens.forEach(function(alien) {
            if (alien.tileId === tile.id && alien.loc === "zone") {
                showAlien(alien);
            }
        });
    });
    if (!justMoved) {
        selectMode();
        alienOccupiedTileList();
    }
    // console.log(zone);
};

function redrawTile(tileId,drawSelectedBat) {
    $('#b'+tileId).empty();
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            if (drawSelectedBat || bat.id != selectedBat.id) {
                showBataillon(bat);
            }
        }
    });
};

function showRes(tileId) {
    if (zone[tileId].rq >= 1) {
        if (zone[tileId].tileName !== undefined && zone[tileId].tileName != '') {
            return '<div class="mapInfos"><i class="fas fa-map-marker-alt"></i><i class="fas fa-atom"></i></div>';
        } else {
            return '<div class="mapInfos"><i class="fas fa-atom"></i></div>';
        }
    } else {
        if (zone[tileId].tileName !== undefined && zone[tileId].tileName != '') {
            return '<div class="mapInfos"><i class="fas fa-map-marker-alt"></i></div>';
        } else {
            return '';
        }
    }
};

function showAlien(bat) {
    let unitIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
    let batPic = alienUnits[unitIndex].pic;
    let batCat = alienUnits[unitIndex].cat;
    let unitsLeft = bat.squadsLeft*alienUnits[unitIndex].squadSize;
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    $('#b'+bat.tileId).append('<div class="pUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+bat.type+'"></div>'+resHere);
};

function showBataillon(bat) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
    let batPic = unitTypes[unitIndex].pic;
    let batCat = unitTypes[unitIndex].cat;
    let unitsLeft = bat.squadsLeft*unitTypes[unitIndex].squadSize;
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    $('#b'+bat.tileId).append('<div class="pUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+bat.type+'"></div><div class="batInfos"><img src="/static/img/vet'+bat.vet+'.png" width="15"></div>'+resHere);
};

function hideBataillon(bat) {
    $('#b'+bat.tileId).empty();
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
