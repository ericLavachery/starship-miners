function defabInfos(bat,batType) {
    console.log('prefabInfos');
    let isLoaded = checkCharged(bat,'load');
    let prefabId = checkPrefabId(bat,batType);
    let landerBat = findTheLander();
    console.log(landerBat);
    if (prefabId >= 0 && !isLoaded && batType.skills.includes('constructeur') && Object.keys(landerBat).length >= 1) {
        let prefabIndex = bataillons.findIndex((obj => obj.id == prefabId));
        let prefabBat = bataillons[prefabIndex];
        let prefabBatType = getBatType(prefabBat);
        let prefabBatName = bataillons[prefabIndex].type;
        let apCost = Math.round(batType.mecanoCost*prefabBatType.fabTime/30);
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Déconstruire '+prefabBatName+'" class="boutonGris skillButtons" onclick="deconstruction('+prefabId+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Déconstruction</h4></span>');
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
    let landerBat = findTheLander();
    if (Object.keys(landerBat).length >= 1) {
        if (!playerInfos.onShip) {
            selectedBat.apLeft = selectedBat.apLeft-Math.round(selectedBatType.mecanoCost*prefabBatType.fabTime/30);
        }
        loadBat(prefabBat.id,landerBat.id);
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
    let landerBat = findTheLander();
    if (Object.keys(landerBat).length >= 1) {
        loadBat(prefabBat.id,landerBat.id);
        showMap(zone,false);
        batSelect(landerBat);
        showBatInfos(landerBat);
        selectMode();
    }
};

function refabInfos(myBat,myBatUnitType) {
    if (myBatUnitType.skills.includes('constructeur') && myBatUnitType.cat != 'infantry') {
        let balise = 'h4';
        let apCost = myBatUnitType.mecanoCost*3;
        let landerBat = findTheLander();
        bataillons.forEach(function(bat) {
            if (bat.loc === "trans" && bat.locId == landerBat.id) {
                batType = getBatType(bat);
                if (batType.skills.includes('prefab')) {
                    if (myBat.apLeft >= Math.round(myBat.ap/3)) {
                        balise = 'h4';
                        if (Object.keys(batDebarq).length >= 1) {
                            if (batDebarq.id === bat.id) {
                                balise = 'h1';
                            }
                        }
                        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Reconstruire '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+')" class="boutonGris skillButtons" onclick="reconstruction('+bat.id+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+'</'+balise+'></span>');
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
    let debIndex = bataillons.findIndex((obj => obj.id == debId));
    let debBat = bataillons[debIndex];
    selectMode();
    batDebarq = debBat;
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
