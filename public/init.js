Number.prototype.toFixedNumber = function(digits, base){
  var pow = Math.pow(base||10, digits);
  return Math.round(this*pow) / pow;
}
// Player
socket.on('playerInfos-Load', function(pi) {
    playerInfos = pi;
    if (playerInfos.numHTiles > 1 && playerInfos.numVTiles > 1) {
        numHTiles = playerInfos.numHTiles;
        numVTiles = playerInfos.numVTiles;
    }
    if (playerInfos.onShip === undefined) {
        playerInfos.onShip = false;
    }
    if (playerInfos.comp === undefined) {
        playerInfos.comp = resetComp();
    }
    if (playerInfos.reserve === undefined) {
        playerInfos.reserve = {};
    }
    if (playerInfos.lastMapId === undefined) {
        playerInfos.lastMapId = 0;
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
        playerInfos.mapAdjDiff = playerInfos.mapDiff;
    }
    if (playerInfos.aliensKilled === undefined) {
        playerInfos.aliensKilled = 0;
    }
    if (playerInfos.eggsKilled === undefined) {
        playerInfos.eggsKilled = 0;
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
    if (playerInfos.dark === undefined) {
        playerInfos.dark = false;
    }
    if (playerInfos.undarkOnce === undefined) {
        playerInfos.undarkOnce = [];
    }
    if (playerInfos.bldList === undefined) {
        playerInfos.bldList = [];
    }
    if (playerInfos.gang === undefined) {
        playerInfos.gang = 'rednecks';
    }
    if (playerInfos.gLevel === undefined) {
        playerInfos.gLevel = 4;
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
        xOffset = 31-Math.round(numVTiles/2);
        yOffset = 31-Math.round(numHTiles/2);
        showMap(zone,false);
    } else {
        generateNewMap();
    }
    getColonyTiles();
    checkUndark();
    turnInfo();
    getMapInfos();
    commandes();
    checkVisibleAliens();
    alienBonus();
    minimap();
    checkReserve();
    if (playerInfos.pseudo != 'Test' && playerInfos.pseudo != 'Payall') {
        playMusic('start',true);
    }
    let thisBatType;
    // !!!!!!!!!!!!!!!!!!!!!!!! A ENLEVER une fois que les "sort" sont tous OK
    bataillons.forEach(function(bat) {
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
});
// crafting
socket.on('crafting-Load', function(crf) {
    crafting = crf;
    // console.log(crafting);
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
    freeIds('aliens',alienUnits);
});
socket.on('aliens-Load', function(ab) {
    aliens = ab;
    // console.log(aliens);
});
socket.on('testcon-failed', function(pseutest) {
    warning('Déconnexion:','Le serveur à été redémarré et vous n\'avez pas actualisé la page.<br>Vos dernières actions n\'ont peut-être pas été enregistrées.');
    alert("Le serveur à été redémarré et vous n'avez pas actualisé la page. Vos dernières actions n'ont peut-être pas été enregistrées.");
    console.log('pseudo test failed! *********************************');
});
