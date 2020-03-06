function showTileInfos(tileId) {
    $('#tileInfos').empty();
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    $('#tileInfos').append('<span class="blockTitle"><h3>'+terrainTypes[terrainIndex].fullName+'</h3></span>');
};
