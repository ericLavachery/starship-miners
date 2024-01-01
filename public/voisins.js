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
        let maxCheck = 67;
        if (playerInfos.cNeed >= 1) {
            maxCheck = 97-Math.round(playerInfos.cNeed*30);
        }
        let check = rand.rand(5,maxCheck);
        if (check < 15) {
            check = check+15;
        }
        let reCheck = rand.rand(5,maxCheck);
        if (reCheck < 15) {
            reCheck = reCheck+15;
        }
        let theCheck = check;
        if (reCheck > check) {
            theCheck = reCheck;
        }
        if (zone[0].planet === 'Kzin') {
            theCheck = theCheck+5;
        }
        if (zone[0].planet === 'Horst') {
            if (rand.rand(1,3) === 1) {
                theCheck = 999;
            }
        }
        if (zone[0].planet === 'Gehenna') {
            if (rand.rand(1,4) === 1) {
                theCheck = 999;
            }
        }
        if (theCheck > 55) {
            theCheck = 999;
        }
        playerInfos.vz = theCheck;
        let card = rand.rand(1,4);
        if (card === 1) {
            playerInfos.vc = 'nord';
        } else if (card === 2) {
            playerInfos.vc = 'sud';
        } else if (card === 3) {
            playerInfos.vc = 'ouest';
        } else {
            playerInfos.vc = 'est';
        }
    }
};

function neighbours() {
    if (playerInfos.mapTurn === 30 && playerInfos.vz > 43) {
        let numEvents = getNumEvents();
        numEvents = Math.floor(numEvents*numEvents/2/playerInfos.cNeed);
        numEvents = entre(numEvents,1,100);
        if (rand.rand(1,numEvents) === 1) {
            let turnz = rand.rand(1,12);
            if (playerInfos.vz === 999) {
                let card = rand.rand(1,4);
                if (card === 1) {
                    playerInfos.vc = 'nord';
                } else if (card === 2) {
                    playerInfos.vc = 'sud';
                } else if (card === 3) {
                    playerInfos.vc = 'ouest';
                } else {
                    playerInfos.vc = 'est';
                }
            }
            playerInfos.vz = 31+turnz;
        }
    }
    if (playerInfos.vz <= playerInfos.mapTurn) {
        lesVoisins();
    }
};

function getNumEvents() {
    let caves = 0;
    if (zone[0].caves != undefined) {
        caves = zone[0].caves;
    }
    let numEvents = playerInfos.fndCits+caves;
    return numEvents;
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
    let numEvents = getNumEvents();
    let eventsBonus = 42-(numEvents*7);
    if (eventsBonus < 1) {eventsBonus = 0}
    let transChance = Math.ceil(((playerInfos.mapDiff*3)+15+eventsBonus)*playerInfos.cNeed);
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
        if (rand.rand(1,14-playerInfos.mapDiff) === 1) {
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
        let pDice = 3;
        if (playerInfos.cNeed > 1) {
            pDice = Math.floor(3/playerInfos.cNeed);
        } else {
            pDice = Math.ceil(3/playerInfos.cNeed);
        }
        if (rand.rand(1,pDice) === 1) {
            pietonBatTypeId = checkPietonId();
            neiBatType = getBatTypeById(pietonBatTypeId);
            putNeighbour(neiBatType);
        }
        if (rand.rand(1,pDice+2) === 1) {
            pietonBatTypeId = checkPietonId();
            neiBatType = getBatTypeById(pietonBatTypeId);
            putNeighbour(neiBatType);
        }
    }
    // Véhicules
    if (rand.rand(1,6-Math.round(playerInfos.mapDiff/2)) === 1) {
        let vehBatTypeId = checkVehicleId();
        let neiBatType = getBatTypeById(vehBatTypeId);
        putNeighbour(neiBatType);
    }
    if (rand.rand(1,12-playerInfos.mapDiff) === 1) {
        let vehBatTypeId = checkVehicleId();
        let neiBatType = getBatTypeById(vehBatTypeId);
        putNeighbour(neiBatType);
    }
    if (neiRoad[0] && !neiRoad[1]) {
        let roadDice = rand.rand(1,3);
        if (roadDice === 1) {
            // Sapeurs
            let neiBatType = getBatTypeByName('Sapeurs');
            putNeighbour(neiBatType);
        } else if (roadDice === 2) {
            // Mulets
            let neiBatType = getBatTypeByName('Mulets');
            putNeighbour(neiBatType);
        } else {
            // Mineurs
            let neiBatType = getBatTypeByName('Mineurs');
            putNeighbour(neiBatType);
        }
    }
    if (lastNeiTileId >= 0) {
        warning('<span class="rq3">Convoi de survivants en vue</span>','<span class="vio">Attirés par le bruit, des survivants sont venus à votre rencontre.</span>',false,lastNeiTileId);
        lastNeiTileId = -1;
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
        playerInfos.fndCits = playerInfos.fndCits+1;
        let transBat = getZoneBatByTileId(vTileId);
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
        playerInfos.fndCits = playerInfos.fndCits+1;
        let neiBat = getBatByTileId(vTileId);
        loadBat(neiBat.id,transBat.id);
    }
};

function checkPietonId(transBat) {
    let inHosto = false;
    let inVeh = true;
    if (transBat != undefined) {
        if (transBat.name === 'Hostos') {
            inHosto = true;
        }
    } else {
        inVeh = false;
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
    } else if (pietonDice <= 13 && !inVeh) {
        let bt = getBatTypeByName('Sapeurs');
        pietonBatTypeId = bt.id;
        neiRoad[1] = true;
    } else if (pietonDice <= 15) {
        let bt = getBatTypeByName('Monkeys');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 16 && !inHosto) {
        let bt = getBatTypeByName('Criminels');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 21 && inHosto) {
        let bt = getBatTypeByName('Infirmiers');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 21) {
        let bt = getBatTypeByName('Citoyens');
        pietonBatTypeId = bt.id;
    } else if (pietonDice <= 26 && inVeh) {
        let bt = getBatTypeByName('Citoyens');
        pietonBatTypeId = bt.id;
    } else {
        let bt = getBatTypeByName('Survivants');
        pietonBatTypeId = bt.id;
    }
    return pietonBatTypeId;
};

function checkVehicleId() {
    let vehBatTypeId = -1;
    let vehDice = rand.rand(1,20);
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
    } else if (vehDice <= 9) {
        let bt = getBatTypeByName('Mécanos');
        vehBatTypeId = bt.id;
        neiRoad[0] = true;
    } else if (vehDice <= 12) {
        let bt = getBatTypeByName('Looters');
        vehBatTypeId = bt.id;
    } else if (vehDice <= 13) {
        let bt = getBatTypeByName('Drilltrucks');
        vehBatTypeId = bt.id;
        neiRoad = [true,true];
    } else if (vehDice <= 14) {
        let bt = getBatTypeByName('Minitanks');
        vehBatTypeId = bt.id;
    } else if (vehDice <= 15) {
        let bt = getBatTypeByName('Scouts');
        vehBatTypeId = bt.id;
    } else if (vehDice <= 17) {
        let bt = getBatTypeByName('Workships');
        vehBatTypeId = bt.id;
        neiRoad = [true,true];
    } else {
        let bt = getBatTypeByName('Pushers');
        vehBatTypeId = bt.id;
        neiRoad = [true,true];
    }
    let unit = getBatTypeById(vehBatTypeId);
    let minDiff = checkMinMapDiff(unit);
    if (minDiff > zone[0].mapDiff) {
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
    if (neiBatType.name === 'Monkeys') {
        gear = ['perfo','molotov-feu','kevlar','aucun'];
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
    if (neiBatType.name === 'Drilltrucks') {
        gear = ['perfo','standard','kanchan','e-road'];
    }
    if (neiBatType.name === 'Minitanks') {
        if (playerInfos.gang === 'drogmulojs' || playerInfos.gang === 'bulbos') {
            gear = ['tungsten','obus','kanchan','snorkel'];
        } else {
            gear = ['tungsten','cn-proto-plasma','kanchan','snorkel'];
        }
    }
    if (neiBatType.name === 'Scouts') {
        gear = ['tungsten','obus','kanchan','chargeur1'];
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

function isCardinalOK(tile) {
    let cardOK = true;
    if (playerInfos.vc != undefined) {
        if (playerInfos.vc === 'nord') {
            if (tile.x >= 5) {
                cardOK = false;
            }
        }
        if (playerInfos.vc === 'sud') {
            if (tile.x <= 56) {
                cardOK = false;
            }
        }
        if (playerInfos.vc === 'ouest') {
            if (tile.y >= 5) {
                cardOK = false;
            }
        }
        if (playerInfos.vc === 'est') {
            if (tile.y <= 56) {
                cardOK = false;
            }
        }
    }
    return cardOK;
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
                    if (isCardinalOK(tile)) {
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
                }
            } else {
                if (tile.x === 1 || tile.x === 60 || tile.y === 1 || tile.y === 60) {
                    if (isCardinalOK(tile)) {
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
        }
    });
    if (vTileId < 0) {
        shufZone.forEach(function(tile) {
            if (vTileId < 0) {
                if (nearTileId >= 0) {
                    if (tile.x <= 2 || tile.x >= 59 || tile.y <= 2 || tile.y >= 59) {
                        if (isCardinalOK(tile)) {
                            if (!koTerrains.includes(tile.terrain) || tile.rd) {
                                if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                                    let distance = calcDistance(nearTileId,tile.id);
                                    if (distance <= 3) {
                                        vTileId = tile.id;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (tile.x === 1 || tile.x === 60 || tile.y === 1 || tile.y === 60) {
                        if (isCardinalOK(tile)) {
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
    }
    return vTileId;
};

function checkCitCaves() {
    console.log('---------------------------- checkCitCaves');
    let hasCaves = true;
    if (zone[0].caves != undefined) {
        if (zone[0].caves >= 3) {
            hasCaves = false;
        }
    }
    if (zone[0].visit) {
        hasCaves = false;
    }
    if (hasCaves) {
        let fruitTiles = 0;
        let ruinTiles = 0;
        if (zone[0].nfru === undefined || zone[0].nruin === undefined) {
            zone.forEach(function(tile) {
                if (tile.rq != undefined) {
                    if (Object.keys(tile.rs).length >= 1) {
                        if (tile.rs['Fruits'] != undefined) {
                            fruitTiles++;
                        }
                    }
                }
                if (tile.ruins) {
                    ruinTiles++;
                }
            });
            zone[0].nfru = fruitTiles;
            zone[0].nruin = ruinTiles;
        } else {
            fruitTiles = zone[0].nfru;
            ruinTiles = zone[0].nruin;
        }
        console.log(fruitTiles+' - '+ruinTiles);
        let fmr = (fruitTiles*2)-ruinTiles+25;
        if (fmr < 1) {fmr = 1;}
        let chance = Math.ceil(Math.sqrt(fmr)/1.75);
        console.log('chance '+chance);
        if (playerInfos.mapTurn < 15) {
            chance = chance-Math.ceil((15-playerInfos.mapTurn)/2);
        }
        if (zone[0].caves != undefined) {
            chance = chance-Math.floor(zone[0].caves);
        }
        chance = chance-playerInfos.fndCits+2;
        chance = Math.round(chance*playerInfos.cNeed);
        chance = entre(chance,1,7);
        console.log('chance '+chance);
        // chance = 100;
        if (chance >= 1) {
            if (rand.rand(1,100) <= chance) {
                playerOccupiedTileList();
                alienOccupiedTileList();
                let caveTileId = -1;
                let shufZone = _.shuffle(zone);
                shufZone.forEach(function(tile) {
                    if (caveTileId < 0) {
                        if (tile.rq != undefined) {
                            if (Object.keys(tile.rs).length >= 1) {
                                if (tile.rs['Fruits'] != undefined) {
                                    if (!tile.ruins) {
                                        if (tile.infra === undefined) {
                                            if (tile.x < 15 || tile.x > 45 || tile.y < 15 || tile.y > 45) {
                                                if (!playerOccupiedTiles.includes(tile.id)) {
                                                    if (!alienOccupiedTiles.includes(tile.id)) {
                                                        caveTileId = tile.id;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                if (caveTileId >= 0) {
                    putCitCave(caveTileId);
                }
            }
        }
    }
};

function putCitCave(caveTileId) {
    let tile = getTileById(caveTileId);
    tile.infra = 'Terriers';
    if (zone[0].caves === undefined) {
        zone[0].caves = 1;
    } else {
        zone[0].caves = zone[0].caves+1;
    }
    playerInfos.fndCits = playerInfos.fndCits+1;
    if (rand.rand(1,3) === 1) {
        warning('<span class="rq3">Survivants en vue!</span>','<span class="vio">Des survivants sont sortis de leur sous-terrain.</span>',false,caveTileId);
        let citId = 287;
        unitIndex = unitTypes.findIndex((obj => obj.id == citId));
        conselUnit = unitTypes[unitIndex];
        conselAmmos = ['standard','lame','scrap','aucun'];
        conselPut = false;
        conselTriche = true;
        putBat(caveTileId,0,0,'',false,false);
        playerOccupiedTiles.push(caveTileId);
    } else {
        warning('<span class="rq3">Citoyens en vue!</span>','<span class="vio">Des citoyens sont sortis de leur sous-terrain.</span>',false,caveTileId);
        let citId = 126;
        if (rand.rand(1,ruinsCrimChance) === 1) {
            citId = 225;
        }
        let numCit = rand.rand(1,12)*6;
        unitIndex = unitTypes.findIndex((obj => obj.id == citId));
        conselUnit = unitTypes[unitIndex];
        conselAmmos = ['lame-scrap','xxx','aucune','aucun'];
        conselPut = false;
        conselTriche = true;
        putBat(caveTileId,numCit,0,'',false,false);
        playerOccupiedTiles.push(caveTileId);
    }
};
