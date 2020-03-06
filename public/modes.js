function selectMode() {
    mode = 'select';
    document.title = pseudo + ' - Select';
    cursorSwitch('.','grid-item','insp');
    $('#cadreMap').css("background-color", "#2f372a");
};

function moveMode() {
    mode = 'move';
    document.title = pseudo + ' - Move';
    cursorSwitch('.','grid-item','pointer');
    $('#cadreMap').css("background-color", "#1b3e8c");
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
