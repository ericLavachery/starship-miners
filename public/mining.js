function extraction(apCost) {
    console.log('EXTRACTION');
    if (!selectedBat.tags.includes('mining')) {
        selectedBat.tags.push('mining');
    }
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    camoOut();
    tagDelete(selectedBat,'guet');
    tagDelete(selectedBat,'fortif');
    tagDelete(selectedBat,'vise');
    tagDelete(selectedBat,'luckyshot');
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function mining(bat) {
    if (bat.tags.includes('mining')) {
        if (bat.apLeft >= 1) {
            let batType = getBatType(bat);
            let rate = Math.round(bat.apLeft*batType.mining.rate/batType.ap);
            let dispoRes = getRes(bat,batType);

        }
    }
};

function getRes(bat,batType) {
    let dispoRes = {};
    let tile = getTile(bat);
    let terrain = getTerrain(bat);
    // Eau
    if (terrain.name === 'R') {
        dispoRes.eau = 100;
    } else if (terrain.name === 'W') {
        dispoRes.eau = 75;
    } else if (terrain.name === 'S') {
        dispoRes.eau = 25;
    }
    // Air
    dispoRes.oxygène = 78;
    dispoRes.azote = 21;
    dispoRes.argon = 1;
    console.log(dispoRes);
    return dispoRes;
};

function getTerrain(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    return terrain;
};

function getTile(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    return tile;
};
