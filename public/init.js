Number.prototype.toFixedNumber = function(digits, base){
  var pow = Math.pow(base||10, digits);
  return Math.round(this*pow) / pow;
}
// Player
socket.on('playerInfos-Load', function(pi) {
    playerInfos = pi;
    if (playerInfos.numHTiles > 1 && playerInfos.numVTiles > 1) {
        numHTiles = playerInfos.numHTiles;
        numVTiles = playerInfos.numVTiles;
    }
    if (playerInfos.cocons === undefined) {
        playerInfos.cocons = 0;
    }
    if (playerInfos.eggPause === undefined) {
        playerInfos.eggPause = false;
    }
    if (playerInfos.mapAdjDiff === undefined) {
        playerInfos.mapAdjDiff = playerInfos.mapDiff;
    }
    if (playerInfos.aliensKilled === undefined) {
        playerInfos.aliensKilled = 0;
    }
    if (playerInfos.eggsKilled === undefined) {
        playerInfos.eggsKilled = 0;
    }
    if (playerInfos.unitsLost === undefined) {
        playerInfos.unitsLost = 0;
    }
    if (playerInfos.pauseSeed === undefined) {
        playerInfos.pauseSeed = rand.rand(1,8);
    }
    if (playerInfos.alienRes === undefined) {
        playerInfos.alienRes = {};
    }
    if (playerInfos.showedTiles === undefined) {
        playerInfos.showedTiles = [1830];
    }
    if (playerInfos.myCenter === undefined) {
        playerInfos.myCenter = 1830;
    }
    if (playerInfos.stopBarbs === undefined) {
        playerInfos.stopBarbs = false;
    }
    if (playerInfos.dark === undefined) {
        playerInfos.dark = false;
    }
    if (playerInfos.undarkOnce === undefined) {
        playerInfos.undarkOnce = [];
    }
    if (playerInfos.bldList === undefined) {
        playerInfos.bldList = [];
    }
    if (playerInfos.drugs === undefined) {
        playerInfos.drugs = ["Starka","Kirin","Sila","Skupiac","Bliss"];
    }
    playerSkills();
});
// Terrains
socket.on('mapFilters-Load', function(mf) {
    mapFilters = mf;
    // console.log(mapFilters);
});
socket.on('terrainTypes-Load', function(tt) {
    terrainTypes = tt;
    // console.log(terrainTypes);
});
// Map
socket.on('savedMap-Load', function(sm) {
    savedMap = sm;
    // console.log(savedMap);
    if (savedMap.length >= (mapSize*mapSize)-1) {
        zone = savedMap;
        checkUndark();
        writeMapStyles();
        xOffset = 31-Math.round(numVTiles/2);
        yOffset = 31-Math.round(numHTiles/2);
        showMap(zone,false);
    } else {
        generateNewMap();
    }
    checkUndark();
    turnInfo();
    commandes();
    checkVisibleAliens();
    alienBonus();
    minimap();
    if (playerInfos.pseudo != 'Test') {
        playMusic('start',true);
    }
    let thisBatType;
    // !!!!!!!!!!!!!!!!!!!!!!!! A ENLEVER une fois que les "sort" sont tous OK
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            thisBatType = getBatType(bat);
            if (thisBatType.sort === undefined) {
                bat.sort = bat.range*10;
            } else {
                bat.sort = thisBatType.sort;
            }
        }
    });
    // $('#tour').empty().append('Tour '+playerInfos.mapTurn+'<br>');
    // $('#tour').append('Difficulté '+playerInfos.mapDiff);
});
// resources
socket.on('resTypes-Load', function(rt) {
    resTypes = rt;
    // console.log(resTypes);
});
// Bataillons
socket.on('bataillons-Load', function(bt) {
    bataillons = bt;
    // console.log(bataillons);
    createBatList();
});
// UnitTypes Default Values
socket.on('unitDV-Load', function(udv) {
    unitDV = udv;
    // console.log(unitDV);
});
// ammoTypes
socket.on('ammoTypes-Load', function(at) {
    ammoTypes = at;
    // console.log(ammoTypes);
});
// armorTypes
socket.on('armorTypes-Load', function(at) {
    armorTypes = at;
    // console.log(armorTypes);
});
// UnitTypes
socket.on('unitTypes-Load', function(ut) {
    bareUnitTypes = ut;
    let newObj = {};
    bareUnitTypes.forEach(function(type) {
        newObj = Object.assign({}, unitDV, type);
        unitTypes.push(newObj)
    });
    bareUnitTypes = [];
    // console.log(unitTypes);
    if (playerInfos.skills.includes('cam1') || playerInfos.skills.includes('cam2') || playerInfos.skills.includes('cam3') || playerInfos.medLevel >= 3) {
        playerSkillsUTChanges();
    }
    freeIds('player',unitTypes);
});
socket.on('alienUnits-Load', function(au) {
    alienUnits = au;
    // console.log(alienUnits);
    freeIds('aliens',alienUnits);
});
socket.on('aliens-Load', function(ab) {
    aliens = ab;
    // console.log(aliens);
});
socket.on('testcon-failed', function(pseutest) {
    warning('Déconnexion:','Le serveur à été redémarré et vous n\'avez pas actualisé la page.<br>Vos dernières actions n\'ont peut-être pas été enregistrées.');
    alert("Le serveur à été redémarré et vous n'avez pas actualisé la page. Vos dernières actions n'ont peut-être pas été enregistrées.");
    console.log('pseudo test failed! *********************************');
});
