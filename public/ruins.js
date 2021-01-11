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
        ruinsEmpty = true;
        coffreTileId = -1;
    }
};

function checkRuinsCit(tile) {
    console.log('Check Citoyens');
    ruinsEmpty = true;
    let numRuins = tile.sh;
    if (numRuins > 50) {
        numRuins = 50;
    }
    let citChance = Math.round(ruinsCitBase/Math.sqrt(numRuins+5));
    let citId = 126;
    if (rand.rand(1,ruinsCrimChance) === 1) {
        citId = 225;
    }
    console.log('citChance: '+citChance);
    if (rand.rand(1,100) <= citChance) {
        let ncFactor = Math.round((Math.sqrt(numRuins)+3)*3);
        let numCit = rand.rand(1,ncFactor)*6;
        ruinsEmpty = false;
        console.log('numCit: '+numCit);
        let restCit = numCit;
        if (restCit <= 72) {
            putBatAround(tile.id,false,citId,restCit);
            restCit = 0;
        } else {
            putBatAround(tile.id,false,citId,72);
            restCit = restCit-72;
        }
        if (restCit >= 1) {
            if (restCit <= 72) {
                putBatAround(tile.id,false,citId,restCit);
                restCit = 0;
            } else {
                putBatAround(tile.id,false,citId,72);
                restCit = restCit-72;
            }
        }
        if (restCit >= 1) {
            if (restCit <= 72) {
                putBatAround(tile.id,false,citId,restCit);
                restCit = 0;
            } else {
                putBatAround(tile.id,false,citId,72);
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
    let dropTile = checkDrop(tileId);
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
        coffreTileId = dropTile;
        putBat(dropTile,numCit,0);
    }
};

function checkRuinsRes(tile) {
    console.log('Check Ressources');
    coffreTileId = -1;
    let numRuins = tile.sh;
    if (numRuins > 50) {
        numRuins = 50;
    }
    let resChance = ruinsResBase;
    console.log('resChance: '+resChance);
    if (rand.rand(1,100) <= resChance) {
        putBatAround(tile.id,false,239,0);
        let coffre = getBatByTileId(coffreTileId);
        let totalRes = 0;
        let thatResChance = 0;
        let thatResNum = 0;
        let mapFactor = playerInfos.mapDiff+2;
        let resFactor;
        resTypes.forEach(function(res) {
            if (res.name != 'Magma' && res.name != 'Scrap' && res.cat != 'alien') {
                thatResChance = 0;
                thatResNum = 0;
                resFactor = res.rarity+playerInfos.mapDiff;
                if (res.name == 'Nourriture') {
                    if (ruinsEmpty) {
                        thatResChance = Math.ceil(resFactor*res.batch/3);
                    } else {
                        thatResChance = Math.ceil(resFactor*5*res.batch/3);
                    }
                } else if (res.cat == 'transfo') {
                    if (!res.name.includes('Compo') && res.name != 'Moteur orbital' && res.name != 'Energie') {
                        thatResChance = Math.ceil(resFactor*2*res.batch/3);
                    }
                } else {
                    if (res.name === 'Huile') {
                        thatResChance = Math.ceil(75*res.batch/3);
                    } else if (res.name === 'Eau') {
                        if (ruinsEmpty) {
                            thatResChance = Math.ceil(100*res.batch/3);
                        } else {
                            thatResChance = Math.ceil(300*res.batch/3);
                        }
                    } else {
                        thatResChance = Math.ceil(resFactor/3*res.batch/3);
                    }
                    if (res.cat === 'blue') {
                        thatResChance = Math.ceil(thatResChance/3*mapFactor/7);
                    } else if (res.cat === 'blue-sky') {
                        thatResChance = Math.ceil(thatResChance/2*mapFactor/7);
                    } else if (res.cat === 'sky') {
                        thatResChance = Math.ceil(thatResChance/3*mapFactor/7);
                    }
                }
                console.log(res.name+' '+thatResChance);
                if (rand.rand(1,1000) <= thatResChance) {
                    thatResNum = Math.ceil(Math.sqrt(Math.sqrt(thatResChance))*mapFactor/2*rand.rand(4,16))+rand.rand(0,9);
                    console.log('!GET : '+res.name+' '+thatResNum);
                    if (coffre.transRes[res.name] === undefined) {
                        coffre.transRes[res.name] = thatResNum;
                    } else {
                        coffre.transRes[res.name] = coffre.transRes[res.name]+thatResNum;
                    }
                    totalRes = totalRes+thatResNum;
                }
            }
        });
        if (totalRes <= 0) {
            resTypes.forEach(function(res) {
                if (totalRes <= 0) {
                    if (res.name != 'Magma' && res.name != 'Scrap' && res.cat != 'alien') {
                        thatResChance = 0;
                        thatResNum = 0;
                        resFactor = res.rarity+playerInfos.mapDiff;
                        if (res.name == 'Nourriture') {
                            if (ruinsEmpty) {
                                thatResChance = Math.ceil(resFactor*res.batch/3);
                            } else {
                                thatResChance = Math.ceil(resFactor*5*res.batch/3);
                            }
                        } else if (res.cat == 'transfo') {
                            if (!res.name.includes('Compo') && res.name != 'Moteur orbital' && res.name != 'Energie') {
                                thatResChance = Math.ceil(resFactor*2*res.batch/3);
                            }
                        } else {
                            if (res.name === 'Huile') {
                                thatResChance = Math.ceil(75*res.batch/3);
                            } else if (res.name === 'Eau') {
                                if (ruinsEmpty) {
                                    thatResChance = Math.ceil(100*res.batch/3);
                                } else {
                                    thatResChance = Math.ceil(300*res.batch/3);
                                }
                            } else {
                                thatResChance = Math.ceil(resFactor/3*res.batch/3);
                            }
                            if (res.cat === 'blue') {
                                thatResChance = Math.ceil(thatResChance/3*mapFactor/7);
                            } else if (res.cat === 'blue-sky') {
                                thatResChance = Math.ceil(thatResChance/2*mapFactor/7);
                            } else if (res.cat === 'sky') {
                                thatResChance = Math.ceil(thatResChance/3*mapFactor/7);
                            }
                        }
                        console.log(res.name+' '+thatResChance);
                        if (rand.rand(1,1000) <= thatResChance) {
                            thatResNum = Math.ceil(Math.sqrt(Math.sqrt(thatResChance))*mapFactor/2*rand.rand(4,16))+rand.rand(0,9);
                            console.log('!GET : '+res.name+' '+thatResNum);
                            if (coffre.transRes[res.name] === undefined) {
                                coffre.transRes[res.name] = thatResNum;
                            } else {
                                coffre.transRes[res.name] = coffre.transRes[res.name]+thatResNum;
                            }
                            totalRes = totalRes+thatResNum;
                        }
                    }
                }
            });
        }
    }
};

function randomComp() {
    let theComp;
    let dice = rand.rand(1,22);
    if (true) {

    }
};
