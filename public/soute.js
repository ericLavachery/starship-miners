function goSoute() {
    inSoute = true;
    playRoom('soute',true);
    playFx('work',false);
    $("#zone_map").css("display","none");
    $("#zone_soute").css("display","block");
    checkSelectedLanderId();
    checkReserve();
    souteMenu();
    landerMenu();
    if (souteTab === 'unitz') {
        souteList();
        landerList();
        if (Object.keys(selectedBat).length >= 1) {
            showBatInfos(selectedBat);
        }
    } else if (souteTab === 'rez') {
        missionRes();
        viewLanderRes();
        voirReserve();
    }
    commandes();
    console.log('slId='+slId);
};

function goStation() {
    inSoute = false;
    playRoom('station',true);
    playFx('work',true);
    $("#zone_map").css("display","grid");
    $("#zone_soute").css("display","none");
    showMap(zone,true);
    let souteBat = getBatById(souteId);
    batSelect(souteBat);
    showBatInfos(selectedBat);
    commandes();
};

function getStationLandersIds() {
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

function souteTabsMenu(here) {
    if (souteTab === 'unitz') {
        $('#'+here).append('<h2 class="bcy">Bataillons &nbsp</h2>');
        $('#'+here).append('<h2 class="neutre klik" onclick="setSouteTab(`rez`)">Ressources</h2>');
    } else if (souteTab === 'rez') {
        $('#'+here).append('<h2 class="neutre klik" onclick="setSouteTab(`unitz`)">Bataillons &nbsp</h2>');
        $('#'+here).append('<h2 class="bcy">Ressources</h2>');
    }
    $('#'+here).append('<br>');
};

function souteMenu() {
    $('#menu_soute').empty();
    souteTabsMenu('menu_soute');
    if (souteTab === 'unitz') {
        if (souteFilter === 'all') {
            $('#menu_soute').append('<span class="menuTab cy">Tous &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`all`)">Tous &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'infantry') {
            $('#menu_soute').append('<span class="menuTab cy">Infanteries &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`infantry`)">Infanteries &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'support') {
            $('#menu_soute').append('<span class="menuTab cy">Support &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`support`)">Support &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'cyberobots') {
            $('#menu_soute').append('<span class="menuTab cy">Cyber & Robots &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`cyberobots`)">Cyber & Robots &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'vehicles') {
            $('#menu_soute').append('<span class="menuTab cy">Véhicules &nbsp;&nbsp;</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`vehicles`)">Véhicules &nbsp;&nbsp;</span>');
        }
        if (souteFilter === 'prefabs') {
            $('#menu_soute').append('<span class="menuTab cy">Préfabriqués</span>');
        } else {
            $('#menu_soute').append('<span class="menuTab klik" onclick="setSouteFilter(`prefabs`)">Préfabriqués</span>');
        }
    }
};

function setSouteFilter(filter) {
    souteFilter = filter;
    goSoute();
};

function setSouteTab(tab) {
    souteTab = tab;
    goSoute();
};

function landerMenu() {
    $('#menu_lander').empty();
    souteTabsMenu('menu_lander');
    let landersIds = getStationLandersIds();
    landersIds.forEach(function(landerId) {
        let landerBat = getBatById(landerId);
        let landerBatType = getBatType(landerBat);
        let transUnitLeft = calcTransUnitsLeft(landerBat,landerBatType);
        let transResLeft = checkResSpace(landerBat);
        let transResMax = landerBatType.transRes;
        if (landerBat.eq === 'megafret') {
            transResMax = Math.round(transResMax*1.2);
        }
        let ucol = 'cy';
        let rcol = 'brunf';
        if (souteTab === 'rez') {
            ucol = 'brunf';
            rcol = 'cy';
        }
        if (landerId === slId) {
            $('#menu_lander').append('<span class="menuTab cy klik" onclick="landerSelection('+landerId+')">'+landerBatType.name+' <span class="brunf">(<span class="'+ucol+'">'+transUnitLeft+'</span>&ndash;<span class="'+rcol+'">'+transResLeft+'</span>)</span></span>');
        } else {
            $('#menu_lander').append('<span class="menuTab klik" onclick="landerSelection('+landerId+')">'+landerBatType.name+' <span class="brunf">('+transUnitLeft+'&ndash;'+transResLeft+')</span></span>');
        }
        if (landerBat.chief != undefined) {
            if (landerBat.chief != '') {
                if (landerId === slId) {
                    $('#menu_lander').append('<span class="menuTab cyf">('+landerBat.chief+') &nbsp;&nbsp;</span>');
                } else {
                    $('#menu_lander').append('<span class="menuTab gf">('+landerBat.chief+') &nbsp;&nbsp;</span>');
                }
            } else {
                $('#menu_lander').append('<span class="menuTab gf"> &nbsp;&nbsp;</span>');
            }
        } else {
            $('#menu_lander').append('<span class="menuTab gf"> &nbsp;&nbsp;</span>');
        }
    });
};

function landerSelection(landerId) {
    slId = landerId;
    let landerBat = getBatById(slId);
    batSelect(landerBat);
    showBatInfos(selectedBat);
    goSoute();
};

function checkSelectedLanderId() {
    let altId = -1;
    let idOK = false;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('transorbital') && batType.name != 'Soute') {
            if (slId === bat.id) {
                idOK = true;
            } else {
                altId = bat.id;
            }
        }
    });
    if (!idOK) {
        slId = altId;
    }
};

function souteList() {
    $('#list_soute').empty();
    let landersIds = getStationLandersIds();
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
    let landerBat = getBatById(slId);
    if (!landerBat.tags.includes('deploy')) {
        $('#list_lander').append('<br><span class="listRes or">&nbsp Ce vaisseau n\'est pas déployé</span>');
    }
    let landersIds = getStationLandersIds();
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
    sortedBats = _.sortBy(_.sortBy(_.sortBy(sortedBats,'id'),'army'),'type');
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
    let deployInfo = checkPlaceLander(bat,batType,slId);
    if (!enoughRes || !deployInfo[0] || !deployInfo[1] || !deployInfo[2]) {
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
    let batPic = getBatPic(bat,batType);
    $('#'+colId).append('<div class="'+blockType+'" onclick="batSouteSelect('+selId+')"><table><tr><td><img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="48"></td><td id="be'+bat.id+'"></td></tr></table></div>');
    $('#be'+bat.id).append('<span class="listRes klik">'+batType.name+'</span>');
    let batVolume = calcVolume(bat,batType);
    if (bat.chief != undefined) {
        if (bat.chief != '') {
            $('#be'+bat.id).append('<span class="listRes vert">('+bat.chief+')</span>');
        }
    }
    $('#be'+bat.id).append('<span class="listRes gff" title="Volume">('+batVolume+')</span>');
    let bxp = Math.round(bat.xp);
    let vetIcon = '';
    let army = '';
    if (bat.vet >= 1) {
        vetIcon = '<img src="/static/img/vet'+bat.vet+'.png" width="15">';
    } else if (bat.army >= 1) {
        army = ' ';
    }
    if (bat.army >= 1) {
        army = army+'a<span class="rose" title="Armée">'+bat.army+'</span>';
    }
    $('#be'+bat.id).append('<span class="listRes gff" title="XP">('+bxp+vetIcon+army+')</span>');
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
        bat.apLeft = bat.ap;
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

function calcLanderDeploy(landerBatType) {
    let deployCosts = landerBatType.deploy;
    // bataillons.forEach(function(bat) {
    //     if (bat.loc === 'zone') {
    //         let batType = getBatType(bat);
    //         if (batType.skills.includes('transorbital') && batType.name != 'Soute' && bat.tags.includes('deploy')) {
    //
    //         }
    //     }
    // });
    return deployCosts;
}

function landerDeploy(landerId) {
    let landerBat = getBatById(landerId);
    let landerBatType = getBatType(landerBat);
    let deployCosts = calcLanderDeploy(landerBatType);
    let enoughRes = checkCost(deployCosts);
    if (enoughRes) {
        payCost(deployCosts);
        landerBat.apLeft = landerBat.ap;
        landerBat.tags.push('deploy');
    } else {
        console.log('not enough res');
    }
    showBatInfos(landerBat);
    commandes();
    if (inSoute) {
        goSoute();
    }
};

function landerUnDeploy(landerId) {
    let landerBat = getBatById(landerId);
    let landerBatType = getBatType(landerBat);
    let deployCosts = calcLanderDeploy(landerBatType);
    addCost(deployCosts,1);
    tagDelete(landerBat,'deploy');
    showBatInfos(landerBat);
    commandes();
    if (inSoute) {
        goSoute();
    }
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

function checkPlaceLander(myBat,myBatType,landerId) {
    let deployInfo = [false,false,false];
    let myLander = getBatById(landerId);
    let myLanderType = getBatType(myLander);
    if (myLander.tags.includes('deploy')) {
        deployInfo[0] = true;
    }
    if (myLanderType.transMaxSize >= myBatType.size || myBatType.skills.includes('prefab')) {
        deployInfo[1] = true;
    }
    let batVolume = calcVolume(myBat,myBatType);
    let placeLeft = calcTransUnitsLeft(myLander,myLanderType);
    if (placeLeft+25 >= batVolume) {
        deployInfo[2] = true;
    }
    return deployInfo;
};

function viewLanderRes() {
    $('#list_lander').empty();
    $('#list_lander').append('<div class="souteBlock" id="lresList"></div>');
    let landerBat = getBatById(slId);
    let landerBatType = getBatType(landerBat);
    let transResLeft = checkResSpace(landerBat);
    let transResIn = checkResLoad(landerBat);
    let transResMax = landerBatType.transRes;
    if (landerBat.eq === 'megafret') {
        transResMax = Math.round(transResMax*1.2);
    }
    let numCit = getLanderNumCit(slId,126);
    let numCrim = getLanderNumCit(slId,225);
    $('#lresList').append('<br>');
    $('#lresList').append('<span class="paramName">Maximum Fret</span><span class="paramIcon"></span><span class="paramValue">'+transResMax+'</span><br>');
    $('#lresList').append('<span class="paramName">Charge</span><span class="paramIcon"></span><span class="paramValue">'+transResIn+'</span><br>');
    $('#lresList').append('<span class="paramName">Reste</span><span class="paramIcon"></span><span class="paramValue">'+transResLeft+'</span><br>');
    $('#lresList').append('<span class="paramName">Ressources</span><span class="paramIcon cy"><i class="far fa-gem"></i></span><span class="paramValue cy klik" title="Remettre toutes les ressources dans la soute" onclick="emptyLanderRes()">Vider</span><br>');
    $('#lresList').append('<br>');
    $('#lresList').append('<span class="paramName">Citoyens</span><span class="paramIcon"></span><span class="paramValue">'+numCit+'</span><br>');
    $('#lresList').append('<span class="paramName">Criminels</span><span class="paramIcon"></span><span class="paramValue">'+numCrim+'</span><br>');
    $('#lresList').append('<span class="paramName">Citoyens & Criminels</span><span class="paramIcon cy"><i class="far fa-user"></i></span><span class="paramValue cy klik" title="Remettre tous les citoyens dans la soute" onclick="emptyLanderCit()">Vider</span><br>');
    $('#lresList').append('<br>');
};

function getLanderNumCit(landerId,citId) {
    let numCit = 0;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && bat.locId === landerId && bat.typeId === citId) {
            numCit = numCit+bat.citoyens;
        }
    });
    return numCit;
};

function emptyLanderCit() {
    bataillons.forEach(function(bat) {
        if (bat.typeId === 126 || bat.typeId === 225) {
            if (bat.loc === 'trans' && bat.locId === slId) {
                loadBat(bat.id,souteId,slId);
            }
        }
    });
    prepaBld = {};
    goSoute();
};

function emptyLanderRes() {
    let landerBat = getBatById(slId);
    moveResCost(landerBat.transRes,slId,souteId,1);
    prepaBld = {};
    goSoute();
};

function missionRes() {
    $('#list_soute').empty();
    $('#list_soute').append('<div class="souteBlock" id="fillList"></div>');
    findLanders();
    let lastKind = '';
    let showkind = '';
    let showPrep = '';
    let bldNeed = [];
    let prodOK = true;
    let colour = '';
    let costsOK = false;
    let combinedCosts = {};
    // CITOYENS
    $('#fillList').append('<br><span class="constName or">CITOYENS</span><br>');
    let numCit = getLanderNumCit(souteId,126);
    if (numCit < 6) {
        $('#fillList').append('<span class="constName gff">&cross; 6 Citoyens</span><br>');
    } else {
        $('#fillList').append('<span class="constName klik cyf" onclick="missionCit(126)">&check; 6 Citoyens</span><br>');
    }
    let numCrim = getLanderNumCit(souteId,225);
    if (numCrim < 6) {
        $('#fillList').append('<span class="constName gff">&cross; 6 Criminels</span><br>');
    } else {
        $('#fillList').append('<span class="constName klik cyf" onclick="missionCit(225)">&check; 6 Criminels</span><br>');
    }
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
                    $('#fillList').append('<br><span class="constName or" id="kind-'+unit.kind+'">'+showkind.toUpperCase()+'</span><br>');
                }
                if (prepaBld[unit.name] === undefined) {
                    showPrep = '';
                } else {
                    showPrep = '('+prepaBld[unit.name]+')';
                }
                bldNeed = [];
                colour = 'gris';
                if (unit.bldCost != 'none') {
                    bldNeed[0] = unit.bldCost;
                } else {
                    bldNeed = unit.bldReq;
                }


                let costString = '';
                if (unit.costs != undefined) {
                    costString = displayCosts(unit.costs);
                }


                costsOK = checkUnitCost(unit,true);
                if (!costsOK) {
                    $('#fillList').append('<span class="constName gris" title="'+toNiceString(bldNeed)+' '+costString+'">&cross; '+unit.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                } else {
                    $('#fillList').append('<span class="constName klik cy" title="'+toNiceString(bldNeed)+' '+costString+'" onclick="missionResUnit('+unit.id+')">&check; '+unit.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                    if (unit.equip.length >= 2) {
                        unit.equip.forEach(function(equipName) {
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
                                    combinedCosts = {};
                                    let flatCosts = getCosts(unit,equip,0,'equip');
                                    mergeObjects(combinedCosts,flatCosts);
                                    let deployCosts = getDeployCosts(unit,equip,0,'equip');
                                    mergeObjects(combinedCosts,deployCosts);
                                    costsOK = checkCost(combinedCosts);
                                    if (!costsOK) {
                                        $('#fillList').append('<span class="constName gff">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&cross; '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                                    } else {
                                        $('#fillList').append('<span class="constName klik cyf" onclick="missionResEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&check; '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                                    }
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
                                    combinedCosts = {};
                                    let flatCosts = getCosts(unit,equip,0,'equip');
                                    mergeObjects(combinedCosts,flatCosts);
                                    let deployCosts = getDeployCosts(unit,equip,0,'equip');
                                    mergeObjects(combinedCosts,deployCosts);
                                    costsOK = checkCost(combinedCosts);
                                    if (!costsOK) {
                                        $('#fillList').append('<span class="constName gff">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&cross; blindage '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                                    } else {
                                        $('#fillList').append('<span class="constName klik cyf" onclick="missionResEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&check; blindage '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                                    }
                                }
                            }
                        });
                    }
                }
                lastKind = unit.kind;
            }
        }
    });
    // INFRASTRUCTURES
    $('#fillList').append('<br><span class="constName or">INFRASTRUCTURES</span><br>');
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
                costsOK = checkCost(infra.costs);
                if (!costsOK) {
                    $('#fillList').append('<span class="constName gff">&cross; '+infra.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                } else {
                    $('#fillList').append('<span class="constName klik cyf" onclick="missionResInfra(`'+infra.name+'`,false)">&check; '+infra.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                }
            }
        }
    });
    if (prepaBld['Route'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+prepaBld['Route']+')';
    }
    let routeProps = makeInfraProps('Route',true);
    costsOK = checkCost(routeProps.costs);
    if (!costsOK) {
        $('#fillList').append('<span class="constName gff">&cross; Route <span class="ciel">'+showPrep+'</span></span><br>');
    } else {
        $('#fillList').append('<span class="constName klik cyf" onclick="missionResInfra(`Route`,true)">&check; Route <span class="ciel">'+showPrep+'</span></span><br>');
    }
    if (prepaBld['Pont'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+prepaBld['Pont']+')';
    }
    let pontProps = makeInfraProps('Pont',true);
    costsOK = checkCost(pontProps.costs);
    if (!costsOK) {
        $('#fillList').append('<span class="constName gff">&cross; Pont <span class="ciel">'+showPrep+'</span></span><br>');
    } else {
        $('#fillList').append('<span class="constName klik cyf" onclick="missionResInfra(`Pont`,true)">&check; Pont <span class="ciel">'+showPrep+'</span></span><br>');
    }
    // DROGUES
    $('#fillList').append('<br><span class="constName or">DROGUES</span><br>');
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
                    costsOK = checkMultiCost(drug.costs,10);
                    if (!costsOK) {
                        $('#fillList').append('<span class="constName gff">&cross; 10 '+drug.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                    } else {
                        $('#fillList').append('<span class="constName klik cyf" onclick="missionResInfra(`'+drug.name+'`,false)">&check; 10 '+drug.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                    }
                }
            }
        }
    });
    // PACKS DE RESSOURCES
    $('#fillList').append('<br><span class="constName or">PACKS DE RESSOURCES</span><br>');
    armorTypes.forEach(function(pack) {
        if (pack.name.includes('respack-')) {
            if (prepaBld[pack.name] === undefined) {
                showPrep = '';
            } else {
                showPrep = '('+prepaBld[pack.name]+')';
            }
            costsOK = checkCost(pack.costs);
            if (!costsOK) {
                $('#fillList').append('<span class="constName gff">&cross; '+pack.info+' <span class="ciel">'+showPrep+'</span></span><br>');
            } else {
                $('#fillList').append('<span class="constName klik cyf" onclick="missionResInfra(`'+pack.name+'`,false)">&check; '+pack.info+' <span class="ciel">'+showPrep+'</span></span><br>');
            }
        }
    });
    $('#fillList').append('<br>');
};

function makeInfraProps(infraName,road) {
    let infra = {};
    if (road) {
        infra = {};
        infra.name = infraName;
        infra.costs = {};
        if (infra.name === 'Pont') {
            infra.costs['Scrap'] = 50;
            infra.costs['Compo1'] = 150;
            if (playerInfos.comp.const >= 1) {
                infra.costs['Compo1'] = 100;
            }
            infra.costs['Compo2'] = 50;
            if (playerInfos.comp.const >= 2) {
                infra.costs['Compo2'] = 33;
            }
        } else {
            infra.costs['Compo1'] = 20;
            if (playerInfos.comp.const >= 1) {
                infra.costs['Compo1'] = 14;
            }
        }
    } else {
        infra = getInfraByName(infraName);
    }
    return infra;
};

function missionResInfra(infraName,road) {
    let infra = makeInfraProps(infraName,road)
    console.log(infra);
    let number = 1;
    if (infra.cat === 'drogue') {
        number = 10;
    }
    moveResCost(infra.costs,souteId,slId,number);
    if (prepaBld[infra.name] === undefined) {
        prepaBld[infra.name] = number;
    }  else {
        prepaBld[infra.name] = prepaBld[infra.name]+number;
    }
    goSoute();
    console.log(prepaBld);
};

function missionResEquip(equipName,unitId) {
    let equip = getEquipByName(equipName);
    let unit = getBatTypeById(unitId);
    let flatCosts = getCosts(unit,equip,0,'equip');
    let deployCosts = getDeployCosts(unit,equip,0,'equip');
    moveResCost(flatCosts,souteId,slId,1);
    moveResCost(deployCosts,souteId,slId,1);
    let equipCountName = unitId+'-'+equip.name;
    if (prepaBld[equipCountName] === undefined) {
        prepaBld[equipCountName] = 1;
    }  else {
        prepaBld[equipCountName] = prepaBld[equipCountName]+1;
    }
    goSoute();
};

function missionResUnit(unitId) {
    let unit = getBatTypeById(unitId);
    moveResCost(unit.costs,souteId,slId,1);
    moveResCost(unit.deploy,souteId,slId,1);
    let reqCit = unit.squads*unit.squadSize*unit.crew;
    if (unit.skills.includes('clone')) {
        reqCit = 0;
    }
    let citId = 126;
    let dispoCit = getDispoCit();
    if (reqCit >= 1) {
        moveCit(citId,souteId,slId,reqCit);
    }
    if (prepaBld[unit.name] === undefined) {
        prepaBld[unit.name] = 1;
    }  else {
        prepaBld[unit.name] = prepaBld[unit.name]+1;
    }
    goSoute();
};

function missionResSingle(resId,number) {
    let res = getResById(resId);
    let costs = {};
    costs[res.name] = number;
    moveResCost(costs,souteId,slId,1);
    goSoute();
};

function missionCit(citId) {
    moveCit(citId,souteId,slId,6);
    goSoute();
};

function moveCit(citId,fromId,toId,number) {
    let fromBat = getBatById(fromId);
    let toBat = getBatById(toId);
    let citBat = {};
    let citBatId = -1;
    bataillons.forEach(function(bat) {
        if (bat.loc === 'trans' && bat.locId === souteId && bat.typeId === citId) {
            citBatId = bat.id;
            citBat = bat;
        }
    });
    if (citBatId >= 0) {
        citBat.citoyens = citBat.citoyens-number;
        if (citBat.citoyens <= 0) {
            citBat.citoyens = 1;
        }
        let unitIndex = unitTypes.findIndex((obj => obj.id == citId));
        conselUnit = unitTypes[unitIndex];
        conselAmmos = ['xxx','xxx','xxx','xxx'];
        conselTriche = true;
        putBat(toBat.tileId,number,0,'',false);
        let newCitBat = getBatByTypeIdAndTileId(citId,toBat.tileId);
        newCitBat.loc = 'trans';
        newCitBat.locId = toBat.id;
        toBat.transIds.push(newCitBat.id);
    }
};

function moveResCost(costs,fromId,toId,number) {
    let fromBat = getBatById(fromId);
    let toBat = getBatById(toId);
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            let res = getResByName(key);
            if (res.cat != 'alien') {
                if (fromBat.transRes[res.name] === undefined) {
                    fromBat.transRes[res.name] = -1;
                    console.log('tranfert de ressource inexistante !!!!');
                } else {
                    fromBat.transRes[res.name] = fromBat.transRes[res.name]-(value*number);
                }
                if (fromBat.transRes[res.name] <= 0) {
                    delete fromBat.transRes[res.name];
                }
                if (toBat.transRes[res.name] === undefined) {
                    toBat.transRes[res.name] = (value*number);
                } else {
                    toBat.transRes[res.name] = toBat.transRes[res.name]+(value*number);
                }
            }
        });
    }
};
