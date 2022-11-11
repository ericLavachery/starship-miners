function nextTurn() {
    testConnect(pseudo);
    saveGame();
    if (zone[0].dark) {
        checkUndark();
    }
    console.log('NOUVEAU TOUR');
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    // stopMe = true;
    blockMe(true);
    $('#warnings').empty();
    if (aliens.length >= 200) {
        playerInfos.alienSat = playerInfos.alienSat+1;
    }
    if (playerInfos.alienSat >= coconSatLimit-1) {
        if (playerInfos.vue >= 4 && playerInfos.comp.ca >= 2) {
            warning('Cocon en approche','Le nombre d\'aliens en jeu est trop élevé.');
        }
    }
    activeTurn = 'aliens';
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    selectMode();
    batUnstack();
    batUnselect();
    if (playerInfos.mapTurn === 0) {
        checkStartingAliens();
    } else if (aliens.length < 50) {
        if (rand.rand(1,4) === 1) {
            letsHunt(false);
        }
    }
    // récup des aliens
    deadAliensList = [];
    alienTypesList = [];
    visibleAliens = [];
    getColonyTiles();
    let unitIndex;
    let batType;
    let hasHide = false;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (bat.logeq === undefined) {
                bat.logeq = '';
            }
            deFog(bat,batType);
            if ((!bat.tags.includes('invisible') && !batType.skills.includes('invisible')) || playerInfos.vue >= 5) {
                visibleAliens.push(bat.tileId);
            }
            if (!alienTypesList.includes(batType.name)) {
                alienTypesList.push(batType.name);
            }
            if (bat.type === 'Colonie') {
                if (!bat.tags.includes('slowreg')) {
                    if (playerInfos.mapTurn-bat.creaTurn >= 10) {
                        bat.tags.push('slowreg');
                    }
                    if (playerInfos.mapTurn < 3) {
                        bat.tags.push('slowreg');
                    }
                }
            }
            if (!bat.tags.includes('invisible')) {
                hasHide = false;
                if (batType.skills.includes('hide')) {
                    hasHide = true;
                }
                if (batType.kind === 'larve' && !batType.skills.includes('fly') && !batType.skills.includes('invisible') && larveHIDE) {
                    hasHide = true;
                }
                if (hasHide && bat.salvoLeft >= 1 && !bat.tags.includes('fluo')) {
                    bat.tags.push('invisible');
                }
            }
            if (batType.skills.includes('healhide')) {
                if (bat.squadsLeft <= 3) {
                    if (!bat.tags.includes('invisible') && !bat.tags.includes('fluo')) {
                        bat.tags.push('invisible');
                    }
                } else {
                    tagDelete(bat,'invisible');
                }
            }
            bat.salvoLeft = batType.maxSalvo;
            if (bat.apLeft < 0-bat.ap-bat.ap) {
                bat.apLeft = 0-bat.ap-bat.ap;
            }
            bat.apLeft = bat.apLeft+bat.ap;
            if (bat.apLeft > bat.ap) {
                bat.apLeft = bat.ap;
            }
            bat.oldTileId = bat.tileId;
            bat.oldapLeft = bat.apLeft;
            tagsEffect(bat,batType);
            if (bat.tags.includes('guide') && batType.skills.includes('nolaser')) {
                tagDelete(bat,'guide');
            }
            if (bat.tags.includes('fluo') && (batType.skills.includes('hide') || batType.skills.includes('nolaser'))) {
                tagDelete(bat,'fluo');
            }
            tagDelete(bat,'rage');
            if (batType.skills.includes('permashield')) {
                if (!bat.tags.includes('shield')) {
                    bat.tags.push('shield');
                }
            } else {
                tagDelete(bat,'shield');
            }
            tagDelete(bat,'nez');
            if (rand.rand(1,3) != 1) {
                tagDelete(bat,'stun');
            }
            tagDelete(bat,'jelly');
            if (bat.tags.includes('jello')) {
                tagDelete(bat,'jello');
                bat.tags.push('jelly');
                bat.tags.push('jelly');
                bat.tags.push('jelly');
            }
            if (rand.rand(1,3) === 1) {
                tagDelete(bat,'freeze');
            }
            if (playerInfos.mapTurn > bat.creaTurn+7 && bat.type != 'Oeuf voilé' && !batType.skills.includes('hide') && !batType.skills.includes('healhide') && !larveHIDE) {
                tagDelete(bat,'invisible');
            }
            if (playerInfos.mapTurn > bat.creaTurn+2 && bat.type != 'Oeuf voilé' && !batType.skills.includes('hide') && !batType.skills.includes('healhide') && !larveHIDE && bat.tags.includes('follow')) {
                tagDelete(bat,'invisible');
            }
            if (batType.kind === 'game') {
                if (playerInfos.mapTurn > bat.creaTurn+1) {
                    tagDelete(bat,'invisible');
                }
                if (aliens.length >= 100 && rand.rand(1,5) === 1) {
                    bat.squadsLeft = 0;
                    checkDeath(bat,batType);
                }
                let tile = getTile(bat);
                if (tile.x === 1 || tile.x === 60 || tile.y === 1 || tile.y === 60) {
                    bat.squadsLeft = 0;
                    checkDeath(bat,batType);
                }
            }
        }
    });
    killAlienList();
    checkEggsDrop();
    spawns();
    spawnSound();
    if (showMini) {
        unitsView(); // minimap radar
    }
    if (aliens.length >= 60) {
        alienSounds(4);
    } else if (aliens.length >= 30) {
        alienSounds(3);
    } else if (aliens.length >= 12) {
        alienSounds(2);
    } else if (aliens.length >= 6) {
        alienSounds(1);
    }
    killAlienList();
    conselReset(true);
    spawnType = {};
    if (aliens.length >= 1) {
        alienTurn();
    } else {
        nextTurnEnd();
    }
};

function alienTurnEnd() {
    deadAliensList = [];
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            let batType = getBatType(bat);
            if (bat.tags.includes('suicide')) {
                bat.squadsLeft = bat.squadsLeft-1;
                if (bat.squadsLeft <= 0) {
                    deadAliensList.push(bat.id);
                }
            }
            if (batType.skills.includes('lurk') || batType.skills.includes('dive') || batType.skills.includes('creep')) {
                let tile = getTile(bat);
                let hideTerrains = [];
                if (batType.skills.includes('lurk') && bat.salvoLeft >= 1 && !bat.tags.includes('fluo')) {
                    hideTerrains.push('F');
                }
                if (batType.skills.includes('dive')) {
                    hideTerrains.push('R');
                    hideTerrains.push('L');
                    hideTerrains.push('W');
                    hideTerrains.push('S');
                }
                if (batType.skills.includes('creep') && bat.salvoLeft >= 1 && !bat.tags.includes('fluo')) {
                    hideTerrains.push('F');
                    hideTerrains.push('B');
                    hideTerrains.push('M');
                    hideTerrains.push('S');
                }
                if (hideTerrains.includes(tile.terrain)) {
                    if (!bat.tags.includes('invisible')) {
                        bat.tags.push('invisible');
                    }
                } else {
                    if (bat.tags.includes('invisible') && !bat.tags.includes('follow')) {
                        tagDelete(bat,'invisible');
                    }
                }
            }
        }
    });
    killAlienList();
}

function nextTurnEnd() {
    alienTurnEnd();
    alienCanon();
    createStormsLists(false);
    $('#report').empty('');
    // récup du player
    let batType;
    let ap;
    let oldAP;
    let tagIndex;
    deadBatsList = [];
    let boostedTeams = [];
    let prayedTeams = [];
    let clericTiles = [];
    medicalTransports = [];
    playerInfos.bldList = [];
    craftReset(1);
    landers = [];
    minedThisTurn = {};
    let ravitNum;
    let emptyBonus;
    let minAP;
    let apRest;
    let camoEnCours = false;
    let distance;
    let alienType;
    let noStuck = false;
    hasScraptruck = false;
    let barIds = [];
    let campIds = [];
    let stockTileIds = [];
    let ravitTileIds = [];
    let resSpace;
    let resMax;
    let resLoaded;
    let landerTileId = -1;
    let landerTileDist = 99;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (bat.squadsLeft <= 1 && batType.squads >= 3) {
                addStressFlag(bat,'turn');
                addStressFlag(bat,'turn');
            } else {
                addStressFlag(bat,'turn');
            }
            if (batType.name === 'Scraptrucks') {
                hasScraptruck = true;
            }
            if (batType.skills.includes('stock') || (batType.skills.includes('ravitprod') && batType.skills.includes('ravitall'))) {
                stockTileIds.push(bat.tileId);
            }
            if (batType.skills.includes('stock') || batType.skills.includes('ravitaillement')) {
                ravitTileIds.push(bat.tileId);
            }
            if (batType.skills.includes('transorbital')) {
                let centerDistance = calcDistance(bat.tileId,1830);
                if (landerTileId < 0) {
                    landerTileId = bat.tileId;
                    landerTileDist = centerDistance;
                } else {
                    if (centerDistance < landerTileDist) {
                        landerTileId = bat.tileId;
                        landerTileDist = centerDistance;
                    }
                }
            }
            if (batType.skills.includes('transorbital') || batType.skills.includes('reserve')) {
                landers.push(bat);
            }
            if (bat.loc === "zone") {
                if (batType.name === 'Bar' && playerInfos.gang === 'drogmulojs') {
                    barIds.push(bat.id);
                }
                if (batType.name === "Camp d'entraînement") {
                    campIds.push(bat.id);
                }
                if (batType.cat === 'buildings' && !batType.skills.includes('nolist') && !bat.tags.includes('construction')) {
                    if (!playerInfos.bldList.includes(batType.name)) {
                        playerInfos.bldList.push(batType.name);
                    }
                }
                if (batType.bldEquiv.length >= 1) {
                    batType.bldEquiv.forEach(function(bldName) {
                        if (!playerInfos.bldList.includes(bldName)) {
                            playerInfos.bldList.push(bldName);
                        }
                    });
                }
            }
            if (batType.skills.includes('cleric')) {
                let cTile = bat.tileId;
                if (!clericTiles.includes(cTile)) {clericTiles.push(cTile);}
                if (!clericTiles.includes(cTile+1)) {clericTiles.push(cTile+1);}
                if (!clericTiles.includes(cTile-1)) {clericTiles.push(cTile-1);}
                if (!clericTiles.includes(cTile+mapSize)) {clericTiles.push(cTile+mapSize);}
                if (!clericTiles.includes(cTile-mapSize)) {clericTiles.push(cTile-mapSize);}
                if (!clericTiles.includes(cTile+mapSize+1)) {clericTiles.push(cTile+mapSize+1);}
                if (!clericTiles.includes(cTile+mapSize-1)) {clericTiles.push(cTile+mapSize-1);}
                if (!clericTiles.includes(cTile-mapSize+1)) {clericTiles.push(cTile-mapSize+1);}
                if (!clericTiles.includes(cTile-mapSize-1)) {clericTiles.push(cTile-mapSize-1);}
            }
            if (batType.skills.includes('leader') && !boostedTeams.includes(batType.kind)) {
                boostedTeams.push(batType.kind);
            }
            if (bat.tags.includes('prayer') && !prayedTeams.includes(batType.kind)) {
                prayedTeams.push(batType.kind);
            }
            if (!medicalTransports.includes(bat.locId) && bat.loc === "trans" && batType.skills.includes('realmed')) {
                let theTrans = getBatById(bat.locId);
                let theTransType = getBatType(theTrans);
                if (theTransType.skills.includes('medic')) {
                    medicalTransports.push(bat.locId);
                } else if (theTransType.skills.includes('badmedic') && playerInfos.comp.med >= 3) {
                    if (theTrans.eq === 'e-medic' || theTrans.logeq === 'e-medic') {
                        medicalTransports.push(bat.locId);
                    }
                }
            }
            if (!medicalTransports.includes(bat.id) && batType.transUnits >= 1 && batType.skills.includes('medtrans')) {
                medicalTransports.push(bat.id);
            }
            if (bat.loc === "trans") {
                let motherBat = getBatById(bat.locId);
                if (Object.keys(motherBat).length >= 1) {
                    if (motherBat.loc === 'trans') {
                        let grandMotherBat = getBatById(motherBat.locId);
                        console.log('MATRIOCHKA!');
                        console.log(bat);
                        console.log(motherBat);
                        console.log(grandMotherBat);
                        loadBat(bat.id,grandMotherBat.id,motherBat.id);
                    } else {
                        bat.tileId = motherBat.tileId;
                        bat.oldTileId = motherBat.oldTileId;
                    }
                } else {
                    console.log('ETHERBAT!');
                    console.log(bat);
                    bat.loc = "zone";
                    bat.tileId = 1829;
                    bat.oldTileId = 1829;
                }
            }
            updateBatProperties(bat,batType);
            if (bat.autoLoad != undefined && bat.loc === 'zone') {
                if (Array.isArray(bat.autoLoad)) {
                    bat.autoLoad.forEach(function(batId) {
                        let fromBat = getBatById(batId);
                        if (Object.keys(fromBat).length >= 1) {
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1 || checkResTeleport(bat,fromBat)) {
                                autoResLoad(bat,fromBat);
                            }
                        }
                    });
                }
            }
        }
    });
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (bat.loc === "zone") {
                if (batType.skills.includes('upkeep') || batType.skills.includes('prodres') || batType.skills.includes('upnodis')) {
                    if (!bat.tags.includes('construction') && bat.apLeft >= 10) {
                        upkeepAndProd(bat,batType,1,false,false);
                    }
                }
                if (batType.skills.includes('geo') && bat.tags.includes('prodres') && bat.apLeft >= 0) {
                    geoProd(bat,batType);
                }
                if (batType.skills.includes('solar') && bat.tags.includes('prodres') && bat.apLeft >= 0) {
                    solarProd(bat,batType,1,false,false);
                }
                if (batType.skills.includes('cryogen') && bat.tags.includes('prodres') && bat.apLeft >= 0) {
                    gasProd(bat,batType);
                }
                if (batType.skills.includes('transcrap') && bat.tags.includes('prodres') && bat.apLeft >= 10) {
                    triProd(bat,batType,1,false,false);
                }
                if (!playerInfos.onShip) {
                    if (bat.eq.includes('psol') || bat.logeq.includes('psol') || bat.eq.includes('bldkit') || bat.logeq.includes('bldkit')) {
                        solarPanel(bat,batType);
                    }
                }
            }
            // AUTORAVIT
            if (batType.skills.includes('autoapprov') && bat.tags.includes('sU')) {
                stockTileIds.forEach(function(tileId) {
                    if (bat.tags.includes('sU')) {
                        let stockDist = calcDistance(bat.tileId,tileId);
                        if (stockDist <= 6) {
                            bat.tags = bat.tags.filter(a => a !== 'sU');
                        }
                    }
                });
            }
            if (bat.tags.includes('dU') && bat.apLeft >= 8) {
                ravitTileIds.forEach(function(tileId) {
                    if (bat.tags.includes('dU')) {
                        let stockDist = calcDistance(bat.tileId,tileId);
                        if (stockDist <= 3) {
                            bat.tags = bat.tags.filter(a => a !== 'dU');
                        }
                    }
                });
            }
            // AUTOLOAD
            if (bat.autoLoad != undefined && bat.loc === 'zone') {
                if (Array.isArray(bat.autoLoad)) {
                    bat.autoLoad.forEach(function(batId) {
                        let fromBat = getBatById(batId);
                        if (Object.keys(fromBat).length >= 1) {
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1 || checkResTeleport(bat,fromBat)) {
                                autoResLoad(bat,fromBat);
                            }
                        }
                    });
                }
            }
            // BAR
            if (batType.cat === 'infantry' && bat.loc === "trans" && barIds.includes(bat.locId) && !bat.tags.includes('moloko')) {
                bat.tags.push('moloko');
                bat.tags.push('moloko');
            }
            // CAMP ENTRAINEMENT
            if (playerInfos.bldList.includes('Camp d\'entraînement')) {
                if (!batType.skills.includes('robot') || bat.eq === 'g2ai' || bat.logeq === 'g2ai') {
                    if (bat.loc === "trans" && campIds.includes(bat.locId)) {
                        bat.xp = bat.xp+1;
                    } else {
                        if (rand.rand(1,100) <= 33) {
                            bat.xp = bat.xp+1;
                        }
                    }
                }
            }
            deFog(bat,batType);
            bat.apLeft = Math.ceil(bat.apLeft);
            if (bat.apLeft < 0-(bat.ap*2) && batType.cat != 'buildings' && batType.cat != 'devices' && !bat.tags.includes('construction')) {
                bat.apLeft = 0-(bat.ap*2);
            }
            // nolist
            if (bat.loc === "zone" && bat.tags.includes('nolist')) {
                aliens.forEach(function(alien) {
                    distance = calcDistance(bat.tileId,alien.tileId);
                    alienType = getBatType(alien);
                    if (distance <= bat.range && !alienType.skills.includes('invisible') && !alien.tags.includes('invisible')) {
                        tagDelete(bat,'nolist');
                    }
                });
            }
        }
    });
    // console.log('Medical Transports');
    // console.log(medicalTransports);
    // console.log('Boosted Teams');
    // console.log(boostedTeams);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('extraction')) {
                mining(bat);
            }
            if (batType.skills.includes('unload')) {
                console.log('AUTO-UNLOAD'+bat.type);
                autoUnload(bat);
            }
            if (bat.autoLoad != undefined && bat.loc === 'zone') {
                if (Array.isArray(bat.autoLoad)) {
                    bat.autoLoad.forEach(function(batId) {
                        let fromBat = getBatById(batId);
                        if (Object.keys(fromBat).length >= 1) {
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1 || checkResTeleport(bat,fromBat)) {
                                autoResLoad(bat,fromBat);
                            }
                        }
                    });
                }
            }
            levelUp(bat,batType);
            // Motorised noStuck
            noStuck = false;
            if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !bat.tags.includes('action') && bat.apLeft < 0 && !bat.tags.includes('ravit') && !bat.tags.includes('construction') && bat.oldTileId === bat.tileId) {
                if (batType.skills.includes('guerrilla')) {
                    if (bat.apLeft <= -12) {
                        noStuck = true;
                    }
                } else {
                    if (bat.apLeft <= -6) {
                        noStuck = true;
                    }
                }
                bat.apLeft = bat.apLeft+bat.ap;
                if (bat.apLeft > 0) {
                    bat.apLeft = 0;
                }
                if (bat.apLeft < 0-Math.round(bat.ap-4)) {
                    bat.apLeft = 0-Math.round(bat.ap-4);
                }
            }
            // AP
            ap = getAP(bat,batType);
            if (!batType.skills.includes('domeconst')) {
                if (boostedTeams.includes(batType.kind)) {
                    ap = ap+1;
                }
                if (prayedTeams.includes(batType.kind)) {
                    ap = ap+1;
                }
            }
            oldAP = ap;
            // camoAP
            camoEnCours = false;
            if (bat.camoAP >= 1) {
                camoEnCours = true;
            }
            if (camoEnCours) {
                console.log('Camouflage en cours');
                minAP = Math.ceil(bat.ap/2);
                apRest = bat.apLeft-minAP;
                bat.apLeft = minAP;
                console.log('camoAP '+bat.camoAP);
                bat.camoAP = bat.camoAP-ap-apRest;
                if (bat.camoAP <= 0) {
                    longCamo(bat);
                    ap = 0-bat.camoAP;
                    bat.camoAP = -1;
                    console.log('fin!');
                } else {
                    ap = 0;
                }
                console.log('camoAP '+bat.camoAP);
            }
            bat.apLeft = bat.apLeft+ap;
            if (bat.apLeft > oldAP) {
                bat.apLeft = oldAP;
            }
            // production
            // if (bat.tags.includes('prodres') && !batType.skills.includes('upkeep')) {
            //     bat.apLeft = bat.apLeft-1;
            // }
            // tracking
            if (checkTracking(bat)) {
                bat.apLeft = bat.apLeft-4;
            }
            // nostun
            if (batType.skills.includes('nostun') && bat.apLeft < 1) {
                bat.apLeft = 1;
            }
            if (noStuck && batType.maxSalvo <= 2) {
                bat.salvoLeft = 0;
            } else {
                bat.salvoLeft = batType.maxSalvo;
            }
            // priest praying
            if (bat.tags.includes('prayer')) {
                bat.apLeft = bat.apLeft-3;
            }
            // véhicules usés
            if (batType.cat === 'vehicles') {
                if (bat.soins != undefined) {
                    if (bat.soins >= 11) {
                        bat.apLeft = bat.apLeft-checkVehiclesAPSoins(bat,batType);
                    }
                }
            }
            if (landerTileId >= 0) {
                if (!batType.skills.includes('robot') || bat.eq === 'g2ai' || bat.logeq === 'g2ai') {
                    let distFromLander = calcDistance(bat.tileId,landerTileId);
                    if (distFromLander >= 17) {
                        bat.xp = bat.xp+0.3;
                        let parcours = calcDistance(bat.tileId,bat.oldTileId);
                        if (parcours > 2) {
                            bat.xp = bat.xp+0.3;
                        }
                    }
                }
            }
            bat.oldTileId = bat.tileId;
            bat.oldapLeft = bat.apLeft;
            if (batType.skills.includes('notarget') && bat.fuzz > -2) {
                bat.fuzz = -2;
            }
            if (bat.fuzz <= -2 && !batType.skills.includes('notarget') && !bat.tags.includes('camo')) {
                bat.fuzz = batType.fuzz;
            }
            planetEffects(bat,batType);
            tagsEffect(bat,batType);
            tagsUpdate(bat);
            if (bat.loc === "zone") {
                blub(bat,batType);
            }
            if (batType.moveCost < 90) {
                if (clericTiles.includes(bat.tileId)) {
                    if (!bat.tags.includes('zealot')) {
                        bat.tags.push('zealot');
                    }
                }
            }
            bat.xp = bat.xp.toFixedNumber(2);
            if (bat.tags.includes('zombie')) {
                bat.xp = 150;
            }
            bat.apLeft = bat.apLeft.toFixedNumber(1);
            // nolist
            if (batType.skills.includes('nolist') && !bat.tags.includes('nolist')) {
                bat.tags.push('nolist');
            }
            // fin champ de force
            if (bat.type === 'Champ de force') {
                if (playerInfos.mapTurn >= bat.creaTurn+25) {
                    batDeathEffect(bat,true,'Bataillon détruit',bat.type+' expiré.');
                    bat.squadsLeft = 0;
                    checkDeath(bat,batType);
                }
            }
            // fin coffres
            if (batType.name === 'Coffres' && bat.tags.includes('go')) {
                resSpace = checkResSpace(bat);
                resMax = batType.transRes;
                if (resSpace >= resMax) {
                    batDeathEffect(bat,true,'Bataillon détruit',bat.type+' expiré.');
                    bat.squadsLeft = 0;
                    checkDeath(bat,batType);
                }
            }
            // FOG
            if (bat.tags.includes('fog')) {
                fogEffect(bat);
            }
            // RAVITPROD
            if (batType.skills.includes('ravitprod')) {
                let maxRavitProd = Math.ceil(batType.maxSkill/3);
                let i = 1;
                while (i <= maxRavitProd) {
                    if (bat.tags.includes('sU')) {
                        tagIndex = bat.tags.indexOf('sU');
                        bat.tags.splice(tagIndex,1);
                    } else {
                        break;
                    }
                    if (i > 16) {break;}
                    i++
                }
            }
        }
    });
    // LOAD AUTOMATION X2
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.autoLoad != undefined) {
                if (Array.isArray(bat.autoLoad)) {
                    bat.autoLoad.forEach(function(batId) {
                        let fromBat = getBatById(batId);
                        if (Object.keys(fromBat).length >= 1) {
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1 || checkResTeleport(bat,fromBat)) {
                                autoResLoad(bat,fromBat);
                            }
                        }
                    });
                }
            }
        }
    });
    alienOccupiedTileList();
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.autoLoad != undefined) {
                if (Array.isArray(bat.autoLoad)) {
                    bat.autoLoad.forEach(function(batId) {
                        let fromBat = getBatById(batId);
                        if (Object.keys(fromBat).length >= 1) {
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1 || checkResTeleport(bat,fromBat)) {
                                autoResLoad(bat,fromBat);
                            }
                        }
                    });
                }
            }
        }
        // STRESS
        if (bat.loc === "zone") {
            if (bat.emo != undefined) {
                if (bat.emo >= 11) {
                    checkStressEffect(bat);
                }
            }
        }
    });
    neighbours();
    killBatList();
    console.log('MINED THIS TURN');
    console.log(minedThisTurn);
    playerInfos.mapTurn = playerInfos.mapTurn+1;
    if (playerInfos.mapTurn % 50 === 0 && playerInfos.mapTurn >= 1) {
        zone[0].mapDiff = zone[0].mapDiff+1;
    }
    turnInfo();
    saveGame();
    createBatList();
    if (showMini) {
        unitsView(); // minimap radar
    }
    blockMe(false);
    activeTurn = 'player';
    nextTurnOK = false;
    commandes();
    // testConnect(pseudo);
};

function turnInfo() {
    console.log('TURN INFO');
    // let citNeed = getCitNeed();
    // console.log('citNeed = '+citNeed);
    planetThumb();
    checkNeiTurn();
    playerInfos.vue = playerInfos.comp.det;
    if (playerInfos.bldList.includes('Centre de com')) {
        playerInfos.vue = playerInfos.vue+1;
    } else if (!playerInfos.bldVM.includes('Centre de com')) {
        playerInfos.vue = playerInfos.vue-1;
    }
    if (!playerInfos.bldList.includes('Centre de com')) {
        if (!playerInfos.bldList.includes('Poste radio')) {
            if (playerInfos.vue > 1) {
                playerInfos.vue = 1;
            }
        } else {
            if (playerInfos.vue > 2) {
                playerInfos.vue = 2;
            }
        }
    }
    let numberOfEggs = 0;
    let numberOfAliens = 0;
    let numClassA = 0;
    let numClassS = 0;
    let realNumberOfEggs = 0;
    let isLarveHide = hasAlien('Liches');
    let hasLarveOV = hasAlienWithTag('Oeuf voilé','larve');
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.class === 'A') {
                numClassA++;
            }
            if (batType.class === 'S') {
                numClassS++;
            }
            if (bat.tags.includes('invisible')) {
                if (bat.tags.includes('fluo')) {
                    tagDelete(bat,'invisible');
                } else {
                    if (!isLarveHide) {
                        if (batType.kind === 'larve' && !batType.skills.includes('dive') && !batType.skills.includes('hide')) {
                            tagDelete(bat,'invisible');
                        }
                    } else {
                        if (batType.kind === 'larve' && !hasLarveOV) {
                            if (batType.skills.includes('fly')) {
                                tagDelete(bat,'invisible');
                            }
                        }
                    }
                }
            }
            if (bat.type === 'Oeuf' || bat.type === 'Coque' || bat.type === 'Cocon' || bat.type === 'Colonie') {
                let isVisible = true;
                if (zone[0].dark && !undarkNow.includes(bat.tileId) && !bat.tags.includes('fluo')) {
                    isVisible = checkEggInDark(bat.tileId);
                }
                if (isVisible) {
                    numberOfEggs++;
                }
                if (bat.type != 'Cocon') {
                    realNumberOfEggs++;
                }
            } else if (!bat.tags.includes('invisible') && !batType.skills.includes('invisible')) {
                numberOfAliens++;
            } else if (bat.type.includes('Oeuf')) {
                if (playerInfos.vue >= 4) {
                    numberOfEggs++;
                }
                realNumberOfEggs++;
            }
        }
    });
    eggsNum = numberOfEggs;
    aliensNum = numberOfAliens;
    let maxEggsForPause = 8+zone[0].mapDiff;
    if (realNumberOfEggs >= maxEggsForPause && !coconStats.dome) {
        playerInfos.eggPause = true;
        console.log('PAUSE! 10+ eggs');
        if (playerInfos.pseudo === 'Xxxxx') {
            warning('Nouvelle pause',maxEggsForPause+' oeufs ou plus en jeu.');
        }
    }
    let numHumans = 0;
    let fuzzTotal = 0;
    let foggersTiles = [];
    let dogTiles = [];
    let radarTiles = [];
    let zombifiersTiles = [];
    let roboControlers = [];
    let controlRange = 3;
    if (playerInfos.bldList.includes('Centre de com')) {
        controlRange = 12;
    } else if (playerInfos.bldList.includes('Poste radio')) {
        controlRange = 6;
    }
    hasScraptruck = false;
    landingNoise = 0;
    playerInfos.sci = 0;
    let nPil = 0;
    let nDom = 0;
    domeProtect = false;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (bat.fuzz <= -2 && !batType.skills.includes('notarget') && !bat.tags.includes('camo')) {
            bat.fuzz = batType.fuzz;
        }
        if (!batType.skills.includes('nodeathcount')) {
            numHumans++;
        }
        if (bat.type === 'Chercheurs') {
            playerInfos.sci++;
        }
        if (bat.loc === "zone") {
            if (bat.apLeft >= 1 && !bat.tags.includes('construction')) {
                if (batType.skills.includes('cfo')) {
                    domeProtect = true;
                }
                if (batType.skills.includes('dome')) {
                    nDom++;
                }
                if (batType.skills.includes('pilone')) {
                    nPil++;
                }
            }
            batFuzz = calcBatFuzz(bat);
            fuzzTotal = fuzzTotal+batFuzz;
            if (bat.type === 'Fog' && bat.tags.includes('fog')) {
                foggersTiles.push(bat.tileId);
            }
            if (batType.skills.includes('snif')) {
                dogTiles.push(bat.tileId);
            }
            if (batType.skills.includes('radar') || bat.eq === 'e-radar' || bat.logeq === 'e-radar') {
                radarTiles.push(bat.tileId);
            }
            if (bat.eq === 'e-control' || bat.logeq === 'e-control' || batType.skills.includes('control')) {
                roboControlers.push(bat.tileId);
            }
            if (bat.type === 'Necrotrucks') {
                zombifiersTiles.push(bat.tileId);
            }
            if (bat.type === 'Scraptrucks') {
                hasScraptruck = true;
            }
            if (batType.skills.includes('transorbital') && bat.eq != 'siland') {
                landingNoise = landingNoise+Math.floor(batType.hp/75*batType.fuzz*batType.fuzz/25)+2;
            }
            if (zone[0].dark) {
                if (batType.skills.includes('phare') || batType.skills.includes('bigflash') || bat.eq === 'e-phare' || bat.logeq === 'e-phare' || batType.skills.includes('radar') || bat.eq === 'e-radar' || bat.logeq === 'e-radar') {
                    unDarkVision(bat,batType);
                }
            }
        }
    });
    if (nDom >= 1 && nPil >= 4) {
        domeProtect = true;
        let domeBat = getBatTypeByName('Dôme');
        if (domeBat.opTurn != undefined) {
            if (domeBat.opTurn <= 0) {
                domeBat.opTurn = playerInfos.mapTurn;
            }
        } else {
            domeBat.opTurn = playerInfos.mapTurn;
        }
    }
    console.log('landingNoise = '+landingNoise);
    playerInfos.fuzzTotal = fuzzTotal;
    let bonusDiff = Math.floor((fuzzTotal+rand.rand(0,fuzzDiv)-(fuzzDiv/2))/fuzzDiv);
    playerInfos.mapAdjDiff = zone[0].mapDiff+bonusDiff;
    if (playerInfos.mapAdjDiff < 1) {
        playerInfos.mapAdjDiff = 1;
    }
    checkZoneType();
    undarkList();
    setCoconStats();
    checkCoconBonus();
    unitResist = calcUnitResist();
    // foggedTiles
    let distance;
    let radarDistance = 3+playerInfos.comp.det;
    foggedTiles = [];
    doggedTiles = [];
    zombifiedTiles = [];
    roboTiles = [];
    zone.forEach(function(tile) {
        foggersTiles.forEach(function(foggTile) {
            if (!foggedTiles.includes(tile.id)) {
                distance = calcDistance(tile.id,foggTile);
                if (distance <= fogRange) {
                    foggedTiles.push(tile.id);
                }
            }
        });
        dogTiles.forEach(function(dogTile) {
            if (!doggedTiles.includes(tile.id)) {
                distance = calcDistance(tile.id,dogTile);
                if (distance <= 2) {
                    doggedTiles.push(tile.id);
                }
            }
        });
        radarTiles.forEach(function(radarTile) {
            if (!doggedTiles.includes(tile.id)) {
                distance = calcDistance(tile.id,radarTile);
                if (distance <= radarDistance) {
                    doggedTiles.push(tile.id);
                }
            }
        });
        zombifiersTiles.forEach(function(zombTile) {
            if (!zombifiedTiles.includes(tile.id)) {
                distance = calcDistance(tile.id,zombTile);
                if (distance <= zombRange) {
                    zombifiedTiles.push(tile.id);
                }
            }
        });
        roboControlers.forEach(function(controlTile) {
            if (!roboTiles.includes(tile.id)) {
                distance = calcDistance(tile.id,controlTile);
                if (distance <= controlRange) {
                    roboTiles.push(tile.id);
                }
            }
        });
    });
    console.log('ALIENS: '+aliens.length);
    console.log('eggs: '+realNumberOfEggs);
    console.log('class S: '+numClassS);
    console.log('class A: '+numClassA);
    console.log('HUMAINS: '+numHumans);
    console.log('Robot Control Tiles');
    console.log(roboTiles);
    console.log('Zombified Tiles');
    console.log(zombifiedTiles);
    console.log('Fogged Tiles');
    console.log(foggedTiles);
    centerMap();
    if (!playerInfos.onShip) {
        $('#tour').empty().append('Tour '+playerInfos.mapTurn+'<br>');
        $('#tour').append('Attraction '+playerInfos.fuzzTotal+'<br>');
        if (playerInfos.mapTurn <= 1 && zone[0].mapDiff != playerInfos.sondeDanger) {
            $('#tour').append('<span class="wblynk">Présence Alien '+zone[0].mapDiff+'</span><br>');
        } else {
            $('#tour').append('Présence Alien <span class="or">'+zone[0].mapDiff+'</span><br>');
        }
        if (playerInfos.bldList.includes('Champ de force')) {
            if (domeProtect) {
                $('#tour').append('<span class="cy">Dôme actif</span><br>');
            } else {
                $('#tour').append('<span class="or">Dôme inactif</span><br>');
            }
        }
        if (playerInfos.vue >= 3 && playerInfos.comp.ca >= 2) {
            let allCoconTurns = [];
            let turn = 0;
            while (turn <= 300) {
                turn = turn+coconStats.turns;
                allCoconTurns.push(turn);
                if (turn > 300) {break;}
            }
            let turnCol = 'neutre';
            if (Math.floor(playerInfos.mapTurn/coconStats.turns) > playerInfos.cocons) {
                turnCol = 'wblynk';
            }
            let maxDroppedEggs = checkMaxDroppedEggs();
            let maxEggsInPlay = checkMaxEggsInPlay();
            // dropchance
            let dropChance = getDropChance(playerInfos.mapTurn);
            // pause
            if (!domeProtect) {
                if (playerInfos.droppedEggs < maxDroppedEggs+1 && realNumberOfEggs < maxEggsInPlay && dropChance >= 10 && !playerInfos.eggPause) {
                    if (allCoconTurns[playerInfos.cocons] <= playerInfos.mapTurn || playerInfos.alienSat >= coconSatLimit-1) {
                        $('#tour').append('<span class="wblynk" title="Oeuf(s) en approche">Cocon en approche</span><br>');
                    } else {
                        $('#tour').append('<span class="wblynk" title="Oeuf(s) en approche">Oeufs en approche</span><br>');
                    }
                } else {
                    $('#tour').append('<span class="neutre" title="Aucun oeuf en approche">Aucun oeuf en vue</span><br>');
                    turnCol = 'neutre';
                }
                if (playerInfos.vue >= 4 && playerInfos.comp.ca >= 2 && allCoconTurns[playerInfos.cocons]-10 <= playerInfos.mapTurn) {
                    let approxTurn = Math.round(allCoconTurns[playerInfos.cocons]/5)*5;
                    $('#tour').append('<span class="'+turnCol+'" title="Cocon prévu aux alentours du tour '+approxTurn+'">Cocon en approche</span><br>');
                }
            }
        }
        let sconvNear = false;
        if (playerInfos.vue >= 2) {
            if (playerInfos.vz-5-playerInfos.pauseSeed <= playerInfos.mapTurn) {
                if (playerInfos.vz-5-playerInfos.pauseSeed === playerInfos.mapTurn) {
                    warning('Convoi en approche','Attirés par le bruit, des survivants sont en route vers votre Lander.');
                }
                if (playerInfos.vue >= 5) {
                    $('#tour').append('<span class="wblynk" title="Convoi de survivants en approche (tour '+playerInfos.vz+') ('+playerInfos.vc+')">Survivants</span><br>');
                } else if (playerInfos.vue >= 4) {
                    $('#tour').append('<span class="wblynk" title="Convoi de survivants en approche (moins de 15 tours) ('+playerInfos.vc+')">Survivants</span><br>');
                } else {
                    $('#tour').append('<span class="wblynk" title="Convoi de survivants en approche (moins de 15 tours)">Survivants</span><br>');
                }
                sconvNear = true;
            }
        }
        if (playerInfos.vue >= 4) {
            if (playerInfos.vz < 90) {
                if (!sconvNear && playerInfos.mapTurn >= 10) {
                    if (playerInfos.vue >= 5 && playerInfos.mapTurn >= 20) {
                        let approxTurn = Math.round(playerInfos.vz/10)*10;
                        $('#tour').append('<span class="neutre" title="Convoi de survivants en approche (vers le tour '+approxTurn+')">Survivants</span><br>');
                    } else {
                        $('#tour').append('<span class="neutre" title="Convoi de survivants en approche (plus de 15 tours)">Survivants</span><br>');
                    }
                }
                if (playerInfos.mapTurn === 10) {
                    warning('Survivants','Notre centre de communication à détecté un convoi de survivants.');
                }
            }
        }
        $('#tour').append('Morts <span class="or" title="'+toNiceString(playerInfos.deadBats)+'">'+playerInfos.unitsLost+'</span> / <span class="neutre" title="Aliens tués">'+playerInfos.aliensKilled+'</span> / <span class="cy" title="Oeufs détruits">'+playerInfos.eggsKilled+'</span>');
    }
    checkVMTileIds();
    if (domeProtect && aliens.length <= 0) {
        gameOver = true;
        playRoom('start',true,false);
        calcEndRes(false);
        let score = calcScore();
        warning('Colonie établie!','Promis, on mettra un truc plus sympa pour la fin du jeu.<br>Vous avez sauvé <span class="cy">'+score.cits+' citoyens</span> en '+score.days+' jours.<br>Votre score est de <span class="cy">'+score.score+'</span>.');
        console.log(score);
    } else {
        let lastStand = checkLastStand();
        if (playerInfos.bldList.includes('Centre de com')) {
            if (lastStand.turn-20 <= playerInfos.mapTurn) {
                if (lastStand.turn-1 <= playerInfos.mapTurn) {
                    warning('Apocalypse','Imminent! : Les ruches et volcans vont se suicider en crachant à très grande distance.');
                } else {
                    let lsTurn = lastStand.turn;
                    let expertise = Math.floor((playerInfos.vue+playerInfos.comp.ca-1)/2)-1;
                    if (expertise < 1) {
                        lsTurn = 100;
                    } else if (expertise === 1) {
                        lsTurn = Math.round(lastStand.turn/10)*10;
                    } else if (expertise === 2) {
                        lsTurn = Math.round(lastStand.turn/5)*5;
                    }
                    if (expertise >= 1) {
                        warning('Apocalypse','Les ruches et volcans vont se suicider en crachant à très grande distance. Tour prévu par nos experts: '+lsTurn+'.');
                    } else {
                        warning('Apocalypse','Les ruches et volcans vont se suicider en crachant à très grande distance. Nos experts sont incapables de prévoir quand.');
                    }
                }
            }
        }
    }
    // feedZoneDB();
    // feedZoneDBwith(zone);
};

function checkLastStand() {
    let lastStand = {};
    lastStand.turn = 100+Math.round(playerInfos.pauseSeed/3);
    lastStand.go = false;
    let lastMission = hasUnit('Dôme');
    if (domeProtect) {
        if (lastMission) {
            let domeBat = getBatTypeByName('Dôme');
            if (domeBat.opTurn != undefined) {
                lastStand.turn = domeBat.opTurn+14+Math.round(playerInfos.pauseSeed/3);
                if (playerInfos.mapTurn >= lastStand.turn) {
                    lastStand.go = true;
                }
            }
        }
    }
    if (!lastMission) {
        if (lastStand.turn >= 100) {
            lastStand.turn = 65+(playerInfos.randSeed*5);
            if (playerInfos.mapTurn >= lastStand.turn) {
                lastStand.go = true;
            }
        }
    }
    return lastStand;
};

function getBatAP(bat,batType) {
    let newAP = getAP(bat,batType);
    let boostedTeams = [];
    let prayedTeams = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('leader') && !boostedTeams.includes(batType.kind)) {
                boostedTeams.push(batType.kind);
            }
            if (bat.tags.includes('prayer') && !prayedTeams.includes(batType.kind)) {
                prayedTeams.push(batType.kind);
            }

        }
    });
    if (!batType.skills.includes('domeconst')) {
        if (boostedTeams.includes(batType.kind)) {
            newAP = newAP+1;
        }
        if (prayedTeams.includes(batType.kind)) {
            newAP = newAP+1;
        }
    }
    return newAP;
};

function getAP(bat,batType) {
    let newAP = bat.ap;
    if (bat.eq === 'belier') {
        newAP = newAP*0.9;
    }
    if (playerInfos.bldList.includes('QG')) {
        newAP = newAP*1.1;
    }
    if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && batType.skills.includes('fly')) {
        if (playerInfos.bldList.includes('Aérodocks')) {
            newAP = newAP*1.15;
        }
    }
    if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && !batType.skills.includes('fly') && batType.moveCost < 90) {
        if (playerInfos.bldList.includes('Garage')) {
            newAP = newAP+1;
        }
    }
    if (bat.eq === 'g2motor' || bat.logeq === 'g2motor' || bat.eq === 'carkit') {
        newAP = newAP+(Math.sqrt(batType.moveCost)*2.5);
    }
    if (batType.skills.includes('heroap') && bat.tags.includes('hero')) {
        newAP = newAP+2;
    }
    if (bat.eq === 'helper' || bat.logeq === 'helper' || bat.eq === 'cyberkit' || bat.tdc.includes('helper')) {
        newAP = newAP+1;
    }
    if (bat.eq === 'e-lifepod') {
        newAP = newAP-1;
    }
    if (playerInfos.comp.trans >= 2 && batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && batType.moveCost < 90) {
        newAP = newAP+((batType.moveCost+1.5)*(playerInfos.comp.trans-1.25)/2.6);
    }
    if (batType.skills.includes('fastempty')) {
        emptyBonus = fastEmptyBonus(bat,batType);
        newAP = newAP+emptyBonus;
    }
    newAP = Math.round(newAP);
    newAP = newAP+Math.round(bat.vet*vetBonus.ap);
    if (batType.skills.includes('domeconst')) {
        newAP = bat.ap;
    }
    return newAP;
};

function fastEmptyBonus(bat,batType) {
    let apBonus = 0;
    if (batType.skills.includes('fastempty')) {
        if (batType.skills.includes('ravitaillement')) {
            let ravitNum = calcRavit(bat);
            if (ravitNum < batType.maxSkill) {
                apBonus = apBonus+((batType.maxSkill-ravitNum)/batType.maxSkill*2.5);
            }
        }
        if (batType.skills.includes('fret') && batType.transRes > batType.transUnits) {
            let resLoaded = checkResLoad(bat);
            if (resLoaded < batType.transRes) {
                apBonus = apBonus+((batType.transRes-resLoaded)/batType.transRes*2.5);
            }
        }
        if (batType.skills.includes('transport') && batType.transRes <= batType.transUnits) {
            let transLeft = calcTransUnitsLeft(bat,batType);
            apBonus = apBonus+(transLeft/batType.transUnits*2.5);
        }
    }
    // apBonus = apBonus.toFixedNumber(1);
    return apBonus;
};

function calcUnitResist() {
    let unitResist = -1;
    // INFIRMERIES
    if (playerInfos.bldList.includes('Hôpital')) {
        unitResist = unitResist+1.7;
    } else if (playerInfos.bldList.includes('Infirmerie')) {
        unitResist = unitResist+0.8;
    }
    // SPORT
    if (playerInfos.bldList.includes('Salle de sport')) {
        unitResist = unitResist+0.7;
    }
    // CANTINE
    if (playerInfos.bldList.includes('Cantine')) {
        unitResist = unitResist+0.8;
    }
    unitResist = unitResist+(playerInfos.comp.med/4);
    if (playerInfos.comp.med >= 3) {
        unitResist = unitResist+0.6;
    }
    unitResist = Math.round(unitResist);
    if (unitResist < 0) {
        unitResist = 1;
    }
    return unitResist;
};

function tagsUpdate(bat) {
    tagDelete(bat,'podcd');
    tagDelete(bat,'deb');
    tagDelete(bat,'chrg');
    tagDelete(bat,'vise');
    tagDelete(bat,'datt');
    tagDelete(bat,'autoroad');
    if (rand.rand(1,3) > 1) {
        tagDelete(bat,'noemb');
    }
    tagDelete(bat,'embuscade');
    tagDelete(bat,'lasso');
    tagDelete(bat,'gogogo');
    tagDelete(bat,'command');
    tagDelete(bat,'hsp');
    if (rand.rand(1,2) === 1) {
        tagDelete(bat,'rush');
    }
    if (rand.rand(1,2) === 1) {
        tagDelete(bat,'tame');
    }
    tagDelete(bat,'rage');
    if (rand.rand(1,3) === 1) {
        tagDelete(bat,'norage');
    }
    tagDelete(bat,'nofougue');
    tagDelete(bat,'kill');
    if (rand.rand(1,3) === 1) {
        tagDelete(bat,'nokill');
    }
    tagDelete(bat,'tornade');
    if (rand.rand(1,4) === 1) {
        tagDelete(bat,'notorn');
    }
    tagDelete(bat,'noBis1');
    tagDelete(bat,'noBis2');
    tagDelete(bat,'action');
    if (bat.apLeft >= 0-bat.ap) {
        tagDelete(bat,'construction');
        tagDelete(bat,'ravit');
    }
    if (!bat.tags.includes('prayer') && rand.rand(1,4) === 1) {
        tagDelete(bat,'spirit');
    }
    if (rand.rand(1,4) === 1) {
        tagDelete(bat,'prayer');
    }
    tagDelete(bat,'zealot');
    if (rand.rand(1,3) <= 2) {
        tagDelete(bat,'stun');
    }
    if (bat.tags.includes('moloko')) {
        if (rand.rand(1,4) === 1) {
            tagDelete(bat,'moloko');
            if (!bat.tags.includes('moloko')) {
                warning('Burp...',bat.type+' a la gueule de bois.',false,bat.tileId);
            }
        }
    }
    if (bat.tags.includes('octiron')) {
        if (rand.rand(1,5) === 1) {
            tagIndex = bat.tags.indexOf('octiron');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('octiron')) {
                drugDown(bat,false,false);
                if (bat.emo >= 11 && playerInfos.comp.ordre >= 2) {
                    warning('Stress',bat.type+' est n\'est plus sous l\'effet de l\'Octiron.',false,bat.tileId);
                }
            }
        }
    }
    if (bat.tags.includes('kirin')) {
        if (rand.rand(1,4) === 1) {
            tagIndex = bat.tags.indexOf('kirin');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('kirin')) {
                drugDown(bat,false,false);
            }
        }
    }
    if (bat.tags.includes('sila')) {
        if (rand.rand(1,4) === 1) {
            tagIndex = bat.tags.indexOf('sila');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('sila')) {
                drugDown(bat,true,false);
            }
        }
    }
    if (bat.tags.includes('bliss')) {
        if (rand.rand(1,5) === 1) {
            tagIndex = bat.tags.indexOf('bliss');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('bliss')) {
                drugDown(bat,false,true);
                if (bat.emo >= 11 && playerInfos.comp.ordre >= 2) {
                    warning('Stress',bat.type+' est n\'est plus sous l\'effet du Bliss.',false,bat.tileId);
                }
            }
        }
    }
    if (bat.tags.includes('blaze')) {
        if (rand.rand(1,3) === 1) {
            tagIndex = bat.tags.indexOf('blaze');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('blaze')) {
                drugDown(bat,true,true);
            }
        }
    }
    if (bat.tags.includes('skupiac')) {
        if (rand.rand(1,6) === 1) {
            tagIndex = bat.tags.indexOf('skupiac');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('skupiac')) {
                drugDown(bat,true,false);
            }
        }
    }
    if (bat.tags.includes('starka')) {
        tagIndex = bat.tags.indexOf('starka');
        bat.tags.splice(tagIndex,1);
        if (bat.tags.includes('starka')) {
            tagIndex = bat.tags.indexOf('starka');
            bat.tags.splice(tagIndex,1);
        }
        if (!bat.tags.includes('starka')) {
            drugDown(bat,false,false);
        }
    }
    if (bat.tags.includes('nitro')) {
        tagIndex = bat.tags.indexOf('nitro');
        bat.tags.splice(tagIndex,1);
        if (!bat.tags.includes('nitro')) {
            drugDown(bat,false,false);
        }
    }
};

function drugDown(bat,fatigue,addict) {
    if (fatigue) {
        if (bat.apLeft > 3) {
            bat.apLeft = 3;
        }
    }
    if (addict && rand.rand(1,3) === 1) {
        if (bat.emo != undefined) {
            bat.emo = bat.emo+1;
        } else {
            bat.emo = 1;
        }
    }
};

function blub(bat,batType) {
    let isBlub = true;
    let terrain = getTerrain(bat);
    if (bat.tags.includes('blub')) {
        let tile = getTile(bat);
        if ((terrain.name != 'L' && terrain.name != 'R') || tile.rd) {
            tagDelete(bat,'blub');
        } else {
            let totalDamage = bat.damage+rand.rand((Math.round(blubDamage/3)),blubDamage);
            if (batType.skills.includes('bigblub')) {
                totalDamage = totalDamage*10;
            }
            console.log('blubDamage='+totalDamage);
            let squadHP = batType.squadSize*batType.hp;
            let squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.apLeft > Math.round(bat.ap/2)) {
                bat.apLeft = Math.round(bat.ap/2);
            }
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' noyé.');
            }
            checkDeath(bat,batType);
        }
    } else {
        if (terrain.name === 'L' || terrain.name === 'R') {
            let tile = getTile(bat);
            if ((tile.seed <= 3 || terrain.name === 'L') && !tile.rd) {
                if (bat.eq != 'waterproof' && bat.logeq != 'waterproof' && !bat.tdc.includes('waterproof')) {
                    if ((!batType.skills.includes('fly') && !batType.skills.includes('hover') && !batType.skills.includes('noblub')) || batType.skills.includes('jetpack')) {
                        bat.tags.push('blub');
                    }
                }
            }
        }
    }
};

function tagsEffect(bat,batType) {
    let totalDamage;
    let squadHP;
    let squadsOut;
    // MUD
    if (bat.tags.includes('mud')) {
        if (batType.moveCost < 90) {
            bat.apLeft = bat.apLeft-bat.ap;
            if (batType.skills.includes('ranger') || batType.skills.includes('caterp') || bat.eq === 'e-ranger' || bat.logeq === 'e-ranger' || bat.tdc.includes('e-ranger')) {
                bat.apLeft = bat.apLeft+rand.rand(0,Math.ceil(bat.ap/3*2));
            } else if (bat.eq === 'chenilles' || bat.logeq === 'chenilles' || bat.eq === 'carkit') {
                bat.apLeft = bat.apLeft+rand.rand(0,Math.ceil(bat.ap/2));
            } else {
                bat.apLeft = bat.apLeft+rand.rand(0,Math.ceil(bat.ap/3));
            }
            if (bat.prt === 'swing' || bat.prt === 'soap') {
                let batTile = getTile(bat);
                if (batTile.web) {
                    tagDelete(bat,'mud');
                }
            }
        } else {
            tagDelete(bat,'mud');
        }
    }
    // WEB
    if (bat.tags.includes('web')) {
        if (bat.apLeft > 0) {
            bat.apLeft = 0;
        }
        tagDelete(bat,'web');
    }
    // BLAZE DRUG
    if (bat.tags.includes('blaze')) {
        bat.apLeft = bat.apLeft+3;
        bat.salvoLeft = bat.salvoLeft+1;
    }
    // OCTIRON DRUG
    if (bat.tags.includes('octiron') && bat.emo < 11) {
        bat.apLeft = bat.apLeft+4;
    }
    // NITRO DRUG
    if (bat.tags.includes('nitro')) {
        bat.apLeft = bat.apLeft+2;
    }
    // STARKA DRUG
    if (bat.tags.includes('starka')) {
        bat.apLeft = bat.apLeft+2;
    }
    // BLISS DRUG
    if (bat.tags.includes('bliss')) {
        bat.apLeft = bat.apLeft-1;
    }
    // MOLOKO DRUG
    if (bat.tags.includes('moloko')) {
        bat.apLeft = bat.apLeft-2;
    }
    // UNITRESIST
    let resistance = false;
    if (rand.rand(1,16) <= unitResist && bat.cat === 'infantry') {
        resistance = true;
    }
    // AUTOREPAIR
    if (bat.tags.includes('autorep')) {
        if (bat.damage >= 1) {
            bat.damage = bat.damage-50;
            if (bat.damage < 0) {
                bat.damage = 0;
            }
        }
    }
    // REGENERATION & KIRIN DRUG
    if (bat.tags.includes('kirin') || bat.tags.includes('genreg') || bat.tags.includes('slowreg') || bat.eq === 'permakirin' || bat.eq === 'cyberkit' || bat.logeq === 'permakirin' || bat.tags.includes('regeneration') || batType.skills.includes('regeneration') || batType.skills.includes('slowreg') || batType.skills.includes('fastreg') || batType.skills.includes('heal') || resistance) {
        let regOK = true;
        if (batType.cat === 'aliens') {
            if (batType.skills.includes('reactpoison') && bat.tags.includes('poison')) {
                regOK = false;
            }
            if (bat.tags.includes('shinda')) {
                regOK = false;
            }
        } else if (bat.tags.includes('necro') || bat.tags.includes('venin')) {
            regOK = false;
        }
        if (regOK) {
            squadHP = batType.squadSize*batType.hp;
            let batHP = squadHP*batType.squads;
            if (bat.citoyens >= 1) {
                batHP = bat.citoyens*batType.hp;
            }
            let regen;
            if (batType.skills.includes('heal')) {
                regen = batHP;
            } else if (batType.skills.includes('fastreg')) {
                regen = Math.round(batHP/2);
            } else if (bat.tags.includes('kirin') || bat.tags.includes('genreg') || batType.skills.includes('regeneration') || bat.tags.includes('regeneration')) {
                regen = Math.round(batHP*regenPower/100);
            } else {
                regen = Math.round(batHP*slowregPower/100);
            }
            // console.log('regeneration='+regen);
            let batHPLeft = (bat.squadsLeft*squadHP)-bat.damage+regen;
            if (batHPLeft > batHP) {
                batHPLeft = batHP;
            }
            bat.squadsLeft = Math.ceil(batHPLeft/squadHP);
            bat.damage = (bat.squadsLeft*squadHP)-batHPLeft;
            if (bat.squadsLeft > batType.squads) {
                bat.squadsLeft = batType.squads;
                bat.damage = 0;
            }
        }
    }
    // MALADIE
    if (bat.tags.includes('maladie') || bat.tags.includes('shinda')) {
        if (bat.tags.includes('skupiac') || bat.tags.includes('octiron') || bat.tags.includes('zombie')) {
            tagDelete(bat,'maladie');
        } else {
            if (rand.rand(1,20) <= unitResist && bat.cat != 'aliens') {
                tagDelete(bat,'maladie');
                warning('',bat.type+' a vaincu la maladie.',false,bat.tileId);
            } else {
                bat.apLeft = bat.apLeft-Math.floor(bat.ap/2.2);
                if (bat.squadsLeft < batType.squads || bat.damage >= 1) {
                    if (rand.rand(1,36) <= (4-unitResist) && bat.cat != 'aliens') {
                        bat.tags.push('venin');
                        if (!batType.skills.includes('resistpoison')) {
                            warning('',bat.type+' risque de succomber à la maladie.',false,bat.tileId);
                        }
                    }
                }
            }
        }
    }
    // OCTIRON & POISONS
    if (bat.tags.includes('octiron') || batType.skills.includes('resistpoison') || bat.tags.includes('zombie')) {
        if (bat.tags.includes('venin')) {
            tagDelete(bat,'venin');
        }
        if (bat.tags.includes('poison')) {
            tagDelete(bat,'poison');
            tagDelete(bat,'poison');
            tagDelete(bat,'poison');
        }
    }
    // NECRO
    if (bat.tags.includes('necro')) {
        if (bat.tags.includes('octiron')) {
            if (rand.rand(1,4) === 1) {
                tagDelete(bat,'necro');
                if (!bat.tags.includes('necro')) {
                    warning('',bat.type+' a éliminé la nécrotoxine.',false,bat.tileId);
                }
            }
        }
        if (rand.rand(3,48) <= unitResist) {
            tagDelete(bat,'necro');
            if (!bat.tags.includes('necro')) {
                warning('',bat.type+' a éliminé la nécrotoxine.',false,bat.tileId);
            }
        }
    }
    // RESISTACIDE & TROUS
    if (bat.tags.includes('resistacide') || batType.skills.includes('resistacide')) {
        if (bat.tags.includes('trou')) {
            tagDelete(bat,'trou');
        }
    }
    // KIRIN & POISONS
    if (bat.tags.includes('kirin')) {
        if (bat.tags.includes('venin') && rand.rand(1,6) === 1 && playerInfos.comp.med >= 3) {
            tagDelete(bat,'venin');
        }
        if (bat.tags.includes('poison') && (rand.rand(1,6) === 1 || playerInfos.comp.med >= 3)) {
            tagDelete(bat,'poison');
        }
    }
    if (!medicalTransports.includes(bat.locId) || bat.loc != 'trans') {
        // PARASITE
        if (bat.tags.includes('parasite') && bat.squadsLeft >= 1) {
            let parasiteDeg = Math.round(rand.rand((Math.round(parasiteDamage/3)),parasiteDamage)*batType.squads*batType.squadSize/60);
            if (bat.tags.includes('octiron')) {
                parasiteDeg = Math.round(parasiteDeg/10);
            }
            if (playerInfos.comp.med >= 3) {
                parasiteDeg = Math.round(parasiteDeg/2);
            }
            let totalDamage = bat.damage+parasiteDeg;
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par le parasite.');
            }
        }
        // SHINDA
        if (bat.tags.includes('shinda') && bat.squadsLeft >= 1) {
            if (batType.skills.includes('nokill') && rand.rand(1,3) === 1) {
                tagDelete(bat,'shinda');
            } else if (batType.skills.includes('resistpoison') && rand.rand(1,8) === 1) {
                tagDelete(bat,'shinda');
            } else {
                let shindaDamage = Math.round(Math.sqrt(batType.hp)*30);
                if (batType.skills.includes('reactpoison') || bat.tags.includes('reactpoison')) {
                    shindaDamage = shindaDamage*3;
                }
                if (batType.moveCost >= 90) {
                    shindaDamage = Math.ceil(shindaDamage/2);
                }
                let totalDamage = bat.damage+rand.rand((Math.round(shindaDamage/2)),Math.round(shindaDamage*1.5));
                squadHP = batType.squadSize*batType.hp;
                squadsOut = Math.floor(totalDamage/squadHP);
                bat.squadsLeft = bat.squadsLeft-squadsOut;
                bat.damage = totalDamage-(squadsOut*squadHP);
                if (bat.squadsLeft <= 0) {
                    batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par le shinda.');
                }
            }
        }
        // BLAZE
        if (bat.tags.includes('blaze') && bat.squadsLeft >= 1) {
            let blazeDamage = Math.round(rand.rand((Math.round(poisonDamage/3)),poisonDamage)*batType.squads*batType.squadSize/60);
            if (playerInfos.comp.med >= 3) {
                blazeDamage = Math.round(blazeDamage/2);
            }
            let totalDamage = bat.damage+blazeDamage;
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par la drogue.');
            }
        }
        // VENIN
        if (bat.tags.includes('venin') && !batType.skills.includes('resistpoison') && !bat.tags.includes('resistpoison') && !bat.tags.includes('octiron') && !bat.tags.includes('zombie') && bat.squadsLeft >= 1) {
            bat.apLeft = bat.apLeft-Math.floor(bat.ap/3);
            let veninDeg = Math.round(rand.rand((Math.round(venumDamage/3)),venumDamage)*batType.squads*batType.squadSize/60);
            if (playerInfos.comp.med >= 3) {
                veninDeg = Math.round(veninDeg/2);
            }
            let totalDamage = bat.damage+veninDeg;
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par le venin.');
            }
        }
        // POISON
        if (bat.tags.includes('poison') && !batType.skills.includes('resistpoison') && !bat.tags.includes('resistpoison') && !bat.tags.includes('octiron') && !bat.tags.includes('zombie') && bat.squadsLeft >= 1) {
            let allTags = _.countBy(bat.tags);
            let poisonPower = allTags.poison*poisonDamage;
            if (bat.team === 'player') {
                poisonPower = Math.round(poisonPower*batType.squads*batType.squadSize/60);
            }
            if (batType.skills.includes('reactpoison') || bat.tags.includes('reactpoison')) {
                poisonPower = poisonPower*3;
            }
            if (batType.cat === 'aliens') {
                poisonPower = Math.round(poisonPower*1.5);
            }
            if (bat.tags.includes('bliss')) {
                poisonPower = Math.round(poisonPower/1.5);
            }
            let poisonDeg = rand.rand((Math.round(poisonPower/3)),poisonPower);
            if (playerInfos.comp.med >= 3) {
                poisonDeg = Math.round(poisonDeg/2);
            }
            let totalDamage = bat.damage+poisonDeg;
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par le poison.');
            }
            let stopPoison = 10;
            if (batType.cat != 'aliens') {
                stopPoison = 18-Math.floor(playerInfos.comp.ca*1.5)-(unitResist*2);
            }
            let i = 1;
            while (i <= allTags.poison) {
                if (rand.rand(1,stopPoison) === 1) {
                    tagDelete(bat,'poison');
                    console.log('tag poison out');
                }
                if (i > 10) {break;}
                i++
            }
        }
    }
    checkDeath(bat,batType);
};

function checkDeath(bat,batType) {
    if (bat.squadsLeft <= 0) {
        let deadId = bat.id;
        let tileId = bat.tileId;
        let batType = getBatType(bat);
        if (bat.team == 'player') {
            if (!batType.skills.includes('nodeathcount')) {
                playerInfos.unitsLost = playerInfos.unitsLost+1;
                playerInfos.deadBats.push(batType.name);
                transDestroy(deadId,tileId);
                saveCrew(batType,deadId,tileId);
                playMusic('rip',false);
            }
            deadBatsList.push(bat.id);
        } else if (batType.kind == 'game') {
            deadAliensList.push(bat.id);
        } else if (bat.team == 'aliens') {
            if (bat.type.includes('Oeuf') || bat.type === 'Coque' || bat.type === 'Ruche' || bat.type === 'Cocon') {
                playerInfos.eggsKilled = playerInfos.eggsKilled+1;
                if (bat.type === 'Coque' || bat.type === 'Oeuf' || bat.type === 'Cocon') {
                    eggsNum = eggsNum-1;
                }
                if (bat.type === 'Oeuf voilé') {
                    if (playerInfos.vue >= 4) {
                        eggsNum = eggsNum-1;
                    }
                    unveilAliens(bat);
                }
            }
            playerInfos.aliensKilled = playerInfos.aliensKilled+1;
            addAlienRes(bat,false);
            deadAliensList.push(bat.id);
        }
    }
};

function tagDelete(bat,tag) {
    if (bat.tags.includes(tag)) {
        tagIndex = bat.tags.indexOf(tag);
        bat.tags.splice(tagIndex,1);
    }
};

function updateBatProperties(bat,batType) {
    if (bat.transRes === undefined && batType.transRes >= 1) {
        bat.transRes = {};
    }
    if (bat.transIds === undefined && batType.transUnits >= 1) {
        bat.transIds = [];
    }
    if (bat.logeq === undefined) {
        bat.logeq = '';
    }
    if (bat.eq === 'ranger') {
        bat.eq = 'e-ranger';
    }
    if (bat.eq === 'mecano') {
        bat.eq = 'e-mecano';
    }
    if (bat.eq === 'medic') {
        bat.eq = 'e-medic';
    }
    if (bat.eq === 'camo') {
        bat.eq = 'e-camo';
    }
    if (bat.eq === 'jetpack') {
        bat.eq = 'e-jetpack';
    }
    if (bat.eq === 'flash') {
        bat.eq = 'e-flash';
    }
    if (bat.eq === 'crimekitch') {
        bat.eq = 'trainkitch';
    }
    if (bat.eq === 'crimekitlu') {
        bat.eq = 'trainkitlu';
    }
    if (bat.eq === 'crimekitgi') {
        bat.eq = 'trainkitgi';
    }
    if (bat.eq === 'crimekitto') {
        bat.eq = 'trainkitax';
    }
};

function alienOccupiedTileList() {
    alienOccupiedTiles = [];
    aliens.forEach(function(alien) {
        if (alien.loc === "zone") {
            alienOccupiedTiles.push(alien.tileId);
        }
    });
    // console.log(alienOccupiedTiles);
};

function playerOccupiedTileList() {
    playerOccupiedTiles = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            playerOccupiedTiles.push(bat.tileId);
        }
    });
    // console.log(playerOccupiedTiles);
};

function emptyBatList() {
    batList = [];
    batUnselect();
    turnInfo();
    centerMap();
    // commandes();
    // console.log(batList);
};

function alertAllBats() {
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (!batType.skills.includes('nolist')) {
            tagDelete(bat,'nolist');
        }
    });
    createBatList();
};

function createBatList() {
    let allBatList = bataillons.slice();
    let zoneBatList = _.filter(allBatList, function(bat) {
        return (bat.loc == 'zone' && !bat.tags.includes('nolist'));
    });
    batList = _.sortBy(zoneBatList,'fuzz');
    batList.reverse();
    batList = _.sortBy(_.sortBy(_.sortBy(_.sortBy(batList,'tileId'),'type'),'sort'),'army');
    batList.reverse();
    commandes();
    // console.log(batList);
};

function nextBat(removeActiveBat,removeForever) {
    testConnect(pseudo);
    shownEggs = [];
    if (rand.rand(1,musicChance) === 1) {
        playMusic('any',false);
    }
    if (showMini) {
        unitsView();
    }
    selectMode();
    batUnstack();
    deleteMoveInfos();
    if (Object.keys(selectedBat).length >= 1) {
        let batIndex = batList.findIndex((obj => obj.id == selectedBat.id));
        if (removeActiveBat) {
            // remove bat from batList
            if (batIndex > -1) {
                batList.splice(batIndex,1);
            }
            if (removeForever && !selectedBat.tags.includes('nolist')) {
                selectedBat.tags.push('nolist');
                selectedBatArrayUpdate();
            }
        } else {
            // push the bat at the end of batList
            if (batIndex > -1) {
                batList.push(batList.splice(batIndex,1)[0]);
            }
        }
    }
    if (batList.length >= 1) {
        batSelect(batList[0]);
        showBatInfos(selectedBat);
        showTileInfos(selectedBat.tileId);
    } else {
        saveGame();
        batUnselect();
        turnInfo();
        centerMap();
    }
    // console.log(batList);
};
