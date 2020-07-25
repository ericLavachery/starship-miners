function transInfos(bat,batUnitType) {
    console.log('transInfos');
    let isCharged = checkCharged(bat,'trans');
    let transId = checkTransportId(bat,batUnitType);
    if (transId >= 0 && !isCharged) {
        let transIndex = bataillons.findIndex((obj => obj.id == transId));
        let transBatName = bataillons[transIndex].type;
        let apCost;
        apCost = 3;
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer dans '+transBatName+'" class="boutonGris iconButtons" onclick="embarquement('+transId+')"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
    }
};

function unloadInfos(myBat,myBatUnitType) {
    let balise = 'h4';
    let damageIcon = '';
    let tagsIcon = '';
    if (myBat.transIds != undefined) {
        if (myBat.transIds.length >= 1) {
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
                            balise = 'h1';
                        }
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Débarquer '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+') '+bat.apLeft+' PA" class="boutonGris iconButtons" onclick="debarquement('+bat.id+')"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+damageIcon+maladieIcon+poisonIcon+'</'+balise+'></span>');
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
    // vérifie si le transport (en dessous de l'unité) peut la prendre, et retourn son Id
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
    let batWeight;
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId == myBat.id) {
            batType = getBatType(bat);
            batWeight = calcVolume(bat,batType);
            myBatTransUnitsLeft = myBatTransUnitsLeft-batWeight;
        }
    });
    return myBatTransUnitsLeft;
};

function checkTracking(myBat) {
    let tracking = false;
    let myBatType = getBatType(myBat);
    if (myBatType.transMaxSize < 10) {
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

function embarquement(transId) {
    let transIndex = bataillons.findIndex((obj => obj.id == transId));
    let transBat = bataillons[transIndex];
    let transBatType = getBatType(transBat);
    if (selectedBatType.skills.includes('tracked') && transBatType.transMaxSize < 10) {
        transBat.apLeft = transBat.apLeft-4;
    }
    transBat.transIds.push(selectedBat.id);
    selectedBat.apLeft = selectedBat.apLeft-2;
    selectedBat.loc = 'trans';
    selectedBat.locId = transId;
    let batListIndex = batList.findIndex((obj => obj.id == selectedBat.id));
    if (batListIndex > -1) {
        batList.splice(batListIndex,1);
    }
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
    if (isAdjacent(selectedBat.tileId,tileId) && !ownBatHere && (terrainAccess(batDebarq.id,tileId) || batDebarqType.cat === 'buildings') && !alienOccupiedTiles.includes(tileId)) {
        tileOK = true;
    } else {
        batDebarq = {};
        showBatInfos(selectedBat);
    }
    if (tileOK) {
        if (batDebarqType.cat === 'buildings') {
            tagDelete(selectedBat,'loaded');
            selectedBat.apLeft = selectedBat.apLeft-selectedBatType.mecanoCost*4;
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
        if (batDebarqType.cat != 'buildings') {
            batDebarq.apLeft = batDebarq.apLeft-1;
            batDebarq.oldapLeft = batDebarq.apLeft-1;
            if (batDebarq.apLeft < 1) {
                batDebarq.apLeft = 1;
                batDebarq.oldapLeft = 1;
            }
        } else {
            batDebarq.apLeft = batDebarqType.ap-Math.round(batDebarqType.refabTime*batDebarqType.ap/25);
        }
        showBataillon(batDebarq);
        batSelect(batDebarq);
        moveMode();
        if (batDebarqType.cat === 'buildings') {
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
