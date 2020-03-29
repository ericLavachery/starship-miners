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

function isHit(accuracy,aoe,size,stealth,cover) {
    let prec = Math.round(accuracy-(cover*coverFactor));
    if (aoe == 'unit') {
        prec = Math.round(prec-(stealth/2));
    }
    if (prec < minPrec) {
        prec = minPrec;
    }
    let dice = rand.rand(1,100);
    let hitChance = Math.round(Math.sqrt(size)*prec);
    if (toHit === 999) {
        toHit = hitChance;
        $('#report').append('<span class="report">Précision: '+toHit+'%</span><br><span class="report">Dégâts: </span>');
    }
    console.log('hitChance '+hitChance);
    if (dice > hitChance) {
        return false;
    } else {
        return true;
    }
};

function calcDamage(power,armor) {
    // powerDice is max 4x power
    let powerDiceMin = Math.round(power/2.5);
    let powerDiceMax = Math.round(power*1.6);
    let powerDice = rand.rand(powerDiceMin,powerDiceMax);
    if (powerDice == powerDiceMax) {
        let bonusMax = Math.round(power*2.4);
        powerDice = powerDice+rand.rand(0,bonusMax);
    }
    return powerDice-armor;
};

function getCover(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    if (bat.team == 'aliens') {
        return terrain.aliencover;
    } else {
        return terrain.cover;
    }
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
    } else if (bat.team == 'locals') {
        unitIndex = localUnits.findIndex((obj => obj.id == bat.typeId));
        batType = localUnits[unitIndex];
    }
    return batType;
};

function getStealth(bat) {
    let cover = getCover(bat);
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

function calcSpeed(bat,weap,distance,attacking) {
    let crange = weap.range;
    // console.log('crange'+crange);
    if (weap.range === 0) {
        if (attacking) {
            crange = 1;
        } else {
            crange = 12;
        }
    }
    // console.log('cost'+weap.cost);
    let speed = Math.round(crange*weap.cost);
    let stealth = getStealth(bat);
    if (distance <= 1) {
        if (attacking) {
            speed = speed-stealth-stealth;
        } else {
            speed = speed-stealth;
        }
    }
    // console.log('stealth'+stealth);
    // console.log('speed'+speed);
    let vetDice = vetBonus.initiative*bat.vet;
    // console.log('vetDice'+vetDice);
    return speed+rand.rand(0,initiativeDice)-rand.rand(0,vetDice);
};

function isInMelee(myTileIndex,thatTileIndex) {
    let myTileX = zone[myTileIndex].x;
    let myTileY = zone[myTileIndex].y;
    let thatTileX = zone[thatTileIndex].x;
    let thatTileY = zone[thatTileIndex].y;
    if (myTileIndex == thatTileIndex || myTileIndex == thatTileIndex+1 || myTileIndex == thatTileIndex-1 || myTileIndex == thatTileIndex+mapSize || myTileIndex == thatTileIndex-mapSize) {
        return true;
    } else {
        return false;
    }
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

function fireInfos(bat) {
    isMelee = false;
    cursorSwitch('.','grid-item','pointer');
    let myTileX = zone[bat.tileId].x;
    let myTileY = zone[bat.tileId].y;
    zone.forEach(function(tile) {
        $("#"+tile.id).attr("title", "");
        if (alienHere(tile.id)) {
            if (isInMelee(selectedBat.tileId,tile.id)) {
                isMelee = true;
                cursorSwitch('#',tile.id,'fire');
            }
        }
    });
    if (!isMelee) {
        zone.forEach(function(tile) {
            $("#"+tile.id).attr("title", "");
            if (alienHere(tile.id)) {
                if (isInRange(selectedBat.tileId,tile.id)) {
                    cursorSwitch('#',tile.id,'fire');
                }
            }
        });
    }
};

function alienHere(tileId) {
    let alienBatHere = false;
    aliens.forEach(function(alien) {
        if (alien.tileId === tileId && alien.loc === "zone") {
            alienBatHere = true;
        }
    });
    return alienBatHere;
};

function shotSound(weapon) {
    // Juste un test : devrait aller chercher des sons différents selon l'arme :)
    var sound = new Howl({
        src: ['/static/sounds/'+weapon.sound+'.mp3']
    });
    sound.play();
};

function deathSound() {
    // Juste un test : devrait aller chercher des sons différents selon l'unité :)
    var sound = new Howl({
        src: ['/static/sounds/zapsplat_explosion_fireball_43738.mp3']
    });
    sound.play();
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

function weaponSelectRiposte() {
    targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon));
    // bonus veterancy & ammo
    targetWeap = weaponAdj(targetWeap,targetBat,'w1');
};

function weaponAdj(weapon,bat,wn) {
    // bonus veterancy
    let thisWeapon = {};
    let accuracy = Math.round(weapon.accuracy*(bat.vet+vetBonus.accuracy)/vetBonus.accuracy);
    thisWeapon.accuracy = accuracy;
    // bonus ammo
    thisWeapon.name = weapon.name;
    thisWeapon.cost = weapon.cost;
    thisWeapon.range = weapon.range;
    thisWeapon.rof = weapon.rof;
    thisWeapon.power = weapon.power;
    thisWeapon.armors = 1;
    thisWeapon.aoe = weapon.aoe;
    thisWeapon.sound = weapon.sound;
    let ammo = bat.ammo;
    if (wn == 'w2') {
        ammo = bat.ammo2;
    }
    if (ammo == 'perfo') {
        thisWeapon.power = thisWeapon.power-2;
        thisWeapon.armors = 0.5;
    }
    if (ammo == 'tungsten') {
        thisWeapon.armors = 0.5;
    }
    if (ammo == 'uranium') {
        thisWeapon.armors = 0.5;
        thisWeapon.power = thisWeapon.power+1;
    }
    if (ammo == 'teflon') {
        thisWeapon.armors = 0.75;
    }
    if (ammo == 'titanium') {
        thisWeapon.power = thisWeapon.power-1;
        thisWeapon.accuracy = Math.round(thisWeapon.accuracy*1.25);
    }
    if (ammo == 'hollow') {
        thisWeapon.power = thisWeapon.power+3;
        thisWeapon.armors = 2;
    }
    return thisWeapon;
};
