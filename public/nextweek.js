function events(afterMission,time,sim,quiet) {
    console.log('EVENTS: afterMission='+afterMission+' time='+time+' sim='+sim+' quiet='+quiet);
    afterMissionFirstReset();
    replacerSondes();
    if (!quiet) {
        if (playerInfos.alerte.title != undefined) {
            let bossDetect = (playerInfos.comp.det*2)+1;
            if (bossDetect < 4) {
                bossDetect = Math.ceil((bossDetect+4)/2);
            }
            if (playerInfos.alerte.turns >= 30) {
                let turnsBonus = (playerInfos.alerte.turns-30)/10;
                if (bossDetect < 6) {
                    bossDetect = 6;
                }
                bossDetect = bossDetect+turnsBonus;
            }
            let findChance = bossDetect*time;
            if (afterMission) {
                findChance = bossDetect*6;
            }
            findChance = Math.ceil(findChance);
            if (sim) {
                checkMissionAlert(false,true); // remind
            } else {
                if (rand.rand(1,100) <= findChance) {
                    checkMissionAlert(false,false);
                } else {
                    checkMissionAlert(false,true); // remind
                    if (afterMission) {
                        playerInfos.alerte.turns = playerInfos.alerte.turns+6;
                    } else {
                        playerInfos.alerte.turns = playerInfos.alerte.turns+time;
                    }
                }
            }
        }
    }
    checkReserve();
    updateBldList();
    resetWeekRes();
    if (afterMission) {
        time = playerInfos.mapTurn+playerInfos.travTurns;
    }
    if (afterMission && !sim) {
        let missionXP = calcTurnXP(playerInfos.mapTurn);
        playerInfos.gangXP = playerInfos.gangXP+missionXP;
    }
    if (!afterMission && !sim) {
        craftReset(time);
    }
    if (!sim) {
        repos(time);
    }
    if (!quiet) {
        if (sim) {
            warning('<h3>ESTIMATION</h3>','<span class="vert">'+Math.round(time/3)+' jours</span> passés<br>('+time+' tours)',false,-1,true);
        } else {
            warning('<h5>RAPPORT</h5>','<span class="vert">'+Math.round(time/3)+' jours</span> passés<br>('+time+' tours)',false,-1,true);
        }
    }
    eventCitoyens(time,sim,quiet);
    eventBodies(time,sim,quiet);
    eventProduction(afterMission,time,sim,quiet); // remove 'return' tag !!!
    eventBouffe(time,sim,quiet);
    eventCrime(time,sim,quiet,afterMission);
    eventAliens(time,sim,quiet);
    if (!sim) {
        autoResPurge();
    }
    console.log('RES BALANCE');
    console.log(playerInfos.weekRes);
    showResBallance(quiet);
    playerInfos.randSeed = rand.rand(1,8);
    if (!sim) {
        afterMissionReset(time);
    }
};

function afterMissionFirstReset() {
    playerInfos.mapDrop = 0;
    playerInfos.cocons = 0;
    playerInfos.fndCits = 0;
    playerInfos.sondeMaps = 0;
    playerInfos.eggPause = false;
    playerInfos.droppedEggs = 0;
    playerInfos.maxEggDrop = 0;
    playerInfos.maxEggPlay = 0;
    playerInfos.aliensKilled = 0;
    playerInfos.eggsKilled = 0;
    playerInfos.alienSat = 0;
    playerInfos.fuzzTotal = 0;
    playerInfos.pauseSeed = rand.rand(1,8);
    playerInfos.myCenter = 1830;
    playerInfos.undarkOnce = [];
    playerInfos.showedTiles = [];
};

function afterMissionReset(time) {
    bataillons.forEach(function(bat) {
        if (bat.tags.includes('return')) {
            tagDelete(bat,'return');
        }
    });
    playerInfos.allTurns = playerInfos.allTurns+time;
    playerInfos.mapTurn = 0;
    playerInfos.mapDrop = 0;
    playerInfos.cocons = 0;
    playerInfos.fndCits = 0;
    playerInfos.sondeMaps = 0;
    playerInfos.eggPause = false;
    playerInfos.droppedEggs = 0;
    playerInfos.maxEggDrop = 0;
    playerInfos.maxEggPlay = 0;
    playerInfos.aliensKilled = 0;
    playerInfos.eggsKilled = 0;
    playerInfos.alienSat = 0;
    playerInfos.fuzzTotal = 0;
    playerInfos.pauseSeed = rand.rand(1,8);
    playerInfos.myCenter = 1830;
    playerInfos.undarkOnce = [];
    playerInfos.showedTiles = [];
};

function calcTurnXP(turns) {
    let xp = 0;
    if (turns > 45) {
        let overTurns = turns-45;
        xp = 6.7+(overTurns*0.074);
    } else {
        xp = Math.sqrt(turns);
    }
    let xpf = calcXPFactor();
    xp = Math.round(xp*xpf);
    return xp;
};

function evalTurnXP(turns) {
    let xp = 0;
    if (turns > 45) {
        let overTurns = turns-45;
        xp = 6.7+(overTurns*0.074);
    } else {
        xp = Math.sqrt(turns);
    }
    let xpf = calcXPFactor();
    if (turns < 15) {
        xp = Math.round(xp*gangXPFactor);
    } else {
        xp = Math.round(xp*xpf);
    }
    return xp;
};

function calcXPFactor() {
    let doomClock = getDoom(false);
    // console.log('BASE ==================== '+gangXPFactor);
    // console.log('DOOM ==================== '+doomClock);
    let normClock = (playerInfos.gLevel-2)/2;
    // console.log('NORM ==================== '+normClock);
    let xpf = Math.round(gangXPFactor*(doomClock+5)/(normClock+5));
    // console.log('XPF ==================== '+xpf);
    playerInfos.doom = doomClock;
    playerInfos.xpf = xpf;
    return xpf;
};

function repos(time) {
    let woundHeal = 2;
    let stressHeal = 3+playerInfos.comp.med;
    let necroHeal = 2;
    if (playerInfos.bldList.includes('Salle de sport')) {
        stressHeal = stressHeal+3;
    }
    if (playerInfos.bldList.includes('Bar')) {
        stressHeal = stressHeal+1;
    }
    if (playerInfos.bldList.includes('Cabines')) {
        stressHeal = stressHeal+1;
    }
    if (playerInfos.bldList.includes('Jardin')) {
        stressHeal = stressHeal+3;
    }
    if (playerInfos.bldList.includes('Hôpital')) {
        stressHeal = stressHeal+7+playerInfos.comp.med;
        woundHeal = woundHeal+10+(playerInfos.comp.med*2);
        necroHeal = 100;
    } else if (playerInfos.bldList.includes('Infirmerie')) {
        stressHeal = stressHeal+2+playerInfos.comp.med;
        woundHeal = woundHeal+2+playerInfos.comp.med;
        necroHeal = necroHeal+2+playerInfos.comp.med;
    }
    bataillons.forEach(function(bat) {
        if (!bat.tags.includes('return')) {
            let batType = getBatType(bat);
            if (rand.rand(1,100) <= necroHeal*time) {
                tagDelete(bat,'necro');
            }
            if (bat.soins != undefined) {
                if (batType.cat === 'infantry' && !batType.skills.includes('clone') && !bat.tags.includes('necro')) {
                    bat.soins = bat.soins-Math.round(time*woundHeal/7);
                    if (bat.soins < 0) {
                        bat.soins = 0;
                    }
                }
            }
            if (bat.emo != undefined) {
                bat.emo = bat.emo-Math.round(time*stressHeal/36);
                if (bat.emo < 0) {
                    bat.emo = 0;
                }
            }
        }
    });
}

function eventProduction(afterMission,time,sim,quiet) {
    let mesCitoyens = calcTotalCitoyens(false);
    let population = mesCitoyens.crim+mesCitoyens.cit;
    let science = 0;
    let triFactor = playerInfos.comp.tri;
    if (playerInfos.bldList.includes('Décharge')) {
        triFactor = triFactor+1;
    }
    let scrapNum = Math.round(time*population/5000*3*(triFactor+5)/5);
    if (afterMission) {
        scrapNum = Math.round(scrapNum/5);
    }
    modWeekRes('Scrap',scrapNum);
    if (!sim) {
        resAdd('Scrap',scrapNum);
    }
    if (!quiet) {
        warning('Poubelles','Scrap:<span class="vert">+'+scrapNum+'</span><br>',true);
    }
    let sortedBats = bataillons.slice();
    sortedBats = _.sortBy(sortedBats,'type');
    sortedBats.reverse();
    // tags before
    sortedBats.forEach(function(bat) {
        if ((bat.loc === "zone" || bat.loc === "trans") && !bat.tags.includes('return')) {
            batType = getBatType(bat);
            if (batType.skills.includes('before')) {
                // PRODUCTION
                if (!playerInfos.onShip || !batType.skills.includes('nostatprod')) {
                    if (batType.skills.includes('upkeep') || batType.skills.includes('prodres') || batType.skills.includes('upnodis')) {
                        if (!bat.tags.includes('construction') || playerInfos.onShip) {
                            upkeepAndProd(bat,batType,time,sim,quiet);
                        }
                    }
                }
                if (batType.skills.includes('solar') && bat.tags.includes('prodres')) {
                    solarProd(bat,batType,time,sim,quiet);
                }
                if (batType.skills.includes('cram') && bat.tags.includes('prodres')) {
                    cramProd(bat,batType,time,sim,quiet);
                }
            }
        }
    });
    // others
    sortedBats.forEach(function(bat) {
        if ((bat.loc === "zone" || bat.loc === "trans") && !bat.tags.includes('return')) {
            batType = getBatType(bat);
            if (!batType.skills.includes('before')) {
                // PRODUCTION
                if (!playerInfos.onShip || !batType.skills.includes('nostatprod')) {
                    if (batType.skills.includes('upkeep') || batType.skills.includes('prodres') || batType.skills.includes('upnodis')) {
                        if (!bat.tags.includes('construction') || playerInfos.onShip) {
                            upkeepAndProd(bat,batType,time,sim,quiet);
                        }
                    }
                }
                if (batType.skills.includes('dogprod') && bat.tags.includes('prodres')) {
                    chenilProd(bat,batType,time,sim,quiet);
                }
                if (batType.skills.includes('solar') && bat.tags.includes('prodres')) {
                    solarProd(bat,batType,time,sim,quiet);
                }
                if (batType.skills.includes('transcrap') && bat.tags.includes('prodres')) {
                    triProd(bat,batType,time,sim,quiet);
                }
                // RECHERCHE
                if (!sim) {
                    if (bat.type === 'Chercheurs') {
                        rechercheSci(bat,time);
                    }
                }
                // ENTRAINEMENT
                if (!afterMission && !sim) {
                    if (playerInfos.bldList.includes('Camp d\'entraînement')) {
                        let trained = false;
                        if (batType.cat === 'infantry') {
                            trained = true;
                        } else if (batType.cat === 'vehicles') {
                            if (batType.size <= 15) {
                                if (batType.skills.includes('robot')) {
                                    if (hasEquip(bat,['g2ai'])) {
                                        trained = true;
                                    }
                                } else if (batType.skills.includes('cyber')) {
                                    trained = true;
                                }
                            }
                        }
                        if (trained) {
                            bat.xp = bat.xp+(time/4);
                            bat.xp = bat.xp.toFixedNumber(2);
                        }
                    }
                    if (playerInfos.bldList.includes('Salle de sport')) {
                        let trained = false;
                        if (batType.cat === 'infantry') {
                            trained = true;
                        } else if (batType.cat === 'vehicles') {
                            if (batType.size <= 15) {
                                if (batType.skills.includes('cyber')) {
                                    trained = true;
                                }
                            }
                        }
                        if (trained) {
                            bat.xp = bat.xp+(time/14);
                            bat.xp = bat.xp.toFixedNumber(2);
                        }
                    }
                }
            }
        }
        if (bat.tags.includes('return')) {
            tagDelete(bat,'return');
        }
    });
    // REEDUCATION
    if (playerInfos.bldList.includes('Camp de rééducation')) {
        let dispoCit = getDispoCit();
        let dispoCrim = getDispoCrim();
        let crimBatId = -1;
        let crimBat = {};
        let citBatId = -1;
        let citBat = {};
        let educMax = time*rand.rand(12,30);
        educMax = Math.round(educMax*(playerInfos.comp.ordre+2)*(playerInfos.comp.ordre+2)*Math.sqrt(mesCitoyens.crim)/9000);
        if (educMax >= mesCitoyens.crim-12) {
            educMax = mesCitoyens.crim-12;
        }
        if (educMax >= 1) {
            bataillons.forEach(function(bat) {
                if (bat.loc === 'trans' && bat.locId === souteId) {
                    if (bat.typeId === 225) {
                        crimBatId = bat.id;
                        crimBat = bat;
                    }
                    if (bat.typeId === 126) {
                        citBatId = bat.id;
                        citBat = bat;
                    }
                }
            });
            if (crimBatId >= 0 && citBatId >= 0) {
                if (educMax >= crimBat.citoyens-12) {
                    educMax = crimBat.citoyens-12;
                }
                if (educMax >= 1) {
                    if (!sim) {
                        crimBat.citoyens = crimBat.citoyens-educMax;
                        citBat.citoyens = citBat.citoyens+educMax;
                    }
                    if (!quiet) {
                        warning('Camp de rééducation',educMax+' criminels réhabilités.<br>',true);
                    }
                }
            }
        }
    }
};

function rechercheSci(bat,time) {
    if (bat.sciRech === undefined) {
        bat.sciRech = playerInfos.sciRech+rand.rand(0,300);
    }
    if (bat.eq.includes('sci-')) {
        let rechGang = getGangRechAdj();
        console.log('RECHERCHE');
        let rechCompName = bat.eq.replace('sci-','');
        console.log(rechCompName);
        let rechComp = getCompByName(rechCompName);
        warning('<span class="cy">RECHERCHE: ('+rechComp.fullName+')</span>','<span class="gfbleu">Points de recherche: '+bat.sciRech+'.</span><br>',true);
        console.log(rechComp);
        let rechCompOK = isFoundCompOK(rechComp);
        console.log(rechCompOK);
        if (rechCompOK) {
            let rechAdj = 1;
            if (rechGang.good.includes(rechComp.name)) {
                rechAdj = 0.85;
            } else if (rechGang.bad.includes(rechComp.name)) {
                rechAdj = 1.3;
            }
            let findChance = Math.round(time*rand.rand(14,18)/4/rechComp.rechCost*rechAdj);
            let findLimit = Math.round(2000*rechComp.rechCost*rechAdj);
            if (rand.rand(1,10000) <= findChance+bat.sciRech || bat.sciRech >= findLimit) {
                playerInfos.comp[rechCompName] = playerInfos.comp[rechCompName]+1;
                bat.sciRech = 0;
                bat.eq = 'aucun';
                warning('<span class="cy">RECHERCHE: Eureka!</span>','<span class="gfbleu">Vos chercheurs ont mis au point une compétence.<br>'+rechComp.fullName+' +1 (maintenant au niveau '+playerInfos.comp[rechComp.name]+')<br>Vous devez leur acheter du nouveau matériel (équipement) pour qu\'ils puissent continuer à travailler.</span><br>',true);
            } else {
                bat.sciRech = bat.sciRech+findChance;
            }
        } else {
            bat.eq = 'aucun';
            warning('<span class="hrouge">RECHERCHE: Matériel obsolète!</span>','<span class="gfbleu">Vous devez acheter du nouveau matériel (équipement) pour que vos chercheurs puissent travailler.</span><br>',true);
        }
    } else if (bat.eq === 'gang-lore') {
        let myCaserne = 'Caserne '+capitalizeFirstLetter(playerInfos.gang);
        if (playerInfos.bldVM.includes(myCaserne)) {
            playerInfos.gangXP = playerInfos.gangXP+Math.round(time/2.5);
        } else {
            playerInfos.gangXP = playerInfos.gangXP+Math.round(time/5);
        }
    } else {
        warning('<span class="hrouge">RECHERCHE: Chercheurs sans matériel!</span>','<span class="gfbleu">Vous devez leur acheter du matériel (équipement) pour qu\'ils puissent travailler.</span><br>',true);
    }
};

function eventDogs(time,sim,quiet,mesCitoyens) {
    let costFood = Math.ceil(mesCitoyens.dogs/3*time/60);
    let restFood = Math.ceil(costFood/1.5);
    let messageFood = 'OK';
    let allResEaten = 'Gibier';
    let resEaten = 'Gibier';
    let dispoRes = getDispoRes(resEaten);
    if (dispoRes >= restFood) {
        if (!sim) {
            resSub(resEaten,restFood);
        }
        modWeekRes(resEaten,0-restFood);
    } else {
        if (!sim) {
            resSub(resEaten,dispoRes);
        }
        modWeekRes(resEaten,0-dispoRes);
    }
    restFood = restFood-dispoRes;
    if (restFood >= 1) {
        restFood = Math.ceil(restFood*1.5);
        allResEaten = allResEaten+', Viande';
        resEaten = 'Viande';
        dispoRes = getDispoRes(resEaten);
        if (dispoRes >= restFood) {
            if (!sim) {
                resSub(resEaten,restFood);
            }
            modWeekRes(resEaten,0-restFood);
        } else {
            if (!sim) {
                resSub(resEaten,dispoRes);
            }
            modWeekRes(resEaten,0-dispoRes);
        }
        restFood = restFood-dispoRes;
    }
    if (restFood >= 1) {
        restFood = Math.ceil(restFood/1.5);
        allResEaten = allResEaten+', <span class="hrouge">Corps</span>';
        resEaten = 'Corps';
        dispoRes = getDispoRes(resEaten);
        if (dispoRes >= restFood) {
            if (!sim) {
                resSub(resEaten,restFood);
            }
            modWeekRes(resEaten,0-restFood);
        } else {
            if (!sim) {
                resSub(resEaten,dispoRes);
            }
            modWeekRes(resEaten,0-dispoRes);
        }
        restFood = restFood-dispoRes;
    }
    if (restFood >= Math.round(costFood/2)) {
        let citEaten = {};
        citEaten.num = rand.rand(1,Math.ceil(restFood/10));
        citEaten.type = 'Citoyens';
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+3;
            citEaten = getCitDeath('Citoyens',citEaten.num,true);
        }
        if (citEaten.num > 1) {
            messageFood = '<span class="hrouge">Carence grave<br>'+citEaten+' '+citEaten.type+' dévorés!</span>';
        } else {
            messageFood = '<span class="hrouge">Carence grave<br>1 citoyen dévoré!</span>';
        }
    } else if (restFood >= 1) {
        messageFood = '<span class="hrouge">Carence</span><br>Citoyens en danger!';
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+1;
        }
    }
    if (!quiet) {
        warning('Chiens',allResEaten+': <span class="rose">-'+costFood+'</span><br>'+messageFood+'<br>',true);
    }
};

function eventBouffe(time,sim,quiet) {
    let mesCitoyens = calcTotalCitoyens(true);
    let toutMesCitoyens = mesCitoyens.real+mesCitoyens.false;
    let bouffeCost = {};
    let recycleFactor = playerInfos.comp.tri+8;
    if (playerInfos.bldList.includes('Recyclab')) {
        recycleFactor = recycleFactor+4;
    }
    let energyFactor = playerInfos.comp.tri+8;
    let eatFactor = playerInfos.comp.med+8;
    let numIso = checkNumUnits('Isolation');
    let isoFactor = 1+((26-numIso)/13);
    bouffeCost['Nourriture'] = Math.round(toutMesCitoyens*time*2/297/eatFactor*8);
    bouffeCost['Eau'] = Math.round(toutMesCitoyens*time*2/234/recycleFactor*8);
    bouffeCost['Oxygène'] = Math.round(toutMesCitoyens*time*2/736/recycleFactor*8);
    bouffeCost['Energie'] = Math.round(Math.sqrt(toutMesCitoyens)*50*time*2/1408/energyFactor*8*isoFactor);
    // bouffeCost['Energie'] = Math.round(toutMesCitoyens*time*2/1408/energyFactor*8);
    console.log('CONSO !!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('time='+time);
    console.log('energyFactor='+energyFactor);
    console.log(mesCitoyens);
    console.log(bouffeCost);
    let plantesProd = 0;
    let bldHeat = 0;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        // Serres 1 emplacement
        if (bat.type === 'Serres hydroponiques') {
            if (!bat.tags.includes('construction')) {
                plantesProd = plantesProd+Math.round(15*time/21);
            } else {
                tagDelete(bat,'construction');
            }
        }
        // Jardin 2 emplacements mais 3x prod
        if (bat.type === 'Jardin') {
            if (!bat.tags.includes('construction')) {
                plantesProd = plantesProd+Math.round(50*time/21);
            } else {
                tagDelete(bat,'construction');
            }
        }
        if (batType.cat === 'buildings') {
            bldHeat = bldHeat+batType.hp;
        }
    });
    bouffeCost['Energie'] = bouffeCost['Energie']+Math.round(bldHeat/52/65*time*isoFactor);
    if (plantesProd >= 1) {
        if (!quiet) {
            warning('Serres et Jardins','Oxygène:<span class="vert">+'+plantesProd+'</span><br>(Déduit de la consommation)<br>',true);
        }
        if (bouffeCost['Oxygène'] > plantesProd) {
            bouffeCost['Oxygène'] = bouffeCost['Oxygène']-plantesProd;
        } else {
            bouffeCost['Oxygène'] = 0;
        }
    }
    let penuries = 0;
    let dispoFood = getDispoRes('Nourriture');
    let costFood = bouffeCost['Nourriture'];
    let messageFood = 'OK';
    if (dispoFood < costFood/2) {
        if (!sim) {
            penuries = penuries+5;
        }
        messageFood = '<span class="hrouge">Carence grave</span>';
    } else if (dispoFood < costFood) {
        if (!sim) {
            penuries = penuries+2;
        }
        messageFood = '<span class="hrouge">Carence</span>';
    }
    let dispoWater = getDispoRes('Eau');
    let costWater = bouffeCost['Eau'];
    let messageWater = 'OK';
    if (dispoWater < costWater/2) {
        if (!sim) {
            penuries = penuries+8;
        }
        messageWater = '<span class="hrouge">Carence grave</span>';
    } else if (dispoWater < costWater) {
        if (!sim) {
            penuries = penuries+2;
        }
        messageWater = '<span class="hrouge">Carence</span>';
    }
    let dispoAir = getDispoRes('Oxygène');
    let costAir = bouffeCost['Oxygène'];
    let messageAir = 'OK';
    if (dispoAir < costAir/2) {
        if (!sim) {
            penuries = penuries+12;
        }
        messageAir = '<span class="hrouge">Carence grave</span>';
    } else if (dispoAir < costAir) {
        if (!sim) {
            penuries = penuries+3;
        }
        messageAir = '<span class="hrouge">Carence</span>';
    }
    let dispoHeat = getDispoRes('Energie');
    let costHeat = bouffeCost['Energie'];
    let messageHeat = 'OK';
    if (dispoHeat < costHeat/2) {
        if (!sim) {
            penuries = penuries+3;
        }
        messageHeat = '<span class="hrouge">Carence grave</span>';
    } else if (dispoHeat < costHeat) {
        if (!sim) {
            penuries = penuries+1;
        }
        messageHeat = '<span class="hrouge">Carence</span>';
    }
    if (!quiet) {
        warning('Consommation','Nourriture: <span class="rose">-'+costFood+'</span><br>'+messageFood,true);
        warning('Consommation','Eau: <span class="rose">-'+costWater+'</span><br>'+messageWater,true);
        warning('Consommation','Oxygène: <span class="rose">-'+costAir+'</span><br>'+messageAir,true);
        warning('Consommation','Energie: <span class="rose">-'+costHeat+'</span><br>'+messageHeat+'<br>',true);
    }
    console.log(bouffeCost);
    modWeekMulti(bouffeCost);
    if (!sim) {
        payMaxCost(bouffeCost);
    }
    playerInfos.vitals = Math.floor(playerInfos.vitals*(penuries+5)/15);
    playerInfos.vitals = playerInfos.vitals+penuries;
    if (!sim) {
        hungerGames();
    }
    if (playerInfos.vitals >= 15) {
        let maxDead = Math.ceil((playerInfos.vitals-10)*time/20/(playerInfos.comp.med+6)*6);
        let minDead = Math.ceil(maxDead/3);
        let deadCits = {};
        deadCits.num = rand.rand(minDead,maxDead);
        deadCits.type = 'Citoyens';
        if (!sim) {
            deadCits = getCitDeath('Citoyens',deadCits.num,false);
        }
        if (!quiet) {
            if (deadCits.num > 1) {
                warning('Consommation','<span class="hrouge">Graves pénuries:<br>'+deadCits.num+' '+deadCits.type+' morts</span><br>',true);
            } else {
                warning('Consommation','<span class="hrouge">Graves pénuries:<br>1 citoyen mort</span><br>',true);
            }
        }
    }
    if (mesCitoyens.dogs >= 1) {
        eventDogs(time,sim,quiet,mesCitoyens);
    }
};

function hungerGames() {
    if (playerInfos.vitals >= 5) {
        let hungerDice = 100+(playerInfos.comp.med*10);
        bataillons.forEach(function(bat) {
            let batType = getBatType(bat);
            if (batType.crew >= 1) {
                if (!batType.skills.includes('robot')) {
                    let affected = true;
                    if (batType.skills.includes('transorbital')) {
                        affected = false;
                    }
                    if (batType.skills.includes('leader') || batType.skills.includes('prayer')) {
                        if (playerInfos.vitals < 75) {
                            affected = false;
                        }
                    }
                    if (batType.skills.includes('penitbat')) {
                        if (playerInfos.penit >= 10) {
                            if (playerInfos.vitals < 75) {
                                affected = false;
                            }
                        }
                    }
                    if (playerInfos.crime >= 15) {
                        if (batType.skills.includes('brigands')) {
                            if (playerInfos.vitals < 30) {
                                affected = false;
                            }
                        }
                    }
                    if (affected) {
                        if (rand.rand(1,hungerDice) <= playerInfos.vitals) {
                            if (bat.tags.includes('hungry')) {
                                bat.tags.push('dying');
                            } else {
                                bat.tags.push('hungry');
                            }
                        }
                    }
                }
            }
        });
    } else if (playerInfos.vitals >= 2) {
        bataillons.forEach(function(bat) {
            if (bat.tags.includes('dying')) {
                tagDelete(bat,'dying');
            }
        });
    } else {
        bataillons.forEach(function(bat) {
            if (bat.tags.includes('dying')) {
                tagDelete(bat,'dying');
            } else if (bat.tags.includes('hungry')) {
                tagDelete(bat,'hungry');
            }
        });
    }
};

function showResBallance(quiet) {
    if (playerInfos.weekRes != undefined) {
        let sortedWeekRes = [];
        for (var resName in playerInfos.weekRes) {
            sortedWeekRes.push([resName,playerInfos.weekRes[resName]]);
        }
        sortedWeekRes.sort(function(a,b) {
            return a[1] - b[1];
        });
        let sortedWRObject = {}
        sortedWeekRes.forEach(function(item){
            sortedWRObject[item[0]]=item[1]
        })
        let balMessage = '';
        Object.entries(sortedWRObject).map(entry => {
            let key = entry[0];
            let value = entry[1];
            if (value > 0) {
                balMessage = balMessage+key+':<span class="vert">+'+value+'</span><br>';
            } else if (value < 0) {
                balMessage = balMessage+key+':<span class="rose">'+value+'</span><br>';
            }
        });
        if (!quiet) {
            warning('Ballance',balMessage+'<br>',false,-1,true);
        }
    }
};

function eventCitoyens(time,sim,quiet) {
    let citNeed = getCitNeed();
    // let gangFacts = getGangFactors();
    console.log('$$$$$$$$$$$$$$$$$$$$$ citNeed = '+citNeed);
    let newCitsNumber = Math.floor(time*citNeed*rand.rand(10,18)*gangFacts.cit*(playerInfos.comp.med+30)*(playerInfos.comp.vsp+30)*navCitFactor/100000);
    let citId = 126;
    let citName = 'Citoyens';
    if (rand.rand(1,ruinsCrimChance) === 1) {
        citId = 225;
        citName = 'Criminels';
    } else {
        if (playerInfos.crime > 50) {
            newCitsNumber = 0;
        } else if (playerInfos.crime > 15) {
            newCitsNumber = Math.floor(newCitsNumber*15/playerInfos.crime);
        }
    }
    if (!sim && newCitsNumber >= 1) {
        bonusCit(citId,souteId,newCitsNumber);
        playerInfos.allCits = playerInfos.allCits+newCitsNumber;
    }
    if (!quiet) {
        warning('Navette de secours','<span class="vert">'+newCitsNumber+' '+citName+'</span> ont été récupérés par la navette de secours.<br>',true);
    }
};

function eventBodies(time,sim,quiet) {
    // let gangFacts = getGangFactors();
    let bodyCount = Math.floor(time*rand.rand(1,19)*gangFacts.bod*(playerInfos.comp.med+6)/140);
    if (bodyCount >= 5) {
        if (!sim) {
            resAdd('Corps',bodyCount);
        }
        if (!quiet) {
            warning('Navette de secours','<span class="vert">'+bodyCount+' corps</span> ont été récupérés par la navette de secours.<br>',true);
        }
    }
};

function getCitNeed() {
    let citNeed = 1;
    let mesCitoyens = calcTotalCitoyens(true);
    let citNorm = ((playerInfos.gLevel-4)*450)+2730;
    citNeed = citNeed*citNorm/mesCitoyens.real;
    if (citNeed > 1.75) {
        citNeed = 1.75;
    }
    citNeed = citNeed.toFixedNumber(3);
    playerInfos.cNeed = citNeed;
    console.log('CITOYENS');
    console.log('real='+mesCitoyens.real);
    console.log('norm='+citNorm);
    console.log('need='+citNeed);
    return citNeed;
};

function getCitLoss() {
    let citNorm = ((playerInfos.gLevel-4)*450)+2730;
    let citLoss = citNorm-playerInfos.citz.real;
    playerInfos.cLoss = citLoss;
    return citLoss;
};

function bonusCit(citId,toId,number) {
    let toBat = getBatById(toId);
    let unitIndex = unitTypes.findIndex((obj => obj.id == citId));
    conselUnit = unitTypes[unitIndex];
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselTriche = true;
    putBat(toBat.tileId,number,0,'',false);
    let newCitBat = getBatByTypeIdAndTileId(citId,toBat.tileId);
    newCitBat.loc = 'trans';
    newCitBat.locId = toBat.id;
    toBat.transIds.push(newCitBat.id);
};

function calcTotalCitoyens(cryoOut) {
    if (cryoOut) {
        cryoOut = false;
        let cryoBat = getBatByName('Unités cryogéniques');
        if (Object.keys(cryoBat).length >= 1) {
            if (!cryoBat.tags.includes('construction')) {
                cryoOut = true;
            }
        }
    } else {
        cryoOut = false;
    }
    let mesCitoyens = {};
    mesCitoyens.cit = 0;
    mesCitoyens.crim = 0;
    mesCitoyens.real = 0;
    mesCitoyens.false = 0;
    mesCitoyens.dogs = 0;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.name === 'Citoyens') {
            if (!cryoOut) {
                mesCitoyens.cit = mesCitoyens.cit+bat.citoyens;
            }
            mesCitoyens.real = mesCitoyens.real+bat.citoyens;
        } else if (batType.name === 'Criminels') {
            if (!cryoOut) {
                mesCitoyens.crim = mesCitoyens.crim+bat.citoyens;
            }
            mesCitoyens.real = mesCitoyens.real+bat.citoyens;
        } else {
            let unitCits = batType.squads*batType.crew*batType.squadSize;
            if (batType.skills.includes('brigands')) {
                mesCitoyens.crim = mesCitoyens.crim+unitCits;
            } else {
                mesCitoyens.cit = mesCitoyens.cit+unitCits;
            }
            if (!batType.skills.includes('dog') && !batType.skills.includes('clone') && !bat.tags.includes('zombie')) {
                mesCitoyens.real = mesCitoyens.real+unitCits;
            } else {
                mesCitoyens.false = mesCitoyens.false+unitCits;
            }
            if (batType.skills.includes('dog') || bat.tags.includes('zombie')) {
                mesCitoyens.dogs = mesCitoyens.dogs+Math.ceil(unitCits/3*batType.size);
            }
        }
    });
    mesCitoyens.total = mesCitoyens.cit+mesCitoyens.crim;
    playerInfos.citz = mesCitoyens;
    return mesCitoyens;
};

function eventCrime(time,sim,quiet,afterMission) {
    // Crimes et vols en fonction du taux de criminalité
    let mesCitoyens = calcTotalCitoyens(false);
    let population = mesCitoyens.crim+mesCitoyens.cit;
    let crimeRate = calcCrimeRate(mesCitoyens);
    if (!sim) {
        playerInfos.crime = crimeRate.total;
        setPenitLevel();
    }
    if (!quiet) {
        warning('Population','Criminels: '+crimeRate.crim+'% <br> Pénibilité: '+crimeRate.penib+'% <br> Forces de l\'ordre: '+crimeRate.fo+'<br> Criminalité: '+crimeRate.total+'%',false,-1,true)
    }
    if (!sim) {
        checkCrimes(crimeRate,time,afterMission);
    }
};

function chenilProd(bat,batType,time,sim,quiet) {
    if (playerInfos.onShip) {
        console.log('UPKEEP');
        console.log(batType.name);
        let upkeepPaid = true;
        let message = '';
        if (batType.upkeep != undefined) {
            Object.entries(batType.upkeep).map(entry => {
                let key = entry[0];
                let value = entry[1];
                let conso = Math.ceil(value*time)+240;
                let dispoRes = getDispoRes(key);
                if (dispoRes < conso) {
                    upkeepPaid = false;
                    message = message+key+':<span class="hrouge">pénurie!</span><br>';
                }
            });
            if (upkeepPaid) {
                Object.entries(batType.upkeep).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    let conso = Math.ceil(value*time);
                    modWeekRes(key,0-conso);
                    if (!sim) {
                        resSub(key,conso);
                    }
                    message = message+key+':<span class="rose">-'+conso+'</span><br>';
                    console.log('upkeep = '+key+':'+conso);
                });
            } else {
                if (!sim) {
                    upkeepNotPaid(bat,batType);
                }
            }
        }
        console.log('upkeepPaid='+upkeepPaid);
        if (upkeepPaid) {
            let dogUnit = getBatTypeById(264);
            let maxInfo = maxUnits(dogUnit);
            if (maxInfo.ko) {
                message = message+'<span class="hrouge">'+maxInfo.text+'</span><br>';
            } else {
                let dogChance = Math.ceil(time/2);
                dogChance = Math.ceil(dogChance*(playerInfos.comp.med+12)/12*(playerInfos.comp.ordre+12)/12);
                dogChance = prodDrop(bat,batType,dogChance,true);
                console.log('dogChance='+dogChance);
                if (rand.rand(1,100) <= dogChance) {
                    console.log('DOOOOOOOOOOOOGS');
                    modWeekRes('Viande',-240);
                    if (!sim) {
                        resSub('Viande',240);
                    }
                    message = message+'<span class="cy">Vous avez un nouveau bataillon de Wardogs!</span><br>';
                    message = message+'Viande:<span class="rose">-240</span><br>';
                    if (!sim) {
                        putDog();
                    }
                }
            }
        }
        if (!quiet) {
            warning(batType.name,message,true);
        }
    }
}

function putDog() {
    conselUnit = getBatTypeById(264);
    conselAmmos = ['dents','xxx','aucune','aucun'];
    conselPut = false;
    conselTriche = true;
    putBat(1537,0,0,'',false);
    let bat = getBatByTypeIdAndTileId(264,1537);
    loadBat(bat.id,souteId);
}

function eventAliens(afterMission,time,sim,quiet) {
    // Montée de la présence alien
};
