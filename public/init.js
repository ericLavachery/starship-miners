Number.prototype.toFixedNumber = function(digits, base){
  var pow = Math.pow(base||10, digits);
  return Math.round(this*pow) / pow;
}

$(document).on("dragstart", function() {
     return false;
});

window.onerror = (event) => {
    jsErrorWarning(event);
};

// Player
socket.on('playerInfos-Load', function(pi) {
    playerInfos = pi;
    isPlayerAdmin();
    if (playerInfos.numHTiles > 1 && playerInfos.numVTiles > 1) {
        numHTiles = playerInfos.numHTiles;
        numVTiles = playerInfos.numVTiles;
    }
    if (playerInfos.onShip === undefined) {
        playerInfos.onShip = true;
    }
    if (playerInfos.onStart === undefined) {
        playerInfos.onStart = false;
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
    if (playerInfos.maxRes === undefined) {
        playerInfos.maxRes = {};
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
    if (playerInfos.sondeRes === undefined) {
        playerInfos.sondeRes = [];
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
    if (playerInfos.maxEggDrop === undefined) {
        playerInfos.maxEggDrop = 0;
    }
    if (playerInfos.maxEggPlay === undefined) {
        playerInfos.maxEggPlay = 0;
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
    if (playerInfos.deadBats === undefined) {
        playerInfos.deadBats = [];
    }
    if (playerInfos.pauseSeed === undefined) {
        playerInfos.pauseSeed = rand.rand(1,8);
    }
    if (playerInfos.randSeed === undefined) {
        playerInfos.randSeed = rand.rand(1,8);
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
    if (playerInfos.gMode === undefined) {
        playerInfos.gMode = 2;
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
    if (playerInfos.cNeed === undefined) {
        playerInfos.cNeed = 1;
    }
    if (playerInfos.cLoss === undefined) {
        playerInfos.cLoss = 0;
    }
    if (playerInfos.cAdj === undefined) {
        playerInfos.cAdj = 0;
    }
    if (playerInfos.allCits === undefined) {
        playerInfos.allCits = 2200;
    }
    if (playerInfos.citz === undefined) {
        playerInfos.citz = {};
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
    if (playerInfos.penit === undefined) {
        playerInfos.penit = 0;
    }
    if (playerInfos.travTurns === undefined) {
        playerInfos.travTurns = 8;
    }
    if (playerInfos.eggCrash === undefined) {
        playerInfos.eggCrash = 0;
    }
    if (playerInfos.aCanon === undefined) {
        playerInfos.aCanon = 'none';
    }
    if (playerInfos.objectifs === undefined) {
        playerInfos.objectifs = {};
        playerInfos.objectifs.resistance = 'none';
        playerInfos.objectifs.trolley = 'none';
        playerInfos.objectifs.swarm = 'none';
        playerInfos.objectifs.science = 'none';
        playerInfos.objectifs.spider = playerInfos.aCanon;
        playerInfos.objectifs.larve = 'none';
        playerInfos.objectifs.bug = 'none';
    } else {
        if (playerInfos.objectifs.spider === undefined) {
            playerInfos.objectifs.spider = 'none';
        }
        if (playerInfos.objectifs.bug === undefined) {
            playerInfos.objectifs.bug = 'none';
        }
        if (playerInfos.objectifs.larve === undefined) {
            playerInfos.objectifs.larve = 'none';
        }
        if (playerInfos.objectifs.swarm === undefined) {
            playerInfos.objectifs.swarm = 'none';
        }
        if (playerInfos.objectifs.resistance === undefined) {
            playerInfos.objectifs.resistance = 'none';
        }
        if (playerInfos.objectifs.science === undefined) {
            playerInfos.objectifs.science = 'none';
        }
        if (playerInfos.objectifs.trolley === undefined) {
            playerInfos.objectifs.trolley = 'none';
        }
    }
    if (playerInfos.missionZone === undefined) {
        playerInfos.missionZone = -1;
    }
    if (playerInfos.missionPlanet === undefined) {
        playerInfos.missionPlanet = -1;
    }
    if (playerInfos.zoneDB === undefined) {
        playerInfos.zoneDB = [];
    }
    if (playerInfos.nmi === undefined) {
        playerInfos.nmi = 1;
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
    if (playerInfos.fndSpins === undefined) {
        playerInfos.fndSpins = 0;
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
        playerInfos.volFx = 0.4;
    }
    if (playerInfos.volMu === undefined) {
        playerInfos.volMu = 0.2;
    }
    if (playerInfos.volAmb === undefined) {
        playerInfos.volAmb = 0.5;
    }
    if (playerInfos.volRadio === undefined) {
        playerInfos.volRadio = 0.3;
        playerInfos.volMu = 0.2;
        playerInfos.volFx = 0.4;
        playerInfos.volAmb = 0.5;
    }
    if (playerInfos.statMu === undefined) {
        playerInfos.statMu = true;
    }
    let doom = getDoom(true);
    if (playerInfos.sondeDanger < doom) {
        playerInfos.sondeDanger = doom;
    }
    if (playerInfos.misDB === undefined) {
        playerInfos.misDB = [];
    }
    if (playerInfos.alerte === undefined) {
        playerInfos.alerte = {};
    }
    if (playerInfos.para === undefined) {
        playerInfos.para = 0;
    }
    if (playerInfos.deployRes === undefined) {
        playerInfos.deployRes = {};
        playerInfos.deployRes['Energie'] = 700;
        playerInfos.deployRes['Huile'] = 20;
        playerInfos.deployRes['Drogues'] = 60;
        playerInfos.deployRes['Chlore'] = 30;
        playerInfos.deployRes['Zinc'] = 30;
        playerInfos.deployRes['Tissus'] = 30;
        playerInfos.deployRes['Plutonium'] = 120;
        playerInfos.deployRes['Hydrogène'] = 60;
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
    turnInfo(true);
    getMapInfos();
    createStormsLists(false,true);
    commandes();
    checkVisibleAliens();
    alienBonus();
    if (!playerInfos.onShip) {
        minimap();
    }
    checkReserve();
    if (playerInfos.onShip) {
        playRoom('station',true,true);
    } else {
        if (!gameOver) {
            if (zone[0].snd === undefined) {
                playRoom('crickets',true,true);
            } else {
                playRoom(zone[0].snd,true,true);
            }
        }
    }
    let thisBatType;
    // Verif bat id's + sorting
    bataillons.forEach(function(bat) {
        if (bat.type === 'Soute') {
            bat.id = 1;
            if (playerInfos.nextId === 1) {
                playerInfos.nextId = 2;
            }
        } else {
            if (bat.id >= 9000) {
                bat.id = playerInfos.nextId;
                playerInfos.nextId++;
            }
            if (bat.id >= playerInfos.nextId) {
                playerInfos.nextId = bat.id+1;
            }
        }
    });
    let allMyIds = [];
    bataillons.forEach(function(bat) {
        if (bat.id === 1 && bat.type != 'Soute') {
            playerInfos.nextId++;
            bat.id = playerInfos.nextId;
            playerInfos.nextId++;
        }
        if (!allMyIds.includes(bat.id)) {
            allMyIds.push(bat.id);
        } else {
            bat.id = playerInfos.nextId;
            playerInfos.nextId++;
        }
        if (bat.tdc === undefined) {
            bat.tdc = [];
        }
        if (bat.loc === "zone" || bat.loc === "trans") {
            thisBatType = getBatType(bat);
            let initSort = false;
            if (bat.sort === undefined) {
                initSort = true;
            } else if (bat.sort < 1000) {
                initSort = true;
            }
            if (initSort) {
                if (thisBatType.sort === undefined) {
                    bat.sort = bat.range*10;
                    if (thisBatType.transUnits >= 10 && thisBatType.cat === 'vehicles' && bat.sort < 25) {
                        bat.sort = 25;
                    }
                    if (thisBatType.skills.includes('medic') && thisBatType.cat === 'infantry' && bat.sort < 11) {
                        bat.sort = 11;
                    }
                } else {
                    bat.sort = thisBatType.sort;
                }
            }
        }
    });
    aliens.forEach(function(bat) {
        if (bat.tdc === undefined) {
            bat.tdc = [];
        }
    });
    if (playerInfos.onShip && !playerInfos.onStart) {
        souteBatSelect(true);
        showBatInfos(selectedBat);
        if (!inSoute && !modeSonde) {
            changeStationMap();
        }
    }
    getSelectedLanderId();
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
    // createBatList();
});
// UnitTypes Default Values
socket.on('unitDV-Load', function(udv) {
    unitDV = udv;
    // console.log(unitDV);
});
// ammoTypes
socket.on('ammoTypes-Load', function(at) {
    ammoTypes = at;
    // playerSkillsUTAmmos();
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
});
socket.on('missionsDB-Load', function(mis) {
    playerInfos.misDB = mis;
    if (playerInfos.misInfo === undefined) {
        playerInfos.misInfo = [];
    }
    updateMissionsInfo();
});

socket.on('load-edited-mission', function(newMission) {
    zone = newMission[0];
    bataillons = newMission[1];
    aliens = newMission[2];
    saveZone();
    location.reload();
});

socket.on('savedZone-Load', function(newZone) {
    zone = newZone[0];
    bataillons = newZone[1];
    if (zone[0].edited && playerInfos.pseudo != 'Mapedit') {
        idRepair();
    }
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

socket.on('get-missions-teams', function(teams) {
    putMissionUnits(teams);
});

socket.on('testcon-failed', function(pseutest) {
    warning('Déconnexion:','Le serveur à été redémarré et vous n\'avez pas actualisé la page.<br>Vos dernières actions n\'ont peut-être pas été enregistrées.');
    alert("Le serveur à été redémarré et vous n'avez pas actualisé la page. Vos dernières actions n'ont peut-être pas été enregistrées.");
    console.log('pseudo test failed! *********************************');
});

// BACKUP SAVED
socket.on('backup-saved', function(hi) {
    justReloaded = false;
    commandes();
});
