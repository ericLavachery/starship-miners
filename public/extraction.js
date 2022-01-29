function extraction(apCost) {
    selectMode();
    // console.log('EXTRACTION');
    if (!selectedBat.tags.includes('mining')) {
        selectedBat.tags.push('mining');
    }
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    // camoOut();
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
            // xp
            if (playerInfos.comp.ext >= 3) {
                bat.xp = bat.xp+0.4;
            } else {
                bat.xp = bat.xp+0.2;
            }
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
                    if (batType.mining.types.includes(res.bld) || batType.mining.subTypes.includes(res.bld)) {
                        if (bat.extracted.includes(res.name)) {
                            let resMiningRate = getResMiningRate(bat,res,value,false,false);
                            let adjustedRMR = resMiningRate;
                            if (playerInfos.comp.tri >= 1 && res.name === 'Scrap') {
                                adjustedRMR = Math.round(resMiningRate/100*(101+(((playerInfos.comp.tri*playerInfos.comp.tri)+3)*2)));
                            } else if (playerInfos.comp.ext >= 1) {
                                adjustedRMR = Math.round(resMiningRate/100*(101+(((playerInfos.comp.ext*playerInfos.comp.ext)+3)*2)));
                            }
                            // console.log(res.name+' : '+resMiningRate);
                            if (bestDumper.transRes[res.name] === undefined) {
                                bestDumper.transRes[res.name] = adjustedRMR;
                            } else {
                                bestDumper.transRes[res.name] = bestDumper.transRes[res.name]+adjustedRMR;
                            }
                            if (minedThisTurn[res.name] === undefined) {
                                minedThisTurn[res.name] = adjustedRMR;
                            } else {
                                minedThisTurn[res.name] = minedThisTurn[res.name]+adjustedRMR;
                            }
                            // diminution des gisements
                            if (!permaRes && res.cat != 'zero') {
                                tile.rs[res.name] = tile.rs[res.name]-Math.ceil(resMiningRate/resPersistance);
                            }
                        }
                    }
                });
                autoUnload(bat);
            } else {
                warning('Extraction stoppée',bat.type+': Plus de place pour stocker',false,bat.tileId);
            }
        }
    } else {
        if (bat.extracted != undefined) {
            if (bat.extracted.length >= 1 && !bat.tags.includes('guet') && !bat.tags.includes('fortif') && bat.apLeft >= 2 && bat.loc === 'zone') {
                let batType = getBatType(bat);
                if (batType.kind === 'zero-extraction') {
                    warning('Extraction stoppée',bat.type+': Se tourne les pouces',false,bat.tileId);
                }
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

function getVegFactor() {
    let vf = {};
    vf.wood = 100;
    let seedWood = zone[19].seed;
    if (seedWood >= 7) {
        seedWood = seedWood-6;
    }
    vf.wood = vf.wood*(seedWood+8)/10;
    vf.wood = vf.wood*(zone[0].ensol+200)/350;
    if (zone[0].pf >= 35) {
        vf.wood = vf.wood*zone[0].pf/35;
    }
    vf.veg = 100;
    let seedVeg = zone[23].seed;
    if (seedVeg >= 7) {
        seedVeg = seedVeg-6;
    }
    vf.veg = vf.veg*(seedVeg+8)/10;
    vf.veg = vf.veg*(zone[0].ensol+100)/250;
    if (zone[0].pb+zone[0].pf >= 50) {
        vf.veg = vf.veg*(zone[0].pb+zone[0].pf)/50;
    }
    return vf;
};

function getTerrainRes(terrain,tile) {
    let srs = {};
    let potable = checkPotable(zone,tile.id);
    let vf = getVegFactor();
    // Bois
    let res = getResByName('Bois');
    if (terrain.name === 'F') {
        srs.Bois = 250+(tile.seed*65);
    } else if (terrain.name === 'B') {
        srs.Bois = 25+(tile.seed*25);
    }
    if (srs.Bois != undefined) {
        srs.Bois = srs.Bois*vf.wood/100;
        srs.Bois = Math.round(srs.Bois*res.planets[zone[0].planet]);
        if (srs.Bois <= 0) {
            delete srs.Bois;
        }
    }
    // Végétaux
    res = getResByName('Végétaux');
    if (terrain.name === 'F') {
        srs.Végétaux = 25+((7-tile.seed)*25);
    } else if (terrain.name === 'B') {
        srs.Végétaux = 250+((7-tile.seed)*65);
    } else if (terrain.veg >= 0.5) {
        srs.Végétaux = (((terrain.veg+0.5)*(terrain.veg+0.5)*(terrain.veg+0.5))*15)-15+(tile.seed*5);
        if (terrain.name === 'S') {
            if (tile.seed === 1) {
                srs.Végétaux = srs.Végétaux+77;
            } else if (tile.seed === 4) {
                srs.Végétaux = srs.Végétaux+45;
            }
        }
    }
    if (srs.Végétaux != undefined) {
        srs.Végétaux = srs.Végétaux*vf.veg/100;
        srs.Végétaux = Math.round(srs.Végétaux*res.planets[zone[0].planet]);
        if (srs.Végétaux <= 0) {
            delete srs.Végétaux;
        }
    }
    // Eau
    res = getResByName('Eau');
    if (terrain.name === 'R' && tile.seed >= 4) {
        srs.Eau = 290+((7-tile.seed)*45);
    } else if (terrain.name === 'R') {
        srs.Eau = 650+((7-tile.seed)*50);
    } else if (terrain.name === 'W' || terrain.name === 'L') {
        if (playerInfos.comp.ca >= 2 || !modeSonde) {
            if (potable) {
                srs.Eau = 400+(tile.seed*35);
            }
        }  else {
            srs.Eau = 400+(tile.seed*35);
        }
        if (srs.Eau != undefined) {
            if (terrain.name === 'L') {
                srs.Eau = srs.Eau+75+(tile.seed*25);
            }
        }
    } else if (terrain.name === 'S') {
        if (playerInfos.comp.ca >= 2 || !modeSonde) {
            if (potable) {
                srs.Eau = 100+(tile.seed*35);
            }
        }  else {
            srs.Eau = 100+(tile.seed*35);
        }
    } else if (playerInfos.comp.ext >= 1 && terrain.veg >= 1) {
        if (playerInfos.comp.ca >= 2 || !modeSonde) {
            if (potable) {
                srs.Eau = Math.round((playerInfos.comp.ext*10)+(tile.seed*5));
            }
        }  else {
            srs.Eau = Math.round((playerInfos.comp.ext*10)+(tile.seed*5));
        }
    }
    if (srs.Eau != undefined) {
        srs.Eau = Math.round(srs.Eau*res.planets[zone[0].planet]);
        if (srs.Eau <= 0) {
            delete srs.Eau;
        }
    }
    return srs;
};

function checkPotable(myZone,tileId) {
    let myTerrain = 'P';
    if (tileId >= 0) {
        let tile = getTileById(tileId);
        myTerrain = tile.terrain;
    }
    let potable = true;
    if (myZone[7].seed <= 3) {
        if (myZone[0].gKind === 'spider' || myZone[0].pKind === 'spider' || myZone[0].sKind === 'spider') {
            if (!playerInfos.bldVM.includes('Recyclab') && !playerInfos.bldList.includes('Recyclab')) {
                if (myTerrain != 'R') {
                    potable = false;
                }
            }
        }
    }
    if (myZone[0].planet === 'Gehenna') {
        potable = false;
    }
    return potable;
}

function getMiningRate(bat,fullRate,noMining) {
    let batType = getBatType(bat);
    let miningAdj = 1;
    if (!noMining) {
        if (batType.weapon2.name === 'Foreuse' || batType.weapon2.name === 'Pioche') {
            if (bat.ammo2 === 'lame') {
                miningAdj = 1;
            } else if (bat.ammo2 === 'lame-tungsten') {
                miningAdj = 1.2;
            } else if (bat.ammo2 === 'lame-carbone') {
                miningAdj = 1.3;
            } else if (bat.ammo2 === 'lame-plasma' || bat.ammo2 === 'lame-fplasma' || bat.ammo2 === 'lame-adamantium') {
                miningAdj = 1.5;
            }
        } else if (batType.weapon.name === 'Foreuse' || batType.weapon.name === 'Pioche') {
            if (bat.ammo === 'lame') {
                miningAdj = 1;
            } else if (bat.ammo === 'lame-tungsten') {
                miningAdj = 1.2;
            } else if (bat.ammo === 'lame-carbone') {
                miningAdj = 1.3;
            } else if (bat.ammo === 'lame-plasma' || bat.ammo === 'lame-fplasma' || bat.ammo === 'lame-adamantium') {
                miningAdj = 1.6;
            }
        }
        if (bat.eq === 'tungextract') {
            miningAdj = 1.35;
        } else if (bat.eq === 'plasmaextract') {
            miningAdj = 1.7;
        } else if (bat.eq === 'monoextract') {
            miningAdj = 2.2;
        } else if (bat.eq === 'autoextract') {
            miningAdj = 1.7;
        } else if (bat.eq === 'hydroextract') {
            miningAdj = 1.6;
        }
    } else {
        if (bat.eq === 'autoextract') {
            miningAdj = 1.7;
        }
    }
    if (bat.tags.includes('camo')) {
        miningAdj = miningAdj/2;
    }
    if (bat.eq === 'g2tools' || bat.logeq === 'g2tools') {
        miningAdj = miningAdj*1.2;
    }
    let helpInside = 1;
    if (batType.name === 'Comptoir' || batType.name === 'Mine' || batType.name === 'Derrick') {
        if (bat.transIds.length >= 1) {
            bataillons.forEach(function(inBat) {
                if (inBat.loc === "trans" && inBat.locId === bat.id) {
                    if (inBat.type === 'Mineurs') {
                        if (inBat.apLeft >= 7 && inBat.squadsLeft >= 6) {
                            if (helpInside < 1.5) {
                                helpInside = 1.5;
                            }
                        }
                    }
                    if (inBat.type === 'Sapeurs') {
                        if (inBat.apLeft >= 7 && inBat.squadsLeft >= 6) {
                            if (helpInside < 1.2) {
                                helpInside = 1.2;
                            }
                        }
                    }
                }
            });
        }
    }
    miningAdj = miningAdj*helpInside;
    if (fullRate) {
        let batAP = getBatAP(bat,batType);
        return Math.ceil(batType.mining.rate*batAP/batType.ap*bat.squadsLeft/batType.squads*miningAdj);
    } else {
        return Math.ceil(batType.mining.rate*bat.apLeft/batType.ap*bat.squadsLeft/batType.squads*miningAdj);
    }
};

function getResMiningRate(bat,res,value,fullRate,forInfos) {
    let batType = getBatType(bat);
    let resHere = value;
    let extComp = 0;
    if (playerInfos.comp.ext >= 1) {
        extComp = playerInfos.comp.ext+1;
    }
    if (playerInfos.comp.ext === 3) {
        extComp = extComp+1;
    }
    if (playerInfos.comp.tri >= 1 && res.name === 'Scrap') {
        resHere = Math.round(resHere*(playerInfos.comp.tri+8)/8);
    }
    let minRes = minResForRate;
    if (res.name === 'Scrap') {
        minRes = Math.round(minRes*1.5);
    }
    if (playerInfos.comp.ext >= 1) {
        minRes = Math.round(minRes*(extComp+5)/5);
    }
    let maxRes = maxResForRate;
    if (res.name === 'Scrap' || res.name === 'Végétaux' || res.name === 'Bois' || res.name === 'Eau') {
        maxRes = Math.round(maxRes*1.25);
    }
    if (playerInfos.comp.ext >= 1) {
        maxRes = Math.round(maxRes*(extComp+15)/15);
    }
    if (resHere < minRes && res.cat != 'zero') {
        resHere = minRes;
    }
    if (resHere > maxRes) {
        resHere = Math.round((resHere-maxRes)/5)+maxRes;
    }
    let noMining = false;
    if (res.bld === 'Comptoir' || res.bld === 'Pompe') {
        noMining = true;
    }
    let batRate = getMiningRate(bat,fullRate,noMining);
    let multiExtractAdj = 1;
    if (!forInfos) {
        if (bat.extracted.length >= 2) {
            multiExtractAdj = 1-((bat.extracted.length-1)/12);
        }
        let maxAdjBonus = extComp/33;
        if (batType.mining.level >= 4) {
            if (multiExtractAdj < 0.75+maxAdjBonus) {
                multiExtractAdj = 0.75+maxAdjBonus;
            }
        } else {
            if (multiExtractAdj < 0.4+(maxAdjBonus*2)) {
                multiExtractAdj = 0.4+(maxAdjBonus*2);
            }
        }
    }
    let resRate = Math.ceil(resHere*batRate/mineRateDiv*multiExtractAdj);
    console.log(res.name);
    console.log('resRate='+resRate);
    // ADJ SUBTYPE & LEVELS
    if (!batType.mining.types.includes(res.bld)) {
        if (batType.mining.subTypes.includes(res.bld)) {
            if (bat.eq === 'g2tools' || bat.logeq === 'g2tools') {
                resRate = Math.ceil(resRate/1.5);
            } else {
                resRate = Math.ceil(resRate/2.5);
            }
        } else {
            resRate = 0;
        }
        if (batType.mining.level === 1 && (res.bld === 'Mine' || res.bld === 'Derrick')) {
            resRate = Math.ceil(resRate/1.5);
        }
    }
    if (batType.mining.types[0] != res.bld) {
        if (res.level > batType.mining.level) {
            resRate = 0;
        } else if (res.level >= 3) {
            resRate = Math.ceil(resRate/2);
        }
    }
    if (value <= 0) {
        resRate = 0;
    }
    console.log('resRate='+resRate);
    return resRate;
};

function getAllMiningRates(bat,batType) {
    let allMiningRates = {};
    let sortedRes = _.sortBy(_.sortBy(_.sortBy(_.sortBy(resTypes,'rarity'),'level'),'cat'),'bld');
    sortedRes.reverse();
    sortedRes.forEach(function(res) {
        if (res.bld != '') {
            let resRate = getResMiningRate(bat,res,250,true,true);
            if (resRate >= 1) {
                allMiningRates[res.name] = resRate;
            }
        }
    });
    return allMiningRates;
};

function chooseRes(again) {
    selectMode();
    if (!again) {
        if (selectedBat.extracted === undefined) {
            selectedBat.extracted = [];
        }
        selectedBatArrayUpdate();
    }
    // show res list
    $("#conUnitList").css("display","block");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or">RESSOURCES à extraire</span><br>');
    let rate = getMiningRate(selectedBat,true,false);
    let allRes = getAllRes(selectedBat);
    console.log('allRes');
    console.log(allRes);
    let totalExRes = 0;
    Object.entries(allRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        res = getResByName(key);
        let minedRes = getMinedRes(res.name);
        let resCol = '';
        if (playerInfos.resFlags.includes(res.name)) {
            resCol = ' jaune';
        }
        if (selectedBatType.mining.types.includes(res.bld) || selectedBatType.mining.subTypes.includes(res.bld)) {
            let resMiningRate = getResMiningRate(selectedBat,res,value,true,false);
            let adjustedRMR = resMiningRate;
            if (playerInfos.comp.tri >= 1 && res.name === 'Scrap') {
                adjustedRMR = Math.round(resMiningRate/100*(101+(((playerInfos.comp.tri*playerInfos.comp.tri)+3)*2)));
            } else if (playerInfos.comp.ext >= 1) {
                adjustedRMR = Math.round(resMiningRate/100*(101+(((playerInfos.comp.ext*playerInfos.comp.ext)+3)*2)));
            }
            if (selectedBat.extracted.includes(res.name)) {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                totalExRes = totalExRes+adjustedRMR;
            } else {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
            }
            $('#conUnitList').append('<span class="constName'+resCol+' klik" onclick="resSelect('+res.id+')">'+res.name+' : '+adjustedRMR+' <span class="gff">+('+minedRes+')</span></span><br>');
        }
    });
    $('#conUnitList').append('<span class="constName">Total de ressources : <span class="cy">'+totalExRes+'</span></span><br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
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

function voirRessources() {
    showResOpen = true;
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<button type="button" title="Effacer tous les marqueurs" class="boutonGris miniButtons" onclick="showedTilesReset(true)"><i class="fas fa-eraser"></i></button><span class="butSpace"></span>');
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
    $('#conUnitList').append('<button type="button" title="Seulement les repaires" class="boutonGris miniButtons" onclick="toggleMarkedView()"><i class="fas fa-map-pin"></i></button>');
    $('#conUnitList').append('<span class="butSpace"></span><span class="smSpace"></span>');
    $('#conUnitList').append('<select class="boutonGris" id="resFind" onchange="showFoundRes()"></select>');
    // $('#resFind').append('<option value="">'+showOneRes+'</option>');
    $('#resFind').empty().append('<option value="Toutes">Toutes</option>');
    let filteredResTypes = _.filter(resTypes,function(res) {
        return (res.cat != 'alien' && res.cat != 'zero' && res.cat != 'transfo');
    });
    let resIcon = '';
    let isflagged = '';
    let sortedResTypes = _.sortBy(filteredResTypes,'name');
    sortedResTypes.forEach(function(res) {
        resIcon = getResIcon(res);
        isflagged = '';
        if (playerInfos.resFlags.includes(res.name)) {
            isflagged = ' !!';
        }
        if (res.name === showOneRes) {
            if (allCheckedZoneRes.includes(res.name)) {
                if (allZoneRes.includes(res.name)) {
                    $('#resFind').append('<option value="'+res.name+'" selected>&cuvee; '+res.name+' '+resIcon+isflagged+'</option>');
                } else {
                    $('#resFind').append('<option value="'+res.name+'" selected disabled="disabled">&nbsp;&nbsp;&nbsp; '+res.name+isflagged+'</option>');
                }
            } else {
                if (allZoneRes.includes(res.name)) {
                    $('#resFind').append('<option value="'+res.name+'" selected>&check; '+res.name+' '+resIcon+isflagged+'</option>');
                } else {
                    $('#resFind').append('<option value="'+res.name+'" selected disabled="disabled">&nbsp;&nbsp;&nbsp; '+res.name+isflagged+'</option>');
                }
            }
        } else {
            if (allCheckedZoneRes.includes(res.name)) {
                if (allZoneRes.includes(res.name)) {
                    $('#resFind').append('<option value="'+res.name+'">&cuvee; '+res.name+' '+resIcon+isflagged+'</option>');
                } else {
                    $('#resFind').append('<option value="'+res.name+'" disabled="disabled">&nbsp;&nbsp;&nbsp; '+res.name+isflagged+'</option>');
                }
            } else {
                if (allZoneRes.includes(res.name)) {
                    $('#resFind').append('<option value="'+res.name+'">&check; '+res.name+' '+resIcon+isflagged+'</option>');
                } else {
                    $('#resFind').append('<option value="'+res.name+'" disabled="disabled">&nbsp;&nbsp;&nbsp; '+res.name+isflagged+'</option>');
                }
            }
        }
    });
    if (!modeSonde || playerInfos.comp.det >= 0) {
        let tileRes;
        let blockType;
        let filteredZone = _.filter(visMap,function(tile) {
            return (tile.rq != undefined || playerInfos.showedTiles.includes(tile.id));
        });
        oneResTileIds = [];
        filteredZone.forEach(function(tile) {
            if (tile.rq != undefined) {
                tileRes = showTileRes(tile.rs);
            } else {
                tileRes = '';
            }
            if (((showOneRes === 'Toutes' || tileRes.includes(showOneRes)) && !showMarkedOnly) || ((showOneRes === 'Toutes' || tileRes.includes(showOneRes)) && playerInfos.showedTiles.includes(tile.id) && showMarkedOnly)) {
                if (playerInfos.showedTiles.includes(tile.id)) {
                    blockType = 'resBlockCheck';
                } else {
                    blockType = 'resBlock';
                }
                $('#conUnitList').append('<div class="'+blockType+'" id="rf'+tile.id+'"></div>');
                if (tile.tileName != undefined) {
                    if (tile.tileName != '') {
                        $('#rf'+tile.id).append('<span class="listRes vert bd">'+tile.tileName+'</span><br>');
                    }
                }
                $('#rf'+tile.id).append('<i class="fas fa-atom inficon rq'+tile.rq+'"></i><span class="listRes gff klik" onclick="markMap('+tile.id+')">&nbsp;'+tile.y+'&lrhar;'+tile.x+'</span>');
                if (tile.ruins) {
                    if (tile.sh <= -1) {
                        $('#rf'+tile.id).append('<i class="fas fa-city inficon rq0"></i> &nbsp');
                        $('#rf'+tile.id).append('<i class="fas fa-check-circle inficon rq0"></i> &nbsp');
                    } else {
                        $('#rf'+tile.id).append('<i class="fas fa-city inficon cy"></i> &nbsp');
                    }
                }
                $('#rf'+tile.id).append('<span class="listRes">'+tileRes+'</span><br>');
                if (tileRes.includes(showOneRes)) {
                    oneResTileIds.push(tile.id);
                }
            }
        });
    }
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function showTileRes(theTileRes) {
    let tileRes = JSON.stringify(theTileRes);
    if (playerInfos.comp.det < 1 && modeSonde) {
        tileRes = '';
    } else {
        tileRes = tileRes.replace(/"/g,"");
        tileRes = tileRes.replace(/{/g,"");
        tileRes = tileRes.replace(/}/g,"");
        tileRes = tileRes.replace(/,/g," &nbsp;&middot;&nbsp; ");
        tileRes = tileRes.replace(/:/g," ");
        if (playerInfos.comp.det < 3 && modeSonde) {
            tileRes = tileRes.replace(/\d*/g,"");
        }
    }
    // DERRICK
    resTypes.forEach(function(res) {
        if (res.bld === 'Derrick') {
            tileRes = tileRes.replace(res.name,'<span class="gris">'+res.name+'</span>');
        }
    });
    // RES FLAGS
    playerInfos.resFlags.forEach(function(flag) {
        tileRes = tileRes.replace(flag,'<span class="jaune">'+flag+'</span>');
    });
    if (showOneRes != 'Toutes') {
        tileRes = tileRes.replace(showOneRes,'<span class="bcy">'+showOneRes+'</span>');
    }
    return tileRes;
};

function getResIcon(res) {
    let resIcon;
    if (res.cat.includes('sky')) {
        resIcon = '&starf;';
    } else if (res.rarity <= 20 || res.cat === 'blue') {
        resIcon = '&star;';
    } else if (res.rarity <= 30) {
        resIcon = '&dtri;';
    } else {
        resIcon = '';
    }
    return resIcon;
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

function addCheckedZoneRes(tileRes) {
    Object.entries(tileRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (!allCheckedZoneRes.includes(key)) {
            allCheckedZoneRes.push(key);
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

function showedTilesReset(keepCenter) {
    if (keepCenter) {
        playerInfos.showedTiles = [1830];
    } else {
        playerInfos.showedTiles = [];
    }
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
    console.log('MARK MAP '+tileId);
    let index;
    selectedTile = tileId;
    if (showAllRes) {
        myTileX = zone[tileId].x;
        myTileY = zone[tileId].y;
        xOffset = myTileX-Math.round(numVTiles/2);
        yOffset = myTileY-Math.round(numHTiles/2);
        if (!playerInfos.showedTiles.includes(tileId)) {
            playerInfos.showedTiles.push(tileId);
        } else {
            index = playerInfos.showedTiles.indexOf(tileId);
            if (index > -1) {
                playerInfos.showedTiles.splice(index,1);
            }
        }
        limitOffset();
        showMap(zone,true);
        confirmMode();
    } else {
        if (!playerInfos.showedTiles.includes(tileId)) {
            playerInfos.showedTiles.push(tileId)
        } else {
            index = playerInfos.showedTiles.indexOf(tileId);
            if (index > -1) {
                playerInfos.showedTiles.splice(index,1);
            }
        }
        showMap(zone,true);
    }
    if (showMini) {
        minimap();
    }
    voirRessources();
};

function addAlienRes(bat) {
    let batType = getBatType(bat);
    let killRes = 0;
    if (Object.keys(batType.killRes).length >= 1) {
        for (var prop in batType.killRes) {
            if (Object.prototype.hasOwnProperty.call(batType.killRes,prop)) {
                killRes = batType.killRes[prop];
                killRes = Math.ceil(killRes*(playerInfos.comp.ca+8)/10);
                killRes = Math.ceil(killRes*alienResFactor/10);
                if (playerInfos.alienRes[prop] >=1) {
                    playerInfos.alienRes[prop] = playerInfos.alienRes[prop]+killRes;
                } else {
                    playerInfos.alienRes[prop] = killRes;
                }
            }
        }
    }
};
