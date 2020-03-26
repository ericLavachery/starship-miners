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
    showMap(zone);
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
    showMap(zone);
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

function centerMap() {
    // center on selectedBat
    if (selectedBat.id > -1) {
        myTileX = zone[selectedBat.tileId].x;
        myTileY = zone[selectedBat.tileId].y;
        xOffset = myTileX-Math.round(numVTiles/2);
        yOffset = myTileY-Math.round(numHTiles/2);
        limitOffset();
        showMap(zone);
    }
};

function centerMapCenter() {
    // center on selectedBat
    myTileX = zone[1830].x;
    myTileY = zone[1830].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone);
};
