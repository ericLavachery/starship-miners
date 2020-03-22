function alienTurn() {
    createAlienList();
    // show the alien NEXT button
    // -> nextAlien
};

function alienMoveLoop(alien) {
    // move map at the end of the alien moves
    // show attaqued bat
    chooseTarget(alien);
};

function chooseTarget(alien) {
    // peut-être des targets différents selon les types d'aliens?
    let inPlace = false;
    let alienInMelee = alienMelee(alien);
    let range = selectedWeap.range;
    let laBonneDistance = 0;
    if (range === 0) {
        // range 0
        if (alienInMelee) {
            inPlace = targetMelee(alien);
        } else {
            targetClosest(alien);
        }
    } else if (range === 1) {
        // range 1
        if (alienInMelee) {
            inPlace = targetMelee(alien);
        } else {

        }
    } else {
        // range 2+
        if (alienInMelee) {

        } else {

        }
    }
    console.log('inPlace '+inPlace);
    console.log(targetBat);
};

function targetMelee(alien) {
    let inPlace = false;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(alien.tileId,bat.tileId);
            if (distance === 0) {
                targetBat = JSON.parse(JSON.stringify(bat));
                inPlace = true;
            }
        }
    });
    return inPlace;
};

function targetClosest(alien) {
    let distance = 100;
    let lePlusProche = 100;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(alien.tileId,bat.tileId);
            if (lePlusProche > distance) {
                lePlusProche = distance;
                targetBat = JSON.parse(JSON.stringify(bat));
            }
        }
    });
};

function alienMelee(alien) {
    let alienInMelee = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(alien.tileId,bat.tileId);
            if (distance === 0) {
                alienInMelee = true;
            }
        }
    });
    return alienInMelee;
};

function createAlienList() {
    let allAlienList = aliens.slice();
    let zoneAlienList = _.filter(allAlienList, function(bat) {
        return (bat.loc == 'zone' && bat.apLeft >= 1);
    });
    alienList = _.sortBy(_.sortBy(zoneAlienList,'id'),'typeId');
    commandes();
    console.log(alienList);
};

function nextAlien() {
    // activated by click
    if (Object.keys(selectedBat).length >= 1) {
        alienList.shift();
    }
    if (alienList.length >= 1) {
        batSelect(alienList[0]);
    } else {
        batUnselect();
        // terminer le tour alien (et enregistrement)
        nextTurnEnd();
    }
    selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
    selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
    console.log('----------------------');
    console.log(alienList);
    console.log(selectedBat);
    alienMoveLoop(selectedBat);
};
