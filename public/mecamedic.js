function medic(cat,cost,around,deep,inBld,medicBatId) {
    console.log('MEDIC SKILL');
    console.log(selectedBatType);
    console.log(cat);
    console.log('around='+around);
    console.log('deep='+deep);
    let medicBat = {};
    let medicBatType = {};
    let denom = 'Soins';
    let isMed = true;
    if (cat != 'infantry') {
        denom = 'Réparations';
        isMed = false;
        playSound('repair',0,false);
    } else {
        playSound('relief',-0.2,false);
    }
    let real = false;
    washReports(false);
    let necroSoins = false;
    if (!inBld) {
        $('#report').append('<span class="report or">'+selectedBat.type+' ('+denom+')</span><br>');
        if ((selectedBatType.skills.includes('realmed') && playerInfos.comp.med >= 2) || selectedBatType.skills.includes('medtrans')) {
            real = true;
        }
        if (selectedBatType.skills.includes('necrocure')) {
            if (selectedBatType.cat === 'buildings' || playerInfos.comp.med >= 3) {
                necroSoins = true;
            }
        }
    } else {
        medicBat = getBatById(medicBatId);
        medicBatType = getBatType(medicBat);
        $('#report').append('<span class="report or">'+medicBat.type+' ('+denom+')</span><br>');
        if ((medicBatType.skills.includes('realmed') && playerInfos.comp.med >= 2) || medicBatType.skills.includes('medtrans')) {
            real = true;
        }
    }
    let unitIndex;
    let batType;
    let totalAPCost = 0;
    let xpGain = 0.1;
    let patientAPCost = medicPatientAP;
    if (selectedBatType.skills.includes('fastcure')) {
        patientAPCost = Math.ceil(patientAPCost/2);
    }
    let apCost = cost;
    if (!inBld) {
        apCost = calcAdjSkillCost(1,apCost,selectedBatType,selectedBat,isMed);
    } else {
        apCost = calcAdjSkillCost(1,apCost,medicBatType,medicBat,isMed);
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
    let medRange = 0;
    if (selectedBatType.skills.includes('medrange')) {
        medRange = getMedRange(selectedBat,selectedBatType);
    } else if (selectedBatType.cat === 'buildings' || selectedBatType.skills.includes('transorbital') || (selectedBatType.skills.includes('medtrans') && selectedBat.tags.includes('fortif')) || (inBld && !selectedBatType.skills.includes('inmed'))) {
        medRange = 1;
    } else if (selectedBatType.skills.includes('inmed')) {
        medRange = -1;
    }
    if (around) {
        // AROUND
        bataillons.forEach(function(bat) {
            if (bat.id != selectedBat.id) {
                if (totalAPCost < maxAPCost) {
                    if (bat.loc === "zone" || bat.loc === "trans") {
                        let medRangeOK = isMedRangeOK(medRange,selectedBat,bat);
                        if (medRangeOK) {
                            batType = getBatType(bat);
                            batUnits = bat.squadsLeft*batType.squadSize;
                            if (batType.cat === cat || (batType.cat === 'devices' && cat === 'buildings') || (batType.cat === 'devices' && cat === 'vehicles') || (batType.skills.includes('transorbital') && cat === 'buildings')) {
                                catOK = true;
                            } else if (cat === 'any') {
                                catOK = true;
                            } else {
                                catOK = false;
                            }
                            if (bat.tags.includes('necro') && !necroSoins && catOK) {
                                catOK = false;
                                $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">soins inefficaces<br></span>');
                            }
                            let medDice = rand.rand(1,100);
                            let effSoins = checkEffSoins(bat);
                            if (medDice > effSoins && catOK) {
                                catOK = false;
                                if (batType.cat === 'infantry') {
                                    if (bat.tags.includes('poison') || bat.tags.includes('venin') || bat.damage > 0 || bat.squadsLeft < batType.squads || bat.tags.includes('parasite') || bat.tags.includes('maladie') || bat.tags.includes('vomi') || bat.tags.includes('vomissure')) {
                                        if (effSoins > 0) {
                                            totalAPCost = totalAPCost+apCost;
                                            $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">soins inefficaces<br></span>');
                                        }
                                    }
                                }
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
                                        bat.apLeft = bat.apLeft-patientAPCost;
                                        addHealFlag(bat,2);
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
                                        bat.apLeft = bat.apLeft-patientAPCost;
                                        addHealFlag(bat,3);
                                        doneAction(bat);
                                    } else if (bat.damage > 0 && !fullBat) {
                                        bat.damage = 0;
                                        totalAPCost = totalAPCost+apCost;
                                        console.log('damage');
                                        console.log('totalAPCost '+totalAPCost);
                                        xpGain = xpGain+0.15;
                                        $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">dégâts soignés<br></span>');
                                        if (bat.loc === "zone") {
                                            showBataillon(bat);
                                        }
                                        bat.apLeft = bat.apLeft-patientAPCost;
                                        let healCost = Math.round(bat.damage/(batType.hp*batType.squadSize)*2);
                                        addHealFlag(bat,healCost);
                                        doneAction(bat);
                                    } else if (bat.squadsLeft < batType.squads-1 && deep && batType.squads >= 10 && !fullBat) {
                                        // double soin pour unités ayant bcp de squads
                                        bat.squadsLeft = bat.squadsLeft+2;
                                        newBatUnits = batUnits+batType.squadSize+batType.squadSize;
                                        totalAPCost = totalAPCost+apCost;
                                        console.log('squad 10+');
                                        console.log('totalAPCost '+totalAPCost);
                                        xpGain = xpGain+0.35;
                                        $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                                        if (bat.loc === "zone") {
                                            showBataillon(bat);
                                        }
                                        bat.apLeft = bat.apLeft-patientAPCost;
                                        addHealFlag(bat,2);
                                        doneAction(bat);
                                    } else if (bat.squadsLeft < batType.squads && deep && !fullBat) {
                                        bat.squadsLeft = bat.squadsLeft+1;
                                        newBatUnits = batUnits+batType.squadSize;
                                        totalAPCost = totalAPCost+apCost;
                                        console.log('squad');
                                        console.log('totalAPCost '+totalAPCost);
                                        xpGain = xpGain+0.35;
                                        $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                                        if (bat.loc === "zone") {
                                            showBataillon(bat);
                                        }
                                        bat.apLeft = bat.apLeft-patientAPCost;
                                        addHealFlag(bat,2);
                                        doneAction(bat);
                                    } else if (((bat.squadsLeft === batType.squads && bat.damage === 0) || fullBat) && bat.tags.includes('parasite') && deep) {
                                        tagDelete(bat,'parasite');
                                        totalAPCost = totalAPCost+apCost;
                                        console.log('parasite');
                                        console.log('totalAPCost '+totalAPCost);
                                        xpGain = xpGain+1;
                                        $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">parasite tué<br></span>');
                                        bat.apLeft = bat.apLeft-patientAPCost;
                                        addHealFlag(bat,4);
                                        doneAction(bat);
                                    } else if (((bat.squadsLeft === batType.squads && bat.damage === 0) || fullBat) && (bat.tags.includes('maladie') || bat.tags.includes('vomi') || bat.tags.includes('vomissure')) && deep && real) {
                                        if (bat.tags.includes('vomi') || bat.tags.includes('vomissure')) {
                                            tagDelete(bat,'vomi');
                                            tagDelete(bat,'vomi');
                                            tagDelete(bat,'vomi');
                                            tagDelete(bat,'vomissure');
                                            $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">gangrène guérie<br></span>');
                                        } else {
                                            tagDelete(bat,'maladie');
                                            $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">maladie guérie<br></span>');
                                        }
                                        totalAPCost = totalAPCost+apCost;
                                        console.log('maladie');
                                        console.log('totalAPCost '+totalAPCost);
                                        xpGain = xpGain+0.35;
                                        bat.apLeft = bat.apLeft-patientAPCost;
                                        addHealFlag(bat,2);
                                        doneAction(bat);
                                    }
                                } else {
                                    // MECANO (AROUND)
                                    if (bat.squadsLeft === batType.squads && bat.damage > 0) {
                                        // bat.damage = 0;
                                        oldSquadsLeft = bat.squadsLeft;
                                        squadHP = batType.squadSize*batType.hp;
                                        batHP = squadHP*batType.squads;
                                        if (batType.skills.includes('transorbital')) {
                                            regen = mecanoHP*5;
                                        } else if (batType.cat === 'buildings' || batType.cat === 'devices') {
                                            regen = mecanoHP*2;
                                        } else if (batType.skills.includes('robot') && !selectedBatType.skills.includes('roborepair')) {
                                            regen = Math.round(mecanoHP/3);
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
                                        newBatUnits = batUnits+batType.squadSize;
                                        totalAPCost = totalAPCost+apCost;
                                        console.log('damage');
                                        console.log('totalAPCost '+totalAPCost);
                                        xpGain = xpGain+0.15;
                                        $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">dégâts réparés<br></span>');
                                        if (bat.loc === "zone") {
                                            showBataillon(bat);
                                        }
                                        bat.apLeft = bat.apLeft-medicPatientAP;
                                        if (batType.skills.includes('fly') && batType.cat === 'vehicles') {
                                            bat.apLeft = bat.apLeft-medicPatientAP;
                                        }
                                        // let healCost = Math.round(bat.damage/(batType.hp*batType.squadSize)*2);
                                        // addRepairFlag(bat,healCost);
                                        addRepairFlag(bat,2);
                                        doneAction(bat);
                                    } else if (bat.squadsLeft < batType.squads && deep) {
                                        oldSquadsLeft = bat.squadsLeft;
                                        squadHP = batType.squadSize*batType.hp;
                                        batHP = squadHP*batType.squads;
                                        if (batType.skills.includes('transorbital')) {
                                            regen = mecanoHP*5;
                                        } else if (batType.cat === 'buildings' || batType.cat === 'devices') {
                                            regen = mecanoHP*2;
                                        } else if (batType.skills.includes('robot') && !selectedBatType.skills.includes('roborepair')) {
                                            regen = Math.round(mecanoHP/3);
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
                                        bat.apLeft = bat.apLeft-medicPatientAP;
                                        if (batType.skills.includes('fly') && batType.cat === 'vehicles') {
                                            bat.apLeft = bat.apLeft-medicPatientAP;
                                        }
                                        addRepairFlag(bat,2);
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
                                        addRepairFlag(bat,2);
                                        doneAction(bat);
                                    } else {
                                        if (bat.squadsLeft < batType.squads) {
                                            $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report jaune">bataillon trop entammé<br></span>');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    if (selectedBatType.cat === cat || (selectedBatType.cat === 'devices' && cat === 'buildings') || (selectedBatType.cat === 'devices' && cat === 'vehicles') || (selectedBatType.skills.includes('transorbital') && cat === 'buildings')) {
        catOK = true;
    } else if (cat === 'any') {
        catOK = true;
    } else {
        catOK = false;
    }
    console.log(catOK);
    if (catOK) {
        // SELF
        batUnits = selectedBat.squadsLeft*selectedBatType.squadSize;
        if (cat === 'infantry') {
            // MEDIC (SELF)
            if (selectedBat.tags.includes('necro') && !necroSoins && catOK) {
                catOK = false;
                $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">soins inefficaces<br></span>');
            }
            let medDice = rand.rand(1,100);
            let effSoins = checkEffSoins(selectedBat);
            if (medDice > effSoins && catOK) {
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
                    addHealFlag(selectedBat,2);
                    showBataillon(selectedBat);
                } else if (selectedBat.tags.includes('venin') && (deep || playerInfos.comp.med >= 2)) {
                    totalAPCost = totalAPCost+apCost;
                    tagDelete(bat,'venin');
                    $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">venin neutralisé<br></span>');
                    addHealFlag(selectedBat,3);
                    showBataillon(bat);
                } else if (selectedBat.damage > 0) {
                    selectedBat.damage = 0
                    totalAPCost = totalAPCost+apCost;
                    if (cat == 'infantry') {
                        $('#report').append('<span class="report cy">'+selectedBat.type+'<br></span><span class="report">dégâts soignés<br>');
                    } else {
                        $('#report').append('<span class="report cy">'+selectedBat.type+'<br></span><span class="report">dégâts réparés<br>');
                    }
                    let healCost = Math.round(selectedBat.damage/(selectedBatType.hp*selectedBatType.squadSize)*2);
                    addHealFlag(selectedBat,healCost);
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
                    addHealFlag(selectedBat,2);
                    showBataillon(selectedBat);
                } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('parasite') && deep) {
                    tagDelete(selectedBat,'parasite');
                    totalAPCost = totalAPCost+apCost;
                    addHealFlag(selectedBat,4);
                    $('#report').append('<span class="report">parasite tué<br></span>');
                } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && (selectedBat.tags.includes('maladie') || selectedBat.tags.includes('vomi') || selectedBat.tags.includes('vomissure')) && deep && real) {
                    if (selectedBat.tags.includes('vomi') || selectedBat.tags.includes('vomissure')) {
                        tagDelete(selectedBat,'vomi');
                        tagDelete(selectedBat,'vomi');
                        tagDelete(selectedBat,'vomi');
                        tagDelete(selectedBat,'vomissure');
                        $('#report').append('<span class="report">gangrène guérie<br></span>');
                    } else {
                        tagDelete(selectedBat,'maladie');
                        $('#report').append('<span class="report">maladie guérie<br></span>');
                    }
                    totalAPCost = totalAPCost+apCost;
                    addHealFlag(selectedBat,2);
                }
            }
        } else {
            // MECANO (SELF)
            if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage > 0) {
                // selectedBat.damage = 0
                oldSquadsLeft = selectedBat.squadsLeft;
                squadHP = selectedBatType.squadSize*selectedBatType.hp;
                batHP = squadHP*selectedBatType.squads;
                if (selectedBatType.skills.includes('transorbital')) {
                    regen = mecanoHP*5;
                } else if (selectedBatType.cat === 'buildings' || selectedBatType.cat === 'devices') {
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
                $('#report').append('<span class="report cy">'+selectedBat.type+'<br></span><span class="report">dégâts réparés<br>');
                // let healCost = Math.round(selectedBat.damage/(selectedBatType.hp*selectedBatType.squadSize)*2);
                // addRepairFlag(selectedBat,healCost);
                addRepairFlag(selectedBat,2);
                showBataillon(selectedBat);
            } else if (selectedBat.squadsLeft < selectedBatType.squads && deep) {
                oldSquadsLeft = selectedBat.squadsLeft;
                squadHP = selectedBatType.squadSize*selectedBatType.hp;
                batHP = squadHP*selectedBatType.squads;
                if (selectedBatType.skills.includes('transorbital')) {
                    regen = mecanoHP*5;
                } else if (selectedBatType.cat === 'buildings' || selectedBatType.cat === 'devices') {
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
                addRepairFlag(selectedBat,2);
                showBataillon(selectedBat);
            } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('trou') && deep) {
                tagDelete(selectedBat,'trou');
                totalAPCost = totalAPCost+apCost;
                $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report">trous bouchés<br></span>');
                addRepairFlag(selectedBat,2);
            } else {
                if (selectedBat.squadsLeft < selectedBatType.squads) {
                    $('#report').append('<span class="report cy">'+batUnits+' '+selectedBat.type+'<br></span><span class="report jaune">bataillon trop entammé<br></span>');
                }
            }
        }
    }
    console.log('totalAPCost: '+totalAPCost);
    // xpGain = Math.round(xpGain*100)/100;
    xpGain = xpGain.toFixedNumber(2);
    if (!inBld) {
        if (!selectedBatType.skills.includes('robot') || hasEquip(selectedBat,['g2ai'])) {
            selectedBat.xp = selectedBat.xp+xpGain;
        }
        selectedBat.apLeft = selectedBat.apLeft-totalAPCost;
        // tagDelete(selectedBat,'mining');
        if (selectedBatType.cat != 'buildings' && !selectedBatType.skills.includes('transorbital') && !selectedBatType.skills.includes('freeshot')) {
            tagDelete(selectedBat,'guet');
        }
        doneAction(selectedBat);
        selectedBatArrayUpdate();
    } else {
        if (!medicBatType.skills.includes('robot') || hasEquip(medicBat,['g2ai'])) {
            medicBat.xp = medicBat.xp+xpGain;
        }
        medicBat.apLeft = medicBat.apLeft-totalAPCost;
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
    let real = false;
    if ((myBatType.skills.includes('realmed') && playerInfos.comp.med >= 2) || myBatType.skills.includes('medtrans')) {
        real = true;
    }
    let necroSoins = false;
    if (myBatType.skills.includes('necrocure')) {
        if (myBatType.cat === 'buildings' || playerInfos.comp.med >= 3) {
            necroSoins = true;
        }
    }
    let medRange = 0;
    if (myBatType.skills.includes('medrange')) {
        medRange = getMedRange(myBat,myBatType);
    } else if (inBatType.cat === 'buildings' || inBatType.skills.includes('transorbital') || (inBatType.skills.includes('medtrans') && inBat.tags.includes('fortif')) || (myBat.id != inBat.id && !inBatType.skills.includes('inmed'))) {
        medRange = 1;
    } else if (inBatType.skills.includes('inmed')) {
        medRange = -1;
    }
    if (!around) {
        let effSoins = checkEffSoins(myBat);
        if (effSoins >= 50) {
            if (!myBat.tags.includes('necro') || necroSoins) {
                if ((deep || playerInfos.comp.med >= 2) && myBat.tags.includes('venin')) {
                    numTargets = numTargets+1;
                } else if (deep) {
                    if (myBat.damage > 0 || myBat.squadsLeft < myBatType.squads || myBat.tags.includes('poison') || myBat.tags.includes('venin') || ((myBat.tags.includes('maladie') || myBat.tags.includes('vomi') || myBat.tags.includes('vomissure')) && real) || myBat.tags.includes('parasite') || myBat.tags.includes('trou')) {
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
        }
    } else {
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
                let medRangeOK = isMedRangeOK(medRange,myBat,bat);
                if (medRangeOK) {
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
                    if (batType.cat === cat || (batType.cat === 'devices' && cat === 'buildings') || (batType.cat === 'devices' && cat === 'vehicles') || (batType.skills.includes('transorbital') && cat === 'buildings')) {
                        catOK = true;
                    } else if (cat === 'any') {
                        catOK = true;
                    } else {
                        catOK = false;
                    }
                    if (bat.tags.includes('necro') && !necroSoins) {
                        catOK = false;
                    }
                    let effSoins = checkEffSoins(bat);
                    if (catOK && !batType.skills.includes('norepair') && effSoins >= 50) {
                        if (deep) {
                            if ((bat.damage > 0 && !fullBat) || (bat.squadsLeft < batType.squads && !fullBat) || bat.tags.includes('poison') || bat.tags.includes('venin') || ((bat.tags.includes('maladie') || bat.tags.includes('vomi') || bat.tags.includes('vomissure')) && real) || bat.tags.includes('parasite') || bat.tags.includes('trou')) {
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

function getMedRange(bat,batType) {
    let medRange = 0;
    if (batType.skills.includes('medrange')) {
        if (batType.cat === 'buildings' || batType.cat === 'devices') {
            if (batType.name === 'Hôpital') {
                medRange = 3;
            } else if (batType.name === 'Bar') {
                medRange = 1;
            } else {
                medRange = 2;
            }
        } else {
            if (bat.tags.includes('fortif')) {
                medRange = 2;
            } else {
                medRange = 1;
            }
        }
    }
    return medRange;
};

function isMedRangeOK(medRange,myBat,bat) {
    let medRangeOK = false;
    let distance = calcDistance(myBat.tileId,bat.tileId);
    if (medRange < 0) {
        if (myBat.tileId === bat.tileId) {
            medRangeOK = true;
        }
    } else {
        if (distance <= medRange) {
            medRangeOK = true;
        }
    }
    return medRangeOK;
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
            if (bat.emo != undefined) {
                stressChance = stressChance*(20+bat.emo)/20;
            }
            if (batType.skills.includes('lowstress')) {
                stressChance = Math.ceil(stressChance/2);
            } else {
                stressChance = Math.ceil(stressChance);
            }
            if (rand.rand(1,100) <= stressChance) {
                stressCost = 6;
            }
        } else if (emoType === 'fear') {
            stressCost = 2;
            if (batType.skills.includes('lowstress') || bat.vet >= 4) {
                stressCost = Math.ceil(stressCost/2);
            }
        } else if (emoType === 'turn') {
            let stressChance = Math.round(Math.sqrt(aliens.length)/2);
            if (zone[0].planet === 'Sarak' || zone[0].planet === 'Gehenna') {
                stressChance = stressChance*2;
            }
            if (zone[0].planet === 'Horst') {
                stressChance = stressChance*1.5;
            }
            if (batType.skills.includes('lowstress') || bat.tags.includes('schef') || bat.vet >= 4) {
                stressChance = stressChance/2;
            }
            if (bat.emo != undefined) {
                stressChance = stressChance*(30+bat.emo)/30;
            }
            if (bat.loc === 'trans') {
                let transBat = getBatById(bat.locId);
                let transBatType = getBatType(transBat);
                if (transBatType.cat === 'buildings') {
                    stressChance = stressChance/3;
                }
            }
            stressChance = Math.ceil(stressChance);
            if (rand.rand(1,100) <= stressChance) {
                stressCost = 1;
            }
        }
        if (stressCost >= 1) {
            if (bat.emo != undefined) {
                bat.emo = bat.emo+stressCost;
            } else {
                bat.emo = stressCost;
            }
            if (bat.emo >= 10 && playerInfos.comp.ordre >= 2) {
                warning('Stress',bat.type+' commencent à stresser',false,bat.tileId);
            }
        }
    }
};

function checkStressEffect(bat) {
    let stress = bat.emo-10;
    let stressCheck = rand.rand(0,stress);
    let distress = Math.round(stress/2)+stressCheck;
    if (bat.tags.includes('terror')) {
        distress = 300;
    }
    let fromTileId = -1;
    if (distress >= 1 && !bat.tags.includes('bliss') && !bat.tags.includes('octiron')) {
        let nearby = nearbyAliens(bat);
        let batType = getBatType(bat);
        let isChef = false;
        if (bat.tags.includes('schef') || batType.skills.includes('leader') || batType.skills.includes('prayer')) {
            isChef = true;
        }
        if (nearby.oneTile) {
            distress = distress*3;
        } else if (!nearby.twoTiles) {
            distress = Math.floor(distress/3);
        }
        if (distress >= stressLevels[3] && !bat.tags.includes('terror')) {
            // Terror
            if (nearby.twoTiles) {
                bat.emo = bat.emo+1;
            }
            bat.tags.push('terror');
            fromTileId = getNearestAlienTile(bat.tileId);
            if (fromTileId >= 0 && batType.moveCost < 90) {
                getAway(bat,fromTileId,false);
                warning('Stress',bat.type+' sont terrorisés et ont pris la fuite!',false,bat.tileId);
            } else {
                goFreeze(bat);
                warning('Stress',bat.type+' sont terrorisés!',false,bat.tileId);
            }
        } else if (distress >= stressLevels[2]) {
            // Fear
            if (nearby.twoTiles) {
                bat.emo = bat.emo+1;
            }
            fromTileId = getNearestAlienTile(bat.tileId);
            if (fromTileId >= 0 && batType.moveCost < 90) {
                getAway(bat,fromTileId,false);
                warning('Stress',bat.type+' sont affolés et ont pris la fuite!',false,bat.tileId);
            } else {
                goFreeze(bat);
                warning('Stress',bat.type+' sont affolés!',false,bat.tileId);
            }
        } else if (distress >= stressLevels[1]) {
            // Freeze
            if (nearby.twoTiles) {
                bat.emo = bat.emo+1;
            }
            goFreeze(bat);
            warning('Stress',bat.type+' sont atterrés!',false,bat.tileId);
        } else if (distress >= stressLevels[0] && nearby.twoTiles && !isChef) {
            // Stress
            bat.emo = bat.emo+1;
            warning('Stress',bat.type+' sont stressés',false,bat.tileId);
        }
    }
};

function getAway(myBat,fromTileId,blob) {
    // console.log('getAway');
    // console.log(bat);
    let myBatType = getBatType(myBat);
    let distFromTile;
    let distFromSelf;
    let getAwayTile = -1;
    let inBld = false;
    let transBatId = -1;
    let apCost = 0;
    alienOccupiedTileList();
    playerOccupiedTileList();
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('transport') && batType.cat === 'buildings' && getAwayTile < 0) {
            let tmsOK = checkTransMaxSize(myBatType,bat,batType);
            if (tmsOK) {
                distFromTile = calcDistance(fromTileId,bat.tileId);
                distFromSelf = calcDistance(myBat.tileId,bat.tileId);
                if (distFromSelf <= 2 && distFromTile >= 1) {
                    let batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                    let tracking = checkTracking(bat);
                    if (!myBatType.skills.includes('tracked') || !tracking) {
                        let myBatWeight = calcVolume(myBat,myBatType);
                        if (myBatWeight <= batTransUnitsLeft) {
                            getAwayTile = bat.tileId;
                            apCost = (distFromSelf*5)+2;
                            inBld = true;
                            transBatId = bat.id;
                        }
                    }
                }
            }
        }
    });
    let shufZone = _.shuffle(zone);
    if (getAwayTile < 0) {
        shufZone.forEach(function(tile) {
            distFromTile = calcDistance(fromTileId,tile.id);
            distFromSelf = calcDistance(myBat.tileId,tile.id);
            if (distFromSelf === 1 && distFromTile >= 1 && !playerOccupiedTiles.includes(tile.id) && !alienOccupiedTiles.includes(tile.id) && getAwayTile < 0) {
                getAwayTile = tile.id;
                apCost = 5;
            }
        });
    }
    if (getAwayTile < 0) {
        shufZone.forEach(function(tile) {
            distFromTile = calcDistance(fromTileId,tile.id);
            distFromSelf = calcDistance(myBat.tileId,tile.id);
            if (distFromSelf === 2 && distFromTile >= 1 && !playerOccupiedTiles.includes(tile.id) && !alienOccupiedTiles.includes(tile.id) && getAwayTile < 0) {
                getAwayTile = tile.id;
                apCost = 10;
            }
        });
    }
    if (getAwayTile >= 0) {
        let resHere = showRes(myBat.tileId);
        $('#b'+myBat.tileId).empty().append(resHere);
        myBat.tileId = getAwayTile;
        myBat.apLeft = myBat.apLeft-apCost;
        tagDelete(myBat,'guet');
        tagDelete(myBat,'fortif');
        if (myBat.tags.includes('camo') && !blob) {
            myBat.fuzz = -1;
            tagDelete(myBat,'camo');
        }
        if (!inBld) {
            showBataillon(myBat);
        } else if (transBatId >= 0) {
            loadBat(myBat.id,transBatId);
        }
        if (!blob) {
            warning('Répulsion',myBat.type+' a pris la fuite...',false,getAwayTile);
        } else {
            warning('Vomissure',myBat.type+' a dû fuir pour ne pas être digéré par la vomissure.',false,getAwayTile);
        }
    } else {
        if (!blob) {
            myBat.apLeft = 0-Math.round(myBat.ap/4*3);
            tagDelete(myBat,'guet');
            tagDelete(myBat,'fortif');
            if (myBat.tags.includes('camo')) {
                myBat.fuzz = -1;
            }
            tagDelete(myBat,'camo');
            if (!myBat.tags.includes('stun')) {
                myBat.tags.push('stun');
            }
            warning('Répulsion',myBat.type+' paralysé de peur...',false,myBat.tileId);
        } else {
            let batIndex = bataillons.findIndex((obj => obj.id == myBat.id));
            batDeathEffect(myBat,true,false,'Bataillon digéré',myBat.type+' englouti par la vomissure...');
            bataillons.splice(batIndex,1);
        }
    }
    playerOccupiedTileList();
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
    let tile = getTile(bat);
    if (canCamo(bat,batType,tile)) {
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

function addHealFlag(bat,healCost) {
    let batType = getBatType(bat);
    let medComp = (playerInfos.comp.med+1)*(playerInfos.comp.med+1);
    if (playerInfos.comp.med >= 3) {
        medComp = medComp+2;
    }
    if (playerInfos.bldList.includes('Hôpital')) {
        medComp = medComp+3;
    }
    // let healCost = 2;
    if (batType.skills.includes('lowmed')) {
        healCost = healCost*2;
    }
    if (rand.rand(1,35) <= medComp) {
        healCost = healCost-1;
    }
    if (healCost >= 1) {
        if (bat.soins != undefined) {
            bat.soins = bat.soins+healCost;
        } else {
            bat.soins = healCost;
        }
    }
};

function addRepairFlag(bat,healCost) {
    let batType = getBatType(bat);
    let indComp = (playerInfos.comp.ind+2)*(playerInfos.comp.ind+1);
    // let healCost = 2;
    if (rand.rand(1,25) <= indComp) {
        healCost = healCost-1;
    }
    if (healCost >= 1) {
        if (batType.cat === 'vehicles' || batType.cat === 'buildings' || batType.cat === 'devices') {
            if (bat.soins != undefined) {
                bat.soins = bat.soins+healCost;
            } else {
                bat.soins = healCost;
            }
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
    // console.log('CHECK REPAIR BAT');
    // console.log(tileId);
    let bestRepairBat = {};
    let batType;
    let bestRepairCost = 99;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone' || bat.loc === 'trans') {
            if (bat.tileId === tileId || bat.tileId === tileId+1 || bat.tileId === tileId-1 || bat.tileId === tileId+mapSize || bat.tileId === tileId-mapSize || bat.tileId === tileId+mapSize+1 || bat.tileId === tileId-mapSize+1 || bat.tileId === tileId+mapSize-1 || bat.tileId === tileId-mapSize-1) {
                console.log(bat);
                batType = getBatType(bat);
                let batRepairCost = batType.mecanoCost;
                if (hasEquip(bat,['e-repair'])) {
                    batRepairCost = Math.floor(batRepairCost/3);
                }
                if (batRepairCost < 2) {batRepairCost = 2;}
                if (batType.cat != 'buildings' && batType.cat != 'devices') {
                    if (batType.skills.includes('repair') && bat.apLeft >= Math.round(batRepairCost/2) && batRepairCost < bestRepairCost) {
                        bestRepairCost = batRepairCost;
                        bestRepairBat = bat;
                    }
                }
            }
        }
    });
    // console.log('Repair Bat');
    // console.log(bestRepairBat);
    return bestRepairBat;
}

function diagRepair(repairBatId) {
    let repairBat = getBatById(repairBatId);
    let repairBatType = getBatType(repairBat);
    let batRepairCost = calcBaseSkillCost(repairBat,repairBatType,'repair',false);
    if (batRepairCost < 2) {batRepairCost = 2;}
    repairBat.apLeft = repairBat.apLeft-batRepairCost;
    let batUnits = selectedBat.squadsLeft*selectedBatType.squadSize;
    let oldSquadsLeft = selectedBat.squadsLeft;
    let squadHP = selectedBatType.squadSize*selectedBatType.hp;
    let batHP = squadHP*selectedBatType.squads;
    let regen = mecanoHP*2;
    if (selectedBatType.skills.includes('transorbital')) {
        regen = mecanoHP*5;
    }
    let batHPLeft = (selectedBat.squadsLeft*squadHP)-selectedBat.damage+regen;
    selectedBat.squadsLeft = Math.ceil(batHPLeft/squadHP);
    selectedBat.damage = (selectedBat.squadsLeft*squadHP)-batHPLeft;
    if (selectedBat.squadsLeft > selectedBatType.squads) {
        selectedBat.squadsLeft = selectedBatType.squads;
        selectedBat.damage = 0;
    }
    // selectedBat.apLeft = selectedBat.apLeft-3;
    let newBatUnits = batUnits+selectedBatType.squadSize;
    washReports(false);
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

function calcAdjSkillCost(numTargets,baseskillCost,batType,bat,isMed) {
    let apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
    let fuckSquads = false;
    if (batType.cat === 'buildings') {
        fuckSquads = true;
    } else if (batType.skills.includes('transorbital')) {
        if (isMed) {
            if (hasEquip(bat,['e-medic'])) {
                fuckSquads = true;
            }
        } else {
            if (hasEquip(bat,['e-mecano','e-repair'])) {
                fuckSquads = true;
            }
        }
    }
    if (fuckSquads) {
        let theSquads = bat.squadsLeft+3;
        if (theSquads > batType.squads) {
            theSquads = batType.squads;
        }
        apCost = numTargets*(baseskillCost+batType.squads-theSquads);
    }
    return Math.round(apCost);
};

function calcBaseSkillCost(bat,batType,skill,inBld,bldBat) {
    let baseskillCost;
    if (skill === 'medic') {
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
        if (hasEquip(bat,['e-medic'])) {
            if (baseskillCost >= 7) {
                baseskillCost = Math.round(baseskillCost*3/4);
            } else {
                baseskillCost = baseskillCost-1;
            }
        }
    } else if (skill === 'mecano') {
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
        if (hasEquip(bat,['e-mecano'])) {
            if (batType.skills.includes('mecano') || batType.skills.includes('selfmecano')) {
                if (baseskillCost >= 6) {
                    baseskillCost = Math.floor(baseskillCost*3/4);
                } else {
                    baseskillCost = baseskillCost-1;
                }
                if (batType.skills.includes('transorbital')) {
                    if (baseskillCost >= 6) {
                        baseskillCost = Math.floor(baseskillCost*3/4);
                    } else {
                        baseskillCost = baseskillCost-1;
                    }
                }
            }
        }
    } else if (skill === 'repair') {
        baseskillCost = batType.mecanoCost;
        if (batType.skills.includes('repbad')) {
            baseskillCost = baseskillCost*5;
        }
        if (playerInfos.bldList.includes('Usine') && batType.cat != 'buildings') {
            if (baseskillCost >= 5) {
                baseskillCost = Math.ceil(baseskillCost/2);
            } else {
                baseskillCost = baseskillCost-1;
            }
        } else if (playerInfos.bldList.includes('Chaîne de montage') && batType.cat != 'buildings') {
            baseskillCost = Math.round(baseskillCost*3/4);
        } else if (playerInfos.bldList.includes('Atelier') && batType.cat != 'buildings' && baseskillCost >= 3) {
            baseskillCost = baseskillCost-1;
        }
        if (hasEquip(bat,['e-repair'])) {
            baseskillCost = Math.floor(baseskillCost/3);
        }
    }
    if (inBld) {
        let bldBatType = getBatType(bldBat);
        if (bldBatType.cat === 'buildings') {
            baseskillCost = baseskillCost-1;
        }
    }
    if (baseskillCost < 2) {baseskillCost = 2;}
    return baseskillCost;
};

function bestMedicInBld(bldBat) {
    let medicBat = {};
    let maxMeds = 0;
    let bestMaxMeds = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId === bldBat.id) {
            let batType = getBatType(bat);
            if (batType.cat != 'buildings' && batType.cat != 'devices') {
                if (batType.skills.includes('medic') || (batType.skills.includes('badmedic') && playerInfos.comp.med >= 3 && hasEquip(bat,['e-medic']))) {
                    maxMeds = 10*bat.apLeft/batType.mediCost;
                    if (maxMeds > bestMaxMeds) {
                        bestMaxMeds = maxMeds;
                        if (maxMeds >= 1) {
                            medicBat = bat;
                        }
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
            if (batType.cat != 'buildings' && batType.cat != 'devices') {
                if (batType.skills.includes('mecano') || (batType.skills.includes('badmecano') && hasEquip(bat,['e-mecano']))) {
                    maxMeds = 10*bat.apLeft/batType.mecanoCost;
                    if (maxMeds > bestMaxMeds) {
                        bestMaxMeds = maxMeds;
                        if (maxMeds >= 1) {
                            medicBat = bat;
                        }
                    }
                }
            }
        }
    });
    return medicBat;
};

function checkEffSoins(bat) {
    let batType = getBatType(bat);
    let failDice = 0;
    if (bat.soins != undefined) {
        failDice = bat.soins-10;
    }
    if (failDice < 0) {
        failDice = 0;
    }
    if (batType.cat != 'infantry') {
        failDice = 0;
    } else if (batType.skills.includes('cyber')) {
        failDice = Math.round(failDice/3);
    }
    let effSoins = 100-Math.round(failDice*100/75);
    if (effSoins < 50) {
        effSoins = 0;
    }
    return effSoins;
};

function checkVehiclesAPSoins(bat,batType) {
    let apLoss = 0;
    if (bat.soins >= 11) {
        if (batType.cat === 'vehicles' || batType.cat === 'buildings' || batType.cat === 'devices') {
            apLoss = Math.ceil(batType.ap*(bat.soins-6)/100);
            if (apLoss < 1) {
                apLoss = 1;
            }
        }
    }
    return apLoss;
};

function getMaintenanceCosts(bat,batType) {
    let maintCosts = {};
    let state = (bat.soins*2)-7;
    if (state > 50) {
        state = 50+Math.round((state-50)/5);
    }
    Object.entries(batType.costs).map(entry => {
        let key = entry[0];
        let value = entry[1];
        let thatCost = Math.floor(value*state/100);
        if (key === 'Moteurs') {
            thatCost = Math.ceil(thatCost*2);
        }
        if (key === 'Plastanium') {
            thatCost = Math.ceil(thatCost*3);
        }
        if (thatCost >= 1 && key != 'Spins') {
            maintCosts[key] = thatCost;
        }
    });
    return maintCosts;
};

function getAvMaintCosts(batType) {
    let maintCosts = {};
    if (batType.skills.includes('decay')) {
        Object.entries(batType.costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let thatCost = value*10/100;
            if (batType.skills.includes('robot')) {
                thatCost = Math.floor(thatCost*1.5);
            } else {
                thatCost = Math.floor(thatCost);
            }
            if (key === 'Moteurs') {
                thatCost = Math.ceil(thatCost*2);
            }
            if (key === 'Plastanium') {
                thatCost = Math.ceil(thatCost*3);
            }
            if (thatCost >= 1 && key != 'Spins') {
                maintCosts[key] = thatCost;
            }
        });
    }
    return maintCosts;
};

function maintenance() {
    let maintCosts = getMaintenanceCosts(selectedBat,selectedBatType);
    let maintOK = checkCost(maintCosts);
    if (maintOK) {
        payCost(maintCosts);
        selectedBat.soins = 0;
        playSound('repair',-0.2);
        selectedBatArrayUpdate();
        goSoute();
        showBatInfos(selectedBat);
    }
};

function maintenanceInZone() {
    let maintCosts = getMaintenanceCosts(selectedBat,selectedBatType);
    let maintOK = checkCost(maintCosts);
    if (maintOK) {
        payCost(maintCosts);
        selectedBat.soins = 0;
        selectedBat.apLeft = selectedBat.apLeft-(selectedBat.ap*2);
        if (!selectedBat.tags.includes('construction')) {
            selectedBat.tags.push('construction');
        }
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
    }
};

function checkMecanoSkill(bat,batType) {
    let myMecanoSkill = 'none';
    if (batType.skills.includes('mecano')) {
        myMecanoSkill = 'mecano';
    } else if (batType.skills.includes('selfmecano')) {
        myMecanoSkill = 'selfmecano';
    } else if (batType.skills.includes('badmecano')) {
        if (hasEquip(bat,['e-mecano'])) {
            myMecanoSkill = 'mecano';
        } else {
            myMecanoSkill = 'badmecano';
        }
    } else if (batType.skills.includes('selfbadmecano')) {
        if (hasEquip(bat,['e-mecano'])) {
            myMecanoSkill = 'selfmecano';
        } else {
            myMecanoSkill = 'selfbadmecano';
        }
    } else if (batType.skills.includes('w2mecano') && hasEquip(bat,['e-mecano'])) {
        myMecanoSkill = 'badmecano';
    } else {
        if (hasEquip(bat,['e-mecano'])) {
            if (batType.cat === 'infantry') {
                myMecanoSkill = 'badmecano';
            } else {
                myMecanoSkill = 'selfbadmecano';
            }
        }
    }
    return myMecanoSkill;
};

function checkMedicSkill(bat,batType) {
    let myMedicSkill = 'none';
    if (batType.skills.includes('medic')) {
        myMedicSkill = 'medic';
    } else if (batType.skills.includes('selfmedic')) {
        myMedicSkill = 'selfmedic';
    } else if (batType.skills.includes('badmedic')) {
        if (hasEquip(bat,['e-medic']) && playerInfos.comp.med >= 3) {
            myMedicSkill = 'medic';
        } else {
            myMedicSkill = 'badmedic';
        }
    } else if (batType.skills.includes('selfbadmedic')) {
        if (hasEquip(bat,['e-medic']) && playerInfos.comp.med >= 3) {
            myMedicSkill = 'selfmedic';
        } else {
            myMedicSkill = 'selfbadmedic';
        }
    } else {
        if (hasEquip(bat,['e-medic'])) {
            myMedicSkill = 'selfbadmedic';
        }
    }
    return myMedicSkill;
};

function checkMedBld(bat,batType) {
    let canBeMedBld = false;
    if (batType.cat === 'buildings' || batType.skills.includes('transorbital') || batType.skills.includes('stable') || batType.skills.includes('inmed')) {
        canBeMedBld = true;
    } else if (batType.cat === 'vehicles' && !batType.skills.includes('fly')) {
        if (bat.tags.includes('fortif') || batType.skills.includes('canmed')) {
            if (batType.skills.includes('medtrans') || batType.skills.includes('canmed')) {
                canBeMedBld = true;
            } else if (batType.skills.includes('ouvert')) {
                if (batType.transUnits >= 700) {
                    canBeMedBld = true;
                }
            } else {
                if (batType.transUnits >= 500) {
                    canBeMedBld = true;
                }
            }
        }
    }
    return canBeMedBld;
};

function checkMedTrans(bat,batType) {
    let medicTrans = false;
    if (batType.transUnits >= 1) {
        let isMedic = false;
        if (batType.skills.includes('medic')) {
            isMedic = true;
        }
        if (batType.skills.includes('badmedic') && playerInfos.comp.med >= 3) {
            if (hasEquip(bat,['e-medic'])) {
                isMedic = true;
            }
        }
        if (batType.skills.includes('medtrans')) {
            medicTrans = true;
        } else if (isMedic) {
            bataillons.forEach(function(inBat) {
                if (inBat.loc === "trans" && inBat.locId === bat.id) {
                    let inBatType = getBatType(inBat);
                    if (inBatType.skills.includes('realmed')) {
                        medicTrans = true;
                    }
                }
            });
        }
    }
    return medicTrans;
};

function checkRegeneration(myBat,myBatType,resistance,allTags) {
    let ar = {};
    if (myBat.damage >= 1 || myBat.squadsLeft < myBatType.squads) {
        if (myBat.tags.includes('kirin') || myBat.tags.includes('genreg') || hasEquip(myBat,['permakirin']) || myBat.tags.includes('regeneration') || myBatType.skills.includes('regeneration') || myBatType.skills.includes('slowreg') || myBat.tags.includes('slowreg') || myBatType.skills.includes('fastreg') || myBatType.skills.includes('heal') || resistance) {
            let regOK = true;
            if (myBatType.cat === 'aliens') {
                if (myBatType.skills.includes('reactpoison') && myBat.tags.includes('poison')) {
                    regOK = false;
                }
                if (myBat.tags.includes('necro')) {
                    regOK = false;
                }
            } else if (myBat.tags.includes('necro') || myBat.tags.includes('venin')) {
                regOK = false;
            }
            if (regOK) {
                let squadHP = myBatType.squadSize*myBatType.hp;
                let myBatHP = squadHP*myBatType.squads;
                if (myBat.citoyens >= 1) {
                    myBatHP = myBat.citoyens*myBatType.hp;
                }
                let regen;
                if (myBatType.skills.includes('heal')) {
                    regen = myBatHP;
                } else if (myBatType.skills.includes('fastreg')) {
                    regen = myBatHP/2;
                } else if (myBat.tags.includes('kirin') || myBat.tags.includes('genreg') || myBatType.skills.includes('regeneration') || myBat.tags.includes('regeneration')) {
                    regen = myBatHP*regenPower/100;
                } else if (!resistance) {
                    regen = myBatHP*slowregPower/100;
                    if (regen > 300) {
                        regen = 300;
                    }
                } else {
                    regen = myBatHP*slowregPower/200;
                    if (regen > 50) {
                        regen = 50;
                    }
                }
                regen = regen/(allTags.poison+5)*5;
                if (myBat.tags.includes('shinda')) {
                    regen = regen/4;
                }
                regen = Math.ceil(regen*(myBat.squadsLeft+9)/(myBatType.squads+9));
                if (regen < 1) {regen = 1;}
                // console.log('regeneration='+regen);
                let myBatHPLeft = (myBat.squadsLeft*squadHP)-myBat.damage+regen;
                if (myBatHPLeft > myBatHP) {
                    myBatHPLeft = myBatHP;
                }
                myBat.squadsLeft = Math.ceil(myBatHPLeft/squadHP);
                myBat.damage = (myBat.squadsLeft*squadHP)-myBatHPLeft;
                if (myBat.squadsLeft > myBatType.squads) {
                    myBat.squadsLeft = myBatType.squads;
                    myBat.damage = 0;
                }
            }
        }
    }
    ar.damage = myBat.damage;
    ar.squadsLeft = myBat.squadsLeft;
    return ar;
}

function checkAutoRepair(myBat,myBatType) {
    let ar = {};
    if (myBat.damage >= 1 || myBat.squadsLeft < myBatType.squads) {
        let squadHP = myBatType.squadSize*myBatType.hp;
        let myBatHP = squadHP*myBatType.squads;
        let theRep = myBatHP*autoRepPower/100;
        theRep = Math.ceil(theRep*myBat.squadsLeft/myBatType.squads);
        console.log('AUTOREPAIR');
        console.log(myBat);
        console.log('theRep = '+theRep);
        let myBatHPLeft = (myBat.squadsLeft*squadHP)-myBat.damage+theRep;
        if (myBatHPLeft > myBatHP) {
            myBatHPLeft = myBatHP;
        }
        myBat.squadsLeft = Math.ceil(myBatHPLeft/squadHP);
        myBat.damage = (myBat.squadsLeft*squadHP)-myBatHPLeft;
        if (myBat.squadsLeft > myBatType.squads) {
            myBat.squadsLeft = myBatType.squads;
            myBat.damage = 0;
        }
    }
    ar.damage = myBat.damage;
    ar.squadsLeft = myBat.squadsLeft;
    return ar;
};

function savingThrow(bat,batType,damage,potency) {
    let saved = false;

    return saved;
};
