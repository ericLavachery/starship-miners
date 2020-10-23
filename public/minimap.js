function minimap() {
    showMini = true;
    if (allZoneRes.length === 0) {
        checkRes = true;
    } else {
        checkRes = false;
    }
    $("#minimap").css("display","block");
    $('#themmap').empty();
    $('#thenavig').empty();
    $('#thenavig').append('<span class="constIcon"><i class="fas fa-times-circle klik" onclick="miniOut()"></i></span><br>');
    $('#thenavig').append('<button type="button" title="Montrer les unités" class="boutonGris miniButtons" onclick="unitsView()"><i class="fas fa-bug"></i></button><br>');
    $('#thenavig').append('<button type="button" title="Montrer les oeufs" class="boutonGris miniButtons" onclick="eggsView()"><i class="fas fa-meteor"></i></button><br>');
    $('#thenavig').append('<button type="button" title="Montrer les repaires" class="boutonGris miniButtons" onclick="dotsView()"><i class="fas fa-map-pin"></i></button><br>');
    if (showOneRes != 'Toutes') {
        $('#thenavig').append('<button type="button" title="Montrer la ressource recherchée" class="boutonGris miniButtons" onclick="oneResView()"><i class="far fa-gem"></i></button><br>');
    }
    let alienView;
    zone.forEach(function(tile) {
        if (playerInfos.dark) {
            if (undarkNow.includes(tile.id)) {
                alienView = true;
            } else {
                alienView = false;
            }
        } else {
            alienView = true;
        }
        if (tile.y === 1) {
            $('#themmap').append('<br>');
        }
        if ((tile.id === selectedTile || tile.id === selectedBat.tileId) && (miniDots === 'units' || miniDots === 'eggs')) {
            $('#themmap').append('<span class="mini mSelect" onclick="centerFromMinimap('+tile.id+')"></span>');
        } else {
            if (visibleEggs.includes(tile.id) && miniDots === 'eggs' && alienView) {
                $('#themmap').append('<span class="mini mAlien" onclick="centerFromMinimap('+tile.id+')"></span>');
            } else {
                if (visibleAliens.includes(tile.id) && miniDots === 'units' && alienView) {
                    $('#themmap').append('<span class="mini mAlien" onclick="centerFromMinimap('+tile.id+')"></span>');
                } else {
                    if (playerOccupiedTiles.includes(tile.id) && (miniDots === 'units' || miniDots === 'eggs')) {
                        $('#themmap').append('<span class="mini mBoys" onclick="centerFromMinimap('+tile.id+')"></span>');
                    } else {
                        if (playerInfos.showedTiles.includes(tile.id) && miniDots === 'points') {
                            $('#themmap').append('<span class="mini mPoints" onclick="centerFromMinimap('+tile.id+')"></span>');
                        } else {
                            if (oneResTileIds.includes(tile.id) && miniDots === 'oneres') {
                                $('#themmap').append('<span class="mini mPoints" onclick="centerFromMinimap('+tile.id+')"></span>');
                            } else {
                                if (playerInfos.dark) {
                                    if (undarkNow.includes(tile.id)) {
                                        $('#themmap').append('<span class="mini m'+tile.terrain+'" onclick="centerFromMinimap('+tile.id+')"></span>');
                                    } else if (playerInfos.undarkOnce.includes(tile.id)) {
                                        $('#themmap').append('<span class="mini m'+tile.terrain+'" onclick="centerFromMinimap('+tile.id+')"></span>');
                                    } else {
                                        $('#themmap').append('<span class="mini mDark" onclick="centerFromMinimap('+tile.id+')"></span>');
                                    }
                                } else {
                                    $('#themmap').append('<span class="mini m'+tile.terrain+'" onclick="centerFromMinimap('+tile.id+')"></span>');
                                }
                            }
                        }
                    }
                }
            }
        }
        if (tile.rq >= 0 && checkRes) {
            addZoneRes(tile.rs);
        }
    });
    $('#themmap').append('<br>');
    if (checkRes) {
        console.log(allZoneRes);
    }
};

function updateAliensNum() {
    checkVisibleAliens();
    commandes();
}

function checkVisibleAliens() {
    visibleAliens = [];
    visibleEggs = [];
    aliensNum = 0;
    let alienType;
    aliens.forEach(function(alien) {
        if (alien.loc === "zone") {
            alienType = getBatType(alien);
            if ((!alien.tags.includes('invisible') && !alienType.skills.includes('invisible')) || playerInfos.skills.includes('det5')) {
                visibleAliens.push(alien.tileId);
                aliensNum++;
                if (alienType.skills.includes('isegg') && !alien.tags.includes('invisible') && !alienType.skills.includes('invisible')) {
                    visibleEggs.push(alien.tileId);
                }
            }
        }
    });
};

function dotsView() {
    miniDots = 'points';
    minimap();
};

function oneResView() {
    miniDots = 'oneres';
    minimap();
    voirRessources();
};

function unitsView() {
    checkVisibleAliens();
    playerOccupiedTileList();
    miniDots = 'units';
    minimap();
};

function eggsView() {
    checkVisibleAliens();
    playerOccupiedTileList();
    miniDots = 'eggs';
    minimap();
};

function miniOut() {
    $('#themmap').empty();
    $('#thenavig').empty();
    $("#minimap").css("display","none");
    showMini = false;
};

function centerFromMinimap(tileId) {
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    myTileX = zone[tileId].x;
    myTileY = zone[tileId].y;
    xOffset = myTileX-Math.round(numVTiles/2);
    yOffset = myTileY-Math.round(numHTiles/2);
    limitOffset();
    showMap(zone,true);
    confirmMode();
    selectedTile = tileId;
    minimap();
};
