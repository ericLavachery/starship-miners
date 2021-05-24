function events(afterMission) {
    checkReserve();
    updateBldList();
    let time = 21;
    if (afterMission) {
        time = Math.ceil(playerInfos.mapTurn/3)*3;
    }
    eventCitoyens(time);
    eventProduction(afterMission,time);
    eventBouffe(time);
    eventCrime(time);
    eventAliens(time);
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
};

function eventProduction(afterMission,time) {
    let mesCitoyens = calcTotalCitoyens();
    let population = mesCitoyens.crim+mesCitoyens.cit;
    let triFactor = playerInfos.comp.tri;
    if (playerInfos.bldList.includes('Décharge')) {
        triFactor = triFactor+1;
    }
    let scrapNum = Math.round(time*population/2000*3*(triFactor+5)/5);
    if (afterMission) {
        scrapNum = Math.round(scrapNum/5);
    }
    resAdd('Scrap',scrapNum);
    warning('Poubelles','Scrap:<span class="vert">+'+scrapNum+'</span><br>',true);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            // PRODUCTION
            if (batType.skills.includes('upkeep') || batType.skills.includes('prodres')) {
                if (!bat.tags.includes('construction') || playerInfos.onShip) {
                    upkeepAndProd(bat,batType,time);
                }
            }
            if (batType.skills.includes('solar') && bat.tags.includes('prodres')) {
                solarProd(bat,batType,time);
            }
            // ENTRAINEMENT
            if (!afterMission) {
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
    });
    // REEDUCATION
    if (playerInfos.bldList.includes('Camp de rééducation')) {
        let dispoCit = getDispoCit();
        let dispoCrim = getDispoCrim();
        let crimBatId = -1;
        let crimBat = {};
        let citBatId = -1;
        let citBat = {};
        let educChance = Math.ceil((playerInfos.comp.ordre+1)*(playerInfos.comp.ordre+1)*5.6)+9;
        if (rand.rand(1,100) <= educChance) {
            let educMax = Math.round(time*rand.rand(17,25)/21*15/21/6)*6;
            if (educMax >= mesCitoyens.crim-12) {
                educMax = mesCitoyens.crim-12;
            }
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
                    crimBat.citoyens = crimBat.citoyens-educMax;
                    citBat.citoyens = citBat.citoyens+educMax;
                    warning('Camp de rééducation',educMax+' criminels réhabilités.',true);
                }
            }
        }
    }
};

function eventBouffe(time) {
    let mesCitoyens = calcTotalCitoyens();
    let toutMesCitoyens = mesCitoyens.cit+mesCitoyens.crim;
    let bouffeCost = {};
    let recycleFactor = playerInfos.comp.tri+8;
    if (playerInfos.bldList.includes('Recyclab')) {
        recycleFactor = recycleFactor+4;
    }
    bouffeCost['Nourriture'] = Math.round(toutMesCitoyens*time*2/687);
    bouffeCost['Eau'] = Math.round(toutMesCitoyens*time*2/274/recycleFactor*8);
    bouffeCost['Oxygène'] = Math.round(toutMesCitoyens*time*2/1679/recycleFactor*8);
    if (playerInfos.bldList.includes('Serres hydroponiques')) {
        let plantesProd = 0;
        bataillons.forEach(function(bat) {
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
        });
        if (plantesProd >= 1) {
            warning('Serres et Jardins','Oxygène:<span class="vert">+'+plantesProd+'</span><br>(Déduit de la consommation)<br>',true);
            if (bouffeCost['Oxygène'] > plantesProd) {
                bouffeCost['Oxygène'] = bouffeCost['Oxygène']-plantesProd;
            } else {
                bouffeCost['Oxygène'] = 0;
            }
        }
    }
    console.log(mesCitoyens);
    console.log(bouffeCost);
    playerInfos.vitals = Math.floor(playerInfos.vitals/3);
    let dispoFood = getDispoRes('Nourriture');
    let costFood = bouffeCost['Nourriture'];
    let messageFood = 'OK';
    if (dispoFood < costFood/2) {
        playerInfos.vitals = playerInfos.vitals+5;
        messageFood = 'Carence grave';
    } else if (dispoFood < costFood) {
        playerInfos.vitals = playerInfos.vitals+2;
        messageFood = 'Carence';
    }
    let dispoWater = getDispoRes('Eau');
    let costWater = bouffeCost['Eau'];
    let messageWater = 'OK';
    if (dispoWater < costWater/2) {
        playerInfos.vitals = playerInfos.vitals+8;
        messageWater = 'Carence grave';
    } else if (dispoWater < costWater) {
        playerInfos.vitals = playerInfos.vitals+2;
        messageWater = 'Carence';
    }
    let dispoAir = getDispoRes('Oxygène');
    let costAir = bouffeCost['Oxygène'];
    let messageAir = 'OK';
    if (dispoAir < costAir/2) {
        playerInfos.vitals = playerInfos.vitals+12;
        messageAir = 'Carence grave';
    } else if (dispoAir < costAir) {
        playerInfos.vitals = playerInfos.vitals+3;
        messageAir = 'Carence';
    }
    warning('Consommation','Nourriture: <span class="rose">-'+costFood+'</span><br>'+messageFood,true);
    warning('Consommation','Eau: <span class="rose">-'+costWater+'</span><br>'+messageWater,true);
    warning('Consommation','Oxygène: <span class="rose">-'+costAir+'</span><br>'+messageAir+'<br>',true);
    payMaxCost(bouffeCost);
};

function eventCitoyens(time) {
    let newCitsNumber = Math.floor(time*1.5/6)*6;
    let citId = 126;
    let citName = 'Citoyens';
    if (rand.rand(1,100) <= ruinsCrimChance) {
        citId = 225;
        citName = 'Criminels';
    }
    bonusCit(citId,souteId,newCitsNumber);
    playerInfos.allCits = playerInfos.allCits+newCitsNumber;
    warning('Nouveaux citoyens','<span class="vert">'+newCitsNumber+' '+citName+'</span> ont débarqué dans la station.<br>',true);
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

function calcTotalCitoyens() {
    let mesCitoyens = {};
    mesCitoyens.cit = 0;
    mesCitoyens.crim = 0;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.name === 'Citoyens') {
            mesCitoyens.cit = mesCitoyens.cit+bat.citoyens;
        } else if (batType.name === 'Criminels') {
            mesCitoyens.crim = mesCitoyens.crim+bat.citoyens;
        } else {
            let unitCits = batType.squads*batType.crew*batType.squadSize;
            if (batType.skills.includes('brigands')) {
                mesCitoyens.crim = mesCitoyens.crim+unitCits;
            } else {
                mesCitoyens.cit = mesCitoyens.cit+unitCits;
            }
        }
    });
    return mesCitoyens;
};

function eventCrime(time) {
    // Crimes et vols en fonction du taux de criminalité
    let mesCitoyens = calcTotalCitoyens();
    let population = mesCitoyens.crim+mesCitoyens.cit;
    let crimeRate = calcCrimeRate(mesCitoyens);
    warning('Population','Criminels: '+crimeRate.crim+'% <br> Pénibilité: '+crimeRate.penib+'% <br> Forces de l\'ordre: '+crimeRate.fo+'<br> Criminalité: '+crimeRate.total+'%',false)
};

function calcCrimeRate(mesCitoyens) {
    let crimeRate = {};
    // facteur: +criminels%
    let population = mesCitoyens.crim+mesCitoyens.cit;
    crimeRate.crim = Math.ceil(mesCitoyens.crim*100/population);
    crimeRate.penib = 0;
    crimeRate.fo = 0;
    crimeRate.total = 0;
    // facteur: +population
    let overPop = population-3000;
    crimeRate.penib = crimeRate.penib+Math.round(overPop/250);
    // +1 par point playerInfos.vitals (25 pts)
    crimeRate.penib = crimeRate.penib+playerInfos.vitals;
    let lits = 0;
    let bldIds = [];
    // Unités: (electroguards-2 gurus-2 dealers-1 marshalls-1)
    let maxAntiCrimeUnits = Math.round(Math.sqrt(population)/7.5);
    let antiCrimeUnits = 0;
    // Bâtiments: (prisons-5 salleSport-2 jardin-4 bar-2 cantine-3 dortoirs+1 cabines-1 appartements+3)
    let sortedBatList = bataillons.slice();
    sortedBatList = _.sortBy(sortedBatList,'sort');
    sortedBatList.reverse();
    sortedBatList.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.name === 'Dortoirs') {
            lits = lits+500;
        }
        if (batType.name === 'Cabines') {
            lits = lits+250;
        }
        if (batType.name === 'Appartements') {
            lits = lits+50;
        }
        if (batType.crime != undefined || bat.eq === 'camkit') {
            let countMe = false;
            if (batType.cat === 'buildings') {
                if (batType.name === 'Prisons' || batType.name === 'Cabines' || batType.crime >= 1) {
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
                if (bat.eq === 'camkit') {
                    crimeRate.fo = crimeRate.fo-1;
                } else if (batType.skills.includes('fo')) {
                    crimeRate.fo = crimeRate.fo+batType.crime;
                } else {
                    crimeRate.penib = crimeRate.penib+batType.crime;
                }
            }
        }
    });
    // centre de com
    if (playerInfos.bldList.includes('Centre de com')) {
        crimeRate.fo = crimeRate.fo-3;
    }
    // +5 par dortoir manquant
    if (population > lits) {
        crimeRate.penib = crimeRate.penib+Math.round((population-lits)/100);
    }
    if (crimeRate.penib < 0) {
        crimeRate.penib = 0;
    }
    // Treshold
    if (crimeRate.penib < 10) {
        crimeRate.total = crimeRate.crim+Math.round(crimeRate.penib/1.9);
    } else if (crimeRate.crim >= 15) {
        crimeRate.total = crimeRate.crim+Math.round(crimeRate.penib*1.2);
    } else {
        crimeRate.total = crimeRate.crim+crimeRate.penib;
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
    console.log('crimeRate.total='+crimeRate.total);
    return crimeRate;
};

function eventAliens(afterMission,time) {
    // Montée de la présence alienne
};