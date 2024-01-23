function areaMove(direction,cases) {
    let x = 0;
    let y = 0;
    switch(direction) {
        case 'n':
        x = Number(xOffset)-cases;
        if (x < 0) {
            x = 0;
        }
        y = Number(yOffset);
        break;
        case 's':
        x = Number(xOffset)+cases;
        if (x > 60-numVTiles) {
            x = 60-numVTiles;
        }
        y = Number(yOffset);
        break;
        case 'e':
        y = Number(yOffset)+cases;
        if (y > 60-numHTiles) {
            y = 60-numHTiles;
        }
        x = Number(xOffset);
        break;
        case 'w':
        y = Number(yOffset)-cases;
        if (y < 0) {
            y = 0;
        }
        x = Number(xOffset);
        break;
    }
    areaGo(x,y);
};

function areaGo(x,y) {
    xOffset = x;
    yOffset = y;
    showMap(zone,true);
    if (!playerInfos.onShip) {
        minimap();
    }
    confirmMode();
};

function autoMapSize(isPrev) {
    let screenH = window.innerWidth;
    let screenV = window.innerHeight;
    console.log('YOUR SCREEN =====================================================================');
    console.log(screenH+' x '+screenV);
    screenH = screenH-540;
    screenV = screenV-52;
    // screenV = screenV-124;
    if (playerInfos.onShip && playerInfos.resBar) {
        screenV = screenV-30;
    }
    console.log('Map area');
    console.log(screenH+' x '+screenV);
    let numSquaresH = Math.floor(screenH/72);
    let numSquaresV = Math.floor(screenV/72);
    console.log('Squares');
    console.log(numSquaresH+' x '+numSquaresV);
    numHTiles = numSquaresH;
    numVTiles = numSquaresV;
    if (playerInfos.onShip && !modeSonde && !zone[0].isPrev) {
        if (numHTiles > 17) {
            numHTiles = 17;
        }
        if (numVTiles > 11) {
            numVTiles = 11;
        }
    } else {
        if (numHTiles > 28) {
            numHTiles = 28;
        }
        if (numVTiles > 15) {
            numVTiles = 15;
        }
    }
    if (numHTiles < 14) {
        numHTiles = 14;
    }
    if (numVTiles < 9) {
        numVTiles = 9;
    }
    playerInfos.numHTiles = numHTiles;
    playerInfos.numVTiles = numVTiles;
    writeMapStyles();
    myTileX = zone[1830].x;
    myTileY = zone[1830].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone,false,isPrev);
    if (playerInfos.onShip && !modeSonde && !zone[0].isPrev) {
        miniOut();
    }
}

function yourMapSize() {
    let screenH = window.screen.availWidth;
    let screenV = window.screen.availHeight;
    let defV = 19;
    let defH = 11;
    if (screenH >= 2560) {
        defH = 28;
    }
    if (screenV >= 1440) {
        defV = 16;
    }
    numHTiles = Number(prompt('Nombre de terrains vus horizontalement (x)',numHTiles));
    numVTiles = Number(prompt('Nombre de terrains vus horizontalement (y)',numVTiles));
    if (numHTiles > 28) {
        numHTiles = 28;
    }
    if (numVTiles > 16) {
        numVTiles = 16;
    }
    playerInfos.numHTiles = numHTiles;
    playerInfos.numVTiles = numVTiles;
    writeMapStyles();
    showMap(zone,false);
};

function stationMapSize() {
    numHTiles = playerInfos.numHTiles;
    numVTiles = playerInfos.numVTiles;
    writeMapStyles();
    myTileX = zone[1830].x;
    myTileY = zone[1830].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone,false);
    miniOut();
};

function limitOffset() {
    if (xOffset < 0) {
        xOffset = 0;
    }
    if (yOffset < 0) {
        yOffset = 0;
    }
    if (xOffset > 60-numVTiles) {
        xOffset = 60-numVTiles;
    }
    if (yOffset > 60-numHTiles) {
        yOffset = 60-numHTiles;
    }
};

function centerMapTo(tileId) {
    // center on tile
    myTileX = zone[tileId].x;
    myTileY = zone[tileId].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone,true);
    confirmMode();
    selectedTile = tileId;
    if (showMini && activeTurn == 'player') {
        minimap();
    }
};

function centerMap() {
    // center on selectedBat
    if (selectedBat.id > -1) {
        myTileX = zone[selectedBat.tileId].x;
        myTileY = zone[selectedBat.tileId].y;
        xOffset = myTileX-Math.round(numVTiles/2);
        yOffset = myTileY-Math.round(numHTiles/2);
        limitOffset();
        showMap(zone,true);
        confirmMode();
        if (Object.keys(selectedBat).length >= 1) {
            tileSelect(selectedBat);
        }
        if (Object.keys(targetBat).length >= 1) {
            tileTarget(targetBat);
        }
        selectedTile = selectedBat.tileId;
        if (showMini && activeTurn == 'player') {
            minimap();
        }
    } else {
        centerMapCenter();
    }
};

function centerMapTarget() {
    // center on targetBat
    if (targetBat.id > -1) {
        myTileX = zone[targetBat.tileId].x;
        myTileY = zone[targetBat.tileId].y;
        xOffset = myTileX-Math.round(numVTiles/2);
        yOffset = myTileY-Math.round(numHTiles/2);
        limitOffset();
        showMap(zone,true);
        confirmMode();
        if (Object.keys(selectedBat).length >= 1) {
            tileSelect(selectedBat);
        }
        if (Object.keys(targetBat).length >= 1) {
            tileTarget(targetBat);
        }
        selectedTile = targetBat.tileId;
        if (showMini && activeTurn == 'player') {
            minimap();
        }
    }
};

function centerMapCenter() {
    // center on lander
    myTileX = zone[playerInfos.myCenter].x;
    myTileY = zone[playerInfos.myCenter].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone,true);
    confirmMode();
    selectedTile = playerInfos.myCenter;
    if (showMini && activeTurn == 'player') {
        minimap();
    }
};

function showedTilesReset(keepCenter) {
    if (keepCenter) {
        playerInfos.showedTiles = [1830];
    } else {
        playerInfos.showedTiles = [];
    }
    if (showResOpen) {
        voirRessources();
    }
    showMap(zone,true);
    confirmMode();
    if (showMini) {
        minimap();
    }
};

function toggleMark(tileId,fromBat,batId) {
    if (playerInfos.showedTiles.includes(tileId)) {
        let tagIndex = playerInfos.showedTiles.indexOf(tileId);
        playerInfos.showedTiles.splice(tagIndex,1);
    } else {
        playerInfos.showedTiles.push(tileId);
    }
    showMap(zone,true);
    showTileInfos(tileId);
    if (fromBat) {
        let bat = getBatById(batId);
        showBatInfos(bat);
    }
    if (showMini) {
        minimap();
    }
    confirmMode();
};

function isVisible(tileId) {
    let tileX = zone[tileId].x;
    let tileY = zone[tileId].y;
    let minX = xOffset+1;
    let maxX = xOffset+numVTiles;
    let minY = yOffset+1;
    let maxY = yOffset+numHTiles;
    if (tileX < minX || tileX > maxX || tileY < minY || tileY > maxY) {
        return false;
    } else {
        return true;
    }
};

function findEgg() {
    let eggsToShow = 0;
    let myEgg = {};
    let sortedAliens = _.sortBy(aliens,'tileId');
    sortedAliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            if (bat.type.includes('Oeuf') || bat.type.includes('Coque') || bat.type === 'Cocon' || bat.type === 'Colonie') {
                if (!shownEggs.includes(bat.id) && Object.keys(myEgg).length <= 0) {
                    let isVisible = true;
                    if (bat.tags.includes('invisible')) {
                        isVisible = false;
                    }
                    if (zone[0].dark && !undarkNow.includes(bat.tileId) && !bat.tags.includes('fluo')) {
                        isVisible = checkEggInDark(bat.tileId);
                    }
                    if (isVisible) {
                        eggsToShow = eggsToShow+1;
                        myEgg = bat;
                    }
                }
            }
        }
    });
    if (eggsToShow <= 0) {
        shownEggs = [];
        myEgg = {};
        sortedAliens.forEach(function(bat) {
            if (bat.loc === "zone") {
                if (bat.type.includes('Oeuf') || bat.type.includes('Coque') || bat.type === 'Cocon' || bat.type === 'Colonie') {
                    if (!shownEggs.includes(bat.id) && Object.keys(myEgg).length <= 0) {
                        let isVisible = true;
                        if (bat.tags.includes('invisible')) {
                            isVisible = false;
                        }
                        if (zone[0].dark && !undarkNow.includes(bat.tileId) && !bat.tags.includes('fluo')) {
                            isVisible = checkEggInDark(bat.tileId);
                        }
                        if (isVisible) {
                            eggsToShow = eggsToShow+1;
                            myEgg = bat;
                        }
                    }
                }
            }
        });
    }
    if (Object.keys(myEgg).length >= 1) {
        shownEggs.push(myEgg.id);
        centerMapTo(myEgg.tileId);
    }
    commandes();
};

function checkEggInDark(tileId) {
    let tile = getTileById(tileId);
    let isVisible = true;
    if (playerInfos.vue === 0) {
        isVisible = false;
    } else if (playerInfos.vue === 1) {
        if (tile.seed > 1) {
            isVisible = false;
        }
    } else if (playerInfos.vue === 2) {
        if (tile.seed > 2) {
            isVisible = false;
        }
    } else if (playerInfos.vue === 3) {
        if (tile.seed > 3) {
            isVisible = false;
        }
    } else if (playerInfos.vue === 4) {
        if (tile.seed > 4) {
            isVisible = false;
        }
    } else if (playerInfos.vue >= 5) {
        isVisible = true;
    }
    return isVisible;
};

function planBatDrop(batId) {
    if (selectedTile >= 0) {
        if (playerInfos.showedTiles.includes(selectedTile)) {
            let tile = getTileById(selectedTile);
            if (tile.tileName === undefined) {
                let bat = getBatById(batId);
                let batType = getBatType(bat);
                if (!bat.tags.includes('plan')) {
                    bat.tags.push('plan');
                }
                tile.tileName = getUnitPrintName(batType,false);
                redrawTile(tile.id,false);
                console.log('OK PLAN');
                console.log(tile);
                console.log(batType);
            } else {
                console.log('ALREADY');
            }
        } else {
            console.log('NO MARK');
        }
    } else {
        console.log('NO SELECT');
    }
    planDuCamp();
};

function planDel() {
    if (selectedTile >= 0) {
        if (playerInfos.showedTiles.includes(selectedTile)) {
            let tile = getTileById(selectedTile);
            if (tile.tileName != undefined) {
                planDeplan(tile.tileName);
                delete tile.tileName;
                redrawTile(tile.id,false);
                console.log('OK DEL');
            }
        } else {
            console.log('NO MARK');
        }
    } else {
        console.log('NO SELECT');
    }
    planDuCamp();
};

function planDeplan(unitSmallName) {
    let deplanOK = false;
    bataillons.forEach(function(bat) {
        if (!deplanOK) {
            if (bat.loc === "trans") {
                if (bat.type === unitSmallName) {
                    if (bat.tags.includes('plan')) {
                        tagDelete(bat,'plan');
                        deplanOK = true;
                    }
                } else {
                    let batType = getBatType(bat);
                    if (batType.pName != undefined) {
                        if (batType.pName === unitSmallName) {
                            if (bat.tags.includes('plan')) {
                                tagDelete(bat,'plan');
                                deplanOK = true;
                            }
                        }
                    }
                }
            }
        }
    });
};

function planDuCamp() {
    selectMode();
    modePlan = true;
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","575px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    // $('#tileInfos').empty();
    // $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or">PLAN DU CAMPEMENT</span><br>');
    $('#conUnitList').append('<span class="basicText"><span class="small gf">Cliquez sur un terrain, ensuite cliquez dans cette liste pour définir l\'emplacement voulu pour ce bâtiment</span></span><br>');
    $('#conUnitList').append('<br>');
    let mayDrop = false;
    if (selectedTile >= 0) {
        if (playerInfos.showedTiles.includes(selectedTile)) {
            let tile = getTileById(selectedTile);
            if (tile.tileName === undefined) {
                mayDrop = true;
            } else {
                $('#conUnitList').append('<span class="constName or klik" onclick="planDel()">&#10060; Effacer <span class="jaune">('+tile.tileName+')</span></span><br>');
            }
        } else {
            console.log('NO MARK');
        }
    } else {
        console.log('NO SELECT');
    }
    sortedBats = _.sortBy(_.sortBy(bataillons,'id'),'type');
    sortedBats.forEach(function(bat) {
        if (bat.loc === "trans") {
            let batType = getBatType(bat);
            if (batType.cat === 'buildings' || batType.cat === 'devices') {
                if (bat.tags.includes('plan')) {
                    $('#conUnitList').append('<span class="constName vert">&#9989; '+batType.name+'</span><br>');
                } else {
                    if (mayDrop) {
                        $('#conUnitList').append('<span class="constName gf klik" onclick="planBatDrop('+bat.id+')">&#11036; '+batType.name+'</span><br>');
                    } else {
                        $('#conUnitList').append('<span class="constName gff">&#11035; '+batType.name+'</span><br>');
                    }
                }
            }
        }
    });
    $('#conUnitList').append('<br><br>');
};
