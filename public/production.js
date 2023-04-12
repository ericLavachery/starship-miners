function prodDrop(bat,batType,prod,rnd) {
    droppedProd = prod;
    droppedProd = droppedProd*bat.squadsLeft/batType.squads;
    if (bat.apLeft < bat.ap-4) {
        droppedProd = droppedProd*bat.apLeft/bat.ap;
    }
    if (bat.soins != undefined) {
        if (bat.soins > 10) {
            droppedProd = droppedProd*(50-bat.soins)/50;
        }
    }
    if (rnd) {
        droppedProd = Math.ceil(droppedProd);
    }
    return droppedProd;
};

function getTileHeat(tile) {
    let tileHeat = (tile.seed*2)+7;
    if (tile.seed >= 7) {
        tileHeat = tile.seed+4;
    }
    let zoneHeat = Math.ceil((zone[0].seed+1)*(zone[0].seed+1)/1.6)+1;
    if (zone[0].seed >= 7) {
        zoneHeat = zone[0].seed+4;
    }
    if (zone[0].planet === 'Horst') {
        zoneHeat = zoneHeat*3;
        tileHeat = tileHeat*5;
    }
    tileHeat = Math.round((zoneHeat+zoneHeat+tileHeat)/3);
    return tileHeat;
};

function getTileEnergy(tile) {
    let magmaHere = 0;
    if (tile.rs != undefined) {
        if (tile.rs.Magma >= 1) {
            magmaHere = tile.rs.Magma+100;
        }
    }
    let tileHeat = getTileHeat(tile);
    let energyProd = Math.ceil(magmaHere/2*3)+(tileHeat*10);
    energyProd = Math.ceil(energyProd/10);
    return energyProd;
};

function geoProd(bat,batType) {
    console.log('UPKEEP');
    console.log(batType.name);
    let tile = getTileById(bat.tileId);
    let tileHeat = getTileHeat(tile);
    let upkeepPaid = true;
    let resShortage = [];
    if (batType.upkeep != undefined) {
        Object.entries(batType.upkeep).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let dispoRes = getDispoRes(key);
            if (dispoRes < value) {
                upkeepPaid = false;
                resShortage.push(key);
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
            upkeepNotPaid(bat,batType,resShortage);
        }
    }
    if (upkeepPaid) {
        let magmaHere = 0;
        if (tile.rs != undefined) {
            if (tile.rs.Magma >= 1) {
                magmaHere = tile.rs.Magma;
            }
        }
        let energyProd = Math.ceil(magmaHere/2*3)+(tileHeat*10);
        energyProd = energyCreation(energyProd);
        energyProd = prodDrop(bat,batType,energyProd,false);
        energyProd = Math.ceil(energyProd/10);
        resAddToBld('Energie',energyProd,bat,batType,false);
        if (!playerInfos.onShip) {
            if (minedThisTurn['Energie'] === undefined) {
                minedThisTurn['Energie'] = energyProd;
            } else {
                minedThisTurn['Energie'] = minedThisTurn['Energie']+energyProd;
            }
        }
        console.log('prod = Energons:'+energyProd);
    }
};

function getGeoProd(tile) {
    let magmaHere = 0;
    let tileHeat = getTileHeat(tile);
    if (tile.rs != undefined) {
        if (tile.rs.Magma >= 1) {
            magmaHere = tile.rs.Magma+100;
        }
    }
    let energyProd = Math.ceil(magmaHere/2*3)+(tileHeat*10);
    energyProd = energyCreation(energyProd);
    energyProd = Math.ceil(energyProd/10);
    return energyProd;
};

function cramProd(bat,batType,time,sim,quiet) {
    let crameur = getCramProd(bat,batType);
    let message = '';
    if (crameur.res != 'None') {
        let key = crameur.res;
        let value = crameur.cost;
        let conso = value*time;
        modWeekRes(key,0-conso);
        if (!sim) {
            resSub(key,conso);
        }
        message = message+key+':<span class="rose">-'+conso+'</span><br>';
        energyProd = energyCreation(crameur.prod*time);
        energyProd = prodDrop(bat,batType,energyProd,true);
        modWeekRes('Energie',energyProd);
        if (!sim) {
            resAdd('Energie',energyProd);
        }
        message = message+'Energie:<span class="vert">+'+energyProd+'</span><br>';
    } else {
        message = message+'Le crameur ne produit que si vous avez un surplus de carburant.<br>';
    }
    if (!quiet) {
        warning(batType.name,message,true);
    }
};

function getCramProd(bat,batType) {
    let crameur = {};
    crameur.cost = 0;
    crameur.res = 'None';
    crameur.prod = 0;
    let dispoRes = getDispoRes('Bois');
    if (dispoRes >= playerInfos.citz.total*3) {
        let res = getResByName('Bois');
        crameur.cost = Math.ceil(res.energie*1.4);
        crameur.res = res.name;
        crameur.prod = 16;
    } else {
        dispoRes = getDispoRes('Hydrocarbure');
        if (dispoRes >= playerInfos.citz.total*3) {
            let res = getResByName('Hydrocarbure');
            crameur.cost = Math.ceil(res.energie*1.4);
            crameur.res = res.name;
            crameur.prod = 16;
        } else {
            dispoRes = getDispoRes('Fuel');
            if (dispoRes >= playerInfos.citz.total*2) {
                let res = getResByName('Fuel');
                crameur.cost = Math.ceil(res.energie*1.4);
                crameur.res = res.name;
                crameur.prod = 16;
            }
        }
    }
    if (batType.name === 'Incinérateur') {
        crameur.prod = crameur.prod*2;
    }
    return crameur;
};

function gasProd(bat,batType) {
    console.log('UPKEEP');
    console.log(batType.name);
    let tile = getTileById(bat.tileId);
    let upkeepPaid = true;
    let resShortage = [];
    if (!playerInfos.onShip && zone[0].planet != 'Horst') {
        if (batType.upkeep != undefined) {
            Object.entries(batType.upkeep).map(entry => {
                let key = entry[0];
                let value = entry[1];
                let conso = value;
                let dispoRes = getDispoRes(key);
                if (dispoRes < conso) {
                    upkeepPaid = false;
                    resShortage.push(key);
                }
            });
            if (upkeepPaid) {
                Object.entries(batType.upkeep).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    let conso = value;
                    resSub(key,conso);
                });
            } else {
                upkeepNotPaid(bat,batType,resShortage);
            }
        }
        if (upkeepPaid) {
            let planetAir = getAtmo(false);
            Object.entries(planetAir).map(entry => {
                let key = entry[0];
                let value = entry[1];
                let fullProd = value;
                if (hasEquip(bat,['g2cryo'])) {
                    fullProd = fullProd*2;
                }
                fullProd = prodDrop(bat,batType,fullProd,false);
                if (fullProd < 1) {
                    let prodChance = Math.floor(100*fullProd);
                    if (rand.rand(1,100) <= prodChance) {
                        fullProd = 1;
                    } else {
                        fullProd = 0;
                    }
                } else {
                    fullProd = Math.round(fullProd);
                }
                if (fullProd >= 1) {
                    resAddToBld(key,fullProd,bat,batType,false);
                    if (minedThisTurn[key] === undefined) {
                        minedThisTurn[key] = fullProd;
                    } else {
                        minedThisTurn[key] = minedThisTurn[key]+fullProd;
                    }
                    console.log('prod = '+key+':'+fullProd);
                }
            });
        }
    }
};

function getAtmo(g2) {
    let planetAir = {};
    let mult = 1;
    if (g2) {
        mult = 2;
    }
    if (zone[0].planet === 'Dom') {
        planetAir['Oxygène'] = 4*mult;
        planetAir['Argon'] = 0.2*mult;
        planetAir['Azote'] = 10*mult;
    }
    if (zone[0].planet === 'Sarak') {
        planetAir['Oxygène'] = 4*mult;
        planetAir['Argon'] = 1*mult;
        planetAir['Azote'] = 9*mult;
        planetAir['Hélium'] = 0.5*mult;
    }
    if (zone[0].planet === 'Gehenna') {
        planetAir['Oxygène'] = 3*mult;
        planetAir['Azote'] = 3*mult;
        planetAir['Chlore'] = 4*mult;
        planetAir['Hélium'] = 1*mult;
        planetAir['Atium'] = 4*mult;
    }
    if (zone[0].planet === 'Kzin') {
        planetAir['Oxygène'] = 1*mult;
        planetAir['Argon'] = 3*mult;
        planetAir['Azote'] = 4*mult;
        planetAir['Hélium'] = 6*mult;
    }
    if (zone[0].planet === 'Horst') {
        planetAir['Oxygène'] = 3*mult;
        planetAir['Argon'] = 1*mult;
        planetAir['Azote'] = 9*mult;
        planetAir['Hélium'] = 1*mult;
        planetAir['Phosphore'] = 1*mult;
    }
    return planetAir;
};

function solarProd(bat,batType,time,sim,quiet) {
    console.log('UPKEEP');
    console.log(batType.name);
    let tile = getTileById(bat.tileId);
    let upkeepPaid = true;
    let resShortage = [];
    let message = '';
    if (!zone[0].dark) {
        if (batType.upkeep != undefined) {
            Object.entries(batType.upkeep).map(entry => {
                let key = entry[0];
                let value = entry[1];
                let conso = value*time;
                let dispoRes = getDispoRes(key);
                if (dispoRes < conso) {
                    upkeepPaid = false;
                    resShortage.push(key);
                    message = message+key+':<span class="hrouge">pénurie!</span><br>';
                }
            });
            if (upkeepPaid) {
                Object.entries(batType.upkeep).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    let conso = value*time;
                    if (playerInfos.onShip) {
                        modWeekRes(key,0-conso);
                    }
                    if (!sim) {
                        resSub(key,conso);
                    }
                    message = message+key+':<span class="rose">-'+conso+'</span><br>';
                    console.log('upkeep = '+key+':'+conso);
                });
            } else {
                if (!sim) {
                    upkeepNotPaid(bat,batType,resShortage);
                }
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
                energyProd = Math.ceil(energyProd*zone[0].ensol/150);
            }
            energyProd = prodDrop(bat,batType,energyProd,false);
            energyProd = energyCreation(energyProd);
            if (playerInfos.onShip) {
                modWeekRes('Energie',energyProd);
            }
            if (!sim) {
                if (playerInfos.onShip) {
                    resAdd('Energie',energyProd);
                } else {
                    resAddToBld('Energie',energyProd,bat,batType,false);
                }
            }
            message = message+'Energie:<span class="vert">+'+energyProd+'</span><br>';
            if (!playerInfos.onShip) {
                if (minedThisTurn['Energie'] === undefined) {
                    minedThisTurn['Energie'] = energyProd;
                } else {
                    minedThisTurn['Energie'] = minedThisTurn['Energie']+energyProd;
                }
            }
            console.log('prod = Energie:'+energyProd);
        }
        if (playerInfos.onShip) {
            if (!quiet) {
                warning(batType.name,message,true);
            }
        }
    }
};

function getSolarProd(tile) {
    let energyProd = 60;
    if (!playerInfos.onShip) {
        energyProd = 60;
        if (tile.terrain === 'P') {
            energyProd = 75;
        } else if (tile.terrain === 'F') {
            energyProd = 37;
        }
        energyProd = Math.ceil(energyProd*zone[0].ensol/150);
    }
    energyProd = energyCreation(energyProd);
    return energyProd;
};

function solarPanel(bat,batType) {
    console.log('********** psol prod **********');
    console.log(batType.name);
    let tile = getTileById(bat.tileId);
    if (!zone[0].dark && bat.fuzz > -2) {
        let energyProd = rand.rand(6,8);
        if (tile.terrain === 'P' || tile.terrain === 'M') {
            energyProd = rand.rand(9,12);
        } else if (tile.terrain === 'F') {
            energyProd = rand.rand(4,5);
        }
        energyProd = Math.floor(energyProd*zone[0].ensol/pansolFactor);
        if (hasEquip(bat,['psol'])) {
            energyProd = Math.round(energyProd/2);
        }
        energyProd = prodDrop(bat,batType,energyProd,false);
        energyProd = energyCreation(energyProd);
        if (energyProd < 1) {
            energyProd = 1;
        }
        if (playerInfos.onShip) {
            resAdd('Energie',energyProd);
        } else {
            resAddToBld('Energie',energyProd,bat,batType,false);
        }
        if (!playerInfos.onShip) {
            if (minedThisTurn['Energie'] === undefined) {
                minedThisTurn['Energie'] = energyProd;
            } else {
                minedThisTurn['Energie'] = minedThisTurn['Energie']+energyProd;
            }
        }
        console.log('psol ('+bat.type+') = Energie:'+energyProd);
    }
};

function triProd(bat,batType,time,sim,quiet) {
    console.log('UPKEEP');
    console.log(batType.name);
    let upkeepPaid = true;
    let resShortage = [];
    let message = '';
    if (batType.upkeep != undefined) {
        Object.entries(batType.upkeep).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let conso = value*time;
            if (hasEquip(bat,['prodboost'])) {
                conso = Math.round(conso*1.5);
            }
            let dispoRes = getDispoRes(key);
            if (dispoRes < conso) {
                upkeepPaid = false;
                resShortage.push(key);
                message = message+key+':<span class="hrouge">pénurie!</span><br>';
            }
        });
        if (upkeepPaid) {
            Object.entries(batType.upkeep).map(entry => {
                let key = entry[0];
                let value = entry[1];
                let conso = value*time;
                if (hasEquip(bat,['prodboost'])) {
                    conso = Math.round(conso*1.5);
                }
                if (playerInfos.onShip) {
                    modWeekRes(key,0-conso);
                }
                if (!sim) {
                    resSub(key,conso);
                }
                message = message+key+':<span class="rose">-'+conso+'</span><br>';
                console.log('upkeep = '+key+':'+conso);
            });
        } else {
            if (!sim) {
                upkeepNotPaid(bat,batType,resShortage);
            }
        }
    }
    if (upkeepPaid) {
        resTypes.forEach(function(res) {
            let resProd = 0;
            let resFactor = 0;
            if (res.rlab != undefined) {
                let scrapLevel = 2;
                if (res.bld != 'Derrick') {
                    if (res.cramBld === undefined && res.rlab >= 4) {
                        if (res.rlab >= 7 || res.rarity >= 20) {
                            scrapLevel = 1;
                        }
                    }
                    if (res.level === 1 || res.level === 4) {
                        scrapLevel = 1;
                    }
                }
                if (batType.name === 'Recyclab') {
                    resFactor = (res.rlab+playerInfos.comp.tri-3)*2.5;
                } else if (scrapLevel === 1) {
                    resFactor = res.rlab+playerInfos.comp.tri-3;
                }
                if (res.name === 'Fuel' || res.name === 'Nourriture') {
                    resFactor = resFactor/10;
                }
                if (res.bld === 'Derrick') {
                    resFactor = resFactor/2;
                }
            }
            if (resFactor >= 1) {
                let resNum = Math.round(time*resFactor/rand.rand(9,12)/2);
                console.log(res.name);
                console.log('resNum: '+resNum);
                if (resNum >= 3) {
                    resProd = resNum;
                } else {
                    let resChance = Math.round(100*resFactor/30*time/3);
                    console.log('resChance: '+resChance+'%');
                    if (rand.rand(1,100) <= resChance) {
                        resProd = 3;
                    }
                }
            }
            if (resProd >= 1) {
                resProd = scrapRecup(resProd);
                resProd = prodDrop(bat,batType,resProd,true);
                if (hasEquip(bat,['prodboost'])) {
                    resProd = Math.round(resProd*1.5);
                }
                // resAdd(res.name,resProd);
                if (playerInfos.onShip) {
                    modWeekRes(res.name,resProd);
                }
                if (!sim) {
                    if (playerInfos.onShip) {
                        resAdd(res.name,resProd);
                    } else {
                        resAddToBld(res.name,resProd,bat,batType,false);
                    }
                }
                message = message+res.name+':<span class="vert">+'+resProd+'</span><br>';
                if (!playerInfos.onShip) {
                    if (minedThisTurn[res.name] === undefined) {
                        minedThisTurn[res.name] = resProd;
                    } else {
                        minedThisTurn[res.name] = minedThisTurn[res.name]+resProd;
                    }
                }
                console.log('resProd: '+resProd);
            }
        });
    }
    if (playerInfos.onShip) {
        if (!quiet) {
            warning(batType.name,message,true);
        }
    }
};

function scrapRecup(resCreated) {
    let triComp = (playerInfos.comp.tri*playerInfos.comp.tri);
    resCreated = Math.ceil(resCreated*(triComp+3)/4*rand.rand(2,6)/4);
    return resCreated;
};

function upkeepAndProd(bat,batType,time,sim,quiet) {
    console.log('UPKEEP');
    console.log(batType.name);
    let upkeepPaid = true;
    let resShortage = [];
    let upkeepCheck = false;
    let message = '';
    if (bat.tags.includes('prodres') || batType.skills.includes('upnodis')) {
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
                if (hasEquip(bat,['prodboost'])) {
                    conso = Math.round(conso*1.5);
                }
                if (playerInfos.onShip) {
                    conso = Math.ceil(conso/upkeepVM);
                } else {
                    conso = Math.ceil(conso);
                }
                let dispoRes = getDispoRes(key);
                if (dispoRes < conso) {
                    upkeepPaid = false;
                    resShortage.push(key);
                    message = message+key+':<span class="hrouge">pénurie!</span><br>';
                }
            });
            if (upkeepPaid) {
                Object.entries(batType.upkeep).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    let conso = value*time;
                    if (hasEquip(bat,['prodboost'])) {
                        conso = Math.round(conso*1.5);
                    }
                    if (playerInfos.onShip) {
                        conso = Math.ceil(conso/upkeepVM);
                    } else {
                        conso = Math.ceil(conso);
                    }
                    if (playerInfos.onShip) {
                        modWeekRes(key,0-conso);
                    }
                    if (!sim) {
                        resSub(key,conso);
                    }
                    message = message+key+':<span class="rose">-'+conso+'</span><br>';
                    console.log('upkeep = '+key+':'+conso);
                });
            } else {
                if (!sim) {
                    upkeepNotPaid(bat,batType,resShortage);
                }
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
                    if (hasEquip(bat,['prodboost']) && key != 'Spins') {
                        fullProd = fullProd*2;
                    }
                    if (playerInfos.onShip) {
                        fullProd = fullProd/prodVM;
                    }
                    fullProd = prodDrop(bat,batType,fullProd,false);
                    if (key === 'Spins') {
                        fullProd = spinsCreation(fullProd);
                    }
                    if (key === 'Energie') {
                        fullProd = energyCreation(fullProd);
                    }
                    if (key === 'Scrap') {
                        fullProd = scrapCreation(fullProd);
                        if (playerInfos.onShip) {
                            fullProd = fullProd/5;
                        }
                    }
                    if (fullProd < 1) {
                        let prodChance = Math.floor(100*fullProd);
                        if (rand.rand(1,100) <= prodChance) {
                            fullProd = 1;
                        } else {
                            fullProd = 0;
                        }
                    } else {
                        fullProd = Math.round(fullProd);
                    }
                    if (fullProd >= 1) {
                        // resAdd(key,fullProd);
                        if (playerInfos.onShip) {
                            modWeekRes(key,fullProd);
                        }
                        if (!sim) {
                            if (playerInfos.onShip) {
                                resAdd(key,fullProd);
                            } else {
                                resAddToBld(key,fullProd,bat,batType,false);
                            }
                        }
                        message = message+key+':<span class="vert">+'+fullProd+'</span><br>';
                        if (!playerInfos.onShip) {
                            if (minedThisTurn[key] === undefined) {
                                minedThisTurn[key] = fullProd;
                            } else {
                                minedThisTurn[key] = minedThisTurn[key]+fullProd;
                            }
                        }
                        console.log('prod = '+key+':'+fullProd);
                    }
                });
            }
        }
    } else if (batType.skills.includes('prodres')) {
        if (!sim) {
            upkeepNotPaid(bat,batType,resShortage);
        }
    }
    if (playerInfos.onShip) {
        if (!quiet) {
            warning(batType.name,message,true);
        }
    }
};

function upkeepNotPaid(bat,batType,resShortage) {
    console.log('upkeep = non payée');
    if (playerInfos.onShip) {
        if (batType.skills.includes('updisable') && !bat.tags.includes('construction')) {
            bat.tags.push('construction');
        }
    } else {
        if (resShortage.length >= 1) {
            let message = 'Activité stoppée. Manque de: <span class="brun">'+toNiceString(resShortage)+'</span>';
            warning(batType.name,message,false,-1,false);
        }
    }
};
