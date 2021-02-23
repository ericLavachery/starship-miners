function checkTargetBatType() {
    let targetBatUnitIndex;
    if (targetBat.team == 'player') {
        targetBatUnitIndex = unitTypes.findIndex((obj => obj.id == targetBat.typeId));
        targetBatType = unitTypes[targetBatUnitIndex];
    } else if (targetBat.team == 'aliens') {
        targetBatUnitIndex = alienUnits.findIndex((obj => obj.id == targetBat.typeId));
        targetBatType = alienUnits[targetBatUnitIndex];
    } else if (targetBat.team == 'locals') {
        targetBatUnitIndex = localUnits.findIndex((obj => obj.id == targetBat.typeId));
        targetBatType = localUnits[targetBatUnitIndex];
    }
};

function isHit(accuracy,minAccu,aoe,size,stealth,cover,speed,shotDice) {
    let prec = accuracy;
    let megaPrec = 0;
    if (size <= 4 && prec > 35 && aoe == 'unit') {
        megaPrec = Math.sqrt(prec-35);
    }
    let overPrec = 0;
    if (size <= 4 && prec > 30 && aoe == 'unit') {
        overPrec = prec-30;
        prec = prec+overPrec;
    }
    if (aoe == 'unit' || aoe == 'brochette' || speed < 0) {
        prec = Math.round(prec-(stealth/(2+overPrec))-(speed/(1+overPrec)));
    }
    prec = Math.round(prec-(cover*coverFactor*2/(2+megaPrec)));
    if (prec < minPrec) {
        prec = minPrec;
    }
    if (prec < minAccu) {
        prec = minAccu;
    }
    // tir ciblé
    if (selectedBat.tags.includes('vise')) {
        prec = prec+5;
    }
    let dice = rand.rand(1,shotDice);
    let hitChance = Math.round(Math.sqrt(size)*prec);
    // aoe : more chance than normal to hit small creatures
    if (aoe != 'unit' && aoe != 'brochette' && size < 10) {
        hitChance = Math.round(Math.sqrt(10)*prec);
    }
    // bonus général
    hitChance = hitChance+hitBase;
    if (hitChance < size) {
        hitChance = size;
    }
    if (toHit === 999) {
        toHit = hitChance;
        $('#report').append('<span class="report">Précision '+prec+' >> '+hitChance+'%</span><br><span class="report">Dégâts: </span>');
        console.log('hitChance '+hitChance);
    }
    if (dice > hitChance) {
        return false;
    } else {
        return true;
    }
};

function combatReport() {
    $('#report').append(report);
    report = '';
};

function shot(weapon,attBatType,bat,batType,shotDice) {
    // returns damage
    let result = {damage:0,hits:0};
    let cover = getCover(bat,true,false);
    if (weapon.isMelee || weapon.noShield || attBatType.skills.includes('halfcover')) {
        cover = Math.round(cover/2);
    }
    let stealth = getStealth(bat);
    // skupiac drug
    let batSpeed = batType.speed;
    if (bat.tags.includes('skupiac')) {
        batSpeed = batSpeed+3;
    }
    // Pièges
    if (weapon.name.includes('Dart') || weapon.name.includes('Pieu') || weapon.name.includes('Barbelés') || weapon.name === 'Explosifs' || weapon.name === 'Explosion') {
        stealth = 0;
        if (batType.skills.includes('invisible') || batType.skills.includes('hide')) {
            batSpeed = 0;
        }
    }
    let weapAccu = weapon.accuracy;
    // melee on melee
    if ((weapon.isMelee || (weapon.noShield && weapon.range === 0)) && attBatType.cat != 'aliens') {
        if (batType.weapon.isMelee) {
            weapAccu = weapAccu+3;
        } else {
            weapAccu = weapAccu-3;
        }
    }
    // fly
    if (batType.skills.includes('fly')) {
        weapAccu = Math.round(weapAccu*weapon.dca);
    }
    // marquage
    if (bat.tags.includes('fluo')) {
        weapAccu = weapAccu+15;
    }
    // minaccu
    let minAccu = 0;
    if (attBatType.skills.includes('minaccu')) {
        minAccu = Math.ceil(weapon.accuracy/2);
    }
    if (isHit(weapAccu,minAccu,weapon.aoe,batType.size,stealth,cover,batSpeed,shotDice)) {
        if (weapon.power >= 1) {
            result.damage = calcDamage(weapon,weapon.power,bat.armor,bat);
        } else {
            result.damage = 0;
        }
        result.hits = 1;
        if (result.damage > batType.hp) {
            result.damage = batType.hp;
        }
        if (result.damage < 0) {
            result.damage = 0;
        }
        $('#report').append('<span class="report">'+result.damage+' </span>');
    }
    return result;
};

function blast(brochette,attBatType,aoeShots,weapon,bat,batType,shotDice) {
    // returns damage
    // console.log('aoeShots = '+aoeShots);
    let result = {damage:0,hits:0};
    let newDamage = 0;
    let power = weapon.power;
    let oldPower = weapon.power;
    let forAOE = true;
    if (brochette) {
        forAOE = false;
    }
    let cover = getCover(bat,true,forAOE);
    if (weapon.isMelee || weapon.noShield || attBatType.skills.includes('halfcover')) {
        cover = Math.round(cover/2);
    }
    let stealth = getStealth(bat);
    if (!brochette) {
        stealth = Math.round(stealth/2);
    }
    // skupiac drug
    let batSpeed = batType.speed;
    if (bat.tags.includes('skupiac')) {
        batSpeed = batSpeed+3;
    }
    // Pièges
    if (weapon.name.includes('Dart') || weapon.name.includes('Pieu') || weapon.name.includes('Barbelés') || weapon.name === 'Explosifs' || weapon.name === 'Explosion') {
        stealth = 0;
        if (batType.skills.includes('invisible') || batType.skills.includes('hide')) {
            batSpeed = 0;
        }
    }
    let weapAccu = weapon.accuracy;
    // melee on melee
    if ((weapon.isMelee || (weapon.noShield && weapon.range === 0)) && attBatType.cat != 'aliens') {
        if (batType.weapon.isMelee) {
            weapAccu = weapAccu+3;
        } else {
            weapAccu = weapAccu-3;
        }
    }
    // fly
    if (batType.skills.includes('fly')) {
        weapAccu = Math.round(weapAccu*weapon.dca);
    }
    // minaccu
    let minAccu = 0;
    if (attBatType.skills.includes('minaccu')) {
        minAccu = Math.ceil(weapon.accuracy/2);
    }
    let ii = 1;
    while (ii <= aoeShots) {
        // console.log('power'+power);
        if (isHit(weapAccu,minAccu,weapon.aoe,batType.size,stealth,cover,batSpeed,shotDice)) {
            if (weapon.power >= 1) {
                newDamage = calcDamage(weapon,power,bat.armor,bat);
            } else {
                newDamage = 0;
            }
            result.hits = result.hits+1;
            if (newDamage > batType.hp) {
                newDamage = batType.hp;
            }
            if (newDamage < 0) {
                newDamage = 0;
            }
            result.damage = result.damage+newDamage;
        }
        if (ii > 100) {break;}
        oldPower = power;
        if (!brochette) {
            power = Math.floor(power*0.8);
        } else {
            power = Math.floor(power*0.5);
        }
        if (power >= oldPower) {
            power = power-1;
        }
        if (power < 3) {
            break;
        }
        ii++
    }
    $('#report').append('<span class="report">'+result.damage+' </span>');
    return result;
};

function batDeath(bat,count) {
    console.log('DEATH');
    let deadId = bat.id;
    let tileId = bat.tileId;
    let batType = getBatType(bat);
    if (bat.team == 'player') {
        let batIndex = bataillons.findIndex((obj => obj.id == bat.id));
        bataillons.splice(batIndex,1);
        if (count && !batType.skills.includes('nodeathcount')) {
            playerInfos.unitsLost = playerInfos.unitsLost+1;
            transDestroy(deadId,tileId);
            saveCrew(batType,deadId,tileId);
            playMusic('rip',false);
        }
        batIndex = batList.findIndex((obj => obj.id == bat.id));
        batList.splice(batIndex,1);
    } else if (bat.team == 'aliens') {
        if (count) {
            if (bat.type.includes('Oeuf') || bat.type === 'Coque' || bat.type === 'Ruche' || bat.type === 'Cocon') {
                playerInfos.eggsKilled = playerInfos.eggsKilled+1;
                if (bat.type === 'Coque' || bat.type === 'Oeuf' || bat.type === 'Cocon') {
                    eggsNum = eggsNum-1;
                }
                if (bat.type === 'Oeuf voilé') {
                    if (playerInfos.comp.det >= 3) {
                        eggsNum = eggsNum-1;
                    }
                    unveilAliens(bat);
                }
                playMusic('eggKill',false);
            }
            playerInfos.aliensKilled = playerInfos.aliensKilled+1;
            addAlienRes(bat);
        }
        let batIndex = aliens.findIndex((obj => obj.id == bat.id));
        aliens.splice(batIndex,1);
    } else if (bat.team == 'locals') {
        let batIndex = locals.findIndex((obj => obj.id == bat.id));
        locals.splice(batIndex,1);
    }
    alienOccupiedTileList();
};

function batDeathEffect(bat,quiet,title,body) {
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    if (!isFFW) {
        if (!quiet) {
            deathSound(bat);
            $('#b'+bat.tileId).append('<div class="pUnits"><img src="/static/img/explosion'+nextExplosion+'.gif"></div>'+resHere);
            nextExplosion = nextExplosion+1;
            if (nextExplosion > 3) {
                nextExplosion = 1;
            }
            setTimeout(function (){
                $('#b'+bat.tileId).empty();
                $('#b'+bat.tileId).append(resHere);
            }, 1500); // How long do you want the delay to be (in milliseconds)?
        } else {
            $('#b'+bat.tileId).empty();
            $('#b'+bat.tileId).append(resHere);
            warning(title,body);
        }
    } else {
        $('#b'+bat.tileId).empty();
        $('#b'+bat.tileId).append(resHere);
        warning(title,body);
    }
};

function saveCrew(deadBatType,deadId,tileId) {
    alienOccupiedTileList();
    playerOccupiedTileList();
    let savedCits = 0;
    let salvableCits = 0;
    let citId = 126;
    if (deadBatType.skills.includes('brigands')) {
        citId = 225;
    }
    if (deadBatType.skills.includes('crewsave')) {
        salvableCits = Math.round(deadBatType.squads*deadBatType.squadSize*deadBatType.crew/6*rand.rand(4,6));
    } else if (deadBatType.skills.includes('badcrewsave') || deadBatType.cat === 'buildings') {
        salvableCits = Math.round(deadBatType.squads*deadBatType.squadSize*deadBatType.crew/6*rand.rand(0,4));
    }
    if (salvableCits >= 1) {
        if (salvableCits > 72) {
            conselTriche = true;
            putBatAround(tileId,false,false,citId,72);
            salvableCits = salvableCits-72;
        }
        if (salvableCits > 72) {
            conselTriche = true;
            putBatAround(tileId,false,false,citId,72);
            salvableCits = salvableCits-72;
        }
        conselTriche = true;
        putBatAround(tileId,false,false,citId,salvableCits);
        if (savedCits >= 1) {
            centerMapTo(tileId);
        }
    }
};

function transDestroy(deadId,tileId) {
    alienOccupiedTileList();
    playerOccupiedTileList();
    let savedBats = 0;
    let crashBats = [];
    let batIndex;
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId === deadId) {
            crashBats.push(bat);
        }
    });
    let crashEscapeTile = -1;
    crashBats.forEach(function(bat) {
        crashEscapeTile = -1;
        if (rand.rand(1,3) != 1) {
            crashEscapeTile = getCrashEscapeTile(tileId);
        }
        if (crashEscapeTile >= 0) {
            bat.loc = 'zone';
            bat.tileId = crashEscapeTile;
            bat.oldTileId = crashEscapeTile;
            savedBats++;
        } else {
            batIndex = bataillons.findIndex((obj => obj.id == bat.id));
            bataillons.splice(batIndex,1);
            playerInfos.unitsLost = playerInfos.unitsLost+1;
        }
    });
    if (savedBats >= 1) {
        centerMapTo(tileId);
    }
};

function getCrashEscapeTile(tileId) {
    let escTile = -1;
    let shufZone = _.shuffle(zone);
    let distance;
    shufZone.forEach(function(tile) {
        if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
            distance = calcDistance(tile.id,tileId);
            if (distance <= 1) {
                escTile = tile.id;
            }
        }
    });
    return escTile;
};


function calcDamage(weapon,power,armor,defBat) {
    // powerDice is max 4x power
    // fortif armor
    let defBatType = getBatType(defBat);
    if (defBat.tags.includes('fortif')) {
        if (defBatType.skills.includes('bigfortif')) {
            armor = armor+2;
        } else if (armor < 3 && !defBatType.skills.includes('baddef')) {
            armor = armor+1;
        }
        if (playerInfos.comp.def >= 2) {
            armor = armor+playerInfos.comp.def-1;
        }
    }
    let armorModifier = weapon.armors;
    // creuseur
    if (defBat.tags.includes('trou')) {
        if (weapon.ammo.includes('troueur')) {
            armorModifier = 0;
        } else if (weapon.ammo.includes('creuseur') || weapon.ammo.includes('acide')) {
            armorModifier = 0.15;
        }
    }
    let modifiedArmor = Math.round(armor*armorModifier);
    let powerDice;
    if (power >= 3) {
        let powerDiceMin = Math.round(power/2.5);
        let powerDiceMax = Math.round(power*1.6);
        powerDice = rand.rand(powerDiceMin,powerDiceMax);
        if (powerDice == powerDiceMax) {
            let bonusMax = Math.round(power*2.4);
            powerDice = powerDice+rand.rand(0,bonusMax);
        }
    } else if (power === 2) {
        powerDice = rand.rand(0,4);
    } else if (power === 1) {
        powerDice = Math.floor(rand.rand(0,4)/4);
    } else {
        powerDice = 0;
    }
    // bliss drug
    let dmgReduct = 0;
    if (defBat.tags.includes('bliss')) {
        dmgReduct = 3;
    }
    let calculatedDmg = powerDice-modifiedArmor-dmgReduct;
    if (calculatedDmg < 0) {
        calculatedDmg = 0;
    }
    return calculatedDmg;
};

function getCover(bat,withFortif,forAOE) {
    let cover;
    let batType = getBatType(bat);
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    if (bat.team == 'aliens') {
        if (batType.skills.includes('hover')) {
            cover = terrain.fishcover;
        } else {
            cover = terrain.aliencover;
        }
    } else {
        cover = terrain.cover;
        if (bat.eq === 'waterproof' || batType.skills.includes('noblub')) {
            if (terrain.name === 'W' || terrain.name === 'R') {
                cover = 3;
            }
        }
    }
    // Fortification
    if (withFortif) {
        if (bat.tags.includes('fortif')) {
            cover = terrain.fortifcover;
            if (batType.skills.includes('baddef')) {
                cover = Math.ceil((terrain.fortifcover+terrain.cover)/2);
            }
            if (bat.eq === 'waterproof' || batType.skills.includes('noblub')) {
                if (terrain.name === 'W' || terrain.name === 'R') {
                    cover = 3;
                }
            }
            if (batType.skills.includes('bigfortif')) {
                cover = cover+2;
            }
        }
    }
    if (tile.ruins) {
        if (cover > 4) {
            cover = cover+2;
        } else {
            cover = 4+Math.floor(cover/2);
        }
    }
    if (tile.infra != undefined && bat.team != 'aliens') {
        let infraCover = 2;
        if (batType.cat != 'vehicles' || batType.skills.includes('robot') || batType.skills.includes('cyber')) {
            if (tile.infra === 'Miradors') {
                infraCover = 5;
            } else if (tile.infra === 'Palissades') {
                infraCover = 6;
            } else if (tile.infra === 'Remparts') {
                infraCover = 9;
            } else if (tile.infra === 'Murailles') {
                infraCover = 12;
            }
        }
        if (cover > infraCover) {
            cover = cover+Math.floor(infraCover/2);
        } else {
            cover = infraCover+Math.floor(cover/2);
        }
    }
    if (forAOE) {
        cover = cover+coverAOE;
    }
    if (cover < 0) {
        if (batType.skills.includes('fly') && !batType.skills.includes('jetpack')) {
            cover = 0;
        }
        if (batType.skills.includes('okwater')) {
            cover = 0;
        }
    } else {
        if (forAOE) {
            cover = Math.round(cover/1.5);
        }
    }
    return cover;
};

function getStealth(bat) {
    let cover = getCover(bat,false,false);
    let batType = getBatType(bat);
    let tile = getTile(bat);
    let batStealth = batType.stealth;
    if (playerInfos.bldList.includes('QG')) {
        batStealth = batStealth+4;
    } else if (playerInfos.bldList.includes('Centre de com')) {
        batStealth = batStealth+4;
    } else if (playerInfos.bldList.includes('Poste radio')) {
        batStealth = batStealth+2;
    }
    if (tile.infra === 'Terriers' && batType.size < 9) {
        batStealth = batStealth+5;
    }
    if (tile.ruins) {
        batStealth = batStealth+4;
    }
    if (bat.tags.includes('drunk')) {
        batStealth = batStealth-4;
    }
    if (bat.eq === 'camo' || bat.eq === 'kit-sentinelle' || bat.eq === 'crimekitgi' || bat.eq === 'crimekitch') {
        if (batType.skills.includes('camo')) {
            batStealth = batStealth+4;
        } else {
            batStealth = batStealth+3;
        }
    }
    let stealthBonus = 0;
    if (cover >= 4) {
        stealthBonus = Math.round((Math.sqrt(cover)-1.7)*(batStealth-5)/2);
        if (stealthBonus > 4) {
            stealthBonus = 4;
        }
        if (stealthBonus < 0) {
            stealthBonus = 0;
        }
    }
    let vetStealth = Math.round(bat.vet*vetBonus.stealth);
    let maxStealth = batStealth;
    let coverAdj = Math.round((cover+3)*1.8);
    if (tile.ruins) {
        coverAdj = coverAdj+4;
    }
    if (tile.infra === 'Terriers' && batType.size < 9) {
        coverAdj = coverAdj+5;
    }
    if (coverAdj < 2) {
        coverAdj = 2;
    }
    if (batStealth > coverAdj) {
        maxStealth = coverAdj;
    }
    // Starka drug
    if (bat.tags.includes('starka')) {
        maxStealth = Math.floor(maxStealth/2);
    }
    return maxStealth+stealthBonus+vetStealth;
};

function getAP(bat,batType) {
    let newAP = bat.ap;
    if (bat.eq === 'belier' || bat.eq === 'snorkel' || (bat.eq === 'chenilles' && batType.maxFlood >= 1 && batType.maxScarp >= 2)) {
        newAP = Math.round(newAP*0.9);
    }
    if (playerInfos.bldList.includes('QG')) {
        newAP = Math.floor(newAP*1.1);
    }
    if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && batType.skills.includes('fly')) {
        if (playerInfos.bldList.includes('Aérodocks')) {
            newAP = Math.round(newAP*1.15);
        }
    }
    if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && !batType.skills.includes('fly') && batType.moveCost < 90) {
        if (playerInfos.bldList.includes('Garage')) {
            newAP = newAP+1;
        }
    }
    if (bat.eq === 'g2motor') {
        newAP = newAP+3;
    }
    if (bat.eq === 'helper') {
        newAP = newAP+1;
    }
    if (bat.eq === 'ranger' || bat.eq === 'gilet') {
        newAP = newAP-1;
    }
    if (playerInfos.comp.trans >= 2 && batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && batType.moveCost < 90) {
        newAP = newAP+playerInfos.comp.trans-1;
    }
    newAP = newAP+Math.round(bat.vet*vetBonus.ap);
    return newAP;
};

function calcSpeed(bat,weap,opweap,distance,attacking) {
    let batType = getBatType(bat);
    let crange = weap.range;
    if (weap.range === 0) {
        if (attacking) {
            crange = 1;
        } else {
            if (opweap.range === 0) {
                crange = 1;
            } else {
                crange = 6;
            }
        }
    }
    let speed = Math.round(crange*weap.cost);
    let stealth = getStealth(bat);
    if (distance <= 1) {
        if (attacking) {
            speed = speed-stealth-stealth;
        } else {
            speed = speed-stealth;
        }
    }
    if (bat.eq === 'w1-autogun') {
        speed = speed-50-stealth;
    } else {
        if ((bat.tags.includes('guet') || batType.skills.includes('sentinelle')) && !attacking) {
            speed = speed-watchInitBonus-stealth;
            console.log('bonus guet');
        }
        if (batType.skills.includes('defense') && !attacking) {
            speed = speed-10;
        }
        if (batType.skills.includes('bastion') && !attacking) {
            speed = speed-20;
        }
        if (batType.skills.includes('guerrilla') && bat.oldTileId != bat.tileId) {
            speed = speed-20;
        }
        if (batType.skills.includes('initiative')) {
            speed = speed-200;
            console.log('bonus initiative');
        }
        if (batType.skills.includes('after')) {
            if (attacking) {
                speed = speed-999;
                console.log('bonus initiative');
            } else {
                speed = speed+999;
                console.log('malus initiative');
            }
        }
    }
    if (bat.eq === 'theeye') {
        speed = speed-25;
    }
    // Skupiac drug
    if (bat.tags.includes('skupiac')) {
        speed = speed-15;
    }
    if (weap.ammo.includes('disco')) {
        speed = speed-20;
    }
    if ((bat.apLeft < 0 && !batType.skills.includes('guerrilla')) || bat.apLeft > 0) {
        speed = speed-(bat.apLeft*5);
    }
    let vetDice = vetBonus.initiative*bat.vet;
    return Math.round(speed+rand.rand(0,initiativeDice)-rand.rand(0,vetDice));
};

function sideBySideTiles(myTileIndex,thatTileIndex,fuzzThing) {
    let sbs = false;
    if (selectedBat.fuzz <= -2 && fuzzThing) {
        sbs = false;
    } else {
        let myTileX = zone[myTileIndex].x;
        let myTileY = zone[myTileIndex].y;
        let thatTileX = zone[thatTileIndex].x;
        let thatTileY = zone[thatTileIndex].y;
        if (myTileX === thatTileX) {
            if (myTileY == thatTileY+1 || myTileY == thatTileY-1) {
                sbs = true;
            }
        }
        if (myTileY === thatTileY) {
            if (myTileX == thatTileX+1 || myTileX == thatTileX-1) {
                sbs = true;
            }
        }
        // if (myTileIndex == thatTileIndex || myTileIndex == thatTileIndex+1 || myTileIndex == thatTileIndex-1 || myTileIndex == thatTileIndex+mapSize || myTileIndex == thatTileIndex-mapSize) {
        //     return true;
        // } else {
        //     return false;
        // }
    }
    return sbs;
};

function batInMelee(bat) {
    // Vérifie si le bataillon est VRAIMENT en mêlée : Range 0 ET alien range 0 en face
    let inMelee = false;
    let alienType;
    aliens.forEach(function(alien) {
        if (alien.loc === "zone") {
            if (bat.tileId == alien.tileId+1 || bat.tileId == alien.tileId-1 || bat.tileId == alien.tileId+mapSize || bat.tileId == alien.tileId-mapSize) {
                alienType = getBatType(alien);
                if (alien.range === 0 && !bat.tags.includes('camo') && alienType.maxSalvo >= 1) {
                    inMelee = true;
                }
            }
        }
    });
    return inMelee;
};

function calcDistanceSquare(myTileIndex,thatTileIndex) {
    let myTileX = zone[myTileIndex].x;
    let myTileY = zone[myTileIndex].y;
    let thatTileX = zone[thatTileIndex].x;
    let thatTileY = zone[thatTileIndex].y;
    let distanceX = Math.abs(myTileX-thatTileX);
    let distanceY = Math.abs(myTileY-thatTileY);
    let distance;
    if (distanceX > distanceY) {
        distance = distanceX;
    } else {
        distance = distanceY;
    }
    if (myTileIndex == thatTileIndex+1 || myTileIndex == thatTileIndex-1 || myTileIndex == thatTileIndex+mapSize || myTileIndex == thatTileIndex-mapSize) {
        return 0;
    } else {
        return distance;
    }
};

function isInRange(myBat,thatTileId,myWeapon) {
    let myBatType = getBatType(myBat);
    let inRange = false;
    let range = myWeapon.range;
    let distance = calcDistance(myBat.tileId,thatTileId);
    if (distance > range) {
        // nothing
    } else {
        inRange = true;
    }
    return inRange;
};

function anyAlienInRange(myBat,weapon) {
    let tileId = myBat.tileId;
    let distance;
    let inRange = false;
    let batIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (isInRange(myBat,bat.tileId,weapon) || checkGuidage(weapon,bat)) {
                batType = getBatType(bat);
                if (weapon.noFly && batType.skills.includes('fly')) {
                    // Fly hors portée
                } else {
                    if (weapon.noGround && !batType.skills.includes('fly') && !batType.skills.includes('sauteur')) {
                        // Ground hors portée
                    } else {
                        if (batType.skills.includes('invisible') || bat.tags.includes('invisible')) {
                            // Alien invisible
                            distance = calcDistance(myBat.tileId,bat.tileId)
                            if (distance === 0) {
                                inRange = true;
                            }
                        } else {
                            inRange = true;
                        }
                    }
                }
            }
        }
    });
    return inRange;
};

function calcDistance(myTileIndex,thatTileIndex) {
    let distance = 0;
    let batOff = calcOffsets(myTileIndex,thatTileIndex);
    if (batOff[0] > batOff[1]) {
        distance = batOff[0]-batOff[1]+(batOff[1]*1.42);
    } else {
        distance = batOff[1]-batOff[0]+(batOff[0]*1.42);
    }
    distance = Math.floor(distance*1);
    if (myTileIndex == thatTileIndex+1 || myTileIndex == thatTileIndex-1 || myTileIndex == thatTileIndex+mapSize || myTileIndex == thatTileIndex-mapSize) {
        return 0;
    } else {
        return distance;
    }
};

function calcOffsets(myTileId,tileId) {
    // offsets x et y entre myTileId et tileId
    theTileX = zone[tileId].x;
    theTileY = zone[tileId].y;
    myTileX = zone[myTileId].x;
    myTileY = zone[myTileId].y;
    xOff = Math.abs(myTileX-theTileX);
    yOff = Math.abs(myTileY-theTileY);
    return [xOff,yOff];
};

function checkFlyTarget(weapon,batType) {
    if (weapon.noFly && batType.skills.includes('fly')) {
        return false;
    } else {
        if (weapon.noGround && !batType.skills.includes('fly') && !batType.skills.includes('sauteur')) {
            return false;
        } else {
            return true;
        }
    }
};

function isOnInfra(bat) {
    let onInfra = false;
    let tile = getTile(bat);
    let batType = getBatType(bat);
    if (tile.infra != undefined) {
        if (tile.infra != 'Débris' && tile.infra != 'Terriers' && batType.cat != 'aliens') {
            if (batType.cat != 'vehicles' || batType.skills.includes('robot') || batType.skills.includes('cyber')) {
                onInfra = true;
            }
        }
    }
    return onInfra;
}

function fireInfos(bat) {
    $(".targ").remove();
    isMelee = false;
    let batType = getBatType(bat);
    cursorSwitch('.','grid-item','pointer');
    let myTileX = zone[bat.tileId].x;
    let myTileY = zone[bat.tileId].y;
    let alien = {};
    let alienIndex;
    let alienType;
    let onInfra = false;
    let longMelee = false;
    let guideTarget = false;
    zone.forEach(function(tile) {
        $("#"+tile.id).attr("title", "");
        alien = alienHere(tile.id);
        if (Object.keys(alien).length >= 1) {
            alienType = getBatType(alien);
            onInfra = isOnInfra(bat);
            if (sideBySideTiles(selectedBat.tileId,tile.id,true) && !batType.skills.includes('longshot') && !onInfra) {
                isMelee = true;
                if (checkFlyTarget(selectedWeap,alienType)) {
                    cursorSwitch('#',tile.id,'fire');
                    $('#b'+tile.id).append('<div class="targ"><img src="/static/img/crosstarget.png"></div>');
                }
            }
        }
    });
    if (!isMelee) {
        zone.forEach(function(tile) {
            $("#"+tile.id).attr("title", "");
            alien = alienHere(tile.id);
            if (Object.keys(alien).length >= 1) {
                guideTarget = checkGuidage(selectedWeap,alien);
                if (isInRange(selectedBat,tile.id,selectedWeap) || guideTarget) {
                    alienType = getBatType(alien);
                    if (checkFlyTarget(selectedWeap,alienType) && ((!alienType.skills.includes('invisible') && !alien.tags.includes('invisible')) || sideBySideTiles(selectedBat.tileId,tile.id,false))) {
                        cursorSwitch('#',tile.id,'fire');
                        $('#b'+tile.id).append('<div class="targ"><img src="/static/img/crosstarget.png"></div>');
                    }
                }
            }
        });
    }
};

function checkGuidage(weapon,alien) {
    let guideTarget = false;
    if (alien.tags.includes('guide')) {
        if (weapon.ammo.includes('missile') && !weapon.name.includes('Comet')) {
            guideTarget = true;
        }
    }
    return guideTarget;
}

function alienHere(tileId) {
    let alienBatHere = {};
    aliens.forEach(function(alien) {
        if (alien.tileId === tileId && alien.loc === "zone") {
            alienBatHere = alien;
        }
    });
    return alienBatHere;
};

function weaponSelect(weapon) {
    if (weapon == 'w1') {
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
    } else if (weapon == 'w2') {
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon2));
    }
    // bonus veterancy & ammo
    selectedWeap = weaponAdj(selectedWeap,selectedBat,weapon);
};

function weaponSelectRiposte(distance) {
    if (targetBat.eq === 'w1-autogun' || targetBat.eq === 'w1-autopistol') {
        targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon3));
        targetWeap = weaponAdj(targetWeap,targetBat,'w3');
    } else {
        let baseAmmo = 99;
        let ammoLeft = 99;
        let batWeap1 = {};
        if (!targetBatType.weapon.kit || targetBat.eq.includes('w1-') || targetBat.eq.includes('w2-')) {
            batWeap1 = targetBatType.weapon;
        }
        targetWeap = JSON.parse(JSON.stringify(batWeap1));
        targetWeap = weaponAdj(targetWeap,targetBat,'w1');
        if (!targetBatType.weapon2.kit || targetBat.eq.includes('kit-') || targetBat.eq.includes('w2-')) {
            if (activeTurn == 'aliens') {
                baseAmmo = targetWeap.maxAmmo;
                ammoLeft = calcAmmos(targetBat,baseAmmo);
                if (ammoLeft <= 0 || distance > targetWeap.range || targetWeap.noDef || (targetWeap.noMelee && distance === 0 && selectedBat.tileId === selectedBat.oldTileId) || (targetWeap.noFly && selectedBatType.skills.includes('fly')) || (targetWeap.noGround && !selectedBatType.skills.includes('sauteur') && !selectedBatType.skills.includes('fly'))) {
                    if (Object.keys(targetBatType.weapon2).length >= 1) {
                        targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon2));
                        targetWeap = weaponAdj(targetWeap,targetBat,'w2');
                        if (!targetWeap.noDef && distance <= targetWeap.range) {
                            baseAmmo = targetWeap.maxAmmo;
                            ammoLeft = calcAmmos(targetBat,baseAmmo);
                        } else {
                            ammoLeft = 0;
                        }
                    } else {
                        ammoLeft = 0;
                    }
                    if (ammoLeft <= 0) {
                        targetWeap = JSON.parse(JSON.stringify(batWeap1));
                        targetWeap = weaponAdj(targetWeap,targetBat,'w1');
                    }
                }
            }
        }
    }
};

function ammoFired(batId) {
    if (batId === selectedBat.id) {
        if (selectedWeap.maxAmmo < 99) {
            if (selectedWeap.num == 1) {
                selectedBat.ammoLeft = selectedBat.ammoLeft-1;
            } else {
                selectedBat.ammo2Left = selectedBat.ammo2Left-1;
            }
        }
    } else if (batId === targetBat.id) {
        if (targetWeap.maxAmmo < 99) {
            if (targetWeap.num == 1) {
                targetBat.ammoLeft = targetBat.ammoLeft-1;
            } else {
                targetBat.ammo2Left = targetBat.ammo2Left-1;
            }
        }
    }
};

function weaponAdj(weapon,bat,wn) {
    let batType = getBatType(bat);
    // bonus veterancy
    let thisWeapon = {};
    if (wn == 'w2') {
        thisWeapon.num = 2;
    } else if (wn == 'w3') {
        thisWeapon.num = 3;
    } else {
        thisWeapon.num = 1;
    }
    // bonus vet
    thisWeapon.rof = Math.floor(weapon.rof*(bat.vet+vetBonus.rof)/vetBonus.rof);
    thisWeapon.name = weapon.name;
    thisWeapon.cost = weapon.cost;
    thisWeapon.range = weapon.range;
    thisWeapon.power = weapon.power;
    thisWeapon.accuracy = weapon.accuracy;
    if (weapon.armors === undefined) {
        thisWeapon.armors = 1;
    } else {
        thisWeapon.armors = weapon.armors;
    }
    thisWeapon.aoe = weapon.aoe;
    thisWeapon.sound = weapon.sound;
    if (weapon.elevation === undefined) {
        thisWeapon.elevation = 0;
    } else {
        thisWeapon.elevation = weapon.elevation;
    }
    if (weapon.spot === undefined) {
        thisWeapon.spot = false;
    } else {
        thisWeapon.spot = weapon.spot;
    }
    if (weapon.kit === undefined) {
        thisWeapon.kit = false;
    } else {
        thisWeapon.kit = weapon.kit;
    }
    if (weapon.noAtt === undefined) {
        thisWeapon.noAtt = false;
    } else {
        thisWeapon.noAtt = weapon.noAtt;
    }
    if (weapon.noDef === undefined) {
        thisWeapon.noDef = false;
    } else {
        thisWeapon.noDef = weapon.noDef;
    }
    if (weapon.bigDef === undefined) {
        thisWeapon.bigDef = false;
    } else {
        thisWeapon.bigDef = weapon.bigDef;
    }
    if (weapon.noBis === undefined) {
        thisWeapon.noBis = false;
    } else {
        thisWeapon.noBis = weapon.noBis;
    }
    if (weapon.noMelee === undefined) {
        thisWeapon.noMelee = false;
    } else {
        thisWeapon.noMelee = weapon.noMelee;
    }
    if (weapon.noFly === undefined) {
        thisWeapon.noFly = false;
    } else {
        thisWeapon.noFly = weapon.noFly;
    }
    if (weapon.noGround === undefined) {
        thisWeapon.noGround = false;
    } else {
        thisWeapon.noGround = weapon.noGround;
    }
    if (weapon.maxAmmo === undefined) {
        thisWeapon.maxAmmo = 99;
    } else {
        thisWeapon.maxAmmo = weapon.maxAmmo;
    }
    if (weapon.isMelee === undefined) {
        thisWeapon.isMelee = false;
    } else {
        thisWeapon.isMelee = weapon.isMelee;
        thisWeapon.accuracy = thisWeapon.accuracy+Math.round(bat.vet*1);
    }
    if (weapon.isShort === undefined) {
        thisWeapon.isShort = false;
    } else {
        thisWeapon.isShort = weapon.isShort;
    }
    if (weapon.noBig === undefined) {
        thisWeapon.noBig = false;
    } else {
        thisWeapon.noBig = weapon.noBig;
    }
    if (weapon.noShield === undefined) {
        thisWeapon.noShield = false;
    } else {
        thisWeapon.noShield = weapon.noShield;
    }
    if (weapon.isBow === undefined) {
        thisWeapon.isBow = false;
    } else {
        thisWeapon.isBow = weapon.isBow;
        thisWeapon.accuracy = thisWeapon.accuracy+Math.round(bat.vet*2);
    }
    if (weapon.dca === undefined) {
        thisWeapon.dca = 1;
    } else {
        thisWeapon.dca = weapon.dca;
    }
    // Equip adj
    if (thisWeapon.num === 1) {
        if (bat.eq === 'longtom' || bat.eq === 'longtom1') {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (bat.eq === 'chargeur' || bat.eq === 'chargeur1') {
            if (thisWeapon.cost < 6) {
                thisWeapon.accuracy = thisWeapon.accuracy-2;
                thisWeapon.cost = thisWeapon.cost+1;
            }
        }
        if (bat.eq === 'lunette' || bat.eq === 'lunette1') {
            thisWeapon.cost = thisWeapon.cost+1;
        }
        if (bat.eq === 'lunette' || bat.eq === 'lunette1' || bat.eq.includes('kit-guetteur') || bat.eq.includes('landerwkit') || bat.eq.includes('w2-l')) {
            if (thisWeapon.elevation <= 1) {
                thisWeapon.elevation = thisWeapon.elevation+1;
            }
            thisWeapon.accuracy = thisWeapon.accuracy+8;
        }
    } else if (thisWeapon.num === 2) {
        if (bat.eq === 'longtom' || bat.eq === 'longtom2') {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (bat.eq === 'chargeur' || bat.eq === 'chargeur2') {
            if (thisWeapon.cost < 6) {
                thisWeapon.accuracy = thisWeapon.accuracy-2;
                thisWeapon.cost = thisWeapon.cost+1;
            }
        }
        if (bat.eq === 'lunette' || bat.eq === 'lunette2') {
            thisWeapon.cost = thisWeapon.cost+1;
        }
        if (bat.eq === 'lunette' || bat.eq === 'lunette2' || bat.eq.includes('kit-guetteur')) {
            if (thisWeapon.elevation <= 1) {
                thisWeapon.elevation = thisWeapon.elevation+1;
            }
            thisWeapon.accuracy = thisWeapon.accuracy+8;
        }
    }
    if (bat.eq === 'theeye') {
        thisWeapon.accuracy = thisWeapon.accuracy+3;
        if (thisWeapon.cost >= 2) {
            thisWeapon.cost = thisWeapon.cost-1;
        }
    }
    if ((bat.eq === 'gilet' || bat.eq === 'crimekitgi') && thisWeapon.maxAmmo < 99) {
        thisWeapon.maxAmmo = Math.floor(thisWeapon.maxAmmo*1.5);
        if (thisWeapon.maxAmmo < 16) {
            thisWeapon.maxAmmo = 16;
        }
    }
    if (playerInfos.bldList.includes('Usine d\'armement')) {
        thisWeapon.maxAmmo = Math.round(thisWeapon.maxAmmo*1.5);
    } else if (playerInfos.bldList.includes('Arsenal')) {
        thisWeapon.maxAmmo = Math.round(thisWeapon.maxAmmo*1.25);
    }
    if (bat.eq === 'arcpoulie') {
        if (thisWeapon.name.includes('Arc')) {
            thisWeapon.name = 'Arc à poulies';
            thisWeapon.range = 2;
            thisWeapon.elevation = 1;
            thisWeapon.power = 8;
            thisWeapon.cost = 4;
        }
    }
    if (bat.eq === 'arbalourde') {
        if (thisWeapon.name.includes('Arbalète')) {
            thisWeapon.name = 'Arbalète lourde';
            thisWeapon.elevation = 1;
            thisWeapon.power = 9;
            thisWeapon.armors = 0.8;
            thisWeapon.cost = 5;
        }
    }
    if (bat.eq === 'belier') {
        if (thisWeapon.name === 'Boutoir') {
            thisWeapon.rof = Math.round(thisWeapon.rof*1.5);
            thisWeapon.power = thisWeapon.power+4;
            thisWeapon.accuracy = thisWeapon.accuracy+2;
            thisWeapon.name = 'Bélier';
        }
    }
    if (bat.eq === 'crimekitgi') {
        if (thisWeapon.num === 1) {
            thisWeapon.power = thisWeapon.power+1;
            thisWeapon.rof = Math.round(thisWeapon.rof*1.33);
        }
    }
    if (bat.eq === 'kit-lightning') {
        if (thisWeapon.num === 1) {
            thisWeapon.armors = 0.5;
            thisWeapon.accuracy = thisWeapon.accuracy+5;
        }
    }
    if (bat.eq === 'kit-garde') {
        if (thisWeapon.num === 1) {
            thisWeapon.noDef = true;
        }
    }
    // bonus ammo
    let myAmmo = bat.ammo;
    if (wn == 'w2') {
        myAmmo = bat.ammo2;
    }
    let ammoIndex = ammoTypes.findIndex((obj => obj.name == myAmmo));
    let ammo = ammoTypes[ammoIndex];
    thisWeapon.ammo = myAmmo;
    if (thisWeapon.range === 0 && ammo.range > 1) {
        thisWeapon.range = 1;
    } else {
        thisWeapon.range = Math.ceil(thisWeapon.range*ammo.range);
    }
    // spiderRG
    if (!thisWeapon.isMelee && spiderRG && batType.kind === 'spider') {
        if (thisWeapon.range === 0) {
            thisWeapon.range = 1;
        } else if (thisWeapon.range === 1) {
            thisWeapon.range = 2;
        } else {
            thisWeapon.range = Math.ceil(thisWeapon.range*1.5);
        }
    }
    thisWeapon.power = Math.round(thisWeapon.power*ammo.powermult);
    thisWeapon.power = thisWeapon.power+ammo.power;
    thisWeapon.apdamage = ammo.apdamage;
    thisWeapon.armors = thisWeapon.armors*ammo.armors;
    thisWeapon.armors = thisWeapon.armors.toFixedNumber(2);
    if (ammo.aoe != '' && thisWeapon.aoe != 'bat') {
        thisWeapon.aoe = ammo.aoe;
    }
    if (ammo.accuracy < 1 || thisWeapon.isMelee || thisWeapon.aoe != 'unit') {
        thisWeapon.accuracy = Math.round(thisWeapon.accuracy*ammo.accuracy);
        thisWeapon.rof = Math.round(thisWeapon.rof*ammo.rof);
    } else {
        if (thisWeapon.accuracy >= 32) {
            thisWeapon.accuracy = Math.round(thisWeapon.accuracy*ammo.accuracy);
        } else {
            thisWeapon.rof = Math.round(thisWeapon.rof*ammo.rof);
        }
    }
    // helper
    if (bat.eq === 'helper' && thisWeapon.isMelee) {
        thisWeapon.power = thisWeapon.power+2;
    }
    // sila drug
    if (bat.tags.includes('sila')) {
        if (thisWeapon.isMelee) {
            thisWeapon.power = thisWeapon.power+5;
        } else if (thisWeapon.isBow) {
            thisWeapon.accuracy = thisWeapon.accuracy+3;
            thisWeapon.power = thisWeapon.power+1;
        } else if (!thisWeapon.isMelee) {
            thisWeapon.accuracy = thisWeapon.accuracy-2;
        }
    }
    // blaze drug
    if (bat.tags.includes('blaze') && !thisWeapon.isMelee) {
        thisWeapon.accuracy = thisWeapon.accuracy-2;
    }
    // skupiac drug
    if (bat.tags.includes('skupiac')) {
        thisWeapon.accuracy = thisWeapon.accuracy+6;
        thisWeapon.power = thisWeapon.power+1;
    }
    // eatpoison & frenzy
    if (batType.skills.includes('eatpoison') && bat.tags.includes('regeneration')) {
        thisWeapon.rof = Math.round(thisWeapon.rof*2);
    }
    // skills
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    // BAT RANGE
    if (bat.range < thisWeapon.range) {
        bat.range = thisWeapon.range;
    }
    // RANGE ADJUSTMENTS
    if (batType.name === 'Ruche') {
        if (colonyTiles.includes(bat.tileId)) {
            thisWeapon.range = thisWeapon.range+5;
            thisWeapon.power = thisWeapon.power+5;
        }
    }
    // Elevation
    let infra = '';
    if (batType.cat != 'aliens') {
        if (batType.cat != 'vehicles' || batType.skills.includes('robot') || batType.skills.includes('cyber')) {
            if (tile.infra != undefined && tile.infra != 'Débris' && tile.infra != 'Terriers') {
                infra = tile.infra;
            }
        }
    }
    let highGround = 0;
    let vision = 1;
    if (tile.terrain == 'M') {
        vision = 3;
        if (infra != '') {
            highGround = 2;
        } else {
            highGround = 2;
        }
    } else if (tile.terrain == 'H') {
        if (infra != '') {
            highGround = 2;
            vision = 3;
        } else {
            highGround = 1;
            vision = 2;
        }
    } else {
        if (infra != '') {
            highGround = 1;
            vision = 2;
        } else {
            highGround = 0;
            vision = 1;
        }
    }
    if (highGround === 1) {
        if (thisWeapon.elevation >= 1) {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (infra === 'Miradors' && ammo.range > 1 && thisWeapon.elevation === 3) {
            thisWeapon.range = thisWeapon.range+1;
        }
    } else if (highGround === 2) {
        if (thisWeapon.elevation === 1) {
            thisWeapon.range = thisWeapon.range+1;
        } else if (thisWeapon.elevation >= 2) {
            thisWeapon.range = thisWeapon.range+2;
            if (ammo.range > 1 && thisWeapon.elevation === 3) {
                thisWeapon.range = thisWeapon.range+1;
            }
        }
    }
    if (infra === 'Miradors') {
        vision = 3;
        thisWeapon.range = thisWeapon.range+1;
    }
    // Forêt (range)
    if (tile.terrain == 'F') {
        if (checkDeepForest(tile)) {
            if (thisWeapon.range >= 2) {
                if (thisWeapon.range >= 3) {
                    thisWeapon.range = 2;
                } else {
                    thisWeapon.range = 1;
                }
            }
        }
    }
    // Water (range)
    if (thisWeapon.range >= 2 && (tile.terrain == 'W' || tile.terrain == 'R') && !batType.skills.includes('fly') && !batType.skills.includes('hover')) {
        thisWeapon.range = thisWeapon.range-1;
    }
    if (playerInfos.dark && thisWeapon.range > vision) {
        thisWeapon.range = vision;
    }
    if (bat.tags.includes('fogged') && thisWeapon.range > 1) {
        thisWeapon.range = 1;
    }
    // console.log(thisWeapon);
    return thisWeapon;
};

function checkDeepForest(tile) {
    let deepForest = false;
    if (tile.terrain == 'F') {
        if (getTileTerrainName(tile.id+1) === 'F' && getTileTerrainName(tile.id-1) === 'F' && getTileTerrainName(tile.id+mapSize) === 'F' && getTileTerrainName(tile.id-mapSize) === 'F') {
            deepForest = true;
        }
    }
    return deepForest;
};

function calcShotDice(bat,luckyshot) {
    let luckDice = rand.rand(1,100);
    if (bat.team == 'player') {
        if (bat.tags.includes('lucky')) {
            luckDice = rand.rand(1,115);
        }
        if (luckyshot) {
            $('#report').append('<span class="report cy">Lucky shot!</span><br>');
            bat.tags.push('lucky');
            return 33;
        } else if (luckDice <= luckCheck[0]) {
            $('#report').append('<span class="report cy">Lucky shot!</span><br>');
            return 50;
        } else if (luckDice <= luckCheck[1]) {
            return 75;
        } else if (luckDice <= luckCheck[2]) {
            return 85;
        } else if (luckDice <= luckCheck[3]) {
            return 100;
        } else if (luckDice <= luckCheck[4]) {
            return 115;
        } else {
            $('#report').append('<span class="report cy">Fumble!</span><br>');
            tagDelete(bat,'lucky');
            return 150;
        }
    } else {
        if (luckDice <= luckCheck[0]) {
            $('#report').append('<span class="report cy">Lucky shot!</span><br>');
            return 70;
        } else if (luckDice <= luckCheck[1]) {
            return 85;
        } else if (luckDice <= luckCheck[2]) {
            return 100;
        } else if (luckDice <= luckCheck[3]) {
            return 100;
        } else if (luckDice <= luckCheck[4]) {
            return 120;
        } else {
            $('#report').append('<span class="report cy">Fumble!</span><br>');
            return 150;
        }
    }
};

function chargeurAdj(bat,shots,weap) {
    let newShots = shots;
    let mult = 1.5;
    if (weap.name.includes('Calibre') || weap.name.includes('verrou')) {
        mult = 2;
    }
    if (weap.name.includes('Revolver') || weap.name.includes('Blaster') || weap.name.includes('pompe')) {
        mult = 1.7;
    }
    if (weap.name.includes('assaut') || weap.name.includes('itrail') || weap.name.includes('Minigun') || weap.name.includes('semi-auto') || weap.name.includes('Blister')) {
        mult = 1.33;
    }
    if (bat.eq.includes('kit-guetteur')) {
        mult = 2;
    }
    if (bat.eq.includes('chargeur') || bat.eq.includes('kit-guetteur') || bat.eq === 'crimekitch' || bat.eq.includes('landerwkit') || bat.eq.includes('w2-l')) {
        if (weap.num === 1) {
            if (bat.eq === 'chargeur1' || bat.eq === 'chargeur' || bat.eq.includes('kit-guetteur') || bat.eq === 'crimekitch' || bat.eq.includes('landerwkit') || bat.eq.includes('w2-l')) {
                newShots = Math.round(newShots*mult);
            }
        } else {
            if (bat.eq === 'chargeur2' || bat.eq === 'chargeur' || bat.eq.includes('kit-guetteur')) {
                newShots = Math.round(newShots*mult);
            }
        }
    }
    mult = 1.25;
    if (bat.eq.includes('carrousel')) {
        if (weap.num === 1) {
            if (bat.eq === 'carrousel1' || bat.eq === 'carrousel') {
                newShots = Math.round(newShots*mult);
            }
        } else {
            if (bat.eq === 'carrousel2' || bat.eq === 'carrousel') {
                newShots = Math.round(newShots*mult);
            }
        }
    }
    return newShots;
};

function calcBrideDef(bat,batType,weap,attRange,guet) {
    let brideDef = 0.75;
    if (attRange === 0) {
        brideDef = 1/Math.sqrt(weap.cost-0.75);
        if (brideDef > 1) {
            brideDef = 1;
        }
        if (weap.range === 0) {
            brideDef = 0.75;
        }
    } else {
        if (weap.range === 0) {
            brideDef = 0.5;
        } else {
            brideDef = 0.75;
        }
    }
    // Guet, Defense, Bastion
    if (batType.skills.includes('bastion') && (weap.num === 1 || !weap.noBis)) {
        if (guet || batType.skills.includes('sentinelle') || batType.skills.includes('initiative')) {
            brideDef = 2;
        } else {
            brideDef = 1.5;
        }
        if (attRange >= 1 && weap.range === 0) {
            brideDef = brideDef/2;
        }
    } else if (batType.skills.includes('defense') && (weap.num === 1 || !weap.noBis)) {
        if (guet || batType.skills.includes('sentinelle') || batType.skills.includes('initiative')) {
            brideDef = 1.65;
        } else {
            brideDef = 1.2;
        }
        if (attRange >= 1 && weap.range === 0) {
            brideDef = brideDef/2;
        }
    } else {
        if (guet || batType.skills.includes('sentinelle') || batType.skills.includes('initiative') || batType.skills.includes('after')) {
            brideDef = 1;
        }
    }
    // baddef on bridage def
    if (batType.skills.includes('baddef')) {
        if (guet || batType.skills.includes('sentinelle') || batType.skills.includes('initiative') || batType.skills.includes('after')) {
            brideDef = brideDef/1.17;
        } else {
            brideDef = brideDef/1.5;
        }
    }
    // guerrilla
    if (brideDef < 1) {
        if (batType.skills.includes('guerrilla') && bat.oldTileId != bat.tileId) {
            let gmin = 0.75;
            let gmax = 1;
            if (batType.cat != 'aliens') {
                gmin = gmin+(playerInfos.comp.train/4);
                gmax = gmax+(playerInfos.comp.train/4);
            }
            if (batType.skills.includes('baddef')) {
                gmax = 0.85;
            }
            if (brideDef < gmax) {
                brideDef = brideDef*1.25;
                if (brideDef > gmax) {
                    brideDef = gmax;
                }
            }
            if (brideDef < gmin) {
                brideDef = gmin;
            }
        }
    }
    return brideDef;
}

function mirDestruction(weap,bat,batType,tile) {
    let power = weap.power-5;
    if (power < -1) {
        power = 1;
    } else if (power < 2) {
        power = 1.5;
    }
    let damage = Math.round(weap.rof*power*bat.squadsLeft);
    if (weap.ammo.includes('feu') || weap.ammo.includes('napalm') || weap.ammo.includes('fire') || weap.ammo.includes('pyratol') || weap.ammo.includes('lf-') || weap.ammo.includes('molotov') || weap.ammo.includes('nanite') || weap.ammo.includes('suicide') || weap.ammo.includes('mine') || weap.ammo.includes('autodestruction') || weap.ammo.includes('dynamite') || weap.ammo.includes('bombe') || weap.ammo.includes('explosif') || weap.ammo.includes('obus') || weap.ammo.includes('missile') || weap.ammo.includes('glair') || weap.ammo.includes('ruche') || weap.ammo.includes('bfg')) {
        if (batType.cat === 'aliens') {
            damage = damage*3;
        } else {
            damage = Math.round(damage/2);
        }
    } else if (weap.ammo.includes('troueur') || weap.ammo.includes('acide') || weap.ammo.includes('spit') || weap.ammo.includes('grenade') || weap.ammo.includes('lt-') || weap.ammo.includes('incendiaire')) {
        if (batType.cat === 'aliens') {
            damage = Math.round(damage*1.5);
        } else {
            damage = Math.round(damage/10);
        }
    } else if (batType.cat != 'aliens') {
        damage = 0;
    }
    if (batType.size >= 25) {
        damage = Math.round(damage*Math.sqrt(batType.size)/5);
    }
    console.log('MirDamage='+damage);
    let breakChance = Math.floor(damage/20);
    console.log('breakChance='+breakChance);
    if (rand.rand(1,100) <= breakChance) {
        warning('Destruction',bat.type+' a détruit les Miradors');
        tile.infra = 'Débris';
    }
};

function checkDisease(giveBatType,damage,haveBat,haveBatType,terrain) {
    let getIt = false;
    if (!haveBat.tags.includes('maladie')) {
        if (giveBatType.skills.includes('maladie') || giveBatType.skills.includes('chancre')) {
            if ((haveBatType.cat == 'infantry' && !haveBatType.skills.includes('mutant') && !haveBat.tags.includes('zombie')) || haveBatType.cat == 'aliens') {
                let getChance = (damage*5)+5;
                if (giveBatType.skills.includes('chancre')) {
                    getChance = getChance*3;
                } else {
                    getChance = Math.ceil(getChance/(playerInfos.comp.ca+5)*5);
                }
                if (terrain.name === 'S') {
                    getChance = getChance+25;
                }
                if (getChance > 33 && !giveBatType.skills.includes('chancre')) {
                    getChance = 33;
                }
                if (getChance < 10 && damage >= 1) {
                    getChance = 10;
                }
                if (rand.rand(1,100) <= getChance) {
                    getIt = true;
                }
            }
        }
    }
    return getIt;
};
