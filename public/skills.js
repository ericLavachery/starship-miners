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
    if (camChance > 98) {
        camChance = 98;
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
        selectedBat.apLeft = selectedBat.apLeft-Math.floor(selectedBatType.ap/3);
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

function medic(cat,cost,around) {
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
                            if (bat.damage > 0) {
                                if (bat.id === selectedBat.id) {
                                    selectedBat.damage = 0
                                } else {
                                    bat.damage = 0;
                                }
                                totalAPCost = totalAPCost+apCost;
                                xpGain = xpGain+0.45;
                                if (cat == 'infantry') {
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">dégâts soignés<br>');
                                } else {
                                    $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">dégâts réparés<br>');
                                }
                                showBataillon(bat);
                            } else if (bat.squadsLeft < batType.squads) {
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
                            console.log(bat);
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
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function numMedicTargets(myBat,cat) {
    let numTargets = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(myBat.tileId,bat.tileId);
            if (distance === 0) {
                unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
                batType = unitTypes[unitIndex];
                if (batType.cat === cat) {
                    if (bat.damage > 0 || bat.squadsLeft < batType.squads) {
                        numTargets = numTargets+1;
                    }
                }
            }
        }
    });
    return numTargets;
}
