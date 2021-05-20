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
    let tagColor = 'cy';
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
            $('#'+bodyPlace).append('<span class="paramName cy">Officine</span><span class="paramIcon"></span><span class="paramValue cy">999/999</span><br>');
        } else {
            $('#'+bodyPlace).append('<span class="paramName cy">Ravitaillements</span><span class="paramIcon"></span><span class="paramValue cy">'+batType.maxSkill+'</span><br>');
        }
    }
    if (batType.transUnits >= 1) {
        let transBase = batType.transUnits;
        $('#'+bodyPlace).append('<span class="paramName cy">Transport</span><span class="paramIcon"></span><span class="paramValue cy">'+transBase+'</span><br>');
    }
    if (batType.transRes >= 1) {
        $('#'+bodyPlace).append('<span class="paramName cy">Fret</span><span class="paramIcon"></span><span class="paramValue cy">'+resMax+'</span><br>');
    }
    if (batType.skills.includes('reserve') || batType.skills.includes('transorbital')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Réserve</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (batType.skills.includes('dealer')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Drogues</span><span class="paramIcon"></span><span class="paramValue cy">'+batType.maxDrug+'</span><br>');
    }
    if (batType.skills.includes('landmine') || batType.skills.includes('dynamite') || batType.skills.includes('trapap') || batType.skills.includes('trapdard') || batType.skills.includes('trapfosse')) {
        let trapName = getUnitTrapName(batType);
        $('#'+bodyPlace).append('<span class="paramName cy">'+trapName+'</span><span class="paramIcon"></span><span class="paramValue cy">'+batType.maxSkill+'</span><br>');
    }
    if (batType.skills.includes('constructeur')) {
        $('#'+bodyPlace).append('<span class="paramName cy">Barbelés</span><span class="paramIcon"></span><span class="paramValue cy">'+batType.maxSkill+'</span><br>');
    }

    // WEAPONS & SKILLS
    // weaponsInfos(bat,batType,pop);
    $('#'+bodyPlace).append('<div class="shSpace"></div>');

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
};
