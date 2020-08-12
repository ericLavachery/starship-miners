function voirReserve() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="constName or" id="gentils">RESERVE</span><br>');
    findLanders();
    let dispoCit = getDispoCit();
    $('#conUnitList').append('<span class="paramName">Citoyens</span><span class="paramIcon"></span><span class="paramValue">'+dispoCit+'</span><br>');
    let dispoRes;
    let sortedResTypes = _.sortBy(_.sortBy(_.sortBy(_.sortBy(resTypes,'rarity'),'bld'),'cat'),'cat');
    sortedResTypes.reverse();
    sortedResTypes = _.sortBy(sortedResTypes,'level')
    sortedResTypes.forEach(function(res) {
        dispoRes = getDispoRes(res.name);
        if (dispoRes >= 1) {
            $('#conUnitList').append('<span class="paramName">'+res.name+'</span><span class="paramIcon"></span><span class="paramValue">'+dispoRes+'</span><br>');
        }
    });
};

function findLanders() {
    let batType;
    landers = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            batType = getBatType(bat);
            if (batType.skills.includes('transorbital') || bat.tags.includes('reserve')) {
                landers.push(bat);
            }
        }
    });
};

function getDispoRes(res) {
    let dispoRes = 0;
    landers.forEach(function(bat) {
        if (bat.transRes[res] >= 1) {
            dispoRes = dispoRes+bat.transRes[res];
        }
    });
    if (playerInfos.alienRes[res] >= 1) {
        dispoRes = playerInfos.alienRes[res];
    }
    return dispoRes;
};

function getDispoCit() {
    let landersIds = [];
    landers.forEach(function(bat) {
        landersIds.push(bat.id);
    });
    let dispoCit = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Citoyens') {
            dispoCit = dispoCit+bat.citoyens;
        }
    });
    return dispoCit;
};
