function clickTile(tileId) {
    if (stopMe === false) {
        if (modeLanding) {
            clickLanding(tileId);
        } else if (Object.keys(batDebarq).length >= 1) {
            clickDebarq(tileId);
        } else if (Object.keys(conselUnit).length >= 1) {
            if (conselPut === undefined) {
                conselPut = false;
            }
            if (selectedBat.tileId >= 0 && conselUnit.skills.includes('clicput') && !conselTriche && conselPut) {
                clickMine(tileId,selectedBat.tileId);
            } else {
                if (conselTriche) {
                    clickConstruct(tileId,true);
                } else if (playerInfos.onShip) {
                    clickConstruct(tileId,false);
                } else {
                    if (selectedBat.tileId >= 0) {
                        let distance = calcDistance(selectedBat.tileId,tileId);
                        if (distance <= 1) {
                            clickConstruct(tileId,false);
                        }
                    }
                }
            }
        } else {
            if (mode == 'select') {
                clickSelect(tileId);
                toggleShowedTile(tileId);
            } else if (mode == 'move') {
                clickMove(tileId);
            } else {
                clickFire(tileId);
            }
        }
    }
};

function clickSelect(tileId) {
    showTileInfos(tileId);
    if (!modeSonde) {
        let ownBatHere = false;
        let jump = false;
        let newSelectedBat = {};
        let goMove = false;
        bataillons.forEach(function(bat) {
            if (bat.tileId === tileId && bat.loc === "zone") {
                if (!goMove) {
                    showBatInfos(bat);
                    if (selectedBat.id == bat.id && selectedBatType.moveCost < 99 && !selectedBat.tags.includes('nomove')) {
                        if (selectedBatType.skills.includes('fly') || selectedBat.eq === 'e-jetpack') {
                            jump = true;
                        }
                        goMove = true;
                        moveMode();
                        moveInfos(selectedBat,jump);
                    }
                    ownBatHere = true;
                }
            }
        });
        if (!goMove) {
            let batStack = 0;
            bataillons.forEach(function(bat) {
                if (bat.tileId === tileId && bat.loc === "zone") {
                    batStack++;
                }
            });
            if (batStack >= 2) {
                bataillons.forEach(function(bat) {
                    let batType = getBatType(bat);
                    if (bat.tileId === tileId && bat.loc === "zone" && batType.moveCost < 99 && bat.apLeft >= 1) {
                        showBatInfos(bat);
                        newSelectedBat = bat;
                        ownBatHere = true;
                    }
                });
                if (Object.keys(newSelectedBat).length < 1) {
                    bataillons.forEach(function(bat) {
                        if (bat.tileId === tileId && bat.loc === "zone" && bat.apLeft >= 1) {
                            showBatInfos(bat);
                            newSelectedBat = bat;
                            ownBatHere = true;
                        }
                    });
                }
            } else {
                bataillons.forEach(function(bat) {
                    if (bat.tileId === tileId && bat.loc === "zone") {
                        showBatInfos(bat);
                        newSelectedBat = bat;
                        ownBatHere = true;
                    }
                });
            }
        }
        if (Object.keys(newSelectedBat).length >= 1) {
            selectMode();
            batUnstack();
            batSelect(newSelectedBat,true);
            // console.log('NEW BAT SELECTED');
            // console.log(selectedBat);
            // console.log(selectedBatType);
        }
        let enemyBatHere = false;
        aliens.forEach(function(bat) {
            if (bat.tileId === tileId && bat.loc === "zone") {
                let batType = getBatType(bat);
                if (!batType.skills.includes('invisible') && !bat.tags.includes('invisible')) {
                    showEnemyBatInfos(bat);
                }
                enemyBatHere = true;
            }
        });
        // console.log(enemyBatHere);
        if (!ownBatHere && !enemyBatHere) {
            $('#unitInfos').empty();
            $("#unitInfos").css("display","none");
            selectMode();
            batUnstack();
            batUnselect();
        }
        // console.log(mode);
    }
};

function toggleShowedTile(tileId) {
    if (selectedBat.tileId != tileId) {
        if (playerInfos.showedTiles.includes(tileId)) {
            let index = playerInfos.showedTiles.indexOf(tileId);
            playerInfos.showedTiles.splice(index,1);
        } else {
            if (selectedTile === tileId) {
                playerInfos.showedTiles.push(tileId);
            }
        }
        let alienHere = isAlienHere(tileId);
        if (!alienHere) {
            redrawTile(tileId,true);
        }
        if (showResOpen) {
            voirRessources();
        }
        selectedTile = tileId;
        if (showMini) {
            minimap();
        }
    }
};

function isAlienHere(tileId) {
    let alienHere = false;
    aliens.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            batType = getBatType(bat);
            if (!batType.skills.includes('invisible') && !bat.tags.includes('invisible')) {
                alienHere = true;
            } else if (bat.tags.includes('invisible') && playerInfos.comp.det >= 5) {
                alienHere = true;
            }
        }
    });
    return alienHere;
};

function batSelect(bat,roger) {
    // stop move sound
    // playMove(false);
    // remove selection on old selected unit
    batDebarq = {};
    nextTurnOK = true;
    $('html,body').scrollTop(0);
    washReports(false);
    tileUnselect();
    if (bat.tags.includes('nolist')) {
        tagDelete(bat,'nolist');
    }
    tagDelete(bat,'chrg');
    selectedBat = JSON.parse(JSON.stringify(bat));
    targetBat = {};
    // console.log(selectedBat);
    if (activeTurn == 'aliens' || !isVisible(bat.tileId)) {
        centerMap();
    }
    // draw new selected unit
    tileSelect(bat);
    checkSelectedBatType();
    if (selectedBatType.cat != 'aliens' && !playerInfos.onShip) {
        okSound(roger);
    }
    commandes();
    if (showMini && activeTurn == 'player') {
        minimap();
    }
};

function checkSelectedBatType() {
    let batTypeIndex;
    if (selectedBat.team == 'player') {
        batTypeIndex = unitTypes.findIndex((obj => obj.id == selectedBat.typeId));
        selectedBatType = JSON.parse(JSON.stringify(unitTypes[batTypeIndex]));
    } else if (selectedBat.team == 'aliens') {
        batTypeIndex = alienUnits.findIndex((obj => obj.id == selectedBat.typeId));
        selectedBatType = JSON.parse(JSON.stringify(alienUnits[batTypeIndex]));
    } else if (selectedBat.team == 'locals') {
        batTypeIndex = localUnits.findIndex((obj => obj.id == selectedBat.typeId));
        selectedBatType = JSON.parse(JSON.stringify(localUnits[batTypeIndex]));
    }
};

function batUnselect() {
    // stop move sound
    // playMove(false);
    deleteMoveInfos();
    // remove selection on old selected unit
    tileUnselect();
    selectedBat = {};
    selectedBatType = {};
    selectedWeap = {};
    targetBat = {};
    targetBatType = {};
    targetWeap = {};
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    commandes();
};

function tileUnselect() {
    // remove selection on selected tile
    if (Object.keys(selectedBat).length >= 1) {
        let tileIndex = zone.findIndex((obj => obj.id == selectedBat.tileId));
        let tile = zone[tileIndex];
        let terclass = 'ter'+tile.terrain+tile.seed;
        if (zone[0].dark && !zone[0].undarkOnce.includes(tile.id) && !zone[0].undarkAll) {
            terclass = 'terFog';
        }
        $('.selTile').remove();
        // $('#'+tile.id).removeClass('terUnderBldSel').removeClass('terUnderSel').addClass(terclass);
    }
};

function tileSelect(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    terclass = 'ter'+tile.terrain+tile.seed;
    if (zone[0].dark && !zone[0].undarkOnce.includes(tile.id) && !zone[0].undarkAll) {
        terclass = 'terFog';
    }
    if (mode === 'move') {
        $('#'+tile.id).append('<span class="selTile"><img src="/static/img/moving.png"></span>');
    } else {
        if (zone[0].dark) {
            $('#'+tile.id).append('<span class="selTile"><img src="/static/img/selected-dark.gif"></span>');
        } else {
            $('#'+tile.id).append('<span class="selTile"><img src="/static/img/selected.gif"></span>');
        }
    }
    // $('#'+tile.id).removeClass(terclass).addClass('terUnderSel');
};

function tileTarget(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    terclass = 'ter'+tile.terrain+tile.seed;
    if (zone[0].dark && !zone[0].undarkOnce.includes(tile.id) && !zone[0].undarkAll) {
        terclass = 'terFog';
    }
    $('#'+tile.id).append('<span class="selTile"><img src="/static/img/targeted.png"></span>');
    // $('#'+tile.id).removeClass(terclass).addClass('terTarget');
};
