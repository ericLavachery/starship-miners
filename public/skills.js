function guet() {
    console.log('GUET');
    if (!selectedBat.tags.includes('guet')) {
        selectedBat.tags.push('guet');
    }
    selectedBat.salvoLeft = 0;
    selectedBat.apLeft = selectedBat.apLeft-3;
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
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function camouflage(free) {
    console.log('MODE FURTIF');
    if (!selectedBat.tags.includes('camo')) {
        selectedBat.tags.push('camo');
    }
    let stealth = getStealth(selectedBat);
    let terrain = getTerrain(selectedBat);
    if (terrain.veg >= 1) {
        stealth = stealth+terrain.veg+terrain.veg+2;
    }
    console.log('stealth '+stealth);
    let camOK = false;
    let camDice = rand.rand(1,100);
    let camChance = Math.round(Math.sqrt(stealth)*19);
    if (camChance > stealthMaxChance) {
        camChance = stealthMaxChance;
    }
    console.log('camChance '+camChance);
    if (camDice <= camChance) {
        camOK = true;
        selectedBat.fuzz = -2;
    } else {
        if (free) {
            camOK = false;
            selectedBat.fuzz = -1;
        } else {
            if (selectedBat.fuzz > -2) {
                camOK = false;
                selectedBat.fuzz = -1;
            } else {
                camOK = true;
                selectedBat.fuzz = -2;
            }
        }
    }
    if (!free) {
        selectedBat.apLeft = selectedBat.apLeft-Math.floor(selectedBatType.ap/2);
    }
    console.log(camOK);
    console.log(selectedBat.fuzz);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function camoOut() {
    console.log('MODE NON FURTIF');
    if (selectedBat.tags.includes('camo')) {
        tagIndex = selectedBat.tags.indexOf('camo');
        selectedBat.tags.splice(tagIndex,1);
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
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

function ambush() {
    console.log('EMBUSCADE');
    if (!selectedBat.tags.includes('embuscade')) {
        selectedBat.tags.push('embuscade');
    }
    selectedBat.apLeft = selectedBat.apLeft-Math.ceil(selectedBatType.ap/2);
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
    let apCost = cost+selectedBatType.squads-selectedBat.squadsLeft;
    let batUnits;
    let newBatUnits;
    let catOK = false;
    console.log('apCost: '+apCost);
    let maxAPCost = Math.round(selectedBatType.ap*1.5);
    if (around) {
        bataillons.forEach(function(bat) {
            if (apCost < maxAPCost) {
                if (bat.loc === "zone") {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance === 0) {
                        unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
                        batType = unitTypes[unitIndex];
                        batUnits = bat.squadsLeft*batType.squadSize;
                        if (batType.cat === cat) {
                            catOK = true;
                        } else if (cat === 'vehicles' && batType.cat === 'buildings') {
                            catOK = true;
                        } else {
                            catOK = false;
                        }
                        if (catOK) {
                            if (bat.tags.includes('poison')) {
                                totalAPCost = totalAPCost+apCost;
                                xpGain = xpGain+0.45;
                                tagDelete(bat,'poison');
                                $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">poison neutralisé<br></span>');
                                showBataillon(bat);
                            } else if (bat.tags.includes('venin') && deep) {
                                totalAPCost = totalAPCost+apCost;
                                xpGain = xpGain+1;
                                tagDelete(bat,'venin');
                                $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">venin neutralisé<br></span>');
                                showBataillon(bat);
                            } else if (bat.damage > 0) {
                                if (bat.id === selectedBat.id) {
                                    selectedBat.damage = 0
                                } else {
                                    bat.damage = 0;
                                }
                                totalAPCost = totalAPCost+apCost;
                                xpGain = xpGain+0.45;
                                if (cat == 'infantry') {
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">dégâts soignés<br></span>');
                                } else {
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">dégâts réparés<br></span>');
                                }
                                showBataillon(bat);
                            } else if (bat.squadsLeft < batType.squads && deep) {
                                if (bat.id === selectedBat.id) {
                                    selectedBat.squadsLeft = selectedBat.squadsLeft+1;
                                } else {
                                    bat.squadsLeft = bat.squadsLeft+1;
                                }
                                totalAPCost = totalAPCost+apCost;
                                xpGain = xpGain+1;
                                newBatUnits = batUnits+batType.squadSize;
                                $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                                showBataillon(bat);
                            }
                            if (bat.squadsLeft === batType.squads && bat.damage === 0 && bat.tags.includes('trou')) {
                                tagDelete(bat,'trou');
                                $('#report').append('<span class="report">trous bouchés<br></span>');
                            }
                            if (bat.squadsLeft === batType.squads && bat.damage === 0 && bat.tags.includes('maladie') && deep) {
                                tagDelete(bat,'maladie');
                                $('#report').append('<span class="report">maladie guérie<br></span>');
                            }
                            // console.log(bat);
                        }
                    }
                }
            }
        });
    } else {
        if (selectedBat.damage > 0) {
            selectedBat.damage = 0
            totalAPCost = totalAPCost+apCost;
            if (cat == 'infantry') {
                $('#report').append('<span class="report cy">'+bat.type+'<br></span><span class="report">dégâts soignés<br>');
            } else {
                $('#report').append('<span class="report cy">'+bat.type+'<br></span><span class="report">dégâts réparés<br>');
            }
            showBataillon(selectedBat);
        } else if (selectedBat.squadsLeft < selectedBatType.squads) {
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
        }
    }
    console.log('totalAPCost: '+totalAPCost);
    selectedBat.xp = selectedBat.xp+Math.round(xpGain);
    selectedBat.apLeft = selectedBat.apLeft-totalAPCost;
    selectedBat.salvoLeft = 0;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function numMedicTargets(myBat,cat) {
    let numTargets = 0;
    let catOK;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(myBat.tileId,bat.tileId);
            if (distance === 0) {
                unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
                batType = unitTypes[unitIndex];
                if (batType.cat === cat) {
                    catOK = true;
                } else if (cat === 'vehicles' && batType.cat === 'buildings') {
                    catOK = true;
                } else {
                    catOK = false;
                }
                if (catOK) {
                    if (bat.damage > 0 || bat.squadsLeft < batType.squads) {
                        numTargets = numTargets+1;
                    }
                }
            }
        }
    });
    return numTargets;
};

function armyAssign(batId,army) {
    let index = bataillons.findIndex((obj => obj.id == batId));
    let bat = bataillons[index];
    bat.army = army;
    showBatInfos(bat);
};

function calcAmmos(bat,startAmmo) {
    let ammoLeft = startAmmo;
    console.log('startAmmo='+startAmmo);
    if (startAmmo === 1) {
        if (bat.tags.includes('x1')) {
            ammoLeft = 0;
        }
    } else if (startAmmo === 4) {
        if (bat.tags.includes('x4')) {
            let allTags = _.countBy(bat.tags);
            ammoLeft = 4-allTags.x4;
            console.log(allTags);
            console.log(allTags.x4);
        } else {
            ammoLeft = startAmmo;
        }
    }
    console.log('ammoLeft='+ammoLeft);
    return ammoLeft;
};
