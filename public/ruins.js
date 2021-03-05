function searchRuins(apCost) {
    let tile = getTile(selectedBat);
    if (tile.ruins && tile.sh >= 1) {
        console.log('RUINS');
        selectedBat.apLeft = selectedBat.apLeft-apCost;
        checkRuinsCit(tile);
        checkRuinsAliens(tile);
        checkRuinsRes(tile);
        checkRuinsComp(tile);
        if (playerInfos.mapDiff >= 3) {
            checkRuinsUnit(tile);
        }
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
        // saveMap();
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
        ruinsEmpty = true;
        coffreTileId = -1;
    }
};

function checkRuinsComp(tile) {
    let foundComp = {};
    let compOK = false;
    let compChance = ruinsCompBase;
    if (rand.rand(1,150) <= compChance) {
        let i = 1;
        while (i <= 10) {
            foundComp = randomComp(7,28);
            compOK = isFoundCompOK(foundComp);
            if (compOK) {
                break;
            }
            if (i > 12) {break;}
            i++
        }
        if (compOK) {
            playerInfos.comp[foundComp.name] = playerInfos.comp[foundComp.name]+1;
            warning('Compétence trouvée',foundComp.fullName+' +1 (maintenant au niveau '+playerInfos.comp[foundComp.name]+')');
            savePlayerInfos();
        }
    }
}

function isFoundCompOK(foundComp) {
    let compOK = true;
    let playerCompLvl = playerInfos.comp[foundComp];
    if (playerCompLvl >= foundComp.maxLevel) {
        compOK = false;
    } else if (foundComp.lvlCosts[playerCompLvl+1] === 2) {
        compOK = false;
    }
    return compOK;
};

function randomComp(first,last) {
    let dice = rand.rand(first,last);
    let theComp = getCompById(dice);
    return theComp;
};

function checkRuinsCit(tile) {
    console.log('Check Citoyens');
    ruinsEmpty = true;
    let numRuins = tile.sh;
    if (numRuins > 50) {
        numRuins = 50;
    }
    let citChance = Math.round(ruinsCitBase/Math.sqrt(numRuins+8));
    let citId = 126;
    if (rand.rand(1,ruinsCrimChance) === 1) {
        citId = 225;
    }
    console.log('citChance: '+citChance);
    if (rand.rand(1,100) <= citChance) {
        let ncFactor = Math.round((Math.sqrt(numRuins)+0.75)*3);
        let numCit = rand.rand(1,ncFactor)*6;
        ruinsEmpty = false;
        console.log('numCit: '+numCit);
        let restCit = numCit;
        if (restCit <= 72) {
            conselTriche = true;
            putBatAround(tile.id,false,false,citId,restCit,true);
            restCit = 0;
        } else {
            conselTriche = true;
            putBatAround(tile.id,false,false,citId,72,true);
            restCit = restCit-72;
        }
        if (restCit >= 1) {
            if (restCit <= 72) {
                conselTriche = true;
                putBatAround(tile.id,false,false,citId,restCit,true);
                restCit = 0;
            } else {
                conselTriche = true;
                putBatAround(tile.id,false,false,citId,72,true);
                restCit = restCit-72;
            }
        }
        if (restCit >= 1) {
            if (restCit <= 72) {
                conselTriche = true;
                putBatAround(tile.id,false,false,citId,restCit,true);
                restCit = 0;
            } else {
                conselTriche = true;
                putBatAround(tile.id,false,false,citId,72,true);
                restCit = restCit-72;
            }
        }
    }
};

function checkRuinsAliens(tile) {
    console.log('Check Aliens');
    let numRuins = tile.sh;
    if (numRuins > 50) {
        numRuins = 50;
    }
    if (numRuins < 4) {
        numRuins = 4;
    }
    let mapLevel = playerInfos.mapDiff+2;
    let alienLevels = Math.round((playerInfos.mapDiff+(numRuins/5))/2);
    if (alienLevels < 1) {
        alienLevels = 1;
    }
    let alienChance = Math.round(mapLevel*Math.sqrt(numRuins)*ruinsBugBase/25);
    if (alienChance > 35) {
        alienChance = 35;
    }
    console.log('alienChance: '+alienChance);
    if (rand.rand(1,100) <= alienChance) {
        let maxDice = Math.ceil(alienLevels/2);
        if (maxDice < 1) {
            maxDice = 1;
        }
        let numAliens = rand.rand(1,maxDice);
        let numCheck = rand.rand(1,maxDice);
        if (numCheck < numAliens) {
            numAliens = numCheck;
        }
        let alienTypeId = -1;
        let alienOK = false;
        let shufAliens = _.shuffle(alienUnits);
        shufAliens.forEach(function(unit) {
            if (alienTypeId < 0) {
                alienOK = false;
                if (unit.class != 'A' && unit.class != 'S' && unit.class != 'X') {
                    if (unit.name != 'Asticots' && unit.name != 'Vers' && unit.name != 'Sangsues') {
                        if (alienLevels >= 6) {
                            if (unit.skills.includes('fouisseur')) {
                                alienOK = true;
                            }
                        }
                        if (alienLevels >= 4) {
                            if (unit.size <= 15) {
                                alienOK = true;
                            }
                        }
                        if (alienLevels >= 2) {
                            if (unit.size <= 9) {
                                alienOK = true;
                            }
                        }
                        if (unit.size <= 6) {
                            alienOK = true;
                        }
                        if (alienLevels <= 2 && unit.class === 'B') {
                            alienOK = false;
                        }
                    }
                }
                if (alienOK) {
                    alienTypeId = unit.id;
                }
            }
        });
        if (alienTypeId >= 0) {
            let i = 1;
            while (i <= numAliens) {
                putBatAround(tile.id,true,false,alienTypeId,0,false)
                if (i > 6) {break;}
                i++
            }
        }
        selectedBat.apLeft = selectedBat.apLeft+selectedBat.ap;
    }
};

function putBatAround(tileId,alien,near,unitId,numCit,noWater,tag) {
    console.log(alien);
    let dropTile = -1;
    if (near) {
        dropTile = coffreDrop(tileId);
    } else if (noWater) {
        dropTile = checkDropSafe(tileId);
    } else {
        dropTile = checkDrop(tileId);
    }
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
        putBat(dropTile,numCit,0,tag);
    }
};

function coffreDrop(layBatTileId) {
    let nearestDistance = 999;
    let thisDistance = 999;
    let batHere = false;
    let tileDrop = -1;
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (isAdjacent(layBatTileId,tile.id)) {
            batHere = false;
            bataillons.forEach(function(bat) {
                if (bat.loc === "zone" && bat.tileId === tile.id) {
                    batHere = true;
                }
            });
            if (!batHere) {
                aliens.forEach(function(bat) {
                    if (bat.loc === "zone" && bat.tileId === tile.id) {
                        batHere = true;
                    }
                });
            }
            if (!batHere) {
                thisDistance = calcDistance(playerInfos.myCenter,tile.id);
                if (thisDistance < nearestDistance) {
                    nearestDistance = thisDistance;
                    tileDrop = tile.id;
                }
            }
        }
    });
    if (tileDrop < 0) {
        let distance;
        shufZone.forEach(function(tile) {
            distance = calcDistance(layBatTileId,tile.id);
            if (distance === 2) {
                batHere = false;
                bataillons.forEach(function(bat) {
                    if (bat.loc === "zone" && bat.tileId === tile.id) {
                        batHere = true;
                    }
                });
                if (!batHere) {
                    aliens.forEach(function(bat) {
                        if (bat.loc === "zone" && bat.tileId === tile.id) {
                            batHere = true;
                        }
                    });
                }
                if (!batHere) {
                    thisDistance = calcDistance(playerInfos.myCenter,tile.id);
                    if (thisDistance < nearestDistance) {
                        nearestDistance = thisDistance;
                        tileDrop = tile.id;
                    }
                }
            }
        });
    }
    return tileDrop;
};

function checkDropSafe(layBatTileId) {
    let possibleDrops = [];
    let batHere = false;
    let tileDrop = -1;
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (isAdjacent(layBatTileId,tile.id)) {
            if (tile.rd && tile.terrain != 'W' && tile.terrain != 'R') {
                batHere = false;
                bataillons.forEach(function(bat) {
                    if (bat.loc === "zone" && bat.tileId === tile.id) {
                        batHere = true;
                    }
                });
                if (!batHere) {
                    aliens.forEach(function(bat) {
                        if (bat.loc === "zone" && bat.tileId === tile.id) {
                            batHere = true;
                        }
                    });
                }
                if (!batHere) {
                    possibleDrops.push(tile.id);
                }
            }
        }
    });
    if (possibleDrops.length < 1) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(layBatTileId,tile.id)) {
                if (tile.rd) {
                    batHere = false;
                    bataillons.forEach(function(bat) {
                        if (bat.loc === "zone" && bat.tileId === tile.id) {
                            batHere = true;
                        }
                    });
                    if (!batHere) {
                        aliens.forEach(function(bat) {
                            if (bat.loc === "zone" && bat.tileId === tile.id) {
                                batHere = true;
                            }
                        });
                    }
                    if (!batHere) {
                        possibleDrops.push(tile.id);
                    }
                }
            }
        });
    }
    if (possibleDrops.length < 1) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(layBatTileId,tile.id)) {
                if (tile.terrain != 'W' && tile.terrain != 'R') {
                    batHere = false;
                    bataillons.forEach(function(bat) {
                        if (bat.loc === "zone" && bat.tileId === tile.id) {
                            batHere = true;
                        }
                    });
                    if (!batHere) {
                        aliens.forEach(function(bat) {
                            if (bat.loc === "zone" && bat.tileId === tile.id) {
                                batHere = true;
                            }
                        });
                    }
                    if (!batHere) {
                        possibleDrops.push(tile.id);
                    }
                }
            }
        });
    }
    if (possibleDrops.length < 1) {
        let distance;
        shufZone.forEach(function(tile) {
            if (tile.terrain != 'W' && tile.terrain != 'R') {
                distance = calcDistance(layBatTileId,tile.id);
                if (distance <= 3 && distance >=2) {
                    batHere = false;
                    bataillons.forEach(function(bat) {
                        if (bat.loc === "zone" && bat.tileId === tile.id) {
                            batHere = true;
                        }
                    });
                    if (!batHere) {
                        aliens.forEach(function(bat) {
                            if (bat.loc === "zone" && bat.tileId === tile.id) {
                                batHere = true;
                            }
                        });
                    }
                    if (!batHere) {
                        possibleDrops.push(tile.id);
                    }
                }
            }
        });
    }
    if (possibleDrops.length < 1) {
        let distance;
        shufZone.forEach(function(tile) {
            distance = calcDistance(layBatTileId,tile.id);
            if (distance <= 3 && distance >=2) {
                batHere = false;
                bataillons.forEach(function(bat) {
                    if (bat.loc === "zone" && bat.tileId === tile.id) {
                        batHere = true;
                    }
                });
                if (!batHere) {
                    aliens.forEach(function(bat) {
                        if (bat.loc === "zone" && bat.tileId === tile.id) {
                            batHere = true;
                        }
                    });
                }
                if (!batHere) {
                    possibleDrops.push(tile.id);
                }
            }
        });
    }
    if (possibleDrops.length >= 1) {
        possibleDrops = [_.sample(possibleDrops)];
        tileDrop = possibleDrops[0];
    }
    return tileDrop;
};

function checkRuinsRes(tile) {
    console.log('Check Ressources');
    coffreTileId = -1;
    let numRuins = tile.sh;
    if (numRuins > 50) {
        numRuins = 50;
    }
    let resChance = ruinsResBase+(playerInfos.mapDiff*2)-10;
    console.log('resChance: '+resChance);
    if (rand.rand(1,100) <= resChance) {
        conselTriche = true;
        putBatAround(tile.id,false,true,239,0,true,'go');
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
                    thatResNum = Math.ceil(Math.sqrt(Math.sqrt(thatResChance))*mapFactor*1.5*rand.rand(4,16))+rand.rand(0,9);
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
                            thatResNum = Math.ceil(Math.sqrt(Math.sqrt(thatResChance))*mapFactor*2.5*rand.rand(4,16))+rand.rand(0,9);
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

function checkRuinsUnit(tile) {
    let chance = 0;
    let foundUnitId = -1;
    let shufUnits = _.shuffle(unitTypes);
    shufUnits.forEach(function(unit) {
        if (foundUnitId < 0) {
            if (unit.inRuin != undefined) {
                if (unit.fabTime > 50) {
                    chance = unit.inRuin-8+playerInfos.mapDiff;
                } else {
                    chance = unit.inRuin-3+Math.ceil(playerInfos.mapDiff/2);
                    if (chance > unit.inRuin) {
                        chance = unit.inRuin;
                    }
                }
                if (ruinsEmpty) {
                    if (unit.skills.includes('robot')) {
                        if (rand.rand(1,400) <= chance) {
                            foundUnitId = unit.id;
                        }
                    }
                } else {
                    if (rand.rand(1,130) <= chance) {
                        foundUnitId = unit.id;
                    }
                }
            }
        }
    });
    if (foundUnitId >= 0) {
        let batType = getBatTypeById(foundUnitId);
        conselTriche = true;
        putBatAround(tile.id,false,false,foundUnitId,0,true);
        console.log('FOUND! '+batType.name);
    }
}
