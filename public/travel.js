function startMission() {
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    saveGame();
    playerInfos.undarkOnce = [];
    batUnselect();
    // créer db batsInSpace, avec les landers marqués deploy=true et toutes les unités qui sont dedans
    createBatsInSpace();
    // virer ces landers et ces unités de la bd bataillons
    removeDeployedBats();
    // sauvegarder la zone STATION
    saveCurrentZoneAs(0);
    // charger la zone playerInfos.missionZone
    loadZone(playerInfos.missionZone);
    // var modeLanding = true
    playerInfos.onShip = false;
    inSoute = false;
    modeLanding = true;
    // en mode landing: fenêtre avec les landers qui sont dans batsInSpace
    // choisir un lander et le placer sur la carte (en fonction des restriction .comp.vsp)
    // une fois placé, mettre le lander et toutes les unités qui sont dedans dans la db bataillons (sur le tileId choisi)
    // idem avec tous les landers
    // quand plus rien dans batsInSpace: modeLanding = false
    landingList();
    // la mission commence
};

function stopMission() {
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    saveGame();
    batUnselect();
    // créer db batsInSpace, avec les landers et toutes les unités qui sont dedans
    createBatsInSpace();
    // virer ces landers et ces unités de la bd bataillons
    removeDeployedBats();
    // sauvegarder la zone pour un retour
    saveMapForReturn();
    // charger la zone STATION
    loadZone(0);
    playerInfos.onShip = true;
    playerInfos.missionZone = -1;
    inSoute = false;
    modeLanding = true;
    landingList();
};

function landingList() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","110px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<h1 class="or" id="gentils">Atterrissage</h1><br><br>');
    slId = -1;
    batsInSpace.forEach(function(bat) {
        if (slId < 0) {
            if (bat.loc === 'zone') {
                let batType = getBatType(bat);
                if (batType.skills.includes('transorbital') && bat.type != 'Soute') {
                    slId = bat.id;
                }
            }
        }
    });
    if (slId >= 0) {
        let landerBat = getSpaceBatById(slId);
        let landerBatType = getBatType(landerBat);
        $('#conUnitList').append('<div class="souteBlock"><table><tr><td><img src="/static/img/units/'+landerBatType.cat+'/'+landerBatType.pic+'.png" width="48"></td><td id="be'+landerBat.id+'"></td></tr></table></div>');
        $('#be'+landerBat.id).append('<span class="listRes">'+landerBatType.name+'</span>');
        if (landerBat.chief != undefined) {
            if (landerBat.chief != '') {
                $('#be'+landerBat.id).append('<span class="listRes gf">('+landerBat.chief+')</span>');
            }
        }
        $('#be'+landerBat.id).append('<br>');
        $('#be'+landerBat.id).append('<span class="listRes cy">Cliquez sur la carte pour placer ce bataillon</span>');
    } else {
        modeLanding = false;
        conWindowOut();
        showedTilesReset(false);
        updateBldList();
        calcStartRes();
        if (playerInfos.onShip) {
            playRoom('station',true);
            checkSelectedLanderId();
            healEverything();
            events(true,0,false);
            miniOut();
        } else {
            if (zone[0].snd === undefined) {
                playRoom('crickets',true);
                // playBackMusic();
            } else {
                playRoom(zone[0].snd,true);
                // playBackMusic();
            }
            createStormsLists(true);
            checkUndark();
            if (zone[0].mapDiff < Math.floor(playerInfos.allTurns/apoCount)+1) {
                zone[0].mapDiff = Math.floor(playerInfos.allTurns/apoCount)+1;
            }
            showMap(zone,true);
            isReloaded = false;
        }
    }
};

function clickLanding(tileId) {
    let landerBat = getSpaceBatById(slId);
    let landerBatType = getBatType(landerBat);
    let batHere = false;
    let message = '';
    let tile = getTileById(tileId);
    let landerRange = getLanderRange(landerBatType);
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            batHere = true;
            message = 'Pas d\'atterrissage sur une case occupée par un de vos bataillons';
        }
    });
    aliens.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            batHere = true;
            message = 'Pas d\'atterrissage sur une case occupée par un alien';
        }
    });
    if (tile.x > 31+landerRange || tile.x < 31-landerRange || tile.y > 31+landerRange || tile.y < 31-landerRange) {
        batHere = true;
        message = 'Pas d\'atterrissage à plus de '+landerRange+' cases du centre.';
    } else {
        let tileLandingOK = landerLandingOK(tile);
        if (!tileLandingOK) {
            batHere = true;
            message = 'Pas d\'atterrissage sur ce type de terrain.';
        }
    }
    if (!batHere) {
        atterrissageSurZone(landerBat,landerBatType,tileId);
    } else {
        warning('Atterrissage avorté',message);
    }
    landingList();
};

function atterrissageSurZone(landerBat,landerBatType,tileId) {
    deadBatsList = [];
    landerBat.tileId = tileId;
    bataillons.push(landerBat);
    deadBatsList.push(landerBat.id);
    batsInSpace.forEach(function(bat) {
        if (bat.loc === 'trans' && bat.locId === landerBat.id) {
            bat.tileId = tileId;
            bat.oldTileId = tileId;
            bataillons.push(bat);
            deadBatsList.push(bat.id);
        }
    });
    killSpaceBatList();
    showMap(zone,true);
    warning('Atterrissage réussi','');
    // console.log(batsInSpace);
};

function healEverything() {
    // toutes les unités vont dans la soute
    // toutes les unités sont soignées et perdent leurs tags temporaires
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        let gearTags = getBatGearTags(bat.prt,bat.eq,batType);
        if (bat.loc === 'trans' && bat.locId != souteId) {
            if (!bat.tags.includes('return')) {
                gearTags.push('return');
            }
            loadBat(bat.id,souteId,bat.locId);
        }
        if (bat.tags.includes('zombie')) {
            gearTags.push('zombie');
        }
        if (bat.tags.includes('outsider')) {
            gearTags.push('outsider');
        }
        if (bat.tags.includes('schef')) {
            gearTags.push('schef');
        }
        if (bat.tags.includes('vet')) {
            gearTags.push('vet');
        }
        if (bat.tags.includes('hero')) {
            gearTags.push('hero');
        }
        if (bat.tags.includes('prodres')) {
            gearTags.push('prodres');
        }
        if (bat.tags.includes('necro')) {
            gearTags.push('necro');
        }
        bat.tags = gearTags;
        bat.squadsLeft = batType.squads;
        bat.damage = 0;
        if (bat.autoLoad != undefined) {
            if (bat.autoLoad.length >= 1) {
                bat.autoLoad = [];
            }
        }
        bat.apLeft = bat.ap;
        bat.oldapLeft = bat.ap;
        bat.salvoLeft = batType.maxSalvo;
    });
};

function createBatsInSpace() {
    batsInSpace = [];
    let deployedLandersIds = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital') && bat.type != 'Soute') {
                if (bat.tags.includes('deploy')) {
                    deployedLandersIds.push(bat.id);
                    batsInSpace.push(bat);
                }
            }
        }
    });
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && deployedLandersIds.includes(bat.locId)) {
            batsInSpace.push(bat);
        }
    });
    // console.log('bataillons');
    // console.log(bataillons);
    // console.log('batsInSpace creation');
    // console.log(batsInSpace);
};

function removeDeployedBats() {
    let deployedLandersIds = [];
    deadBatsList = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital') && bat.type != 'Soute') {
                if (bat.tags.includes('deploy')) {
                    deployedLandersIds.push(bat.id);
                    deadBatsList.push(bat.id);
                }
            }
        }
    });
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && deployedLandersIds.includes(bat.locId)) {
            deadBatsList.push(bat.id);
        }
    });
    killBatList();
    // console.log('bataillons after remove');
    // console.log(bataillons);
};

function isLanderDeployed() {
    let landerDeployed = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital') && bat.type != 'Soute') {
                if (bat.tags.includes('deploy')) {
                    landerDeployed = true;
                }
            }
        }
    });
    return landerDeployed;
}

function editSonde() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","100px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="ListRes or">CHOISIR UNE DESTINATION POUR PROCHAINE LA SONDE</span><br>');
    $('#conUnitList').append('<br>');
    // PLANET
    $('#conUnitList').append('<select class="boutonGris" id="thePlanet" onchange="changePlayerInfo(`thePlanet`,`sondePlanet`,`sonde`)" title="Planète"></select>');
    $('#thePlanet').empty().append('<option value="">Planète</option>');
    if (1 === playerInfos.sondePlanet) {
        $('#thePlanet').append('<option value="1" selected>Dom</option>');
    } else {
        $('#thePlanet').append('<option value="1">Dom</option>');
    }
    if (playerInfos.comp.vsp >= 1) {
        if (2 === playerInfos.sondePlanet) {
            $('#thePlanet').append('<option value="2" selected>Sarak</option>');
        } else {
            $('#thePlanet').append('<option value="2">Sarak</option>');
        }
    }
    if (playerInfos.bldList.includes('Centre de recherches')) {
        if (3 === playerInfos.sondePlanet) {
            $('#thePlanet').append('<option value="3" selected>Gehenna</option>');
        } else {
            $('#thePlanet').append('<option value="3">Gehenna</option>');
        }
    }
    if (playerInfos.comp.vsp >= 1 && playerInfos.bldList.includes('Centre de com')) {
        if (4 === playerInfos.sondePlanet) {
            $('#thePlanet').append('<option value="4" selected>Kzin</option>');
        } else {
            $('#thePlanet').append('<option value="4">Kzin</option>');
        }
        if (5 === playerInfos.sondePlanet) {
            $('#thePlanet').append('<option value="5" selected>Horst</option>');
        } else {
            $('#thePlanet').append('<option value="5">Horst</option>');
        }
    }
    $('#conUnitList').append('<span class="butSpace"></span>');
    // PRESENCE ALIEN
    $('#conUnitList').append('<select class="boutonGris" id="theZone" onchange="changePlayerInfo(`theZone`,`sondeDanger`,`sonde`)" title="Présence Alien"></select>');
    $('#theZone').empty().append('<option value="">Pr.Alien</option>');
    let prAMin = Math.floor(playerInfos.allTurns/apoCount)+1;
    let prAMax = Math.floor(playerInfos.allTurns/apoCount*1.25)+2;
    if (prAMax >= 10) {
        prAMax = 10;
    }
    let i = 0;
    while (i <= 15) {
        if (i >= prAMin || i === 10) {
            if (i === playerInfos.sondeDanger) {
                $('#theZone').append('<option value="'+i+'" selected>PrA '+i+'</option>');
            } else {
                $('#theZone').append('<option value="'+i+'">PrA '+i+'</option>');
            }
        }
        if (i >= prAMax) {break;}
        i++
    }
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function stopSonde() {
    modeSonde = false;
    // feedZoneDB();
    feedZoneDBwith(zone);
    saveNewMap();
    loadZone(0);
    showedTilesReset(false);
    miniOut();
    commandes();
};

function goSonde(impacteur) {
    if (impacteur) {
        impact = true;
    } else {
        impact = false;
    }
    conOut();
    batUnselect();
    playerInfos.undarkOnce = [];
    removeSonde(impacteur);
    saveCurrentZoneAs(0);
    modeSonde = true;
    playerInfos.sondeMaps = 0;
    generateNewMap();
    showMap(zone,true);
    commandes();
    ruinsView();
};

function removeSonde(impacteur) {
    let sondeOut = false;
    deadBatsList = [];
    if (impacteur) {
        bataillons.forEach(function(bat) {
            if (bat.type === 'Impacteur' && !sondeOut) {
                sondeOut = true;
                deadBatsList.push(bat.id);
            }
        });
    } else {
        bataillons.forEach(function(bat) {
            if (bat.type === 'Sonde' && !sondeOut) {
                sondeOut = true;
                deadBatsList.push(bat.id);
            }
        });
    }
    killBatList();
};

function pickZone() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="ListRes or">CHOISIR UNE ZONE POUR VOTRE PROCHAINE MISSION</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<div id="zoneDetail"></div>');
    zoneFiles.forEach(function(zoneId) {
        if (zoneId != 0) {
            let showInfo = '{Rien}';
            let zoneInfo = getZoneInfo(zoneId);
            if (zoneInfo.mapDiff != undefined) {
                showInfo = toZoneString(zoneInfo);
            }
            $('#conUnitList').append('<span class="paramName cy klik" onclick="putMissionZone('+zoneId+')">Choisir zone '+zoneId+'</span><span class="paramIcon rose"><i class="fas fa-map"></i></span><span class="paramValue cy klik" title="'+showInfo+'" onclick="loadZonePreview('+zoneId+')">Voir</span><br>');
        }
    });
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="ListRes">Pour avoir plus de zones, lancez une sonde!</span><br>');
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function putMissionZone(zoneId) {
    playerInfos.missionZone = zoneId;
    conWindowOut();
    commandes();
};

function feedZoneDB() {
    // écrire autrement pour qu'il y ait mise à jour
    let zoneIds = [];
    playerInfos.zoneDB.forEach(function(thisZone) {
        if (!zoneIds.includes(thisZone.id)) {
            zoneIds.push(thisZone.id);
        }
    });
    let newZone = {};
    if (!zoneIds.includes(zone[0].number)) {
        newZone.id = zone[0].number;
        newZone.planet = zone[0].planet;
        newZone.pid = zone[0].pid;
        newZone.dark = zone[0].dark;
        newZone.mapDiff = zone[0].mapDiff;
        newZone.ensol = zone[0].ensol;
        newZone.pKind = zone[0].pKind;
        newZone.gKind = zone[0].gKind;
        newZone.sKind = zone[0].sKind;
        if (zone[0].pp === undefined) {
            zoneReport(zone,true);
        }
        newZone.pm = zone[0].pm;
        newZone.ph = zone[0].ph;
        newZone.pp = zone[0].pp;
        newZone.pg = zone[0].pg;
        newZone.pb = zone[0].pb;
        newZone.pf = zone[0].pf;
        newZone.ps = zone[0].ps;
        newZone.pw = zone[0].pw;
        newZone.pr = zone[0].pr;
        playerInfos.zoneDB.push(newZone);
    }
};

function feedZoneDBwith(myZone) {
    // console.log('feedZoneDBwith');
    let zoneIds = [];
    let dbZone = {};
    playerInfos.zoneDB.forEach(function(thisZone) {
        if (!zoneIds.includes(thisZone.id)) {
            zoneIds.push(thisZone.id);
        }
        if (thisZone.id === myZone[0].number) {
            dbZone = thisZone;
        }
    });
    // console.log(zoneIds);
    // console.log(dbZone);
    let newZone = {};
    if (!zoneIds.includes(myZone[0].number)) {
        newZone.id = myZone[0].number;
        newZone.planet = myZone[0].planet;
        newZone.pid = myZone[0].pid;
        newZone.dark = myZone[0].dark;
        newZone.mapDiff = myZone[0].mapDiff;
        newZone.ensol = myZone[0].ensol;
        newZone.pKind = myZone[0].pKind;
        newZone.gKind = myZone[0].gKind;
        newZone.sKind = myZone[0].sKind;
        if (myZone[0].pp === undefined) {
            zoneReport(myZone,true);
        }
        newZone.pm = myZone[0].pm;
        newZone.ph = myZone[0].ph;
        newZone.pp = myZone[0].pp;
        newZone.pg = myZone[0].pg;
        newZone.pb = myZone[0].pb;
        newZone.pf = myZone[0].pf;
        newZone.ps = myZone[0].ps;
        newZone.pw = myZone[0].pw;
        newZone.pr = myZone[0].pr;
        playerInfos.zoneDB.push(newZone);
    } else if (Object.keys(dbZone).length >= 1) {
        dbZone.id = myZone[0].number;
        dbZone.planet = myZone[0].planet;
        dbZone.pid = myZone[0].pid;
        dbZone.dark = myZone[0].dark;
        dbZone.mapDiff = myZone[0].mapDiff;
        dbZone.ensol = myZone[0].ensol;
        dbZone.pKind = myZone[0].pKind;
        dbZone.gKind = myZone[0].gKind;
        dbZone.sKind = myZone[0].sKind;
        if (myZone[0].pp === undefined) {
            zoneReport(myZone,true);
        }
        dbZone.pm = myZone[0].pm;
        dbZone.ph = myZone[0].ph;
        dbZone.pp = myZone[0].pp;
        dbZone.pg = myZone[0].pg;
        dbZone.pb = myZone[0].pb;
        dbZone.pf = myZone[0].pf;
        dbZone.ps = myZone[0].ps;
        dbZone.pw = myZone[0].pw;
        dbZone.pr = myZone[0].pr;
    }
};

function getZoneInfo(zoneNumber) {
    let zoneInfo = {};
    let zoneIds = [];
    playerInfos.zoneDB.forEach(function(thisZone) {
        if (!zoneIds.includes(thisZone.id)) {
            zoneIds.push(thisZone.id);
        }
    });
    if (zoneIds.includes(zoneNumber)) {
        zoneInfo = getZoneInfoById(zoneNumber);
    } else {
        zoneInfo.id = zoneNumber;
    }
    return zoneInfo;
};

function toZoneString(zoneInfo) {
    let newString = toCoolString(zoneInfo);
    console.log(newString);
    newString = newString.replace("true","Oui");
    newString = newString.replace("false","Non");
    newString = newString.replace("mapDiff","Présence Alien");
    newString = newString.replace("ensol","Ensoleillement");
    newString = newString.replace("dark","Fog");
    newString = newString.replace(", pKind=","");
    newString = newString.replace(", gKind=","");
    newString = newString.replace(", sKind=","");
    newString = newString.replace(/bug/g,"");
    newString = newString.replace(/larve/g,"");
    newString = newString.replace(/swarm/g,"");
    newString = newString.replace(/spider/g,"");
    if (playerInfos.comp.ca >= 3) {
        newString = newString.replace("pm","Montagnes (bugs)");
        newString = newString.replace("ph","Collines (bugs)");
        newString = newString.replace("pp","Plaines ("+zoneInfo.pKind+"s)");
        newString = newString.replace("pg","Prairies ("+zoneInfo.gKind+"s)");
        newString = newString.replace("pb","Maquis (swarms)");
        newString = newString.replace("pf","Forêts (spiders)");
        newString = newString.replace("ps","Marécages ("+zoneInfo.sKind+"s)");
        newString = newString.replace("pw","Etangs (larves)");
        newString = newString.replace("pr","Rivières (larves)");
    } else {
        newString = newString.replace("pm","Montagnes");
        newString = newString.replace("ph","Collines");
        newString = newString.replace("pp","Plaines");
        newString = newString.replace("pg","Prairies");
        newString = newString.replace("pb","Maquis");
        newString = newString.replace("pf","Forêts");
        newString = newString.replace("ps","Marécages");
        newString = newString.replace("pw","Etangs");
        newString = newString.replace("pr","Rivières");
    }
    return newString;
};

function showZonePreview() {
    showMini = true;
    if (allZoneRes.length === 0) {
        checkRes = true;
    } else {
        checkRes = false;
    }
    $("#minimap").css("display","block");
    $('#themmap').empty();
    $('#thenavig').empty();
    $('#thenavig').append('<span class="constIcon"><i class="fas fa-times-circle klik" onclick="miniOut()"></i></span><br>');
    let allResQHere = {};
    let allResHere = [];
    let ccom = false;
    if (playerInfos.bldList.includes('Centre de com')) {
        ccom = true;
    }
    zonePrev.forEach(function(tile) {
        if (tile.y === 1) {
            $('#themmap').append('<br>');
        }
        if (tile.rq != undefined) {
            Object.entries(tile.rs).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (playerInfos.comp.det < 3) {
                    if (!allResHere.includes(key)) {
                        allResHere.push(key);
                    }
                } else {
                    if (allResQHere[key] === undefined) {
                        allResQHere[key] = value;
                    } else {
                        allResQHere[key] = allResQHere[key]+value;
                    }
                }
            });
        }
        let infraHere = false;
        if (tile.infra != undefined) {
            if (tile.infra != 'Débris') {
                infraHere = true;
            }
        }
        if (tile.ruins && tile.sh >= 0) {
            $('#themmap').append('<span class="mini mPoints" title="Ruine (non fouillée)"></span>');
        } else if (tile.rq === 3) {
            $('#themmap').append('<span class="mini mRed" title="Gisement important"></span>');
        } else if (tile.rq === 2) {
            $('#themmap').append('<span class="mini mYel" title="Gisement"></span>');
        } else if (tile.rq >= 4) {
            $('#themmap').append('<span class="mini mBlu" title="Ressource rare"></span>');
        } else if (infraHere) {
            $('#themmap').append('<span class="mini mInfra" title="Infrastructure"></span>');
        } else {
            if (zonePrev[0].planet === 'Sarak') {
                let distance = calcDistance(tile.id,1830);
                if (distance <= playerInfos.comp.det) {
                    $('#themmap').append('<span class="mini m'+tile.terrain+'"></span>');
                } else {
                    if (ccom) {
                        if (tile.terrain === 'W' || tile.terrain === 'R') {
                            $('#themmap').append('<span class="mini mDarkWater"></span>');
                        } else {
                            if (playerInfos.comp.det >= 3 && tile.terrain === 'M') {
                                $('#themmap').append('<span class="mini mDarkMount"></span>');
                            } else {
                                $('#themmap').append('<span class="mini mDark"></span>');
                            }
                        }
                    } else {
                        $('#themmap').append('<span class="mini mDark"></span>');
                    }
                }
            } else {
                $('#themmap').append('<span class="mini m'+tile.terrain+'"></span>');
            }
        }
    });
    $('#themmap').append('<br>');
    feedZoneDBwith(zonePrev);
    $('#zoneDetail').empty();
    let showInfo = '';
    let zoneInfo = getZoneInfo(zonePrev[0].number);
    if (zoneInfo.mapDiff != undefined) {
        showInfo = toZoneString(zoneInfo);
        showInfo = showInfo.replace(/{/g,'');
        showInfo = showInfo.replace(/}/g,'');
    }
    let rain = isRaining(zonePrev);
    if (rain) {
        showInfo = showInfo+', Pluie=Oui';
    }  else {
        showInfo = showInfo+', Pluie=Non';
    }
    if (playerInfos.comp.ca >= 2) {
        if (zonePrev[0].planet === 'Gehenna') {
            showInfo = showInfo+', Eau=Poison';
        } else if (zonePrev[0].seed === 2) {
            if (zonePrev[0].gKind === 'spider' || zonePrev[0].pKind === 'spider' || zonePrev[0].sKind === 'spider') {
                showInfo = showInfo+', Eau=Poison';
            } else {
                showInfo = showInfo+', Eau=OK';
            }
        } else {
            showInfo = showInfo+', Eau=OK';
        }
    }
    $('#zoneDetail').append('<span class="ListRes">'+showInfo+'<br></span><br>');
    $('#zoneDetail').append('<span class="ListRes vert">Ressources présentes<br></span><br>');
    if (playerInfos.comp.det >= 3) {
        $('#zoneDetail').append('<span class="ListRes">'+toCoolString(allResQHere,true)+'<br></span><br>');
    } else if (playerInfos.comp.det >= 2) {
        $('#zoneDetail').append('<span class="ListRes">'+toNiceString(allResHere)+'<br></span><br>');
    } else {
        $('#zoneDetail').append('<span class="ListRes">Compétence de détection insuffisante...<br></span><br>');
    }
};

function isRaining(myZone) {
    let rain = false;
    if (myZone[0].snd === 'rainforest' || myZone[0].snd === 'thunderstart' || myZone[0].snd === 'swamp' || myZone[0].snd === 'uhuwind') {
        rain = true;
    } else if (myZone[0].snd === 'monsoon' || myZone[0].snd === 'thunderfull') {
        rain = true;
    }
    return rain;
}
