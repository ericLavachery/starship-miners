function transInfos(bat,batType,isCharged) {
    // console.log('transInfos');
    // let isCharged = checkCharged(bat,'trans');
    let underId = checkUnderId(bat,batType);
    let transId = checkTransportId(bat,batType);
    let apCost = 3;
    if (transId >= 0) {
        // Le bataillon en dessous peut embarquer le bataillon actif
        let transBat = getBatById(transId);
        let transBatType = getBatType(transBat);
        let embarqCost = calcEmbarqCost(batType,transBatType);
        apCost = embarqCost[0];
        if (!isCharged) {
            if (bat.tags.includes('deb') && bat.salvoLeft < 1 && transBatType.cat === 'vehicles' && !transBatType.skills.includes('transorbital') && !transBatType.skills.includes('inout')) {
                // Le bataillon actif fait un aller-tir-retour dans un véhicule
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Pas d\'embarquement si votre bataillon sort d\'un véhicule et a attaqué ce tour-ci" class="boutonRouge unitButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
            } else {
                // Le bataillon actif n'a pas de bataillon embarqué
                let resLoad = checkResLoad(bat);
                if (resLoad >= 1 && transBatType.skills.includes('transorbital')) {
                    // Le bataillon actif transporte des ressources et veut embarquer dans un lander
                    // Embarquement dans un Lander (avec les ressources)
                    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer dans '+transBat.type+'" class="boutonMarine unitButtons" onclick="embarquement('+transId+',true)"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
                } else {
                    // Embarquement OK (Soit pas de ressources, soit pas dans un Lander)
                    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer dans '+transBat.type+'" class="boutonMarine unitButtons" onclick="embarquement('+transId+',false)"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
                }
            }
        } else {
            // Le bataillon actif a un bataillon embarqué
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Pas d\'embarquement si votre bataillon a lui-même un bataillon embarqué" class="boutonRouge unitButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
        }
    } else {
        // Le bataillon en dessous ne peut pas embarquer le bataillon actif
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ce bataillon n\'a pas les moyens de vous embarquer" class="boutonGrey unitButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embarquer</h4></span>');
    }
    if (underId >= 0) {
        // Le bataillon actif peut embarquer le bataillon en dessous
        let underBat = getBatById(underId);
        let underBatType = getBatType(underBat);
        apCost = calcRamasseCost(underBat,underBatType,batType);
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embarquer '+underBat.type+'" class="boutonVert unitButtons" onclick="ramassage('+underId+')"><i class="fas fa-wheelchair"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ramasser</h4></span>');
    } else {
        // Le bataillon actif ne peut pas embarquer le bataillon en dessous
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ce bataillon n\'a pas les moyens de vous embarquer" class="boutonGrey unitButtons gf"><i class="fas fa-wheelchair"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ramasser</h4></span>');
    }
};

function noEmbarq() {
    $('#unitInfos').empty();
    selectMode();
    batUnstack();
    batUnselect();
};

function nearAnyLander(myBat) {
    let nearLander = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            let batType = getBatType(bat);
            if (batType.skills.includes('transorbital')) {
                let distance = calcDistance(myBat.tileId,bat.tileId);
                if (distance <= 1) {
                    nearLander = true;
                }
            }
        }
    });
    return nearLander;
};

function unloadInfos(myBat,myBatUnitType) {
    let balise = 'h4';
    let batAPLeft = 0;
    if (myBat.transIds != undefined) {
        if (myBat.transIds.length >= 1) {
            $('#unitInfos').append('<hr id="transBats">');
            if (!myBatUnitType.skills.includes('transorbital') && nearAnyLander(myBat)) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Transférer tous les bataillons dans le lander" class="boutonMarine bigButtons" onclick="unloadInLander()"><i class="fas fa-truck"></i> <i class="fas fa-arrow-right"></i> <i class="fas fa-space-shuttle"></i></button></h4></span>');
            }
            let apCost = 0;
            let sortedBats = bataillons.slice();
            sortedBats = _.sortBy(_.sortBy(sortedBats,'id'),'type');
            sortedBats.reverse();
            sortedBats = _.sortBy(sortedBats,'army');
            sortedBats.reverse();
            sortedBats.forEach(function(bat) {
                if (bat.loc === "trans" && bat.locId == myBat.id) {
                    let batType = getBatType(bat);
                    if (batType.cat != 'buildings' && batType.cat != 'devices') {
                        unloadBatInfos(myBat,myBatUnitType,bat,batType,apCost);
                    }
                }
            });
            sortedBats.forEach(function(bat) {
                if (bat.loc === "trans" && bat.locId == myBat.id) {
                    let batType = getBatType(bat);
                    if (batType.cat === 'buildings' || batType.cat === 'devices') {
                        unloadBatInfos(myBat,myBatUnitType,bat,batType,apCost);
                    }
                }
            });
        }
    }
};

function unloadBatInfos(myBat,myBatUnitType,bat,batType,apCost) {
    let damageIcon = '';
    let squadLoss = false;
    if (batType.name === 'Citoyens' || batType.name === 'Criminels') {
        if (bat.squadsLeft < Math.ceil(bat.citoyens/6)) {
            damageIcon = '<i class="ra ra-bleeding-hearts blor"></i>';
            squadLoss = true;
        }
    } else {
        if (bat.squadsLeft < batType.squads) {
            damageIcon = '<i class="ra ra-bleeding-hearts blor"></i>';
            squadLoss = true;
        }
    }
    if (!squadLoss && bat.damage >= 1) {
        damageIcon = '<i class="ra ra-bleeding-hearts"></i>';
    }
    let poisonIcon = '';
    if (bat.tags.includes('parasite') || bat.tags.includes('venin') || bat.tags.includes('poison') || bat.tags.includes('vomissure')) {
        poisonIcon = '<i class="fas fa-skull-crossbones"></i>';
    }
    let maladieIcon = '';
    if (bat.tags.includes('maladie') || bat.tags.includes('necro') || bat.tags.includes('vomi')) {
        maladieIcon = '<i class="fas fa-thermometer"></i>';
    }
    let drugIcon = '';
    if (bat.tags.includes('blaze')) {
        drugIcon = '<i class="ra ra-lightning-bolt"></i>';
    }
    let moreInfos = '';
    if (bat.chief != undefined) {
        if (bat.chief != '') {
            moreInfos = moreInfos+bat.chief+' ';
        }
    }
    let armyNum = '';
    if (bat.army != undefined) {
        if (bat.army >= 1) {
            armyNum = ' <span class="report gff">(a<span class="jaune">'+bat.army+'</span>)</span>';
        }
    }
    let myAmmo1 = showAmmo(bat.ammo,true);
    moreInfos = moreInfos+'('+myAmmo1+'&middot;';
    let myAmmo2 = showAmmo(bat.ammo2,true);
    moreInfos = moreInfos+myAmmo2+')';
    balise = 'h4';
    if (Object.keys(batDebarq).length >= 1) {
        if (batDebarq.id === bat.id) {
            balise = 'h3';
        }
    }
    let batPic = getBatPic(bat,batType);
    batAPLeft = Math.floor(bat.apLeft);
    let butCol = 'boutonMarine';
    if (bat.apLeft <= -7) {
        butCol = 'boutonGrey gf';
    } else if (bat.apLeft <= 0) {
        butCol = 'boutonGrisBis';
    }
    let ready = true;
    if (batType.skills.includes('prefab') && bat.apLeft <= 0) {
        ready = false;
    }
    let mayOut = checkMayOut(batType,true,bat);
    let batPrintName = getUnitPrintName(batType,false);
    if (!playerInfos.onShip && playerInfos.mapTurn < 1) {
        let isPara = isUnitPara(batType);
        if (isPara && playerInfos.para >= 1 && myBatUnitType.skills.includes('transorbital') && !myBatUnitType.skills.includes('rescue')) {
            let paraDistance = calcParaDist();
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Parachuter '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+') '+batAPLeft+' PA '+moreInfos+' ('+paraDistance+' cases)" class="'+butCol+' unitButtons" onclick="debarquement('+bat.id+')"><i class="fas fa-parachute-box"></i> <span class="small">'+apCost+'</span></button> <img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="32" class="dunit" onclick="batDetail('+bat.id+')" title="Détail du bataillon">&nbsp; '+batPrintName+armyNum+damageIcon+maladieIcon+poisonIcon+drugIcon+'</'+balise+'></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Vous ne pouvez pas débarquer avant le tour 1" class="boutonGrey unitButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonGris unitButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batPrintName+damageIcon+maladieIcon+poisonIcon+drugIcon+'</'+balise+'></span>');
        }
    } else if (myBatUnitType.skills.includes('transorbital') && !myBat.tags.includes('nomove') && !myBat.tags.includes('nopilots') && (batType.id === 126 || batType.id === 225)) {
        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Vous ne pouvez pas débarquer des citoyens d\'un vaisseau" class="boutonGrey unitButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonGris unitButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batPrintName+damageIcon+maladieIcon+poisonIcon+drugIcon+'</'+balise+'></span>');
    } else if (bat.tags.includes('nomove') && myBat.tags.includes('nomove')) {
        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Vous ne pouvez pas débarquer ce bataillon car vous ne le contrôlez pas" class="boutonGrey unitButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonGris unitButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batPrintName+damageIcon+maladieIcon+poisonIcon+drugIcon+'</'+balise+'></span>');
    } else if (!mayOut) {
        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Vous ne pouvez pas débarquer ce bataillon sur cette planète" class="boutonGrey unitButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonGris unitButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batPrintName+damageIcon+maladieIcon+poisonIcon+drugIcon+'</'+balise+'></span>');
    } else if (!ready) {
        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Vous ne pouvez pas reconstruire un bâtiment qui n\'a plus de PA" class="boutonGrey unitButtons gf"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Détail du bataillon" class="boutonGris unitButtons" onclick="batDetail('+bat.id+')"><i class="fas fa-info-circle"></i></button>&nbsp; '+batPrintName+damageIcon+maladieIcon+poisonIcon+drugIcon+'</'+balise+'></span>');
    } else {
        $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Débarquer '+batType.name+' ('+bat.squadsLeft+'/'+batType.squads+') '+batAPLeft+' PA '+moreInfos+'" class="'+butCol+' unitButtons" onclick="debarquement('+bat.id+')"><i class="fas fa-truck"></i> <span class="small">'+apCost+'</span></button> <img src="/static/img/units/'+batType.cat+'/'+batPic+'.png" width="32" class="dunit" onclick="batDetail('+bat.id+')" title="Détail du bataillon">&nbsp; '+batPrintName+armyNum+damageIcon+maladieIcon+poisonIcon+drugIcon+'</'+balise+'></span>');
    }
}

function unloadInLander() {
    let landerId = -1;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (bat.loc === "zone" && bat.id != selectedBat.id) {
            if (batType.skills.includes('transorbital')) {
                if (selectedBat.tileId === bat.tileId+1 || selectedBat.tileId === bat.tileId-1 || selectedBat.tileId === bat.tileId-mapSize || selectedBat.tileId === bat.tileId-mapSize+1 || selectedBat.tileId === bat.tileId-mapSize-1 || selectedBat.tileId === bat.tileId+mapSize || selectedBat.tileId === bat.tileId+mapSize+1 || selectedBat.tileId === bat.tileId+mapSize-1) {
                    landerId = bat.id;
                }
            }
        }
    });
    if (landerId >= 0) {
        landerBat = getBatById(landerId);
        landerBatType = getBatType(landerBat);
        bataillons.forEach(function(bat) {
            if (bat.loc === "trans" && bat.locId === selectedBat.id) {
                batType = getBatType(bat);
                if (batType.moveCost < 90 || batType.skills.includes('trailer')) {
                    let embarqOK = checkEmbarqThis(bat,landerBat);
                    if (embarqOK) {
                        let embarqCost = calcEmbarqCost(batType,landerBatType);
                        let apCost = embarqCost[0]+3;
                        bat.apLeft = bat.apLeft-apCost;
                        loadBat(bat.id,landerId,selectedBat.id);
                    }
                }
            }
        });
    }
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showMap(zone,false);
};

function calcVolume(bat,batType) {
    let batVolume;
    if (Object.keys(batType).length >= 1) {
        if (batType.skills.includes('prefab')) {
            batVolume = batType.squadSize*batType.squads*batType.crew*3.8;
        } else if (bat.citoyens >= 1 && batType.skills.includes('varsquad')) {
            batVolume = bat.citoyens*2.4;
        } else {
            batVolume = batType.size*batType.squadSize*batType.squads/4*Math.sqrt(batType.size+13)*batType.volume;
        }
        if (bat.eq === 'e-jetpack') {
            batVolume = batVolume*1.2;
        }
        if (bat.eq === 'kit-sentinelle') {
            batVolume = batVolume*1.15;
        }
        if (bat.eq === 'kit-garde') {
            batVolume = batVolume*1.25;
        }
        if (bat.eq === 'kit-artilleur') {
            batVolume = batVolume*1.25;
        }
        if (bat.eq === 'kit-guetteur') {
            batVolume = batVolume*1.3;
        }
        if (bat.eq === 'kit-pompiste') {
            batVolume = batVolume*1.15;
        }
        if (bat.eq === 'e-phare' && batType.cat === 'infantry') {
            batVolume = batVolume*1.5;
        }
    }
    batVolume = Math.floor(batVolume);
    return batVolume;
};

function calcVolumeByType(batType,cit) {
    let batVolume;
    if (Object.keys(batType).length >= 1) {
        if (cit >= 1 && batType.skills.includes('varsquad')) {
            batVolume = Math.round(cit*2.4);
        } else {
            batVolume = Math.round(batType.size*batType.squadSize*batType.squads/4*Math.sqrt(batType.size+13)*batType.volume);
        }
    }
    return batVolume;
};

function calcUnitVolume(batType) {
    let batVolume;
    if (Object.keys(batType).length >= 1) {
        if (batType.skills.includes('prefab')) {
            batVolume = Math.round(batType.squadSize*batType.squads*batType.crew*3.8);
        } else if (batType.skills.includes('varsquad')) {
            batVolume = Math.round(72*2.4);
        } else {
            batVolume = Math.round(batType.size*batType.squadSize*batType.squads/4*Math.sqrt(batType.size+13)*batType.volume);
        }
        return batVolume;
    }
};

function checkCharged(myBat,where) {
    let isCharged = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === where && bat.locId == myBat.id) {
            isCharged = true;
        }
    });
    return isCharged;
};

function checkTrailerInfo(myBat) {
    // console.log('REMORQUE');
    let remBatType = getBatTypeByName('Remorques');
    let myTrailer = {};
    myTrailer.ok = false;
    myTrailer.fret = false;
    myTrailer.space = remBatType.transRes;
    // console.log(myTrailer.space);
    bataillons.forEach(function(bat) {
        if (bat.type === 'Remorques') {
            if (bat.loc === 'trans' && bat.locId == myBat.id) {
                myTrailer.ok = true;
                let resSpace = checkResSpace(bat);
                console.log(resSpace);
                if (resSpace < myTrailer.space) {
                    myTrailer.fret = true;
                    myTrailer.space = resSpace;
                }
            }
        }
    });
    return myTrailer;
};

function checkTransMaxSize(batType,transBat,transBatType) {
    let transOK = false;
    let maxSize = transBatType.transMaxSize;
    if (hasEquip(transBat,['garage'])) {
        maxSize = maxSize*3;
    }
    if (maxSize >= batType.size) {
        transOK = true;
        let isInfantry = false;
        if (batType.cat === 'infantry') {
            isInfantry = true;
        }
        if (batType.cat === 'vehicles') {
            if (batType.skills.includes('robot') || batType.skills.includes('cyber') || batType.skills.includes('trailer')) {
                isInfantry = true;
            }
        }
        if (maxSize < 20 && !isInfantry) {
            transOK = false;
        }
    }
    return transOK;
};

function checkUnderId(myBat,myBatType) {
    // vérifie si l'unité en dessous peut être ramassée par l'unité active, et retourne son Id
    let underId = -1;
    let myBatTransUnitsLeft = calcTransUnitsLeft(myBat,myBatType);
    let tracking = checkTracking(myBat);
    let trailerIn = checkTrailer(myBat);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.tileId == myBat.tileId) {
            let batType = getBatType(bat);
            if (batType.cat != 'buildings' && batType.cat != 'devices' && (batType.moveCost < 90 || batType.skills.includes('trailer')) && !bat.tags.includes('nomove')) {
                let tmsOK = checkTransMaxSize(batType,myBat,myBatType);
                if (tmsOK) {
                    if (!batType.skills.includes('tracked') || !tracking) {
                        if (!batType.skills.includes('trailer') || !trailerIn) {
                            let batWeight = calcVolume(bat,batType);
                            if (batWeight <= myBatTransUnitsLeft) {
                                let isCharged = checkCharged(bat,'trans');
                                if (!isCharged) {
                                    underId = bat.id;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return underId;
}

function checkTransportId(myBat,myBatType) {
    // vérifie si le transport (en dessous de l'unité) peut la prendre, et retourne son Id
    let transId = -1;
    let batType;
    let batTransUnitsLeft;
    let myBatWeight = calcVolume(myBat,myBatType);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" && bat.tileId === myBat.tileId) {
            batType = getBatType(bat);
            let maxSize = batType.transMaxSize;
            if (hasEquip(bat,['garage'])) {
                maxSize = maxSize*3;
            }
            if (maxSize >= myBatType.size) {
                let tracking = checkTracking(bat);
                let trailerIn = checkTrailer(bat);
                if (!myBatType.skills.includes('tracked') || !tracking) {
                    if (!myBatType.skills.includes('trailer') || !trailerIn) {
                        batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                        let myBatVolume = myBatWeight;
                        if (batType.skills.includes('transveh') && myBatType.cat === 'vehicles' && !myBatType.skills.includes('robot') && !myBatType.skills.includes('cyber')) {
                            myBatVolume = Math.round(myBatVolume/2);
                        }
                        if (myBatVolume <= batTransUnitsLeft) {
                            transId = bat.id;
                        }
                    }
                }
            }
        }
    });
    return transId;
};

function checkEmbarqThis(myBat,transBat) {
    // console.log('CHECK EMBARQ THIS');
    // console.log(myBat);
    // console.log(transBat);
    let embarqOK = false;
    let myBatType = getBatType(myBat);
    if (myBatType.moveCost < 90 || myBatType.skills.includes('trailer')) {
        // console.log('ok move');
        let myBatWeight = calcVolume(myBat,myBatType);
        // console.log('myBatWeight='+myBatWeight);
        let transBatType = getBatType(transBat);
        let tmsOK = checkTransMaxSize(myBatType,transBat,transBatType);
        if (tmsOK) {
            // console.log('ok size');
            let tracking = checkTracking(transBat);
            let trailerIn = checkTrailer(transBat);
            // console.log('tracking='+tracking);
            if (!myBatType.skills.includes('tracked') || !tracking) {
                if (!myBatType.skills.includes('trailer') || !trailerIn) {
                    // console.log('ok tracking');
                    let transUnitsLeft = calcTransUnitsLeft(transBat,transBatType);
                    // console.log('transUnitsLeft='+transUnitsLeft);
                    if (transBatType.skills.includes('transveh') && myBatType.cat === 'vehicles' && !myBatType.skills.includes('robot') && !myBatType.skills.includes('cyber')) {
                        myBatWeight = Math.round(myBatWeight/2);
                    }
                    if (myBatWeight <= transUnitsLeft) {
                        // console.log('ok trans left');
                        embarqOK = true;
                    }
                }
            }
        }
    }
    return embarqOK;
};

function calcTransWithBreak(theTrans,batType) {
    let breakRes = theTrans+Math.round(batType.transRes/4);
    if (breakRes > theTrans*2) {
        breakRes = theTrans*2;
    }
    theTrans = breakRes;
    // let breakMult = Math.round(theTrans*1.25);
    // if (breakRes > breakMult) {
    //     theTrans = breakRes;
    // } else {
    //     theTrans = breakMult;
    // }
    return theTrans;
}

function calcTransUnitsLeft(myBat,myBatType) {
    let myBatTransUnitsLeft = myBatType.transUnits;
    if (hasEquip(myBat,['garage'])) {
        myBatTransUnitsLeft = myBatTransUnitsLeft*2;
    }
    if (hasEquip(myBat,['megatrans'])) {
        if (myBatType.skills.includes('rescue')) {
            myBatTransUnitsLeft = Math.round(myBatTransUnitsLeft*1.1);
        } else {
            myBatTransUnitsLeft = Math.round(myBatTransUnitsLeft*1.25);
        }
    }
    if (myBatType.skills.includes('rescue')) {
        if (playerInfos.gLevel >= 15) {
            let gangFactor = 1+((playerInfos.gLevel-14)/50);
            myBatTransUnitsLeft = Math.round(myBatTransUnitsLeft*gangFactor);
        }
    }
    if (hasEquip(myBat,['maxtrans'])) {
        myBatTransUnitsLeft = calcTransWithBreak(myBatTransUnitsLeft,myBatType);
    }
    if (myBatType.skills.includes('transorbital') && playerInfos.mapTurn >= 2) {
        myBatTransUnitsLeft = Math.round(myBatTransUnitsLeft*bonusTransRetour);
        let resSpace = checkLanderResSpace(myBat);
        myBatTransUnitsLeft = myBatTransUnitsLeft+Math.round(resSpace/2);
    }
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId == myBat.id) {
            let batType = getBatType(bat);
            let batWeight = calcVolume(bat,batType);
            if (myBatType.skills.includes('transveh') && batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber')) {
                batWeight = Math.round(batWeight/2);
            }
            myBatTransUnitsLeft = myBatTransUnitsLeft-batWeight;
        }
    });
    // console.log('myBatTransUnitsLeft'+myBatTransUnitsLeft);
    return myBatTransUnitsLeft;
};

function calcBatTransUnits(myBat,myBatType) {
    let myBatTransUnitsLeft = myBatType.transUnits;
    if (myBatTransUnitsLeft >= 1) {
        if (hasEquip(myBat,['garage'])) {
            myBatTransUnitsLeft = myBatTransUnitsLeft*2;
        }
        if (hasEquip(myBat,['maxtrans'])) {
            myBatTransUnitsLeft = calcTransWithBreak(myBatTransUnitsLeft,myBatType);
        }
    }
    // console.log('myBatTransUnitsLeft'+myBatTransUnitsLeft);
    return myBatTransUnitsLeft;
};

function checkLanderResSpace(bat) {
    let batType = getBatType(bat);
    let resLoaded = checkResLoad(bat);
    let resMax = batType.transRes;
    if (hasEquip(bat,['megafret'])) {
        resMax = Math.round(resMax*1.33);
    }
    if (bat.citoyens > 0) {
        resMax = bat.citoyens;
    }
    let resSpace = resMax-resLoaded;
    if (resSpace < 0) {
        resSpace = 0;
    }
    return resSpace;
};

function checkTracking(myBat) {
    let tracking = false;
    let myBatType = getBatType(myBat);
    if (myBatType.skills.includes('fly') || myBatType.skills.includes('hover') || myBatType.skills.includes('emoteur')) {
        if (myBatType.transMaxSize <= 18) {
            tracking = true;
        }
    }
    if (!tracking) {
        if (myBatType.transMaxSize <= 18) {
            bataillons.forEach(function(bat) {
                if (bat.loc === "trans" && bat.locId == myBat.id) {
                    batType = getBatType(bat);
                    if (batType.skills.includes('tracked')) {
                        tracking = true;
                    }
                }
            });
        }
    }
    return tracking;
};

function checkTrailer(myBat) {
    let trailerIn = false;
    let myBatType = getBatType(myBat);
    if (!myBatType.skills.includes('transorbital') && myBatType.cat != 'buildings') {
        bataillons.forEach(function(bat) {
            if (bat.loc === "trans" && bat.locId == myBat.id) {
                batType = getBatType(bat);
                if (batType.skills.includes('trailer')) {
                    trailerIn = true;
                }
            }
        });
    }
    return trailerIn;
};

function calcRamasseCost(bat,batType,transBatType) {
    let ramasseCost = 0;
    ramasseCost = ramasseCost+3-playerInfos.comp.trans;
    let batWeight = calcVolume(bat,batType);
    let transBatCrew = transBatType.squads*transBatType.squadSize*transBatType.crew;
    if (transBatCrew === 0) {
        transBatCrew = transBatType.squads*transBatType.squadSize;
    }
    let crewCost = Math.round(batWeight/transBatCrew/2.5);
    if (crewCost < 1) {
        crewCost = 1;
    }
    if (crewCost > 6) {
        crewCost = 6;
    }
    ramasseCost = ramasseCost+crewCost;
    if (batType.skills.includes('tracked') && transBatType.transMaxSize <= 18) {
        ramasseCost = ramasseCost+4-playerInfos.comp.log;
    }
    if (transBatType.skills.includes('hardembark')) {
        ramasseCost = ramasseCost+4;
    }
    if (transBatType.skills.includes('ouvert')) {
        ramasseCost = ramasseCost-4;
    }
    if (batType.skills.includes('trailer')) {
        ramasseCost = 3-playerInfos.comp.log;
    }
    if (ramasseCost < 0) {
        ramasseCost = 0;
    }
    if (batType.skills.includes('barda')) {
        ramasseCost = ramasseCost+1;
    }
    return ramasseCost;
}

function calcEmbarqCost(batType,transBatType) {
    let embarqCost = [0,0];
    let transComp = playerInfos.comp.trans;
    if (playerInfos.comp.trans >= 3) {
        transComp++;
    }
    embarqCost[0] = embarqCost[0]+7-transComp;
    if (transBatType.cat === 'buildings') {
        embarqCost[0] = 3-playerInfos.comp.log;
    }
    if (batType.skills.includes('tracked') && transBatType.transMaxSize <= 18) {
        embarqCost[1] = embarqCost[1]+12-(playerInfos.comp.log*2);
    } else {
        if (transBatType.skills.includes('ouvert')) {
            embarqCost[0] = embarqCost[0]-2;
        }
    }
    if (transBatType.skills.includes('fly')) {
        embarqCost[0] = embarqCost[0]+2;
    }
    if (transBatType.skills.includes('hardembark')) {
        embarqCost[0] = embarqCost[0]+2;
    }
    if (!allowDSE && transBatType.cat != 'buildings') {
        embarqCost[0] = embarqCost[0]-2;
        if (embarqCost[0] < 1) {
            embarqCost[0] = 1;
        }
        if (batType.skills.includes('barda')) {
            embarqCost[0] = embarqCost[0]+1;
        }
    }
    return embarqCost;
}

function ramassage(underId) {
    let underBat = getBatById(underId);
    let underBatType = getBatType(underBat);
    if (!playerInfos.onShip) {
        let ramasseCost = calcRamasseCost(underBat,underBatType,selectedBatType);
        selectedBat.apLeft = selectedBat.apLeft-ramasseCost;
    }
    loadBat(underBat.id,selectedBat.id);
    doneAction(selectedBat);
    tagDelete(underBat,'guet');
    camoOut();
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
    showTileInfos(selectedBat.tileId);
};

function embarquement(transId,withRes) {
    let transBat = getBatById(transId);
    let transBatType = getBatType(transBat);
    let ea = checkEmbarqArmy(transBat,transBatType,selectedBat);
    if (!playerInfos.onShip) {
        let embarqCost = calcEmbarqCost(selectedBatType,transBatType);
        transBat.apLeft = transBat.apLeft-embarqCost[1];
        selectedBat.apLeft = selectedBat.apLeft-embarqCost[0];
    }
    loadBat(selectedBat.id,transBat.id);
    doneAction(transBat);
    tagDelete(selectedBat,'guet');
    camoOut();
    if (!selectedBatType.skills.includes('trailer')) {
        stopAutoLoad();
    }
    selectedBatArrayUpdate();
    showBataillon(transBat);
    batSelect(transBat);
    showBatInfos(selectedBat);
    showTileInfos(selectedBat.tileId);
    selectMode();
    // --------------------------------------
    if (ea.ok) {
        embarqArmy(transBat,transBatType,ea.oldTransBat);
    }
};

function checkEmbarqArmy(transBat,transBatType,firstBat) {
    let ea = {};
    ea.ok = false;
    ea.oldTransBat = {};
    if (playerInfos.mapTurn <= 5 && transBat.army === firstBat.army && transBat.army >= 1 && !transBatType.skills.includes('transorbital') && !playerInfos.onShip) {
        findLanders();
        let nearestLanderBatId = -1;
        landers.forEach(function(landerBat) {
            let distance = calcDistance(landerBat.tileId,firstBat.tileId);
            if (distance <= 1) {
                nearestLanderBatId = landerBat.id;
            }
        });
        if (nearestLanderBatId >= 0) {
            ea.oldTransBat = getBatById(nearestLanderBatId);
            ea.ok = true;
        }
    }
    return ea;
};

function embarqArmy(transBat,transBatType,oldTransBat) {
    let transOK = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId == oldTransBat.id && bat.army === transBat.army) {
            let batType = getBatType(bat);
            let batWeight = calcVolume(bat,batType);
            let tmsOK = checkTransMaxSize(batType,transBat,transBatType);
            if (tmsOK) {
                let transUnitsLeft = calcTransUnitsLeft(transBat,transBatType);
                if (transBatType.skills.includes('transveh') && batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber')) {
                    batWeight = Math.round(batWeight/2);
                }
                if (batWeight <= transUnitsLeft) {
                    let embarqCost = calcEmbarqCost(batType,transBatType);
                    bat.apLeft = bat.apLeft-embarqCost[0]-2;
                    loadBat(bat.id,transBat.id,oldTransBat.id);
                    transOK = true;
                }
            }
        }
    });
    if (transOK) {
        showBatInfos(selectedBat);
        showTileInfos(selectedBat.tileId);
        selectMode();
    }
};

function resTransfert(transBat) {
    Object.entries(selectedBat.transRes).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (value >= 1) {
            if (transBat.transRes[key] === undefined) {
                transBat.transRes[key] = value;
            } else {
                transBat.transRes[key] = transBat.transRes[key]+value;
            }
        }
        delete selectedBat.transRes[key];
    });
};

function checkHopTransId(myBat,myBatType) {
    let transId = -1;
    let isTrailer = false;
    if (myBatType.skills.includes('trailer')) {
        isTrailer = true;
    }
    if (myBatType.moveCost < 90 || myBatType.skills.includes('trailer')) {
        if (!myBat.tags.includes('deb') || myBat.salvoLeft >= 1) {
            let isCharged = checkCharged(myBat,'trans');
            let enoughAP = false;
            if (myBat.apLeft > 0 || (myBat.apLeft > -4 && myBatType.skills.includes('guerrilla'))) {
                enoughAP = true;
            }
            if (!isCharged && enoughAP) {
                let resLoad = checkResLoad(myBat);
                let myBatVolume = calcVolume(myBat,myBatType);
                let selfMove = checkSelfMove(myBat,myBatType);
                let bestTrans = 0;
                bataillons.forEach(function(bat) {
                    if (bat.loc === "zone" && myBat.id != bat.id) {
                        let batType = getBatType(bat);
                        if (resLoad <= 0 || !batType.skills.includes('transorbital')) {
                            let tmsOK = checkTransMaxSize(myBatType,bat,batType);
                            if (batType.transUnits >= 1 && tmsOK) {
                                let distance = calcDistance(myBat.tileId,bat.tileId);
                                if (distance <= 1) {
                                    let tracking = checkTracking(bat);
                                    let trailerIn = checkTrailer(bat);
                                    if (!myBatType.skills.includes('tracked') || !tracking) {
                                        if (!myBatType.skills.includes('trailer') || !trailerIn) {
                                            let batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                                            if (myBatVolume <= batTransUnitsLeft) {
                                                let thisTrans = getTransScore(bat,batType,myBat,myBatVolume,batTransUnitsLeft,selfMove,isTrailer);
                                                if (thisTrans > bestTrans) {
                                                    transId = bat.id;
                                                    bestTrans = thisTrans;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }
    return transId;
};

function checkJumpTransId() {
    let transId = -1;
    let isTrailer = false;
    if (selectedBatType.skills.includes('trailer')) {
        isTrailer = true;
    }
    if (Object.keys(selectedBat).length >= 1) {
        if (selectedBatType.moveCost < 90 || selectedBatType.skills.includes('trailer')) {
            if (!selectedBat.tags.includes('deb') || selectedBat.salvoLeft >= 1) {
                let isCharged = checkCharged(selectedBat,'trans');
                let enoughAP = false;
                if (selectedBat.apLeft > 0 || (selectedBat.apLeft > -4 && selectedBatType.skills.includes('guerrilla'))) {
                    enoughAP = true;
                }
                if (!isCharged && enoughAP) {
                    let resLoad = checkResLoad(selectedBat);
                    let selectedBatVolume = calcVolume(selectedBat,selectedBatType);
                    let selfMove = checkSelfMove(selectedBat,selectedBatType);
                    let bestTrans = 0;
                    bataillons.forEach(function(bat) {
                        if (bat.loc === "zone" && selectedBat.id != bat.id) {
                            let batType = getBatType(bat);
                            if (resLoad <= 0 || !batType.skills.includes('transorbital')) {
                                let tmsOK = checkTransMaxSize(selectedBatType,bat,batType);
                                if (batType.transUnits >= 1 && tmsOK) {
                                    let distance = calcDistance(selectedBat.tileId,bat.tileId);
                                    if (distance <= 1) {
                                        let tracking = checkTracking(bat);
                                        let trailerIn = checkTrailer(bat);
                                        if (!selectedBatType.skills.includes('tracked') || !tracking) {
                                            if (!selectedBatType.skills.includes('trailer') || !trailerIn) {
                                                let batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                                                if (selectedBatVolume <= batTransUnitsLeft) {
                                                    let thisTrans = getTransScore(bat,batType,selectedBat,selectedBatVolume,batTransUnitsLeft,selfMove,isTrailer);
                                                    if (thisTrans > bestTrans) {
                                                        transId = bat.id;
                                                        bestTrans = thisTrans;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    }
    return transId;
};

function jumpInTrans() {
    let transId = checkJumpTransId();
    if (transId >= 0) {
        let transBat = getBatById(transId);
        let transBatType = getBatType(transBat);
        let anybody = anybodyHere(transBat);
        let selfMove = checkSelfMove(selectedBat,selectedBatType);
        console.log('selfMove='+selfMove);
        console.log('anybody='+anybody);
        console.log(transBatType);
        if (anybody || selfMove) {
            let embarqCost = calcEmbarqCost(selectedBatType,transBatType);
            let apCost = embarqCost[0]+2;
            transBat.apLeft = transBat.apLeft-embarqCost[1];
            selectedBat.apLeft = selectedBat.apLeft-apCost;
            loadBat(selectedBat.id,transBat.id);
            doneAction(transBat);
            tagDelete(selectedBat,'guet');
            camoOut();
            if (!selectedBatType.skills.includes('trailer')) {
                stopAutoLoad();
            }
            selectedBatArrayUpdate();
            showMap(zone,true);
            showBataillon(transBat);
            batSelect(transBat);
            showBatInfos(selectedBat);
            showTileInfos(selectedBat.tileId);
            selectMode();
        }
    }
};

function getTransScore(bat,batType,myBat,selectedBatVolume,batTransUnitsLeft,selfMove,isTrailer) {
    let score = 0;
    if (!isTrailer) {
        score = Math.round(batTransUnitsLeft/100);
        if (selectedBatVolume+180 <= batTransUnitsLeft) {
            score = score+10;
        }
        if (selectedBatVolume+50 > batTransUnitsLeft && batType.moveCost < 90) {
            score = score+((55+selectedBatVolume-batTransUnitsLeft)*10);
        }
        if (batType.skills.includes('transorbital') && playerInfos.mapTurn >= 3) {
            score = score+10000;
        }
    }
    if (bat.army === myBat.army) {
        score = score+1000;
    }
    if (!selfMove) {
        let anybody = anybodyHere(bat);
        if (!anybody) {
            score = 0;
        }
    }
    return score;
}

function debarquement(debId) {
    let debBat = getBatById(debId);
    selectMode();
    batDebarq = debBat;
    cursorSwitch('.','grid-item','thor');
    showBatInfos(selectedBat);
};

function checkBatTeleport(podBat,teleBat,tileId) {
    console.log('checkBatTeleport');
    console.log(podBat);
    console.log(teleBat);
    let teleStats = {};
    teleStats.ok = false;
    teleStats.tag = false;
    teleStats.message = '';
    if (playerInfos.comp.tele >= 2) {
        if (!podBat.tags.includes('podcd')) {
            let inBat = getZoneBatByTileId(tileId);
            let inBatType = getBatType(inBat);
            console.log(inBat);
            let podBatType = getBatType(podBat);
            let teleBatType = getBatType(teleBat);
            if (podBat.eq === 'lifepod' || podBat.eq === 'e-lifepod' || podBat.eq === 'w1-lifepod' || podBat.eq === 'w2-lifepod') {
                if (inBat.eq === 'lifepod' || inBat.eq === 'e-lifepod' || inBat.eq === 'w1-lifepod' || inBat.eq === 'w2-lifepod') {
                    if (teleBatType.cat === 'infantry' || teleBatType.skills.includes('robot')) {
                        if (teleBatType.size <= 9) {
                            let teleCostOK = checkCost(teleCost);
                            if (teleCostOK) {
                                teleStats.ok = true;
                                if (podBat.eq === 'e-lifepod') {
                                    teleStats.tag = true;
                                }
                            } else {
                                teleStats.message = "Vous n'avez pas les ressources pour téléporter ce bataillon";
                            }
                        } else {
                            teleStats.message = "Vous ne pouvez pas téléporter ce type de bataillon";
                        }
                    } else {
                        teleStats.message = "Vous ne pouvez pas téléporter ce type de bataillon";
                    }
                } else {
                    teleStats.message = "Vous ne pouvez pas téléporter vers de ce bâtiment";
                }
            } else {
                teleStats.message = "Vous ne pouvez pas téléporter à partir de ce bâtiment";
            }
        } else {
            teleStats.message = "Vous avez déjà téléporté un bataillon ce tour-ci";
        }
    } else {
        teleStats.message = "Vous n'avez pas les compétences pour téléporter des bataillons";
    }
    return teleStats;
};

function clickDebarq(tileId) {
    let tileOK = false;
    let ownBatHere = false;
    let message = '';
    let batDebarqType = getBatType(batDebarq);
    let transBat = getBatById(batDebarq.locId);
    let transBatType = getBatType(transBat);
    let fromVeh = false;
    if (transBatType.cat === 'vehicles' && !transBatType.skills.includes('transorbital')) {
        fromVeh = true;
    }
    let myBatWeight = calcVolume(batDebarq,batDebarqType);
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            let batType = getBatType(bat);
            if (batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') {
                ownBatHere = true;
                message = 'Vous ne pouvez pas mettre un bâtiment dans un autre bâtiment.';
            } else if (batDebarq.apLeft < 1 && !batType.skills.includes('transorbital')) {
                ownBatHere = true;
                message = 'Il ne vous reste pas assez de PA.';
            } else if (!batType.skills.includes('transport')) {
                ownBatHere = true;
                message = 'Le bataillon de destination ne peut pas acceuillir de troupes.';
            } else {
                let tmsOK = checkTransMaxSize(batDebarqType,bat,batType);
                if (!tmsOK) {
                    ownBatHere = true;
                    message = 'Le taille de votre bataillon ('+batDebarqType.size+') est trop élevée pour le bataillon de destination ('+batType.transMaxSize+').';
                } else {
                    let batTransUnitsLeft = calcTransUnitsLeft(bat,batType);
                    let myBatVolume = myBatWeight;
                    if (batType.skills.includes('transveh') && batDebarqType.cat === 'vehicles' && !batDebarqType.skills.includes('robot') && !batDebarqType.skills.includes('cyber')) {
                        myBatVolume = Math.round(myBatVolume/2);
                    }
                    if (myBatVolume > batTransUnitsLeft) {
                        ownBatHere = true;
                        message = 'Il n\'y a plus assez de place dans le bataillon de destination.';
                    }
                }
            }
        }
    });
    let distance = calcDistance(selectedBat.tileId,tileId);
    let teleStats = {};
    teleStats.ok = false;
    teleStats.message = '';
    let paraOK = false;
    let isPara = false;
    let paraMessage = '';
    if (distance > 1 || playerInfos.mapTurn === 0) {
        let paraDistance = calcParaDist();
        // let isPara = isUnitPara(batDebarqType);
        if (playerInfos.mapTurn === 0 && !playerInfos.onShip && playerInfos.para >= 1) {
            if (distance <= paraDistance) {
                paraMessage = '';
                paraOK = true;
            } else {
                paraMessage = '<span class="vio">Distance maximum de parachutage: '+paraDistance+'</span>';
            }
            isPara = true;
        } else {
            teleStats = checkBatTeleport(selectedBat,batDebarq,tileId);
        }
    }
    if ((distance <= 1 || playerInfos.onShip || teleStats.ok || paraOK) && !ownBatHere && (terrainAccess(batDebarq.id,tileId,true) || teleStats.ok || batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') && !alienOccupiedTiles.includes(tileId)) {
        tileOK = true;
        if (isPara) {
            playerInfos.para = playerInfos.para-1;
        }
    } else {
        if (isPara) {
            batDebarq = {};
            showBatInfos(selectedBat);
            if (paraMessage != '') {
                warning('Parachutage avorté','Vous ne pouvez pas parachuter ce bataillon à cet endroit. '+paraMessage);
            } else {
                warning('Parachutage avorté','Vous ne pouvez pas parachuter ce bataillon à cet endroit. '+message);
            }
        } else if (playerInfos.comp.train >= 1) {
            batDebarq = {};
            showBatInfos(selectedBat);
            if (teleStats.message != '') {
                warning('Téléportation avortée',teleStats.message);
            } else {
                warning('Débarquement avorté','Vous ne pouvez pas débarquer ce bataillon à cet endroit. '+message);
            }
        } else {
            batDebarq = {};
            showBatInfos(selectedBat);
            warning('Débarquement avorté','Vous ne pouvez pas débarquer ce bataillon à cet endroit. '+message);
        }
    }
    if (tileOK) {
        if (batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') {
            tagDelete(selectedBat,'loaded');
            if (!playerInfos.onShip) {
                let apCost = prefabCost(selectedBatType,batDebarqType,false);
                selectedBat.apLeft = selectedBat.apLeft-apCost;
                selectedBat.xp = selectedBat.xp+(Math.sqrt(batDebarqType.fabTime)/20);
                constructSound();
                batDebarq.creaTurn = playerInfos.mapTurn;
            }
        } else {
            if (selectedBat.transIds.includes(batDebarq.id)) {
                tagIndex = selectedBat.transIds.indexOf(batDebarq.id);
                selectedBat.transIds.splice(tagIndex,1);
            }
        }
        batDebarq.loc = 'zone';
        batDebarq.locId = 0;
        batDebarq.tileId = tileId;
        tagDelete(batDebarq,'hreg');
        if (selectedBat.tileId > -1) {
            batDebarq.oldTileId = selectedBat.tileId;
        } else {
            batDebarq.oldTileId = tileId;
        }
        if (!allowDSE && fromVeh && !batDebarq.tags.includes('deb')) {
            batDebarq.tags.push('deb');
        }
        console.log('oldTileId='+selectedBat.tileId);
        doneAction(transBat);
        doneAction(selectedBat);
        if (teleStats.ok) {
            payCost(teleCost);
            if (teleStats.tag && !selectedBat.tags.includes('podcd')) {
                selectedBat.tags.push('podcd');
            }
        }
        selectedBatArrayUpdate();
        batUnselect();
        if (batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') {
            if (!playerInfos.onShip) {
                let apCost = Math.round(batDebarqType.fabTime*batDebarq.ap/20);
                if (batDebarqType.cat === 'devices') {
                    apCost = Math.ceil(apCost/3);
                }
                batDebarq.apLeft = batDebarq.ap-apCost;
                if (batDebarq.apLeft < 0-Math.round(batDebarqType.ap*1.5)) {
                    batDebarq.apLeft = 0-Math.round(batDebarqType.ap*1.5);
                }
                if (batDebarq.apLeft > 1) {
                    batDebarq.apLeft = 1;
                }
            }
        }
        showBataillon(batDebarq);
        batSelect(batDebarq,true);
        if (selectedBat.tags.includes('nomove')) {
            selectMode();
        } else {
            moveMode();
        }
        if (batDebarqType.cat === 'buildings' || batDebarqType.cat === 'devices') {
            moveSelectedBat(tileId,true,false);
            let tile = getTileById(tileId);
            delete tile.infra;
            if (tile.ruins && tile.sh >= 1) {
                searchRuins(1,-1);
            }
        } else {
            moveSelectedBat(tileId,false,false);
        }
        if (selectedBatType.moveCost >= 90) {
            selectMode();
        } else {
            moveInfos(selectedBat,false);
        }
        showBatInfos(selectedBat);
        showTileInfos(selectedBat.tileId);
        batDebarq = {};
    }
};
