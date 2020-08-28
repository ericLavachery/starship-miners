function generateNewMap() {
    zone = [];
    filterParams();
    createMap(mapSize);
    filterMap(zone);
    addRivers(zone);
    addRes(zone);
    writeMapStyles();
    showMap(zone,false);
    minimap();
    // function saveMap();
};

function createMap(size) {
    let newTile = {};
    let i = 0;
    let x = 1;
    let y = 1;
    let theId = 0;
    let thisTerrain = "P";
    let lastSeed = 3;
    let aboveSeed = 0;
    while (i < size*size) {
        newTile = {};
        newTile.id = i;
        newTile.x = x;
        newTile.y = y;
        newTile.terrain = nextTile(i,size);
        thisTerrain = newTile.terrain;
        if (i > mapSize) {
            aboveSeed = zone[i-mapSize].seed;
        } else {
            aboveSeed = 0;
        }
        newTile.seed = nextSeed(thisTerrain,lastSeed,aboveSeed);
        zone.push(newTile);
        lastSeed = newTile.seed;
        i++;
        y++;
        if (y > mapSize) {
            y = 1;
            x++;
        }
    }
    // console.log(zone);
};

function nextSeed(ter,ls,as) {
    let newSeed = 1;
    if (ter == "M") {
        newSeed = rand.rand(1,6);
        return rotateSeed(newSeed,ls,as);
    } else if (ter != "R") {
        if (rand.rand(1,specialSeed) == 1) {
            newSeed = rand.rand(4,6);
            return rotateSeed(newSeed,ls,as);
        } else {
            newSeed = rand.rand(1,3);
            return rotateSeed(newSeed,ls,as);
        }
    } else {
        if (rand.rand(1,specialSeed*2) == 1) {
            newSeed = rand.rand(4,6);
            return rotateSeed(newSeed,ls,as);
        } else {
            newSeed = rand.rand(1,3);
            return rotateSeed(newSeed,ls,as);
        }
    }
};

function rotateSeed(ns, ls, as) {
    let goodSeed = 1;
    if (ns == ls) {
        if (ns == 1) {
            goodSeed = 3;
            if (goodSeed == as) {
                goodSeed = 2;
            }
        } else {
            goodSeed = ns-1;
            if (goodSeed == as) {
                if (goodSeed == 1) {
                    goodSeed = 3;
                } else {
                    goodSeed = goodSeed-1;
                }
            }
        }
    } else {
        goodSeed = ns;
        if (goodSeed == as) {
            if (goodSeed == 1) {
                goodSeed = 3;
            } else {
                goodSeed = goodSeed-1;
            }
        }
    }
    return goodSeed;
};

function filterMap(map) {
    // change map
    let mapIndex;
    map.forEach(function(tile) {
        if (tile.terrain != filterBase[tile.terrain] && rand.rand(1,filterEffect) > 1) {
            mapIndex = zone.findIndex((obj => obj.id == tile.id));
            zone[mapIndex].terrain = filterBase[tile.terrain];
        }
    });
};

function filterParams() {
    if (filterVariance) {
        let diceMax = mapFilters.length+baseFilterChance-2;
        let fdice = rand.rand(0,diceMax);
        if (fdice > mapFilters.length-1) {
            filterBase = mapFilters[0];
        } else {
            filterBase = mapFilters[fdice];
        }
        maxTileCheck = rand.rand(4,5);
    } else {
        mapFilters.forEach(function(filter) {
            if (filter.name == mapFilterDefault) {
                filterBase = filter;
            }
        });
    }
    if (filterBase.spSeed != specialSeed) {
        specialSeed = filterBase.spSeed;
    }
    if (terSeedVariance) {
        let dice = rand.rand(1,17);
        switch (dice) {
            case 1:
            terSeed = 3;
            break;
            case 2:
            terSeed = 6;
            break;
            case 3:
            terSeed = 6;
            break;
            case 4:
            terSeed = 9;
            break;
            case 5:
            terSeed = 9;
            break;
            case 6:
            terSeed = 9;
            break;
            case 7:
            terSeed = 12;
            break;
            case 8:
            terSeed = 12;
            break;
            case 9:
            terSeed = 12;
            break;
            case 10:
            terSeed = 12;
            break;
            case 11:
            terSeed = 18;
            break;
            case 12:
            terSeed = 18;
            break;
            case 13:
            terSeed = 24;
            break;
            case 14:
            terSeed = 24;
            break;
            case 15:
            terSeed = 90;
            break;
            case 16:
            terSeed = 90;
            break;
            case 17:
            terSeed = 200;
            break;
            default:
            terSeed = terSeed;
        }
    }
    riverCurve = rand.rand(3,5);
    logFilters(filterBase.name, terSeed, riverCurve);
};

function logFilters(filtre, seed, curve) {
    console.log('NOUVELLE CARTE -------------------------');
    filtre = filtre.replace('Flood','Eau ');
    filtre = filtre.replace('Veg','Végétation ');
    filtre = filtre.replace('Scarp','Escarpement ');
    filtre = filtre.replace(' M',' -');
    filtre = filtre.replace(' P',' +');
    console.log('Filtre: '+filtre);
    let variance;
    switch (seed) {
        case 3:
        variance = "très forte";
        break;
        case 6:
        variance = "forte";
        break;
        case 9:
        variance = "moyenne +";
        break;
        case 12:
        variance = "moyenne";
        break;
        case 18:
        variance = "moyenne -";
        break;
        case 24:
        variance = "faible";
        break;
        case 90:
        variance = "très faible";
        break;
        case 200:
        variance = "extrèmement faible";
        break;
        default:
        variance = "erreur !!";
    }
    console.log('Variabilité: '+variance+' (seed '+seed+')');
    console.log('River Curve: '+curve);
    if (maxTileCheck === 4) {
        console.log('Tendance: Transversale');
    } else {
        console.log('Tendance: Droite');
    }
    // console.log(specialSeed);
};

function addRivers(map) {
    let direction;
    let dice = rand.rand(1,riverEW);
    let isRiver = false;
    if (dice < 3) {
        direction = rand.rand(1,4); // 1 is North, 2 is South
        addEWRiver(map,direction);
        isRiver = true;
        console.log('Rivière ouest-est');
    }
    direction = rand.rand(1,2); // 1 is West, 2 is East
    dice = rand.rand(1,riverNS);
    if (dice < 3) {
        addNSRiver(map,direction);
        isRiver = true;
        console.log('Rivière nord-sud');
    }
    dice = rand.rand(1,riverSN);
    if (dice < 3) {
        addSNRiver(map,direction);
        isRiver = true;
        console.log('Rivière sud-nord');
    }
    if (!isRiver) {
        console.log('Pas de rivière');
    }
};
function checkRiverSeed() {
    if (rand.rand(1,riverSeed) == 1) {
        newSeed = rand.rand(4,6);
    } else {
        newSeed = rand.rand(1,3);
    }
    return newSeed;
};
function addEWRiver(map, direction) {
    // début de la rivière
    let startLine = rand.rand(15,45);
    let startTileIndex = map.findIndex(
        obj => obj.x === startLine && obj.y === 1
    );
    let startTileId = map[startTileIndex].id;
    zone[startTileId].terrain = "R";
    zone[startTileId].river = "ew";
    // suite de la rivière
    let nextTileId = startTileId;
    let dice;
    let dirDice;
    let i = 1
    while (i < 500) {
        dice = rand.rand(1,riverCurve);
        dirDice = rand.rand(1,2);
        if (i === 1) {
            nextTileId = nextTileId+1;
        } else {
            if (dice === 1) {
                if (direction === 2 & dirDice === 1) {
                    nextTileId = nextTileId+mapSize;
                } else {
                    nextTileId = nextTileId-mapSize;
                }
            } else if (dice === 2) {
                if (direction === 1 & dirDice === 1) {
                    nextTileId = nextTileId-mapSize;
                } else {
                    nextTileId = nextTileId+mapSize;
                }
            } else {
                nextTileId = nextTileId+1;
            }
        }
        if (nextTileId < 0 || nextTileId > mapSize*mapSize-1) {
            // en dehors de la carte
            break;
        }
        if (zone[nextTileId].y == 60) {
            // arrivée de l'autre côté
            i = 500;
        }
        zone[nextTileId].seed = checkRiverSeed();
        zone[nextTileId].terrain = "R";
        zone[nextTileId].river = "ew";
        i++;
    }
};
function addNSRiver(map, direction) {
    // début de la rivière
    let startLine = rand.rand(15,45);
    let startTileIndex = map.findIndex(
        obj => obj.x === 1 && obj.y === startLine
    );
    let startTileId = map[startTileIndex].id;
    zone[startTileId].terrain = "R";
    zone[startTileId].river = "ns";
    // suite de la rivière
    let nextTileId = startTileId;
    let dice;
    let dirDice;
    let i = 1
    while (i < 500) {
        dice = rand.rand(1,riverCurve);
        dirDice = rand.rand(1,2);
        if (i === 1) {
            nextTileId = nextTileId+mapSize;
        } else {
            if (dice === 1) {
                if (direction === 2 & dirDice === 1) {
                    nextTileId = nextTileId+1;
                } else {
                    nextTileId = nextTileId-1;
                }
            } else if (dice === 2) {
                if (direction === 1 & dirDice === 1) {
                    nextTileId = nextTileId-1;
                } else {
                    nextTileId = nextTileId+1;
                }
            } else {
                nextTileId = nextTileId+mapSize;
            }
        }
        if (nextTileId < 0 || nextTileId > mapSize*mapSize-1) {
            // en dehors de la carte
            break;
        }
        if (zone[nextTileId].x == 60) {
            // arrivée de l'autre côté
            i = 500;
        }
        if (zone[nextTileId].terrain === "R" && zone[nextTileId].river != "ns") {
            // croise une autre rivière
            break;
        } else {
            zone[nextTileId].seed = checkRiverSeed();
            zone[nextTileId].terrain = "R";
            zone[nextTileId].river = "ns";
        }
        i++;
    }
};
function addSNRiver(map, direction) {
    // début de la rivière
    let startLine = rand.rand(15,45);
    let startTileIndex = map.findIndex(
        obj => obj.x === 60 && obj.y === startLine
    );
    let startTileId = map[startTileIndex].id;
    zone[startTileId].terrain = "R";
    zone[startTileId].river = "sn";
    // suite de la rivière
    let nextTileId = startTileId;
    let dice;
    let dirDice;
    let i = 1
    while (i < 500) {
        dice = rand.rand(1,riverCurve);
        dirDice = rand.rand(1,2);
        if (i === 1) {
            nextTileId = nextTileId-mapSize;
        } else {
            if (dice === 1) {
                if (direction === 2 & dirDice === 1) {
                    nextTileId = nextTileId+1;
                } else {
                    nextTileId = nextTileId-1;
                }
            } else if (dice === 2) {
                if (direction === 1 & dirDice === 1) {
                    nextTileId = nextTileId-1;
                } else {
                    nextTileId = nextTileId+1;
                }
            } else {
                nextTileId = nextTileId-mapSize;
            }
        }
        if (nextTileId < 0 || nextTileId > mapSize*mapSize-1) {
            // en dehors de la carte
            break;
        }
        if (zone[nextTileId].x == 60) {
            // arrivée de l'autre côté
            i = 500;
        }
        if (zone[nextTileId].terrain === "R" && zone[nextTileId].river != "sn") {
            // croise une autre rivière
            break;
        } else {
            zone[nextTileId].seed = checkRiverSeed();
            zone[nextTileId].terrain = "R";
            zone[nextTileId].river = "sn";
        }
        i++;
    }
};

function nextTile(myTileIndex,size) {
    // définir le tile à vérifier
    let tileCheck = 0;
    if (myTileIndex >= size) {
        if (myTileIndex % size === 0) {
            // not first line, first col
            // console.log('not first line, first col');
            tileCheck = rand.rand(3,4);
        } else if (myTileIndex+1 % size === 0) {
            // not first line, last col
            // console.log('not first line, last col');
            tileCheck = rand.rand(1,3);
        } else {
            // middle
            // console.log('middle');
            tileCheck = rand.rand(1,maxTileCheck);
        }
    } else if (myTileIndex == 0) {
        // first tile
        // console.log('first tile');
        tileCheck = 0;
    } else {
        // first line, not first tile
        // console.log('first line, not first tile');
        tileCheck = 1;
    }

    // définir le terrain du tile à vérifier
    let checkTileTerrain = "P";
    let checkTileIndex = 0;
    if (tileCheck == 0) {
        checkTileTerrain = "X";
    } else {
        if (tileCheck == 1) {
            checkTileIndex = myTileIndex-1;
        }
        if (tileCheck == 2) {
            checkTileIndex = myTileIndex-size-1;
        }
        if (tileCheck == 3) {
            checkTileIndex = myTileIndex-size;
        }
        if (tileCheck == 4) {
            checkTileIndex = myTileIndex-size+1;
        }
        if (tileCheck == 5) {
            if (rand.rand(1,3) === 1) {
                checkTileIndex = myTileIndex-size+1;
            } else {
                checkTileIndex = myTileIndex-size;
            }
        }
        checkTileTerrain = zone[checkTileIndex].terrain;
    }

    // define next tile
    let diceMax = 16;
    if (checkTileTerrain != "X") {
        if (checkTileTerrain == "S") {
            diceMax = Math.round(diceMax*terSeed/1.5);
        } else {
            diceMax = diceMax*terSeed;
        }
    }
    let diceCheck = rand.rand(1,diceMax);
    let swampCheck = rand.rand(1,swampWater);
    let mountCheck = rand.rand(1,mountHills);
    if (diceCheck == 1) {
        return "M"; // Mountains
    }
    if (diceCheck == 2 || diceCheck == 3) {
        return "H"; // Hills
    }
    if (diceCheck == 4 || diceCheck == 5 || diceCheck == 6 || diceCheck == 16) {
        return "P"; // Plains
    }
    if (diceCheck == 7 || diceCheck == 8 || diceCheck == 9) {
        return "G"; // Grasslands
    }
    if (diceCheck == 10 || diceCheck == 11) {
        return "B"; // Bushes
    }
    if (diceCheck == 12 || diceCheck == 13) {
        return "F"; // Forest
    }
    if (diceCheck == 14) {
        return "S"; // Swamps
    }
    if (diceCheck == 15) {
        return "W"; // Water
    }
    if (diceCheck >= 17) {
        if (checkTileTerrain == "W" && swampCheck == 1) {
            return "S"; // Swamps
        } else {
            if (checkTileTerrain == "S" && swampCheck == 1) {
                return "W"; // Water
            } else {
                if (checkTileTerrain == "H" && mountCheck == 1) {
                    return "M"; // Mountains
                } else {
                    if (checkTileTerrain == "M" && mountCheck == 1) {
                        return "H"; // Hills
                    } else {
                        return checkTileTerrain; // Same as checkTile
                    }
                }
            }
        }
    }
};

function addRes(zone) {
    let resLevelDice;
    let mythicMin = Math.floor(playerInfos.mapDiff/2)-2;
    let mythicMax = playerInfos.mapDiff;
    let mythicNum = 0;
    let baseMin = 17+(playerInfos.mapDiff*3);
    let baseNum = 0;
    let redMin = Math.floor(playerInfos.mapDiff/1.5)+5;
    let redNum = 0;
    let terrain;
    let numBadTer = 0;
    let shufZone = _.shuffle(zone);
    console.log('baseMin:'+baseMin);
    console.log('redMin:'+redMin);
    console.log('mythicMin:'+mythicMin);
    shufZone.forEach(function(tile) {
        if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
            terrain = getTileTerrain(tile.id);
            if (terrain.name === 'S' || terrain.name === 'W' || terrain.name === 'F') {
                numBadTer++;
            }
            if (rand.rand(1,terrain.minChance) === 1) {
                baseNum++;
                resLevelDice = checkResLevel(tile);
                if (resLevelDice >= 4 && mythicNum >= mythicMax) {
                    tile.rq = 1;
                } else {
                    tile.rq = resLevelDice;
                    if (resLevelDice === 3) {
                        redNum++;
                    }
                }
            }
        }
    });
    // not enough base
    if (baseNum < baseMin) {
        console.log('rebelote !!!');
        shufZone.forEach(function(tile) {
            if (tile.rq === undefined) {
                if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                    terrain = getTileTerrain(tile.id);
                    if (rand.rand(1,terrain.minChance) === 1) {
                        if (baseNum < baseMin || rand.rand(1,4) === 1) {
                            resLevelDice = checkResLevel(tile);
                            if (resLevelDice >= 4 && mythicNum >= mythicMax) {
                                tile.rq = 1;
                            } else {
                                tile.rq = resLevelDice;
                                if (resLevelDice === 3) {
                                    redNum++;
                                }
                            }
                            baseNum++;
                        }
                    }
                }
            }
        });
    }
    // not enough red
    if (redNum < redMin) {
        console.log('red rebelotte !!!');
        shufZone.forEach(function(tile) {
            if (tile.rq === undefined) {
                if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                    terrain = getTileTerrain(tile.id);
                    if (rand.rand(1,terrain.minChance) === 1) {
                        if (redNum < redMin) {
                            tile.rq = 3;
                            redNum++;
                            baseNum++;
                        }
                    }
                }
            }
        });
    }
    console.log('baseNum:'+baseNum);
    console.log('redNum:'+redNum);
    let fewRedRarityAdj = 50+Math.round(33*redMin*3/redNum);
    if (fewRedRarityAdj < 100) {
        fewRedRarityAdj = 100;
    }
    console.log('fewRedRarityAdj:'+fewRedRarityAdj);
    // blue mythics
    let silverChance = Math.round(30000000/numBadTer/((playerInfos.mapDiff+3)*(playerInfos.mapDiff+3)));
    shufZone.forEach(function(tile) {
        if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
            terrain = getTileTerrain(tile.id);
            if (terrain.name === 'S' || terrain.name === 'F') {
                if (rand.rand(1,silverChance) === 1) {
                    tile.rq = 4;
                    mythicNum = mythicNum+0.5;
                }
            }
        }
    });
    // not enough mythics
    if (mythicNum < mythicMin) {
        shufZone.forEach(function(tile) {
            if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                if (tile.rq === undefined) {
                    if (mythicNum < mythicMin) {
                        tile.rq = 5;
                        mythicNum++;
                    }
                }
            }
        });
    }
    console.log('mythicNum:'+mythicNum);
    // débordement rouge
    let adjTile;
    zone.forEach(function(tile) {
        if (tile.rq === 3) {
            adjTile = tile.id-mapSize-1;
            checkAdjRes(adjTile);
            adjTile = tile.id-mapSize;
            checkAdjRes(adjTile);
            adjTile = tile.id-mapSize+1;
            checkAdjRes(adjTile);
            adjTile = tile.id-1;
            checkAdjRes(adjTile);
            adjTile = tile.id+1;
            checkAdjRes(adjTile);
            adjTile = tile.id+mapSize-1;
            checkAdjRes(adjTile);
            adjTile = tile.id+mapSize;
            checkAdjRes(adjTile);
            adjTile = tile.id+mapSize+1;
            checkAdjRes(adjTile);
        }
    });
    // RESSOURCES
    // adjust res rarity
    let bestRarity = 0;
    let resDefault;
    let maxDice = Math.floor(playerInfos.mapDiff/2)+5;
    let rarityDice;
    let altDice;
    let minDice = 1;
    let blueSum = 0;
    let skySum = 0;
    let scrapRarity;
    resTypes.forEach(function(res) {
        if (res.cat === 'white') {
            minDice = 1;
            if (res.name === 'Scrap') {
                minDice = 0;
            }
            rarityDice = rand.rand(minDice,maxDice);
            altDice = rand.rand(minDice,maxDice);
            if (altDice < rarityDice) {
                rarityDice = altDice;
            }
            if (rarityDice <= Math.ceil(maxDice/2)-1) {
                if (res.name === 'Scrap') {
                    rarityDice = 0;
                } else {
                    rarityDice == 1;
                }
            }
            res.adjRarity = Math.floor(res.rarity*rarityDice/5*fewRedRarityAdj/100);
            res.adjBatch = Math.ceil(res.batch*Math.sqrt(rarityDice)/2*fewRedRarityAdj/100);
            if (res.adjBatch < 1) {
                res.adjBatch = 1;
            }
            if (res.name === 'Scrap') {
                scrapRarity = res.adjRarity;
            }
            if (res.adjRarity > bestRarity && res.name != 'Scrap') {
                bestRarity = res.adjRarity;
                resDefault = res;
            }
        }
        if (res.cat.includes('blue')) {
            blueSum = blueSum+res.rarity;
        }
        if (res.cat.includes('sky')) {
            skySum = skySum+res.rarity;
        }
    });
    console.log('scrapRarity: '+scrapRarity);
    // check RUINS
    let ruinChance = Math.floor(((scrapRarity*ruinRarity/10)+ruinRarity)/3);
    if (ruinChance > 15) {
        ruinChance = 15;
    }
    if (ruinChance < 3) {
        ruinChance = 3;
    }
    let resName = 'Scrap';
    let numRuins = 0;
    zone.forEach(function(tile) {
        if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
            if (tile.rq === undefined && tile.terrain != 'W' && tile.terrain != 'R') {
                if (rand.rand(1,1500) <= ruinChance) {
                    tile.ruins = true;
                    tile.rq = 0;
                    tile.rs = {};
                    tile.rs[resName] = Math.round(77*rand.rand(25,90)/resBatchDiv)+rand.rand(0,9);
                    numRuins++;
                }
            }
        }
    });
    zone.forEach(function(tile) {
        if (tile.ruins) {
            tile.sh = numRuins;
        }
    });
    // check res
    let sortedRes = _.sortBy(_.sortBy(resTypes,'rarity'),'adjRarity').reverse();
    let resChance;
    let mythicDice;
    let mythicSum = 0;
    let mythicRes = {};
    zone.forEach(function(tile) {
        if (tile.rq >= 1) {
            tile.rs = {};
        }
        if (tile.rq >= 4) {
            if (tile.rq === 5) {
                mythicDice = rand.rand(1,skySum);
            } else {
                mythicDice = rand.rand(1,blueSum);
            }
            mythicSum = 0;
            mythicRes = {};
            resTypes.forEach(function(res) {
                if ((res.cat.includes('blue') && tile.rq === 4) || (res.cat.includes('sky') && tile.rq === 5)) {
                    mythicSum = mythicSum+res.rarity;
                    if (mythicSum >= mythicDice && Object.keys(mythicRes).length <= 0) {
                        mythicRes = res;
                    }
                }
            });
            tile.rs[mythicRes.name] = mythicRes.batch*(tile.rq-2)*(tile.rq-3)*rand.rand(3,9);
            if (mythicRes.bld === 'Derrick' || mythicRes.bld === 'Mine') {
                let bldFactor = 2;
                if (mythicRes.bld === 'Derrick') {
                    bldFactor = 6;
                }
                resTypes.forEach(function(res) {
                    if (res.bld === mythicRes.bld) {
                        if (rand.rand(1,100) <= Math.round((res.rarity+9)/12*bldFactor)) {
                            tile.rs[res.name] = res.batch*res.batch*rand.rand(6,12);
                        }
                    }
                });
            }
        } else if (tile.rq >= 1) {
            terrain = getTileTerrain(tile.id);
            // PASS 1
            sortedRes.forEach(function(res) {
                if (res.cat === 'white') {
                    resChance = Math.round(res.adjRarity*tile.rq*tile.rq/resFoundDiv);
                    if (res.bld === 'Derrick') {
                        if (terrain.scarp <= 1) {
                            resChance = Math.round(resChance*1.6);
                        } else {
                            resChance = Math.round(resChance*0.67);
                        }
                    } else if (res.bld === 'Mine') {
                        if (terrain.scarp >= 2) {
                            resChance = Math.round(resChance*1.1);
                        } else {
                            resChance = Math.round(resChance*0.33);
                        }
                    }
                    if (rand.rand(1,100) <= resChance) {
                        tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv);
                    }
                }
            });
            if (tile.rq === 2) {
                if (Object.keys(tile.rs).length <= 1) {
                    // PASS 2
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white') {
                            if (Object.keys(tile.rs).length <= 1) {
                                if (tile.rs[res.name] === undefined) {
                                    if (rand.rand(1,8) === 1) {
                                        tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv);
                                    }
                                }
                            }
                        }
                    });
                }
                if (Object.keys(tile.rs).length <= 1) {
                    // PASS 3
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white') {
                            if (Object.keys(tile.rs).length <= 1) {
                                if (tile.rs[res.name] === undefined) {
                                    tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv);
                                }
                            }
                        }
                    });
                }
            } else if (tile.rq === 3) {
                if (Object.keys(tile.rs).length <= 3) {
                    // PASS 2
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white') {
                            if (Object.keys(tile.rs).length <= 3) {
                                if (tile.rs[res.name] === undefined) {
                                    if (rand.rand(1,8) === 1) {
                                        tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv);
                                    }
                                }
                            }
                        }
                    });
                }
                if (Object.keys(tile.rs).length <= 3) {
                    // PASS 3
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white') {
                            if (Object.keys(tile.rs).length <= 3) {
                                if (tile.rs[res.name] === undefined) {
                                    tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv);
                                }
                            }
                        }
                    });
                }
            }
            // PASS 4
            if (Object.keys(tile.rs).length <= 0) {
                tile.rs[resDefault.name] = Math.round(resDefault.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv);
            }
        }
    });
    console.log(zone);
};

function checkAdjRes(adjTile) {
    if (adjTile >= 0 && adjTile <= 3599) {
        if (zone[adjTile].rq === undefined) {
            let terrain = getTileTerrain(adjTile);
            if (rand.rand(1,Math.ceil((terrain.minChance+100)/50)) === 1) {
                if (rand.rand(1,2) === 1) {
                    zone[adjTile].rq = 1;
                } else {
                    zone[adjTile].rq = 2;
                }
            }
        }
    }
};

function checkResLevel(tile) {
    let resLevelDice = rand.rand(1,100);
    let mythicChance = Math.round((playerInfos.mapDiff+2)*(playerInfos.mapDiff+2)/18);
    if (resLevelDice <= mythicChance) {
        return 5;
    } else if (resLevelDice <= 52) {
        return 1;
    } else if (resLevelDice <= 84) {
        return 2;
    } else {
        return 3;
    }
};
