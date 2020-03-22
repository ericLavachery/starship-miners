function alienTurn() {
    createAlienList();
    // show the alien NEXT button
    // -> nextAlien
};

function alienMoveLoop() {
    // move map at the end of the alien moves
    // show attaqued bat
    chooseTarget();
};

function shootTarget() {
    console.log('shoot '+targetBat.type);
};

function chooseTarget() {
    // peut-être des targets différents selon les types d'aliens?
    let inPlace = false;
    let alienInMelee = alienMelee();
    let range = selectedWeap.range;
    if (range === 0) {
        // range 0
        if (alienInMelee) {
            inPlace = targetMelee();
            shootTarget();
        } else {
            inPlace = targetClosest();
            if (inPlace) {
                shootTarget();
            } else {

            }
        }
    } else if (range === 1) {
        // range 1
        if (alienInMelee) {
            inPlace = targetMelee();
            shootTarget();
        } else {
            inPlace = targetClosest();
            if (inPlace) {
                shootTarget();
            } else {

            }
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

function targetMelee() {
    let inPlace = false;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance === 0) {
                targetBat = JSON.parse(JSON.stringify(bat));
                inPlace = true;
            }
        }
    });
    return inPlace;
};

function targetClosest() {
    let inPlace = false;
    let distance = 100;
    let lePlusProche = 100;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance == selectedWeap.range) {
                targetBat = JSON.parse(JSON.stringify(bat));
                inPlace = true;
            }
        }
    });
    if (Object.keys(targetBat).length <= 0) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone") {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (lePlusProche > distance) {
                    lePlusProche = distance;
                    targetBat = JSON.parse(JSON.stringify(bat));
                }
            }
        });
    }
    return inPlace;
};

function alienMelee() {
    let alienInMelee = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
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
    alienMoveLoop();
};
