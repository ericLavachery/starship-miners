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
            $('#conUnitList').append('<span class="ListRes '+batColor+' klik" onclick="warnLink('+bat.tileId+')">'+bat.type+'</span>&nbsp;&nbsp;');
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
                    if (batType.class === 'egg') {
                        batColor = 'rouge';
                    } else {
                        batColor = 'brun';
                    }
                }
                $('#conUnitList').append('<span class="ListRes '+batColor+' klik" onclick="warnLink('+bat.tileId+')">'+bat.type+'</span>&nbsp;&nbsp;');
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
    showEquip();
};

function showEquip() {
    $('#conUnitList').append('<br>');
    // ARMORS
    $('#conUnitList').append('<br><span class="constName vert">ARMURES</span><br>');
    armorTypes.forEach(function(armor) {
        if (armor.cat === 'armor') {
            if (armor.compReq != undefined) {
                let compReqOK = checkCompReq(armor);
                if (compReqOK) {
                    $('#conUnitList').append('<span class="constName gf">'+armor.name+' (+'+armor.armor+'/'+armor.ap+') '+armor.skills+'</span><br>');
                }
            } else if (!armor.name.includes('aucun')) {
                $('#conUnitList').append('<span class="constName gff">'+armor.name+' (+'+armor.armor+'/'+armor.ap+') '+armor.skills+'</span><br>');
            }
        }
    });
    // DROGUES
    $('#conUnitList').append('<br><span class="constName vert">DROGUES</span><br>');
    armorTypes.forEach(function(drug) {
        if (drug.cat === 'drogue') {
            if (drug.compReq != undefined) {
                let compReqOK = checkCompReq(drug);
                if (compReqOK) {
                    $('#conUnitList').append('<span class="constName gf">'+drug.name+'</span><br>');
                }
            } else if (!drug.name.includes('aucun')) {
                $('#conUnitList').append('<span class="constName gff">'+drug.name+'</span><br>');
            }
        }
    });
    // EQUIP
    $('#conUnitList').append('<br><span class="constName vert">EQUIPEMENTS</span><br>');
    armorTypes.forEach(function(equip) {
        if (equip.cat === 'equip') {
            if (equip.compReq != undefined) {
                let compReqOK = checkCompReq(equip);
                if (compReqOK) {
                    $('#conUnitList').append('<span class="constName gf">'+equip.name+'</span><br>');
                }
            } else if (!equip.name.includes('aucun')) {
                $('#conUnitList').append('<span class="constName gff">'+equip.name+'</span><br>');
            }
        }
    });
    // AMMOS
    $('#conUnitList').append('<br><span class="constName vert">AMMOS</span><br>');
    ammoTypes.forEach(function(ammo) {
        if (ammo.compReq != undefined) {
            let compReqOK = checkCompReq(ammo);
            if (compReqOK) {
                $('#conUnitList').append('<span class="constName gf">'+ammo.name+'</span><br>');
            }
        } else if (!ammo.noList) {
            $('#conUnitList').append('<span class="constName gff">'+ammo.name+'</span><br>');
        }
    });
    $('#conUnitList').append('<br>');
};

function changeBarbs(stop) {
    playerInfos.stopBarbs = stop;
    savePlayerInfos();
    gangNavig();
    gangEdit();
};

function changePlayerInfo(dropMenuId,infoName,from) {
    console.log(dropMenuId);
    console.log(infoName);
    console.log(from);
    let value = document.getElementById(dropMenuId).value;
    console.log(value);
    if (value === 'true') {
        playerInfos[infoName] = true;
    } else if (value === 'false') {
        playerInfos[infoName] = false;
    } else if (isNaN(value)) {
        playerInfos[infoName] = value;
    } else {
        playerInfos[infoName] = +value;
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
    console.log(infoName);
    console.log(from);
    if (from === 'gangChoice') {
        if (infoName === 'gang') {
            playerInfos.gangDef = true;
            if (playerInfos.gang === undefined) {
                playerInfos.gMode = 'rednecks';
            }
            if (playerInfos.gMode === undefined) {
                playerInfos.gMode = 2;
            } else {
                if (playerInfos.gMode < 1 || playerInfos.gMode > 4) {
                    playerInfos.gMode = 2;
                }
            }
            if (playerInfos.missionZone === undefined) {
                playerInfos.missionZone = 97;
            } else {
                if (playerInfos.missionZone < 90) {
                    playerInfos.missionZone = 97;
                }
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
    savePlayerInfos();
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

function alienUnitsChanges() {
    alienUnits.forEach(function(unit) {
        unit.hp = unit.hp+alienHPBase;
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

function allowedArmors(unit) {
    let protection = [];
    if (unit.skills.includes('a_light') || unit.skills.includes('a_mid') || unit.skills.includes('a_heavy')) {
        protection.push('aucune');
        protection.push('scrap');
        protection.push('kevlar');
        protection.push('swarwing');
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
        if (!unit.skills.includes('resistall')) {
            protection.push('combo');
        }
    }
    if (unit.skills.includes('a_light') || unit.skills.includes('a_mid') || unit.skills.includes('a_heavy')) {
        if (!unit.skills.includes('resistall')) {
            protection.push('duneg');
        }
        protection.push('tisal');
        protection.push('swing');
        protection.push('adamantite');
        if (!unit.skills.includes('fly') && !unit.skills.includes('dog')) {
            protection.push('battlesuit');
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
        if (!unit.skills.includes('resistall')) {
            protection.push('duneg');
        }
    }
    if (unit.skills.includes('a_elga')) {
        protection.push('aucune');
        protection.push('chobham');
        protection.push('battlesuit');
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
    }
    if (unit.skills.includes('b_heavy')) {
        if (!unit.skills.includes('resistall')) {
            protection.push('bulk');
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
        if (!unit.skills.includes('resistall')) {
            protection.push('bulk');
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
        if (!unit.skills.includes('resistall')) {
            protection.push('bulk');
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
    }
    return protection;
};

function playerSkillsUTChanges() {
    unitTypes.forEach(function(unit) {
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
            unit.transRes = Math.round(unit.transRes*landerFretTuning);
            unit.hp = Math.round(unit.hp*landerHPTuning);
        }
        let repairBonus = false;
        // VOLS SPACIAUX
        if (unit.skills.includes('transorbital') || unit.skills.includes('isvsp')) {
            if (unit.hySpeed != undefined) {
                unit.hySpeed = Math.ceil(unit.hySpeed/(playerInfos.comp.vsp+4)*5);
            }
            if (playerInfos.comp.vsp >= 1) {
                if (unit.compReq === undefined && unit.compHardReq === undefined) {
                    unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.vsp);
                    if (unit.levels[playerInfos.gang] < 1) {
                        unit.levels[playerInfos.gang] = 1;
                    }
                }
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
        if (playerInfos.comp.const >= 1 && playerInfos.comp.ind >= 1 && unit.kind === 'zero-construction') {
            unit.levels[playerInfos.gang] = unit.levels[playerInfos.gang]-(playerInfos.comp.const*2);
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
        if (playerInfos.comp.ind >= 1 && unit.cat === 'vehicles') {
            if (unit.skills.includes('robot')) {
                unit.hp = unit.hp+Math.round(unit.hp/5*playerInfos.comp.ind);
            } else {
                unit.hp = unit.hp+Math.round(unit.hp/15*playerInfos.comp.ind);
            }
            unit.fabTime = unit.fabTime/(playerInfos.comp.ind+3)*3;
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
                    unit.weapon.rof = Math.ceil(unit.weapon.rof*1.5);
                }
                if (Object.keys(unit.weapon2).length >= 3) {
                    unit.weapon2.rof = Math.ceil(unit.weapon2.rof*1.5);
                }
            }
        }
        if (playerInfos.comp.def >= 2 && (unit.cat === 'buildings' || unit.cat === 'devices')) {
            if (Object.keys(unit.weapon).length >= 3) {
                unit.weapon.rof = Math.ceil(unit.weapon.rof*(defComp+7)/7);
            }
            if (Object.keys(unit.weapon2).length >= 3) {
                unit.weapon2.rof = Math.ceil(unit.weapon2.rof*(defComp+7)/7);
            }
            if (unit.weapon3 != undefined) {
                if (Object.keys(unit.weapon3).length >= 3) {
                    unit.weapon3.rof = Math.ceil(unit.weapon3.rof*(defComp+7)/7);
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
                        if (playerInfos.comp.def >= 3) {
                            unit.weapon2.kit = false;
                        }
                    }
                }
            }
        }
        // BALISTIQUE / ARTIlLERIE
        if (playerInfos.comp.bal === 3 || playerInfos.comp.arti === 2) {
            if (playerInfos.comp.arti >= 1) {
                let rangeMult = 1;
                if (playerInfos.comp.arti === 2) {
                    rangeMult = rangeMult+0.25;
                    if (playerInfos.comp.bal === 3) {
                        rangeMult = rangeMult+0.1;
                    }
                } else {
                    if (playerInfos.comp.bal === 3) {
                        rangeMult = rangeMult+0.15;
                    }
                }
                if (Object.keys(unit.weapon).length >= 3) {
                    if (unit.weapon.isArt) {
                        unit.weapon.range = Math.ceil(unit.weapon.range*rangeMult);
                    }
                }
                if (Object.keys(unit.weapon2).length >= 3) {
                    if (unit.weapon2.isArt) {
                        unit.weapon2.range = Math.ceil(unit.weapon2.range*rangeMult);
                    }
                }
            }
        }
        // EXPLOSIFS
        if (unit.name === 'Mines wipeout') {
            let wipeJump = (playerInfos.comp.explo*2)+playerInfos.comp.arti-4;
            if (wipeJump >= 2) {
                unit.weapon2.range = wipeJump;
            }
        }
        if (unit.name === 'Champ de mines') {
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
                penBonus = 0.83;
            }
            if (Object.keys(unit.weapon).length >= 3) {
                if (unit.weapon.ammo.includes('obus') || unit.weapon.ammo.includes('missile') || unit.weapon.ammo.includes('missile-sunburst') || unit.weapon.ammo.includes('missile-vanguard') || unit.weapon.ammo.includes('dynamite') || unit.weapon.ammo.includes('grenade') || unit.weapon.ammo.includes('boulet')) {
                    if (playerInfos.comp.explo === 3) {
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
                    if (playerInfos.comp.explo === 3) {
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
                    if (unit.weapon.name.includes('plasma') || unit.weapon.name.includes('laser') || unit.weapon.name.includes('Electro') || unit.weapon.name.includes('Lightning') || unit.weapon.name.includes('BFG') || unit.weapon.name.includes('électrique') || unit.weapon.name.includes('Taser')) {
                        unit.weapon.power = Math.ceil(unit.weapon.power*(energComp+15)/15);
                    }
                }
                if (Object.keys(unit.weapon2).length >= 3) {
                    if (unit.weapon2.name.includes('plasma') || unit.weapon2.name.includes('laser') || unit.weapon2.name.includes('Electro') || unit.weapon2.name.includes('Lightning') || unit.weapon2.name.includes('BFG') || unit.weapon2.name.includes('électrique')) {
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
                    unit.volume = unit.volume/1.5;
                } else {
                    unit.volume = unit.volume/1.12;
                }
                unit.volume = unit.volume.toFixedNumber(2);
            }
            if (unit.skills.includes('barda')) {
                if (playerInfos.comp.log >= 3) {
                    unit.volume = 1;
                } else {
                    unit.volume = (unit.volume+2)/3;
                }
                unit.volume = unit.volume.toFixedNumber(2);
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
        if (playerInfos.comp.cam >= 1 && unit.skills.includes('maycamo') && unit.cat === 'infantry') {
            unit.skills.push('camo');
        } else if (playerInfos.comp.cam >= 1 && unit.skills.includes('maycamo') && unit.cat === 'vehicles' && unit.size < 20) {
            unit.skills.push('camo');
        } else if (playerInfos.comp.cam >= 2 && unit.skills.includes('maycamo') && (unit.cat === 'vehicles' || unit.cat === 'devices')) {
            unit.skills.push('camo');
        } else if (playerInfos.comp.cam >= 3 && unit.skills.includes('maycamo') && unit.cat === 'buildings') {
            unit.skills.push('camo');
        }
        if (playerInfos.comp.cam >= 1) {
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
        }
        if (playerInfos.comp.det >= 3) {
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

function landerFill() {
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
    $('#conUnitList').append('<span class="constName or">REMPLIR LE LANDER</span><br>');
    findLanders();
    let lastKind = '';
    let showkind = '';
    let showPrep = '';
    let bldNeed = [];
    let prodOK = true;
    let colour = '';
    // BATIMENTS
    let allUnitsList = unitTypes.slice();
    let sortedUnitsList = _.sortBy(_.sortBy(_.sortBy(allUnitsList,'name'),'cat'),'kind');
    sortedUnitsList.forEach(function(unit) {
        if (unit.moveCost === 99 && unit.kind != 'zero-vaisseaux' && unit.kind != 'zero-vm' && unit.name != 'Coffres' && !unit.skills.includes('prefab')) {
            prodOK = true;
            if (unit.levels[playerInfos.gang] > playerInfos.gLevel) {
                prodOK = false;
            }
            if (prodOK) {
                if (lastKind != unit.kind) {
                    showkind = unit.kind.replace(/zero-/g,"");
                    $('#conUnitList').append('<br><span class="constName vert" id="kind-'+unit.kind+'">'+showkind.toUpperCase()+'</span><br>');
                }
                if (prepaBld[unit.name] === undefined) {
                    showPrep = '';
                } else {
                    showPrep = '('+prepaBld[unit.name]+')';
                }
                bldNeed = [];
                if (unit.bldCost != 'none') {
                    bldNeed[0] = unit.bldCost;
                    colour = 'jaune'
                } else {
                    bldNeed = unit.bldReq;
                    if (unit.bldReq.length >= 1) {
                        colour = 'jaune'
                    } else {
                        colour = 'gris';
                    }
                }
                $('#conUnitList').append('<span class="constName klik '+colour+'" title="'+toNiceString(bldNeed)+'" onclick="fillLanderWithUnit('+unit.id+')">'+unit.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                if (unit.equip.length >= 2) {
                    unit.equip.forEach(function(equipName) {
                        if (equipName.includes('w1-') || equipName.includes('w2-')) {
                            let equip = getEquipByName(equipName);
                            let compReqOK = checkCompReq(equip);
                            if (compReqOK) {
                                let equipCountName = unit.id+'-'+equipName;
                                if (prepaBld[equipCountName] === undefined) {
                                    showPrep = '';
                                } else {
                                    showPrep = '('+prepaBld[equipCountName]+')';
                                }
                                $('#conUnitList').append('<span class="constName klik gff" onclick="fillLanderWithEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;'+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                            }
                        }
                    });
                }
                if (unit.protection.length >= 2) {
                    unit.protection.forEach(function(equipName) {
                        if (!equipName.includes('aucun')) {
                            let equip = getEquipByName(equipName);
                            let compReqOK = checkCompReq(equip);
                            if (compReqOK) {
                                let equipCountName = unit.id+'-'+equipName;
                                if (prepaBld[equipCountName] === undefined) {
                                    showPrep = '';
                                } else {
                                    showPrep = '('+prepaBld[equipCountName]+')';
                                }
                                $('#conUnitList').append('<span class="constName klik gff" onclick="fillLanderWithEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;blindage '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                            }
                        }
                    });
                }
                lastKind = unit.kind;
            }
        }
    });
    // INFRASTRUCTURES
    $('#conUnitList').append('<br><span class="constName vert">INFRASTRUCTURES</span><br>');
    armorTypes.forEach(function(infra) {
        if (infra.fabTime != undefined) {
            prodOK = true;
            if (infra.levels[playerInfos.gang] > playerInfos.gLevel) {
                prodOK = false;
            }
            if (prodOK) {
                if (prepaBld[infra.name] === undefined) {
                    showPrep = '';
                } else {
                    showPrep = '('+prepaBld[infra.name]+')';
                }
                $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`'+infra.name+'`,false)">'+infra.name+' <span class="ciel">'+showPrep+'</span></span><br>');
            }
        }
    });
    if (prepaBld['Route'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+prepaBld['Route']+')';
    }
    $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`Route`,true)">Route <span class="ciel">'+showPrep+'</span></span><br>');
    if (prepaBld['Pont'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+prepaBld['Pont']+')';
    }
    $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`Pont`,true)">Pont <span class="ciel">'+showPrep+'</span></span><br>');
    // DROGUES
    $('#conUnitList').append('<br><span class="constName vert">DROGUES</span><br>');
    armorTypes.forEach(function(drug) {
        if (drug.cat != undefined) {
            if (drug.cat === 'drogue') {
                let drugCompOK = checkCompReq(drug);
                if (drugCompOK) {
                    if (prepaBld[drug.name] === undefined) {
                        showPrep = '';
                    } else {
                        showPrep = '('+prepaBld[drug.name]+')';
                    }
                    $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`'+drug.name+'`,false)">10 '+drug.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                }
            }
        }
    });
    // PACKS DE RESSOURCES
    $('#conUnitList').append('<br><span class="constName vert">PACKS DE RESSOURCES</span><br>');
    armorTypes.forEach(function(pack) {
        if (pack.name.includes('respack-')) {
            if (prepaBld[pack.name] === undefined) {
                showPrep = '';
            } else {
                showPrep = '('+prepaBld[pack.name]+')';
            }
            $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`'+pack.name+'`,false)">'+pack.info+' <span class="ciel">'+showPrep+'</span></span><br>');
        }
    });
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function fillLanderWithInfra(fillInfraName,road) {
    let fillInfra = {};
    if (road) {
        fillInfra = {};
        fillInfra.name = fillInfraName;
        fillInfra.costs = {};
        if (fillInfra.name === 'Pont') {
            fillInfra.costs['Scrap'] = 50;
            fillInfra.costs['Compo1'] = 150;
            if (playerInfos.comp.const >= 1) {
                fillInfra.costs['Compo1'] = 100;
            }
            fillInfra.costs['Compo2'] = 50;
            if (playerInfos.comp.const >= 2) {
                fillInfra.costs['Compo2'] = 33;
            }
        } else {
            fillInfra.costs['Compo1'] = 20;
            if (playerInfos.comp.const >= 1) {
                fillInfra.costs['Compo1'] = 14;
            }
        }
    } else {
        fillInfra = getInfraByName(fillInfraName);
    }
    console.log(fillInfra);
    let number = 1;
    if (fillInfra.cat === 'drogue') {
        number = 10;
    }
    addCost(fillInfra.costs,number);
    if (prepaBld[fillInfra.name] === undefined) {
        prepaBld[fillInfra.name] = number;
    }  else {
        prepaBld[fillInfra.name] = prepaBld[fillInfra.name]+number;
    }
    landerFill();
    console.log(prepaBld);
};

function fillLanderWithEquip(equipName,unitId) {
    let equip = getEquipByName(equipName);
    let unit = getBatTypeById(unitId);
    let flatCosts = getCosts(unit,equip,0,'equip');
    let deployCosts = getDeployCosts(unit,equip,0,'equip');
    addCost(flatCosts,1);
    addCost(deployCosts,1);
    let equipCountName = unitId+'-'+equip.name;
    if (prepaBld[equipCountName] === undefined) {
        prepaBld[equipCountName] = 1;
    }  else {
        prepaBld[equipCountName] = prepaBld[equipCountName]+1;
    }
    landerFill();
};

function fillLanderWithUnit(fillUnitId) {
    let fillUnit = getBatTypeById(fillUnitId);
    addCost(fillUnit.costs,1);
    addCost(fillUnit.deploy,1);
    let reqCit = fillUnit.squads*fillUnit.squadSize*fillUnit.crew;
    if (fillUnit.skills.includes('clone') || fillUnit.skills.includes('dog')) {
        reqCit = 0;
    }
    let citId = 126;
    if (fillUnit.skills.includes('brigands')) {
        citId = 225;
    }
    if (reqCit >= 1) {
        let lander = landers[0];
        let citBat = {};
        let citBatId = -1;
        bataillons.forEach(function(bat) {
            if (bat.loc === 'trans' && bat.locId === lander.id && bat.typeId === citId) {
                citBatId = bat.id;
                citBat = bat;
            }
        });
        if (citBatId >= 0) {
            citBat.citoyens = citBat.citoyens+reqCit;
        } else {
            let unitIndex = unitTypes.findIndex((obj => obj.id == citId));
            conselUnit = unitTypes[unitIndex];
            conselAmmos = ['xxx','xxx','xxx','xxx'];
            conselTriche = true;
            putBat(lander.tileId,reqCit,0,'',false);
            let citBat = getBatByTypeIdAndTileId(citId,lander.tileId);
            citBat.loc = 'trans';
            citBat.locId = lander.id;
            lander.transIds.push(citBat.id);
        }
    }
    if (prepaBld[fillUnit.name] === undefined) {
        prepaBld[fillUnit.name] = 1;
    }  else {
        prepaBld[fillUnit.name] = prepaBld[fillUnit.name]+1;
    }
    landerFill();
    // console.log(prepaBld);
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
                if (batType.skills.includes('clone') || batType.skills.includes('dog')) {
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
    playerInfos.endRes['Lore'] = playerInfos.gangXP+calcTurnXP(playerInfos.mapTurn);
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
                    if (batType.skills.includes('clone') || batType.skills.includes('dog')) {
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
            if (resResult != 0) {
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
            if (resResult === 0) {
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
            let unitXP = rand.rand(0,75);
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
    // conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselAmmos = startBatGear(conselUnit);
    conselTriche = true;
    if (schef) {
        putBat(tileId,0,xp,'schef');
    } else {
        putBat(tileId,0,xp);
    }
}

function startBatGear(unit) {
    // console.log('STARTBAT GEAR');
    let gear = ['xxx','xxx','scrap','xxx'];
    let gearChance = 1;
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
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Shooters');
            startBatList.push('Détenus');
            startBatList.push('Sapeurs');
            startBatList.push('Drones');
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
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Rainmen');
            startBatList.push('Tacots');
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
        }
        if (playerInfos.gMode <= 1) {
            startBatList.push('Hot girls');
            startBatList.push('Tôlards');
            startBatList.push('Tacots');
            startBatList.push('Bus');
        }
    }
    return startBatList;
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
    // addFreeBat(1893,'Aérodocks');
    addFreeBat(1833,'Générateur');
    addFreeBat(1773,'Crameur');
    addFreeBat(1707,'Dortoirs');
    addFreeBat(1767,'Dortoirs');
    addFreeBat(1827,'Dortoirs');
    addFreeBat(2007,'Sonde');
    addFreeBat(2008,'Sonde');
    addFreeBat(2009,'Sonde');
    addFreeBat(2010,'Sonde');
    addFreeBat(2011,'Sonde');
    addFreeBat(2067,'Sonde');
    addFreeBat(2068,'Sonde');
    addFreeBat(2069,'Sonde');
    addFreeBat(2070,'Sonde');
    addFreeBat(2071,'Sonde');
    addFreeBat(1587,'Impacteur');
    addFreeBat(1588,'Impacteur');
    addFreeBat(1589,'Impacteur');
    addFreeBat(1590,'Impacteur');
    addFreeBat(1591,'Impacteur');
    addFreeBat(1894,'Station météo');
    addFreeBat(1835,'Vidéotéléphonie');
    addFreeBat(1953,'Unités cryogéniques');
    addFreeBat(1713,'Salle de conférence');
    addFreeBat(1645,'Ascenceur');
    addFreeBat(1655,'Ascenceur');
    addFreeBat(2005,'Ascenceur');
    addFreeBat(2015,'Ascenceur');
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
    let thePeople = 1668+(30*(4-playerInfos.gMode))+(rand.rand(6,10)*6);
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

function gangLevelView() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","700px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="ListRes or">COMPETENCES</span><br>');
    $('#conUnitList').append('<span class="ListRes">Gang: '+playerInfos.gang+'</span><br>');
    $('#conUnitList').append('<span class="ListRes">Expérience: '+playerInfos.gangXP+'</span><br>');
    $('#conUnitList').append('<span class="ListRes">Niveau de gang: '+playerInfos.gLevel+'</span><br>');
    $('#conUnitList').append('<br>');
    gangComps.forEach(function(comp) {
        let nowComp = playerInfos.comp[comp.name];
        let nextComp = playerInfos.comp[comp.name]+1;
        let compCost = comp.lvlCosts[nextComp];
        let colour = 'neutre';
        let costColour = 'gff';
        if (compCost >= 2) {
            costColour = 'gf';
        }
        if (comp.maxLevel < nextComp) {
            compCost = 0;
            colour = 'cy';
            costColour = 'noir';
        }
        $('#conUnitList').append('<span class="paramName '+colour+'">'+comp.fullName+'</span><span class="paramIcon '+costColour+'" title="Coût">('+compCost+')</span><span class="paramCompValue cy" title="Niveau actuel">'+nowComp+'<span class="gff">/'+comp.maxLevel+'</span></span>');
    });
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="ListRes"></span><br>');
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

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
    $('#theStartZone').append('<option value="99">Zone 99 - Ile</option>');
    $('#theStartZone').append('<option value="98">Zone 98 - Ville</option>');
    $('#theStartZone').append('<option value="97">Zone 97 - Chemins</option>');
    $('#theStartZone').append('<option value="96" disabled>Zone 96</option>');
    $('#theStartZone').append('<option value="95" disabled>Zone 95</option>');
    $('#theStartZone').append('<option value="94" disabled>Zone 94</option>');
    $('#theStartZone').append('<option value="93" disabled>Zone 93</option>');
    $('#theStartZone').append('<option value="92" disabled>Zone 92</option>');
    $('#theStartZone').append('<option value="91" disabled>Zone 91</option>');
    $('#theStartZone').append('<option value="90" disabled>Zone 90</option>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="butSpace"></span>');
    $('#conUnitList').append('<br>');
    // DIFFICULTE
    $('#conUnitList').append('<span class="ListRes or">CHOISIR LE NIVEAU DE DIFFICULTE</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<select class="boutonGris" id="theDiffMode" onchange="changePlayerInfo(`theDiffMode`,`gMode`,`gangChoice`)"></select>');
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
    $('#conUnitList').css("height","700px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    if (myCompPoints <= 0 && retour) {
        $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
        $('#conUnitList').append('<span class="ListRes cy">VOUS AVEZ DEPENSE TOUS VOS POINTS</span><br>');
        playerInfos.gLevel++;
        commandes();
    } else {
        $('#conUnitList').append('<span class="ListRes or">CHOISIR UNE COMPETENCE</span><br>');
    }
    $('#conUnitList').append('<span class="ListRes">Niveau de gang: '+nextGangLevel+'</span><br>');
    $('#conUnitList').append('<span class="ListRes">Points à dépenser: '+myCompPoints+'</span><br>');
    $('#conUnitList').append('<br>');
    gangComps.forEach(function(comp) {
        let nowComp = playerInfos.comp[comp.name];
        let nextComp = playerInfos.comp[comp.name]+1;
        let compCost = comp.lvlCosts[nextComp];
        let colour = 'neutre';
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
        $('#conUnitList').append('<span class="paramName '+colour+'">'+comp.fullName+'</span><span class="paramIcon '+costColour+'" title="Coût">('+compCost+')</span><span class="paramCompValue cy" title="Niveau actuel">'+nowComp+'<span class="gff">/'+comp.maxLevel+'</span></span>');
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

function addComp(compId,nextComp) {
    let comp = getCompById(compId);
    let cost = comp.lvlCosts[nextComp];
    myCompPoints = myCompPoints-cost;
    playerInfos.comp[comp.name] = nextComp;
    commandes();
    gangLevelUp(true);
};

function calcCompPoints(nextGangLevel) {
    let theCompPoints = 0;
    if (nextGangLevel === 0) {
        if (playerInfos.gang === 'bulbos') {
            theCompPoints = 10;
        } else {
            theCompPoints = 8;
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
            } else if (nextGangLevel === 20) {
                theCompPoints = 2;
            } else if (nextGangLevel === 22) {
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
            } else if (nextGangLevel === 15) {
                theCompPoints = 2;
            } else if (nextGangLevel === 16) {
                theCompPoints = 2;
            } else if (nextGangLevel === 18) {
                theCompPoints = 2;
            } else if (nextGangLevel === 20) {
                theCompPoints = 2;
            } else if (nextGangLevel === 22) {
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
            } else if (nextGangLevel === 20) {
                theCompPoints = 2;
            } else if (nextGangLevel === 22) {
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
            } else if (nextGangLevel === 18) {
                theCompPoints = 2;
            } else if (nextGangLevel === 20) {
                theCompPoints = 2;
            } else if (nextGangLevel === 22) {
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
            } else if (nextGangLevel === 20) {
                theCompPoints = 2;
            } else if (nextGangLevel === 22) {
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
            } else if (nextGangLevel === 9) {
                theCompPoints = 2;
            } else if (nextGangLevel === 11) {
                theCompPoints = 2;
            } else if (nextGangLevel === 13) {
                theCompPoints = 2;
            } else if (nextGangLevel === 15) {
                theCompPoints = 2;
            } else if (nextGangLevel === 17) {
                theCompPoints = 2;
            } else if (nextGangLevel === 19) {
                theCompPoints = 2;
            } else if (nextGangLevel === 22) {
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
            } else if (nextGangLevel === 20) {
                theCompPoints = 2;
            } else if (nextGangLevel === 22) {
                theCompPoints = 2;
            } else {
                theCompPoints = 1;
            }
        }
    }
    return theCompPoints;
};
