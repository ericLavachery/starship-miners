function craftWindow() {
    selectMode();
    updateBldList();
    findLanders();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","600px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="blockTitle"><h1>Crafting</h1></span>');
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');

    let craftFactor;
    let craftCostsList;
    let craftCompReqs;
    let craftOK = false;
    let compReqOK = false;
    let costOK = false;
    let bldOK = false;
    crafting.forEach(function(craft) {
        craftOK = false;
        if (craft.result != 'Moteur Orbital') {
            craftFactor = 50;
        } else {
            craftFactor = 1;
        }
        compReqOK = checkCompReq(craft);
        costOK = checkCraftCost(craft.id,craftFactor)
        bldOK = false;
        if ((playerInfos.bldList.includes(craft.bldReq[0]) || craft.bldReq[0] === undefined) && (playerInfos.bldList.includes(craft.bldReq[1]) || craft.bldReq[1] === undefined) && (playerInfos.bldList.includes(craft.bldReq[2]) || craft.bldReq[2] === undefined)) {
            bldOK = true;
            if (compReqOK) {
                if (costOK) {
                    craftOK = true;
                }
            }
        }
        if (craftOK) {
            $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
            $('#conUnitList').append('<span class="craftsList cy klik" title="'+toNiceString(craft.bldReq)+'" onclick="doCraft('+craft.id+','+craftFactor+')">'+craftFactor+' '+craft.result+'</span><br>');
        } else {
            $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
            $('#conUnitList').append('<span class="craftsList gf" title="'+toNiceString(craft.bldReq)+'">'+craftFactor+' '+craft.result+'</span><br>');
        }
        craftCostsList = showCraftCost(craft,craftFactor);
        $('#conUnitList').append('<span class="craftsList">'+craftCostsList+'</span><br>');
        if (craft.bldReq.length >= 1) {
            if (bldOK) {
                $('#conUnitList').append('<span class="craftsList bleu">'+toNiceString(craft.bldReq)+'</span><br>');
            } else {
                $('#conUnitList').append('<span class="craftsList rouge">'+toNiceString(craft.bldReq)+'</span><br>');
            }
        }
        if (Object.keys(craft.compReq).length >= 1) {
            craftCompReqs = showCraftCompReqs(craft);
            if (compReqOK) {
                $('#conUnitList').append('<span class="craftsList bleu">'+craftCompReqs+'</span><br>');
            } else {
                $('#conUnitList').append('<span class="craftsList rouge">'+craftCompReqs+'</span><br>');
            }
        }
        $('#conUnitList').append('<hr>');
    });
    if (playerInfos.bldList.includes('Crameur')) {
        let energyFactor = 50;
        let dispoRes = 0;
        let neededRes = 0;
        let sortedResTypes = _.sortBy(_.sortBy(_.sortBy(_.sortBy(resTypes,'rarity'),'rarity'),'cat'),'cat');
        sortedResTypes.reverse();
        sortedResTypes.forEach(function(res) {
            if (res.energie > 0) {
                dispoRes = getDispoRes(res.name);
                neededRes = res.energie*energyFactor/10;
                neededRes = cramPower(res,neededRes);
                if (dispoRes >= neededRes) {
                    $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                    $('#conUnitList').append('<span class="craftsList cy klik" onclick="doEnergyCraft(`'+res.name+'`,'+neededRes+','+energyFactor+')">'+energyFactor+' Energie</span><br>');
                    $('#conUnitList').append('<span class="craftsList gf">'+res.name+':<span class="bleu">'+neededRes+'</span>/<span class="vert">'+dispoRes+'</span></span><br>');
                } else {
                    $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                    $('#conUnitList').append('<span class="craftsList gf">'+energyFactor+' Energie</span><br>');
                    $('#conUnitList').append('<span class="craftsList gf">'+res.name+':<span class="rouge">'+neededRes+'</span>/<span class="vert">'+dispoRes+'</span></span><br>');
                }
                $('#conUnitList').append('<span class="craftsList bleu">Crameur</span><br>');
                $('#conUnitList').append('<hr>');
            }
        });
    }
};

function checkCraftCost(craftId,number) {
    let craftResOK = true;
    let dispoRes;
    let craftIndex = crafting.findIndex((obj => obj.id == craftId));
    let craft = crafting[craftIndex];
    let craftFactor = Math.round(number/craft.batch);
    Object.entries(craft.cost).map(entry => {
        let key = entry[0];
        let value = entry[1];
        value = value*craftFactor;
        dispoRes = getDispoRes(key);
        if (dispoRes < value) {
            craftResOK = false;
        }
    });
    return craftResOK;
};

function doCraft(craftId,number) {
    let craftIndex = crafting.findIndex((obj => obj.id == craftId));
    let craft = crafting[craftIndex];
    let craftFactor = Math.round(number/craft.batch);
    Object.entries(craft.cost).map(entry => {
        let key = entry[0];
        let value = entry[1];
        value = value*craftFactor;
        resSub(key,value);
    });
    resAdd(craft.result,number);
    craftWindow();
};

function doEnergyCraft(resName,neededRes,energyCreated) {
    resSub(resName,neededRes);
    resAdd('Energie',energyCreated);
    craftWindow();
};

function showCraftCost(craft,number) {
    let craftCostsList = ' ';
    let dispoRes;
    let craftFactor = Math.round(number/craft.batch);
    Object.entries(craft.cost).map(entry => {
        let key = entry[0];
        let value = entry[1];
        value = value*craftFactor;
        dispoRes = getDispoRes(key);
        if (dispoRes >= value) {
            craftCostsList = craftCostsList+'<span class="gf">'+key+':</span><span class="bleu">'+value+'</span>/<span class="vert">'+dispoRes+'</span> ';
        } else {
            craftCostsList = craftCostsList+'<span class="gf">'+key+':</span><span class="rouge">'+value+'</span>/<span class="vert">'+dispoRes+'</span> ';
        }
    });
    return craftCostsList;
};

function showCraftCompReqs(craft) {
    let craftCompReqs = ' ';
    Object.entries(craft.compReq).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (playerInfos.comp[key] >= value) {
            craftCompReqs = craftCompReqs+'<span class="bleu">'+key+':'+value+'</span> ';
        } else {
            craftCompReqs = craftCompReqs+'<span class="rouge">'+key+':'+value+'</span> ';
        }
    });
    return craftCompReqs;
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
        landers.forEach(function(lander) {
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

function upkeepAndProd(bat,batType) {
    console.log('UPKEEP');
    console.log(batType.name);
    let upkeepPaid = true;
    let upkeepCheck = false;
    if (bat.tags.includes('prodres')) {
        upkeepCheck = true;
    }
    if (batType.skills.includes('upkeep') && !batType.skills.includes('prodres')) {
        upkeepCheck = true;
    }
    if (upkeepCheck) {
        if (batType.upkeep != undefined) {
            Object.entries(batType.upkeep).map(entry => {
                let key = entry[0];
                let value = entry[1];
                let dispoRes = getDispoRes(key);
                if (dispoRes < value) {
                    upkeepPaid = false;
                }
            });
            if (upkeepPaid) {
                Object.entries(batType.upkeep).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    resSub(key,value);
                    console.log('upkeep = '+key+':'+value);
                });
            } else {
                upkeepNotPaid(bat,batType);
            }
        }
        if (batType.prod != undefined) {
            if (upkeepPaid) {
                Object.entries(batType.prod).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    resAdd(key,value);
                    console.log('prod = '+key+':'+value);
                });
            }
        }
    } else if (batType.skills.includes('prodres')) {
        upkeepNotPaid(bat,batType);
    }
};

function upkeepNotPaid(bat,batType) {
    console.log('upkeep = non payée');
    if (!batType.skills.includes('nodisable')) {
        if (bat.tags.includes('construction')) {
            let allTags = _.countBy(bat.tags);
            if (allTags.construction === 1) {
                bat.tags.push('construction');
            }
        } else {
            bat.tags.push('construction');
            bat.tags.push('construction');
        }
    }
};

function cramPower(res,neededRes) {
    let energyComp = playerInfos.comp.energ;
    if (energyComp === 4) {
        energyComp = 5;
    }
    neededRes = Math.round(neededRes/(energyComp+15)*15);
    if (res.name === 'Huile' || res.name === 'Fuel' || res.name === 'Pyrus' || res.name === 'Pyratol' || res.name === 'Hydrocarbure') {
        neededRes = Math.round(neededRes/(playerInfos.comp.pyro+6)*6);
    } else if (res.bld === 'Derrick') {
        neededRes = Math.round(neededRes/(playerInfos.comp.explo+6)*6);
    } else if (res.name === 'Scrap') {
        neededRes = Math.round(neededRes/(playerInfos.comp.tri+4)*4);
    } else if (res.bld === 'Comptoir') {
        neededRes = Math.round(neededRes/(playerInfos.comp.tri+8)*8);
    } else if (res.cat === 'alien') {
        neededRes = Math.round(neededRes/(playerInfos.comp.ca+10)*10);
    } else if (res.cat === 'transfo') {
        neededRes = Math.round(neededRes/(playerInfos.comp.tri+8)*8);
    } else {
        neededRes = Math.round(neededRes/(energyComp+10)*10);
    }
    return neededRes;
};
