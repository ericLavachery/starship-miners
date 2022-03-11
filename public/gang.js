function gangUnitsList(gangName) {
    if (gangName === undefined) {
        gangName = playerInfos.gang;
    }
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","1000px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or">'+gangName.toUpperCase()+'</span><br>');
    $('#conUnitList').append('<span class="constName">'+playerInfos.gangXP+' / '+getNextLevelPop()+'</span><br>');
    $('#conUnitList').append('<br>');
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
                newUnit.skills = unit.skills;
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
                // Taupes/Blades
                if (unit.name === 'Taupes' && (playerInfos.gang === 'blades' || playerInfos.gang === 'brasier' || playerInfos.gang === 'drogmulojs' || playerInfos.gang === 'rednecks')) {
                    newCompReq['aero'] = 1;
                    newCompReq['cyber'] = 1;
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
        let color = catColor(unit);
        let lvlcol = 'cy';
        let compcol = 'gf';
        if (playerInfos.gLevel < unit.level) {
            lvlcol = 'gf';
        }
        let compNeed = '';
        if (Object.keys(unit.compReq).length >= 1) {
            compNeed = toCoolString(unit.compReq);
            let compReqOK = checkUnitCompReq(unit,true);
            if (!compReqOK) {
                lvlcol = 'gff';
                compcol = 'gff';
            }
        }
        let bldNeed = '';
        if (Object.keys(unit.bldReq).length >= 1) {
            bldNeed = toNiceString(unit.bldReq);
            let bldOK = false;
            if ((playerInfos.bldList.includes(unit.bldReq[0]) || unit.bldReq[0] === undefined) && (playerInfos.bldList.includes(unit.bldReq[1]) || unit.bldReq[1] === undefined) && (playerInfos.bldList.includes(unit.bldReq[2]) || unit.bldReq[2] === undefined)) {
                bldOK = true;
            }
            if (!bldOK) {
                lvlcol = 'gf';
            }
        }
        $('#conUnitList').append('<span class="paramUnitName '+color+' klik" title="'+bldNeed+'" onclick="unitDetail('+unit.id+')">'+unit.name+'</span><span class="paramLevelValue '+lvlcol+'">'+unit.level+'</span><span class="paramValue '+compcol+'">'+compNeed+'</span><br>');
    });
    $('#conUnitList').append('<br><br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};
