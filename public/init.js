// Player
socket.on('playerInfos-Load', function(pi) {
    playerInfos = pi;
    if (playerInfos.numHTiles > 1 && playerInfos.numVTiles > 1) {
        numHTiles = playerInfos.numHTiles;
        numVTiles = playerInfos.numVTiles;
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
        writeMapStyles();
        xOffset = 30-Math.round(numVTiles/2);
        yOffset = 30-Math.round(numHTiles/2);
        showMap(zone);
    } else {
        generateNewMap();
    }
    commandes();
});
// Bataillons
socket.on('bataillons-Load', function(bt) {
    bataillons = bt;
    // console.log(bataillons);
    createBatList();
});
// UnitTypes
socket.on('unitDV-Load', function(udv) {
    unitDV = udv;
    // console.log(unitDV);
});
socket.on('unitTypes-Load', function(ut) {
    bareUnitTypes = ut;
    let newObj = {};
    bareUnitTypes.forEach(function(type) {
        newObj = Object.assign({}, unitDV, type);
        unitTypes.push(newObj)
    });
    bareUnitTypes = [];
    // console.log(unitTypes);
});
socket.on('alienUnits-Load', function(au) {
    alienUnits = au;
    // console.log(alienUnits);
});
socket.on('aliens-Load', function(ab) {
    aliens = ab;
    // console.log(aliens);
});
