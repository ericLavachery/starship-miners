function landerFill() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or">REMPLIR LE LANDER</span><br>');
    findLanders();
    let lastKind = '';
    let showkind = '';
    let showPrep = '';
    let bldNeed = [];
    let prodOK = true;
    let colour = '';
    // BATIMENTS
    let allUnitsList = unitTypes.slice();
    let sortedUnitsList = _.sortBy(_.sortBy(_.sortBy(allUnitsList,'name'),'cat'),'kind');
    sortedUnitsList.forEach(function(unit) {
        if (unit.moveCost === 99 && unit.kind != 'zero-vaisseaux' && unit.kind != 'zero-vm' && unit.name != 'Coffres' && !unit.skills.includes('prefab')) {
            prodOK = true;
            if (unit.levels[playerInfos.gang] > playerInfos.gLevel) {
                prodOK = false;
            }
            if (prodOK) {
                if (lastKind != unit.kind) {
                    showkind = unit.kind.replace(/zero-/g,"");
                    $('#conUnitList').append('<br><span class="constName vert" id="kind-'+unit.kind+'">'+showkind.toUpperCase()+'</span><br>');
                }
                if (playerInfos.prepaLand[unit.name] === undefined) {
                    showPrep = '';
                } else {
                    showPrep = '('+playerInfos.prepaLand[unit.name]+')';
                }
                bldNeed = [];
                if (unit.bldCost != 'none') {
                    bldNeed[0] = unit.bldCost;
                    colour = 'jaune'
                } else {
                    bldNeed = unit.bldReq;
                    if (unit.bldReq.length >= 1) {
                        colour = 'jaune'
                    } else {
                        colour = 'gris';
                    }
                }
                $('#conUnitList').append('<span class="constName klik '+colour+'" title="'+toNiceString(bldNeed)+'" onclick="fillLanderWithUnit('+unit.id+')">'+unit.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                if (unit.equip.length >= 2) {
                    unit.equip.forEach(function(equipName) {
                        if (equipName.includes('w1-') || equipName.includes('w2-')) {
                            let equip = getEquipByName(equipName);
                            let compReqOK = checkCompReq(equip);
                            if (compReqOK) {
                                let equipCountName = unit.id+'-'+equipName;
                                if (playerInfos.prepaLand[equipCountName] === undefined) {
                                    showPrep = '';
                                } else {
                                    showPrep = '('+playerInfos.prepaLand[equipCountName]+')';
                                }
                                $('#conUnitList').append('<span class="constName klik gff" onclick="fillLanderWithEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;'+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                            }
                        }
                    });
                }
                if (unit.protection.length >= 2) {
                    unit.protection.forEach(function(equipName) {
                        if (!equipName.includes('aucun')) {
                            let equip = getEquipByName(equipName);
                            let compReqOK = checkCompReq(equip);
                            if (compReqOK) {
                                let equipCountName = unit.id+'-'+equipName;
                                if (playerInfos.prepaLand[equipCountName] === undefined) {
                                    showPrep = '';
                                } else {
                                    showPrep = '('+playerInfos.prepaLand[equipCountName]+')';
                                }
                                $('#conUnitList').append('<span class="constName klik gff" onclick="fillLanderWithEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;blindage '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                            }
                        }
                    });
                }
                lastKind = unit.kind;
            }
        }
    });
    // INFRASTRUCTURES
    $('#conUnitList').append('<br><span class="constName vert">INFRASTRUCTURES</span><br>');
    armorTypes.forEach(function(infra) {
        if (infra.fabTime != undefined) {
            prodOK = true;
            if (infra.levels[playerInfos.gang] > playerInfos.gLevel) {
                prodOK = false;
            }
            if (prodOK) {
                if (playerInfos.prepaLand[infra.name] === undefined) {
                    showPrep = '';
                } else {
                    showPrep = '('+playerInfos.prepaLand[infra.name]+')';
                }
                $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`'+infra.name+'`,false)">'+infra.name+' <span class="ciel">'+showPrep+'</span></span><br>');
            }
        }
    });
    if (playerInfos.prepaLand['Route'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+playerInfos.prepaLand['Route']+')';
    }
    $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`Route`,true)">Route <span class="ciel">'+showPrep+'</span></span><br>');
    if (playerInfos.prepaLand['Pont'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+playerInfos.prepaLand['Pont']+')';
    }
    $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`Pont`,true)">Pont <span class="ciel">'+showPrep+'</span></span><br>');
    // DROGUES
    $('#conUnitList').append('<br><span class="constName vert">DROGUES</span><br>');
    armorTypes.forEach(function(drug) {
        if (drug.cat != undefined) {
            if (drug.cat === 'drogue') {
                let drugCompOK = checkCompReq(drug);
                if (drugCompOK) {
                    if (playerInfos.prepaLand[drug.name] === undefined) {
                        showPrep = '';
                    } else {
                        showPrep = '('+playerInfos.prepaLand[drug.name]+')';
                    }
                    $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`'+drug.name+'`,false)">10 '+drug.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                }
            }
        }
    });
    // PACKS DE RESSOURCES
    $('#conUnitList').append('<br><span class="constName vert">PACKS DE RESSOURCES</span><br>');
    armorTypes.forEach(function(pack) {
        if (pack.name.includes('respack-')) {
            if (playerInfos.prepaLand[pack.name] === undefined) {
                showPrep = '';
            } else {
                showPrep = '('+playerInfos.prepaLand[pack.name]+')';
            }
            $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`'+pack.name+'`,false)">'+pack.info+' <span class="ciel">'+showPrep+'</span></span><br>');
        }
    });
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function fillLanderWithInfra(fillInfraName,road) {
    let fillInfra = {};
    if (road) {
        fillInfra = {};
        fillInfra.name = fillInfraName;
        fillInfra.costs = {};
        if (fillInfra.name === 'Pont') {
            fillInfra.costs['Scrap'] = 50;
            fillInfra.costs['Compo1'] = 150;
            if (playerInfos.comp.const >= 1) {
                fillInfra.costs['Compo1'] = 100;
            }
            fillInfra.costs['Compo2'] = 50;
            if (playerInfos.comp.const >= 2) {
                fillInfra.costs['Compo2'] = 33;
            }
        } else {
            fillInfra.costs['Compo1'] = 20;
            if (playerInfos.comp.const >= 1) {
                fillInfra.costs['Compo1'] = 14;
            }
        }
    } else {
        fillInfra = getInfraByName(fillInfraName);
    }
    console.log(fillInfra);
    let number = 1;
    if (fillInfra.cat === 'drogue') {
        number = 10;
    }
    addCost(fillInfra.costs,number);
    if (playerInfos.prepaLand[fillInfra.name] === undefined) {
        playerInfos.prepaLand[fillInfra.name] = number;
    }  else {
        playerInfos.prepaLand[fillInfra.name] = playerInfos.prepaLand[fillInfra.name]+number;
    }
    landerFill();
    console.log(playerInfos.prepaLand);
};

function fillLanderWithEquip(equipName,unitId) {
    let equip = getEquipByName(equipName);
    let unit = getBatTypeById(unitId);
    let flatCosts = getCosts(unit,equip,0,'equip');
    let deployCosts = getDeployCosts(unit,equip,0,'equip');
    addCost(flatCosts,1);
    addCost(deployCosts,1);
    let equipCountName = unitId+'-'+equip.name;
    if (playerInfos.prepaLand[equipCountName] === undefined) {
        playerInfos.prepaLand[equipCountName] = 1;
    }  else {
        playerInfos.prepaLand[equipCountName] = playerInfos.prepaLand[equipCountName]+1;
    }
    landerFill();
};

function fillLanderWithUnit(fillUnitId) {
    let fillUnit = getBatTypeById(fillUnitId);
    addCost(fillUnit.costs,1);
    addCost(fillUnit.deploy,1);
    let reqCit = fillUnit.squads*fillUnit.squadSize*fillUnit.crew;
    if (fillUnit.skills.includes('clone') || fillUnit.skills.includes('dog')) {
        reqCit = 0;
    }
    let citId = 126;
    if (fillUnit.skills.includes('brigands')) {
        citId = 225;
    }
    if (reqCit >= 1) {
        let lander = landers[0];
        let citBat = {};
        let citBatId = -1;
        bataillons.forEach(function(bat) {
            if (bat.loc === 'trans' && bat.locId === lander.id && bat.typeId === citId) {
                citBatId = bat.id;
                citBat = bat;
            }
        });
        if (citBatId >= 0) {
            citBat.citoyens = citBat.citoyens+reqCit;
        } else {
            let unitIndex = unitTypes.findIndex((obj => obj.id == citId));
            conselUnit = unitTypes[unitIndex];
            conselAmmos = ['xxx','xxx','xxx','xxx'];
            conselTriche = true;
            putBat(lander.tileId,reqCit,0,'',false);
            let citBat = getBatByTypeIdAndTileId(citId,lander.tileId);
            citBat.loc = 'trans';
            citBat.locId = lander.id;
            lander.transIds.push(citBat.id);
        }
    }
    if (playerInfos.prepaLand[fillUnit.name] === undefined) {
        playerInfos.prepaLand[fillUnit.name] = 1;
    }  else {
        playerInfos.prepaLand[fillUnit.name] = playerInfos.prepaLand[fillUnit.name]+1;
    }
    landerFill();
    // console.log(playerInfos.prepaLand);
};

function getBonusEqOld(unit) {
    // console.log("CHECK BONUS EQ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    let bonusEqName = '';
    if (unit.autoEq != undefined) {
        // console.log(unit.autoEq);
        if (unit.autoEq.length >= 1) {
            unit.autoEq.forEach(function(equipName) {
                if (bonusEqName === '') {
                    let equip = getEquipByName(equipName);
                    // console.log(equip);
                    let compReqOK = checkCompReq(equip);
                    if (checkSpecialEquip(equip,unit)) {
                        compReqOK = false;
                    }
                    // console.log('compReqOK='+compReqOK);
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
            // console.log(unit.log3eq);
            if (unit.log3eq.length >= 1) {
                unit.log3eq.forEach(function(equipName) {
                    if (bonusEqName === '') {
                        let equip = getEquipByName(equipName);
                        // console.log(equip);
                        let compReqOK = checkCompReq(equip);
                        if (checkSpecialEquip(equip,unit)) {
                            compReqOK = false;
                        }
                        // console.log('compReqOK='+compReqOK);
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

function checkFlyTarget(weapon,batType) {
    if (weapon.noFly && batType.skills.includes('fly')) {
        return false;
    } else {
        if (weapon.noGround && !batType.skills.includes('fly') && !batType.skills.includes('sauteur')) {
            return false;
        } else {
            return true;
        }
    }
};

function anyAlienInRange(myBat,weapon) {
    let tileId = myBat.tileId;
    let distance;
    let inRange = false;
    let batIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            let guidageOK = checkGuidage(weapon,bat);
            if (isInRange(myBat,bat.tileId,weapon) || guidageOK) {
                batType = getBatType(bat);
                if (weapon.ammo.includes('marquage') && weapon.name != 'Fragger' && bat.tags.includes('fluo')) {
                    // Déjà marqué
                } else {
                    if (weapon.noFly && batType.skills.includes('fly')) {
                        // Fly hors portée
                    } else {
                        if (weapon.noGround && !batType.skills.includes('fly') && !batType.skills.includes('sauteur')) {
                            // Ground hors portée
                        } else {
                            if (batType.skills.includes('invisible') || bat.tags.includes('invisible')) {
                                // Alien invisible
                                distance = calcDistance(myBat.tileId,bat.tileId)
                                if (distance === 0 || guidageOK || bat.tags.includes('fluo')) {
                                    inRange = true;
                                }
                            } else {
                                if (zone[0].dark && !undarkNow.includes(bat.tileId)) {
                                    // Alien dans l'ombre
                                } else {
                                    inRange = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return inRange;
};

start of showMap()
if (!playerInfos.onShip && playerInfos.clouds) {
    if (zone[0].dark) {
        $('#zone_map').css("filter","url(#dark) contrast(110%)");
    } else {
        $('#zone_map').css("filter","url(#fluffy) saturate(85%) contrast(140%)");
    }
} else {
    $('#zone_map').css("filter","");
}
