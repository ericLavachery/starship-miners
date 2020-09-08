function extraction(apCost) {
    selectMode();
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
            let tile = getTile(bat);
            let batType = getBatType(bat);
            let rate = getMiningRate(bat,false);
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
                            let resMiningRate = getResMiningRate(bat,res,value,false);
                            // console.log(res.name+' : '+resMiningRate);
                            if (bestDumper.transRes[res.name] === undefined) {
                                bestDumper.transRes[res.name] = resMiningRate;
                            } else {
                                bestDumper.transRes[res.name] = bestDumper.transRes[res.name]+resMiningRate;
                            }
                            // diminution des gisements
                            if (!permaRes && res.cat != 'none') {
                                tile.rs[res.name] = tile.rs[res.name]-Math.ceil(resMiningRate/10);
                            }
                        }
                    }
                });
                autoUnload(bat);
            }
        }
    }
};

function getAllRes(bat) {
    let tile = getTile(bat);
    let terrain = getTerrain(bat);
    let srs = getTerrainRes(terrain,tile);
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

function getTerrainRes(terrain,tile) {
    let srs = {};
    // Bois
    if (terrain.name === 'F') {
        srs.Bois = 200;
    } else if (terrain.name === 'B' && tile.seed >= 4) {
        srs.Bois = 50;
    } else if (terrain.name === 'B') {
        srs.Bois = 10;
    }
    // Végétaux
    if (terrain.name === 'F') {
        srs.Végétaux = 50;
    } else if (terrain.name === 'B' && tile.seed >= 4) {
        srs.Végétaux = 85;
    } else if (terrain.veg >= 1) {
        srs.Végétaux = Math.round((terrain.veg+0.5)*(terrain.veg+0.5)*(terrain.veg+0.5))*8;
    }
    // Huile
    if (terrain.name === 'F' && tile.seed === 5) {
        srs.Huile = 10;
    } else if (terrain.name === 'B' && tile.seed === 6) {
        srs.Huile = 5;
    } else if (terrain.name === 'S' && tile.seed === 6) {
        srs.Huile = 30;
    } else if (terrain.name === 'S' && tile.seed >= 4) {
        srs.Huile = 5;
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

function getTerrainById(tileId) {
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
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

function getTileById(tileId) {
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    return tile;
};

function getMiningRate(bat,fullRate) {
    let batType = getBatType(bat);
    if (fullRate) {
        return Math.ceil(batType.mining.rate*bat.squadsLeft/batType.squads);
    } else {
        return Math.ceil(batType.mining.rate*bat.apLeft/bat.ap*bat.squadsLeft/batType.squads);
    }
};

function getResMiningRate(bat,ressource,value,fullRate) {
    let batType = getBatType(bat);
    let resHere = value;
    if (resHere < minResForRate) {
        resHere = minResForRate;
    }
    let batRate = getMiningRate(bat,fullRate);
    let multiExtractAdj = 1;
    if (bat.extracted.length >= 2) {
        multiExtractAdj = 1-((bat.extracted.length-1)/12);
    }
    if (multiExtractAdj < 0.4) {
        multiExtractAdj = 0.4;
    }
    let resRate = Math.ceil(resHere*batRate/mineRateDiv*multiExtractAdj);
    if (batType.mining.types.includes('Mine') && res.bld === 'Derrick') {
        resRate = Math.ceil(resRate/3);
    }
    if (value <= 0) {
        resRate = 0;
    }
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

function getBatById(batId) {
    let index = bataillons.findIndex((obj => obj.id == batId));
    let bat = bataillons[index];
    return bat;
};

function chooseRes(again) {
    selectMode();
    if (!again) {
        // console.log('CHOOSE RES');
        // console.log(selectedBat);
        // tagDelete(selectedBat,'mining');
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
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="constName or">RESSOURCES à extraire</span><br>');
    let rate = getMiningRate(selectedBat,true);
    let allRes = getAllRes(selectedBat);
    let totalExRes = 0;
    Object.entries(allRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        res = getResByName(key);
        if (selectedBatType.mining.types.includes(res.bld)) {
            let resMiningRate = getResMiningRate(selectedBat,res,value,true);
            if (selectedBat.extracted.includes(res.name)) {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                totalExRes = totalExRes+resMiningRate;
            } else {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
            }
            $('#conUnitList').append('<span class="constName klik" onclick="resSelect('+res.id+')">'+res.name+' : '+resMiningRate+'</span><br>');
        }
    });
    $('#conUnitList').append('<span class="constName">Total de ressources : <span class="cy">'+totalExRes+'</span></span><br>');
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
        if (!selectedBat.extracted.includes(res.name)) {
            if (selectedBat.extracted.length <= 1) {
                selectedBat.extracted.push(res.name);
            }
        } else {
            let tagIndex = selectedBat.extracted.indexOf(res.name);
            selectedBat.extracted.splice(tagIndex,1);
        }
    }
    selectedBatArrayUpdate();
    chooseRes(true);
};

function autoUnload(bat) {
    let bestDumper = getBestDumper(bat);
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
                    if (bat.id === myBat.id) {
                        dq = dq+0.5;
                    }
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
        dq = 9;
    } else if (batType.skills.includes('realdumper')) {
        if (batType.moveCost < 90) {
            if (!batType.skills.includes('extraction')) {
                dq = 8;
            } else {
                dq = 7;
            }
        } else {
            if (!batType.skills.includes('extraction')) {
                dq = 6;
            } else {
                dq = 5;
            }
        }
    } else {
        if (batType.moveCost < 90) {
            if (!batType.skills.includes('extraction')) {
                dq = 4;
            } else {
                dq = 3;
            }
        } else {
            if (!batType.skills.includes('extraction')) {
                dq = 2;
            } else {
                dq = 1;
            }
        }
    }
    return dq;
};

function checkResSpace(bat) {
    let batType = getBatType(bat);
    let resLoaded = checkResLoad(bat);
    let resMax = batType.transRes;
    if (bat.citoyens > 0) {
        resMax = bat.citoyens;
    }
    let resSpace = resMax-resLoaded;
    if (resSpace < 0) {
        resSpace = 0;
    }
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
    selectMode();
    let restSpace = checkResSpace(selectedBat);
    // restSpace = Math.round(restSpace*1.2);
    if (restSpace < 0) {restSpace = 0;}
    $("#conUnitList").css("display","block");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br>');
    $('#conUnitList').append('<span class="constName or">RESSOURCES à charger</span> <span class="cy">(max '+restSpace+')</span><br>');
    let batType;
    let distance;
    let resLoad;
    if (restSpace >= 1) {
        bataillons.forEach(function(bat) {
            if (bat.id != selectedBat.id) {
                batType = getBatType(bat);
                if (batType.skills.includes('fret')) {
                    distance = calcDistance(bat.tileId,selectedBat.tileId);
                    if (distance <= 1) {
                        resLoad = checkResLoad(bat);
                        if (resLoad >= 1) {
                            if (batType.skills.includes('transorbital')) {
                                $('#conUnitList').append('<span class="constName sky">'+bat.type+' ???</span><br>');
                            } else {
                                $('#conUnitList').append('<span class="constName cy">'+bat.type+'</span><br>');
                            }
                            Object.entries(bat.transRes).map(entry => {
                                let key = entry[0];
                                let value = entry[1];
                                res = getResByName(key);
                                if (Math.round(restSpace*1.2) >= value) {
                                    $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle"></i></span>');
                                } else {
                                    $('#conUnitList').append('<span class="constIcon"><i class="far fa-times-circle or"></i></span>');
                                }
                                if (value > 50 && Math.round(restSpace*1.2) >= 50) {
                                    $('#conUnitList').append('<span class="constName">'+res.name+' : <span class="klik" onclick="resSelectLoad('+value+','+value+','+res.id+','+bat.id+')" title="Charger le maximum de '+res.name+'">'+value+'</span> | <span class="klik" onclick="resSelectLoad('+value+',50,'+res.id+','+bat.id+')" title="Charger 50 '+res.name+'">50</span></span><br>');
                                } else {
                                    $('#conUnitList').append('<span class="constName">'+res.name+' : <span class="klik" onclick="resSelectLoad('+value+','+value+','+res.id+','+bat.id+')" title="Charger le maximum de '+res.name+'">'+value+'</span></span><br>');
                                }
                            });
                        }
                    }
                }
            }
        });
    } else {
        $('#conUnitList').append('<span class="constName">Plus de place!</span><br>');
    }
};

function isResToLoad(myBat) {
    let resToLoad = false;
    let restSpace = checkResSpace(myBat);
    if (restSpace >= 1) {
        bataillons.forEach(function(bat) {
            if (bat.id != selectedBat.id && resToLoad === false) {
                batType = getBatType(bat);
                if (batType.skills.includes('fret')) {
                    distance = calcDistance(bat.tileId,myBat.tileId);
                    if (distance <= 1) {
                        resLoad = checkResLoad(bat);
                        if (resLoad >= 1) {
                            resToLoad = true;
                        }
                    }
                }
            }
        });
    }
    return resToLoad;
};

function resSelectLoad(value,pickValue,resId,batId) {
    let res = getResById(resId);
    let bat = getBatById(batId);
    let restSpace = checkResSpace(selectedBat);
    if (restSpace < 0) {restSpace = 0;}
    if (Math.round(restSpace*1.2) >= value && pickValue === value) {
        if (selectedBat.transRes[res.name] === undefined) {
            selectedBat.transRes[res.name] = value;
        } else {
            selectedBat.transRes[res.name] = selectedBat.transRes[res.name]+value;
        }
        delete bat.transRes[res.name];
    } else {
        let maxTransfert = Math.round(restSpace*1.2);
        if (pickValue < maxTransfert) {
            maxTransfert = pickValue;
        }
        if (selectedBat.transRes[res.name] === undefined) {
            selectedBat.transRes[res.name] = maxTransfert;
        } else {
            selectedBat.transRes[res.name] = selectedBat.transRes[res.name]+maxTransfert;
        }
        bat.transRes[res.name] = bat.transRes[res.name]-maxTransfert;
    }
    putTagAction(bat);
    putTagAction(selectedBat);
    selectedBatArrayUpdate();
    loadRes();
};

function addAlienRes(bat) {
    let batType = getBatType(bat);
    if (Object.keys(batType.killRes).length >= 1) {
        for (var prop in batType.killRes) {
            if (Object.prototype.hasOwnProperty.call(batType.killRes,prop)) {
                // console.log(prop);
                // console.log(batType.killRes[prop]);
                if (playerInfos.alienRes[prop] >=1) {
                    playerInfos.alienRes[prop] = playerInfos.alienRes[prop]+batType.killRes[prop];
                } else {
                    playerInfos.alienRes[prop] = batType.killRes[prop];
                }
            }
        }
    }
};

function voirRessources() {
    showResOpen = true;
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    // $('#conUnitList').append('<span class="constName or" id="gentils">RESSOURCES</span>');
    $('#conUnitList').append('<button type="button" title="Effacer tous les indicateurs" class="boutonGris miniButtons" onclick="showedTilesReset()"><i class="fas fa-eraser"></i></button><span class="butSpace"></span>');
    let visMap = [];
    if (showAllRes) {
        $('#conUnitList').append('<button type="button" title="Tous les points de la carte sont listés" class="boutonVert miniButtons"><i class="fas fa-map"></i></button><span class="butSpace"></span>');
        $('#conUnitList').append('<button type="button" title="Lister uniquement les points visibles à l\'écran" class="boutonGris miniButtons" onclick="toggleResView()"><i class="far fa-eye"></i></button><span class="butSpace"></span>');
        visMap = zone;
    } else {
        $('#conUnitList').append('<button type="button" title="Lister tous les points de la carte" class="boutonGris miniButtons" onclick="toggleResView()"><i class="fas fa-map"></i></button><span class="butSpace"></span>');
        $('#conUnitList').append('<button type="button" title="Seulement les points visibles à l\'écran sont listés" class="boutonVert miniButtons"><i class="far fa-eye"></i></button><span class="butSpace"></span>');
        let minX = xOffset+1;
        let maxX = xOffset+numVTiles;
        let minY = yOffset+1;
        let maxY = yOffset+numHTiles;
        visMap = _.filter(zone,function(tile) {
            return (tile.x >= minX && tile.x <= maxX && tile.y >= minY && tile.y <= maxY);
        });
    }
    $('#conUnitList').append('<button type="button" title="Seulement les points marqués" class="boutonGris miniButtons" onclick="toggleMarkedView()"><i class="fas fa-map-pin"></i></button>');
    $('#conUnitList').append('<span class="butSpace"></span><span class="smSpace"></span>');
    $('#conUnitList').append('<select class="boutonGris" id="resFind" onchange="showFoundRes()"></select>');
    $('#resFind').append('<option value="">'+showOneRes+'</option>');
    $('#resFind').append('<option value="Toutes">Toutes</option>');
    let filteredResTypes = _.filter(resTypes,function(res) {
        return (res.cat != 'alien' && res.cat != 'none');
    });
    let sortedResTypes = _.sortBy(filteredResTypes,'name');
    sortedResTypes.forEach(function(res) {
        if (allZoneRes.includes(res.name)) {
            $('#resFind').append('<option value="'+res.name+'">&check; '+res.name+'</option>');
        } else {
            $('#resFind').append('<option value="'+res.name+'">&cross; '+res.name+'</option>');
        }
    });
    let tileRes;
    let blockType;
    let filteredZone = _.filter(visMap,function(tile) {
        return (tile.rq != undefined);
    });
    oneResTileIds = [];
    filteredZone.forEach(function(tile) {
        tileRes = JSON.stringify(tile.rs);
        if (((showOneRes === 'Toutes' || tileRes.includes(showOneRes)) && !showMarkedOnly) || ((showOneRes === 'Toutes' || tileRes.includes(showOneRes)) && playerInfos.showedTiles.includes(tile.id) && showMarkedOnly)) {
            if (playerInfos.showedTiles.includes(tile.id)) {
                blockType = 'resBlockCheck';
            } else {
                blockType = 'resBlock';
            }
            $('#conUnitList').append('<div class="'+blockType+'" id="rf'+tile.id+'"></div>');
            $('#rf'+tile.id).append('<i class="fas fa-atom inficon rq'+tile.rq+'"></i><span class="listRes gff klik" onclick="markMap('+tile.id+')">&nbsp;'+tile.y+'&lrhar;'+tile.x+'</span>');
            if (tile.ruins) {
                if (tile.sh <= -1) {
                    $('#rf'+tile.id).append('<i class="fas fa-city inficon rq'+tile.rq+'"></i> &nbsp');
                    $('#rf'+tile.id).append('<i class="fas fa-check-circle inficon rq'+tile.rq+'"></i> &nbsp');
                } else {
                    $('#rf'+tile.id).append('<i class="fas fa-city inficon cy"></i> &nbsp');
                }
            }
            tileRes = tileRes.replace(/"/g,"");
            tileRes = tileRes.replace(/{/g,"");
            tileRes = tileRes.replace(/}/g,"");
            tileRes = tileRes.replace(/,/g," &nbsp;&middot;&nbsp; ");
            tileRes = tileRes.replace(/:/g," ");
            $('#rf'+tile.id).append('<span class="listRes">'+tileRes+'</span><br>');
            if (tileRes.includes(showOneRes)) {
                oneResTileIds.push(tile.id);
            }
        }
    });
};

function addZoneRes(tileRes) {
    Object.entries(tileRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (!allZoneRes.includes(key)) {
            allZoneRes.push(key);
        }
    });
};

function showFoundRes() {
    let value = document.getElementById("resFind").value;
    showOneRes = value;
    voirRessources();
    if (showMini) {
        oneResView();
    }
    console.log(showOneRes);
};

function showedTilesReset() {
    playerInfos.showedTiles = [1830];
    if (showResOpen) {
        voirRessources();
    }
    showMap(zone,true);
    confirmMode();
    if (showMini) {
        minimap();
    }
};

function toggleResView() {
    if (showAllRes) {
        showAllRes = false;
    } else {
        showAllRes = true;
    }
    voirRessources();
    if (showMini) {
        minimap();
    }
};

function toggleMarkedView() {
    if (showMarkedOnly) {
        showMarkedOnly = false;
    } else {
        showMarkedOnly = true;
    }
    voirRessources();
    if (showMini) {
        dotsView();
    }
};

function markMap(tileId) {
    if (showAllRes) {
        myTileX = zone[tileId].x;
        myTileY = zone[tileId].y;
        xOffset = myTileX-Math.round(numVTiles/2);
        yOffset = myTileY-Math.round(numHTiles/2);
        if (!playerInfos.showedTiles.includes(tileId)) {
            playerInfos.showedTiles.push(tileId)
        }
        limitOffset();
        showMap(zone,true);
        confirmMode();
    } else {
        if (!playerInfos.showedTiles.includes(tileId)) {
            playerInfos.showedTiles.push(tileId)
        }
        showMap(zone,true);
    }
    selectedTile = tileId;
    if (showMini) {
        minimap();
    }
    voirRessources();
};

function toggleShowedTile(tileId) {
    if (selectedBat.tileId != tileId) {
        if (playerInfos.showedTiles.includes(tileId)) {
            let index = playerInfos.showedTiles.indexOf(tileId);
            playerInfos.showedTiles.splice(index,1);
        } else {
            if (selectedTile === tileId) {
                playerInfos.showedTiles.push(tileId);
            }
        }
        let alienHere = isAlienHere(tileId);
        if (!alienHere) {
            redrawTile(tileId,true);
        }
        if (showResOpen) {
            voirRessources();
        }
        selectedTile = tileId;
        if (showMini) {
            minimap();
        }
    }
};

function isAlienHere(tileId) {
    let alienHere = false;
    aliens.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            batType = getBatType(bat);
            if (!batType.skills.includes('invisible') && !bat.tags.includes('invisible')) {
                alienHere = true;
            }
        }
    });
    return alienHere;
};
