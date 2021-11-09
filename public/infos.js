function showBatInfos(bat) {
    $("#unitInfos").css("display","block");
    let batType = getBatType(bat);
    batInfos(bat,batType,false);
    $("#unitInfos").animate({scrollTop:0},"fast");
    if (bat.type === 'Soute') {
        viewPop();
    }
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
    let headPlace = 'unitInfos';
    let bodyPlace = 'unitInfos';
    if (pop) {
        headPlace = 'pophead';
        bodyPlace = 'popbody';
        $('#'+headPlace).empty();
    }
    $('#'+bodyPlace).empty();
    if (!pop) {
        conWindowOut();
    }
    levelUp(bat,batType);
    let tagColor = 'cy';
    let batPic = getBatPic(bat,batType);
    let tile = getTile(bat);
    if (batType.skills.includes('transport')) {
        moveInsideBats(bat);
    }
    let unitsLeft = bat.squadsLeft*batType.squadSize;
    if (batType.squads === 6 && batType.squadSize === 1 && (batType.cat === 'buildings' || batType.cat === 'devices')) {
        unitsLeft = '';
    }
    if (bat.citoyens >= 1) {
        unitsLeft = bat.citoyens;
    }
    let resMax = batType.transRes;
    if (bat.citoyens >= 1) {
        resMax = bat.citoyens;
    }
    if (bat.eq === 'megafret') {
        resMax = Math.round(resMax*1.2);
    }
    let vetIcon = '';
    if (bat.vet >= 1) {
        vetIcon = '<img src="/static/img/vet'+bat.vet+'.png" width="15">';
    }
    if (pop) {
        $('#'+headPlace).append('<img src="/static/img/units/'+batType.cat+'/'+batPic+'.png">&nbsp;');
        if (batType.skills.includes('nonumname')) {
            $('#'+headPlace).append('<span class="blockTitle"><h2>'+batType.name+'</h2></span>');
        } else {
            $('#'+headPlace).append('<span class="blockTitle"><h2>'+unitsLeft+' '+batType.name+'</h2></span>');
        }
    } else {
        if (batType.skills.includes('nonumname')) {
            $('#'+headPlace).append('<span class="blockTitle"><h3><button type="button" title="Détail du bataillon" class="boutonCiel skillButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batType.name+'</h3> '+vetIcon+'</span>');
        } else {
            $('#'+headPlace).append('<span class="blockTitle"><h3><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="48" class="tunit" onclick="batDetail('+bat.id+')">'+unitsLeft+' '+batType.name+'</h3> '+vetIcon+'</span>');
        }
    }
    $('#'+bodyPlace).append('<div class="shSpace"></div>');
    let near = nearWhat(bat,batType);
    let grade = '';
    if (batType.skills.includes('robot')) {
        grade = 'Robot';
    } else if (batType.skills.includes('clone')) {
        grade = 'Clone';
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
        chargeIcon = ' &nbsp;<i class="fas fa-truck marine" onclick="scrollToBottom()"></i>';
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
    if ((grade != batType.name && grade != 'Caporal') || vetStatus != '' || armyNum != '' || chargeIcon != '' || fretIcon != '') {
        if (bat.chief != undefined) {
            if (bat.chief != '') {
                $('#'+bodyPlace).append('<span class="constName '+gradeColor+'">'+grade+' '+bat.chief+vetStatus+armyNum+fretIcon+chargeIcon+'</span><br>');
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
            } else {
                $('#'+bodyPlace).append('<span class="constName '+gradeColor+'">'+grade+vetStatus+armyNum+fretIcon+chargeIcon+'</span><br>');
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
            }
        } else {
            $('#'+bodyPlace).append('<span class="constName '+gradeColor+'">'+grade+vetStatus+armyNum+fretIcon+chargeIcon+'</span><br>');
            $('#'+bodyPlace).append('<div class="shSpace"></div>');
        }
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
    let roundApLeft = Math.floor(bat.apLeft);
    $('#'+bodyPlace).append('<span class="paramName">Points d\'action</span><span class="paramIcon"><i class="fas fa-hourglass-'+hourglass+'"></i></span><span class="paramValue">'+roundApLeft+'/'+ap+'</span><br>');
    // SQUADS
    let iconCol = 'gff';
    if (bat.squadsLeft < batType.squads) {
        iconCol = 'or';
    }
    $('#'+bodyPlace).append('<span class="paramName">Escouades</span><span class="paramIcon '+iconCol+'"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.squadsLeft+'/'+batType.squads+'</span><br>');
    let squadHP = batType.squadSize*batType.hp;
    iconCol = 'gff';
    if (bat.squadsLeft < batType.squads || bat.damage >= 1) {
        iconCol = 'or';
    }
    $('#'+bodyPlace).append('<span class="paramName">Dégâts</span><span class="paramIcon '+iconCol+'"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    if (pop) {
        $('#'+bodyPlace).append('<span class="paramName">Unités/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+batType.squadSize+'</span><br>');
    }
    let totalCrew = batType.crew*batType.squadSize*batType.squads;
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
        } else if (armure < 2) {
            armure = armure+1;
        }
    }
    if (pop) {
        $('#'+bodyPlace).append('<span class="paramName">Armure</span><span class="paramIcon"><i class="fas fa-shield-alt"></i></span><span class="paramValue">'+armure+'</span><br>');
    }
    let fortifCover = getCover(bat,true,false);
    if (bat.tags.includes('fortif')) {
        $('#'+bodyPlace).append('<span class="paramName">Couverture</span><span class="paramIcon"></span><span class="paramValue">'+fortifCover+'</span><br>');
    } else {
        $('#'+bodyPlace).append('<span class="paramName">Couverture</span><span class="paramIcon"></span><span class="paramValue">'+fortifCover+'</span><br>');
    }
    let stealth = getStealth(bat);
    let camChance = calcCamo(bat);
    if (batType.skills.includes('camo') || batType.skills.includes('maycamo') || batType.skills.includes('aicamo') || tile.ruins || bat.eq === 'crimekitgi' || bat.eq === 'crimekitch' || bat.eq.includes('silencieux') || bat.logeq.includes('silencieux') || bat.eq === 'e-camo' || bat.logeq === 'e-camo' || (bat.eq === 'kit-guetteur' && playerInfos.comp.train >= 1) || (bat.eq === 'kit-chouf' && playerInfos.comp.train >= 1)) {
        $('#'+bodyPlace).append('<span class="paramName">Furtivité</span><span class="paramIcon"></span><span class="paramValue">'+stealth+' ('+camChance+'%)</span><br>');
    } else {
        $('#'+bodyPlace).append('<span class="paramName">Furtivité</span><span class="paramIcon"></span><span class="paramValue">'+stealth+'</span><br>');
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
    let batFuzz = calcBatFuzz(bat);
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
    if (bat.tags.includes('construction')) {
        $('#'+bodyPlace).append('<span class="paramName or">Opérationel</span><span class="paramIcon"></span><span class="paramValue or">Non</span><br>');
    }
    if (playerInfos.bldList.includes('Champ de force')) {
        if (bat.type === 'Champ de force') {
            let endFF = bat.creaTurn+25;
            $('#'+bodyPlace).append('<span class="paramName cy">Dôme</span><span class="paramIcon"></span><span class="paramValue cy">Fin tour '+endFF+'</span><br>');
        } else if (bat.type === 'Dôme') {
            $('#'+bodyPlace).append('<span class="paramName cy">Dôme</span><span class="paramIcon"></span><span class="paramValue cy">Permanent</span><br>');
        }
    }
    if (bat.tags.includes('embuscade')) {
        let embushBonus = Math.round(100*calcEmbushBonus(batType));
        $('#'+bodyPlace).append('<span class="paramName cy">Embuscade</span><span class="paramIcon"></span><span class="paramValue cy">'+embushBonus+'%</span><br>');
    }
    if (pop) {
        if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || batType.skills.includes('initiative') || bat.eq === 'detector' || bat.logeq === 'detector' || bat.eq === 'g2ai' || bat.logeq === 'g2ai') {
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
    if (bat.tags.includes('kirin') || bat.tags.includes('slowreg') || batType.skills.includes('regeneration') || batType.skills.includes('slowreg') || bat.eq === 'permakirin') {
        let regenType = 'lente';
        if (bat.tags.includes('kirin') || batType.skills.includes('regeneration')) {
            regenType = 'rapide';
        }
        $('#'+bodyPlace).append('<span class="paramName cy">Régénération</span><span class="paramIcon"></span><span class="paramValue cy">'+regenType+'</span><br>');
    }
    if (bat.tags.includes('zombie')) {
        $('#'+bodyPlace).append('<span class="paramName or">Zombie</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
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
    if (bat.tags.includes('resistall') || batType.skills.includes('resistall')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Résistance globale</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (bat.tags.includes('drunk')) {
        $('#'+bodyPlace).append('<span class="paramName jaune">Saoul</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
    }
    // BAD TAGS
    if (bat.tags.includes('inflammable') || bat.eq === 'e-jetpack' || batType.skills.includes('inflammable')) {
        if (!bat.tags.includes('resistfeu')) {
            $('#'+bodyPlace).append('<span class="paramName jaune">Inflammable</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
        }
    }
    if (bat.emo >= 1) {
        let stress = bat.emo-10;
        if (bat.tags.includes('terror')) {
            $('#'+bodyPlace).append('<span class="paramName or">Stress</span><span class="paramIcon"></span><span class="paramValue or" title="Ce bataillon va fuir dès que des aliens sont proches et ne voudra plus les attaquer">Terrorisé!</span><br>');
        } else if (stress >= 1) {
            $('#'+bodyPlace).append('<span class="paramName jaune">Stress</span><span class="paramIcon"></span><span class="paramValue jaune">'+stress+'</span><br>');
        } else if (playerInfos.onShip) {
            $('#'+bodyPlace).append('<span class="paramName">Stress</span><span class="paramIcon"></span><span class="paramValue">'+stress+'</span><br>');
        }
    }
    // let hurt = isHurt(bat);
    // if (hurt) {
    //     if (batType.cat === 'infantry' || batType.skills.includes('cyber')) {
    //         $('#'+bodyPlace).append('<span class="paramName or">Blessé</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    //     } else {
    //         $('#'+bodyPlace).append('<span class="paramName or">Endommagé</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    //     }
    // }
    if (bat.soins >= 11) {
        let effSoins = checkEffSoins(bat);
        $('#'+bodyPlace).append('<span class="paramName jaune">Efficacité soins</span><span class="paramIcon"></span><span class="paramValue jaune">'+effSoins+'%</span><br>');
    }
    if (bat.tags.includes('blub')) {
        $('#'+bodyPlace).append('<span class="paramName or">Noyade</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
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
    if (bat.tags.includes('maladie')) {
        $('#'+bodyPlace).append('<span class="paramName or">Malade</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('necro')) {
        $('#'+bodyPlace).append('<span class="paramName or">Nécrotoxine</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
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
    }
    // AUTOSKILLS
    if (batType.skills.includes('ravitaillement') && bat.eq != 'megafret') {
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
        if (bat.eq === 'megatrans') {
            transBase = Math.round(transBase*1.25);
        }
        if (batType.skills.includes('transorbital') && playerInfos.mapTurn >= 2) {
            transBase = Math.round(transBase*bonusTransRetour);
        }
        if (transBase < 1000000) {
            $('#'+bodyPlace).append('<span class="paramName marine">Transport</span><span class="paramIcon"></span><span class="paramValue marine">'+transLeft+'/'+transBase+'</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName marine">Transport</span><span class="paramIcon"></span><span class="paramValue marine">'+transLeft+'/</span><br>');
        }
    }
    if (batType.transRes >= 1) {
        let restSpace = checkResSpace(bat);
        if (restSpace < 1) {tagColor = 'or';} else {tagColor = 'caca';}
        if (resMax < 1000000) {
            $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">Fret</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+restSpace+'/'+resMax+'</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">Fret</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+restSpace+'/</span><br>');
        }
        if (batType.cat != 'buildings' && batType.cat != 'devices' && !batType.skills.includes('transorbital')) {
            let nearLander = nearAnyLander(bat);
            if (resMax > restSpace && nearLander) {
                $('#'+bodyPlace).append('<span class="paramName or">Embarquement Lander</span><span class="paramIcon"></span><span class="paramValue or">Impossible</span><br>');
            }
        }
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
    if (batType.skills.includes('constructeur')) {
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
    if (!batprt.includes('aucun')) {
        $('#'+bodyPlace).append('<span class="paramName">'+protection+'</span><span class="paramIcon"></span><span class="paramValue lcy">'+batprt+'</span><br>');
    }
    let bateq = bat.eq;
    if (!bateq.includes('aucun')) {
        $('#'+bodyPlace).append('<span class="paramName">Equipement</span><span class="paramIcon"></span><span class="paramValue lcy">'+bateq+'</span><br>');
    }
    if (bat.logeq != '') {
        $('#'+bodyPlace).append('<span class="paramName">Equipement</span><span class="paramIcon"></span><span class="paramValue lcy">'+bat.logeq+'</span><br>');
    }
    if (playerInfos.comp.log === 3 || playerInfos.comp.det >= 3) {
        if (bat.eq != 'e-flash' && bat.logeq != 'e-flash' && bat.eq != 'e-phare' && bat.logeq != 'e-phare') {
            $('#'+bodyPlace).append('<span class="paramName">Equipement</span><span class="paramIcon"></span><span class="paramValue lcy">e-flash</span><br>');
        }
    }
    // WEAPONS & SKILLS
    if (!pop) {
        if (!isStacked()) {
            if (!bat.tags.includes('terror')) {
                weaponsInfos(bat,batType,pop);
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                skillsInfos(bat,batType,near);
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
        weaponsInfos(bat,batType,pop);
        $('#'+bodyPlace).append('<div class="shSpace"></div>');
    }
    // ARMIES
    if (!pop) {
        $('#'+bodyPlace).append('<div class="shSpace"></div>');
        $('#'+bodyPlace).append('<span class="blockTitle"><h3>Armée</h3></span><br>');
        let army = 0;
        let armycol = "";
        if (army === bat.army) {
            armycol = " cy";
        }
        $('#'+bodyPlace).append('<span class="army klik'+armycol+'" onclick="armyAssign('+bat.id+','+army+')">'+army+'</span>');
        while (army <= 12) {
            army++
            if (army === bat.army) {
                armycol = " cy";
            } else {
                armycol = "";
            }
            $('#'+bodyPlace).append('<span class="army">&Star;<span class="klik'+armycol+'" onclick="armyAssign('+bat.id+','+army+')">'+army+'</span></span>');
            if (army > 12) {break;}
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
            transportedRes = transportedRes.replace(/"/g,"");
            transportedRes = transportedRes.replace(/{/g,"");
            transportedRes = transportedRes.replace(/}/g,"");
            transportedRes = transportedRes.replace(/,/g," &nbsp;&horbar;&nbsp; ");
            transportedRes = transportedRes.replace(/:/g," ");
            let resLoaded = checkResLoad(bat);
            let showTotal = '<span class="cy">'+resLoaded+'</span>/'+resMax;
            $('#'+bodyPlace).append('<span class="paramValue">'+transportedRes+' &nbsp;('+showTotal+')</span><br>');
        }
    }
    $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Nommer le commandant de ce bataillon" class="boutonGris skillButtons" onclick="renameChief('+bat.id+')"><i class="fas fa-user-alt"></i></button>&nbsp; Commandant</h4></span>');

    // DISMANTLE
    if (!pop) {
        $('#'+bodyPlace).append('<hr>');
        let demText;
        if (!bat.tags.includes('nomove')) {
            if (batType.skills.includes('recupres') || batType.skills.includes('recupcit') || batType.cat === 'buildings' || batType.skills.includes('okdel')) {
                if (batType.skills.includes('recupcit')) {
                    if (batType.skills.includes('recupres') || batType.cat === 'buildings') {
                        if (batType.skills.includes('brigands')) {
                            demText = '(récupérer les criminels et les ressources)';
                        } else if (bat.tags.includes('outsider')) {
                            demText = '(récupérer les criminels ou citoyens et les ressources)';
                        } else {
                            demText = '(récupérer les citoyens et les ressources)';
                        }
                    } else {
                        if (batType.skills.includes('brigands')) {
                            demText = '(récupérer les criminels)';
                        } else if (bat.tags.includes('outsider')) {
                            demText = '(récupérer les criminels ou citoyens)';
                        } else {
                            demText = '(récupérer les citoyens)';
                        }
                    }
                } else {
                    if (batType.skills.includes('recupres') || batType.cat === 'buildings') {
                        demText = '(récupérer des ressources)';
                    }
                }
                if (batType.skills.includes('okdel')) {
                    demText = '(détruire)';
                }
                let resRecup = getResRecup(bat,batType);
                $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Démanteler '+demText+' '+toCoolString(resRecup)+'" class="boutonRouge skillButtons" onclick="dismantle('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Démanteler</h4></span>');
            }
        }
        if (playerInfos.pseudo === 'Test') {
            $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Supprimer le bataillon (triche!)" class="boutonCiel skillButtons" onclick="removeBat('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Supprimer</h4></span>');
        }
        let resLoaded = checkResLoad(bat);
        if (resLoaded >= 1) {
            $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Jeter toutes les ressources" class="boutonRouge skillButtons" onclick="fretThrow()"><i class="fas fa-truck-loading"></i></button>&nbsp; Vider</h4></span>');
        }
    }

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
};

function batFullInfos(bat,batType) {
    $('#popbody').append('<div class="shSpace"></div>');
    $('#popbody').append('<span class="blockTitle"><h4>Habilités spéciales</h4></span><br>');
    let isBat = false;
    if (Object.keys(bat).length >= 1) {
        isBat = true;
    }
    let sepa = ' &nbsp;&middot;&nbsp; '
    let allSkills = sepa;
    if (batType.skills.includes('fortif')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut se fortifier">Fortification</span>'+sepa;
    }
    if (batType.skills.includes('bigfortif')) {
        allSkills = allSkills+'<span class="paramValue" title="Meilleur bonus de fortification">Fortification avancée</span>'+sepa;
    }
    if (!batType.skills.includes('noguet') && !batType.skills.includes('sentinelle') && !batType.skills.includes('fastguet')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut faire le guet. Cadence de tir 100% en défense">Guet</span>'+sepa;
    }
    if (batType.skills.includes('fastguet')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut faire le guet rapidement. Cadence de tir 100% en défense">Guet rapide</span>'+sepa;
    }
    if (batType.skills.includes('sentinelle')) {
        allSkills = allSkills+'<span class="paramValue" title="Toujours en guet: Cadence de tir 100% en défense">Sentinelle</span>'+sepa;
    }
    if (batType.skills.includes('baddef')) {
        allSkills = allSkills+'<span class="paramValue" title="Cadence de tir seulement 85% en mode guet. Moins de bonus pour la fortification.">Seconde ligne</span>'+sepa;
    }
    if (batType.skills.includes('defense')) {
        allSkills = allSkills+'<span class="paramValue" title="Cadence de tir 150% en défense">Défense</span>'+sepa;
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
    if (batType.skills.includes('cible')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut faire un tir ciblé: Précision augmentée mais cadence de tir diminuée">Tir ciblé</span>'+sepa;
    }
    if (batType.skills.includes('longshot')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut attaquer n\'importe quelle unité à sa portée (pas de restriction due à la mêlée)">Tir choisi</span>'+sepa;
    }
    if (batType.skills.includes('berserk')) {
        allSkills = allSkills+'<span class="paramValue" title="Si blessé: Cadence de tir 150% mais dégâts reçu 150%">Berserk</span>'+sepa;
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
        allSkills = allSkills+'<span class="paramValue">Volant</span>'+sepa;
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
    if (batType.skills.includes('constructeur')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut construire des bâtiments et dispositifs">Constructeur</span>'+sepa;
    }
    if (batType.skills.includes('routes')) {
        if (batType.moveCost < 99) {
            allSkills = allSkills+'<span class="paramValue" title="Peut construire des routes">Routes</span>'+sepa;
        } else {
            allSkills = allSkills+'<span class="paramValue" title="Peut construire une route là où il est installé">Route</span>'+sepa;
        }
    }
    if (batType.skills.includes('fouille')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut fouiller les ruines">Fouille</span>'+sepa;
    }
    if (batType.skills.includes('leader')) {
        allSkills = allSkills+'<span class="paramValue" title="Donne +1 PA à toutes les unités du gang de manière permanente">Leadership</span>'+sepa;
    }
    if (batType.skills.includes('prayer')) {
        allSkills = allSkills+'<span class="paramValue" title="Donne +3 PA à toutes les unités du gang pendant 1 tour, et +1 PA jusqu\'à la fin de la prière">Prière</span>'+sepa;
    }
    if (batType.skills.includes('undead')) {
        allSkills = allSkills+'<span class="paramValue" title="Les escouades blessées peuvent continuer à attaquer (la cadence de tir ne diminue pas)">Undead</span>'+sepa;
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
    if (batType.skills.includes('xxxxx')) {
        allSkills = allSkills+'<span class="paramValue" title="zzzzzzzzz">Yyyyyy</span>'+sepa;
    }
    if (batType.skills.includes('recherche')) {
        allSkills = allSkills+'<span class="paramValue" title="Recherche de compétences">Recherche</span>'+sepa;
    }
    $('#popbody').append('<span class="paramValue">'+allSkills+'</span>');
    $('#popbody').append('<div class="shSpace"></div>');

    // MINING
    if (batType.skills.includes('extraction')) {
        $('#popbody').append('<div class="shSpace"></div>');
        $('#popbody').append('<span class="blockTitle"><h4>Extraction de ressources</h4></span><br>');
        if (isBat) {
            let allMiningRates = getAllMiningRates(bat,batType);
            $('#popbody').append('<span class="paramValue gf">'+toCoolString(allMiningRates)+'</span>');
            console.log('MINING RATES');
            console.log(allMiningRates);
        }
        $('#popbody').append('<div class="shSpace"></div>');
    }
};

function nomVisible(name) {
    let nv = name;
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
    selectedTile = tileId;
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    let view = true;
    if (zone[0].dark && !zone[0].undarkOnce.includes(selectedTile) && !zone[0].undarkAll) {
        view = false;
    }
    if (view) {
        $('#tileInfos').append('<span class="blockTitle"><h3>'+terrain.fullName+'</h3></span>');
        $('#tileInfos').append('<div class="shSpace"></div>');
        // NOM
        if (tile.tileName !== undefined && tile.tileName !== null && tile.tileName != '') {
            $('#tileInfos').append('<span class="paramIcon"><i class="fas fa-map-signs"></i></span><span class="fullLine or"><b>'+tile.tileName+'</b></span><br>');
        }
        // Type d'oeufs
        if (playerInfos.comp.ca >= 3) {
            let eggType = 'Bug';
            if (tile.terrain === 'M') {
                eggType = 'Bug';
            }
            if (tile.terrain === 'H') {
                eggType = 'Bug';
            }
            if (tile.terrain === 'P') {
                eggType = capitalizeFirstLetter(zone[0].pKind);
            }
            if (tile.terrain === 'G') {
                eggType = capitalizeFirstLetter(zone[0].gKind);
            }
            if (tile.terrain === 'B') {
                eggType = 'Swarm';
            }
            if (tile.terrain === 'F') {
                eggType = 'Spider';
            }
            if (tile.terrain === 'S') {
                eggType = capitalizeFirstLetter(zone[0].sKind);
            }
            if (tile.terrain === 'W' || tile.terrain == 'L') {
                eggType = 'Larve';
            }
            if (tile.terrain === 'R') {
                eggType = 'Larve';
            }
            $('#tileInfos').append('<span class="paramName mauve">Type d\'oeuf</span><span class="paramIcon"><i class="fas fa-bug"></i></span><span class="paramValue mauve">'+eggType+'</span><br>');
        }
        // Aménagements
        if (tile.ruins) {
            $('#tileInfos').append('<span class="paramName cy">Ruines</span><span class="paramIcon"><i class="fas fa-city"></i></span><span class="paramValue cy">Oui</span><br>');
        }
        if (tile.infra != undefined) {
            $('#tileInfos').append('<span class="paramName cy">Infrastructure</span><span class="paramIcon"><i class="ra ra-tower rpg"></i></span><span class="paramValue cy">'+tile.infra+'</span><br>');
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
        // Move Cost
        $('#tileInfos').append('<span class="paramName">Coûts de déplacement</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue">+'+terrain.mc+'</span><br>');
        // Cover
        let coverIcon = '';
        if (terrain.cover >= 2) {
            coverIcon = '<i class="fas fa-shield-alt"></i>'
        }
        $('#tileInfos').append('<span class="paramName">Couverture</span><span class="paramIcon">'+coverIcon+'</span><span class="paramValue">'+terrain.cover+'</span><br>');
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
        $('#tileInfos').append('<span class="paramName">Coordonnées</span><span class="paramIcon"><i class="fas fa-map-marker-alt"></i></span><span class="paramValue">'+tile.y+'&lrhar;'+tile.x+'</span><br>');
        $('#tileInfos').append('<span class="paramName">Id</span><span class="paramIcon"></span><span class="paramValue">#'+tile.id+' ('+tile.seed+')</span><br>');
        // Heat
        let tileEnergy = getTileEnergy(tile);
        $('#tileInfos').append('<span class="paramName sky" title="Chaleur du sous-sol (pour les sondes géothermiques)">Energie</span><span class="paramIcon"></span><span class="paramValue sky">'+tileEnergy+'</span><br>');
        // RESSOURCES
        if (playerInfos.comp.det >= 2 || !modeSonde) {
            if (tile.rs !== undefined) {
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
            } else if (zone[0].seed === 2) {
                if (zone[0].gKind === 'spider' || zone[0].pKind === 'spider' || zone[0].sKind === 'spider') {
                    if (terrain.name === 'W' || terrain.name === 'S' || terrain.name == 'L') {
                        if (playerInfos.comp.ca >= 2 || !modeSonde) {
                            $('#tileInfos').append('<span class="paramName sky">Eau</span><span class="paramIcon"></span><span class="paramValue sky">0<span class="gf"> (poison)</span></span><br>');
                        }
                    }
                }
            }
        }
        // RENOMMER
        $('#tileInfos').append('<span class="blockTitle"><h4><button type="button" title="Nommer cet emplacement" class="boutonGris skillButtons" onclick="renameTile('+tileId+')"><i class="fas fa-map-signs"></i></button>&nbsp; Pancarte</h4></span>');
        $('#tileInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire de cet emplacement mon centre" class="boutonGris skillButtons" onclick="defCenter('+tileId+')"><i class="fas fa-space-shuttle"></i></button>&nbsp; Mon Centre</h4></span>');
    }
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
                showBatInfos(bat);
                if (inSoute) {
                    goSoute();
                }
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
