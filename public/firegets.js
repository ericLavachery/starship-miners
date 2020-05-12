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

function isHit(accuracy,aoe,size,stealth,cover,speed,shotDice) {
    let prec = Math.round(accuracy-(cover*coverFactor));
    if (aoe == 'unit' || aoe == 'brochette' || speed < 0) {
        prec = Math.round(prec-(stealth/2)-speed);
    }
    if (prec < minPrec) {
        prec = minPrec;
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
    let modifiedArmor = Math.round(armor*weapon.armors);
    // creuseur
    if (weapon.ammo.includes('troueur') && weapon.ammo.includes('creuseur')) {
        if (defBat.tags.includes('trou')) {
            modifiedArmor = 0.15;
        }
    }
    let powerDiceMin = Math.round(power/2.5);
    let powerDiceMax = Math.round(power*1.6);
    let powerDice = rand.rand(powerDiceMin,powerDiceMax);
    if (powerDice == powerDiceMax) {
        let bonusMax = Math.round(power*2.4);
        powerDice = powerDice+rand.rand(0,bonusMax);
    }
    // bliss drug
    let dmgReduct = 0;
    if (defBat.tags.includes('bliss')) {
        dmgReduct = 2;
    }
    let calculatedDmg = powerDice-modifiedArmor-dmgReduct;
    if (calculatedDmg < 0) {
        calculatedDmg = 0;
    }
    return calculatedDmg;
};

function getCover(bat,withFortif) {
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
    }
    // Fortification
    if (withFortif) {
        if (bat.tags.includes('fortif')) {
            if (cover >= 2) {
                cover = 5+Math.round(cover/1.9);
            } else if (cover >= 0) {
                cover = 5;
            }
        }
    }
    return cover;
};

function getTerrain(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    return terrain;
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
    let cover = getCover(bat,false);
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
    return maxStealth+stealthBonus+vetStealth;
};

function getAP(bat) {
    let batType = getBatType(bat);
    return batType.ap+Math.round(bat.vet*vetBonus.ap);
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
    if (bat.tags.includes('guet') || batType.skills.includes('sentinelle')) {
        speed = speed-watchInitBonus-stealth;
        console.log('bonus guet');
    }
    if (weap.ammo.includes('disco') && attacking) {
        speed = speed-20;
    }
    let vetDice = vetBonus.initiative*bat.vet;
    return speed+rand.rand(0,initiativeDice)-rand.rand(0,vetDice);
};

function sideBySideTiles(myTileIndex,thatTileIndex) {
    if (selectedBat.tags.includes('camo')) {
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
    aliens.forEach(function(alien) {
        if (alien.loc === "zone") {
            if (bat.tileId == alien.tileId+1 || bat.tileId == alien.tileId-1 || bat.tileId == alien.tileId+mapSize || bat.tileId == alien.tileId-mapSize) {
                if (alien.range === 0 && !bat.tags.includes('camo')) {
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

function anyAlienInRange(tileId,weapon) {
    let distance;
    let inRange = false;
    let batIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(tileId,bat.tileId);
            if (distance <= weapon.range) {
                batIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
                batType = alienUnits[batIndex];
                if (!weapon.noFly || !batType.skills.includes('fly')) {
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
        return true;
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
    zone.forEach(function(tile) {
        $("#"+tile.id).attr("title", "");
        alien = alienHere(tile.id);
        if (Object.keys(alien).length >= 1) {
            if (sideBySideTiles(selectedBat.tileId,tile.id) && !batType.skills.includes('longshot')) {
                isMelee = true;
                alienIndex = alienUnits.findIndex((obj => obj.id == alien.typeId));
                alienType = alienUnits[alienIndex];
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
                if (isInRange(selectedBat.tileId,tile.id)) {
                    alienIndex = alienUnits.findIndex((obj => obj.id == alien.typeId));
                    alienType = alienUnits[alienIndex];
                    if (checkFlyTarget(selectedWeap,alienType)) {
                        cursorSwitch('#',tile.id,'fire');
                    }
                }
            }
        });
    }
};

function alienHere(tileId) {
    let alienBatHere = {};
    aliens.forEach(function(alien) {
        if (alien.tileId === tileId && alien.loc === "zone") {
            alienBatHere = alien;
        }
    });
    return alienBatHere;
};

function shotSound(weapon) {
    if (!isFFW) {
        console.log(weapon);
        var sound = new Howl({
            src: ['/static/sounds/'+weapon.sound+'.mp3']
        });
        sound.play();
        console.log(sound);
    }
};

function deathSound() {
    if (!isFFW) {
        var sound = new Howl({
            src: ['/static/sounds/zapsplat_explosion_fireball_43738.mp3']
        });
        sound.play();
    }
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
        if (ammoLeft <= 0 || distance > targetWeap.range || targetWeap.noDef) {
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
    // sila drug
    if (bat.tags.includes('sila') && thisWeapon.isMelee) {
        thisWeapon.power = thisWeapon.power+4;
    }
    // skupiac drug
    if (bat.tags.includes('skupiac')) {
        thisWeapon.accuracy = thisWeapon.accuracy+6;
        thisWeapon.power = thisWeapon.power+1;
    }
    thisWeapon.armors = 1;
    thisWeapon.aoe = weapon.aoe;
    thisWeapon.sound = weapon.sound;
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
    if (weapon.isBow === undefined) {
        thisWeapon.isBow = false;
    } else {
        thisWeapon.isBow = weapon.isBow;
        thisWeapon.accuracy = thisWeapon.accuracy+Math.round(bat.vet*2);
    }
    let myAmmo = bat.ammo;
    if (wn == 'w2') {
        myAmmo = bat.ammo2;
    }
    let ammoIndex = ammoTypes.findIndex((obj => obj.name == myAmmo));
    let ammo = ammoTypes[ammoIndex];
    thisWeapon.ammo = myAmmo;
    thisWeapon.range = thisWeapon.range+ammo.range;
    thisWeapon.rof = Math.round(thisWeapon.rof*ammo.rof);
    thisWeapon.power = thisWeapon.power+ammo.power;
    thisWeapon.apdamage = ammo.apdamage;
    thisWeapon.armors = thisWeapon.armors*ammo.armors;
    thisWeapon.accuracy = Math.round(thisWeapon.accuracy*ammo.accuracy);
    if (ammo.aoe != '') {
        thisWeapon.aoe = ammo.aoe;
    }
    // skills
    let batUnitType = getBatType(bat);
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    // ELEVATION
    if (wn == 'w2' && bat.team == 'player') {
        // let batTypeIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
        // let batUnitType = unitTypes[batTypeIndex];
        if (batUnitType.skills.includes('elevation') || batUnitType.skills.includes('selevation')) {
            if (tile.terrain == 'H') {
                thisWeapon.range = thisWeapon.range+1;
            } else if (tile.terrain == 'M') {
                if (batUnitType.skills.includes('selevation')) {
                    thisWeapon.range = thisWeapon.range+1;
                } else {
                    thisWeapon.range = thisWeapon.range+2;
                }
            }
        }
    }
    if (bat.team == 'aliens') {
        // let batTypeIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
        // let batUnitType = alienUnits[batTypeIndex];
        if (batUnitType.skills.includes('elevation')) {
            if (tile.terrain == 'H') {
                thisWeapon.range = thisWeapon.range+1;
            } else if (tile.terrain == 'M') {
                thisWeapon.range = thisWeapon.range+2;
            }
        }
    }
    // Forêt (range)
    if (thisWeapon.range >= 2 && tile.terrain == 'F') {
        if (thisWeapon.range >= 3) {
            thisWeapon.range = 2;
        } else {
            thisWeapon.range = 1;
        }
    }
    console.log(thisWeapon);
    return thisWeapon;
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
