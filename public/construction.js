function bfconst(cat,triche,upgrade) {
    conselCat = cat;
    conselTriche = triche;
    conselUpgrade = upgrade;
    let catz = [cat];
    if (cat === 'buildings') {
        catz.push('devices');
    }
    if (cat === 'units') {
        catz.push('infantry');
        catz.push('vehicles');
    }
    selectMode();
    if (Object.keys(conselUnit).length >= 1) {
        cursorSwitch('.','grid-item','thor');
    }
    // findLanders();
    checkReserve();
    let dispoCrim = getDispoCrim();
    let dispoCit = getDispoCit();
    updateBldList();
    $("#conUnitList").css("display","block");
    if (!playerInfos.onShip) {
        $("#conAmmoList").css("display","block");
        $('#conUnitList').css("height","300px");
    } else {
        $('#conUnitList').css("height","700px");
    }
    $('#conUnitList').empty();
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    let color = '';
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<br><span class="constName neutre" id="gentils">Citoyens disponibles: <span class="gff">'+dispoCit+'</span> &ndash; <span class="brunf">'+dispoCrim+'</span></span><br>');
    let lastKind = '';
    let showkind = '';
    let allUnitsList = unitTypes.slice();
    let sortedUnitsList = _.sortBy(_.sortBy(_.sortBy(allUnitsList,'name'),'cat'),'kind');
    // MENU
    if (triche) {
        $('#conUnitList').append('<br><span class="constName or" id="gentils">LES GENTILS</span><br>');
        sortedUnitsList.forEach(function(unit) {
            if (lastKind != unit.kind) {
                showkind = unit.kind.replace(/zero-/g,"");
                showkind = showkind.replace(/trans-/g,"");
                $('#conUnitList').append('<a href="#kind-'+unit.kind+'"><span class="constMenu mlow klik">'+showkind+'</span></a>&nbsp;&middot;&nbsp;');
            }
            lastKind = unit.kind;
        });
        $('#conUnitList').append('<a href="#mechants"><span class="constMenu mlow klik">aliens</span></a>');
        $('#conUnitList').append('<br>');
    }
    // LIST
    let prodSign = ' <span class="ciel">&raquo;</span>';
    let prodOK = false;
    let prodHere = false;
    let mayOut = false;
    let compReqOK = false;
    let bldOK = false;
    let costOK = false;
    let costString = '';
    let unitMergedCosts;
    sortedUnitsList.forEach(function(unit) {
        console.log(unit.name);
        mayOut = checkMayOut(unit);
        prodOK = true;
        if (unit.levels[playerInfos.gang] > playerInfos.gLevel) {
            prodOK = false;
        }
        compReqOK = checkUnitCompReq(unit);
        if (!compReqOK) {
            prodOK = false;
        }
        if (playerInfos.onShip && unit.skills.includes('nostation')) {
            prodOK = false;
        }
        if (!triche) {
            if (catz.includes(unit.cat) && unit.fabTime >= 1) {
                prodHere = true;
            }
            if (selectedBatType.skills.includes('transorbital')) {
                prodHere = true;
            }
            if (!selectedBatType.skills.includes('transorbital')) {
                if (!unit.bldReq.includes(selectedBatType.name)) {
                    if (selectedBatType.cat === 'buildings' || selectedBatType.cat === 'devices') {
                        prodHere = false;
                    } else {
                        if (unit.cat === 'vehicles' || unit.cat === 'infantry') {
                            prodHere = false;
                        }
                    }
                    if (unit.cat === 'vehicles' || unit.cat === 'infantry') {
                        if (unit.bldReq[0] != undefined) {
                            prodHere = false;
                        }
                    }
                    if (selectedBatType.cat === 'infantry' && unit.fabTime >= 35 && !unit.skills.includes('clicput')) {
                        prodHere = false;
                    }
                }
            }
            if (unit.bldCost != 'none' && unit.bldCost != selectedBatType.name) {
                prodHere = false;
            }
            if (unit.unitCost != 'none' && unit.unitCost != selectedBatType.name) {
                prodHere = false;
            }
            if (conselUpgrade === 'bld') {
                if (selectedBatType.bldUp === unit.name) {
                    prodHere = true;
                } else {
                    prodHere = false;
                }
            }
            if (conselUpgrade === 'inf') {
                if (selectedBatType.unitUp === unit.name) {
                    prodHere = true;
                } else {
                    prodHere = false;
                }
            }
        }
        console.log('prodOK='+prodOK);
        console.log('prodHere='+prodHere);
        console.log('mayOut='+mayOut);
        if ((prodOK && prodHere && mayOut) || triche) {
            if (lastKind != unit.kind) {
                showkind = unit.kind.replace(/zero-/g,"");
                showkind = showkind.replace(/trans-/g,"");
                $('#conUnitList').append('<br><a href="#gentils"><span class="constName or" id="kind-'+unit.kind+'">'+showkind+'</span></a><br>');
            }
            if (conselUnit.id === unit.id && conselUnit.cat != 'aliens') {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
            } else {
                if (unit.levels[playerInfos.gang] <= 90) {
                    let native = true;
                    if (Object.keys(unit.levels).length >= 1) {
                        Object.entries(unit.levels).map(entry => {
                            let key = entry[0];
                            let value = entry[1];
                            if (key != playerInfos.gang && value <= 90) {
                                native = false;
                            }
                        });
                    } else {
                        native = false;
                    }
                    if (native) {
                        $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle ncy"></i></span>');
                    } else {
                        $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle gf"></i></span>');
                    }
                } else {
                    $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle gfff"></i></span>');
                }
            }
            bldOK = false;
            if ((playerInfos.bldList.includes(unit.bldReq[0]) || unit.bldReq[0] === undefined) && (playerInfos.bldList.includes(unit.bldReq[1]) || unit.bldReq[1] === undefined) && (playerInfos.bldList.includes(unit.bldReq[2]) || unit.bldReq[2] === undefined)) {
                bldOK = true;
            }
            costOK = checkUnitCost(unit,true,true);
            unitMergedCosts = mergedUnitCosts(unit);
            costString = '';
            if (unit.costs != undefined) {
                costString = displayCosts(unitMergedCosts);
            }
            prodSign = ' <span class="ciel">&raquo;</span>';
            if (!prodOK) {
                prodSign = '';
            }
            // console.log(unit.name);
            // console.log(unitMergedCosts);
            // console.log(costOK);
            let unitCits = unit.squads*unit.crew*unit.squadSize;
            if (unit.skills.includes('clone')) {
                unitCits = 0;
            }
            let citColour = 'gff';
            if (unit.skills.includes('brigands')) {
                citColour = 'brunf';
            }
            let deco = '';
            if (playerInfos.bldList.includes(unit.name)) {
                deco = ' udl';
            }
            if ((bldOK && costOK) || triche) {
                color = catColor(unit);
                $('#conUnitList').append('<span class="constName klik '+color+deco+'" title="'+toNiceString(unit.bldReq)+' '+costString+'" onclick="conSelect('+unit.id+',`player`,false)">'+unit.name+' <span class="'+citColour+'">('+unitCits+')</span>'+prodSign+'</span><br>');
            } else {
                color = 'gff';
                $('#conUnitList').append('<span class="constName '+color+deco+'" title="'+toNiceString(unit.bldReq)+' '+costString+'">'+unit.name+' <span class="'+citColour+'">('+unitCits+')</span>'+prodSign+'</span><br>');
            }
            lastKind = unit.kind;
        }
    });
    if (triche) {
        $('#conUnitList').append('<br><a href="#gentils"><span class="constName or" id="mechants">LES MECHANTS</span></a><br><br>');
        let allALiensList = alienUnits.slice();
        let sortedAliensList = _.sortBy(_.sortBy(_.sortBy(allALiensList,'name'),'name'),'kind');
        sortedAliensList.forEach(function(unit) {
            if (conselUnit.id === unit.id && conselUnit.cat === 'aliens') {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
            } else {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle gfff"></i></span>');
            }
            color = catColor(unit);
            $('#conUnitList').append('<span class="constName klik '+color+'" onclick="conSelect('+unit.id+',`aliens`,false)">'+unit.name+'</span><br>');
        });
    }
    $('#conUnitList').append('<br>');
    commandes();
};

function displayCosts(costs) {
    let costString = '{'
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            costString = costString+key;
            if (value > playerInfos.reserve[key]) {
                costString = costString+'?';
            }
            costString = costString+':'+value+'/'+playerInfos.reserve[key];
            if (value > playerInfos.reserve[key]) {
                costString = costString+'!';
            }
            costString = costString+' &middot; ';
        });
    }
    costString = costString.slice(0,-10);
    costString = costString+'}';
    return costString;
};

function catColor(unit) {
    if (unit.cat === 'aliens') {
        if (unit.kind === 'bug') {
            return 'rose';
        }
        if (unit.kind === 'spider') {
            return 'vert';
        }
        if (unit.kind === 'larve') {
            return 'brun';
        }
        if (unit.kind === 'swarm') {
            return 'jaune';
        }
    }
    if (unit.skills.includes('transorbital') && unit.name != 'Soute') {
        return 'bleu';
    }
    if (unit.cat === 'infantry') {
        return 'jaune';
    }
    if (unit.cat === 'vehicles') {
        return 'vert';
    }
    if (unit.cat === 'buildings') {
        return 'rose';
    }
    if (unit.cat === 'devices') {
        return 'vio';
    }
};

function conSelect(unitId,player,noRefresh) {
    if (!noRefresh) {
        conselAmmos = ['xxx','xxx','xxx','xxx'];
    }
    conselPut = false;
    if (player === 'player') {
        let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
        conselUnit = unitTypes[unitIndex];
        conselCosts = mergedUnitCosts(conselUnit);
        console.log(conselUnit.name);
        console.log(conselCosts);
    } else {
        let unitIndex = alienUnits.findIndex((obj => obj.id == unitId));
        conselUnit = alienUnits[unitIndex];
    }
    // console.log(conselUnit);
    $('#conAmmoList').empty();
    $('#conAmmoList').append('<br>');
    let armorIndex;
    let batArmor;
    let armorSkills = '';
    let listNum = 1;
    let bldReqOK = false;
    let compReqOK = false;
    let costsOK = false;
    let flatCosts;
    let deployCosts;
    let fullCosts;
    // ARMOR ---------------------------------------------
    if (conselUnit.protection != undefined) {
        if (conselUnit.protection.length >= 1) {
            // console.log(conselUnit.protection);
            if (conselUnit.cat === 'infantry') {
                $('#conAmmoList').append('<span class="constName or">Armure</span><br>');
            } else {
                $('#conAmmoList').append('<span class="constName or">Blindage (renforcement)</span><br>');
            }
            conselUnit.protection.forEach(function(armor) {
                armorIndex = armorTypes.findIndex((obj => obj.name == armor));
                batArmor = armorTypes[armorIndex];
                compReqOK = checkCompReq(batArmor);
                if (compReqOK || conselTriche) {
                    if (conselAmmos[2] == armor || (conselAmmos[2] === 'xxx' && listNum === 1)) {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                    } else {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                    }
                    armorSkills = '';
                    if (batArmor.skills.includes('slowreg')) {
                        armorSkills = armorSkills+' slowreg';
                    }
                    if (batArmor.skills.includes('resistacide')) {
                        armorSkills = armorSkills+' resistacide';
                    }
                    if (batArmor.skills.includes('resistfeu')) {
                        armorSkills = armorSkills+' resistfeu';
                    }
                    if (batArmor.skills.includes('resistall')) {
                        armorSkills = armorSkills+' resistall';
                    }
                    flatCosts = getCosts(conselUnit,batArmor,0,'equip');
                    deployCosts = getDeployCosts(conselUnit,batArmor,0,'equip');
                    mergeObjects(flatCosts,deployCosts);
                    costsOK = checkCost(flatCosts);
                    bldReqOK = false;
                    if (playerInfos.bldList.includes(batArmor.bldReq[0]) || batArmor.bldReq[0] === undefined || conselUnit.name === batArmor.bldReq[0]) {
                        bldReqOK = true;
                    }
                    prodSign = ' <span class="ciel">&raquo;</span>';
                    if (!compReqOK) {
                        prodSign = '';
                    }
                    if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+toNiceString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'" onclick="selectArmor(`'+armor+'`,`'+unitId+'`)">'+armor+prodSign+' <span class="gff">(+'+batArmor.armor+'/'+batArmor.ap+')'+armorSkills+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'">'+armor+prodSign+' <span class="gff">(+'+batArmor.armor+'/'+batArmor.ap+')'+armorSkills+'</span></span><br>');
                    }
                }
                listNum++;
            });
        }
    }
    let equipIndex;
    let batEquip;
    let weapName;
    let equipNotes;
    listNum = 1;
    // EQUIP ---------------------------------------------
    if (conselUnit.equip != undefined) {
        if (conselUnit.equip.length >= 1) {
            // console.log(conselUnit.equip);
            $('#conAmmoList').append('<span class="constName or">Equipement</span><br>');
            conselUnit.equip.forEach(function(equip) {
                equipIndex = armorTypes.findIndex((obj => obj.name == equip));
                batEquip = armorTypes[equipIndex];
                compReqOK = checkCompReq(batEquip);
                if (compReqOK || conselTriche) {
                    if (conselAmmos[3] == equip || (conselAmmos[3] === 'xxx' && listNum === 1) || (playerInfos.comp.log === 3 && conselUnit.log3eq === equip && compReqOK)) {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                    } else {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                    }
                    weapName = '';
                    equipNotes = '';
                    if (batEquip.skills != undefined) {
                        equipNotes = batEquip.skills;
                    }
                    if (equip.endsWith('1')) {
                        weapName = ' ('+conselUnit.weapon.name+')';
                    } else if (equip.endsWith('2')) {
                        weapName = ' ('+conselUnit.weapon2.name+')';
                    }
                    if (equip.startsWith('w2-') || equip.startsWith('kit-')) {
                        weapName = ' ('+conselUnit.weapon2.name+')';
                    }
                    if (equip.startsWith('w1-') && !equip.includes('auto')) {
                        weapName = ' ('+conselUnit.weapon.name+')';
                    }
                    flatCosts = getCosts(conselUnit,batEquip,0,'equip');
                    deployCosts = getDeployCosts(conselUnit,batEquip,0,'equip');
                    // console.log('EQUIP');
                    // console.log(flatCosts);
                    // console.log(deployCosts);
                    mergeObjects(flatCosts,deployCosts);
                    // console.log('merge');
                    // console.log(flatCosts);
                    costsOK = checkCost(flatCosts);
                    bldReqOK = false;
                    if ((playerInfos.bldList.includes(batEquip.bldReq[0]) || batEquip.bldReq[0] === undefined || conselUnit.name === batEquip.bldReq[0]) && (playerInfos.bldList.includes(batEquip.bldReq[1]) || batEquip.bldReq[1] === undefined || conselUnit.name === batEquip.bldReq[1])) {
                        bldReqOK = true;
                    }
                    prodSign = ' <span class="ciel">&raquo;</span>';
                    if (!compReqOK) {
                        prodSign = '';
                    }
                    if (playerInfos.comp.log === 3 && conselUnit.log3eq === equip && compReqOK) {
                        $('#conAmmoList').append('<span class="constName" title="'+showEquipInfo(equip)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+showEquipInfo(equip)+' '+displayCosts(flatCosts)+'" onclick="selectEquip(`'+equip+'`,`'+unitId+'`)">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName gff" title="'+toNiceString(batEquip.bldReq)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    }
                }
                listNum++;
            });
        }
    }
    let ammoIndex;
    let batAmmo;
    // AMMO WEAP 1 ---------------------------------------------
    let hasW1 = checkHasWeapon(1,conselUnit,conselAmmos[3]);
    listNum = 1;
    if (hasW1) {
        if (Object.keys(conselUnit.weapon).length >= 1) {
            if (conselUnit.weapon.ammo.length >= 1) {
                $('#conAmmoList').append('<span class="constName or">'+conselUnit.weapon.name+'</span><br>');
                conselUnit.weapon.ammo.forEach(function(ammo) {
                    ammoIndex = ammoTypes.findIndex((obj => obj.name == ammo));
                    batAmmo = ammoTypes[ammoIndex];
                    compReqOK = checkCompReq(batAmmo);
                    if (compReqOK || conselTriche) {
                        if (conselAmmos[0] == ammo || (conselAmmos[0] === 'xxx' && listNum === 1)) {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        } else {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        }
                        deployCosts = getDeployCosts(conselUnit,batAmmo,1,'ammo');
                        flatCosts = getCosts(conselUnit,batAmmo,1,'ammo');
                        mergeObjects(deployCosts,flatCosts);
                        costsOK = checkCost(deployCosts);
                        bldReqOK = false;
                        if (batAmmo.bldReq instanceof Array) {
                            if ((playerInfos.bldList.includes(batAmmo.bldReq[0]) || batAmmo.bldReq[0] === undefined || conselUnit.name === batAmmo.bldReq[0]) && (playerInfos.bldList.includes(batAmmo.bldReq[1]) || batAmmo.bldReq[1] === undefined || conselUnit.name === batAmmo.bldReq[1])) {
                                bldReqOK = true;
                            }
                        } else {
                            bldReqOK = true;
                        }
                        prodSign = ' <span class="ciel">&raquo;</span>';
                        if (!compReqOK) {
                            prodSign = '';
                        }
                        if ((bldReqOK && costsOK) || conselTriche) {
                            $('#conAmmoList').append('<span class="constName klik" title="'+showAmmoInfo(ammo)+' '+displayCosts(deployCosts)+'" onclick="selectAmmo(`'+ammo+'`,`w1`,`'+unitId+'`)">'+showAmmo(ammo)+prodSign+'</span><br>');
                        } else {
                            $('#conAmmoList').append('<span class="constName gff" title="'+toNiceString(batAmmo.bldReq)+' '+displayCosts(deployCosts)+'">'+showAmmo(ammo)+prodSign+'</span><br>');
                        }
                    }
                    listNum++;
                });
            }
        }
    }
    // AMMO WEAP 2 ---------------------------------------------
    let hasW2 = checkHasWeapon(2,conselUnit,conselAmmos[3]);
    listNum = 1;
    if (hasW2) {
        if (Object.keys(conselUnit.weapon2).length >= 1 && !conselUnit.skills.includes('unemun')) {
            if (conselUnit.weapon2.ammo.length >= 1) {
                $('#conAmmoList').append('<span class="constName or">'+conselUnit.weapon2.name+'</span><br>');
                conselUnit.weapon2.ammo.forEach(function(ammo) {
                    ammoIndex = ammoTypes.findIndex((obj => obj.name == ammo));
                    batAmmo = ammoTypes[ammoIndex];
                    compReqOK = checkCompReq(batAmmo);
                    if (compReqOK || conselTriche) {
                        if (conselAmmos[1] == ammo || (conselAmmos[1] === 'xxx' && listNum === 1)) {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        } else {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        }
                        deployCosts = getDeployCosts(conselUnit,batAmmo,2,'ammo');
                        flatCosts = getCosts(conselUnit,batAmmo,2,'ammo');
                        mergeObjects(deployCosts,flatCosts);
                        costsOK = checkCost(deployCosts);
                        bldReqOK = false;
                        if (batAmmo.bldReq instanceof Array) {
                            if ((playerInfos.bldList.includes(batAmmo.bldReq[0]) || batAmmo.bldReq[0] === undefined || conselUnit.name === batAmmo.bldReq[0]) && (playerInfos.bldList.includes(batAmmo.bldReq[1]) || batAmmo.bldReq[1] === undefined || conselUnit.name === batAmmo.bldReq[1])) {
                                bldReqOK = true;
                            }
                        } else {
                            bldReqOK = true;
                        }
                        prodSign = ' <span class="ciel">&raquo;</span>';
                        if (!compReqOK) {
                            prodSign = '';
                        }
                        if ((bldReqOK && costsOK) || conselTriche) {
                            $('#conAmmoList').append('<span class="constName klik" title="'+showAmmoInfo(ammo)+' '+displayCosts(deployCosts)+'" onclick="selectAmmo(`'+ammo+'`,`w2`,`'+unitId+'`)">'+showAmmo(ammo)+prodSign+'</span><br>');
                        } else {
                            $('#conAmmoList').append('<span class="constName gff" title="'+toNiceString(batAmmo.bldReq)+' '+displayCosts(deployCosts)+'">'+showAmmo(ammo)+prodSign+'</span><br>');
                        }
                    }
                    listNum++;
                });
            }
        }
    }
    bfconst(conselCat,conselTriche,conselUpgrade);
};

function selectAmmo(ammo,weapon,unitId) {
    if (conselUnit.skills.includes('unemun')) {
        conselAmmos[0] = ammo;
        conselAmmos[1] = ammo;
    } else {
        if (weapon === 'w1') {
            conselAmmos[0] = ammo;
        } else {
            conselAmmos[1] = ammo;
        }
    }
    // console.log(conselAmmos);
    conSelect(unitId,'player',true);
};

function selectArmor(armor,unitId) {
    conselAmmos[2] = armor;
    // console.log(conselAmmos);
    conSelect(unitId,'player',true);
};

function selectEquip(equip,unitId) {
    conselAmmos[3] = equip;
    // console.log(conselAmmos);
    conSelect(unitId,'player',true);
};

function checkUnitCompReq(unit,forGangList) {
    let compReqOK = true;
    if (forGangList) {
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
    } else {
        if (!unit.compPass.includes(playerInfos.gang)) {
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
        }
        if (unit.compHardReq != undefined) {
            if (Object.keys(unit.compHardReq).length >= 1) {
                Object.entries(unit.compHardReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (playerInfos.comp[key] < value) {
                        compReqOK = false;
                    }
                });
            }
        }
    }
    // Taupes/Blades
    if (unit.name === 'Taupes' && playerInfos.gang === 'blades') {
        if (playerInfos.comp.aero < 1 || playerInfos.comp.cyber < 1) {
            compReqOK = false;
        }
    }
    return compReqOK;
};

function checkCompReq(batEquip) {
    let compReqOK = true;
    if (batEquip.compReq != undefined) {
        if (Object.keys(batEquip.compReq).length >= 1) {
            Object.entries(batEquip.compReq).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (playerInfos.comp[key] < value) {
                    compReqOK = false;
                }
            });
        }
    }
    return compReqOK;
};

function checkUprankPlace(myBat,myBatType) {
    let isInPlace = false;
    let upBatType = getBatTypeByName(myBatType.unitUp);
    let uprankBld = upBatType.bldReq[0];
    let distance;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.name === uprankBld) {
                distance = calcDistance(myBat.tileId,bat.tileId);
                if (distance <= 1) {
                    isInPlace = true;
                }
            }
        }
    });
    return isInPlace;
};

function checkUprankXP(myBat,myBatType) {
    let isXPok = false;
    let levelNeeded = 2;
    if (myBat.xp >= levelXP[4]) {
        if (levelNeeded <= 4) {
            isXPok = true;
        }
    } else if (myBat.xp >= levelXP[3]) {
        if (levelNeeded <= 3) {
            isXPok = true;
        }
    } else if (myBat.xp >= levelXP[2]) {
        if (levelNeeded <= 2) {
            isXPok = true;
        }
    } else if (myBat.xp >= levelXP[1]) {
        if (levelNeeded <= 1) {
            isXPok = true;
        }
    }
    return isXPok;
};

function clickUpgrade(tileId) {
    if (tileId === selectedBat.tileId) {
        if (conselUpgrade === 'bld') {
            let myBatXP = selectedBat.xp;
            let myBatId = selectedBat.id;
            removeBat(selectedBat.id);
            putBat(tileId,0,myBatXP);
        }
        if (conselUpgrade === 'inf') {
            let myBatXP = Math.ceil(selectedBat.xp/4);
            let myBatId = selectedBat.id;
            removeBat(selectedBat.id);
            putBat(tileId,0,myBatXP);
        }
    } else {
        conselReset();
        $('#unitInfos').empty();
        $("#unitInfos").css("display","none");
        selectMode();
        batUnstack();
        batUnselect();
        conOut();
    }
};

function clickConstruct(tileId,free) {
    if (conselUpgrade === 'bld' || conselUpgrade === 'inf') {
        clickUpgrade(tileId);
    } else {
        let batHere = false;
        let message = '';
        let tile = getTileById(tileId);
        let landerRange = getLanderRange();
        bataillons.forEach(function(bat) {
            if (bat.tileId === tileId && bat.loc === "zone") {
                batHere = true;
                message = 'Pas de construction sur une case occupée par un de vos bataillons';
            }
        });
        aliens.forEach(function(bat) {
            if (bat.tileId === tileId && bat.loc === "zone") {
                batHere = true;
                message = 'Pas de construction sur une case occupée par un alien';
            }
        });
        if (conselUnit.cat === 'buildings') {
            let tile = getTileById(tileId);
            if (tile.infra != undefined && tile.infra != 'Débris') {
                batHere = true;
                message = 'Pas de construction de bâtiment sur une case occupée par une infrastructure';
            }
            if (tile.terrain === 'W' || tile.terrain === 'R') {
                if (!conselUnit.skills.includes('noblub')) {
                    batHere = true;
                    message = 'Cette unité ne peut pas être construite dans l\'eau';
                }
            }
        }
        if (conselUnit.skills.includes('transorbital')) {
            if (tile.x > 31+landerRange || tile.x < 31-landerRange || tile.y > 31+landerRange || tile.y < 31-landerRange) {
                batHere = true;
                message = 'Vous ne pouvez pas poser votre vaisseau à plus de '+landerRange+' cases du centre.';
            } else {
                let tileLandingOK = landerLandingOK(tile);
                if (!tileLandingOK) {
                    batHere = true;
                    message = 'Vous ne pouvez pas poser votre vaisseau sur ce type de terrain.';
                }
            }
        }
        if (!batHere) {
            if (!free && !playerInfos.onShip) {
                let distance = calcDistance(selectedBat.tileId,tileId);
                selectedBat.apLeft = selectedBat.apLeft-Math.round(selectedBatType.mecanoCost*conselUnit.fabTime/10)-(distance*3);
                if (!selectedBat.tags.includes('construction')) {
                    selectedBat.tags.push('construction');
                }
                tagDelete(selectedBat,'guet');
                camoOut();
                selectedBatArrayUpdate();
            }
            putBat(tileId,0,0);
            if (conselTriche) {
                bfconst(conselCat,conselTriche,conselUpgrade);
                $('#conAmmoList').empty();
            } else {
                conOut();
            }
        } else {
            conOut();
            $('#unitInfos').empty();
            $("#unitInfos").css("display","none");
            selectMode();
            batUnstack();
            batUnselect();
            warning('Construction avortée',message);
        }
    }
};

function conselNeat() {
    if (conselAmmos[0] == 'xxx') {
        if (Object.keys(conselUnit.weapon).length >= 1) {
            conselAmmos[0] = conselUnit.weapon.ammo[0];
        } else {
            conselAmmos[0] = 'none';
        }
    }
    if (conselAmmos[1] == 'xxx') {
        if (Object.keys(conselUnit.weapon2).length >= 1) {
            conselAmmos[1] = conselUnit.weapon2.ammo[0];
        } else {
            conselAmmos[1] = 'none';
        }
    }
    if (conselAmmos[2] == 'xxx') {
        conselAmmos[2] = 'aucune';
    }
    if (conselAmmos[3] == 'xxx') {
        conselAmmos[3] = 'aucun';
    }
};

function putBat(tileId,citoyens,xp,startTag,show) {
    console.log('PUTBAT');
    if (conselUnit.cat === 'aliens') {
        conselTriche = true;
    }
    if (show === undefined) {
        show = true;
    }
    if (Object.keys(conselUnit).length >= 1) {
        conselNeat();
        let costsOK = false;
        if (conselUnit.cat != 'aliens') {
            costsOK = checkAllCosts(conselUnit,conselAmmos,true,true);
        } else {
            costsOK = true;
        }
        if (costsOK || conselTriche) {
            // PAY COSTS !!!
            if (conselUnit.cat != 'aliens') {
                if (!conselTriche || playerInfos.pseudo === 'Payall') {
                    payUnitCost(conselUnit);
                    payFlatCosts(conselUnit,conselAmmos);
                    if (!playerInfos.onShip) {
                        payDeployCosts(conselUnit,conselAmmos);
                    }
                }
            }
            let tile = getTileById(tileId);
            console.log(conselUnit);
            let nextId;
            let team;
            if (conselUnit.cat != 'aliens') {
                if (bataillons.length >= 1) {
                    nextId = playerInfos.nextId;
                    playerInfos.nextId++;
                    // nextId = bataillons[bataillons.length-1].id+1;
                } else {
                    nextId = 1;
                    playerInfos.nextId = 2;
                }
                team = 'player';
            } else {
                if (aliens.length >= 1) {
                    nextId = aliens[aliens.length-1].id+1;
                } else {
                    nextId = 1;
                }
                team = 'aliens';
            }
            // console.log('next ID '+nextId);
            let newBat = {};
            newBat.id = nextId;
            newBat.type = conselUnit.name;
            newBat.typeId = conselUnit.id;
            newBat.team = team;
            newBat.creaTurn = playerInfos.mapTurn;
            newBat.loc = 'zone';
            newBat.locId = 0;
            newBat.tileId = tileId;
            newBat.oldTileId = tileId;
            if (citoyens >= 1) {
                newBat.citoyens = citoyens;
                newBat.squadsLeft = Math.ceil(citoyens/conselUnit.squadSize);
            } else {
                newBat.citoyens = conselUnit.citoyens;
                newBat.squadsLeft = conselUnit.squads;
            }
            newBat.damage = 0;
            newBat.camoAP = -1;
            // dumpers
            if (conselUnit.skills.includes('dumper')) {
                if (conselUnit.skills.includes('transorbital')) {
                    newBat.noDump = false;
                } else {
                    newBat.noDump = true;
                }
            }
            // Equip
            let equipName = conselAmmos[3];
            if (equipName === 'xxx') {
                equipName = 'aucun';
            }
            let batEquip = getEquipByName(equipName);
            newBat.eq = equipName;
            // log3eq
            newBat.logeq = '';
            if (playerInfos.comp.log === 3) {
                if (conselUnit.log3eq != undefined) {
                    if (conselUnit.log3eq != '') {
                        let logEquip = getEquipByName(conselUnit.log3eq);
                        let compReqOK = checkCompReq(logEquip);
                        if (compReqOK) {
                            newBat.logeq = logEquip.name;
                        }
                    }
                }
            }
            // Armor
            let armorName = conselAmmos[2];
            if (armorName === 'xxx') {
                armorName = 'aucune';
            }
            let batArmor = getEquipByName(armorName);
            newBat.prt = armorName;
            let gearStuff = getBatGearStuff(armorName,equipName,conselUnit);
            newBat.armor = gearStuff[0];
            newBat.ap = gearStuff[1];
            if (conselTriche || playerInfos.onShip) {
                newBat.apLeft = newBat.ap;
                newBat.oldapLeft = newBat.ap;
                newBat.salvoLeft = conselUnit.maxSalvo;
            } else {
                if (conselUnit.fabTime >= 1) {
                    if (conselUnit.skills.includes('clicput')) {
                        newBat.apLeft = 0;
                        newBat.oldapLeft = 0;
                        newBat.salvoLeft = 0;
                    } else {
                        let constFactor = 20;
                        if (conselUnit.cat === 'buildings' || conselUnit.cat === 'devices') {
                            if (!conselUnit.skills.includes('domeconst')) {
                                constFactor = constFactor*(playerInfos.comp.const+3)/3;
                            }
                        }
                        if (conselUnit.cat === 'vehicles') {
                            constFactor = constFactor*(playerInfos.comp.ind+2)/3;
                        }
                        if (conselUnit.cat === 'infantry') {
                            constFactor = constFactor*(playerInfos.comp.train+2)/3;
                        }
                        if (conselUnit.skills.includes('domeconst')) {
                            newBat.apLeft = conselUnit.ap-(Math.round(conselUnit.fabTime*conselUnit.ap/constFactor)*10);
                            newBat.oldapLeft = conselUnit.ap-(Math.round(conselUnit.fabTime*conselUnit.ap/constFactor)*10);
                        } else if (conselUnit.skills.includes('longconst')) {
                            newBat.apLeft = conselUnit.ap-(Math.round(conselUnit.fabTime*conselUnit.ap/constFactor)*3);
                            newBat.oldapLeft = conselUnit.ap-(Math.round(conselUnit.fabTime*conselUnit.ap/constFactor)*3);
                        } else {
                            newBat.apLeft = conselUnit.ap-Math.round(conselUnit.fabTime*conselUnit.ap/constFactor);
                            newBat.oldapLeft = conselUnit.ap-Math.round(conselUnit.fabTime*conselUnit.ap/constFactor);
                        }
                        newBat.salvoLeft = conselUnit.maxSalvo;
                    }
                } else {
                    newBat.apLeft = newBat.ap;
                    newBat.oldapLeft = newBat.ap;
                    newBat.salvoLeft = conselUnit.maxSalvo;
                }
            }
            // Munitions
            if (conselAmmos[0] != 'xxx') {
                newBat.ammo = conselAmmos[0];
            } else {
                if (Object.keys(conselUnit.weapon).length >= 1) {
                    newBat.ammo = conselUnit.weapon.ammo[0];
                } else {
                    newBat.ammo = 'none';
                }
            }
            newBat.ammoLeft = conselUnit.weapon.maxAmmo;
            if (conselAmmos[1] != 'xxx') {
                newBat.ammo2 = conselAmmos[1];
            } else {
                if (Object.keys(conselUnit.weapon2).length >= 1) {
                    newBat.ammo2 = conselUnit.weapon2.ammo[0];
                } else {
                    newBat.ammo2 = 'none';
                }
            }
            newBat.ammo2Left = conselUnit.weapon2.maxAmmo;
            newBat.vet = 0;
            newBat.xp = xp;
            if (conselUnit.skills.includes('robot')) {
                if (playerInfos.comp.ind === 1) {
                    newBat.xp = newBat.xp+levelXP[1];
                }
                if (playerInfos.comp.ind === 2) {
                    newBat.xp = newBat.xp+Math.ceil(levelXP[2]*3/4);
                }
                if (playerInfos.comp.ind === 3) {
                    newBat.xp = newBat.xp+levelXP[2];
                }
            } else {
                if (playerInfos.comp.train === 1) {
                    newBat.xp = newBat.xp+levelXP[1];
                }
                if (playerInfos.comp.train === 2) {
                    newBat.xp = newBat.xp+Math.ceil(levelXP[2]*3/4);
                }
            }
            if (Object.keys(conselUnit.weapon).length >= 1) {
                newBat.range = conselUnit.weapon.range;
                if (Object.keys(conselUnit.weapon2).length >= 1) {
                    if (conselUnit.weapon2.range > conselUnit.weapon.range) {
                        newBat.range = conselUnit.weapon2.range;
                    }
                }
            } else {
                newBat.range = 0;
            }
            if (conselUnit.sort != undefined) {
                if (startTag != undefined) {
                    if (startTag.includes('go')) {
                        newBat.sort = 0;
                    } else {
                        newBat.sort = conselUnit.sort;
                    }
                } else {
                    newBat.sort = conselUnit.sort;
                }
            } else {
                newBat.sort = newBat.range*10;
            }
            newBat.army = 0;
            newBat.fuzz = conselUnit.fuzz;
            if (conselUnit.transUnits >= 1) {
                newBat.transIds = [];
            }
            if (conselUnit.transRes >= 1) {
                newBat.transRes = {};
            }
            if (startTag != undefined) {
                if (startTag === 'veil') {
                    newBat.tags = ['invisible','veil'];
                } else {
                    newBat.tags = [startTag];
                }
            } else {
                newBat.tags = [];
            }
            let gearTags = getBatGearTags(armorName,equipName,conselUnit);
            newBat.tags.push.apply(newBat.tags,gearTags);
            if (!conselTriche && conselUnit.cat != 'aliens' && !playerInfos.onShip) {
                newBat.tags.push('construction');
            }
            if (conselUnit.skills.includes('hide') || (conselUnit.kind === 'larve' && larveHIDE)) {
                newBat.tags.push('invisible');
            }
            if (newBat.team === 'player') {
                bataillons.push(newBat);
                // console.log(bataillons);
                if (show) {
                    showBataillon(newBat);
                }
            } else {
                aliens.push(newBat);
                // console.log(aliens);
                showAlien(newBat);
            }
            if (tile.infra === 'Débris') {
                if (conselUnit.cat === 'buildings' || conselUnit.cat === 'devices') {
                    delete tile.infra;
                    // saveMap();
                }
            }
        } else {
            selectedBat.apLeft = selectedBat.apLeft+Math.round(selectedBatType.mecanoCost*conselUnit.fabTime/10)+8;
            selectedBatArrayUpdate();
            warning('Construction annulée:','Vous n\'avez pas les ressources nécessaires');
            console.log('not enough resources !');
        }
    } else {
        console.log('no conselUnit !');
    }
    conselReset();
};

function conOut() {
    if (myCompPoints <= 0) {
        $('#conUnitList').empty();
        $('#conAmmoList').empty();
        $('#conUnitList').css("height","300px");
        conselReset();
        showResOpen = false;
        $("#conUnitList").css("display","none");
        $("#conAmmoList").css("display","none");
        selectMode();
        if (Object.keys(selectedBat).length >= 1) {
            showBatInfos(selectedBat);
        }
    }
};

function conselReset() {
    conselUnit = {};
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    // conselCat = '';
    conselUpgrade = '';
    conselTriche = false;
    conselPut = false;
    conselCosts = {};
    selectMode();
}

// $("#minimap").css("display","block");

function conWindowOut() {
    if (myCompPoints <= 0) {
        $('#conUnitList').empty();
        $('#conAmmoList').empty();
        $("#conUnitList").css("display","none");
        $("#conAmmoList").css("display","none");
    }
};

function removeBat(batId) {
    selectMode();
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    batUnselect();
    batDeath(bat,false);
    let batIndex = batList.findIndex((obj => obj.id == batId));
    batList.splice(batIndex,1);
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    $('#b'+bat.tileId).append(resHere);
};

function dismantle(batId) {
    selectMode();
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    if (!batType.skills.includes('nodelete')) {
        // récup de ressources !!!!!!
        let isCharged = checkCharged(bat,'trans');
        let isLoaded = checkCharged(bat,'load');
        // let resFret = checkResLoad(bat);
        if (!isCharged && !isLoaded) {
            let tileId = bat.tileId;
            if (batType.cat === 'buildings' || batType.skills.includes('recupres')) {
                recupRes(bat,batType);
            }
            let crew = batType.squads*batType.squadSize*batType.crew;
            let xp = getXp(bat);
            batUnselect();
            batDeath(bat,false);
            let batIndex = batList.findIndex((obj => obj.id == batId));
            batList.splice(batIndex,1);
            $('#b'+bat.tileId).empty();
            let resHere = showRes(bat.tileId);
            $('#b'+bat.tileId).append(resHere);
            if (batType.skills.includes('recupcit')) {
                if (batType.name === 'Technobass') {
                    recupKrimulos(220,tileId,crew,xp,bat.ammo2,bat.eq);
                } else if (batType.name === 'Juggernauts') {
                    recupRaiders(219,tileId,crew,xp,bat.ammo,bat.eq);
                } else if (batType.name === 'Scroungers') {
                    recupAmazones(14,tileId,crew,xp,bat.ammo,bat.eq);
                } else {
                    if (batType.skills.includes('brigands')) {
                        recupCitoyens(225,tileId,crew,xp);
                    } else {
                        recupCitoyens(126,tileId,crew,xp);
                    }
                }
            }
        } else {
            alert("Vous devez vider le bataillon avant de le démanteler.");
        }
    } else {
        alert("Vous ne pouvez pas démanteler ce bâtiment.");
    }
};

function recupKrimulos(unitId,tileId,citoyens,xp,ammo,equip) {
    if (equip != 'lunette2' && equip != 'chargeur2' && equip != 'theeye') {
        equip = 'xxx';
    }
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    let typeId = conselUnit.id;
    putBat(tileId,60,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
    }
    let dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    putBat(dropTile,60,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,dropTile);
        loadBat(citBat.id,souteId);
    }
    dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    putBat(dropTile,60,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,dropTile);
        loadBat(citBat.id,souteId);
    }
};

function recupAmazones(unitId,tileId,citoyens,xp,ammo,equip) {
    if (equip != 'theeye' && equip != 'arcpoulie') {
        equip = 'xxx';
    }
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    let typeId = conselUnit.id;
    putBat(tileId,56,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
    }
    let dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    putBat(dropTile,56,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,dropTile);
        loadBat(citBat.id,souteId);
    }
};

function recupRaiders(unitId,tileId,citoyens,xp,ammo,equip) {
    if (equip != 'theeye') {
        equip = 'gilet';
    }
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,ammo,'scrap',equip];
    conselTriche = true;
    let typeId = conselUnit.id;
    putBat(tileId,60,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
    }
    let dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,ammo,'scrap',equip];
    conselTriche = true;
    putBat(dropTile,60,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,dropTile);
        loadBat(citBat.id,souteId);
    }
};

function recupCitoyens(unitId,tileId,citoyens,xp) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselTriche = true;
    let typeId = conselUnit.id;
    putBat(tileId,citoyens,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
    }
};

function getRecup(costs) {
    // récup de n'importe quels coûts
    let recup = {};
    let recupFactor = 95;
    let bldFactor = 0;
    if (playerInfos.bldList.includes('Décharge')) {
        bldFactor = bldFactor+2;
    }
    if (playerInfos.comp.tri >= 1) {
        bldFactor = bldFactor+1;
    }
    if (hasScraptruck || playerInfos.onShip) {
        bldFactor = bldFactor+1;
    }
    recupFactor = Math.round(recupFactor*(bldFactor+playerInfos.comp.tri+4)/12);
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            value = Math.floor(value/100*recupFactor);
            if (value >= 1) {
                recup[key] = value;
            }
        });
    }
    return recup;
};

function recupRes(bat,batType) {
    let coffre = {};
    if (playerInfos.onShip) {
        coffre = getBatById(souteId);
    } else {
        coffreTileId = -1;
        conselTriche = true;
        putBatAround(bat.tileId,false,true,239,0,false);
        coffre = getBatByTileId(coffreTileId);
    }
    if (batType.cat === 'buildings' || batType.skills.includes('recupres')) {
        let resRecup = getResRecup(bat,batType);
        if (resRecup != undefined) {
            Object.entries(resRecup).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (value >= 1) {
                    if (coffre.transRes[key] === undefined) {
                        coffre.transRes[key] = value;
                    } else {
                        coffre.transRes[key] = coffre.transRes[key]+value;
                    }
                }
            });
        }
    }
    let resFret = checkResLoad(bat);
    if (resFret >= 1) {
        putFretInChest(bat,batType,coffre);
    }
    coffreTileId = -1;
};

function getResRecup(bat,batType) {
    let resRecup = {};
    if (batType.cat === 'buildings' || batType.skills.includes('recupres')) {
        let recupFactor = 95;
        let bldFactor = 0;
        let index;
        let batArmor;
        let batEquip;
        if (playerInfos.bldList.includes('Décharge')) {
            bldFactor = bldFactor+2;
        }
        if (playerInfos.comp.tri >= 1) {
            bldFactor = bldFactor+1;
        }
        if (hasScraptruck || playerInfos.onShip) {
            bldFactor = bldFactor+1;
        }
        recupFactor = Math.round(recupFactor*(bldFactor+playerInfos.comp.tri+4)/12);
        if (batType.skills.includes('recupfull') && recupFactor < 70) {
            recupFactor = 70;
        }
        console.log('hasScraptruck='+hasScraptruck);
        let totalRes = 0;
        // BAT FLATCOST x%
        if (batType.costs != undefined) {
            Object.entries(batType.costs).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (key != 'Transorb') {
                    value = Math.ceil(value/100*recupFactor);
                }
                if (value >= 1) {
                    if (resRecup[key] === undefined) {
                        resRecup[key] = value;
                    } else {
                        resRecup[key] = resRecup[key]+value;
                    }
                    totalRes = totalRes+value;
                }
            });
        }
        // BAT DEPLOY x/2%
        if (batType.deploy != undefined) {
            Object.entries(batType.deploy).map(entry => {
                let key = entry[0];
                let value = entry[1];
                value = Math.floor(value/100*recupFactor/2);
                if (value >= 1) {
                    if (resRecup[key] === undefined) {
                        resRecup[key] = value;
                    } else {
                        resRecup[key] = resRecup[key]+value;
                    }
                    totalRes = totalRes+value;
                }
            });
        }
        // ARMOR x%
        if (!bat.prt.includes('aucun') && bat.prt != undefined) {
            batArmor = getBatArmor(bat);
            if (batArmor.costs != undefined) {
                Object.entries(batArmor.costs).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    value = Math.floor(value/100*recupFactor);
                    if (value >= 1) {
                        if (resRecup[key] === undefined) {
                            resRecup[key] = value;
                        } else {
                            resRecup[key] = resRecup[key]+value;
                        }
                        totalRes = totalRes+value;
                    }
                });
            }
        }
        // EQUIP 100%
        if (!bat.eq.includes('aucun') && bat.eq != undefined) {
            batEquip = getBatEquip(bat);
            if (batEquip.costs != undefined) {
                Object.entries(batEquip.costs).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (value >= 1) {
                        if (resRecup[key] === undefined) {
                            resRecup[key] = value;
                        } else {
                            resRecup[key] = resRecup[key]+value;
                        }
                    }
                });
            }
        }
        let scrapBonus = Math.floor(totalRes/10);
        if (resRecup['Scrap'] === undefined) {
            resRecup['Scrap'] = scrapBonus;
        } else {
            resRecup['Scrap'] = resRecup['Scrap']+scrapBonus;
        }
    }
    return resRecup;
}

function recupInfraRes(tile,infra) {
    coffreTileId = -1;
    conselTriche = true;
    putBatAround(tile.id,false,true,239,0,false);
    let coffre = getBatByTileId(coffreTileId);
    let recupFactor = 47;
    let bldFactor = 0;
    let index;
    if (playerInfos.bldList.includes('Décharge')) {
        bldFactor = bldFactor+2;
    }
    if (playerInfos.comp.tri >= 1) {
        bldFactor = bldFactor+1;
    }
    recupFactor = Math.round(recupFactor*(bldFactor+playerInfos.comp.tri+4)/6);
    if (hasScraptruck) {
        recupFactor = Math.ceil(recupFactor*1.15);
    }
    let totalRes = 0;
    if (infra.costs != undefined) {
        Object.entries(infra.costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            value = Math.floor(value/100*recupFactor);
            if (value >= 1) {
                if (coffre.transRes[key] === undefined) {
                    coffre.transRes[key] = value;
                } else {
                    coffre.transRes[key] = coffre.transRes[key]+value;
                }
                totalRes = totalRes+value;
            }
        });
    }
    coffreTileId = -1;
};

function demolition(apCost) {
    let tile = getTile(selectedBat);
    let infra = getInfraByName(tile.infra);
    recupInfraRes(tile,infra);
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    selectedBatArrayUpdate();
    tile.infra = 'Débris';
    showMap(zone,false);
};

function putFretInChest(bat,batType,coffre) {
    if (bat.transRes != undefined) {
        Object.entries(bat.transRes).map(entry => {
            let key = entry[0];
            let value = entry[1];
            if (coffre.transRes[key] === undefined) {
                coffre.transRes[key] = value;
            } else {
                coffre.transRes[key] = coffre.transRes[key]+value;
            }
        });
    }
};

function getXp(bat) {
    let xp;
    if (bat.xp >= levelXP[4]) {
        xp = levelXP[4];
    } else if (bat.xp >= levelXP[3]) {
        xp = levelXP[3];
    } else if (bat.xp >= levelXP[2]) {
        xp = levelXP[2];
    } else if (bat.xp >= levelXP[1]) {
        xp = levelXP[1];
    } else {
        xp = 0;
    }
    return xp;
};

function deleteAlien(batId) {
    let index = aliens.findIndex((obj => obj.id == batId));
    let bat = aliens[index];
    batDeath(bat,false);
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    $('#b'+bat.tileId).append(resHere);
};

function getRoadCosts(tile) {
    let roadCosts = {};
    if (tile.terrain === 'W' || tile.terrain === 'R') {
        roadCosts['Scrap'] = 50;
        roadCosts['Compo1'] = 150;
        if (playerInfos.comp.const >= 1) {
            roadCosts['Compo1'] = 100;
        }
        roadCosts['Compo2'] = 50;
        if (playerInfos.comp.const >= 2) {
            roadCosts['Compo2'] = 33;
        }
    } else if (tile.terrain === 'M' || tile.terrain === 'S' || tile.terrain === 'H') {
        roadCosts['Compo1'] = 20;
        if (playerInfos.comp.const >= 1) {
            roadCosts['Compo1'] = 14;
        }
    } else {
        roadCosts['Compo1'] = 8;
        if (playerInfos.comp.const >= 1) {
            roadCosts['Compo1'] = 5;
        }
    }
    return roadCosts;
};

function putRoad() {
    console.log('PUTROAD');
    let tile = getTile(selectedBat);
    let terrain = getTileTerrain(selectedBat.tileId);
    let apCost = Math.round(selectedBatType.mecanoCost*terrain.roadBuild*roadAPCost/40);
    if (tile.infra != undefined && tile.infra != 'Débris') {
        apCost = Math.round(apCost/2);
    }
    console.log('apCost:'+apCost);
    if (selectedBatType.crew === 0) {
        let workForceId = checkNearWorkforce(selectedBat);
        if (workForceId >= 0) {
            let workForceBat = getBatById(workForceId);
            workForceBat.apLeft = workForceBat.apLeft-apCost;
        }
    } else {
        selectedBat.apLeft = selectedBat.apLeft-apCost;
    }
    let roadCosts = getRoadCosts(tile);
    payCost(roadCosts);
    tagDelete(selectedBat,'guet');
    camoOut();
    selectedBatArrayUpdate();
    tile.rd = true;
    // saveMap();
    showMap(zone,false);
    showBatInfos(selectedBat);
};

function putInfra(infraName) {
    console.log('INFRASTRUCTURE');
    let tile = getTile(selectedBat);
    let terrain = getTileTerrain(selectedBat.tileId);
    let infra = getInfraByName(infraName);
    // infra.fabTime = AP for Workships
    let apCost = Math.round(Math.sqrt(selectedBatType.mecanoCost)*infra.fabTime/1.7);
    if (selectedBatType.skills.includes('infraconst')) {
        apCost = Math.ceil(apCost*3/4);
    }
    console.log('apCost:'+apCost);
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    if (!selectedBat.tags.includes('construction')) {
        selectedBat.tags.push('construction');
    }
    payCost(infra.costs);
    tagDelete(selectedBat,'guet');
    camoOut();
    selectedBatArrayUpdate();
    tile.infra = infraName;
    tile.ruins = false;
    // saveMap();
    showMap(zone,false);
    showBatInfos(selectedBat);
};

function updateBldList() {
    playerInfos.bldList = [];
    hasScraptruck = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.name === 'Scraptrucks') {
                hasScraptruck = true;
            }
            if (batType.cat === 'buildings' && !batType.skills.includes('nolist') && !bat.tags.includes('construction')) {
                if (!playerInfos.bldList.includes(batType.name)) {
                    playerInfos.bldList.push(batType.name);
                }
            }
            if (batType.bldEquiv.length >= 1) {
                batType.bldEquiv.forEach(function(bldName) {
                    if (!playerInfos.bldList.includes(bldName)) {
                        playerInfos.bldList.push(bldName);
                    }
                });
            }
        }
    });
};

function checkNearConstructor(myBat) {
    let anyConst = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('reeq')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                    anyConst = true;
                }
            }
        }
    });
    return anyConst;
};

function checkNearWorkforce(myBat) {
    let workForceId = -1;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.crew >= 1 && bat.apLeft >= 9) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                    workForceId = bat.id;
                }
            }
        }
    });
    return workForceId;
};
