function mapEditWindow() {
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<h1>MAP EDITOR</h1><br>');
    if (mped.as) {
        $('#conUnitList').append('<span class="constName"><span class="cy klik" onclick="seedAuto()">Auto Seed</span> &nbsp;|&nbsp; <span class="gf klik" onclick="seedManu()">Manual Seed</span></span><br>');
    } else {
        $('#conUnitList').append('<span class="constName"><span class="gf klik" onclick="seedAuto()">Auto Seed</span> &nbsp;|&nbsp; <span class="cy klik" onclick="seedManu()">Manual Seed</span></span><br>');
    }
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<img src="/static/img/sntiles/V_005.png" title="Changer l\'image sans changer le terrain" onclick="selectTerrain()">');
    terrainTypes.forEach(function(terrain) {
        if (terrain.name != 'V' && terrain.name != 'X') {
            let tPic = terrain.name+'_001';
            $('#conUnitList').append('<img src="/static/img/sntiles/'+tPic+'.png" title="'+terrain.fullName+'" onclick="selectTerrain(`'+terrain.name+'`)">');
        }
    });
    $('#conUnitList').append('<img src="/static/img/sntiles/R_004.png" title="Gué" onclick="selectTerrain(`Z`)">');
    $('#conUnitList').append('<br>');
    armorTypes.forEach(function(infra) {
        if (infra.cat === 'infra') {
            $('#conUnitList').append('<img src="/static/img/units/'+infra.pic+'.png" title="'+infra.name+'" onclick="selectInfra(`'+infra.name+'`)">');
        }
    });
    $('#conUnitList').append('<img src="/static/img/units/ruins.png" title="Ruines" onclick="selectInfra(`Ruines`)">');
    $('#conUnitList').append('<img src="/static/img/units/ruinsf.png" title="Ruines vides" onclick="selectInfra(`Ruines vides`)">');
    $('#conUnitList').append('<img src="/static/img/units/roads.png" title="Route (ou Pont)" onclick="selectInfra(`Route`)">');
    $('#conUnitList').append('<br><br>');
    // $("#conUnitList").animate({scrollTop:0},"fast");
};

function selectTerrain(terName) {
    mped.ster = terName;
    mped.sinf = '';
    mapEditWindow();
};

function selectInfra(infraName) {
    mped.sinf = infraName;
    mapEditWindow();
};

function clickEdit(tileId) {
    let tile = zone[tileId];
    if (mped.sinf != '') {
        if (mped.sinf === 'Ruines vides') {
            if (!tile.ruins) {
                tile.ruins = true;
                tile.sh = -1;
                tile.rd = true;
                delete tile.infra;
            } else {
                delete tile.ruins;
                delete tile.sh;
                delete tile.rd;
            }
        } else if (mped.sinf === 'Ruines') {
            if (!tile.ruins) {
                tile.ruins = true;
                tile.sh = 20;
                tile.rd = true;
                delete tile.infra;
            } else {
                delete tile.ruins;
                delete tile.sh;
                delete tile.rd;
            }
        } else if (mped.sinf === 'Route') {
            if (!tile.rd) {
                tile.rd = true;
            } else {
                delete tile.rd;
            }
        } else {
            if (tile.infra != mped.sinf) {
                tile.infra = mped.sinf;
                delete tile.ruins;
                delete tile.sh;
            } else {
                delete tile.infra;
            }
        }
    } else {
        if (mped.ster != undefined) {
            if (mped.ster === 'R') {
                tile.terrain = mped.ster;
                if (tile.seed > 3) {
                    tile.seed = tile.seed-3;
                }
            } else if (mped.ster === 'Z') {
                tile.terrain = 'R';
                if (tile.seed < 4) {
                    tile.seed = tile.seed+3;
                }
            } else {
                tile.terrain = mped.ster;
            }
        }
        if (!mped.as) {
            let nextSeed = getNextSeed(tile);
            tile.seed = nextSeed;
        }
    }
    showMap(zone,true);
};

function getNextSeed(tile) {
    let nextSeed = tile.seed+1;
    let numSeeds = 6;
    if (tile.terrain === 'M' || tile.terrain === 'H') {
        numSeeds = 12;
    }
    if (tile.terrain === 'R') {
        if (tile.seed < 4) {
            numSeeds = 3;
            if (nextSeed > numSeeds) {
                nextSeed = 1;
            }
        } else {
            numSeeds = 6;
            if (nextSeed > numSeeds) {
                nextSeed = 4;
            }
        }
    } else {
        if (nextSeed > numSeeds) {
            nextSeed = 1;
        }
    }
    return nextSeed;
};

function seedAuto() {
    mped.as = true;
    mapEditWindow();
};

function seedManu() {
    mped.as = false;
    mapEditWindow();
};
