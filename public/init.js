// Player
socket.on('playerInfos-Load', function(pi) {
    playerInfos = pi;
    if (playerInfos.numHTiles > 1 && playerInfos.numVTiles > 1) {
        numHTiles = playerInfos.numHTiles;
        numVTiles = playerInfos.numVTiles;
    }
    if (playerInfos.eggPause === undefined) {
        playerInfos.eggPause = false;
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
    playerSkills();
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
        writeMapStyles();
        xOffset = 30-Math.round(numVTiles/2);
        yOffset = 30-Math.round(numHTiles/2);
        showMap(zone,false);
    } else {
        generateNewMap();
    }
    commandes();
    $('#tour').empty().append('Tour '+playerInfos.mapTurn+'<br>');
    $('#tour').append('Difficulté '+playerInfos.mapDiff);
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
    if (playerInfos.skills.includes('cam1') || playerInfos.skills.includes('cam2') || playerInfos.skills.includes('cam3') || playerInfos.medLevel >= 3) {
        playerSkillsUTChanges();
    }
    freeIds('player',unitTypes);
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
