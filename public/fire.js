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
    let selectedBatName = nomVisible(selectedBat.type);
    let targetBatName = nomVisible(targetBat.type);
    tagDelete(selectedBat,'mining');
    if (!targetBat.eq.includes('w2-auto')) {
        tagDelete(targetBat,'mining');
    }
    escaped = false;
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
        // camoOut(); - se fait maintenant en fin de combat !!!
        // tagAction();
        centerMapTarget();
    } else {
        centerMap();
    }
    let selectedBatUnits = selectedBat.squadsLeft*selectedBatType.squadSize;
    let targetBatUnits = targetBat.squadsLeft*targetBatType.squadSize;
    $('#report').empty('');
    $('#report').append('<span class="report or">'+selectedBatUnits+' '+selectedBatName+'</span> <span class="report">vs</span> <span class="report or">'+targetBatUnits+' '+targetBatName+'</span><br>');
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
    if (targetBatType.skills.includes('onedef')) {
        negSalvo = -1;
    }
    if (targetBatType.skills.includes('gooddef') || targetBat.eq.includes('w2-auto')) {
        negSalvo = -6;
    }
    if (targetBat.tags.includes('hero') && targetBatType.skills.includes('herorip')) {
        negSalvo = negSalvo-3;
    }
    if (distance <= 3 && targetWeap.range >= distance && ammoLeft >= 1 && !targetWeap.noDef && targetBat.salvoLeft > negSalvo) {
        let realmOK = checkRealm();
        if (realmOK) {
            riposte = true;
            let aspeed = calcSpeed(selectedBat,selectedWeap,targetWeap,distance,true);
            let dspeed = calcSpeed(targetBat,targetWeap,selectedWeap,distance,false);
            // embuscade (initiative)
            if (activeTurn === 'player') {
                if (selectedBat.tags.includes('embuscade') && selectedBat.fuzz === -2) {
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
            if (targetBatType.cat === 'buildings' || targetBatType.skills.includes('after') || targetBat.eq.includes('w2-auto')) {
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
                    }, 200);
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
                        }, 200);
                    }
                } else {
                    if (activeTurn == 'player') {blockMe(false);}
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
    if (activeTurn == 'player') {
        if (rand.rand(1,100) > calcTirFurtif(selectedWeap,selectedBat)) {
            camoOut();
        }
    }
};

function calcTirFurtif(weap,bat) {
    let tirFurtif = 0;
    if (bat.fuzz <= -2) {
        if (weap.noise < 2) {
            tirFurtif = calcCamo(bat);
            if (weap.noise > 0) {
                tirFurtif = Math.round(tirFurtif/1.65);
            } else {
                tirFurtif = Math.round(tirFurtif/1.15);
            }
        }
    }
    return tirFurtif;
};

function attack(melee) {
    console.log('Attaque ->');
    console.log(selectedWeap);
    let selectedBatName = nomVisible(selectedBat.type);
    let targetBatName = nomVisible(targetBat.type);
    minesExploded = 0;
    let xpFactor = Math.round(12/selectedBatType.maxSalvo/10);
    xpFactor = xpFactor.toFixedNumber(2);
    if (selectedBatType.maxSalvo >= 5) {
        xpFactor = 0.2;
    }
    if (targetBatType.cat != 'buildings' && targetBat.tags.includes('construction') && targetBat.apLeft <= 2-targetBat.ap) {
        targetBat.apLeft = 3-targetBat.ap;
    }
    $('#report').append('<span class="report or">'+selectedBatName+' ('+selectedWeap.name+')</span><br>');
    let delugeTileId = targetBat.tileId;
    // Dans l'eau
    let terrain = getTerrain(targetBat);
    let tile = getTile(targetBat);
    let onGround = true;
    if (targetBatType.skills.includes('fly') || tile.rd) {
        onGround = false;
    }
    let wetness = getWetness(terrain,onGround);
    if (wetness >= 1) {
        if (selectedWeap.ammo.includes('feu') || selectedWeap.ammo.includes('incendiaire') || selectedWeap.ammo.includes('napalm') || selectedWeap.ammo.includes('fire') || selectedWeap.ammo.includes('lf-') || selectedWeap.ammo.includes('lt-') || selectedWeap.ammo.includes('molotov')) {
            if (!selectedWeap.ammo.includes('pyratol')) {
                if (selectedWeap.ammo.includes('incendiaire') || selectedWeap.ammo.includes('fireshells')) {
                    selectedWeap.power = Math.round(selectedWeap.power*0.9);
                } else {
                    selectedWeap.power = Math.round(selectedWeap.power*0.8);
                }
                if (wetness >= 2) {
                    if (selectedWeap.aoe === 'brochette') {
                        selectedWeap.aoe = 'unit';
                    } else if (selectedWeap.aoe === 'squad') {
                        selectedWeap.aoe = 'brochette';
                    } else if (selectedWeap.aoe === 'bat') {
                        selectedWeap.aoe = 'squad';
                    }
                }
            }
        }
        if (selectedWeap.ammo.includes('laser') || selectedWeap.ammo.includes('gaz')) {
            if (wetness >= 3) {
                selectedWeap.power = Math.round(selectedWeap.power*0.8);
            }
        }
        if (!targetBatType.skills.includes('resistelec') && !targetBat.tags.includes('resistelec') && (!targetBatType.skills.includes('hover') || targetBatType.cat === 'aliens')) {
            if (selectedWeap.ammo.includes('taser') || selectedWeap.ammo.includes('electric')) {
                if (wetness >= 2) {
                    selectedWeap.power = Math.round(selectedWeap.power*1.35);
                    if (selectedWeap.aoe === 'unit') {
                        selectedWeap.aoe = 'brochette';
                    } else if (selectedWeap.aoe === 'brochette') {
                        selectedWeap.aoe = 'squad';
                    } else {
                        selectedWeap.aoe = 'bat';
                    }
                } else if (wetness === 1 && targetBatType.cat === 'aliens') {
                    selectedWeap.power = Math.round(selectedWeap.power*1.2);
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
    if (selectedWeap.ammo.includes('autodestruction') || selectedBatType.skills.includes('undead') || selectedBat.tags.includes('zombie')) {
        shots = selectedWeap.rof*selectedBatType.squads;
    }
    // hero fanatic
    if ((selectedBat.tags.includes('hero') || selectedBat.tags.includes('vet')) && selectedBatType.skills.includes('herofana')) {
        shots = selectedWeap.rof*selectedBatType.squads;
    }
    // Attack %
    let attFactor = 100;
    // SCIES (noGrip)
    if (targetWeap.noGrip && selectedWeap.range === 0 && selectedBatType.size >= 3) {
        shots = Math.round(shots/1.25);
        attFactor = Math.round(attFactor/1.25);
    }
    // bugROF
    if (bugROF > 1 && selectedBatType.kind === 'bug') {
        shots = Math.round(shots*bugROF);
        attFactor = Math.round(attFactor*bugROF);
    }
    // spiderRG
    if (selectedBatType.kind === 'spider') {
        if (spiderROF) {
            shots = Math.round(shots*1.5);
            attFactor = Math.round(attFactor*1.5);
        } else if (spiderRG) {
            shots = Math.round(shots*1.25);
            attFactor = Math.round(attFactor*1.25);
        }
    }
    // Flying Aliens vs Small Aircrafts
    if (targetBatType.skills.includes('fly') && targetBatType.cat === 'vehicles') {
        if (selectedBatType.cat === 'aliens' && selectedBatType.skills.includes('fly')) {
            if (selectedBatType.size*4 >= targetBatType.size) {
                let sizeFactor = selectedBatType.size*2/targetBatType.size;
                if (sizeFactor < 1.5) {
                    sizeFactor = 1.5;
                }
                shots = Math.round(shots*sizeFactor);
                attFactor = Math.round(attFactor*sizeFactor);
            }
        }
    }
    // berserk (bonus ROF)
    if (activeTurn === 'player') {
        if (selectedBatType.skills.includes('berserk') && selectedBat.damage >= 1) {
            shots = Math.floor(shots*berserkROF);
            attFactor = Math.round(attFactor*berserkROF);
            console.log('bonus ROF berserk');
        }
    }
    // morph bonus
    if (activeTurn === 'player') {
        if (targetBat.tags.includes('morph')) {
            selectedWeap.power = Math.round(selectedWeap.power*2);
        }
    }
    // embuscade (bonus ROF)
    if (activeTurn === 'player') {
        if (selectedBat.tags.includes('embuscade')) {
            let embushBonus = 2;
            if (selectedBatType.cat != 'aliens') {
                embushBonus = embushBonus+(playerInfos.comp.train/2)+(playerInfos.comp.cam/5);
            }
            shots = Math.floor(shots*embushBonus);
            attFactor = Math.round(attFactor*embushBonus);
            console.log('bonus ROF embuscade');
        }
    }
    // guerrilla
    if (selectedBatType.skills.includes('tirailleur') && selectedBat.oldTileId != selectedBat.tileId) {
        let guerBonus = 1.5;
        if (selectedBatType.cat != 'aliens') {
            guerBonus = guerBonus+(playerInfos.comp.train/5)+(playerInfos.comp.cam/10);
        }
        shots = Math.round(shots*guerBonus);
        attFactor = Math.round(attFactor*guerBonus);
    }
    // tir ciblé
    if (selectedBat.tags.includes('vise') && selectedWeap.isPrec) {
        shots = Math.round(shots*(8+playerInfos.comp.train)/10);
        selectedWeap.power = Math.round(selectedWeap.power*(8+playerInfos.comp.train)/5);
        attFactor = Math.round(attFactor*(8+playerInfos.comp.train)/10);
    }
    // double attaque
    if (selectedBat.tags.includes('datt') && !selectedWeap.isPrec && !selectedWeap.isBow && !selectedWeap.noBis && !selectedWeap.noDatt) {
        shots = Math.round(shots*1.5);
        attFactor = Math.round(attFactor*1.5);
    }
    // Attack %
    $('#report').append('<span class="report jaune">Attaque '+attFactor+'%<br></span>');
    // chargeur
    if (selectedBat.eq.includes('chargeur') || selectedBat.eq.includes('carrousel') || selectedBat.logeq.includes('chargeur') || selectedBat.logeq.includes('carrousel') || selectedBat.eq.includes('kit-chouf') || selectedBat.eq === 'crimekitto' || selectedBat.eq === 'crimekitch' || selectedBat.eq.includes('landerwkit') || selectedBat.eq.includes('w2-l')) {
        shots = chargeurAdj(selectedBat,shots,selectedWeap);
    }
    $('#report').append('<span class="report">Puissance '+shots+' &times; '+selectedWeap.power+'<br></span>');
    // INFRASTRUCTURES
    console.log('shots='+shots);
    if (activeTurn != 'player') {
        if (tile.infra != undefined) {
            let okCover = bonusInfra(targetBatType,tile.infra);
            if (okCover) {
                let infraProtect = 0;
                if (tile.infra === 'Miradors') {
                    infraProtect = 25;
                } else if (tile.infra === 'Palissades') {
                    infraProtect = 33;
                } else if (tile.infra === 'Remparts') {
                    infraProtect = 45;
                } else if (tile.infra === 'Murailles') {
                    infraProtect = 60;
                }
                if (playerInfos.comp.def >= 3 && targetBatType.skills.includes('garde')) {
                    infraProtect = infraProtect+(((100-infraProtect)*1.5)-(100-infraProtect));
                }
                if (selectedBatType.skills.includes('sauteur') && !tile.infra === 'Miradors') {
                    infraProtect = Math.round(infraProtect/2);
                }
                if (selectedBatType.skills.includes('fly')) {
                    infraProtect = Math.round((infraProtect-15)/2.5);
                }
                shots = Math.round(shots*(100-infraProtect)/100);
                $('#report').append('<span class="report rose">Protection '+infraProtect+'%<br></span>');
            }
        }
    }
    console.log(tile.infra+'+++++++++++++++++++++++');
    console.log('shots='+shots);
    // ESCAPE
    escaped = false;
    let hasEscape = false;
    let escapeSpeed = targetBatType.speed-2;
    if (targetBatType.skills.includes('escape')) {
        hasEscape = true;
    }
    if (targetBatType.skills.includes('heroescape') && targetBat.tags.includes('hero')) {
        hasEscape = true;
        escapeSpeed = targetBat.vet;
    }
    if (hasEscape && (selectedBat.fuzz >= -1 || selectedWeap.isMelee || selectedWeap.isBow) && !selectedWeap.ammo.includes('laser')) {
        if ((tile.terrain != 'W' && tile.terrain != 'R') || targetBatType.skills.includes('fly')) {
            let escapeChance = Math.round(escapeSpeed*selectedWeap.cost*escapeValue);
            if (selectedWeap.aoe != 'unit' && !targetBatType.skills.includes('fly')) {
                escapeChance = Math.round(escapeChance/3);
            }
            console.log('escapeChance:'+escapeChance);
            if (rand.rand(1,100) <= escapeChance) {
                escaped = true;
                let escapeVar = rand.rand(4,8);
                console.log('escapeVar:'+escapeVar);
                shots = Math.round(shots*escapeVar/(selectedWeap.cost+4)/2);
            }
        }
    }
    // SHIELD
    let shieldChance = 0;
    if (targetBatType.skills.includes('shield')) {
        shieldChance = 67;
    } else {
        if (targetBatType.kind === 'bug' && bugSHIELD) {
            shieldChance = 22;
        }
        if (targetBatType.kind === 'egg' && eggSHIELD) {
            shieldChance = 33;
        }
    }
    if (activeTurn === 'player' && shieldChance >= 1 && !selectedWeap.ammo.includes('marquage')) {
        if (rand.rand(1,100) <= shieldChance && !targetBat.tags.includes('shield')) {
            targetBat.tags.push('shield');
        }
        if (targetBat.tags.includes('shield')) {
            let shieldValue = rand.rand(6,14);
            if (selectedWeap.ammo.includes('gaz')) {
                shieldValue = Math.ceil(shieldValue/2);
            }
            if (selectedWeap.ammo.includes('bfg') || selectedWeap.ammo.includes('laser') || selectedWeap.ammo.includes('autodestruction') || selectedWeap.ammo.includes('mine') || selectedWeap.ammo.includes('suicide')) {
                shieldValue = Math.ceil(shieldValue/3);
            }
            if (selectedWeap.isMelee || selectedWeap.noShield || selectedWeap.ammo.includes('adamantium') || selectedWeap.ammo.includes('-fleche') || selectedWeap.ammo.includes('-sunburst')) {
                shieldValue = Math.ceil(shieldValue/6);
            }
            shots = Math.ceil(shots/shieldValue);
            $('#report').append('<span class="report rose">Bouclier activé<br></span>');
        }
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
    if (playerInfos.pseudo === 'Test' || playerInfos.pseudo === 'Payall') {
        shotDice = 100;
    }
    console.log('shotDice='+shotDice);
    // noBig
    if (selectedWeap.noBig) {
        let weapPriorPower = selectedWeap.power;
        if (targetBatType.size > Math.round(selectedBatType.size/2)) {
            selectedWeap.power = Math.round(selectedWeap.power*selectedBatType.size/2/targetBatType.size);
        } else if (Math.round(selectedBatType.size/3) > targetBatType.size) {
            selectedWeap.power = Math.round(selectedWeap.power*selectedBatType.size/3/targetBatType.size);
        }
        if (selectedWeap.ammo === 'belier-spike') {
            selectedWeap.power = selectedWeap.power+Math.round(weapPriorPower/5)+10;
        }
    }
    // isShort range 0
    if (selectedWeap.isShort && selectedWeap.range >= 1 && melee) {
        selectedWeap.accuracy = selectedWeap.accuracy+5;
    }
    toHit = 999;
    console.log('shots='+shots);
    let i = 1;
    while (i <= shots) {
        if (aoeShots >= 2) {
            // shotResult = blast(brochette,selectedBatType,aoeShots,selectedWeap,targetBat,targetBatType,shotDice);
            shotResult = blast(selectedWeap,selectedBat,selectedBatType,targetBat,targetBatType,shotDice,brochette,aoeShots);
        } else {
            shotResult = shot(selectedWeap,selectedBat,selectedBatType,targetBat,targetBatType,shotDice);
        }
        totalDamage = totalDamage+shotResult.damage;
        totalHits = totalHits+shotResult.hits;
        if (i > 5000) {break;}
        i++
    }
    $('#report').append('<br>');
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
            webDamage = Math.ceil(webDamage/(playerInfos.comp.ca+4)*6);
        }
        apDamage = apDamage+webDamage;
    }
    // marquage
    if (selectedWeap.ammo.includes('marquage') && totalHits >= 20 && !targetBat.tags.includes('fluo')) {
        targetBat.tags.push('fluo');
        $('#report').append('<span class="report rose">Bataillon marqué<br></span>');
    }
    // guidage
    if (selectedWeap.ammo.includes('guidage') && totalHits >= 20 && !targetBat.tags.includes('guide')) {
        targetBat.tags.push('guide');
        $('#report').append('<span class="report rose">Guidage laser<br></span>');
    }
    // arrosoir
    if (selectedWeap.ammo.includes('fuel') && totalHits >= 1 && !targetBat.tags.includes('inflammable')) {
        targetBat.tags.push('inflammable');
        $('#report').append('<span class="report rose">Arrosé<br></span>');
    }
    // disco
    if (selectedWeap.ammo.includes('disco')) {
        let webDamage = totalHits;
        webDamage = Math.ceil(webDamage*18/Math.sqrt(targetBatType.hp)/10);
        apDamage = apDamage+webDamage;
    }
    // inflammable
    if (selectedWeap.ammo.includes('feu') || selectedWeap.ammo.includes('incendiaire') || selectedWeap.ammo.includes('napalm') || selectedWeap.ammo.includes('fire') || selectedWeap.ammo.includes('pyratol') || selectedWeap.ammo.includes('lf-') || selectedWeap.ammo.includes('lt-') || selectedWeap.ammo.includes('molotov') || selectedWeap.ammo.includes('laser')) {
        if (targetBatType.skills.includes('inflammable') || targetBat.tags.includes('inflammable') || targetBat.eq === 'e-jetpack') {
            let infactor = 2;
            if (selectedWeap.ammo.includes('laser') || selectedWeap.ammo === 'incendiaire' || selectedWeap.ammo === 'ac-incendiaire' || selectedWeap.ammo === 'sm-incendiaire' || selectedWeap.ammo === 'fleche-incendiaire') {
                infactor = 1.5;
            }
            if (targetBat.tags.includes('resistfeu') && targetBatType.cat != 'aliens') {
                infactor = 1;
            } else if (targetBatType.skills.includes('resistfeu') || targetBat.tags.includes('resistfeu')) {
                infactor = Math.round(infactor/1.25);
            }
            let infbonus = 0;
            if (targetBat.tags.includes('inflammable')) {
                if (targetBatType.skills.includes('inflammable')) {
                    infactor = 5;
                    infbonus = rand.rand(180,320);
                } else {
                    infactor = 3;
                    infbonus = rand.rand(130,240);
                }
            }
            totalDamage = Math.round(totalDamage*infactor)+infbonus;
            if (infactor > 1 || infbonus > 0) {
                $('#report').append('<span class="report rose">Inflammable x'+infactor+'<br></span>');
                console.log('inflammable!');
            }
        }
    }
    // résistance au feu
    if (selectedWeap.ammo.includes('feu') || selectedWeap.ammo.includes('incendiaire') || selectedWeap.ammo.includes('napalm') || selectedWeap.ammo.includes('fire') || selectedWeap.ammo.includes('pyratol') || selectedWeap.ammo.includes('lf-') || selectedWeap.ammo.includes('lt-') || selectedWeap.ammo.includes('molotov') || selectedWeap.ammo.includes('laser')) {
        if (targetBatType.skills.includes('resistfeu') || targetBat.tags.includes('resistfeu')) {
            if (targetBatType.cat === 'aliens') {
                totalDamage = Math.round(totalDamage/3);
                apDamage = Math.round(apDamage/3);
                if (playerInfos.comp.ca >= 2) {
                    $('#report').append('<span class="report rose">Résistance au feu 67%<br></span>');
                }
            } else {
                totalDamage = Math.round(totalDamage/1.5);
                apDamage = Math.round(apDamage/1.5);
                $('#report').append('<span class="report rose">Résistance au feu 33%<br></span>');
            }
            console.log('résistance au feu!');
        }
    }
    // résistance électricité
    if (targetBatType.skills.includes('resistelec') || targetBat.tags.includes('resistelec')) {
        if (selectedWeap.ammo.includes('electric') || selectedWeap.ammo.includes('taser')) {
            totalDamage = Math.round(totalDamage/2);
            apDamage = Math.round(apDamage/4);
            if (playerInfos.comp.ca >= 2) {
                $('#report').append('<span class="report rose">Résistance aux décharges 50%<br></span>');
            }
            console.log('résistance électricité!');
        }
    }
    // résistance blast
    if (targetBatType.skills.includes('resistblast') || targetBat.tags.includes('resistblast')) {
        if (selectedWeap.ammo.includes('nanite') || selectedWeap.ammo.includes('suicide') || selectedWeap.ammo.includes('mine') || selectedWeap.ammo.includes('autodestruction') || selectedWeap.ammo.includes('dynamite') || selectedWeap.ammo.includes('bombe') || selectedWeap.ammo.includes('explosif') || selectedWeap.ammo.includes('explosive') || selectedWeap.ammo.includes('obus') || selectedWeap.ammo.includes('missile') || selectedWeap.ammo.includes('grenade') || selectedWeap.ammo.includes('disco')) {
            if (!selectedWeap.ammo.includes('gaz') && !selectedWeap.ammo.includes('incendiaire') && !selectedWeap.ammo.includes('napalm')) {
                if (selectedWeap.ammo.includes('explosive')) {
                    totalDamage = Math.round(totalDamage/1.34);
                    apDamage = Math.round(apDamage/1.34);
                    if (playerInfos.comp.ca >= 2) {
                        $('#report').append('<span class="report rose">Résistance au secousses 25%<br></span>');
                    }
                } else {
                    totalDamage = Math.round(totalDamage/2);
                    apDamage = Math.round(apDamage/2);
                    if (playerInfos.comp.ca >= 2) {
                        $('#report').append('<span class="report rose">Résistance au secousses 50%<br></span>');
                    }
                }
                console.log('résistance au blast!');
            }
        }
    }
    // sensibilité blast
    if (targetBatType.skills.includes('reactblast') || targetBat.tags.includes('reactblast')) {
        if (selectedWeap.ammo.includes('nanite') || selectedWeap.ammo.includes('suicide') || selectedWeap.ammo.includes('mine') || selectedWeap.ammo.includes('autodestruction') || selectedWeap.ammo.includes('dynamite') || selectedWeap.ammo.includes('bombe') || selectedWeap.ammo.includes('explosif') || selectedWeap.ammo.includes('obus') || selectedWeap.ammo.includes('missile') || selectedWeap.ammo.includes('grenade') || selectedWeap.ammo.includes('disco')) {
            if (!selectedWeap.ammo.includes('gaz') && !selectedWeap.ammo.includes('incendiaire') && !selectedWeap.ammo.includes('napalm')) {
                totalDamage = Math.round(totalDamage*1.5);
                apDamage = Math.round(apDamage*1.5);
                if (playerInfos.comp.ca >= 3) {
                    $('#report').append('<span class="report rose">Sensibilité au secousses<br></span>');
                }
                console.log('sensibilité au blast!');
            }
        }
    }
    // résistance poison (gaz)
    if (targetBatType.skills.includes('resistpoison') || targetBatType.skills.includes('eatpoison') || targetBat.tags.includes('resistpoison')) {
        if (selectedWeap.ammo.includes('gaz')) {
            if (targetBatType.skills.includes('eatpoison')) {
                totalDamage = 0;
                apDamage = 0;
                if (!targetBat.tags.includes('regeneration')) {
                    targetBat.tags.push('regeneration');
                }
                if (playerInfos.comp.ca >= 3) {
                    $('#report').append('<span class="report rose">Résistance au poison 100%<br></span>');
                }
            } else {
                totalDamage = Math.round(totalDamage/2);
                apDamage = Math.round(apDamage/2);
                if (playerInfos.comp.ca >= 3) {
                    $('#report').append('<span class="report rose">Résistance au poison 50%<br></span>');
                }
            }
            console.log('résistance au gaz!');
        }
    }
    // sensibilité poison (gaz)
    if (targetBatType.skills.includes('reactpoison') || targetBat.tags.includes('reactpoison')) {
        if (selectedWeap.ammo.includes('gaz')) {
            totalDamage = Math.round(totalDamage*2);
            apDamage = Math.round(apDamage*2);
            if (playerInfos.comp.ca >= 3) {
                $('#report').append('<span class="report rose">Sensibilité au poison x2<br></span>');
            }
            console.log('sensibilité au gaz!');
        }
    }
    // résistance acide
    if (selectedWeap.name.includes('acide') || selectedWeap.ammo.includes('ruche')) {
        if (targetBatType.skills.includes('resistacide') || targetBat.tags.includes('resistacide')) {
            totalDamage = Math.round(totalDamage/1.5);
            apDamage = Math.round(apDamage/1.5);
            if (playerInfos.comp.ca >= 2) {
                $('#report').append('<span class="report rose">Résistance à l\'acide 33%<br></span>');
            }
            console.log('résistance acide!');
        }
    }
    // résistance all
    if (targetBatType.skills.includes('resistall') || targetBat.tags.includes('resistall')) {
        if (targetBatType.cat === 'aliens') {
            totalDamage = Math.round(totalDamage/1.5);
            if (playerInfos.comp.ca >= 2) {
                $('#report').append('<span class="report rose">Protection 33%<br></span>');
            }
        } else {
            totalDamage = Math.round(totalDamage/1.25);
            $('#report').append('<span class="report rose">Protection 20%<br></span>');
        }
    }
    // ricochet
    let rico = checkRicochet(targetBat,targetBatType,selectedWeap);
    if (rico) {
        totalDamage = 0;
        apDamage =0;
        $('#report').append('<span class="report rose">Ricochet<br></span>');
    }
    // infkill
    if (selectedBatType.skills.includes('infkill') && targetBatType.cat != 'infantry') {
        totalDamage = Math.round(totalDamage/2);
    }
    // resistance oeufs
    if (targetBatType.skills.includes('eggprotect')) {
        let eggProt = 100-Math.round(1000/(10+((zone[0].mapDiff-1)*2.5)));
        if (targetBatType.skills.includes('turnprotect')) {
            eggProt = eggProt+playerInfos.mapTurn-15;
            if (eggProt > 100) {eggProt = 100;}
            if (eggProt < 0) {eggProt = 0;}
        }
        totalDamage = Math.round(totalDamage*(100-eggProt)/100);
        if (playerInfos.comp.ca >= 2) {
            $('#report').append('<span class="report rose">Protection '+eggProt+'%<br></span>');
        }
        console.log('résistance dégâts!');
    }
    // munitions limitées
    console.log('maxAmmo'+selectedWeap.maxAmmo);
    ammoFired(selectedBat.id);
    if (selectedWeap.maxAmmo < 99) {
        selectedBat.tags.push('aU');
    }
    if (selectedWeap.noBis) {
        selectedBat.tags.push('noBis'+selectedWeap.num);
    }
    console.log('Previous Damage : '+targetBat.damage);
    console.log('Damage : '+totalDamage);
    $('#report').append('<span class="report vert bd">Dégâts: '+totalDamage+'<br></span>');
    // POST DAMAGE EFFECTS ----------------------------------------------------------------------------------------------------------
    if (tile.infra != undefined) {
        if (tile.infra === 'Miradors') {
            mirDestruction(selectedWeap,selectedBat,selectedBatType,tile,targetBat.team);
        }
    }
    // agrippeur
    if (selectedBatType.skills.includes('grip') && !targetBatType.skills.includes('zerogrip') && totalDamage >= 1 && (selectedBatType.size+3 >= targetBatType.size || selectedBatType.name == 'Androks')) {
        let gripbonus = 0;
        if (selectedBatType.name == 'Androks' || selectedBatType.name == 'Homards') {
            gripbonus = 40;
        }
        if (selectedBatType.name == 'Bourdons') {
            gripbonus = -20;
        }
        let gripFactor = 1;
        if (selectedBatType.skills.includes('eatpoison') && selectedBat.tags.includes('regeneration')) {
            gripFactor = 2;
        }
        let gripChance = ((selectedBat.squadsLeft*5)+gripbonus-(targetBat.vet*3))*gripFactor;
        if (targetBatType.cat != 'aliens') {
            gripChance = Math.ceil(gripChance/(playerInfos.comp.ca+5)*7);
        }
        if (rand.rand(1,100 <= gripChance)) {
            if (selectedBatType.skills.includes('tail')) {
                let tailDamage = 75-(targetBat.armor*3);
                if (tailDamage > targetBatType.hp*3) {
                    tailDamage = targetBatType.hp*3;
                }
                totalDamage = totalDamage+(tailDamage*selectedBat.squadsLeft*selectedBatType.squads);
            }
            let gripDiv = 1.25;
            if (selectedBatType.name != 'Androks') {
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
            } else {
                gripDiv = gripDiv-0.75;
            }
            let gripDamage = Math.round((selectedBat.squadsLeft+rand.rand(0,10)-5)*3/gripDiv);
            if (tile.infra != undefined) {
                let okCover = bonusInfra(targetBatType,tile.infra);
                if (okCover) {
                    if (selectedBatType.skills.includes('fly')) {
                        if (tile.infra === 'Miradors') {
                            gripDamage = Math.round(gripDamage*85/100);
                        } else if (tile.infra === 'Palissades') {
                            gripDamage = Math.round(gripDamage*85/100);
                        } else if (tile.infra === 'Remparts') {
                            gripDamage = Math.round(gripDamage*75/100);
                        } else if (tile.infra === 'Murailles') {
                            gripDamage = Math.round(gripDamage*65/100);
                        }
                    } else if (selectedBatType.skills.includes('sauteur')) {
                        if (tile.infra === 'Miradors') {
                            gripDamage = Math.round(gripDamage*40/100);
                        } else if (tile.infra === 'Palissades') {
                            gripDamage = Math.round(gripDamage*80/100);
                        } else if (tile.infra === 'Remparts') {
                            gripDamage = Math.round(gripDamage*65/100);
                        } else if (tile.infra === 'Murailles') {
                            gripDamage = Math.round(gripDamage*50/100);
                        }
                    } else {
                        if (tile.infra === 'Miradors') {
                            gripDamage = Math.round(gripDamage*30/100);
                        } else if (tile.infra === 'Palissades') {
                            gripDamage = Math.round(gripDamage*60/100);
                        } else if (tile.infra === 'Remparts') {
                            gripDamage = Math.round(gripDamage*45/100);
                        } else if (tile.infra === 'Murailles') {
                            gripDamage = Math.round(gripDamage*30/100);
                        }
                    }
                }
            }
            apDamage = apDamage+(gripDamage*gripFactor);
            console.log('Grip OK');
            $('#report').append('<span class="report rose">Agrippé<br></span>');
        } else {
            console.log('Grip raté');
        }
    }
    // creuseur
    let catOK = false;
    if (targetBatType.cat == 'buildings' || targetBatType.cat == 'vehicles') {
        if (targetBatType.size >= 10) {
            catOK = true;
        }
    }
    let trouOK = false;
    if (selectedWeap.ammo.includes('troueur') && totalDamage >= targetBat.armor*1.5) {
        trouOK = true;
    }
    if (selectedWeap.ammo.includes('acide') && totalDamage >= targetBat.armor*5) {
        trouOK = true;
    }
    if (trouOK && catOK) {
        if (!targetBat.tags.includes('trou')) {
            targetBat.tags.push('trou');
        }
        console.log('Trou percé!');
        $('#report').append('<span class="report rose">Blindage troué<br></span>');
    }
    // venin
    if (selectedBatType.skills.includes('venin') && totalDamage >= 1 && targetBat.apLeft < -2 && targetBatType.cat == 'infantry' && !targetBatType.skills.includes('resistpoison') && !targetBat.tags.includes('zombie')) {
        if (!targetBat.tags.includes('venin')) {
            targetBat.tags.push('venin');
        }
        console.log('Venin!');
        $('#report').append('<span class="report rose">Venin<br></span>');
    }
    // poison
    if (totalDamage >= 7+(playerInfos.comp.ca*2) || (totalDamage >= 1 && rand.rand(1,3) === 1)) {
        if (selectedWeap.ammo.includes('poison') || selectedWeap.ammo.includes('atium') || selectedWeap.ammo.includes('trap')) {
            if (!targetBatType.skills.includes('resistpoison') && !targetBatType.skills.includes('eatpoison') && !targetBat.tags.includes('zombie')) {
                if ((targetBatType.cat == 'infantry' && (!targetBatType.skills.includes('mutant') || playerInfos.comp.ca < 3)) || targetBatType.cat == 'aliens') {
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
                    let allTags = _.countBy(targetBat.tags);
                    $('#report').append('<span class="report rose">Poison ('+allTags.poison+')<br></span>');
                }
            }
            if (targetBatType.skills.includes('eatpoison') && !targetBat.tags.includes('regeneration')) {
                targetBat.tags.push('regeneration');
            }
        }
    }
    // Toxine veuve
    let poisonVeuve = 0;
    if (totalDamage >= 1+(playerInfos.comp.ca*2)) {
        if (selectedWeap.ammo.includes('toxine') && !targetBat.tags.includes('zombie')) {
            if (targetBatType.cat == 'infantry' || targetBatType.cat == 'aliens') {
                poisonVeuve = Math.ceil(totalDamage/(12+playerInfos.comp.ca));
                let i = 1;
                while (i <= poisonVeuve) {
                    targetBat.tags.push('poison');
                    if (i > 8) {break;}
                    i++
                }
                console.log('Toxine!');
                $('#report').append('<span class="report rose">Toxine<br></span>');
            }
        }
    }
    // shinda
    if (totalDamage >= 5 || (totalDamage >= 1 && rand.rand(1,2) === 1)) {
        if (selectedWeap.ammo.includes('shinda')) {
            if (targetBatType.skills.includes('mutant') || targetBatType.cat == 'aliens') {
                targetBat.tags.push('shinda');
                console.log('Shinda!');
                $('#report').append('<span class="report rose">Shinda<br></span>');
            }
        }
    }
    // freeze
    if (totalDamage >= 50 || totalDamage >= Math.round(targetBatType.hp*targetBatType.squadSize/2)) {
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
                $('#report').append('<span class="report rose">Freeze<br></span>');
            }
        }
    }
    // parasite
    if (totalDamage >= 1+(playerInfos.comp.ca*2) && selectedWeap.ammo.includes('parasite') && rand.rand(1,selectedBatType.squads) >= selectedBat.squadsLeft) {
        if (targetBatType.cat == 'infantry' || targetBatType.cat == 'aliens') {
            targetBat.tags.push('parasite');
            console.log('Parasite!');
            $('#report').append('<span class="report rose">Parasite<br></span>');
        }
    }
    // maladie
    let getDisease = checkDisease(selectedBatType,totalDamage,targetBat,targetBatType,terrain);
    if (getDisease) {
        targetBat.tags.push('maladie');
        console.log('Maladie!');
        $('#report').append('<span class="report rose">Maladie<br></span>');
    }
    // necrotoxine
    if (selectedWeap.ammo.includes('necro')) {
        if (!targetBat.tags.includes('necro')) {
            if (targetBatType.cat === 'infantry' && !targetBat.tags.includes('zombie')) {
                if (totalDamage >= 10+(playerInfos.comp.ca*2)) {
                    targetBat.tags.push('necro');
                    targetBat.tags.push('necro');
                    targetBat.tags.push('necro');
                    console.log('Nécrotoxine!');
                    $('#report').append('<span class="report rose">Nécrotoxine<br></span>');
                }
            }
        }
    }
    // escape notification
    if (escaped) {
        $('#report').append('<span class="report rose">Escape!<br></span>');
    }
    // Stun
    if (selectedWeap.ammo.includes('poraz') || selectedWeap.ammo.includes('disco') || selectedWeap.ammo === 'gaz') {
        targetBat.tags.push('stun');
        $('#report').append('<span class="report rose">Stun<br></span>');
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
    let allDamage = totalDamage+targetBat.damage;
    let squadHP = (targetBatType.squadSize*targetBatType.hp);
    console.log('Squad HP : '+squadHP);
    let squadsOut = Math.floor(allDamage/squadHP);
    targetBat.squadsLeft = targetBat.squadsLeft-squadsOut;
    targetBat.damage = allDamage-(squadsOut*squadHP);
    // instakill
    if (!targetBatType.skills.includes('nokill')) {
        if (selectedBat.tags.includes('kill') && selectedWeap.isPrec && totalDamage >= 30) {
            if (targetBatType.class === 'C' || targetBatType.class === 'B' || targetBatType.name === 'Veilleurs' || targetBatType.name === 'Vomissure' || targetBatType.name === 'Flaque') {
                targetBat.squadsLeft = 0;
            } else if (targetBatType.class === 'A' || targetBatType.class === 'S') {
                if (rand.rand(1,6) <= targetBatType.rarity) {
                    targetBat.squadsLeft = 0;
                }
            }
        }
    }
    // survivor
    if (targetBat.squadsLeft <= 0) {
        if ((targetBatType.skills.includes('survivor') || targetBat.eq === 'permakirin' || targetBat.logeq === 'permakirin') && !targetBat.tags.includes('lucky')) {
            targetBat.squadsLeft = 1;
            targetBat.apLeft = targetBat.ap;
            targetBat.tags.push('lucky');
            $('#report').append('<span class="report rose">Survivant!<br></span>');
        } else {
            if (zombifiedTiles.includes(targetBat.tileId) && !targetBat.tags.includes('zombie') && targetBatType.cat === 'infantry' && !targetBatType.skills.includes('clone') && !targetBatType.skills.includes('cyber')) {
                targetBat.squadsLeft = targetBatType.squads;
                targetBat.damage = 0;
                targetBat.xp = 150;
                targetBat.tags.push('zombie');
                $('#report').append('<span class="report rose">Zombifié!<br></span>');
            }
        }
    }
    console.log('Squads Out : '+squadsOut);
    if (squadsOut >= 1) {
        let deadUnits = targetBatType.squadSize*squadsOut;
        let unitsLeft = targetBatType.squadSize*targetBat.squadsLeft;
        $('#report').append('<span class="report cy">Unités: -'+deadUnits+'</span>');
        if (targetBat.squadsLeft >= 1) {
            $('#report').append('<span class="report"> (reste '+unitsLeft+' '+targetBatName+')<br></span>');
        }
    }
    if (targetBat.camoAP >= 1) {
        camoStop(targetBat);
    }
    console.log('Damage Left : '+targetBat.damage);
    targetBatArrayUpdate();
    // remove ap & salvo
    selectedBat.apLeft = selectedBat.apLeft-selectedWeap.cost;
    let heroSalveDice = rand.rand(1,2);
    if (selectedBat.tags.includes('tornade')) {
        // salves infinies
    } else if (selectedBat.tags.includes('hero') && selectedBatType.skills.includes('herosalvo') && !selectedBat.tags.includes('hsp')) {
        selectedBat.tags.push('hsp');
        if (rand.rand(1,2) === 1 && !selectedBat.tags.includes('rage') && !selectedBat.tags.includes('rush')) {
            selectedBat.salvoLeft = selectedBat.salvoLeft-1;
        }
    } else {
        selectedBat.salvoLeft = selectedBat.salvoLeft-1;
    }
    // add xp & remove life :)
    if (targetBat.squadsLeft <= 0) {
        defAlive = false;
        batDeath(targetBat,true);
        $('#report').append('<br><span class="report cy">Bataillon ('+targetBatName+') détruit<br></span>');
        if (!isFFW) {
            setTimeout(function (){
                setTimeout(function (){
                    batDeathEffect(targetBat,false,'','');
                }, soundDuration);
            }, 200);
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
    if (selectedWeap.ammo.includes('suicide') || selectedWeap.ammo.includes('autodestruction')) {
        attAlive = false;
        batDeath(selectedBat,true);
        $('#report').append('<br><span class="report cy">Bataillon ('+selectedBatName+') détruit<br></span>');
        if (!isFFW) {
            setTimeout(function (){
                setTimeout(function (){
                    batDeathEffect(selectedBat,false,'Bataillon détruit','Suicide');
                    $('#unitInfos').empty();
                    $("#unitInfos").css("display","none");
                }, soundDuration);
            }, 200);
        } else {
            batDeathEffect(selectedBat,false,'Bataillon détruit','Suicide');
        }
        $('#unitInfos').empty();
        $("#unitInfos").css("display","none");
    } else {
        if (squadsOut >= 1 && activeTurn == 'player') {
            if (!selectedBatType.skills.includes('robot') || selectedBat.eq === 'g2ai' || selectedBat.logeq === 'g2ai') {
                selectedBat.xp = selectedBat.xp+xpFactor;
                if (targetBatType.skills.includes('xpplus')) {
                    selectedBat.xp = selectedBat.xp+(xpFactor*1);
                }
                if (targetBatType.skills.includes('xpbonus')) {
                    selectedBat.xp = selectedBat.xp+(xpFactor*2);
                }
                if (targetBatType.skills.includes('xpfeast')) {
                    selectedBat.xp = selectedBat.xp+(xpFactor*5);
                }
            }
        }
    }
    doneAction(selectedBat);
    selectedBatArrayUpdate();
    escaped = false;
    if (selectedWeap.ammo.includes('-deluge')) {
        deluge(selectedWeap,delugeTileId,false);
    }
};

function defense(melee) {
    console.log('Défense ->');
    console.log(targetWeap);
    let selectedBatName = nomVisible(selectedBat.type);
    let targetBatName = nomVisible(targetBat.type);
    let xpFactor = Math.round(12/selectedBatType.maxSalvo/10);
    xpFactor = xpFactor.toFixedNumber(2);
    if (selectedBatType.maxSalvo >= 5) {
        xpFactor = 0.2;
    }
    $('#report').append('<span class="report or">'+targetBatName+' ('+targetWeap.name+')</span><br>');
    // Dans l'eau
    let terrain = getTerrain(selectedBat);
    let tile = getTile(selectedBat);
    let onGround = true;
    if (selectedBatType.skills.includes('fly') || tile.rd) {
        onGround = false;
    }
    let wetness = getWetness(terrain,onGround);
    if (wetness >= 1) {
        if (targetWeap.ammo.includes('feu') || targetWeap.ammo.includes('incendiaire') || targetWeap.ammo.includes('napalm') || targetWeap.ammo.includes('fire') || targetWeap.ammo.includes('lf-') || targetWeap.ammo.includes('lt-') || targetWeap.ammo.includes('molotov')) {
            if (!targetWeap.ammo.includes('pyratol')) {
                if (targetWeap.ammo.includes('incendiaire') || targetWeap.ammo.includes('fireshells')) {
                    targetWeap.power = Math.round(targetWeap.power*0.9);
                } else {
                    targetWeap.power = Math.round(targetWeap.power*0.8);
                }
                if (wetness >= 2) {
                    if (targetWeap.aoe === 'brochette') {
                        targetWeap.aoe = 'unit';
                    } else if (targetWeap.aoe === 'squad') {
                        targetWeap.aoe = 'brochette';
                    } else if (targetWeap.aoe === 'bat') {
                        targetWeap.aoe = 'squad';
                    }
                }
            }
        }
        if (targetWeap.ammo.includes('laser') || targetWeap.ammo.includes('gaz')) {
            if (wetness >= 3) {
                targetWeap.power = Math.round(targetWeap.power*0.8);
            }
        }
        if (!selectedBatType.skills.includes('resistelec') && !selectedBat.tags.includes('resistelec') && (!selectedBatType.skills.includes('hover') || selectedBatType.cat === 'aliens')) {
            if (targetWeap.ammo.includes('taser') || targetWeap.ammo.includes('electric')) {
                if (wetness >= 2) {
                    targetWeap.power = Math.round(targetWeap.power*1.35);
                    if (targetWeap.aoe === 'unit') {
                        targetWeap.aoe = 'brochette';
                    } else if (targetWeap.aoe === 'brochette') {
                        targetWeap.aoe = 'squad';
                    } else {
                        targetWeap.aoe = 'bat';
                    }
                } else if (wetness === 1 && selectedBatType.cat === 'aliens') {
                    targetWeap.power = Math.round(targetWeap.power*1.2);
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
    // Defense %
    let defFactor = Math.round(100*brideDef);
    // bigDef
    if (targetWeap.bigDef && selectedBatType.size >= 4) {
        targetWeap.power = Math.ceil(targetWeap.power+Math.sqrt(selectedBatType.size));
    }
    console.log('brideDef='+brideDef);
    let shots = Math.round(targetWeap.rof*targetBat.squadsLeft*brideDef);
    // undead
    if (targetBatType.skills.includes('undead') || targetBat.tags.includes('zombie')) {
        shots = Math.round(targetWeap.rof*targetBatType.squads*brideDef);
    }
    // hero fanatic
    if ((targetBat.tags.includes('hero') || targetBat.tags.includes('vet')) && targetBatType.skills.includes('herofana')) {
        shots = Math.round(targetWeap.rof*targetBatType.squads*brideDef);
    }
    // SCIES (noGrip)
    if (selectedWeap.noGrip && targetWeap.range === 0 && targetBatType.size >= 3) {
        shots = Math.round(shots/1.25);
        defFactor = Math.round(defFactor/1.25);
    }
    // ESCAPE
    escaped = false;
    let hasEscape = false;
    let escapeSpeed = selectedBatType.speed-2;
    if (selectedBatType.skills.includes('escape')) {
        hasEscape = true;
    }
    if (selectedBatType.skills.includes('heroescape') && selectedBat.tags.includes('hero')) {
        hasEscape = true;
        escapeSpeed = selectedBat.vet;
    }
    if (hasEscape && (targetBat.fuzz >= -1 || targetWeap.isMelee || targetWeap.isBow) && targetWeap.ammo.includes('laser')) {
        if ((tile.terrain != 'W' && tile.terrain != 'R') || selectedBatType.skills.includes('fly')) {
            let escapeChance = Math.round(escapeSpeed*targetWeap.cost*escapeValue);
            if (targetWeap.aoe != 'unit' && !selectedBatType.skills.includes('fly')) {
                escapeChance = Math.round(escapeChance/3);
            }
            console.log('escapeChance:'+escapeChance);
            if (rand.rand(1,100) <= escapeChance) {
                escaped = true;
                let escapeVar = rand.rand(4,8);
                console.log('escapeVar:'+escapeVar);
                shots = Math.round(shots*escapeVar/(targetWeap.cost+4)/2);
                defFactor = Math.round(defFactor*escapeVar/(targetWeap.cost+4)/2);
            }
        }
    }
    // bugROF
    if (bugROF > 1 && targetBatType.kind === 'bug') {
        shots = Math.round(shots*bugROF);
        defFactor = Math.round(defFactor*bugROF);
    }
    // spiderRG
    if (targetBatType.kind === 'spider') {
        if (spiderROF) {
            shots = Math.round(shots*1.5);
            defFactor = Math.round(defFactor*1.5);
        } else if (spiderRG) {
            shots = Math.round(shots*1.25);
            defFactor = Math.round(defFactor*1.25);
        }
    }
    // guerrilla
    if (selectedBatType.skills.includes('tirailleur') && selectedBat.oldTileId != selectedBat.tileId) {
        let guerrillaDef = 10+terrain.cover+(selectedBatType.stealth/5);
        if (selectedBatType.cat != 'aliens') {
            guerrillaDef = guerrillaDef+(playerInfos.comp.train*2)+(playerInfos.comp.cam/2);
        }
        shots = Math.round(shots*9/guerrillaDef);
        defFactor = Math.round(defFactor*9/guerrillaDef);
    }
    // Defense %
    $('#report').append('<span class="report jaune">Défense '+defFactor+'%<br></span>');
    // chargeur
    if (targetBat.eq.includes('chargeur') || targetBat.eq.includes('carrousel') || targetBat.logeq.includes('chargeur') || targetBat.logeq.includes('carrousel') || targetBat.eq.includes('kit-chouf') || targetBat.eq === 'crimekitch' || targetBat.eq === 'crimekitto' || targetBat.eq.includes('landerwkit') || targetBat.eq.includes('w2-l')) {
        shots = chargeurAdj(targetBat,shots,targetWeap);
    }
    $('#report').append('<span class="report">Puissance '+shots+' &times; '+targetWeap.power+'<br></span>');
    // INFRASTRUCTURES
    console.log('shots='+shots);
    if (activeTurn === 'player') {
        if (tile.infra != undefined) {
            let okCover = bonusInfra(selectedBatType,tile.infra);
            if (okCover) {
                let infraProtect = 0;
                if (tile.infra === 'Miradors') {
                    infraProtect = 25;
                } else if (tile.infra === 'Palissades') {
                    infraProtect = 33;
                } else if (tile.infra === 'Remparts') {
                    infraProtect = 45;
                } else if (tile.infra === 'Murailles') {
                    infraProtect = 60;
                }
                if (playerInfos.comp.def >= 3 && selectedBatType.skills.includes('garde')) {
                    infraProtect = infraProtect+(((100-infraProtect)*1.5)-(100-infraProtect));
                }
                if (targetBatType.skills.includes('sauteur') && !tile.infra === 'Miradors') {
                    infraProtect = Math.round(infraProtect/2);
                }
                if (targetBatType.skills.includes('fly')) {
                    infraProtect = Math.round((infraProtect-15)/2.5);
                }
                shots = Math.round(shots*(100-infraProtect)/100);
                $('#report').append('<span class="report rose">Protection '+infraProtect+'%<br></span>');
            }
        }
    }
    console.log(tile.infra+'+++++++++++++++++++++++');
    console.log('shots='+shots);
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
    if (playerInfos.pseudo === 'Test' || playerInfos.pseudo === 'Payall') {
        shotDice = 100;
    }
    // noBig
    if (targetWeap.noBig) {
        let weapPriorPower = targetWeap.power;
        if (selectedBatType.size > Math.round(targetBatType.size/2)) {
            targetWeap.power = Math.round(targetWeap.power*targetBatType.size/2/selectedBatType.size);
        } else if (Math.round(targetBatType.size/3) > selectedBatType.size) {
            targetWeap.power = Math.round(targetWeap.power*targetBatType.size/3/selectedBatType.size);
        }
        if (targetWeap.ammo === 'belier-spike') {
            targetWeap.power = targetWeap.power+Math.round(weapPriorPower/5)+10;
        }
    }
    // isShort range 0
    if (targetWeap.isShort && targetWeap.range >= 1 && melee) {
        targetWeap.accuracy = targetWeap.accuracy+5;
    }
    toHit = 999;
    let i = 1;
    while (i <= shots) {
        if (aoeShots >= 2) {
            // shotResult = blast(brochette,targetBatType,aoeShots,targetWeap,selectedBat,selectedBatType,shotDice);
            shotResult = blast(targetWeap,targetBat,targetBatType,selectedBat,selectedBatType,shotDice,brochette,aoeShots);
        } else {
            shotResult = shot(targetWeap,targetBat,targetBatType,selectedBat,selectedBatType,shotDice);
        }
        totalDamage = totalDamage+shotResult.damage;
        totalHits = totalHits+shotResult.hits;
        if (i > 5000) {break;}
        i++
    }
    $('#report').append('<br>');
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
            webDamage = Math.ceil(webDamage/(playerInfos.comp.ca+4)*6);
        }
        apDamage = apDamage+webDamage;
    }
    // arrosoir
    if (targetWeap.ammo.includes('fuel') && totalHits >= 1 && !selectedBat.tags.includes('inflammable')) {
        selectedBat.tags.push('inflammable');
        $('#report').append('<span class="report rose">Arrosé<br></span>');
    }
    // disco
    if (targetWeap.ammo.includes('disco')) {
        let webDamage = totalHits;
        webDamage = Math.ceil(webDamage*18/Math.sqrt(selectedBatType.hp)/10);
        apDamage = apDamage+webDamage;
    }
    // berserk (bonus damage des opposants)
    if (activeTurn === 'player') {
        if (selectedBatType.skills.includes('berserk') && selectedBat.damage >= 1) {
            totalDamage = Math.floor(totalDamage*berserkEnemyDamage);
            console.log('bonus prec berserk');
        }
    }
    // inflammable
    if (targetWeap.ammo.includes('feu') || targetWeap.ammo.includes('incendiaire') || targetWeap.ammo.includes('napalm') || targetWeap.ammo.includes('fire') || targetWeap.ammo.includes('pyratol') || targetWeap.ammo.includes('lf-') || targetWeap.ammo.includes('lt-') || targetWeap.ammo.includes('molotov') || targetWeap.ammo.includes('laser')) {
        if (selectedBatType.skills.includes('inflammable') || selectedBat.tags.includes('inflammable') || selectedBat.eq === 'e-jetpack') {
            let infactor = 2;
            if (targetWeap.ammo.includes('laser') || targetWeap.ammo === 'incendiaire' || targetWeap.ammo === 'ac-incendiaire' || targetWeap.ammo === 'sm-incendiaire' || targetWeap.ammo === 'fleche-incendiaire') {
                infactor = 1.5;
            }
            if (selectedBat.tags.includes('resistfeu') && selectedBatType.cat != 'aliens') {
                infactor = 1;
            } else if (selectedBatType.skills.includes('resistfeu') || selectedBat.tags.includes('resistfeu')) {
                infactor = Math.round(infactor/1.25);
            }
            let infbonus = 0;
            if (selectedBat.tags.includes('inflammable')) {
                if (selectedBatType.skills.includes('inflammable')) {
                    infactor = 5;
                    infbonus = rand.rand(180,320);
                } else {
                    infactor = 3;
                    infbonus = rand.rand(130,240);
                }
            }
            totalDamage = Math.round(totalDamage*infactor)+infbonus;
            if (infactor > 1 || infbonus > 0) {
                $('#report').append('<span class="report rose">Inflammable x'+infactor+'<br></span>');
                console.log('inflammable!');
            }
        }
    }
    // résistance au feu
    if (targetWeap.ammo.includes('feu') || targetWeap.ammo.includes('incendiaire') || targetWeap.ammo.includes('napalm') || targetWeap.ammo.includes('fire') || targetWeap.ammo.includes('pyratol') || targetWeap.ammo.includes('lf-') || targetWeap.ammo.includes('lt-') || targetWeap.ammo.includes('molotov') || targetWeap.ammo.includes('laser')) {
        if (selectedBatType.skills.includes('resistfeu') || selectedBat.tags.includes('resistfeu')) {
            if (selectedBatType.cat === 'aliens') {
                totalDamage = Math.round(totalDamage/3);
                apDamage = Math.round(apDamage/3);
                if (playerInfos.comp.ca >= 2) {
                    $('#report').append('<span class="report rose">Résistance au feu 67%<br></span>');
                }
            } else {
                totalDamage = Math.round(totalDamage/1.5);
                apDamage = Math.round(apDamage/1.5);
                $('#report').append('<span class="report rose">Résistance au feu 33%<br></span>');
            }
            console.log('résistance au feu!');
        }
    }
    // résistance électricité
    if (selectedBatType.skills.includes('resistelec') || selectedBat.tags.includes('resistelec')) {
        if (targetWeap.ammo.includes('electric') || targetWeap.ammo.includes('taser')) {
            totalDamage = Math.round(totalDamage/2);
            apDamage = Math.round(apDamage/4);
            if (playerInfos.comp.ca >= 2) {
                $('#report').append('<span class="report rose">Résistance aux décharges 50%<br></span>');
            }
            console.log('résistance électricité!');
        }
    }
    // résistance blast
    if (selectedBatType.skills.includes('resistblast') || selectedBat.tags.includes('resistblast')) {
        if (targetWeap.ammo.includes('nanite') || targetWeap.ammo.includes('suicide') || targetWeap.ammo.includes('mine') || targetWeap.ammo.includes('autodestruction') || targetWeap.ammo.includes('dynamite') || targetWeap.ammo.includes('bombe') || targetWeap.ammo.includes('explosif') || targetWeap.ammo.includes('explosive') || targetWeap.ammo.includes('obus') || targetWeap.ammo.includes('missile') || targetWeap.ammo.includes('grenade') || targetWeap.ammo.includes('disco')) {
            if (!targetWeap.ammo.includes('gaz') && !targetWeap.ammo.includes('incendiaire') && !targetWeap.ammo.includes('napalm')) {
                if (targetWeap.ammo.includes('explosive')) {
                    totalDamage = Math.round(totalDamage/1.34);
                    apDamage = Math.round(apDamage/1.34);
                    if (playerInfos.comp.ca >= 2) {
                        $('#report').append('<span class="report rose">Résistance aux secousses 25%<br></span>');
                    }
                } else {
                    totalDamage = Math.round(totalDamage/2);
                    apDamage = Math.round(apDamage/2);
                    if (playerInfos.comp.ca >= 2) {
                        $('#report').append('<span class="report rose">Résistance aux secousses 50%<br></span>');
                    }
                }
                console.log('résistance au blast!');
            }
        }
    }
    // sensibilité blast
    if (selectedBatType.skills.includes('reactblast') || selectedBat.tags.includes('reactblast')) {
        if (targetWeap.ammo.includes('nanite') || targetWeap.ammo.includes('suicide') || targetWeap.ammo.includes('mine') || targetWeap.ammo.includes('autodestruction') || targetWeap.ammo.includes('dynamite') || targetWeap.ammo.includes('bombe') || targetWeap.ammo.includes('explosif') || targetWeap.ammo.includes('obus') || targetWeap.ammo.includes('missile') || targetWeap.ammo.includes('grenade') || targetWeap.ammo.includes('disco')) {
            if (!targetWeap.ammo.includes('gaz') && !targetWeap.ammo.includes('incendiaire') && !targetWeap.ammo.includes('napalm')) {
                totalDamage = Math.round(totalDamage*1.5);
                apDamage = Math.round(apDamage*1.5);
                if (playerInfos.comp.ca >= 3) {
                    $('#report').append('<span class="report rose">Sensibilité aux secousses<br></span>');
                }
                console.log('sensibilité au blast!');
            }
        }
    }
    // résistance poison (gaz)
    if (selectedBatType.skills.includes('resistpoison') || selectedBatType.skills.includes('eatpoison') || selectedBat.tags.includes('resistpoison')) {
        if (targetWeap.ammo.includes('gaz')) {
            if (selectedBatType.skills.includes('eatpoison')) {
                totalDamage = 0;
                apDamage = 0;
                if (!selectedBat.tags.includes('regeneration')) {
                    selectedBat.tags.push('regeneration');
                }
                if (playerInfos.comp.ca >= 3) {
                    $('#report').append('<span class="report rose">Résistance au poison 100%<br></span>');
                }
            } else {
                totalDamage = Math.round(totalDamage/2);
                apDamage = Math.round(apDamage/2);
                if (playerInfos.comp.ca >= 3) {
                    $('#report').append('<span class="report rose">Résistance au poison 50%<br></span>');
                }
            }
            console.log('résistance au gaz!');
        }
    }
    // sensibilité poison (gaz)
    if (selectedBatType.skills.includes('reactpoison') || selectedBat.tags.includes('reactpoison')) {
        if (targetWeap.ammo.includes('gaz')) {
            totalDamage = Math.round(totalDamage*2);
            apDamage = Math.round(apDamage*2);
            if (playerInfos.comp.ca >= 3) {
                $('#report').append('<span class="report rose">Sensibilité au poison x2<br></span>');
            }
            console.log('sensibilité au gaz!');
        }
    }
    // résistance acide
    if (targetWeap.name.includes('acide') || targetWeap.ammo.includes('ruche')) {
        if (selectedBatType.skills.includes('resistacide') || selectedBat.tags.includes('resistacide')) {
            totalDamage = Math.round(totalDamage/1.5);
            apDamage = Math.round(apDamage/1.5);
            if (playerInfos.comp.ca >= 2) {
                $('#report').append('<span class="report rose">Résistance à l\'acide 33%<br></span>');
            }
            console.log('résistance acide!');
        }
    }
    // résistance all
    if (selectedBatType.skills.includes('resistall') || selectedBat.tags.includes('resistall')) {
        if (selectedBatType.cat === 'aliens') {
            totalDamage = Math.round(totalDamage/1.5);
            if (playerInfos.comp.ca >= 2) {
                $('#report').append('<span class="report rose">Protection 33%<br></span>');
            }
        } else {
            totalDamage = Math.round(totalDamage/1.25);
            $('#report').append('<span class="report rose">Protection 20%<br></span>');
        }
    }
    // ricochet
    let rico = checkRicochet(selectedBat,selectedBatType,targetWeap);
    if (rico) {
        totalDamage = 0;
        apDamage =0;
        $('#report').append('<span class="report rose">Ricochet<br></span>');
    }
    // infkill
    if (targetBatType.skills.includes('infkill') && selectedBatType.cat != 'infantry') {
        totalDamage = Math.round(totalDamage/2);
    }
    // resistance oeufs
    if (selectedBatType.skills.includes('eggprotect')) {
        let eggProt = 100-Math.round(1000/(10+((zone[0].mapDiff-1)*2.5)));
        if (selectedBatType.skills.includes('turnprotect')) {
            eggProt = eggProt+playerInfos.mapTurn-15;
            if (eggProt > 100) {eggProt = 100;}
            if (eggProt < 0) {eggProt = 0;}
        }
        totalDamage = Math.round(totalDamage*(100-eggProt)/100);
        if (playerInfos.comp.ca >= 2) {
            $('#report').append('<span class="report rose">Protection '+eggProt+'%<br></span>');
        }
        console.log('résistance dégâts!');
    }
    // munitions limitées
    console.log('maxAmmo'+targetWeap.maxAmmo);
    ammoFired(targetBat.id);
    if (targetWeap.maxAmmo < 99) {
        targetBat.tags.push('aU');
    }
    console.log('Damage : '+totalDamage);
    $('#report').append('<span class="report vert bd">Dégâts: '+totalDamage+'<br></span>');
    // POST DAMAGE EFFECTS ----------------------------------------------------------------------------------------------------------
    if (tile.infra != undefined) {
        if (tile.infra === 'Miradors') {
            mirDestruction(targetWeap,targetBat,targetBatType,tile,selectedBat.team);
        }
    }
    // poison
    if (totalDamage >= 7+(playerInfos.comp.ca*2) || (totalDamage >= 1 && rand.rand(1,3) === 1)) {
        if (targetWeap.ammo.includes('poison') || targetWeap.ammo.includes('atium') || targetWeap.ammo.includes('trap')) {
            if (!selectedBatType.skills.includes('resistpoison') && !selectedBatType.skills.includes('eatpoison') && !selectedBat.tags.includes('zombie')) {
                if ((selectedBatType.cat == 'infantry' && (!selectedBatType.skills.includes('mutant') || playerInfos.comp.ca < 3)) || selectedBatType.cat == 'aliens') {
                    selectedBat.tags.push('poison');
                    if (targetWeap.ammo.includes('atium')) {
                        selectedBat.tags.push('poison');
                        selectedBat.tags.push('poison');
                    }
                    if (targetWeap.ammo.includes('trap')) {
                        selectedBat.tags.push('poison');
                    }
                    console.log('Poison!');
                    let allTags = _.countBy(selectedBat.tags);
                    $('#report').append('<span class="report rose">Poison ('+allTags.poison+')<br></span>');
                }
            }
            if (selectedBatType.skills.includes('eatpoison') && !selectedBat.tags.includes('regeneration')) {
                selectedBat.tags.push('regeneration');
            }
        }
    }
    // shinda
    if (totalDamage >= 5 || (totalDamage >= 1 && rand.rand(1,2) === 1)) {
        if (targetWeap.ammo.includes('shinda')) {
            if (selectedBatType.skills.includes('mutant') || selectedBatType.cat == 'aliens') {
                selectedBat.tags.push('shinda');
                console.log('Shinda!');
                $('#report').append('<span class="report rose">Shinda<br></span>');
            }
        }
    }
    // freeze
    if (totalDamage >= 50 || totalDamage >= Math.round(selectedBatType.hp*selectedBatType.squadSize/2)) {
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
                $('#report').append('<span class="report rose">Freeze<br></span>');
            }
        }
    }
    // parasite
    if (totalDamage >= 20+(playerInfos.comp.ca*2) && targetWeap.ammo.includes('parasite') && rand.rand(1,targetBatType.squads) >= targetBat.squadsLeft) {
        if (selectedBatType.cat == 'infantry' || selectedBatType.cat == 'aliens') {
            selectedBat.tags.push('parasite');
            console.log('Parasite!');
            $('#report').append('<span class="report rose">Parasite<br></span>');
        }
    }
    // maladie
    let getDisease = checkDisease(targetBatType,totalDamage,selectedBat,selectedBatType,terrain);
    if (getDisease) {
        selectedBat.tags.push('maladie');
        console.log('Maladie!');
        $('#report').append('<span class="report rose">Maladie<br></span>');
    }
    // necrotoxine
    if (targetWeap.ammo.includes('necro')) {
        if (!selectedBat.tags.includes('necro')) {
            if (selectedBatType.cat == 'infantry' && !selectedBat.tags.includes('zombie')) {
                if (totalDamage >= 10+(playerInfos.comp.ca*2)) {
                    selectedBat.tags.push('necro');
                    selectedBat.tags.push('necro');
                    selectedBat.tags.push('necro');
                    console.log('Nécrotoxine!');
                    $('#report').append('<span class="report rose">Nécrotoxine<br></span>');
                }
            }
        }
    }
    // escape notification
    if (escaped) {
        $('#report').append('<span class="report rose">Escape!<br></span>');
    }
    // Stun
    if (targetWeap.ammo.includes('poraz') || targetWeap.ammo.includes('disco') || targetWeap.ammo === 'gaz') {
        selectedBat.tags.push('stun');
        $('#report').append('<span class="report rose">Stun<br></span>');
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
    let allDamage = totalDamage+selectedBat.damage;
    let squadHP = (selectedBatType.squadSize*selectedBatType.hp);
    console.log('Squad HP : '+squadHP);
    let squadsOut = Math.floor(allDamage/squadHP);
    selectedBat.squadsLeft = selectedBat.squadsLeft-squadsOut;
    selectedBat.damage = allDamage-(squadsOut*squadHP);
    // survivor
    console.log('Squads left: '+selectedBat.squadsLeft);
    if (selectedBat.squadsLeft <= 0) {
        console.log('dead');
        if (!selectedBat.tags.includes('lucky') && (selectedBatType.skills.includes('survivor') || selectedBat.eq === 'permakirin' || selectedBat.logeq === 'permakirin')) {
            selectedBat.squadsLeft = 1;
            selectedBat.apLeft = selectedBat.ap;
            selectedBat.tags.push('lucky');
            $('#report').append('<span class="report rose">Survivant!<br></span>');
        } else {
            if (zombifiedTiles.includes(selectedBat.tileId) && !selectedBat.tags.includes('zombie') && selectedBatType.cat === 'infantry' && !selectedBatType.skills.includes('clone') && !selectedBatType.skills.includes('cyber')) {
                console.log('undead');
                selectedBat.squadsLeft = selectedBatType.squads;
                selectedBat.damage = 0;
                selectedBat.xp = 150;
                selectedBat.tags.push('zombie');
                $('#report').append('<span class="report rose">Zombifié!<br></span>');
            }
        }
    }
    console.log('Squads Out : '+squadsOut);
    if (squadsOut >= 1) {
        let deadUnits = selectedBatType.squadSize*squadsOut;
        let unitsLeft = selectedBatType.squadSize*selectedBat.squadsLeft;
        $('#report').append('<span class="report cy">Unités: -'+deadUnits+'</span>');
        if (selectedBat.squadsLeft >= 1) {
            $('#report').append('<span class="report"> (reste '+unitsLeft+' '+selectedBatName+')<br></span>');
        }
    }
    console.log('Damage Left : '+selectedBat.damage);
    selectedBatArrayUpdate();
    if (selectedBat.squadsLeft <= 0) {
        attAlive = false;
        batDeath(selectedBat,true);
        $('#report').append('<br><span class="report cy">Bataillon ('+selectedBatName+') détruit<br></span>');
        if (!isFFW) {
            setTimeout(function (){
                setTimeout(function (){
                    batDeathEffect(selectedBat,false,'','');
                }, soundDuration);
            }, 200);
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
    if (squadsOut >= 1 && activeTurn === 'aliens') {
        if (!targetBatType.skills.includes('robot') || targetBat.eq === 'g2ai' || targetBat.logeq === 'g2ai') {
            targetBat.xp = targetBat.xp+xpFactor;
            if (selectedBatType.skills.includes('xpplus')) {
                targetBat.xp = targetBat.xp+(xpFactor*1);
            }
            if (selectedBatType.skills.includes('xpbonus')) {
                targetBat.xp = targetBat.xp+(xpFactor*2);
            }
            if (selectedBatType.skills.includes('xpfeast')) {
                targetBat.xp = targetBat.xp+(xpFactor*5);
            }
        }
    }
    // doneAction(targetBat);
    targetBatArrayUpdate();
    escaped = false;
};
