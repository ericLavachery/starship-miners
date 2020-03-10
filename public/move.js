function clickMove(tileId) {
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    showTileInfos(tileId);
    let ownBatHere = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            ownBatHere = true;
        }
    });
    if (!ownBatHere) {

    } else {

    }
    // return to first tile if left on occupied tile
    // save bataillons.json? or do it only each turn?
    if (isAdjacent(selectedBat.tileId,tileId)) {
        if (selectedBat.apLeft >= 1) {
            if (terrainAccess(selectedBat.id,tileId)) {
                moveSelectedBat(tileId,false);
                moveInfos(selectedBat);
            } else {
                // terrain impraticable
            }
        } else {
            selectMode();
            batUnstack();
            batUnselect();
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

function moveInfos(bat) {
    cursorSwitch('.','grid-item','pointer');
    let titleString;
    let moveCost;
    let myTileX = zone[bat.tileId].x;
    let myTileY = zone[bat.tileId].y;
    zone.forEach(function(tile) {
        $("#"+tile.id).attr("title", "");
        if (tile.x == myTileX+1 || tile.x == myTileX || tile.x == myTileX-1) {
            if (tile.y == myTileY+1 || tile.y == myTileY || tile.y == myTileY-1) {
                if (tile.y == myTileY && tile.x == myTileX) {
                    cursorSwitch('#',tile.id,'pointer');
                } else {
                    if (selectedBat.apLeft >= 1 && terrainAccess(selectedBat.id,tile.id)) {
                        cursorSwitch('#',tile.id,'move');
                    } else {
                        cursorSwitch('#',tile.id,'stop');
                    }
                    if (terrainAccess(selectedBat.id,tile.id)) {
                        moveCost = calcMoveCost(selectedBat.id,tile.id,isDiag(selectedBat.tileId,tile.id));
                        titleString = moveCost+" ap";
                        $("#"+tile.id).attr("title", titleString);
                    }
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

function moveSelectedBat(tileId,free) {
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    // remove unit and redraw old tile
    tileUnselect();
    redrawTile(selectedBat.tileId,false);
    if (!free) {
        // remove ap
        let moveCost;
        if (isDiag(selectedBat.tileId,tileId)) {
            moveCost = calcMoveCost(selectedBat.id,tileId,true);
        } else {
            moveCost = calcMoveCost(selectedBat.id,tileId,false);
        }
        let apLost = about(moveCost,15);
        selectedBat.apLeft = selectedBat.apLeft-apLost;
    }
    selectedBat.tileId = tileId;
    tileSelect(selectedBat);
    showBataillon(selectedBat);
    showBatInfos(selectedBat);
    // update bataillons
    bataillons[batIndex] = selectedBat;
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
        moveSelectedBat(selectedBat.oldTileId,true);
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
    if (unitTypes[unitTypesIndex].maxFlood >= terrainTypes[terIndex].flood && unitTypes[unitTypesIndex].maxScarp >= terrainTypes[terIndex].scarp && unitTypes[unitTypesIndex].maxVeg >= terrainTypes[terIndex].veg) {
        return true;
    } else {
        return false;
    }
};

function calcMoveCost(batId,targetTileId,diag) {
    let batIndex = bataillons.findIndex((obj => obj.id == batId));
    let unitTypesIndex = unitTypes.findIndex((obj => obj.name == bataillons[batIndex].type));
    let terIndex = terrainTypes.findIndex((obj => obj.name == zone[targetTileId].terrain));
    let moveCost = unitTypes[unitTypesIndex].moveCost+terrainTypes[terIndex].mc;
    if (diag) {
        moveCost = Math.round(moveCost*1.42);
    }
    return moveCost;
};

function apLoss(batId,number,sloppy) {
    let apLost = number;
    if (sloppy) {
        apLost = about(number,15);
    }
    return apLost;
};
