function guet() {
    selectMode();
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
    selectMode();
    console.log('FORTIFICATION');
    if (!selectedBat.tags.includes('fortif')) {
        selectedBat.tags.push('fortif');
    }
    selectedBat.salvoLeft = 0;
    selectedBat.apLeft = selectedBat.apLeft-selectedBat.ap;
    tagDelete(selectedBat,'mining');
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
    selectMode();
    console.log('TIR CIBLE');
    if (!selectedBat.tags.includes('vise')) {
        selectedBat.tags.push('vise');
    }
    selectedBat.apLeft = selectedBat.apLeft-3;
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

function ambush() {
    selectMode();
    console.log('EMBUSCADE');
    if (!selectedBat.tags.includes('embuscade')) {
        selectedBat.tags.push('embuscade');
    }
    selectedBat.apLeft = selectedBat.apLeft-2;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
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
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('dealer') && batType.skills.includes(drug)) {
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
    if (Object.keys(ravitBat).length >= 1) {
        if (biggestRavit < 999) {
            if (ravitBat.id == selectedBat.id) {
                selectedBat.tags.push('dU');
                console.log('sel');
            } else {
                ravitBat.tags.push('dU');
                if (rand.rand(1,2) === 1) {
                    ravitBat.xp = ravitBat.xp+1;
                }
                console.log('nosel');
            }
        }
        selectedBat.apLeft = selectedBat.apLeft-apCost;
        if (!selectedBat.tags.includes(drug)) {
            selectedBat.tags.push(drug);
            selectedBat.tags.push(drug);
            // blaze instant bonus
            if (drug === 'blaze') {
                selectedBat.apLeft = selectedBat.apLeft+6;
                selectedBat.salvoLeft = selectedBat.salvoLeft+1;
                console.log('blaze bonus');
            }
            // octiron instant bonus
            if (drug === 'octiron') {
                selectedBat.apLeft = selectedBat.apLeft+2;
                console.log('octiron bonus');
            }
            // starka instant bonus
            if (drug === 'starka') {
                selectedBat.apLeft = selectedBat.apLeft+selectedBat.ap;
                if (selectedBat.apLeft >= selectedBat.ap+1) {
                    selectedBat.apLeft = selectedBat.ap+1;
                }
                console.log('starka bonus');
            }
            // kirin instant bonus
            if (drug === 'kirin' && playerInfos.comp.med >= 3) {
                selectedBat.damage = 0;
                console.log('kirin bonus');
            }
            // nitro instant bonus
            if (drug === 'nitro') {
                selectedBat.apLeft = selectedBat.apLeft+Math.round(selectedBat.ap/2);
                if (selectedBat.apLeft >= selectedBat.ap+1) {
                    selectedBat.apLeft = selectedBat.ap+1;
                }
                if (selectedBat.apLeft < 1 && !selectedBat.tags.includes('construction')) {
                    selectedBat.apLeft = 1;
                }
                console.log('nitro bonus');
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
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('dealer')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1 && calcRavitDrug(bat) >= 1) {
                    if (batType.skills.includes('bliss') && playerInfos.drugs.includes('Bliss')) {
                        allDrugs.push('bliss');
                    }
                    if (batType.skills.includes('sila') && playerInfos.drugs.includes('Sila')) {
                        allDrugs.push('sila');
                    }
                    if (batType.skills.includes('blaze') && playerInfos.drugs.includes('Blaze')) {
                        allDrugs.push('blaze');
                    }
                    if (batType.skills.includes('kirin') && playerInfos.drugs.includes('Kirin')) {
                        allDrugs.push('kirin');
                    }
                    if (batType.skills.includes('octiron') && playerInfos.drugs.includes('Octiron')) {
                        allDrugs.push('octiron');
                    }
                    if (batType.skills.includes('skupiac') && playerInfos.drugs.includes('Skupiac')) {
                        allDrugs.push('skupiac');
                    }
                    if (batType.skills.includes('starka') && playerInfos.drugs.includes('Starka')) {
                        allDrugs.push('starka');
                    }
                    if (batType.skills.includes('nitro') && playerInfos.drugs.includes('Nitro')) {
                        allDrugs.push('nitro');
                        console.log(bat);
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
    } else if (mineType === 'piege') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Pièges'));
    }
    conselUnit = unitTypes[unitIndex];
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    selectedBat.tags.push('sU');
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    selectedBat.salvoLeft = 0;
    tagAction();
    tagDelete(selectedBat,'guet');
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
        if (tile.infra != undefined && tile.infra != 'Débris') {
            batHere = true;
        }
        if (!batHere) {
            putBat(clicTileId,0,0);
            showBatInfos(selectedBat);
        } else {
            conselUnit = {};
            conselAmmos = ['xxx','xxx','xxx','xxx'];
            $('#unitInfos').empty();
            selectMode();
            batUnstack();
            batUnselect();
        }
    } else {
        console.log('Trop loin');
    }
};

function checkFreeConsTile(bat) {
    let freeTile = false;
    let distance;
    alienOccupiedTileList();
    playerOccupiedTileList();
    zone.forEach(function(tile) {
        distance = calcDistance(tile.id,bat.tileId);
        if (distance <= 1) {
            if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id) && (tile.infra === undefined || tile.infra === 'Débris')) {
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
