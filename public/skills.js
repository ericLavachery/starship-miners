function guet() {
    selectMode();
    console.log('GUET');
    if (!selectedBat.tags.includes('guet')) {
        selectedBat.tags.push('guet');
    }
    selectedBat.apLeft = selectedBat.apLeft-3;
    if (selectedBatType.skills.includes('baddef') && !selectedBatType.skills.includes('fastguet')) {
        selectedBat.apLeft = selectedBat.apLeft-2;
    }
    tagDelete(selectedBat,'mining');
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,false);
};

function fortification(apCost) {
    selectMode();
    console.log('FORTIFICATION');
    if (!selectedBat.tags.includes('fortif')) {
        selectedBat.tags.push('fortif');
    }
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    tagDelete(selectedBat,'mining');
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,false);
};

function checkCommand(myBat) {
    let leSousChef = {};
    leSousChef.ok = false;
    leSousChef.bat = {};
    leSousChef.pa = 0;
    let myBatType = getBatType(myBat);
    let bestEffect = 0;
    bataillons.forEach(function(bat) {
        if (bat.tileId != myBat.tileId && !bat.tags.includes('command')) {
            let batType = getBatType(bat);
            let distOK = false;
            let thisEffect = 0;
            if (batType.skills.includes('leader')) {
                if (playerInfos.bldList.includes('Poste radio')) {
                    distOK = true;
                    thisEffect = 100+bat.apLeft;
                } else {
                    let distance = calcDistance(bat.tileId,myBat.tileId);
                    if (distance <= 3) {
                        distOK = true;
                        thisEffect = 200+bat.apLeft;
                    }
                }
            } else if (bat.tags.includes('schef')) {
                let distance = calcDistance(bat.tileId,myBat.tileId);
                if (distance <= 3) {
                    distOK = true;
                    thisEffect = 300+bat.apLeft;
                }
            }
            if (distOK) {
                if (thisEffect > bestEffect) {
                    bestEffect = thisEffect;
                    leSousChef.ok = true;
                    leSousChef.bat = bat;
                }
            }
        }
    });
    leSousChef.pa = 2;
    if (playerInfos.comp.ordre >= 2) {
        leSousChef.pa = leSousChef.pa+playerInfos.comp.ordre-1;
    }
    return leSousChef;
};

function goCommand(chefBatId,gainPA) {
    selectedBat.apLeft = selectedBat.apLeft+gainPA;
    selectedBat.tags.push('gogogo');
    let chefBat = getBatById(chefBatId);
    chefBat.apLeft = chefBat.apLeft-1;
    chefBat.tags.push('command');
    doneAction(chefBat);
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function checkTreuil(myBat) {
    // array 0=ok? 1=treuilBat 2=PA
    let leTreuil = {};
    leTreuil.ok = false;
    leTreuil.bat = {};
    leTreuil.pa = 0;
    let myBatType = getBatType(myBat);
    let bestEffect = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.tileId != myBat.tileId && bat.apLeft >= 1) {
            let distance = calcDistance(bat.tileId,myBat.tileId);
            if (distance <= 1) {
                let batType = getBatType(bat);
                if (batType.skills.includes('treuil') || bat.eq === 'e-treuil' || bat.logeq === 'e-treuil') {
                    let thisEffect = 200+bat.apLeft;
                    let gainPA = 2;
                    if (Math.ceil(batType.size*1.5) >= myBatType.size) {
                        gainPA = 4;
                        thisEffect = thisEffect+200;
                    }
                    if (thisEffect > bestEffect) {
                        bestEffect = thisEffect;
                        leTreuil.ok = true;
                        leTreuil.bat = bat;
                        leTreuil.pa = gainPA;
                    }
                }
            }
        }
    });
    if (playerInfos.comp.trans === 3) {
        leTreuil.pa = leTreuil.pa+1;
    }
    return leTreuil;
};

function goTreuil(treuilBatId,gainPA) {
    selectedBat.apLeft = selectedBat.apLeft+gainPA;
    selectedBat.salvoLeft = 0;
    let treuilBat = getBatById(treuilBatId);
    treuilBat.apLeft = treuilBat.apLeft-4;
    doneAction(treuilBat);
    tagDelete(selectedBat,'guet');
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function goDoxey() {
    let doxeyBatId = -1;
    bataillons.forEach(function(bat) {
        if (bat.tags.includes('hero') && !bat.tags.includes('potion')) {
            let batType = getBatType(bat);
            if (batType.skills.includes('heropotion')) {
                let distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance <= 1) {
                    doxeyBatId = bat.id;
                }
            }
        }
    });
    if (doxeyBatId >= 0) {
        let doxeyBat = getBatById(doxeyBatId);
        doxeyBat.tags.push('potion');
        doneAction(doxeyBat);
        let medComp = playerInfos.comp.med;
        let newAP = selectedBat.ap+(medComp*2)-6;
        if (newAP > selectedBat.apLeft) {
            selectedBat.apLeft = newAP;
        }
        let newSquads = Math.ceil(selectedBatType.squads/9*(medComp+6));
        if (newSquads > selectedBat.squadsLeft) {
            selectedBat.squadsLeft = selectedBatType.squads;
        }
        selectedBat.damage = 0;
        tagDelete(selectedBat,'stun');
        tagDelete(selectedBat,'poison');
        tagDelete(selectedBat,'poison');
        selectedBat.emo = selectedBat.emo-2;
        if (medComp >= 1) {
            tagDelete(selectedBat,'venin');
            tagDelete(selectedBat,'maladie');
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'poison');
            selectedBat.emo = selectedBat.emo-2;
        } else if (medComp >= 2) {
            tagDelete(selectedBat,'parasite');
            tagDelete(selectedBat,'necro');
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'poison');
            selectedBat.emo = selectedBat.emo-3;
        } else if (medComp === 3) {
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'poison');
            selectedBat.emo = selectedBat.emo-3;
        }
        if (selectedBat.emo < 0) {
            selectedBat.emo = 0;
        }
        doneAction(selectedBat);
        selectedBatArrayUpdate();
        showMap(zone,true);
        showBatInfos(selectedBat);
    }
};

function diversion() {
    aliens.forEach(function(alien) {
        let alienType = getBatType(alien);
        if (alienType.moveCost < 90) {
            let distance = calcDistance(selectedBat.tileId,alien.tileId);
            if (distance <= 4) {
                alien.aplLeft = alien.aplLeft-Math.round(alienType.moveCost*1.5);
                let lassoTileId = getLassoTile(alien.tileId,selectedBat.tileId);
                if (lassoTileId >= 0) {
                    alien.tileId = lassoTileId;
                    tagDelete(alien,'invisible');
                }
            }
        }
    });
    selectedBat.apLeft = selectedBat.apLeft-2;
    selectedBat.tags.push('lasso');
    selectedBat.tags.push('lasso');
    doneAction(selectedBat);
    camoOut();
    selectedBatArrayUpdate();
    showMap(zone,false);
    showBatInfos(selectedBat);
};

function getLassoTile(alienTileId,targetTileId) {
    playerOccupiedTileList();
    alienOccupiedTileList();
    let lassoTileId = -1;
    let nearest = 100;
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (isAdjacent(alienTileId,tile.id)) {
            if (tile.id != alienTileId) {
                if (!playerOccupiedTiles.includes(tile.id)) {
                    if (!alienOccupiedTiles.includes(tile.id)) {
                        let distance = calcDistance(tile.id,targetTileId);
                        if (distance < nearest) {
                            nearest = distance;
                            lassoTileId = tile.id;
                        }
                    }
                }
            }
        }
    });
    return lassoTileId;
};

function rush(rushAP) {
    selectedBat.apLeft = selectedBat.apLeft+rushAP;
    selectedBat.tags.push('rush');
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function rage() {
    selectedBat.tags.push('rage');
    selectedBat.tags.push('norage');
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function fougue() {
    selectedBat.salvoLeft = selectedBat.salvoLeft+1;
    selectedBat.tags.push('nofougue');
    selectedBat.tags.push('nofougue');
    selectedBat.tags.push('nofougue');
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function instaKill() {
    selectedBat.tags.push('kill');
    if (selectedBatType.skills.includes('herominik')) {
        selectedBat.tags.push('nokill');
        selectedBat.tags.push('nokill');
    } else {
        selectedBat.tags.push('nokill');
    }
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function tornade() {
    selectedBat.tags.push('tornade');
    selectedBat.tags.push('notorn');
    selectedBat.tags.push('notorn');
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function prodToggle() {
    selectMode();
    console.log('PROD TOGGLE');
    if (selectedBat.tags.includes('prodres')) {
        tagDelete(selectedBat,'prodres');
    } else {
        selectedBat.tags.push('prodres');
        if (playerInfos.onShip) {
            tagDelete(selectedBat,'construction');
            tagDelete(selectedBat,'construction');
        }
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function gloireASatan() {
    console.log('GLOIRE A SATAN');
    if (!selectedBat.tags.includes('prayer')) {
        selectedBat.tags.push('prayer');
        selectedBat.tags.push('prayer');
        selectedBat.tags.push('spirit');
    }
    selectedBat.salvoLeft = 0;
    selectedBat.apLeft = selectedBat.apLeft-7;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.kind === selectedBatType.kind) {
                bat.apLeft = bat.apLeft+3;
            }
        }
    });
    tagDelete(selectedBat,'guet');
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function calcCamo(bat) {
    let batType = getBatType(bat);
    let stealth = getStealth(bat);
    // underground
    if (batType.skills.includes('underground')) {
        stealth = stealth+10;
    }
    if (stealth < 3) {
        stealth = 3;
    }
    let terrain = getTerrain(bat);
    if (terrain.veg >= 1) {
        stealth = stealth+terrain.veg+terrain.veg+2;
    }
    if (terrain.scarp >= 2) {
        stealth = stealth+terrain.scarp+terrain.scarp;
    }
    let camChance = Math.round(Math.sqrt(stealth)*(playerInfos.comp.ca+16))+(stealth*2)-35;
    let minChance = Math.round((terrain.veg+terrain.scarp)*8);
    if (camChance < minChance) {
        camChance = minChance;
    }
    // size
    if (batType.size > 3) {
        camChance = Math.ceil(camChance/Math.sqrt(Math.sqrt(batType.size))*1.31);
    }
    // sarak
    if (zone[0].planet === 'Sarak') {
        camChance = camChance+25;
    }
    // max
    if (batType.skills.includes('underground') || batType.cat === 'buildings') {
        camChance = camChance+65;
        if (camChance > 100) {
            camChance = 100;
        }
    } else {
        if (camChance > stealthMaxChance) {
            camChance = stealthMaxChance;
        }
    }
    // min
    if (camChance < (batType.stealth-6)*3) {
        camChance = (batType.stealth-6)*3;
    }
    return camChance;
};

function camouflage(apCost) {
    console.log('MODE FURTIF');
    if (apCost <= selectedBat.ap) {
        let camChance = calcCamo(selectedBat);
        let camOK = false;
        let camDice = rand.rand(1,100);
        console.log('camChance '+camChance);
        let naturalFuzz = selectedBatType.fuzz;
        if (camDice <= camChance) {
            camOK = true;
            selectedBat.fuzz = -2;
        } else {
            if (apCost === 0) {
                camOK = false;
                selectedBat.fuzz = naturalFuzz;
            } else {
                if (selectedBat.fuzz > -2) {
                    camOK = false;
                    selectedBat.fuzz = naturalFuzz;
                } else {
                    camOK = true;
                    selectedBat.fuzz = -2;
                }
            }
        }
        if (apCost >= 1) {
            selectedBat.apLeft = selectedBat.apLeft-apCost;
        }
    } else {
        selectedBat.camoAP = apCost-Math.floor(selectedBat.ap/2);
        selectedBat.apLeft = selectedBat.apLeft-Math.floor(selectedBat.ap/2);
        console.log('camoAP'+selectedBat.camoAP);
    }
    if (!selectedBat.tags.includes('camo')) {
        selectedBat.tags.push('camo');
    }
    // tagDelete(selectedBat,'mining');
    selectedBatArrayUpdate();
    showBataillon(selectedBat);
    showBatInfos(selectedBat);
};

function longCamo(bat) {
    console.log('Camouflage en fin de tour');
    let batType = getBatType(bat);
    let camChance = calcCamo(bat);
    if (camChance < 85) {
        camChance = Math.round(camChance*1.5);
        if (camChance > 85) {
            camChance = 85;
        }
    }
    let camOK = false;
    let camDice = rand.rand(1,100);
    console.log('camChance '+camChance);
    let naturalFuzz = batType.fuzz;
    if (camDice <= camChance) {
        camOK = true;
        bat.fuzz = -2;
    } else {
        camOK = false;
        bat.fuzz = naturalFuzz;
    }
    if (!bat.tags.includes('camo')) {
        bat.tags.push('camo');
    }
};

function camoOut() {
    console.log('MODE NON FURTIF');
    if (selectedBat.tags.includes('camo')) {
        tagIndex = selectedBat.tags.indexOf('camo');
        selectedBat.tags.splice(tagIndex,1);
        selectedBat.fuzz = selectedBatType.fuzz;
    }
    selectedBat.camoAP = -1;
    selectedBatArrayUpdate();
    showBataillon(selectedBat);
    showBatInfos(selectedBat);
};

function camoStop(bat) {
    console.log('MODE NON FURTIF');
    let batType = getBatType(bat);
    if (bat.tags.includes('camo')) {
        tagIndex = bat.tags.indexOf('camo');
        bat.tags.splice(tagIndex,1);
        bat.fuzz = batType.fuzz;
    }
    bat.camoAP = -1;
};

function tirCible(apCost) {
    selectMode();
    console.log('TIR CIBLE');
    if (!selectedBat.tags.includes('vise')) {
        selectedBat.tags.push('vise');
    }
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function calcCibleBonus(batType) {
    let tcBonus = {};
    tcBonus.ap = 6-playerInfos.comp.train;
    let trainComp = playerInfos.comp.train;
    if (playerInfos.bldVM.includes('Camp d\'entraînement')) {
        trainComp = trainComp+0.5;
        tcBonus.ap = tcBonus.ap-1;
    }
    tcBonus.prec = (7+trainComp)/3.75;
    tcBonus.rof = (15+trainComp)/20;
    tcBonus.pow = (7+trainComp+playerInfos.comp.ca)/6.666;
    return tcBonus;
};

function fury(apCost) {
    selectMode();
    console.log('DOUBLE ATTAQUE');
    if (!selectedBat.tags.includes('datt')) {
        selectedBat.tags.push('datt');
    }
    tagDelete(selectedBat,'guet');
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function luckyShot() {
    selectMode();
    console.log('LUCKY SHOT');
    if (!selectedBat.tags.includes('lucky') && !selectedBat.tags.includes('luckyshot')) {
        selectedBat.tags.push('luckyshot');
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function ambush(apCost) {
    selectMode();
    console.log('EMBUSCADE');
    if (!selectedBat.tags.includes('embuscade')) {
        selectedBat.tags.push('embuscade');
    }
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function calcEmbushBonus(batType) {
    let embushBonus = 1.8;
    if (batType.cat != 'aliens') {
        embushBonus = embushBonus+(playerInfos.comp.train/6)+(playerInfos.comp.cam/2);
        if (playerInfos.bldVM.includes('Camp d\'entraînement')) {
            embushBonus = embushBonus+0.3;
        }
    }
    return embushBonus;
};

function calcTiraBonus(batType) {
    let tiraBonus = 1.35;
    if (batType.cat != 'aliens') {
        tiraBonus = tiraBonus+(playerInfos.comp.train/10)+(playerInfos.comp.cam/10);
        if (playerInfos.bldVM.includes('Camp d\'entraînement')) {
            tiraBonus = tiraBonus+0.2;
        }
    } else {
        tiraBonus = tiraBonus+0.15;
    }
    return tiraBonus;
};

function armyAssign(batId,army) {
    // le faire avec selectedBat puis arrayUpdate
    // let index = bataillons.findIndex((obj => obj.id == batId));
    // let bat = bataillons[index];
    selectedBat.army = army;
    if (selectedBatType.skills.includes('transport')) {
        bataillons.forEach(function(bat) {
            if (bat.loc === 'trans' && bat.locId == selectedBat.id) {
                bat.army = army;
            }
        });
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    if (inSoute) {
        goSoute();
    }
};

function goDrug(apCost,drugName) {
    console.log('DRUG DEAL');
    // console.log(selectedBat);
    let drug = getDrugByName(drugName);
    let batType;
    let ravitBat = {};
    let ravitLeft = 0;
    let biggestRavit = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('dealer') && batType.skills.includes(drug.name)) {
                ravitLeft = calcRavitDrug(bat);
                if (calcDistance(selectedBat.tileId,bat.tileId) <= 1 && ravitLeft >= 1) {
                    if (biggestRavit < ravitLeft) {
                        biggestRavit = ravitLeft;
                        ravitBat = bat;
                        console.log('ravit bat: '+ravitBat.type);
                    }
                }
            }
        }
    });
    let ravitBatType = getBatType(ravitBat);
    if (Object.keys(ravitBat).length >= 1) {
        if (biggestRavit < 999) {
            if (ravitBat.id == selectedBat.id) {
                selectedBat.tags.push('dU');
                // console.log('sel');
            } else {
                ravitBat.tags.push('dU');
                if (rand.rand(1,2) === 1) {
                    if (!ravitBatType.skills.includes('robot') || ravitBat.eq === 'g2ai' || ravitBat.logeq === 'g2ai') {
                        ravitBat.xp = ravitBat.xp+1;
                    }
                }
                // console.log('nosel');
            }
        }
        selectedBat.apLeft = selectedBat.apLeft-apCost;
        if (!selectedBat.tags.includes(drug.name)) {
            selectedBat.tags.push(drug.name);
            selectedBat.tags.push(drug.name);
            // blaze instant bonus
            if (drug.name === 'blaze') {
                selectedBat.apLeft = selectedBat.apLeft+6;
                selectedBat.salvoLeft = selectedBat.salvoLeft+1;
                console.log('blaze bonus');
            }
            // bliss instant bonus
            if (drug.name === 'bliss') {
                selectedBat.apLeft = selectedBat.apLeft-3;
            }
            // octiron instant bonus
            if (drug.name === 'octiron') {
                tagDelete(selectedBat,'lucky');
                selectedBat.apLeft = selectedBat.apLeft+4;
                if (selectedBatType.cat === 'infantry') {
                    if (playerInfos.comp.med >= 3) {
                        selectedBat.damage = 0;
                        let lostSquads = selectedBatType.squads-selectedBat.squadsLeft;
                        if (lostSquads >= 2) {
                            selectedBat.squadsLeft = selectedBat.squadsLeft+1;
                        }
                    }
                }
                console.log('octiron bonus');
            }
            // starka instant bonus
            if (drug.name === 'starka') {
                selectedBat.apLeft = selectedBat.apLeft+getStarkaBonus(selectedBat);
                console.log('starka bonus');
            }
            // kirin instant bonus
            if (drug.name === 'kirin' && playerInfos.comp.med >= 2) {
                selectedBat.damage = 0;
                if (playerInfos.comp.med >= 3) {
                    let lostSquads = selectedBatType.squads-selectedBat.squadsLeft;
                    if (lostSquads >= 2) {
                        selectedBat.squadsLeft = selectedBat.squadsLeft+2;
                    } else if (lostSquads === 1) {
                        selectedBat.squadsLeft = selectedBat.squadsLeft+1;
                    }
                }
                console.log('kirin bonus med');
            }
            // nitro instant bonus
            if (drug.name === 'nitro') {
                selectedBat.apLeft = selectedBat.apLeft+getNitroBonus(selectedBat);
                console.log('nitro bonus');
            }
        }
        payCost(drug.costs);
        doneAction(ravitBat);
        doneAction(selectedBat);
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
    }
};

function getNitroBonus(bat) {
    let batType = getBatType(bat);
    let batAPLeft = bat.apLeft;
    let batAP = getAP(bat,batType);
    let transBonus = Math.floor(playerInfos.comp.trans*playerInfos.comp.trans/3)*2;
    let baseBonus = Math.round(batAP/2)+transBonus;
    batAPLeft = batAPLeft+baseBonus;
    if (batAPLeft >= batAP+3+transBonus) {
        batAPLeft = batAP+3+transBonus;
    }
    if (batAPLeft < transBonus-1 && !bat.tags.includes('construction')) {
        batAPLeft = transBonus-1;
    }
    let nitroBonus = batAPLeft-Math.round(bat.apLeft);
    return nitroBonus;
};

function getStarkaBonus(bat) {
    let batType = getBatType(bat);
    let batAPLeft = bat.apLeft;
    if (bat.apLeft < 0) {
        batAPLeft = Math.round(bat.apLeft/2);
    }
    let batAP = getAP(bat,batType);
    let medBonus = Math.floor((playerInfos.comp.exo+1.5)*(playerInfos.comp.med+1)/2);
    batAPLeft = Math.round(batAPLeft+(batAP*2/3)+medBonus);
    let maxAP = Math.round(batAP+(medBonus/2));
    if (batAPLeft >= maxAP) {
        batAPLeft = maxAP;
    }
    let starkaBonus = batAPLeft-Math.round(bat.apLeft);
    return starkaBonus;
};

function checkDrugs(myBat) {
    let batType;
    let allDrugs = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('dealer')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1 && calcRavitDrug(bat) >= 1) {
                    if (batType.skills.includes('moloko')) {
                        allDrugs.push('moloko');
                    }
                    if (batType.skills.includes('bliss')) {
                        allDrugs.push('bliss');
                    }
                    if (batType.skills.includes('sila')) {
                        allDrugs.push('sila');
                    }
                    if (batType.skills.includes('blaze')) {
                        allDrugs.push('blaze');
                    }
                    if (batType.skills.includes('kirin')) {
                        allDrugs.push('kirin');
                    }
                    if (batType.skills.includes('octiron')) {
                        allDrugs.push('octiron');
                    }
                    if (batType.skills.includes('skupiac')) {
                        allDrugs.push('skupiac');
                    }
                    if (batType.skills.includes('starka')) {
                        allDrugs.push('starka');
                    }
                    if (batType.skills.includes('nitro')) {
                        allDrugs.push('nitro');
                        // console.log(bat);
                    }
                }
            }
        }
    });
    return allDrugs;
};

function checkBatDrugs(bat) {
    let myDrugs = [];
    if (bat.tags.includes('kirin')) {
        myDrugs.push('kr');
    }
    if (bat.tags.includes('octiron')) {
        myDrugs.push('oc');
    }
    if (bat.tags.includes('bliss')) {
        myDrugs.push('bi');
    }
    if (bat.tags.includes('blaze')) {
        myDrugs.push('bz');
    }
    if (bat.tags.includes('sila')) {
        myDrugs.push('si');
    }
    if (bat.tags.includes('skupiac')) {
        myDrugs.push('sk');
    }
    if (bat.tags.includes('starka')) {
        myDrugs.push('st');
    }
    return myDrugs;
};

function dropStuff(apCost,mineType) {
    selectMode();
    conOut();
    let unitIndex;
    let skillUsed = true;
    if (mineType === 'champ') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Champ de mines'));
    } else if (mineType === 'dynamite') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Explosifs'));
    } else if (mineType === 'barb-fer') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Barbelés'));
    } else if (mineType === 'barb-scrap') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Barbelés (scrap)'));
    } else if (mineType === 'barb-taser') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Barbelés (taser)'));
    } else if (mineType === 'trap-fosse') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Fosses'));
    } else if (mineType === 'trap-ap') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Pièges'));
    } else if (mineType === 'trap-dard') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Dardières'));
    } else if (mineType === 'coffre') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Coffres'));
        skillUsed = false;
    }
    conselPut = true;
    conselUnit = unitTypes[unitIndex];
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    cursorSwitch('.','grid-item','thor');
    if (skillUsed) {
        selectedBat.tags.push('sU');
    }
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    selectedBat.xp = selectedBat.xp+0.1;
    selectedBat.salvoLeft = 0;
    // tagAction();
    tagDelete(selectedBat,'guet');
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function clickMine(clicTileId,poseurTileId) {
    let distance = calcDistance(poseurTileId,clicTileId);
    if (distance <= 1) {
        let batHere = false;
        bataillons.forEach(function(bat) {
            if (bat.tileId === clicTileId && bat.loc === "zone") {
                batHere = true;
            }
        });
        aliens.forEach(function(bat) {
            if (bat.tileId === clicTileId && bat.loc === "zone") {
                batHere = true;
            }
        });
        let tile = getTileById(clicTileId);
        if (!conselUnit.skills.includes('oninfra')) {
            if (tile.infra != undefined && tile.infra != 'Débris') {
                batHere = true;
            }
        }
        if (!batHere) {
            putBat(clicTileId,0,0);
            showBatInfos(selectedBat);
        } else {
            conselReset();
            $('#unitInfos').empty();
            $("#unitInfos").css("display","none");
            selectMode();
            batUnstack();
            batUnselect();
        }
    } else {
        console.log('Trop loin');
    }
};

function checkFreeConsTile(bat,batType) {
    // pour les clicput
    let freeTile = false;
    let infraOK = false;
    if (batType.skills.includes('oninfra')) {
        infraOK = true;
    }
    let distance;
    alienOccupiedTileList();
    playerOccupiedTileList();
    zone.forEach(function(tile) {
        distance = calcDistance(tile.id,bat.tileId);
        if (distance <= 1) {
            if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && (tile.infra === undefined || tile.infra === 'Débris' || infraOK)) {
                freeTile = true;
            }
        }
    });
    // console.log('freeTile='+freeTile);
    return freeTile;
};

function fogEffect(myBat) {
    let fogPoison = 1;
    let distance;
    let batType = {};
    let i = 1;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(myBat.tileId,bat.tileId);
            if (distance <= fogRange) {
                if (!bat.tags.includes('invisible')) {
                    bat.tags.push('invisible');
                }
                if (!bat.tags.includes('fogged')) {
                    bat.tags.push('fogged');
                }
                if (!bat.tags.includes('poison')) {
                    batType = getBatType(bat);
                    fogPoison = Math.ceil(Math.sqrt(batType.size)/2);
                    i = 1;
                    while (i <= fogPoison) {
                        bat.tags.push('poison');
                        if (i > 6) {break;}
                        i++
                    }
                }
            }
        }
    });
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            distance = calcDistance(myBat.tileId,bat.tileId);
            if (distance <= fogRange) {
                if (!bat.tags.includes('fogged')) {
                    bat.tags.push('fogged');
                }
                bat.fuzz = -2;
            }
        }
    });
};

function deFog(bat,batType) {
    if (bat.tags.includes('fogged')) {
        tagDelete(bat,'fogged');
        if (batType.cat === 'aliens') {
            if (!batType.skills.includes('hide') && !batType.skills.includes('invisible') && bat.tags.includes('invisible')) {
                tagDelete(bat,'invisible');
            }
        } else {
            if (!bat.tags.includes('camo')) {
                bat.fuzz = batType.fuzz;
            }
        }
    }
}

function fogStart() {
    selectMode();
    console.log('FOG start');
    if (!selectedBat.tags.includes('fog')) {
        selectedBat.tags.push('fog');
    }
    selectedBat.fuzz = 3;
    tagDelete(selectedBat,'mining');
    selectedBatArrayUpdate();
    checkFoggedTiles();
    showBatInfos(selectedBat);
};

function fogStop() {
    selectMode();
    console.log('FOG stop');
    if (selectedBat.tags.includes('fog')) {
        tagIndex = selectedBat.tags.indexOf('fog');
        selectedBat.tags.splice(tagIndex,1);
    }
    tagDelete(selectedBat,'mining');
    selectedBatArrayUpdate();
    checkFoggedTiles();
    showBatInfos(selectedBat);
};

function checkFoggedTiles() {
    foggersTiles = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.type === 'Fog' && bat.tags.includes('fog')) {
                foggersTiles.push(bat.tileId);
            }
        }
    });
    let distance;
    foggedTiles = [];
    zone.forEach(function(tile) {
        foggersTiles.forEach(function(foggTile) {
            distance = calcDistance(tile.id,foggTile);
            if (distance <= fogRange) {
                foggedTiles.push(tile.id);
            }
        });
    });
    centerMap();
    console.log('foggedTiles');
    console.log(foggedTiles);
}
