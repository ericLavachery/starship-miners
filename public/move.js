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
            let maxSize = batType.transMaxSize;
            if (bat.eq === 'garage' || bat.logeq === 'garage' || bat.eq === 'bldkit') {
                maxSize = maxSize*3;
            }
            if (maxSize >= selectedBatType.size) {
                let myBatVolume = myBatWeight;
                if (batType.skills.includes('transveh') && selectedBatType.cat === 'vehicles' && !selectedBatType.skills.includes('robot') && !selectedBatType.skills.includes('cyber')) {
                    myBatVolume = Math.round(myBatVolume/2);
                }
                batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                if (myBatVolume <= batTransUnitsLeft) {
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
        if (roboAccess(tileId)) {
            moveOK = true;
        } else {
            moveOK = false;
            warning('Mouvement impossible','Cette endroit est hors de la zone de contrôle');
        }
    }
    if (selectedBatType.skills.includes('fly') || selectedBat.eq === 'e-jetpack') {
        jump = true;
        distance = calcJumpDistance(selectedBat.tileId,tileId);
        let jmc = selectedBatType.moveCost;
        if (selectedBat.eq === 'e-jetpack') {
            jmc = 1.2;
        }
        if (selectedBat.team != 'aliens' && zone[0].planet === 'Kzin') {
            jmc = jmc*1.5*moveKzin;
        }
        if (selectedBat.team != 'aliens' && zone[0].planet === 'Horst' && playerInfos.comp.scaph < 3 && selectedBatType.cat === 'infantry') {
            jmc = jmc*1.5*moveKzin;
        }
        if (selectedBat.team === 'aliens' && zone[0].planet === 'Horst') {
            jmc = jmc/1.5;
        }
        if (selectedBat.tags.includes('genfast')) {
            jmc = jmc/1.33;
        }
        if (selectedBat.tags.includes('genslow')) {
            jmc = jmc*1.33;
        }
        if (selectedBat.tags.includes('sudu')) {
            jmc = jmc*mcSudu;
        }
        jmc = jmc*moveTuning;
        if (Math.floor(distance) <= Math.floor(selectedBat.apLeft/jmc) && selectedBat.tileId != tileId) {
            moveOK = true;
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

function roboAccess(tileId) {
    let access = true;
    if (selectedBatType.skills.includes('crange') && roboRange) {
        if (!roboTiles.includes(tileId)) {
            access = false;
        }
    }
    return access;
};

function getRoboTiles() {
    if (selectedBat.eq === 'e-control' || selectedBat.logeq === 'e-control') {
        let roboControlers = [];
        let controlRange = 3;
        if (playerInfos.bldList.includes('Centre de com')) {
            controlRange = 12;
        } else if (playerInfos.bldList.includes('Poste radio')) {
            controlRange = 6;
        }
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                let batType = getBatType(bat);
                if (bat.eq === 'e-control' || bat.logeq === 'e-control' || batType.skills.includes('control')) {
                    roboControlers.push(bat.tileId);
                }
            }
        });
        zone.forEach(function(tile) {
            roboControlers.forEach(function(controlTile) {
                if (!roboTiles.includes(tile.id)) {
                    distance = calcDistance(tile.id,controlTile);
                    if (distance <= controlRange) {
                        roboTiles.push(tile.id);
                    }
                }
            });
        });
    }
};

function tagAction() {
    if (!selectedBat.tags.includes('action')) {
        selectedBat.tags.push('action');
    }
    selectedBat.oldTileId = selectedBat.tileId;
    selectedBat.oldapLeft = selectedBat.apLeft;
    selectedBatArrayUpdate();
};

function putTagAction(bat) {
    if (!bat.tags.includes('action')) {
        bat.tags.push('action');
    }
    bat.oldTileId = bat.tileId;
    bat.oldapLeft = bat.apLeft;
};

function doneAction(bat) {
    if (bat.cat != 'aliens') {
        if (!bat.tags.includes('action')) {
            bat.tags.push('action');
        }
        bat.oldTileId = bat.tileId;
        bat.oldapLeft = bat.apLeft;
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
                        if (moveLeft > 0 && terrainAccess(selectedBat.id,tile.id) && roboAccess(tile.id)) {
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
            let distance = calcJumpDistance(selectedBat.tileId,tile.id);
            let jmc = selectedBatType.moveCost;
            if (selectedBat.eq === 'e-jetpack') {
                jmc = 1.2;
            }
            if (selectedBat.team != 'aliens' && zone[0].planet === 'Kzin') {
                jmc = jmc*1.5*moveKzin;
            }
            if (selectedBat.team != 'aliens' && zone[0].planet === 'Horst' && playerInfos.comp.scaph < 3 && selectedBatType.cat === 'infantry') {
                jmc = jmc*1.5*moveKzin;
            }
            if (selectedBat.tags.includes('genfast')) {
                jmc = jmc/1.33;
            }
            if (selectedBat.tags.includes('genslow')) {
                jmc = jmc*1.33;
            }
            if (selectedBat.tags.includes('sudu')) {
                jmc = jmc*mcSudu;
            }
            jmc = jmc*moveTuning;
            if (Math.floor(distance) <= Math.floor(selectedBat.apLeft/jmc)) {
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
                    // let distance = calcJumpDistance(selectedBat.tileId,tile.id);
                    moveCost = distance*jmc;
                    moveCost = moveCost.toFixedNumber(1);
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
    // play sound
    // if (selectedBatType.cat != 'alien') {
    //     playMove(true);
    // }
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
                jmc = 1.2;
            }
            if (selectedBat.team != 'aliens' && zone[0].planet === 'Kzin') {
                jmc = jmc*1.5*moveKzin;
            }
            if (selectedBat.team != 'aliens' && zone[0].planet === 'Horst' && playerInfos.comp.scaph < 3 && selectedBatType.cat === 'infantry') {
                jmc = jmc*1.5*moveKzin;
            }
            if (selectedBat.team === 'aliens' && zone[0].planet === 'Horst') {
                jmc = jmc/1.5;
            }
            if (selectedBat.tags.includes('genfast')) {
                jmc = jmc/1.33;
            }
            if (selectedBat.tags.includes('genslow')) {
                jmc = jmc*1.33;
            }
            if (selectedBat.tags.includes('sudu')) {
                jmc = jmc*mcSudu;
            }
            jmc = jmc*moveTuning;
            apLost = distance*jmc;
            apLost = apLost.toFixedNumber(1);
        }
        selectedBat.apLeft = selectedBat.apLeft-apLost;
    }
    selectedBat.tileId = tileId;
    // remove tags
    if (selectedBat.tags.includes('blub')) {
        let terrain = getTerrainById(tileId);
        if (terrain.name != 'R' && terrain.name != 'L') {
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
    if (selectedBat.tags.includes('mud')) {
        tagIndex = selectedBat.tags.indexOf('mud');
        selectedBat.tags.splice(tagIndex,1);
    }
    if (selectedBat.tags.includes('camo') || selectedBat.fuzz <= -2) {
        if (selectedBat.prt === 'battlesuit') {
            camoOut();
        } else {
            if (selectedBatType.skills.includes('fly') || (selectedBatType.cat === 'vehicles' && !selectedBatType.skills.includes('emoteur') && !selectedBatType.skills.includes('robot')) || selectedBatType.skills.includes('moto') || selectedBatType.skills.includes('maycamo') || !selectedBatType.skills.includes('camo') || selectedBat.eq === 'e-jetpack') {
                if (selectedBat.eq === 'kit-chouf' || selectedBat.eq === 'trainkitgi' || selectedBat.eq === 'trainkitch' || selectedBat.eq === 'trainkitlu') {
                    camouflage(0);
                } else {
                    camoOut();
                }
            } else {
                camouflage(0);
            }
        }
    }
    if (zone[0].dark && activeTurn === 'player') {
        undarkAround(selectedBat,false);
    }
    tileSelect(selectedBat);
    if (selectedBat.team != 'aliens' && zone[0].planet === 'Horst') {
        if (playerInfos.stList.includes(tileId)) {
            stormDamage(selectedBat,selectedBatType,true,true);
        } else if (playerInfos.sqList.includes(tileId)) {
            stormDamage(selectedBat,selectedBatType,false,true);
        }
    }
    let tile = getTileById(tileId);
    if (selectedBat.tags.includes('autoroad')) {
        autoRoad(tile);
    }
    if (tile.web) {
        if (!selectedBatType.skills.includes('fly') && selectedBat.eq != 'e-jetpack' && selectedBatType.moveCost < 90) {
            if (!selectedBat.tags.includes('mud')) {
                selectedBat.tags.push('mud');
            }
            let newAP = 0-rand.rand(1,Math.ceil(selectedBat.ap/2));
            if (selectedBat.prt === 'swing' || selectedBat.prt === 'soap') {
                newAP = newAP+7;
            }
            if (newAP < selectedBat.apLeft-2) {
                selectedBat.apLeft = newAP;
            } else {
                selectedBat.apLeft = selectedBat.apLeft-2;
            }
            warning('Toile','Bataillon immobilisé!');
        }
    }
    if (zone[0].planet === 'Kzin') {
        if (!selectedBatType.skills.includes('fly') && !selectedBatType.skills.includes('hover') && selectedBat.eq != 'e-jetpack' && selectedBatType.moveCost < 90 && (!selectedBatType.skills.includes('oknitro') || selectedBatType.skills.includes('moto'))) {
            if (!tile.rd) {
                let mudChance = 0;
                if (tile.terrain === 'S') {
                    mudChance = 13;
                } else if (tile.terrain === 'P') {
                    mudChance = 10;
                } else if (tile.terrain === 'G') {
                    mudChance = 7;
                } else if (tile.terrain === 'B') {
                    mudChance = 5.5;
                }
                mudChance = (mudChance*tile.seed/2)-15;
                if (mudChance <= 0) {
                    mudChance = 0;
                } else {
                    mudChance = mudChance*7/(selectedBat.vet+6);
                    mudChance = Math.ceil(mudChance*8/(playerInfos.vue+5));
                }
                if (rand.rand(1,100) <= mudChance) {
                    let newAP = 0;
                    let immobChance = 100;
                    tile.qs = true;
                    if (selectedBatType.skills.includes('ranger')) {
                        immobChance = immobChance-40;
                    } else if (selectedBat.eq === 'e-ranger' || selectedBat.logeq === 'e-ranger' || selectedBat.tdc.includes('e-ranger')) {
                        immobChance = immobChance-30;
                    }
                    if (selectedBatType.skills.includes('caterp')) {
                        immobChance = immobChance-20;
                        if (selectedBatType.size < 22) {
                            immobChance = immobChance-20;
                        }
                    } else if (selectedBat.eq === 'chenilles' || selectedBat.logeq === 'chenilles' || selectedBat.eq === 'carkit') {
                        immobChance = immobChance-15;
                    }
                    if (rand.rand(1,100) <= immobChance) {
                        if (!selectedBat.tags.includes('mud')) {
                            selectedBat.tags.push('mud');
                        }
                        newAP = newAP-rand.rand(1,selectedBat.ap);
                        if (newAP < selectedBat.apLeft-2) {
                            selectedBat.apLeft = newAP;
                        } else {
                            selectedBat.apLeft = selectedBat.apLeft-2;
                        }
                        if (selectedBat.apLeft <= 0 && selectedBat.tags.includes('mud')) {
                            warning('Sables mouvants','Bataillon immobilisé!');
                        } else {
                            warning('Sables mouvants','Bataillon embourbé!');
                        }
                    } else {
                        warning('Sables mouvants','Sables mouvants détectés');
                    }
                } else if (playerInfos.vue >= 5 && mudChance >= 10) {
                    tile.qs = true;
                    warning('Sables mouvants','Sables mouvants détectés');
                }
            }
        }
    }
    showBataillon(selectedBat);
    showBatInfos(selectedBat);
    // update arrays
    selectedBatArrayUpdate();
    if (selectedBatType.skills.includes('snif')) {
        updateDogTiles(selectedBat.tileId);
    }
    if (activeTurn === 'player') {
        if (playerInfos.follow) {
            centerMap();
        } else if (isMapViewBorder(tileId)) {
            centerMap();
        } else if (zone[0].dark || selectedBatType.skills.includes('snif')) {
            showMap(zone,true);
        }
    }
    getRoboTiles();
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
    // return selectedBat to start position if stacked on another unit (or embark)
    let stack = false;
    let ownTransHere = false;
    let transId = -1;
    let myBatWeight = calcVolume(selectedBat,selectedBatType);
    let isCharged = checkCharged(selectedBat,'trans');
    bataillons.forEach(function(bat) {
        if (bat.tileId === selectedBat.tileId && bat.loc === "zone" && bat.id != selectedBat.id) {
            stack = true;
            if (!isCharged) {
                let batType = getBatType(bat);
                let maxSize = batType.transMaxSize;
                if (bat.eq === 'garage' || bat.logeq === 'garage' || bat.eq === 'bldkit') {
                    maxSize = maxSize*3;
                }
                if (maxSize >= selectedBatType.size) {
                    let myBatVolume = myBatWeight;
                    if (batType.skills.includes('transveh') && selectedBatType.cat === 'vehicles' && !selectedBatType.skills.includes('robot') && !selectedBatType.skills.includes('cyber')) {
                        myBatVolume = Math.round(myBatVolume/2);
                    }
                    let batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                    if (myBatVolume <= batTransUnitsLeft) {
                        if (!selectedBat.tags.includes('deb') || selectedBat.salvoLeft >= 1 || batType.cat != 'vehicles' || batType.skills.includes('transorbital')) {
                            ownTransHere = true;
                            transId = bat.id;
                        }
                    }
                }
            }
        }
    });
    if (stack) {
        if (ownTransHere) {
            let resLoad = checkResLoad(selectedBat);
            let transBat = getBatById(transId);
            let transBatType = getBatType(transBat);
            if (resLoad >= 1 && transBatType.skills.includes('transorbital')) {
                embarquement(transId,true);
            } else {
                embarquement(transId,false);
            }
        } else {
            selectedBat.apLeft = selectedBat.oldapLeft;
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
    if (terrain.name === 'R' && zone[targetTileId].seed >= 4) {
        terFlood = 0;
    }
    let terVeg = terrain.veg;
    let terScarp = terrain.scarp;
    if (batType.skills.includes('routes') || bat.eq === 'e-road' || bat.logeq === 'e-road') {
        let unitTile = getTileById(bat.tileId);
        if (unitTile.rd) {
            terVeg = 0;
            terFlood = 0;
            terScarp = 0;
        }
    }
    if (zone[targetTileId].rd) {
        access = true;
    }
    let batMaxFlood = batType.maxFlood;
    let batMaxScarp = batType.maxScarp;
    let batMaxVeg = batType.maxVeg;
    if (batMaxFlood === 0 && (bat.eq === 'chenilles' || bat.logeq === 'chenilles' || bat.eq === 'carkit')) {
        batMaxFlood = 1;
    }
    if (batMaxScarp < 2 && (bat.eq === 'chenilles' || bat.logeq === 'chenilles' || bat.eq === 'carkit')) {
        batMaxScarp = 2;
    }
    if (batMaxFlood >= terFlood && batMaxScarp >= terScarp && batMaxVeg >= terVeg) {
        access = true;
    }
    if (bat.eq === 'snorkel' || bat.logeq === 'snorkel' || bat.eq === 'carkit') {
        if (terFlood >= 2) {
            access = true;
        }
    }
    if (bat.tags.includes('genwater')) {
        if (terrain.name === 'W' || (terrain.name === 'S' && playerInfos.comp.scaph < 1) || terrain.name === 'L' || terrain.name === 'R') {
            if (!zone[targetTileId].rd) {
                access = false;
            }
        }
    }
    if (batType.skills.includes('nodry')) {
        if (terrain.flood < 1) {
            if (terrain.veg < 1) {
                access = false;
            }
        }
    }
    if (playerInfos.onShip) {
        access = true;
    }
    return access;
};

function calcBaseMoveCost(bat,batType) {
    let baseMoveCost = batType.moveCost;
    if (bat.eq === 'kit-garde' || bat.eq === 'kit-sentinelle') {
        baseMoveCost = 4;
    }
    if (bat.eq === 'kit-artilleur' || bat.eq === 'kit-guetteur') {
        baseMoveCost = 5;
    }
    if (bat.eq === 'e-phare' && batType.cat === 'infantry') {
        baseMoveCost = 7;
    }
    if (bat.eq === 'kit-pompiste') {
        baseMoveCost = 4;
    }
    if (bat.eq === 'w2-canon') {
        baseMoveCost = 9;
    }
    if (bat.tags.includes('genslow')) {
        if (batType.moveCost >= 3) {
            baseMoveCost = baseMoveCost+1;
        } else {
            baseMoveCost = baseMoveCost+0.5;
        }
    }
    if (bat.tags.includes('genfast')) {
        if (batType.moveCost >= 3) {
            baseMoveCost = baseMoveCost-1;
        } else {
            baseMoveCost = baseMoveCost-0.5;
        }
    }
    if (bat.tags.includes('zombie')) {
        baseMoveCost = baseMoveCost*1.5;
    }
    if (bat.eq === 'helper' || bat.logeq === 'helper' || bat.eq === 'cyberkit' || bat.tdc.includes('helper')) {
        baseMoveCost = baseMoveCost*0.85;
    }
    if (bat.eq === 'w2-moisso' || bat.logeq === 'w2-moisso' || bat.eq === 'moisso' || bat.logeq === 'moisso') {
        baseMoveCost = baseMoveCost*1.1;
    }
    if (bat.tags.includes('sudu')) {
        baseMoveCost = baseMoveCost*mcSudu;
    }
    if (playerInfos.comp.trans === 3 && batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && batType.moveCost < 90) {
        baseMoveCost = baseMoveCost*0.9;
    }
    baseMoveCost = baseMoveCost*moveTuning;
    return baseMoveCost;
}

function calcMoveCost(targetTileId,diag) {
    let tile = getTileById(targetTileId);
    let terIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terIndex];
    let baseMoveCost = calcBaseMoveCost(selectedBat,selectedBatType);
    let isCatMC = false;
    if (selectedBat.eq === 'chenilles' || selectedBat.eq === 'carkit' || selectedBat.logeq === 'chenilles') {
        if (selectedBatType.maxFlood >= 1 && selectedBatType.maxScarp >= 2) {
            isCatMC = true;
        }
        if (selectedBatType.maxFlood >= 1 && terrain.name === 'S') {
            isCatMC = true;
        }
        if (selectedBatType.maxScarp >= 2 && terrain.name === 'H') {
            isCatMC = true;
        }
        if (terrain.name === 'B') {
            isCatMC = true;
        }
    }
    let moveCost;
    if (tile.rd && !selectedBatType.skills.includes('hover')) {
        moveCost = baseMoveCost+terrain.roadmc;
        if (baseMoveCost >= 4 && selectedBat.team != 'aliens') {
            moveCost = moveCost-((baseMoveCost-3)/2);
        }
        if (moveCost <= 1) {
            moveCost = 1.5;
        }
    } else if (selectedBat.team == 'aliens' && !selectedBatType.skills.includes('hover') && !selectedBatType.skills.includes('okwater')) {
        moveCost = baseMoveCost+terrain.alienmc;
    } else if (selectedBatType.skills.includes('okwater')) {
        moveCost = baseMoveCost+terrain.larvemc;
    } else if (selectedBatType.skills.includes('ranger') || selectedBat.eq === 'kit-sentinelle' || selectedBat.tdc.includes('e-ranger') || selectedBat.eq === 'e-ranger' || selectedBat.logeq === 'e-ranger' || selectedBat.eq === 'trainkitch' || selectedBat.eq === 'trainkitlu' || selectedBat.eq === 'trainkitgi' || selectedBat.eq === 'trainkitax') {
        moveCost = baseMoveCost+terrain.rangermc;
    } else if (selectedBatType.skills.includes('caterp') || isCatMC) {
        moveCost = baseMoveCost+terrain.catmc;
    } else if (selectedBatType.skills.includes('hover')) {
        moveCost = baseMoveCost+terrain.hovermc;
    } else if (selectedBatType.skills.includes('hardmove')) {
        moveCost = baseMoveCost+terrain.hardmc;
    } else if (selectedBatType.skills.includes('hscarpmove')) {
        moveCost = baseMoveCost+terrain.hscarpmc;
    } else {
        moveCost = baseMoveCost+terrain.mc;
    }
    if (selectedBat.eq === 'snorkel' || selectedBat.logeq === 'snorkel' || selectedBat.eq === 'carkit') {
        if (terrain.flood > selectedBatType.maxFlood) {
            moveCost = moveCost+4;
        }
    }
    if (selectedBat.tags.includes('camo')) {
        moveCost = moveCost+0.3;
    }
    if (tile.ruins) {
        moveCost = moveCost+1;
    }
    if (diag) {
        moveCost = moveCost*1.42;
    }
    if (selectedBat.team != 'aliens' && zone[0].planet === 'Kzin') {
        if (selectedBatType.cat === 'vehicles') {
            moveCost = moveCost*1.5*moveKzin;
        } else if (selectedBatType.name != 'Pets') {
            moveCost = moveCost*2*moveKzin;
        }
    }
    if (selectedBat.team != 'aliens' && zone[0].planet === 'Horst' && playerInfos.comp.scaph < 3 && selectedBatType.cat === 'infantry' && selectedBatType.name != 'Pets') {
        moveCost = moveCost*1.5*moveKzin;
    }
    if (selectedBat.team != 'aliens' && zone[0].planet === 'Horst') {
        if (playerInfos.stList.includes(targetTileId) || playerInfos.stList.includes(selectedBat.tileId)) {
            moveCost = moveCost*3;
        } else if (playerInfos.sqList.includes(targetTileId) || playerInfos.sqList.includes(selectedBat.tileId)) {
            moveCost = moveCost*3;
        }
    }
    if (selectedBat.team === 'aliens' && zone[0].planet === 'Horst') {
        moveCost = moveCost/1.5;
    }
    // moveCost = moveCost*moveTuning;
    moveCost = moveCost.toFixedNumber(1);
    // if (playerInfos.onShip) {
    //     moveCost = 0;
    // }
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
