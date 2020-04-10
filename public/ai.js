function alienTurn() {
    $('#report').empty('');
    createAlienList();
    // show the alien NEXT button
    // -> nextAlien
};

function alienMoveLoop() {
    // move map at the end of the alien moves
    console.log('alienMoveLoop');
    $('#report').empty('');
    attAlive = true;
    defAlive = true;
    isCamoBlock();
    checkPDM();
    tileUntarget();
    targetBat = {};
    targetBatType = {};
    targetWeap = {};
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

function shootTarget(recul) {
    console.log('ap '+selectedBat.apLeft+' cost '+selectedWeap.cost);
    if (selectedWeap.range < 1 || selectedBat.apLeft >= selectedWeap.cost || recul || selectedBatType.skills.includes('fly')) {
        checkTargetBatType();
        console.log('shoot '+targetBat.type);
        console.log(targetBat);
        tileTarget(targetBat);
        combat();
    } else {
        console.log('Pas assez de PA pour tirer');
    }
};

function checkPDM() {
    // peut-être des targets différents selon les types d'aliens?
    pointDeMire = -1;
    let lePlusProche = 100;
    let shufBats = _.shuffle(bataillons);
    // cherche un cible préférée
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz >= 2) {
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
            if (bat.loc === "zone" && bat.fuzz == 1) {
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
    if (pointDeMire < 0) {
        pointDeMire = 1830;
    }
    console.log('PDM: '+pointDeMire);
};

function anyCloseTarget() {
    newPointDeMire = -1;
    let distance;
    let lePlusProche = 100;
    let minFuzz = 0;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance <= closeTargetRange) {
                if (distance < lePlusProche) {
                    lePlusProche = distance;
                    newPointDeMire = bat.tileId;
                }
            }
        }
    });
    if (newPointDeMire > 0) {
        pointDeMire = newPointDeMire;
        console.log('new PDM: '+pointDeMire);
    }
};

function anyFarTarget() {
    newPointDeMire = -1;
    let distance;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz >= -1) {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance <= 10) {
                newPointDeMire = bat.tileId;
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
    // enlève les possibleMoves qui éloignent du PDM
    if (possibleMoves.length > 1) {
        zone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length > 1) {
                    tileOff = pdmOffsets(tile.id);
                    if (alienOff[0] < tileOff[0] || alienOff[1] < tileOff[1]) {
                        delPossibleMove(tile.id);
                    }
                }
            }
        });
    }
    // enlève les possibleMoves vers l'eau
    if (possibleMoves.length > 1) {
        zone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length > 1) {
                    if (tile.terrain == 'S' || tile.terrain == 'W' || tile.terrain == 'R') {
                        delPossibleMove(tile.id);
                    }
                }
            }
        });
    }
    // enlève les possibleMoves qui ne rapproche pas du PDM quand l'unité est proche du but
    if (possibleMoves.length > 1) {
        zone.forEach(function(tile) {
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

function checkGoodMoves() {
    // vérifie s'il y a un (ou des) moves parfaits et si oui : remplace possibleMoves
    let goodMoves = [];
    let thisTile;
    let minFuzz = -1;
    if (selectedBatType.skills.includes('nez')) {
        minFuzz = -2;
    }
    if (selectedWeap.range === 0) {
        let meleeTile;
        zone.forEach(function(tile) {
            thisTile = tile.id;
            bataillons.forEach(function(bat) {
                if (bat.loc === "zone" && bat.tileId === thisTile && bat.fuzz >= minFuzz) {
                    meleeTile = thisTile-1;
                    if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                        goodMoves.push(meleeTile);
                    }
                    meleeTile = thisTile+1;
                    if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                        goodMoves.push(meleeTile);
                    }
                    meleeTile = thisTile-mapSize;
                    if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                        goodMoves.push(meleeTile);
                    }
                    meleeTile = thisTile+mapSize;
                    if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                        goodMoves.push(meleeTile);
                    }
                }
            });
        });
    } else if (selectedWeap.range === 1) {
        let r1Tile;
        zone.forEach(function(tile) {
            thisTile = tile.id;
            bataillons.forEach(function(bat) {
                if (bat.loc === "zone" && bat.tileId === thisTile && bat.fuzz >= minFuzz) {
                    r1Tile = thisTile-mapSize-1;
                    if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                        goodMoves.push(r1Tile);
                    }
                    r1Tile = thisTile-mapSize+1;
                    if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                        goodMoves.push(r1Tile);
                    }
                    r1Tile = thisTile+mapSize-1;
                    if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                        goodMoves.push(r1Tile);
                    }
                    r1Tile = thisTile+mapSize+1;
                    if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                        goodMoves.push(r1Tile);
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

function delPossibleMove(delId) {
    // remove id from possible moves
    let pmIndex;
    if (possibleMoves.includes(delId)) {
        pmIndex = possibleMoves.indexOf(delId);
        possibleMoves.splice(pmIndex,1);
    }
};

function moveToPDM() {
    console.log('move to PDM');
    checkPossibleMoves();
    checkGoodMoves();
    uncheckBadMoves();
    chooseMove();
    doMove();
    console.log(possibleMoves);
};

function moveOutOfMelee() {
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
    doMove();
    console.log(possibleMoves);
};

function chooseMove() {
    if (possibleMoves.length > 1) {
        possibleMoves = [_.sample(possibleMoves)];
    }
};

function doMove() {
    let tileId = possibleMoves[0];
    moveAlienBat(tileId);
};

function moveAlienBat(tileId) {
    // remove unit and redraw old tile
    tileUnselect();
    $('#b'+selectedBat.tileId).empty();
    // remove ap
    let moveCost;
    if (isDiag(selectedBat.tileId,tileId)) {
        moveCost = calcMoveCost(tileId,true);
    } else {
        moveCost = calcMoveCost(tileId,false);
    }
    let apLost = about(moveCost,15);
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
        if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
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
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance === 0 && inPlace === false) {
                targetBat = JSON.parse(JSON.stringify(bat));
                inPlace = true;
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
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance <= selectedWeap.range) {
                    if (lePlusLoin < distance) {
                        lePlusLoin = distance;
                        targetBat = JSON.parse(JSON.stringify(bat));
                        inPlace = true;
                    }
                }
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance === 0) {
                    targetBat = JSON.parse(JSON.stringify(bat));
                    inPlace = true;
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
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance == selectedWeap.range) {
                    targetBat = JSON.parse(JSON.stringify(bat));
                    inPlace = true;
                }
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance === 0) {
                    targetBat = JSON.parse(JSON.stringify(bat));
                    inPlace = true;
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
        if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
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
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.fuzz <= -2 && alienAdjTiles.includes(bat.tileId)) {
            camoBlocks = camoBlocks+1;
            if (alienMeleeTiles.includes(bat.tileId)) {
                meleeBlocks = meleeBlocks+1;
            }
        }
    });
    if (camoBlocks >= 2 && meleeBlocks >= 1) {
        // CAMOBLOCK!!
        let camoUnblocked = false;
        let shufBats = _.shuffle(bataillons);
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz <= -2 && alienMeleeTiles.includes(bat.tileId) && !camoUnblocked) {
                camoUnblocked = true;
                bat.fuzz = -1;
                console.log('CamoUnblock: '+bat.name);
            }
        });
    }
};

function createAlienList() {
    let allAlienList = aliens.slice();
    let zoneAlienList = _.filter(allAlienList, function(bat) {
        return (bat.loc == 'zone' && bat.apLeft >= 1);
    });
    alienList = _.sortBy(zoneAlienList,'id');
    commandes();
    // console.log(alienList);
};

function nextAlien() {
    // activated by click
    if (Object.keys(selectedBat).length >= 1) {
        let batIndex = alienList.findIndex((obj => obj.id == selectedBat.id));
        alienList.splice(batIndex,1);
    }
    if (alienList.length >= 1) {
        batSelect(alienList[0]);
        showEnemyBatInfos(selectedBat);
        showTileInfos(selectedBat.tileId);
        tileUntarget();
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
        selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
        console.log('----------------------');
        console.log(alienList);
        console.log('selectedBat :');
        console.log(selectedBat);
        closeTargetRange = rand.rand(1,closeTargetRangeDice)+rand.rand(1,closeTargetRangeDice);
        alienMoveLoop();
    } else {
        batUnselect();
        // terminer le tour alien (et enregistrement)
        nextTurnEnd();
    }
};
