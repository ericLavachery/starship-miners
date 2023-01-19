function putThisBat(unitId,ammo1,ammo2,armorName,equipName,tileId,citoyens,xp,startTag,show) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselTriche = true;
    conselAmmos = [ammo1,ammo2,armorName,equipName];
    putBat(tileId,citoyens,xp,startTag,show);
    playerOccupiedTiles.push(tileId);
};

function searchRuins(apCost) {
    let tile = getTile(selectedBat);
    let ruinType = checkRuinType(tile,false);
    if (tile.ruins && tile.sh >= 1) {
        console.log('RUINS');
        selectedBat.apLeft = selectedBat.apLeft-apCost;
        checkRuinsCit(tile);
        checkRuinsRes(tile);
        checkRuinsPack(tile);
        checkRuinsComp(tile);
        if (zone[0].mapDiff >= 2) {
            checkRuinsUnit(tile);
        }
        if (!ruinsEmpty) {
            putRuinsCit(tile);
        }
        checkRuinsAliens(tile);
        if (selectedBat.tags.includes('fortif')) {
            tagIndex = selectedBat.tags.indexOf('fortif');
            selectedBat.tags.splice(tagIndex,1);
        }
        if (ruinsAlien) {
            alienSounds(0);
        } else if (!ruinsEmpty) {
            fxSound('cheer1');
        } else {
            let nf = rand.rand(1,3);
            fxSound('fouille'+nf);
        }
        tile.sh = -1;
        // saveMap();
        selectedBat.xp = selectedBat.xp+1;
        playerInfos.gangXP = playerInfos.gangXP+1;
        tagDelete(selectedBat,'guet');
        doneAction(selectedBat);
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
        ruinsEmpty = true;
        ruinsAlien = false;
        coffreTileId = -1;
    }
};

function checkRuinsComp(tile) {
    let maxComps = Math.ceil(zone[0].mapDiff/2.6);
    if (playerInfos.fndComps < maxComps) {
        let foundComp = {};
        let compOK = false;
        let compChance = ruinsCompBase;
        let ruinType = checkRuinType(tile,false);
        if (ruinType.name === 'Université' || ruinType.name === 'Bibliothèque' || ruinType.name === 'Médiathèque' || ruinType.name === 'Laboratoire' || ruinType.name === 'Centre de recherches') {
            compChance = compChance*5;
        } else {
            compChance = Math.round(compChance/1.75);
        }
        let compDice = 350+(playerInfos.fndComps*150);
        if (rand.rand(1,compDice) <= compChance) {
            let i = 1;
            while (i <= 5) {
                foundComp = randomComp(7,28);
                compOK = isFoundCompOK(foundComp);
                if (compOK) {
                    break;
                }
                if (i > 6) {break;}
                i++
            }
            if (compOK) {
                playerInfos.comp[foundComp.name] = playerInfos.comp[foundComp.name]+1;
                playerInfos.fndComps = playerInfos.fndComps+1;
                warning('Compétence trouvée',foundComp.fullName+' +1 (maintenant au niveau '+playerInfos.comp[foundComp.name]+')');
                fxSound('winstuff');
                // savePlayerInfos();
            }
        }
    }
}

function testRuinsComp() {
    let foundComp = {};
    let compOK = false;
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
        // savePlayerInfos();
    }
}

function isFoundCompOK(foundComp) {
    let compOK = true;
    let playerCompLvl = playerInfos.comp[foundComp.name];
    console.log('comp='+foundComp.name);
    console.log('playerCompLvl='+playerCompLvl);
    console.log('maxLevel='+foundComp.maxLevel);
    console.log('lvlCosts='+foundComp.lvlCosts[playerCompLvl+1]);
    if (playerCompLvl >= foundComp.maxLevel) {
        compOK = false;
    } else if (foundComp.lvlCosts[playerCompLvl+1] === 2) {
        compOK = false;
    } else if (playerCompLvl === 4) {
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
    let citChance = ruinsCitBase/Math.sqrt(numRuins+8);
    citChance = citChance*playerInfos.cNeed;
    if (tile.rt != undefined) {
        let checkz = tile.rt.checks.length;
        if (checkz === 0) {
            checkz = 0.5;
        }
        if (tile.rt.checks.includes('food')) {
            if (tile.rt.checks.includes('military') || tile.rt.checks.includes('medecine')) {
                citChance = citChance*3.5*checkz;
            } else {
                citChance = citChance*1.5*checkz;
            }
        } else {
            citChance = citChance/3*checkz;
        }
        citChance = Math.ceil(citChance/1.67);
    } else {
        citChance = Math.ceil(citChance);
    }
    if (zone[0].dark) {
        citChance = citChance+10;
    }
    let citDice = 86+Math.ceil(playerInfos.fndCits*citChance/2);
    console.log('citChance: '+citChance);
    console.log('citDice: '+citDice);
    if (rand.rand(1,citDice) <= citChance) {
        ruinsEmpty = false;
        playerInfos.fndCits = playerInfos.fndCits+1;
    }
};

function putRuinsCit(tile) {
    let numRuins = tile.sh;
    if (numRuins > 50) {
        numRuins = 50;
    }
    let citId = 126;
    if (rand.rand(1,ruinsCrimChance) === 1) {
        citId = 225;
    }
    let badTer = zone[0].pf+zone[0].pw+zone[0].pr+zone[0].ps;
    let terFactor = 1.75;
    if (badTer >= 25) {
        terFactor = terFactor+((badTer-25)/25*0.5);
    }
    let ncFactor = Math.round((Math.sqrt(numRuins)+0.75)*terFactor);
    if (zone[0].dark) {
        ncFactor = ncFactor+1;
    }
    let numCit = rand.rand(1,ncFactor)*6;
    playerInfos.allCits = playerInfos.allCits+numCit;
    let restCit = numCit;
    if (restCit <= 72) {
        conselTriche = true;
        putBatAround(tile.id,false,'noWater',citId,restCit);
        restCit = 0;
    } else {
        conselTriche = true;
        putBatAround(tile.id,false,'noWater',citId,72);
        restCit = restCit-72;
    }
    if (restCit >= 1) {
        if (restCit <= 72) {
            conselTriche = true;
            putBatAround(tile.id,false,'noWater',citId,restCit);
            restCit = 0;
        } else {
            conselTriche = true;
            putBatAround(tile.id,false,'noWater',citId,72);
            restCit = restCit-72;
        }
    }
    if (restCit >= 1) {
        if (restCit <= 72) {
            conselTriche = true;
            putBatAround(tile.id,false,'noWater',citId,restCit);
            restCit = 0;
        } else {
            conselTriche = true;
            putBatAround(tile.id,false,'noWater',citId,72);
            restCit = restCit-72;
        }
    }
    playerOccupiedTileList();
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
    let mapLevel = zone[0].mapDiff+2;
    let alienLevels = zone[0].mapDiff+Math.round(numRuins/7);
    let alienNumbers = zone[0].mapDiff+Math.round(numRuins/5);
    let alienChance = Math.round(mapLevel*Math.sqrt(numRuins)*ruinsBugBase/25);
    if (alienChance > 35) {
        alienChance = 35;
    }
    console.log('alienChance: '+alienChance);
    console.log('alienLevels: '+alienLevels);
    console.log('alienNumbers: '+alienNumbers);
    if (rand.rand(1,100) <= alienChance) {
        let maxDice = 3;
        let numAliens = 1;
        let alienTypeId = -1;
        let shufAliens = _.shuffle(alienUnits);
        shufAliens.forEach(function(unit) {
            if (alienTypeId < 0) {
                let alienInfo = ruinsAliensInfo(unit,tile);
                if (alienInfo.ok && alienLevels >= alienInfo.kxp && zone[0].mapDiff >= Math.ceil(alienInfo.kxp/2)) {
                    alienTypeId = unit.id;
                    console.log(unit.name);
                    console.log(alienInfo);
                    maxDice = Math.round((alienNumbers-alienInfo.kxp)/1.5);
                    console.log('maxDice: '+maxDice);
                    if (maxDice < 1) {
                        maxDice = 1;
                    }
                    numAliens = rand.rand(1,maxDice);
                    let numCheck = rand.rand(1,maxDice);
                    if (numCheck < numAliens) {
                        numAliens = numCheck;
                    }
                    console.log('numAliens: '+numAliens);
                }
            }
        });
        if (alienTypeId >= 0) {
            let i = 1;
            while (i <= numAliens) {
                putBatAround(tile.id,true,'any',alienTypeId,0);
                if (i > 6) {break;}
                i++
            }
        }
        ruinsAlien = true;
        selectedBat.apLeft = selectedBat.apLeft+selectedBat.ap;
        alienOccupiedTileList();
    }
};

function ruinsAliensInfo(unit,tile) {
    let alienInfo = {};
    if (unit.class != 'A' && unit.class != 'S' && unit.class != 'X' && unit.class != 'G') {
        if (unit.name != 'Asticots' && unit.name != 'Vers' && unit.name != 'Sangsues') {
            if (unit.skills.includes('fouisseur') || unit.size <= 15) {
                alienInfo.ok = true;
            }
        } else {
            if (tile.terrain === 'S' || tile.terrain === 'W' || tile.terrain === 'L') {
                alienInfo.ok = true;
            } else {
                alienInfo.ok = false;
            }
        }
    } else {
        alienInfo.ok = false;
    }
    if (alienInfo.ok) {
        alienInfo.kxp = unit.killXP;
    }
    return alienInfo;
};

function putBatAround(tileId,alien,dropWhere,unitId,numCit,tag) {
    console.log(alien);
    let dropTile = -1;
    if (dropWhere === 'near') {
        dropTile = coffreDrop(tileId);
    } else if (dropWhere === 'noWater') {
        dropTile = checkDropSafe(tileId);
    } else if (dropWhere === 'inPlace') {
        dropTile = tileId;
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
                if (tile.ruins) {
                    if (tile.sh >= 0) {
                        thisDistance = thisDistance+5;
                    }
                }
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
                    if (tile.ruins) {
                        if (tile.sh >= 0) {
                            thisDistance = thisDistance+5;
                        }
                    }
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

function checkDropAny(layBatTileId) {
    let possibleDrops = [];
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
                possibleDrops.push(tile.id);
            }
        }
    });
    if (possibleDrops.length < 1) {
        let distance;
        shufZone.forEach(function(tile) {
            distance = calcDistance(layBatTileId,tile.id);
            if (distance <= 2) {
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
    if (possibleDrops.length < 1) {
        let distance;
        shufZone.forEach(function(tile) {
            distance = calcDistance(layBatTileId,tile.id);
            if (distance <= 3) {
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

function checkDropSafe(layBatTileId) {
    let possibleDrops = [];
    let batHere = false;
    let tileDrop = -1;
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (isAdjacent(layBatTileId,tile.id)) {
            if (tile.rd && tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') {
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
                if (tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') {
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
            if (tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') {
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

function checkResByKind(resKind,coffre,tile,recNum) {
    // resKind : food, science, construction, military, industry, medecine, any
    recNum = recNum+1;
    let totalRes = 0;
    let thatResChance = 0;
    let thatResNum = 0;
    let mapFactor = Math.round(((Math.sqrt(zone[0].mapDiff+2)*10)+zone[0].mapDiff)/8);
    let resFactor;
    resTypes.forEach(function(res) {
        if (res.name != 'Magma' && res.name != 'Scrap' && res.name != 'Corps' && res.cat != 'alien') {
            if (res.kinds.includes(resKind)) {
                thatResChance = 0;
                thatResNum = 0;
                resFactor = res.rarity+Math.round(zone[0].mapDiff*3);
                if (res.name == 'Nourriture') {
                    if (ruinsEmpty) {
                        thatResChance = Math.ceil(200*res.batch/3);
                    } else {
                        thatResChance = Math.ceil(500*res.batch/3);
                    }
                } else if (res.name.includes('Compo')) {
                    thatResChance = Math.ceil((resFactor-100)*1.7*res.batch/3);
                } else if (res.cat == 'transfo') {
                    if (res.name === 'Energie') {
                        thatResChance = 150;
                    } else if (res.name === 'Energons') {
                        thatResChance = Math.ceil(resFactor*1.7*res.batch/3);
                    } else if (res.name != 'Transorb') {
                        thatResChance = Math.ceil(resFactor*1.7*res.batch/3);
                    }
                } else {
                    if (res.name === 'Huile') {
                        thatResChance = Math.ceil(150*res.batch/3);
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
                        thatResChance = Math.ceil(thatResChance/2*mapFactor/4);
                    } else if (res.cat === 'blue-sky') {
                        thatResChance = Math.ceil(thatResChance/1.5*mapFactor/4);
                    } else if (res.cat === 'sky') {
                        thatResChance = Math.ceil(thatResChance/2*mapFactor/4);
                    }
                }
                let diffBonus = zone[0].mapDiff*zone[0].mapDiff/200;
                thatResChance = thatResChance*(playerInfos.comp.tri+1)/4;
                if (res.name == 'Nourriture' || res.name == 'Viande' || res.name == 'Fruits') {
                    thatResChance = thatResChance/(zone[0].mapDiff+8)*9;
                    diffBonus = 0;
                    if (ruinsEmpty && resKind != 'food') {
                        thatResChance = thatResChance/5;
                    }
                }
                let resPlanetFactor = 1;
                if (res.planets != undefined) {
                    let planetName = zone[0].planet;
                    resPlanetFactor = res.planets[planetName];
                }
                resPlanetFactor = resPlanetFactor+diffBonus;
                thatResChance = Math.ceil(thatResChance*resPlanetFactor);
                if (resKind != 'any' && resKind != 'industry') {
                    thatResChance = thatResChance*2;
                }
                if (resKind === 'energy') {
                    if (res.name === 'Energons' || res.name === 'Energie') {
                        thatResChance = thatResChance*3;
                    }
                }
                if (resKind === 'military') {
                    if (res.name === 'Munitions') {
                        thatResChance = thatResChance*5;
                    }
                }
                if (resKind === 'auto') {
                    if (res.name === 'Fuel' || res.name === 'Moteurs') {
                        thatResChance = thatResChance*5;
                    }
                }
                if (tile.rt != undefined) {
                    if (res.name === 'Drogues') {
                        if (tile.rt.name === 'Hôpital' || tile.rt.name === 'Pharmacie' || tile.rt.name === 'Clinique') {
                            thatResChance = thatResChance*5;
                        }
                    }
                    if (res.name === 'Octiron') {
                        if (tile.rt.name === 'Hôpital') {
                            thatResChance = thatResChance*3;
                        }
                    }
                    if (res.name === 'Explosifs') {
                        if (tile.rt.name === 'Caserne') {
                            thatResChance = thatResChance*5;
                        }
                    }
                }
                console.log(res.name+' '+thatResChance);
                if (rand.rand(1,1000) <= thatResChance) {
                    thatResNum = Math.ceil(Math.sqrt(Math.sqrt(thatResChance))*mapFactor*1.5*rand.rand(4,16))+rand.rand(0,9);
                    if (res.name == 'Nourriture' || res.name == 'Viande' || res.name == 'Fruits') {
                        thatResNum = thatResNum/(zone[0].mapDiff+8)*6;
                    }
                    if (resKind === 'energy') {
                        if (res.name === 'Energons') {
                            thatResNum = thatResNum*5;
                        }
                        if (res.name === 'Energie') {
                            thatResNum = thatResNum*10;
                        }
                    }
                    if (resKind === 'auto') {
                        if (res.name === 'Fuel' || res.name === 'Moteurs') {
                            thatResNum = thatResNum*1.5;
                        }
                    }
                    if (resKind === 'military') {
                        if (res.name === 'Munitions') {
                            thatResNum = thatResNum*1.5;
                        }
                    }
                    thatResNum = Math.ceil(thatResNum*150/mineRateDiv);
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
    if (coffre.transRes.Compo1 === undefined) {
        coffre.transRes.Compo1 = rand.rand(15,75);
    } else {
        coffre.transRes.Compo1 = coffre.transRes.Compo1+rand.rand(15,75);
    }
    if (totalRes <= 0 && recNum <= 4) {
        checkResByKind(resKind,coffre,tile,recNum);
    }
};

function checkNextRuinType(tile) {
    checkRuinType(tile,false,ruinsDices[0],ruinsDices[1]);
    if (ruinsDices[0] === 21 || ruinsDices[0] === 22) {
        if (ruinsDices[1] >= 14) {
            ruinsDices[1] = 1;
            ruinsDices[0] = 23;
        }
        ruinsDices[1]++;
    } else {
        if (ruinsDices[0] >= 24) {
            ruinsDices[0] = 0;
        }
        ruinsDices[1] = 1;
        ruinsDices[0]++;
    }
};

function checkRuinType(tile,quiet,dice1,dice2) {
    let ruinType = {};
    ruinType.name = '';
    ruinType.checks = [];
    ruinType.scrap = 300;
    if (tile.ruins) {
        if (tile.rt != undefined) {
            ruinType = tile.rt;
        } else {
            ruinType.name = 'Mine';
            ruinType.checks = ['any'];
            let checkDice1 = rand.rand(1,28);
            if (dice1 != undefined) {
                checkDice1 = dice1;
            }
            switch (checkDice1) {
                case 1:
                ruinType.name = 'Mine';
                ruinType.checks = ['any'];
                ruinType.scrap = 300;
                break;
                case 2:
                ruinType.name = 'Bidonvilles';
                ruinType.checks = [];
                ruinType.scrap = 200;
                // cit x0.1
                break;
                case 3:
                ruinType.name = 'Habitations';
                ruinType.checks = ['food'];
                ruinType.scrap = 200;
                // cit x0.9
                break;
                case 4:
                ruinType.name = 'Habitations';
                ruinType.checks = ['food'];
                ruinType.scrap = 200;
                // cit x0.9
                break;
                case 5:
                ruinType.name = 'Habitations';
                ruinType.checks = ['food'];
                ruinType.scrap = 200;
                // cit x0.9
                break;
                case 6:
                ruinType.name = 'Habitations';
                ruinType.checks = ['food','food'];
                ruinType.scrap = 200;
                // cit x0.9
                break;
                case 7:
                ruinType.name = 'Villas';
                ruinType.checks = ['food','food'];
                ruinType.scrap = 250;
                // cit x1.8
                break;
                case 8:
                ruinType.name = 'Ecole';
                ruinType.checks = ['food','food'];
                ruinType.scrap = 200;
                // cit x1.8
                break;
                case 9:
                ruinType.name = 'Pharmacie';
                ruinType.checks = ['medecine','medecine'];
                ruinType.scrap = 150;
                // cit x0.4
                break;
                case 10:
                ruinType.name = 'Bar';
                ruinType.checks = ['food'];
                ruinType.scrap = 150;
                // cit x0.9
                break;
                case 11:
                ruinType.name = 'Centre commercial';
                ruinType.checks = ['food','food','food','medecine','construction'];
                ruinType.scrap = 750;
                // cit x10.4
                break;
                case 12:
                ruinType.name = 'Garage';
                ruinType.checks = ['auto'];
                ruinType.scrap = 350;
                // cit x0.2
                break;
                case 13:
                ruinType.name = 'Station service';
                ruinType.checks = ['auto'];
                ruinType.scrap = 400;
                // cit x0.2
                break;
                case 14:
                ruinType.name = 'Dépot';
                ruinType.checks = ['any','any','any'];
                ruinType.scrap = 320;
                // cit x0.6
                break;
                case 15:
                ruinType.name = 'Chantier';
                ruinType.checks = ['construction','construction'];
                ruinType.scrap = 350;
                // cit x0.4
                break;
                case 16:
                ruinType.name = 'Atelier';
                ruinType.checks = ['industry'];
                ruinType.scrap = 400;
                // cit x0.2
                break;
                case 17:
                ruinType.name = 'Usine';
                ruinType.checks = ['industry','industry','industry'];
                ruinType.scrap = 700;
                // cit x0.6
                break;
                case 18:
                ruinType.name = 'Poste de police';
                ruinType.checks = ['food','military'];
                ruinType.scrap = 150;
                // cit x4.2
                break;
                case 19:
                ruinType.name = 'Armurerie';
                ruinType.checks = ['military'];
                ruinType.scrap = 200;
                // cit x0.2
                break;
                case 20:
                ruinType.name = 'Prison';
                ruinType.checks = ['food','medecine','military'];
                ruinType.scrap = 450;
                // cit x6.3
                break;
                case 21:
                ruinType.name = 'Spécial';
                ruinType.checks = [];
                ruinType.scrap = 200;
                break;
                case 22:
                ruinType.name = 'Spécial';
                ruinType.checks = [];
                ruinType.scrap = 200;
                break;
                default:
                ruinType.name = 'Mine';
                ruinType.checks = ['any'];
                ruinType.scrap = 300;
                // cit x0.2
            }
            if (ruinType.name === 'Spécial') {
                let checkDice2 = rand.rand(1,12);
                if (dice2 != undefined) {
                    checkDice2 = dice2;
                }
                switch (checkDice2) {
                    case 1:
                    ruinType.name = 'Caserne';
                    ruinType.checks = ['food','military','military','military','medecine'];
                    ruinType.scrap = 400;
                    // cit x10.4
                    break;
                    case 2:
                    ruinType.name = 'Caserne';
                    ruinType.checks = ['food','military','military','military','medecine'];
                    ruinType.scrap = 400;
                    // cit x10.4
                    break;
                    case 3:
                    ruinType.name = 'Clinique';
                    ruinType.checks = ['food','medecine','medecine'];
                    ruinType.scrap = 250;
                    // cit x4.2
                    break;
                    case 4:
                    ruinType.name = 'Hôpital';
                    ruinType.checks = ['food','medecine','medecine','medecine'];
                    ruinType.scrap = 450;
                    // cit x8.4
                    break;
                    case 5:
                    ruinType.name = 'Université';
                    ruinType.checks = ['food','food','science','science'];
                    ruinType.scrap = 800;
                    // cit x8.3
                    break;
                    case 6:
                    ruinType.name = 'Laboratoire';
                    ruinType.checks = ['any','science','science'];
                    ruinType.scrap = 400;
                    // cit x0.6
                    break;
                    case 7:
                    ruinType.name = 'Centre de recherches';
                    ruinType.checks = ['any','science','science','science'];
                    ruinType.scrap = 650;
                    // cit x0.8
                    break;
                    case 8:
                    ruinType.name = 'Bibliothèque';
                    ruinType.checks = [];
                    ruinType.scrap = 150;
                    // cit x0.1
                    break;
                    case 9:
                    ruinType.name = 'Médiathèque';
                    ruinType.checks = [];
                    ruinType.scrap = 250;
                    // cit x0.1
                    break;
                    case 10:
                    ruinType.name = 'Centrale électrique';
                    ruinType.checks = ['energy','energy','energy'];
                    ruinType.scrap = 400;
                    // cit x0.6
                    break;
                    case 11:
                    ruinType.name = 'Aéroport';
                    ruinType.checks = ['auto','auto','any','any'];
                    ruinType.scrap = 750;
                    // cit x0.8
                    break;
                    case 13:
                    ruinType.name = 'Port';
                    ruinType.checks = ['auto','industry','any','any'];
                    ruinType.scrap = 750;
                    // cit x0.8
                    break;
                    default:
                    ruinType.name = 'Centre de tri';
                    ruinType.checks = ['industry','any'];
                    ruinType.scrap = 800;
                    // cit x0.4
                }
            }
            tile.rt = ruinType;
            tile.rs['Scrap'] = Math.ceil(ruinType.scrap*rand.rand(8,14)/10)+rand.rand(0,9);
            if (!quiet) {
                warning(ruinType.name,'Ressources: '+toNiceString(ruinType.checks)+' / Scrap: '+tile.rs['Scrap']);
            }
        }
    }
    return ruinType;
};

function checkRuinsPack(tile) {
    if (tile.ap === undefined) {
        let ruinType = checkRuinType(tile,false);
        console.log('-------------------------------------------------------- RUINS PACK CHECK: '+ruinType.name);
        let ruinSize = ruinType.checks.length;
        if (ruinSize === 0) {
            ruinSize = 0.5;
        }
        if (ruinType.name === 'Bar') {
            ruinSize = 3;
        }
        if (ruinType.name === 'Pharmacie') {
            ruinSize = 3;
        }
        if (ruinType.name === 'Hôpital') {
            ruinSize = 6;
        }
        if (ruinType.name === 'Garage') {
            ruinSize = 3;
        }
        if (ruinType.name === 'Poste de police') {
            ruinSize = 4;
        }
        if (ruinType.name === 'Laboratoire' || ruinType.name === 'Centre de recherches') {
            ruinSize = ruinSize*3;
        }
        let thePack = '';
        let zoneFactor = Math.ceil((zone[0].mapDiff+8)/1.5);
        let minAmmoLevel = 1;
        if (zone[0].mapDiff >= 6) {
            minAmmoLevel = 2;
        }
        let shufArmors = _.shuffle(armorTypes);
        shufArmors.forEach(function(armor) {
            if (thePack === '') {
                if (armor.cat === 'drogue') {
                    if (armor.popIn.includes(ruinType.name)) {
                        let chance = armor.rarity*ruinSize;
                        if (armor.popIn[0] === ruinType.name) {
                            chance = chance*1.5;
                        }
                        chance = Math.ceil(chance);
                        let dice = 100;
                        let percent = Math.ceil(chance/dice*100);
                        console.log(armor.name+' = '+chance+'/'+dice+' = '+percent+'%');
                        if (rand.rand(1,dice) <= chance) {
                            thePack = 'drg_'+armor.name;
                            console.log('YEP!');
                        }
                    }
                }
                if (armor.cat === 'armor') {
                    if (armor.icon != undefined) {
                        if (armor.icon >= 1) {
                            if (armor.popIn.includes(ruinType.name)) {
                                let chance = (zoneFactor-(armor.icon*armor.icon))*ruinSize;
                                if (armor.popIn[0] === ruinType.name) {
                                    chance = chance*1.5;
                                }
                                chance = Math.ceil(chance);
                                let dice = 2500;
                                let percent = Math.ceil(chance/dice*100);
                                console.log(armor.name+' = '+chance+'/'+dice+' = '+percent+'%');
                                if (rand.rand(1,dice) <= chance) {
                                    thePack = 'prt_'+armor.name;
                                    console.log('YEP!');
                                }
                            }
                        }
                    }
                }
            }
        });
        let maxAmmoLevel = 0;
        if (ruinType.name === 'Poste de police' || ruinType.name === 'Prison') {
            maxAmmoLevel = 1;
        }
        if (ruinType.name === 'Caserne' || ruinType.name === 'Armurerie') {
            maxAmmoLevel = 3;
        }
        let shufAmmos = _.shuffle(ammoTypes);
        shufAmmos.forEach(function(ammo) {
            if (thePack === '') {
                if (ammo.icon != undefined) {
                    if (ammo.icon >= minAmmoLevel) {
                        let ammoOK = false;
                        if (ammo.name === 'freeze') {
                            if (ruinType.name === 'Laboratoire' || ruinType.name === 'Centre de recherches') {
                                ammoOK = true;
                            }
                        } else if (ammo.icon <= maxAmmoLevel) {
                            ammoOK = true;
                        }
                        if (ammoOK) {
                            let chance = (zoneFactor+2-(ammo.icon*ammo.icon))*ruinSize;
                            chance = Math.ceil(chance);
                            let dice = 500;
                            if (ammo.name === 'freeze') {
                                dice = 250;
                            } else if (ammo.name.includes('lame-')) {
                                dice = 2000;
                            } else if (ammo.name.includes('-')) {
                                dice = 1500;
                            }
                            let percent = Math.ceil(chance/dice*100);
                            console.log(ammo.name+' = '+chance+'/'+dice+' = '+percent+'%');
                            if (rand.rand(1,dice) <= chance) {
                                thePack = ammo.name;
                                console.log('YEP!');
                            }
                        }
                    }
                }
            }
        });
        if (thePack != '') {
            thePack = replacePack(thePack,false);
            tile.ap = thePack;
            showMap(zone,true);
        }
    }
};

function replacePack(oldPack,edited) {
    newPack = oldPack;
    if (playerInfos.gang === 'brasier') {
        if (oldPack === 'grenade-antichar') {
            newPack = 'molotov-pyrus';
        } else if (oldPack === 'grenade-flashbang' || oldPack === 'grenade-incendiaire') {
            newPack = 'molotov-slime';
        } else if (oldPack.includes('grenade')) {
            newPack = 'molotov-pyratol';
        }
    } else if (playerInfos.gang === 'detruas') {
        if (oldPack === 'molotov-slime') {
            newPack = 'grenade-gaz';
        } else if (oldPack === 'molotov-pyrus') {
            newPack = 'grenade-antichar';
        } else if (oldPack === 'molotov-pyratol') {
            newPack = 'grenade-nanite';
        }
    } else {
        if (rand.rand(1,3) != 1) {
            if (oldPack === 'grenade-antichar') {
                newPack = 'uranium';
            } else if (oldPack === 'grenade-flashbang') {
                newPack = 'teflon';
            } else if (oldPack === 'grenade-incendiaire') {
                newPack = 'incendiaire';
            } else if (oldPack === 'grenade-jello') {
                newPack = 'freeze';
            } else if (oldPack === 'grenade-gaz') {
                newPack = 'dunium';
            } else if (oldPack === 'grenade-nanite') {
                newPack = 'explosive';
            } else if (oldPack === 'molotov-slime') {
                newPack = 'salite';
            } else if (oldPack === 'molotov-pyrus') {
                newPack = 'timonium';
            } else if (oldPack === 'molotov-pyratol') {
                newPack = 'adamantium';
            }
        }
    }
    return newPack;
};

function checkRuinsRes(tile) {
    console.log('Check Ressources');
    coffreTileId = -1;
    let numRuins = tile.sh;
    if (numRuins > 50) {
        numRuins = 50;
    }
    let resChance = ruinsResBase-(zone[0].mapDiff*3)+15;
    let ruinType = checkRuinType(tile,false);
    console.log('resChance: '+resChance);
    if (ruinType.checks.length >= 1) {
        if (rand.rand(1,100) <= resChance) {
            conselTriche = true;
            putBatAround(tile.id,false,'near',239,0,'go');
            let coffre = getZoneBatByTileId(coffreTileId);
            playerOccupiedTileList();
            if (ruinType === undefined) {
                checkResByKind('any',coffre,tile,0);
            } else {
                ruinType.checks.forEach(function(checkKind) {
                    checkResByKind(checkKind,coffre,tile,0);
                });
            }
        }
    }
};

function checkMinMapDiff(unit) {
    let level = 99;
    let minMapDiff = 10;
    if (unit.levels.rednecks < level) {
        level = unit.levels.rednecks;
    }
    if (unit.levels.blades < level) {
        level = unit.levels.blades;
    }
    if (unit.levels.bulbos < level) {
        level = unit.levels.bulbos;
    }
    if (unit.levels.drogmulojs < level) {
        level = unit.levels.drogmulojs;
    }
    if (unit.levels.tiradores < level) {
        level = unit.levels.tiradores;
    }
    if (unit.levels.detruas < level) {
        level = unit.levels.detruas;
    }
    if (unit.levels.brasier < level) {
        level = unit.levels.brasier;
    }
    if (unit.kind === 'zero-resistance') {
        level = -10;
    }
    if (level <= 4 || unit.fabTime <= 20) {
        level = -10;
    }
    level = level-2;
    minMapDiff = Math.round((level-2)/2);
    return minMapDiff;
};

function checkRuinsUnit(tile) {
    let maxUnits = Math.ceil(zone[0].mapDiff/1.55)-1;
    if (playerInfos.fndUnits < maxUnits) {
        let fndBonus = (maxUnits-playerInfos.fndUnits)*50;
        let unitChance = ruinsUnitBase;
        let unitDice = 300-fndBonus;
        if (rand.rand(1,unitDice) <= unitChance) {
            let count = true;
            let chance = 0;
            let foundUnitId = -1;
            let checkDice = 450-fndBonus;
            let shufUnits = _.shuffle(unitTypes);
            shufUnits.forEach(function(unit) {
                if (foundUnitId < 0) {
                    if (unit.inRuin != undefined) {
                        let minDiff = checkMinMapDiff(unit);
                        if (minDiff <= zone[0].mapDiff) {
                            chance = unit.inRuin;
                            if (ruinsEmpty) {
                                if (rand.rand(1,checkDice*3) <= chance) {
                                    foundUnitId = unit.id;
                                    if (minDiff < -2) {
                                        count = false;
                                    }
                                }
                            } else {
                                if (rand.rand(1,checkDice) <= chance) {
                                    foundUnitId = unit.id;
                                    if (minDiff < -2) {
                                        count = false;
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if (foundUnitId >= 0) {
                let batType = getBatTypeById(foundUnitId);
                let unitCits = batType.squads*batType.crew*batType.squadSize;
                if (!batType.skills.includes('clone') && !batType.skills.includes('dog')) {
                    playerInfos.allCits = playerInfos.allCits+unitCits;
                }
                conselTriche = true;
                putBatAround(tile.id,false,'noWater',foundUnitId,0);
                if (count) {
                    playerInfos.fndUnits = playerInfos.fndUnits+1;
                }
                console.log('FOUND! '+batType.name);
                playerOccupiedTileList();
            }
        }
    }
}
