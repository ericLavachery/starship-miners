function planetsDesc() {
    let thisPlanet = 'Dom';
    $('#conUnitList').append('<span class="ListRes cy">DOM</span><br>');
    $('#conUnitList').append('<span class="ListRes">Planète habitable.</span><br>');
    planetResDesc(thisPlanet);
    thisPlanet = 'Sarak';
    $('#conUnitList').append('<span class="ListRes cy">SARAK</span><br>');
    $('#conUnitList').append('<span class="ListRes">Planète habitable. Brouillard dense.</span><br>');
    planetResDesc(thisPlanet);
    thisPlanet = 'Gehenna';
    $('#conUnitList').append('<span class="ListRes cy">GEHENNA</span><br>');
    $('#conUnitList').append('<span class="ListRes">Planète inhabitable. Empoisonnée par les végétaux.</span><br>');
    planetResDesc(thisPlanet);
    thisPlanet = 'Kzin';
    $('#conUnitList').append('<span class="ListRes cy">KZIN</span><br>');
    $('#conUnitList').append('<span class="ListRes">Planète inhabitable. Gravité et pression intense. Sables mouvants.</span><br>');
    planetResDesc(thisPlanet);
    thisPlanet = 'Horst';
    $('#conUnitList').append('<span class="ListRes cy">HORST</span><br>');
    $('#conUnitList').append('<span class="ListRes">Planète inhabitable. Chaleur intense. Tempêtes.</span><br>');
    planetResDesc(thisPlanet);
};

function planetResDesc(thisPlanet) {
    $('#conUnitList').append('<span class="ListRes bleu">Ressources rares présentes:</span><br>');
    resTypes.forEach(function(res) {
        if (res.cat.includes('sky') || res.cat.includes('blue') || res.name === 'Morphite') {
            if (res.planets != undefined) {
                if (res.planets[thisPlanet] != 0) {
                    let resAb = Math.round(res.planets[thisPlanet]*100);
                    $('#conUnitList').append('<span class="ListRes gf">'+res.name+'<span class="brun">('+resAb+'%)</span> </span>');
                }
            }
        }
    });
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="ListRes bleu">Ressources absentes:</span><br>');
    resTypes.forEach(function(res) {
        if (res.cat === 'white' || res.cat.includes('sky') || res.cat.includes('blue') || res.cat.includes('zero') || res.name === 'Morphite') {
            if (res.planets != undefined) {
                if (res.planets[thisPlanet] === 0) {
                    $('#conUnitList').append('<span class="ListRes gf">'+res.name+' </span>');
                }
            }
        }
    });
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="ListRes bleu">Ressources plus abondantes:</span><br>');
    resTypes.forEach(function(res) {
        if (res.cat === 'white' || res.cat.includes('sky') || res.cat.includes('blue') || res.cat.includes('zero') || res.name === 'Morphite') {
            if (res.planets != undefined) {
                if (res.planets[thisPlanet] > 1 && res.planets[thisPlanet] != 0) {
                    let resAb = Math.round(res.planets[thisPlanet]*100);
                    $('#conUnitList').append('<span class="ListRes gf">'+res.name+'<span class="brun">('+resAb+'%)</span> </span>');
                }
            }
        }
    });
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="ListRes bleu">Ressources moins abondantes:</span><br>');
    resTypes.forEach(function(res) {
        if (res.cat === 'white' || res.cat.includes('sky') || res.cat.includes('blue') || res.cat.includes('zero') || res.name === 'Morphite') {
            if (res.planets != undefined) {
                if (res.planets[thisPlanet] < 1 && res.planets[thisPlanet] != 0) {
                    let resAb = Math.round(res.planets[thisPlanet]*100);
                    $('#conUnitList').append('<span class="ListRes gf">'+res.name+'<span class="brun">('+resAb+'%)</span> </span>');
                }
            }
        }
    });
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<br>');
}

function planetThumb() {
    if (zone[0].planet === undefined) {
        zone[0].planet = 'Station';
        zone[0].pid = 0;
    }
    if (modeSonde) {
        if (playerInfos.sondePlanet === 1) {
            $('#modesInfos').css('background-image','url(/static/img/dom-thumb.jpg)');
        } else if (playerInfos.sondePlanet === 2) {
            $('#modesInfos').css('background-image','url(/static/img/sarak-thumb.jpg)');
        } else if (playerInfos.sondePlanet === 3) {
            $('#modesInfos').css('background-image','url(/static/img/gehenna-thumb.jpg)');
        } else if (playerInfos.sondePlanet === 4) {
            $('#modesInfos').css('background-image','url(/static/img/kzin-thumb.jpg)');
        } else if (playerInfos.sondePlanet === 5) {
            $('#modesInfos').css('background-image','url(/static/img/horst-thumb.jpg)');
        }
    } else {
        if (playerInfos.onStart) {
            $('#modesInfos').css('background-image','url(/static/img/dom-thumb.jpg)');
        } else if (zone[0].planet === 'Dom') {
            $('#modesInfos').css('background-image','url(/static/img/dom-thumb.jpg)');
        } else if (zone[0].planet === 'Sarak') {
            $('#modesInfos').css('background-image','url(/static/img/sarak-thumb.jpg)');
        } else if (zone[0].planet === 'Gehenna') {
            $('#modesInfos').css('background-image','url(/static/img/gehenna-thumb.jpg)');
        } else if (zone[0].planet === 'Kzin') {
            $('#modesInfos').css('background-image','url(/static/img/kzin-thumb.jpg)');
        } else if (zone[0].planet === 'Horst') {
            $('#modesInfos').css('background-image','url(/static/img/horst-thumb.jpg)');
        } else if (zone[0].planet === 'Station') {
            $('#modesInfos').css('background-image','url(/static/img/station-thumb.jpg)');
        }
    }
};

function planetEffects(bat,batType) {
    // Gehenna
    if (zone[0].planet === 'Gehenna') {
        if (batType.cat === 'infantry' && batType.name != 'Citoyens' && batType.name != 'Criminels' && !bat.tags.includes('octiron')) {
            if (playerInfos.comp.scaph < 1 || batType.squads > bat.squadsLeft || bat.damage >= 1 || batType.skills.includes('dog')) {
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
            stormDamage(bat,batType,true,false,false);
        } else if (playerInfos.sqList.includes(bat.tileId)) {
            stormDamage(bat,batType,false,false,false);
        }
    }
};

function checkMayOut(batType,isBat,bat) {
    let mayOut = true;
    if (zone[0].planet === 'Kzin') {
        if (playerInfos.comp.scaph < 2 || batType.skills.includes('dog')) {
            mayOut = false;
            if (batType.name === 'Pets' || batType.name === 'Klogs') {
                mayOut = true;
            }
            if (batType.cat === 'buildings') {
                mayOut = true;
            }
            if (batType.cat === 'devices' && batType.crew === 0) {
                mayOut = true;
            }
            if (batType.cat === 'vehicles') {
                if (batType.skills.includes('kzin') || batType.skills.includes('transorbital') || batType.skills.includes('robot')) {
                    mayOut = true;
                }
            }
            if (batType.cat === 'infantry') {
                if (batType.skills.includes('kzin') || batType.skills.includes('mutant')) {
                    mayOut = true;
                }
            }
        }
        if (batType.skills.includes('fly')) {
            if (batType.cat != 'infantry') {
                if (!isBat) {
                    mayOut = false;
                } else if (noEquip(bat,['e-stab','g2motor']) && !batType.skills.includes('stab')) {
                    mayOut = false;
                }
            }
        }
    }
    if (isBat) {
        if (bat.tags.includes('genwater') && playerInfos.comp.scaph < 1) {
            if (isRaining(zone)) {
                mayOut = false;
            }
        }
    }
    return mayOut;
};

function checkMayOutInSoute(bat,batType) {
    let mayOut = true;
    if (playerInfos.missionPlanet === 4) {
        if (playerInfos.comp.scaph < 2 || batType.skills.includes('dog')) {
            mayOut = false;
            if (batType.name === 'Pets' || batType.name === 'Klogs') {
                mayOut = true;
            }
            if (batType.cat === 'buildings') {
                mayOut = true;
            }
            if (batType.cat === 'devices' && batType.crew === 0) {
                mayOut = true;
            }
            if (batType.cat === 'vehicles') {
                if (batType.skills.includes('kzin') || batType.skills.includes('transorbital') || batType.skills.includes('robot')) {
                    mayOut = true;
                }
            }
            if (batType.cat === 'infantry') {
                if (batType.skills.includes('kzin') || batType.skills.includes('mutant')) {
                    mayOut = true;
                }
            }
        }
        if (batType.skills.includes('fly')) {
            if (batType.cat != 'infantry') {
                if (noEquip(bat,['e-stab','g2motor']) && !batType.skills.includes('stab')) {
                    mayOut = false;
                }
            }
        }
    }
    return mayOut;
};

function checkMissions() {
    // à l'atterrissage sur une zone!
    let doom = getDoom(false);
    let nextMission = getNextMission(doom);
    if (nextMission.num >= 50) {
        // placer les fichiers de la zone !!!!!!!!!!
        moveMissionZone(nextMission.num);
        let mType = getMissionType(nextMission.num,true);
        playerInfos.alerte.title = 'Nouvelle mission';
        playerInfos.alerte.body = mType.name+': '+mType.title;
    }
};

function checkMissionAlert() {
    if (playerInfos.alerte.title != undefined) {
        if (playerInfos.onShip) {
            doMissionAlert();
        } else {
            if (playerInfos.mapTurn >= 19) {
                doMissionAlert();
            }
        }
    }
};

function doMissionAlert() {
    warning('<span class="rq3">'+playerInfos.alerte.title+'</span>','<span class="vio">'+playerInfos.alerte.body+'</span>',false);
    playerInfos.alerte = {};
};

function getNextMission(doom) {
    let nextMission = {};
    nextMission.num = -1;
    nextMission.nid = 'none';
    nextMission.pa = 99;
    let found = false;
    if (doom >= 4.4) {
        if (playerInfos.objectifs.resistance === 'none') {
            nextMission.num = getNextMissionNum(60,64);
            if (nextMission.num >= 50) {
                found = true;
                nextMission.nid = 'resist';
                nextMission.pa = 4.5; // 11
                playerInfos.objectifs.resistance = 'actif';
            }
        }
    }
    if (!found) {
        if (doom >= 5) {
            if (playerInfos.objectifs.trolley === 'none') {
                nextMission.num = getNextMissionNum(50,54);
                if (nextMission.num >= 50) {
                    found = true;
                    nextMission.nid = 'trolley';
                    nextMission.pa = 5; // 12
                    playerInfos.objectifs.trolley = 'actif';
                }
            }
        }
    }
    if (!found) {
        if (doom >= 5.8) {
            if (playerInfos.objectifs.swarm === 'none') {
                nextMission.num = getNextMissionNum(65,69);
                if (nextMission.num >= 50) {
                    found = true;
                    nextMission.nid = 'necro';
                    nextMission.pa = 6; // 14
                    playerInfos.objectifs.swarm = 'actif';
                }
            }
        }
    }
    if (!found) {
        if (doom >= 6.4) {
            if (playerInfos.objectifs.science === 'none') {
                nextMission.num = getNextMissionNum(55,59);
                if (nextMission.num >= 50) {
                    found = true;
                    nextMission.nid = 'science';
                    nextMission.pa = 6.5; // 15
                    playerInfos.objectifs.science = 'actif';
                }
            }
        }
    }
    if (!found) {
        if (doom >= 7) {
            if (playerInfos.objectifs.spider === 'none') {
                nextMission.num = getNextMissionNum(80,84);
                if (nextMission.num >= 50) {
                    found = true;
                    nextMission.nid = 'spider';
                    nextMission.pa = 7; // 16
                    playerInfos.objectifs.spider = 'actif';
                }
            }
        }
    }
    if (!found) {
        if (doom >= 7.6) {
            if (playerInfos.objectifs.larve === 'none') {
                nextMission.num = getNextMissionNum(70,74);
                if (nextMission.num >= 50) {
                    found = true;
                    nextMission.nid = 'sky';
                    nextMission.pa = 7.5; // 17
                    playerInfos.objectifs.larve = 'actif';
                }
            }
        }
    }
    if (!found) {
        if (doom >= 8.2) {
            if (playerInfos.objectifs.bug === 'none') {
                nextMission.num = getNextMissionNum(75,79);
                if (nextMission.num >= 50) {
                    found = true;
                    nextMission.nid = 'dragon';
                    nextMission.pa = 8; // 18
                    playerInfos.objectifs.bug = 'actif';
                }
            }
        }
    }
    return nextMission;
};

function getNextMissionNum(minNum,maxNum) {
    let misNum = -1;
    let availableMissions = _.shuffle(playerInfos.misDB);
    availableMissions.forEach(function(thatMission) {
        if (misNum < 0) {
            if (thatMission >= minNum && thatMission <= maxNum) {
                misNum = thatMission;
            }
        }
    });
    return misNum;
};

function checkCanon() {
    // à l'atterrissage sur une zone!
    // OLD VERSION
    let doom = getDoom(true);
    let isTest = false;
    if (playerInfos.pseudo == 'Payall' || playerInfos.pseudo == 'Test' || playerInfos.pseudo == 'Woktest') {
        isTest = true;
    }
    // CANON WEB (Objectif Spider);
    let doomStart = 5;
    // à enlever quand il y aura la map spéciale
    // enlever le canon
    if (playerInfos.objectifs.spider === 'actif' && !isTest) {
        if (doom >= doomStart) {
            let chance = 30+((doom-doomStart)*15);
            if (rand.rand(1,100) <= chance) {
                playerInfos.objectifs.spider = 'detruit';
            }
        }
    }
    // à garder
    // mettre le canon
    if (playerInfos.objectifs.spider === 'none' && !isTest) {
        if (doom >= doomStart) {
            let chance = 40+((doom-doomStart)*40);
            if (rand.rand(1,100) <= chance) {
                playerInfos.objectifs.spider = 'actif';
            }
        }
    }
    // CANON METEOR (Objectif Bug);
    doomStart = 7;
    // à enlever quand il y aura la map spéciale
    // enlever le canon
    if (playerInfos.objectifs.bug === 'actif' && !isTest) {
        if (doom >= doomStart) {
            let chance = 30+((doom-doomStart)*15);
            if (rand.rand(1,100) <= chance) {
                playerInfos.objectifs.bug = 'detruit';
            }
        }
    }
    // à garder
    // mettre le canon
    if (playerInfos.objectifs.spider === 'detruit') { // enlever cette ligne!
        if (playerInfos.objectifs.bug === 'none' && !isTest) {
            if (doom >= doomStart) {
                let chance = 40+((doom-doomStart)*40);
                if (rand.rand(1,100) <= chance) {
                    playerInfos.objectifs.bug = 'actif';
                }
            }
        }
    }
};

function alienCanon() {
    // CANON WEB
    let cprov = 'canon';
    let cblob = 0;
    if (hasAlien('Uberspinne')) {
        cprov = 'uber';
    }
    if (hasAlien('Spiderblob')) {
        cprov = 'uber';
        cblob = 1;
    }
    if ((playerInfos.objectifs.spider === 'actif' && !domeProtect) || cprov === 'uber') {
        let freq = 7-Math.ceil(zone[0].mapDiff/2)-cblob;
        if (freq < 2) {freq = 2;}
        if (playerInfos.mapTurn % freq === 0 && playerInfos.mapTurn >= 2) {
            let canonTiles = getWebCanonTiles(cprov,cblob);
            webCanon(canonTiles);
            showMap(zone,true);
        }
    }
    // CANON METEOR
    if (playerInfos.objectifs.bug === 'actif' && !domeProtect) {
        let chance = playerInfos.mapTurn+landingNoise;
        if (chance > 33) {chance = 33;}
        // chance = 100;
        if (playerInfos.mapTurn >= 2) {
            if (rand.rand(1,100) <= chance) {
                // canon! Autour du lander (le plus gros) / Tire 4 à 5 météors
                meteorCanon();
                showMap(zone,true);
            }
        }
    }
    // CANON NECRO
    if (playerInfos.objectifs.swarm === 'actif' && !domeProtect) {
        let canonTiles = getNecroCanonTiles();
        necroCanon(canonTiles,false);
        if (hasAlien('Necroblob')) {
            canonTiles = getNecroCanonTiles();
            necroCanon(canonTiles,true);
        }
        showMap(zone,true);
    }
    // CANON ECTO
    if (playerInfos.objectifs.larve === 'actif' && !domeProtect) {
        let freq = 4;
        if (hasAlien('Skygrub')) {
            freq = 3;
        }
        if (playerInfos.mapTurn % freq === 0 && playerInfos.mapTurn >= 1) {
            let canonTiles = getEctoCanonTiles();
            ectoCanon(canonTiles);
            showMap(zone,true);
        }
    }
};

function ectoCanon(canonTiles) {
    playSound('web-fall',0);
    warning('Canon alien','',false,canonTiles[0],false);
};

function getEctoCanonTiles() {
    let canonTiles = [];
    alienOccupiedTileList();
    let targetTile = -1;
    if (targetTile < 0) {
        targetTile = rand.rand(0,3599);
    }
    canonTiles.push(targetTile);
    zone.forEach(function(tile) {
        if (tile.id != targetTile) {
            let distance = calcDistance(tile.id,targetTile);
            if (distance <= 5) {
                let chance = 35-(distance*distance)-distance;
                if (rand.rand(1,200) <= chance) {
                    canonTiles.push(tile.id);
                    tile.ecto = true;
                }
            }
        }
    });
    return canonTiles;
};

function necroCanon(canonTiles,silent) {
    if (!silent) {
        playSound('web-fall',0);
    }
    warning('Canon alien','',false,canonTiles[0],false);
    aliens.forEach(function(bat) {
        if (canonTiles.includes(bat.tileId)) {
            if (!bat.tags.includes('moss')) {
                bat.tags.push('moss');
            }
        }
    });
};

function getNecroCanonTiles() {
    let canonTiles = [];
    alienOccupiedTileList();
    let theTile = -1;
    let targetTile = -1;
    let testTile = -1;
    let mostALiens = 0;
    if (aliens.length >= 1) {
        let shufAliens = _.shuffle(aliens);
        shufAliens.forEach(function(bat) {
            if (targetTile < 0) {
                if (!bat.tags.includes('moss')) {
                    let batType = getBatType(bat);
                    if (batType.kind != 'game' && batType.cat === 'aliens') {
                        let closeAliens = howManyCloseAliens(bat.tileId,3);
                        if (closeAliens > mostALiens) {
                            if (closeAliens < 4) {
                                testTile = bat.tileId;
                            } else {
                                targetTile = bat.tileId;
                            }
                            mostALiens = closeAliens;
                        }
                    }
                }
            }
        });
        if (targetTile < 0) {
            targetTile = testTile;
        }
    }
    if (targetTile < 0) {
        targetTile = rand.rand(0,3599);
    }
    canonTiles.push(targetTile);
    zone.forEach(function(tile) {
        if (tile.id != targetTile) {
            let distance = calcDistance(tile.id,targetTile);
            if (distance <= 3) {
                let chance = 15-(distance*distance)-distance;
                if (rand.rand(1,16) <= chance) {
                    canonTiles.push(tile.id);
                    tile.moist = true;
                }
            }
        }
    });
    return canonTiles;
};

function howManyCloseAliens(tileId,dist) {
    if (alienOccupiedTiles.length < aliens.length) {
        alienOccupiedTileList();
        console.log('done');
    }
    let howMany = 0;
    let theTile = getTileById(tileId);
    let minX = theTile.x-dist;
    let maxX = theTile.x+dist;
    let minY = theTile.y-dist;
    let maxY = theTile.y+dist;
    let visMap = _.filter(zone, function(tile) {
        return (tile.x >= minX && tile.x <= maxX && tile.y >= minY && tile.y <= maxY);
    });
    visMap.forEach(function(tile) {
        if (alienOccupiedTiles.includes(tile.id)) {
            howMany++;
        }
    });
    console.log('HOW MANY ??????????????????????????????????????????????????????? = '+howMany);
    return howMany;
};

function meteorCanon() {
    playSound('meteor',0.4);
    let canonTiles = [];
    let targetTile = -1;
    let bestTarget = 0;
    alienOccupiedTileList();
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (!pilonedTiles.includes(bat.tileId)) {
                if (bat.fuzz >= -1) {
                    let batType = getBatType(bat);
                    let targetValue = bat.fuzz;
                    if (batType.skills.includes('transorbital') && targetValue < 5 && targetValue >= 1) {
                        targetValue = 5;
                    }
                    if (targetValue >= 1) {
                        targetValue = targetValue+rand.rand(0,2);
                    }
                    if (targetValue > bestTarget) {
                        targetTile = bat.tileId;
                        bestTarget = targetValue;
                    }
                }
            }
        }
    });
    if (targetTile < 0) {
        targetTile = rand.rand(0,3599);
    }
    let shufZone = _.shuffle(zone);
    shufZone.forEach(function(tile) {
        if (canonTiles.length < 4) {
            if (!tile.crat) {
                if (!alienOccupiedTiles.includes(tile.id)) {
                    let distance = calcDistance(tile.id,targetTile);
                    if (distance <= 3) {
                        let chance = 20-(distance*distance)-distance;
                        if (rand.rand(1,100) <= chance) {
                            canonTiles.push(tile.id);
                            meteorImpact(tile);
                        }
                    }
                }
            }
        }
    });
    warning('Canon alien','',false,canonTiles[0],false);
    killBatList();
};

function meteorImpact(tile) {
    if (tile.ruins) {
        delete tile.ruins;
        delete tile.sh;
        delete tile.rt;
    }
    if (tile.infra != undefined) {
        if (tile.infra === 'Débris') {
            delete tile.infra;
        }
        let wipeChance = 100-(playerInfos.comp.const*playerInfos.comp.const*3)-(playerInfos.comp.def*playerInfos.comp.def*6);
        // if (tile.infra === 'Miradors') {
        //     wipeChance = wipeChance;
        // }
        if (tile.infra === 'Palissades') {
            wipeChance = wipeChance+10;
        }
        if (tile.infra === 'Remparts') {
            wipeChance = wipeChance-25;
        }
        if (tile.infra === 'Murailles') {
            wipeChance = wipeChance-40;
        }
        // if (tile.infra === 'Terriers') {
        //     wipeChance = wipeChance;
        // }
        if (rand.rand(1,100) <= wipeChance) {
            delete tile.infra;
        }
    }
    tile.crat = true;
    let bat = getZoneBatByTileId(tile.id);
    if (Object.keys(bat).length >= 1) {
        let batType = getBatType(bat);
        stormDamage(bat,batType,true,false,true);
        if (batType.cat === 'buildings' || batType.skills.includes('transorbital')) {
            delete tile.crat;
        }
    }
};

function stormThis(batId) {
    playSound('meteor',0.4);
    let bat = getBatById(batId);
    let tile = getTile(bat);
    meteorImpact(tile);
    killBatList();
    showMap(zone,true);
};

function blobStormThis() {
    playSound('meteor-blob',0.4);
    let tile = getTile(targetBat);
    blobMeteorImpact(tile);
    // killBatList();
    showMap(zone,true);
};

function blobMeteorImpact(tile) {
    if (tile.ruins) {
        delete tile.ruins;
        delete tile.sh;
        delete tile.rt;
    }
    if (tile.infra != undefined) {
        if (tile.infra === 'Débris') {
            delete tile.infra;
        }
        let wipeChance = 100-(playerInfos.comp.const*playerInfos.comp.const*3)-(playerInfos.comp.def*playerInfos.comp.def*6);
        // if (tile.infra === 'Miradors') {
        //     wipeChance = wipeChance;
        // }
        if (tile.infra === 'Palissades') {
            wipeChance = wipeChance+10;
        }
        if (tile.infra === 'Remparts') {
            wipeChance = wipeChance-25;
        }
        if (tile.infra === 'Murailles') {
            wipeChance = wipeChance-40;
        }
        // if (tile.infra === 'Terriers') {
        //     wipeChance = wipeChance;
        // }
        if (rand.rand(1,100) <= wipeChance) {
            delete tile.infra;
        }
    }
    tile.crat = true;
    stormDamage(targetBat,targetBatType,true,false,true);
    if (targetBatType.cat === 'buildings' || targetBatType.skills.includes('transorbital')) {
        delete tile.crat;
    }
};

function webCanon(canonTiles) {
    playSound('web-fall',0);
    warning('Canon alien','',false,canonTiles[0],false);
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

function trueWeb() {
    if (!targetBat.tags.includes('mud')) {
        targetBat.tags.push('mud');
    }
    if (!targetBat.tags.includes('web')) {
        targetBat.tags.push('web');
    }
    if (targetBatType.cat === 'infantry') {
        targetBat.tags.push('poison');
        targetBat.tags.push('poison');
    }
    let tile = getTile(targetBat);
    tile.web = true;
};

function getWebCanonTiles(cprov,cblob) {
    let canonTiles = [];
    let theTile = -1;
    let targetTile = -1;
    // près d'un oeuf en danger / sur un bâtiment / sur le canon
    let bestTarget = 0;
    let bldTarget = false;
    if (cprov === 'uber') {
        if (cblob === 1 && rand.rand(1,3) === 1) {
            bldTarget = true;
        }
    } else {
        if (aliens.length > playerInfos.mapTurn*2) {
            bldTarget = true;
        }
    }
    if (!bldTarget) {
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
                        if (!batType.skills.includes('webca')) {
                            thisTarget = thisTarget*batType.hp;
                        } else {
                            let tile = getTile(bat);
                            if (tile.web) {
                                thisTarget = thisTarget*1000;
                            } else {
                                thisTarget = thisTarget*100000;
                            }
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
                    if (bat.fuzz >= 1 && batType.crew >= 1) {
                        if (batType.cat === 'buildings' || batType.cat === 'devices') {
                            if (rand.rand(1,3) === 1 || batType.cat === 'buildings') {
                                targetTile = bat.tileId;
                            }
                        }
                    }
                }
            }
        });
    }
    if (targetTile < 0) {
        targetTile = rand.rand(0,3599);
    }
    let shufZone = _.shuffle(zone);
    if (cprov === 'uber') {
        theTile = targetTile;
    } else {
        shufZone.forEach(function(tile) {
            if (theTile < 0) {
                let distance = calcDistance(tile.id,targetTile);
                if (distance <= 4) {
                    theTile = tile.id;
                }
            }
        });
    }
    canonTiles.push(theTile);
    shufZone.forEach(function(tile) {
        if (tile.id != theTile) {
            let distance = calcDistance(tile.id,theTile);
            if (distance <= 2) {
                let chance = 10+(cblob*4)-(distance*distance)-distance;
                if (rand.rand(1,10) <= chance) {
                    canonTiles.push(tile.id);
                    tile.web = true;
                }
            }
        }
    });
    return canonTiles;
};

function ectoControl() {
    deadAliensList = [];
    aliens.forEach(function(myBat) {
        let control = false;
        let myBatType = getBatType(myBat);
        if (myBatType.skills.includes('roboposs')) {
            let shufBats = _.shuffle(bataillons);
            shufBats.forEach(function(bat) {
                if (!control) {
                    if (bat.loc === "zone") {
                        let batType = getBatType(bat);
                        if (batType.skills.includes('robot')) {
                            let distance = calcDistance(myBat.tileId,bat.tileId);
                            if (distance === 0) {
                                turnThisBot(bat.id);
                                control = true;
                                deadAliensList.push(myBat.id);
                                // console.log('TOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOKIT');
                            }
                        }
                    }
                }
            });
        }
    });
    killAlienList();
};

function turnThisBot(batId) {
    let bot = getBatById(batId);
    let alienType = getAlienTypeByName(bot.type);
    if (Object.keys(alienType).length >= 1) {
        let botSquadsLeft = bot.squadsLeft;
        let botDamage = bot.damage;
        let botTileId = bot.tileId;
        let botAPLeft = bot.apLeft;
        let botGear = [];
        botGear.push(bot.ammo);
        botGear.push(bot.ammo2);
        botGear.push('xxx');
        botGear.push('xxx');
        removeBat(batId);
        conselUnit = alienType;
        conselPut = false;
        conselTriche = true;
        conselAmmos = botGear;
        putBat(botTileId,0,0,'',false);
        let newAlienBot = getBatByTileId(botTileId);
        newAlienBot.apLeft = botAPLeft;
        let maxAPLeft = 0-Math.round(newAlienBot.ap/2);
        if (newAlienBot.apLeft > maxAPLeft) {
            newAlienBot.apLeft = maxAPLeft;
        }
        newAlienBot.squadsLeft = botSquadsLeft;
        newAlienBot.damage = botDamage;
        showMap(zone,false);
        warning('<span class="rq3">Possession</span>','<span class="vio">Des Ectoplames ont pris contrôle de vos '+alienType.name+'!</span>',false,newAlienBot.tileId);
    }
};

function morphBatList() {
    // console.log('LETS MORPH BABY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(morphedBats);
    morphedBats.forEach(function(morph) {
        morphThis(morph.tile,morph.alien);
    });
    morphedBats = [];
};

function morphThis(tileId,alienBatName) {
    // Transforme un bataillon en alien
    // console.log('tileId='+tileId);
    // console.log(alienBatName);
    let dropTile = -1;
    let unitIndex = alienUnits.findIndex((obj => obj.name == alienBatName));
    conselUnit = alienUnits[unitIndex];
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    if (Object.keys(conselUnit).length >= 1) {
        // console.log(conselUnit);
        dropTile = checkDropInPlace(tileId);
        // console.log('dropTile='+dropTile);
        if (dropTile >= 0) {
            putBat(dropTile,0,0);
            // if (alienBatName === 'Vomissure') {
            //     putBat(dropTile,0,0,'bmorph');
            // } else {
            //     putBat(dropTile,0,0);
            // }
        } else {
            conselReset(true);
        }
    }
};

function stormProtection(dmg,bat,batType,canon) {
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
    if (terrain.flood > 0 && !canon) {
        terProtect = terProtect+(terrain.flood*5);
    }
    if (canon) {
        if (terrain.veg >= 3 || terrain.scarp >= 3) {
            terProtect = terProtect+10;
        }
    }
    if (terProtect > infraProtect) {
        stormProtect = stormProtect+terProtect+(infraProtect/3);
    } else {
        stormProtect = stormProtect+infraProtect+(terProtect/3);
    }
    if (bat.tags.includes('fortif')) {
        stormProtect = stormProtect*1.2;
    }
    if (batType.skills.includes('resistfeu') || bat.tags.includes('resistfeu')) {
        if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack' || canon) {
            adjDmg = adjDmg*0.75;
        } else {
            adjDmg = adjDmg*0.6;
        }
    } else if (!canon) {
        if (batType.skills.includes('inflammable') || bat.tags.includes('inflammable') || bat.eq === 'e-jetpack') {
            adjDmg = adjDmg*1.5;
        }
    }
    if (batType.skills.includes('protectall') || bat.tags.includes('protectall')) {
        adjDmg = adjDmg*0.5;
    } else if (batType.skills.includes('resistall') || bat.tags.includes('resistall')) {
        adjDmg = adjDmg*0.67;
    }
    adjDmg = Math.ceil(adjDmg*(100-stormProtect)/100);
    return adjDmg;
};

function stormDamage(bat,batType,storm,inMov,canon) {
    let isDead = false;
    let deathCause = 'Tempête';
    let deathType = ' brûlés.';
    if (canon) {
        deathCause = 'Canon alien';
        deathType = ' anéantis.';
    }
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
                    stormDmg = stormProtection(stormDmg,bat,batType,canon);
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
                    batDeathEffect(bat,true,false,deathCause,bat.type+deathType);
                    isDead = true;
                    if (inMov) {
                        batDeath(bat,true,false,false);
                    } else {
                        checkDeath(bat,batType,false);
                    }
                } else if (stormDmg >= 1) {
                    if (batType.cat === 'infantry') {
                        warning(deathCause,bat.type+' blessés.',false,bat.tileId);
                    } else if (batType.cat === 'buildings') {
                        warning(deathCause,bat.type+' endommagé.',false,bat.tileId);
                    } else {
                        warning(deathCause,bat.type+' endommagés.',false,bat.tileId);
                    }
                }
            }
        }
    } else {
        // TEMPETE
        let numUnits = Math.round(batType.squadSize*batType.squads*Math.sqrt(batType.size)/1.7);
        console.log('numUnits='+numUnits);
        let stormDmg = rand.rand(7*numUnits,20*numUnits);
        if (playerInfos.pseudo === 'Payall' && canon) {
            stormDmg = 13.5*numUnits;
        }
        if (canon) {
            stormDmg = stormDmg*Math.sqrt(batType.hp);
            if (batType.moveCost < 90) {
                let baseMoveCost = calcBaseMoveCost(bat,batType);
                let mvmt = bat.ap/baseMoveCost;
                stormDmg = stormDmg/mvmt*4;
            }
        }
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
        if (batArmour >= 14 && playerInfos.comp.scaph >= 3 && !canon) {
            stormDmg = 0;
        }
        if (batType.skills.includes('resiststorm') && !canon) {
            stormDmg = 0;
        }
        console.log('stormDmg(a)='+stormDmg);
        if (playerInfos.comp.scaph >= 3 && batType.cat === 'infantry' && !canon) {
            stormDmg = stormDmg/1.5;
        }
        if (batType.cat === 'infantry' && canon) {
            stormDmg = stormDmg/3;
        }
        if (stormDmg > 0) {
            stormDmg = stormProtection(stormDmg,bat,batType,canon);
        }
        console.log('stormDmg(T)='+stormDmg);
        let totalDamage = bat.damage+stormDmg;
        let squadHP = batType.squadSize*batType.hp;
        let squadsOut = Math.floor(totalDamage/squadHP);
        bat.squadsLeft = bat.squadsLeft-squadsOut;
        bat.damage = totalDamage-(squadsOut*squadHP);
        if (!canon) {
            bat.apLeft = bat.apLeft-6;
            if (bat.apLeft > Math.round(bat.ap/4)) {
                bat.apLeft = Math.round(bat.ap/4);
            }
        }
        if (bat.squadsLeft <= 0) {
            batDeathEffect(bat,true,false,deathCause,bat.type+deathType+' (dégâts: '+stormDmg+')');
            isDead = true;
            if (inMov) {
                batDeath(bat,true,false,false);
            } else {
                checkDeath(bat,batType,false);
            }
        } else if (stormDmg >= 1) {
            if (batType.cat === 'infantry') {
                warning(deathCause,bat.type+' blessés. (dégâts: '+stormDmg+')',false,bat.tileId);
            } else if (batType.cat === 'buildings') {
                warning(deathCause,bat.type+' endommagé. (dégâts: '+stormDmg+')',false,bat.tileId);
            } else {
                warning(deathCause,bat.type+' endommagés. (dégâts: '+stormDmg+')',false,bat.tileId);
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
        if (zone[0].undarkOnce.length >= 3550 || zone[0].undarkAll) {
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
    if (batType.skills.includes('flash') || hasEquip(bat,['e-flash']) || bat.eq.includes('kit-') || infra === 'Miradors' || infra === 'Murailles') {
        if (!bat.tags.includes('camo')) {
            if (hauteur < 2) {
                hauteur = 2;
            }
            vue = 3;
        }
    }
    if (batType.skills.includes('phare') || batType.skills.includes('bigflash') || hasEquip(bat,['e-phare'])) {
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
        aliens.forEach(function(bat) {
            if (bat.loc === "zone") {
                if (bat.tags.includes('fluo')) {
                    undarkAlien(bat);
                } else if (!bat.tags.includes('invisible')) {
                    let batType = getBatType(bat);
                    if (batType.skills.includes('light')) {
                        undarkAlien(bat);
                    }
                }
            }
        });
        zone.forEach(function(tile) {
            if (tile.fluo != undefined) {
                if (tile.fluo >= playerInfos.mapTurn) {
                    undarkTomb(tile.id);
                } else {
                    delete tile.fluo;
                }
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

function undarkAlien(bat) {
    let power = 1;
    if (bat.tags.includes('fluo')) {
        if (playerInfos.comp.energ === 3 || playerInfos.comp.det >= 4) {
            power = 2;
        }
    }
    let batTileId = bat.tileId;
    let thisTile = batTileId;
    unDark(thisTile);
    if (power >= 1) {
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
        if (power >= 2) {
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
    }
};

function undarkTomb(batTileId) {
    let power = 1;
    if (playerInfos.comp.energ === 3 || playerInfos.comp.det >= 4) {
        power = 2;
    }
    let thisTile = batTileId;
    unDark(thisTile);
    if (power >= 1) {
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
        if (power >= 2) {
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
        if (zone[0].undarkOnce.length >= 3550 || zone[0].undarkAll) {
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
    if (hasEquip(bat,['e-phare'])) {
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
    if (batType.skills.includes('radar') || hasEquip(bat,['e-radar'])) {
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

function missionStartAdj(misNum) {
    let mType = getMissionType(misNum,true);
    if (mType.name.includes('Boss')) {
        let bossName = 'Blob';
        if (mType.name === 'Spiderblob') {
            bossName = 'Spiderblob';
        }
        if (mType.name === 'Skygrub') {
            bossName = 'Skygrub';
        }
        if (mType.name === 'Necroblob') {
            bossName = 'Necroblob';
        }
        if (mType.name === 'Dragonblob') {
            bossName = 'Dragonblob';
        }
        let bossBat = getAlienByName(bossName);
        let nearNav = -1;
        let farNav = -1;
        zone.forEach(function(tile) {
            if (tile.nav) {
                let distance = calcDistance(bossBat.tileId,tile.id);
                if (distance <= 40) {
                    nearNav = tile.id;
                } else if (distance >= 50) {
                    farNav = tile.id;
                }
            }
        });
        if (nearNav >= 0 && farNav >= 0) {
            let nearNavBat = getZoneBatByTileId(nearNav);
            let nearNavBatType = getBatType(nearNavBat);
            if (nearNavBatType.skills.includes('transorbital')) {
                zone[0].meip = zone[0].meip+2;
            }
        }
    }
};
