function putMissionUnits() {
    putMissionStats();
    putFullBldVM();
    putMissionAlienRes();
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
    let missionBatList = getMissionBatList();
    missionBatList.forEach(function(slot) {
        unitNum++;
        let maxXP = 900;
        let minXP = Math.floor(maxXP*zone[0].mapDiff*zone[0].mapDiff*zone[0].mapDiff/2000);
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

function getMissionBatList() {
    let missionBatList = [];
    // determiner unité, munitions, armure, équipement
    let navName = 'Thundership';
    if (playerInfos.gLevel < 14) {
        navName = 'Navette de secours';
    }
    let newSlot = new SlotConstructor(navName,['titanium','xxx','aucun','e-mecano']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Rednecks',['uranium','uranium','wendium','chargeur']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Rednecks',['uranium','uranium','wendium','theeye']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Rednecks',['timonium','snake','swarwing','e-camo']);
    missionBatList.push(newSlot);
    if (playerInfos.gLevel >= 17) {
        newSlot = new SlotConstructor('Noise Angels',['disco','uranium','duneg','chargeur2']);
        missionBatList.push(newSlot);
    } else {
        newSlot = new SlotConstructor('Rednecks',['uranium','uranium','duneg','e-camo']);
        missionBatList.push(newSlot);
    }
    newSlot = new SlotConstructor('Barmen',['gliding','molotov-slime','wendium','lunette1']);
    missionBatList.push(newSlot);
    if (playerInfos.gLevel >= 14) {
        newSlot = new SlotConstructor('Marshalls',['explosive','salite','wendium','theeye']);
        missionBatList.push(newSlot);
    } else {
        newSlot = new SlotConstructor('Gangsters',['explosive','lame-carbone','swarwing','e-ranger']);
        missionBatList.push(newSlot);
    }
    newSlot = new SlotConstructor('Marshalls',['explosive','uranium','wendium','e-camo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Lucky bastards',['gliding','grenade','wendium','lancegren']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Lucky bastards',['gliding','grenade-gaz','duneg','e-camo']);
    missionBatList.push(newSlot);
    if (playerInfos.gLevel >= 14) {
        newSlot = new SlotConstructor('Lucky bastards',['timonium','grenade-gaz','wendium','lancegren']);
        missionBatList.push(newSlot);
    } else {
        newSlot = new SlotConstructor('Rednecks',['uranium','uranium','kevlar','chargeur']);
        missionBatList.push(newSlot);
    }
    newSlot = new SlotConstructor('Stalkers',['titanium','lame-carbone','wendium','lunette1']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Runners',['ac-uranium','grenade','duneg','detector']);
    missionBatList.push(newSlot);
    if (playerInfos.gLevel >= 14) {
        newSlot = new SlotConstructor('Runners',['ac-flechette','grenade-gaz','duneg','detector']);
        missionBatList.push(newSlot);
    }
    newSlot = new SlotConstructor('Infirmiers',['tungsten','xxx','kevlar','e-medic']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Infirmiers',['tungsten','xxx','kevlar','e-medic']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Infirmiers',['tungsten','xxx','swarwing','e-camo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Infirmiers',['tungsten','xxx','kevlar','e-camo']);
    missionBatList.push(newSlot);
    if (playerInfos.gLevel >= 14) {
        newSlot = new SlotConstructor('Riggers',['lame-carbone','gaz','duneg','w2-gaz']);
        missionBatList.push(newSlot);
    }
    newSlot = new SlotConstructor('Sapeurs',['tungsten','lame-carbone','duneg','e-road']);
    missionBatList.push(newSlot);
    if (playerInfos.gLevel >= 16) {
        newSlot = new SlotConstructor('Minitanks',['uranium','obus-heat','chobham','wstabkit']);
        missionBatList.push(newSlot);
    }
    newSlot = new SlotConstructor('Buggies',['uranium','lame-carbone','swag','w2-moisso']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Buggies',['timonium','lame-carbone','swag','w2-moisso']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Pickups',['explosive','molotov-feu','swag','snorkel']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Jeeps',['explosive','belier-spike','swag','e-road']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Jeeps',['explosive','belier-spike','chobham','e-road']);
    missionBatList.push(newSlot);
    if (playerInfos.gLevel >= 18) {
        newSlot = new SlotConstructor('Obusiers',['obus-heatseeker','uranium','bulk','longtom1']);
        missionBatList.push(newSlot);
    } else if (playerInfos.gLevel >= 14) {
        newSlot = new SlotConstructor('Obusiers',['obus-heat','uranium','bulk','carrousel1']);
        missionBatList.push(newSlot);
    }
    newSlot = new SlotConstructor('Bunkers',['snake','uranium','bulk','chargeur']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Poudrière',['pn-explosive','grenade','bulk','w2-explo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Infirmerie',['explosive','xxx','bulk','e-infra']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Tour de guet',['marquage','xxx','bulk','lunette']);
    missionBatList.push(newSlot);
    // console.log('MISSION BATS');
    // console.log(missionBatList);
    return missionBatList;
};

function SlotConstructor(theName,theGear) {
    this.name = theName;
    this.gear = theGear;
};

function putMissionStats() {
    playerInfos.gang = 'rednecks';
    playerInfos.gLevel = (zone[0].mapDiff*2)+5-playerInfos.gMode;
    // PA 4 = level 12
    // PA 5 = level 14
    // PA 6 = level 16
    // PA 7 = level 18
    // PA 8 = level 20
    let quinze = 0;
    let seize = 0;
    let dixsept = 0;
    let dixhuit = 0;
    if (playerInfos.gLevel >= 15) {quinze = 1;}
    if (playerInfos.gLevel >= 16) {seize = 1;}
    if (playerInfos.gLevel >= 17) {dixsept = 1;}
    if (playerInfos.gLevel >= 18) {dixhuit = 1;}
    playerInfos.comp = {};
    playerInfos.comp.aero = 0;
    playerInfos.comp.arti = 1;
    playerInfos.comp.tank = 1+quinze;
    playerInfos.comp.cyber = 1+dixsept;
    playerInfos.comp.robo = 0;
    playerInfos.comp.gen = 0;
    playerInfos.comp.cam = 1;
    playerInfos.comp.ca = 2;
    playerInfos.comp.const = 2;
    playerInfos.comp.energ = 0+dixsept;
    playerInfos.comp.train = 1;
    playerInfos.comp.ind = 1;
    playerInfos.comp.med = 0+quinze;
    playerInfos.comp.scaph = 1;
    if (zone[0].pid-2 > playerInfos.comp.scaph) {
        playerInfos.comp.scaph = zone[0].pid-2;
    }
    playerInfos.comp.tele = 0;
    playerInfos.comp.trans = 2+seize;
    playerInfos.comp.tri = 2;
    playerInfos.comp.vsp = 2;
    playerInfos.comp.mat = 2;
    playerInfos.comp.explo = 2+dixhuit;
    playerInfos.comp.exo = 0;
    playerInfos.comp.bal = 2+seize;
    playerInfos.comp.ordre = 0;
    playerInfos.comp.pyro = 1;
    playerInfos.comp.log = 2;
    playerInfos.comp.def = 2+dixhuit;
    playerInfos.comp.det = 3;
    playerInfos.comp.ext = 1;
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
    navBat.transRes['Plomb'] = 75;
    navBat.transRes['Titane'] = 50;
    navBat.transRes['Cuivre'] = 100;
    navBat.transRes['Electros'] = 50;
    navBat.transRes['Scrap'] = 200;
    navBat.transRes['Végétaux'] = 75;
    navBat.transRes['Nanite'] = 250;
    navBat.transRes['Tungstène'] = 150;
    navBat.transRes['Aluminium'] = 50;
    navBat.transRes['Compo1'] = 1250;
    navBat.transRes['Compo2'] = 600;
    navBat.transRes['Batteries'] = 15;
    navBat.transRes['Energie'] = 200;
    navBat.transRes['Drogues'] = 150;
    navBat.transRes['Zinc'] = 75;
    navBat.transRes['Or'] = 25;
    navBat.transRes['Hélium'] = 50;
    navBat.transRes['Bore'] = 50;
    navBat.transRes['Octiron'] = 250;
    navBat.transRes['Huile'] = 125;
    navBat.transRes['Hydrogène'] = 125;
    navBat.transRes['Pyratol'] = 200;
    navBat.transRes['Fuel'] = 50;
    navBat.transRes['Azote'] = 175;
    navBat.transRes['Bois'] = 50;
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
    $('#theStartZone').append('<option value="80" disabled>80 - Boss Spider</option>');
    $('#theStartZone').append('<option value="75" disabled>75 - Boss Bug</option>');
    $('#theStartZone').append('<option value="70" disabled>70 - Boss Larve</option>');
    $('#theStartZone').append('<option value="65" disabled>65 - Boss Swarm</option>');
    $('#theStartZone').append('<option value="60">60 - Résistance (Tupamaros)</option>');
    $('#theStartZone').append('<option value="61">61 - Résistance (L\'île noire)</option>'); // 27 Spins
    $('#theStartZone').append('<option value="55" disabled>55 - Science</option>'); // 150 spins
    $('#theStartZone').append('<option value="50">50 - Trolley (Pluie d\'oeufs)</option>'); // 68 à 180 Spins (136)
    $('#theStartZone').append('<option value="51">51 - Trolley (Gehenna)</option>'); // 68 à 180 Spins (136)
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
            mission.name = zone[0].title;
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
