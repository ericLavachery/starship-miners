function unitDetail(unitId) {
    modal.style.display = "block";
    let batType = getBatTypeById(unitId);
    let bat = {};
    unitInfos(batType);
    batFullInfos(bat,batType);
    batDebarq = {};
};

function unitInfos(batType) {
    $('.modal-header').css('background-image','url(/static/img/oldmetal-jaune.jpg)');
    $('.modal-footer').css('background-image','url(/static/img/oldmetal-jaune.jpg)');
    let headPlace = 'pophead';
    let bodyPlace = 'popbody';
    $('#'+headPlace).empty();
    $('#'+bodyPlace).empty();
    let batPic = batType.pic;
    let resMax = batType.transRes;
    let unitsLeft = batType.squads*batType.squadSize;
    if (batType.squads === 6 && batType.squadSize === 1 && (batType.cat === 'buildings' || batType.cat === 'devices')) {
        unitsLeft = '';
    }
    $('#'+headPlace).append('<img style="vertical-align:-12px;" src="/static/img/units/'+batType.cat+'/'+batPic+'.png">&nbsp;');
    if (batType.skills.includes('nonumname')) {
        $('#'+headPlace).append('<span class="blockTitle"><h6>'+batType.name+'</h6> <span class="cy">(description du type d\'unité)</span></span>');
    } else {
        $('#'+headPlace).append('<span class="blockTitle"><h6>'+unitsLeft+' '+batType.name+'</h6> <span class="cy">(description du type d\'unité)</span></span>');
    }
    $('#'+bodyPlace).append('<div class="shSpace"></div>');
    // TYPE D'UNITE
    let typun = getFullUnitType(batType);
    $('#'+bodyPlace).append('<span class="paramName">Type</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+typun.name+'</span><br>');
    // AP
    let ap = batType.ap;
    let hourglass = 'start';
    $('#'+bodyPlace).append('<span class="paramName">Points d\'action</span><span class="paramEmo">&#8987;</span><span class="paramValue">'+ap+'</span><br>');
    let baseMoveCost = batType.moveCost*moveTuning;
    let mvmt = ap/baseMoveCost;
    mvmt = mvmt.toFixedNumber(1);
    if (batType.moveCost > 90) {mvmt = 0;}
    $('#'+bodyPlace).append('<span class="paramName">Mouvement</span><span class="paramEmo">&#10145;</span><span class="paramValue">'+mvmt+'</span><br>');
    if (batType.moveCost < 90) {
        let bta = listBatTerrainAccess(batType,false);
        $('#'+bodyPlace).append('<span class="paramName" title="Terrains accessibles">Terrains</span><span class="paramEmo">&nbsp;</span><span class="paramValue" title="'+bta[1]+'">'+bta[0]+'</span><br>');
    }
    // SQUADS
    $('#'+bodyPlace).append('<span class="paramName">Escouades</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+batType.squads+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Unités/Escouade</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+batType.squadSize+'</span><br>');
    let totalCrew = batType.crew*batType.squadSize*batType.squads;
    let crewType = 'Citoyens';
    if (batType.skills.includes('dog')) {
        crewType = 'Chiens';
    } else if (batType.skills.includes('clone')) {
        crewType = 'Clones';
    } else if (batType.skills.includes('brigands')) {
        crewType = 'Criminels';
    }
    $('#'+bodyPlace).append('<span class="paramName">Personnel</span><span class="paramEmo">&#128101;</span><span class="paramValue">'+totalCrew+' '+crewType+'</span><br>');
    // PROTECTION
    let squadHP = batType.squadSize*batType.hp;
    let batHP = squadHP*batType.squads;
    $('#'+bodyPlace).append('<span class="paramName">Points de vie</span><span class="paramEmo">&#128156;</span><span class="paramValue"><span title="PV unité">'+batType.hp+'</span> | <span title="PV escouade">'+squadHP+'</span> | <span title="PV bataillon">'+batHP+'</span></span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Armure</span><span class="paramEmo">&#128737;</span><span class="paramValue">'+batType.armor+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Furtivité</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+batType.stealth+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Attraction</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+batType.fuzz+'</span><br>');
    // Volume
    let volume = calcUnitVolume(batType);
    let prefabWeight = calcPrefabWeight(batType);
    let showVolume = false;
    if (batType.skills.includes('prefab')) {
        showVolume = true;
    } else if (batType.cat != 'buildings' && batType.cat != 'devices' && !batType.skills.includes('transorbital')) {
        showVolume = true;
    }
    if (showVolume) {
        if (prefabWeight >= 1) {
            $('#'+bodyPlace).append('<span class="paramName">Volume</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+volume+'</span><br>');
            $('#'+bodyPlace).append('<span class="paramName">Volume (ressources)</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+prefabWeight+'</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName">Volume</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+volume+'</span><br>');
        }
    }
    $('#'+bodyPlace).append('<span class="paramName">Taille</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+batType.size+'</span><br>');
    // AUTOSKILLS
    if (batType.transUnits >= 1) {
        let transBase = batType.transUnits;
        let numBats = transBase/180;
        numBats = numBats.toFixedNumber(1);
        $('#'+bodyPlace).append('<span class="paramName">Transport</span><span class="paramEmo">&#128652;</span><span class="paramValue" title="'+numBats+' bataillons d\'infanterie | Taille max: '+batType.transMaxSize+'">'+transBase+' <span class="gf">(volume des bataillons)</span></span><br>');
    }
    if (batType.transRes >= 1) {
        $('#'+bodyPlace).append('<span class="paramName">Fret</span><span class="paramEmo">&#128230;</span><span class="paramValue">'+resMax+' <span class="gf">(ressources)</span></span><br>');
    }
    if (batType.skills.includes('reserve') || batType.skills.includes('transorbital')) {
        $('#'+bodyPlace).append('<span class="paramName">Réserve</span><span class="paramEmo">&nbsp;</span><span class="paramValue">Oui</span><br>');
    }
    if (batType.skills.includes('ravitaillement')) {
        if (batType.skills.includes('stockmed')) {
            $('#'+bodyPlace).append('<span class="paramName">Officine</span><span class="paramEmo">&nbsp;</span><span class="paramValue">999</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName">Ravitaillements</span><span class="paramEmo">&#128163;</span><span class="paramValue">'+batType.maxSkill+'</span><br>');
        }
    }
    if (batType.skills.includes('dealer')) {
        $('#'+bodyPlace).append('<span class="paramName">Drogues</span><span class="paramEmo">&#128138;</span><span class="paramValue">'+batType.maxDrug+'</span><br>');
        let possibleDrugs = getUnitPossibleDrugs(batType);
        $('#'+bodyPlace).append('<span class="paramName">Drogues</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+possibleDrugs+'</span><br>');
    }
    // MECAMEDIC
    if (batType.skills.includes('medic') || batType.skills.includes('badmedic') || batType.skills.includes('selfbadmedic') || batType.skills.includes('selfmedic')) {
        let times = Math.ceil(batType.ap/batType.mediCost);
        let medicTitle = 'Complets';
        let medicDesc = 'Peut soigner totalement les infanteries';
        if (batType.skills.includes('selfmedic')) {
            medicTitle = 'Complets (perso)';
            medicDesc = 'Peut se soigner totalement (mais pas les autres bataillons)';
        } else if (batType.skills.includes('badmedic')) {
            medicTitle = 'Premiers soins';
            medicDesc = 'Peut apporter les premiers soins aux infanteries';
        } else if (batType.skills.includes('selfbadmedic')) {
            medicTitle = 'Premiers soins (perso)';
            medicDesc = 'Peut s\'apporter les premiers soins (mais pas aux autres bataillons)';
        }
        medicTitle = medicTitle+' | &times;'+times;
        $('#'+bodyPlace).append('<span class="paramName">Soins</span><span class="paramEmo">&#128148;</span><span class="paramValue" title="'+medicDesc+'">'+medicTitle+'</span><br>');
    }
    if (batType.skills.includes('mecano') || batType.skills.includes('badmecano') || batType.skills.includes('selfbadmecano') || batType.skills.includes('selfmecano')) {
        let times = Math.ceil(batType.ap/batType.mecanoCost);
        let mecanoTitle = 'Total';
        let mecanoDesc = 'Peut réparer totalement les véhicules';
        if (batType.skills.includes('selfmecano')) {
            mecanoTitle = 'Total (perso)';
            mecanoDesc = 'Peut se réparer totalement (mais pas les autres véhicules)';
        } else if (batType.skills.includes('badmecano')) {
            mecanoTitle = 'Rafistolage';
            mecanoDesc = 'Peut rafistoler les véhicules';
        } else if (batType.skills.includes('selfbadmecano')) {
            mecanoTitle = 'Rafistolage (perso)';
            mecanoDesc = 'Peut se rafistoler (mais pas les autres véhicules)';
        }
        mecanoTitle = mecanoTitle+' | &times;'+times;
        $('#'+bodyPlace).append('<span class="paramName">Dépanage</span><span class="paramEmo">&#128663;</span><span class="paramValue" title="'+mecanoDesc+'">'+mecanoTitle+'</span><br>');
    }
    if (batType.skills.includes('repair') || batType.skills.includes('selfbadrepair') || batType.skills.includes('selfrepair')) {
        let repairCost = batType.mecanoCost;
        if (batType.skills.includes('repbad')) {
            repairCost = repairCost*5;
        }
        let times = Math.ceil(batType.ap/repairCost);
        let repairTitle = 'Totale';
        let repairDesc = 'Peut réparer totalement les bâtiments';
        if (batType.skills.includes('selfrepair')) {
            repairTitle = 'Totale (perso)';
            repairDesc = 'Peut se réparer totalement (mais pas les autres bâtiments)';
        } else if (batType.skills.includes('selfbadrepair')) {
            repairTitle = 'Rafistolage (perso)';
            repairDesc = 'Peut se rafistoler (mais pas les autres bâtiments)';
        }
        repairTitle = repairTitle+' | &times;'+times;
        $('#'+bodyPlace).append('<span class="paramName">Réparations</span><span class="paramEmo">&#127976;</span><span class="paramValue" title="'+repairDesc+'">'+repairTitle+'</span><br>');
    }
    // ECLAIRAGE
    let vue = 0;
    if (batType.crew >=1 || batType.skills.includes('robot') || batType.skills.includes('clone')) {
        vue = 1;
    }
    if (batType.skills.includes('light')) {
        vue = 2;
    }
    if (batType.skills.includes('flash') || batType.skills.includes('bigflash')) {
        vue = 3;
    }
    if (batType.skills.includes('phare')) {
        vue = 4;
        if (playerInfos.comp.energ >= 2 && playerInfos.comp.det >= 2) {
            vue++;
        }
        if (playerInfos.comp.energ >= 3 && playerInfos.comp.det >= 4) {
            vue++;
        }
    }
    $('#'+bodyPlace).append('<span class="paramName">Eclairage</span><span class="paramEmo">&nbsp;</span><span class="paramValue" title="Distance d\'éclairage">'+vue+'</span><br>');
    // POSE DISPOSITIFS
    if (batType.skills.includes('landmine') || batType.skills.includes('dynamite') || batType.skills.includes('trapap') || batType.skills.includes('trapdard') || batType.skills.includes('trapfosse')) {
        let trapName = getUnitTrapName(batType);
        $('#'+bodyPlace).append('<span class="paramName">'+trapName+'</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+batType.maxSkill+'</span><br>');
    }
    if (batType.skills.includes('barbs')) {
        $('#'+bodyPlace).append('<span class="paramName">Barbelés</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+batType.maxSkill+'</span><br>');
    }
    if (batType.skills.includes('conscont')) {
        $('#'+bodyPlace).append('<span class="paramName">Coffres</span><span class="paramEmo">&nbsp;</span><span class="paramValue" title="Confection de containers">Oui</span><br>');
    }
    // EQUIV BLD
    if (batType.bldEquiv != undefined) {
        if (batType.bldEquiv.length >= 1) {
            $('#'+bodyPlace).append('<span class="paramName">Equivalence</span><span class="paramEmo">&nbsp;</span><span class="paramValue" title="Avoir un(e) '+batType.name+' équivaut à avoir ces bâtiments">'+toNiceString(batType.bldEquiv)+'</span><br>');
        }
    }

    // WEAPONS & SKILLS
    weaponsUnitInfos(batType);
    $('#'+bodyPlace).append('<div class="shSpace"></div>');

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
};

function getUnitPossibleDrugs(batType) {
    let possibleDrugs = '';
    armorTypes.forEach(function(drug) {
        if (drug.cat === 'drogue' && drug.name != 'meca') {
            if (batType.skills.includes(drug.name)) {
                possibleDrugs = possibleDrugs+'| <span title="'+drug.info+'">'+drug.name+'</span> ';
            }
        }
    });
    possibleDrugs = possibleDrugs+'|';
    return possibleDrugs;
};

function unitWeaponDisplay(thisWeapon,batType) {
    let bodyPlace = 'popbody';
    $('#'+bodyPlace).append('<div class="shSpace"></div>');
    $('#'+bodyPlace).append('<span class="blockTitle"><h4>'+thisWeapon.name+'</h4></span><br>');
    if (thisWeapon.kit) {
        $('#'+bodyPlace).append('<span class="rose">Uniquement avec l\'équipement approprié</span><br>');
    }
    let maxSalves = batType.maxSalvo;
    if (thisWeapon.noBis) {
        maxSalves = 1;
    }
    $('#'+bodyPlace).append('<span class="paramName">Salves</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+maxSalves+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">PA/Salve</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Portée</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+thisWeapon.range+'</span><br>');
    if (thisWeapon.elevation >= 1) {
        $('#'+bodyPlace).append('<span class="paramName">Elevation</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+thisWeapon.elevation+'</span><br>');
    }
    let accFly;
    let dca = 1;
    if (thisWeapon.dca != undefined) {
        dca = thisWeapon.dca;
    }
    if (thisWeapon.noFly) {
        accFly = 0;
    } else {
        accFly = Math.round(thisWeapon.accuracy*dca);
    }
    let accGround;
    if (thisWeapon.noGround) {
        accGround = 0;
    } else {
        accGround = thisWeapon.accuracy;
    }
    $('#'+bodyPlace).append('<span class="paramName">Précision</span><span class="paramEmo">&nbsp;</span><span class="paramValue"><span title="Contre aliens au sol">'+accGround+'</span> &Map; <span title="Contre aliens volants">'+accFly+'</span></span><br>');
    let rof = thisWeapon.rof*batType.squads;
    $('#'+bodyPlace).append('<span class="paramName">Puisance</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+rof+' &times '+thisWeapon.power+'</span><br>');
    let aoe = thisWeapon.aoe;
    if (thisWeapon.aoe === 'unit') {
        aoe = 'unité';
    }
    if (thisWeapon.aoe === 'squad') {
        aoe = 'escouade';
    }
    if (thisWeapon.aoe === 'bat') {
        aoe = 'bataillon';
    }
    $('#'+bodyPlace).append('<span class="paramName">Aire d\'effet</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+aoe+'</span><br>');
    if (thisWeapon.maxAmmo != undefined) {
        $('#'+bodyPlace).append('<span class="paramName">Munitions</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+thisWeapon.maxAmmo+'</span><br>');
    }
    if (thisWeapon.noAtt) {
        $('#'+bodyPlace).append('<span class="paramName">Attaque</span><span class="paramEmo">&nbsp;</span><span class="paramValue">Non</span><br>');
    }
    if (thisWeapon.noDef) {
        $('#'+bodyPlace).append('<span class="paramName">Riposte</span><span class="paramEmo">&nbsp;</span><span class="paramValue">Non</span><br>');
    }
    if (thisWeapon.bigDef) {
        $('#'+bodyPlace).append('<span class="paramName" title="Bonus en défense contre les aliens de grande taille">Piquier</span><span class="paramEmo">&nbsp;</span><span class="paramValue">Oui</span><br>');
    }
    if (thisWeapon.noBig) {
        let bigSize = Math.round(batType.size/2);
        $('#'+bodyPlace).append('<span class="paramName" title="Dégâts réduits sur les aliens de taille '+bigSize+' ou plus">Bélier</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+bigSize+'+</span><br>');
    }
    if (thisWeapon.noMelee) {
        $('#'+bodyPlace).append('<span class="paramName">Utilisation en mêlée</span><span class="paramEmo">&nbsp;</span><span class="paramValue">Non</span><br>');
    }
    if (thisWeapon.isMelee) {
        $('#'+bodyPlace).append('<span class="paramName">Arme de contact</span><span class="paramEmo">&nbsp;</span><span class="paramValue">Oui</span><br>');
    }
    if (thisWeapon.isShort) {
        $('#'+bodyPlace).append('<span class="paramName">Arme courte</span><span class="paramEmo">&nbsp;</span><span class="paramValue">Oui</span><br>');
    }
    if (thisWeapon.isMelee || thisWeapon.noShield) {
        $('#'+bodyPlace).append('<span class="paramName">Passe les boucliers</span><span class="paramEmo">&nbsp;</span><span class="paramValue">Oui</span><br>');
    }
    let noise = 3;
    if (thisWeapon.noise != undefined) {
        noise = thisWeapon.noise;
    }
    $('#'+bodyPlace).append('<span class="paramName">Discrétion</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+noise+'</span><br>');
    // RAVIT
    if (thisWeapon.maxAmmo != undefined) {
        $('#'+bodyPlace).append('<span class="paramName" title="Nombre de tirs avant ravitaillement">Munitions</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+thisWeapon.maxAmmo+'</span><br>');
        if (thisWeapon.ravitBld != undefined) {
            let ravitBlds = thisWeapon.ravitBld;
            if (!ravitBlds.includes('Poudrière')) {
                ravitBlds = ravitBlds+', Poudrière';
            }
            $('#'+bodyPlace).append('<span class="paramName" title="Bâtiment(s) requis pour le ravitaillement">Bâtiment(s)</span><span class="paramEmo">&nbsp;</span><span class="paramValue">'+ravitBlds+'</span><br>');
        }
    }
    // MUNITIONS
    let ammoString = displayWeaponAmmos(batType,thisWeapon);
    $('#'+bodyPlace).append('<span class="paramValue">'+ammoString+'</span><br>');
    $('#popbody').append('<div class="shSpace"></div>');

    // thisWeapon.kit = weapon.kit;

}

function weaponsUnitInfos(batType) {
    let bodyPlace = 'popbody';
    if (batType.weapon.rof >= 1) {
        unitWeaponDisplay(batType.weapon,batType);
    }
    if (batType.weapon2.rof >= 1) {
        unitWeaponDisplay(batType.weapon2,batType);
    }

};

function getFullUnitType(batType) {
    let typun = {};
    typun.name = 'Infanterie';
    typun.emo = '&#128101;';
    if (batType.cat === 'buildings') {
        if (batType.skills.includes('prefab')) {
            typun.name = 'Bâtiment préfabriqué';
        } else {
            typun.name = 'Bâtiment permanent';
        }
        typun.emo = '&#128101;';
    } else if (batType.cat === 'devices') {
        if (batType.skills.includes('prefab')) {
            typun.name = 'Dispositifs préfabriqués';
        } else {
            typun.name = 'Dispositifs permanents';
        }
        typun.emo = '&#128101;';
    } else if (batType.cat === 'vehicles') {
        if (batType.skills.includes('robot')) {
            typun.name = 'Robots';
            typun.emo = '&#128101;';
        } else if (batType.skills.includes('cyber')) {
            typun.name = 'Cyber-robots';
            typun.emo = '&#128101;';
        } else if (batType.skills.includes('transorbital')) {
            if (batType.skills.includes('rescue')) {
                typun.name = 'Lander (Navette)';
            } else {
                typun.name = 'Lander';
            }
            typun.emo = '&#128101;';
        } else {
            typun.name = 'Véhicules';
            typun.emo = '&#128101;';
        }
    } else if (batType.cat === 'infantry') {
        if (batType.skills.includes('cyber')) {
            typun.name = 'Cyborgs';
            typun.emo = '&#128101;';
        } else if (batType.skills.includes('dog')) {
            typun.name = 'Animaux';
            typun.emo = '&#128101;';
        } else if (batType.skills.includes('clone')) {
            typun.name = 'Clones';
            typun.emo = '&#128101;';
        }
    }
    return typun;
};

function allUnitsSkills() {
    let allSkills = [];
    unitTypes.forEach(function(unit) {
        if (unit.skills.length >= 1) {
            unit.skills.forEach(function(skill) {
                if (!allSkills.includes(skill)) {
                    allSkills.push(skill);
                }
            });
        }
    });
    console.log(allSkills);
};
