function craftWindow() {
    selectMode();
    updateBldList();
    findLanders();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","600px");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="blockTitle"><h1>Crafting</h1></span>');
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');

    let craftFactor;
    let allCrafts = crafting.slice();
    // sortedCrafts = _.sortBy(_.sortBy(_.sortBy(allCrafts,'name'),'name'),'kind');
    let craftCostsList;
    let craftCompReqs;
    let craftOK = false;
    let compReqOK = false;
    allCrafts.forEach(function(craft) {
        if (craft.result != 'Moteur Orbital') {
            craftFactor = 50;
        } else {
            craftFactor = 1;
        }
        craftOK = false;
        if ((playerInfos.bldList.includes(craft.bldReq[0]) || craft.bldReq[0] === undefined) && (playerInfos.bldList.includes(craft.bldReq[1]) || craft.bldReq[1] === undefined) && (playerInfos.bldList.includes(craft.bldReq[2]) || craft.bldReq[2] === undefined)) {
            compReqOK = checkCompReq(craft);
            if (compReqOK) {
                craftOK = true;
            }
        }
        if (craftOK) {
            $('#conUnitList').append('<span class="craftsList cy klik" title="'+toNiceString(craft.bldReq)+'" onclick="doCraft('+craft.id+','+craftFactor+')">'+craftFactor+' '+craft.result+'</span><br>');
        } else {
            $('#conUnitList').append('<span class="craftsList jaune" title="'+toNiceString(craft.bldReq)+'">'+craftFactor+' '+craft.result+'</span><br>');
        }
        craftCostsList = showCraftCost(craft,craftFactor);
        $('#conUnitList').append('<span class="craftsList">'+craftCostsList+'</span><br>');
        if (craft.bldReq.length >= 1) {
            $('#conUnitList').append('<span class="craftsList gff">'+toNiceString(craft.bldReq)+'</span><br>');
        }
        if (Object.keys(craft.compReq).length >= 1) {
            craftCompReqs = showCraftCompReqs(craft);
            $('#conUnitList').append('<span class="craftsList">'+craftCompReqs+'</span><br>');
        }
        $('#conUnitList').append('<hr>');
    });
};

function doCraft(craftId,craftFactor) {
    let craftIndex = crafting.findIndex((obj => obj.id == craftId));
    let craft = crafting[craftIndex];

};

function showCraftCost(craft,number) {
    let craftCostsList = ' ';
    let craftFactor;
    let res;
    let dispoRes;
    Object.entries(craft.cost).map(entry => {
        let key = entry[0];
        let value = entry[1];
        craftFactor = Math.round(number/craft.batch);
        value = value*craftFactor;
        dispoRes = getDispoRes(key);
        craftCostsList = craftCostsList+'<span class="gf">'+key+':</span><span class="brun">'+value+'</span>/<span class="vert">'+dispoRes+'</span> ';
    });
    return craftCostsList;
};

function showCraftCompReqs(craft) {
    let craftCompReqs = ' ';
    Object.entries(craft.compReq).map(entry => {
        let key = entry[0];
        let value = entry[1];
        craftCompReqs = craftCompReqs+'<span class="gff">'+key+':</span><span class="gf">'+value+'</span> ';
    });
    return craftCompReqs;
};
