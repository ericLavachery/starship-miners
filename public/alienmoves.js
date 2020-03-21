function alienTurn() {
    createAlienList();
    // show the alien NEXT button
    // -> nextAlien
};

function alienMoveLoop(alien) {
    // move map at the end of the alien moves
    // show attaqued bat
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
    alienMoveLoop(selectedBat);
    console.log('----------------------');
    console.log(alienList);
    console.log(selectedBat);
};
