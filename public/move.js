function clickMove(tileId) {
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    showTileInfos(tileId);
    let ownBatHere = false;
    let ownTransHere = false;
    let batTransUnitsLeft;
    let batType;
    let myBatWeight = calcVolume(selectedBat,selectedBatType);
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
    if (selectedBatType.skills.includes('fly') || selectedBat.eq === 'e-jetpack') {
        jump = true;
        if (!ownTransHere) {
            stackOK = false;
        }
        distance = calcJumpDistance(selectedBat.tileId,tileId);
        let jmc = selectedBatType.moveCost;
        if (selectedBat.eq === 'e-jetpack') {
            jmc = 2;
        }
        if (Math.floor(distance) <= Math.ceil(selectedBat.apLeft/jmc)) {
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
            if (moveLeft > 0) {
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
                        if (moveLeft > 0 && terrainAccess(selectedBat.id,tile.id)) {
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
                            titleString = Math.round(moveCost)+" ap";
                            $("#"+tile.id).attr("title", titleString);
                        }
                    }
                }
            }
        } else {
            distance = calcJumpDistance(selectedBat.tileId,tile.id);
            let jmc = selectedBatType.moveCost;
            if (selectedBat.eq === 'e-jetpack') {
                jmc = 2;
            }
            if (Math.floor(distance) <= Math.ceil(selectedBat.apLeft/jmc)) {
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
                    moveCost = Math.round(distance*jmc);
                    titleString = Math.round(moveCost)+" ap";
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
    // play sound
    if (selectedBatType.cat != 'alien') {
        // playMove(true);
    }
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    // remove unit and redraw old tile
    tileUnselect();
    redrawTile(selectedBat.tileId,false);
    if (!free && !playerInfos.onShip) {
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
            let jmc = selectedBatType.moveCost;
            if (selectedBat.eq === 'e-jetpack') {
                jmc = 2;
            }
            apLost = Math.round(distance*jmc);
        }
        selectedBat.apLeft = selectedBat.apLeft-apLost;
    }
    selectedBat.tileId = tileId;
    // remove tags
    if (selectedBat.tags.includes('blub')) {
        let terrain = getTerrainById(tileId);
        if (terrain.name != 'W' && terrain.name != 'R') {
            tagIndex = selectedBat.tags.indexOf('blub');
            selectedBat.tags.splice(tagIndex,1);
        }
    }
    if (selectedBat.tags.includes('mining')) {
        tagIndex = selectedBat.tags.indexOf('mining');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBat.tags.includes('noemb')) {
        tagIndex = selectedBat.tags.indexOf('noemb');
        selectedBat.tags.splice(tagIndex,1);
        tagIndex = selectedBat.tags.indexOf('noemb');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBat.tags.includes('construction')) {
        tagIndex = selectedBat.tags.indexOf('construction');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBatType.skills.includes('extraction')) {
        selectedBat.extracted = [];
    }
    if (selectedBat.tags.includes('guet')) {
        tagIndex = selectedBat.tags.indexOf('guet');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBat.tags.includes('fortif')) {
        tagIndex = selectedBat.tags.indexOf('fortif');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBat.tags.includes('camo') || selectedBat.fuzz <= -2) {
        if (selectedBatType.skills.includes('fly') || (selectedBatType.cat === 'vehicles' && !selectedBatType.skills.includes('emoteur') && !selectedBatType.skills.includes('robot')) || selectedBatType.skills.includes('moto') || selectedBatType.skills.includes('maycamo') || !selectedBatType.skills.includes('camo') || selectedBat.eq === 'e-jetpack') {
            camoOut();
        } else {
            camouflage(0);
        }
    }
    if (zone[0].dark && activeTurn === 'player') {
        undarkAround(selectedBat,false);
    }
    tileSelect(selectedBat);
    showBataillon(selectedBat);
    showBatInfos(selectedBat);
    // update arrays
    selectedBatArrayUpdate();
    if (activeTurn === 'player') {
        if (playerInfos.follow) {
            centerMap();
        } else if (isMapViewBorder(tileId)) {
            centerMap();
        } else if (zone[0].dark) {
            showMap(zone,true);
        }
    }
};

function isMapViewBorder(tileId) {
    let border = false
    let minX = xOffset+1;
    let maxX = xOffset+numVTiles;
    let minY = yOffset+1;
    let maxY = yOffset+numHTiles;
    let tile = getTileById(tileId);
    if (tile.x <= minX || tile.x >= maxX || tile.y <= minY || tile.y >= maxY) {
        border = true;
    }
    return border;
}

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
    let ownTransHere = false;
    let transId = -1;
    let myBatWeight = calcVolume(selectedBat,selectedBatType);
    bataillons.forEach(function(bat) {
        if (bat.tileId === selectedBat.tileId && bat.loc === "zone" && bat.id != selectedBat.id) {
            stack = true;
            let batType = getBatType(bat);
            if (batType.transMaxSize >= selectedBatType.size) {
                let batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                if (myBatWeight <= batTransUnitsLeft) {
                    ownTransHere = true;
                    transId = bat.id;
                }
            }
        }
    });
    if (stack) {
        if (ownTransHere) {
            // embarquement(transId,false);
        } else {
            if (selectedBat.salvoLeft < selectedBatType.maxSalvo) {
                // le bataillon a tiré ce tour ci : pénalité
                if (!playerInfos.onShip) {
                    selectedBat.apLeft = 0-selectedUnit.ap;
                }
            } else {
                // le bataillon n'a pas tiré ce tour ci : regagne ses AP
                selectedBat.apLeft = selectedBat.oldapLeft;
            }
            moveSelectedBat(selectedBat.oldTileId,true,false);
            console.log('unstack');
            warning('Mouvement illégal:','Vous ne pouvez pas rester sur la même case qu\'une autre unité.<br>Les mouvements de ce bataillon ont été annulés.');
        }
    }
};

function isStacked() {
    let stack = false;
    if (!inSoute) {
        bataillons.forEach(function(bat) {
            if (bat.tileId === selectedBat.tileId && bat.loc === "zone" && bat.id != selectedBat.id) {
                stack = true;
            }
        });
    }
    return stack;
};

function hasShot() {
    let action = false;
    if (selectedBatType.maxSalvo > selectedBat.salvoLeft) {
        action = true;
    }
    if (selectedBat.tags.includes('action')) {
        action = true;
    }
    return action;
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
    let access = false;
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    let terrain = getTerrainById(targetTileId);
    let terFlood = terrain.flood;
    if (terFlood === 3 && zone[targetTileId].seed >= 4) {
        terFlood = 0;
    }
    if (zone[targetTileId].rd) {
        access = true;
    }
    let batMaxFlood = batType.maxFlood;
    let batMaxScarp = batType.maxScarp;
    let batMaxVeg = batType.maxVeg;
    if (batMaxFlood === 0 && (bat.eq === 'chenilles' || bat.logeq === 'chenilles')) {
        batMaxFlood = 1;
    }
    if (batMaxScarp < 2 && (bat.eq === 'chenilles' || bat.logeq === 'chenilles')) {
        batMaxScarp = 2;
    }
    if (batMaxFlood >= terFlood && batMaxScarp >= terrain.scarp && batMaxVeg >= terrain.veg) {
        access = true;
    }
    if (bat.eq === 'snorkel' || bat.logeq === 'snorkel') {
        if (terFlood >= 2) {
            access = true;
        }
    }
    return access;
};

function calcMoveCost(targetTileId,diag) {
    let tile = getTileById(targetTileId);
    let terIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terIndex];
    let baseMoveCost = selectedBatType.moveCost;
    if (selectedBat.eq === 'kit-garde' || selectedBat.eq === 'kit-sentinelle') {
        baseMoveCost = 4;
    }
    if (selectedBat.eq === 'kit-artilleur' || selectedBat.eq === 'kit-guetteur') {
        baseMoveCost = 5;
    }
    if (selectedBat.eq === 'kit-pompiste') {
        baseMoveCost = 4;
    }
    if (selectedBat.eq === 'w2-canon') {
        baseMoveCost = 9;
    }
    let moveCost;
    if (tile.rd && !selectedBatType.skills.includes('hover')) {
        moveCost = baseMoveCost+terrain.roadmc;
        if (selectedBatType.skills.includes('ranger') || selectedBat.eq === 'kit-sentinelle' || selectedBat.eq === 'e-ranger' || selectedBat.logeq === 'e-ranger' || selectedBat.eq === 'crimekitch' || selectedBat.eq === 'crimekitgi' || selectedBat.eq === 'crimekitto') {
            if (terrain.roadmc > terrain.rangermc) {
                if (terrain.rangermc >= 2) {
                    moveCost = baseMoveCost+terrain.rangermc-0.5;
                } else {
                    moveCost = baseMoveCost+terrain.rangermc;
                }
            }
        }
        if (baseMoveCost >= 4 && selectedBat.team != 'aliens') {
            moveCost = moveCost-((baseMoveCost-3)/2);
        }
        if (moveCost === 1) {
            moveCost = 1.5;
        }
    } else if (selectedBat.team == 'aliens' && !selectedBatType.skills.includes('hover') && !selectedBatType.skills.includes('okwater')) {
        moveCost = baseMoveCost+terrain.alienmc;
    } else if (selectedBatType.skills.includes('okwater')) {
        moveCost = baseMoveCost+terrain.larvemc;
    } else if (selectedBatType.skills.includes('ranger') || selectedBat.eq === 'kit-sentinelle' || selectedBat.eq === 'e-ranger' || selectedBat.logeq === 'e-ranger' || selectedBat.eq === 'crimekitch' || selectedBat.eq === 'crimekitgi' || selectedBat.eq === 'crimekitto' || (selectedBat.eq === 'chenilles' && selectedBatType.maxFlood >= 1 && selectedBatType.maxScarp >= 2) || (selectedBat.eq === 'chenilles' && selectedBatType.maxFlood >= 1 && terrain.name === 'S') || (selectedBat.eq === 'chenilles' && selectedBatType.maxScarp >= 2 && terrain.name === 'H') || (selectedBat.eq === 'chenilles' && terrain.name === 'B') || (selectedBat.logeq === 'chenilles' && selectedBatType.maxFlood >= 1 && selectedBatType.maxScarp >= 2) || (selectedBat.logeq === 'chenilles' && selectedBatType.maxFlood >= 1 && terrain.name === 'S') || (selectedBat.logeq === 'chenilles' && selectedBatType.maxScarp >= 2 && terrain.name === 'H') || (selectedBat.logeq === 'chenilles' && terrain.name === 'B')) {
        moveCost = baseMoveCost+terrain.rangermc;
    } else if (selectedBatType.skills.includes('hover')) {
        moveCost = baseMoveCost+terrain.hovermc;
    } else if (selectedBatType.skills.includes('hardmove')) {
        moveCost = baseMoveCost+terrain.hardmc;
    } else if (selectedBatType.skills.includes('hscarpmove')) {
        moveCost = baseMoveCost+terrain.hscarpmc;
    } else {
        moveCost = baseMoveCost+terrain.mc;
    }
    if (selectedBat.eq === 'snorkel' || selectedBat.logeq === 'snorkel') {
        if (terrain.flood > selectedBatType.maxFlood) {
            moveCost = moveCost+4;
        }
    }
    if (selectedBat.tags.includes('camo')) {
        moveCost = moveCost+0.8;
    }
    if (tile.ruins) {
        moveCost = moveCost+1;
    }
    if (diag) {
        moveCost = moveCost*1.42;
    }
    moveCost = moveCost.toFixedNumber(1);
    return moveCost;
};

function apLoss(batId,number,sloppy) {
    let apLost = number;
    if (sloppy) {
        apLost = about(number,15);
    }
    return apLost;
};

function moveInsideBats(transBat) {
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId === transBat.id) {
            bat.tileId = transBat.tileId;
            bat.oldTileId = transBat.tileId;
        }
    });
};
