function defabInfos(bat,batType) {
    console.log('prefabInfos');
    let prefabId = checkPrefabId(bat,batType);
    if (prefabId >= 0) {
        let landerBat = findTheLander(true);
        let prefabBat = getBatById(prefabId);
        let prefabBatType = getBatType(prefabBat);
        let prefabBatName = prefabBat.type;
        let isLoaded = checkCharged(prefabBat,'load');
        let isCharged = checkCharged(prefabBat,'trans');
        let haveLander = false;
        if (Object.keys(landerBat).length >= 1) {
            haveLander = true;
        }
        if (batType.skills.includes('constructeur') && !bat.tags.includes('nomove') && !bat.tags.includes('noprefab')) {
            decButHere = true;
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
            let apOK = true;
            if (prefabBat.apLeft < 0) {
                apOK = false;
            }
            if (depliOK && !isLoaded && !isCharged && damageOK && apOK && haveLander) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Déconstruire '+prefabBatName+'" class="boutonGris iconButtons" onclick="deconstruction('+prefabId+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Déconstruction</h4></span>');
            } else {
                let koMessage = "Vous ne pouvez pas déconstruire ce bâtiment";
                if (!haveLander) {
                    koMessage = "Vous ne pouvez pas déconstruire de bâtiments si vous n'avez pas de lander";
                } else if (!damageOK) {
                    koMessage = "Ce bâtiment est trop endommagé pour être déconstruit";
                } else if (!apOK) {
                    koMessage = "Vous ne pouvez pas déconstruire un bâtiment qui est en PA négatifs";
                } else if (isCharged) {
                    koMessage = "Vous ne pouvez pas déconstruire un bâtiment si il y a un bataillon dedans";
                } else if (isLoaded) {
                    koMessage = "Vous ne pouvez pas déconstruire un bâtiment si il y a un autre bâtiment dedans";
                } else if (!depliOK) {
                    koMessage = "Une infanterie ne peut pas déconstruire ce bâtiment";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+koMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Déconstruction</h4></span>');
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
    let landerBat = findTheLander(true);
    if (!prefabBat.tags.includes('noprefab')) {
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
            showMap(zone,true);
            selectMode();
        }
    }
};

function autoDeconstruction(prefabId) {
    let prefabIndex = bataillons.findIndex((obj => obj.id == prefabId));
    let prefabBat = bataillons[prefabIndex];
    let prefabBatType = getBatType(prefabBat);
    let tileId = prefabBat.tileId;
    let landerBat = findTheLander(false);
    if (!prefabBat.tags.includes('noprefab')) {
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
                coffre = getZoneBatByTileId(coffreTileId);
            }
        } else {
            coffreTileId = -1;
            conselTriche = true;
            putBatAround(tileId,false,'near',239,0);
            coffre = getZoneBatByTileId(coffreTileId);
        }
        putFretInChest(bat,batType,coffre);
        bat.transRes = {};
        coffreTileId = -1;
    }
};

function refabInfos(myBat,myBatUnitType) {
    // pas les outsiders? xxxxxx ??????
    let fromLander = false;
    if (myBatUnitType.skills.includes('transorbital')) {
        fromLander = true;
    }
    if (myBatUnitType.skills.includes('constructeur') && !myBat.tags.includes('nomove') && !myBat.tags.includes('nopilots')) {
        $('#unitInfos').append('<hr>');
        let balise = 'h4';
        let apCost;
        let landerBat = findTheLander(true);
        let sortedBats = bataillons.slice();
        sortedBats = _.sortBy(_.sortBy(_.sortBy(sortedBats,'id'),'type'),'army');
        sortedBats.reverse();
        sortedBats.forEach(function(bat) {
            if (bat.loc === "trans") {
                batType = getBatType(bat);
                if (batType.skills.includes('prefab')) {
                    let depliOK = true;
                    if (myBatUnitType.cat === 'infantry') {
                        if (batType.fabTime >= 35 && !batType.skills.includes('clicput')) {
                            depliOK = false;
                        }
                    }
                    if (bat.apLeft <= 0) {
                        depliOK = false;
                    }
                    if (batType.skills.includes('landerfab') && !fromLander) {
                        depliOK = false;
                    }
                    if (depliOK) {
                        apCost = prefabCost(myBatUnitType,batType,false);
                        if (myBat.apLeft >= 4 || myBat.apLeft >= apCost) {
                            balise = 'h4';
                            if (Object.keys(batDebarq).length >= 1) {
                                if (batDebarq.id === bat.id) {
                                    balise = 'h1';
                                }
                            }
                            let mayOut = checkMayOut(batType,true,bat);
                            if (!mayOut) {
                                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Vous ne pouvez pas débarquer ce bataillon sur cette planète" class="boutonGrey iconButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+'</h4></span>');
                            } else if (!playerInfos.onShip && playerInfos.mapTurn < 1) {
                                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Vous ne pouvez pas débarquer avant le tour 1" class="boutonGrey iconButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+'</h4></span>');
                            } else {
                                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Reconstruire '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+') ('+bat.eq+'/'+batType.logeq+')" class="boutonGris iconButtons" onclick="reconstruction('+bat.id+','+apCost+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+'</'+balise+'></span>');
                            }
                        } else {
                            skillMessage = "PA épuisés";
                            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batType.name+'</h4></span>');
                        }
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
        prefabWeight = Math.round(batType.squads*batType.squadSize*batType.hp/4*batType.armor/8);
        if (batType.skills.includes('phat')) {
            prefabWeight = Math.round(prefabWeight*2);
        }
    }
    return prefabWeight;
};
