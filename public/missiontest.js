function missionTest() {
    socket.emit('load-missions-teams',zone[0].number);
};

function putMissionUnits(missionTeams) {
    let mType = getMissionType(zone[0].number,false);
    putMissionStats(mType,missionTeams);
    putFullBldVM();
    putMissionAlienRes();
    objectifsReset();
    let startTileId = -1;
    let theBest = 0;
    zone.forEach(function(tile) {
        if (tile.nav != undefined) {
            if (tile.nav) {
                thisOne = 1;
                if (playerInfos.showedTiles.includes(tile.id)) {
                    thisOne = 10;
                }
                if (thisOne > theBest) {
                    startTileId = tile.id;
                    theBest = thisOne;
                }
            }
        }
    });
    if (startTileId < 0) {
        startTileId = 1830;
    }
    playerInfos.myCenter = startTileId;
    let tileId = startTileId;
    let unitNum = 0;
    let missionBatList = getMissionBatList(mType,missionTeams);
    missionBatList.forEach(function(slot) {
        unitNum++;
        let maxXP = 900;
        let minXP = Math.floor(maxXP*mType.pa*mType.pa*mType.pa/2000);
        let unitXP = rand.rand(minXP,maxXP);
        addMissionBat(tileId,slot,unitXP);
    });
    // playerInfos.mapTurn = 1;
    let navBat = getBatById(navId);
    batSelect(navBat,true);
    showBatInfos(navBat);
    showTileInfos(navBat.tileId);
    showMap(zone,false);
};

function addMissionBat(tileId,slot,xp) {
    // ajouter bataillon
    // console.log('ADD BAT');
    // console.log(slot);
    let unitIndex = unitTypes.findIndex((obj => obj.name === slot.name));
    if (unitIndex === -1) {
        if (slot.name === 'Infirmiers') {
            slot.name = 'Médecins';
            // console.log(slot);
            unitIndex = unitTypes.findIndex((obj => obj.name === slot.name));
        }
    }
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = slot.gear;
    conselTriche = true;
    // console.log(conselUnit);
    let isNav = false;
    if (conselUnit.skills.includes('transorbital')) {
        isNav = true;
    }
    putBat(tileId,0,xp,'deploy',false,true,true);
    if (isNav) {
        let navBat = getLastBatCreated();
        putMissionLanderRes(navBat);
        navId = navBat.id;
    } else if (navId >= 0) {
        // embarquer dans la navette
        let newBat = getLastBatCreated();
        loadBat(newBat.id,navId);
    }
};

function getMissionBatList(mType,missionTeams) {
    let missionBatList = [];
    let newSlot;
    // determiner unité, munitions, armure, équipement
    if (playerInfos.gLevel >= 18) {
        newSlot = new SlotConstructor('Liberator',['titanium','ac-explosive','duneg-vsp','e-mecano']);
    } else if (playerInfos.gLevel >= 17) {
        newSlot = new SlotConstructor('Liberator',['titanium','ac-explosive','aucun','e-mecano']);
    } else if (playerInfos.gLevel >= 14) {
        newSlot = new SlotConstructor('Thundership',['titanium','xxx','aucun','e-mecano']);
    } else {
        newSlot = new SlotConstructor('Navette de secours',['titanium','xxx','aucun','megatrans']);
    }
    missionBatList.push(newSlot);
    missionTeams.forEach(function(slot) {
        if (slot.unit != undefined) {
            if (slot.missions.includes(mType.nid)) {
                if (slot.gangs.includes(playerInfos.gang)) {
                    newSlot = new SlotConstructor(slot.unit,slot.gear);
                    missionBatList.push(newSlot);
                }
            }
        }
    });
    console.log('MISSION BATS');
    console.log(missionBatList);
    return missionBatList;
};

function SlotConstructor(theName,theGear) {
    this.name = theName;
    this.gear = theGear;
};

function putMissionStats(mType,missionTeams) {
    // playerInfos.gang = 'rednecks';
    playerInfos.gLevel = Math.ceil((mType.pa*2)+4-playerInfos.gMode);
    playerInfos.comp = getMissionComps(mType,missionTeams);
    if (zone[0].pid-2 > playerInfos.comp.scaph) {
        playerInfos.comp.scaph = zone[0].pid-2;
    }
};

function getMissionComps(mType,missionTeams) {
    let comps = {};
    let index = missionTeams.findIndex((obj => (obj.gang == playerInfos.gang && obj.mission == mType.nid)));
    if (index > -1) {
        comps = missionTeams[index];
    }
    return comps.comps;
};

function putFullBldVM() {
    playerInfos.bldVM = [];
    playerInfos.bldVM.push('Soute');
    playerInfos.bldVM.push('Poste de pilotage');
    playerInfos.bldVM.push('Foyer');
    playerInfos.bldVM.push('Serres hydroponiques');
    playerInfos.bldVM.push('Cantine');
    playerInfos.bldVM.push('Générateur');
    playerInfos.bldVM.push('Crameur');
    playerInfos.bldVM.push('Dortoirs');
    playerInfos.bldVM.push('Station météo');
    playerInfos.bldVM.push('Vidéotéléphonie');
    playerInfos.bldVM.push('Unités cryogéniques');
    playerInfos.bldVM.push('Salle de conférence');
    playerInfos.bldVM.push('Salle de contrôle');
    playerInfos.bldVM.push('Salle de jeux');
    playerInfos.bldVM.push('Chapelle');
    playerInfos.bldVM.push('Atelier');
    playerInfos.bldVM.push('Armurerie');
    playerInfos.bldVM.push('Garage');
    playerInfos.bldVM.push('Caserne');
    playerInfos.bldVM.push('Caserne Rednecks');
    playerInfos.bldVM.push('Mine');
    playerInfos.bldVM.push('Pompe');
    playerInfos.bldVM.push('Derrick');
    playerInfos.bldVM.push('Comptoir');
    playerInfos.bldVM.push('Poudrière');
    playerInfos.bldVM.push('Chaîne de montage');
    playerInfos.bldVM.push('Usine');
    playerInfos.bldVM.push('Aérodocks');
    playerInfos.bldVM.push('Arsenal');
    playerInfos.bldVM.push('Usine d\'armement');
    playerInfos.bldVM.push('Infirmerie');
    playerInfos.bldVM.push('Hôpital');
    playerInfos.bldVM.push('Poste radio');
    playerInfos.bldVM.push('Centre de com');
    playerInfos.bldVM.push('QG');
    playerInfos.bldVM.push('Décharge');
    playerInfos.bldVM.push('Centre de tri');
    playerInfos.bldVM.push('Recyclab');
    playerInfos.bldVM.push('Laboratoire');
    playerInfos.bldVM.push('Centre de recherches');
    playerInfos.bldVM.push('Incinérateur');
    playerInfos.bldVM.push('Sonde géothermique');
    playerInfos.bldVM.push('Centrale nucléaire');
    playerInfos.bldVM.push('Centrale SMR');
    playerInfos.bldVM.push('Bar');
    playerInfos.bldVM.push('Prisons');
    playerInfos.bldVM.push('Salle de sport');
    playerInfos.bldVM.push('Camp d\'entraînement');
    playerInfos.bldVM.push('Cabines');
    playerInfos.bldVM.push('Jardin');
};

function putMissionLanderRes(navBat) {
    navBat.transRes = {};
    navBat.transRes['Explosifs'] = 200;
    navBat.transRes['Fer'] = 150;
    navBat.transRes['Plomb'] = 100;
    navBat.transRes['Titane'] = 50;
    navBat.transRes['Cuivre'] = 100;
    navBat.transRes['Electros'] = 50;
    navBat.transRes['Scrap'] = 200;
    navBat.transRes['Végétaux'] = 300;
    navBat.transRes['Nanite'] = 250;
    navBat.transRes['Tungstène'] = 150;
    navBat.transRes['Aluminium'] = 50;
    navBat.transRes['Compo1'] = 2500;
    navBat.transRes['Compo2'] = 1200;
    navBat.transRes['Compo3'] = 600;
    navBat.transRes['Batteries'] = 15;
    navBat.transRes['Energie'] = 200;
    navBat.transRes['Drogues'] = 1000;
    navBat.transRes['Zinc'] = 500;
    navBat.transRes['Or'] = 300;
    navBat.transRes['Mercure'] = 300;
    navBat.transRes['Hélium'] = 500;
    navBat.transRes['Plastanium'] = 300;
    navBat.transRes['Bore'] = 800;
    navBat.transRes['Octiron'] = 700;
    navBat.transRes['Huile'] = 500;
    navBat.transRes['Hydrogène'] = 300;
    navBat.transRes['Pyratol'] = 200;
    navBat.transRes['Fuel'] = 150;
    navBat.transRes['Azote'] = 300;
    navBat.transRes['Bois'] = 200;
    navBat.transRes['Eau'] = 300;
};

function putMissionAlienRes() {
    let pack = getResPack('missionpack');
    if (Object.keys(pack.res).length >= 1) {
        Object.entries(pack.res).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let min = Math.ceil(value/1.25);
            let max = Math.ceil(value*1.2);
            value = rand.rand(min,max);
            let res = getResByName(key);
            if (res.cat === 'alien') {
                playerInfos.alienRes[key] = value;
            }
        });
    }
};

function loadMission() {
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
    $('#conUnitList').append('<span class="constName or" id="gentils">JOUER UNE MISSION</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<select class="boutonGris" id="theStartZone" onchange="loadTheMissionBaby()"></select>');
    $('#theStartZone').empty().append('<option value="0" selected>Mission</option>');
    let i = 50;
    while (i <= 84) {
        let mType = getMissionType(i,true);
        if (playerInfos.misDB.includes(i)) {
            $('#theStartZone').append('<option value="'+i+'">'+i+' - '+mType.name+' ('+mType.title+')</option>');
        } else {
            $('#theStartZone').append('<option value="'+i+'" disabled>'+i+' - '+mType.name+' ('+mType.title+')</option>');
        }
        if (i > 84) {break;}
        i++
    }
    // $('#theStartZone').append('<option value="80" disabled>80 - Spiderblob</option>');
    // $('#theStartZone').append('<option value="83">83 - Spiderblob (Anansi)</option>');
    // $('#theStartZone').append('<option value="84">84 - Spiderblob (Shelob)</option>');
    // $('#theStartZone').append('<option value="75" disabled>75 - Dragonblob</option>');
    // $('#theStartZone').append('<option value="70" disabled>70 - Skygrub</option>');
    // $('#theStartZone').append('<option value="65" disabled>65 - Necroblob</option>');
    // $('#theStartZone').append('<option value="60">60 - Résistance (Tupamaros)</option>');
    // $('#theStartZone').append('<option value="61">61 - Résistance (L\'île noire)</option>');
    // $('#theStartZone').append('<option value="55" disabled>55 - Science</option>');
    // $('#theStartZone').append('<option value="50">50 - Trolley (Pluie d\'oeufs)</option>');
    // $('#theStartZone').append('<option value="51">51 - Trolley (Gehenna)</option>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="butSpace"></span>');
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function loadTheMissionBaby() {
    let selectorNum = document.getElementById("theStartZone").value;
    let missionNum = +selectorNum;
    playerInfos.missionZone = missionNum;
    moveMissionZone(missionNum);
    conOut(true);
    playerInfos.okFill = true;
    startMission(true);
};

function putMissionTitle() {
    if (playerInfos.pseudo === 'Mapedit') {
        if (zone[0].number != undefined) {
            let mission = getMissionByNum(zone[0].number);
            if (mission != undefined) {
                if (Object.keys(mission).length >= 1) {
                    mission.name = zone[0].title;
                }
            }
        }
    }
};

function updateMissionsInfo() {
    let misList = [];
    playerInfos.misInfo.forEach(function(mission) {
        misList.push(mission.num);
    });
    playerInfos.misDB.forEach(function(misNum) {
        if (!misList.includes(misNum)) {
            let newMis = {};
            newMis.num = misNum;
            newMis.name = '';
            playerInfos.misInfo.push(newMis);
        }
    });
    console.log(playerInfos.misInfo);
};
