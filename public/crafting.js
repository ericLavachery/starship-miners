function craftWindow(retour) {
    selectMode();
    batUnselect();
    updateBldList();
    findLanders();
    let maxCrafts = getMaxCrafts();
    if (playerInfos.mapTurn >= 3) {
        calcEndRes(false);
    }
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","600px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="blockTitle"><h1>Crafting <span class="vert">('+playerInfos.crafts+'/'+maxCrafts+')</span></h1></span>');
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    let creationNum;
    let craftCostsList;
    let craftCompReqs;
    let craftOK = false;
    let compReqOK = false;
    let costOK = false;
    let bldOK = false;
    let oldCraft = false;
    console.log('maxCrafts='+maxCrafts);
    crafting.forEach(function(craft) {
        craftOK = false;
        if (craft.creaNum === undefined) {
            creationNum = 50;
        } else {
            creationNum = craft.creaNum;
        }
        compReqOK = checkCompReq(craft);
        costOK = checkCraftCost(craft.id,creationNum);
        bldOK = false;
        if ((playerInfos.bldList.includes(craft.bldReq[0]) || craft.bldReq[0] === undefined) && (playerInfos.bldList.includes(craft.bldReq[1]) || craft.bldReq[1] === undefined) && (playerInfos.bldList.includes(craft.bldReq[2]) || craft.bldReq[2] === undefined)) {
            bldOK = true;
            if (compReqOK) {
                if (costOK) {
                    craftOK = true;
                }
            }
        }
        if (playerInfos.crafts >= maxCrafts && !craft.deg) {
            craftOK = false;
        }
        oldCraft = checkOldCraft(craft);
        let iHave = getDispoRes(craft.result);
        let craftCol = 'cy';
        if (craft.deg) {
            craftCol = 'sky';
        }
        if ((compReqOK || playerInfos.pseudo === 'Test') && !oldCraft) {
            $('#conUnitList').append('<div class="craftsBlock" style="background-color:'+craft.bg+';" id="crf'+craft.id+'"></div>');
            if (craftOK) {
                $('#crf'+craft.id).append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                $('#crf'+craft.id).append('<span class="craftsList '+craftCol+' klik" title="'+toNiceString(craft.bldReq)+'" onclick="doCraft('+craft.id+','+creationNum+')">'+creationNum+' '+craft.result+' <span class="brunf">('+iHave+')</span></span><br>');
            } else {
                $('#crf'+craft.id).append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                $('#crf'+craft.id).append('<span class="craftsList gf" title="'+toNiceString(craft.bldReq)+'">'+creationNum+' '+craft.result+' <span class="brunf">('+iHave+')</span></span><br>');
            }
            craftCostsList = showCraftCost(craft,creationNum);
            $('#crf'+craft.id).append('<span class="craftsList">'+craftCostsList+'</span><br>');
            if (craft.bldReq.length >= 1) {
                if (bldOK) {
                    $('#crf'+craft.id).append('<span class="craftsList bleu">'+toNiceString(craft.bldReq)+'</span><br>');
                } else {
                    $('#crf'+craft.id).append('<span class="craftsList rouge">'+toNiceString(craft.bldReq)+'</span><br>');
                }
            }
            if (Object.keys(craft.compReq).length >= 1) {
                craftCompReqs = showCraftCompReqs(craft);
                if (compReqOK) {
                    $('#crf'+craft.id).append('<span class="craftsList bleu">'+craftCompReqs+'</span><br>');
                } else {
                    $('#crf'+craft.id).append('<span class="craftsList rouge">'+craftCompReqs+'</span><br>');
                }
            }
            $('#crf'+craft.id).append('<hr class="craft">');
        }
    });
    if (playerInfos.bldList.includes('Crameur') || playerInfos.bldList.includes('Centrale nucléaire')) {
        let energyFactor = 100;
        let dispoRes = 0;
        let neededRes = 0;
        let indus = playerInfos.comp.ind;
        if (playerInfos.comp.ind === 3) {
            indus = 4;
        }
        let iHave = getDispoRes('Energie');
        let sortedResTypes = _.sortBy(_.sortBy(_.sortBy(_.sortBy(resTypes,'rarity'),'rarity'),'cat'),'energie');
        // sortedResTypes.reverse();
        sortedResTypes.forEach(function(res) {
            if (res.energie > 0) {
                let cramBld = 'Crameur';
                if (res.cramBld != undefined) {
                    if (res.cramBld === 'Centrale nucléaire') {
                        cramBld = 'Centrale nucléaire';
                    }
                }
                if (playerInfos.bldList.includes(cramBld)) {
                    energyFactor = Math.round(50/Math.sqrt(res.energie)*(indus+6)/6)*5;
                    dispoRes = getDispoRes(res.name);
                    neededRes = res.energie*energyFactor/eCrafting;
                    neededRes = cramPower(res,neededRes);
                    $('#conUnitList').append('<div class="craftsBlock" id="cram'+res.id+'"></div>');
                    if (dispoRes >= neededRes && playerInfos.crafts < maxCrafts) {
                        $('#cram'+res.id).append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        $('#cram'+res.id).append('<span class="craftsList cy klik" onclick="doEnergyCraft(`'+res.name+'`,'+neededRes+','+energyFactor+')">'+energyFactor+' Energie <span class="brunf">('+iHave+')</span></span><br>');
                        $('#cram'+res.id).append('<span class="craftsList gf">'+res.name+':<span class="bleu">'+neededRes+'</span>/<span class="vert">'+dispoRes+'</span></span><br>');
                    } else {
                        $('#cram'+res.id).append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        $('#cram'+res.id).append('<span class="craftsList gf">'+energyFactor+' Energie</span><br>');
                        $('#cram'+res.id).append('<span class="craftsList gf">'+res.name+':<span class="rouge">'+neededRes+'</span>/<span class="vert">'+dispoRes+'</span></span><br>');
                    }
                    $('#cram'+res.id).append('<span class="craftsList bleu">'+cramBld+'</span><br>');
                    $('#cram'+res.id).append('<hr class="craft">');
                }
            }
        });
    }
    if (!retour) {
        $("#conUnitList").animate({scrollTop:0},"fast");
    }
};

function checkOldCraft(craft) {
    let oldCraft = false;
    let bldKO = false;
    let allCompForKO = true;
    if (craft.bldOut != undefined) {
        if (playerInfos.bldList.includes(craft.bldOut[0])) {
            bldKO = true;
        }
    }
    if (bldKO) {
        if (craft.compOut != undefined) {
            if (Object.keys(craft.compOut).length >= 1) {
                Object.entries(craft.compOut).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if (playerInfos.comp[key] < value) {
                        allCompForKO = false;
                    }
                });
            }
        }
    }
    if (allCompForKO && bldKO) {
        oldCraft = true;
    }
    return oldCraft;
};

function checkCraftCost(craftId,number) {
    let craftResOK = true;
    let dispoRes;
    let craftIndex = crafting.findIndex((obj => obj.id == craftId));
    let craft = crafting[craftIndex];
    let craftFactor = number/craft.batch;
    craftFactor = adjCraftFactor(craft,craftFactor);
    Object.entries(craft.cost).map(entry => {
        let key = entry[0];
        let value = entry[1];
        value = Math.ceil(value*craftFactor);
        dispoRes = getDispoRes(key);
        if (dispoRes < value) {
            craftResOK = false;
        }
    });
    return craftResOK;
};

function getCraftsPerTurn() {
    let craftsPerTurn = baseCrafts*(playerInfos.comp.ind+3)/3;
    if (playerInfos.bldList.includes('Usine')) {
        craftsPerTurn = (craftsPerTurn+1)*1.5;
    } else if (playerInfos.bldList.includes('Chaîne de montage')) {
        craftsPerTurn = (craftsPerTurn+0.5)*1.25;
    } else if (!playerInfos.bldList.includes('Atelier')) {
        craftsPerTurn = craftsPerTurn/1.5;
    }
    craftsPerTurn = craftsPerTurn.toFixedNumber(2);
    return craftsPerTurn;
};

function craftReset(time) {
    let craftsPerTurn = getCraftsPerTurn();
    playerInfos.crafts = playerInfos.crafts-Math.ceil(time*craftsPerTurn);
    if (playerInfos.crafts < 0) {
        playerInfos.crafts = 0;
    }
}

function getMaxCrafts() {
    let craftsPerTurn = getCraftsPerTurn();
    let maxCrafts = Math.ceil(craftsPerTurn*3);
    if (playerInfos.onShip) {
        maxCrafts = maxCrafts*3;
    }
    return maxCrafts;
}

function doCraft(craftId,number) {
    let craftIndex = crafting.findIndex((obj => obj.id == craftId));
    let craft = crafting[craftIndex];
    let craftFactor = number/craft.batch;
    craftFactor = adjCraftFactor(craft,craftFactor);
    Object.entries(craft.cost).map(entry => {
        let key = entry[0];
        let value = entry[1];
        value = Math.ceil(value*craftFactor);
        resSub(key,value);
    });
    resAdd(craft.result,number);
    if (playerInfos.mapTurn >= 3) {
        // calcEndRes(false);
    }
    if (!craft.deg) {
        playerInfos.crafts = playerInfos.crafts+1;
    }
    craftWindow(true);
};

function adjCraftFactor(craft,craftFactor) {
    let noFactor = false;
    if (craft.result === 'Energons') {
        noFactor = true;
    }
    if (craft.cost['Energons'] != undefined) {
        noFactor = true;
    }
    if (!noFactor) {
        // CORRUPTION
        if (true) {

        }
        craftFactor = craftFactor*(100+playerInfos.crime)/100;
        // INDUSTRIE
        if (playerInfos.comp.ind >= 1 && playerInfos.bldList.includes('Atelier')) {
            let indusLevel = playerInfos.comp.ind;
            if (playerInfos.bldList.includes('Usine')) {
                indusLevel = indusLevel+2;
                if (playerInfos.comp.ind >= 3) {
                    indusLevel = indusLevel+2;
                } else if (playerInfos.comp.ind >= 1) {
                    indusLevel = indusLevel+1;
                }
            } else if (playerInfos.bldList.includes('Chaîne de montage')) {
                indusLevel = indusLevel+1;
            }
            craftFactor = craftFactor*20/(20+indusLevel);
        }
        // RECYCLAGE
        if (playerInfos.comp.tri >= 1 && playerInfos.bldList.includes('Décharge')) {
            let scrapCrafting = false;
            if (craft.result === 'Scrap') {
                scrapCrafting = true;
            }
            if (craft.cost['Scrap'] != undefined) {
                scrapCrafting = true;
            }
            if (scrapCrafting) {
                let recupLevel = playerInfos.comp.tri;
                if (playerInfos.bldList.includes('Recyclab') && !craft.bldReq.includes('Recyclab')) {
                    recupLevel = recupLevel+1;
                }
                if (craft.compReq['tri'] != undefined) {
                    recupLevel = recupLevel-craft.compReq['tri'];
                }
                if (recupLevel >= 1) {
                    craftFactor = craftFactor*18/(18+recupLevel);
                }
            }
        }
        // CONSTRUCTION
        if (playerInfos.comp.const >= 1) {
            if (craft.cost['Scrap'] === undefined) {
                if (craft.result === 'Compo1' || craft.result === 'Compo2' || craft.result === 'Compo3') {
                    let compoLevel = playerInfos.comp.const;
                    if (craft.compReq['const'] != undefined) {
                        compoLevel = compoLevel-craft.compReq['const'];
                    }
                    if (compoLevel >= 1) {
                        craftFactor = craftFactor*15/(15+compoLevel);
                    }
                }
            }
        }
    }
    return craftFactor;
};

function doEnergyCraft(resName,neededRes,energyCreated) {
    resSub(resName,neededRes);
    resAdd('Energie',energyCreated);
    playerInfos.crafts = playerInfos.crafts+1;
    craftWindow(true);
};

function showCraftCost(craft,number) {
    let craftCostsList = ' ';
    let dispoRes;
    let craftFactor = number/craft.batch;
    // console.log(craft.result);
    // console.log(craft.cost);
    // console.log(craftFactor);
    craftFactor = adjCraftFactor(craft,craftFactor);
    // console.log(craftFactor);
    let sonde = getBatTypeByName('Impacteur');
    if (!playerInfos.bldVM.includes('Aérodocks')) {
        sonde = getBatTypeByName('Sonde');
    }
    Object.entries(craft.cost).map(entry => {
        let key = entry[0];
        let value = entry[1];
        value = Math.ceil(value*craftFactor);
        dispoRes = getDispoRes(key);
        let resColor = 'vert';
        if (playerInfos.mapTurn >= 3) {
            if (playerInfos.endRes[key] != undefined) {
                let resResult = playerInfos.endRes[key]-playerInfos.startRes[key];
                if (sondeCount === 'cy') {
                    if (sonde.costs[key] != undefined) {
                        resResult = resResult-sonde.costs[key];
                    }
                }
                if (homeCount === 'cy') {
                    if (Object.keys(playerInfos.weekRes).length >= 1) {
                        if (playerInfos.weekRes[key] != undefined) {
                            resResult = resResult+playerInfos.weekRes[key];
                        }
                    }
                }
                if (resResult < value) {
                    resColor = 'or';
                }
            }
        }
        if (dispoRes >= value) {
            craftCostsList = craftCostsList+'<span class="gf">'+key+':</span><span class="bleu">'+value+'</span>/<span class="'+resColor+'">'+dispoRes+'</span> ';
        } else {
            craftCostsList = craftCostsList+'<span class="gf">'+key+':</span><span class="rouge">'+value+'</span>/<span class="'+resColor+'">'+dispoRes+'</span> ';
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

function energyCreation(energyCreated) {
    let energyComp = playerInfos.comp.energ;
    if (energyComp === 3) {
        energyComp = 4;
    }
    energyCreated = Math.round(energyCreated*(energyComp+6)/6);
    return energyCreated;
};

function scrapCreation(scrapCreated) {
    let triComp = playerInfos.comp.tri;
    if (playerInfos.bldList.includes('Recyclab')) {
        triComp = triComp+3;
    } else if (playerInfos.bldList.includes('Centre de tri')) {
        triComp = triComp+1.5;
    }
    if (!playerInfos.bldList.includes('Décharge')) {
        triComp = triComp-1.5;
    } else if (playerInfos.onShip || hasScraptruck) {
        triComp = triComp+1;
    }
    scrapCreated = Math.ceil(scrapCreated*(triComp+3)/3);
    return scrapCreated;
};

function cramPower(res,neededRes) {
    let energyComp = playerInfos.comp.energ;
    if (energyComp === 3) {
        energyComp = 4;
    }
    neededRes = Math.round(neededRes/(energyComp+13)*13);
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
