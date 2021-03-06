function areaMove(direction) {
    let x = 0;
    let y = 0;
    switch(direction) {
        case 'n':
        x = Number(xOffset)-3;
        if (x < 0) {
            x = 0;
        }
        y = Number(yOffset);
        break;
        case 's':
        x = Number(xOffset)+3;
        if (x > 60-numVTiles) {
            x = 60-numVTiles;
        }
        y = Number(yOffset);
        break;
        case 'e':
        y = Number(yOffset)+3;
        if (y > 60-numHTiles) {
            y = 60-numHTiles;
        }
        x = Number(xOffset);
        break;
        case 'w':
        y = Number(yOffset)-3;
        if (y < 0) {
            y = 0;
        }
        x = Number(xOffset);
        break;
    }
    areaGo(x,y);
};

function areaGo(x,y) {
    xOffset = x;
    yOffset = y;
    showMap(zone,true);
    confirmMode();
};

function yourMapSize() {
    let screenH = window.screen.availWidth;
    let screenV = window.screen.availHeight;
    let defV = 15;
    let defH = 9;
    if (screenH >= 2560) {
        defH = 28;
    }
    if (screenV >= 1440) {
        defV = 16;
    }
    numHTiles = Number(prompt('Nombre de terrains vus horizontalement (x)',defH));
    numVTiles = Number(prompt('Nombre de terrains vus horizontalement (y)',defV));
    writeMapStyles();
    showMap(zone,false);
};

function limitOffset() {
    if (xOffset < 0) {
        xOffset = 0;
    }
    if (yOffset < 0) {
        yOffset = 0;
    }
    if (xOffset > 60-numVTiles) {
        xOffset = 60-numVTiles;
    }
    if (yOffset > 60-numHTiles) {
        yOffset = 60-numHTiles;
    }
};

function centerMapTo(tileId) {
    // center on tile
    myTileX = zone[tileId].x;
    myTileY = zone[tileId].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone,true);
    confirmMode();
    selectedTile = tileId;
    if (showMini && activeTurn == 'player') {
        minimap();
    }
};

function centerMap() {
    // center on selectedBat
    if (selectedBat.id > -1) {
        myTileX = zone[selectedBat.tileId].x;
        myTileY = zone[selectedBat.tileId].y;
        xOffset = myTileX-Math.round(numVTiles/2);
        yOffset = myTileY-Math.round(numHTiles/2);
        limitOffset();
        showMap(zone,true);
        confirmMode();
        if (Object.keys(selectedBat).length >= 1) {
            tileSelect(selectedBat);
        }
        if (Object.keys(targetBat).length >= 1) {
            tileTarget(targetBat);
        }
        selectedTile = selectedBat.tileId;
        if (showMini && activeTurn == 'player') {
            minimap();
        }
    } else {
        centerMapCenter();
    }
};

function centerMapTarget() {
    // center on targetBat
    if (targetBat.id > -1) {
        myTileX = zone[targetBat.tileId].x;
        myTileY = zone[targetBat.tileId].y;
        xOffset = myTileX-Math.round(numVTiles/2);
        yOffset = myTileY-Math.round(numHTiles/2);
        limitOffset();
        showMap(zone,true);
        confirmMode();
        if (Object.keys(selectedBat).length >= 1) {
            tileSelect(selectedBat);
        }
        if (Object.keys(targetBat).length >= 1) {
            tileTarget(targetBat);
        }
        selectedTile = targetBat.tileId;
        if (showMini && activeTurn == 'player') {
            minimap();
        }
    }
};

function centerMapCenter() {
    // center on selectedBat
    myTileX = zone[playerInfos.myCenter].x;
    myTileY = zone[playerInfos.myCenter].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone,true);
    confirmMode();
    selectedTile = playerInfos.myCenter;
    if (showMini && activeTurn == 'player') {
        minimap();
    }
};

function isVisible(tileId) {
    let tileX = zone[tileId].x;
    let tileY = zone[tileId].y;
    let minX = xOffset+1;
    let maxX = xOffset+numVTiles;
    let minY = yOffset+1;
    let maxY = yOffset+numHTiles;
    if (tileX < minX || tileX > maxX || tileY < minY || tileY > maxY) {
        return false;
    } else {
        return true;
    }
};

function findEgg() {
    let eggsToShow = 0;
    let myEgg = {};
    let sortedAliens = _.sortBy(aliens,'tileId');
    sortedAliens.forEach(function(bat) {
        if (bat.loc === "zone" && !shownEggs.includes(bat.id) && Object.keys(myEgg).length <= 0 && !bat.tags.includes('invisible')) {
            if (bat.type.includes('Oeuf') || bat.type.includes('Coque') || bat.type === 'Cocon') {
                eggsToShow = eggsToShow+1;
                myEgg = bat;
            }
        }
    });
    if (eggsToShow <= 0) {
        shownEggs = [];
        myEgg = {};
        sortedAliens.forEach(function(bat) {
            if (bat.loc === "zone" && !shownEggs.includes(bat.id) && Object.keys(myEgg).length <= 0 && !bat.tags.includes('invisible')) {
                if (bat.type.includes('Oeuf') || bat.type.includes('Coque') || bat.type === 'Cocon') {
                    eggsToShow = eggsToShow+1;
                    myEgg = bat;
                }
            }
        });
    }
    if (Object.keys(myEgg).length >= 1) {
        shownEggs.push(myEgg.id);
        centerMapTo(myEgg.tileId);
    }
    commandes();
};
