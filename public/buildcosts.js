function voirReserve() {
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
    if (!playerInfos.onShip) {
        $('#conUnitList').append('<span class="constName or" id="gentils">RESERVE (ZONE)</span><br>');
        $('#conUnitList').append('<span class="constName"><span class="jaune klik" onclick="voirReserve()">Zone</span> &nbsp;|&nbsp; <span class="jaune klik" onclick="voirReserveStation()">Station</span></span><br>');
    } else {
        $('#conUnitList').append('<span class="constName or" id="gentils">RESERVE</span><br>');
        if (!inSoute) {
            $('#conUnitList').append('<span class="constName"><span class="jaune klik" onclick="purgerReserve()" title="Jeter toutes les ressources qui dépassent le maximum">Purger</span></span><br>');
        }
    }
    $('#conUnitList').append('<br>');
    findLanders();
    let dispoCit = getDispoCit();
    $('#conUnitList').append('<span class="paramResName">Citoyens</span><span class="paramIcon"></span><span class="paramValue cy">'+dispoCit+'</span><br>');
    let dispoCrim = getDispoCrim();
    $('#conUnitList').append('<span class="paramResName">Criminels</span><span class="paramIcon"></span><span class="paramValue cy">'+dispoCrim+'</span><br>');
    let dispoRes;
    let minedRes;
    let resIcon;
    let sortedResTypes = _.sortBy(resTypes,'name');
    sortedResTypes.forEach(function(res) {
        dispoRes = getDispoRes(res.name);
        minedRes = getMinedRes(res.name);
        resIcon = getResIcon(res);
        let maxRes = getDefResMax(res);
        let isPerish = false;
        if (res.max != undefined) {
            isPerish = true;
        }
        if (playerInfos.maxRes[res.name] != undefined) {
            maxRes = playerInfos.maxRes[res.name];
        }
        let resCol = '';
        if (maxRes < dispoRes && (res.cat != 'alien' || res.name === 'Gibier') && playerInfos.onShip && !inSoute) {
            if (isPerish) {
                resCol = ' or';
            } else {
                resCol = ' ciel';
            }
        } else if (playerInfos.resFlags.includes(res.name)) {
            resCol = ' jaune';
        } else if (res.cat === 'alien') {
            resCol = ' gff';
        }
        if (dispoRes < 0) {
            dispoRes = 0;
        }
        if (playerInfos.onShip && (!inSoute || souteTab != 'rez')) {
            $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="cy">'+dispoRes+'</span></span><span class="paramValue klik" title="Taguer cette ressource ('+res.name+')" onclick="tagRes('+res.id+')">&CircleDot;</span>');
            if (res.cat != 'alien' && !isPerish) {
                $('#conUnitList').append('&nbsp; <span class="paramValue brunf" title="Maximum de stockage ('+res.name+')">'+maxRes+'</span> &nbsp;<span class="paramValue klik" title="Augmenter le maximum de stockage ('+res.name+')" onclick="maxResEdit('+res.id+',true)">&uHar;</span> &nbsp;<span class="paramValue klik" title="Diminuer le maximum de stockage ('+res.name+')" onclick="maxResEdit('+res.id+',false)">&dHar;</span><br>');
            } else if (res.name === 'Gibier' || isPerish) {
                $('#conUnitList').append('&nbsp; <span class="paramValue brun" title="Maximum de stockage ('+res.name+')">'+maxRes+'</span><br>');
            } else {
                $('#conUnitList').append('<br>');
            }
        } else if (playerInfos.onShip && inSoute && souteTab === 'rez' && res.cat != 'alien' && dispoRes >= 50) {
            $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="cy">'+dispoRes+'</span></span><span class="paramValue klik" title="Charger 50 '+res.name+' dans le lander" onclick="missionResSingle('+res.id+',50)">50 >>></span><br>');
        } else if (res.cat === 'alien' || minedRes <= 0) {
            $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramValue"><span class="cy">'+dispoRes+'</span></span><br>');
        } else {
            $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramValue"><span class="cy">'+dispoRes+'</span> +('+minedRes+')</span><br>');
        }
        playerInfos.reserve[res.name] = dispoRes;
    });
    $('#conUnitList').append('<br><br>');
    // $("#conUnitList").animate({scrollTop:0},"fast");
};

function voirReserveStation() {
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
    $('#conUnitList').append('<span class="constName cy" id="gentils">RESERVE (STATION)</span><br>');
    $('#conUnitList').append('<span class="constName"><span class="jaune klik" onclick="voirReserve()">Zone</span> &nbsp;|&nbsp; <span class="jaune klik" onclick="voirReserveStation()">Station</span></span><br>');
    $('#conUnitList').append('<br>');
    findLanders();
    let dispoRes;
    let minedRes;
    let resIcon;
    let sortedResTypes = _.sortBy(resTypes,'name');
    sortedResTypes.forEach(function(res) {
        dispoRes = getDispoResStation(res.name);
        minedRes = getMinedRes(res.name);
        resIcon = getResIcon(res);
        let resCol = '';
        if (playerInfos.resFlags.includes(res.name)) {
            resCol = ' jaune';
        } else if (res.cat === 'alien') {
            resCol = ' gff';
        }
        if (dispoRes < 0) {
            dispoRes = 0;
        }
        if (res.cat === 'alien' || minedRes <= 0) {
            $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramValue"><span class="cy">'+dispoRes+'</span></span><br>');
        } else {
            $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramValue"><span class="cy">'+dispoRes+'</span> +('+minedRes+')</span><br>');
        }
    });
    $('#conUnitList').append('<br><br>');
    // $("#conUnitList").animate({scrollTop:0},"fast");
};

function getDefResMax(res) {
    let theDefResMax = defMaxRes;
    if (res.max != undefined) {
        theDefResMax = res.max;
    }
    return theDefResMax;
}

function purgerReserve() {
    batUnselect();
    let soute = getBatById(souteId);
    resTypes.forEach(function(res) {
        if (res.cat != 'alien') {
            let souteRes = soute.transRes[res.name];
            let maxRes = getDefResMax(res);
            if (playerInfos.maxRes[res.name] != undefined) {
                maxRes = playerInfos.maxRes[res.name];
            }
            if (souteRes > maxRes) {
                soute.transRes[res.name] = maxRes;
            }
        }
    });
    voirReserve();
};

function autoResPurge() {
    batUnselect();
    let soute = getBatById(souteId);
    resTypes.forEach(function(res) {
        if (res.max != undefined) {
            if (res.cat != 'alien') {
                let souteRes = soute.transRes[res.name];
                if (souteRes > res.max) {
                    soute.transRes[res.name] = res.max;
                }
            } else {
                let alienRes = playerInfos.alienRes[res.name];
                if (alienRes > res.max) {
                    playerInfos.alienRes[res.name] = res.max;
                }
            }
        }
    });
};

function maxResEdit(resId,up) {
    let res = getResById(resId);
    let maxRes = getDefResMax(res);
    if (playerInfos.maxRes[res.name] != undefined) {
        maxRes = playerInfos.maxRes[res.name];
    }
    if (up) {
        maxRes = Math.ceil(maxRes*1.1);
    } else {
        maxRes = Math.floor(maxRes/1.1);
    }
    if (res.max != undefined) {
        if (maxRes > res.max) {
            maxRes = res.max;
        }
    }
    playerInfos.maxRes[res.name] = maxRes;
    voirReserve();
};

function tagRes(resId) {
    let res = getResById(resId);
    if (playerInfos.resFlags.includes(res.name)) {
        let tagIndex = playerInfos.resFlags.indexOf(res.name);
        playerInfos.resFlags.splice(tagIndex,1);
    } else {
        playerInfos.resFlags.push(res.name);
    }
    voirReserve();
};

function checkReserve() {
    findLanders();
    let dispoRes;
    resTypes.forEach(function(res) {
        dispoRes = getDispoRes(res.name);
        if (dispoRes >= 1) {
            playerInfos.reserve[res.name] = dispoRes;
        } else {
            playerInfos.reserve[res.name] = 0;
        }
    });
};

function findLanders() {
    landers = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            let batType = getBatType(bat);
            if (playerInfos.onShip) {
                if (batType.name === 'Soute') {
                    landers.push(bat);
                }
            } else {
                if (batType.skills.includes('transorbital') || batType.skills.includes('reserve')) {
                    landers.push(bat);
                }
            }
        }
    });
};

function findLandersIds() {
    let landersIds = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            batType = getBatType(bat);
            if (playerInfos.onShip) {
                if (batType.name === 'Soute') {
                    landersIds.push(bat.id);
                }
            } else {
                if (batType.skills.includes('transorbital')) {
                    landersIds.push(bat.id);
                }
            }
        }
    });
    return landersIds;
};

function findTheLander(ownOnly) {
    let theLander = {};
    let bestLander = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            if (!bat.tags.includes('nomove') || !ownOnly) {
                let batType = getBatType(bat);
                let landerScore = getLanderScore(batType);
                if (bestLander < landerScore) {
                    bestLander = landerScore;
                    theLander = bat;
                }
            }
        }
    });
    return theLander;
};

function getLanderScore(batType) {
    let landerScore = 0;
    if (batType.skills.includes('transorbital')) {
        if (batType.name === 'Soute') {
            landerScore = 1;
        } else {
            landerScore = batType.transUnits;
        }
    }
    return landerScore;
}

function checkCost(costs) {
    let enoughRes = true;
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let dispoRes = getDispoRes(key);
            if (dispoRes < value) {
                enoughRes = false;
            }
        });
    }
    return enoughRes;
};

function checkMultiCost(costs,number) {
    let enoughRes = true;
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let dispoRes = getDispoRes(key);
            if (dispoRes < value*number) {
                enoughRes = false;
            }
        });
    }
    return enoughRes;
};

function payMaxCost(costs) {
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let dispoRes = getDispoRes(key);
            if (dispoRes <= value) {
                resSub(key,dispoRes);
            } else {
                resSub(key,value);
            }
        });
    }
};

function payCost(costs) {
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            resSub(key,value);
            // console.log('pay '+value+' '+key);
        });
    }
};

function addCost(costs,number) {
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            resAdd(key,value*number);
        });
    }
};

function getEquipDeployFactor(unit,equip) {
    let deployFactor = 1;
    let crew = unit.squads*unit.squadSize*unit.crew;
    let thp = unit.squads*unit.squadSize*unit.hp;
    if (equip.cat === 'armor') {
        if (unit.cat != 'infantry' && !unit.skills.includes('robot') && !unit.skills.includes('cyber')) {
            thp = Math.round(thp*2.5);
        }
    }
    let rofpow = unit.squads*unit.weapon2.rof*unit.weapon2.power;
    if (equip.name === 'carrousel1' || equip.name === 'longtom1') {
        rofpow = unit.squads*unit.weapon.rof*unit.weapon.power;
    }
    if (equip.factor === 'one') {
        deployFactor = 1;
    } else {
        if (unit.cat === 'infantry') {
            deployFactor = crew/12;
        } else if (unit.cat === 'vehicles' && unit.skills.includes('robot')) {
            crew = unit.squads*unit.squadSize;
            deployFactor = crew/12;
        } else if (unit.cat === 'vehicles' && unit.skills.includes('cyber')) {
            deployFactor = crew/12;
        } else {
            if (equip.factor === 'crew') {
                deployFactor = crew/12;
            } else if (equip.factor === 'rofpow') {
                deployFactor = rofpow/250;
            } else if (equip.factor === 'thp') {
                if (equip.name === 'bld-camo') {
                    deployFactor = Math.round(Math.sqrt(thp)*1.6);
                } else {
                    deployFactor = thp/120;
                }
            }
        }
    }
    deployFactor = deployFactor*(100+playerInfos.crime)/100;
    return deployFactor;
};

function payDeployCosts(unit,ammoNames) {
    let deployCosts;
    let ammoIndex;
    let batAmmo;
    // Ammo W1
    let hasW1 = checkHasWeapon(1,unit,ammoNames[3]);
    if (ammoNames[0] != 'xxx' && hasW1) {
        ammoIndex = ammoTypes.findIndex((obj => obj.name == ammoNames[0]));
        batAmmo = ammoTypes[ammoIndex];
        deployCosts = getDeployCosts(unit,batAmmo,1,'ammo');
        payCost(deployCosts);
    }
    // Ammo W2
    let hasW2 = checkHasWeapon(2,unit,ammoNames[3]);
    if (ammoNames[1] != 'xxx' && hasW2) {
        ammoIndex = ammoTypes.findIndex((obj => obj.name == ammoNames[1]));
        batAmmo = ammoTypes[ammoIndex];
        deployCosts = getDeployCosts(unit,batAmmo,2,'ammo');
        payCost(deployCosts);
    }
    // Armor
    if (ammoNames[2] != 'xxx') {
        ammoIndex = armorTypes.findIndex((obj => obj.name == ammoNames[2]));
        let batArmor = armorTypes[ammoIndex];
        deployCosts = getDeployCosts(unit,batArmor,0,'equip');
        payCost(deployCosts);
    }
    // Equip
    if (ammoNames[3] != 'xxx') {
        ammoIndex = armorTypes.findIndex((obj => obj.name == ammoNames[3]));
        let batEquip = armorTypes[ammoIndex];
        deployCosts = getDeployCosts(unit,batEquip,0,'equip');
        payCost(deployCosts);
    }
    // Unit
    deployCosts = getDeployCosts(unit,batAmmo,0,'unit');
    payCost(deployCosts);
};

function payFlatCosts(unit,ammoNames) {
    // Payer le prix fixe des lames, des équipements et des armures
    let costs;
    let index;
    let batAmmo;
    // Ammo W1
    let hasW1 = checkHasWeapon(1,conselUnit,conselAmmos[3]);
    if (ammoNames[0] != 'xxx' && hasW1) {
        index = ammoTypes.findIndex((obj => obj.name == ammoNames[0]));
        batAmmo = ammoTypes[index];
        costs = getCosts(unit,batAmmo,1,'ammo');
        payCost(costs);
    }
    // Ammo W2
    let hasW2 = checkHasWeapon(2,conselUnit,conselAmmos[3]);
    if (ammoNames[1] != 'xxx' && hasW2) {
        index = ammoTypes.findIndex((obj => obj.name == ammoNames[1]));
        batAmmo = ammoTypes[index];
        costs = getCosts(unit,batAmmo,2,'ammo');
        payCost(costs);
    }
    // Armor
    if (ammoNames[2] != 'xxx') {
        index = armorTypes.findIndex((obj => obj.name == ammoNames[2]));
        let batArmor = armorTypes[index];
        costs = getCosts(unit,batArmor,0,'equip');
        payCost(costs);
    }
    // Equip
    if (ammoNames[3] != 'xxx') {
        index = armorTypes.findIndex((obj => obj.name == ammoNames[3]));
        let batEquip = armorTypes[index];
        costs = getCosts(unit,batEquip,0,'equip');
        payCost(costs);
    }
};

function getCosts(unit,ammo,weapNum,type) {
    let costs = {};
    let costFactor = 0;
    if (type === 'ammo') {
        // AMMOs
        if (weapNum === 1) {
            costFactor = Math.ceil(unit.squads*unit.squadSize*unit.weapon.power/2);
            if (unit.weapon.name.includes('Moissonneuse')) {
                costFactor = costFactor*15;
            }
            if (unit.weapon.name.includes('Boutoir') || unit.weapon.name.includes('Bélier')) {
                costFactor = Math.round(costFactor*unit.size/8);
            }
        } else {
            costFactor = Math.ceil(unit.squads*unit.squadSize*unit.weapon2.power/2);
            if (unit.weapon2.name.includes('Moissonneuse')) {
                costFactor = costFactor*15;
            }
            if (unit.weapon2.name.includes('Boutoir') || unit.weapon2.name.includes('Bélier')) {
                costFactor = Math.round(costFactor*unit.size/8);
            }
        }
        if (ammo.costs != undefined) {
            if (Object.keys(ammo.costs).length >= 1) {
                costs = JSON.parse(JSON.stringify(ammo.costs));
                Object.entries(ammo.costs).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    costs[key] = Math.ceil(value*costFactor/ammo.batch);
                });
            } else {
                costs = {};
            }
        } else {
            costs = {};
        }
    } else if (type === 'equip') {
        let equip = ammo;
        costFactor = getEquipDeployFactor(unit,equip);
        if (equip.costs != undefined) {
            if (Object.keys(equip.costs).length >= 1) {
                costs = JSON.parse(JSON.stringify(equip.costs));
                Object.entries(equip.costs).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    costs[key] = Math.ceil(value*costFactor);
                });
            } else {
                costs = {};
            }
        } else {
            costs = {};
        }
    }
    return costs;
}

function getDeployCosts(unit,ammo,weapNum,type) {
    let deployCosts = {};
    let deployFactor = 0;
    if (type === 'ammo') {
        // AMMOs
        if (weapNum === 1) {
            let pauer = unit.weapon.power;
            if (pauer < 2) {pauer = 2;}
            deployFactor = Math.ceil(unit.squads*unit.weapon.rof*pauer/5*deploySalvos);
            let weapRange = unit.weapon.range+(unit.weapon.elevation/2);
            if (unit.moveCost > 90) {
                if (weapRange < 6) {
                    deployFactor = deployFactor*(weapRange+1)/7;
                }
            }
            if (!unit.weapon.noBis) {
                if (unit.maxSalvo >= 2) {
                    if (unit.ap/unit.weapon.cost >= unit.maxSalvo) {
                        deployFactor = deployFactor*unit.maxSalvo;
                    } else {
                        deployFactor = deployFactor*(unit.maxSalvo-1);
                    }
                }
            }
            if (ammo.name.includes('lame') && (unit.weapon.aoe === 'squad' || unit.weapon.aoe === 'bat')) {
                deployFactor = deployFactor*6;
            }
        } else {
            let pauer = unit.weapon2.power;
            if (pauer < 2) {pauer = 2;}
            deployFactor = Math.ceil(unit.squads*unit.weapon2.rof*pauer/5*deploySalvos);
            let weapRange = unit.weapon2.range+(unit.weapon2.elevation/2);
            if (unit.moveCost > 90) {
                if (weapRange < 6) {
                    deployFactor = deployFactor*(weapRange+1)/7;
                }
            } else if (unit.weapon2.range < 2 && !unit.weapon.noMelee && !unit.weapon.noDef) {
                deployFactor = deployFactor/1.65;
            }
            if (!unit.weapon2.noBis) {
                if (unit.maxSalvo >= 2) {
                    if (unit.ap/unit.weapon2.cost >= unit.maxSalvo) {
                        deployFactor = deployFactor*unit.maxSalvo;
                    } else {
                        deployFactor = deployFactor*(unit.maxSalvo-1);
                    }
                }
            }
            if (ammo.name.includes('lame') && (unit.weapon2.aoe === 'squad' || unit.weapon2.aoe === 'bat')) {
                deployFactor = deployFactor*9;
            }
        }
        if (ammo.deploy != undefined) {
            if (Object.keys(ammo.deploy).length >= 1) {
                deployCosts = JSON.parse(JSON.stringify(ammo.deploy));
                let batch = ammo.batch;
                if (ammo.name.includes('lame')) {
                    batch = 100;
                }
                Object.entries(ammo.deploy).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    deployCosts[key] = Math.ceil(value*deployFactor/batch);
                });
            } else {
                deployCosts = {};
            }
        } else {
            deployCosts = {};
        }
    } else if (type === 'unit') {
        // UNIT
        if (unit.deploy != undefined) {
            deployFactor = 1;
            // deployFactor = deployFactor*deployTuning/7;
            if (Object.keys(unit.deploy).length >= 1) {
                deployCosts = JSON.parse(JSON.stringify(unit.deploy));
                Object.entries(unit.deploy).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    deployCosts[key] = Math.ceil(value*deployFactor);
                });
            } else {
                deployCosts = {};
            }
        } else {
            if (unit.skills.includes('prefab')) {
                deployFactor = getBldDeployFactor(unit);
                // deployCosts = JSON.parse(JSON.stringify(unit.costs));
                Object.entries(unit.costs).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (key != 'Spins') {
                        let adjValue = Math.floor(value*deployFactor);
                        let minValue = (playerInfos.comp.tri+1)*(playerInfos.comp.tri+1);
                        if (key === 'Electros' || key === 'Batteries') {
                            adjValue = Math.floor(adjValue/3)-3;
                        }
                        if (key === 'Energie') {
                            deployCosts[key] = Math.ceil(value/4);
                        } else if (key === 'Electros' || key === 'Batteries') {
                            if (adjValue >= 1) {
                                deployCosts[key] = adjValue;
                            }
                        } else {
                            if (unit.skills.includes('ground')) {
                                if (adjValue >= 1) {
                                    deployCosts[key] = adjValue;
                                }
                            } else {
                                if (adjValue >= minValue) {
                                    deployCosts[key] = adjValue;
                                }
                            }
                        }
                    }
                });
            } else {
                deployCosts = {};
            }
        }
    } else if (type === 'equip') {
        let equip = ammo;
        deployFactor = getEquipDeployFactor(unit,equip);
        // deployFactor = deployFactor*deployTuning/7;
        if (equip.deploy != undefined) {
            if (Object.keys(equip.deploy).length >= 1) {
                deployCosts = JSON.parse(JSON.stringify(equip.deploy));
                Object.entries(equip.deploy).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    deployCosts[key] = Math.ceil(value*deployFactor);
                });
                // console.log(equip.name);
                // console.log(deployCosts);
            } else {
                deployCosts = {};
            }
        } else {
            deployCosts = {};
        }
    }
    return deployCosts;
}

function getBldDeployFactor(unit) {
    let dfac = 1/(((playerInfos.comp.tri+4)*(playerInfos.comp.const+1)*1)+1);
    if (unit.skills.includes('ground')) {
        dfac = 1/(((playerInfos.comp.tri+6)*(playerInfos.comp.const+3)*0.112)+1);
    }
    return dfac;
};

function calcBldDeploy(unit) {
    let deployCosts = {};
    let deployFactor = getBldDeployFactor(unit);
    if (unit.skills.includes('prefab')) {
        Object.entries(unit.costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let adjValue = Math.floor(value*deployFactor);
            let minValue = (playerInfos.comp.tri+1)*(playerInfos.comp.tri+1);
            if (key === 'Electros' || key === 'Batteries') {
                adjValue = Math.floor(adjValue/3)-3;
            }
            if (key === 'Energie') {
                deployCosts[key] = Math.ceil(value/4);
            } else if (key === 'Electros' || key === 'Batteries') {
                if (adjValue >= 1) {
                    deployCosts[key] = adjValue;
                }
            } else {
                if (unit.skills.includes('ground')) {
                    if (adjValue >= 1) {
                        deployCosts[key] = adjValue;
                    }
                } else {
                    if (adjValue >= minValue) {
                        deployCosts[key] = adjValue;
                    }
                }
            }
        });
    }
    return deployCosts;
};

function mergedUnitCosts(batType) {
    let batMergedCosts = JSON.parse(JSON.stringify(batType.costs));
    if (batType.deploy != undefined) {
        mergeObjects(batMergedCosts,batType.deploy);
    }
    return batMergedCosts;
}

function checkUnitCost(batType,withDeploy) {
    let enoughRes = true;
    let batMergedCosts = JSON.parse(JSON.stringify(batType.costs));
    if (withDeploy) {
        if (batType.deploy != undefined) {
            // console.log(batType.deploy);
            mergeObjects(batMergedCosts,batType.deploy);
        }
    }
    if (batMergedCosts != undefined) {
        Object.entries(batMergedCosts).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let dispoRes = getDispoRes(key);
            if (dispoRes < value) {
                enoughRes = false;
            }
        });
    }
    let enoughCit = checkCitCost(batType);
    if (!enoughCit) {
        enoughRes = false;
    }
    return enoughRes;
};

function checkCitCost(batType) {
    let enoughCit = true;
    let reqCit = batType.squads*batType.squadSize*batType.crew;
    if (batType.skills.includes('clone') || batType.skills.includes('dog')) {
        reqCit = 0;
    }
    if (reqCit >= 1) {
        let dispoCrim = getDispoCrim();
        let dispoCit = getDispoCit();
        if (batType.skills.includes('brigands')) {
            if (reqCit > dispoCrim+dispoCit) {
                enoughCit = false;
            }
        } else {
            if (reqCit > dispoCit) {
                enoughCit = false;
            }
        }
    }
    return enoughCit;
};

function payUnitCost(batType) {
    // console.log(batType);
    if (batType.costs != undefined) {
        Object.entries(batType.costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            resSub(key,value);
        });
    }
    let reqCit = batType.squads*batType.squadSize*batType.crew;
    // console.log('reqCit='+reqCit);
    if (conselUpgrade === 'bld') {
        let oldBatType = getBatTypeByName(conselUnit.bldCost);
        let oldCit = oldBatType.squads*oldBatType.squadSize*oldBatType.crew;
        // console.log('oldCit='+oldCit);
        reqCit = reqCit-oldCit;
        // console.log('reqCit='+reqCit);
    }
    if (conselUpgrade === 'inf') {
        reqCit = 0;
    }
    if (batType.skills.includes('clone') || batType.skills.includes('dog')) {
        reqCit = 0;
    }
    // console.log('reqCit='+reqCit);
    if (reqCit >= 1) {
        let landersIds = findLandersIds();
        if (batType.skills.includes('brigands')) {
            // console.log('brigands');
            let dispoCrim = getDispoCrim();
            let restCrim;
            let dispoCit = getDispoCit();
            let restCit;
            if (reqCit > dispoCrim) {
                restCrim = 0;
                restCit = dispoCit-reqCit+dispoCrim;
            } else {
                restCrim = dispoCrim-reqCit;
                restCit = dispoCit;
            }
            // console.log('restCit='+restCit);
            // console.log('restCrim='+restCrim);
            deadBatsList = [];
            bataillons.forEach(function(bat) {
                if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Criminels') {
                    if (restCrim === 0) {
                        bat.citoyens = 0;
                        deadBatsList.push(bat.id);
                    } else {
                        bat.citoyens = restCrim;
                        bat.squadsLeft = Math.ceil(bat.citoyens/6);
                    }
                }
                if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Citoyens') {
                    if (restCit === 0) {
                        bat.citoyens = 0;
                        deadBatsList.push(bat.id);
                    } else {
                        bat.citoyens = restCit;
                        bat.squadsLeft = Math.ceil(bat.citoyens/6);
                    }
                }
            });
            if (restCit === 0 || restCrim === 0) {
                killBatList();
            }
        } else {
            let dispoCit = getDispoCit();
            let restCit = dispoCit-reqCit;
            deadBatsList = [];
            bataillons.forEach(function(bat) {
                if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Citoyens') {
                    if (restCit === 0) {
                        bat.citoyens = 0;
                        deadBatsList.push(bat.id);
                    } else {
                        bat.citoyens = restCit;
                        bat.squadsLeft = Math.ceil(bat.citoyens/6);
                    }
                }
            });
            if (restCit === 0) {
                killBatList();
            }
        }
    }
};

function allResAdd(number) {
    findLanders();
    let numRes = number;
    resTypes.forEach(function(res) {
        if (res.name != 'Magma') {
            if (playerInfos.pseudo != 'Payall') {
                if (res.name === 'Huile') {
                    numRes = Math.ceil(50*number*res.batch/3);
                } else if (res.name === 'Scrap') {
                    numRes = Math.ceil(200*number*res.batch/3);
                } else {
                    numRes = Math.ceil(res.rarity*number*res.batch/3);
                }
                if (res.cat === 'blue') {
                    numRes = Math.ceil(numRes/3);
                } else if (res.cat === 'blue-sky') {
                    numRes = Math.ceil(numRes/2);
                } else if (res.cat === 'sky') {
                    numRes = Math.ceil(numRes/3);
                }
                resAdd(res.name,numRes);
            } else {
                resAdd(res.name,5000);
            }
        }
    });
    voirReserve();
};

function resAdd(resName,number) {
    let res = getResByName(resName);
    let theLanderId = -1;
    let lander = {};
    if (res.cat === 'alien') {
        if (playerInfos.alienRes[resName] === undefined) {
            playerInfos.alienRes[resName] = number;
        } else {
            playerInfos.alienRes[resName] = playerInfos.alienRes[resName]+number;
        }
    } else {
        theLanderId = enoughPlaceLander(number);
        if (theLanderId >= 0) {
            lander = getBatById(theLanderId);
            if (lander.transRes[resName] === undefined) {
                lander.transRes[resName] = number;
            } else {
                lander.transRes[resName] = lander.transRes[resName]+number;
            }
        } else {
            console.log('pas de réserve !!!');
        }
    }
};

function resAddToBld(resName,number,bat,batType,over) {
    let res = getResByName(resName);
    let resSpace = checkResSpace(bat);
    if (resSpace >= 1 || over) {
        if (bat.transRes[resName] === undefined) {
            bat.transRes[resName] = number;
        } else {
            bat.transRes[resName] = bat.transRes[resName]+number;
        }
    } else {
        warning('Production stoppée',batType.name+': Plus de place pour stocker',false,bat.tileId);
    }
};

function resSub(resName,number) {
    // console.log(resName);
    let res = getResByName(resName);
    if (res.cat === 'alien') {
        playerInfos.alienRes[resName] = playerInfos.alienRes[resName]-number;
    } else {
        // console.log('landers');
        // console.log(landers);
        let revLanders = landers.reverse();
        revLanders.forEach(function(lander) {
            if (number >= 1) {
                if (lander.loc === 'zone') {
                    if (lander.id === selectedBat.id) {
                        if (selectedBat.transRes[resName] != undefined) {
                            if (selectedBat.transRes[resName] >= number) {
                                selectedBat.transRes[resName] = selectedBat.transRes[resName]-number;
                                number = 0;
                            } else {
                                number = number-selectedBat.transRes[resName];
                                delete selectedBat.transRes[resName];
                            }
                        }
                    } else {
                        if (lander.transRes[resName] != undefined) {
                            if (lander.transRes[resName] >= number) {
                                lander.transRes[resName] = lander.transRes[resName]-number;
                                number = 0;
                            } else {
                                number = number-lander.transRes[resName];
                                delete lander.transRes[resName];
                            }
                        }
                    }
                }
            }
        });
    }
};

function enoughPlaceLander(number) {
    let theLanderId = -1;
    let firstLanderId = -1;
    let resSpace = 0;
    landers.forEach(function(lander) {
        if (firstLanderId < 0) {
            firstLanderId = lander.id;
        }
        if (theLanderId < 0) {
            if (lander.loc === 'zone') {
                resSpace = checkResSpace(lander);
                if (resSpace >= number) {
                    theLanderId = lander.id;
                }
            }
        }
    });
    if (theLanderId >= 0) {
        return theLanderId;
    } else {
        return firstLanderId;
    }
};

function findMainLanderId() {
    let theLanderId = -1;
    landers.forEach(function(lander) {
        if (theLanderId < 0) {
            theLanderId = lander.id;
        }
    });
    return theLanderId;
};

function getDispoRes(resName) {
    let dispoRes = 0;
    landers.forEach(function(bat) {
        if (bat.transRes[resName] >= 1) {
            dispoRes = dispoRes+bat.transRes[resName];
        }
    });
    if (playerInfos.alienRes[resName] >= 1) {
        dispoRes = playerInfos.alienRes[resName];
    }
    return dispoRes;
};

function getDispoResStation(resName) {
    let dispoRes = 0;
    if (playerInfos.vmRes[resName] >= 1) {
        dispoRes = playerInfos.vmRes[resName];
    } else {
        playerInfos.vmRes[resName] = 0;
    }
    if (playerInfos.alienRes[resName] >= 1) {
        dispoRes = playerInfos.alienRes[resName];
    }
    return dispoRes;
};

function getMinedRes(res) {
    let minedRes = 0;
    if (minedThisTurn[res] >= 1) {
        minedRes = minedThisTurn[res];
    }
    return minedRes;
};

function getDispoCit() {
    let landersIds = findLandersIds();
    let dispoCit = 0;
    let numCitBat = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Citoyens') {
            dispoCit = dispoCit+bat.citoyens;
            numCitBat++;
        }
    });
    if (numCitBat >= 2) {
        let citNumber = 0;
        deadBatsList = [];
        bataillons.forEach(function(bat) {
            if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Citoyens') {
                citNumber++;
                if (citNumber >= 2) {
                    bat.citoyens = 0;
                    deadBatsList.push(bat.id);
                } else {
                    bat.citoyens = dispoCit;
                    bat.squadsLeft = Math.ceil(bat.citoyens/6);
                }
            }
        });
        killBatList();
    }
    return dispoCit;
};

function getDispoCrim() {
    let landersIds = findLandersIds();
    let dispoCrim = 0;
    let numCitBat = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Criminels') {
            dispoCrim = dispoCrim+bat.citoyens;
            numCitBat++;
        }
    });
    if (numCitBat >= 2) {
        let citNumber = 0;
        deadBatsList = [];
        bataillons.forEach(function(bat) {
            if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Criminels') {
                citNumber++;
                if (citNumber >= 2) {
                    bat.citoyens = 0;
                    deadBatsList.push(bat.id);
                } else {
                    bat.citoyens = dispoCrim;
                    bat.squadsLeft = Math.ceil(bat.citoyens/6);
                }
            }
        });
        killBatList();
    }
    return dispoCrim;
};

function checkAllCosts(unit,ammoNames,withDeploy,withFlat) {
    let costStatus = {};
    costStatus.ok = true;
    costStatus.string = '';
    let allCosts = calcAllCosts(unit,ammoNames,withDeploy,withFlat);
    let dispoRes;
    if (allCosts != undefined) {
        if (Object.keys(allCosts).length >= 1) {
            Object.entries(allCosts).map(entry => {
                let key = entry[0];
                let value = entry[1];
                dispoRes = getDispoRes(key);
                if (dispoRes < value) {
                    costStatus.ok = false;
                    costStatus.string = costStatus.string+'('+key+': '+dispoRes+' < '+value+') '
                    // console.log(costStatus.string);
                }
            });
        }
    }
    return costStatus;
};

function getAllCosts(bat,withDeploy,withFlat) {
    let unit = getBatType(bat);
    let ammoNames = [bat.ammo,bat.ammo2,bat.prt,bat.eq];
    let allCosts = calcAllCosts(unit,ammoNames,withDeploy,withFlat);
    return allCosts;
};

function calcAllCosts(unit,ammoNames,withDeploy,withFlat) {
    let allCosts = {};
    // console.log('UNIT COSTS');
    // console.log(unit.name);
    // console.log(unit.costs);
    if (withFlat) {
        if (unit.costs != undefined) {
            if (Object.keys(unit.costs).length >= 1) {
                mergeObjects(allCosts,unit.costs);
            }
        }
    }
    // console.log('UNIT DEPLOY');
    // console.log(unit.deploy);
    if (withDeploy) {
        if (unit.deploy != undefined) {
            if (Object.keys(unit.deploy).length >= 1) {
                mergeObjects(allCosts,unit.deploy);
            }
        } else if (unit.skills.includes('prefab')) {
            let bldDeploy = calcBldDeploy(unit);
            mergeObjects(allCosts,bldDeploy);
        }
    }
    let index;
    let batAmmo;
    let batArmor;
    let batEquip;
    // FLAT COSTS
    let flatCosts;
    // Ammo W1
    let hasW1 = false;
    let hasW2 = false;
    if (withFlat) {
        hasW1 = checkHasWeapon(1,unit,ammoNames[3]);
        if (hasW1) {
            if (ammoNames[0] != 'xxx') {
                index = ammoTypes.findIndex((obj => obj.name == ammoNames[0]));
                batAmmo = ammoTypes[index];
                flatCosts = getCosts(unit,batAmmo,1,'ammo');
            }
            // console.log('AMMO 1 COSTS');
            // console.log(batAmmo.name);
            // console.log(flatCosts);
            if (flatCosts != undefined) {
                if (Object.keys(flatCosts).length >= 1) {
                    mergeObjects(allCosts,flatCosts);
                }
            }
        }
        // Ammo W2
        hasW2 = checkHasWeapon(2,unit,ammoNames[3]);
        if (hasW2) {
            if (ammoNames[1] != 'xxx') {
                index = ammoTypes.findIndex((obj => obj.name == ammoNames[1]));
                batAmmo = ammoTypes[index];
                flatCosts = getCosts(unit,batAmmo,2,'ammo');
            }
            // console.log('AMMO 2 COSTS');
            // console.log(batAmmo.name);
            // console.log(flatCosts);
            if (flatCosts != undefined) {
                if (Object.keys(flatCosts).length >= 1) {
                    mergeObjects(allCosts,flatCosts);
                }
            }
        }
        // Armor
        if (ammoNames[2] != 'xxx') {
            index = armorTypes.findIndex((obj => obj.name == ammoNames[2]));
            batArmor = armorTypes[index];
            flatCosts = getCosts(unit,batArmor,0,'equip');
        }
        // console.log('ARMOR COSTS');
        // console.log(batArmor.name);
        // console.log(flatCosts);
        if (flatCosts != undefined) {
            if (Object.keys(flatCosts).length >= 1) {
                mergeObjects(allCosts,flatCosts);
            }
        }
        // Equip
        if (ammoNames[3] != 'xxx') {
            index = armorTypes.findIndex((obj => obj.name == ammoNames[3]));
            batEquip = armorTypes[index];
            flatCosts = getCosts(unit,batEquip,0,'equip');
        }
        // console.log('EQUIP COSTS');
        // console.log(batEquip.name);
        // console.log(flatCosts);
        if (flatCosts != undefined) {
            if (Object.keys(flatCosts).length >= 1) {
                mergeObjects(allCosts,flatCosts);
            }
        }
    }
    // DEPLOY COSTS
    let deployCosts;
    if (withDeploy) {
        // Ammo W1
        hasW1 = checkHasWeapon(1,unit,ammoNames[3]);
        if (hasW1) {
            if (ammoNames[0] != 'xxx') {
                index = ammoTypes.findIndex((obj => obj.name == ammoNames[0]));
                batAmmo = ammoTypes[index];
                deployCosts = getDeployCosts(unit,batAmmo,1,'ammo');
            }
            // console.log('AMMO 1 DEPLOY');
            // console.log(deployCosts);
            if (deployCosts != undefined) {
                if (Object.keys(deployCosts).length >= 1) {
                    mergeObjects(allCosts,deployCosts);
                }
            }
        }
        // Ammo W2
        hasW2 = checkHasWeapon(2,unit,ammoNames[3]);
        if (hasW2) {
            if (ammoNames[1] != 'xxx') {
                index = ammoTypes.findIndex((obj => obj.name == ammoNames[1]));
                batAmmo = ammoTypes[index];
                deployCosts = getDeployCosts(unit,batAmmo,2,'ammo');
            }
            // console.log('AMMO 2 DEPLOY');
            // console.log(deployCosts);
            if (deployCosts != undefined) {
                if (Object.keys(deployCosts).length >= 1) {
                    mergeObjects(allCosts,deployCosts);
                }
            }
        }
        // Armor
        if (ammoNames[2] != 'xxx') {
            index = armorTypes.findIndex((obj => obj.name == ammoNames[2]));
            batArmor = armorTypes[index];
            deployCosts = getDeployCosts(unit,batArmor,0,'equip');
        }
        // console.log('ARMOR DEPLOY');
        // console.log(deployCosts);
        if (deployCosts != undefined) {
            if (Object.keys(deployCosts).length >= 1) {
                mergeObjects(allCosts,deployCosts);
            }
        }
        // Equip
        if (ammoNames[3] != 'xxx') {
            index = armorTypes.findIndex((obj => obj.name == ammoNames[3]));
            batEquip = armorTypes[index];
            deployCosts = getDeployCosts(unit,batEquip,0,'equip');
        }
        // console.log('EQUIP DEPLOY');
        // console.log(deployCosts);
        if (deployCosts != undefined) {
            if (Object.keys(deployCosts).length >= 1) {
                mergeObjects(allCosts,deployCosts);
            }
        }
    }
    // console.log('ALL COSTS');
    // console.log(allCosts);
    return allCosts;
};

function iCanProdThis(prodUnit,unit,catz) {
    let prodThis = false;
    if (prodUnit.skills.includes('transorbital') || unit.skills.includes('panprod')) {
        prodThis = true;
    } else {
        if (catz.includes(unit.cat)) {
            if (prodUnit.cat === 'infantry' && unit.fabTime >= 35 && !unit.skills.includes('clicput')) {
                prodThis = false;
            } else if (prodUnit.skills.includes('constructeur')) {
                prodThis = true;
            } else {
                if (unit.bldReq.length < 1) {
                    prodThis = true;
                } else if (unit.bldReq.includes(prodUnit.name)) {
                    prodThis = true;
                } else {
                    let bldRequis = unit.bldReq;
                    let thisBldReq = {};
                    if (unit.bldReq[0] != undefined) {
                        thisBldReq = getBatTypeByName(unit.bldReq[0]);
                        if (thisBldReq.bldReplace != undefined) {
                            bldRequis = bldRequis.concat(thisBldReq.bldReplace);
                        }
                    }
                    if (unit.bldReq[1] != undefined) {
                        thisBldReq = getBatTypeByName(unit.bldReq[1]);
                        if (thisBldReq.bldReplace != undefined) {
                            bldRequis = bldRequis.concat(thisBldReq.bldReplace);
                        }
                    }
                    if (unit.bldReq[2] != undefined) {
                        thisBldReq = getBatTypeByName(unit.bldReq[2]);
                        if (thisBldReq.bldReplace != undefined) {
                            bldRequis = bldRequis.concat(thisBldReq.bldReplace);
                        }
                    }
                    if (bldRequis.includes(prodUnit.name)) {
                        prodThis = true;
                    }
                }
            }
        }
    }
    return prodThis;
};
