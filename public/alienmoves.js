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
    // commandes();
    console.log(alienList);
};

function nextAlien() {

    // selectMode();
    // batUnstack();
    // deleteMoveInfos();
    if (Object.keys(selectedBat).length >= 1) {
        let batIndex = alienList.findIndex((obj => obj.id == selectedBat.id));
        alienList.shift();
    }
    if (alienList.length >= 1) {
        batSelect(batList[0]);
    } else {
        batUnselect();
    }
    alienMoveLoop(selectedBat);
    console.log(alienList);
};
