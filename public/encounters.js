function encounter() {
    let hard = false;
    let encDice;
    let encDiceMax = 28;
    if (zone[0].mapDiff < 5) {
        encDiceMax = encDiceMax-5;
    }
    if (rand.rand(1,2) === 1 || zone[0].mapDiff >= 8) {
        hard = true;
        playerInfos.fndCits = playerInfos.fndCits+3;
        encDice = rand.rand(0,encDiceMax);
    } else {
        encDice = rand.rand(2,encDiceMax);
    }
    if (encDice === 0 || encDice === 1 || encDice === 2 || encDice === 3) {
        baseDeResistants(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
    } else if (encDice === 4 || encDice === 5 || encDice === 6) {
        bastionDeBrigands(hard);
        playerInfos.fndCits = playerInfos.fndCits+2;
    } else if (encDice === 7 || encDice === 8) {
        baseLabo(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
    } else if (encDice === 9 || encDice === 10) {
        campDeColons(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
    } else if (encDice === 11 || encDice === 12) {
        zoneIndustrielle(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
    } else if (encDice === 13) {
        // Piège alien
        tooLate(hard);
    } else if (encDice === 14 || encDice === 15 || encDice === 16 || encDice === 17) {
        tooLate(hard);
    } else {
        madCitizens(hard);
    }
};

function putBastionAliens(hard) {
    dropEgg('Ruche','encounter');
    coconStats.volc = true;
    if (zone[0].mapDiff >= 3 && zone[0].mapDiff < 8 && zone[0].planet === 'Dom') {
        dropEgg('Ruche','encounter');
    }
    if (hard) {
        dropEgg('Cocon','encounter');
        if (zone[0].mapDiff < 8) {
            dropEgg('Ruche','encounter');
            if (zone[0].mapDiff >= 5 || rand.rand(1,3) === 1) {
                dropEgg('Cocon','encounter');
            } else {
                dropEgg('Ruche','encounter');
            }
        }
    } else {
        dropEgg('Veilleurs','encounter');
    }
    let numVeil = rand.rand(1,3);
    if (zone[0].planet != 'Dom') {
        numVeil = 1;
    }
    for (var i = 0; i < numVeil; i++){
        dropEgg('Veilleurs','encounter');
    }
}

function madCitizens(hard) {
    console.log('CITOYENS ERRANTS');
    let centreTileId = checkEncounterTile();
    warning('Citoyens errants en vue!','',false,encounterTileId);
    if (centreTileId >= 0) {
        // CITOYENS
        let dropTile;
        let citDice = 6-Math.floor(zone[0].mapDiff/3);
        if (hard) {
            citDice = citDice-2;
        }
        let maxCit = Math.floor(zone[0].mapDiff/1.25)+4;
        let minCit = Math.floor(zone[0].mapDiff/3)+1;
        let numCit = rand.rand(minCit,maxCit)*6;
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
        if (rand.rand(1,citDice) === 1) {
            citId = 126;
            if (zone[0].mapDiff < 5) {
                if (rand.rand(1,ruinsCrimChance) === 1) {
                    citId = 225;
                }
            }
            numCit = rand.rand(minCit,maxCit)*6;
            dropTile = checkDropSafe(centreTileId);
            unitIndex = unitTypes.findIndex((obj => obj.id == citId));
            conselUnit = unitTypes[unitIndex];
            conselAmmos = ['lame-scrap','xxx','aucune','aucun'];
            conselPut = false;
            conselTriche = true;
            putBat(dropTile,numCit,0,'',false);
            playerOccupiedTiles.push(dropTile);
        }
        // CITOYENS
        if (rand.rand(1,citDice) === 1 && zone[0].mapDiff >= 5) {
            citId = 126;
            numCit = rand.rand(minCit,maxCit)*6;
            dropTile = checkDropSafe(centreTileId);
            unitIndex = unitTypes.findIndex((obj => obj.id == citId));
            conselUnit = unitTypes[unitIndex];
            conselAmmos = ['lame-scrap','xxx','aucune','aucun'];
            conselPut = false;
            conselTriche = true;
            putBat(dropTile,numCit,0,'',false);
            playerOccupiedTiles.push(dropTile);
        }
        if (hard) {
            dropEgg('Veilleurs','encounter');
        }
    } else {
        console.log('No good tile!');
    }
};

function tooLate(hard) {
    console.log('TROP TARD');
    let centreTileId = checkEncounterTile();
    warning('Restes d\'une base en vue!','',false,encounterTileId);
    if (centreTileId >= 0) {
        // Silo
        conselUnit = getBatTypeById(158);
        conselAmmos = ['xxx','xxx','aucun','aucun'];
        conselPut = false;
        conselTriche = true;
        putBat(centreTileId,0,0,'nomove',false);
        playerOccupiedTiles.push(centreTileId);
        let bastion = getBatByTileId(centreTileId);
        bastion.damage = rand.rand(1,50);
        bastion.squadsLeft = rand.rand(2,5);
        bastion.tags.push('camo');
        bastion.fuzz = -2;
        bastionRes(centreTileId);
        if (hard) {
            if (rand.rand(1,4) === 1) {
                pactole(centreTileId,true);
            } else {
                bastionRes(centreTileId);
            }
        }
        putBastionAliens(hard);
    } else {
        console.log('No good tile!');
    }
};

function zoneIndustrielle(hard) {
    console.log('ZONE INDUSTRIELLE');
    let centreTileId = checkEncounterTile();
    warning('Zone industrielle en vue!','',false,encounterTileId);
    if (centreTileId >= 0) {
        putIndusUnits(centreTileId,hard);
        bastionRes(centreTileId);
        if (hard) {
            bastionRes(centreTileId);
            bastionRes(centreTileId);
        }
        putBastionAliens(hard);
    } else {
        console.log('No good tile!');
    }
};

function putIndusUnits(centreTileId,hard) {
    zone[centreTileId].rd = true;
    addRoad(centreTileId);
    let dropTile;
    let numUnits = 1;
    let numWeap = 0;
    let thisUnit = {};
    let baseChance = 2;
    if (!hard) {
        baseChance = 5;
    }
    // ATELIER ou CHAINE DE MONTAGE
    if (zone[0].mapDiff >= rand.rand(5,12) && hard) {
        conselUnit = getBatTypeById(198);
        conselAmmos = ['tungsten','xxx','acier','w1-gun'];
    } else if (hard) {
        conselUnit = getBatTypeById(3);
        conselAmmos = ['tungsten','xxx','acier','w1-gun'];
    } else {
        conselUnit = getBatTypeById(3);
        conselAmmos = ['standard','xxx','aucun','w1-gun'];
    }
    conselPut = false;
    conselTriche = true;
    putBat(centreTileId,0,rand.rand(50,175),'nomove',false);
    playerOccupiedTiles.push(centreTileId);
    numUnits++;
    let bastion = getBatByTileId(centreTileId);
    if (hard) {
        bastion.squadsLeft = rand.rand(4,6);
    } else {
        bastion.squadsLeft = rand.rand(2,3);
    }
    if (bastion.fuzz < 5) {
        bastion.fuzz = 5;
    }
    // COMPTOIR
    if (rand.rand(1,4) === 1 || hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(157);
        conselPut = false;
        conselTriche = true;
        if (hard) {
            conselAmmos = ['sm-perfo','ac-standard','acier','w2-ggun'];
        } else {
            conselAmmos = ['standard','xxx','aucun','w1-gun'];
        }
        putBat(dropTile,0,rand.rand(50,175),'nomove',false);
        playerOccupiedTiles.push(dropTile);
        numUnits++;
        // Fruits !!!
        let tile = getTileById(dropTile);
        if (tile.terrain != 'F' && tile.terrain != 'B' && tile.terrain != 'S') {
            tile.terrain = 'B';
            tile.seed = rand.rand(1,6);
        }
        tile.rq = 1;
        tile.rs = {};
        tile.rs['Fruits'] = rand.rand(180,500);
        thisUnit = getBatByTileId(dropTile);
        if (hard) {
            thisUnit.squadsLeft = rand.rand(4,6);
        } else {
            thisUnit.squadsLeft = rand.rand(2,3);
        }
    }
    // POMPE
    if (numUnits < 2 || hard) {
        if (rand.rand(1,baseChance) === 1) {
            dropTile = checkDropSafe(centreTileId);
            conselUnit = getBatTypeById(123);
            conselPut = false;
            conselTriche = true;
            if (rand.rand(1,2) === 1 && hard) {
                conselAmmos = ['perfo','grenade','aucun','w2-explo'];
            } else if (hard) {
                conselAmmos = ['perfo','xxx','aucun','w1-gun'];
            } else {
                conselAmmos = ['xxx','xxx','aucun','aucun'];
            }
            putBat(dropTile,0,rand.rand(25,75),'nomove',false);
            playerOccupiedTiles.push(dropTile);
            numUnits++;
            // Eau !!!
            tile = getTileById(dropTile);
            if (tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'S' && tile.terrain != 'L') {
                tile.terrain = 'S';
                tile.seed = rand.rand(1,6);
            }
            thisUnit = getBatByTileId(dropTile);
            if (hard) {
                thisUnit.squadsLeft = rand.rand(4,6);
            } else {
                thisUnit.squadsLeft = rand.rand(2,3);
            }
        }
    }
    // MINE
    dropTile = checkDropSafe(centreTileId);
    conselUnit = getBatTypeById(9);
    conselPut = false;
    conselTriche = true;
    if (hard) {
        conselAmmos = ['perfo','dynamite','aucun','w2-dyna'];
    } else {
        conselAmmos = ['xxx','xxx','aucun','aucun'];
    }
    putBat(dropTile,0,rand.rand(50,175),'nomove',false);
    playerOccupiedTiles.push(dropTile);
    numUnits++;
    // Ressources !!!
    tile = getTileById(dropTile);
    if (tile.terrain === 'R' || tile.terrain === 'W' || tile.terrain === 'L') {
        tile.terrain = 'H';
        tile.seed = rand.rand(1,12);
    }
    if (tile.rq === undefined) {
        tile.rq = 3;
        tile.rs = {};
    } else {
        tile.rq = 3;
    }
    tile.rs['Fer'] = rand.rand(90,250);
    tile.rs['Soufre'] = rand.rand(90,250);
    tile.rs['Plomb'] = rand.rand(90,250);
    tile.rs['Potassium'] = rand.rand(90,250);
    tile.rs['Carbone'] = rand.rand(90,250);
    let laMine = getBatByTileId(dropTile);
    if (hard) {
        laMine.squadsLeft = rand.rand(4,6);
    } else {
        laMine.squadsLeft = rand.rand(2,3);
    }
    // MINE 2
    if (rand.rand(1,2) === 1 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(9);
        conselPut = false;
        conselTriche = true;
        if (rand.rand(1,2) === 1) {
            conselAmmos = ['perfo','xxx','aucun','w2-gun'];
        } else {
            conselAmmos = ['perfo','xxx','aucun','psol'];
        }
        putBat(dropTile,0,rand.rand(35,100),'nomove',false);
        playerOccupiedTiles.push(dropTile);
        numUnits++;
        // Ressources !!!
        tile = getTileById(dropTile);
        if (tile.terrain === 'R' || tile.terrain === 'W' || tile.terrain === 'L') {
            tile.terrain = 'H';
            tile.seed = rand.rand(1,12);
        }
        if (tile.rq === undefined) {
            tile.rq = 2;
            tile.rs = {};
        } else {
            tile.rq = 2;
        }
        tile.rs['Fer'] = rand.rand(90,250);
        tile.rs['Aluminium'] = rand.rand(90,250);
        thisUnit = getBatByTileId(dropTile);
        if (hard) {
            thisUnit.squadsLeft = rand.rand(4,6);
        } else {
            thisUnit.squadsLeft = rand.rand(2,3);
        }
    }
    // GENERATEUR
    if (hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(172);
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['xxx','xxx','aucun','aucun'];
        if (rand.rand(1,3) === 1) {
            conselAmmos[3] = 'psol';
        }
        putBat(dropTile,0,rand.rand(15,35),'nomove',false);
        playerOccupiedTiles.push(dropTile);
        numUnits++;
        thisUnit = getBatByTileId(dropTile);
        thisUnit.squadsLeft = rand.rand(4,6);
    }
    // DERRICK
    if (numUnits < 3 || hard) {
        if (rand.rand(1,baseChance) === 1) {
            dropTile = checkDropSafe(centreTileId);
            conselUnit = getBatTypeById(124);
            conselPut = false;
            conselTriche = true;
            if (rand.rand(1,3) === 1 || !hard) {
                conselAmmos = ['xxx','xxx','aucun','aucun'];
            } else {
                conselAmmos = ['tungsten','xxx','aucun','w1-gun'];
            }
            putBat(dropTile,0,rand.rand(35,175),'nomove',false);
            playerOccupiedTiles.push(dropTile);
            numUnits++;
            // Hydrocarbure !!!
            tile = getTileById(dropTile);
            if (tile.terrain === 'R' || tile.terrain === 'W' || tile.terrain === 'L') {
                tile.terrain = 'P';
                tile.seed = rand.rand(1,6);
            }
            if (tile.rq === undefined) {
                tile.rq = 1;
                tile.rs = {};
            }
            tile.rs['Hydrocarbure'] = rand.rand(120,350);
            thisUnit = getBatByTileId(dropTile);
            if (hard) {
                thisUnit.squadsLeft = rand.rand(4,6);
            } else {
                thisUnit.squadsLeft = rand.rand(2,3);
            }
        }
    }
    // DECHARGE
    if (rand.rand(1,3) >= 2 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(203);
        conselPut = false;
        conselTriche = true;
        if (rand.rand(1,3) === 1) {
            conselAmmos = ['tungsten','xxx','aucun','w1-gun'];
        } else {
            conselAmmos = ['tungsten','dynamite','aucun','w2-dyna'];
        }
        putBat(dropTile,0,rand.rand(35,175),'nomove',false);
        playerOccupiedTiles.push(dropTile);
        numUnits++;
        thisUnit = getBatByTileId(dropTile);
        thisUnit.squadsLeft = rand.rand(4,6);
    }
    // ARMURERIE
    if (rand.rand(1,2) === 1 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(170);
        conselPut = false;
        conselTriche = true;
        if (rand.rand(1,3) === 1) {
            conselAmmos = ['tungsten','obus','aucun','w2-explo'];
        } else {
            conselAmmos = ['tungsten','xxx','acier','w1-ggun'];
        }
        putBat(dropTile,0,rand.rand(35,175),'nomove',false);
        playerOccupiedTiles.push(dropTile);
        numUnits++;
        thisUnit = getBatByTileId(dropTile);
        thisUnit.squadsLeft = rand.rand(4,6);
    }
    // INFIRMIERS (dans l'atelier)
    if (rand.rand(1,2) === 1 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(148);
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['sm-perfo','xxx','aucune','aucun'];
        putBat(dropTile,0,rand.rand(25,100),'nomove',false);
        let infirm = getBatByTileId(dropTile);
        loadBat(infirm.id,bastion.id);
        playerOccupiedTiles.push(dropTile);
    }
    // SAPEURS (dans l'atelier)
    if (rand.rand(1,3) >= 2 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(112);
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['perfo','lame','scrap','aucun'];
        putBat(dropTile,0,rand.rand(25,100),'nomove',false);
        let saps = getBatByTileId(dropTile);
        loadBat(saps.id,bastion.id);
        playerOccupiedTiles.push(dropTile);
    }
    // MINEURS (dans la mine)
    if (rand.rand(1,3) >= 2) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(28);
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['perfo','lame-tungsten','scrap','aucun'];
        putBat(dropTile,0,rand.rand(25,100),'nomove',false);
        let mins = getBatByTileId(dropTile);
        loadBat(mins.id,laMine.id);
        playerOccupiedTiles.push(dropTile);
    }
};

function campDeColons(hard) {
    console.log('CAMP DE COLONS');
    let centreTileId = checkEncounterTile();
    warning('Camp de colons en vue!','',false,encounterTileId);
    if (centreTileId >= 0) {
        putColonUnits(centreTileId,hard);
        bastionRes(centreTileId);
        if (hard) {
            bastionRes(centreTileId);
        }
        putBastionAliens(hard);
    } else {
        console.log('No good tile!');
    }
};

function putColonUnits(centreTileId,hard) {
    zone[centreTileId].rd = true;
    addRoad(centreTileId);
    let dropTile;
    let numUnits = 1;
    let numWeap = 0;
    let thisUnit = {};
    // COMPTOIR
    conselUnit = getBatTypeById(157);
    conselPut = false;
    conselTriche = true;
    if (hard) {
        conselAmmos = ['sm-perfo','ac-standard','acier','w2-ggun'];
    } else {
        conselAmmos = ['sm-perfo','xxx','aucun','w1-gun'];
    }
    putBat(centreTileId,0,rand.rand(50,175),'nomove',false);
    playerOccupiedTiles.push(centreTileId);
    // Fruits !!!
    let tile = getTileById(centreTileId);
    if (tile.terrain != 'F' && tile.terrain != 'B' && tile.terrain != 'S') {
        tile.terrain = 'S';
        tile.seed = 1;
    }
    tile.rq = 1;
    tile.rs = {};
    tile.rs['Fruits'] = rand.rand(180,500);
    let bastion = getBatByTileId(centreTileId);
    if (hard) {
        bastion.squadsLeft = rand.rand(4,6);
    } else {
        bastion.squadsLeft = rand.rand(2,3);
    }
    if (bastion.fuzz < 5) {
        bastion.fuzz = 5;
    }
    // SONDE GEOTHERMIQUE
    if (hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(209);
        conselPut = false;
        conselTriche = true;
        let sondeArme = rand.rand(1,3);
        if (sondeArme === 1) {
            conselAmmos = ['perfo','xxx','bugium','w1-gun'];
            numWeap++;
        } else if (sondeArme === 2) {
            conselAmmos = ['perfo','tungsten','bugium','w2-ggun'];
            numWeap++;
        } else {
            conselAmmos = ['perfo','xxx','acier','psol'];
        }
        putBat(dropTile,0,rand.rand(25,100),'nomove',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        thisUnit.squadsLeft = rand.rand(3,6);
    }
    // CANTINE
    dropTile = checkDropSafe(centreTileId);
    conselUnit = getBatTypeById(216);
    conselPut = false;
    conselTriche = true;
    if (rand.rand(1,2) === 1 || hard) {
        conselAmmos = ['sm-perfo','xxx','bugium','w1-gun'];
    } else {
        conselAmmos = ['sm-perfo','xxx','aucun','aucun'];
    }
    putBat(dropTile,0,rand.rand(25,100),'nomove',false);
    playerOccupiedTiles.push(dropTile);
    thisUnit = getBatByTileId(dropTile);
    if (hard) {
        thisUnit.squadsLeft = rand.rand(3,6);
    } else {
        thisUnit.squadsLeft = rand.rand(2,3);
    }
    // BAR
    if (rand.rand(1,2) === 1 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(215);
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['perfo','molotov-feu','bugium','w2-molo'];
        numWeap++;
        putBat(dropTile,0,rand.rand(25,100),'nomove',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        thisUnit.squadsLeft = rand.rand(3,6);
    }
    // POSTE RADIO
    if (rand.rand(1,3) === 1 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(194);
        conselPut = false;
        conselTriche = true;
        if (rand.rand(1,numWeap) === 1) {
            conselAmmos = ['perfo','xxx','bugium','w1-gun'];
            numWeap++;
        } else {
            conselAmmos = ['perfo','xxx','bugium','psol'];
        }
        putBat(dropTile,0,rand.rand(25,100),'nomove',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        thisUnit.squadsLeft = rand.rand(3,6);
    }
    // INFIRMIERS (dans le comptoir)
    if (rand.rand(1,2) === 1) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(148);
        conselPut = false;
        conselAmmos = ['sm-perfo','xxx','aucune','aucun'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'nomove',false);
        let infirm = getBatByTileId(dropTile);
        loadBat(infirm.id,bastion.id);
        playerOccupiedTiles.push(dropTile);
    }
    // SAPEURS
    let minSapeurs = 1-Math.floor(numWeap/3);
    let maxSapeurs = 3-Math.floor(numWeap/2);
    numUnits = rand.rand(minSapeurs,maxSapeurs);
    if (!hard) {
        numUnits = 1;
    }
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        let thisTile = getTileById(dropTile);
        if (hard) {
            thisTile.infra = 'Palissades';
            conselUnit = getBatTypeById(112);
        }
        conselPut = false;
        conselAmmos = ['perfo','lame','scrap','aucun'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        if (hard) {
            thisUnit.squadsLeft = rand.rand(4,6);
        } else {
            thisUnit.squadsLeft = rand.rand(2,3);
        }
        numWeap++;
    }
    // BARBELES
    if (rand.rand(1,Math.floor(numWeap/2)+1) === 1 && hard) {
        numUnits = rand.rand(2,4);
        for (var i = 0; i < numUnits; i++){
            dropTile = checkDropSafe(centreTileId);
            conselUnit = getBatTypeById(168);
            conselPut = false;
            conselTriche = true;
            conselAmmos = ['barb','xxx','aucun','aucun'];
            putBat(dropTile,0,0,'nomove',false);
            playerOccupiedTiles.push(dropTile);
            thisUnit = getBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(4,6);
        }
    }
}

function baseLabo(hard) {
    console.log('BASE DE RECHECRCHE');
    let centreTileId = checkEncounterTile();
    warning('Centre scientifique en vue!','',false,encounterTileId);
    if (centreTileId >= 0) {
        putLaboUnits(centreTileId,hard);
        bastionRes(centreTileId);
        if (hard) {
            pactole(centreTileId,true);
        }
        putBastionAliens(hard);
    } else {
        console.log('No good tile!');
    }
};

function putLaboUnits(centreTileId,hard) {
    zone[centreTileId].rd = true;
    addRoad(centreTileId);
    let dropTile;
    let numUnits = 1;
    let autopis = false;
    let thisUnit = {};
    // LABORATOIRE
    conselUnit = getBatTypeById(206);
    conselPut = false;
    conselTriche = true;
    if (hard) {
        conselAmmos = ['sm-explosive','gaz','acier','w2-rain'];
        if (rand.rand(1,2) === 1) {
            conselAmmos[3] = 'w2-autopistol';
            autopis = true;
        }
    } else {
        conselAmmos = ['standard','xxx','aucun','w1-gun'];
    }
    putBat(centreTileId,0,rand.rand(50,175),'nomove',false);
    playerOccupiedTiles.push(centreTileId);
    let bastion = getBatByTileId(centreTileId);
    bastion.squadsLeft = rand.rand(4,6);
    if (hard) {
        bastion.squadsLeft = rand.rand(4,6);
    } else {
        bastion.squadsLeft = rand.rand(2,3);
    }
    if (bastion.fuzz < 5) {
        bastion.fuzz = 5;
    }
    // GENERATEUR
    dropTile = checkDropSafe(centreTileId);
    conselUnit = getBatTypeById(172);
    conselPut = false;
    conselTriche = true;
    if (hard) {
        conselAmmos = ['xxx','xxx','aucun','psol'];
        if (rand.rand(1,5) === 1) {
            conselAmmos[3] = 'w2-autopistol';
            autopis = true;
        }
    } else {
        conselAmmos = ['xxx','xxx','aucun','aucun'];
    }
    putBat(dropTile,0,rand.rand(25,100),'nomove',false);
    playerOccupiedTiles.push(dropTile);
    thisUnit = getBatByTileId(dropTile);
    if (hard) {
        thisUnit.squadsLeft = rand.rand(3,5);
    } else {
        thisUnit.squadsLeft = rand.rand(2,3);
    }
    // CHERCHEURS (dans le labo)
    let sciDice = rand.rand(1,3);
    if (sciDice === 1 && hard) {
        // CHERCHEURS
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(260);
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['lame-scrap','xxx','aucune','aucun'];
        putBat(dropTile,0,rand.rand(15,40),'nomove',false);
        let cherch = getBatByTileId(dropTile);
        loadBat(cherch.id,bastion.id);
        playerOccupiedTiles.push(dropTile);
    } else if (sciDice === 2 && hard) {
        // RIGGERS
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(156);
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['lame','xxx','aucune','aucun'];
        putBat(dropTile,0,rand.rand(15,40),'nomove',false);
        let cherch = getBatByTileId(dropTile);
        loadBat(cherch.id,bastion.id);
        playerOccupiedTiles.push(dropTile);
    }
    // DROIDES
    if (hard) {
        if (rand.rand(1,3) === 1 || !autopis) {
            numUnits = rand.rand(1,2);
            for (var i = 0; i < numUnits; i++){
                dropTile = checkDropSafe(centreTileId);
                let thisTile = getTileById(dropTile);
                thisTile.infra = 'Palissades';
                conselUnit = getBatTypeById(82);
                conselPut = false;
                conselTriche = true;
                conselAmmos = ['perfo','perfo','chobham','aucun'];
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'lunette2';
                }
                putBat(dropTile,0,0,'fgnomove',false);
                playerOccupiedTiles.push(dropTile);
                thisUnit = getBatByTileId(dropTile);
                thisUnit.squadsLeft = rand.rand(3,6);
            }
        }
        // GUNBOTS
        if (rand.rand(1,5) === 1) {
            dropTile = checkDropSafe(centreTileId);
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Miradors';
            conselUnit = getBatTypeById(136);
            conselPut = false;
            conselTriche = true;
            conselAmmos = ['perfo','marquage','chobham','lunette'];
            putBat(dropTile,0,0,'fgnomove',false);
            playerOccupiedTiles.push(dropTile);
            thisUnit = getBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(3,6);
        }
    }
    // BARBELES
    numUnits = rand.rand(4,7);
    if (!hard) {
        numUnits = rand.rand(0,2);
    }
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(169);
        conselPut = false;
        conselTriche = true;
        conselAmmos = ['barb-taser','xxx','acier','aucun'];
        putBat(dropTile,0,0,'nomove',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        if (hard) {
            thisUnit.squadsLeft = rand.rand(3,6);
        } else {
            thisUnit.squadsLeft = rand.rand(1,3);
        }
    }
}

function bastionDeBrigands(hard) {
    console.log('HORS LA LOI');
    let centreTileId = checkEncounterTile();
    warning('Bastion de brigands en vue!','',false,encounterTileId);
    if (centreTileId >= 0) {
        putHLLUnits(centreTileId,hard);
        bastionRes(centreTileId);
        if (hard) {
            bastionRes(centreTileId);
            pactole(centreTileId,false);
        }
        putBastionAliens(hard);
    } else {
        console.log('No good tile!');
    }
};

function putHLLUnits(centreTileId,hard) {
    zone[centreTileId].rd = true;
    addRoad(centreTileId);
    let dropTile;
    let tech = rand.rand(Math.floor(zone[0].mapDiff/2),zone[0].mapDiff+3);
    let numUnits = 1;
    let totalUnits = 1;
    let bldBonus = false;
    let thisUnit = {};
    let unitIndex;
    if (zone[0].mapDiff >= rand.rand(5,8) && hard) {
        if (playerInfos.gang != 'blades') {
            bldBonus = true;
        }
    }
    // BATIMENT BASE
    if (!bldBonus || playerInfos.gang != 'detruas') {
        if (playerInfos.gang === 'bulbos') {
            // Prisons
            conselUnit = getBatTypeById(224);
            if (hard) {
                conselAmmos = ['explosive','xxx','acier','w1-ggun'];
            } else {
                conselAmmos = ['standard','xxx','aucun','w1-ggun'];
            }
        } else if (playerInfos.gang === 'detruas') {
            // Poudrière
            conselUnit = getBatTypeById(29);
            if (hard) {
                conselAmmos = ['explosive','grenade','acier','w2-explo'];
            } else {
                conselAmmos = ['standard','xxx','aucun','w1-gun'];
            }
        } else if (playerInfos.gang === 'blades' || playerInfos.gang === 'tiradores') {
            // Atelier
            conselUnit = getBatTypeById(3);
            if (hard) {
                conselAmmos = ['perfo','dynamite','acier','w2-dyna'];
            } else {
                conselAmmos = ['standard','xxx','aucun','w1-gun'];
            }
        } else if (playerInfos.gang === 'brasier') {
            // Derrick
            conselUnit = getBatTypeById(124);
            if (hard) {
                conselAmmos = ['perfo','lf-napalm','acier','w2-fire'];
            } else {
                conselAmmos = ['standard','xxx','aucun','w1-gun'];
            }
        } else if (playerInfos.gang === 'drogmulojs') {
            // Décharge
            conselUnit = getBatTypeById(203);
            if (hard) {
                conselAmmos = ['teflon','dynamite-nitrate','acier','w2-dyna'];
            } else {
                conselAmmos = ['standard','xxx','aucun','w1-gun'];
            }
        } else if (playerInfos.gang === 'rednecks') {
            // Bar
            conselUnit = getBatTypeById(215);
            if (hard) {
                conselAmmos = ['perfo','molotov-feu','acier','w2-molo'];
            } else {
                conselAmmos = ['standard','xxx','aucun','w1-gun'];
            }
        }
        conselPut = false;
        conselTriche = true;
        putBat(centreTileId,0,rand.rand(50,175),'nomove',false);
        playerOccupiedTiles.push(centreTileId);
        thisUnit = getBatByTileId(centreTileId);
        thisUnit.damage = rand.rand(1,50);
        if (hard) {
            thisUnit.squadsLeft = rand.rand(4,6);
        } else {
            thisUnit.squadsLeft = rand.rand(2,3);
        }
    }
    // BATIMENT BONUS
    if (bldBonus) {
        if (playerInfos.gang != 'detruas') {
            dropTile = checkDropSafe(centreTileId);
        } else {
            dropTile = centreTileId;
        }
        if (playerInfos.gang === 'bulbos') {
            // Tour de garde
            conselUnit = getBatTypeById(137);
            conselAmmos = ['proto-plasma','laser','aucun','aucun'];
        } else if (playerInfos.gang === 'detruas') {
            // Casemates
            conselUnit = getBatTypeById(125);
            conselAmmos = ['obus','perfo','aucun','aucun'];
        } else if (playerInfos.gang === 'rednecks' || playerInfos.gang === 'tiradores') {
            // Bunkers
            conselUnit = getBatTypeById(178);
            conselAmmos = ['perfo','ac-standard','aucun','aucun'];
        } else if (playerInfos.gang === 'brasier' || playerInfos.gang === 'drogmulojs') {
            // Blockhaus
            conselUnit = getBatTypeById(127);
            conselAmmos = ['lf-feu','proto-fireshells','aucun','aucun'];
        }
        conselPut = false;
        conselTriche = true;
        putBat(dropTile,0,rand.rand(50,175),'nomove',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        thisUnit.damage = rand.rand(1,75);
        if (conselUnit.id === 178) {
            thisUnit.squadsLeft = rand.rand(3,4);
        } else {
            thisUnit.squadsLeft = rand.rand(2,3);
        }
    }
    let bastion = getBatByTileId(centreTileId);
    if (bastion.fuzz < 5) {
        bastion.fuzz = 5;
    }
    // INFIRMIERS (dans le bastion)
    if (rand.rand(1,3) === 1 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(148);
        conselPut = false;
        conselAmmos = ['sm-perfo','perfo','scrap','e-camo'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'nomove',false);
        let infirm = getBatByTileId(dropTile);
        loadBat(infirm.id,bastion.id);
        playerOccupiedTiles.push(dropTile);
    }
    // UNITE BONUS
    if (rand.rand(1,3) === 1 && hard) {
        dropTile = checkDropSafe(centreTileId);
        let thisTile = getTileById(dropTile);
        conselPut = false;
        conselTriche = true;
        if (playerInfos.gang === 'blades') {
            // Trébuchet
            conselUnit = getBatTypeById(145);
            conselAmmos = ['lame-poison','boulet-explosif','aucun','g2siege'];
            putBat(dropTile,0,rand.rand(25,100),'nomove',false);
            thisUnit = getBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(3,4);
        } else if (playerInfos.gang === 'drogmulojs') {
            // Mutants
            conselUnit = getBatTypeById(53);
            conselAmmos = ['pn-perfo','lame-tungsten','bugium','lunette1'];
            thisTile.infra = 'Palissades';
            putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
            thisUnit = getBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(5,7);
        } else if (playerInfos.gang === 'tiradores') {
            // Bandidos
            conselUnit = getBatTypeById(144);
            conselAmmos = ['perfo','perfo','scrap','silencieux2'];
            thisTile.infra = 'Palissades';
            putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
            thisUnit = getBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(4,6);
        }
        playerOccupiedTiles.push(dropTile);
    }
    // HLL
    let maxUnits = Math.floor(zone[0].mapDiff/4)+3;
    numUnits = rand.rand(2,maxUnits);
    if (!hard) {
        numUnits = rand.rand(1,2);
    }
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        if (hard) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
        if (playerInfos.gang === 'bulbos') {
            // Détenus
            conselUnit = getBatTypeById(217);
            if (hard) {
                conselAmmos = ['perfo','lame-poison','scrap','lunette1'];
                if (rand.rand(1,4) === 1) {
                    conselAmmos[3] = 'e-camo';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'crimekitlu';
                }
            } else {
                conselAmmos = ['standard','lame','scrap','aucun'];
            }
        } else if (playerInfos.gang === 'detruas') {
            // Sinyaki
            conselUnit = getBatTypeById(223);
            if (hard) {
                conselAmmos = ['lame','dynamite','scrap','aucun'];
                if (rand.rand(1,3) === 1) {
                    conselAmmos[1] = 'dynamite-nitrate';
                }
                if (rand.rand(1,4) === 1) {
                    conselAmmos[3] = 'e-camo';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'lanceur2';
                }
                if (rand.rand(1,4) === 1) {
                    conselAmmos[3] = 'crimekitgi';
                }
            } else {
                conselAmmos = ['lame','dynamite','aucune','aucun'];
            }
        } else if (playerInfos.gang === 'blades') {
            // Raiders
            conselUnit = getBatTypeById(219);
            if (hard) {
                conselAmmos = ['fleche-poison','fleche-poison','scrap','e-camo'];
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'crimekitgi';
                }
            } else {
                conselAmmos = ['fleche','fleche','scrap','aucun'];
            }
        } else if (playerInfos.gang === 'brasier') {
            // Tôlards
            conselUnit = getBatTypeById(222);
            if (hard) {
                conselAmmos = ['torche-feu','perfo','scrap','chargeur2'];
                if (rand.rand(1,2) === 1) {
                    conselAmmos[0] = 'torche-feugre';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'crimekitch';
                }
            } else {
                conselAmmos = ['torche-feu','standard','scrap','aucun'];
            }
        } else if (playerInfos.gang === 'drogmulojs') {
            // Krimulos
            conselUnit = getBatTypeById(220);
            if (hard) {
                conselAmmos = ['perfo','lame-poison','scrap','e-ranger'];
                if (rand.rand(1,4) === 1) {
                    conselAmmos[3] = 'e-camo';
                }
                if (rand.rand(1,3) === 1) {
                    conselAmmos[3] = 'crimekitch';
                }
            } else {
                conselAmmos = ['standard','lame','aucun','aucun'];
            }
        } else if (playerInfos.gang === 'rednecks') {
            // Gangsters
            conselUnit = getBatTypeById(218);
            if (hard) {
                conselAmmos = ['perfo','lame-poison','scrap','e-ranger'];
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'crimekitch';
                }
            } else {
                conselAmmos = ['standard','lame','scrap','aucun'];
            }
        } else if (playerInfos.gang === 'tiradores') {
            // Desperados
            conselUnit = getBatTypeById(221);
            if (hard) {
                conselAmmos = ['sm-perfo','lame','scrap','aucun'];
                if (rand.rand(1,4) === 1) {
                    conselAmmos[3] = 'e-camo';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'chargeur1';
                }
                if (rand.rand(1,3) === 1) {
                    conselAmmos[3] = 'crimekitch';
                }
            } else {
                conselAmmos = ['standard','lame','aucun','aucun'];
            }
        }
        conselPut = false;
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        if (hard) {
            thisUnit.squadsLeft = rand.rand(6,10);
        } else {
            thisUnit.squadsLeft = rand.rand(2,6);
        }
    }
    // PIEGES
    if (playerInfos.gang === 'blades' || (rand.rand(1,2) === 1 && playerInfos.gang === 'brasier')) {
        numUnits = rand.rand(2,5);
        if (!hard) {
            numUnits = rand.rand(1,2);
        }
        for (var i = 0; i < numUnits; i++){
            dropTile = checkDropSafe(centreTileId);
            conselUnit = getBatTypeById(237);
            conselAmmos = ['trap','trap-suicide','aucun','aucun'];
            conselPut = false;
            conselTriche = true;
            putBat(dropTile,0,0,'nomove',false);
            playerOccupiedTiles.push(dropTile);
            thisUnit = getBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(5,6);
        }
    }
    // CHAMPS DE MINES
    if (hard) {
        if (playerInfos.gang === 'detruas' || (rand.rand(1,3) === 1 && (playerInfos.gang === 'bulbos' || playerInfos.gang === 'rednecks'))) {
            numUnits = rand.rand(1,2);
            if (playerInfos.gang === 'detruas') {
                numUnits++;
            }
            for (var i = 0; i < numUnits; i++){
                dropTile = checkDropAny(centreTileId);
                conselUnit = getBatTypeById(43);
                conselAmmos = ['mine','suicide','aucun','aucun'];
                conselPut = false;
                conselTriche = true;
                putBat(dropTile,0,0,'nomove',false);
                playerOccupiedTiles.push(dropTile);
                thisUnit = getBatByTileId(dropTile);
                thisUnit.squadsLeft = rand.rand(4,6);
            }
        }
    }
}

function baseDeResistants(hard) {
    console.log('BASTION DE RESISTANTS');
    let centreTileId = checkEncounterTile();
    warning('Bastion de résistants en vue!','',false,encounterTileId);
    if (centreTileId >= 0) {
        putBastionUnits(centreTileId,hard);
        bastionRes(centreTileId);
        if (hard) {
            bastionRes(centreTileId);
            bastionRes(centreTileId);
        }
        putBastionAliens(hard);
    } else {
        console.log('No good tile!');
    }
};

function putBastionUnits(centreTileId,hard) {
    zone[centreTileId].rd = true;
    addRoad(centreTileId);
    // BASTION
    let dropTile;
    let tech = rand.rand(Math.floor(zone[0].mapDiff/2),zone[0].mapDiff+3);
    if (!hard) {
        tech = 0;
    }
    let numUnits = 1;
    let totalUnits = 1;
    let thisUnit = {};
    conselUnit = getBatTypeById(262);
    conselPut = false;
    if (hard) {
        conselAmmos = ['perfo','ac-standard','acier','aucun'];
    } else {
        conselAmmos = ['standard','ac-standard','aucun','aucun'];
    }
    encounterAmmos(tech);
    conselTriche = true;
    putBat(centreTileId,0,rand.rand(50,175),'outsider',false);
    playerOccupiedTiles.push(centreTileId);
    let bastion = getBatByTileId(centreTileId);
    bastion.damage = rand.rand(1,75);
    if (hard) {
        bastion.squadsLeft = rand.rand(4,6);
    } else {
        bastion.squadsLeft = rand.rand(2,3);
    }
    if (bastion.fuzz < 5) {
        bastion.fuzz = 5;
    }
    // TRANSPORT
    if (zone[0].mapDiff >= rand.rand(3,15) && hard) {
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
        encounterAmmos(tech);
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(unitId);
        putBat(dropTile,0,rand.rand(25,100),'',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        thisUnit.squadsLeft = rand.rand(3,4);
    }
    // AUTRE VEHICULE
    if (zone[0].mapDiff >= rand.rand(5,25) && hard) {
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
        encounterAmmos(tech);
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(unitId);
        putBat(dropTile,0,rand.rand(25,100),'',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        if (unitId === 119) {
            thisUnit.squadsLeft = rand.rand(1,2);
        } else {
            thisUnit.squadsLeft = rand.rand(3,4);
        }
    }
    // RETRANCHEMENTS
    if (hard) {
        numUnits = rand.rand(0,2);
    } else {
        numUnits = rand.rand(0,1);
    }
    totalUnits = totalUnits+numUnits;
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        if (hard) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
        conselUnit = getBatTypeById(263);
        conselPut = false;
        if (hard) {
            conselAmmos = ['perfo','perfo','scrap','silencieux2'];
        } else {
            conselAmmos = ['standard','standard','aucune','aucun'];
        }
        encounterAmmos(tech);
        conselTriche = true;
        putBat(dropTile,0,rand.rand(50,175),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        if (hard) {
            thisUnit.squadsLeft = rand.rand(4,6);
        } else {
            thisUnit.squadsLeft = rand.rand(2,3);
        }
    }
    // SAPEURS
    if (hard) {
        numUnits = rand.rand(0,1);
        totalUnits = totalUnits+numUnits;
        if (numUnits > 0) {
            dropTile = checkDropSafe(centreTileId);
            if (rand.rand(1,2) === 1) {
                let thisTile = getTileById(dropTile);
                thisTile.infra = 'Palissades';
            }
            conselUnit = getBatTypeById(112);
            conselPut = false;
            conselAmmos = ['perfo','lame','scrap','silencieux1'];
            encounterAmmos(tech);
            conselTriche = true;
            putBat(dropTile,0,rand.rand(25,100),'fortifguet',false);
            playerOccupiedTiles.push(dropTile);
            thisUnit = getBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(4,6);
        }
    }
    // INFIRMIERS (dans le bastion)
    if (rand.rand(1,3) === 1 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(148);
        conselPut = false;
        conselAmmos = ['sm-perfo','perfo','scrap','e-camo'];
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'',false);
        let infirm = getBatByTileId(dropTile);
        loadBat(infirm.id,bastion.id);
        playerOccupiedTiles.push(dropTile);
    }
    // MULETS
    if (rand.rand(1,4) === 1) {
        numUnits = 1;
        totalUnits = totalUnits+numUnits;
        dropTile = checkDropSafe(centreTileId);
        if (rand.rand(1,2) === 1 && hard) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
        conselUnit = getBatTypeById(27);
        conselPut = false;
        if (hard) {
            conselAmmos = ['perfo','xxx','scrap','e-camo'];
        } else {
            conselAmmos = ['standard','xxx','aucune','aucun'];
        }
        encounterAmmos(tech);
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        if (hard) {
            thisUnit.squadsLeft = rand.rand(4,6);
        } else {
            thisUnit.squadsLeft = rand.rand(2,3);
        }
    }
    // MINEURS
    if (rand.rand(1,4) === 1 && hard) {
        numUnits = 1;
        totalUnits = totalUnits+numUnits;
        dropTile = checkDropSafe(centreTileId);
        if (rand.rand(1,2) === 1) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
        conselUnit = getBatTypeById(28);
        conselPut = false;
        conselAmmos = ['perfo','lame','scrap','aucun'];
        encounterAmmos(tech);
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        thisUnit.squadsLeft = rand.rand(4,6);
    }
    // RESISTANTS
    let maxUnits = Math.ceil(zone[0].mapDiff/2)+2;
    if (hard) {
        numUnits = rand.rand(2,maxUnits)-Math.floor(totalUnits/2);
        if (numUnits < 1) {numUnits = 1;}
    } else {
        numUnits = 1;
    }
    totalUnits = totalUnits+numUnits;
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        if (rand.rand(1,2) === 1 && hard) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
        conselUnit = getBatTypeById(261);
        conselPut = false;
        if (hard) {
            conselAmmos = ['pn-perfo','grenade','scrap','silencieux1'];
        } else {
            conselAmmos = ['pn-standard','grenade','aucune','aucun'];
        }
        encounterAmmos(tech);
        conselTriche = true;
        putBat(dropTile,0,rand.rand(50,175),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getBatByTileId(dropTile);
        if (hard) {
            thisUnit.squadsLeft = rand.rand(5,7);
        } else {
            thisUnit.squadsLeft = rand.rand(2,4);
            thisUnit.tags.push('aU');
            thisUnit.tags.push('aU');
            thisUnit.tags.push('aU');
            thisUnit.tags.push('aU');
        }
        if (rand.rand(1,2) === 1) {
            thisUnit.tags.push('aU');
        }
    }
    // CHAMPS DE MINES
    if (rand.rand(1,3) === 1 && hard) {
        let maxMines = Math.round(zone[0].mapDiff/3)+1
        numUnits = rand.rand(1,maxMines);
        for (var i = 0; i < numUnits; i++){
            dropTile = checkDropAny(centreTileId);
            conselUnit = getBatTypeById(43);
            conselPut = false;
            conselAmmos = ['mine','suicide','aucun','aucun'];
            conselTriche = true;
            putBat(dropTile,0,0,'',false);
            playerOccupiedTiles.push(dropTile);
            thisUnit = getBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(4,6);
        }
    }
}

function encounterAmmos(tech) {
    if (tech >= 5) {
        if (conselAmmos[0].includes('sm-')) {
            conselAmmos[0] = 'sm-tungsten';
        } else if (conselAmmos[0].includes('ac-')) {
            conselAmmos[0] = 'ac-explosive';
        } else if (conselAmmos[0].includes('pn-')) {
            conselAmmos[0] = 'pn-tungsten';
        } else if (conselAmmos[0].includes('fleche')) {
            conselAmmos[0] = 'fleche-tungsten';
        } else if (conselAmmos[0].includes('lame')) {
            conselAmmos[0] = 'lame-tungsten';
        } else if (conselAmmos[0] === 'perfo') {
            conselAmmos[0] = 'tungsten';
        }
        if (conselAmmos[1].includes('sm-')) {
            conselAmmos[1] = 'sm-tungsten';
        } else if (conselAmmos[1].includes('ac-')) {
            conselAmmos[1] = 'ac-explosive';
        } else if (conselAmmos[1].includes('pn-')) {
            conselAmmos[1] = 'pn-tungsten';
        } else if (conselAmmos[1].includes('fleche')) {
            conselAmmos[1] = 'fleche-tungsten';
        } else if (conselAmmos[1].includes('lame')) {
            conselAmmos[1] = 'lame-tungsten';
        } else if (conselAmmos[1] === 'perfo') {
            conselAmmos[1] = 'tungsten';
        }
    }
}

function bastionRes(bastionTileId) {
    console.log('SURVIE');
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

function pactole(bastionTileId,withTrans) {
    console.log('PACTOLE');
    let coffre = getBatByTileId(bastionTileId);
    let totalRes = 0;
    let thatResChance = 0;
    let thatResNum = 0;
    let mapFactor = Math.round(((Math.sqrt(zone[0].mapDiff+2)*10)+zone[0].mapDiff)/8);
    let resFactor;
    let shufRes = _.shuffle(resTypes);
    shufRes.forEach(function(res) {
        if (res.name != 'Magma' && res.name != 'Transorb' && res.cat != 'alien' && (res.cat != 'transfo' || withTrans)) {
            if (res.rarity <= 16) {
                thatResChance = 0;
                thatResNum = 0;
                resFactor = res.rarity+res.rarity+Math.round(zone[0].mapDiff*3);
                thatResChance = Math.ceil(resFactor/3*res.batch/3);
                if (res.cat === 'blue') {
                    thatResChance = Math.ceil(thatResChance/2*mapFactor/4);
                } else if (res.cat === 'blue-sky') {
                    thatResChance = Math.ceil(thatResChance/1.5*mapFactor/4);
                } else if (res.cat === 'sky') {
                    thatResChance = Math.ceil(thatResChance/2*mapFactor/4);
                }
                let maxDice = 20+Math.floor(totalRes/3);
                console.log(res.name+' '+thatResChance+'/'+maxDice);
                if (rand.rand(1,maxDice) <= thatResChance) {
                    thatResNum = Math.ceil(Math.sqrt(Math.sqrt(thatResChance))*mapFactor*1.5*rand.rand(4,16))+rand.rand(0,9);
                    thatResNum = Math.ceil(thatResNum*150/mineRateDiv);
                    if (withTrans && res.cat != 'transfo') {
                        thatResNum = Math.ceil(thatResNum/1.5);
                    }
                    console.log('!GET : '+res.name+' '+thatResNum);
                    if (coffre.transRes[res.name] === undefined) {
                        coffre.transRes[res.name] = thatResNum;
                    } else {
                        coffre.transRes[res.name] = coffre.transRes[res.name]+thatResNum;
                    }
                    totalRes = totalRes+thatResNum;
                }
            }
        }
    });
    if (totalRes < 500) {
        shufRes.forEach(function(res) {
            if (res.name != 'Magma' && res.cat != 'alien' && res.cat != 'transfo') {
                if (res.rarity <= 16) {
                    thatResChance = 0;
                    thatResNum = 0;
                    resFactor = res.rarity+res.rarity+Math.round(zone[0].mapDiff*3);
                    thatResChance = Math.ceil(resFactor/3*res.batch/3);
                    if (res.cat === 'blue') {
                        thatResChance = Math.ceil(thatResChance/2*mapFactor/4);
                    } else if (res.cat === 'blue-sky') {
                        thatResChance = Math.ceil(thatResChance/1.5*mapFactor/4);
                    } else if (res.cat === 'sky') {
                        thatResChance = Math.ceil(thatResChance/2*mapFactor/4);
                    }
                    let maxDice = 20+Math.floor(totalRes/3);
                    console.log(res.name+' '+thatResChance+'/'+maxDice);
                    if (rand.rand(1,maxDice) <= thatResChance) {
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
            }
        });
    }
};

function removeNoMoves(myBat) {
    if (myBat.type != 'Silo') {
        bataillons.forEach(function(bat) {
            if (bat.tags.includes('nomove')) {
                tagDelete(bat,'nomove');
            }
        });
    }
}

function checkEncounterTile() {
    let centreTileId = -1;
    alienOccupiedTileList();
    playerOccupiedTileList();
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (centreTileId < 0) {
            if ((tile.x === 55 && tile.y >= 6 && tile.y <= 55) || (tile.x === 6 && tile.y >= 6 && tile.y <= 55) || (tile.y === 6 && tile.x >= 6 && tile.x <= 55) || (tile.y === 55 && tile.x >= 6 && tile.x <= 55)) {
                if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                    if (tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'S' && tile.terrain != 'L') {
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
                        if (tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'S' && tile.terrain != 'L') {
                            centreTileId = tile.id;
                        }
                    }
                }
            }
        });
    }
    if (centreTileId < 0) {
        shufZone.forEach(function(tile) {
            if (centreTileId < 0) {
                if ((tile.x === 55 && tile.y >= 6 && tile.y <= 55) || (tile.x === 6 && tile.y >= 6 && tile.y <= 55) || (tile.y === 6 && tile.x >= 6 && tile.x <= 55) || (tile.y === 55 && tile.x >= 6 && tile.x <= 55)) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        if (tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') {
                            centreTileId = tile.id;
                        }
                    }
                }
            }
        });
    }
    if (centreTileId < 0) {
        shufZone.forEach(function(tile) {
            if (centreTileId < 0) {
                if ((tile.x === 54 && tile.y >= 6 && tile.y <= 55) || (tile.x === 7 && tile.y >= 6 && tile.y <= 55) || (tile.y === 7 && tile.x >= 6 && tile.x <= 55) || (tile.y === 54 && tile.x >= 6 && tile.x <= 55)) {
                    if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                        if (tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') {
                            centreTileId = tile.id;
                        }
                    }
                }
            }
        });
    }
    encounterTileId = centreTileId;
    return centreTileId;
}
