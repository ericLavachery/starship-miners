function clickTile(tileId) {
    if (mode == 'select') {
        clickSelect(tileId);
    } else if (mode == 'move') {
        clickMove(tileId);
    } else {
        clickFire(tileId);
    }
};

function clickSelect(tileId) {
    showTileInfos(tileId);
    let ownBatHere = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            showBatInfos(bat);
            if (selectedBat == bat) {
                moveMode();
                moveInfos(selectedBat);
            } else {
                selectMode();
                batUnstack();
                batSelect(bat);
            }
            ownBatHere = true;
        }
    });
    if (!ownBatHere) {
        $('#unitInfos').empty();
        selectMode();
        batUnstack();
        batUnselect();
    }
    // console.log(mode);
};

function batSelect(bat) {
    // remove selection on old selected unit
    tileUnselect();
    // draw new selected unit
    tileSelect(bat);
    selectedBat = bat;
    commandes();
};

function batUnselect() {
    deleteMoveInfos();
    // remove selection on old selected unit
    tileUnselect();
    selectedBat = {};
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
    // draw new selected unit
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    let unitTypesIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
    terclass = 'ter'+tile.terrain+tile.seed;
    if (unitTypes[unitTypesIndex].cat != 'units') {
        $('#'+tile.id).removeClass(terclass).addClass('terUnderSel');
    } else {
        $('#'+tile.id).removeClass(terclass).addClass('terUnderSel');
    }
};
