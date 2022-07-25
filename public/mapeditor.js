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
    let mbClass = 'mapedBut';
    if (mped.ster === undefined && mped.sinf === '') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/sntiles/V_005.png" title="Changer l\'image sans changer le terrain" onclick="selectTerrain()">');
    terrainTypes.forEach(function(terrain) {
        if (terrain.name != 'V' && terrain.name != 'X') {
            mbClass = 'mapedBut';
            if (mped.ster === terrain.name && mped.sinf === '') {mbClass = 'mapedButSel';}
            let tPic = terrain.name+'_001';
            $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/sntiles/'+tPic+'.png" title="'+terrain.fullName+'" onclick="selectTerrain(`'+terrain.name+'`)">');
        }
    });
    mbClass = 'mapedBut';
    if (mped.ster === 'Z' && mped.sinf === '') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/sntiles/R_004.png" title="Gué" onclick="selectTerrain(`Z`)">');
    $('#conUnitList').append('<br>');
    armorTypes.forEach(function(infra) {
        if (infra.cat === 'infra') {
            mbClass = 'mapedBut';
            if (mped.sinf === infra.name) {mbClass = 'mapedButSel';}
            $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/'+infra.pic+'.png" title="'+infra.name+'" onclick="selectInfra(`'+infra.name+'`)">');
        }
    });
    mbClass = 'mapedBut';
    if (mped.sinf === 'Ruines') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/ruins.png" title="Ruines" onclick="selectInfra(`Ruines`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'Ruines vides') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/ruinsf.png" title="Ruines vides" onclick="selectInfra(`Ruines vides`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'Route') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/roads.png" title="Route (ou Pont)" onclick="selectInfra(`Route`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'Res') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/res.png" title="Ajouter des ressources" onclick="selectInfra(`Res`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'RareRes') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/rareres.png" title="Ajouter des ressources rares" onclick="selectInfra(`RareRes`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'NoRes') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/nores.png" title="Supprimer les ressources" onclick="selectInfra(`NoRes`)">');
    $('#conUnitList').append('<br><br>');
    if (mped.sinf === 'RareRes' || mped.sinf === 'Res') {
        mapResAddList();
    } else {
        theTileRes = {};
    }
};

function mapResAddList() {
    let sortedResTypes = _.sortBy(resTypes,'name');
    sortedResTypes.forEach(function(res) {
        if (res.cat === 'white' || (res.cat.includes('sky') && mped.sinf === 'RareRes')) {
            let resIcon = getResIcon(res);
            let dispoRes = theTileRes[res.name];
            if (dispoRes === undefined) {
                dispoRes = 0;
            }
            if (dispoRes < 0) {
                dispoRes = 0;
            }
            $('#conUnitList').append('<span class="paramResName klik" onclick="mapResAdd(`'+res.name+'`)">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="cy">'+dispoRes+'</span></span>');
        }
    });
    console.log(theTileRes);
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
                addScrapToRuins(tile);
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
                addScrapToRuins(tile);
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
        } else if (mped.sinf === 'Res') {
            addResToTile(tile);
            atomColour(tile,true);
            // tile.rq = 3;
        } else if (mped.sinf === 'RareRes') {
            addResToTile(tile);
            atomColour(tile,true);
            // tile.rq = 5;
        } else if (mped.sinf === 'NoRes') {
            delete tile.rq;
            delete tile.rs;
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
    mapEditWindow();
    showMap(zone,true);
    cursorSwitch('.','grid-item','copy');
};

function mapResAdd(resName) {
    let letsAdd = rand.rand(35,65);
    if (theTileRes[resName] === undefined) {
        theTileRes[resName] = letsAdd;
    } else {
        theTileRes[resName] = theTileRes[resName]+letsAdd;
    }
    // mapResAddList();
    mapEditWindow();
};

function selectTerrain(terName) {
    mped.ster = terName;
    mped.sinf = '';
    cursorSwitch('.','grid-item','copy');
    mapEditWindow();
};

function selectInfra(infraName) {
    mped.sinf = infraName;
    delete mped.ster;
    cursorSwitch('.','grid-item','copy');
    mapEditWindow();
};

function addScrapToRuins(tile) {
    if (tile.rq === undefined) {
        tile.rq = 0;
        let sq = rand.rand(250,500);
        tile.rs = {};
        tile.rs['Scrap'] = sq;
    }
};

function addResToTile(tile) {
    if (tile.rs === undefined) {
        tile.rs = theTileRes;
    } else if (tile.rq === 0) {
        tile.rs = theTileRes;
        tile.rs['Scrap'] = rand.rand(250,500);
    }
    mped.sinf = '';
    theTileRes = {};
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
