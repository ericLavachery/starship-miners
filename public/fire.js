function clickFire(tileId) {
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    showTileInfos(tileId);
    let alienBatHere = false;
    aliens.forEach(function(alien) {
        if (alien.tileId === tileId && alien.loc === "zone") {
            alienBatHere = true;
            targetBat = alien;
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
            console.log(targetBat);
            combat(selectedBat,selectedWeap,targetBat);
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
    let distance = calcDistance(myBat.tileId,thatBat.tileId);
    // riposte?
    let riposte = false;
    let initiative = true;
    if (distance <= 3 && targetWeap.cost <= 6) {
        riposte = true;
        if (calcSpeed(thatBat,thatBat.weapon,distance,false) > calcSpeed(myBat,myWeap,distance,true)) {
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
            totalDamage = totalDamage+blastA(aoeShots);
        } else {
            totalDamage = totalDamage+shotA();
        }
        if (i > 300) {break;}
        i++
    }
    console.log('Total Damage : '+totalDamage);
    // remove squads?
    let squadHP = targetBatType.squadSize*targetBatType.hp;
    console.log('Squad HP : '+squadHP);
    let squadsOut = Math.round(totalDamage/squadHP);
    targetBat.squadsLeft = targetBat.squadsLeft-squadsOut;
    console.log('Squads Out : '+squadsOut);
    // remove ap & salvo
    selectedBat.apLeft = selectedBat.apLeft-selectedWeap.cost;
    selectedBat.salvoLeft = selectedBat.salvoLeft-1;
    // update arrays
    selectedBatArrayUpdate();
    targetBatArrayUpdate();
};

function defense() {

};

function shotA() {
    // returns damage
    let damage = 0;
    let cover = getCover(targetBat);
    if (isHit(selectedWeap.accuracy,selectedWeap.aoe,targetBatType.size,targetBatType.stealth,cover)) {
        damage = calcDamage(selectedWeap.power,targetBatType.armor);
        if (damage > targetBatType.hp) {
            damage = targetBatType.hp;
        }
    }
    return damage;
};

function blastA(aoeShots) {
    // returns damage

};

function isHit(accuracy,aoe,size,stealth,cover) {
    let prec = accuracy-cover;
    if (aoe == 'unit') {
        prec = Math.round(prec-(stealth/2));
    }
    let dice = rand.rand(1,100);
    let hitChance = Math.round(Math.sqrt(size)*prec);
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
    let speed = crange*weap.cost/bat.maxSalvo;
    if (distance <= 1) {
        if (attacking) {
            speed = speed-bat.stealth-bat.stealth;
        } else {
            speed = speed-bat.stealth;
        }
    }
    return speed;
};
