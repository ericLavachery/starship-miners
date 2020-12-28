function gangNavig() {
    $('#gangInfos').empty();
    $('#gangInfos').append('<button type="button" title="Constriche" class="boutonBleu iconButtons" onclick="bfconst(`all`,true)"><i class="fa fa-hammer"></i></button>');
    $('#gangInfos').append('<button type="button" title="Ajouter un peu de chaque ressource" class="boutonBleu iconButtons" onclick="allResAdd(10)"><i class="fas fa-cart-plus"></i></button>');
    $('#gangInfos').append('<button type="button" title="Editer le Gang" class="boutonBleu iconButtons" onclick="gangEdit()"><i class="fas fa-users-cog"></i></button><br>');
    $('#gangInfos').append('<div class="shSpace"></div>');
    $('#gangInfos').append('<span class="butSpace"></span>');
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
    while (i <= 15) {
        if (i === playerInfos.mapDiff) {
            $('#theZone').append('<option value="'+i+'" selected>Présence '+i+'</option>');
        } else {
            $('#theZone').append('<option value="'+i+'">Présence '+i+'</option>');
        }
        if (i > 16) {break;}
        i++
    }
    $('#conUnitList').append('<span class="butSpace"></span>');
    // mapTurn
    $('#conUnitList').append('<select class="boutonGris" id="theTurn" onchange="changePlayerInfo(`theTurn`,`mapTurn`)"></select>');
    $('#theTurn').empty().append('<option value="">Tour</option>');
    i = 1;
    while (i <= 300) {
        $('#theTurn').append('<option value="'+i+'">Tour '+i+'</option>');
        if (i > 300) {break;}
        if (i === 1) {
            i = i+23;
        } else {
            i = i+25;
        }
    }

    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    // GANG
    $('#conUnitList').append('<select class="boutonGris" id="theGangs" onchange="changePlayerInfo(`theGangs`,`gang`)"></select>');
    $('#theGangs').empty().append('<option value="">Gang</option>');
    if (playerInfos.gang === 'rednecks') {
        $('#theGangs').append('<option value="rednecks" selected>Rednecks</option>');
    } else {
        $('#theGangs').append('<option value="rednecks">Rednecks</option>');
    }
    if (playerInfos.gang === 'blades') {
        $('#theGangs').append('<option value="blades" selected>Blades</option>');
    } else {
        $('#theGangs').append('<option value="blades">Blades</option>');
    }
    if (playerInfos.gang === 'bulbos') {
        $('#theGangs').append('<option value="bulbos" selected>Bulbos Kapos</option>');
    } else {
        $('#theGangs').append('<option value="bulbos">Bulbos Kapos</option>');
    }
    if (playerInfos.gang === 'drogmulojs') {
        $('#theGangs').append('<option value="drogmulojs" selected>Drogmulojs</option>');
    } else {
        $('#theGangs').append('<option value="drogmulojs">Drogmulojs</option>');
    }
    if (playerInfos.gang === 'tiradores') {
        $('#theGangs').append('<option value="tiradores" selected>Tiradores</option>');
    } else {
        $('#theGangs').append('<option value="tiradores">Tiradores</option>');
    }
    if (playerInfos.gang === 'detruas') {
        $('#theGangs').append('<option value="detruas" selected>Detruas</option>');
    } else {
        $('#theGangs').append('<option value="detruas">Detruas</option>');
    }
    if (playerInfos.gang === 'brasier') {
        $('#theGangs').append('<option value="brasier" selected>Le Brasier</option>');
    } else {
        $('#theGangs').append('<option value="brasier">Le Brasier</option>');
    }
    $('#conUnitList').append('<span class="butSpace"></span>');
    // GANG LEVEL
    $('#conUnitList').append('<select class="boutonGris" id="theLevels" onchange="changePlayerInfo(`theLevels`,`gLevel`)"></select>');
    $('#theLevels').empty().append('<option value="">Niveau de Gang</option>');
    i = 1;
    while (i <= 22) {
        if (playerInfos.gLevel === i) {
            $('#theLevels').append('<option value="'+i+'" selected>Niveau '+i+'</option>');
        } else {
            $('#theLevels').append('<option value="'+i+'">Niveau '+i+'</option>');
        }
        if (i > 25) {break;}
        i++
    }
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    let gangComp = maxGangComp();
    $('#conUnitList').append('<span class="constName">Max Compétences : '+toNiceString(gangComp)+'</span>');
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
    maxGangComp();
    savePlayerInfos();
    gangNavig();
};

function changeComp(dropMenuId,compName) {
    let value = document.getElementById(dropMenuId).value;
    playerInfos.comp[compName] = +value;
    maxGangComp();
    savePlayerInfos();
    gangNavig();
};

function allCompSelect() {
    compSelect('Génétique','gen',1);
    compSelect('Cybernétique','cyber',1);
    compSelect('Robotique','robo',1);
    compSelect('Aéronautique','aero',1);
    compSelect('Artillerie','arti',1);
    compSelect('Blindés','tank',1);
    compSelect('Construction','const',3);
    compSelect('Industrie','ind',3);
    compSelect('Energie','energ',4);
    compSelect('Extraction','ext',3);
    compSelect('Connaissance Alien','ca',5);
    compSelect('Médecine','med',3);
    compSelect('Défense','def',3);
    compSelect('Entraînement','train',2);
    compSelect('Camouflage','cam',3);
    compSelect('Transports','trans',3);
    compSelect('Logistique','log',3);
    compSelect('Scaphandres','scaph',3);
    compSelect('Détection','det',6);
    compSelect('Vols Spaciaux','vsp',4);
    compSelect('Téléportation','tele',3);
    compSelect('Balistique','bal',3);
    compSelect('Explosifs','explo',3);
    compSelect('Pyrotechnie','pyro',3);
    compSelect('Exochimie','exo',3);
    compSelect('Matériaux','mat',4);
    compSelect('Tri','tri',4);
    compSelect('Maintien de l\'ordre','ordre',3);
};

function compSelect(compName,compId,compMax) {
    $('#conUnitList').append('<select title="'+compName+' '+playerInfos.comp[compId]+'" class="boutonGris" id="'+compId+'" onchange="changeComp(`'+compId+'`,`'+compId+'`)"></select>');
    $('#'+compId).empty().append('<option value="">'+compId+'</option>');
    let i = 0;
    while (i <= compMax) {
        if (playerInfos.comp[compId] === i) {
            $('#'+compId).append('<option value="'+i+'" selected>'+compId+' '+i+'</option>');
        } else {
            $('#'+compId).append('<option value="'+i+'">'+compId+' '+i+'</option>');
        }
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

function maxGangComp() {
    let maxComp = [4,0];
    maxComp[0] = maxComp[0]+playerInfos.gLevel;
    if (playerInfos.gang === 'rednecks') {
        if (playerInfos.gLevel >= 3) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 6) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 10) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 13) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 16) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
    }
    if (playerInfos.gang === 'blades') {
        if (playerInfos.gLevel >= 3) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 6) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 9) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 11) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 13) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 15) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
    }
    if (playerInfos.gang === 'bulbos') {
        if (playerInfos.gLevel >= 3) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 6) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 8) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 10) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 12) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 14) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 16) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
    }
    if (playerInfos.gang === 'drogmulojs') {
        if (playerInfos.gLevel >= 3) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 6) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 10) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 13) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 16) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
    }
    if (playerInfos.gang === 'tiradores') {
        if (playerInfos.gLevel >= 3) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 6) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 10) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 13) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 16) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
    }
    if (playerInfos.gang === 'detruas') {
        if (playerInfos.gLevel >= 3) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 6) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 9) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 12) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 15) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
    }
    if (playerInfos.gang === 'brasier') {
        if (playerInfos.gLevel >= 3) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 6) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 8) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 11) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 13) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 16) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
    }
    if (playerInfos.gLevel >= 18) {
        maxComp[0] = maxComp[0]+1;
        maxComp[1] = maxComp[1]+1;
    }
    if (playerInfos.gLevel >= 20) {
        maxComp[0] = maxComp[0]+1;
        maxComp[1] = maxComp[1]+1;
    }
    if (playerInfos.gLevel >= 22) {
        maxComp[0] = maxComp[0]+1;
        maxComp[1] = maxComp[1]+1;
    }
    return maxComp;
};
