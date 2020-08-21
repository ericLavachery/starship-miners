function medic(cat,cost,around,deep) {
    console.log('MEDIC SKILL');
    console.log(selectedBatType);
    let denom = 'Soins';
    if (cat != 'infantry') {
        denom = 'Réparations';
    }
    washReports();
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
    let maxAPCost = Math.round(selectedBat.ap*1.5);
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
                        if (catOK && !batType.skills.includes('norepair')) {
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
                                        if (selectedBatType.cat === 'buildings') {
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
                                    } else {
                                        oldSquadsLeft = bat.squadsLeft;
                                        squadHP = batType.squadSize*batType.hp;
                                        batHP = squadHP*batType.squads;
                                        if (batType.cat === 'buildings') {
                                            regen = mecanoHP*2;
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
        if (cat === 'infantry') {
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
            } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('parasite') && deep) {
                tagDelete(selectedBat,'parasite');
                totalAPCost = totalAPCost+apCost;
                $('#report').append('<span class="report">parasite tué<br></span>');
            } else if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0 && selectedBat.tags.includes('maladie') && deep) {
                tagDelete(selectedBat,'maladie');
                totalAPCost = totalAPCost+apCost;
                $('#report').append('<span class="report">maladie guérie<br></span>');
            }
        } else {
            if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage > 0) {
                selectedBat.damage = 0
                totalAPCost = totalAPCost+apCost;
                $('#report').append('<span class="report cy">'+selectedBat.type+'<br></span><span class="report">dégâts réparés<br>');
                showBataillon(selectedBat);
            } else if (selectedBat.squadsLeft < selectedBatType.squads && deep) {
                oldSquadsLeft = selectedBat.squadsLeft;
                squadHP = selectedBatType.squadSize*selectedBatType.hp;
                batHP = squadHP*selectedBatType.squads;
                if (selectedBatType.cat === 'buildings') {
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
                    if (catOK && !batType.skills.includes('norepair')) {
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

function checkRepairBat(tileId) {
    console.log('CHECK REPAIR BAT');
    console.log(tileId);
    let bestRepairBat = {};
    let batType;
    let bestRepairCost = 99;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            if (bat.tileId === tileId+1 || bat.tileId === tileId-1 || bat.tileId === tileId+mapSize || bat.tileId === tileId-mapSize || bat.tileId === tileId+mapSize+1 || bat.tileId === tileId-mapSize+1 || bat.tileId === tileId+mapSize-1 || bat.tileId === tileId-mapSize-1) {
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
    selectedBat.apLeft = selectedBat.apLeft-3;
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
