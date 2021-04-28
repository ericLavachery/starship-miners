function startMission() {
    // créer db batsInSpace, avec les landers marqués deploy=true et toutes les unités qui sont dedans
    createBatsInSpace();
    // virer ces landers et ces unités de la bd bataillons
    removeDeployedBats();
    // sauvegarder la zone STATION
    saveCurrentZoneAs(0);
    // charger la zone playerInfos.missionZone
    loadZone(playerInfos.missionZone);
    $('#unitInfos').empty();
    // var modeLanding = true
    playerInfos.onShip = false;
    inSoute = false;
    modeLanding = true;
    // en mode landing: fenêtre avec les landers qui sont dans batsInSpace
    // choisir un lander et le placer sur la carte (en fonction des restriction .comp.vsp)
    // une fois placé, mettre le lander et toutes les unités qui sont dedans dans la db bataillons (sur le tileId choisi)
    // idem avec tous les landers
    // quand plus rien dans batsInSpace: modeLanding = false
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
