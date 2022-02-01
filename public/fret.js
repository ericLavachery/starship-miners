function loadRes(retour) {
    selectMode();
    let restSpace = checkResSpace(selectedBat);
    let selectedBatPic = getBatPic(selectedBat,selectedBatType);
    let myConvey = true;
    if (selectedBatType.crew === 0 && !selectedBatType.skills.includes('autotrans')) {
        myConvey = false;
    }
    if (restSpace < 0) {restSpace = 0;}
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName cy"><img src="/static/img/units/'+selectedBatType.cat+'/'+selectedBatPic+'.png">&nbsp;');
    $('#conUnitList').append('<h1>'+selectedBat.type.toUpperCase()+'</h1><br>');
    $('#conUnitList').append('<span class="constName cy">Charger</span> <span class="cy">(max '+restSpace+')</span><br>');
    if (!playerInfos.onShip || selectedBatType.name === 'Soute' || selectedBatType.name === 'Stocks') {
        if (seeAllFret) {
            $('#conUnitList').append('<span class="constIcon vert"><i class="fas fa-eye-slash"></i></span>');
            $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="seeAllTrans(false)" title="Ne voir que les bataillons contenant des ressources">Ne voir que le fret</span></span><br>');
        } else {
            $('#conUnitList').append('<span class="constIcon vert"><i class="fas fa-eye"></i></span>');
            $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="seeAllTrans(true)" title="Voir tous les bataillons">Voir tout</span></span><br>');
        }
        if (!playerInfos.onShip) {
            if (seeLandersFret) {
                $('#conUnitList').append('<span class="constIcon vert"><i class="fas fa-space-shuttle"></i></span>');
                $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="seeLandersTrans(false)" title="Cacher les vaisseaux">Cacher les vaisseaux</span></span><br>');
            } else {
                $('#conUnitList').append('<span class="constIcon vert"><i class="fas fa-space-shuttle"></i></span>');
                $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="seeLandersTrans(true)" title="Voir les vaisseaux">Voir les vaisseaux</span></span><br>');
            }
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
                $('#conUnitList').append('<span class="constName vert"><span class="klik" onclick="stopAutoLoad()" title="Stopper tous les chargement automatiques">Stopper les automations</span></span><br>');
            }
        }
        let selectedBatTile = getTile(selectedBat);
        let batType;
        let distance;
        let resLoad;
        let resOK;
        if (restSpace <= 0) {
            $('#conUnitList').append('<span class="constName">Plus de place!</span><br>');
        }
        let sortedBats = bataillons.slice();
        sortedBats = _.sortBy(_.sortBy(_.sortBy(sortedBats,'type'),'creaTurn'),'id');
        sortedBats.reverse();
        sortedBats.forEach(function(bat) {
            if (bat.id != selectedBat.id && bat.loc === 'zone') {
                batType = getBatType(bat);
                if (batType.skills.includes('fret')) {
                    distance = calcDistance(bat.tileId,selectedBat.tileId);
                    let teleOK = false;
                    if (distance > 1) {
                        teleOK = checkResTeleport(selectedBat,bat);
                    }
                    if (distance <= 1 || selectedBatType.name === 'Soute' || teleOK) {
                        let seeMe = true;
                        if (batType.skills.includes('transorbital') && !seeLandersFret && !playerInfos.onShip) {
                            seeMe = false;
                        }
                        resLoad = checkResLoad(bat);
                        let targetConvey = true;
                        if (batType.crew === 0 && !batType.skills.includes('autotrans')) {
                            targetConvey = false;
                        }
                        if ((resLoad >= 1 || seeAllFret) && seeMe) {
                            let batPic = getBatPic(bat,batType);
                            $('#conUnitList').append('<hr>');
                            $('#conUnitList').append('<span class="unitPic"><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="48"></span><br>');
                            let tile = getTile(bat);
                            let theTile = tileNaming(tile,false,selectedBatTile.id);
                            if (batType.skills.includes('transorbital')) {
                                $('#conUnitList').append('<span class="constName sky">'+bat.type+' ???<span class="gf"> &mdash; '+theTile+'</span></span><br>');
                            } else {
                                $('#conUnitList').append('<span class="constName cy">'+bat.type+' <span class="gf"> &mdash; '+theTile+'</span></span><br>');
                            }
                            if (myConvey || targetConvey) {
                                if (restSpace >= resLoad) {
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
                                        let isRetro = false;
                                        if (bat.autoLoad != undefined) {
                                            if (bat.autoLoad.includes(selectedBat.id)) {
                                                isRetro = true;
                                            }
                                        }
                                        if (isRetro) {
                                            if (isAuto) {
                                                $('#conUnitList').append('<span class="loadIcon jaune klik" onclick="stopThisAutoLoad('+bat.id+')" title="Stopper cette automation! (Supprime une boucle!)"><i class="fas fa-robot"></i></span>');
                                            } else {
                                                $('#conUnitList').append('<span class="loadIcon rouge klik" onclick="resMaxLoad('+bat.id+',true)" title="Automatiser: Charger tout ce qu\'il y a dans ce bataillon ('+bat.type+') à chaque tour (ATTENTION: Boucle!!!)"><i class="fas fa-robot"></i></span><span class="loadIcon gf" title="L\'automation décharge vers ce bataillon"><i class="fas fa-sign-out-alt"></i></span>');
                                            }
                                        } else {
                                            if (isAuto) {
                                                $('#conUnitList').append('<span class="loadIcon bleu klik" onclick="stopThisAutoLoad('+bat.id+')" title="Stopper cette automation!"><i class="fas fa-robot"></i></span><span class="loadIcon gf" title="L\'automation charge depuis ce bataillon"><i class="fas fa-sign-in-alt fa-flip-horizontal"></i></span>');
                                            } else {
                                                $('#conUnitList').append('<span class="loadIcon vert klik" onclick="resMaxLoad('+bat.id+',true)" title="Automatiser: Charger tout ce qu\'il y a dans ce bataillon ('+bat.type+') à chaque tour"><i class="fas fa-robot"></i></span>');
                                            }
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
                                        if (resOK) {
                                            if (restSpace >= value) {
                                                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle"></i></span>');
                                            } else {
                                                $('#conUnitList').append('<span class="constIcon"><i class="far fa-times-circle or"></i></span>');
                                            }
                                            if (value > 100 && restSpace >= 100) {
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
            }
        });
        let teleCostOK = checkCost(teleStationCost);
        if (selectedBatType.skills.includes('teleport')) {
            $('#conUnitList').append('<hr>');
            $('#conUnitList').append('<span class="unitPic"><img src="/static/img/units/buildings/station.png" width="48"></span><br>');
            $('#conUnitList').append('<span class="constName cy">Station <span class="gf"> &mdash; (Téléportation)</span></span><br>');
            if (playerInfos.comp.tele >= 2 && teleCostOK) {
                Object.entries(playerInfos.vmRes).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (value >= 1 && key != undefined) {
                        res = getResByName(key);
                        if (restSpace >= value) {
                            $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle"></i></span>');
                        } else {
                            $('#conUnitList').append('<span class="constIcon"><i class="far fa-times-circle or"></i></span>');
                        }
                        if (value > 100 && restSpace >= 100) {
                            $('#conUnitList').append('<span class="constName">'+res.name+' : <span class="klik" onclick="teleportStationRes('+value+','+value+','+res.id+')" title="Charger le maximum de '+res.name+'">'+value+'</span> | <span class="klik" onclick="teleportStationRes('+value+',100,'+res.id+')" title="Charger 100 '+res.name+'">100</span></span><br>');
                        } else {
                            $('#conUnitList').append('<span class="constName">'+res.name+' : <span class="klik" onclick="teleportStationRes('+value+','+value+','+res.id+')" title="Charger le maximum de '+res.name+'">'+value+'</span></span><br>');
                        }
                    }
                });
            } else {
                if (playerInfos.comp.tele < 2) {
                    $('#conUnitList').append('<span class="constName jaune">Compétences insuffisantes</span><br>');
                } else if (!teleCostOK) {
                    $('#conUnitList').append('<span class="constName jaune">Ressources insuffisantes</span><br>');
                }
            }
        }
    }
    $('#conUnitList').append('<hr>');
    $('#conUnitList').append('<br>');
    if (!retour) {
        $("#conUnitList").animate({scrollTop:0},"fast");
    }
};

function checkResTeleport(inBat,outBat) {
    // console.log('CHECK TELEPORT');
    let teleOK = false;
    if (playerInfos.comp.tele >= 1) {
        let inBatType = getBatType(inBat);
        let outBatType = getBatType(outBat);
        if ((inBatType.skills.includes('teleport') || inBat.eq === 'e-respod' || inBat.eq === 'respod') && (outBatType.skills.includes('teleport') || outBat.eq === 'e-respod' || outBat.eq === 'respod')) {
            teleOK = true;
        }
    }
    // console.log(teleOK);
    return teleOK;
};

function seeAllTrans(seeAll) {
    seeAllFret = seeAll;
    loadRes(false);
};

function seeLandersTrans(see) {
    seeLandersFret = see;
    loadRes(false);
};

function payFretAP(teleport) {
    if (playerInfos.comp.trans < 3) {
        if (!selectedBat.tags.includes('chrg')) {
            selectedBat.tags.push('chrg');
            selectedBat.apLeft = selectedBat.apLeft-3+playerInfos.comp.trans;
            if (teleport) {
                selectedBat.apLeft = selectedBat.apLeft-5;
                payCost(teleStationCost);
            }
        }
    }
};

function resAllLoad(batId) {
    let bat = getBatById(batId);
    Object.entries(bat.transRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        let resOK = true;
        if (value >= 1 && resOK) {
            if (selectedBat.transRes[key] === undefined) {
                selectedBat.transRes[key] = value;
            } else {
                selectedBat.transRes[key] = selectedBat.transRes[key]+value;
            }
        }
        delete bat.transRes[key];
    });
    doneAction(bat);
    doneAction(selectedBat);
    payFretAP(false);
    selectedBatArrayUpdate();
    loadRes(false);
};

function resMaxLoad(batId,addAutoLoad) {
    let bat = getBatById(batId);
    let resSpace = checkResSpace(selectedBat);
    let resLoad = checkResLoad(bat);
    Object.entries(bat.transRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        let resOK = true;
        resSpace = checkResSpace(selectedBat);
        if (value >= 1 && resOK && resSpace >= 1) {
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
    doneAction(bat);
    doneAction(selectedBat);
    payFretAP(false);
    selectedBatArrayUpdate();
    loadRes(false);
};

function autoResLoad(toBat,fromBat) {
    let toBatType = getBatType(toBat);
    if (Object.keys(fromBat).length >= 1) {
        let resSpace = checkResSpace(toBat);
        let resLoad = checkResLoad(fromBat);
        Object.entries(fromBat.transRes).map(entry => {
            let key = entry[0];
            let value = entry[1];
            if (value >= 1) {
                resSpace = checkResSpace(toBat);
                if (resSpace >= 1) {
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
                }
            }
        });
    }
};

function stopThisAutoLoad(batId) {
    if (selectedBat.autoLoad.includes(batId)) {
        let index = selectedBat.autoLoad.indexOf(batId);
        selectedBat.autoLoad.splice(index,1);
        selectedBatArrayUpdate();
    }
    loadRes(false);
};

function stopAutoLoad() {
    selectedBat.autoLoad = [];
    selectedBatArrayUpdate();
    loadRes(false);
};

function setDumper(activation) {
    if (activation) {
        selectedBat.noDump = false;
    } else {
        selectedBat.noDump = true;
    }
    selectedBatArrayUpdate();
    loadRes(false);
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

function teleportStationRes(value,pickValue,resId) {
    let res = getResById(resId);
    let restSpace = checkResSpace(selectedBat);
    if (restSpace < 0) {restSpace = 0;}
    if (restSpace >= value && pickValue === value) {
        if (selectedBat.transRes[res.name] === undefined) {
            selectedBat.transRes[res.name] = value;
        } else {
            selectedBat.transRes[res.name] = selectedBat.transRes[res.name]+value;
        }
        playerInfos.vmRes[res.name] = 0;
        if (playerInfos.teleRes[res.name] === undefined) {
            playerInfos.teleRes[res.name] = value;
        } else {
            playerInfos.teleRes[res.name] = playerInfos.teleRes[res.name]+value;
        }
    } else {
        let maxTransfert = restSpace;
        if (pickValue < maxTransfert) {
            maxTransfert = pickValue;
        }
        if (selectedBat.transRes[res.name] === undefined) {
            selectedBat.transRes[res.name] = maxTransfert;
        } else {
            selectedBat.transRes[res.name] = selectedBat.transRes[res.name]+maxTransfert;
        }
        playerInfos.vmRes[res.name] = playerInfos.vmRes[res.name]-maxTransfert;
        if (playerInfos.teleRes[res.name] === undefined) {
            playerInfos.teleRes[res.name] = maxTransfert;
        } else {
            playerInfos.teleRes[res.name] = playerInfos.teleRes[res.name]+maxTransfert;
        }
    }
    doneAction(selectedBat);
    payFretAP(true);
    selectedBatArrayUpdate();
    loadRes(false);
};

function resSelectLoad(value,pickValue,resId,batId) {
    let res = getResById(resId);
    let bat = getBatById(batId);
    let restSpace = checkResSpace(selectedBat);
    if (restSpace < 0) {restSpace = 0;}
    if (restSpace >= value && pickValue === value) {
        if (selectedBat.transRes[res.name] === undefined) {
            selectedBat.transRes[res.name] = value;
        } else {
            selectedBat.transRes[res.name] = selectedBat.transRes[res.name]+value;
        }
        delete bat.transRes[res.name];
    } else {
        let maxTransfert = restSpace;
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
    doneAction(bat);
    doneAction(selectedBat);
    payFretAP(false);
    selectedBatArrayUpdate();
    loadRes(false);
};

function autoUnload(bat) {
    let bestDumper = getBestDumper(bat);
    console.log('best dumper');
    console.log(bestDumper);
    if (Object.keys(bestDumper).length >= 1) {
        if (bestDumper.id != bat.id) {
            let resSpace = checkResSpace(bestDumper);
            let resLoad = checkResLoad(bat);
            if (resSpace >= resLoad) {
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

function fretThrow() {
    selectedBat.transRes = {};
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};
