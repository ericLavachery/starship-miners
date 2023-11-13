function turnMap(map) {
    map.forEach(function(tile) {
        let swapIt = true;
        if (tile.x === 1) {
            if (tile.y === 1 || tile.y === 60) {
                swapIt = false;
            }
        }
        if (tile.x === 60) {
            if (tile.y === 1 || tile.y === 60) {
                swapIt = false;
            }
        }
        if (swapIt) {
            let tileX = tile.y;
            let tileY = 61-tile.x;
            tile.x = tileX;
            tile.y = tileY;
        }
    });
    zone = _.sortBy(_.sortBy(map,'y'),'x');
    let newId = 0;
    zone.forEach(function(tile) {
        tile.id = newId;
        newId++;
    });
};

function generateVM() {
    zone = [];
    // savePlayerInfos();
    checkFilter();
    filterParams(true);
    createVM(mapSize);
    washReports(true);
    let ensolFactor = rand.rand(28,32);
    let ensolBonus = rand.rand(20,60);
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
    let thisTerrain = "X";
    while (i < size*size) {
        newTile = {};
        newTile.id = i;
        if (newTile.id === 0) {
            newTile.number = nextZoneNum;
            newTile.dark = false;
            newTile.undarkAll = true;
            newTile.undarkOnce = [];
            newTile.mapDiff = 0;
            newTile.pKind = '';
            newTile.gKind = '';
            newTile.sKind = '';
        }
        newTile.x = x;
        newTile.y = y;
        if (x >= 27 && x <= 35 && y >= 25 && y <= 37) {
            newTile.terrain = 'X';
            newTile.seed = rand.rand(1,6);
        } else if (x >= 26 && x <= 36 && y >= 22 && y <= 40) {
            newTile.terrain = 'Z';
            newTile.seed = 1;
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

function changeStationMap() {
    if (playerInfos.onShip) {
        let testTile = getTileById(1521);
        if (testTile.terrain != 'Z') {
            zone.forEach(function(tile) {
                if (tile.x >= 27 && tile.x <= 35 && tile.y >= 25 && tile.y <= 37) {
                    tile.terrain = 'X';
                    tile.seed = rand.rand(1,6);
                } else if (tile.x >= 26 && tile.x <= 36 && tile.y >= 22 && tile.y <= 40) {
                    tile.terrain = 'Z';
                    tile.seed = 1;
                }
            });
            warning('<span class="rq3">Message hors jeu</span>','<span class="vio">Station transformée.</span><br>Construisez les sondes et impacteurs dans la coque, le reste dans la station (dans un emplacement vide)');
            showMap(zone,false);
        }
    }
}

function regionChange() {
    playerInfos.sondeMaps = playerInfos.sondeMaps+3;
    playerInfos.allTurns = playerInfos.allTurns+5;
    generateNewMap(true);
};

function regionChoice(regionName) {
    let region = getRegionByName(regionName);
    filterBase = region;
    generateNewMap(false,true);
};

function generateNewMap(filterCheck,louche) {
    zone = [];
    playerInfos.sondeMaps = playerInfos.sondeMaps+1;
    let fastChance = Math.round(playerInfos.comp.vsp*playerInfos.comp.vsp*6);
    if (rand.rand(1,100) > fastChance) {
        playerInfos.allTurns = playerInfos.allTurns+1;
    }
    if (filterCheck) {
        checkFilter();
        console.log('CHECK MAP DIRECTION');
        if (rand.rand(1,2) === 1) {
            mapTurn = true;
        } else {
            mapTurn = false;
        }
    }
    if (mapTurn) {
        console.log('HORIZONTAL MAP');
    } else {
        console.log('VERTICAL MAP');
    }
    filterParams(filterCheck);
    createMap(mapSize);
    filterMap(zone);
    addRivers(zone);
    addRes(zone);
    deepWaters(zone);
    persil(zone);
    destroyedRuins(zone);
    washReports(true);
    zone[1830].rd = true;
    zoneReport(zone,false);
    writeMapStyles();
    showMap(zone,false);
    centerMapCenter();
    conOut(true);
    minimap();
    commandes();
    ruinsView();
    if (louche) {
        mapGlobalEdits();
    }
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
                newTile.undarkAll = false;
                newTile.undarkOnce = [];
            } else {
                newTile.dark = false;
                newTile.undarkAll = true;
                newTile.undarkOnce = [];
            }
            newTile.mapDiff = playerInfos.sondeDanger;
            newTile.pKind = checkMapKind('P',newTile.planet);
            newTile.gKind = checkMapKind('G',newTile.planet);
            newTile.sKind = checkMapKind('S',newTile.planet);
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
    if (mapTurn) {
        turnMap(zone);
    }
    // console.log(zone);
};

function checkMapKind(terName,planetName) {
    let dice = rand.rand(1,12);
    if (terName === 'P') {
        if (planetName === 'Dom' && playerInfos.gLevel >= 19) {
            return 'bug';
        } else if (planetName === 'Gehenna') {
            return 'swarm';
        } else if (planetName === 'Kzin') {
            return 'bug';
        } else if (planetName === 'Horst') {
            return 'bug';
        } else {
            if (dice <= 6 || playerInfos.sondeDanger <= 1) {
                return 'bug';
            } else if (dice <= 8 || playerInfos.sondeDanger <= 2) {
                return 'spider';
            } else {
                return 'swarm';
            }
        }
    } else if (terName === 'G') {
        if (planetName === 'Dom' && playerInfos.gLevel >= 19) {
            return 'spider';
        } else if (planetName === 'Gehenna') {
            return 'swarm';
        } else if (planetName === 'Kzin') {
            return 'spider';
        } else if (planetName === 'Horst') {
            return 'swarm';
        } else {
            if (dice <= 2 || playerInfos.sondeDanger <= 1) {
                return 'bug';
            } else if (dice <= 6 || playerInfos.sondeDanger <= 2) {
                return 'spider';
            } else if (dice <= 9) {
                return 'larve';
            } else {
                return 'swarm';
            }
        }
    } else if (terName === 'S') {
        if (planetName === 'Dom' && playerInfos.gLevel >= 19) {
            return 'larve';
        } else if (planetName === 'Gehenna') {
            return 'spider';
        } else if (planetName === 'Kzin') {
            return 'larve';
        } else if (planetName === 'Horst') {
            return 'swarm';
        } else {
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
        if (rand.rand(1,specialSeed*2) === 1) {
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
    if (filterBase.power != undefined) {
        filterEffect = filterBase.power;
    } else {
        filterEffect = 10;
    }
    console.log('filterEffect = '+filterEffect);
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
                    } else {
                        tile.terrain = newTerrain;
                        tile.seed = tile.seed-6;
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

function checkFilter() {
    if (filterVariance && playerInfos.sondeDanger >= 2) {
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
                filterBase = mapFilters[1];
            }
            if (filterBase.name === 'FloodP1') {
                filterBase = mapFilters[2];
            }
            if (filterBase.name === 'ScarpFlood') {
                filterBase = mapFilters[18];
            }
            if (filterBase.name === 'VegFlood') {
                filterBase = mapFilters[19];
            }
            // HORST: moins de végétaux
            if (filterBase.name === 'VegP2') {
                filterBase = mapFilters[1];
            }
            if (filterBase.name === 'VegP1') {
                filterBase = mapFilters[2];
            }
            if (filterBase.name === 'ScarpVeg') {
                filterBase = mapFilters[19];
            }
            if (filterBase.name === 'BushLake') {
                filterBase = mapFilters[18];
            }
            if (filterBase.name === 'BushHills') {
                filterBase = mapFilters[5];
            }
            if (filterBase.name === 'Mangrove') {
                filterBase = mapFilters[18];
            }
        }
        if (playerInfos.sondePlanet === 4) {
            // KZIN: tjrs montagnes
            if (filterBase.name === 'ScarpM2') {
                filterBase = mapFilters[18];
            }
            if (filterBase.name === 'ScarpM1') {
                filterBase = mapFilters[18];
            }
            // KZIN: moins de végétation
            if (filterBase.name === 'VegP1') {
                filterBase = mapFilters[11];
            }
            if (filterBase.name === 'VegP2') {
                filterBase = mapFilters[12];
            }
            if (filterBase.name === 'ScarpVeg') {
                filterBase = mapFilters[13];
            }
            if (filterBase.name === 'VegFlood') {
                filterBase = mapFilters[11];
            }
            if (filterBase.name === 'BushLake') {
                filterBase = mapFilters[12];
            }
            if (filterBase.name === 'Desert') {
                filterBase = mapFilters[18];
            }
            if (filterBase.name === 'Mangrove') {
                filterBase = mapFilters[18];
            }
        }
    } else {
        mapFilters.forEach(function(filter) {
            if (filter.name == mapFilterDefault) {
                filterBase = filter;
            }
        });
    }
};

function filterParams(filterCheck) {
    maxTileCheck = rand.rand(4,5);
    if (filterBase.spSeed != specialSeed) {
        specialSeed = filterBase.spSeed;
    }
    if (terSeedVariance) {
        if (filterCheck) {
            terSeedDiceMin = rand.rand(1,14);
        }
        console.log('terSeedDiceMin='+terSeedDiceMin);
        let dice = rand.rand(terSeedDiceMin,terSeedDiceMin+3);
        if (playerInfos.gLevel >= 19) {
            dice = rand.rand(4,10);
        }
        switch (dice) {
            case 1:
            terSeed = 3;
            break;
            case 2:
            terSeed = 5;
            break;
            case 3:
            terSeed = 6;
            break;
            case 4:
            terSeed = 8;
            break;
            case 5:
            terSeed = 9;
            break;
            case 6:
            terSeed = 10;
            break;
            case 7:
            terSeed = 11;
            break;
            case 8:
            terSeed = 12;
            break;
            case 9:
            terSeed = 14;
            break;
            case 10:
            terSeed = 16;
            break;
            case 11:
            terSeed = 18;
            break;
            case 12:
            terSeed = 20;
            break;
            case 13:
            terSeed = 24;
            break;
            case 14:
            terSeed = 40;
            break;
            case 15:
            terSeed = 80;
            break;
            case 16:
            terSeed = 100;
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
    if (seed <= 3) {
        variance = "très forte";
    } else if (seed <= 6) {
        variance = "forte";
    } else if (seed <= 10) {
        variance = "moyenne +";
    } else if (seed <= 16) {
        variance = "moyenne";
    } else if (seed <= 20) {
        variance = "moyenne -";
    } else if (seed <= 40) {
        variance = "faible";
    } else if (seed <= 100) {
        variance = "très faible";
    } else {
        variance = "extrèmement faible";
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
    let numRiver = 0;
    if (dice < 3) {
        direction = rand.rand(1,4); // 1 is North, 2 is South
        addEWRiver(map,direction);
        numRiver++;
        console.log('Rivière ouest-est');
    }
    direction = rand.rand(1,2); // 1 is West, 2 is East
    dice = rand.rand(1,riverNS);
    if (dice < 3) {
        addNSRiver(map,direction);
        numRiver++;
        console.log('Rivière nord-sud');
    }
    dice = rand.rand(1,riverSN);
    if (dice < 3) {
        addSNRiver(map,direction);
        numRiver++;
        console.log('Rivière sud-nord');
    }
    if (numRiver < 1) {
        if (playerInfos.gLevel >= 19) {
            console.log('RECURSE rivers');
            addRivers(map);
        } else {
            console.log('Pas de rivière');
        }
    } else if (numRiver < 2) {
        if (playerInfos.gLevel >= 19 || rand.rand(1,4) === 1) {
            console.log('rivière bonus');
            if (rand.rand(1,2) === 1) {
                addNSRiver(map,direction);
                numRiver++;
                console.log('Rivière nord-sud');
            } else {
                addSNRiver(map,direction);
                numRiver++;
                console.log('Rivière sud-nord');
            }
        }
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
    let resMapDiff = Math.round((playerInfos.sondeDanger+2.5)/1.42);
    if (resMapDiff > 6) {resMapDiff = 6;}
    let mythicMin = 0;
    let mythicMax = resMapDiff-2;
    let mythicNum = 0;
    let baseMin = 24+(resMapDiff*3);
    let baseNum = 0;
    let redMin = Math.floor(resMapDiff)+8;
    let redNum = 0;
    if (zone[0].planet != 'Dom') {
        if (zone[0].planet != 'Horst') {
            mythicMin = mythicMin+Math.floor(resMapDiff/3);
            if (mythicMin < 2) {
                mythicMin = 2;
            }
            mythicMax = mythicMax+Math.floor(resMapDiff/2);
        } else {
            mythicMin = mythicMin+Math.floor(resMapDiff/2);
            if (mythicMin < 4) {
                mythicMin = 4;
            }
            mythicMax = mythicMax+resMapDiff;
        }
        baseMin = baseMin+Math.floor(resMapDiff*2);
        redMin = redMin+Math.floor(resMapDiff*1.5);
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
            if (terrain.name === 'S' || terrain.name === 'W' || terrain.name === 'F' || terrain.name == 'L') {
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
                    if (resLevelDice === 4) {
                        mythicNum = mythicNum+0.4;
                    }
                    if (resLevelDice === 5) {
                        mythicNum++;
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
        let silverChance = Math.round(30000000/numBadTer/((resMapDiff+3)*(resMapDiff+3)));
        shufZone.forEach(function(tile) {
            if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                terrain = getTileTerrain(tile.id);
                if (terrain.name === 'S' || terrain.name === 'F') {
                    if (rand.rand(1,silverChance) === 1) {
                        tile.rq = 4;
                        mythicNum = mythicNum+0.4;
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
                            mythicNum = mythicNum+0.8;
                        }
                    }
                }
            });
        }
        // not enough mythics
        if (mythicNum < mythicMin) {
            shufZone.forEach(function(tile) {
                if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                    if (tile.rq === undefined) {
                        if (mythicNum < mythicMin) {
                            tile.rq = 5;
                            mythicNum = mythicNum+0.8;
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
    // let maxDice = Math.floor(playerInfos.sondeDanger/2)+5;
    let maxDice = 7;
    let rarityDice;
    let altDice;
    let minDice = 1;
    let blueSum = 0;
    let skySum = 0;
    let scrapRarity;
    let resRarity;
    let resBatch;
    resTypes.forEach(function(res) {
        resRarity = res.rarity;
        if (res.name === 'Scrap') {
            resRarity = Math.ceil(resRarity*ruinRarity/8);
        }
        resBatch = res.batch;
        let planetFactor = 1;
        if (res.planets != undefined) {
            let planetName = zone[0].planet;
            planetFactor = res.planets[planetName];
            if (planetFactor >= 1 && zone[0].planet != 'Dom') {
                resRarity = resRarity+2;
            }
            resRarity = Math.ceil(resRarity*planetFactor);
            resBatch = Math.ceil(resBatch*Math.sqrt(planetFactor));
        } else if (zone[0].planet != 'Dom') {
            resRarity = resRarity+2;
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
            res.adjBatch = Math.ceil(resBatch*fewRedRarityAdj/100);
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
        } else if (res.cat.includes('sky') || res.cat.includes('blue')) {
            res.adjRarity = resRarity;
            res.adjBatch = resBatch;
            if (res.adjBatch < 1) {
                res.adjBatch = 1;
            }
        }
        if (res.cat.includes('blue')) {
            blueSum = blueSum+resRarity;
        }
        if (res.cat.includes('sky')) {
            skySum = skySum+resRarity;
        }
        if (playerInfos.pseudo != 'Mapedit') {
            if (playerInfos.sondeRes.includes(res.name)) {
                let minimumRarity = Math.ceil(res.rarity*(playerInfos.comp.ext+8)/8);
                minimumRarity = Math.ceil(minimumRarity*planetFactor);
                if (res.adjRarity < minimumRarity) {
                    res.adjRarity = minimumRarity;
                }
                if (res.adjBatch < res.batch) {
                    res.adjBatch = res.batch;
                }
                if (res.name === 'Magma' || res.name === 'Huile' || res.name === 'Fruits') {
                    res.adjRarity = Math.ceil(res.adjRarity*(playerInfos.comp.ext+5)/5);
                }
            }
        }
    });
    console.log('scrapRarity: '+scrapRarity);
    // check RUINS
    let ruinChance = Math.floor(((scrapRarity*ruinRarity/10)+ruinRarity)/3);
    let resScrap = getResByName('Scrap');
    // ruinChance = Math.round(ruinChance*resScrap.planets[zone[0].planet]);
    if (ruinChance > 15) {
        ruinChance = 15;
    }
    if (zone[0].planet === 'Dom') {
        if (ruinChance < 5) {
            ruinChance = 5;
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
                if (tile.rq === undefined && tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') {
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
        mapResBatchDiv = Math.round(mapResBatchDiv*(ruinChance+20)/30);
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
                    resRarity = res.adjRarity;
                    mythicSum = mythicSum+resRarity;
                    if (mythicSum >= mythicDice && Object.keys(mythicRes).length <= 0) {
                        mythicRes = res;
                    }
                }
            });
            tile.rs[mythicRes.name] = (mythicRes.adjBatch*(tile.rq-2)*(tile.rq-3)*rand.rand(4,12))+rand.rand(0,9);
            // RAJOUT DE RESSOURCES AUX POINTS BLEUS
            let mythicResBld = mythicRes.bld;
            if (mythicResBld === 'Comptoir') {
                mythicResBld = 'Mine';
            }
            let bldFactor = 4;
            if (mythicResBld === 'Derrick') {
                bldFactor = 9;
            }
            let minBlueResNum = Math.ceil(zone[0].mapDiff/3)+2;
            resTypes.forEach(function(res) {
                if (res.bld === mythicResBld || (mythicRes.bld === 'Comptoir' && res.bld === 'Comptoir' && res.cat != 'zero')) {
                    resRarity = res.adjRarity;
                    if (resRarity >= 1) {
                        resRarity = resRarity+9;
                        if (mythicRes.bld === 'Comptoir' && res.bld === 'Comptoir') {
                            resRarity = resRarity+20;
                        }
                        if (mythicRes.bld === 'Comptoir' && res.name === 'Huile') {
                            resRarity = resRarity+23;
                        }
                        if (res.name === 'Fruits' || res.name === 'Huile') {
                            if (tile.terrain != 'F' && tile.terrain != 'S' && tile.terrain != 'B') {
                                resRarity = 0;
                            }
                        }
                        if (rand.rand(1,100) <= Math.round((resRarity)/10*bldFactor)) {
                            let rajResBatch = res.adjBatch;
                            if (mythicRes.bld === 'Comptoir' && res.name === 'Huile') {
                                rajResBatch = rajResBatch+3;
                            }
                            tile.rs[res.name] = (rajResBatch*rajResBatch*rand.rand(7,19))+rand.rand(0,9);
                        }
                    }
                }
            });
            if (Object.keys(tile.rs).length < minBlueResNum) {
                resTypes.forEach(function(res) {
                    if (res.bld === mythicResBld || (mythicRes.bld === 'Comptoir' && res.bld === 'Comptoir' && res.cat != 'zero')) {
                        resRarity = res.adjRarity;
                        if (resRarity >= 1) {
                            resRarity = resRarity+9;
                            if (mythicRes.bld === 'Comptoir' && res.bld === 'Comptoir') {
                                resRarity = resRarity+20;
                            }
                            if (mythicRes.bld === 'Comptoir' && res.name === 'Huile') {
                                resRarity = resRarity+23;
                            }
                            if (res.name === 'Fruits' || res.name === 'Huile') {
                                if (tile.terrain != 'F' && tile.terrain != 'S' && tile.terrain != 'B') {
                                    resRarity = 0;
                                }
                            }
                            if (rand.rand(1,100) <= Math.round((resRarity)/10*bldFactor)) {
                                let rajResBatch = res.adjBatch;
                                if (mythicRes.bld === 'Comptoir' && res.name === 'Huile') {
                                    rajResBatch = rajResBatch+3;
                                }
                                tile.rs[res.name] = (rajResBatch*rajResBatch*rand.rand(7,19))+rand.rand(0,9);
                            }
                        }
                    }
                });
            }
            if (Object.keys(tile.rs).length < minBlueResNum) {
                resTypes.forEach(function(res) {
                    if (res.bld === mythicResBld || (mythicRes.bld === 'Comptoir' && res.bld === 'Comptoir' && res.cat != 'zero')) {
                        resRarity = res.adjRarity;
                        if (resRarity >= 1) {
                            resRarity = resRarity+9;
                            if (mythicRes.bld === 'Comptoir' && res.bld === 'Comptoir') {
                                resRarity = resRarity+20;
                            }
                            if (mythicRes.bld === 'Comptoir' && res.name === 'Huile') {
                                resRarity = resRarity+23;
                            }
                            if (res.name === 'Fruits' || res.name === 'Huile') {
                                if (tile.terrain != 'F' && tile.terrain != 'S' && tile.terrain != 'B') {
                                    resRarity = 0;
                                }
                            }
                            if (rand.rand(1,100) <= Math.round((resRarity)/10*bldFactor)) {
                                let rajResBatch = res.adjBatch;
                                if (mythicRes.bld === 'Comptoir' && res.name === 'Huile') {
                                    rajResBatch = rajResBatch+3;
                                }
                                tile.rs[res.name] = (rajResBatch*rajResBatch*rand.rand(7,19))+rand.rand(0,9);
                            }
                        }
                    }
                });
            }
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
    // MAGMA
    let magmaRes = getResByName('Magma');
    let pName = zone[0].planet;
    let magmaFactor = magmaRes.planets[pName];
    let magmaZoneDice = Math.ceil(magmaZone/magmaFactor);
    if (rand.rand(1,magmaZoneDice) === 1) {
        let magName = 'Magma';
        let magChanceDice = rand.rand(3,6)*Math.round(15/magmaFactor);
        shufZone.forEach(function(tile) {
            if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                if (tile.rq === undefined) {
                    if (rand.rand(1,magChanceDice) === 1) {
                        tile.rq = 1;
                        tile.rs = {};
                        tile.rs[magName] = rand.rand(250,600-magChanceDice);
                    }
                }
            }
        });
    }
    // HUILE & FRUITS & CRISTAUX
    let crysMap = false;
    let crysNum = 0;
    let crysMax = 0;
    if (zone[0].planet === 'Sarak') {
        crysMap = true;
        crysMax = Math.ceil(((playerInfos.sondeDanger/1.5)+rand.rand(0,4))/4);
    }
    let oilName = 'Huile';
    let oilChance = (rand.rand(2,6)*60)-Math.round(numBadTer/50)-(playerInfos.sondeDanger*5); // plus bas = plus de chances
    let oilRes = getResByName('Huile');
    oilChance = Math.round(oilChance/oilRes.planets[zone[0].planet]);
    let oilDiv = 1;
    if (playerInfos.sondeRes.includes(oilRes.name)) {
        oilChance = Math.ceil(oilChance/(playerInfos.comp.ext+4)*3);
        oilDiv = oilDiv/(playerInfos.comp.ext+3)*3;
    }
    let oilHere = false;
    let fruName = 'Fruits';
    let fruChance = (rand.rand(2,6)*20); // plus bas = plus de chances
    let fruRes = getResByName('Fruits');
    fruChance = Math.round(fruChance/fruRes.planets[zone[0].planet]);
    let fruDiv = 1.75*(zone[0].mapDiff+4)/5;
    if (playerInfos.sondeRes.includes(fruRes.name)) {
        fruChance = Math.ceil(fruChance/(playerInfos.comp.ext+4)*3);
        fruDiv = fruDiv/(playerInfos.comp.ext+3)*3;
    }
    let fruHere = false;
    console.log('numBadTer: '+numBadTer);
    if (playerInfos.sondeDanger >= 1) {
        shufZone.forEach(function(tile) {
            if (tile.x > 2 && tile.x < 59 && tile.y > 2 && tile.y < 59) {
                if (crysMap && crysNum < crysMax) {
                    if (tile.x < 15 || tile.x > 45 || tile.y < 15 || tile.y > 45) {
                        tile.infra = 'Crystal';
                        crysNum++;
                        if (tile.terrain != 'M' && tile.terrain != 'H') {
                            tile.terrain = 'M';
                        }
                    }
                }
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
                                tile.rs[oilName] = Math.round((rand.rand(80,320)+Math.round(numBadTer/72))/oilDiv);
                            }
                            if (fruHere) {
                                tile.rs[fruName] = Math.round((rand.rand(80,320))/fruDiv);
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
                                tile.rs[oilName] = Math.round((rand.rand(30,140)+Math.round(numBadTer/36))/oilDiv);
                            }
                            if (fruHere) {
                                tile.rs[fruName] = Math.round((rand.rand(80,480))/fruDiv);
                            }
                        }
                        if (tile.terrain === 'F') {
                            if (rand.rand(1,oilChance*2) === 1) {
                                oilHere = true;
                            }
                            if (rand.rand(1,Math.ceil(fruChance/2)) === 1) {
                                fruHere = true;
                            }
                            if (oilHere || fruHere) {
                                tile.rq = 1;
                                tile.rs = {};
                            }
                            if (oilHere) {
                                tile.rs[oilName] = Math.round((rand.rand(30,240)+Math.round(numBadTer/72))/oilDiv);
                            }
                            if (fruHere) {
                                tile.rs[fruName] = Math.round((rand.rand(80,640))/fruDiv);
                            }
                        }
                    }
                }
            }
        });
    }
    // Reajuster les couleurs de gisements
    atomsColors(zone);
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
    if (zone[nextTileId].terrain === 'W' || zone[nextTileId].terrain === 'R' || zone[nextTileId].terrain === 'L') {
        bridge = true;
    }
    let i = 1
    while (i <= longueur) {
        oldTileId = nextTileId;
        bridge = false;
        if (zone[oldTileId].terrain === 'W' || zone[oldTileId].terrain === 'R' || zone[oldTileId].terrain === 'L') {
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
        if (zone[nextTileId].terrain === 'W' || zone[nextTileId].terrain === 'R' || zone[nextTileId].terrain === 'L') {
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
                if (rand.rand(1,4) === 1) {
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

function persil(zone) {
    if (rand.rand(1,4) === 1) {
        let pRoll = rand.rand(1,6);
        if (pRoll === 1) {
            // mountains
            if (rand.rand(1,2) === 1) {
                replaceTerrain('P','M',rand.rand(4,12),true);
            } else {
                replaceTerrain('H','M',rand.rand(4,12),true);
            }
        } else if (pRoll === 2) {
            // hills
            if (rand.rand(1,2) === 1) {
                replaceTerrain('P','H',rand.rand(4,24),true);
            } else {
                replaceTerrain('M','H',rand.rand(4,24),true);
            }
        } else if (pRoll === 3) {
            // bushes
            if (rand.rand(1,2) === 1) {
                replaceTerrain('F','B',rand.rand(4,24),true);
            } else {
                replaceTerrain('S','B',rand.rand(4,24),true);
            }
        } else if (pRoll === 4) {
            // forests
            if (rand.rand(1,2) === 1) {
                replaceTerrain('H','F',rand.rand(4,16),true);
            } else {
                replaceTerrain('W','F',rand.rand(4,16),true);
            }
        } else if (pRoll === 5) {
            // swamps
            if (rand.rand(1,2) === 1) {
                replaceTerrain('P','S',rand.rand(4,16),true);
            } else {
                replaceTerrain('F','S',rand.rand(4,16),true);
            }
        } else if (pRoll === 6) {
            // water
            if (rand.rand(1,2) === 1) {
                replaceTerrain('G','W',rand.rand(4,12),true);
            } else {
                replaceTerrain('B','W',rand.rand(4,12),true);
            }
        }
    }
};

function lastZoneAdj() {
    // s'arranger pour qu'il y ait assez de chaque terrain!
    // utiliser les remplacements de terrain du MAPEDIT
    let pk = false;
    let gk = false;
    let sk = false;
    let bugPerc = zone[0].pm+zone[0].ph;
    let swarmPerc = zone[0].pb;
    let spiderPerc = zone[0].pf;
    let larvePerc = zone[0].pw+zone[0].pr;
    // BUG TEST
    if (bugPerc < lastMapMinKind) {
        if (!pk) {
            pk = true;
            zone[0].pKind = 'bug';
            bugPerc = bugPerc+zone[0].pp;
        }
    }
    // LARVE TEST
    if (larvePerc < lastMapMinKind) {
        if (!sk) {
            sk = true;
            zone[0].sKind = 'larve';
            larvePerc = larvePerc+zone[0].ps;
        }
    }
    // SPIDER TEST
    if (spiderPerc < lastMapMinKind) {
        if (!gk) {
            gk = true;
            zone[0].gKind = 'spider';
            spiderPerc = spiderPerc+zone[0].pg;
        }
    }
    if (spiderPerc < lastMapMinKind) {
        if (!sk) {
            sk = true;
            zone[0].sKind = 'spider';
            spiderPerc = spiderPerc+zone[0].ps;
        }
    }
    if (spiderPerc < lastMapMinKind) {
        if (!pk) {
            pk = true;
            zone[0].pKind = 'spider';
            spiderPerc = spiderPerc+zone[0].pp;
        }
    }
    // SWARM TEST
    if (swarmPerc < lastMapMinKind) {
        if (!gk) {
            gk = true;
            zone[0].gKind = 'swarm';
            swarmPerc = swarmPerc+zone[0].pg;
        }
    }
    if (swarmPerc < lastMapMinKind) {
        if (!pk) {
            pk = true;
            zone[0].pKind = 'swarm';
            swarmPerc = swarmPerc+zone[0].pp;
        }
    }
    if (swarmPerc < lastMapMinKind) {
        if (!sk) {
            sk = true;
            zone[0].sKind = 'swarm';
            swarmPerc = swarmPerc+zone[0].ps;
        }
    }
    // unallocated kinds
    if (!pk) {
        pk = true;
        zone[0].pKind = 'bug';
        bugPerc = bugPerc+zone[0].pp;
    }
    if (!sk) {
        sk = true;
        zone[0].sKind = 'larve';
        larvePerc = larvePerc+zone[0].ps;
    }
    if (!gk) {
        gk = true;
        zone[0].gKind = 'spider';
        spiderPerc = spiderPerc+zone[0].pg;
    }
    // terrain changes?
    let majTerrain = 'G';
    // BUG TEST
    if (bugPerc < lastMapMinKind) {
        if (zone[0].pg >= 25) {
            replaceTerrain('G','H',25,true);
            zone[0].pg = Math.round(zone[0].pg*75/100);
            zone[0].ph = zone[0].ph+Math.round(zone[0].pg*25/100);
        } else if (zone[0].pf >= 25) {
            replaceTerrain('F','H',25,true);
            zone[0].pf = Math.round(zone[0].pf*75/100);
            zone[0].ph = zone[0].ph+Math.round(zone[0].pf*25/100);
        } else if (zone[0].pb >= 25) {
            replaceTerrain('B','H',25,true);
            zone[0].pb = Math.round(zone[0].pb*75/100);
            zone[0].ph = zone[0].ph+Math.round(zone[0].pb*25/100);
        } else if (zone[0].ps >= 25) {
            replaceTerrain('S','H',25,true);
            zone[0].ps = Math.round(zone[0].ps*75/100);
            zone[0].ph = zone[0].ph+Math.round(zone[0].ps*25/100);
        } else if (zone[0].pw >= 25) {
            replaceTerrain('W','M',25,true);
            zone[0].pw = Math.round(zone[0].pw*75/100);
            zone[0].pm = zone[0].pm+Math.round(zone[0].pw*25/100);
        }
    }
    // LARVE TEST
    if (larvePerc < lastMapMinKind) {
        if (zone[0].pg >= 25) {
            replaceTerrain('G','S',35,true);
            zone[0].pg = Math.round(zone[0].pg*65/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].pg*35/100);
        } else if (zone[0].pf >= 25) {
            replaceTerrain('F','S',25,true);
            zone[0].pf = Math.round(zone[0].pf*75/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].pf*25/100);
        } else if (zone[0].pp >= 25) {
            replaceTerrain('P','S',25,true);
            zone[0].pp = Math.round(zone[0].pp*75/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].pp*25/100);
        } else if (zone[0].pm >= 25) {
            replaceTerrain('M','S',25,true);
            zone[0].pm = Math.round(zone[0].pm*75/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].pm*25/100);
        } else if (zone[0].pb >= 35) {
            replaceTerrain('B','W',15,true);
            zone[0].pb = Math.round(zone[0].pb*85/100);
            zone[0].pw = zone[0].pw+Math.round(zone[0].pb*15/100);
        } else if (zone[0].ph >= 25) {
            replaceTerrain('H','S',25,true);
            zone[0].ph = Math.round(zone[0].ph*75/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].ph*25/100);
        } else if (zone[0].pg >= 20) {
            replaceTerrain('G','S',35,true);
            zone[0].pg = Math.round(zone[0].pg*65/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].pg*35/100);
        } else if (zone[0].pf >= 20) {
            replaceTerrain('F','S',35,true);
            zone[0].pf = Math.round(zone[0].pf*65/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].pf*35/100);
        } else if (zone[0].pp >= 20) {
            replaceTerrain('P','S',35,true);
            zone[0].pp = Math.round(zone[0].pp*65/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].pp*35/100);
        } else if (zone[0].pm >= 20) {
            replaceTerrain('M','S',35,true);
            zone[0].pm = Math.round(zone[0].pm*65/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].pm*35/100);
        } else if (zone[0].ph >= 20) {
            replaceTerrain('H','S',35,true);
            zone[0].ph = Math.round(zone[0].ph*65/100);
            zone[0].ps = zone[0].ps+Math.round(zone[0].ph*35/100);
        }
    }
    // SPIDER TEST
    if (spiderPerc < lastMapMinKind) {
        if (zone[0].pp >= 25) {
            replaceTerrain('P','F',25,true);
            zone[0].pp = Math.round(zone[0].pp*75/100);
            zone[0].pf = zone[0].pf+Math.round(zone[0].pp*25/100);
        } else if (zone[0].pw >= 25) {
            replaceTerrain('W','F',25,true);
            zone[0].pw = Math.round(zone[0].pw*75/100);
            zone[0].pf = zone[0].pf+Math.round(zone[0].pw*25/100);
        } else if (zone[0].ps >= 25) {
            replaceTerrain('S','F',25,true);
            zone[0].ps = Math.round(zone[0].ps*75/100);
            zone[0].pf = zone[0].pf+Math.round(zone[0].ps*25/100);
        } else if (zone[0].pg >= 25) {
            replaceTerrain('G','F',25,true);
            zone[0].pg = Math.round(zone[0].pg*75/100);
            zone[0].pf = zone[0].pf+Math.round(zone[0].pg*25/100);
        } else if (zone[0].pm >= 25) {
            replaceTerrain('M','F',25,true);
            zone[0].pm = Math.round(zone[0].pm*75/100);
            zone[0].pf = zone[0].pf+Math.round(zone[0].pm*25/100);
        } else if (zone[0].ph >= 25) {
            replaceTerrain('H','F',25,true);
            zone[0].ph = Math.round(zone[0].ph*75/100);
            zone[0].pf = zone[0].pf+Math.round(zone[0].ph*25/100);
        } else if (zone[0].pb >= 25) {
            replaceTerrain('B','F',25,true);
            zone[0].pb = Math.round(zone[0].pb*75/100);
            zone[0].pf = zone[0].pf+Math.round(zone[0].pb*25/100);
        }
    }
    // SWARM TEST
    if (swarmPerc < lastMapMinKind) {
        if (zone[0].pg >= 25) {
            replaceTerrain('G','B',25,true);
            zone[0].pg = Math.round(zone[0].pg*75/100);
            zone[0].pb = zone[0].pb+Math.round(zone[0].pg*25/100);
            swarmPerc = swarmPerc+Math.round(zone[0].pg*25/100);
        } else if (zone[0].ph >= 25) {
            replaceTerrain('H','B',25,true);
            zone[0].ph = Math.round(zone[0].ph*75/100);
            zone[0].pb = zone[0].pb+Math.round(zone[0].ph*25/100);
            swarmPerc = swarmPerc+Math.round(zone[0].ph*25/100);
        } else if (zone[0].pf >= 25) {
            replaceTerrain('F','B',25,true);
            zone[0].pf = Math.round(zone[0].pf*75/100);
            zone[0].pb = zone[0].pb+Math.round(zone[0].pf*25/100);
            swarmPerc = swarmPerc+Math.round(zone[0].pf*25/100);
        } else if (zone[0].pp >= 25) {
            replaceTerrain('P','B',25,true);
            zone[0].pp = Math.round(zone[0].pp*75/100);
            zone[0].pb = zone[0].pb+Math.round(zone[0].pp*25/100);
            swarmPerc = swarmPerc+Math.round(zone[0].pp*25/100);
        } else if (zone[0].ps >= 25) {
            replaceTerrain('S','B',25,true);
            zone[0].ps = Math.round(zone[0].ps*75/100);
            zone[0].pb = zone[0].pb+Math.round(zone[0].ps*25/100);
            swarmPerc = swarmPerc+Math.round(zone[0].ps*25/100);
        } else if (zone[0].pw >= 25) {
            replaceTerrain('W','B',25,true);
            zone[0].pw = Math.round(zone[0].pw*75/100);
            zone[0].pb = zone[0].pb+Math.round(zone[0].pw*25/100);
            swarmPerc = swarmPerc+Math.round(zone[0].pw*25/100);
        } else if (zone[0].pm >= 25) {
            replaceTerrain('M','B',25,true);
            zone[0].pm = Math.round(zone[0].pm*75/100);
            zone[0].pb = zone[0].pb+Math.round(zone[0].pm*25/100);
            swarmPerc = swarmPerc+Math.round(zone[0].pm*25/100);
        }
        if (swarmPerc < lastMapMinKind) {
            if (zone[0].pg >= 20) {
                replaceTerrain('G','B',25,true);
                zone[0].pg = Math.round(zone[0].pg*75/100);
                zone[0].pb = zone[0].pb+Math.round(zone[0].pg*25/100);
            } else if (zone[0].ph >= 20) {
                replaceTerrain('H','B',25,true);
                zone[0].ph = Math.round(zone[0].ph*75/100);
                zone[0].pb = zone[0].pb+Math.round(zone[0].ph*25/100);
            } else if (zone[0].pf >= 20) {
                replaceTerrain('F','B',25,true);
                zone[0].pf = Math.round(zone[0].pf*75/100);
                zone[0].pb = zone[0].pb+Math.round(zone[0].pf*25/100);
            } else if (zone[0].pp >= 20) {
                replaceTerrain('P','B',25,true);
                zone[0].pp = Math.round(zone[0].pp*75/100);
                zone[0].pb = zone[0].pb+Math.round(zone[0].pp*25/100);
            } else if (zone[0].ps >= 20) {
                replaceTerrain('S','B',25,true);
                zone[0].ps = Math.round(zone[0].ps*75/100);
                zone[0].pb = zone[0].pb+Math.round(zone[0].ps*25/100);
            } else if (zone[0].pw >= 20) {
                replaceTerrain('W','B',25,true);
                zone[0].pw = Math.round(zone[0].pw*75/100);
                zone[0].pb = zone[0].pb+Math.round(zone[0].pw*25/100);
            } else if (zone[0].pm >= 20) {
                replaceTerrain('M','B',25,true);
                zone[0].pm = Math.round(zone[0].pm*75/100);
                zone[0].pb = zone[0].pb+Math.round(zone[0].pm*25/100);
            }
        }
    }
};

function zoneReport(myZone,quiet) {
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
    myZone.forEach(function(tile) {
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
        if (terName === 'W' || terName === 'L') {
            percW++;
        }
        if (terName === 'R') {
            percR++;
        }
    });
    percM = Math.round(percM/36);
    myZone[0].pm = percM;
    percH = Math.round(percH/36);
    myZone[0].ph = percH;
    percP = Math.round(percP/36);
    myZone[0].pp = percP;
    percG = Math.round(percG/36);
    myZone[0].pg = percG;
    percB = Math.round(percB/36);
    myZone[0].pb = percB;
    percF = Math.round(percF/36);
    myZone[0].pf = percF;
    percS = Math.round(percS/36);
    myZone[0].ps = percS;
    percW = Math.round(percW/36);
    myZone[0].pw = percW;
    percR = Math.round(percR/36);
    myZone[0].pr = percR;
    if (!quiet && myZone[0].planet === 'Dom' && playerInfos.gLevel < 19) {
        if (percS+percR+percW >= 40) {
            myZone[0].sKind = 'larve';
        }
        if (percB+percG >= 40) {
            myZone[0].pKind = 'swarm';
            myZone[0].gKind = 'swarm';
        } else if (percF+percG+percS >= 40) {
            myZone[0].pKind = 'spider';
            myZone[0].gKind = 'spider';
        } else if (percM+percH >= 35) {
            myZone[0].pKind = 'bug';
            myZone[0].gKind = 'bug';
        }
    }
    if (playerInfos.gLevel >= 19 && !quiet) {
        lastZoneAdj();
    }
    let rain = false;
    let sndEnsolBonus = 100;
    if (myZone[0].snd === undefined) {
        if (myZone[0].planet === 'Sarak') {
            if (rand.rand(1,2) === 1) {
                myZone[0].snd = 'fogfrogs';
                sndEnsolBonus = 0;
            } else {
                myZone[0].snd = 'strange';
                sndEnsolBonus = 0;
            }
        } else if (myZone[0].planet === 'Gehenna') {
            if (percW+percS >= 40) {
                myZone[0].snd = 'swamp';
                sndEnsolBonus = 50;
                rain = true;
            } else if (percF >= 40) {
                myZone[0].snd = 'uhuwind';
                sndEnsolBonus = 100;
                rain = true;
            } else {
                myZone[0].snd = 'monsoon';
                sndEnsolBonus = 25;
                rain = true;
            }
        } else if (myZone[0].planet === 'Kzin') {
            if (rand.rand(1,2) === 1) {
                myZone[0].snd = 'sywind';
                sndEnsolBonus = 50;
            } else {
                myZone[0].snd = 'bwind';
                sndEnsolBonus = 100;
            }
        } else if (myZone[0].planet === 'Horst') {
            if (percF >= 40) {
                myZone[0].snd = 'bwindred';
                sndEnsolBonus = 75;
            } else {
                if (rand.rand(1,5) >= 4) {
                    myZone[0].snd = 'redwind';
                    sndEnsolBonus = 125;
                } else {
                    myZone[0].snd = 'thunderred';
                    sndEnsolBonus = 25;
                }
            }
        } else {
            if (percF >= 40) {
                if (rand.rand(1,5) >= 3) {
                    myZone[0].snd = 'jungle';
                    sndEnsolBonus = 230;
                } else {
                    myZone[0].snd = 'rainforest';
                    sndEnsolBonus = 150;
                    rain = true;
                }
            } else if (percW+percS >= 50) {
                myZone[0].snd = 'bogs';
                sndEnsolBonus = 40;
            } else if (percB >= 35) {
                if (rand.rand(1,2) === 1) {
                    myZone[0].snd = 'crickets';
                    sndEnsolBonus = 150;
                } else {
                    myZone[0].snd = 'birds';
                    sndEnsolBonus = 125;
                }
            } else if (percG+percB >= 75) {
                if (rand.rand(1,2) === 1) {
                    myZone[0].snd = 'crickets';
                    sndEnsolBonus = 150;
                } else {
                    myZone[0].snd = 'cricketsloop';
                    sndEnsolBonus = 250;
                }
            } else if (percP >= 50 || percP+percG >= 70) {
                myZone[0].snd = 'howlwind';
                sndEnsolBonus = 75;
            } else {
                if (rand.rand(1,3) === 1) {
                    if (rand.rand(1,2) === 1) {
                        myZone[0].snd = 'thunderstart';
                        sndEnsolBonus = 35;
                        rain = true;
                    } else {
                        myZone[0].snd = 'thunderfull';
                        sndEnsolBonus = 20;
                        rain = true;
                    }
                } else {
                    if (rand.rand(1,2) === 1) {
                        if (rand.rand(1,2) === 1) {
                            myZone[0].snd = 'crickets';
                            sndEnsolBonus = 100;
                        } else {
                            myZone[0].snd = 'birds';
                            sndEnsolBonus = 100;
                        }
                    } else {
                        myZone[0].snd = 'howlwind';
                        sndEnsolBonus = 75;
                    }
                }
            }
        }
        console.log(myZone[0].snd);
    }
    if (myZone[0].ensol === undefined) {
        let ensolFactor = rand.rand(25,35);
        let ensolBonus = rand.rand(0,80);
        myZone[0].ensol = Math.round((Math.round((percP+75)*ensolFactor/10)+ensolBonus)*sndEnsolBonus/125);
        if (myZone[0].ensol < 50 && myZone[0].planet != 'Sarak') {
            myZone[0].ensol = 40+rand.rand(0,10);
        }
        if (playerInfos.comp.det >= 2 && playerInfos.bldVM.includes('Station météo') && !quiet) {
            warning('Ensoleillement',myZone[0].ensol,true);
        }
    }
    if (!quiet) {
        if (playerInfos.bldVM.includes('Station météo')) {
            if (rain) {
                warning('Pluie','Oui',true);
            } else {
                warning('Pluie','Non',true);
            }
        }
        if (playerInfos.comp.ca >= 2) {
            let potable = checkPotable(myZone,-1);
            if (!potable) {
                warning('Eau','Empoisonnée<br>',true);
            } else {
                warning('Eau','OK<br>',true);
            }
        }
        if (playerInfos.comp.ca < 3) {
            warning('Plaines',zone[0].pp+'%',true);
            warning('Prairies',zone[0].pg+'%',true);
            warning('Collines',zone[0].ph+'%',true);
            warning('Montagnes',zone[0].pm+'%',true);
            warning('Maquis',zone[0].pb+'%',true);
            warning('Forêts',zone[0].pf+'%',true);
            warning('Etangs',zone[0].pw+'%',true);
            warning('Rivières',zone[0].pr+'%',true);
            warning('Marécages',zone[0].ps+'%',false,-1,true);
        } else {
            warning('Plaines',zone[0].pp+'% ('+myZone[0].pKind+')',true);
            warning('Prairies',zone[0].pg+'% ('+myZone[0].gKind+')',true);
            if (myZone[0].planet === 'Gehenna') {
                warning('Collines',zone[0].ph+'% (spider)',true);
                warning('Montagnes',zone[0].pm+'% (spider)',true);
                warning('Maquis',zone[0].pb+'% (swarm)',true);
                warning('Forêts',zone[0].pf+'% (spider)',true);
                warning('Etangs',zone[0].pw+'% (larve)',true);
                warning('Rivières',zone[0].pr+'% (larve)',true);
            } else if (myZone[0].planet === 'Kzin') {
                warning('Collines',zone[0].ph+'% (bug)',true);
                warning('Montagnes',zone[0].pm+'% (bug)',true);
                warning('Maquis',zone[0].pb+'% (spider)',true);
                warning('Forêts',zone[0].pf+'% (spider)',true);
                warning('Etangs',zone[0].pw+'% (larve)',true);
                warning('Rivières',zone[0].pr+'% (larve)',true);
            } else if (myZone[0].planet === 'Horst') {
                warning('Collines',zone[0].ph+'% (bug)',true);
                warning('Montagnes',zone[0].pm+'% (bug)',true);
                warning('Maquis',zone[0].pb+'% (swarm)',true);
                warning('Forêts',zone[0].pf+'% (swarm)',true);
                warning('Etangs',zone[0].pw+'% (swarm)',true);
                warning('Rivières',zone[0].pr+'% (swarm)',true);
            } else {
                warning('Collines',zone[0].ph+'% (bug)',true);
                warning('Montagnes',zone[0].pm+'% (bug)',true);
                warning('Maquis',zone[0].pb+'% (swarm)',true);
                warning('Forêts',zone[0].pf+'% (spider)',true);
                warning('Etangs',zone[0].pw+'% (larve)',true);
                warning('Rivières',zone[0].pr+'% (larve)',true);
            }
            warning('Marécages',zone[0].ps+'% ('+myZone[0].sKind+')',false,-1,true);
        }
    }
    console.log('ensol');
    console.log(myZone[0].ensol);
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
                atomColour(tile,false);
            }
        }
    });
};

function atomColour(tile,inMaped) {
    let tileTotalRes = 0;
    let tileNumRes = 0;
    let rareRes = 0;
    let specialRes = 0;
    Object.entries(tile.rs).map(entry => {
        let key = entry[0];
        let value = entry[1];
        res = getResByName(key);
        rarityFactor = 45-Math.ceil(res.rarity*(res.batch+3)/7);
        if (rarityFactor <= 15) {
            rarityFactor = 15;
        }
        tileTotalRes = tileTotalRes+Math.round(value*rarityFactor/18);
        if (res.rarity <= 16 || res.batch <= 2) {
            rareRes = rareRes+2;
        } else if (res.rarity <= 25) {
            rareRes++;
        }
        if (res.cat.includes('sky') || res.cat.includes('blue')) {
            specialRes++;
        }
        tileNumRes++;
    });
    if (specialRes >= 1 && inMaped) {
        tile.rq = 5;
    } else if (tileNumRes >= 5) {
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
        if (tileTotalRes >= 700 || (rareRes >= 1 && tileTotalRes >= 300) || (rareRes >= 2 && tileTotalRes >= 250)) {
            tile.rq = 2;
        } else {
            tile.rq = 1;
        }
    } else {
        if (tileTotalRes >= 850 || (rareRes >= 1 && tileTotalRes >= 400)) {
            tile.rq = 2;
        } else {
            tile.rq = 1;
        }
    }
};

function destroyedRuins(zone) {
    let aroundTilesIds = [];
    let thisTile = -1;
    zone.forEach(function(tile) {
        if (tile.ruins) {
            checkRuinType(tile,true);
            if (rand.rand(1,2) === 1 || tile.rt.checks.length >= 4) {
                thisTile = tile.id-1;
                if (thisTile >= 0 && thisTile <= 3599) {
                    if (!aroundTilesIds.includes(thisTile)) {
                        aroundTilesIds.push(thisTile);
                    }
                }
            }
            if (rand.rand(1,2) === 1 || tile.rt.checks.length >= 4) {
                thisTile = tile.id+1;
                if (thisTile >= 0 && thisTile <= 3599) {
                    if (!aroundTilesIds.includes(thisTile)) {
                        aroundTilesIds.push(thisTile);
                    }
                }
            }
            if (rand.rand(1,2) === 1 || tile.rt.checks.length >= 4) {
                thisTile = tile.id-mapSize;
                if (thisTile >= 0 && thisTile <= 3599) {
                    if (!aroundTilesIds.includes(thisTile)) {
                        aroundTilesIds.push(thisTile);
                    }
                }
            }
            if (rand.rand(1,2) === 1 || tile.rt.checks.length >= 4) {
                thisTile = tile.id+mapSize;
                if (thisTile >= 0 && thisTile <= 3599) {
                    if (!aroundTilesIds.includes(thisTile)) {
                        aroundTilesIds.push(thisTile);
                    }
                }
            }
            if (rand.rand(1,2) === 1 || tile.rt.checks.length >= 4) {
                thisTile = tile.id-mapSize-1;
                if (thisTile >= 0 && thisTile <= 3599) {
                    if (!aroundTilesIds.includes(thisTile)) {
                        aroundTilesIds.push(thisTile);
                    }
                }
            }
            if (rand.rand(1,2) === 1 || tile.rt.checks.length >= 4) {
                thisTile = tile.id-mapSize+1;
                if (thisTile >= 0 && thisTile <= 3599) {
                    if (!aroundTilesIds.includes(thisTile)) {
                        aroundTilesIds.push(thisTile);
                    }
                }
            }
            if (rand.rand(1,2) === 1 || tile.rt.checks.length >= 4) {
                thisTile = tile.id+mapSize-1;
                if (thisTile >= 0 && thisTile <= 3599) {
                    if (!aroundTilesIds.includes(thisTile)) {
                        aroundTilesIds.push(thisTile);
                    }
                }
            }
            if (rand.rand(1,2) === 1 || tile.rt.checks.length >= 4) {
                thisTile = tile.id+mapSize+1;
                if (thisTile >= 0 && thisTile <= 3599) {
                    if (!aroundTilesIds.includes(thisTile)) {
                        aroundTilesIds.push(thisTile);
                    }
                }
            }
        }
    });
    if (aroundTilesIds.length >= 1) {
        aroundTilesIds.forEach(function(tileId) {
            let tile = getTileById(tileId);
            if (Object.keys(tile).length >= 1) {
                if (!tile.ruins) {
                    if (tile.infra === undefined) {
                        if (tile.terrain != 'W' && tile.terrain != 'L' && tile.terrain != 'R') {
                            if (rand.rand(1,2) === 1) {
                                tile.infra = 'Débris';
                                if (rand.rand(1,2) === 1) {
                                    tile.rd = true;
                                }
                            } else if (rand.rand(1,8) === 1) {
                                tile.ruins = true;
                                tile.sh = -1;
                                tile.rd = true;
                                delete tile.infra;
                                addScrapToRuins(tile);
                                checkRuinType(tile,true);
                            } else if (rand.rand(1,15) === 1) {
                                let elevate = false;
                                if (tile.rq === undefined) {
                                    elevate = true;
                                } else {
                                    if (tile.rq <= 0) {
                                        elevate = true;
                                    }
                                }
                                if (elevate) {
                                    if (tile.terrain != 'H' && tile.terrain != 'M') {
                                        tile.terrain = 'H';
                                    } else if (tile.terrain != 'M') {
                                        tile.terrain = 'M';
                                    }
                                }
                                if (rand.rand(1,5) === 1) {
                                    addThisRuinsToTile(tile,'Autoturrets',15);
                                } else {
                                    addThisRuinsToTile(tile,'Autoturrets',-1);
                                }
                            } else if (rand.rand(1,15) === 1) {
                                tile.infra = 'Miradors';
                                tile.rd = true;
                            } else if (rand.rand(1,25) === 1) {
                                tile.infra = 'Palissades';
                                tile.rd = true;
                            } else if (rand.rand(1,50) === 1) {
                                tile.infra = 'Terriers';
                                tile.rd = true;
                            }
                        }
                    }
                }
            }
        });
    }
};

function addThisRuinsToTile(tile,ruinsName,sh) {
    if (sh === undefined) {sh = -1;}
    tile.ruins = true;
    tile.sh = sh;
    tile.rd = true;
    delete tile.infra;
    addScrapToRuins(tile);
    let ruinType = {};
    let theRuin = getEquipByName(ruinsName);
    if (Object.keys(theRuin).length >= 1) {
        ruinType.name = theRuin.name;
        ruinType.checks = theRuin.checks;
        ruinType.scrap = theRuin.scrap;
    } else {
        ruinType.name = ruinsName;
        ruinType.checks = ['any'];
        ruinType.scrap = 200;
    }
    tile.rt = ruinType;
};

function deepWaters(zone) {
    zone.forEach(function(tile) {
        if (tile.terrain === 'R' && tile.seed >= 7) {
            tile.seed = rand.rand(1,3);
        }
        if (tile.terrain === 'L' || tile.terrain === 'W') {
            if (tile.seed >= 7) {
                tile.seed = rand.rand(1,6);
            }
        }
        if (tile.terrain === 'W') {
            if (checkDeep(tile)) {
                tile.terrain = 'L';
            }
        }
    });
};

function checkDeep(tile) {
    let nearTileId;
    nearTileId = tile.id+1;
    if (nearTileId >= 0 && nearTileId <= 3599) {
        if (zone[nearTileId].terrain != 'R' && zone[nearTileId].terrain != 'L' && zone[nearTileId].terrain != 'W') {
            if (rand.rand(1,8) != 1) {
                return false;
            } else {
                return true;
            }
        }
    }
    nearTileId = tile.id-1;
    if (nearTileId >= 0 && nearTileId <= 3599) {
        if (zone[nearTileId].terrain != 'R' && zone[nearTileId].terrain != 'L' && zone[nearTileId].terrain != 'W') {
            if (rand.rand(1,8) != 1) {
                return false;
            } else {
                return true;
            }
        }
    }
    nearTileId = tile.id+mapSize;
    if (nearTileId >= 0 && nearTileId <= 3599) {
        if (zone[nearTileId].terrain != 'R' && zone[nearTileId].terrain != 'L' && zone[nearTileId].terrain != 'W') {
            if (rand.rand(1,8) != 1) {
                return false;
            } else {
                return true;
            }
        }
    }
    nearTileId = tile.id-mapSize;
    if (nearTileId >= 0 && nearTileId <= 3599) {
        if (zone[nearTileId].terrain != 'R' && zone[nearTileId].terrain != 'L' && zone[nearTileId].terrain != 'W') {
            if (rand.rand(1,8) != 1) {
                return false;
            } else {
                return true;
            }
        }
    }
    return true;
}

function checkZoneType() {
    // oeufs voilés
    zoneInfos.ieggs = false;
    zoneInfos.ieggsBonus = 0;
    let sead = zone[1].seed;
    if (sead > 6) {
        sead = sead-6;
    }
    let ieggsLevel = (Math.ceil(zone[0].mapDiff/3)*2)+sead;
    if (ieggsLevel >= 8) {
        zoneInfos.ieggs = true;
        if (zone[2].seed === 4) {
            zoneInfos.ieggsBonus = 3;
        } else {
            zoneInfos.ieggsBonus = 0;
        }
    }
    if (playerInfos.gLevel >= 15) {
        zoneInfos.ieggs = true;
        if (playerInfos.gLevel >= 18) {
            zoneInfos.ieggsBonus = 3;
        }
    }
    // swamp map
    let swampMap = false;
    if (zone[0].ps+zone[0].pw >= 60) {
        swampMap = true;
    }
    // special zones
    zoneInfos.type = 'normal';
    zone[0].type = 'normal';
    zoneInfos.cb = false; // if true add class b to class c
    zoneInfos.as = false; // if true add class s to class a
    if (zone[0].terrain != 'V' && (playerInfos.gLevel < 19 || zone[0].edited)) {
        if ((swampMap || zone[0].edited) && (zone[0].mapDiff >= 5 || zone[0].edited) && zone[3].seed === 1 && zone[9].seed <= 2) {
            zoneInfos.type = 'leech';
            zone[0].type = 'leech';
            zoneInfos.cb = true;
            zone[0].rc = ["Vers","Larves"];
            zone[0].rb = ["Lucioles","Wurms"];
            zone[0].ra = ["Libellules","Megagrubz"];
        } else if ((zone[0].ps+zone[0].pw >= 30 || zone[0].edited) && (zone[0].mapDiff >= 2 || zone[0].edited) && zone[3].seed === 2 && zone[9].seed <= 3) {
            zoneInfos.type = 'flies';
            zone[0].type = 'flies';
            zone[0].rc = ["Larves","Lombrics"];
            zone[0].rb = ["Wurms","Moucherons"];
            zone[0].ra = ["Megagrubz","Libellules"];
        } else if ((zone[0].pb >= 25 || zone[0].edited) && (zone[0].mapDiff >= 2 || zone[0].edited) && zone[3].seed === 4 && zone[9].seed <= 3) {
            zoneInfos.type = 'roaches';
            zone[0].type = 'roaches';
            zoneInfos.as = true;
            zone[0].rc = ["Scorpions","Blattes"];
            zone[0].rb = ["Bourdons","Ojos"];
            zone[0].ra = ["Androks","Homards"];
        } else if ((zone[0].pf >= 25 || zone[0].edited) && (zone[0].mapDiff >= 7 || zone[0].edited) && zone[3].seed === 5 && zone[9].seed === 1) {
            zoneInfos.type = 'spinne';
            zone[0].type = 'spinne';
            zoneInfos.cb = true;
            zoneInfos.as = true;
            zone[0].rc = ["Cracheuses","Torches"];
            zone[0].rb = ["Faucheux","Discoballs"];
        } else if ((zone[0].pm >= 25 || zone[0].edited) && (zone[0].mapDiff >= 5 || zone[0].edited) && zone[3].seed === 6 && zone[9].seed <= 2) {
            zoneInfos.type = 'bigbugs';
            zone[0].type = 'bigbugs';
            zoneInfos.as = true;
            zone[0].rc = ["Grabbers","Escarbots"];
            zone[0].rb = ["Spitbugs","Broyeurs"];
            zone[0].ra = ["Scarabs","Bigheads"];
        } else if ((zone[0].ps+zone[0].pw <= 10 || zone[0].edited) && (zone[0].mapDiff >= 4 || zone[0].edited) && zone[3].seed === 3 && zone[9].seed <= 2) {
            zoneInfos.type = 'ants';
            zone[0].type = 'ants';
            zoneInfos.cb = true;
            zone[0].rc = ["Cafards","Fourmis"];
            zone[0].rb = ["Ojos","Skolos"];
            zone[0].ra = ["Galéodes","Mantes"];
        }
    }
    // Test
    // zoneInfos.type = 'leech';
    // zoneInfos.cb = true;
    zoneInfos.surf = false;
    if (zoneInfos.type === 'normal' && zone[0].terrain != 'V') {
        // surf zone
        if (swampMap && zone[0].mapDiff >= 4 && zone[2].seed <= 4) {
            zoneInfos.surf = true;
        } else if (zone[0].mapDiff >= 2 && zone[0].mapDiff < 8) {
            checkZoneARep();
        }
    }
    console.log('ZONE TYPE');
    console.log(zoneInfos);
};

function checkZoneARep() {
    let toDo = true;
    if (zone[0].rc === undefined) {
        toDo = true;
    } else {
        toDo = false;
    }
    if (toDo) {
        if (rand.rand(1,3) === 1) {
            zone[0].rc = ["Yapa","Bugs"];
        } else {
            let domAlien = getZoneDomAlien();
            if (domAlien === 'bug') {
                let aoa = ["Bugs","Punaises","Escarbots","Grabbers"];
                let inAlien = _.sample(aoa);
                let index = aoa.indexOf(inAlien);
                if (index > -1) {
                    aoa.splice(index,1);
                }
                let outAlien = _.sample(aoa);
                zone[0].rc = [inAlien,outAlien];
                aoa = ["Broyeurs","Chancres","Firebugs","Spitbugs"];
                inAlien = _.sample(aoa);
                index = aoa.indexOf(inAlien);
                if (index > -1) {
                    aoa.splice(index,1);
                }
                outAlien = _.sample(aoa);
                zone[0].rb = [inAlien,outAlien];
                if (outAlien === 'Spitbugs') {
                    zone[0].ra = ["Dragons","Scarabs"];
                }
                if (outAlien === 'Firebugs') {
                    zone[0].ra = ["Bigheads","Dragons"];
                }
            }
            if (domAlien === 'swarm') {
                let aoa = ["Cafards","Blattes","Scorpions","Necros"];
                let inAlien = _.sample(aoa);
                let index = aoa.indexOf(inAlien);
                if (index > -1) {
                    aoa.splice(index,1);
                }
                let outAlien = _.sample(aoa);
                zone[0].rc = [inAlien,outAlien];
                if (inAlien === 'Fourmis') {
                    zone[0].ra = ["Mantes","Galéodes"];
                } else if (inAlien === 'Scorpions') {
                    zone[0].ra = ["Androks","Galéodes"];
                }
                if (outAlien === 'Scorpions') {
                    zone[0].rb = ["Bourdons","Skolos"];
                    zone[0].ra = ["Mantes","Androks"];
                } else if (outAlien === 'Necros') {
                    zone[0].rb = ["Bourdons","Ojos"];
                    if (inAlien === 'Fourmis') {
                        zone[0].ra = ["Mantes","Necros"];
                    } else if (inAlien === 'Scorpions') {
                        zone[0].ra = ["Androks","Necros"];
                    } else {
                        zone[0].ra = ["Galéodes","Necros"];
                    }
                } else {
                    aoa = ["Fourmis","Skolos","Bourdons","Ojos"];
                    inAlien = _.sample(aoa);
                    index = aoa.indexOf(inAlien);
                    if (index > -1) {
                        aoa.splice(index,1);
                    }
                    index = aoa.indexOf('Ojos');
                    if (index > -1) {
                        aoa.splice(index,1);
                    }
                    outAlien = _.sample(aoa);
                    zone[0].rb = [inAlien,outAlien];
                }
            }
            if (domAlien === 'spider') {
                let aoa = ["Cracheuses","Gluantes","Nerveuses","Surfeuses"];
                let inAlien = _.sample(aoa);
                let index = aoa.indexOf(inAlien);
                if (index > -1) {
                    aoa.splice(index,1);
                }
                let outAlien = _.sample(aoa);
                zone[0].rc = [inAlien,outAlien];
                if (inAlien === 'Gluantes') {
                    zone[0].ra = ["Glaireuses","Veuves"];
                }
                aoa = ["Faucheux","Sournoises","Torches","Discoballs"];
                inAlien = _.sample(aoa);
                index = aoa.indexOf(inAlien);
                if (index > -1) {
                    aoa.splice(index,1);
                }
                outAlien = _.sample(aoa);
                zone[0].rb = [inAlien,outAlien];
                if (inAlien === 'Faucheux') {
                    zone[0].ra = ["Mygales","Veuves"];
                }
            }
            if (domAlien === 'larve') {
                let aoa = ["Lombrics","Larves","Asticots","Vers"];
                let inAlien = _.sample(aoa);
                let index = aoa.indexOf(inAlien);
                if (index > -1) {
                    aoa.splice(index,1);
                }
                let outAlien = _.sample(aoa);
                zone[0].rc = [inAlien,outAlien];
                if (inAlien === 'Lombrics') {
                    zone[0].rb = ["Sangsues","Ombres"];
                    zone[0].ra = ["Libellules","Fantômes"];
                }
                if (inAlien === 'Larves') {
                    if (outAlien === 'Asticots') {
                        zone[0].rb = ["Wurms","Moucherons"];
                        zone[0].ra = ["Megagrubz","Libellules"];
                    } else if (outAlien === 'Vers') {
                        zone[0].rb = ["Wurms","Lucioles"];
                        zone[0].ra = ["Megagrubz","Libellules"];
                    } else {
                        zone[0].rb = ["Wurms","Sangsues"];
                        zone[0].ra = ["Megagrubz","Libellules"];
                    }
                }
                if (inAlien === 'Vers') {
                    if (outAlien === 'Larves') {
                        zone[0].rb = ["Lucioles","Wurms"];
                        zone[0].ra = ["Libellules","Megagrubz"];
                    } else if (outAlien === 'Asticots') {
                        zone[0].rb = ["Lucioles","Moucherons"];
                    } else {
                        zone[0].rb = ["Lucioles","Sangsues"];
                        zone[0].ra = ["Fantômes","Libellules"];
                    }
                }
                if (inAlien === 'Asticots') {
                    if (outAlien === 'Larves') {
                        zone[0].rb = ["Moucherons","Wurms"];
                        zone[0].ra = ["Libellules","Megagrubz"];
                    } else if (outAlien === 'Vers') {
                        zone[0].rb = ["Moucherons","Lucioles"];
                    } else {
                        zone[0].rb = ["Moucherons","Sangsues"];
                        zone[0].ra = ["Fantômes","Libellules"];
                    }
                }
            }
        }
    }
};

function getZoneDomAlien() {
    let domAlien = 'bug';
    let ex = {};
    ex.bug = zone[0].pm+zone[0].ph;
    if (zone[0].pKind === 'bug') {
        ex.bug = ex.bug+zone[0].pp;
    }
    if (zone[0].gKind === 'bug') {
        ex.bug = ex.bug+zone[0].pg;
    }
    if (zone[0].sKind === 'bug') {
        ex.bug = ex.bug+zone[0].ps;
    }
    ex.swarm = zone[0].pb;
    if (zone[0].pKind === 'swarm') {
        ex.swarm = ex.swarm+zone[0].pp;
    }
    if (zone[0].gKind === 'swarm') {
        ex.swarm = ex.swarm+zone[0].pg;
    }
    if (zone[0].sKind === 'swarm') {
        ex.swarm = ex.swarm+zone[0].ps;
    }
    ex.spider = zone[0].pf;
    if (zone[0].pKind === 'spider') {
        ex.spider = ex.spider+zone[0].pp;
    }
    if (zone[0].gKind === 'spider') {
        ex.spider = ex.spider+zone[0].pg;
    }
    if (zone[0].sKind === 'spider') {
        ex.spider = ex.spider+zone[0].ps;
    }
    ex.larve = zone[0].pw+zone[0].pr;
    if (zone[0].pKind === 'larve') {
        ex.larve = ex.larve+zone[0].pp;
    }
    if (zone[0].gKind === 'larve') {
        ex.larve = ex.larve+zone[0].pg;
    }
    if (zone[0].sKind === 'larve') {
        ex.larve = ex.larve+zone[0].ps;
    }
    let max = Math.max(ex.bug,ex.swarm,ex.spider,ex.larve);
    if (ex.larve === max) {
        domAlien = 'larve';
    }
    if (ex.swarm === max) {
        domAlien = 'swarm';
    }
    if (ex.spider === max) {
        domAlien = 'spider';
    }
    if (ex.bug === max) {
        domAlien = 'bug';
    }
    return domAlien;
};
