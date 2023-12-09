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
    let weap = selectedBatType.weapon;
    reloadSound(weap);
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
    playSound('fortif',-0.1);
    tagDelete(selectedBat,'mining');
    let tile = getTile(selectedBat);
    if (tile.infra === undefined) {
        camoReCheck(5);
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,false);
};

function checkSecretPass(bat) {
    let batType = getBatType(bat);
    let mvCost = batType.moveCost;
    if (batType.skills.includes('jetpack') || batType.skills.includes('fly') || bat.eq === 'e-jetpack') {
        mvCost = 3;
    }
    let secretPass = {};
    secretPass.ok = false;
    secretPass.ap = 99;
    secretPass.exit = -1;
    let numExits = 0;
    alienOccupiedTileList();
    playerOccupiedTileList();
    zone.forEach(function(tile) {
        if (tile.infra != undefined) {
            if (tile.infra === 'Terriers') {
                if (playerInfos.showedTiles.includes(tile.id)) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        let distance = calcDistanceSquare(tile.id,bat.tileId);
                        if (distance <= 7) {
                            numExits++;
                            secretPass.exit = tile.id;
                            secretPass.ok = true;
                            let realDistance = calcDistance(tile.id,bat.tileId);
                            secretPass.ap = 1+Math.round(realDistance*mvCost*moveTuning*1.1);
                        }
                    }
                }
            }
        }
    });
    if (numExits != 1) {
        secretPass.ok = false;
        secretPass.ap = 99;
        secretPass.exit = -1;
    }
    return secretPass;
};

function goSecretPass() {
    let secretPass = checkSecretPass(selectedBat);
    console.log('SECRET PASSAGE');
    console.log(secretPass);
    if (secretPass.ok && secretPass.exit >= 0) {
        selectedBat.apLeft = selectedBat.apLeft-secretPass.ap;
        moveSelectedBat(secretPass.exit,true,true);
        selectedBat.fuzz = -2;
        if (!selectedBat.tags.includes('camo')) {
            selectedBat.tags.push('camo');
        }
        showBataillon(selectedBat);
        showBatInfos(selectedBat);
        selectedBatArrayUpdate();
    }
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

function goTakeOut() {
    selectedBat.apLeft = selectedBat.apLeft-5;
    if (!selectedBat.tags.includes('takeout')) {
        selectedBat.tags.push('takeout');
    }
    removeNoMoves(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,false);
};

function goCommand(chefBatId,gainPA) {
    selectedBat.apLeft = selectedBat.apLeft+gainPA;
    if (playerInfos.comp.ordre >= 2 && selectedBat.apLeft >= 1) {
        let salvoDice = 23-(playerInfos.comp.ordre*playerInfos.comp.ordre*2);
        if (rand.rand(1,salvoDice) === 1) {
            selectedBat.salvoLeft = selectedBat.salvoLeft+1;
        }
    }
    selectedBat.tags.push('gogogo');
    let chefBat = getBatById(chefBatId);
    chefBat.apLeft = chefBat.apLeft-1;
    chefBat.tags.push('command');
    playSound('gogogo',-0.2);
    // doneAction(chefBat);
    // doneAction(selectedBat);
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
        if (bat.tileId != myBat.tileId && bat.apLeft >= 1) {
            let distance = calcDistance(bat.tileId,myBat.tileId);
            if (distance <= 1) {
                let batType = getBatType(bat);
                if (batType.skills.includes('treuil') || hasEquip(bat,['e-treuil'])) {
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
        leTreuil.pa = leTreuil.pa+2;
    }
    return leTreuil;
};

function goTreuil(treuilBatId,gainPA) {
    selectedBat.apLeft = selectedBat.apLeft+gainPA;
    selectedBat.salvoLeft = 0;
    let treuilBat = getBatById(treuilBatId);
    treuilBat.apLeft = treuilBat.apLeft-4;
    camoReCheck();
    playSound('winch',-0.2,false);
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
        }
        if (medComp >= 2) {
            tagDelete(selectedBat,'parasite');
            tagDelete(selectedBat,'necro');
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'poison');
            selectedBat.emo = selectedBat.emo-3;
        }
        if (medComp === 3) {
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'poison');
            tagDelete(selectedBat,'vomi');
            tagDelete(selectedBat,'vomi');
            tagDelete(selectedBat,'vomi');
            selectedBat.emo = selectedBat.emo-3;
        }
        if (selectedBat.emo < 0) {
            selectedBat.emo = 0;
        }
        playSound('potion',-0.2);
        doneAction(selectedBat);
        selectedBatArrayUpdate();
        showMap(zone,true);
        showBatInfos(selectedBat);
    }
};

function diversion() {
    aliens.forEach(function(alien) {
        let alienType = getBatType(alien);
        if (alienType.moveCost < 90 && !alien.tags.includes('freeze')) {
            let distance = calcDistance(selectedBat.tileId,alien.tileId);
            if (distance <= 6) {
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
    selectedBat.tags.push('lasso');
    playSound('toxcloches',-0.2);
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

function getTamingId(myBat,myBatType) {
    let tamingId = -1;
    aliens.forEach(function(alien) {
        if (tamingId < 0) {
            let alienType = getBatType(alien);
            if (alienType.name === "Meatballs") {
                if (alien.apLeft <= -7) {
                    let distance = calcDistance(myBat.tileId,alien.tileId);
                    if (distance === 0) {
                        tamingId = alien.id;
                    }
                }
            }
        }
    });
    return tamingId;
};

function taming(tamingId) {
    let tamedAlien = getAlienById(tamingId);
    let tamingChance = ((selectedBat.vet*4)+selectedBat.apLeft+4)*3;
    if (rand.rand(1,100) > tamingChance) {
        playSound('yeebof',-0.2);
        tamedAlien.apLeft = 15+rand.rand(0,6);
        tamedAlien.salvoLeft = 1;
        tamedAlien.tags.push('rage');
        tamedAlien.tags.push('rage');
    } else {
        playSound('yeehaw',-0.2);
        let petSquadsLeft = tamedAlien.squadsLeft;
        let petDamage = tamedAlien.damage;
        let tileId = tamedAlien.tileId;
        deleteAlien(tamingId);
        let meatBatType = getBatTypeById(289);
        conselUnit = meatBatType;
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['dents','xxx','aucune','aucun'];
        putBat(tileId,0,0,'',false);
        let newPet = getBatByTileId(tileId);
        newPet.apLeft = -7;
        newPet.squadsLeft = petSquadsLeft;
        newPet.damage = petDamage;
    }
    selectedBat.apLeft = selectedBat.apLeft-20;
    selectedBat.xp = selectedBat.xp+5;
    selectedBat.tags.push('tame');
    camoOut();
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,false);
};

function rush(rushAP) {
    selectedBat.apLeft = selectedBat.apLeft+rushAP;
    selectedBat.tags.push('rush');
    selectedBat.tags.push('rush');
    playSound('rush',-0.1);
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function rage() {
    selectedBat.tags.push('rage');
    selectedBat.tags.push('norage');
    selectedBat.tags.push('norage');
    selectedBat.tags.push('norage');
    // doneAction(selectedBat);
    playSound('rage',-0.2);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function fougue() {
    selectedBat.salvoLeft = selectedBat.salvoLeft+1;
    selectedBat.tags.push('nofougue');
    selectedBat.tags.push('nofougue');
    selectedBat.tags.push('nofougue');
    // doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function instaKill() {
    selectedBat.tags.push('kill');
    if (selectedBatType.skills.includes('herominik')) {
        selectedBat.tags.push('nokill');
        selectedBat.tags.push('nokill');
        selectedBat.tags.push('nokill');
    } else {
        selectedBat.tags.push('nokill');
    }
    playSound('ikill',-0.2);
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function tornade() {
    selectedBat.tags.push('tornade');
    selectedBat.tags.push('notorn');
    selectedBat.tags.push('notorn');
    if (selectedBatType.weapon.name === 'Minigun') {
        selectedBat.tags.push('notorn');
    }
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function getConstAPReq(bat,batType) {
    let meca = 16;
    if (batType.mecanoCost != undefined) {
        meca = batType.mecanoCost;
    }
    let apReq = 4+Math.floor(meca/4)-playerInfos.comp.const;
    if (apReq > 6) {
        apReq = 6
    }
    return apReq;
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
    if (inSoute) {
        goSoute();
    }
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
    camoOut();
    playSound('satan',-0.2);
    tagDelete(selectedBat,'guet');
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function canCamo(bat,batType,tile,near) {
    if (near === undefined) {
        near = nearWhat(bat,batType);
    }
    let iCanCamo = false;
    if (batType.skills.includes('camo')) {
        iCanCamo = true;
    }
    if (batType.skills.includes('aicamo')) {
        if (playerInfos.comp.cam >= 1) {
            if (hasEquip(bat,['g2ai'])) {
                iCanCamo = true;
            }
        }
    }
    if (tile.infra === 'Terriers') {
        if (batType.size < 9) {
            iCanCamo = true;
        }
    }
    if (tile.ruins) {
        if (batType.size < 20) {
            if (batType.skills.includes('robot')) {
                if (hasEquip(bat,['g2ai'])) {
                    iCanCamo = true;
                }
                if (batType.skills.includes('aicamo') && playerInfos.comp.cam >= 1) {
                    iCanCamo = true;
                }
            } else if (batType.skills.includes('dog')) {
                if (playerInfos.comp.cam >= 1) {
                    iCanCamo = true;
                }
            } else {
                iCanCamo = true;
            }
        }
    }
    if (tile.terrain === 'F') {
        if (batType.size < 20) {
            if (batType.skills.includes('robot')) {
                if (playerInfos.comp.cam >= 1) {
                    if (hasEquip(bat,['g2ai'])) {
                        iCanCamo = true;
                    }
                    if (batType.skills.includes('aicamo') && playerInfos.comp.cam >= 2) {
                        iCanCamo = true;
                    }
                }
            } else if (batType.skills.includes('dog')) {
                if (playerInfos.comp.cam >= 1) {
                    iCanCamo = true;
                }
            } else {
                iCanCamo = true;
            }
            if (!batType.skills.includes('robot') || hasEquip(bat,['g2ai'])) {
                iCanCamo = true;
            }
        }
    }
    if (zone[0].planet === 'Sarak') {
        if (batType.cat != 'buildings' && batType.size < 50) {
            if (batType.skills.includes('robot')) {
                if (hasEquip(bat,['g2ai'])) {
                    iCanCamo = true;
                }
                if (batType.skills.includes('aicamo') && playerInfos.comp.cam >= 1) {
                    iCanCamo = true;
                }
            } else if (batType.skills.includes('dog')) {
                if (playerInfos.comp.cam >= 1) {
                    iCanCamo = true;
                }
            } else {
                iCanCamo = true;
            }
        }
    }
    if (hasEquip(bat,['silencieux','silencieux1','silencieux2','e-camo','bld-camo','muffler'])) {
        iCanCamo = true;
    }
    if (hasEquip(bat,['kit-milice','kit-guetteur','kit-chouf','kit-sentinelle'])) {
        if (playerInfos.comp.cam >= 1) {
            iCanCamo = true;
        }
    }
    if (foggedTiles.includes(tile.id)) {
        if (bat.tags.includes('fogged')) {
            if (canCamoFog(bat,batType)) {
                iCanCamo = true;
            }
        }
    }
    if (near.fog) {
        iCanCamo = true;
    }
    if (playerInfos.pseudo === 'Mapedit') {
        iCanCamo = true;
    }
    return iCanCamo;
};

function calcCamo(bat) {
    let batType = getBatType(bat);
    let stealth = getStealth(bat);
    let tile = getTile(bat);
    if (stealth < 3) {
        stealth = 3;
    }
    let camChance = Math.round(Math.sqrt(stealth)*16)+(stealth*2)-40+(playerInfos.comp.ca*2);
    // sarak
    if (zone[0].planet === 'Sarak') {
        if (batType.cat != 'buildings' && batType.size < 50) {
            camChance = camChance+25-Math.round(batType.size/2);
        }
    }
    // fog
    if (foggedTiles.includes(bat.tileId)) {
        camChance = camChance+100-Math.round(batType.size/2);
    }
    // max
    if (batType.skills.includes('underground') || batType.cat === 'buildings' || batType.skills.includes('transorbital')) {
        camChance = camChance+75;
        if (camChance > 100) {
            camChance = 100;
        }
    } else {
        if (camChance > stealthMaxChance) {
            camChance = stealthMaxChance+((camChance-stealthMaxChance)/10);
            if (camChance > 98) {
                camChance = 98;
            }
        }
    }
    // min
    if (camChance < (batType.stealth-6)*3) {
        camChance = (batType.stealth-6)*3;
    }
    camChance = Math.floor(camChance);
    return camChance;
};

function camouflage(apCost,bonus) {
    if (bonus === undefined) {
        bonus = 0;
    }
    console.log('MODE FURTIF');
    if (apCost <= selectedBat.ap+1 || playerInfos.pseudo === 'Mapedit' || hasEquip(selectedBat,['bld-camo'])) {
        let camChance = calcCamo(selectedBat);
        if (bonus >= 1) {
            camChance = camChance+bonus;
        }
        let camOK = false;
        let camDice = rand.rand(1,100);
        console.log('camChance '+camChance);
        let naturalFuzz = selectedBatType.fuzz;
        if (camDice <= camChance || playerInfos.pseudo === 'Mapedit') {
            camOK = true;
            selectedBat.fuzz = -2;
            if (apCost > 0) {
                playSound('camo',-0.2);
            }
        } else {
            if (apCost === 0) {
                camOK = false;
                selectedBat.fuzz = naturalFuzz;
            } else {
                if (selectedBat.fuzz > -2) {
                    camOK = false;
                    selectedBat.fuzz = naturalFuzz;
                    playSound('camofuck',-0.2);
                } else {
                    camOK = true;
                    selectedBat.fuzz = -2;
                }
            }
        }
        if (apCost >= 1 && playerInfos.pseudo != 'Mapedit') {
            selectedBat.apLeft = selectedBat.apLeft-apCost;
        }
    } else {
        selectedBat.camoAP = apCost-selectedBat.apLeft;
        selectedBat.apLeft = 0;
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

function checkCamoMove(bat,batType,bonus) {
    if (bonus === undefined) {
        bonus = 0;
    }
    let camoMove = true;
    if (bat.prt.includes('suit')) {
        camoMove = false;
    } else {
        if (batType.skills.includes('fly') || (batType.cat === 'vehicles' && !batType.skills.includes('robot')) || batType.skills.includes('moto') || batType.skills.includes('maycamo') || !batType.skills.includes('camo') || bat.eq === 'e-jetpack') {
            if (hasEquip(bat,['kit-chouf']) || batType.skills.includes('emoteur')) {
                // OK
            } else if (bonus > 0 && batType.cat != 'vehicles') {
                // OK
            } else {
                camoMove = false;
            }
        }
    }
    return camoMove;
};

function camoReCheck(bonus) {
    console.log('CAMO RECHECK');
    if (bonus === undefined) {
        bonus = 0;
    }
    if (selectedBat.tags.includes('camo') || selectedBat.fuzz <= -2) {
        console.log('isCamo');
        if (selectedBat.prt.includes('suit')) {
            console.log('suit');
            camoOut();
        } else {
            if (selectedBatType.skills.includes('fly') || (selectedBatType.cat === 'vehicles' && !selectedBatType.skills.includes('robot')) || selectedBatType.skills.includes('moto') || selectedBatType.skills.includes('maycamo') || !selectedBatType.skills.includes('camo') || selectedBat.eq === 'e-jetpack') {
                console.log('fly or something');
                if (hasEquip(selectedBat,['kit-chouf']) || selectedBatType.skills.includes('emoteur')) {
                    camouflage(0,bonus);
                } else if (bonus > 0 && selectedBatType.cat != 'vehicles') {
                    camouflage(0,bonus);
                } else {
                    camoOut();
                }
            } else {
                console.log('recheck');
                camouflage(0,bonus);
            }
        }
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
    playSound('ambush',-0.2);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function calcEmbushBonus(batType) {
    let embushBonus = 1.8;
    if (batType.team === 'player') {
        embushBonus = embushBonus+(playerInfos.comp.train/6)+(playerInfos.comp.cam/2);
        if (playerInfos.bldVM.includes('Camp d\'entraînement')) {
            embushBonus = embushBonus+0.3;
        }
    }
    return embushBonus;
};

function calcTiraBonus(batType) {
    let tiraBonus = 1.35;
    if (batType.team === 'player') {
        tiraBonus = tiraBonus+(playerInfos.comp.train/10)+(playerInfos.comp.cam/10);
        if (playerInfos.bldVM.includes('Camp d\'entraînement')) {
            tiraBonus = tiraBonus+0.2;
        }
        if (batType.skills.includes('charge')) {
            tiraBonus = tiraBonus+0.5;
        }
    } else {
        tiraBonus = tiraBonus+0.15;
    }
    return tiraBonus;
};

function armyAssign(dropMenuId) {
    let army = document.getElementById(dropMenuId).value;
    selectedBat.army = +army;
    if (selectedBatType.skills.includes('transport')) {
        bataillons.forEach(function(bat) {
            if (bat.loc === 'trans' && bat.locId == selectedBat.id) {
                bat.army = +army;
            }
        });
    }
    selectedBatArrayUpdate();
    if (inSoute) {
        goSoute();
    }
    showBatInfos(selectedBat);
};

function goDrug(apCost,drugName) {
    console.log('DRUG DEAL');
    // console.log(selectedBat);
    let drug = getDrugByName(drugName);
    let batType;
    let ravitBat = {};
    let ravitLeft = 0;
    let biggestRavit = 0;
    let molokoRavit = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            ravitLeft = 0;
            if (batType.skills.includes('dealer') && batType.skills.includes(drug.name)) {
                let rangeBonus = 0;
                if (batType.skills.includes('medrange')) {
                    if (batType.name === 'Hôpital') {
                        rangeBonus = 2;
                    } else {
                        rangeBonus = 1;
                    }
                }
                ravitLeft = calcRavitDrug(bat);
                if (calcDistance(selectedBat.tileId,bat.tileId) <= 1+rangeBonus && ravitLeft >= 1) {
                    if (biggestRavit < ravitLeft) {
                        biggestRavit = ravitLeft;
                        ravitBat = bat;
                        console.log('ravit bat: '+ravitBat.type);
                    }
                }
            }
            if (batType.skills.includes('dealer') && batType.skills.includes('moloko') && ravitLeft >= 1) {
                molokoRavit = true;
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
                    if (!ravitBatType.skills.includes('robot') || hasEquip(ravitBat,['g2ai'])) {
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
            selectedBat.tags.push(drug.name);
            if (drug.name === 'nitro') {
                if (selectedBatType.skills.includes('saucer') || selectedBatType.skills.includes('tank')) {
                    selectedBat.tags.push(drug.name);
                }
            }
            drugInstantBonus(drug,false);
        }
        // moloko bonus
        if (drug.name != 'moloko') {
            if (molokoRavit) {
                if (playerInfos.comp.ordre < 2) {
                    let molokoTempted = true;
                    if (selectedBatType.cat != 'infantry' && selectedBatType.cat != 'vehicles') {
                        molokoTempted = false;
                    }
                    if (selectedBatType.crew === 0) {
                        molokoTempted = false;
                    }
                    if (selectedBatType.skills.includes('clone') || selectedBatType.skills.includes('dog') || selectedBatType.skills.includes('robot') || selectedBatType.skills.includes('cleric')) {
                        molokoTempted = false;
                    }
                    if (selectedBatType.skills.includes('leader') || selectedBat.tags.includes('schef')) {
                        if (playerInfos.gang != 'drogmulojs') {
                            molokoTempted = false;
                        }
                    }
                    if (molokoTempted) {
                        let molokoDice = 7+(playerInfos.comp.ordre*6);
                        if (playerInfos.gang === 'drogmulojs') {
                            molokoDice = Math.ceil(molokoDice/3);
                        } else if (playerInfos.gang === 'rednecks' || playerInfos.gang === 'detruas' || playerInfos.gang === 'tiradores') {
                            molokoDice = Math.ceil(molokoDice/1.75);
                        }
                        if (rand.rand(1,molokoDice) === 1) {
                            selectedBat.tags.push('moloko');
                            selectedBat.tags.push('moloko');
                            selectedBat.apLeft = selectedBat.apLeft-3;
                        }
                    }
                }
            }
        }
        playSound(drug.sound,0);
        payCost(drug.costs);
        doneAction(ravitBat);
        doneAction(selectedBat);
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
    }
};

function drugSound(drug) {
    playSound('ambush',-0.2);
};

function drugInstantBonus(drug,fromPack) {
    // blaze instant bonus
    if (drug.name === 'blaze') {
        if (fromPack) {
            if (selectedBat.apLeft < 0) {
                selectedBat.apLeft = Math.round(selectedBat.apLeft/6);
            }
            selectedBat.apLeft = selectedBat.apLeft+6;
        }
        selectedBat.apLeft = selectedBat.apLeft+6;
        selectedBat.salvoLeft = selectedBat.salvoLeft+1;
        console.log('blaze bonus');
    }
    // bliss instant bonus
    if (drug.name === 'bliss') {
        if (!fromPack) {
            selectedBat.apLeft = selectedBat.apLeft-3;
        }
    }
    // octiron instant bonus
    if (drug.name === 'octiron') {
        tagDelete(selectedBat,'lucky');
        selectedBat.apLeft = selectedBat.apLeft+4;
        if (selectedBatType.cat === 'infantry') {
            if (playerInfos.comp.med >= 3 || fromPack) {
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
        if (fromPack) {
            selectedBat.apLeft = Math.ceil(selectedBat.apLeft/3)+Math.ceil(selectedBat.ap*1.5);
        } else {
            selectedBat.apLeft = selectedBat.apLeft+getStarkaBonus(selectedBat);
        }
        console.log('starka bonus');
    }
    // kirin instant bonus
    if (drug.name === 'kirin') {
        if (playerInfos.comp.med >= 2 || fromPack) {
            selectedBat.damage = 0;
            if (playerInfos.comp.med >= 3 || fromPack) {
                let lostSquads = selectedBatType.squads-selectedBat.squadsLeft;
                if (lostSquads >= 2) {
                    selectedBat.squadsLeft = selectedBat.squadsLeft+2;
                } else if (lostSquads === 1) {
                    selectedBat.squadsLeft = selectedBat.squadsLeft+1;
                }
            }
        }
        console.log('kirin bonus med');
    }
    // nitro instant bonus
    if (drug.name === 'nitro') {
        if (fromPack) {
            selectedBat.apLeft = Math.ceil(selectedBat.apLeft/3)+Math.ceil(selectedBat.ap*1.5);
        } else {
            selectedBat.apLeft = selectedBat.apLeft+getNitroBonus(selectedBat);
        }
        console.log('nitro bonus');
    }
    // repair kit
    if (drug.name === 'meca') {
        selectedBat.damage = 0;
        let lostSquads = selectedBatType.squads-selectedBat.squadsLeft;
        if (playerInfos.comp.trans >= 3) {
            selectedBat.squadsLeft = selectedBatType.squads;
        } else if (lostSquads >= 3 && playerInfos.comp.trans >= 2) {
            selectedBat.squadsLeft = selectedBat.squadsLeft+3;
        } else if (lostSquads >= 2 && playerInfos.comp.trans >= 1) {
            selectedBat.squadsLeft = selectedBat.squadsLeft+2;
        } else if (lostSquads >= 1) {
            selectedBat.squadsLeft = selectedBat.squadsLeft+1;
        }
        tagDelete(selectedBat,'trou');
        if (selectedBat.soins != undefined) {
            let deepMeca = Math.ceil((playerInfos.comp.trans+1)/4*selectedBat.soins);
            selectedBat.soins = selectedBat.soins-deepMeca;
        }
        selectedBat.soins = 0;
        console.log('repair kit bonus');
    }
};

function getNitroBonus(bat) {
    let batType = getBatType(bat);
    let batAPLeft = bat.apLeft;
    if (bat.apLeft < 0 && !bat.tags.includes('construction')) {
        batAPLeft = Math.round(bat.apLeft/2);
    }
    let batAP = getAP(bat,batType);
    let transBonus = Math.floor(playerInfos.comp.trans*playerInfos.comp.trans/3)*2;
    if (batType.skills.includes('fly') && batType.cat === 'vehicles') {
        transBonus = Math.floor(playerInfos.comp.aero*playerInfos.comp.aero/3)*2;
    }
    let catDiv = 2;
    if (batType.skills.includes('tank') || batType.skills.includes('worker')) {
        catDiv = 3;
    }
    let baseBonus = Math.round(batAP/catDiv)+transBonus;
    batAPLeft = batAPLeft+baseBonus;
    if (batAPLeft >= batAP+3+transBonus) {
        batAPLeft = batAP+3+transBonus;
    }
    if (batAPLeft < transBonus-4 && !bat.tags.includes('construction')) {
        batAPLeft = transBonus-4;
    }
    let nitroBonus = Math.round(batAPLeft-bat.apLeft);
    return nitroBonus;
};

function getStarkaIntox(bat) {
    let fullStarka = false;
    let allTags = _.countBy(bat.tags);
    if (allTags.starka >= 3) {
        fullStarka = true;
    }
    return fullStarka;
};

function getStarkaBonus(bat) {
    let batType = getBatType(bat);
    let batAPLeft = bat.apLeft;
    let batMoves = calcDistance(bat.tileId,bat.oldTileId);
    batMoves = Math.ceil(batMoves*5)-10;
    if (batMoves < 0) {
        batMoves = 0;
    }
    if (bat.apLeft < 0) {
        batAPLeft = Math.round(bat.apLeft/2);
    }
    let batAP = getAP(bat,batType);
    let medBonus = Math.floor((playerInfos.comp.exo+1.5)*(playerInfos.comp.med+1)/3);
    batAPLeft = Math.round(batAPLeft+(batAP/1.75)+medBonus);
    let maxAP = Math.round(batAP+(medBonus/2));
    if (batAPLeft >= maxAP) {
        batAPLeft = maxAP;
    }
    let starkaBonus = batAPLeft-Math.round(bat.apLeft)-batMoves;
    let minBonus = Math.round(medBonus/2)+2;
    if (starkaBonus < minBonus) {
        starkaBonus = minBonus;
    }
    return starkaBonus;
};

function checkDrugs(myBat) {
    let batType;
    let allDrugs = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('dealer')) {
                let rangeBonus = 0;
                if (batType.skills.includes('medrange')) {
                    if (batType.name === 'Hôpital') {
                        rangeBonus = 2;
                    } else {
                        rangeBonus = 1;
                    }
                }
                if (calcDistance(myBat.tileId,bat.tileId) <= 1+rangeBonus && calcRavitDrug(bat) >= 1) {
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
                    }
                    if (batType.skills.includes('sudu')) {
                        allDrugs.push('sudu');
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
    conOut(true);
    let unitIndex;
    let skillUsed = true;
    if (mineType === 'champ') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Champ de mines'));
    } else if (mineType === 'wipe') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Mines wipeout'));
    } else if (mineType === 'bay') {
        unitIndex = unitTypes.findIndex((obj => obj.name === 'Mines baygon'));
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
    tagDelete(selectedBat,'guet');
    camoReCheck(5);
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
            conselReset(true);
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

function checkFreeConsTile(bat,mineType,okInfra) {
    // pour les clicput
    let freeTile = false;
    let infraOK = false;
    if (okInfra) {
        infraOK = true;
    } else {
        if (mineType.skills.includes('oninfra')) {
            infraOK = true;
        }
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

function checkCleaningCost(bat,batType) {
    let apCost = batType.mecanoCost+1;
    let exoComp = 0;
    if (playerInfos.comp.exo >= playerInfos.comp.ind) {
        exoComp = playerInfos.comp.exo;
        if (playerInfos.comp.exo >= 1) {
            exoComp = exoComp+1;
        }
    } else {
        exoComp = playerInfos.comp.ind;
    }
    apCost = Math.ceil(apCost*12/(exoComp+4)/(playerInfos.comp.ca+3));
    let minCost = 3;
    if (batType.skills.includes('fly')) {
        minCost = 2;
    }
    if (apCost < minCost) {apCost = minCost;}
    return apCost;
};

function checkWeb(bat,batType) {
    let numWeb = 0;
    let workDone = false;
    let thisTile = getTileById(bat.tileId);
    if (thisTile.web || thisTile.ecto || thisTile.moist) {
        numWeb++;
        workDone = true;
    }
    if (!workDone) {
        thisTile = getTileById(bat.tileId-1);
        if (thisTile != undefined) {
            if (thisTile.web || thisTile.ecto || thisTile.moist) {
                numWeb++;
                workDone = true;
            }
        }
        thisTile = getTileById(bat.tileId+1);
        if (thisTile != undefined) {
            if (thisTile.web || thisTile.ecto || thisTile.moist) {
                numWeb++;
                workDone = true;
            }
        }
        thisTile = getTileById(bat.tileId+mapSize);
        if (thisTile != undefined) {
            if (thisTile.web || thisTile.ecto || thisTile.moist) {
                numWeb++;
                workDone = true;
            }
        }
        thisTile = getTileById(bat.tileId-mapSize);
        if (thisTile != undefined) {
            if (thisTile.web || thisTile.ecto || thisTile.moist) {
                numWeb++;
                workDone = true;
            }
        }
    }
    if (batType.cat === 'buildings' || batType.skills.includes('transorbital')) {
        if (!workDone) {
            thisTile = getTileById(bat.tileId-mapSize-1);
            if (thisTile != undefined) {
                if (thisTile.web || thisTile.ecto || thisTile.moist) {
                    numWeb++;
                }
            }
            thisTile = getTileById(bat.tileId-mapSize+1);
            if (thisTile != undefined) {
                if (thisTile.web || thisTile.ecto || thisTile.moist) {
                    numWeb++;
                }
            }
            thisTile = getTileById(bat.tileId+mapSize-1);
            if (thisTile != undefined) {
                if (thisTile.web || thisTile.ecto || thisTile.moist) {
                    numWeb++;
                }
            }
            thisTile = getTileById(bat.tileId+mapSize+1);
            if (thisTile != undefined) {
                if (thisTile.web || thisTile.ecto || thisTile.moist) {
                    numWeb++;
                }
            }
        }
    }
    return numWeb;
};

function removeWeb(apCost) {
    let apFullCost = 0;
    let workDone = false;
    let thisTile = getTileById(selectedBat.tileId);
    if (thisTile.web || thisTile.ecto || thisTile.moist) {
        workDone = true;
        tagDelete(selectedBat,'mud');
        if (selectedBat.apLeft < 0) {
            selectedBat.apLeft = Math.round(selectedBat.apLeft/2);
        }
        apFullCost = apFullCost+apCost;
        if (!selectedBatType.skills.includes('fly')) {
            apFullCost = apFullCost+apCost;
        }
    }
    if (thisTile.web) {delete thisTile.web;}
    if (thisTile.ecto) {delete thisTile.ecto;}
    if (thisTile.moist) {delete thisTile.moist;}
    if (!workDone) {
        thisTile = getTileById(selectedBat.tileId-1);
        if (thisTile.web || thisTile.ecto || thisTile.moist) {
            // delete thisTile.web;
            workDone = true;
            apFullCost = apFullCost+apCost;
        }
        if (thisTile.web) {
            delete thisTile.web;
            let hereBat = getZoneBatByTileId(thisTile.id);
            if (Object.keys(hereBat).length >= 1) {
                tagDelete(hereBat,'mud');
                if (hereBat.apLeft < 0) {
                    hereBat.apLeft = Math.round(hereBat.apLeft/2);
                }
            }
        }
        if (thisTile.ecto) {delete thisTile.ecto;}
        if (thisTile.moist) {delete thisTile.moist;}
        thisTile = getTileById(selectedBat.tileId+1);
        if (thisTile.web || thisTile.ecto || thisTile.moist) {
            // delete thisTile.web;
            workDone = true;
            apFullCost = apFullCost+apCost;
        }
        if (thisTile.web) {
            delete thisTile.web;
            let hereBat = getZoneBatByTileId(thisTile.id);
            if (Object.keys(hereBat).length >= 1) {
                tagDelete(hereBat,'mud');
                if (hereBat.apLeft < 0) {
                    hereBat.apLeft = Math.round(hereBat.apLeft/2);
                }
            }
        }
        if (thisTile.ecto) {delete thisTile.ecto;}
        if (thisTile.moist) {delete thisTile.moist;}
        thisTile = getTileById(selectedBat.tileId+mapSize);
        if (thisTile.web || thisTile.ecto || thisTile.moist) {
            // delete thisTile.web;
            workDone = true;
            apFullCost = apFullCost+apCost;
        }
        if (thisTile.web) {
            delete thisTile.web;
            let hereBat = getZoneBatByTileId(thisTile.id);
            if (Object.keys(hereBat).length >= 1) {
                tagDelete(hereBat,'mud');
                if (hereBat.apLeft < 0) {
                    hereBat.apLeft = Math.round(hereBat.apLeft/2);
                }
            }
        }
        if (thisTile.ecto) {delete thisTile.ecto;}
        if (thisTile.moist) {delete thisTile.moist;}
        thisTile = getTileById(selectedBat.tileId-mapSize);
        if (thisTile.web || thisTile.ecto || thisTile.moist) {
            // delete thisTile.web;
            workDone = true;
            apFullCost = apFullCost+apCost;
        }
        if (thisTile.web) {
            delete thisTile.web;
            let hereBat = getZoneBatByTileId(thisTile.id);
            if (Object.keys(hereBat).length >= 1) {
                tagDelete(hereBat,'mud');
                if (hereBat.apLeft < 0) {
                    hereBat.apLeft = Math.round(hereBat.apLeft/2);
                }
            }
        }
        if (thisTile.ecto) {delete thisTile.ecto;}
        if (thisTile.moist) {delete thisTile.moist;}
    }
    if (selectedBatType.cat === 'buildings' || selectedBatType.skills.includes('transorbital')) {
        if (!workDone) {
            thisTile = getTileById(selectedBat.tileId-mapSize-1);
            if (thisTile.web || thisTile.ecto || thisTile.moist) {
                // delete thisTile.web;
                apFullCost = apFullCost+apCost;
            }
            if (thisTile.web) {
                delete thisTile.web;
                let hereBat = getZoneBatByTileId(thisTile.id);
                if (Object.keys(hereBat).length >= 1) {
                    tagDelete(hereBat,'mud');
                    if (hereBat.apLeft < 0) {
                        hereBat.apLeft = Math.round(hereBat.apLeft/2);
                    }
                }
            }
            if (thisTile.ecto) {delete thisTile.ecto;}
            if (thisTile.moist) {delete thisTile.moist;}
            thisTile = getTileById(selectedBat.tileId-mapSize+1);
            if (thisTile.web || thisTile.ecto || thisTile.moist) {
                // delete thisTile.web;
                apFullCost = apFullCost+apCost;
            }
            if (thisTile.web) {
                delete thisTile.web;
                let hereBat = getZoneBatByTileId(thisTile.id);
                if (Object.keys(hereBat).length >= 1) {
                    tagDelete(hereBat,'mud');
                    if (hereBat.apLeft < 0) {
                        hereBat.apLeft = Math.round(hereBat.apLeft/2);
                    }
                }
            }
            if (thisTile.ecto) {delete thisTile.ecto;}
            if (thisTile.moist) {delete thisTile.moist;}
            thisTile = getTileById(selectedBat.tileId+mapSize-1);
            if (thisTile.web || thisTile.ecto || thisTile.moist) {
                // delete thisTile.web;
                apFullCost = apFullCost+apCost;
            }
            if (thisTile.web) {
                delete thisTile.web;
                let hereBat = getZoneBatByTileId(thisTile.id);
                if (Object.keys(hereBat).length >= 1) {
                    tagDelete(hereBat,'mud');
                    if (hereBat.apLeft < 0) {
                        hereBat.apLeft = Math.round(hereBat.apLeft/2);
                    }
                }
            }
            if (thisTile.ecto) {delete thisTile.ecto;}
            if (thisTile.moist) {delete thisTile.moist;}
            thisTile = getTileById(selectedBat.tileId+mapSize+1);
            if (thisTile.web || thisTile.ecto || thisTile.moist) {
                // delete thisTile.web;
                apFullCost = apFullCost+apCost;
            }
            if (thisTile.web) {
                delete thisTile.web;
                let hereBat = getZoneBatByTileId(thisTile.id);
                if (Object.keys(hereBat).length >= 1) {
                    tagDelete(hereBat,'mud');
                    if (hereBat.apLeft < 0) {
                        hereBat.apLeft = Math.round(hereBat.apLeft/2);
                    }
                }
            }
            if (thisTile.ecto) {delete thisTile.ecto;}
            if (thisTile.moist) {delete thisTile.moist;}
        }
    }
    selectedBat.apLeft = selectedBat.apLeft-apFullCost;
    camoReCheck();
    playSound('hose',-0.3);
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,true);
};

function ammoConv(myAmmos) {
    console.log(myAmmos);
    let convAmmo = {};
    convAmmo.pref = '';
    convAmmo.base = myAmmos;
    if (myAmmos.includes('ac-tungsten')) {
        convAmmo.pref = 'ac-';
    }
    if (myAmmos.includes('sm-tungsten')) {
        convAmmo.pref = 'sm-';
    }
    if (myAmmos.includes('pn-tungsten')) {
        convAmmo.pref = 'pn-';
    }
    if (convAmmo.pref != '') {
        let iter = 0;
        myAmmos.forEach(function(ammo) {
            convAmmo.base[iter] = ammo.replace(convAmmo.pref,'');
            iter++;
        });
    }
    console.log(convAmmo);
    return convAmmo;
};

function checkAmmoPack(ammoName,bat,batType,conv) {
    let ammoOK = false;
    let hasW1 = checkHasWeapon(1,batType,bat.eq);
    if (hasW1) {
        if (conv) {
            let convAmmo = ammoConv(batType.weapon.ammo);
            if (convAmmo.base.includes(ammoName)) {
                ammoOK = true;
            }
            if (ammoName === 'dunium' && batType.weapon.ammo.includes('ac-dunium')) {
                ammoOK = true;
            }
            if (ammoName === 'molotov-slime' && batType.weapon.ammo.includes('fireslime')) {
                ammoOK = true;
            }
            if (ammoName === 'molotov-pyrus' && batType.weapon.ammo.includes('firebug')) {
                ammoOK = true;
            }
            if (ammoName === 'molotov-pyratol' && batType.weapon.ammo.includes('fireblast')) {
                ammoOK = true;
            }
        } else {
            if (batType.weapon.ammo.includes(ammoName)) {
                ammoOK = true;
            }
        }
    }
    let hasW2 = checkHasWeapon(2,batType,bat.eq);
    if (hasW2) {
        if (conv) {
            let convAmmo = ammoConv(batType.weapon2.ammo);
            if (convAmmo.base.includes(ammoName)) {
                ammoOK = true;
            }
            if (ammoName === 'dunium' && batType.weapon2.ammo.includes('ac-dunium')) {
                ammoOK = true;
            }
            if (ammoName === 'molotov-slime' && batType.weapon2.ammo.includes('fireslime')) {
                ammoOK = true;
            }
            if (ammoName === 'molotov-pyrus' && batType.weapon2.ammo.includes('firebug')) {
                ammoOK = true;
            }
            if (ammoName === 'molotov-pyratol' && batType.weapon2.ammo.includes('fireblast')) {
                ammoOK = true;
            }
        } else {
            if (batType.weapon.ammo2.includes(ammoName)) {
                ammoOK = true;
            }
        }
    }
    return ammoOK;
};

function useAmmoPack(tileId,ammoName,conv) {
    let ammoOK = false;
    let theWeapon = selectedBatType.weapon;
    let hasW1 = checkHasWeapon(1,selectedBatType,selectedBat.eq);
    if (hasW1) {
        if (conv) {
            let convAmmo = ammoConv(selectedBatType.weapon.ammo);
            if (convAmmo.base.includes(ammoName)) {
                selectedBat.ammo = convAmmo.pref+ammoName;
                ammoOK = true;
            } else if (ammoName === 'dunium' && selectedBatType.weapon.ammo.includes('ac-dunium')) {
                selectedBat.ammo = 'ac-dunium';
                ammoOK = true;
            } else if (ammoName === 'molotov-slime' && selectedBatType.weapon.ammo.includes('fireslime')) {
                selectedBat.ammo = 'fireslime';
                ammoOK = true;
            } else if (ammoName === 'molotov-pyrus' && selectedBatType.weapon.ammo.includes('firebug')) {
                selectedBat.ammo = 'firebug';
                ammoOK = true;
            } else if (ammoName === 'molotov-pyratol' && selectedBatType.weapon.ammo.includes('fireblast')) {
                selectedBat.ammo = 'fireblast';
                ammoOK = true;
            }
        } else {
            if (selectedBatType.weapon.ammo.includes(ammoName)) {
                selectedBat.ammo = ammoName;
                ammoOK = true;
            }
        }
    }
    let hasW2 = checkHasWeapon(2,selectedBatType,selectedBat.eq);
    if (hasW2) {
        if (conv) {
            let convAmmo = ammoConv(selectedBatType.weapon2.ammo);
            if (convAmmo.base.includes(ammoName)) {
                selectedBat.ammo2 = convAmmo.pref+ammoName;
                ammoOK = true;
                theWeapon = selectedBatType.weapon2;
            } else if (ammoName === 'dunium' && selectedBatType.weapon2.ammo.includes('ac-dunium')) {
                selectedBat.ammo2 = 'ac-dunium';
                ammoOK = true;
                theWeapon = selectedBatType.weapon2;
            } else if (ammoName === 'molotov-slime' && selectedBatType.weapon2.ammo.includes('fireslime')) {
                selectedBat.ammo2 = 'fireslime';
                ammoOK = true;
                theWeapon = selectedBatType.weapon2;
            } else if (ammoName === 'molotov-pyrus' && selectedBatType.weapon2.ammo.includes('firebug')) {
                selectedBat.ammo2 = 'firebug';
                ammoOK = true;
                theWeapon = selectedBatType.weapon2;
            } else if (ammoName === 'molotov-pyratol' && selectedBatType.weapon2.ammo.includes('fireblast')) {
                selectedBat.ammo2 = 'fireblast';
                ammoOK = true;
                theWeapon = selectedBatType.weapon2;
            }
        } else {
            if (selectedBatType.weapon2.ammo.includes(ammoName)) {
                selectedBat.ammo2 = ammoName;
                ammoOK = true;
                theWeapon = selectedBatType.weapon2;
            }
        }
    }
    if (ammoOK) {
        selectedBat.apLeft = selectedBat.apLeft-1;
        reloadSound(theWeapon);
        let tile = getTileById(tileId);
        // delete tile.ap;
        packOut(tile);
    }
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,true);
};

function checkEquipPack(equipName,bat,batType) {
    let equipOK = false;
    if (batType.equip.includes(equipName)) {
        equipOK = true;
    }
    if (equipName === 'lunette') {
        if (batType.equip.includes('lunette1') || batType.equip.includes('lunette2')) {
            equipOK = true;
        }
    }
    if (equipName === 'chargeur') {
        if (batType.equip.includes('chargeur1') || batType.equip.includes('chargeur2')) {
            equipOK = true;
        }
    }
    if (equipName === 'silencieux') {
        if (batType.equip.includes('silencieux1') || batType.equip.includes('silencieux2')) {
            equipOK = true;
        }
    }
    return equipOK;
};

function useEquipPack(tileId,equipName) {
    let equipOK = false;
    if (selectedBatType.equip.includes(equipName)) {
        equipOK = true;
        selectedBat.eq = equipName;
    } else {
        if (equipName === 'lunette') {
            if (selectedBatType.equip.includes('lunette1')) {
                selectedBat.eq = 'lunette1';
                equipOK = true;
            }
            if (selectedBatType.equip.includes('lunette2')) {
                selectedBat.eq = 'lunette2';
                equipOK = true;
            }
        }
        if (equipName === 'chargeur') {
            if (selectedBatType.equip.includes('chargeur1')) {
                selectedBat.eq = 'chargeur1';
                equipOK = true;
            }
            if (selectedBatType.equip.includes('chargeur2')) {
                selectedBat.eq = 'chargeur2';
                equipOK = true;
            }
        }
        if (equipName === 'silencieux') {
            if (selectedBatType.equip.includes('silencieux1')) {
                selectedBat.eq = 'silencieux1';
                equipOK = true;
            }
            if (selectedBatType.equip.includes('silencieux2')) {
                selectedBat.eq = 'silencieux2';
                equipOK = true;
            }
        }
    }
    if (equipOK) {
        selectedBat.apLeft = selectedBat.apLeft-3;
        playSound('changing',0,true);
        let tile = getTileById(tileId);
        // delete tile.ap;
        packOut(tile);
    }
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,true);
};

function checkArmorPack(armorName,bat,batType) {
    let armorOK = false;
    if (batType.protection.includes(armorName)) {
        armorOK = true;
    }
    return armorOK;
};

function useArmorPack(tileId,armorName) {
    let armorOK = false;
    if (selectedBatType.protection.includes(armorName)) {
        armorOK = true;
        let oldGearTags = getBatGearTags(selectedBat.prt,selectedBat.eq,selectedBatType);
        selectedBat.tags = selectedBat.tags.filter(function(el) {
            return !oldGearTags.includes(el);
        });
        let gearTags = getBatGearTags(armorName,selectedBat.eq,selectedBatType);
        selectedBat.tags.push.apply(selectedBat.tags,gearTags);
        let gearStuff = getBatGearStuff(armorName,selectedBat.eq,selectedBatType,true,selectedBat);
        selectedBat.armor = gearStuff[0];
        selectedBat.ap = gearStuff[1];
        selectedBat.prt = armorName;
    }
    if (armorOK) {
        selectedBat.apLeft = selectedBat.apLeft-3;
        playSound('changing',0,true);
        let tile = getTileById(tileId);
        // delete tile.ap;
        packOut(tile);
    }
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,true);
};

function checkDrugPack(drugName,bat,batType) {
    let drugOK = false;
    let drug = getEquipByName(drugName);
    if (batType.cat === 'infantry' && drug.units.includes('inf')) {
        drugOK = true;
    }
    if (batType.cat != 'infantry' || batType.skills.includes('oknitro')) {
        if (batType.cat === 'vehicles' || batType.skills.includes('oknitro')) {
            if (drug.name === 'nitro') {
                drugOK = true;
            }
        }
        if (batType.cat === 'vehicles' && !batType.skills.includes('cyber') && !batType.skills.includes('robot') && batType.moveCost < 90) {
            if (drug.name === 'sudu') {
                drugOK = true;
            }
        }
        if (batType.crew >= 1 && !batType.skills.includes('clone') && batType.cat != 'infantry' && !batType.skills.includes('dome') && !batType.skills.includes('pilone') && !batType.skills.includes('cfo')) {
            if (drug.name === 'octiron') {
                drugOK = true;
            }
            if (drug.name === 'moloko') {
                drugOK = true;
            }
            if (drug.name === 'bliss') {
                drugOK = true;
            }
        }
    }
    if (batType.cat === 'vehicles') {
        if (drug.name === 'meca') {
            drugOK = true;
        }
    }
    return drugOK;
};

function useDrugPack(tileId,drugName,apCost) {
    let drug = getEquipByName(drugName);
    let drugOK = checkDrugPack(drugName,selectedBat,selectedBatType);
    if (drugOK) {
        if (drugName != 'starka' && drugName != 'nitro') {
            selectedBat.tags.push(drug.name);
            selectedBat.tags.push(drug.name);
            selectedBat.tags.push(drug.name);
        } else {
            tagDelete(selectedBat,drugName);
            tagDelete(selectedBat,drugName);
            tagDelete(selectedBat,drugName);
        }
        selectedBat.tags.push(drug.name);
        drugInstantBonus(drug,true);
        playSound(drug.sound,0);
        selectedBat.apLeft = selectedBat.apLeft-apCost;
        let tile = getTileById(tileId);
        // delete tile.ap;
        packOut(tile);
    }
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,true);
};

function packOut(tile) {
    const index = playerInfos.packs.indexOf(tile.id);
    if (index > -1) {
        playerInfos.packs.splice(index,1);
    }
    delete tile.ap;
}

function allPacks(bat,batType) {
    if (playerInfos.packs != undefined) {
        if (playerInfos.packs.length >= 1) {
            playerInfos.packs.forEach(function(packTileId) {
                let tile = getTileById(packTileId);
                if (tile.ap != undefined) {
                    if (!tile.ap.includes('prt_') && !tile.ap.includes('eq_') && !tile.ap.includes('drg_')) {
                        let ammoOK = checkAmmoPack(tile.ap,bat,batType,true);
                        if (ammoOK) {
                            apCost = 1;
                            apReq = 0;
                            let tileAmmoPackName = tile.ap;
                            if (tileAmmoPackName === 'molotov-slime' && batType.skills.includes('fireballs')) {
                                tileAmmoPackName = 'fireslime';
                            } else if (tileAmmoPackName === 'molotov-pyrus' && batType.skills.includes('fireballs')) {
                                tileAmmoPackName = 'firebug';
                            } else if (tileAmmoPackName === 'molotov-pyratol' && batType.skills.includes('fireballs')) {
                                tileAmmoPackName = 'fireblast';
                            }
                            let ammo = getAmmoByName(tileAmmoPackName);
                            let ammoInfo = showAmmoInfo(ammo.name,false,false);
                            $('#unitInfos').append('<button type="button" title="Utiliser le pack de munitions ('+tileAmmoPackName+' / '+ammoInfo+')" class="boutonOrange iconButtons" onclick="useAmmoPack('+tile.id+',`'+tile.ap+'`,true)"><i class="ra ra-rifle rpg"></i> <span class="small">'+apCost+'</span></button>');
                        }
                    }
                    if (tile.ap.includes('prt_')) {
                        let armorName = tile.ap.replace('prt_','');
                        let armorOK = checkArmorPack(armorName,bat,batType);
                        let forBld = false;
                        if (batType.cat === 'buildings' || batType.cat === 'devices') {
                            forBld = true;
                        }
                        if (armorOK) {
                            apCost = 3;
                            apReq = 0;
                            let armor = getEquipByName(armorName);
                            let armorInfo = showFullArmorInfo(armor,forBld,false,false,true,batType);
                            $('#unitInfos').append('<button type="button" title="Enfiler les armures ('+armorName+' / '+armorInfo+')" class="boutonOrange iconButtons" onclick="useArmorPack('+tile.id+',`'+armorName+'`)"><i class="ra ra-vest rpg"></i> <span class="small">'+apCost+'</span></button>');
                        }
                    }
                    if (tile.ap.includes('eq_')) {
                        let equipName = tile.ap.replace('eq_','');
                        let equipackOK = checkEquipPack(equipName,bat,batType);
                        if (equipackOK) {
                            apCost = 3;
                            apReq = 0;
                            let equip = getEquipByName(equipName);
                            let oldEquip = getEquipByName(bat.eq);
                            $('#unitInfos').append('<button type="button" title="Utiliser les équipements ('+equipName+' / '+equip.info+') &mdash; Se débarasser de ('+bat.eq+' / '+oldEquip.info+')" class="boutonOrange iconButtons" onclick="useEquipPack('+tile.id+',`'+equipName+'`)"><i class="fas fa-compass"></i> <span class="small">'+apCost+'</span></button>');
                        }
                    }
                    if (tile.ap.includes('drg_')) {
                        let drugName = tile.ap.replace('drg_','');
                        let drugOK = checkDrugPack(drugName,bat,batType);
                        if (drugOK) {
                            let drug = getEquipByName(drugName);
                            apCost = drug.apCost;
                            apReq = 0;
                            if (drugName === 'meca') {
                                baseskillCost = calcBaseSkillCost(bat,batType,'mecano',false);
                                apCost = calcAdjSkillCost(1,baseskillCost,batType,bat,false);
                                apCost = Math.ceil(apCost/1.5);
                                apReq = Math.ceil(apCost/2);
                            }
                            if (drug.units === 'veh') {
                                let usure = 0;
                                if (bat.soins != undefined) {
                                    usure = bat.soins;
                                }
                                if (drug.name != 'meca' || bat.squadsLeft < batType.squads || bat.damage >= 30 || usure >= 11) {
                                    $('#unitInfos').append('<button type="button" title="Utiliser ('+drugName+' / '+drug.info+')" class="boutonOrange iconButtons" onclick="useDrugPack('+tile.id+',`'+drugName+'`,'+apCost+')"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                                } else {
                                    $('#unitInfos').append('<button type="button" title="('+drugName+' / '+drug.info+')" class="boutonOrange iconButtons gf"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                                }
                            } else {
                                $('#unitInfos').append('<button type="button" title="Utiliser ('+drugName+' / '+drug.info+')" class="boutonOrange iconButtons" onclick="useDrugPack('+tile.id+',`'+drugName+'`,'+apCost+')"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            }
                        }
                    }
                }
            });
        }
    }
}

function fogEffect(myBat) {
    let fogPoison = 1;
    let distance;
    let batType = {};
    let i = 1;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(myBat.tileId,bat.tileId);
            if (distance <= fogRange) {
                if (!bat.tags.includes('fogged')) {
                    bat.tags.push('fogged');
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
                let batType = getBatType(bat);
                if (canCamoFog(bat,batType)) {
                    if (!bat.tags.includes('camo')) {
                        bat.tags.push('camo');
                    }
                    bat.fuzz = -2;
                }
            }
        }
    });
};

function canCamoFog(bat,batType) {
    let camoOK = true;
    if (batType.skills.includes('transorbital') || batType.skills.includes('cfo') || batType.skills.includes('pilone') || batType.skills.includes('dome')) {
        camoOK = false;
    } else {
        let maxSize = 75+(playerInfos.comp.cam*15);
        if (batType.skills.includes('camo')) {
            maxSize = maxSize*2;
        }
        if (hasEquip(bat,['bld-camo'])) {
            maxSize = maxSize*2;
        }
        if (batType.size > maxSize) {
            camoOK = false;
        }
    }
    return camoOK;
};

function deFog(bat,batType) {
    if (bat.tags.includes('fogged')) {
        tagDelete(bat,'fogged');
        tagDelete(bat,'fogged');
        tagDelete(bat,'fogged');
        if (batType.cat === 'aliens') {
            // nothing
        } else {
            if (!batType.skills.includes('camo')) {
                tagDelete(bat,'camo');
                bat.fuzz = batType.fuzz;
            }
        }
    }
    if (bat.loc === 'trans') {
        if (bat.tags.includes('fog')) {
            tagDelete(bat,'fog');
        }
    }
}

function fogStart() {
    selectMode();
    console.log('FOG start');
    if (!selectedBat.tags.includes('fog')) {
        selectedBat.tags.push('fog');
    }
    selectedBat.fuzz = -2;
    if (!selectedBat.tags.includes('camo')) {
        selectedBat.tags.push('camo');
    }
    playSound('fogstart',-0.2);
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
    tagDelete(selectedBat,'camo');
    selectedBat.fuzz = selectedBatType.fuzz;
    playSound('fogstop',-0.2);
    tagDelete(selectedBat,'mining');
    selectedBatArrayUpdate();
    checkFoggedTiles();
    showBatInfos(selectedBat);
};

function checkFoggedTiles() {
    foggersTiles = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (batType.skills.includes('fog') && bat.tags.includes('fog')) {
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

function checkTransToCrew(myBat,myBatType) {
    let reqCit = myBatType.squads*myBatType.squadSize*myBatType.crew;
    let mostCits = 0;
    let enoughCits = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && bat.locId === myBat.id && bat.type === 'Citoyens') {
            if (bat.citoyens > mostCits) {
                if (bat.citoyens >= reqCit) {
                    enoughCits = true;
                    mostCits = bat.citoyens;
                }
            }
        }
    });
    return enoughCits;
};

function putTransToCrew() {
    let reqCit = selectedBatType.squads*selectedBatType.squadSize*selectedBatType.crew;
    let citBatId = -1;
    let mostCits = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && bat.locId === selectedBat.id && bat.type === 'Citoyens') {
            if (bat.citoyens > mostCits) {
                if (bat.citoyens >= reqCit) {
                    citBatId = bat.id;
                    mostCits = bat.citoyens;
                }
            }
        }
    });
    if (citBatId >= 0) {
        let citBat = getBatById(citBatId);
        if (citBat.citoyens-reqCit >= 1) {
            citBat.citoyens = citBat.citoyens-reqCit;
            citBat.squadsLeft = Math.ceil(citBat.citoyens/6);
        } else {
            deadBatsList = [];
            deadBatsList.push(citBat.id);
            killBatList();
        }
        tagDelete(selectedBat,'nopilots');
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
    }
};

function putCrew() {
    let dispoCit = getDispoCit();
    let reqCit = selectedBatType.squads*selectedBatType.squadSize*selectedBatType.crew;
    if (dispoCit >= reqCit) {
        tagDelete(selectedBat,'nopilots');
        selectedBatArrayUpdate();
        let landersIds = findLandersIds();
        let restCit = dispoCit-reqCit;
        deadBatsList = [];
        bataillons.forEach(function(bat) {
            if (bat.loc === 'trans' && landersIds.includes(bat.locId) && bat.type === 'Citoyens') {
                if (restCit === 0) {
                    bat.citoyens = 0;
                    deadBatsList.push(bat.id);
                } else {
                    bat.citoyens = restCit;
                    bat.squadsLeft = Math.ceil(bat.citoyens/6);
                }
            }
        });
        if (restCit === 0) {
            killBatList();
        }
        if (inSoute) {
            goSoute();
        }
        showBatInfos(selectedBat);
    }
};

function hasSnif(bat,batType) {
    let canSnif = false;
    if (batType.skills.includes('snif')) {
        if (batType.skills.includes('dog')) {
            if (bat.tags.includes('genblind') || bat.tags.includes('genslow') || bat.tags.includes('genwater')) {
                canSnif = true;
            } else {
                if (!bat.tags.includes('genstrong') && !bat.tags.includes('genfast') && !bat.tags.includes('genreg')) {
                    canSnif = true;
                }
            }
        } else {
            canSnif = true;
        }
    } else {
        if (bat.tags.includes('genblind')) {
            if (bat.tags.includes('genslow') || bat.tags.includes('genwater') || bat.tags.includes('genreg') || bat.vet >= 4) {
                canSnif = true;
            }
        }
    }
    return canSnif;
};

function getGenModCost(batType) {
    let cost = {};
    let amount = batType.squads*batType.squadSize*batType.size;
    if (batType.skills.includes('moto')) {
        amount = amount/5*3;
    }
    cost['Calcium'] = Math.ceil(amount/2);
    if (playerInfos.gang === 'drogmulojs') {
        amount = amount/2;
    }
    cost['Creatite'] = Math.ceil(amount/3);
    cost['Azote'] = Math.ceil(amount/2.5);
    cost['Mercure'] = Math.ceil(amount/6);
    cost['Drogues'] = Math.ceil(amount/4);
    cost['Mendium'] = Math.ceil(amount/12);
    cost['Swarmine'] = Math.ceil(amount/5);
    cost['Aranium'] = Math.ceil(amount/10);
    cost['Larvium'] = Math.ceil(amount/15);
    cost['Bugium'] = Math.ceil(amount/2);
    return cost;
};

function getGenModChance() {
    let goodChance = (playerInfos.comp.ca*8)+(playerInfos.comp.med*6)+(playerInfos.comp.gen*12);
    if (playerInfos.bldList.includes('Centre de recherches')) {
        goodChance = goodChance+10;
    }
    return goodChance;
}

function doGenMod() {
    if (!selectedBat.tags.includes('genwater') && !selectedBat.tags.includes('genblind') && !selectedBat.tags.includes('genslow') && !selectedBat.tags.includes('genreg') && !selectedBat.tags.includes('genred') && !selectedBat.tags.includes('genstrong') && !selectedBat.tags.includes('genfast') && !selectedBat.tags.includes('genko') && !selectedBat.tags.includes('genimmune') && !selectedBat.tags.includes('genweak')) {
        let goodChance = getGenModChance();
        let genDice = 0;
        if (rand.rand(1,100) <= goodChance) {
            genDice = rand.rand(6,10);
        } else {
            genDice = rand.rand(0,5);
        }
        let mayStrong = false;
        if (Object.keys(selectedBatType.weapon).length >= 3) {
            if (selectedBatType.weapon.isMelee || selectedBatType.weapon.name.includes('Javelot')) {
                mayStrong = true;
            }
        }
        if (Object.keys(selectedBatType.weapon2).length >= 3) {
            if (selectedBatType.weapon2.isMelee || selectedBatType.weapon2.name.includes('Javelot')) {
                mayStrong = true;
            }
        }
        if (selectedBatType.mining != undefined) {
            mayStrong = true;
        }
        if (selectedBatType.skills.includes('fret')) {
            mayStrong = true;
        }
        if (genDice === 2) {
            selectedBat.tags.push('genblind'); // 0.75 Accuracy
            warning('Modification génétique',selectedBat.type+' deviennent à moitié aveugles',false);
        } else if (genDice === 3 && !selectedBatType.skills.includes('fly') && !selectedBatType.skills.includes('moto')) {
            selectedBat.tags.push('genslow'); // 1.25 MoveCost
            warning('Modification génétique',selectedBat.type+' deviennent boiteux',false);
        } else if (genDice === 4) {
            selectedBat.tags.push('genwater'); // Pas de sortie sous la pluie & pas de déplacement dans l'eau (OK avec scaphandre 2)
            warning('Modification génétique',selectedBat.type+' deviennent allergiques à l\'eau',false);
        } else if (genDice === 5) {
            selectedBat.tags.push('genweak'); // Sensibilité aux poisons et maladies
            warning('Modification génétique',selectedBat.type+' ont leur système immunitaire affaibli',false);
        } else if (genDice === 6 && !selectedBatType.skills.includes('regeneration')) {
            selectedBat.tags.push('genreg'); // Régénération rapide
            warning('Modification génétique',selectedBat.type+' acquièrent la régénération',false);
        } else if (genDice === 7 && mayStrong) {
            selectedBat.tags.push('genstrong'); // Mêlée power +4
            warning('Modification génétique',selectedBat.type+' acquièrent une force exceptionnelle',false);
        } else if (genDice === 8 && !selectedBatType.skills.includes('fly') && !selectedBatType.skills.includes('moto') && !selectedBatType.skills.includes('cage') && !selectedBatType.skills.includes('machine')) {
            selectedBat.tags.push('genfast'); // 0.7 MoveCost
            warning('Modification génétique',selectedBat.type+' acquièrent un déplacement rapide',false);
        } else if (genDice === 9) {
            selectedBat.tags.push('genred'); // Réduction de dégâts: 2
            warning('Modification génétique',selectedBat.type+' acquièrent une peau épaisse (résistance aux dégâts)',false);
        } else if (genDice === 10) {
            selectedBat.tags.push('genimmune'); // Immunisé poisons et maladies
            warning('Modification génétique',selectedBat.type+' acquièrent une immunité aux poisons et maladies',false);
        } else {
            selectedBat.tags.push('genko'); // Rien
            warning('Modification génétique','Aucun effet',false);
        }
        if (selectedBat.soins === undefined) {
            selectedBat.soins = 15;
        } else {
            selectedBat.soins = selectedBat.soins+15;
        }
        let costs = getGenModCost(selectedBatType);
        payCost(costs);
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
        if (inSoute) {
            goSoute();
        }
    }
};
