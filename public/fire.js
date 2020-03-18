function clickFire(tileId) {
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    showTileInfos(tileId);
    let alienBatHere = false;
    aliens.forEach(function(alien) {
        if (alien.tileId === tileId && alien.loc === "zone") {
            alienBatHere = true;
            targetBat = JSON.parse(JSON.stringify(alien));
        }
    });
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
    if (isInRange(selectedBat.tileId,tileId)) {
        if (alienBatHere) {
            // console.log(targetBat);
            combat(selectedBat,selectedWeap,targetBat);
            selectMode();
            showBatInfos(selectedBat);
        } else if (selectedBat.tileId === tileId) {
            // re-click sur l'unité active : unselect
            selectMode();
            batUnstack();
            batUnselect();
        }
    } else {
        targetBat = {};
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

function weaponSelectRiposte() {
    targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon));
    // bonus veterancy & ammo
    targetWeap = weaponAdj(targetWeap,targetBat,'w1');
};

function weaponAdj(weapon,bat,wn) {
    // bonus veterancy
    let thisWeapon = {};
    let accuracy = Math.round(weapon.accuracy*(bat.vet+vetBonus)/vetBonus);
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
        thisWeapon.accuracy = Math.round(thisWeapon.accuracy*1.5);
    }
    if (ammo == 'hollow') {
        thisWeapon.power = thisWeapon.power+3;
        thisWeapon.armors = 2;
    }
    return thisWeapon;
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
    cursorSwitch('.','grid-item','pointer');
    let myTileX = zone[bat.tileId].x;
    let myTileY = zone[bat.tileId].y;
    zone.forEach(function(tile) {
        $("#"+tile.id).attr("title", "");
        if (alienHere(tile.id)) {
            if (isInRange(selectedBat.tileId,tile.id)) {
                cursorSwitch('#',tile.id,'fire');
            }
        }
    });
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

function combat(myBat,myWeap,thatBat) {
    weaponSelectRiposte();
    // console.log(targetWeap);
    let distance = calcDistance(myBat.tileId,thatBat.tileId);
    console.log('distance '+distance);
    // riposte?
    let riposte = false;
    let initiative = true;
    if (distance <= 3 && targetWeap.cost <= 6 && targetWeap.range >= distance) {
        riposte = true;
        if (calcSpeed(thatBat,targetWeap,distance,false) > calcSpeed(myBat,myWeap,distance,true)) {
            initiative = false;
        }
    }
    if (riposte) {
        if (initiative) {
            attack();
            defense();
        } else {
            defense();
            attack();
        }
    } else {
        attack();
    }
};

function attack() {
    console.log(selectedWeap);
    shotSound(selectedWeap);
    // AOE Shots
    let aoeShots = 1;
    if (selectedWeap.aoe == "bat") {
        aoeShots = targetBatType.squadSize*targetBat.squadsLeft;
    } else if (selectedWeap.aoe == "squad") {
        aoeShots = targetBatType.squadSize;
    }
    // rof*squadsLeft loop
    let shots = selectedWeap.rof*selectedBat.squadsLeft;
    let totalDamage = 0;
    i = 1;
    while (i <= shots) {
        if (aoeShots >= 2) {
            totalDamage = totalDamage+blast(aoeShots,selectedWeap,targetBat,targetBatType);
        } else {
            totalDamage = totalDamage+shot(selectedWeap,targetBat,targetBatType);
        }
        if (i > 300) {break;}
        i++
    }
    console.log('Damage : '+totalDamage);
    // add damage! remove squads? remove bat?
    console.log('Previous Damage : '+targetBat.damage);
    totalDamage = totalDamage+targetBat.damage;
    let squadHP = (targetBatType.squadSize*targetBatType.hp);
    console.log('Squad HP : '+squadHP);
    let squadsOut = Math.floor(totalDamage/squadHP);
    targetBat.squadsLeft = targetBat.squadsLeft-squadsOut;
    console.log('Squads Out : '+squadsOut);
    targetBat.damage = totalDamage-(squadsOut*squadHP);
    console.log('Damage Left : '+targetBat.damage);
    if (targetBat.squadsLeft <= 0) {
        setTimeout(function (){
            batDeath(targetBat);
        }, 2000); // How long do you want the delay to be (in milliseconds)?
    } else {
        targetBatArrayUpdate();
    }
    // remove ap & salvo
    selectedBat.apLeft = selectedBat.apLeft-selectedWeap.cost;
    selectedBat.salvoLeft = selectedBat.salvoLeft-1;
    selectedBatArrayUpdate();
};

function defense() {
    console.log(targetWeap);
    shotSound(targetWeap);
    // AOE Shots
    let aoeShots = 1;
    if (targetWeap.aoe == "bat") {
        aoeShots = selectedBatType.squadSize*selectedBat.squadsLeft;
    } else if (targetWeap.aoe == "squad") {
        aoeShots = selectedBatType.squadSize;
    }
    // rof*squadsLeft loop
    let shots = targetWeap.rof*targetBat.squadsLeft;
    console.log(shots);
    console.log(aoeShots);
    let totalDamage = 0;
    i = 1;
    while (i <= shots) {
        if (aoeShots >= 2) {
            totalDamage = totalDamage+blast(aoeShots,targetWeap,selectedBat,selectedBatType);
        } else {
            totalDamage = totalDamage+shot(targetWeap,selectedBat,selectedBatType);
        }
        if (i > 300) {break;}
        i++
    }
    console.log('Damage : '+totalDamage);
    // add damage! remove squads? remove bat?
    console.log('Previous Damage : '+selectedBat.damage);
    totalDamage = totalDamage+selectedBat.damage;
    let squadHP = (selectedBatType.squadSize*selectedBatType.hp);
    console.log('Squad HP : '+squadHP);
    let squadsOut = Math.floor(totalDamage/squadHP);
    selectedBat.squadsLeft = selectedBat.squadsLeft-squadsOut;
    console.log('Squads Out : '+squadsOut);
    selectedBat.damage = totalDamage-(squadsOut*squadHP);
    console.log('Damage Left : '+selectedBat.damage);
    if (selectedBat.squadsLeft <= 0) {
        setTimeout(function (){
            batDeath(selectedBat);
        }, 2000); // How long do you want the delay to be (in milliseconds)?
    } else {
        selectedBatArrayUpdate();
    }
    // remove ap & salvo
    targetBat.apLeft = targetBat.apLeft-targetWeap.cost;
    targetBat.salvoLeft = targetBat.salvoLeft-1;
    targetBatArrayUpdate();
};

function shot(weapon,bat,batType) {
    // returns damage
    let damage = 0;
    let cover = getCover(bat);
    if (isHit(weapon.accuracy,weapon.aoe,batType.size,batType.stealth,cover)) {
        damage = calcDamage(weapon.power,batType.armor);
        if (damage > batType.hp) {
            damage = batType.hp;
        }
    }
    return damage;
};

function blast(aoeShots,weapon,bat,batType) {
    // returns damage
    // console.log('aoeShots = '+aoeShots);
    let damage = 0;
    let newDamage = 0;
    let power = weapon.power;
    let oldPower = weapon.power;
    let cover = getCover(bat);
    ii = 1;
    while (ii <= aoeShots) {
        // console.log('power'+power);
        if (isHit(weapon.accuracy,weapon.aoe,batType.size,batType.stealth,cover)) {
            newDamage = calcDamage(power,batType.armor);
            if (newDamage > batType.hp) {
                newDamage = batType.hp;
            }
            damage = damage+newDamage;
        }
        if (ii > 100) {break;}
        oldPower = power;
        power = Math.round(power*0.9);
        if (power >= oldPower) {
            power = power-1;
        }
        if (power < 3) {
            break;
        }
        ii++
    }
    return damage;
};

function isHit(accuracy,aoe,size,stealth,cover) {
    let prec = Math.round(accuracy-(cover*coverFactor));
    if (aoe == 'unit') {
        prec = Math.round(prec-(stealth/2));
    }
    let dice = rand.rand(1,100);
    let hitChance = Math.round(Math.sqrt(size)*prec);
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
    return terrain.cover;
};

function calcSpeed(bat,weap,distance,attacking) {
    let crange = weap.range;
    if (weap.range === 0) {
        if (attacking) {
            crange = 1;
        } else {
            crange = 12;
        }
    }
    let speed = Math.round(crange*weap.cost/bat.maxSalvo);
    if (distance <= 1) {
        if (attacking) {
            speed = speed-bat.stealth-bat.stealth;
        } else {
            speed = speed-bat.stealth;
        }
    }
    return speed;
};

function batDeath(bat) {
    console.log('DEATH');
    deathSound();
    if (bat.team == 'player') {
        let batIndex = bataillons.findIndex((obj => obj.id == bat.id));
        bataillons.splice(batIndex,1);
    } else if (bat.team == 'aliens') {
        let batIndex = aliens.findIndex((obj => obj.id == bat.id));
        aliens.splice(batIndex,1);
    } else if (bat.team == 'locals') {
        let batIndex = locals.findIndex((obj => obj.id == bat.id));
        locals.splice(batIndex,1);
    }
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    $('#b'+bat.tileId).append('<div class="pUnits"><img src="/static/img/explosion'+nextExplosion+'.gif"></div>'+resHere);
    nextExplosion = nextExplosion+1;
    if (nextExplosion > 3) {
        nextExplosion = 1;
    }
    setTimeout(function (){
        $('#b'+bat.tileId).empty();
        $('#b'+bat.tileId).append(resHere);
    }, 2000); // How long do you want the delay to be (in milliseconds)?
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
