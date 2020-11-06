function searchRuins(apCost) {
    let tile = getTile(selectedBat);
    if (tile.ruins && tile.sh >= 1) {
        console.log('RUINS');
        selectedBat.apLeft = selectedBat.apLeft-apCost;
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
        tile.sh = -1;
        saveMap();
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
    }
};

function checkRuinsCit(tile) {
    console.log('Check Citoyens');
    let numRuins = tile.sh;
    if (numRuins > 50) {
        numRuins = 50;
    }
    let citChance = Math.round(ruinsCitBase/Math.sqrt(numRuins+5));
    console.log('citChance: '+citChance);
    if (rand.rand(1,100) <= citChance) {
        let ncFactor = Math.round((Math.sqrt(numRuins)+3)*3);
        let numCit = rand.rand(1,ncFactor)*6;
        console.log('numCit: '+numCit);
        let restCit = numCit;
        if (restCit <= 72) {
            putBatAround(tile.id,false,126,restCit);
            restCit = 0;
        } else {
            putBatAround(tile.id,false,126,72);
            restCit = restCit-72;
        }
        if (restCit >= 1) {
            if (restCit <= 72) {
                putBatAround(tile.id,false,126,restCit);
                restCit = 0;
            } else {
                putBatAround(tile.id,false,126,72);
                restCit = restCit-72;
            }
        }
        if (restCit >= 1) {
            if (restCit <= 72) {
                putBatAround(tile.id,false,126,restCit);
                restCit = 0;
            } else {
                putBatAround(tile.id,false,126,72);
                restCit = restCit-72;
            }
        }
    }
};

function checkRuinsAliens(tile) {
    console.log('Check Aliens');
    let mapLevel = playerInfos.mapDiff+2;
    let mapFactor = playerInfos.mapDiff;
    if (mapFactor < 1) {
        mapFactor = 1;
    }
    let alienChance = Math.round(mapLevel*ruinsBugBase/25);
    console.log('alienChance: '+alienChance);
    if (rand.rand(1,100) <= alienChance) {
        let maxDice = Math.ceil(mapFactor/3);
        let numAliens = rand.rand(1,maxDice);
        let numCheck = rand.rand(1,maxDice);
        if (numCheck < numAliens) {
            numAliens = numCheck;
        }
        let alienTypeId = -1;
        let shufAliens = _.shuffle(alienUnits);
        shufAliens.forEach(function(unit) {
            if (alienTypeId < 0) {
                if (unit.size <= 6 && unit.class != 'A' && unit.name != 'Asticots' && unit.name != 'Vers' && unit.name != 'Sangsues') {
                    alienTypeId = unit.id;
                }
            }
        });
        if (alienTypeId >= 0) {
            let i = 1;
            while (i <= numAliens) {
                putBatAround(tile.id,true,alienTypeId,0)
                if (i > 6) {break;}
                i++
            }
        }
        selectedBat.apLeft = selectedBat.apLeft+selectedBat.ap;
    }
};

function putBatAround(tileId,alien,unitId,numCit) {
    console.log(alien);
    let dropTile = checkDrop(selectedBat);
    if (dropTile >= 0) {
        let unitIndex;
        if (!alien) {
            unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
            conselUnit = unitTypes[unitIndex];
        } else {
            unitIndex = alienUnits.findIndex((obj => obj.id == unitId));
            conselUnit = alienUnits[unitIndex];
        }
        conselAmmos = ['xxx','xxx','xxx','xxx'];
        putBat(dropTile,numCit,0);
    }
};

function checkRuinsRes(tile) {

};
