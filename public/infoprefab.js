function defabInfos(bat,batUnitType) {
    console.log('prefabInfos');
    let isLoaded = checkCharged(bat,'load');
    let prefabId = checkPrefabId(bat,batUnitType);
    if (prefabId >= 0 && !isLoaded && batUnitType.skills.includes('constructeur')) {
        let prefabIndex = bataillons.findIndex((obj => obj.id == prefabId));
        let prefabBat = bataillons[prefabIndex];
        let prefabBatType = getBatType(prefabBat);
        let prefabBatName = bataillons[prefabIndex].type;
        let apCost = Math.round(batUnitType.mecanoCost*prefabBatType.refabTime/10);
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
    selectedBat.apLeft = selectedBat.apLeft-Math.round(selectedBatType.mecanoCost*prefabBatType.refabTime/10);
    selectedBat.tags.push('loaded');
    prefabBat.loc = 'load';
    prefabBat.locId = selectedBat.id;
    let batListIndex = batList.findIndex((obj => obj.id == prefabBat.id));
    if (batListIndex > -1) {
        batList.splice(batListIndex,1);
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    selectMode();
};

function refabInfos(myBat,myBatUnitType) {
    if (myBatUnitType.skills.includes('constructeur')) {
        let balise = 'h4';
        let apCost = myBatUnitType.mecanoCost*4;
        if (myBat.tags.includes('loaded')) {
            bataillons.forEach(function(bat) {
                if (bat.loc === "load" && bat.locId == myBat.id) {
                    batType = getBatType(bat);
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
            });
        }
    }
};

function reconstruction(debId) {
    let debIndex = bataillons.findIndex((obj => obj.id == debId));
    let debBat = bataillons[debIndex];
    selectMode();
    batDebarq = debBat;
    showBatInfos(selectedBat);
};
