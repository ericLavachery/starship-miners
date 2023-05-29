function equipDetails(stuffName,isAmmo) {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","400px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    let stuff = {};
    if (isAmmo) {
        stuff = getAmmoByName(stuffName);
    } else {
        stuff = getEquipByName(stuffName);
    }
    let baseInfo = '';
    let pageTitle = 'EQUIPEMENT';
    if (isAmmo) {
        pageTitle = 'MUNITION';
        baseInfo = showAmmoInfo(stuffName);
    } else if (stuff.cat === 'armor') {
        pageTitle = 'ARMURE';
        baseInfo = showFullArmorInfo(stuff);
    } else if (stuff.cat === 'drogue') {
        pageTitle = 'DROGUE';
        if (stuff.info != undefined) {
            baseInfo = stuff.info;
            baseInfo = baseInfo.replace(/ \/ /g,' &#9889; ');
        }
    } else if (stuff.cat === 'infra') {
        pageTitle = 'INFRASTRUCTURE';
        if (stuff.info != undefined) {
            baseInfo = stuff.info;
            baseInfo = baseInfo.replace(/ \/ /g,' &#9889; ');
        }
    } else if (stuff.cat === 'equip') {
        if (stuff.info != undefined) {
            baseInfo = stuff.info;
            baseInfo = baseInfo.replace(/ \/ /g,' &#9889; ');
        }
    }
    $('#conUnitList').append('<span class="constName vert">'+pageTitle+': <span class="or">&ldquo;'+stuff.name+'&rdquo;</span></span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="basicText">'+baseInfo+'</span><br>');



    $('#conUnitList').append('<br><br>');
};

function reEquip(batId,noRefresh) {
    let myBat = getBatById(batId);
    let myBatType = getBatType(myBat);
    let myGear = [myBat.ammo,myBat.ammo2,myBat.prt,myBat.eq];
    if (!noRefresh) {
        myNewGear = [myBat.ammo,myBat.ammo2,myBat.prt,myBat.eq];
    }
    selectMode();
    checkReserve();
    updateBldList();
    $("#conAmmoList").css("display","block");
    $('#conAmmoList').css("height","700px");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conAmmoList').empty();
    $('#conAmmoList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conAmmoList').append('<br><h3>'+myBatType.name+'</h3><br>');
    $('#conAmmoList').append('<br>');
    let batArmor;
    let armorSkills = '';
    let fullArmorSkills = '';
    let listNum = 1;
    let bldReqOK = false;
    let compReqOK = false;
    let costsOK = false;
    let flatCosts;
    let deployCosts;
    let fullCosts;
    // ARMOR ---------------------------------------------
    if (myBatType.protection != undefined) {
        if (myBatType.protection.length >= 1) {
            // console.log(myBatType.protection);
            if (myBatType.cat === 'infantry') {
                $('#conAmmoList').append('<span class="constName or">Armure</span><br>');
            } else {
                $('#conAmmoList').append('<span class="constName or">Blindage (renforcement)</span><br>');
            }
            myBatType.protection.forEach(function(armor) {
                batArmor = getEquipByName(armor);
                armorSkills = showArmorInfo(batArmor);
                fullArmorSkills = showFullArmorInfo(batArmor);
                compReqOK = checkCompReq(batArmor);
                if (compReqOK) {
                    if (myNewGear[2] == armor || (myNewGear[2] === 'xxx' && listNum === 1)) {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                    } else {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                    }
                    flatCosts = getCosts(myBatType,batArmor,0,'equip');
                    deployCosts = getDeployCosts(myBatType,batArmor,0,'equip');
                    mergeObjects(flatCosts,deployCosts);
                    costsOK = checkCost(flatCosts);
                    bldReqOK = verifBldReq(myBatType,batArmor.bldReq);
                    prodSign = ' <span class="ciel">&raquo;</span>';
                    if (!compReqOK) {
                        prodSign = '';
                    }
                    if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+fullArmorSkills+toBldString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'" onclick="deployArmor(`'+armor+'`,`'+myBat.id+'`)">'+armor+prodSign+' <span class="gff">'+armorSkills+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName klik gff" title="'+fullArmorSkills+toBldString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'">'+armor+prodSign+' <span class="gff">'+armorSkills+'</span></span><br>');
                    }
                } else {
                    if (armor === myBat.prt) {
                        if (myNewGear[2] === myBat.prt) {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        } else {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        }
                        $('#conAmmoList').append('<span class="constName gff" title="'+fullArmorSkills+toBldString(batArmor.bldReq)+'">'+armor+' <span class="gff">'+armorSkills+'</span></span><br>');
                    }
                }
                listNum++;
            });
        }
    }
    let batEquip;
    let weapName;
    let equipNotes;
    let bonusEqName = getBonusEq(myBatType,false);
    let autoEqList = getAutoEqList(myBat,myBatType,false);
    listNum = 1;
    // EQUIP ---------------------------------------------
    if (myBatType.equip != undefined) {
        if (myBatType.equip.length >= 1) {
            // console.log(myBatType.equip);
            $('#conAmmoList').append('<span class="constName or">Equipement</span><br>');
            myBatType.equip.forEach(function(equip) {
                batEquip = getEquipByName(equip);
                weapName = '';
                equipNotes = '';
                if (batEquip.skills != undefined) {
                    equipNotes = batEquip.skills;
                }
                if (equip.endsWith('1')) {
                    weapName = ' ('+myBatType.weapon.name+')';
                } else if (equip.endsWith('2') && equip != 'psol2') {
                    weapName = ' ('+myBatType.weapon2.name+')';
                }
                if (equip.startsWith('w2-') || equip.startsWith('kit-')) {
                    if (!equip.startsWith('w2-auto')) {
                        weapName = ' ('+myBatType.weapon2.name+')';
                    }
                }
                if (equip.startsWith('w1-') && !equip.includes('auto')) {
                    weapName = ' ('+myBatType.weapon.name+')';
                }
                let showEq = showEquip(myBatType,batEquip,myBat);
                compReqOK = checkCompReq(batEquip);
                if (!compReqOK) {
                    compReqOK = checkRecycledEquip(batEquip,myBat,myBatType);
                }
                if (checkSpecialEquip(batEquip,myBatType,myBat)) {
                    compReqOK = false;
                }
                if ((compReqOK || conselTriche) && showEq) {
                    if (bonusEqName === equip || autoEqList.includes(equip)) {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle bleu"></i></span>');
                    } else if (myNewGear[3] == equip || (myNewGear[3] === 'xxx' && listNum === 1)) {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                    } else {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                    }
                    flatCosts = getCosts(myBatType,batEquip,0,'equip');
                    deployCosts = getDeployCosts(myBatType,batEquip,0,'equip');
                    // console.log('EQUIP');
                    // console.log(flatCosts);
                    // console.log(deployCosts);
                    mergeObjects(flatCosts,deployCosts);
                    // console.log('merge');
                    // console.log(flatCosts);
                    costsOK = checkCost(flatCosts);
                    bldReqOK = verifBldReq(myBatType,batEquip.bldReq);
                    prodSign = ' <span class="ciel">&raquo;</span>';
                    if (!compReqOK) {
                        prodSign = '';
                    }
                    if (bonusEqName === equip) {
                        $('#conAmmoList').append('<span class="constName" title="'+showEquipInfo(equip,myBatType,true)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+showEquipInfo(equip,myBatType,true)+' '+displayCosts(flatCosts)+'" onclick="deployEquip(`'+equip+'`,'+myBat.id+')">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName gff" title="'+showEquipInfo(equip,myBatType,true)+' '+toBldString(batEquip.bldReq)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    }
                } else {
                    if (equip === myBat.eq || equip === myBat.logeq) {
                        if (myNewGear[3] === myBat.eq || myNewGear[3] === myBat.logeq) {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle bleu"></i></span>');
                        } else {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        }
                        $('#conAmmoList').append('<span class="constName gff" title="'+showEquipInfo(equip,myBatType,true)+' / '+toBldString(batEquip.bldReq)+'">'+equip+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    }
                }
                listNum++;
            });
        }
    }
    let batAmmo;
    // AMMO WEAP 1 ---------------------------------------------
    let hasW1 = checkHasWeapon(1,myBatType,myNewGear[3]);
    listNum = 1;
    if (hasW1) {
        if (Object.keys(myBatType.weapon).length >= 1) {
            if (myBatType.weapon.ammo.length >= 1) {
                $('#conAmmoList').append('<span class="constName or">'+myBatType.weapon.name+'</span><br>');
                myBatType.weapon.ammo.forEach(function(ammo) {
                    batAmmo = getAmmoByName(ammo);
                    compReqOK = checkCompReq(batAmmo);
                    if (compReqOK || conselTriche) {
                        if (myNewGear[0] == ammo || (myNewGear[0] === 'xxx' && listNum === 1)) {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        } else {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        }
                        deployCosts = getDeployCosts(myBatType,batAmmo,1,'ammo');
                        flatCosts = getCosts(myBatType,batAmmo,1,'ammo');
                        mergeObjects(deployCosts,flatCosts);
                        costsOK = checkCost(deployCosts);
                        bldReqOK = verifBldReq(myBatType,batAmmo.bldReq);
                        prodSign = ' <span class="ciel">&raquo;</span>';
                        if (!compReqOK) {
                            prodSign = '';
                        }
                        if ((bldReqOK && costsOK) || conselTriche) {
                            $('#conAmmoList').append('<span class="constName klik" title="'+showAmmoInfo(ammo)+' '+displayCosts(deployCosts)+'" onclick="deployAmmo(`'+ammo+'`,`w1`,`'+myBat.id+'`)">'+showAmmo(ammo)+prodSign+'</span><br>');
                        } else {
                            $('#conAmmoList').append('<span class="constName gff" title="'+toBldString(batAmmo.bldReq)+' '+displayCosts(deployCosts)+'">'+showAmmo(ammo)+prodSign+'</span><br>');
                        }
                    }
                    listNum++;
                });
            }
        }
    }
    // AMMO WEAP 2 ---------------------------------------------
    let hasW2 = checkHasWeapon(2,myBatType,myNewGear[3]);
    listNum = 1;
    if (hasW2) {
        if (Object.keys(myBatType.weapon2).length >= 1 && (!myBatType.skills.includes('unemun') || hasEquip(myBat,['fakit']))) {
            if (myBatType.weapon2.ammo.length >= 1) {
                $('#conAmmoList').append('<span class="constName or">'+myBatType.weapon2.name+'</span><br>');
                myBatType.weapon2.ammo.forEach(function(ammo) {
                    batAmmo = getAmmoByName(ammo);
                    compReqOK = checkCompReq(batAmmo);
                    if (compReqOK || conselTriche) {
                        if (myNewGear[1] == ammo || (myNewGear[1] === 'xxx' && listNum === 1)) {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        } else {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        }
                        deployCosts = getDeployCosts(myBatType,batAmmo,2,'ammo');
                        flatCosts = getCosts(myBatType,batAmmo,2,'ammo');
                        mergeObjects(deployCosts,flatCosts);
                        costsOK = checkCost(deployCosts);
                        bldReqOK = verifBldReq(myBatType,batAmmo.bldReq);
                        prodSign = ' <span class="ciel">&raquo;</span>';
                        if (!compReqOK) {
                            prodSign = '';
                        }
                        if ((bldReqOK && costsOK) || conselTriche) {
                            $('#conAmmoList').append('<span class="constName klik" title="'+showAmmoInfo(ammo)+' '+displayCosts(deployCosts)+'" onclick="deployAmmo(`'+ammo+'`,`w2`,`'+myBat.id+'`)">'+showAmmo(ammo)+prodSign+'</span><br>');
                        } else {
                            $('#conAmmoList').append('<span class="constName gff" title="'+toBldString(batAmmo.bldReq)+' '+displayCosts(deployCosts)+'">'+showAmmo(ammo)+prodSign+'</span><br>');
                        }
                    }
                    listNum++;
                });
            }
        }
    }
    $('#conAmmoList').append('<br>');
    $('#conAmmoList').append('<span class="blockTitle"><h4><button type="button" title="Faire les changements dans les munitions, armures et équipements" class="boutonCaca iconButtons" onclick="doReEquip(`'+myBat.id+'`)"><i class="ra ra-rifle rpg"></i> &nbsp;<span class="notsosmall">Rééquiper</span></button></h4></span><br>');
    $('#conAmmoList').append('<br>');
};

function showEquip(batType,batEquip,bat) {
    let showEq = true;
    // console.log('W2ALT --------------------------------------------------------------');
    // console.log(batEquip.name);
    if (batEquip.name.startsWith('w2-') && !batEquip.name.startsWith('w2-auto')) {
        // console.log('start ok');
        if (batType.weapon2.equip != undefined) {
            // console.log(batType.weapon2.equip);
            if (batType.weapon2.equip != batEquip.name) {
                showEq = false;
            }
        }
    }
    if (batEquip.name.includes('chargeur')) {
        if (Object.keys(bat).length >= 1) {
            if (bat.tdc.includes('fakit') || bat.logeq === 'fakit' || bat.tdc.includes('wstabkit') || bat.logeq === 'wstabkit') {
                showEq = false;
            }
        }
    }
    return showEq;
};

function checkRecycledEquip(stuff,bat,batType) {
    let compReqOK = false;
    let recycled = 0;
    if (bat.vet >= 4 || batType.skills.includes('leader') || batType.skills.includes('prayer')) {
        compReqOK = true;
        // compReq
        recycled = 0;
        if (stuff.compReq != undefined) {
            if (Object.keys(stuff.compReq).length >= 1) {
                Object.entries(stuff.compReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (playerInfos.comp[key] < value) {
                        if (recycled === 0) {
                            let theComp = getCompByName(key);
                            let compValue = value*(theComp.triPass);
                            if (playerInfos.comp.tri >= compValue) {
                                recycled++;
                            } else {
                                compReqOK = false;
                            }
                        } else {
                            compReqOK = false;
                        }
                    }
                });
            }
        }
        if (!compReqOK) {
            // altCompReq
            recycled = 0;
            if (stuff.altCompReq != undefined) {
                if (Object.keys(stuff.altCompReq).length >= 1) {
                    Object.entries(stuff.altCompReq).map(entry => {
                        let key = entry[0];
                        let value = entry[1];
                        if (playerInfos.comp[key] < value) {
                            if (recycled === 0) {
                                let theComp = getCompByName(key);
                                let compValue = value*(theComp.triPass);
                                if (playerInfos.comp.tri >= compValue) {
                                    recycled++;
                                } else {
                                    compReqOK = false;
                                }
                            } else {
                                compReqOK = false;
                            }
                        }
                    });
                }
            }
        }
    }
    return compReqOK;
};

function checkAutoEqCompReq(stuff) {
    // pour les autoEq, il faut avoir les compReq ET les altCompReq
    let compReqOK = true;
    // compReq
    if (stuff.compReq != undefined) {
        if (Object.keys(stuff.compReq).length >= 1) {
            Object.entries(stuff.compReq).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (playerInfos.comp[key] < value) {
                    compReqOK = false;
                }
            });
        }
    }
    // altCompReq
    if (stuff.altCompReq != undefined) {
        if (Object.keys(stuff.altCompReq).length >= 1) {
            Object.entries(stuff.altCompReq).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (playerInfos.comp[key] < value) {
                    compReqOK = false;
                }
            });
        }
    }
    // altKillReq
    if (stuff.altKillReq != undefined) {
        if (playerInfos.knownAliens.includes(stuff.altKillReq)) {
            compReqOK = true;
        }
    }
    // gangReq
    if (stuff.gangReq != undefined) {
        if (!stuff.gangReq.includes(playerInfos.gang)) {
            compReqOK = false;
        }
    }
    return compReqOK;
};

function getAutoEqList(bat,batType,isStartBat) {
    // console.log("CHECK AUTO EQs LIST !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    let autoEqList = [];
    if (batType.skills.includes('penitbat')) {
        autoEqList = bat.tdc;
    } else if (bat.vet >= 3 || batType.cat === 'buildings' || batType.skills.includes('leader') || batType.skills.includes('cleric') || batType.skills.includes('souschef')) {
        if (batType.autoEq != undefined) {
            // console.log(batType.autoEq);
            if (batType.autoEq.length >= 1) {
                batType.autoEq.forEach(function(equipName) {
                    let equip = getEquipByName(equipName);
                    // console.log(equip);
                    let compReqOK = checkAutoEqCompReq(equip);
                    if (checkSpecialEquip(equip,batType)) {
                        compReqOK = false;
                    }
                    // console.log('compReqOK='+compReqOK);
                    let bldReqOK = verifBldReq(batType,equip.bldReq);
                    if (isStartBat) {
                        bldReqOK = true;
                    }
                    if (compReqOK && bldReqOK) {
                        if (equip.autoComp.length === 2) {
                            let autoCompName = equip.autoComp[0];
                            let autoCompLevel = equip.autoComp[1];
                            if (playerInfos.comp[autoCompName] >= autoCompLevel) {
                                autoEqList.push(equipName);
                            }
                        }
                    }
                });
            }
        }
    }
    // remove less efficient extract modules
    if (autoEqList.includes('monoextract')) {
        if (autoEqList.includes('tungextract')) {
            let index = autoEqList.indexOf('tungextract');
            autoEqList.splice(index,1);
        }
        if (autoEqList.includes('plasmaextract')) {
            let index = autoEqList.indexOf('plasmaextract');
            autoEqList.splice(index,1);
        }
    } else if (autoEqList.includes('plasmaextract')) {
        if (autoEqList.includes('tungextract')) {
            let index = autoEqList.indexOf('tungextract');
            autoEqList.splice(index,1);
        }
    }
    // add e-flash
    if ((playerInfos.comp.det >= 3 && playerInfos.comp.log >= 2) || playerInfos.comp.log === 3) {
        if (batType.equip.includes('e-flash') && !autoEqList.includes('e-flash')) {
            autoEqList.push('e-flash');
        }
    }
    console.log('autoEqList');
    console.log(autoEqList);
    return autoEqList;
};

function getBonusEq(unit,isStartBat) {
    // console.log("CHECK BONUS EQ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    let bonusEqName = '';
    if (unit.log3eq != undefined) {
        // console.log(unit.log3eq);
        if (unit.log3eq.length >= 1) {
            unit.log3eq.forEach(function(equipName) {
                if (bonusEqName === '') {
                    let equip = getEquipByName(equipName);
                    // console.log(equip);
                    let compReqOK = checkCompReq(equip);
                    // console.log('compReqOK='+compReqOK);
                    if (checkSpecialEquip(equip,unit)) {
                        compReqOK = false;
                    }
                    // console.log('compReqOK='+compReqOK);
                    let bldReqOK = verifBldReq(unit,equip.bldReq);
                    if (isStartBat) {
                        bldReqOK = true;
                    }
                    if (compReqOK && bldReqOK) {
                        if (playerInfos.comp.log === 3) {
                            // console.log('log3');
                            bonusEqName = equipName;
                        } else if (equip.autoComp.length === 2) {
                            let autoCompName = equip.autoComp[0];
                            let autoCompLevel = equip.autoComp[1];
                            // console.log(autoCompName+'='+autoCompLevel);
                            // console.log(playerInfos.comp[autoCompName]);
                            if (playerInfos.comp[autoCompName] >= autoCompLevel) {
                                bonusEqName = equipName;
                            }
                        }
                    }
                }
            });
        }
    }
    console.log('bonusEqName='+bonusEqName);
    return bonusEqName;
};

function checkSpecialEquip(equip,batType,bat) {
    let nope = false;
    let triche = false;
    if (bat === undefined) {
        triche = true;
    }
    if (equip.name.includes('chargeur')) {
        if (Object.keys(batType.weapon).length >= 3) {
            if (batType.weapon.name.includes('plasma') || batType.weapon.name.includes('laser') || batType.weapon.name.includes('BFG')) {
                if (equip.name === 'chargeur' || equip.name === 'chargeur1') {
                    if (!playerInfos.bldList.includes('Centre de recherches')) {
                        nope = true;
                    }
                }
            }
        }
        if (!nope) {
            if (Object.keys(batType.weapon2).length >= 3) {
                if (batType.weapon2.name.includes('plasma') || batType.weapon2.name.includes('laser') || batType.weapon2.name.includes('BFG')) {
                    if (equip.name === 'chargeur' || equip.name === 'chargeur2') {
                        if (!playerInfos.bldList.includes('Centre de recherches')) {
                            nope = true;
                        }
                    }
                }
            }
        }
    }
    if (equip.name === 'e-jetpack') {
        if (!triche) {
            if (bat != undefined) {
                if (bat.vet < 4) {
                    nope = true;
                }
            }
        }
    }
    if (equip.name === 'helper' || equip.name === 'theeye') {
        if (!triche) {
            if (bat != undefined) {
                if (bat.vet < 3) {
                    nope = true;
                }
            }
        }
    }
    if (equip.name.includes('sci-')) {
        let rechCompName = equip.name.replace('sci-','');
        let rechComp = getCompByName(rechCompName);
        let rechCompOK = isFoundCompOK(rechComp);
        if (!rechCompOK) {
            nope = true;
        }
    }
    return nope;
}

function hasEquip(bat,equipList) {
    let hasAny = false;
    if (bat.tdc === undefined) {
        bat.tdc = [];
    }
    equipList.forEach(function(equipName) {
        if (bat.eq === equipName || bat.logeq === equipName || bat.tdc.includes(equipName)) {
            hasAny = true;
        }
    });
    return hasAny;
};

function noEquip(bat,equipList) {
    let hasNone = false;
    equipList.forEach(function(equipName) {
        if (bat.eq != equipName && bat.logeq != equipName && !bat.tdc.includes(equipName)) {
            hasNone = true;
        }
    });
    return hasNone;
};

function checkHasWeapon(num,batType,eq) {
    let hasWeapon = false;
    if (num === 1) {
        if (batType.weapon.rof >= 1) {
            if (!batType.weapon.kit || eq.includes('w1-') || eq.includes('w2-')) {
                hasWeapon = true;
            }
            if (eq === 'w2-magnum' || eq === 'w2-pplasma') {
                hasWeapon = false;
            }
        }
    } else if (num === 2) {
        if (batType.weapon2.rof >= 1) {
            if (!batType.weapon2.kit || eq.includes('kit-') || eq.includes('w2-')) {
                if (batType.weapon2.name === 'Guidage laser' && (playerInfos.gang === 'tiradores' || playerInfos.gang === 'rednecks' || playerInfos.gang === 'blades')) {
                    hasWeapon = false;
                } else {
                    hasWeapon = true;
                }
            }
            if (batType.skills.includes('w2mecano') && eq === 'e-mecano') {
                hasWeapon = false;
            }
        }
    }
    return hasWeapon;
}

function checkAmmoReqs(bat,batType) {
    if (playerInfos.onShip) {
        let ammo = getAmmoByName(bat.ammo);
        let compReqOK = checkCompReq(ammo);
        let bldReqOK = verifBldReq(batType,ammo.bldReq);
        if (!compReqOK || !bldReqOK) {
            let forcedAmmo = checkForcedAmmo(selectedBat.ammo,batType,1);
            if (selectedBat.ammo != forcedAmmo) {
                warning('Munitions inconnues','<span class="bleu">'+batType.name+'</span> : Les munitions de ce bataillon n\'ont pas pu être produites.<br><span class="brun">'+selectedBat.ammo+'</span> remplacées par <span class="brun">'+forcedAmmo+'</span>');
            }
            selectedBat.ammo = forcedAmmo;
        }
        ammo = getAmmoByName(bat.ammo2);
        compReqOK = checkCompReq(ammo);
        bldReqOK = verifBldReq(batType,ammo.bldReq);
        if (!compReqOK || !bldReqOK) {
            let forcedAmmo = checkForcedAmmo(selectedBat.ammo2,batType,2);
            if (selectedBat.ammo2 != forcedAmmo) {
                warning('Munitions inconnues','<span class="bleu">'+batType.name+'</span> : Les munitions de ce bataillon n\'ont pas pu être produites.<br><span class="brun">'+selectedBat.ammo2+'</span> remplacées par <span class="brun">'+forcedAmmo+'</span>');
            }
            selectedBat.ammo2 = forcedAmmo;
        }
        selectedBatArrayUpdate();
    }
};

function checkForcedAmmo(oldAmmoName,batType,weapNum) {
    let forcedAmmo = oldAmmoName;
    if (oldAmmoName.includes('lame-')) {
        if (oldAmmoName.includes('-poison') || oldAmmoName.includes('-poraz') || oldAmmoName.includes('-atium')) {
            if (oldAmmoName.includes('lame-c-')) {
                forcedAmmo = 'lame-carbone';
            } else if (oldAmmoName.includes('lame-t-')) {
                forcedAmmo = 'lame-titane';
            } else if (oldAmmoName.includes('lame-a-')) {
                forcedAmmo = 'lame-adamantium';
            } else {
                forcedAmmo = 'lame';
            }
        }
    } else if (!oldAmmoName.includes('web-') && !oldAmmoName.includes('dents-') && !oldAmmoName.includes('club-') && !oldAmmoName.includes('autodes-')) {
        if (weapNum === 1) {
            forcedAmmo = batType.weapon.ammo[0];
        } else {
            forcedAmmo = batType.weapon2.ammo[0];
        }
    } else {
        forcedAmmo = oldAmmoName;
    }
    return forcedAmmo;
}

function doReEquip(batId) {
    let myBat = getBatById(batId);
    let myBatType = getBatType(myBat);
    let myGear = [myBat.ammo,myBat.ammo2,myBat.prt,myBat.eq];
    console.log('DO REEQUIP');
    console.log(myGear);
    console.log(myNewGear);
    let payOK = true;
    let totalCosts = {};
    let flatCosts = {};
    let deployCosts = {};
    let totalRecup = {};
    let recup = {};
    let equipChanged = false;
    if (myNewGear[3] != myGear[3]) {
        equipChanged = true;
        let batEquip = getEquipByName(myNewGear[3]);
        if (batEquip.name === 'g2ai') {
            myBat.ok = '';
        }
        flatCosts = getCosts(myBatType,batEquip,0,'equip');
        mergeObjects(totalCosts,flatCosts);
        if (!playerInfos.onShip) {
            deployCosts = getDeployCosts(myBatType,batEquip,0,'equip');
            mergeObjects(totalCosts,deployCosts);
        }
        if (!myGear[3].includes('aucun')) {
            let oldBatEquip = getEquipByName(myGear[3]);
            flatCosts = getCosts(myBatType,oldBatEquip,0,'equip');
            recup = getRecup(flatCosts,true);
            mergeObjects(totalRecup,recup);
        }
    }
    if (myNewGear[2] != myGear[2]) {
        let batArmor = getEquipByName(myNewGear[2]);
        flatCosts = getCosts(myBatType,batArmor,0,'equip');
        mergeObjects(totalCosts,flatCosts);
        if (!playerInfos.onShip) {
            deployCosts = getDeployCosts(myBatType,batArmor,0,'equip');
            mergeObjects(totalCosts,deployCosts);
        }
        if (!myGear[2].includes('aucun')) {
            let oldBatArmor = getEquipByName(myGear[2]);
            flatCosts = getCosts(myBatType,oldBatArmor,0,'equip');
            recup = getRecup(flatCosts,true);
            mergeObjects(totalRecup,recup);
        }
    }
    if (myNewGear[0] != myGear[0]) {
        let batAmmo = getAmmoByName(myNewGear[0]);
        flatCosts = getCosts(myBatType,batAmmo,1,'ammo');
        mergeObjects(totalCosts,flatCosts);
        if (!playerInfos.onShip) {
            deployCosts = getDeployCosts(myBatType,batAmmo,1,'ammo');
            mergeObjects(totalCosts,deployCosts);
        }
    }
    if (myNewGear[1] != myGear[1]) {
        let batAmmo2 = getAmmoByName(myNewGear[1]);
        flatCosts = getCosts(myBatType,batAmmo2,2,'ammo');
        mergeObjects(totalCosts,flatCosts);
        if (!playerInfos.onShip) {
            deployCosts = getDeployCosts(myBatType,batAmmo2,2,'ammo');
            mergeObjects(totalCosts,deployCosts);
        }
    }
    let costsOK = checkCost(totalCosts);
    console.log(totalCosts);
    if (costsOK) {
        let gearStuff = getBatGearStuff(myNewGear[2],myNewGear[3],myBatType);
        myBat.armor = gearStuff[0];
        myBat.ap = gearStuff[1];
        myBat.ammo = myNewGear[0];
        myBat.ammo2 = myNewGear[1];
        myBat.prt = myNewGear[2];
        myBat.eq = myNewGear[3];
        myBat.tdc = getAutoEqList(myBat,myBatType,false);
        myBat.logeq = getBonusEq(myBatType,false);
        if (myBat.logeq === 'g2ai') {
            myBat.ok = '';
        }
        let oldGearTags = getBatGearTags(myGear[2],myGear[3],myBatType);
        myBat.tags = myBat.tags.filter(function(el) {
            return !oldGearTags.includes(el);
        });
        let gearTags = getBatGearTags(myNewGear[2],myNewGear[3],myBatType);
        myBat.tags.push.apply(myBat.tags,gearTags);
        payCost(totalCosts);
        addCost(totalRecup,1);
        if (!playerInfos.onShip) {
            myBat.apLeft = myBat.apLeft-myBat.ap;
        }
        if (equipChanged) {
            if (myBat.eq.includes('sci-') || myBat.eq === 'gang-lore') {
                myBat.sciRech = 0;
            }
        }
    }
    let batNewXP = checkXPBonus(myBatType);
    if (batNewXP > myBat.xp) {
        myBat.xp = batNewXP;
    }
    selectedBat = myBat;
    conOut(true);
    myNewGear = ['xxx','xxx','xxx','xxx'];
    if (inSoute) {
        goSoute();
    }
    showBatInfos(myBat);
};

function getBatGearStuff(armorName,equipName,batType) {
    let gearStuff = [];
    if (batType.skills.includes('penitbat') && playerInfos.onShip) {
        setPenitLevel();
    }
    // ARMOR
    let batArmor = getEquipByName(armorName);
    gearStuff[0] = batType.armor+batArmor.armor;
    // tombé du camion?
    if (batType.skills.includes('penitbat')) {
        if (playerInfos.penit >= 10 && gearStuff[0] < 4) {
            gearStuff[0] = gearStuff[0]+2;
        } else if (playerInfos.penit >= 6) {
            gearStuff[0] = gearStuff[0]+1;
        }
    }
    // armure de base de l'unité? => Armure
    if (batType.armor >= 2) {
        if (batType.skills.includes('robot') || batType.skills.includes('cyber') || batType.cat === 'infantry') {
            if (batType.armor > batArmor.armor) {
                gearStuff[0] = batType.armor+Math.ceil(batArmor.armor);
            } else {
                gearStuff[0] = batArmor.armor+Math.ceil(batType.armor);
            }
        }
    }
    // skill bigprot?
    if (batType.skills.includes('bigprot')) {
        let blindageBonus = (batArmor.armor*2)+1;
        if (blindageBonus > 8) {
            blindageBonus = 8;
        }
        gearStuff[0] = batType.armor+blindageBonus;
    }
    // AP
    let baseAP = batType.ap;
    if (equipName === 'e-jetpack') {
        baseAP = 13;
    }
    // weak
    if (batType.skills.includes('weak')) {
        if (Math.abs(batArmor.ap) >= 3) {
            baseAP = baseAP+batArmor.ap+2;
        }
    }
    if (batType.skills.includes('robot')) {
        gearStuff[1] = baseAP;
        if (batArmor.armor === 1) {
            gearStuff[0] = gearStuff[0]+1;
        }
    } else {
        if ((batType.skills.includes('fly') || equipName === 'e-jetpack') && batArmor.ap < 0) {
            gearStuff[1] = Math.ceil(baseAP+(batArmor.ap*1.5));
        } else if ((equipName === 'helper') && batType.moveCost > 3) {
            gearStuff[1] = baseAP+batArmor.ap+2;
        } else if ((equipName === 'helper') && (batArmor.ap < -1 || batType.ap < 13)) {
            gearStuff[1] = baseAP+batArmor.ap+1;
        } else if (batType.skills.includes('strong') && (batType.skills.includes('mutant') || playerInfos.bldVM.includes('Salle de sport')) && batArmor.ap < -1) {
            gearStuff[1] = baseAP+batArmor.ap+1;
        } else if (batType.moveCost === 99) {
            gearStuff[1] = baseAP;
        } else {
            gearStuff[1] = baseAP+batArmor.ap;
        }
    }
    if (batType.skills.includes('domeconst')) {
        gearStuff[1] = batType.ap;
    }
    return gearStuff;
}

function getBatGearTags(armorName,equipName,batType) {
    let gearTags = [];
    let batArmor = getEquipByName(armorName);
    let batEquip = getEquipByName(equipName);
    if (batArmor.skills.includes('slowreg')) {
        if (!batType.skills.includes('slowreg') && !batType.skills.includes('regeneration')) {
            gearTags.push('slowreg');
        }
    }
    if (batArmor.skills.includes('regeneration')) {
        if (!batType.skills.includes('regeneration')) {
            gearTags.push('regeneration');
        }
    }
    if (batArmor.skills.includes('autorepair')) {
        if (!batType.skills.includes('autorep')) {
            gearTags.push('autorep');
        }
    }
    if (batArmor.skills.includes('resistfeu') || batEquip.name === 'kit-pompiste') {
        if (!batType.skills.includes('resistfeu')) {
            gearTags.push('resistfeu');
        }
    }
    if (batArmor.skills.includes('resistall')) {
        if (!batType.skills.includes('resistall') && !batType.skills.includes('protectall')) {
            gearTags.push('resistall');
        }
    }
    if (batArmor.skills.includes('protectall')) {
        if (!batType.skills.includes('protectall')) {
            gearTags.push('protectall');
        }
    }
    if (batArmor.skills.includes('resistacide') || batEquip.name === 'kit-sentinelle') {
        if (!batType.skills.includes('resistacide')) {
            gearTags.push('resistacide');
        }
    }
    if (batArmor.skills.includes('resistelec')) {
        if (!batType.skills.includes('resistelec')) {
            gearTags.push('resistelec');
        }
    }
    return gearTags;
};

function verifBldReq(unit,bldReq) {
    let bldReqOK = false;
    // console.log('VERIF BLDREQ');
    // console.log(unit);
    // console.log(bldReq);
    if (bldReq instanceof Array) {
        if (bldReq[0] === 'Caserne') {
            bldReq[0] = 'Caserne '+capitalizeFirstLetter(playerInfos.gang);
        }
        if (bldReq[1] === 'Caserne') {
            bldReq[1] = 'Caserne '+capitalizeFirstLetter(playerInfos.gang);
        }
        if (bldReq[2] === 'Caserne') {
            bldReq[2] = 'Caserne '+capitalizeFirstLetter(playerInfos.gang);
        }
        // console.log(bldReq);
        if (playerInfos.bldList.includes(bldReq[0]) || bldReq[0] === undefined || unit.name === bldReq[0]) {
            if (playerInfos.bldList.includes(bldReq[1]) || bldReq[1] === undefined || unit.name === bldReq[1]) {
                if (playerInfos.bldList.includes(bldReq[2]) || bldReq[2] === undefined || unit.name === bldReq[2]) {
                    bldReqOK = true;
                }
            }
        }
    } else {
        bldReqOK = true;
    }
    return bldReqOK;
};

function deployAmmo(ammo,weapon,batId) {
    let myBat = getBatById(batId);
    let myBatType = getBatType(myBat);
    if (hasEquip(myBat,['fakit']) || !myBatType.skills.includes('unemun')) {
        if (weapon === 'w1') {
            myNewGear[0] = ammo;
        } else {
            myNewGear[1] = ammo;
        }
    } else {
        myNewGear[0] = ammo;
        myNewGear[1] = ammo;
    }
    reEquip(batId,true);
};

function deployArmor(armor,batId) {
    myNewGear[2] = armor;
    reEquip(batId,true);
};

function deployEquip(equip,batId) {
    myNewGear[3] = equip;
    reEquip(batId,true);
};
