function savePlayerInfos() {
    playerInfos.numHTiles = numHTiles;
    playerInfos.numVTiles = numVTiles;
    let theDate = new Date().toISOString().slice(0,19).replace('T', ' ');
    theDate = theDate.substring(0,10);
    playerInfos.date = theDate;
    socket.emit('save-playerInfos', playerInfos);
};

function savePlayerLog() {
    playerInfos.numHTiles = numHTiles;
    playerInfos.numVTiles = numVTiles;
    socket.emit('save-playerLog', playerInfos);
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
    let isMission = false;
    if (zone[0].edited != undefined) {
        if (zone[0].edited) {
            isMission = true;
        }
    }
    // savePlayerInfos();
    zone[0].visit = true;
    atomsColors(zone);
    socket.emit('save-map-as',[zone,zoneNum]);
    saveAliensForReturn(zoneNum,isMission);
    saveBataillonsForReturn(zoneNum,isMission);
    // showMap(zone,true);
    commandes();
};

function saveAliensForReturn(zoneNum,isMission) {
    deadAliensList = [];
    aliens.forEach(function(bat) {
        let batType = getBatType(bat);
        bat.creaTurn = 0;
        if (batType.moveCost >= 90) {
            if (batType.name === 'Cocon') {
                deadAliensList.push(bat.id);
            }
            if (batType.name === 'Vomissure') {
                deadAliensList.push(bat.id);
            }
            if (batType.name === 'Ruche') {
                if (rand.rand(1,100) <= 50) {
                    deadAliensList.push(bat.id);
                }
            }
            if (batType.name === 'Volcan') {
                if (rand.rand(1,100) <= 25) {
                    deadAliensList.push(bat.id);
                }
            }
            if (batType.name === 'Flaque') {
                if (rand.rand(1,100) <= 25) {
                    alienMorph(bat,'Vomissure',false);
                }
            }
            if (batType.name === 'Oeuf voilé' || batType.name === 'Oeuf') {
                if (rand.rand(1,100) <= 50) {
                    alienMorph(bat,'Ruche',false);
                } else {
                    deadAliensList.push(bat.id);
                }
            }
            if (batType.name === 'Coque') {
                if (rand.rand(1,100) <= 75) {
                    alienMorph(bat,'Volcan',false);
                } else {
                    deadAliensList.push(bat.id);
                }
            }
        } else {
            deadAliensList.push(bat.id);
        }
    });
    killAlienList();
    socket.emit('save-aliens-as',[aliens,zoneNum]);
};

function saveBataillonsForReturn(zoneNum,isMission) {
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
            if (batType.moveCost >= 90) {
                deadBatsList.push(bat.id);
            } else {
                let safeChance = Math.round(100/batType.size*(batType.stealth+10)/14);
                if (batType.skills.includes('camo')) {
                    safeChance = safeChance*2;
                }
                if (rand.rand(1,100) > safeChance) {
                    deadBatsList.push(bat.id);
                }
            }
        } else {
            if (batType.cat != 'buildings' && batType.cat != 'devices' && bat.loc === 'zone' && batType.transUnits === 0) {
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
    if (playerInfos.pseudo === 'Mapedit') {
        socket.emit('save-edited-map',[zone,bataillons,aliens]);
    }
    testConnect(pseudo);
    commandes();
};

function saveAndReload() {
    saveGame();
    location.reload();
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

function moveMissionZone(theZoneId) {
    socket.emit('move-mission-zone',theZoneId);
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
    playerInfos.onStart = true;
    playerInfos.gang = 'rednecks';
    playerInfos.gangDef = false;
    playerInfos.gLevel = -1;
    playerInfos.allCits = 2200;
    playerInfos.gangXP = 2200;
    playerInfos.sondeDanger = -1;
    playerInfos.sondePlanet = -1;
    playerInfos.crime = 0;
    playerInfos.penit = 0;
    playerInfos.vitals = 0;
    playerInfos.nextId = 1;
    playerInfos.allTurns = 0;
    playerInfos.zoneDB = [];
    playerInfos.resFlags = [];
    playerInfos.notes = [];
    playerInfos.sciRech = 0;
    playerInfos.sci = 0;
    playerInfos.enc = 65;
    playerInfos.encz = [];
    playerInfos.aCanon = 'none';
    playerInfos.cAdj = 0;
    playerInfos.cLoss = 0;
    playerInfos.cNeed = 1;
    // playerInfos.missionZone = -1;
    playerInfos.missionZone = 97;
    playerInfos.okFill = true;
    resetReserve();
    resetStartRes();
    resetEndRes();
    resetVMRes();
    deleteZones();
    // moveMissionZone(97);
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
    playerInfos.enc = 65;
    playerInfos.encz = [];
    playerInfos.mapTurn = 1;
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
    playerInfos.crafts = 0;
    playerInfos.sondeMaps = 0;
    playerInfos.eggPause = false;
    playerInfos.droppedEggs = 0;
    playerInfos.knownAliens = [];
    playerInfos.aliensKilled = 0;
    playerInfos.eggsKilled = 0;
    playerInfos.alienSat = 0;
    playerInfos.unitsLost = 0;
    playerInfos.okFill = false;
    playerInfos.fuzzTotal = 0;
    playerInfos.pauseSeed = rand.rand(1,8);
    playerInfos.randSeed = rand.rand(1,8);
    playerInfos.res = {};
    playerInfos.alienRes = {};
    playerInfos.myCenter = 1830;
    playerInfos.undarkOnce = [];
    playerInfos.bldList = [];
};

function showMapReset() {
    setTimeout(function (){
        commandes();
        $("#reset1").css("display","none");
        $("#reset2").css("display","inline-block");
    }, 1500);
};

function showStartLander() {
    setTimeout(function (){
        commandes();
        $("#takeof1").css("display","none");
        $("#takeof2").css("display","inline-block");
    }, 1500);
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
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or" id="gentils">CHARGER UNE ZONE</span><br>');
    $('#conUnitList').append('<br>');
    zoneFiles.forEach(function(zoneId) {
        $('#conUnitList').append('<span class="paramName cy klik" onclick="loadZone('+zoneId+')">Charger</span><span class="paramIcon rose"><i class="fas fa-map"></i></span><span class="paramValue">Zone '+zoneId+'</span><br>');
    });
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function loadZone(zoneId) {
    socket.emit('load-saved-map',zoneId);
};

function loadZonePreview(zoneId) {
    socket.emit('load-zone-preview',zoneId);
};
