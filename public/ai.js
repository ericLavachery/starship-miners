function alienMoveLoop() {
    // move map at the end of the alien moves
    console.log('alienMoveLoop');
    $('#report').empty('');
    attAlive = true;
    defAlive = true;
    alienOccupiedTileList();
    playerOccupiedTileList();
    if (selectedBatType.moveCost < 99 && !selectedBat.tags.includes('freeze') && !selectedBat.tags.includes('stun')) {
        isCamoBlock();
    }
    let alienActif = true;
    if (selectedBatType.skills.includes('healhide') && selectedBat.squadsLeft <= 3 && selectedBat.tags.includes('invisible')) {
        alienActif = false;
        alienTeleport();
    }
    if (alienActif) {
        checkPDM();
        targetBat = {};
        targetBatType = {};
        targetWeap = {};
        fouissage();
        fearFactor(selectedBat,false);
        infraDestruction();
        checkPossibleMoves();
        // loop this until no ap or no salvo
        // console.log('!!! Start Loop !!!');
        let iter = 1;
        while (iter <= 20) {
            // console.log('loop '+iter+' || ap:'+selectedBat.apLeft+' salvo:'+selectedBat.salvoLeft);
            if (selectedBat.apLeft >= 1 && selectedBat.salvoLeft >= 1) {
                if (attAlive && defAlive) {
                    if (stopForFight) {
                        break;
                    } else {
                        chooseTarget(iter);
                    }
                } else {
                    break;
                }
            } else {
                break;
            }
            if (iter > 20) {break;}
            iter++
        }
    }
    // console.log('!!! End Loop !!!');
    // si no salvo et reste bcp d'ap : move vers PDM de base (attention: garder le rapport de combat!)
};

function chooseTarget(iter) {
    targetBat = {};
    targetBatType = {};
    targetWeap = {};
    if (!selectedBatType.skills.includes('capbld')) {
        if (selectedBatType.skills.includes('capfar') || selectedBatType.skills.includes('errant')) {
            anyFarTarget(iter); // change PDM
        } else {
            anyCloseTarget(iter); // change PDM
        }
    }
    let sheep = 4;
    if (selectedBatType.skills.includes('errant')) {
        if (selectedBat.squadsLeft <= 2) {
            sheep = 1;
        } else {
            sheep = 2;
        }
    }
    if (selectedBatType.skills.includes('anycap') || selectedBatType.skills.includes('capmen') || selectedBatType.skills.includes('capbld') || selectedBat.tags.includes('follow')) {
        sheep = 3;
    }
    if (selectedBat.apLeft < 4) {
        sheep = 100;
    }
    let noThanks = false;
    if (rand.rand(1,sheep) === 1) {
        noThanks = true;
    }
    if (selectedBatType.skills.includes('flee') && selectedBatType.squads >= selectedBat.squadsLeft*2) {
        noThanks = true;
    }
    let inPlace = false;
    let alienInMelee = isAlienInMelee(selectedBat.tileId);
    let range = selectedWeap.range;
    if (noThanks) {
        moveToPDM();
    } else {
        if (range === 0) {
            // range 0
            if (alienInMelee) {
                inPlace = targetMelee(iter);
                if (inPlace) {
                    shootTarget(false,true);
                } else {
                    moveToPDM();
                }
            } else {
                moveToPDM();
                inPlace = targetMelee(iter);
                if (inPlace) {
                    shootTarget(false,true);
                } else {
                    moveToPDM();
                }
            }
        } else if (range === 1) {
            // range 1
            if (alienInMelee) {
                inPlace = targetMelee(iter);
                if (inPlace) {
                    shootTarget(false,false);
                } else {
                    moveToPDM();
                }
            } else {
                inPlace = targetClosest(iter);
                if (inPlace) {
                    shootTarget(false,false);
                } else {
                    moveToPDM();
                    inPlace = targetClosest(iter);
                    if (inPlace) {
                        shootTarget(false,false);
                    } else {
                        moveToPDM();
                    }
                }
            }
        } else {
            // range 2+
            if (anyTargetInRange()) {
                if (alienInMelee) {
                    moveOutOfMelee();
                    inPlace = targetFarthest(iter);
                    if (inPlace) {
                        shootTarget(true,false);
                    } else {
                        moveToPDM();
                    }
                } else {
                    inPlace = targetFarthest(iter);
                    if (inPlace) {
                        shootTarget(false,false);
                    } else {
                        moveToPDM();
                    }
                }
            } else {
                moveToPDM();
                inPlace = targetFarthest(iter);
                if (inPlace) {
                    shootTarget(false,false);
                } else {
                    moveToPDM();
                }
            }
        }
    }
    // console.log('inPlace '+inPlace);
    // console.log(targetBat);
};

function checkAlienFlyTarget(weapon,bat) {
    let isTarget = false;
    let batType = getBatType(bat);
    // console.log('CHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHEK');
    if (weapon.noFly) {
        // console.log('noFly');
        let isFlying = false;
        if (batType.skills.includes('jetpack') || bat.eq === 'e-jetpack') {
            if (bat.apLeft >= -1) {
                isFlying = true;
            }
        } else if (batType.skills.includes('fly')) {
            if (bat.apLeft >= -6) {
                isFlying = true;
            } else if (hasEquip(bat,['e-stab']) && bat.apLeft >= -15) {
                isFlying = true;
            }
        }
        if (bat.tags.includes('camo') || bat.tags.includes('fortif') || bat.tags.includes('mining')) {
            isTarget = true;
        } else if (isFlying) {
            if (selectedBat.tileId === selectedBat.oldTileId && bat.tileId === bat.oldTileId && selectedBat.creaTurn+1 < playerInfos.mapTurn) {
                let distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance === 0) {
                    isTarget = true;
                } else {
                    isTarget = false;
                }
            } else {
                isTarget = false;
            }
        } else {
            isTarget = true;
        }
    } else if (weapon.noGround) {
        // console.log('noGround');
        let isFlying = checkFlying(bat,batType);
        // console.log('isFlying='+isFlying);
        if (!isFlying) {
            isTarget = false;
        } else {
            isTarget = true;
        }
    } else {
        isTarget = true;
    }
    // console.log('isTarget='+isTarget);
    // console.log(bat.type);
    return isTarget;
};

function checkFlying(bat,batType) {
    let isFlying = false;
    if (batType.skills.includes('jetpack') || bat.eq === 'e-jetpack') {
        if (bat.apLeft >= -1) {
            isFlying = true;
        }
    } else if (batType.skills.includes('fly')) {
        if (bat.apLeft >= -6) {
            isFlying = true;
        } else if (hasEquip(bat,['e-stab']) && bat.apLeft >= -15) {
            isFlying = true;
        }
    }
    if (bat.tags.includes('camo') || bat.tags.includes('fortif') || bat.tags.includes('mining')) {
        isFlying = false;
    }
    return isFlying;
};

function shootTarget(recul,melee) {
    // console.log('ap '+selectedBat.apLeft+' cost '+selectedWeap.cost);
    if (selectedWeap.range < 1 || selectedBat.apLeft >= selectedWeap.cost || recul || selectedBatType.skills.includes('fly')) {
        checkTargetBatType();
        // console.log('shoot '+targetBat.type);
        // console.log(targetBat);
        tileTarget(targetBat);
        if (!targetBat.type.includes('Barbelés') || playerInfos.stopBarbs) {
            stopForFight = true;
            isFFW = false;
        }
        if (selectedBatType.name === 'Torches') {
            if (selectedBat.squadsLeft >= 4) {
                alienSelectBaseWeapon();
            }
        }
        if (selectedBatType.name === 'Wurms' || selectedBatType.name === 'Larves') {
            if (selectedBat.tileId != selectedBat.oldTileId) {
                alienSelectBaseWeapon();
            }
        }
        showAlien(selectedBat);
        combat(melee);
        tagDelete(selectedBat,'invisible');
    } else {
        // console.log('Pas assez de PA pour tirer');
    }
};

function checkPDM() {
    // des targets différents selon les types d'aliens?
    pointDeMire = -1;
    let batType;
    let lePlusProche = 100;
    let shufBats = _.shuffle(bataillons);
    // cherche une cible préférée
    let fixedPDM = -1;
    if (selectedBat.pdm != undefined) {
        fixedPDM = selectedBat.pdm;
    }
    let isFleeing = false;
    if (selectedBatType.skills.includes('flee') && selectedBatType.squads >= selectedBat.squadsLeft*2) {
        isFleeing = true;
    }
    if (selectedBatType.skills.includes('nocap') || selectedBatType.skills.includes('gamecap') || isFleeing || fixedPDM >= 0) {
        let shufZone = _.shuffle(zone);
        if (selectedBatType.skills.includes('nocap') || selectedBatType.skills.includes('gamecap')) {
            shufZone.forEach(function(tile) {
                if (pointDeMire < 0) {
                    let distance = calcDistance(selectedBat.tileId,tile.id);
                    if (distance <= 3) {
                        pointDeMire = tile.id;
                    }
                }
            });
        }
        if (fixedPDM >= 0) {
            pointDeMire = fixedPDM;
        }
        if (pointDeMire < 0 || isFleeing) {
            let nearBorderDist = 999;
            shufZone.forEach(function(tile) {
                if (tile.x === 1 || tile.x === 60 || tile.y === 1 || tile.y === 60) {
                    let distance = calcDistance(selectedBat.tileId,tile.id);
                    if (distance < nearBorderDist) {
                        nearBorderDist = distance;
                        pointDeMire = tile.id;
                    }
                }
            });
        }
    } else if (selectedBatType.skills.includes('errant')) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= 0 && pointDeMire < 0) {
                batType = getBatType(bat);
                if ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance < 6) {
                        pointDeMire = bat.tileId;
                    }
                }
            }
        });
        if (pointDeMire < 0) {
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz >= 0) {
                    batType = getBatType(bat);
                    if ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly) {
                        distance = calcDistance(selectedBat.tileId,bat.tileId);
                        if (distance < lePlusProche) {
                            pointDeMire = bat.tileId;
                            lePlusProche = distance;
                        }
                    }
                }
            });
        }
    } else if (selectedBatType.skills.includes('anycap') || selectedBat.tags.includes('follow')) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= 0) {
                batType = getBatType(bat);
                if ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance < lePlusProche) {
                        pointDeMire = bat.tileId;
                        lePlusProche = distance;
                    }
                }
            }
        });
    } else if (selectedBatType.skills.includes('capmen')) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= 0) {
                batType = getBatType(bat);
                if (batType.cat === 'infantry' && ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly)) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance < lePlusProche) {
                        pointDeMire = bat.tileId;
                        lePlusProche = distance;
                    }
                }
            }
        });
    } else {
        if (selectedBatType.skills.includes('aimcfo')) {
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz >= 4) {
                    batType = getBatType(bat);
                    if (batType.skills.includes('cfo') || batType.skills.includes('pilone') || batType.skills.includes('dome')) {
                        distance = calcDistance(selectedBat.tileId,bat.tileId);
                        if (distance < lePlusProche) {
                            pointDeMire = bat.tileId;
                            lePlusProche = distance;
                        }
                    }
                }
            });
        }
        if (pointDeMire < 0) {
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz >= 4) {
                    batType = getBatType(bat);
                    if (!batType.skills.includes('fly')) {
                        distance = calcDistance(selectedBat.tileId,bat.tileId);
                        if (distance < lePlusProche) {
                            pointDeMire = bat.tileId;
                            lePlusProche = distance;
                        }
                    }
                }
            });
        }
        if (pointDeMire < 0) {
            // se rabat sur une autre cible
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz >= 3) {
                    batType = getBatType(bat);
                    if (!batType.skills.includes('fly')) {
                        distance = calcDistance(selectedBat.tileId,bat.tileId);
                        if (distance < lePlusProche) {
                            pointDeMire = bat.tileId;
                            lePlusProche = distance;
                        }
                    }
                }
            });
        }
        if (pointDeMire < 0) {
            // se rabat sur une autre cible
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz >= 1) {
                    batType = getBatType(bat);
                    if (!batType.skills.includes('fly')) {
                        distance = calcDistance(selectedBat.tileId,bat.tileId);
                        if (distance < lePlusProche) {
                            pointDeMire = bat.tileId;
                            lePlusProche = distance;
                        }
                    }
                }
            });
        }
        if (pointDeMire < 0) {
            // se rabat sur une autre cible
            shufBats.forEach(function(bat) {
                if (bat.loc === "zone" && bat.fuzz === 0) {
                    batType = getBatType(bat);
                    if (!batType.skills.includes('fly')) {
                        distance = calcDistance(selectedBat.tileId,bat.tileId);
                        if (distance < lePlusProche) {
                            pointDeMire = bat.tileId;
                            lePlusProche = distance;
                        }
                    }
                }
            });
        }
    }
    if (pointDeMire < 0 && selectedBatType.skills.includes('nez')) {
        // si nez, se rabat sur un lander furtif
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone") {
                batType = getBatType(bat);
                if (isLander(bat,batType)) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance < lePlusProche) {
                        pointDeMire = bat.tileId;
                        lePlusProche = distance;
                    }
                }
            }
        });
    }
    if (pointDeMire < 0) {
        pointDeMire = 1830;
    }
    // console.log('PDM: '+pointDeMire);
};

function isSurrounded(bat) {
    let surroundingTiles = 8;
    if (zone[bat.tileId].x === 1) {
        if (zone[bat.tileId].y === 1) {
            surroundingTiles = surroundingTiles-5;
        } else {
            surroundingTiles = surroundingTiles-3;
        }
    } else {
        if (zone[bat.tileId].y === 1) {
            surroundingTiles = surroundingTiles-3;
        }
    }
    let surroundingAliens = 0;
    if (alienOccupiedTiles.includes(bat.tileId+1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId-1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId-mapSize+1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId-mapSize-1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId-mapSize)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId+mapSize+1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId+mapSize-1)) {
        surroundingAliens++;
    }
    if (alienOccupiedTiles.includes(bat.tileId+mapSize)) {
        surroundingAliens++;
    }
    if (surroundingAliens >= surroundingTiles-2) {
        return true;
    } else {
        return false;
    }
};

function targetLogic(bat,iter) {
    let tFuzz = 0;
    let batType = getBatType(bat);
    let modifiedArmor = Math.round(bat.armor*selectedWeap.armors);
    let averageDamage = selectedWeap.power-modifiedArmor;
    let armorPiercing = selectedWeap.armors;
    if (armorPiercing >= 0.75 && armorPiercing <= 1) {
        armorPiercing = 1;
    }
    let twistedArmor = Math.round(bat.armor*armorPiercing);
    let twistedDamage = selectedWeap.power-twistedArmor;
    if (selectedBatType.skills.includes('igtarglog')) {
        tFuzz = selectedWeap.power;
    } else {
        if (averageDamage >= selectedWeap.power/2) {
            tFuzz = twistedDamage+bat.armor+rand.rand(0,2);
        } else {
            tFuzz = averageDamage;
        }
    }
    if (bat.fuzz <= -2) {
        if (tFuzz > 0) {
            tFuzz = Math.round(tFuzz/2);
        } else {
            tFuzz = Math.round(tFuzz*2);
        }
    }
    if (bat.tags.includes('nopilots') || batType.skills.includes('noselfmove')) {
        if (!selectedBatType.skills.includes('capbld')) {
            let selfMove = checkSelfMove(bat,batType);
            if (!selfMove) {
                if (iter <= 4 || selectedBatType.skills.includes('nobldtarg')) {
                    tFuzz = -999;
                } else {
                    tFuzz = -95;
                }
            }
        }
    }
    if (batType.skills.includes('robot') || batType.crew === 0) {
        if (selectedWeap.ammo.includes('psionics')) {
            tFuzz = -95;
        }
    }
    if (batType.cat === 'infantry') {
        if (selectedWeap.ammo.includes('eflash')) {
            tFuzz = -95;
        }
    }
    if (batType.cat != 'infantry') {
        if (selectedWeap.ammo.includes('toxine') || selectedWeap.ammo.includes('necrotox')) {
            tFuzz = -95;
        }
        if (selectedWeap.ammo.includes('poison')) {
            if (tFuzz > 0) {
                tFuzz = Math.round(tFuzz/2);
            } else {
                tFuzz = Math.round(tFuzz*2);
            }
        }
        if (selectedBatType.skills.includes('infkill')) {
            if (tFuzz > 0) {
                tFuzz = Math.round(tFuzz/3);
            } else {
                tFuzz = Math.round(tFuzz*3);
            }
        }
        if (selectedBatType.skills.includes('capmen')) {
            tFuzz = -95;
        }
    }
    if (batType.hp <= 20) {
        if (selectedWeap.power >= 25 && selectedWeap.accuracy <= 14 && selectedWeap.aoe != 'squad' && selectedWeap.aoe != 'bat') {
            if (tFuzz > 0) {
                tFuzz = Math.round(tFuzz/2);
            } else {
                tFuzz = Math.round(tFuzz*2);
            }
        }
    }
    if (hasEquip(bat,['repel'])) {
        let repelChance = (playerInfos.comp.exo*6)+(playerInfos.comp.ca*12)+(playerInfos.comp.gen*2)+10;
        if (rand.rand(1,100) <= repelChance) {
            tFuzz = -95;
        } else {
            if (tFuzz > 0) {
                tFuzz = Math.round(tFuzz/2);
            } else {
                tFuzz = Math.round(tFuzz*2);
            }
        }
    }
    if (tFuzz < -95) {
        tFuzz = -95;
    }
    if (selectedBatType.skills.includes('nobldtarg')) {
        if (iter <= 4) {
            if (batType.cat === 'buildings' || batType.cat === 'devices' || (batType.cat === 'vehicles' && bat.armor >= 5)) {
                tFuzz = -999;
            }
        }
    }
    if (selectedBatType.skills.includes('aimcfo')) {
        if (batType.skills.includes('dome')) {
            tFuzz = 999;
        } else if (batType.skills.includes('pilone') || batType.skills.includes('cfo')) {
            tFuzz = 777;
        }
    }
    return Math.round(tFuzz);
};

function calcMinFuzz() {
    let minFuzz = {};
    if (selectedBat.tags.includes('nez')) {
        minFuzz.unit = -2;
        minFuzz.bld = -2;
    } else if (selectedBatType.skills.includes('nez')) {
        minFuzz.unit = -2;
        minFuzz.bld = 0;
    } else {
        minFuzz.unit = 0;
        minFuzz.bld = 0;
    }
    if (minFuzz.unit === 0 && selectedBatType.skills.includes('destructeur')) {
        minFuzz.unit = -1;
    }
    return minFuzz;
};

function checkfullStealth(bat,batType) {
    let fullStealth = false;
    if (playerInfos.comp.cam >= 2) {
        if (bat.fuzz <= -2) {
            if (batType.cat === 'infantry') {
                if (hasEquip(bat,['repel'])) {
                    if (bat.oldTileId === bat.tileId) {
                        if (bat.apLeft >= bat.ap-3) {
                            fullStealth = true;
                        }
                    }
                }
            }
        }
    }
    return fullStealth;
};

function isBldLike(bat,batType) {
    // uniquement pour les cibles des aliens!!!
    let bldLike = false;
    if (batType.cat === 'buildings') {
        bldLike = true;
    } else if (batType.cat === 'devices') {
        if (batType.crew === 0) {
            bldLike = true;
        }
    }
    return bldLike;
};

function anyCloseTarget(iter) {
    newPointDeMire = -1;
    let closeRange = closeTargetRange;
    // console.log('closeRange='+closeRange);
    if (selectedBat.squadsLeft === selectedBatType.squads && selectedBat.damage === 0) {
        closeRange = closeRange-1;
    } else if (selectedBat.squadsLeft >= selectedBatType.squads/2) {
        closeRange = closeRange+1;
    }
    if (!selectedBatType.skills.includes('flee') || selectedBatType.squads < selectedBat.squadsLeft*2) {
        let distance;
        let lePlusProche = 100;
        let minFuzz = calcMinFuzz();
        let bestLogic = -99;
        let tLogic;
        let shufBats = _.shuffle(bataillons);
        shufBats.forEach(function(bat) {
            if (checkAlienFlyTarget(selectedWeap,bat)) {
                if (bat.loc === "zone") {
                    if (!isSurrounded(bat)) {
                        batType = getBatType(bat);
                        let bldLike = isBldLike(bat,batType);
                        let fullStealth = checkfullStealth(bat,batType);
                        if (!fullStealth) {
                            if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                                if ((!batType.skills.includes('fly') && bat.eq != 'e-jetpack') || !selectedWeap.noFly) {
                                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                                    // console.log(bat.type);
                                    // console.log('distance='+distance);
                                    if (distance <= closeRange) {
                                        tLogic = targetLogic(bat,iter);
                                        // console.log('tLogic='+tLogic);
                                        if (tLogic > bestLogic) {
                                            bestLogic = tLogic;
                                            newPointDeMire = bat.tileId;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    if (newPointDeMire >= 0) {
        pointDeMire = newPointDeMire;
        // console.log('new PDM: '+pointDeMire);
    }
    // console.log('pointDeMire='+pointDeMire);
};

function anyFarTarget(iter) {
    newPointDeMire = -1;
    if (!selectedBatType.skills.includes('flee') || selectedBatType.squads < selectedBat.squadsLeft*2) {
        let distance;
        let bestLogic = -99;
        let tLogic;
        let minFuzz = -1;
        let batType;
        let shufBats = _.shuffle(bataillons);
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && bat.fuzz >= minFuzz) {
                if (checkAlienFlyTarget(selectedWeap,bat)) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    distance = distance-(bat.fuzz*2);
                    if (distance <= 11) {
                        tLogic = targetLogic(bat,iter);
                        if (tLogic > bestLogic) {
                            bestLogic = tLogic;
                            newPointDeMire = bat.tileId;
                        }
                    }
                }
            }
        });
    }
    if (newPointDeMire > 0) {
        pointDeMire = newPointDeMire;
        // console.log('new PDM: '+pointDeMire);
    }
};

function pdmOffsets(tileId) {
    // offsets x et y entre alien et PDM
    myTileX = zone[tileId].x;
    myTileY = zone[tileId].y;
    pdmTileX = zone[pointDeMire].x;
    pdmTileY = zone[pointDeMire].y;
    xOff = Math.abs(myTileX-pdmTileX);
    yOff = Math.abs(myTileY-pdmTileY);
    return [xOff,yOff];
};

function checkPossibleMoves() {
    possibleMoves = [];
    let batHere = false;
    zone.forEach(function(tile) {
        if (isAdjacent(selectedBat.tileId,tile.id)) {
            if (playerOccupiedTiles.includes(tile.id)) {
                batHere = true;
            } else {
                batHere = false;
                if (alienOccupiedTiles.includes(tile.id)) {
                    batHere = true;
                }
            }
            let terAccess = alienTerrainAccess(tile,selectedBatType);
            if (!terAccess) {
                batHere = true;
            }
            if (!batHere) {
                possibleMoves.push(tile.id);
            }
        }
    });
};

function alienTerrainAccess(tile,batType) {
    let access = true;
    let terrain = getTerrainById(tile.id);
    let terFlood = terrain.flood;
    if (terrain.name === 'R' && tile.seed >= 4) {
        terFlood = 0;
    }
    if (batType.maxFlood < terFlood && !tile.rd) {
        access = false;
    }
    if (batType.maxScarp < terrain.scarp && !tile.rd) {
        access = false;
    }
    if (batType.maxVeg < terrain.veg && !tile.rd) {
        access = false;
    }
    if (batType.skills.includes('nodry')) {
        if (terrain.flood < 1) {
            if (terrain.veg < 1) {
                access = false;
            }
        }
    }
    return access;
};

function checkPossibleJumps() {
    possibleMoves = [];
    let batHere = false;
    let distance;
    let maxDistance;
    if (selectedBatType.skills.includes('sauteur') || selectedBatType.skills.includes('vault')) {
        if (selectedBatType.skills.includes('errant')) {
            maxDistance = 9;
        } else if (selectedBatType.skills.includes('sauteur')) {
            maxDistance = 5;
        } else {
            maxDistance = 7;
        }
    } else {
        maxDistance = Math.round(selectedBat.apLeft/selectedBatType.moveCost/1.1/moveTuning);
    }
    zone.forEach(function(tile) {
        distance = calcDistance(selectedBat.tileId,tile.id);
        if (distance <= maxDistance) {
            if (playerOccupiedTiles.includes(tile.id)) {
                batHere = true;
            } else {
                batHere = false;
                if (alienOccupiedTiles.includes(tile.id)) {
                    batHere = true;
                }
            }
            if (!batHere) {
                possibleMoves.push(tile.id);
            }
        }
    });
};

function uncheckMeleeMoves() {
    // remove moves to melee from possible moves
    let thisTile;
    let meleeTile;
    zone.forEach(function(tile) {
        thisTile = tile.id;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" && bat.tileId === thisTile) {
                meleeTile = thisTile-1;
                delPossibleMove(meleeTile);
                meleeTile = thisTile+1;
                delPossibleMove(meleeTile);
                meleeTile = thisTile-mapSize;
                delPossibleMove(meleeTile);
                meleeTile = thisTile+mapSize;
                delPossibleMove(meleeTile);
            }
        });
    });
};

function uncheckRange1Moves() {
    // remove moves to range 1 from possible moves
    let thisTile;
    let r1Tile;
    zone.forEach(function(tile) {
        thisTile = tile.id;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" && bat.tileId === thisTile) {
                r1Tile = thisTile-mapSize-1;
                delPossibleMove(r1Tile);
                r1Tile = thisTile-mapSize+1;
                delPossibleMove(r1Tile);
                r1Tile = thisTile+mapSize-1;
                delPossibleMove(r1Tile);
                r1Tile = thisTile+mapSize+1;
                delPossibleMove(r1Tile);
            }
        });
    });
};

function uncheckBadMoves() {
    let alienOff = pdmOffsets(selectedBat.tileId);
    let tileOff;
    let shufZone = _.shuffle(zone);
    // enlève les possibleMoves qui éloignent fortement du PDM
    if (possibleMoves.length > 1) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length > 1) {
                    tileOff = pdmOffsets(tile.id);
                    if (alienOff[0] > alienOff[1]) {
                        if (alienOff[0] < tileOff[0]) {
                            delPossibleMove(tile.id);
                        } else if (alienOff[0] == tileOff[0] && alienOff[1] < tileOff[1]) {
                            delPossibleMove(tile.id);
                        }
                    } else if (alienOff[0] < alienOff[1]) {
                        if (alienOff[1] < tileOff[1]) {
                            delPossibleMove(tile.id);
                        } else if (alienOff[1] == tileOff[1] && alienOff[0] < tileOff[0]) {
                            delPossibleMove(tile.id);
                        }
                    } else {
                        if (alienOff[0] < tileOff[0] || alienOff[1] < tileOff[1]) {
                            delPossibleMove(tile.id);
                        }
                    }
                }
            }
        });
    }
    // enlève les possibleMoves vers l'eau
    if (possibleMoves.length >= 3 && rand.rand(1,3) != 1 && !selectedBatType.skills.includes('hover') && !selectedBatType.skills.includes('fly')) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length >= 3) {
                    if (tile.terrain === 'S' || tile.terrain === 'W' || tile.terrain === 'L' || tile.terrain === 'R') {
                        delPossibleMove(tile.id);
                    }
                }
            }
        });
    }
    // enlève les possibleMoves vers la terre (si amphibie)
    if (possibleMoves.length >= 2 && selectedBatType.skills.includes('hover')) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length >= 2) {
                    if (tile.terrain != 'S' && tile.terrain != 'W' && tile.terrain != 'R' && tile.terrain != 'L') {
                        delPossibleMove(tile.id);
                    }
                }
            }
        });
    }
    // enlève les possibleMoves qui ne rapproche pas du PDM quand l'unité est proche du but
    if (possibleMoves.length >= 2) {
        shufZone.forEach(function(tile) {
            if (isAdjacent(selectedBat.tileId,tile.id)) {
                if (possibleMoves.length > 1) {
                    tileOff = pdmOffsets(tile.id);
                    if (alienOff[0] <= 4 && alienOff[1] <= 4) {
                        if (alienOff[0] == tileOff[0]) {
                            delPossibleMove(tile.id);
                        }
                        if (alienOff[1] == tileOff[1]) {
                            delPossibleMove(tile.id);
                        }
                    }
                }
            }
        });
    }
};

function uncheckBadJumps() {
    let alienOff = pdmOffsets(selectedBat.tileId);
    let tileOff;
    let shufZone = _.shuffle(zone);
    // enlève les possibleMoves qui éloignent du PDM
    if (possibleMoves.length > 1) {
        shufZone.forEach(function(tile) {
            if (possibleMoves.length > 1) {
                tileOff = pdmOffsets(tile.id);
                if (alienOff[0] < tileOff[0] || alienOff[1] < tileOff[1]) {
                    delPossibleMove(tile.id);
                }
            }
        });
    }
    // enlève les possibleMoves vers l'eau
    if (possibleMoves.length >= 2 && !selectedBatType.skills.includes('hover') && !selectedBatType.skills.includes('fly')) {
        shufZone.forEach(function(tile) {
            if (possibleMoves.length > 1) {
                if (tile.terrain === 'S' || tile.terrain === 'W' || tile.terrain === 'L' || tile.terrain === 'R') {
                    delPossibleMove(tile.id);
                }
            }
        });
    }
    // enlève les possibleMoves qui ne rapproche pas du PDM quand l'unité est proche du but
    if (possibleMoves.length > 1) {
        shufZone.forEach(function(tile) {
            if (possibleMoves.length > 1) {
                tileOff = pdmOffsets(tile.id);
                if (alienOff[0] <= 4 && alienOff[1] <= 4) {
                    if (alienOff[0] == tileOff[0]) {
                        delPossibleMove(tile.id);
                    }
                    if (alienOff[1] == tileOff[1]) {
                        delPossibleMove(tile.id);
                    }
                }
            }
        });
    }
};

function uncheckShortJumps() {
    let longestJump = 1;
    let distance;
    // enlève les possibleMoves les plus courts
    if (possibleMoves.length > 1) {
        zone.forEach(function(tile) {
            distance = calcDistance(selectedBat.tileId,tile.id);
            if (distance > longestJump) {
                longestJump = distance;
            }
        });
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (possibleMoves.length > 1) {
                distance = calcDistance(selectedBat.tileId,tile.id);
                if (distance < longestJump) {
                    delPossibleMove(tile.id);
                }
            }
        });
    }
};

function checkGoodMoves() {
    // vérifie s'il y a un (ou des) moves parfaits et si oui : remplace possibleMoves
    let goodMoves = [];
    let thisTile;
    let minFuzz = calcMinFuzz();
    let repelChance = (playerInfos.comp.exo*6)+(playerInfos.comp.ca*12)+(playerInfos.comp.gen*2)+10;
    let bestLogic = -99;
    let tLogic;
    let batType;
    let shufBats = _.shuffle(bataillons);
    if (selectedWeap.range === 0) {
        let meleeTile;
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                let repeled = false;
                if (hasEquip(bat,['repel'])) {
                    if (rand.rand(1,100) <= repelChance) {
                        repeled = true;
                    }
                }
                if (!repeled) {
                    batType = getBatType(bat);
                    let bldLike = isBldLike(bat,batType);
                    let fullStealth = checkfullStealth(bat,batType);
                    if (!fullStealth) {
                        if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                            thisTile = bat.tileId;
                            meleeTile = thisTile-1;
                            if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                                tLogic = targetLogic(bat,-1);
                                if (tLogic >= bestLogic) {
                                    bestLogic = tLogic;
                                    goodMoves.push(meleeTile);
                                }
                            }
                            meleeTile = thisTile+1;
                            if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                                tLogic = targetLogic(bat,-1);
                                if (tLogic >= bestLogic) {
                                    bestLogic = tLogic;
                                    goodMoves.push(meleeTile);
                                }
                            }
                            meleeTile = thisTile-mapSize;
                            if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                                tLogic = targetLogic(bat,-1);
                                if (tLogic >= bestLogic) {
                                    bestLogic = tLogic;
                                    goodMoves.push(meleeTile);
                                }
                            }
                            meleeTile = thisTile+mapSize;
                            if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
                                tLogic = targetLogic(bat,-1);
                                if (tLogic >= bestLogic) {
                                    bestLogic = tLogic;
                                    goodMoves.push(meleeTile);
                                }
                            }
                        }
                    }
                }
            }
        });
    } else if (selectedWeap.range === 1) {
        let r1Tile;
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                let repeled = false;
                if (hasEquip(bat,['repel'])) {
                    if (rand.rand(1,100) <= repelChance) {
                        repeled = true;
                    }
                }
                if (!repeled) {
                    batType = getBatType(bat);
                    let bldLike = isBldLike(bat,batType);
                    if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                        thisTile = bat.tileId;
                        r1Tile = thisTile-mapSize-1;
                        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                            tLogic = targetLogic(bat,-1);
                            if (tLogic >= bestLogic) {
                                bestLogic = tLogic;
                                goodMoves.push(r1Tile);
                            }
                        }
                        r1Tile = thisTile-mapSize+1;
                        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                            tLogic = targetLogic(bat,-1);
                            if (tLogic >= bestLogic) {
                                bestLogic = tLogic;
                                goodMoves.push(r1Tile);
                            }
                        }
                        r1Tile = thisTile+mapSize-1;
                        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                            tLogic = targetLogic(bat,-1);
                            if (tLogic >= bestLogic) {
                                bestLogic = tLogic;
                                goodMoves.push(r1Tile);
                            }
                        }
                        r1Tile = thisTile+mapSize+1;
                        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
                            tLogic = targetLogic(bat,-1);
                            if (tLogic >= bestLogic) {
                                bestLogic = tLogic;
                                goodMoves.push(r1Tile);
                            }
                        }
                    }
                }
            }
        });
    }
    if (goodMoves.length >= 1) {
        possibleMoves = goodMoves;
        // console.log('ideal move found');
    }
};

function checkAimMoves() {
    // vérifie s'il y a un (ou des) moves qui mène au PDM : remplace possibleMoves
    let goodMoves = [];
    let thisTile;
    if (selectedWeap.range === 0) {
        let meleeTile;
        meleeTile = pointDeMire-1;
        if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
            goodMoves.push(meleeTile);
        }
        meleeTile = pointDeMire+1;
        if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
            goodMoves.push(meleeTile);
        }
        meleeTile = pointDeMire-mapSize;
        if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
            goodMoves.push(meleeTile);
        }
        meleeTile = pointDeMire+mapSize;
        if (possibleMoves.includes(meleeTile) && !goodMoves.includes(meleeTile)) {
            goodMoves.push(meleeTile);
        }
    } else if (selectedWeap.range === 1) {
        let r1Tile;
        r1Tile = pointDeMire-mapSize-1;
        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
            goodMoves.push(r1Tile);
        }
        r1Tile = pointDeMire-mapSize+1;
        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
            goodMoves.push(r1Tile);
        }
        r1Tile = pointDeMire+mapSize-1;
        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
            goodMoves.push(r1Tile);
        }
        r1Tile = pointDeMire+mapSize+1;
        if (possibleMoves.includes(r1Tile) && !goodMoves.includes(r1Tile)) {
            goodMoves.push(r1Tile);
        }
    } else if (selectedWeap.range >= 2) {
        zone.forEach(function(tile) {
            if (possibleMoves.includes(tile.id) && !goodMoves.includes(tile.id)) {
                distance = calcDistance(tile.id,pointDeMire);
                if (distance <= selectedWeap.range) {
                    goodMoves.push(tile.id);
                }
            }
        });
    }
    if (goodMoves.length >= 1) {
        possibleMoves = goodMoves;
        // console.log('PDM ideal move found');
    }
};

function delPossibleMove(delId) {
    // remove id from possible moves
    let pmIndex;
    if (possibleMoves.includes(delId)) {
        pmIndex = possibleMoves.indexOf(delId);
        possibleMoves.splice(pmIndex,1);
    }
};

function moveToPDM() {
    if (selectedBatType.moveCost < 99) {
        // console.log('move to PDM');
        let jump = false;
        if (selectedBatType.skills.includes('sauteur') && rand.rand(1,3) === 1 && (selectedBat.apLeft >= 4 || selectedBatType.skills.includes('invisible'))) {
            jump = true;
        }
        if (selectedBatType.skills.includes('vault') && rand.rand(1,3) === 1) {
            jump = true;
        }
        if (selectedBat.tags.includes('stun')) {
            jump = false;
        }
        if (selectedBatType.skills.includes('fly')) {
            jump = true;
        }
        if (selectedBat.tags.includes('freeze')) {
            jump = false;
        }
        if (jump) {
            checkPossibleJumps();
            checkAimMoves();
            uncheckBadJumps();
            uncheckShortJumps();
        } else {
            checkPossibleMoves();
            if (selectedBatType.skills.includes('flee') && selectedBatType.squads >= selectedBat.squadsLeft*2) {
                // only go to PDM
            } else if (selectedBatType.skills.includes('capbld') || selectedBatType.skills.includes('capfar')) {
                checkAimMoves();
            } else {
                checkGoodMoves();
            }
            uncheckBadMoves();
        }
        chooseMove();
        doMove(jump);
        // console.log(possibleMoves);
    }
};

function moveOutOfMelee() {
    if (selectedBatType.moveCost < 99) {
        // console.log('move out of melee');
        // bouge de 1 tile hors mêlée
        checkPossibleMoves();
        uncheckMeleeMoves();
        oldPossibleMoves = possibleMoves;
        if (possibleMoves.length > 1) {
            uncheckRange1Moves();
        }
        if (possibleMoves.length < 1) {
            possibleMoves = oldPossibleMoves;
        }
        chooseMove();
        doMove(false);
        // console.log(possibleMoves);
    }
};

function chooseMove() {
    if (possibleMoves.length > 1) {
        possibleMoves = [_.sample(possibleMoves)];
    }
};

function doMove(jump) {
    if (selectedBatType.moveCost < 99 && possibleMoves.length >= 1 && !selectedBat.tags.includes('freeze')) {
        let tileId = possibleMoves[0];
        moveAlienBat(tileId,jump);
    }
};

function moveAlienBat(tileId,jump) {
    // remove unit and redraw old tile
    tileUnselect();
    $('#b'+selectedBat.tileId).empty();
    // remove ap
    let moveCost;
    if (jump) {
        moveCost = selectedBat.apLeft-2;
    } else {
        if (isDiag(selectedBat.tileId,tileId)) {
            moveCost = calcMoveCost(tileId,true);
        } else {
            moveCost = calcMoveCost(tileId,false);
        }
    }
    let apLost = moveCost.toFixedNumber(1);
    selectedBat.apLeft = selectedBat.apLeft-apLost;
    // move
    selectedBat.tileId = tileId;
    tileSelect(selectedBat);
    showAlien(selectedBat);
    // update arrays
    selectedBatArrayUpdate();
};

function anyTargetInRange() {
    let distance;
    let inRange = false;
    let minFuzz = calcMinFuzz();
    let batType;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
            batType = getBatType(bat);
            let bldLike = isBldLike(bat,batType);
            let fullStealth = checkfullStealth(bat,batType);
            if (!fullStealth) {
                if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance <= selectedWeap.range) {
                        inRange = true;
                    }
                }
            }
        }
    });
    return inRange;
};

function lockTargetBat(bat) {
    targetBat = JSON.parse(JSON.stringify(bat));
    // console.log('LOCK TARGET');
    // console.log(targetBat.type);
};

function targetMelee(iter) {
    // console.log('targetMeleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    // console.log(selectedBatType.name);
    let distance;
    let inPlace = false;
    let minFuzz = calcMinFuzz();
    // console.log(minFuzz);
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone") {
            distance = calcDistance(selectedBat.tileId,bat.tileId);
            if (distance === 0) {
                if (checkAlienFlyTarget(selectedWeap,bat)) {
                    batType = getBatType(bat);
                    let bldLike = isBldLike(bat,batType);
                    let fullStealth = checkfullStealth(bat,batType);
                    if (!fullStealth) {
                        if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                            if (inPlace === false) {
                                tLogic = targetLogic(bat,iter);
                                if (tLogic > bestLogic) {
                                    bestLogic = tLogic;
                                    lockTargetBat(bat);
                                    inPlace = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    // console.log('inPlace='+inPlace);
    return inPlace;
};

function targetFarthest(iter) {
    // console.log('targetFarthest');
    let distance = 0;
    let lePlusLoin = 0;
    let inPlace = false;
    let minFuzz = calcMinFuzz();
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                let bldLike = isBldLike(bat,batType);
                let fullStealth = checkfullStealth(bat,batType);
                if (!fullStealth) {
                    if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                        distance = calcDistance(selectedBat.tileId,bat.tileId);
                        if (distance <= selectedWeap.range) {
                            tLogic = targetLogic(bat,iter);
                            if (tLogic > bestLogic) {
                                bestLogic = tLogic;
                                // targetBat = JSON.parse(JSON.stringify(bat));
                                lockTargetBat(bat);
                                inPlace = true;
                            }
                        }
                    }
                }
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                let bldLike = isBldLike(bat,batType);
                if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance === 0) {
                        tLogic = targetLogic(bat,iter);
                        if (tLogic > bestLogic) {
                            bestLogic = tLogic;
                            // targetBat = JSON.parse(JSON.stringify(bat));
                            lockTargetBat(bat);
                            inPlace = true;
                        }
                    }
                }
            }
        });
    }
    return inPlace;
};

function targetClosest(iter) {
    // console.log('targetClosest');
    let inPlace = false;
    let distance = 100;
    let lePlusProche = 100;
    let minFuzz = calcMinFuzz();
    let bestLogic = -99;
    let tLogic;
    let shufBats = _.shuffle(bataillons);
    if (!isAlienInMelee(selectedBat.tileId)) {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                let bldLike = isBldLike(bat,batType);
                let fullStealth = checkfullStealth(bat,batType);
                if (!fullStealth) {
                    if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                        distance = calcDistance(selectedBat.tileId,bat.tileId);
                        if (distance === selectedWeap.range) {
                            tLogic = targetLogic(bat,iter);
                            if (tLogic > bestLogic) {
                                bestLogic = tLogic;
                                // targetBat = JSON.parse(JSON.stringify(bat));
                                lockTargetBat(bat);
                                inPlace = true;
                            }
                        }
                    }
                }
            }
        });
    } else {
        shufBats.forEach(function(bat) {
            if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
                batType = getBatType(bat);
                let bldLike = isBldLike(bat,batType);
                if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                    distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance === 0) {
                        tLogic = targetLogic(bat,iter);
                        if (tLogic > bestLogic) {
                            bestLogic = tLogic;
                            // targetBat = JSON.parse(JSON.stringify(bat));
                            lockTargetBat(bat);
                            inPlace = true;
                        }
                    }
                }
            }
        });
    }
    return inPlace;
};

function isAlienInMelee(tileId) {
    let distance;
    let alienInMelee = false;
    let minFuzz = calcMinFuzz();
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && checkAlienFlyTarget(selectedWeap,bat)) {
            batType = getBatType(bat);
            let bldLike = isBldLike(bat,batType);
            let fullStealth = checkfullStealth(bat,batType);
            if (!fullStealth) {
                if ((bat.fuzz >= minFuzz.unit && !bldLike) || (bat.fuzz >= minFuzz.bld && bldLike)) {
                    distance = calcDistance(tileId,bat.tileId);
                    if (distance === 0) {
                        alienInMelee = true;
                    }
                }
            }
        }
    });
    return alienInMelee;
};

function isCamoBlock() {
    let alienAdjTiles = [];
    alienAdjTiles.push(selectedBat.tileId-1);
    alienAdjTiles.push(selectedBat.tileId+1);
    alienAdjTiles.push(selectedBat.tileId-mapSize);
    alienAdjTiles.push(selectedBat.tileId-mapSize+1);
    alienAdjTiles.push(selectedBat.tileId-mapSize-1);
    alienAdjTiles.push(selectedBat.tileId+mapSize);
    alienAdjTiles.push(selectedBat.tileId+mapSize+1);
    alienAdjTiles.push(selectedBat.tileId+mapSize-1);
    let alienMeleeTiles = [];
    alienMeleeTiles.push(selectedBat.tileId-1);
    alienMeleeTiles.push(selectedBat.tileId+1);
    alienMeleeTiles.push(selectedBat.tileId-mapSize);
    alienMeleeTiles.push(selectedBat.tileId+mapSize);
    let camoBlocks = 0;
    let meleeBlocks = 0;
    let allBlocks = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && alienAdjTiles.includes(bat.tileId)) {
            if (bat.fuzz <= -2) {
                camoBlocks = camoBlocks+1;
                if (alienMeleeTiles.includes(bat.tileId)) {
                    meleeBlocks = meleeBlocks+1;
                }
            }
            allBlocks = allBlocks+1;
        }
    });
    let camoGroup = false;
    let lastCamo = -1;
    let distance;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && alienAdjTiles.includes(bat.tileId) && bat.fuzz <= -2) {
            lastCamo = bat.tileId;
            bataillons.forEach(function(camoBat) {
                if (camoBat.loc === "zone" && alienAdjTiles.includes(camoBat.tileId) && camoBat.fuzz <= -2) {
                    if (lastCamo != camoBat.tileId) {
                        distance = calcDistance(lastCamo,camoBat.tileId);
                        if (distance <= 0) {
                            camoGroup = true;
                        }
                    }
                }
            });
        }
    });
    let blocked = false;
    if (camoBlocks >= 2 && meleeBlocks >= 1 && allBlocks >= 3) {
        blocked = true;
    }
    if (camoGroup) {
        blocked = true;
    }
    if (blocked) {
        // CAMOBLOCK!!
        let camoUnblocked = false;
        if (!selectedBat.tags.includes('nez')) {
            selectedBat.tags.push('nez');
        }
        // console.log(selectedBatType.name+' is blocked');
        // console.log(selectedBat.tags);
    }
};

function alienBonus() {
    bugROF = 1;
    spiderRG = false;
    spiderMV = false;
    spiderROF = false;
    bugSHIELD = false;
    eggSHIELD = false;
    larveHIDE = false;
    let hasBlob = false;
    if (hasAlien('Spiderblob')) {
        hasBlob = true;
    }
    let isSpiderMap = false;
    if (zone[0].number < 85 && zone[0].number >= 80) {
        isSpiderMap = true;
    }
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            let batType = getBatType(bat);
            if (batType.skills.includes('bugboost')) {
                bugROF = 1.5;
            }
            if (batType.skills.includes('spiderrange')) {
                spiderRG = true;
            }
            if (batType.skills.includes('spidermove')) {
                spiderMV = true;
            }
            if (batType.skills.includes('spiderboost')) {
                spiderROF = true;
            }
            if (batType.skills.includes('larvehide')) {
                larveHIDE = true;
            }
            if (batType.skills.includes('bugshield')) {
                bugSHIELD = true;
            }
            if (batType.skills.includes('eggshield')) {
                eggSHIELD = true;
            }
            if (isSpiderMap && !hasBlob) {
                delete bat.pdm;
            }
        }
    });
    if (isSpiderMap && !hasBlob) {
        spiderMV = true;
    }
};

function infraDestruction() {
    let skyMap = false;
    if (zone[0].number >= 70 && zone[0].number <= 74) {
        skyMap = true;
    }
    if (selectedBat.apLeft >= 4 && rand.rand(1,2) === 1 && !skyMap) {
        let tile = getTile(selectedBat);
        let destroySize = 999;
        if (tile.infra != undefined) {
            if (tile.infra != 'Débris') {
                if (tile.infra === 'Miradors') {
                    destroySize = 10;
                } else if (tile.infra === 'Palissades') {
                    destroySize = 15;
                } else if (tile.infra === 'Remparts') {
                    destroySize = 27;
                } else if (tile.infra === 'Murailles') {
                    destroySize = 38;
                }
            }
        }
        if (tile.rd && (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain === 'L')) {
            destroySize = 15;
        }
        if (destroySize < 999) {
            let alienSize = Math.round(selectedBatType.size*selectedBat.squadsLeft/selectedBatType.squads*(selectedBat.apLeft+4)/(selectedBat.ap+4));
            if (selectedBatType.skills.includes('destructeur')) {
                alienSize = alienSize+10;
            }
            if (alienSize >= destroySize) {
                let destroyCost = Math.ceil(selectedBat.ap*destroySize/alienSize*2);
                selectedBat.apLeft = selectedBat.apLeft-destroyCost;
                if (tile.rd && (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain === 'L')) {
                    warning('Destruction',selectedBat.type+' a détruit le Pont',false,tile.id);
                    tile.rd = false;
                } else {
                    warning('Destruction',selectedBat.type+' a détruit '+tile.infra,false,tile.id);
                    tile.infra = 'Débris';
                }
                // saveMap();
                showMap(zone,false);
                selectedBatArrayUpdate();
            }
        }
    }
};

function fearFactor(myBat,blob) {
    let myBatType = getBatType(myBat);
    if (myBatType.skills.includes('fear') || myBatType.skills.includes('terror') || myBatType.skills.includes('dread') || blob) {
        // console.log('FEAR');
        let distance;
        let fearChance;
        let batIndex;
        let batType;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                distance = calcDistance(myBat.tileId,bat.tileId);
                if (distance === 0 || (myBatType.skills.includes('terror') && distance <= 3)) {
                    batType = getBatType(bat);
                    if (batType.moveCost < 99) {
                        if (blob) {
                            fearChance = 100;
                        } else {
                            let batLevel = bat.vet;
                            if (bat.vet === 4) {
                                batLevel = 5;
                            }
                            if (batType.skills.includes('robot') || bat.tags.includes('zombie')) {
                                fearChance = 0;
                            } else if (bat.tags.includes('bliss') || batType.skills.includes('nofear') || bat.tags.includes('moloko') || bat.tags.includes('zealot')) {
                                fearChance = 0;
                                if (!myBatType.skills.includes('dread') && batLevel <= 3) {
                                    addStressFlag(bat,'fear');
                                }
                            } else if (myBatType.skills.includes('dread')) {
                                fearChance = Math.round(65-(batType.size*3)-(batLevel*10));
                            } else if (myBatType.skills.includes('terror')) {
                                fearChance = Math.round(75-(batType.size*1)-(batLevel*8));
                                addStressFlag(bat,'fear');
                            } else {
                                fearChance = Math.round(75-(batType.size*2.5)-(batLevel*10));
                                if (batLevel <= 3) {
                                    addStressFlag(bat,'fear');
                                }
                            }
                            fearChance = Math.ceil(fearChance*(myBat.squadsLeft+2)/(myBatType.squads+2));
                        }
                        // console.log('fearChance='+fearChance);
                        if (rand.rand(1,100) <= fearChance) {
                            let tile = getTile(bat);
                            if (!tile.web) {
                                getAway(bat,myBat.tileId,blob);
                            }
                            addStressFlag(bat,'fear');
                        } else {
                            // console.log('noFear');
                        }
                    }
                }
            }
        });
    }
};

function alienTeleport() {
    let teleTileId = -1;
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (teleTileId < 0) {
            let distance = calcDistance(tile.id,selectedBat.tileId);
            if (distance <= 6 && distance >= 2) {
                if (!alienOccupiedTiles.includes(tile.id) && !playerOccupiedTiles.includes(tile.id)) {
                    teleTileId = tile.id;
                }
            }
        }
    });
    if (teleTileId >= 0) {
        moveAlienBat(teleTileId,true);
    }
};
