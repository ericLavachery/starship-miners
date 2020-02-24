// OPPONENT SINGLE POP CHANGE
socket.on('single_pop_changed', function(data) {
    // change pop
    let prop = data.prop;
    let objIndex = pop.findIndex((obj => obj.id == data.id));
    pop[objIndex][prop] = data.value;
});

// OPPONENT SINGLE WORLD CHANGE
socket.on('single_world_changed', function(data) {
    // change world
    let prop = data.prop;
    let objIndex = world.findIndex((obj => obj.id == data.id));
    world[objIndex][prop] = data.value;
});

// OPPONENT MOVES
socket.on('unit_moved', function(data) {
    showOpponentMove(data.tileId, data.unitId, data.prevTileId);
});
function showOpponentMove(tileId, unitId, prevTileId) {
    objIndex = pop.findIndex((obj => obj.id == unitId));
    let movedUnitOldTileId = pop[objIndex].tileId;
    let movedUnitIcon = pop[objIndex].icon;
    // bouge l'image sur la carte
    $('#b'+movedUnitOldTileId).empty();
    $('#s'+movedUnitOldTileId).empty();
    drawTileDefaultUnit(tileId);
    // change le tileId dans pop
    pop[objIndex].tileId = tileId;
    pop[objIndex].prevTileId = prevTileId;
    drawTileDefaultUnit(movedUnitOldTileId);
};
// OPPONENT JOINS
socket.on('units_joined', function(data) {
    let allIds = ','+data.idsToDelete+',';
    let unitIndex = pop.findIndex((obj => obj.id == data.joinToId));
    pop[unitIndex].fatigue = data.fatigue;
    pop[unitIndex].number = data.totalUnits;
    pop.slice().reverse().forEach(function(unit) {
        if (allIds.includes(","+unit.id+",")) {
            unitIndex = pop.findIndex((obj => obj.id == unit.id));
            pop.splice(unitIndex,1);
        }
    });
});
// OPPONENT SPLITS
socket.on('unit_splited', function(data) {
    splitOnClientPop(data);
});
// PLAYER SPLITS
socket.on('my_unit_splited', function(data) {
    splitOnClientPop(data);
    showUnitInfos(selectedUnit.id);
    showTileInfos(selectedUnit.tileId,true);
    showTileUnitList(selectedUnit.tileId);
});
function splitOnClientPop(data) {
    let unitIndex = pop.findIndex((obj => obj.id == data.splitedUnitId));
    let newUnit = JSON.parse(JSON.stringify(pop[unitIndex]));
    newUnit.number = Number(data.splitValue);
    newUnit.id = Number(data.newId);
    pop.push(newUnit);
    pop[unitIndex].number = pop[unitIndex].number-data.splitValue;
}
// NEW TRACK
socket.on('track_added', function(data) {
    let newTrack = data;
    myTracks.push(newTrack);
    trackedTiles = trackedTiles+newTrack.tiles;
    selectedTrack = newTrack;
    showTracks = false;
    tracksViewButtonOff();
    showTrackedTiles();
    showTracksList(selectedTile.id);
});
