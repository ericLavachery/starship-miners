function startMission() {
    $('#unitInfos').empty();
    $('#tileInfos').empty();
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
    // créer db batsInSpace, avec les landers et toutes les unités qui sont dedans
    // virer ces landers et ces unités de la bd bataillons
    // sauvegarder la zone pour un retour
    // charger la zone STATION
    // rajouter toutes les unités de la db batsInSpace dans la db bataillons
    // les landers vont à leur place dans la station
    // toutes les unités vont dans la soute
    // toutes les unités sont soignées et perdent leurs tags temporaires
    // virer la db batsInSpace
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
    landerBat.oldTileId = tileId;
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
    console.log(batsInSpace);
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
    // console.log(bataillons);
};

function landerDeploy(landerId) {
    let lander = getBatById(landerId);
    if (lander.tags.includes('deploy')) {
        tagDelete(lander,'deploy');
    } else {
        lander.tags.push('deploy');
    }
    showBatInfos(lander);
};

function choisirZone() {
    // sauvegarder la zone STATION
    // voir une liste les zones sauvegardées
    // cliquer pour voir une zone (charger la zone)
    // faire son choix (changer playerInfos.missionZone)
    // charger la zone STATION
};
