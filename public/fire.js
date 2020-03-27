function clickFire(tileId) {
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    showTileInfos(tileId);
    let alienBatHere = false;
    aliens.forEach(function(alien) {
        if (alien.tileId === tileId && alien.loc === "zone") {
            alienBatHere = true;
            targetBat = JSON.parse(JSON.stringify(alien));
            tileTarget(targetBat);
        }
    });
    checkTargetBatType();
    if (isMelee) {
        // en mêlée : choix limité de cibles
        if (isInMelee(selectedBat.tileId,tileId)) {
            if (alienBatHere) {
                // console.log(targetBat);
                combat();
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
            targetBatType = {};
            targetWeap = {};
        }
    } else {
        // hors mêlée
        if (isInRange(selectedBat.tileId,tileId)) {
            if (alienBatHere) {
                // console.log(targetBat);
                combat();
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
            targetBatType = {};
            targetWeap = {};
        }
    }
};

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

function combat() {
    console.log('START COMBAT');
    if (activeTurn == 'player') {
        attAlive = true;
        defAlive = true;
    }
    let selectedBatUnits = selectedBat.squadsLeft*selectedBatType.squadSize;
    let targetBatUnits = targetBat.squadsLeft*targetBatType.squadSize;
    $('#report').empty('');
    $('#report').append('<span class="report or">'+selectedBatUnits+' '+selectedBat.type+'</span> <span class="report">vs</span> <span class="report or">'+targetBatUnits+' '+targetBat.type+'</span><br>');
    weaponSelectRiposte();
    // console.log(targetWeap);
    let distance = calcDistance(selectedBat.tileId,targetBat.tileId);
    // console.log('distance '+distance);
    $('#report').append('<span class="report">distance '+distance+'</span><br>');
    // riposte?
    let riposte = false;
    let initiative = true;
    if (distance <= 3 && targetWeap.cost <= 6 && targetWeap.range >= distance) {
        riposte = true;
        let aspeed = calcSpeed(selectedBat,selectedWeap,selectedBatType,distance,true);
        let dspeed = calcSpeed(targetBat,targetWeap,targetBatType,distance,false);
        $('#report').append('<span class="report">initiative '+aspeed+' vs '+dspeed+'</span><br>');
        if (dspeed < aspeed) {
            initiative = false;
        }
    }
    if (riposte) {
        console.log('riposte');
        if (initiative) {
            console.log('initiative');
            if (activeTurn == 'player') {blockMe(true);}
            shotSound(selectedWeap);
            attack();
            if (defAlive) {
                defense();
                setTimeout(function (){
                    shotSound(targetWeap);
                    if (activeTurn == 'player') {blockMe(false);}
                }, 2500); // How long do you want the delay to be (in milliseconds)?
            } else {
                setTimeout(function (){
                    if (activeTurn == 'player') {blockMe(false);}
                }, 2000); // How long do you want the delay to be (in milliseconds)?
            }
        } else {
            console.log("pas d'initiative");
            if (activeTurn == 'player') {blockMe(true);}
            shotSound(targetWeap);
            defense();
            if (attAlive) {
                attack();
                setTimeout(function (){
                    shotSound(selectedWeap);
                    if (activeTurn == 'player') {blockMe(false);}
                }, 2500); // How long do you want the delay to be (in milliseconds)?
            } else {
                setTimeout(function (){
                    if (activeTurn == 'player') {blockMe(false);}
                }, 2000); // How long do you want the delay to be (in milliseconds)?
            }
        }
    } else {
        console.log('pas de riposte');
        if (activeTurn == 'player') {blockMe(true);}
        shotSound(selectedWeap);
        attack();
        setTimeout(function (){
            if (activeTurn == 'player') {blockMe(false);}
        }, 2000); // How long do you want the delay to be (in milliseconds)?
    }
};

function attack() {
    console.log('Attaque ->');
    console.log(selectedWeap);
    $('#report').append('<span class="report or">'+selectedBat.type+' ('+selectedWeap.name+')</span><br>');
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
    toHit = 999;
    let i = 1;
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
    $('#report').append('<span class="report">('+totalDamage+')<br></span>');
    // add damage! remove squads? remove bat?
    console.log('Previous Damage : '+targetBat.damage);
    totalDamage = totalDamage+targetBat.damage;
    let squadHP = (targetBatType.squadSize*targetBatType.hp);
    console.log('Squad HP : '+squadHP);
    let squadsOut = Math.floor(totalDamage/squadHP);
    targetBat.squadsLeft = targetBat.squadsLeft-squadsOut;
    console.log('Squads Out : '+squadsOut);
    if (squadsOut >= 1) {
        let deadUnits = targetBatType.squadSize*squadsOut;
        let unitsLeft = targetBatType.squadSize*targetBat.squadsLeft;
        $('#report').append('<span class="report cy">Unités: -'+deadUnits+'</span> <span class="report">(reste '+unitsLeft+')<br></span>');
    }
    targetBat.damage = totalDamage-(squadsOut*squadHP);
    console.log('Damage Left : '+targetBat.damage);
    targetBatArrayUpdate();
    if (targetBat.squadsLeft <= 0) {
        defAlive = false;
        batDeath(targetBat);
        $('#report').append('<span class="report cy">Bataillon détruit<br></span>');
        setTimeout(function (){
            batDeathEffect(targetBat);
        }, 2000); // How long do you want the delay to be (in milliseconds)?
    } else {
        // targetBatArrayUpdate();
        if (targetBat.team == 'player') {
            showBataillon(targetBat);
        } else {
            showAlien(targetBat);
        }
    }
    // remove ap & salvo
    selectedBat.apLeft = selectedBat.apLeft-selectedWeap.cost;
    selectedBat.salvoLeft = selectedBat.salvoLeft-1;
    if (squadsOut >= 1 && activeTurn == 'player') {
        selectedBat.xp = selectedBat.xp+1;
    }
    selectedBatArrayUpdate();
};

function defense() {
    console.log('Défense ->');
    console.log(targetWeap);
    $('#report').append('<span class="report or">'+targetBat.type+' ('+targetWeap.name+')</span><br>');
    // AOE Shots
    let aoeShots = 1;
    if (targetWeap.aoe == "bat") {
        aoeShots = selectedBatType.squadSize*selectedBat.squadsLeft;
    } else if (targetWeap.aoe == "squad") {
        aoeShots = selectedBatType.squadSize;
    }
    // rof*squadsLeft loop
    let shots = targetWeap.rof*targetBat.squadsLeft;
    // console.log(shots);
    // console.log(aoeShots);
    let totalDamage = 0;
    toHit = 999;
    let i = 1;
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
    $('#report').append('<span class="report">('+totalDamage+')<br></span>');
    // add damage! remove squads? remove bat?
    console.log('Previous Damage : '+selectedBat.damage);
    totalDamage = totalDamage+selectedBat.damage;
    let squadHP = (selectedBatType.squadSize*selectedBatType.hp);
    console.log('Squad HP : '+squadHP);
    let squadsOut = Math.floor(totalDamage/squadHP);
    selectedBat.squadsLeft = selectedBat.squadsLeft-squadsOut;
    console.log('Squads Out : '+squadsOut);
    if (squadsOut >= 1) {
        let deadUnits = selectedBatType.squadSize*squadsOut;
        let unitsLeft = selectedBatType.squadSize*selectedBat.squadsLeft;
        $('#report').append('<span class="report cy">Unités: -'+deadUnits+'</span> <span class="report">(reste '+unitsLeft+')<br></span>');
    }
    selectedBat.damage = totalDamage-(squadsOut*squadHP);
    console.log('Damage Left : '+selectedBat.damage);
    selectedBatArrayUpdate();
    if (selectedBat.squadsLeft <= 0) {
        attAlive = false;
        batDeath(selectedBat);
        $('#report').append('<span class="report cy">Bataillon détruit<br></span>');
        setTimeout(function (){
            batDeathEffect(selectedBat);
        }, 2000); // How long do you want the delay to be (in milliseconds)?
    } else {
        // selectedBatArrayUpdate();
        if (selectedBat.team == 'player') {
            showBataillon(selectedBat);
        } else {
            showAlien(selectedBat);
        }
    }
    // remove ap
    targetBat.apLeft = targetBat.apLeft-1;
    if (squadsOut >= 1 && activeTurn == 'aliens') {
        targetBat.xp = targetBat.xp+1;
    }
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
        if (damage < 0) {
            damage = 0;
        }
        $('#report').append('<span class="report">'+damage+' </span>');
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
    let ii = 1;
    while (ii <= aoeShots) {
        // console.log('power'+power);
        if (isHit(weapon.accuracy,weapon.aoe,batType.size,batType.stealth,cover)) {
            newDamage = calcDamage(power,batType.armor);
            if (newDamage > batType.hp) {
                newDamage = batType.hp;
            }
            if (damage < 0) {
                damage = 0;
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
    $('#report').append('<span class="report">'+damage+' </span>');
    return damage;
};

function isHit(accuracy,aoe,size,stealth,cover) {
    let prec = Math.round(accuracy-(cover*coverFactor));
    if (aoe == 'unit') {
        prec = Math.round(prec-(stealth/2));
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

function batDeath(bat) {
    console.log('DEATH');
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
    alienOccupiedTileList();
};

function batDeathEffect(bat) {
    deathSound();
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
    }, 1500); // How long do you want the delay to be (in milliseconds)?
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

function calcSpeed(bat,weap,type,distance,attacking) {
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
    if (distance <= 1) {
        if (attacking) {
            speed = speed-type.stealth-type.stealth;
        } else {
            speed = speed-type.stealth;
        }
    }
    // console.log('stealth'+type.stealth);
    // console.log('speed'+speed);
    let vetDice = vetInitiative*bat.vet;
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
    let accuracy = Math.round(weapon.accuracy*(bat.vet+vetAccuracy)/vetAccuracy);
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
