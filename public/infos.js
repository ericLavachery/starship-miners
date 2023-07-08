function showBatInfos(bat) {
    if (!playerInfos.onStart) {
        $("#unitInfos").css("display","block");
        let batType = getBatType(bat);
        batInfos(bat,batType,false);
        $("#unitInfos").animate({scrollTop:0},"fast");
        if (bat.type === 'Soute') {
            viewPop();
        }
    }
};

function showBatPrefab(bat) {
    $("#unitInfos").css("display","block");
    let batType = getBatType(bat);
    let headPlace = 'unitInfos';
    let bodyPlace = 'unitInfos';
    $('#'+bodyPlace).empty();
    conWindowOut();
    let batPic = getBatPic(bat,batType);
    let unitsLeft = bat.squadsLeft*batType.squadSize;
    if (bat.citoyens >= 1) {
        unitsLeft = bat.citoyens;
    }
    if (batType.squads === 6 && batType.squadSize === 1 && (batType.cat === 'buildings' || batType.cat === 'devices' || batType.skills.includes('transorbital'))) {
        unitsLeft = '';
    } else if (batType.skills.includes('nonumname')) {
        unitsLeft = '';
    }
    $('#'+headPlace).append('<span class="blockTitle"><h3><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="48" class="tunit" onclick="batDetail('+bat.id+')">'+unitsLeft+' '+batType.name+'</h3></span>');
    $('#'+bodyPlace).append('<span class="constName jaune">Accès par la soute</span><br>');
    $('#'+bodyPlace).append('<button type="button" title="Aller dans la soute" class="boutonGris iconButtons" onclick="goSoutePrefab('+bat.id+')" onmousedown="clicSound()"><i class="fas fa-warehouse"></i></button>');
    $("#unitInfos").animate({scrollTop:0},"fast");
};

function goSoutePrefab(batId) {
    souteFilter = 'prefabs';
    souteTab = 'unitz';
    goSoute();
    batSouteSelect(batId);
};

function batDetail(batId) {
    modal.style.display = "block";
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    batInfos(bat,batType,true);
    batFullInfos(bat,batType);
    batDebarq = {};
};

function batInfos(bat,batType,pop) {
    decButHere = false;
    let headPlace = 'unitInfos';
    let bodyPlace = 'unitInfos';
    if (pop) {
        $('.modal-header').css('background-image','url(/static/img/oldmetal-ciel.jpg)');
        $('.modal-footer').css('background-image','url(/static/img/oldmetal-ciel.jpg)');
        headPlace = 'pophead';
        bodyPlace = 'popbody';
        $('#'+headPlace).empty();
    }
    $('#'+bodyPlace).empty();
    if (!pop) {
        conWindowOut();
    }
    if (bat.tdc === undefined) {
        bat.tdc = [];
    }
    updateBatProperties(bat,batType);
    let selfMove = checkSelfMove(bat,batType);
    levelUp(bat,batType);
    if (!playerInfos.onShip) {
        if (batType.skills.includes('transorbital')) {
            if (!bat.tags.includes('nomove')) {
                if (!bat.tags.includes('deploy')) {
                    bat.tags.push('deploy');
                }
            }
        }
        if (!batType.skills.includes('iscit')) {
            if (bat.tags.includes('nomove')) {
                if (!bat.tags.includes('outsider')) {
                    bat.tags.push('outsider');
                }
            }
        }
        if (batType.skills.includes('noselfmove') || bat.tags.includes('nopilots')) {
            tagDelete(bat,'outsider');
            tagDelete(bat,'nomove');
        }
    }
    doRegroup(bat,batType);
    if (playerInfos.onShip) {
        checkAmmoReqs(bat,batType);
    }
    if (batType.skills.includes('transorbital')) {
        checkModules(bat,batType);
    }
    let tagColor = 'cy';
    let batPic = getBatPic(bat,batType);
    let tile = getTile(bat);
    if (batType.skills.includes('transport')) {
        moveInsideBats(bat);
    }
    let unitsLeft = bat.squadsLeft*batType.squadSize;
    if (bat.citoyens >= 1) {
        unitsLeft = bat.citoyens;
    }
    if (batType.squads === 6 && batType.squadSize === 1 && (batType.cat === 'buildings' || batType.cat === 'devices' || batType.skills.includes('transorbital'))) {
        unitsLeft = '';
    } else if (batType.skills.includes('nonumname')) {
        unitsLeft = '';
    }
    let resMax = batType.transRes;
    if (bat.citoyens >= 1) {
        resMax = bat.citoyens;
    }
    if (hasEquip(bat,['megafret'])) {
        resMax = Math.round(resMax*1.33);
    }
    if (hasEquip(bat,['maxtrans'])) {
        resMax = Math.round(resMax/4);
    }
    if (hasEquip(bat,['garage'])) {
        resMax = resMax*2;
        if (resMax < 5000) {
            resMax = 5000;
        }
    }
    let vetIcon = '';
    if (bat.vet >= 1) {
        vetIcon = '<img src="/static/img/vet'+bat.vet+'.png" width="15">';
    }
    if (pop) {
        $('#'+headPlace).append('<img style="vertical-align:-12px;" src="/static/img/units/'+batType.cat+'/'+batPic+'.png" onclick="unitDetail('+batType.id+')" title="Voir le détail du type d\'unité">&nbsp;');
        $('#'+headPlace).append('<span class="blockTitle"><h6>'+unitsLeft+' '+batType.name+'</h6></span>');
    } else {
        $('#'+headPlace).append('<span class="blockTitle"><h3><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="48" class="tunit" onclick="batDetail('+bat.id+')">'+unitsLeft+' '+batType.name+'</h3> '+vetIcon+'</span>');
    }
    $('#'+bodyPlace).append('<div class="shSpace"></div>');
    let near = nearWhat(bat,batType);
    let nearby = nearbyAliens(bat);
    if (batType.moveCost < 90) {
        if (near.cleric) {
            if (!bat.tags.includes('zealot')) {
                bat.tags.push('zealot');
            }
        }
    }
    let noAuthority = checkNoAuthority(bat,batType);
    let inDanger = checkInDanger(bat,batType);
    if (near.friends && !friendsAlert) {
        if (!bat.tags.includes('nomove')) {
            if (noAuthority) {
                if (!noControlAlert) {
                    warning('Bataillons non contrôlés','Vous avez rejoint un ou plusieurs bataillons d\'un autre groupe.<br><span class="or">Vous ne pouvez pas en prendre contrôle</span> (Votre bataillon n\'inspire pas confiance).');
                    playSound('clic15',-0.2);
                    noControlAlert = true;
                }
            } else {
                warning('Bataillons non contrôlés','Vous avez rejoint un ou plusieurs bataillons d\'un autre groupe.<br><span class="cy">Vous pouvez en prendre contrôle</span> en cliquant dessus.');
                playSound('clic13',-0.2);
                friendsAlert = true;
            }
        }
    }
    let grade = '';
    if (batType.skills.includes('robot')) {
        grade = 'Robot';
    } else if (batType.skills.includes('clone')) {
        grade = 'Clone';
    } else if (batType.skills.includes('dog')) {
        grade = 'Dog';
    } else if (batType.crew === 0) {
        grade = batType.name;
    } else {
        grade = getGrade(bat,batType);
    }
    let gradeColor = 'rose';
    if (bat.tags.includes('schef') || batType.skills.includes('leader')) {
        gradeColor = 'sky';
    }
    let vetStatus = '';
    if (bat.tags.includes('schef') || batType.skills.includes('leader')) {
        vetStatus = ' <span class="rouge">(Chef)</span>';
    }
    if (bat.tags.includes('hero')) {
        vetStatus = ' <span class="rouge">(Héros)</span>';
    }
    if (bat.tags.includes('vet')) {
        vetStatus = ' (Vétéran)';
    }
    let armyNum = ' <span class="gff">(a<span class="neutre">'+bat.army+'</span>)</span>';
    if (bat.army === 0) {
        armyNum = '';
    }
    let isCharged = checkCharged(bat,'trans');
    let chargeIcon = '';
    if (isCharged) {
        chargeIcon = ' &nbsp;<i class="fas fa-truck marine" onclick="scrollToAnchor(`transBats`)"></i>';
    }
    let fretIcon = '';
    if (batType.transRes >= 1) {
        if (Object.keys(bat.transRes).length >= 1) {
            if (!near.loader && batType.moveCost > 90) {
                fretIcon = ' &nbsp;<i class="fas fa-truck-loading rouge" onclick="scrollToBottom()"></i>';
            } else {
                fretIcon = ' &nbsp;<i class="fas fa-truck-loading caca" onclick="scrollToBottom()"></i>';
            }
        }
    }
    let chiefName = '';
    if (bat.chief != undefined) {
        if (bat.chief != '') {
            chiefName = bat.chief;
        }
    }
    if (pop) {
        $('#'+bodyPlace).append('<span class="basicText mauve">Ceci est la description de ce bataillon en particulier.<br>Cliquez sur l\'image pour voir la description complète du type d\'unité.</span><br>');
        $('#'+bodyPlace).append('<div class="shSpace"></div>');
    }
    if ((grade != batType.name && grade != 'Caporal') || vetStatus != '' || armyNum != '' || chargeIcon != '' || fretIcon != '' || chiefName != '') {
        if (chiefName != '') {
            $('#'+bodyPlace).append('<span class="constName '+gradeColor+'">'+grade+' '+bat.chief+vetStatus+armyNum+fretIcon+chargeIcon+'</span><br>');
            $('#'+bodyPlace).append('<div class="shSpace"></div>');
        } else {
            $('#'+bodyPlace).append('<span class="constName '+gradeColor+'">'+grade+vetStatus+armyNum+fretIcon+chargeIcon+'</span><br>');
            $('#'+bodyPlace).append('<div class="shSpace"></div>');
        }
    }
    // TYPE D'UNITE
    if (pop) {
        let typun = getFullUnitType(batType);
        if (typun.name.includes('préfabriqué')) {
            if (bat.tags.includes('noprefab')) {
                typun.name = typun.name.replace(' préfabriqués','');
                typun.name = typun.name.replace(' préfabriqué','');
            }
        }
        $('#'+bodyPlace).append('<span class="paramName">Type</span><span class="paramIcon"></span><span class="paramValue">'+typun.name+'</span><br>');
    }
    let allTags = _.countBy(bat.tags);
    // AP
    let ap = getBatAP(bat,batType);
    let hourglass = 'start';
    if (bat.apLeft < ap/6*5) {
        if (batType.skills.includes('guerrilla')) {
            if (bat.apLeft < -4) {
                hourglass = 'end or';
            } else {
                hourglass = 'half jaune';
            }
        } else {
            if (bat.apLeft <= 0) {
                hourglass = 'end or';
            } else {
                hourglass = 'half jaune';
            }
        }
    }
    if (!selfMove) {
        if (!batType.skills.includes('transorbital')) {
            let crewNeed = batType.squads*batType.squadSize*batType.crew;
            $('#'+bodyPlace).append('<span class="paramName or" title="Sans équipage! Embarquez un bataillon pour créer un équipage temporaire. Vous pouvez créer un équipage définitif avec '+crewNeed+' citoyens (Si vous êtes à côté d\'un lander, dans la soute de la station, où avec des citoyens embarqués).">Equipage</span><span class="paramIcon"><i class="fas fa-users"></i></span><span class="paramValue or">Non</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName or" title="Sans équipage! Ce lander ne peut pas décoller!">Equipage</span><span class="paramIcon"><i class="fas fa-users"></i></span><span class="paramValue or">Non</span><br>');
        }
    } else {
        if (batType.skills.includes('transorbital') && bat.tags.includes('nopilots')) {
            $('#'+bodyPlace).append('<span class="paramName or" title="Sans équipage! Ce lander ne peut pas décoller!">Equipage</span><span class="paramIcon"><i class="fas fa-users"></i></span><span class="paramValue or">Non</span><br>');
        }
    }
    let roundApLeft = bat.apLeft.toFixedNumber(1);
    $('#'+bodyPlace).append('<span class="paramName">Points d\'action</span><span class="paramIcon"><i class="fas fa-hourglass-'+hourglass+'"></i></span><span class="paramValue">'+roundApLeft+'/'+ap+'</span><br>');
    if (batType.moveCost < 90) {
        let baseMoveCost = calcBaseMoveCost(bat,batType);
        let mvmt = ap/baseMoveCost;
        mvmt = mvmt.toFixedNumber(1);
        if (batType.moveCost > 90) {mvmt = 0;}
        if (bat.tags.includes('nopilots') || batType.skills.includes('noselfmove')) {
            if (selfMove) {
                $('#'+bodyPlace).append('<span class="paramName jaune" title="Sans équipage! Ne peux bouger que si vous embarquez un bataillon.">Mouvement</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue jaune">'+mvmt+'</span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="paramName or" title="Sans équipage! Ne peux bouger que si vous embarquez un bataillon.">Mouvement</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue or">0</span><br>');
            }
        } else {
            $('#'+bodyPlace).append('<span class="paramName">Mouvement</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue">'+mvmt+'</span><br>');
        }
        if (pop) {
            let bta = listBatTerrainAccess(batType,true,bat);
            $('#'+bodyPlace).append('<span class="paramName" title="Terrains accessibles">Terrains</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue" title="'+bta[1]+'">'+bta[0]+'</span><br>');
        }
    }
    // SQUADS
    let iconCol = 'gff';
    if (batType.name === 'Citoyens' || batType.name === 'Criminels') {
        if (bat.squadsLeft < Math.ceil(bat.citoyens/6)) {
            iconCol = 'or';
        }
    } else {
        if (bat.squadsLeft < batType.squads) {
            iconCol = 'or';
        }
    }
    $('#'+bodyPlace).append('<span class="paramName">Escouades</span><span class="paramIcon '+iconCol+'"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.squadsLeft+'/'+batType.squads+'</span><br>');
    let squadHP = batType.squadSize*batType.hp;
    if (iconCol === 'or' || bat.damage >= 1) {
        iconCol = 'or';
    } else {
        iconCol = 'gff';
    }
    $('#'+bodyPlace).append('<span class="paramName">Dégâts</span><span class="paramIcon '+iconCol+'"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    if (pop) {
        $('#'+bodyPlace).append('<span class="paramName">Unités/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+batType.squadSize+'</span><br>');
    }
    let totalCrew = batType.crew*batType.squadSize*batType.squads;
    if (bat.tags.includes('noprefab')) {
        totalCrew = Math.ceil(totalCrew/2);
    }
    if (bat.tags.includes('nopilots')) {
        totalCrew = 0;
    }
    if (pop) {
        $('#'+bodyPlace).append('<span class="paramName">Personnel</span><span class="paramIcon"><i class="fas fa-user-friends"></i></span><span class="paramValue">'+totalCrew+'</span><br>');
    }
    // PROTECTION
    if (pop) {
        let batHP = squadHP*batType.squads;
        $('#'+bodyPlace).append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span class="paramValue">'+batType.hp+' / '+squadHP+' / '+batHP+'</span><br>');
    }
    let armure = bat.armor;
    if (bat.tags.includes('fortif')) {
        if ((bat.tags.includes('hero') || bat.tags.includes('vet')) && batType.skills.includes('herofortif')) {
            armure = armure+2;
        } else if (batType.skills.includes('bigfortif')) {
            armure = armure+2;
            if (batType.skills.includes('cage')) {
                armure = armure+2;
            }
        } else if (armure < 2) {
            armure = armure+1;
        }
    }
    if (pop) {
        $('#'+bodyPlace).append('<span class="paramName">Armure</span><span class="paramIcon"><i class="fas fa-shield-alt"></i></span><span class="paramValue">'+armure+'</span><br>');
        let fortifCover = getCover(bat,true,false);
        if (bat.tags.includes('fortif')) {
            $('#'+bodyPlace).append('<span class="paramName">Couverture</span><span class="paramIcon"></span><span class="paramValue">'+fortifCover+'</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName">Couverture</span><span class="paramIcon"></span><span class="paramValue">'+fortifCover+'</span><br>');
        }
    }
    let stealth = getStealth(bat);
    let camChance = calcCamo(bat);
    if (canCamo(bat,batType,tile)) {
        $('#'+bodyPlace).append('<span class="paramName">Furtivité</span><span class="paramIcon"></span><span class="paramValue">'+stealth+' ('+camChance+'%)</span><br>');
    } else {
        $('#'+bodyPlace).append('<span class="paramName">Furtivité</span><span class="paramIcon"></span><span class="paramValue">'+stealth+'</span><br>');
    }
    let escaping = checkEscape(bat,batType);
    if (escaping.ok) {
        $('#'+bodyPlace).append('<span class="paramName">Escape</span><span class="paramIcon"></span><span class="paramValue">'+escaping.speed+'</span><br>');
    }
    let camoEnCours = false;
    if (bat.camoAP >= 1) {
        camoEnCours = true;
    }
    if (camoEnCours) {
        $('#'+bodyPlace).append('<span class="paramName cy">Mode furtif</span><span class="paramIcon"></span><span class="paramValue cy">En cours... ('+bat.camoAP+')</span><br>');
    } else {
        if (bat.tags.includes('camo') || bat.fuzz <= -2) {
            if (bat.fuzz <= -2) {
                $('#'+bodyPlace).append('<span class="paramName cy">Mode furtif</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="paramName or">Mode furtif</span><span class="paramIcon"></span><span class="paramValue or">Loupé</span><br>');
            }
        }
    }
    let batFuzz = calcBatAttraction(bat);
    if (pop) {
        $('#'+bodyPlace).append('<span class="paramName">Attraction</span><span class="paramIcon"></span><span class="paramValue">'+batFuzz+'</span><br>');
    }
    // TAGS
    if (bat.tags.includes('outsider')) {
        let outsiderMessage = 'Outsider: Sans effet';
        if (batType.crew >= 1 && !batType.skills.includes('brigands') && !batType.skills.includes('nocrime')) {
            outsiderMessage = 'Outsider: Si ce bataillon est démantelé, il se peut que les citoyens récupérés deviennent des criminels';
        }
        $('#'+bodyPlace).append('<span class="paramName jaune" title="'+outsiderMessage+'">Outsider</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
    }
    if (bat.tags.includes('nomove')) {
        $('#'+bodyPlace).append('<span class="paramName or" title="">Hors contrôle</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (batType.skills.includes('nofight')) {
        $('#'+bodyPlace).append('<span class="paramName jaune" title="Ne peux pas prendre contrôle d\'un bataillon d\'un autre groupe">Non combatant</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
    } else if (noAuthority) {
        if (inDanger) {
            $('#'+bodyPlace).append('<span class="paramName jaune" title="Ne peux pas prendre contrôle d\'un bataillon d\'un autre groupe">En perdition</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName jaune" title="Ne peux pas prendre contrôle d\'un bataillon d\'un autre groupe">Sans autorité</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
        }
    }
    if (bat.tags.includes('noprefab') && batType.skills.includes('prefab')) {
        $('#'+bodyPlace).append('<span class="paramName jaune" title="Ne peut pas être démonté et remonté. Vous pouvez seulement le démanteler.">Préfabriqué</span><span class="paramIcon"></span><span class="paramValue jaune">Non</span><br>');
    }
    if (bat.tags.includes('construction')) {
        $('#'+bodyPlace).append('<span class="paramName or">Opérationel</span><span class="paramIcon"></span><span class="paramValue or">Non</span><br>');
    }
    if (playerInfos.bldList.includes('Champ de force') || domeProtect) {
        if (domeProtect) {
            if (bat.type === 'Champ de force') {
                let endFF = bat.creaTurn+25;
                $('#'+bodyPlace).append('<span class="paramName cy">Dôme</span><span class="paramIcon"></span><span class="paramValue cy">Fin tour '+endFF+'</span><br>');
            } else if (bat.type === 'Dôme') {
                $('#'+bodyPlace).append('<span class="paramName cy">Dôme</span><span class="paramIcon"></span><span class="paramValue cy">Permanent</span><br>');
            }
        } else {
            if (bat.type === 'Champ de force') {
                $('#'+bodyPlace).append('<span class="paramName jaune">Dôme</span><span class="paramIcon"></span><span class="paramValue jaune">En construction</span><br>');
            } else if (bat.type === 'Dôme') {
                $('#'+bodyPlace).append('<span class="paramName jaune">Dôme</span><span class="paramIcon"></span><span class="paramValue jaune">En construction</span><br>');
            }
        }
    }
    if (playerInfos.comp.tele >= 2) {
        if (bat.eq === 'lifepod' || bat.eq === 'e-lifepod' || bat.eq === 'w1-lifepod' || bat.eq === 'w2-lifepod') {
            if (bat.eq === 'lifepod' || bat.eq === 'w1-lifepod' || bat.eq === 'w2-lifepod' || (!bat.tags.includes('podcd') && playerInfos.comp.tele >= 3)) {
                $('#'+bodyPlace).append('<span class="paramName cy">Lifepod</span><span class="paramIcon"></span><span class="paramValue cy">Actif</span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="paramName jaune">Lifepod</span><span class="paramIcon"></span><span class="paramValue jaune">Inactif</span><br>');
            }
        }
    }
    if (bat.tags.includes('embuscade')) {
        let embushBonus = Math.round(100*calcEmbushBonus(batType));
        $('#'+bodyPlace).append('<span class="paramName cy">Embuscade</span><span class="paramIcon"></span><span class="paramValue cy">'+embushBonus+'%</span><br>');
    }
    if (pop) {
        if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || batType.skills.includes('initiative') || hasEquip(bat,['detector','g2ai'])) {
            $('#'+bodyPlace).append('<span class="paramName cy">Guet</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
        }
    }
    if (batType.skills.includes('berserk') && bat.damage >= 1) {
        $('#'+bodyPlace).append('<span class="paramName cy">Berserk</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (batType.skills.includes('tirailleur')) {
        let guerBonus = 100;
        if (bat.oldTileId === bat.tileId) {
            $('#'+bodyPlace).append('<span class="paramName cy">Tirailleur</span><span class="paramIcon"></span><span class="paramValue cy">'+guerBonus+'%</span><br>');
        } else {
            guerBonus = Math.round(100*calcTiraBonus(batType));
            $('#'+bodyPlace).append('<span class="paramName cy">Tirailleur</span><span class="paramIcon"></span><span class="paramValue cy">'+guerBonus+'%</span><br>');
        }
    }
    if (pop) {
        if (bat.tags.includes('kirin') || bat.tags.includes('sila') || bat.tags.includes('bliss') || bat.tags.includes('blaze') || bat.tags.includes('skupiac') || bat.tags.includes('starka') || bat.tags.includes('octiron')) {
            let myDrugs = checkBatDrugs(bat);
            $('#'+bodyPlace).append('<span class="paramName cy">Drogue</span><span class="paramIcon"></span><span class="paramValue cy">'+myDrugs.toString()+'</span><br>');
        }
    }
    if (bat.tags.includes('kirin') || bat.tags.includes('genreg') || bat.tags.includes('slowreg') || bat.tags.includes('regeneration') || batType.skills.includes('regeneration') || batType.skills.includes('slowreg') || hasEquip(bat,['permakirin'])) {
        let regenType = 'lente';
        if (bat.tags.includes('kirin') || bat.tags.includes('genreg') || batType.skills.includes('regeneration') || bat.tags.includes('regeneration')) {
            regenType = 'rapide';
        }
        $('#'+bodyPlace).append('<span class="paramName cy">Régénération</span><span class="paramIcon"></span><span class="paramValue cy">'+regenType+'</span><br>');
    }
    // GENHAB
    if (bat.tags.includes('genstrong')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Hulk</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (bat.tags.includes('genblind')) {
        $('#'+bodyPlace).append('<span class="paramName jaune">Myope</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
    }
    if (bat.tags.includes('genfast')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Rapide</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (bat.tags.includes('genslow')) {
        $('#'+bodyPlace).append('<span class="paramName jaune">Lent</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
    }
    if (bat.tags.includes('genwater')) {
        $('#'+bodyPlace).append('<span class="paramName or" title="Allergique à l\'eau">Allergique</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('zombie')) {
        $('#'+bodyPlace).append('<span class="paramName or">Zombie</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (batType.skills.includes('dreduct') || bat.prt === 'kapton' || bat.prt.includes('suit') || bat.prt === 'bonibo' || bat.prt === 'swarwing' || bat.prt === 'tisal' || bat.prt === 'silk' || (bat.tags.includes('zealot') && batType.cat === 'infantry') || (bat.tags.includes('bliss') && batType.cat === 'infantry')) {
        $('#'+bodyPlace).append('<span class="paramName jaune" title="Ignore les petits dégâts">Réduction dégâts</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
    }
    if (bat.tags.includes('resistfeu') || batType.skills.includes('resistfeu')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Résistance feu</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (bat.tags.includes('resistacide') || batType.skills.includes('resistacide')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Résistance acide</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (bat.tags.includes('resistelec') || batType.skills.includes('resistelec')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Résistance électricité</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (bat.tags.includes('protectall') || batType.skills.includes('protectall')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Protection globale</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    } else if (bat.tags.includes('resistall') || batType.skills.includes('resistall')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Résistance globale</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (bat.tags.includes('moloko')) {
        $('#'+bodyPlace).append('<span class="paramName jaune">Saoul</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
    }
    if (bat.tags.includes('zealot')) {
        $('#'+bodyPlace).append('<span class="paramName jaune">Fanatique</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
    }
    // BAD TAGS
    if (bat.tags.includes('inflammable') || bat.eq === 'e-jetpack' || batType.skills.includes('inflammable')) {
        if (!bat.tags.includes('resistfeu')) {
            $('#'+bodyPlace).append('<span class="paramName jaune">Inflammable</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
        }
    }
    if (bat.emo >= 1) {
        let stress = bat.emo;
        if (bat.tags.includes('terror')) {
            $('#'+bodyPlace).append('<span class="paramName or">Stress</span><span class="paramIcon"></span><span class="paramValue or" title="Ce bataillon va fuir dès que des aliens sont proches et ne voudra plus les attaquer">Terrorisé!</span><br>');
        } else if (stress >= 11) {
            if (bat.tags.includes('octiron') || bat.tags.includes('bliss')) {
                $('#'+bodyPlace).append('<span class="paramName jaune">Stress</span><span class="paramIcon"></span><span class="paramValue jaune" title="Stress sous contrôle">('+stress+')</span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="paramName or">Stress</span><span class="paramIcon"></span><span class="paramValue or">'+stress+'</span><br>');
            }
        } else if (playerInfos.onShip) {
            $('#'+bodyPlace).append('<span class="paramName jaune">Stress</span><span class="paramIcon"></span><span class="paramValue jaune">'+stress+'</span><br>');
        }
    }
    if (batType.cat === 'vehicles' || batType.cat === 'buildings' || batType.cat === 'devices') {
        if (bat.soins >= 11) {
            let apLoss = checkVehiclesAPSoins(bat,batType);
            $('#'+bodyPlace).append('<span class="paramName jaune">Usure</span><span class="paramIcon"></span><span class="paramValue jaune">-'+apLoss+' PA</span><br>');
        }
    } else if (batType.cat === 'infantry') {
        if (bat.soins >= 11) {
            let effSoins = checkEffSoins(bat);
            $('#'+bodyPlace).append('<span class="paramName jaune">Efficacité soins</span><span class="paramIcon"></span><span class="paramValue jaune">'+effSoins+'%</span><br>');
        }
    }
    if (bat.tags.includes('blub')) {
        $('#'+bodyPlace).append('<span class="paramName or">Noyade</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('mud')) {
        $('#'+bodyPlace).append('<span class="paramName or">Immobilisé</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('poison')) {
        $('#'+bodyPlace).append('<span class="paramName or">Poison</span><span class="paramIcon"></span><span class="paramValue or">'+allTags.poison+'</span><br>');
    }
    if (bat.tags.includes('venin')) {
        $('#'+bodyPlace).append('<span class="paramName or">Venin</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('parasite')) {
        $('#'+bodyPlace).append('<span class="paramName or">Parasite</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('vomissure') || bat.tags.includes('vomi')) {
        $('#'+bodyPlace).append('<span class="paramName or" title="Attaque génétique">Gangrène</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    } else if (bat.tags.includes('necro')) {
        $('#'+bodyPlace).append('<span class="paramName or">Nécrotoxine</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('maladie')) {
        $('#'+bodyPlace).append('<span class="paramName or">Malade</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('dying')) {
        $('#'+bodyPlace).append('<span class="paramName or">Mourrant</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    } else if (bat.tags.includes('hungry')) {
        $('#'+bodyPlace).append('<span class="paramName jaune">Souffrant</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
    }
    if (bat.tags.includes('trou')) {
        $('#'+bodyPlace).append('<span class="paramName or">Blindage troué</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('fogged')) {
        $('#'+bodyPlace).append('<span class="paramName or">Fog</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    // XP
    if (pop) {
        $('#'+bodyPlace).append('<span class="paramName">Expérience</span><span class="paramIcon"></span><span class="paramValue">'+Math.floor(bat.xp)+' (niveau '+bat.vet+')</span><br>');
    }
    // Volume
    let volume = calcVolume(bat,batType);
    let prefabWeight = calcPrefabWeight(batType);
    let showVolume = false;
    if (batType.skills.includes('prefab')) {
        showVolume = true;
    } else if (batType.cat != 'buildings' && batType.cat != 'devices' && !batType.skills.includes('transorbital')) {
        showVolume = true;
    }
    if (showVolume) {
        if (prefabWeight >= 1) {
            $('#'+bodyPlace).append('<span class="paramName">Volume</span><span class="paramIcon"><i class="fas fa-weight-hanging"></i></span><span class="paramValue">'+volume+'</span><br>');
            $('#'+bodyPlace).append('<span class="paramName">Volume (ressources)</span><span class="paramIcon"><i class="fas fa-weight-hanging"></i></span><span class="paramValue">'+prefabWeight+'</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName">Volume</span><span class="paramIcon"><i class="fas fa-weight-hanging"></i></span><span class="paramValue">'+volume+'</span><br>');
        }
    }
    if (pop) {
        $('#'+bodyPlace).append('<span class="paramName">Taille</span><span class="paramIcon"></span><span class="paramValue">'+batType.size+'</span><br>');
        if (batType.skills.includes('prefab')) {
            if (batType.fabTime < 35) {
                $('#'+bodyPlace).append('<span class="paramName" title="Construction et déconstruction">Construction</span><span class="paramIcon"></span><span class="paramValue" title="Avec les véhicules et les infanteries">Sapeurs</span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="paramName" title="Construction et déconstruction">Construction</span><span class="paramIcon"></span><span class="paramValue" title="Uniquement avec les véhicules">Pushers</span><br>');
            }
        }
    }
    // AUTOSKILLS
    if (batType.skills.includes('ravitaillement')) {
        let ravitNum = calcRavit(bat);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        if (batType.skills.includes('stockmed')) {
            $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">Officine</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">999/999</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">Ravitaillements</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batType.maxSkill+'</span><br>');
        }
    }
    if (batType.transUnits >= 1) {
        let transLeft = calcTransUnitsLeft(bat,batType);
        let transBase = batType.transUnits;
        if (hasEquip(bat,['megatrans'])) {
            if (batType.skills.includes('rescue')) {
                transBase = Math.round(transBase*1.1);
            } else {
                transBase = Math.round(transBase*1.25);
            }
        }
        if (batType.skills.includes('rescue') && playerInfos.gLevel >= 15) {
            let gangFactor = 1+((playerInfos.gLevel-14)/50);
            transBase = Math.round(transBase*gangFactor);
        }
        if (hasEquip(bat,['maxtrans'])) {
            transBase = calcTransWithBreak(transBase,batType);
        }
        if (hasEquip(bat,['garage'])) {
            transBase = transBase*2;
        }
        if (batType.skills.includes('transorbital') && playerInfos.mapTurn >= 2) {
            transBase = Math.round(transBase*bonusTransRetour);
        }
        let medicTrans = checkMedTrans(bat,batType);
        let mtPrint = '';
        if (medicTrans) {
            mtPrint = '<i class="fas fa-briefcase-medical neutre"></i> &nbsp';
        }
        if (transBase < 1000000) {
            $('#'+bodyPlace).append('<span class="paramName marine">'+mtPrint+'Transport</span><span class="paramIcon"></span><span class="paramValue marine">'+transLeft+'/'+transBase+'</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName marine">Transport</span><span class="paramIcon"></span><span class="paramValue marine">'+transLeft+'/</span><br>');
        }
    }
    if (batType.transRes >= 1) {
        let restSpace = checkResSpace(bat);
        if (restSpace < 1) {tagColor = 'or';} else {tagColor = 'caca';}
        $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">Fret</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+restSpace+'/'+resMax+'</span><br>');
    }
    if (batType.skills.includes('reserve') || batType.skills.includes('transorbital')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Réserve</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (batType.skills.includes('dealer')) {
        let ravitNum = calcRavitDrug(bat);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">Drogues</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batType.maxDrug+'</span><br>');
    }
    if (batType.skills.includes('landmine') || batType.skills.includes('dynamite') || batType.skills.includes('trapap') || batType.skills.includes('trapdard') || batType.skills.includes('trapfosse') || bat.eq === 'kit-sentinelle') {
        let ravitNum = calcRavit(bat);
        let trapName = getTrapName(bat,batType);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">'+trapName+'</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batType.maxSkill+'</span><br>');
    }
    if (batType.skills.includes('barbs')) {
        let ravitNum = calcRavit(bat);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">Barbelés</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batType.maxSkill+'</span><br>');
    }
    // Armure, équipements, habiletés
    let batprt = bat.prt;
    let protection = 'Blindage';
    if (batType.cat === 'infantry') {
        protection = 'Armure';
    }
    $('#'+bodyPlace).append('<span class="paramName">'+protection+'</span><span class="paramIcon"></span><span class="paramValue lcy klik" onclick="equipDetails(`'+batprt+'`)">'+batprt+' <span class="neutre">(a'+bat.armor+')</span></span><br>');
    let bateq = bat.eq;
    if (!bateq.includes('aucun')) {
        $('#'+bodyPlace).append('<span class="paramName">Equipement</span><span class="paramIcon"></span><span class="paramValue lcy klik" onclick="equipDetails(`'+bateq+'`)">'+bateq+'</span><br>');
    }
    if (bat.logeq != '') {
        $('#'+bodyPlace).append('<span class="paramName">Equipement</span><span class="paramIcon"></span><span class="paramValue lcy klik" onclick="equipDetails(`'+bat.logeq+'`)">'+bat.logeq+'</span><br>');
    }
    let tdcDesc = ['Equipements','Bonus compétences'];
    if (batType.skills.includes('penitbat')) {
        tdcDesc = ['TDC','Tombés du camion'];
    }
    if (pop) {
        if (bat.tdc.length >= 1) {
            $('#'+bodyPlace).append('<span class="paramName" title="'+tdcDesc[1]+'">'+tdcDesc[0]+'</span><span class="paramIcon"></span><span class="paramValue lcy">'+toNiceString(bat.tdc)+'</span><br>');
        }
    } else {
        if (bat.tdc.length === 1) {
            $('#'+bodyPlace).append('<span class="paramName" title="'+tdcDesc[1]+'">'+tdcDesc[0]+'</span><span class="paramIcon"></span><span class="paramValue lcy">'+bat.tdc[0]+'</span><br>');
        } else if (bat.tdc.length >= 2) {
            $('#'+bodyPlace).append('<span class="paramName" title="'+tdcDesc[1]+'">'+tdcDesc[0]+'</span><span class="paramIcon"></span><span class="paramValue lcy" title="'+toNiceString(bat.tdc)+'">'+bat.tdc[0]+'...</span><br>');
        }
    }
    // WEAPONS & SKILLS
    if (!pop) {
        if (!isStacked()) {
            if (!bat.tags.includes('terror')) {
                if (selfMove) {
                    weaponsInfos(bat,batType,tile,pop);
                }
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                skillsInfos(bat,batType,near,nearby,selfMove);
            }
        } else {
            if (!playerInfos.onShip || batType.id === 126 || batType.id === 225) {
                transInfos(bat,batType,isCharged);
            }
            if (!playerInfos.onShip) {
                defabInfos(bat,batType);
            }
        }
    } else {
        if (!bat.tags.includes('nopilots')) {
            weaponsInfos(bat,batType,tile,pop);
        }
        $('#'+bodyPlace).append('<div class="shSpace"></div>');
    }
    // ARMIES
    if (!pop) {
        $('#'+bodyPlace).append('<div class="shSpace"></div>');
        $('#'+bodyPlace).append('<span class="blockTitle"><h3>Armée</h3></span>');
        $('#'+bodyPlace).append('<select class="boutonGris" id="theArmies" onchange="armyAssign(`theArmies`)"></select>');
        let army = 0;
        while (army <= 20) {
            if (bat.army === army) {
                $('#theArmies').append('<option value="'+army+'" selected>Armée '+army+'</option>');
            } else {
                $('#theArmies').append('<option value="'+army+'">Armée '+army+'</option>');
            }
            if (army >= 20) {break;}
            army++
        }
    }
    // RESSOURCES transportées
    // console.log('HERE');
    if (!pop) {
        $('#'+bodyPlace).append('<span id="lefret"></span>');
    }
    if (batType.transRes >= 1 && !inSoute) {
        // console.log('btres');
        if (Object.keys(bat.transRes).length >= 1) {
            // console.log('bres');
            $('#'+bodyPlace).append('<div class="shSpace"></div>');
            $('#'+bodyPlace).append('<span class="blockTitle"><h3>Ressources</h3></span><br>');
            let transportedRes = JSON.stringify(bat.transRes);
            transportedRes = "<nobr>"+transportedRes;
            transportedRes = transportedRes.replace(/"/g,"");
            transportedRes = transportedRes.replace(/{/g,"");
            transportedRes = transportedRes.replace(/}/g,"");
            transportedRes = transportedRes.replace(/,/g,"</nobr> &nbsp;&horbar;&nbsp; <nobr>");
            transportedRes = transportedRes.replace(/:/g," ");
            transportedRes = transportedRes+"</nobr>";
            let resLoaded = checkResLoad(bat);
            let showTotal = '<span class="cy">'+resLoaded+'</span>/'+resMax;
            $('#'+bodyPlace).append('<span class="paramValue">'+transportedRes+' &nbsp;('+showTotal+')</span><br>');
        }
    }
    if (!pop) {
        $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Nommer le commandant de ce bataillon" class="boutonGris skillButtons" onclick="renameChief('+bat.id+')"><i class="fas fa-user-alt"></i></button>&nbsp; Commandant</h4></span>');
    }

    // DISMANTLE
    if (!pop) {
        $('#'+bodyPlace).append('<hr>');
        let demText;
        let fleeText;
        console.log(nearby);
        let okDis = checkDismantle(bat,batType);
        if (okDis && !decButHere) {
            let okKill = checkOkKill(batType);
            if (batType.skills.includes('recupres') || batType.skills.includes('recupcit') || (batType.skills.includes('recupcorps') && okKill) || batType.cat === 'buildings' || batType.skills.includes('okdel')) {
                if (batType.skills.includes('recupcit')) {
                    if (batType.skills.includes('recupres') || batType.cat === 'buildings') {
                        if (batType.skills.includes('nocrime')) {
                            demText = '(récupérer les citoyens et les ressources)';
                            fleeText = '(récupérer les citoyens)';
                        } else if (batType.skills.includes('brigands')) {
                            demText = '(récupérer les criminels et les ressources)';
                            fleeText = '(récupérer les criminels)';
                        } else if (bat.tags.includes('outsider')) {
                            demText = '(récupérer les citoyens ou criminels (50%) et les ressources)';
                            fleeText = '(récupérer les criminels (50%) ou citoyens)';
                        } else if (batType.cat === 'vehicles') {
                            demText = '(récupérer les citoyens ou criminels (20%) et les ressources)';
                            fleeText = '(récupérer les criminels (20%) ou citoyens)';
                        } else {
                            demText = '(récupérer les citoyens et les ressources)';
                            fleeText = '(récupérer les citoyens)';
                        }
                    } else {
                        if (batType.skills.includes('nocrime')) {
                            demText = '(récupérer les citoyens)';
                            fleeText = '(récupérer les citoyens)';
                        } else if (batType.skills.includes('brigands')) {
                            demText = '(récupérer les criminels)';
                            fleeText = '(récupérer les criminels)';
                        } else if (bat.tags.includes('outsider')) {
                            demText = '(récupérer les criminels (50%) ou citoyens)';
                            fleeText = '(récupérer les criminels (50%) ou citoyens)';
                        } else if (batType.cat === 'vehicles') {
                            demText = '(récupérer les criminels (20%) ou citoyens)';
                            fleeText = '(récupérer les criminels (20%) ou citoyens)';
                        } else {
                            demText = '(récupérer les citoyens)';
                            fleeText = '(récupérer les citoyens)';
                        }
                    }
                } else {
                    if (batType.skills.includes('recupres') || batType.cat === 'buildings') {
                        demText = '(récupérer des ressources)';
                    } else if (batType.skills.includes('recupcorps')) {
                        if (batType.skills.includes('dog')) {
                            demText = '(récupérer de la viande)';
                        } else {
                            demText = '(récupérer des corps)';
                        }
                    }
                }
                if (batType.skills.includes('okdel')) {
                    demText = '(détruire)';
                }
                let resRecup = getResRecup(bat,batType);
                if (playerInfos.onShip) {
                    $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Démanteler '+demText+' '+toCoolString(resRecup)+'" class="boutonRouge bigButtons" onclick="dismantle('+bat.id+',false)"><i class="fas fa-people-carry"></i></button>&nbsp; Démanteler</h4></span>');
                } else {
                    if (batType.cat === 'buildings' || batType.skills.includes('recupres')) {
                        $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Démanteler '+demText+' '+toCoolString(resRecup)+'" class="boutonRouge bigButtons" onclick="dismantle('+bat.id+',false)"><i class="fas fa-people-carry"></i></button>&nbsp; Démanteler</h4></span>');
                    }
                    $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Démanteler sans récupérer les ressources (et donc sans perdre de PA) '+fleeText+'" class="boutonRouge bigButtons" onclick="dismantle('+bat.id+',true)"><i class="fas fa-running"></i></button>&nbsp; Abandonner</h4></span>');
                }
            }
        }
        if (playerInfos.pseudo === 'Test' || playerInfos.pseudo === 'Payall' || playerInfos.pseudo === 'Mapedit' || allowCheat) {
            $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Supprimer le bataillon (triche!)" class="boutonCiel bigButtons" onclick="removeBat('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Supprimer</h4></span>');
        }
        if ((batType.transRes >= 1 && batType.name != 'Soute' && batType.name != 'Stocks') || (batType.transRes >= 1 && allowCheat)) {
            if (Object.keys(bat.transRes).length >= 1) {
                $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Jeter toutes les ressources" class="boutonRouge bigButtons" onclick="fretThrow()"><i class="fas fa-truck-loading"></i></button>&nbsp; Vider</h4></span>');
            }
        }
        if (playerInfos.pseudo === 'Payall') {
            $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Storm!" class="boutonMauve bigButtons" onclick="stormThis('+bat.id+')"><i class="fas fa-meteor"></i></button>&nbsp; Storm!</h4></span>');
            if (batType.skills.includes('robot')) {
                $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Skygrub Test!" class="boutonMauve bigButtons" onclick="turnThisBot('+bat.id+')"><i class="fas fa-robot"></i></button>&nbsp; Turn!</h4></span>');
            }
        }
        // let resLoaded = checkResLoad(bat);
        // if (resLoaded >= 1) {
        // }
    }

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
};

function getInfoAdd(batType) {
    let infoAdd = '';
    if (batType.name === 'Camp d\'entraînement') {
        infoAdd = infoAdd+'Le Camp d\'entraînement fait gagner des points d\'expérience à vos bataillons lorsqu\'ils sont au repos, en zone et dans la station spatiale. En zone, ils gagnent encore plus d\'expérience si ils sont à l\'intérieur du camp.<br>';
        infoAdd = infoAdd+'La plupart des habilités de combat de vos bataillons gagnent en efficacité (bullseye, embuscade, guet...).<br>';
    }
    if (batType.name === 'Salle de sport') {
        infoAdd = infoAdd+'La Salle de sport fait gagner quelques points d\'expérience à vos bataillons lorsqu\'ils sont au repos dans la station spatiale.<br>';
    }
    if (batType.name === 'Station météo') {
        infoAdd = infoAdd+'La Station météo permet de voir l\'ensoleillement et les précipitations sur une zone.<br>';
        infoAdd = infoAdd+'Elle permet également de localiser les tempêtes sur la planète Horst.<br>';
    }
    if (batType.name === 'Usine') {
        infoAdd = infoAdd+'La présence d\'une Usine réduit grandement les coûts en PA des habilités de réparation (véhicules et bâtiments) de tous les bataillons.<br>';
    }
    if (batType.name === 'Chaîne de montage') {
        infoAdd = infoAdd+'La présence d\'une Chaîne de montage réduit les coûts en PA des habilités de réparation (véhicules et bâtiments) de tous les bataillons.<br>';
    }
    if (batType.name === 'Atelier') {
        infoAdd = infoAdd+'La présence d\'un Atelier réduit légèrement les coûts en PA des habilités de réparation de bâtiments de tous les bataillons.<br>';
    }
    if (batType.name === 'Garage') {
        infoAdd = infoAdd+'La présence d\'un Garage réduit légèrement les coûts en PA des habilités de réparation de véhicules de tous les bataillons.<br>';
        infoAdd = infoAdd+'Tous vos véhicules non volants gagnent 1 PA par tour.<br>';
    }
    if (batType.name === 'Aérodocks') {
        infoAdd = infoAdd+'Tous vos véhicules volants augmentent leurs PA par tour de 15%.<br>';
    }
    if (batType.name === 'Hôpital') {
        infoAdd = infoAdd+'La présence d\'un Hôpital réduit grandement les coûts en PA des habilités de soins de tous les bataillons.<br>';
    }
    if (batType.name === 'Infirmerie') {
        infoAdd = infoAdd+'La présence d\'une Infirmerie réduit les coûts en PA des habilités de soins de tous les bataillons.<br>';
    }
    if (batType.skills.includes('cram')) {
        infoAdd = infoAdd+'Ce bâtiment vous permet de brûler des ressources pour en faire de l\'énergie.<br>';
    }
    if (batType.skills.includes('monitoring')) {
        infoAdd = infoAdd+'Sans ce bâtiment, l\'équipement camkit des forces de l\'ordre ne sert à rien.<br>';
    }
    if (batType.name === 'Biopod') {
        infoAdd = infoAdd+'Les flèches bio, combinées avec le biopod, exterminent tous les aliens d\'un même type: Vous infectez 1 bug (ou tout autre race d\'alien), et tous les bugs présents dans la zone à ce moment vont périr à petit feu.<br>';
    }
    if (batType.name === 'Décharge') {
        infoAdd = infoAdd+'La Décharge vous permet de récupérer une plus grande partie du scrap produit par vos bâtiments et vos citoyens.<br>';
    }
    if (batType.name === 'Recyclab') {
        infoAdd = infoAdd+'Le Recyclab vous permet de purifier l\'eau que vous pompez dans les régions où elle est empoisonnée.<br>';
    }
    if (batType.name === 'Laboratoire') {
        infoAdd = infoAdd+'Le Laboratoire vous permet d\'avoir 1 bataillon de chercheurs supplémentaire.<br>';
    }
    if (batType.name === 'Centre de recherches') {
        let bonusSci = 2;
        if (playerInfos.gang === 'bulbos') {
            bonusSci = bonusSci+Math.floor(playerInfos.comp.det/2.5);
        } else {
            bonusSci = bonusSci+Math.floor(playerInfos.comp.det/5);
        }
        infoAdd = infoAdd+'Le Centre de recherches vous permet d\'avoir '+bonusSci+' bataillons de chercheurs supplémentaires (non cummulatif avec le Laboratoire).<br>Il vous permet également d\'aller sur la planète Gehenna.<br>';
    }
    if (batType.skills.includes('geo')) {
        infoAdd = infoAdd+'Ce bâtiment produit de l\'énergie grâce à une sonde dans le sol. Son rendement est bien meilleur sur un terrain où il y a du Magma.<br>';
    }
    if (batType.skills.includes('zombify')) {
        infoAdd = infoAdd+'Les bataillons d\'infanterie qui meurent à proximité de ces véhicules sont automatiquement ramenés à la vie. Enfin, presque...<br>';
    }
    if (batType.skills.includes('recycle')) {
        infoAdd = infoAdd+'Ces véhicules augmentent la production de scrap des bâtiments, et augmentent la récupération de ressources lors du démantèlement d\'un autre bataillon.<br>';
    }
    if (batType.name === "Usine d'armement") {
        infoAdd = infoAdd+'Ces bâtiment permet à vos bataillons de se ravitailler en missiles lorsqu\'ils sont à côté d\'un stock (Lander, Poudrière...).<br>';
    }
    if (batType.skills.includes('transveh')) {
        infoAdd = infoAdd+'Ces véhicules sont fait pour transporter d\'autres véhicules.<br>';
    }
    if (batType.skills.includes('landerfab')) {
        infoAdd = infoAdd+'Ce bataillon ne peut être déployé qu\'à côté d\'un lander.<br>';
    }
    if (batType.skills.includes('clone')) {
        infoAdd = infoAdd+'Les clones sont de plus en plus difficiles à soigner, et finissent par dépérir.<br>';
    }
    if (batType.skills.includes('norepair')) {
        if (batType.skills.includes('regroup')) {
            infoAdd = infoAdd+'Ce bataillon ne peut pas être réparé, mais vous pouvez regrouper plusieurs bataillons endommagés pour en faire 1 bataillon neuf.<br>';
        } else {
            infoAdd = infoAdd+'Ce bataillon ne peut pas être réparé.<br>';
        }
    }
    if (batType.skills.includes('scrapmorph')) {
        infoAdd = infoAdd+'Quand ce bataillon extrait du scrap d\'une ruine, il en transforme directement une partie en diverses ressources (dépendant du type de ruine).<br>';
    } else if (batType.skills.includes('maysm')) {
        infoAdd = infoAdd+'Si vous avez 4 en recyclage: Quand ce bataillon extrait du scrap d\'une ruine, il en transforme directement une partie en diverses ressources (dépendant du type de ruine).<br>';
    }
    if (batType.skills.includes('transcrap')) {
        let scrapRez = getScrapResList(batType.name);
        infoAdd = infoAdd+'Ce bâtiment permet de récupérer différentes ressources dans le scrap <span class="gf">('+toNiceString(scrapRez)+')</span>.<br>';
    }
    if (batType.skills.includes('nostatprod')) {
        infoAdd = infoAdd+'Ce bâtiment ne peut pas produire dans la station.<br>';
    }
    if (batType.skills.includes('nocrime')) {
        infoAdd = infoAdd+'Ce bataillon ne se démantèle jamais en criminels.<br>';
    }
    if (batType.skills.includes('nostation')) {
        infoAdd = infoAdd+'Ce bataillon ne peut pas être construit dans la station.<br>';
    }
    if (batType.skills.includes('roborepair')) {
        infoAdd = infoAdd+'Ce bataillon peut réparer les robots sans malus.<br>';
    }
    if (batType.skills.includes('reeq')) {
        infoAdd = infoAdd+'Les bataillons proches peuvent changer leurs équipements, armures et munitions.<br>';
    }
    if (batType.skills.includes('zerogrip')) {
        infoAdd = infoAdd+'Les hommes de cette infanterie sont dans des cages démontables. Ils bénéficient d\'une très bonne protection lorsque les cages sont montées (lorsque le bataillon est fortifié).<br>';
    }
    if (batType.skills.includes('nofear')) {
        infoAdd = infoAdd+'Ce bataillon est immunisé à la peur.<br>';
    }
    if (batType.name === 'Poste radio') {
        infoAdd = infoAdd+'Grâce aux renseignement donnés sur la position des ennemis, ce bâtiment augmente la furtivité de vos bataillons.<br>';
    }
    if (batType.name === 'Centre de com' || batType.name === 'QG') {
        infoAdd = infoAdd+'Grâce aux renseignement précis donnés sur la position des ennemis, ce bâtiment augmente grandement la furtivité de vos bataillons.<br>';
    }
    if (batType.name === 'Centre de com' || batType.name === 'QG') {
        infoAdd = infoAdd+'Distance de contrôle des robots doublée (passe de 6 à 12 cases pour tous les centres de contrôle).<br>';
        infoAdd = infoAdd+'Permet à la plupart de vos robots de fouiller les ruines.<br>';
        infoAdd = infoAdd+'Indispensable pour pouvoir atterrir sur la planète Horst.<br>';
    }
    if (batType.name === 'Poste radio' || batType.name === 'Centre de com' || batType.name === 'QG') {
        infoAdd = infoAdd+'Indispensable pour pouvoir atterrir sur la planète Sarak.<br>';
        infoAdd = infoAdd+'Permet à vos bataillons de recevoir l\'ordre d\'un chef dans toute la zone (habilité |commande|).<br>';
    }
    if (batType.name === 'QG') {
        infoAdd = infoAdd+'Tous vos bataillons augmentent leurs PA par tour de 10%.<br>';
    }
    return infoAdd;
};

function batFullInfos(bat,batType) {
    let infoAdd = getInfoAdd(batType);
    if (batType.info != undefined || batType.redInfo != undefined || infoAdd.length >= 2) {
        let infoBase = '';
        if (batType.info != undefined || batType.redInfo != undefined) {
            infoBase = batType.info;
            if (batType.redInfo != undefined) {
                infoBase = infoBase+'<br><span class="hjaune">'+batType.redInfo+'</span>';
            }
            infoAdd = '<br>'+infoAdd;
        }
        $('#popbody').append('<div class="shSpace"></div>');
        $('#popbody').append('<span class="blockTitle"><h4>Description</h4></span><br>');
        $('#popbody').append('<span class="basicText">'+infoBase+infoAdd+'</span><br><br>');
    }
    $('#popbody').append('<div class="shSpace"></div>');
    $('#popbody').append('<span class="blockTitle"><h4>Habilités spéciales</h4></span><br>');
    let isBat = false;
    if (Object.keys(bat).length >= 1) {
        isBat = true;
    }
    let sepa = ' &nbsp;&#9889;&nbsp; '
    let allSkills = sepa;
    if (batType.skills.includes('fortif')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut se fortifier">Fortification</span>'+sepa;
    }
    if (batType.skills.includes('bigfortif')) {
        allSkills = allSkills+'<span class="paramValue" title="Meilleur bonus de fortification">Fortification avancée</span>'+sepa;
    }
    if (!batType.skills.includes('noguet') && !batType.skills.includes('sentinelle') && !batType.skills.includes('fastguet')) {
        if (batType.cat != 'buildings' || batType.crew >= 1) {
            allSkills = allSkills+'<span class="paramValue" title="Peut faire le guet. Cadence de tir 100% en défense">Guet</span>'+sepa;
        }
    }
    if (batType.skills.includes('fastguet')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut se mettre en mode guet plus facilement (moins de PA). Cadence de tir 100% en défense">Guet rapide</span>'+sepa;
    }
    if (batType.skills.includes('sentinelle')) {
        allSkills = allSkills+'<span class="paramValue" title="Toujours en guet: Cadence de tir 100% en défense">Sentinelle</span>'+sepa;
    }
    if (batType.skills.includes('baddef')) {
        allSkills = allSkills+'<span class="paramValue" title="Cadence de tir seulement 85% en mode guet. Moins de bonus pour la fortification.">Seconde ligne</span>'+sepa;
    }
    if (batType.skills.includes('defense')) {
        allSkills = allSkills+'<span class="paramValue" title="Cadence de tir 135% en défense">Défense</span>'+sepa;
    }
    if (batType.skills.includes('bastion')) {
        allSkills = allSkills+'<span class="paramValue" title="Cadence de tir 200% en défense">Bastion</span>'+sepa;
    }
    if (batType.skills.includes('onedef')) {
        allSkills = allSkills+'<span class="paramValue" title="Un seul tir de riposte.">Riposte unique</span>'+sepa;
    }
    if (batType.skills.includes('gooddef')) {
        allSkills = allSkills+'<span class="paramValue" title="2 ripostes supplémentaires">Ripostes multiples</span>'+sepa;
    }
    if (batType.skills.includes('cible') || batType.skills.includes('w2cible')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut faire un tir bullseye avec une arme de précision: Puissance et précision augmentée mais cadence de tir diminuée">Bullseye</span>'+sepa;
    }
    if (batType.skills.includes('maycible')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut faire un tir bullseye (à condition d\'avoir 1+ en entraînement): Puissance et précision augmentée mais cadence de tir diminuée">Bullseye</span>'+sepa;
    }
    if (batType.skills.includes('rage')) {
        allSkills = allSkills+'<span class="paramValue" title="Bonus de puissance aux armes de mêlée (lorsque l\'habileté est déclenchée)">Rage</span>'+sepa;
    }
    if (batType.skills.includes('longshot')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut attaquer n\'importe quelle unité à sa portée (pas de restriction due à la mêlée)">Tir choisi</span>'+sepa;
    }
    if (batType.skills.includes('luckyshot')) {
        allSkills = allSkills+'<span class="paramValue">Lucky Shot</span>'+sepa;
    }
    if (batType.skills.includes('berserk')) {
        allSkills = allSkills+'<span class="paramValue" title="Si blessé: Cadence de tir 150% mais dégâts reçu 150%">Frénésie</span>'+sepa;
    }
    if (batType.skills.includes('superberserk')) {
        allSkills = allSkills+'<span class="paramValue" title="Si ce bataillon à perdu la moitié de ses escouades: Salves infinies">Berserk</span>'+sepa;
    }
    if (batType.skills.includes('undead')) {
        allSkills = allSkills+'<span class="paramValue" title="Les escouades blessées peuvent continuer à attaquer (la cadence de tir ne diminue pas)">Undead</span>'+sepa;
    }
    if (batType.skills.includes('embuscade')) {
        allSkills = allSkills+'<span class="paramValue" title="Cadence de tir doublée. Possible seulement en mode furtif. L\'unité doit bouger pour pouvoir en bénéficier à nouveau.">Embuscade</span>'+sepa;
    }
    if (batType.skills.includes('guerrilla')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut encore avancer à -4 PA. Peut encore riposter à -10 PA. Riposter ne coûte pas de PA. Ne riposte que 3 fois maximum.">Guerilla</span>'+sepa;
    }
    if (batType.skills.includes('tirailleur')) {
        allSkills = allSkills+'<span class="paramValue" title="Bonus défensif et offensif lorsque le bataillon est en mouvement.">Tirailleur</span>'+sepa;
    }
    if (batType.skills.includes('escape') || batType.skills.includes('dogescape')) {
        allSkills = allSkills+'<span class="paramValue" title="Permet parfois d\'éviter une partie des dégâts d\'un tir à distance">Evasion</span>'+sepa;
    }
    if (batType.skills.includes('camo')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut se mettre en mode furtif">Furtivité</span>'+sepa;
    }
    if (batType.skills.includes('maycamo')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut se mettre en mode furtif à condition d\'avoir un niveau suffisant dans la compétence de camouflage">Camouflage</span>'+sepa;
    }
    if (batType.skills.includes('emoteur')) {
        allSkills = allSkills+'<span class="paramValue" title="Permet au véhicule de rester furtif même en mouvement">Moteur silencieux</span>'+sepa;
    }
    if (batType.skills.includes('strong')) {
        if (batType.skills.includes('mutant')) {
            allSkills = allSkills+'<span class="paramValue" title="Moins de perte de PA avec les armures lourdes">Strong</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Moins de perte de PA avec les armures lourdes (à condition d\'avoir une Salle de sport)">Strong</span>'+sepa;
        }
    }
    if (batType.skills.includes('fly')) {
        if (batType.skills.includes('jetpack')) {
            allSkills = allSkills+'<span class="paramValue" title="Jetpack: Volant mais considéré au sol si les PA sont négatifs">Jetpack</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue">Volant</span>'+sepa;
        }
    }
    if (batType.skills.includes('hover')) {
        allSkills = allSkills+'<span class="paramValue">Amphibie</span>'+sepa;
    }
    if (batType.skills.includes('ranger') || batType.skills.includes('caterp')) {
        allSkills = allSkills+'<span class="paramValue" title="Déplacement peu affecté par la difficulté du terrain">Ranger</span>'+sepa;
    }
    if (batType.skills.includes('hscarpmove')) {
        allSkills = allSkills+'<span class="paramValue" title="Déplacement affecté d\'avantage par les terrains escarpés">Hard move</span>'+sepa;
    }
    if (batType.skills.includes('hardmove')) {
        allSkills = allSkills+'<span class="paramValue" title="Déplacement affecté d\'avantage par la difficulté du terrain">Hard move</span>'+sepa;
    }
    if (batType.skills.includes('tracked')) {
        allSkills = allSkills+'<span class="paramValue" title="Seulement 1 de ces bataillons peut être transporté dans un véhicule de transport de troupes">Tractable</span>'+sepa;
    }
    if (batType.skills.includes('tweight')) {
        allSkills = allSkills+'<span class="paramValue" title="Transporter des bataillons avec cette unité diminuera sa vitesse de déplacement">Surcharge (trans)</span>'+sepa;
    }
    if (batType.skills.includes('fweight')) {
        allSkills = allSkills+'<span class="paramValue" title="Transporter des ressources avec cette unité diminuera sa vitesse de déplacement">Surcharge (fret)</span>'+sepa;
    }
    if (batType.skills.includes('constructeur')) {
        if (batType.cat === 'infantry') {
            allSkills = allSkills+'<span class="paramValue" title="Peut construire des petits bâtiments et dispositifs">Constructeur</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Peut construire des bâtiments et dispositifs">Constructeur</span>'+sepa;
        }
    }
    if (batType.skills.includes('producteur')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut construire des véhicules et infanteries">Producteur</span>'+sepa;
    }
    if (batType.skills.includes('routes')) {
        if (batType.moveCost < 99) {
            allSkills = allSkills+'<span class="paramValue" title="Peut construire des routes">Routes</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Peut construire une route là où il est installé">Route</span>'+sepa;
        }
    }
    if (batType.skills.includes('fouille')) {
        if (batType.moveCost > 90) {
            allSkills = allSkills+'<span class="paramValue" title="Fouilles automatiquement les ruines">Fouille</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Peut fouiller les ruines">Fouille</span>'+sepa;
        }
    }
    if (batType.skills.includes('leader')) {
        allSkills = allSkills+'<span class="paramValue" title="Donne +1 PA à toutes les unités du gang de manière permanente">Leadership</span>'+sepa;
    }
    if (batType.skills.includes('prayer')) {
        allSkills = allSkills+'<span class="paramValue" title="Donne +3 PA à toutes les unités du gang pendant 1 tour, et +1 PA jusqu\'à la fin de la prière">Prière</span>'+sepa;
    }
    if (batType.skills.includes('cleric')) {
        allSkills = allSkills+'<span class="paramValue" title="Les bataillons proche de l\'adepte sont immunisés à la peur">Aura</span>'+sepa;
    }
    if (batType.skills.includes('brigands')) {
        if (batType.skills.includes('gcrim')) {
            allSkills = allSkills+'<span class="paramValue" title="Augmente grandement la criminalité">Bandit</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Augmente la criminalité">Escroc</span>'+sepa;
        }
    }
    if (batType.skills.includes('penitbat')) {
        allSkills = allSkills+'<span class="paramValue" title="Ce bataillon obtient des équipements gratuits. Au plus haut est votre taux de criminalité et au plus vous avez de bataillons de ce type, au mieux ils seront équipés.">Mafia</span>'+sepa;
    }
    if (batType.crime != undefined) {
        if (batType.crime < 0) {
            let crimePts = 0-batType.crime;
            if (batType.skills.includes('fo')) {
                allSkills = allSkills+'<span class="paramValue" title="Agît comme force de l\'ordre ('+crimePts+' pts)">Police</span>'+sepa;
            } else {
                allSkills = allSkills+'<span class="paramValue" title="Fait baisser la pénibilité ('+crimePts+' pts)">Commodité</span>'+sepa;
            }
        }
    }
    let kzinOK = false;
    if (batType.skills.includes('kzin') || batType.cat === 'buildings' || (batType.cat === 'devices' && batType.crew === 0) || batType.skills.includes('mutant') || batType.skills.includes('robot') || batType.skills.includes('transorbital')) {
        kzinOK = true;
    }
    if (!batType.skills.includes('prefab') && batType.cat === 'buildings') {
        kzinOK = false;
    }
    if (kzinOK) {
        if (batType.skills.includes('fly') && batType.cat != 'infantry') {
            allSkills = allSkills+'<span class="paramValue" title="Peut aller sur la planète Kzin à condition d\'avoir un stabilisateur ou un moteur de seconde génération">Kzin</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Peut aller sur la planète Kzin sans scaphandre">Kzin</span>'+sepa;
        }
    }
    if (batType.skills.includes('lowstress')) {
        allSkills = allSkills+'<span class="paramValue" title="Ce bataillon est moins sujet au stress">Maîtrise</span>'+sepa;
    }
    if (batType.skills.includes('medrange')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut soigner les bataillons à une distance de 2 cases">Ambulance</span>'+sepa;
    }
    if (batType.skills.includes('necrocure')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut soigner les bataillons infectés par la nécrotoxine">Necrocure</span>'+sepa;
    }
    if (batType.skills.includes('survivor')) {
        allSkills = allSkills+'<span class="paramValue" title="Survit à la première attaque fatale">Survivant</span>'+sepa;
    }
    if (batType.skills.includes('swim')) {
        allSkills = allSkills+'<span class="paramValue" title="Nagent mieux que les autres infanteries">Natation</span>'+sepa;
    }
    if (batType.skills.includes('taming')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut apprivoiser les Meatballs">Dressage</span>'+sepa;
    }
    if (batType.skills.includes('treuil')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut tirer les autres véhicule (leur passer des PA)">Treuil</span>'+sepa;
    }
    if (batType.skills.includes('inflammable')) {
        allSkills = allSkills+'<span class="paramValue" title="Prends plus de dégâts du feu">Inflammable</span>'+sepa;
    }
    if (batType.skills.includes('resistfeu')) {
        allSkills = allSkills+'<span class="paramValue" title="Prends moins de dégâts du feu">Résistance Feu</span>'+sepa;
    }
    if (batType.skills.includes('resistpoison')) {
        allSkills = allSkills+'<span class="paramValue" title="Immunisé aux poisons normaux, meilleures défenses contre les autres">Résistance Poison</span>'+sepa;
    }
    if (batType.skills.includes('resistacide')) {
        allSkills = allSkills+'<span class="paramValue" title="Prends moins de dégâts de l\'acide">Résistance Acide</span>'+sepa;
    }
    if (batType.skills.includes('resistelec')) {
        allSkills = allSkills+'<span class="paramValue" title="Prends moins de dégâts électriques">Résistance Electricité</span>'+sepa;
    }
    if (batType.skills.includes('resistall') || batType.skills.includes('protectall')) {
        allSkills = allSkills+'<span class="paramValue" title="Prends moins de dégâts (toutes sources)">Résistance globale</span>'+sepa;
    }
    if (batType.skills.includes('noaploss')) {
        allSkills = allSkills+'<span class="paramValue" title="Les attaques qui réduisent les PA ne font que très peu d\'effet">Protection Entrave</span>'+sepa;
    }
    if (batType.skills.includes('noblub')) {
        if (batType.cat === 'buildings' || batType.cat === 'devices') {
            allSkills = allSkills+'<span class="paramValue" title="Peut être construit dans l\'eau">Waterproof</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Ne se noie pas">Waterproof</span>'+sepa;
        }
    }
    if (batType.skills.includes('slowreg')) {
        allSkills = allSkills+'<span class="paramValue">Régénération lente</span>'+sepa;
    }
    if (batType.skills.includes('regeneration')) {
        allSkills = allSkills+'<span class="paramValue">Régénération rapide</span>'+sepa;
    }
    if (batType.skills.includes('dreduct')) {
        allSkills = allSkills+'<span class="paramValue" title="Ignore les petits dégâts">Réduction de dégâts</span>'+sepa;
    }
    if (batType.skills.includes('hyg')) {
        allSkills = allSkills+'<span class="paramValue" title="Améliore la résistance naturelle de vos bataillons contre les poisons, maladies etc...">Hygiène</span>'+sepa;
    }
    if (batType.skills.includes('repostress')) {
        allSkills = allSkills+'<span class="paramValue" title="Améliore la rémission psychologique en période de repos (jours passés dans la station)">Détente</span>'+sepa;
    }
    if (batType.skills.includes('repoheal')) {
        allSkills = allSkills+'<span class="paramValue" title="Améliore la rémission physique en période de repos (jours passés dans la station)">Rémission</span>'+sepa;
    }
    if (batType.skills.includes('chasse')) {
        if (batType.skills.includes('affut')) {
            allSkills = allSkills+'<span class="paramValue" title="Récupèrent vaguement du Gibier en forêt lorsqu\'ils sont inactifs et éloignés du Lander">Braconnage</span>'+sepa;
        } else if (batType.skills.includes('pistage')) {
            allSkills = allSkills+'<span class="paramValue" title="Récupèrent du Gibier en forêt lorsqu\'ils sont inactifs et éloignés du Lander">Chasse</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Récupèrent un peu de Gibier en forêt lorsqu\'ils sont inactifs et éloignés du Lander">Chasse</span>'+sepa;
        }
    }
    if (batType.skills.includes('xxxxx')) {
        allSkills = allSkills+'<span class="paramValue" title="zzzzzzzzz">Yyyyyy</span>'+sepa;
    }
    if (batType.skills.includes('xxxxx')) {
        allSkills = allSkills+'<span class="paramValue" title="zzzzzzzzz">Yyyyyy</span>'+sepa;
    }
    if (batType.skills.includes('xxxxx')) {
        allSkills = allSkills+'<span class="paramValue" title="zzzzzzzzz">Yyyyyy</span>'+sepa;
    }
    if (batType.skills.includes('xxxxx')) {
        allSkills = allSkills+'<span class="paramValue" title="zzzzzzzzz">Yyyyyy</span>'+sepa;
    }
    if (batType.skills.includes('radar')) {
        allSkills = allSkills+'<span class="paramValue" title="Permet de repérer les aliens furtifs et invisibles (distance variable)">Radar</span>'+sepa;
    }
    if (batType.skills.includes('snif')) {
        allSkills = allSkills+'<span class="paramValue" title="Permet de repérer les aliens furtifs et invisibles (2 cases)">Pisteur</span>'+sepa;
    }
    if (batType.skills.includes('prefab')) {
        allSkills = allSkills+'<span class="paramValue" title="Ce bâtiment peut être démonté et remonté avec un lander ou un pusher">Préfabriqué</span>'+sepa;
    }
    if (batType.skills.includes('infraz')) {
        if (batType.skills.includes('infast')) {
            allSkills = allSkills+'<span class="paramValue" title="Construction rapide d\'infrastructures (Miradors, Palissades etc...)">Infra-fast</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Construction d\'infrastructures (Miradors, Palissades etc...)">Infrastructures</span>'+sepa;
        }
    }
    if (batType.skills.includes('infbld')) {
        allSkills = allSkills+'<span class="paramValue" title="Construction d\'infrastructures possible si à côté d\'un bâtiment (Miradors, Palissades etc...)">Infrastructures</span>'+sepa;
    }
    if (batType.skills.includes('mir')) {
        allSkills = allSkills+'<span class="paramValue" title="Construction de Miradors possible si à côté d\'un bâtiment">Miradors</span>'+sepa;
    }
    if (batType.skills.includes('pal')) {
        allSkills = allSkills+'<span class="paramValue" title="Construction de Palissades possible si à côté d\'un bâtiment">Palissades</span>'+sepa;
    }
    if (batType.skills.includes('trou')) {
        allSkills = allSkills+'<span class="paramValue" title="Construction de Terriers">Terriers</span>'+sepa;
    }
    if (batType.skills.includes('infrahelp')) {
        allSkills = allSkills+'<span class="paramValue" title="Toutes les infanteries autour du bâtiment peuvent construire des infrastructures">Infra-help</span>'+sepa;
    }
    if (batType.skills.includes('genhab') || batType.skills.includes('genhab2') || batType.skills.includes('genhab3')) {
        allSkills = allSkills+'<span class="paramValue" title="Surprise :)">Variance génétique</span>'+sepa;
    }
    if (batType.skills.includes('exhelp')) {
        allSkills = allSkills+'<span class="paramValue" title="Vous pouvez augmenter l\'efficacité de ce bâtiment en y embarquant un bataillon de Mineurs, Scrapers ou Sapeurs">Assistance</span>'+sepa;
    }
    if (batType.skills.includes('craft')) {
        allSkills = allSkills+'<span class="paramValue" title="Augmente le nombre de crafts que vous pouvez faire en 3 jours">Crafting</span>'+sepa;
    }
    if (batType.skills.includes('control')) {
        allSkills = allSkills+'<span class="paramValue" title="Centre de contrôle pour les robots">Contrôle (robots)</span>'+sepa;
    }
    if (batType.skills.includes('crange')) {
        allSkills = allSkills+'<span class="paramValue" title="Ces robots ne peuvent se déplacer seuls qu\'à une certaine distance d\'un centre de contrôle">Connecté</span>'+sepa;
    }
    if (batType.skills.includes('cleaning') || (batType.cat === 'buildings' && batType.crew >= 1)) {
        allSkills = allSkills+'<span class="paramValue" title="Peut nettoyer les toiles, spores etc...">Nettoyage</span>'+sepa;
    }
    if (batType.skills.includes('conscont')) {
        allSkills = allSkills+'<span class="paramValue" title="Confection de containers">Coffres</span>'+sepa;
    }
    if (batType.skills.includes('autoapprov')) {
        allSkills = allSkills+'<span class="paramValue" title="Réapprovisionnement automatique si à 4 cases ou moins d\'un stock">Mulet</span>'+sepa;
    }
    if (batType.skills.includes('recherche')) {
        allSkills = allSkills+'<span class="paramValue" title="Recherche de compétences">Recherche</span>'+sepa;
    }
    $('#popbody').append('<span class="paramValue">'+allSkills+'</span>');
    $('#popbody').append('<div class="shSpace"></div>');
    // PRODUCTION
    let onlyScrap = false;
    if (batType.prod != undefined) {
        if (Object.keys(batType.prod).length === 1) {
            Object.entries(batType.prod).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (key === 'Scrap') {
                    onlyScrap = true;
                }
            });
        }
    }
    if (batType.skills.includes('prodres') && !onlyScrap) {
        $('#popbody').append('<div class="shSpace"></div>');
        $('#popbody').append('<span class="blockTitle"><h4>Production de ressources</h4></span><br>');
        let allProds = getAllProds(batType,65);
        $('#popbody').append('<span class="paramValue">'+toCoolString(allProds,true,true)+' <span class="gf">(3 semaines)</span></span><br>');
        let allProdCosts = getAllProdCosts(batType,65);
        $('#popbody').append('<span class="paramValue gf"><span class="mauve">Coûts de production:</span> '+toCoolString(allProdCosts,true)+' <span class="gf">(3 semaines)</span></span>');
        $('#popbody').append('<div class="shSpace"></div>');
    } else if (batType.skills.includes('solar')) {
        $('#popbody').append('<div class="shSpace"></div>');
        $('#popbody').append('<span class="blockTitle"><h4>Production de ressources</h4></span><br>');
        $('#popbody').append('<span class="paramValue"><span class="mauve">Dans la station:</span> Energie=3400 | <span class="mauve">En zone:</span> Variable <span class="gf">(3 semaines)</span></span><br>');
        let allProdCosts = getAllProdCosts(batType,65);
        $('#popbody').append('<span class="paramValue gf"><span class="mauve">Coûts de production:</span> '+toCoolString(allProdCosts,true)+' <span class="gf">(3 semaines)</span></span>');
        $('#popbody').append('<div class="shSpace"></div>');
    } else if (batType.skills.includes('upkeep')) {
        $('#popbody').append('<div class="shSpace"></div>');
        $('#popbody').append('<span class="blockTitle"><h4>Coûts de fonctionnement</h4></span><br>');
        let allProdCosts = getAllProdCosts(batType,65);
        $('#popbody').append('<span class="paramValue gf">'+toCoolString(allProdCosts,true)+' <span class="gf">(3 semaines)</span></span>');
        $('#popbody').append('<div class="shSpace"></div>');
    }
    // MINING
    if (batType.skills.includes('extraction')) {
        $('#popbody').append('<div class="shSpace"></div>');
        $('#popbody').append('<span class="blockTitle"><h4>Extraction de ressources</h4></span><br>');
        if (isBat) {
            let allMiningRates = getAllMiningRates(bat,batType);
            $('#popbody').append('<span class="paramValue">'+toCoolString(allMiningRates,true,true)+'</span>');
        } else {
            let allMiningRates = getUnitMiningRates(batType);
            $('#popbody').append('<span class="paramValue">'+toCoolString(allMiningRates,true,true)+'</span>');
        }
        $('#popbody').append('<div class="shSpace"></div>');
    }
    if (!isBat) {
        // EQUIPEMENTS
        if (batType.equip != undefined) {
            if (batType.equip.length >= 2) {
                let equipString = displayUnitEquips(batType);
                $('#popbody').append('<div class="shSpace"></div>');
                $('#popbody').append('<span class="blockTitle"><h4>Equipements disponibles</h4></span><br>');
                $('#popbody').append('<span class="paramValue">'+equipString+'</span><br>');
                $('#popbody').append('<div class="shSpace"></div>');
            }
        }
        // ARMURES
        if (batType.protection != undefined) {
            if (batType.protection.length >= 2) {
                let armorString = displayUnitArmors(batType);
                $('#popbody').append('<div class="shSpace"></div>');
                if (batType.cat === 'infantry' || (batType.cat === 'infantry' && batType.skills.includes('robot'))) {
                    $('#popbody').append('<span class="blockTitle"><h4>Armures disponibles</h4></span><br>');
                } else {
                    $('#popbody').append('<span class="blockTitle"><h4>Blindages disponibles</h4></span><br>');
                }
                $('#popbody').append('<span class="paramValue">'+armorString+'</span><br>');
                $('#popbody').append('<div class="shSpace"></div>');
            }
        }
    }
    // COSTS
    if (!isBat) {
        $('#popbody').append('<div class="shSpace"></div>');
        $('#popbody').append('<span class="blockTitle"><h4>Coûts de construction</h4></span><br>');
        let costString = '';
        if (batType.bldReq.includes('Station')) {
            $('#popbody').append('<span class="paramValue">Ce bâtiment ne peut pas être construit.</span>');
        } else {
            let reqString = displayUnitReqs(batType,true);
            if (batType.costs != undefined) {
                costString = displayCosts(batType.costs);
            }
            costString = costString.replace('{','');
            costString = costString.replace('}','');
            if (reqString.length >= 2) {
                $('#popbody').append('<span class="paramValue">'+reqString+'</span>');
                $('#popbody').append('<br>');
            }
            $('#popbody').append('<span class="paramValue"><span class="mauve">Ressources:</span> '+costString+'</span><br>');
        }
        if (playerInfos.onShip) {
            if (costString.includes('&#128683;')) {
                $('#popbody').append('<div class="shSpace"></div>');
                $('#popbody').append('<span class="paramValue"><span class="vert klik" onclick="tagAllMissingRes('+batType.id+')" title="Cliquez ici pour taguer les ressources qu\'il vous manque pour construire cette unité. Les ressources taguées seront mises en évidence sur les cartes.">>>>Taguer les ressources manquantes</span></span><br>');
            }
        }
    }
    $('#popbody').append('<div class="shSpace"></div>');
    $('#popbody').append('<div class="shSpace"></div>');
};

function displayWeaponAmmos(batType,thisWeapon) {
    let weapName = 'weapon';
    if (batType.weapon2.rof >= 1) {
        if (batType.weapon2.name === thisWeapon.name) {
            weapName = 'weapon2';
        }
    }
    let sepa = ' &nbsp;&#128206;&nbsp; ';
    let ammoString = '';
    ammoTypes.forEach(function(stuff) {
        if (batType[weapName].ammo.includes(stuff.name)) {
            let ammoInfo = showAmmoInfo(stuff.name,true);
            ammoString = ammoString+sepa+'<span title="'+ammoInfo+'">'+stuff.name+'</span>';
        }
    });
    ammoString = ammoString+sepa;
    return ammoString;
};

function displayUnitArmors(batType) {
    let sepa = ' &nbsp;&#128206;&nbsp; ';
    let armorString = '';
    armorTypes.forEach(function(stuff) {
        if (stuff.cat === 'armor' && !stuff.name.includes('aucun')) {
            if (batType.protection.includes(stuff.name)) {
                let armorInfo = showFullArmorInfo(stuff,true);
                armorString = armorString+sepa+'<span title="'+armorInfo+'">'+stuff.name+'</span>';
            }
        }
    });
    armorString = armorString+sepa;
    return armorString;
};

function displayUnitEquips(batType) {
    let sepa = ' &nbsp;&#128206;&nbsp; ';
    let equipString = '';
    armorTypes.forEach(function(stuff) {
        if (stuff.cat === 'equip' && !stuff.name.includes('aucun')) {
            if (batType.equip.includes(stuff.name)) {
                let w2OK = true;
                if (stuff.name.includes('w2-') && !stuff.name.includes('auto')) {
                    if (batType.weapon2.equip != undefined) {
                        if (batType.weapon2.equip != stuff.name) {
                            w2OK = false;
                        }
                    }
                }
                if (w2OK) {
                    let equipInfo = showEquipFullInfo(stuff.name,true);
                    equipString = equipString+sepa+'<span title="'+equipInfo+'">'+stuff.name+'</span>';
                }
            }
        }
    });
    equipString = equipString+sepa;
    return equipString;
};

function getCompReqs(stuff,isUnit) {
    let compReqs = {};
    compReqs.base = {};
    compReqs.alt = {};
    let pass = false;
    if (isUnit) {
        if (stuff.compPass.includes(playerInfos.gang)) {
            pass = true;
        }
    }
    if (!pass) {
        if (stuff.compReq != undefined) {
            if (Object.keys(stuff.compReq).length >= 1) {
                Object.entries(stuff.compReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    compReqs.base[key] = value;
                });
            }
        }
        // altCompReq
        if (stuff.altCompReq != undefined) {
            if (Object.keys(stuff.altCompReq).length >= 1) {
                compReqOK = true;
                Object.entries(stuff.altCompReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    compReqs.alt[key] = value;
                });
            }
        }
    }
    if (stuff.compHardReq != undefined) {
        if (Object.keys(stuff.compHardReq).length >= 1) {
            Object.entries(stuff.compHardReq).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (compReqs.base[key] != undefined) {
                    if (compReqs.base[key] < value) {
                        compReqs.base[key] = value;
                    }
                } else {
                    compReqs.base[key] = value;
                }
                if (Object.keys(compReqs.alt).length >= 1) {
                    if (compReqs.alt[key] != undefined) {
                        if (compReqs.alt[key] < value) {
                            compReqs.alt[key] = value;
                        }
                    } else {
                        compReqs.alt[key] = value;
                    }
                }
            });
        }
    }
    // console.log('compReqs.base');
    // console.log(compReqs.base);
    // console.log('compReqs.alt');
    // console.log(compReqs.alt);
    return compReqs;
};

function displayUnitReqs(unit,full) {
    let unitReqs = '';
    let baseUnitReqs = '';
    if (unit.bldReq != undefined) {
        if (unit.bldReq.length >= 1) {
            unitReqs = unitReqs+'<span class="mauve">Bâtiments requis:</span> &#127963; '+toNiceString(unit.bldReq)+'<br><div class="shSpace"></div>';
            baseUnitReqs = baseUnitReqs+'&#127963; '+toNiceString(unit.bldReq);
        }
    }
    let compReqs = getCompReqs(unit,true);
    let isCompReq = false;
    if (Object.keys(compReqs.base).length >= 1) {
        let stringReq1 = toCoolString(compReqs.base,true,false);
        stringReq1 = replaceCompNamesByFullNames(stringReq1);
        unitReqs = unitReqs+'<span class="mauve">Compétences requises:</span> &#128161; '+stringReq1+'<br>';
        baseUnitReqs = baseUnitReqs+' &#128161; '+stringReq1;
        isCompReq = true;
    }
    if (Object.keys(compReqs.alt).length >= 1) {
        let stringReq2 = toCoolString(compReqs.alt,true,false);
        stringReq2 = replaceCompNamesByFullNames(stringReq2);
        unitReqs = unitReqs+'<span class="mauve">Alternative:</span> &#128161; '+stringReq2+'<br>';
        baseUnitReqs = baseUnitReqs+' &#128161; '+stringReq2;
        isCompReq = true;
    }
    if (isCompReq) {
        unitReqs = unitReqs+'<div class="shSpace"></div>';
    }
    if (full) {
        return unitReqs;
    } else {
        return baseUnitReqs;
    }
};

function replaceCompNamesByFullNames(string) {
    let newString = string;
    newString = newString.replace(/arti=/g,'Artillerie=');
    newString = newString.replace(/aero=/g,'Aéronautique=');
    newString = newString.replace(/gen=/g,'Génétique=');
    newString = newString.replace(/cyber=/g,'Cybernétique=');
    newString = newString.replace(/robo=/g,'Robotique=');
    newString = newString.replace(/tele=/g,'Téléportation=');
    newString = newString.replace(/vsp=/g,'VolsSpaciaux=');
    newString = newString.replace(/scaph=/g,'Scaphandres=');
    newString = newString.replace(/det=/g,'Détection=');
    newString = newString.replace(/med=/g,'Médecine=');
    newString = newString.replace(/ordre=/g,'Leadership=');
    newString = newString.replace(/train=/g,'Entraînement=');
    newString = newString.replace(/cam=/g,'Camouflage=');
    newString = newString.replace(/tri=/g,'Recyclage=');
    newString = newString.replace(/ind=/g,'Industrie=');
    newString = newString.replace(/const=/g,'Construction=');
    newString = newString.replace(/energ=/g,'Energie=');
    newString = newString.replace(/ext=/g,'Extraction=');
    newString = newString.replace(/trans=/g,'Transports=');
    newString = newString.replace(/log=/g,'Logistique=');
    newString = newString.replace(/bal=/g,'Balistique=');
    newString = newString.replace(/explo=/g,'Explosifs=');
    newString = newString.replace(/pyro=/g,'Pyrotechnie=');
    newString = newString.replace(/exo=/g,'Exochimie=');
    newString = newString.replace(/mat=/g,'Matériaux=');
    newString = newString.replace(/def=/g,'Défenses=');
    newString = newString.replace(/tank=/g,'Blindés=');
    newString = newString.replace(/ca=/g,'ConnaissanceAlien=');
    return newString;
};

function getAllProds(batType,time) {
    let allProds = {};
    if (batType.prod != undefined) {
        Object.entries(batType.prod).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let fullProd = value*time;
            if (!batType.skills.includes('nostatprod')) {
                fullProd = fullProd/prodVM;
            }
            if (key === 'Spins') {
                fullProd = spinsCreation(fullProd);
            }
            if (key === 'Energie') {
                fullProd = energyCreation(fullProd);
            }
            if (key === 'Scrap') {
                fullProd = scrapCreation(fullProd);
                fullProd = fullProd/5;
            }
            fullProd = Math.ceil(fullProd);
            if (fullProd >= 1) {
                allProds[key] = fullProd;
            }
        });
    }
    return allProds;
};

function getAllProdCosts(batType,time) {
    let allProdCosts = {};
    if (batType.upkeep != undefined) {
        Object.entries(batType.upkeep).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let fullProd = value*time;
            fullProd = Math.ceil(fullProd);
            if (fullProd >= 1) {
                allProdCosts[key] = fullProd;
            }
        });
    }
    return allProdCosts;
};

function getUnitMiningRates(batType) {
    let allMiningRates = {};
    let sortedRes = _.sortBy(_.sortBy(_.sortBy(_.sortBy(resTypes,'rarity'),'level'),'cat'),'bld');
    sortedRes.reverse();
    sortedRes.forEach(function(res) {
        if (res.bld != '') {
            let resRate = getResUnitMiningRate(batType,res,250,true);
            if (playerInfos.comp.ext === 1) {
                resRate = getResUnitMiningRate(batType,res,260,true);
            } else if (playerInfos.comp.ext === 2) {
                resRate = getResUnitMiningRate(batType,res,270,true);
            } else if (playerInfos.comp.ext === 3) {
                resRate = getResUnitMiningRate(batType,res,290,true);
            }
            if (resRate >= 1) {
                allMiningRates[res.name] = resRate;
            }
        }
    });
    return allMiningRates;
};

function getResUnitMiningRate(batType,res,value,fullRate) {
    let resHere = value;
    let extComp = (playerInfos.comp.ext/2)+1;
    if (playerInfos.comp.ext === 3) {
        extComp = extComp+0.2;
    }
    let invExtComp = 7.7-extComp;
    if (playerInfos.comp.tri >= 1 && res.name === 'Scrap') {
        resHere = Math.round(resHere*(playerInfos.comp.tri+8)/8);
    }
    let minRes = minResForRate;
    if (res.name === 'Scrap') {
        minRes = Math.round(minRes*1.5);
    }
    let maxRes = maxResForRate;
    if (res.name === 'Scrap' || res.name === 'Végétaux' || res.name === 'Bois' || res.name === 'Eau') {
        maxRes = Math.round(maxRes*1.25);
    }
    if (resHere < minRes && res.cat != 'zero') {
        resHere = minRes;
    }
    if (resHere > maxRes) {
        resHere = Math.round((resHere-maxRes)/invExtComp*2.5)+maxRes;
    }
    let noMining = false;
    if (res.bld === 'Comptoir' || res.bld === 'Pompe') {
        noMining = true;
    }
    let batRate = batType.mining.rate;
    let miningLevel = batType.mining.level;
    let resRate = Math.ceil(resHere*batRate/mineRateDiv);
    // console.log(res.name);
    // console.log('resRate='+resRate);
    // ADJ SUBTYPE & LEVELS
    if (!batType.mining.types.includes(res.bld)) {
        if (batType.mining.subTypes.includes(res.bld)) {
            resRate = Math.ceil(resRate/2.5);
        } else {
            resRate = 0;
        }
        if (batType.mining.level === 1 && (res.bld === 'Mine' || res.bld === 'Derrick')) {
            resRate = Math.ceil(resRate/1.5);
        }
    }
    if (batType.mining.types[0] != res.bld) {
        if (res.level > miningLevel) {
            resRate = 0;
        } else if (res.level >= 3) {
            resRate = Math.ceil(resRate/2);
        }
    }
    if (value <= 0) {
        resRate = 0;
    }
    // console.log('resRate='+resRate);
    return resRate;
};

function nomVisible(bat) {
    let nv = bat.type;
    if (bat.type === 'Cocon' && playerInfos.comp.ca >= 4) {
        if (bat.tags.includes('crys') || coconStats.level >= 9) {
            nv = 'Crysalide';
        }
    }
    if (bat.type === 'Coque' && bat.tags.includes('permashield')) {
        nv = 'Noyau';
    }
    if (bat.type === 'Oeuf' && bat.tags.includes('permashield')) {
        nv = 'Ovule';
    }
    if (nv === 'Vers' && playerInfos.comp.ca < 2) {
        nv = 'Asticots';
    }
    if (nv === 'Blattes' && playerInfos.comp.ca < 2) {
        nv = 'Cafards';
    }
    return nv
};

function showTileInfos(tileId) {
    $("#tileInfos").css("display","block");
    $('#tileInfos').empty();
    justReloaded = false;
    selectedTile = tileId;
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let ruinType = checkRuinType(tile,false);
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    let potable = checkPotable(zone,tile.id);
    let view = true;
    if (zone[0].dark && !zone[0].undarkOnce.includes(selectedTile) && !zone[0].undarkAll) {
        view = false;
    }
    $('#tileInfos').append('<span class="blockTitle"><h3>'+terrain.fullName+'</h3></span>');
    $('#tileInfos').append('<div class="shSpace"></div>');
    // NOM
    if (tile.tileName != undefined) {
        if (tile.tileName != '') {
            $('#tileInfos').append('<span class="paramIcon"><i class="fas fa-map-signs"></i></span><span class="fullLine or"><b>'+tile.tileName+'</b></span><br>');
        }
    }
    if (view) {
    }
    // Type d'oeufs
    if (playerInfos.comp.ca >= 3) {
        let eggType = 'Bug';
        let eggKind = checkEggKindByZoneType();
        if (eggKind === '') {
            eggKind = getAKindByTer(tile.terrain,zone[0].pKind,zone[0].gKind,zone[0].sKind);
            eggType = capitalizeFirstLetter(eggKind);
        } else {
            eggType = capitalizeFirstLetter(eggKind);
        }
        $('#tileInfos').append('<span class="paramName mauve">Type d\'oeuf</span><span class="paramIcon"><i class="fas fa-bug"></i></span><span class="paramValue mauve">'+eggType+'</span><br>');
    }
    if (view) {
        if (zone[0].planet === 'Horst') {
            if (playerInfos.stList.includes(tileId)) {
                $('#tileInfos').append('<span class="paramName mauve">Intempéries</span><span class="paramIcon"><i class="fas fa-bug"></i></span><span class="paramValue mauve">Tempête</span><br>');
            } else if (playerInfos.sqList.includes(tileId)) {
                $('#tileInfos').append('<span class="paramName mauve">Intempéries</span><span class="paramIcon"></span><span class="paramValue mauve">Bourasque</span><br>');
            }
        }
        // Aménagements
        if (tile.ruins) {
            let fullIndicator = '';
            if (ruinType.full && playerInfos.pseudo === 'Mapedit') {
                fullIndicator = ' &#9872;';
            }
            if (allowCheat) {
                $('#tileInfos').append('<span class="paramName cy klik" onclick="searchRuins(0,'+tile.id+')">Ruines'+fullIndicator+'</span><span class="paramIcon"><i class="fas fa-city"></i></span><span class="paramValue cy">'+ruinType.name+'</span><br>');
            } else {
                $('#tileInfos').append('<span class="paramName cy">Ruines'+fullIndicator+'</span><span class="paramIcon"><i class="fas fa-city"></i></span><span class="paramValue cy">'+ruinType.name+'</span><br>');
            }
        }
        if (tile.infra != undefined) {
            let infraDesc = "";
            if (tile.infra === 'Terriers') {
                infraDesc = "Vos infanteries peuvent se déplacer furtivement d'un terrier à l'autre (à 7 cases max). Placer un marqueur sur le terrier de destination.";
            }
            $('#tileInfos').append('<span class="paramName cy">Infrastructure</span><span class="paramIcon"><i class="ra ra-tower rpg"></i></span><span class="paramValue cy" title="'+infraDesc+'">'+tile.infra+'</span><br>');
        }
        if (tile.rd != undefined) {
            if (tile.rd) {
                if (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain == 'L') {
                    $('#tileInfos').append('<span class="paramName cy">Pont</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue cy">Oui</span><br>');
                } else {
                    $('#tileInfos').append('<span class="paramName cy">Route</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue cy">Oui</span><br>');
                }
            }
        }
        // Ammo packs
        if (tile.ap != undefined) {
            if (tile.ap.includes('drg_')) {
                let drugName = tile.ap.replace('drg_','');
                let drug = getEquipByName(drugName);
                if (drug.units === 'veh') {
                    $('#tileInfos').append('<span class="paramName cy">Tuning</span><span class="paramIcon"><i class="'+drug.icon+'"></i></span><span class="paramValue cy" title="'+drug.info+'">'+drugName+'</span><br>');
                } else {
                    $('#tileInfos').append('<span class="paramName cy">Drogues</span><span class="paramIcon"><i class="'+drug.icon+'"></i></span><span class="paramValue cy" title="'+drug.info+'">'+drugName+'</span><br>');
                }
            } else if (tile.ap.includes('prt_')) {
                let armorName = tile.ap.replace('prt_','');
                let armor = getEquipByName(armorName);
                let armorInfo = showFullArmorInfo(armor,false);
                $('#tileInfos').append('<span class="paramName cy">Armures</span><span class="paramIcon"><i class="ra ra-vest rpg"></i></span><span class="paramValue cy" title="'+armorInfo+'">'+armorName+'</span><br>');
            } else if (tile.ap.includes('eq_')) {
                let equipName = tile.ap.replace('eq_','');
                let equip = getEquipByName(equipName);
                $('#tileInfos').append('<span class="paramName cy">Equipements</span><span class="paramIcon"><i class="fas fa-compass"></i></span><span class="paramValue cy" title="'+equip.info+'">'+equipName+'</span><br>');
            } else {
                let ammo = getAmmoByName(tile.ap);
                let ammoInfo = showAmmoInfo(ammo.name);
                if (tile.ap.includes('grenade') || tile.ap.includes('dynamite') || tile.ap.includes('molotov')) {
                    $('#tileInfos').append('<span class="paramName cy">Munitions</span><span class="paramIcon"><i class="ra ra-grenade rpg"></i></span><span class="paramValue cy" title="'+ammoInfo+'">'+tile.ap+'</span><br>');
                } else if (tile.ap.includes('lame-')) {
                    $('#tileInfos').append('<span class="paramName cy">Lames</span><span class="paramIcon"><i class="ra ra-plain-dagger rpg"></i></span><span class="paramValue cy" title="'+ammoInfo+'">'+tile.ap+'</span><br>');
                } else {
                    $('#tileInfos').append('<span class="paramName cy">Munitions</span><span class="paramIcon"><i class="ra ra-rifle rpg"></i></span><span class="paramValue cy" title="'+ammoInfo+'">'+tile.ap+'</span><br>');
                }
            }
        }
        // Move Cost
        $('#tileInfos').append('<span class="paramName">Coûts de déplacement</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue">+'+terrain.mc+'</span><br>');
        // Cover
        let coverIcon = '';
        if (terrain.cover >= 2) {
            coverIcon = '<i class="fas fa-shield-alt"></i>'
        }
        $('#tileInfos').append('<span class="paramName">Couverture</span><span class="paramIcon">'+coverIcon+'</span><span class="paramValue">'+terrain.cover+'</span><br>');
    }
    // scarp, flood, veg
    let sIcon = '';
    let vIcon = '';
    let fIcon = '';
    if (terrain.veg >= 2) {
        vIcon = '<i class="fab fa-pagelines"></i>'
    }
    if (terrain.scarp >= 2) {
        sIcon = '<i class="fas fa-mountain"></i>'
    }
    if (terrain.flood >= 1) {
        fIcon = '<i class="fas fa-water"></i>'
    }
    $('#tileInfos').append('<span class="paramName">Végétation</span><span class="paramIcon">'+vIcon+'</span><span class="paramValue">'+terrain.veg+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Escarpement</span><span class="paramIcon">'+sIcon+'</span><span class="paramValue">'+terrain.scarp+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Innondation</span><span class="paramIcon">'+fIcon+'</span><span class="paramValue">'+terrain.flood+'</span><br>');
    // Coordonnées
    $('#tileInfos').append('<span class="paramName">Coordonnées</span><span class="paramIcon"><i class="fas fa-map-marker-alt"></i></span><span class="paramValue" title="y'+tile.y+' x'+tile.x+'">'+tile.y+'&lrhar;'+tile.x+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Id</span><span class="paramIcon"></span><span class="paramValue">#'+tile.id+' ('+tile.seed+')</span><br>');
    // Heat
    let tileEnergy = getTileEnergy(tile);
    $('#tileInfos').append('<span class="paramName sky" title="Chaleur du sous-sol (pour les sondes géothermiques)">Energie</span><span class="paramIcon"></span><span class="paramValue sky">'+tileEnergy+'</span><br>');
    // RESSOURCES
    if (playerInfos.comp.ext >= 1 && !modeSonde) {
        let hereBat = getBatByTileId(tileId);
        if (Object.keys(hereBat).length >= 1) {
            let allRes = getAllRes(tileId);
        }
    }
    if (playerInfos.comp.det >= 1 || !modeSonde) {
        if (tile.rs != undefined) {
            let tileIndex;
            let res;
            let bldReq;
            Object.entries(tile.rs).map(entry => {
                let key = entry[0];
                let value = entry[1];
                resIndex = resTypes.findIndex((obj => obj.name == key));
                res = resTypes[resIndex];
                bldReq = onlyFirstLetter(res.bld);
                let resKol = 'cy';
                if (playerInfos.resFlags.includes(res.name)) {
                    resKol = 'jaune';
                }
                if (playerInfos.comp.det < 3 && modeSonde) {
                    $('#tileInfos').append('<span class="paramName '+resKol+'">'+key+'</span><span class="paramIcon"></span><span class="paramValue '+resKol+'"><span class="gf">('+bldReq+'-'+res.rarity+')</span></span><br>');
                } else {
                    $('#tileInfos').append('<span class="paramName '+resKol+'">'+key+'</span><span class="paramIcon"></span><span class="paramValue '+resKol+'">'+value+' <span class="gf">('+bldReq+'-'+res.rarity+')</span></span><br>');
                }
                // console.log(key,value);
            });
        }
        console.log(terrain);
        console.log(tile);
        let srs = getTerrainRes(terrain,tile);
        console.log('terrain res');
        console.log(srs);
        if (Object.keys(srs).length >= 1) {
            let tileIndex;
            let res;
            let bldReq;
            Object.entries(srs).map(entry => {
                let key = entry[0];
                let value = entry[1];
                resIndex = resTypes.findIndex((obj => obj.name == key));
                res = resTypes[resIndex];
                bldReq = onlyFirstLetter(res.bld);
                if (bldReq != '') {
                    bldReq = ' ('+bldReq+')';
                }
                $('#tileInfos').append('<span class="paramName sky">'+key+'</span><span class="paramIcon"></span><span class="paramValue sky">'+value+'<span class="gf">'+bldReq+'</span></span><br>');
                // console.log(key,value);
            });
        }
        if (zone[0].planet === 'Gehenna') {
            if (terrain.name === 'W' || terrain.name === 'S' || terrain.name === 'R' || terrain.name == 'L') {
                $('#tileInfos').append('<span class="paramName sky">Eau</span><span class="paramIcon"></span><span class="paramValue sky">0<span class="gf"> (poison)</span></span><br>');
            }
        } else if (!potable) {
            if (playerInfos.comp.ca >= 2 || !modeSonde) {
                $('#tileInfos').append('<span class="paramName sky">Eau</span><span class="paramIcon"></span><span class="paramValue sky">0<span class="gf"> (poison)</span></span><br>');
            }
        }
    }
    // RENOMMER
    if (playerInfos.showedTiles.includes(tile.id)) {
        $('#tileInfos').append('<button type="button" title="Effacer le marqueur" class="boutonGris skillButtons" onclick="toggleMark('+tileId+')"><i class="fas fa-eraser"></i></button>');
    } else {
        $('#tileInfos').append('<button type="button" title="Mettre un marqueur" class="boutonGris skillButtons" onclick="toggleMark('+tileId+')"><i class="fas fa-map-pin"></i></button>');
    }
    $('#tileInfos').append('<button type="button" title="Nommer cet emplacement" class="boutonGris skillButtons" onclick="renameTile('+tileId+')"><i class="fas fa-map-signs"></i></button>');
    $('#tileInfos').append('<button type="button" title="Faire de cet emplacement mon centre" class="boutonGris skillButtons" onclick="defCenter('+tileId+')"><i class="fas fa-space-shuttle"></i></button>');
};

function renameTile(tileId) {
    let newName = prompt('Donnez un nom à cet emplacement :');
    if (newName != null) {
        if (newName.length <= 24) {
            let tileIndex = zone.findIndex((obj => obj.id == tileId));
            zone[tileIndex].tileName = newName;
            showMap(zone,false);
            showTileInfos(tileId);
        } else {
            // message d'erreur
        }
    }
};

function renameChief(batId) {
    let bat = getBatById(batId);
    playOK(bat);
    setTimeout(function (){
        let newName = prompt('Donnez un nom au commandant de ce bataillon :');
        if (newName != null) {
            if (newName.length <= 24) {
                bat.chief = newName;
                showBataillon(bat);
                if (inSoute) {
                    goSoute();
                }
                showBatInfos(bat);
            } else {
                // message d'erreur
            }
        }
    }, 1000); // How long do you want the delay to be (in milliseconds)?
};

function defCenter(tileId) {
    playerInfos.myCenter = tileId;
    $('html,body').scrollTop(0);
    centerMapCenter();
};
