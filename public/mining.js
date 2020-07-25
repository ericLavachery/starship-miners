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
            let bestDumper = getBestDumper(bat);
            if (Object.keys(bestDumper).length >= 1) {
                Object.entries(allRes).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    res = getResByName(key);
                    if (batType.mining.types.includes(res.bld)) {
                        if (bat.extracted.includes(res.name)) {
                            let resMiningRate = getResMiningRate(bat,res,value);
                            // console.log(res.name+' : '+resMiningRate);
                            if (bestDumper.transRes[res.name] === undefined) {
                                bestDumper.transRes[res.name] = resMiningRate;
                            } else {
                                bestDumper.transRes[res.name] = bestDumper.transRes[res.name]+resMiningRate;
                            }
                        }
                    }
                });
                bestDumper = getBestDumper(bat);
                if (bestDumper.id != bat.id) {
                    let resSpace = checkResSpace(bestDumper);
                    let resLoad = checkResLoad(bat);
                    if (Math.round(resSpace*1.2) >= resLoad) {
                        Object.entries(bat.transRes).map(entry => {
                            let key = entry[0];
                            let value = entry[1];
                            if (bestDumper.transRes[key] === undefined) {
                                bestDumper.transRes[key] = value;
                            } else {
                                bestDumper.transRes[key] = bestDumper.transRes[key]+value;
                            }
                        });
                        bat.transRes = {};
                    }
                }
            }
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
    $('#unitInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br>');
    $('#conUnitList').append('<span class="constName or">RESSOURCES à extraire</span><br>');
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
    if (selectedBatType.mining.multi) {
        if (!selectedBat.extracted.includes(res.name)) {
            selectedBat.extracted.push(res.name);
        } else {
            let tagIndex = selectedBat.extracted.indexOf(res.name);
            selectedBat.extracted.splice(tagIndex,1);
        }
    } else {
        selectedBat.extracted = [res.name];
    }
    selectedBatArrayUpdate();
    chooseRes(true);
};

function getBestDumper(myBat) {
    let myBatType = getBatType(myBat);
    let batType;
    let distance;
    let bestDumper = {};
    let resSpace = checkResSpace(myBat);
    if (resSpace >= 1) {
        bestDumper = myBat;
    }
    let bestDQ = 0;
    let dq;
    bataillons.forEach(function(bat) {
        batType = getBatType(bat);
        if (batType.skills.includes('fret') && batType.skills.includes('dumper')) {
            distance = calcDistance(bat.tileId,myBat.tileId);
            if (distance <= 1) {
                resSpace = checkResSpace(bat);
                if (resSpace >= 1) {
                    dq = getDumperQuality(bat);
                    if (dq > bestDQ) {
                        bestDQ = dq;
                        bestDumper = bat;
                    }
                }
            }
        }
    });
    return bestDumper;
};

function getDumperQuality(bat) {
    let dq = 0;
    let batType = getBatType(bat);
    if (batType.skills.includes('transorbital')) {
        dq = 4;
    } else if (batType.moveCost < 90) {
        if (!batType.skills.includes('extraction')) {
            dq = 3;
        } else {
            dq = 2;
        }
    } else {
        dq = 1;
    }
    return dq;
};

function checkResSpace(bat) {
    let batType = getBatType(bat);
    let resLoaded = checkResLoad(bat);
    let resSpace = batType.transRes-resLoaded;
    return resSpace;
};

function checkResLoad(bat) {
    let batType = getBatType(bat);
    let resLoaded = 0;
    if (batType.transRes >= 1) {
        if (Object.keys(bat.transRes).length >= 1) {
            Object.entries(bat.transRes).map(entry => {
                let key = entry[0];
                let value = entry[1];
                resLoaded = resLoaded+value;
            });
        }
    }
    return resLoaded;
};

function loadRes() {
    // let myBatType = getBatType(myBat);
    $("#conUnitList").css("display","block");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br>');
    $('#conUnitList').append('<span class="constName or">RESSOURCES à charger</span><br>');
    let batType;
    let distance;
    let resLoad;
    bataillons.forEach(function(bat) {
        if (bat.id != selectedBat.id) {
            batType = getBatType(bat);
            if (batType.skills.includes('fret')) {
                distance = calcDistance(bat.tileId,selectedBat.tileId);
                if (distance <= 1) {
                    resLoad = checkResLoad(bat);
                    if (resLoad >= 1) {
                        $('#conUnitList').append('<span class="constName cy">'+bat.type+'</span><br>');
                        Object.entries(bat.transRes).map(entry => {
                            let key = entry[0];
                            let value = entry[1];
                            res = getResByName(key);
                            if (false) {
                                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                            } else {
                                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                            }
                            $('#conUnitList').append('<span class="constName klik" onclick="resSelectLoad('+res.id+','+bat.id+')">'+res.name+' : '+value+'</span><br>');
                        });
                    }
                }
            }
        }
    });
};
