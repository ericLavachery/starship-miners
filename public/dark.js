function checkUndark() {
    if (playerInfos.dark) {
        let terrain;
        undarkNow = [];
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                // terrain = getTerrain(bat);
                undarkAround(bat);
            }
        });
    }
};

function undarkAround(bat) {
    let thisTile = bat.tileId;
    unDark(thisTile);
    thisTile = bat.tileId-1;
    unDark(thisTile);
    thisTile = bat.tileId+1;
    unDark(thisTile);
    thisTile = bat.tileId-1-mapSize;
    unDark(thisTile);
    thisTile = bat.tileId+1-mapSize;
    unDark(thisTile);
    thisTile = bat.tileId-mapSize;
    unDark(thisTile);
    thisTile = bat.tileId-1+mapSize;
    unDark(thisTile);
    thisTile = bat.tileId+1+mapSize;
    unDark(thisTile);
    thisTile = bat.tileId+mapSize;
    unDark(thisTile);
    let terrain = getTerrain(bat);
    if (terrain.scarp >= 2) {
        thisTile = bat.tileId-mapSize-mapSize-2;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize-1;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize+1;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize+2;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize-2;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize-1;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+1;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+2;
        unDark(thisTile);
        thisTile = bat.tileId+2;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize+2;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+2;
        unDark(thisTile);
        thisTile = bat.tileId-2;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-2;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize-2;
        unDark(thisTile);
    }
    if (terrain.scarp >= 3) {
        thisTile = bat.tileId-mapSize-mapSize-mapSize-3;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize-mapSize-2;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize-mapSize-1;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize-mapSize;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize-mapSize+1;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize-mapSize+2;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize-mapSize+3;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+mapSize-3;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+mapSize-2;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+mapSize-1;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+mapSize;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+mapSize+1;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+mapSize+2;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+mapSize+3;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize-3;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize-3;
        unDark(thisTile);
        thisTile = bat.tileId-3;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-3;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize-3;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+mapSize+3;
        unDark(thisTile);
        thisTile = bat.tileId+mapSize+3;
        unDark(thisTile);
        thisTile = bat.tileId+3;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize+3;
        unDark(thisTile);
        thisTile = bat.tileId-mapSize-mapSize+3;
        unDark(thisTile);
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
