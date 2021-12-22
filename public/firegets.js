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
    // let stormDmg = rand.rand(10*baseDmg,14*baseDmg);
    let stormDmg = 12*baseDmg;
    // console.log('stormDmg='+stormDmg);
    stormDmg = Math.ceil(stormDmg/Math.sqrt(bat.armor+1));
    // console.log('stormDmg(a)='+stormDmg);
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
    if (batType.skills.includes('resistall') || bat.tags.includes('resistall')) {
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
        batDeathEffect(bat,true,'Bataillon détruit',bat.type+' brûlé.');
        checkDeath(bat,batType);
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
    if (weapon.aoe == 'unit' || weapon.aoe == 'brochette' || speed < 0) {
        prec = Math.round(prec-(stealth/(2+overPrec))-(speed/(1+overPrec)));
    }
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

function calcPrecRangeAdj(weapon,attBat,attBatType,defBat,defBatType) {
    let accurange = 0;
    let distance = calcDistance(attBat.tileId,defBat.tileId);
    if (distance === 0) {
        if (attBatType.cat != 'aliens') {
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
        weapAccu = Math.round(weapAccu*weapon.dca);
    }
    // marquage
    if (defBat.tags.includes('fluo')) {
        weapAccu = weapAccu+15;
    }
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
    let result = {damage:0,hits:0};
    let newDamage = 0;
    let power = weapon.power;
    let oldPower = weapon.power;
    let forAOE = true;
    if (brochette) {
        forAOE = false;
    }
    let cover = getCover(defBat,true,forAOE);
    if (weapon.isMelee || weapon.noShield || attBatType.skills.includes('halfcover')) {
        cover = Math.round(cover/2);
    }
    let stealth = getStealth(defBat);
    if (!brochette) {
        stealth = Math.round(stealth/2);
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
            power = Math.floor(power*squadReductor);
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
        if (bat.tags.includes('nomove')) {
            removeNoMoves(bat);
        }
        let batIndex = bataillons.findIndex((obj => obj.id == bat.id));
        bataillons.splice(batIndex,1);
        if (count) {
            if (!batType.skills.includes('nodeathcount')) {
                playerInfos.unitsLost = playerInfos.unitsLost+1;
                playMusic('rip',false);
            }
            transDestroy(deadId,tileId);
            saveCrew(batType,deadId,tileId);
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
                    if (playerInfos.comp.det >= 3) {
                        eggsNum = eggsNum-1;
                    }
                    unveilAliens(bat);
                }
                playMusic('eggKill',false);
            }
            playerInfos.aliensKilled = playerInfos.aliensKilled+1;
            addAlienRes(bat);
        }
        if (!playerInfos.knownAliens.includes(batType.name)) {
            newAlienKilled(batType,tileId);
        }
        let batIndex = aliens.findIndex((obj => obj.id == bat.id));
        aliens.splice(batIndex,1);
        alienBonus();
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
            if (bat.chief != undefined) {
                if (bat.chief != '') {
                    warning(bat.chief+' est mort','RIP',false,bat.tileId);
                }
            }
            setTimeout(function (){
                $('#b'+bat.tileId).empty();
                $('#b'+bat.tileId).append(resHere);
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
    if (!quiet && bat.team === 'aliens' && !playerInfos.knownAliens.includes(bat.type)) {
        newAlienKilled(bat.type,bat.tileId);
    }
    if (bat.team != 'aliens') {
        let batType = getBatType(bat);
        addBodies(bat,batType,0);
        if (batType.crew >= 1 && !batType.skills.includes('robot') && !batType.skills.includes('clone') || !batType.skills.includes('dog') && !batType.skills.includes('brigands') && !bat.tags.includes('outsider') && batType.name != 'Citoyens' && batType.name != 'Criminels') {
            deathStress();
        }
    }
    if (bat.team != 'aliens') {
        $('#unitInfos').empty();
        $("#unitInfos").css("display","none");
    }
};

function addBodies(bat,batType,cits) {
    let unitCits = 0;
    if (cits >= 1) {
        unitCits = cits;
    } else {
        unitCits = batType.squads*batType.crew*batType.squadSize;
        if (batType.skills.includes('clone') || batType.skills.includes('dog')) {
            unitCits = 0;
        }
        if (batType.id === 126 || batType.id === 225) {
            unitCits = batType.citoyens;
        }
    }
    let bodyFactor = 50+(playerInfos.comp.gen*20)+(playerInfos.comp.med*5);
    if (playerInfos.gang === 'brasier') {
        bodyFactor = bodyFactor+20;
    }
    let bodyRecup = Math.ceil(unitCits*bodyFactor/100);
    resAdd('Corps',bodyRecup);
};

function newAlienKilled(batType,tileId) {
    playerInfos.knownAliens.push(batType.name);
    let xpBonus = batType.killXP;
    xpBonus = Math.floor(xpBonus*(playerInfos.comp.train+2)/4);
    if (xpBonus >= 1) {
        if (Object.keys(selectedBat).length >= 1) {
            if (selectedBat.team === 'player') {
                if (!selectedBatType.skills.includes('robot') || selectedBat.eq === 'g2ai' || selectedBat.logeq === 'g2ai') {
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
                    if (!batType.skills.includes('robot') || bat.eq === 'g2ai' || bat.logeq === 'g2ai') {
                        bat.xp = bat.xp+xpBonus;
                    }
                }
            }
        });
        warning('Alien inconnu tué : '+batType.name,'Toutes vos unités dans la zone ont gagné '+xpBonus+' points d\'expérience');
    } else {
        warning('Alien inconnu tué : '+batType.name,'');
    }
};

function saveCrew(deadBatType,deadId,tileId) {
    alienOccupiedTileList();
    playerOccupiedTileList();
    let savedCits = 0;
    let salvableCits = 0;
    let citId = 126;
    if (deadBatType.skills.includes('brigands')) {
        citId = 225;
    }
    if (deadBatType.skills.includes('crewsave')) {
        salvableCits = Math.round(deadBatType.squads*deadBatType.squadSize*deadBatType.crew/6*rand.rand(4+Math.floor(playerInfos.comp.train/2),6));
    } else if (deadBatType.skills.includes('badcrewsave') || deadBatType.cat === 'buildings') {
        salvableCits = Math.round(deadBatType.squads*deadBatType.squadSize*deadBatType.crew/6*rand.rand(0+playerInfos.comp.train,4));
    }
    if (salvableCits >= 1) {
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
        if (savedCits >= 1) {
            centerMapTo(tileId);
        }
    }
};

function transDestroy(deadId,tileId) {
    alienOccupiedTileList();
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
        crashEscapeTile = getCrashEscapeTile(tileId);
        if (crashEscapeTile >= 0) {
            bat.loc = 'zone';
            bat.tileId = crashEscapeTile;
            bat.oldTileId = crashEscapeTile;
            savedBats++;
        } else {
            let batType = getBatType(bat);
            addBodies(bat,batType,0);
            warning('RIP',batType.name+' sont morts dans l\'accident');
            batIndex = bataillons.findIndex((obj => obj.id == bat.id));
            bataillons.splice(batIndex,1);
            if (!batType.skills.includes('nodeathcount')) {
                playerInfos.unitsLost = playerInfos.unitsLost+1;
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
    if (defBat.tags.includes('fortif')) {
        if ((defBat.tags.includes('hero') || defBat.tags.includes('vet')) && defBatType.skills.includes('herofortif')) {
            armor = armor+2;
        } else if (defBatType.skills.includes('bigfortif')) {
            armor = armor+2;
        } else if (armor < 3 && !defBatType.skills.includes('baddef')) {
            armor = armor+1;
        }
        if (playerInfos.comp.def >= 2) {
            armor = armor+playerInfos.comp.def-1;
        }
    }
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
    // let modifiedArmor = Math.round(armor*armorModifier);
    let modifiedArmor = getModifiedArmor(armor,armorModifier);
    let powerDice;
    if (power >= 3) {
        let powerDiceMin = Math.round(power/2.5);
        if (playerInfos.comp.ca >= 5 && defBatType.cat === 'aliens') {
            powerDiceMin = Math.round(power/1.6);
        }
        let powerDiceMax = Math.round(power*1.6);
        powerDice = rand.rand(powerDiceMin,powerDiceMax);
        if (powerDice == powerDiceMax) {
            let bonusMax = Math.round(power*2.4);
            powerDice = powerDice+rand.rand(0,bonusMax);
        }
    } else if (power === 2) {
        powerDice = rand.rand(0,4);
        if (playerInfos.comp.ca >= 5 && defBatType.cat === 'aliens') {
            powerDice = rand.rand(1,4);
        }
    } else if (power === 1) {
        powerDice = Math.floor(rand.rand(0,4)/4);
        if (playerInfos.comp.ca >= 5 && defBatType.cat === 'aliens') {
            powerDice = Math.floor(rand.rand(0,3)/3);
        }
    } else {
        powerDice = 0;
    }
    // bliss drug
    let dmgReduct = 0;
    if (defBat.tags.includes('bliss') && defBatType.cat === 'infantry') {
        dmgReduct = 3;
    }
    let calculatedDmg = powerDice-modifiedArmor-dmgReduct;
    if (calculatedDmg < 0) {
        calculatedDmg = 0;
    }
    if (calculatedDmg < 1 && weapon.name.includes('plasma')) {
        calculatedDmg = 1;
    }
    if (weapon.name.includes('BFG')) {
        if (calculatedDmg < 4) {
            calculatedDmg = rand.rand(3,4);
        }
    }
    if (defBatType.cat === 'aliens') {
        if (weapon.ammo === 'suicide') {
            if (calculatedDmg < 10) {
                calculatedDmg = rand.rand(8,12);
            }
        }
    }
    return calculatedDmg;
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
    // console.log('Modified Armor = '+modifiedArmor);
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

function checkRicochet(defBat,defBatType,attWeap) {
    let rico = false;
    if (attWeap.name != undefined) {
        if (defBatType.skills.includes('ricochet') || defBat.tags.includes('ricochet')) {
            if (!attWeap.ammo.includes('feu') && !attWeap.ammo.includes('napalm') && !attWeap.ammo.includes('fire') && !attWeap.ammo.includes('pyratol') && !attWeap.ammo.includes('lf-') && !attWeap.ammo.includes('lt-') && !attWeap.ammo.includes('molotov') && !attWeap.ammo.includes('laser') && !attWeap.ammo.includes('electric') && !attWeap.ammo.includes('taser') && !attWeap.ammo.includes('web') && !attWeap.ammo.includes('flashbang') && !attWeap.name.includes('plasma')) {
                if (!attWeap.ammo.includes('gaz') && !attWeap.ammo.includes('disco')) {
                    if (!attWeap.ammo.includes('mono')) {
                        if (!attWeap.isMelee && !attWeap.noShield && attWeap.armors > 0) {
                            let minimumPower = defBat.armor*2;
                            if (minimumPower < 18) {
                                if (defBat.armor >= 8) {
                                    minimumPower = 20;
                                } else {
                                    minimumPower = 18;
                                }
                            }
                            let powerBonus = Math.ceil((playerInfos.comp.train+(playerInfos.comp.ca/2))/1.75)+2;
                            let calcPower = Math.round((attWeap.power+powerBonus)/attWeap.armors);
                            if (calcPower < minimumPower) {
                                rico = true;
                            }
                        }
                    }
                }
            }
        }
    }
    return rico;
};

function applyShield() {
    let shieldValue = 1;
    let shieldChance = 0;
    if (targetBatType.skills.includes('shield')) {
        shieldChance = 67;
    } else {
        if (targetBatType.kind === 'bug' && bugSHIELD) {
            shieldChance = 33;
        }
        if ((targetBatType.kind === 'egg' || targetBatType.kind === 'egg2') && eggSHIELD) {
            shieldChance = 33;
        }
    }
    if (activeTurn === 'player' && shieldChance >= 1 && !selectedWeap.ammo.includes('marquage')) {
        if (rand.rand(1,100) <= shieldChance && !targetBat.tags.includes('shield')) {
            targetBat.tags.push('shield');
        }
        if (targetBat.tags.includes('shield') || playerInfos.pseudo === 'Test' || playerInfos.pseudo === 'Payall') {
            shieldValue = rand.rand(6,14);
            if (playerInfos.pseudo === 'Test' || playerInfos.pseudo === 'Payall') {
                shieldValue = 10;
            }
            if (selectedWeap.noShield) {
                shieldValue = shieldValue/6;
            } else if (selectedWeap.minShield) {
                shieldValue = shieldValue/3;
            } else if (selectedWeap.lowShield) {
                shieldValue = shieldValue/1.75;
            }
            $('#report').append('<span class="report rose">Bouclier activé<br></span>');
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
        if (bat.eq === 'waterproof' || bat.logeq === 'waterproof' || batType.skills.includes('noblub')) {
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
            if (bat.eq === 'waterproof' || bat.logeq === 'waterproof' || batType.skills.includes('noblub')) {
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
    let cover = getCover(bat,false,false);
    let batType = getBatType(bat);
    let tile = getTile(bat);
    let batStealth = batType.stealth;
    if (playerInfos.bldList.includes('QG')) {
        batStealth = batStealth+4;
    } else if (playerInfos.bldList.includes('Centre de com')) {
        batStealth = batStealth+4;
    } else if (playerInfos.bldList.includes('Poste radio')) {
        batStealth = batStealth+2;
    }
    if (tile.infra === 'Terriers' && batType.size < 9) {
        batStealth = batStealth+5;
    }
    if (tile.ruins) {
        batStealth = batStealth+4;
    }
    if (tile.infra === 'Miradors' && playerInfos.comp.cam >= 1) {
        batStealth = batStealth+4;
    }
    if (bat.tags.includes('drunk')) {
        batStealth = batStealth-4;
    }
    if (bat.eq === 'e-camo' || bat.logeq === 'e-camo' || bat.eq === 'kit-sentinelle' || (bat.eq === 'kit-chouf' && playerInfos.comp.train >= 1) || (bat.eq === 'kit-guetteur' && playerInfos.comp.train >= 1) || bat.eq === 'crimekitgi' || bat.eq === 'crimekitch' || bat.eq === 'crimekitlu') {
        if (batType.skills.includes('camo')) {
            batStealth = batStealth+5;
        } else {
            batStealth = batStealth+3;
        }
    }
    let stealthBonus = 0;
    if (cover >= 4) {
        stealthBonus = Math.round((Math.sqrt(cover)-1.7)*(batStealth-5)/2);
        if (stealthBonus > 4) {
            stealthBonus = 4;
        }
        if (stealthBonus < 0) {
            stealthBonus = 0;
        }
    }
    let vetStealth = Math.round(bat.vet*vetBonus.stealth);
    let maxStealth = batStealth;
    let coverAdj = Math.round((cover+3)*1.8);
    if (tile.ruins) {
        coverAdj = coverAdj+4;
    }
    if (tile.infra === 'Terriers' && batType.size < 9) {
        coverAdj = coverAdj+5;
    }
    if (coverAdj < 2) {
        coverAdj = 2;
    }
    if (batStealth > coverAdj) {
        maxStealth = coverAdj;
    }
    // Starka drug
    if (bat.tags.includes('starka')) {
        maxStealth = Math.floor(maxStealth/2);
    }
    return maxStealth+stealthBonus+vetStealth;
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
    if (bat.eq === 'w2-autogun' || bat.eq === 'w2-autopistol') {
        speed = speed-50-stealth;
    } else {
        if ((bat.tags.includes('guet') || batType.skills.includes('sentinelle') || bat.eq === 'detector' || bat.logeq === 'detector' || bat.eq === 'g2ai' || bat.logeq === 'g2ai') && !attacking) {
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
    if (bat.eq === 'theeye' || bat.logeq === 'theeye') {
        speed = speed-50;
    }
    // initmelee
    if (batType.skills.includes('initmelee') && distance === 0) {
        if (batType.weapon.range >= 1 && !attacking) {
            speed = speed-120;
        } else {
            speed = speed-60;
        }
    }
    // camo
    if ((bat.fuzz <= -2 || bat.tags.includes('invisible') || batType.skills.includes('invisible')) && attacking) {
        speed = speed-50;
    }
    // Skupiac drug
    if (bat.tags.includes('skupiac')) {
        speed = speed-15;
    }
    if (weap.ammo.includes('disco')) {
        speed = speed-20;
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
        speed = speed-(playerInfos.comp.train*5);
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

function isInRange(myBat,thatTileId,myWeapon) {
    let myBatType = getBatType(myBat);
    let inRange = false;
    let range = myWeapon.range;
    let distance = calcDistance(myBat.tileId,thatTileId);
    if (distance > range) {
        // nothing
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
            if (isInRange(myBat,bat.tileId,weapon) || guidageOK) {
                batType = getBatType(bat);
                if (weapon.ammo.includes('marquage') && weapon.name != 'Fragger' && bat.tags.includes('fluo')) {
                    // Déjà marqué
                } else {
                    let realmOK = checkFlyTarget(weapon,batType);
                    if (!realmOK) {
                        // Fly/Ground hors portée
                    } else {
                        if (batType.skills.includes('invisible') || bat.tags.includes('invisible')) {
                            // Alien invisible
                            distance = calcDistance(myBat.tileId,bat.tileId)
                            if (distance === 0 || guidageOK || bat.tags.includes('fluo')) {
                                inRange = true;
                            }
                        } else {
                            if (zone[0].dark && !undarkNow.includes(bat.tileId)) {
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

function checkFlyTarget(weapon,batType) {
    let targetOK = true;
    if (batType.skills.includes('fly')) {
        if (weapon.isMelee) {
            targetOK = false;
        } else if (weapon.range === 0 && weapon.isShort) {
            targetOK = false;
        } else if (weapon.noFly) {
            targetOK = false;
        }
    } else {
        if (weapon.noGround && !batType.skills.includes('sauteur')) {
            targetOK = false;
        }
    }
    return targetOK;
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
                if (checkFlyTarget(selectedWeap,alienType)) {
                    if (!alien.tags.includes('fluo') || !selectedWeap.ammo.includes('marquage')) {
                        if (!zone[0].dark || (zone[0].dark && undarkNow.includes(tile.id))) {
                            cursorSwitch('#',tile.id,'fire');
                            $('#b'+tile.id).append('<div class="targ"><img src="/static/img/crosstarget.png"></div>');
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
                if (isInRange(selectedBat,tile.id,selectedWeap) || guideTarget) {
                    alienType = getBatType(alien);
                    if (checkFlyTarget(selectedWeap,alienType) && ((!alienType.skills.includes('invisible') && !alien.tags.includes('invisible')) || guideTarget || alien.tags.includes('fluo') || sideBySideTiles(selectedBat.tileId,tile.id,false))) {
                        if (!alien.tags.includes('fluo') || !selectedWeap.ammo.includes('marquage')) {
                            if (!zone[0].dark || (zone[0].dark && undarkNow.includes(tile.id))) {
                                cursorSwitch('#',tile.id,'fire');
                                $('#b'+tile.id).append('<div class="targ"><img src="/static/img/crosstarget.png"></div>');
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
        if (weapon.ammo.includes('missile') && !weapon.name.includes('Comet')) {
            guideTarget = true;
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
    } else if (targetBat.eq === 'w2-autogun' || targetBat.eq === 'w2-autopistol') {
        targetWeap = JSON.parse(JSON.stringify(targetBatType.weapon3));
        targetWeap = weaponAdj(targetWeap,targetBat,'w3');
    } else if (targetBatType.skills.includes('w3melee') && distance === 0) {
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
    let batType = getBatType(bat);
    // bonus veterancy
    let thisWeapon = {};
    if (wn == 'w2') {
        thisWeapon.num = 2;
    } else if (wn == 'w3') {
        thisWeapon.num = 3;
    } else {
        thisWeapon.num = 1;
    }
    // bonus vet
    thisWeapon.rof = Math.floor(weapon.rof*(bat.vet+vetBonus.rof)/vetBonus.rof);
    // hero rof
    if (bat.tags.includes('hero') && batType.skills.includes('herorof')) {
        thisWeapon.rof = Math.round(thisWeapon.rof*1.205);
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
    // Equip adj
    if (thisWeapon.num === 1) {
        if (batType.skills.includes('detrange') && thisWeapon.range >= 1 && thisWeapon.name != 'Lance-flammes') {
            if (bat.eq  === 'detector' || bat.logeq  === 'detector' || bat.eq  === 'g2ai' || bat.logeq  === 'g2ai') {
                thisWeapon.range = thisWeapon.range+1;
                if (thisWeapon.elevation === 1) {
                    thisWeapon.elevation = 2;
                }
            }
        }
        if (bat.eq === 'longtom' || bat.eq === 'longtom1' || bat.logeq === 'longtom' || bat.logeq === 'longtom1') {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (bat.eq === 'chargeur' || bat.eq === 'chargeur1' || bat.logeq === 'chargeur' || bat.logeq === 'chargeur1') {
            if (thisWeapon.cost < 6 && playerInfos.comp.train < 1) {
                thisWeapon.accuracy = thisWeapon.accuracy-1;
                if (thisWeapon.cost >= 3) {
                    thisWeapon.cost = thisWeapon.cost+1;
                }
            }
        }
        if (bat.eq === 'lanceur1' || bat.logeq === 'lanceur1') {
            if (!batType.skills.includes('camo')) {
                thisWeapon.noise = thisWeapon.noise+1;
            }
            if (!batType.skills.includes('fly') && bat.eq != 'e-jetpack' && bat.logeq != 'e-jetpack') {
                if (thisWeapon.range === 0) {
                    thisWeapon.range = 1;
                }
                thisWeapon.elevation = thisWeapon.elevation+1;
            } else {
                thisWeapon.range = 2;
            }
        }
        if (bat.eq === 'lunette' || bat.eq === 'lunette1' || bat.logeq === 'lunette' || bat.logeq === 'lunette1') {
            if (playerInfos.comp.train < 1 && thisWeapon.cost > 1) {
                thisWeapon.cost = thisWeapon.cost+1;
            }
        }
        if (bat.eq === 'lunette' || bat.eq === 'lunette1' || bat.logeq === 'lunette' || bat.logeq === 'lunette1' || bat.eq === 'crimekitlu' || bat.eq.includes('kit-chouf') || bat.eq.includes('landerwkit') || bat.eq.includes('w2-l')) {
            if (thisWeapon.elevation <= 1) {
                thisWeapon.elevation = thisWeapon.elevation+1;
            }
            thisWeapon.accuracy = thisWeapon.accuracy+8;
        }
        if (bat.eq === 'silencieux' || bat.logeq === 'silencieux' || bat.eq === 'silencieux1' || bat.logeq === 'silencieux1' || bat.eq.includes('kit-chouf')) {
            thisWeapon.noise = thisWeapon.noise-1;
            thisWeapon.hide = true;
        }
    } else if (thisWeapon.num === 2) {
        if (batType.skills.includes('detrange') && thisWeapon.range >= 1 && thisWeapon.name != 'Lance-flammes') {
            if (bat.eq  === 'detector' || bat.logeq  === 'detector' || bat.eq  === 'g2ai' || bat.logeq  === 'g2ai') {
                thisWeapon.range = thisWeapon.range+1;
                if (thisWeapon.elevation === 1) {
                    thisWeapon.elevation = 2;
                }
            }
        }
        if (bat.eq === 'longtom' || bat.eq === 'longtom2' || bat.logeq === 'longtom' || bat.logeq === 'longtom2') {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (bat.eq === 'chargeur' || bat.eq === 'chargeur2' || bat.logeq === 'chargeur' || bat.logeq === 'chargeur2') {
            if (thisWeapon.cost < 6 && playerInfos.comp.train < 1) {
                thisWeapon.accuracy = thisWeapon.accuracy-1;
                if (thisWeapon.cost >= 3) {
                    thisWeapon.cost = thisWeapon.cost+1;
                }
            }
        }
        if (bat.eq === 'lanceur2' || bat.logeq === 'lanceur2' || bat.eq === 'crimekitgi') {
            if (!batType.skills.includes('camo')) {
                thisWeapon.noise = thisWeapon.noise+1;
            }
            if (!batType.skills.includes('fly') && bat.eq != 'e-jetpack' && bat.logeq != 'e-jetpack') {
                if (thisWeapon.range === 0) {
                    thisWeapon.range = 1;
                }
                thisWeapon.elevation = thisWeapon.elevation+1;
            } else {
                thisWeapon.range = 2;
            }
        }
        if (bat.eq === 'lunette' || bat.eq === 'lunette2' || bat.logeq === 'lunette' || bat.logeq === 'lunette2') {
            if (playerInfos.comp.train < 1 && thisWeapon.cost > 1) {
                thisWeapon.cost = thisWeapon.cost+1;
            }
        }
        if (bat.eq === 'lunette' || bat.eq === 'lunette2' || bat.logeq === 'lunette' || bat.logeq === 'lunette2' || bat.eq.includes('kit-chouf')) {
            if (thisWeapon.elevation <= 1) {
                thisWeapon.elevation = thisWeapon.elevation+1;
            }
            thisWeapon.accuracy = thisWeapon.accuracy+8;
        }
        if (bat.eq === 'silencieux' || bat.logeq === 'silencieux' || bat.eq === 'silencieux2' || bat.logeq === 'silencieux2' || bat.eq.includes('kit-chouf')) {
            thisWeapon.noise = thisWeapon.noise-1;
            thisWeapon.hide = true;
        }
    }
    if (bat.eq === 'g2siege' || bat.logeq === 'g2siege') {
        if (thisWeapon.name.includes('Baliste') || thisWeapon.name.includes('Catapulte')) {
            thisWeapon.range = thisWeapon.range+1;
            thisWeapon.rof = Math.round(thisWeapon.rof*1.4);
            thisWeapon.noBis = false;
        }
    }
    if (bat.eq === 'theeye' || bat.logeq === 'theeye') {
        thisWeapon.accuracy = thisWeapon.accuracy+6;
        if (thisWeapon.range >= 2) {
            thisWeapon.range = thisWeapon.range+1;
        } else if (thisWeapon.elevation === 1 || thisWeapon.elevation === 2) {
            thisWeapon.elevation = thisWeapon.elevation+1;
        }
        if (thisWeapon.cost >= 2) {
            thisWeapon.cost = thisWeapon.cost-1;
        }
    }
    if (playerInfos.bldList.includes('Usine d\'armement')) {
        thisWeapon.maxAmmo = Math.round(thisWeapon.maxAmmo*1.5);
    } else if (playerInfos.bldList.includes('Arsenal')) {
        thisWeapon.maxAmmo = Math.round(thisWeapon.maxAmmo*1.25);
    }
    if ((bat.eq === 'gilet' || bat.logeq === 'gilet' || bat.eq === 'crimekitgi') && thisWeapon.maxAmmo < 99) {
        thisWeapon.maxAmmo = Math.floor(thisWeapon.maxAmmo*1.5);
        if (thisWeapon.maxAmmo < 16) {
            thisWeapon.maxAmmo = 16;
        }
    }
    if ((bat.eq.includes('carrousel') || bat.logeq.includes('carrousel')) && thisWeapon.maxAmmo < 99) {
        thisWeapon.maxAmmo = Math.floor(thisWeapon.maxAmmo*1.35);
        if (thisWeapon.maxAmmo < 16) {
            thisWeapon.maxAmmo = 16;
        }
    }
    if (bat.eq === 'arcpoulie' || bat.logeq === 'arcpoulie') {
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
    if (bat.eq === 'arbalourde' || bat.logeq === 'arbalourde') {
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
    if (bat.eq === 'belier' || bat.logeq === 'belier') {
        if (thisWeapon.name === 'Boutoir') {
            thisWeapon.rof = Math.round(thisWeapon.rof*1.5);
            thisWeapon.power = Math.round(thisWeapon.power*1.26);
            thisWeapon.accuracy = thisWeapon.accuracy+2;
            thisWeapon.name = 'Bélier';
        }
    }
    if (bat.eq === 'crimekitgi') {
        if (thisWeapon.num === 1) {
            thisWeapon.power = thisWeapon.power+1;
            thisWeapon.rof = Math.round(thisWeapon.rof*1.33);
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
    // bonus ammo
    let myAmmo = bat.ammo;
    if (wn == 'w2') {
        myAmmo = bat.ammo2;
    }
    let ammoIndex = ammoTypes.findIndex((obj => obj.name == myAmmo));
    let ammo = ammoTypes[ammoIndex];
    thisWeapon.ammo = myAmmo;
    if (playerInfos.comp.pyro === 3) {
        if (thisWeapon.ammo.includes('feu') || thisWeapon.ammo.includes('incendiaire') || thisWeapon.ammo.includes('napalm') || thisWeapon.ammo.includes('fire') || thisWeapon.ammo.includes('pyratol') || thisWeapon.ammo.includes('lf-') || thisWeapon.ammo.includes('lt-') || thisWeapon.ammo.includes('molotov')) {
            thisWeapon.armors = thisWeapon.armors*0.8;
        }
    }
    if (thisWeapon.ammo === 'lame-taser') {
        thisWeapon.sound = 'electricity';
    }
    if (thisWeapon.ammo === 'grenade-flashbang') {
        if (thisWeapon.name.includes('renade') || thisWeapon.name.includes('LG')) {
            thisWeapon.sound = 'flashbang';
        }
    }
    if (thisWeapon.ammo === 'lame-plasma') {
        thisWeapon.sound = 'plasblade';
        if (thisWeapon.cost < 2) {
            thisWeapon.cost = 2;
        }
    }
    if (thisWeapon.ammo === 'lame-fplasma') {
        thisWeapon.sound = 'plasmasaw';
    }
    if (thisWeapon.range === 0 && ammo.range > 1) {
        thisWeapon.range = 1;
    } else {
        thisWeapon.range = Math.ceil(thisWeapon.range*ammo.range);
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
    thisWeapon.armors = thisWeapon.armors*ammo.armors;
    thisWeapon.armors = thisWeapon.armors.toFixedNumber(2);
    if (ammo.aoe != '' && thisWeapon.aoe != 'bat') {
        thisWeapon.aoe = ammo.aoe;
    }
    if (ammo.accuracy < 1 || thisWeapon.isMelee || thisWeapon.aoe != 'unit') {
        thisWeapon.accuracy = Math.round(thisWeapon.accuracy*ammo.accuracy);
        thisWeapon.rof = Math.round(thisWeapon.rof*ammo.rof);
    } else {
        if (thisWeapon.accuracy >= 32) {
            thisWeapon.accuracy = Math.round(thisWeapon.accuracy*ammo.accuracy);
        } else {
            thisWeapon.rof = Math.round(thisWeapon.rof*ammo.rof);
        }
    }
    // helper
    if ((bat.eq === 'helper' || bat.logeq === 'helper') && thisWeapon.isMelee) {
        thisWeapon.power = thisWeapon.power+3;
    }
    // sila drug
    if (bat.tags.includes('sila')) {
        if (thisWeapon.isMelee) {
            thisWeapon.power = thisWeapon.power+4;
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
        thisWeapon.rof = Math.round(thisWeapon.rof*2);
    }
    // skills
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    // BAT RANGE
    if (bat.range < thisWeapon.range) {
        bat.range = thisWeapon.range;
    }
    // RANGE ADJUSTMENTS
    if (batType.name === 'Ruche') {
        if (colonyTiles.includes(bat.tileId)) {
            thisWeapon.range = thisWeapon.range+5;
            thisWeapon.power = thisWeapon.power+5;
        }
    }
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
        if (infra != '') {
            highGround = 2;
        } else {
            highGround = 1;
        }
    } else {
        if (infra != '') {
            highGround = 1;
        } else {
            highGround = 0;
        }
    }
    if (infra === 'Miradors' || infra === 'Murailles') {
        if (!thisWeapon.isMelee && ((!thisWeapon.isShort && thisWeapon.range >= 1) || thisWeapon.range >= 2 || (thisWeapon.elevation >= 1 && thisWeapon.range >= 1))) {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (infra === 'Miradors' && thisWeapon.elevation === 3 && tile.terrain == 'M') {
            thisWeapon.range = thisWeapon.range+1;
        }
        if (infra === 'Miradors' && thisWeapon.elevation >= 2 && thisWeapon.ammo.includes('salite')) {
            thisWeapon.range = thisWeapon.range+1;
        }
    }
    if (highGround === 1) {
        if (thisWeapon.elevation >= 1) {
            thisWeapon.range = thisWeapon.range+1;
        }
    } else if (highGround === 2) {
        if (thisWeapon.elevation === 1) {
            thisWeapon.range = thisWeapon.range+1;
        } else if (thisWeapon.elevation >= 2) {
            thisWeapon.range = thisWeapon.range+2;
        }
    }
    // hero range
    if (bat.tags.includes('hero') && batType.skills.includes('herorange')) {
        if (!thisWeapon.isMelee && ((!thisWeapon.isShort && thisWeapon.range >= 1) || thisWeapon.range >= 2 || (thisWeapon.elevation >= 1 && thisWeapon.range >= 1))) {
            thisWeapon.range = thisWeapon.range+1;
        }
    }
    // hero rage
    if (bat.tags.includes('rage')) {
        if (thisWeapon.isMelee) {
            thisWeapon.power = thisWeapon.power+Math.round(Math.sqrt(thisWeapon.power)*1.42);
        }
    }
    // Forêt (range)
    let overInfra = false;
    if (infra === 'Miradors' || infra === 'Murailles' || infra === 'Remparts') {
        overInfra = true;
    }
    if (tile.terrain == 'F' && !overInfra && batType.cat != 'buildings' && batType.cat != 'devices' && !batType.skills.includes('transorbital') && !batType.skills.includes('fly') && !bat.eq != 'e-jetpack' && !bat.logeq != 'e-jetpack') {
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
    if (zone[0].dark) {
        let vue = calcVue(bat,batType);
        // if (thisWeapon.range > vue && !thisWeapon.isArt && !thisWeapon.ammo.includes('homing')) {
        //     thisWeapon.range = vue;
        // }
    }
    if (bat.tags.includes('fogged') && thisWeapon.range > 1) {
        thisWeapon.range = 1;
    }
    // hero tornade cost
    if (bat.tags.includes('tornade')) {
        if (thisWeapon.cost < 1) {
            thisWeapon.cost = 1;
        }
    }
    // Deluge Cost
    if (thisWeapon.ammo === 'missile-deluge') {
        thisWeapon.cost = weapon.cost+2;
        thisWeapon.noDef = true;
    }
    if (thisWeapon.ammo === 'obus-deluge') {
        thisWeapon.cost = weapon.cost+2;
        thisWeapon.noDef = true;
    }
    // Type d'attaques
    if (thisWeapon.ammo.includes('feu') || thisWeapon.ammo.includes('incendiaire') || thisWeapon.ammo.includes('napalm') || thisWeapon.ammo.includes('fire') || thisWeapon.ammo.includes('pyratol') || thisWeapon.ammo.includes('lf-') || thisWeapon.ammo.includes('lt-') || thisWeapon.ammo.includes('molotov') || thisWeapon.ammo.includes('laser')) {
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
    if (thisWeapon.ammo.includes('electric') || thisWeapon.ammo.includes('taser')) {
        thisWeapon.isElec = true;
    } else {
        thisWeapon.isElec = false;
    }
    if (thisWeapon.ammo.includes('nanite') || thisWeapon.ammo === 'suicide' || thisWeapon.ammo.includes('mine') || thisWeapon.ammo.includes('autodestruction') || thisWeapon.ammo.includes('dynamite') || thisWeapon.ammo.includes('bombe') || thisWeapon.ammo.includes('explosif') || thisWeapon.ammo.includes('obus') || thisWeapon.ammo.includes('missile') || thisWeapon.ammo.includes('grenade') || thisWeapon.ammo.includes('disco')) {
        if (!thisWeapon.ammo.includes('gaz') && !thisWeapon.ammo.includes('incendiaire') && !thisWeapon.ammo.includes('napalm')) {
            thisWeapon.isBlast = true;
        } else {
            thisWeapon.isBlast = false;
        }
    } else {
        thisWeapon.isBlast = false;
    }
    if (thisWeapon.ammo.includes('explosive')) {
        thisWeapon.isExplo = true;
    } else {
        thisWeapon.isExplo = false;
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
    } else if (thisWeapon.ammo.includes('bfg') || thisWeapon.ammo.includes('laser') || thisWeapon.ammo.includes('autodestruction') || thisWeapon.ammo.includes('mine') || thisWeapon.ammo.includes('suicide') || thisWeapon.ammo.includes('obus-fleche') || thisWeapon.ammo.includes('missile-fleche') || thisWeapon.ammo.includes('gaz')) {
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
    // console.log(thisWeapon);
    return thisWeapon;
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

function chargeurAdj(bat,shots,weap) {
    let newShots = shots;
    let mult = 1.5;
    if (weap.name.includes('Calibre') || weap.name.includes('verrou')) {
        mult = 2;
    }
    if (weap.name.includes('Revolver') || weap.name.includes('Blaster') || weap.name.includes('pompe') || weap.name.includes('Blister pistol')) {
        mult = 1.7;
    }
    if (weap.name.includes('assaut') || weap.name.includes('itrail') || weap.name.includes('ulfat') || weap.name.includes('Minigun') || weap.name.includes('semi-auto') || weap.name.includes('BFG') || (weap.name.includes('Blister') && !weap.name.includes('pistol'))) {
        mult = 1.33;
    }
    if (bat.eq.includes('kit-chouf')) {
        mult = 2;
    }
    if (bat.eq.includes('chargeur') || bat.logeq.includes('chargeur') || bat.eq.includes('kit-chouf') || bat.eq === 'crimekitch' || bat.eq === 'crimekitto' || bat.eq.includes('landerwkit') || bat.eq.includes('w2-l')) {
        if (weap.num === 1) {
            if (bat.eq === 'chargeur1' || bat.eq === 'chargeur' || bat.logeq === 'chargeur1' || bat.logeq === 'chargeur' || bat.eq.includes('kit-chouf') || bat.eq === 'crimekitch' || bat.eq.includes('landerwkit') || bat.eq.includes('w2-l')) {
                newShots = Math.round(newShots*mult);
            }
        } else {
            if (bat.eq === 'chargeur2' || bat.eq === 'chargeur' || bat.logeq === 'chargeur2' || bat.logeq === 'chargeur' || bat.eq.includes('kit-chouf') || bat.eq === 'crimekitto') {
                newShots = Math.round(newShots*mult);
            }
        }
    }
    mult = 1.25;
    if (bat.eq.includes('carrousel') || bat.logeq.includes('carrousel')) {
        if (weap.num === 1) {
            if (bat.eq === 'carrousel1' || bat.eq === 'carrousel' || bat.logeq === 'carrousel1' || bat.logeq === 'carrousel') {
                newShots = Math.round(newShots*mult);
            }
        } else {
            if (bat.eq === 'carrousel2' || bat.eq === 'carrousel' || bat.logeq === 'carrousel2' || bat.logeq === 'carrousel') {
                newShots = Math.round(newShots*mult);
            }
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
    if (guet || batType.skills.includes('sentinelle') || bat.eq === 'detector' || bat.logeq === 'detector' || bat.eq === 'g2ai' || bat.logeq === 'g2ai' || batType.skills.includes('initiative') || batType.skills.includes('after')) {
        brideDef = 1;
    }
    // Defense, Bastion
    if (batType.skills.includes('bastion') && (weap.num === 1 || !weap.noBis)) {
        brideDef = brideDef*2;
    } else if (batType.skills.includes('defense') && (weap.num === 1 || !weap.noBis)) {
        brideDef = brideDef*1.5;
    }
    // baddef
    if (batType.skills.includes('baddef')) {
        if (guet || batType.skills.includes('sentinelle') || bat.eq === 'detector' || bat.logeq === 'detector' || bat.eq === 'g2ai' || bat.logeq === 'g2ai' || batType.skills.includes('initiative') || batType.skills.includes('after')) {
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
            if (batType.cat != 'aliens') {
                gmin = gmin+(playerInfos.comp.train/4);
                gmax = gmax+(playerInfos.comp.train/4);
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
    if (weap.ammo.includes('feu') || weap.ammo.includes('napalm') || weap.ammo.includes('fire') || weap.ammo.includes('pyratol') || weap.ammo.includes('lf-') || weap.ammo.includes('molotov') || weap.ammo.includes('nanite') || weap.ammo === 'suicide' || weap.ammo.includes('mine') || weap.ammo.includes('autodestruction') || weap.ammo.includes('dynamite') || weap.ammo.includes('bombe') || weap.ammo.includes('explosif') || weap.ammo.includes('obus') || weap.ammo.includes('missile') || weap.ammo.includes('glair') || weap.ammo.includes('ruche') || weap.ammo.includes('bfg')) {
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
    } else if (batType.cat != 'aliens') {
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
    // console.log('MirDamage='+damage);
    let breakChance = Math.floor(damage/20);
    if (infraName === 'Palissades') {
        if (damage >= 400) {
            breakChance = Math.floor(damage/80);
        } else {
            breakChance = 0;
        }
    } else if (infraName === 'Remparts') {
        if (damage >= 1600) {
            breakChance = Math.floor(damage/320);
        } else {
            breakChance = 0;
        }
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
                let getChance = (damage*5)+5;
                if (giveBatType.skills.includes('chancre')) {
                    getChance = getChance*3;
                } else {
                    getChance = Math.ceil(getChance/(playerInfos.comp.ca+5)*5);
                }
                if (terrain.name === 'S') {
                    getChance = getChance+25;
                }
                if (getChance > 33 && !giveBatType.skills.includes('chancre')) {
                    getChance = 33;
                }
                if (getChance < 10 && damage >= 1) {
                    getChance = 10;
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
    if (batType.skills.includes('fly') || batType.skills.includes('jetpack') || bat.eq === 'e-jetpack' || bat.logeq === 'e-jetpack') {
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
            if (zone[0].snd === 'rainforest' || zone[0].snd === 'thunderstart' || zone[0].snd === 'swamp' || zone[0].snd === 'uhuwind') {
                wetness = wetness+1;
                if (terrain.name === 'S') {
                    wetness = wetness+1;
                }
            } else if (zone[0].snd === 'monsoon' || zone[0].snd === 'thunderfull') {
                wetness = wetness+2;
            } else if (terrain.name === 'S') {
                wetness = wetness+1;
            }
        }
    } else {
        if (zone[0].snd === 'rainforest' || zone[0].snd === 'thunderstart' || zone[0].snd === 'swamp' || zone[0].snd === 'uhuwind') {
            wetness = wetness+1;
        } else if (zone[0].snd === 'monsoon' || zone[0].snd === 'thunderfull') {
            wetness = wetness+2;
        }
    }
    return wetness;
};

function getRipNum(bat,batType) {
    let ripNum = 4+bat.salvoLeft;
    if (batType.skills.includes('guerrilla') || batType.skills.includes('baddef')) {
        ripNum = ripNum-1;
    }
    if (batType.skills.includes('onedef')) {
        ripNum = ripNum-3;
    }
    if (batType.skills.includes('gooddef') || bat.eq.includes('w2-auto')) {
        ripNum = ripNum+2;
    }
    if (bat.tags.includes('hero') && batType.skills.includes('herorip')) {
        ripNum = ripNum+3;
    }
    if (ripNum < 0) {
        ripNum = 0;
    }
    return ripNum;
}
