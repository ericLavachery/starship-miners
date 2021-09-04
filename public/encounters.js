function encounter() {
    let encDice = rand.rand(0,28);
    if (encDice === 0 || encDice === 1 || encDice === 2 || encDice === 3) {
        baseDeResistants();
    } else if (encDice === 4 || encDice === 5 || encDice === 6) {
        horsLaLoi();
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
    } else if (encDice === 14 || encDice === 15) {
        tooLate();
    } else {
        madCitizens();
    }
};

function tooLate() {
    console.log('TROP TARD');
    let centreTileId = checkEncounterTile();
    if (centreTileId >= 0) {
        // Silo
        conselUnit = getBatTypeById(158);
        conselAmmos = ['xxx','xxx','aucun','aucun'];
        conselPut = false;
        conselTriche = true;
        putBat(centreTileId,0,0,'nomove',false);
        playerOccupiedTiles.push(centreTileId);
        bastionRes(centreTileId);
        if (rand.rand(1,4) === 1) {
            pactole(centreTileId);
        } else {
            bastionRes(centreTileId);
        }
        putBastionAliens(true);
    } else {
        console.log('No good tile!');
    }
};

function horsLaLoi() {
    console.log('HORS LA LOI');
    let centreTileId = checkEncounterTile();
    if (centreTileId >= 0) {
        putHLLUnits(centreTileId);
        bastionRes(centreTileId);
        bastionRes(centreTileId);
        pactole(centreTileId);
        putBastionAliens(true);
    } else {
        console.log('No good tile!');
    }
};

function putHLLUnits(centreTileId) {
    zone[centreTileId].rd = true;
    addRoad(centreTileId);
    let dropTile;
    let tech = rand.rand(Math.floor(zone[0].mapDiff/2),zone[0].mapDiff+3);
    let numUnits = 1;
    let totalUnits = 1;
    let bldBonus = false;
    let unitIndex;
    if (zone[0].mapDiff >= rand.rand(5,8)) {
        if (playerInfos.gang != 'blades') {
            bldBonus = true;
        }
    }
    // BATIMENT BASE
    if (!bldBonus || playerInfos.gang != 'detruas') {
        if (playerInfos.gang === 'bulbos') {
            // Prisons
            conselUnit = getBatTypeById(224);
            conselAmmos = ['explosive','xxx','acier','w1-ggun'];
        } else if (playerInfos.gang === 'detruas') {
            // Poudrière
            conselUnit = getBatTypeById(29);
            conselAmmos = ['explosive','grenade','acier','w2-explo'];
        } else if (playerInfos.gang === 'blades' || playerInfos.gang === 'tiradores') {
            // Atelier
            conselUnit = getBatTypeById(3);
            conselAmmos = ['perfo','dynamite','acier','w2-dyna'];
        } else if (playerInfos.gang === 'brasier') {
            // Derrick
            conselUnit = getBatTypeById(124);
            conselAmmos = ['perfo','lf-napalm','acier','w2-fire'];
        } else if (playerInfos.gang === 'drogmulojs') {
            // Décharge
            conselUnit = getBatTypeById(203);
            conselAmmos = ['teflon','dynamite-nitrate','acier','w2-dyna'];
        } else if (playerInfos.gang === 'rednecks') {
            // Bar
            conselUnit = getBatTypeById(215);
            conselAmmos = ['perfo','molotov-feu','acier','w2-molo'];
        }
        conselPut = false;
        conselTriche = true;
        putBat(centreTileId,0,rand.rand(50,175),'nomove',false);
        playerOccupiedTiles.push(centreTileId);
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
    }
    let bastion = getBatByTileId(centreTileId);
    // INFIRMIERS (dans le bastion)
    if (rand.rand(1,3) === 1) {
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
    if (rand.rand(1,3) === 1) {
        dropTile = checkDropSafe(centreTileId);
        let thisTile = getTileById(dropTile);
        conselPut = false;
        conselTriche = true;
        if (playerInfos.gang === 'blades') {
            // Trébuchet
            conselUnit = getBatTypeById(145);
            conselAmmos = ['lame-poison','boulet-explosif','aucun','g2siege'];
            putBat(dropTile,0,rand.rand(25,100),'nomove',false);
        } else if (playerInfos.gang === 'drogmulojs') {
            // Mutants
            conselUnit = getBatTypeById(53);
            conselAmmos = ['pn-perfo','lame-tungsten','bugium','lunette1'];
            thisTile.infra = 'Palissades';
            putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
        } else if (playerInfos.gang === 'tiradores') {
            // Bandidos
            conselUnit = getBatTypeById(144);
            conselAmmos = ['perfo','perfo','scrap','silencieux2'];
            thisTile.infra = 'Palissades';
            putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
        }
        playerOccupiedTiles.push(dropTile);
    }
    // HLL
    let maxUnits = Math.floor(zone[0].mapDiff/4)+3;
    numUnits = rand.rand(1,maxUnits);
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        let thisTile = getTileById(dropTile);
        thisTile.infra = 'Palissades';
        if (playerInfos.gang === 'bulbos') {
            // Détenus
            conselUnit = getBatTypeById(217);
            conselAmmos = ['perfo','lame-poison','scrap','lunette1'];
            if (rand.rand(1,4) === 1) {
                conselAmmos[3] = 'e-camo';
            }
            if (rand.rand(1,3) === 1) {
                conselAmmos[3] = 'crimekitch';
            }
        } else if (playerInfos.gang === 'detruas') {
            // Sinyaki
            conselUnit = getBatTypeById(223);
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
        } else if (playerInfos.gang === 'blades') {
            // Raiders
            conselUnit = getBatTypeById(219);
            conselAmmos = ['fleche-poison','fleche-poison','scrap','e-camo'];
            if (rand.rand(1,3) === 1) {
                conselAmmos[3] = 'crimekitgi';
            }
        } else if (playerInfos.gang === 'brasier') {
            // Tôlards
            conselUnit = getBatTypeById(222);
            conselAmmos = ['torche-feu','perfo','scrap','chargeur2'];
            if (rand.rand(1,2) === 1) {
                conselAmmos[0] = 'torche-feugre';
            }
            if (rand.rand(1,3) === 1) {
                conselAmmos[3] = 'crimekitch';
            }
        } else if (playerInfos.gang === 'drogmulojs') {
            // Krimulos
            conselUnit = getBatTypeById(220);
            conselAmmos = ['perfo','lame-poison','scrap','e-ranger'];
            if (rand.rand(1,4) === 1) {
                conselAmmos[3] = 'e-camo';
            }
            if (rand.rand(1,3) === 1) {
                conselAmmos[3] = 'crimekitch';
            }
        } else if (playerInfos.gang === 'rednecks') {
            // Gangsters
            conselUnit = getBatTypeById(218);
            conselAmmos = ['perfo','lame-poison','scrap','e-ranger'];
            if (rand.rand(1,3) === 1) {
                conselAmmos[3] = 'crimekitch';
            }
        } else if (playerInfos.gang === 'tiradores') {
            // Desperados
            conselUnit = getBatTypeById(221);
            conselAmmos = ['sm-perfo','lame','scrap','aucun'];
            if (rand.rand(1,4) === 1) {
                conselAmmos[3] = 'e-camo';
            }
            if (rand.rand(1,2) === 1) {
                conselAmmos[3] = 'chargeur1';
            }
            if (rand.rand(1,4) === 1) {
                conselAmmos[3] = 'crimekitch';
            }
        }
        conselPut = false;
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fgnomove',false);
        playerOccupiedTiles.push(dropTile);
    }
    // PIEGES
    if (playerInfos.gang === 'blades' || (rand.rand(1,2) === 1 && playerInfos.gang === 'brasier')) {
        numUnits = rand.rand(2,5);
        for (var i = 0; i < numUnits; i++){
            dropTile = checkDropSafe(centreTileId);
            conselUnit = getBatTypeById(237);
            conselAmmos = ['trap','trap-suicide','aucun','aucun'];
            conselPut = false;
            conselTriche = true;
            putBat(dropTile,0,rand.rand(25,100),'nomove',false);
            playerOccupiedTiles.push(dropTile);
        }
    }
    // CHAMPS DE MINES
    if (playerInfos.gang === 'detruas' || (rand.rand(1,3) === 1 && (playerInfos.gang === 'bulbos' || playerInfos.gang === 'rednecks'))) {
        numUnits = rand.rand(1,2);
        for (var i = 0; i < numUnits; i++){
            dropTile = checkDrop(centreTileId);
            conselUnit = getBatTypeById(43);
            conselAmmos = ['mine','suicide','aucun','aucun'];
            conselPut = false;
            conselTriche = true;
            putBat(dropTile,0,rand.rand(25,100),'nomove',false);
            playerOccupiedTiles.push(dropTile);
        }
    }
}

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
        dropEgg('Veilleurs','encounter');
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
        putBastionAliens(true);
    } else {
        console.log('No good tile!');
    }
};

function putBastionAliens(cocon) {
    dropEgg('Ruche','encounter');
    if (cocon) {
        dropEgg('Cocon','encounter');
    }
    if (zone[0].mapDiff >= rand.rand(5,15)) {
        dropEgg('Ruche','encounter');
    }
    let numVeil = rand.rand(1,3);
    for (var i = 0; i < numVeil; i++){
        dropEgg('Veilleurs','encounter');
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

function putBastionUnits(centreTileId) {
    zone[centreTileId].rd = true;
    addRoad(centreTileId);
    // BASTION
    let dropTile;
    let tech = rand.rand(Math.floor(zone[0].mapDiff/2),zone[0].mapDiff+3);
    let numUnits = 1;
    let totalUnits = 1;
    conselUnit = getBatTypeById(262);
    conselPut = false;
    conselAmmos = ['perfo','ac-standard','acier','aucun'];
    encounterAmmos(tech);
    conselTriche = true;
    putBat(centreTileId,0,rand.rand(50,175),'',false);
    playerOccupiedTiles.push(centreTileId);
    let bastion = getBatByTileId(centreTileId);
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
        encounterAmmos(tech);
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(unitId);
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
        encounterAmmos(tech);
        dropTile = checkDropSafe(centreTileId);
        conselUnit = getBatTypeById(unitId);
        putBat(dropTile,0,rand.rand(25,100),'',false);
        playerOccupiedTiles.push(dropTile);
    }
    // RETRANCHEMENTS
    numUnits = rand.rand(0,2);
    totalUnits = totalUnits+numUnits;
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        let thisTile = getTileById(dropTile);
        thisTile.infra = 'Palissades';
        conselUnit = getBatTypeById(263);
        conselPut = false;
        conselAmmos = ['perfo','perfo','acier','silencieux2'];
        encounterAmmos(tech);
        conselTriche = true;
        putBat(dropTile,0,rand.rand(50,175),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
    }
    // SAPEURS
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
    }
    // INFIRMIERS (dans le bastion)
    if (rand.rand(1,3) === 1) {
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
        if (rand.rand(1,2) === 1) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
        conselUnit = getBatTypeById(27);
        conselPut = false;
        conselAmmos = ['perfo','grenade','scrap','e-camo'];
        encounterAmmos(tech);
        conselTriche = true;
        putBat(dropTile,0,rand.rand(25,100),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
    }
    // MINEURS
    if (rand.rand(1,4) === 1) {
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
    }
    // RESISTANTS
    let maxUnits = Math.ceil(zone[0].mapDiff/2)+2;
    numUnits = rand.rand(2,maxUnits)-Math.floor(totalUnits/2);
    if (numUnits < 1) {numUnits = 1;}
    totalUnits = totalUnits+numUnits;
    for (var i = 0; i < numUnits; i++){
        dropTile = checkDropSafe(centreTileId);
        if (rand.rand(1,2) === 1) {
            let thisTile = getTileById(dropTile);
            thisTile.infra = 'Palissades';
        }
        conselUnit = getBatTypeById(261);
        conselPut = false;
        conselAmmos = ['pn-perfo','grenade','scrap','silencieux1'];
        encounterAmmos(tech);
        conselTriche = true;
        putBat(dropTile,0,rand.rand(50,175),'fortifguet',false);
        playerOccupiedTiles.push(dropTile);
    }
    // CHAMPS DE MINES
    if (rand.rand(1,3) === 1) {
        let maxMines = Math.round(zone[0].mapDiff/3)+1
        numUnits = rand.rand(1,maxMines);
        for (var i = 0; i < numUnits; i++){
            dropTile = checkDrop(centreTileId);
            conselUnit = getBatTypeById(43);
            conselPut = false;
            conselAmmos = ['mine','suicide','aucun','aucun'];
            conselTriche = true;
            putBat(dropTile,0,rand.rand(25,100),'',false);
            playerOccupiedTiles.push(dropTile);
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

function pactole(bastionTileId) {
    console.log('PACTOLE');
    let coffre = getBatByTileId(bastionTileId);
    let totalRes = 0;
    let thatResChance = 0;
    let thatResNum = 0;
    let mapFactor = Math.round(((Math.sqrt(zone[0].mapDiff+2)*10)+zone[0].mapDiff)/8);
    let resFactor;
    let shufRes = _.shuffle(resTypes);
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
    encounterTileId = centreTileId;
    return centreTileId;
}
