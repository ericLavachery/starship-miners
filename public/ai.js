function alienMoveLoop() {
    // move map at the end of the alien moves
    console.log('alienMoveLoop');
    $('#report').empty('');
    attAlive = true;
    defAlive = true;
    alienOccupiedTileList();
    playerOccupiedTileList();
    if (selectedBatType.moveCost < 99 && !selectedBat.tags.includes('freeze')) {
        isCamoBlock();
    }
    let alienActif = true;
    if (selectedBatType.skills.includes('healhide') && selectedBat.squadsLeft <= 3 && selectedBat.tags.includes('invisible')) {
        alienActif = false;
        alienTeleport();
    }
    if (alienActif) {
        checkPDM();
        tileUntarget();
        targetBat = {};
        targetBatType = {};
        targetWeap = {};
        fearFactor(selectedBat,false);
        infraDestruction();
        checkPossibleMoves();
        // loop this until no ap or no salvo
        // console.log('!!! Start Loop !!!');
        let iter = 1;
        while (iter <= 20) {
            // console.log('loop '+iter+' || ap:'+selectedBat.apLeft+' salvo:'+selectedBat.salvoLeft);
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
    }
    // console.log('!!! End Loop !!!');
    // si no salvo et reste bcp d'ap : move vers PDM de base (attention: garder le rapport de combat!)
};

function chooseTarget() {
    targetBat = {};
    targetBatType = {};
    targetWeap = {};
    if (!selectedBatType.skills.includes('capbld')) {
        if (selectedBatType.skills.includes('capfar') || selectedBatType.skills.includes('errant')) {
            anyFarTarget(); // change PDM
        } else {
            anyCloseTarget(); // change PDM
        }
    }
    let sheep = 4;
    if (selectedBatType.skills.includes('errant')) {
        sheep = 2;
    }
    if (selectedBatType.skills.includes('anycap') || selectedBatType.skills.includes('capmen') || selectedBatType.skills.includes('capbld') || selectedBat.tags.includes('veil')) {
        sheep = 3;
    }
    if (selectedBat.apLeft < 4) {
        sheep = 100;
    }
    let noThanks = false;
    if (rand.rand(1,sheep) === 1) {
        noThanks = true;
    }
    let inPlace = false;
    let alienInMelee = isAlienInMelee(selectedBat.tileId);
    let range = selectedWeap.range;
    if (noThanks) {
        moveToPDM();
    } else {
        if (range === 0) {
            // range 0
            if (alienInMelee) {
                inPlace = targetMelee();
                if (inPlace) {
                    shootTarget(false,true);
                }
            } else {
                moveToPDM();
                inPlace = targetMelee();
                if (inPlace) {
                    shootTarget(false,true);
                }
            }
        } else if (range === 1) {
            // range 1
            if (alienInMelee) {
                inPlace = targetMelee();
                if (inPlace) {
                    shootTarget(false,false);
                }
            } else {
                inPlace = targetClosest();
                if (inPlace) {
                    shootTarget(false,false);
                } else {
                    moveToPDM();
                    inPlace = targetClosest();
                    if (inPlace) {
                        shootTarget(false,false);
                    }
                }
            }
        } else {
            // range 2+
            if (anyTargetInRange()) {
                if (alienInMelee) {
                    moveOutOfMelee();
                    inPlace = targetFarthest();
                    shootTarget(true,false);
                } else {
                    inPlace = targetFarthest();
                    shootTarget(false,false);
                }
            } else {
                moveToPDM();
                inPlace = targetFarthest();
                if (inPlace) {
                    shootTarget(false,false);
                }
            }
        }
    }
    // console.log('inPlace '+inPlace);
    // console.log(targetBat);
};

function checkAlienFlyTarget(weapon,bat) {
    let batType = getBatType(bat);
    if (weapon.noFly) {
        if (batType.skills.includes('fly') && bat.tags.includes('camo')) {
            return true;
        } else if (batType.skills.includes('fly') && bat.apLeft > -5 && !batType.skills.includes('jetpack')) {
            return false;
        } else {
            if ((batType.skills.includes('jetpack') || bat.eq === 'e-jetpack') && bat.apLeft > 0) {
                return false;
            } else {
                return true;
            }
        }
    } else {
        return true;
    }
};

function shootTarget(recul,melee) {
    // console.log('ap '+selectedBat.apLeft+' cost '+selectedWeap.cost);
    if (selectedWeap.range < 1 || selectedBat.apLeft >= selectedWeap.cost || recul || selectedBatType.skills.includes('fly')) {
        checkTargetBatType();
        // console.log('shoot '+targetBat.type);
        // console.log(targetBat);
        tileTarget(targetBat);
        if (!targetBat.type.includes('Barbelés') || playerInfos.stopBarbs) {
            stopForFight = true;
            isFFW = false;
        }
        if (selectedBatType.name === 'Torches') {
            if (selectedBat.tileId != selectedBat.oldTileId || selectedBat.squadsLeft >= 3) {
                alienSelectBaseWeapon();
            }
        }
        if (selectedBatType.name === 'Wurms' || selectedBatType.name === 'Larves') {
            if (selectedBat.tileId != selectedBat.oldTileId) {
                alienSelectBaseWeapon();
            }
        }
        combat(melee);
        tagDelete(selectedBat,'invisible');
    } else {
        // console.log('Pas assez de PA pour tirer');
    }
};

function checkPDM() {
    // peut-être des targets différents selon les types d'aliens?
    pointDeMire = -1;
    let batType;
    let lePlusProche = 100;
    let shufBats = _.shuffle(bataillons);
    // cherche un cible préférée
    if (selectedBatType.skills.includes('errant')) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= 0 && pointDeMire < 0) {
                batType = getBatType(bat);
                if ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance < 6) {
                        pointDeMire = bat.tileId;
                    }
                }
            }
        });
        if (pointDeMire < 0) {
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz >= 0) {
                    batType = getBatType(bat);
                    if ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly) {
                        distance = calcDistance(selectedBat.tileId,bat.tileId);
                        if (distance < lePlusProche) {
                            pointDeMire = bat.tileId;
                            lePlusProche = distance;
                        }
                    }
                }
            });
        }
    } else if (selectedBatType.skills.includes('anycap') || selectedBat.tags.includes('veil')) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= 0) {
                batType = getBatType(bat);
                if ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly) {
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
                if (batType.cat === 'infantry' && ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly)) {
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
            if (bat.loc === "zone" && bat.fuzz >= 4) {
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
        if (pointDeMire < 0) {
            // se rabat sur une autre cible
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz >= 1) {
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
        }
        if (pointDeMire < 0) {
            // se rabat sur une autre cible
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz == 0) {
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
        }
    }
    if (pointDeMire < 0) {
        pointDeMire = 1830;
    }
    // console.log('PDM: '+pointDeMire);
};

function isSurrounded(bat) {
    let surroundingTiles = 8;
    if (zone[bat.tileId].x === 1) {
        if (zone[bat.tileId].y === 1) {
            surroundingTiles = surroundingTiles-5;
        } else {
            surroundingTiles = surroundingTiles-3;
        }
    } else {
        if (zone[bat.tileId].y === 1) {
            surroundingTiles = surroundingTiles-3;
        }
    }
    let surroundingAliens = 0;
    if (alienOccupiedTiles.includes(bat.tileId+1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId-1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId-mapSize+1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId-mapSize-1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId-mapSize)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId+mapSize+1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId+mapSize-1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId+mapSize)) {
        surroundingAliens++;
    }
    if (surroundingAliens >= surroundingTiles-2) {
        return true;
    } else {
        return false;
    }
};

function targetLogic(bat) {
    let tFuzz = 0;
    let batType = getBatType(bat);
    let modifiedArmor = Math.round(bat.armor*selectedWeap.armors);
    let averageDamage = selectedWeap.power-modifiedArmor;
    let armorPiercing = selectedWeap.armors;
    if (armorPiercing >= 0.75 && armorPiercing <= 1) {
        armorPiercing = 1;
    }
    let twistedArmor = Math.round(bat.armor*armorPiercing);
    let twistedDamage = selectedWeap.power-twistedArmor;
    if (averageDamage >= selectedWeap.power/2) {
        tFuzz = twistedDamage+bat.armor+rand.rand(0,2);
    } else {
        tFuzz = averageDamage;
    }
    return Math.round(tFuzz);
};

function calcMinFuzz() {
    let minFuzz = {};
    minFuzz.bld = 0;
    if (selectedBatType.skills.includes('nez') || selectedBat.tags.includes('nez')) {
        minFuzz.unit = -2;
    } else {
        minFuzz.unit = 0;
    }
    return minFuzz;
}

function anyCloseTarget() {
    newPointDeMire = -1;
    let distance;
    let lePlusProche = 100;
    let minFuzz = calcMinFuzz();
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (checkAlienFlyTarget(selectedWeap,bat)) {
            if (bat.loc === "zone") {
                if (!isSurrounded(bat)) {
                    batType = getBatType(bat);
                    if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
                        if ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly) {
                            distance = calcDistance(selectedBat.tileId,bat.tileId);
                            if (distance <= closeTargetRange) {
                                tLogic = targetLogic(bat);
                                if (tLogic > bestLogic) {
                                    bestLogic = tLogic;
                                    newPointDeMire = bat.tileId;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (newPointDeMire >= 0) {
        pointDeMire = newPointDeMire;
        // console.log('new PDM: '+pointDeMire);
    }
};

function anyFarTarget() {
    newPointDeMire = -1;
    let distance;
    let bestLogic = -99;
    let tLogic;
    let minFuzz = -1;
    let batType;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
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
        // console.log('new PDM: '+pointDeMire);
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
            if (playerOccupiedTiles.includes(tile.id)) {
                batHere = true;
            } else {
                batHere = false;
                if (alienOccupiedTiles.includes(tile.id)) {
                    batHere = true;
                }
            }
            if (!tile.rd && tile.terrain === 'R' && tile.seed < 4 && selectedBatType.maxFlood < 3) {
                batHere = true;
            }
            if (!tile.rd && tile.terrain === 'W' && selectedBatType.maxFlood < 2) {
                batHere = true;
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
    if (selectedBatType.skills.includes('fouisseur') || selectedBatType.skills.includes('sauteur')) {
        if (selectedBatType.skills.includes('errant')) {
            maxDistance = 8;
        } else if (selectedBatType.skills.includes('anycap') || selectedBat.tags.includes('veil')) {
            maxDistance = 6;
        } else {
            if (selectedBatType.skills.includes('sauteur')) {
                maxDistance = 4;
            } else if (larveHIDE) {
                maxDistance = 7;
            } else {
                maxDistance = 5;
            }
        }
    } else {
        maxDistance = Math.round(selectedBat.apLeft/selectedBatType.moveCost/1.2);
    }
    zone.forEach(function(tile) {
        distance = calcDistance(selectedBat.tileId,tile.id);
        if (distance <= maxDistance) {
            if (playerOccupiedTiles.includes(tile.id)) {
                batHere = true;
            } else {
                batHere = false;
                if (alienOccupiedTiles.includes(tile.id)) {
                    batHere = true;
                }
            }
            if (tile.terrain === 'M' || tile.terrain === 'R' || tile.terrain === 'W') {
                if (selectedBatType.skills.includes('fouisseur')) {
                    batHere = true;
                }
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
    if (possibleMoves.length >= 2 && rand.rand(1,3) != 1 && !selectedBatType.skills.includes('hover')) {
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
    // enlève les possibleMoves vers la terre (si amphibie)
    if (possibleMoves.length >= 2 && selectedBatType.skills.includes('hover')) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length >= 2) {
                    if (tile.terrain != 'S' && tile.terrain != 'W' && tile.terrain != 'R') {
                        delPossibleMove(tile.id);
                    }
                }
            }
        });
    }
    // enlève les possibleMoves qui ne rapproche pas du PDM quand l'unité est proche du but
    if (possibleMoves.length >= 2) {
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
    if (possibleMoves.length >= 2 && !selectedBatType.skills.includes('hover')) {
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
    let minFuzz = calcMinFuzz();
    let bestLogic = -99;
    let tLogic;
    let batType;
    let shufBats = _.shuffle(bataillons);
    if (selectedWeap.range === 0) {
        let meleeTile;
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
                    thisTile = bat.tileId;
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
            }
        });
    } else if (selectedWeap.range === 1) {
        let r1Tile;
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
                    thisTile = bat.tileId;
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
            }
        });
    }
    if (goodMoves.length >= 1) {
        possibleMoves = goodMoves;
        // console.log('ideal move found');
    }
};

function checkAimMoves() {
    // vérifie s'il y a un (ou des) moves qui mène au PDM : remplace possibleMoves
    let goodMoves = [];
    let thisTile;
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
        // console.log('PDM ideal move found');
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
        // console.log('move to PDM');
        let jump = false;
        if (selectedBatType.skills.includes('sauteur') && rand.rand(1,3) === 1 && (selectedBat.apLeft >= 4 || selectedBatType.skills.includes('invisible'))) {
            jump = true;
        }
        if (selectedBatType.skills.includes('fouisseur') && rand.rand(1,3) === 1 && (selectedBat.apLeft >= 4 || selectedBatType.skills.includes('invisible'))) {
            let tile = getTile(selectedBat);
            if (tile.terrain != 'M' && tile.terrain != 'R' && tile.terrain != 'W') {
                jump = true;
            }
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
        // console.log(possibleMoves);
    }
};

function moveOutOfMelee() {
    if (selectedBatType.moveCost < 99) {
        // console.log('move out of melee');
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
        // console.log(possibleMoves);
    }
};

function chooseMove() {
    if (possibleMoves.length > 1) {
        possibleMoves = [_.sample(possibleMoves)];
    }
};

function doMove(jump) {
    if (selectedBatType.moveCost < 99 && possibleMoves.length >= 1 && !selectedBat.tags.includes('freeze')) {
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
        if (selectedBatType.skills.includes('fouisseur') && !selectedBatType.skills.includes('errant')) {
            // moveCost = selectedBat.apLeft+8;
            moveCost = selectedBat.apLeft;
            selectedBat.salvoLeft = 0;
        } else {
            moveCost = selectedBat.apLeft-2;
        }
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
    let minFuzz = calcMinFuzz();
    let batType;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
            batType = getBatType(bat);
            if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance <= selectedWeap.range) {
                    inRange = true;
                }
            }
        }
    });
    return inRange;
};

function targetMelee() {
    // console.log('targetMelee');
    let distance;
    let inPlace = false;
    let minFuzz = calcMinFuzz();
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
            batType = getBatType(bat);
            if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
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
        }
    });
    return inPlace;
};

function targetFarthest() {
    // console.log('targetFarthest');
    let distance = 0;
    let lePlusLoin = 0;
    let inPlace = false;
    let minFuzz = calcMinFuzz();
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
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
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
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
            }
        });
    }
    return inPlace;
};

function targetClosest() {
    // console.log('targetClosest');
    let inPlace = false;
    let distance = 100;
    let lePlusProche = 100;
    let minFuzz = calcMinFuzz();
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
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
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
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
            }
        });
    }
    return inPlace;
};

function isAlienInMelee(tileId) {
    let distance;
    let alienInMelee = false;
    let minFuzz = calcMinFuzz();
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
            batType = getBatType(bat);
            if ((bat.fuzz >= minFuzz.unit && batType.cat != 'buildings') || (bat.fuzz >= minFuzz.bld && batType.cat === 'buildings')) {
                distance = calcDistance(tileId,bat.tileId);
                if (distance === 0) {
                    alienInMelee = true;
                }
            }
        }
    });
    return alienInMelee;
};

function isCamoBlock() {
    // console.log('isCamoBlock?');
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
    // console.log(alienAdjTiles);
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
    // console.log('camoGroup: '+camoGroup);
    // console.log('camoBlocks: '+camoBlocks);
    // console.log('meleeBlocks: '+meleeBlocks);
    // console.log('allBlocks: '+allBlocks);
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
        if (!selectedBat.tags.includes('nez')) {
            selectedBat.tags.push('nez');
        }
    }
};

function alienBonus() {
    bugROF = 1;
    spiderRG = false;
    bugSHIELD = false;
    eggSHIELD = false;
    larveHIDE = false;
    let batIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            batIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
            batType = alienUnits[batIndex];
            if (batType.skills.includes('bugboost')) {
                bugROF = 1.5;
            }
            if (batType.skills.includes('spiderrange')) {
                spiderRG = true;
            }
            if (batType.skills.includes('larvehide')) {
                larveHIDE = true;
            }
            if (batType.skills.includes('bugshield')) {
                bugSHIELD = true;
            }
            if (batType.skills.includes('eggshield')) {
                eggSHIELD = true;
            }
        }
    });
};

function fearFactor(myBat,blob) {
    let myBatType = getBatType(myBat);
    if (myBatType.skills.includes('fear') || blob) {
        // console.log('FEAR');
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
                            if (batType.skills.includes('berserk') || batType.skills.includes('mutant') || batType.skills.includes('robot') || batType.skills.includes('nofear') || bat.tags.includes('zombie') || bat.tags.includes('drunk')) {
                                fearChance = 0;
                            } else {
                                fearChance = Math.round(75-(batType.size*2.5)-(bat.vet*12)+(batType.stealth*2));
                            }
                        }
                        // console.log('fearChance='+fearChance);
                        if (rand.rand(1,100) <= fearChance) {
                            getAway(bat,myBat.tileId,blob);
                        } else {
                            // console.log('noFear');
                        }
                    }
                }
            }
        });
    }
};

function infraDestruction() {
    if (selectedBat.apLeft >= 4 && rand.rand(1,2) === 1) {
        let tile = getTile(selectedBat);
        let destroySize = 999;
        if (tile.infra != undefined) {
            if (tile.infra != 'Débris') {
                if (tile.infra === 'Miradors') {
                    destroySize = 10;
                } else if (tile.infra === 'Palissades') {
                    destroySize = 15;
                } else if (tile.infra === 'Remparts') {
                    destroySize = 27;
                } else if (tile.infra === 'Murailles') {
                    destroySize = 38;
                }
            }
        }
        if (tile.rd && (tile.terrain === 'W' || tile.terrain === 'R')) {
            destroySize = 15;
        }
        if (destroySize < 999) {
            let alienSize = Math.round(selectedBatType.size*selectedBat.squadsLeft/selectedBatType.squads*(selectedBat.apLeft+4)/(selectedBat.ap+4));
            if (selectedBatType.skills.includes('destructeur')) {
                alienSize = alienSize+10;
            }
            if (alienSize >= destroySize) {
                let destroyCost = Math.ceil(selectedBat.ap*destroySize/alienSize*2);
                selectedBat.apLeft = selectedBat.apLeft-destroyCost;
                if (tile.rd && (tile.terrain === 'W' || tile.terrain === 'R')) {
                    warning('Destruction',selectedBat.type+' a détruit le Pont');
                    tile.rd = false;
                } else {
                    warning('Destruction',selectedBat.type+' a détruit '+tile.infra);
                    tile.infra = 'Débris';
                }
                // saveMap();
                showMap(zone,false);
                selectedBatArrayUpdate();
            }
        }
    }
};

function getAway(bat,fromTileId,blob) {
    // console.log('getAway');
    // console.log(bat);
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
            bat.apLeft = 0-Math.round(bat.ap/4*3);
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

function alienTeleport() {
    let teleTileId = -1;
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (teleTileId < 0) {
            let distance = calcDistance(tile.id,selectedBat.tileId);
            if (distance <= 6 && distance >= 2) {
                if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                    teleTileId = tile.id;
                }
            }
        }
    });
    if (teleTileId >= 0) {
        moveAlienBat(teleTileId,true);
    }
};
