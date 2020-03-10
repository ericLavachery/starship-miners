function selectMode() {
    mode = 'select';
    document.title = pseudo + ' - Select';
    $('#mode').removeClass('modeMove').addClass('modeSelect');
    $('#mode').empty().append('Mode Sélection');
    cursorSwitch('.','grid-item','insp');
};

function moveMode() {
    mode = 'move';
    document.title = pseudo + ' - Move';
    $('#mode').removeClass('modeSelect').addClass('modeMove');
    $('#mode').empty().append('Mode Mouvement');
    cursorSwitch('.','grid-item','pointer');
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
        }
        $(seltype+selvalue).css('cursor','url(/static/img/'+kur+'.cur),'+defkur);
    }
};
