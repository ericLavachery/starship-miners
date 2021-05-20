function gangUnitsList(gangName) {
    if (gangName === undefined) {
        gangName = playerInfos.gang;
    }
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or">'+gangName.toUpperCase()+'</span><br>');

    let gangUnits = [];
    unitTypes.forEach(function(unit) {
        if (unit.levels[gangName] > 0 && unit.levels[gangName] < 50) {
            if ((unit.cat != 'buildings' && unit.cat != 'devices') || unit.levels[gangName] > 2) {
                let newUnit = {};
                newUnit.name = unit.name;
                newUnit.id = unit.id;
                newUnit.level = unit.levels[gangName];
                newUnit.hp = unit.hp;
                if (unit.kind === gangName) {
                    newUnit.sort = 1;
                } else if (unit.cat === 'infantry') {
                    newUnit.sort = 2;
                } else if (unit.cat === 'vehicles' && !unit.skills.includes('transorbital')) {
                    newUnit.sort = 3;
                } else if (!unit.skills.includes('transorbital')) {
                    newUnit.sort = 4;
                } else {
                    newUnit.sort = 5;
                }
                newUnit.bldReq = unit.bldReq;
                newUnit.cat = unit.cat;
                newUnit.kind = unit.kind;
                let newCompReq = {};
                if (unit.compHardReq != undefined) {
                    if (Object.keys(unit.compHardReq).length >= 1) {
                        Object.entries(unit.compHardReq).map(entry => {
                            let key = entry[0];
                            let value = entry[1];
                            newCompReq[key] = value;
                        });
                    }
                }
                if (!unit.compPass.includes(gangName)) {
                    if (unit.compReq != undefined) {
                        if (Object.keys(unit.compReq).length >= 1) {
                            Object.entries(unit.compReq).map(entry => {
                                let key = entry[0];
                                let value = entry[1];
                                newCompReq[key] = value;
                            });
                        }
                    }
                }
                newUnit.compReq = newCompReq;
                gangUnits.push(newUnit);
            }
        }
    });

    let sortedGangUnits = _.sortBy(gangUnits,'name');
    sortedGangUnits = _.sortBy(sortedGangUnits,'hp');
    sortedGangUnits = _.sortBy(sortedGangUnits,'sort');
    sortedGangUnits = _.sortBy(sortedGangUnits,'level');
    sortedGangUnits.forEach(function(unit) {
        let color = catColor(unit.cat,unit.kind);
        let compNeed = '';
        if (Object.keys(unit.compReq).length >= 1) {
            compNeed = toCoolString(unit.compReq);
        }
        let bldNeed = '';
        if (Object.keys(unit.bldReq).length >= 1) {
            bldNeed = toNiceString(unit.bldReq);
        }
        $('#conUnitList').append('<span class="paramUnitName '+color+' klik" title="'+bldNeed+'" onclick="unitDetail('+unit.id+')">'+unit.name+'</span><span class="paramLevelValue cy">'+unit.level+'</span><span class="paramValue gf">'+compNeed+'</span><br>');
    });

    $('#conUnitList').append('<br><br>');
};
