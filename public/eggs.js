function checkStartingAliens() {
    if (playerInfos.mapDiff >= 8) {
        let numRuches = rand.rand(1,2);
        if (playerInfos.mapDiff === 9) {
            numRuches = rand.rand(3,5);
        }
        if (playerInfos.mapDiff === 10) {
            numRuches = rand.rand(6,12);
        }
        let i = 1;
        while (i <= numRuches) {
            dropEgg('Ruche');
            if (i > 20) {break;}
            i++
        }
    }
};

function checkEggsDrop() {
    console.log('check egg drop');
    eggDropCount = 0;
    let drop = false;
    let adjMapDrop = playerInfos.mapDrop;
    let adjMapTurn = playerInfos.mapTurn-10+playerInfos.mapDiff;
    if (adjMapTurn <= 0) {
        adjMapTurn = 0;
        adjMapDrop = 0;
    }
    let dropTurn = Math.floor(((adjMapDrop*cumDrop)+adjMapTurn)/(cumDrop+1));
    console.log(playerInfos.mapAdjDiff);
    let dropChance = Math.round((dropTurn*Math.sqrt(playerInfos.mapAdjDiff)*dropMod)+playerInfos.mapAdjDiff-5);
    if (dropChance < 0) {
        dropChance = 0;
    }
    console.log('dropChance='+dropChance);
    if (rand.rand(1,100) <= dropChance && aliens.length < maxAliens && !playerInfos.eggPause) {
        drop = true;
        eggsDrop();
    }
    if (drop || playerInfos.eggPause) {
        playerInfos.mapDrop = 0;
        if (rand.rand(1,eggPauseEnd) === 1) {
            playerInfos.eggPause = false;
        }
    } else {
        playerInfos.mapDrop = playerInfos.mapDrop+1;
    }
    if (eggDropCount >= 1) {
        eggSound();
        playMusic('newEgg',false);
    } else {
        playMusic('noEgg',false);
    }
};

function eggsDrop() {
    console.log('EGGDROP');
    let numEggs;
    let eggDice = rand.rand(1,100);
    let threeEggsChance = playerInfos.mapAdjDiff-4;
    if (threeEggsChance < 0) {
        threeEggsChance = 0;
    }
    let twoEggsChance = Math.floor(playerInfos.mapAdjDiff*1.25)-2;
    if (twoEggsChance < 0) {
        twoEggsChance = 0;
    }
    if (eggDice <= noEggs) {
        numEggs = 0;
        if (rand.rand(1,5) === 1) {
            playerInfos.eggPause = true;
        }
    } else if (eggDice <= noEggs+twoEggsChance) {
        numEggs = 2;
    } else if (eggDice <= noEggs+twoEggsChance+threeEggsChance) {
        numEggs = 3;
    } else {
        numEggs = 1;
    }
    console.log('eggDice='+eggDice);
    if (numEggs >= 1) {
        let i = 1;
        while (i <= numEggs) {
            if (rand.rand(1,100) <= coqueChance) {
                dropEgg('Coque');
            } else {
                dropEgg('Oeuf');
            }
            if (i > 4) {break;}
            i++
        }
    }
};

function dropEgg(alienUnit) {
    console.log('dropping egg...');
    let unitIndex = alienUnits.findIndex((obj => obj.name === alienUnit));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx'];
    alienOccupiedTileList();
    playerOccupiedTileList();
    let tileOK = false;
    let maxTileId = (mapSize*mapSize)-1;
    let dropTile = rand.rand(0,maxTileId);
    console.log('dropTile='+dropTile);
    if (!alienOccupiedTiles.includes(dropTile) && !playerOccupiedTiles.includes(dropTile)) {
        tileOK = true;
    }
    if (!tileOK) {
        dropTile = rand.rand(0,maxTileId);
        console.log('dropTile='+dropTile);
        if (!alienOccupiedTiles.includes(dropTile) && !playerOccupiedTiles.includes(dropTile)) {
            tileOK = true;
        }
    }
    if (!tileOK) {
        dropTile = rand.rand(0,maxTileId);
        console.log('dropTile='+dropTile);
        if (!alienOccupiedTiles.includes(dropTile) && !playerOccupiedTiles.includes(dropTile)) {
            tileOK = true;
        }
    }
    if (tileOK) {
        putBat(dropTile);
        if (alienUnit === 'Oeuf' || alienUnit === 'Coque') {
            eggDropCount = eggDropCount+1;
        }
        if (playerInfos.eggsKilled >=1 && (playerInfos.eggsKilled-playerInfos.pauseSeed) % pauseCount === 0) {
            playerInfos.eggPause = true;
        }
    }
};

function morphList() {
    let transList = [];
    if (rand.rand(1,15) === 1) {
        transList.push('Asticots');
    }
    if (rand.rand(1,15) === 1) {
        transList.push('Larves');
    }
    console.log(transList);
    return transList;
};

function aliensCount() {
    let aliensNums = {lucioles:0,moucherons:0,bugs:0,scorpions:0,fourmis:0,cafards:0,gluantes:0,larves:0};
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.type === 'Lucioles') {
                aliensNums.lucioles = aliensNums.lucioles+1;
            } else if (bat.type === 'Bugs') {
                aliensNums.bugs = aliensNums.bugs+1;
            } else if (bat.type === 'Scorpions') {
                aliensNums.scorpions = aliensNums.scorpions+1;
            } else if (bat.type === 'Larves') {
                aliensNums.larves = aliensNums.larves+1;
            } else if (bat.type === 'Fourmis') {
                aliensNums.fourmis = aliensNums.fourmis+1;
            } else if (bat.type === 'Cafards') {
                aliensNums.cafards = aliensNums.cafards+1;
            } else if (bat.type === 'Gluantes') {
                aliensNums.gluantes = aliensNums.gluantes+1;
            } else if (bat.type === 'Moucherons') {
                aliensNums.moucherons = aliensNums.moucherons+1;
            }
        }
    });
    return aliensNums;
};

function spawns() {
    console.log('check eggs');
    let batType;
    let vomiCheck;
    let eggTurn;
    let eggModTurn;
    let transList = morphList();
    let aliensNums = aliensCount();
    let vomiToRuche = 20-Math.round(playerInfos.mapDiff*1.5);
    if (vomiToRuche < 5) {
        vomiToRuche = 5;
    }
    let maxPonte = playerInfos.mapAdjDiff+3;
    let flyDice;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            flyDice = rand.rand(1,6);
            if (bat.type === 'Oeuf' || bat.type === 'Coque') {
                batType = getBatType(bat);
                eggTurn = playerInfos.mapTurn-bat.creaTurn+1;
                eggModTurn = eggTurn+playerInfos.mapAdjDiff-8;
                vomiCheck = ((batType.squads-bat.squadsLeft)*vomiChance)+(eggModTurn*3);
                if (rand.rand(1,100) <= vomiCheck && bat.type === 'Oeuf') {
                    vomiSpawn(bat);
                }
                eggSpawn(bat,true);
            } else if (bat.type === 'Ruche') {
                eggSpawn(bat,false);
            } else if (bat.type === 'Vermisseaux' && flyDice === 1 && aliensNums.lucioles < Math.round(maxPonte/1.5)) {
                alienSpawn(bat,'Lucioles');
            } else if (bat.type === 'Vermisseaux' && flyDice >= 5 && aliensNums.moucherons < Math.round(maxPonte*1.5)) {
                alienSpawn(bat,'Moucherons');
            } else if (transList.includes('Asticots') && bat.type === 'Asticots') {
                alienMorph(bat,'Moucherons',false);
            } else if (transList.includes('Larves') && bat.type === 'Larves') {
                alienMorph(bat,'Wurms',false);
            } else if (rand.rand(1,vomiToRuche) === 1 && bat.type === 'Vomissure') {
                alienMorph(bat,'Ruche',true);
            } else if (bat.type === 'Bug Boss' && aliensNums.bugs < maxPonte*2) {
                alienSpawn(bat,'Bugs');
            } else if (bat.type === 'Androks' && aliensNums.scorpions < Math.round(maxPonte*1.5)) {
                alienSpawn(bat,'Scorpions');
            } else if (bat.type === 'Megagrubz' && rand.rand(1,2) === 1 && aliensNums.larves < maxPonte) {
                alienSpawn(bat,'Scorpions');
            } else if (bat.type === 'Cafards' && rand.rand(1,6) === 1 && aliensNums.fourmis < maxPonte*3) {
                alienSpawn(bat,'Cafards');
            } else if (bat.type === 'Glaireuse' && aliensNums.gluantes < maxPonte) {
                alienSpawn(bat,'Gluantes');
            }
        }
    });
};

function vomiSpawn(bat) {
    console.log('SPAWN: Vomissure');
    fearFactor(bat,true);
    let dropTile = -1;
    let unitIndex = alienUnits.findIndex((obj => obj.name == 'Vomissure'));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx'];
    console.log(conselUnit);
    if (Object.keys(conselUnit).length >= 1) {
        dropTile = checkDropBlob(bat);
        if (dropTile >= 0) {
            putBat(dropTile);
            blobEat(dropTile);
        }
    }
};

function blobEat(layBlob) {
    let batId = -1;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone' && bat.tileId === layBlob) {
            batId = bat.id;
        }
    });
    let unitIndex = bataillons.findIndex((obj => obj.id == batId));
    if (unitIndex > -1) {
        bataillons.splice(unitIndex,1);
        warning('Bataillon englouti',bat.type+' a été détruit par la vomissure.');
    }
};

function checkDropBlob(layBat) {
    let possibleDrops = [];
    let batHere = false;
    let tileDrop = -1;
    let distance;
    zone.forEach(function(tile) {
        distance = calcDistance(layBat.tileId,tile.id);
        if (distance == 0) {
            batHere = false;
            aliens.forEach(function(bat) {
                if (bat.loc === "zone" && bat.tileId === tile.id) {
                    batHere = true;
                }
            });
            if (!batHere) {
                possibleDrops.push(tile.id);
            }
        }
    });
    if (possibleDrops.length > 1) {
        possibleDrops = [_.sample(possibleDrops)];
        tileDrop = possibleDrops[0];
    }
    return tileDrop;
};

function alienSpawn(bat,crea) {
    console.log('SPAWN: '+crea);
    let dropTile = -1;
    let unitIndex = alienUnits.findIndex((obj => obj.name == crea));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx'];
    console.log(conselUnit);
    if (Object.keys(conselUnit).length >= 1) {
        dropTile = checkDrop(bat);
        if (dropTile >= 0) {
            putBat(dropTile);
        }
    }
};

function alienMorph(bat,newBatName,reset) {
    let putTile = bat.tileId;
    let eTags = bat.tags;
    let eCreaTurn = bat.creaTurn;
    // delete bat
    deadAliensList.push(bat.id);
    // let batIndex = aliens.findIndex((obj => obj.id == bat.id));
    // aliens.splice(batIndex,1);
    // put new
    let unitIndex = alienUnits.findIndex((obj => obj.name == newBatName));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx'];
    putBat(putTile);
    // Turn & Tags
    batIndex = aliens.findIndex((obj => obj.tileId == putTile));
    let newAlien = aliens[batIndex];
    if (!reset) {
        newAlien.tags = eTags;
        newAlien.creaTurn = eCreaTurn;
    }
};

function eggSpawn(bat,fromEgg) {
    console.log('SPAWN');
    let eggTurn = playerInfos.mapTurn-bat.creaTurn+1;
    let eggModTurn = eggTurn+playerInfos.mapDiff-3;
    let eggLife = eggLifeStart+Math.floor(playerInfos.mapDiff*eggLifeFactor);
    if (bat.type === 'Coque') {
        eggModTurn = eggTurn+playerInfos.mapDiff-3;
        eggLife = coqLifeStart+Math.floor(playerInfos.mapDiff*coqLifeFactor);
    }
    console.log('eggTurn='+eggTurn);
    if (eggTurn >= eggLife && fromEgg) {
        // TRANFORMATION EN RUCHE !
        if (bat.type === 'Oeuf') {
            alienMorph(bat,'Ruche',false);
        } else {
            alienMorph(bat,'Volcan',false);
        }
    } else {
        let spawnChance = Math.round(eggTurn*20*bat.squadsLeft/6*Math.sqrt(playerInfos.mapAdjDiff)/2*Math.sqrt(Math.sqrt(playerInfos.mapTurn)));
        if (!fromEgg || bat.type === 'Coque') {
            spawnChance = 100;
        }
        console.log('spawnChance='+spawnChance);
        if (rand.rand(1,100) <= spawnChance) {
            let maxSpawn = eggTurn-11+bat.squadsLeft+Math.floor(Math.sqrt(playerInfos.mapAdjDiff));
            if (maxSpawn < 1 || !fromEgg) {
                maxSpawn = 1;
            }
            if (maxSpawn > Math.round((playerInfos.mapAdjDiff+8)/3)) {
                maxSpawn = Math.round((playerInfos.mapAdjDiff+8)/3);
            }
            if (maxSpawn > 8) {
                maxSpawn = 8;
            }
            console.log('maxSpawn='+maxSpawn);
            let spawnNum = 1;
            if (maxSpawn >= 2) {
                spawnNum = rand.rand(Math.ceil(maxSpawn/2),maxSpawn);
            }
            console.log('spawnNum='+spawnNum);
            let classes = [];
            let minTurnB = 33-Math.round(playerInfos.mapAdjDiff*2);
            let minTurnA = 66-Math.round(playerInfos.mapAdjDiff*3);
            classes.push('C');
            if (eggModTurn >= 7 && playerInfos.mapTurn >= minTurnB) {
                classes.push('B');
                if (eggModTurn >= 13 && playerInfos.mapTurn >= minTurnA) {
                    classes.push('A');
                    if (eggModTurn >= 20 && playerInfos.mapTurn >= minTurnA && fromEgg) {
                        const index = classes.indexOf('C');
                        if (index > -1) {
                            classes.splice(index,1);
                        }
                    }
                }
            }
            console.log(classes);
            let eggCat = checkEggCat(bat);
            console.log('eggCat: '+eggCat);
            let checkDiceMax = 0;
            let checkDice;
            let raritySum = 0;
            let dropTile = -1;
            alienUnits.forEach(function(unit) {
                if (classes.includes(unit.class) && unit.kind.includes(eggCat)) {
                    checkDiceMax = checkDiceMax+unit.rarity;
                }
            });
            console.log('checkDiceMax='+checkDiceMax);
            let i = 1;
            while (i <= spawnNum) {
                conselUnit = {};
                conselAmmos = ['xxx','xxx'];
                checkDice = rand.rand(1,checkDiceMax);
                console.log('checkDice='+checkDice);
                raritySum = 0;
                alienUnits.forEach(function(unit) {
                    if (classes.includes(unit.class) && Object.keys(conselUnit).length <= 0 && unit.kind.includes(eggCat)) {
                        raritySum = raritySum+unit.rarity;
                        console.log('raritySum='+raritySum);
                        if (checkDice <= raritySum) {
                            conselUnit = unit;
                        }
                    }
                });
                console.log('spawned unit ->');
                console.log(conselUnit);
                if (Object.keys(conselUnit).length >= 1) {
                    dropTile = checkDrop(bat);
                    if (dropTile >= 0) {
                        putEggCat(bat,conselUnit.kind);
                        putBat(dropTile);
                    }
                }
                if (i > 8) {break;}
                i++
            }
        } else {
            console.log('no spawn');
        }
    }
};

function putEggCat(bat,kind) {
    if (!bat.tags.includes('bug') && !bat.tags.includes('larve') && !bat.tags.includes('swarm') && !bat.tags.includes('spider') && !bat.tags.includes('blob')) {
        bat.tags.push(kind);
    }
};

function checkEggCat(bat) {
    if (bat.tags.includes('bug')) {
        return 'bug';
    } else if (bat.tags.includes('larve')) {
        return 'larve';
    } else if (bat.tags.includes('spider')) {
        return 'spider';
    } else if (bat.tags.includes('swarm')) {
        return 'swarm';
    } else if (bat.tags.includes('blob')) {
        return 'blob';
    } else {
        return '';
    }
};

function checkDrop(layBat) {
    let possibleDrops = [];
    let batHere = false;
    let tileDrop = -1;
    zone.forEach(function(tile) {
        if (isAdjacent(layBat.tileId,tile.id)) {
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
    if (possibleDrops.length > 1) {
        possibleDrops = [_.sample(possibleDrops)];
        tileDrop = possibleDrops[0];
    }
    return tileDrop;
};
