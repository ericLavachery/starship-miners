function goSoute() {
    inSoute = true;
    $("#zone_map").css("display","none");
    $("#zone_soute").css("display","block");
    souteList();
    landerList(2);
    showBatInfos(selectedBat);
};

function souteList() {
    $('#units_soute').empty();
    let landersIds = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital') && batType.name != 'Soute') {
                landersIds.push(bat.id);
            }
        }
    });
    batCatList('infantry',playerInfos.gang,'',landersIds,-1);
    batCatList('infantry','zero-','',landersIds,-1);
    batCatList('vehicles',playerInfos.gang,'',landersIds,-1);
    batCatList('vehicles','zero-','',landersIds,-1);
    batCatList('devices','','prefab',landersIds,-1);
    batCatList('buildings','','prefab',landersIds,-1);
};

function landerList(idOfLander) {
    $('#units_lander').empty();
    let landersIds = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === 'zone') {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital') && batType.name != 'Soute') {
                landersIds.push(bat.id);
            }
        }
    });
    batCatList('infantry',playerInfos.gang,'',landersIds,idOfLander);
    batCatList('infantry','zero-','',landersIds,idOfLander);
    batCatList('vehicles',playerInfos.gang,'',landersIds,idOfLander);
    batCatList('vehicles','zero-','',landersIds,idOfLander);
    batCatList('devices','','prefab',landersIds,idOfLander);
    batCatList('buildings','','prefab',landersIds,idOfLander);
};

function batCatList(cat,partKind,skill,landersIds,idOfLander) {
    let showMe = true;
    let colId = 'units_soute';
    if (idOfLander >= 0) {
        colId = 'units_lander';
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
        if (batType.skills.includes('transorbital')) {
            showMe = false;
        }
        if (showMe) {
            if (batType.cat.includes(cat) && batType.kind.includes(partKind)) {
                if (skill === '' || batType.skills.includes(skill)) {
                    if (bat.loc === 'zone' && idOfLander < 0) {
                        bat.loc = 'trans';
                        bat.locId = souteId;
                    }
                    batListElement(bat,batType,idOfLander);
                }
            }
        }
    });
};

function batListElement(bat,batType,idOfLander) {
    let colId = 'units_soute';
    if (idOfLander >= 0) {
        colId = 'units_lander';
    }
    let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq]);
    let enoughRes = checkCost(deployCosts);
    if (!enoughRes) {
        if (bat.id === selectedBat.id) {
            blockType = 'souteBlockCheck';
        } else {
            blockType = 'souteBlockNope';
        }
    } else {
        if (bat.id === selectedBat.id) {
            blockType = 'souteBlockCheck';
        } else {
            blockType = 'souteBlock';
        }
    }
    $('#'+colId).append('<div class="'+blockType+' klik" onclick="batSouteSelect('+bat.id+')"><table><tr><td><img src="/static/img/units/'+batType.cat+'/'+batType.pic+'.png" width="48"></td><td id="be'+bat.id+'"></td></tr></table></div>');
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
        bat.locId = 2;
    } else {
        console.log('not enough res');
    }
    // showBatInfos(bat);
    goSoute();
};

function batUndeploy(batId) {
    let bat = getBatById(batId);
    let batType = getBatType(bat);
    let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq]);
    addCost(deployCosts,1);
    bat.locId = souteId;
    // showBatInfos(bat);
    goSoute();
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
