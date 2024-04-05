function gangBldList() {
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
    $('#conUnitList').append('<span class="constName or">BATIMENTS</span><br>');
    $('#conUnitList').append('<br>');
    let sortedUnits = _.sortBy(unitTypes,'name');
    sortedUnits.forEach(function(unit) {
        if (unit.levels[playerInfos.gang] < 50) {
            if (unit.cat === 'buildings') {
                let color = catColor(unit);
                if (unit.bldReq.includes('Station') && color != 'hjaune') {
                    color = 'gff';
                }
                let reqString = displayUnitReqs(unit,false);
                $('#conUnitList').append('<span class="paramName '+color+' klik" title="'+reqString+'" onclick="unitDetail('+unit.id+')">'+unit.name+'</span><br>');
            }
        }
    });
    $('#conUnitList').append('<br><br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

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
    $('#conUnitList').append('<span class="constName or">UNITES '+gangName.toUpperCase()+'</span><br>');
    $('#conUnitList').append('<span class="constName">'+playerInfos.gangXP+' / '+getNextLevelPop()+'</span><br>');
    $('#conUnitList').append('<br>');
    let gangUnits = [];
    unitTypes.forEach(function(unit) {
        if (unit.levels[gangName] > 0 && unit.levels[gangName] < 50) {
            if ((unit.cat != 'buildings' && unit.cat != 'devices') || unit.levels[gangName] > 2) {
                let newUnit = {};
                newUnit.name = unit.name;
                newUnit.pName = unit.pName;
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
                // newUnit.compPass = unit.compPass;
                let newCompReq = {};
                let newAltCompReq = {};
                if (unit.compHardReq != undefined) {
                    if (Object.keys(unit.compHardReq).length >= 1) {
                        Object.entries(unit.compHardReq).map(entry => {
                            let key = entry[0];
                            let value = entry[1];
                            newCompReq[key] = value;
                            newAltCompReq[key] = value;
                        });
                    }
                }
                if (!unit.compPass.includes(gangName)) {
                    if (unit.compReq != undefined) {
                        if (Object.keys(unit.compReq).length >= 1) {
                            Object.entries(unit.compReq).map(entry => {
                                let key = entry[0];
                                let value = entry[1];
                                if (newCompReq[key] === undefined) {
                                    newCompReq[key] = value;
                                } else {
                                    if (value > newCompReq[key]) {
                                        newCompReq[key] = value;
                                    }
                                }
                            });
                        }
                    }
                    if (unit.altCompReq != undefined) {
                        if (Object.keys(unit.altCompReq).length >= 1) {
                            Object.entries(unit.altCompReq).map(entry => {
                                let key = entry[0];
                                let value = entry[1];
                                if (newAltCompReq[key] === undefined) {
                                    newAltCompReq[key] = value;
                                } else {
                                    if (value > newAltCompReq[key]) {
                                        newAltCompReq[key] = value;
                                    }
                                }
                            });
                        } else {
                            newAltCompReq = {};
                        }
                    } else {
                        newAltCompReq = {};
                    }
                }
                newUnit.compReq = newCompReq;
                if (Object.keys(newAltCompReq).length >= 1) {
                    newUnit.altCompReq = newAltCompReq;
                }
                gangUnits.push(newUnit);
            }
        }
    });
    let sortedGangUnits = _.sortBy(gangUnits,'name');
    sortedGangUnits = _.sortBy(sortedGangUnits,'hp');
    sortedGangUnits = _.sortBy(sortedGangUnits,'sort');
    sortedGangUnits = _.sortBy(sortedGangUnits,'level');
    sortedGangUnits.forEach(function(unit) {
        let fullUnit = getBatTypeByName(unit.name);
        let color = catColor(fullUnit);
        let lvlcol = 'cy';
        let lvlNeed = '&#9989;';
        if (playerInfos.gLevel < unit.level) {
            lvlcol = 'gf';
            lvlNeed = '&#9940;';
        }
        let compNeed = '&#9989;';
        if (Object.keys(unit.compReq).length >= 1) {
            let compReqOK = checkUnitCompReq(fullUnit,false);
            if (!compReqOK) {
                compNeed = '&#9940;';
                lvlcol = 'gff';
            }
        }
        let bldNeed = '&#9989;';
        if (Object.keys(unit.bldReq).length >= 1) {
            let bldOK = false;
            if ((playerInfos.bldList.includes(unit.bldReq[0]) || unit.bldReq[0] === undefined) && (playerInfos.bldList.includes(unit.bldReq[1]) || unit.bldReq[1] === undefined) && (playerInfos.bldList.includes(unit.bldReq[2]) || unit.bldReq[2] === undefined)) {
                bldOK = true;
            }
            if (!bldOK) {
                bldNeed = '&#9940;';
                lvlcol = 'gf';
            }
        }
        let reqString = displayUnitReqs(fullUnit,false);
        reqString = unit.name+' '+reqString;
        let unitName = unit.name;
        if (unit.pName != undefined) {
            unitName = unit.pName;
        }
        let missingComps = getMissingComps(unit);
        let compReqString = toCoolString(missingComps,true,false);
        let compReqFullString = toCoolString(missingComps,true,false);
        compReqFullString = replaceCompNamesByFullNames(compReqFullString);
        if (Object.keys(missingComps).length > 2) {
            // compReqString = toCoolString(Object.keys(missingComps)[0],true,false);
            compReqString = Object.keys(missingComps)[0]+"="+Object.values(missingComps)[0];
            compReqString = compReqString+' <span class="gf">& autres</span>';
        }
        if (compReqString === 'Rien') {
            compReqString = '';
        } else {
            compReqString = '<span title="Compétences manquantes: '+compReqFullString+'"> &#128161; '+compReqString+'</span>';
        }
        $('#conUnitList').append('<span class="paramUnitName '+color+' klik" title="'+reqString+'" onclick="unitDetail('+unit.id+')">'+unitName+'</span><span class="paramLevelValue '+lvlcol+'">'+unit.level+'</span><span class="paramValue" title="Niveau">'+lvlNeed+'</span> <span class="paramValue" title="Compétences">'+compNeed+'</span> <span class="paramValue" title="Bâtiments">'+bldNeed+'</span> <span class="gff">'+compReqString+'</span><br>');
    });
    $('#conUnitList').append('<br><br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function getMissingComps(unit) {
    let missingComps = {};
    let numMiss = 0;
    let missingAltComps = {};
    let numAltMiss = 0;
    let compReqOK = true;
    // compReq
    if (unit.compReq != undefined) {
        if (Object.keys(unit.compReq).length >= 1) {
            Object.entries(unit.compReq).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (playerInfos.comp[key] < value) {
                    compReqOK = false;
                }
            });
        }
    }
    // altCompReq
    if (!compReqOK) {
        if (unit.altCompReq != undefined) {
            if (Object.keys(unit.altCompReq).length >= 1) {
                compReqOK = true;
                Object.entries(unit.altCompReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (playerInfos.comp[key] < value) {
                        compReqOK = false;
                    }
                });
            }
        }
    }
    if (!compReqOK) {
        // compReq
        if (unit.compReq != undefined) {
            if (Object.keys(unit.compReq).length >= 1) {
                Object.entries(unit.compReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (playerInfos.comp[key] < value) {
                        missingComps[key] = value;
                        numMiss = numMiss+getMissingCompPoints(key,value);
                    }
                });
            }
        }
        // altCompReq
        if (unit.altCompReq != undefined) {
            if (Object.keys(unit.altCompReq).length >= 1) {
                Object.entries(unit.altCompReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (playerInfos.comp[key] < value) {
                        missingAltComps[key] = value;
                        numAltMiss = numAltMiss+getMissingCompPoints(key,value);
                    }
                });
            }
        }
        if (numMiss > numAltMiss && Object.keys(missingAltComps).length >= 1) {
            missingComps = missingAltComps;
        }
    }
    return missingComps;
};

function getMissingCompPoints(key,value) {
    let points = 0;
    let comp = getCompByName(key);
    let nextLevel = playerInfos.comp[key]+1;
    let nextCost = comp.lvlCosts[nextLevel];
    if (nextCost === 2) {
        points = points+3;
    } else {
        points = points+1;
    }
    if (nextLevel < value && nextLevel < comp.maxLevel) {
        nextLevel = nextLevel+1;
        nextCost = comp.lvlCosts[nextLevel];
        if (nextCost === 2) {
            points = points+3;
        } else {
            points = points+1;
        }
    }
    if (nextLevel < value && nextLevel < comp.maxLevel) {
        nextLevel = nextLevel+1;
        nextCost = comp.lvlCosts[nextLevel];
        if (nextCost === 2) {
            points = points+3;
        } else {
            points = points+1;
        }
    }
    if (nextLevel < value && nextLevel < comp.maxLevel) {
        nextLevel = nextLevel+1;
        nextCost = comp.lvlCosts[nextLevel];
        if (nextCost === 2) {
            points = points+3;
        } else {
            points = points+1;
        }
    }
    if (nextLevel < value && nextLevel < comp.maxLevel) {
        nextLevel = nextLevel+1;
        nextCost = comp.lvlCosts[nextLevel];
        if (nextCost === 2) {
            points = points+3;
        } else {
            points = points+1;
        }
    }
    return points;
};
