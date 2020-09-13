function checkUndark() {
    if (playerInfos.dark) {
        let noBat = {};
        undarkCenter();
        let terrain;
        undarkNow = [];
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                undarkAround(bat,false);
            }
        });
    }
};

function undarkCenter() {
    let distance;
    zone.forEach(function(tile) {
        distance = calcDistance(1830,tile.id);
        if (distance <= startLander) {
            unDark(tile.id);
        }
    });
};

function undarkAround(bat,center) {
    let batTileId = bat.tileId;
    let batType = {};
    let terrain = {};
    let vision = false;
    let vvision = false;
    if (center) {
        batTileId = 1830;
        terrain = getTerrainById(1830);
    } else {
        batType = getBatType(bat);
        if (batType.skills.includes('vision')) {
            vision = false;
        }
        if (batType.skills.includes('vvision')) {
            vvision = true;
        }
        terrain = getTerrain(bat);
    }
    let thisTile = batTileId;
    unDark(thisTile);
    if (batType.crew >=1 || vision || vvision || center) {
        thisTile = batTileId-1;
        unDark(thisTile);
        thisTile = batTileId+1;
        unDark(thisTile);
        thisTile = batTileId-1-mapSize;
        unDark(thisTile);
        thisTile = batTileId+1-mapSize;
        unDark(thisTile);
        thisTile = batTileId-mapSize;
        unDark(thisTile);
        thisTile = batTileId-1+mapSize;
        unDark(thisTile);
        thisTile = batTileId+1+mapSize;
        unDark(thisTile);
        thisTile = batTileId+mapSize;
        unDark(thisTile);
        if (terrain.scarp >= 2 || vision || vvision || center) {
            thisTile = batTileId-mapSize-mapSize-2;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-1;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize+1;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize+2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize-2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize-1;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+1;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+2;
            unDark(thisTile);
            thisTile = batTileId+2;
            unDark(thisTile);
            thisTile = batTileId-mapSize+2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+2;
            unDark(thisTile);
            thisTile = batTileId-2;
            unDark(thisTile);
            thisTile = batTileId-mapSize-2;
            unDark(thisTile);
            thisTile = batTileId+mapSize-2;
            unDark(thisTile);
        }
        if (terrain.scarp >= 3 || vvision || center) {
            thisTile = batTileId-mapSize-mapSize-mapSize-3;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize-2;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize-1;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize+1;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize+2;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize+3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize-3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize-2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize-1;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize+1;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize+2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize+3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize-3;
            unDark(thisTile);
            thisTile = batTileId+mapSize-3;
            unDark(thisTile);
            thisTile = batTileId-3;
            unDark(thisTile);
            thisTile = batTileId-mapSize-3;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+3;
            unDark(thisTile);
            thisTile = batTileId+3;
            unDark(thisTile);
            thisTile = batTileId-mapSize+3;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize+3;
            unDark(thisTile);
        }
    }
};

function unDark(tileId) {
    if (tileId >= 0 && tileId < mapSize*mapSize) {
        if (!undarkNow.includes(tileId)) {
            undarkNow.push(tileId);
        }
        if (!playerInfos.undarkOnce.includes(tileId)) {
            playerInfos.undarkOnce.push(tileId);
        }
    }
};
