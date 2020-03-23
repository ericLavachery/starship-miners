function alienTurn() {
    createAlienList();
    // show the alien NEXT button
    // -> nextAlien
};

function alienMoveLoop() {
    // move map at the end of the alien moves
    // show attaqued bat
    checkPossibleMoves();
    chooseTarget();
};

function shootTarget() {
    console.log('shoot '+targetBat.type);
};

function chooseTarget() {
    // peut-être des targets différents selon les types d'aliens?
    targetBat = {};
    targetBatType = {};
    targetWeap = {};
    let inPlace = false;
    let alienInMelee = isAlienInMelee(selectedBat.tileId);
    let range = selectedWeap.range;
    if (range === 0) {
        // range 0
        if (alienInMelee) {
            inPlace = targetMelee();
            shootTarget();
        } else {
            moveToMelee();
            inPlace = targetMelee();
            if (inPlace) {
                shootTarget();
            }
        }
    } else if (range === 1) {
        // range 1
        if (alienInMelee) {
            inPlace = targetMelee();
            shootTarget();
        } else {
            inPlace = targetClosest();
            if (inPlace) {
                shootTarget();
            } else {
                moveToRange1();
                inPlace = targetClosest();
                if (inPlace) {
                    shootTarget();
                }
            }
        }
    } else {
        // range 2+
        if (anyTargetInRange()) {
            if (alienInMelee) {
                moveOutOfMelee();
                inPlace = targetFarthest();
                shootTarget();
            } else {
                inPlace = targetFarthest();
                shootTarget();
            }
        } else {
            moveToIdealRange();
            inPlace = targetFarthest();
            if (inPlace) {
                shootTarget();
            }
        }
    }
    console.log('inPlace '+inPlace);
    console.log(targetBat);
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
    let pmIndex;
    zone.forEach(function(tile) {
        if (isAdjacent(selectedBat.tileId,tile.id)) {
            bataillons.forEach(function(bat) {
                if (bat.loc === "zone" && bat.tileId === tile.id) {
                    thisTile = tile.id;
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
        }
    });
};

function uncheckRange1Moves() {
    // remove moves to range 1 from possible moves
    let thisTile;
    let r1Tile;
    let pmIndex;
    zone.forEach(function(tile) {
        if (isAdjacent(selectedBat.tileId,tile.id)) {
            bataillons.forEach(function(bat) {
                if (bat.loc === "zone" && bat.tileId === tile.id) {
                    thisTile = tile.id;
                    meleeTile = thisTile-mapSize-1;
                    delPossibleMove(meleeTile);
                    meleeTile = thisTile-mapSize+1;
                    delPossibleMove(meleeTile);
                    meleeTile = thisTile+mapSize-1;
                    delPossibleMove(meleeTile);
                    meleeTile = thisTile+mapSize+1;
                    delPossibleMove(meleeTile);
                }
            });
        }
    });
};

function delPossibleMove(delId) {
    // remove id from possible moves
    if (possibleMoves.includes(delId)) {
        pmIndex = possibleMoves.indexOf(delId);
        possibleMoves.splice(pmIndex,1);
    }
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
    console.log(possibleMoves);
};

function moveToIdealRange() {
    console.log('move to ideal range');
    // le plus loin possible sans être en mêlée
};

function moveToRange1() {
    console.log('move to range 1');
};

function moveToMelee() {
    console.log('move to melee');
};

function anyTargetInRange() {
    let distance;
    let inRange = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance <= selectedWeap.range) {
                inRange = true;
            }
        }
    });
    return inRange;
};

function targetMelee() {
    let distance;
    let inPlace = false;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance === 0) {
                targetBat = JSON.parse(JSON.stringify(bat));
                inPlace = true;
            }
        }
    });
    return inPlace;
};

function targetFarthest() {
    let distance = 0;
    let lePlusLoin = 0;
    let inPlace = false;
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone") {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance <= selectedWeap.range) {
                    if (lePlusLoin > distance) {
                        lePlusLoin = distance;
                        targetBat = JSON.parse(JSON.stringify(bat));
                        inPlace = true;
                    }
                }
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone") {
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
    let inPlace = false;
    let distance = 100;
    let lePlusProche = 100;
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone") {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance == selectedWeap.range) {
                    targetBat = JSON.parse(JSON.stringify(bat));
                    inPlace = true;
                }
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone") {
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
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(tileId,bat.tileId);
            if (distance === 0) {
                alienInMelee = true;
            }
        }
    });
    return alienInMelee;
};

function createAlienList() {
    let allAlienList = aliens.slice();
    let zoneAlienList = _.filter(allAlienList, function(bat) {
        return (bat.loc == 'zone' && bat.apLeft >= 1);
    });
    alienList = _.sortBy(_.sortBy(_.sortBy(zoneAlienList,'id'),'typeId'),'range');
    commandes();
    console.log(alienList);
};

function nextAlien() {
    // activated by click
    if (Object.keys(selectedBat).length >= 1) {
        alienList.shift();
    }
    if (alienList.length >= 1) {
        batSelect(alienList[0]);
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
        selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
        console.log('----------------------');
        console.log(alienList);
        console.log(selectedBat);
        alienMoveLoop();
    } else {
        batUnselect();
        // terminer le tour alien (et enregistrement)
        nextTurnEnd();
    }
};
