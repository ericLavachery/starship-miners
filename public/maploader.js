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
    let batHere = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            if (drawSelectedBat || bat.id != selectedBat.id) {
                showBataillon(bat);
                batHere = true;
            }
        }
    });
    if (!batHere) {
        let resHere = showRes(tileId);
        $('#b'+tileId).append(resHere);
    }
};

function showRes(tileId) {
    let tile = zone[tileId];
    let mapIndicators = '';
    let res = '';
    if (tile.rq >= 1) {
        res = JSON.stringify(tile.rs);
        res = res.replace(/"/g,"");
        res = res.replace(/{/g,"");
        res = res.replace(/}/g,"");
        res = res.replace(/,/g," &nbsp;&horbar;&nbsp; ");
        res = res.replace(/:/g," ");
    }
    if (tile.rd || tile.rq >= 1 || (tile.tileName !== undefined && tile.tileName != '')) {
        mapIndicators = mapIndicators+'<div class="mapInfos" title="'+res+'">';
    }
    if (tile.rd) {
        mapIndicators = mapIndicators+'<i class="fas fa-shoe-prints fa-rotate-270 road"></i>';
    }
    if (tile.tileName !== undefined && tile.tileName != '') {
        mapIndicators = mapIndicators+'<i class="fas fa-map-marker-alt inficon"></i>';
    }
    if (tile.rq >= 1) {
        mapIndicators = mapIndicators+'<i class="fas fa-atom inficon rq'+tile.rq+'"></i>';
    }
    if (tile.rd || tile.rq >= 1 || (tile.tileName !== undefined && tile.tileName != '')) {
        mapIndicators = mapIndicators+'</div>';
    }
    if (tile.ruins) {
        mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/ruins.png"></div>'
    }
    if (tile.talus) {
        mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/talus.png"></div>'
    }
    return mapIndicators;
};

function showAlien(bat) {
    let batType = getBatType(bat);
    let batPic = batType.pic;
    let batCat = batType.cat;
    let unitsLeft = bat.squadsLeft*batType.squadSize;
    $('#b'+bat.tileId).empty();
    let alienClass = 'aUnits';
    if (batType.skills.includes('invisible') || bat.tags.includes('invisible')) {
        alienClass = 'iUnits';
    }
    let resHere = showRes(bat.tileId);
    let degNum = getDamageBar(bat);
    let myKind = getEggKind(bat);
    let tagz = ' '+myKind;
    if (bat.tags.includes('shield')) {
        tagz = tagz+' (bouclier)';
    }
    if (bat.tags.includes('guide')) {
        tagz = tagz+' (guidage)';
    }
    if (bat.tags.includes('fluo')) {
        tagz = tagz+' (marqué)';
    }
    if (bat.tags.includes('poison')) {
        tagz = tagz+' (poison)';
    }
    if (bat.tags.includes('shinda')) {
        tagz = tagz+' (shinda)';
    }
    if (bat.tags.includes('stun')) {
        tagz = tagz+' (stun)';
    }
    if (bat.tags.includes('freeze')) {
        tagz = tagz+' (freeze)';
    }
    if (batType.skills.includes('invisible') || bat.tags.includes('invisible')) {
        $('#b'+bat.tileId).append('<div class="iUnits"></div><div class="aliInfos"></div><div class="degInfos"></div>'+resHere);
    } else {
        $('#b'+bat.tileId).append('<div class="aUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+bat.type+tagz+'"></div><div class="aliInfos"><img src="/static/img/avet2.png" width="15"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="7"></div>'+resHere);
    }
};

function showBataillon(bat) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
    let batPic = unitTypes[unitIndex].pic;
    let batCat = unitTypes[unitIndex].cat;
    let unitsLeft = bat.squadsLeft*unitTypes[unitIndex].squadSize;
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    let degNum = getDamageBar(bat);
    $('#b'+bat.tileId).append('<div class="pUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+bat.type+'"></div><div class="batInfos"><img src="/static/img/vet'+bat.vet+'.png" width="15"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="7"></div>'+resHere);
};

function getDamageBar(bat) {
    let batType = getBatType(bat);
    let degNum = 7;
    let hurt = isHurt(bat);
    if (hurt) {
        let degPerc = Math.round(100*bat.squadsLeft/batType.squads);
        if (bat.squadsLeft === 1) {
            degNum = 1;
        } else if (degPerc < 35) {
            degNum = 2;
        } else if (degPerc < 55) {
            degNum = 3;
        } else if (degPerc < 70) {
            degNum = 4;
        } else if (degPerc < 86 || bat.squadsLeft < batType.squads) {
            degNum = 5;
        } else if (degPerc < 100 || (degPerc == 100 && bat.damage > 1)) {
            degNum = 6;
        }
    }
    if (batType.skills.includes('invisible') || bat.tags.includes('invisible')) {
        degNum = 0;
    }
    return degNum;
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
