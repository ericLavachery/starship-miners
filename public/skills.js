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
                        // unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
                        // batType = unitTypes[unitIndex];
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
                            if (bat.tags.includes('poison')) {
                                totalAPCost = totalAPCost+apCost;
                                xpGain = xpGain+0.15;
                                tagDelete(bat,'poison');
                                if (deep) {
                                    tagDelete(bat,'poison');
                                    xpGain = xpGain+0.30;
                                }
                                $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">poison neutralisé<br></span>');
                                showBataillon(bat);
                            } else if (bat.tags.includes('venin') && deep) {
                                totalAPCost = totalAPCost+apCost;
                                xpGain = xpGain+0.45;
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
                                xpGain = xpGain+0.35;
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
                                xpGain = xpGain+0.85;
                                newBatUnits = batUnits+batType.squadSize;
                                $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                                showBataillon(bat);
                            } else if (bat.squadsLeft === batType.squads && bat.damage === 0 && bat.tags.includes('maladie') && deep) {
                                tagDelete(bat,'maladie');
                                totalAPCost = totalAPCost+apCost;
                                xpGain = xpGain+0.45;
                                $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">maladie guérie<br></span>');
                            } else if (bat.squadsLeft === batType.squads && bat.damage === 0 && bat.tags.includes('trou') && deep) {
                                tagDelete(bat,'trou');
                                totalAPCost = totalAPCost+apCost;
                                xpGain = xpGain+0.45;
                                $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">trous bouchés<br></span>');
                            }
                            // console.log(bat);
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
        } else if (selectedBat.tags.includes('venin') && deep) {
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
        }
        if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('trou')) {
            tagDelete(selectedBat,'trou');
            totalAPCost = totalAPCost+apCost;
            $('#report').append('<span class="report">trous bouchés<br></span>');
        }
        if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('maladie')) {
            tagDelete(selectedBat,'maladie');
            totalAPCost = totalAPCost+apCost;
            $('#report').append('<span class="report">maladie guérie<br></span>');
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
                // unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
                // batType = unitTypes[unitIndex];
                batType = getBatType(bat);
                if (batType.cat === cat) {
                    catOK = true;
                } else if (cat === 'any') {
                    catOK = true;
                } else {
                    catOK = false;
                }
                if (catOK) {
                    if (bat.damage > 0 || bat.squadsLeft < batType.squads || bat.tags.includes('poison') || bat.tags.includes('venin') || bat.tags.includes('maladie') || bat.tags.includes('trou')) {
                        numTargets = numTargets+1;
                    }
                }
            }
        }
    });
    return numTargets;
};

function goRavit(apCost) {
    if (selectedBat.tags.includes('ammoUsed')) {
        // console.log('RAVIT');
        // console.log(selectedBat);
        let batType;
        let ravitBat = {};
        let ravitLeft = 0;
        let biggestRavit = 0;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                batType = getBatType(bat);
                if (batType.skills.includes('ravitaillement')) {
                    ravitLeft = calcRavit(bat);
                    if (calcDistance(selectedBat.tileId,bat.tileId) <= 1 && ravitLeft >= 1) {
                        if (biggestRavit < ravitLeft) {
                            biggestRavit = ravitLeft;
                            ravitBat = bat;
                            // console.log('ravit bat: '+ravitBat.type);
                        }
                    }
                }
            }
        });
        if (Object.keys(ravitBat).length >= 1) {
            if (biggestRavit < 99) {
                if (ravitBat.id == selectedBat.id) {
                    selectedBat.tags.push('skillUsed');
                    // console.log('sel');
                } else {
                    ravitBat.tags.push('skillUsed');
                    if (rand.rand(1,3) === 1) {
                        ravitBat.xp = ravitBat.xp+1;
                    }
                    // console.log('nosel');
                }
            }
            selectedBat.apLeft = selectedBat.apLeft-apCost;
            selectedBat.salvoLeft = 0;
            let i = 1;
            while (i <= 50) {
                if (selectedBat.tags.includes('ammoUsed')) {
                    tagIndex = selectedBat.tags.indexOf('ammoUsed');
                    selectedBat.tags.splice(tagIndex,1);
                } else {
                    break;
                }
                if (i > 50) {break;}
                i++
            }
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
        }
    }
};

function checkRavit(myBat) {
    let batType;
    let anyRavit = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.skills.includes('ravitaillement')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1 && calcRavit(bat) >= 1) {
                    anyRavit = true;
                }
            }
        }
    });
    return anyRavit;
};

function calcRavit(bat) {
    let batType = getBatType(bat);
    let ravitLeft = batType.maxSKill;
    console.log('startRavit='+ravitLeft);
    if (ravitLeft < 99) {
        if (bat.tags.includes('skillUsed')) {
            let allTags = _.countBy(bat.tags);
            ravitLeft = ravitLeft-allTags.skillUsed;
            // console.log(allTags);
            // console.log(allTags.ammoUsed);
        }
    }
    console.log('ravitLeft='+ravitLeft);
    return ravitLeft;
};

function goStock(apCost) {
    if (selectedBat.tags.includes('skillUsed')) {
        let batType;
        let stocktBat = {};
        let stockOK = false;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                batType = getBatType(bat);
                if (batType.skills.includes('stock')) {
                    if (calcDistance(selectedBat.tileId,bat.tileId) <= 1) {
                        stockOK = true;
                        stocktBat = bat;
                    }
                }
            }
        });
        if (stockOK) {
            selectedBat.apLeft = selectedBat.apLeft-apCost;
            selectedBat.salvoLeft = 0;
            let i = 1;
            while (i <= 50) {
                if (selectedBat.tags.includes('skillUsed')) {
                    tagIndex = selectedBat.tags.indexOf('skillUsed');
                    selectedBat.tags.splice(tagIndex,1);
                } else {
                    break;
                }
                if (i > 50) {break;}
                i++
            }
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
        }
    }
};

function checkStock(myBat) {
    let batType;
    let anyStock = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.skills.includes('stock')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                    anyStock = true;
                }
            }
        }
    });
    return anyStock;
};

function armyAssign(batId,army) {
    // le faire avec selectedBat puis arrayUpdate
    let index = bataillons.findIndex((obj => obj.id == batId));
    let bat = bataillons[index];
    bat.army = army;
    showBatInfos(bat);
};

function calcAmmos(bat,startAmmo) {
    let ammoLeft = startAmmo;
    console.log('startAmmo='+startAmmo);
    if (startAmmo < 99) {
        if (bat.tags.includes('ammoUsed')) {
            let allTags = _.countBy(bat.tags);
            ammoLeft = startAmmo-allTags.ammoUsed;
            // console.log(allTags);
            // console.log(allTags.ammoUsed);
        } else {
            ammoLeft = startAmmo;
        }
    }
    console.log('ammoLeft='+ammoLeft);
    return ammoLeft;
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
        if (biggestRavit < 99) {
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
                selectedBat.apLeft = selectedBat.apLeft+8;
                selectedBat.salvoLeft = selectedBat.salvoLeft+1;
                console.log('blaze bonus');
            }
        }
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
            putBat(clicTileId);
            showBatInfos(selectedBat);
        } else {
            console.log('Impossible de superposer 2 bataillons');
        }
    } else {
        console.log('Trop loin');
    }
};
