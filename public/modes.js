function selectMode() {
    mode = 'select';
    document.title = pseudo + ' - Sélection';
    $('#mode').removeClass('modeMove').removeClass('modeFire').addClass('modeSelect');
    $('#mode').empty().append('Mode Sélection');
    cursorSwitch('.','grid-item','insp');
    selectedWeap = {};
};

function moveMode() {
    mode = 'move';
    document.title = pseudo + ' - Mouvement';
    $('#mode').removeClass('modeSelect').removeClass('modeFire').addClass('modeMove');
    $('#mode').empty().append('Mode Mouvement');
    cursorSwitch('.','grid-item','pointer');
    selectedWeap = {};
};

function fireMode(weapon) {
    if (stopMe === false) {
        mode = 'fire';
        document.title = pseudo + ' - Attaque';
        $('#mode').removeClass('modeSelect').removeClass('moveMode').addClass('modeFire');
        $('#mode').empty().append('Mode Attaque');
        cursorSwitch('.','grid-item','pointer');
        weaponSelect(weapon);
        fireInfos(selectedBat);
        showBatInfos(selectedBat);
        // console.log(selectedWeap);
    }
};

function cursorSwitch(seltype,selvalue,kur) {
    let defkur = 'default';
    if (kur == 'progress') {
        $(seltype+selvalue).css('cursor','pointer');
    } else if (kur == 'default') {
        $(seltype+selvalue).css('cursor','default');
    } else {
        if (kur == 'move') {
            defkur = 'nesw-resize';
        } else if (kur == 'insp') {
            defkur = 'help';
        } else if (kur == 'stop') {
            defkur = 'not-allowed';
        } else if (kur == 'freemove') {
            defkur = 'ew-resize';
        } else if (kur == 'copy') {
            defkur = 'copy';
            kur = 'writing';
        } else if (kur == 'fire') {
            defkur = 'crosshair';
            kur = 'thor';
        }
        $(seltype+selvalue).css('cursor','url(/static/img/'+kur+'.cur),'+defkur);
    }
};
