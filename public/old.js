function medicOld(cat,cost,around,deep,inBld,medicBatId) {
    console.log('MEDIC SKILL');
    console.log(selectedBatType);
    let medicBat = {};
    let medicBatType = {};
    let denom = 'Soins';
    if (cat != 'infantry') {
        denom = 'Réparations';
    }
    washReports(false);
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
                        if (batType.cat != 'infantry') {
                            fail = 0;
                        } else if (batType.skills.includes('cyber')) {
                            fail = Math.round(fail/3);
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
                                        showBataillon(bat);
                                        // if (bat.id === selectedBat.id) {
                                        //     showBataillon(selectedBat);
                                        // } else {
                                        //     showBataillon(bat);
                                        // }
                                    }
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    if (batType.skills.includes('fly') && batType.cat === 'vehicles') {
                                        bat.apLeft = bat.apLeft-medicPatientAP;
                                    }
                                    addRepairFlag(bat);
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
                                        showBataillon(bat);
                                        // if (bat.id === selectedBat.id) {
                                        //     showBataillon(selectedBat);
                                        // } else {
                                        //     showBataillon(bat);
                                        // }
                                    }
                                    bat.apLeft = bat.apLeft-medicPatientAP;
                                    if (batType.skills.includes('fly') && batType.cat === 'vehicles') {
                                        bat.apLeft = bat.apLeft-medicPatientAP;
                                    }
                                    addRepairFlag(bat);
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
                                    addRepairFlag(bat);
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
            if (selectedBatType.cat != 'infantry') {
                fail = 0;
            } else if (selectedBatType.skills.includes('cyber')) {
                fail = Math.round(fail/3);
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
                addRepairFlag(selectedBat);
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
                addRepairFlag(selectedBat);
                showBataillon(selectedBat);
            } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('trou') && deep) {
                tagDelete(selectedBat,'trou');
                totalAPCost = totalAPCost+apCost;
                $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">trous bouchés<br></span>');
                addRepairFlag(selectedBat);
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
