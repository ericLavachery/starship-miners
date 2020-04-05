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
    alienTurn();

    // mouvement des aliens
    // attaque des aliens
    // récup aliens (ap, salvo, regeneration)
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
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            levelUp(bat);
            ap = getAP(bat);
            unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
            batType = unitTypes[unitIndex];
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
        }
    });
    saveBataillons(); // !!!!!!!!!!!!!!!!!!!!!!!!
    saveAliens(); // !!!!!!!!!!!!!!!!!!!!!!
    createBatList();
    alienOccupiedTileList();
    blockMe(false);
    activeTurn = 'player';
    commandes();
};

function tagsUpdate(bat) {
    tagDelete(bat,'guet');
    tagDelete(bat,'vise');
    tagDelete(bat,'embuscade');
};

function tagsEffect(bat,batType) {
    if (bat.tags.includes('venin')) {
        let totalDamage = bat.damage+rand.rand((Math.round(venumDamage/3)),venumDamage);
        let squadHP = batType.squadSize*batType.hp;
        let squadsOut = Math.floor(totalDamage/squadHP);
        bat.squadsLeft = bat.squadsLeft-squadsOut;
        bat.damage = totalDamage-(squadsOut*squadHP);
        // Mort !!!
    }
    if (bat.tags.includes('regeneration') || batType.skills.includes('regeneration')) {
        let squadHP = batType.squadSize*batType.hp;
        let batHP = squadHP*batType.squads;
        let regen = Math.round(batHP/regenPower);
        let batHPLeft = (bat.squadsLeft*squadHP)-bat.damage+regen;
        bat.squadsLeft = Math.ceil(batHPLeft/squadHP);
        bat.damage = (bat.squadsLeft*squadHP)-batHPLeft;
    }
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

function createBatList() {
    let allBatList = bataillons.slice();
    let zoneBatList = _.filter(allBatList, function(bat) {
        return (bat.loc == 'zone' && bat.apLeft >= 1);
    });
    batList = _.sortBy(_.sortBy(_.sortBy(zoneBatList,'typeId'),'range'),'army');
    batList.reverse();
    commandes();
    console.log(batList);
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
    console.log(batList);
};
