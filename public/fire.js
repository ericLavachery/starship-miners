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
        let aspeed = calcSpeed(selectedBat,selectedWeap,distance,true);
        let dspeed = calcSpeed(targetBat,targetWeap,distance,false);
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
    // tir ciblé
    if (selectedBat.tags.includes('vise')) {
        shots = Math.round(shots*2/3);
    }
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
        }, 3000); // How long do you want the delay to be (in milliseconds)?
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
    let shots = Math.round(targetWeap.rof*targetBat.squadsLeft*brideDef);
    // Guet
    if (targetBat.tags.includes('guet')) {
        shots = targetWeap.rof*targetBat.squadsLeft;
    }
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
        }, 3000); // How long do you want the delay to be (in milliseconds)?
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

function combatReport() {
    $('#report').append(report);
    report = '';
};

function shot(weapon,bat,batType) {
    // returns damage
    let damage = 0;
    let cover = getCover(bat,true);
    let stealth = getStealth(bat);
    if (isHit(weapon.accuracy,weapon.aoe,batType.size,stealth,cover)) {
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
    let cover = getCover(bat,true);
    let stealth = getStealth(bat);
    let ii = 1;
    while (ii <= aoeShots) {
        // console.log('power'+power);
        if (isHit(weapon.accuracy,weapon.aoe,batType.size,stealth,cover)) {
            newDamage = calcDamage(power,batType.armor);
            if (newDamage > batType.hp) {
                newDamage = batType.hp;
            }
            if (newDamage < 0) {
                newDamage = 0;
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
