function goSoute() {
    inSoute = true;
    $("#zone_map").css("display","none");
    $("#zone_soute").css("display","block");
    souteMenu();
    landerMenu();
    souteList();
    landerList();
    showBatInfos(selectedBat);
};

function goStation() {
    inSoute = false;
    $("#zone_map").css("display","grid");
    $("#zone_soute").css("display","none");
    showMap(zone,true);
    showBatInfos(selectedBat);
};

function getLandersIds() {
    let landersIds = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital') && batType.name != 'Soute') {
                landersIds.push(bat.id);
            }
        }
    });
    return landersIds;
};

function souteMenu() {
    $('#menu_soute').empty();
    if (souteFilter === 'all') {
        $('#menu_soute').append('<span class="listRes cy">Tous</span>');
    } else {
        $('#menu_soute').append('<span class="listRes klik" onclick="setSouteFilter(`all`)">Tous</span>');
    }
    if (souteFilter === 'infantry') {
        $('#menu_soute').append('<span class="listRes cy">Infanteries</span>');
    } else {
        $('#menu_soute').append('<span class="listRes klik" onclick="setSouteFilter(`infantry`)">Infanteries</span>');
    }
    if (souteFilter === 'support') {
        $('#menu_soute').append('<span class="listRes cy">Support</span>');
    } else {
        $('#menu_soute').append('<span class="listRes klik" onclick="setSouteFilter(`support`)">Support</span>');
    }
    if (souteFilter === 'cyberobots') {
        $('#menu_soute').append('<span class="listRes cy">Cyber & Robots</span>');
    } else {
        $('#menu_soute').append('<span class="listRes klik" onclick="setSouteFilter(`cyberobots`)">Cyber & Robots</span>');
    }
    if (souteFilter === 'vehicles') {
        $('#menu_soute').append('<span class="listRes cy">Véhicules</span>');
    } else {
        $('#menu_soute').append('<span class="listRes klik" onclick="setSouteFilter(`vehicles`)">Véhicules</span>');
    }
    if (souteFilter === 'prefabs') {
        $('#menu_soute').append('<span class="listRes cy">Préfabriqués</span>');
    } else {
        $('#menu_soute').append('<span class="listRes klik" onclick="setSouteFilter(`prefabs`)">Préfabriqués</span>');
    }
};

function setSouteFilter(filter) {
    souteFilter = filter;
    goSoute();
};

function landerMenu() {
    $('#menu_lander').empty();
    let landersIds = getLandersIds();
    landersIds.forEach(function(landerId) {
        let landerBat = getBatById(landerId);
        let landerBatType = getBatType(landerBat);
        if (landerId === slId) {
            $('#menu_lander').append('<span class="listRes cy">'+landerBatType.name+'</span>');
        } else {
            $('#menu_lander').append('<span class="listRes klik" onclick="landerSelection('+landerId+')">'+landerBatType.name+'</span>');
        }
        if (landerBat.chief != undefined) {
            if (landerBat.chief != '') {
                $('#menu_lander').append('<span class="listRes gf">('+landerBat.chief+')</span>&nbsp;');
            }
        }
    });
};

function landerSelection(landerId) {
    slId = landerId;
    goSoute();
};

function souteList() {
    $('#list_soute').empty();
    let landersIds = getLandersIds();
    if (souteFilter === 'all' || souteFilter === 'infantry') {
        souteBatList('infantry',playerInfos.gang,'','robot',landersIds,-1);
        souteBatList('infantry','','clone','',landersIds,-1);
        souteBatList('infantry','','mutant','',landersIds,-1);
    }
    if (souteFilter === 'all' || souteFilter === 'support') {
        souteBatList('infantry','zero-','','robot',landersIds,-1);
    }
    if (souteFilter === 'all' || souteFilter === 'cyberobots') {
        souteBatList('infantry','','cyber','',landersIds,-1);
        souteBatList('vehicles','','cyber','',landersIds,-1);
        souteBatList('vehicles','','robot','',landersIds,-1);
    }
    if (souteFilter === 'all' || souteFilter === 'vehicles') {
        souteBatList('vehicles',playerInfos.gang,'','robot',landersIds,-1);
        souteBatList('vehicles','zero-','','robot',landersIds,-1);
    }
    if (souteFilter === 'all' || souteFilter === 'prefabs') {
        souteBatList('devices','','prefab','robot',landersIds,-1);
        souteBatList('buildings','','prefab','robot',landersIds,-1);
    }
};

function landerList() {
    $('#list_lander').empty();
    let landersIds = getLandersIds();
    souteBatList('infantry',playerInfos.gang,'','robot',landersIds,slId);
    souteBatList('infantry','','clone','',landersIds,slId);
    souteBatList('infantry','','mutant','',landersIds,slId);
    souteBatList('infantry','zero-','','robot',landersIds,slId);
    souteBatList('infantry','','cyber','',landersIds,slId);
    souteBatList('vehicles','','cyber','',landersIds,slId);
    souteBatList('vehicles','','robot','',landersIds,slId);
    souteBatList('vehicles',playerInfos.gang,'','robot',landersIds,slId);
    souteBatList('vehicles','zero-','','robot',landersIds,slId);
    souteBatList('devices','','prefab','robot',landersIds,slId);
    souteBatList('buildings','','prefab','robot',landersIds,slId);
};

function souteBatList(cat,partKind,skill,noSkill,landersIds,idOfLander) {
    let showMe = true;
    let colId = 'list_soute';
    if (idOfLander >= 0) {
        colId = 'list_lander';
    }
    let sortedBats = bataillons.slice();
    sortedBats = _.sortBy(_.sortBy(_.sortBy(sortedBats,'id'),'type'),'type');
    sortedBats.forEach(function(bat) {
        let batType = getBatType(bat);
        showMe = false;
        if (idOfLander >= 0) {
            if (bat.loc === 'trans' && bat.locId === idOfLander) {
                showMe = true;
            }
        } else {
            if (bat.loc === 'zone' || !landersIds.includes(bat.locId)) {
                showMe = true;
            }
        }
        if (batType.skills.includes(noSkill) || (noSkill === 'robot' && (batType.skills.includes('cyber') || batType.skills.includes('mutant') || batType.skills.includes('clone')))) {
            showMe = false;
        }
        if (batType.skills.includes('transorbital')) {
            showMe = false;
        }
        if (batType.id === 126 || batType.id === 225) {
            showMe = false;
        }
        if (showMe) {
            if (batType.cat.includes(cat) && batType.kind.includes(partKind)) {
                if (skill === '' || batType.skills.includes(skill)) {
                    if (bat.loc === 'zone' && idOfLander < 0) {
                        loadBat(bat.id,souteId);
                    }
                    batListElement(bat,batType,idOfLander);
                }
            }
        }
    });
};

function batListElement(bat,batType,idOfLander) {
    let colId = 'list_soute';
    if (idOfLander >= 0) {
        colId = 'list_lander';
    }
    let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq]);
    let enoughRes = checkCost(deployCosts);
    if (!enoughRes) {
        if (bat.id === selectedBat.id) {
            blockType = 'souteBlockCheck';
        } else {
            blockType = 'souteBlockNope klik';
        }
    } else {
        if (bat.id === selectedBat.id) {
            blockType = 'souteBlockCheck';
        } else {
            blockType = 'souteBlock klik';
        }
    }
    let selId = bat.id;
    if (bat.id === selectedBat.id) {
        selId = souteId;
    }
    $('#'+colId).append('<div class="'+blockType+'" onclick="batSouteSelect('+selId+')"><table><tr><td><img src="/static/img/units/'+batType.cat+'/'+batType.pic+'.png" width="48"></td><td id="be'+bat.id+'"></td></tr></table></div>');
    $('#be'+bat.id).append('<span class="listRes klik">'+batType.name+'</span>');
    if (bat.chief != undefined) {
        if (bat.chief != '') {
            $('#be'+bat.id).append('<span class="listRes gf">('+bat.chief+')</span>');
        }
    }
    $('#be'+bat.id).append('<br>');
    let prt = bat.prt;
    if (prt.includes('aucun')) {
        prt = '/';
    }
    $('#be'+bat.id).append('<span class="listRes gff">Prt: <span class="brunf">'+prt+'</span></span>&nbsp;');
    let eq = bat.eq;
    if (eq.includes('aucun')) {
        eq = '/';
    }
    $('#be'+bat.id).append('<span class="listRes gff">Eq: <span class="brunf">'+eq+'</span></span>&nbsp;');
    if (bat.logeq != '') {
        $('#be'+bat.id).append('<span class="listRes gff">Eq2: <span class="brunf">'+bat.logeq+'</span></span>&nbsp;');
    }
    $('#be'+bat.id).append('<br>');
    if (checkHasWeapon(1,batType,bat.eq)) {
        $('#be'+bat.id).append('<span class="listRes gff">'+batType.weapon.name+': <span class="brunf">'+bat.ammo+'</span></span>&nbsp;');
    }
    if (checkHasWeapon(2,batType,bat.eq)) {
        $('#be'+bat.id).append('<span class="listRes gff">'+batType.weapon2.name+': <span class="brunf">'+bat.ammo2+'</span></span>&nbsp;');
    }
    if (bat.id === selectedBat.id) {
        $('#be'+bat.id).append('<hr class="cyff">');
        showCostsDetail(deployCosts,bat);
    }
};

function batSouteSelect(batId) {
    let bat = getBatById(batId);
    selectedBat = JSON.parse(JSON.stringify(bat));
    // console.log(selectedBat);
    checkSelectedBatType();
    // showBatInfos(selectedBat);
    goSoute();
};

function batDeploy(batId) {
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq]);
    let enoughRes = checkCost(deployCosts);
    if (enoughRes) {
        payCost(deployCosts);
        loadBat(bat.id,slId,souteId);
    } else {
        console.log('not enough res');
    }
    goSoute();
};

function batUndeploy(batId) {
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq]);
    addCost(deployCosts,1);
    loadBat(bat.id,souteId,slId);
    goSoute();
};

function loadBat(batId,transBatId,oldTransBatId) {
    let bat = getBatById(batId);
    let transBat = getBatById(transBatId);
    bat.loc = 'trans';
    bat.locId = transBat.id;
    bat.tileId = transBat.tileId;
    if (!transBat.transIds.includes(bat.id)) {
        transBat.transIds.push(bat.id);
    }
    if (oldTransBatId != undefined) {
        if (oldTransBatId >= 0) {
            let oldTransBat = getBatById(oldTransBatId);
            if (oldTransBat.transIds.includes(bat.id)) {
                let tagIndex = oldTransBat.transIds.indexOf(bat.id);
                oldTransBat.transIds.splice(tagIndex,1);
            }
        }
    }
    let batListIndex = batList.findIndex((obj => obj.id === bat.id));
    if (batListIndex > -1) {
        batList.splice(batListIndex,1);
    }
};

function getAllDeployCosts(unit,ammoNames) {
    let totalCosts = {};
    let deployCosts = {};
    let batAmmo;
    // Ammo W1
    let hasW1 = checkHasWeapon(1,unit,ammoNames[3]);
    if (ammoNames[0] != 'xxx' && hasW1) {
        batAmmo = getAmmoByName(ammoNames[0]);
        deployCosts = getDeployCosts(unit,batAmmo,1,'ammo');
        mergeObjects(totalCosts,deployCosts);
    }
    // Ammo W2
    let hasW2 = checkHasWeapon(2,unit,ammoNames[3]);
    if (ammoNames[1] != 'xxx' && hasW2) {
        batAmmo = getAmmoByName(ammoNames[1]);
        deployCosts = getDeployCosts(unit,batAmmo,2,'ammo');
        mergeObjects(totalCosts,deployCosts);
    }
    // Armor
    if (ammoNames[2] != 'xxx') {
        let batArmor = getEquipByName(ammoNames[2]);
        deployCosts = getDeployCosts(unit,batArmor,0,'equip');
        mergeObjects(totalCosts,deployCosts);
    }
    // Equip
    if (ammoNames[3] != 'xxx') {
        let batEquip = getEquipByName(ammoNames[3]);
        deployCosts = getDeployCosts(unit,batEquip,0,'equip');
        mergeObjects(totalCosts,deployCosts);
    }
    // Unit
    deployCosts = getDeployCosts(unit,batAmmo,0,'unit');
    mergeObjects(totalCosts,deployCosts);
    return totalCosts;
};

function showCostsDetail(deployCosts,bat) {
    if (deployCosts != undefined) {
        Object.entries(deployCosts).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let dispoRes = getDispoRes(key);
            if (dispoRes >= value) {
                $('#be'+bat.id).append('<span class="listRes gff">'+key+': <span class="brunf">'+value+'</span>/'+dispoRes+'</span>');
            } else {
                $('#be'+bat.id).append('<span class="listRes gff">'+key+': <span class="brunf">'+value+'</span>/<span class="rouge">'+dispoRes+'</span></span>');
            }
        });
    }
};
