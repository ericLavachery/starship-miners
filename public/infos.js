function showTileInfos(tileId) {
    $('#tileInfos').empty();
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    $('#tileInfos').append('<span class="blockTitle"><h3>'+terrainTypes[terrainIndex].fullName+'</h3></span>');
};

function showBatInfos(bat) {
    $('#unitInfos').empty();
    let unitTypesIndex = unitTypes.findIndex((obj => obj.name == bat.type));
    let batUnitType = unitTypes[unitTypesIndex];
    $('#unitInfos').append('<span class="blockTitle"><h3>'+batUnitType.name+'</h3></span>');
};
