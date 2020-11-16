function gangNavig() {
    $('#gangInfos').empty();
    $('#gangInfos').append('<button type="button" title="Editer" class="boutonGris iconButtons" onclick="gangEdit()"><i class="fas fa-users-cog"></i></button><br>');
    $('#gangInfos').append(capitalizeFirstLetter(playerInfos.gang));
    $('#gangInfos').append(' '+playerInfos.gLevel+'<br>');
};

function gangEdit() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","600px");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br><br>');
    $('#conUnitList').append('<span class="blockTitle"><h3>Player Infos</h3></span>');
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    // mapDiff
    $('#conUnitList').append('<select class="boutonGris" id="theZone" onchange="changePlayerInfo(`theZone`,`mapDiff`)"></select>');
    $('#theZone').empty().append('<option value="">Présence Alien</option>');
    let i = 0;
    while (i <= 11) {
        $('#theZone').append('<option value="'+i+'">'+i+'</option>');
        if (i > 12) {break;}
        i++
    }
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    // GANG
    $('#conUnitList').append('<select class="boutonGris" id="theGangs" onchange="changePlayerInfo(`theGangs`,`gang`)"></select>');
    $('#theGangs').empty().append('<option value="">Gang</option>');
    $('#theGangs').append('<option value="rednecks">Rednecks</option>');
    $('#theGangs').append('<option value="blades">Blades</option>');
    $('#theGangs').append('<option value="bulbos">Bulbos Kapos</option>');
    $('#theGangs').append('<option value="drogmulojs">Drogmulojs</option>');
    $('#theGangs').append('<option value="tiradores">Tiradores</option>');
    $('#theGangs').append('<option value="detruas">Detruas</option>');
    $('#theGangs').append('<option value="brasier">Le Brasier</option>');
    $('#conUnitList').append('<span class="butSpace"></span>');
    // GANG LEVEL
    $('#conUnitList').append('<select class="boutonGris" id="theLevels" onchange="changePlayerInfo(`theLevels`,`gLevel`)"></select>');
    $('#theLevels').empty().append('<option value="">Niveau de Gang</option>');
    i = 1;
    while (i <= 22) {
        $('#theLevels').append('<option value="'+i+'">'+i+'</option>');
        if (i > 25) {break;}
        i++
    }
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    // COMPETENCES
    allCompSelect();
    // dark
    // $('#conUnitList').append('<select class="boutonGris" id="theDark" onchange="changePlayerInfo(`theDark`,`dark`)"></select>');
    // $('#theDark').empty().append('<option value="false">Type de Zone</option>');
    // $('#theDark').append('<option value="false">Normale</option>');
    // $('#theDark').append('<option value="true">Sombre</option>');
};

function changePlayerInfo(dropMenuId,infoName) {
    let value = document.getElementById(dropMenuId).value;
    if (value === 'true') {
        playerInfos[infoName] = true;
    } else if (value === 'false') {
        playerInfos[infoName] = false;
    } else if (isNaN(value)) {
        playerInfos[infoName] = value;
    } else {
        playerInfos[infoName] = +value;
    }
    savePlayerInfos();
    gangNavig();
};

function changeComp(dropMenuId,compName) {
    let value = document.getElementById(dropMenuId).value;
    playerInfos.comp[compName] = +value;
    savePlayerInfos();
    gangNavig();
};

function allCompSelect() {
    compSelect('Aéro','aero',1);
    compSelect('Artillerie','arti',1);
    compSelect('Blindés','tank',1);
    compSelect('Cyber','cyber',1);
    compSelect('Génétique','gen',1);
    compSelect('Robots','robo',1);
    compSelect('Défense','def',3);
    compSelect('Energie','energ',4);
    compSelect('Industrie','ind',3);
    compSelect('Extraction','ext',3);
    compSelect('Tri','tri',2);
    compSelect('Transports','trans',3);
    compSelect('Construction','const',3);
    compSelect('Logistique','log',3);
    compSelect('CA','ca',5);
    compSelect('Médecine','med',3);
    compSelect('Détection','det',6);
    compSelect('Camouflage','cam',3);
    compSelect('Entraînement','train',2);
    compSelect('Téléportation','tele',2);
    compSelect('Vols Spaciaux','vsp',4);
    compSelect('Explosifs','explo',3);
    compSelect('Pyrotechnie','pyro',3);
    compSelect('Balistique','bal',3);
    compSelect('Matériaux','mat',4);
    compSelect('Exochimie','exo',3);
    compSelect('Scaphandres','scaph',3);
    compSelect('Gouvernance','ordre',3);
};

function compSelect(compName,compId,compMax) {
    $('#conUnitList').append('<select title="'+compName+' '+playerInfos.comp[compId]+'" class="boutonGris" id="'+compId+'" onchange="changeComp(`'+compId+'`,`'+compId+'`)"></select>');
    $('#'+compId).empty().append('<option value="">'+compName+'</option>');
    let i = 0;
    while (i <= compMax) {
        $('#'+compId).append('<option value="'+i+'">'+i+'</option>');
        if (i > 10) {break;}
        i++
    }
};

function resetComp() {
    let comp = {};
    comp.aero = 0;
    comp.arti = 0;
    comp.tank = 0;
    comp.cyber = 0;
    comp.gen = 0;
    comp.robo = 0;
    comp.cam = 0;
    comp.ca = 0;
    comp.const = 0;
    comp.def = 0;
    comp.det = 0;
    comp.energ = 0;
    comp.train = 0;
    comp.ext = 0;
    comp.ind = 0;
    comp.med = 0;
    comp.scaph = 0;
    comp.tele = 0;
    comp.trans = 0;
    comp.tri = 0;
    comp.vsp = 0;
    comp.mat = 0;
    comp.explo = 0;
    comp.exo = 0;
    comp.bal = 0;
    comp.ordre = 0;
    comp.pyro = 0;
    comp.log = 0;
    return comp;
};

function playerSkillsUTChanges() {
    unitTypes.forEach(function(unit) {
        // CONSTRUCTION
        if (unit.mecanoCost < 90) {
            if (playerInfos.comp.const === 2) {
                unit.mecanoCost = unit.mecanoCost-1;
            }
            if (playerInfos.comp.const === 3) {
                unit.mecanoCost = unit.mecanoCost-2;
            }
            if (unit.mecanoCost < 2) {
                unit.mecanoCost = 2;
            }
        }
        if (playerInfos.comp.const >= 1 && unit.kind === 'zero-construction') {
            unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.const*2);
            if (unit.levels[playerInfos.gang] < 1) {
                unit.levels[playerInfos.gang] = 1;
            }
        }
        // DEFENSE
        if (playerInfos.comp.def >= 1 && unit.kind === 'zero-defense') {
            unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.def);
            if (unit.levels[playerInfos.gang] < 1) {
                unit.levels[playerInfos.gang] = 1;
            }
        }
        if (playerInfos.comp.def >= 1 && unit.cat === 'buildings') {
            unit.armor = unit.armor+Math.round(playerInfos.comp.def*1.2);
        }
        if (playerInfos.comp.def >= 3 && unit.skills.includes('garde')) {
            unit.armor = unit.armor+2;
            if (Object.keys(unit.weapon).length >= 3) {
                unit.weapon.rof = Math.ceil(unit.weapon.rof*1.5);
            }
            if (Object.keys(unit.weapon2).length >= 3) {
                unit.weapon2.rof = Math.ceil(unit.weapon2.rof*1.5);
            }
        }
        if (playerInfos.comp.def >= 1 && (unit.cat === 'buildings' || unit.cat === 'devices')) {
            if (Object.keys(unit.weapon).length >= 3) {
                unit.weapon.rof = Math.ceil(unit.weapon.rof*(playerInfos.comp.def+8)/8);
            }
            if (Object.keys(unit.weapon2).length >= 3) {
                unit.weapon2.rof = Math.ceil(unit.weapon2.rof*(playerInfos.comp.def+8)/8);
            }
        }
        // ENERGIE
        if (playerInfos.comp.energ >= 1) {
            if (Object.keys(unit.weapon).length >= 3) {
                if (unit.weapon.name.includes('plasma')) {
                    unit.weapon.power = Math.ceil(unit.weapon.power*(playerInfos.comp.energ+15)/15);
                }
            }
            if (Object.keys(unit.weapon2).length >= 3) {
                if (unit.weapon2.name.includes('plasma')) {
                    unit.weapon2.power = Math.ceil(unit.weapon2.power*(playerInfos.comp.energ+15)/15);
                }
            }
        }
        // EXTRACTION
        if (playerInfos.comp.ext >= 1 && unit.kind === 'zero-extraction') {
            unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.ext);
            if (unit.levels[playerInfos.gang] < 1) {
                unit.levels[playerInfos.gang] = 1;
            }
        }
        // TRANSPORTS
        if (playerInfos.comp.trans >= 1 && unit.kind === 'zero-transports') {
            unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.trans);
            if (unit.levels[playerInfos.gang] < 1) {
                unit.levels[playerInfos.gang] = 1;
            }
        }
        // VOLS SPACIAUX
        if (playerInfos.comp.vsp >= 2 && unit.kind === 'zero-vaisseaux' && unit.name != 'Liberator' && unit.name != 'Crusader') {
            unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.vsp-1);
            if (unit.levels[playerInfos.gang] < 1) {
                unit.levels[playerInfos.gang] = 1;
            }
        }
        // CAMOUFLAGE
        if (playerInfos.comp.cam >= 1 && unit.skills.includes('maycamo') && unit.cat === 'infantry') {
            unit.skills.push('camo');
        }
        if (playerInfos.comp.cam >= 2 && unit.skills.includes('maycamo') && (unit.cat === 'vehicles' || unit.cat === 'devices')) {
            unit.skills.push('camo');
        }
        if (playerInfos.comp.cam >= 3 && unit.skills.includes('maycamo') && unit.cat === 'buildings') {
            unit.skills.push('camo');
        }
        // MEDECINE
        if (playerInfos.comp.med >= 1 && unit.kind === 'zero-medecine') {
            unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.med);
            if (unit.levels[playerInfos.gang] < 1) {
                unit.levels[playerInfos.gang] = 1;
            }
        }
        if (unit.mediCost < 90) {
            if (playerInfos.comp.med === 2) {
                unit.mediCost = unit.mediCost-1;
            }
            if (playerInfos.comp.med === 3) {
                unit.mediCost = Math.ceil(unit.mediCost/2);
            }
            if (unit.mediCost < 2) {
                unit.mediCost = 2;
            }
        }
    });
};
