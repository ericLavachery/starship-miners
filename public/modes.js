function selectMode() {
    mode = 'select';
    document.title = pseudo + ' - Sélection';
    $('#mode').removeClass('modeMove').removeClass('modeFire').addClass('modeSelect');
    $('#mode').empty().append('Mode Sélection');
    cursorSwitch('.','grid-item','insp');
    if (selectedBat.id >= 0) {
        tileSelect(selectedBat);
    }
    showMap(zone,true); // ?????????????? XXXXXXXXXXXXXXXXXXXXXXXXXX
    selectedWeap = {};
    mped = {};
};

function moveMode() {
    mode = 'move';
    document.title = pseudo + ' - Mouvement';
    $('#mode').removeClass('modeSelect').removeClass('modeFire').addClass('modeMove');
    $('#mode').empty().append('Mode Mouvement');
    cursorSwitch('.','grid-item','pointer');
    if (selectedBat.id >= 0) {
        $('.selTile').remove();
        tileSelect(selectedBat);
    }
    showMap(zone,true);
    selectedWeap = {};
    mped = {};
};

function fireMode(weapon,silent) {
    if (stopMe === false) {
        mode = 'fire';
        document.title = pseudo + ' - Attaque';
        $('#mode').removeClass('modeSelect').removeClass('moveMode').addClass('modeFire');
        $('#mode').empty().append('Mode Attaque');
        cursorSwitch('.','grid-item','pointer');
        weaponSelect(weapon);
        if (!silent) {
            reloadSound(selectedWeap);
        }
        fireInfos(selectedBat);
        showBatInfos(selectedBat);
        $('#report').empty('');
        mped = {};
        // console.log(selectedWeap);
    }
};

function editMode() {
    mode = 'edit';
    document.title = pseudo + ' - Map Editor';
    $('#mode').removeClass('modeMove').removeClass('modeFire').addClass('modeSelect');
    $('#mode').empty().append('Map Editor');
    cursorSwitch('.','grid-item','copy');
    $('#report').empty('');
    mped = {};
    mped.as = false;
    mped.sinf = '';
    // showMap(zone,false);
    batUnselect();
    mapEditWindow();
};

function confirmMode() {
    if (activeTurn === 'player' && mode != 'edit') {
        if (Object.keys(selectedBat).length >= 1) {
            if (mode === 'fire') {
                if (selectedWeap.num === 2) {
                    fireMode('w2',true);
                } else {
                    fireMode('w1',true);
                }
            } else if (mode === 'move') {
                moveMode();
                let jump = false;
                if (selectedBatType.skills.includes('fly') || selectedBat.eq === 'e-jetpack') {
                    jump = true;
                }
                moveInfos(selectedBat,jump);
            } else if (mode === 'select') {
                selectMode();
            }
        } else {
            selectMode();
        }
    }
    if (mode === 'edit') {
        cursorSwitch('.','grid-item','copy');
    }
};

function cursorSwitch(seltype,selvalue,kur) {
    let defkur = 'default';
    if (kur === 'move' && selectedBat.tags.includes('autoroad')) {
        kur = 'hand';
    }
    if (kur == 'progress') {
        $(seltype+selvalue).css('cursor','pointer');
    } else if (kur == 'default') {
        $(seltype+selvalue).css('cursor','default');
    } else {
        if (kur == 'move' || kur == 'hand') {
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
            kur = 'attack';
        } else if (kur == 'thor') {
            defkur = 'copy';
            kur = 'thor';
        }
        $(seltype+selvalue).css('cursor','url(/static/img/'+kur+'.cur),'+defkur);
    }
};
