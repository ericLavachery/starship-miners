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
    if (!bat.tags.includes('mining') && bat.apLeft >= 7) {
        if (typeof bat.extracted != 'undefined') {
            if (bat.extracted.length >= 1) {
                bat.tags.push('mining');
                bat.apLeft = bat.apLeft-5;
            }
        }
    }
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
        srs.Bois = 250+(tile.seed*65);
    } else if (terrain.name === 'B') {
        srs.Bois = 25+(tile.seed*25);
    }
    // Végétaux
    if (terrain.name === 'F') {
        srs.Végétaux = 25+((7-tile.seed)*25);
    } else if (terrain.name === 'B') {
        srs.Végétaux = 250+((7-tile.seed)*65);
    } else if (terrain.veg >= 0.5) {
        srs.Végétaux = (Math.round((terrain.veg+0.5)*(terrain.veg+0.5)*(terrain.veg+0.5))*15)-15+(tile.seed*5);
    }
    // Eau
    if (terrain.name === 'R' && tile.seed >= 4) {
        srs.Eau = 290+((7-tile.seed)*45);
    } else if (terrain.name === 'R') {
        srs.Eau = 550+((7-tile.seed)*75);
    } else if (terrain.name === 'W') {
        srs.Eau = 400+(tile.seed*75);
    } else if (terrain.name === 'S') {
        srs.Eau = 100+(tile.seed*35);
    } else if (playerInfos.comp.ext >= 1 && terrain.veg >= 1) {
        srs.Eau = Math.round((playerInfos.comp.ext*10)+(tile.seed*5));
    }
    return srs;
};

function getMiningRate(bat,fullRate) {
    let batType = getBatType(bat);
    let miningAdj = 1;
    if (batType.weapon2.name === 'Foreuse' || batType.weapon2.name === 'Pioche') {
        if (bat.ammo2 === 'lame') {
            miningAdj = 1;
        } else if (bat.ammo2 === 'lame-tungsten') {
            miningAdj = 1.2;
        } else if (bat.ammo2 === 'lame-plasma') {
            miningAdj = 1.5;
        }
    } else if (batType.weapon.name === 'Foreuse' || batType.weapon.name === 'Pioche') {
        if (bat.ammo === 'lame') {
            miningAdj = 1;
        } else if (bat.ammo === 'lame-tungsten') {
            miningAdj = 1.2;
        } else if (bat.ammo === 'lame-plasma') {
            miningAdj = 1.5;
        }
    }
    if (bat.eq === 'tungextract') {
        miningAdj = 1.15;
    } else if (bat.eq === 'plasmaextract') {
        miningAdj = 1.4;
    } else if (bat.eq === 'monoextract') {
        miningAdj = 1.7;
    } else if (bat.eq === 'autoextract') {
        miningAdj = 1.5;
    } else if (bat.eq === 'hydroextract') {
        miningAdj = 1.5;
    }
    if (bat.tags.includes('camo')) {
        miningAdj = miningAdj/2;
    }
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
    if (playerInfos.comp.tri >= 1 && res.name === 'Scrap') {
        resHere = Math.round(resHere*(playerInfos.comp.tri+8)/8);
    }
    let minRes = minResForRate;
    if (res.name === 'Scrap') {
        minRes = Math.round(minRes*1.5);
    }
    if (playerInfos.comp.ext >= 1) {
        minRes = Math.round(minRes*(playerInfos.comp.ext+9)/9);
    }
    let maxRes = maxResForRate;
    if (res.name === 'Scrap' || res.name === 'Végétaux' || res.name === 'Bois' || res.name === 'Eau') {
        maxRes = Math.round(maxRes*1.25);
    }
    if (playerInfos.comp.ext >= 1) {
        maxRes = Math.round(maxRes*(playerInfos.comp.ext+9)/9);
    }
    if (resHere < minRes && res.cat != 'zero') {
        resHere = minRes;
    }
    if (resHere > maxRes) {
        resHere = maxRes;
    }
    let batRate = getMiningRate(bat,fullRate);
    let multiExtractAdj = 1;
    if (!forInfos) {
        if (bat.extracted.length >= 2) {
            multiExtractAdj = 1-((bat.extracted.length-1)/12);
        }
        let maxAdjBonus = playerInfos.comp.ext/20;
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
            resRate = Math.ceil(resRate/3);
        } else {
            resRate = 0;
        }
        if (batType.mining.level === 1 && (res.bld === 'Mine' || res.bld === 'Derrick')) {
            resRate = Math.ceil(resRate/2);
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
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="constName or">RESSOURCES à extraire</span><br>');
    let rate = getMiningRate(selectedBat,true);
    let allRes = getAllRes(selectedBat);
    console.log('allRes');
    console.log(allRes);
    let totalExRes = 0;
    Object.entries(allRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        res = getResByName(key);
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
            $('#conUnitList').append('<span class="constName klik" onclick="resSelect('+res.id+')">'+res.name+' : '+adjustedRMR+'</span><br>');
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
    console.log('best dumper');
    console.log(bestDumper);
    if (Object.keys(bestDumper).length >= 1) {
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
        if (batType.skills.includes('fret') && batType.skills.includes('dumper') && !bat.noDump) {
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
        dq = 10;
    } else if (batType.skills.includes('reserve')) {
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
    if (bat.eq === 'megafret') {
        resMax = Math.round(resMax*1.2);
    }
    if (bat.citoyens > 0) {
        resMax = bat.citoyens;
    }
    let resSpace = resMax-resLoaded;
    if (batType.skills.includes('transorbital') && playerInfos.mapTurn >= 2) {
        let transUnitsLeft = calcLanderTransUnitsLeft(bat,batType);
        if (transUnitsLeft < 0) {
            resSpace = resSpace+(transUnitsLeft*2);
        }
    }
    if (resSpace < 0) {
        resSpace = 0;
    }
    return resSpace;
};

function calcLanderTransUnitsLeft(myBat,myBatType) {
    let myBatTransUnitsLeft = myBatType.transUnits;
    if (myBatType.skills.includes('transorbital') && playerInfos.mapTurn >= 2) {
        myBatTransUnitsLeft = Math.round(myBatTransUnitsLeft*bonusTransRetour);
    }
    let batWeight;
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId == myBat.id) {
            batType = getBatType(bat);
            batWeight = calcVolume(bat,batType);
            myBatTransUnitsLeft = myBatTransUnitsLeft-batWeight;
        }
    });
    // console.log('myBatTransUnitsLeft'+myBatTransUnitsLeft);
    return myBatTransUnitsLeft;
};

function checkResLoad(myBat) {
    let myBatType = getBatType(myBat);
    let resLoaded = 0;
    if (myBatType.transRes >= 1) {
        if (Object.keys(myBat.transRes).length >= 1) {
            Object.entries(myBat.transRes).map(entry => {
                let key = entry[0];
                let value = entry[1];
                resLoaded = resLoaded+value;
            });
        }
    }
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId == myBat.id) {
            batType = getBatType(bat);
            if (batType.skills.includes('prefab')) {
                let prefabWeight = calcPrefabWeight(batType);
                // console.log(batType.name+' : '+prefabWeight);
                resLoaded = resLoaded+prefabWeight;
            }
        }
    });
    return resLoaded;
};

function loadRes() {
    selectMode();
    let restSpace = checkResSpace(selectedBat);
    let selectedBatPic = getBatPic(selectedBat,selectedBatType);
    // restSpace = Math.round(restSpace*1.2);
    if (restSpace < 0) {restSpace = 0;}
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br>');
    $('#conUnitList').append('<span class="constName cy"><img src="/static/img/units/'+selectedBatType.cat+'/'+selectedBatPic+'.png">&nbsp;');
    $('#conUnitList').append('<h1>'+selectedBat.type.toUpperCase()+'</h1><br>');
    $('#conUnitList').append('<span class="constName cy">Charger</span> <span class="cy">(max '+restSpace+')</span><br>');
    if (seeAllFret) {
        $('#conUnitList').append('<span class="constIcon vert"><i class="fas fa-eye-slash"></i></span>');
        $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="seeAllTrans(false)" title="Ne voir que les bataillons contenant des ressources">Ne voir que le fret</span></span><br>');
    } else {
        $('#conUnitList').append('<span class="constIcon vert"><i class="fas fa-eye"></i></span>');
        $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="seeAllTrans(true)" title="Voir tous les bataillons">Voir tout</span></span><br>');
    }
    if (selectedBatType.skills.includes('dumper')) {
        if (selectedBat.noDump) {
            $('#conUnitList').append('<span class="constIcon vert"><i class="fas fa-pallet"></i></span>');
            $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="setDumper(true)" title="Activer les déchargements automatiques vers ce bataillon">Utiliser comme Dumper</span></span><br>');
        } else {
            $('#conUnitList').append('<span class="constIcon vert"><i class="fas fa-times"></i></span>');
            $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="setDumper(false)" title="Stopper les déchargements automatiques vers ce bataillon">Ne plus utiliser comme Dumper</span></span><br>');
        }
    }
    if (selectedBat.autoLoad != undefined) {
        if (selectedBat.autoLoad.length >= 1) {
            $('#conUnitList').append('<span class="constIcon vert"><i class="fas fa-times"></i></span>');
            $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="stopAutoLoad()" title="Stopper les chargement automatiques">Stopper les automations</span></span><br>');
        }
    }
    let selectedBatTile = getTile(selectedBat);
    let batType;
    let distance;
    let resLoad;
    let resOK;
    if (restSpace >= 1) {
        let sortedBats = bataillons.slice();
        sortedBats = _.sortBy(_.sortBy(_.sortBy(sortedBats,'type'),'creaTurn'),'id');
        sortedBats.reverse();
        sortedBats.forEach(function(bat) {
            if (bat.id != selectedBat.id) {
                batType = getBatType(bat);
                if (batType.skills.includes('fret')) {
                    distance = calcDistance(bat.tileId,selectedBat.tileId);
                    if (distance <= 1) {
                        resLoad = checkResLoad(bat);
                        if (resLoad >= 1 || seeAllFret) {
                            let batPic = getBatPic(bat,batType);
                            $('#conUnitList').append('<br><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="48"><br></span>');
                            let tile = getTile(bat);
                            let theTile = tileNaming(tile,false,selectedBatTile.id);
                            if (batType.skills.includes('transorbital')) {
                                $('#conUnitList').append('<span class="constName sky">'+bat.type+' ???<span class="gf"> &mdash; '+theTile+'</span></span><br>');
                            } else {
                                $('#conUnitList').append('<span class="constName cy">'+bat.type+' <span class="gf"> &mdash; '+theTile+'</span></span><br>');
                            }
                            if (restSpace >= Math.round(resLoad*1.2)) {
                                $('#conUnitList').append('<span class="loadIcon rose klik" onclick="resAllLoad('+bat.id+')" title="Charger tout ce qu\'il y a dans ce bataillon ('+bat.type+')"><i class="fas fa-pallet"></i></span>');
                            } else {
                                $('#conUnitList').append('<span class="loadIcon rose klik" onclick="resMaxLoad('+bat.id+',false)" title="Charger un maximum de ressources depuis ce bataillon ('+bat.type+')"><i class="fas fa-dolly"></i></span>');
                            }
                            if (selectedBatType.skills.includes('fret')) {
                                if (batType.skills.includes('fret')) {
                                    let isAuto = false;
                                    if (selectedBat.autoLoad != undefined) {
                                        if (selectedBat.autoLoad.includes(bat.id)) {
                                            isAuto = true;
                                        }
                                    }
                                    if (isAuto) {
                                        $('#conUnitList').append('<span class="loadIcon bleu klik" onclick="stopThisAutoLoad('+bat.id+')" title="Stopper cette automation!"><i class="fas fa-robot"></i></span>');
                                    } else {
                                        $('#conUnitList').append('<span class="loadIcon vert klik" onclick="resMaxLoad('+bat.id+',true)" title="Automatiser : Charger tout ce qu\'il y a dans ce bataillon ('+bat.type+') à chaque tour"><i class="fas fa-robot"></i></span>');
                                    }
                                }
                            }
                            $('#conUnitList').append('<br>');
                            if (resLoad >= 1) {
                                Object.entries(bat.transRes).map(entry => {
                                    let key = entry[0];
                                    let value = entry[1];
                                    res = getResByName(key);
                                    resOK = true;
                                    if (key === 'Energie') {
                                        if (!selectedBatType.skills.includes('accu')) {
                                            resOK = false;
                                        }
                                    }
                                    if (resOK) {
                                        if (Math.round(restSpace*1.2) >= value) {
                                            $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle"></i></span>');
                                        } else {
                                            $('#conUnitList').append('<span class="constIcon"><i class="far fa-times-circle or"></i></span>');
                                        }
                                        if (value > 100 && Math.round(restSpace*1.2) >= 100) {
                                            $('#conUnitList').append('<span class="constName">'+res.name+' : <span class="klik" onclick="resSelectLoad('+value+','+value+','+res.id+','+bat.id+')" title="Charger le maximum de '+res.name+'">'+value+'</span> | <span class="klik" onclick="resSelectLoad('+value+',100,'+res.id+','+bat.id+')" title="Charger 100 '+res.name+'">100</span></span><br>');
                                        } else {
                                            $('#conUnitList').append('<span class="constName">'+res.name+' : <span class="klik" onclick="resSelectLoad('+value+','+value+','+res.id+','+bat.id+')" title="Charger le maximum de '+res.name+'">'+value+'</span></span><br>');
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
    } else {
        $('#conUnitList').append('<span class="constName">Plus de place!</span><br>');
    }
    $('#conUnitList').append('<br>');
};

function seeAllTrans(seeAll) {
    seeAllFret = seeAll;
    loadRes();
};

function resAllLoad(batId) {
    let bat = getBatById(batId);
    Object.entries(bat.transRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (value >= 1) {
            if (selectedBat.transRes[key] === undefined) {
                selectedBat.transRes[key] = value;
            } else {
                selectedBat.transRes[key] = selectedBat.transRes[key]+value;
            }
        }
        delete bat.transRes[key];
    });
    // putTagAction(bat);
    // putTagAction(selectedBat);
    selectedBatArrayUpdate();
    loadRes();
};

function resMaxLoad(batId,addAutoLoad) {
    let bat = getBatById(batId);
    let resSpace = checkResSpace(selectedBat);
    let resLoad = checkResLoad(bat);
    Object.entries(bat.transRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        resSpace = checkResSpace(selectedBat);
        if (value >= 1) {
            if (resSpace >= value) {
                if (selectedBat.transRes[key] === undefined) {
                    selectedBat.transRes[key] = value;
                } else {
                    selectedBat.transRes[key] = selectedBat.transRes[key]+value;
                }
                delete bat.transRes[key];
            } else {
                if (selectedBat.transRes[key] === undefined) {
                    if (resSpace >= 1) {
                        selectedBat.transRes[key] = resSpace;
                    }
                } else {
                    selectedBat.transRes[key] = selectedBat.transRes[key]+resSpace;
                }
                bat.transRes[key] = bat.transRes[key]-resSpace;
            }
        }
    });
    if (addAutoLoad) {
        if (selectedBat.autoLoad != undefined) {
            if (Array.isArray(selectedBat.autoLoad)) {
                // OK
            } else {
                selectedBat.autoLoad = [];
            }
        } else {
            selectedBat.autoLoad = [];
        }
        if (!selectedBat.autoLoad.includes(batId)) {
            selectedBat.autoLoad.push(batId);
        }
    }
    // putTagAction(bat);
    // putTagAction(selectedBat);
    selectedBatArrayUpdate();
    loadRes();
};

function autoResLoad(toBat,fromBat) {
    if (Object.keys(fromBat).length >= 1) {
        let resSpace = checkResSpace(toBat);
        let resLoad = checkResLoad(fromBat);
        Object.entries(fromBat.transRes).map(entry => {
            let key = entry[0];
            let value = entry[1];
            resSpace = checkResSpace(toBat);
            if (resSpace >= value) {
                if (toBat.transRes[key] === undefined) {
                    toBat.transRes[key] = value;
                } else {
                    toBat.transRes[key] = toBat.transRes[key]+value;
                }
                delete fromBat.transRes[key];
            } else {
                if (toBat.transRes[key] === undefined) {
                    toBat.transRes[key] = resSpace;
                } else {
                    toBat.transRes[key] = toBat.transRes[key]+resSpace;
                }
                fromBat.transRes[key] = fromBat.transRes[key]-resSpace;
            }
        });
    }
};

function stopThisAutoLoad(batId) {
    selectedBat.autoLoad = [];
    if (selectedBat.autoLoad.includes(batId)) {
        let index = selectedBat.autoLoad.indexOf(batId);
        selectedBat.autoLoad.splice(index,1);
        selectedBatArrayUpdate();
    }
    loadRes();
};

function stopAutoLoad() {
    selectedBat.autoLoad = [];
    selectedBatArrayUpdate();
    loadRes();
};

function setDumper(activation) {
    if (activation) {
        selectedBat.noDump = false;
    } else {
        selectedBat.noDump = true;
    }
    selectedBatArrayUpdate();
    loadRes();
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
    // putTagAction(bat);
    // putTagAction(selectedBat);
    selectedBatArrayUpdate();
    loadRes();
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

function voirRessources() {
    showResOpen = true;
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    // $('#conUnitList').append('<span class="constName or" id="gentils">RESSOURCES</span>');
    $('#conUnitList').append('<button type="button" title="Effacer tous les marqueurs" class="boutonGris miniButtons" onclick="showedTilesReset(true)"><i class="fas fa-eraser"></i></button><span class="butSpace"></span>');
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
    let sortedResTypes = _.sortBy(filteredResTypes,'name');
    sortedResTypes.forEach(function(res) {
        resIcon = getResIcon(res);
        if (res.name === showOneRes) {
            if (allCheckedZoneRes.includes(res.name)) {
                if (allZoneRes.includes(res.name)) {
                    $('#resFind').append('<option value="'+res.name+'" selected>&cuvee; '+res.name+' '+resIcon+'</option>');
                } else {
                    $('#resFind').append('<option value="'+res.name+'" selected disabled="disabled">&nbsp;&nbsp;&nbsp; '+res.name+'</option>');
                }
            } else {
                if (allZoneRes.includes(res.name)) {
                    $('#resFind').append('<option value="'+res.name+'" selected>&check; '+res.name+' '+resIcon+'</option>');
                } else {
                    $('#resFind').append('<option value="'+res.name+'" selected disabled="disabled">&nbsp;&nbsp;&nbsp; '+res.name+'</option>');
                }
            }
        } else {
            if (allCheckedZoneRes.includes(res.name)) {
                if (allZoneRes.includes(res.name)) {
                    $('#resFind').append('<option value="'+res.name+'">&cuvee; '+res.name+' '+resIcon+'</option>');
                } else {
                    $('#resFind').append('<option value="'+res.name+'" disabled="disabled">&nbsp;&nbsp;&nbsp; '+res.name+'</option>');
                }
            } else {
                if (allZoneRes.includes(res.name)) {
                    $('#resFind').append('<option value="'+res.name+'">&check; '+res.name+' '+resIcon+'</option>');
                } else {
                    $('#resFind').append('<option value="'+res.name+'" disabled="disabled">&nbsp;&nbsp;&nbsp; '+res.name+'</option>');
                }
            }
        }
    });
    if (!modeSonde || playerInfos.comp.det >= 1) {
        let tileRes;
        let blockType;
        let filteredZone = _.filter(visMap,function(tile) {
            return (tile.rq != undefined);
        });
        oneResTileIds = [];
        filteredZone.forEach(function(tile) {
            tileRes = showTileRes(tile.rs);
            if (((showOneRes === 'Toutes' || tileRes.includes(showOneRes)) && !showMarkedOnly) || ((showOneRes === 'Toutes' || tileRes.includes(showOneRes)) && playerInfos.showedTiles.includes(tile.id) && showMarkedOnly)) {
                if (playerInfos.showedTiles.includes(tile.id)) {
                    blockType = 'resBlockCheck';
                } else {
                    blockType = 'resBlock';
                }
                $('#conUnitList').append('<div class="'+blockType+'" id="rf'+tile.id+'"></div>');
                if (tile.tileName != undefined) {
                    if (tile.tileName != '') {
                        $('#rf'+tile.id).append('<span class="listRes jaune">'+tile.tileName+'</span><br>');
                    }
                }
                $('#rf'+tile.id).append('<i class="fas fa-atom inficon rq'+tile.rq+'"></i><span class="listRes gff klik" onclick="markMap('+tile.id+')">&nbsp;'+tile.y+'&lrhar;'+tile.x+'</span>');
                if (tile.ruins) {
                    if (tile.sh <= -1) {
                        $('#rf'+tile.id).append('<i class="fas fa-city inficon rq'+tile.rq+'"></i> &nbsp');
                        $('#rf'+tile.id).append('<i class="fas fa-check-circle inficon rq'+tile.rq+'"></i> &nbsp');
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
};

function showTileRes(theTileRes) {
    let tileRes = JSON.stringify(theTileRes);
    if (playerInfos.comp.det < 2 && modeSonde) {
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
    let index;
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
    selectedTile = tileId;
    if (showMini) {
        minimap();
    }
    voirRessources();
};
