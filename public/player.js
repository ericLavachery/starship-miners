function gangNavig() {
    $('#gangInfos').empty();
    $('#gangInfos').append('<button type="button" title="Editer" class="boutonGris iconButtons" onclick="gangEdit()"><i class="fas fa-users-cog"></i></button><br>');
    $('#gangInfos').append(capitalizeFirstLetter(playerInfos.gang));
    $('#gangInfos').append(' '+playerInfos.gLevel+'<br>');
};

function gangEdit() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","300px");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="blockTitle"><h3>Player Infos</h3></span>');
    // GANG
    $('#conUnitList').append('<select class="boutonGris" id="theGangs" onchange="changePlayerInfo(`theGangs`,`gang`)"></select>');
    $('#theGangs').empty().append('<option value="">Gang</option>');
    $('#theGangs').append('<option value="rednecks">Rednecks</option>');
    $('#theGangs').append('<option value="blades">Blades</option>');
    $('#theGangs').append('<option value="bulbos">Bulbos Kapos</option>');
    $('#theGangs').append('<option value="drogmulojs">Drogmulojs</option>');
    $('#theGangs').append('<option value="tiradores">Tiradores</option>');
    $('#theGangs').append('<option value="detruas">Detruas</option>');
    $('#theGangs').append('<option value="brasier">Le Brasier</option>');
    // GANG LEVEL
    $('#conUnitList').append('<select class="boutonGris" id="theLevels" onchange="changePlayerInfo(`theLevels`,`gLevel`)"></select>');
    $('#theLevels').empty().append('<option value="">Niveau de Gang</option>');
    let i = 1;
    while (i <= 22) {
        $('#theLevels').append('<option value="'+i+'">'+i+'</option>');
        if (i > 25) {break;}
        i++
    }
    // mapDiff
    $('#conUnitList').append('<select class="boutonGris" id="theZone" onchange="changePlayerInfo(`theZone`,`mapDiff`)"></select>');
    $('#theZone').empty().append('<option value="">Présence Alien</option>');
    i = 1;
    while (i <= 10) {
        $('#theZone').append('<option value="'+i+'">'+i+'</option>');
        if (i > 11) {break;}
        i++
    }
    // dark
    $('#conUnitList').append('<select class="boutonGris" id="theDark" onchange="changePlayerInfo(`theDark`,`dark`)"></select>');
    $('#theDark').empty().append('<option value="false">Type de Zone</option>');
    $('#theDark').append('<option value="false">Normale</option>');
    $('#theDark').append('<option value="true">Sombre</option>');
};

function changePlayerInfo(dropMenuId,infoName) {
    let value = document.getElementById(dropMenuId).value;
    if (value === 'true' || value === 'false') {
        if (value === 'true') {
            playerInfos[infoName] = true;
        } else {
            playerInfos[infoName] = false;
        }
    } else if (isNaN(value)) {
        playerInfos[infoName] = value;
    } else {
        playerInfos[infoName] = +value;
    }
    savePlayerInfos();
    gangNavig();
};
