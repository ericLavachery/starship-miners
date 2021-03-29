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
    // findLanders();
    checkReserve();
    updateBldList();
    $("#conUnitList").css("display","block");
    $("#conAmmoList").css("display","block");
    $('#conUnitList').css("height","300px");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    let color = '';
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br>');
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
    let compReqOK = false;
    let bldOK = false;
    let costOK = false;
    let costString = '';
    let unitMergedCosts;
    sortedUnitsList.forEach(function(unit) {
        prodOK = true;
        if (unit.levels[playerInfos.gang] > playerInfos.gLevel) {
            prodOK = false;
        }
        compReqOK = checkUnitCompReq(unit);
        if (!compReqOK) {
            prodOK = false;
        }
        if (!triche) {
            if (catz.includes(unit.cat) && unit.fabTime >= 1) {
                prodOK = true;
            }
            if (unit.levels[playerInfos.gang] > playerInfos.gLevel) {
                prodOK = false;
            }
            if (!selectedBatType.skills.includes('transorbital')) {
                if (!unit.bldReq.includes(selectedBatType.name)) {
                    if (selectedBatType.cat === 'buildings' || selectedBatType.cat === 'devices') {
                        prodOK = false;
                    } else {
                        if (unit.cat === 'vehicles' || unit.cat === 'infantry') {
                            prodOK = false;
                        }
                    }
                    if (unit.cat === 'vehicles' || unit.cat === 'infantry') {
                        if (unit.bldReq[0] != undefined) {
                            prodOK = false;
                        }
                    }
                    if (selectedBatType.cat === 'infantry' && unit.fabTime >= 35 && !unit.skills.includes('clicput')) {
                        prodOK = false;
                    }
                }
            }
            if (unit.bldCost != 'none' && unit.bldCost != selectedBatType.name) {
                prodOK = false;
            }
            if (unit.unitCost != 'none' && unit.unitCost != selectedBatType.name) {
                prodOK = false;
            }
            if (conselUpgrade === 'bld') {
                if (selectedBatType.bldUp === unit.name) {
                    prodOK = true;
                } else {
                    prodOK = false;
                }
            }
            if (conselUpgrade === 'inf') {
                if (selectedBatType.unitUp === unit.name) {
                    prodOK = true;
                } else {
                    prodOK = false;
                }
            }
        }
        if (prodOK || triche) {
            if (lastKind != unit.kind) {
                showkind = unit.kind.replace(/zero-/g,"");
                $('#conUnitList').append('<br><a href="#gentils"><span class="constName or" id="kind-'+unit.kind+'">'+showkind+'</span></a><br>');
            }
            if (conselUnit.id === unit.id && conselUnit.cat != 'aliens') {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
            } else {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
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
            // console.log(costOK);
            if ((bldOK && costOK) || triche) {
                color = catColor(unit.cat,unit.kind);
                $('#conUnitList').append('<span class="constName klik '+color+'" title="'+toNiceString(unit.bldReq)+' '+costString+'" onclick="conSelect('+unit.id+',`player`,false)">'+unit.name+prodSign+'</span><br>');
            } else {
                color = 'gff';
                $('#conUnitList').append('<span class="constName klik '+color+'" title="'+toNiceString(unit.bldReq)+' '+costString+'">'+unit.name+prodSign+'</span><br>');
            }
            lastKind = unit.kind;
        }
    });
    if (triche) {
        $('#conUnitList').append('<br><span class="constName or" id="mechants">LES MECHANTS</span><br><br>');
        let allALiensList = alienUnits.slice();
        let sortedAliensList = _.sortBy(_.sortBy(_.sortBy(allALiensList,'name'),'name'),'kind');
        sortedAliensList.forEach(function(unit) {
            if (conselUnit.id === unit.id && conselUnit.cat === 'aliens') {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
            } else {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
            }
            color = catColor(unit.cat,unit.kind);
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

function catColor(cat,kind) {
    if (cat === 'aliens') {
        if (kind === 'bug') {
            return 'rose';
        }
        if (kind === 'spider') {
            return 'vert';
        }
        if (kind === 'larve') {
            return 'brun';
        }
        if (kind === 'swarm') {
            return 'jaune';
        }
    }
    if (cat === 'infantry') {
        return 'jaune';
    }
    if (cat === 'vehicles') {
        return 'vert';
    }
    if (cat === 'buildings') {
        return 'rose';
    }
    if (cat === 'devices') {
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
                    if (conselAmmos[3] == equip || (conselAmmos[3] === 'xxx' && listNum === 1)) {
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
                    if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+showEquipInfo(equip)+' '+displayCosts(flatCosts)+'" onclick="selectEquip(`'+equip+'`,`'+unitId+'`)">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batEquip.bldReq)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    }
                }
                listNum++;
            });
        }
    }
    let ammoIndex;
    let batAmmo;
    // AMMO WEAP 1 ---------------------------------------------
    let hasW1 = false;
    if (!conselUnit.weapon.kit || conselAmmos[3].includes('w1-') || conselAmmos[3].includes('w2-')) {
        hasW1 = true;
    }
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
                            $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batAmmo.bldReq)+' '+displayCosts(deployCosts)+'">'+showAmmo(ammo)+prodSign+'</span><br>');
                        }
                    }
                    listNum++;
                });
            }
        }
    }
    // AMMO WEAP 2 ---------------------------------------------
    let hasW2 = false;
    if (!conselUnit.weapon2.kit || conselAmmos[3].includes('kit-') || conselAmmos[3].includes('w2-')) {
        hasW2 = true;
    }
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
                            $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batAmmo.bldReq)+' '+displayCosts(deployCosts)+'">'+showAmmo(ammo)+prodSign+'</span><br>');
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

function checkUnitCompReq(unit) {
    let compReqOK = true;
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
        if (conselUnit.cat === 'buildings' || conselUnit.cat === 'devices') {
            let tile = getTileById(tileId);
            if (tile.infra != undefined && tile.infra != 'Débris') {
                batHere = true;
                message = 'Pas de construction de bâtiment ou dispositif sur une case occupée par une infrastructure';
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
            if (!free) {
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
                    payDeployCosts(conselUnit,conselAmmos);
                }
            }
            let tile = getTileById(tileId);
            console.log(conselUnit);
            let nextId;
            let team;
            if (conselUnit.cat != 'aliens') {
                if (bataillons.length >= 1) {
                    nextId = bataillons[bataillons.length-1].id+1;
                } else {
                    nextId = 1;
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
                if (conselUnit.skills.includes('realdumper') || conselUnit.skills.includes('transorbital')) {
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
            let equipIndex = armorTypes.findIndex((obj => obj.name == equipName));
            let batEquip = armorTypes[equipIndex];
            newBat.eq = equipName;
            let baseAP = conselUnit.ap;
            if (newBat.eq === 'e-jetpack') {
                baseAP = 17;
            }
            // Armor
            let armorName = conselAmmos[2];
            if (armorName === 'xxx') {
                armorName = 'aucune';
            }
            let armorIndex = armorTypes.findIndex((obj => obj.name == armorName));
            let batArmor = armorTypes[armorIndex];
            newBat.prt = armorName;
            newBat.armor = conselUnit.armor+batArmor.armor;
            if ((conselUnit.skills.includes('fly') || newBat.eq === 'e-jetpack') && batArmor.ap < 0) {
                newBat.ap = baseAP+batArmor.ap+batArmor.ap;
            } else if ((conselUnit.skills.includes('strong') || newBat.eq === 'helper') && batArmor.ap < -1) {
                newBat.ap = baseAP+batArmor.ap+1;
            } else if (conselUnit.moveCost === 99) {
                newBat.ap = baseAP;
            } else {
                newBat.ap = baseAP+batArmor.ap;
            }
            if (conselTriche) {
                newBat.apLeft = baseAP;
                newBat.oldapLeft = baseAP;
                newBat.salvoLeft = conselUnit.maxSalvo;
            } else {
                if (conselUnit.fabTime >= 1) {
                    if (conselUnit.skills.includes('clicput') && conselUnit.name != 'Coffres') {
                        newBat.apLeft = 0;
                        newBat.oldapLeft = 0;
                        newBat.salvoLeft = 0;
                    } else {
                        let constFactor = 25;
                        if (playerInfos.comp.const >= 1 && (conselUnit.cat === 'buildings' || conselUnit.cat === 'devices')) {
                            constFactor = Math.round(constFactor*(playerInfos.comp.const+12)/12);
                        }
                        if (playerInfos.comp.ind >= 1 && conselUnit.cat === 'vehicles') {
                            constFactor = Math.round(constFactor*(playerInfos.comp.const+5)/5);
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
                    newBat.apLeft = baseAP;
                    newBat.oldapLeft = baseAP;
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
            if (playerInfos.comp.train === 1) {
                newBat.xp = newBat.xp+levelXP[1];
            }
            if (playerInfos.comp.train === 2) {
                newBat.xp = newBat.xp+Math.ceil(levelXP[2]*3/4);
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
                newBat.sort = conselUnit.sort;
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
            if (!conselTriche && conselUnit.cat != 'aliens') {
                newBat.tags.push('construction');
            }
            if (conselUnit.skills.includes('hide') || (conselUnit.kind === 'larve' && larveHIDE)) {
                newBat.tags.push('invisible');
            }
            if (batArmor.skills.includes('slowreg')) {
                newBat.tags.push('slowreg');
            }
            if (batArmor.skills.includes('resistfeu') && !newBat.tags.includes('resistfeu')) {
                newBat.tags.push('resistfeu');
            }
            if (batArmor.skills.includes('resistall') && !newBat.tags.includes('resistall')) {
                newBat.tags.push('resistall');
            }
            if (newBat.eq === 'kit-pompiste' && !newBat.tags.includes('resistfeu')) {
                newBat.tags.push('resistfeu');
            }
            if (newBat.eq === 'crimekitto' && !newBat.tags.includes('resistfeu')) {
                newBat.tags.push('resistfeu');
            }
            if (newBat.eq === 'kit-sentinelle' && !newBat.tags.includes('resistacide')) {
                newBat.tags.push('resistacide');
            }
            if (batArmor.skills.includes('resistacide') && !newBat.tags.includes('resistacide')) {
                newBat.tags.push('resistacide');
            }
            if (batArmor.skills.includes('resistelec') && !newBat.tags.includes('resistelec')) {
                newBat.tags.push('resistelec');
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
    $('#conUnitList').empty();
    $('#conAmmoList').empty();
    $('#conUnitList').css("height","300px");
    conselReset();
    showResOpen = false;
    $("#conUnitList").css("display","none");
    $("#conAmmoList").css("display","none");
    if (Object.keys(selectedBat).length >= 1) {
        showBatInfos(selectedBat);
    }
    // prepaBld = {};
};

function conselReset() {
    conselUnit = {};
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    // conselCat = '';
    conselUpgrade = '';
    conselTriche = false;
    conselPut = false;
    conselCosts = {};
}

$("#minimap").css("display","block");

function conWindowOut() {
    $('#conUnitList').empty();
    $('#conAmmoList').empty();
    $("#conUnitList").css("display","none");
    $("#conAmmoList").css("display","none");
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
    // récup de ressources !!!!!!
    let bat = getBatById(batId);
    let isCharged = checkCharged(bat,'trans');
    let isLoaded = checkCharged(bat,'load');
    // let resFret = checkResLoad(bat);
    if (!isCharged && !isLoaded) {
        let batType = getBatType(bat);
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
    putBat(tileId,60,xp);
    let dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    putBat(dropTile,60,xp);
    dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    putBat(dropTile,60,xp);
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
    putBat(tileId,56,xp);
    let dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    putBat(dropTile,56,xp);
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
    putBat(tileId,60,xp);
    let dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,ammo,'scrap',equip];
    conselTriche = true;
    putBat(dropTile,60,xp);
};

function recupCitoyens(unitId,tileId,citoyens,xp) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselTriche = true;
    putBat(tileId,citoyens,xp);
};

function recupRes(bat,batType) {
    coffreTileId = -1;
    conselTriche = true;
    putBatAround(bat.tileId,false,true,239,0,false);
    let coffre = getBatByTileId(coffreTileId);
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
        if (hasScraptruck) {
            bldFactor = bldFactor+1;
        }
        recupFactor = Math.round(recupFactor*(bldFactor+playerInfos.comp.tri+4)/12);
        console.log('hasScraptruck='+hasScraptruck);
        let totalRes = 0;
        // BAT FLATCOST x%
        if (batType.costs != undefined) {
            Object.entries(batType.costs).map(entry => {
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
        // BAT DEPLOY x/2%
        if (batType.deploy != undefined) {
            Object.entries(batType.deploy).map(entry => {
                let key = entry[0];
                let value = entry[1];
                value = Math.floor(value/100*recupFactor/2);
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
        // ARMOR x%
        if (!bat.prt.includes('aucun') && bat.prt != undefined) {
            batArmor = getBatArmor(bat);
            if (batArmor.costs != undefined) {
                Object.entries(batArmor.costs).map(entry => {
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
        }
        // EQUIP 100%
        if (!bat.eq.includes('aucun') && bat.eq != undefined) {
            batEquip = getBatEquip(bat);
            if (batEquip.costs != undefined) {
                Object.entries(batEquip.costs).map(entry => {
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
        let scrapBonus = Math.ceil(totalRes/10);
        if (coffre.transRes['Scrap'] === undefined) {
            coffre.transRes['Scrap'] = scrapBonus;
        } else {
            coffre.transRes['Scrap'] = coffre.transRes['Scrap']+scrapBonus;
        }
    }
    let resFret = checkResLoad(bat);
    if (resFret >= 1) {
        putFretInChest(bat,batType,coffre);
    }
    coffreTileId = -1;
};

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
    let apCost = Math.round(selectedBatType.mecanoCost*terrain.roadBuild*roadAPCost/30);
    if (tile.infra != undefined && tile.infra != 'Débris') {
        apCost = Math.round(apCost/2);
    }
    console.log('apCost:'+apCost);
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    if (!selectedBat.tags.includes('construction')) {
        selectedBat.tags.push('construction');
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
