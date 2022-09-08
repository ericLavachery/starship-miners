function planetEffects(bat,batType) {
    // Gehenna
    if (zone[0].planet === 'Gehenna') {
        if (batType.cat === 'infantry' && batType.name != 'Citoyens' && batType.name != 'Criminels') {
            if (playerInfos.comp.scaph < 1 || batType.squads > bat.squadsLeft || bat.damage >= 1) {
                let medDice = (playerInfos.comp.med*2)+12;
                if (playerInfos.comp.scaph < 1 || batType.squads > bat.squadsLeft) {
                    medDice = medDice-6;
                }
                let terrain = getTerrain(bat);
                if (bat.loc === "zone") {
                    medDice = medDice-(terrain.veg*3);
                } else if (bat.loc === "trans") {
                    let transBat = getBatById(bat.locId);
                    let transBatType = getBatType(transBat);
                    if (transBatType.cat === 'buildings' || transBatType.skills.includes('transorbital')) {
                        medDice = medDice-terrain.veg+10;
                    } else {
                        medDice = medDice-terrain.veg+4;
                    }
                    if (transBatType.squads > transBat.squadsLeft) {
                        medDice = medDice-4
                    }
                }
                medDice = Math.round(medDice);
                if (medDice < 1) {
                    medDice = 1;
                }
                let medRoll = rand.rand(1,medDice);
                if (medRoll === 1) {
                    bat.tags.push('poison');
                    bat.tags.push('poison');
                    if (batType.squads > bat.squadsLeft) {
                        bat.tags.push('maladie');
                    }
                    warning('Poison',batType.name+' empoisonnés par les spores',false,bat.tileId);
                } else if (medRoll === 2) {
                    bat.tags.push('poison');
                    warning('Poison',batType.name+' empoisonnés par les spores',false,bat.tileId);
                }
            }
        }
    }
    // Horst
    if (zone[0].planet === 'Horst' && bat.loc === "zone") {
        if (playerInfos.stList.includes(bat.tileId)) {
            stormDamage(bat,batType,true,false);
        } else if (playerInfos.sqList.includes(bat.tileId)) {
            stormDamage(bat,batType,false,false);
        }
    }
};

function checkCanon() {
    // à enlever quand il y aura la map spéciale
    if (playerInfos.aCanon === 'web') {
        if (zone[0].mapDiff >= 6) {
            let chance = 30+((zone[0].mapDiff-6)*15);
            if (rand.rand(1,100) <= chance) {
                playerInfos.aCanon = 'destroyed';
            }
        }
    }
    // à garder
    if (playerInfos.aCanon === 'none') {
        if (zone[0].mapDiff >= 6) {
            let chance = 40+((zone[0].mapDiff-6)*50);
            if (rand.rand(1,100) <= chance) {
                playerInfos.aCanon = 'web';
            }
        }
    }
};

function alienCanon() {
    if (playerInfos.aCanon === 'web' || hasAlien('Uberspinne')) {
        let freq = 6-Math.floor(zone[0].mapDiff/2);
        if (freq < 2) {freq = 2;}
        if (playerInfos.mapTurn % freq === 0 && playerInfos.mapTurn >= 2) {
            let canonTiles = getCanonTiles('web','egg');
            webCanon(canonTiles);
            showMap(zone,true);
        }
    }
};

function webCanon(canonTiles) {
    webSound();
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (canonTiles.includes(bat.tileId)) {
                if (!bat.tags.includes('mud')) {
                    bat.tags.push('mud');
                }
                if (!bat.tags.includes('web')) {
                    bat.tags.push('web');
                }
            }
        }
    });
};

function getCanonTiles(cType,area) {
    let canonTiles = [];
    let theTile = -1;
    let targetTile = -1;
    // près d'un oeuf en danger
    if (area === 'egg') {
        let bestTarget = 0;
        if (hasAlien('Uberspinne') || (aliens.length < playerInfos.mapTurn*2)) {
            let shufAliens = _.shuffle(aliens);
            shufAliens.forEach(function(bat) {
                if (bat.loc === "zone") {
                    let batType = getBatType(bat);
                    if (batType.skills.includes('ctarg')) {
                        let thisTarget = 0;
                        if (bat.squadsLeft < 6) {
                            thisTarget = thisTarget+50;
                        } else if (bat.damage >= 1) {
                            thisTarget = thisTarget+10;
                        }
                        if (thisTarget >= 1) {
                            if (batType.name != 'Uberspinne') {
                                thisTarget = thisTarget*batType.hp;
                            } else {
                                thisTarget = thisTarget*3000;
                            }
                        }
                        if (thisTarget >= bestTarget) {
                            targetTile = bat.tileId;
                            bestTarget = thisTarget;
                        }
                    }
                }
            });
        } else {
            let shufBats = _.shuffle(bataillons);
            shufBats.forEach(function(bat) {
                if (targetTile < 0) {
                    if (bat.loc === "zone") {
                        let batType = getBatType(bat);
                        if (batType.cat === 'buildings' && bat.fuzz >= 1) {
                            targetTile = bat.tileId;
                        }
                    }
                }
            });
        }
        if (targetTile < 0) {
            targetTile = rand.rand(0,3599);
        }
        let shufZone = _.shuffle(zone);
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                let distance = calcDistance(tile.id,targetTile);
                if (distance <= 4) {
                    theTile = tile.id;
                }
            }
        });
        shufZone.forEach(function(tile) {
            let distance = calcDistance(tile.id,theTile);
            if (distance <= 2) {
                let chance = 10-(distance*distance)-distance;
                if (rand.rand(1,10) <= chance) {
                    canonTiles.push(tile.id);
                    tile.web = true;
                }
            }
        });
    }
    return canonTiles;
};

function stormProtection(dmg,bat,batType) {
    let adjDmg = dmg;
    let tile = getTileById(bat.tileId);
    let stormProtect = 0;
    let infraProtect = 0;
    let terProtect = 0;
    if (tile.infra != undefined) {
        let okCover = bonusInfra(batType,tile.infra);
        if (okCover) {
            if (tile.infra === 'Miradors') {
                infraProtect = 15;
            } else if (tile.infra === 'Palissades') {
                infraProtect = 25;
            } else if (tile.infra === 'Remparts') {
                infraProtect = 35;
            } else if (tile.infra === 'Murailles') {
                infraProtect = 50;
            }
        }
    }
    let terrain = getTileTerrain(bat.tileId);
    if (terrain.scarp > 0) {
        terProtect = terProtect+(terrain.scarp*terrain.scarp*(10-Math.sqrt(batType.size))/2);
    }
    if (terrain.flood > 0) {
        terProtect = terProtect+(terrain.flood*5);
    }
    if (terProtect > infraProtect) {
        stormProtect = stormProtect+terProtect+(infraProtect/3);
    } else {
        stormProtect = stormProtect+infraProtect+(terProtect/3);
    }
    if (bat.tags.includes('fortif')) {
        stormProtect = stormProtect*1.25;
    }
    if (batType.skills.includes('resistfeu') || bat.tags.includes('resistfeu')) {
        if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack') {
            adjDmg = adjDmg/1.25;
        } else {
            adjDmg = adjDmg/1.67;
        }
    } else {
        if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack') {
            adjDmg = adjDmg*1.5;
        }
    }
    if (batType.skills.includes('resistall') || bat.tags.includes('resistall')) {
        adjDmg = adjDmg/1.33;
    }
    adjDmg = Math.ceil(adjDmg*(100-stormProtect)/100);
    return adjDmg;
};

function stormDamage(bat,batType,storm,inMov) {
    let isDead = false;
    if (!storm) {
        // BOURASQUE
        if (playerInfos.comp.scaph < 3) {
            if (batType.cat === 'infantry') {
                let numUnits = Math.round(batType.squadSize*batType.squads*Math.sqrt(batType.size)/1.7);
                let stormDmg = rand.rand(2*numUnits,4*numUnits);
                let batArmour = bat.armor;
                if (bat.tags.includes('fortif')) {
                    batArmour = batArmour+5;
                }
                stormDmg = Math.ceil(stormDmg/Math.sqrt(batArmour+1));
                if (stormDmg > 0) {
                    stormDmg = stormProtection(stormDmg,bat,batType);
                }
                console.log('stormDmg='+stormDmg);
                let totalDamage = bat.damage+stormDmg;
                let squadHP = batType.squadSize*batType.hp;
                let squadsOut = Math.floor(totalDamage/squadHP);
                bat.squadsLeft = bat.squadsLeft-squadsOut;
                bat.damage = totalDamage-(squadsOut*squadHP);
                bat.apLeft = bat.apLeft-3;
                if (bat.apLeft > Math.round(bat.ap/3)) {
                    bat.apLeft = Math.round(bat.ap/3);
                }
                if (bat.squadsLeft <= 0) {
                    batDeathEffect(bat,true,'Tempête',bat.type+' brûlé.');
                    isDead = true;
                    if (inMov) {
                        batDeath(bat,true,false);
                    } else {
                        checkDeath(bat,batType);
                    }
                } else if (stormDmg >= 1) {
                    if (batType.cat === 'infantry') {
                        warning('Tempête',bat.type+' blessés.',false,bat.tileId);
                    } else if (batType.cat === 'buildings') {
                        warning('Tempête',bat.type+' endommagé.',false,bat.tileId);
                    } else {
                        warning('Tempête',bat.type+' endommagés.',false,bat.tileId);
                    }
                }
            }
        }
    } else {
        // TEMPETE
        let numUnits = Math.round(batType.squadSize*batType.squads*Math.sqrt(batType.size)/1.7);
        console.log('numUnits='+numUnits);
        let stormDmg = rand.rand(7*numUnits,20*numUnits);
        console.log('stormDmg='+stormDmg);
        let batArmour = bat.armor;
        if (bat.tags.includes('fortif')) {
            if (batType.size <= 5) {
                batArmour = batArmour+8-batType.size;
            } else {
                batArmour = batArmour+3;
            }
        }
        stormDmg = Math.ceil(stormDmg/Math.sqrt(batArmour+1));
        if (batArmour >= 14 && playerInfos.comp.scaph >= 3) {
            stormDmg = 0;
        }
        if (batType.skills.includes('resiststorm')) {
            stormDmg = 0;
        }
        console.log('stormDmg(a)='+stormDmg);
        if (playerInfos.comp.scaph >= 3 && batType.cat === 'infantry') {
            stormDmg = stormDmg/1.5;
        }
        if (stormDmg > 0) {
            stormDmg = stormProtection(stormDmg,bat,batType);
        }
        console.log('stormDmg(T)='+stormDmg);
        let totalDamage = bat.damage+stormDmg;
        let squadHP = batType.squadSize*batType.hp;
        let squadsOut = Math.floor(totalDamage/squadHP);
        bat.squadsLeft = bat.squadsLeft-squadsOut;
        bat.damage = totalDamage-(squadsOut*squadHP);
        bat.apLeft = bat.apLeft-6;
        if (bat.apLeft > Math.round(bat.ap/4)) {
            bat.apLeft = Math.round(bat.ap/4);
        }
        if (bat.squadsLeft <= 0) {
            batDeathEffect(bat,true,'Tempête',bat.type+' brûlé.');
            isDead = true;
            if (inMov) {
                batDeath(bat,true,false);
            } else {
                checkDeath(bat,batType);
            }
        } else if (stormDmg >= 1) {
            if (batType.cat === 'infantry') {
                warning('Tempête',bat.type+' blessés.',false,bat.tileId);
            } else if (batType.cat === 'buildings') {
                warning('Tempête',bat.type+' endommagé.',false,bat.tileId);
            } else {
                warning('Tempête',bat.type+' endommagés.',false,bat.tileId);
            }
        }
    }
    if (inMov) {
        selectedBatArrayUpdate();
        if (!isDead) {
            showBatInfos(selectedBat);
            showBataillon(selectedBat);
        }
    }
};

function createStormsLists(rebuild,init) {
    if (zone[0].planet === 'Horst') {
        if (rebuild || (playerInfos.stList.length === 0 && playerInfos.sqList.length === 0)) {
            playerInfos.stList = [];
            playerInfos.sqList = [];
            let chance = stormChance;
            if (zone[0].snd === 'thunderred') {
                chance = Math.round(chance*1.75);
            }
            zone.forEach(function(tile) {
                if (rand.rand(1,1000) <= stormChance) {
                    playerInfos.stList.push(tile.id);
                } else if (rand.rand(1,167) <= stormChance) {
                    playerInfos.sqList.push(tile.id);
                }
            });
        } else if (!init) {
            for (var i = 0; i < playerInfos.stList.length; i++){
                let dice = rand.rand(1,6);
                if (dice === 1) {
                    playerInfos.stList[i] = playerInfos.stList[i]+59;
                } else if (dice === 2) {
                    playerInfos.stList[i] = playerInfos.stList[i]-61;
                } else if (dice === 3) {
                    playerInfos.stList[i] = playerInfos.stList[i]-2;
                } else {
                    dice = rand.rand(1,5);
                    if (dice === 1) {
                        playerInfos.stList[i] = playerInfos.stList[i]+58;
                    } else if (dice === 2) {
                        playerInfos.stList[i] = playerInfos.stList[i]-62;
                    } else {
                        playerInfos.stList[i] = playerInfos.stList[i]-1;
                    }
                }
                if (playerInfos.stList[i] < 0) {
                    playerInfos.stList[i] = playerInfos.stList[i]+3600;
                }
                if (playerInfos.stList[i] > 3599) {
                    playerInfos.stList[i] = playerInfos.stList[i]-3600;
                }
            }
            for (var i = 0; i < playerInfos.sqList.length; i++){
                let dice = rand.rand(1,6);
                if (dice === 1) {
                    playerInfos.sqList[i] = playerInfos.sqList[i]+59;
                } else if (dice === 2) {
                    playerInfos.sqList[i] = playerInfos.sqList[i]-61;
                } else if (dice === 3) {
                    playerInfos.sqList[i] = playerInfos.sqList[i]-2;
                } else {
                    dice = rand.rand(1,5);
                    if (dice === 1) {
                        playerInfos.sqList[i] = playerInfos.sqList[i]+58;
                    } else if (dice === 2) {
                        playerInfos.sqList[i] = playerInfos.sqList[i]-62;
                    } else {
                        playerInfos.sqList[i] = playerInfos.sqList[i]-1;
                    }
                }
                if (playerInfos.sqList[i] < 0) {
                    playerInfos.sqList[i] = playerInfos.sqList[i]+3600;
                }
                if (playerInfos.sqList[i] > 3599) {
                    playerInfos.sqList[i] = playerInfos.sqList[i]-3600;
                }
            }
        }
    } else {
        playerInfos.stList = [];
        playerInfos.sqList = [];
    }
    console.log(playerInfos.stList);
};

function undarkList() {
    console.log('UNDARK LIST');
    if (zone[0].dark) {
        if (zone[0].undarkOnce === undefined) {
            console.log('undark undefined');
            if (playerInfos.undarkOnce.length >= 1) {
                zone[0].undarkOnce = playerInfos.undarkOnce;
            } else {
                zone[0].undarkOnce = [];
            }
        }
        if (zone[0].undarkOnce.length >= 3600 || zone[0].undarkAll) {
            zone[0].undarkOnce = [];
            zone[0].undarkAll = true;
        } else {
            zone[0].undarkAll = false;
        }
    } else {
        zone[0].undarkOnce = [];
        zone[0].undarkAll = true;
    }
};

function calcVue(bat,batType) {
    let hauteur = 1;
    terrain = getTerrain(bat);
    if (terrain.scarp >= 2) {
        hauteur = terrain.scarp;
    }
    tile = getTile(bat);
    let infra = '';
    if (tile.infra != undefined) {
        infra = tile.infra;
        if (tile.infra != 'Débris' && tile.infra != 'Terriers') {
            if (tile.infra === 'Miradors' || tile.infra === 'Murailles') {
                hauteur = hauteur+2;
            } else {
                hauteur = hauteur+1;
            }
        }
    }
    if (batType.skills.includes('fly') || batType.skills.includes('jetpack') || bat.eq === 'e-jetpack') {
        hauteur = 5;
    }
    let vue = 0;
    if (batType.crew >=1 || batType.skills.includes('robot') || batType.skills.includes('clone')) {
        vue = 1;
    }
    if (batType.skills.includes('light')) {
        if (!bat.tags.includes('camo')) {
            vue = 2;
        }
    }
    let allFlash = false;
    if (playerInfos.comp.log === 3 || playerInfos.comp.det >= 3) {
        if (batType.crew >=1 || batType.skills.includes('robot') || batType.skills.includes('clone')) {
            allFlash = true;
        }
    }
    if (batType.skills.includes('flash') || bat.eq === 'e-flash' || bat.logeq === 'e-flash' || bat.eq.includes('kit-') || allFlash || infra === 'Miradors' || infra === 'Murailles') {
        if (!bat.tags.includes('camo')) {
            if (hauteur < 2) {
                hauteur = 2;
            }
            vue = 3;
        }
    }
    if (batType.skills.includes('phare') || batType.skills.includes('bigflash') || bat.eq === 'e-phare' || bat.logeq === 'e-phare') {
        if (hauteur < 3) {
            hauteur = 3;
        }
        vue = 3;
    }
    if (vue > hauteur) {
        vue = hauteur;
    }
    return vue;
};

function checkUndark() {
    if (zone[0].dark) {
        let noBat = {};
        undarkCenter();
        let terrain;
        undarkNow = [];
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                undarkAround(bat,false);
            }
        });
    }
};

function undarkCenter() {
    let distance;
    zone.forEach(function(tile) {
        distance = calcDistance(1830,tile.id);
        if (distance <= startLander) {
            unDark(tile.id);
        }
        if (tile.infra != undefined) {
            if (tile.infra === 'Crystal') {
                unDark(tile.id);
            }
        }
    });
};

function undarkAround(bat,center) {
    let batTileId = bat.tileId;
    let batType = getBatType(bat);
    let terrain = {};
    let tile = {};
    let vue = 0;
    if (center) {
        batTileId = 1830;
        terrain = getTerrainById(1830);
    } else {
        vue = calcVue(bat,batType);
    }
    // console.log('UNDARK AROUND: '+vue);
    let thisTile = batTileId;
    unDark(thisTile);
    if (vue >= 1 || center) {
        thisTile = batTileId-1;
        unDark(thisTile);
        thisTile = batTileId+1;
        unDark(thisTile);
        thisTile = batTileId-1-mapSize;
        unDark(thisTile);
        thisTile = batTileId+1-mapSize;
        unDark(thisTile);
        thisTile = batTileId-mapSize;
        unDark(thisTile);
        thisTile = batTileId-1+mapSize;
        unDark(thisTile);
        thisTile = batTileId+1+mapSize;
        unDark(thisTile);
        thisTile = batTileId+mapSize;
        unDark(thisTile);
        if (vue >= 2 || center) {
            thisTile = batTileId-mapSize-mapSize-2;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-1;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize+1;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize+2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize-2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize-1;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+1;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+2;
            unDark(thisTile);
            thisTile = batTileId+2;
            unDark(thisTile);
            thisTile = batTileId-mapSize+2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+2;
            unDark(thisTile);
            thisTile = batTileId-2;
            unDark(thisTile);
            thisTile = batTileId-mapSize-2;
            unDark(thisTile);
            thisTile = batTileId+mapSize-2;
            unDark(thisTile);
        }
        if (vue >= 3 || center) {
            thisTile = batTileId-mapSize-mapSize-mapSize-3;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize-2;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize-1;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize+1;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize+2;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-mapSize+3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize-3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize-2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize-1;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize+1;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize+2;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+mapSize+3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize-3;
            unDark(thisTile);
            thisTile = batTileId+mapSize-3;
            unDark(thisTile);
            thisTile = batTileId-3;
            unDark(thisTile);
            thisTile = batTileId-mapSize-3;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize-3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+mapSize+3;
            unDark(thisTile);
            thisTile = batTileId+mapSize+3;
            unDark(thisTile);
            thisTile = batTileId+3;
            unDark(thisTile);
            thisTile = batTileId-mapSize+3;
            unDark(thisTile);
            thisTile = batTileId-mapSize-mapSize+3;
            unDark(thisTile);
        }
    }
};

function unDark(tileId) {
    if (tileId >= 0 && tileId < mapSize*mapSize) {
        if (!undarkNow.includes(tileId)) {
            undarkNow.push(tileId);
        }
        if (!zone[0].undarkOnce.includes(tileId) && !zone[0].undarkAll) {
            zone[0].undarkOnce.push(tileId);
        }
        if (zone[0].undarkOnce.length >= 3600 || zone[0].undarkAll) {
            zone[0].undarkOnce = [];
            zone[0].undarkAll = true;
        } else {
            zone[0].undarkAll = false;
        }
    }
};

function unDarkVision(bat,batType) {
    let lumDistance = 3;
    if (playerInfos.comp.energ >= 1) {
        lumDistance++;
    }
    let hasPhare = false;
    if (bat.eq === 'e-phare' || bat.logeq === 'e-phare') {
        if (batType.cat != 'infantry') {
            hasPhare = true;
        } else {
            let batTile = getTile(bat);
            if (batTile.terrain === 'M') {
                hasPhare = true;
            }
            if (batTile.infra != undefined) {
                if (batTile.infra === 'Miradors' || batTile.infra === 'Murailles') {
                    hasPhare = true;
                }
            }
        }
    }
    if (batType.skills.includes('phare') || hasPhare) {
        lumDistance++;
        if (playerInfos.comp.energ >= 2 && playerInfos.comp.det >= 2) {
            lumDistance++;
        }
        if (playerInfos.comp.energ >= 3 && playerInfos.comp.det >= 4) {
            lumDistance++;
        }
    }
    if (bat.tags.includes('camo')) {
        hasPhare = false;
        lumDistance = 0;
    }
    let radarDistance = 0;
    let hasRadar = false;
    if (batType.skills.includes('radar') || bat.eq === 'e-radar' || bat.logeq === 'e-radar') {
        hasRadar = true;
    }
    if (hasRadar) {
        radarDistance = radarDistance+3+playerInfos.comp.det;
        if (batType.skills.includes('fly')) {
            radarDistance = radarDistance+3;
        } else {
            let batTile = getTile(bat);
            let batTerrain = getTerrain(tile);
            radarDistance = radarDistance+batTerrain.scarp;
        }
    }
    zone.forEach(function(tile) {
        if (!undarkNow.includes(tile.id)) {
            let distance = calcDistance(bat.tileId,tile.id);
            if (distance <= lumDistance || distance <= radarDistance) {
                undarkNow.push(tile.id);
                if (!zone[0].undarkOnce.includes(tile.id) && !zone[0].undarkAll) {
                    zone[0].undarkOnce.push(tile.id);
                }
            }
        }
    });
};
