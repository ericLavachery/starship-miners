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
        }
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
            console.log('pay '+value+' '+key);
        });
    }
};

function getDeployCosts(unit,ammo,weapNum) {
    let deployCosts = {};
    if (weapNum != 0) {
        // AMMOs
        let deployFactor = 0;
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
                Object.entries(ammo.deploy).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    deployCosts[key] = Math.ceil(value*deployFactor/ammo.batch);
                });
            } else {
                deployCosts = {};
            }
        } else {
            deployCosts = {};
        }
    } else {
        // UNIT
        if (unit.deploy != undefined) {
            if (Object.keys(unit.deploy).length >= 1) {
                deployCosts = JSON.parse(JSON.stringify(unit.deploy));
                Object.entries(unit.deploy).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    deployCosts[key] = Math.ceil(value*deploySalvos);
                });
            } else {
                deployCosts = {};
            }
        } else {
            deployCosts = {};
        }
    }
    return deployCosts;
}

function payDeployCosts(unit,ammoName) {
    let deployCosts;
    let ammoIndex;
    let batAmmo;
    // Ammo W1
    if (ammoName[0] != 'xxx') {
        ammoIndex = ammoTypes.findIndex((obj => obj.name == ammoName[0]));
        batAmmo = ammoTypes[ammoIndex];
        deployCosts = getDeployCosts(unit,batAmmo,1);
        payCost(deployCosts);
    }
    // Ammo W2
    if (ammoName[1] != 'xxx') {
        ammoIndex = ammoTypes.findIndex((obj => obj.name == ammoName[1]));
        batAmmo = ammoTypes[ammoIndex];
        deployCosts = getDeployCosts(unit,batAmmo,2);
        payCost(deployCosts);
    }
    // Unit
    deployCosts = getDeployCosts(unit,batAmmo,0);
    payCost(deployCosts);
};

function payEquipCosts(unit,ammoName) {
    // Payer le prix fixe des lames, des équipements et des armures

};

function checkUnitCost(batType) {
    let enoughRes = true;
    // console.log('CHECK COSTS');
    // console.log(batType.name);
    if (batType.costs != undefined) {
        Object.entries(batType.costs).map(entry => {
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
    console.log(resName);
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
