function unitDetail(unitId) {
    modal.style.display = "block";
    let batType = getBatTypeById(unitId);
    let bat = {};
    unitInfos(batType);
    batFullInfos(bat,batType);
    batDebarq = {};
};

function unitInfos(batType) {
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
    $('#'+headPlace).append('<img src="/static/img/units/'+batType.cat+'/'+batPic+'.png">&nbsp;');
    if (batType.skills.includes('nonumname')) {
        $('#'+headPlace).append('<span class="blockTitle"><h2>'+batType.name+'</h2></span>');
    } else {
        $('#'+headPlace).append('<span class="blockTitle"><h2>'+unitsLeft+' '+batType.name+'</h2></span>');
    }
    $('#'+bodyPlace).append('<div class="shSpace"></div>');
    // AP
    let ap = batType.ap;
    let hourglass = 'start';
    $('#'+bodyPlace).append('<span class="paramName">Points d\'action</span><span class="paramIcon"><i class="fas fa-hourglass-'+hourglass+'"></i></span><span class="paramValue">'+ap+'</span><br>');
    // SQUADS
    $('#'+bodyPlace).append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+batType.squads+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Unités/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+batType.squadSize+'</span><br>');
    let totalCrew = batType.crew*batType.squadSize*batType.squads;
    $('#'+bodyPlace).append('<span class="paramName">Personnel</span><span class="paramIcon"><i class="fas fa-user-friends"></i></span><span class="paramValue">'+totalCrew+'</span><br>');
    // PROTECTION
    let squadHP = batType.squadSize*batType.hp;
    let batHP = squadHP*batType.squads;
    $('#'+bodyPlace).append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span class="paramValue">'+batType.hp+' / '+squadHP+' / '+batHP+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Armure</span><span class="paramIcon"><i class="fas fa-shield-alt"></i></span><span class="paramValue">'+batType.armor+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Furtivité</span><span class="paramIcon"></span><span class="paramValue">'+batType.stealth+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Attraction</span><span class="paramIcon"></span><span class="paramValue">'+batType.fuzz+'</span><br>');
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
            $('#'+bodyPlace).append('<span class="paramName">Volume</span><span class="paramIcon"><i class="fas fa-weight-hanging"></i></span><span class="paramValue">'+volume+'</span><br>');
            $('#'+bodyPlace).append('<span class="paramName">Volume (ressources)</span><span class="paramIcon"><i class="fas fa-weight-hanging"></i></span><span class="paramValue">'+prefabWeight+'</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName">Volume</span><span class="paramIcon"><i class="fas fa-weight-hanging"></i></span><span class="paramValue">'+volume+'</span><br>');
        }
    }
    $('#'+bodyPlace).append('<span class="paramName">Taille</span><span class="paramIcon"></span><span class="paramValue">'+batType.size+'</span><br>');
    // AUTOSKILLS
    if (batType.skills.includes('ravitaillement')) {
        if (batType.skills.includes('stockmed')) {
            $('#'+bodyPlace).append('<span class="paramName">Officine</span><span class="paramIcon"></span><span class="paramValue">999/999</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName">Ravitaillements</span><span class="paramIcon"></span><span class="paramValue">'+batType.maxSkill+'</span><br>');
        }
    }
    if (batType.transUnits >= 1) {
        let transBase = batType.transUnits;
        $('#'+bodyPlace).append('<span class="paramName">Transport</span><span class="paramIcon"></span><span class="paramValue">'+transBase+'</span><br>');
    }
    if (batType.transRes >= 1) {
        $('#'+bodyPlace).append('<span class="paramName">Fret</span><span class="paramIcon"></span><span class="paramValue">'+resMax+'</span><br>');
    }
    if (batType.skills.includes('reserve') || batType.skills.includes('transorbital')) {
        $('#'+bodyPlace).append('<span class="paramName">Réserve</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
    }
    if (batType.skills.includes('dealer')) {
        $('#'+bodyPlace).append('<span class="paramName">Drogues</span><span class="paramIcon"></span><span class="paramValue">'+batType.maxDrug+'</span><br>');
    }
    if (batType.skills.includes('landmine') || batType.skills.includes('dynamite') || batType.skills.includes('trapap') || batType.skills.includes('trapdard') || batType.skills.includes('trapfosse')) {
        let trapName = getUnitTrapName(batType);
        $('#'+bodyPlace).append('<span class="paramName">'+trapName+'</span><span class="paramIcon"></span><span class="paramValue">'+batType.maxSkill+'</span><br>');
    }
    if (batType.skills.includes('constructeur')) {
        $('#'+bodyPlace).append('<span class="paramName">Barbelés</span><span class="paramIcon"></span><span class="paramValue">'+batType.maxSkill+'</span><br>');
    }

    // WEAPONS & SKILLS
    weaponsUnitInfos(batType);
    $('#'+bodyPlace).append('<div class="shSpace"></div>');

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
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
    $('#'+bodyPlace).append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+maxSalves+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
    $('#'+bodyPlace).append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+'</span><br>');
    if (thisWeapon.elevation >= 1) {
        $('#'+bodyPlace).append('<span class="paramName">Elevation</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.elevation+'</span><br>');
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
    $('#'+bodyPlace).append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue"><span title="Contre aliens au sol">'+accGround+'</span> &Map; <span title="Contre aliens volants">'+accFly+'</span></span><br>');
    let rof = thisWeapon.rof*batType.squads;
    $('#'+bodyPlace).append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+rof+' &times '+thisWeapon.power+'</span><br>');
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
    $('#'+bodyPlace).append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+aoe+'</span><br>');
    if (thisWeapon.maxAmmo != undefined) {
        $('#'+bodyPlace).append('<span class="paramName">Munitions</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.maxAmmo+'</span><br>');
    }
    if (thisWeapon.noAtt) {
        $('#'+bodyPlace).append('<span class="paramName">Attaque</span><span class="paramIcon"></span><span class="paramValue">Non</span><br>');
    }
    if (thisWeapon.noDef) {
        $('#'+bodyPlace).append('<span class="paramName">Riposte</span><span class="paramIcon"></span><span class="paramValue">Non</span><br>');
    }
    if (thisWeapon.bigDef) {
        $('#'+bodyPlace).append('<span class="paramName" title="Bonus en défense contre les aliens de grande taille">Piquier</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
    }
    if (thisWeapon.noBig) {
        let bigSize = Math.round(batType.size/2);
        $('#'+bodyPlace).append('<span class="paramName" title="Dégâts réduits sur les aliens de taille '+bigSize+' ou plus">Bélier</span><span class="paramIcon"></span><span class="paramValue">'+bigSize+'+</span><br>');
    }
    if (thisWeapon.noMelee) {
        $('#'+bodyPlace).append('<span class="paramName">Utilisation en mêlée</span><span class="paramIcon"></span><span class="paramValue">Non</span><br>');
    }
    if (thisWeapon.isMelee) {
        $('#'+bodyPlace).append('<span class="paramName">Arme de contact</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
    }
    if (thisWeapon.isShort) {
        $('#'+bodyPlace).append('<span class="paramName">Arme courte</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
    }
    if (thisWeapon.isMelee || thisWeapon.noShield) {
        $('#'+bodyPlace).append('<span class="paramName">Passe les boucliers</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
    }

    let noise = 3;
    if (thisWeapon.noise != undefined) {
        noise = thisWeapon.noise;
        $('#'+bodyPlace).append('<span class="paramName">Bruit</span><span class="paramIcon"></span><span class="paramValue">'+noise+'</span><br>');
    }

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
