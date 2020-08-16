function searchRuins(apCost) {
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    let tile = getTile(selectedBat);
    checkRuinsCit(tile);
    checkRuinsAliens(tile);
    checkRuinsRes(tile);
    if (selectedBat.tags.includes('mining')) {
        tagIndex = selectedBat.tags.indexOf('mining');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBat.tags.includes('guet')) {
        tagIndex = selectedBat.tags.indexOf('guet');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBat.tags.includes('fortif')) {
        tagIndex = selectedBat.tags.indexOf('fortif');
        selectedBat.tags.splice(tagIndex,1);
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function checkRuinsCit(tile) {
    console.log('Check Citoyens');
    let numRuins = tile.sh;
    if (numRuins > 50) {
        numRuins = 50;
    }
    let citChance = Math.round(50/Math.sqrt(numRuins+5));
    console.log('citChance: '+citChance);
    if (rand.rand(1,100) <= citChance) {
        let ncFactor = Math.round((Math.sqrt(numRuins)+3)*3);
        let numCit = rand.rand(1,ncFactor)*6;
        console.log('numCit: '+numCit);
        let restCit = numCit;
        if (restCit <= 72) {
            putCit(tile.id,restCit);
            restCit = 0;
        } else {
            putCit(tile.id,72);
            restCit = restCit-72;
        }
        if (restCit >= 1) {
            if (restCit <= 72) {
                putCit(tile.id,restCit);
                restCit = 0;
            } else {
                putCit(tile.id,72);
                restCit = restCit-72;
            }
        }
        if (restCit >= 1) {
            if (restCit <= 72) {
                putCit(tile.id,restCit);
                restCit = 0;
            } else {
                putCit(tile.id,72);
                restCit = restCit-72;
            }
        }
    }
};

function putCit(tileId,numCit) {

};

function checkRuinsAliens(tile) {

};

function checkRuinsRes(tile) {

};
