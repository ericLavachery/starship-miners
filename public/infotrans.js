function transInfos(bat,batType) {
    // console.log('transInfos');
    let isCharged = checkCharged(bat,'trans');
    let transId = checkTransportId(bat,batType);
    let apCost = 2;
    if (transId >= 0) {
        if (!isCharged) {
            let transBat = getBatById(transId);
            let transBatType = getBatType(transBat);
            let resLoad = checkResLoad(selectedBat);
            if (resLoad >= 1 && transBatType.skills.includes('transorbital')) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer et jeter les ressources (Pas d\'embarquement si votre bataillon a des ressources embarquées)" class="boutonGris skillButtons" onclick="embarquement('+transId+',true)"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer et jeter</h4></span>');
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ne pas embarquer (Pas d\'embarquement si votre bataillon a des ressources embarquées)" class="boutonGris skillButtons" onclick="noEmbarq()"><i class="fas fa-truck"></i> <span class="small">0</span></button>&nbsp; Ne pas embarquer</h4></span>');
            } else {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer dans '+transBat.type+'" class="boutonGris skillButtons" onclick="embarquement('+transId+',false)"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
            }
        } else {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Pas d\'embarquement si votre bataillon a lui-même un bataillon embarqué" class="boutonGris skillButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
        }
    } else {
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ce bataillon n\'a pas les moyens de vous embarquer" class="boutonGris skillButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
    }
};

function noEmbarq() {
    $('#unitInfos').empty();
    selectMode();
    batUnstack();
    batUnselect();
};

function unloadInfos(myBat,myBatUnitType) {
    let balise = 'h4';
    let damageIcon = '';
    let tagsIcon = '';
    let batAPLeft = 0;
    if (myBat.transIds != undefined) {
        if (myBat.transIds.length >= 1) {
            $('#unitInfos').append('<hr>');
            let apCost = 0;
            bataillons.forEach(function(bat) {
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
                    balise = 'h4';
                    if (Object.keys(batDebarq).length >= 1) {
                        if (batDebarq.id === bat.id) {
                            balise = 'h3';
                        }
                    }
                    batAPLeft = Math.floor(bat.apLeft);
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Débarquer '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+') '+batAPLeft+' PA" class="boutonGris skillButtons" onclick="debarquement('+bat.id+')"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonBleu skillButtons" onclick="unitDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batType.name+damageIcon+maladieIcon+poisonIcon+'</'+balise+'></span>');
                }
            });
        }
    }
};

function calcVolume(bat,batType) {
    let batVolume;
    if (bat.citoyens >= 1) {
        batVolume = Math.round(bat.citoyens*2.4);
    } else {
        batVolume = Math.round(batType.size*batType.squadSize*batType.squads/4*Math.sqrt(batType.size+13)*batType.volume);
    }
    if (bat.eq === 'jetpack') {
        batVolume = Math.ceil(batVolume*1.2);
    }
    // if (playerInfos.comp.log >= 3) {
    //     batVolume = Math.round(batVolume*0.85);
    // }
    // if (playerInfos.comp.trans >= 3) {
    //     batVolume = Math.round(batVolume*0.915);
    // }
    return batVolume;
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
    if (myBatType.skills.includes('transorbital') && playerInfos.mapTurn >= 2) {
        myBatTransUnitsLeft = Math.round(myBatTransUnitsLeft*bonusTransRetour);
        let resSpace = checkLanderResSpace(myBat);
        myBatTransUnitsLeft = myBatTransUnitsLeft+Math.round(resSpace/2);
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

function checkLanderResSpace(bat) {
    let batType = getBatType(bat);
    let resLoaded = checkResLoad(bat);
    let resMax = batType.transRes;
    if (bat.eq === 'megafret') {
        resMax = Math.round(resMax*1.25);
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

function embarquement(transId,discardRes) {
    let transIndex = bataillons.findIndex((obj => obj.id == transId));
    let transBat = bataillons[transIndex];
    let transBatType = getBatType(transBat);
    if (selectedBatType.skills.includes('tracked') && transBatType.transMaxSize < 25) {
        transBat.apLeft = transBat.apLeft-4;
    }
    transBat.transIds.push(selectedBat.id);
    selectedBat.apLeft = selectedBat.apLeft-2;
    if (discardRes) {
        selectedBat.transRes = {};
    }
    selectedBat.loc = 'trans';
    selectedBat.locId = transId;
    let batListIndex = batList.findIndex((obj => obj.id == selectedBat.id));
    if (batListIndex > -1) {
        batList.splice(batListIndex,1);
    }
    tagDelete(selectedBat,'guet');
    camoOut();
    selectedBatArrayUpdate();
    showBataillon(transBat);
    batSelect(transBat);
    showBatInfos(selectedBat);
    showTileInfos(selectedBat.tileId);
    selectMode();
};

function debarquement(debId) {
    let debIndex = bataillons.findIndex((obj => obj.id == debId));
    let debBat = bataillons[debIndex];
    selectMode();
    batDebarq = debBat;
    showBatInfos(selectedBat);
};

function clickDebarq(tileId) {
    let tileOK = false;
    let ownBatHere = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            ownBatHere = true;
        }
    });
    let batDebarqType = getBatType(batDebarq);
    let distance = calcDistance(selectedBat.tileId,tileId);
    if (distance <= 1 && !ownBatHere && (terrainAccess(batDebarq.id,tileId) || batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') && !alienOccupiedTiles.includes(tileId)) {
        tileOK = true;
    } else {
        batDebarq = {};
        showBatInfos(selectedBat);
    }
    if (tileOK) {
        if (batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') {
            tagDelete(selectedBat,'loaded');
            selectedBat.apLeft = selectedBat.apLeft-(selectedBatType.mecanoCost*3)-(distance*3);
        } else {
            if (selectedBat.transIds.includes(batDebarq.id)) {
                tagIndex = selectedBat.transIds.indexOf(batDebarq.id);
                selectedBat.transIds.splice(tagIndex,1);
            }
        }
        selectedBatArrayUpdate();
        batUnselect();
        batDebarq.loc = 'zone';
        batDebarq.locId = 0;
        batDebarq.tileId = tileId;
        batDebarq.oldTileId = tileId;
        if (batDebarqType.cat != 'buildings' && batDebarqType.cat != 'devices') {
            batDebarq.apLeft = batDebarq.apLeft-1;
            batDebarq.oldapLeft = batDebarq.apLeft-1;
            if (batDebarq.apLeft < 1) {
                batDebarq.apLeft = 1;
                batDebarq.oldapLeft = 1;
            }
        } else {
            batDebarq.apLeft = batDebarq.ap-Math.round(batDebarqType.fabTime*batDebarq.ap/50);
        }
        showBataillon(batDebarq);
        batSelect(batDebarq);
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
