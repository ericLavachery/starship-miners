function minimap() {
    showMini = true;
    $("#minimap").css("display","block");
    $('#themmap').empty();
    $('#thenavig').empty();
    $('#thenavig').append('<span class="constIcon"><i class="fas fa-times-circle klik" onclick="miniOut()"></i></span><br>');
    // $('#minimap').append('<span class="constName klik cy">Fermer</span>');
    $('#thenavig').append('<button type="button" title="Montrer les unités" class="boutonGris miniButtons" onclick="unitsView()"><i class="fas fa-bug"></i></button><br>');
    $('#thenavig').append('<button type="button" title="Montrer les repaires" class="boutonGris miniButtons" onclick="dotsView()"><i class="fas fa-map-pin"></i></button><br>');
    if (showOneRes != 'Toutes') {
        $('#thenavig').append('<button type="button" title="Montrer la ressource recherchée" class="boutonGris miniButtons" onclick="oneResView()"><i class="far fa-gem"></i></button><br>');
    }
    // $('#minimap').append('<div class="shSpace"></div>');
    zone.forEach(function(tile) {
        if (tile.y === 1) {
            $('#themmap').append('<br>');
        }
        if ((tile.id === selectedTile || tile.id === selectedBat.tileId) && miniDots === 'units') {
            $('#themmap').append('<span class="mini mSelect" onclick="centerFromMinimap('+tile.id+')"></span>');
        } else {
            if (visibleAliens.includes(tile.id) && miniDots === 'units') {
                $('#themmap').append('<span class="mini mAlien" onclick="centerFromMinimap('+tile.id+')"></span>');
            } else {
                if (playerOccupiedTiles.includes(tile.id) && miniDots === 'units') {
                    $('#themmap').append('<span class="mini mBoys" onclick="centerFromMinimap('+tile.id+')"></span>');
                } else {
                    if (playerInfos.showedTiles.includes(tile.id) && miniDots === 'points') {
                        $('#themmap').append('<span class="mini mPoints" onclick="centerFromMinimap('+tile.id+')"></span>');
                    } else {
                        if (oneResTileIds.includes(tile.id) && miniDots === 'oneres') {
                            $('#themmap').append('<span class="mini mPoints" onclick="centerFromMinimap('+tile.id+')"></span>');
                        } else {
                            $('#themmap').append('<span class="mini m'+tile.terrain+'" onclick="centerFromMinimap('+tile.id+')"></span>');
                        }
                    }
                }
            }
        }
    });
    $('#themmap').append('<br>');
    // $('#minimap').append('<div class="shSpace"></div>');
};

function checkVisibleAliens() {
    visibleAliens = [];
    let alienType;
    aliens.forEach(function(alien) {
        alienType = getBatType(alien);
        if (alien.loc === "zone" && !alien.tags.includes('invisible') && !alienType.skills.includes('invisible')) {
            visibleAliens.push(alien.tileId);
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
    miniDots = 'units';
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
