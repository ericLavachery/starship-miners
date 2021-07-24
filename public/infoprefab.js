function defabInfos(bat,batType) {
    console.log('prefabInfos');
    let isLoaded = checkCharged(bat,'load');
    let isCharged = checkCharged(bat,'trans');
    let prefabId = checkPrefabId(bat,batType);
    let landerBat = findTheLander();
    console.log(landerBat);
    if (prefabId >= 0 && !isLoaded && !isCharged && batType.skills.includes('constructeur') && Object.keys(landerBat).length >= 1) {
        let prefabIndex = bataillons.findIndex((obj => obj.id == prefabId));
        let prefabBat = bataillons[prefabIndex];
        let prefabBatType = getBatType(prefabBat);
        let prefabBatName = bataillons[prefabIndex].type;
        let apCost = Math.round(batType.mecanoCost*prefabBatType.fabTime/15);
        let depliOK = true;
        if (selectedBatType.cat === 'infantry') {
            if (prefabBatType.fabTime >= 35 && !prefabBatType.skills.includes('clicput')) {
                depliOK = false;
            }
        }
        if (depliOK) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Déconstruire '+prefabBatName+'" class="boutonGris skillButtons" onclick="deconstruction('+prefabId+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Déconstruction</h4></span>');
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
            selectedBat.apLeft = selectedBat.apLeft-Math.round(selectedBatType.mecanoCost*prefabBatType.fabTime/15);
        }
        loadBat(prefabBat.id,landerBat.id);
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
        loadBat(prefabBat.id,landerBat.id);
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
        let apCost = Math.ceil(myBatUnitType.mecanoCost*2.5);
        let landerBat = findTheLander();
        bataillons.forEach(function(bat) {
            if (bat.loc === "trans" && bat.locId == landerBat.id) {
                batType = getBatType(bat);
                let depliOK = true;
                if (myBatUnitType.cat === 'infantry') {
                    if (batType.fabTime >= 35 && !batType.skills.includes('clicput')) {
                        depliOK = false;
                    }
                }
                if (batType.skills.includes('prefab') && depliOK) {
                    if (myBat.apLeft >= 4) {
                        balise = 'h4';
                        if (Object.keys(batDebarq).length >= 1) {
                            if (batDebarq.id === bat.id) {
                                balise = 'h1';
                            }
                        }
                        let mayOut = checkMayOut(batType);
                        if (mayOut) {
                            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Reconstruire '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+')" class="boutonGris skillButtons" onclick="reconstruction('+bat.id+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+'</'+balise+'></span>');
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

function reconstruction(debId) {
    let debBat = getBatById(debId);
    selectMode();
    batDebarq = debBat;
    cursorSwitch('.','grid-item','thor');
    tagDelete(selectedBat,'guet');
    showBatInfos(selectedBat);
};

function calcPrefabWeight(batType) {
    let prefabWeight = 0;
    if (batType.skills.includes('prefab')) {
        prefabWeight = Math.round(batType.squads*batType.squadSize*batType.hp/4);
    }
    return prefabWeight;
};
