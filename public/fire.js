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
    checkTargetBatType();
    if (isMelee) {
        // en mêlée : choix limité de cibles
        if (sideBySideTiles(selectedBat.tileId,tileId)) {
            if (alienBatHere && checkFlyTarget(selectedWeap,targetBatType)) {
                // console.log(targetBat);
                tileTarget(targetBat);
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
            if (alienBatHere && checkFlyTarget(selectedWeap,targetBatType)) {
                // console.log(targetBat);
                tileTarget(targetBat);
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
    let soundWeap;
    if (activeTurn == 'player') {
        attAlive = true;
        defAlive = true;
    }
    // sort du mode furtif
    if (activeTurn == 'player') {
        camoOut();
    }
    centerMap();
    let selectedBatUnits = selectedBat.squadsLeft*selectedBatType.squadSize;
    let targetBatUnits = targetBat.squadsLeft*targetBatType.squadSize;
    $('#report').empty('');
    $('#report').append('<span class="report or">'+selectedBatUnits+' '+selectedBat.type+'</span> <span class="report">vs</span> <span class="report or">'+targetBatUnits+' '+targetBat.type+'</span><br>');
    let distance = calcDistance(selectedBat.tileId,targetBat.tileId);
    // console.log('distance '+distance);
    weaponSelectRiposte(distance);
    // console.log(targetWeap);
    $('#report').append('<span class="report">distance '+distance+'</span><br>');
    // ammo
    let baseAmmo = 99;
    let ammoLeft = 99;
    if (activeTurn == 'aliens') {
        baseAmmo = targetWeap.maxAmmo;
        ammoLeft = calcAmmos(targetBat,baseAmmo);
    }
    // riposte?
    let riposte = false;
    let initiative = true;
    let minimumFireAP;
    if (targetWeap.range >= distance && ammoLeft >= 1 && !targetWeap.noDef) {
        if (!targetWeap.noFly || !selectedBatType.skills.includes('fly')) {
            riposte = true;
            let aspeed = calcSpeed(selectedBat,selectedWeap,targetWeap,distance,true);
            let dspeed = calcSpeed(targetBat,targetWeap,selectedWeap,distance,false);
            // embuscade (initiative)
            if (activeTurn === 'player') {
                if (selectedBat.tags.includes('embuscade') && selectedBat.fuzz == -2) {
                    aspeed = -999;
                }
            }
            $('#report').append('<span class="report">initiative '+aspeed+' vs '+dspeed+'</span><br>');
            if (dspeed < aspeed) {
                initiative = false;
            }
        }
    }
    if (riposte) {
        console.log('riposte');
        if (initiative) {
            console.log('initiative');
            if (activeTurn == 'player') {blockMe(true);}
            if (!isFFW) {
                soundWeap = selectedWeap;
                shotSound(soundWeap);
            }
            attack();
            minimumFireAP = minFireAP;
            if (targetBatType.skills.includes('guerrilla')) {
                minimumFireAP = minFireAP-5;
            }
            if (defAlive && targetBat.apLeft > minimumFireAP) {
                defense();
                if (!isFFW) {
                    soundWeap = targetWeap;
                    setTimeout(function (){
                        shotSound(soundWeap);
                        if (activeTurn == 'player') {blockMe(false);}
                    }, 2500); // How long do you want the delay to be (in milliseconds)?
                }
            } else {
                if (!isFFW) {
                    setTimeout(function (){
                        if (activeTurn == 'player') {blockMe(false);}
                    }, 2000); // How long do you want the delay to be (in milliseconds)?
                }
            }
        } else {
            console.log("pas d'initiative");
            if (activeTurn == 'player') {blockMe(true);}
            if (!isFFW) {
                soundWeap = targetWeap;
                shotSound(soundWeap);
            }
            defense();
            minimumFireAP = minFireAP;
            if (selectedBatType.skills.includes('guerrilla')) {
                minimumFireAP = minFireAP-5;
            }
            if (attAlive && selectedBat.apLeft > minimumFireAP) {
                attack();
                if (!isFFW) {
                    soundWeap = selectedWeap;
                    setTimeout(function (){
                        shotSound(soundWeap);
                        if (activeTurn == 'player') {blockMe(false);}
                    }, 2500); // How long do you want the delay to be (in milliseconds)?
                }
            } else {
                if (!isFFW) {
                    setTimeout(function (){
                        if (activeTurn == 'player') {blockMe(false);}
                    }, 2000); // How long do you want the delay to be (in milliseconds)?
                }
            }
        }
    } else {
        console.log('pas de riposte');
        if (activeTurn == 'player') {blockMe(true);}
        if (!isFFW) {
            shotSound(selectedWeap);
        }
        attack();
        if (!isFFW) {
            setTimeout(function (){
                if (activeTurn == 'player') {blockMe(false);}
            }, 2000); // How long do you want the delay to be (in milliseconds)?
        }
    }
};

function attack() {
    console.log('Attaque ->');
    console.log(selectedWeap);
    $('#report').append('<span class="report or">'+selectedBat.type+' ('+selectedWeap.name+')</span><br>');
    // remove guet
    if (selectedBat.tags.includes('guet')) {
        tagIndex = selectedBat.tags.indexOf('guet');
        selectedBat.tags.splice(tagIndex,1);
    }
    // AOE Shots
    let aoeShots = 1;
    if (selectedWeap.aoe == "bat") {
        aoeShots = targetBatType.squadSize*targetBat.squadsLeft;
    } else if (selectedWeap.aoe == "squad") {
        aoeShots = targetBatType.squadSize;
    }
    // Feu dans l'eau
    if (selectedWeap.ammo == 'feu') {
        let terrain = getTerrain(targetBat);
        if (terrain.name === 'S' || terrain.name === 'W' || terrain.name === 'R') {
            aoeShots = 1;
        }
        console.log('fire in water: aoe '+aoeShots);
    }
    // rof*squadsLeft loop
    let shots = selectedWeap.rof*selectedBat.squadsLeft;
    // autodestruction or undead
    if (selectedWeap.ammo.includes('autodestruction') || selectedBatType.skills.includes('undead')) {
        shots = selectedWeap.rof*selectedBatType.squads;
    }
    // bugROF
    if (bugROF > 1 && selectedBatType.kind === 'bug') {
        shots = Math.round(shots*bugROF);
    }
    // berserk (bonus ROF)
    if (activeTurn === 'player') {
        if (selectedBatType.skills.includes('berserk') && selectedBat.damage >= 1) {
            shots = Math.floor(shots*berserkROF);
            console.log('bonus ROF berserk');
        }
    }
    // embuscade (bonus ROF)
    if (activeTurn === 'player') {
        if (selectedBat.tags.includes('embuscade') && selectedBat.fuzz == -2) {
            shots = Math.floor(shots*berserkROF);
            console.log('bonus ROF embuscade');
        }
    }
    // tir ciblé
    if (selectedBat.tags.includes('vise')) {
        shots = Math.round(shots*2/3);
    }
    let totalDamage = 0;
    let apDamage = 0;
    // brochette
    let skewer = false;
    if (selectedWeap.aoe == 'brochette') {
        skewer = true;
    }
    // lucky shot
    let shotDice = 100;
    if (selectedBat.tags.includes('luckyshot')) {
        shotDice = calcShotDice(selectedBat,true);
        tagDelete(selectedBat,'luckyshot');
    } else if (targetBat.tags.includes('stun')) {
        shotDice = 50;
    } else {
        shotDice = calcShotDice(selectedBat,false);
    }
    console.log('shotDice='+shotDice);
    toHit = 999;
    let i = 1;
    while (i <= shots) {
        if (aoeShots >= 2) {
            totalDamage = totalDamage+blast(aoeShots,selectedWeap,targetBat,targetBatType,shotDice);
        } else {
            totalDamage = totalDamage+shot(skewer,selectedWeap,targetBat,targetBatType,shotDice);
        }
        if (i > 300) {break;}
        i++
    }
    // lucky shot damage
    if (toHit > 35 && shotDice === 50) {
        totalDamage = Math.round(totalDamage*1.3);
        console.log('lucky shot on damage');
    }
    // add damage! remove squads? remove bat?
    if (selectedWeap.apdamage > 0) {
        let wapd = selectedWeap.apdamage;
        if (selectedWeap.ammo.includes('electric') && targetBatType.cat == 'vehicles') {
            wapd = wapd*2.5*25/targetBatType.size;
        }
        if (selectedWeap.ammo.includes('electric') && targetBatType.cat == 'buildings') {
            wapd = wapd*20/targetBatType.size;
        }
        apDamage = apDamage+Math.round(totalDamage*wapd);
        console.log('AP Damage : '+apDamage);
    }
    // inflammable
    if (selectedWeap.ammo.includes('feu') || selectedWeap.ammo.includes('incendiaire') || selectedWeap.ammo.includes('napalm')) {
        if (targetBatType.skills.includes('inflammable')) {
            totalDamage = totalDamage*2;
            console.log('inflammable!');
        }
    }
    // munitions limitées
    console.log('maxAmmo'+selectedWeap.maxAmmo);
    ammoFired(selectedBat.id);
    if (selectedWeap.maxAmmo < 99) {
        selectedBat.tags.push('ammoUsed');
    }
    if (selectedWeap.noBis) {
        selectedBat.tags.push('noBis');
    }
    console.log('Previous Damage : '+targetBat.damage);
    console.log('Damage : '+totalDamage);
    $('#report').append('<span class="report">('+totalDamage+')<br></span>');
    // POST DAMAGE EFFECTS ----------------------------------------------------------------------------------------------------------
    // agrippeur
    if (selectedBatType.skills.includes('grip') && totalDamage >= 1 && selectedBatType.size > targetBatType.size) {
        let gripbonus = 0;
        if (selectedBatType.name == 'Androks') {
            gripbonus = 30;
        }
        let gripChance = (selectedBat.squadsLeft*5)+gripbonus-(targetBat.vet*3);
        if (rand.rand(1,100 <= gripChance)) {
            if (selectedBatType.skills.includes('tail')) {
                totalDamage = totalDamage+targetBatType.hp;
            }
            if (targetBatType.weapon.isMelee || targetBatType.weapon2.isMelee) {
                apDamage = apDamage+Math.round(selectedBat.squadsLeft*3/4);
            } else {
                apDamage = apDamage+selectedBat.squadsLeft*3;
            }
            console.log('Grip OK');
            $('#report').append('<span class="report">Agrippé<br></span>');
        } else {
            console.log('Grip raté');
        }
    }
    // creuseur
    let catOK = false;
    if (targetBatType.cat == 'buildings' || targetBatType.cat == 'vehicles') {
        catOK = true;
    }
    let trouOK = false;
    if (selectedWeap.ammo.includes('troueur') && totalDamage >= 1) {
        trouOK = true;
    }
    if (selectedWeap.ammo.includes('acide') && totalDamage >= 5) {
        trouOK = true;
    }
    if (trouOK && catOK) {
        if (!targetBat.tags.includes('trou')) {
            targetBat.tags.push('trou');
        }
        console.log('Trou percé!');
        $('#report').append('<span class="report cy">Blindage troué<br></span>');
    }
    // venin
    if (selectedBatType.skills.includes('venin') && totalDamage >= 1 && targetBat.apLeft < -2 && targetBatType.cat == 'infantry') {
        if (!targetBat.tags.includes('venin')) {
            targetBat.tags.push('venin');
        }
        console.log('Venin!');
        $('#report').append('<span class="report cy">Venin<br></span>');
    }
    // poison
    if (totalDamage >= 5 || (totalDamage >= 1 && rand.rand(1,2) === 1)) {
        if (selectedWeap.ammo.includes('poison') || selectedWeap.ammo.includes('ppoison')) {
            if (targetBatType.cat == 'infantry' || targetBatType.cat == 'aliens') {
                targetBat.tags.push('poison');
                console.log('Poison!');
                $('#report').append('<span class="report cy">Poison<br></span>');
            }
        }
    }
    // parasite
    if (totalDamage >= 1 && selectedWeap.ammo.includes('parasite')) {
        if (targetBatType.cat == 'infantry' || targetBatType.cat == 'aliens') {
            targetBat.tags.push('parasite');
            console.log('Parasite!');
            $('#report').append('<span class="report cy">Parasite<br></span>');
        }
    }
    // maladie
    if (totalDamage >= 1) {
        let infected = false;
        if (selectedBatType.skills.includes('maladie') && rand.rand(1,2) === 1) {
            infected = true;
        }
        if (selectedBatType.skills.includes('chancre')) {
            infected = true;
        }
        if (infected) {
            if (targetBatType.cat == 'infantry' || targetBatType.cat == 'aliens') {
                targetBat.tags.push('maladie');
                console.log('Maladie!');
                $('#report').append('<span class="report cy">Maladie<br></span>');
            }
        }
    }
    // ---------------------------------------------------------------------------------------------------------------------------
    if (apDamage >= 1) {
        $('#report').append('<span class="report">Points d\'actions: -'+apDamage+'<br></span>');
    }
    targetBat.apLeft = targetBat.apLeft-apDamage;
    totalDamage = totalDamage+targetBat.damage;
    let squadHP = (targetBatType.squadSize*targetBatType.hp);
    console.log('Squad HP : '+squadHP);
    let squadsOut = Math.floor(totalDamage/squadHP);
    targetBat.squadsLeft = targetBat.squadsLeft-squadsOut;
    // survivor
    if (targetBat.squadsLeft <= 0 && !targetBat.tags.includes('lucky') && targetBatType.skills.includes('survivor')) {
        targetBat.squadsLeft = 1;
        targetBat.tags.push('lucky');
    }
    console.log('Squads Out : '+squadsOut);
    if (squadsOut >= 1) {
        let deadUnits = targetBatType.squadSize*squadsOut;
        let unitsLeft = targetBatType.squadSize*targetBat.squadsLeft;
        $('#report').append('<span class="report cy">Unités: -'+deadUnits+'</span>');
        if (targetBat.squadsLeft >= 1) {
            $('#report').append('<span class="report"> (reste '+unitsLeft+' '+targetBat.type+')<br></span>');
        }
    }
    targetBat.damage = totalDamage-(squadsOut*squadHP);
    console.log('Damage Left : '+targetBat.damage);
    targetBatArrayUpdate();
    if (targetBat.squadsLeft <= 0) {
        defAlive = false;
        batDeath(targetBat);
        $('#report').append('<br><span class="report cy">Bataillon ('+targetBat.type+') détruit<br></span>');
        if (!isFFW) {
            setTimeout(function (){
                batDeathEffect(targetBat,false,'','');
            }, 3000); // How long do you want the delay to be (in milliseconds)?
        } else {
            batDeathEffect(targetBat,false,'','');
        }
    } else {
        // targetBatArrayUpdate();
        if (targetBat.team == 'player') {
            showBataillon(targetBat);
        } else {
            showAlien(targetBat);
        }
    }
    // remove ap & salvo & life :)
    if (selectedWeap.ammo.includes('suicide') || selectedWeap.ammo.includes('autodestruction')) {
        attAlive = false;
        batDeath(selectedBat);
        $('#report').append('<br><span class="report cy">Bataillon ('+selectedBat.type+') détruit<br></span>');
        if (!isFFW) {
            setTimeout(function (){
                batDeathEffect(selectedBat,false,'Bataillon détruit','Suicide');
                $('#unitInfos').empty();
            }, 3000); // How long do you want the delay to be (in milliseconds)?
        } else {
            batDeathEffect(selectedBat,false,'Bataillon détruit','Suicide');
        }
        $('#unitInfos').empty();
    } else {
        selectedBat.apLeft = selectedBat.apLeft-selectedWeap.cost;
        selectedBat.salvoLeft = selectedBat.salvoLeft-1;
        if (squadsOut >= 1 && activeTurn == 'player') {
            selectedBat.xp = selectedBat.xp+1;
        }
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
    // Feu dans l'eau
    if (targetWeap.ammo == 'feu') {
        let terrain = getTerrain(selectedBat);
        if (terrain.name === 'S' || terrain.name === 'W' || terrain.name === 'R') {
            aoeShots = 1;
        }
        console.log('fire in water: aoe '+aoeShots);
    }
    // rof*squadsLeft loop
    // BRIDAGE DEFENSE
    let brideDef = 0.75;
    if (selectedWeap.range === 0) {
        brideDef = 1/Math.sqrt(targetWeap.cost-0.75);
        if (brideDef > 1 || targetWeap.range === 0) {
            brideDef = 1;
        }
    } else {
        if (targetWeap.range === 0) {
            brideDef = 0.5;
        } else {
            brideDef = 0.75;
        }
    }
    // Guet
    if (targetBat.tags.includes('guet') || targetBatType.skills.includes('sentinelle')) {
        brideDef = 1;
    }
    console.log('brideDef='+brideDef);
    let shots = Math.round(targetWeap.rof*targetBat.squadsLeft*brideDef);
    if (targetBatType.skills.includes('undead')) {
        shots = Math.round(targetWeap.rof*targetBatType.squads*brideDef);
    }
    // bugROF
    if (bugROF > 1 && targetBatType.kind === 'bug') {
        shots = Math.round(shots*bugROF);
    }
    // console.log(shots);
    // console.log(aoeShots);
    let totalDamage = 0;
    let apDamage = 0;
    // brochette
    let skewer = false;
    if (targetWeap.aeo == 'brochette') {
        skewer = true;
    }
    let shotDice = calcShotDice(targetBat,false);
    toHit = 999;
    let i = 1;
    while (i <= shots) {
        if (aoeShots >= 2) {
            totalDamage = totalDamage+blast(aoeShots,targetWeap,selectedBat,selectedBatType,shotDice);
        } else {
            totalDamage = totalDamage+shot(skewer,targetWeap,selectedBat,selectedBatType,shotDice);
        }
        if (i > 300) {break;}
        i++
    }
    // berserk (bonus damage des opposants)
    if (activeTurn === 'player') {
        if (selectedBatType.skills.includes('berserk') && selectedBat.damage >= 1) {
            totalDamage = Math.floor(totalDamage*berserkEnemyDamage);
            console.log('bonus prec berserk');
        }
    }
    // inflammable
    if (targetWeap.ammo.includes('feu') || targetWeap.ammo.includes('incendiaire') || targetWeap.ammo.includes('napalm')) {
        if (selectedBatType.skills.includes('inflammable')) {
            totalDamage = totalDamage*2;
            console.log('inflammable!');
        }
    }
    // add damage! remove squads? remove bat?
    if (targetWeap.apdamage > 0) {
        let wapd = targetWeap.apdamage;
        if (targetWeap.ammo.includes('electric') && selectedBatType.cat == 'vehicles') {
            wapd = wapd*2.5*25/selectedBatType.size;
        }
        if (targetWeap.ammo.includes('electric') && selectedBatType.cat == 'buildings') {
            wapd = wapd*20/selectedBatType.size;
        }
        apDamage = apDamage+Math.round(totalDamage*wapd);
        console.log('AP Damage : '+apDamage);
    }
    // munitions limitées
    console.log('maxAmmo'+targetWeap.maxAmmo);
    ammoFired(targetBat.id);
    if (targetWeap.maxAmmo < 99) {
        targetBat.tags.push('ammoUsed');
    }
    console.log('Damage : '+totalDamage);
    $('#report').append('<span class="report">('+totalDamage+')<br></span>');
    // POST DAMAGE EFFECTS ----------------------------------------------------------------------------------------------------------
    // poison
    if (totalDamage >= 5 || (totalDamage >= 1 && rand.rand(1,2) === 1)) {
        if (targetWeap.ammo.includes('poison') || targetWeap.ammo.includes('ppoison')) {
            if (selectedBatType.cat == 'infantry' || selectedBatType.cat == 'aliens') {
                selectedBat.tags.push('poison');
                console.log('Poison!');
                $('#report').append('<span class="report cy">Poison<br></span>');
            }
        }
    }
    // parasite
    if (totalDamage >= 1 && targetWeap.ammo.includes('parasite')) {
        if (selectedBatType.cat == 'infantry' || selectedBatType.cat == 'aliens') {
            selectedBat.tags.push('parasite');
            console.log('Parasite!');
            $('#report').append('<span class="report cy">Parasite<br></span>');
        }
    }
    // maladie
    if (totalDamage >= 1 && rand.rand(1,2) === 1) {
        let infected = false;
        if (targetBatType.skills.includes('maladie') && rand.rand(1,2) === 1) {
            infected = true;
        }
        if (targetBatType.skills.includes('chancre')) {
            infected = true;
        }
        if (infected) {
            if (selectedBatType.cat == 'infantry' || selectedBatType.cat == 'aliens') {
                selectedBat.tags.push('maladie');
                console.log('Maladie!');
                $('#report').append('<span class="report cy">Maladie<br></span>');
            }
        }
    }
    // ---------------------------------------------------------------------------------------------------------------------------
    if (apDamage >= 1) {
        $('#report').append('<span class="report">Points d\'actions: -'+apDamage+'<br></span>');
    }
    selectedBat.apLeft = selectedBat.apLeft-apDamage;
    console.log('Previous Damage : '+selectedBat.damage);
    totalDamage = totalDamage+selectedBat.damage;
    let squadHP = (selectedBatType.squadSize*selectedBatType.hp);
    console.log('Squad HP : '+squadHP);
    let squadsOut = Math.floor(totalDamage/squadHP);
    selectedBat.squadsLeft = selectedBat.squadsLeft-squadsOut;
    // survivor
    if (selectedBat.squadsLeft <= 0 && !selectedBat.tags.includes('lucky') && selectedBatType.skills.includes('survivor')) {
        selectedBat.squadsLeft = 1;
        selectedBat.tags.push('lucky');
    }
    console.log('Squads Out : '+squadsOut);
    if (squadsOut >= 1) {
        let deadUnits = selectedBatType.squadSize*squadsOut;
        let unitsLeft = selectedBatType.squadSize*selectedBat.squadsLeft;
        $('#report').append('<span class="report cy">Unités: -'+deadUnits+'</span>');
        if (selectedBat.squadsLeft >= 1) {
            $('#report').append('<span class="report"> (reste '+unitsLeft+' '+selectedBat.type+')<br></span>');
        }
    }
    selectedBat.damage = totalDamage-(squadsOut*squadHP);
    console.log('Damage Left : '+selectedBat.damage);
    selectedBatArrayUpdate();
    if (selectedBat.squadsLeft <= 0) {
        attAlive = false;
        batDeath(selectedBat);
        $('#report').append('<br><span class="report cy">Bataillon ('+selectedBat.type+') détruit<br></span>');
        if (!isFFW) {
            setTimeout(function (){
                batDeathEffect(selectedBat,false,'','');
            }, 3000); // How long do you want the delay to be (in milliseconds)?
        } else {
            batDeathEffect(selectedBat,false,'','');
        }
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

function shot(skewer,weapon,bat,batType,shotDice) {
    // returns damage
    let damage = 0;
    let cover = getCover(bat,true);
    let stealth = getStealth(bat);
    let batSpeed = batType.speed;
    // skupiac drug
    if (bat.tags.includes('skupiac')) {
        batSpeed = batSpeed+3;
    }
    if (isHit(weapon.accuracy,weapon.aoe,batType.size,stealth,cover,batSpeed,shotDice)) {
        damage = calcDamage(weapon,weapon.power,batType.armor,bat);
        if (damage > batType.hp && !skewer) {
            damage = batType.hp;
        } else if (damage > batType.hp*3 && skewer) {
            damage = batType.hp*3;
        }
        if (damage < 0) {
            damage = 0;
        }
        $('#report').append('<span class="report">'+damage+' </span>');
    }
    return damage;
};

function blast(aoeShots,weapon,bat,batType,shotDice) {
    // returns damage
    // console.log('aoeShots = '+aoeShots);
    let damage = 0;
    let newDamage = 0;
    let power = weapon.power;
    let oldPower = weapon.power;
    let cover = getCover(bat,true);
    let stealth = getStealth(bat);
    let batSpeed = batType.speed;
    // skupiac drug
    if (bat.tags.includes('skupiac')) {
        batSpeed = batSpeed+3;
    }
    let ii = 1;
    while (ii <= aoeShots) {
        // console.log('power'+power);
        if (isHit(weapon.accuracy,weapon.aoe,batType.size,stealth,cover,batSpeed,shotDice)) {
            newDamage = calcDamage(weapon,power,batType.armor,bat);
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
        power = Math.round(power*0.8);
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
        batIndex = batList.findIndex((obj => obj.id == bat.id));
        batList.splice(batIndex,1);
    } else if (bat.team == 'aliens') {
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
            deathSound();
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
