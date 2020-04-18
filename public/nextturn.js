function nextTurn() {
    // stopMe = true;
    blockMe(true);
    $('#warnings').empty();
    activeTurn = 'aliens';
    $('#unitInfos').empty();
    selectMode();
    batUnstack();
    batUnselect();

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
        alienSounds();
        alienTurn();
    } else {
        nextTurnEnd();
    }


    // constructions et production : système d'ap également
    // check appartition d'aliens
    // sauvegarder zoneInfos (n° du tour etc...)

    // nextTurnEnd(); est lancé à la fin des nextAlien() !!!!!!!!!!!!!!!!!!!!
};

function nextTurnEnd() {
    $('#report').empty('');
    // récup du player
    let unitIndex;
    let batType;
    let ap;
    let tagIndex;
    deadBatsList = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            levelUp(bat);
            ap = getAP(bat);
            // unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
            // batType = unitTypes[unitIndex];
            batType = getBatType(bat);
            bat.salvoLeft = batType.maxSalvo;
            if (bat.apLeft < 0-batType.ap-batType.ap) {
                bat.apLeft = 0-batType.ap-batType.ap;
            }
            bat.apLeft = bat.apLeft+ap;
            if (bat.apLeft > ap) {
                bat.apLeft = ap;
            }
            bat.oldTileId = bat.tileId;
            bat.oldapLeft = bat.apLeft;
            tagsUpdate(bat);
            tagsEffect(bat,batType);
            blub(bat,batType);
        }
    });
    killBatList();
    playerInfos.mapTurn = playerInfos.mapTurn+1;
    $('#tour').empty().append('Tour '+playerInfos.mapTurn);
    savePlayerInfos();
    saveBataillons(); // !!!!!!!!!!!!!!!!!!!!!!!!
    saveAliens(); // !!!!!!!!!!!!!!!!!!!!!!
    createBatList();
    alienOccupiedTileList();
    blockMe(false);
    activeTurn = 'player';
    commandes();
};

function tagsUpdate(bat) {
    // tagDelete(bat,'guet');
    tagDelete(bat,'vise');
    tagDelete(bat,'embuscade');
    if (rand.rand(1,3) <= 2) {
        tagDelete(bat,'stun');
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
            bat.tags.push('blub');
        }
    }
};

function tagsEffect(bat,batType) {
    let totalDamage;
    let squadHP;
    let squadsOut;
    // REGENERATION
    if (bat.tags.includes('regeneration') || batType.skills.includes('regeneration') || batType.skills.includes('slowreg')) {
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
        let i = 1;
        while (i <= allTags.poison) {
            if (rand.rand(1,10) === 1) {
                tagDelete(bat,'poison');
                console.log('tag poison out');
            }
            if (i > 10) {break;}
            i++
        }
    }
    checkDeath(bat,batType);
};

function checkDeath(bat,batType) {
    if (bat.squadsLeft <= 0) {
        if (bat.team == 'player') {
            deadBatsList.push(bat.id);
        } else if (bat.team == 'aliens') {
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
        batUnselect();
    }
    // console.log(batList);
};

function alienSounds() {
    var sound = new Howl({
        src: ['/static/sounds/little_robot_sound_factory_Ambience_AlienHive_00.mp3']
    });
    sound.play();
};
