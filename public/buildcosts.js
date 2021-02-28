function voirReserve() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="constName or" id="gentils">RESERVE</span><br>');
    findLanders();
    let dispoCit = getDispoCit();
    $('#conUnitList').append('<span class="paramName">Citoyens</span><span class="paramIcon"></span><span class="paramValue cy">'+dispoCit+'</span><br>');
    let dispoCrim = getDispoCrim();
    $('#conUnitList').append('<span class="paramName">Criminels</span><span class="paramIcon"></span><span class="paramValue cy">'+dispoCrim+'</span><br>');
    let dispoRes;
    let minedRes;
    let resIcon;
    let sortedResTypes = _.sortBy(_.sortBy(_.sortBy(_.sortBy(resTypes,'rarity'),'rarity'),'cat'),'cat');
    sortedResTypes.reverse();
    // sortedResTypes = _.sortBy(sortedResTypes,'level')
    sortedResTypes.forEach(function(res) {
        dispoRes = getDispoRes(res.name);
        minedRes = getMinedRes(res.name);
        resIcon = getResIcon(res);
        if (dispoRes >= 1) {
            if (res.cat === 'alien' || minedRes <= 0) {
                $('#conUnitList').append('<span class="paramName">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramValue"><span class="cy">'+dispoRes+'</span></span><br>');
            } else {
                $('#conUnitList').append('<span class="paramName">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramValue"><span class="cy">'+dispoRes+'</span> +('+minedRes+')</span><br>');
            }
            playerInfos.reserve[res.name] = dispoRes;
        } else {
            playerInfos.reserve[res.name] = 0;
        }
    });
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

function resetReserve() {
    resTypes.forEach(function(res) {
        playerInfos.reserve[res.name] = 0;
    });
};

function findLanders() {
    let batType;
    landers = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            batType = getBatType(bat);
            if (batType.skills.includes('transorbital') || batType.skills.includes('reserve')) {
                landers.push(bat);
            }
        }
    });
};

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
                deployFactor = thp/120;
            }
        }
    }
    return deployFactor;
};

function payDeployCosts(unit,ammoNames) {
    let deployCosts;
    let ammoIndex;
    let batAmmo;
    // Ammo W1
    let hasW1 = false;
    if (!conselUnit.weapon.kit || conselAmmos[3].includes('w1-') || conselAmmos[3].includes('w2-')) {
        hasW1 = true;
    }
    if (ammoNames[0] != 'xxx' && hasW1) {
        ammoIndex = ammoTypes.findIndex((obj => obj.name == ammoNames[0]));
        batAmmo = ammoTypes[ammoIndex];
        deployCosts = getDeployCosts(unit,batAmmo,1,'ammo');
        payCost(deployCosts);
    }
    // Ammo W2
    let hasW2 = false;
    if (!conselUnit.weapon2.kit || conselAmmos[3].includes('kit-') || conselAmmos[3].includes('w2-')) {
        hasW2 = true;
    }
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
    let hasW1 = false;
    if (!conselUnit.weapon.kit || conselAmmos[3].includes('w1-') || conselAmmos[3].includes('w2-')) {
        hasW1 = true;
    }
    if (ammoNames[0] != 'xxx' && hasW1) {
        index = ammoTypes.findIndex((obj => obj.name == ammoNames[0]));
        batAmmo = ammoTypes[index];
        costs = getCosts(unit,batAmmo,1,'ammo');
        payCost(costs);
    }
    // Ammo W2
    let hasW2 = false;
    if (!conselUnit.weapon2.kit || conselAmmos[3].includes('kit-') || conselAmmos[3].includes('w2-')) {
        hasW2 = true;
    }
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
        } else {
            costFactor = Math.ceil(unit.squads*unit.squadSize*unit.weapon2.power/2);
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
            deployFactor = Math.ceil(unit.squads*unit.weapon.rof*unit.weapon.power/5*deploySalvos);
            if (!unit.weapon.noBis) {
                if (unit.maxSalvo >= 2) {
                    if (unit.ap/unit.weapon.cost >= unit.maxSalvo) {
                        deployFactor = deployFactor*unit.maxSalvo;
                    } else {
                        deployFactor = deployFactor*(unit.maxSalvo-1);
                    }
                }
            }
        } else {
            deployFactor = Math.ceil(unit.squads*unit.weapon2.rof*unit.weapon2.power/5*deploySalvos);
            if (!unit.weapon2.noBis) {
                if (unit.maxSalvo >= 2) {
                    if (unit.ap/unit.weapon2.cost >= unit.maxSalvo) {
                        deployFactor = deployFactor*unit.maxSalvo;
                    } else {
                        deployFactor = deployFactor*(unit.maxSalvo-1);
                    }
                }
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
            if (Object.keys(unit.deploy).length >= 1) {
                deployCosts = JSON.parse(JSON.stringify(unit.deploy));
            } else {
                deployCosts = {};
            }
        } else {
            deployCosts = {};
        }
    } else if (type === 'equip') {
        let equip = ammo;
        deployFactor = getEquipDeployFactor(unit,equip);
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
            // console.log(key+' '+dispoRes+'/'+value);
            if (dispoRes < value) {
                enoughRes = false;
            }
        });
    }
    let reqCit = batType.squads*batType.squadSize*batType.crew;
    if (reqCit >= 1) {
        if (batType.skills.includes('brigands')) {
            let dispoCrim = getDispoCrim();
            if (reqCit > dispoCrim) {
                enoughRes = false;
            }
        } else {
            let dispoCit = getDispoCit();
            if (reqCit > dispoCit) {
                enoughRes = false;
            }
        }
    }
    return enoughRes;
};

function payUnitCost(batType) {
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
    if (reqCit >= 1) {
        let landersIds = [];
        if (batType.skills.includes('brigands')) {
            let dispoCrim = getDispoCrim();
            let restCit = dispoCrim-reqCit;
            bataillons.forEach(function(bat) {
                if (bat.loc === 'zone') {
                    batType = getBatType(bat);
                    if (batType.skills.includes('transorbital')) {
                        landersIds.push(bat.id);
                    }
                }
            });
            deadBatsList = [];
            bataillons.forEach(function(bat) {
                if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Criminels') {
                    warning('Bug?','Perte de criminels: restCit='+restCit+' bat.citoyens='+bat.citoyens);
                    if (restCit === 0) {
                        bat.citoyens = 0;
                        deadBatsList.push(bat.id);
                    } else {
                        bat.citoyens = restCit;
                    }
                }
            });
            if (restCit === 0) {
                killBatList();
            }
        } else {
            let dispoCit = getDispoCit();
            let restCit = dispoCit-reqCit;
            bataillons.forEach(function(bat) {
                if (bat.loc === 'zone') {
                    batType = getBatType(bat);
                    if (batType.skills.includes('transorbital')) {
                        landersIds.push(bat.id);
                    }
                }
            });
            deadBatsList = [];
            bataillons.forEach(function(bat) {
                if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Citoyens') {
                    warning('Bug?','Perte de citoyens: restCit='+restCit+' bat.citoyens='+bat.citoyens);
                    if (restCit === 0) {
                        bat.citoyens = 0;
                        deadBatsList.push(bat.id);
                    } else {
                        bat.citoyens = restCit;
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

function resSub(resName,number) {
    // console.log(resName);
    let res = getResByName(resName);
    if (res.cat === 'alien') {
        playerInfos.alienRes[resName] = playerInfos.alienRes[resName]-number;
    } else {
        let revLanders = landers.reverse();
        revLanders.forEach(function(lander) {
            if (number >= 1) {
                if (lander.loc === 'zone') {
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

function getMinedRes(res) {
    let minedRes = 0;
    if (minedThisTurn[res] >= 1) {
        minedRes = minedThisTurn[res];
    }
    return minedRes;
};

function getDispoCit() {
    let landersIds = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            batType = getBatType(bat);
            if (batType.skills.includes('transorbital')) {
                landersIds.push(bat.id);
            }
        }
    });
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
                warning('Bug?','Perte de citoyens: dispoCit='+dispoCit+' bat.citoyens='+bat.citoyens);
                if (citNumber >= 2) {
                    bat.citoyens = 0;
                    deadBatsList.push(bat.id);
                } else {
                    bat.citoyens = dispoCit;
                }
            }
        });
        killBatList();
    }
    return dispoCit;
};

function getDispoCrim() {
    let landersIds = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            batType = getBatType(bat);
            if (batType.skills.includes('transorbital')) {
                landersIds.push(bat.id);
            }
        }
    });
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
                }
            }
        });
        killBatList();
    }
    return dispoCrim;
};

function checkAllCosts(unit,ammoNames) {
    let costsOK = true;
    let allCosts = {};
    console.log('UNIT COSTS');
    console.log(unit.name);
    console.log(unit.costs);
    if (unit.costs != undefined) {
        if (Object.keys(unit.costs).length >= 1) {
            mergeObjects(allCosts,unit.costs);
        }
    }
    console.log('UNIT DEPLOY');
    console.log(unit.deploy);
    if (unit.deploy != undefined) {
        if (Object.keys(unit.deploy).length >= 1) {
            mergeObjects(allCosts,unit.deploy);
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
    if (!unit.weapon.kit || ammoNames[3].includes('w1-') || ammoNames[3].includes('w2-')) {
        hasW1 = true;
    }
    if (hasW1) {
        if (ammoNames[0] != 'xxx') {
            index = ammoTypes.findIndex((obj => obj.name == ammoNames[0]));
            batAmmo = ammoTypes[index];
            flatCosts = getCosts(unit,batAmmo,1,'ammo');
        }
        console.log('AMMO 1 COSTS');
        console.log(batAmmo.name);
        console.log(flatCosts);
        if (flatCosts != undefined) {
            if (Object.keys(flatCosts).length >= 1) {
                mergeObjects(allCosts,flatCosts);
            }
        }
    }
    // Ammo W2
    let hasW2 = false;
    if (!unit.weapon2.kit || ammoNames[3].includes('kit-') || ammoNames[3].includes('w2-')) {
        hasW2 = true;
    }
    if (hasW2) {
        if (ammoNames[1] != 'xxx') {
            index = ammoTypes.findIndex((obj => obj.name == ammoNames[1]));
            batAmmo = ammoTypes[index];
            flatCosts = getCosts(unit,batAmmo,2,'ammo');
        }
        console.log('AMMO 2 COSTS');
        console.log(batAmmo.name);
        console.log(flatCosts);
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
    console.log('ARMOR COSTS');
    console.log(batArmor.name);
    console.log(flatCosts);
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
    console.log('EQUIP COSTS');
    console.log(batEquip.name);
    console.log(flatCosts);
    if (flatCosts != undefined) {
        if (Object.keys(flatCosts).length >= 1) {
            mergeObjects(allCosts,flatCosts);
        }
    }
    // DEPLOY COSTS
    let deployCosts;
    // Ammo W1
    if (hasW1) {
        if (ammoNames[0] != 'xxx') {
            index = ammoTypes.findIndex((obj => obj.name == ammoNames[0]));
            batAmmo = ammoTypes[index];
            deployCosts = getDeployCosts(unit,batAmmo,1,'ammo');
        }
        console.log('AMMO 1 DEPLOY');
        console.log(deployCosts);
        if (deployCosts != undefined) {
            if (Object.keys(deployCosts).length >= 1) {
                mergeObjects(allCosts,deployCosts);
            }
        }
    }
    // Ammo W2
    if (hasW2) {
        if (ammoNames[1] != 'xxx') {
            index = ammoTypes.findIndex((obj => obj.name == ammoNames[1]));
            batAmmo = ammoTypes[index];
            deployCosts = getDeployCosts(unit,batAmmo,2,'ammo');
        }
        console.log('AMMO 2 DEPLOY');
        console.log(deployCosts);
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
    console.log('ARMOR DEPLOY');
    console.log(deployCosts);
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
    console.log('EQUIP DEPLOY');
    console.log(deployCosts);
    if (deployCosts != undefined) {
        if (Object.keys(deployCosts).length >= 1) {
            mergeObjects(allCosts,deployCosts);
        }
    }
    console.log('ALL COSTS');
    console.log(allCosts);
    let dispoRes;
    if (allCosts != undefined) {
        if (Object.keys(allCosts).length >= 1) {
            Object.entries(allCosts).map(entry => {
                let key = entry[0];
                let value = entry[1];
                dispoRes = getDispoRes(key);
                if (dispoRes < value) {
                    costsOK = false;
                }
            });
        }
    }
    return costsOK;
};
