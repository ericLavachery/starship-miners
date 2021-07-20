function savePlayerInfos() {
    playerInfos.numHTiles = numHTiles;
    playerInfos.numVTiles = numVTiles;
    socket.emit('save-playerInfos', playerInfos);
};

function saveMap() {
    // showedTilesReset();
    socket.emit('save-map',zone);
    commandes();
};

function saveAliens() {
    socket.emit('save-aliens',aliens);
};

function saveBataillons() {
    socket.emit('save-bataillons',bataillons);
};

function getNextZoneNumber() {
    let idz = [];
    let i = 1;
    while (i <= 250) {
        idz.push(i);
        if (i > 300) {break;}
        i++
    }
    zoneFiles.forEach(function(zoneNumber) {
        if (idz.includes(zoneNumber)) {
            idzIndex = idz.indexOf(zoneNumber);
            idz.splice(idzIndex,1);
        }
    });
    return idz[0];
};

function saveMapAs(zoneNumber) {
    let nextZoneNum = zoneNumber;
    if (zoneNumber >= 900) {
        nextZoneNum = getNextZoneNumber();
    }
    zone[0].number = nextZoneNum;
    if (!zoneFiles.includes(nextZoneNum)) {
        zoneFiles.push(nextZoneNum);
    }
    savePlayerInfos();
    socket.emit('save-map-as',[zone,nextZoneNum]);
    aliens = [];
    socket.emit('save-aliens-as',[aliens,nextZoneNum]);
    bataillons = [];
    socket.emit('save-bataillons-as',[bataillons,nextZoneNum]);
    showMap(zone,true);
    commandes();
};

function saveNewMap() {
    let nextZoneNum = getNextZoneNumber();
    zone[0].number = nextZoneNum;
    if (!zoneFiles.includes(nextZoneNum)) {
        zoneFiles.push(nextZoneNum);
    }
    // savePlayerInfos();
    socket.emit('save-map-as',[zone,nextZoneNum]);
    let newMapAliens = [];
    socket.emit('save-aliens-as',[newMapAliens,nextZoneNum]);
    let newMapBataillons = [];
    socket.emit('save-bataillons-as',[newMapBataillons,nextZoneNum]);
    // showMap(zone,true);
    commandes();
};

function saveCurrentZoneAs(zoneNumber) {
    let nextZoneNum = zoneNumber;
    if (zoneNumber >= 900) {
        nextZoneNum = getNextZoneNumber();
    }
    zone[0].number = nextZoneNum;
    if (!zoneFiles.includes(nextZoneNum)) {
        zoneFiles.push(nextZoneNum);
    }
    // savePlayerInfos();
    socket.emit('save-map-as',[zone,nextZoneNum]);
    socket.emit('save-aliens-as',[aliens,nextZoneNum]);
    socket.emit('save-bataillons-as',[bataillons,nextZoneNum]);
    // showMap(zone,true);
    commandes();
};

function saveMapForReturn() {
    let zoneNum = zone[0].number;
    // savePlayerInfos();
    if (playerInfos.mapTurn < 50) {
        zone[0].mapDiff = zone[0].mapDiff+1;
    }
    atomsColors(zone);
    socket.emit('save-map-as',[zone,zoneNum]);
    saveAliensForReturn(zoneNum);
    saveBataillonsForReturn(zoneNum);
    // showMap(zone,true);
    commandes();
};

function saveAliensForReturn(zoneNum) {
    deadAliensList = [];
    aliens.forEach(function(bat) {
        let batType = getBatType(bat);
        bat.creaTurn = 0;
        if (batType.moveCost >= 90) {
            if (batType.name === 'Coque') {
                if (rand.rand(1,100) <= 20) {
                    alienMorph(bat,'Volcan',false);
                } else {
                    deadAliensList.push(bat.id);
                }
            }
            if (batType.name === 'Cocon') {
                deadAliensList.push(bat.id);
            }
            if (batType.name === 'Oeuf voilé' || batType.name === 'Oeuf') {
                if (rand.rand(1,100) <= 20) {
                    alienMorph(bat,'Flaque',false);
                } else {
                    deadAliensList.push(bat.id);
                }
            }
            if (batType.name === 'Vomissure') {
                deadAliensList.push(bat.id);
            }
            if (batType.name === 'Ruche' && rand.rand(1,100) <= 75) {
                deadAliensList.push(bat.id);
            }
            if (batType.name === 'Volcan' && rand.rand(1,100) <= 75) {
                deadAliensList.push(bat.id);
            }
            if (batType.name === 'Flaque' && rand.rand(1,100) <= 10) {
                alienMorph(bat,'Oeuf',false);
            }
        } else {
            deadAliensList.push(bat.id);
        }
    });
    killAlienList();
    socket.emit('save-aliens-as',[aliens,zoneNum]);
};

function saveBataillonsForReturn(zoneNum) {
    bataillons.forEach(function(bat) {
        bat.creaTurn = 0;
        if (bat.loc === 'trans') {
            let transBat = getBatById(bat.locId);
            if (transBat.fuzz <= -2) {
                bat.fuzz = -2;
            } else {
                bat.fuzz = batType.fuzz;
            }
        }
    });
    deadBatsList = [];
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        bat.creaTurn = 0;
        if (bat.fuzz > -2) {
            deadBatsList.push(bat.id);
        } else {
            if (batType.cat != 'buildings' && batType.cat != 'devices' && bat.loc === 'zone') {
                if (rand.rand(1,100) <= 15) {
                    deadBatsList.push(bat.id);
                }
            }
        }
    });
    killBatList();
    socket.emit('save-bataillons-as',[bataillons,zoneNum]);
};

function saveAllBats() {
    saveBataillons();
    saveAliens();
    savePlayerInfos();
    commandes();
};

function saveGame() {
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            bat.xp = bat.xp.toFixedNumber(2);
            bat.apLeft = bat.apLeft.toFixedNumber(1);
        }
    });
    saveBataillons();
    saveAliens();
    savePlayerInfos();
    saveMap();
    commandes();
};

function compReset() {
    playerInfos.comp = resetComp();
    commandes();
    gangEdit();
};

function alienReset() {
    aliens = [];
    showMap(zone,false);
};

function deleteZones() {
    socket.emit('reset-zones','');
    zoneFiles = [];
    savePlayerInfos();
};

function newGame() {
    bataillons = [];
    saveBataillons();
    aliens = [];
    saveAliens();
    resetPlayerInfos();
    playerInfos.showedTiles = [1830];
    playerInfos.comp = resetComp();
    playerInfos.onShip = true;
    playerInfos.gang = 'rednecks';
    playerInfos.gangDef = false;
    playerInfos.gLevel = -1;
    playerInfos.allCits = 2000;
    playerInfos.missionZone = -1;
    playerInfos.sondeDanger = -1;
    playerInfos.sondePlanet = -1;
    playerInfos.crime = 0;
    playerInfos.vitals = 0;
    playerInfos.nextId = 1;
    playerInfos.allTurns = 0;
    playerInfos.zoneDB = [];
    playerInfos.resFlags = [];
    playerInfos.notes = [];
    resetReserve();
    resetStartRes();
    resetEndRes();
    resetVMRes();
    deleteZones();
    generateVM();
    showMap(zone,false);
    miniOut();
    commandes();
};

function mapReset() {
    bataillons = [];
    saveBataillons();
    aliens = [];
    saveAliens();
    resetPlayerInfos();
    playerInfos.showedTiles = [1830];
    resetReserve();
    resetStartRes();
    resetEndRes();
    showMap(zone,false);
    commandes();
    $("#reset2").css("display","none");
    $("#reset1").css("display","inline-block");
};

function mapSoftReset() {
    resetPlayerInfos();
    resetReserve();
    resetStartRes();
    resetEndRes();
    showMap(zone,false);
    commandes();
};

function resetPlayerInfos() {
    playerInfos.mapAdjDiff = playerInfos.sondeDanger;
    playerInfos.mapTurn = 0;
    playerInfos.mapDrop = 0;
    playerInfos.cocons = 0;
    playerInfos.fndComps = 0;
    playerInfos.fndUnits = 0;
    playerInfos.fndCits = 0;
    playerInfos.sondeMaps = 0;
    playerInfos.eggPause = false;
    playerInfos.droppedEggs = 0;
    playerInfos.knownAliens = [];
    playerInfos.aliensKilled = 0;
    playerInfos.eggsKilled = 0;
    playerInfos.alienSat = 0;
    playerInfos.unitsLost = 0;
    playerInfos.fuzzTotal = 0;
    playerInfos.pauseSeed = rand.rand(1,8);
    playerInfos.res = {};
    playerInfos.alienRes = {};
    playerInfos.myCenter = 1830;
    playerInfos.undarkOnce = [];
    playerInfos.bldList = [];
};

function showMapReset() {
    commandes();
    $("#reset1").css("display","none");
    $("#reset2").css("display","inline-block");
};

function resetReserve() {
    resTypes.forEach(function(res) {
        playerInfos.reserve[res.name] = 0;
    });
};

function resetEndRes() {
    playerInfos.endRes = {};
    let sortedResTypes = _.sortBy(resTypes,'name');
    sortedResTypes.forEach(function(res) {
        playerInfos.endRes[res.name] = 0;
    });
    playerInfos.endRes['Citoyens'] = 0;
};

function resetStartRes() {
    resTypes.forEach(function(res) {
        playerInfos.startRes[res.name] = 0;
    });
    playerInfos.startRes['Citoyens'] = 0;
};

function resetVMRes() {
    resTypes.forEach(function(res) {
        playerInfos.vmRes[res.name] = 0;
    });
    playerInfos.vmRes['Citoyens'] = 0;
};

function resetWeekRes() {
    resTypes.forEach(function(res) {
        playerInfos.weekRes[res.name] = 0;
    });
};

function modWeekRes(resName,number) {
    playerInfos.weekRes[resName] = playerInfos.weekRes[resName]+number;
};

function modWeekMulti(costs) {
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            modWeekRes(key,0-value);
        });
    }
};

function voirZones() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="constName or" id="gentils">CHARGER UNE ZONE</span><br>');
    $('#conUnitList').append('<br>');
    zoneFiles.forEach(function(zoneId) {
        $('#conUnitList').append('<span class="paramName cy klik" onclick="loadZone('+zoneId+')">Charger</span><span class="paramIcon rose"><i class="fas fa-map"></i></span><span class="paramValue">Zone '+zoneId+'</span><br>');
    });
};

function loadZone(zoneId) {
    socket.emit('load-saved-map',zoneId);
};

function loadZonePreview(zoneId) {
    socket.emit('load-zone-preview',zoneId);
};
