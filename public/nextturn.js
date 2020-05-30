function nextTurn() {
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
        playMusic('start',false);
    }
    // récup des aliens
    deadAliensList = [];
    let unitIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            unitIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
            batType = alienUnits[unitIndex];
            bat.salvoLeft = batType.maxSalvo;
            if (bat.apLeft < 0-batType.ap-batType.ap) {
                bat.apLeft = 0-batType.ap-batType.ap;
            }
            bat.apLeft = bat.apLeft+batType.ap;
            if (bat.apLeft > batType.ap) {
                bat.apLeft = batType.ap;
            }
            bat.oldTileId = bat.tileId;
            bat.oldapLeft = bat.apLeft;
            tagsEffect(bat,batType);
        }
    });
    killAlienList();
    checkEggsDrop();
    spawns();
    killAlienList();
    conselUnit = {};
    conselAmmos = ['xxx','xxx'];
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
    let fuzzTotal = 0;
    let batFuzz;
    let batType;
    let ap;
    let tagIndex;
    deadBatsList = [];
    let boostedTeams = [];
    medicalTransports = [];
    let thisAPBonus;
    let ravitNum;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            if (bat.loc === "zone") {
                batFuzz = calcBatFuzz(bat);
                fuzzTotal = fuzzTotal+batFuzz;
            }
            batType = getBatType(bat);
            if (batType.skills.includes('leader') && !boostedTeams.includes(batType.kind)) {
                boostedTeams.push(batType.kind);
            }
            if (!medicalTransports.includes(bat.locId) && bat.loc === "trans" && (batType.skills.includes('medic') || batType.skills.includes('badmedic'))) {
                medicalTransports.push(bat.locId);
            }
            if (!medicalTransports.includes(bat.id) && batType.transUnits >= 1 && batType.skills.includes('medic')) {
                medicalTransports.push(bat.id);
            }
        }
    });
    console.log('Medical Transports');
    console.log(medicalTransports);
    console.log('Boosted Teams');
    console.log(boostedTeams);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            levelUp(bat);
            ap = getAP(bat);
            thisAPBonus = 0;
            batType = getBatType(bat);
            if (boostedTeams.includes(batType.kind)) {
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
            if (playerInfos.skills.includes('trans2') && batType.cat === 'vehicles' && !batType.skills.includes('robot') && thisAPBonus == 0) {
                ap = ap+1;
            }
            bat.salvoLeft = batType.maxSalvo;
            if (bat.apLeft < 0-(batType.ap*2)) {
                bat.apLeft = 0-(batType.ap*2);
            }
            bat.apLeft = bat.apLeft+ap;
            if (bat.apLeft > Math.round(ap*1.5)) {
                bat.apLeft = Math.round(ap*1.5);
            }
            if (batType.skills.includes('fastempty')) {
                ravitNum = calcRavit(bat);
                if (ravitNum === 0) {
                    bat.apLeft = bat.apLeft+5;
                }
            }
            bat.oldTileId = bat.tileId;
            bat.oldapLeft = bat.apLeft;
            tagsEffect(bat,batType);
            tagsUpdate(bat);
            blub(bat,batType);
        }
    });
    killBatList();
    playerInfos.mapTurn = playerInfos.mapTurn+1;
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
    savePlayerInfos();
    saveBataillons(); // !!!!!!!!!!!!!!!!!!!!!!!!
    saveAliens(); // !!!!!!!!!!!!!!!!!!!!!!
    createBatList();
    alienOccupiedTileList();
    blockMe(false);
    activeTurn = 'player';
    commandes();
    // testConnect(pseudo);
};

function tagsUpdate(bat) {
    tagDelete(bat,'vise');
    tagDelete(bat,'embuscade');
    tagDelete(bat,'noBis');
    if (rand.rand(1,3) <= 2) {
        tagDelete(bat,'stun');
    }
    if (rand.rand(1,10) === 1) {
        if (bat.tags.includes('kirin')) {
            tagIndex = bat.tags.indexOf('kirin');
            bat.tags.splice(tagIndex,1);
            drugDown(bat,false,false);
        }
    }
    if (rand.rand(1,10) === 1) {
        if (bat.tags.includes('sila')) {
            tagIndex = bat.tags.indexOf('sila');
            bat.tags.splice(tagIndex,1);
            drugDown(bat,true,false);
        }
    }
    if (rand.rand(1,10) === 1) {
        if (bat.tags.includes('bliss')) {
            tagIndex = bat.tags.indexOf('bliss');
            bat.tags.splice(tagIndex,1);
            drugDown(bat,false,true);
        }
    }
    if (rand.rand(1,6) === 1) {
        if (bat.tags.includes('blaze')) {
            tagIndex = bat.tags.indexOf('blaze');
            bat.tags.splice(tagIndex,1);
            drugDown(bat,true,true);
        }
    }
    if (rand.rand(1,10) === 1) {
        if (bat.tags.includes('skupiac')) {
            tagIndex = bat.tags.indexOf('skupiac');
            bat.tags.splice(tagIndex,1);
            drugDown(bat,true,false);
        }
    }
    if (bat.tags.includes('starka')) {
        tagIndex = bat.tags.indexOf('starka');
        bat.tags.splice(tagIndex,1);
        drugDown(bat,false,false);
    }
};

function drugDown(bat,poison,addict) {
    if (poison) {
        bat.tags.push('poison');
    }
    if (rand.rand(1,toxChance) === 1 && addict) {
        bat.tags.push('tox');
    }
};

function blub(bat,batType) {
    let terrain = getTerrain(bat);
    if (bat.tags.includes('blub')) {
        if (terrain.name != 'W' && terrain.name != 'R') {
            tagDelete(bat,'blub');
        } else {
            let totalDamage = bat.damage+rand.rand((Math.round(blubDamage/3)),blubDamage);
            console.log('blubDamage='+totalDamage);
            let squadHP = batType.squadSize*batType.hp;
            let squadsOut = Math.floor(totalDamage/squadHP);
            bat.squadsLeft = bat.squadsLeft-squadsOut;
            bat.damage = totalDamage-(squadsOut*squadHP);
            bat.apLeft = 2;
            if (bat.squadsLeft <= 0) {
                batDeathEffect(bat,true,'Bataillon détruit',bat.type+' noyé.');
            }
            checkDeath(bat,batType);
        }
    } else {
        if (terrain.name === 'W' || terrain.name === 'R') {
            if ((!batType.skills.includes('fly') && !batType.skills.includes('hover')) || batType.skills.includes('jetpack')) {
                bat.tags.push('blub');
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
    if (bat.tags.includes('kirin') || batType.skills.includes('regeneration') || batType.skills.includes('slowreg')) {
        squadHP = batType.squadSize*batType.hp;
        let batHP = squadHP*batType.squads;
        let regen = Math.round(batHP*regenPower/100);
        if (batType.skills.includes('slowreg')) {
            regen = Math.round(batHP*slowregPower/100);
        }
        console.log('regeneration='+regen);
        let batHPLeft = (bat.squadsLeft*squadHP)-bat.damage+regen;
        bat.squadsLeft = Math.ceil(batHPLeft/squadHP);
        bat.damage = (bat.squadsLeft*squadHP)-batHPLeft;
        if (bat.squadsLeft > batType.squads) {
            bat.squadsLeft = batType.squads;
            bat.damage = 0;
        }
    }
    // MALADIE
    if (bat.tags.includes('maladie')) {
        bat.apLeft = bat.apLeft-Math.floor(batType.ap/2.2);
    }
    if (!medicalTransports.includes(bat.locId) || bat.loc != 'trans') {
        // PARASITE
        if (bat.tags.includes('parasite')) {
            totalDamage = bat.damage+rand.rand((Math.round(parasiteDamage/3)),parasiteDamage);
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
            let shindaDamage = Math.round(Math.sqrt(batType.hp)*8);
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
        // VENIN
        if (bat.tags.includes('venin')) {
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
        if (bat.tags.includes('poison')) {
            let allTags = _.countBy(bat.tags);
            let poisonPower = allTags.poison*poisonDamage;
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
        let batType = getBatType(bat);
        if (bat.team == 'player') {
            deadBatsList.push(bat.id);
            if (!batType.skills.includes('nodeathcount')) {
                playerInfos.unitsLost = playerInfos.unitsLost+1;
                playMusic('rip',false);
            }
        } else if (bat.team == 'aliens') {
            deadAliensList.push(bat.id);
            if (bat.type === 'Oeuf' || bat.type === 'Coque' || bat.type === 'Ruche') {
                playerInfos.eggsKilled = playerInfos.eggsKilled+1;
            }
            playerInfos.aliensKilled = playerInfos.aliensKilled+1;
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
        return (bat.loc == 'zone' && bat.apLeft >= 1);
    });
    batList = _.sortBy(_.sortBy(_.sortBy(zoneBatList,'typeId'),'range'),'army');
    batList.reverse();
    commandes();
    // console.log(batList);
};

function nextBat(removeActiveBat) {
    // testConnect(pseudo);
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
