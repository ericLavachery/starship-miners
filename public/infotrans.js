function transInfos(bat,batType,isCharged) {
    // console.log('transInfos');
    // let isCharged = checkCharged(bat,'trans');
    let underId = checkUnderId(bat,batType);
    let transId = checkTransportId(bat,batType);
    let apCost = 3;
    if (transId >= 0) {
        // Le bataillon en dessous peut embarquer le bataillon actif
        let transBat = getBatById(transId);
        let transBatType = getBatType(transBat);
        let embarqCost = calcEmbarqCost(batType,transBatType);
        apCost = embarqCost[0];
        if (!isCharged) {
            // Le bataillon actif n'a pas de bataillon embarqué
            let resLoad = checkResLoad(selectedBat);
            if (resLoad >= 1 && transBatType.skills.includes('transorbital')) {
                // Le bataillon actif transporte des ressources
                // Embarquement dans un Lander (Jeter les ressources ou ne pas embarquer)
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer et jeter les ressources (Pas d\'embarquement si votre bataillon a des ressources embarquées)" class="boutonRouge skillButtons" onclick="embarquement('+transId+',true)"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer et jeter</h4></span>');
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ne pas embarquer (Pas d\'embarquement si votre bataillon a des ressources embarquées)" class="boutonRouge skillButtons" onclick="noEmbarq()"><i class="fas fa-truck"></i> <span class="small">0</span></button>&nbsp; Ne pas embarquer</h4></span>');
            } else {
                // Embarquement OK (Soit pas de ressources, soit pas dans un Lander)
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer dans '+transBat.type+'" class="boutonMarine skillButtons" onclick="embarquement('+transId+',false)"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
            }
        } else {
            // Le bataillon actif a un bataillon embarqué
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Pas d\'embarquement si votre bataillon a lui-même un bataillon embarqué" class="boutonRouge skillButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
        }
    } else {
        // Le bataillon en dessous ne peut pas embarquer le bataillon actif
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ce bataillon n\'a pas les moyens de vous embarquer" class="boutonGris skillButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
    }
    if (underId >= 0) {
        // Le bataillon actif peut embarquer le bataillon en dessous
        let underBat = getBatById(underId);
        let underBatType = getBatType(underBat);
        apCost = calcRamasseCost(underBat,underBatType,batType);
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer '+underBat.type+'" class="boutonVert skillButtons" onclick="ramassage('+underId+')"><i class="fas fa-wheelchair"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ramasser</h4></span>');
    } else {
        // Le bataillon actif ne peut pas embarquer le bataillon en dessous
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ce bataillon n\'a pas les moyens de vous embarquer" class="boutonGris skillButtons gf"><i class="fas fa-wheelchair"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ramasser</h4></span>');
    }
};

function noEmbarq() {
    $('#unitInfos').empty();
    selectMode();
    batUnstack();
    batUnselect();
};

function nearAnyLander(myBat) {
    let nearLander = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital')) {
                let distance = calcDistance(myBat.tileId,bat.tileId);
                if (distance <= 1) {
                    nearLander = true;
                }
            }
        }
    });
    return nearLander;
};

function unloadInfos(myBat,myBatUnitType) {
    let balise = 'h4';
    let damageIcon = '';
    let tagsIcon = '';
    let moreInfos = '';
    let batAPLeft = 0;
    if (myBat.transIds != undefined) {
        if (myBat.transIds.length >= 1) {
            $('#unitInfos').append('<hr>');
            let apCost = 0;
            let sortedBats = bataillons.slice();
            sortedBats = _.sortBy(_.sortBy(_.sortBy(sortedBats,'id'),'type'),'army');
            sortedBats.reverse();
            sortedBats.forEach(function(bat) {
                if (bat.loc === "trans" && bat.locId == myBat.id) {
                    batType = getBatType(bat);
                    damageIcon = '';
                    if (bat.damage >= 1 || bat.squadsLeft < batType.squads) {
                        damageIcon = ' <i class="ra ra-bleeding-hearts"></i>'
                    }
                    poisonIcon = '';
                    if (bat.tags.includes('parasite') || bat.tags.includes('venin') || bat.tags.includes('poison')) {
                        poisonIcon = ' <i class="fas fa-skull-crossbones"></i>'
                    }
                    maladieIcon = '';
                    if (bat.tags.includes('maladie')) {
                        maladieIcon = ' <i class="fas fa-thermometer"></i>'
                    }
                    moreInfos = '';
                    if (bat.chief != undefined) {
                        if (bat.chief != '') {
                            moreInfos = moreInfos+bat.chief+' ';
                        }
                    }
                    let myAmmo1 = showAmmo(bat.ammo,true);
                    moreInfos = moreInfos+'('+myAmmo1+'&middot;';
                    let myAmmo2 = showAmmo(bat.ammo2,true);
                    moreInfos = moreInfos+myAmmo2+')';
                    balise = 'h4';
                    if (Object.keys(batDebarq).length >= 1) {
                        if (batDebarq.id === bat.id) {
                            balise = 'h3';
                        }
                    }
                    let batPic = getBatPic(bat,batType);
                    batAPLeft = Math.floor(bat.apLeft);
                    let butCol = 'boutonMarine';
                    if (batAPLeft < 1) {
                        butCol = 'boutonGris gf';
                    } else if (batAPLeft < 7) {
                        butCol = 'boutonGris';
                    }
                    let ready = true;
                    if (batType.skills.includes('prefab') && bat.apLeft <= 0) {
                        ready = false;
                    }
                    let mayOut = checkMayOut(batType);
                    if (myBatUnitType.skills.includes('transorbital') && (batType.id === 126 || batType.id === 225)) {
                        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Vous ne pouvez pas débarquer des citoyens d\'un vaisseau" class="boutonGris skillButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonGris skillButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batType.name+damageIcon+maladieIcon+poisonIcon+'</'+balise+'></span>');
                    } else if (bat.tags.includes('nomove')) {
                        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Vous ne pouvez pas débarquer ce bataillon" class="boutonGris skillButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonGris skillButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batType.name+damageIcon+maladieIcon+poisonIcon+'</'+balise+'></span>');
                    } else if (!mayOut) {
                        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Vous ne pouvez pas débarquer ce bataillon sur cette planète" class="boutonGris skillButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonGris skillButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batType.name+damageIcon+maladieIcon+poisonIcon+'</'+balise+'></span>');
                    } else if (!ready) {
                        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Vous ne pouvez pas reconstruire un bâtiment qui n\'a plus de PA" class="boutonGris skillButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonGris skillButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batType.name+damageIcon+maladieIcon+poisonIcon+'</'+balise+'></span>');
                    } else {
                        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Débarquer '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+') '+batAPLeft+' PA '+moreInfos+'" class="'+butCol+' skillButtons" onclick="debarquement('+bat.id+')"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="32" class="dunit" onclick="batDetail('+bat.id+')" title="Détail du bataillon">&nbsp; '+batType.name+damageIcon+maladieIcon+poisonIcon+'</'+balise+'></span>');
                    }
                }
            });
        }
    }
};

function checkMayOut(batType) {
    let mayOut = true;
    if (zone[0].planet === 'Kzin' && playerInfos.comp.scaph < 2) {
        mayOut = false;
        if (batType.cat === 'buildings') {
            mayOut = true;
        }
        if (batType.cat === 'devices' && batType.crew === 0) {
            mayOut = true;
        }
        if (batType.cat === 'vehicles') {
            if (batType.skills.includes('kzin') || batType.skills.includes('transorbital') || batType.skills.includes('robot')) {
                mayOut = true;
            }
        }
        if (batType.cat === 'infantry') {
            if (batType.skills.includes('kzin') || batType.skills.includes('mutant')) {
                mayOut = true;
            }
        }
    }
    return mayOut;
};

function calcVolume(bat,batType) {
    let batVolume;
    if (Object.keys(batType).length >= 1) {
        if (batType.skills.includes('prefab')) {
            batVolume = Math.round(batType.squadSize*batType.squads*batType.crew*2.4);
        } else if (bat.citoyens >= 1 && batType.skills.includes('varsquad')) {
            batVolume = Math.round(bat.citoyens*2.4);
        } else {
            batVolume = Math.round(batType.size*batType.squadSize*batType.squads/4*Math.sqrt(batType.size+13)*batType.volume);
        }
        if (bat.eq === 'e-jetpack') {
            batVolume = Math.ceil(batVolume*1.2);
        }
        if (bat.eq === 'kit-garde' || bat.eq === 'kit-sentinelle') {
            batVolume = Math.ceil(batVolume*1.33);
        }
        if (bat.eq === 'kit-artilleur') {
            batVolume = Math.ceil(batVolume*1.33);
        }
        if (bat.eq === 'kit-guetteur') {
            batVolume = Math.ceil(batVolume*1.33);
        }
        if (bat.eq === 'kit-pompiste') {
            batVolume = Math.ceil(batVolume*1.22);
        }
        return batVolume;
    }
};

function calcUnitVolume(batType) {
    let batVolume;
    if (Object.keys(batType).length >= 1) {
        if (batType.skills.includes('prefab')) {
            batVolume = Math.round(batType.squadSize*batType.squads*batType.crew*2.4);
        } else if (batType.skills.includes('varsquad')) {
            batVolume = Math.round(72*2.4);
        } else {
            batVolume = Math.round(batType.size*batType.squadSize*batType.squads/4*Math.sqrt(batType.size+13)*batType.volume);
        }
        return batVolume;
    }
};

function checkCharged(myBat,where) {
    let isCharged = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === where && bat.locId == myBat.id) {
            isCharged = true;
        }
    });
    return isCharged;
};

function checkUnderId(myBat,myBatType) {
    // vérifie si l'unité en dessous peut être ramassée par l'unité active, et retourne son Id
    let underId = -1;
    let myBatTransUnitsLeft = calcTransUnitsLeft(myBat,myBatType);
    let tracking = checkTracking(myBat);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.tileId == myBat.tileId) {
            let batType = getBatType(bat);
            if (batType.cat != 'buildings' && batType.cat != 'devices' && batType.moveCost < 90 && !bat.tags.includes('nomove')) {
                if (myBatType.transMaxSize >= batType.size) {
                    if (!batType.skills.includes('tracked') || !tracking) {
                        let batWeight = calcVolume(bat,batType);
                        if (batWeight <= myBatTransUnitsLeft) {
                            let isCharged = checkCharged(bat,'trans');
                            if (!isCharged) {
                                underId = bat.id;
                            }
                        }
                    }
                }
            }
        }
    });
    return underId;
}

function checkTransportId(myBat,myBatType) {
    // vérifie si le transport (en dessous de l'unité) peut la prendre, et retourne son Id
    let transId = -1;
    let batType;
    let batTransUnitsLeft;
    let myBatWeight = calcVolume(myBat,myBatType);
    let tracking;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.tileId == myBat.tileId) {
            batType = getBatType(bat);
            if (batType.transMaxSize >= myBatType.size) {
                tracking = checkTracking(bat);
                if (!myBatType.skills.includes('tracked') || !tracking) {
                    batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                    if (myBatWeight <= batTransUnitsLeft) {
                        transId = bat.id;
                    }
                }
            }
        }
    });
    return transId;
};

function calcTransUnitsLeft(myBat,myBatType) {
    let myBatTransUnitsLeft = myBatType.transUnits;
    if (myBat.eq === 'megatrans') {
        myBatTransUnitsLeft = Math.round(myBatTransUnitsLeft*1.25);
    }
    if (myBatType.skills.includes('transorbital') && playerInfos.mapTurn >= 2) {
        myBatTransUnitsLeft = Math.round(myBatTransUnitsLeft*bonusTransRetour);
        let resSpace = checkLanderResSpace(myBat);
        myBatTransUnitsLeft = myBatTransUnitsLeft+Math.round(resSpace/2);
    }
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId == myBat.id) {
            let batType = getBatType(bat);
            let batWeight = calcVolume(bat,batType);
            myBatTransUnitsLeft = myBatTransUnitsLeft-batWeight;
        }
    });
    // console.log('myBatTransUnitsLeft'+myBatTransUnitsLeft);
    return myBatTransUnitsLeft;
};

function checkLanderResSpace(bat) {
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
    if (resSpace < 0) {
        resSpace = 0;
    }
    return resSpace;
};

function checkTracking(myBat) {
    let tracking = false;
    let myBatType = getBatType(myBat);
    if (myBatType.transMaxSize < 25) {
        bataillons.forEach(function(bat) {
            if (bat.loc === "trans" && bat.locId == myBat.id) {
                batType = getBatType(bat);
                if (batType.skills.includes('tracked')) {
                    tracking = true;
                }
            }
        });
    }
    return tracking;
};

function calcRamasseCost(bat,batType,transBatType) {
    let ramasseCost = 0;
    ramasseCost = ramasseCost+3-playerInfos.comp.trans;
    let batWeight = calcVolume(bat,batType);
    let transBatCrew = transBatType.squads*transBatType.squadSize*transBatType.crew;
    if (transBatCrew === 0) {
        transBatCrew = transBatType.squads*transBatType.squadSize;
    }
    let crewCost = Math.round(batWeight/transBatCrew/2.5);
    if (crewCost < 1) {
        crewCost = 1;
    }
    if (crewCost > 6) {
        crewCost = 6;
    }
    ramasseCost = ramasseCost+crewCost;
    if (batType.skills.includes('tracked') && transBatType.transMaxSize < 25) {
        ramasseCost = ramasseCost+4-playerInfos.comp.log;
    }
    if (transBatType.skills.includes('hardembark')) {
        ramasseCost = ramasseCost+4;
    }
    if (transBatType.skills.includes('ouvert')) {
        ramasseCost = ramasseCost-4;
    }
    if (ramasseCost < 0) {
        ramasseCost = 0;
    }
    return ramasseCost;
}

function calcEmbarqCost(batType,transBatType) {
    let embarqCost = [0,0];
    embarqCost[0] = embarqCost[0]+3-playerInfos.comp.trans;
    if (batType.skills.includes('tracked') && transBatType.transMaxSize < 25) {
        embarqCost[1] = embarqCost[1]+4-playerInfos.comp.log;
    }
    if (transBatType.skills.includes('hardembark')) {
        embarqCost[0] = embarqCost[0]+3;
        embarqCost[1] = embarqCost[1]+3;
    }
    return embarqCost;
}

function ramassage(underId) {
    let underBat = getBatById(underId);
    let underBatType = getBatType(underBat);
    if (!playerInfos.onShip) {
        let ramasseCost = calcRamasseCost(underBat,underBatType,selectedBatType);
        selectedBat.apLeft = selectedBat.apLeft-ramasseCost;
    }
    loadBat(underBat.id,selectedBat.id);
    doneAction(selectedBat);
    tagDelete(underBat,'guet');
    camoOut();
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showTileInfos(selectedBat.tileId);
};

function embarquement(transId,discardRes) {
    let transBat = getBatById(transId);
    let transBatType = getBatType(transBat);
    if (!playerInfos.onShip) {
        let embarqCost = calcEmbarqCost(selectedBatType,transBatType);
        transBat.apLeft = transBat.apLeft-embarqCost[1];
        selectedBat.apLeft = selectedBat.apLeft-embarqCost[0];
    }
    if (discardRes) {
        selectedBat.transRes = {};
    }
    loadBat(selectedBat.id,transBat.id);
    doneAction(transBat);
    tagDelete(selectedBat,'guet');
    camoOut();
    stopAutoLoad();
    selectedBatArrayUpdate();
    showBataillon(transBat);
    batSelect(transBat);
    showBatInfos(selectedBat);
    showTileInfos(selectedBat.tileId);
    selectMode();
};

function debarquement(debId) {
    let debBat = getBatById(debId);
    selectMode();
    batDebarq = debBat;
    cursorSwitch('.','grid-item','thor');
    showBatInfos(selectedBat);
};

function clickDebarq(tileId) {
    let tileOK = false;
    let ownBatHere = false;
    let message = '';
    let batDebarqType = getBatType(batDebarq);
    let myBatWeight = calcVolume(batDebarq,batDebarqType);
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            let batType = getBatType(bat);
            if (batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') {
                ownBatHere = true;
                message = 'Vous ne pouvez pas mettre un bâtiment dans un autre bâtiment.';
            } else if (batDebarq.apLeft < 1 && !batType.skills.includes('transorbital')) {
                ownBatHere = true;
                message = 'Il ne vous reste pas assez de PA.';
            } else if (!batType.skills.includes('transport')) {
                ownBatHere = true;
                message = 'Le bataillon de destination ne peut pas acceuillir de troupes.';
            } else {
                if (batType.transMaxSize < batDebarqType.size) {
                    ownBatHere = true;
                    message = 'Le taille de votre bataillon ('+batDebarqType.size+') est trop élevée pour le bataillon de destination ('+batType.transMaxSize+').';
                } else {
                    let batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                    if (myBatWeight > batTransUnitsLeft) {
                        ownBatHere = true;
                        message = 'Il n\'y a plus assez de place dans le bataillon de destination.';
                    }
                }
            }
        }
    });
    let distance = calcDistance(selectedBat.tileId,tileId);
    if ((distance <= 1 || playerInfos.onShip) && !ownBatHere && (terrainAccess(batDebarq.id,tileId) || batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') && !alienOccupiedTiles.includes(tileId)) {
        tileOK = true;
    } else {
        batDebarq = {};
        showBatInfos(selectedBat);
        warning('Débarquement avorté','Vous ne pouvez pas débarquer ce bataillon à cet endroit. '+message);
    }
    if (tileOK) {
        if (batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') {
            tagDelete(selectedBat,'loaded');
            if (!playerInfos.onShip) {
                let apCost = prefabCost(selectedBatType,batDebarqType,false);
                selectedBat.apLeft = selectedBat.apLeft-apCost;
                selectedBat.xp = selectedBat.xp+(Math.sqrt(batDebarqType.fabTime)/20);
            }
        } else {
            if (selectedBat.transIds.includes(batDebarq.id)) {
                tagIndex = selectedBat.transIds.indexOf(batDebarq.id);
                selectedBat.transIds.splice(tagIndex,1);
            }
        }
        batDebarq.loc = 'zone';
        batDebarq.locId = 0;
        batDebarq.tileId = tileId;
        if (selectedBat.tileId > -1) {
            batDebarq.oldTileId = selectedBat.tileId;
        } else {
            batDebarq.oldTileId = tileId;
        }
        console.log('oldTileId='+selectedBat.tileId);
        doneAction(selectedBat);
        selectedBatArrayUpdate();
        batUnselect();
        if (batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') {
            if (!playerInfos.onShip) {
                let apCost = Math.round(batDebarqType.fabTime*batDebarq.ap/20);
                if (batDebarqType.cat === 'devices') {
                    apCost = Math.ceil(apCost/3);
                }
                batDebarq.apLeft = batDebarq.ap-apCost;
                if (batDebarq.apLeft < 0-Math.round(batDebarqType.ap*1.5)) {
                    batDebarq.apLeft = 0-Math.round(batDebarqType.ap*1.5);
                }
            }
        }
        showBataillon(batDebarq);
        batSelect(batDebarq,true);
        moveMode();
        if (batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') {
            moveSelectedBat(tileId,true,false);
        } else {
            moveSelectedBat(tileId,false,false);
        }
        moveInfos(selectedBat,false);
        showBatInfos(selectedBat);
        showTileInfos(selectedBat.tileId);
        batDebarq = {};
    }
};
