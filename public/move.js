function clickTile(tileId) {
    showTileInfos(tileId);
    let batHere = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            showBatInfos(bat);
            if (selectedBat == bat) {
                moveMode();
            } else {
                selectMode();
                batSelect(bat);
            }
            batHere = true;
        }
    });
    if (!batHere) {
        selectMode();
        batUnselect();
    }
    console.log(mode);
};

function batSelect(bat) {
    // remove selection on old selected unit
    if (Object.keys(selectedBat).length >= 1) {
        let tileIndex = zone.findIndex((obj => obj.id == selectedBat.tileId));
        let tile = zone[tileIndex];
        let terclass = 'ter'+tile.terrain+tile.seed;
        $('#'+tile.id).removeClass('terUnderSel').addClass(terclass);
    }
    // draw new selected unit
    tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    tile = zone[tileIndex];
    terclass = 'ter'+tile.terrain+tile.seed;
    $('#'+tile.id).removeClass(terclass).addClass('terUnderSel');
    selectedBat = bat;
};

function batUnselect() {
    // remove selection on old selected unit
    if (Object.keys(selectedBat).length >= 1) {
        let tileIndex = zone.findIndex((obj => obj.id == selectedBat.tileId));
        let tile = zone[tileIndex];
        let terclass = 'ter'+tile.terrain+tile.seed;
        $('#'+tile.id).removeClass('terUnderSel').addClass(terclass);
    }
    selectedBat = {};
};
