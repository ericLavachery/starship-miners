function alienMoveLoop() {
    // move map at the end of the alien moves
    console.log('alienMoveLoop');
    $('#report').empty('');
    attAlive = true;
    defAlive = true;
    alienOccupiedTileList();
    playerOccupiedTileList();
    if (selectedBatType.moveCost < 99) {
        isCamoBlock();
    }
    checkPDM();
    tileUntarget();
    targetBat = {};
    targetBatType = {};
    targetWeap = {};
    fearFactor(selectedBat,false);
    checkPossibleMoves();
    // loop this until no ap or no salvo
    console.log('!!! Start Loop !!!');
    let iter = 1;
    while (iter <= 20) {
        console.log('loop '+iter+' || ap:'+selectedBat.apLeft+' salvo:'+selectedBat.salvoLeft);
        if (selectedBat.apLeft >= 1 && selectedBat.salvoLeft >= 1) {
            if (attAlive && defAlive) {
                chooseTarget();
            } else {
                break;
            }
        } else {
            break;
        }
        if (iter > 20) {break;}
        iter++
    }
    console.log('!!! End Loop !!!');
    // si no salvo et reste bcp d'ap : move vers PDM de base (attention: garder le rapport de combat!)
};

function chooseTarget() {
    targetBat = {};
    targetBatType = {};
    targetWeap = {};
    if (!selectedBatType.skills.includes('capbld')) {
        if (!selectedBatType.skills.includes('capfar')) {
            anyCloseTarget();
        } else {
            anyFarTarget();
        }
    }
    let inPlace = false;
    let alienInMelee = isAlienInMelee(selectedBat.tileId);
    let range = selectedWeap.range;
    if (range === 0) {
        // range 0
        if (alienInMelee) {
            inPlace = targetMelee();
            shootTarget(false);
        } else {
            moveToPDM();
            inPlace = targetMelee();
            if (inPlace) {
                shootTarget(false);
            }
        }
    } else if (range === 1) {
        // range 1
        if (alienInMelee) {
            inPlace = targetMelee();
            shootTarget(false);
        } else {
            inPlace = targetClosest();
            if (inPlace) {
                shootTarget(false);
            } else {
                moveToPDM();
                inPlace = targetClosest();
                if (inPlace) {
                    shootTarget(false);
                }
            }
        }
    } else {
        // range 2+
        if (anyTargetInRange()) {
            if (alienInMelee) {
                moveOutOfMelee();
                inPlace = targetFarthest();
                shootTarget(true);
            } else {
                inPlace = targetFarthest();
                shootTarget(false);
            }
        } else {
            moveToPDM();
            inPlace = targetFarthest();
            if (inPlace) {
                shootTarget(false);
            }
        }
    }
    console.log('inPlace '+inPlace);
    console.log(targetBat);
};

function checkAlienFlyTarget(weapon,bat) {
    let batType = getBatType(bat);
    if (weapon.noFly) {
        if (batType.skills.includes('fly') && bat.tags.includes('camo')) {
            return true;
        } else if (batType.skills.includes('fly') && bat.apLeft > -5 && !batType.skills.includes('jetpack')) {
            return false;
        } else {
            if (batType.skills.includes('fly') && bat.apLeft > 0 && batType.skills.includes('jetpack')) {
                return false;
            } else {
                return true;
            }
        }
    } else {
        return true;
    }
};

function shootTarget(recul) {
    console.log('ap '+selectedBat.apLeft+' cost '+selectedWeap.cost);
    if (selectedWeap.range < 1 || selectedBat.apLeft >= selectedWeap.cost || recul || selectedBatType.skills.includes('fly')) {
        checkTargetBatType();
        console.log('shoot '+targetBat.type);
        console.log(targetBat);
        tileTarget(targetBat);
        stopForFight = true;
        isFFW = false;
        combat();
    } else {
        console.log('Pas assez de PA pour tirer');
    }
};

function checkPDM() {
    // peut-être des targets différents selon les types d'aliens?
    pointDeMire = -1;
    let batType;
    let lePlusProche = 100;
    let shufBats = _.shuffle(bataillons);
    // cherche un cible préférée
    if (selectedBatType.skills.includes('anycap')) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= 0) {
                batType = getBatType(bat);
                if (!batType.skills.includes('fly')) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance < lePlusProche) {
                        pointDeMire = bat.tileId;
                        lePlusProche = distance;
                    }
                }
            }
        });
    } else if (selectedBatType.skills.includes('capmen')) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= 0) {
                batType = getBatType(bat);
                if (batType.cat === 'infantry' && !batType.skills.includes('fly')) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance < lePlusProche) {
                        pointDeMire = bat.tileId;
                        lePlusProche = distance;
                    }
                }
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= 3) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance < lePlusProche) {
                    pointDeMire = bat.tileId;
                    lePlusProche = distance;
                }
            }
        });
        if (pointDeMire < 0) {
            // se rabat sur une autre cible
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz >= 1) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance < lePlusProche) {
                        pointDeMire = bat.tileId;
                        lePlusProche = distance;
                    }
                }
            });
        }
        if (pointDeMire < 0) {
            // se rabat sur une autre cible
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz == 0) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance < lePlusProche) {
                        pointDeMire = bat.tileId;
                        lePlusProche = distance;
                    }
                }
            });
        }
    }
    if (pointDeMire < 0) {
        pointDeMire = 1830;
    }
    console.log('PDM: '+pointDeMire);
};

function isSurrounded(bat) {
    let distance;
    let surroundingAliens = 0;
    aliens.forEach(function(alien) {
        if (bat.loc === "zone") {
            distance = calcDistance(bat.tileId,alien.tileId);
            if (distance <= 1) {
                surroundingAliens++;
            }
        }
    });
    if (surroundingAliens >= 6) {
        return true;
    } else {
        return false;
    }
};

function targetLogic(bat) {
    let tFuzz = 0;
    let batType = getBatType(bat);
    let modifiedArmor = Math.round(batType.armor*selectedWeap.armors);
    let averageDamage = selectedWeap.power-modifiedArmor;
    let armorPiercing = selectedWeap.armors;
    if (armorPiercing >= 0.75 && armorPiercing <= 1) {
        armorPiercing = 1;
    }
    let twistedArmor = Math.round(batType.armor*armorPiercing);
    let twistedDamage = selectedWeap.power-twistedArmor;
    if (averageDamage >= selectedWeap.power/2) {
        tFuzz = twistedDamage+batType.armor+rand.rand(0,4);
    } else {
        tFuzz = averageDamage;
    }
    return Math.round(tFuzz);
};

function anyCloseTarget() {
    newPointDeMire = -1;
    let distance;
    let lePlusProche = 100;
    let minFuzz = 0;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (checkAlienFlyTarget(selectedWeap,bat)) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
                if (!isSurrounded(bat)) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance <= closeTargetRange) {
                        tLogic = targetLogic(bat);
                        if (tLogic > bestLogic) {
                            bestLogic = tLogic;
                            newPointDeMire = bat.tileId;
                        }
                        // if (distance < lePlusProche) {
                        //     lePlusProche = distance;
                        //     newPointDeMire = bat.tileId;
                        // }
                    }
                }
            }
        }
    });
    if (newPointDeMire >= 0) {
        pointDeMire = newPointDeMire;
        console.log('new PDM: '+pointDeMire);
    }
};

function anyFarTarget() {
    newPointDeMire = -1;
    let distance;
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz >= -1) {
            if (checkAlienFlyTarget(selectedWeap,bat)) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance <= 10) {
                    tLogic = targetLogic(bat);
                    if (tLogic > bestLogic) {
                        bestLogic = tLogic;
                        newPointDeMire = bat.tileId;
                    }
                }
            }
        }
    });
    if (newPointDeMire > 0) {
        pointDeMire = newPointDeMire;
        console.log('new PDM: '+pointDeMire);
    }
};

function pdmOffsets(tileId) {
    // offsets x et y entre alien et PDM
    myTileX = zone[tileId].x;
    myTileY = zone[tileId].y;
    pdmTileX = zone[pointDeMire].x;
    pdmTileY = zone[pointDeMire].y;
    xOff = Math.abs(myTileX-pdmTileX);
    yOff = Math.abs(myTileY-pdmTileY);
    return [xOff,yOff];
};

function checkPossibleMoves() {
    possibleMoves = [];
    let batHere = false;
    zone.forEach(function(tile) {
        if (isAdjacent(selectedBat.tileId,tile.id)) {
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
                possibleMoves.push(tile.id);
            }
        }
    });
};

function checkPossibleJumps() {
    possibleMoves = [];
    let batHere = false;
    let distance;
    let maxDistance;
    if (selectedBatType.skills.includes('fouisseur')) {
        maxDistance = 5;
    } else {
        maxDistance = Math.round(selectedBat.apLeft/selectedBatType.moveCost/1.2);
    }
    zone.forEach(function(tile) {
        distance = calcDistance(selectedBat.tileId,tile.id);
        if (distance <= maxDistance) {
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
                possibleMoves.push(tile.id);
            }
        }
    });
};

function uncheckMeleeMoves() {
    // remove moves to melee from possible moves
    let thisTile;
    let meleeTile;
    zone.forEach(function(tile) {
        thisTile = tile.id;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" && bat.tileId === thisTile) {
                meleeTile = thisTile-1;
                delPossibleMove(meleeTile);
                meleeTile = thisTile+1;
                delPossibleMove(meleeTile);
                meleeTile = thisTile-mapSize;
                delPossibleMove(meleeTile);
                meleeTile = thisTile+mapSize;
                delPossibleMove(meleeTile);
            }
        });
    });
};

function uncheckRange1Moves() {
    // remove moves to range 1 from possible moves
    let thisTile;
    let r1Tile;
    zone.forEach(function(tile) {
        thisTile = tile.id;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" && bat.tileId === thisTile) {
                r1Tile = thisTile-mapSize-1;
                delPossibleMove(r1Tile);
                r1Tile = thisTile-mapSize+1;
                delPossibleMove(r1Tile);
                r1Tile = thisTile+mapSize-1;
                delPossibleMove(r1Tile);
                r1Tile = thisTile+mapSize+1;
                delPossibleMove(r1Tile);
            }
        });
    });
};

function uncheckBadMoves() {
    let alienOff = pdmOffsets(selectedBat.tileId);
    let tileOff;
    let shufZone = _.shuffle(zone);
    // enlève les possibleMoves qui éloignent fortement du PDM
    if (possibleMoves.length > 1) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length > 1) {
                    tileOff = pdmOffsets(tile.id);
                    if (alienOff[0] > alienOff[1]) {
                        if (alienOff[0] < tileOff[0]) {
                            delPossibleMove(tile.id);
                        } else if (alienOff[0] == tileOff[0] && alienOff[1] < tileOff[1]) {
                            delPossibleMove(tile.id);
                        }
                    } else if (alienOff[0] < alienOff[1]) {
                        if (alienOff[1] < tileOff[1]) {
                            delPossibleMove(tile.id);
                        } else if (alienOff[1] == tileOff[1] && alienOff[0] < tileOff[0]) {
                            delPossibleMove(tile.id);
                        }
                    } else {
                        if (alienOff[0] < tileOff[0] || alienOff[1] < tileOff[1]) {
                            delPossibleMove(tile.id);
                        }
                    }
                }
            }
        });
    }
    // enlève les possibleMoves vers l'eau
    if (possibleMoves.length >= 3 && rand.rand(1,2) === 1) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length >= 3) {
                    if (tile.terrain == 'S' || tile.terrain == 'W' || tile.terrain == 'R') {
                        delPossibleMove(tile.id);
                    }
                }
            }
        });
    }
    // enlève les possibleMoves qui ne rapproche pas du PDM quand l'unité est proche du but
    if (possibleMoves.length > 1) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length > 1) {
                    tileOff = pdmOffsets(tile.id);
                    if (alienOff[0] <= 4 && alienOff[1] <= 4) {
                        if (alienOff[0] == tileOff[0]) {
                            delPossibleMove(tile.id);
                        }
                        if (alienOff[1] == tileOff[1]) {
                            delPossibleMove(tile.id);
                        }
                    }
                }
            }
        });
    }
};

function uncheckBadJumps() {
    let alienOff = pdmOffsets(selectedBat.tileId);
    let tileOff;
    let shufZone = _.shuffle(zone);
    // enlève les possibleMoves qui éloignent du PDM
    if (possibleMoves.length > 1) {
        shufZone.forEach(function(tile) {
            if (possibleMoves.length > 1) {
                tileOff = pdmOffsets(tile.id);
                if (alienOff[0] < tileOff[0] || alienOff[1] < tileOff[1]) {
                    delPossibleMove(tile.id);
                }
            }
        });
    }
    // enlève les possibleMoves vers l'eau
    if (possibleMoves.length > 1) {
        shufZone.forEach(function(tile) {
            if (possibleMoves.length > 1) {
                if (tile.terrain == 'S' || tile.terrain == 'W' || tile.terrain == 'R') {
                    delPossibleMove(tile.id);
                }
            }
        });
    }
    // enlève les possibleMoves qui ne rapproche pas du PDM quand l'unité est proche du but
    if (possibleMoves.length > 1) {
        shufZone.forEach(function(tile) {
            if (possibleMoves.length > 1) {
                tileOff = pdmOffsets(tile.id);
                if (alienOff[0] <= 4 && alienOff[1] <= 4) {
                    if (alienOff[0] == tileOff[0]) {
                        delPossibleMove(tile.id);
                    }
                    if (alienOff[1] == tileOff[1]) {
                        delPossibleMove(tile.id);
                    }
                }
            }
        });
    }
};

function uncheckShortJumps() {
    let longestJump = 1;
    let distance;
    // enlève les possibleMoves les plus courts
    if (possibleMoves.length > 1) {
        zone.forEach(function(tile) {
            distance = calcDistance(selectedBat.tileId,tile.id);
            if (distance > longestJump) {
                longestJump = distance;
            }
        });
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (possibleMoves.length > 1) {
                distance = calcDistance(selectedBat.tileId,tile.id);
                if (distance < longestJump) {
                    delPossibleMove(tile.id);
                }
            }
        });
    }
};

function checkGoodMoves() {
    // vérifie s'il y a un (ou des) moves parfaits et si oui : remplace possibleMoves
    let goodMoves = [];
    let thisTile;
    let minFuzz = -1;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    if (selectedWeap.range === 0) {
        let meleeTile;
        zone.forEach(function(tile) {
            thisTile = tile.id;
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.tileId === thisTile && bat.fuzz >= minFuzz && checkAlienFlyTarget(selectedWeap,bat)) {
                    meleeTile = thisTile-1;
                    if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                        tLogic = targetLogic(bat);
                        if (tLogic >= bestLogic) {
                            bestLogic = tLogic;
                            goodMoves.push(meleeTile);
                        }
                    }
                    meleeTile = thisTile+1;
                    if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                        tLogic = targetLogic(bat);
                        if (tLogic >= bestLogic) {
                            bestLogic = tLogic;
                            goodMoves.push(meleeTile);
                        }
                    }
                    meleeTile = thisTile-mapSize;
                    if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                        tLogic = targetLogic(bat);
                        if (tLogic >= bestLogic) {
                            bestLogic = tLogic;
                            goodMoves.push(meleeTile);
                        }
                    }
                    meleeTile = thisTile+mapSize;
                    if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                        tLogic = targetLogic(bat);
                        if (tLogic >= bestLogic) {
                            bestLogic = tLogic;
                            goodMoves.push(meleeTile);
                        }
                    }
                }
            });
        });
    } else if (selectedWeap.range === 1) {
        let r1Tile;
        zone.forEach(function(tile) {
            thisTile = tile.id;
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.tileId === thisTile && bat.fuzz >= minFuzz && checkAlienFlyTarget(selectedWeap,bat)) {
                    r1Tile = thisTile-mapSize-1;
                    if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                        tLogic = targetLogic(bat);
                        if (tLogic >= bestLogic) {
                            bestLogic = tLogic;
                            goodMoves.push(r1Tile);
                        }
                    }
                    r1Tile = thisTile-mapSize+1;
                    if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                        tLogic = targetLogic(bat);
                        if (tLogic >= bestLogic) {
                            bestLogic = tLogic;
                            goodMoves.push(r1Tile);
                        }
                    }
                    r1Tile = thisTile+mapSize-1;
                    if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                        tLogic = targetLogic(bat);
                        if (tLogic >= bestLogic) {
                            bestLogic = tLogic;
                            goodMoves.push(r1Tile);
                        }
                    }
                    r1Tile = thisTile+mapSize+1;
                    if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                        tLogic = targetLogic(bat);
                        if (tLogic >= bestLogic) {
                            bestLogic = tLogic;
                            goodMoves.push(r1Tile);
                        }
                    }
                }
            });
        });
    }
    if (goodMoves.length >= 1) {
        possibleMoves = goodMoves;
        console.log('ideal move found');
    }
};

function checkAimMoves() {
    // vérifie s'il y a un (ou des) moves qui mène au PDM : remplace possibleMoves
    let goodMoves = [];
    let thisTile;
    let minFuzz = -1;
    let distance;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    if (selectedWeap.range === 0) {
        let meleeTile;
        meleeTile = pointDeMire-1;
        if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
            goodMoves.push(meleeTile);
        }
        meleeTile = pointDeMire+1;
        if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
            goodMoves.push(meleeTile);
        }
        meleeTile = pointDeMire-mapSize;
        if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
            goodMoves.push(meleeTile);
        }
        meleeTile = pointDeMire+mapSize;
        if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
            goodMoves.push(meleeTile);
        }
    } else if (selectedWeap.range === 1) {
        let r1Tile;
        r1Tile = pointDeMire-mapSize-1;
        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
            goodMoves.push(r1Tile);
        }
        r1Tile = pointDeMire-mapSize+1;
        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
            goodMoves.push(r1Tile);
        }
        r1Tile = pointDeMire+mapSize-1;
        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
            goodMoves.push(r1Tile);
        }
        r1Tile = pointDeMire+mapSize+1;
        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
            goodMoves.push(r1Tile);
        }
    } else if (selectedWeap.range >= 2) {
        zone.forEach(function(tile) {
            if (possibleMoves.includes(tile.id) && !goodMoves.includes(tile.id)) {
                distance = calcDistance(tile.id,pointDeMire);
                if (distance <= selectedWeap.range) {
                    goodMoves.push(tile.id);
                }
            }
        });
    }
    if (goodMoves.length >= 1) {
        possibleMoves = goodMoves;
        console.log('PDM ideal move found');
    }
};

function delPossibleMove(delId) {
    // remove id from possible moves
    let pmIndex;
    if (possibleMoves.includes(delId)) {
        pmIndex = possibleMoves.indexOf(delId);
        possibleMoves.splice(pmIndex,1);
    }
};

function moveToPDM() {
    if (selectedBatType.moveCost < 99) {
        console.log('move to PDM');
        let jump = false;
        if (selectedBatType.skills.includes('fouisseur') && rand.rand(1,3) === 1) {
            jump = true;
        }
        if (selectedBatType.skills.includes('fly')) {
            jump = true;
        }
        if (jump) {
            checkPossibleJumps();
            checkAimMoves();
            uncheckBadJumps();
            uncheckShortJumps();
        } else {
            checkPossibleMoves();
            if (selectedBatType.skills.includes('capbld') || selectedBatType.skills.includes('capfar')) {
                checkAimMoves();
            } else {
                checkGoodMoves();
            }
            uncheckBadMoves();
        }
        chooseMove();
        doMove(jump);
        console.log(possibleMoves);
    }
};

function moveOutOfMelee() {
    if (selectedBatType.moveCost < 99) {
        console.log('move out of melee');
        // bouge de 1 tile hors mêlée
        checkPossibleMoves();
        uncheckMeleeMoves();
        oldPossibleMoves = possibleMoves;
        if (possibleMoves.length > 1) {
            uncheckRange1Moves();
        }
        if (possibleMoves.length < 1) {
            possibleMoves = oldPossibleMoves;
        }
        chooseMove();
        doMove(false);
        console.log(possibleMoves);
    }
};

function chooseMove() {
    if (possibleMoves.length > 1) {
        possibleMoves = [_.sample(possibleMoves)];
    }
};

function doMove(jump) {
    if (selectedBatType.moveCost < 99 && possibleMoves.length >= 1) {
        let tileId = possibleMoves[0];
        moveAlienBat(tileId,jump);
    }
};

function moveAlienBat(tileId,jump) {
    // remove unit and redraw old tile
    tileUnselect();
    $('#b'+selectedBat.tileId).empty();
    // remove ap
    let moveCost;
    if (jump) {
        moveCost = selectedBat.apLeft;
    } else {
        if (isDiag(selectedBat.tileId,tileId)) {
            moveCost = calcMoveCost(tileId,true);
        } else {
            moveCost = calcMoveCost(tileId,false);
        }
    }
    let apLost = moveCost;
    selectedBat.apLeft = selectedBat.apLeft-apLost;
    // move
    selectedBat.tileId = tileId;
    tileSelect(selectedBat);
    showAlien(selectedBat);
    // update arrays
    selectedBatArrayUpdate();
};

function anyTargetInRange() {
    let distance;
    let inRange = false;
    let minFuzz = -1;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz >= minFuzz && checkAlienFlyTarget(selectedWeap,bat)) {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance <= selectedWeap.range) {
                inRange = true;
            }
        }
    });
    return inRange;
};

function targetMelee() {
    console.log('targetMelee');
    let distance;
    let inPlace = false;
    let minFuzz = -1;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz >= minFuzz && checkAlienFlyTarget(selectedWeap,bat)) {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance === 0 && inPlace === false) {
                tLogic = targetLogic(bat);
                if (tLogic > bestLogic) {
                    bestLogic = tLogic;
                    targetBat = JSON.parse(JSON.stringify(bat));
                    inPlace = true;
                }
            }
        }
    });
    return inPlace;
};

function targetFarthest() {
    console.log('targetFarthest');
    let distance = 0;
    let lePlusLoin = 0;
    let inPlace = false;
    let minFuzz = -1;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz && checkAlienFlyTarget(selectedWeap,bat)) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance <= selectedWeap.range) {
                    tLogic = targetLogic(bat);
                    if (tLogic > bestLogic) {
                        bestLogic = tLogic;
                        targetBat = JSON.parse(JSON.stringify(bat));
                        inPlace = true;
                    }
                }
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz && checkAlienFlyTarget(selectedWeap,bat)) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance === 0) {
                    tLogic = targetLogic(bat);
                    if (tLogic > bestLogic) {
                        bestLogic = tLogic;
                        targetBat = JSON.parse(JSON.stringify(bat));
                        inPlace = true;
                    }
                }
            }
        });
    }
    return inPlace;
};

function targetClosest() {
    console.log('targetClosest');
    let inPlace = false;
    let distance = 100;
    let lePlusProche = 100;
    let minFuzz = -1;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz && checkAlienFlyTarget(selectedWeap,bat)) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance == selectedWeap.range) {
                    tLogic = targetLogic(bat);
                    if (tLogic > bestLogic) {
                        bestLogic = tLogic;
                        targetBat = JSON.parse(JSON.stringify(bat));
                        inPlace = true;
                    }
                }
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz && checkAlienFlyTarget(selectedWeap,bat)) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance === 0) {
                    tLogic = targetLogic(bat);
                    if (tLogic > bestLogic) {
                        bestLogic = tLogic;
                        targetBat = JSON.parse(JSON.stringify(bat));
                        inPlace = true;
                    }
                }
            }
        });
    }
    return inPlace;
};

function isAlienInMelee(tileId) {
    let distance;
    let alienInMelee = false;
    let minFuzz = -1;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz >= minFuzz && checkAlienFlyTarget(selectedWeap,bat)) {
            distance = calcDistance(tileId,bat.tileId);
            if (distance === 0) {
                alienInMelee = true;
            }
        }
    });
    return alienInMelee;
};

function isCamoBlock() {
    console.log('isCamoBlock?');
    let alienAdjTiles = [];
    alienAdjTiles.push(selectedBat.tileId-1);
    alienAdjTiles.push(selectedBat.tileId+1);
    alienAdjTiles.push(selectedBat.tileId-mapSize);
    alienAdjTiles.push(selectedBat.tileId-mapSize+1);
    alienAdjTiles.push(selectedBat.tileId-mapSize-1);
    alienAdjTiles.push(selectedBat.tileId+mapSize);
    alienAdjTiles.push(selectedBat.tileId+mapSize+1);
    alienAdjTiles.push(selectedBat.tileId+mapSize-1);
    let alienMeleeTiles = [];
    alienMeleeTiles.push(selectedBat.tileId-1);
    alienMeleeTiles.push(selectedBat.tileId+1);
    alienMeleeTiles.push(selectedBat.tileId-mapSize);
    alienMeleeTiles.push(selectedBat.tileId+mapSize);
    console.log(alienAdjTiles);
    let camoBlocks = 0;
    let meleeBlocks = 0;
    let allBlocks = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && alienAdjTiles.includes(bat.tileId)) {
            if (bat.fuzz <= -2) {
                camoBlocks = camoBlocks+1;
                if (alienMeleeTiles.includes(bat.tileId)) {
                    meleeBlocks = meleeBlocks+1;
                }
            }
            allBlocks = allBlocks+1;
        }
    });
    let camoGroup = false;
    let lastCamo = -1;
    let distance;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && alienAdjTiles.includes(bat.tileId) && bat.fuzz <= -2) {
            lastCamo = bat.tileId;
            bataillons.forEach(function(camoBat) {
                if (camoBat.loc === "zone" && alienAdjTiles.includes(camoBat.tileId) && camoBat.fuzz <= -2) {
                    if (lastCamo != camoBat.tileId) {
                        distance = calcDistance(lastCamo,camoBat.tileId);
                        if (distance <= 0) {
                            camoGroup = true;
                        }
                    }
                }
            });
        }
    });
    console.log('camoGroup: '+camoGroup);
    console.log('camoBlocks: '+camoBlocks);
    console.log('meleeBlocks: '+meleeBlocks);
    console.log('allBlocks: '+allBlocks);
    let blocked = false;
    if (camoBlocks >= 2 && meleeBlocks >= 1 && allBlocks >= 3) {
        blocked = true;
    }
    if (camoGroup) {
        blocked = true;
    }
    if (blocked) {
        // CAMOBLOCK!!
        let camoUnblocked = false;
        let shufBats = _.shuffle(bataillons);
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz <= -2 && alienMeleeTiles.includes(bat.tileId) && !camoUnblocked) {
                camoUnblocked = true;
                bat.fuzz = -1;
                console.log('camoUnblock: '+bat.name);
            }
        });
    }
};

function alienBonus() {
    bugROF = 1;
    let batIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            batIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
            batType = alienUnits[batIndex];
            if (batType.skills.includes('bugboost')) {
                bugROF = 1.5;
            }
        }
    });
};

function fearFactor(myBat,blob) {
    let myBatType = getBatType(myBat);
    if (myBatType.skills.includes('fear') || blob) {
        console.log('FEAR');
        let distance;
        let fearChance;
        let batIndex;
        let batType;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                distance = calcDistance(myBat.tileId,bat.tileId);
                if (distance === 0) {
                    // batIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
                    // batType = unitTypes[batIndex];
                    batType = getBatType(bat);
                    if (batType.moveCost < 99) {
                        if (blob) {
                            fearChance = 100;
                        } else {
                            if (batType.skills.includes('berserk') || batType.skills.includes('mutant')) {
                                fearChance = 0;
                            } else {
                                fearChance = Math.round(75-(batType.size*2.5)-(bat.vet*12)+(batType.stealth*2));
                            }
                        }
                        console.log('fearChance='+fearChance);
                        if (rand.rand(1,100) <= fearChance) {
                            getAway(bat,myBat.tileId,blob);
                        } else {
                            console.log('noFear');
                        }
                    }
                }
            }
        });
    }
};

function getAway(bat,fromTileId,blob) {
    console.log('getAway');
    console.log(bat);
    let distFromTile;
    let distFromSelf;
    let getAwayTile = -1;
    let apCost = 0;
    let shufZone = _.shuffle(zone);
    alienOccupiedTileList();
    playerOccupiedTileList();
    shufZone.forEach(function(tile) {
        distFromTile = calcDistance(fromTileId,tile.id);
        distFromSelf = calcDistance(bat.tileId,tile.id);
        if (distFromSelf === 1 && distFromTile >= 1 && !playerOccupiedTiles.includes(tile.id) && !alienOccupiedTiles.includes(tile.id) && getAwayTile < 0) {
            getAwayTile = tile.id;
            apCost = 6;
        }
    });
    if (getAwayTile < 0) {
        shufZone.forEach(function(tile) {
            distFromTile = calcDistance(fromTileId,tile.id);
            distFromSelf = calcDistance(bat.tileId,tile.id);
            if (distFromSelf === 2 && distFromTile >= 1 && !playerOccupiedTiles.includes(tile.id) && !alienOccupiedTiles.includes(tile.id) && getAwayTile < 0) {
                getAwayTile = tile.id;
                apCost = 12;
            }
        });
    }
    if (getAwayTile >= 0) {
        let resHere = showRes(bat.tileId);
        $('#b'+bat.tileId).empty().append(resHere);
        bat.tileId = getAwayTile;
        bat.apLeft = bat.apLeft-apCost;
        tagDelete(bat,'guet');
        tagDelete(bat,'fortif');
        if (bat.tags.includes('camo') && !blob) {
            bat.fuzz = -1;
            tagDelete(bat,'camo');
        }
        showBataillon(bat);
        if (!blob) {
            warning('Répulsion',bat.type+' a pris la fuite...');
        } else {
            warning('Vomissure',bat.type+' a dû fuir pour ne pas être digéré par la vomissure de l\'oeuf.');
        }
    } else {
        if (!blob) {
            let batType = getBatType(bat);
            bat.apLeft = 0-Math.round(batType.ap/4*3);
            tagDelete(bat,'guet');
            tagDelete(bat,'fortif');
            if (bat.tags.includes('camo')) {
                bat.fuzz = -1;
            }
            tagDelete(bat,'camo');
            if (!bat.tags.includes('stun')) {
                bat.tags.push('stun');
            }
            warning('Répulsion',bat.type+' paralysé de peur...');
        } else {
            let batIndex = bataillons.findIndex((obj => obj.id == bat.id));
            bataillons.splice(batIndex,1);
            batDeathEffect(bat,true,'Bataillon digéré',bat.type+' englouti par la vomissure...');
        }
    }
    playerOccupiedTileList();
};
