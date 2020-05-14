function clickMove(tileId) {
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    showTileInfos(tileId);
    let ownBatHere = false;
    let ownTransHere = false;
    let batTransUnitsLeft;
    let myBatWeight = selectedBatType.size*selectedBatType.squadSize*selectedBatType.squads;
    let batType;
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            ownBatHere = true;
            batType = getBatType(bat);
            if (batType.transMaxSize >= selectedBatType.size) {
                batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                if (myBatWeight <= batTransUnitsLeft) {
                    ownTransHere = true;
                }
            }
        }
    });
    let distance;
    let jump = false;
    let moveOK = false;
    let stackOK = true;
    if (isAdjacent(selectedBat.tileId,tileId)) {
        moveOK = true;
    }
    if (selectedBatType.skills.includes('fly')) {
        jump = true;
        if (!ownTransHere) {
            stackOK = false;
        }
        distance = calcJumpDistance(selectedBat.tileId,tileId);
        if (Math.floor(distance) <= Math.ceil(selectedBat.apLeft/selectedBatType.moveCost)) {
            moveOK = true;
        }
    }
    if (hasShot()) {
        if (!ownTransHere) {
            stackOK = false;
        }
    }
    if (moveOK) {
        if (!stackOK && ownBatHere) {
            warning('Mouvement illégal:','Pas de mouvement par dessus une unité si vous avez déjà attaqué (ou utilisé une habileté).<br>Le dernier mouvement n\'a pas été éxécuté.');
            selectMode();
            batUnstack();
            batUnselect();
        } else {
            let moveLeft = selectedBat.apLeft;
            // Guerrilla
            if (selectedBatType.skills.includes('guerrilla')) {
                moveLeft = selectedBat.apLeft+4;
            }
            if (moveLeft >= 1) {
                if (terrainAccess(selectedBat.id,tileId)) {
                    if (!alienOccupiedTiles.includes(tileId)) {
                        moveSelectedBat(tileId,false,jump);
                        moveInfos(selectedBat,jump);
                    } else {
                        // terrain occupé par un alien
                    }
                } else {
                    // terrain impraticable
                }
            } else {
                selectMode();
                batUnstack();
                batUnselect();
            }
        }
    } else {
        if (selectedBat.tileId === tileId) {
            // re-click sur l'unité active : unselect
            selectMode();
            batUnstack();
            batUnselect();
        } else {
            // terrain non adjacent : unselect
            clickSelect(tileId);
        }
    }
};

function moveInfos(bat,jump) {
    cursorSwitch('.','grid-item','pointer');
    let titleString;
    let moveCost;
    let moveLeft;
    let batType = getBatType(bat);
    let myTileX = zone[bat.tileId].x;
    let myTileY = zone[bat.tileId].y;
    zone.forEach(function(tile) {
        $("#"+tile.id).attr("title", "");
        if (!jump) {
            if (tile.x == myTileX+1 || tile.x == myTileX || tile.x == myTileX-1) {
                if (tile.y == myTileY+1 || tile.y == myTileY || tile.y == myTileY-1) {
                    if (tile.y == myTileY && tile.x == myTileX) {
                        cursorSwitch('#',tile.id,'pointer');
                    } else {
                        moveLeft = selectedBat.apLeft;
                        // Guerrilla
                        if (batType.skills.includes('guerrilla')) {
                            moveLeft = selectedBat.apLeft+4;
                        }
                        if (moveLeft >= 1 && terrainAccess(selectedBat.id,tile.id)) {
                            if (!alienOccupiedTiles.includes(tile.id)) {
                                cursorSwitch('#',tile.id,'move');
                            } else {
                                cursorSwitch('#',tile.id,'pointer');
                            }
                        } else {
                            cursorSwitch('#',tile.id,'stop');
                        }
                        // montre le moveCost
                        if (terrainAccess(selectedBat.id,tile.id)) {
                            moveCost = calcMoveCost(tile.id,isDiag(selectedBat.tileId,tile.id));
                            titleString = moveCost+" ap";
                            $("#"+tile.id).attr("title", titleString);
                        }
                    }
                }
            }
        } else {
            distance = calcJumpDistance(selectedBat.tileId,tile.id);
            if (Math.floor(distance) <= Math.ceil(selectedBat.apLeft/selectedBatType.moveCost)) {
                if (tile.y == myTileY && tile.x == myTileX) {
                    cursorSwitch('#',tile.id,'pointer');
                } else {
                    moveLeft = selectedBat.apLeft;
                    if (moveLeft >= 1) {
                        if (!alienOccupiedTiles.includes(tile.id)) {
                            cursorSwitch('#',tile.id,'move');
                        } else {
                            cursorSwitch('#',tile.id,'pointer');
                        }
                    } else {
                        cursorSwitch('#',tile.id,'stop');
                    }
                    // montre le moveCost
                    let distance = calcJumpDistance(selectedBat.tileId,tile.id);
                    moveCost = Math.round(distance*selectedBatType.moveCost);
                    titleString = moveCost+" ap";
                    $("#"+tile.id).attr("title", titleString);
                }
            }
        }
    });
};

function deleteMoveInfos() {
    // remove move infos
    zone.forEach(function(tile) {
        $("#"+tile.id).attr("title", "");
    });
};

function moveSelectedBat(tileId,free,jump) {
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    // remove unit and redraw old tile
    tileUnselect();
    redrawTile(selectedBat.tileId,false);
    if (!free) {
        // remove ap
        let apLost;
        if (!jump) {
            let moveCost;
            if (isDiag(selectedBat.tileId,tileId)) {
                moveCost = calcMoveCost(tileId,true);
            } else {
                moveCost = calcMoveCost(tileId,false);
            }
            apLost = moveCost;
        } else {
            let distance = calcJumpDistance(selectedBat.tileId,tileId);
            apLost = Math.round(distance*selectedBatType.moveCost);
        }
        selectedBat.apLeft = selectedBat.apLeft-apLost;
    }
    selectedBat.tileId = tileId;
    // remove tags
    if (selectedBat.tags.includes('guet')) {
        tagIndex = selectedBat.tags.indexOf('guet');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBat.tags.includes('fortif')) {
        tagIndex = selectedBat.tags.indexOf('fortif');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBat.tags.includes('camo')) {
        if (selectedBatType.skills.includes('fly') || selectedBatType.cat === 'vehicles') {
            camoOut();
        } else {
            camouflage(0);
        }
    }
    tileSelect(selectedBat);
    showBataillon(selectedBat);
    showBatInfos(selectedBat);
    // update arrays
    selectedBatArrayUpdate();
};

function calcJumpDistance(myTileIndex,thatTileIndex) {
    let jumpDistance = 0;
    let batOff = batOffsets(thatTileIndex);
    if (batOff[0] > batOff[1]) {
        jumpDistance = batOff[0]-batOff[1]+(batOff[1]*1.42);
    } else {
        jumpDistance = batOff[1]-batOff[0]+(batOff[0]*1.42);
    }
    return jumpDistance;
};

function batOffsets(tileId) {
    // offsets x et y entre selectedBat et tileId
    theTileX = zone[tileId].x;
    theTileY = zone[tileId].y;
    batTileX = zone[selectedBat.tileId].x;
    batTileY = zone[selectedBat.tileId].y;
    xOff = Math.abs(batTileX-theTileX);
    yOff = Math.abs(batTileY-theTileY);
    return [xOff,yOff];
};

function batUnstack() {
    // return selectedBat to start position if stacked on another unit
    let stack = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === selectedBat.tileId && bat.loc === "zone" && bat.id != selectedBat.id) {
            stack = true;
        }
    });
    if (stack) {
        let unitIndex = unitTypes.findIndex((obj => obj.id == selectedBat.typeId));
        let selectedUnitType = unitTypes[unitIndex];
        if (selectedBat.salvoLeft < selectedUnitType.maxSalvo) {
            // le bataillon a tiré ce tour ci : pénalité
            selectedBat.apLeft = 0-selectedUnitType.ap;
        } else {
            // le bataillon n'a pas tiré ce tour ci : regagne ses AP
            selectedBat.apLeft = selectedBat.oldapLeft;
        }
        moveSelectedBat(selectedBat.oldTileId,true,false);
        console.log('unstack');
        warning('Mouvement illégal:','Vous ne pouvez pas rester sur la même case qu\'une autre unité.<br>Les mouvements de ce bataillon ont été annulés.');
    }
};

function isStacked() {
    let stack = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === selectedBat.tileId && bat.loc === "zone" && bat.id != selectedBat.id) {
            stack = true;
        }
    });
    return stack;
};

function hasShot() {
    if (selectedBat.salvoLeft >= selectedBatType.maxSalvo) {
        return false;
    } else {
        return true;
    }
};

function isAdjacent(myTileIndex,thatTileIndex) {
    // on sm maps, tileId = tileIndex
    let myTileX = zone[myTileIndex].x;
    let myTileY = zone[myTileIndex].y;
    let thatTileX = zone[thatTileIndex].x;
    let thatTileY = zone[thatTileIndex].y;
    if (thatTileX == myTileX && thatTileY == myTileY) {
        return false;
    } else {
        if (thatTileX == myTileX+1 || thatTileX == myTileX || thatTileX == myTileX-1) {
            if (thatTileY == myTileY+1 || thatTileY == myTileY || thatTileY == myTileY-1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

function isDiag(myTileIndex,thatTileIndex) {
    let diag = false;
    let myTileX = zone[myTileIndex].x;
    let myTileY = zone[myTileIndex].y;
    let thatTileX = zone[thatTileIndex].x;
    let thatTileY = zone[thatTileIndex].y;
    let tot = 0;
    if (thatTileX == myTileX+1 || thatTileX == myTileX-1) {
        tot = tot+1;
    }
    if (thatTileY == myTileY+1 || thatTileY == myTileY-1) {
        tot = tot+1;
    }
    if (tot >= 2) {
        diag = true;
    }
    return diag;
};

function terrainAccess(batId,targetTileId) {
    let batIndex = bataillons.findIndex((obj => obj.id == batId));
    let unitTypesIndex = unitTypes.findIndex((obj => obj.name == bataillons[batIndex].type));
    let terIndex = terrainTypes.findIndex((obj => obj.name == zone[targetTileId].terrain));
    let terFlood = terrainTypes[terIndex].flood;
    if (terFlood === 3 && zone[targetTileId].seed >= 4) {
        terFlood = 1;
    }
    if (unitTypes[unitTypesIndex].maxFlood >= terFlood && unitTypes[unitTypesIndex].maxScarp >= terrainTypes[terIndex].scarp && unitTypes[unitTypesIndex].maxVeg >= terrainTypes[terIndex].veg) {
        return true;
    } else {
        return false;
    }
};

function calcMoveCost(targetTileId,diag) {
    let terIndex = terrainTypes.findIndex((obj => obj.name == zone[targetTileId].terrain));
    let moveCost;
    if (selectedBat.team == 'aliens' && !selectedBatType.skills.includes('hover')) {
        moveCost = selectedBatType.moveCost+terrainTypes[terIndex].alienmc;
    } else if (selectedBatType.skills.includes('ranger')) {
        moveCost = selectedBatType.moveCost+terrainTypes[terIndex].rangermc;
    } else if (selectedBatType.skills.includes('hover')) {
        moveCost = selectedBatType.moveCost+terrainTypes[terIndex].hovermc;
    } else {
        moveCost = selectedBatType.moveCost+terrainTypes[terIndex].mc;
    }
    if (selectedBat.tags.includes('camo')) {
        moveCost = moveCost+0.8;
    }
    if (diag) {
        moveCost = moveCost*1.42;
        if (moveCost == 1) {
            moveCost = 2;
        }
    }
    return Math.round(moveCost);
};

function apLoss(batId,number,sloppy) {
    let apLost = number;
    if (sloppy) {
        apLost = about(number,15);
    }
    return apLost;
};
