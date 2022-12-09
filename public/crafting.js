function craftListSelect(selection) {
    craftList = selection;
    craftWindow(false);
};

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
    let lynkol = 'neutre';
    if (craftList === '#ALL') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#ALL`)">Tous</span>&nbsp;&middot;&nbsp;');
    if (craftList === '#1b1510') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#1b1510`)">Compo</span>&nbsp;&middot;&nbsp;');
    if (craftList === '#094949') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#094949`)">Electro</span>&nbsp;&middot;&nbsp;');
    if (craftList === '#2a2810') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#2a2810`)">Moteur</span>&nbsp;&middot;&nbsp;');
    if (craftList === '#000000') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#000000`)">Munitions</span>&nbsp;&middot;&nbsp;');
    if (craftList === '#2e1c2d') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#2e1c2d`)">Médical</span>&nbsp;&middot;&nbsp;');
    if (craftList === '#182a16') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#182a16`)">Nourriture</span>&nbsp;&middot;&nbsp;');
    if (craftList === '#1d0f30') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#1d0f30`)">Morphite</span>&nbsp;&middot;&nbsp;');
    if (craftList === '#002442') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#002442`)">Energie</span>&nbsp;&middot;&nbsp;');
    if (craftList === '#200808') {lynkol = 'cy';} else {lynkol = 'neutre';}
    $('#conUnitList').append('<span class="constMenu '+lynkol+' klik" onclick="craftListSelect(`#200808`)">Autres</span>');
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
        if (craft.bg === craftList || craftList === '#ALL') {
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
        }
    });
    if (craftList === '#002442' || craftList === '#ALL') {
        if (playerInfos.bldList.includes('Crameur') || playerInfos.bldList.includes('Centrale nucléaire')) {
            let energyFactor = 100;
            let dispoRes = 0;
            let neededRes = 0;
            let indus = playerInfos.comp.ind;
            if (playerInfos.comp.ind === 3) {
                indus = 4;
            }
            let iHave = getDispoRes('Energie');
            let sortedResTypes = _.sortBy(_.sortBy(_.sortBy(resTypes,'rarity'),'cat'),'energie');
            // sortedResTypes.reverse();
            sortedResTypes.forEach(function(res) {
                if (res.energie > 0) {
                    let cramBld = 'Crameur';
                    if (res.cramBld != undefined) {
                        cramBld = res.cramBld;
                    }
                    if (playerInfos.bldList.includes(cramBld)) {
                        if (playerInfos.bldList.includes('Incinérateur') || (cramBld != 'Crameur' && cramBld != 'Incinérateur')) {
                            energyFactor = Math.round(50/Math.sqrt(res.energie)*(indus+6)/6)*5;
                        } else {
                            energyFactor = Math.round(37/Math.sqrt(res.energie)*(indus+6)/6)*5;
                        }
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
    }
    if (craftList === '#1d0f30') {
        if (playerInfos.bldList.includes('Recyclab')) {
            let morphFactor = morphCreation(100);
            let doRes = 100;
            let neededRes = 35;
            let iHaveRes = 0;
            let iHaveMorph = getDispoRes('Morphite');
            let iHaveScrap = getDispoRes('Scrap');
            let iHaveWater = getDispoRes('Eau');
            let baseRes = 'Scrap';
            let iHaveTheBase = 0;
            let sortedResTypes = _.sortBy(_.sortBy(resTypes,'rarity'),'cat');
            // sortedResTypes.reverse();
            sortedResTypes.forEach(function(res) {
                if (res.name != 'Scrap' && res.name != 'Corps' && res.name != 'Eau' && res.name != 'Végétaux' && res.name != 'Bois' && res.name != 'Fruits' && res.name != 'Atium' && res.name != 'Octiron' && res.name != 'Magma' && res.cat != 'alien' && res.cat != 'transfo') {
                    iHaveRes = getDispoRes(res.name);
                    if (res.bld === 'Derrick') {
                        baseRes = 'Eau';
                        iHaveTheBase = iHaveWater;
                    } else {
                        baseRes = 'Scrap';
                        iHaveTheBase = iHaveScrap;
                    }
                    doRes = Math.ceil(Math.sqrt(res.rarity)*Math.sqrt(res.batch)/res.equiv*2*morphFactor/100)*5;
                    if (doRes > 100) {
                        neededRes = Math.ceil(neededRes*500/(doRes+400));
                        doRes = 100;
                    }
                    let triReq = 0;
                    if (res.name === 'Uridium') {
                        triReq = 3;
                    } else if (res.rarity <= 7) {
                        triReq = 2;
                    } else if (res.equiv > 1 || res.batch <= 3) {
                        triReq = 1;
                    }
                    $('#conUnitList').append('<div class="morphBlock" id="morph'+res.id+'"></div>');
                    if (iHaveMorph >= neededRes && iHaveTheBase >= doRes && triReq <= playerInfos.comp.tri && playerInfos.crafts < maxCrafts) {
                        $('#morph'+res.id).append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        $('#morph'+res.id).append('<span class="craftsList cy klik" onclick="doMorphCraft(`'+res.name+'`,'+doRes+',`'+baseRes+'`,'+neededRes+')">'+doRes+' '+res.name+' <span class="brunf">('+iHaveRes+')</span></span><br>');
                    } else {
                        $('#morph'+res.id).append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        $('#morph'+res.id).append('<span class="craftsList gf">'+doRes+' '+res.name+'</span><br>');
                    }
                    if (iHaveMorph >= neededRes) {
                        $('#morph'+res.id).append('<span class="craftsList gf">Morphite:<span class="bleu">'+neededRes+'</span>/<span class="vert">'+iHaveMorph+'</span></span>');
                    } else {
                        $('#morph'+res.id).append('<span class="craftsList gf">Morphite:<span class="rouge">'+neededRes+'</span>/<span class="vert">'+iHaveMorph+'</span></span>');
                    }
                    if (iHaveTheBase >= doRes) {
                        $('#morph'+res.id).append('<span class="craftsList gf">'+baseRes+':<span class="bleu">'+doRes+'</span>/<span class="vert">'+iHaveScrap+'</span></span><br>');
                    } else {
                        $('#morph'+res.id).append('<span class="craftsList gf">'+baseRes+':<span class="rouge">'+doRes+'</span>/<span class="vert">'+iHaveScrap+'</span></span><br>');
                    }
                    $('#morph'+res.id).append('<span class="craftsList bleu">Recyclab</span><br>');
                    if (triReq >= 1) {
                        if (triReq <= playerInfos.comp.tri) {
                            $('#morph'+res.id).append('<span class="craftsList bleu">tri:'+triReq+'</span><br>');
                        } else {
                            $('#morph'+res.id).append('<span class="craftsList rouge">tri:'+triReq+'</span><br>');
                        }
                    }
                    $('#morph'+res.id).append('<hr class="craft">');
                }
            });
        }
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
        craftFactor = craftFactor*(100+playerInfos.crime)/100;
        let energyCrafting = false;
        if (craft.result === 'Energie') {
            energyCrafting = true;
        }
        let scrapCrafting = false;
        let morphCrafting = false;
        if (craft.result === 'Scrap') {
            scrapCrafting = true;
        }
        if (craft.cost['Scrap'] != undefined) {
            scrapCrafting = true;
        }
        if (craft.cost['Morphite'] != undefined) {
            morphCrafting = true;
        }
        // ENERGIE
        if (energyCrafting) {
            let energyFactor = energyCreation(100)/100;
            craftFactor = craftFactor/energyFactor;
        }
        // INDUSTRIE
        if (playerInfos.comp.ind >= 1 && playerInfos.bldList.includes('Atelier') && !energyCrafting && !morphCrafting) {
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
            if (scrapCrafting || morphCrafting) {
                let recupLevel = playerInfos.comp.tri;
                if (playerInfos.bldList.includes('Recyclab') && !craft.bldReq.includes('Recyclab')) {
                    recupLevel = recupLevel+1;
                }
                if (craft.compReq['tri'] != undefined) {
                    recupLevel = recupLevel-craft.compReq['tri'];
                }
                if (recupLevel >= 1) {
                    if (playerInfos.comp.tri === 4 && playerInfos.bldList.includes('Recyclab')) {
                        if (morphCrafting) {
                            craftFactor = craftFactor*2/(2+recupLevel);
                        } else {
                            craftFactor = craftFactor*16/(16+recupLevel);
                        }
                    } else {
                        if (morphCrafting) {
                            craftFactor = craftFactor*6/(6+recupLevel);
                        } else {
                            craftFactor = craftFactor*16/(16+recupLevel);
                        }
                    }
                }
            }
        }
        // CONSTRUCTION
        if (playerInfos.comp.const >= 1) {
            if (!scrapCrafting) {
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

function doMorphCraft(creaResName,creaResNum,baseResName,morphNeed) {
    resSub(baseResName,creaResNum);
    resSub('Morphite',morphNeed);
    resAdd(creaResName,creaResNum);
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
    let energyComp = 0;
    if (playerInfos.comp.energ === 1) {
        energyComp = 2;
    } else if (playerInfos.comp.energ === 2) {
        energyComp = 3;
    } else if (playerInfos.comp.energ === 3) {
        energyComp = 5;
    }
    energyCreated = Math.round(energyCreated*(energyComp+5)/8);
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

function morphCreation(resCreated) {
    let triComp = Math.ceil(playerInfos.comp.tri*playerInfos.comp.tri/2);
    resCreated = Math.ceil(resCreated*(triComp+2)/3);
    return resCreated;
};

function cramPower(res,neededRes) {
    let energyComp = 0;
    if (playerInfos.comp.energ === 1) {
        energyComp = 2;
    } else if (playerInfos.comp.energ === 2) {
        energyComp = 3;
    } else if (playerInfos.comp.energ === 3) {
        energyComp = 5;
    }
    if (playerInfos.bldList.includes('Incinérateur')) {
        neededRes = neededRes/(energyComp+5)*8;
    } else {
        neededRes = neededRes/(energyComp+5)*10;
    }
    if (res.name === 'Huile' || res.name === 'Soufre' || res.name === 'Pyrus' || res.name === 'Pyratol' || res.name === 'Phosphore') {
        neededRes = Math.round(neededRes/(playerInfos.comp.pyro+7)*7);
    } else if (res.name === 'Scrap') {
        neededRes = Math.round(neededRes/(playerInfos.comp.tri+5)*5);
    } else if (res.bld === 'Comptoir') {
        neededRes = Math.round(neededRes/(playerInfos.comp.tri+9)*9);
    } else if (res.cat === 'alien') {
        neededRes = Math.round(neededRes/(playerInfos.comp.ca+10)*10);
    } else if (res.cat === 'transfo') {
        neededRes = Math.round(neededRes/(playerInfos.comp.tri+9)*9);
    } else {
        neededRes = Math.round(neededRes/(energyComp+10)*10);
    }
    return neededRes;
};
