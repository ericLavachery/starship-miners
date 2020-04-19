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
    // center on selectedBat
    myTileX = zone[tileId].x;
    myTileY = zone[tileId].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone,true);
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
    }
};

function centerMapCenter() {
    // center on selectedBat
    myTileX = zone[1830].x;
    myTileY = zone[1830].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone,true);
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
    aliens.forEach(function(bat) {
        if (bat.loc === "zone" && !shownEggs.includes(bat.id) && Object.keys(myEgg).length <= 0) {
            if (bat.type === "Oeuf" || bat.type === "Ruche") {
                eggsToShow = eggsToShow+1;
                myEgg = bat;
            }
        }
    });
    if (eggsToShow <= 0) {
        shownEggs = [];
        myEgg = {};
        aliens.forEach(function(bat) {
            if (bat.loc === "zone" && !shownEggs.includes(bat.id) && Object.keys(myEgg).length <= 0) {
                if (bat.type === "Oeuf" || bat.type === "Ruche") {
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
