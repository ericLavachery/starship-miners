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
    let resNumber = time*5;
    resAdd('Scrap',resNumber);
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
                        bat.xp = bat.xp+Math.round(time/4);
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
                        bat.xp = bat.xp+Math.round(time/10);
                    }
                }
            }
        }
    });
};

function eventBouffe(time) {
    let mesCitoyens = calcTotalCitoyens();
    let toutMesCitoyens = mesCitoyens.cit+mesCitoyens.crim;
    let bouffeCost = {};
    let recycleFactor = playerInfos.comp.tri+8;
    if (playerInfos.bldList.includes('Recyclab')) {
        recycleFactor = recycleFactor+4;
    }
    bouffeCost['Nourriture'] = Math.round(toutMesCitoyens*time*2/197);
    bouffeCost['Eau'] = Math.round(toutMesCitoyens*time*2/138/recycleFactor*8);
    bouffeCost['Oxygène'] = Math.round(toutMesCitoyens*time*2/1679/recycleFactor*8);
    if (playerInfos.bldList.includes('Serres hydroponiques')) {
        let plantesProd = 0;
        bataillons.forEach(function(bat) {
            // Serres 1 emplacement
            if (bat.type === 'Serres hydroponiques' && !bat.tags.includes('construction')) {
                if (!bat.tags.includes('construction')) {
                    plantesProd = plantesProd+Math.round(25*time/21);
                } else {
                    tagDelete(bat,'construction');
                }
            }
            // Jardin 2 emplacements mais 3x prod
            if (bat.type === 'Jardin' && ) {
                if (!bat.tags.includes('construction')) {
                    plantesProd = plantesProd+Math.round(70*time/21);
                } else {
                    tagDelete(bat,'construction');
                }
            }
        });
        if (bouffeCost['Oxygène'] > plantesProd) {
            bouffeCost['Oxygène'] = bouffeCost['Oxygène']-plantesProd;
        } else {
            bouffeCost['Oxygène'] = 0;
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
    warning('Coût en nourriture ('+costFood+')',messageFood);
    warning('Coût en eau ('+costWater+')',messageWater);
    warning('Coût en oxygène ('+costAir+')',messageAir);
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
    warning('Nouveaux citoyens',newCitsNumber+' '+citName+' ont débarqué dans la station.');
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

};

function calcCrimeRate(mesCitoyens) {
    // facteur: +criminels%
    let population = mesCitoyens.crim+mesCitoyens.cit;
    let crimeRate = Math.round(mesCitoyens.crim*100/population);
    let crimeFactors = 0;
    // facteur: +population
    let overPop = population-2400;
    crimeFactors = crimeFactors+Math.round(overPop/200);
    // +1 par point playerInfos.vitals (25 pts)
    crimeFactors = crimeFactors+playerInfos.vitals;
    let lits = 0;
    let bldIds = [];
    // Unités: (electroguards-2 gurus-2 dealers-1 marshalls-1)
    // Bâtiments: (prisons-5 salleSport-2 jardin-4 bar-1 dortoirs+2 appartements+3)
    bataillons.forEach(function(bat) {
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
        if (batType.crime != undefined) {
            let countMe = false;
            if (batType.cat === 'buildings') {
                if (batType.name === 'Prisons' || batType.crime >= 1) {
                    countMe = true;
                } else {
                    if (!bldIds.includes(batType.id)) {
                        countMe = true;
                        bldIds.push(batType.id);
                    }
                }
            } else {
                countMe = true;
            }
            crimeFactors = crimeFactors+batType.crime;
        }
    });
    // +5 par dortoir manquant
    if (population > lits) {
        crimeFactors = crimeFactors+Math.round((population-lits)/100);
    }
    // Treshold
    if (crimeFactors > crimeRate && crimeFactors < 10) {
        crimeRate = crimeRate*2;
    } else {
        crimeRate = crimeRate+crimeFactors;
    }
    // compétence maintien de l'ordre
    crimeRate = crimeRate-(playerInfos.comp.ordre*3);
    crimeRate = Math.round(crimeRate/(playerInfos.comp.ordre+6)*6);
    console.log('crimeRate='+crimeRate);
    return crimeRate;
};

function eventAliens(afterMission,time) {
    // Montée de la présence alienne
};
