function reEquip(batId,noRefresh) {
    console.log('reEquip +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('batId = '+batId);
    let myBat = getBatById(batId);
    console.log(myBat);
    let myBatType = getBatType(myBat);
    console.log(myBatType);
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
                armorSkills = '';
                if (batArmor.skills.includes('slowreg')) {
                    armorSkills = armorSkills+' slowreg';
                }
                if (batArmor.skills.includes('regeneration')) {
                    armorSkills = armorSkills+' regeneration';
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
                if (batArmor.skills.includes('resistelec')) {
                    armorSkills = armorSkills+' resistelec';
                }
                if (batArmor.skills.includes('soap')) {
                    armorSkills = armorSkills+' resistgrip';
                }
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
                        $('#conAmmoList').append('<span class="constName klik" title="'+toNiceString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'" onclick="deployArmor(`'+armor+'`,`'+myBat.id+'`)">'+armor+prodSign+' <span class="gff">(+'+batArmor.armor+'/'+batArmor.ap+')'+armorSkills+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'">'+armor+prodSign+' <span class="gff">(+'+batArmor.armor+'/'+batArmor.ap+')'+armorSkills+'</span></span><br>');
                    }
                } else {
                    if (armor === myBat.prt) {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        $('#conAmmoList').append('<span class="constName gff" title="'+toNiceString(batArmor.bldReq)+'">'+armor+' <span class="gff">(+'+batArmor.armor+'/'+batArmor.ap+')'+armorSkills+'</span></span><br>');
                    }
                }
                listNum++;
            });
        }
    }
    let batEquip;
    let weapName;
    let equipNotes;
    let bonusEqName = getBonusEq(myBatType);
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
                if (batEquip.name === 'e-flash') {
                    if (playerInfos.comp.log === 3 || playerInfos.comp.det >= 3) {
                        showEq = false;
                    }
                }
                compReqOK = checkCompReq(batEquip);
                if (checkSpecialEquip(batEquip,myBatType)) {
                    compReqOK = false;
                }
                if ((compReqOK || conselTriche) && showEq) {
                    if (myNewGear[3] == equip || (myNewGear[3] === 'xxx' && listNum === 1) || (bonusEqName === equip)) {
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
                        $('#conAmmoList').append('<span class="constName" title="'+showEquipInfo(equip,myBatType,true)+' / '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+showEquipInfo(equip,myBatType,true)+' / '+displayCosts(flatCosts)+'" onclick="deployEquip(`'+equip+'`,`'+myBat.id+'`)">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName gff" title="'+showEquipInfo(equip,myBatType,true)+' / '+toNiceString(batEquip.bldReq)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    }
                } else {
                    if (equip === myBat.eq || equip === myBat.logeq) {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        $('#conAmmoList').append('<span class="constName gff" title="'+showEquipInfo(equip,myBatType,true)+' / '+toNiceString(batEquip.bldReq)+'">'+equip+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
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
                            $('#conAmmoList').append('<span class="constName gff" title="'+toNiceString(batAmmo.bldReq)+' '+displayCosts(deployCosts)+'">'+showAmmo(ammo)+prodSign+'</span><br>');
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
        if (Object.keys(myBatType.weapon2).length >= 1 && (!myBatType.skills.includes('unemun') || myBat.eq === 'fakit' || myBat.logeq === 'fakit')) {
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
                            $('#conAmmoList').append('<span class="constName gff" title="'+toNiceString(batAmmo.bldReq)+' '+displayCosts(deployCosts)+'">'+showAmmo(ammo)+prodSign+'</span><br>');
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
    console.log('W2ALT --------------------------------------------------------------');
    console.log(batEquip.name);
    if (batEquip.name.startsWith('w2-') && !batEquip.name.startsWith('w2-auto')) {
        console.log('start ok');
        if (batType.weapon2.equip != undefined) {
            console.log(batType.weapon2.equip);
            if (batType.weapon2.equip != batEquip.name) {
                showEq = false;
            }
        }
    }
    if (Object.keys(bat).length >= 1) {
        if (bat.tdc.includes(batEquip.name)) {
            showEq = false;
        }
    }
    return showEq;
};

function getBonusEq(unit) {
    console.log("CHECK BONUS EQ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    let bonusEqName = '';
    if (unit.autoEq != undefined) {
        console.log(unit.autoEq);
        if (unit.autoEq.length >= 1) {
            unit.autoEq.forEach(function(equipName) {
                if (bonusEqName === '') {
                    let equip = getEquipByName(equipName);
                    // console.log(equip);
                    let compReqOK = checkCompReq(equip);
                    if (checkSpecialEquip(equip,unit)) {
                        compReqOK = false;
                    }
                    console.log('compReqOK='+compReqOK);
                    if (compReqOK) {
                        if (equip.autoComp.length === 2) {
                            let autoCompName = equip.autoComp[0];
                            let autoCompLevel = equip.autoComp[1];
                            if (playerInfos.comp[autoCompName] >= autoCompLevel) {
                                bonusEqName = equipName;
                            }
                        }
                    }
                }
            });
        }
    }
    if (bonusEqName === '') {
        if (unit.log3eq != undefined) {
            console.log(unit.log3eq);
            if (unit.log3eq.length >= 1) {
                unit.log3eq.forEach(function(equipName) {
                    if (bonusEqName === '') {
                        let equip = getEquipByName(equipName);
                        // console.log(equip);
                        let compReqOK = checkCompReq(equip);
                        if (checkSpecialEquip(equip,unit)) {
                            compReqOK = false;
                        }
                        console.log('compReqOK='+compReqOK);
                        if (compReqOK) {
                            if (playerInfos.comp.log === 3 && equipName != 'garage') {
                                // console.log('log3');
                                bonusEqName = equipName;
                            } else if (equip.autoComp.length === 2) {
                                let autoCompName = equip.autoComp[0];
                                let autoCompLevel = equip.autoComp[1];
                                if (playerInfos.comp[autoCompName] >= autoCompLevel) {
                                    bonusEqName = equipName;
                                }
                            }
                        }
                    }
                });
            }
        }
    }
    console.log('bonusEqName='+bonusEqName);
    return bonusEqName;
};

function checkHasWeapon(num,batType,eq) {
    console.log('checkHasWeapon ================================================================================');
    console.log(num);
    console.log(batType);
    console.log(eq);
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
            selectedBat.ammo = batType.weapon.ammo[0];
        }
        ammo = getAmmoByName(bat.ammo2);
        compReqOK = checkCompReq(ammo);
        bldReqOK = verifBldReq(batType,ammo.bldReq);
        if (!compReqOK || !bldReqOK) {
            selectedBat.ammo2 = batType.weapon.ammo[0];
        }
        selectedBatArrayUpdate();
    }
};

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
        myBat.logeq = getBonusEq(myBatType);
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
    // armure de base de l'unité?
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
    if (batType.skills.includes('robot')) {
        gearStuff[1] = baseAP;
        if (batArmor.armor === 1) {
            gearStuff[0] = gearStuff[0]+1;
        }
    } else {
        if ((batType.skills.includes('fly') || equipName === 'e-jetpack') && batArmor.ap < 0) {
            gearStuff[1] = Math.ceil(baseAP+(batArmor.ap*1.5));
        } else if ((equipName === 'helper' || equipName === 'cyberkit') && batType.moveCost > 3) {
            gearStuff[1] = baseAP+batArmor.ap+2;
        } else if ((equipName === 'helper' || equipName === 'cyberkit') && (batArmor.ap < -1 || batType.ap < 13)) {
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
        if (!batType.skills.includes('resistall')) {
            gearTags.push('resistall');
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
    console.log('VERIF BLDREQ');
    console.log(unit);
    console.log(bldReq);
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
    if (myBatType.skills.includes('unemun') && myBat.eq != 'fakit' && myBat.logeq != 'fakit') {
        myNewGear[0] = ammo;
        myNewGear[1] = ammo;
    } else {
        if (weapon === 'w1') {
            myNewGear[0] = ammo;
        } else {
            myNewGear[1] = ammo;
        }
    }
    reEquip(batId,true);
};

function deployArmor(armor,batId) {
    myNewGear[2] = armor;
    reEquip(batId,true);
};

function deployEquip(equip,batId) {
    console.log('deployEquip **********************************');
    console.log(batId);
    console.log(equip);
    myNewGear[3] = equip;
    reEquip(batId,true);
};
