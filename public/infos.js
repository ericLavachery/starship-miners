function showBatInfos(bat) {
    batInfos(bat,false);
};

function unitDetail(batId) {
    modal.style.display = "block";
    let bat = getBatById(batId);
    batInfos(bat,true);
    batFullInfos(bat);
};

function batInfos(bat,pop) {
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
    let tagColor = 'cy';
    let batType = getBatType(bat);
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
    if (pop) {
        $('#'+headPlace).append('<img src="/static/img/units/'+batType.cat+'/'+batType.pic+'.png">&nbsp;');
        if (batType.skills.includes('nonumname')) {
            $('#'+headPlace).append('<span class="blockTitle"><h2>'+batType.name+'</h2></span>');
        } else {
            $('#'+headPlace).append('<span class="blockTitle"><h2>'+unitsLeft+' '+batType.name+'</h2></span>');
        }
        $('#'+bodyPlace).append('<div class="shSpace"></div>');
    } else {
        if (batType.skills.includes('nonumname')) {
            $('#'+headPlace).append('<span class="blockTitle"><h3><button type="button" title="Détail du bataillon" class="boutonBleu skillButtons" onclick="unitDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batType.name+'</h3></span>');
        } else {
            $('#'+headPlace).append('<span class="blockTitle"><h3><img src="/static/img/units/'+batType.cat+'/'+batType.pic+'.png" width="48" class="tunit" onclick="unitDetail('+bat.id+')">'+unitsLeft+' '+batType.name+'</h3></span>');
        }
        $('#'+bodyPlace).append('<div class="shSpace"></div>');
    }
    let allTags = _.countBy(bat.tags);
    // AP
    let ap = getAP(bat);
    let hourglass = 'start';
    if (bat.apLeft <= 0) {
        hourglass = 'end';
    } else if (bat.apLeft < ap) {
        hourglass = 'half';
    }
    let roundApLeft = Math.floor(bat.apLeft);
    $('#'+bodyPlace).append('<span class="paramName">Points d\'action</span><span class="paramIcon"><i class="fas fa-hourglass-'+hourglass+'"></i></span><span class="paramValue">'+roundApLeft+'/'+ap+'</span><br>');
    // SQUADS
    $('#'+bodyPlace).append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.squadsLeft+'/'+batType.squads+'</span><br>');
    let squadHP = batType.squadSize*batType.hp;
    $('#'+bodyPlace).append('<span class="paramName">Dégâts</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
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
        if (batType.skills.includes('bigfortif')) {
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
    if (batType.skills.includes('camo') || batType.skills.includes('maycamo') || tile.ruins) {
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
    if (pop) {
        if (bat.tags.includes('embuscade')) {
            $('#'+bodyPlace).append('<span class="paramName cy">Embuscade</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
        }
        if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || batType.skills.includes('initiative')) {
            $('#'+bodyPlace).append('<span class="paramName cy">Guet</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
        }
    }
    if (batType.skills.includes('berserk') && bat.damage >= 1) {
        $('#'+bodyPlace).append('<span class="paramName cy">Berserk</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (pop) {
        if (bat.tags.includes('kirin') || bat.tags.includes('sila') || bat.tags.includes('bliss') || bat.tags.includes('blaze') || bat.tags.includes('skupiac') || bat.tags.includes('starka') || bat.tags.includes('octiron')) {
            let myDrugs = checkBatDrugs(bat);
            $('#'+bodyPlace).append('<span class="paramName cy">Drogue</span><span class="paramIcon"></span><span class="paramValue cy">'+myDrugs.toString()+'</span><br>');
        }
    }
    if (bat.tags.includes('kirin') || bat.tags.includes('slowreg') || batType.skills.includes('regeneration') || batType.skills.includes('slowreg')) {
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
    // BAD TAGS
    if (bat.tags.includes('inflammable') || bat.eq === 'jetpack' || batType.skills.includes('inflammable')) {
        $('#'+bodyPlace).append('<span class="paramName or">Inflammable</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    let hurt = isHurt(bat);
    if (hurt) {
        $('#'+bodyPlace).append('<span class="paramName or">Blessé</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
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
    $('#'+bodyPlace).append('<span class="paramName">Volume</span><span class="paramIcon"><i class="fas fa-weight-hanging"></i></span><span class="paramValue">'+volume+'</span><br>');
    if (pop) {
        $('#'+bodyPlace).append('<span class="paramName">Taille</span><span class="paramIcon"></span><span class="paramValue">'+batType.size+'</span><br>');
    }
    // AUTOSKILLS
    if (batType.skills.includes('ravitaillement')) {
        let ravitNum = calcRavit(bat);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">Ravitaillements</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batType.maxSkill+'</span><br>');
    }
    if (batType.transUnits >= 1) {
        let transLeft = calcTransUnitsLeft(bat,batType);
        let transBase = batType.transUnits;
        if (batType.skills.includes('transorbital') && playerInfos.mapTurn >= 2) {
            transBase = Math.round(transBase*bonusTransRetour);
        }
        $('#'+bodyPlace).append('<span class="paramName cy">Transport</span><span class="paramIcon"></span><span class="paramValue cy">'+transLeft+'/'+transBase+'</span><br>');
    }
    if (batType.transRes >= 1) {
        let restSpace = checkResSpace(bat);
        if (restSpace < 1) {tagColor = 'or';} else {tagColor = 'cy';}
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
    if (batType.skills.includes('landmine') || batType.skills.includes('dynamite')) {
        let ravitNum = calcRavit(bat);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#'+bodyPlace).append('<span class="paramName '+tagColor+'">Mines</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batType.maxSkill+'</span><br>');
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
    if (pop) {

    }
    // WEAPONS & SKILLS
    if (!pop) {
        if (!isStacked()) {
            weaponsInfos(bat,batType,pop);
            $('#'+bodyPlace).append('<div class="shSpace"></div>');
            skillsInfos(bat,batType);
        } else {
            transInfos(bat,batType);
            defabInfos(bat,batType);
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
        while (army <= 9) {
            army++
            if (army === bat.army) {
                armycol = " cy";
            } else {
                armycol = "";
            }
            $('#'+bodyPlace).append('<span class="army"> &Star; <span class="klik'+armycol+'" onclick="armyAssign('+bat.id+','+army+')">'+army+'</span></span>');
            if (army > 9) {break;}
        }
    }
    // RESSOURCES transportées
    // console.log('HERE');
    if (batType.transRes >= 1) {
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

    // DISMANTLE
    if (!pop) {
        $('#'+bodyPlace).append('<hr>');
        let demText;
        if (batType.skills.includes('recupres') || batType.skills.includes('recupcit')) {
            if (batType.skills.includes('recupcit')) {
                if (batType.skills.includes('recupres') || batType.cat === 'buildings') {
                    demText = '(récupérer citoyens et ressources)';
                } else {
                    demText = '(récupérer les citoyens)';
                }
            } else {
                if (batType.skills.includes('recupres')) {
                    demText = '(récupérer des ressources)';
                }
            }
            $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Démanteler '+demText+'" class="boutonRouge skillButtons" onclick="dismantle('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Démanteler</h4></span>');
        }
        $('#'+bodyPlace).append('<span class="blockTitle"><h4><button type="button" title="Supprimer le bataillon (triche!)" class="boutonBleu skillButtons" onclick="removeBat('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Supprimer</h4></span>');
    }

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
};

function batFullInfos(bat) {
    let batType = getBatType(bat);
    $('#popbody').append('<div class="shSpace"></div>');
    $('#popbody').append('<span class="blockTitle"><h4>Habilités spéciales</h4></span><br>');
    let sepa = ' &nbsp;&middot;&nbsp; '
    let allSkills = sepa;
    if (batType.skills.includes('fortif')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut se fortifier">Fortification</span>'+sepa;
    }
    if (batType.skills.includes('bigfortif')) {
        allSkills = allSkills+'<span class="paramValue" title="Meilleur bonus de fortification">Fortification avancée</span>'+sepa;
    }
    if (!batType.skills.includes('noguet') && !batType.skills.includes('sentinelle')) {
        allSkills = allSkills+'<span class="paramValue" title="Peut faire le guet: Cadence de tir 100% en défense">Guet</span>'+sepa;
    }
    if (batType.skills.includes('sentinelle')) {
        allSkills = allSkills+'<span class="paramValue" title="Toujours en mode guet: Cadence de tir 100% en défense">Sentinelle</span>'+sepa;
    }
    if (batType.skills.includes('baddef')) {
        allSkills = allSkills+'<span class="paramValue" title="Cadence de tir seulement 85% en mode guet">Seconde ligne</span>'+sepa;
    }
    if (batType.skills.includes('defense')) {
        allSkills = allSkills+'<span class="paramValue" title="Cadence de tir 150% en défense">Défense</span>'+sepa;
    }
    if (batType.skills.includes('bastion')) {
        allSkills = allSkills+'<span class="paramValue" title="Cadence de tir 200% en défense">Bastion</span>'+sepa;
    }
    if (batType.skills.includes('gooddef')) {
        allSkills = allSkills+'<span class="paramValue" title="2 ripostes supplémentaires">Riposte</span>'+sepa;
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
        allSkills = allSkills+'<span class="paramValue" title="Moins de perte de PA avec les armures lourdes">Strong</span>'+sepa;
    }
    if (batType.skills.includes('fly')) {
        allSkills = allSkills+'<span class="paramValue">Volant</span>'+sepa;
    }
    if (batType.skills.includes('hover')) {
        allSkills = allSkills+'<span class="paramValue">Amphibie</span>'+sepa;
    }
    if (batType.skills.includes('ranger')) {
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
    if (batType.skills.includes('xxxxx')) {
        allSkills = allSkills+'<span class="paramValue" title="zzzzzzzzz">Yyyyyy</span>'+sepa;
    }
    $('#popbody').append('<span class="paramValue">'+allSkills+'</span>');
    $('#popbody').append('<div class="shSpace"></div>');
};

function showEnemyBatInfos(bat) {
    $("#unitInfos").css("display","block");
    $('#unitInfos').empty();
    let alienUnitIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
    let batType = alienUnits[alienUnitIndex];
    let unitsLeft = bat.squadsLeft*batType.squadSize;
    $('#unitInfos').append('<span class="blockTitle"><h3>'+unitsLeft+' '+batType.name+'</h3></span>');
    // SQUADS
    $('#unitInfos').append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.squadsLeft+'/'+batType.squads+'</span><br>');
    let squadHP = batType.squadSize*batType.hp;
    $('#unitInfos').append('<span class="paramName">Dégâts</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Unités/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+batType.squadSize+'</span><br>');
    // PROTECTION
    $('#unitInfos').append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span class="paramValue">'+batType.hp+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Armure</span><span class="paramIcon"></span><span class="paramValue">'+bat.armor+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Taille</span><span class="paramIcon"></span><span class="paramValue">'+batType.size+'</span><br>');
    let stealth = getStealth(bat);
    $('#unitInfos').append('<span class="paramName">Discrétion</span><span class="paramIcon"></span><span class="paramValue">'+stealth+'</span><br>');
    if (bat.tags.includes('fluo')) {
        $('#unitInfos').append('<span class="paramName or">Marqué</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('shield')) {
        $('#unitInfos').append('<span class="paramName cy">Bouclier</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    // WEAPONS
    let balise;
    let thisWeapon = {};
    if (batType.weapon.rof >= 1) {
        thisWeapon = weaponAdj(batType.weapon,bat,'w1');
        balise = 'h4';
        $('#unitInfos').append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span>');
        $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+'</span><br>');
        let attaques = thisWeapon.rof*bat.squadsLeft;
        $('#unitInfos').append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
    }
    // DISMANTLE
    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Supprimer (Tu triches!)" class="boutonBleu skillButtons" onclick="deleteAlien('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Supprimer</h4></span>');

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
    // "skills": []
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
    if (playerInfos.dark && !playerInfos.undarkOnce.includes(selectedTile)) {
        view = false;
    }
    if (view) {
        $('#tileInfos').append('<span class="blockTitle"><h3>'+terrain.fullName+'</h3></span>');
        $('#tileInfos').append('<div class="shSpace"></div>');
        // NOM
        if (tile.tileName !== undefined && tile.tileName !== null && tile.tileName != '') {
            $('#tileInfos').append('<span class="paramIcon"><i class="fas fa-map-signs"></i></span><span class="fullLine or"><b>'+tile.tileName+'</b></span><br>');
        }
        // Aménagements
        if (tile.ruins) {
            $('#tileInfos').append('<span class="paramName cy">Ruines</span><span class="paramIcon"><i class="fas fa-city"></i></span><span class="paramValue cy">Oui</span><br>');
        }
        if (tile.infra != undefined) {
            $('#tileInfos').append('<span class="paramName cy">Infrastructure</span><span class="paramIcon"><i class="ra ra-tower rpg"></i></span><span class="paramValue cy">'+tile.infra+'</span><br>');
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
        $('#tileInfos').append('<span class="paramName">Id</span><span class="paramIcon"></span><span class="paramValue">#'+tile.id+'</span><br>');
        // RESSOURCES
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
                $('#tileInfos').append('<span class="paramName cy">'+key+'</span><span class="paramIcon"></span><span class="paramValue cy">'+value+' <span class="gf">('+bldReq+'-'+res.rarity+')</span></span><br>');
                // console.log(key,value);
            });
        }
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
                    bldReq = ' ('+bldReq+')'
                }
                $('#tileInfos').append('<span class="paramName sky">'+key+'</span><span class="paramIcon"></span><span class="paramValue sky">'+value+'<span class="gf">'+bldReq+'</span></span><br>');
                // console.log(key,value);
            });
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
            saveMap();
            showMap(zone,false);
            showTileInfos(tileId);
        } else {
            // message d'erreur
        }
    }
};

function defCenter(tileId) {
    playerInfos.myCenter = tileId;
    $('html,body').scrollTop(0);
    centerMapCenter();
};
