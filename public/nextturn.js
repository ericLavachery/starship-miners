function nextTurn() {
    testConnect(pseudo);
    console.log('NOUVEAU TOUR');
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    // stopMe = true;
    blockMe(true);
    $('#warnings').empty();
    activeTurn = 'aliens';
    $('#unitInfos').empty();
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
    let unitIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (!bat.tags.includes('invisible') && !batType.skills.includes('invisible')) {
                visibleAliens.push(bat.tileId);
            }
            if (!alienTypesList.includes(batType.name)) {
                alienTypesList.push(batType.name);
            }
            if (batType.skills.includes('hide') && !bat.tags.includes('invisible') && bat.salvoLeft >= 1) {
                bat.tags.push('invisible');
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
            tagDelete(bat,'shield');
            tagDelete(bat,'nez');
            if (rand.rand(1,3) <= 2) {
                tagDelete(bat,'stun');
            }
            if (rand.rand(1,3) === 1) {
                tagDelete(bat,'freeze');
            }
            if (playerInfos.mapTurn > bat.creaTurn+10 && bat.type != 'Oeuf voilé' && !batType.skills.includes('hide')) {
                tagDelete(bat,'invisible');
            }
        }
    });
    killAlienList();
    checkEggsDrop();
    spawns();
    spawnSound();
    killAlienList();
    conselUnit = {};
    conselAmmos = ['xxx','xxx','xxx'];
    spawnType = {};
    if (aliens.length >= 1) {
        alienTurn();
    } else {
        nextTurnEnd();
    }
    // constructions et production : système d'ap également
    // nextTurnEnd(); est lancé à la fin des nextAlien() !!!!!!!!!!!!!!!!!!!!
};

function nextTurnEnd() {
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
    landers = [];
    let thisAPBonus;
    let ravitNum;
    let emptyBonus;
    let minAP;
    let apRest;
    let camoEnCours = false;
    let distance;
    let alienType;
    let noStuck = false;
    let landerAdjTiles = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('transorbital') || bat.tags.includes('reserve')) {
                landers.push(bat);
            }
            if (batType.skills.includes('transorbital')) {
                landerAdjTiles.push(bat.tileId);
                if (!landerAdjTiles.includes(bat.tileId-1)) {
                    landerAdjTiles.push(bat.tileId-1);
                }
                if (!landerAdjTiles.includes(bat.tileId+1)) {
                    landerAdjTiles.push(bat.tileId+1);
                }
                if (!landerAdjTiles.includes(bat.tileId+mapSize-1)) {
                    landerAdjTiles.push(bat.tileId+mapSize-1);
                }
                if (!landerAdjTiles.includes(bat.tileId+mapSize+1)) {
                    landerAdjTiles.push(bat.tileId+mapSize+1);
                }
                if (!landerAdjTiles.includes(bat.tileId+mapSize)) {
                    landerAdjTiles.push(bat.tileId+mapSize);
                }
                if (!landerAdjTiles.includes(bat.tileId-mapSize)) {
                    landerAdjTiles.push(bat.tileId-mapSize);
                }
                if (!landerAdjTiles.includes(bat.tileId-mapSize+1)) {
                    landerAdjTiles.push(bat.tileId-mapSize+1);
                }
                if (!landerAdjTiles.includes(bat.tileId-mapSize-1)) {
                    landerAdjTiles.push(bat.tileId-mapSize-1);
                }
            }
            bat.apLeft = Math.ceil(bat.apLeft);
            if (bat.apLeft < 0-(bat.ap*2) && batType.cat != 'buildings' && !bat.tags.includes('construction')) {
                bat.apLeft = 0-(bat.ap*2);
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
            // nolist
            if (bat.loc === "zone" && bat.tags.includes('nolist')) {
                aliens.forEach(function(alien) {
                    distance = calcDistance(bat.tileId,alien.tileId);
                    alienType = getBatType(alien);
                    if (distance <= 8 && !alienType.skills.includes('invisible') && !alien.tags.includes('invisible')) {
                        tagDelete(bat,'nolist');
                    }
                });
            }
        }
    });
    console.log('Medical Transports');
    console.log(medicalTransports);
    console.log('Boosted Teams');
    console.log(boostedTeams);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('extraction')) {
                mining(bat);
            }
            if (batType.skills.includes('unload')) {
                autoUnload(bat);
            }
            levelUp(bat);
            // Motorised noStuck
            noStuck = false;
            if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !bat.tags.includes('action') && bat.apLeft < 0 && !bat.tags.includes('construction') && bat.oldTileId === bat.tileId) {
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
            ap = getAP(bat);
            thisAPBonus = 0;
            if (boostedTeams.includes(batType.kind)) {
                ap = ap+1;
                thisAPBonus = 1;
            }
            if (prayedTeams.includes(batType.kind)) {
                ap = ap+1;
                thisAPBonus = 1;
            }
            if (playerInfos.medLevel >= 1 && batType.name === 'Toubibs') {
                ap = ap+1;
            }
            if (playerInfos.medLevel >= 2 && batType.name === 'Hosto') {
                ap = ap+2;
                thisAPBonus = 2;
            }
            if (playerInfos.skills.includes('trans2') && batType.cat === 'vehicles' && !batType.skills.includes('robot') && thisAPBonus <= 1) {
                ap = ap+1;
            }
            // fastempty
            if (batType.skills.includes('fastempty')) {
                ravitNum = calcRavit(bat);
                if (ravitNum < batType.maxSkill) {
                    emptyBonus = Math.round((batType.maxSkill-ravitNum)/batType.maxSkill*5);
                    ap = ap+emptyBonus;
                }
            }
            // camoAP
            camoEnCours = false;
            if (bat.camoAP >= 1) {
                camoEnCours = true;
            }
            oldAP = ap;
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
            if (bat.apLeft < 0-(bat.ap*2)) {
                bat.apLeft = 0-(bat.ap*2);
            }
            if (bat.apLeft > oldAP) {
                bat.apLeft = oldAP;
            }
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
            bat.oldTileId = bat.tileId;
            bat.oldapLeft = bat.apLeft;
            if (batType.skills.includes('notarget') && bat.fuzz > -2) {
                bat.fuzz = -2;
            }
            tagsEffect(bat,batType);
            tagsUpdate(bat);
            if (bat.loc === "zone") {
                blub(bat,batType);
            }
            bat.xp = bat.xp.toFixedNumber(2);
            bat.apLeft = bat.apLeft.toFixedNumber(1);
            // nolist
            if (batType.skills.includes('nolist') && !bat.tags.includes('nolist')) {
                bat.tags.push('nolist');
            }
            // réserves
            if (batType.skills.includes('reserve') && !bat.tags.includes('reserve') && landerAdjTiles.includes(bat.tileId)) {
                bat.tags.push('reserve');
            }
        }
    });
    killBatList();
    playerInfos.mapTurn = playerInfos.mapTurn+1;
    if (playerInfos.mapTurn % 50 === 0 && playerInfos.mapTurn >= 1) {
        playerInfos.mapDiff++;
    }
    turnInfo();
    if (showMini) {
        minimap();
    }
    savePlayerInfos();
    saveBataillons();
    saveAliens();
    saveMap();
    createBatList();
    alienOccupiedTileList();
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
                numberOfEggs++;
                if (bat.type != 'Cocon') {
                    realNumberOfEggs++;
                }
            } else if (!bat.tags.includes('invisible') && !batType.skills.includes('invisible')) {
                numberOfAliens++;
            } else if (bat.type.includes('Oeuf')) {
                realNumberOfEggs++;
            }
        }
    });
    eggsNum = numberOfEggs;
    aliensNum = numberOfAliens;
    if (realNumberOfEggs >= 10) {
        playerInfos.eggPause = true;
        console.log('PAUSE! 10+ eggs');
        if (playerInfos.pseudo === 'Bob') {
            warning('Nouvelle pause','10 oeufs ou plus en jeu.');
        }
    }
    let fuzzTotal = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batFuzz = calcBatFuzz(bat);
            fuzzTotal = fuzzTotal+batFuzz;
        }
    });
    playerInfos.fuzzTotal = fuzzTotal;
    let bonusDiff = Math.floor((fuzzTotal+rand.rand(0,fuzzDiv)-(fuzzDiv/2))/fuzzDiv);
    playerInfos.mapAdjDiff = playerInfos.mapDiff+bonusDiff;
    if (playerInfos.mapAdjDiff < 1) {
        playerInfos.mapAdjDiff = 1;
    }
    $('#tour').empty().append('Tour '+playerInfos.mapTurn+'<br>');
    $('#tour').append('Attraction '+playerInfos.fuzzTotal+'<br>');
    $('#tour').append('Difficulté '+playerInfos.mapAdjDiff+' / '+playerInfos.mapDiff+'<br>');
    if (playerInfos.eggPause) {
        $('#tour').append('<span class="cy">Pause</span><br>');
    }
    $('#tour').append('Morts <span class="or">'+playerInfos.unitsLost+'</span> / '+playerInfos.aliensKilled+' / <span class="cy">'+playerInfos.eggsKilled+'</span>');
};

function tagsUpdate(bat) {
    tagDelete(bat,'vise');
    if (rand.rand(1,3) > 1) {
        tagDelete(bat,'noemb');
    }
    if (bat.tags.includes('embuscade')) {
        bat.tags.push('noemb');
        bat.tags.push('noemb');
    }
    tagDelete(bat,'embuscade');
    tagDelete(bat,'noBis1');
    tagDelete(bat,'noBis2');
    tagDelete(bat,'action');
    if (!bat.tags.includes('prayer') && rand.rand(1,6) === 1) {
        tagDelete(bat,'spirit');
    }
    if (rand.rand(1,3) === 1) {
        tagDelete(bat,'prayer');
    }
    if (rand.rand(1,3) <= 2) {
        tagDelete(bat,'stun');
    }
    if (rand.rand(1,5) === 1) {
        if (bat.tags.includes('octiron')) {
            tagIndex = bat.tags.indexOf('octiron');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('octiron')) {
                drugDown(bat,false,false);
            }
        }
    }
    if (rand.rand(1,5) === 1) {
        if (bat.tags.includes('kirin')) {
            tagIndex = bat.tags.indexOf('kirin');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('kirin')) {
                drugDown(bat,true,false);
            }
        }
    }
    if (rand.rand(1,5) === 1) {
        if (bat.tags.includes('sila')) {
            tagIndex = bat.tags.indexOf('sila');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('sila')) {
                drugDown(bat,false,false);
            }
        }
    }
    if (rand.rand(1,5) === 1) {
        if (bat.tags.includes('bliss')) {
            tagIndex = bat.tags.indexOf('bliss');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('bliss')) {
                drugDown(bat,false,true);
            }
        }
    }
    if (rand.rand(1,3) === 1) {
        if (bat.tags.includes('blaze')) {
            tagIndex = bat.tags.indexOf('blaze');
            bat.tags.splice(tagIndex,1);
            if (!bat.tags.includes('blaze')) {
                drugDown(bat,true,true);
            }
        }
    }
    if (rand.rand(1,5) === 1) {
        if (bat.tags.includes('skupiac')) {
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
        if (!bat.tags.includes('skupiac')) {
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
    if (rand.rand(1,toxChance) === 1 && addict) {
        bat.tags.push('tox');
    }
};

function blub(bat,batType) {
    let terrain = getTerrain(bat);
    if (bat.tags.includes('blub')) {
        let tile = getTile(bat);
        if ((terrain.name != 'W' && terrain.name != 'R') || tile.rd) {
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
        if (terrain.name === 'W' || terrain.name === 'R') {
            let tile = getTile(bat);
            if ((tile.seed <= 3 || terrain.name === 'W') && !tile.rd) {
                if ((!batType.skills.includes('fly') && !batType.skills.includes('hover') && !batType.skills.includes('noblub')) || batType.skills.includes('jetpack')) {
                    bat.tags.push('blub');
                }
            }
        }
    }
};

function tagsEffect(bat,batType) {
    let totalDamage;
    let squadHP;
    let squadsOut;
    // BLAZE DRUG
    if (bat.tags.includes('blaze')) {
        bat.apLeft = bat.apLeft+6;
        bat.salvoLeft = bat.salvoLeft+1;
    }
    // BLISS DRUG
    if (bat.tags.includes('bliss')) {
        bat.apLeft = bat.apLeft-2;
    }
    // REGENERATION & KIRIN DRUG
    if (bat.tags.includes('kirin') || bat.tags.includes('slowreg') || batType.skills.includes('regeneration') || batType.skills.includes('slowreg')) {
        squadHP = batType.squadSize*batType.hp;
        let batHP = squadHP*batType.squads;
        if (bat.citoyens >= 1) {
            batHP = bat.citoyens*batType.hp;
        }
        let regen;
        if (bat.tags.includes('kirin') || batType.skills.includes('regeneration')) {
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
    // MALADIE
    if (bat.tags.includes('maladie')) {
        if (bat.tags.includes('skupiac') || bat.tags.includes('octiron')) {
            tagDelete(bat,'maladie');
        } else {
            bat.apLeft = bat.apLeft-Math.floor(bat.ap/2.2);
        }
    }
    // OCTIRON & POISONS
    if (bat.tags.includes('octiron')) {
        if (bat.tags.includes('venin')) {
            tagDelete(bat,'venin');
        }
        if (bat.tags.includes('poison')) {
            tagDelete(bat,'poison');
            tagDelete(bat,'poison');
            tagDelete(bat,'poison');
        }
    }
    if (!medicalTransports.includes(bat.locId) || bat.loc != 'trans') {
        // PARASITE
        if (bat.tags.includes('parasite')) {
            totalDamage = bat.damage+rand.rand((Math.round(parasiteDamage/3)),parasiteDamage);
            if (bat.tags.includes('octiron')) {
                totalDamage = Math.round(totalDamage/10);
            }
            console.log('parasiteDamage='+totalDamage);
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
            totalDamage = bat.damage+rand.rand((Math.round(shindaDamage/2)),Math.round(shindaDamage*1.5));
            console.log('VenomDamage='+totalDamage);
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
            totalDamage = bat.damage+rand.rand((Math.round(poisonDamage/3)),poisonDamage);
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par la drogue.');
            }
        }
        // VENIN
        if (bat.tags.includes('venin') && !batType.skills.includes('resistpoison') && !bat.tags.includes('resistpoison') && !bat.tags.includes('octiron')) {
            totalDamage = bat.damage+rand.rand((Math.round(venumDamage/3)),venumDamage);
            console.log('VenomDamage='+totalDamage);
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par le venin.');
            }
        }
        // POISON
        if (bat.tags.includes('poison') && !batType.skills.includes('resistpoison') && !bat.tags.includes('resistpoison') && !bat.tags.includes('octiron')) {
            let allTags = _.countBy(bat.tags);
            let poisonPower = allTags.poison*poisonDamage;
            if (batType.skills.includes('reactpoison') || bat.tags.includes('reactpoison')) {
                poisonPower = poisonPower*3;
            }
            if (batType.cat === 'aliens') {
                poisonPower = Math.round(poisonPower*1.5);
            }
            console.log('tags poison: '+allTags.poison);
            totalDamage = bat.damage+rand.rand((Math.round(poisonPower/3)),poisonPower);
            console.log('PoisonDamage='+totalDamage);
            squadHP = batType.squadSize*batType.hp;
            squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' tués par le poison.');
            }
            let stopPoison = 10;
            if (batType.cat != 'aliens') {
                stopPoison = 14-(playerInfos.caLevel*2);
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
                    unveilAliens(bat);
                }
            }
            playerInfos.aliensKilled = playerInfos.aliensKilled+1;
            addAlienRes(bat);
            deadAliensList.push(bat.id);
        }
    }
};

function killBatList() {
    bataillons.slice().reverse().forEach(function(bat,index,object) {
      if (deadBatsList.includes(bat.id)) {
        bataillons.splice(object.length-1-index,1);
      }
    });
};

function killAlienList() {
    aliens.slice().reverse().forEach(function(bat,index,object) {
      if (deadAliensList.includes(bat.id)) {
        aliens.splice(object.length-1-index,1);
      }
    });
    deadAliensList = [];
};

function tagDelete(bat,tag) {
    if (bat.tags.includes(tag)) {
        tagIndex = bat.tags.indexOf(tag);
        bat.tags.splice(tagIndex,1);
    }
};

function tagAction() {
    if (!selectedBat.tags.includes('action')) {
        selectedBat.tags.push('action');
        selectedBatArrayUpdate();
    }
};

function putTagAction(bat) {
    if (!bat.tags.includes('action')) {
        bat.tags.push('action');
    }
};

function levelUp(bat) {
    if (bat.xp >= levelXP[4]) {
        if (bat.vet < 4) {
            bat.vet = 4;
        }
    } else if (bat.xp >= levelXP[3]) {
        if (bat.vet < 3) {
            bat.vet = 3;
        }
    } else if (bat.xp >= levelXP[2]) {
        if (bat.vet < 2) {
            bat.vet = 2;
        }
    } else if (bat.xp >= levelXP[1]) {
        if (bat.vet < 1) {
            bat.vet = 1;
        }
    }
    // bat.xp = Math.round(100*bat.xp)/100;
    bat.xp = bat.xp.toFixedNumber(2);
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

function createBatList() {
    let allBatList = bataillons.slice();
    let zoneBatList = _.filter(allBatList, function(bat) {
        return (bat.loc == 'zone' && bat.apLeft >= 1 && !bat.tags.includes('nolist'));
    });
    batList = _.sortBy(zoneBatList,'fuzz');
    batList.reverse();
    batList = _.sortBy(_.sortBy(_.sortBy(batList,'tileId'),'type'),'army');
    batList.reverse();
    commandes();
    // console.log(batList);
};

function nextBat(removeActiveBat,removeForever) {
    testConnect(pseudo);
    if (rand.rand(1,musicChance) === 1) {
        playMusic('any',false);
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
        saveAllBats();
        batUnselect();
    }
    // console.log(batList);
};
