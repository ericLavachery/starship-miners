function startMission() {
    $('#unitInfos').empty();
    $('#tileInfos').empty();
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
    $('#tileInfos').empty();
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
    $('#tileInfos').empty();
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
        if (playerInfos.onShip) {
            checkSelectedLanderId();
            healEverything();
            miniOut();
        }
    }
};

function clickLanding(tileId) {
    let landerBat = getSpaceBatById(slId);
    let landerBatType = getBatType(landerBat);
    let batHere = false;
    let message = '';
    let tile = getTileById(tileId);
    let landerRange = getLanderRange();
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
        if (bat.loc === 'trans' && bat.locId != souteId) {
            loadBat(bat.id,souteId,bat.locId);
            bat.squadsLeft = batType.squads;
            bat.damage = 0;
            bat.apLeft = bat.ap;
            bat.oldapLeft = bat.ap;
            bat.salvoLeft = batType.maxSalvo;
            let gearTags = getBatGearTags(bat.prt,bat.eq,batType);
            if (bat.tags.includes('zombie')) {
                gearTags.push('zombie');
            }
            bat.tags = gearTags;
            // bat.tags.push.apply(myBat.tags,gearTags);
        }
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
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="ListRes or">CHOISIR UNE DESTINATION POUR PROCHAINE LA SONDE</span><br>');
    $('#conUnitList').append('<br>');
    // PLANET
    $('#conUnitList').append('<select class="boutonGris" id="thePlanet" onchange="changePlayerInfo(`thePlanet`,`sondePlanet`,`sonde`)" title="Planète"></select>');
    $('#thePlanet').empty().append('<option value="">Planète</option>');
    if (1 === playerInfos.sondePlanet) {
        $('#thePlanet').append('<option value="1" selected>Planète 1</option>');
    } else {
        $('#thePlanet').append('<option value="1">Planète 1</option>');
    }
    $('#conUnitList').append('<span class="butSpace"></span>');
    // PRESENCE ALIEN
    $('#conUnitList').append('<select class="boutonGris" id="theZone" onchange="changePlayerInfo(`theZone`,`sondeDanger`,`sonde`)" title="Présence Alienne"></select>');
    $('#theZone').empty().append('<option value="">Pr.Alien</option>');
    let i = 0;
    while (i <= 15) {
        if (i === playerInfos.sondeDanger) {
            $('#theZone').append('<option value="'+i+'" selected>PrA '+i+'</option>');
        } else {
            $('#theZone').append('<option value="'+i+'">PrA '+i+'</option>');
        }
        if (i > 16) {break;}
        i++
    }
    $('#conUnitList').append('<br>');
};

function stopSonde() {
    modeSonde = false;
    saveNewMap();
    loadZone(0);
    showedTilesReset(false);
    commandes();
};

function goSonde() {
    removeSonde();
    saveCurrentZoneAs(0);
    modeSonde = true;
    playerInfos.sondeMaps = 0;
    generateNewMap();
    showMap(zone,true);
    commandes();
};

function hasUnit(unitName) {
    let youHaveIt = false;
    bataillons.forEach(function(bat) {
        if (bat.type === unitName) {
            youHaveIt = true;
        }
    });
    return youHaveIt;
}

function removeSonde() {
    let sondeOut = false;
    deadBatsList = [];
    bataillons.forEach(function(bat) {
        if (bat.type === 'Sonde' && !sondeOut) {
            sondeOut = true;
            deadBatsList.push(bat.id);
        }
    });
    killBatList();
};

function pickZone() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut()"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="ListRes or">CHOISIR UNE ZONE POUR VOTRE PROCHAINE MISSION</span><br>');
    $('#conUnitList').append('<br>');
    zoneFiles.forEach(function(zoneId) {
        if (zoneId != 0) {
            $('#conUnitList').append('<span class="paramName cy klik" onclick="putMissionZone('+zoneId+')">Choisir zone '+zoneId+'</span><span class="paramIcon rose"><i class="fas fa-map"></i></span><span class="paramValue cy klik">Voir</span><br>');
        }
    });
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="ListRes">Pour avoir plus de zones, lancez une sonde!</span><br>');
    $('#conUnitList').append('<br>');
};

function putMissionZone(zoneId) {
    playerInfos.missionZone = zoneId;
    conWindowOut();
    commandes();
};
