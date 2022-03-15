function neighbours() {
    if (playerInfos.cocons >= 1 && playerInfos.mapTurn < 75) {
        let vChance = Math.ceil((playerInfos.mapTurn-20)/15);
        // let vChance = Math.ceil((playerInfos.mapTurn)*30);
        if (rand.rand(1,100) <= vChance) {
            lesVoisins();
        }
    }
};

function lesVoisins() {
    lastNeiTileId = -1;
    // véhicule : Jeeps (avec Sapeurs), Cavaleries (e-road), Dumpers (e-road), Hostos (e-road)
    // Citoyens et Criminels
    // Mineurs, Sapeurs, Mulets, Infirmiers, Résistants
    // Busters, Mécanos, Scavengers, Genius
    let transVol = 0;
    let transChance = (playerInfos.mapDiff*3)+35;
    if (rand.rand(1,100) <= transChance) {
        let transDice = rand.rand(1,30);
        let transOK = false;
        if (transDice <= Math.ceil(playerInfos.mapDiff/1.5)) {
            // Jeeps
            let neiBatType = getBatTypeByName('Jeeps');
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
        } else if (transDice <= playerInfos.mapDiff+5) {
            // Jeeps
            let neiBatType = getBatTypeByName('Jeeps');
            transOK = true;
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
        } else if (transDice <= Math.ceil(playerInfos.mapDiff*1.5)+12) {
            // Cavaleries
            let neiBatType = getBatTypeByName('Cavaleries');
            transOK = true;
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
        } else if (transDice <= 28) {
            // Dumpers
            let neiBatType = getBatTypeByName('Dumpers');
            transOK = true;
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
        } else {
            // Hostos
            let neiBatType = getBatTypeByName('Hostos');
            transOK = true;
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
        }
        if (!transOK) {
            transDice = rand.rand(1,30);
            if (transDice <= 8) {
                // Jeeps
                let neiBatType = getBatTypeByName('Jeeps');
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
            } else if (transDice <= 16) {
                // Cavaleries
                let neiBatType = getBatTypeByName('Cavaleries');
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
            } else if (transDice <= 24) {
                // Dumpers
                let neiBatType = getBatTypeByName('Dumpers');
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
            } else {
                // Hostos
                let neiBatType = getBatTypeByName('Hostos');
                transOK = true;
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
            }
        }
    }
    // Piétons
    if (transVol === 0) {
        let pietonBatTypeId = checkPietonId();
        let neiBatType = getBatTypeById(pietonBatTypeId);
        putNeighbour(neiBatType);
        pietonBatTypeId = checkPietonId();
        neiBatType = getBatTypeById(pietonBatTypeId);
        putNeighbour(neiBatType);
        if (rand.rand(1,2) === 1) {
            pietonBatTypeId = checkPietonId();
            neiBatType = getBatTypeById(pietonBatTypeId);
            putNeighbour(neiBatType);
        }
        if (rand.rand(1,4) === 1) {
            pietonBatTypeId = checkPietonId();
            neiBatType = getBatTypeById(pietonBatTypeId);
            putNeighbour(neiBatType);
        }
    }
    // Véhicules
    if (rand.rand(1,3) === 1) {
        let vehBatTypeId = checkVehicleId();
        let neiBatType = getBatTypeById(vehBatTypeId);
        putNeighbour(neiBatType);
    }
    if (rand.rand(1,5) === 1) {
        let vehBatTypeId = checkVehicleId();
        let neiBatType = getBatTypeById(vehBatTypeId);
        putNeighbour(neiBatType);
    }
    if (lastNeiTileId >= 0) {
        warning('Convoi de survivants en vue','Attirés par le bruit, des survivants sont venus à votre rencontre.',false,lastNeiTileId);
        lastNeiTileId = -1;
    }
};

function putNeighbour(neiBatType) {
    let koTerrains = [];
    terrainTypes.forEach(function(ter) {
        if (neiBatType.maxFlood < ter.flood) {
            koTerrains.push(ter.name);
        }
        if (neiBatType.maxScarp < ter.scarp) {
            koTerrains.push(ter.name);
        }
        if (neiBatType.maxVeg < ter.veg) {
            koTerrains.push(ter.name);
        }
    });
    let vTileId = placeNeighbours(lastNeiTileId,koTerrains);
    let cit = 0;
    let xp = rand.rand(50,175);
    if (neiBatType.id === 126 || neiBatType.id === 225) {
        cit = rand.rand(6,12)*6;
        xp = 0;
    }
    conselUnit = neiBatType;
    conselPut = false;
    conselTriche = true;
    conselAmmos = checkNeighbourGear(neiBatType);
    putBat(vTileId,cit,xp,'outsider',false);
    let transBat = getBatByTileId(vTileId);
    lastNeiTileId = vTileId;
    let transVol = neiBatType.transUnits;
    if (transVol >= 180) {
        let pietonBatTypeId = checkPietonId(transBat);
        let cit = 0;
        if (pietonBatTypeId === 126 || pietonBatTypeId === 225) {
            cit = rand.rand(6,12)*6;
        }
        let neiBatType = getBatTypeById(pietonBatTypeId);
        putNeighbourIn(neiBatType,transBat,cit);
        let batVol = calcVolumeByType(neiBatType,cit);
        transVol = transVol-batVol;
    }
    if (transVol >= 180) {
        let pietonBatTypeId = checkPietonId(transBat);
        let cit = 0;
        if (pietonBatTypeId === 126 || pietonBatTypeId === 225) {
            cit = rand.rand(6,12)*6;
        }
        let neiBatType = getBatTypeById(pietonBatTypeId);
        putNeighbourIn(neiBatType,transBat,cit);
        let batVol = calcVolumeByType(neiBatType,cit);
        transVol = transVol-batVol;
    }
    if (transVol >= 180 && rand.rand(1,2) === 1) {
        let pietonBatTypeId = checkPietonId(transBat);
        let cit = 0;
        if (pietonBatTypeId === 126 || pietonBatTypeId === 225) {
            cit = rand.rand(6,12)*6;
        }
        let neiBatType = getBatTypeById(pietonBatTypeId);
        putNeighbourIn(neiBatType,transBat,cit);
        let batVol = calcVolumeByType(neiBatType,cit);
        transVol = transVol-batVol;
    }
    if (transVol >= 180 && rand.rand(1,2) === 1) {
        let pietonBatTypeId = checkPietonId(transBat);
        let cit = 0;
        if (pietonBatTypeId === 126 || pietonBatTypeId === 225) {
            cit = rand.rand(6,12)*6;
        }
        let neiBatType = getBatTypeById(pietonBatTypeId);
        putNeighbourIn(neiBatType,transBat,cit);
        let batVol = calcVolumeByType(neiBatType,cit);
        transVol = transVol-batVol;
    }
    if (transVol >= 180 && rand.rand(1,3) === 1) {
        let pietonBatTypeId = checkPietonId(transBat);
        let cit = 0;
        if (pietonBatTypeId === 126 || pietonBatTypeId === 225) {
            cit = rand.rand(6,12)*6;
        }
        let neiBatType = getBatTypeById(pietonBatTypeId);
        putNeighbourIn(neiBatType,transBat,cit);
        let batVol = calcVolumeByType(neiBatType,cit);
        transVol = transVol-batVol;
    }
    if (transVol >= 180 && rand.rand(1,3) === 1) {
        let pietonBatTypeId = checkPietonId(transBat);
        let cit = 0;
        if (pietonBatTypeId === 126 || pietonBatTypeId === 225) {
            cit = rand.rand(6,12)*6;
        }
        let neiBatType = getBatTypeById(pietonBatTypeId);
        putNeighbourIn(neiBatType,transBat,cit);
        let batVol = calcVolumeByType(neiBatType,cit);
        transVol = transVol-batVol;
    }
};

function putNeighbourIn(neiBatType,transBat,cit) {
    let koTerrains = [];
    let vTileId = placeNeighbours(lastNeiTileId,koTerrains);
    let xp = rand.rand(50,175);
    if (neiBatType.id === 126 || neiBatType.id === 225) {
        xp = 0;
    }
    conselUnit = neiBatType;
    conselPut = false;
    conselTriche = true;
    conselAmmos = checkNeighbourGear(neiBatType);
    putBat(vTileId,cit,xp,'outsider',false);
    let neiBat = getBatByTileId(vTileId);
    loadBat(neiBat.id,transBat.id);
};

function checkPietonId(transBat) {
    let inHosto = false;
    if (transBat != undefined) {
        if (transBat.name === 'Hostos') {
            inHosto = true;
        }
    }
    let pietonBatTypeId = -1;
    let pietonDice = rand.rand(1,24);
    if (pietonDice <= 2 && !inHosto) {
        let bt = getBatTypeByName('Résistants');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 3) {
        let bt = getBatTypeByName('Infirmiers');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 4) {
        let bt = getBatTypeByName('Mulets');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 5) {
        let bt = getBatTypeByName('Mineurs');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 7) {
        let bt = getBatTypeByName('Sapeurs');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 9 && !inHosto) {
        let bt = getBatTypeByName('Criminels');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 12 && inHosto) {
        let bt = getBatTypeByName('Infirmiers');
        pietonBatTypeId = bt.id;
    } else {
        let bt = getBatTypeByName('Citoyens');
        pietonBatTypeId = bt.id;
    }
    return pietonBatTypeId;
};

function checkVehicleId() {
    let vehBatTypeId = -1;
    let vehDice = rand.rand(1,12);
    if (vehDice <= 2) {
        let bt = getBatTypeByName('Busters');
        vehBatTypeId = bt.id;
    } else if (vehDice <= 5) {
        let bt = getBatTypeByName('Genius');
        vehBatTypeId = bt.id;
    } else if (vehDice <= 8) {
        let bt = getBatTypeByName('Scavengers');
        vehBatTypeId = bt.id;
    } else {
        let bt = getBatTypeByName('Mécanos');
        vehBatTypeId = bt.id;
    }
    return vehBatTypeId;
};

function checkNeighbourGear(neiBatType) {
    let gear = ['xxx','xxx','xxx','xxx'];
    if (neiBatType.name === 'Jeeps') {
        gear = ['tungsten','belier-spike','kanchan','waterproof'];
    }
    if (neiBatType.name === 'Cavaleries') {
        gear = ['perfo','standard','scrap','e-road'];
    }
    if (neiBatType.name === 'Dumpers') {
        gear = ['sm-hollow','standard','scrap','e-road'];
    }
    if (neiBatType.name === 'Hostos') {
        gear = ['sm-hollow','belier-spike','kanchan','e-road'];
    }
    if (neiBatType.name === 'Busters') {
        gear = ['obus','belier-spike','kanchan','snorkel'];
    }
    if (neiBatType.name === 'Mécanos') {
        gear = ['perfo','standard','scrap','snorkel'];
    }
    if (neiBatType.name === 'Scavengers') {
        gear = ['perfo','standard','kanchan','e-road'];
    }
    if (neiBatType.name === 'Genius') {
        gear = ['tungsten','standard','chobham','snorkel'];
    }
    if (neiBatType.name === 'Mineurs') {
        gear = ['standard','lame-tungsten','scrap','e-road'];
    }
    if (neiBatType.name === 'Sapeurs') {
        gear = ['perfo','lame','kevlar','aucun'];
    }
    if (neiBatType.name === 'Mulets') {
        gear = ['perfo','grenade','kevlar','e-road'];
    }
    if (neiBatType.name === 'Infirmiers') {
        gear = ['scrap','standard','scrap','aucun'];
    }
    if (neiBatType.name === 'Résistants') {
        gear = ['pn-perfo','grenade','kevlar','chargeur1'];
    }
    return gear;
};

function placeNeighbours(nearTileId,koTerrains) {
    // un tile en bord de carte pour un voisin
    // nearTileId = tile d'un autre voisin tiré avant
    alienOccupiedTileList();
    playerOccupiedTileList();
    let vTileId = -1;
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (vTileId < 0) {
            if (nearTileId >= 0) {
                if (tile.x <= 2 || tile.x >= 59 || tile.y <= 2 || tile.y >= 59) {
                    if (!koTerrains.includes(tile.terrain) || tile.rd) {
                        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                            let distance = calcDistance(nearTileId,tile.id);
                            if (distance <= 3) {
                                vTileId = tile.id;
                            }
                        }
                    }
                }
            } else {
                if (tile.x === 1 || tile.x === 60 || tile.y === 1 || tile.y === 60) {
                    if (!koTerrains.includes(tile.terrain) || tile.rd) {
                        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                            vTileId = tile.id;
                        }
                    }
                }
            }
        }
    });
    return vTileId;
};
