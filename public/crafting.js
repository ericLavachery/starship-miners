function craftWindow() {
    selectMode();
    batUnselect();
    updateBldList();
    findLanders();
    if (playerInfos.mapTurn >= 3) {
        calcEndRes(false);
    }
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","600px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    // $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    // $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="blockTitle"><h1>Crafting</h1></span>');
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');

    let craftFactor;
    let craftCostsList;
    let craftCompReqs;
    let craftOK = false;
    let compReqOK = false;
    let costOK = false;
    let bldOK = false;
    let oldCraft = false;
    crafting.forEach(function(craft) {
        craftOK = false;
        if (craft.creaNum === undefined) {
            craftFactor = 50;
        } else {
            craftFactor = craft.creaNum;
        }
        compReqOK = checkCompReq(craft);
        costOK = checkCraftCost(craft.id,craftFactor);
        bldOK = false;
        if ((playerInfos.bldList.includes(craft.bldReq[0]) || craft.bldReq[0] === undefined) && (playerInfos.bldList.includes(craft.bldReq[1]) || craft.bldReq[1] === undefined) && (playerInfos.bldList.includes(craft.bldReq[2]) || craft.bldReq[2] === undefined)) {
            bldOK = true;
            if (compReqOK) {
                if (costOK) {
                    craftOK = true;
                }
            }
        }
        oldCraft = checkOldCraft(craft);
        if ((compReqOK || playerInfos.pseudo === 'Test') && !oldCraft) {
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
        }
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
    let craftFactor = Math.ceil(number/craft.batch);
    craftFactor = getCraftFactor(craft,craftFactor);
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
    let craftFactor = Math.ceil(number/craft.batch);
    craftFactor = getCraftFactor(craft,craftFactor);
    Object.entries(craft.cost).map(entry => {
        let key = entry[0];
        let value = entry[1];
        value = value*craftFactor;
        resSub(key,value);
    });
    resAdd(craft.result,number);
    if (playerInfos.mapTurn >= 3) {
        // calcEndRes(false);
    }
    craftWindow();
};

function getCraftFactor(craft,craftFactor) {
    // INDUSTRIE
    if (playerInfos.comp.ind >= 1 && playerInfos.bldList.includes('Atelier')) {
        let indusLevel = playerInfos.comp.ind;
        if (playerInfos.bldList.includes('Usine')) {
            indusLevel = indusLevel+3;
        } else if (playerInfos.bldList.includes('Chaîne de montage')) {
            indusLevel = indusLevel+1;
        }
        craftFactor = Math.ceil(craftFactor*25/(25+indusLevel));
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
            if (playerInfos.bldList.includes('Recyclab') && !craft.bldReq.includes('Recyclab') && !playerInfos.bldList.includes('Soute')) {
                recupLevel = recupLevel+1;
            }
            if (craft.compReq['tri'] != undefined) {
                recupLevel = recupLevel-craft.compReq['tri'];
            }
            if (recupLevel >= 1) {
                craftFactor = Math.ceil(craftFactor*20/(20+recupLevel));
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
                    craftFactor = Math.ceil(craftFactor*15/(15+compoLevel));
                }
            }
        }
    }
    return craftFactor;
};

function doEnergyCraft(resName,neededRes,energyCreated) {
    resSub(resName,neededRes);
    resAdd('Energie',energyCreated);
    craftWindow();
};

function showCraftCost(craft,number) {
    let craftCostsList = ' ';
    let dispoRes;
    let craftFactor = Math.ceil(number/craft.batch);
    craftFactor = getCraftFactor(craft,craftFactor);
    Object.entries(craft.cost).map(entry => {
        let key = entry[0];
        let value = entry[1];
        value = value*craftFactor;
        dispoRes = getDispoRes(key);
        let resColor = 'vert';
        if (playerInfos.mapTurn >= 3) {
            if (playerInfos.endRes[key] != undefined) {
                if (playerInfos.endRes[key]-playerInfos.startRes[key] < value) {
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

function geoProd(bat,batType) {
    console.log('UPKEEP');
    console.log(batType.name);
    let tile = getTileById(bat.tileId);
    let upkeepPaid = true;
    if (tile.rs != undefined) {
        if (tile.rs.Magma >= 1) {
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
            if (upkeepPaid) {
                let energyProd = Math.ceil(tile.rs.Magma/3);
                energyProd = energyCreation(energyProd);
                resAdd('Energie',energyProd);
                console.log('prod = Energie:'+energyProd);
            }
        }
    }
};

function solarProd(bat,batType,time) {
    console.log('UPKEEP');
    console.log(batType.name);
    let tile = getTileById(bat.tileId);
    let upkeepPaid = true;
    if (!zone[0].dark) {
        if (batType.upkeep != undefined) {
            Object.entries(batType.upkeep).map(entry => {
                let key = entry[0];
                let value = entry[1];
                let conso = value*time;
                let dispoRes = getDispoRes(key);
                if (dispoRes < conso) {
                    upkeepPaid = false;
                }
            });
            if (upkeepPaid) {
                Object.entries(batType.upkeep).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    let conso = value*time;
                    resSub(key,conso);
                    console.log('upkeep = '+key+':'+conso);
                });
            } else {
                upkeepNotPaid(bat,batType);
            }
        }
        if (upkeepPaid) {
            let energyProd = 60*time;
            if (!playerInfos.onShip) {
                energyProd = rand.rand(35,85);
                if (tile.terrain === 'P') {
                    energyProd = rand.rand(45,105);
                } else if (tile.terrain === 'F') {
                    energyProd = rand.rand(22,53);
                }
                energyProd = Math.ceil(energyProd*zone[0].ensol/100);
            }
            energyProd = energyCreation(energyProd);
            resAdd('Energie',energyProd);
            console.log('prod = Energie:'+energyProd);
        }
    }
};

function solarPanel(bat,batType) {
    console.log('psol prod');
    console.log(batType.name);
    let tile = getTileById(bat.tileId);
    let upkeepPaid = true;
    if (!zone[0].dark && bat.fuzz > -2) {
        let energyProd = rand.rand(6,8);
        if (tile.terrain === 'P') {
            energyProd = rand.rand(9,12);
        } else if (tile.terrain === 'F') {
            energyProd = rand.rand(4,5);
        }
        energyProd = Math.floor(energyProd*zone[0].ensol/160);
        if (bat.eq === 'psol' || bat.logeq === 'psol') {
            energyProd = Math.round(energyProd/2);
        }
        energyProd = energyCreation(energyProd);
        resAdd('Energie',energyProd);
        console.log('prod = Energie:'+energyProd);
    }
};

function upkeepAndProd(bat,batType,time) {
    console.log('UPKEEP');
    console.log(batType.name);
    let upkeepPaid = true;
    let upkeepCheck = false;
    let message = '';
    if (bat.tags.includes('prodres')) {
        upkeepCheck = true;
    }
    if (batType.skills.includes('upkeep') && !batType.skills.includes('prodres')) {
        upkeepCheck = true;
    }
    if (upkeepCheck) {
        if (batType.upkeep != undefined && batType.skills.includes('upkeep')) {
            Object.entries(batType.upkeep).map(entry => {
                let key = entry[0];
                let value = entry[1];
                let conso = value*time;
                let dispoRes = getDispoRes(key);
                if (dispoRes < conso) {
                    upkeepPaid = false;
                    message = message+key+':<span class="rose">pénurie!</span><br>';
                }
            });
            if (upkeepPaid) {
                Object.entries(batType.upkeep).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    let conso = value*time;
                    resSub(key,conso);
                    if (playerInfos.onShip) {
                        message = message+key+':<span class="rose">-'+conso+'</span><br>';
                    }
                    console.log('upkeep = '+key+':'+conso);
                });
            } else {
                upkeepNotPaid(bat,batType);
            }
        } else {
            upkeepPaid = true;
        }
        if (batType.prod != undefined) {
            if (upkeepPaid) {
                Object.entries(batType.prod).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    let fullProd = value*time;
                    if (key === 'Energie') {
                        fullProd = energyCreation(fullProd);
                    }
                    if (key === 'Scrap') {
                        fullProd = scrapCreation(fullProd);
                        if (playerInfos.onShip) {
                            fullProd = Math.ceil(fullProd/5);
                        }
                    }
                    resAdd(key,fullProd);
                    if (playerInfos.onShip) {
                        message = message+key+':<span class="vert">+'+fullProd+'</span><br>';
                    }
                    if (!playerInfos.onShip) {
                        if (minedThisTurn[key] === undefined) {
                            minedThisTurn[key] = value;
                        } else {
                            minedThisTurn[key] = minedThisTurn[key]+value;
                        }
                    }
                    console.log('prod = '+key+':'+value);
                });
            }
        }
    } else if (batType.skills.includes('prodres')) {
        upkeepNotPaid(bat,batType);
    }
    if (playerInfos.onShip) {
        warning(batType.name,message,true);
    }
};

function upkeepNotPaid(bat,batType) {
    console.log('upkeep = non payée');
    if (playerInfos.onShip) {
        if (batType.skills.includes('updisable') && !bat.tags.includes('construction')) {
            bat.tags.push('construction');
        }
    } else {
        if (batType.skills.includes('updisable')) {
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
    }
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
        triComp = triComp+4;
    } else if (playerInfos.bldList.includes('Centre de tri')) {
        triComp = triComp+2;
    }
    if (!playerInfos.bldList.includes('Décharge')) {
        triComp = triComp-1.5;
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
