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
        let dispoCit = getDispoCit();
        if (reqCit > dispoCit) {
            enoughRes = false;
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
