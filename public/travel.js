function startMission() {
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    if (playerInfos.okFill) {
        saveGame();
        events(false,65,true,true);
        // noter les ressources de la station
        updateVMRes();
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
        playerInfos.deadBats = [];
        playerInfos.travTurns = 0;
        playerInfos.crafts = 0;
        playerInfos.vz = 0;
        inSoute = false;
        modeLanding = true;
        // en mode landing: fenêtre avec les landers qui sont dans batsInSpace
        // choisir un lander et le placer sur la carte (en fonction des restriction .comp.vsp)
        // une fois placé, mettre le lander et toutes les unités qui sont dedans dans la db bataillons (sur le tileId choisi)
        // idem avec tous les landers
        // quand plus rien dans batsInSpace: modeLanding = false
        landingList();
        // la mission commence
    } else {
        warning('Ressources','Vous ne voulez pas partir sans ressources...')
    }
};

function updateVMRes() {
    let souteBat = getBatById(souteId);
    playerInfos.vmRes = {};
    playerInfos.teleRes = {};
    Object.entries(souteBat.transRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (value >= 1) {
            if (playerInfos.vmRes[key] === undefined) {
                playerInfos.vmRes[key] = value;
            } else {
                playerInfos.vmRes[key] = playerInfos.vmRes[key]+value;
            }
        }
    });
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
    // log save
    savePlayerLog();
    // charger la zone STATION
    loadZone(0);
    playerInfos.onShip = true;
    playerInfos.okFill = false;
    playerInfos.crafts = 0;
    playerInfos.vz = 999;
    playerInfos.missionZone = -1;
    playerInfos.nmi = playerInfos.nmi+1;
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
        if (landerBatType.hySpeed > playerInfos.travTurns) {
            playerInfos.travTurns = landerBatType.hySpeed;
        }
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
            playRoom('station',true,true);
            checkVMTileIds();
            checkSelectedLanderId();
            healEverything();
            payCost(playerInfos.teleRes);
            playerInfos.teleRes = {};
            events(true,0,false);
            miniOut();
            saveGame();
        } else {
            if (zone[0].snd === undefined) {
                playRoom('crickets',true,true);
                // playBackMusic();
            } else {
                playRoom(zone[0].snd,true,true);
                // playBackMusic();
            }
            createStormsLists(true);
            checkUndark();
            let minDiff = getDoom(true);
            console.log('minDiff='+minDiff);
            if (zone[0].mapDiff < minDiff) {
                zone[0].mapDiff = minDiff;
                saveMap();
                console.log('done!');
            }
            let presAlienDice = rand.rand(1,12);
            if (zone[0].planet === 'Gehenna') {
                zone[0].mapDiff = zone[0].mapDiff+1;
            } else if (presAlienDice <= 2 && zone[0].mapDiff <= 8 && zone[0].mapDiff >= 2) {
                zone[0].mapDiff = zone[0].mapDiff+1;
            } else if (presAlienDice >= 11 && zone[0].mapDiff >= 2) {
                zone[0].mapDiff = zone[0].mapDiff-1;
            }
            checkCanon();
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
        // RESSOURCES ---------------------------------------
        if (batType.skills.includes('fret') && !batType.skills.includes('transorbital')) {
            if (bat.transRes != undefined) {
                if (Object.keys(bat.transRes).length >= 1) {
                    resToLander(bat);
                }
            }
        }
        // TAGS -------------------------------------------------
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
        if (bat.tags.includes('genslow')) {
            gearTags.push('genslow');
        }
        if (bat.tags.includes('genfast')) {
            gearTags.push('genfast');
        }
        if (bat.tags.includes('genblind')) {
            gearTags.push('genblind');
        }
        if (bat.tags.includes('genstrong')) {
            gearTags.push('genstrong');
        }
        if (bat.tags.includes('genwater')) {
            gearTags.push('genwater');
        }
        if (bat.tags.includes('genreg')) {
            gearTags.push('genreg');
        }
        if (bat.tags.includes('outsider')) {
            if (!batType.skills.includes('constructeur')) {
                gearTags.push('outsider');
            }
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
        // SOINS -------------------------------------------
        if (batType.skills.includes('norepair')) {
            bat.damage = 0;
        } else {
            let healCost = 0;
            if (bat.damage > 0) {
                healCost = 1;
            }
            bat.damage = 0;
            healCost = healCost+batType.squads-bat.squadsLeft;
            if (batType.skills.includes('lowmed')) {
                healCost = healCost*3;
            }
            bat.squadsLeft = batType.squads;
            if (healCost >= 1) {
                if (bat.soins != undefined) {
                    bat.soins = bat.soins+healCost;
                } else {
                    bat.soins = healCost;
                }
            }
            if (batType.skills.includes('clone')) {
                if (bat.soins != undefined) {
                    bat.soins = bat.soins+3;
                } else {
                    bat.soins = 3;
                }
            }
            if (batType.skills.includes('decay')) {
                let decayPts = 6;
                if (batType.skills.includes('robot')) {
                    decayPts = 9;
                }
                if (bat.soins != undefined) {
                    bat.soins = bat.soins+decayPts;
                } else {
                    bat.soins = decayPts;
                }
            }
        }
        // AUTOLOAD -------------------------------------------
        if (bat.autoLoad != undefined) {
            if (bat.autoLoad.length >= 1) {
                bat.autoLoad = [];
            }
        }
        // MINING -------------------------------------------
        if (bat.extracted != undefined) {
            if (bat.extracted.length >= 1) {
                bat.extracted = [];
            }
        }
        // AP -------------------------------------------
        bat.apLeft = bat.ap;
        bat.oldapLeft = bat.ap;
        bat.salvoLeft = batType.maxSalvo;
    });
};

function resToLander(transBat) {
    let landerBatId = transBat.locId;
    let landerBat = getBatById(landerBatId);
    Object.entries(transBat.transRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (value >= 1) {
            if (landerBat.transRes[key] === undefined) {
                landerBat.transRes[key] = value;
            } else {
                landerBat.transRes[key] = landerBat.transRes[key]+value;
            }
        }
        delete transBat.transRes[key];
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
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
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
    if (playerInfos.comp.vsp >= 1 && playerInfos.bldList.includes('Poste radio')) {
        if (2 === playerInfos.sondePlanet) {
            $('#thePlanet').append('<option value="2" selected>Sarak</option>');
        } else {
            $('#thePlanet').append('<option value="2">Sarak</option>');
        }
    } else {
        $('#thePlanet').append('<option value="2" title="Minimum: Poste radio / Vols spatiaux 1 / Présence alien 4+" disabled>Sarak</option>');
    }
    if (playerInfos.bldList.includes('Centre de recherches')) {
        if (3 === playerInfos.sondePlanet) {
            $('#thePlanet').append('<option value="3" selected>Gehenna</option>');
        } else {
            $('#thePlanet').append('<option value="3">Gehenna</option>');
        }
    } else {
        $('#thePlanet').append('<option value="3" title="Minimum: Centre de recherches / Présence alien 4+" disabled>Gehenna</option>');
    }
    if (playerInfos.comp.vsp >= 2 && playerInfos.bldList.includes('Sonde')) {
        if (4 === playerInfos.sondePlanet) {
            $('#thePlanet').append('<option value="4" selected>Kzin</option>');
        } else {
            $('#thePlanet').append('<option value="4">Kzin</option>');
        }
    } else {
        $('#thePlanet').append('<option value="4" title="Minimum: Sonde / Vols spatiaux 2 / Présence alien 4+" disabled>Kzin</option>');
    }
    if (playerInfos.comp.vsp >= 1 && playerInfos.bldList.includes('Centre de com') && playerInfos.bldList.includes('Sonde')) {
        if (5 === playerInfos.sondePlanet) {
            $('#thePlanet').append('<option value="5" selected>Horst</option>');
        } else {
            $('#thePlanet').append('<option value="5">Horst</option>');
        }
    } else {
        $('#thePlanet').append('<option value="5" title="Minimum: Sonde / Centre de com / Vols spatiaux 1 / Présence alien 4+" disabled>Horst</option>');
    }
    $('#conUnitList').append('<span class="butSpace"></span>');
    // PRESENCE ALIEN
    $('#conUnitList').append('<select class="boutonGris" id="theZone" onchange="changePlayerInfo(`theZone`,`sondeDanger`,`sonde`)" title="Présence Alien"></select>');
    $('#theZone').empty().append('<option value="">Pr.Alien</option>');
    let prAMin = getDoom(true);
    if (playerInfos.sondePlanet != 1 && prAMin < 4) {
        prAMin = 4;
        warning('Attention!','Forte présence alien sur cette planête');
    }
    let prAMax = Math.floor(playerInfos.allTurns/apoCount*1.25)+2;
    if (prAMax < prAMin+1) {
        prAMax = prAMin+1;
    }
    if (prAMax >= 10) {
        prAMax = 10;
    }
    let i = 0;
    while (i <= 15) {
        if (i >= prAMin || i === 10) {
            if (i === playerInfos.sondeDanger || i === prAMin) {
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
        playerInfos.allTurns = playerInfos.allTurns+Math.floor(10/(playerInfos.comp.vsp+2)*3);
    } else {
        impact = false;
        playerInfos.allTurns = playerInfos.allTurns+Math.floor(8/(playerInfos.comp.vsp+4)*5);
    }
    conOut(true);
    batUnselect();
    playerInfos.undarkOnce = [];
    removeSonde(impacteur);
    saveCurrentZoneAs(0);
    modeSonde = true;
    playerInfos.sondeMaps = 0;
    checkFilter();
    generateNewMap(false);
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
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
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
    if (!playerInfos.bldVM.includes('Station météo')) {
        delete zoneInfo.ensol;
    }
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
        if (zoneInfo.planet === 'Gehenna') {
            newString = newString.replace("pm","Montagnes (spiders)");
            newString = newString.replace("ph","Collines (spiders)");
            newString = newString.replace("pb","Maquis (swarms)");
            newString = newString.replace("pf","Forêts (spiders)");
            newString = newString.replace("pw","Etangs (larves)");
            newString = newString.replace("pr","Rivières (larves)");
        } else if (zoneInfo.planet === 'Kzin') {
            newString = newString.replace("pm","Montagnes (bugs)");
            newString = newString.replace("ph","Collines (bugs)");
            newString = newString.replace("pb","Maquis (spiders)");
            newString = newString.replace("pf","Forêts (spiders)");
            newString = newString.replace("pw","Etangs (larves)");
            newString = newString.replace("pr","Rivières (larves)");
        } else if (zoneInfo.planet === 'Horst') {
            newString = newString.replace("pm","Montagnes (bugs)");
            newString = newString.replace("ph","Collines (bugs)");
            newString = newString.replace("pb","Maquis (swarms)");
            newString = newString.replace("pf","Forêts (swarms)");
            newString = newString.replace("pw","Etangs (swarms)");
            newString = newString.replace("pr","Rivières (swarms)");
        } else {
            newString = newString.replace("pm","Montagnes (bugs)");
            newString = newString.replace("ph","Collines (bugs)");
            newString = newString.replace("pb","Maquis (swarms)");
            newString = newString.replace("pf","Forêts (spiders)");
            newString = newString.replace("pw","Etangs (larves)");
            newString = newString.replace("pr","Rivières (larves)");
        }
        newString = newString.replace("pp","Plaines ("+zoneInfo.pKind+"s)");
        newString = newString.replace("pg","Prairies ("+zoneInfo.gKind+"s)");
        newString = newString.replace("ps","Marécages ("+zoneInfo.sKind+"s)");
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
    let centreResQHere = {};
    let centreResHere = [];
    let ccom = false;
    if (playerInfos.bldList.includes('Centre de com')) {
        ccom = true;
    }
    zonePrev.forEach(function(tile) {
        if (tile.y === 1) {
            $('#themmap').append('<br>');
        }
        if (tile.rq != undefined) {
            let isCentre = false;
            let distance = calcDistance(1830,tile.id);
            if (distance <= 9) {
                isCentre = true;
            }
            Object.entries(tile.rs).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (isCentre) {
                    if (!centreResHere.includes(key)) {
                        centreResHere.push(key);
                    }
                }
                if (!allResHere.includes(key)) {
                    allResHere.push(key);
                }
                if (playerInfos.comp.det >= 3) {
                    if (isCentre) {
                        if (centreResQHere[key] === undefined) {
                            centreResQHere[key] = value;
                        } else {
                            centreResQHere[key] = centreResQHere[key]+value;
                        }
                    }
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
                if (distance <= playerInfos.comp.det+1) {
                    $('#themmap').append('<span class="mini m'+tile.terrain+'"></span>');
                } else {
                    if (ccom) {
                        if (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain === 'L') {
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
    if (playerInfos.bldVM.includes('Station météo')) {
        if (rain) {
            showInfo = showInfo+', Pluie=Oui';
        }  else {
            showInfo = showInfo+', Pluie=Non';
        }
    }
    if (playerInfos.comp.ca >= 2) {
        let potable = checkPotable(zonePrev,-1);
        if (!potable) {
            showInfo = showInfo+', Eau=Poison';
        } else {
            showInfo = showInfo+', Eau=OK';
        }
    }
    if (showInfo.includes('Dom')) {
        showInfo = showInfo.replace(/Dom/g,'<span class="cy">Dom</span>');
    }
    if (showInfo.includes('Sarak')) {
        showInfo = showInfo.replace(/Sarak/g,'<span class="cy">Sarak</span>');
    }
    if (showInfo.includes('Gehenna')) {
        showInfo = showInfo.replace(/Gehenna/g,'<span class="cy">Gehenna</span>');
    }
    if (showInfo.includes('Kzin')) {
        showInfo = showInfo.replace(/Kzin/g,'<span class="cy">Kzin</span>');
    }
    if (showInfo.includes('Horst')) {
        showInfo = showInfo.replace(/Horst/g,'<span class="cy">Horst</span>');
    }
    console.log('showInfo');
    console.log(showInfo);
    let spType = getZoneType(zonePrev);
    if (spType != 'normal') {
        showInfo = changeEggKindsByZoneType(showInfo,spType);
    }
    $('#zoneDetail').append('<span class="ListRes">'+showInfo+'<br></span><br>');
    // Ressources manquantes
    let allMissingRes = [];
    let centreMissingRes = [];
    resTypes.forEach(function(res) {
        if (res.cat != 'zero' && res.cat != 'alien' && res.cat != 'transfo') {
            if (!centreResHere.includes(res.name)) {
                centreMissingRes.push(res.name);
            }
            if (!allResHere.includes(res.name)) {
                allMissingRes.push(res.name);
            }
        }
    });
    $('#zoneDetail').append('<span class="ListRes vert">Ressources au centre de la zone<br></span><br>');
    if (playerInfos.comp.det >= 3) {
        let theRez = orderObjectByKey(centreResQHere);
        $('#zoneDetail').append('<span class="ListRes vert">Présentes<br></span>');
        $('#zoneDetail').append('<span class="ListRes ciel">'+toCoolString(theRez,true)+'<br></span>');
        let theNoRez = centreMissingRes.sort();
        $('#zoneDetail').append('<span class="ListRes vert">Non présentes<br></span>');
        $('#zoneDetail').append('<span class="ListRes jaune">'+toNiceString(theNoRez)+'<br></span><br>');
    } else if (playerInfos.comp.det >= 0) {
        let theRez = centreResHere.sort();
        $('#zoneDetail').append('<span class="ListRes vert">Présentes<br></span>');
        $('#zoneDetail').append('<span class="ListRes ciel">'+toNiceString(theRez)+'<br></span>');
        let theNoRez = centreMissingRes.sort();
        $('#zoneDetail').append('<span class="ListRes vert">Non présentes<br></span>');
        $('#zoneDetail').append('<span class="ListRes jaune">'+toNiceString(theNoRez)+'<br></span><br>');
    } else {
        $('#zoneDetail').append('<span class="ListRes">Compétence de détection insuffisante...<br></span><br>');
    }
    $('#zoneDetail').append('<span class="ListRes vert">Toutes les ressources<br></span><br>');
    if (playerInfos.comp.det >= 3) {
        let theRez = orderObjectByKey(allResQHere);
        $('#zoneDetail').append('<span class="ListRes vert">Présentes<br></span>');
        $('#zoneDetail').append('<span class="ListRes ciel">'+toCoolString(theRez,true)+'<br></span>');
        let theNoRez = allMissingRes.sort();
        $('#zoneDetail').append('<span class="ListRes vert">Non présentes<br></span>');
        $('#zoneDetail').append('<span class="ListRes jaune">'+toNiceString(theNoRez)+'<br></span><br>');
    } else if (playerInfos.comp.det >= 0) {
        let theRez = allResHere.sort();
        $('#zoneDetail').append('<span class="ListRes vert">Présentes<br></span>');
        $('#zoneDetail').append('<span class="ListRes ciel">'+toNiceString(theRez)+'<br></span>');
        let theNoRez = allMissingRes.sort();
        $('#zoneDetail').append('<span class="ListRes vert">Non présentes<br></span>');
        $('#zoneDetail').append('<span class="ListRes jaune">'+toNiceString(theNoRez)+'<br></span><br>');
    } else {
        $('#zoneDetail').append('<span class="ListRes">Compétence de détection insuffisante...<br></span><br>');
    }
};

function changeEggKindsByZoneType(showInfo,spType) {
    if (spType === 'leech') {
        showInfo = showInfo.replace(/bugs/g,'larves');
        showInfo = showInfo.replace(/spiders/g,'larves');
        showInfo = showInfo.replace(/swarms/g,'larves');
        showInfo = showInfo+', <span class="jaune">Sangsues!</span>';
    }
    if (spType === 'flies') {
        showInfo = showInfo.replace(/bugs/g,'larves');
        showInfo = showInfo.replace(/spiders/g,'larves');
        showInfo = showInfo.replace(/swarms/g,'larves');
        showInfo = showInfo+', <span class="jaune">Moucherons!</span>';
    }
    if (spType === 'ants') {
        showInfo = showInfo.replace(/bugs/g,'swarms');
        showInfo = showInfo.replace(/spiders/g,'swarms');
        showInfo = showInfo.replace(/larves/g,'swarms');
        showInfo = showInfo+', <span class="jaune">Fourmis!</span>';
    }
    if (spType === 'roaches') {
        showInfo = showInfo.replace(/bugs/g,'swarms');
        showInfo = showInfo.replace(/spiders/g,'swarms');
        showInfo = showInfo.replace(/larves/g,'swarms');
        showInfo = showInfo+', <span class="jaune">Cafards!</span>';
    }
    if (spType === 'spinne') {
        showInfo = showInfo.replace(/bugs/g,'spiders');
        showInfo = showInfo.replace(/larves/g,'spiders');
        showInfo = showInfo.replace(/swarms/g,'spiders');
        showInfo = showInfo+', <span class="jaune">Sournoises!</span>';
    }
    if (spType === 'bigbugs') {
        showInfo = showInfo.replace(/spiders/g,'bugs');
        showInfo = showInfo.replace(/larves/g,'bugs');
        showInfo = showInfo.replace(/swarms/g,'bugs');
        showInfo = showInfo+', <span class="jaune">Broyeurs!</span>';
    }
    return showInfo;
};

function getZoneType(myZone) {
    let spType = 'normal';
    if (zonePrev[0].type != undefined) {
        spType = zonePrev[0].type;
    }
    return spType;
};

function isRaining(myZone) {
    let rain = false;
    if (myZone[0].snd === 'rainforest' || myZone[0].snd === 'thunderstart' || myZone[0].snd === 'swamp' || myZone[0].snd === 'uhuwind') {
        rain = true;
    } else if (myZone[0].snd === 'monsoon' || myZone[0].snd === 'thunderfull') {
        rain = true;
    }
    return rain;
};
