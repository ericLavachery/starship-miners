function nextTurn() {
    // stopMe = true;
    blockMe(true);
    $('#unitInfos').empty();
    selectMode();
    batUnstack();
    batUnselect();

    alienMovesLoop();

    // mouvement des aliens
    // attaque des aliens
    // récup aliens (ap, salvo, regeneration)
    // constructions et production : système d'ap également
    // check appartition d'aliens
    // sauvegarder zoneInfos (n° du tour etc...)

    let unitTypesIndex;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
            bat.salvoLeft = unitTypes[unitIndex].maxSalvo;
            bat.apLeft = bat.apLeft+unitTypes[unitIndex].ap;
            if (bat.apLeft > unitTypes[unitIndex].ap) {
                bat.apLeft = unitTypes[unitIndex].ap;
            }
            bat.oldTileId = bat.tileId;
            bat.oldapLeft = bat.apLeft;
        }
    });
    saveBataillons();
    saveAliens();
    createBatList();
    alienOccupiedTileList();
    setTimeout(function (){
        // stopMe = false;
        blockMe(false);
    }, 3000); // How long do you want the delay to be (in milliseconds)?
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
    batList = _.sortBy(_.sortBy(zoneBatList,'id'),'typeId');
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
            batList.shift();
        } else {
            // push the bat at the end of batList
            batList.push(batList.splice(batIndex, 1)[0]);
        }
    }
    if (batList.length >= 1) {
        batSelect(batList[0]);
    } else {
        batUnselect();
    }
    // console.log(batList);
};
