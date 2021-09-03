function encounter() {
    let encDice = rand.rand(0,28);
    if (encDice === 0 || encDice === 1 || encDice === 2 || encDice === 3 || encDice === 4) {
        baseDeResistants();
    } else if (encDice === 5 || encDice === 6) {
        // HLL
    } else if (encDice === 7) {
        // Robots
    } else if (encDice === 8) {
        // Scientifiques
    } else if (encDice === 9 || encDice === 10) {
        // Colons
    } else if (encDice === 11 || encDice === 12) {
        // Industrie
    } else if (encDice === 13) {
        // Piège
    } else if (encDice === 14) {
        // Flaque de colonie
    } else {
        madCitizens();
    }
};

function madCitizens() {
    console.log('CITOYENS ERRANTS');
    let centreTileId = checkEncounterTile();
    if (centreTileId >= 0) {
        // CITOYENS
        let dropTile;
        let numCit = rand.rand(1,8)*6;
        let citId = 126;
        if (rand.rand(1,ruinsCrimChance) === 1) {
            citId = 225;
        }
        let unitIndex = unitTypes.findIndex((obj => obj.id == citId));
        conselUnit = unitTypes[unitIndex];
        conselAmmos = ['lame-scrap','xxx','aucune','aucun'];
        conselPut = false;
        conselTriche = true;
        putBat(centreTileId,numCit,0,'',false);
        playerOccupiedTiles.push(centreTileId);
        // CITOYENS
        if (rand.rand(1,4) === 1) {
            numCit = rand.rand(1,8)*6;
            dropTile = checkDropSafe(centreTileId);
            unitIndex = unitTypes.findIndex((obj => obj.id == citId));
            conselUnit = unitTypes[unitIndex];
            conselAmmos = ['lame-scrap','xxx','aucune','aucun'];
            conselPut = false;
            conselTriche = true;
            putBat(dropTile,numCit,0,'',false);
            playerOccupiedTiles.push(dropTile);
        }
    } else {
        console.log('No good tile!');
    }
};

function baseDeResistants() {
    console.log('BASTION DE RESISTANTS');
    let centreTileId = checkEncounterTile();
    if (centreTileId >= 0) {
        putBastionUnits(centreTileId);
        bastionRes(centreTileId);
        bastionRes(centreTileId);
        bastionRes(centreTileId);
        putBastionAliens();
    } else {
        console.log('No good tile!');
    }
};

function putBastionAliens() {
    dropEgg('Ruche','bastion');
    dropEgg('Cocon','bastion');
    if (zone[0].mapDiff >= rand.rand(5,15)) {
        dropEgg('Ruche','bastion');
    }
    let numVeil = rand.rand(1,3);
    for (var i = 0; i < numVeil; i++){
        dropEgg('Veilleurs','bastion');
    }
}

function putBastionUnits(centreTileId) {
    zone[centreTileId].rd = true;
    addRoad(centreTileId);
    // BASTION
    let dropTile;
    let numUnits = 1;
    let totalUnits = 1;
    let unitIndex = unitTypes.findIndex((obj => obj.id == 262));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = ['perfo','standard','acier','aucun'];
    conselTriche = true;
    putBat(centreTileId,0,rand.rand(50,175),'',false);
    playerOccupiedTiles.push(centreTileId);
    // TRANSPORT
    if (zone[0].mapDiff >= rand.rand(3,15)) {
        numUnits = 1;
        // Tacots
        let unitId = 140;
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['sm-perfo','standard','scrap','aucun'];
        let transDice = rand.rand(1,5);
        if (transDice === 1) {
            // Spycars
            unitId = 182;
            conselAmmos = ['fleche','standard','scrap','arbalourde'];
        } else if (transDice === 2) {
            // Jeeps
            unitId = 141;
            conselAmmos = ['perfo','standard','scrap','aucun'];
        } else if (transDice === 3) {
            // Looters
            unitId = 128;
            conselAmmos = ['sm-perfo','standard','scrap','silencieux1'];
        }
        dropTile = checkDropSafe(centreTileId);
        unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
        conselUnit = unitTypes[unitIndex];
        putBat(dropTile,0,rand.rand(25,100),'',false);
        playerOccupiedTiles.push(dropTile);
    }
    // AUTRE VEHICULE
    if (zone[0].mapDiff >= rand.rand(5,25)) {
        numUnits = 1;
        // Scavengers
        let unitId = 173;
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['perfo','standard','scrap','snorkel'];
        let vehicDice = rand.rand(1,9);
        if (vehicDice === 1 || vehicDice === 2) {
            // Mécanos
            unitId = 167;
            conselAmmos = ['fleche','standard','scrap','arbalourde'];
        } else if (vehicDice === 3 && zone[0].mapDiff >= 6) {
            // Scouts
            unitId = 1;
            conselAmmos = ['perfo','standard','scrap','e-treuil'];
        } else if (vehicDice === 4 && zone[0].mapDiff >= 6) {
            // Genius
            unitId = 101;
            conselAmmos = ['perfo','standard','scrap','belier'];
        } else if (vehicDice === 5 && zone[0].mapDiff >= 7) {
            // Busters
            unitId = 139;
            conselAmmos = ['obus','belier-spike','scrap','aucun'];
        } else if (vehicDice === 6 && zone[0].mapDiff >= 7) {
            // Drilltrucks
            unitId = 119;
            conselAmmos = ['perfo','standard','scrap','belier'];
        }
        dropTile = checkDropSafe(centreTileId);
        unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
        conselUnit = unitTypes[unitIndex];
        putBat(dropTile,0,rand.rand(25,100),'',false);
        playerOccupiedTiles.push(dropTile);
    }
    // RETRANCHEMENTS
    numUnits = rand.rand(0,2);
    totalUnits = totalUnits+numUnits;
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        unitIndex = unitTypes.findIndex((obj => obj.id == 263));
        conselUnit = unitTypes[unitIndex];
        conselPut = false;
        conselAmmos = ['perfo','perfo','acier','silencieux2'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(50,175),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
        if (rand.rand(1,2) === 1) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
    }
    // SAPEURS
    numUnits = rand.rand(0,1);
    totalUnits = totalUnits+numUnits;
    if (numUnits > 0) {
        dropTile = checkDropSafe(centreTileId);
        unitIndex = unitTypes.findIndex((obj => obj.id == 112));
        conselUnit = unitTypes[unitIndex];
        conselPut = false;
        conselAmmos = ['perfo','lame','scrap','silencieux1'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
        if (rand.rand(1,4) === 1) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
    }
    // INFIRMIERS
    numUnits = rand.rand(0,1);
    if (numUnits > 0) {
        dropTile = checkDropSafe(centreTileId);
        unitIndex = unitTypes.findIndex((obj => obj.id == 148));
        conselUnit = unitTypes[unitIndex];
        conselPut = false;
        conselAmmos = ['sm-perfo','perfo','scrap','e-camo'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
    }
    // MULETS
    if (rand.rand(1,4) === 1) {
        numUnits = 1;
        totalUnits = totalUnits+numUnits;
        dropTile = checkDropSafe(centreTileId);
        unitIndex = unitTypes.findIndex((obj => obj.id == 27));
        conselUnit = unitTypes[unitIndex];
        conselPut = false;
        conselAmmos = ['perfo','grenade','scrap','e-camo'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
        if (rand.rand(1,4) === 1) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
    }
    // MINEURS
    if (rand.rand(1,4) === 1) {
        numUnits = 1;
        totalUnits = totalUnits+numUnits;
        dropTile = checkDropSafe(centreTileId);
        unitIndex = unitTypes.findIndex((obj => obj.id == 28));
        conselUnit = unitTypes[unitIndex];
        conselPut = false;
        conselAmmos = ['perfo','lame','scrap','aucun'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
    }
    // RESISTANTS
    let maxUnits = Math.ceil(zone[0].mapDiff/2)+2;
    numUnits = rand.rand(2,maxUnits)-totalUnits;
    if (numUnits < 1) {numUnits = 1;}
    totalUnits = totalUnits+numUnits;
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        unitIndex = unitTypes.findIndex((obj => obj.id == 261));
        conselUnit = unitTypes[unitIndex];
        conselPut = false;
        conselAmmos = ['pn-perfo','grenade','scrap','silencieux1'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(50,175),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
        if (rand.rand(1,4) === 1) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
    }
    // CHAMPS DE MINES
    if (rand.rand(1,4) === 1) {
        let maxMines = Math.round(zone[0].mapDiff/3)+1
        numUnits = rand.rand(1,maxMines);
        dropTile = checkDropSafe(centreTileId);
        unitIndex = unitTypes.findIndex((obj => obj.id == 43));
        conselUnit = unitTypes[unitIndex];
        conselPut = false;
        conselAmmos = ['mine','suicide','aucun','aucun'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'',false);
        playerOccupiedTiles.push(dropTile);
    }
}

function bastionRes(bastionTileId) {
    let coffre = getBatByTileId(bastionTileId);
    let totalRes = 0;
    let thatResChance = 0;
    let thatResNum = 0;
    let mapFactor = Math.round(((Math.sqrt(zone[0].mapDiff+2)*10)+zone[0].mapDiff)/8);
    let resFactor;
    resTypes.forEach(function(res) {
        if (res.name != 'Magma' && res.cat != 'alien') {
            thatResChance = 0;
            thatResNum = 0;
            resFactor = res.rarity+Math.round(zone[0].mapDiff*3);
            if (res.name == 'Nourriture') {
                thatResChance = Math.ceil(resFactor*6*res.batch/3);
            } else if (res.name.includes('Compo')) {
                thatResChance = Math.ceil((resFactor-100)*1.7*res.batch/3);
            } else if (res.cat == 'transfo') {
                if (res.name != 'Transorb' && res.name != 'Energie' && res.name != 'Energons') {
                    thatResChance = Math.ceil(resFactor*1.7*res.batch/3);
                }
            } else {
                if (res.name === 'Huile') {
                    thatResChance = Math.ceil(150*res.batch/3);
                } else if (res.name === 'Eau') {
                    thatResChance = Math.ceil(400*res.batch/3);
                } else {
                    thatResChance = Math.ceil(resFactor/3*res.batch/3);
                }
                if (res.cat === 'blue') {
                    thatResChance = Math.ceil(thatResChance/2*mapFactor/4);
                } else if (res.cat === 'blue-sky') {
                    thatResChance = Math.ceil(thatResChance/1.5*mapFactor/4);
                } else if (res.cat === 'sky') {
                    thatResChance = Math.ceil(thatResChance/2*mapFactor/4);
                }
            }
            if (res.planets != undefined) {
                let planetName = zone[0].planet;
                thatResChance = Math.ceil(thatResChance*res.planets[planetName]);
            }
            console.log(res.name+' '+thatResChance);
            if (rand.rand(1,500) <= thatResChance) {
                thatResNum = Math.ceil(Math.sqrt(Math.sqrt(thatResChance))*mapFactor*1.5*rand.rand(4,16))+rand.rand(0,9);
                thatResNum = Math.ceil(thatResNum*150/mineRateDiv);
                console.log('!GET : '+res.name+' '+thatResNum);
                if (coffre.transRes[res.name] === undefined) {
                    coffre.transRes[res.name] = thatResNum;
                } else {
                    coffre.transRes[res.name] = coffre.transRes[res.name]+thatResNum;
                }
                totalRes = totalRes+thatResNum;
            }
        }
    });
};

function checkEncounterTile() {
    let centreTileId = -1;
    alienOccupiedTileList();
    playerOccupiedTileList();
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (centreTileId < 0) {
            if ((tile.x === 55 && tile.y >= 6 && tile.y <= 55) || (tile.x === 6 && tile.y >= 6 && tile.y <= 55) || (tile.y === 6 && tile.x >= 6 && tile.x <= 55) || (tile.y === 55 && tile.x >= 6 && tile.x <= 55)) {
                if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                    if (tile.terrain != 'W' && tile.terrain != 'R') {
                        centreTileId = tile.id;
                    }
                }
            }
        }
    });
    if (centreTileId < 0) {
        shufZone.forEach(function(tile) {
            if (centreTileId < 0) {
                if ((tile.x === 54 && tile.y >= 6 && tile.y <= 55) || (tile.x === 7 && tile.y >= 6 && tile.y <= 55) || (tile.y === 7 && tile.x >= 6 && tile.x <= 55) || (tile.y === 54 && tile.x >= 6 && tile.x <= 55)) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        if (tile.terrain != 'W' && tile.terrain != 'R') {
                            centreTileId = tile.id;
                        }
                    }
                }
            }
        });
    }
    return centreTileId;
}
