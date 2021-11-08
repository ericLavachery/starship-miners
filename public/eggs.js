function checkStartingAliens() {
    // Ruches
    let numRuches;
    if (zone[0].mapDiff >= 8) {
        dropEgg('Colonie','nedge');
        let coloBat = getAlienByName('Colonie');
        alienSpawn(coloBat,'Vomissure');
        alienSpawn(coloBat,'Vomissure');
        if (zone[0].mapDiff >= 9) {
            alienSpawn(coloBat,'Vomissure');
            alienSpawn(coloBat,'Vomissure');
            alienSpawn(coloBat,'Ruche');
            dropEgg('Volcan','guard');
            if (rand.rand(1,2) === 1) {
                dropEgg('Volcan','guard');
            }
        }
        if (zone[0].mapDiff >= 10) {
            alienSpawn(coloBat,'Ruche');
            alienSpawn(coloBat,'Ruche');
            alienSpawn(coloBat,'Ruche');
            dropEgg('Volcan','guard');
            dropEgg('Volcan','guard');
        }
        numRuches = rand.rand(1,2);
        if (zone[0].mapDiff === 9) {
            numRuches = rand.rand(3,5);
        }
        if (zone[0].mapDiff >= 10) {
            numRuches = rand.rand(6,12);
        }
        let i = 1;
        while (i <= numRuches) {
            if (rand.rand(1,4) === 1) {
                dropEgg('Ruche','any');
            } else {
                dropEgg('Ruche','nocenter');
            }
            if (i > 20) {break;}
            i++
        }
    }
    // Flaques
    let numVomi = Math.floor((zone[0].mapDiff+2)*rand.rand(8,20)/14);
    let ii = 1;
    while (ii <= numVomi) {
        if (rand.rand(1,4) === 1) {
            dropEgg('Flaque','any');
        } else {
            dropEgg('Flaque','nocenter');
        }
        if (ii > 50) {break;}
        ii++
    }
    // Veilleurs
    let numSent = Math.ceil((zone[0].mapDiff+zone[0].mapDiff)*rand.rand(8,20)/12);
    ii = 1;
    while (ii <= numSent) {
        dropEgg('Veilleurs','none');
        if (ii > 50) {break;}
        ii++
    }
    // Encounters
    if (!zone[0].visit) {
        if (zone[0].planet === 'Dom' || zone[0].planet === 'Sarak') {
            if (zone[0].mapDiff >= 2) {
                let encounterChance = 6;
                if (zone[0].planet === 'Sarak') {
                    encounterChance = encounterChance-1;
                }
                if (zone[0].mapDiff >= 5) {
                    encounterChance = encounterChance-2;
                }
                if (rand.rand(1,encounterChance) <= 2) {
                    encounter();
                }
            }
        }
    }
};

function getColonyTiles() {
    colonyTiles = [];
    let coloBat = getAlienByName('Colonie');
    if (Object.keys(coloBat).length >= 1) {
        colonyTiles.push(coloBat.tileId+1);
        colonyTiles.push(coloBat.tileId-1);
        colonyTiles.push(coloBat.tileId+1-mapSize);
        colonyTiles.push(coloBat.tileId-1-mapSize);
        colonyTiles.push(coloBat.tileId-mapSize);
        colonyTiles.push(coloBat.tileId+1+mapSize);
        colonyTiles.push(coloBat.tileId-1+mapSize);
        colonyTiles.push(coloBat.tileId+mapSize);
    }
}

function calcEggPause(noMax) {
    let eggPauseDice = eggPauseBase;
    let eggPauseMinimum = eggPauseMin-Math.floor(zone[0].mapDiff/2);
    let eggPauseMaximum = eggPauseMax-Math.floor(zone[0].mapDiff);
    eggPauseDice = eggPauseDice+Math.round(Math.sqrt(aliens.length));
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.type.includes('Oeuf')) {
                eggPauseDice = eggPauseDice+2;
            } else if (bat.type == 'Ruche') {
                eggPauseDice = eggPauseDice+0.5;
            } else if (bat.type == 'Coque') {
                eggPauseDice = eggPauseDice+1;
            }
        }
    });
    eggPauseDice = Math.floor(eggPauseDice);
    if (eggPauseDice < eggPauseMinimum) {
        eggPauseDice = eggPauseMinimum;
    }
    if (zone[0].mapDiff >= 10) {
        eggPauseDice = eggPauseMinimum;
    }
    if (!noMax) {
        if (eggPauseDice > eggPauseMaximum) {
            eggPauseDice = eggPauseMaximum;
        }
    } else {
        if (eggPauseDice > 50) {
            eggPauseDice = 50;
        }
    }
    console.log('EGG PAUSE DICE = '+eggPauseDice);
    return eggPauseDice;
};

function checkMaxDroppedEggs() {
    let overLimit = playerInfos.mapTurn-45;
    if (overLimit < 0) {
        overLimit = 0;
    }
    let maxEggDropTurn = playerInfos.mapTurn-5;
    if (maxEggDropTurn < Math.ceil(zone[0].mapDiff/2)) {
        maxEggDropTurn = Math.ceil(zone[0].mapDiff/2);
    }
    let maxDroppedEggs = Math.ceil((maxEggDropTurn+overLimit)*(zone[0].mapDiff+1.5)/7);
    maxDroppedEggs = maxDroppedEggs+Math.round(playerInfos.fuzzTotal/50)-8;
    if (maxDroppedEggs < 0) {
        maxDroppedEggs = 0;
    }
    return maxDroppedEggs;
};

function checkMaxEggsInPlay() {
    let maxEggsInPlay = Math.floor(zone[0].mapDiff*1.5)+1;
    if (playerInfos.mapTurn >= 35) {
        maxEggsInPlay++;
    }
    maxEggsInPlay = maxEggsInPlay+Math.floor(playerInfos.fuzzTotal/200)-2;
    if (maxEggsInPlay < 1) {
        maxEggsInPlay = 1;
    }
    return maxEggsInPlay;
};

function checkEggsDrop() {
    console.log('check egg drop');
    eggDropCount = 0;
    let drop = false;
    let satDrop = false;
    let eggPauseDice = calcEggPause(false);
    let adjMapDrop = playerInfos.mapDrop;
    let adjMapTurn = playerInfos.mapTurn+landingNoise-13+zone[0].mapDiff;
    if (adjMapTurn <= 0) {
        adjMapTurn = 0;
        adjMapDrop = 0;
    }
    console.log('EGGS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('mapTurn='+playerInfos.mapTurn);
    console.log('mapDrop'+playerInfos.mapDrop);
    console.log('adjMapDrop'+adjMapDrop);
    let dropTurn = Math.floor(((adjMapDrop*cumDrop)+adjMapTurn)/(cumDrop+1));
    console.log('mapAdjDiff'+playerInfos.mapAdjDiff);
    console.log('dropTurn'+dropTurn);
    let dropChance = Math.round(dropTurn*Math.sqrt(playerInfos.mapAdjDiff)*dropMod);
    let maxEggsInPlay = checkMaxEggsInPlay();
    console.log('maxEggsInPlay = '+maxEggsInPlay);
    let maxDroppedEggs = checkMaxDroppedEggs();
    console.log('maxDroppedEggs = '+maxDroppedEggs);
    let dropMessage = 'Nombre d\'oeufs tombés: '+playerInfos.droppedEggs+'/'+maxDroppedEggs;
    if (dropChance < 0) {
        dropChance = 0;
    }
    if (aliens.length >= maxAliens-25) {
        dropChance = 0;
        dropMessage = 'Nombre max d\'aliens en jeu atteint: '+maxAliens;
    }
    if (playerInfos.eggPause) {
        dropChance = 0;
        dropMessage = 'Pause';
    }
    if (eggsNum >= maxEggsInPlay) {
        dropChance = 0;
        dropMessage = 'Nombre max d\'oeufs en jeu atteint: '+maxEggsInPlay;
    }
    if (playerInfos.droppedEggs >= maxDroppedEggs) {
        dropChance = 0;
        dropMessage = 'Nombre d\'oeufs tombés atteint: '+playerInfos.droppedEggs+'/'+maxDroppedEggs;
    }
    if (playerInfos.bldList.includes('Champ de force')) {
        dropChance = 0;
        dropMessage = 'Champ de force';
    }
    console.log('dropChance='+dropChance);
    if (playerInfos.pseudo === 'Xxxxx') {
        warning('Oeufs','Check '+dropChance+'% '+dropMessage);
    }
    if (zone[0].mapDiff >= 1 || playerInfos.mapTurn >= 25) {
        let dropCheckDice = rand.rand(1,100);
        console.log('dropCheckDice='+dropCheckDice);
        if (dropCheckDice <= dropChance) {
            drop = true;
            eggsDrop();
        } else if (playerInfos.alienSat >= coconSatLimit) {
            dropEgg('Cocon','any');
            satDrop = true;
            playerInfos.alienSat = 0;
            if (playerInfos.pseudo === 'Xxxxx') {
                warning('Cocon de saturation','200+ aliens.');
            }
        }
    }
    if (drop || playerInfos.eggPause) {
        playerInfos.mapDrop = 0;
        if (playerInfos.eggPause) {
            if (rand.rand(1,eggPauseDice) === 1) {
                playerInfos.eggPause = false;
                console.log('END PAUSE! 1/'+eggPauseDice);
                if (playerInfos.pseudo === 'Xxxxx') {
                    warning('Fin de la pause','Check 1/'+eggPauseDice+' réussi.');
                }
            } else {
                if (playerInfos.pseudo === 'Xxxxx') {
                    warning('La pause continue','Check 1/'+eggPauseDice+' raté.');
                }
            }
        }
    } else {
        playerInfos.mapDrop = playerInfos.mapDrop+1;
    }
    if (eggDropCount >= 1 || satDrop) {
        eggSound();
        playMusic('horns',true);
        if (Math.floor(playerInfos.mapTurn/25) > playerInfos.cocons && !satDrop && rand.rand(1,100) <= playerInfos.mapTurn*2) {
            dropEgg('Cocon','target');
            if (playerInfos.comp.det >= 1) {
                warning('Cocon','Un Cocon est tombé!');
            }
            playerInfos.droppedEggs = playerInfos.droppedEggs+1;
            let doubleCocon = playerInfos.mapTurn+((zone[0].mapDiff-1)*7);
            if (doubleCocon >= 50) {
                dropEgg('Oeuf','any');
                playerInfos.droppedEggs = playerInfos.droppedEggs+1;
            }
            if (doubleCocon >= 100) {
                dropEgg('Cocon','nedge');
                playerInfos.droppedEggs = playerInfos.droppedEggs+1;
                if (playerInfos.comp.det >= 1) {
                    warning('Cocon','Un Cocon est tombé!');
                }
            }
            if (doubleCocon >= 200) {
                dropEgg('Cocon','nedge');
                playerInfos.droppedEggs = playerInfos.droppedEggs+1;
                if (playerInfos.comp.det >= 1) {
                    warning('Cocon','Un Cocon est tombé!');
                }
            }
            playerInfos.cocons = playerInfos.cocons+1;
        }
    } else {
        // playMusic('noEgg',false);
    }
    if (playerInfos.mapTurn % 25 === 0 && playerInfos.mapTurn > 1) {
        let rucheBord = Math.round((playerInfos.fuzzTotal-150)*(playerInfos.fuzzTotal-150)/300);
        if (rucheBord >= 100) {
            dropEgg('Vomissure','edge');
            rucheBord = rucheBord-100;
            if (playerInfos.comp.det >= 1) {
                warning('Ruche en vue','Une Ruche se constitue au loin!');
            }
        }
        if (rucheBord >= 100) {
            dropEgg('Vomissure','edge');
            rucheBord = rucheBord-100;
            if (playerInfos.comp.det >= 1) {
                warning('Ruche en vue','Une Ruche se constitue au loin!');
            }
        }
        if (rucheBord >= 100 && playerInfos.mapTurn >= 50) {
            dropEgg('Vomissure','edge');
            rucheBord = rucheBord-100;
            if (playerInfos.comp.det >= 1) {
                warning('Ruche en vue','Une Ruche se constitue au loin!');
            }
        }
        if (rucheBord >= 100 && playerInfos.mapTurn >= 50) {
            dropEgg('Vomissure','edge');
            rucheBord = rucheBord-100;
            if (playerInfos.comp.det >= 1) {
                warning('Ruche en vue','Une Ruche se constitue au loin!');
            }
        }
        if (rucheBord >= 100 && playerInfos.mapTurn >= 75) {
            dropEgg('Vomissure','edge');
            rucheBord = rucheBord-100;
            if (playerInfos.comp.det >= 1) {
                warning('Ruche en vue','Une Ruche se constitue au loin!');
            }
        }
        if (rucheBord >= 100 && playerInfos.mapTurn >= 75) {
            dropEgg('Vomissure','edge');
            rucheBord = rucheBord-100;
            if (playerInfos.comp.det >= 1) {
                warning('Ruche en vue','Une Ruche se constitue au loin!');
            }
        }
        if (rand.rand(1,100) <= rucheBord) {
            dropEgg('Vomissure','edge');
            if (playerInfos.comp.det >= 1) {
                warning('Ruche en vue','Une Ruche se constitue au loin!');
            }
        }
    }
};

function eggsDrop() {
    console.log('EGGDROP');
    let maxDroppedEggs = checkMaxDroppedEggs();
    let numEggs;
    let eggDice = rand.rand(1,100);
    let eggPausePerc = calcEggPause(true);
    eggPausePerc = Math.round(eggPausePerc*1.5);
    let noEggDrop = Math.round(noEggs/playerInfos.fuzzTotal*300);
    if (playerInfos.mapTurn < 30) {
        noEggDrop = 0;
    }
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
    let twoEggsMinTurn = 43-(zone[0].mapDiff*3);
    if (playerInfos.mapTurn < twoEggsMinTurn) {
        twoEggsChance = 0;
    }
    let threeEggsMinTurn = 70-(zone[0].mapDiff*5);
    if (playerInfos.mapTurn < threeEggsMinTurn) {
        threeEggsChance = 0;
    }
    if (eggDice <= noEggDrop) {
        numEggs = 0;
        if (rand.rand(1,100) <= eggPausePerc) {
            playerInfos.eggPause = true;
            console.log('PAUSE! '+eggPausePerc+'%');
            if (playerInfos.pseudo === 'Xxxxx') {
                warning('Nouvelle pause','Check '+eggPausePerc+'% réussi après la chute de 0 oeuf ('+noEggDrop+'%)');
            }
        }
    } else if (eggDice <= noEggDrop+twoEggsChance) {
        numEggs = 2;
    } else if (eggDice <= noEggDrop+twoEggsChance+threeEggsChance) {
        numEggs = 3;
    } else {
        numEggs = 1;
    }
    if (numEggs >= 1) {
        let eggBonusChance = Math.round(playerInfos.mapTurn*2.5)-50+(playerInfos.mapAdjDiff*5)+((maxDroppedEggs-playerInfos.droppedEggs)*10);
        console.log('eggBonusChance='+eggBonusChance);
        if (eggBonusChance >= 100) {
            numEggs++;
            eggBonusChance = eggBonusChance-100;
        }
        if (eggBonusChance >= 100) {
            numEggs++;
            eggBonusChance = eggBonusChance-100;
        }
        if (eggBonusChance >= 100) {
            numEggs++;
            eggBonusChance = eggBonusChance-100;
        }
        if (eggBonusChance >= 100) {
            numEggs++;
            eggBonusChance = eggBonusChance-100;
        }
        if (eggBonusChance >= 100) {
            numEggs++;
            eggBonusChance = eggBonusChance-100;
        }
        if (rand.rand(1,100) <= eggBonusChance) {
            numEggs++;
        }
    }
    if (aliens.length >= 200 && numEggs >= 1) {
        numEggs = 1;
    }
    console.log('eggDice='+eggDice);
    let coqPerc = getCoqueChance();
    let coqNum = 0;
    let coveredEggs = 0;
    if (numEggs >= 1) {
        let eggTypeDice;
        let i = 1;
        while (i <= numEggs) {
            eggTypeDice = rand.rand(1,100);
            invisibleChance = Math.floor(zone[0].mapDiff*1.5)-8;
            if (invisibleChance < 0 || !zoneInfos.ieggs) {
                invisibleChance = 0;
            } else {
                if (i > 1) {
                    invisibleChance = invisibleChance*2;
                }
            }
            if (eggTypeDice <= coqPerc) {
                if (coqNum < 2) {
                    dropEgg('Coque','nocenter');
                    coqNum++;
                } else {
                    dropEgg('Oeuf','encounter');
                }
                playerInfos.droppedEggs = playerInfos.droppedEggs+1;
            } else if (eggTypeDice <= coqPerc+invisibleChance) {
                dropEgg('Oeuf voilé','any');
                playerInfos.droppedEggs = playerInfos.droppedEggs+1;
                if (playerInfos.comp.det >= 3) {
                    warning('Oeuf voilé','Un Oeuf voilé est tombé!');
                }
            } else {
                if (rand.rand(1,zone[0].mapDiff+2) >= 4 && coqPerc >= 30 && playerInfos.mapTurn >= 30 && coveredEggs <= Math.ceil(zone[0].mapDiff/3)) {
                    if (hasAlien('Ruche') || hasAlien('Volcan')) {
                        dropEgg('Oeuf','acouvert');
                        coveredEggs++;
                    } else {
                        dropEgg('Oeuf','nedge');
                    }
                } else {
                    dropEgg('Oeuf','any');
                }
                playerInfos.droppedEggs = playerInfos.droppedEggs+1;
            }
            if (i > 4) {break;}
            i++
        }
    }
};

function getCoqueChance() {
    let coqPerc = coqueChance;
    if (playerInfos.mapTurn > aliens.length) {
        coqPerc = coqPerc+13;
    }
    return coqPerc;
}

function dropEgg(alienUnit,theArea) {
    console.log('dropping egg...');
    let unitIndex = alienUnits.findIndex((obj => obj.name === alienUnit));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    alienOccupiedTileList();
    playerOccupiedTileList();
    let dropTile = eggDropTile(alienUnit,theArea);
    if (dropTile >= 0) {
        if (alienUnit === 'Oeuf voilé') {
            putBat(dropTile,0,0,'invisible');
        } else if (alienUnit === 'Vomissure') {
            putBat(dropTile,0,0,'bmorph');
        } else {
            putBat(dropTile,0,0);
        }
        if (alienUnit.includes('Oeuf') || alienUnit === 'Coque' || alienUnit === 'Cocon') {
            eggDropCount = eggDropCount+1;
            // if (alienUnit === 'Oeuf' || alienUnit === 'Coque' || alienUnit === 'Cocon') {
            //     eggsNum++;
            // }
            // if (alienUnit === 'Oeuf voilé' && playerInfos.comp.det >= 3) {
            //     eggsNum++;
            // }
        }
        if (playerInfos.eggsKilled >=1 && (playerInfos.eggsKilled-playerInfos.pauseSeed) >= 1 && (playerInfos.eggsKilled-playerInfos.pauseSeed) % pauseCount === 0) {
            playerInfos.eggPause = true;
            console.log('PAUSE! '+playerInfos.eggsKilled+' eggs killed');
            if (playerInfos.pseudo === 'Xxxxx') {
                warning('Nouvelle pause',playerInfos.eggsKilled+' oeufs tués.');
            }
        }
    }
};

function hasAlien(unitName) {
    let youHaveIt = false;
    aliens.forEach(function(bat) {
        if (bat.type === unitName) {
            youHaveIt = true;
        }
    });
    return youHaveIt;
}

function eggDropTile(eggName,theArea) {
    let theTile = -1;
    let area = 'any';
    let targetTile = -1;
    if (theArea != 'none') {
        area = theArea;
    } else {
        if (eggName.includes('Ruche') || eggName.includes('Vomissure') || eggName.includes('Flaque')) {
            area = 'nocenter';
        } else if (eggName.includes('Cocon')) {
            area = 'target';
        } else if (eggName.includes('Colonie')) {
            area = 'nedge';
        } else if (eggName.includes('Veilleurs')) {
            if (rand.rand(1,6) === 1) {
                area = 'nocenter';
            } else {
                area = 'around';
            }
        }
    }
    if (area === 'encounter' && encounterTileId < 0) {
        area = 'nedge';
    }
    // ANY
    if (area === 'any') {
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                if (tile.x >= 2 && tile.x <= 59 && tile.y >= 2 && tile.y <= 59) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
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
    // NEAR EDGE
    if (area === 'nedge') {
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                if ((tile.x === 55 && tile.y >= 6 && tile.y <= 55) || (tile.x === 6 && tile.y >= 6 && tile.y <= 55) || (tile.y === 6 && tile.x >= 6 && tile.x <= 55) || (tile.y === 55 && tile.x >= 6 && tile.x <= 55)) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        if (tile.terrain != 'F' && tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') {
                            theTile = tile.id;
                        }
                    }
                }
            }
        });
        if (theTile < 0) {
            shufZone.forEach(function(tile) {
                if (theTile < 0) {
                    if ((tile.x === 55 && tile.y >= 6 && tile.y <= 55) || (tile.x === 6 && tile.y >= 6 && tile.y <= 55) || (tile.y === 6 && tile.x >= 6 && tile.x <= 55) || (tile.y === 55 && tile.x >= 6 && tile.x <= 55)) {
                        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                            theTile = tile.id;
                        }
                    }
                }
            });
        }
    }
    // NOCENTER
    if (area === 'nocenter') {
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                if (tile.x < 15 || tile.x > 45 || tile.y < 15 || tile.y > 45) {
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
                if (distance > 8 && distance < 13) {
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
    // ENCOUNTER
    if (area === 'encounter') {
        targetTile = encounterTileId;
        let shufZone = _.shuffle(zone);
        let distance;
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                distance = calcDistance(tile.id,targetTile);
                if (distance >= 5 && distance <= 8) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
    }
    // GUARD
    if (area === 'guard') {
        let shufAliens = _.shuffle(aliens);
        shufAliens.forEach(function(bat) {
            if (bat.loc === "zone") {
                if (bat.type === 'Colonie') {
                    targetTile = bat.tileId;
                }
            }
        });
        let shufZone = _.shuffle(zone);
        let distance;
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                distance = calcDistance(tile.id,targetTile);
                if (distance === 3 || distance === 4) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
    }
    // A COUVERT
    if (area === 'acouvert') {
        let bestCover = 0;
        let shufAliens = _.shuffle(aliens);
        shufAliens.forEach(function(bat) {
            if (bat.loc === "zone") {
                if (bat.type === 'Volcan' || bat.type === 'Ruche') {
                    if (bat.squadsLeft > bestCover) {
                        targetTile = bat.tileId;
                        bestCover = bat.squadsLeft;
                    }
                }
            }
        });
        let shufZone = _.shuffle(zone);
        let distance;
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                distance = calcDistance(tile.id,targetTile);
                if (distance === 2 || distance === 3) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
        if (theTile < 0) {
            shufZone.forEach(function(tile) {
                if (theTile < 0) {
                    distance = calcDistance(tile.id,targetTile);
                    if (distance === 4 || distance === 5) {
                        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                            theTile = tile.id;
                        }
                    }
                }
            });
        }
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
    if (rand.rand(1,15) === 1 && zone[0].mapDiff >= 6) {
        transList.push('Ombres');
    }
    console.log(transList);
    return transList;
};

function aliensCount() {
    let aliensNums = {lucioles:0,moucherons:0,bugs:0,firebugs:0,scorpions:0,fourmis:0,cafards:0,gluantes:0,larves:0,homards:0,veilleurs:0};
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.type === 'Lucioles') {
                aliensNums.lucioles = aliensNums.lucioles+1;
            } else if (bat.type === 'Bugs') {
                aliensNums.bugs = aliensNums.bugs+1;
            } else if (bat.type === 'Firebugs') {
                aliensNums.firebugs = aliensNums.firebugs+1;
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
            } else if (bat.type === 'Homards') {
                aliensNums.homards = aliensNums.homards+1;
            } else if (bat.type === 'Veilleurs') {
                aliensNums.veilleurs = aliensNums.veilleurs+1;
            }
        }
    });
    return aliensNums;
};

function spawns() {
    console.log('check pontes');
    let batType;
    let vomiCheck;
    let eggTurn;
    let eggModTurn;
    let transList = morphList();
    let aliensNums = aliensCount();
    let vomiToRuche = 22-Math.round(zone[0].mapDiff*1.5);
    if (vomiToRuche < 5) {
        vomiToRuche = 5;
    }
    let maxPonte = zone[0].mapDiff+zone[0].mapDiff+2;
    let fantMorph = Math.round((11.5-zone[0].mapDiff)/Math.sqrt(zone[0].mapDiff)*10);
    if (fantMorph < 7) {fantMorph = 7;}
    let wurmMorph = Math.round((13-zone[0].mapDiff)/Math.sqrt(zone[0].mapDiff)*5);
    if (wurmMorph < 7) {wurmMorph = 7;}
    let libMorph = fantMorph;
    let libGenMorph = 0;
    let libGenMax = 14-zone[0].mapDiff;
    if (libGenMax < 4) {libGenMax = 4;}
    let minVolcDiff = (zone[0].mapDiff*20)+zone[0].mapTurn;
    let flyDice;
    let warnAsticots = false;
    let warnVers = false;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            flyDice = rand.rand(1,3);
            if ((bat.type.includes('Oeuf') || bat.type === 'Coque') && aliens.length < maxAliens) {
                batType = getBatType(bat);
                eggTurn = playerInfos.mapTurn-bat.creaTurn+1;
                eggModTurn = eggTurn+(zone[0].mapDiff*2)-12;
                vomiCheck = ((batType.squads-bat.squadsLeft)*vomiChance)+(eggModTurn*1);
                if (rand.rand(1,100) <= vomiCheck && bat.type === 'Oeuf') {
                    vomiSpawn(bat);
                }
                eggSpawn(bat,true);
            } else if (bat.type === 'Ruche' && aliens.length < maxAliens) {
                eggSpawn(bat,false);
            } else if (bat.type === 'Volcan' && aliens.length < maxAliens && minVolcDiff >= 100) {
                let volcSpawn = (bat.squadsLeft*3)-zone[0].mapDiff;
                if (volcSpawn < 1) {volcSpawn = 1;}
                if (rand.rand(1,volcSpawn) === 1) {
                    alienSpawn(bat,'Torches');
                    alienSpawn(bat,'Torches');
                }
            } else if (bat.type === 'Colonie' && rand.rand(1,3) === 1) {
                alienSpawn(bat,'Vomissure');
            } else if (transList.includes('Asticots') && bat.type === 'Asticots' && !bat.tags.includes('morph')) {
                bat.tags.push('morph');
                if (playerInfos.comp.det >= 2 && playerInfos.comp.ca >= 2 && !warnAsticots) {
                    warnAsticots = true;
                    warning('Tranformation imminante','Les Asticots vont devenir des Moucherons!');
                }
            } else if (bat.squadsLeft >= 5 && bat.type === 'Asticots' && bat.tags.includes('morph')) {
                alienMorph(bat,'Moucherons',false);
                if (libMorph <= 20) {
                    libGenMorph++;
                }
            } else if (transList.includes('Vers') && bat.type === 'Vers' && !bat.tags.includes('morph')) {
                bat.tags.push('morph');
                if (playerInfos.comp.det >= 2 && playerInfos.comp.ca >= 2 && !warnVers) {
                    warnVers = true;
                    warning('Tranformation imminante','Les Vers vont devenir des Lucioles!');
                }
            } else if (bat.squadsLeft >= 5 && bat.type === 'Vers' && bat.tags.includes('morph')) {
                alienMorph(bat,'Lucioles',false);
                if (libMorph <= 20) {
                    libGenMorph++;
                }
            } else if (rand.rand(1,wurmMorph) === 1 && bat.squadsLeft >= 3 && bat.type === 'Larves') {
                alienMorph(bat,'Wurms',false);
            } else if (libMorph <= 30 && (rand.rand(1,libMorph) === 1 || libGenMorph >= libGenMax) && bat.squadsLeft >= 3 && bat.type === 'Lombrics') {
                alienMorph(bat,'Libellules',false);
            } else if (fantMorph <= 25 && rand.rand(1,fantMorph) === 1 && bat.squadsLeft >= 3 && bat.type === 'Ombres') {
                alienMorph(bat,'Fantômes',false);
            } else if (rand.rand(1,vomiToRuche) === 1 && playerInfos.mapTurn >= Math.ceil(vomiToRuche/1.5) && bat.type === 'Vomissure' && !bat.tags.includes('morph')) {
                bat.tags.push('morph');
                if (playerInfos.comp.det >= 1 && playerInfos.comp.ca >= 1) {
                    warning('Tranformation imminante','Une Vomissure va devenir une Ruche!',false,bat.tileId);
                }
            } else if (bat.type === 'Vomissure' && bat.tags.includes('morph')) {
                alienMorph(bat,'Ruche',true);
            } else if (bat.type === 'Vomissure' && bat.tags.includes('bmorph')) {
                bat.tags.push('morph');
            } else if (bat.type === 'Dragons' && aliens.length < maxAliens && aliensNums.firebugs < Math.round(maxPonte/1.5)) {
                alienSpawn(bat,'Firebugs');
            } else if (bat.type === 'Mantes' && aliens.length < maxAliens && aliensNums.fourmis < Math.round(maxPonte/1.5)) {
                alienSpawn(bat,'Fourmis');
            } else if (bat.type === 'Scarabs' && aliens.length < maxAliens-50 && aliensNums.bugs < maxPonte*2) {
                alienSpawn(bat,'Bugs');
            } else if (bat.type === 'Androks' && aliens.length < maxAliens-50 && aliensNums.scorpions < Math.round(maxPonte*1.5)) {
                alienSpawn(bat,'Scorpions');
            } else if (bat.type === 'Veilleurs' && aliens.length < maxAliens-50 && bat.squadsLeft >= 3) {
                let lifeTurn = playerInfos.mapTurn-bat.creaTurn;
                if (lifeTurn === 1 && landingNoise >= 2) {
                    veilSpawn(bat);
                    veilSpawn(bat);
                    veilSpawn(bat);
                }
                if (!bat.tags.includes('invisible')) {
                    if (rand.rand(1,3) === 1) {
                        veilSpawn(bat);
                    }
                }
            } else if (bat.type === 'Megagrubz' && rand.rand(1,3) === 1 && aliens.length < maxAliens) {
                alienSpawn(bat,'Vomissure','larve');
            } else if (bat.type === 'Cafards' && bat.squadsLeft >= 6 && rand.rand(1,4) === 1) {
                if (aliensNums.homards >= 1) {
                    if (rand.rand(1,2) === 1) {
                        alienMorph(bat,'Homards',false);
                    } else {
                        alienSpawn(bat,'Cafards');
                    }
                } else if (aliens.length < maxAliens-50 && aliensNums.cafards < maxPonte*3) {
                    alienSpawn(bat,'Cafards');
                }
            } else if (bat.type === 'Glaireuses' && aliens.length < maxAliens-50 && aliensNums.gluantes < maxPonte) {
                alienSpawn(bat,'Gluantes');
            } else if (bat.type === 'Cocon') {
                cocoonSpawn(bat);
            }
        }
    });
};

function veilSpawn(bat) {
    let terName = getTileTerrainName(bat.tileId);
    let kind = 'bug';
    if (terName === 'M' || terName === 'H') {
        kind = 'bug';
    } else if (terName === 'F') {
        kind = 'spider';
    } else if (terName === 'W' || terName === 'R' || terName === 'L') {
        kind = 'larve';
    } else if (terName === 'B') {
        kind = 'swarm';
    } else if (terName === 'P') {
        kind = zoneInfos.pKind;
    } else if (terName === 'G') {
        kind = zoneInfos.gKind;
    } else if (terName === 'S') {
        kind = zoneInfos.sKind;
    } else {
        kind = 'bug';
    }
    if (kind === 'bug') {
        if (rand.rand(1,15) < zone[0].mapDiff) {
            alienSpawn(bat,'Punaises','veil');
        } else {
            alienSpawn(bat,'Bugs','veil');
        }
    } else if (kind === 'swarm') {
        if (rand.rand(1,15) < zone[0].mapDiff) {
            alienSpawn(bat,'Cafards','veil');
        } else {
            alienSpawn(bat,'Scorpions','veil');
        }
    } else if (kind === 'larve') {
        if (rand.rand(1,15) < zone[0].mapDiff) {
            alienSpawn(bat,'Vers','veil');
        } else {
            alienSpawn(bat,'Asticots','veil');
        }
    } else if (kind === 'spider') {
        if (rand.rand(1,15) < zone[0].mapDiff) {
            alienSpawn(bat,'Nerveuses','veil');
        } else {
            alienSpawn(bat,'Gluantes','veil');
        }
    }
};

function vomiSpawn(bat) {
    console.log('SPAWN: Vomissure');
    let kindTag = getEggKind(bat);
    fearFactor(bat,true);
    let dropTile = -1;
    let unitIndex = alienUnits.findIndex((obj => obj.name == 'Vomissure'));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx','xxx','xxx'];
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
    let batTileId = -1;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone' && bat.tileId === layBlob) {
            batId = bat.id;
            batTileId = bat.tileId;
        }
    });
    let unitIndex = bataillons.findIndex((obj => obj.id == batId));
    if (unitIndex > -1) {
        bataillons.splice(unitIndex,1);
        warning('Bataillon englouti',bat.type+' a été détruit par la vomissure.',false,batTileId);
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

function alienSpawn(bat,crea,tag) {
    console.log('SPAWN: '+crea);
    let dropTile = -1;
    let unitIndex = alienUnits.findIndex((obj => obj.name == crea));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    console.log(conselUnit);
    if (Object.keys(conselUnit).length >= 1) {
        dropTile = checkDrop(bat.tileId);
        if (dropTile >= 0) {
            putBat(dropTile,0,0,tag);
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
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    checkSpawnType(conselUnit);
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
    let eggLevel = zone[0].mapDiff+Math.floor((playerInfos.mapTurn+25)/50)-1;
    let eggCat = checkputEggKind(bat);
    if (eggCat === '') {
        eggCat = newEggCat();
    }
    console.log('eggCat: '+eggCat);
    if (eggTurn < 3) {
        let classes = [];
        console.log('eggLevel='+eggLevel);
        let saturation = false;
        if (playerInfos.alienSat >= coconSatLimit-1 && playerInfos.mapTurn >= 76) {
            saturation = true;
        }
        let spawnNum = 4;
        if (eggTurn === 2) {
            spawnNum = 6+Math.floor(playerInfos.mapTurn/50);
            if (eggLevel >= 12) {
                classes.push('A');
                classes.push('S');
            } else if (eggLevel >= 10) {
                classes.push('A');
                if (saturation) {
                    classes.push('S');
                }
            } else if (eggLevel >= 8) {
                classes.push('A');
                if (!saturation) {
                    classes.push('B');
                }
            } else if (eggLevel >= 6) {
                classes.push('A');
                classes.push('B');
                if (!saturation) {
                    classes.push('C');
                }
            } else if (eggLevel >= 4) {
                classes.push('B');
                classes.push('C');
                if (saturation) {
                    classes.push('A');
                }
            } else {
                classes.push('C');
                if (saturation) {
                    classes.push('B');
                }
            }
        } else {
            let ana = aliens.length;
            if (ana > 100) {
                ana = 100;
            }
            let satMin = 5-Math.floor(ana/4)+zone[0].mapDiff+Math.round(playerInfos.mapTurn/4);
            console.log('satMin: '+satMin);
            spawnNum = zone[0].mapDiff+(rand.rand(1,4));
            if (spawnNum < satMin) {
                spawnNum = satMin;
            }
            console.log('spawnNum: '+spawnNum);
            if (eggLevel >= 5) {
                classes.push('B');
                classes.push('C');
            } else {
                classes.push('C');
            }
        }
        console.log('spawnNum='+spawnNum);
        console.log(classes);
        let checkDiceMax = 0;
        let checkDice;
        let raritySum = 0;
        let dropTile = -1;
        alienUnits.forEach(function(unit) {
            if (classes.includes(unit.class) && unit.kind.includes(eggCat) && unit.class != 'S') {
                if (unit.class != 'A' || unit.rarity != 2 || eggLevel >= 10) {
                    checkDiceMax = checkDiceMax+unit.rarity;
                }
            }
        });
        let i = 1;
        while (i <= spawnNum) {
            conselReset();
            if (classes.includes('S')) {
                alienUnits.forEach(function(unit) {
                    if (unit.class === 'S' && Object.keys(conselUnit).length <= 0 && unit.kind.includes(eggCat)) {
                        conselUnit = unit;
                    }
                });
            } else {
                checkDice = rand.rand(1,checkDiceMax);
                console.log('checkDice='+checkDice);
                raritySum = 0;
                alienUnits.forEach(function(unit) {
                    if (classes.includes(unit.class) && Object.keys(conselUnit).length <= 0 && unit.kind.includes(eggCat) && unit.class != 'S') {
                        if (unit.class != 'A' || unit.rarity != 2 || eggLevel >= 10) {
                            raritySum = raritySum+unit.rarity;
                            if (checkDice <= raritySum) {
                                conselUnit = unit;
                            }
                        }
                    }
                });
            }
            console.log('spawned unit ->');
            console.log(conselUnit);
            if (Object.keys(conselUnit).length >= 1) {
                dropTile = checkDrop(bat.tileId);
                if (dropTile >= 0) {
                    if (conselUnit.class === 'S') {
                        const index = classes.indexOf('S');
                        if (index > -1) {
                            classes.splice(index,1);
                        }
                    }
                    checkSpawnType(conselUnit);
                    putEggCat(bat,conselUnit.kind);
                    if (playerInfos.mapTurn < 20) {
                        putBat(dropTile,0,0,'follow');
                    } else {
                        putBat(dropTile,0,0);
                    }
                }
            }
            if (i > 36) {break;}
            i++
        }
    }
    // TRANFORMATION EN CLASSE A !
    if (eggTurn >= eggLife) {
        if (eggCat === 'bug') {
            if (eggLevel >= 6 && playerInfos.mapTurn >= 50) {
                alienMorph(bat,'Dragons',false);
            } else if (eggLevel >= 4) {
                alienMorph(bat,'Scarabs',false);
            } else {
                alienMorph(bat,'Broyeurs',false);
            }
        } else if (eggCat === 'swarm') {
            if (eggLevel >= 6 && playerInfos.mapTurn >= 50) {
                alienMorph(bat,'Mantes',false);
            } else if (eggLevel >= 4) {
                alienMorph(bat,'Galéodes',false);
            } else {
                alienMorph(bat,'Ojos',false);
            }
        } else if (eggCat === 'larve') {
            if (eggLevel >= 6 && playerInfos.mapTurn >= 50) {
                alienMorph(bat,'Megagrubz',false);
            } else if (eggLevel >= 4) {
                alienMorph(bat,'Libellules',false);
            } else {
                alienMorph(bat,'Wurms',false);
            }
        } else if (eggCat === 'spider') {
            if (eggLevel >= 6 && playerInfos.mapTurn >= 50) {
                alienMorph(bat,'Glaireuses',false);
            } else if (eggLevel >= 3) {
                alienMorph(bat,'Mygales',false);
            } else {
                alienMorph(bat,'Faucheux',false);
            }
        } else {
            alienMorph(bat,'Volcan',false);
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
    let swampMap = false;
    let eggTerrain = getTerrain(bat);
    if (eggTerrain.name === 'W' || eggTerrain.name === 'S' || eggTerrain === 'L') {
        swampMap = true;
    }
    if (zone[0].ps+zone[0].pw >= 60) {
        swampMap = true;
    }
    let overSaturation = false;
    if (playerInfos.alienSat >= coconSatLimit-1 && playerInfos.mapTurn >= 76) {
        overSaturation = true;
    }
    let eggTurn = playerInfos.mapTurn-bat.creaTurn+1;
    let eggModTurn = eggTurn+zone[0].mapDiff-3;
    let eggLife = eggLifeStart+Math.floor(zone[0].mapDiff*eggLifeFactor)+bat.squadsLeft-6;
    if (bat.type === 'Coque' || bat.type === 'Oeuf voilé') {
        eggModTurn = eggTurn+zone[0].mapDiff-3;
        eggLife = coqLifeStart+Math.floor(zone[0].mapDiff*coqLifeFactor)+bat.squadsLeft-6;
    }
    let presAlien = zone[0].mapDiff;
    if (presAlien < 1) {
        presAlien = 1;
    }
    console.log('eggTurn='+eggTurn);
    if (eggTurn >= eggLife && fromEgg) {
        // TRANFORMATION EN RUCHE OU VOLCAN !
        if (bat.tags.includes('morph')) {
            if (bat.type.includes('Oeuf')) {
                if (bat.type === 'Oeuf voilé') {
                    unveilAliens(bat);
                }
                alienMorph(bat,'Ruche',false);
            } else {
                alienMorph(bat,'Volcan',false);
            }
        } else {
            bat.tags.push('morph');
            if (bat.type === 'Oeuf') {
                if (playerInfos.comp.det >= 1 && playerInfos.comp.ca >= 1) {
                    warning('Tranformation imminante','Un Oeuf va devenir une Ruche!',false,bat.tileId);
                }
            } else if (bat.type === 'Oeuf voilé') {
                if (bat.tags.includes('invisible')) {
                    if (playerInfos.comp.det >= 3 && playerInfos.comp.ca >= 1) {
                        warning('Tranformation imminante','Un Oeuf voilé va devenir une Ruche!');
                    }
                } else {
                    if (playerInfos.comp.det >= 1 && playerInfos.comp.ca >= 1) {
                        warning('Tranformation imminante','Un Oeuf voilé va devenir une Ruche!');
                    }
                }
            } else {
                if (playerInfos.comp.det >= 1 && playerInfos.comp.ca >= 1) {
                    warning('Tranformation imminante','Une Coque va devenir un Volcan!',false,bat.tileId);
                }
            }
        }
    } else {
        let spawnChance = Math.round(eggTurn*15/bat.squadsLeft*6*Math.sqrt(presAlien)*Math.sqrt(Math.sqrt(playerInfos.mapTurn)));
        if (!fromEgg) {
            spawnChance = 100-(eggTurn*5);
            if (spawnChance < 25) {
                spawnChance = 25;
            }
        }
        console.log('spawnChance='+spawnChance);
        if (rand.rand(1,100) <= spawnChance) {
            let adjEggTurn = eggTurn;
            if (adjEggTurn > 13) {
                adjEggTurn = 13;
            }
            let maxSpawn = Math.round(((adjEggTurn*1.5)+(3-(bat.squadsLeft/2))+(zone[0].mapDiff*1.5))/5);
            if (maxSpawn < 1 || !fromEgg) {
                maxSpawn = 1;
                if (fromEgg) {
                    if (getCoqueChance() > coqueChance) {
                        maxSpawn = 2;
                    }
                }
            }
            if (maxSpawn > Math.round((playerInfos.mapAdjDiff+8)/3)) {
                maxSpawn = Math.round((playerInfos.mapAdjDiff+8)/3);
            }
            console.log('maxSpawn='+maxSpawn);
            let spawnNum = 1;
            if (maxSpawn >= 2) {
                spawnNum = rand.rand(Math.ceil(maxSpawn/2),maxSpawn);
            }
            console.log('spawnNum='+spawnNum);
            let classes = [];
            let minTurnB = 33-Math.round(zone[0].mapDiff*3);
            let minTurnA = 66-Math.round(zone[0].mapDiff*5);
            classes.push('C');
            if (eggModTurn >= 7 && playerInfos.mapTurn >= minTurnB && zone[0].mapDiff >= 3) {
                classes.push('B');
                if (eggModTurn >= 13 && playerInfos.mapTurn >= minTurnA && (zone[0].mapDiff >= 6 || overSaturation)) {
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
            let eggCat = checkputEggKind(bat);
            console.log('eggCat: '+eggCat);
            let checkDiceMax = 0;
            let checkDice;
            let raritySum = 0;
            let dropTile = -1;
            alienUnits.forEach(function(unit) {
                if (classes.includes(unit.class) && unit.kind.includes(eggCat)) {
                    if (unit.class != 'A' || unit.rarity != 2 || zone[0].mapDiff >= 7) {
                        if (zone[0].mapDiff >= 2 || unit.class != 'C' || unit.rarity >= 4 || unit.name === 'Punaises') {
                            if (swampMap && zone[0].mapDiff >= 4 && unit.kind === 'spider') {
                                if (unit.name === 'Surfeuses') {
                                    checkDiceMax = checkDiceMax+(unit.rarity*4);
                                } else if (unit.name === 'Nerveuses' || unit.name === 'Cracheuses' || unit.name === 'Torches') {
                                    // nothing
                                } else {
                                    checkDiceMax = checkDiceMax+unit.rarity;
                                }
                            } else {
                                checkDiceMax = checkDiceMax+unit.rarity;
                            }
                        }
                    }
                }
            });
            console.log('checkDiceMax='+checkDiceMax);
            let i = 1;
            while (i <= spawnNum) {
                conselReset();
                checkDice = rand.rand(1,checkDiceMax);
                console.log('checkDice='+checkDice);
                raritySum = 0;
                alienUnits.forEach(function(unit) {
                    if (classes.includes(unit.class) && unit.kind.includes(eggCat) && Object.keys(conselUnit).length <= 0) {
                        if (unit.class != 'A' || unit.rarity != 2 || zone[0].mapDiff >= 7) {
                            if (zone[0].mapDiff >= 2 || unit.class != 'C' || unit.rarity >= 4 || unit.name === 'Punaises') {
                                if (swampMap && zone[0].mapDiff >= 4 && unit.kind === 'spider') {
                                    if (unit.name === 'Surfeuses') {
                                        raritySum = raritySum+(unit.rarity*4);
                                    } else if (unit.name === 'Nerveuses' || unit.name === 'Cracheuses' || unit.name === 'Torches') {
                                        // nothing
                                    } else {
                                        raritySum = raritySum+unit.rarity;
                                    }
                                } else {
                                    raritySum = raritySum+unit.rarity;
                                }
                                if (checkDice <= raritySum) {
                                    if (aliens.length < maxAliens-50 || unit.class != 'C') {
                                        conselUnit = unit;
                                    }
                                }
                            }
                        }
                    }
                });
                console.log('spawned unit ->');
                console.log(conselUnit);
                if (Object.keys(conselUnit).length >= 1) {
                    dropTile = checkDrop(bat.tileId);
                    if (dropTile >= 0) {
                        checkSpawnType(conselUnit);
                        putEggCat(bat,conselUnit.kind);
                        if (bat.type === 'Oeuf voilé' && bat.tags.includes('invisible')) {
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
    if (!bat.tags.includes('bug') && !bat.tags.includes('larve') && !bat.tags.includes('swarm') && !bat.tags.includes('spider')) {
        bat.tags.push(kind);
    }
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

function checkputEggKind(bat) {
    let dice = rand.rand(1,2);
    if (bat.tags.includes('bug')) {
        return 'bug';
    } else if (bat.tags.includes('larve')) {
        return 'larve';
    } else if (bat.tags.includes('spider')) {
        return 'spider';
    } else if (bat.tags.includes('swarm')) {
        return 'swarm';
    } else {
        let terName = getTileTerrainName(bat.tileId);
        if (terName === 'M' || terName === 'H') {
            bat.tags.push('bug');
            return 'bug';
        } else if (terName === 'F') {
            bat.tags.push('spider');
            return 'spider';
        } else if (terName === 'R' || terName === 'W' || terName === 'L') {
            bat.tags.push('larve');
            return 'larve';
        } else if (terName === 'B') {
            bat.tags.push('swarm');
            return 'swarm';
        } else if (terName === 'P') {
            return zoneInfos.pKind;
        } else if (terName === 'G') {
            return zoneInfos.gKind;
        } else if (terName === 'S') {
            return zoneInfos.sKind;
        } else {
            return '';
        }
    }
};

function checkDrop(layBatTileId) {
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

function unveilAliens(myBat) {
    let myKind = getEggKind(myBat);
    let thisKind;
    let veiledKindsNear = [];
    let veiledKinds = [];
    let distance;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.id != myBat.id) {
                if (bat.type == 'Oeuf voilé') {
                    thisKind = getEggKind(bat);
                    if (!veiledKinds.includes(thisKind)) {
                        veiledKinds.push(thisKind);
                    }
                    distance = calcDistance(myBat.tileId,bat.tileId);
                    if (distance <= 8) {
                        if (!veiledKindsNear.includes(thisKind)) {
                            veiledKindsNear.push(thisKind);
                        }
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
    } else if (!veiledKindsNear.includes(myKind)) {
        aliens.forEach(function(bat) {
            if (bat.loc === "zone") {
                batType = getBatType(bat);
                if (bat.tags.includes('invisible') && batType.kind == myKind && !batType.skills.includes('hide')) {
                    distance = calcDistance(myBat.tileId,bat.tileId);
                    if (distance <= 8) {
                        tagDelete(bat,'invisible');
                    }
                }
            }
        });
    }
    centerMap();
};

function unveilAliensOld(myBat) {
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
