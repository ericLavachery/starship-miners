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
        let prefabSizeOK = checkPrefabSize(prefabBat,prefabBatType,landerBat);
        let haveLander = false;
        if (Object.keys(landerBat).length >= 1) {
            haveLander = true;
        }
        if (batType.skills.includes('constructeur') && !bat.tags.includes('nomove')) {
            decButHere = true;
            let apCost = prefabCost(batType,prefabBatType,false);
            let depliOK = true;
            if (selectedBatType.cat === 'infantry') {
                if (prefabBatType.fabTime >= 35 && !prefabBatType.skills.includes('clicput') && !prefabBatType.skills.includes('infconst')) {
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
            if (depliOK && !isLoaded && !isCharged && damageOK && apOK && haveLander && prefabSizeOK && !prefabBat.tags.includes('noprefab')) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Déconstruire '+prefabBatName+'" class="boutonRouge unitButtons" onclick="deconstruction('+prefabId+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Déconstruction</h4></span>');
            } else {
                let koMessage = "Vous ne pouvez pas déconstruire ce bâtiment";
                if (prefabBat.tags.includes('noprefab')) {
                    koMessage = "Ce bâtiment n'est pas préfabriqué (vous ne pouvez pas le déconstruire)";
                } else if (!haveLander) {
                    koMessage = "Vous ne pouvez pas déconstruire de bâtiments si vous n'avez pas de lander";
                } else if (!prefabSizeOK) {
                    koMessage = "Ce bâtiment est trop grand pour le lander";
                } else if (!depliOK) {
                    koMessage = "Une infanterie ne peut pas déconstruire ce bâtiment";
                } else if (!damageOK) {
                    koMessage = "Ce bâtiment est trop endommagé pour être déconstruit";
                } else if (!apOK) {
                    koMessage = "Vous ne pouvez pas déconstruire un bâtiment qui est en PA négatifs";
                } else if (isCharged) {
                    koMessage = "Vous ne pouvez pas déconstruire un bâtiment si il y a un bataillon dedans";
                } else if (isLoaded) {
                    koMessage = "Vous ne pouvez pas déconstruire un bâtiment si il y a un autre bâtiment dedans";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+koMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Déconstruction</h4></span>');
            }
        }
    }
};

function checkPrefabSize(prefabBat,prefabBatType,landerBat) {
    let prefabSizeOK = false;
    let landerBatType = getBatType(landerBat);
    if (prefabBatType.skills.includes('prefab')) {
        if (landerBatType.transMaxSize*4.5 >= prefabBatType.size) {
            prefabSizeOK = true;
        }
    } else {
        prefabSizeOK = true;
    }
    return prefabSizeOK;
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

function getDefabAPCost(prefabBat,prefabBatType) {
    let apCost;
    let theFabTime = prefabBatType.fabTime;
    theFabTime = entre(theFabTime,10,1000);
    if (prefabBatType.cat === 'buildings') {
        apCost = Math.round(prefabBat.ap/2)+Math.round(Math.sqrt(theFabTime)*prefabBat.ap/2.3);
    } else {
        apCost = Math.round(Math.sqrt(theFabTime)*prefabBat.ap/2.3);
    }
    return apCost;
};

function deconstruction(prefabId) {
    let prefabBat = getBatById(prefabId);
    let prefabBatType = getBatType(prefabBat);
    let tileId = prefabBat.tileId;
    let landerBat = findTheLander(true);
    if (!prefabBat.tags.includes('noprefab')) {
        if (Object.keys(landerBat).length >= 1) {
            if (!playerInfos.onShip) {
                let apCost = prefabCost(selectedBatType,prefabBatType,false);
                selectedBat.apLeft = selectedBat.apLeft-apCost;
                let defabCost = getDefabAPCost(prefabBat,prefabBatType);
                prefabBat.apLeft = prefabBat.apLeft-defabCost;
                // prefabBat.apLeft = 0-Math.round(prefabBat.ap/2);
            }
            loadBat(prefabBat.id,landerBat.id);
            constructSound();
            // tagDelete(prefabBat,'mining');
            // prefabBat.extracted = [];
            recupPrefabFret(prefabBat,prefabBatType,tileId,false,-1);
            tagDelete(selectedBat,'guet');
            doneAction(selectedBat);
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
            showMap(zone,true);
            selectMode();
        }
    }
};

function autoDeconstruction(prefabId) {
    let prefabBat = getBatById(prefabId);
    let prefabBatType = getBatType(prefabBat);
    let tileId = prefabBat.tileId;
    let landerBat = findTheLander(false);
    if (!prefabBat.tags.includes('noprefab')) {
        if (Object.keys(landerBat).length >= 1) {
            if (!playerInfos.onShip) {
                let defabCost = getDefabAPCost(prefabBat,prefabBatType);
                prefabBat.apLeft = prefabBat.apLeft-defabCost;
            }
            loadBat(prefabBat.id,landerBat.id);
            playSound('construct-push',-0.1);
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
        // sortedBats.reverse();
        sortedBats.forEach(function(bat) {
            if (bat.loc === "trans") {
                batType = getBatType(bat);
                if (batType.skills.includes('prefab')) {
                    let depliOK = true;
                    if (myBatUnitType.cat === 'infantry') {
                        if (batType.fabTime >= 35 && !batType.skills.includes('clicput') && !batType.skills.includes('infconst')) {
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
                        let batPrintName = getUnitPrintName(batType,false);
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
                                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Vous ne pouvez pas débarquer ce bataillon sur cette planète" class="boutonGrey unitButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batPrintName+'</h4></span>');
                            } else if (!playerInfos.onShip && playerInfos.mapTurn < 1) {
                                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Vous ne pouvez pas débarquer avant le tour 1" class="boutonGrey unitButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batPrintName+'</h4></span>');
                            } else {
                                let theButt = 'boutonGris';
                                if (rand.rand(1,2) === 1) {
                                    theButt = 'boutonGrisBis';
                                }
                                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Reconstruire '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+') ('+bat.eq+'/'+batType.logeq+')" class="'+theButt+' unitButtons" onclick="reconstruction('+bat.id+','+apCost+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batPrintName+'</'+balise+'></span>');
                            }
                        } else {
                            skillMessage = "PA épuisés";
                            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+batPrintName+'</h4></span>');
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

function clicPutCost(pusherType,mineType,isExplo,isGas) {
    let apCost = prefabCost(pusherType,mineType,true);
    if (isExplo) {
        apCost = apCost*5/(playerInfos.comp.explo+4);
        if (pusherType.kind === 'detruas') {
            apCost = apCost/1.7;
        }
        if (pusherType.name === 'Bigman') {
            apCost = apCost*1.25;
        }
    } else if (isGas) {
        apCost = apCost*4/(playerInfos.comp.exo+2);
        if (pusherType.kind === 'detruas') {
            apCost = apCost/1.5;
        }
        if (pusherType.name === 'Bigman') {
            apCost = apCost*1.25;
        }
    } else {
        apCost = apCost*5/(playerInfos.comp.def+4)*5/(playerInfos.comp.train+4);
    }
    apCost = Math.ceil(apCost/1.33);
    return apCost;
};

function prefabCost(pusherType,prefabType,construct) {
    let mecano = 16;
    if (pusherType.mecanoCost < 16) {
        mecano = pusherType.mecanoCost;
    }
    let conSkill = Math.sqrt(pusherType.mecanoCost)*2;
    let apCost = conSkill*prefabType.fabTime/15;
    if (apCost >= 60) {
        apCost = 60;
    }
    if (construct) {
        apCost = apCost*1.5;
    }
    if (prefabType.skills.includes('clicput')) {
        apCost = apCost*1.5;
    }
    apCost = Math.ceil(apCost);
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
