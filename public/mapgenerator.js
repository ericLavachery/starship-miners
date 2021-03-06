function generateVM() {
    zone = [];
    savePlayerInfos();
    filterParams();
    createVM(mapSize);
    washReports();
    // zoneReport(zone,false);
    let ensolFactor = rand.rand(25,35);
    let ensolBonus = rand.rand(0,80);
    zone[0].ensol = Math.round(100*ensolFactor/10)+ensolBonus;
    writeMapStyles();
    showMap(zone,false);
    minimap();
    commandes();
};

function createVM(size) {
    let nextZoneNum = 0;
    let newTile = {};
    let i = 0;
    let x = 1;
    let y = 1;
    let thisTerrain = "P";
    while (i < size*size) {
        newTile = {};
        newTile.id = i;
        if (newTile.id === 0) {
            newTile.number = nextZoneNum;
            newTile.dark = false;
            newTile.mapDiff = 0;
            newTile.pKind = '';
            newTile.gKind = '';
            newTile.sKind = '';
        }
        newTile.x = x;
        newTile.y = y;
        if (x > 25 && x < 37 && y > 23 && y < 39) {
            newTile.terrain = 'X';
            newTile.seed = rand.rand(1,6);
            // newTile.seed = 1;
        } else {
            newTile.terrain = 'V';
            newTile.seed = rand.rand(1,6);
        }
        zone.push(newTile);
        i++;
        y++;
        if (y > mapSize) {
            y = 1;
            x++;
        }
    }
};

function generateNewMap() {
    zone = [];
    playerInfos.sondeMaps = playerInfos.sondeMaps+1;
    playerInfos.allTurns = playerInfos.allTurns+3;
    savePlayerInfos();
    filterParams();
    createMap(mapSize);
    filterMap(zone);
    addRivers(zone);
    addRes(zone);
    washReports();
    zone[1830].terrain = 'P';
    zone[1830].seed = 1;
    zoneReport(zone,false);
    writeMapStyles();
    showMap(zone,false);
    minimap();
    commandes();
};

function createMap(size) {
    let nextZoneNum = getNextZoneNumber();
    let newTile = {};
    let i = 0;
    let x = 1;
    let y = 1;
    let theId = 0;
    let thisTerrain = "P";
    let lastSeed = 3;
    let aboveSeed = 0;
    let diag1Seed = 0;
    let diag2Seed = 0;
    while (i < size*size) {
        newTile = {};
        newTile.id = i;
        if (newTile.id === 0) {
            let planetName = getPlanetNameById(playerInfos.sondePlanet);
            newTile.planet = planetName;
            newTile.pid = playerInfos.sondePlanet;
            newTile.number = nextZoneNum;
            if (planetName === 'Sarak') {
                newTile.dark = true;
            } else {
                newTile.dark = false;
            }
            newTile.mapDiff = playerInfos.sondeDanger;
            newTile.pKind = checkMapKind('P');
            newTile.gKind = checkMapKind('G');
            newTile.sKind = checkMapKind('S');
            console.log('pKind='+newTile.pKind+' gKind='+newTile.gKind+' sKind='+newTile.sKind);
        }
        newTile.x = x;
        newTile.y = y;
        newTile.terrain = nextTile(i,size);
        thisTerrain = newTile.terrain;
        if (i > mapSize) {
            aboveSeed = zone[i-mapSize].seed;
        } else {
            aboveSeed = 0;
        }
        if (i > mapSize+1) {
            diag1Seed = zone[i-mapSize-1].seed;
        } else {
            diag1Seed = 0;
        }
        if (i > mapSize-1) {
            diag2Seed = zone[i-mapSize+1].seed;
        } else {
            diag2Seed = 0;
        }
        newTile.seed = nextSeed(thisTerrain,lastSeed,aboveSeed,diag1Seed,diag2Seed);
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

function checkMapKind(terName) {
    let dice = rand.rand(1,12);
    if (terName === 'P') {
        if (dice <= 6 || playerInfos.sondeDanger <= 1) {
            return 'bug';
        } else if (dice <= 8 || playerInfos.sondeDanger <= 2) {
            return 'spider';
        } else {
            return 'swarm';
        }
    } else if (terName === 'G') {
        if (dice <= 2 || playerInfos.sondeDanger <= 1) {
            return 'bug';
        } else if (dice <= 6 || playerInfos.sondeDanger <= 2) {
            return 'spider';
        } else if (dice <= 9) {
            return 'larve';
        } else {
            return 'swarm';
        }
    } else if (terName === 'S') {
        if (dice <= 2) {
            return 'bug';
        } else if (dice <= 4) {
            return 'spider';
        } else if (dice <= 10) {
            return 'larve';
        } else {
            return 'swarm';
        }
    }
};

function nextSeed(ter,ls,as,d1s,d2s) {
    let newSeed = 1;
    if (ter === 'M') {
        newSeed = rand.rand(1,12);
        return rotateSeed(newSeed,ls,as,d1s,d2s,ter);
    } else if (ter === 'H') {
        newSeed = rand.rand(1,12);
        return rotateSeed(newSeed,ls,as,d1s,d2s,ter);
    } else if (ter != 'R') {
        newSeed = rand.rand(1,6);
        return rotateSeed(newSeed,ls,as,d1s,d2s,ter);
    } else {
        if (rand.rand(1,specialSeed*2) == 1) {
            newSeed = rand.rand(4,6);
            return rotateSeed(newSeed,ls,as,d1s,d2s,ter);
        } else {
            newSeed = rand.rand(1,3);
            return rotateSeed(newSeed,ls,as,d1s,d2s,ter);
        }
    }
};

function rotateSeed(ns,ls,as,d1s,d2s,ter) {
    let goodSeed = ns;
    let i = 0;
    while (i <= 6) {
        if (goodSeed === ls || goodSeed === as || goodSeed === d1s || goodSeed === d2s) {
            goodSeed = goodSeed-1;
            if (goodSeed === 0) {
                if (ter === 'H') {
                    goodSeed = 12;
                } else if (ter === 'M') {
                    goodSeed = 12;
                } else {
                    goodSeed = 6;
                }
            }
        }
        if (i > 7) {break;}
        i++
    }
    return goodSeed;
};

function filterMap(map) {
    // change map
    let mapIndex;
    let newTerrain;
    let swap = true;
    map.forEach(function(tile) {
        newTerrain = filterBase[tile.terrain];
        if (tile.terrain != newTerrain) {
            if (newTerrain === 'H' || newTerrain === 'M') {
                if (rand.rand(1,filterEffect) > 1) {
                    if (tile.terrain === 'H' || tile.terrain === 'M') {
                        tile.terrain = newTerrain;
                    } else {
                        tile.terrain = newTerrain;
                        if (swap) {
                            tile.seed = tile.seed+6;
                        }
                    }
                }
            } else {
                if (tile.terrain === 'H' || tile.terrain === 'M') {
                    if (tile.seed <= 6) {
                        tile.terrain = newTerrain;
                    }
                } else {
                    if (rand.rand(1,filterEffect) > 1) {
                        tile.terrain = newTerrain;
                    }
                }
            }
            if (swap) {
                swap = false;
            } else {
                swap = true;
            }
            // mapIndex = zone.findIndex((obj => obj.id == tile.id));
            // zone[mapIndex].terrain = newTerrain;
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
        if (playerInfos.sondePlanet === 5) {
            // HORST: pas d'innondations
            if (filterBase.name === 'FloodP2') {
                filterBase = mapFilters[5];
            }
            if (filterBase.name === 'FloodP1') {
                filterBase = mapFilters[6];
            }
            // HORST: moins de végétaux
            if (filterBase.name === 'VegP2') {
                filterBase = mapFilters[1];
            }
            if (filterBase.name === 'VegP1') {
                filterBase = mapFilters[2];
            }
        }
        if (playerInfos.sondePlanet === 4) {
            // KZIN: tjrs montagnes
            if (filterBase.name === 'ScarpM2') {
                filterBase = mapFilters[0];
            }
            if (filterBase.name === 'ScarpM1') {
                filterBase = mapFilters[2];
            }
            // KZIN: moins d'innondations
            if (filterBase.name === 'FloodP2') {
                filterBase = mapFilters[11];
            }
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
    let newSeed;
    if (rand.rand(1,riverSeed) == 1) {
        newSeed = rand.rand(4,6);
    } else {
        newSeed = rand.rand(1,3);
    }
    return newSeed;
};
function addEWRiver(map,direction) {
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
function addNSRiver(map,direction) {
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
function addSNRiver(map,direction) {
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
    let mythicMin = Math.floor(playerInfos.sondeDanger/2)-4;
    let mythicMax = playerInfos.sondeDanger-2;
    let mythicNum = 0;
    let baseMin = 17+(playerInfos.sondeDanger*3);
    let baseNum = 0;
    let redMin = Math.floor(playerInfos.sondeDanger/1.42)+5;
    let redNum = 0;
    if (zone[0].planet != 'Dom') {
        mythicMin = mythicMin+Math.floor(playerInfos.sondeDanger/3);
        mythicMax = mythicMax+Math.floor(playerInfos.sondeDanger/2);
        baseMin = baseMin+Math.floor(playerInfos.sondeDanger*2.5);
        redMin = redMin+Math.floor(playerInfos.sondeDanger*1.5);
    }
    let terrain;
    let minChance;
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
            minChance = terrain.minChance;
            if (tile.x >= 21 && tile.x <= 41 && tile.y >= 21 && tile.y <= 41) {
                minChance = Math.ceil(((Math.sqrt(minChance+25)*1.5)+(minChance))/2.5);
                minChance = Math.round(minChance/(playerInfos.comp.det+5)*5);
            }
            if (rand.rand(1,minChance) === 1) {
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
    if (playerInfos.sondeDanger >= 1) {
        let silverChance = Math.round(30000000/numBadTer/((playerInfos.sondeDanger+3)*(playerInfos.sondeDanger+3)));
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
    }
    console.log('mythicNum:'+mythicNum);
    // débordement rouge
    let adjTile;
    zone.forEach(function(tile) {
        if (tile.rq >= 3) {
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
    let maxDice = Math.floor(playerInfos.sondeDanger/2)+5;
    let rarityDice;
    let altDice;
    let minDice = 1;
    let blueSum = 0;
    let skySum = 0;
    let scrapRarity;
    let resRarity;
    resTypes.forEach(function(res) {
        resRarity = res.rarity;
        if (res.planets != undefined) {
            let planetName = zone[0].planet;
            resRarity = Math.ceil(resRarity*res.planets[planetName]);
        }
        if (playerInfos.sondeDanger < 1) {
            resRarity = resRarity-rand.rand(15,20);
            if (res.name === 'Scrap') {
                resRarity = 0;
            }
            if (resRarity < 0) {
                resRarity = 0;
            }
        }
        if (res.cat === 'white') {
            minDice = 1;
            if (res.name === 'Scrap') {
                minDice = 0;
            }
            if (res.name === 'Scrap') {
                rarityDice = rand.rand(minDice,maxDice+2);
                altDice = rand.rand(minDice,maxDice+2);
            } else {
                rarityDice = rand.rand(minDice,maxDice);
                altDice = rand.rand(minDice,maxDice);
            }
            if (altDice < rarityDice) {
                rarityDice = altDice;
            }
            if (rarityDice <= Math.ceil(maxDice/2)-1) {
                if (res.name === 'Scrap') {
                    rarityDice = 0;
                } else {
                    rarityDice = 1;
                }
            }
            res.adjRarity = Math.floor(resRarity*rarityDice/5*fewRedRarityAdj/100);
            res.adjBatch = Math.ceil(res.batch*fewRedRarityAdj/100);
            if (res.adjBatch < 1) {
                res.adjBatch = 1;
            }
            if (res.name === 'Scrap') {
                scrapRarity = res.adjRarity;
            }
            if (res.adjRarity > bestRarity && res.name != 'Scrap' && res.name != 'Huile' && res.name != 'Fruits') {
                bestRarity = res.adjRarity;
                resDefault = res;
            }
        }
        if (res.cat.includes('blue')) {
            blueSum = blueSum+resRarity;
        }
        if (res.cat.includes('sky')) {
            skySum = skySum+resRarity;
        }
    });
    console.log('scrapRarity: '+scrapRarity);
    // check RUINS
    let ruinChance = Math.floor(((scrapRarity*ruinRarity/10)+ruinRarity)/3);
    let resScrap = getResByName('Scrap');
    ruinChance = Math.round(ruinChance*resScrap.planets[zone[0].planet]);
    if (ruinChance > 15) {
        ruinChance = 15;
    }
    if (zone[0].planet === 'Dom') {
        if (ruinChance < 3) {
            ruinChance = 3;
        }
    } else {
        if (ruinChance < 0) {
            ruinChance = 0;
        }
    }
    console.log('ruinChance='+ruinChance);
    let resName = 'Scrap';
    let numRuins = 0;
    if (playerInfos.sondeDanger >= 1 && ruinChance >= 1) {
        zone.forEach(function(tile) {
            if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                if (tile.rq === undefined && tile.terrain != 'W' && tile.terrain != 'R') {
                    if (rand.rand(1,1500) <= ruinChance) {
                        tile.ruins = true;
                        tile.rd = true;
                        tile.rq = 0;
                        tile.rs = {};
                        tile.rs[resName] = Math.round(107*rand.rand(25,90)/resBatchDiv)+rand.rand(0,9);
                        numRuins++;
                    }
                }
            }
        });
    }
    // check RES
    let sortedRes = _.sortBy(_.sortBy(resTypes,'rarity'),'adjRarity').reverse();
    let resChance;
    let mythicDice;
    let mythicSum = 0;
    let mythicRes = {};
    let mapResBatchDiv = resBatchDiv;
    if (playerInfos.sondeDanger < 1) {
        mapResBatchDiv = Math.round(mapResBatchDiv*1.75);
    } else {
        mapResBatchDiv = Math.round(mapResBatchDiv*(ruinChance+26)/35);
    }
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
                    resRarity = res.rarity;
                    if (res.planets != undefined) {
                        let planetName = zone[0].planet;
                        resRarity = Math.ceil(resRarity*res.planets[planetName]);
                    }
                    mythicSum = mythicSum+resRarity;
                    if (mythicSum >= mythicDice && Object.keys(mythicRes).length <= 0) {
                        mythicRes = res;
                    }
                }
            });
            tile.rs[mythicRes.name] = mythicRes.batch*(tile.rq-2)*(tile.rq-3)*rand.rand(5,11);
            // RAJOUT DE RESSOURCES AUX POINTS BLEUS
            let mythicResBld = mythicRes.bld;
            if (mythicResBld === 'Comptoir') {
                mythicResBld = 'Mine';
            }
            let bldFactor = 4;
            if (mythicResBld === 'Derrick') {
                bldFactor = 9;
            }
            resTypes.forEach(function(res) {
                if (res.bld === mythicResBld || (mythicRes.bld === 'Comptoir' && res.bld === 'Comptoir' && res.cat != 'zero')) {
                    resRarity = res.rarity;
                    if (res.planets != undefined) {
                        let planetName = zone[0].planet;
                        resRarity = Math.ceil(resRarity*res.planets[planetName]);
                    }
                    if (resRarity >= 1) {
                        resRarity = resRarity+9;
                        if (mythicRes.bld === 'Comptoir' && res.bld === 'Comptoir') {
                            resRarity = resRarity+20;
                        }
                        if (mythicRes.bld === 'Comptoir' && res.name === 'Huile') {
                            resRarity = resRarity+23;
                        }
                        if (rand.rand(1,100) <= Math.round((resRarity)/10*bldFactor)) {
                            let rajResBatch = res.batch;
                            if (mythicRes.bld === 'Comptoir' && res.name === 'Huile') {
                                rajResBatch = rajResBatch+3;
                            }
                            tile.rs[res.name] = (rajResBatch*rajResBatch*rand.rand(8,18))+rand.rand(0,9);
                        }
                    }
                }
            });
        } else if (tile.rq >= 1) {
            let isGas = 'maybe';
            let firstRes = true;
            terrain = getTileTerrain(tile.id);
            // PASS 1
            sortedRes.forEach(function(res) {
                if (res.cat === 'white') {
                    if ((res.name === 'Huile' || res.name === 'Fruits') && tile.terrain != 'F' && tile.terrain != 'B' && tile.terrain != 'S') {
                        resChance = 0;
                    } else {
                        resChance = Math.round(res.adjRarity*tile.rq*tile.rq/resFoundDiv);
                    }
                    if (res.pter != undefined) {
                        if (res.pter.includes(terrain.name)) {
                            resChance = Math.ceil(resChance*res.pter[0]);
                        } else {
                            resChance = Math.ceil(resChance/2);
                        }
                    }
                    if (res.bld === 'Derrick') {
                        if (isGas === 'yes') {
                            resChance = Math.round(resChance*3);
                        } else {
                            if (terrain.scarp <= 1) {
                                resChance = Math.round(resChance*1.4);
                                if (tile.rq >= 2 && terrain.veg <= 1 && isGas === 'maybe') {
                                    resChance = Math.round(resChance*1.4);
                                }
                            } else {
                                resChance = Math.round(resChance*0.7);
                            }
                        }
                    } else if (res.bld === 'Mine') {
                        if (terrain.scarp >= 2) {
                            resChance = Math.round(resChance*1.1);
                        } else {
                            resChance = Math.round(resChance*0.7);
                            if (tile.rq >= 2 && terrain.veg <= 1 && isGas === 'maybe') {
                                resChance = Math.round(resChance*0.7);
                            }
                        }
                    }
                    if (rand.rand(1,100) <= resChance) {
                        if (res.name === 'Scrap') {
                            tile.ruins = true;
                            tile.rd = true;
                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv/0.8)+rand.rand(0,9);
                        } else {
                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/mapResBatchDiv)+rand.rand(0,9);
                        }
                        if (firstRes) {
                            if (res.bld === 'Derrick') {
                                isGas = 'yes';
                            } else {
                                isGas = 'no';
                            }
                        }
                        firstRes = false;
                    }
                }
            });
            if (tile.rq === 2 && playerInfos.sondeDanger >= 1) {
                if (Object.keys(tile.rs).length <= 2) {
                    // JAUNE PASS 2
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white' && res.name != 'Huile' && res.name != 'Fruits') {
                            if (Object.keys(tile.rs).length <= 1) {
                                if (tile.rs[res.name] === undefined) {
                                    if (rand.rand(1,8) === 1) {
                                        if (res.name === 'Scrap') {
                                            tile.ruins = true;
                                            tile.rd = true;
                                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv/0.8)+rand.rand(0,9);
                                        } else {
                                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/mapResBatchDiv)+rand.rand(0,9);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                if (Object.keys(tile.rs).length <= 2) {
                    // JAUNE PASS 3
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white' && res.name != 'Huile' && res.name != 'Fruits') {
                            if (Object.keys(tile.rs).length <= 1) {
                                if (tile.rs[res.name] === undefined) {
                                    if (rand.rand(1,5) === 1) {
                                        if (res.name === 'Scrap') {
                                            tile.ruins = true;
                                            tile.rd = true;
                                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv/0.8)+rand.rand(0,9);
                                        } else {
                                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/mapResBatchDiv)+rand.rand(0,9);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                if (Object.keys(tile.rs).length <= 2) {
                    // JAUNE PASS 4
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white' && res.name != 'Scrap' && res.name != 'Huile' && res.name != 'Fruits') {
                            if (Object.keys(tile.rs).length <= 1) {
                                if (tile.rs[res.name] === undefined) {
                                    tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/mapResBatchDiv)+rand.rand(0,9);
                                }
                            }
                        }
                    });
                }
            } else if (tile.rq === 3 && playerInfos.sondeDanger >= 1) {
                if (Object.keys(tile.rs).length <= 4) {
                    // ROUGE PASS 2
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white' && res.name != 'Huile' && res.name != 'Fruits') {
                            if (Object.keys(tile.rs).length <= 3) {
                                if (tile.rs[res.name] === undefined) {
                                    if (rand.rand(1,8) === 1) {
                                        if (res.name === 'Scrap') {
                                            tile.ruins = true;
                                            tile.rd = true;
                                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv/0.8)+rand.rand(0,9);
                                        } else {
                                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/mapResBatchDiv)+rand.rand(0,9);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                if (Object.keys(tile.rs).length <= 4) {
                    // ROUGE PASS 3
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white' && res.name != 'Huile' && res.name != 'Fruits') {
                            if (Object.keys(tile.rs).length <= 3) {
                                if (tile.rs[res.name] === undefined) {
                                    if (rand.rand(1,5) === 1) {
                                        if (res.name === 'Scrap') {
                                            tile.ruins = true;
                                            tile.rd = true;
                                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/resBatchDiv/0.8)+rand.rand(0,9);
                                        } else {
                                            tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/mapResBatchDiv)+rand.rand(0,9);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                if (Object.keys(tile.rs).length <= 4) {
                    // ROUGE PASS 4
                    sortedRes.forEach(function(res) {
                        if (res.cat === 'white' && res.name != 'Scrap' && res.name != 'Huile' && res.name != 'Fruits') {
                            if (Object.keys(tile.rs).length <= 3) {
                                if (tile.rs[res.name] === undefined) {
                                    tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/mapResBatchDiv)+rand.rand(0,9);
                                }
                            }
                        }
                    });
                }
            }
            // PASS 5
            if (Object.keys(tile.rs).length <= 0) {
                sortedRes.forEach(function(res) {
                    if (res.cat === 'white' && res.name != 'Scrap' && res.name != 'Huile' && res.name != 'Fruits') {
                        if (Object.keys(tile.rs).length <= 0) {
                            if (tile.rs[res.name] === undefined) {
                                if (rand.rand(1,3) === 1) {
                                    tile.rs[res.name] = Math.round(res.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/mapResBatchDiv)+rand.rand(0,9);
                                }
                            }
                        }
                    }
                });
            }
            // PASS 6
            if (Object.keys(tile.rs).length <= 0) {
                tile.rs[resDefault.name] = Math.round(resDefault.adjBatch*(tile.rq+2)*(tile.rq+2)*rand.rand(3,9)*5/mapResBatchDiv)+rand.rand(0,9);
            }
        }
    });
    // REAJUSTER NOMBRE DE RUINES (tile.sh)
    let realNumberOfRuins = 0;
    zone.forEach(function(tile) {
        if (tile.ruins) {
            realNumberOfRuins++;
        }
    });
    let nothingUnder = 175-(realNumberOfRuins*4);
    zone.forEach(function(tile) {
        if (tile.ruins) {
            tile.sh = realNumberOfRuins;
            addRoad(tile.id);
        }
        if (tile.rq != undefined) {
            if (tile.rq >= 1) {
                Object.entries(tile.rs).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (value < nothingUnder) {
                        // console.log(key+'='+value);
                        value = rand.rand(nothingUnder,nothingUnder+value);
                        tile.rs[key] = value;
                        // console.log('new '+key+'='+value);
                    }
                });
            }
        }
    });
    console.log('realNumberOfRuins='+realNumberOfRuins);
    console.log('nothing under '+nothingUnder);
    // Reajuster les couleurs de gisements
    atomsColors(zone);
    // MAGMA
    if (rand.rand(1,magmaZone) === 1) {
        let magName = 'Magma';
        let magChance = rand.rand(1,4)*100;
        shufZone.forEach(function(tile) {
            if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                terrain = getTileTerrain(tile.id);
                if (terrain.name != 'M' && tile.rq === undefined) {
                    if (rand.rand(1,magChance) === 1) {
                        tile.rq = 1;
                        tile.rs = {};
                        tile.rs[magName] = rand.rand(250,450);
                    }
                }
            }
        });
    }
    // HUILE & FRUITS
    let oilName = 'Huile';
    let oilChance = (rand.rand(2,6)*60)-Math.round(numBadTer/50)-(playerInfos.sondeDanger*5);
    let oilRes = getResByName('Huile');
    oilChance = Math.round(oilChance/oilRes.planets[zone[0].planet]);
    let oilHere = false;
    let fruName = 'Fruits';
    let fruChance = (rand.rand(2,6)*20);
    let fruRes = getResByName('Fruits');
    fruChance = Math.round(fruChance/fruRes.planets[zone[0].planet]);
    let fruHere = false;
    console.log('numBadTer: '+numBadTer);
    if (playerInfos.sondeDanger >= 1) {
        shufZone.forEach(function(tile) {
            if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                terrain = getTileTerrain(tile.id);
                resHere = false;
                if (tile.rq === undefined) {
                    if (tile.terrain === 'S' || tile.terrain === 'B' || tile.terrain === 'F') {
                        oilHere = false;
                        fruHere = false;
                        if (tile.terrain === 'S') {
                            if (rand.rand(1,oilChance) === 1) {
                                oilHere = true;
                            }
                            if (rand.rand(1,fruChance*3) === 1) {
                                fruHere = true;
                            }
                            if (oilHere || fruHere) {
                                tile.rq = 1;
                                tile.rs = {};
                            }
                            if (oilHere) {
                                tile.rs[oilName] = rand.rand(80,320)+Math.round(numBadTer/72);
                            }
                            if (fruHere) {
                                tile.rs[fruName] = rand.rand(80,240);
                            }
                        }
                        if (tile.terrain === 'B') {
                            if (rand.rand(1,Math.round(oilChance/2)) === 1) {
                                oilHere = true;
                            }
                            if (rand.rand(1,fruChance) === 1) {
                                fruHere = true;
                            }
                            if (oilHere || fruHere) {
                                tile.rq = 1;
                                tile.rs = {};
                            }
                            if (oilHere) {
                                tile.rs[oilName] = rand.rand(30,140)+Math.round(numBadTer/36);
                            }
                            if (fruHere) {
                                tile.rs[fruName] = rand.rand(80,320);
                            }
                        }
                        if (tile.terrain === 'F') {
                            if (rand.rand(1,oilChance*2) === 1) {
                                oilHere = true;
                            }
                            if (rand.rand(1,Math.round(fruChance/2)) === 1) {
                                fruHere = true;
                            }
                            if (oilHere || fruHere) {
                                tile.rq = 1;
                                tile.rs = {};
                            }
                            if (oilHere) {
                                tile.rs[oilName] = rand.rand(30,240)+Math.round(numBadTer/72);
                            }
                            if (fruHere) {
                                tile.rs[fruName] = rand.rand(80,640);
                            }
                        }
                    }
                }
            }
        });
    }
    // console.log(zone);
};

function addRoad(startTileId) {
    let generalDir = rand.rand(1,4); // n,e,s,o
    makeRoad(startTileId,generalDir);
    generalDir = generalDir+2;
    if (generalDir > 4) {
        generalDir = generalDir-4;
    }
    makeRoad(startTileId,generalDir);
};

function makeRoad(startTileId,generalDir) {
    let longueur = rand.rand(3,5);
    let dirDice;
    let nextTileId = startTileId;
    let oldTileId = startTileId;
    let bridge = false;
    if (zone[nextTileId].terrain === 'W' || zone[nextTileId].terrain === 'R') {
        bridge = true;
    }
    let i = 1
    while (i <= longueur) {
        oldTileId = nextTileId;
        bridge = false;
        if (zone[oldTileId].terrain === 'W' || zone[oldTileId].terrain === 'R') {
            bridge = true;
        }
        dirDice = rand.rand(1,4);
        if (generalDir === 1) {
            if (dirDice === 1) {
                nextTileId = nextTileId-mapSize-1;
            } else if (dirDice === 2) {
                nextTileId = nextTileId-mapSize+1;
            } else {
                nextTileId = nextTileId-mapSize;
            }
        } else if (generalDir === 2) {
            if (dirDice === 1) {
                nextTileId = nextTileId+1+mapSize;
            } else if (dirDice === 2) {
                nextTileId = nextTileId+1-mapSize;
            } else {
                nextTileId = nextTileId+1;
            }
        } else if (generalDir === 3) {
            if (dirDice === 1) {
                nextTileId = nextTileId+mapSize+1;
            } else if (dirDice === 2) {
                nextTileId = nextTileId+mapSize-1;
            } else {
                nextTileId = nextTileId+mapSize;
            }
        } else if (generalDir === 4) {
            if (dirDice === 1) {
                nextTileId = nextTileId-1+mapSize;
            } else if (dirDice === 2) {
                nextTileId = nextTileId-1-mapSize;
            } else {
                nextTileId = nextTileId-1;
            }
        }
        if (zone[nextTileId].x >= 60 || zone[nextTileId].y >= 60 || zone[nextTileId].x <= 1 || zone[nextTileId].y <= 1 || zone[nextTileId].rd || anyRoadAround(nextTileId,oldTileId)) {
            i = 500;
        }
        if (zone[nextTileId].terrain === 'W' || zone[nextTileId].terrain === 'R') {
            if (bridge) {
                i = 500;
                zone[oldTileId].rd = false;
            } else {
                i = i-1;
                zone[nextTileId].rd = true;
            }
        } else if (zone[nextTileId].terrain === 'M' || zone[nextTileId].terrain === 'S' || zone[nextTileId].terrain === 'F') {
            i = i-1;
            zone[nextTileId].rd = true;
        } else {
            zone[nextTileId].rd = true;
        }
        i++;
    }
};

function anyRoadAround(tileId,prevTileId) {
    let anyRoad = false
    let thisTileId = tileId+1;
    if (zone[thisTileId].rd && thisTileId != prevTileId) {
        anyRoad = true;
    }
    thisTileId = tileId+1+mapSize;
    if (zone[thisTileId].rd && thisTileId != prevTileId) {
        anyRoad = true;
    }
    thisTileId = tileId+1-mapSize;
    if (zone[thisTileId].rd && thisTileId != prevTileId) {
        anyRoad = true;
    }
    thisTileId = tileId-1;
    if (zone[thisTileId].rd && thisTileId != prevTileId) {
        anyRoad = true;
    }
    thisTileId = tileId-1+mapSize;
    if (zone[thisTileId].rd && thisTileId != prevTileId) {
        anyRoad = true;
    }
    thisTileId = tileId-1-mapSize;
    if (zone[thisTileId].rd && thisTileId != prevTileId) {
        anyRoad = true;
    }
    thisTileId = tileId+mapSize;
    if (zone[thisTileId].rd && thisTileId != prevTileId) {
        anyRoad = true;
    }
    thisTileId = tileId-mapSize;
    if (zone[thisTileId].rd && thisTileId != prevTileId) {
        anyRoad = true;
    }
    return anyRoad;
}

function checkAdjRes(adjTile) {
    if (adjTile >= 0 && adjTile <= 3599) {
        if (zone[adjTile].rq === undefined) {
            let terrain = getTileTerrain(adjTile);
            if (rand.rand(1,Math.ceil((terrain.minChance+200)/100)) === 1) {
                if (rand.rand(1,3) === 1) {
                    zone[adjTile].rq = 1;
                } else {
                    zone[adjTile].rq = 2;
                }
            }
        }
    }
};

function checkResLevel(tile) {
    let resLevelDice = rand.rand(1,1000);
    let detekt = 950-(playerInfos.comp.det*25);
    if (tile.x >= 21 && tile.x <= 41 && tile.y >= 21 && tile.y <= 41) {
        resLevelDice = rand.rand(20,detekt);
    }
    let mythicChance = Math.round((playerInfos.sondeDanger+2)*(playerInfos.sondeDanger+2)/3);
    if (playerInfos.sondeDanger < 3) {
        mythicChance = 0;
    }
    let redChance = Math.round((playerInfos.sondeDanger+2)*(playerInfos.sondeDanger+2)/2)+110;
    if (resLevelDice <= mythicChance) {
        return 5;
    } else if (resLevelDice <= mythicChance+redChance) {
        return 3;
    } else if (resLevelDice <= mythicChance+redChance+320) {
        return 2;
    } else {
        return 1;
    }
};

function zoneReport(zone,quiet) {
    let percM = 0;
    let percH = 0;
    let percP = 0;
    let percG = 0;
    let percB = 0;
    let percF = 0;
    let percS = 0;
    let percW = 0;
    let percR = 0;
    let terName;
    zone.forEach(function(tile) {
        terName = getTileTerrainName(tile.id);
        if (terName === 'M') {
            percM++;
        }
        if (terName === 'H') {
            percH++;
        }
        if (terName === 'P') {
            percP++;
        }
        if (terName === 'G') {
            percG++;
        }
        if (terName === 'B') {
            percB++;
        }
        if (terName === 'F') {
            percF++;
        }
        if (terName === 'S') {
            percS++;
        }
        if (terName === 'W') {
            percW++;
        }
        if (terName === 'R') {
            percR++;
        }
    });
    percM = Math.round(percM/36);
    zone[0].pm = percM;
    percH = Math.round(percH/36);
    zone[0].ph = percH;
    percP = Math.round(percP/36);
    zone[0].pp = percP;
    percG = Math.round(percG/36);
    zone[0].pg = percG;
    percB = Math.round(percB/36);
    zone[0].pb = percB;
    percF = Math.round(percF/36);
    zone[0].pf = percF;
    percS = Math.round(percS/36);
    zone[0].ps = percS;
    percW = Math.round(percW/36);
    zone[0].pw = percW;
    percR = Math.round(percR/36);
    zone[0].pr = percR;
    if (percS < 30) {
        zone[0].sKind = 'larve';
    }
    let rain = false;
    let sndEnsolBonus = 100;
    if (zone[0].snd === undefined) {
        if (zone[0].planet === 'Sarak') {
            if (rand.rand(1,2) === 1) {
                zone[0].snd = 'fogfrogs';
                sndEnsolBonus = 0;
            } else {
                zone[0].snd = 'strange';
                sndEnsolBonus = 0;
            }
        } else if (zone[0].planet === 'Gehenna') {
            if (percW+percS >= 40) {
                zone[0].snd = 'swamp';
                sndEnsolBonus = 50;
                rain = true;
            } else if (percF >= 40) {
                zone[0].snd = 'uhuwind';
                sndEnsolBonus = 100;
                rain = true;
            } else {
                zone[0].snd = 'monsoon';
                sndEnsolBonus = 25;
                rain = true;
            }
        } else if (zone[0].planet === 'Kzin') {
            if (rand.rand(1,2) === 1) {
                zone[0].snd = 'sywind';
                sndEnsolBonus = 50;
            } else {
                zone[0].snd = 'bwind';
                sndEnsolBonus = 100;
            }
        } else if (zone[0].planet === 'Horst') {
            if (percF >= 40) {
                zone[0].snd = 'bwindred';
                sndEnsolBonus = 75;
            } else {
                if (rand.rand(1,5) >= 4) {
                    zone[0].snd = 'redwind';
                    sndEnsolBonus = 125;
                } else {
                    zone[0].snd = 'thunderred';
                    sndEnsolBonus = 25;
                }
            }
        } else {
            if (percF >= 40) {
                if (rand.rand(1,2) === 1) {
                    zone[0].snd = 'jungle';
                    sndEnsolBonus = 200;
                } else {
                    zone[0].snd = 'rainforest';
                    sndEnsolBonus = 100;
                    rain = true;
                }
            } else if (percW+percS >= 50) {
                zone[0].snd = 'bogs';
                sndEnsolBonus = 100;
            } else if (percB >= 35) {
                if (rand.rand(1,2) === 1) {
                    zone[0].snd = 'crickets';
                    sndEnsolBonus = 150;
                } else {
                    zone[0].snd = 'birds';
                    sndEnsolBonus = 115;
                }
            } else if (percG+percB >= 75) {
                if (rand.rand(1,2) === 1) {
                    zone[0].snd = 'crickets';
                    sndEnsolBonus = 150;
                } else {
                    zone[0].snd = 'cricketsloop';
                    sndEnsolBonus = 250;
                }
            } else if (percP >= 50 || percP+percG >= 70) {
                zone[0].snd = 'howlwind';
                sndEnsolBonus = 75;
            } else {
                if (rand.rand(1,3) === 1) {
                    if (rand.rand(1,2) === 1) {
                        zone[0].snd = 'birds';
                        sndEnsolBonus = 100;
                    } else {
                        zone[0].snd = 'howlwind';
                        sndEnsolBonus = 75;
                    }
                } else {
                    if (rand.rand(1,2) === 1) {
                        zone[0].snd = 'thunderstart';
                        sndEnsolBonus = 35;
                        rain = true;
                    } else {
                        zone[0].snd = 'thunderfull';
                        sndEnsolBonus = 20;
                        rain = true;
                    }
                }
            }
        }
        console.log(zone[0].snd);
    }
    if (zone[0].ensol === undefined) {
        let ensolFactor = rand.rand(25,35);
        let ensolBonus = rand.rand(0,80);
        zone[0].ensol = Math.round(percP*ensolFactor/10)+ensolBonus+sndEnsolBonus-100;
        if (zone[0].ensol < 50) {
            zone[0].ensol = 40+rand.rand(0,10);
        }
        if (playerInfos.comp.det >= 2 && !quiet) {
            warning('Ensoleillement',zone[0].ensol,true);
        }
    }
    if (!quiet) {
        if (rain) {
            warning('Pluie','Oui',true);
        } else {
            warning('Pluie','Non',true);
        }
        if (playerInfos.comp.ca >= 2) {
            if (zone[0].planet === 'Gehenna') {
                warning('Eau','Empoisonnée<br>',true);
            } else if (zone[0].seed === 2) {
                if (zone[0].gKind === 'spider' || zone[0].pKind === 'spider' || zone[0].sKind === 'spider') {
                    warning('Eau','Empoisonnée<br>',true);
                } else {
                    warning('Eau','OK<br>',true);
                }
            } else {
                warning('Eau','OK<br>',true);
            }
        }
        if (playerInfos.comp.ca < 3) {
            warning('Montagnes',percM+'%',true);
            warning('Collines',percH+'%',true);
            warning('Plaines',percP+'%',true);
            warning('Prairies',percG+'%',true);
            warning('Maquis',percB+'%',true);
            warning('Forêts',percF+'%',true);
            warning('Marécages',percS+'%',true);
            warning('Etangs',percW+'%',true);
            warning('Rivières',percR+'%');
        } else {
            warning('Montagnes',percM+'% (bug)',true);
            warning('Collines',percH+'% (bug)',true);
            warning('Plaines',percP+'% ('+zone[0].pKind+')',true);
            warning('Prairies',percG+'% ('+zone[0].gKind+')',true);
            warning('Maquis',percB+'% (swarm)',true);
            warning('Forêts',percF+'% (spider)',true);
            warning('Marécages',percS+'% ('+zone[0].sKind+')',true);
            warning('Etangs',percW+'% (larve)',true);
            warning('Rivières',percR+'% (larve)');
        }
    }
    console.log('ensol');
    console.log(zone[0].ensol);
};

function atomsColors(myZone) {
    let tileTotalRes = 0;
    let tileNumRes = 0;
    let res;
    let rarityFactor;
    let rareRes;
    myZone.forEach(function(tile) {
        if (tile.rq != undefined) {
            if (tile.rq >= 1 && tile.rq <= 3) {
                tileTotalRes = 0;
                tileNumRes = 0;
                rareRes = 0;
                Object.entries(tile.rs).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    res = getResByName(key);
                    rarityFactor = 45-res.rarity;
                    if (rarityFactor <= 10) {
                        rarityFactor = 15;
                    }
                    tileTotalRes = tileTotalRes+Math.round(value*rarityFactor/18);
                    if (res.rarity <= 16) {
                        rareRes = rareRes+2;
                    } else if (res.rarity <= 25) {
                        rareRes++;
                    }
                    tileNumRes++;
                });
                if (tileNumRes >= 5) {
                    if (tileTotalRes >= 1000 || rareRes >= 2) {
                        tile.rq = 3;
                    } else {
                        tile.rq = 2;
                    }
                } else if (tileNumRes >= 4) {
                    if (tileTotalRes >= 1350 || (rareRes >= 2 && tileTotalRes >= 1000)) {
                        tile.rq = 3;
                    } else {
                        tile.rq = 2;
                    }
                } else if (tileNumRes >= 2) {
                    if (tileTotalRes >= 500 || (rareRes >= 1 && tileTotalRes >= 350) || (rareRes >= 2 && tileTotalRes >= 250)) {
                        tile.rq = 2;
                    } else {
                        tile.rq = 1;
                    }
                } else {
                    if (tileTotalRes >= 500 || (rareRes >= 2 && tileTotalRes >= 100)) {
                        tile.rq = 2;
                    } else {
                        tile.rq = 1;
                    }
                }
            }
        }
    });
};
