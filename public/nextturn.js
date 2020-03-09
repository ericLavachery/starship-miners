function nextTurn() {
    $('#unitInfos').empty();
    selectMode();
    batUnstack();
    batUnselect();
    // check appartition d'aliens
    // constructions et production : système d'ap également
    let unitTypesIndex;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
            bat.apLeft = bat.apLeft+unitTypes[unitIndex].ap;
            if (bat.apLeft > unitTypes[unitIndex].ap) {
                bat.apLeft = unitTypes[unitIndex].ap;
            }
        }
    });
    createBatList();
};

function createBatList() {
    let allBatList = bataillons.slice();
    let zoneBatList = _.filter(allBatList, function(bat) {
        return (bat.loc == 'zone' && bat.apLeft >= 1);
    });
    batList = _.sortBy(_.sortBy(zoneBatList,'id'),'typeId');
    commandes();
};

function nextBat(removeActiveBat) {
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
};
