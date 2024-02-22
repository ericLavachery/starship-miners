function goProduction() {
    souteBatSelect(false);
    bfconst('all',false,'',false);
};

function prodFromSoute() {
    goStation();
    goProduction();
}

function bfconst(cat,triche,upgrade,retour) {
    justReloaded = false;
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
        catz.push('devices');
    }
    if (cat === 'all') {
        catz.push('buildings');
        catz.push('infantry');
        catz.push('vehicles');
        catz.push('devices');
    }
    selectMode();
    if (Object.keys(conselUnit).length >= 1) {
        cursorSwitch('.','grid-item','thor');
    }
    // findLanders();
    checkReserve();
    let dispoCrim = getDispoCrim();
    let dispoCit = getDispoCit();
    let yh = youHave();
    updateBldList();
    let slots = calcSlots();
    let maxCrafts = getMaxCrafts();
    let restCrafts = maxCrafts-playerInfos.crafts;
    let restCraftsPerc = Math.round(100/maxCrafts*restCrafts);
    let craftCol = 'gff';
    if (restCraftsPerc <= 20) {
        craftCol = 'jaune';
    }
    if (restCrafts <= 0) {
        restCrafts = 0;
        craftCol = 'or';
    }
    $("#conUnitList").css("display","block");
    // $('#conUnitList').css("height","700px");
    if (conselTriche) {
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
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<br><span class="constName neutre">Crafts restants: <span class="'+craftCol+'">'+restCrafts+'</span></span><br>');
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
    let directProd = true;
    let mayOut = false;
    let compReqOK = false;
    let bldOK = false;
    let uMaxOK = true;
    let costOK = false;
    let slotsOK = false;
    let costString = '';
    let unitMergedCosts;
    sortedUnitsList.forEach(function(unit) {
        // console.log(unit.name);
        mayOut = checkMayOut(unit,false);
        slotsOK = iCanSlotThis(slots,unit);
        let unitSlots = unit.slots;
        uMaxOK = true;
        prodOK = true;
        prodHere = false;
        directProd = true;
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
        let pDistOK = checkPiloneDistance(unit,triche);
        let pNumOK = checkPiloneNumber(unit,triche);
        if (!triche) {
            prodHere = iCanProdThis(selectedBatType,unit,catz);
            if (unit.bldCost != 'none') {
                directProd = false;
            }
            if (unit.unitCost != 'none') {
                directProd = false;
            }
            if (conselUpgrade === 'bld') {
                if (selectedBatType.bldUp.includes(unit.name)) {
                    prodHere = true;
                } else {
                    prodHere = false;
                }
                let upFromUnit = getBatTypeByName(unit.bldCost);
                unitSlots = unitSlots-upFromUnit.slots;
            }
            if (conselUpgrade === 'inf') {
                if (selectedBatType.unitUp === unit.name) {
                    prodHere = true;
                } else {
                    prodHere = false;
                }
            }
        }
        // console.log('prodOK='+prodOK);
        // console.log('prodHere='+prodHere);
        // console.log('mayOut='+mayOut);
        if ((prodOK && prodHere && mayOut) || triche) {
            if (lastKind != unit.kind) {
                showkind = unit.kind.replace(/zero-/g,"");
                showkind = showkind.replace(/trans-/g,"");
                $('#conUnitList').append('<br><a href="#gentils"><span class="constName or" id="kind-'+unit.kind+'">'+showkind+'</span></a><br>');
            }
            if (conselUnit.id === unit.id && conselUnit.team === 'player') {
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
            if (unit.skills.includes('clicput')) {
                if ((playerInfos.bldVM.includes(unit.bldReq[0]) || unit.bldReq[0] === undefined) && (playerInfos.bldVM.includes(unit.bldReq[1]) || unit.bldReq[1] === undefined) && (playerInfos.bldVM.includes(unit.bldReq[2]) || unit.bldReq[2] === undefined)) {
                    if (unit.bldReq[0] === 'Générateur' || unit.bldReq[0] === 'Centrale SMR' || unit.bldReq[1] === 'Générateur' || unit.bldReq[1] === 'Centrale SMR' || unit.bldReq[2] === 'Générateur' || unit.bldReq[2] === 'Centrale SMR') {
                        // nope
                    } else {
                        bldOK = true;
                    }
                }
            }
            let maxInfo = maxUnits(unit);
            if (maxInfo.ko) {
                uMaxOK = false;
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
            if (unit.skills.includes('clone') || unit.skills.includes('dog')) {
                unitCits = 0;
            }
            let citAlert = '';
            if (unitCits >= 1) {
                let enoughCit = checkCitCost(unit);
                if (!enoughCit) {
                    if (!unit.skills.includes('brigands')) {
                        citAlert = ' &#128119;{&#128683;Citoyens:'+unitCits+'!}';
                    } else {
                        citAlert = ' &#128119;{&#128683;Criminels:'+unitCits+'!}';
                    }
                } else {
                    if (!unit.skills.includes('brigands')) {
                        citAlert = ' &#128119;{Citoyens:'+unitCits+'}';
                    } else {
                        citAlert = ' &#128119;{Criminels:'+unitCits+'}';
                    }
                }
                // console.log('Citoyens');
                // console.log(enoughCit);
                // console.log('citAlert='+citAlert);
            }
            let citColour = 'gff';
            let citName = 'Citoyens';
            if (unit.skills.includes('brigands')) {
                citColour = 'brunf';
                citName = 'Criminels';
            }
            let deco = '';
            if (playerInfos.bldList.includes(unit.name)) {
                deco = ' udl';
            }
            let yhPrint = '';
            if (yh[unit.name] >= 0) {
                if (maxInfo.max < 90) {
                    if (maxInfo.maxText != '') {
                        yhPrint = ' <span title="'+maxInfo.num+'/'+maxInfo.max+' '+maxInfo.maxText+'">('+yh[unit.name]+')</span>';
                    } else {
                        yhPrint = ' <span title="'+yh[unit.name]+'/'+maxInfo.max+'">('+yh[unit.name]+')</span>';
                    }
                } else {
                    yhPrint = ' <span title="'+yh[unit.name]+'/&infin;">('+yh[unit.name]+')</span>';
                }
            }
            let descLink = ' <span class="klik" title="Détail" onclick="unitDetail('+unit.id+')">&#128065;</span>';
            if (!directProd && conselUpgrade != 'bld' && conselUpgrade != 'inf' && !triche) {
                let fromUnitName = 'Tagada';
                if (unit.bldCost != 'none') {
                    fromUnitName = unit.bldCost;
                } else if (unit.unitCost != 'none') {
                    fromUnitName = unit.unitCost;
                }
                color = 'gff';
                $('#conUnitList').append('<span class="constName '+color+deco+'"><span title="&#127872; Se construit en transformant: '+fromUnitName+'">'+unit.name+'</span> <span class="'+citColour+'" title="'+unitCits+' '+citName+'">('+unitCits+'c)</span>'+yhPrint+prodSign+'</span>'+descLink+'<br>');
            } else if ((bldOK && costOK && uMaxOK && slotsOK) || triche) {
                if (pDistOK && pNumOK) {
                    color = catColor(unit);
                    $('#conUnitList').append('<span class="constName klik '+color+deco+'" onclick="conSelect('+unit.id+',`player`,false)"><span title="'+toBldString(unit.bldReq)+citAlert+' '+costString+'">'+unit.name+'</span> <span class="'+citColour+'" title="'+unitCits+' '+citName+'">('+unitCits+'c)</span>'+yhPrint+prodSign+'</span>'+descLink+'<br>');
                } else if (!pNumOK) {
                    color = 'gff';
                    $('#conUnitList').append('<span class="constName '+color+deco+'"><span title="Vous devez avoir 4 Pilônes pour construire un Dôme">'+unit.name+'</span> <span class="'+citColour+'" title="'+unitCits+' '+citName+'">('+unitCits+'c)</span>'+yhPrint+prodSign+'</span>'+descLink+'<br>');
                } else if (!pDistOK) {
                    color = 'gff';
                    $('#conUnitList').append('<span class="constName '+color+deco+'"><span title="Vous ne pouvez pas construire un Pilône ou un Dôme à moins de 25 cases d\'un Pilône existant">'+unit.name+'</span> <span class="'+citColour+'" title="'+unitCits+' '+citName+'">('+unitCits+'c)</span>'+yhPrint+prodSign+'</span>'+descLink+'<br>');
                }
            } else {
                if (!uMaxOK) {
                    color = 'gff';
                    $('#conUnitList').append('<span class="constName '+color+deco+'"><span title="&#9995; '+maxInfo.text+'">'+unit.name+'</span> <span class="'+citColour+'" title="'+unitCits+' '+citName+'">('+unitCits+'c)</span>'+yhPrint+prodSign+'</span>'+descLink+'<br>');
                } else if (!slotsOK) {
                    color = 'gff';
                    $('#conUnitList').append('<span class="constName '+color+deco+'"><span title="&#127959; Vous devez libérer de l\'espace dans la Station. Il reste '+slots.rest+' places et il en faut '+unitSlots+' pour ce bâtiment.">'+unit.name+'</span> <span class="'+citColour+'" title="'+unitCits+' '+citName+'">('+unitCits+'c)</span>'+yhPrint+prodSign+'</span>'+descLink+'<br>');
                } else {
                    color = 'gff';
                    $('#conUnitList').append('<span class="constName '+color+deco+'"><span title="'+toBldString(unit.bldReq)+citAlert+' '+costString+'">'+unit.name+'</span> <span class="'+citColour+'" title="'+unitCits+' '+citName+'">('+unitCits+'c)</span>'+yhPrint+prodSign+'</span>'+descLink+'<br>');
                }
            }
            lastKind = unit.kind;
        }
    });
    if (triche) {
        $('#conUnitList').append('<br><a href="#gentils"><span class="constName or" id="mechants">LES MECHANTS</span></a><br><br>');
        let allALiensList = alienUnits.slice();
        let sortedAliensList = _.sortBy(_.sortBy(_.sortBy(allALiensList,'name'),'name'),'kind');
        sortedAliensList.forEach(function(unit) {
            if (conselUnit.id === unit.id && conselUnit.team === 'aliens') {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
            } else {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle gfff"></i></span>');
            }
            color = catColor(unit);
            $('#conUnitList').append('<span class="constName klik '+color+'" onclick="conSelect('+unit.id+',`aliens`,false)">'+unit.name+'</span><br>');
        });
    }
    $('#conUnitList').append('<br>');
    if ((conselUpgrade === 'inf' || conselUpgrade === 'bld') && playerInfos.onShip) {
        if (Object.keys(conselUnit).length >= 1) {
            $('#conUnitList').append('<span class="blockTitle"><h4><button type="button" title="Transformer '+selectedBatType.name+' en '+conselUnit.name+'" class="boutonCaca iconButtons" onclick="doUpgrade()"><i class="ra ra-rifle rpg"></i> &nbsp;<span class="notsosmall">Transformer</span></button></h4></span><br>');
            $('#conUnitList').append('<br>');
        }
    }
    // if (!retour) {
    //     $("#conUnitList").animate({scrollTop:0},"fast");
    // }
    commandes();
};

function youHave() {
    let yh = {};
    let sortedBats = bataillons.slice();
    sortedBats = _.sortBy(sortedBats,'type');
    sortedBats.forEach(function(bat) {
        if (yh[bat.type] === undefined) {
            yh[bat.type] = 1;
        } else {
            yh[bat.type] = yh[bat.type]+1;
        }
        if (bat.type === 'Infirmiers') {
            if (yh['Médecins'] === undefined) {
                yh['Médecins'] = 1;
            } else {
                yh['Médecins'] = yh['Médecins']+1;
            }
            if (playerInfos.comp.med >= 2) {
                bat.type = 'Médecins';
            }
        }
    });
    unitTypes.forEach(function(unit) {
        if (yh[unit.name] === undefined) {
            yh[unit.name] = 0;
        }
    });
    return yh;
};

function catColor(unit) {
    let unitCol = 'gf';
    if (unit.team === 'aliens') {
        if (unit.kind === 'bug') {
            unitCol = 'rose';
        }
        if (unit.kind === 'spider') {
            unitCol = 'vert';
        }
        if (unit.kind === 'larve') {
            unitCol = 'brun';
        }
        if (unit.kind === 'swarm') {
            unitCol = 'jaune';
        }
        if (unit.kind === 'game') {
            unitCol = 'ciel';
        }
        if (unit.cat === 'vehicles') {
            unitCol = 'marine';
        }
    } else {
        if (unit.cat === 'infantry') {
            unitCol = 'jaune';
        }
        if (unit.cat === 'vehicles') {
            unitCol = 'vert';
        }
        if (unit.cat === 'buildings') {
            unitCol = 'rose';
        }
        if (unit.cat === 'devices') {
            unitCol = 'vio';
        }
        if (unit.skills.includes('transorbital') && unit.name != 'Soute') {
            unitCol = 'bleu';
        }
        if (unit.name === "Dôme" || unit.name === "Soute") {
            unitCol = 'hjaune';
        }
    }
    return unitCol;
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
    let forBld = false;
    if (conselUnit.cat === 'buildings' || conselUnit.cat === 'devices') {
        forBld = true;
    }
    // console.log(conselUnit);
    $('#conAmmoList').empty();
    $('#conAmmoList').append('<br>');
    let armorIndex;
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
                    armorSkills = showArmorInfo(batArmor);
                    fullArmorSkills = showFullArmorInfo(batArmor,forBld,false,false,true,conselUnit);
                    flatCosts = getCosts(conselUnit,batArmor,0,'equip');
                    deployCosts = getDeployCosts(conselUnit,batArmor,0,'equip');
                    mergeObjects(flatCosts,deployCosts);
                    costsOK = checkCost(flatCosts);
                    bldReqOK = verifBldReq(conselUnit,batArmor.bldReq);
                    prodSign = ' <span class="ciel">&raquo;</span>';
                    if (!compReqOK) {
                        prodSign = '';
                    }
                    if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+fullArmorSkills+toBldString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'" onclick="selectArmor(`'+armor+'`,`'+unitId+'`)">'+armor+prodSign+' <span class="gff">'+armorSkills+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName klik gff" title="'+fullArmorSkills+toBldString(batArmor.bldReq)+' '+displayCosts(flatCosts)+'">'+armor+prodSign+' <span class="gff">'+armorSkills+'</span></span><br>');
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
    let bonusEqName = getBonusEq(conselUnit,false);
    let emptyBat = {};
    console.log("bonusEqName="+bonusEqName);
    listNum = 1;
    // EQUIP ---------------------------------------------
    if (conselUnit.equip != undefined) {
        if (conselUnit.equip.length >= 1) {
            // console.log(conselUnit.equip);
            $('#conAmmoList').append('<span class="constName or">Equipement</span><br>');
            conselUnit.equip.forEach(function(equip) {
                batEquip = getEquipByName(equip);
                let showEq = showEquip(conselUnit,batEquip,emptyBat);
                compReqOK = checkCompReq(batEquip);
                if (checkSpecialEquip(batEquip,conselUnit)) {
                    compReqOK = false;
                }
                if ((compReqOK || conselTriche) && showEq) {
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
                    } else if (equip.endsWith('2') && equip != 'psol2') {
                        weapName = ' ('+conselUnit.weapon2.name+')';
                    }
                    if (equip.startsWith('w2-') || equip.startsWith('kit-')) {
                        if (!equip.startsWith('w2-auto')) {
                            weapName = ' ('+conselUnit.weapon2.name+')';
                        }
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
                    bldReqOK = verifBldReq(conselUnit,batEquip.bldReq);
                    prodSign = ' <span class="ciel">&raquo;</span>';
                    if (!compReqOK) {
                        prodSign = '';
                    }
                    if (bonusEqName === equip) {
                        $('#conAmmoList').append('<span class="constName" title="'+showEquipInfo(equip,conselUnit,true)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else if ((bldReqOK && costsOK) || conselTriche) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+showEquipInfo(equip,conselUnit,true)+' '+displayCosts(flatCosts)+'" onclick="selectEquip(`'+equip+'`,`'+unitId+'`)">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName gff" title="'+showEquipInfo(equip,conselUnit,true)+' '+toBldString(batEquip.bldReq)+' '+displayCosts(flatCosts)+'">'+equip+prodSign+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
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
                        bldReqOK = verifBldReq(conselUnit,batAmmo.bldReq);
                        prodSign = ' <span class="ciel">&raquo;</span>';
                        if (!compReqOK) {
                            prodSign = '';
                        }
                        if ((bldReqOK && costsOK) || conselTriche) {
                            $('#conAmmoList').append('<span class="constName klik" title="'+showAmmoInfo(ammo,false,false,conselUnit.weapon.name)+' '+displayCosts(deployCosts)+'" onclick="selectAmmo(`'+ammo+'`,`w1`,`'+unitId+'`)">'+showAmmo(ammo)+prodSign+'</span><br>');
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
                        bldReqOK = verifBldReq(conselUnit,batAmmo.bldReq);
                        prodSign = ' <span class="ciel">&raquo;</span>';
                        if (!compReqOK) {
                            prodSign = '';
                        }
                        if ((bldReqOK && costsOK) || conselTriche) {
                            $('#conAmmoList').append('<span class="constName klik" title="'+showAmmoInfo(ammo,false,false,conselUnit.weapon2.name)+' '+displayCosts(deployCosts)+'" onclick="selectAmmo(`'+ammo+'`,`w2`,`'+unitId+'`)">'+showAmmo(ammo)+prodSign+'</span><br>');
                        } else {
                            $('#conAmmoList').append('<span class="constName gff" title="'+toBldString(batAmmo.bldReq)+' '+displayCosts(deployCosts)+'">'+showAmmo(ammo)+prodSign+'</span><br>');
                        }
                    }
                    listNum++;
                });
            }
        }
    }
    bfconst(conselCat,conselTriche,conselUpgrade,true);
};

function showArmorInfo(batArmor) {
    let apAdj = batArmor.ap;
    if (apAdj >= 1) {
        apAdj = '+'+apAdj;
    }
    let armorSkills = '(+'+batArmor.armor+'/'+apAdj+') ';
    if (batArmor.skills.includes('resistacide')) {
        armorSkills = armorSkills+' r.acide';
    }
    if (batArmor.skills.includes('resistfeu')) {
        armorSkills = armorSkills+' r.feu';
    }
    if (batArmor.skills.includes('resistall')) {
        armorSkills = armorSkills+' r.all';
    }
    if (batArmor.skills.includes('protectall')) {
        armorSkills = armorSkills+' p.all';
    }
    if (batArmor.skills.includes('dreduct')) {
        armorSkills = armorSkills+' d.red';
    }
    if (batArmor.skills.includes('resistelec')) {
        armorSkills = armorSkills+' r.elec';
    }
    if (batArmor.skills.includes('soap')) {
        armorSkills = armorSkills+' r.grip';
    }
    if (batArmor.skills.includes('spikes')) {
        armorSkills = armorSkills+' spikes';
    }
    if (batArmor.skills.includes('autorepair')) {
        armorSkills = armorSkills+' autorep';
    }
    if (batArmor.skills.includes('slowreg')) {
        armorSkills = armorSkills+' s.reg';
    }
    if (batArmor.skills.includes('regeneration')) {
        armorSkills = armorSkills+' reg';
    }
    return armorSkills;
};

function showEquipInfo(equipName,unit,long) {
    let equipIndex = armorTypes.findIndex((obj => obj.name == equipName));
    let equip = armorTypes[equipIndex];
    let equipInfo = '';
    if (equip.info != undefined) {
        if (equip.info === 'Arme 1') {
            equipInfo = equipInfo+unit.weapon.name+' ';
        } else if (equip.info === 'Arme 2') {
            if (long) {
                equipInfo = equipInfo+unit.weapon.name+' + '+unit.weapon2.name+' ';
            } else {
                equipInfo = equipInfo+unit.weapon2.name+' ';
            }
        } else {
            equipInfo = equipInfo+equip.info+' ';
            let sciEqLevel = showSciEqLevel(equip);
            if (sciEqLevel != '') {
                equipInfo = equipInfo+sciEqLevel;
            }
        }
    }
    equipInfo = equipInfo.replace(/ \/ /g,' &#9889; ');
    return equipInfo;
};

function showSciEqLevel(equip) {
    let sciEqLevel = '';
    if (equip.name.includes('sci-')) {
        let equipComp = equip.name.substr(4,10);
        let nextLevel = playerInfos.comp[equipComp]+1;
        sciEqLevel = sciEqLevel+'('+playerInfos.comp[equipComp]+' > '+nextLevel+') '
    }
    return sciEqLevel;
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
    return compReqOK;
};

function checkCompReq(stuff) {
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
    if (!compReqOK) {
        if (stuff.altCompReq != undefined) {
            if (Object.keys(stuff.altCompReq).length >= 1) {
                compReqOK = true;
                Object.entries(stuff.altCompReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (playerInfos.comp[key] < value) {
                        compReqOK = false;
                    }
                });
            }
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
    // lvlReq
    if (stuff.lvlReq != undefined) {
        if (stuff.lvlReq[playerInfos.gang] > playerInfos.gLevel) {
            compReqOK = false;
        }
    }
    return compReqOK;
};

function checkUpCompReq(stuff,comp) {
    let compReqOK = true;
    let playerComps = JSON.parse(JSON.stringify(playerInfos.comp));
    playerComps[comp.name] = playerComps[comp.name]+1;
    // compReq
    if (stuff.compReq != undefined) {
        if (Object.keys(stuff.compReq).length >= 1) {
            Object.entries(stuff.compReq).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (playerComps[key] < value) {
                    compReqOK = false;
                }
            });
        }
    }
    // altCompReq
    if (!compReqOK) {
        if (stuff.altCompReq != undefined) {
            if (Object.keys(stuff.altCompReq).length >= 1) {
                compReqOK = true;
                Object.entries(stuff.altCompReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (playerComps[key] < value) {
                        compReqOK = false;
                    }
                });
            }
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

function checkUprankPlace(myBat,myBatType) {
    let isInPlace = false;
    let upBatType = getBatTypeByName(myBatType.unitUp);
    let uprankBld = '';
    if (upBatType.bldReq != undefined) {
        if (upBatType.bldReq.length >= 1) {
            uprankBld = upBatType.bldReq[0];
        }
    }
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
    if (myBatType.skills.includes('up0')) {
        levelNeeded = 0;
        isXPok = true;
    } else if (myBatType.skills.includes('up3')) {
        levelNeeded = 3;
    } else if (myBatType.skills.includes('up25')) {
        levelNeeded = 2.5;
    }
    let xpLevel25 = Math.round((levelXP[3]+levelXP[2])/2);
    if (myBat.xp >= levelXP[4]) {
        if (levelNeeded <= 4) {
            isXPok = true;
        }
    } else if (myBat.xp >= levelXP[3]) {
        if (levelNeeded <= 3) {
            isXPok = true;
        }
    } else if (myBat.xp >= xpLevel25) {
        if (levelNeeded <= 2.5) {
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

function checkUpUnit(batType) {
    // console.log('check uuuuuuuuuuuuuuuuuup');
    // console.log(batType);
    let upUnitOK = {};
    upUnitOK.ok = false;
    upUnitOK.message = '';
    let upUnitName = batType.unitUp;
    if (batType.skills.includes('upgrade')) {
        upUnitName = batType.bldUp[0];
    }
    // console.log(upUnitName);
    if (upUnitName != undefined) {
        let upBatType = getBatTypeByName(upUnitName);
        // console.log(upBatType);
        let levelOK = true;
        let bldOK = false;
        let compReqOK = checkUnitCompReq(upBatType);
        if (!compReqOK) {
            upUnitOK.message = 'Compétences insuffisantes';
        } else {
            if (upBatType.levels[playerInfos.gang] > playerInfos.gLevel) {
                levelOK = false;
                upUnitOK.message = 'Niveau de gang insuffisant';
            } else {
                if ((playerInfos.bldList.includes(upBatType.bldReq[0]) || upBatType.bldReq[0] === undefined) && (playerInfos.bldList.includes(upBatType.bldReq[1]) || upBatType.bldReq[1] === undefined) && (playerInfos.bldList.includes(upBatType.bldReq[2]) || upBatType.bldReq[2] === undefined)) {
                    bldOK = true;
                } else {
                    upUnitOK.message = 'Bâtiment manquant';
                }
            }
        }
        if (levelOK && compReqOK && bldOK) {
            upUnitOK.ok = true;
        }
    } else {
        upUnitOK.message = 'Pas de transformation possible';
    }
    return upUnitOK;
};

function doUpgrade() {
    // onShip only
    if (conselUpgrade === 'bld') {
        let myBatXP = Math.ceil(selectedBat.xp/1.5);
        let myBatId = selectedBat.id;
        let myBatTileId = selectedBat.tileId;
        if (selectedBat.vmt != undefined) {
            myBatTileId = selectedBat.vmt;
        }
        if (!selectedBatType.skills.includes('transorbital')) {
            let resRecup = getResRecup(selectedBat,selectedBatType);
            console.log('UPGRADE RECUP ======================================= ???');
            console.log(resRecup);
        }
        removeBat(selectedBat.id);
        putBat(myBatTileId,0,myBatXP);
    }
    if (conselUpgrade === 'inf') {
        let myBatXP = Math.ceil(selectedBat.xp/2);
        let myBatId = selectedBat.id;
        let myBatTileId = selectedBat.tileId;
        let myBatGenTag = getBatGenTag(selectedBat);
        removeBat(selectedBat.id);
        putBat(myBatTileId,0,myBatXP,myBatGenTag);
    }
    $("#unitInfos").css("display","none");
    if (inSoute) {
        souteFilter = 'all';
        goSoute();
    }
};

function getBatGenTag(bat) {
    let genTag = '';
    if (bat.tags.includes('genko')) {
        genTag = 'genko';
    }
    if (bat.tags.includes('genslow')) {
        genTag = 'genslow';
    }
    if (bat.tags.includes('genfast')) {
        genTag = 'genfast';
    }
    if (bat.tags.includes('genblind')) {
        genTag = 'genblind';
    }
    if (bat.tags.includes('genstrong')) {
        genTag = 'genstrong';
    }
    if (bat.tags.includes('genwater')) {
        genTag = 'genwater';
    }
    if (bat.tags.includes('genreg')) {
        genTag = 'genreg';
    }
    if (bat.tags.includes('genred')) {
        genTag = 'genred';
    }
    if (bat.tags.includes('genimmune')) {
        genTag = 'genimmune';
    }
    if (bat.tags.includes('genweak')) {
        genTag = 'genweak';
    }
    return genTag;
};

function clickUpgrade(tileId) {
    // zone only
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
        conselReset(true);
        $('#unitInfos').empty();
        $("#unitInfos").css("display","none");
        selectMode();
        batUnstack();
        batUnselect();
        conOut(true);
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
                // Object.keys(selectedBat).length >= 1
                if (!conselTriche) {
                    let intoOK = false;
                    if (!playerInfos.onShip) {
                        if (tileId === selectedBat.tileId) {
                            if (selectedBatType.skills.includes('transorbital')) {
                                if (conselUnit.cat != 'buildings' && conselUnit.cat != 'devices') {
                                    intoOK = true;
                                } else {
                                    message = 'Pas de construction de bâtiments dans un lander';
                                }
                            } else {
                                message = 'Pas de construction sur une case occupée par un de vos bataillons sauf si c\'est un lander';
                            }
                        }
                    }
                    if (intoOK) {
                        batHere = false;
                        conselInto = true;
                    } else {
                        batHere = true;
                        if (message === '') {
                            message = 'Pas de construction sur une case occupée par un de vos bataillons';
                        }
                    }
                } else {
                    batHere = true;
                    message = 'Pas de construction sur une case occupée par un de vos bataillons';
                }
            }
            if (playerInfos.onShip) {
                if (bat.vmt === tileId) {
                    let batType = getBatType(bat);
                    if (!batType.skills.includes('noshow')) {
                        batHere = true;
                        message = 'Pas de construction sur une case occupée par un de vos bataillons';
                    }
                }
            }
        });
        aliens.forEach(function(bat) {
            if (bat.tileId === tileId && bat.loc === "zone") {
                batHere = true;
                message = 'Pas de construction sur une case occupée par un alien';
            }
        });
        if (playerInfos.onShip) {
            if (conselUnit.skills.includes('conscoq')) {
                if (tile.terrain != 'Z') {
                    batHere = true;
                    message = 'Cette unité doit être construite sur une case "Coque"';
                }
            } else {
                if (tile.terrain != 'X') {
                    batHere = true;
                    message = 'Cette unité doit être construite sur une case "Station"';
                }
            }
        }
        if (conselUnit.cat === 'buildings' && !conselTriche) {
            if (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain === 'L') {
                if (!conselUnit.skills.includes('noblub')) {
                    batHere = true;
                    message = 'Cette unité ne peut pas être construite dans l\'eau';
                }
            }
        }
        if (!batHere) {
            if (!free && !playerInfos.onShip) {
                let apCost = prefabCost(selectedBatType,conselUnit,true);
                selectedBat.apLeft = selectedBat.apLeft-apCost;
                selectedBat.xp = selectedBat.xp+(Math.sqrt(conselUnit.fabTime)/20);
                tagDelete(selectedBat,'guet');
                doneAction(selectedBat);
                camoOut();
                selectedBatArrayUpdate();
            }
            if (conselUnit.cat === 'buildings' || conselUnit.cat === 'devices' && !conselUnit.skills.includes('clicput') && !conselTriche) {
                constructSound();
            }
            putBat(tileId,0,0);
            if (conselTriche) {
                bfconst(conselCat,conselTriche,conselUpgrade,true);
                $('#conAmmoList').empty();
            } else {
                conOut(true);
            }
        } else {
            conOut(true);
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
        if (conselUnit.weapon.rof >= 1) {
            conselAmmos[0] = conselUnit.weapon.ammo[0];
        } else {
            conselAmmos[0] = 'none';
        }
    }
    if (conselAmmos[1] == 'xxx') {
        if (conselUnit.weapon2.rof >= 1) {
            conselAmmos[1] = conselUnit.weapon2.ammo[0];
        } else {
            conselAmmos[1] = 'none';
        }
    }
    if (conselAmmos[2] == 'xxx') {
        if (conselUnit.cat === 'infantry') {
            conselAmmos[2] = 'aucune';
        } else {
            conselAmmos[2] = 'aucun';
        }
    }
    if (conselAmmos[3] == 'xxx') {
        conselAmmos[3] = 'aucun';
    }
};

function putBat(tileId,citoyens,xp,startTag,show,fuite,isStartBat) {
    // console.log('PUTBAT');
    constuctorBatId = selectedBat.id;
    if (conselUnit.team === 'aliens') {
        conselTriche = true;
    }
    if (show === undefined) {
        show = true;
    }
    if (isStartBat === undefined) {
        isStartBat = false;
    }
    if (Object.keys(conselUnit).length >= 1) {
        conselNeat();
        let costStatus = {};
        if (conselUnit.team === 'player') {
            costStatus = checkAllCosts(conselUnit,conselAmmos,true,true);
        } else {
            costStatus.ok = true;
            costStatus.string = '';
        }
        if (costStatus.ok || conselTriche || conselUpgrade != '') {
            // PAY COSTS !!!
            if (conselUnit.team === 'player') {
                if (!conselTriche) {
                    // console.log('PAYEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER');
                    payUnitCost(conselUnit);
                    payFlatCosts(conselUnit,conselAmmos);
                    if (!playerInfos.onShip) {
                        payDeployCosts(conselUnit,conselAmmos);
                    }
                }
                // TURNS on STATION
                if (playerInfos.onShip && !conselTriche) {
                    if (conselUnit.fabTime >= 20) {
                        playerInfos.crafts = playerInfos.crafts+Math.floor(conselUnit.fabTime/5.5);
                    } else {
                        playerInfos.crafts = playerInfos.crafts+Math.floor(conselUnit.fabTime/7.7);
                    }
                }
            }
            let tile = getTileById(tileId);
            // console.log(conselUnit);
            let nextId;
            let team;
            if (conselUnit.team === 'player') {
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
            if (conselUnit.team === 'aliens' && conselUnit.name != 'Cocon') {
                newBat.creaTurn = newBat.creaTurn+rand.rand(0,2)-1;
            }
            newBat.loc = 'zone';
            newBat.locId = 0;
            newBat.tileId = tileId;
            newBat.oldTileId = tileId;
            if (conselUnit.skills.includes('prefab') && !conselUnit.skills.includes('noshow')) {
                newBat.vmt = tileId;
            }
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
            if (!conselTriche || isStartBat) {
                newBat.logeq = getBonusEq(conselUnit,isStartBat);
                if (newBat.logeq === 'g2ai') {
                    newBat.ok = '';
                }
            }
            // tdc
            if (isStartBat) {
                newBat.tdc = getAutoEqList(newBat,conselUnit,true);
            } else {
                newBat.tdc = [];
            }
            // Armor
            // let armorName = conselAmmos[2];
            // if (armorName === 'xxx') {
            //     armorName = 'aucune';
            // }
            let armorName = getBaseArmor(conselUnit,conselAmmos[2]);
            let batArmor = getEquipByName(armorName);
            newBat.prt = armorName;
            let gearStuff = getBatGearStuff(armorName,equipName,conselUnit,false);
            newBat.armor = gearStuff[0];
            newBat.ap = gearStuff[1];
            if (conselUnit.team === 'aliens') {
                newBat.apLeft = Math.floor(newBat.ap/1.5);
                newBat.oldapLeft = Math.floor(newBat.ap/1.5);
                newBat.salvoLeft = conselUnit.maxSalvo;
            } else {
                if (conselTriche || playerInfos.onShip) {
                    if (fuite === undefined) {
                        newBat.apLeft = newBat.ap;
                        newBat.oldapLeft = newBat.ap;
                    } else {
                        if (fuite) {
                            newBat.apLeft = 7;
                            newBat.oldapLeft = 7;
                        } else {
                            newBat.apLeft = -8;
                            newBat.oldapLeft = -8;
                        }
                    }
                    newBat.salvoLeft = conselUnit.maxSalvo;
                } else {
                    if (conselUnit.fabTime >= 1) {
                        if (conselUnit.skills.includes('clicput')) {
                            newBat.apLeft = 0;
                            newBat.oldapLeft = 0;
                            newBat.salvoLeft = 0;
                        } else {
                            let constFactor = 15;
                            let daFabTime = conselUnit.fabTime;
                            if (daFabTime < 50) {
                                daFabTime = Math.ceil((conselUnit.fabTime+50)/2);
                            }
                            let averageDomeTime = 50;
                            if (conselUnit.skills.includes('domeconst')) {
                                let rbonus = Math.round((playerInfos.mapTurn-10)*conselUnit.ap/2);
                                newBat.apLeft = conselUnit.ap-(Math.round((conselUnit.fabTime+200)*conselUnit.ap/constFactor)*3/50*averageDomeTime)+rbonus;
                                newBat.oldapLeft = conselUnit.ap-(Math.round((conselUnit.fabTime+200)*conselUnit.ap/constFactor)*3/50*averageDomeTime)+rbonus;
                            } else if (conselUnit.skills.includes('longconst')) {
                                newBat.apLeft = conselUnit.ap-(Math.round(conselUnit.fabTime*conselUnit.ap/constFactor)*3);
                                newBat.oldapLeft = conselUnit.ap-(Math.round(conselUnit.fabTime*conselUnit.ap/constFactor)*3);
                            } else {
                                newBat.apLeft = conselUnit.ap-Math.round(daFabTime*conselUnit.ap/constFactor*1);
                                newBat.oldapLeft = conselUnit.ap-Math.round(daFabTime*conselUnit.ap/constFactor*1);
                            }
                            newBat.salvoLeft = conselUnit.maxSalvo;
                        }
                    } else {
                        newBat.apLeft = newBat.ap;
                        newBat.oldapLeft = newBat.ap;
                        newBat.salvoLeft = conselUnit.maxSalvo;
                    }
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
            let batNewXP = checkXPBonus(conselUnit);
            if (batNewXP > newBat.xp) {
                newBat.xp = batNewXP;
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
                if (startTag != '') {
                    if (conselUnit.team === 'aliens') {
                        if (Array.isArray(startTag)) {
                            newBat.tags = startTag;
                        } else if (startTag === 'seek') {
                            newBat.tags = ['follow'];
                        } else if (startTag === 'follow') {
                            if (!conselUnit.skills.includes('errant') && !conselUnit.skills.includes('capbld') && !conselUnit.skills.includes('nocap') && !conselUnit.skills.includes('capmen')) {
                                newBat.tags = ['follow'];
                            } else {
                                newBat.tags = [];
                            }
                        } else if (startTag === 'veil') {
                            if (!conselUnit.skills.includes('errant') && !conselUnit.skills.includes('capbld') && !conselUnit.skills.includes('nocap') && !conselUnit.skills.includes('capmen')) {
                                newBat.tags = ['invisible','follow'];
                            } else {
                                newBat.tags = ['invisible'];
                            }
                        } else if (startTag === 'tired') {
                            newBat.tags = [];
                            newBat.apLeft = 0;
                            newBat.oldapLeft = 0;
                        } else {
                            newBat.tags = [startTag];
                        }
                    } else {
                        if (startTag === 'camoinf') {
                            newBat.tags = ['nomove','guet','camo'];
                            newBat.fuzz = -2;
                        } else if (startTag === 'camobld') {
                            if (rand.rand(1,8) === 1) {
                                newBat.tags = ['nomove','guet','camo'];
                            } else {
                                newBat.tags = ['nomove','guet','camo','noprefab'];
                            }
                            newBat.fuzz = -2;
                        } else if (startTag === 'fortifguet') {
                            newBat.tags = ['guet','fortif'];
                        } else if (startTag === 'fgnomove') {
                            newBat.tags = ['guet','fortif','nomove'];
                        } else {
                            newBat.tags = [startTag];
                        }
                        if (newBat.tags.includes('nomove')) {
                            newBat.tags.push('outsider');
                        }
                    }
                } else {
                    newBat.tags = [];
                }
            } else {
                newBat.tags = [];
            }
            if (newBat.tags.includes('permashield')) {
                newBat.armor = newBat.armor+15;
            }
            if (conselUnit.team === 'aliens' && conselUnit.moveCost < 90 && conselUnit.kind != 'game') {
                if (zone[0].flw != undefined) {
                    if (zone[0].flw) {
                        if (!conselUnit.skills.includes('errant') && !conselUnit.skills.includes('capbld') && !conselUnit.skills.includes('nocap') && !conselUnit.skills.includes('capmen')) {
                            if (!newBat.tags.includes('follow')) {
                                newBat.tags.push('follow');
                            }
                        }
                    }
                }
            }
            if (coconStats.dome && conselUnit.name === 'Vomissure' && !newBat.tags.includes('morph')) {
                newBat.tags.push('morph');
            }
            if (conselUnit.skills.includes('genhab') || conselUnit.skills.includes('genhab2') || conselUnit.skills.includes('genhab3') || conselUnit.skills.includes('genhab4')) {
                let genDice = 0;
                let goodChance = 0;
                let nullDice = 0;
                if (playerInfos.comp.gen >= 1) {
                    goodChance = (playerInfos.comp.ca*10)+(playerInfos.comp.med*2)+(playerInfos.comp.gen*20);
                    nullDice = 2-Math.round(goodChance/50);
                    if (rand.rand(1,100) <= goodChance) {
                        genDice = rand.rand(4,6);
                        if (conselUnit.skills.includes('genhab2') || conselUnit.skills.includes('genhab3') || conselUnit.skills.includes('genhab4')) {
                            genDice = rand.rand(4,7);
                        }
                    } else {
                        genDice = rand.rand(1,3);
                        if (conselUnit.skills.includes('genhab2') || conselUnit.skills.includes('genhab3') || conselUnit.skills.includes('genhab4')) {
                            genDice = rand.rand(0,3);
                        }
                    }
                    if (genDice === 1 && !conselUnit.skills.includes('genhab4')) {
                        newBat.tags.push('genblind');
                    } else if (genDice === 2) {
                        newBat.tags.push('genslow');
                    } else if (genDice === 3 && !conselUnit.skills.includes('genhab3') && !conselUnit.skills.includes('genhab2')) {
                        newBat.tags.push('genwater');
                    } else if (genDice === 4) {
                        if (!conselUnit.skills.includes('regeneration')) {
                            newBat.tags.push('genreg');
                        } else {
                            newBat.tags.push('genred');
                        }
                    } else if (genDice === 5 && !conselUnit.skills.includes('genhab3') && !conselUnit.skills.includes('genhab4')) {
                        newBat.tags.push('genstrong');
                    } else if (genDice === 6) {
                        newBat.tags.push('genfast');
                    } else if (genDice === 7 && conselUnit.skills.includes('genhab4')) {
                        newBat.tags.push('genfast');
                    }
                    if (rand.rand(1,100) <= goodChance) {
                        genDice = rand.rand(5,7+nullDice);
                        if (conselUnit.skills.includes('genhab2') || conselUnit.skills.includes('genhab3') || conselUnit.skills.includes('genhab4')) {
                            genDice = rand.rand(5,8+nullDice);
                        }
                    } else {
                        genDice = rand.rand(1,4);
                        if (conselUnit.skills.includes('genhab2') || conselUnit.skills.includes('genhab3') || conselUnit.skills.includes('genhab4')) {
                            genDice = rand.rand(0,4);
                        }
                    }
                    if (genDice === 1 && !newBat.tags.includes('genblind') && !conselUnit.skills.includes('genhab4')) {
                        newBat.tags.push('genblind');
                    } else if (genDice === 2 && !newBat.tags.includes('genslow') && !newBat.tags.includes('genfast') && !conselUnit.skills.includes('genhab4')) {
                        newBat.tags.push('genslow');
                    } else if (genDice === 3 && !newBat.tags.includes('genwater') && !conselUnit.skills.includes('genhab3') && !conselUnit.skills.includes('genhab2')) {
                        newBat.tags.push('genwater');
                    } else if (genDice === 5 && newBat.tags.includes('genreg') && conselUnit.skills.includes('resistall')) {
                        newBat.tags.push('genred');
                    } else if (genDice === 5 && !newBat.tags.includes('genreg') && !conselUnit.skills.includes('regeneration')) {
                        newBat.tags.push('genreg');
                    } else if (genDice === 6 && !newBat.tags.includes('genstrong') && !conselUnit.skills.includes('genhab3') && !conselUnit.skills.includes('genhab4')) {
                        newBat.tags.push('genstrong');
                    } else if (genDice === 7 && !newBat.tags.includes('genslow') && !newBat.tags.includes('genfast')) {
                        newBat.tags.push('genfast');
                    } else if (genDice === 7 && newBat.tags.includes('genfast') && conselUnit.skills.includes('resistall')) {
                        newBat.tags.push('genred');
                    }
                } else {
                    genDice = rand.rand(1,3);
                    if (conselUnit.skills.includes('genhab2') || conselUnit.skills.includes('genhab3') || conselUnit.skills.includes('genhab4')) {
                        genDice = rand.rand(1,6);
                    }
                    if (genDice === 1) {
                        newBat.tags.push('genblind');
                    } else if (genDice === 2) {
                        newBat.tags.push('genslow');
                    } else if (genDice === 3 && !conselUnit.skills.includes('genhab3') && !conselUnit.skills.includes('genhab2')) {
                        newBat.tags.push('genwater');
                    }
                    genDice = rand.rand(1,3+playerInfos.comp.ca);
                    if (conselUnit.skills.includes('genhab2') || conselUnit.skills.includes('genhab3') || conselUnit.skills.includes('genhab4')) {
                        genDice = rand.rand(1,6+playerInfos.comp.ca);
                    }
                    if (genDice === 1 && !newBat.tags.includes('genblind')) {
                        newBat.tags.push('genblind');
                    } else if (genDice === 2 && !newBat.tags.includes('genslow') && !conselUnit.skills.includes('genhab4')) {
                        newBat.tags.push('genslow');
                    } else if (genDice === 3 && !newBat.tags.includes('genwater') && !conselUnit.skills.includes('genhab3') && !conselUnit.skills.includes('genhab2')) {
                        newBat.tags.push('genwater');
                    }
                }
            }
            let gearTags = getBatGearTags(armorName,equipName,conselUnit);
            newBat.tags.push.apply(newBat.tags,gearTags);
            if (!conselTriche && conselUnit.team === 'player' && !playerInfos.onShip) {
                newBat.tags.push('construction');
            }
            if (conselUnit.skills.includes('hide') || conselUnit.skills.includes('skyhide') || (larveHIDE && conselUnit.kind === 'larve' && !conselUnit.skills.includes('fly') && !conselUnit.skills.includes('invisible'))) {
                newBat.tags.push('invisible');
            }
            if (newBat.team === 'player') {
                let gotSurv = false;
                if (playerInfos.onShip) {
                    if (playerInfos.gMode < 2) {
                        gotSurv = true;
                    } else if (playerInfos.gMode < 3 && playerInfos.gLevel <= 6) {
                        gotSurv = true;
                    }
                }
                if (gotSurv) {
                    if (conselUnit.cat === 'infantry' && !conselUnit.skills.includes('clone') && !conselUnit.skills.includes('dog') && conselUnit.name != 'Citoyens' && conselUnit.name != 'Criminels') {
                        newBat.tags.push('survivor');
                    }
                }
                if (conselUnit.skills.includes('prodres') || conselUnit.skills.includes('geo') || conselUnit.skills.includes('solar') || conselUnit.skills.includes('cram') || conselUnit.skills.includes('dogprod') || conselUnit.skills.includes('transcrap') || conselUnit.skills.includes('cryogen')) {
                    newBat.tags.push('prodres');
                }
                bataillons.push(newBat);
                if (newBat.type === 'Chercheurs' && playerInfos.onShip) {
                    playerInfos.sci++;
                }
                if (conselInto) {
                    loadBat(newBat.id,constuctorBatId);
                } else {
                    if (show) {
                        showBataillon(newBat);
                    }
                }
                // console.log(bataillons);
            } else {
                aliens.push(newBat);
                // console.log(aliens);
                showAlien(newBat);
            }
            if (conselUnit.cat === 'buildings') {
                delete tile.infra;
            } else if (conselUnit.cat === 'devices' && tile.infra === 'Débris') {
                delete tile.infra;
            }
        } else {
            let apCost = prefabCost(selectedBatType,conselUnit,true);
            selectedBat.apLeft = selectedBat.apLeft+apCost;
            selectedBatArrayUpdate();
            warning('Construction annulée:','Vous n\'avez pas les ressources nécessaires.'+costStatus.string);
            // console.log('not enough resources !');
        }
    } else {
        // console.log('no conselUnit !');
    }
    if (conselTriche) {
        conselReset(false);
    } else {
        conselReset(true);
        commandes();
    }
    if (playerInfos.onShip && !inSoute) {
        souteFilter = 'all';
    }
};

function checkXPBonus(myBatType) {
    let batNewXP = 0;
    if (myBatType.skills.includes('clone')) {
        if (playerInfos.comp.med === 1) {
            batNewXP = batNewXP+levelXP[1];
        }
        if (playerInfos.comp.med === 2) {
            batNewXP = batNewXP+Math.ceil(levelXP[2]*3/4);
        }
        if (playerInfos.comp.med === 3) {
            batNewXP = batNewXP+levelXP[2];
        }
    } else if (myBatType.skills.includes('robot')) {
        if (playerInfos.comp.ind === 1) {
            batNewXP = batNewXP+levelXP[1];
        }
        if (playerInfos.comp.ind === 2) {
            batNewXP = batNewXP+levelXP[2];
        }
        if (playerInfos.comp.ind === 3) {
            batNewXP = batNewXP+levelXP[3];
        }
    } else if (myBatType.cat === 'buildings' || myBatType.cat === 'devices' || myBatType.kind === 'zero-defense' || myBatType.skills.includes('garde') || myBatType.skills.includes('cage')) {
        if (!myBatType.skills.includes('dog')) {
            if (playerInfos.comp.def === 2) {
                batNewXP = batNewXP+levelXP[1];
            }
            if (playerInfos.comp.def === 3) {
                batNewXP = batNewXP+levelXP[2];
            }
        }
    } else if (myBatType.kind === 'zero-extraction') {
        if (playerInfos.comp.ext === 1) {
            batNewXP = batNewXP+levelXP[1];
        }
        if (playerInfos.comp.ext === 2) {
            batNewXP = batNewXP+Math.ceil(levelXP[2]/2);
        }
        if (playerInfos.comp.ext === 3) {
            batNewXP = batNewXP+Math.ceil(levelXP[2]);
        }
    } else {
        if (playerInfos.comp.train === 1) {
            batNewXP = batNewXP+levelXP[1];
        }
        if (playerInfos.comp.train === 2) {
            batNewXP = batNewXP+Math.ceil(levelXP[2]*2/3);
        }
        if (playerInfos.comp.train === 3) {
            batNewXP = batNewXP+Math.ceil(levelXP[3]/2);
        }
    }
    return batNewXP;
};

function conOut(changeMode) {
    if (myCompPoints <= 0) {
        $('#conUnitList').empty();
        $('#conAmmoList').empty();
        $('#conUnitList').css("height","300px");
        conselReset(changeMode);
        showResOpen = false;
        modePlan = false;
        $("#conUnitList").css("display","none");
        $("#conAmmoList").css("display","none");
        if (Object.keys(selectedBat).length >= 1) {
            showBatInfos(selectedBat);
        }
    }
};

function conOutToBat(changeMode,batId) {
    console.log('conOutToBat ====================================================');
    $('#conUnitList').empty();
    $('#conAmmoList').empty();
    $('#conUnitList').css("height","300px");
    conselReset(changeMode);
    showResOpen = false;
    $("#conUnitList").css("display","none");
    $("#conAmmoList").css("display","none");
    let newSelBat = getBatById(batId);
    batSelect(newSelBat);
    // console.log(newSelBat);
    // console.log(selectedBat);
    if (Object.keys(selectedBat).length >= 1) {
        showBatInfos(selectedBat);
    }
};

function conselReset(changeMode) {
    conselUnit = {};
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    // conselCat = '';
    conselUpgrade = '';
    conselInto = false;
    conselTriche = false;
    conselPut = false;
    conselCosts = {};
    if (changeMode) {
        selectMode();
    }
}

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
    batDeath(bat,false,false,false,false);
    let batIndex = batList.findIndex((obj => obj.id == batId));
    batList.splice(batIndex,1);
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    $('#b'+bat.tileId).append(resHere);
};

function putRuinsOfDestroyedBld(name,tileId) {
    if (!playerInfos.onShip) {
        let tile = getTileById(tileId);
        if (!tile.ruins) {
            tile.ruins = true;
            tile.sh = -1;
            tile.rd = true;
            let ruinType = {};
            ruinType.name = name;
            ruinType.checks = ['any','any'];
            ruinType.scrap = 300;
            tile.rt = ruinType;
            addScrapToRuins(tile);
        }
    }
};

function checkDismantle(myBat,myBatType) {
    let okDis = true;
    if (myBatType.skills.includes('nodelete')) {
        okDis = false;
    } else if (myBat.tags.includes('nomove')) {
        okDis = false;
    } else if (myBat.tags.includes('nopilots')) {
        okDis = false;
        bataillons.forEach(function(bat) {
            if (!bat.tags.includes('nopilots') && !bat.tags.includes('nomove')) {
                let distance = calcDistance(myBat.tileId,bat.tileId);
                if (distance <= 1) {
                    okDis = true;
                }
            }
        });
    }
    return okDis;
};

function dismantle(batId,fuite) {
    // saveGame();
    selectMode();
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    if (!batType.skills.includes('nodelete')) {
        // récup de ressources !!!!!!
        let isCharged = checkCharged(bat,'trans');
        let isLoaded = checkCharged(bat,'load');
        // let resFret = checkResLoad(bat);
        if (!isCharged && !isLoaded) {
            // removeNoMoves(bat);
            let nearby = nearbyAliens(bat);
            let squadsLost = batType.squads-bat.squadsLeft-1;
            if (squadsLost < 0) {squadsLost = 0;}
            let perdition = (squadsLost/batType.squads*6)+2;
            if (zone[0].edited) {
                perdition = perdition+2;
            }
            if (nearby.twoTiles) {
                perdition = perdition+2;
            }
            let tileId = bat.tileId;
            if (batType.cat === 'buildings') {
                putRuinsOfDestroyedBld(batType.name,bat.tileId);
                if (!fuite) {
                    recupRes(bat,batType);
                }
            } else if (batType.skills.includes('recupres')) {
                if (!fuite) {
                    recupRes(bat,batType);
                }
            }
            if (batType.skills.includes('recupcorps')) {
                recupBodies(bat,batType);
            }
            let crew = batType.squads*batType.squadSize*batType.crew;
            if (bat.tags.includes('noprefab')) {
                crew = Math.ceil(crew/2);
            }
            if (bat.tags.includes('nopilots')) {
                crew = 0;
            }
            let xp = getXp(bat);
            batUnselect();
            batDeath(bat,false,false,false,false);
            let batIndex = batList.findIndex((obj => obj.id == batId));
            batList.splice(batIndex,1);
            $('#b'+bat.tileId).empty();
            let resHere = showRes(bat.tileId);
            $('#b'+bat.tileId).append(resHere);
            if (batType.skills.includes('recupcit') && crew >= 1) {
                if (batType.name === 'Technobass') {
                    recupKrimulos(220,tileId,crew,xp,bat.ammo2,bat.eq);
                } else if (batType.name === 'Juggernauts') {
                    recupRaiders(219,tileId,crew,xp,bat.ammo,bat.eq);
                } else if (batType.name === 'Trébuchets') {
                    recupPiquiers(143,tileId,crew,xp,bat.ammo,bat.eq);
                } else if (batType.name === 'Retranchement') {
                    recupRebelles(302,tileId,crew,xp,bat.ammo,bat.eq);
                } else if (batType.name === 'Scroungers') {
                    recupAmazones(14,tileId,crew,xp,bat.ammo,bat.eq);
                } else {
                    if (batType.skills.includes('nocrime')) {
                        recupCitoyens(126,tileId,crew,fuite);
                    } else if (batType.skills.includes('brigands')) {
                        recupCitoyens(225,tileId,crew,fuite);
                    } else if (bat.tags.includes('outsider')) {
                        if (rand.rand(1,perdition) === 1) {
                            recupCitoyens(225,tileId,crew,fuite);
                        } else {
                            recupCitoyens(126,tileId,crew,fuite);
                        }
                    } else if (batType.cat === 'vehicles') {
                        if (rand.rand(1,perdition+3) === 1) {
                            recupCitoyens(225,tileId,crew,fuite);
                        } else {
                            recupCitoyens(126,tileId,crew,fuite);
                        }
                    } else {
                        recupCitoyens(126,tileId,crew,fuite);
                    }
                }
            }
        } else {
            alert("Vous devez vider le bataillon avant de le démanteler.");
        }
    } else {
        alert("Vous ne pouvez pas démanteler ce bâtiment.");
    }
    if (inSoute) {
        goSoute();
    }
};

function recupPiquiers(unitId,tileId,citoyens,xp,ammo,equip) {
    if (equip != 'theeye') {
        equip = 'xxx';
    }
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'fleche-tungsten','acier',equip];
    conselTriche = true;
    let typeId = conselUnit.id;
    putBat(tileId,0,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
    }
};

function recupRebelles(unitId,tileId,citoyens,xp,ammo,equip) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,ammo,'scrap',equip];
    conselTriche = true;
    let typeId = conselUnit.id;
    putBat(tileId,0,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
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
    putBat(tileId,0,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
    }
    let dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    putBat(dropTile,0,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,dropTile);
        loadBat(citBat.id,souteId);
    }
    dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    putBat(dropTile,0,xp);
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
    putBat(tileId,0,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
    }
    let dropTile = checkDrop(tileId);
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = [ammo,'xxx','scrap',equip];
    conselTriche = true;
    putBat(dropTile,0,xp);
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
    conselAmmos = [ammo,ammo,'kevlar',equip];
    conselTriche = true;
    let typeId = conselUnit.id;
    putBat(tileId,0,xp);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
    }
    let dropTile = checkDrop(tileId);
    if (dropTile >= 0) {
        conselUnit = unitTypes[unitIndex];
        conselPut = false;
        conselAmmos = [ammo,ammo,'kevlar',equip];
        conselTriche = true;
        putBat(dropTile,0,xp);
        if (playerInfos.onShip) {
            let citBat = getBatByTypeIdAndTileId(typeId,dropTile);
            loadBat(citBat.id,souteId);
        }
        dropTile = checkDrop(tileId);
        if (dropTile >= 0) {
            conselUnit = unitTypes[unitIndex];
            conselPut = false;
            conselAmmos = [ammo,ammo,'kevlar',equip];
            conselTriche = true;
            putBat(dropTile,0,xp);
            if (playerInfos.onShip) {
                let citBat = getBatByTypeIdAndTileId(typeId,dropTile);
                loadBat(citBat.id,souteId);
            }
        }
    }
};

function recupCitoyens(unitId,tileId,citoyens,fuite) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselTriche = true;
    let typeId = conselUnit.id;
    putBat(tileId,citoyens,0,'',true,fuite);
    if (playerInfos.onShip) {
        let citBat = getBatByTypeIdAndTileId(typeId,tileId);
        loadBat(citBat.id,souteId);
    }
};

function getRecup(costs,equip) {
    // récup de n'importe quels coûts
    let recup = {};
    let recupFactor = 95;
    let bldFactor = 0;
    if (playerInfos.bldList.includes('Décharge')) {
        bldFactor = bldFactor+1;
    }
    if (hasScraptruck || playerInfos.onShip) {
        bldFactor = bldFactor+1;
    }
    if (equip) {
        bldFactor = bldFactor+1.5;
    }
    recupFactor = Math.round(recupFactor*(bldFactor+(playerInfos.comp.tri*1.25)+0.5)/9);
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

function checkOkKill(batType) {
    let okKill = false;
    if (playerInfos.gang === 'brasier') {
        if (batType.name === 'Criminels' || batType.skills.includes('brigands')) {
            okKill = true;
        }
    } else if (playerInfos.gang === 'drogmulojs') {
        okKill = true;
    } else if (batType.skills.includes('dog')) {
        okKill = true;
    }
    return okKill;
}

function recupBodies(bat,batType) {
    let coffre = {};
    if (!batType.skills.includes('dog')) {
        if (playerInfos.onShip) {
            coffre = getBatById(souteId);
        } else {
            coffreTileId = -1;
            conselTriche = true;
            putBatAround(bat.tileId,false,'near',239,0);
            coffre = getZoneBatByTileId(coffreTileId);
        }
    }
    let numBodies = 0;
    if (batType.name === 'Citoyens' || batType.name === 'Criminels') {
        numBodies = bat.citoyens;
    } else {
        numBodies = batType.crew*batType.squads*batType.squadSize*batType.size/3;
    }
    if (batType.skills.includes('dog')) {
        numBodies = calcRecupGibier(batType);
        resAdd('Gibier',numBodies);
    } else {
        numBodies = Math.ceil(numBodies);
        if (coffre.transRes['Corps'] === undefined) {
            coffre.transRes['Corps'] = numBodies;
        } else {
            coffre.transRes['Corps'] = coffre.transRes['Corps']+numBodies;
        }
    }
    coffreTileId = -1;
};

function recupRes(bat,batType) {
    let coffre = {};
    let lander = {};
    let fullNearLander = false;
    if (batType.skills.includes('recupfull')) {
        let landerId = getBiggestLander();
        lander = getBatById(landerId);
        let distance = calcDistance(bat.tileId,lander.tileId);
        if (distance <= 16) {
            fullNearLander = true;
        }
    }
    if (playerInfos.onShip) {
        coffre = getBatById(souteId);
    } else if (fullNearLander) {
        coffre = lander;
    } else {
        coffreTileId = -1;
        conselTriche = true;
        putBatAround(bat.tileId,false,'near',239,0);
        coffre = getZoneBatByTileId(coffreTileId);
    }
    if (Object.keys(coffre).length >= 1) {
        if (batType.cat === 'buildings' || batType.skills.includes('recupres')) {
            let resRecup = getResRecup(bat,batType);
            if (resRecup != undefined) {
                Object.entries(resRecup).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (value >= 1) {
                        let res = getResByName(key);
                        if (res.cat === 'alien') {
                            if (playerInfos.alienRes[key] === undefined) {
                                playerInfos.alienRes[key] = value;
                            } else {
                                playerInfos.alienRes[key] = playerInfos.alienRes[key]+value;
                            }
                        } else {
                            if (coffre.transRes[key] === undefined) {
                                coffre.transRes[key] = value;
                            } else {
                                coffre.transRes[key] = coffre.transRes[key]+value;
                            }
                        }
                    }
                });
            }
        }
        let resFret = checkResLoad(bat);
        if (resFret >= 1) {
            putFretInChest(bat,batType,coffre);
        }
    }
    coffreTileId = -1;
};

function calcRecupGibier(batType) {
    let recupGibier = Math.ceil(batType.crew*batType.squads*batType.squadSize*batType.size/1.5);
    if (batType.name === 'Klogs' || batType.name === 'Mongrels') {
        recupGibier = 240;
    } else if (batType.name === 'Wardogs') {
        recupGibier = 120;
    } else if (batType.name === 'Pets') {
        recupGibier = 440;
    }
    return recupGibier;
};

function getResRecup(bat,batType) {
    let resRecup = {};
    if (batType.skills.includes('recupcorps')) {
        if (batType.name === 'Citoyens' || batType.name === 'Criminels') {
            resRecup['Corps'] = bat.citoyens;
        } else {
            if (batType.skills.includes('dog')) {
                resRecup['Gibier'] = calcRecupGibier(batType);
            } else {
                resRecup['Corps'] = Math.ceil(batType.crew*batType.squads*batType.squadSize*batType.size/3);
            }
        }
    }
    if (batType.cat === 'buildings' || batType.skills.includes('recupres')) {
        let recupFactor = 90;
        let bldFactor = 0;
        let index;
        let batArmor;
        let batEquip;
        // SPINS
        let spinCost = 0;
        if (batType.spinNum != undefined) {
            if (batType.spinNum >= 1) {
                spinCost = batType.spinNum;
                if (batType.skills.includes('rescue')) {
                    spinCost = Math.round(spinCost/4);
                }
            }
        }
        if (playerInfos.bldList.includes('Décharge') || spinCost >= 1) {
            bldFactor = bldFactor+1;
        }
        if (playerInfos.comp.tri >= 1) {
            bldFactor = bldFactor+1;
        }
        if (hasScraptruck || playerInfos.onShip || spinCost >= 1) {
            bldFactor = bldFactor+1;
        }
        recupFactor = Math.round(recupFactor*(bldFactor+playerInfos.comp.tri+1)/8);
        if (batType.skills.includes('recupfull')) {
            recupFactor = 100;
        } else if (batType.skills.includes('recupbig')) {
            recupFactor = recupFactor+20;
            recupFactor = entre(recupFactor,75,100);
        } else {
            recupFactor = entre(recupFactor,10,100);
        }
        if (bat.squadsLeft < batType.squads-1) {
            recupFactor = Math.round(recupFactor*bat.squadsLeft/(batType.squads-1));
        }
        // console.log('hasScraptruck='+hasScraptruck);
        let totalRes = 0;
        // BAT FLATCOST x%
        if (batType.costs != undefined) {
            Object.entries(batType.costs).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (playerInfos.comp.const >= 1 && key === 'Compo1') {
                    value = Math.floor(value*9/6);
                }
                if (playerInfos.comp.const >= 2 && key === 'Compo2') {
                    value = Math.floor(value*9/6);
                }
                if (playerInfos.comp.const >= 3 && key === 'Compo3') {
                    value = Math.floor(value*9/6);
                }
                if (key.includes('Energ')) {
                    value = Math.ceil(value/7*playerInfos.comp.energ);
                } else if (key === 'Electros' || key === 'Batteries') {
                    value = Math.ceil(value/8*(playerInfos.comp.det+1));
                } else if (key === 'Spins') {
                    if (spinCost > 0) {
                        if (batType.skills.includes('transorbital')) {
                            value = Math.ceil(spinCost/spinsLanderRecup*(recupFactor+25)*(playerInfos.comp.vsp+15)/17);
                        } else {
                            value = Math.floor(spinCost/spinsBldRecup*playerInfos.comp.det);
                        }
                    } else {
                        value = Math.floor(value/spinsBldRecup*playerInfos.comp.det);
                    }
                } else {
                    value = Math.ceil(value/100*recupFactor);
                }
                if (value >= 1) {
                    if (resRecup[key] === undefined) {
                        resRecup[key] = value;
                    } else {
                        resRecup[key] = resRecup[key]+value;
                    }
                    if (!key.includes('Energ')) {
                        totalRes = totalRes+value;
                    }
                }
            });
        }
        // BAT DEPLOY x/2%
        if (batType.deploy != undefined) {
            Object.entries(batType.deploy).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (key.includes('Energ')) {
                    value = Math.ceil(value/7*playerInfos.comp.energ);
                } else if (key === 'Electros' || key === 'Batteries') {
                    value = Math.ceil(value/8*(playerInfos.comp.det+1));
                } else if (key === 'Spins') {
                    value = Math.floor(value/spinsBldRecup*playerInfos.comp.det);
                } else {
                    value = Math.floor(value/100*recupFactor/2);
                }
                if (value >= 1) {
                    if (resRecup[key] === undefined) {
                        resRecup[key] = value;
                    } else {
                        resRecup[key] = resRecup[key]+value;
                    }
                    if (!key.includes('Energ')) {
                        totalRes = totalRes+value;
                    }
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
                    if (key.includes('Energ')) {
                        value = Math.ceil(value/7*playerInfos.comp.energ);
                    } else if (key === 'Electros' || key === 'Batteries') {
                        value = Math.ceil(value/8*(playerInfos.comp.det+1));
                    } else if (key === 'Spins') {
                        value = Math.floor(value/spinsBldRecup*playerInfos.comp.det);
                    } else {
                        value = Math.floor(value/100*recupFactor);
                    }
                    if (value >= 1) {
                        if (resRecup[key] === undefined) {
                            resRecup[key] = value;
                        } else {
                            resRecup[key] = resRecup[key]+value;
                        }
                        if (!key.includes('Energ')) {
                            totalRes = totalRes+value;
                        }
                    }
                });
            }
        }
        // EQUIP x%
        if (!bat.eq.includes('aucun') && bat.eq != undefined) {
            batEquip = getBatEquip(bat);
            if (batEquip.costs != undefined) {
                Object.entries(batEquip.costs).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (key.includes('Energ')) {
                        value = Math.ceil(value/7*playerInfos.comp.energ);
                    } else if (key === 'Electros' || key === 'Batteries') {
                        value = Math.ceil(value/8*(playerInfos.comp.det+1));
                    } else if (key === 'Spins') {
                        value = Math.floor(value/spinsBldRecup*playerInfos.comp.det);
                    } else {
                        value = Math.floor(value/100*recupFactor);
                    }
                    if (value >= 1) {
                        if (resRecup[key] === undefined) {
                            resRecup[key] = value;
                        } else {
                            resRecup[key] = resRecup[key]+value;
                        }
                        if (!key.includes('Energ')) {
                            totalRes = totalRes+value;
                        }
                    }
                });
            }
        }
        let scrapBonus = Math.floor(totalRes/10);
        if (batType.skills.includes('recupfull')) {
            scrapBonus = 0;
        }
        if (scrapBonus >= 1) {
            if (resRecup['Scrap'] === undefined) {
                resRecup['Scrap'] = scrapBonus;
            } else {
                resRecup['Scrap'] = resRecup['Scrap']+scrapBonus;
            }
        }
    }
    return resRecup;
}

function recupInfraRes(tile,infra) {
    coffreTileId = -1;
    conselTriche = true;
    putBatAround(tile.id,false,'near',239,0);
    let coffre = getZoneBatByTileId(coffreTileId);
    let recupFactor = 47;
    let bldFactor = 0;
    let index;
    if (playerInfos.bldList.includes('Décharge')) {
        bldFactor = bldFactor+1;
    }
    if (hasScraptruck) {
        bldFactor = bldFactor+1;
    }
    recupFactor = Math.round(recupFactor*(bldFactor+playerInfos.comp.tri+playerInfos.comp.const)/9);
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
    if (infra.name != 'Terriers') {
        recupInfraRes(tile,infra);
    }
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    tagDelete(selectedBat,'guet');
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    tile.infra = 'Débris';
    constructSound();
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
    batDeath(bat,false,false,false,false);
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    $('#b'+bat.tileId).append(resHere);
};

function getRoadCosts(tile) {
    let roadCosts = {};
    if (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain === 'L') {
        roadCosts['Compo1'] = 150;
        if (playerInfos.comp.const >= 1) {
            roadCosts['Compo1'] = 75;
        }
        roadCosts['Compo2'] = 50;
        if (playerInfos.comp.const >= 2) {
            roadCosts['Compo2'] = 25;
        }
    } else if (tile.terrain === 'M' || tile.terrain === 'S' || tile.terrain === 'H') {
        roadCosts['Compo1'] = 20;
        if (playerInfos.comp.const >= 1) {
            roadCosts['Compo1'] = 10;
        }
    } else {
        roadCosts['Compo1'] = 8;
        if (playerInfos.comp.const >= 1) {
            roadCosts['Compo1'] = 4;
        }
    }
    return roadCosts;
};

function toggleAutoRoad(apCost,stop) {
    if (stop) {
        tagDelete(selectedBat,'autoroad');
    } else {
        if (!selectedBat.tags.includes('autoroad')) {
            selectedBat.tags.push('autoroad');
        }
        let tile = getTile(selectedBat);
        if (!tile.rd && selectedBat.apLeft >= 1) {
            putRoad(apCost);
        }
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,false);
};

function autoRoad(tile) {
    let nearby = nearbyAliens(selectedBat);
    if (nearby.oneTile) {
        if (selectedBat.tags.includes('autoroad')) {
            tagDelete(selectedBat,'autoroad');
        }
    }
    if (selectedBat.tags.includes('autoroad')) {
        let isBatHere = isOccupiedByFriend(tile.id);
        if (!tile.rd && !isBatHere) {
            let terrain = getTerrain(selectedBat);
            let apCost = getRoadAPCost(selectedBat,selectedBatType,tile,false);
            if (tile.infra != undefined && tile.infra != 'Débris') {
                apCost = Math.round(apCost/2);
            } else {
                apCost = Math.round(apCost);
            }
            let roadCosts = getRoadCosts(tile);
            let roadCostsOK = checkCost(roadCosts);
            if (roadCostsOK) {
                selectedBat.apLeft = selectedBat.apLeft-apCost;
                selectedBat.xp = selectedBat.xp+(terrain.roadBuild/30);
                payCost(roadCosts);
                doneAction(selectedBat);
                camoOut();
                tile.rd = true;
                if (tile.terrain === 'W' || tile.terrain === 'L' || tile.terrain === 'R') {
                    constructSound();
                } else {
                    roadSound();
                }
                if (tile.qs != undefined) {
                    delete tile.qs;
                }
            } else if (selectedBat.tags.includes('autoroad')) {
                tagDelete(selectedBat,'autoroad');
            }
        }
    }
};

function autoRoadNextTurn(tile,bat,batType) {
    if (!tile.rd && bat.tags.includes('autoroad')) {
        let terrain = getTerrain(bat);
        let apCost = getRoadAPCost(bat,batType,tile,false);
        if (tile.infra != undefined && tile.infra != 'Débris') {
            apCost = Math.round(apCost/2);
        } else {
            apCost = Math.round(apCost);
        }
        let roadCosts = getRoadCosts(tile);
        let roadCostsOK = checkCost(roadCosts);
        if (roadCostsOK) {
            bat.apLeft = bat.apLeft-apCost;
            bat.xp = bat.xp+(terrain.roadBuild/30);
            payCost(roadCosts);
            tile.rd = true;
            if (tile.qs != undefined) {
                delete tile.qs;
            }
        } else {
            tagDelete(bat,'autoroad');
        }
    }
};

function constructSound() {
    if (selectedBatType.cat === 'infantry') {
        playSound('construct-sap',-0.1);
    } else {
        playSound('construct-push',-0.1);
    }
};

function roadSound() {
    if (selectedBatType.skills.includes('worker')) {
        playSound('road-push',-0.1,false);
    } else {
        playSound('road-sap',-0.1,false);
    }
};

function getRoadAPCost(bat,batType,tile,round) {
    let terrain = getTerrainById(tile.id);
    let baseMecaRoad = batType.mecanoCost;
    if (batType.skills.includes('fastrd')) {
        if (baseMecaRoad >= 4) {
            baseMecaRoad = 3.8;
        } else {
            baseMecaRoad = baseMecaRoad-0.2;
        }
    }
    let roadComp = playerInfos.comp.trans;
    let constComp = playerInfos.comp.const-1;
    if (playerInfos.comp.const === 3) {
        constComp = 3;
    }
    if (constComp > playerInfos.comp.trans) {
        roadComp = constComp;
    }
    if (terrain.name === 'R' || terrain.name === 'L' || terrain.name === 'W') {
        roadComp = playerInfos.comp.const;
    }
    let apCost = baseMecaRoad*terrain.roadBuild*roadAPCost/40/(roadComp+3)*3;
    if (hasEquip(bat,['e-road'])) {
        if (batType.skills.includes('routes')) {
            apCost = apCost/1.75;
        } else if (batType.mecanoCost < 12) {
            apCost = 12*terrain.roadBuild*roadAPCost/40/(roadComp+3)*3;
        }
    }
    if (round) {
        apCost = Math.round(apCost);
    }
    return apCost;
};

function putRoad(apCost,quiet) {
    // console.log('PUTROAD');
    let tile = getTile(selectedBat);
    let terrain = getTileTerrain(selectedBat.tileId);
    if (tile.infra != undefined && tile.infra != 'Débris') {
        apCost = Math.ceil(apCost/1.5);
    }
    // console.log('apCost:'+apCost);
    if (selectedBatType.crew === 0) {
        let workForceId = checkNearWorkforce(selectedBat);
        if (workForceId >= 0) {
            let workForceBat = getBatById(workForceId);
            workForceBat.apLeft = workForceBat.apLeft-apCost;
        }
    } else {
        selectedBat.apLeft = selectedBat.apLeft-apCost;
        selectedBat.xp = selectedBat.xp+(terrain.roadBuild/30);
    }
    let roadCosts = getRoadCosts(tile);
    payCost(roadCosts);
    tagDelete(selectedBat,'guet');
    doneAction(selectedBat);
    camoOut();
    if (selectedBatType.skills.includes('infrahelp') || selectedBatType.skills.includes('roadhelp') || hasEquip(selectedBat,['e-infra'])) {
        selectedBat.apLeft = selectedBat.apLeft-apCost;
        putRoadsAround();
    } else {
        tile.rd = true;
        if (!quiet) {
            if (tile.terrain === 'W' || tile.terrain === 'L' || tile.terrain === 'R') {
                constructSound();
            } else {
                roadSound();
            }
        }
        if (tile.qs != undefined) {
            delete tile.qs;
        }
    }
    selectedBatArrayUpdate();
    moveMode();
    showMap(zone,false);
    showBatInfos(selectedBat);
};

function putRoadsAround() {
    roadSound();
    zone.forEach(function(tile) {
        let distance = calcDistance(selectedBat.tileId,tile.id);
        if (distance <= 1) {
            if ((tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') || tile.id === selectedBat.tileId) {
                tile.rd = true;
                if (tile.qs != undefined) {
                    delete tile.qs;
                }
            }
        }
    });
};

function checkRoadsAround(bat) {
    let roadsOK = true;
    zone.forEach(function(tile) {
        let distance = calcDistance(bat.tileId,tile.id);
        if (distance <= 1 && tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L' && !tile.rd) {
            roadsOK = false;
        }
    });
    return roadsOK;
}

function putInfra(infraName) {
    // console.log('INFRASTRUCTURE');
    let tile = getTile(selectedBat);
    let terrain = getTileTerrain(selectedBat.tileId);
    let infra = getInfraByName(infraName);
    // infra.fabTime = AP for Workships
    let mecanoSkill = 30;
    if (selectedBatType.skills.includes('constructeur')) {
        mecanoSkill = selectedBatType.mecanoCost;
    } else {
        mecanoSkill = 30-Math.round(((selectedBatType.squads*selectedBatType.squadSize*selectedBatType.crew)+40)/5);
        if (mecanoSkill < 11) {
            mecanoSkill = 11;
        }
    }
    let apCost = Math.round(Math.sqrt(mecanoSkill)*infra.fabTime/1.7/(playerInfos.comp.const+3)*3);
    if (selectedBatType.skills.includes('infast')) {
        apCost = Math.ceil(apCost/3);
    }
    // console.log('apCost:'+apCost);
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    selectedBat.xp = selectedBat.xp+0.4;
    // if (!selectedBat.tags.includes('construction')) {
    //     selectedBat.tags.push('construction');
    // }
    payCost(infra.costs);
    tagDelete(selectedBat,'guet');
    doneAction(selectedBat);
    camoOut();
    selectedBatArrayUpdate();
    tile.infra = infraName;
    constructSound();
    // tile.ruins = false;
    // saveMap();
    showMap(zone,false);
    showBatInfos(selectedBat);
};

function updateBldList() {
    playerInfos.bldList = [];
    if (playerInfos.onShip) {
        playerInfos.bldVM = [];
    }
    hasScraptruck = false;
    playerInfos.sci = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || playerInfos.onShip) {
            batType = getBatType(bat);
            if (batType.name === 'Scraptrucks') {
                hasScraptruck = true;
            }
            if (bat.type === 'Chercheurs') {
                playerInfos.sci++;
            }
            if (bat.type === 'Sonde' || bat.type === 'Impacteur') {
                if (!playerInfos.bldList.includes(batType.name)) {
                    playerInfos.bldList.push(batType.name);
                }
                if (playerInfos.onShip) {
                    if (!playerInfos.bldVM.includes(batType.name)) {
                        playerInfos.bldVM.push(batType.name);
                    }
                }
            }
            if (batType.cat === 'buildings' && !batType.skills.includes('nolist') && !bat.tags.includes('construction')) {
                if (!playerInfos.bldList.includes(batType.name)) {
                    playerInfos.bldList.push(batType.name);
                }
                if (playerInfos.onShip) {
                    if (!playerInfos.bldVM.includes(batType.name)) {
                        playerInfos.bldVM.push(batType.name);
                    }
                }
            }
            if (batType.bldEquiv.length >= 1) {
                batType.bldEquiv.forEach(function(bldName) {
                    if (!playerInfos.bldList.includes(bldName)) {
                        playerInfos.bldList.push(bldName);
                    }
                    if (playerInfos.onShip) {
                        if (!playerInfos.bldVM.includes(bldName)) {
                            playerInfos.bldVM.push(bldName);
                        }
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

function checkPiloneDistance(unit,triche) {
    let pDistOK = true;
    if (!triche) {
        let tileId = selectedBat.tileId;
        if (unit.name === 'Pilône' || unit.name === 'Dôme') {
            bataillons.forEach(function(bat) {
                if (bat.loc === "zone") {
                    if (bat.type === 'Pilône') {
                        let distance = calcDistance(bat.tileId,tileId);
                        if (distance < 25) {
                            pDistOK = false;
                        }
                    }
                }
            });
        }
    }
    return pDistOK;
};

function checkPiloneNumber(unit,triche) {
    let pNumOK = true;
    if (unit.name === 'Dôme') {
        let pNum = 0;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                if (bat.type === 'Pilône' && bat.apLeft >= 1) {
                    pNum++;
                }
            }
        });
        if (pNum < 4) {
            pNumOK = false;
        }
    }
    return pNumOK;
};
