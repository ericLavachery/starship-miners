function planetEffects(bat,batType) {
    // Gehenna
    if (zone[0].planet === 'Gehenna') {
        if (batType.cat === 'infantry' && batType.name != 'Citoyens' && batType.name != 'Criminels') {
            if (playerInfos.comp.scaph < 1 || batType.squads > bat.squadsLeft || bat.damage >= 1) {
                let medDice = (playerInfos.comp.med*2)+6;
                if (playerInfos.comp.scaph < 1 || batType.squads > bat.squadsLeft) {
                    medDice = medDice-2;
                }
                let terrain = getTerrain(bat);
                if (bat.loc === "zone") {
                    medDice = medDice-(terrain.veg*3);
                } else if (bat.loc === "trans") {
                    let transBat = getBatById(bat.locId);
                    let transBatType = getBatType(transBat);
                    if (transBatType.cat === 'buildings' || transBatType.skills.includes('transorbital')) {
                        medDice = medDice-terrain.veg+6;
                    } else {
                        medDice = medDice-terrain.veg;
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

function stormDamage(bat,batType,storm,inMov) {
    let isDead = false;
    if (!storm) {
        if (playerInfos.comp.scaph < 3) {
            if (batType.cat === 'infantry') {
                let numUnits = Math.round(batType.squadSize*batType.squads*Math.sqrt(batType.size)/1.7);
                let stormDmg = rand.rand(2*numUnits,4*numUnits);
                stormDmg = Math.ceil(stormDmg/Math.sqrt(bat.armor+1));
                if (batType.skills.includes('resistfeu') || bat.tags.includes('resistfeu')) {
                    if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack') {
                        stormDmg = Math.ceil(stormDmg/1.25);
                    } else {
                        stormDmg = Math.ceil(stormDmg/1.5);
                    }
                } else {
                    if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack') {
                        stormDmg = Math.ceil(stormDmg*1.85);
                    }
                }
                console.log('stormDmg='+stormDmg);
                let totalDamage = bat.damage+stormDmg;
                let squadHP = batType.squadSize*batType.hp;
                let squadsOut = Math.floor(totalDamage/squadHP);
                bat.squadsLeft = bat.squadsLeft-squadsOut;
                bat.damage = totalDamage-(squadsOut*squadHP);
                if (bat.apLeft > Math.round(bat.ap/2)) {
                    bat.apLeft = Math.round(bat.ap/2);
                }
                if (bat.squadsLeft <= 0) {
                    batDeathEffect(bat,true,'Bataillon détruit',bat.type+' brûlé.');
                    isDead = true;
                    if (inMov) {
                        batDeath(bat,true);
                    } else {
                        checkDeath(bat,batType);
                    }
                }
            }
        }
    } else {
        let numUnits = Math.round(batType.squadSize*batType.squads*Math.sqrt(batType.size)/1.7);
        console.log('numUnits='+numUnits);
        let stormDmg = rand.rand(7*numUnits,20*numUnits);
        console.log('stormDmg='+stormDmg);
        stormDmg = Math.ceil(stormDmg/Math.sqrt(bat.armor+1));
        console.log('stormDmg(a)='+stormDmg);
        if (batType.skills.includes('resistfeu') || bat.tags.includes('resistfeu')) {
            if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack') {
                stormDmg = Math.ceil(stormDmg/1.25);
            } else {
                stormDmg = Math.ceil(stormDmg/1.5);
            }
        } else {
            if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack') {
                stormDmg = Math.ceil(stormDmg*1.85);
            }
        }
        if (playerInfos.comp.scaph >= 3 && batType.cat === 'infantry') {
            stormDmg = Math.ceil(stormDmg/1.5);
        }
        console.log('stormDmg(T)='+stormDmg);
        let totalDamage = bat.damage+stormDmg;
        let squadHP = batType.squadSize*batType.hp;
        let squadsOut = Math.floor(totalDamage/squadHP);
        bat.squadsLeft = bat.squadsLeft-squadsOut;
        bat.damage = totalDamage-(squadsOut*squadHP);
        if (bat.apLeft > Math.round(bat.ap/2)) {
            bat.apLeft = Math.round(bat.ap/2);
        }
        if (bat.squadsLeft <= 0) {
            batDeathEffect(bat,true,'Bataillon détruit',bat.type+' brûlé.');
            isDead = true;
            if (inMov) {
                batDeath(bat,true);
            } else {
                checkDeath(bat,batType);
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
                let dice = rand.rand(1,4);
                if (dice === 1) {
                    playerInfos.stList[i] = playerInfos.stList[i]+59;
                } else if (dice === 2) {
                    playerInfos.stList[i] = playerInfos.stList[i]-61;
                } else if (dice === 3) {
                    playerInfos.stList[i] = playerInfos.stList[i]-2;
                } else {
                    playerInfos.stList[i] = playerInfos.stList[i]-1;
                }
                if (playerInfos.stList[i] < 0) {
                    playerInfos.stList[i] = playerInfos.stList[i]+3600;
                }
                if (playerInfos.stList[i] > 3599) {
                    playerInfos.stList[i] = playerInfos.stList[i]-3600;
                }
            }
            for (var i = 0; i < playerInfos.sqList.length; i++){
                let dice = rand.rand(1,4);
                if (dice === 1) {
                    playerInfos.sqList[i] = playerInfos.sqList[i]+59;
                } else if (dice === 2) {
                    playerInfos.sqList[i] = playerInfos.sqList[i]-61;
                } else if (dice === 3) {
                    playerInfos.sqList[i] = playerInfos.sqList[i]-2;
                } else {
                    playerInfos.sqList[i] = playerInfos.sqList[i]-1;
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
    zone.forEach(function(tile) {
        if (!undarkNow.includes(tile.id)) {
            let distance = calcDistance(bat.tileId,tile.id);
            if (distance <= lumDistance) {
                undarkNow.push(tile.id);
                if (!zone[0].undarkOnce.includes(tile.id) && !zone[0].undarkAll) {
                    zone[0].undarkOnce.push(tile.id);
                }
            }
        }
    });
};
