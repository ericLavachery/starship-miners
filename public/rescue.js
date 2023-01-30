function checkRescue() {

};

// A FAIRE
// newRescue.event = "Epidémie";
// newRescue.map = -1;
// blocs lander
// gangXP !!!

// Effets DETECTION et VSP
// "Votre navette de secours n'a pas réussi à sauver gnagnagna"

function rescueComp() {
    let rescue = getRescueByName(rescueName);
    if (rescue.comp != undefined) {
        if (rescue.comp[0]) {
            checkRescueComp();
        }
        if (rescue.comp[1] >= 1) {
            let sciBat = getBatByName('Chercheurs');
            sciBat.sciRech = sciBat.sciRech+rescue.comp[1];
            warning('<span class="rose">Recherche</span>','<span class="vio">Points de recherche +'+rescue.comp[1]+'</span><br>',true);
        }
        if (rescue.comp[2] != '') {
            let foundComp = getCompByName(rescue.comp[2]);
            let compOK = isFoundCompOK(foundComp);
            if (compOK) {
                playerInfos.comp[foundComp.name] = playerInfos.comp[foundComp.name]+1;
                warning('<span class="rose">Compétence trouvée</span>','<span class="vio">'+foundComp.fullName+' +1 (maintenant au niveau '+playerInfos.comp[foundComp.name]+')</span><br>',true);
            }
        }
    }
};

function checkRescueComp() {
    let foundComp = {};
    let compOK = false;
    let i = 1;
    while (i <= 5) {
        foundComp = randomComp(7,28);
        compOK = isFoundCompOK(foundComp);
        if (compOK) {
            break;
        }
        if (i > 6) {break;}
        i++
    }
    if (compOK) {
        playerInfos.comp[foundComp.name] = playerInfos.comp[foundComp.name]+1;
        warning('<span class="rose">Compétence trouvée</span>','<span class="vio">'+foundComp.fullName+' +1 (maintenant au niveau '+playerInfos.comp[foundComp.name]+')</span><br>',true);
    }
}

function rescueUnits(rescueName) {
    ruinsEmpty = true;
    let rescue = getRescueByName(rescueName);
    if (rescue.cit != undefined) {
        ruinsEmpty = false;
        let newCitsNumber = 0;
        let i = 1;
        while (i <= rescue.cit[0]) {
            newCitsNumber = newCitsNumber+rand.rand(rescue.cit[1],rescue.cit[2]);
            if (i > 50) {break;}
            i++
        }
        let citId = 126;
        let citName = 'Citoyens';
        newCitsNumber = Math.ceil(newCitsNumber*playerInfos.cNeed);
        bonusCit(citId,souteId,newCitsNumber);
        playerInfos.allCits = playerInfos.allCits+newCitsNumber;
        warning('<span class="rose">Nouveaux citoyens</span>','<span class="vio">'+newCitsNumber+' '+citName+'</span><br>',true);
    }
    if (rescue.crim != undefined) {
        ruinsEmpty = false;
        let newCitsNumber = 0;
        let i = 1;
        while (i <= rescue.crim[0]) {
            newCitsNumber = newCitsNumber+rand.rand(rescue.crim[1],rescue.crim[2]);
            if (i > 50) {break;}
            i++
        }
        let citId = 225;
        let citName = 'Criminels';
        newCitsNumber = Math.ceil(newCitsNumber*playerInfos.cNeed);
        bonusCit(citId,souteId,newCitsNumber);
        playerInfos.allCits = playerInfos.allCits+newCitsNumber;
        warning('<span class="rose">Nouveaux citoyens</span>','<span class="vio">'+newCitsNumber+' '+citName+'</span><br>',true);
    }
    if (rescue.bat != undefined) {
        let numberOfBats = rand.rand(rescue.bat[1],rescue.bat[2]);
        let i = 1;
        while (i <= numberOfBats) {
            addRescueBat(rescue.bat[0],rescue.bat[3]);
            if (i > 10) {break;}
            i++
        }
        if (numberOfBats >= 2) {
            ruinsEmpty = false;
            warning('<span class="rose">Nouveaux bataillons</span>','<span class="vio">'+numberOfBats+' &times; '+rescue.bat[0]+'</span><br>',true);
        } else if (numberOfBats >= 1) {
            ruinsEmpty = false;
            warning('<span class="rose">Nouveau bataillon</span>','<span class="vio">'+rescue.bat[0]+'</span><br>',true);
        }
    }
    if (rescue.bat2 != undefined) {
        let numberOfBats = rand.rand(rescue.bat2[1],rescue.bat2[2]);
        let i = 1;
        while (i <= numberOfBats) {
            addRescueBat(rescue.bat2[0],rescue.bat2[3]);
            if (i > 10) {break;}
            i++
        }
        if (numberOfBats >= 2) {
            ruinsEmpty = false;
            warning('<span class="rose">Nouveaux bataillons</span>','<span class="vio">'+numberOfBats+' &times; '+rescue.bat2[0]+'</span><br>',true);
        } else if (numberOfBats >= 1) {
            ruinsEmpty = false;
            warning('<span class="rose">Nouveau bataillon</span>','<span class="vio">'+rescue.bat2[0]+'</span><br>',true);
        }
    }
    if (rescue.bat3 != undefined) {
        let numberOfBats = rand.rand(rescue.bat3[1],rescue.bat3[2]);
        let i = 1;
        while (i <= numberOfBats) {
            addRescueBat(rescue.bat3[0],rescue.bat3[3]);
            if (i > 10) {break;}
            i++
        }
        if (numberOfBats >= 2) {
            ruinsEmpty = false;
            warning('<span class="rose">Nouveaux bataillons</span>','<span class="vio">'+numberOfBats+' &times; '+rescue.bat3[0]+'</span><br>',true);
        } else if (numberOfBats >= 1) {
            ruinsEmpty = false;
            warning('<span class="rose">Nouveau bataillon</span>','<span class="vio">'+rescue.bat3[0]+'</span><br>',true);
        }
    }
};

function addRescueBat(unitName,soins) {
    let unitIndex = unitTypes.findIndex((obj => obj.name === unitName));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselTriche = true;
    let typeId = conselUnit.id;
    putBat(1463,0,0);
    let newBat = getBatByTypeIdAndTileId(typeId,1463);
    if (soins >= 25) {
        newBat.soins = rand.rand(15,soins);
    } else if (soins >= 1) {
        newBat.soins = rand.rand(0,soins);
    }
    loadBat(newBat.id,souteId);
}

function rescueRes(rescueName) {
    let rescue = getRescueByName(rescueName);
    if (rescue.demUnit != undefined) {
        rescue.demUnit.forEach(function(unitName) {
            let unit = getBatTypeByName(unitName);
            recupUnitRes(unit);
        });
    }
    if (rescue.demEquip != undefined) {
        rescue.demEquip.forEach(function(equipName) {
            let equip = getEquipByName(equipName);
            recupEquipRes(equip);
        });
    }
    if (rescue.resRuin != undefined) {
        let i = 1;
        while (i <= rescue.resRuin[0]) {
            checkRescueRes(rescue.resRuin[1]);
            if (i > 50) {break;}
            i++
        }
    }
    if (rescue.resBase != undefined) {
        let resMax = 0;
        let i = 1;
        while (i <= rescue.resBase[0]) {
            resMax = resMax+rand.rand(rescue.resBase[1],rescue.resBase[2]);
            if (i > 50) {break;}
            i++
        }
        checkRescueBaseRes(resMax);
    }
    if (rescue.resAlien != undefined) {
        let resMax = 0;
        let i = 1;
        while (i <= rescue.resAlien[0]) {
            resMax = resMax+rand.rand(rescue.resAlien[1],rescue.resAlien[2]);
            if (i > 50) {break;}
            i++
        }
        checkRescueAlienRes(resMax,rescue.resAlien[3]);
    }
    if (rescue.scrap != undefined) {
        let numScrap = rand.rand(rescue.scrap[0],rescue.scrap[1]);
        if (numScrap >= 1) {
            let coffre = getBatById(souteId);
            if (coffre.transRes['Scrap'] === undefined) {
                coffre.transRes['Scrap'] = numScrap;
            } else {
                coffre.transRes['Scrap'] = coffre.transRes['Scrap']+numScrap;
            }
        }
    }
    if (rescue.orb != undefined) {
        let numOrbs = rand.rand(rescue.orb[0],rescue.orb[1]);
        if (numOrbs >= 1) {
            let coffre = getBatById(souteId);
            if (coffre.transRes['Transorb'] === undefined) {
                coffre.transRes['Transorb'] = numOrbs;
            } else {
                coffre.transRes['Transorb'] = coffre.transRes['Transorb']+numOrbs;
            }
        }
    }
};

function checkRescueAlienRes(maxRes,rare) {
    console.log('Check Ressources Alien');
    let coffre = getBatById(souteId);
    let totalRes = 0;
    let thatResNum = 0;
    let resFactor;
    thatResNum = 10*(playerInfos.comp.ca+5)/7*rand.rand(8,13)*maxRes/666;
    thatResNum = Math.ceil(thatResNum*150/rescueRateDiv);
    console.log('!GET : Creatite '+thatResNum);
    if (coffre.transRes['Creatite'] === undefined) {
        coffre.transRes['Creatite'] = thatResNum;
    } else {
        coffre.transRes['Creatite'] = coffre.transRes['Creatite']+thatResNum;
    }
    totalRes = totalRes+thatResNum;
    let shufRes = _.shuffle(resTypes);
    shufRes.forEach(function(res) {
        if (totalRes < maxRes) {
            if (res.cat === 'alien' && res.name != 'Gibier') {
                let resFactor = res.rarity;
                let resOK = true;
                if (rare && resFactor > 30 && res.name != 'Creatite') {
                    resOK = false;
                }
                if (resOK) {
                    thatResNum = resFactor*res.batch*(playerInfos.comp.ca+5)/7*rand.rand(1,20)*maxRes/20000;
                    thatResNum = Math.ceil(thatResNum*150/rescueRateDiv);
                    if (thatResNum >= 5) {
                        console.log('!GET : '+res.name+' '+thatResNum);
                        if (coffre.transRes[res.name] === undefined) {
                            coffre.transRes[res.name] = thatResNum;
                        } else {
                            coffre.transRes[res.name] = coffre.transRes[res.name]+thatResNum;
                        }
                        totalRes = totalRes+thatResNum;
                    }
                }
            }
        }
    });
    if (totalRes < maxRes) {
        shufRes.forEach(function(res) {
            if (totalRes < maxRes) {
                if (res.cat === 'alien' && res.name != 'Gibier') {
                    let resFactor = res.rarity;
                    if (rare) {
                        resFactor = 50;
                    }
                    thatResNum = resFactor*res.batch*(playerInfos.comp.ca+5)/7*rand.rand(1,20)*maxRes/20000;
                    thatResNum = Math.ceil(thatResNum*150/rescueRateDiv);
                    if (thatResNum >= 5) {
                        console.log('!GET : '+res.name+' '+thatResNum);
                        if (coffre.transRes[res.name] === undefined) {
                            coffre.transRes[res.name] = thatResNum;
                        } else {
                            coffre.transRes[res.name] = coffre.transRes[res.name]+thatResNum;
                        }
                        totalRes = totalRes+thatResNum;
                    }
                }
            }
        });
    }
};

function checkRescueBaseRes(maxRes) {
    console.log('Check Ressources de Base');
    let coffre = getBatById(souteId);
    let totalRes = 0;
    let thatResNum = 0;
    let resFactor;
    let shufRes = _.shuffle(resTypes);
    shufRes.forEach(function(res) {
        if (totalRes < maxRes) {
            if (res.name != 'Magma' && res.cat != 'alien' && res.name != 'Fruits' && res.name != 'Végétaux' && res.name != 'Bois') {
                thatResNum = 0;
                if (res.name === 'Oxygène') {
                    resFactor = 40;
                } else if (res.name === 'Scrap') {
                    resFactor = 150;
                } else if (res.rarity >= 36) {
                    resFactor = res.rarity;
                } else {
                    resFactor = 0;
                }
                thatResNum = resFactor*res.batch*rand.rand(1,20)*maxRes/60000;
                thatResNum = Math.ceil(thatResNum*150/rescueRateDiv);
                if (thatResNum >= 20) {
                    console.log('!GET : '+res.name+' '+thatResNum);
                    if (coffre.transRes[res.name] === undefined) {
                        coffre.transRes[res.name] = thatResNum;
                    } else {
                        coffre.transRes[res.name] = coffre.transRes[res.name]+thatResNum;
                    }
                    totalRes = totalRes+thatResNum;
                }
            }
        }
    });
    if (totalRes < maxRes) {
        shufRes.forEach(function(res) {
            if (totalRes < maxRes) {
                if (res.name != 'Magma' && res.cat != 'alien' && res.name != 'Fruits' && res.name != 'Végétaux' && res.name != 'Bois') {
                    thatResNum = 0;
                    if (res.name === 'Oxygène') {
                        resFactor = 40;
                    } else if (res.name === 'Scrap') {
                        resFactor = 150;
                    } else if (res.rarity >= 36) {
                        resFactor = res.rarity;
                    } else {
                        resFactor = 0;
                    }
                    thatResNum = resFactor*res.batch*rand.rand(1,20)*maxRes/20000;
                    thatResNum = Math.ceil(thatResNum*150/rescueRateDiv);
                    if (thatResNum >= 20) {
                        console.log('!GET : '+res.name+' '+thatResNum);
                        if (coffre.transRes[res.name] === undefined) {
                            coffre.transRes[res.name] = thatResNum;
                        } else {
                            coffre.transRes[res.name] = coffre.transRes[res.name]+thatResNum;
                        }
                        totalRes = totalRes+thatResNum;
                    }
                }
            }
        });
    }
};

function checkRescueRes(diff) {
    console.log('Check Ressources Rescue');
    let coffre = getBatById(souteId);
    let totalRes = 0;
    let thatResChance = 0;
    let thatResNum = 0;
    let mapFactor = Math.round(((Math.sqrt(diff+2)*10)+diff)/8);
    let resFactor;
    resTypes.forEach(function(res) {
        if (res.name != 'Magma' && res.cat != 'alien') {
            thatResChance = 0;
            thatResNum = 0;
            resFactor = res.rarity+Math.round(diff*3);
            if (res.name === 'Corps') {
                if (ruinsEmpty) {
                    thatResChance = Math.ceil(resFactor*5*res.batch/3);
                } else {
                    thatResChance = Math.ceil(resFactor*1*res.batch/3);
                }
            } else if (res.name == 'Scrap') {
                thatResChance = Math.ceil(resFactor*5*res.batch/3);
            } else if (res.name == 'Nourriture') {
                if (ruinsEmpty) {
                    thatResChance = Math.ceil(resFactor*res.batch/3);
                } else {
                    thatResChance = Math.ceil(resFactor*5*res.batch/3);
                }
            } else if (res.name.includes('Compo')) {
                thatResChance = Math.ceil((resFactor-100)*1.7*res.batch/3);
            } else if (res.cat == 'transfo') {
                if (res.name != 'Transorb' && res.name != 'Energie' && res.name != 'Energons' && res.name != 'Spins') {
                    thatResChance = Math.ceil(resFactor*1.7*res.batch/3);
                }
            } else {
                if (res.name === 'Huile') {
                    thatResChance = Math.ceil(150*res.batch/3);
                } else if (res.name === 'Eau') {
                    if (ruinsEmpty) {
                        thatResChance = Math.ceil(50*res.batch/3);
                    } else {
                        thatResChance = Math.ceil(200*res.batch/3);
                    }
                } else {
                    thatResChance = Math.ceil(resFactor/3*res.batch/3);
                }
                if (res.cat === 'blue') {
                    thatResChance = Math.ceil(thatResChance/2*mapFactor/8);
                } else if (res.cat === 'blue-sky') {
                    thatResChance = Math.ceil(thatResChance/1.5*mapFactor/8);
                } else if (res.cat === 'sky') {
                    thatResChance = Math.ceil(thatResChance/2*mapFactor/8);
                }
            }
            thatResChance = Math.ceil(thatResChance*(playerInfos.comp.tri+6)/6);
            console.log(res.name+' '+thatResChance);
            if (rand.rand(1,1000) <= thatResChance) {
                thatResNum = Math.ceil(Math.sqrt(Math.sqrt(thatResChance))*mapFactor*1.5*rand.rand(4,16))+rand.rand(0,9);
                thatResNum = Math.ceil(thatResNum*150/rescueRateDiv);
                console.log('!GET : '+res.name+' '+thatResNum);
                if (coffre.transRes[res.name] === undefined) {
                    coffre.transRes[res.name] = thatResNum;
                } else {
                    coffre.transRes[res.name] = coffre.transRes[res.name]+thatResNum;
                }
                totalRes = totalRes+thatResNum;
            }
        }
    });
};

function recupEquipRes(equip) {
    let coffre = getBatById(souteId);
    let resRecup = getEquipResRecup(batType);
    if (resRecup != undefined) {
        Object.entries(resRecup).map(entry => {
            let key = entry[0];
            let value = entry[1];
            if (value >= 1) {
                let res = getResByName(key);
                if (res.cat === 'alien') {
                    if (playerInfos.alienRes[key] === undefined) {
                        playerInfos.alienRes[key] = value;
                    } else {
                        playerInfos.alienRes[key] = playerInfos.alienRes[key]+value;
                    }
                } else {
                    if (coffre.transRes[key] === undefined) {
                        coffre.transRes[key] = value;
                    } else {
                        coffre.transRes[key] = coffre.transRes[key]+value;
                    }
                }
            }
        });
    }
    coffreTileId = -1;
};

function getEquipResRecup(equip) {
    let resRecup = {};
    let recupFactor = 90;
    let bldFactor = 0;
    let index;
    if (playerInfos.comp.tri >= 1) {
        bldFactor = bldFactor+1;
    }
    recupFactor = Math.round(recupFactor*(bldFactor+playerInfos.comp.tri+1)/6);
    let totalRes = 0;
    // EQUIP FLATCOST x%
    if (equip.costs != undefined) {
        Object.entries(equip.costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            value = Math.ceil(value/100*recupFactor);
            if (value >= 1) {
                if (resRecup[key] === undefined) {
                    resRecup[key] = value;
                } else {
                    resRecup[key] = resRecup[key]+value;
                }
                totalRes = totalRes+value;
            }
        });
    }
    let scrapBonus = Math.floor(totalRes/10);
    if (resRecup['Scrap'] === undefined) {
        resRecup['Scrap'] = scrapBonus;
    } else {
        resRecup['Scrap'] = resRecup['Scrap']+scrapBonus;
    }
    return resRecup;
}

function recupUnitRes(batType) {
    let coffre = getBatById(souteId);
    let resRecup = getUnitResRecup(batType);
    if (resRecup != undefined) {
        Object.entries(resRecup).map(entry => {
            let key = entry[0];
            let value = entry[1];
            if (key != 'Végétaux') {
                if (value >= 1) {
                    let res = getResByName(key);
                    if (res.cat === 'alien') {
                        if (playerInfos.alienRes[key] === undefined) {
                            playerInfos.alienRes[key] = value;
                        } else {
                            playerInfos.alienRes[key] = playerInfos.alienRes[key]+value;
                        }
                    } else {
                        if (coffre.transRes[key] === undefined) {
                            coffre.transRes[key] = value;
                        } else {
                            coffre.transRes[key] = coffre.transRes[key]+value;
                        }
                    }
                }
            }
        });
    }
    coffreTileId = -1;
};

function getUnitResRecup(batType) {
    let resRecup = {};
    let recupFactor = 80;
    let bldFactor = 0;
    let index;
    if (playerInfos.comp.tri >= 1) {
        bldFactor = bldFactor+1;
    }
    recupFactor = Math.round(recupFactor*(bldFactor+playerInfos.comp.tri+1)/6);
    let totalRes = 0;
    // BAT FLATCOST x%
    if (batType.costs != undefined) {
        Object.entries(batType.costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            if (playerInfos.comp.const >= 1 && key === 'Compo1') {
                value = Math.floor(value*9/6);
            }
            if (playerInfos.comp.const >= 2 && key === 'Compo2') {
                value = Math.floor(value*9/6);
            }
            if (playerInfos.comp.const >= 3 && key === 'Compo3') {
                value = Math.floor(value*9/6);
            }
            if (key != 'Transorb' && key != 'Spins') {
                value = Math.ceil(value/100*recupFactor);
            } else {
                value = 0;
            }
            if (value >= 1) {
                if (resRecup[key] === undefined) {
                    resRecup[key] = value;
                } else {
                    resRecup[key] = resRecup[key]+value;
                }
                totalRes = totalRes+value;
            }
        });
    }
    // BAT DEPLOY x/3%
    if (batType.deploy != undefined) {
        Object.entries(batType.deploy).map(entry => {
            let key = entry[0];
            let value = entry[1];
            value = Math.floor(value/100*recupFactor/3);
            if (value >= 1) {
                if (resRecup[key] === undefined) {
                    resRecup[key] = value;
                } else {
                    resRecup[key] = resRecup[key]+value;
                }
                totalRes = totalRes+value;
            }
        });
    }
    // BAT PROD x*40
    if (batType.prod != undefined) {
        Object.entries(batType.prod).map(entry => {
            let key = entry[0];
            let value = entry[1];
            value = Math.floor(value*rand.rand(5,75));
            if (value >= 1) {
                if (resRecup[key] === undefined) {
                    resRecup[key] = value;
                } else {
                    resRecup[key] = resRecup[key]+value;
                }
                totalRes = totalRes+value;
            }
        });
    }
    let scrapBonus = Math.floor(totalRes/10);
    if (resRecup['Scrap'] === undefined) {
        resRecup['Scrap'] = scrapBonus;
    } else {
        resRecup['Scrap'] = resRecup['Scrap']+scrapBonus;
    }
    return resRecup;
}
