function events(afterMission,time,sim,quiet) {
    console.log('EVENTS: afterMission='+afterMission+' time='+time+' sim='+sim+' quiet='+quiet);
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
    eventCitoyens(time,sim,quiet);
    eventBodies(time,sim,quiet);
    eventProduction(afterMission,time,sim,quiet); // remove 'return' tag !!!
    eventBouffe(time,sim,quiet);
    eventCrime(time,sim,quiet);
    eventAliens(time,sim,quiet);
    console.log('RES BALANCE');
    console.log(playerInfos.weekRes);
    showResBallance(quiet);
    if (!sim) {
        playerInfos.allTurns = playerInfos.allTurns+time;
        playerInfos.mapTurn = 0;
        playerInfos.mapDrop = 0;
        playerInfos.cocons = 0;
        playerInfos.fndComps = 0;
        playerInfos.fndUnits = 0;
        playerInfos.fndCits = 0;
        playerInfos.sondeMaps = 0;
        playerInfos.eggPause = false;
        playerInfos.droppedEggs = 0;
        playerInfos.aliensKilled = 0;
        playerInfos.eggsKilled = 0;
        playerInfos.alienSat = 0;
        playerInfos.unitsLost = 0;
        playerInfos.fuzzTotal = 0;
        playerInfos.pauseSeed = rand.rand(1,8);
        playerInfos.myCenter = 1830;
        playerInfos.undarkOnce = [];
        playerInfos.showedTiles = [];
    }
};

function calcTurnXP(turns) {
    let xp = Math.ceil(Math.sqrt(turns)*gangXPFactor);
    return xp;
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
                                    if (bat.eq === 'g2ai' || bat.logeq === 'g2ai') {
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
        console.log('RECHERCHE');
        let rechCompName = bat.eq.replace('sci-','');
        console.log(rechCompName);
        let rechComp = getCompByName(rechCompName);
        warning('<span class="cy">RECHERCHE: ('+rechComp.fullName+')</span>','<span class="gfbleu">Points de recherche: '+bat.sciRech+'.</span><br>',true);
        console.log(rechComp);
        let rechCompOK = isFoundCompOK(rechComp);
        console.log(rechCompOK);
        if (rechCompOK) {
            let findChance = Math.round(time*rand.rand(14,18)/4/rechComp.rechCost);
            let findLimit = Math.round(2000*rechComp.rechCost);
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
            warning('<span class="cy">RECHERCHE: Matériel obsolète!</span>','<span class="gfbleu">Vous devez acheter du nouveau matériel (équipement) pour que vos chercheurs puissent travailler.</span><br>',true);
        }
    } else if (bat.eq === 'gang-lore') {
        playerInfos.gangXP = playerInfos.gangXP+Math.round(time/3);
    } else {
        warning('<span class="cy">RECHERCHE: Chercheurs sans matériel!</span>','<span class="gfbleu">Vous devez leur acheter du matériel (équipement) pour qu\'ils puissent travailler.</span><br>',true);
    }
};

function eventBouffe(time,sim,quiet) {
    let mesCitoyens = calcTotalCitoyens(true);
    let toutMesCitoyens = mesCitoyens.cit+mesCitoyens.crim;
    let bouffeCost = {};
    let recycleFactor = playerInfos.comp.tri+8;
    if (playerInfos.bldList.includes('Recyclab')) {
        recycleFactor = recycleFactor+4;
    }
    let energyFactor = playerInfos.comp.tri+8;
    let eatFactor = playerInfos.comp.med+8;
    let numIso = checkNumUnits('Isolation');
    let isoFactor = 1+((26-numIso)/13);
    bouffeCost['Nourriture'] = Math.round(toutMesCitoyens*time*2/269/eatFactor*8);
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
                plantesProd = plantesProd+Math.round(25*time/21);
            } else {
                tagDelete(bat,'construction');
            }
        }
        // Jardin 2 emplacements mais 3x prod
        if (bat.type === 'Jardin') {
            if (!bat.tags.includes('construction')) {
                plantesProd = plantesProd+Math.round(70*time/21);
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
    playerInfos.vitals = Math.floor(playerInfos.vitals/3);
    let dispoFood = getDispoRes('Nourriture');
    let costFood = bouffeCost['Nourriture'];
    let messageFood = 'OK';
    if (dispoFood < costFood/2) {
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+5;
        }
        messageFood = '<span class="hrouge">Carence grave</span>';
    } else if (dispoFood < costFood) {
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+2;
        }
        messageFood = '<span class="hrouge">Carence</span>';
    }
    let dispoWater = getDispoRes('Eau');
    let costWater = bouffeCost['Eau'];
    let messageWater = 'OK';
    if (dispoWater < costWater/2) {
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+8;
        }
        messageWater = '<span class="hrouge">Carence grave</span>';
    } else if (dispoWater < costWater) {
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+2;
        }
        messageWater = '<span class="hrouge">Carence</span>';
    }
    let dispoAir = getDispoRes('Oxygène');
    let costAir = bouffeCost['Oxygène'];
    let messageAir = 'OK';
    if (dispoAir < costAir/2) {
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+12;
        }
        messageAir = '<span class="hrouge">Carence grave</span>';
    } else if (dispoAir < costAir) {
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+3;
        }
        messageAir = '<span class="hrouge">Carence</span>';
    }
    let dispoHeat = getDispoRes('Energie');
    let costHeat = bouffeCost['Energie'];
    let messageHeat = 'OK';
    if (dispoHeat < costHeat/2) {
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+3;
        }
        messageHeat = '<span class="hrouge">Carence grave</span>';
    } else if (dispoHeat < costHeat) {
        if (!sim) {
            playerInfos.vitals = playerInfos.vitals+1;
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
            warning('Ballance',balMessage+'<br>',false);
        }
    }
};

function eventCitoyens(time,sim,quiet) {
    let citNeed = getCitNeed();
    // let gangFacts = getGangFactors();
    console.log('$$$$$$$$$$$$$$$$$$$$$ citNeed = '+citNeed);
    let newCitsNumber = Math.floor(time*citNeed*rand.rand(10,20)*gangFacts.cit*(playerInfos.comp.med+30)*(playerInfos.comp.vsp+30)/10000);
    let citId = 126;
    let citName = 'Citoyens';
    if (rand.rand(1,ruinsCrimChance) === 1) {
        citId = 225;
        citName = 'Criminels';
    }
    if (!sim) {
        bonusCit(citId,souteId,newCitsNumber);
        playerInfos.allCits = playerInfos.allCits+newCitsNumber;
    }
    if (!quiet) {
        warning('Navette de secours','<span class="vert">'+newCitsNumber+' '+citName+'</span> ont été récupérés par la navette de secours.<br>',false);
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
    // citNeed = (citNeed+0.35)/1.35;
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
            if (!batType.skills.includes('dog') && !batType.skills.includes('clone')) {
                mesCitoyens.real = mesCitoyens.real+unitCits;
            } else {
                mesCitoyens.false = mesCitoyens.false+unitCits;
            }
        }
    });
    mesCitoyens.total = mesCitoyens.cit+mesCitoyens.crim;
    playerInfos.citz = mesCitoyens;
    return mesCitoyens;
};

function eventCrime(time,sim,quiet) {
    // Crimes et vols en fonction du taux de criminalité
    let mesCitoyens = calcTotalCitoyens(false);
    let population = mesCitoyens.crim+mesCitoyens.cit;
    let crimeRate = calcCrimeRate(mesCitoyens);
    if (!sim) {
        // EFFETS !!! CRIMES !!!
        playerInfos.crime = crimeRate.total;
        if (!quiet) {
            warning('Population','Criminels: '+crimeRate.crim+'% <br> Pénibilité: '+crimeRate.penib+'% <br> Forces de l\'ordre: '+crimeRate.fo+'<br> Criminalité: '+crimeRate.total+'%',false)
        }
    }
};

function calcCrimeRate(mesCitoyens) {
    let crimeRate = {};
    // facteur: +criminels%
    let population = mesCitoyens.crim+mesCitoyens.cit;
    crimeRate.crim = Math.ceil(mesCitoyens.crim*100/population);
    crimeRate.penib = 17;
    crimeRate.lits = 0;
    crimeRate.fo = 0;
    crimeRate.total = 0;
    // facteur: +population
    let overPop = population-3000;
    crimeRate.penib = crimeRate.penib+Math.round(overPop/250);
    // +1 par point playerInfos.vitals (25 pts)
    crimeRate.penib = crimeRate.penib+playerInfos.vitals;
    let bldIds = [];
    // Unités: (electroguards-2 gurus-2 dealers-1 marshalls-1)
    let maxAntiCrimeUnits = Math.round(Math.sqrt(population)/7.5);
    let antiCrimeUnits = 0;
    let penitBatCrims = 0;
    // Bâtiments: (prisons-5 salleSport-2 jardin-4 bar-2 cantine-3 dortoirs+1 cabines-1 appartements+3)
    let sortedBatList = bataillons.slice();
    sortedBatList = _.sortBy(sortedBatList,'sort');
    sortedBatList.reverse();
    sortedBatList.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('penitbat')) {
            penitBatCrims = penitBatCrims+(batType.squads*batType.crew*batType.squadSize);
        }
        if (batType.name === 'Dortoirs') {
            crimeRate.lits = crimeRate.lits+500;
            if (bat.eq === 'mezzanine') {
                crimeRate.lits = crimeRate.lits+350;
                crimeRate.penib = crimeRate.penib+1;
            }
            if (bat.eq === 'confort') {
                crimeRate.penib = crimeRate.penib-1;
            }
        }
        if (batType.name === 'Cabines') {
            crimeRate.lits = crimeRate.lits+350;
        }
        if (batType.name === 'Appartements') {
            crimeRate.lits = crimeRate.lits+75;
        }
        if (batType.crime != undefined || bat.eq === 'camkit') {
            let countMe = false;
            if (batType.cat === 'buildings' || batType.name === 'Technobass') {
                if (batType.name === 'Prisons' || batType.name === 'Cabines' || batType.name === 'Technobass' || batType.name === 'Ascenceur' || batType.crime >= 1) {
                    countMe = true;
                } else {
                    if (!bldIds.includes(batType.id)) {
                        countMe = true;
                        bldIds.push(batType.id);
                    }
                }
            } else if (batType.name === 'Electroguards') {
                countMe = true;
            } else {
                antiCrimeUnits++;
                if (antiCrimeUnits <= maxAntiCrimeUnits) {
                    countMe = true;
                }
            }
            if (countMe) {
                if (bat.eq === 'camkit' && playerInfos.bldVM.includes('Salle de contrôle')) {
                    crimeRate.fo = crimeRate.fo-1.2;
                } else if (batType.skills.includes('fo')) {
                    crimeRate.fo = crimeRate.fo+batType.crime;
                } else {
                    crimeRate.penib = crimeRate.penib+batType.crime;
                    console.log(batType.name+' '+batType.crime+' total='+crimeRate.penib);
                }
            }
        }
    });
    crimeRate.fo = Math.round(crimeRate.fo);
    // centre de com
    if (playerInfos.bldList.includes('Salle de contrôle')) {
        crimeRate.fo = crimeRate.fo-1;
    }
    // structure
    let numStructures = checkNumUnits('Structure');
    console.log('Structure='+numStructures);
    crimeRate.penib = crimeRate.penib-Math.round(numStructures/10);
    // +5 par dortoir manquant
    if (population > crimeRate.lits) {
        crimeRate.penib = crimeRate.penib+Math.floor((population-crimeRate.lits)/100);
    }
    console.log('PENIBBBBBBBBBBBBBBBBBBBBBBBBB');
    console.log(crimeRate.penib);
    if (crimeRate.penib < 0) {
        crimeRate.penib = 0;
    }
    // Bataillons pénitentiaires
    let penitAdj = 0;
    let adjCrims = crimeRate.crim;
    if (playerInfos.comp.ordre === 1) {
        penitAdj = Math.round(penitBatCrims*2/9);
    } else if (playerInfos.comp.ordre === 2) {
        penitAdj = Math.round(penitBatCrims*4/9);
    } else if (playerInfos.comp.ordre === 3) {
        penitAdj = Math.round(penitBatCrims*6/9);
    }
    adjCrims = Math.ceil((mesCitoyens.crim-penitAdj)*100/population);
    console.log('crimeRate.crim='+crimeRate.crim);
    console.log('adjCrims='+adjCrims);
    // Treshold
    if (crimeRate.penib < 10) {
        crimeRate.total = adjCrims+Math.round(crimeRate.penib/1.9);
    } else if (adjCrims >= 15) {
        crimeRate.total = adjCrims+Math.round(crimeRate.penib*1.2);
    } else {
        crimeRate.total = adjCrims+crimeRate.penib;
    }
    crimeRate.total = crimeRate.total+crimeRate.fo;
    // compétence maintien de l'ordre
    let mOrdre = 6;
    if (playerInfos.comp.ordre === 1) {
        mOrdre = 8;
    } else if (playerInfos.comp.ordre >= 2) {
        mOrdre = 10;
    }
    crimeRate.total = Math.round(crimeRate.total/mOrdre*6);
    if (crimeRate.total < 0) {
        crimeRate.total = 0;
    }
    console.log('crimeRate.total='+crimeRate.total);
    return crimeRate;
};

function chenilProd(bat,batType,time,sim,quiet) {
    if (playerInfos.onShip && playerInfos.gang === 'rednecks') {
        console.log('UPKEEP');
        console.log(batType.name);
        let upkeepPaid = true;
        let message = '';
        if (batType.upkeep != undefined) {
            Object.entries(batType.upkeep).map(entry => {
                let key = entry[0];
                let value = entry[1];
                let conso = Math.ceil(value*time)+120;
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
            let dogChance = Math.ceil(time/2);
            dogChance = Math.ceil(dogChance*(playerInfos.comp.med+12)/12*(playerInfos.comp.ordre+12)/12);
            console.log('dogChance='+dogChance);
            if (rand.rand(1,100) <= dogChance) {
                console.log('DOOOOOOOOOOOOGS');
                modWeekRes('Viande',-120);
                if (!sim) {
                    resSub('Viande',120);
                }
                message = message+'Viande:<span class="rose">-120</span><br>';
                if (!sim) {
                    putDog();
                }
            }
        }
        if (!quiet) {
            warning(batType.name,message,true);
        }
    }
}

function putDog() {
    let unitIndex = unitTypes.findIndex((obj => obj.id === 264));
    conselUnit = unitTypes[unitIndex];
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
