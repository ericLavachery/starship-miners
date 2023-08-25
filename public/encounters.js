function encounterCheck() {
    if (!zone[0].visit && zone[0].number < 50) {
        if (zone[0].mapDiff >= 2) {
            let encounterChance = playerInfos.enc;
            if (zone[0].planet === 'Dom') {
                if (zone[0].mapDiff >= 4) {
                    encounterChance = encounterChance-20;
                }
            }
            if (zone[0].planet === 'Sarak') {
                encounterChance = encounterChance-10;
                if (zone[0].mapDiff >= 5) {
                    encounterChance = encounterChance-20;
                }
            }
            if (zone[0].planet === 'Horst') {
                encounterChance = encounterChance+40;
                if (encounterChance < 90) {
                    encounterChance = 90;
                }
            }
            if (zone[0].planet === 'Kzin') {
                encounterChance = encounterChance+20;
                if (encounterChance < 70) {
                    encounterChance = 70;
                }
            }
            if (zone[0].planet === 'Gehenna') {
                encounterChance = encounterChance+10;
                if (encounterChance < 60) {
                    encounterChance = 60;
                }
            }
            if (playerInfos.cAdj <= 3 && playerInfos.cLoss >= 1500) {
                encounterChance = encounterChance-10;
            }
            if (rand.rand(1,encounterChance) <= 30) {
                encounter();
            } else {
                playerInfos.encz.push('xx');
                if (zone[0].planet === 'Sarak' || zone[0].planet === 'Dom') {
                    playerInfos.enc = playerInfos.enc-10;
                    let citNeedDice = Math.round(18-(playerInfos.cNeed*10));
                    if (citNeedDice < 4) {
                        citNeedDice = 4;
                    }
                    if (rand.rand(1,citNeedDice) <= 3) {
                        madCitizens(false);
                    }
                }
            }
        }
    }
};

function encBaseAdj(hard,baseType) {
    if (playerInfos.enc < 25) {
        playerInfos.enc = 25;
    }
    if (hard) {
        playerInfos.enc = playerInfos.enc+18;
    } else {
        playerInfos.enc = playerInfos.enc+12;
    }
    playerInfos.encz.push(baseType);
};

function encounter() {
    let hard = false;
    let encDiceMin = 2;
    let encDiceMax = 28;
    if (zone[0].planet != 'Sarak') {
        if (rand.rand(1,2) === 1 || zone[0].mapDiff >= 8) {
            hard = true;
            playerInfos.fndCits = playerInfos.fndCits+3;
            encDiceMin = 0;
        }
    }
    if (playerInfos.cAdj <= 3 && playerInfos.cLoss >= 1500) {
        hard = true;
    }
    encDiceMax = encDiceMax-5+Math.round(playerInfos.enc/10);
    checkEncDice(encDiceMin,encDiceMax,hard);
    if (playerInfos.cAdj <= 3 && playerInfos.cLoss >= 1500) {
        playerInfos.cAdj++;
    }
};

function checkEncDice(encDiceMin,encDiceMax,hard) {
    let encDice = rand.rand(encDiceMin,encDiceMax);
    if (encDice === 1 || encDice === 2) {
        baseDeResistants(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
        encBaseAdj(hard,'br');
    } else if ((encDice === 0 || encDice === 3) && !playerInfos.encz.includes('br')) {
        baseDeResistants(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
        encBaseAdj(hard,'br');
    } else if (encDice === 4) {
        bastionDeBrigands(hard);
        playerInfos.fndCits = playerInfos.fndCits+2;
        encBaseAdj(hard,'bb');
    } else if ((encDice === 5 || encDice === 6) && !playerInfos.encz.includes('bb')) {
        bastionDeBrigands(hard);
        playerInfos.fndCits = playerInfos.fndCits+2;
        encBaseAdj(hard,'bb');
    } else if (encDice === 7) {
        baseLabo(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
        encBaseAdj(hard,'bs');
    } else if (encDice === 8 && !playerInfos.encz.includes('bs')) {
        baseLabo(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
        encBaseAdj(hard,'bs');
    } else if (encDice === 9) {
        campDeColons(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
        encBaseAdj(hard,'cc');
    } else if (encDice === 10 && !playerInfos.encz.includes('cc')) {
        campDeColons(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
        encBaseAdj(hard,'cc');
    } else if (encDice === 11) {
        zoneIndustrielle(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
        encBaseAdj(hard,'zi');
    } else if (encDice === 12 && !playerInfos.encz.includes('zi')) {
        zoneIndustrielle(hard);
        playerInfos.fndCits = playerInfos.fndCits+3;
        encBaseAdj(hard,'zi');
    } else if (encDice === 13) {
        // Piège alien
        tooLate(hard);
        playerInfos.enc = playerInfos.enc-10;
        playerInfos.encz.push('pa');
    } else if ((encDice === 14 || encDice === 15 || encDice === 16 || encDice === 17) && zone[0].mapDiff < 7) {
        tooLate(hard);
        playerInfos.enc = playerInfos.enc-10;
        playerInfos.encz.push('rb');
    } else {
        if (rand.rand(1,50) > playerInfos.enc && !playerInfos.encz.includes('br')) {
            baseDeResistants(hard);
            playerInfos.fndCits = playerInfos.fndCits+3;
            encBaseAdj(hard,'br');
        } else if (rand.rand(1,50) > playerInfos.enc && !playerInfos.encz.includes('bb')) {
            bastionDeBrigands(hard);
            playerInfos.fndCits = playerInfos.fndCits+2;
            encBaseAdj(hard,'bb');
        } else if (rand.rand(1,50) > playerInfos.enc && !playerInfos.encz.includes('cc')) {
            campDeColons(hard);
            playerInfos.fndCits = playerInfos.fndCits+3;
            encBaseAdj(hard,'cc');
        } else if (rand.rand(1,50) > playerInfos.enc && !playerInfos.encz.includes('bs')) {
            baseLabo(hard);
            playerInfos.fndCits = playerInfos.fndCits+3;
            encBaseAdj(hard,'bs');
        } else if (rand.rand(1,50) > playerInfos.enc && !playerInfos.encz.includes('zi')) {
            zoneIndustrielle(hard);
            playerInfos.fndCits = playerInfos.fndCits+3;
            encBaseAdj(hard,'zi');
        } else {
            madCitizens(hard);
            playerInfos.encz.push('ce');
        }
    }
};

function putBastionAliens(hard) {
    dropEgg('Ruche','encounter');
    coconStats.volc = true;
    if (zone[0].mapDiff >= 3 && zone[0].mapDiff < 8 && zone[0].planet === 'Dom') {
        dropEgg('Ruche','encounter');
    }
    if (hard && playerInfos.cNeed < 1.2 && (playerInfos.cAdj > 3 || playerInfos.cLoss < 1500 || rand.rand(1,3) === 1)) {
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
    warning('<span class="rq3">Citoyens errants en vue!</span>','',false,encounterTileId);
    if (centreTileId >= 0) {
        // CITOYENS
        let dropTile;
        let citDice = 4;
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
            if (rand.rand(1,ruinsCrimChance) === 1) {
                citId = 225;
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
        if (rand.rand(1,citDice) === 1) {
            citId = 126;
            if (rand.rand(1,ruinsCrimChance) === 1) {
                citId = 225;
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
        // SURVIVANTS
        if (hard) {
            citId = 287;
            dropTile = checkDropSafe(centreTileId);
            unitIndex = unitTypes.findIndex((obj => obj.id == citId));
            conselUnit = unitTypes[unitIndex];
            conselAmmos = ['standard','lame','scrap','aucun'];
            conselPut = false;
            conselTriche = true;
            putBat(dropTile,0,0,'',false);
            playerOccupiedTiles.push(dropTile);
        }
        // SURVIVANTS
        if (rand.rand(1,citDice) === 1) {
            citId = 287;
            dropTile = checkDropSafe(centreTileId);
            unitIndex = unitTypes.findIndex((obj => obj.id == citId));
            conselUnit = unitTypes[unitIndex];
            conselAmmos = ['standard','lame','scrap','aucun'];
            conselPut = false;
            conselTriche = true;
            putBat(dropTile,0,0,'',false);
            playerOccupiedTiles.push(dropTile);
        }
        if (hard && (playerInfos.cAdj > 3 || playerInfos.cLoss < 1500)) {
            dropEgg('Veilleurs','encounter');
        }
    } else {
        console.log('No good tile!');
    }
};

function tooLate(hard) {
    console.log('TROP TARD');
    let centreTileId = checkEncounterTile();
    warning('<span class="rq3">Restes d\'une base en vue!</span>','',false,encounterTileId);
    if (centreTileId >= 0) {
        // Silo
        conselUnit = getBatTypeByName('Silo');
        conselAmmos = ['xxx','xxx','aucun','aucun'];
        conselPut = false;
        conselTriche = true;
        putBat(centreTileId,0,0,'nomove',false);
        playerOccupiedTiles.push(centreTileId);
        let bastion = getZoneBatByTileId(centreTileId);
        bastion.damage = rand.rand(1,50);
        bastion.squadsLeft = rand.rand(2,5);
        bastion.tags.push('camo');
        bastion.fuzz = -2;
        bastionRes(158,centreTileId);
        if (hard) {
            if (rand.rand(1,4) === 1) {
                pactole(158,centreTileId,true);
            } else {
                bastionRes(158,centreTileId);
            }
        }
        destroyedBase(centreTileId,true,hard);
        putBastionAliens(false);
    } else {
        console.log('No good tile!');
    }
};

function destroyedBase(centreTileId,destroyed,hard) {
    let aroundTilesIds = [];
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        let distance = calcDistance(centreTileId,tile.id);
        if (distance <= 3) {
            if (isOccupied(tile.id)) {
                // occupied
            } else {
                let chance = (distance*distance)+2;
                if (destroyed) {
                    chance = Math.ceil(chance/2);
                } else if (hard) {
                    chance = Math.ceil(chance/1.5);
                }
                if (rand.rand(1,chance) === 1) {
                    aroundTilesIds.push(tile.id);
                }
            }
        }
    });
    let numRu = 3;
    if (hard) {
        if (destroyed) {
            numRu = 0;
        } else {
            numRu = 1;
        }
    } else {
        if (destroyed) {
            numRu = 0;
        }
    }
    if (aroundTilesIds.length >= 1) {
        aroundTilesIds.forEach(function(tileId) {
            let tile = getTileById(tileId);
            if (Object.keys(tile).length >= 1) {
                if (!tile.ruins) {
                    if (tile.infra === undefined) {
                        if (tile.terrain != 'W' && tile.terrain != 'L' && tile.terrain != 'R') {
                            if (rand.rand(1,4) === 1 || numRu < 3) {
                                tile.ruins = true;
                                tile.sh = 15;
                                tile.rd = true;
                                delete tile.infra;
                                addScrapToRuins(tile);
                                checkRuinType(tile,true);
                                if (destroyed) {
                                    tile.rt.full = true;
                                }
                                numRu++;
                            } else if (rand.rand(1,2) === 1) {
                                tile.infra = 'Débris';
                                if (rand.rand(1,2) === 1) {
                                    tile.rd = true;
                                }
                            } else if (rand.rand(1,5) === 1) {
                                tile.infra = 'Miradors';
                                tile.rd = true;
                            } else if (rand.rand(1,25) === 1) {
                                tile.infra = 'Palissades';
                                tile.rd = true;
                            } else if (rand.rand(1,50) === 1) {
                                tile.infra = 'Terriers';
                                tile.rd = true;
                            }
                        }
                    }
                }
            }
        });
    }
};

function zoneIndustrielle(hard) {
    console.log('ZONE INDUSTRIELLE');
    let centreTileId = checkEncounterTile();
    warning('<span class="rq3">Zone industrielle en vue!</span>','',false,encounterTileId);
    if (centreTileId >= 0) {
        putIndusUnits(centreTileId,hard);
        bastionRes(3,centreTileId);
        if (hard) {
            bastionRes(3,centreTileId);
            bastionRes(3,centreTileId);
        }
        destroyedBase(centreTileId,false,hard);
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
        conselUnit = getBatTypeByName('Atelier');
        conselAmmos = ['tungsten','xxx','acier','w1-gun'];
    } else {
        conselUnit = getBatTypeByName('Atelier');
        conselAmmos = ['standard','xxx','aucun','w1-gun'];
    }
    conselPut = false;
    conselTriche = true;
    putBat(centreTileId,0,rand.rand(50,175),'nomove',false);
    playerOccupiedTiles.push(centreTileId);
    numUnits++;
    let bastion = getZoneBatByTileId(centreTileId);
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
        conselUnit = getBatTypeByName('Comptoir');
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
        thisUnit = getZoneBatByTileId(dropTile);
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
            conselUnit = getBatTypeByName('Pompe');
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
            thisUnit = getZoneBatByTileId(dropTile);
            if (hard) {
                thisUnit.squadsLeft = rand.rand(4,6);
            } else {
                thisUnit.squadsLeft = rand.rand(2,3);
            }
        }
    }
    // MINE
    dropTile = checkDropSafe(centreTileId);
    conselUnit = getBatTypeByName('Mine');
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
    let laMine = getZoneBatByTileId(dropTile);
    if (hard) {
        laMine.squadsLeft = rand.rand(4,6);
    } else {
        laMine.squadsLeft = rand.rand(2,3);
    }
    // MINE 2
    if (rand.rand(1,2) === 1 && hard) {
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeByName('Mine');
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
        thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
            thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
    warning('<span class="rq3">Camp de colons en vue!</span>','',false,encounterTileId);
    if (centreTileId >= 0) {
        putColonUnits(centreTileId,hard);
        bastionRes(157,centreTileId);
        if (hard) {
            bastionRes(157,centreTileId);
        }
        destroyedBase(centreTileId,false,hard);
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
    let bastion = getZoneBatByTileId(centreTileId);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
    thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
    minSapeurs = entre(minSapeurs,0,1);
    let maxSapeurs = 3-Math.floor(numWeap/2);
    maxSapeurs = entre(maxSapeurs,1,2);
    numUnits = rand.rand(minSapeurs,maxSapeurs);
    if (!hard) {
        numUnits = 1;
    }
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        let thisTile = getTileById(dropTile);
        if (hard) {
            thisTile.infra = 'Palissades';
        }
        if (rand.rand(1,2) === 1) {
            conselUnit = getBatTypeById(112);
            conselAmmos = ['perfo','lame','scrap','aucun'];
        } else {
            conselUnit = getBatTypeById(315);
            conselAmmos = ['perfo','molotov-feu','scrap','aucun'];
        }
        conselPut = false;
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
            thisUnit = getZoneBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(4,6);
        }
    }
}

function baseLabo(hard) {
    console.log('BASE DE RECHECRCHE');
    let centreTileId = checkEncounterTile();
    warning('<span class="rq3">Base scientifique en vue!</span>','',false,encounterTileId);
    if (centreTileId >= 0) {
        putLaboUnits(centreTileId,hard);
        bastionRes(206,centreTileId);
        if (hard) {
            pactole(206,centreTileId,true);
        }
        destroyedBase(centreTileId,false,hard);
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
    let bastion = getZoneBatByTileId(centreTileId);
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
    thisUnit = getZoneBatByTileId(dropTile);
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
                thisUnit = getZoneBatByTileId(dropTile);
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
            thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
    warning('<span class="rq3">Bastion de brigands en vue!</span>','',false,encounterTileId);
    if (centreTileId >= 0) {
        putHLLUnits(centreTileId,hard);
        bastionRes(224,centreTileId);
        if (hard) {
            bastionRes(224,centreTileId);
            pactole(224,centreTileId,true);
        }
        destroyedBase(centreTileId,false,hard);
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
        thisUnit = getZoneBatByTileId(centreTileId);
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
        thisUnit = getZoneBatByTileId(dropTile);
        thisUnit.damage = rand.rand(1,75);
        if (conselUnit.id === 178) {
            thisUnit.squadsLeft = rand.rand(3,4);
        } else {
            thisUnit.squadsLeft = rand.rand(2,3);
        }
    }
    let bastion = getZoneBatByTileId(centreTileId);
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
            conselAmmos = ['boulet-explosif','boulet-explosif','aucun','g2siege'];
            putBat(dropTile,0,rand.rand(25,100),'nomove',false);
            thisUnit = getZoneBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(3,4);
        } else if (playerInfos.gang === 'drogmulojs') {
            // Mutants
            conselUnit = getBatTypeById(53);
            conselAmmos = ['pn-perfo','lame-tungsten','bugium','lunette1'];
            thisTile.infra = 'Palissades';
            putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
            thisUnit = getZoneBatByTileId(dropTile);
            thisUnit.squadsLeft = rand.rand(5,7);
        } else if (playerInfos.gang === 'tiradores') {
            // Bandidos
            conselUnit = getBatTypeById(144);
            conselAmmos = ['perfo','perfo','scrap','silencieux2'];
            thisTile.infra = 'Palissades';
            putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
            thisUnit = getZoneBatByTileId(dropTile);
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
                if (rand.rand(1,3) === 1) {
                    conselAmmos[3] = 'e-camo';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'lunette1';
                }
                if (rand.rand(1,3) === 1) {
                    conselAmmos[3] = 'silencieux1';
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
                if (rand.rand(1,3) === 1) {
                    conselAmmos[3] = 'e-camo';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'lancegren';
                }
                if (rand.rand(1,5) === 1) {
                    conselAmmos[3] = 'gilet';
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
                    conselAmmos[3] = 'gilet';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'e-ranger';
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
                    conselAmmos[3] = 'chargeur2';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[0] = 'torche-feugre';
                }
            } else {
                conselAmmos = ['torche-feu','standard','scrap','aucun'];
            }
        } else if (playerInfos.gang === 'drogmulojs') {
            // Krimulos
            conselUnit = getBatTypeById(220);
            if (hard) {
                conselAmmos = ['perfo','lame-poison','scrap','e-ranger'];
                if (rand.rand(1,3) === 1) {
                    conselAmmos[3] = 'e-camo';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'chargeur1';
                }
            } else {
                conselAmmos = ['standard','lame','aucun','aucun'];
            }
        } else if (playerInfos.gang === 'rednecks') {
            // Gangsters
            conselUnit = getBatTypeById(218);
            if (hard) {
                conselAmmos = ['perfo','lame-poison','scrap','e-ranger'];
                if (rand.rand(1,3) === 1) {
                    conselAmmos[3] = 'e-camo';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'chargeur1';
                }
            } else {
                conselAmmos = ['standard','lame','scrap','aucun'];
            }
        } else if (playerInfos.gang === 'tiradores') {
            // Desperados
            conselUnit = getBatTypeById(221);
            if (hard) {
                conselAmmos = ['sm-perfo','lame','scrap','aucun'];
                if (rand.rand(1,3) === 1) {
                    conselAmmos[3] = 'e-camo';
                }
                if (rand.rand(1,2) === 1) {
                    conselAmmos[3] = 'chargeur1';
                }
            } else {
                conselAmmos = ['standard','lame','aucun','aucun'];
            }
        }
        conselPut = false;
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
        playerOccupiedTiles.push(dropTile);
        thisUnit = getZoneBatByTileId(dropTile);
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
            thisUnit = getZoneBatByTileId(dropTile);
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
                thisUnit = getZoneBatByTileId(dropTile);
                thisUnit.squadsLeft = rand.rand(4,6);
            }
        }
    }
}

function baseDeResistants(hard) {
    console.log('BASTION DE RESISTANTS');
    let centreTileId = checkEncounterTile();
    warning('<span class="rq3">Bastion de résistants en vue!</span>','',false,encounterTileId);
    if (centreTileId >= 0) {
        putBastionUnits(centreTileId,hard);
        bastionRes(262,centreTileId);
        if (hard) {
            bastionRes(262,centreTileId);
            bastionRes(262,centreTileId);
        }
        destroyedBase(centreTileId,false,hard);
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
    let bastion = getZoneBatByTileId(centreTileId);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
            thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
        thisUnit = getZoneBatByTileId(dropTile);
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
            thisUnit = getZoneBatByTileId(dropTile);
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

function bastionRes(bationUnitId,bastionTileId) {
    console.log('SURVIE');
    let coffre = getZoneBatByTileId(bastionTileId);
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
                if (res.name != 'Transorb' && res.name != 'Energie' && res.name != 'Energons' && res.name != 'Spins') {
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
            if (res.kinds != undefined) {
                if (res.kinds.includes('food')) {
                    thatResChance = thatResChance*2;
                }
            }
            if (res.name === 'Scrap') {
                thatResChance = thatResChance*3;
            }
            if (res.planets != undefined) {
                let planetName = zone[0].planet;
                thatResChance = Math.ceil(thatResChance*res.planets[planetName]);
            }
            console.log(res.name+' '+thatResChance);
            if (rand.rand(1,500) <= thatResChance) {
                thatResNum = Math.ceil(Math.sqrt(Math.sqrt(thatResChance))*mapFactor*1.5*rand.rand(4,16))+rand.rand(0,9);
                thatResNum = Math.ceil(thatResNum*150/mineRateDiv);
                if (res.name == 'Nourriture' || res.name == 'Eau') {
                    thatResNum = thatResNum*2;
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
    });
};

function pactole(bationUnitId,bastionTileId,withTrans) {
    console.log('PACTOLE');
    let coffre = getZoneBatByTileId(bastionTileId);
    let totalRes = 0;
    let thatResChance = 0;
    let thatResNum = 0;
    let mapFactor = Math.round(((Math.sqrt(zone[0].mapDiff+2)*10)+zone[0].mapDiff)/8);
    let resFactor;
    let shufRes = _.shuffle(resTypes);
    shufRes.forEach(function(res) {
        if (res.name != 'Magma' && res.name != 'Transorb' && res.cat != 'alien' && (res.cat != 'transfo' || withTrans) && (res.name != 'Spins' || bationUnitId === 206)) {
            if (res.rarity <= 16) {
                thatResChance = 0;
                thatResNum = 0;
                resFactor = res.rarity+res.rarity+Math.round(zone[0].mapDiff*3);
                thatResChance = Math.ceil(resFactor/3*res.batch/2);
                if (res.name === 'Spins') {
                    thatResChance = 6;
                }
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
                    if (res.name === 'Spins') {
                        thatResNum = Math.ceil(thatResNum/10);
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

function checkInDanger(bat,batType) {
    let inDanger = false;
    if (batType.skills.includes('nofight') && bat.damage >= 1) {
        inDanger = true;
    }
    let hpBase = (batType.squads*batType.squadSize*batType.hp);
    let hpLeft = (bat.squadsLeft*batType.squadSize*batType.hp)-bat.damage;
    let hpDanger = (hpBase/3);
    if (hpLeft <= hpDanger) {
        inDanger = true;
    }
    return inDanger;
};

function checkNoAuthority(bat,batType) {
    let noAuthority = false;
    if (batType.skills.includes('nofight')) {
        noAuthority = true;
    }
    if (batType.crew === 0) {
        if (batType.skills.includes('robot')) {
            if (hasEquip(bat,['g2ai'])) {
                // rien
            } else {
                noAuthority = true;
            }
        } else {
            noAuthority = true;
        }
    }
    if (bat.tags.includes('nopilots')) {
        let selfMove = checkSelfMove(bat,batType);
        if (!selfMove) {
            noAuthority = true;
        }
    }
    if (batType.skills.includes('dog')) {
        noAuthority = true;
    }
    let hpBase = (batType.squads*batType.squadSize*batType.hp);
    let hpLeft = (bat.squadsLeft*batType.squadSize*batType.hp)-bat.damage;
    let hpDanger = Math.round(hpBase/3);
    if (!bat.tags.includes('outsider')) {
        let leadershipEffect = Math.ceil(playerInfos.comp.ordre*playerInfos.comp.ordre/1.33);
        hpDanger = Math.round(hpBase/(3+leadershipEffect));
    }
    if (hpLeft <= hpDanger) {
        noAuthority = true;
    }
    return noAuthority;
};

function nomoveOut(myBat) {
    let myBatType = getBatType(myBat);
    if (!myBatType.skills.includes('nomove')) {
        tagDelete(myBat,'nomove');
        myBat.army = 21;
        playerInfos.gangXP = playerInfos.gangXP+5;
        if (!myBatType.skills.includes('nolist')) {
            warning(myBatType.name,'Ce bataillon passe sous votre contrôle',false,myBat.tileId);
            playSound('clic12',-0.2);
        }
        showMap(zone,true);
        if (myBatType.skills.includes('transorbital')) {
            if (!myBat.tags.includes('deploy')) {
                myBat.tags.push('deploy');
            }
        }
        if (myBat.transIds != undefined) {
            bataillons.forEach(function(bat) {
                if (myBat.transIds.includes(bat.id)) {
                    tagDelete(bat,'nomove');
                    bat.army = 21;
                    playerInfos.gangXP = playerInfos.gangXP+5;
                    warning(bat.type,'Ce bataillon passe sous votre contrôle',false,bat.tileId);
                }
            });
        }
    }
};

function removeNoMoves(myBat) {
    let myBatType = getBatType(myBat);
    let nevMove = false;
    if (zone[0].neverMove != undefined) {
        if (zone[0].neverMove) {
            nevMove = true;
        }
    }
    if (!nevMove) {
        if (myBat.type != 'Silo' && myBatType.cat === 'buildings') {
            bataillons.forEach(function(bat) {
                let batType = getBatType(bat);
                if (bat.tags.includes('nomove') && !batType.skills.includes('nomove')) {
                    tagDelete(bat,'nomove');
                    bat.army = 21;
                    if (!batType.skills.includes('nolist')) {
                        warning(bat.type,'Ce bataillon passe sous votre contrôle',false,bat.tileId);
                    }
                }
            });
        }
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
};

function letsHunt(multi) {
    let huntType = {};
    if (zone[0].hunt === undefined) {
        huntType = getHuntType();
    } else {
        huntType = zone[0].hunt;
    }
    if (multi) {
        let i = 1;
        while (i <= huntType.max) {
            if (rand.rand(1,100) <= huntType.chance) {
                dropEgg(huntType.game,'none');
                if (rand.rand(1,2) === 1) {
                    let gameBat = getAlienByName(huntType.game);
                    alienSpawn(gameBat,huntType.game);
                    if (rand.rand(1,2) === 1) {
                        alienSpawn(gameBat,huntType.game);
                    }
                }
            }
            if (i > 50) {break;}
            i++
        }
    } else {
        if (rand.rand(1,100) <= huntType.chance) {
            dropEgg(huntType.game,'none');
            if (rand.rand(1,2) === 1) {
                let gameBat = getAlienByName(huntType.game);
                alienSpawn(gameBat,huntType.game);
            }
        }
    }
};

function getHuntType() {
    let huntType = {};
    huntType.game = 'Rats';
    huntType.chance = 10;
    huntType.max = 7;
    let waterTiles = zone[0].pw+zone[0].ps+zone[0].pr;
    let huntDice = rand.rand(1,12);
    if (waterTiles >= 30) {
        huntType.chance = Math.round(waterTiles/3);
        huntType.max = Math.round(waterTiles/3);
        if (huntDice >= 4) {
            huntType.game = 'Crocos';
        } else {
            huntType.game = 'Tritons';
        }
    } else if (zone[0].pb+zone[0].pf >= 50) {
        huntType.chance = 15;
        huntType.max = Math.round(zone[0].pf/3);
        if (huntDice >= 9) {
            huntType.game = 'Tritons';
        } else {
            huntType.game = 'Rats';
        }
    } else if (zone[0].pp+zone[0].pg >= 50) {
        huntType.chance = 7;
        huntType.max = Math.round(zone[0].pg/2);
        if (huntDice >= 7) {
            huntType.game = 'Meatballs';
            huntType.max = Math.ceil(huntType.max/2);
        } else {
            huntType.game = 'Rats';
        }
    } else {
        huntType.chance = 10;
        huntType.max = 7;
        let water = Math.round((zone[0].pw+zone[0].ps+zone[0].pr)/5);
        if (huntDice <= water) {
            huntType.game = 'Crocos';
        } else if (huntDice === 12) {
            huntType.game = 'Tritons';
        } else if (huntDice >= 8) {
            huntType.game = 'Meatballs';
            huntType.max = Math.ceil(huntType.max/2);
        } else {
            huntType.game = 'Rats';
        }
    }
    if (huntType.max < 7) {
        huntType.max = 7;
    }
    if (zone[0].planet === 'Horst') {
        huntType.chance = 5;
        huntType.game = 'Rats';
    } else if (zone[0].planet === 'Kzin') {
        if (waterTiles >= 10) {
            huntType.chance = Math.ceil(waterTiles/3);
            huntType.max = Math.round(waterTiles/3);
            huntType.game = 'Crocos';
        } else {
            huntType.chance = 10;
            huntType.game = 'Meatballs';
            huntType.max = 4;
        }
    } else if (zone[0].planet === 'Gehenna') {
        huntType.chance = 25;
        huntType.game = 'Tritons';
    } else if (zone[0].planet === 'Sarak') {
        huntType.chance = 20;
        huntType.game = 'Meatballs';
        huntType.max = 7;
    }
    huntType.chance = Math.ceil(huntType.chance/(zone[0].mapDiff+8)*9);
    if (zone[0].hunt === undefined) {
        zone[0].hunt = huntType;
    }
    return huntType;
};

function putTurret(tile) {
    delete tile.ruins;
    delete tile.sh;
    delete tile.rt;
    removeScrapFromRuins(tile);
    if (rand.rand(1,8) === 1) {
        conselUnit = getBatTypeById(301);
        conselAmmos = getTurretGear(301);
    } else {
        conselUnit = getBatTypeById(310);
        conselAmmos = getTurretGear(310);
    }
    conselPut = false;
    conselTriche = true;
    putBat(tile.id,0,rand.rand(50,1000),'camobld',false);
    let tBat = getLastBatCreated();
    if (tBat.type === 'Autobunkers' || tBat.type === 'Autoturrets') {
        let d1 = rand.rand(1,4);
        let d2 = rand.rand(1,4);
        if (d1 > d2) {
            tBat.squadsLeft = d1;
        } else {
            tBat.squadsLeft = d2;
        }
    }
    playerOccupiedTiles.push(tile.id);
};

function getTurretGear(unitId) {
    let tGear = [];
    let mun = 'uranium';
    let dice = rand.rand(1,5);
    if (dice === 1) {
        mun = 'freeze';
    } else if (dice === 2) {
        mun = 'salite';
    } else if (dice === 3) {
        mun = 'timonium';
    }
    tGear.push(mun);
    tGear.push('xxx');
    let blindage = 'bulk';
    dice = rand.rand(1,5);
    if (dice === 1) {
        blindage = 'autorep';
    } else if (dice === 2) {
        blindage = 'bonibo';
    } else if (dice === 3) {
        blindage = 'swag';
    }
    tGear.push(blindage);
    if (unitId === 301) {
        tGear.push('bld-camo');
    } else {
        if (rand.rand(1,4) === 1) {
            tGear.push('bld-camo');
        } else {
            tGear.push('muffler');
        }
    }
    return tGear;
};

function workingTurrets() {
    alienOccupiedTileList();
    playerOccupiedTileList();
    if (!zone[0].visit && zone[0].number < 50) {
        let turretsNum = 0;
        let baseDice = 5;
        let maxTurrets = Math.ceil(zone[0].mapDiff/3)+rand.rand(0,4);
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                if (tile.ruins && turretsNum < maxTurrets) {
                    if (tile.rt != undefined) {
                        if (tile.rt.name === 'Autoturrets') {
                            let turretDice = baseDice+(turretsNum*3);
                            if (rand.rand(1,turretDice) === 1) {
                                putTurret(tile);
                                turretsNum++;
                            }
                        }
                    }
                }
            }
        });
    }
};
