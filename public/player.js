function voirBataillons() {
    showResOpen = true;
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="shSpace"></span><br>');
    $('#conUnitList').append('<span class="blockTitle"><h3>Bataillons</h3></span>');
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    let sortedBatList = _.sortBy(_.sortBy(bataillons,'id'),'type');
    sortedBatList.forEach(function(bat) {
        let batType = getBatType(bat);
        if (!batType.skills.includes('nolist')) {
            let batColor = 'ciel';
            if (batType.cat === 'buildings' || batType.cat === 'devices') {
                batColor = 'brun';
            }
            if (bat.loc != 'zone') {
                batColor = 'bleu';
            }
            if (selectedBat != undefined) {
                if (selectedBat.id === bat.id) {
                    $('#conUnitList').append('<span class="ListRes hrouge">>>></span>&nbsp;');
                }
            }
            $('#conUnitList').append('<span class="ListRes '+batColor+' klik" onclick="warnLink('+bat.tileId+',true,'+batType.id+')">'+bat.type+'</span>&nbsp;&nbsp;');
            if (bat.army >= 1) {
                $('#conUnitList').append('<span class="ListRes gff" title="Armée">('+bat.army+')</span>&nbsp;&nbsp;');
            }
            if (bat.vet >= 1) {
                $('#conUnitList').append('<img src="/static/img/vet'+bat.vet+'.png" width="10">&nbsp;&nbsp;');
            }
            if (bat.damage >= 1 || bat.squadsLeft < batType.squads) {
                $('#conUnitList').append('<span class="ListRes" title="Blessé"><i class="ra ra-bleeding-hearts"></i></span>&nbsp;&nbsp;');
            }
            if (bat.tags.includes('parasite') || bat.tags.includes('venin') || bat.tags.includes('poison') || bat.tags.includes('necro')) {
                $('#conUnitList').append('<span class="ListRes" title="Empoisonné"><i class="fas fa-skull-crossbones"></i></span>&nbsp;&nbsp;');
            }
            if (bat.tags.includes('maladie')) {
                $('#conUnitList').append('<span class="ListRes" title="Malade"><i class="fas fa-thermometer"></i></span>&nbsp;&nbsp;');
            }
            if (bat.emo >= 11) {
                let stress = bat.emo-10;
                if (bat.tags.includes('bliss') || bat.tags.includes('octiron') || bat.tags.includes('fanatic')) {
                    $('#conUnitList').append('<span class="ListRes gff" title="Stress '+stress+' (traité)"><i class="fas fa-ghost"></i></span>&nbsp;&nbsp;');
                } else {
                    $('#conUnitList').append('<span class="ListRes" title="Stress '+stress+'"><i class="fas fa-ghost"></i></span>&nbsp;&nbsp;');
                }
            }
            $('#conUnitList').append('<br>');
        }
    });
    $('#conUnitList').append('<span class="shSpace"></span><br>');
    $('#conUnitList').append('<span class="blockTitle"><h3>Aliens</h3></span>');
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    let sortedAlienList = _.sortBy(_.sortBy(aliens,'id'),'type');
    sortedAlienList.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.class === 'A' || batType.class === 'S' || batType.class === 'X') {
            if (!batType.skills.includes('invisible') && !bat.tags.includes('invisible')) {
                let batColor = 'ciel';
                if (batType.class === 'S') {
                    batColor = 'cy';
                }
                if (batType.class === 'X') {
                    if (batType.kind === 'egg') {
                        batColor = 'rouge';
                    } else {
                        batColor = 'brun';
                    }
                }
                let isVisible = true;
                if (zone[0].dark && !undarkNow.includes(bat.tileId) && !bat.tags.includes('fluo')) {
                    isVisible = checkEggInDark(bat.tileId);
                }
                let nv = nomVisible(bat);
                if (isVisible) {
                    $('#conUnitList').append('<span class="ListRes '+batColor+' klik" onclick="warnLink('+bat.tileId+',false)">'+nv+'</span>&nbsp;&nbsp;');
                    if (bat.damage >= 1 || bat.squadsLeft < batType.squads) {
                        $('#conUnitList').append('<span class="ListRes" title="Blessé"><i class="ra ra-bleeding-hearts"></i></span>&nbsp;&nbsp;');
                    }
                    if (bat.tags.includes('poison') || bat.tags.includes('shinda')) {
                        $('#conUnitList').append('<span class="ListRes" title="Empoisonné"><i class="fas fa-skull-crossbones"></i></span>&nbsp;&nbsp;');
                    }
                    if (bat.tags.includes('stun')) {
                        $('#conUnitList').append('<span class="ListRes" title="Stun"><i class="fas fa-thermometer"></i></span>&nbsp;&nbsp;');
                    }
                    $('#conUnitList').append('<br>');
                } else if (playerInfos.vue >= 4) {
                    $('#conUnitList').append('<span class="ListRes '+batColor+'">'+nv+' <span class="gff">(emplacement inconnu)</span></span>&nbsp;&nbsp;');
                    $('#conUnitList').append('<br>');
                }
            }
        }
    });
    // $("#conUnitList").animate({scrollTop:0},"fast");
};

function gangEdit() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","600px");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="blockTitle"><h3>Player Infos</h3></span>');
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    // sondeDanger (mapDiff)
    $('#conUnitList').append('<select class="boutonGris" id="theZone" onchange="changePlayerInfo(`theZone`,`sondeDanger`)" title="Présence Alien sur la prochaine zone"></select>');
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
    $('#conUnitList').append('<span class="butSpace"></span>');
    // mapTurn
    $('#conUnitList').append('<select class="boutonGris" id="theTurn" onchange="changePlayerInfo(`theTurn`,`mapTurn`)"></select>');
    $('#theTurn').empty().append('<option value="">Tour</option>');
    $('#theTurn').append('<option value="0">Tour 0</option>');
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
    if (playerInfos.stopBarbs) {
        $('#conUnitList').append('<button type="button" title="Ne pas stopper pour les barbelés" class="boutonGris skillButtons" onclick="changeBarbs(false)"><i class="ra ra-crown-of-thorns rpg"></i> stop</button>');
    } else {
        $('#conUnitList').append('<button type="button" title="Stopper pour les barbelés" class="boutonGris skillButtons" onclick="changeBarbs(true)"><i class="ra ra-crown-of-thorns rpg"></i> no stop</button>');
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
    i = 0;
    while (i <= 23) {
        if (playerInfos.gLevel === i) {
            $('#theLevels').append('<option value="'+i+'" selected>Niveau '+i+'</option>');
        } else {
            $('#theLevels').append('<option value="'+i+'">Niveau '+i+'</option>');
        }
        if (i > 25) {break;}
        i++
    }
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    let maxGangComp = maxGangCompCosts();
    $('#conUnitList').append('<span class="constName">Max Compétences : '+toNiceString(maxGangComp)+'</span>');
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    // COMPETENCES
    allCompSelect();
    $('#conUnitList').append('<br><span class="shSpace"></span><br>');
    let totalGangComp = getTotalCompCosts();
    $('#conUnitList').append('<span class="constName">Total Compétences : '+toNiceString(totalGangComp)+'</span>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function changeBarbs(stop) {
    playerInfos.stopBarbs = stop;
    // savePlayerInfos();
    gangNavig();
    gangEdit();
};

function changePlayerInfo(dropMenuId,infoName,from) {
    console.log(dropMenuId);
    console.log(infoName);
    console.log(from);
    let value = document.getElementById(dropMenuId).value;
    console.log(value);
    if (infoName === 'mapTurn' && value === "0") {
        playerInfos.para = calcParaNum();
    }
    if (infoName === 'sondeRes') {
        let arNum = dropMenuId.replace("theRes","");
        arNum = +arNum;
        playerInfos.sondeRes[arNum] = value;
    } else {
        if (value === 'true') {
            playerInfos[infoName] = true;
        } else if (value === 'false') {
            playerInfos[infoName] = false;
        } else if (isNaN(value)) {
            playerInfos[infoName] = value;
        } else {
            playerInfos[infoName] = +value;
        }
    }
    if (infoName === 'sondePlanet') {
        if (playerInfos.sondePlanet === 1) {
            playerInfos.sondeDanger = getDoom(true);
        } else {
            if (playerInfos.sondeDanger < 4) {
                playerInfos.sondeDanger = 4;
            }
        }
    }
    console.log('infoName');
    console.log(infoName);
    console.log(from);
    if (from === 'gangChoice') {
        if (infoName === 'gang') {
            playerInfos.gangDef = true;
            if (playerInfos.gang === undefined) {
                playerInfos.gang = 'rednecks';
            }
            if (playerInfos.gMode === undefined) {
                playerInfos.gMode = 2;
            } else {
                if (playerInfos.gMode < 1 || playerInfos.gMode > 4) {
                    playerInfos.gMode = 2;
                }
            }
            if (playerInfos.missionZone === undefined) {
                playerInfos.missionZone = 99;
                playerInfos.missionPlanet = 1;
            } else {
                if (playerInfos.missionZone < 90) {
                    playerInfos.missionZone = 99;
                    playerInfos.missionPlanet = 1;
                }
            }
            if (playerInfos.gang === 'rednecks' && playerInfos.comp.ext === 0) {
                playerInfos.comp.ext = 1;
            }
            if (playerInfos.gang === 'drogmulojs' && playerInfos.comp.tri === 0) {
                playerInfos.comp.tri = 1;
            }
            if (playerInfos.gang === 'bulbos' && playerInfos.comp.det === 0) {
                playerInfos.comp.det = 1;
            }
            if (playerInfos.gang === 'detruas' && playerInfos.comp.explo === 0) {
                playerInfos.comp.explo = 1;
            }
            if (playerInfos.gang === 'brasier' && playerInfos.comp.pyro === 0) {
                playerInfos.comp.pyro = 1;
            }
            if (playerInfos.gang === 'tiradores' && playerInfos.comp.bal === 0) {
                playerInfos.comp.bal = 1;
            }
            if (playerInfos.gang === 'blades' && playerInfos.comp.cam === 0) {
                playerInfos.comp.cam = 1;
            }
            moveMissionZone(playerInfos.missionZone);
            conOut(true);
            commandes();
        }
    } else if (from === 'sonde') {
        editSonde();
        commandes();
    } else {
        maxGangCompCosts();
        gangNavig();
        gangEdit();
    }
};

function changeComp(dropMenuId,compName) {
    let value = document.getElementById(dropMenuId).value;
    playerInfos.comp[compName] = +value;
    maxGangCompCosts();
    // savePlayerInfos();
    gangNavig();
    gangEdit();
};

function allCompSelect() {
    gangComps.forEach(function(gc) {
        compSelect(gc);
    });
};

function compSelect(gc) {
    // console.log(gc);
    if (gc.levels[playerInfos.gang] > playerInfos.gLevel) {
        $('#conUnitList').append('<select title="'+gc.fullName+' '+playerInfos.comp[gc.name]+'" class="boutonGris" id="'+gc.name+'" onchange="changeComp(`'+gc.name+'`,`'+gc.name+'`)"></select>');
        $('#'+gc.name).empty().append('<option value="" disabled>'+gc.name+'</option>');
    } else {
        $('#conUnitList').append('<select title="'+gc.fullName+' '+playerInfos.comp[gc.name]+'" class="boutonGris" id="'+gc.name+'" onchange="changeComp(`'+gc.name+'`,`'+gc.name+'`)"></select>');
        $('#'+gc.name).empty().append('<option value="">'+gc.name+'</option>');
        let showCost = '';
        let i = 0;
        while (i <= gc.maxLevel) {
            if (gc.lvlCosts[i] === 2) {
                showCost = ' (2)';
            } else {
                showCost = '';
            }
            if (playerInfos.comp[gc.name] === i) {
                $('#'+gc.name).append('<option value="'+i+'" selected>'+gc.name+' '+i+' '+showCost+'</option>');
            } else {
                $('#'+gc.name).append('<option value="'+i+'">'+gc.name+' '+i+' '+showCost+'</option>');
            }
            if (i > 10) {break;}
            i++
        }
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

function playerSkillsUTAmmos() {
    // Système pour les munitions
    // wsys = 'fa' dans UnitTypes
    // wsys = ['fa','carab','blast'] dans AmmoTypes
    // loop ammos: create ammoLists.carab = ['titanium','standard','salite']
    // loop units: unit.weapon2.ammos = ammoLists[unit.weapon2.wsys]
};

function allowedArmors(unit) {
    let protection = [];
    if (unit.skills.includes('a_light') || unit.skills.includes('a_mid') || unit.skills.includes('a_heavy')) {
        protection.push('aucune');
        protection.push('scrap');
        protection.push('kevlar');
        if (!unit.skills.includes('dreduct')) {
            protection.push('swarwing');
        }
    }
    if (unit.skills.includes('a_heavy')) {
        protection.push('acier');
    }
    if (unit.skills.includes('a_mid') || unit.skills.includes('a_heavy')) {
        protection.push('composite');
        protection.push('bugium');
        protection.push('titane');
    }
    if (unit.skills.includes('a_light') || unit.skills.includes('a_mid') || unit.skills.includes('a_heavy')) {
        if (!unit.skills.includes('resistfeu')) {
            protection.push('kapton');
        }
        if (!unit.skills.includes('resistacide')) {
            protection.push('wendium');
        }
        protection.push('nano');
        protection.push('soap');
    }
    if (unit.skills.includes('a_mid') || unit.skills.includes('a_heavy')) {
        if (!unit.skills.includes('resistall') && !unit.skills.includes('protectall')) {
            protection.push('combo');
        }
        if (!unit.skills.includes('dog')) {
            protection.push('porcupine');
            protection.push('blowfish');
        }
        protection.push('silk');
        protection.push('kaptane');
        protection.push('adplate');
        protection.push('dragscale');
    }
    if (unit.skills.includes('a_heavy')) {
        protection.push('hplate');
    }
    if (unit.skills.includes('a_light') || unit.skills.includes('a_mid') || unit.skills.includes('a_heavy')) {
        if (!unit.skills.includes('resistall') && !unit.skills.includes('protectall')) {
            protection.push('duneg');
        }
        protection.push('tisal');
        protection.push('swing');
        protection.push('adamantite');
        if (!unit.skills.includes('fly') && !unit.skills.includes('dog') && !unit.skills.includes('moto')) {
            protection.push('battlesuit');
            protection.push('turbosuit');
            protection.push('medsuit');
        }
    }
    if (unit.skills.includes('a_heavy')) {
        protection.push('aegis');
    }
    if (unit.skills.includes('a_rob')) {
        protection.push('aucun');
        if (!unit.skills.includes('resistelec')) {
            protection.push('iso');
        }
        protection.push('chobham');
        protection.push('nano');
        protection.push('soap');
        if (!unit.skills.includes('resistall')) {
            protection.push('duneg');
        }
        protection.push('swing');
        protection.push('tisal');
    }
    if (unit.skills.includes('a_cyb')) {
        protection.push('aucune');
        if (!unit.skills.includes('resistelec')) {
            protection.push('iso');
        }
        protection.push('chobham');
        protection.push('soap');
        if (!unit.skills.includes('resistall') && !unit.skills.includes('protectall')) {
            protection.push('duneg');
        }
    }
    if (unit.skills.includes('a_elga')) {
        protection.push('aucune');
        protection.push('chobham');
        protection.push('battlesuit');
        protection.push('turbosuit');
        protection.push('medsuit');
    }

    if (unit.skills.includes('b_light') || unit.skills.includes('b_mid') || unit.skills.includes('b_heavy')) {
        protection.push('aucun');
        protection.push('scrap');
        protection.push('kanchan');
        protection.push('chobham');
    }
    if (unit.skills.includes('b_heavy')) {
        protection.push('acier');
    }
    if (unit.skills.includes('b_mid') || unit.skills.includes('b_heavy')) {
        protection.push('composite');
        protection.push('bugium');
        protection.push('titane');
    }
    if (unit.skills.includes('b_light') || unit.skills.includes('b_mid') || unit.skills.includes('b_heavy')) {
        if (!unit.skills.includes('resistelec')) {
            protection.push('iso');
        }
        protection.push('soap');
        if (!unit.skills.includes('resistacide')) {
            protection.push('swag');
        }
    }
    if (unit.skills.includes('b_mid') || unit.skills.includes('b_heavy')) {
        if (!unit.skills.includes('resistfeu')) {
            protection.push('bonibo');
        }
        protection.push('silk');
        protection.push('adplate');
        protection.push('dragscale');
    }
    if (unit.skills.includes('b_heavy')) {
        if (!unit.skills.includes('resistall') && !unit.skills.includes('protectall')) {
            protection.push('bulk');
            protection.push('sbulk');
        }
    }
    if (unit.skills.includes('b_light') || unit.skills.includes('b_mid') || unit.skills.includes('b_heavy')) {
        protection.push('tisal');
        protection.push('rhodu');
        protection.push('autorep');
        protection.push('adamantite');
    }
    if (unit.cat === 'buildings') {
        protection.push('aucun');
        protection.push('bugium');
        protection.push('acier');
        protection.push('titane');
        if (!unit.skills.includes('resistelec')) {
            protection.push('iso');
        }
        if (!unit.skills.includes('resistall') && !unit.skills.includes('protectall')) {
            protection.push('bulk');
            protection.push('sbulk');
        }
        if (!unit.skills.includes('resistacide')) {
            protection.push('swag');
        }
        if (!unit.skills.includes('resistfeu')) {
            protection.push('bonibo');
        }
        protection.push('tisal');
        protection.push('autorep');
        protection.push('adamantite');
    }
    if (unit.skills.includes('b_dev')) {
        protection.push('aucun');
        if (!unit.skills.includes('resistelec')) {
            protection.push('iso');
        }
        if (!unit.skills.includes('resistall') && !unit.skills.includes('protectall')) {
            protection.push('bulk');
            protection.push('sbulk');
        }
        if (!unit.skills.includes('resistacide')) {
            protection.push('swag');
        }
        if (!unit.skills.includes('resistfeu')) {
            protection.push('bonibo');
        }
        protection.push('autorep');
        protection.push('adamantite');
    }
    if (unit.skills.includes('b_none')) {
        protection.push('aucun');
    }
    if (unit.skills.includes('b_barb')) {
        protection.push('aucun');
        protection.push('acier');
        protection.push('bbulk');
    }
    if (unit.skills.includes('b_lander')) {
        protection.push('aucun');
        protection.push('duneg-vsp');
        protection.push('autorep-vsp');
    }
    return protection;
};

function alienUnitsChanges() {
    // UTC for aliens
    alienUnits.forEach(function(unit) {
        unit.team = 'aliens';
        unit.hp = Math.round(unit.hp*alienHPBase);
        if (Object.keys(unit.weapon).length >= 3) {
            if (unit.weapon.isMelee) {
                unit.weapon.rof = Math.ceil(unit.weapon.rof*alienMeleeROF);
            }
            unit.weapon.accuracy = unit.weapon.accuracy+alienHitBase;
        }
        if (Object.keys(unit.weapon2).length >= 3) {
            if (unit.weapon2.isMelee) {
                unit.weapon2.rof = Math.ceil(unit.weapon2.rof*alienMeleeROF);
            }
            unit.weapon2.accuracy = unit.weapon2.accuracy+alienHitBase;
        }
    });
};

function resistanceUpgrade() {
    let rebUnit = getBatTypeByName('Rebelles');
    let resUnit = getBatTypeByName('Résistants');
    let rebTransUnit = getBatTypeByName('Rednecks');
    let resTransUnit = getBatTypeByName('Stalkers');
    if (playerInfos.gang === 'blades') {
        rebTransUnit = getBatTypeByName('Piquiers');
        resTransUnit = getBatTypeByName('Warriors');
    } else if (playerInfos.gang === 'bulbos') {
        rebTransUnit = getBatTypeByName('Vapos');
        resTransUnit = getBatTypeByName('Shooters');
    } else if (playerInfos.gang === 'drogmulojs') {
        rebTransUnit = getBatTypeByName('Blastoxs');
        resTransUnit = getBatTypeByName('Toxs');
    } else if (playerInfos.gang === 'tiradores') {
        rebTransUnit = getBatTypeByName('Gunners');
        resTransUnit = getBatTypeByName('Pistoleros');
    } else if (playerInfos.gang === 'detruas') {
        rebTransUnit = getBatTypeByName('Dogs');
        resTransUnit = getBatTypeByName('Snowballs');
    } else if (playerInfos.gang === 'brasier') {
        rebTransUnit = getBatTypeByName('Hot girls');
        resTransUnit = getBatTypeByName('Blocks');
    }
    rebUnit.unitUp = rebTransUnit.name;
    resUnit.unitUp = resTransUnit.name;
    rebTransUnit.altUnitCost = rebUnit.name;
    resTransUnit.altUnitCost = resUnit.name;
};

function playerSkillsUTChanges() {
    resistanceUpgrade();
    unitTypes.forEach(function(unit) {
        unit.team = 'player';
        // WEAPON 1 ALT
        if (unit.weapon1alt != undefined) {
            if (unit.weapon1alt.gangs.includes(playerInfos.gang)) {
                unit.weapon = unit.weapon1alt;
                unit.weapon1alt = {};
            } else {
                unit.weapon1alt = {};
            }
        }
        if (unit.weapon1bis != undefined) {
            if (unit.weapon1bis.gangs.includes(playerInfos.gang)) {
                unit.weapon = unit.weapon1bis;
                unit.weapon1bis = {};
            } else {
                unit.weapon1bis = {};
            }
        }
        if (unit.weapon1prox != undefined) {
            if (unit.weapon1prox.gangs.includes(playerInfos.gang)) {
                unit.weapon = unit.weapon1prox;
                unit.weapon1bis = {};
            } else {
                unit.weapon1bis = {};
            }
        }
        // def3 weapons
        if (playerInfos.comp.def === 3) {
            if (unit.weapon1Def3 != undefined) {
                unit.weapon = unit.weapon1Def3;
                unit.weapon1Def3 = {};
            }
        }
        // WEAPON 2 ALT
        if (unit.weapon2alt != undefined) {
            if (unit.weapon2alt.gangs.includes(playerInfos.gang)) {
                unit.weapon2 = unit.weapon2alt;
                unit.weapon2alt = {};
            } else {
                unit.weapon2alt = {};
            }
        }
        if (unit.weapon2bis != undefined) {
            if (unit.weapon2bis.gangs.includes(playerInfos.gang)) {
                unit.weapon2 = unit.weapon2bis;
                unit.weapon2bis = {};
            } else {
                unit.weapon2bis = {};
            }
        }
        // TAUPES
        if (unit.name === 'Taupes') {
            if (playerInfos.gang === 'blades') {
                unit.mining.types = ['Mine','Comptoir'];
                unit.mining.subTypes = ['Scrap','Derrick','Pompe'];
            }
            if (playerInfos.gang === 'brasier') {
                unit.mining.types = ['Derrick'];
                unit.mining.subTypes = ['Mine','Comptoir','Scrap','Pompe'];
                unit.mining.rate = 22;
            }
        }
        if (unit.name === 'Badgers') {
            if (playerInfos.gang === 'drogmulojs') {
                unit.mining.types = ['Scrap','Mine','Comptoir'];
                unit.mining.subTypes = ['Derrick','Pompe'];
                unit.mining.rate = 20;
            }
        }
        // BLINDAGES / ARMURES
        unit.protection = allowedArmors(unit);
        // BLD HP & TRANS
        if (unit.cat === 'buildings') {
            unit.hp = Math.round(unit.hp*bldHPTuning);
            unit.transUnits = Math.round(unit.transUnits*bldTransTuning);
        }
        // TUNING FRET
        if (unit.skills.includes('fret')) {
            unit.transRes = Math.round(unit.transRes*fretTuning);
        }
        // TUNING LANDER FRET & HP
        if (unit.skills.includes('transorbital')) {
            unit.hp = Math.round(unit.hp*landerHPTuning);
            unit.transRes = Math.round(unit.transRes*landerFretTuning);
            if (unit.skills.includes('rescue')) {
                if (playerInfos.gMode === 1) {
                    unit.transRes = Math.round(unit.transRes*1.33);
                }
            }
        }
        // DEALERS
        if (playerInfos.comp.med >= 1 || playerInfos.comp.log >= 2) {
            if (playerInfos.gang === 'blades') {
                if (unit.cat != 'infantry' && (unit.kind === 'zero-medecine' || unit.name === 'Medevacs')) {
                    unit.skills.push('sila');
                }
            }
        }
        if (unit.name === 'Bar') {
            if (playerInfos.gang === 'drogmulojs') {
                unit.skills.push('starka');
                unit.skills.push('sila');
                unit.skills.push('bliss');
                unit.skills.push('skupiac');
                unit.skills.push('blaze');
                unit.skills.push('kirin');
                unit.skills.push('octiron');
                unit.skills.push('medrange');
            } else if (playerInfos.comp.exo >= 1) {
                unit.skills.push('starka');
            }
        }
        if (playerInfos.comp.med >= 2 || playerInfos.comp.log >= 3) {
            if (unit.type != 'infantry') {
                if (unit.skills.includes('octiron')) {
                    if (!unit.skills.includes('kirin')) {
                        unit.skills.push('kirin');
                    }
                    if (!unit.skills.includes('starka')) {
                        unit.skills.push('starka');
                    }
                }
                if (unit.skills.includes('kirin')) {
                    if (!unit.skills.includes('octiron')) {
                        unit.skills.push('octiron');
                    }
                    if (!unit.skills.includes('starka')) {
                        unit.skills.push('starka');
                    }
                }
                if (unit.skills.includes('starka')) {
                    if (!unit.skills.includes('octiron')) {
                        unit.skills.push('octiron');
                    }
                    if (!unit.skills.includes('kirin')) {
                        unit.skills.push('kirin');
                    }
                }
            }
        }
        let ravitMoloko = false;
        if (playerInfos.comp.exo >= 1 && playerInfos.comp.log >= 2) {
            ravitMoloko = true;
        }
        if (playerInfos.comp.ordre <= 1) {
            ravitMoloko = true;
        }
        if (ravitMoloko) {
            if (unit.kind === 'zero-trans-ravit') {
                if (!unit.skills.includes('dealer')) {
                    if (unit.maxDrug > 200) {
                        unit.maxDrug = 6;
                    }
                    unit.skills.push('dealer');
                }
                if (!unit.skills.includes('moloko')) {
                    unit.skills.push('moloko');
                }
            }
        }
        if (playerInfos.comp.ordre === 0) {
            if (unit.skills.includes('dealer')) {
                if (!unit.skills.includes('moloko')) {
                    unit.skills.push('moloko');
                }
            }
        }
        // AUTOKITS
        if (unit.skills.includes('autokitgaz')) {
            if (playerInfos.comp.exo >= 2 && playerInfos.comp.ca >= 3) {
                unit.weapon2.kit = false;
            }
        }
        if (unit.skills.includes('autokitmolo')) {
            if (playerInfos.comp.pyro >= 1) {
                unit.weapon2.kit = false;
            }
        }
        let repairBonus = false;
        // VOLS SPACIAUX
        if (unit.skills.includes('transorbital') || unit.skills.includes('isvsp')) {
            if (unit.hySpeed != undefined) {
                unit.hySpeed = Math.ceil(unit.hySpeed/(playerInfos.comp.vsp+4)*5);
            }
            if (playerInfos.comp.vsp >= 3) {
                let vspDiv = (playerInfos.comp.vsp+4)*(playerInfos.comp.vsp+4);
                if (unit.deploy != undefined) {
                    if (unit.deploy['Energie'] != undefined) {
                        unit.deploy['Energie'] = Math.ceil(unit.deploy['Energie']*35/vspDiv);
                    }
                    if (unit.deploy['Plutonium'] != undefined) {
                        unit.deploy['Plutonium'] = Math.ceil(unit.deploy['Plutonium']*35/vspDiv);
                    }
                    if (unit.deploy['Uranium'] != undefined) {
                        unit.deploy['Uranium'] = Math.ceil(unit.deploy['Uranium']*35/vspDiv);
                    }
                    if (unit.deploy['Hydrogène'] != undefined) {
                        unit.deploy['Hydrogène'] = Math.ceil(unit.deploy['Hydrogène']*35/vspDiv);
                    }
                }
            }
            if (playerInfos.comp.vsp >= 2) {
                let vspDiv = (playerInfos.comp.vsp+8)*(playerInfos.comp.vsp+8);
                if (unit.costs['Energie'] != undefined) {
                    unit.costs['Energie'] = Math.ceil(unit.costs['Energie']*90/vspDiv);
                }
                if (unit.costs['Titane'] != undefined) {
                    unit.costs['Titane'] = Math.ceil(unit.costs['Titane']*90/vspDiv);
                }
                if (unit.costs['Aluminium'] != undefined) {
                    unit.costs['Aluminium'] = Math.ceil(unit.costs['Aluminium']*90/vspDiv);
                }
                if (unit.costs['Rhodium'] != undefined) {
                    unit.costs['Rhodium'] = Math.ceil(unit.costs['Rhodium']*90/vspDiv);
                }
                if (unit.costs['Nickel'] != undefined) {
                    unit.costs['Nickel'] = Math.ceil(unit.costs['Nickel']*90/vspDiv);
                }
                if (unit.costs['Cuivre'] != undefined) {
                    unit.costs['Cuivre'] = Math.ceil(unit.costs['Cuivre']*90/vspDiv);
                }
                if (unit.costs['Or'] != undefined) {
                    unit.costs['Or'] = Math.ceil(unit.costs['Or']*90/vspDiv);
                }
                if (unit.costs['Electros'] != undefined) {
                    unit.costs['Electros'] = Math.ceil(unit.costs['Electros']*90/vspDiv);
                }
                if (unit.costs['Batteries'] != undefined) {
                    unit.costs['Batteries'] = Math.ceil(unit.costs['Batteries']*90/vspDiv);
                }
            }
            if (playerInfos.comp.vsp >= 3) {
                unit.weapon2.kit = false;
            }
        }
        // CONSTRUCTION
        if (playerInfos.comp.const >= 1) {
            if (unit.cat === 'buildings' || unit.cat === 'devices') {
                if (!unit.skills.includes('cfo') && !unit.skills.includes('dome') && !unit.skills.includes('pilone')) {
                    unit.fabTime = unit.fabTime/(playerInfos.comp.const+3)*3;
                }
            }
        }
        if (playerInfos.comp.const >= 1 && unit.cat === 'buildings') {
            unit.hp = unit.hp+Math.round(unit.hp/15*playerInfos.comp.const);
        }
        if (playerInfos.comp.const >= 1 && playerInfos.comp.ind >= 1 && unit.kind === 'zero-construction' && unit.skills.includes('constructeur')) {
            unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-((playerInfos.comp.const-1)*(playerInfos.comp.const-1))-(playerInfos.comp.const-1);
            if (unit.levels[playerInfos.gang] < 1) {
                unit.levels[playerInfos.gang] = 1;
            }
        }
        if (playerInfos.comp.const >= 1) {
            if (unit.costs['Compo1'] != undefined) {
                unit.costs['Compo1'] = Math.ceil(unit.costs['Compo1']/9*6);
            }
        }
        if (playerInfos.comp.const >= 2) {
            if (unit.costs['Compo2'] != undefined) {
                unit.costs['Compo2'] = Math.ceil(unit.costs['Compo2']/9*6);
            }
        }
        if (playerInfos.comp.const >= 3) {
            if (unit.costs['Compo3'] != undefined) {
                unit.costs['Compo3'] = Math.ceil(unit.costs['Compo3']/9*6);
            }
        }
        if (unit.mecanoCost < 90) {
            if (unit.skills.includes('repair')) {
                repairBonus = true;
            }
            if (unit.skills.includes('selfrepair') || unit.skills.includes('selfbadrepair')) {
                if (!unit.skills.includes('mecano') && !unit.skills.includes('badmecano')) {
                    repairBonus = true;
                }
            }
            if (repairBonus) {
                if (playerInfos.comp.const === 2) {
                    unit.mecanoCost = Math.floor(unit.mecanoCost*4/5);
                }
                if (playerInfos.comp.const === 3) {
                    unit.mecanoCost = Math.floor(unit.mecanoCost/2);
                }
                if (unit.mecanoCost < 2) {
                    unit.mecanoCost = 2;
                }
            }
        }
        // TRANSPORTS
        if (unit.mecanoCost < 90) {
            if (!repairBonus) {
                if (unit.skills.includes('mecano') || unit.skills.includes('badmecano') || unit.skills.includes('selfmecano') || unit.skills.includes('selfbadmecano')) {
                    if (playerInfos.comp.trans === 2) {
                        unit.mecanoCost = Math.floor(unit.mecanoCost*4/5);
                    }
                    if (playerInfos.comp.trans === 3) {
                        unit.mecanoCost = Math.floor(unit.mecanoCost/2);
                    }
                    if (unit.mecanoCost < 2) {
                        unit.mecanoCost = 2;
                    }
                }
            }
        }
        if (playerInfos.comp.trans >= 1) {
            if (unit.kind === 'zero-transports' || unit.kind === 'zero-trans-fret') {
                if (unit.compReq === undefined && unit.compHardReq === undefined) {
                    unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.trans);
                    if (unit.levels[playerInfos.gang] < 1) {
                        unit.levels[playerInfos.gang] = 1;
                    }
                }
            }
            if (unit.name === 'Mécanos') {
                unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-playerInfos.comp.trans;
                if (unit.levels[playerInfos.gang] < 1) {
                    unit.levels[playerInfos.gang] = 1;
                }
            }
        }
        if (playerInfos.comp.trans >= 1 && unit.cat === 'vehicles') {
            let transComp = ((playerInfos.comp.trans+1)*(playerInfos.comp.trans+1))-1;
            if (unit.transRes >= 50) {
                unit.transRes = Math.round(unit.transRes*(transComp+30)/30);
            }
            if (unit.transUnits >= 50) {
                unit.transUnits = Math.round(unit.transUnits*(transComp+30)/30);
            }
        }
        // INDUSTRIE
        if (playerInfos.comp.ind >= 1) {
            if (unit.cat === 'vehicles' || unit.skills.includes('machine')) {
                if (unit.skills.includes('robot') || unit.skills.includes('machine')) {
                    unit.hp = unit.hp+Math.round(unit.hp/5*playerInfos.comp.ind);
                } else {
                    unit.hp = unit.hp+Math.round(unit.hp/15*playerInfos.comp.ind);
                }
                unit.fabTime = unit.fabTime/(playerInfos.comp.ind+3)*3;
            }
        }
        // DEFENSE
        let defComp = playerInfos.comp.def-1;
        if (playerInfos.comp.def === 3) {
            defComp++;
        }
        if (playerInfos.comp.def >= 1 && (unit.kind === 'zero-defense' || unit.name.includes('Caserne') || unit.skills.includes('cage')) && !unit.skills.includes('dog') && !unit.skills.includes('dome') && !unit.skills.includes('pilone') && !unit.skills.includes('cfo')) {
            if (unit.compReq === undefined && unit.compHardReq === undefined) {
                unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.def);
                if (unit.levels[playerInfos.gang] < 1) {
                    unit.levels[playerInfos.gang] = 1;
                }
            }
        }
        if (playerInfos.comp.def >= 1 && unit.cat === 'buildings') {
            unit.armor = unit.armor+Math.round(playerInfos.comp.def*1.2);
        }
        if (unit.cat === 'buildings') {
            if (playerInfos.comp.def === 3) {
                unit.hp = Math.round(unit.hp*1.5);
            } else if (playerInfos.comp.def === 2) {
                unit.hp = Math.round(unit.hp*1.15);
            }
        }
        if (playerInfos.comp.def >= 2 && unit.skills.includes('garde')) {
            unit.hp = unit.hp+defComp;
            unit.armor = unit.armor+playerInfos.comp.def-1;
            if (playerInfos.comp.def >= 3) {
                if (Object.keys(unit.weapon).length >= 3) {
                    unit.weapon.rof = Math.ceil(unit.weapon.rof*1.25);
                }
                if (Object.keys(unit.weapon2).length >= 3) {
                    unit.weapon2.rof = Math.ceil(unit.weapon2.rof*1.25);
                }
            }
        }
        if (playerInfos.comp.def >= 2 && (unit.cat === 'buildings' || unit.cat === 'devices')) {
            if (Object.keys(unit.weapon).length >= 3) {
                unit.weapon.rof = Math.ceil(unit.weapon.rof*(defComp+10)/10);
            }
            if (Object.keys(unit.weapon2).length >= 3) {
                unit.weapon2.rof = Math.ceil(unit.weapon2.rof*(defComp+10)/10);
            }
            if (unit.weapon3 != undefined) {
                if (Object.keys(unit.weapon3).length >= 3) {
                    unit.weapon3.rof = Math.ceil(unit.weapon3.rof*(defComp+10)/10);
                }
            }
        }
        if (playerInfos.comp.def >= 1) {
            if (unit.cat === 'buildings' || unit.cat === 'devices' || unit.kind === 'zero-defense' || unit.name.includes('Caserne') || unit.skills.includes('garde') || unit.skills.includes('cage')) {
                if (unit.kind != 'zero-artillerie' && !unit.skills.includes('dog')) {
                    if (Object.keys(unit.weapon).length >= 3) {
                        let w1CostBonus = playerInfos.comp.def-1;
                        if (w1CostBonus > unit.weapon.cost-2) {
                            w1CostBonus = unit.weapon.cost-2;
                        }
                        unit.weapon.cost = unit.weapon.cost-w1CostBonus;
                        if (playerInfos.comp.def >= 2) {
                            unit.weapon.kit = false;
                        }
                    }
                    if (Object.keys(unit.weapon2).length >= 3) {
                        let w2CostBonus = playerInfos.comp.def-1;
                        if (w2CostBonus > unit.weapon2.cost-2) {
                            w2CostBonus = unit.weapon2.cost-2;
                        }
                        unit.weapon2.cost = unit.weapon2.cost-w2CostBonus;
                        if (playerInfos.comp.def >= 3 && !unit.skills.includes('nofreew2')) {
                            unit.weapon2.kit = false;
                        }
                    }
                }
            }
        }
        // BALISTIQUE / ARTIlLERIE
        if (playerInfos.comp.arti === 2) {
            if (unit.kind === 'zero-artillerie') {
                unit.weapon2.kit = false;
            }
        }
        if (playerInfos.comp.bal === 4 || playerInfos.comp.arti === 2) {
            if (playerInfos.comp.arti >= 1) {
                let rangeMult = 1;
                if (playerInfos.comp.arti === 2) {
                    rangeMult = rangeMult+0.25;
                    if (playerInfos.comp.bal === 4) {
                        rangeMult = rangeMult+0.1;
                    }
                } else {
                    if (playerInfos.comp.bal === 4) {
                        rangeMult = rangeMult+0.15;
                    }
                }
                if (Object.keys(unit.weapon).length >= 3) {
                    if (unit.weapon.isArt) {
                        if (unit.weapon.name.includes('Missile')) {
                            unit.weapon.range = Math.ceil(unit.weapon.range*rangeMult);
                        }
                    }
                }
                if (Object.keys(unit.weapon2).length >= 3) {
                    if (unit.weapon2.isArt) {
                        if (unit.weapon2.name.includes('Missile')) {
                            unit.weapon2.range = Math.ceil(unit.weapon2.range*rangeMult);
                        }
                    }
                }
            }
        }
        // EXPLOSIFS
        if (unit.name === 'Mines wipeout') {
            if (playerInfos.comp.arti >= 2) {
                unit.weapon2.range = 2;
            }
        }
        if (unit.name === 'Mines claymore') {
            if (playerInfos.comp.explo >= 2) {
                unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-((playerInfos.comp.explo-1)*2);
                if (unit.levels[playerInfos.gang] < 1) {
                    unit.levels[playerInfos.gang] = 1;
                }
            }
        }
        if (playerInfos.comp.explo >= 2) {
            let penBonus = 0.9;
            if (playerInfos.comp.explo === 3) {
                penBonus = 0.86;
            } else if (playerInfos.comp.explo === 4) {
                penBonus = 0.83;
            }
            if (Object.keys(unit.weapon).length >= 3) {
                if (unit.weapon.ammo.includes('obus') || unit.weapon.ammo.includes('missile') || unit.weapon.ammo.includes('missile-sunburst') || unit.weapon.ammo.includes('missile-vanguard') || unit.weapon.ammo.includes('dynamite') || unit.weapon.ammo.includes('grenade') || unit.weapon.ammo.includes('boulet')) {
                    if (playerInfos.comp.explo === 4) {
                        if (unit.weapon.power < 10) {
                            unit.weapon.power = unit.weapon.power+1;
                        } else {
                            unit.weapon.power = Math.round(unit.weapon.power*1.1);
                        }
                    }
                    if (unit.weapon.armors != undefined) {
                        unit.weapon.armors = unit.weapon.armors*penBonus;
                        unit.weapon.armors = unit.weapon.armors.toFixedNumber(2);
                    } else {
                        unit.weapon.armors = penBonus;
                    }
                }
            }
            if (Object.keys(unit.weapon2).length >= 3) {
                if (unit.weapon2.ammo.includes('obus') || unit.weapon2.ammo.includes('missile') || unit.weapon2.ammo.includes('missile-sunburst') || unit.weapon2.ammo.includes('missile-vanguard') || unit.weapon2.ammo.includes('missile-wildfire') || unit.weapon2.ammo.includes('dynamite') || unit.weapon2.ammo.includes('grenade') || unit.weapon2.ammo.includes('boulet')) {
                    if (playerInfos.comp.explo === 4) {
                        if (unit.weapon2.power < 10) {
                            unit.weapon2.power = unit.weapon2.power+1;
                        } else {
                            unit.weapon2.power = Math.round(unit.weapon2.power*1.1);
                        }
                    }
                    if (unit.weapon2.armors != undefined) {
                        unit.weapon2.armors = unit.weapon2.armors*penBonus;
                        unit.weapon2.armors = unit.weapon2.armors.toFixedNumber(2);
                    } else {
                        unit.weapon2.armors = penBonus;
                    }
                }
            }
        }
        // ENERGIE
        let energComp = playerInfos.comp.energ;
        if (energComp >= 3) {
            energComp = 4;
        }
        if (unit.kind === 'zero-energie' && playerInfos.comp.energ >= 1) {
            let energPlantBonus = false;
            if (unit.compReq === undefined) {
                energPlantBonus = true;
            } else {
                if (unit.compReq.energ === undefined) {
                    energPlantBonus = true;
                } else {
                    if (unit.compReq.energ < playerInfos.comp.energ) {
                        energPlantBonus = true;
                    }
                }
            }
            if (energPlantBonus) {
                if (unit.costs['Tungstène'] != undefined) {
                    unit.costs['Tungstène'] = Math.ceil(unit.costs['Tungstène']*0.75);
                }
                if (unit.costs['Carbone'] != undefined) {
                    unit.costs['Carbone'] = Math.ceil(unit.costs['Carbone']*0.75);
                }
                if (unit.costs['Nickel'] != undefined) {
                    unit.costs['Nickel'] = Math.ceil(unit.costs['Nickel']*0.75);
                }
                if (unit.costs['Batteries'] != undefined) {
                    unit.costs['Batteries'] = Math.ceil(unit.costs['Batteries']*0.75);
                }
                if (unit.costs['Bore'] != undefined) {
                    unit.costs['Bore'] = Math.ceil(unit.costs['Bore']*0.75);
                }
                if (unit.costs['Rhodium'] != undefined) {
                    unit.costs['Rhodium'] = Math.ceil(unit.costs['Rhodium']*0.75);
                }
                if (unit.costs['Cuivre'] != undefined) {
                    unit.costs['Cuivre'] = Math.ceil(unit.costs['Cuivre']*0.75);
                }
                if (unit.costs['Plutonium'] != undefined) {
                    unit.costs['Plutonium'] = Math.ceil(unit.costs['Plutonium']*0.75);
                }
                if (unit.costs['Uranium'] != undefined) {
                    unit.costs['Uranium'] = Math.ceil(unit.costs['Uranium']*0.75);
                }
                if (unit.costs['Platine'] != undefined) {
                    unit.costs['Platine'] = Math.ceil(unit.costs['Platine']*0.5);
                }
                if (unit.costs['Energie'] != undefined) {
                    unit.costs['Energie'] = Math.ceil(unit.costs['Energie']*0.5);
                }
            }
        }
        if (playerInfos.comp.energ >= 2) {
            let energWeapBonus = false;
            if (unit.compReq === undefined) {
                energWeapBonus = true;
            } else {
                if (unit.compReq.energ === undefined) {
                    energWeapBonus = true;
                } else {
                    if (unit.compReq.energ < 2 || unit.compPass.includes(playerInfos.gang)) {
                        energWeapBonus = true;
                    }
                }
            }
            if (energWeapBonus) {
                if (Object.keys(unit.weapon).length >= 3) {
                    if (unit.weapon.name.includes('plasma') || unit.weapon.name.includes('laser') || unit.weapon.name.includes('Electro') || unit.weapon.name.includes('Lightning') || unit.weapon.name.includes('BFG') || unit.weapon.name.includes('électrique') || unit.weapon.name.includes('Taser') || unit.weapon.name === 'Barbelés (taser)' || unit.weapon.name === 'Barbelés (ht)') {
                        unit.weapon.power = Math.ceil(unit.weapon.power*(energComp+15)/15);
                    }
                }
                if (Object.keys(unit.weapon2).length >= 3) {
                    if (unit.weapon2.name.includes('plasma') || unit.weapon2.name.includes('laser') || unit.weapon2.name.includes('Electro') || unit.weapon2.name.includes('Lightning') || unit.weapon2.name.includes('BFG') || unit.weapon2.name.includes('électrique') || unit.weapon2.name.includes('Taser') || unit.weapon2.name === 'Barbelés (taser)' || unit.weapon2.name === 'Barbelés (ht)') {
                        unit.weapon2.power = Math.ceil(unit.weapon2.power*(energComp+15)/15);
                    }
                }
            }
        }
        // EXTRACTION
        if (playerInfos.comp.ext >= 1 && unit.kind === 'zero-extraction') {
            if (unit.compReq === undefined) {
                unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.ext);
                if (unit.levels[playerInfos.gang] < 1) {
                    unit.levels[playerInfos.gang] = 1;
                }
            }
        }
        // RECYCLAGE
        if (playerInfos.comp.tri === 4) {
            if (unit.skills.includes('maysm')) {
                unit.skills.push('scrapmorph');
            }
        }
        // LOGISTIQUE
        if (playerInfos.comp.log >= 2 && unit.cat === 'buildings') {
            if (playerInfos.comp.log === 2) {
                if (unit.transRes >= 50) {
                    unit.transRes = Math.round(unit.transRes*1.2);
                }
                if (unit.transUnits >= 50) {
                    unit.transUnits = Math.round(unit.transUnits*1.2);
                    unit.transMaxSize = Math.round(unit.transMaxSize*1.5);
                }
            } else if (playerInfos.comp.log === 3) {
                if (unit.transRes >= 300000) {
                    unit.transRes = Math.round(unit.transRes*1.5);
                } else if (unit.transRes >= 50) {
                    unit.transRes = Math.round(unit.transRes*2);
                }
                if (unit.transUnits >= 50) {
                    unit.transUnits = Math.round(unit.transUnits*2);
                    unit.transMaxSize = Math.round(unit.transMaxSize*3);
                }
            }
        }
        if (playerInfos.comp.log >= 2) {
            if (unit.skills.includes('moto') || unit.skills.includes('machine')) {
                if (playerInfos.comp.log >= 3) {
                    unit.volume = unit.volume/1.35;
                } else {
                    unit.volume = unit.volume/1.12;
                }
                unit.volume = unit.volume.toFixedNumber(2);
            }
            if (unit.skills.includes('barda')) {
                if (playerInfos.comp.log >= 3) {
                    unit.volume = (unit.volume+3)/4.15;
                } else {
                    unit.volume = (unit.volume+1)/2;
                }
                unit.volume = unit.volume.toFixedNumber(2);
            } else if (unit.cat === 'infantry' && unit.volume > 1) {
                if (playerInfos.comp.log >= 3) {
                    unit.volume = 1;
                }
            }
        }
        if (playerInfos.comp.log >= 1) {
            if (unit.kind === 'zero-trans-ravit') {
                unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.log);
                if (unit.levels[playerInfos.gang] < 1) {
                    unit.levels[playerInfos.gang] = 1;
                }
            }
        }
        // ENTRAINEMENT
        if (unit.name === 'Dardières' || unit.name === 'Pièges') {
            let trapJump = Math.floor((playerInfos.comp.train+playerInfos.comp.const)/2);
            if (trapJump >= 1) {
                unit.weapon2.range = unit.weapon2.range+trapJump;
            }
        }
        if (playerInfos.comp.train >= 1) {
            if (unit.cat === 'infantry') {
                unit.fabTime = unit.fabTime/(playerInfos.comp.train+4)*4;
            }
            if (unit.skills.includes('maycible')) {
                unit.skills.push('cible');
            }
        }
        if (playerInfos.comp.train >= 1) {
            if (unit.cat != 'buildings' && unit.cat != 'devices' && (unit.kind != 'zero-artillerie' || unit.name === 'Raves') && unit.kind != 'zero-defense' && !unit.name.includes('Caserne') && !unit.skills.includes('garde') && !unit.skills.includes('cage') && !unit.skills.includes('robot')) {
                if (Object.keys(unit.weapon).length >= 3) {
                    if (!unit.weapon.name.includes('Missiles')) {
                        if (playerInfos.comp.train >= 3) {
                            if (unit.weapon.cost >= 6) {
                                unit.weapon.cost = unit.weapon.cost-2;
                            } else {
                                unit.weapon.cost = unit.weapon.cost-1;
                            }
                        } else {
                            if (unit.weapon.cost >= 4) {
                                unit.weapon.cost = unit.weapon.cost-1;
                            }
                        }
                    }
                }
                if (Object.keys(unit.weapon2).length >= 3) {
                    if (!unit.weapon2.name.includes('Missiles')) {
                        if (playerInfos.comp.train >= 3) {
                            if (unit.weapon2.cost >= 6) {
                                unit.weapon2.cost = unit.weapon2.cost-2;
                            } else {
                                unit.weapon2.cost = unit.weapon2.cost-1;
                            }
                        } else {
                            if (unit.weapon2.cost >= 4) {
                                unit.weapon2.cost = unit.weapon2.cost-1;
                            }
                        }
                    }
                }
            }
        }
        // CAMOUFLAGE
        if (playerInfos.comp.cam >= 2 && unit.skills.includes('maycamo') && unit.cat === 'infantry') {
            unit.skills.push('camo');
        } else if (playerInfos.comp.cam >= 2 && unit.skills.includes('maycamo') && unit.cat === 'vehicles' && unit.size < 20) {
            unit.skills.push('camo');
        } else if (playerInfos.comp.cam >= 3 && unit.skills.includes('maycamo') && (unit.cat === 'vehicles' || unit.cat === 'devices')) {
            unit.skills.push('camo');
        } else if (playerInfos.comp.cam >= 3 && unit.skills.includes('maycamo') && unit.cat === 'buildings') {
            unit.skills.push('camo');
        }
        if (playerInfos.comp.cam >= 2) {
            unit.stealth = unit.stealth+2+playerInfos.comp.cam;
        }
        // MEDECINE
        if (playerInfos.comp.med >= 1 && unit.kind === 'zero-medecine') {
            unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-playerInfos.comp.med-1;
            if (unit.levels[playerInfos.gang] < 1) {
                unit.levels[playerInfos.gang] = 1;
            }
        }
        if (unit.mediCost < 90) {
            if (playerInfos.comp.med >= 2) {
                if (unit.name === 'Infirmiers') {
                    // changer le nom en "Médecins"
                    unit.name = 'Médecins';
                    unit.mediCost = 5;
                }
            }
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
        // DETECTION
        if (playerInfos.comp.det >= 2) {
            if (Object.keys(unit.weapon).length >= 3) {
                if (unit.weapon.spot) {
                    unit.weapon.vision = true;
                }
            }
            if (Object.keys(unit.weapon2).length >= 3) {
                if (unit.weapon2.spot) {
                    unit.weapon2.vision = true;
                }
            }
            if (unit.name === 'Espions') {
                let levBonus = Math.floor((playerInfos.comp.det-2)*2.5);
                if (playerInfos.comp.cam >= 2) {
                    levBonus = levBonus+3;
                }
                unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-levBonus;
                if (unit.levels[playerInfos.gang] < 1) {
                    unit.levels[playerInfos.gang] = 1;
                }
            }
        }
        if (playerInfos.comp.det >= 3 || playerInfos.knownAliens.includes('Ectoplasmes')) {
            if (Object.keys(unit.weapon).length >= 3) {
                if (unit.weapon.name.includes('Marquage') || unit.weapon.name.includes('Guidage')) {
                    unit.weapon.vision = true;
                }
            }
            if (Object.keys(unit.weapon2).length >= 3) {
                if (unit.weapon2.name.includes('Marquage') || unit.weapon2.name.includes('Guidage')) {
                    unit.weapon2.vision = true;
                }
            }
        }
        if (playerInfos.comp.det >= 3) {
            if (unit.skills.includes('detsalvo')) {
                unit.maxSalvo = playerInfos.comp.det;
            }
        }
        // DÔMES
        if (unit.skills.includes('cfo') || unit.skills.includes('dome') || unit.skills.includes('pilone')) {
            let domeBonus = (playerInfos.comp.const+playerInfos.comp.energ+playerInfos.comp.def)/3;
            unit.fabTime = unit.fabTime/(domeBonus+3)*3;
        }
        // GANGS
        if (playerInfos.gang === 'brasier') {
            if (unit.name === 'Bigman') {
                unit.weapon2.power = unit.weapon2.power+4;
            }
            if (unit.name === 'Mechas') {
                unit.weapon.power = unit.weapon.power+3;
            }
        } else {
            if (unit.name === 'Drumfires') {
                unit.weapon.power = unit.weapon.power-5;
            }
            if (unit.name === 'Blockhaus') {
                unit.weapon2.power = unit.weapon2.power-1;
            }
            if (unit.name === 'Salamandres') {
                unit.weapon.power = unit.weapon.power-1;
            }
            if (unit.name === 'Firestorms') {
                unit.weapon.power = unit.weapon.power-1;
                unit.weapon2.power = unit.weapon2.power-1;
            }
        }
        unit.fabTime = Math.ceil(unit.fabTime);
    });
    console.log(unitTypes);
};

function playerSkillsATChanges() {
    armorTypes.forEach(function(infra) {
        // CONSTRUCTION
        if (infra.cat === 'infra') {
            if (playerInfos.comp.const >= 1) {
                if (infra.costs['Compo1'] != undefined) {
                    infra.costs['Compo1'] = Math.ceil(infra.costs['Compo1']/2);
                }
            }
            if (playerInfos.comp.const >= 2) {
                if (infra.costs['Compo2'] != undefined) {
                    infra.costs['Compo2'] = Math.ceil(infra.costs['Compo2']/2);
                }
            }
            if (playerInfos.comp.const >= 3) {
                if (infra.costs['Compo3'] != undefined) {
                    infra.costs['Compo3'] = Math.ceil(infra.costs['Compo3']/9*6);
                }
            }
        }
    });
};

function maxGangCompCosts() {
    // C'est PAAAAAAS le bon !!!
    let maxComp = [10,0];
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
        if (playerInfos.gLevel >= 9) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 11) {
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
        if (playerInfos.gLevel >= 14) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 16) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
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
    }
    if (playerInfos.gang === 'bulbos') {
        maxComp[0] = maxComp[0]+2;
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
        if (playerInfos.gLevel >= 13) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 15) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 16) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
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
    }
    if (playerInfos.gang === 'drogmulojs') {
        maxComp[0] = maxComp[0]+1;
        if (playerInfos.gLevel >= 3) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 5) {
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
        if (playerInfos.gLevel >= 17) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 19) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 21) {
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
        if (playerInfos.gLevel >= 8) {
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
        if (playerInfos.gLevel >= 17) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 19) {
            maxComp[0] = maxComp[0]+1;
            maxComp[1] = maxComp[1]+1;
        }
        if (playerInfos.gLevel >= 22) {
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
    }
    return maxComp;
};

function getTotalCompCosts() {
    let totalComp = [0,0];
    gangComps.forEach(function(gc) {
        if (playerInfos.comp[gc.name] >= 1) {
            totalComp[0] = totalComp[0]+gc.lvlCosts[1];
            if (gc.lvlCosts[1] === 2) {
                totalComp[1] = totalComp[1]+1;
            }
        }
        if (playerInfos.comp[gc.name] >= 2) {
            totalComp[0] = totalComp[0]+gc.lvlCosts[2];
            if (gc.lvlCosts[2] === 2) {
                totalComp[1] = totalComp[1]+1;
            }
        }
        if (playerInfos.comp[gc.name] >= 3) {
            totalComp[0] = totalComp[0]+gc.lvlCosts[3];
            if (gc.lvlCosts[3] === 2) {
                totalComp[1] = totalComp[1]+1;
            }
        }
        if (playerInfos.comp[gc.name] >= 4) {
            totalComp[0] = totalComp[0]+gc.lvlCosts[4];
            if (gc.lvlCosts[4] === 2) {
                totalComp[1] = totalComp[1]+1;
            }
        }
        if (playerInfos.comp[gc.name] >= 5) {
            totalComp[0] = totalComp[0]+gc.lvlCosts[5];
            if (gc.lvlCosts[5] === 2) {
                totalComp[1] = totalComp[1]+1;
            }
        }
        if (playerInfos.comp[gc.name] >= 6) {
            totalComp[0] = totalComp[0]+gc.lvlCosts[6];
            if (gc.lvlCosts[6] === 2) {
                totalComp[1] = totalComp[1]+1;
            }
        }
    });
    return totalComp;
};

function getLanderRange(landerBatType) {
    let landerRange = baseLanderRange;
    if (playerInfos.comp.vsp >= 1) {
        landerRange = landerRange+Math.floor(playerInfos.comp.vsp*2.8);
    }
    if (!playerInfos.onShip) {
        if (landerBatType != undefined) {
            if (Object.keys(landerBatType).length >= 1) {
                if (landerBatType.name === 'Trolley') {
                    landerRange = 1+playerInfos.comp.vsp;
                }
                if (playerInfos.onShip) {
                    landerRange = 1;
                }
            }
        }
    }
    return landerRange;
};

function calcStartRes() {
    // toutes les ressources dans le lander
    checkReserve();
    playerInfos.startRes = playerInfos.reserve;
    // tous les citoyens + criminels dans le lander
    // tous les citoyens + criminels des unités
    // toutes les valeurs en ressources des unités (cost + deploy)
    // toutes les valeurs en ressources des armures (cost + deploy)
    // toutes les valeurs en ressources des équipements (cost + deploy)
    // toutes les valeurs en ressources des munitions (cost + deploy)
    playerInfos.startRes['Citoyens'] = 0;
    playerInfos.startRes['Lore'] = playerInfos.gangXP;
    let allCosts = {};
    let unitCosts;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            let batType = getBatType(bat);
            if (batType.name === 'Citoyens' || batType.name === 'Criminels') {
                playerInfos.startRes['Citoyens'] = playerInfos.startRes['Citoyens']+bat.citoyens;
            } else {
                let unitCits = batType.squads*batType.crew*batType.squadSize;
                if (batType.skills.includes('clone') || batType.skills.includes('dog') || bat.tags.includes('nopilots')) {
                    unitCits = 0;
                }
                playerInfos.startRes['Citoyens'] = playerInfos.startRes['Citoyens']+unitCits;
            }
            if (batType.skills.includes('transorbital')) {
                unitCosts = getAllCosts(bat,true,false);
            } else {
                unitCosts = getAllCosts(bat,true,true);
            }
            // console.log(batType.name);
            // console.log(unitCosts);
            if (unitCosts != undefined) {
                if (Object.keys(unitCosts).length >= 1) {
                    mergeObjects(allCosts,unitCosts);
                }
            }
        }
    });
    // console.log('TOTAL');
    // console.log(allCosts);
    Object.entries(allCosts).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (playerInfos.startRes[key] != undefined) {
            playerInfos.startRes[key] = playerInfos.startRes[key]+value;
        } else {
            playerInfos.startRes[key] = value;
        }
    });
    saveGame();
};

function calcEndRes(onlyLanders) {
    resetEndRes();
    // toutes les ressources dans le lander
    landers = [];
    let landersIds = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital')) {
                landers.push(bat);
                landersIds.push(bat.id);
            }
        }
    });
    resTypes.forEach(function(res) {
        let dispoRes = getDispoRes(res.name);
        if (dispoRes >= 1) {
            playerInfos.endRes[res.name] = dispoRes;
        } else {
            playerInfos.endRes[res.name] = 0;
        }
    });
    // tous les citoyens + criminels dans le lander
    // tous les citoyens + criminels des unités
    // toutes les valeurs en ressources des unités (cost + deploy)
    // toutes les valeurs en ressources des armures (cost + deploy)
    // toutes les valeurs en ressources des équipements (cost + deploy)
    // toutes les valeurs en ressources des munitions (cost + deploy)
    playerInfos.endRes['Citoyens'] = 0;
    playerInfos.endRes['Lore'] = playerInfos.gangXP+evalTurnXP(playerInfos.mapTurn);
    let allCosts = {};
    let unitCosts;
    // console.log('LANDERS');
    // console.log(landers);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            let batType = getBatType(bat);
            // console.log(batType.name);
            let countThis = true;
            if (onlyLanders) {
                if (!batType.skills.includes('transorbital')) {
                    // console.log(bat.loc);
                    // console.log(bat.locId);
                    if (bat.loc != "trans") {
                        countThis = false;
                    } else {
                        if (!landersIds.includes(bat.locId)) {
                            countThis = false;
                        }
                    }
                }
            }
            // console.log(countThis);
            if (countThis) {
                if (batType.name === 'Citoyens' || batType.name === 'Criminels') {
                    playerInfos.endRes['Citoyens'] = playerInfos.endRes['Citoyens']+bat.citoyens;
                } else {
                    let unitCits = batType.squads*batType.crew*batType.squadSize;
                    if (batType.skills.includes('clone') || batType.skills.includes('dog') || bat.tags.includes('nopilots')) {
                        unitCits = 0;
                    }
                    playerInfos.endRes['Citoyens'] = playerInfos.endRes['Citoyens']+unitCits;
                }
                if ((!batType.skills.includes('transorbital') && batType.cat != 'buildings' && batType.cat != 'devices') || batType.skills.includes('prefab')) {
                    unitCosts = getAllCosts(bat,false,true);
                    // console.log(batType.name);
                    // console.log(unitCosts);
                    if (unitCosts != undefined) {
                        if (Object.keys(unitCosts).length >= 1) {
                            mergeObjects(allCosts,unitCosts);
                        }
                    }
                }
            }
        }
    });
    // console.log('TOTAL');
    // console.log(allCosts);
    Object.entries(allCosts).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (playerInfos.endRes[key] != undefined) {
            playerInfos.endRes[key] = playerInfos.endRes[key]+value;
        } else {
            playerInfos.endRes[key] = value;
        }
    });
    // console.log(playerInfos.endRes);
    // savePlayerInfos();
};

function missionResults(onlyLanders,sCount,hCount) {
    selectMode();
    if (zone[0].number >= 16) {
        sondeCount = 'cy';
    }
    if (sCount != undefined) {
        sondeCount = sCount;
    }
    if (hCount != undefined) {
        homeCount = hCount;
    }
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    calcEndRes(onlyLanders);
    let maintCosts = getAllMaintCosts();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or">RAPPORT DE MISSION</span><br>');
    $('#conUnitList').append('<br>');
    if (sondeCount === 'cy') {
        $('#conUnitList').append('<span class="loadIcon cy klik" title="Tient compte du prix de la sonde (Cliquer pour inverser)"><i class="fas fa-rocket" onclick="missionResults('+onlyLanders+',`gff`,`'+homeCount+'`)"></i></span>');
    } else {
        $('#conUnitList').append('<span class="loadIcon gff klik" title="Ne tient pas compte du prix de la sonde (Cliquer pour inverser)"><i class="fas fa-rocket" onclick="missionResults('+onlyLanders+',`cy`,`'+homeCount+'`)"></i></span>');
    }
    if (homeCount === 'cy') {
        $('#conUnitList').append('<span class="loadIcon cy klik" title="Tient compte du dernier rapport sur la station (Cliquer pour inverser)"><i class="fas fa-home" onclick="missionResults('+onlyLanders+',`'+sondeCount+'`,`gff`)"></i></span>');
    } else {
        $('#conUnitList').append('<span class="loadIcon gff klik" title="Ne tient pas compte du dernier rapport sur la station (Cliquer pour inverser)"><i class="fas fa-home" onclick="missionResults('+onlyLanders+',`'+sondeCount+'`,`cy`)"></i></span>');
    }
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<br>');
    let balance = 0;
    let minedTotal = 0;
    let citDiff = playerInfos.endRes['Citoyens']-playerInfos.startRes['Citoyens'];
    let xpDiff = playerInfos.endRes['Lore']-playerInfos.startRes['Lore'];
    let resColour = 'gf';
    if (citDiff < 0) {
        resColour = 'or';
    } else if (citDiff > 0) {
        resColour = 'cy';
    }
    $('#conUnitList').append('<span class="paramResName">Expérience</span><span class="paramIcon"></span><span class="paramResValue cy">'+xpDiff+'</span><br>');
    $('#conUnitList').append('<span class="paramResName">Citoyens</span><span class="paramIcon"></span><span class="paramResValue '+resColour+'">'+citDiff+'</span><br>');
    $('#conUnitList').append('<hr>');
    let sonde = getBatTypeByName('Impacteur');
    if (!playerInfos.bldVM.includes('Aérodocks')) {
        sonde = getBatTypeByName('Sonde');
    }
    Object.entries(playerInfos.endRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (key != 'Citoyens' && key != 'Lore') {
            // console.log(key);
            let res = getResByName(key);
            // console.log(res.name);
            let resIcon = getResIcon(res);
            let minedRes = getMinedRes(res.name);
            let resCol = '';
            if (playerInfos.resFlags.includes(res.name)) {
                resCol = ' jaune';
            } else if (res.cat === 'alien') {
                resCol = ' gff';
            }
            let resResult = playerInfos.endRes[key]-playerInfos.startRes[key];
            if (maintCosts[key] != undefined) {
                resResult = resResult-maintCosts[key];
            }
            if (sondeCount === 'cy') {
                if (sonde.costs[key] != undefined) {
                    resResult = resResult-sonde.costs[key];
                }
            }
            if (homeCount === 'cy') {
                if (Object.keys(playerInfos.weekRes).length >= 1) {
                    if (playerInfos.weekRes[key] != undefined) {
                        resResult = resResult+playerInfos.weekRes[key];
                    }
                }
            }
            minedTotal = minedTotal+Math.round(minedRes*res.equiv);
            balance = balance+Math.round(resResult*res.equiv);
            if (resResult != 0 || minedRes != 0) {
                resColour = 'gf';
                if (resResult < 0) {
                    resColour = 'or';
                } else if (resResult > 0) {
                    resColour = 'cy';
                }
                if (minedRes <= 0) {
                    $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramValue"><span class="'+resColour+'">'+resResult+'</span></span><br>');
                } else {
                    $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramValue"><span class="'+resColour+'">'+resResult+'</span> +('+minedRes+')</span><br>');
                }
            }
        }
    });
    Object.entries(playerInfos.endRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (key != 'Citoyens' && key != 'Lore') {
            let res = getResByName(key);
            let resIcon = getResIcon(res);
            let minedRes = getMinedRes(res.name);
            let resCol = '';
            if (playerInfos.resFlags.includes(res.name)) {
                resCol = ' jaune';
            }
            let resResult = playerInfos.endRes[key]-playerInfos.startRes[key];
            if (maintCosts[key] != undefined) {
                resResult = resResult-maintCosts[key];
            }
            if (sondeCount === 'cy') {
                if (sonde.costs[key] != undefined) {
                    resResult = resResult-sonde.costs[key];
                }
            }
            if (homeCount === 'cy') {
                if (Object.keys(playerInfos.weekRes).length >= 1) {
                    if (playerInfos.weekRes[key] != undefined) {
                        resResult = resResult+playerInfos.weekRes[key];
                    }
                }
            }
            if (resResult === 0 && minedRes === 0) {
                let resColour = 'gf';
                if (minedRes <= 0) {
                    $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="'+resColour+'">'+resResult+'</span></span><br>');
                } else {
                    $('#conUnitList').append('<span class="paramResName'+resCol+'">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="'+resColour+'">'+resResult+'</span> +('+minedRes+')</span><br>');
                }
            }
        }
    });
    $('#conUnitList').append('<hr>');
    resColour = 'gf';
    if (balance < 0) {
        resColour = 'or';
    } else if (balance > 0) {
        resColour = 'cy';
    }
    $('#conUnitList').append('<span class="paramName vert">Total</span><span class="paramIcon"></span><span class="paramValue '+resColour+'">'+balance+'</span> +('+minedTotal+')<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
    commandes();
};

function getAllMaintCosts() {
    let allCosts = {};
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('decay')) {
            let maintCosts = getAvMaintCosts(batType);
            mergeObjects(allCosts,maintCosts);
        }
    });
    console.log('ALL MAINTENANCE COSTS');
    console.log(allCosts);
    return allCosts;
};

function adjStartPack() {
    // Pour ajuster le start pack !!!
    let packName = 'adjpack';
    let pack = {};
    let index = armorTypes.findIndex((obj => obj.name == packName));
    if (index > -1) {
        pack = armorTypes[index];
    }
    if (Object.keys(pack.res).length >= 1) {
        payMaxCost(pack.res);
    }
    playerInfos.adjok = true;
    voirReserve();
    commandes();
};

function putStartUnits() {
    if (isStartZone) {
        // déterminer le tileId de départ (ruine de mine)
        let startTileId = -1;
        zone.forEach(function(tile) {
            if (tile.land != undefined) {
                if (tile.land) {
                    startTileId = tile.id;
                }
            }
        });
        if (startTileId < 0) {
            startTileId = 1830;
        }
        // centre = start
        playerInfos.myCenter = startTileId;
        // liste de bataillons en fonction du niveau de difficulté et du gang
        let startBatList = getStartBatList();
        // déterminer le tileId de ce bataillon
        // 400 xp pour le sous-chef
        let tileId = startTileId;
        let unitNum = 0;
        startBatList.forEach(function(unitName) {
            unitNum++;
            let maxXP = Math.round((5-playerInfos.gMode)*30);
            let minXP = Math.floor(maxXP/5);
            let unitXP = rand.rand(minXP,maxXP);
            let isChef = false;
            if (unitName === 'Stalkers' || unitName === 'Chevaliers' || unitName === 'Vapos' || unitName === 'Mutants' || unitName === 'Jumpers' || unitName === 'Dogs' || unitName === 'Adeptes') {
                unitXP = unitXP+400;
                isChef = true;
            }
            tileId = getStartBatTileId(tileId,unitNum);
            addStartBat(tileId,unitName,unitXP,isChef);
        });
    }
};

function getStartBatTileId(oldTileId,unitNum) {
    let newTileId = -1;
    if (unitNum === 1) {
        newTileId = oldTileId;
    } else if (unitNum === 2) {
        newTileId = oldTileId-60;
    } else if (unitNum === 3) {
        newTileId = oldTileId+61;
    } else if (unitNum === 4) {
        newTileId = oldTileId+59;
    } else if (unitNum === 5) {
        newTileId = oldTileId-61;
    } else if (unitNum === 6) {
        newTileId = oldTileId-58;
    } else if (unitNum === 7) {
        newTileId = oldTileId+118;
    } else if (unitNum === 8) {
        newTileId = oldTileId-120;
    } else if (unitNum === 9) {
        newTileId = oldTileId+122;
    } else if (unitNum === 10) {
        newTileId = oldTileId+59;
    } else if (unitNum === 11) {
        newTileId = oldTileId-118;
    }
    return newTileId;
};

function addStartBat(tileId,unitName,xp,schef) {
    let unitIndex = unitTypes.findIndex((obj => obj.name === unitName));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = startBatGear(conselUnit);
    conselTriche = true;
    if (schef) {
        putBat(tileId,0,xp,'schef');
    } else {
        putBat(tileId,0,xp);
    }
    let bat = getLastBatCreated();
    let batType = getBatType(bat);
    if (!batType.skills.includes('nochef') || !batType.skills.includes('recupcit') || bat.tags.includes('schef') || bat.tags.includes('hero') || bat.tags.includes('vet') || batType.skills.includes('leader') || batType.skills.includes('prayer') || batType.name === 'Chercheurs') {
        randomNameChief(bat.id,false);
    }
}

function getStartBatList() {
    let startBatList = [];
    if (playerInfos.gang === 'rednecks') {
        startBatList.push('Rednecks');
        startBatList.push('Barmen');
        if (playerInfos.gMode <= 3) {
            startBatList.push('Riders');
            startBatList.push('Stalkers');
        }
        if (playerInfos.gMode <= 2) {
            startBatList.push('Gangsters');
            startBatList.push('Buggies');
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Pickups');
            startBatList.push('Sapeurs');
            startBatList.push('Infirmiers');
            startBatList.push('Bus');
        }
    } else if (playerInfos.gang === 'blades') {
        startBatList.push('Amazones');
        startBatList.push('Warriors');
        if (playerInfos.gMode <= 3) {
            startBatList.push('Scalpels');
            startBatList.push('Chevaliers');
        }
        if (playerInfos.gMode <= 2) {
            startBatList.push('Raiders');
            startBatList.push('Amazones');
            startBatList.push('Sentinelles');
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Piquiers');
            startBatList.push('Reapers');
            startBatList.push('Bus');
        }
    } else if (playerInfos.gang === 'bulbos') {
        startBatList.push('Shooters');
        startBatList.push('Cyborgs');
        if (playerInfos.gMode <= 3) {
            startBatList.push('Toubibs');
            startBatList.push('Vapos');
        }
        if (playerInfos.gMode <= 2) {
            startBatList.push('Shooters');
            startBatList.push('The Box');
            startBatList.push('Drones');
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Shooters');
            startBatList.push('Détenus');
            startBatList.push('Sapeurs');
            startBatList.push('Bus');
        }
    } else if (playerInfos.gang === 'drogmulojs') {
        startBatList.push('Toxs');
        startBatList.push('Blastoxs');
        if (playerInfos.gMode <= 3) {
            startBatList.push('Dealers');
            startBatList.push('Mutants');
        }
        if (playerInfos.gMode <= 2) {
            startBatList.push('Krimulos');
            startBatList.push('Bugmen');
            startBatList.push('Choufs');
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Toxs');
            startBatList.push('Tacots');
            startBatList.push('Bus');
        }
    } else if (playerInfos.gang === 'tiradores') {
        startBatList.push('Pistoleros');
        startBatList.push('Gunners');
        if (playerInfos.gMode <= 3) {
            startBatList.push('Cazadores');
            startBatList.push('Jumpers');
        }
        if (playerInfos.gMode <= 2) {
            startBatList.push('Desperados');
            startBatList.push('Amigos');
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Douilles');
            startBatList.push('Infirmiers');
            startBatList.push('Bus');
        }
    } else if (playerInfos.gang === 'detruas') {
        startBatList.push('Snowballs');
        startBatList.push('Bombastiks');
        if (playerInfos.gMode <= 3) {
            startBatList.push('Lovushkas');
            startBatList.push('Dogs');
        }
        if (playerInfos.gMode <= 2) {
            startBatList.push('Sinyaki');
            startBatList.push('Bombastiks');
            startBatList.push('Milkmen');
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Rainmen');
            startBatList.push('Infirmiers');
            startBatList.push('Bus');
        }
    } else if (playerInfos.gang === 'brasier') {
        startBatList.push('Blocks');
        startBatList.push('Slings');
        if (playerInfos.gMode <= 3) {
            startBatList.push('Hot girls');
            startBatList.push('Adeptes');
        }
        if (playerInfos.gMode <= 2) {
            startBatList.push('Blocks');
            startBatList.push('Warcars');
            startBatList.push('Pompistes');
            startBatList.push('Milkmen');
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Hot girls');
            startBatList.push('Tôlards');
            startBatList.push('Bus');
        }
    }
    return startBatList;
};

function startBatGear(unit) {
    // console.log('STARTBAT GEAR');
    let gear = ['xxx','xxx','scrap','xxx'];
    let gearChance = 1;
    if (unit.skills.includes('souschef')) {
        gearChance = 3;
    }
    // EQUIPS
    if (playerInfos.comp.def >= 1) {
        if (unit.equip.includes('kit-pompiste')) {
            if (playerInfos.comp.pyro >= 1) {
                gear[3] = 'kit-pompiste';
            }
        }
        if (unit.equip.includes('kit-milice')) {
            if (playerInfos.comp.det >= 2 && playerInfos.comp.bal >= 1) {
                gear[3] = 'kit-milice';
            }
        }
        if (unit.equip.includes('kit-chouf')) {
            if (playerInfos.comp.det >= 2) {
                gear[3] = 'kit-chouf';
            }
        }
    }
    if (gear[3] === 'xxx') {
        if (!unit.skills.includes('camo')) {
            if (playerInfos.comp.log >= 1) {
                if (playerInfos.comp.cam >= 1 || playerInfos.comp.train >= 2) {
                    if (rand.rand(1,3) <= gearChance) {
                        if (unit.equip.includes('e-camo')) {
                            gear[3] = 'e-camo';
                        }
                    }
                }
            }
        }
    }
    if (gear[3] === 'xxx') {
        if (!unit.skills.includes('camo')) {
            if (playerInfos.comp.cam >= 1 && playerInfos.comp.log >= 1) {
                if (rand.rand(1,2) <= gearChance) {
                    if (unit.equip.includes('silencieux')) {
                        gear[3] = 'silencieux';
                    }
                    if (unit.equip.includes('silencieux1')) {
                        gear[3] = 'silencieux1';
                    }
                    if (unit.equip.includes('silencieux2')) {
                        gear[3] = 'silencieux2';
                    }
                }
            }
        }
    }
    if (gear[3] === 'xxx') {
        if (unit.log3eq.includes('repel')) {
            if (unit.skills.includes('souschef') || (playerInfos.comp.exo >= 2 && playerInfos.comp.ca >= 3)) {
                if (unit.equip.includes('repel')) {
                    gear[3] = 'repel';
                }
            }
        }
    }
    if (gear[3] === 'xxx') {
        if (playerInfos.comp.det >= 3 || (playerInfos.comp.det >= 2 && playerInfos.comp.log >= 1)) {
            if (rand.rand(1,2) <= gearChance) {
                if (unit.equip.includes('lunette')) {
                    gear[3] = 'lunette';
                }
                if (unit.equip.includes('lunette1')) {
                    if (unit.weapon.isPrec) {
                        gear[3] = 'lunette1';
                    }
                }
                if (unit.equip.includes('lunette2')) {
                    if (unit.weapon2.isPrec) {
                        gear[3] = 'lunette2';
                    }
                }
            }
        }
    }
    if (gear[3] === 'xxx') {
        if (playerInfos.comp.bal >= 3 || (playerInfos.comp.bal >= 2 && playerInfos.comp.log >= 2)) {
            if (rand.rand(1,3) <= gearChance) {
                if (unit.equip.includes('chargeur')) {
                    gear[3] = 'chargeur';
                }
                if (unit.equip.includes('chargeur1')) {
                    if (!unit.weapon.name.includes('plasma') && !unit.weapon.name.includes('laser')) {
                        gear[3] = 'chargeur1';
                    }
                }
                if (unit.equip.includes('chargeur2')) {
                    if (!unit.weapon2.name.includes('plasma') && !unit.weapon2.name.includes('laser')) {
                        gear[3] = 'chargeur2';
                    }
                }
            }
        }
    }
    // AMMOS
    gearChance = 1;
    if (unit.skills.includes('souschef')) {
        gearChance = 2;
    }
    if (unit.weapon.rof >= 1) {
        // console.log('has w1');
        if (unit.weapon.ammo.includes('club-acier') && rand.rand(1,2) <= gearChance) {
            gear[0] = 'club-acier';
        }
        if (playerInfos.comp.bal >= 1) {
            if (unit.weapon.ammo.includes('perfo')) {
                gear[0] = 'perfo';
            }
            if (unit.weapon.ammo.includes('sm-perfo') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'sm-perfo';
            }
            if (unit.weapon.ammo.includes('tungsten') && rand.rand(1,4) <= gearChance) {
                gear[0] = 'tungsten';
            }
            if (unit.weapon.ammo.includes('sm-tungsten') && rand.rand(1,4) <= gearChance) {
                gear[0] = 'sm-tungsten';
            }
            if (unit.weapon.ammo.includes('ac-tungsten') && rand.rand(1,4) <= gearChance) {
                gear[0] = 'ac-tungsten';
            }
            if (playerInfos.comp.explo >= 2) {
                if (unit.weapon.ammo.includes('explosive') && rand.rand(1,2) <= gearChance) {
                    gear[0] = 'explosive';
                }
                if (unit.weapon.ammo.includes('ac-explosive') && rand.rand(1,2) <= gearChance) {
                    gear[0] = 'ac-explosive';
                }
                if (unit.weapon.ammo.includes('sm-explosive') && rand.rand(1,2) <= gearChance) {
                    gear[0] = 'sm-explosive';
                }
            }
        }
        if (playerInfos.comp.bal >= 2) {
            if (unit.weapon.ammo.includes('tungsten') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'tungsten';
            }
            if (unit.weapon.ammo.includes('sm-tungsten') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'sm-tungsten';
            }
            if (unit.weapon.ammo.includes('ac-tungsten') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'ac-tungsten';
            }
            if (playerInfos.comp.tri >= 3) {
                if (unit.weapon.ammo.includes('snake') && rand.rand(1,2) <= gearChance) {
                    gear[0] = 'snake';
                }
            }
        }
        if (unit.weapon.ammo.includes('fleche-tungsten') && rand.rand(1,3) <= gearChance) {
            gear[0] = 'fleche-tungsten';
        }
        if (unit.weapon.ammo.includes('lame-tungsten') && rand.rand(1,2) <= gearChance) {
            gear[0] = 'lame-tungsten';
        }
        if (playerInfos.comp.ca >= 1) {
            if (playerInfos.comp.exo >= 1) {
                if (unit.weapon.ammo.includes('fleche-poison') && rand.rand(1,2) <= gearChance) {
                    gear[0] = 'fleche-poison';
                }
                if (unit.weapon.ammo.includes('lame-poison') && rand.rand(1,2) <= gearChance) {
                    gear[0] = 'lame-poison';
                }
            }
        }
        if (playerInfos.comp.ca >= 2) {
            if (unit.weapon.ammo.includes('teflon') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'teflon';
            }
            if (unit.weapon.ammo.includes('sm-teflon') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'sm-teflon';
            }
        }
        if (playerInfos.comp.energ >= 1) {
            if (unit.weapon.ammo.includes('laser') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'laser';
            }
            if (playerInfos.comp.bal >= 1) {
                if (unit.weapon.ammo.includes('plasma') && rand.rand(1,2) <= gearChance) {
                    gear[0] = 'plasma';
                }
            }
        }
        if (playerInfos.comp.pyro >= 1) {
            if (unit.weapon.ammo.includes('obus-incendiaire') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'obus-incendiaire';
            }
        }
        if (playerInfos.comp.pyro >= 2) {
            if (unit.weapon.ammo.includes('grenade-incendiaire') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'grenade-incendiaire';
            }
            if (playerInfos.comp.ca >= 2) {
                if (unit.weapon.ammo.includes('molotov-slime') && rand.rand(1,2) <= gearChance) {
                    gear[0] = 'molotov-slime';
                }
            }
        }
        if (playerInfos.comp.pyro >= 3) {
            if (unit.weapon.ammo.includes('torche-feugre') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'torche-feugre';
            }
        }
        if (playerInfos.comp.explo >= 1) {
            if (unit.weapon.ammo.includes('obus')) {
                gear[0] = 'obus';
            }
            if (unit.weapon.ammo.includes('grenade')) {
                gear[0] = 'grenade';
            }
        }
        if (playerInfos.comp.explo >= 2) {
            if (unit.weapon.ammo.includes('dynamite-nitrate') && rand.rand(1,2) <= gearChance) {
                gear[0] = 'dynamite-nitrate';
            }
        }
    }
    if (unit.weapon2.rof >= 1) {
        // console.log('has w2');
        if (unit.skills.includes('unemun')) {
            gear[1] = gear[0];
        } else {
            if (unit.weapon2.ammo.includes('club-acier') && rand.rand(1,2) <= gearChance) {
                gear[1] = 'club-acier';
            }
            if (playerInfos.comp.bal >= 1) {
                if (unit.weapon2.ammo.includes('perfo') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'perfo';
                }
                if (unit.weapon2.ammo.includes('sm-perfo') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'sm-perfo';
                }
                if (unit.weapon2.ammo.includes('tungsten') && rand.rand(1,4) <= gearChance) {
                    gear[1] = 'tungsten';
                }
                if (unit.weapon2.ammo.includes('sm-tungsten') && rand.rand(1,4) <= gearChance) {
                    gear[1] = 'sm-tungsten';
                }
                if (unit.weapon2.ammo.includes('ac-tungsten') && rand.rand(1,4) <= gearChance) {
                    gear[1] = 'ac-tungsten';
                }
                if (playerInfos.comp.explo >= 2) {
                    if (unit.weapon2.ammo.includes('explosive') && rand.rand(1,2) <= gearChance) {
                        gear[1] = 'explosive';
                    }
                    if (unit.weapon2.ammo.includes('ac-explosive') && rand.rand(1,2) <= gearChance) {
                        gear[1] = 'ac-explosive';
                    }
                    if (unit.weapon2.ammo.includes('sm-explosive') && rand.rand(1,2) <= gearChance) {
                        gear[1] = 'sm-explosive';
                    }
                }
            }
            if (playerInfos.comp.bal >= 2) {
                if (unit.weapon2.ammo.includes('tungsten') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'tungsten';
                }
                if (unit.weapon2.ammo.includes('sm-tungsten') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'sm-tungsten';
                }
                if (unit.weapon2.ammo.includes('ac-tungsten') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'ac-tungsten';
                }
                if (playerInfos.comp.tri >= 3) {
                    if (unit.weapon2.ammo.includes('snake') && rand.rand(1,2) <= gearChance) {
                        gear[1] = 'snake';
                    }
                }
            }
            if (unit.weapon2.ammo.includes('fleche-tungsten') && rand.rand(1,3) <= gearChance) {
                gear[1] = 'fleche-tungsten';
            }
            if (unit.weapon2.ammo.includes('lame-tungsten') && rand.rand(1,2) <= gearChance) {
                gear[1] = 'lame-tungsten';
            }
            if (playerInfos.comp.ca >= 1) {
                if (playerInfos.comp.exo >= 1) {
                    if (unit.weapon2.ammo.includes('fleche-poison') && rand.rand(1,2) <= gearChance) {
                        gear[1] = 'fleche-poison';
                    }
                    if (unit.weapon2.ammo.includes('lame-poison') && rand.rand(1,2) <= gearChance) {
                        gear[1] = 'lame-poison';
                    }
                }
            }
            if (playerInfos.comp.ca >= 2) {
                if (unit.weapon2.ammo.includes('teflon') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'teflon';
                }
                if (unit.weapon2.ammo.includes('sm-teflon') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'sm-teflon';
                }
            }
            if (playerInfos.comp.energ >= 1) {
                if (unit.weapon2.ammo.includes('laser') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'laser';
                }
                if (playerInfos.comp.bal >= 1) {
                    if (unit.weapon2.ammo.includes('plasma') && rand.rand(1,2) <= gearChance) {
                        gear[1] = 'plasma';
                    }
                }
            }
            if (playerInfos.comp.pyro >= 1) {
                if (unit.weapon2.ammo.includes('obus-incendiaire') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'obus-incendiaire';
                }
            }
            if (playerInfos.comp.pyro >= 2) {
                if (unit.weapon2.ammo.includes('grenade-incendiaire') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'grenade-incendiaire';
                }
                if (playerInfos.comp.ca >= 2) {
                    if (unit.weapon2.ammo.includes('molotov-slime') && rand.rand(1,2) <= gearChance) {
                        gear[1] = 'molotov-slime';
                    }
                }
            }
            if (playerInfos.comp.pyro >= 3) {
                if (unit.weapon2.ammo.includes('torche-feugre') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'torche-feugre';
                }
            }
            if (playerInfos.comp.explo >= 1) {
                if (unit.weapon2.ammo.includes('obus')) {
                    gear[1] = 'obus';
                }
                if (unit.weapon2.ammo.includes('grenade')) {
                    gear[1] = 'grenade';
                }
            }
            if (playerInfos.comp.explo >= 2) {
                if (unit.weapon2.ammo.includes('dynamite-nitrate') && rand.rand(1,2) <= gearChance) {
                    gear[1] = 'dynamite-nitrate';
                }
            }
        }
    }
    if (playerInfos.comp.ca >= 2) {
        if (unit.protection.includes('bugium') && rand.rand(1,2) <= gearChance) {
            gear[2] === 'bugium';
        }
    }
    // console.log(gear);
    return gear;
};

function replacerSondes() {
    let nextSondeTileId = 1521;
    let nextImpactTileId = 1539;
    let souteBat = getBatById(souteId);
    bataillons.forEach(function(bat) {
        if (bat.type === 'Sonde' || bat.type === 'Impacteur') {
            if (bat.loc === 'trans') {
                if (bat.locId === souteId) {
                    bat.loc = 'zone';
                    bat.locId = 0;
                    if (souteBat.transIds.includes(bat.id)) {
                        let tagIndex = souteBat.transIds.indexOf(bat.id);
                        souteBat.transIds.splice(tagIndex,1);
                    }
                    if (bat.type === 'Sonde') {
                        bat.tileId = nextSondeTileId;
                        bat.oldTileId = nextSondeTileId;
                        nextSondeTileId = nextSondeTileId+60;
                    }
                    if (bat.type === 'Impacteur') {
                        bat.tileId = nextImpactTileId;
                        bat.oldTileId = nextImpactTileId;
                        nextImpactTileId = nextImpactTileId+60;
                    }
                }
            }
        }
    });
};

function addStartPack() {
    addFreeBat(1830,'Soute');
    // addFreeBat(1770,'Stocks');
    addFreeBat(1831,'Lander');
    // addFreeBat(1890,'Trolley');
    addFreeBat(1829,'Navette de secours');
    addFreeBat(1834,'Poste de pilotage');
    addFreeBat(1828,'Foyer');
    addFreeBat(1949,'Serres hydroponiques');
    addFreeBat(1948,'Cantine');
    addFreeBat(1833,'Générateur');
    addFreeBat(1773,'Crameur');
    addFreeBat(1707,'Dortoirs');
    addFreeBat(1767,'Dortoirs');
    addFreeBat(1827,'Dortoirs');
    addFreeBat(1887,'Dortoirs');
    addFreeBat(1947,'Dortoirs');
    addFreeBat(1522,'Sonde');
    addFreeBat(1582,'Sonde');
    addFreeBat(1642,'Sonde');
    addFreeBat(1702,'Sonde');
    addFreeBat(1762,'Sonde');
    addFreeBat(1822,'Sonde');
    addFreeBat(1882,'Sonde');
    addFreeBat(1942,'Sonde');
    addFreeBat(2002,'Sonde');
    addFreeBat(2062,'Sonde');
    addFreeBat(1538,'Impacteur');
    addFreeBat(1598,'Impacteur');
    addFreeBat(1658,'Impacteur');
    addFreeBat(1718,'Impacteur');
    addFreeBat(1778,'Impacteur');
    addFreeBat(1894,'Station météo');
    addFreeBat(1835,'Vidéotéléphonie');
    addFreeBat(1953,'Unités cryogéniques');
    addFreeBat(1713,'Salle de conférence');
    addFreeBat(1645,'Ascenseur');
    addFreeBat(1655,'Ascenseur');
    addFreeBat(2005,'Ascenseur');
    addFreeBat(2015,'Ascenseur');
    addFreeBat(1709,'Bureaux');
    addFreeBat(1774,'Salle de contrôle');
    addFreeBat(1711,'Salle de jeux');
    addFreeBat(1825,'Chapelle');
    addFreeBat(1523,'Structure');
    addFreeBat(1583,'Structure');
    addFreeBat(1643,'Structure');
    addFreeBat(1703,'Structure');
    addFreeBat(1763,'Structure');
    addFreeBat(1823,'Structure');
    addFreeBat(1883,'Structure');
    addFreeBat(1943,'Structure');
    addFreeBat(2003,'Structure');
    addFreeBat(2063,'Structure');
    addFreeBat(2123,'Structure');
    addFreeBat(1537,'Structure');
    addFreeBat(1597,'Structure');
    addFreeBat(1657,'Structure');
    addFreeBat(1717,'Structure');
    addFreeBat(1777,'Structure');
    addFreeBat(1837,'Structure');
    addFreeBat(1897,'Structure');
    addFreeBat(1957,'Structure');
    addFreeBat(2017,'Structure');
    addFreeBat(2077,'Structure');
    addFreeBat(2137,'Structure');
    addFreeBat(1524,'Isolation');
    addFreeBat(1525,'Isolation');
    addFreeBat(1526,'Isolation');
    addFreeBat(1527,'Isolation');
    addFreeBat(1528,'Isolation');
    addFreeBat(1529,'Isolation');
    addFreeBat(1530,'Isolation');
    addFreeBat(1531,'Isolation');
    addFreeBat(1532,'Isolation');
    addFreeBat(1533,'Isolation');
    addFreeBat(1534,'Isolation');
    addFreeBat(1535,'Isolation');
    addFreeBat(1536,'Isolation');
    addFreeBat(2124,'Isolation');
    addFreeBat(2125,'Isolation');
    addFreeBat(2126,'Isolation');
    addFreeBat(2127,'Isolation');
    addFreeBat(2128,'Isolation');
    addFreeBat(2129,'Isolation');
    addFreeBat(2130,'Isolation');
    addFreeBat(2131,'Isolation');
    addFreeBat(2132,'Isolation');
    addFreeBat(2133,'Isolation');
    addFreeBat(2134,'Isolation');
    addFreeBat(2135,'Isolation');
    addFreeBat(2136,'Isolation');
    // Ajouter les Citoyens
    let soute = getSoute();
    let thePeople = 1404+(30*(4-playerInfos.gMode))+(rand.rand(6,10)*6);
    let theMafia = rand.rand(12,20)*6;
    thePeople = thePeople-theMafia;
    let unitIndex = unitTypes.findIndex((obj => obj.name === 'Citoyens'));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselTriche = true;
    putBat(1830,thePeople,0);
    let citBat = getCitBat('Citoyens');
    citBat.loc = 'trans';
    citBat.locId = soute.id;
    soute.transIds.push(citBat.id);
    unitIndex = unitTypes.findIndex((obj => obj.name === 'Criminels'));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselTriche = true;
    putBat(1830,theMafia,0);
    let crimBat = getCitBat('Criminels');
    crimBat.loc = 'trans';
    crimBat.locId = soute.id;
    soute.transIds.push(crimBat.id);
    // Ajouter Ressources
    console.log(soute);
    let pack = getStartPack(playerInfos.gang);
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
            } else {
                if (value >= 1) {
                    soute.transRes[key] = value;
                }
            }
            playerInfos.vmRes[key] = value;
        });
    }
    commandes();
    showMap(zone,true);
    showBataillon(soute);
};

function addFreeBat(tileId,unitName) {
    let unitIndex = unitTypes.findIndex((obj => obj.name === unitName));
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselTriche = true;
    putBat(tileId,0,0);
}

function checkGangLevel() {
    let nextGangLevel = -1;
    let level = 0;
    gangLevelCit.forEach(function(levelCit) {
        if (nextGangLevel < 0) {
            if (levelCit <= playerInfos.gangXP) {
                if (level > playerInfos.gLevel) {
                    nextGangLevel = level;
                }
            }
            level++;
        }
    });
    return nextGangLevel;
};

function getNextLevelPop() {
    let nextLevelPop = -1;
    gangLevelCit.forEach(function(levelCit) {
        if (nextLevelPop < 0) {
            if (levelCit > playerInfos.gangXP) {
                nextLevelPop = levelCit;
            }
        }
    });
    return nextLevelPop;
};

function gangChoice() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","300px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="ListRes">Choisir dans cet ordre</span><br>');
    $('#conUnitList').append('<br>');
    // MAP DE DEPART
    $('#conUnitList').append('<span class="ListRes or">CHOISIR LA ZONE DE DEPART</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<select class="boutonGris" id="theStartZone" onchange="changePlayerInfo(`theStartZone`,`missionZone`,`gangChoice`)"></select>');
    $('#theStartZone').empty().append('<option value="97">Zone</option>');
    let i = 90;
    while (i <= 99) {
        let mType = getMissionType(i,true);
        if (playerInfos.misDB.includes(i)) {
            $('#theStartZone').append('<option value="'+i+'">'+i+' - '+mType.name+' ('+mType.title+')</option>');
        } else {
            $('#theStartZone').append('<option value="'+i+'" disabled>'+i+' - '+mType.name+' ('+mType.title+')</option>');
        }
        if (i > 99) {break;}
        i++
    }
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="butSpace"></span>');
    $('#conUnitList').append('<br>');
    // DIFFICULTE
    $('#conUnitList').append('<span class="ListRes or">CHOISIR LE NIVEAU DE DIFFICULTE</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<select class="boutonGrisBis" id="theDiffMode" onchange="changePlayerInfo(`theDiffMode`,`gMode`,`gangChoice`)"></select>');
    $('#theDiffMode').empty().append('<option value="2">Niveau</option>');
    $('#theDiffMode').append('<option value="1">J\'ai peur des bourdons</option>');
    $('#theDiffMode').append('<option value="2">Normal</option>');
    $('#theDiffMode').append('<option value="3">Les fourmis c\'est trop mignon</option>');
    $('#theDiffMode').append('<option value="4">La guêpe pepsis ça chatouille</option>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="butSpace"></span>');
    $('#conUnitList').append('<br>');
    // GANG
    $('#conUnitList').append('<span class="ListRes or">CHOISIR UN GANG</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<select class="boutonGris" id="theGangs" onchange="changePlayerInfo(`theGangs`,`gang`,`gangChoice`)"></select>');
    $('#theGangs').empty().append('<option value="rednecks">Gang</option>');
    $('#theGangs').append('<option value="rednecks">Rednecks</option>');
    $('#theGangs').append('<option value="blades">Blades</option>');
    $('#theGangs').append('<option value="bulbos">Bulbos Kapos</option>');
    $('#theGangs').append('<option value="drogmulojs">Drogmulojs</option>');
    $('#theGangs').append('<option value="tiradores">Tiradores</option>');
    $('#theGangs').append('<option value="detruas">Detruas</option>');
    $('#theGangs').append('<option value="brasier">Le Brasier</option>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="butSpace"></span>');

};

function gangLevelUp(retour) {
    selectMode();
    let nextGangLevel = playerInfos.gLevel+1;
    if (!retour && myCompPoints === 0) {
        myCompPoints = calcCompPoints(nextGangLevel);
    }
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","600px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    if (myCompPoints <= 0 && retour) {
        $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
        $('#conUnitList').append('<h3>VOUS AVEZ DEPENSE TOUS VOS POINTS</h3><br>');
        playerInfos.gLevel++;
        commandes();
    } else {
        $('#conUnitList').append('<h1>CHOISIR UNE COMPETENCE</h1><br>');
    }
    $('#conUnitList').append('<span class="ListRes">Niveau de gang: '+nextGangLevel+'</span><br>');
    $('#conUnitList').append('<span class="ListRes">Points à dépenser: '+myCompPoints+'</span><br>');
    $('#conUnitList').append('<br>');
    gangComps.forEach(function(comp) {
        let nowComp = playerInfos.comp[comp.name];
        let nextComp = playerInfos.comp[comp.name]+1;
        let compCost = comp.lvlCosts[nextComp];
        let colour = 'neutre';
        let lvlColour = 'gff';
        if (nowComp >= 1) {
            lvlColour = 'cy';
        }
        let costColour = 'rose';
        if (compCost >= 2) {
            costColour = 'rouge';
        }
        if (comp.maxLevel < nextComp) {
            compCost = 0;
            colour = 'cy';
            costColour = 'noir';
        }
        let rechOnly = false;
        if (comp.rechFirst != undefined) {
            if (comp.rechFirst) {
                if (playerInfos.comp[comp.name] === 0) {
                    rechOnly = true;
                }
            }
        }
        if (comp.rechLast != undefined) {
            if (comp.rechLast) {
                if (playerInfos.comp[comp.name] === comp.maxLevel-1) {
                    if (comp.rechPass != undefined) {
                        if (!comp.rechPass.includes(playerInfos.gang)) {
                            rechOnly = true;
                        }
                    } else {
                        rechOnly = true;
                    }
                }
            }
        }
        $('#conUnitList').append('<span class="paramName '+colour+' klik" title="'+comp.desc+'" onclick="compDetail('+comp.id+')">'+comp.fullName+'</span><span class="paramIcon '+costColour+'" title="Coût: '+compCost+'">('+compCost+')</span><span class="paramCompValue '+lvlColour+'" title="Niveau actuel">'+nowComp+'<span class="gff" title="Niveau maximum">/'+comp.maxLevel+'</span></span>');
        if (comp.levels[playerInfos.gang] <= nextGangLevel && comp.maxLevel >= nextComp) {
            if (compCost === 1 || (myCompPoints >= 2 && nextGangLevel >= 1)) {
                if (myCompPoints >= compCost && !rechOnly) {
                    $('#conUnitList').append('<span class="paramValue klik" title="Augmenter '+comp.fullName+' au niveau '+nextComp+' (coût: '+compCost+')" onclick="addComp('+comp.id+','+nextComp+')">'+nextComp+' >>></span>');
                }
            }
        }
    });
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="ListRes"></span><br>');
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function gangLevelView() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","600px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<h3>COMPETENCES</h3><br>');
    $('#conUnitList').append('<span class="ListRes">Gang: <span class="cy">'+playerInfos.gang+'</span></span><br>');
    $('#conUnitList').append('<span class="ListRes">Niveau de gang: <span class="cy">'+playerInfos.gLevel+'</span></span><br>');
    $('#conUnitList').append('<span class="ListRes">Expérience: '+playerInfos.gangXP+' / '+getNextLevelPop()+'</span><br>');
    $('#conUnitList').append('<br>');
    gangComps.forEach(function(comp) {
        let nowComp = playerInfos.comp[comp.name];
        let nextComp = playerInfos.comp[comp.name]+1;
        let compCost = comp.lvlCosts[nextComp];
        let colour = 'neutre';
        let costColour = 'gff';
        let gangIcon = getCompGangIcon(comp);
        if (compCost >= 2) {
            costColour = 'gf';
        }
        if (comp.maxLevel < nextComp) {
            compCost = 0;
            colour = 'cy';
            costColour = 'noir';
        }
        $('#conUnitList').append('<span class="paramName '+colour+' klik" title="'+comp.desc+'" onclick="compDetail('+comp.id+')">'+comp.fullName+' '+gangIcon+'</span><span class="paramIcon '+costColour+'" title="Coût">('+compCost+')</span><span class="paramCompValue cy" title="Niveau actuel">'+nowComp+'<span class="gff">/'+comp.maxLevel+'</span></span>');
    });
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="ListRes"></span><br>');
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function checkListedItem(stuff,comp) {
    let listMe = false;
    if (stuff.compReq != undefined) {
        if (stuff.compReq[comp.name] != undefined) {
            listMe = true;
        }
    }
    if (stuff.altCompReq != undefined) {
        if (stuff.altCompReq[comp.name] != undefined) {
            listMe = true;
        }
    }
    return listMe;
};

function getCompGangIcon(comp) {
    let gangIcon = '&#129003;';
    if (comp.essential.includes(playerInfos.gang)) {
        gangIcon = '&#128998;';
    } else if (comp.good.includes(playerInfos.gang)) {
        gangIcon = '&#129000;';
    }
    return gangIcon;
};

function compDetail(compId) {
    $("#tileInfos").css("display","block");
    $('#tileInfos').empty();
    let comp = getCompById(compId);
    let nextCompLevel = playerInfos.comp[comp.name]+1;
    let printCompLevel = nextCompLevel;
    if (nextCompLevel > comp.maxLevel) {
        printCompLevel = '(max)';
    }
    $('#tileInfos').append('<span class="blockTitle"><h1>'+comp.fullName+' '+printCompLevel+'</h1></span>');
    if (comp.desc != comp.fullName) {
        $('#tileInfos').append('<span class="fullLine brunf"><b>'+comp.desc+'</b></span>');
    }
    if (!isAdmin.low) {
        $('#tileInfos').append('<br><br><h4>&#127959; En construction...</h4><br>');
    } else {
        if (nextCompLevel > comp.maxLevel) {
            $('#tileInfos').append('<span class="fullLine vert"><b>Vous avez déjà le maximum dans cette compétence</b></span><br>');
        } else {
            $('#tileInfos').append('<span class="fullLine vert"><b>Liste des éléments auxquels vous auriez accès avec ce niveau en '+comp.fullName+'</b></span><br>');
        }
        $('#tileInfos').append('<span class="fullLine gf">(Sont listés seulement les éléments auxquels cette compétence pourrait donner accès)</span><br>');
        $('#tileInfos').append('<span class="fullLine or">Note: Cette partie est en construction. Pour l\'instant, rien n\'indique si des unités de votre gang ont accès à ces éléments!</span><br>');
        // $('#tileInfos').append('<div class="shSpace"></div>');
        let sepa = ' &nbsp;&#128206;&nbsp; ';
        let messageOK = 'DEJA ACCESSIBLE \n';
        let messageUP = 'ACCESSIBLE AVEC CE NIVEAU EN '+comp.fullName.toUpperCase()+' \n';
        let messageKO = 'INACCESSIBLE \n';
        // ARMURES
        $('#tileInfos').append('<br>');
        $('#tileInfos').append('<span class="fullLine cy"><b>Armures</b></span><br>');
        armorTypes.forEach(function(stuff) {
            if (stuff.cat === 'armor' && !stuff.name.includes('aucun')) {
                let listMe = checkListedItem(stuff,comp);
                if (listMe) {
                    let stuffInfo = showFullArmorInfo(stuff,false,true,false,false);
                    let compReqOK = checkCompReq(stuff);
                    if (compReqOK) {
                        stuffInfo = messageOK+stuffInfo;
                        $('#tileInfos').append(sepa);
                        $('#tileInfos').append('<span class="ListRes gff" title="'+stuffInfo+'">'+stuff.name+'</span>');
                    } else {
                        let upCompReqOK = checkUpCompReq(stuff,comp);
                        if (upCompReqOK) {
                            stuffInfo = messageUP+stuffInfo;
                            $('#tileInfos').append(sepa);
                            $('#tileInfos').append('<span class="ListRes vert" title="'+stuffInfo+'">'+stuff.name+'</span>');
                        } else {
                            stuffInfo = messageKO+stuffInfo;
                            $('#tileInfos').append(sepa);
                            $('#tileInfos').append('<span class="ListRes rouge" title="'+stuffInfo+'">'+stuff.name+'</span>');
                        }
                    }
                }
            }
        });
        $('#tileInfos').append(sepa);
        $('#tileInfos').append('<br>');
        // EQUIPEMENTS
        $('#tileInfos').append('<br>');
        $('#tileInfos').append('<span class="fullLine cy"><b>Equipements</b></span><br>');
        armorTypes.forEach(function(stuff) {
            if (stuff.cat === 'equip' && !stuff.name.includes('aucun')) {
                let listMe = checkListedItem(stuff,comp);
                if (listMe) {
                    let stuffInfo = showEquipFullInfo(stuff.name,true,false);
                    let compReqOK = checkCompReq(stuff);
                    if (compReqOK) {
                        stuffInfo = messageOK+stuffInfo;
                        $('#tileInfos').append(sepa);
                        $('#tileInfos').append('<span class="ListRes gff" title="'+stuffInfo+'">'+stuff.name+'</span>');
                    } else {
                        let upCompReqOK = checkUpCompReq(stuff,comp);
                        if (upCompReqOK) {
                            stuffInfo = messageUP+stuffInfo;
                            $('#tileInfos').append(sepa);
                            $('#tileInfos').append('<span class="ListRes vert" title="'+stuffInfo+'">'+stuff.name+'</span>');
                        } else {
                            stuffInfo = messageKO+stuffInfo;
                            $('#tileInfos').append(sepa);
                            $('#tileInfos').append('<span class="ListRes rouge" title="'+stuffInfo+'">'+stuff.name+'</span>');
                        }
                    }
                }
            }
        });
        $('#tileInfos').append(sepa);
        $('#tileInfos').append('<br>');
        // INFRASTRUCTURES
        $('#tileInfos').append('<br>');
        $('#tileInfos').append('<span class="fullLine cy"><b>Infrastructures</b></span><br>');
        armorTypes.forEach(function(stuff) {
            if (stuff.cat === 'infra' && stuff.name != 'Débris') {
                let listMe = checkListedItem(stuff,comp);
                if (listMe) {
                    let stuffInfo = showInfraInfo(stuff.name,true,false);
                    let compReqOK = checkCompReq(stuff);
                    if (compReqOK) {
                        stuffInfo = messageOK+stuffInfo;
                        $('#tileInfos').append(sepa);
                        $('#tileInfos').append('<span class="ListRes gff" title="'+stuffInfo+'">'+stuff.name+'</span>');
                    } else {
                        let upCompReqOK = checkUpCompReq(stuff,comp);
                        if (upCompReqOK) {
                            stuffInfo = messageUP+stuffInfo;
                            $('#tileInfos').append(sepa);
                            $('#tileInfos').append('<span class="ListRes vert" title="'+stuffInfo+'">'+stuff.name+'</span>');
                        } else {
                            stuffInfo = messageKO+stuffInfo;
                            $('#tileInfos').append(sepa);
                            $('#tileInfos').append('<span class="ListRes rouge" title="'+stuffInfo+'">'+stuff.name+'</span>');
                        }
                    }
                }
            }
        });
        $('#tileInfos').append(sepa);
        $('#tileInfos').append('<br>');
        // DROGUES
        $('#tileInfos').append('<br>');
        $('#tileInfos').append('<span class="fullLine cy"><b>Drogues</b></span><br>');
        armorTypes.forEach(function(stuff) {
            if (stuff.cat === 'drogue' && stuff.name != 'meca') {
                let listMe = checkListedItem(stuff,comp);
                if (listMe) {
                    let stuffInfo = stuff.info;
                    let compReqOK = checkCompReq(stuff);
                    if (compReqOK) {
                        stuffInfo = messageOK+stuffInfo;
                        $('#tileInfos').append(sepa);
                        $('#tileInfos').append('<span class="ListRes gff" title="'+stuffInfo+'">'+stuff.name+'</span>');
                    } else {
                        let upCompReqOK = checkUpCompReq(stuff,comp);
                        if (upCompReqOK) {
                            stuffInfo = messageUP+stuffInfo;
                            $('#tileInfos').append(sepa);
                            $('#tileInfos').append('<span class="ListRes vert" title="'+stuffInfo+'">'+stuff.name+'</span>');
                        } else {
                            stuffInfo = messageKO+stuffInfo;
                            $('#tileInfos').append(sepa);
                            $('#tileInfos').append('<span class="ListRes rouge" title="'+stuffInfo+'">'+stuff.name+'</span>');
                        }
                    }
                }
            }
        });
        $('#tileInfos').append(sepa);
        $('#tileInfos').append('<br>');
        // MUNITIONS
        $('#tileInfos').append('<br>');
        $('#tileInfos').append('<span class="fullLine cy"><b>Munitions</b></span><br>');
        ammoTypes.forEach(function(stuff) {
            let listMe = checkListedItem(stuff,comp);
            if (listMe) {
                let stuffInfo = showAmmoInfo(stuff.name,true,false);
                let compReqOK = checkCompReq(stuff);
                if (compReqOK) {
                    stuffInfo = messageOK+stuffInfo;
                    $('#tileInfos').append(sepa);
                    $('#tileInfos').append('<span class="ListRes gff" title="'+stuffInfo+'">'+stuff.name+'</span>');
                } else {
                    let upCompReqOK = checkUpCompReq(stuff,comp);
                    if (upCompReqOK) {
                        stuffInfo = messageUP+stuffInfo;
                        $('#tileInfos').append(sepa);
                        $('#tileInfos').append('<span class="ListRes vert" title="'+stuffInfo+'">'+stuff.name+'</span>');
                    } else {
                        stuffInfo = messageKO+stuffInfo;
                        $('#tileInfos').append(sepa);
                        $('#tileInfos').append('<span class="ListRes rouge" title="'+stuffInfo+'">'+stuff.name+'</span>');
                    }
                }
            }
        });
        $('#tileInfos').append(sepa);
        $('#tileInfos').append('<br>');
        // CRAFTINGS
        $('#tileInfos').append('<br>');
        $('#tileInfos').append('<span class="fullLine cy"><b>Crafting</b></span><br>');
        let newCrafts = 0;
        crafting.forEach(function(stuff) {
            let listMe = checkListedItem(stuff,comp);
            if (listMe) {
                let compReqOK = checkCompReq(stuff);
                if (!compReqOK) {
                    let upCompReqOK = checkUpCompReq(stuff,comp);
                    if (upCompReqOK) {
                        newCrafts++;
                    }
                }
            }
        });
        $('#tileInfos').append(sepa);
        if (newCrafts >= 2) {
            $('#tileInfos').append('<span class="ListRes vert">'+newCrafts+' nouveaux craftings</span>');
        } else if (newCrafts >= 1) {
            $('#tileInfos').append('<span class="ListRes vert">'+newCrafts+' nouveau crafting</span>');
        } else {
            $('#tileInfos').append('<span class="ListRes gff">'+newCrafts+' nouveau crafting</span>');
        }
        $('#tileInfos').append(sepa);
        $('#tileInfos').append('<br>');
    }

    $('#tileInfos').append('<br>');
    $("#tileInfos").animate({scrollTop:0},"fast");
};

function addComp(compId,nextComp) {
    let comp = getCompById(compId);
    let cost = comp.lvlCosts[nextComp];
    myCompPoints = myCompPoints-cost;
    playerInfos.comp[comp.name] = nextComp;
    commandes();
    gangLevelUp(true);
};

function calcCompPoints(nextGangLevel) {
    // C'est le bon !!!
    let theCompPoints = 0;
    if (nextGangLevel === 0) {
        if (playerInfos.gang === 'bulbos') {
            theCompPoints = 12;
        } else if (playerInfos.gang === 'drogmulojs') {
            theCompPoints = 11;
        } else {
            theCompPoints = 10;
        }
    } else {
        if (playerInfos.gang === 'rednecks') {
            if (nextGangLevel === 3) {
                theCompPoints = 2;
            } else if (nextGangLevel === 6) {
                theCompPoints = 2;
            } else if (nextGangLevel === 9) {
                theCompPoints = 2;
            } else if (nextGangLevel === 11) {
                theCompPoints = 2;
            } else if (nextGangLevel === 14) {
                theCompPoints = 2;
            } else if (nextGangLevel === 16) {
                theCompPoints = 2;
            } else if (nextGangLevel === 18) {
                theCompPoints = 2;
            } else {
                theCompPoints = 1;
            }
        }
        if (playerInfos.gang === 'blades') {
            if (nextGangLevel === 3) {
                theCompPoints = 2;
            } else if (nextGangLevel === 6) {
                theCompPoints = 2;
            } else if (nextGangLevel === 9) {
                theCompPoints = 2;
            } else if (nextGangLevel === 11) {
                theCompPoints = 2;
            } else if (nextGangLevel === 13) {
                theCompPoints = 2;
            } else if (nextGangLevel === 14) {
                theCompPoints = 2;
            } else if (nextGangLevel === 16) {
                theCompPoints = 2;
            } else if (nextGangLevel === 18) {
                theCompPoints = 2;
            } else {
                theCompPoints = 1;
            }
        }
        if (playerInfos.gang === 'bulbos') {
            if (nextGangLevel === 3) {
                theCompPoints = 2;
            } else if (nextGangLevel === 6) {
                theCompPoints = 2;
            } else if (nextGangLevel === 8) {
                theCompPoints = 2;
            } else if (nextGangLevel === 10) {
                theCompPoints = 2;
            } else if (nextGangLevel === 12) {
                theCompPoints = 2;
            } else if (nextGangLevel === 13) {
                theCompPoints = 2;
            } else if (nextGangLevel === 15) {
                theCompPoints = 2;
            } else if (nextGangLevel === 16) {
                theCompPoints = 2;
            } else if (nextGangLevel === 18) {
                theCompPoints = 2;
            } else {
                theCompPoints = 1;
            }
        }
        if (playerInfos.gang === 'drogmulojs') {
            if (nextGangLevel === 3) {
                theCompPoints = 2;
            } else if (nextGangLevel === 5) {
                theCompPoints = 2;
            } else if (nextGangLevel === 8) {
                theCompPoints = 2;
            } else if (nextGangLevel === 10) {
                theCompPoints = 2;
            } else if (nextGangLevel === 12) {
                theCompPoints = 2;
            } else if (nextGangLevel === 14) {
                theCompPoints = 2;
            } else if (nextGangLevel === 16) {
                theCompPoints = 2;
            } else if (nextGangLevel === 17) {
                theCompPoints = 2;
            } else if (nextGangLevel === 19) {
                theCompPoints = 2;
            } else {
                theCompPoints = 1;
            }
        }
        if (playerInfos.gang === 'tiradores') {
            if (nextGangLevel === 3) {
                theCompPoints = 2;
            } else if (nextGangLevel === 6) {
                theCompPoints = 2;
            } else if (nextGangLevel === 8) {
                theCompPoints = 2;
            } else if (nextGangLevel === 10) {
                theCompPoints = 2;
            } else if (nextGangLevel === 13) {
                theCompPoints = 2;
            } else if (nextGangLevel === 16) {
                theCompPoints = 2;
            } else if (nextGangLevel === 18) {
                theCompPoints = 2;
            } else {
                theCompPoints = 1;
            }
        }
        if (playerInfos.gang === 'detruas') {
            if (nextGangLevel === 3) {
                theCompPoints = 2;
            } else if (nextGangLevel === 6) {
                theCompPoints = 2;
            } else if (nextGangLevel === 8) {
                theCompPoints = 2;
            } else if (nextGangLevel === 10) {
                theCompPoints = 2;
            } else if (nextGangLevel === 12) {
                theCompPoints = 2;
            } else if (nextGangLevel === 15) {
                theCompPoints = 2;
            } else if (nextGangLevel === 18) {
                theCompPoints = 2;
            } else {
                theCompPoints = 1;
            }
        }
        if (playerInfos.gang === 'brasier') {
            if (nextGangLevel === 3) {
                theCompPoints = 2;
            } else if (nextGangLevel === 6) {
                theCompPoints = 2;
            } else if (nextGangLevel === 8) {
                theCompPoints = 2;
            } else if (nextGangLevel === 10) {
                theCompPoints = 2;
            } else if (nextGangLevel === 12) {
                theCompPoints = 2;
            } else if (nextGangLevel === 14) {
                theCompPoints = 2;
            } else if (nextGangLevel === 16) {
                theCompPoints = 2;
            } else if (nextGangLevel === 18) {
                theCompPoints = 2;
            } else {
                theCompPoints = 1;
            }
        }
    }
    return theCompPoints;
};
