function medic(cat,cost,around,deep,inBld,medicBatId) {
    console.log('MEDIC SKILL');
    console.log(selectedBatType);
    let medicBat = {};
    let medicBatType = {};
    let denom = 'Soins';
    if (cat != 'infantry') {
        denom = 'Réparations';
    }
    washReports();
    if (!inBld) {
        $('#report').append('<span class="report or">'+selectedBat.type+' ('+denom+')</span><br>');
    } else {
        medicBat = getBatById(medicBatId);
        medicBatType = getBatType(medicBat);
        $('#report').append('<span class="report or">'+medicBat.type+' ('+denom+')</span><br>');
    }
    let unitIndex;
    let batType;
    let totalAPCost = 0;
    let xpGain = 0.1;
    let apCost = cost;
    if (around) {
        if (!inBld) {
            apCost = cost+selectedBatType.squads-selectedBat.squadsLeft;
        } else {
            apCost = cost+medicBatType.squads-medicBat.squadsLeft;
        }
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
    let maxAPCost = Math.round(selectedBat.ap*1.5);
    if (inBld) {
        maxAPCost = Math.round(medicBat.ap*1.5);
    }
    if (around) {
        // AROUND
        bataillons.forEach(function(bat) {
            if (totalAPCost < maxAPCost) {
                if (bat.loc === "zone" || bat.loc === "trans") {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance === 0 || (distance === 1 && (selectedBatType.cat === 'buildings' || selectedBatType.skills.includes('transorbital')))) {
                        batType = getBatType(bat);
                        batUnits = bat.squadsLeft*batType.squadSize;
                        if (batType.cat === cat || (batType.cat === 'devices' && cat === 'buildings') || (batType.cat === 'devices' && cat === 'vehicles')) {
                            catOK = true;
                        } else if (cat === 'any') {
                            catOK = true;
                        } else {
                            catOK = false;
                        }
                        if (bat.tags.includes('necro') && playerInfos.comp.med < 3 && !selectedBatType.skills.includes('necrocure') && catOK) {
                            catOK = false;
                            $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">soins inefficaces<br></span>');
                        }
                        let medDice = rand.rand(1,75);
                        let fail = bat.soins-10;
                        if (fail > minFailSoins) {
                            fail = minFailSoins;
                        }
                        if (batType.skills.includes('cyber')) {
                            fail = 0;
                        }
                        if (medDice <= fail && catOK) {
                            catOK = false;
                            totalAPCost = totalAPCost+apCost;
                            $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">soins inefficaces<br></span>');
                        }
                        if (catOK && !batType.skills.includes('norepair')) {
                            console.log('catOK');
                            console.log(bat);
                            if (cat === 'infantry') {
                                // MEDIC (AROUND)
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
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    addHealFlag(bat);
                                    doneAction(bat);
                                } else if (bat.tags.includes('venin') && (deep || playerInfos.comp.med >= 2)) {
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('venin');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.25;
                                    tagDelete(bat,'venin');
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">venin neutralisé<br></span>');
                                    if (bat.loc === "zone") {
                                        showBataillon(bat);
                                    }
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    addHealFlag(bat);
                                    doneAction(bat);
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
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    addHealFlag(bat);
                                    doneAction(bat);
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
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    addHealFlag(bat);
                                    doneAction(bat);
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
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    addHealFlag(bat);
                                    doneAction(bat);
                                } else if (((bat.squadsLeft === batType.squads && bat.damage === 0) || fullBat) && bat.tags.includes('parasite') && deep) {
                                    tagDelete(bat,'parasite');
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('parasite');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+1;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">parasite tué<br></span>');
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    addHealFlag(bat);
                                    doneAction(bat);
                                } else if (((bat.squadsLeft === batType.squads && bat.damage === 0) || fullBat) && bat.tags.includes('maladie') && deep) {
                                    tagDelete(bat,'maladie');
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('maladie');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.35;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">maladie guérie<br></span>');
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    addHealFlag(bat);
                                    doneAction(bat);
                                }
                            } else {
                                // MECANO (AROUND)
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
                                        if (bat.id === selectedBat.id) {
                                            showBataillon(selectedBat);
                                        } else {
                                            showBataillon(bat);
                                        }
                                    }
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    if (batType.skills.includes('fly') && batType.cat === 'vehicles') {
                                        bat.apLeft = bat.apLeft-medicPatientAP;
                                    }
                                    doneAction(bat);
                                } else if (bat.squadsLeft < batType.squads && deep) {
                                    if (bat.id === selectedBat.id) {
                                        oldSquadsLeft = selectedBat.squadsLeft;
                                        squadHP = selectedBatType.squadSize*selectedBatType.hp;
                                        batHP = squadHP*selectedBatType.squads;
                                        if (selectedBatType.cat === 'buildings' || selectedBatType.cat === 'devices') {
                                            regen = mecanoHP*2;
                                        } else if (selectedBatType.skills.includes('robot') && !selectedBatType.skills.includes('roborepair')) {
                                            regen = Math.round(mecanoHP/2.5);
                                        } else {
                                            regen = mecanoHP;
                                        }
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
                                        if (batType.cat === 'buildings' || batType.cat === 'devices') {
                                            regen = mecanoHP*2;
                                        } else if (batType.skills.includes('robot') && !selectedBatType.skills.includes('roborepair')) {
                                            regen = Math.round(mecanoHP/2.5);
                                        } else {
                                            regen = mecanoHP;
                                        }
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
                                        if (bat.id === selectedBat.id) {
                                            showBataillon(selectedBat);
                                        } else {
                                            showBataillon(bat);
                                        }
                                    }
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    if (batType.skills.includes('fly') && batType.cat === 'vehicles') {
                                        bat.apLeft = bat.apLeft-medicPatientAP;
                                    }
                                    doneAction(bat);
                                } else if (bat.squadsLeft === batType.squads && bat.damage === 0 && bat.tags.includes('trou') && deep) {
                                    tagDelete(bat,'trou');
                                    totalAPCost = totalAPCost+apCost;
                                    console.log('trou');
                                    console.log('totalAPCost '+totalAPCost);
                                    xpGain = xpGain+0.35;
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">trous bouchés<br></span>');
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    if (batType.skills.includes('fly') && batType.cat === 'vehicles') {
                                        bat.apLeft = bat.apLeft-medicPatientAP;
                                    }
                                    doneAction(bat);
                                }
                            }
                        }
                    }
                }
            }
        });
    } else {
        // SELF
        batUnits = selectedBat.squadsLeft*selectedBatType.squadSize;
        if (cat === 'infantry') {
            // MEDIC (SELF)
            catOK = true;
            if (selectedBat.tags.includes('necro') && playerInfos.comp.med < 3 && !selectedBatType.skills.includes('necrocure') && catOK) {
                catOK = false;
                $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">soins inefficaces<br></span>');
            }
            let medDice = rand.rand(1,75);
            let fail = selectedBat.soins-10;
            if (fail > minFailSoins) {
                fail = minFailSoins;
            }
            if (selectedBatType.skills.includes('cyber')) {
                fail = 0;
            }
            if (medDice <= fail && catOK) {
                catOK = false;
                totalAPCost = totalAPCost+apCost;
                $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">soins inefficaces<br></span>');
            }
            if (catOK) {
                if (selectedBat.tags.includes('poison')) {
                    totalAPCost = totalAPCost+apCost;
                    tagDelete(selectedBat,'poison');
                    if (deep) {
                        tagDelete(selectedBat,'poison');
                    }
                    $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">poison neutralisé<br></span>');
                    addHealFlag(selectedBat);
                    showBataillon(selectedBat);
                } else if (selectedBat.tags.includes('venin') && (deep || playerInfos.comp.med >= 2)) {
                    totalAPCost = totalAPCost+apCost;
                    tagDelete(bat,'venin');
                    $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">venin neutralisé<br></span>');
                    addHealFlag(selectedBat);
                    showBataillon(bat);
                } else if (selectedBat.damage > 0) {
                    selectedBat.damage = 0
                    totalAPCost = totalAPCost+apCost;
                    if (cat == 'infantry') {
                        $('#report').append('<span class="report cy">'+selectedBat.type+'<br></span><span class="report">dégâts soignés<br>');
                    } else {
                        $('#report').append('<span class="report cy">'+selectedBat.type+'<br></span><span class="report">dégâts réparés<br>');
                    }
                    addHealFlag(selectedBat);
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
                    addHealFlag(selectedBat);
                    showBataillon(selectedBat);
                } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('parasite') && deep) {
                    tagDelete(selectedBat,'parasite');
                    totalAPCost = totalAPCost+apCost;
                    addHealFlag(selectedBat);
                    $('#report').append('<span class="report">parasite tué<br></span>');
                } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('maladie') && deep) {
                    tagDelete(selectedBat,'maladie');
                    totalAPCost = totalAPCost+apCost;
                    addHealFlag(selectedBat);
                    $('#report').append('<span class="report">maladie guérie<br></span>');
                }
            }
        } else {
            // MECANO (SELF)
            if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage > 0) {
                selectedBat.damage = 0
                totalAPCost = totalAPCost+apCost;
                $('#report').append('<span class="report cy">'+selectedBat.type+'<br></span><span class="report">dégâts réparés<br>');
                showBataillon(selectedBat);
            } else if (selectedBat.squadsLeft < selectedBatType.squads && deep) {
                oldSquadsLeft = selectedBat.squadsLeft;
                squadHP = selectedBatType.squadSize*selectedBatType.hp;
                batHP = squadHP*selectedBatType.squads;
                if (selectedBatType.cat === 'buildings' || selectedBatType.cat === 'devices') {
                    regen = mecanoHP*2;
                } else {
                    regen = mecanoHP;
                }
                batHPLeft = (selectedBat.squadsLeft*squadHP)-selectedBat.damage+regen;
                selectedBat.squadsLeft = Math.ceil(batHPLeft/squadHP);
                selectedBat.damage = (selectedBat.squadsLeft*squadHP)-batHPLeft;
                if (selectedBat.squadsLeft > selectedBatType.squads) {
                    selectedBat.squadsLeft = selectedBatType.squads;
                    selectedBat.damage = 0;
                }
                newBatUnits = batUnits+selectedBatType.squadSize;
                totalAPCost = totalAPCost+apCost;
                if (selectedBat.squadsLeft > oldSquadsLeft) {
                    if (cat == 'buildings') {
                        $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">section reconstruite (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                    } else {
                        $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                    }
                } else {
                    $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">dégâts réparés<br></span>');
                }
                showBataillon(selectedBat);
            } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('trou') && deep) {
                tagDelete(selectedBat,'trou');
                totalAPCost = totalAPCost+apCost;
                $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">trous bouchés<br></span>');
            }
        }
    }
    console.log('totalAPCost: '+totalAPCost);
    // xpGain = Math.round(xpGain*100)/100;
    xpGain = xpGain.toFixedNumber(2);
    if (!inBld) {
        if (!selectedBatType.skills.includes('robot') || selectedBat.eq === 'g2ai' || selectedBat.logeq === 'g2ai') {
            selectedBat.xp = selectedBat.xp+xpGain;
            selectedBat.apLeft = selectedBat.apLeft-totalAPCost;
        }
        tagDelete(selectedBat,'mining');
        tagDelete(selectedBat,'guet');
        doneAction(selectedBat);
        selectedBatArrayUpdate();
    } else {
        if (!medicBatType.skills.includes('robot') || medicBat.eq === 'g2ai' || medicBat.logeq === 'g2ai') {
            medicBat.xp = medicBat.xp+xpGain;
            medicBat.apLeft = medicBat.apLeft-totalAPCost;
        }
    }
    showBatInfos(selectedBat);
};

function numMedicTargets(myBat,cat,around,deep,inBat) {
    let numTargets = 0;
    let catOK;
    let myBatType = getBatType(myBat);
    let inBatType = getBatType(inBat);
    let batType;
    let batHP;
    let batHPLeft;
    let fullBat;
    if (!around) {
        if (!myBat.tags.includes('necro') || playerInfos.comp.med >= 3 || myBatType.skills.includes('necrocure')) {
            if ((deep || playerInfos.comp.med >= 2) && myBat.tags.includes('venin')) {
                numTargets = numTargets+1;
            } else if (deep) {
                if (myBat.damage > 0 || myBat.squadsLeft < myBatType.squads || myBat.tags.includes('poison') || myBat.tags.includes('venin') || myBat.tags.includes('maladie') || myBat.tags.includes('parasite') || myBat.tags.includes('trou')) {
                    numTargets = numTargets+1;
                }
            } else {
                if (myBat.damage > 0 || myBat.tags.includes('poison')) {
                    if (cat === 'infantry') {
                        numTargets = numTargets+1;
                    } else if (myBat.squadsLeft === myBatType.squads) {
                        numTargets = numTargets+1;
                    }
                }
            }
        }
    } else {
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
                distance = calcDistance(myBat.tileId,bat.tileId);
                if (distance === 0 || (distance === 1 && (inBatType.cat === 'buildings' || inBatType.skills.includes('transorbital')))) {
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
                    if (batType.cat === cat || (batType.cat === 'devices' && cat === 'buildings') || (batType.cat === 'devices' && cat === 'vehicles')) {
                        catOK = true;
                    } else if (cat === 'any') {
                        catOK = true;
                    } else {
                        catOK = false;
                    }
                    if (bat.tags.includes('necro') && playerInfos.comp.med < 3 && !myBatType.skills.includes('necrocure')) {
                        catOK = false;
                    }
                    if (catOK && !batType.skills.includes('norepair')) {
                        if (deep) {
                            if ((bat.damage > 0 && !fullBat) || (bat.squadsLeft < batType.squads && !fullBat) || bat.tags.includes('poison') || bat.tags.includes('venin') || bat.tags.includes('maladie') || bat.tags.includes('parasite') || bat.tags.includes('trou')) {
                                numTargets = numTargets+1;
                            }
                        } else if (playerInfos.comp.med >= 2 && bat.tags.includes('venin')) {
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

function checkStressEffect(bat) {
    let stress = bat.emo-10;
    let stressCheck = rand.rand(0,stress);
    let distress = Math.round(stress/2)+stressCheck;
    if (bat.tags.includes('terror')) {
        distress = 300;
    }
    let fromTileId = -1;
    if (distress >= 1) {
        let nearby = nearbyAliens(bat);
        if (nearby.one) {
            distress = distress*3;
        } else if (!nearby.two) {
            distress = Math.floor(distress/3);
        }
        if (distress >= stressLevels[3] && !bat.tags.includes('terror')) {
            // Terror
            if (nearby.two) {
                bat.emo = bat.emo+1;
            }
            bat.tags.push('terror');
            fromTileId = getNearestAlienTile(bat.tileId);
            if (fromTileId >= 0) {
                getAway(bat,fromTileId,false);
                warning('Stress',bat.type+' sont terrorisés et ont pris la fuite!',false,bat.tileId);
            } else {
                goFreeze(bat);
                warning('Stress',bat.type+' sont terrorisés!',false,bat.tileId);
            }
        } else if (distress >= stressLevels[2]) {
            // Fear
            if (nearby.two) {
                bat.emo = bat.emo+1;
            }
            fromTileId = getNearestAlienTile(bat.tileId);
            if (fromTileId >= 0) {
                getAway(bat,fromTileId,false);
                warning('Stress',bat.type+' sont affolés et ont pris la fuite!',false,bat.tileId);
            } else {
                goFreeze(bat);
                warning('Stress',bat.type+' sont affolés!',false,bat.tileId);
            }
        } else if (distress >= stressLevels[1]) {
            // Freeze
            if (nearby.two) {
                bat.emo = bat.emo+1;
            }
            goFreeze(bat);
            warning('Stress',bat.type+' sont atterrés!',false,bat.tileId);
        } else if (distress >= stressLevels[0] && nearby.two) {
            // Stress
            bat.emo = bat.emo+1;
            warning('Stress',bat.type+' sont apeurés',false,bat.tileId);
        }
    }
};

function getNearestAlienTile(batTileId) {
    let nearestAlienTile = -1;
    let shortDistance = 999;
    aliens.forEach(function(alien) {
        if (alien.loc === "zone") {
            let distance = calcDistance(batTileId,alien.tileId);
            if (distance <= 4) {
                if (distance < shortDistance) {
                    nearestAlienTile = alien.tileId;
                    shortDistance = distance;
                }
            }
        }
    });
    return nearestAlienTile;
};

function goFreeze(bat) {
    let batType = getBatType(bat);
    if (batType.skills.includes('camo') || (tile.ruins && batType.size < 20) || (tile.infra === 'Terriers' && batType.size < 9) || bat.fuzz <= -2 || bat.eq === 'e-camo' || bat.logeq === 'e-camo' || bat.eq === 'kit-sentinelle' || (bat.eq === 'kit-chouf' && playerInfos.comp.train >= 1) || (bat.eq === 'kit-guetteur' && playerInfos.comp.train >= 1) || bat.eq === 'crimekitgi' || bat.eq === 'crimekitch') {
        if (!bat.tags.includes('camo')) {
            bat.tags.push('camo');
        }
        if (rand.rand(1,3) != 1) {
            bat.fuzz = -2;
        }
    }
    if (bat.apLeft >= 1) {
        bat.apLeft = Math.round(bat.apLeft/2);
    }
};

function deathStress() {
    bataillons.forEach(function(bat) {
        addStressFlag(bat,'death');
    });
};

function addStressFlag(bat,emoType) {
    let batType = getBatType(bat);
    if (batType.crew >= 1 && !batType.skills.includes('robot') && !bat.tags.includes('zombie')) {
        let stressCost = 0;
        if (emoType === 'death') {
            let stressChance = 20000/playerInfos.allCits;
            if (batType.skills.includes('lowstress')) {
                stressChance = Math.round(stressChance/2);
            } else {
                stressChance = Math.ceil(stressChance);
            }
            if (rand.rand(1,100) <= stressChance) {
                stressCost = 11;
            }
        } else if (emoType === 'fear') {
            stressCost = 2;
            if (batType.skills.includes('lowstress')) {
                stressCost = Math.ceil(stressCost/2);
            }
        } else if (emoType === 'turn') {
            let stressChance = (zone[0].mapDiff/1.5)+Math.round(aliens.length/50)-1;
            if (zone[0].planet === 'Sarak' || zone[0].planet === 'Gehenna') {
                stressChance = stressChance*2;
            }
            if (zone[0].planet === 'Horst') {
                stressChance = stressChance*1.5;
            }
            if (batType.skills.includes('lowstress') || bat.tags.includes('schef')) {
                stressChance = stressChance/1.5;
            }
            if (bat.emo != undefined) {
                stressChance = stressChance*(20+bat.emo)/20;
            }
            stressChance = Math.round(stressChance);
            if (rand.rand(1,100) <= stressChance) {
                stressCost = 1;
            }
        }
        if (stressCost >= 1) {
            if (bat.id === selectedBat.id) {
                if (selectedBat.emo != undefined) {
                    selectedBat.emo = selectedBat.emo+stressCost;
                } else {
                    selectedBat.emo = stressCost;
                }
                // selectedBatArrayUpdate();
            } else if (bat.id === targetBat.id) {
                if (bat.emo != undefined) {
                    bat.emo = bat.emo+stressCost;
                } else {
                    bat.emo = stressCost;
                }
                // targetBatArrayUpdate();
            } else {
                if (bat.emo != undefined) {
                    bat.emo = bat.emo+stressCost;
                } else {
                    bat.emo = stressCost;
                }
            }
        }
    }
};

function addHealFlag(bat) {
    let batType = getBatType(bat);
    let healCost = 1;
    if (batType.skills.includes('lowmed')) {
        healCost = 2;
    }
    if (bat.id === selectedBat.id) {
        if (selectedBat.soins != undefined) {
            selectedBat.soins = selectedBat.soins+healCost;
        } else {
            selectedBat.soins = healCost;
        }
    } else {
        if (bat.soins != undefined) {
            bat.soins = bat.soins+healCost;
        } else {
            bat.soins = healCost;
        }
    }
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

function checkRepairBat(tileId) {
    console.log('CHECK REPAIR BAT');
    console.log(tileId);
    let bestRepairBat = {};
    let batType;
    let bestRepairCost = 99;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone' || bat.loc === 'trans') {
            if (bat.tileId === tileId || bat.tileId === tileId+1 || bat.tileId === tileId-1 || bat.tileId === tileId+mapSize || bat.tileId === tileId-mapSize || bat.tileId === tileId+mapSize+1 || bat.tileId === tileId-mapSize+1 || bat.tileId === tileId+mapSize-1 || bat.tileId === tileId-mapSize-1) {
                console.log(bat);
                batType = getBatType(bat);
                if (batType.skills.includes('repair') && bat.apLeft >= Math.round(batType.mecanoCost/2) && batType.mecanoCost < bestRepairCost) {
                    bestRepairCost = batType.mecanoCost;
                    bestRepairBat = bat;
                }
            }
        }
    });
    console.log('Repair Bat');
    console.log(bestRepairBat);
    return bestRepairBat;
}

function diagRepair(repairBatId) {
    let repairBat = getBatById(repairBatId);
    let repairBatType = getBatType(repairBat);
    repairBat.apLeft = repairBat.apLeft-repairBatType.mecanoCost;
    let batUnits = selectedBat.squadsLeft*selectedBatType.squadSize;
    let oldSquadsLeft = selectedBat.squadsLeft;
    let squadHP = selectedBatType.squadSize*selectedBatType.hp;
    let batHP = squadHP*selectedBatType.squads;
    let regen = mecanoHP*2;
    let batHPLeft = (selectedBat.squadsLeft*squadHP)-selectedBat.damage+regen;
    selectedBat.squadsLeft = Math.ceil(batHPLeft/squadHP);
    selectedBat.damage = (selectedBat.squadsLeft*squadHP)-batHPLeft;
    if (selectedBat.squadsLeft > selectedBatType.squads) {
        selectedBat.squadsLeft = selectedBatType.squads;
        selectedBat.damage = 0;
    }
    // selectedBat.apLeft = selectedBat.apLeft-3;
    let newBatUnits = batUnits+selectedBatType.squadSize;
    washReports();
    $('#report').append('<span class="report or">'+selectedBat.type+' (Réparations)</span><br>');
    if (selectedBat.squadsLeft > oldSquadsLeft) {
        $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">section reconstruite (<span class="cy">'+newBatUnits+'</span>)</span><br>');
    } else {
        $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">dégâts réparés<br></span>');
    }
    showBataillon(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
}

function calcBaseSkillCost(bat,batType,medik,inBld) {
    let baseskillCost;
    if (medik) {
        baseskillCost = batType.mediCost;
        if (playerInfos.bldList.includes('Hôpital') && batType.cat != 'buildings') {
            if (baseskillCost >= 5) {
                baseskillCost = Math.ceil(baseskillCost/2);
            } else {
                baseskillCost = baseskillCost-1;
            }
        } else if (playerInfos.bldList.includes('Infirmerie') && batType.cat != 'buildings') {
            baseskillCost = Math.round(baseskillCost*3/4);
        }
        if (bat.eq === 'e-medic' || bat.logeq === 'e-medic') {
            if (baseskillCost >= 7) {
                baseskillCost = Math.round(baseskillCost*3/4);
            } else {
                baseskillCost = baseskillCost-1;
            }
        }
    } else {
        baseskillCost = batType.mecanoCost;
        if (playerInfos.bldList.includes('Usine') && batType.cat != 'buildings') {
            if (baseskillCost >= 5) {
                baseskillCost = Math.ceil(baseskillCost/2);
            } else {
                baseskillCost = baseskillCost-1;
            }
        } else if (playerInfos.bldList.includes('Chaîne de montage') && batType.cat != 'buildings') {
            baseskillCost = Math.round(baseskillCost*3/4);
        } else if (playerInfos.bldList.includes('Garage') && batType.cat != 'buildings' && baseskillCost >= 3) {
            baseskillCost = baseskillCost-1;
        }
        if (bat.eq === 'e-mecano' || bat.logeq === 'e-mecano') {
            if (batType.skills.includes('mecano') || batType.skills.includes('selfmecano')) {
                if (baseskillCost >= 6) {
                    baseskillCost = Math.floor(baseskillCost*3/4);
                } else {
                    baseskillCost = baseskillCost-1;
                }
            }
        }
    }
    if (inBld) {
        baseskillCost = baseskillCost-1;
    }
    if (baseskillCost < 2) {
        baseskillCost = 2;
    }
    return baseskillCost;
};

function bestMedicInBld(bldBat) {
    let medicBat = {};
    let maxMeds = 0;
    let bestMaxMeds = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId === bldBat.id) {
            let batType = getBatType(bat);
            if (batType.skills.includes('medic')) {
                maxMeds = 10*bat.apLeft/batType.mediCost;
                if (maxMeds > bestMaxMeds) {
                    bestMaxMeds = maxMeds;
                    if (maxMeds >= 1) {
                        medicBat = bat;
                    }
                }
            }
        }
    });
    return medicBat;
};

function bestMecanoInBld(bldBat) {
    let medicBat = {};
    let maxMeds = 0;
    let bestMaxMeds = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId === bldBat.id) {
            let batType = getBatType(bat);
            if (batType.skills.includes('mecano')) {
                maxMeds = 10*bat.apLeft/batType.mecanoCost;
                if (maxMeds > bestMaxMeds) {
                    bestMaxMeds = maxMeds;
                    if (maxMeds >= 1) {
                        medicBat = bat;
                    }
                }
            }
        }
    });
    return medicBat;
};

function checkEffSoins(bat) {
    let batType = getBatType(bat);
    let failDice = bat.soins-10;
    if (failDice > minFailSoins) {
        failDice = minFailSoins;
    }
    if (failDice < 0) {
        failDice = 0;
    }
    if (batType.skills.includes('cyber')) {
        fail = 0;
    }
    let effSoins = 100-Math.round(failDice*100/75);
    return effSoins;
};

function checkMecanoSkill(bat,batType) {
    let myMecanoSkill = 'none';
    if (batType.skills.includes('mecano')) {
        myMecanoSkill = 'mecano';
    } else if (batType.skills.includes('selfmecano')) {
        myMecanoSkill = 'selfmecano';
    } else if (batType.skills.includes('badmecano')) {
        if (bat.eq === 'e-mecano' || bat.logeq === 'e-mecano') {
            myMecanoSkill = 'mecano';
        } else {
            myMecanoSkill = 'badmecano';
        }
    } else if (batType.skills.includes('selfbadmecano')) {
        if (bat.eq === 'e-mecano' || bat.logeq === 'e-mecano') {
            myMecanoSkill = 'selfmecano';
        } else {
            myMecanoSkill = 'selfbadmecano';
        }
    } else if (batType.skills.includes('w2mecano') && bat.eq === 'e-mecano') {
        myMecanoSkill = 'badmecano';
    } else {
        if (bat.eq === 'e-mecano' || bat.logeq === 'e-mecano') {
            myMecanoSkill = 'selfbadmecano';
        }
    }
    return myMecanoSkill;
};

function checkMedicSkill(bat,batType) {
    let myMedicSkill = 'none';
    if (batType.skills.includes('medic')) {
        if (bat.eq === 'megafret' && bat.eq === 'megatrans') {
            myMedicSkill = 'badmedic';
        } else {
            myMedicSkill = 'medic';
        }
    } else if (batType.skills.includes('selfmedic')) {
        myMedicSkill = 'selfmedic';
    } else if (batType.skills.includes('badmedic')) {
        if ((bat.eq === 'e-medic' || bat.logeq === 'e-medic') && playerInfos.comp.med >= 3) {
            myMedicSkill = 'medic';
        } else {
            myMedicSkill = 'badmedic';
        }
    } else if (batType.skills.includes('selfbadmedic')) {
        if ((bat.eq === 'e-medic' || bat.logeq === 'e-medic') && playerInfos.comp.med >= 3) {
            myMedicSkill = 'selfmedic';
        } else {
            myMedicSkill = 'selfbadmedic';
        }
    } else {
        if (bat.eq === 'e-medic' || bat.logeq === 'e-medic') {
            myMedicSkill = 'selfbadmedic';
        }
    }
    return myMedicSkill;
};
