function checkStartingAliens() {
    let numRuches;
    if (playerInfos.mapDiff >= 8) {
        numRuches = rand.rand(1,2);
        if (playerInfos.mapDiff === 9) {
            numRuches = rand.rand(3,5);
        }
        if (playerInfos.mapDiff === 10) {
            numRuches = rand.rand(6,12);
        }
        let i = 1;
        while (i <= numRuches) {
            dropEgg('Ruche',false);
            if (i > 20) {break;}
            i++
        }
    }
    let numVomi = Math.floor((playerInfos.mapDiff+2)*rand.rand(8,20)/14);
    let ii = 1;
    while (ii <= numVomi) {
        dropEgg('Flaque',false);
        if (ii > 50) {break;}
        ii++
    }
    let numSent = Math.ceil((playerInfos.mapDiff+2)*rand.rand(8,20)/8);
    ii = 1;
    while (ii <= numSent) {
        dropEgg('Sentinelles',false);
        if (ii > 50) {break;}
        ii++
    }
};

function calcEggPause(noMax) {
    let eggPauseDice = eggPauseBase;
    eggPauseDice = eggPauseDice+Math.round(Math.sqrt(aliens.length)*2);
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.type.includes('Oeuf')) {
                eggPauseDice = eggPauseDice+3;
            } else if (bat.type == 'Ruche') {
                eggPauseDice = eggPauseDice+0.5;
            } else if (bat.type == 'Coque') {
                eggPauseDice = eggPauseDice+1;
            }
        }
    });
    eggPauseDice = Math.floor(eggPauseDice);
    if (eggPauseDice < eggPauseMin) {
        eggPauseDice = eggPauseMin;
    }
    if (playerInfos.mapDiff >= 10) {
        eggPauseDice = eggPauseMin;
    }
    if (!noMax) {
        if (eggPauseDice > eggPauseMax) {
            eggPauseDice = eggPauseMax;
        }
    } else {
        if (eggPauseDice > 50) {
            eggPauseMax = 50;
        }
    }

    console.log('EGG PAUSE DICE = '+eggPauseDice);
    return eggPauseDice;
};

function checkEggsDrop() {
    console.log('check egg drop');
    eggDropCount = 0;
    let drop = false;
    let eggPauseDice = calcEggPause(false);
    let adjMapDrop = playerInfos.mapDrop;
    let adjMapTurn = playerInfos.mapTurn-10+playerInfos.mapDiff;
    if (adjMapTurn <= 0) {
        adjMapTurn = 0;
        adjMapDrop = 0;
    }
    let dropTurn = Math.floor(((adjMapDrop*cumDrop)+adjMapTurn)/(cumDrop+1));
    console.log(playerInfos.mapAdjDiff);
    let dropChance = Math.round(dropTurn*Math.sqrt(playerInfos.mapAdjDiff)*dropMod);
    if (dropChance < 0) {
        dropChance = 0;
    }
    if (eggsNum >= 2 && playerInfos.mapDiff <= 1) {
        dropChance = 0;
    }
    if (aliens.length >= maxAliens) {
        dropChance = 0;
    }
    if (playerInfos.eggPause) {
        dropChance = 0;
    }
    console.log('dropChance='+dropChance);
    if (playerInfos.pseudo === 'Bob') {
        warning('Oeufs','Check '+dropChance+'%');
    }
    if (rand.rand(1,100) <= dropChance && playerInfos.mapDiff >= 1) {
        drop = true;
        eggsDrop();
    }
    if (drop || playerInfos.eggPause) {
        playerInfos.mapDrop = 0;
        if (playerInfos.eggPause) {
            if (rand.rand(1,eggPauseDice) === 1) {
                playerInfos.eggPause = false;
                console.log('END PAUSE! 1/'+eggPauseDice);
                if (playerInfos.pseudo === 'Bob') {
                    warning('Fin de la pause','Check 1/'+eggPauseDice+' réussi.');
                }
            } else {
                if (playerInfos.pseudo === 'Bob') {
                    warning('La pause continue','Check 1/'+eggPauseDice+' raté.');
                }
            }
        }
    } else {
        playerInfos.mapDrop = playerInfos.mapDrop+1;
    }
    if (eggDropCount >= 1) {
        eggSound();
        playMusic('newEgg',false);
        if (Math.floor(playerInfos.mapTurn/50) > playerInfos.cocons) {
            dropEgg('Cocon',false);
            playerInfos.cocons = playerInfos.cocons+1;
        }
    } else {
        playMusic('noEgg',false);
    }
    if (playerInfos.mapTurn % 25 === 0 && playerInfos.mapTurn > 1 && rand.rand(1,100) <= Math.round(playerInfos.fuzzTotal*playerInfos.fuzzTotal/1000)) {
        dropEgg('Ruche',true);
    }
};

function eggsDrop() {
    console.log('EGGDROP');
    let numEggs;
    let eggDice = rand.rand(1,100);
    let eggPausePerc = calcEggPause(true);
    eggPausePerc = Math.round(eggPausePerc*1.5);
    // chance for multiple eggs
    let threeEggsChance = Math.floor(playerInfos.mapAdjDiff*1.25)-4;
    if (threeEggsChance < 0) {
        threeEggsChance = 0;
    }
    let twoEggsChance = Math.floor(playerInfos.mapAdjDiff*2)-3;
    if (twoEggsChance < 0) {
        twoEggsChance = 0;
    }
    // minimum turn for multiple eggs
    let twoEggsMinTurn = 43-(playerInfos.mapDiff*3);
    if (playerInfos.mapTurn < twoEggsMinTurn) {
        twoEggsChance = 0;
    }
    let threeEggsMinTurn = 70-(playerInfos.mapDiff*5);
    if (playerInfos.mapTurn < threeEggsMinTurn) {
        threeEggsChance = 0;
    }
    if (eggDice <= noEggs) {
        numEggs = 0;
        if (rand.rand(1,100) <= eggPausePerc) {
            playerInfos.eggPause = true;
            console.log('PAUSE! '+eggPausePerc+'%');
            if (playerInfos.pseudo === 'Bob') {
                warning('Nouvelle pause','Check '+eggPausePerc+'% réussi après la chute de 0 oeuf ('+noEggs+'%)');
            }
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
        let eggTypeDice;
        let i = 1;
        while (i <= numEggs) {
            eggTypeDice = rand.rand(1,100);
            invisibleChance = Math.floor(playerInfos.mapDiff*1.5)-8;
            if (invisibleChance < 0) {
                invisibleChance = 0;
            } else {
                if (i > 1) {
                    invisibleChance = invisibleChance*2;
                }
            }
            if (eggTypeDice <= coqueChance) {
                dropEgg('Coque',false);
            } else if (eggTypeDice <= coqueChance+invisibleChance) {
                dropEgg('Oeuf voilé',false);
            } else {
                dropEgg('Oeuf',false);
            }
            if (i > 4) {break;}
            i++
        }
    }
};

function dropEgg(alienUnit,edge) {
    console.log('dropping egg...');
    let unitIndex = alienUnits.findIndex((obj => obj.name === alienUnit));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx','xxx'];
    alienOccupiedTileList();
    playerOccupiedTileList();
    let dropTile = eggDropTile(alienUnit,edge);
    if (dropTile >= 0) {
        if (alienUnit === 'Oeuf voilé') {
            putBat(dropTile,0,0,'invisible');
        } else {
            putBat(dropTile,0,0);
        }
        if (alienUnit.includes('Oeuf') || alienUnit === 'Coque' || alienUnit === 'Cocon') {
            eggDropCount = eggDropCount+1;
            if (alienUnit === 'Oeuf' || alienUnit === 'Coque' || alienUnit === 'Cocon') {
                eggsNum++;
            }
        }
        if (playerInfos.eggsKilled >=1 && (playerInfos.eggsKilled-playerInfos.pauseSeed) >= 1 && (playerInfos.eggsKilled-playerInfos.pauseSeed) % pauseCount === 0) {
            playerInfos.eggPause = true;
            console.log('PAUSE! '+playerInfos.eggsKilled+' eggs killed');
            if (playerInfos.pseudo === 'Bob') {
                warning('Nouvelle pause',playerInfos.eggsKilled+' oeufs tués.');
            }
        }
    }
};

function eggDropTile(eggName,edge) {
    let theTile = -1;
    let area = 'any';
    let targetTile = -1;
    if (edge) {
        area = 'edge';
    } else {
        if (eggName.includes('Ruche') || eggName.includes('Vomissure') || eggName.includes('Flaque')) {
            area = 'nocenter';
        } else if (eggName.includes('Cocon')) {
            area = 'target';
        } else if (eggName.includes('Sentinelles')) {
            if (rand.rand(1,6) === 1) {
                area = 'nocenter';
            } else {
                area = 'around';
            }
        }
    }
    // ANY
    if (area === 'any') {
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
            theTile = dropTile;
        }
    }
    // EDGE
    if (area === 'edge') {
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                if (tile.x >= 58 || tile.x <= 3 || tile.y >= 58 || tile.y <= 3) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
    }
    // NOCENTER
    if (area === 'nocenter') {
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                if (tile.x < 17 || tile.x > 43 || tile.y < 17 || tile.y > 43) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
    }
    // TARGET
    if (area === 'target') {
        let shufBats = _.shuffle(bataillons);
        let bestFuzz = -3;
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone") {
                if (bat.fuzz+rand.rand(0,2) > bestFuzz) {
                    targetTile = bat.tileId;
                    bestFuzz = bat.fuzz;
                }
            }
        });
        let shufZone = _.shuffle(zone);
        let distance;
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                distance = calcDistance(tile.id,targetTile);
                if (distance > 9 && distance < 13) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
    }
    // AROUND
    if (area === 'around') {
        let shufAliens = _.shuffle(aliens);
        shufAliens.forEach(function(bat) {
            if (bat.loc === "zone") {
                if (bat.type === 'Flaque') {
                    targetTile = bat.tileId;
                }
            }
        });
        let shufZone = _.shuffle(zone);
        let distance;
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                distance = calcDistance(tile.id,targetTile);
                if (distance <= 3 || (tile.terrain === 'H' && distance <= 4) || (tile.terrain === 'M' && distance <= 5)) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
    }
    return theTile;
}

function morphList() {
    let transList = [];
    if (rand.rand(1,15) === 1) {
        transList.push('Asticots');
    }
    if (rand.rand(1,15) === 1) {
        transList.push('Vers');
    }
    if (rand.rand(1,15) === 1 && playerInfos.mapDiff >= 6) {
        transList.push('Ombres');
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
    let vomiToRuche = 22-Math.round(playerInfos.mapDiff*1.5);
    if (vomiToRuche < 5) {
        vomiToRuche = 5;
    }
    let maxPonte = playerInfos.mapDiff+playerInfos.mapDiff+2;
    let flyDice;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            flyDice = rand.rand(1,6);
            if ((bat.type.includes('Oeuf') || bat.type === 'Coque') && aliens.length < maxAliens) {
                batType = getBatType(bat);
                eggTurn = playerInfos.mapTurn-bat.creaTurn+1;
                eggModTurn = eggTurn+(playerInfos.mapDiff*2)-12;
                vomiCheck = ((batType.squads-bat.squadsLeft)*vomiChance)+(eggModTurn*1);
                if (rand.rand(1,100) <= vomiCheck && bat.type === 'Oeuf') {
                    vomiSpawn(bat);
                }
                eggSpawn(bat,true);
            } else if (bat.type === 'Ruche' && aliens.length < maxAliens) {
                eggSpawn(bat,false);
            } else if (bat.type === 'Vermisseaux' && flyDice === 1 && aliens.length < maxAliens && aliensNums.lucioles < Math.round(maxPonte/1.5)) {
                alienSpawn(bat,'Lucioles');
            } else if (bat.type === 'Vermisseaux' && flyDice >= 5 && aliens.length < maxAliens && aliensNums.moucherons < Math.round(maxPonte*1.5)) {
                alienSpawn(bat,'Moucherons');
            } else if (transList.includes('Asticots') && bat.squadsLeft >= 5 && bat.type === 'Asticots') {
                alienMorph(bat,'Moucherons',false);
            } else if (transList.includes('Vers') && bat.squadsLeft >= 5 && bat.type === 'Vers') {
                alienMorph(bat,'Lucioles',false);
            } else if (transList.includes('Larves') && bat.squadsLeft >= 3 && bat.type === 'Larves') {
                alienMorph(bat,'Wurms',false);
            } else if (transList.includes('Ombres') && bat.type === 'Ombres') {
                alienMorph(bat,'Fantômes',false);
            } else if (rand.rand(1,vomiToRuche) === 1 && playerInfos.mapTurn >= Math.ceil(vomiToRuche/1.5) && bat.type === 'Vomissure') {
                alienMorph(bat,'Ruche',true);
            } else if (bat.type === 'Bug Boss' && aliens.length < maxAliens && aliensNums.bugs < maxPonte*2) {
                alienSpawn(bat,'Bugs');
            } else if (bat.type === 'Androks' && aliens.length < maxAliens && aliensNums.scorpions < Math.round(maxPonte*1.5)) {
                alienSpawn(bat,'Scorpions');
            } else if (bat.type === 'Megagrubz' && rand.rand(1,2) === 1 && aliens.length < maxAliens && aliensNums.larves < maxPonte) {
                alienSpawn(bat,'Scorpions');
            } else if (bat.type === 'Cafards' && bat.squadsLeft >= 6 && rand.rand(1,6) === 1 && aliens.length < maxAliens && aliensNums.cafards < maxPonte*3) {
                alienSpawn(bat,'Cafards');
            } else if (bat.type === 'Glaireuse' && aliens.length < maxAliens && aliensNums.gluantes < maxPonte) {
                alienSpawn(bat,'Gluantes');
            } else if (bat.type === 'Cocon') {
                cocoonSpawn(bat);
            }
        }
    });
};

function vomiSpawn(bat) {
    console.log('SPAWN: Vomissure');
    let kindTag = getEggKind(bat);
    fearFactor(bat,true);
    let dropTile = -1;
    let unitIndex = alienUnits.findIndex((obj => obj.name == 'Vomissure'));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx','xxx'];
    console.log(conselUnit);
    if (Object.keys(conselUnit).length >= 1) {
        dropTile = checkDropBlob(bat);
        if (dropTile >= 0) {
            putBat(dropTile,0,0,kindTag);
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
    conselAmmos = ['xxx','xxx','xxx'];
    console.log(conselUnit);
    if (Object.keys(conselUnit).length >= 1) {
        dropTile = checkDrop(bat);
        if (dropTile >= 0) {
            putBat(dropTile,0,0);
        }
    }
};

function alienMorph(bat,newBatName,reset) {
    let putTile = bat.tileId;
    let eTags = bat.tags;
    let eCreaTurn = bat.creaTurn;
    let kindTag = getEggKind(bat);
    // delete bat
    deadAliensList.push(bat.id);
    // let batIndex = aliens.findIndex((obj => obj.id == bat.id));
    // aliens.splice(batIndex,1);
    // put new
    let unitIndex = alienUnits.findIndex((obj => obj.name == newBatName));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx','xxx'];
    putBat(putTile,0,0,kindTag);
    // Turn & Tags
    batIndex = aliens.findIndex((obj => obj.tileId == putTile));
    let newAlien = aliens[batIndex];
};

function cocoonSpawn(bat) {
    console.log('SPAWN');
    let eggTurn = playerInfos.mapTurn-bat.creaTurn+1;
    let eggLife = 2;
    console.log('eggTurn='+eggTurn);
    if (eggTurn > eggLife) {
        // TRANFORMATION EN VOLCAN !
        alienMorph(bat,'Volcan',false);
    } else {
        if (eggTurn < 3) {
            let classes = [];
            let spawnNum = 4;
            if (eggTurn === 2) {
                spawnNum = 10;
                if (playerInfos.mapDiff >= 10) {
                    classes.push('A');
                } else if (playerInfos.mapDiff >= 8) {
                    classes.push('A');
                    classes.push('B');
                } else if (playerInfos.mapDiff >= 6) {
                    classes.push('A');
                    classes.push('B');
                    classes.push('C');
                } else if (playerInfos.mapDiff >= 4) {
                    classes.push('B');
                    classes.push('C');
                } else {
                    classes.push('C');
                }
            } else {
                spawnNum = playerInfos.mapDiff+(rand.rand(1,4));
                if (playerInfos.mapDiff >= 8) {
                    classes.push('B');
                    classes.push('C');
                } else {
                    classes.push('C');
                }
            }
            console.log('spawnNum='+spawnNum);
            console.log(classes);
            let eggCat = checkEggCat(bat);
            if (eggCat === '') {
                eggCat = newEggCat();
            }
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
            let i = 1;
            while (i <= spawnNum) {
                conselUnit = {};
                conselAmmos = ['xxx','xxx','xxx'];
                checkDice = rand.rand(1,checkDiceMax);
                console.log('checkDice='+checkDice);
                raritySum = 0;
                alienUnits.forEach(function(unit) {
                    if (classes.includes(unit.class) && Object.keys(conselUnit).length <= 0 && unit.kind.includes(eggCat)) {
                        raritySum = raritySum+unit.rarity;
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
                        checkSpawnType(conselUnit);
                        putEggCat(bat,conselUnit.kind);
                        putBat(dropTile,0,0);
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

function newEggCat() {
    let eggCat = 'bug';
    let dice = rand.rand(1,16);
    if (dice <= 2) {
        eggCat = 'larve';
    } else if (dice <= 6) {
        eggCat = 'swarm';
    } else if (dice <= 10) {
        eggCat = 'spider';
    }
    return eggCat;
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
    if (eggTurn > eggLife && fromEgg) {
        // TRANFORMATION EN RUCHE !
        if (bat.type.includes('Oeuf')) {
            if (bat.type === 'Oeuf voilé') {
                unveilAliens(bat);
            }
            alienMorph(bat,'Ruche',false);
        } else {
            alienMorph(bat,'Volcan',false);
        }
    } else {
        let spawnChance = Math.round(eggTurn*15*bat.squadsLeft/6*Math.sqrt(playerInfos.mapDiff)*Math.sqrt(Math.sqrt(playerInfos.mapTurn)));
        if (!fromEgg) {
            spawnChance = 100-(eggTurn*5);
            if (spawnChance < 25) {
                spawnChance = 25;
            }
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
            let minTurnB = 33-Math.round(playerInfos.mapDiff*3);
            let minTurnA = 66-Math.round(playerInfos.mapDiff*5);
            classes.push('C');
            if (eggModTurn >= 7 && playerInfos.mapTurn >= minTurnB && playerInfos.mapDiff >= 2) {
                classes.push('B');
                if (eggModTurn >= 13 && playerInfos.mapTurn >= minTurnA && playerInfos.mapDiff >= 6) {
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
                conselAmmos = ['xxx','xxx','xxx'];
                checkDice = rand.rand(1,checkDiceMax);
                console.log('checkDice='+checkDice);
                raritySum = 0;
                alienUnits.forEach(function(unit) {
                    if (classes.includes(unit.class) && Object.keys(conselUnit).length <= 0 && unit.kind.includes(eggCat)) {
                        raritySum = raritySum+unit.rarity;
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
                        checkSpawnType(conselUnit);
                        putEggCat(bat,conselUnit.kind);
                        if (bat.type === 'Oeuf voilé') {
                            putBat(dropTile,0,0,'invisible');
                        } else {
                            putBat(dropTile,0,0);
                        }
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
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
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
    if (possibleDrops.length < 1) {
        let distance;
        shufZone.forEach(function(tile) {
            distance = calcDistance(layBat.tileId,tile.id);
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

function unveilAliens(myBat) {
    let myKind = getEggKind(myBat);
    let thisKind;
    let veiledKinds = [];
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.id != myBat.id) {
                if (bat.type == 'Oeuf voilé') {
                    thisKind = getEggKind(bat);
                    if (!veiledKinds.includes(thisKind)) {
                        veiledKinds.push(thisKind);
                    }
                }
            }
        }
    });
    if (!veiledKinds.includes(myKind)) {
        aliens.forEach(function(bat) {
            if (bat.loc === "zone") {
                batType = getBatType(bat);
                if (bat.tags.includes('invisible') && batType.kind == myKind && !batType.skills.includes('hide')) {
                    tagDelete(bat,'invisible');
                }
            }
        });
    }
    centerMap();
};

function getEggKind(bat) {
    let eggKind = '';
    if (bat.tags.includes('bug')) {
        eggKind = 'bug';
    } else if (bat.tags.includes('larve')) {
        eggKind = 'larve';
    } else if (bat.tags.includes('spider')) {
        eggKind = 'spider';
    } else if (bat.tags.includes('swarm')) {
        eggKind = 'swarm';
    }
    return eggKind;
};
