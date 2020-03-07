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
    // verify maxFlood etc...
    // system for passing over unit
    // problem with ap loss (removed when clicked?)
    // save bataillons.json? or do it only each turn?
    if (isAdjacent(selectedBat.tileId,tileId)) {
        if (selectedBat.apLeft >= 1) {
            tileUnselect();
            hideBataillon(selectedBat);
            // remove ap
            let moveCost;
            if (isDiag(selectedBat.tileId,tileId)) {
                moveCost = calcMoveCost(selectedBat.id,tileId,true);
            } else {
                moveCost = calcMoveCost(selectedBat.id,tileId,false);
            }
            console.log(moveCost);
            let apLost = about(moveCost,15);
            console.log(apLost);
            selectedBat.apLeft = selectedBat.apLeft-apLost;
            bataillons[batIndex].apLeft = bataillons[batIndex].apLeft-apLost;
            // move bat
            selectedBat.tileId = tileId;
            bataillons[batIndex].tileId = tileId;
            tileSelect(selectedBat);
            showBataillon(selectedBat);
        } else {
            selectMode();
            batUnselect();
        }
        // console.log('adjacent');
    } else {
        clickSelect(tileId);
    }
    // console.log(mode);
};

function isAdjacent(myTileIndex,thatTileIndex) {
    // on sm maps, tileId = tileIndex
    let myTileX = zone[myTileIndex].x;
    let myTileY = zone[myTileIndex].y;
    let thatTileX = zone[thatTileIndex].x;
    let thatTileY = zone[thatTileIndex].y;
    if (thatTileX == myTileX+1 || thatTileX == myTileX || thatTileX == myTileX-1) {
        if (thatTileY == myTileY+1 || thatTileY == myTileY || thatTileY == myTileY-1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
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
