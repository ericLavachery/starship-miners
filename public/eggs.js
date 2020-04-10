function checkEggsDrop() {
    console.log('check egg drop');
    eggDropCount = 0;
    let drop = false;
    let dropTurn = Math.floor(((playerInfos.mapDrop*cumDrop)+playerInfos.mapTurn)/(cumDrop+1));
    let dropChance = Math.round(dropTurn*Math.sqrt(playerInfos.mapDiff));
    if (playerInfos.mapTurn == 0) {
        dropChance = 100; // !!!!!!!!!!!!!!!! Seulement pour les TESTS :)
    }
    console.log('dropChance='+dropChance);
    if (rand.rand(1,100) <= dropChance) {
        drop = true;
        eggsDrop();
    }
    if (drop) {
        playerInfos.mapDrop = 0;
    } else {
        playerInfos.mapDrop = playerInfos.mapDrop+1;
    }
};

function eggsDrop() {
    console.log('EGGDROP');
    let numEggs;
    let eggDice = rand.rand(1,100);
    let threeEggsChance = Math.round((playerInfos.mapDiff/1.5)-2);
    if (threeEggsChance < 0) {
        threeEggsChance = 0;
    }
    let twoEggsChance = playerInfos.mapDiff;
    if (eggDice <= noEggs) {
        numEggs = 0;
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
            dropEgg();
            if (i > 3) {break;}
            i++
        }
    }
};

function dropEgg() {
    console.log('dropping egg...');
    let unitIndex = alienUnits.findIndex((obj => obj.name === 'Oeuf'));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx'];
    alienOccupiedTileList();
    playerOccupiedTileList();
    let tileOK = false;
    let maxTileId = (mapSize*mapSize)+1;
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
        eggDropCount = eggDropCount+1;
        if (eggDropCount === 1) {
            eggSound();
        }
    }
};

function spawns() {
    console.log('check eggs');
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.type === 'Oeuf') {
                eggSpawn(bat);
            } else if (true) {
                // autres pondeurs
            }
        }
    });
};

function eggSpawn(bat) {
    console.log('SPAWN');
    let eggTurn = playerInfos.mapTurn-bat.creaTurn;
    console.log('eggTurn='+eggTurn);
    if (eggTurn >= 15+playerInfos.mapDiff) {
        let batIndex = aliens.findIndex((obj => obj.id == bat.id));
        aliens.splice(batIndex,1);
        let resHere = showRes(bat.tileId);
        $('#b'+bat.tileId).empty().append(resHere);
        deadAliensList.push(bat.id);
    } else {
        let spawnChance = Math.round(eggTurn*20*bat.squadsLeft/6*Math.sqrt(playerInfos.mapDiff)/2);
        console.log('spawnChance='+spawnChance);
        if (rand.rand(1,100) <= spawnChance) {
            let maxSpawn = eggTurn-11+bat.squadsLeft;
            if (maxSpawn < 1) {
                maxSpawn = 1;
            }
            console.log('maxSpawn='+maxSpawn);
            let spawnNum = 1;
            if (maxSpawn >= 2) {
                spawnNum = rand.rand(Math.ceil(maxSpawn/2),maxSpawn);
            }
            console.log('spawnNum='+spawnNum);
            let classes = [];
            let minTurnB = 33-(playerInfos.mapDiff*3);
            let minTurnA = 66-(playerInfos.mapDiff*6);
            classes.push('C');
            if (eggTurn >= 7 && playerInfos.mapTurn >= minTurnB) {
                classes.push('B');
                if (eggTurn >= 13 && playerInfos.mapTurn >= minTurnA) {
                    classes.push('A');
                }
            }
            console.log(classes);
            let checkDiceMax = 0;
            let checkDice;
            let raritySum = 0;
            let dropTile = -1;
            let i = 1;
            while (i <= spawnNum) {
                conselUnit = {};
                conselAmmos = ['xxx','xxx'];
                checkDiceMax = 0;
                alienUnits.forEach(function(unit) {
                    if (classes.includes(unit.class)) {
                        checkDiceMax = checkDiceMax+unit.rarity;
                    }
                });
                console.log('checkDiceMax='+checkDiceMax);
                checkDice = rand.rand(1,checkDiceMax);
                console.log('checkDice='+checkDice);
                raritySum = 0;
                alienUnits.forEach(function(unit) {
                    if (classes.includes(unit.class) && Object.keys(conselUnit).length <= 0) {
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

function eggSound() {
    var sound = new Howl({
        src: ['/static/sounds/smartsound_CINEMATIC_IMPACT_Eruption_01b.mp3']
    });
    sound.play();
};
