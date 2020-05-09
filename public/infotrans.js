function transInfos(bat,batUnitType) {
    console.log('transInfos');
    let transId = checkTransportId(bat,batUnitType);
    let transIndex = bataillons.findIndex((obj => obj.id == transId));
    let transBatName = bataillons[transIndex].type;
    let apCost;
    if (transId >= 0) {
        apCost = 3;
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer dans '+transBatName+'" class="boutonGris iconButtons" onclick="embarquement('+transId+')"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
    }
};

function unloadInfos(myBat,myBatUnitType) {
    let balise = 'h4';
    if (myBat.transIds != undefined) {
        if (myBat.transIds.length >= 1) {
            let apCost = 0;
            bataillons.forEach(function(bat) {
                if (bat.loc === "trans" && bat.locId == myBat.id) {
                    batType = getBatType(bat);
                    balise = 'h4';
                    if (Object.keys(batDebarq).length >= 1) {
                        if (batDebarq.id === bat.id) {
                            balise = 'h1';
                        }
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Débarquer '+batType.name+'" class="boutonGris iconButtons" onclick="debarquement('+bat.id+')"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Débarquer</'+balise+'></span>');
                }
            });
        }
    }
};

function checkTransportId(myBat,myBatType) {
    let transId = -1;
    let batType;
    let batTransUnitsLeft;
    let myBatWeight = myBatType.size*myBatType.squadSize*myBatType.squads;
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
            batWeight = batType.size*batType.squadSize*batType.squads;
            myBatTransUnitsLeft = myBatTransUnitsLeft-batWeight;
        }
    });
    return myBatTransUnitsLeft;
};

function embarquement(transId) {
    let transIndex = bataillons.findIndex((obj => obj.id == transId));
    let transBat = bataillons[transIndex];
    transBat.transIds.push(selectedBat.id);
    selectedBat.apLeft = selectedBat.apLeft-3;
    selectedBat.loc = 'trans';
    selectedBat.locId = transId;
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
            tagIndex = selectedBat.tags.indexOf(batDebarq.id);
            selectedBat.tags.splice(tagIndex,1);
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
