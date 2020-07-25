function extraction(apCost) {
    // console.log('EXTRACTION');
    if (!selectedBat.tags.includes('mining')) {
        selectedBat.tags.push('mining');
    }
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    camoOut();
    tagDelete(selectedBat,'guet');
    tagDelete(selectedBat,'fortif');
    tagDelete(selectedBat,'vise');
    tagDelete(selectedBat,'luckyshot');
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function mining(bat) {
    if (bat.tags.includes('mining')) {
        if (bat.apLeft >= 1) {
            console.log('MINING');
            let batType = getBatType(bat);
            let rate = getMiningRate(bat);
            console.log('rate'+rate);
            let allRes = getAllRes(bat);
            Object.entries(allRes).map(entry => {
                let key = entry[0];
                let value = entry[1];
                res = getResByName(key);
                if (batType.mining.types.includes(res.bld)) {
                    let resMiningRate = getResMiningRate(bat,res,value);
                    if (bat.extracted.includes(res.name)) {
                        console.log(res.name+' : '+resMiningRate);
                    }
                }
            });
        }
    }
};

function getAllRes(bat) {
    let tile = getTile(bat);
    let terrain = getTerrain(bat);
    let srs = getTerrainRes(terrain);
    let allRes = {};
    if (tile.rq === undefined) {
        allRes = srs;
    } else {
        let rs = tile.rs;
        allRes = {...rs,...srs};
    }
    // console.log(allRes);
    return allRes;
};

function getTerrainRes(terrain) {
    let srs = {};
    // Bois
    if (terrain.name === 'F') {
        srs.Bois = 500;
    } else if (terrain.name === 'B') {
        srs.Bois = 25;
    }
    // Végétaux
    if (terrain.name === 'F') {
        srs.Végétaux = 150;
    } else if (terrain.veg >= 1) {
        srs.Végétaux = Math.round((terrain.veg+0.5)*(terrain.veg+0.5)*(terrain.veg+0.5))*25;
    }
    // Eau
    if (terrain.name === 'R') {
        srs.Eau = 1000;
    } else if (terrain.name === 'W') {
        srs.Eau = 750;
    } else if (terrain.name === 'S') {
        srs.Eau = 150;
    }
    // Air
    srs.Air = 500;
    return srs;
};

function getTerrain(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    return terrain;
};

function getTileTerrain(tileId) {
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    return terrain;
};

function getTile(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    return tile;
};

function getMiningRate(bat) {
    let batType = getBatType(bat);
    return Math.round(batType.mining.rate*bat.apLeft/batType.ap*bat.squadsLeft/batType.squads);
};

function getResMiningRate(bat,ressource,value) {
    let batRate = getMiningRate(bat);
    let resRate = Math.ceil(value*batRate/mineRateDiv);
    return resRate;
};

function getResByName(resName) {
    let resIndex = resTypes.findIndex((obj => obj.name == resName));
    let res = resTypes[resIndex];
    return res;
};
function getResById(resId) {
    let resIndex = resTypes.findIndex((obj => obj.id == resId));
    let res = resTypes[resIndex];
    return res;
};

function chooseRes(again) {
    if (!again) {
        // console.log('CHOOSE RES');
        // console.log(selectedBat);
        tagDelete(selectedBat,'mining');
        // reset bat.extracted
        if (selectedBat.extracted === undefined) {
            selectedBat.extracted = [];
        }
        selectedBatArrayUpdate();
    }
    // show res list
    $("#conUnitList").css("display","block");
    $("#conUnitList").css("display","block");
    $('#unitInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br>');
    $('#conUnitList').append('<span class="constName or">RESSOURCES</span><br>');
    let rate = getMiningRate(selectedBat);
    let allRes = getAllRes(selectedBat);
    Object.entries(allRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        res = getResByName(key);
        if (selectedBatType.mining.types.includes(res.bld)) {
            let resMiningRate = getResMiningRate(selectedBat,res,value);
            if (selectedBat.extracted.includes(res.name)) {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
            } else {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
            }
            $('#conUnitList').append('<span class="constName klik" onclick="resSelect('+res.id+')">'+res.name+' : '+resMiningRate+'</span><br>');
        }
    });
};

function resSelect(resId) {
    // console.log(selectedBat);
    let res = getResById(resId);
    if (!selectedBat.extracted.includes(res.name)) {
        selectedBat.extracted.push(res.name);
    } else {
        let tagIndex = selectedBat.extracted.indexOf(res.name);
        selectedBat.extracted.splice(tagIndex,1);
    }
    selectedBatArrayUpdate();
    chooseRes(true);
};
