function nextTurn() {
    $('#unitInfos').empty();
    selectMode();
    batUnstack();
    batUnselect();
    // récup d'ap des unités
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
};
