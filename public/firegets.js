function seveso(tileId,fromMissile) {
    console.log('SEVESO tile '+tileId);
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            let batType = getBatType(bat);
            if (!batType.skills.includes('resistpoison') && !batType.skills.includes('eatpoison')) {
                if (bat.tileId != tileId) {
                    let distance = calcDistance(bat.tileId,tileId);
                    if (distance <= 1) {
                        bat.tags.push('poison');
                        if (bat.apLeft >= 1) {
                            bat.apLeft = Math.floor(bat.apLeft/3);
                        }
                        bat.apLeft = bat.apLeft-8;
                        if (fromMissile != 'no') {
                            bat.tags.push('poison');
                            bat.tags.push('poison');
                            bat.apLeft = bat.apLeft-8;
                            if (fromMissile === 'flit') {
                                if (!bat.tags.includes('shinda')) {
                                    bat.tags.push('shinda');
                                }
                                bat.apLeft = bat.apLeft-8;
                            }
                            if (batType.class === 'C' || batType.class === 'B' || batType.class === 'Z') {
                                bat.squadsLeft = bat.squadsLeft-1;
                                if (bat.squadsLeft === 0) {
                                    bat.squadsLeft = 1;
                                }
                            }
                        }
                    }
                }
            }
            if (batType.skills.includes('eatpoison')) {
                if (!bat.tags.includes('regeneration')) {
                    bat.tags.push('regeneration');
                }
            }
        }
    });
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            let batType = getBatType(bat);
            if (!bat.tags.includes('zombie') && batType.cat === 'infantry') {
                if (bat.tileId != tileId) {
                    let distance = calcDistance(bat.tileId,tileId);
                    if (distance <= 1) {
                        bat.tags.push('poison');
                        if (bat.apLeft >= 1) {
                            bat.apLeft = Math.floor(bat.apLeft/3);
                        }
                        bat.apLeft = bat.apLeft-8;
                        if (fromMissile != 'no') {
                            bat.tags.push('poison');
                            bat.tags.push('poison');
                            bat.apLeft = bat.apLeft-8;
                            bat.squadsLeft = bat.squadsLeft-1;
                            if (bat.squadsLeft === 0) {
                                bat.squadsLeft = 1;
                            }
                        }
                    }
                }
            }
        }
    });
};

function deluge(weap,tileId,onlyAround) {
    console.log('DELUGE tile '+tileId);
    deadBatsList = [];
    deadAliensList = [];
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            let inDeluge = false;
            let batType = getBatType(bat);
            if (!batType.skills.includes('fly') || bat.apLeft < 5) {
                if (bat.tileId === tileId) {
                    if (!onlyAround) {
                        inDeluge = true;
                    }
                } else {
                    let distance = calcDistance(bat.tileId,tileId);
                    if (distance <= 1) {
                        inDeluge = true;
                    }
                }
            }
            if (inDeluge) {
                let batType = getBatType(bat);
                delugeDamage(weap,bat,batType);
            }
        }
    });
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            let inDeluge = false;
            if (bat.tileId === tileId) {
                if (!onlyAround) {
                    inDeluge = true;
                }
            } else {
                let distance = calcDistance(bat.tileId,tileId);
                if (distance <= 1) {
                    inDeluge = true;
                }
            }
            let batType = getBatType(bat);
            if (batType.skills.includes('fly') && !batType.skills.includes('jetpack')) {
                if (bat.apLeft > -5) {
                    inDeluge = false;
                }
            }
            if (batType.skills.includes('jetpack') || bat.eq === 'e-jetpack') {
                if (bat.apLeft > 0) {
                    inDeluge = false;
                }
            }
            if (inDeluge) {
                let batType = getBatType(bat);
                delugeDamage(weap,bat,batType);
            }
        }
    });
    killBatList();
    killAlienList();
    showMap(zone,false);
};

function delugeDamage(weap,bat,batType) {
    // console.log(batType.name);
    let numUnits = 60;
    if (bat.team === 'aliens') {
        let batHP = batType.hp-3.5;
        if (batHP < 1.5) {
            batHP = 1.5;
        }
        numUnits = Math.round(batType.squadSize*batType.squads*Math.sqrt(batHP)/1.22);
    } else {
        numUnits = Math.round(batType.squadSize*batType.squads*Math.sqrt(batType.size)/1.7);
    }
    // console.log('numUnits='+numUnits);
    let baseDmg = Math.ceil((weap.power+15)*numUnits/75);
    let stormDmg = rand.rand(10*baseDmg,16*baseDmg);
    if (weap.ammo.includes('suicide')) {
        stormDmg = stormDmg*6;
    }
    if (weap.ammo.includes('missile')) {
        stormDmg = stormDmg*3;
    }
    // let stormDmg = 13*baseDmg;
    // console.log('stormDmg='+stormDmg);
    stormDmg = Math.ceil(stormDmg/Math.sqrt(bat.armor+1));
    // console.log('stormDmg(a)='+stormDmg);
    if (!weap.ammo.includes('suicide')) {
        if (batType.skills.includes('resistfeu') || bat.tags.includes('resistfeu')) {
            if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack') {
                stormDmg = Math.ceil(stormDmg/1.25);
            } else {
                stormDmg = Math.ceil(stormDmg/1.67);
            }
        } else {
            if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack') {
                stormDmg = Math.ceil(stormDmg*2);
            }
        }
    }
    if (batType.skills.includes('protectall') || bat.tags.includes('protectall')) {
        stormDmg = Math.ceil(stormDmg/2);
    } else if (batType.skills.includes('resistall') || bat.tags.includes('resistall')) {
        stormDmg = Math.ceil(stormDmg/1.5);
    }
    if (batType.skills.includes('resistblast') || bat.tags.includes('resistblast')) {
        stormDmg = Math.ceil(stormDmg/1.25);
    } else if (batType.skills.includes('reactblast') || bat.tags.includes('reactblast')) {
        stormDmg = Math.ceil(stormDmg*2);
    }
    // console.log('stormDmg(T)='+stormDmg);
    let totalDamage = bat.damage+stormDmg;
    let squadHP = batType.squadSize*batType.hp;
    let squadsOut = Math.floor(totalDamage/squadHP);
    bat.squadsLeft = bat.squadsLeft-squadsOut;
    bat.damage = totalDamage-(squadsOut*squadHP);
    if (bat.squadsLeft <= 0) {
        if (weap.ammo.includes('suicide')) {
            batDeathEffect(bat,true,false,'Bataillon détruit',bat.type+' volatilisé.');
        } else {
            batDeathEffect(bat,true,false,'>Bataillon détruit',bat.type+' brûlé.');
        }
        checkDeath(bat,batType,false);
    }
}

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

function isHit(accuracy,minAccu,weapon,attBat,attBatType,defBat,defBatType,stealth,cover,speed,shotDice) {
    let prec = accuracy;
    let megaPrec = 0;
    if (defBatType.size <= 4 && prec > 35 && weapon.aoe == 'unit') {
        megaPrec = Math.sqrt(prec-35);
    }
    let overPrec = 0;
    if (defBatType.size <= 4 && prec > 30 && weapon.aoe == 'unit') {
        overPrec = prec-30;
        prec = prec+overPrec;
    }
    prec = Math.round(prec-(stealth/(2+overPrec))-(speed/(1+overPrec)));
    prec = Math.round(prec-(cover*coverFactor*2/(2+megaPrec)));
    if (prec < minPrec) {
        prec = minPrec;
    }
    if (prec < minAccu) {
        prec = minAccu;
    }
    // tir ciblé
    if (attBat.tags.includes('vise') && weapon.isPrec && attBat.id === selectedBat.id) {
        let tcBonus = calcCibleBonus(attBatType);
        prec = Math.round(prec*tcBonus.prec);
    }
    // double attaque
    if (attBat.tags.includes('datt') && !weapon.isPrec && !weapon.isBow && !weapon.noBis && !weapon.noDatt && attBat.id === selectedBat.id) {
        let dattSize = Math.round(Math.sqrt(defBatType.size));
        if (dattSize > 5) {
            dattSize = 5;
        }
        prec = Math.round(prec*dattSize/5);
    }
    let dice = rand.rand(1,shotDice);
    let hitChance = Math.round(Math.sqrt(defBatType.size)*prec);
    // aoe : more chance than normal to hit small creatures
    if (weapon.aoe != 'unit' && weapon.aoe != 'brochette' && defBatType.size < 10) {
        hitChance = Math.round(Math.sqrt(10)*prec);
    }
    // bonus général
    if (attBat.tags.includes('datt') && attBat.id === selectedBat.id) {
        hitChance = hitChance+Math.floor(hitBase/2);
        if (hitChance < Math.ceil(defBatType.size/2)) {
            hitChance = Math.ceil(defBatType.size/2);
        }
    } else {
        hitChance = hitChance+hitBase;
        if (hitChance < defBatType.size) {
            hitChance = defBatType.size;
        }
    }
    if (hitChance > 89) {
        hitChance = Math.floor(Math.sqrt(hitChance-89)+89);
    }
    if (toHit === 999) {
        toHit = hitChance;
        console.log('accuracy='+accuracy+' minAccu='+minAccu+' stealth='+stealth+' cover='+cover+' speed='+speed+' shotDice='+shotDice);
        $('#report').append('<span class="report">Précision '+prec+' >> '+hitChance+'%</span><br><span class="report">Dégâts: </span>');
        // console.log('hitChance '+hitChance);
    }
    if (dice > hitChance) {
        return false;
    } else {
        return true;
    }
};

function combatReport() {
    $('#report').append(report);
    report = '';
};

function calcShotsRangeAdj(weapon,attBat,attBatType,defBat,defBatType) {
    // let shotsPerc = Math.round(5.56*Math.sqrt(playerInfos.comp.ca+2)*(playerInfos.comp.energ+6));
    let shotsPerc = 100;
    let distance = calcDistance(attBat.tileId,defBat.tileId);
    if (weapon.ammo.includes('disco')) {
        shotsPerc = shotsPerc-(distance*25);
    }
    if (!weapon.name.includes('Missile')) {
        if (weapon.ammo.includes('suicide-deluge')) {
            shotsPerc = shotsPerc-(distance*12);
        } else if (weapon.ammo.includes('suicide')) {
            shotsPerc = shotsPerc-(distance*50);
        }
    }
    if (weapon.name.includes('Psio')) {
        if (attBatType.skills.includes('boss')) {
            shotsPerc = shotsPerc-Math.round(distance*3);
        } else {
            shotsPerc = shotsPerc-Math.round(distance*7.5);
        }
    }
    // console.log('shotsPerc !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    // console.log(shotsPerc);
    return shotsPerc;
};

function calcPrecRangeAdj(weapon,attBat,attBatType,defBat,defBatType) {
    let accurange = 0;
    let distance = calcDistance(attBat.tileId,defBat.tileId);
    if (distance === 0) {
        if (attBatType.team === 'player') {
            if (weapon.range === 0) {
                if (weapon.isMelee || weapon.noShield) {
                    if (!defBatType.weapon.isMelee) {
                        accurange = accurange-3;
                    }
                }
            } else {
                if (weapon.isShort && weapon.range >= 1) {
                    accurange = accurange+5;
                }
            }
        }
    } else if (distance >= 2 && weapon.range >= 3) {
        if (weapon.aoe === 'unit' || weapon.aoe === 'brochette') {
            let idealDist = weapon.range*3/2;
            accurange = accurange+Math.round((idealDist-distance)*4);
            if (weapon.aoe === 'brochette') {
                accurange = Math.round(accurange/2);
            }
        }
    }
    return accurange;
};

function shot(weapon,attBat,attBatType,defBat,defBatType,shotDice,accurange) {
    // returns damage
    let result = {damage:0,hits:0};
    let cover = getCover(defBat,true,false);
    if (weapon.isMelee || weapon.noShield || attBatType.skills.includes('halfcover')) {
        cover = Math.round(cover/2);
    }
    let stealth = getStealth(defBat);
    // skupiac drug
    let defBatSpeed = defBatType.speed;
    if (defBat.tags.includes('skupiac')) {
        defBatSpeed = defBatSpeed+3;
    }
    // Pièges
    if (weapon.name.includes('Dart') || weapon.name.includes('Pieu') || weapon.name.includes('Barbelés') || weapon.name === 'Explosifs' || weapon.name === 'Explosion') {
        stealth = 0;
        if (defBatType.skills.includes('invisible') || defBatType.skills.includes('hide')) {
            defBatSpeed = 0;
        }
    }
    let weapAccu = weapon.accuracy+accurange;
    // fly
    if (defBatType.skills.includes('fly')) {
        weapAccu = weapAccu*weapon.dca;
    }
    // marquage
    if (defBat.tags.includes('fluo')) {
        weapAccu = weapAccu*1.5;
    }
    weapAccu = Math.ceil(weapAccu);
    // minaccu
    let minAccu = 0;
    if (attBatType.skills.includes('minaccu')) {
        minAccu = Math.ceil(weapon.accuracy/2);
    }
    if (isHit(weapAccu,minAccu,weapon,attBat,attBatType,defBat,defBatType,stealth,cover,defBatSpeed,shotDice)) {
        if (weapon.power >= 1) {
            result.damage = calcDamage(weapon,weapon.power,defBat.armor,defBat);
        } else {
            result.damage = 0;
        }
        result.hits = 1;
        if (result.damage > defBatType.hp) {
            result.damage = defBatType.hp;
        }
        if (result.damage < 0) {
            result.damage = 0;
        }
        $('#report').append('<span class="report">'+result.damage+' </span>');
    }
    return result;
};

function blast(weapon,attBat,attBatType,defBat,defBatType,shotDice,brochette,aoeShots,accurange) {
    // returns damage
    // console.log('aoeShots = '+aoeShots);
    // console.log('brochette='+brochette);
    // console.log('weapon.aoe='+weapon.aoe);
    let result = {damage:0,hits:0};
    let newDamage = 0;
    let power = weapon.power;
    let oldPower = weapon.power;
    let forAOE = true;
    if (brochette) {
        forAOE = false;
    }
    let cover = getCover(defBat,true,forAOE);
    if (cover >= 1) {
        if (weapon.isMelee || weapon.noShield || attBatType.skills.includes('halfcover')) {
            cover = Math.round(cover/2);
        }
    }
    let stealth = getStealth(defBat);
    if (stealth >= 1) {
        if (weapon.aoe === 'bat') {
            stealth = 0;
        } else if (weapon.aoe === 'squad') {
            stealth = Math.round(stealth/3);
        }
    }
    // skupiac drug
    let defBatSpeed = defBatType.speed;
    if (defBat.tags.includes('skupiac')) {
        defBatSpeed = defBatSpeed+3;
    }
    // Pièges
    if (weapon.name.includes('Dart') || weapon.name.includes('Pieu') || weapon.name.includes('Barbelés') || weapon.name === 'Explosifs' || weapon.name === 'Explosion') {
        stealth = 0;
        if (defBatType.skills.includes('invisible') || defBatType.skills.includes('hide')) {
            defBatSpeed = 0;
        }
    }
    let weapAccu = weapon.accuracy+accurange;
    // fly
    if (defBatType.skills.includes('fly')) {
        weapAccu = Math.round(weapAccu*weapon.dca);
    }
    // minaccu
    let minAccu = 0;
    if (attBatType.skills.includes('minaccu')) {
        minAccu = Math.ceil(weapon.accuracy/2);
    }
    // spread damage reductor
    let squadReductor = 0.9;
    if (defBat.armor >= 1) {
        let adjArmor = defBat.armor;
        if (defBatType.cat === 'infantry') {
            adjArmor = adjArmor*3;
        } else if (defBatType.cat === 'vehicles') {
            adjArmor = adjArmor+6;
        }
        if (weapon.isGas) {
            adjArmor = Math.floor(adjArmor/2);
        } else if (defBatType.skills.includes('ricochet') && !brochette && !weapon.isFire) {
            adjArmor = Math.floor((adjArmor+30)/2);
        }
        if (adjArmor >= 10) {
            squadReductor = 2.55/Math.sqrt(adjArmor);
        } else {
            squadReductor = 0.91-(adjArmor/120);
        }
        if (squadReductor > 0.9) {
            squadReductor = 0.9;
        }
        squadReductor = squadReductor.toFixedNumber(2);
    }
    // console.log('!!!!!!!!!!!!!!!!!!!!!squadReductor='+squadReductor);
    let ii = 1;
    while (ii <= aoeShots) {
        // console.log('power'+power);
        if (isHit(weapAccu,minAccu,weapon,attBat,attBatType,defBat,defBatType,stealth,cover,defBatSpeed,shotDice)) {
            if (weapon.power >= 1) {
                newDamage = calcDamage(weapon,power,defBat.armor,defBat);
            } else {
                newDamage = 0;
            }
            result.hits = result.hits+1;
            if (newDamage > defBatType.hp) {
                newDamage = defBatType.hp;
            }
            if (newDamage < 0) {
                newDamage = 0;
            }
            result.damage = result.damage+newDamage;
        }
        if (ii > 100) {break;}
        oldPower = power;
        if (!brochette) {
            power = Math.round(power*squadReductor);
        } else {
            power = Math.round(power*0.5);
        }
        if (power >= oldPower) {
            if (weapon.aoe === 'bat') {
                power = power-0.5;
            } else {
                power = power-1;
            }
        }
        if (power < 3) {
            break;
        }
        ii++
    }
    $('#report').append('<span class="report">'+result.damage+' </span>');
    return result;
};

function batDeath(bat,count,gain,isWiped) {
    console.log('DEATH');
    console.log(bat);
    let deadId = bat.id;
    let tileId = bat.tileId;
    let isNoPrefab = false;
    if (bat.tags.includes('noprefab')) {
        isNoPrefab = true;
    }
    let batType = getBatType(bat);
    let isFlying = false;
    if (batType.skills.includes('fly')) {
        isFlying = true;
    }
    if (bat.team == 'player') {
        if (batType.crew >= 1 && !batType.skills.includes('dog') && !batType.skills.includes('clone') && !bat.tags.includes('outsider') && count) {
            let cytxp = Math.ceil(batType.squads*batType.squadSize*batType.crew/6);
            playerInfos.gangXP = playerInfos.gangXP+cytxp;
        }
        if (bat.tags.includes('nomove') && count && !batType.skills.includes('nomove')) {
            removeNoMoves(bat);
        }
        let batIndex = bataillons.findIndex((obj => obj.id == bat.id));
        bataillons.splice(batIndex,1);
        if (count) {
            if (!batType.skills.includes('nodeathcount') && !bat.tags.includes('nopilots')) {
                playerInfos.unitsLost = playerInfos.unitsLost+1;
                playerInfos.deadBats.push(batType.name);
                playMusic('rip',true);
            }
            if (batType.skills.includes('transport')) {
                transDestroy(tileId,deadId,isFlying);
            }
            if (!bat.tags.includes('nopilots')) {
                saveCrew(batType,deadId,tileId,isNoPrefab);
            }
        }
        batIndex = batList.findIndex((obj => obj.id == bat.id));
        batList.splice(batIndex,1);
    } else if (bat.team == 'aliens') {
        if (count) {
            if (bat.type.includes('Oeuf') || bat.type === 'Coque' || bat.type === 'Ruche' || bat.type === 'Cocon' || bat.type === 'Volcan' || bat.type === 'Colonie') {
                playerInfos.eggsKilled = playerInfos.eggsKilled+1;
                if (bat.type === 'Coque' || bat.type === 'Oeuf' || bat.type === 'Cocon') {
                    eggsNum = eggsNum-1;
                }
                if (bat.type === 'Oeuf voilé') {
                    if (playerInfos.vue >= 4) {
                        eggsNum = eggsNum-1;
                    }
                    unveilAliens(bat);
                }
                playMusic('eggKill',false);
            }
            playerInfos.aliensKilled = playerInfos.aliensKilled+1;
            if (gain) {
                addAlienRes(bat,isWiped);
                if (!playerInfos.knownAliens.includes(batType.name)) {
                    newAlienKilled(batType,tileId);
                }
            }
        }
        let batIndex = aliens.findIndex((obj => obj.id == bat.id));
        aliens.splice(batIndex,1);
        alienBonus();
    } else if (bat.team == 'locals') {
        let batIndex = locals.findIndex((obj => obj.id == bat.id));
        locals.splice(batIndex,1);
    }
    alienOccupiedTileList();
    if (showMini && activeTurn == 'player') {
        unitsView();
    }
};

function batDeathEffect(bat,quiet,gain,title,body) {
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
            if (bat.chief != undefined) {
                if (bat.chief != '') {
                    warning(bat.chief+' est mort','RIP',false,bat.tileId);
                }
            }
            setTimeout(function (){
                $('#b'+bat.tileId).empty();
                $('#b'+bat.tileId).append(resHere);
                if (bat.tags.includes('scion')) {
                    showMap(zone,false);
                }
            }, 1500); // How long do you want the delay to be (in milliseconds)?
        } else {
            $('#b'+bat.tileId).empty();
            $('#b'+bat.tileId).append(resHere);
            if (bat.chief != undefined) {
                if (bat.chief != '') {
                    warning(bat.chief+' est mort','RIP',false,bat.tileId);
                }
            }
            warning(title,body);
        }
    } else {
        $('#b'+bat.tileId).empty();
        $('#b'+bat.tileId).append(resHere);
        warning(title,body);
    }
    if (gain && bat.team === 'aliens' && !playerInfos.knownAliens.includes(bat.type)) {
        newAlienKilled(bat.type,bat.tileId);
    }
    if (bat.team != 'aliens') {
        let batType = getBatType(bat);
        addBodies(bat,batType,0);
        if (batType.crew >= 1 && !batType.skills.includes('robot') && !batType.skills.includes('clone') && !batType.skills.includes('dog') && !batType.skills.includes('brigands') && !bat.tags.includes('outsider') && batType.name != 'Citoyens' && batType.name != 'Criminels') {
            deathStress();
        }
        if (batType.cat === 'buildings') {
            putRuinsOfDestroyedBld(batType.name,bat.tileId);
        }
    }
    if (zone[0].dark) {
        if (bat.team === 'aliens') {
            if (bat.tags.includes('fluo')) {
                let tile = getTile(bat);
                tile.fluo = playerInfos.mapTurn+8;
            }
        }
    }
    if (bat.team === 'aliens') {
        if (bat.tags.includes('scion')) {
            let unitIndex = alienUnits.findIndex((obj => obj.name === 'Scions'));
            conselUnit = alienUnits[unitIndex];
            conselAmmos = ['xxx','xxx','xxx','xxx'];
            putBat(bat.tileId,0,0);
        }
        if (playerInfos.objectifs.swarm != 'none') {
            let morphNecro = false;
            let morphFetid = false;
            if (bat.type != 'Fétides') {
                if (bat.tags.includes('moss')) {
                    if (bat.type === 'Necros' || bat.type === 'Necroblob') {
                        morphFetid = true;
                    } else {
                        morphNecro = true;
                    }
                } else if (bat.type != 'Necros') {
                    let tile = getTile(bat);
                    if (tile.moist) {
                        morphNecro = true;
                        delete tile.moist;
                    }
                }
            }
            if (morphNecro) {
                let batType = getBatType(bat);
                if (batType.kind != 'game' && batType.cat === 'aliens') {
                    let unitIndex = alienUnits.findIndex((obj => obj.name === 'Necros'));
                    conselUnit = alienUnits[unitIndex];
                    conselAmmos = ['xxx','xxx','xxx','xxx'];
                    putBat(bat.tileId,0,0);
                }
            }
            if (morphFetid) {
                let batType = getBatType(bat);
                if (batType.kind != 'game' && batType.cat === 'aliens') {
                    let unitIndex = alienUnits.findIndex((obj => obj.name === 'Fétides'));
                    conselUnit = alienUnits[unitIndex];
                    conselAmmos = ['xxx','xxx','xxx','xxx'];
                    putBat(bat.tileId,0,0);
                }
            }
        }
    }
    if (bat.team != 'aliens') {
        $('#unitInfos').empty();
        $("#unitInfos").css("display","none");
    }
    if (bat.team == 'aliens') {
        let batType = getBatType(bat);
        if (batType.skills.includes('boss')) {
            playerInfos.objectifs[batType.kind] = 'detruit';
        }
    }
};

function addBodies(bat,batType,cits) {
    let unitCits = 0;
    if (cits >= 1) {
        unitCits = cits;
    } else {
        unitCits = batType.squads*batType.crew*batType.squadSize;
        if (batType.skills.includes('dog') || bat.tags.includes('nomove')) {
            unitCits = 0;
        }
        if (batType.id === 126 || batType.id === 225) {
            unitCits = batType.citoyens;
        }
    }
    let bodyFactor = 45+(playerInfos.comp.gen*10)+(playerInfos.comp.med*5)+(gangFacts.bod*100)-100+rand.rand(0,10);
    let bodyRecup = Math.ceil(unitCits*bodyFactor/100);
    if (bodyRecup >= 1 && !isStartZone) {
        resAdd('Corps',bodyRecup);
    }
    if (batType.skills.includes('dog')) {
        unitCits = batType.squads*batType.crew*batType.squadSize;
        bodyFactor = 40+(playerInfos.comp.ca*5)+(gangFacts.cit*300)-300+rand.rand(0,10);
        let bidocheRecup = Math.ceil(unitCits*bodyFactor/100);
        if (bidocheRecup >= 1) {
            resAdd('Gibier',bidocheRecup);
        }
    }
};

function newAlienKilled(batType,tileId) {
    if (!isStartZone) {
        if (batType.cat === 'aliens') {
            playerInfos.knownAliens.push(batType.name);
            if (batType.class != 'C') {
                playerInfos.gangXP = playerInfos.gangXP+batType.killXP;
                if (batType.class === 'A' || batType.class === 'S' || batType.class === 'X') {
                    playerInfos.gangXP = playerInfos.gangXP+batType.killXP;
                }
            }
            let xpBonus = batType.killXP;
            xpBonus = Math.floor(xpBonus*(playerInfos.comp.train+2)/4);
            if (xpBonus >= 1) {
                if (Object.keys(selectedBat).length >= 1) {
                    if (selectedBat.team === 'player') {
                        if (!selectedBatType.skills.includes('robot') || hasEquip(selectedBat,['g2ai'])) {
                            selectedBat.xp = selectedBat.xp+xpBonus;
                            selectedBatArrayUpdate();
                        }
                    }
                }
                bataillons.forEach(function(bat) {
                    if (bat.loc === "zone" || bat.loc === "trans") {
                        let distance = calcDistance(tileId,bat.tileId);
                        let batType = getBatType(bat);
                        if (distance <= 4 || xpBonus >= 25) {
                            if (!batType.skills.includes('robot') || hasEquip(bat,['g2ai'])) {
                                bat.xp = bat.xp+xpBonus;
                            }
                        }
                    }
                });
                warning('Alien inconnu tué : '+batType.name,'Toutes vos unités dans la zone ont gagné <span class="vio">'+xpBonus+' points d\'expérience.</span><br><span class="gf">Ressources récupérées: '+toCoolString(batType.killRes,true,false)+'</span>');
            } else {
                warning('Alien inconnu tué : '+batType.name,'<span class="gf">Ressources récupérées: '+toCoolString(batType.killRes,true,false)+'</span>');
            }
        }
    }
};

function saveCrew(deadBatType,deadId,tileId,isNoPrefab) {
    console.log('SAVE CREW --------------------------------------------------------');
    alienOccupiedTileList();
    playerOccupiedTileList();
    let salvableCits = 0;
    let citId = 126;
    if (deadBatType.skills.includes('brigands')) {
        citId = 225;
    }
    if (deadBatType.cat ==='infantry' && !deadBatType.skills.includes('iscit') && !deadBatType.skills.includes('clone') && !deadBatType.skills.includes('dog')) {
        salvableCits = Math.round(deadBatType.squads*deadBatType.squadSize*deadBatType.crew/12*rand.rand(0,2+playerInfos.comp.train));
    } else if (deadBatType.skills.includes('crewsave') || deadBatType.cat === 'buildings') {
        salvableCits = Math.round(deadBatType.squads*deadBatType.squadSize*deadBatType.crew/12*rand.rand(5+playerInfos.comp.train,12));
    } else if (deadBatType.skills.includes('badcrewsave')) {
        salvableCits = Math.round(deadBatType.squads*deadBatType.squadSize*deadBatType.crew/12*rand.rand(0,5+playerInfos.comp.train));
    }
    if (salvableCits >= 1) {
        if (isNoPrefab) {
            salvableCits = Math.ceil(salvableCits/2);
        }
        if (salvableCits > 72) {
            conselTriche = true;
            putBatAround(tileId,false,'any',citId,72);
            salvableCits = salvableCits-72;
        }
        if (salvableCits > 72) {
            conselTriche = true;
            putBatAround(tileId,false,'any',citId,72);
            salvableCits = salvableCits-72;
        }
        conselTriche = true;
        putBatAround(tileId,false,'any',citId,salvableCits);
        if (salvableCits >= 1) {
            centerMapTo(tileId);
        }
    }
};

function transDestroy(tileId,deadId,isFlying) {
    alienOccupiedTileList();
    let savedBats = 0;
    let crashBats = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId === deadId) {
            crashBats.push(bat);
        }
    });
    let crashEscapeTile = -1;
    crashBats.forEach(function(bat) {
        crashEscapeTile = getCrashEscapeTile(tileId);
        if (crashEscapeTile >= 0) {
            bat.loc = 'zone';
            bat.tileId = crashEscapeTile;
            bat.oldTileId = crashEscapeTile;
            if (isFlying) {
                bat.squadsLeft = bat.squadsLeft-2;
                if (bat.squadsLeft < 1) {
                    bat.squadsLeft = 1;
                }
            }
            savedBats++;
        } else {
            let batType = getBatType(bat);
            addBodies(bat,batType,0);
            warning('RIP',batType.name+' sont morts dans l\'accident');
            let batIndex = bataillons.findIndex((obj => obj.id == bat.id));
            bataillons.splice(batIndex,1);
            if (!batType.skills.includes('nodeathcount') && !bat.tags.includes('nopilots')) {
                playerInfos.unitsLost = playerInfos.unitsLost+1;
                playerInfos.deadBats.push(batType.name);
            }
        }
    });
    if (savedBats >= 1) {
        centerMapTo(tileId);
    }
};

function getCrashEscapeTile(tileId) {
    playerOccupiedTileList();
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
    if (escTile < 0) {
        shufZone.forEach(function(tile) {
            if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                distance = calcDistance(tile.id,tileId);
                if (distance <= 2) {
                    escTile = tile.id;
                }
            }
        });
    }
    return escTile;
};

function calcDamage(weapon,power,armor,defBat) {
    // powerDice is max 4x power
    // fortif armor
    let defBatType = getBatType(defBat);
    if (bugROF > 1) {
        if (defBatType.cat === 'aliens') {
            if (defBatType.skills.includes('arboost')) {
                armor = armor*2;
            }
        }
    }
    if (defBat.tags.includes('fortif')) {
        if ((defBat.tags.includes('hero') || defBat.tags.includes('vet')) && defBatType.skills.includes('herofortif')) {
            armor = armor+2;
        } else if (defBatType.skills.includes('bigfortif')) {
            armor = armor+2;
            if (defBatType.skills.includes('cage')) {
                armor = armor+2;
            }
        } else if (armor < 2 && !defBatType.skills.includes('baddef')) {
            armor = armor+1;
        }
        if (playerInfos.comp.def >= 2) {
            armor = armor+playerInfos.comp.def-1;
        }
    }
    armor = armor-weapon.aignore;
    if (armor < 0) {armor = 0;}
    let armorModifier = weapon.armors;
    // creuseur
    if (defBat.tags.includes('trou')) {
        if (weapon.ammo.includes('troueur')) {
            if (armorModifier > 0.15) {
                armorModifier = 0.15;
            }
        } else if (weapon.ammo.includes('creuseur')) {
            if (armorModifier > 0.33) {
                armorModifier = 0.33;
            }
        }
    }
    if (defBat.tags.includes('jelly')) {
        if (defBatType.skills.includes('nojello')) {
            armor = Math.round(armor/1.5);
        } else {
            armor = Math.round(armor/2);
        }
    }
    let modifiedArmor = Math.round(armor*armorModifier);
    let izmel = false;
    if (weapon.isAcid) {
        izmel = true;
    } else if (weapon.isMelee) {
        izmel = true;
    } else if (weapon.isShort && weapon.range === 0) {
        izmel = true;
    }
    if (!izmel) {
        modifiedArmor = getModifiedArmor(armor,armorModifier);
    }
    // console.log('Modified Armor = '+modifiedArmor);
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
    // bliss drug / damage reduction
    let dmgReduct = getDamageRed(weapon.sound,defBat,defBatType);
    let calculatedDmg = powerDice-modifiedArmor-dmgReduct;
    if (calculatedDmg <= dmgReduct+1 && dmgReduct >= 1) {
        calculatedDmg = 0;
    }
    if (calculatedDmg < 0) {
        calculatedDmg = 0;
    }
    if (calculatedDmg < 1 && (weapon.name.includes('plasma') || weapon.ammo === 'toxine' || weapon.ammo.includes('uridium'))) {
        calculatedDmg = 1;
    }
    if (weapon.name.includes('BFG')) {
        if (calculatedDmg < 4) {
            calculatedDmg = rand.rand(3,4);
        }
    }
    if (defBatType.cat === 'aliens') {
        if (weapon.ammo === 'suicide' || weapon.ammo === 'suicide-deluge') {
            if (calculatedDmg < 10) {
                calculatedDmg = rand.rand(8,12);
            }
        }
    }
    return calculatedDmg;
};

function getDamageRed(sound,defBat,defBatType) {
    let dmgReduct = 0;
    if (!sound.includes('suck')) {
        if (defBatType.skills.includes('dreduct')) {
            dmgReduct = 2;
        } else if (defBat.tags.includes('bliss') && defBatType.cat === 'infantry') {
            dmgReduct = 2;
        } else if (defBat.tags.includes('zealot') && defBatType.cat === 'infantry') {
            dmgReduct = 1;
        } else if (defBat.prt === 'kapton' || defBat.prt === 'kaptane' || defBat.prt.includes('suit') || defBat.prt === 'bonibo' || defBat.prt === 'swarwing' || defBat.prt === 'silk' || defBat.prt === 'tisal') {
            dmgReduct = 1;
        }
    }
    return dmgReduct;
};

function getModifiedArmor(armor,armorModifier) {
    let armorRest = armor;
    let adjMod = armorModifier;
    let modifiedArmor = 0;
    if (armorRest >= 10 && adjMod < 1) {
        modifiedArmor = modifiedArmor+(10*adjMod);
        armorRest = armorRest-10;
        adjMod = adjMod+armorModifier;
        if (adjMod > 1) {
            adjMod = 1;
        }
        if (armorRest >= 10 && adjMod < 1) {
            modifiedArmor = modifiedArmor+(10*adjMod);
            armorRest = armorRest-10;
            adjMod = adjMod+armorModifier;
            if (adjMod > 1) {
                adjMod = 1;
            }
            if (armorRest >= 10 && adjMod < 1) {
                modifiedArmor = modifiedArmor+(10*adjMod);
                armorRest = armorRest-10;
                adjMod = adjMod+armorModifier;
                if (adjMod > 1) {
                    adjMod = 1;
                }
                if (armorRest >= 10 && adjMod < 1) {
                    modifiedArmor = modifiedArmor+(10*adjMod);
                    armorRest = armorRest-10;
                    adjMod = adjMod+armorModifier;
                    if (adjMod > 1) {
                        adjMod = 1;
                    }
                } else {
                    modifiedArmor = modifiedArmor+(armorRest*adjMod);
                }
            } else {
                modifiedArmor = modifiedArmor+(armorRest*adjMod);
            }
        } else {
            modifiedArmor = modifiedArmor+(armorRest*adjMod);
        }
    } else {
        modifiedArmor = modifiedArmor+(armorRest*adjMod);
    }
    modifiedArmor = Math.round(modifiedArmor);
    return modifiedArmor;
};

function checkRealm() {
    let realmOK = false;
    if ((!targetWeap.noFly || (!selectedBatType.skills.includes('fly') && selectedBat.eq != 'e-jetpack')) && (!targetWeap.noGround || selectedBatType.skills.includes('fly') || selectedBatType.skills.includes('sauteur'))) {
        realmOK = true;
    }
    if (selectedWeap.range === 0) {
        if (selectedWeap.isMelee || selectedWeap.isShort) {
            realmOK = true;
        }
    }
    if (selectedBat.tags.includes('camo') || selectedBat.tags.includes('fortif')) {
        realmOK = true;
    }
    return realmOK;
}

function checkRicochet(defBat,defBatType,attWeap,init) {
    let rico = false;
    if (!defBat.tags.includes('jelly')) {
        if (attWeap.name != undefined) {
            if (defBatType.skills.includes('ricochet') || defBat.tags.includes('ricochet') || (defBatType.skills.includes('ricoface') && !init)) {
                if (!attWeap.isFire && !attWeap.ammo.includes('laser') && !attWeap.ammo.includes('electric') && !attWeap.ammo.includes('eflash') && !attWeap.ammo.includes('taser') && !attWeap.ammo.includes('web') && !attWeap.ammo.includes('flashbang') && !attWeap.name.includes('plasma') && !attWeap.ammo.includes('snake') && !attWeap.ammo.includes('gaz') && !attWeap.ammo.includes('disco') && !attWeap.ammo.includes('psionics') && !attWeap.ammo.includes('mono') && !attWeap.isMelee && !attWeap.noShield && !attWeap.isSaw) {
                    let defArmor = defBat.armor;
                    if (bugROF > 1) {
                        if (defBatType.cat === 'aliens') {
                            if (defBatType.skills.includes('arboost')) {
                                defArmor = defArmor*2;
                            }
                        }
                    }
                    if (defBatType.skills.includes('ricoface')) {
                        defArmor = defArmor+10;
                    }
                    if (attWeap.armors > 0) {
                        let minimumPower = defArmor*2;
                        if (minimumPower < 18) {
                            if (defArmor >= 8) {
                                minimumPower = 20;
                            } else {
                                minimumPower = 18;
                            }
                        }
                        let powerBonus = Math.ceil((playerInfos.comp.train+(playerInfos.comp.ca/2))/1.75)+2;
                        let aoeBonus = 0;
                        if (attWeap.aoe === 'squad' || attWeap.aoe === 'bat') {
                            aoeBonus = (attWeap.power-13)/3;
                            powerBonus = 0;
                        }
                        let calcPower = Math.round((attWeap.power+powerBonus+aoeBonus)/attWeap.armors);
                        if (calcPower < minimumPower) {
                            rico = true;
                        }
                    }
                }
            }
        }
    }
    return rico;
};

function applyShield(shots) {
    let shieldValue = 1;
    let shieldChance = 0;
    if (targetBatType.skills.includes('shield') || targetBatType.skills.includes('permashield') || targetBat.tags.includes('permashield') || targetBatType.skills.includes('slowshield')) {
        if (targetBatType.skills.includes('permashield') || targetBat.tags.includes('permashield')) {
            shieldChance = 100;
        } else if (targetBatType.skills.includes('slowshield')) {
            shieldChance = 0;
        } else {
            shieldChance = 67;
        }
    } else {
        if (targetBatType.kind === 'bug' && bugSHIELD) {
            shieldChance = 33;
        }
        if ((targetBatType.kind === 'egg' || targetBatType.kind === 'egg2') && eggSHIELD && targetBatType.name != 'Colonie') {
            shieldChance = 33;
        }
        if (targetBatType.name === 'Vomissure' && eggSHIELD) {
            shieldChance = 100;
        }
    }
    if (shieldChance >= 1 && shieldChance < 100) {
        shieldChance = Math.round(shieldChance/3.75*Math.sqrt(Math.sqrt(shots)));
        if (shieldChance >= 80) {
            shieldChance = 80;
        }
    }
    console.log('SHIELD');
    console.log(shieldChance+'%');
    console.log(selectedWeap.ammo);
    if (activeTurn === 'player' && (shieldChance >= 1 || targetBatType.skills.includes('slowshield')) && selectedWeap.ammo != 'marquage' && !selectedWeap.ammo.includes('flashbang')) {
        if (!targetBat.tags.includes('shield')) {
            $('#report').append('<span class="report rose">Bouclier '+shieldChance+'%<br></span>');
        }
        if (rand.rand(1,100) <= shieldChance && !targetBat.tags.includes('shield')) {
            targetBat.tags.push('shield');
        }
        if (targetBat.tags.includes('shield') || isAdmin.fire) {
            shieldValue = rand.rand(6,14);
            if (isAdmin.fire) {
                shieldValue = 10;
            }
            if (selectedWeap.noShield) {
                shieldValue = shieldValue/6;
            } else if (selectedWeap.minShield) {
                shieldValue = shieldValue/3;
            } else if (selectedWeap.lowShield) {
                shieldValue = shieldValue/1.75;
            }
            let avShieldValue = Math.round(shieldValue);
            $('#report').append('<span class="report rose">Bouclier activé (1/'+avShieldValue+')<br></span>');
        }
        if (targetBatType.skills.includes('slowshield') && !targetBat.tags.includes('shield')) {
            targetBat.tags.push('shield');
        }
    }
    return shieldValue;
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
        if (hasEquip(bat,['waterproof']) || batType.skills.includes('noblub')) {
            if (terrain.name === 'W' || terrain.name === 'R' || terrain.name === 'L') {
                cover = 3;
            }
        }
    }
    // Small Size
    let invSize = 3-batType.size;
    if (invSize <= 0) {
        invSize = 0;
    } else {
        invSize = invSize*4;
    }
    if (cover >= batType.size) {
        cover = cover+invSize;
    }
    // Fortification
    if (withFortif) {
        if (bat.tags.includes('fortif')) {
            cover = terrain.fortifcover;
            if (batType.skills.includes('baddef')) {
                cover = Math.ceil((terrain.fortifcover+terrain.cover)/2);
            }
            if (hasEquip(bat,['waterproof']) || batType.skills.includes('noblub')) {
                if (terrain.name === 'W' || terrain.name === 'R' || terrain.name === 'L') {
                    cover = 3;
                }
            }
            if (batType.skills.includes('bigfortif')) {
                cover = cover+2;
            }
            if ((bat.tags.includes('hero') || bat.tags.includes('vet')) && batType.skills.includes('herofortif')) {
                cover = cover+2;
            }
        }
    }
    if (tile.ruins) {
        if (cover > 4) {
            cover = cover+2;
        } else {
            cover = 4+Math.floor(cover/2);
        }
    }
    if (tile.infra != undefined && bat.team != 'aliens') {
        if (batType.cat != 'buildings') {
            let okCover = bonusInfra(batType,tile.infra);
            if (okCover) {
                let infraCover = 2;
                if (batType.cat != 'vehicles' || batType.skills.includes('robot') || batType.skills.includes('cyber')) {
                    if (tile.infra === 'Miradors') {
                        infraCover = 5;
                    } else if (tile.infra === 'Palissades') {
                        infraCover = 6;
                    } else if (tile.infra === 'Remparts') {
                        infraCover = 9;
                    } else if (tile.infra === 'Murailles') {
                        infraCover = 12;
                    }
                }
                if (cover > infraCover) {
                    cover = cover+Math.floor(infraCover/2);
                } else {
                    cover = infraCover+Math.floor(cover/2);
                }
            }

        }
    }
    if (forAOE) {
        cover = cover+coverAOE;
    }
    if (cover < 0) {
        if (batType.skills.includes('fly') && !batType.skills.includes('jetpack')) {
            cover = 0;
        }
        if (batType.skills.includes('okwater')) {
            cover = 0;
        }
    } else {
        if (forAOE) {
            cover = Math.round(cover/1.5);
        }
    }
    return cover;
};

function bonusInfra(batType,infraName) {
    let okCover = false;
    if (batType.cat != 'buildings' && batType.cat != 'aliens') {
        if (batType.cat === 'vehicles') {
            if (batType.skills.includes('robot') || batType.skills.includes('cyber')) {
                okCover = true;
            }
        } else if (batType.cat === 'devices') {
            if (!batType.skills.includes('infrako')) {
                if (infraName === 'Remparts' || infraName === 'Murailles') {
                    okCover = true;
                }
            }
        } else {
            okCover = true;
        }
    }
    return okCover;
};

function getStealth(bat) {
    let batType = getBatType(bat);
    let tile = getTile(bat);
    let terrain = getTerrain(bat);
    let batStealth = batType.stealth;
    if (zone[0].planet === 'Sarak') {
        batStealth = batStealth+5;
    }
    if (tile.infra === 'Terriers' && batType.size < 9 && batType.team === 'player') {
        batStealth = batStealth+4;
    } else if (tile.ruins) {
        batStealth = batStealth+2;
    } else if (tile.infra === 'Débris') {
        batStealth = batStealth+2;
    }
    if (batType.team === 'player') {
        if (isOnInfra(bat)) {
            if (playerInfos.comp.cam >= 2) {
                batStealth = batStealth+3;
            } else if (playerInfos.comp.cam >= 1) {
                batStealth = batStealth+1;
            }
        }
    }
    if (hasEquip(bat,['e-camo','bld-camo','kit-sentinelle','kit-milice','kit-chouf','kit-guetteur'])) {
        if (batType.skills.includes('camo')) {
            batStealth = batStealth+3;
        } else {
            batStealth = batStealth+2;
        }
    }
    let terBonus = (terrain.veg*2);
    if (batType.cat === 'aliens') {
        if (batType.skills.includes('hover')) {
            terBonus = terBonus+(terrain.flood*2);
            terBonus = terBonus+terrain.fishcover;
        } else if (!batType.skills.includes('okwater')) {
            terBonus = terBonus+terrain.aliencover;
        } else {
            terBonus = terBonus+(terrain.flood*2);
            terBonus = terBonus+terrain.cover;
        }
    } else {
        terBonus = terBonus+(terrain.flood*2);
        if (terrain.name === 'R' || terrain.name === 'W' || terrain.name === 'L' || terrain.name === 'S') {
            if (hasEquip(bat,['waterproof']) || batType.skills.includes('noblub')) {
                terBonus = terBonus+terrain.fishcover;
            } else {
                terBonus = terBonus+terrain.cover;
            }
        } else {
            terBonus = terBonus+terrain.cover;
        }
    }
    if (tile.infra === 'Terriers' && batType.size < 9 && batType.team === 'player') {
        terBonus = (terBonus/3)+8;
    } else if (tile.ruins) {
        terBonus = (terBonus/3)+8;
    } else if (isOnInfra(bat)) {
        terBonus = (terBonus/1.5)+4;
    }
    let terFactor = terBonus+14;
    if (terFactor < 1) {
        terFactor = 1;
    }
    batStealth = batStealth*terFactor/19;
    batStealth = batStealth+(terBonus*3/batType.size)-5;
    if (playerInfos.bldList.includes('QG')) {
        batStealth = batStealth+4;
    } else if (playerInfos.bldList.includes('Centre de com')) {
        batStealth = batStealth+4;
    } else if (playerInfos.bldList.includes('Poste radio')) {
        batStealth = batStealth+1;
    }
    let vetStealth = bat.vet*vetBonus.stealth;
    batStealth = batStealth+vetStealth;
    if (batStealth < 0) {
        batStealth = 0;
    }
    // Starka drug
    if (bat.tags.includes('starka') || bat.tags.includes('moloko')) {
        batStealth = batStealth/1.5;
    }
    // camouflage 0
    if (batStealth >= 1 && playerInfos.comp.cam < 1) {
        batStealth = batStealth/1.5;
    }
    batStealth = Math.round(batStealth);
    return batStealth;
};

function calcSpeed(bat,weap,opweap,opBatType,distance,attacking) {
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
    if (hasEquip(bat,['w2-autogun','w2-autopistol','w3-autopistol'])) {
        speed = speed-50-stealth;
    } else {
        if ((bat.tags.includes('guet') || batType.skills.includes('sentinelle') || hasEquip(bat,['detector','g2ai'])) && !attacking) {
            speed = speed-watchInitBonus-stealth;
            // console.log('bonus guet');
        }
        if (batType.skills.includes('defense') && !attacking) {
            speed = speed-10;
        }
        if (batType.skills.includes('bastion') && !attacking) {
            speed = speed-20;
        }
        if (batType.skills.includes('tirailleur') && bat.oldTileId != bat.tileId) {
            speed = speed-20;
        }
        if (batType.skills.includes('initiative')) {
            speed = speed-200;
            // console.log('bonus initiative');
        }
        if (batType.skills.includes('slowfire')) {
            speed = speed+120;
            // console.log('bonus initiative');
        }
        if (batType.skills.includes('after')) {
            if (attacking) {
                speed = speed-999;
                // console.log('bonus initiative');
            } else {
                speed = speed+999;
                // console.log('malus initiative');
            }
        }
    }
    if (hasEquip(bat,['theeye','ciberkit'])) {
        speed = speed-50;
    }
    // initmelee
    if (batType.skills.includes('initmelee') && distance === 0) {
        if (batType.cat === 'aliens' || bat.tags.includes('guet')) {
            if (batType.weapon.range >= 1 && !attacking) {
                speed = speed-120;
            } else {
                speed = speed-60;
            }
        }
    }
    // camo
    if (bat.fuzz <= -2 || bat.tags.includes('invisible') || batType.skills.includes('invisible')) {
        if (attacking && !opBatType.skills.includes('snif')) {
            speed = speed-50;
        }
    }
    // Skupiac drug
    if (bat.tags.includes('skupiac')) {
        speed = speed-15;
    }
    if (weap.ammo.includes('disco')) {
        speed = speed-100;
    }
    if (weap.ammo.includes('eflash')) {
        speed = speed-50;
    }
    if (bat.team === 'player') {
        if ((bat.apLeft < 0 && !batType.skills.includes('guerrilla')) || bat.apLeft > 0) {
            speed = speed-(bat.apLeft*3);
        }
    } else {
        if (bat.apLeft > 0) {
            speed = speed-(bat.apLeft*2)-15;
        }
    }
    if (bat.team === 'player') {
        speed = speed-(playerInfos.comp.train*5)+5;
    } else {
        speed = speed-alienInitiative;
    }
    let vetDice = vetBonus.initiative*bat.vet;
    return Math.round(speed+rand.rand(0,initiativeDice)-rand.rand(0,vetDice));
};

function sideBySideTiles(myTileIndex,thatTileIndex,fuzzThing) {
    let sbs = false;
    if (selectedBat.fuzz <= -2 && fuzzThing) {
        sbs = false;
    } else {
        let myTileX = zone[myTileIndex].x;
        let myTileY = zone[myTileIndex].y;
        let thatTileX = zone[thatTileIndex].x;
        let thatTileY = zone[thatTileIndex].y;
        if (myTileX === thatTileX) {
            if (myTileY == thatTileY+1 || myTileY == thatTileY-1) {
                sbs = true;
            }
        }
        if (myTileY === thatTileY) {
            if (myTileX == thatTileX+1 || myTileX == thatTileX-1) {
                sbs = true;
            }
        }
    }
    return sbs;
};

function batInMelee(bat,batType) {
    // Vérifie si le bataillon est VRAIMENT en mêlée : Range 0 ET alien range 0 en face
    let inMelee = false;
    let alienType;
    aliens.forEach(function(alien) {
        if (alien.loc === "zone") {
            if (bat.tileId == alien.tileId+1 || bat.tileId == alien.tileId-1 || bat.tileId == alien.tileId+mapSize || bat.tileId == alien.tileId-mapSize) {
                alienType = getBatType(alien);
                if (alien.range === 0 && !bat.tags.includes('camo') && alienType.maxSalvo >= 1 && !batType.skills.includes('transorbital')) {
                    inMelee = true;
                }
            }
        }
    });
    return inMelee;
};

function calcDistanceSquare(myTileIndex,thatTileIndex) {
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

function isInRange(myBat,thatTileId,myWeapon,alien) {
    let myBatType = getBatType(myBat);
    let inRange = false;
    let range = myWeapon.range;
    let rangeBonus = 0;
    if (alien.tags.includes('fluo')) {
        if (myWeapon.range >= 1 && !myWeapon.isMelee) {
            rangeBonus = rangeBonus+1;
        }
    }
    if (rangeTerAdj) {
        if (myWeapon.aoe === 'unit' || myWeapon.aoe === 'brochette') {
            let terrainAdj = 0;
            let terrain = getTerrainById(thatTileId);
            let alienType = getBatType(alien);
            if (!alienType.skills.includes('fly') && !alien.tags.includes('fluo')) {
                // if (terrain.scarp >= 3 && alienType.size <= 2) {
                //     terrainAdj = terrainAdj-1;
                // }
                if (terrain.veg > alienType.size) {
                    terrainAdj = terrainAdj-terrain.veg+alienType.size;
                }
                if (myWeapon.range >= 1 && !myWeapon.isMelee) {
                    rangeBonus = rangeBonus+terrainAdj;
                }
            }
            let alienAdjSize = alienType.size;
            if (alienAdjSize > 50) {
                rangeBonus = rangeBonus+2;
            } else if (alienAdjSize > 20) {
                rangeBonus = rangeBonus+1;
            }
        }
    }
    if (myBat.type === 'Mines wipeout' || myWeapon.ammo.includes('lt-')) {
        rangeBonus = 0;
    }
    let halfRange = Math.floor(range/2);
    if (halfRange === 0 && myWeapon.range >= 1) {
        halfRange = 1;
    }
    if (rangeBonus > halfRange) {
        range = range+halfRange;
    } else {
        range = range+rangeBonus;
    }
    if (myWeapon.range >= 1 && !myWeapon.isMelee && range < 1) {
        range = 1;
    }
    let distance = calcDistance(myBat.tileId,thatTileId);
    if (distance > range) {
        // out of range
    } else {
        inRange = true;
    }
    return inRange;
};

function anyAlienInRange(myBat,weapon) {
    let tileId = myBat.tileId;
    let distance;
    let inRange = false;
    let batIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            let guidageOK = checkGuidage(weapon,bat);
            if (isInRange(myBat,bat.tileId,weapon,bat) || guidageOK) {
                batType = getBatType(bat);
                // console.log(batType.name);
                if (weapon.ammo === 'marquage' && bat.tags.includes('fluo')) {
                    // Déjà marqué
                } else {
                    let realmOK = checkFlyTarget(weapon,bat,batType);
                    if (!realmOK) {
                        // Fly/Ground hors portée
                    } else {
                        let hiddenOK = checkInvisibleTarget(myBat,weapon,bat,batType,guidageOK);
                        if (!hiddenOK) {
                            // Alien invisible
                        } else {
                            if (zone[0].dark && !undarkNow.includes(bat.tileId) && !bat.tags.includes('fluo')) {
                                // Alien dans l'ombre
                            } else {
                                inRange = true;
                            }
                        }
                    }
                }
            }
        }
    });
    return inRange;
};

function calcDistance(myTileIndex,thatTileIndex) {
    let distance = 0;
    let batOff = calcOffsets(myTileIndex,thatTileIndex);
    if (batOff[0] > batOff[1]) {
        distance = batOff[0]-batOff[1]+(batOff[1]*1.42);
    } else {
        distance = batOff[1]-batOff[0]+(batOff[0]*1.42);
    }
    distance = Math.floor(distance*1);
    if (myTileIndex == thatTileIndex+1 || myTileIndex == thatTileIndex-1 || myTileIndex == thatTileIndex+mapSize || myTileIndex == thatTileIndex-mapSize) {
        return 0;
    } else {
        return distance;
    }
};

function calcOffsets(myTileId,tileId) {
    // offsets x et y entre myTileId et tileId
    theTileX = zone[tileId].x;
    theTileY = zone[tileId].y;
    myTileX = zone[myTileId].x;
    myTileY = zone[myTileId].y;
    xOff = Math.abs(myTileX-theTileX);
    yOff = Math.abs(myTileY-theTileY);
    return [xOff,yOff];
};

function checkFlyTarget(weapon,alien,alienType) {
    let targetOK = true;
    if (alienType.skills.includes('fly') && alien.apLeft >= -6) {
        if (weapon.isMelee) {
            targetOK = false;
        } else if (weapon.range === 0 && weapon.isShort) {
            targetOK = false;
        } else if (weapon.noFly) {
            targetOK = false;
        }
    } else {
        if (weapon.noGround && !alienType.skills.includes('sauteur')) {
            targetOK = false;
        }
    }
    return targetOK;
};

function checkInvisibleTarget(bat,weap,alien,alienType,guideTarget) {
    let hiddenOK = true;
    if (alienType.skills.includes('invisible') || alien.tags.includes('invisible')) {
        if (!guideTarget && !alien.tags.includes('fluo')) {
            if (!weap.vision || (alien.damage === 0 && alienType.skills.includes('invisible'))) {
                let zeroRange = sideBySideTiles(bat.tileId,alien.tileId,false);
                if (!zeroRange) {
                    hiddenOK = false;
                }
            }
        }
    }
    return hiddenOK;
};

function isOnInfra(bat) {
    let onInfra = false;
    let tile = getTile(bat);
    let batType = getBatType(bat);
    if (tile.infra != undefined) {
        if (tile.infra != 'Débris' && tile.infra != 'Terriers' && batType.cat != 'aliens') {
            if (batType.cat != 'vehicles' || batType.skills.includes('robot') || batType.skills.includes('cyber')) {
                onInfra = true;
            }
        }
    }
    return onInfra;
}

function crossTarget(alien) {
    let ct = '';
    if (alien.tags.includes('shield')) {
        ct = 'Shield';
    } else if (alien.tags.includes('jelly')) {
        ct = 'Jelly';
    } else if (alien.tags.includes('inflammable')) {
        ct = 'Fire';
    } else if (alien.tags.includes('stun') || alien.tags.includes('freeze')) {
        ct = 'Stun';
    } else if (alien.tags.includes('fluo')) {
        ct = 'Fluo';
    }
    return ct;
};

function fireInfos(bat) {
    $(".targ").remove();
    isMelee = false;
    let batType = getBatType(bat);
    cursorSwitch('.','grid-item','pointer');
    let myTileX = zone[bat.tileId].x;
    let myTileY = zone[bat.tileId].y;
    let alien = {};
    let alienIndex;
    let alienType;
    let onInfra = false;
    let longMelee = false;
    let guideTarget = false;
    zone.forEach(function(tile) {
        $("#"+tile.id).attr("title", "");
        alien = alienHere(tile.id);
        if (Object.keys(alien).length >= 1) {
            alienType = getBatType(alien);
            onInfra = isOnInfra(bat);
            if (sideBySideTiles(selectedBat.tileId,tile.id,true) && !batType.skills.includes('longshot') && !onInfra) {
                isMelee = true;
                if (checkFlyTarget(selectedWeap,alien,alienType)) {
                    guideTarget = checkGuidage(selectedWeap,alien);
                    let hiddenOK = checkInvisibleTarget(selectedBat,selectedWeap,alien,alienType,guideTarget);
                    if (hiddenOK) {
                        if (!alien.tags.includes('fluo') || selectedWeap.ammo != 'marquage') {
                            if (!zone[0].dark || (zone[0].dark && (undarkNow.includes(tile.id) || alien.tags.includes('fluo')))) {
                                cursorSwitch('#',tile.id,'fire');
                                $('#b'+tile.id).append('<div class="targ"><img src="/static/img/crosstarget'+crossTarget(alien)+'.png"></div>');
                            }
                        }
                    }
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
                if (isInRange(selectedBat,tile.id,selectedWeap,alien) || guideTarget) {
                    alienType = getBatType(alien);
                    let hiddenOK = checkInvisibleTarget(selectedBat,selectedWeap,alien,alienType,guideTarget);
                    if (checkFlyTarget(selectedWeap,alien,alienType) && hiddenOK) {
                        if (!alien.tags.includes('fluo') || selectedWeap.ammo != 'marquage') {
                            if (!zone[0].dark || (zone[0].dark && (undarkNow.includes(tile.id) || alien.tags.includes('fluo')))) {
                                cursorSwitch('#',tile.id,'fire');
                                $('#b'+tile.id).append('<div class="targ"><img src="/static/img/crosstarget'+crossTarget(alien)+'.png"></div>');
                            }
                        }
                    }
                }
            }
        });
    }
};

function checkGuidage(weapon,alien) {
    let guideTarget = false;
    if (alien.tags.includes('guide')) {
        if (weapon.ammo.includes('missile')) {
            if (!weapon.name.includes('Comet') && !weapon.name.includes('Thunder') && !weapon.name.includes('Flit')) {
                guideTarget = true;
            }
            if (weapon.ammo === 'missile-homing') {
                guideTarget = true;
            }
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
    sWipe = selectedWeap.isBlast;
};

function weaponSelectRiposte(distance) {
    if (targetBatType.skills.includes('smartrip')) {
        if (distance > targetBatType.weapon.range) {
            targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon2));
            targetWeap = weaponAdj(targetWeap,targetBat,'w2');
        } else {
            targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon));
            targetWeap = weaponAdj(targetWeap,targetBat,'w1');
        }
    } else if (targetBatType.skills.includes('fortifw2') && targetBat.tags.includes('fortif')) {
        targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon2));
        targetWeap = weaponAdj(targetWeap,targetBat,'w2');
        if (targetBatType.name === 'Chevaliers') {
            targetWeap.sound = 'axe_x2';
        }
    } else if (hasEquip(targetBat,['w2-autogun','w2-autopistol','w3-autopistol'])) {
        targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon3));
        targetWeap = weaponAdj(targetWeap,targetBat,'w3');
    } else if (targetBatType.skills.includes('w3melee') && distance === 0) {
        targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon3));
        targetWeap = weaponAdj(targetWeap,targetBat,'w3');
    } else if (targetBatType.skills.includes('w3range') && distance <= targetBatType.weapon3.range) {
        targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon3));
        targetWeap = weaponAdj(targetWeap,targetBat,'w3');
    } else {
        let baseAmmo = 99;
        let ammoLeft = 99;
        let batWeap1 = {};
        if (!targetBatType.weapon.kit || targetBat.eq.includes('w1-') || targetBat.eq.includes('w2-')) {
            batWeap1 = targetBatType.weapon;
        }
        targetWeap = JSON.parse(JSON.stringify(batWeap1));
        targetWeap = weaponAdj(targetWeap,targetBat,'w1');
        if (!targetBatType.weapon2.kit || targetBat.eq.includes('kit-') || targetBat.eq.includes('w2-')) {
            if (activeTurn === 'aliens') {
                baseAmmo = targetWeap.maxAmmo;
                ammoLeft = calcAmmos(targetBat,baseAmmo);
                let rico = checkRicochet(selectedBat,selectedBatType,targetWeap);
                if (rico || ammoLeft <= 0 || distance > targetWeap.range || targetWeap.noDef || (targetWeap.noMelee && distance === 0 && selectedBat.tileId === selectedBat.oldTileId) || (targetWeap.noFly && selectedBatType.skills.includes('fly')) || (targetWeap.noGround && !selectedBatType.skills.includes('sauteur') && !selectedBatType.skills.includes('fly'))) {
                    if (Object.keys(targetBatType.weapon2).length >= 1) {
                        targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon2));
                        targetWeap = weaponAdj(targetWeap,targetBat,'w2');
                        rico = checkRicochet(selectedBat,selectedBatType,targetWeap);
                        if (!targetWeap.noDef && distance <= targetWeap.range && !rico) {
                            baseAmmo = targetWeap.maxAmmo;
                            ammoLeft = calcAmmos(targetBat,baseAmmo);
                        } else {
                            ammoLeft = 0;
                        }
                    } else {
                        ammoLeft = 0;
                    }
                    if (ammoLeft <= 0) {
                        targetWeap = JSON.parse(JSON.stringify(batWeap1));
                        targetWeap = weaponAdj(targetWeap,targetBat,'w1');
                    }
                }
            }
        }
    }
    tWipe = targetWeap.isBlast;
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

function weaponEqChange(thisWeapon,wn,bat,batType) {
    // console.log(bat);
    // console.log(bat.eq);
    // console.log(wn);
    if (hasEquip(bat,['arrosoir'])) {
        if (thisWeapon.name.includes('Lance-flammes')) {
            thisWeapon.name = 'Arrosoir';
            thisWeapon.range = 1;
            thisWeapon.elevation = 1;
            thisWeapon.accuracy = thisWeapon.accuracy-10;
            thisWeapon.noDef = true;
            thisWeapon.rof = 6;
            thisWeapon.power = 0;
            thisWeapon.sound = 'hose';
            if (wn === 'w2') {
                bat.ammo2 = 'fuel';
            } else {
                bat.ammo = 'fuel';
            }
        }
    }
    // console.log(thisWeapon.name);
    // console.log(bat.ammo2);
    if (hasEquip(bat,['arcpoulie'])) {
        if (thisWeapon.name.includes('Arc')) {
            thisWeapon.name = 'Arc à poulies';
            thisWeapon.range = 2;
            thisWeapon.elevation = 1;
            thisWeapon.hide = false;
            thisWeapon.power = 8;
            if (playerInfos.comp.train < 1) {
                thisWeapon.cost = 4;
            } else {
                thisWeapon.cost = 3;
            }
        }
    }
    if (hasEquip(bat,['arbalourde'])) {
        if (thisWeapon.name.includes('Arbalète')) {
            thisWeapon.name = 'Arbalète lourde';
            thisWeapon.elevation = 1;
            thisWeapon.hide = false;
            thisWeapon.power = 9;
            thisWeapon.armors = 0.8;
            if (playerInfos.comp.train < 1) {
                thisWeapon.cost = 5;
            } else {
                thisWeapon.cost = 4;
            }
        }
    }
    if (hasEquip(bat,['belier'])) {
        if (thisWeapon.name === 'Boutoir') {
            thisWeapon.name = 'Bélier';
            thisWeapon.rof = thisWeapon.rof*1.5;
            thisWeapon.power = Math.round(thisWeapon.power*1.26);
            thisWeapon.accuracy = thisWeapon.accuracy+2;
        }
    }
    if (hasEquip(bat,['moisso'])) {
        if (thisWeapon.name === 'Boutoir' || thisWeapon.name === 'Bélier') {
            if (thisWeapon.name === 'Bélier') {
                thisWeapon.rof = thisWeapon.rof/1.25;
            }
            thisWeapon.name = 'Moissonneuse';
            thisWeapon.noBig = false;
            thisWeapon.noShield = false;
            thisWeapon.aoe = 'squad';
            thisWeapon.power = Math.ceil(Math.sqrt(batType.size*1.75));
            thisWeapon.accuracy = 24;
            if (wn === 'w2') {
                bat.ammo2 = 'lame-carbone';
            } else {
                bat.ammo = 'lame-carbone';
            }
            thisWeapon.sound = 'harvest';
        }
    }
    return thisWeapon;
};

function weaponAdj(weapon,bat,wn) {
    let batType = getBatType(bat);
    let thisWeapon = {};
    if (wn === 'w2') {
        thisWeapon.num = 2;
    } else if (wn === 'w3') {
        thisWeapon.num = 3;
    } else {
        thisWeapon.num = 1;
    }
    // bonus vet
    thisWeapon.rof = weapon.rof*(bat.vet+vetBonus.rof)/vetBonus.rof;
    // hero rof
    if (bat.tags.includes('hero') && batType.skills.includes('herorof')) {
        thisWeapon.rof = thisWeapon.rof*1.25;
    }
    if (Object.keys(weapon).length >= 1) {
        thisWeapon.name = weapon.name;
    } else {
        thisWeapon.name = 'None';
    }
    thisWeapon.cost = weapon.cost;
    // hero wcost
    if ((bat.tags.includes('hero') || bat.tags.includes('vet')) && batType.skills.includes('herowc')) {
        if (thisWeapon.cost >= 6) {
            thisWeapon.cost = thisWeapon.cost-3;
        } else if (thisWeapon.cost >= 5) {
            thisWeapon.cost = thisWeapon.cost-2;
        } else if (thisWeapon.cost >= 2) {
            thisWeapon.cost = thisWeapon.cost-1;
        }
    }
    thisWeapon.range = weapon.range;
    thisWeapon.power = weapon.power;
    thisWeapon.accuracy = weapon.accuracy;
    if (weapon.armors === undefined) {
        thisWeapon.armors = 1;
    } else {
        thisWeapon.armors = weapon.armors;
    }
    thisWeapon.aoe = weapon.aoe;
    thisWeapon.sound = weapon.sound;
    if (weapon.type === undefined) {
        thisWeapon.type = 'none';
    } else {
        thisWeapon.type = weapon.type;
    }
    if (weapon.elevation === undefined) {
        thisWeapon.elevation = 0;
    } else {
        thisWeapon.elevation = weapon.elevation;
    }
    if (weapon.spot === undefined) {
        thisWeapon.spot = false;
    } else {
        thisWeapon.spot = weapon.spot;
    }
    if (weapon.kit === undefined) {
        thisWeapon.kit = false;
    } else {
        thisWeapon.kit = weapon.kit;
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
    if (weapon.noStab === undefined) {
        thisWeapon.noStab = false;
    } else {
        thisWeapon.noStab = weapon.noStab;
    }
    if (weapon.free === undefined) {
        thisWeapon.free = false;
    } else {
        thisWeapon.free = weapon.free;
    }
    if (weapon.noDatt === undefined) {
        thisWeapon.noDatt = false;
    } else {
        thisWeapon.noDatt = weapon.noDatt;
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
    if (weapon.noise === undefined) {
        thisWeapon.noise = 3;
    } else {
        thisWeapon.noise = weapon.noise;
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
    }
    if (weapon.isShort === undefined) {
        thisWeapon.isShort = false;
    } else {
        thisWeapon.isShort = weapon.isShort;
    }
    if (weapon.isArt === undefined) {
        thisWeapon.isArt = false;
    } else {
        thisWeapon.isArt = weapon.isArt;
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
    if (weapon.isPrec === undefined) {
        thisWeapon.isPrec = false;
    } else {
        thisWeapon.isPrec = weapon.isPrec;
    }
    if (weapon.vision === undefined) {
        thisWeapon.vision = false;
    } else {
        thisWeapon.vision = weapon.vision;
    }
    if (weapon.isBow === undefined) {
        thisWeapon.isBow = false;
    } else {
        thisWeapon.isBow = weapon.isBow;
        thisWeapon.accuracy = thisWeapon.accuracy+Math.round(bat.vet*1);
    }
    if (weapon.dca === undefined) {
        thisWeapon.dca = 1;
    } else {
        thisWeapon.dca = weapon.dca;
    }
    if (weapon.hide === undefined) {
        thisWeapon.hide = false;
    } else {
        thisWeapon.hide = weapon.hide;
    }
    // Equipements qui changent l'arme
    thisWeapon = weaponEqChange(thisWeapon,wn,bat,batType);
    // tuning
    if (batType.cat != 'aliens' && thisWeapon.isMelee) {
        thisWeapon.rof = thisWeapon.rof*meleeROF;
    }
    // WSTAB
    if (thisWeapon.noStab) {
        if (hasEquip(bat,['wstab','wstabkit','e-stab'])) {
            thisWeapon.accuracy = thisWeapon.accuracy+3;
            if (thisWeapon.dca < 1) {
                thisWeapon.dca = 1;
            }
        }
    }
    // Equip adj
    if (thisWeapon.num === 1) {
        if (batType.skills.includes('detrange') && thisWeapon.range >= 1 && thisWeapon.name != 'Lance-flammes' && !thisWeapon.isMelee) {
            if (hasEquip(bat,['detector','g2ai'])) {
                if (thisWeapon.elevation === 1 && thisWeapon.range >= 2) {
                    thisWeapon.elevation = 2;
                }
                thisWeapon.range = thisWeapon.range+1;
            }
        }
        if (hasEquip(bat,['longtom','longtom1'])) {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (hasEquip(bat,['chargeur','chargeur1','w2-2ch'])) {
            if (thisWeapon.cost < 6 && playerInfos.comp.train < 1) {
                thisWeapon.accuracy = thisWeapon.accuracy-1;
                if (thisWeapon.cost >= 3) {
                    thisWeapon.cost = thisWeapon.cost+1;
                }
            }
        }
        if (hasEquip(bat,['lunette','lunette1'])) {
            if (playerInfos.comp.train < 1 && thisWeapon.cost > 1) {
                thisWeapon.cost = thisWeapon.cost+1;
            }
        }
        if (hasEquip(bat,['lunette','lunette1','kit-chouf','landerwkit'])) {
            if (batType.skills.includes('lurange')) {
                let tgr = getTGuetRange();
                thisWeapon.range = thisWeapon.range+tgr.range;
                thisWeapon.elevation = thisWeapon.elevation+tgr.elev;
            } else if (batType.skills.includes('fly') || batType.skills.includes('transorbital')) {
                thisWeapon.range = thisWeapon.range+1;
            } else {
                thisWeapon.elevation = thisWeapon.elevation+1;
            }
            let accuBonus = Math.floor((weapon.accuracy-13)/1.7);
            if (accuBonus > 8) {
                accuBonus = 8;
            }
            thisWeapon.accuracy = thisWeapon.accuracy+accuBonus;
        }
        if (hasEquip(bat,['silencieux','silencieux1','kit-chouf'])) {
            thisWeapon.noise = thisWeapon.noise-1;
            if (thisWeapon.noise <= 0 && !thisWeapon.isMelee) {
                thisWeapon.hide = true;
            }
        }
        if (hasEquip(bat,['muffler'])) {
            thisWeapon.noise = thisWeapon.noise-2;
        }
    } else if (thisWeapon.num === 2) {
        if (batType.skills.includes('detrange') && thisWeapon.range >= 1 && thisWeapon.name != 'Lance-flammes' && !thisWeapon.isMelee) {
            if (hasEquip(bat,['detector','g2ai'])) {
                if (thisWeapon.elevation === 1 && thisWeapon.range >= 2) {
                    thisWeapon.elevation = 2;
                }
                thisWeapon.range = thisWeapon.range+1;
            }
        }
        if (hasEquip(bat,['longtom','longtom2'])) {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (hasEquip(bat,['chargeur','chargeur2','w2-2ch'])) {
            if (thisWeapon.cost < 6 && playerInfos.comp.train < 1) {
                thisWeapon.accuracy = thisWeapon.accuracy-1;
                if (thisWeapon.cost >= 3) {
                    thisWeapon.cost = thisWeapon.cost+1;
                }
            }
        }
        if (hasEquip(bat,['lanceur','lancegren'])) {
            if (!batType.skills.includes('camo')) {
                thisWeapon.noise = thisWeapon.noise+1;
            }
            if (!batType.skills.includes('fly') && bat.eq != 'e-jetpack') {
                thisWeapon.range = thisWeapon.range+1;
                thisWeapon.elevation = thisWeapon.elevation+1;
            } else {
                thisWeapon.range = 2;
            }
        } else if (hasEquip(bat,['helper'])) {
            if (thisWeapon.name === 'Molotov' || thisWeapon.name === 'Grenade' || thisWeapon.name === 'Dynamite') {
                if (thisWeapon.range === 0) {
                    thisWeapon.range = 1;
                }
            }
            if (thisWeapon.name === 'Sling grenade') {
                thisWeapon.range = thisWeapon.range+1;
            }
        }
        if (hasEquip(bat,['lunette','lunette2'])) {
            if (playerInfos.comp.train < 1 && thisWeapon.cost > 1) {
                thisWeapon.cost = thisWeapon.cost+1;
            }
        }
        if (hasEquip(bat,['lunette','lunette2','kit-chouf'])) {
            if (batType.skills.includes('lurange')) {
                let tgr = getTGuetRange();
                thisWeapon.range = thisWeapon.range+tgr.range;
                thisWeapon.elevation = thisWeapon.elevation+tgr.elev;
            } else if (batType.skills.includes('fly')) {
                thisWeapon.range = thisWeapon.range+1;
            } else {
                thisWeapon.elevation = thisWeapon.elevation+1;
            }
            let accuBonus = Math.floor((weapon.accuracy-13)/1.7);
            if (accuBonus > 8) {
                accuBonus = 8;
            }
            thisWeapon.accuracy = thisWeapon.accuracy+accuBonus;
        }
        if (hasEquip(bat,['silencieux','silencieux2','kit-chouf'])) {
            thisWeapon.noise = thisWeapon.noise-1;
            if (thisWeapon.noise <= 0 && !thisWeapon.isMelee) {
                thisWeapon.hide = true;
            }
        }
        if (hasEquip(bat,['muffler'])) {
            thisWeapon.noise = thisWeapon.noise-2;
        }
    }
    if (hasEquip(bat,['e-camo']) && batType.skills.includes('camo')) {
        if (thisWeapon.noise <= 0 && !thisWeapon.isMelee) {
            thisWeapon.hide = true;
        }
    }
    if (hasEquip(bat,['g2siege'])) {
        if (thisWeapon.name.includes('Baliste')) {
            thisWeapon.range = thisWeapon.range+1;
            thisWeapon.rof = thisWeapon.rof*1.5;
            if (batType.maxSalvo === 1) {
                thisWeapon.rof = thisWeapon.rof*1.5;
            } else if (batType.maxSalvo === 2) {
                thisWeapon.noBis = false;
            } else {
                thisWeapon.rof = thisWeapon.rof*1.5;
            }
        }
        if (thisWeapon.name.includes('Catapulte')) {
            thisWeapon.range = thisWeapon.range+1;
            if (batType.maxSalvo === 1) {
                thisWeapon.rof = thisWeapon.rof*1.5;
            } else if (batType.maxSalvo === 2) {
                thisWeapon.noBis = false;
            } else {
                thisWeapon.rof = thisWeapon.rof*1.5;
            }
        }
    }
    if (hasEquip(bat,['theeye','ciberkit'])) {
        if (thisWeapon.aoe === 'unit' || (thisWeapon.aoe === 'brochette' && thisWeapon.name.includes('lister'))) {
            if (thisWeapon.range >= 2 || thisWeapon.elevation >= 4) {
                thisWeapon.range = thisWeapon.range+1;
                thisWeapon.accuracy = thisWeapon.accuracy+6;
            } else if (thisWeapon.elevation >= 1) {
                thisWeapon.elevation = thisWeapon.elevation+1;
                thisWeapon.accuracy = thisWeapon.accuracy+6;
            } else {
                thisWeapon.accuracy = thisWeapon.accuracy+3;
            }
        }
        if (thisWeapon.cost >= 2) {
            thisWeapon.cost = thisWeapon.cost-1;
        }
    }
    if (thisWeapon.maxAmmo > 1) {
        if (playerInfos.bldList.includes('Usine d\'armement')) {
            thisWeapon.maxAmmo = Math.round(thisWeapon.maxAmmo*1.5);
        } else if (playerInfos.bldList.includes('Arsenal')) {
            thisWeapon.maxAmmo = Math.round(thisWeapon.maxAmmo*1.25);
        }
        if (hasEquip(bat,['gilet']) && thisWeapon.maxAmmo < 99) {
            thisWeapon.maxAmmo = Math.floor(thisWeapon.maxAmmo*1.5);
            if (thisWeapon.maxAmmo < 16) {
                thisWeapon.maxAmmo = 16;
            }
        }
        if (hasEquip(bat,['hangard']) && thisWeapon.maxAmmo < 99) {
            thisWeapon.maxAmmo = Math.floor(thisWeapon.maxAmmo*2.5);
        }
        if (hasEquip(bat,['carrousel','carrousel1','carrousel2']) && thisWeapon.maxAmmo < 99) {
            thisWeapon.maxAmmo = Math.floor(thisWeapon.maxAmmo*1.35);
            if (thisWeapon.maxAmmo < 16) {
                thisWeapon.maxAmmo = 16;
            }
        }
    }
    if (bat.tdc.includes('fineclub')) {
        if (thisWeapon.name === 'Batte') {
            thisWeapon.power = thisWeapon.power+1;
            thisWeapon.armors = 1;
        } else if (thisWeapon.name === 'Torche') {
            thisWeapon.rof = thisWeapon.rof*1.2;
        } else if (thisWeapon.name === 'Toothbrush') {
            thisWeapon.rof = thisWeapon.rof*1.25;
            thisWeapon.armors = 0.4;
        }
    }
    if (bat.tdc.includes('finegun')) {
        if (thisWeapon.name === 'Calibre') {
            thisWeapon.rof = thisWeapon.rof*1.25;
            thisWeapon.armors = 0.9;
        } else if (thisWeapon.name === 'Magnum') {
            thisWeapon.rof = thisWeapon.rof*1.15;
            thisWeapon.power = thisWeapon.power+1;
        } else if (thisWeapon.name === 'Revolver') {
            thisWeapon.rof = thisWeapon.rof*1.2;
        }
    }
    if (bat.eq === 'kit-lightning') {
        if (thisWeapon.num === 1) {
            thisWeapon.armors = 0.5;
            thisWeapon.accuracy = thisWeapon.accuracy+5;
        }
    }
    if (bat.eq === 'kit-garde' || bat.eq === 'kit-guetteur') {
        if (thisWeapon.num === 1) {
            thisWeapon.noDef = true;
        }
    }
    if (bat.eq === 'w2-pplasma' || bat.eq === 'w2-magnum') {
        if (thisWeapon.num === 1) {
            thisWeapon.noDef = true;
            thisWeapon.noAtt = true;
        }
    }
    // GENHAB
    if (bat.tags.includes('genstrong')) {
        if (thisWeapon.isMelee || thisWeapon.name.includes('Javelot')) {
            thisWeapon.power = thisWeapon.power+4;
        }
    }
    if (bat.tags.includes('genblind')) {
        if (thisWeapon.range === 0 || thisWeapon.aoe === 'squad' || thisWeapon.aoe === 'bat') {
            thisWeapon.accuracy = Math.ceil(thisWeapon.accuracy*0.85);
        } else {
            thisWeapon.accuracy = Math.ceil(thisWeapon.accuracy*0.75);
        }
    }
    // bonus ammo
    let myAmmo = bat.ammo;
    if (wn === 'w2') {
        myAmmo = bat.ammo2;
        if (bat.eq === 'arrosoir') {
            myAmmo = 'fuel';
        }
    } else if (wn === 'w3') {
        myAmmo = batType.weapon3.ammo[0];
    }
    let ammoIndex = ammoTypes.findIndex((obj => obj.name == myAmmo));
    let ammo = ammoTypes[ammoIndex];
    thisWeapon.ammo = myAmmo;
    if (ammo.apweb) {
        thisWeapon.apWeb = true;
    } else {
        thisWeapon.apWeb = false;
    }
    if (ammo.passprotect) {
        thisWeapon.passprotect = true;
    } else {
        thisWeapon.passprotect = false;
    }
    if (ammo.aignore != undefined) {
        thisWeapon.aignore = ammo.aignore;
    } else {
        thisWeapon.aignore = 0;
    }
    if (ammo.elevation != undefined) {
        if (thisWeapon.range >= 1 && !thisWeapon.isShort) {
            thisWeapon.elevation = thisWeapon.elevation+ammo.elevation;
        }
    }
    if (playerInfos.comp.pyro === 3) {
        if (thisWeapon.ammo.includes('feu') || thisWeapon.ammo.includes('incendiaire') || thisWeapon.ammo.includes('napalm') || thisWeapon.ammo.includes('fire') || thisWeapon.ammo.includes('pyratol') || thisWeapon.ammo.includes('lf-') || thisWeapon.ammo.includes('lt-') || thisWeapon.ammo.includes('molotov')) {
            thisWeapon.armors = thisWeapon.armors*0.8;
        }
    }
    // SOUND
    if (ammo.sound != undefined) {
        if (ammo.sound[thisWeapon.sound] != undefined) {
            thisWeapon.sound = ammo.sound[thisWeapon.sound];
        }
    }
    // spiderRG
    if (!thisWeapon.isMelee && spiderRG && batType.kind === 'spider') {
        if (thisWeapon.range === 0) {
            thisWeapon.range = 1;
        } else if (thisWeapon.range === 1) {
            thisWeapon.range = 2;
        } else {
            thisWeapon.range = Math.ceil(thisWeapon.range*1.5);
        }
    }
    thisWeapon.power = Math.round(thisWeapon.power*ammo.powermult);
    thisWeapon.power = thisWeapon.power+ammo.power;
    thisWeapon.apdamage = ammo.apdamage;
    let thisAmmoArmors = ammo.armors;
    if (ammo.avar != undefined) {
        let avarComp = playerInfos.comp[ammo.avar];
        if (avarComp >= 2) {
            thisAmmoArmors = thisAmmoArmors*2.75/(avarComp+2);
        }
    }
    thisWeapon.armors = thisWeapon.armors*thisAmmoArmors;
    thisWeapon.armors = thisWeapon.armors.toFixedNumber(2);
    if (ammo.aoe != '' && thisWeapon.aoe != 'bat') {
        thisWeapon.aoe = ammo.aoe;
    }
    if (ammo.accuracy < 1 || thisWeapon.isMelee || thisWeapon.aoe != 'unit' || ammo.name.includes('web') || ammo.name.includes('marq') || ammo.name.includes('snake') || ammo.name.includes('teflon') || ammo.name.includes('adamantium') || ammo.name.includes('needle')) {
        thisWeapon.accuracy = Math.round(thisWeapon.accuracy*ammo.accuracy);
        thisWeapon.rof = thisWeapon.rof*ammo.rof;
    } else {
        if (thisWeapon.accuracy >= 32) {
            thisWeapon.accuracy = Math.round(thisWeapon.accuracy*ammo.accuracy);
        } else {
            thisWeapon.rof = thisWeapon.rof*ammo.rof;
            thisWeapon.accuracy = Math.round(thisWeapon.accuracy*(((ammo.accuracy-1)/3)+1));
        }
    }
    // helper
    if (hasEquip(bat,['helper','ciberkit']) && (thisWeapon.isMelee || thisWeapon.name.includes('Javelot'))) {
        thisWeapon.power = Math.round(thisWeapon.power*1.33);
    }
    // sila drug
    if (bat.tags.includes('sila')) {
        if (thisWeapon.isMelee || thisWeapon.name.includes('Javelot')) {
            thisWeapon.power = thisWeapon.power+3;
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
    // eatpoison & frenzy
    if (batType.skills.includes('eatpoison') && bat.tags.includes('regeneration')) {
        thisWeapon.rof = thisWeapon.rof*2;
    }
    // skills
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    // BAT RANGE
    if (bat.range < thisWeapon.range) {
        bat.range = thisWeapon.range;
    }
    // ERUPTIONS
    if (thisWeapon.name === 'Eruption') {
        thisWeapon.power = thisWeapon.power+Math.floor((zone[0].mapDiff-1)/1.8/22*thisWeapon.power);
        let lastStand = checkLastStand();
        if (batType.skills.includes('aimcfo')) {
            if (lastStand.go) {
                thisWeapon.range = thisWeapon.range+17;
                thisWeapon.elevation = 4;
                if (!bat.tags.includes('suicide')) {
                    bat.tags.push('suicide');
                }
            }
        }
    }
    if (batType.name === 'Ruche') {
        if (colonyTiles.includes(bat.tileId)) {
            thisWeapon.range = thisWeapon.range+5;
            thisWeapon.power = thisWeapon.power+zone[0].mapDiff-5;
        }
    }
    // RANGE ADJUSTMENTS
    // Elevation
    let infra = '';
    if (batType.cat != 'aliens') {
        if (!batType.skills.includes('machine')) {
            if (batType.cat != 'vehicles' || batType.skills.includes('robot') || batType.skills.includes('cyber')) {
                if (tile.infra != undefined && tile.infra != 'Débris' && tile.infra != 'Terriers') {
                    infra = tile.infra;
                }
            }
        }
    }
    let highGround = 0;
    if (tile.terrain == 'M') {
        if (infra != '') {
            highGround = 2;
        } else {
            highGround = 2;
        }
    } else if (tile.terrain == 'H') {
        if (infra != '' || batType.skills.includes('transorbital')) {
            highGround = 2;
        } else {
            highGround = 1;
        }
    } else {
        if (infra != '' || batType.skills.includes('transorbital')) {
            highGround = 1;
        } else {
            highGround = 0;
        }
    }
    let highTower = 0;
    if (batType.cat === 'buildings') {
        if (playerInfos.comp.const+playerInfos.comp.def >= 5) {
            highTower = 2;
        } else if (playerInfos.comp.const+playerInfos.comp.def >= 4) {
            highTower = 1;
        }
    }
    highGround = highGround+highTower;
    if (highGround > 2) {
        highGround = 2;
    }
    if (infra === 'Miradors' || infra === 'Murailles') {
        if (!thisWeapon.isMelee && ((!thisWeapon.isShort && thisWeapon.range >= 1) || thisWeapon.range >= 2 || (thisWeapon.elevation >= 1 && thisWeapon.range >= 1))) {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (thisWeapon.name === 'Grenade' || thisWeapon.name === 'Molotov' || thisWeapon.name === 'Dynamite') {
            if (thisWeapon.range === 0 && thisWeapon.elevation === 0) {
                thisWeapon.range = 1;
            }
        }
        if (infra === 'Miradors' && thisWeapon.elevation >= 2 && thisWeapon.ammo.includes('salite')) {
            thisWeapon.range = thisWeapon.range+1;
        }
    }
    if (highGround === 1) {
        if (thisWeapon.elevation >= 3) {
            thisWeapon.range = thisWeapon.range+2;
        } else if (thisWeapon.elevation >= 1) {
            thisWeapon.range = thisWeapon.range+1;
        }
    } else if (highGround === 2) {
        thisWeapon.range = thisWeapon.range+thisWeapon.elevation;
    }
    // additional ranges
    if (!thisWeapon.isMelee) {
        if (!thisWeapon.name.includes('ombes')) {
            if ((!thisWeapon.isShort && thisWeapon.range >= 1) || thisWeapon.range >= 2 || thisWeapon.ammo.includes('lf-') || thisWeapon.ammo.includes('lt-') || (thisWeapon.elevation >= 1 && thisWeapon.range >= 1)) {
                // ammo range
                if (thisWeapon.range === 0 && ammo.range > 1) {
                    thisWeapon.range = 1;
                } else if (ammo.range > 1) {
                    thisWeapon.range = Math.ceil(thisWeapon.range*ammo.range);
                } else if (ammo.range < 1 && thisWeapon.range >= 4) {
                    thisWeapon.range = Math.floor(thisWeapon.range*ammo.range);
                    if (thisWeapon.range < 3) {
                        thisWeapon.range = 3;
                    }
                }
                // hero range
                if (bat.tags.includes('hero') && batType.skills.includes('herorange')) {
                    thisWeapon.range = thisWeapon.range+1;
                }
            }
        }
    }
    // SACLOS
    if (hasEquip(bat,['saclos'])) {
        if (thisWeapon.name.includes('Missile')) {
            if (thisWeapon.range < 11) {thisWeapon.range = 11;}
            thisWeapon.range = Math.ceil((thisWeapon.range-10)*1.6)+10;
            if (thisWeapon.range < 14) {thisWeapon.range = 14;}
        }
    }
    // Forêt (range)
    let overInfra = false;
    if (infra === 'Miradors' || infra === 'Murailles' || infra === 'Remparts') {
        overInfra = true;
    }
    if (tile.terrain == 'F' && !overInfra && batType.cat != 'buildings' && batType.cat != 'devices' && !batType.skills.includes('transorbital') && !batType.skills.includes('fly') && !bat.eq != 'e-jetpack') {
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
    if (thisWeapon.range >= 2 && (tile.terrain == 'W' || tile.terrain == 'L' || tile.terrain == 'R') && !batType.skills.includes('fly') && !batType.skills.includes('hover') && batType.cat != 'buildings' && !batType.skills.includes('transorbital')) {
        thisWeapon.range = thisWeapon.range-1;
    }
    // vue
    if (zone[0].dark) {
        let vue = calcVue(bat,batType);
    }
    if (bat.tags.includes('fogged') && thisWeapon.range > 1) {
        thisWeapon.range = 1;
    }
    // needle max range
    if (ammo.maxrange != undefined) {
        if (thisWeapon.range > ammo.maxrange) {
            thisWeapon.range = ammo.maxrange;
        }
    }
    // wipeout missile range
    if (thisWeapon.name === 'Missiles wipeout') {
        thisWeapon.range = ((playerInfos.comp.det+playerInfos.comp.arti)*3)+15;
        if (playerInfos.bldList.includes('Centre de com')) {
            thisWeapon.range = thisWeapon.range*2;
        }
    }
    // hero rage
    if (bat.tags.includes('rage')) {
        if (thisWeapon.isMelee || thisWeapon.name.includes('Javelot')) {
            thisWeapon.power = thisWeapon.power+Math.round(Math.sqrt(thisWeapon.power)*1.42);
        }
        if (batType.cat === 'aliens') {
            thisWeapon.accuracy = thisWeapon.accuracy+6;
        }
    }
    // ROF round
    if (thisWeapon.ammo.includes('disco')) {
        thisWeapon.rof = thisWeapon.rof*Math.round(5.56*Math.sqrt(playerInfos.comp.ca+2)*(playerInfos.comp.energ+6))/100;
    }
    thisWeapon.rof = Math.round(thisWeapon.rof);
    // hero tornade cost
    if (bat.tags.includes('tornade')) {
        if (thisWeapon.cost < 1) {
            thisWeapon.cost = 1;
        }
    }
    // Deluge Cost
    if (thisWeapon.ammo === 'missile-deluge') {
        thisWeapon.cost = weapon.cost+1;
        thisWeapon.noDef = true;
    }
    if (thisWeapon.ammo === 'obus-deluge') {
        thisWeapon.cost = weapon.cost+1;
        thisWeapon.noDef = true;
    }
    // Type d'attaques
    if (thisWeapon.ammo.includes('feu') || thisWeapon.ammo.includes('incendiaire') || thisWeapon.ammo.includes('dragon') || thisWeapon.ammo.includes('napalm') || thisWeapon.ammo.includes('fire') || thisWeapon.ammo.includes('pyratol') || thisWeapon.ammo.includes('lf-') || thisWeapon.ammo.includes('lt-') || thisWeapon.ammo.includes('molotov') || thisWeapon.ammo.includes('laser')) {
        if (thisWeapon.ammo.includes('laser') || thisWeapon.ammo === 'incendiaire' || thisWeapon.ammo === 'ac-incendiaire' || thisWeapon.ammo === 'sm-incendiaire' || thisWeapon.ammo === 'fleche-incendiaire') {
            thisWeapon.isHot = true;
            thisWeapon.isFire = false;
        } else {
            thisWeapon.isHot = false;
            thisWeapon.isFire = true;
        }
    } else {
        thisWeapon.isHot = false;
        thisWeapon.isFire = false;
    }
    if (thisWeapon.ammo.includes('electric') || thisWeapon.ammo.includes('taser') || thisWeapon.ammo.includes('eflash') || thisWeapon.ammo === 'marquage-stop') {
        thisWeapon.isElec = true;
    } else {
        thisWeapon.isElec = false;
    }
    if (thisWeapon.ammo.includes('explosive') || thisWeapon.ammo === 'missile-sunburst' || thisWeapon.ammo === 'missile-tungsten' || thisWeapon.ammo === 'missile-fleche' || thisWeapon.ammo === 'obus-tungsten' || thisWeapon.ammo === 'obus-fleche') {
        thisWeapon.isExplo = true;
    } else {
        thisWeapon.isExplo = false;
    }
    if (thisWeapon.ammo.includes('nanite') || thisWeapon.ammo === 'suicide' || thisWeapon.ammo === 'suicide-deluge' || thisWeapon.ammo.includes('mine') || thisWeapon.ammo.includes('autodes') || thisWeapon.ammo.includes('dynamite') || thisWeapon.ammo.includes('bombe') || thisWeapon.ammo.includes('explosif') || thisWeapon.ammo.includes('obus') || thisWeapon.ammo.includes('missile') || thisWeapon.ammo.includes('grenade') || thisWeapon.ammo.includes('disco') || thisWeapon.ammo === 'marquage-kill') {
        if (!thisWeapon.ammo.includes('gaz') && !thisWeapon.ammo.includes('jello') && !thisWeapon.ammo.includes('incendiaire') && !thisWeapon.ammo.includes('napalm') && !thisWeapon.isExplo) {
            thisWeapon.isBlast = true;
        } else {
            thisWeapon.isBlast = false;
        }
    } else {
        thisWeapon.isBlast = false;
    }
    if (thisWeapon.ammo.includes('gaz')) {
        thisWeapon.isGas = true;
    } else {
        thisWeapon.isGas = false;
    }
    if (thisWeapon.name.includes('acide') || thisWeapon.ammo.includes('ruche')) {
        thisWeapon.isAcid = true;
    } else {
        thisWeapon.isAcid = false;
    }
    if (thisWeapon.isMelee || thisWeapon.noShield || thisWeapon.ammo.includes('adamantium') || thisWeapon.ammo.includes('-sunburst')) {
        thisWeapon.noShield = true;
        thisWeapon.minShield = false;
        thisWeapon.lowShield = false;
    } else if (thisWeapon.ammo.includes('bfg') || thisWeapon.ammo.includes('laser') || thisWeapon.ammo.includes('autodes') || thisWeapon.ammo.includes('mine') || thisWeapon.ammo.includes('suicide') || thisWeapon.ammo.includes('obus-fleche') || thisWeapon.ammo.includes('missile-fleche') || thisWeapon.ammo.includes('gaz')) {
        thisWeapon.noShield = false;
        thisWeapon.minShield = true;
        thisWeapon.lowShield = false;
    } else if (thisWeapon.aoe === 'bat') {
        thisWeapon.noShield = false;
        thisWeapon.minShield = false;
        thisWeapon.lowShield = true;
    } else {
        thisWeapon.noShield = false;
        thisWeapon.minShield = false;
        thisWeapon.lowShield = false;
    }
    if (thisWeapon.ammo.includes('laser') && thisWeapon.name != 'Canon laser') {
        thisWeapon.noEsc = true;
    } else {
        thisWeapon.noEsc = false;
    }
    if (thisWeapon.name.includes('Bélier') || thisWeapon.name.includes('Boutoir') || thisWeapon.name.includes('Moisso') || thisWeapon.name.includes('Scie') || thisWeapon.name.includes('Tronço')) {
        thisWeapon.isSaw = true;
    } else {
        thisWeapon.isSaw = false;
    }
    // console.log(thisWeapon);
    return thisWeapon;
};

function getTGuetRange() {
    let tgr = {};
    tgr.range = 1;
    tgr.elev = 0
    if (playerInfos.comp.det === 3) {
        tgr.range = 2;
    } else if (playerInfos.comp.det === 4) {
        tgr.range = 3;
    } else if (playerInfos.comp.det === 5) {
        tgr.range = 5;
    }
    if (playerInfos.comp.bal === 2) {
        tgr.elev = 1;
    } else if (playerInfos.comp.bal === 3) {
        tgr.elev = 2;
    }
    return tgr;
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

function calcTirFurtif(weap,bat,distance) {
    let tirFurtif = 0;
    if (bat.fuzz <= -2) {
        if (weap.noise < 2 || (weap.noise < 4 && distance >= 3)) {
            let batType = getBatType(bat);
            tirFurtif = calcCamo(bat);
            let distAdj = distance;
            if (batType.skills.includes('meleecam') && distance === 0) {
                distAdj = distAdj+2;
            }
            tirFurtif = tirFurtif+(distAdj*20)-20;
            if (weap.noise > 0) {
                tirFurtif = Math.round(tirFurtif/(weap.noise+3)*4/1.5);
            } else {
                tirFurtif = Math.round(tirFurtif/1.15);
            }
            if (batType.cat === 'buildings' || batType.cat === 'devices' || batType.skills.includes('transorbital')) {
                tirFurtif = Math.round(tirFurtif*1.33);
            }
        }
    }
    if (tirFurtif >= stealthMaxChance) {
        tirFurtif = stealthMaxChance;
    }
    console.log('tirFurtif='+tirFurtif);
    return tirFurtif;
};

function calcShotDice(bat,luckyshot) {
    let badLuck = 100;
    let goodLuck = 1;
    let luckDice = rand.rand(goodLuck,badLuck);
    if (bat.team == 'player') {
        if (playerInfos.comp.train === 1) {
            luckDice = luckDice-2;
        } else if (playerInfos.comp.train === 2) {
            luckDice = luckDice-3;
        } else if (playerInfos.comp.train === 3) {
            luckDice = luckDice-5;
        }
    }
    if (bat.team == 'player') {
        if (bat.tags.includes('lucky')) {
            luckDice = rand.rand(0,115);
        }
        if (luckyshot) {
            $('#report').append('<span class="report cy">Lucky shot!</span><br>');
            bat.tags.push('lucky');
            return 33;
        } else if (luckDice <= luckCheck[0]) {
            $('#report').append('<span class="report cy">Lucky shot!</span><br>');
            return 50;
        } else if (luckDice <= luckCheck[1] || bat.tags.includes('kill') || bat.tags.includes('rage')) {
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

function apCostRiposte(bat,batType,weap) {
    let apCost = 1;
    if (batType.skills.includes('guerrilla') || batType.skills.includes('infrip')) {
        apCost = 0;
    } else {
        if (weap.cost <= 1) {
            apCost = 0;
        } else if (weap.cost === 2) {
            apCost = 1;
        } else if (weap.cost <= 5) {
            apCost = 2;
        } else {
            apCost = 3;
        }
    }
    if (bat.tags.includes('mining')) {
        apCost = apCost+2;
    }
    if (batType.cat === 'aliens') {
        if (weap.num === 2 && batType.w2chance > 2) {
            apCost = apCost+((batType.w2chance-2)*2);
        }
    }
    return apCost;
};

function chargeurAdj(bat,shots,weap) {
    let newShots = shots;
    let hasChargeur = false;
    if (weap.num === 1) {
        if (hasEquip(bat,['chargeur','chargeur1','w2-2ch','kit-milice','landerwkit','fakit'])) {
            hasChargeur = true;
        }
    } else {
        if (hasEquip(bat,['chargeur','chargeur2','w2-2ch','kit-chouf'])) {
            hasChargeur = true;
        }
    }
    if (weap.noStab) {
        if (hasEquip(bat,['wstabkit'])) {
            hasChargeur = true;
        }
    }
    let hasCarrousel = false;
    if (weap.num === 1) {
        if (hasEquip(bat,['carrousel','carrousel1'])) {
            hasCarrousel = true;
        }
    } else {
        if (hasEquip(bat,['carrousel','carrousel2'])) {
            hasCarrousel = true;
        }
    }
    if (hasChargeur) {
        let mult = 1.5;
        if (weap.name.includes('Calibre') || weap.name.includes('verrou') || weap.name.includes('Nailgun')) {
            mult = 2;
        }
        if (weap.name.includes('Revolver') || weap.name.includes('pompe') || weap.name.includes('Blister pistol')) {
            mult = 1.7;
        }
        if (weap.name.includes('assaut') || weap.name.includes('itrail') || weap.name.includes('ulfat') || weap.name.includes('Minigun') || weap.name.includes('semi-auto') || weap.name.includes('BFG') || (weap.name.includes('Blister') && !weap.name.includes('pistol'))) {
            mult = 1.33;
        }
        if (weap.name === 'Autopistol' || weap.name === 'Tourelles auto') {
            mult = 1.25;
        }
        if (bat.eq.includes('kit-chouf')) {
            mult = 2;
        }
        if (hasEquip(bat,['landerwkit'])) {
            mult = mult+0.17;
        }
        newShots = Math.round(newShots*mult);
    } else if (hasCarrousel) {
        newShots = Math.round(newShots*1.25);
    } else if (hasEquip(bat,['helper'])) {
        if (!weap.isMelee && !weap.name.includes('Javelot')) {
            newShots = Math.round(newShots*1.25);
        }
    }
    return newShots;
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
    // GUET
    if (guet || batType.skills.includes('sentinelle') || hasEquip(bat,['detector','g2ai']) || batType.skills.includes('initiative') || batType.skills.includes('after')) {
        brideDef = 1;
    }
    // Defense, Bastion
    if (batType.skills.includes('bastion') && (weap.num === 1 || !weap.noBis)) {
        brideDef = brideDef*2;
    } else if (batType.skills.includes('defense') && (weap.num === 1 || !weap.noBis)) {
        brideDef = brideDef*1.35;
    }
    // disco
    if (weap.ammo === 'disco') {
        brideDef = brideDef*1.5;
    }
    // baddef
    if (batType.skills.includes('baddef')) {
        if (guet || batType.skills.includes('sentinelle') || hasEquip(bat,['detector','g2ai']) || batType.skills.includes('initiative') || batType.skills.includes('after')) {
            brideDef = brideDef/1.17;
        } else {
            brideDef = brideDef/1.5;
        }
    }
    // tirailleur
    if (brideDef < 1) {
        if (batType.skills.includes('tirailleur') && bat.oldTileId != bat.tileId) {
            let gmin = 0.75;
            let gmax = 1;
            if (batType.skills.includes('baddef')) {
                gmin = 0.5;
                gmax = 0.85;
            }
            if (batType.team === 'player') {
                gmin = gmin+(playerInfos.comp.train/5);
                gmax = gmax+(playerInfos.comp.train/5);
            }
            if (brideDef < gmax) {
                brideDef = brideDef*1.25;
                if (brideDef > gmax) {
                    brideDef = gmax;
                }
            }
            if (brideDef < gmin) {
                brideDef = gmin;
            }
        }
    }
    if (batType.skills.includes('infrip')) {
        let ripFactor = ((bat.salvoLeft/2)+4)/4;
        if (ripFactor < 0.2) {
            ripFactor = 0.2;
        }
        brideDef = brideDef*ripFactor;
    }
    if (weap.name === 'Autopistol' || weap.name === 'Tourelles auto') {
        brideDef = 1;
    }
    return brideDef;
}

function mirDestruction(weap,bat,batType,tile,teamOnMir,infraName) {
    let armours = weap.armors;
    if (weap.ammo.includes('electric')) {
        armours = 1;
    }
    if (armours < 0.2) {
        armours = 0.2;
    }
    let power = (weap.power*1.5/(armours*2))-2;
    if (power < 0) {
        power = 0;
    }
    let damage = Math.round(weap.rof*power*bat.squadsLeft);
    if (weap.ammo.includes('feu') || weap.ammo.includes('napalm') || weap.ammo.includes('fire') || weap.ammo.includes('pyratol') || weap.ammo.includes('lf-') || weap.ammo.includes('molotov') || weap.ammo.includes('nanite') || weap.ammo === 'suicide' || weap.ammo === 'suicide-deluge' || weap.ammo.includes('mine') || weap.ammo.includes('autodes') || weap.ammo.includes('dynamite') || weap.ammo.includes('bombe') || weap.ammo.includes('explosif') || weap.ammo.includes('obus') || weap.ammo.includes('missile') || weap.ammo.includes('glair') || weap.ammo.includes('ruche') || weap.ammo.includes('bfg')) {
        if (batType.cat === 'aliens') {
            damage = damage*3;
        } else {
            damage = Math.round(damage/1.5);
        }
    } else if (weap.ammo.includes('troueur') || weap.ammo.includes('acide') || weap.ammo.includes('spit') || weap.ammo.includes('grenade') || weap.ammo.includes('lt-') || weap.ammo.includes('incendiaire')) {
        if (batType.cat === 'aliens') {
            damage = Math.round(damage*1.5);
        } else {
            damage = Math.round(damage/5);
        }
    } else if (batType.team === 'player') {
        damage = 0;
    }
    if (batType.size >= 25) {
        damage = Math.round(damage*Math.sqrt(batType.size)/5);
    }
    if (batType.skills.includes('destructeur')) {
        damage = Math.round(damage*1.5);
    }
    if (weap.aoe === 'squad') {
        damage = Math.round(damage*2);
    } else if (weap.aoe === 'bat') {
        damage = Math.round(damage*4);
    }
    if (weap.ammo.includes('eflash') || weap.ammo.includes('psionics')) {
        damage = 0;
    }
    // console.log('MirDamage='+damage);
    let breakChance = Math.floor(damage/20);
    if (infraName === 'Palissades') {
        if (damage >= 600) {
            breakChance = Math.floor(damage/120);
        } else {
            breakChance = 0;
        }
    } else if (infraName === 'Remparts') {
        if (damage >= 1800) {
            breakChance = Math.floor(damage/360);
        } else {
            breakChance = 0;
        }
    }
    if (zone[0].number >= 70 && zone[0].number <= 74) {
        breakChance = 0;
    }
    // console.log('breakChance='+breakChance);
    if (rand.rand(1,100) <= breakChance) {
        warning('Destruction',bat.type+' a détruit les '+infraName);
        tile.infra = 'Débris';
        if (teamOnMir === 'player') {
            if (selectedBat.team === 'player') {
                tagDelete(selectedBat,'guet');
                tagDelete(selectedBat,'fortif');
                tagDelete(selectedBat,'camo');
                selectedBat.fuzz === selectedBatType.fuzz;
            } else if (targetBat.team === 'player') {
                tagDelete(targetBat,'guet');
                tagDelete(targetBat,'fortif');
                tagDelete(targetBat,'camo');
                targetBat.fuzz === targetBatType.fuzz;
            }
        }
    }
};

function checkDisease(giveBatType,damage,haveBat,haveBatType,terrain) {
    let getIt = false;
    if (!haveBat.tags.includes('maladie')) {
        if (giveBatType.skills.includes('maladie') || giveBatType.skills.includes('chancre')) {
            if ((haveBatType.cat == 'infantry' && !haveBatType.skills.includes('mutant') && !haveBat.tags.includes('zombie')) || haveBatType.cat == 'aliens') {
                let dmgReduct = getDamageRed('sans',haveBat,haveBatType);
                let disResist = unitResist+(dmgReduct*3);
                let getChance = (damage*5)+7-disResist;
                if (giveBatType.skills.includes('chancre')) {
                    getChance = getChance*3;
                } else {
                    getChance = Math.ceil(getChance/(playerInfos.comp.ca+5)*5);
                }
                if (terrain.name === 'S') {
                    getChance = getChance+25;
                }
                if (getChance > 42-(disResist*3) && !giveBatType.skills.includes('chancre')) {
                    getChance = 42-(disResist*3);
                }
                if (getChance < 13-disResist && damage >= 1) {
                    getChance = 13-disResist;
                }
                if (rand.rand(1,100) <= getChance) {
                    getIt = true;
                }
            }
        }
    }
    return getIt;
};

function isOnGround(bat,batType,tile) {
    let onGround = true;
    if (batType.skills.includes('fly') || batType.skills.includes('jetpack') || bat.eq === 'e-jetpack') {
        onGround = false;
    }
    if (tile.rd || tile.ruins) {
        onGround = false;
    }
    if (bonusInfra(batType,tile.infra)) {
        onGround = false;
    }
    return onGround;
};

function getWetness(terrain,onGround) {
    let wetness = 0;
    if (onGround) {
        if (terrain.name === 'W' || terrain.name === 'R' || terrain.name == 'L') {
            wetness = wetness+3;
        } else {
            if (zone[0].snd === 'rainforest' || zone[0].snd === 'thunderstart' || zone[0].snd === 'thunderfull' || zone[0].snd === 'swamp' || zone[0].snd === 'uhuwind') {
                wetness = wetness+1;
                if (terrain.name === 'S') {
                    wetness = wetness+1;
                }
            } else if (zone[0].snd === 'monsoon') {
                wetness = wetness+2;
            } else if (terrain.name === 'S') {
                wetness = wetness+1;
            }
        }
    } else {
        if (zone[0].snd === 'rainforest' || zone[0].snd === 'thunderstart' || zone[0].snd === 'thunderfull' || zone[0].snd === 'swamp' || zone[0].snd === 'uhuwind') {
            wetness = wetness+1;
        } else if (zone[0].snd === 'monsoon') {
            wetness = wetness+2;
        }
    }
    return wetness;
};

function inWaterAdj(attWeap,defBat,defBatType,wetness) {
    if (wetness >= 1) {
        if (attWeap.ammo.includes('feu') || attWeap.ammo.includes('incendiaire') || attWeap.ammo.includes('napalm') || attWeap.ammo.includes('fire') || attWeap.ammo.includes('lf-') || attWeap.ammo.includes('lt-') || attWeap.ammo.includes('molotov')) {
            if (!attWeap.ammo.includes('pyratol') && !attWeap.ammo.includes('hellfire')) {
                if (attWeap.ammo.includes('incendiaire') || attWeap.ammo.includes('fireshells')) {
                    attWeap.power = Math.round(attWeap.power*0.9);
                } else {
                    attWeap.power = Math.round(attWeap.power*0.8);
                }
                if (wetness >= 2) {
                    if (attWeap.aoe === 'brochette') {
                        attWeap.aoe = 'unit';
                    } else if (attWeap.aoe === 'squad') {
                        attWeap.aoe = 'brochette';
                    } else if (attWeap.aoe === 'bat') {
                        attWeap.aoe = 'squad';
                    }
                }
            }
        }
        if (attWeap.ammo.includes('laser') || attWeap.ammo.includes('gaz')) {
            if (wetness >= 3) {
                attWeap.power = Math.round(attWeap.power*0.8);
            }
        }
        if (!defBatType.skills.includes('resistelec') && !defBat.tags.includes('resistelec') && (!defBatType.skills.includes('hover') || defBatType.cat === 'aliens')) {
            if (attWeap.ammo.includes('taser') || attWeap.ammo.includes('electric') || attWeap.ammo.includes('marquage-stop')) {
                if (wetness >= 2) {
                    attWeap.power = Math.round(attWeap.power*1.35);
                    if (attWeap.aoe === 'unit') {
                        attWeap.aoe = 'brochette';
                    } else if (attWeap.aoe === 'brochette') {
                        attWeap.aoe = 'squad';
                    } else {
                        attWeap.aoe = 'bat';
                    }
                } else if (wetness === 1 && defBatType.cat === 'aliens') {
                    attWeap.power = Math.round(attWeap.power*1.2);
                }
                if (attWeap.ammo.includes('marquage-stop')) {
                    attWeap.power = attWeap.power+2;
                }
            }
        }
        if (attWeap.ammo.includes('plastanium')) {
            if (wetness >= 2) {
                if (attWeap.aoe === 'unit') {
                    attWeap.aoe = 'brochette';
                } else if (attWeap.aoe === 'brochette') {
                    attWeap.aoe = 'squad';
                } else {
                    attWeap.aoe = 'bat';
                }
            }
            attWeap.power = Math.round(attWeap.power*(1+(wetness/3)));
        }
    }
    return attWeap;
};

function getAOEshots(attWeap,defBat,defBatType) {
    let aoeShots = 1;
    if (attWeap.aoe == "bat") {
        if (defBatType.squads === 6 && defBatType.squadSize === 1 && !attWeap.ammo.includes('gaz')) {
            aoeShots = 12;
        } else {
            aoeShots = defBatType.squadSize*defBat.squadsLeft;
        }
        if (aoeShots < 9) {
            aoeShots = 9;
        }
    } else if (attWeap.aoe != "unit") {
        if (defBatType.squads === 6 && defBatType.squadSize === 1) {
            aoeShots = 6;
        } else {
            aoeShots = defBatType.squadSize;
        }
        if (attWeap.aoe == "squad") {
            if (aoeShots < 4) {
                aoeShots = 4;
            }
        } else if (attWeap.aoe == "brochette") {
            if (aoeShots < 2) {
                aoeShots = 2;
            }
        }
    }
    return aoeShots;
}

function checkEscape(bat,batType) {
    let escaping = {};
    escaping.ok = false;
    escaping.speed = batType.speed-2;
    if (batType.skills.includes('escape')) {
        escaping.ok = true;
        if (batType.team === 'player') {
            escaping.speed = batType.speed+bat.vet-4;
        } else {
            escaping.speed = batType.speed-2;
        }
        if (hasEquip(bat,['e-stab'])) {
            escaping.speed = escaping.speed+2;
        }
        if (batType.skills.includes('dogescape')) {
            escaping.speed = escaping.speed+2;
        }
    }
    if (batType.team === 'player') {
        if (!escaping.ok) {
            if (batType.skills.includes('heroescape') && bat.tags.includes('hero')) {
                escaping.ok = true;
                escaping.speed = bat.vet*2;
            }
        }
        if (!escaping.ok) {
            if (playerInfos.comp.det >= 4) {
                if (hasEquip(bat,['detector','g2ai'])) {
                    if (batType.speed >= 2 && batType.size < 10) {
                        if (playerInfos.comp.robo >= 2 || playerInfos.comp.cyber >= 2) {
                            if (batType.skills.includes('robot') || batType.skills.includes('cyber')) {
                                escaping.ok = true;
                                escaping.speed = batType.speed+bat.vet-2;
                            }
                        }
                    }
                }
            }
        }
        if (!escaping.ok) {
            if (batType.skills.includes('fly') && !batType.skills.includes('jetpack') && batType.size < 12) {
                if (hasEquip(bat,['e-stab'])) {
                    escaping.ok = true;
                    escaping.speed = batType.speed+(bat.vet*2)-6;
                }
            }
        }
    }
    return escaping;
};

function calcEscape(bat,batType,weap,attBat,tile) {
    let escapeFactor = 1;
    let escaping = checkEscape(bat,batType);
    let hasEscape = escaping.ok;
    let escapeSpeed = escaping.speed;
    let weapCost = weap.cost;
    if (weap.name === 'Boutoir' || weap.name === 'Bélier' || weap.name === 'Moissonneuse') {
        let attBatType = getBatType(attBat);
        weapCost = 8-attBatType.speed;
    }
    console.log('ESCAPE = '+hasEscape);
    if (hasEscape && !weap.noEsc && !bat.tags.includes('stun') && !bat.tags.includes('freeze')) {
        if ((tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') || batType.skills.includes('fly')) {
            let escapeChance = Math.round(escapeSpeed*weap.cost*escapeValue);
            if (weap.aoe != 'unit' && weap.aoe != 'brochette' && !batType.skills.includes('fly')) {
                escapeChance = Math.round(escapeChance/3);
            }
            if (attBat.fuzz <= -2 && !weap.isMelee && !weap.isBow) {
                escapeChance = Math.round(escapeChance/2);
            }
            console.log('escapeChance:'+escapeChance);
            if (rand.rand(1,100) <= escapeChance) {
                escaped = true;
                let escapeVar = rand.rand(4,8);
                console.log('escapeVar:'+escapeVar);
                escapeFactor = escapeFactor*escapeVar/(weap.cost+4)/2;
            }
        }
    }
    return escapeFactor;
};

function getEggProtect(eggBat,eggBatType,weap) {
    let eggProt = 0;
    let maxProt = 100*(weap.armors+0.82);
    if (maxProt > 100) {maxProt = 100;}
    if (eggBatType.skills.includes('eggprotect')) {
        console.log(weap);
        console.log('EGGPROT )))))))))))))))');
        eggProt = 100-(1000/(10+((zone[0].mapDiff-1.25)*3.5)));
        if (!domeProtect && coconStats.dome && eggBatType.name != 'Colonie') {
            eggProt = eggProt+8;
        }
        console.log(eggProt);
        if (eggBatType.skills.includes('turnprotect')) {
            console.log('TURNPROT )))))))))))))))');
            if (!domeProtect) {
                eggProt = (eggProt*3/5)+(playerInfos.mapTurn*1.65);
            }
            if (eggProt > maxProt) {eggProt = maxProt;}
            console.log(eggProt);
            if (weap.noShield) {
                eggProt = eggProt*0.9;
            } else if (weap.minShield) {
                eggProt = eggProt*0.93;
            } else if (weap.lowShield) {
                eggProt = eggProt*0.95;
            }
            if (weap.ammo.includes('uridium')) {
                eggProt = eggProt*0.97;
            }
            console.log(eggProt);
        }
        if (playerInfos.comp.ca === 5) {
            eggProt = eggProt*0.94;
        } else if (playerInfos.comp.ca === 4) {
            eggProt = eggProt*0.98;
        }
        if (weap.ammo === 'suicide' || weap.ammo === 'suicide-deluge') {
            eggProt = eggProt*0.85;
        }
    }
    if (eggProt > maxProt) {eggProt = maxProt;}
    if (eggProt < 0) {eggProt = 0;}
    console.log(eggProt);
    eggProt = Math.round(eggProt);
    return eggProt;
};

function getRipNum(bat,batType) {
    let ripNum = 4+bat.salvoLeft;
    if (batType.skills.includes('guerrilla') || batType.skills.includes('baddef')) {
        ripNum = ripNum-1;
    }
    if (batType.skills.includes('onedef')) {
        ripNum = ripNum-3;
    }
    if (batType.skills.includes('gooddef') || bat.eq.includes('w2-auto') || bat.eq.includes('w3-auto')) {
        ripNum = ripNum+2;
    }
    if (bat.tags.includes('hero') && batType.skills.includes('herorip')) {
        ripNum = ripNum+3;
    }
    if (ripNum < 0) {
        ripNum = 0;
    }
    return ripNum;
};

function genocide(genoBatType) {
    aliens.forEach(function(bat) {
        if (!bat.tags.includes('shinda')) {
            let batType = getBatType(bat);
            if (batType.id === genoBatType.id) {
                bat.tags.push('shinda');
            }
        }
    });
};

function getRealNoise(weap,batType) {
    let realNoise = 0;
    if (batType.cat === 'aliens') {
        realNoise = 0;
    } else {
        let weapPower = 4;
        if (weap.num == 1) {
            weapPower = batType.weapon.power;
        } else {
            weapPower = batType.weapon2.power;
        }
        let hasNoise = false;
        if (weap.ammo.includes('laser') && weapPower >= 15) {
            hasNoise = true;
        } else if (!weap.ammo.includes('lf-') && !weap.ammo.includes('lt-') && weapPower >= 6 && weap.noise >= 3) {
            hasNoise = true;
        }
        if (hasNoise) {
            realNoise = 1;
            if (weapPower >= 8) {
                realNoise++;
            }
            if (weapPower >= 18) {
                realNoise++;
            }
            if (weap.noise >= 4) {
                realNoise++;
            }
        }
    }
    // realNoise between 0 and 4
    return realNoise;
};

function realNoiseAlert(weap,batType,tileId) {
    if (batType.team === 'player') {
        let realNoise = getRealNoise(weap,batType);
        if (realNoise >= 1) {
            let theChance = Math.round(realNoise*20);
            let maxDistance = Math.round(4+(realNoise*3));
            let closeAliens = 0;
            let affectedAliens = 0;
            let shufAliens = _.shuffle(aliens);
            shufAliens.forEach(function(bat) {
                if (bat.pdm === undefined) {
                    if (closeAliens < 3) {
                        let batType = getBatType(bat);
                        let alienMaxDistance = Math.round(batType.ap/batType.moveCost*3);
                        if (batType.skills.includes('vault') || batType.skills.includes('fouisseur')) {
                            alienMaxDistance = 20;
                        }
                        if (batType.skills.includes('nocap') || batType.skills.includes('capbld') || batType.moveCost >= 90) {
                            alienMaxDistance = 0;
                        }
                        if (alienMaxDistance >= 6) {
                            let distance = calcDistance(tileId,bat.tileId);
                            if (distance <= 4) {
                                closeAliens++;
                            } else {
                                if (!bat.tags.includes('heard')) {
                                    if (distance <= alienMaxDistance) {
                                        if (distance <= maxDistance) {
                                            bat.tags.push('heard');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            shufAliens.forEach(function(bat) {
                if (bat.pdm === undefined) {
                    if (closeAliens < 3 && affectedAliens < 3) {
                        if (bat.tags.includes('heard')) {
                            let batType = getBatType(bat);
                            if (rand.rand(1,100) <= theChance) {
                                bat.pdm = tileId;
                                affectedAliens++;
                            } else {
                                tagDelete(bat,'heard');
                            }
                        }
                    } else {
                        tagDelete(bat,'heard');
                    }
                }
            });
        }
    }
};
