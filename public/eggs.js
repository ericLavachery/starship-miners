function checkStartingAliens() {
    // Ruches
    let numRuches;
    if (!zone[0].visit && zone[0].number < 50) {
        if (zone[0].mapDiff >= 8) {
            dropEgg('Colonie','nedge');
            coconStats.colo = true;
            let coloBat = getAlienByName('Colonie');
            alienSpawn(coloBat,'Vomissure','bmorph');
            alienSpawn(coloBat,'Vomissure','bmorph');
            if (zone[0].mapDiff >= 9) {
                alienSpawn(coloBat,'Vomissure','bmorph');
                alienSpawn(coloBat,'Vomissure','bmorph');
                alienSpawn(coloBat,'Ruche');
                coconStats.volc = true;
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
                    coconStats.volc = true;
                } else {
                    dropEgg('Ruche','nocenter');
                    coconStats.volc = true;
                }
                if (i > 20) {break;}
                i++
            }
        }
    }
    // Flaques
    let numVomi = Math.floor((zone[0].mapDiff+2)*rand.rand(8,20)/14);
    if (!zone[0].visit && zone[0].number < 50) {
        let ii = 1;
        while (ii <= numVomi) {
            if (rand.rand(1,4) === 1) {
                dropEgg('Flaque','any');
            } else {
                if (rand.rand(1,4) === 1 && zone[0].mapDiff >= 7) {
                    dropEgg('Ruche','nocenter');
                    coconStats.volc = true;
                } else {
                    dropEgg('Flaque','nocenter');
                }
            }
            if (ii > 50) {break;}
            ii++
        }
    }
    // Veilleurs
    let numSent = Math.floor((zone[0].mapDiff+zone[0].mapDiff)*rand.rand(8,20)/12);
    if (!zone[0].visit && zone[0].number < 50) {
        let ii = 1;
        while (ii <= numSent) {
            dropEgg('Veilleurs','none');
            if (ii > 50) {break;}
            ii++
        }
    }
    // Encounters
    encounterCheck();
    // Starting Units
    putStartUnits();
    // Gibier
    if (!isStartZone) {
        letsHunt(true);
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
    let overLimit = playerInfos.mapTurn-30;
    if (overLimit < 0) {
        overLimit = 0;
    }
    let maxEggDropTurn = playerInfos.mapTurn-5;
    if (maxEggDropTurn < Math.ceil(zone[0].mapDiff/2)) {
        maxEggDropTurn = Math.ceil(zone[0].mapDiff/2);
    }
    let maxDroppedEggs = Math.ceil((maxEggDropTurn+overLimit)*(zone[0].mapDiff+1.5)/7);
    maxDroppedEggs = maxDroppedEggs+Math.round(playerInfos.fuzzTotal/50)-8;
    let absoluteMinMax = Math.floor((playerInfos.mapTurn-5)/5)+1;
    if (maxDroppedEggs < absoluteMinMax) {
        maxDroppedEggs = absoluteMinMax;
    }
    if (coconStats.dome) {
        overLimit = playerInfos.mapTurn-25;
        if (overLimit < 0) {
            overLimit = 0;
        }
        maxDroppedEggs = maxDroppedEggs+Math.round(playerInfos.mapTurn/1.5)+overLimit;
        overLimit = playerInfos.mapTurn-40;
        if (overLimit < 0) {
            overLimit = 0;
        }
        if ((playerInfos.mapTurn*3) > aliens.length && playerInfos.mapTurn >= 30) {
            overLimit = overLimit+Math.ceil(((playerInfos.mapTurn*3)-aliens.length)/6);
        }
        maxDroppedEggs = maxDroppedEggs+overLimit;
    }
    if (playerInfos.mapTurn < 25+playerInfos.randSeed) {
        if (zone[0].noEggs != undefined) {
            if (zone[0].noEggs) {
                maxDroppedEggs = 0;
            }
        }
    }
    console.log('droppedEggs='+playerInfos.droppedEggs);
    console.log('maxDroppedEggs='+maxDroppedEggs);
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
    if (zone[0].meip != undefined) {
        maxEggsInPlay = maxEggsInPlay+zone[0].meip;
    }
    return maxEggsInPlay;
};

function checkCrysalide() {
    let crysalide = false;
    if (playerInfos.mapTurn >= 20) {
        let crysChance = coconStats.level-4;
        if (crysChance < 1) {
            crysChance = 0;
        } else {
            crysChance = crysChance+1;
            if (coconStats.dome) {
                crysChance = crysChance+3;
            }
            let crysDice = 1000+(aliens.length*10);
            if (rand.rand(1,crysDice) <= crysChance) {
                crysalide = true;
            }
        }
    }
    return crysalide;
};

function checkCoconBonus() {
    console.log('checkCoconBonus !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(coconStats);
    console.log('TURN '+playerInfos.mapTurn);
    if (playerInfos.mapTurn >= 40) {
        if (aliens.length < playerInfos.mapTurn*2.5) {
            if (playerInfos.mapTurn % 5 === 0) {
                console.log(Math.floor(playerInfos.mapTurn/coconStats.turns)+' <= '+playerInfos.cocons);
                if (Math.floor(playerInfos.mapTurn/coconStats.turns) <= playerInfos.cocons) {
                    playerInfos.cocons = playerInfos.cocons-1;
                }
            }
        }
    }
};

function checkAlienArtillery() {
    let alienArtillery = {};
    alienArtillery.ok = false;
    alienArtillery.type = 'webb';
    return alienArtillery;
};

function getDropChance(turn) {
    let adjMapDrop = playerInfos.mapDrop;
    let adjMapTurn = turn+landingNoise-13+zone[0].mapDiff;
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
    if (dropChance < 10) {
        dropChance = 0;
    }
    return dropChance;
};

function checkEggsDrop() {
    console.log('check egg drop');
    eggDropCount = 0;
    let drop = false;
    let satDrop = false;
    let eggPauseDice = calcEggPause(false);
    let dropChance = getDropChance(playerInfos.mapTurn);
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
    if (domeProtect) {
        dropChance = 0;
        dropMessage = 'Dôme actif';
    }
    console.log('dropChance='+dropChance);
    if (playerInfos.pseudo === 'Payall' || playerInfos.pseudo === 'Xxxxx') {
        warning('Oeufs','Check '+dropChance+'% '+dropMessage);
    }
    if (!domeProtect) {
        let crysalide = checkCrysalide();
        let alienArtillery = checkAlienArtillery();
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
                if (playerInfos.pseudo === 'Payall' || playerInfos.pseudo === 'Xxxxx') {
                    warning('Cocon de saturation','200+ aliens.');
                }
            } else if (crysalide) {
                // cocon avec alien class S !!!
                dropEgg('Cocon','edge');
                dropEgg('Oeuf','guard');
                let crysEggs = Math.floor((200-aliens.length)/50*zone[0].mapDiff/8*zone[0].mapDiff/8);
                if (crysEggs >= 1) {
                    let i = 1;
                    while (i <= crysEggs) {
                        dropEgg('Oeuf','nocenter');
                        if (i > 4) {break;}
                        i++
                    }
                }
                satDrop = true;
                playerInfos.alienSat = 0;
            }
        }
        if (drop || playerInfos.eggPause) {
            playerInfos.mapDrop = 0;
            if (playerInfos.eggPause) {
                if (rand.rand(1,eggPauseDice) === 1) {
                    playerInfos.eggPause = false;
                    console.log('END PAUSE! 1/'+eggPauseDice);
                    if (playerInfos.pseudo === 'Payall' || playerInfos.pseudo === 'Xxxxx') {
                        warning('Fin de la pause','Check 1/'+eggPauseDice+' réussi.');
                    }
                } else {
                    if (playerInfos.pseudo === 'Payall' || playerInfos.pseudo === 'Xxxxx') {
                        warning('La pause continue','Check 1/'+eggPauseDice+' raté.');
                    }
                }
            }
        } else {
            playerInfos.mapDrop = playerInfos.mapDrop+1;
        }
        if (eggDropCount >= 1 || satDrop) {
            eggSound();
            playMusic('aftermath',true);
            if (Math.floor(playerInfos.mapTurn/coconStats.turns) > playerInfos.cocons && !satDrop) {
                if (coconStats.level >= 9) {
                    dropEgg('Cocon','nedge');
                } else {
                    dropEgg('Cocon','target');
                }
                if (playerInfos.vue >= 1) {
                    warning('Cocon','Un Cocon est tombé!');
                }
                playerInfos.droppedEggs = playerInfos.droppedEggs+1;
                let doubleCocon = playerInfos.mapTurn+((zone[0].mapDiff-1)*7);
                if (playerInfos.mapTurn >= 20 && aliens.length < playerInfos.mapTurn*2 && zone[0].mapDiff >= 5) {
                    doubleCocon = doubleCocon+100;
                    if (playerInfos.mapTurn >= 40 && aliens.length < playerInfos.mapTurn) {
                        doubleCocon = doubleCocon+50;
                    }
                }
                if (doubleCocon >= 50) {
                    dropEgg('Oeuf','nedge');
                    playerInfos.droppedEggs = playerInfos.droppedEggs+1;
                }
                if (doubleCocon >= 100) {
                    dropEgg('Cocon','nedge');
                    playerInfos.droppedEggs = playerInfos.droppedEggs+1;
                    if (playerInfos.vue >= 1) {
                        warning('Cocon','Un Cocon est tombé!');
                    }
                }
                if (doubleCocon >= 200) {
                    dropEgg('Cocon','nedge');
                    playerInfos.droppedEggs = playerInfos.droppedEggs+1;
                    if (playerInfos.vue >= 1) {
                        warning('Cocon','Un Cocon est tombé!');
                    }
                }
                playerInfos.cocons = playerInfos.cocons+1;
            }
        } else {
            // playMusic('any',false);
        }
    }
    if (playerInfos.mapTurn >= 15 && !domeProtect) {
        let adjFuzz = playerInfos.fuzzTotal-150;
        if (adjFuzz < 1) {adjFuzz = 1;}
        let rucheBord = Math.ceil(adjFuzz*adjFuzz/30000*Math.sqrt(zone[0].mapDiff)/3);
        if (rand.rand(1,100) <= rucheBord) {
            dropEgg('Vomissure','edge');
            if (playerInfos.vue >= 2) {
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
        if (rand.rand(1,100) <= eggPausePerc && !coconStats.dome) {
            playerInfos.eggPause = true;
            console.log('PAUSE! '+eggPausePerc+'%');
            if (playerInfos.pseudo === 'Payall' || playerInfos.pseudo === 'Xxxxx') {
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
        let eggBonusChance = Math.ceil(playerInfos.mapTurn*2.5)-50+(playerInfos.mapAdjDiff*5)+((maxDroppedEggs-playerInfos.droppedEggs)*10);
        if (coconStats.dome) {
            eggBonusChance = Math.ceil(eggBonusChance*1.5)+100;
        }
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
    let maxPack = Math.floor((zone[0].mapDiff+1)*(zone[0].mapDiff+1)/4.4);
    if (maxPack > 15) {
        maxPack = 15;
    }
    if (numEggs >= 1) {
        let eggTypeDice;
        let i = 1;
        while (i <= numEggs) {
            eggTypeDice = rand.rand(1,100);
            invisibleChance = Math.floor(zone[0].mapDiff*1.5)-8+zoneInfos.ieggsBonus;
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
                if (playerInfos.vue >= 3 && (playerInfos.knownAliens.includes('Oeuf voilé') || playerInfos.comp.ca >= 4)) {
                    warning('Oeuf voilé','Un Oeuf voilé est tombé!');
                }
            } else {
                if (rand.rand(1,zone[0].mapDiff+2) >= 4 && playerInfos.mapTurn*2.5 > aliens.length && playerInfos.mapTurn >= 30 && coveredEggs <= Math.ceil(zone[0].mapDiff/3)) {
                    if (coconStats.volc) {
                        dropEgg('Oeuf','acouvert');
                        coveredEggs++;
                    } else {
                        if (rand.rand(1,70) <= playerInfos.mapTurn) {
                            dropEgg('Oeuf','nearboss');
                        } else {
                            dropEgg('Oeuf','nedge');
                        }
                    }
                } else {
                    if (rand.rand(1,70) <= playerInfos.mapTurn) {
                        dropEgg('Oeuf','nearboss');
                    } else {
                        dropEgg('Oeuf','any');
                    }
                }
                playerInfos.droppedEggs = playerInfos.droppedEggs+1;
            }
            if (i > maxPack) {break;}
            i++
        }
    }
};

function getCoqueChance() {
    let coqPerc = coqueChance;
    if (zone[0].mapDiff < 4) {
        coqPerc = coqPerc+(zone[0].mapDiff*5)-20;
    }
    if (playerInfos.mapTurn > aliens.length) {
        coqPerc = coqPerc+13;
    }
    if (coconStats.dome) {
        coqPerc = coqPerc+17;
    }
    return coqPerc;
}

function dropEgg(alienUnit,theArea) {
    console.log('dropping egg...');
    let alienType = getBatTypeByName(alienUnit);
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
        } else if (alienUnit === 'Cocon' && theArea === 'edge') {
            putBat(dropTile,0,0,'crys');
        } else {
            putBat(dropTile,0,0);
        }
        if (alienUnit.includes('Oeuf') || alienUnit === 'Coque' || alienUnit === 'Cocon') {
            eggDropCount = eggDropCount+1;
        }
        if (!coconStats.dome && playerInfos.eggsKilled >=1 && (playerInfos.eggsKilled-playerInfos.pauseSeed) >= 1 && (playerInfos.eggsKilled-playerInfos.pauseSeed) % pauseCount === 0) {
            playerInfos.eggPause = true;
            console.log('PAUSE! '+playerInfos.eggsKilled+' eggs killed');
            if (playerInfos.pseudo === 'Payall' || playerInfos.pseudo === 'Xxxxx') {
                warning('Nouvelle pause',playerInfos.eggsKilled+' oeufs tués.');
            }
        }
    }
};

function hasAlien(unitName) {
    let youHaveIt = false;
    if (aliens.some(e => e.type === unitName)) {
        youHaveIt = true;
    }
    // aliens.forEach(function(bat) {
    //     if (bat.type === unitName) {
    //         youHaveIt = true;
    //     }
    // });
    return youHaveIt;
};

function hasAlienWithTag(unitName,tag) {
    let youHaveIt = false;
    aliens.forEach(function(bat) {
        if (bat.type === unitName && bat.tags.includes(tag)) {
            youHaveIt = true;
        }
    });
    return youHaveIt;
};

function checkPiloneTiles() {
    let piloneTiles = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            if (bat.type === 'Pilône') {
                let thisTile = bat.tileId;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-1-mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+1-mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-1+mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+1+mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize+1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize+2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize-2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize-1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize+2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize-2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-mapSize-3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-mapSize-2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-mapSize-1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-mapSize+1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-mapSize+2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-mapSize+3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+mapSize-3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+mapSize-2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+mapSize-1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+mapSize;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+mapSize+1;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+mapSize+2;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+mapSize+3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize-3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize-3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize-3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+mapSize+3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+mapSize+3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId+3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize+3;
                piloneTiles.push(thisTile);
                thisTile = bat.tileId-mapSize-mapSize+3;
                piloneTiles.push(thisTile);
            }
        }
    });
    return piloneTiles;
};

function eggDropTile(eggName,theArea) {
    let theTile = -1;
    let area = 'any';
    let targetTile = -1;
    let piloneTiles = checkPiloneTiles();
    if (theArea != 'none') {
        area = theArea;
    } else {
        if (eggName === 'Crocos') {
            area = 'waterhunt';
        } else if (eggName === 'Meatballs') {
            area = 'hunt';
        } else if (eggName === 'Tritons') {
            area = 'hunt';
        } else if (eggName === 'Rats') {
            area = 'hunt';
        } else if (eggName.includes('Ruche') || eggName.includes('Vomissure') || eggName.includes('Flaque')) {
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
    // Mission coverEggs
    if (playerInfos.mapTurn < 26+playerInfos.randSeed) {
        if (eggName === 'Coque' || eggName.includes('Oeuf')) {
            if (zone[0].coverEggs != undefined) {
                if (zone[0].coverEggs) {
                    area = 'acouvert';
                }
            }
        }
    }
    // ANY
    if (area === 'any') {
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                if (tile.x >= 2 && tile.x <= 59 && tile.y >= 2 && tile.y <= 59) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
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
    // HUNT
    if (area === 'hunt') {
        console.log('HUNT');
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                if (tile.x < 18 || tile.x > 42 || tile.y < 18 || tile.y > 42) {
                    let okTile = true;
                    alienOccupiedTiles.forEach(function(tileId) {
                        if (okTile) {
                            let distance = calcDistance(tileId,tile.id);
                            if (distance < 7) {
                                okTile = false;
                            }
                        }
                    });
                    if (okTile && !alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
        console.log(theTile);
    }
    // WATERHUNT
    if (area === 'waterhunt') {
        console.log('WATERHUNT');
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                if (tile.x < 18 || tile.x > 42 || tile.y < 18 || tile.y > 42) {
                    if (tile.terrain === 'W' || tile.terrain === 'L' || tile.terrain === 'S') {
                        let okTile = true;
                        alienOccupiedTiles.forEach(function(tileId) {
                            if (okTile) {
                                let distance = calcDistance(tileId,tile.id);
                                if (distance < 7) {
                                    okTile = false;
                                }
                            }
                        });
                        if (okTile && !alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
                            theTile = tile.id;
                        }
                    }
                }
            }
        });
        if (theTile < 0) {
            shufZone.forEach(function(tile) {
                if (theTile < 0) {
                    if (tile.x < 18 || tile.x > 42 || tile.y < 18 || tile.y > 42) {
                        let okTile = true;
                        alienOccupiedTiles.forEach(function(tileId) {
                            if (okTile) {
                                let distance = calcDistance(tileId,tile.id);
                                if (distance < 7) {
                                    okTile = false;
                                }
                            }
                        });
                        if (okTile && !alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
                            theTile = tile.id;
                        }
                    }
                }
            });
        }
        console.log(theTile);
    }
    // NOCENTER
    if (area === 'nocenter') {
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                if (tile.x < 15 || tile.x > 45 || tile.y < 15 || tile.y > 45) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
    }
    // TARGET
    // Près d'un bâtiment du joueur
    if (area === 'target') {
        let shufBats = _.shuffle(bataillons);
        let bestFuzz = -3;
        let notThisTile = -1;
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone") {
                if (bat.fuzz+rand.rand(0,2) > bestFuzz) {
                    targetTile = bat.tileId;
                    bestFuzz = bat.fuzz;
                }
            }
        });
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                let distance = calcDistance(tile.id,targetTile);
                if (distance > 8 && distance < 13) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        theTile = tile.id;
                    }
                }
            }
        });
        if (theTile < 0) {
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone") {
                    let batType = getBatType(bat);
                    if (batType.cat === 'buildings') {
                        let distance = calcDistance(bat.tileId,theTile);
                        if (distance < 5) {
                            notThisTile = theTile;
                            theTile = -1;
                        }
                    }
                }
            });
        }
        if (notThisTile != -1 || theTile < 0) {
            bestFuzz = -3;
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone") {
                    if (bat.fuzz+rand.rand(0,2) > bestFuzz && bat.tileId != notThisTile) {
                        targetTile = bat.tileId;
                        bestFuzz = bat.fuzz;
                    }
                }
            });
            shufZone.forEach(function(tile) {
                if (theTile < 0) {
                    let distance = calcDistance(tile.id,targetTile);
                    if (distance > 10 && distance < 15) {
                        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                            theTile = tile.id;
                        }
                    }
                }
            });
        }
    }
    // AROUND
    // près d'une flaque
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
    // Près du Bastion
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
    // Près d'une Colonie ou Crysalide
    if (area === 'guard') {
        let shufAliens = _.shuffle(aliens);
        shufAliens.forEach(function(bat) {
            if (bat.loc === "zone") {
                if (bat.type === 'Colonie') {
                    targetTile = bat.tileId;
                }
                if (bat.type === 'Cocon' && bat.tags.includes('crys')) {
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
    // Près d'un Vocan ou d'une Ruche
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
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
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
                        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
                            theTile = tile.id;
                        }
                    }
                }
            });
        }
        if (theTile < 0) {
            shufZone.forEach(function(tile) {
                if (theTile < 0) {
                    distance = calcDistance(tile.id,targetTile);
                    if (distance === 2 || distance === 3 || distance === 4 || distance === 5) {
                        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                            theTile = tile.id;
                        }
                    }
                }
            });
        }
    }
    // neaR BOss
    // Près d'un Boss
    if (area === 'nearboss') {
        let shufAliens = _.shuffle(aliens);
        shufAliens.forEach(function(bat) {
            if (bat.loc === "zone") {
                let batType = getBatType(bat);
                if (batType.class === 'S' || (batType.class === 'A' && batType.rarity === 2)) {
                    if (targetTile < 0) {
                        targetTile = bat.tileId;
                    }
                }
            }
        });
        let shufZone = _.shuffle(zone);
        let distance;
        if (targetTile < 0) {
            shufZone.forEach(function(tile) {
                if (theTile < 0) {
                    if (tile.x >= 2 && tile.x <= 59 && tile.y >= 2 && tile.y <= 59) {
                        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
                            theTile = tile.id;
                        }
                    }
                }
            });
        } else {
            shufZone.forEach(function(tile) {
                if (theTile < 0) {
                    distance = calcDistance(tile.id,targetTile);
                    if (distance === 2 || distance === 3) {
                        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
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
                            if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && !piloneTiles.includes(tile.id)) {
                                theTile = tile.id;
                            }
                        }
                    }
                });
            }
            if (theTile < 0) {
                shufZone.forEach(function(tile) {
                    if (theTile < 0) {
                        distance = calcDistance(tile.id,targetTile);
                        if (distance === 2 || distance === 3 || distance === 4 || distance === 5) {
                            if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                                theTile = tile.id;
                            }
                        }
                    }
                });
            }
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
    let aliensNums = {lucioles:0,moucherons:0,bugs:0,firebugs:0,escarbots:0,scorpions:0,fourmis:0,cafards:0,gluantes:0,larves:0,ecrevisses:0,veilleurs:0};
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.type === 'Lucioles') {
                aliensNums.lucioles = aliensNums.lucioles+1;
            } else if (bat.type === 'Bugs') {
                aliensNums.bugs = aliensNums.bugs+1;
            } else if (bat.type === 'Firebugs') {
                aliensNums.firebugs = aliensNums.firebugs+1;
            } else if (bat.type === 'Escarbots') {
                aliensNums.escarbots = aliensNums.escarbots+1;
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
            } else if (bat.type === 'Ecrevisses') {
                aliensNums.ecrevisses = aliensNums.ecrevisses+1;
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
    if (vomiToRuche < 7) {
        vomiToRuche = 7;
    }
    let maxPonte = zone[0].mapDiff+zone[0].mapDiff+2;
    let fantMorph = Math.round((11.5-zone[0].mapDiff)/Math.sqrt(zone[0].mapDiff)*10);
    if (fantMorph < 7) {fantMorph = 7;}
    let wurmMorph = Math.round((13-zone[0].mapDiff)/Math.sqrt(zone[0].mapDiff)*5);
    if (wurmMorph < 7) {wurmMorph = 7;}
    let scionMorph = fantMorph;
    let libMorph = fantMorph;
    let libGenMorph = 0;
    let libGenMax = 14-zone[0].mapDiff;
    if (libGenMax < 4) {libGenMax = 4;}
    let veilTransTurn = Math.ceil(35-(zone[0].mapDiff*zone[0].mapDiff/10));
    let minVolcDiff = (zone[0].mapDiff*20)+zone[0].mapTurn;
    let flyDice;
    let warnAsticots = false;
    let warnVers = false;
    let hasHomards = false;
    if (hasAlien('Homards')) {
        hasHomards = true;
    }
    let cafDice = 4;
    if (zone[0].type === 'roaches') {
        cafDice = 2;
    }
    let shufAliens = _.shuffle(aliens);
    shufAliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            flyDice = rand.rand(1,3);
            let vomiDice = vomiToRuche;
            if (bat.tags.includes('fastmorph')) {
                vomiDice = Math.ceil(vomiDice/2);
            }
            let batTurn = playerInfos.mapTurn-bat.creaTurn+1;
            if ((bat.type.includes('Oeuf') || bat.type === 'Coque') && aliens.length < maxAliens) {
                batType = getBatType(bat);
                eggTurn = playerInfos.mapTurn-bat.creaTurn+1;
                eggModTurn = eggTurn+(zone[0].mapDiff*2)-12;
                if (bat.type === 'Coque') {
                    vomiCheck = eggModTurn;
                } else if (bat.type === 'Oeuf') {
                    vomiCheck = ((batType.squads-bat.squadsLeft)*vomiChance)+(eggModTurn*1);
                } else {
                    vomiCheck = 0;
                }
                if (coconStats.dome) {
                    vomiCheck = vomiCheck*2;
                }
                if (domeProtect) {
                    vomiCheck = vomiCheck*2;
                }
                if (rand.rand(1,100) <= vomiCheck) {
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
            } else if (bat.type === 'Colonie' && batTurn+2 % 7 === 0 && batTurn > 2 && playerInfos.mapTurn >= 35) {
                coloSpawn(bat);
            } else if (bat.type === 'Colonie' && rand.rand(1,3) === 1) {
                alienSpawn(bat,'Vomissure','bmorph');
            } else if (bat.type === 'Colonie' && batTurn % 2 === 0 && batTurn > 1 && aliens.length < maxAliens-50) {
                alienSpawn(bat,'Torches');
            } else if (transList.includes('Asticots') && bat.type === 'Asticots' && !bat.tags.includes('morph')) {
                bat.tags.push('morph');
                if (playerInfos.vue >= 2 && playerInfos.comp.ca >= 2 && !warnAsticots) {
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
                if (playerInfos.vue >= 2 && playerInfos.comp.ca >= 2 && !warnVers) {
                    warnVers = true;
                    warning('Tranformation imminante','Les Vers vont devenir des Lucioles!');
                }
            } else if (bat.squadsLeft >= 5 && bat.type === 'Vers' && bat.tags.includes('morph')) {
                alienMorph(bat,'Lucioles',false);
                if (libMorph <= 20) {
                    libGenMorph++;
                }
            } else if (wurmMorph <= 40 && rand.rand(1,wurmMorph) === 1 && bat.squadsLeft >= 3 && bat.type === 'Larves') {
                alienMorph(bat,'Wurms',false);
            } else if (libMorph <= 30 && (rand.rand(1,libMorph) === 1 || libGenMorph >= libGenMax) && bat.squadsLeft >= 3 && bat.type === 'Lombrics') {
                alienMorph(bat,'Libellules',false);
            } else if (fantMorph <= 25 && rand.rand(1,fantMorph) === 1 && bat.squadsLeft >= 3 && bat.type === 'Ombres') {
                alienMorph(bat,'Fantômes',false);
            } else if (scionMorph <= 20 && rand.rand(1,scionMorph) === 1 && bat.type === 'Wurms' && !bat.tags.includes('scion')) {
                bat.tags.push('scion');
            } else if (rand.rand(1,vomiDice) === 1 && playerInfos.mapTurn >= Math.ceil(vomiToRuche/1.5) && bat.type === 'Vomissure' && !bat.tags.includes('morph')) {
                bat.tags.push('morph');
                if (playerInfos.vue >= 1 && playerInfos.comp.ca >= 1) {
                    warning('Tranformation imminante','Une Vomissure va devenir une Ruche!',false,bat.tileId);
                }
            } else if (bat.type === 'Vomissure' && bat.tags.includes('morph')) {
                alienMorph(bat,'Ruche',true);
                coconStats.volc = true;
            } else if (bat.type === 'Vomissure' && bat.tags.includes('bmorph')) {
                bat.tags.push('morph');
            } else if (bat.type === 'Dragons' && aliens.length < maxAliens && aliensNums.firebugs < Math.round(maxPonte/1.5)) {
                alienSpawn(bat,'Firebugs');
            } else if (bat.type === 'Bigheads' && aliens.length < maxAliens && aliensNums.escarbots < Math.round(maxPonte/1.5)) {
                alienSpawn(bat,'Escarbots');
            } else if (bat.type === 'Mantes' && aliens.length < maxAliens && aliensNums.fourmis < Math.round(maxPonte/1.5)) {
                alienSpawn(bat,'Fourmis');
            } else if (bat.type === 'Scarabs' && aliens.length < maxAliens-50 && aliensNums.bugs < maxPonte*2) {
                alienSpawn(bat,'Bugs');
            } else if (bat.type === 'Androks' && aliens.length < maxAliens-50 && aliensNums.scorpions < Math.round(maxPonte*1.5)) {
                alienSpawn(bat,'Scorpions');
            } else if (bat.type === 'Homards' && aliens.length < maxAliens-50 && aliensNums.cafards < maxPonte*3) {
                alienSpawn(bat,'Cafards');
                alienSpawn(bat,'Cafards');
                alienSpawn(bat,'Cafards');
            } else if (bat.type === 'Ecrevisses' && aliens.length < maxAliens-50 && aliensNums.cafards < maxPonte*3) {
                alienSpawn(bat,'Cafards');
            } else if (bat.type === 'Veilleurs' && (batTurn >= veilTransTurn || (batTurn >= 12 && bat.tags.includes('fastmorph'))) && bat.squadsLeft >= 3 && rand.rand(1,6) === 1) {
                bat.tags.push('morph');
                if (bat.tags.includes('invisible')) {
                    tagDelete(bat,'invisible');
                }
                if (playerInfos.vue >= 1 && playerInfos.comp.ca >= 1) {
                    warning('Tranformation imminante','Des Veilleurs vont se transformer en Ruche!',false,bat.tileId);
                }
            } else if (bat.type === 'Veilleurs' && bat.tags.includes('morph')) {
                alienMorph(bat,'Ruche',false);
                coconStats.volc = true;
            } else if (bat.type === 'Veilleurs' && aliens.length < maxAliens-50 && bat.squadsLeft >= 3) {
                let lifeTurn = playerInfos.mapTurn-bat.creaTurn;
                if (lifeTurn === 1 && landingNoise >= 2) {
                    veilSpawn(bat);
                    if (zone[0].mapDiff >= 2) {
                        veilSpawn(bat);
                    }
                    if (zone[0].mapDiff >= 3) {
                        veilSpawn(bat);
                    }
                    if (zone[0].mapDiff >= 6) {
                        veilSpawn(bat);
                    }
                }
                if (!bat.tags.includes('invisible')) {
                    if (rand.rand(1,3) === 1) {
                        veilSpawn(bat);
                    }
                }
            } else if (bat.type === 'Megagrubz' && rand.rand(1,2) === 1 && aliens.length < maxAliens) {
                alienSpawn(bat,'Vomissure','larve');
            } else if (bat.type === 'Cafards' && bat.squadsLeft >= 6 && (aliensNums.ecrevisses >= 1 || hasHomards) && rand.rand(1,6) === 1) {
                if (hasHomards) {
                    alienMorph(bat,'Ecrevisses',false);
                } else {
                    alienMorph(bat,'Homards',false);
                    hasHomards = true;
                }
            } else if (bat.type === 'Cafards' && bat.squadsLeft > cafDice+1 && rand.rand(1,cafDice) === 1 && aliens.length < maxAliens-50 && aliensNums.cafards < maxPonte*3) {
                alienSpawn(bat,'Cafards');
            } else if (bat.type === 'Glaireuses' && aliens.length < maxAliens-50 && aliensNums.gluantes < maxPonte) {
                alienSpawn(bat,'Gluantes');
            } else if (bat.type === 'Cocon') {
                cocoonSpawn(bat);
            }
        }
    });
};

function coloSpawn(bat) {
    if (bat.tags.includes('larve')) {
        alienSpawn(bat,'Liches');
        alienSpawn(bat,'Fantômes');
        alienSpawn(bat,'Fantômes');
        alienSpawn(bat,'Fantômes');
        alienSpawn(bat,'Wurms');
        alienSpawn(bat,'Wurms');
        alienSpawn(bat,'Wurms');
        alienSpawn(bat,'Ombres');
        alienSpawn(bat,'Ombres');
        alienSpawn(bat,'Ombres');
    } else if (bat.tags.includes('swarm')) {
        alienSpawn(bat,'Homards');
        alienSpawn(bat,'Ojos');
        alienSpawn(bat,'Ojos');
        alienSpawn(bat,'Ojos');
        alienSpawn(bat,'Ojos');
        alienSpawn(bat,'Mantes');
        alienSpawn(bat,'Mantes');
        alienSpawn(bat,'Cafards');
        alienSpawn(bat,'Cafards');
        alienSpawn(bat,'Cafards');
        alienSpawn(bat,'Cafards');
    } else if (bat.tags.includes('spider')) {
        alienSpawn(bat,'Uberspinne');
        alienSpawn(bat,'Glaireuses');
        alienSpawn(bat,'Veuves');
        alienSpawn(bat,'Veuves');
        alienSpawn(bat,'Faucheux');
        alienSpawn(bat,'Faucheux');
        alienSpawn(bat,'Gluantes');
        alienSpawn(bat,'Gluantes');
        alienSpawn(bat,'Gluantes');
        alienSpawn(bat,'Gluantes');
    } else if (bat.tags.includes('bug')) {
        alienSpawn(bat,'Overbugs');
        alienSpawn(bat,'Dragons');
        alienSpawn(bat,'Scarabs');
        alienSpawn(bat,'Scarabs');
        alienSpawn(bat,'Spitbugs');
        alienSpawn(bat,'Spitbugs');
        alienSpawn(bat,'Spitbugs');
        alienSpawn(bat,'Firebugs');
        alienSpawn(bat,'Firebugs');
        alienSpawn(bat,'Firebugs');
    }
}

function getAKindByTer(terName,pKind,gKind,sKind) {
    let kind = 'bug';
    if (terName === 'M' || terName === 'H') {
        if (zone[0].planet === 'Gehenna') {
            kind = 'spider';
        } else {
            kind = 'bug';
        }
    } else if (terName === 'F') {
        if (zone[0].planet === 'Horst') {
            kind = 'swarm';
        } else {
            kind = 'spider';
        }
    } else if (terName === 'W' || terName === 'R' || terName === 'L') {
        if (zone[0].planet === 'Horst') {
            kind = 'swarm';
        } else {
            kind = 'larve';
        }
    } else if (terName === 'B') {
        if (zone[0].planet === 'Kzin') {
            kind = 'spider';
        } else {
            kind = 'swarm';
        }
    } else if (terName === 'P') {
        kind = pKind;
    } else if (terName === 'G') {
        kind = gKind;
    } else if (terName === 'S') {
        kind = sKind;
    } else {
        kind = 'bug';
    }
    return kind;
}

function veilSpawn(bat) {
    let terName = getTileTerrainName(bat.tileId);
    let kind = getAKindByTer(terName,zoneInfos.pKind,zoneInfos.gKind,zoneInfos.sKind);
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
    let morphTags = getMorphTags(bat);
    // delete bat
    deadAliensList.push(bat.id);
    // put new
    let unitIndex = alienUnits.findIndex((obj => obj.name === newBatName));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    checkSpawnType(conselUnit);
    putBat(putTile,0,0,morphTags);
    // Turn & Tags
    // batIndex = aliens.findIndex((obj => obj.tileId === putTile));
    // let newAlien = aliens[batIndex];
};

function getMorphTags(bat) {
    let morphTags = bat.tags;
    if (morphTags.includes('scion')) {
        tagIndex = morphTags.indexOf('scion');
        morphTags.splice(tagIndex,1);
    }
    if (morphTags.includes('morph')) {
        tagIndex = morphTags.indexOf('morph');
        morphTags.splice(tagIndex,1);
    }
    if (morphTags.includes('fluo')) {
        tagIndex = morphTags.indexOf('fluo');
        morphTags.splice(tagIndex,1);
    }
    if (morphTags.includes('guide')) {
        tagIndex = morphTags.indexOf('guide');
        morphTags.splice(tagIndex,1);
    }
    if (morphTags.includes('jello')) {
        tagIndex = morphTags.indexOf('jello');
        morphTags.splice(tagIndex,1);
    }
    if (morphTags.includes('jelly')) {
        tagIndex = morphTags.indexOf('jelly');
        morphTags.splice(tagIndex,1);
    }
    if (morphTags.includes('invisible')) {
        tagIndex = morphTags.indexOf('invisible');
        morphTags.splice(tagIndex,1);
    }
    return morphTags;
};

function setCoconStats() {
    coconStats.level = zone[0].mapDiff+Math.floor(playerInfos.mapTurn/35)-1;
    let coconTurbo = Math.round(Math.sqrt(playerInfos.cocons)*2);
    coconStats.turns = 31-coconTurbo-Math.floor((zone[0].mapDiff*1.25)+(playerInfos.fuzzTotal/150));
    if (hasUnit('Dôme')) {
        coconStats.dome = true;
        playerInfos.eggPause = false;
        if (playerInfos.mapTurn >= 35 && coconStats.level < 9) {
            coconStats.level = 9;
        }
        if (coconStats.turns > 10) {
            coconStats.turns = 10;
        }
    } else {
        coconStats.dome = false;
    }
    if (hasAlien('Volcan') || hasAlien('Ruche')) {
        coconStats.volc = true;
    } else {
        coconStats.volc = false;
    }
    if (hasAlien('Colonie')) {
        coconStats.colo = true;
    } else {
        coconStats.colo = false;
    }
    if (!coconStats.colo && coconStats.dome) {
        coconStats.nextColo = false;
        aliens.forEach(function(bat) {
            if (bat.loc === "zone" && bat.type === 'Coque' && bat.tags.includes('colo')) {
                coconStats.nextColo = true;
            }
        });
        if (!coconStats.nextColo) {
            let sortedAliens = _.sortBy(aliens,'creaTurn');
            sortedAliens.forEach(function(bat) {
                if (bat.loc === "zone" && bat.type === 'Coque' && !bat.tags.includes('colo') && !bat.tags.includes('morph') && !coconStats.nextColo) {
                    let batAge = playerInfos.mapTurn-bat.creaTurn;
                    if (batAge <= 6) {
                        bat.tags.push('colo');
                        coconStats.nextColo = true;
                    }
                }
            });
            if (!coconStats.nextColo) {
                sortedAliens.forEach(function(bat) {
                    if (bat.loc === "zone" && bat.type === 'Coque' && !bat.tags.includes('colo') && !bat.tags.includes('morph') && !coconStats.nextColo) {
                        if (rand.rand(1,3) === 1) {
                            bat.tags.push('colo');
                            coconStats.nextColo = true;
                        }
                    }
                });
            }
            if (!coconStats.nextColo) {
                sortedAliens.forEach(function(bat) {
                    if (bat.loc === "zone" && bat.type === 'Coque' && !bat.tags.includes('colo') && !bat.tags.includes('morph') && !coconStats.nextColo) {
                        bat.tags.push('colo');
                        coconStats.nextColo = true;
                    }
                });
            }
        }
    }
    console.log('COCON STATS');
    console.log(coconStats);
};

function cocoonSpawn(bat) {
    console.log('SPAWN');
    let eggTurn = playerInfos.mapTurn-bat.creaTurn+1;
    let eggLife = 2;
    console.log('eggTurn='+eggTurn);
    let eggCat = checkputEggKind(bat);
    if (eggCat === '') {
        eggCat = newEggCat();
    }
    console.log('eggCat: '+eggCat);
    if (eggTurn < 3) {
        let classes = [];
        console.log('coconStats.level='+coconStats.level);
        let saturation = false;
        if (aliens.length >= maxAliens-50 && playerInfos.mapTurn >= 55) {
            saturation = true;
        }
        let spawnNum = 4;
        if (eggTurn === 2) {
            spawnNum = 6+Math.floor(playerInfos.mapTurn/50);
            if (coconStats.level >= 12) {
                classes.push('A');
                spawnNum = spawnNum+3;
            } else if (coconStats.level >= 10) {
                classes.push('A');
                spawnNum = spawnNum+1;
            } else if (coconStats.level >= 8) {
                classes.push('A');
                if (!saturation) {
                    classes.push('B');
                }
            } else if (coconStats.level >= 6) {
                classes.push('A');
                classes.push('B');
                if (!saturation) {
                    classes.push('C');
                }
            } else if (coconStats.level >= 4) {
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
            spawnNum = Math.round(coconStats.level*1.75);
            if (spawnNum < satMin) {
                spawnNum = satMin;
            }
            console.log('spawnNum: '+spawnNum);
            if (coconStats.level >= 7) {
                classes.push('B');
            } else if (coconStats.level >= 5) {
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
                if (unit.class != 'A' || unit.rarity != 2 || coconStats.level >= 10) {
                    checkDiceMax = checkDiceMax+unit.rarity;
                }
            }
        });
        let i = 1;
        while (i <= spawnNum) {
            conselReset(true);
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
                        if (unit.class != 'A' || unit.rarity != 2 || coconStats.level >= 10) {
                            raritySum = raritySum+unit.rarity;
                            if (checkDice <= raritySum) {
                                conselUnit = unit;
                            }
                        }
                    }
                });
            }
            // REPLACE ALIEN
            console.log('spawned unit ->');
            console.log(conselUnit.name);
            replaceAlien(conselUnit);
            console.log(conselUnit.name);
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
    // TRANFORMATION EN CLASSE A (ou S) !
    if (eggTurn >= eggLife) {
        if (eggCat === 'bug') {
            if (coconStats.level >= 9 || bat.tags.includes('crys')) {
                if (rand.rand(1,3) === 1) {
                    alienMorph(bat,'Overbugs',false);
                } else {
                    if (hasAlien('Overbugs')) {
                        alienMorph(bat,'Dragons',false);
                    } else {
                        alienMorph(bat,'Overbugs',false);
                    }
                }
            } else if (coconStats.level >= 6) {
                alienMorph(bat,'Dragons',false);
            } else if (coconStats.level >= 4) {
                alienMorph(bat,'Scarabs',false);
            } else {
                alienMorph(bat,'Broyeurs',false);
            }
        } else if (eggCat === 'swarm') {
            if (coconStats.level >= 9 || bat.tags.includes('crys')) {
                alienMorph(bat,'Homards',false);
            } else if (coconStats.level >= 6) {
                alienMorph(bat,'Mantes',false);
            } else if (coconStats.level >= 4) {
                alienMorph(bat,'Galéodes',false);
            } else {
                alienMorph(bat,'Ojos',false);
            }
        } else if (eggCat === 'larve') {
            if (coconStats.level >= 9 || bat.tags.includes('crys')) {
                if (hasAlien('Liches')) {
                    alienMorph(bat,'Megagrubz',false);
                } else {
                    alienMorph(bat,'Liches',false);
                }
            } else if (coconStats.level >= 6) {
                alienMorph(bat,'Megagrubz',false);
            } else if (coconStats.level >= 4) {
                alienMorph(bat,'Libellules',false);
            } else {
                alienMorph(bat,'Wurms',false);
            }
        } else if (eggCat === 'spider') {
            if (coconStats.level >= 9 || bat.tags.includes('crys')) {
                if (rand.rand(1,3) === 1) {
                    alienMorph(bat,'Uberspinne',false);
                } else {
                    if (hasAlien('Uberspinne')) {
                        alienMorph(bat,'Glaireuses',false);
                    } else {
                        alienMorph(bat,'Uberspinne',false);
                    }
                }
            } else if (coconStats.level >= 6) {
                alienMorph(bat,'Glaireuses',false);
            } else if (coconStats.level >= 3) {
                alienMorph(bat,'Mygales',false);
            } else {
                alienMorph(bat,'Faucheux',false);
            }
        } else {
            alienMorph(bat,'Volcan',false);
            coconStats.volc = true;
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

function checkAlienBoss(eggCat) {
    let alienBoss = false;
    if (eggCat === 'swarm') {
        if (hasAlien('Homards') || hasAlien('Ecrevisses')) {
            alienBoss = true;
        }
    } else if (eggCat === 'larve') {
        if (hasAlien('Liches')) {
            alienBoss = true;
        }
    } else if (eggCat === 'spider') {
        if (hasAlien('Uberspinne')) {
            alienBoss = true;
        }
    } else if (eggCat === 'bug') {
        if (hasAlien('Overbugs')) {
            alienBoss = true;
        }
    }
    return alienBoss;
};

function eggSpawn(bat,fromEgg) {
    console.log('SPAWN');
    let overSaturation = false;
    if (playerInfos.alienSat >= coconSatLimit-1 && playerInfos.mapTurn >= 76) {
        overSaturation = true;
    }
    let eggCat = checkputEggKind(bat);
    let alienBoss = checkAlienBoss(eggCat);
    let eggTurn = playerInfos.mapTurn-bat.creaTurn+1;
    let eggModTurn = eggTurn+Math.ceil((zone[0].mapDiff*2)-6);
    if (coconStats.dome) {
        eggModTurn = eggModTurn+3;
    }
    let eggLife = eggLifeStart+Math.floor(zone[0].mapDiff*eggLifeStart/17)+bat.squadsLeft-6;
    if (bat.type === 'Coque' || bat.type === 'Oeuf voilé') {
        eggLife = coqLifeStart+Math.floor(zone[0].mapDiff*coqLifeStart/14)+bat.squadsLeft-6;
        if (bat.tags.includes('colo')) {
            eggLife = eggLife-4;
        }
    }
    if (bat.tags.includes('fastmorph')) {
        eggLife = Math.ceil(eggLife/2);
    }
    let presAlien = zone[0].mapDiff;
    if (presAlien < 1) {
        presAlien = 1;
    }
    console.log('eggTurn='+eggTurn);
    if (eggTurn >= eggLife && fromEgg && !bat.tags.includes('stun')) {
        // TRANFORMATION EN RUCHE OU VOLCAN !
        if (bat.tags.includes('morph')) {
            if (bat.type.includes('Oeuf')) {
                if (bat.type === 'Oeuf voilé') {
                    unveilAliens(bat);
                }
                alienMorph(bat,'Ruche',false);
                coconStats.volc = true;
            } else {
                if (coconStats.dome && !coconStats.colo && bat.tags.includes('colo')) {
                    alienMorph(bat,'Colonie',false);
                    coconStats.colo = true;
                } else {
                    alienMorph(bat,'Volcan',false);
                    coconStats.volc = true;
                }
            }
        } else {
            bat.tags.push('morph');
            if (bat.type === 'Oeuf') {
                if (playerInfos.vue >= 1 && playerInfos.comp.ca >= 1) {
                    warning('Tranformation imminante','Un Oeuf va devenir une Ruche!',false,bat.tileId);
                }
            } else if (bat.type === 'Oeuf voilé') {
                if (bat.tags.includes('invisible')) {
                    if (playerInfos.vue >= 3 && playerInfos.comp.ca >= 1) {
                        warning('Tranformation imminante','Un Oeuf voilé va devenir une Ruche!');
                    }
                } else {
                    if (playerInfos.vue >= 1 && playerInfos.comp.ca >= 1) {
                        warning('Tranformation imminante','Un Oeuf voilé va devenir une Ruche!');
                    }
                }
            } else {
                if (playerInfos.vue >= 1 && playerInfos.comp.ca >= 1) {
                    if (bat.tags.includes('colo') && playerInfos.vue >= 3 && playerInfos.comp.ca >= 2) {
                        warning('Tranformation imminante','Une Coque va devenir une Colonie!',false,bat.tileId);
                    } else {
                        warning('Tranformation imminante','Une Coque va devenir un Volcan!',false,bat.tileId);
                    }
                }
            }
        }
    } else {
        let spawnChance = Math.round(eggTurn*25/bat.squadsLeft*6*Math.sqrt(presAlien)*Math.sqrt(Math.sqrt(playerInfos.mapTurn)));
        if (!fromEgg) {
            spawnChance = 100-(eggTurn*5);
            if (spawnChance < 25) {
                spawnChance = 25;
            }
        }
        console.log('spawnChance='+spawnChance);
        if (rand.rand(1,100) <= spawnChance && !bat.tags.includes('stun')) {
            let adjEggTurn = eggTurn;
            if (adjEggTurn > 13) {
                adjEggTurn = 13;
            }
            let maxSpawn = Math.round(((adjEggTurn*1.5)+(3-(bat.squadsLeft/2))+(zone[0].mapDiff*1.5))/2.1/Math.sqrt(eggsNum+2));
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
            if ((eggModTurn >= 7 && playerInfos.mapTurn >= minTurnB && zone[0].mapDiff >= 3) || zoneInfos.cb) {
                classes.push('B');
                if (eggModTurn >= 14 && playerInfos.mapTurn >= minTurnA && (zone[0].mapDiff >= 6 || overSaturation)) {
                    classes.push('A');
                    if (zoneInfos.as) {
                        classes.push('S');
                    } else if (coconStats.dome && eggModTurn >= 21 && playerInfos.mapTurn >= 40 && !alienBoss && fromEgg && bat.type != 'Oeuf voilé') {
                        classes.push('S');
                    }
                    if (eggModTurn >= 21 && playerInfos.mapTurn >= minTurnA && fromEgg) {
                        const index = classes.indexOf('C');
                        if (index > -1) {
                            classes.splice(index,1);
                        }
                    }
                }
            }
            console.log(classes);
            console.log('eggCat: '+eggCat);
            let checkDiceMax = 0;
            let checkDice;
            let raritySum = 0;
            let dropTile = -1;
            let gotIt = false;
            alienUnits.forEach(function(unit) {
                if (classes.includes(unit.class) && unit.kind.includes(eggCat)) {
                    if (unit.class != 'A' || unit.rarity != 2 || zone[0].mapDiff >= 7) {
                        if (zone[0].mapDiff >= 2 || unit.class != 'C' || unit.rarity >= 4 || unit.name === 'Punaises') {
                            let ztRarity = checkRarityByZoneType(unit);
                            checkDiceMax = checkDiceMax+ztRarity;
                        }
                    }
                }
            });
            console.log('checkDiceMax='+checkDiceMax);
            let i = 1;
            while (i <= spawnNum) {
                conselReset(true);
                gotIt = false;
                checkDice = rand.rand(1,checkDiceMax);
                console.log('checkDice='+checkDice);
                raritySum = 0;
                alienUnits.forEach(function(unit) {
                    if (classes.includes(unit.class) && unit.kind.includes(eggCat) && Object.keys(conselUnit).length <= 0 && !gotIt) {
                        if (unit.class != 'A' || unit.rarity != 2 || zone[0].mapDiff >= 7) {
                            if (zone[0].mapDiff >= 2 || unit.class != 'C' || unit.rarity >= 4 || unit.name === 'Punaises') {
                                let ztRarity = checkRarityByZoneType(unit);
                                raritySum = raritySum+ztRarity;
                                if (checkDice <= raritySum) {
                                    gotIt = true;
                                    if (aliens.length < maxAliens-50 || unit.class != 'C') {
                                        conselUnit = unit;
                                    }
                                }
                            }
                        }
                    }
                });
                console.log('spawned unit ->');
                console.log(conselUnit.name);
                // REPLACE ALIEN
                replaceAlien(conselUnit);
                console.log(conselUnit.name);
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

function checkRarityByZoneType(unit) {
    let ztRarity = unit.rarity;
    if (zoneInfos.type === 'leech') {
        if (unit.name === 'Sangsues') {
            ztRarity = 20;
        } else if (unit.name === 'Ombres') {
            ztRarity = 8;
        } else if (unit.name === 'Megagrubz') {
            ztRarity = 5;
        } else if (unit.name === 'Fantômes') {
            ztRarity = 2;
        } else {
            ztRarity = 0;
        }
    }
    if (zoneInfos.type === 'flies') {
        if (unit.name === 'Asticots') {
            ztRarity = 20;
        } else if (unit.name === 'Lombrics') {
            ztRarity = 8;
        } else if (unit.name === 'Moucherons') {
            ztRarity = 8;
        } else if (unit.name === 'Libellules') {
            ztRarity = 7;
        } else {
            ztRarity = 0;
        }
    }
    if (zoneInfos.type === 'roaches') {
        if (unit.name === 'Cafards') {
            ztRarity = 25;
        } else if (unit.name === 'Blattes') {
            ztRarity = 9;
        } else if (unit.name === 'Homards') {
            ztRarity = 7;
        } else {
            ztRarity = 0;
        }
    }
    if (zoneInfos.type === 'spinne') {
        if (unit.name === 'Sournoises') {
            ztRarity = 22;
        } else if (unit.name === 'Torches') {
            ztRarity = 8;
        } else if (unit.name === 'Uberspinne') {
            ztRarity = 5;
        } else {
            ztRarity = 0;
        }
    }
    if (zoneInfos.type === 'bigbugs') {
        if (unit.name === 'Escarbots') {
            ztRarity = 15;
        } else if (unit.name === 'Broyeurs') {
            ztRarity = 15;
        } else if (unit.name === 'Bigheads') {
            ztRarity = 5;
        } else {
            ztRarity = 0;
        }
    }
    if (zoneInfos.type === 'ants') {
        if (unit.name === 'Fourmis') {
            ztRarity = 24;
        } else if (unit.name === 'Skolos') {
            ztRarity = 8;
        } else if (unit.name === 'Mantes') {
            ztRarity = 8;
        } else {
            ztRarity = 0;
        }
    }
    if (zoneInfos.surf) {
        if (unit.kind === 'spider') {
            if (unit.name === 'Surfeuses') {
                ztRarity = ztRarity*4;
            } else if (unit.name === 'Nerveuses' || unit.name === 'Cracheuses' || unit.name === 'Torches') {
                ztRarity = 0;
            }
        }
    }
    return ztRarity;
};

function checkEggKindByZoneType() {
    let eggKind = '';
    if (zoneInfos.type === 'leech') {
        eggKind = 'larve';
    }
    if (zoneInfos.type === 'flies') {
        eggKind = 'larve';
    }
    if (zoneInfos.type === 'ants') {
        eggKind = 'swarm';
    }
    if (zoneInfos.type === 'roaches') {
        eggKind = 'swarm';
    }
    if (zoneInfos.type === 'spinne') {
        eggKind = 'spider';
    }
    if (zoneInfos.type === 'bigbugs') {
        eggKind = 'bug';
    }
    return eggKind;
};

function replaceAlien(oldAlien) {
    let inName = '';
    let outName = '';
    if (oldAlien.class === 'C') {
        if (zone[0].rc != undefined) {
            inName = zone[0].rc[0];
            outName = zone[0].rc[1];
        }
    }
    if (oldAlien.class === 'B') {
        if (zone[0].rb != undefined) {
            inName = zone[0].rb[0];
            outName = zone[0].rb[1];
        }
    }
    if (oldAlien.class === 'A') {
        if (zone[0].ra != undefined) {
            inName = zone[0].ra[0];
            outName = zone[0].ra[1];
        }
    }
    if (oldAlien.name === inName) {
        conselUnit = getAlienTypeByName(outName);
    } else {
        if (conselUnit.minpa != undefined) {
            if (zone[0].mapDiff < conselUnit.minpa) {
                conselUnit = getAlienTypeByName(conselUnit.rep);
            }
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
    let eggKind = '';
    if (bat.tags.includes('bug')) {
        eggKind = 'bug';
    } else if (bat.tags.includes('larve')) {
        eggKind = 'larve';
    } else if (bat.tags.includes('spider')) {
        eggKind = 'spider';
    } else if (bat.tags.includes('swarm')) {
        eggKind = 'swarm';
    } else {
        eggKind = checkEggKindByZoneType();
        if (eggKind === '') {
            let terName = getTileTerrainName(bat.tileId);
            eggKind = getAKindByTer(terName,zoneInfos.pKind,zoneInfos.gKind,zoneInfos.sKind);
            bat.tags.push(eggKind);
            // if (terName === 'M' || terName === 'H') {
            //     bat.tags.push('bug');
            //     eggKind = 'bug';
            // } else if (terName === 'F') {
            //     bat.tags.push('spider');
            //     eggKind = 'spider';
            // } else if (terName === 'R' || terName === 'W' || terName === 'L') {
            //     bat.tags.push('larve');
            //     eggKind = 'larve';
            // } else if (terName === 'B') {
            //     bat.tags.push('swarm');
            //     eggKind = 'swarm';
            // } else if (terName === 'P') {
            //     eggKind = zoneInfos.pKind;
            // } else if (terName === 'G') {
            //     eggKind = zoneInfos.gKind;
            // } else if (terName === 'S') {
            //     eggKind = zoneInfos.sKind;
            // } else {
            //     eggKind = '';
            // }
        }
    }
    return eggKind;
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
