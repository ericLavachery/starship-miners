function checkEggsDrop() {
    let drop = false;
    let dropTurn = Math.floor(((playerInfos.mapDrop*cumDrop)+playerInfos.mapTurn)/(cumDrop+1));
    let dropChance = Math.round(dropTurn*Math.sqrt(playerInfos.mapDiff));
    if (playerInfos.mapTurn == 0) {
        dropChance = 100; // !!!!!!!!!!!!!!!! Seulement pour les TESTS :)
    }
    if (rand.rand(1,100) <= dropChance) {
        drop = true;
        eggsDrop();
    }
    if (drop) {
        playerInfos.mapDrop = 0;
    } else {
        playerInfos.mapDrop = playerInfos.mapDrop+1;
    }
};

function eggsDrop() {
    let numEggs;
    let eggDice = rand.rand(1,100);
    let threeEggsChance = Math.round((playerInfos.mapDiff/1.5)-2);
    if (threeEggsChance < 0) {
        threeEggsChance = 0;
    }
    let twoEggsChance = playerInfos.mapDiff;
    if (eggDice <= noEggs) {
        numEggs = 0;
    } else if (eggDice <= noEggs+twoEggsChance) {
        numEggs = 2;
    } else if (eggDice <= noEggs+twoEggsChance+threeEggsChance) {
        numEggs = 3;
    } else {
        numEggs = 1;
    }
    if (numEggs >= 1) {
        let i = 1;
        while (i <= numEggs) {
            dropEgg();
            if (i > 3) {break;}
            i++
        }
    }
};

function dropEgg() {
    let unitIndex = alienUnits.findIndex((obj => obj.name === 'Oeuf'));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx'];
    alienOccupiedTileList();
    playerOccupiedTileList();
    let tileOK = false;
    let maxTileId = (mapSize*mapSize)+1;
    let dropTile = rand.rand(0,maxTileId);
    if (!alienOccupiedTiles.includes(dropTile) && !playerOccupiedTiles.includes(dropTile)) {
        tileOK = true;
    }
    if (!tileOK) {
        dropTile = rand.rand(0,maxTileId);
        if (!alienOccupiedTiles.includes(dropTile) && !playerOccupiedTiles.includes(dropTile)) {
            tileOK = true;
        }
    }
    if (!tileOK) {
        dropTile = rand.rand(0,maxTileId);
        if (!alienOccupiedTiles.includes(dropTile) && !playerOccupiedTiles.includes(dropTile)) {
            tileOK = true;
        }
    }
    if (tileOK) {
        putBat(dropTile);
    }
};

function eggsSpawns() {

};
