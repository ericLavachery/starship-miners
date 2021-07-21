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
    $('#conAmmoList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
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
                compReqOK = checkCompReq(batArmor);
                if (compReqOK) {
                    if (myNewGear[2] == armor || (myNewGear[2] === 'xxx' && listNum === 1)) {
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
                    flatCosts = getCosts(myBatType,batArmor,0,'equip');
                    deployCosts = getDeployCosts(myBatType,batArmor,0,'equip');
                    mergeObjects(flatCosts,deployCosts);
                    costsOK = checkCost(flatCosts);
                    bldReqOK = false;
                    if (playerInfos.bldList.includes(batArmor.bldReq[0]) || batArmor.bldReq[0] === undefined || myBatType.name === batArmor.bldReq[0]) {
                        bldReqOK = true;
                    }
                    prodSign = ' <span class="ciel">&raquo;</span>';
                    if (!compReqOK) {
                        prodSign = '';
                    }
                    if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+toNiceString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'" onclick="deployArmor(`'+armor+'`,`'+myBat.id+'`)">'+armor+prodSign+' <span class="gff">(+'+batArmor.armor+'/'+batArmor.ap+')'+armorSkills+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'">'+armor+prodSign+' <span class="gff">(+'+batArmor.armor+'/'+batArmor.ap+')'+armorSkills+'</span></span><br>');
                    }
                }
                listNum++;
            });
        }
    }
    let batEquip;
    let weapName;
    let equipNotes;
    listNum = 1;
    // EQUIP ---------------------------------------------
    if (myBatType.equip != undefined) {
        if (myBatType.equip.length >= 1) {
            // console.log(myBatType.equip);
            $('#conAmmoList').append('<span class="constName or">Equipement</span><br>');
            myBatType.equip.forEach(function(equip) {
                batEquip = getEquipByName(equip);
                compReqOK = checkCompReq(batEquip);
                if (compReqOK || conselTriche) {
                    if (myNewGear[3] == equip || (myNewGear[3] === 'xxx' && listNum === 1) || (playerInfos.comp.log === 3 && myBatType.log3eq === equip && compReqOK)) {
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
                        weapName = ' ('+myBatType.weapon.name+')';
                    } else if (equip.endsWith('2')) {
                        weapName = ' ('+myBatType.weapon2.name+')';
                    }
                    if (equip.startsWith('w2-') || equip.startsWith('kit-')) {
                        weapName = ' ('+myBatType.weapon2.name+')';
                    }
                    if (equip.startsWith('w1-') && !equip.includes('auto')) {
                        weapName = ' ('+myBatType.weapon.name+')';
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
                    bldReqOK = false;
                    if ((playerInfos.bldList.includes(batEquip.bldReq[0]) || batEquip.bldReq[0] === undefined || myBatType.name === batEquip.bldReq[0]) && (playerInfos.bldList.includes(batEquip.bldReq[1]) || batEquip.bldReq[1] === undefined || myBatType.name === batEquip.bldReq[1])) {
                        bldReqOK = true;
                    }
                    prodSign = ' <span class="ciel">&raquo;</span>';
                    if (!compReqOK) {
                        prodSign = '';
                    }
                    if (playerInfos.comp.log === 3 && myBatType.log3eq === equip && compReqOK) {
                        $('#conAmmoList').append('<span class="constName" title="'+showEquipInfo(equip)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+showEquipInfo(equip)+' '+displayCosts(flatCosts)+'" onclick="deployEquip(`'+equip+'`,`'+myBat.id+'`)">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName gff" title="'+toNiceString(batEquip.bldReq)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
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
                        bldReqOK = false;
                        if (batAmmo.bldReq instanceof Array) {
                            if ((playerInfos.bldList.includes(batAmmo.bldReq[0]) || batAmmo.bldReq[0] === undefined || myBatType.name === batAmmo.bldReq[0]) && (playerInfos.bldList.includes(batAmmo.bldReq[1]) || batAmmo.bldReq[1] === undefined || myBatType.name === batAmmo.bldReq[1])) {
                                bldReqOK = true;
                            }
                            if (playerInfos.bldList.includes('Poudrière') && playerInfos.bldList.includes('Armurerie')) {
                                if ((playerInfos.bldVM.includes(batAmmo.bldReq[0]) || batAmmo.bldReq[0] === undefined || conselUnit.name === batAmmo.bldReq[0]) && (playerInfos.bldVM.includes(batAmmo.bldReq[1]) || batAmmo.bldReq[1] === undefined || conselUnit.name === batAmmo.bldReq[1])) {
                                    bldReqOK = true;
                                }
                            }
                        } else {
                            bldReqOK = true;
                        }
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
        if (Object.keys(myBatType.weapon2).length >= 1 && !myBatType.skills.includes('unemun')) {
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
                        bldReqOK = false;
                        if (batAmmo.bldReq instanceof Array) {
                            if ((playerInfos.bldList.includes(batAmmo.bldReq[0]) || batAmmo.bldReq[0] === undefined || myBatType.name === batAmmo.bldReq[0]) && (playerInfos.bldList.includes(batAmmo.bldReq[1]) || batAmmo.bldReq[1] === undefined || myBatType.name === batAmmo.bldReq[1])) {
                                bldReqOK = true;
                            }
                            if (playerInfos.bldList.includes('Poudrière') && playerInfos.bldList.includes('Armurerie')) {
                                if ((playerInfos.bldVM.includes(batAmmo.bldReq[0]) || batAmmo.bldReq[0] === undefined || conselUnit.name === batAmmo.bldReq[0]) && (playerInfos.bldVM.includes(batAmmo.bldReq[1]) || batAmmo.bldReq[1] === undefined || conselUnit.name === batAmmo.bldReq[1])) {
                                    bldReqOK = true;
                                }
                            }
                        } else {
                            bldReqOK = true;
                        }
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
                hasWeapon = true;
            }
        }
    }
    return hasWeapon;
}

function doReEquip(batId) {
    let myBat = getBatById(batId);
    let myBatType = getBatType(myBat);
    let myGear = [myBat.ammo,myBat.ammo2,myBat.prt,myBat.eq];
    let payOK = true;
    let totalCosts = {};
    let flatCosts = {};
    let deployCosts = {};
    let totalRecup = {};
    let recup = {};
    if (myNewGear[3] != myGear[3]) {
        let batArmor = getEquipByName(myNewGear[3]);
        flatCosts = getCosts(myBatType,batArmor,0,'equip');
        mergeObjects(totalCosts,flatCosts);
        if (!playerInfos.onShip) {
            deployCosts = getDeployCosts(myBatType,batArmor,0,'equip');
            mergeObjects(totalCosts,deployCosts);
        }
        if (!myGear[3].includes('aucun')) {
            let oldBatArmor = getEquipByName(myGear[3]);
            flatCosts = getCosts(myBatType,oldBatArmor,0,'equip');
            recup = getRecup(flatCosts);
            mergeObjects(totalRecup,recup);
        }
    }
    if (myNewGear[2] != myGear[2]) {
        let batEquip = getEquipByName(myNewGear[2]);
        flatCosts = getCosts(myBatType,batEquip,0,'equip');
        mergeObjects(totalCosts,flatCosts);
        if (!playerInfos.onShip) {
            deployCosts = getDeployCosts(myBatType,batEquip,0,'equip');
            mergeObjects(totalCosts,deployCosts);
        }
        if (!myGear[2].includes('aucun')) {
            let oldBatEquip = getEquipByName(myGear[2]);
            flatCosts = getCosts(myBatType,oldBatEquip,0,'equip');
            recup = getRecup(flatCosts);
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
        myBat.logeq = '';
        if (playerInfos.comp.log === 3) {
            if (myBatType.log3eq != undefined) {
                if (myBatType.log3eq != '') {
                    let logEquip = getEquipByName(myBatType.log3eq);
                    let compReqOK = checkCompReq(logEquip);
                    if (compReqOK) {
                        myBat.logeq = logEquip.name;
                    }
                }
            }
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
    }
    conOut();
    myNewGear = ['xxx','xxx','xxx','xxx'];
    showBatInfos(myBat);
    if (inSoute) {
        goSoute();
    }
};

function getBatGearStuff(armorName,equipName,batType) {
    let gearStuff = [];
    let batArmor = getEquipByName(armorName);
    gearStuff[0] = batType.armor+batArmor.armor;
    if (batType.skills.includes('bigprot')) {
        gearStuff[0] = batType.armor+(batArmor.armor*2);
    }
    let baseAP = batType.ap;
    if (equipName === 'e-jetpack') {
        baseAP = 17;
    }
    if ((batType.skills.includes('fly') || equipName === 'e-jetpack') && batArmor.ap < 0) {
        gearStuff[1] = baseAP+Math.ceil(batArmor.ap*1.5);
    } else if (equipName === 'helper' && batType.moveCost > 3) {
        gearStuff[1] = baseAP+batArmor.ap+2;
    } else if (equipName === 'helper' && (batArmor.ap < -1 || batType.ap < 13)) {
        gearStuff[1] = baseAP+batArmor.ap+1;
    } else if (batType.skills.includes('strong') && batArmor.ap < -1) {
        gearStuff[1] = baseAP+batArmor.ap+1;
    } else if (batType.moveCost === 99) {
        gearStuff[1] = baseAP;
    } else {
        gearStuff[1] = baseAP+batArmor.ap;
    }
    return gearStuff;
}

function getBatGearTags(armorName,equipName,batType) {
    let gearTags = [];
    let batArmor = getEquipByName(armorName);
    let batEquip = getEquipByName(equipName);
    if (batArmor.skills.includes('slowreg')) {
        if (!batType.skills.includes('slowReg') && !batType.skills.includes('regeneration')) {
            gearTags.push('slowreg');
        }
    }
    if (batArmor.skills.includes('resistfeu') || batEquip.name === 'kit-pompiste' || batEquip.name === 'crimekitto') {
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

function deployAmmo(ammo,weapon,batId) {
    let myBat = getBatById(batId);
    let myBatType = getBatType(myBat);
    if (myBatType.skills.includes('unemun')) {
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
    myNewGear[3] = equip;
    reEquip(batId,true);
};
