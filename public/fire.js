function clickFire(tileId) {
    let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
    showTileInfos(tileId);
    let alienBatHere = false;
    let guidageOK = false;
    aliens.forEach(function(alien) {
        if (alien.tileId === tileId && alien.loc === "zone") {
            alienBatHere = true;
            targetBat = JSON.parse(JSON.stringify(alien));
        }
    });
    checkTargetBatType();
    if (selectedBat.tileId === tileId) {
        // re-click sur l'unité active : unselect
        selectMode();
        batUnstack();
        batUnselect();
        $(".targ").remove();
    } else {
        if (isMelee) {
            // en mêlée : choix limité de cibles
            if (sideBySideTiles(selectedBat.tileId,tileId,true)) {
                if (alienBatHere && checkFlyTarget(selectedWeap,targetBatType)) {
                    // console.log(targetBat);
                    tagDelete(targetBat,'invisible');
                    tileTarget(targetBat);
                    combat(true);
                    selectMode();
                    showBatInfos(selectedBat);
                    $(".targ").remove();
                } else {
                    targetBat = {};
                    targetBatType = {};
                    targetWeap = {};
                }
            } else {
                targetBat = {};
                targetBatType = {};
                targetWeap = {};
            }
        } else {
            // hors mêlée
            guidageOK = false;
            if (Object.keys(targetBat).length >= 1) {
                guidageOK = checkGuidage(selectedWeap,targetBat);
            }
            if (isInRange(selectedBat,tileId,selectedWeap) || guidageOK) {
                if (alienBatHere && checkFlyTarget(selectedWeap,targetBatType) && ((!targetBatType.skills.includes('invisible') && !targetBat.tags.includes('invisible')) || sideBySideTiles(selectedBat.tileId,tileId,false))) {
                    // console.log(targetBat);
                    tagDelete(targetBat,'invisible');
                    tileTarget(targetBat);
                    combat(false);
                    selectMode();
                    showBatInfos(selectedBat);
                    $(".targ").remove();
                } else {
                    targetBat = {};
                    targetBatType = {};
                    targetWeap = {};
                }
            } else {
                targetBat = {};
                targetBatType = {};
                targetWeap = {};
            }
        }
    }
};

function combat(melee) {
    console.log('START COMBAT');
    tagDelete(selectedBat,'mining');
    tagDelete(targetBat,'mining');
    minesExploded = 0;
    soundDuration = 2000;
    let soundWeap;
    let soundBat;
    if (activeTurn == 'player') {
        attAlive = true;
        defAlive = true;
    }
    // sort du mode furtif
    if (activeTurn == 'player') {
        camoOut();
        tagAction();
        centerMapTarget();
    } else {
        centerMap();
    }
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
    let negSalvo = -4;
    if (targetBatType.skills.includes('guerrilla') || targetBatType.skills.includes('baddef')) {
        negSalvo = -3;
    }
    if (targetBatType.skills.includes('gooddef')) {
        negSalvo = -6;
    }
    if (distance <= 3 && targetWeap.range >= distance && ammoLeft >= 1 && !targetWeap.noDef && targetBat.salvoLeft > negSalvo) {
        if ((!targetWeap.noFly || !selectedBatType.skills.includes('fly')) && (!targetWeap.noGround || selectedBatType.skills.includes('fly') || selectedBatType.skills.includes('sauteur'))) {
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
                soundBat = selectedBat;
                shotSound(soundWeap,soundBat);
            }
            attack(melee);
            minimumFireAP = minFireAP;
            if (targetBatType.skills.includes('guerrilla')) {
                minimumFireAP = minFireAP-7;
            }
            if (targetBatType.cat === 'buildings' || targetBatType.skills.includes('after')) {
                minimumFireAP = -999;
            }
            if ((defAlive && targetBat.apLeft > minimumFireAP) || targetWeap.ammo === 'mine' || targetWeap.ammo === 'trap') {
                defense(melee);
                if (!isFFW) {
                    soundWeap = targetWeap;
                    soundBat = targetBat;
                    setTimeout(function (){
                        setTimeout(function (){
                            shotSound(soundWeap,soundBat);
                            if (activeTurn == 'player') {blockMe(false);}
                        }, soundDuration);
                    }, 500);
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
            minimumFireAP = minFireAP;
            if (targetBatType.skills.includes('guerrilla')) {
                minimumFireAP = minFireAP-7;
            }
            if (targetBatType.cat === 'buildings' || targetBatType.skills.includes('after')) {
                minimumFireAP = -999;
            }
            if (targetBat.apLeft > minimumFireAP) {
                defense(melee);
                if (!isFFW) {
                    soundWeap = targetWeap;
                    soundBat = targetBat;
                    shotSound(soundWeap,soundBat);
                }
            }
            if (attAlive) {
                minimumFireAP = minFireAP;
                if (selectedBatType.skills.includes('guerrilla')) {
                    minimumFireAP = minFireAP-7;
                }
                if (selectedBatType.cat === 'buildings' || selectedBatType.skills.includes('after')) {
                    minimumFireAP = -999;
                }
                if (selectedBat.apLeft > minimumFireAP) {
                    attack(melee);
                    if (!isFFW) {
                        soundWeap = selectedWeap;
                        soundBat = selectedBat;
                        setTimeout(function (){
                            setTimeout(function (){
                                shotSound(soundWeap,soundBat);
                                if (activeTurn == 'player') {blockMe(false);}
                            }, soundDuration);
                        }, 500);
                    }
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
            shotSound(selectedWeap,selectedBat);
        }
        attack(melee);
        if (!isFFW) {
            setTimeout(function (){
                if (activeTurn == 'player') {blockMe(false);}
            }, 2000); // How long do you want the delay to be (in milliseconds)?
        }
    }
};

function attack(melee) {
    console.log('Attaque ->');
    console.log(selectedWeap);
    minesExploded = 0;
    let xpFactor = Math.round(12/selectedBatType.maxSalvo/10);
    xpFactor = xpFactor.toFixedNumber(2);
    if (selectedBatType.maxSalvo >= 5) {
        xpFactor = 0.2;
    }
    $('#report').append('<span class="report or">'+selectedBat.type+' ('+selectedWeap.name+')</span><br>');
    // Dans l'eau
    let terrain = getTerrain(targetBat);
    let tile = getTile(targetBat);
    if (terrain.name === 'W' || terrain.name === 'R' || terrain.name === 'S') {
        if (selectedWeap.ammo.includes('feu') || selectedWeap.ammo.includes('incendiaire') || selectedWeap.ammo.includes('napalm') || selectedWeap.ammo.includes('fire') || selectedWeap.ammo.includes('lf-') || selectedWeap.ammo.includes('lt-') || selectedWeap.ammo.includes('molotov')) {
            selectedWeap.power = Math.round(selectedWeap.power*0.75);
            if (!targetBatType.skills.includes('fly')) {
                if (terrain.name === 'W' || terrain.name === 'R') {
                    selectedWeap.aoe = 'unit';
                }
            }
        }
        if (!targetBatType.skills.includes('fly') && (!targetBatType.skills.includes('hover') || targetBatType.cat === 'aliens')) {
            if (selectedWeap.ammo.includes('taser') || selectedWeap.ammo.includes('electric')) {
                if ((terrain.name === 'W' || terrain.name === 'R') && !tile.rd) {
                    selectedWeap.power = Math.round(selectedWeap.power+7);
                    if (selectedWeap.aoe == 'unit') {
                        selectedWeap.aoe = 'brochette';
                    } else if (selectedWeap.aoe == 'brochette') {
                        selectedWeap.aoe = 'squad';
                    } else {
                        selectedWeap.aoe = 'bat';
                    }
                } else if (terrain.name === 'S' && !tile.rd && targetBatType.cat === 'aliens') {
                    targetWeap.power = Math.round(selectedWeap.power+4);
                }
            }
        }
    }
    // AOE Shots
    let aoeShots = 1;
    if (selectedWeap.aoe == "bat") {
        if (targetBatType.squads === 6 && targetBatType.squadSize === 1 && !selectedWeap.ammo.includes('gaz')) {
            aoeShots = 12;
        } else {
            aoeShots = targetBatType.squadSize*targetBat.squadsLeft;
        }
        if (aoeShots < 9) {
            aoeShots = 9;
        }
    } else if (selectedWeap.aoe != "unit") {
        if (targetBatType.squads === 6 && targetBatType.squadSize === 1) {
            aoeShots = 6;
        } else {
            aoeShots = targetBatType.squadSize;
        }
        if (selectedWeap.aoe == "squad") {
            if (aoeShots < 4) {
                aoeShots = 4;
            }
        } else if (selectedWeap.aoe == "brochette") {
            if (aoeShots < 2) {
                aoeShots = 2;
            }
        }
    }
    // rof*squadsLeft loop
    let shots = selectedWeap.rof*selectedBat.squadsLeft;
    // autodestruction or undead
    if (selectedWeap.ammo.includes('autodestruction') || selectedBatType.skills.includes('undead')) {
        shots = selectedWeap.rof*selectedBatType.squads;
    }
    // SCIES (noGrip)
    if (targetWeap.noGrip && selectedWeap.range === 0 && selectedBatType.size*5 >= targetBatType.size) {
        shots = Math.round(shots/1.5);
    }
    // bugROF
    if (bugROF > 1 && selectedBatType.kind === 'bug') {
        shots = Math.round(shots*bugROF);
    }
    // spiderRG
    if (spiderRG && selectedBatType.kind === 'spider') {
        shots = Math.round(shots*1.25);
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
            shots = Math.floor(shots*2);
            console.log('bonus ROF embuscade');
        }
    }
    // ESCAPE
    escaped = false;
    if (targetBatType.skills.includes('escape')) {
        let escapeChance = Math.round((targetBatType.speed-2)*selectedWeap.cost*escapeValue);
        console.log('escapeChance:'+escapeChance);
        if (rand.rand(1,100) <= escapeChance) {
            escaped = true;
            let escapeVar = rand.rand(4,8);
            console.log('escapeVar:'+escapeVar);
            shots = Math.round(shots*escapeVar/(selectedWeap.cost+4)/2);
        }
    }
    // SHIELD
    let hasShield = 0;
    if (targetBatType.skills.includes('shield')) {
        hasShield = 2;
    } else {
        if (targetBatType.kind === 'bug' && bugSHIELD) {
            hasShield = 4;
        }
        if (targetBatType.kind === 'egg' && eggSHIELD) {
            hasShield = 4;
        }
    }
    if (activeTurn === 'player' && hasShield >= 1 && selectedWeap.isMelee === false && selectedWeap.noShield === false) {
        if (rand.rand(1,3) >= 2 && !targetBat.tags.includes('shield')) {
            targetBat.tags.push('shield');
        }
        if (targetBat.tags.includes('shield')) {
            let shieldValue = rand.rand(5,15);
            shots = Math.ceil(shots/shieldValue*hasShield/2);
        }
    }
    // tir ciblé
    if (selectedBat.tags.includes('vise')) {
        shots = Math.round(shots*2/3);
    }
    let totalDamage = 0;
    let apDamage = 0;
    let shotResult = {damage:0,hits:0};
    let totalHits = 0;
    // brochette
    let brochette = false;
    if (selectedWeap.aoe == 'brochette') {
        brochette = true;
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
    if (playerInfos.pseudo === 'Test') {
        shotDice = 100;
    }
    console.log('shotDice='+shotDice);
    // noBig
    if (targetBatType.size > Math.round(selectedBatType.size/2) && selectedWeap.noBig) {
        selectedWeap.power = Math.round(selectedWeap.power*selectedBatType.size/2/targetBatType.size);
    } else if (Math.round(selectedBatType.size/3) > targetBatType.size && selectedWeap.noBig) {
        selectedWeap.power = Math.round(selectedWeap.power*selectedBatType.size/3/targetBatType.size);
    }
    // isShort range 0
    if (selectedWeap.isShort && selectedWeap.range >= 1 && melee) {
        selectedWeap.accuracy = selectedWeap.accuracy+5;
    }
    toHit = 999;
    let i = 1;
    while (i <= shots) {
        if (aoeShots >= 2) {
            shotResult = blast(brochette,selectedBatType,aoeShots,selectedWeap,targetBat,targetBatType,shotDice);
        } else {
            shotResult = shot(selectedWeap,selectedBatType,targetBat,targetBatType,shotDice);
        }
        totalDamage = totalDamage+shotResult.damage;
        totalHits = totalHits+shotResult.hits;
        if (i > 300) {break;}
        i++
    }
    // lucky shot damage
    if (toHit > 35 && shotDice === 50) {
        totalDamage = Math.round(totalDamage*1.3);
        console.log('lucky shot on damage');
    }
    // AP DAMAGE!
    if (selectedWeap.apdamage > 0) {
        let wapd = selectedWeap.apdamage;
        if (selectedWeap.ammo.includes('electric')) {
            if (targetBatType.cat == 'vehicles') {
                if (targetBatType.skills.includes('fly')) {
                    wapd = wapd*4*20/targetBatType.size;
                } else {
                    wapd = wapd*2.25*20/targetBatType.size;
                }
            } else if (targetBatType.cat == 'buildings' || targetBatType.cat == 'devices') {
                wapd = wapd*20/targetBatType.size;
            } else if (targetBatType.skills.includes('cyber')) {
                wapd = wapd*2*20/targetBatType.size;
            }
        } else {
            wapd = wapd*1.75/Math.sqrt(targetBatType.size);
        }
        apDamage = apDamage+Math.round(totalDamage*wapd);
        console.log('AP Damage : '+apDamage);
    }
    // web
    if (selectedWeap.ammo.includes('web') || selectedWeap.ammo.includes('trap')) {
        let webDamage = totalHits;
        webDamage = Math.ceil(webDamage*18/Math.sqrt(targetBatType.hp)/(targetBatType.size+7));
        if (targetBatType.cat != 'aliens') {
            webDamage = Math.ceil(webDamage/(playerInfos.caLevel+4)*6);
        }
        apDamage = apDamage+webDamage;
    }
    // marquage
    if (selectedWeap.ammo.includes('marquage') && totalHits >= 1 && !targetBat.tags.includes('fluo')) {
        targetBat.tags.push('fluo');
    }
    // guidage
    if (selectedWeap.ammo.includes('guidage') && totalHits >= 1 && !targetBat.tags.includes('guide')) {
        targetBat.tags.push('guide');
    }
    // disco
    if (selectedWeap.ammo.includes('disco')) {
        let webDamage = totalHits;
        webDamage = Math.ceil(webDamage*18/Math.sqrt(targetBatType.hp)/10);
        apDamage = apDamage+webDamage;
    }
    // inflammable
    if (selectedWeap.ammo.includes('feu') || selectedWeap.ammo.includes('incendiaire') || selectedWeap.ammo.includes('napalm') || selectedWeap.ammo.includes('fire') || selectedWeap.ammo.includes('pyratol') || selectedWeap.ammo.includes('lf-') || selectedWeap.ammo.includes('lt-') || selectedWeap.ammo.includes('molotov')) {
        if (targetBatType.skills.includes('inflammable')) {
            totalDamage = totalDamage*2;
            console.log('inflammable!');
        }
    }
    // résistance au feu
    if (selectedWeap.ammo.includes('feu') || selectedWeap.ammo.includes('incendiaire') || selectedWeap.ammo.includes('napalm') || selectedWeap.ammo.includes('fire') || selectedWeap.ammo.includes('pyratol') || selectedWeap.ammo.includes('lf-') || selectedWeap.ammo.includes('lt-') || selectedWeap.ammo.includes('molotov')) {
        if (targetBatType.skills.includes('resistfeu') || targetBat.tags.includes('resistfeu')) {
            totalDamage = Math.round(totalDamage/2);
            console.log('résistance au feu!');
        }
    }
    // résistance blast
    if (targetBatType.skills.includes('resistblast') || targetBat.tags.includes('resistblast')) {
        if (selectedWeap.ammo.includes('bfg') || selectedWeap.ammo.includes('nanite') || selectedWeap.ammo.includes('suicide') || selectedWeap.ammo.includes('mine') || selectedWeap.ammo.includes('autodestruction') || selectedWeap.ammo.includes('dynamite') || selectedWeap.ammo.includes('bombe') || selectedWeap.ammo.includes('explosif') || selectedWeap.ammo.includes('obus') || selectedWeap.ammo.includes('missile') || selectedWeap.ammo.includes('grenade') || selectedWeap.ammo.includes('disco')) {
            if (!selectedWeap.ammo.includes('gaz') && !selectedWeap.ammo.includes('incendiaire') && !selectedWeap.ammo.includes('napalm')) {
                totalDamage = Math.round(totalDamage/2);
                console.log('résistance au blast!');
            }
        }
    }
    // résistance poison (gaz)
    if (targetBatType.skills.includes('resistpoison') || targetBat.tags.includes('resistpoison')) {
        if (selectedWeap.ammo.includes('gaz')) {
            totalDamage = Math.round(totalDamage/2);
            console.log('résistance au gaz!');
        }
    }
    // résistance acide
    if (selectedWeap.name.includes('acide') || selectedWeap.ammo.includes('ruche')) {
        if (targetBatType.skills.includes('resistacide') || targetBat.tags.includes('resistacide')) {
            totalDamage = Math.round(totalDamage/2);
            console.log('résistance acide!');
        }
    }
    // munitions limitées
    console.log('maxAmmo'+selectedWeap.maxAmmo);
    ammoFired(selectedBat.id);
    if (selectedWeap.maxAmmo < 99) {
        selectedBat.tags.push('ammoUsed');
    }
    if (selectedWeap.noBis) {
        selectedBat.tags.push('noBis'+selectedWeap.num);
    }
    console.log('Previous Damage : '+targetBat.damage);
    console.log('Damage : '+totalDamage);
    $('#report').append('<span class="report">('+totalDamage+')<br></span>');
    // POST DAMAGE EFFECTS ----------------------------------------------------------------------------------------------------------
    // agrippeur
    if (selectedBatType.skills.includes('grip') && totalDamage >= 1 && (selectedBatType.size+3 >= targetBatType.size || selectedBatType.name == 'Androks')) {
        let gripbonus = 0;
        if (selectedBatType.name == 'Androks' || selectedBatType.name == 'Homards') {
            gripbonus = 40;
        }
        if (selectedBatType.name == 'Bourdons') {
            gripbonus = -20;
        }
        let gripChance = (selectedBat.squadsLeft*5)+gripbonus-(targetBat.vet*3);
        if (targetBatType.cat != 'aliens') {
            gripChance = Math.ceil(gripChance/(playerInfos.caLevel+5)*7);
        }
        if (rand.rand(1,100 <= gripChance)) {
            if (selectedBatType.skills.includes('tail')) {
                let tailDamage = 75-(targetBat.armor*3);
                if (tailDamage > targetBatType.hp) {
                    tailDamage = targetBatType.hp;
                }
                totalDamage = totalDamage+(tailDamage*selectedBat.squadsLeft*selectedBatType.squads);
            }
            let gripDiv = 1.25;
            if (targetBatType.weapon.isShort || targetBatType.weapon2.isShort) {
                gripDiv = gripDiv+0.5;
            }
            if (targetBatType.weapon.isMelee || targetBatType.weapon2.isMelee) {
                gripDiv = gripDiv+0.5;
            }
            if (targetBatType.weapon.noGrip || targetBatType.weapon2.noGrip) {
                gripDiv = gripDiv+1;
            }
            if (targetWeap.isShort) {
                gripDiv = gripDiv+0.75;
            }
            if (targetWeap.isMelee) {
                gripDiv = gripDiv+1;
            }
            if (targetWeap.noGrip) {
                gripDiv = gripDiv+3;
            }
            apDamage = apDamage+Math.round((selectedBat.squadsLeft+rand.rand(0,10)-5)*3/gripDiv);
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
    if (selectedWeap.ammo.includes('troueur') && totalDamage >= 3) {
        trouOK = true;
    }
    if (selectedWeap.ammo.includes('acide') && totalDamage >= 75) {
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
    if (selectedBatType.skills.includes('venin') && totalDamage >= 1 && targetBat.apLeft < -2 && targetBatType.cat == 'infantry' && !targetBatType.skills.includes('resistpoison')) {
        if (!targetBat.tags.includes('venin')) {
            targetBat.tags.push('venin');
        }
        console.log('Venin!');
        $('#report').append('<span class="report cy">Venin<br></span>');
    }
    // poison
    if (totalDamage >= 7 || (totalDamage >= 1 && rand.rand(1,3) === 1)) {
        if (selectedWeap.ammo.includes('poison') || selectedWeap.ammo.includes('atium') || selectedWeap.ammo.includes('trap')) {
            if (!targetBatType.skills.includes('resistpoison')) {
                if ((targetBatType.cat == 'infantry' && (!targetBatType.skills.includes('mutant') || playerInfos.caLevel < 3)) || targetBatType.cat == 'aliens') {
                    targetBat.tags.push('poison');
                    if (selectedWeap.ammo.includes('atium')) {
                        targetBat.tags.push('poison');
                        targetBat.tags.push('poison');
                    }
                    if (selectedWeap.ammo.includes('trap')) {
                        targetBat.tags.push('poison');
                    }
                    if (selectedWeap.ammo.includes('trap-suicide')) {
                        targetBat.tags.push('poison');
                        targetBat.tags.push('poison');
                        targetBat.tags.push('poison');
                        targetBat.tags.push('poison');
                    }
                    console.log('Poison!');
                    $('#report').append('<span class="report cy">Poison<br></span>');
                }
            }
        }
    }
    // Toxine veuve
    let poisonVeuve = 0;
    if (totalDamage >= 1) {
        if (selectedWeap.ammo.includes('toxine')) {
            if (targetBatType.cat == 'infantry' || targetBatType.cat == 'aliens') {
                poisonVeuve = Math.ceil(totalDamage/(12+playerInfos.caLevel));
                let i = 1;
                while (i <= poisonVeuve) {
                    targetBat.tags.push('poison');
                    if (i > 8) {break;}
                    i++
                }
                console.log('Toxine!');
                $('#report').append('<span class="report cy">Toxine<br></span>');
            }
        }
    }
    // shinda
    if (totalDamage >= 5 || (totalDamage >= 1 && rand.rand(1,2) === 1)) {
        if (selectedWeap.ammo.includes('shinda')) {
            if (targetBatType.skills.includes('mutant') || targetBatType.cat == 'aliens') {
                targetBat.tags.push('shinda');
                console.log('Shinda!');
                $('#report').append('<span class="report cy">Shinda<br></span>');
            }
        }
    }
    // freeze
    if (totalDamage >= 50) {
        if (selectedWeap.ammo.includes('freeze')) {
            if (targetBatType.skills.includes('mutant') || targetBatType.cat == 'aliens') {
                if (!targetBat.tags.includes('freeze')) {
                    targetBat.tags.push('freeze');
                    targetBat.tags.push('freeze');
                    targetBat.tags.push('stun');
                } else {
                    targetBat.tags.push('freeze');
                    targetBat.tags.push('stun');
                }
                console.log('Bossium Freeze!');
                $('#report').append('<span class="report cy">Freeze<br></span>');
            }
        }
    }
    // parasite
    if (totalDamage >= 1 && selectedWeap.ammo.includes('parasite') && rand.rand(1,selectedBatType.squads) >= selectedBat.squadsLeft) {
        if (targetBatType.cat == 'infantry' || targetBatType.cat == 'aliens') {
            targetBat.tags.push('parasite');
            console.log('Parasite!');
            $('#report').append('<span class="report cy">Parasite<br></span>');
        }
    }
    // maladie
    if (((totalDamage >= 1 && playerInfos.caLevel < 3) || totalDamage >= 5) && !targetBat.tags.includes('maladie')) {
        let infected = false;
        if (selectedBatType.skills.includes('maladie') && rand.rand(1,playerInfos.caLevel+1) === 1) {
            infected = true;
        }
        if (selectedBatType.skills.includes('chancre')) {
            infected = true;
        }
        if (infected) {
            if ((targetBatType.cat == 'infantry' && !targetBatType.skills.includes('mutant')) || targetBatType.cat == 'aliens') {
                targetBat.tags.push('maladie');
                console.log('Maladie!');
                $('#report').append('<span class="report cy">Maladie<br></span>');
            }
        }
    }
    // escape notification
    if (escaped) {
        $('#report').append('<span class="report cy">Escape!<br></span>');
    }
    // Stun
    if (selectedWeap.ammo.includes('poraz') || selectedWeap.ammo.includes('disco') || selectedWeap.ammo === 'gaz') {
        targetBat.tags.push('stun');
    }
    if (targetBatType.skills.includes('noaploss')) {
        apDamage = Math.round(apDamage/5);
    }
    // ---------------------------------------------------------------------------------------------------------------------------
    if (apDamage >= 1) {
        $('#report').append('<span class="report">Points d\'actions: -'+apDamage+'<br></span>');
    }
    // Champs de mines
    if (targetWeap.ammo === 'mine' || targetWeap.ammo === 'trap') {
        minesExploded = Math.floor(totalDamage/targetBatType.hp);
        if (minesExploded > targetBatType.squadSize*targetBatType.squads) {
            minesExploded = targetBatType.squadSize*targetBatType.squads;
        }
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
        targetBat.apLeft = targetBat.ap;
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
    if (targetBat.camoAP >= 1) {
        camoStop(targetBat);
    }
    console.log('Damage Left : '+targetBat.damage);
    targetBatArrayUpdate();
    if (targetBat.squadsLeft <= 0) {
        defAlive = false;
        batDeath(targetBat,true);
        $('#report').append('<br><span class="report cy">Bataillon ('+targetBat.type+') détruit<br></span>');
        if (!isFFW) {
            setTimeout(function (){
                setTimeout(function (){
                    batDeathEffect(targetBat,false,'','');
                }, soundDuration);
            }, 500);
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
        batDeath(selectedBat,true);
        $('#report').append('<br><span class="report cy">Bataillon ('+selectedBat.type+') détruit<br></span>');
        if (!isFFW) {
            setTimeout(function (){
                setTimeout(function (){
                    batDeathEffect(selectedBat,false,'Bataillon détruit','Suicide');
                    $('#unitInfos').empty();
                }, soundDuration);
            }, 500);
        } else {
            batDeathEffect(selectedBat,false,'Bataillon détruit','Suicide');
        }
        $('#unitInfos').empty();
    } else {
        selectedBat.apLeft = selectedBat.apLeft-selectedWeap.cost;
        selectedBat.salvoLeft = selectedBat.salvoLeft-1;
        if (squadsOut >= 1 && activeTurn == 'player') {
            selectedBat.xp = selectedBat.xp+xpFactor;
        }
    }
    selectedBatArrayUpdate();
};

function defense(melee) {
    console.log('Défense ->');
    console.log(targetWeap);
    let xpFactor = Math.round(12/selectedBatType.maxSalvo/10);
    xpFactor = xpFactor.toFixedNumber(2);
    if (selectedBatType.maxSalvo >= 5) {
        xpFactor = 0.2;
    }
    $('#report').append('<span class="report or">'+targetBat.type+' ('+targetWeap.name+')</span><br>');
    // Dans l'eau
    let terrain = getTerrain(selectedBat);
    let tile = getTile(selectedBat);
    if (terrain.name === 'W' || terrain.name === 'R' || terrain.name === 'S') {
        if (targetWeap.ammo.includes('feu') || targetWeap.ammo.includes('incendiaire') || targetWeap.ammo.includes('napalm') || targetWeap.ammo.includes('fire') || targetWeap.ammo.includes('lf-') || targetWeap.ammo.includes('lt-') || targetWeap.ammo.includes('molotov')) {
            targetWeap.power = Math.round(targetWeap.power*0.75);
            if (!selectedBatType.skills.includes('fly')) {
                if (terrain.name === 'W' || terrain.name === 'R') {
                    targetWeap.aoe = 'unit';
                }
            }
        }
        if (!selectedBatType.skills.includes('fly') && (!selectedBatType.skills.includes('hover') || selectedBatType.cat === 'aliens')) {
            if (targetWeap.ammo.includes('taser') || targetWeap.ammo.includes('electric')) {
                if ((terrain.name === 'W' || terrain.name === 'R') && !tile.rd) {
                    targetWeap.power = Math.round(targetWeap.power+7);
                    if (targetWeap.aoe == 'unit') {
                        targetWeap.aoe = 'brochette';
                    } else if (targetWeap.aoe == 'brochette') {
                        targetWeap.aoe = 'squad';
                    } else {
                        targetWeap.aoe = 'bat';
                    }
                } else if (terrain.name === 'S' && !tile.rd && selectedBatType.cat === 'aliens') {
                    targetWeap.power = Math.round(targetWeap.power+4);
                }
            }
        }
    }
    let aoeShots = 1;
    if (targetWeap.aoe == "bat") {
        if (selectedBatType.squads === 6 && selectedBatType.squadSize === 1 && !targetWeap.ammo.includes('gaz')) {
            aoeShots = 12;
        } else {
            aoeShots = selectedBatType.squadSize*selectedBat.squadsLeft;
        }
        if (aoeShots < 9) {
            aoeShots = 9;
        }
    } else if (targetWeap.aoe != "unit") {
        if (selectedBatType.squads === 6 && selectedBatType.squadSize === 1) {
            aoeShots = 6;
        } else {
            aoeShots = selectedBatType.squadSize;
        }
        if (targetWeap.aoe == "squad") {
            if (aoeShots < 4) {
                aoeShots = 4;
            }
        } else if (targetWeap.aoe == "brochette") {
            if (aoeShots < 2) {
                aoeShots = 2;
            }
        }
    }
    // BRIDAGE DEFENSE
    let brideDef = 0.75;
    let isGuet = false;
    if (targetBat.tags.includes('guet')) {
        isGuet = true;
    }
    brideDef = calcBrideDef(targetBat,targetBatType,targetWeap,selectedWeap.range,isGuet);
    // bigDef
    if (targetWeap.bigDef && selectedBatType.size >= 4) {
        targetWeap.power = Math.ceil(targetWeap.power+Math.sqrt(selectedBatType.size));
    }
    console.log('brideDef='+brideDef);
    let shots = Math.round(targetWeap.rof*targetBat.squadsLeft*brideDef);
    if (targetBatType.skills.includes('undead')) {
        shots = Math.round(targetWeap.rof*targetBatType.squads*brideDef);
    }
    // SCIES (noGrip)
    if (selectedWeap.noGrip && targetWeap.range === 0 && targetBatType.size*5 >= selectedBatType.size) {
        shots = Math.round(shots/1.5);
    }
    // ESCAPE
    escaped = false;
    if (selectedBatType.skills.includes('escape')) {
        let escapeChance = Math.round((selectedBatType.speed-2)*targetWeap.cost*escapeValue);
        console.log('escapeChance:'+escapeChance);
        if (rand.rand(1,100) <= escapeChance) {
            escaped = true;
            let escapeVar = rand.rand(4,8);
            console.log('escapeVar:'+escapeVar);
            shots = Math.round(shots*escapeVar/(targetWeap.cost+4)/2);
        }
    }
    // bugROF
    if (bugROF > 1 && targetBatType.kind === 'bug') {
        shots = Math.round(shots*bugROF);
    }
    // spiderRG
    if (spiderRG && targetBatType.kind === 'spider') {
        shots = Math.round(shots*1.25);
    }
    // Champs de mines
    if (targetWeap.ammo === 'mine' || targetWeap.ammo === 'trap') {
        shots = minesExploded;
        console.log('shots: '+shots);
    }
    // console.log(shots);
    // console.log(aoeShots);
    let totalDamage = 0;
    let apDamage = 0;
    let shotResult = {damage:0,hits:0};
    let totalHits = 0;
    // brochette
    let brochette = false;
    if (targetWeap.aeo == 'brochette') {
        brochette = true;
    }
    let shotDice = 100;
    if (selectedBat.tags.includes('stun')) {
        shotDice = 50;
    } else {
        shotDice = calcShotDice(targetBat,false);
    }
    if (playerInfos.pseudo === 'Test') {
        shotDice = 100;
    }
    // noBig
    if (selectedBatType.size > Math.round(targetBatType.size/2) && targetWeap.noBig) {
        targetWeap.power = Math.round(targetWeap.power*targetBatType.size/2/selectedBatType.size);
    } else if (Math.round(targetBatType.size/3) > selectedBatType.size && targetWeap.noBig) {
        targetWeap.power = Math.round(targetWeap.power*targetBatType.size/3/selectedBatType.size);
    }
    // isShort range 0
    if (targetWeap.isShort && targetWeap.range >= 1 && melee) {
        targetWeap.accuracy = targetWeap.accuracy+5;
    }
    toHit = 999;
    let i = 1;
    while (i <= shots) {
        if (aoeShots >= 2) {
            shotResult = blast(brochette,targetBatType,aoeShots,targetWeap,selectedBat,selectedBatType,shotDice);
        } else {
            shotResult = shot(targetWeap,targetBatType,selectedBat,selectedBatType,shotDice);
        }
        totalDamage = totalDamage+shotResult.damage;
        totalHits = totalHits+shotResult.hits;
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
    if (targetWeap.ammo.includes('feu') || targetWeap.ammo.includes('incendiaire') || targetWeap.ammo.includes('napalm') || targetWeap.ammo.includes('fire') || targetWeap.ammo.includes('pyratol') || targetWeap.ammo.includes('lf-') || targetWeap.ammo.includes('lt-') || targetWeap.ammo.includes('molotov')) {
        if (selectedBatType.skills.includes('inflammable')) {
            totalDamage = totalDamage*2;
            console.log('inflammable!');
        }
    }
    // résistance au feu
    if (targetWeap.ammo.includes('feu') || targetWeap.ammo.includes('incendiaire') || targetWeap.ammo.includes('napalm') || targetWeap.ammo.includes('fire') || targetWeap.ammo.includes('pyratol') || targetWeap.ammo.includes('lf-') || targetWeap.ammo.includes('lt-') || targetWeap.ammo.includes('molotov')) {
        if (selectedBatType.skills.includes('resistfeu') || selectedBat.tags.includes('resistfeu')) {
            totalDamage = Math.round(totalDamage/2);
            console.log('résistance au feu!');
        }
    }
    // résistance blast
    if (selectedBatType.skills.includes('resistblast') || selectedBat.tags.includes('resistblast')) {
        if (targetWeap.ammo.includes('bfg') || targetWeap.ammo.includes('nanite') || targetWeap.ammo.includes('suicide') || targetWeap.ammo.includes('mine') || targetWeap.ammo.includes('autodestruction') || targetWeap.ammo.includes('dynamite') || targetWeap.ammo.includes('bombe') || targetWeap.ammo.includes('explosif') || targetWeap.ammo.includes('obus') || targetWeap.ammo.includes('missile') || targetWeap.ammo.includes('grenade') || targetWeap.ammo.includes('disco')) {
            if (!targetWeap.ammo.includes('gaz') && !targetWeap.ammo.includes('incendiaire') && !targetWeap.ammo.includes('napalm')) {
                totalDamage = Math.round(totalDamage/2);
                console.log('résistance au blast!');
            }
        }
    }
    // résistance poison (gaz)
    if (selectedBatType.skills.includes('resistpoison') || selectedBat.tags.includes('resistpoison')) {
        if (targetWeap.ammo.includes('gaz')) {
            totalDamage = Math.round(totalDamage/2);
            console.log('résistance au gaz!');
        }
    }
    // résistance acide
    if (targetWeap.name.includes('acide') || targetWeap.ammo.includes('ruche')) {
        if (selectedBatType.skills.includes('resistacide') || selectedBat.tags.includes('resistacide')) {
            totalDamage = Math.round(totalDamage/2);
            console.log('résistance acide!');
        }
    }
    // AP DAMAGE!
    if (targetWeap.apdamage > 0) {
        let wapd = targetWeap.apdamage;
        if (targetWeap.ammo.includes('electric')) {
            if (selectedBatType.cat == 'vehicles') {
                if (selectedBatType.skills.includes('fly')) {
                    wapd = wapd*4*20/selectedBatType.size;
                } else {
                    wapd = wapd*2.25*20/selectedBatType.size;
                }
                wapd = wapd*2.25*20/selectedBatType.size;
            } else if (selectedBatType.cat == 'buildings' || selectedBatType.cat == 'devices') {
                wapd = wapd*20/selectedBatType.size;
            } else if (selectedBatType.skills.includes('cyber')) {
                wapd = wapd*2*20/selectedBatType.size;
            }
        } else {
            wapd = wapd*1.75/Math.sqrt(selectedBatType.size);
        }
        apDamage = apDamage+Math.round(totalDamage*wapd);
        console.log('AP Damage : '+apDamage);
    }
    // web
    if (targetWeap.ammo.includes('web') || targetWeap.ammo.includes('trap')) {
        let webDamage = totalHits;
        webDamage = Math.ceil(webDamage*18/Math.sqrt(selectedBatType.hp)/(selectedBatType.size+7));
        if (selectedBatType.cat != 'aliens') {
            webDamage = Math.ceil(webDamage/(playerInfos.caLevel+4)*6);
        }
        apDamage = apDamage+webDamage;
    }
    // disco
    if (targetWeap.ammo.includes('disco')) {
        let webDamage = totalHits;
        webDamage = Math.ceil(webDamage*18/Math.sqrt(selectedBatType.hp)/10);
        apDamage = apDamage+webDamage;
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
    if (totalDamage >= 7 || (totalDamage >= 1 && rand.rand(1,3) === 1)) {
        if (targetWeap.ammo.includes('poison') || targetWeap.ammo.includes('atium') || targetWeap.ammo.includes('trap')) {
            if ((selectedBatType.cat == 'infantry' && (!selectedBatType.skills.includes('mutant') || playerInfos.caLevel < 3)) || selectedBatType.cat == 'aliens') {
                selectedBat.tags.push('poison');
                if (targetWeap.ammo.includes('atium')) {
                    selectedBat.tags.push('poison');
                    selectedBat.tags.push('poison');
                }
                if (targetWeap.ammo.includes('trap')) {
                    selectedBat.tags.push('poison');
                }
                console.log('Poison!');
                $('#report').append('<span class="report cy">Poison<br></span>');
            }
        }
    }
    // shinda
    if (totalDamage >= 5 || (totalDamage >= 1 && rand.rand(1,2) === 1)) {
        if (targetWeap.ammo.includes('shinda')) {
            if (selectedBatType.skills.includes('mutant') || selectedBatType.cat == 'aliens') {
                selectedBat.tags.push('shinda');
                console.log('Shinda!');
                $('#report').append('<span class="report cy">Shinda<br></span>');
            }
        }
    }
    // freeze
    if (totalDamage >= 50) {
        if (targetWeap.ammo.includes('freeze')) {
            if (selectedBatType.skills.includes('mutant') || selectedBatType.cat == 'aliens') {
                if (!selectedBat.tags.includes('freeze')) {
                    selectedBat.tags.push('freeze');
                    selectedBat.tags.push('freeze');
                    selectedBat.tags.push('stun');
                } else {
                    selectedBat.tags.push('freeze');
                    selectedBat.tags.push('stun');
                }
                console.log('Bossium Freeze!');
                $('#report').append('<span class="report cy">Freeze<br></span>');
            }
        }
    }
    // parasite
    if (totalDamage >= 20 && targetWeap.ammo.includes('parasite') && rand.rand(1,targetBatType.squads) >= targetBat.squadsLeft) {
        if (selectedBatType.cat == 'infantry' || selectedBatType.cat == 'aliens') {
            selectedBat.tags.push('parasite');
            console.log('Parasite!');
            $('#report').append('<span class="report cy">Parasite<br></span>');
        }
    }
    // maladie
    if (((totalDamage >= 1 && playerInfos.caLevel < 3) || totalDamage >= 5) && !selectedBat.tags.includes('maladie')) {
        let infected = false;
        if (targetBatType.skills.includes('maladie') && rand.rand(1,playerInfos.caLevel+1) === 1) {
            infected = true;
        }
        if (targetBatType.skills.includes('chancre')) {
            infected = true;
        }
        if (infected) {
            if ((selectedBatType.cat == 'infantry' && !selectedBatType.skills.includes('mutant')) || selectedBatType.cat == 'aliens') {
                selectedBat.tags.push('maladie');
                console.log('Maladie!');
                $('#report').append('<span class="report cy">Maladie<br></span>');
            }
        }
    }
    // escape notification
    if (escaped) {
        $('#report').append('<span class="report cy">Escape!<br></span>');
    }
    // Stun
    if (targetWeap.ammo.includes('poraz') || targetWeap.ammo.includes('disco') || targetWeap.ammo === 'gaz') {
        selectedBat.tags.push('stun');
    }
    if (selectedBatType.skills.includes('noaploss')) {
        apDamage = Math.round(apDamage/5);
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
        selectedBat.apLeft = selectedBat.ap;
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
        batDeath(selectedBat,true);
        $('#report').append('<br><span class="report cy">Bataillon ('+selectedBat.type+') détruit<br></span>');
        if (!isFFW) {
            setTimeout(function (){
                setTimeout(function (){
                    batDeathEffect(selectedBat,false,'','');
                }, soundDuration);
            }, 500);
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
    if (!targetBatType.skills.includes('guerrilla')) {
        targetBat.apLeft = targetBat.apLeft-1;
    }
    if (targetBat.salvoLeft >= 1) {
        targetBat.salvoLeft = 0;
    } else {
        targetBat.salvoLeft = targetBat.salvoLeft-1;
    }
    if (squadsOut >= 1 && activeTurn == 'aliens') {
        targetBat.xp = targetBat.xp+xpFactor;
    }
    targetBatArrayUpdate();
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
    // fly
    let weapAccu = weapon.accuracy;
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
    // skupiac drug
    let batSpeed = batType.speed;
    if (bat.tags.includes('skupiac')) {
        batSpeed = batSpeed+3;
    }
    // fly
    let weapAccu = weapon.accuracy;
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
        if (rand.rand(1,2) === 1) {
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
