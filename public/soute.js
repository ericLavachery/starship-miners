function goSoute() {
    inSoute = true;
    justReloaded = false;
    conOut(true);
    if (playerInfos.onShip) {
        playerInfos.mapTurn = 0;
        playRoom('soute',true,true);
        playFx('work',false);
    }
    $("#zone_map").css("display","none");
    $("#zone_soute").css("display","block");
    $("#zone_metro").css("display","none");
    $("#modesInfos").css("display","none");
    $("#glitches_effect").css("display","none");
    checkSelectedLanderId();
    checkReserve();
    souteMenu();
    landerMenu();
    if (souteTab === 'unitz') {
        souteList();
        landerList();
        if (Object.keys(selectedBat).length >= 1) {
            showBatInfos(selectedBat);
        }
    } else if (souteTab === 'rez') {
        missionRes();
        viewLanderRes();
        voirReserve();
    }
    viewPop();
    commandes();
    console.log('slId='+slId);
};

function goStation() {
    inSoute = false;
    if (playerInfos.onShip) {
        playRoom('station',true,true);
        playFx('work',true);
    }
    $("#zone_map").css("display","grid");
    $("#zone_soute").css("display","none");
    $("#zone_metro").css("display","none");
    $("#modesInfos").css("display","block");
    $("#glitches_effect").css("display","block");
    showMap(zone,true);
    let souteBat = getBatById(souteId);
    batSelect(souteBat);
    showBatInfos(selectedBat);
    commandes();
};

function souteBatSelect(keepBkp) {
    let souteBat = getBatById(souteId);
    batSelect(souteBat,false,keepBkp);
};

function getStationLandersIds() {
    let landersIds = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital') && batType.name != 'Soute') {
                landersIds.push(bat.id);
            }
        }
    });
    return landersIds;
};

function souteTabsMenu(here) {
    if (souteTab === 'unitz') {
        $('#'+here).append('<h2 class="bcy">Bataillons &nbsp</h2>');
        $('#'+here).append('<h2 class="neutre klik" onclick="setSouteTab(`rez`)">Ressources</h2>');
    } else if (souteTab === 'rez') {
        $('#'+here).append('<h2 class="neutre klik" onclick="setSouteTab(`unitz`)">Bataillons &nbsp</h2>');
        $('#'+here).append('<h2 class="bcy">Ressources</h2>');
    }
    $('#'+here).append('<br>');
};

function souteMenu() {
    $('#menu_soute').empty();
    souteTabsMenu('menu_soute');
    if (souteTab === 'unitz') {
        if (souteFilter === 'all') {
            $('#menu_soute').append('<span class="menuTab cy">Tous &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`all`)">Tous &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'infantry') {
            $('#menu_soute').append('<span class="menuTab cy">Infanteries &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`infantry`)">Infanteries &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'support') {
            $('#menu_soute').append('<span class="menuTab cy">Support &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`support`)">Support &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'cyberobots') {
            $('#menu_soute').append('<span class="menuTab cy">Spécial &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`cyberobots`)">Spécial &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'vehicles') {
            $('#menu_soute').append('<span class="menuTab cy">Véhicules &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`vehicles`)">Véhicules &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'prefabs') {
            $('#menu_soute').append('<span class="menuTab cy">Bâtiments &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`prefabs`)">Bâtiments &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'army') {
            $('#menu_soute').append('<span class="menuTab cy">Armées</span>');
            $('#menu_soute').append('<br>');
            if (armyFilter === -1) {
                $('#menu_soute').append('<span class="menuTab cy">Toutes</span> &nbsp');
            } else {
                $('#menu_soute').append('<span class="menuTab klik" onclick="setArmyFilter(-1)">Toutes</span> &nbsp');
            }
            let i = 0;
            while (i <= 20) {
                if (armyFilter === i) {
                    $('#menu_soute').append('<span class="menuTab cy">'+i+'</span> &nbsp');
                } else {
                    $('#menu_soute').append('<span class="menuTab klik" onclick="setArmyFilter('+i+')">'+i+'</span> &nbsp');
                }
                if (i > 20) {break;}
                i++
            }
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`army`)">Armées</span>');
        }
    }
};

function setSouteFilter(filter) {
    souteFilter = filter;
    goSoute();
};

function setArmyFilter(filter) {
    armyFilter = filter;
    souteFilter = 'army';
    goSoute();
};

function showArmy(armyNum) {
    armyFilter = armyNum;
    souteFilter = 'army';
    goSoute();
};

function setSouteTab(tab) {
    souteTab = tab;
    goSoute();
};

function landerMenu() {
    $('#menu_lander').empty();
    souteTabsMenu('menu_lander');
    $('#menu_lander').append('<span class="menuTab klik" onclick="batSouteSelect(1)">Soute <span class="brunf">(Voir détail)</span></span>');
    $('#menu_lander').append('<span class="menuTab gf"> &nbsp;&nbsp;</span>');
    let landersIds = getStationLandersIds();
    landersIds.forEach(function(landerId) {
        let landerBat = getBatById(landerId);
        let landerBatType = getBatType(landerBat);
        let transUnitLeft = calcTransUnitsLeft(landerBat,landerBatType);
        let transResLeft = checkResSpace(landerBat);
        let transResMax = landerBatType.transRes;
        if (hasEquip(landerBat,['megafret'])) {
            transResMax = Math.round(transResMax*1.33);
        }
        let ucol = 'cy';
        let rcol = 'brunf';
        if (souteTab === 'rez') {
            ucol = 'brunf';
            rcol = 'cy';
        }
        if (landerId === slId) {
            $('#menu_lander').append('<span class="menuTab cy klik" onclick="landerSelection('+landerId+')">'+landerBatType.name+' <span class="brunf">(<span class="'+ucol+'">'+transUnitLeft+'</span>&ndash;<span class="'+rcol+'">'+transResLeft+'</span>)</span></span>');
        } else {
            $('#menu_lander').append('<span class="menuTab klik" onclick="landerSelection('+landerId+')">'+landerBatType.name+' <span class="brunf">('+transUnitLeft+'&ndash;'+transResLeft+')</span></span>');
        }
        if (landerBat.chief != undefined) {
            if (landerBat.chief != '') {
                if (landerId === slId) {
                    $('#menu_lander').append('<span class="menuTab cyf">('+landerBat.chief+') &nbsp;&nbsp;</span>');
                } else {
                    $('#menu_lander').append('<span class="menuTab gf">('+landerBat.chief+') &nbsp;&nbsp;</span>');
                }
            } else {
                $('#menu_lander').append('<span class="menuTab gf"> &nbsp;&nbsp;</span>');
            }
        } else {
            $('#menu_lander').append('<span class="menuTab gf"> &nbsp;&nbsp;</span>');
        }
    });
};

function landerSelection(landerId) {
    slId = landerId;
    let landerBat = getBatById(slId);
    batSelect(landerBat);
    goSoute();
    showBatInfos(selectedBat);
};

function getSelectedLanderId() {
    let landerId = -1;
    let biggerLander = 0;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('transorbital') && batType.name != 'Soute') {
            let landerSize = batType.hp+(bat.transIds.length*100);
            if (landerSize > biggerLander) {
                landerId = bat.id;
                biggerLander = landerSize;
            }
        }
    });
    if (landerId >= 1) {
        slId = landerId;
    }
};

function checkSelectedLanderId() {
    let altId = -1;
    let idOK = false;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('transorbital') && batType.name != 'Soute') {
            if (slId === bat.id) {
                idOK = true;
            } else {
                altId = bat.id;
            }
        }
    });
    if (!idOK) {
        slId = altId;
    }
};

function souteList() {
    $('#list_soute').empty();
    let landersIds = getStationLandersIds();
    if (souteFilter === 'all' || souteFilter === 'infantry') {
        souteBatList('infantry',playerInfos.gang,'','robot',landersIds,-1); // mecano & medic & garde out
        souteBatList('infantry','','mutant','',landersIds,-1);
    }
    if (souteFilter === 'all' || souteFilter === 'support') {
        souteBatList('infantry',playerInfos.gang,'medic','robot',landersIds,-1);
        souteBatList('infantry',playerInfos.gang,'mecano','robot',landersIds,-1);
        souteBatList('infantry','zero-','','robot',landersIds,-1); // no resist no regu
        souteBatList('infantry',playerInfos.gang,'garde','robot',landersIds,-1);
    }
    if (souteFilter === 'all' || souteFilter === 'cyberobots') {
        souteBatList('infantry','reguliers','','',landersIds,-1); // regu
        souteBatList('infantry','resistance','','',landersIds,-1); // resist
        souteBatList('infantry','','clone','',landersIds,-1);
        souteBatList('infantry','','cyber','',landersIds,-1);
        souteBatList('vehicles','','cyber','',landersIds,-1);
        souteBatList('vehicles','','robot','',landersIds,-1);
        souteBatList('infantry','','dog','',landersIds,-1);
    }
    if (souteFilter === 'all' || souteFilter === 'vehicles') {
        souteBatList('vehicles',playerInfos.gang,'','robot',landersIds,-1);
        souteBatList('vehicles','zero-','','robot',landersIds,-1);
    }
    if (souteFilter === 'all' || souteFilter === 'prefabs') {
        souteBatList('buildings','','prefab','robot',landersIds,-1);
        souteBatList('devices','','prefab','robot',landersIds,-1);
    }
    if (souteFilter === 'army') {
        souteArmyList(landersIds,-1);
    }
};

function landerList() {
    $('#list_lander').empty();
    let landerBat = getBatById(slId);
    let landerBatType = getBatType(landerBat);
    $('#list_lander').append('<div class="souteLanderBlock"><img src="/static/img/units/'+landerBatType.cat+'/'+landerBatType.pic+'.png" width="48"></div>');
    if (!landerBat.tags.includes('deploy')) {
        if (playerInfos.missionZone === -1) {
            $('#list_lander').append('<br><span class="listRes or">&nbsp Vous ne pouvez pas déployer ce lander.<br>&nbsp Vous devez d\'abord choisir une zone de destination.<br><br></span>');
        } else {
            $('#list_lander').append('<br><span class="listRes or">&nbsp Ce vaisseau n\'est pas déployé.<br><br></span>');
        }
    }
    let landersIds = getStationLandersIds();
    souteBatList('infantry',playerInfos.gang,'','robot',landersIds,slId);
    souteBatList('infantry','','mutant','',landersIds,slId);
    souteBatList('infantry',playerInfos.gang,'medic','robot',landersIds,slId);
    souteBatList('infantry',playerInfos.gang,'mecano','robot',landersIds,slId);
    souteBatList('infantry','zero-','','robot',landersIds,slId); // no resist
    souteBatList('infantry',playerInfos.gang,'garde','robot',landersIds,slId);
    souteBatList('infantry','reguliers','','',landersIds,slId); // regu
    souteBatList('infantry','resistance','','',landersIds,slId); // resist
    souteBatList('infantry','','clone','',landersIds,slId);
    souteBatList('infantry','','dog','',landersIds,slId);
    souteBatList('infantry','','cyber','',landersIds,slId);
    souteBatList('vehicles','','cyber','',landersIds,slId);
    souteBatList('vehicles','','robot','',landersIds,slId);
    souteBatList('vehicles',playerInfos.gang,'','robot',landersIds,slId);
    souteBatList('vehicles','zero-','','robot',landersIds,slId);
    souteBatList('devices','','prefab','robot',landersIds,slId);
    souteBatList('buildings','','prefab','robot',landersIds,slId);
};

function souteBatList(cat,partKind,skill,noSkill,landersIds,idOfLander) {
    let showMe = true;
    let colId = 'list_soute';
    if (idOfLander >= 0) {
        colId = 'list_lander';
    }
    let sortedBats = bataillons.slice();
    sortedBats = _.sortBy(_.sortBy(_.sortBy(sortedBats,'id'),'army'),'type');
    sortedBats.forEach(function(bat) {
        let batType = getBatType(bat);
        showMe = false;
        if (idOfLander >= 0) {
            if (bat.loc === 'trans' && bat.locId === idOfLander) {
                showMe = true;
            }
        } else {
            if (bat.loc === 'zone' || !landersIds.includes(bat.locId)) {
                showMe = true;
            }
        }
        if (batType.skills.includes(noSkill) || (noSkill === 'robot' && (batType.skills.includes('cyber') || batType.skills.includes('mutant') || batType.skills.includes('dog') || batType.skills.includes('clone')))) {
            showMe = false;
        }
        if (batType.skills.includes('transorbital')) {
            showMe = false;
        }
        if (batType.id === 126 || batType.id === 225) {
            showMe = false;
        }
        if (!batType.kind.includes(partKind)) {
            showMe = false;
        }
        if (cat === 'infantry' && partKind === 'zero-' && (batType.kind.includes('resistance') || batType.kind.includes('reguliers'))) {
            showMe = false;
        }
        if (cat === 'infantry' && partKind === playerInfos.gang && skill === '') {
            if (batType.skills.includes('medic') || batType.skills.includes('mecano') || batType.skills.includes('garde')) {
                showMe = false;
            }
        }
        if (showMe) {
            if (batType.cat.includes(cat)) {
                if (skill === '' || batType.skills.includes(skill)) {
                    if (bat.loc === 'zone' && idOfLander < 0) {
                        loadBat(bat.id,souteId);
                    }
                    batListElement(bat,batType,idOfLander);
                }
            }
        }
    });
};

function souteArmyList(landersIds,idOfLander) {
    let showMe = true;
    let colId = 'list_soute';
    if (idOfLander >= 0) {
        colId = 'list_lander';
    }
    let armyBats = [];
    let numTrans = 0;
    let numInf = 0;
    let armyTransVol = 0;
    let armyTransSize = 0;
    let sortedBats = bataillons.slice();
    sortedBats = _.sortBy(_.sortBy(_.sortBy(sortedBats,'id'),'type'),'army');
    sortedBats = sortedBats.reverse();
    sortedBats.forEach(function(bat) {
        let batType = getBatType(bat);
        showMe = false;
        if (idOfLander >= 0) {
            if (bat.loc === 'trans' && bat.locId === idOfLander) {
                showMe = true;
            }
        } else {
            if (bat.loc === 'zone' || !landersIds.includes(bat.locId)) {
                showMe = true;
            }
        }
        if (batType.skills.includes('transorbital')) {
            showMe = false;
        }
        if (batType.id === 126 || batType.id === 225) {
            showMe = false;
        }
        if (batType.cat === 'devices' || batType.cat === 'buildings') {
            showMe = false;
        }
        if (souteFilter === 'army') {
            if (armyFilter > 0) {
                if (bat.army != undefined) {
                    if (bat.army != armyFilter) {
                        showMe = false;
                    }
                } else {
                    showMe = false;
                }
            } else if (armyFilter === 0) {
                if (bat.army != undefined) {
                    if (bat.army > 0) {
                        showMe = false;
                    }
                }
            }
        }
        if (showMe) {
            if (bat.loc === 'zone' && idOfLander < 0) {
                loadBat(bat.id,souteId);
            }
            batListElement(bat,batType,idOfLander);
            // calculer les transports et infanteries! xxxxxx
            // sauf si 2 bigTrans -> message "faites 2 armées"
            if (armyFilter >= 1) {
                let newArmyBat = addNewArmyBat(bat,batType);
                if (newArmyBat.cat != 'out') {
                    armyBats.push(newArmyBat);
                }
                if (newArmyBat.cat === 'trans') {
                    numTrans++;
                    armyTransVol = newArmyBat.transUnits;
                    armyTransSize = newArmyBat.transMaxSize;
                }
                if (newArmyBat.cat === 'inf') {
                    numInf++;
                }
            }
        }
    });
    if (armyFilter >= 1) {
        if (numTrans === 1 && numInf >= 1) {
            checkArmyTrans(armyBats,armyTransSize,armyTransVol);
        } else if (numInf >= 1) {
            if (numTrans > 1) {
                $('#list_soute').append('<br><span class="listRes gf">&nbsp Plusieurs véhicules de transport dans la même armée:<br> &nbsp Pas de calcul des places.<br></span>');
            }
        }
    }
};

function checkArmyTrans(armyBats,armyTransSize,armyTransVol) {
    let armyTransLeft = armyTransVol;
    let notInTrans = [];
    let tooBigForTrans = [];
    let transName = 'véhicules';
    let miniTransVol = 0;
    let miniTransSize = 0;
    let miniName = 'véhicules';
    let sortedBats = armyBats.slice();
    sortedBats = _.sortBy(sortedBats,'volume');
    sortedBats = sortedBats.reverse();
    sortedBats.forEach(function(bat) {
        if (bat.cat === 'inf') {
            if (bat.size <= armyTransSize) {
                if (armyTransLeft >= bat.volume) {
                    armyTransLeft = armyTransLeft-bat.volume;
                } else {
                    notInTrans.push(bat.name);
                }
            } else {
                tooBigForTrans.push(bat.name);
            }
        } else if (bat.cat === 'trans') {
            transName = bat.name;
        } else if (bat.cat === 'mini' && bat.transUnits > miniTransVol) {
            miniName = bat.name;
            miniTransVol = bat.transUnits;
            miniTransSize = bat.transMaxSize;
        }
    });
    let batsInMini = false;
    if (notInTrans.length >= 1 && miniTransVol >= 70) {
        let miniTransLeft = miniTransVol;
        sortedBats.forEach(function(bat) {
            if (bat.cat === 'inf' && notInTrans.includes(bat.name)) {
                if (bat.size <= miniTransSize) {
                    if (miniTransLeft >= bat.volume) {
                        miniTransLeft = miniTransLeft-bat.volume;
                        let index = notInTrans.indexOf(bat.name);
                        notInTrans.splice(index,1);
                        batsInMini = true;
                    }
                }
            }
        });
    }
    if (notInTrans.length === 0 && tooBigForTrans.length === 0) {
        if (batsInMini) {
            $('#list_soute').append('<br><span class="listRes cy">&nbsp Tous les bataillons rentrent dans les véhicules.</span>');
        } else {
            $('#list_soute').append('<br><span class="listRes cy">&nbsp Tous les bataillons rentrent dans les '+transName+'.</span>');
        }
        $('#list_soute').append('<br><span class="listRes gf">&nbsp (Place restante: '+armyTransLeft+')</span>');
    } else {
        if (batsInMini) {
            $('#list_soute').append('<br><span class="listRes or">&nbsp Ces bataillons ne rentrent pas dans les véhicules:</span>');
        } else {
            $('#list_soute').append('<br><span class="listRes or">&nbsp Ces bataillons ne rentrent pas dans les '+transName+':</span>');
        }
    }
    if (tooBigForTrans.length >= 1) {
        let nitList = toNiceString(tooBigForTrans);
        $('#list_soute').append('<br><span class="listRes blanc">&nbsp '+nitList+' <span class="gf">(trop grands)</span></span>');
    }
    if (notInTrans.length >= 1) {
        let nitList = toNiceString(notInTrans);
        $('#list_soute').append('<br><span class="listRes blanc">&nbsp '+nitList+' <span class="gf">(manque de place)</span></span>');
    }
    if (batsInMini) {
        $('#list_soute').append('<br><span class="listRes vert">&nbsp Certains bataillons ne rentrent pas dans les '+transName+'.<br>&nbsp Ils devront être transportés par les '+miniName+'.</span>');
    }
};

function addNewArmyBat(bat,batType) {
    let newArmyBat = {};
    newArmyBat.name = batType.name;
    newArmyBat.id = bat.id;
    newArmyBat.size = batType.size;
    newArmyBat.volume = calcVolume(bat,batType);
    newArmyBat.transUnits = calcBatTransUnits(bat,batType);
    newArmyBat.transMaxSize = batType.transMaxSize;
    if (newArmyBat.transUnits >= 500) {
        newArmyBat.cat = 'trans';
    } else if (newArmyBat.size <= 9) {
        newArmyBat.cat = 'inf';
    } else if (newArmyBat.transUnits >= 75) {
        newArmyBat.cat = 'mini';
    } else {
        newArmyBat.cat = 'out';
    }
    return newArmyBat;
};

function batListElement(bat,batType,idOfLander) {
    let colId = 'list_soute';
    if (idOfLander >= 0) {
        colId = 'list_lander';
    }
    let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq,bat.logeq]);
    let enoughRes = checkCost(deployCosts);
    let deployInfo = checkPlaceLander(bat,batType,slId);
    let mayOut = checkMayOutInSoute(bat,batType);
    let deployOK = true;
    if (!enoughRes || !deployInfo[0] || !deployInfo[1] || !deployInfo[2] || !mayOut || bat.eq === 'camkit' || bat.eq === 'taserkit' || bat.tags.includes('dying')) {
        deployOK = false;
    }
    if (batType.skills.includes('nodeploy')) {
        if (batType.name != 'Chercheurs' || playerInfos.gLevel < 19) {
            deployOK = false;
        }
    }
    if (batType.cat === 'buildings' || batType.cat === 'devices') {
        if (bat.soins != undefined) {
            if (bat.soins >= 20) {
                deployOK = false;
            }
        }
    }
    if (batType.cat === 'vehicles') {
        if (bat.soins != undefined) {
            if (bat.soins >= 30) {
                deployOK = false;
            }
        }
    }
    if (!deployOK) {
        if (bat.id === selectedBat.id) {
            blockType = 'souteBlockCheck';
        } else {
            blockType = 'souteBlockNope klik';
        }
    } else {
        if (bat.id === selectedBat.id) {
            blockType = 'souteBlockCheck';
        } else {
            blockType = 'souteBlock klik';
        }
    }
    let selId = bat.id;
    if (bat.id === selectedBat.id) {
        selId = souteId;
    }
    let batPic = getBatPic(bat,batType);
    let lynx = 'none';
    if (bat.id === selectedBat.id) {
        if (bat.locId === souteId) {
            if (deployOK) {
                lynx = 'deploy';
            }
        } else {
            lynx = 'undeploy';
        }
    }
    if (lynx === 'deploy') {
        $('#'+colId).append('<div class="'+blockType+'" onclick="batSouteSelect('+selId+')"><table><tr><td><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="48" title="Charger le bataillon dans le lander" onclick="batDeploy('+bat.id+')"></td><td id="be'+bat.id+'"></td></tr></table></div>');
    } else if (lynx === 'undeploy') {
        $('#'+colId).append('<div class="'+blockType+'" onclick="batSouteSelect('+selId+')"><table><tr><td><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="48" title="Renvoyer le bataillon dans la soute" onclick="batUndeploy('+bat.id+')"></td><td id="be'+bat.id+'"></td></tr></table></div>');
    } else {
        $('#'+colId).append('<div class="'+blockType+'" onclick="batSouteSelect('+selId+')"><table><tr><td><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="48"></td><td id="be'+bat.id+'"></td></tr></table></div>');
    }
    $('#be'+bat.id).append('<span class="listRes klik">'+batType.name+'</span>');
    if (batType.skills.includes('uprank')) {
        let isXPok = checkUprankXP(bat,batType);
        let isUpUnitOK = checkUpUnit(batType);
        let competFail = '';
        if (isUpUnitOK.message.includes('Compétences')) {
            competFail = '?';
        }
        if (isXPok && isUpUnitOK.ok) {
            $('#be'+bat.id).append('<span class="listRes bleu" title="Peut être changé en '+batType.unitUp+'">&nbsp;<i class="fas fa-chevron-circle-up"></i></span>');
        } else if (!isUpUnitOK.ok) {
            $('#be'+bat.id).append('<span class="listRes gff" title="Pourra être changé en '+batType.unitUp+competFail+' ('+isUpUnitOK.message+')">&nbsp;<i class="fas fa-chevron-circle-up"></i></span>');
        } else {
            $('#be'+bat.id).append('<span class="listRes gff" title="Pourra être changé en '+batType.unitUp+' (Bataillon insuffisamment expérimenté)">&nbsp;<i class="fas fa-chevron-circle-up"></i></span>');
        }
    }
    if (batType.skills.includes('upgrade')) {
        let isUpUnitOK = checkUpUnit(batType);
        let competFail = '';
        if (isUpUnitOK.message.includes('Compétences')) {
            competFail = '?';
        }
        if (isUpUnitOK.ok) {
            $('#be'+bat.id).append('<span class="listRes bleu" title="Peut être changé en '+batType.bldUp[0]+'">&nbsp;<i class="fas fa-chevron-circle-up"></i></span>');
        } else {
            $('#be'+bat.id).append('<span class="listRes gff" title="Pourra être changé en '+batType.bldUp[0]+competFail+' ('+isUpUnitOK.message+')">&nbsp;<i class="fas fa-chevron-circle-up"></i></span>');
        }
    }
    let batVolume = calcVolume(bat,batType);
    if (bat.chief != undefined) {
        if (bat.chief != '') {
            $('#be'+bat.id).append('<span class="listRes vert">('+bat.chief+')</span>');
        }
    }
    if (batType.skills.includes('prefab')) {
        let batWeight = calcPrefabWeight(batType);
        $('#be'+bat.id).append('<span class="listRes gff" title="Volume">('+batVolume+'/'+batWeight+')</span>');
    } else {
        $('#be'+bat.id).append('<span class="listRes gff" title="Volume">('+batVolume+')</span>');
    }
    let bxp = Math.round(bat.xp);
    let vetIcon = '';
    let army = '';
    if (bat.vet >= 1) {
        vetIcon = '<img src="/static/img/vet'+bat.vet+'.png" width="15">';
    } else if (bat.army >= 1) {
        army = ' ';
    }
    if (bat.army >= 1) {
        army = army+'a<span class="rose" title="Armée">'+bat.army+'</span>';
    }
    if (batType.name === 'Chercheurs') {
        $('#be'+bat.id).append('<span class="listRes gff" title="Pts de recherche">('+bat.sciRech+')</span>');
    } else {
        $('#be'+bat.id).append('<span class="listRes gff" title="XP">('+bxp+vetIcon+army+')</span>');
    }
    let vetStatus = '';
    if (bat.tags.includes('schef') || batType.skills.includes('leader')) {
        vetStatus = '<span class="bleu">(Chef)</span>';
    }
    if (bat.tags.includes('hero')) {
        vetStatus = '<span class="bleu">(Héros)</span>';
    }
    if (bat.tags.includes('vet')) {
        vetStatus = '(Vétéran)';
    }
    if (vetStatus != '') {
        $('#be'+bat.id).append('<span class="listRes gff">'+vetStatus+'</span>');
    }
    if (batType.skills.includes('prodres') || batType.skills.includes('geo') || batType.skills.includes('solar') || batType.skills.includes('cram') || batType.skills.includes('dogprod') || batType.skills.includes('transcrap') || batType.skills.includes('cryogen') || batType.skills.includes('cryocit')) {
        if (bat.tags.includes('prodres')) {
            $('#be'+bat.id).append('<span class="listRes vert" title="Production activée">&nbsp;<i class="fas fa-industry"></i></span>');
        } else {
            $('#be'+bat.id).append('<span class="listRes jaune" title="Production désactivée">&nbsp;<i class="fas fa-industry"></i></span>');
        }
    }
    if (bat.tags.includes('dying')) {
        $('#be'+bat.id).append('<span class="listRes or" title="Mourrant">&nbsp;<i class="fas fa-bone"></i></span>');
    } else if (bat.tags.includes('hungry')) {
        $('#be'+bat.id).append('<span class="listRes jaune" title="Souffrant">&nbsp;<i class="fas fa-bone"></i></span>');
    }
    let effSoins = checkEffSoins(bat);
    if (batType.cat === 'vehicles' || batType.cat === 'buildings' || batType.cat === 'devices') {
        if (bat.soins >= 11) {
            $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-wrench"></i></span>');
        }
        if (bat.emo >= 11) {
            $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-bed"></i> '+bat.emo+'</span>');
            if (!bat.tags.includes('pills')) {
                if (bat.emo >= 16) {
                    $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-pills"></i></span>');
                } else {
                    $('#be'+bat.id).append('<span class="listRes jaune">&nbsp;<i class="fas fa-pills"></i></span>');
                }
            }
        } else if (bat.emo >= 1) {
            $('#be'+bat.id).append('<span class="listRes jaune">&nbsp;<i class="fas fa-bed"></i> '+bat.emo+'</span>');
        }
    } else if (batType.skills.includes('clone')) {
        if (bat.tags.includes('necro')) {
            $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-bed"></i> '+bat.emo+'</span>');
        } else if (bat.emo >= 11) {
            $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-bed"></i> '+bat.emo+'</span>');
            if (!bat.tags.includes('pills')) {
                if (bat.emo >= 16) {
                    $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-pills"></i></span>');
                } else {
                    $('#be'+bat.id).append('<span class="listRes jaune">&nbsp;<i class="fas fa-pills"></i></span>');
                }
            }
        } else if (bat.emo >= 1) {
            $('#be'+bat.id).append('<span class="listRes jaune">&nbsp;<i class="fas fa-bed"></i> '+bat.emo+'</span>');
        }
        if (effSoins < 50) {
            $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-skull-crossbones"></i></span>');
        } else if (effSoins <= 75) {
            $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-heart"></i></span>');
        } else if (bat.soins >= 1) {
            $('#be'+bat.id).append('<span class="listRes jaune">&nbsp;<i class="far fa-heart"></i></span>');
        }
    } else {
        let bedTime = bat.emo;
        if (bat.soins > bat.emo) {
            bedTime = bat.soins;
        }
        if (bat.soins >= 11 || bat.emo >= 11 || bat.tags.includes('necro')) {
            $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-bed"></i> '+bedTime+'</span>');
            if (!bat.tags.includes('pills') && bat.emo >= 11) {
                if (bat.emo >= 16) {
                    $('#be'+bat.id).append('<span class="listRes or">&nbsp;<i class="fas fa-pills"></i></span>');
                } else {
                    $('#be'+bat.id).append('<span class="listRes jaune">&nbsp;<i class="fas fa-pills"></i></span>');
                }
            }
        } else if (bat.soins >= 1 || bat.emo >= 1) {
            $('#be'+bat.id).append('<span class="listRes jaune">&nbsp;<i class="fas fa-bed"></i> '+bedTime+'</span>');
        }
    }
    $('#be'+bat.id).append('<br>');
    let prt = bat.prt;
    if (prt.includes('aucun')) {
        prt = '/';
    }
    $('#be'+bat.id).append('<span class="listRes gff">Prt: <span class="brunf">'+prt+'</span></span>&nbsp;');
    let eq = bat.eq;
    if (eq.includes('aucun')) {
        eq = '/';
    }
    let dEmplois = checkDoubleEquip(bat);
    if (dEmplois) {
        $('#be'+bat.id).append('<span class="listRes gff" title="L\'équipement choisi fait double emplois avec un autre équipement!">Eq: <span class="rouge">'+eq+'</span></span>&nbsp;');
    } else {
        $('#be'+bat.id).append('<span class="listRes gff" title="Equipement choisi">Eq: <span class="brunf">'+eq+'</span></span>&nbsp;');
    }
    if (bat.logeq != '') {
        $('#be'+bat.id).append('<span class="listRes gff" title="Equipement bonus logistique">Eq2: <span class="brunf">'+bat.logeq+'</span></span>');
    }
    if (bat.tdc.length >= 1) {
        $('#be'+bat.id).append('<br>');
        if (batType.skills.includes('penitbat')) {
            $('#be'+bat.id).append('<span class="listRes gff" title="Equipement(s) tombé(s) du camion">Eq3+: <span class="brunf">'+toNiceString(bat.tdc)+'</span></span>');
        } else {
            $('#be'+bat.id).append('<span class="listRes gff" title="Equipement(s) bonus compétences">Eq3+: <span class="brunf">'+toNiceString(bat.tdc)+'</span></span>');
        }
    }
    $('#be'+bat.id).append('<br>');
    if (checkHasWeapon(1,batType,bat.eq)) {
        $('#be'+bat.id).append('<span class="listRes gff">'+batType.weapon.name+': <span class="brunf">'+bat.ammo+'</span></span>&nbsp;');
    }
    if (checkHasWeapon(2,batType,bat.eq)) {
        $('#be'+bat.id).append('<span class="listRes gff">'+batType.weapon2.name+': <span class="brunf">'+bat.ammo2+'</span></span>');
    }
    if (bat.id === selectedBat.id) {
        $('#be'+bat.id).append('<hr class="cyff">');
        let mayDeploy = true;
        if (bat.eq === 'camkit' || bat.eq === 'taserkit') {
            mayDeploy = false;
        }
        if (batType.skills.includes('nodeploy')) {
            if (batType.name != 'Chercheurs' || playerInfos.gLevel < 19) {
                mayDeploy = false;
            }
        }
        if (mayDeploy) {
            if (lynx === 'deploy') {
                $('#be'+bat.id).append('<span class="listRes marine klik" title="Charger le bataillon dans le lander" onclick="batDeploy('+bat.id+')"><i class="fas fa-sign-in-alt"></i></span>&nbsp;');
            } else if (lynx === 'undeploy') {
                $('#be'+bat.id).append('<span class="listRes marine klik" title="Renvoyer le bataillon dans la soute" onclick="batUndeploy('+bat.id+')"><i class="fas fa-sign-out-alt fa-flip-horizontal"></i></span>&nbsp;');
            }
            showCostsDetail(deployCosts,bat);
        }
        if (!mayOut) {
            $('#be'+bat.id).append('<span class="listRes rouge">Ce bataillon ne peut pas aller sur Kzin.</span>');
        }
    }
};

function checkDoubleEquip(bat) {
    let dEmplois = false;
    if (bat.tdc.includes(bat.eq) || bat.logeq === bat.eq) {
        dEmplois = true;
    }
    if (bat.eq.includes('chargeur')) {
        if (bat.tdc.includes('fakit') || bat.logeq === 'fakit' || bat.tdc.includes('wstabkit') || bat.logeq === 'wstabkit') {
            dEmplois = true;
        }
    }
    return dEmplois;
};

function batSouteSelect(batId) {
    let bat = getBatById(batId);
    selectedBat = JSON.parse(JSON.stringify(bat));
    // console.log(selectedBat);
    checkSelectedBatType();
    playRadio('any',false);
    // showBatInfos(selectedBat);
    goSoute();
};

function batDeploy(batId) {
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    // vérifier si les munitions sont faisables! (si non: mettre la munition de base?)
    let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq,bat.logeq]);
    let enoughRes = checkCost(deployCosts);
    if (enoughRes) {
        payCost(deployCosts);
        bat.apLeft = bat.ap;
        loadBat(bat.id,slId,souteId);
    } else {
        console.log('not enough res');
    }
    goSoute();
    showBatInfos(bat);
};

function batUndeploy(batId) {
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq,bat.logeq]);
    addCost(deployCosts,1);
    loadBat(bat.id,souteId,slId);
    goSoute();
    showBatInfos(bat);
};

function batUndeployFrom(batId,fromId) {
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq,bat.logeq]);
    addCost(deployCosts,1);
    loadBat(bat.id,souteId,fromId);
};

function calcLanderDeploy(landerBatType,quiet) {
    let deployCosts = landerBatType.deploy;
    // playerInfos.missionPlanet
    // modifier pour la distance
    // kzin, horst, dom, gehenna, sarak
    let distanceFactor = 1;
    if (playerInfos.missionPlanet === 5) {
        // Horst
        distanceFactor = 1.7;
    } else if (playerInfos.missionPlanet === 4) {
        // Kzin
        distanceFactor = 2;
    } else if (playerInfos.missionPlanet === 3) {
        // Gehenna
        distanceFactor = 0.8;
    } else if (playerInfos.missionPlanet === 2) {
        // Sarak
        distanceFactor = 0.3;
    }
    let affectedRes = [];
    affectedRes.push('Energie');
    affectedRes.push('Plutonium');
    affectedRes.push('Hydrogène');
    affectedRes.push('Uranium');
    affectedRes.push('Plastanium');
    let newCosts = {};
    let plastaNeed = 0;
    Object.entries(deployCosts).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (key === 'Plastanium') {
            let dispoRes = getDispoRes(key);
            if (dispoRes < value) {
                plastaNeed = Math.ceil(value*distanceFactor);
                value = 0;
            }
        }
        if (affectedRes.includes(key)) {
            newCosts[key] = Math.ceil(value*distanceFactor);
        } else {
            newCosts[key] = Math.ceil(value);
        }
    });
    if (plastaNeed >= 1) {
        let hydroNeed = plastaNeed*10;
        let powerNeed = plastaNeed*40;
        newCosts['Hydrogène'] = newCosts['Hydrogène']+hydroNeed;
        newCosts['Energie'] = newCosts['Energie']+powerNeed;
        if (!quiet) {
            warning('<span class="rq3">Défaut de ressources</span>','<span class="vio">Les '+plastaNeed+' Plastanium requis pour le décollage devront être remplacés par '+hydroNeed+' Hydrogène et '+powerNeed+' Energie.</span>');
        }
    }
    // ajouter les scaphandres (en fonction de la taille du lander)
    // gehenna : oxygène
    // sarak : energie
    // horst : entretien combis (kapton) / energie / oxygène
    // kzin : entretien combis (titane)
    let landerSizeFactor = landerBatType.transUnits/9000;
    if (playerInfos.missionPlanet === 5) {
        // Horst
        if (newCosts['Oxygène'] != undefined) {
            newCosts['Oxygène'] = newCosts['Oxygène']+Math.ceil(landerSizeFactor*100);
        } else {
            newCosts['Oxygène'] = Math.ceil(landerSizeFactor*100);
        }
        if (newCosts['Energie'] != undefined) {
            newCosts['Energie'] = newCosts['Energie']+Math.ceil(landerSizeFactor*200);
        } else {
            newCosts['Energie'] = Math.ceil(landerSizeFactor*200);
        }
        if (newCosts['Carbone'] != undefined) {
            newCosts['Carbone'] = newCosts['Carbone']+Math.ceil(landerSizeFactor*45);
        } else {
            newCosts['Carbone'] = Math.ceil(landerSizeFactor*45);
        }
        if (newCosts['Aluminium'] != undefined) {
            newCosts['Aluminium'] = newCosts['Aluminium']+Math.ceil(landerSizeFactor*15);
        } else {
            newCosts['Aluminium'] = Math.ceil(landerSizeFactor*15);
        }
        if (newCosts['Nickel'] != undefined) {
            newCosts['Nickel'] = newCosts['Nickel']+Math.ceil(landerSizeFactor*15);
        } else {
            newCosts['Nickel'] = Math.ceil(landerSizeFactor*15);
        }
    } else if (playerInfos.missionPlanet === 4) {
        // Kzin
        if (newCosts['Aluminium'] != undefined) {
            newCosts['Aluminium'] = newCosts['Aluminium']+Math.ceil(landerSizeFactor*20);
        } else {
            newCosts['Aluminium'] = Math.ceil(landerSizeFactor*20);
        }
        if (newCosts['Titane'] != undefined) {
            newCosts['Titane'] = newCosts['Titane']+Math.ceil(landerSizeFactor*20);
        } else {
            newCosts['Titane'] = Math.ceil(landerSizeFactor*20);
        }
    } else if (playerInfos.missionPlanet === 3) {
        // Gehenna
        if (newCosts['Oxygène'] != undefined) {
            newCosts['Oxygène'] = newCosts['Oxygène']+Math.ceil(landerSizeFactor*100);
        } else {
            newCosts['Oxygène'] = Math.ceil(landerSizeFactor*100);
        }
    } else if (playerInfos.missionPlanet === 2) {
        // Sarak
        if (newCosts['Energie'] != undefined) {
            newCosts['Energie'] = newCosts['Energie']+Math.ceil(landerSizeFactor*50);
        } else {
            newCosts['Energie'] = Math.ceil(landerSizeFactor*50);
        }
    }
    return newCosts;
}

function landerDeploy(landerId) {
    let landerBat = getBatById(landerId);
    let landerBatType = getBatType(landerBat);
    let deployCosts = calcLanderDeploy(landerBatType,true);
    let enoughRes = checkCost(deployCosts);
    if (enoughRes) {
        payCost(deployCosts);
        landerBat.apLeft = landerBat.ap;
        landerBat.tags.push('deploy');
    } else {
        console.log('not enough res');
    }
    commandes();
    if (inSoute) {
        goSoute();
    }
    showBatInfos(landerBat);
};

function landerUnDeploy(landerId) {
    let landerBat = getBatById(landerId);
    if (landerBat.tags.includes('deploy')) {
        let landerBatType = getBatType(landerBat);
        let deployCosts = calcLanderDeploy(landerBatType,true);
        addCost(deployCosts,1);
        tagDelete(landerBat,'deploy');
    }
    commandes();
    if (inSoute) {
        goSoute();
    }
    showBatInfos(landerBat);
};

function unDeployAllLanders() {
    bataillons.forEach(function(bat) {
        if (bat.tags.includes('deploy')) {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital')) {
                let deployCosts = calcLanderDeploy(batType,true);
                addCost(deployCosts,1);
                tagDelete(bat,'deploy');
            }
        }
    });
    commandes();
    if (inSoute) {
        goSoute();
    }
};

function loadBat(batId,transBatId,oldTransBatId) {
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    let transBat = getBatById(transBatId);
    bat.loc = 'trans';
    bat.locId = transBat.id;
    bat.tileId = transBat.tileId;
    bat.extracted = [];
    tagDelete(bat,'mining');
    tagDelete(bat,'mud');
    tagDelete(bat,'blub');
    tagDelete(bat,'guet');
    tagDelete(bat,'fortif');
    tagDelete(bat,'camo');
    bat.fuzz = batType.fuzz;
    if (!transBat.transIds.includes(bat.id)) {
        transBat.transIds.push(bat.id);
    }
    if (oldTransBatId != undefined) {
        if (oldTransBatId >= 0) {
            let oldTransBat = getBatById(oldTransBatId);
            if (oldTransBat.transIds.includes(bat.id)) {
                let tagIndex = oldTransBat.transIds.indexOf(bat.id);
                oldTransBat.transIds.splice(tagIndex,1);
            }
        }
    }
    let batListIndex = batList.findIndex((obj => obj.id === bat.id));
    if (batListIndex > -1) {
        batList.splice(batListIndex,1);
    }
};

function getAllDeployCosts(unit,ammoNames) {
    let totalCosts = {};
    let deployCosts = {};
    let batAmmo;
    // Ammo W1
    let hasW1 = checkHasWeapon(1,unit,ammoNames[3]);
    if (ammoNames[0] != 'xxx' && hasW1) {
        batAmmo = getAmmoByName(ammoNames[0]);
        deployCosts = getDeployCosts(unit,batAmmo,1,'ammo');
        mergeObjects(totalCosts,deployCosts);
    }
    // Ammo W2
    let hasW2 = checkHasWeapon(2,unit,ammoNames[3]);
    if (ammoNames[1] != 'xxx' && hasW2) {
        batAmmo = getAmmoByName(ammoNames[1]);
        deployCosts = getDeployCosts(unit,batAmmo,2,'ammo');
        mergeObjects(totalCosts,deployCosts);
    }
    // Armor
    if (ammoNames[2] != 'xxx') {
        let batArmor = getEquipByName(ammoNames[2]);
        deployCosts = getDeployCosts(unit,batArmor,0,'equip');
        mergeObjects(totalCosts,deployCosts);
    }
    // Equip
    if (ammoNames[3] != 'xxx') {
        let batEquip = getEquipByName(ammoNames[3]);
        deployCosts = getDeployCosts(unit,batEquip,0,'equip');
        mergeObjects(totalCosts,deployCosts);
    }
    // Equip 2 (logeq)
    if (ammoNames[4] != 'xxx') {
        let batEquip = getEquipByName(ammoNames[4]);
        deployCosts = getDeployCosts(unit,batEquip,0,'equip');
        mergeObjects(totalCosts,deployCosts);
    }
    // Unit
    deployCosts = getDeployCosts(unit,batAmmo,0,'unit');
    mergeObjects(totalCosts,deployCosts);
    return totalCosts;
};

function showCostsDetail(deployCosts,bat) {
    if (deployCosts != undefined) {
        Object.entries(deployCosts).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let dispoRes = getDispoRes(key);
            if (dispoRes >= value) {
                $('#be'+bat.id).append('<span class="listRes gff">'+key+': <span class="brunf">'+value+'</span>/'+dispoRes+'</span>');
            } else {
                $('#be'+bat.id).append('<span class="listRes gff">'+key+': <span class="brunf">'+value+'</span>/<span class="rouge">'+dispoRes+'</span></span>');
            }
        });
    }
};

function checkPlaceLander(myBat,myBatType,landerId) {
    let deployInfo = [false,false,false];
    let myLander = getBatById(landerId);
    let myLanderType = getBatType(myLander);
    if (myLander.tags.includes('deploy')) {
        deployInfo[0] = true;
    }
    if (myBatType.skills.includes('prefab')) {
        if (myLanderType.transMaxSize*4.5 >= myBatType.size) {
            deployInfo[1] = true;
        }
    } else {
        if (myLanderType.transMaxSize >= myBatType.size) {
            deployInfo[1] = true;
        }
    }
    let batVolume = calcVolume(myBat,myBatType);
    let placeLeft = calcTransUnitsLeft(myLander,myLanderType);
    if (placeLeft+25 >= batVolume) {
        deployInfo[2] = true;
    }
    return deployInfo;
};

function viewLanderRes() {
    $('#list_lander').empty();
    $('#list_lander').append('<div class="souteBlock" id="lresList"></div>');
    let landerBat = getBatById(slId);
    let landerBatType = getBatType(landerBat);
    let transResLeft = checkResSpace(landerBat);
    let transResIn = checkResLoad(landerBat);
    let transResMax = landerBatType.transRes;
    if (hasEquip(landerBat,['megafret'])) {
        transResMax = Math.round(transResMax*1.33);
    }
    let numCit = getLanderNumCit(slId,126);
    let numCrim = getLanderNumCit(slId,225);
    $('#lresList').append('<br>');
    $('#lresList').append('<span class="paramName">Maximum Fret</span><span class="paramIcon"></span><span class="paramValue">'+transResMax+'</span><br>');
    $('#lresList').append('<span class="paramName">Charge</span><span class="paramIcon"></span><span class="paramValue">'+transResIn+'</span><br>');
    $('#lresList').append('<span class="paramName">Reste</span><span class="paramIcon"></span><span class="paramValue">'+transResLeft+'</span><br>');
    $('#lresList').append('<span class="paramName">Ressources</span><span class="paramIcon cy"><i class="far fa-gem"></i></span><span class="paramValue cy klik" title="Remettre toutes les ressources dans la soute" onclick="emptyLanderRes()">Vider</span><br>');
    $('#lresList').append('<br>');
    $('#lresList').append('<span class="paramName">Citoyens</span><span class="paramIcon"></span><span class="paramValue">'+numCit+'</span><br>');
    $('#lresList').append('<span class="paramName">Criminels</span><span class="paramIcon"></span><span class="paramValue">'+numCrim+'</span><br>');
    $('#lresList').append('<span class="paramName">Citoyens & Criminels</span><span class="paramIcon cy"><i class="far fa-user"></i></span><span class="paramValue cy klik" title="Remettre tous les citoyens dans la soute" onclick="emptyLanderCit()">Vider</span><br>');
    $('#lresList').append('<br>');
};

function getLanderNumCit(landerId,citId) {
    let numCit = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && bat.locId === landerId && bat.typeId === citId) {
            numCit = numCit+bat.citoyens;
        }
    });
    return numCit;
};

function emptyLanderCit() {
    bataillons.forEach(function(bat) {
        if (bat.typeId === 126 || bat.typeId === 225) {
            if (bat.loc === 'trans' && bat.locId === slId) {
                loadBat(bat.id,souteId,slId);
            }
        }
    });
    prepaBld = {};
    goSoute();
};

function emptyLanderRes() {
    let landerBat = getBatById(slId);
    moveResCost(landerBat.transRes,slId,souteId,1);
    prepaBld = {};
    playerInfos.okFill = false;
    goSoute();
};

function missionRes() {
    $('#list_soute').empty();
    $('#list_soute').append('<div class="souteBlock" id="fillList"></div>');
    findLanders();
    let lastKind = '';
    let showkind = '';
    let showPrep = '';
    let bldNeed = [];
    let prodOK = true;
    let colour = '';
    let costsOK = false;
    let combinedCosts = {};
    let costString = '';
    // CITOYENS
    $('#fillList').append('<br><span class="constName or">CITOYENS</span><br>');
    let numCit = getLanderNumCit(souteId,126);
    if (numCit < 6) {
        $('#fillList').append('<span class="constName gff">&cross; 6 Citoyens</span><br>');
    } else {
        $('#fillList').append('<span class="constName klik cyf" onclick="missionCit(126)">&check; 6 Citoyens</span><br>');
    }
    let numCrim = getLanderNumCit(souteId,225);
    if (numCrim < 6) {
        $('#fillList').append('<span class="constName gff">&cross; 6 Criminels</span><br>');
    } else {
        $('#fillList').append('<span class="constName klik cyf" onclick="missionCit(225)">&check; 6 Criminels</span><br>');
    }
    // BATIMENTS
    let allUnitsList = unitTypes.slice();
    let sortedUnitsList = _.sortBy(_.sortBy(_.sortBy(allUnitsList,'name'),'cat'),'kind');
    sortedUnitsList.forEach(function(unit) {
        if (unit.moveCost === 99 && unit.kind != 'zero-vaisseaux' && unit.kind != 'zero-vm' && unit.name != 'Coffres' && !unit.skills.includes('prefab')) {
            prodOK = true;
            if (unit.levels[playerInfos.gang] > playerInfos.gLevel) {
                prodOK = false;
            }
            let compReqOK = checkCompReq(unit);
            if (prodOK && compReqOK) {
                if (lastKind != unit.kind) {
                    showkind = unit.kind.replace(/zero-/g,"");
                    $('#fillList').append('<br><span class="constName or" id="kind-'+unit.kind+'">'+showkind.toUpperCase()+'</span><br>');
                }
                if (prepaBld[unit.name] === undefined) {
                    showPrep = '';
                } else {
                    showPrep = '('+prepaBld[unit.name]+')';
                }
                bldNeed = [];
                colour = 'gris';
                if (unit.bldCost != 'none') {
                    bldNeed[0] = unit.bldCost;
                } else {
                    bldNeed = unit.bldReq;
                }
                costString = '';
                if (unit.costs != undefined) {
                    costString = displayCosts(unit.costs);
                }
                costsOK = checkUnitCost(unit,true);
                if (!costsOK) {
                    $('#fillList').append('<span class="constName gris" title="'+toNiceString(bldNeed)+' '+costString+'">&cross; '+unit.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                } else {
                    $('#fillList').append('<span class="constName klik cy" title="'+toNiceString(bldNeed)+' '+costString+'" onclick="missionResUnit('+unit.id+')">&check; '+unit.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                    if (unit.equip.length >= 2) {
                        unit.equip.forEach(function(equipName) {
                            if (!equipName.includes('aucun')) {
                                let equip = getEquipByName(equipName);
                                let compReqOK = checkCompReq(equip);
                                if (compReqOK) {
                                    let equipCountName = unit.id+'-'+equipName;
                                    if (prepaBld[equipCountName] === undefined) {
                                        showPrep = '';
                                    } else {
                                        showPrep = '('+prepaBld[equipCountName]+')';
                                    }
                                    combinedCosts = {};
                                    let flatCosts = getCosts(unit,equip,0,'equip');
                                    mergeObjects(combinedCosts,flatCosts);
                                    let deployCosts = getDeployCosts(unit,equip,0,'equip');
                                    mergeObjects(combinedCosts,deployCosts);
                                    costsOK = checkCost(combinedCosts);
                                    costString = '';
                                    if (combinedCosts != undefined) {
                                        costString = displayCosts(combinedCosts);
                                    }
                                    if (!costsOK) {
                                        $('#fillList').append('<span class="constName gff" title="'+costString+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&cross; '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                                    } else {
                                        $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&check; '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                                    }
                                }
                            }
                        });
                    }
                    if (unit.protection.length >= 2) {
                        unit.protection.forEach(function(equipName) {
                            if (!equipName.includes('aucun')) {
                                let equip = getEquipByName(equipName);
                                let compReqOK = checkCompReq(equip);
                                if (compReqOK) {
                                    let equipCountName = unit.id+'-'+equipName;
                                    if (prepaBld[equipCountName] === undefined) {
                                        showPrep = '';
                                    } else {
                                        showPrep = '('+prepaBld[equipCountName]+')';
                                    }
                                    combinedCosts = {};
                                    let flatCosts = getCosts(unit,equip,0,'equip');
                                    mergeObjects(combinedCosts,flatCosts);
                                    let deployCosts = getDeployCosts(unit,equip,0,'equip');
                                    mergeObjects(combinedCosts,deployCosts);
                                    costsOK = checkCost(combinedCosts);
                                    costString = '';
                                    if (combinedCosts != undefined) {
                                        costString = displayCosts(combinedCosts);
                                    }
                                    if (!costsOK) {
                                        $('#fillList').append('<span class="constName gff" title="'+costString+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&cross; blindage '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                                    } else {
                                        $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&check; blindage '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                                    }
                                }
                            }
                        });
                    }
                }
                lastKind = unit.kind;
            }
        }
    });
    // INFRASTRUCTURES
    $('#fillList').append('<br><span class="constName or">INFRASTRUCTURES</span><br>');
    armorTypes.forEach(function(infra) {
        if (infra.fabTime != undefined) {
            prodOK = true;
            if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def+playerInfos.comp.const) {
                prodOK = false;
            }
            let compReqOK = checkCompReq(infra);
            if (prodOK && compReqOK) {
                if (prepaBld[infra.name] === undefined) {
                    showPrep = '';
                } else {
                    showPrep = '('+prepaBld[infra.name]+')';
                }
                costsOK = checkCost(infra.costs);
                costString = '';
                if (infra.costs != undefined) {
                    costString = displayCosts(infra.costs);
                }
                if (!costsOK) {
                    $('#fillList').append('<span class="constName gff" title="'+costString+'">&cross; '+infra.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                } else {
                    $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResInfra(`'+infra.name+'`,``,1)">&check; '+infra.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                }
            }
        }
    });
    // ROUTES
    if (prepaBld['Route'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+prepaBld['Route']+')';
    }
    let routeProps = makeInfraProps('Route','road');
    costsOK = checkCost(routeProps.costs);
    costString = '';
    if (routeProps.costs != undefined) {
        costString = displayCosts(routeProps.costs);
    }
    if (!costsOK) {
        $('#fillList').append('<span class="constName gff" title="'+costString+'">&cross; Route <span class="ciel">'+showPrep+'</span></span><br>');
    } else {
        $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResInfra(`Route`,`road`,1)">&check; Route <span class="ciel">'+showPrep+'</span></span><br>');
    }
    if (prepaBld['Pont'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+prepaBld['Pont']+')';
    }
    let pontProps = makeInfraProps('Pont','road');
    costsOK = checkCost(pontProps.costs);
    costString = '';
    if (pontProps.costs != undefined) {
        costString = displayCosts(pontProps.costs);
    }
    if (!costsOK) {
        $('#fillList').append('<span class="constName gff" title="'+costString+'">&cross; Pont <span class="ciel">'+showPrep+'</span></span><br>');
    } else {
        $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResInfra(`Pont`,`road`,1)">&check; Pont <span class="ciel">'+showPrep+'</span></span><br>');
    }
    // TELEPORT
    if (playerInfos.comp.tele >= 2) {
        $('#fillList').append('<br><span class="constName or">TELEPORTATION</span><br>');
        if (prepaBld['ResPort'] === undefined) {
            showPrep = '';
        } else {
            showPrep = '('+prepaBld['ResPort']+')';
        }
        let resportProps = makeInfraProps('ResPort','teleport');
        costsOK = checkCost(resportProps.costs);
        costString = '';
        if (resportProps.costs != undefined) {
            costString = displayCosts(resportProps.costs);
        }
        if (!costsOK) {
            $('#fillList').append('<span class="constName gff" title="'+costString+'">&cross; Ressources (station &rarr; pod) <span class="ciel">'+showPrep+'</span></span><br>');
        } else {
            $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResInfra(`ResPort`,`teleport`,1)">&check; Ressources (station &rarr; pod) <span class="ciel">'+showPrep+'</span></span><br>');
        }
        if (prepaBld['LifePort'] === undefined) {
            showPrep = '';
        } else {
            showPrep = '('+prepaBld['LifePort']+')';
        }
        let lifeportProps = makeInfraProps('LifePort','teleport');
        costsOK = checkCost(lifeportProps.costs);
        costString = '';
        if (lifeportProps.costs != undefined) {
            costString = displayCosts(lifeportProps.costs);
        }
        if (!costsOK) {
            $('#fillList').append('<span class="constName gff" title="'+costString+'">&cross; Bataillons (pod &rarr; pod) <span class="ciel">'+showPrep+'</span></span><br>');
        } else {
            $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResInfra(`LifePort`,`teleport`,1)">&check; Bataillons (pod &rarr; pod) <span class="ciel">'+showPrep+'</span></span><br>');
        }
    }
    // DROGUES
    $('#fillList').append('<br><span class="constName or">DROGUES</span><br>');
    armorTypes.forEach(function(drug) {
        if (drug.cat != undefined) {
            if (drug.cat === 'drogue') {
                let excluOK = true;
                if (drug.exclu != undefined) {
                    if (drug.exclu != playerInfos.gang) {
                        excluOK = false;
                    }
                }
                let drugCompOK = checkCompReq(drug);
                if (drugCompOK && excluOK) {
                    if (prepaBld[drug.name] === undefined) {
                        showPrep = '';
                    } else {
                        showPrep = '('+prepaBld[drug.name]+')';
                    }
                    costString = '';
                    if (drug.costs != undefined) {
                        costString = displayCosts(drug.costs);
                    }
                    costsOK = checkMultiCost(drug.costs,10);
                    if (!costsOK) {
                        costsOK = checkMultiCost(drug.costs,5);
                        if (!costsOK) {
                            $('#fillList').append('<span class="constName gff" title="'+costString+'">&cross; 5 '+drug.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                        } else {
                            $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResInfra(`'+drug.name+'`,``,5)">&check; 5 '+drug.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                        }
                    } else {
                        $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResInfra(`'+drug.name+'`,``,10)">&check; 10 '+drug.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                    }
                }
            }
        }
    });
    // PACKS UPKEEP
    $('#fillList').append('<br><span class="constName or">PACKS UPKEEP (10 Tours)</span><br>');
    unitTypes.forEach(function(unit) {
        if (unit.skills.includes('prefab')) {
            if (playerInfos.bldVM.includes(unit.name)) {
                if (unit.upkeep != undefined) {
                    if (prepaBld[unit.name] === undefined) {
                        showPrep = '';
                    } else {
                        showPrep = '('+prepaBld[unit.name]+')';
                    }
                    let upCosts = {};
                    Object.entries(unit.upkeep).map(entry => {
                        let key = entry[0];
                        let value = entry[1];
                        let upValue = Math.ceil(value)*10;
                        upCosts[key] = upValue;
                    });
                    costString = displayCosts(upCosts);
                    costsOK = checkCost(upCosts);
                    if (!costsOK) {
                        $('#fillList').append('<span class="constName gff" title="'+costString+'">&cross; '+unit.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                    } else {
                        $('#fillList').append('<span class="constName klik cyf" title="'+costString+'" onclick="missionResUpkeep(`'+unit.name+'`,10)">&check; '+unit.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                    }
                }
            }
        }
    });
    // PACKS DE RESSOURCES
    // $('#fillList').append('<br><span class="constName or">PACKS DE RESSOURCES</span><br>');
    // armorTypes.forEach(function(pack) {
    //     if (pack.name.includes('respack-')) {
    //         if (prepaBld[pack.name] === undefined) {
    //             showPrep = '';
    //         } else {
    //             showPrep = '('+prepaBld[pack.name]+')';
    //         }
    //         costsOK = checkCost(pack.costs);
    //         if (!costsOK) {
    //             $('#fillList').append('<span class="constName gff">&cross; '+pack.info+' <span class="ciel">'+showPrep+'</span></span><br>');
    //         } else {
    //             $('#fillList').append('<span class="constName klik cyf" onclick="missionResInfra(`'+pack.name+'`,``,1)">&check; '+pack.info+' <span class="ciel">'+showPrep+'</span></span><br>');
    //         }
    //     }
    // });
    $('#fillList').append('<br>');
};

function makeInfraProps(infraName,special) {
    let infra = {};
    if (special === 'teleport') {
        infra = {};
        infra.name = infraName;
        infra.costs = {};
        if (infra.name === 'ResPort') {
            infra.costs = teleStationCost;
        } else if (infra.name === 'LifePort') {
            infra.costs = teleCost;
        }
    } else if (special === 'road') {
        infra = {};
        infra.name = infraName;
        infra.costs = {};
        if (infra.name === 'Pont') {
            infra.costs['Scrap'] = 50;
            infra.costs['Compo1'] = 150;
            if (playerInfos.comp.const >= 1) {
                infra.costs['Compo1'] = 100;
            }
            infra.costs['Compo2'] = 50;
            if (playerInfos.comp.const >= 2) {
                infra.costs['Compo2'] = 33;
            }
        } else {
            infra.costs['Compo1'] = 20;
            if (playerInfos.comp.const >= 1) {
                infra.costs['Compo1'] = 14;
            }
        }
    } else {
        infra = getInfraByName(infraName);
    }
    return infra;
};

function missionResInfra(infraName,special,number) {
    let infra = makeInfraProps(infraName,special);
    console.log(infra);
    moveResCost(infra.costs,souteId,slId,number);
    if (prepaBld[infra.name] === undefined) {
        prepaBld[infra.name] = number;
    }  else {
        prepaBld[infra.name] = prepaBld[infra.name]+number;
    }
    playerInfos.okFill = true;
    goSoute();
    console.log(prepaBld);
};

function missionResUpkeep(unitName,number) {
    let unit = getBatTypeByName(unitName);
    console.log(unit);
    let upCosts = {};
    Object.entries(unit.upkeep).map(entry => {
        let key = entry[0];
        let value = entry[1];
        let upValue = Math.ceil(value);
        upCosts[key] = upValue;
    });
    moveResCost(upCosts,souteId,slId,number);
    if (prepaBld[unit.name] === undefined) {
        prepaBld[unit.name] = number;
    }  else {
        prepaBld[unit.name] = prepaBld[unit.name]+number;
    }
    playerInfos.okFill = true;
    goSoute();
    console.log(prepaBld);
};

function missionResEquip(equipName,unitId) {
    let equip = getEquipByName(equipName);
    let unit = getBatTypeById(unitId);
    let flatCosts = getCosts(unit,equip,0,'equip');
    let deployCosts = getDeployCosts(unit,equip,0,'equip');
    moveResCost(flatCosts,souteId,slId,1);
    moveResCost(deployCosts,souteId,slId,1);
    let equipCountName = unitId+'-'+equip.name;
    if (prepaBld[equipCountName] === undefined) {
        prepaBld[equipCountName] = 1;
    }  else {
        prepaBld[equipCountName] = prepaBld[equipCountName]+1;
    }
    goSoute();
};

function missionResUnit(unitId) {
    let unit = getBatTypeById(unitId);
    moveResCost(unit.costs,souteId,slId,1);
    moveResCost(unit.deploy,souteId,slId,1);
    let reqCit = unit.squads*unit.squadSize*unit.crew;
    if (unit.skills.includes('clone') || unit.skills.includes('dog')) {
        reqCit = 0;
    }
    let citId = 126;
    let dispoCit = getDispoCit();
    if (reqCit >= 1) {
        moveCit(citId,souteId,slId,reqCit);
    }
    if (prepaBld[unit.name] === undefined) {
        prepaBld[unit.name] = 1;
    }  else {
        prepaBld[unit.name] = prepaBld[unit.name]+1;
    }
    playerInfos.okFill = true;
    goSoute();
};

function missionCit(citId) {
    moveCit(citId,souteId,slId,6);
    goSoute();
};

function moveCit(citId,fromId,toId,number) {
    let fromBat = getBatById(fromId);
    let toBat = getBatById(toId);
    let citBat = {};
    let citBatId = -1;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && bat.locId === souteId && bat.typeId === citId) {
            citBatId = bat.id;
            citBat = bat;
        }
    });
    if (citBatId >= 0) {
        citBat.citoyens = citBat.citoyens-number;
        if (citBat.citoyens <= 0) {
            citBat.citoyens = 1;
        }
        let unitIndex = unitTypes.findIndex((obj => obj.id == citId));
        conselUnit = unitTypes[unitIndex];
        conselAmmos = ['xxx','xxx','xxx','xxx'];
        conselTriche = true;
        putBat(toBat.tileId,number,0,'',false);
        let newCitBat = getBatByTypeIdAndTileId(citId,toBat.tileId);
        newCitBat.loc = 'trans';
        newCitBat.locId = toBat.id;
        toBat.transIds.push(newCitBat.id);
    }
};

function missionResSingle(resId,number) {
    let res = getResById(resId);
    let dispoRes = getDispoRes(res.name);
    let toBat = getBatById(slId);
    let resSpace = checkResSpace(toBat);
    if (number > dispoRes) {
        number = dispoRes;
    }
    if (number > resSpace) {
        number = resSpace;
    }
    let costs = {};
    costs[res.name] = number;
    moveResCost(costs,souteId,slId,1);
    playerInfos.okFill = true;
    goSoute();
};

function moveResCost(costs,fromId,toId,number) {
    let fromBat = getBatById(fromId);
    let toBat = getBatById(toId);
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let res = getResByName(key);
            if (res.cat != 'alien') {
                if (fromBat.transRes[res.name] === undefined) {
                    fromBat.transRes[res.name] = -1;
                    console.log('tranfert de ressource inexistante !!!!');
                } else {
                    fromBat.transRes[res.name] = fromBat.transRes[res.name]-(value*number);
                }
                if (fromBat.transRes[res.name] <= 0) {
                    delete fromBat.transRes[res.name];
                }
                if (toBat.transRes[res.name] === undefined) {
                    toBat.transRes[res.name] = (value*number);
                } else {
                    toBat.transRes[res.name] = toBat.transRes[res.name]+(value*number);
                }
            }
        });
    }
};

function checkVMTileIds() {
    if (playerInfos.onShip) {
        let allTiles = [];
        zone.forEach(function(tile) {
            if (tile.y >= 25 && tile.y <= 37 && tile.x >= 27 && tile.x <= 35) {
                allTiles.push(tile.id);
            }
        });
        let occupiedVMTiles = [];
        bataillons.forEach(function(bat) {
            if (bat.loc === 'zone') {
                occupiedVMTiles.push(bat.tileId);
                bat.vmt = bat.tileId;
            } else {
                let batType = getBatType(bat);
                if (batType.skills.includes('prefab') && !batType.skills.includes('noshow')) {
                    if (bat.vmt != undefined) {
                        if (bat.vmt >= 0) {
                            if (occupiedVMTiles.includes(bat.vmt)) {
                                bat.vmt = -1;
                            } else {
                                occupiedVMTiles.push(bat.vmt);
                            }
                        } else {
                            bat.vmt = -1;
                        }
                    } else {
                        bat.vmt = -1;
                    }
                }
            }
        });
        let freeTiles = allTiles.filter(function(el) {
            return !occupiedVMTiles.includes(el);
        });
        bataillons.forEach(function(bat) {
            if (bat.vmt != undefined) {
                if (bat.vmt === -1) {
                    let batType = getBatType(bat);
                    if (batType.skills.includes('prefab') && !batType.skills.includes('noshow')) {
                        bat.vmt = freeTiles[0];
                        freeTiles.shift();
                    }
                }
            }
        });
    }
};
