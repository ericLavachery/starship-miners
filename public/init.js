Number.prototype.toFixedNumber = function(digits, base){
  var pow = Math.pow(base||10, digits);
  return Math.round(this*pow) / pow;
}

$(document).on("dragstart", function() {
     return false;
});

// Player
socket.on('playerInfos-Load', function(pi) {
    playerInfos = pi;
    if (playerInfos.numHTiles > 1 && playerInfos.numVTiles > 1) {
        numHTiles = playerInfos.numHTiles;
        numVTiles = playerInfos.numVTiles;
    }
    if (playerInfos.onShip === undefined) {
        playerInfos.onShip = true;
    }
    if (playerInfos.clouds === undefined) {
        playerInfos.clouds = true;
    }
    if (playerInfos.comp === undefined) {
        playerInfos.comp = resetComp();
    }
    if (playerInfos.weekRes === undefined) {
        playerInfos.weekRes = {};
    }
    if (playerInfos.vmRes === undefined) {
        playerInfos.vmRes = {};
    }
    if (playerInfos.teleRes === undefined) {
        playerInfos.teleRes = {};
    }
    if (playerInfos.reserve === undefined) {
        playerInfos.reserve = {};
    }
    if (playerInfos.startRes === undefined) {
        playerInfos.startRes = {};
    }
    if (playerInfos.endRes === undefined) {
        playerInfos.endRes = {};
    }
    if (playerInfos.sondeMaps === undefined) {
        playerInfos.sondeMaps = 0;
    }
    if (playerInfos.sondePlanet === undefined) {
        playerInfos.sondePlanet = -1;
    }
    if (playerInfos.sondeDanger === undefined) {
        playerInfos.sondeDanger = -1;
    }
    if (playerInfos.okFill === undefined) {
        playerInfos.okFill = false;
    }
    if (playerInfos.cocons === undefined) {
        playerInfos.cocons = 0;
    }
    if (playerInfos.eggPause === undefined) {
        playerInfos.eggPause = false;
    }
    if (playerInfos.droppedEggs === undefined) {
        playerInfos.droppedEggs = 0;
    }
    if (playerInfos.mapAdjDiff === undefined) {
        playerInfos.mapAdjDiff = playerInfos.sondeDanger;
    }
    if (playerInfos.knownAliens === undefined) {
        playerInfos.knownAliens = [];
    }
    if (playerInfos.aliensKilled === undefined) {
        playerInfos.aliensKilled = 0;
    }
    if (playerInfos.eggsKilled === undefined) {
        playerInfos.eggsKilled = 0;
    }
    if (playerInfos.alienSat === undefined) {
        playerInfos.alienSat = 0;
    }
    if (playerInfos.unitsLost === undefined) {
        playerInfos.unitsLost = 0;
    }
    if (playerInfos.pauseSeed === undefined) {
        playerInfos.pauseSeed = rand.rand(1,8);
    }
    if (playerInfos.alienRes === undefined) {
        playerInfos.alienRes = {};
    }
    if (playerInfos.showedTiles === undefined) {
        playerInfos.showedTiles = [1830];
    }
    if (playerInfos.myCenter === undefined) {
        playerInfos.myCenter = 1830;
    }
    if (playerInfos.stopBarbs === undefined) {
        playerInfos.stopBarbs = false;
    }
    if (playerInfos.follow === undefined) {
        playerInfos.follow = false;
    }
    if (playerInfos.undarkOnce === undefined) {
        playerInfos.undarkOnce = [];
    }
    if (playerInfos.bldList === undefined) {
        playerInfos.bldList = [];
    }
    if (playerInfos.bldVM === undefined) {
        playerInfos.bldVM = [];
    }
    if (playerInfos.gang === undefined) {
        playerInfos.gang = 'rednecks';
    }
    if (playerInfos.gangDef === undefined) {
        playerInfos.gangDef = true;
    }
    if (playerInfos.gLevel === undefined) {
        playerInfos.gLevel = 0;
    }
    if (playerInfos.adjok === undefined) {
        playerInfos.adjok = false;
    }
    if (playerInfos.nextId === undefined) {
        playerInfos.nextId = 1001;
    }
    if (playerInfos.allCits === undefined) {
        playerInfos.allCits = 2200;
    }
    if (playerInfos.gangXP === undefined) {
        playerInfos.gangXP = playerInfos.allCits;
    }
    if (playerInfos.allTurns === undefined) {
        playerInfos.allTurns = (playerInfos.gLevel-4)*80;
    }
    if (playerInfos.vitals === undefined) {
        playerInfos.vitals = 0;
    }
    if (playerInfos.crime === undefined) {
        playerInfos.crime = 0;
    }
    if (playerInfos.travTurns === undefined) {
        playerInfos.travTurns = 8;
    }
    if (playerInfos.missionZone === undefined) {
        playerInfos.missionZone = -1;
    }
    if (playerInfos.zoneDB === undefined) {
        playerInfos.zoneDB = [];
    }
    if (playerInfos.nmi === undefined) {
        playerInfos.nmi = playerInfos.zoneDB.length;
    }
    if (playerInfos.rescueDB === undefined) {
        playerInfos.rescueDB = [];
    }
    if (playerInfos.stList === undefined) {
        playerInfos.stList = [];
    }
    if (playerInfos.sqList === undefined) {
        playerInfos.sqList = [];
    }
    if (playerInfos.resFlags === undefined) {
        playerInfos.resFlags = [];
    }
    if (playerInfos.notes === undefined) {
        playerInfos.notes = [];
    }
    if (playerInfos.sci === undefined) {
        playerInfos.sci = 0;
    }
    if (playerInfos.sciRech === undefined) {
        playerInfos.sciRech = 0;
    }
    if (playerInfos.fndComps === undefined) {
        playerInfos.fndComps = 0;
    }
    if (playerInfos.fndUnits === undefined) {
        playerInfos.fndUnits = 0;
    }
    if (playerInfos.fndCits === undefined) {
        playerInfos.fndCits = 0;
    }
    if (playerInfos.vz === undefined) {
        playerInfos.vz = 0;
    }
    if (playerInfos.enc === undefined) {
        playerInfos.enc = 65;
    }
    if (playerInfos.encz === undefined) {
        playerInfos.encz = [];
    }
    if (playerInfos.crafts === undefined) {
        playerInfos.crafts = 0;
    }
    if (playerInfos.volFx === undefined) {
        playerInfos.volFx = 0.6;
    }
    if (playerInfos.volMu === undefined) {
        playerInfos.volMu = 0.4;
    }
    if (playerInfos.sondeDanger < Math.floor(playerInfos.allTurns/apoCount)+1) {
        playerInfos.sondeDanger = Math.floor(playerInfos.allTurns/apoCount)+1;
    }
});
// Terrains
socket.on('mapFilters-Load', function(mf) {
    mapFilters = mf;
    // console.log(mapFilters);
});
socket.on('terrainTypes-Load', function(tt) {
    terrainTypes = tt;
    // console.log(terrainTypes);
});
// Map
socket.on('savedMap-Load', function(sm) {
    savedMap = sm;
    // console.log(savedMap);
    if (savedMap.length >= (mapSize*mapSize)-1) {
        zone = savedMap;
        checkUndark();
        writeMapStyles();
        atomsColors(zone);
        xOffset = 31-Math.round(numVTiles/2);
        yOffset = 31-Math.round(numHTiles/2);
        showMap(zone,false);
    } else {
        generateNewMap(true);
    }
    if (zone[0].mapDiff === undefined) {
        zone[0].mapDiff = 2;
    }
    if (zone[0].dark === undefined) {
        zone[0].dark = false;
    }
    if (zone[0].number === undefined) {
        zone[0].number = 1;
    }
    if (zone[0].terrain === 'V') {
        playerInfos.onShip = true;
    } else {
        playerInfos.onShip = false;
    }
    getColonyTiles();
    checkUndark();
    turnInfo();
    getMapInfos();
    createStormsLists(false,true);
    commandes();
    checkVisibleAliens();
    alienBonus();
    if (!playerInfos.onShip) {
        minimap();
    }
    checkReserve();
    if (playerInfos.pseudo != 'Test' && playerInfos.pseudo != 'Payall') {
        // playMusic('start',true);
    }
    if (playerInfos.onShip) {
        playRoom('station',true);
    } else {
        if (zone[0].snd === undefined) {
            playRoom('crickets',true);
            // playBackMusic();
        } else {
            playRoom(zone[0].snd,true);
            // playBackMusic();
        }
    }
    let thisBatType;
    // Verif bat id's + sorting
    bataillons.forEach(function(bat) {
        if (bat.id >= playerInfos.nextId) {
            playerInfos.nextId = bat.id+1;
        }
    });
    let allMyIds = [];
    bataillons.forEach(function(bat) {
        if (!allMyIds.includes(bat.id)) {
            allMyIds.push(bat.id);
        } else {
            bat.id = playerInfos.nextId;
            playerInfos.nextId++;
        }
        if (bat.loc === "zone" || bat.loc === "trans") {
            thisBatType = getBatType(bat);
            if (thisBatType.sort === undefined) {
                bat.sort = bat.range*10;
            } else {
                bat.sort = thisBatType.sort;
            }
        }
    });
});
// resources
socket.on('resTypes-Load', function(rt) {
    resTypes = rt;
    // console.log(resTypes);
    freeIds('ressources',resTypes);
});
// crafting
socket.on('crafting-Load', function(crf) {
    crafting = crf;
    // console.log(crafting);
    freeIds('crafting',crafting);
});
// gangComps
socket.on('comps-Load', function(cmp) {
    gangComps = cmp;
    // console.log(gangComps);
});
// Bataillons
socket.on('bataillons-Load', function(bt) {
    bataillons = bt;
    // console.log(bataillons);
    createBatList();
});
// UnitTypes Default Values
socket.on('unitDV-Load', function(udv) {
    unitDV = udv;
    // console.log(unitDV);
});
// ammoTypes
socket.on('ammoTypes-Load', function(at) {
    ammoTypes = at;
    // console.log(ammoTypes);
});
// armorTypes
socket.on('armorTypes-Load', function(at) {
    armorTypes = at;
    playerSkillsATChanges();
    // console.log(armorTypes);
});
// UnitTypes
socket.on('unitTypes-Load', function(ut) {
    bareUnitTypes = ut;
    let newObj = {};
    bareUnitTypes.forEach(function(type) {
        newObj = Object.assign({}, unitDV, type);
        unitTypes.push(newObj)
    });
    bareUnitTypes = [];
    // console.log(unitTypes);
    freeIds('player',unitTypes);
});
// unitCosts
socket.on('unitCosts-Load', function(unitCosts) {
    let unitIndex;
    let batType;
    unitCosts.forEach(function(cost) {
        unitIndex = unitTypes.findIndex((obj => obj.id == cost.id));
        batType = unitTypes[unitIndex];
        Object.entries(cost).map(entry => {
            let key = entry[0];
            let value = entry[1];
            if (key != 'id' && key != 'name') {
                batType[key] = value;
            }
        });
    });
    playerSkillsUTChanges();
    updateBldList();
    // console.log(unitTypes);
});
socket.on('alienUnits-Load', function(au) {
    alienUnits = au;
    // console.log(alienUnits);
    alienUnitsChanges();
    freeIds('aliens',alienUnits);
});
socket.on('aliens-Load', function(ab) {
    aliens = ab;
    // console.log(aliens);
});
socket.on('zoneFiles-Load', function(zf) {
    zoneFiles = zf;
    // console.log(aliens);
});

socket.on('savedZone-Load', function(newZone) {
    zone = newZone[0];
    bataillons = newZone[1];
    createBatList();
    aliens = newZone[2];
    if (zone[0].number === 0) {
        showedTilesReset(false);
        miniOut();
    }
    showMap(zone,false);
    unitsView();
});

socket.on('zonePreview-Load', function(newZone) {
    zonePrev = newZone;
    showZonePreview();
});

socket.on('testcon-failed', function(pseutest) {
    warning('Déconnexion:','Le serveur à été redémarré et vous n\'avez pas actualisé la page.<br>Vos dernières actions n\'ont peut-être pas été enregistrées.');
    alert("Le serveur à été redémarré et vous n'avez pas actualisé la page. Vos dernières actions n'ont peut-être pas été enregistrées.");
    console.log('pseudo test failed! *********************************');
});
