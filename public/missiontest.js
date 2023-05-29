function missionTest() {
    socket.emit('load-missions-teams',zone[0].number);
};

function putMissionUnits(missionTeams) {
    let mType = getMissionType(zone[0].number,false);
    putMissionStats(mType,missionTeams);
    putFullBldVM();
    putMissionAlienRes();
    putObjectifs(mType);
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

function putObjectifs(mType) {
    if (playerInfos.objectifs === undefined) {
        playerInfos.objectifs = {};
    }
    if (mType.nid === 'resist') {
        playerInfos.objectifs.resistance = 'actif';
        playerInfos.objectifs.trolley = 'none';
        playerInfos.objectifs.swarm = 'none';
        playerInfos.objectifs.science = 'none';
        playerInfos.objectifs.spider = 'none';
        playerInfos.objectifs.larve = 'none';
        playerInfos.objectifs.bug = 'none';
    }
    if (mType.nid === 'trolley') {
        playerInfos.objectifs.resistance = 'detruit';
        playerInfos.objectifs.trolley = 'actif';
        playerInfos.objectifs.swarm = 'none';
        playerInfos.objectifs.science = 'none';
        playerInfos.objectifs.spider = 'none';
        playerInfos.objectifs.larve = 'none';
        playerInfos.objectifs.bug = 'none';
    }
    if (mType.nid === 'necro') {
        playerInfos.objectifs.resistance = 'detruit';
        playerInfos.objectifs.trolley = 'detruit';
        playerInfos.objectifs.swarm = 'actif';
        playerInfos.objectifs.science = 'none';
        playerInfos.objectifs.spider = 'none';
        playerInfos.objectifs.larve = 'none';
        playerInfos.objectifs.bug = 'none';
    }
    if (mType.nid === 'science') {
        playerInfos.objectifs.resistance = 'detruit';
        playerInfos.objectifs.trolley = 'detruit';
        playerInfos.objectifs.swarm = 'detruit';
        playerInfos.objectifs.science = 'actif';
        playerInfos.objectifs.spider = 'none';
        playerInfos.objectifs.larve = 'none';
        playerInfos.objectifs.bug = 'none';
    }
    if (mType.nid === 'spider') {
        playerInfos.objectifs.resistance = 'detruit';
        playerInfos.objectifs.trolley = 'detruit';
        playerInfos.objectifs.swarm = 'detruit';
        playerInfos.objectifs.science = 'detruit';
        playerInfos.objectifs.spider = 'actif';
        playerInfos.objectifs.larve = 'none';
        playerInfos.objectifs.bug = 'none';
    }
    if (mType.nid === 'sky') {
        playerInfos.objectifs.resistance = 'detruit';
        playerInfos.objectifs.trolley = 'detruit';
        playerInfos.objectifs.swarm = 'detruit';
        playerInfos.objectifs.science = 'detruit';
        playerInfos.objectifs.spider = 'detruit';
        playerInfos.objectifs.larve = 'actif';
        playerInfos.objectifs.bug = 'none';
    }
    if (mType.nid === 'dragon') {
        playerInfos.objectifs.resistance = 'detruit';
        playerInfos.objectifs.trolley = 'detruit';
        playerInfos.objectifs.swarm = 'detruit';
        playerInfos.objectifs.science = 'detruit';
        playerInfos.objectifs.spider = 'detruit';
        playerInfos.objectifs.larve = 'detruit';
        playerInfos.objectifs.bug = 'actif';
    }
};

function getMissionType(misNum,forInfo) {
    let mType = {};
    mType.name = 'Normal';
    mType.nid = 'normal';
    mType.pa = 4;
    mType.boss = false;
    mType.title = getMissionTitle(misNum);
    if (misNum >= 90) {
        mType.name = 'Exil';
        mType.nid = 'exil';
        mType.pa = 1; // 4
    } else if (misNum >= 85) {
        mType.name = 'Spécial';
        mType.nid = 'special';
        mType.pa = 5.5; // 13
    } else if (misNum >= 80) {
        mType.name = 'Spiderblob';
        mType.nid = 'spider';
        mType.pa = 7; // 16
        mType.boss = true;
        if (!forInfo) {
            zone[0].pKind = 'spider';
            zone[0].gKind = 'spider';
            zone[0].sKind = 'spider';
        }
    } else if (misNum >= 75) {
        mType.name = 'Dragonblob';
        mType.nid = 'dragon';
        mType.pa = 8; // 18
        mType.boss = true;
        if (!forInfo) {
            zone[0].pKind = 'bug';
            zone[0].gKind = 'bug';
            zone[0].sKind = 'bug';
        }
    } else if (misNum >= 70) {
        mType.name = 'Skygrub';
        mType.nid = 'sky';
        mType.pa = 7.5; // 17
        mType.boss = true;
        if (!forInfo) {
            zone[0].pKind = 'larve';
            zone[0].gKind = 'larve';
            zone[0].sKind = 'larve';
        }
    } else if (misNum >= 65) {
        mType.name = 'Necroblob';
        mType.nid = 'necro';
        mType.pa = 6; // 14
        mType.boss = true;
        if (!forInfo) {
            zone[0].pKind = 'swarm';
            zone[0].gKind = 'swarm';
            zone[0].sKind = 'swarm';
        }
    } else if (misNum >= 60) {
        mType.name = 'Résistance';
        mType.nid = 'resist';
        mType.pa = 4.5; // 11
    } else if (misNum >= 55) {
        mType.name = 'Base Scientifique';
        mType.nid = 'science';
        mType.pa = 6.5; // 15
    } else if (misNum >= 50) {
        mType.name = 'Trolley';
        mType.nid = 'trolley';
        mType.pa = 5; // 12
    }
    return mType;
};

function getMissionTitle(misNum) {
    let title = 'Indéfini';
    // EXIL
    if (misNum === 99) {title = 'Douves';}
    if (misNum === 98) {title = 'Ville';}
    if (misNum === 97) {title = 'Chemins';}
    if (misNum === 96) {title = '';}
    if (misNum === 95) {title = '';}
    if (misNum === 94) {title = '';}
    if (misNum === 93) {title = 'Le Grand Tour';}
    if (misNum === 92) {title = 'Tenir';}
    if (misNum === 91) {title = 'Grenouilles';}
    if (misNum === 90) {title = 'Place Forte';}
    // SPIDERBLOB
    if (misNum === 84) {title = 'Shelob';}
    if (misNum === 83) {title = 'Anansi';}
    if (misNum === 82) {title = '';}
    if (misNum === 81) {title = '';}
    if (misNum === 80) {title = '';}
    // DRAGONBLOB
    if (misNum === 79) {title = '';}
    if (misNum === 78) {title = '';}
    if (misNum === 77) {title = '';}
    if (misNum === 76) {title = '';}
    if (misNum === 75) {title = '';}
    // SKYGRUB
    if (misNum === 74) {title = '';}
    if (misNum === 73) {title = '';}
    if (misNum === 72) {title = '';}
    if (misNum === 71) {title = '';}
    if (misNum === 70) {title = '';}
    // NECROBLOB
    if (misNum === 69) {title = 'Zatchlas';}
    if (misNum === 68) {title = '';}
    if (misNum === 67) {title = '';}
    if (misNum === 66) {title = '';}
    if (misNum === 65) {title = '';}
    // RESISTANCE
    if (misNum === 64) {title = '';}
    if (misNum === 63) {title = '';}
    if (misNum === 62) {title = '';}
    if (misNum === 61) {title = 'L\'île noire';}
    if (misNum === 60) {title = 'Tupamaros';}
    // SCIENTIFIQUES
    if (misNum === 59) {title = '';}
    if (misNum === 58) {title = '';}
    if (misNum === 57) {title = '';}
    if (misNum === 56) {title = '';}
    if (misNum === 55) {title = 'Concordia';}
    // TROLLEY
    if (misNum === 54) {title = '';}
    if (misNum === 53) {title = '';}
    if (misNum === 52) {title = '';}
    if (misNum === 51) {title = 'Gehenna';}
    if (misNum === 50) {title = 'Pluie d\'oeufs';}
    if (title === '') {
        title = 'Indéfini';
    }
    return title;
};
