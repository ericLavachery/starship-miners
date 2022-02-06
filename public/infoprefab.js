function defabInfos(bat,batType) {
    console.log('prefabInfos');
    let prefabId = checkPrefabId(bat,batType);
    if (prefabId >= 0) {
        let landerBat = findTheLander();
        let prefabBat = getBatById(prefabId);
        let prefabBatType = getBatType(prefabBat);
        let prefabBatName = prefabBat.type;
        let isLoaded = checkCharged(prefabBat,'load');
        let isCharged = checkCharged(prefabBat,'trans');
        if (batType.skills.includes('constructeur') && Object.keys(landerBat).length >= 1) {
            let apCost = prefabCost(batType,prefabBatType,false);
            let depliOK = true;
            if (selectedBatType.cat === 'infantry') {
                if (prefabBatType.fabTime >= 35 && !prefabBatType.skills.includes('clicput')) {
                    depliOK = false;
                }
            }
            let damageOK = true;
            if (prefabBat.squadsLeft*1.4 < prefabBatType.squads) {
                damageOK = false;
            }
            if (depliOK && !isLoaded && !isCharged && damageOK) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Déconstruire '+prefabBatName+'" class="boutonGris skillButtons" onclick="deconstruction('+prefabId+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Déconstruction</h4></span>');
            } else {
                let koMessage = "Une infanterie ne peut pas déconstruire ce bâtiment";
                if (!damageOK) {
                    koMessage = "Ce bâtiment est trop endommagé pour être déconstruit";
                } else if (isCharged) {
                    koMessage = "Vous ne pouvez pas déconstruire un bâtiment si il y a un bataillon dedans";
                } else if (isLoaded) {
                    koMessage = "Vous ne pouvez pas déconstruire un bâtiment si il y a un autre bâtiment dedans";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+koMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Déconstruction</h4></span>');
            }
        }
    }
};

function checkPrefabId(myBat,myBatType) {
    // vérifie si le bâtiment (en dessous de l'unité) est préfab, et retourne son Id
    let prefabId = -1;
    let batType;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.tileId == myBat.tileId) {
            batType = getBatType(bat);
            if (batType.skills.includes('prefab')) {
                prefabId = bat.id;
            }
        }
    });
    return prefabId;
};

function deconstruction(prefabId) {
    let prefabIndex = bataillons.findIndex((obj => obj.id == prefabId));
    let prefabBat = bataillons[prefabIndex];
    let prefabBatType = getBatType(prefabBat);
    let tileId = prefabBat.tileId;
    let landerBat = findTheLander();
    if (Object.keys(landerBat).length >= 1) {
        if (!playerInfos.onShip) {
            let apCost = prefabCost(selectedBatType,prefabBatType,false);
            selectedBat.apLeft = selectedBat.apLeft-apCost;
            if (prefabBatType.cat === 'buildings') {
                prefabBat.apLeft = 0-Math.round(prefabBat.ap*2)-2;
            } else {
                prefabBat.apLeft = 0-Math.round(prefabBat.ap/2);
            }
        }
        loadBat(prefabBat.id,landerBat.id);
        // tagDelete(prefabBat,'mining');
        // prefabBat.extracted = [];
        recupPrefabFret(prefabBat,prefabBatType,tileId,false,-1);
        tagDelete(selectedBat,'guet');
        selectedBatArrayUpdate();
        showBatInfos(selectedBat);
        selectMode();
    }
};

function autoDeconstruction(prefabId) {
    let prefabIndex = bataillons.findIndex((obj => obj.id == prefabId));
    let prefabBat = bataillons[prefabIndex];
    let prefabBatType = getBatType(prefabBat);
    let tileId = prefabBat.tileId;
    let landerBat = findTheLander();
    if (Object.keys(landerBat).length >= 1) {
        if (!playerInfos.onShip) {
            if (prefabBatType.cat === 'buildings') {
                prefabBat.apLeft = 0-Math.round(prefabBat.ap*2)-2;
            } else {
                prefabBat.apLeft = 0-Math.round(prefabBat.ap/2);
            }
        }
        loadBat(prefabBat.id,landerBat.id);
        // tagDelete(prefabBat,'mining');
        // prefabBat.extracted = [];
        recupPrefabFret(prefabBat,prefabBatType,tileId,true,landerBat);
        showMap(zone,false);
        batSelect(landerBat);
        showBatInfos(landerBat);
        selectMode();
    }
};

function recupPrefabFret(bat,batType,tileId,autoDec,landerBat) {
    let resFret = checkResLoad(bat);
    if (resFret >= 1) {
        let coffre = {};
        if (autoDec) {
            let resSpace = checkResSpace(landerBat);
            if (resSpace >= resFret) {
                coffre = getBatById(landerBat.id);
            } else {
                coffreTileId = -1;
                conselTriche = true;
                putBatAround(tileId,false,'inPlace',239,0);
                coffre = getBatByTileId(coffreTileId);
            }
        } else {
            coffreTileId = -1;
            conselTriche = true;
            putBatAround(tileId,false,'near',239,0);
            coffre = getBatByTileId(coffreTileId);
        }
        putFretInChest(bat,batType,coffre);
        bat.transRes = {};
        coffreTileId = -1;
    }
};

function refabInfos(myBat,myBatUnitType) {
    if (myBatUnitType.skills.includes('constructeur')) {
        let balise = 'h4';
        let apCost;
        let landerBat = findTheLander();
        let sortedBats = bataillons.slice();
        sortedBats = _.sortBy(_.sortBy(_.sortBy(sortedBats,'id'),'type'),'army');
        sortedBats.reverse();
        sortedBats.forEach(function(bat) {
            if (bat.loc === "trans" && bat.locId == landerBat.id) {
                batType = getBatType(bat);
                let depliOK = true;
                if (myBatUnitType.cat === 'infantry') {
                    if (batType.fabTime >= 35 && !batType.skills.includes('clicput')) {
                        depliOK = false;
                    }
                }
                if (bat.apLeft <= 0) {
                    depliOK = false;
                }
                if (batType.skills.includes('prefab') && depliOK) {
                    apCost = prefabCost(myBatUnitType,batType,false);
                    if (myBat.apLeft >= 4 || myBat.apLeft >= apCost) {
                        balise = 'h4';
                        if (Object.keys(batDebarq).length >= 1) {
                            if (batDebarq.id === bat.id) {
                                balise = 'h1';
                            }
                        }
                        let mayOut = checkMayOut(batType,true,bat);
                        if (mayOut) {
                            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Reconstruire '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+') ('+bat.eq+'/'+batType.logeq+')" class="boutonGris skillButtons" onclick="reconstruction('+bat.id+','+apCost+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+'</'+balise+'></span>');
                        } else {
                            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Vous ne pouvez pas débarquer ce bataillon sur cette planète" class="boutonGris skillButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+'</h4></span>');
                        }
                    } else {
                        skillMessage = "PA épuisés";
                        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+'</h4></span>');
                    }
                }
            }
        });
    }
};

function reconstruction(debId,apCost) {
    let debBat = getBatById(debId);
    selectMode();
    batDebarq = debBat;
    cursorSwitch('.','grid-item','thor');
    tagDelete(selectedBat,'guet');
    showBatInfos(selectedBat);
};

function prefabCost(pusherType,prefabType,construct) {
    let apCost = Math.round(pusherType.mecanoCost*prefabType.fabTime/15);
    if (apCost >= 60) {
        apCost = 60;
    }
    if (construct) {
        apCost = Math.round(apCost*1.5);
    }
    return apCost;
};

function calcPrefabWeight(batType) {
    let prefabWeight = 0;
    if (batType.skills.includes('prefab')) {
        prefabWeight = Math.round(batType.squads*batType.squadSize*batType.hp/4);
    }
    return prefabWeight;
};
