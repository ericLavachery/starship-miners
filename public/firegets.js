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
    let prec = Math.round(accuracy-(cover*coverFactor));
    if (aoe == 'unit' || aoe == 'brochette' || speed < 0) {
        prec = Math.round(prec-(stealth/2)-speed);
    }
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

function calcDamage(weapon,power,armor,defBat) {
    // powerDice is max 4x power
    // bigfortif
    let defBatType = getBatType(defBat);
    if (defBat.tags.includes('fortif')) {
        if (defBatType.skills.includes('bigfortif')) {
            armor = armor+2;
        } else if (armor < 2) {
            armor = armor+1;
        }
    }
    let armorModifier = weapon.armors;
    // creuseur
    if (weapon.ammo.includes('troueur') || weapon.ammo.includes('creuseur')) {
        if (defBat.tags.includes('trou')) {
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
        if (tile.talus) {
            cover = cover+2;
        }
    }
    if (tile.ruins) {
        if (cover > 5) {
            cover = cover+2;
        } else {
            cover = 5+Math.floor(cover/2);
        }
    }
    if (cover < 0) {
        if (batType.skills.includes('fly') && !batType.skills.includes('jetpack')) {
            cover = 0;
        }
        if (forAOE) {
            cover = Math.round(cover/2);
        }
    }
    if (forAOE) {
        cover = cover+coverAOE;
    }
    // Fortification
    if (withFortif) {
        if (bat.tags.includes('fortif')) {
            cover = terrain.fortifcover;
            if (batType.skills.includes('bigfortif')) {
                cover = cover+3;
            }
            if (tile.ruins) {
                cover = cover+2;
            }
        }
    }
    return cover;
};

function getBatType(bat) {
    let unitIndex;
    let batType;
    if (bat.team == 'player') {
        unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
        batType = unitTypes[unitIndex];
    } else if (bat.team == 'aliens') {
        unitIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
        batType = alienUnits[unitIndex];
    }
    return batType;
};

function getStealth(bat) {
    let cover = getCover(bat,false,false);
    let batType = getBatType(bat);
    let stealthBonus = 0;
    if (cover >= 4) {
        stealthBonus = Math.round((Math.sqrt(cover)-1.7)*(batType.stealth-5)/2);
        if (stealthBonus > 4) {
            stealthBonus = 4;
        }
        if (stealthBonus < 0) {
            stealthBonus = 0;
        }
    }
    let vetStealth = Math.round(bat.vet*vetBonus.stealth);
    let maxStealth = batType.stealth;
    let coverAdj = Math.round((cover+3)*1.8);
    if (coverAdj < 2) {
        coverAdj = 2;
    }
    if (batType.stealth > coverAdj) {
        maxStealth = coverAdj;
    }
    // Starka drug
    if (bat.tags.includes('starka')) {
        maxStealth = Math.floor(maxStealth/2);
    }
    return maxStealth+stealthBonus+vetStealth;
};

function getAP(bat) {
    let batType = getBatType(bat);
    return bat.ap+Math.round(bat.vet*vetBonus.ap);
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
    if ((bat.tags.includes('guet') || batType.skills.includes('sentinelle')) && !attacking) {
        speed = speed-watchInitBonus-stealth;
        console.log('bonus guet');
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
    if (batType.skills.includes('defense') && !attacking) {
        speed = speed-10;
    }
    if (batType.skills.includes('bastion') && !attacking) {
        speed = speed-20;
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
    if (selectedBat.fuzz <= -2 && fuzzThing) {
        return false;
    } else {
        let myTileX = zone[myTileIndex].x;
        let myTileY = zone[myTileIndex].y;
        let thatTileX = zone[thatTileIndex].x;
        let thatTileY = zone[thatTileIndex].y;
        if (myTileIndex == thatTileIndex || myTileIndex == thatTileIndex+1 || myTileIndex == thatTileIndex-1 || myTileIndex == thatTileIndex+mapSize || myTileIndex == thatTileIndex-mapSize) {
            return true;
        } else {
            return false;
        }
    }
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

function isInRange(myTileIndex,thatTileIndex) {
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
    let range = selectedWeap.range;
    if (range === 0) {
        if (myTileIndex == thatTileIndex+1 || myTileIndex == thatTileIndex-1 || myTileIndex == thatTileIndex+mapSize || myTileIndex == thatTileIndex-mapSize) {
            return true;
        } else {
            return false;
        }
    } else {
        if (distance > range) {
            return false;
        } else {
            return true;
        }
    }
};

function calcDistance(myTileIndex,thatTileIndex) {
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

function anyAlienInRange(myBat,weapon) {
    let tileId = myBat.tileId;
    let distance;
    let inRange = false;
    let batIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(tileId,bat.tileId);
            if (distance <= weapon.range || checkGuidage(weapon,bat)) {
                batIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
                batType = alienUnits[batIndex];
                if ((!weapon.noFly || !batType.skills.includes('fly')) && (!weapon.noGround || batType.skills.includes('fly') || batType.skills.includes('sauteur')) && ((!batType.skills.includes('invisible') && !bat.tags.includes('invisible')) || distance === 0)) {
                    inRange = true;
                }
            }
        }
    });
    return inRange;
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

function fireInfos(bat) {
    isMelee = false;
    let batType = getBatType(bat);
    cursorSwitch('.','grid-item','pointer');
    let myTileX = zone[bat.tileId].x;
    let myTileY = zone[bat.tileId].y;
    let alien = {};
    let alienIndex;
    let alienType;
    let longMelee = false;
    let guideTarget = false;
    zone.forEach(function(tile) {
        $("#"+tile.id).attr("title", "");
        alien = alienHere(tile.id);
        if (Object.keys(alien).length >= 1) {
            alienType = getBatType(alien);
            if (sideBySideTiles(selectedBat.tileId,tile.id,true) && !batType.skills.includes('longshot')) {
                isMelee = true;
                if (checkFlyTarget(selectedWeap,alienType)) {
                    cursorSwitch('#',tile.id,'fire');
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
                if (isInRange(selectedBat.tileId,tile.id) || guideTarget) {
                    alienType = getBatType(alien);
                    if (checkFlyTarget(selectedWeap,alienType) && ((!alienType.skills.includes('invisible') && !alien.tags.includes('invisible')) || sideBySideTiles(selectedBat.tileId,tile.id,false))) {
                        cursorSwitch('#',tile.id,'fire');
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
    let baseAmmo = 99;
    let ammoLeft = 99;
    targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon));
    targetWeap = weaponAdj(targetWeap,targetBat,'w1');
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
                targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon));
                targetWeap = weaponAdj(targetWeap,targetBat,'w1');
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
    batType = getBatType(bat);
    // bonus veterancy
    let thisWeapon = {};
    if (wn == 'w2') {
        thisWeapon.num = 2;
    } else {
        thisWeapon.num = 1;
    }
    let accuracy = Math.round(weapon.accuracy*(bat.vet+vetBonus.accuracy)/vetBonus.accuracy);
    thisWeapon.accuracy = accuracy;
    // bonus ammo
    thisWeapon.name = weapon.name;
    thisWeapon.cost = weapon.cost;
    thisWeapon.range = weapon.range;
    thisWeapon.rof = weapon.rof;
    thisWeapon.power = weapon.power;
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
    thisWeapon.rof = Math.round(thisWeapon.rof*ammo.rof);
    thisWeapon.power = thisWeapon.power+ammo.power;
    thisWeapon.apdamage = ammo.apdamage;
    thisWeapon.armors = thisWeapon.armors*ammo.armors;
    thisWeapon.armors = thisWeapon.armors.toFixedNumber(2);
    thisWeapon.accuracy = Math.round(thisWeapon.accuracy*ammo.accuracy);
    if (ammo.aoe != '' && thisWeapon.aoe != 'bat') {
        thisWeapon.aoe = ammo.aoe;
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
    // skills
    let batUnitType = getBatType(bat);
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    let vision = 1;
    // ELEVATION
    console.log(thisWeapon.elevation);
    console.log(tile.terrain);
    if (tile.terrain == 'M') {
        vision = 3;
        if (thisWeapon.elevation === 1) {
            thisWeapon.range = thisWeapon.range+1;
        } else if (thisWeapon.elevation === 2) {
            thisWeapon.range = thisWeapon.range+2;
        }
    } else if (tile.terrain == 'H') {
        vision = 2;
        if (thisWeapon.elevation >= 1) {
            thisWeapon.range = thisWeapon.range+1;
        }
    } else if (tile.talus) {
        vision = 2;
        if (thisWeapon.elevation >= 1 && (batType.cat != 'vehicles' || batType.skills.includes('robot') || batType.skills.includes('cyber'))) {
            thisWeapon.range = thisWeapon.range+1;
        }
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
    console.log(thisWeapon);
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

function getTileTerrainName(tileId) {
    let tername = 'P';
    if (tileId < 3600 && tileId >= 0) {
        let tileIndex = zone.findIndex((obj => obj.id == tileId));
        let tile = zone[tileIndex];
        let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
        let terrain = terrainTypes[terrainIndex];
        tername = terrain.name;
    }
    return tername;
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
    // embuscade on bridage def
    if (batType.skills.includes('baddef')) {
        if (guet || batType.skills.includes('sentinelle') || batType.skills.includes('initiative') || batType.skills.includes('after')) {
            brideDef = brideDef/1.17;
        } else {
            brideDef = brideDef/1.5;
        }
    }
    return brideDef;
}
