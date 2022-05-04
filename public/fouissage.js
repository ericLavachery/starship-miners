function fouissage() {
    if (selectedBatType.skills.includes('fouisseur') && !selectedBat.tags.includes('freeze') && !selectedBat.tags.includes('stun')) {
        let jumpOK = false;
        let pdmDistance = calcDistance(pointDeMire,selectedBat.tileId);
        if (pdmDistance >= 4) {
            jumpOK = checkStartGal();
            if (jumpOK) {
                let endGalId = findEndGal();
                if (endGalId >= 0) {
                    let distance = calcDistance(selectedBat.tileId,endGalId);
                    selectedBat.apLeft = selectedBat.apLeft-Math.round(distance*1.5);
                    selectedBat.tileId = checkOutTile(endGalId);
                    tileSelect(selectedBat);
                    showAlien(selectedBat);
                    selectedBatArrayUpdate();
                }
            }
        }
    }
};

function checkOutTile(endGalId) {
    let outTileId = endGalId;
    let bestDistance = 100;
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        let distance = calcDistance(tile.id,endGalId);
        if (distance <= 1 && tile.id != endGalId) {
            if (!playerOccupiedTiles.includes(tile.id) && !alienOccupiedTiles.includes(tile.id)) {
                let pdmDistance = calcDistance(pointDeMire,tile.id);
                if (pdmDistance < bestDistance) {
                    bestDistance = pdmDistance;
                    outTileId = tile.id;
                }
            }
        }
    });
    return outTileId;
};

function checkStartGal() {
    let jumpOK = false;
    playerOccupiedTileList();
    if (rand.rand(1,2) === 1 && selectedBat.apLeft >= 1) {
        let batTile = getTile(selectedBat);
        if (batTile.infra != undefined) {
            if (batTile.infra === 'Terriers') {
                jumpOK = true;
            }
        }
        // rien en dessous, cherche à 2 cases
        if (!jumpOK) {
            let shufZone = _.shuffle(zone);
            shufZone.forEach(function(tile) {
                if (tile.infra != undefined) {
                    if (tile.infra === 'Terriers') {
                        if (!playerOccupiedTiles.includes(tile.id)) {
                            let distance = calcDistance(selectedBat.tileId,tile.id);
                            if (distance <= 2) {
                                jumpOK = true;
                            }
                        }
                    }
                }
            });
        }
        // rien à 2 cases, cherche à 4 cases
        if (!jumpOK && rand.rand(1,2) === 1 && selectedBat.apLeft >= 4) {
            let shufZone = _.shuffle(zone);
            shufZone.forEach(function(tile) {
                if (tile.infra != undefined) {
                    if (tile.infra === 'Terriers') {
                        if (!playerOccupiedTiles.includes(tile.id)) {
                            let distance = calcDistance(selectedBat.tileId,tile.id);
                            if (distance <= 4) {
                                jumpOK = true;
                            }
                        }
                    }
                }
            });
        }
        // rien à 4 cases, creuse
        if (!jumpOK && rand.rand(1,2) === 1 && selectedBat.apLeft >= 4) {
            if (batTile.terrain != 'R' && batTile.terrain != 'W' && batTile.terrain != 'L' && batTile.terrain != 'M') {
                if (batTile.ruins === undefined) {
                    putTerrier(batTile);
                    jumpOK = true;
                }
            }
        }
    }
    return jumpOK;
};

function findEndGal() {
    let endGalId = -1;
    alienOccupiedTileList();
    let bestDistance = 100;
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (tile.infra != undefined) {
            if (tile.infra === 'Terriers') {
                if (!playerOccupiedTiles.includes(tile.id) && !alienOccupiedTiles.includes(tile.id)) {
                    let distance = calcDistance(selectedBat.tileId,tile.id);
                    if (distance <= 9) {
                        let pdmTerDist = calcDistance(pointDeMire,tile.id);
                        let pdmBatDist = calcDistance(pointDeMire,selectedBat.tileId);
                        if (pdmBatDist-3 > pdmTerDist) {
                            if (pdmTerDist < bestDistance) {
                                bestDistance = pdmTerDist;
                                endGalId = tile.id;
                            }
                        }
                    }
                }
            }
        }
    });
    if (endGalId < 0) {
        shufZone.forEach(function(tile) {
            if (!playerOccupiedTiles.includes(tile.id) && !alienOccupiedTiles.includes(tile.id)) {
                if (tile.terrain != 'R' && tile.terrain != 'W' && tile.terrain != 'L' && tile.terrain != 'M') {
                    if (tile.ruins === undefined) {
                        let distance = calcDistance(selectedBat.tileId,tile.id);
                        if (distance <= 7) {
                            let pdmDistance = calcDistance(pointDeMire,tile.id);
                            if (pdmDistance < bestDistance) {
                                bestDistance = pdmDistance;
                                endGalId = tile.id;
                            }
                        }
                    }
                }
            }
        });
        if (endGalId >= 0) {
            let terTile = getTileById(endGalId);
            putTerrier(terTile);
        }
    }
    return endGalId;
};

function putTerrier(tile) {
    tile.infra = 'Terriers';
    selectedBat.apLeft = selectedBat.apLeft-3;
    selectedBat.salvoLeft = 0;
};
