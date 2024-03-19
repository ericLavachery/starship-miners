function nextTurn() {
    testConnect(pseudo);
    // playMusic('any',false);
    saveGame();
    checkUndark();
    nextWarn = 1;
    console.log('NOUVEAU TOUR');
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    // stopMe = true;
    blockMe(true);
    $('#warnings').empty();
    $('#warnings').append('<i class="far fa-hand-paper washTop" onclick="washReports(true)" title="Supprimer toutes les alertes"></i> &nbsp; <h4>Messages</h4><br>');
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
    } else if (playerInfos.mapTurn === 1) {
        missionStartAdj(zone[0].number);
    } else if (aliens.length <= 75 && !isStartZone) {
        let gibDice = Math.ceil((aliens.length+15)/14);
        if (rand.rand(1,gibDice) === 1) {
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
    let hasSky = false;
    if (zone[0].number >= 70 && zone[0].number <= 74) {
        if (hasAlien('Skygrub')) {
            hasSky = true;
        }
    }
    alienThreat = 0;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            alienThreat = alienThreat+Math.sqrt(batType.killXP);
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
                if (batType.skills.includes('skyhide') && hasSky) {
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
                if (bat.squadsLeft <= 3 && !bat.tags.includes('fluo')) {
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
            if (bat.tags.includes('chop')) {
                tagDelete(bat,'chop');
                bat.apLeft = bat.apLeft+2;
            }
            if (bat.tags.includes('chop')) {
                tagDelete(bat,'chop');
                bat.apLeft = bat.apLeft+2;
            }
            if (bat.tags.includes('chop')) {
                tagDelete(bat,'chop');
                bat.apLeft = bat.apLeft+2;
            }
            if (bat.apLeft > bat.ap) {
                bat.apLeft = bat.ap;
            }
            if (spiderMV) {
                if (batType.kind === 'spider') {
                    if (batType.class === 'C' || batType.class === 'Z') {
                        let sbonus = Math.ceil((batType.moveCost*batType.moveCost)/2);
                        bat.apLeft = bat.apLeft+sbonus;
                    }
                }
            }
            bat.oldTileId = bat.tileId;
            bat.oldapLeft = bat.apLeft;
            tagsEffect(bat,batType);
            if (bat.tags.includes('guide')) {
                if (batType.skills.includes('shortlaser') || batType.skills.includes('nolaser')) {
                    tagDelete(bat,'guide');
                }
            }
            if (bat.tags.includes('fluo')) {
                if (batType.skills.includes('shortlaser') || batType.skills.includes('nolaser')) {
                    tagDelete(bat,'fluo');
                }
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
            let freezeResistance = 3;
            if (batType.cat === 'aliens') {
                if (batType.class === 'C') {
                    freezeResistance = 4;
                } else if (batType.class === 'A' || batType.class === 'S') {
                    freezeResistance = 2;
                } else if (batType.class === 'X') {
                    freezeResistance = 1;
                }
            } else {
                freezeResistance = 1;
            }
            if (rand.rand(1,freezeResistance) === 1) {
                tagDelete(bat,'freeze');
            }
            if (playerInfos.mapTurn > bat.creaTurn+7 && bat.type != 'Oeuf voilé' && !batType.skills.includes('hide') && !batType.skills.includes('skyhide') && !batType.skills.includes('healhide') && !larveHIDE) {
                tagDelete(bat,'invisible');
            }
            if (playerInfos.mapTurn > bat.creaTurn+2 && bat.type != 'Oeuf voilé' && !batType.skills.includes('hide') && !batType.skills.includes('skyhide') && !batType.skills.includes('healhide') && !larveHIDE && bat.tags.includes('follow')) {
                tagDelete(bat,'invisible');
            }
            if (batType.kind === 'game') {
                if (playerInfos.mapTurn > bat.creaTurn+1) {
                    tagDelete(bat,'invisible');
                }
                if (aliens.length >= 100 && rand.rand(1,2) === 1) {
                    bat.squadsLeft = 0;
                    checkDeath(bat,batType,false);
                }
                let tile = getTile(bat);
                if (bat.squadsLeft < batType.squads) {
                    if (tile.x === 1 || tile.x === 60 || tile.y === 1 || tile.y === 60) {
                        bat.squadsLeft = 0;
                        checkDeath(bat,batType,false);
                    }
                }
            }
            if (bat.tags.includes('heard')) {
                if (bat.pdm != undefined) {
                    let pdmDistance = calcDistance(bat.pdm,bat.tileId);
                    if (pdmDistance <= 2) {
                        tagDelete(bat,'heard');
                        delete bat.pdm;
                    }
                } else {
                    tagDelete(bat,'heard');
                }
            }
        }
    });
    alienThreat = Math.round(alienThreat);
    killAlienList();
    checkEggsDrop();
    // testDrop();
    webSpawns(false);
    ectoSpawns();
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
    let aFouille = true;
    if (playerInfos.mapTurn < 15) {
        aFouille = false;
    }
    if (aFouille) {
        if (zone[0].edited != undefined) {
            if (zone[0].edited) {
                aFouille = false;
            }
        }
    }
    if (aFouille) {
        if (rand.rand(1,3) != 1) {
            aFouille = false;
        }
    }
    let fRuinTileId = -1;
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
                if (batType.skills.includes('lurk') && bat.salvoLeft >= 1) {
                    hideTerrains.push('F');
                }
                if (batType.skills.includes('dive')) {
                    hideTerrains.push('R');
                    hideTerrains.push('L');
                    hideTerrains.push('W');
                    hideTerrains.push('S');
                }
                if (batType.skills.includes('creep') && bat.salvoLeft >= 1) {
                    hideTerrains.push('F');
                    hideTerrains.push('B');
                    hideTerrains.push('M');
                    hideTerrains.push('S');
                }
                if (hideTerrains.includes(tile.terrain) && !bat.tags.includes('fluo')) {
                    if (!bat.tags.includes('invisible')) {
                        bat.tags.push('invisible');
                    }
                } else {
                    if (bat.tags.includes('invisible') && !bat.tags.includes('follow')) {
                        tagDelete(bat,'invisible');
                    }
                }
            }
            if (bat.tags.includes('fluo')) {
                tagDelete(bat,'invisible');
            }
            if (aFouille) {
                if (fRuinTileId < 0) {
                    let tile = getTile(bat);
                    if (tile.ruins && tile.sh >= 1) {
                        fRuinTileId = tile.id;
                    }
                }
            }
        }
    });
    killAlienList();
    if (fRuinTileId >= 0 && aFouille) {
        searchRuins(0,fRuinTileId);
    }
};

function nextTurnEnd() {
    alienTurnEnd();
    ectoControl();
    alienCanon();
    checkMissionAlert(false,false);
    checkCitCaves();
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
            if (batType.skills.includes('stock')) {
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
            if (isOpLander(bat,batType) || batType.skills.includes('reserve')) {
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
                    if (hasEquip(theTrans,['e-medic'])) {
                        medicalTransports.push(bat.locId);
                    }
                }
            }
            if (!medicalTransports.includes(bat.id) && batType.transUnits >= 1 && batType.skills.includes('medtrans')) {
                medicalTransports.push(bat.id);
            }
            updateBatProperties(bat,batType);
            if (bat.autoLoad != undefined && (bat.loc === 'zone' || batType.skills.includes('trailer'))) {
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
                    if (!bat.tags.includes('construction') && bat.apLeft >= 8) {
                        upkeepAndProd(bat,batType,1,false,false);
                    }
                }
                if (batType.cat === 'buildings' && batType.crew >= 1 && bat.apLeft >= 8 && batType.skills.includes('fret')) {
                    bldScraping(bat,batType);
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
                    if (hasEquip(bat,['psol','psol2'])) {
                        solarPanel(bat,batType);
                    }
                }
            }
            // AUTORAVIT
            if (batType.skills.includes('autoapprov') && bat.tags.includes('sU') && bat.apLeft >= Math.round(batType.ap/3*2)) {
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
            if (bat.autoLoad != undefined && (bat.loc === 'zone' || batType.skills.includes('trailer'))) {
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
                if (mayXP(bat,batType)) {
                    if (bat.loc === "trans" && campIds.includes(bat.locId)) {
                        bat.xp = bat.xp+1;
                    } else {
                        if (rand.rand(1,100) <= 33) {
                            bat.xp = bat.xp+1;
                        }
                    }
                }
                // if (!batType.skills.includes('robot') || hasEquip(bat,['g2ai'])) {
                // }
            }
            deFog(bat,batType);
            bat.apLeft = Math.ceil(bat.apLeft);
            if (bat.apLeft < 0-(bat.ap*2) && batType.cat != 'buildings' && batType.cat != 'devices' && !bat.tags.includes('construction')) {
                bat.apLeft = 0-(bat.ap*2);
            }
            // nolist
            if (bat.loc === "zone" && bat.tags.includes('nolist') && !batType.skills.includes('neverlist')) {
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
    stormSoundDone = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('extraction')) {
                mining(bat);
            }
            if (batType.skills.includes('unload')) {
                // console.log('AUTO-UNLOAD'+bat.type);
                autoUnload(bat);
            }
            if (bat.autoLoad != undefined && (bat.loc === 'zone' || batType.skills.includes('trailer'))) {
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
            // nostun
            if (batType.skills.includes('nostun') && bat.apLeft < 1) {
                bat.apLeft = 1;
            }
            if (landerTileId >= 0) {
                if (mayXP(bat,batType)) {
                    let distFromLander = calcDistance(bat.tileId,landerTileId);
                    if (distFromLander >= 17) {
                        bat.xp = bat.xp+0.3;
                        let parcours = calcDistance(bat.tileId,bat.oldTileId);
                        if (parcours > 2) {
                            bat.xp = bat.xp+0.3;
                        }
                    }
                    if (distFromLander >= 13) {
                        getHuntingRes(bat,batType);
                    }
                }
                // if (!batType.skills.includes('robot') || hasEquip(bat,['g2ai'])) {
                // }
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
            if (batType.cat === 'vehicles' || batType.cat === 'buildings' || batType.cat === 'devices') {
                if (bat.soins != undefined) {
                    if (bat.soins >= 11) {
                        bat.apLeft = bat.apLeft-checkVehiclesAPSoins(bat,batType);
                    }
                }
            }
            bat.oldTileId = bat.tileId;
            bat.oldapLeft = bat.apLeft;
            bat.fuzz = getBatFuzz(bat,batType);
            planetEffects(bat,batType);
            tagsEffect(bat,batType);
            tagsUpdate(bat,batType);
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
                bat.xp = levelXP[1];
            }
            bat.apLeft = bat.apLeft.toFixedNumber(1);
            // nolist
            if (batType.skills.includes('nolist') && !bat.tags.includes('nolist')) {
                bat.tags.push('nolist');
            }
            // fin champ de force
            if (bat.type === 'Champ de force') {
                if (playerInfos.mapTurn >= bat.creaTurn+25) {
                    batDeathEffect(bat,true,false,'Bataillon détruit',bat.type+' expiré.');
                    bat.squadsLeft = 0;
                    checkDeath(bat,batType,false);
                }
            }
            // fin coffres
            if (batType.name === 'Coffres' && bat.tags.includes('go')) {
                resSpace = checkResSpace(bat);
                resMax = batType.transRes;
                if (resSpace >= resMax) {
                    batDeathEffect(bat,true,false,'Bataillon détruit',bat.type+' expirés.');
                    bat.squadsLeft = 0;
                    checkDeath(bat,batType,false);
                }
            }
            // fin sous-munitions
            if (batType.name === 'Sous-munitions' && playerInfos.mapTurn > bat.creaTurn+1) {
                batDeathEffect(bat,true,false,'Bataillon détruit',bat.type+' expirées.');
                bat.squadsLeft = 0;
                checkDeath(bat,batType,false);
            }
            // FOG
            if (bat.tags.includes('fog') && bat.loc === 'zone') {
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
        if (bat.loc === "zone" || bat.type === 'Remorques') {
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
        if (bat.loc === "zone" || bat.type === 'Remorques') {
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
    morphBatList();
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
    // playMusic('any',false);
    nextTurnOK = false;
    commandes();
    // testConnect(pseudo);
};

function turnInfo(first) {
    console.log('TURN INFO');
    isPlayerAdmin();
    if (zone[0].number >= 90) {
        isStartZone = true;
    }
    numLaserSat = hasHowMany(bataillons,'eq','lasersat');
    numLaserSat = entre(numLaserSat,0,1);
    let satROF = playerInfos.comp.vsp-rand.rand(1,2);
    satROF = entre(satROF,1,2);
    numLaserSat = numLaserSat*satROF;
    planetThumb();
    checkNeiTurn();
    let citLoss = getCitLoss();
    playerInfos.vue = playerInfos.comp.det;
    if (playerInfos.bldList.includes('Centre de com')) {
        playerInfos.vue = playerInfos.vue+1;
    } else if (!playerInfos.bldVM.includes('Centre de com')) {
        playerInfos.vue = playerInfos.vue-1;
    }
    if (!playerInfos.bldList.includes('Centre de com')) {
        if (!playerInfos.bldList.includes('Station radio')) {
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
    if (isLarveHide) {
        if (playerInfos.vue > 4) {
            playerInfos.vue = 4;
        }
    }
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
                        if (batType.kind === 'larve' && !batType.skills.includes('dive') && !batType.skills.includes('hide') && !batType.skills.includes('skyhide') && (!bat.tags.includes('follow') || playerInfos.mapTurn > bat.creaTurn+2)) {
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
    if (realNumberOfEggs >= maxEggsForPause && !coconStats.dome && zone[0].number < 50) {
        playerInfos.eggPause = true;
        console.log('PAUSE! 10+ eggs');
        if (isAdmin.deep) {
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
    let piloneTileIds = [];
    let controlRange = 3;
    if (playerInfos.bldList.includes('Centre de com')) {
        controlRange = 12;
    } else if (playerInfos.bldList.includes('Station radio')) {
        controlRange = 6;
    }
    hasScraptruck = false;
    landingNoise = 0;
    playerInfos.sci = 0;
    let nPil = 0;
    let nDom = 0;
    domeProtect = false;
    hasOwnLander = false;
    let uncontrolledBats = false;
    let uncontrolledResBast = false;
    uniRes = false;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.name === 'Bastion de résistants') {
            if (bat.tags.includes('nomove')) {
                uncontrolledResBast = true;
            }
        }
        if (playerInfos.mapTurn === 1 && playerInfos.pseudo != 'Mapedit') {
            if (bat.tags.includes('nomove')) {
                uncontrolledBats = true;
            }
        }
        if (bat.army === 0) {
            if (!bat.tags.includes('nomove')) {
                if (isStartZone) {
                    bat.army = 21;
                } else if (batType.skills.includes('iscit')) {
                    bat.army = 21;
                }
            }
        }
        bat.fuzz = getBatFuzz(bat,batType);
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
            batFuzz = calcBatAttraction(bat);
            fuzzTotal = fuzzTotal+batFuzz;
            if (batType.skills.includes('fog') && bat.tags.includes('fog')) {
                foggersTiles.push(bat.tileId);
            }
            if (hasSnif(bat,batType)) {
                dogTiles.push(bat.tileId);
            }
            if (batType.skills.includes('radar') || hasEquip(bat,['e-radar'])) {
                radarTiles.push(bat.tileId);
            }
            if (bat.eq === 'e-control' || bat.logeq === 'e-control' || batType.skills.includes('control')) {
                roboControlers.push(bat.tileId);
            }
            if (bat.type === 'Necrotrucks') {
                zombifiersTiles.push(bat.tileId);
            }
            if (batType.skills.includes('pilone') && !bat.tags.includes('construction')) {
                piloneTileIds.push(bat.tileId);
            }
            if (bat.type === 'Scraptrucks') {
                hasScraptruck = true;
            }
            if (isOpLander(bat,batType)) {
                if (noEquip(bat,['siland'])) {
                    landingNoise = landingNoise+Math.floor(batType.hp/75/landerHPTuning*batType.fuzz*batType.fuzz/25)+2;
                }
                if (playerInfos.onShip || !bat.tags.includes('nomove')) {
                    hasOwnLander = true;
                }
            }
            if (zone[0].dark) {
                if (batType.skills.includes('phare') || batType.skills.includes('bigflash') || batType.skills.includes('radar') || hasEquip(bat,['e-phare','e-radar'])) {
                    unDarkVision(bat,batType);
                }
            }
        }
    });
    if (nDom >= 1 && nPil >= 4) {
        domeProtect = true;
        let domeBat = getBatByName('Dôme');
        if (domeBat.opTurn != undefined) {
            if (domeBat.opTurn <= 0) {
                domeBat.opTurn = playerInfos.mapTurn;
            }
        } else {
            domeBat.opTurn = playerInfos.mapTurn;
        }
    }
    if (!zone[0].neverMove && uncontrolledResBast) {
        uniRes = true;
    }
    if (uncontrolledBats) {
        warning('Bataillons non contrôlés','Il y a des bataillons d\'autres groupes dans la zone.<br>Vous pouvez en prendre contrôle en les rejoignant avec un de vos propres bataillons.<br>Cela ne fonctionne pas avec un bataillon non combatant (Citoyens, Survivants, Infirmiers etc...), ni avec un bataillon sans humains (Wardogs, Droïdes etc...), ni avec un bataillon en perdition (trop blessé et/ou faible compétence de leadership).');
        playSound('clic16',-0.2);
    }
    console.log('landingNoise = '+landingNoise);
    playerInfos.fuzzTotal = Math.round(fuzzTotal);
    let bonusDiff = Math.floor((fuzzTotal+rand.rand(0,fuzzDiv)-(fuzzDiv/2))/fuzzDiv);
    playerInfos.mapAdjDiff = zone[0].mapDiff+bonusDiff;
    if (playerInfos.mapAdjDiff < 1) {
        playerInfos.mapAdjDiff = 1;
    }
    checkZoneType();
    undarkList();
    checkUndark();
    setCoconStats();
    checkCoconBonus();
    unitResist = calcUnitResist();
    // foggedTiles
    let distance;
    let radarDistance = 3+playerInfos.comp.det;
    foggedTiles = [];
    doggedTiles = [];
    zombifiedTiles = [];
    pilonedTiles = [];
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
        piloneTileIds.forEach(function(pilTile) {
            if (!pilonedTiles.includes(tile.id)) {
                distance = calcDistance(tile.id,pilTile);
                if (distance <= piloRange) {
                    pilonedTiles.push(tile.id);
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
    // console.log('Foggers Tiles');
    // console.log(foggersTiles);
    console.log('Fogged Tiles');
    console.log(foggedTiles);
    console.log('Piloned Tiles');
    console.log(pilonedTiles);
    centerMap();
    if (!playerInfos.onShip) {
        let briefing = "Récupérez un maximum de ressources et de survivants";
        if (zone[0].body != undefined) {
            briefing = zone[0].title+' : '+zone[0].body;
        }
        $('#tour').empty().append('<span class="klik" title="'+briefing+'">Zone '+zone[0].number+'</span> / ');
        $('#tour').append('Tour '+playerInfos.mapTurn+'<br>');
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
        // vue
        $('#tour').append('<span class="neutre">Détection: '+playerInfos.vue+'</span><br>');
        if (playerInfos.vue >= 3) {
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
            let maxDroppedEggs = playerInfos.maxEggDrop;
            let maxEggsInPlay = checkMaxEggsInPlay();
            // dropchance
            let dropChance = getDropChance(playerInfos.mapTurn,maxDroppedEggs);
            // pause
            if (!domeProtect) {
                if (playerInfos.droppedEggs < maxDroppedEggs+1 && realNumberOfEggs < maxEggsInPlay && dropChance >= 10 && !playerInfos.eggPause) {
                    if (allCoconTurns[playerInfos.cocons] <= playerInfos.mapTurn || playerInfos.alienSat >= coconSatLimit-1) {
                        $('#tour').append('<span class="wblynk" title="Oeuf(s) en approche">Oeufs en approche</span><br>');
                    } else {
                        $('#tour').append('<span class="wblynk" title="Oeuf(s) en approche">Oeufs en approche</span><br>');
                    }
                } else {
                    $('#tour').append('<span class="neutre" title="Aucun oeuf en approche">Aucun oeuf en vue</span><br>');
                    turnCol = 'neutre';
                }
                if (playerInfos.vue >= 4 && playerInfos.comp.ca >= 2 && allCoconTurns[playerInfos.cocons]-10 <= playerInfos.mapTurn) {
                    let approxTurn = Math.round(allCoconTurns[playerInfos.cocons]/5)*5;
                    if (approxTurn <= playerInfos.mapTurn) {
                        $('#tour').append('<span class="'+turnCol+'" title="Cocon prévu d\'un tour à l\'autre">Cocon imminent</span><br>');
                    } else {
                        $('#tour').append('<span class="'+turnCol+'" title="Cocon prévu aux alentours du tour '+approxTurn+'">Cocon en approche</span><br>');
                    }
                }
            }
        }
        // CONVOI DE SURVIVANTS
        if (playerInfos.vz < 90) {
            let convApprox = 13-(playerInfos.vue*2);
            let turnApprox = Math.round(playerInfos.vz/convApprox)*convApprox;
            let badConvApprox = 5;
            if (convApprox >= 5) {badConvApprox = 10;}
            let badTurnApprox = Math.round(playerInfos.vz/badConvApprox)*badConvApprox;
            let turnsTillConv = turnApprox-playerInfos.mapTurn;
            let firstAlertTurn = 12-Math.floor(playerInfos.pauseSeed/3);
            let lastAlertTurn = playerInfos.vz-4-Math.floor(playerInfos.pauseSeed/3);
            if (playerInfos.vue >= 3) {
                if (playerInfos.mapTurn === firstAlertTurn) {
                    warning('<span class="rq3">Survivants</span>','<span class="vio">Notre centre de communication à détecté un convoi de survivants.</span>');
                }
            }
            if (playerInfos.vue >= 2) {
                if (playerInfos.mapTurn >= firstAlertTurn) {
                    if (turnsTillConv >= 15) {
                        // plus de 15 tours
                        if (playerInfos.vue >= 3) {
                            if (playerInfos.vue >= 4) {
                                $('#tour').append('<span class="neutre" title="Convoi de survivants en approche (vers le tour '+badTurnApprox+')">Survivants</span><br>');
                            } else {
                                $('#tour').append('<span class="neutre" title="Convoi de survivants en approche (plus de 15 tours)">Survivants</span><br>');
                            }
                        }
                    } else {
                        // moins de 15 tours
                        if (playerInfos.vue >= 6) {
                            $('#tour').append('<span class="wblynk" title="Convoi de survivants en approche (tour '+playerInfos.vz+') ('+playerInfos.vc+')">Survivants</span><br>');
                        } else if (playerInfos.vue >= 4) {
                            $('#tour').append('<span class="wblynk" title="Convoi de survivants en approche (vers le tour '+turnApprox+') ('+playerInfos.vc+')">Survivants</span><br>');
                        } else {
                            $('#tour').append('<span class="wblynk" title="Convoi de survivants en approche (vers le tour '+turnApprox+')">Survivants</span><br>');
                        }
                        if (lastAlertTurn === playerInfos.mapTurn) {
                            warning('<span class="rq3">Convoi en approche</span>','<span class="vio">Attirés par le bruit, des survivants sont en route vers votre Lander.</span>');
                        }
                    }
                }
            }
        }
        $('#tour').append('Morts <span class="or" title="'+toNiceString(playerInfos.deadBats)+'">'+playerInfos.unitsLost+'</span> / <span class="neutre" title="Aliens tués">'+playerInfos.aliensKilled+'</span> / <span class="cy" title="Oeufs détruits">'+playerInfos.eggsKilled+'</span>');
    }
    checkVMTileIds();
    if (domeProtect && aliens.length <= 0 && hasUnit('Dôme',true)) {
        gameOver = true;
        playRoom('start',true,false);
        calcEndRes(false);
        let score = calcScore();
        warning('<span class="rq3">Colonie établie!</span>','<span class="vio">Promis, on mettra un truc plus sympa pour la fin du jeu.<br>Vous avez sauvé <span class="cy">'+score.cits+' citoyens</span> en '+score.days+' jours.<br>Votre score est de <span class="cy">'+score.score+'</span></span>');
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
                        warning('Apocalypse','Il se passe un truc bizare avec les ruches. Nos experts manquent de moyen pour enquêter.');
                    }
                }
            }
        }
    }
    if (first) {
        createBatList();
    }
    // feedZoneDB();
    // feedZoneDBwith(zone);
};

function checkLastStand() {
    let lastStand = {};
    lastStand.turn = 100+Math.round(playerInfos.pauseSeed/3);
    lastStand.go = false;
    let lastMission = hasUnit('Dôme',false);
    if (domeProtect) {
        if (lastMission) {
            let domeBat = getBatByName('Dôme');
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
    if (hasEquip(bat,['belier'])) {
        newAP = newAP*0.9;
    }
    if (playerInfos.bldList.includes('QG') && !batType.skills.includes('artank')) {
        newAP = newAP*1.05;
    }
    if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && !batType.skills.includes('artank') && batType.skills.includes('fly')) {
        if (playerInfos.bldList.includes('Aérodocks')) {
            newAP = newAP*1.15;
        }
    }
    if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && !batType.skills.includes('artank') && !batType.skills.includes('fly') && batType.moveCost < 90) {
        if (playerInfos.bldList.includes('Garage')) {
            newAP = newAP+1;
        }
    }
    if (hasEquip(bat,['g2motor'])) {
        if (batType.skills.includes('robot') && !batType.skills.includes('crange')) {
            newAP = newAP+(Math.sqrt(batType.moveCost)*4);
        } else if (!batType.skills.includes('artank')) {
            newAP = newAP+(Math.sqrt(batType.moveCost)*2.65);
        } else {
            newAP = newAP+(Math.sqrt(batType.moveCost)*1.5);
        }
    }
    if (batType.skills.includes('heroap') && bat.tags.includes('hero')) {
        newAP = newAP+2;
    }
    if (bat.tags.includes('zombie')) {
        newAP = newAP-2;
    }
    if (hasEquip(bat,['helper'])) {
        newAP = newAP+1;
    }
    if (bat.eq === 'e-lifepod') {
        newAP = newAP-1;
    }
    if (playerInfos.comp.trans >= 2 && batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && !batType.skills.includes('artank') && batType.moveCost < 90) {
        newAP = newAP+((batType.moveCost+1.5)*(playerInfos.comp.trans-1.25)/2.6);
    }
    newAP = Math.round(newAP);
    newAP = newAP+Math.round(bat.vet*vetBonus.ap);
    if (batType.skills.includes('domeconst')) {
        newAP = bat.ap;
    }
    return newAP;
};

function calcUnitResist() {
    // min 1 / début 2 / fin 3 / max 5
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
        unitResist = 0;
    }
    return unitResist;
};

function tagsUpdate(bat,batType) {
    let batEmo = 0;
    if (bat.emo != undefined) {
        batEmo = bat.emo;
    }
    // vomiTrans
    if (bat.tags.includes('vomi')) {
        let turnChance = 1;
        let medChance = playerInfos.comp.med+1;
        let genChance = playerInfos.comp.gen+1;
        if (medChance > genChance) {
            turnChance = medChance;
        } else {
            turnChance = genChance;
        }
        if (rand.rand(1,turnChance) === 1) {
            tagDelete(bat,'vomi');
        }
        if (!bat.tags.includes('vomi')) {
            bat.tags.push('vomissure');
            warning('<span class="rq3">Attaque génétique</span>','<span class="vio">'+bat.type+' sont sur le point de se transformer.<br>Ils doivent aller à l\'hôpital ou prendre du Skupiac!</span>',false,bat.tileId);
        } else {
            warning('Attaque génétique',bat.type+' vont bientôt se transformer.<br>Ils doivent aller à l\'hôpital ou prendre du Skupiac!',false,bat.tileId);
        }
    }
    if (bat.tags.includes('sbk')) {
        tagDelete(bat,'sbk');
        tagDelete(bat,'sila');
    }
    tagDelete(bat,'podcd');
    tagDelete(bat,'deb');
    tagDelete(bat,'chrg');
    tagDelete(bat,'vise');
    tagDelete(bat,'more');
    tagDelete(bat,'datt');
    // tagDelete(bat,'autoroad');
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
    if (batType.skills.includes('rage')) {
        tagDelete(bat,'norage');
    } else {
        if (rand.rand(1,2) === 1) {
            tagDelete(bat,'norage');
        }
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
                drugDown(bat,true,30);
            }
        }
    }
    if (bat.tags.includes('octiron')) {
        let demiVie = 5;
        if (batType.skills.includes('dog') && batEmo < 11) {
            demiVie = 15;
        }
        if (rand.rand(1,demiVie) === 1) {
            tagIndex = bat.tags.indexOf('octiron');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('octiron')) {
                drugDown(bat,false,99);
                if (batEmo >= 11 && playerInfos.comp.ordre >= 2) {
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
                drugDown(bat,false,99);
            }
        }
    }
    if (bat.tags.includes('sila')) {
        if (rand.rand(1,4) === 1) {
            tagIndex = bat.tags.indexOf('sila');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('sila')) {
                drugDown(bat,true,10);
            }
        }
    }
    if (bat.tags.includes('bliss')) {
        if (rand.rand(1,5) === 1) {
            tagIndex = bat.tags.indexOf('bliss');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('bliss')) {
                drugDown(bat,false,5);
                if (batEmo >= 11 && playerInfos.comp.ordre >= 2) {
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
                drugDown(bat,true,3);
            }
        }
    }
    if (bat.tags.includes('skupiac')) {
        if (rand.rand(1,5) === 1) {
            tagIndex = bat.tags.indexOf('skupiac');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('skupiac')) {
                drugDown(bat,true,8);
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
            drugDown(bat,false,15);
        }
    }
    if (bat.tags.includes('nitro')) {
        tagIndex = bat.tags.indexOf('nitro');
        bat.tags.splice(tagIndex,1);
        if (!bat.tags.includes('nitro')) {
            boostDown(bat,8);
        }
    }
};

function drugDown(bat,fatigue,addict) {
    if (fatigue) {
        if (bat.apLeft > 3) {
            bat.apLeft = 3;
        }
    }
    if (addict < 90) {
        if (rand.rand(1,addict) === 1) {
            if (bat.emo != undefined) {
                bat.emo = bat.emo+1;
            } else {
                bat.emo = 1;
            }
        }
    }
};

function boostDown(bat,addict) {
    if (addict < 90) {
        if (rand.rand(1,addict) === 1) {
            if (bat.soins != undefined) {
                bat.soins = bat.soins+1;
            } else {
                bat.soins = 1;
            }
        }
    }
};

function blub(bat,batType) {
    // console.log('BLUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUB');
    let terrain = getTerrain(bat);
    let tile = getTile(bat);
    let blubTile = false;
    if (terrain.name === 'L' || (terrain.name === 'R' && tile.seed <= 3) || terrain.name === 'W') {
        if (!tile.rd) {
            blubTile = true;
        }
    }
    let blubBat = true;
    if ((batType.skills.includes('fly') && !batType.skills.includes('jetpack')) || batType.skills.includes('hover') || batType.skills.includes('noblub')) {
        blubBat = false;
    }
    if (hasEquip(bat,['waterproof'])) {
        blubBat = false;
    }
    if (bat.tags.includes('blub')) {
        if (!blubTile || !blubBat) {
            tagDelete(bat,'blub');
        } else {
            // console.log(batType.name);
            let blubPower = batType.hp*batType.squadSize*batType.squads/8;
            if (batType.skills.includes('bigblub')) {
                blubPower = blubPower*5;
            }
            if (batType.cat === 'buildings') {
                blubPower = blubPower/3;
            }
            if (terrain.name === 'W') {
                blubPower = blubPower/3;
            }
            if (batType.skills.includes('swim')) {
                blubPower = blubPower/2;
            }
            if (zone[0].planet === 'Kzin') {
                blubPower = blubPower*2;
            }
            if (batType.cat === 'infantry') {
                let batArmor = getEquipByName(bat.prt);
                let armorAPmalus = -batArmor.ap;
                // console.log('armorAP = '+armorAPmalus);
                if (armorAPmalus >= 2) {
                    blubPower = blubPower*armorAPmalus/1.5;
                }
            }
            blubPower = Math.round(blubPower);
            // console.log(blubPower);
            let blubPowerDice = rand.rand(Math.round(blubPower/2),Math.round(blubPower*1.5));
            let totalDamage = bat.damage+blubPowerDice;
            // console.log('blubPowerDice='+blubPowerDice);
            let squadHP = batType.squadSize*batType.hp;
            let squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (batType.cat != 'buildings') {
                if (bat.apLeft > Math.round(bat.ap/2)) {
                    bat.apLeft = Math.round(bat.ap/2);
                }
            }
            if (bat.squadsLeft <= 0) {
                if (batType.cat != 'buildings') {
                    batDeathEffect(bat,true,false,'<span class="rq3">Bataillon détruit</span>','<span class="vio">'+bat.type+' innondé.</span>');
                } else {
                    batDeathEffect(bat,true,false,'<span class="rq3">Bataillon détruit</span>','<span class="vio">'+bat.type+' noyé.</span>');
                }
            }
            checkDeath(bat,batType,false);
        }
    } else {
        if (blubTile && blubBat) {
            bat.tags.push('blub');
        }
    }
};

function tagsEffect(bat,batType) {
    let totalDamage;
    let squadHP;
    let squadsOut;
    let tile = getTile(bat);
    let allTags = _.countBy(bat.tags);
    if (allTags.poison === undefined) {
        allTags.poison = 0;
    }
    // MUD
    if (bat.tags.includes('mud')) {
        if (batType.cat != 'buildings') {
            bat.apLeft = bat.apLeft-bat.ap;
            if (batType.moveCost < 90) {
                bat.apLeft = bat.apLeft+Math.ceil(bat.ap/2);
            } else if (batType.skills.includes('ranger') || batType.skills.includes('caterp') || hasEquip(bat,['e-ranger'])) {
                bat.apLeft = bat.apLeft+rand.rand(0,Math.ceil(bat.ap/3*2));
            } else if (hasEquip(bat,['chenilles'])) {
                bat.apLeft = bat.apLeft+rand.rand(0,Math.ceil(bat.ap/2));
            } else {
                bat.apLeft = bat.apLeft+rand.rand(0,Math.ceil(bat.ap/3));
            }
            if (bat.prt === 'swing' || bat.prt === 'soap' || bat.prt === 'silk') {
                if (tile.web) {
                    tagDelete(bat,'mud');
                }
            }
        } else {
            tagDelete(bat,'mud');
        }
    }
    // WEB
    if (bat.tags.includes('web')) {
        let maxAP = Math.ceil(Math.sqrt(batType.size))-2;
        if (bat.apLeft > maxAP) {
            bat.apLeft = maxAP;
        }
        // if (batType.skills.includes('fullaploss')) {
        //     bat.apLeft = bat.apLeft-rand.rand(6,12);
        // }
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
    if (rand.rand(1,30) <= unitResist && bat.cat === 'infantry') {
        resistance = true;
    }
    // AUTOREPAIR
    if (bat.tags.includes('autorep')) {
        let ar = checkAutoRepair(bat,batType);
        bat.damage = ar.damage;
        bat.squadsLeft = ar.squadsLeft;
    }
    // REGENERATION & KIRIN DRUG
    let reg = checkRegeneration(bat,batType,resistance,allTags);
    bat.damage = reg.damage;
    bat.squadsLeft = reg.squadsLeft;
    // MALADIE
    if (bat.tags.includes('maladie')) {
        if (bat.tags.includes('skupiac') || bat.tags.includes('octiron') || bat.tags.includes('zombie')) {
            tagDelete(bat,'maladie');
        } else {
            if (rand.rand(1,30) <= unitResist && bat.team === 'player' && !bat.tags.includes('genweak')) {
                tagDelete(bat,'maladie');
                if (!bat.tags.includes('maladie')) {
                    warning('',bat.type+' ont vaincu la maladie.',false,bat.tileId);
                }
            } else {
                bat.apLeft = bat.apLeft-Math.floor(bat.ap/2.2);
                if (bat.squadsLeft < batType.squads || bat.damage >= 1 || bat.tags.includes('genweak')) {
                    if (rand.rand(1,36) <= (6-unitResist) && bat.team === 'player') {
                        if (!batType.skills.includes('resistpoison')) {
                            bat.tags.push('venin');
                            warning('',bat.type+' risquent de succomber à la maladie.',false,bat.tileId);
                        }
                    }
                }
                if (bat.tags.includes('hungry') && !bat.tags.includes('dying')) {
                    bat.tags.push('dying');
                }
            }
        }
    }
    // VOMISSURE
    if (bat.tags.includes('vomi')) {
        bat.apLeft = bat.apLeft-Math.floor(bat.ap/2.2);
        if (bat.tags.includes('skupiac')) {
            tagDelete(bat,'vomi');
        }
    }
    if (bat.tags.includes('vomissure')) {
        bat.apLeft = bat.apLeft-Math.floor(bat.ap/2.2);
        if (bat.tags.includes('skupiac')) {
            tagDelete(bat,'vomissure');
            warning('',bat.type+' ont été sauvés de la gangrène par le skupiac.',false,bat.tileId);
        }
    }
    // HUNGER GAMES
    if (bat.tags.includes('dying')) {
        bat.apLeft = bat.apLeft-Math.floor(bat.ap/1.3);
    } else if (bat.tags.includes('hungry')) {
        bat.apLeft = bat.apLeft-Math.floor(bat.ap/3);
    }
    // OCTIRON & POISONS
    if (bat.tags.includes('octiron') || batType.skills.includes('resistpoison') || bat.tags.includes('zombie')) {
        if (bat.tags.includes('venin')) {
            tagDelete(bat,'venin');
        }
        if (bat.tags.includes('poison')) {
            let numDel = 2+(playerInfos.comp.med*2);
            let i = 1;
            while (i <= numDel) {
                tagDelete(bat,'poison');
                if (i > 8) {break;}
                i++
            }
        }
    }
    // NECRO
    if (bat.tags.includes('necro')) {
        if (bat.tags.includes('octiron')) {
            if (playerInfos.comp.med >= 3) {
                if (rand.rand(1,10) === 1) {
                    tagDelete(bat,'necro');
                    if (!bat.tags.includes('necro')) {
                        warning('Octiron',bat.type+' a éliminé la nécrotoxine.',false,bat.tileId);
                    }
                }
            }
            if (rand.rand(0,10) > playerInfos.comp.med*3) {
                tagDelete(bat,'octiron');
                if (!bat.tags.includes('octiron')) {
                    warning('Nécrotoxine',bat.type+' n\'est plus sous l\'effet de l\'octiron.',false,bat.tileId);
                }
            }
        }
        if (bat.team === 'aliens') {
            if (batType.skills.includes('nokill')) {
                if (rand.rand(1,4) === 1) {
                    tagDelete(bat,'necro');
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
        if (bat.tags.includes('vomissure')) {
            let newMorph = {};
            newMorph.tile = bat.tileId;
            newMorph.alien = 'Vomissure';
            morphedBats.push(newMorph);
            bat.squadsLeft = 0;
            batDeathEffect(bat,true,true,'<span class="rq3">Attaque génétique</span>','<span class="vio">'+bat.type+' transformés en Vomissure.</span>');
        }
        // PARASITE
        if (bat.tags.includes('parasite') && bat.squadsLeft >= 1) {
            let parasiteDeg = Math.round(rand.rand((Math.round(parasiteDamage/3)),parasiteDamage)*batType.squads*batType.squadSize/60);
            if (playerInfos.comp.med >= 3) {
                parasiteDeg = Math.round(parasiteDeg/2);
            }
            let totalDamage = bat.damage+parasiteDeg;
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                let newMorph = {};
                newMorph.tile = bat.tileId;
                newMorph.alien = 'Rejetons';
                morphedBats.push(newMorph);
                batDeathEffect(bat,true,true,'<span class="rq3">Bataillon détruit</span>','<span class="vio">'+bat.type+' tués par le parasite.</span>');
            }
        }
        // SHINDA
        if (bat.tags.includes('shinda') && bat.squadsLeft >= 1) {
            if ((batType.skills.includes('nokill') || bat.tags.includes('permashield')) && rand.rand(1,3) === 1) {
                tagDelete(bat,'shinda');
                tagDelete(bat,'bio');
            } else if ((batType.skills.includes('resistpoison') || batType.kind === 'egg2') && rand.rand(1,8) === 1) {
                tagDelete(bat,'shinda');
                tagDelete(bat,'bio');
            } else {
                let shindaDamage = Math.round(Math.sqrt(batType.hp)*50);
                if (batType.skills.includes('reactpoison') || bat.tags.includes('reactpoison')) {
                    shindaDamage = shindaDamage*2;
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
                    if (batType.skills.includes('boss')) {
                        batDeathEffect(bat,true,true,'<span class="rq3">Bataillon détruit</span>','<span class="vio">'+bat.type+' tués par le shinda.</span>');
                    } else {
                        batDeathEffect(bat,true,true,'Bataillon détruit',bat.type+' tués par le shinda.');
                    }
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
                batDeathEffect(bat,true,true,'<span class="rq3">Bataillon détruit</span>','<span class="vio">'+bat.type+' tués par la drogue.</span>');
            }
        }
        // OEUFS SOUS LE DOME
        if (domeProtect) {
            if (bat.team === 'aliens') {
                if (batType.skills.includes('spawnegg')) {
                    let linkDamage = Math.round(rand.rand(6,10)*batType.hp/13);
                    let totalDamage = bat.damage+linkDamage;
                    squadHP = batType.squadSize*batType.hp;
                    squadsOut = Math.floor(totalDamage/squadHP);
                    bat.squadsLeft = bat.squadsLeft-squadsOut;
                    bat.damage = totalDamage-(squadsOut*squadHP);
                    if (bat.squadsLeft <= 0) {
                        batDeathEffect(bat,true,true,'<span class="rq3">Bataillon détruit</span>','<span class="vio">'+bat.type+' a perdu sont lien avec la matrice.</span>');
                    }
                }
            }
        }
        // VENIN
        if (bat.tags.includes('venin') && !batType.skills.includes('resistpoison') && !bat.tags.includes('resistpoison') && !bat.tags.includes('octiron') && !bat.tags.includes('zombie') && bat.squadsLeft >= 1) {
            bat.apLeft = bat.apLeft-Math.floor(bat.ap/3);
            let veninDeg = Math.round(rand.rand((Math.round(venumDamage/3)),venumDamage)*batType.squads*batType.squadSize/60);
            if (bat.tags.includes('genweak')) {
                veninDeg = veninDeg*2;
            }
            if (playerInfos.comp.med >= 3) {
                veninDeg = Math.round(veninDeg/2);
            }
            let totalDamage = bat.damage+veninDeg;
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,true,'<span class="rq3">Bataillon détruit</span>','<span class="vio">'+bat.type+' tués par le venin.</span>');
            } else {
                if (batType.team === 'player') {
                    let degDice = 3+Math.floor(playerInfos.comp.ca*1.5)+(unitResist*2);
                    if (unitResist < 4 || playerInfos.comp.ca < 4) {
                        if (rand.rand(1,degDice) === 1) {
                            bat.tags.push('venin');
                        }
                    }
                }
            }
        }
        // POISON
        if (bat.tags.includes('necro') && bat.team === 'player') {
            bat.tags.push('poison');
        }
        if (bat.tags.includes('poison') && !batType.skills.includes('resistpoison') && !bat.tags.includes('resistpoison') && !bat.tags.includes('octiron') && !bat.tags.includes('zombie') && bat.squadsLeft >= 1) {
            let poisonPower = allTags.poison*poisonDamage;
            if (bat.tags.includes('genweak')) {
                poisonPower = poisonPower*2;
            }
            if (bat.team === 'player') {
                poisonPower = Math.round(poisonPower*batType.squads*batType.squadSize/60);
            }
            if (batType.skills.includes('reactpoison') || bat.tags.includes('reactpoison')) {
                poisonPower = poisonPower*3;
                let poisonHinder = Math.sqrt(allTags.poison)+1;
                bat.apLeft = bat.apLeft-Math.floor(bat.ap*poisonHinder/6);
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
                if (batType.team === 'aliens') {
                    if (batType.skills.includes('boss')) {
                        batDeathEffect(bat,true,true,'<span class="rq3">Bataillon détruit</span>','<span class="vio">'+bat.type+' tués par le poison.</span>');
                    } else {
                        batDeathEffect(bat,true,true,'Bataillon détruit',bat.type+' tués par le poison.');
                    }
                } else {
                    batDeathEffect(bat,true,true,'<span class="rq3">Bataillon détruit</span>','<span class="vio">'+bat.type+' tués par le poison.</span>');
                }
            } else {
                let stopPoison = 10;
                if (batType.team === 'player') {
                    stopPoison = 20-Math.floor(playerInfos.comp.ca*1.5)-(unitResist*2);
                }
                let i = 1;
                while (i <= allTags.poison) {
                    if (rand.rand(1,stopPoison) === 1) {
                        tagDelete(bat,'poison');
                    }
                    if (i > 10) {break;}
                    i++
                }
            }
        }
    }
    // AUTOROAD
    autoRoadNextTurn(tile,bat,batType);
    checkDeath(bat,batType,true);
};

function checkDeath(bat,batType,gain) {
    if (bat.squadsLeft <= 0) {
        let deadId = bat.id;
        let tileId = bat.tileId;
        let isFlying = false;
        if (batType.skills.includes('fly')) {
            isFlying = true;
        }
        let isNoPrefab = false;
        if (bat.tags.includes('noprefab')) {
            isNoPrefab = true;
        }
        if (bat.team == 'player') {
            if (!batType.skills.includes('nodeathcount') && !bat.tags.includes('nopilots')) {
                playerInfos.unitsLost = playerInfos.unitsLost+1;
                playerInfos.deadBats.push(batType.name);
                playMusic('rip',true);
            }
            transDestroy(deadId,tileId,isFlying);
            if (!bat.tags.includes('nopilots')) {
                saveCrew(batType,deadId,tileId,isNoPrefab);
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
            if (gain) {
                addAlienRes(bat,false);
                if (!playerInfos.knownAliens.includes(batType.name)) {
                    newAlienKilled(batType,bat.tileId,true);
                }
            }
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

function tagDeleteX(bat,tag,delNum,notAll) {
    if (bat.tags.includes(tag)) {
        let iter = 1;
        while (iter <= delNum) {
            tagDelete(bat,tag);
            if (!bat.tags.includes(tag)) {
                break;
            }
            if (iter > 100) {break;}
            iter++
        }
        if (notAll && !bat.tags.includes(tag)) {
            bat.tags.push(tag);
        }
    }
};

function updateBatProperties(bat,batType) {
    if (batType.name != bat.type) {
        bat.type = batType.name;
    }
    if (bat.logeq === undefined) {
        bat.logeq = '';
    }
    if (bat.tdc === undefined) {
        bat.tdc = [];
    }
    if (batType.transRes >= 1) {
        if (bat.transRes === undefined) {
            bat.transRes = {};
        }
    }
    if (batType.transUnits >= 1) {
        if (bat.transIds === undefined) {
            bat.transIds = [];
        }
        if (bat.transIds.length >= 1) {
            let realTransIds = [];
            bat.transIds.forEach(function(inBatId) {
                let batExists = doesBatExists(inBatId);
                if (batExists) {
                    realTransIds.push(inBatId);
                }
            });
            if (bat.transIds.length > realTransIds.length) {
                bat.transIds = realTransIds;
            }
        }
    }
    if (bat.loc === 'trans') {
        let batExists = doesBatExists(bat.locId);
        if (!batExists) {
            let batLocId = findLostBatLocId(bat);
            if (batLocId >= 0) {
                bat.locId = batLocId;
            }
        }
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
            bat.locId = 0;
            let dropTile = checkDropInPlace(1829);
            if (dropTile >= 0) {
                bat.tileId = dropTile;
                bat.oldTileId = dropTile;
            } else {
                bat.tileId = 1829;
                bat.oldTileId = 1829;
            }
        }
    }
    if (bat.loc === 'zone') {
        bat.locId = 0;
    }
    // ammos
    if (bat.ammo === 'mine') {
        bat.ammo = 'mine-standard';
    }
    if (bat.ammo === 'trap') {
        bat.ammo = 'mine-trap';
    }
    if (bat.ammo === 'shinda') {
        bat.ammo = 'mine-shinda';
    }
};

function findLostBatLocId(myBat) {
    let lostLocId = -1;
    bataillons.forEach(function(bat) {
        if (bat.transIds != undefined) {
            if (bat.transIds.includes(myBat.id)) {
                lostLocId = bat.id;
            }
        }
    });
    return lostLocId;
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
    batList = _.filter(allBatList, function(bat) {
        return (bat.loc == 'zone' && !bat.tags.includes('nolist') && bat.sort >= 1000);
    });
    batList = _.sortBy(batList,'sort');
    batList.reverse();
    // console.log(batList);
    let lowSortedBatList = _.filter(allBatList, function(bat) {
        return (bat.loc == 'zone' && !bat.tags.includes('nolist') && bat.sort < 1000);
    });
    lowSortedBatList = _.sortBy(_.sortBy(_.sortBy(_.sortBy(lowSortedBatList,'tileId'),'type'),'sort'),'army');
    lowSortedBatList.reverse();
    batList.push(...lowSortedBatList);
    // console.log(batList);
    commandes();
};

function getNextSort() {
    let lessSort = 2001;
    bataillons.forEach(function(bat) {
        if (bat.sort < lessSort && bat.sort >= 1000) {
            lessSort = bat.sort;
        }
    });
    lessSort--;
    return lessSort;
};

function inSuperList() {
    let lessSort = getNextSort();
    selectedBat.sort = lessSort;
    clicSound(14);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function outSuperList() {
    if (selectedBatType.sort === undefined) {
        selectedBat.sort = selectedBat.range*10;
        if (selectedBatType.transUnits >= 10 && selectedBatType.cat === 'vehicles' && selectedBat.sort < 25) {
            selectedBat.sort = 25;
        }
        if (selectedBatType.skills.includes('medic') && selectedBatType.cat === 'infantry' && selectedBat.sort < 11) {
            selectedBat.sort = 11;
        }
    } else {
        selectedBat.sort = selectedBatType.sort;
    }
    clicSound(14);
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function killSuperList() {
    if (selectedBatType.sort === undefined) {
        selectedBat.sort = selectedBat.range*10;
        if (selectedBatType.transUnits >= 10 && selectedBatType.cat === 'vehicles' && selectedBat.sort < 25) {
            selectedBat.sort = 25;
        }
        if (selectedBatType.skills.includes('medic') && selectedBatType.cat === 'infantry' && selectedBat.sort < 11) {
            selectedBat.sort = 11;
        }
    } else {
        selectedBat.sort = selectedBatType.sort;
    }
    selectedBatArrayUpdate();
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.sort === undefined) {
            bat.sort = bat.range*10;
            if (batType.transUnits >= 10 && batType.cat === 'vehicles' && bat.sort < 25) {
                bat.sort = 25;
            }
            if (batType.skills.includes('medic') && batType.cat === 'infantry' && bat.sort < 11) {
                bat.sort = 11;
            }
        } else {
            bat.sort = batType.sort;
        }
    });
    clicSound(14);
    showBatInfos(selectedBat);
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
