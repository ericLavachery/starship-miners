function clickTile(tileId) {
    if (mode == 'select') {
        clickSelect(tileId);
    } else if (mode == 'move') {
        clickMove(tileId);
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
            } else {
                selectMode();
                batUnstack();
                batSelect(bat);
            }
            ownBatHere = true;
        }
    });
    if (!ownBatHere) {
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
};

function batUnselect() {
    // remove selection on old selected unit
    tileUnselect();
    selectedBat = {};
};

function tileUnselect() {
    // remove selection on selected tile
    if (Object.keys(selectedBat).length >= 1) {
        let tileIndex = zone.findIndex((obj => obj.id == selectedBat.tileId));
        let tile = zone[tileIndex];
        let terclass = 'ter'+tile.terrain+tile.seed;
        $('#'+tile.id).removeClass('terUnderSel').addClass(terclass);
    }
};

function tileSelect(bat) {
    // draw new selected unit
    tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    tile = zone[tileIndex];
    terclass = 'ter'+tile.terrain+tile.seed;
    $('#'+tile.id).removeClass(terclass).addClass('terUnderSel');
};
