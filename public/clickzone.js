function clickTile(tileId) {
    if (stopMe === false) {
        if (Object.keys(batDebarq).length >= 1) {
            clickDebarq(tileId);
        } else if (Object.keys(conselUnit).length >= 1) {
            if (selectedBat.tileId >= 0 && (conselUnit.name == 'Champ de mines' || conselUnit.name == 'Explosifs' || conselUnit.name == 'Barbelés') && !conselTriche) {
                clickMine(tileId,selectedBat.tileId);
            } else {
                if (conselTriche) {
                    clickConstruct(tileId,true);
                } else {
                    if (selectedBat.tileId >= 0) {
                        let distance = calcDistance(selectedBat.tileId,tileId);
                        if (distance === 0) {
                            clickConstruct(tileId,false);
                        }
                    }
                }
            }
        } else {
            if (mode == 'select') {
                clickSelect(tileId);
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
    let ownBatHere = false;
    let jump = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            showBatInfos(bat);
            if (selectedBat.id == bat.id && selectedBatType.moveCost < 99) {
                // let batType = getBatType(bat);
                if (selectedBatType.skills.includes('fly')) {
                    jump = true;
                }
                moveMode();
                moveInfos(selectedBat,jump);
            } else {
                selectMode();
                batUnstack();
                batSelect(bat);
            }
            ownBatHere = true;
        }
    });
    let enemyBatHere = false;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            batType = getBatType(bat);
            if (!batType.skills.includes('invisible') && !bat.tags.includes('invisible')) {
                showEnemyBatInfos(bat);
            }
            enemyBatHere = true;
        }
    });
    // console.log(enemyBatHere);
    if (!ownBatHere && !enemyBatHere) {
        $('#unitInfos').empty();
        selectMode();
        batUnstack();
        batUnselect();
    }
    // console.log(mode);
};

function batSelect(bat) {
    // remove selection on old selected unit
    $('#report').empty('');
    tileUnselect();
    tileUntarget();
    if (bat.tags.includes('nolist')) {
        tagDelete(bat,'nolist');
    }
    selectedBat = JSON.parse(JSON.stringify(bat));
    targetBat = {};
    // console.log(selectedBat);
    if (activeTurn == 'aliens' || !isVisible(bat.tileId)) {
        centerMap();
    }
    // draw new selected unit
    tileSelect(bat);
    checkSelectedBatType();
    commandes();
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
    deleteMoveInfos();
    // remove selection on old selected unit
    tileUnselect();
    tileUntarget();
    selectedBat = {};
    selectedBatType = {};
    selectedWeap = {};
    targetBat = {};
    targetBatType = {};
    targetWeap = {};
    $('#unitInfos').empty();
    commandes();
};

function tileUnselect() {
    // remove selection on selected tile
    if (Object.keys(selectedBat).length >= 1) {
        let tileIndex = zone.findIndex((obj => obj.id == selectedBat.tileId));
        let tile = zone[tileIndex];
        let terclass = 'ter'+tile.terrain+tile.seed;
        $('#'+tile.id).removeClass('terUnderBldSel').removeClass('terUnderSel').addClass(terclass);
    }
};

function tileSelect(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    terclass = 'ter'+tile.terrain+tile.seed;
    $('#'+tile.id).removeClass(terclass).addClass('terUnderSel');
};

function tileUntarget() {
    let terclass;
    zone.forEach(function(tile) {
        if ($('#'+tile.id).hasClass("terTarget")) {
            terclass = 'ter'+tile.terrain+tile.seed;
            $('#'+tile.id).removeClass('terTarget').addClass(terclass);
        }
    });
};

function tileTarget(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    terclass = 'ter'+tile.terrain+tile.seed;
    $('#'+tile.id).removeClass(terclass).addClass('terTarget');
};
