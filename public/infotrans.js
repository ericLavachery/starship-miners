function transInfos(bat,batUnitType) {
    console.log('transInfos');
    let isCharged = checkCharged(bat);
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
                    tagsIcon = '';
                    if (bat.tags.includes('maladie') || bat.tags.includes('parasite') || bat.tags.includes('venin') || bat.tags.includes('poison')) {
                        tagsIcon = ' <i class="fas fa-skull-crossbones"></i>'
                    }
                    balise = 'h4';
                    if (Object.keys(batDebarq).length >= 1) {
                        if (batDebarq.id === bat.id) {
                            balise = 'h1';
                        }
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Débarquer '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+') '+bat.apLeft+' PA" class="boutonGris iconButtons" onclick="debarquement('+bat.id+')"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+damageIcon+tagsIcon+'</'+balise+'></span>');
                }
            });
        }
    }
};

function calcVolume(batType) {
    return Math.round(batType.size*batType.squadSize*batType.squads/4*Math.sqrt(batType.size+13)*batType.volume);
};

function checkCharged(myBat) {
    let isCharged = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId == myBat.id) {
            isCharged = true;
        }
    });
    return isCharged;
};

function checkTransportId(myBat,myBatType) {
    let transId = -1;
    let batType;
    let batTransUnitsLeft;
    let myBatWeight = calcVolume(myBatType);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.tileId == myBat.tileId) {
            batType = getBatType(bat);
            if (batType.transMaxSize >= myBatType.size) {
                batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                if (myBatWeight <= batTransUnitsLeft) {
                    transId = bat.id;
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
            batWeight = calcVolume(batType);
            myBatTransUnitsLeft = myBatTransUnitsLeft-batWeight;
        }
    });
    return myBatTransUnitsLeft;
};

function embarquement(transId) {
    let transIndex = bataillons.findIndex((obj => obj.id == transId));
    let transBat = bataillons[transIndex];
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
    if (isAdjacent(selectedBat.tileId,tileId) && !ownBatHere && terrainAccess(batDebarq.id,tileId) && !alienOccupiedTiles.includes(tileId)) {
        tileOK = true;
    } else {
        batDebarq = {};
        showBatInfos(selectedBat);
    }
    if (tileOK) {
        if (selectedBat.transIds.includes(batDebarq.id)) {
            tagIndex = selectedBat.transIds.indexOf(batDebarq.id);
            selectedBat.transIds.splice(tagIndex,1);
        }
        selectedBatArrayUpdate();
        batUnselect();
        batDebarq.loc = 'zone';
        batDebarq.locId = 0;
        batDebarq.tileId = tileId;
        batDebarq.oldTileId = tileId;
        batDebarq.apLeft = batDebarq.apLeft-1;
        batDebarq.oldapLeft = batDebarq.apLeft-1;
        if (batDebarq.apLeft < 1) {
            batDebarq.apLeft = 1;
            batDebarq.oldapLeft = 1;
        }
        showBataillon(batDebarq);
        batSelect(batDebarq);
        moveMode();
        moveSelectedBat(tileId,false,false);
        moveInfos(selectedBat,false);
        showBatInfos(selectedBat);
        showTileInfos(selectedBat.tileId);
        batDebarq = {};
    }
};
