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
    if (playerInfos.alienSat === coconSatLimit-1) {
        if (playerInfos.comp.det >= 3 && playerInfos.comp.ca >= 2) {
            warning('Cocon en approche','Le nombre d\'aliens en jeu est trop élevé.');
        }
    }
    if (Math.floor(playerInfos.mapTurn/25) > playerInfos.cocons) {
        if (playerInfos.comp.det >= 3 && playerInfos.comp.ca >= 1) {
            warning('Cocon en approche','La prochaine chutte d\'oeufs sera accompagnée d\'un cocon.');
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
            if ((!bat.tags.includes('invisible') && !batType.skills.includes('invisible')) || playerInfos.comp.det >= 4) {
                visibleAliens.push(bat.tileId);
            }
            if (!alienTypesList.includes(batType.name)) {
                alienTypesList.push(batType.name);
            }
            if (!bat.tags.includes('invisible')) {
                hasHide = false;
                if (batType.skills.includes('hide')) {
                    hasHide = true;
                }
                if (batType.kind === 'larve' && larveHIDE) {
                    hasHide = true;
                }
                if (hasHide && bat.salvoLeft >= 1) {
                    bat.tags.push('invisible');
                }
            }
            if (batType.skills.includes('healhide')) {
                if (bat.squadsLeft <= 3) {
                    if (!bat.tags.includes('invisible')) {
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
            if (batType.skills.includes('regmode') && bat.squadsLeft <= Math.floor(batType.squads/2)) {
                // shield stays
            } else {
                tagDelete(bat,'shield');
            }
            tagDelete(bat,'nez');
            if (rand.rand(1,3) <= 2) {
                tagDelete(bat,'stun');
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
    conselReset();
    spawnType = {};
    if (aliens.length >= 1) {
        alienTurn();
    } else {
        nextTurnEnd();
    }
};

function alienTurnEnd() {
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            let batType = getBatType(bat);
            if (batType.skills.includes('lurk') || batType.skills.includes('dive')) {
                let tile = getTile(bat);
                if (batType.skills.includes('lurk') && bat.salvoLeft >= 1) {
                    if (tile.terrain === 'F') {
                        if (!bat.tags.includes('invisible')) {
                            bat.tags.push('invisible');
                        }
                    } else {
                        if (bat.tags.includes('invisible') && !bat.tags.includes('follow')) {
                            tagDelete(bat,'invisible');
                        }
                    }
                }
                if (batType.skills.includes('dive')) {
                    if (tile.terrain === 'R' || tile.terrain === 'W' || tile.terrain === 'S' || tile.terrain === 'L') {
                        if (!bat.tags.includes('invisible')) {
                            bat.tags.push('invisible');
                        }
                    } else {
                        if (bat.tags.includes('invisible')) {
                            tagDelete(bat,'invisible');
                        }
                    }
                }
            }
        }
    });
}

function nextTurnEnd() {
    alienTurnEnd();
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
    medicalTransports = [];
    let transBat = {};
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
    let resSpace;
    let resMax;
    let resLoaded;
    let landerTileId = -1;
    let landerTileDist = 99;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (bat.squadsLeft <= 1 && batType.squads >= 3) {
                addStressFlag(bat,'fear');
            } else {
                addStressFlag(bat,'turn');
            }
            if (batType.name === 'Scraptrucks') {
                hasScraptruck = true;
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
                if (batType.name === 'Bar') {
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
            if (batType.skills.includes('leader') && !boostedTeams.includes(batType.kind)) {
                boostedTeams.push(batType.kind);
            }
            if (bat.tags.includes('prayer') && !prayedTeams.includes(batType.kind)) {
                prayedTeams.push(batType.kind);
            }
            if (!medicalTransports.includes(bat.locId) && bat.loc === "trans" && batType.skills.includes('medic')) {
                medicalTransports.push(bat.locId);
            }
            if (!medicalTransports.includes(bat.id) && batType.transUnits >= 1 && batType.skills.includes('medic')) {
                medicalTransports.push(bat.id);
            }
            if (bat.loc === "trans") {
                transBat = getBatById(bat.locId);
                bat.tileId = transBat.tileId;
                bat.oldTileId = transBat.oldTileId;
            }
            // TRANS DANS TRANS
            if (bat.loc === 'trans') {
                let motherBat = getBatById(bat.locId);
                if (motherBat.loc === 'trans') {
                    let grandMotherBat = getBatById(motherBat.locId);
                    console.log('MATRIOCHKA!');
                    console.log(bat);
                    console.log(motherBat);
                    console.log(grandMotherBat);
                    loadBat(bat.id,grandMotherBat.id,motherBat.id);
                }
            }
            updateBatProperties(bat,batType);
            if (bat.autoLoad != undefined && bat.loc === 'zone') {
                if (Array.isArray(bat.autoLoad)) {
                    bat.autoLoad.forEach(function(batId) {
                        let fromBat = getBatById(batId);
                        if (Object.keys(fromBat).length >= 1) {
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1) {
                                autoResLoad(bat,fromBat);
                            }
                        }
                    });
                }
            }
        }
    });
    unitResist = calcUnitResist();
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (bat.loc === "zone") {
                if (batType.skills.includes('upkeep') || batType.skills.includes('prodres') || batType.skills.includes('upnodis')) {
                    if (!bat.tags.includes('construction') && bat.apLeft >= 10) {
                        upkeepAndProd(bat,batType,1,false);
                    }
                }
                if (batType.skills.includes('geo') && bat.tags.includes('prodres') && bat.apLeft >= 0) {
                    geoProd(bat,batType);
                }
                if (batType.skills.includes('solar') && bat.tags.includes('prodres') && bat.apLeft >= 0) {
                    solarProd(bat,batType,1,false);
                }
                if (batType.skills.includes('transcrap') && bat.tags.includes('prodres') && bat.apLeft >= 10) {
                    triProd(bat,batType,1,false);
                }
                if (!playerInfos.onShip) {
                    if (bat.eq.includes('psol') || bat.eq.includes('psol')) {
                        solarPanel(bat,batType);
                    }
                }
            }
            // AUTOLOAD
            if (bat.autoLoad != undefined && bat.loc === 'zone') {
                if (Array.isArray(bat.autoLoad)) {
                    bat.autoLoad.forEach(function(batId) {
                        let fromBat = getBatById(batId);
                        if (Object.keys(fromBat).length >= 1) {
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1) {
                                autoResLoad(bat,fromBat);
                            }
                        }
                    });
                }
            }
            // BAR
            if (batType.cat === 'infantry' && bat.loc === "trans" && barIds.includes(bat.locId) && !bat.tags.includes('drunk')) {
                bat.tags.push('drunk');
                bat.tags.push('drunk');
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
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1) {
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
            if (boostedTeams.includes(batType.kind)) {
                ap = ap+1;
            }
            if (prayedTeams.includes(batType.kind)) {
                ap = ap+1;
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
            planetEffects(bat,batType);
            tagsEffect(bat,batType);
            tagsUpdate(bat);
            if (bat.loc === "zone") {
                blub(bat,batType);
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
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1) {
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
                            if (calcDistance(bat.tileId,fromBat.tileId) <= 1) {
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
    let numberOfEggs = 0;
    let numberOfAliens = 0;
    let realNumberOfEggs = 0;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (bat.type == 'Oeuf' || bat.type == 'Coque' || bat.type === 'Cocon') {
                let isVisible = true;
                if (zone[0].dark && !undarkNow.includes(bat.tileId)) {
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
                if (playerInfos.comp.det >= 3) {
                    numberOfEggs++;
                }
                realNumberOfEggs++;
            }
        }
    });
    eggsNum = numberOfEggs;
    aliensNum = numberOfAliens;
    let maxEggsForPause = 8+zone[0].mapDiff;
    if (realNumberOfEggs >= maxEggsForPause) {
        playerInfos.eggPause = true;
        console.log('PAUSE! 10+ eggs');
        if (playerInfos.pseudo === 'Xxxxx') {
            warning('Nouvelle pause',maxEggsForPause+' oeufs ou plus en jeu.');
        }
    }
    let fuzzTotal = 0;
    foggersTiles = [];
    zombifiersTiles = [];
    hasScraptruck = false;
    landingNoise = 0;
    playerInfos.sci = 0;
    bataillons.forEach(function(bat) {
        if (bat.type === 'Chercheurs') {
            playerInfos.sci++;
        }
        if (bat.loc === "zone") {
            let batType = getBatType(bat);
            batFuzz = calcBatFuzz(bat);
            fuzzTotal = fuzzTotal+batFuzz;
            if (bat.type === 'Fog' && bat.tags.includes('fog')) {
                foggersTiles.push(bat.tileId);
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
            if (zone[0].dark && !bat.tags.includes('camo')) {
                if (batType.skills.includes('phare') || batType.skills.includes('bigflash') || bat.eq === 'e-phare' || bat.logeq === 'e-phare') {
                    unDarkVision(bat,batType);
                }
            }
        }
    });
    console.log('landingNoise = '+landingNoise);
    playerInfos.fuzzTotal = fuzzTotal;
    let bonusDiff = Math.floor((fuzzTotal+rand.rand(0,fuzzDiv)-(fuzzDiv/2))/fuzzDiv);
    playerInfos.mapAdjDiff = zone[0].mapDiff+bonusDiff;
    if (playerInfos.mapAdjDiff < 1) {
        playerInfos.mapAdjDiff = 1;
    }
    checkZoneType();
    undarkList();
    // foggedTiles
    let distance;
    foggedTiles = [];
    zombifiedTiles = [];
    zone.forEach(function(tile) {
        foggersTiles.forEach(function(foggTile) {
            distance = calcDistance(tile.id,foggTile);
            if (distance <= fogRange) {
                foggedTiles.push(tile.id);
            }
        });
        zombifiersTiles.forEach(function(zombTile) {
            distance = calcDistance(tile.id,zombTile);
            if (distance <= zombRange) {
                zombifiedTiles.push(tile.id);
            }
        });
    });
    console.log('Zombified Tiles');
    console.log(zombifiedTiles);
    centerMap();
    if (!playerInfos.onShip) {
        $('#tour').empty().append('Tour '+playerInfos.mapTurn+'<br>');
        $('#tour').append('Attraction '+playerInfos.fuzzTotal+'<br>');
        $('#tour').append('Présence Alien <span class="or">'+zone[0].mapDiff+'</span><br>');
        if (playerInfos.bldList.includes('Champ de force')) {
            $('#tour').append('<span class="cy">Champ de force</span><br>');
        }
        $('#tour').append('Morts <span class="or">'+playerInfos.unitsLost+'</span> / '+playerInfos.aliensKilled+' / <span class="cy">'+playerInfos.eggsKilled+'</span>');
    }
    // feedZoneDB();
    // feedZoneDBwith(zone);
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
    if (boostedTeams.includes(batType.kind)) {
        newAP = newAP+1;
    }
    if (prayedTeams.includes(batType.kind)) {
        newAP = newAP+1;
    }
    return newAP;
};

function getAP(bat,batType) {
    let newAP = bat.ap;
    if (bat.eq === 'belier' || bat.eq === 'snorkel' || (bat.eq === 'chenilles' && batType.maxFlood >= 1 && batType.maxScarp >= 2) || bat.logeq === 'belier' || bat.logeq === 'snorkel' || (bat.logeq === 'chenilles' && batType.maxFlood >= 1 && batType.maxScarp >= 2)) {
        newAP = Math.round(newAP*0.9);
    }
    if (playerInfos.bldList.includes('QG')) {
        newAP = Math.floor(newAP*1.1);
    }
    if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && batType.skills.includes('fly')) {
        if (playerInfos.bldList.includes('Aérodocks')) {
            newAP = Math.round(newAP*1.15);
        }
    }
    if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && !batType.skills.includes('fly') && batType.moveCost < 90) {
        if (playerInfos.bldList.includes('Garage')) {
            newAP = newAP+1;
        }
    }
    if (bat.eq === 'g2motor' || bat.logeq === 'g2motor') {
        newAP = newAP+3;
        if (batType.moveCost >= 3) {
            newAP++;
        }
    }
    if (bat.eq === 'helper' || bat.logeq === 'helper') {
        newAP = newAP+1;
    }
    if (bat.eq === 'e-ranger' || bat.eq === 'gilet' || bat.logeq === 'e-ranger' || bat.logeq === 'gilet') {
        newAP = newAP-1;
    }
    if (playerInfos.comp.trans >= 2 && batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && batType.moveCost < 90) {
        newAP = newAP+Math.floor((batType.moveCost+1.5)*(playerInfos.comp.trans-1.25)/2.6);
    }
    if (batType.skills.includes('fastempty')) {
        emptyBonus = 0;
        if (batType.skills.includes('ravitaillement')) {
            ravitNum = calcRavit(bat);
            if (ravitNum < batType.maxSkill) {
                emptyBonus = emptyBonus+((batType.maxSkill-ravitNum)/batType.maxSkill*2.5);
            }
        }
        if (batType.skills.includes('fret')) {
            resLoaded = checkResLoad(bat);
            if (resLoaded < batType.transRes) {
                emptyBonus = emptyBonus+((batType.transRes-resLoaded)/batType.transRes*2.5);
            }
        }
        newAP = newAP+Math.round(emptyBonus);
    }
    newAP = newAP+Math.round(bat.vet*vetBonus.ap);
    return newAP;
};

function calcUnitResist() {
    let unitResist = 0;
    // LABOS
    if (playerInfos.bldList.includes('Centre de recherches')) {
        unitResist = unitResist+1;
    } else if (playerInfos.bldList.includes('Laboratoire')) {
        unitResist = unitResist+0.8;
    }
    // INFIRMERIES
    if (playerInfos.bldList.includes('Hôpital')) {
        unitResist = unitResist+1;
    } else if (playerInfos.bldList.includes('Infirmerie')) {
        unitResist = unitResist+0.8;
    }
    // ENTRAINEMENT
    if (playerInfos.bldList.includes('Salle de sport')) {
        unitResist = unitResist+0.6;
    }
    if (playerInfos.bldList.includes('Camp d\'entraînement')) {
        unitResist = unitResist+0.6;
    }
    // CANTINE
    if (playerInfos.bldList.includes('Cantine')) {
        unitResist = unitResist+0.8;
    }
    unitResist = Math.round(unitResist);
    return unitResist;
};

function tagsUpdate(bat) {
    tagDelete(bat,'chrg');
    tagDelete(bat,'vise');
    tagDelete(bat,'datt');
    if (rand.rand(1,3) > 1) {
        tagDelete(bat,'noemb');
    }
    if (bat.tags.includes('embuscade')) {
        bat.tags.push('noemb');
        bat.tags.push('noemb');
    }
    tagDelete(bat,'embuscade');
    if (rand.rand(1,5) === 1) {
        tagDelete(bat,'lasso');
    }
    tagDelete(bat,'gogogo');
    tagDelete(bat,'command');
    tagDelete(bat,'hsp');
    if (rand.rand(1,4) === 1) {
        tagDelete(bat,'rush');
    }
    tagDelete(bat,'rage');
    if (rand.rand(1,4) === 1) {
        tagDelete(bat,'norage');
    }
    tagDelete(bat,'kill');
    if (rand.rand(1,5) === 1) {
        tagDelete(bat,'nokill');
    }
    tagDelete(bat,'tornade');
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
    if (rand.rand(1,3) <= 2) {
        tagDelete(bat,'stun');
    }
    if (bat.tags.includes('drunk')) {
        if (rand.rand(1,3) === 1) {
            tagDelete(bat,'drunk');
            if (!bat.tags.includes('drunk')) {
                warning('Burp...',bat.type+' a la gueule de bois.',false,bat.tileId);
            }
        }
    }
    if (bat.tags.includes('octiron')) {
        if (rand.rand(1,4) === 1) {
            tagIndex = bat.tags.indexOf('octiron');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('octiron')) {
                drugDown(bat,false,false);
            }
        }
    }
    if (bat.tags.includes('kirin')) {
        if (rand.rand(1,5) === 1) {
            tagIndex = bat.tags.indexOf('kirin');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('kirin')) {
                drugDown(bat,true,false);
            }
        }
    }
    if (bat.tags.includes('sila')) {
        if (rand.rand(1,5) === 1) {
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
        if (rand.rand(1,5) === 1) {
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
        tagIndex = bat.tags.indexOf('starka');
        bat.tags.splice(tagIndex,1);
        if (!bat.tags.includes('starka')) {
            drugDown(bat,false,false);
        }
    }
    if (bat.tags.includes('nitro')) {
        tagIndex = bat.tags.indexOf('nitro');
        bat.tags.splice(tagIndex,1);
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
    if (addict) {
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
                if (bat.eq != 'waterproof' && bat.logeq != 'waterproof') {
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
        if (batType.skills.includes('ranger') || bat.eq === 'e-ranger' || bat.logeq === 'e-ranger') {
            bat.apLeft = 0-Math.round(bat.ap*2/3)+rand.rand(0,bat.ap);
        } else {
            bat.apLeft = 0-bat.ap;
        }
    }
    // BLAZE DRUG
    if (bat.tags.includes('blaze')) {
        bat.apLeft = bat.apLeft+3;
        bat.salvoLeft = bat.salvoLeft+1;
    }
    // OCTIRON DRUG
    if (bat.tags.includes('octiron')) {
        bat.apLeft = bat.apLeft+4;
    }
    // BLISS DRUG
    if (bat.tags.includes('bliss')) {
        bat.apLeft = bat.apLeft-2;
    }
    // UNITRESIST
    let resistance = false;
    if (rand.rand(1,16) <= unitResist && bat.cat === 'infantry') {
        resistance = true;
    }
    // REGENERATION & KIRIN DRUG
    if (bat.tags.includes('kirin') || bat.tags.includes('slowreg') || bat.eq === 'permakirin' || bat.logeq === 'permakirin' || bat.tags.includes('regeneration') || batType.skills.includes('regeneration') || batType.skills.includes('slowreg') || batType.skills.includes('fastreg') || batType.skills.includes('heal') || resistance) {
        let regOK = true;
        if (batType.cat === 'aliens') {
            if (batType.skills.includes('reactpoison') && bat.tags.includes('poison')) {
                regOK = false;
            }
            if (batType.skills.includes('reactpoison') && bat.tags.includes('shinda')) {
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
            } else if (bat.tags.includes('kirin') || batType.skills.includes('regeneration') || bat.tags.includes('regeneration')) {
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
    if (bat.tags.includes('maladie')) {
        if (bat.tags.includes('skupiac') || bat.tags.includes('octiron') || bat.tags.includes('zombie')) {
            tagDelete(bat,'maladie');
        } else {
            if (rand.rand(1,18) <= unitResist && bat.cat != 'aliens') {
                tagDelete(bat,'maladie');
                warning('',bat.type+' a vaincu la maladie.',false,bat.tileId);
            } else {
                bat.apLeft = bat.apLeft-Math.floor(bat.ap/2.2);
                if (bat.squadsLeft < batType.squads || bat.damage >= 1) {
                    if (rand.rand(1,36) <= (4-unitResist) && bat.cat != 'aliens') {
                        bat.tags.push('poison');
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
            if (rand.rand(1,2) === 1) {
                tagDelete(bat,'necro');
            }
        } else {
            if (rand.rand(1,16) <= unitResist) {
                tagDelete(bat,'necro');
                if (!bat.tags.includes('necro')) {
                    warning('',bat.type+' a éliminé la nécrotoxine.',false,bat.tileId);
                }
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
        if (bat.tags.includes('parasite')) {
            let parasiteDamage = Math.round(rand.rand((Math.round(parasiteDamage/3)),parasiteDamage)*batType.squads*batType.squadSize/60);
            if (bat.tags.includes('octiron')) {
                parasiteDamage = Math.round(parasiteDamage/10);
            }
            if (playerInfos.comp.med >= 3) {
                parasiteDamage = Math.round(parasiteDamage/2);
            }
            let totalDamage = bat.damage+parasiteDamage;
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par le parasite.');
            }
        }
        // SHINDA
        if (bat.tags.includes('shinda')) {
            let shindaDamage = Math.round(Math.sqrt(batType.hp)*14);
            if (batType.skills.includes('reactpoison') || bat.tags.includes('reactpoison')) {
                shindaDamage = shindaDamage*3;
            }
            let totalDamage = bat.damage+rand.rand((Math.round(shindaDamage/2)),Math.round(shindaDamage*1.5));
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par la toxine.');
            }
        }
        // BLAZE
        if (bat.tags.includes('blaze')) {
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
        if (bat.tags.includes('venin') && !batType.skills.includes('resistpoison') && !bat.tags.includes('resistpoison') && !bat.tags.includes('octiron') && !bat.tags.includes('zombie')) {
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
        if (bat.tags.includes('poison') && !batType.skills.includes('resistpoison') && !bat.tags.includes('resistpoison') && !bat.tags.includes('octiron') && !bat.tags.includes('zombie')) {
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
                transDestroy(deadId,tileId);
                saveCrew(batType,deadId,tileId);
                playMusic('rip',false);
            }
            deadBatsList.push(bat.id);
        } else if (bat.team == 'aliens') {
            if (bat.type.includes('Oeuf') || bat.type === 'Coque' || bat.type === 'Ruche' || bat.type === 'Cocon') {
                playerInfos.eggsKilled = playerInfos.eggsKilled+1;
                if (bat.type === 'Coque' || bat.type === 'Oeuf' || bat.type === 'Cocon') {
                    eggsNum = eggsNum-1;
                }
                if (bat.type === 'Oeuf voilé') {
                    if (playerInfos.comp.det >= 3) {
                        eggsNum = eggsNum-1;
                    }
                    unveilAliens(bat);
                }
            }
            playerInfos.aliensKilled = playerInfos.aliensKilled+1;
            addAlienRes(bat);
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
    }
    // console.log(batList);
};
