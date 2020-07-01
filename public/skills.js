function guet() {
    console.log('GUET');
    if (!selectedBat.tags.includes('guet')) {
        selectedBat.tags.push('guet');
    }
    selectedBat.salvoLeft = 0;
    selectedBat.apLeft = selectedBat.apLeft-3;
    tagDelete(selectedBat,'mining');
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function fortification() {
    console.log('FORTIFICATION');
    if (!selectedBat.tags.includes('fortif')) {
        selectedBat.tags.push('fortif');
    }
    selectedBat.salvoLeft = 0;
    selectedBat.apLeft = selectedBat.apLeft-selectedBatType.ap;
    tagDelete(selectedBat,'mining');
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
    let camChance = Math.round(Math.sqrt(stealth)*(playerInfos.caLevel+16))+(stealth*2)-35;
    let minChance = Math.round((terrain.veg+terrain.scarp)*8);
    if (camChance < minChance) {
        camChance = minChance;
    }
    // size
    if (batType.size > 3) {
        camChance = Math.ceil(camChance/Math.sqrt(Math.sqrt(batType.size))*1.31);
    }
    // max
    if (batType.skills.includes('underground')) {
        camChance = camChance+65;
        if (camChance > 100) {
            camChance = 100;
        }
    } else {
        if (camChance > stealthMaxChance) {
            camChance = stealthMaxChance;
        }
    }
    return camChance;
};

function camouflage(apCost) {
    console.log('MODE FURTIF');
    if (apCost <= selectedBatType.ap) {
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
        selectedBat.camoAP = apCost-Math.floor(selectedBatType.ap/2);
        selectedBat.apLeft = selectedBat.apLeft-Math.floor(selectedBatType.ap/2);
        console.log('camoAP'+selectedBat.camoAP);
    }
    if (!selectedBat.tags.includes('camo')) {
        selectedBat.tags.push('camo');
    }
    tagDelete(selectedBat,'mining');
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function longCamo(bat) {
    console.log('Camouflage en fin de tour');
    let batType = getBatType(bat);
    let camChance = calcCamo(bat);
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
    }
    selectedBat.fuzz = selectedBatType.fuzz;
    selectedBat.camoAP = -1;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function camoStop(bat) {
    console.log('MODE NON FURTIF');
    let batType = getBatType(bat);
    if (bat.tags.includes('camo')) {
        tagIndex = bat.tags.indexOf('camo');
        bat.tags.splice(tagIndex,1);
    }
    bat.fuzz = batType.fuzz;
    bat.camoAP = -1;
};

function tirCible() {
    console.log('TIR CIBLE');
    if (!selectedBat.tags.includes('vise')) {
        selectedBat.tags.push('vise');
    }
    selectedBat.apLeft = selectedBat.apLeft-3;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function luckyShot() {
    console.log('LUCKY SHOT');
    if (!selectedBat.tags.includes('lucky') && !selectedBat.tags.includes('luckyshot')) {
        selectedBat.tags.push('luckyshot');
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function ambush() {
    console.log('EMBUSCADE');
    if (!selectedBat.tags.includes('embuscade')) {
        selectedBat.tags.push('embuscade');
    }
    selectedBat.apLeft = selectedBat.apLeft-2;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function medic(cat,cost,around,deep) {
    console.log('MEDIC SKILL');
    console.log(selectedBatType);
    let denom = 'Soins';
    if (cat != 'infantry') {
        denom = 'Réparations';
    }
    $('#report').empty();
    $('#report').append('<span class="report or">'+selectedBat.type+' ('+denom+')</span><br>');
    let unitIndex;
    let batType;
    let totalAPCost = 0;
    let xpGain = 0.1;
    let apCost = cost;
    if (around) {
        apCost = cost+selectedBatType.squads-selectedBat.squadsLeft;
    }
    let batUnits;
    let newBatUnits;
    let catOK = false;
    let oldSquadsLeft;
    let squadHP;
    let batHP;
    let regen;
    let batHPLeft;
    let fullBat;
    console.log('apCost: '+apCost);
    let maxAPCost = Math.round(selectedBatType.ap*1.5);
    if (around) {
        bataillons.forEach(function(bat) {
            if (totalAPCost < maxAPCost) {
                if (bat.loc === "zone" || (bat.loc === "trans" && bat.locId === selectedBat.id)) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance === 0 || (bat.loc === "trans" && bat.locId === selectedBat.id)) {
                        batType = getBatType(bat);
                        batUnits = bat.squadsLeft*batType.squadSize;
                        if (batType.cat === cat) {
                            catOK = true;
                        } else if (cat === 'any') {
                            catOK = true;
                        } else {
                            catOK = false;
                        }
                        if (catOK) {
                            console.log('catOK');
                            console.log(bat);
                            if (cat === 'infantry') {
                                fullBat = false;
                                batHPLeft = (bat.squadsLeft*batType.squadSize*batType.hp)-bat.damage;
                                if (bat.citoyens >= 1) {
                                    batHP = bat.citoyens*batType.hp;
                                } else {
                                    batHP = batType.squads*batType.squadSize*batType.hp;
                                }
                                if (batHPLeft >= batHP) {
                                    fullBat = true;
                                }
                                if (bat.tags.includes('poison')) {
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('poison');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.10;
                                    tagDelete(bat,'poison');
                                    if (deep) {
                                        tagDelete(bat,'poison');
                                        xpGain = xpGain+0.15;
                                    }
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">poison neutralisé<br></span>');
                                    if (bat.loc === "zone") {
                                        showBataillon(bat);
                                    }
                                    putTagAction(bat);
                                } else if (bat.tags.includes('venin') && (deep || playerInfos.caLevel >= 4)) {
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('venin');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.25;
                                    tagDelete(bat,'venin');
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">venin neutralisé<br></span>');
                                    if (bat.loc === "zone") {
                                        showBataillon(bat);
                                    }
                                    putTagAction(bat);
                                } else if (bat.damage > 0 && !fullBat) {
                                    if (bat.id === selectedBat.id) {
                                        selectedBat.damage = 0
                                    } else {
                                        bat.damage = 0;
                                    }
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('damage');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.15;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">dégâts soignés<br></span>');
                                    if (bat.loc === "zone") {
                                        showBataillon(bat);
                                    }
                                    putTagAction(bat);
                                } else if (bat.squadsLeft < batType.squads-1 && deep && batType.squads >= 10 && !fullBat) {
                                    // double soin pour unités ayant bcp de squads
                                    if (bat.id === selectedBat.id) {
                                        selectedBat.squadsLeft = selectedBat.squadsLeft+2;
                                    } else {
                                        bat.squadsLeft = bat.squadsLeft+2;
                                    }
                                    newBatUnits = batUnits+batType.squadSize+batType.squadSize;
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('squad 10+');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.35;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                                    if (bat.loc === "zone") {
                                        showBataillon(bat);
                                    }
                                    putTagAction(bat);
                                } else if (bat.squadsLeft < batType.squads && deep && !fullBat) {
                                    if (bat.id === selectedBat.id) {
                                        selectedBat.squadsLeft = selectedBat.squadsLeft+1;
                                    } else {
                                        bat.squadsLeft = bat.squadsLeft+1;
                                    }
                                    newBatUnits = batUnits+batType.squadSize;
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('squad');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.35;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                                    if (bat.loc === "zone") {
                                        showBataillon(bat);
                                    }
                                    putTagAction(bat);
                                } else if (((bat.squadsLeft === batType.squads && bat.damage === 0) || fullBat) && bat.tags.includes('parasite') && deep) {
                                    tagDelete(bat,'parasite');
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('parasite');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+1;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">parasite tué<br></span>');
                                    putTagAction(bat);
                                } else if (((bat.squadsLeft === batType.squads && bat.damage === 0) || fullBat) && bat.tags.includes('maladie') && deep) {
                                    tagDelete(bat,'maladie');
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('maladie');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.35;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">maladie guérie<br></span>');
                                    putTagAction(bat);
                                }
                            } else {
                                if (bat.squadsLeft === batType.squads && bat.damage > 0) {
                                    if (bat.id === selectedBat.id) {
                                        selectedBat.damage = 0;
                                    } else {
                                        bat.damage = 0;
                                    }
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('damage');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.15;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">dégâts réparés<br></span>');
                                    if (bat.loc === "zone") {
                                        showBataillon(bat);
                                    }
                                    putTagAction(bat);
                                } else if (bat.squadsLeft < batType.squads && deep) {
                                    if (bat.id === selectedBat.id) {
                                        oldSquadsLeft = selectedBat.squadsLeft;
                                        squadHP = selectedBatType.squadSize*selectedBatType.hp;
                                        batHP = squadHP*selectedBatType.squads;
                                        regen = mecanoHP;
                                        batHPLeft = (selectedBat.squadsLeft*squadHP)-selectedBat.damage+regen;
                                        selectedBat.squadsLeft = Math.ceil(batHPLeft/squadHP);
                                        selectedBat.damage = (selectedBat.squadsLeft*squadHP)-batHPLeft;
                                        if (selectedBat.squadsLeft > selectedBatType.squads) {
                                            selectedBat.squadsLeft = selectedBatType.squads;
                                            selectedBat.damage = 0;
                                        }
                                    } else {
                                        oldSquadsLeft = bat.squadsLeft;
                                        squadHP = batType.squadSize*batType.hp;
                                        batHP = squadHP*batType.squads;
                                        regen = mecanoHP;
                                        batHPLeft = (bat.squadsLeft*squadHP)-bat.damage+regen;
                                        bat.squadsLeft = Math.ceil(batHPLeft/squadHP);
                                        bat.damage = (bat.squadsLeft*squadHP)-batHPLeft;
                                        if (bat.squadsLeft > batType.squads) {
                                            bat.squadsLeft = batType.squads;
                                            bat.damage = 0;
                                        }
                                    }
                                    newBatUnits = batUnits+batType.squadSize;
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('squad');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.35;
                                    if (bat.squadsLeft > oldSquadsLeft) {
                                        $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                                    } else {
                                        $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">dégâts réparés<br></span>');
                                    }
                                    if (bat.loc === "zone") {
                                        showBataillon(bat);
                                    }
                                    putTagAction(bat);
                                } else if (bat.squadsLeft === batType.squads && bat.damage === 0 && bat.tags.includes('trou') && deep) {
                                    tagDelete(bat,'trou');
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('trou');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.35;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">trous bouchés<br></span>');
                                    putTagAction(bat);
                                }
                            }
                        }
                    }
                }
            }
        });
    } else {
        batUnits = selectedBat.squadsLeft*selectedBatType.squadSize;
        if (selectedBat.tags.includes('poison')) {
            totalAPCost = totalAPCost+apCost;
            tagDelete(selectedBat,'poison');
            if (deep) {
                tagDelete(selectedBat,'poison');
            }
            $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">poison neutralisé<br></span>');
            showBataillon(selectedBat);
        } else if (selectedBat.tags.includes('venin') && (deep || playerInfos.caLevel >= 4)) {
            totalAPCost = totalAPCost+apCost;
            tagDelete(bat,'venin');
            $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">venin neutralisé<br></span>');
            showBataillon(bat);
        } else if (selectedBat.damage > 0) {
            selectedBat.damage = 0
            totalAPCost = totalAPCost+apCost;
            if (cat == 'infantry') {
                $('#report').append('<span class="report cy">'+selectedBat.type+'<br></span><span class="report">dégâts soignés<br>');
            } else {
                $('#report').append('<span class="report cy">'+selectedBat.type+'<br></span><span class="report">dégâts réparés<br>');
            }
            showBataillon(selectedBat);
        } else if (selectedBat.squadsLeft < selectedBatType.squads && deep) {
            batUnits = selectedBat.squadsLeft*selectedBatType.squadSize;
            selectedBat.squadsLeft = selectedBat.squadsLeft+1;
            totalAPCost = totalAPCost+apCost;
            newBatUnits = batUnits+selectedBatType.squadSize;
            if (cat == 'buildings') {
                $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">section reconstruite (<span class="cy">'+newBatUnits+'</span>)</span><br>');
            } else {
                $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
            }
            showBataillon(selectedBat);
        } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('trou') && deep) {
            tagDelete(selectedBat,'trou');
            totalAPCost = totalAPCost+apCost;
            $('#report').append('<span class="report">trous bouchés<br></span>');
        } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('parasite') && deep) {
            tagDelete(selectedBat,'parasite');
            totalAPCost = totalAPCost+apCost;
            $('#report').append('<span class="report">parasite tué<br></span>');
        } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('maladie') && deep) {
            tagDelete(selectedBat,'maladie');
            totalAPCost = totalAPCost+apCost;
            $('#report').append('<span class="report">maladie guérie<br></span>');
        }
    }
    console.log('totalAPCost: '+totalAPCost);
    xpGain = Math.round(xpGain*100)/100;
    selectedBat.xp = selectedBat.xp+xpGain;
    selectedBat.apLeft = selectedBat.apLeft-totalAPCost;
    tagDelete(selectedBat,'mining');
    tagAction();
    // selectedBat.salvoLeft = 0;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function numMedicTargets(myBat,cat,around,deep) {
    let numTargets = 0;
    let catOK;
    let myBatType = getBatType(myBat);
    let batType;
    let batHP;
    let batHPLeft;
    let fullBat;
    if (!around) {
        if ((deep || playerInfos.caLevel >= 4) && myBat.tags.includes('venin')) {
            numTargets = numTargets+1;
        } else if (deep) {
            if (myBat.damage > 0 || myBat.squadsLeft < myBatType.squads || myBat.tags.includes('poison') || myBat.tags.includes('venin') || myBat.tags.includes('maladie') || myBat.tags.includes('parasite') || myBat.tags.includes('trou')) {
                numTargets = numTargets+1;
            }
        } else {
            if (myBat.damage > 0 || myBat.tags.includes('poison')) {
                numTargets = numTargets+1;
            }
        }
    } else {
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || (bat.loc === "trans" && bat.locId === myBat.id)) {
                distance = calcDistance(myBat.tileId,bat.tileId);
                if (distance === 0 || (bat.loc === "trans" && bat.locId === myBat.id)) {
                    fullBat = false;
                    batType = getBatType(bat);
                    batHPLeft = (bat.squadsLeft*batType.squadSize*batType.hp)-bat.damage;
                    if (bat.citoyens >= 1) {
                        batHP = bat.citoyens*batType.hp;
                    } else {
                        batHP = batType.squads*batType.squadSize*batType.hp;
                    }
                    if (batHPLeft >= batHP) {
                        fullBat = true;
                    }
                    if (batType.cat === cat) {
                        catOK = true;
                    } else if (cat === 'any') {
                        catOK = true;
                    } else {
                        catOK = false;
                    }
                    if (catOK) {
                        if (deep) {
                            if ((bat.damage > 0 && !fullBat) || (bat.squadsLeft < batType.squads && !fullBat) || bat.tags.includes('poison') || bat.tags.includes('venin') || bat.tags.includes('maladie') || bat.tags.includes('parasite') || bat.tags.includes('trou')) {
                                numTargets = numTargets+1;
                            }
                        } else if (playerInfos.caLevel >= 4 && bat.tags.includes('venin')) {
                            numTargets = numTargets+1;
                        } else {
                            if ((bat.damage > 0 && !fullBat) || bat.tags.includes('poison')) {
                                numTargets = numTargets+1;
                            }
                        }
                    }
                }
            }
        });
    }
    return numTargets;
};

function isHurt(bat) {
    hurt = true;
    batType = getBatType(bat);
    batHPLeft = (bat.squadsLeft*batType.squadSize*batType.hp)-bat.damage;
    if (bat.citoyens >= 1) {
        batHP = bat.citoyens*batType.hp;
    } else {
        batHP = batType.squads*batType.squadSize*batType.hp;
    }
    if (batHPLeft >= batHP) {
        hurt = false;
    }
    return hurt;
};

function armyAssign(batId,army) {
    // le faire avec selectedBat puis arrayUpdate
    // let index = bataillons.findIndex((obj => obj.id == batId));
    // let bat = bataillons[index];
    selectedBat.army = army;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function goDrug(apCost,drug) {
    console.log('DRUG DEAL');
    console.log(selectedBat);
    let batType;
    let ravitBat = {};
    let ravitLeft = 0;
    let biggestRavit = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.skills.includes('dealer') && batType.skills.includes(drug)) {
                ravitLeft = calcRavit(bat);
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
    if (Object.keys(ravitBat).length >= 1) {
        if (biggestRavit < 999) {
            if (ravitBat.id == selectedBat.id) {
                selectedBat.tags.push('skillUsed');
                console.log('sel');
            } else {
                ravitBat.tags.push('skillUsed');
                if (rand.rand(1,2) === 1) {
                    ravitBat.xp = ravitBat.xp+1;
                }
                console.log('nosel');
            }
        }
        selectedBat.apLeft = selectedBat.apLeft-apCost;
        if (!selectedBat.tags.includes(drug)) {
            selectedBat.tags.push(drug);
            // blaze instant bonus
            if (drug === 'blaze') {
                selectedBat.apLeft = selectedBat.apLeft+6;
                selectedBat.salvoLeft = selectedBat.salvoLeft+1;
                console.log('blaze bonus');
            }
            // starka instant bonus
            if (drug === 'starka') {
                selectedBat.apLeft = selectedBat.apLeft+selectedBatType.ap;
                if (selectedBat.apLeft >= selectedBatType.ap+1) {
                    selectedBat.apLeft = selectedBatType.ap+1;
                }
                console.log('starka bonus');
            }
        }
        tagAction();
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
    }
};

function checkDrugs(myBat) {
    let batType;
    let allDrugs = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.skills.includes('dealer')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1 && calcRavit(bat) >= 1) {
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
                    if (batType.skills.includes('skupiac')) {
                        allDrugs.push('skupiac');
                    }
                    if (batType.skills.includes('starka')) {
                        allDrugs.push('starka');
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

function dropMine(apCost,mineType) {
    let unitIndex;
    if (mineType === 'champ') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Champ de mines'));
    } else {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Explosifs'));
    }
    conselUnit = unitTypes[unitIndex];
    conselAmmos = ['xxx','xxx'];
    selectedBat.tags.push('skillUsed');
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    selectedBat.salvoLeft = 0;
    tagAction();
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function clickMine(clicTileId,poseurTileId) {
    let distance = calcDistance(poseurTileId,clicTileId);
    if (distance === 0) {
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
        if (!batHere) {
            putBat(clicTileId,0,0);
            showBatInfos(selectedBat);
        } else {
            conselUnit = {};
            conselAmmos = ['xxx','xxx'];
            $('#unitInfos').empty();
            selectMode();
            batUnstack();
            batUnselect();
        }
    } else {
        console.log('Trop loin');
    }
};
