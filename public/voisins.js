function neiTest() {
    let average = 0;
    let all = 0;
    let under60 = 0;
    let under50 = 0;
    let under35 = 0;
    let under25 = 0;
    let noNei = 0;
    let i = 1;
    while (i <= 100000) {
        let check = rand.rand(5,87);
        if (check < 20) {
            check = check+20;
        }
        let reCheck = rand.rand(5,87);
        if (reCheck < 20) {
            reCheck = reCheck+20;
        }
        let theCheck = check;
        if (reCheck > check) {
            theCheck = reCheck;
        }
        if (theCheck > 70) {
            noNei++;
        } else {
            average = average+theCheck;
            all++;
        }
        if (theCheck <= 60) {
            under60++;
        }
        if (theCheck <= 50) {
            under50++;
        }
        if (theCheck <= 35) {
            under35++;
        }
        if (theCheck <= 25) {
            under25++;
        }
        if (i > 100000) {break;}
        i++
    }
    average = Math.round(average/all);
    under60 = Math.round(under60/1000);
    under50 = Math.round(under50/1000);
    under35 = Math.round(under35/1000);
    under25 = Math.round(under25/1000);
    noNei = Math.round(noNei/1000);
    let under70 = 100-noNei;
    warning('Convoi','Moyenne: '+average+'<br>Avant 25: '+under25+'%<br>Avant 35: '+under35+'%<br>Avant 50: '+under50+'%<br>Avant 60: '+under60+'%<br>Avant 70: '+under70+'%<br>Aucun: '+noNei+'%',false,lastNeiTileId);
};

function checkNeiTurn() {
    if (playerInfos.vz === 0 && !playerInfos.onShip) {
        let check = rand.rand(5,87);
        if (check < 20) {
            check = check+20;
        }
        let reCheck = rand.rand(5,87);
        if (reCheck < 20) {
            reCheck = reCheck+20;
        }
        let theCheck = check;
        if (reCheck > check) {
            theCheck = reCheck;
        }
        if (theCheck > 70) {
            theCheck = 999;
        }
        playerInfos.vz = theCheck;
    }
};

function neighbours() {
    if (playerInfos.vz <= playerInfos.mapTurn) {
        lesVoisins();
    }
};

function lesVoisins() {
    playerInfos.vz = 999;
    neiRoad = [false,false];
    lastNeiTileId = -1;
    // véhicule : Jeeps (avec Sapeurs), Cavaleries (e-road), Dumpers (e-road), Hostos (e-road)
    // Citoyens et Criminels
    // Mineurs, Sapeurs, Mulets, Infirmiers, Résistants
    // Busters, Mécanos, Scavengers, Genius
    let transVol = 0;
    let transOK = false;
    let transDice = 0;
    let transChance = (playerInfos.mapDiff*3)+15;
    if (rand.rand(1,100) <= transChance) {
        transDice = rand.rand(1,26);
        if (transDice <= 4) {
            let neiBatType = getBatTypeByName('Jeeps');
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
        } else if (transDice <= 8) {
            let neiBatType = getBatTypeByName('Cavaleries');
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
            neiRoad = [true,true];
        } else if (transDice <= 14) {
            let neiBatType = getBatTypeByName('Tacots');
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
            neiRoad = [true,true];
        } else if (transDice <= 16) {
            let neiBatType = getBatTypeByName('Spycars');
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
            neiRoad = [true,true];
        } else if (transDice <= 18) {
            let neiBatType = getBatTypeByName('Frogs');
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
            neiRoad = [true,true];
        } else if (transDice <= 23) {
            let neiBatType = getBatTypeByName('Dumpers');
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
            neiRoad = [true,true];
        } else {
            let neiBatType = getBatTypeByName('Hostos');
            transOK = true;
            transVol = transVol+neiBatType.transUnits;
            putNeighbour(neiBatType);
            neiRoad = [true,true];
        }
        if (rand.rand(1,10) === 1) {
            transDice = rand.rand(1,26);
            if (transDice <= 4) {
                let neiBatType = getBatTypeByName('Jeeps');
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
            } else if (transDice <= 8) {
                let neiBatType = getBatTypeByName('Cavaleries');
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
                neiRoad = [true,true];
            } else if (transDice <= 14) {
                let neiBatType = getBatTypeByName('Tacots');
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
                neiRoad = [true,true];
            } else if (transDice <= 16) {
                let neiBatType = getBatTypeByName('Spycars');
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
                neiRoad = [true,true];
            } else if (transDice <= 18) {
                let neiBatType = getBatTypeByName('Frogs');
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
                neiRoad = [true,true];
            } else if (transDice <= 23) {
                let neiBatType = getBatTypeByName('Dumpers');
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
                neiRoad = [true,true];
            } else {
                let neiBatType = getBatTypeByName('Hostos');
                transOK = true;
                transVol = transVol+neiBatType.transUnits;
                putNeighbour(neiBatType);
                neiRoad = [true,true];
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
        if (rand.rand(1,3) === 1) {
            pietonBatTypeId = checkPietonId();
            neiBatType = getBatTypeById(pietonBatTypeId);
            putNeighbour(neiBatType);
        }
        if (rand.rand(1,5) === 1) {
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
    if (rand.rand(1,6) === 1) {
        let vehBatTypeId = checkVehicleId();
        let neiBatType = getBatTypeById(vehBatTypeId);
        putNeighbour(neiBatType);
    }
    if (lastNeiTileId >= 0) {
        warning('Convoi de survivants en vue','Attirés par le bruit, des survivants sont venus à votre rencontre.',false,lastNeiTileId);
        lastNeiTileId = -1;
    }
    if (neiRoad[0] && !neiRoad[1]) {
        let neiBatType = getBatTypeById(112);
        putNeighbour(neiBatType);
    }
    neiRoad = [true,false];
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
    if (vTileId >= 0) {
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
        if (transVol >= 180 && rand.rand(1,4) === 1) {
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
        if (transVol >= 180 && rand.rand(1,5) === 1) {
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
    }
};

function putNeighbourIn(neiBatType,transBat,cit) {
    let koTerrains = [];
    let vTileId = placeNeighbours(lastNeiTileId,koTerrains);
    if (vTileId >= 0) {
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
    }
};

function checkPietonId(transBat) {
    let inHosto = false;
    if (transBat != undefined) {
        if (transBat.name === 'Hostos') {
            inHosto = true;
        }
    }
    let pietonBatTypeId = -1;
    let pietonDice = rand.rand(1,26);
    if (pietonDice <= 2 && !inHosto) {
        let bt = getBatTypeByName('Résistants');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 3) {
        let bt = getBatTypeByName('Infirmiers');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 10) {
        let bt = getBatTypeByName('Survivants');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 11) {
        let bt = getBatTypeByName('Mulets');
        pietonBatTypeId = bt.id;
        neiRoad[1] = true;
    } else if (pietonDice <= 12) {
        let bt = getBatTypeByName('Mineurs');
        pietonBatTypeId = bt.id;
        neiRoad[1] = true;
    } else if (pietonDice <= 14) {
        let bt = getBatTypeByName('Sapeurs');
        pietonBatTypeId = bt.id;
        neiRoad[1] = true;
    } else if (pietonDice <= 16 && !inHosto) {
        let bt = getBatTypeByName('Criminels');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 21 && inHosto) {
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
    let vehDice = rand.rand(1,16);
    if (vehDice <= 1) {
        let bt = getBatTypeByName('Busters');
        vehBatTypeId = bt.id;
        neiRoad[0] = true;
    } else if (vehDice <= 3) {
        let bt = getBatTypeByName('Genius');
        vehBatTypeId = bt.id;
        neiRoad = [true,true];
    } else if (vehDice <= 6) {
        let bt = getBatTypeByName('Scavengers');
        vehBatTypeId = bt.id;
        neiRoad = [true,true];
    } else if (vehDice <= 10) {
        let bt = getBatTypeByName('Mécanos');
        vehBatTypeId = bt.id;
        neiRoad[0] = true;
    } else if (vehDice <= 12) {
        let bt = getBatTypeByName('Looters');
        vehBatTypeId = bt.id;
    } else if (vehDice <= 13) {
        let bt = getBatTypeByName('Workships');
        vehBatTypeId = bt.id;
        neiRoad = [true,true];
    } else {
        let bt = getBatTypeByName('Pushers');
        vehBatTypeId = bt.id;
        neiRoad = [true,true];
    }
    return vehBatTypeId;
};

function checkNeighbourGear(neiBatType) {
    let gear = ['xxx','xxx','xxx','xxx'];
    if (neiBatType.name === 'Jeeps') {
        gear = ['tungsten','belier-spike','kanchan','aucun'];
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
    if (neiBatType.name === 'Looters') {
        gear = ['standard','standard','scrap','aucun'];
    }
    if (neiBatType.name === 'Workships') {
        gear = ['perfo','standard','kanchan','e-treuil'];
    }
    if (neiBatType.name === 'Pushers') {
        gear = ['standard','standard','scrap','e-road'];
    }
    if (neiBatType.name === 'Spycars') {
        gear = ['fleche','gaz','scrap','e-road'];
    }
    if (neiBatType.name === 'Frogs') {
        gear = ['perfo','grenade','kanchan','e-road'];
    }
    if (neiBatType.name === 'Tacots') {
        gear = ['standard','standard','scrap','e-road'];
    }
    if (neiBatType.name === 'Survivants') {
        gear = ['standard','lame','scrap','aucun'];
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
                    if (tile.terrain != 'W' && tile.terrain != 'L' && tile.terrain != 'R') {
                        if (!koTerrains.includes(tile.terrain) || tile.rd) {
                            if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                                let distance = calcDistance(nearTileId,tile.id);
                                if (distance <= 1) {
                                    vTileId = tile.id;
                                }
                            }
                        }
                    }
                }
            } else {
                if (tile.x === 1 || tile.x === 60 || tile.y === 1 || tile.y === 60) {
                    if (tile.terrain != 'W' && tile.terrain != 'L' && tile.terrain != 'R') {
                        if (!koTerrains.includes(tile.terrain) || tile.rd) {
                            if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                                vTileId = tile.id;
                            }
                        }
                    }
                }
            }
        }
    });
    if (vTileId < 0) {
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
    }
    return vTileId;
};
