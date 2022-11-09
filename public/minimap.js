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
    $('#radar_effect').empty();
    $('#radar_effect').append('<span><img src="/static/img/radar.png"></span>');
    $('#thenavig').append('<span class="constIcon"><i class="fas fa-times-circle klik" onclick="miniOut()"></i></span><br>');
    if (!modeSonde) {
        if (miniDots === 'units') {
            $('#thenavig').append('<button type="button" title="Montrer les unités" class="boutonMauve miniButtons" onclick="unitsView()"><i class="fas fa-bug"></i></button><br>');
        } else {
            $('#thenavig').append('<button type="button" title="Montrer les unités" class="boutonGris miniButtons" onclick="unitsView()"><i class="fas fa-bug"></i></button><br>');
        }
        if (miniDots === 'eggs') {
            $('#thenavig').append('<button type="button" title="Montrer les oeufs" class="boutonMauve miniButtons" onclick="eggsView()"><i class="fas fa-meteor"></i></button><br>');
        } else {
            $('#thenavig').append('<button type="button" title="Montrer les oeufs" class="boutonGris miniButtons" onclick="eggsView()"><i class="fas fa-meteor"></i></button><br>');
        }
    }
    if (miniDots === 'points') {
        $('#thenavig').append('<button type="button" title="Montrer les repaires" class="boutonMauve miniButtons" onclick="dotsView()"><i class="fas fa-map-pin"></i></button><br>');
    } else {
        $('#thenavig').append('<button type="button" title="Montrer les repaires" class="boutonGris miniButtons" onclick="dotsView()"><i class="fas fa-map-pin"></i></button><br>');
    }
    if (miniDots === 'ruins') {
        $('#thenavig').append('<button type="button" title="Montrer les ruines non fouillées" class="boutonMauve miniButtons" onclick="ruinsView()"><i class="fas fa-city"></i></button><br>');
    } else {
        $('#thenavig').append('<button type="button" title="Montrer les ruines non fouillées" class="boutonGris miniButtons" onclick="ruinsView()"><i class="fas fa-city"></i></button><br>');
    }
    if (!modeSonde) {
        if (miniDots === 'coffres') {
            $('#thenavig').append('<button type="button" title="Montrer les coffres" class="boutonMauve miniButtons" onclick="coffresView()"><i class="fas fa-box-open"></i></button><br>');
        } else {
            $('#thenavig').append('<button type="button" title="Montrer les coffres" class="boutonGris miniButtons" onclick="coffresView()"><i class="fas fa-box-open"></i></button><br>');
        }
    }
    if (showOneRes != 'Toutes') {
        if (miniDots === 'oneres') {
            $('#thenavig').append('<button type="button" title="Montrer la ressource recherchée" class="boutonMauve miniButtons" onclick="oneResView()"><i class="far fa-gem"></i></button><br>');
        } else {
            $('#thenavig').append('<button type="button" title="Montrer la ressource recherchée" class="boutonGris miniButtons" onclick="oneResView()"><i class="far fa-gem"></i></button><br>');
        }
    } else {
        $('#thenavig').append('<button type="button" title="Montrer les ressources" class="boutonGris miniButtons" onclick="oneResView()"><i class="far fa-gem"></i></button><br>');
    }
    $('#thenavig').append('<button type="button" title="Afficher la liste des bataillons" class="boutonGris miniButtons" onclick="voirBataillons()"><i class="fas fa-user-astronaut"></i></button><br>');
    let tousLesCoffres = [];
    if (miniDots === 'coffres') {
        bataillons.forEach(function(bat) {
            if (bat.type === 'Coffres') {
                tousLesCoffres.push(bat.tileId);
            }
        });
    }
    let ccom = false;
    if (playerInfos.bldList.includes('Centre de com') || playerInfos.bldVM.includes('Centre de com')) {
        ccom = true;
    }
    let alienView;
    let sondeViewDistance = Math.ceil((playerInfos.comp.vsp+3)*(playerInfos.comp.det+8)/8);
    if (!modeSonde) {
        sondeViewDistance = 3;
    }
    zone.forEach(function(tile) {
        if (zone[0].dark) {
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
        if (miniDots === 'ruins' && tile.ruins && tile.sh >= 0) {
            $('#themmap').append('<span class="mini mPoints" onclick="centerFromMinimap('+tile.id+')"></span>');
        } else if (miniDots === 'coffres' && tousLesCoffres.includes(tile.id)) {
            $('#themmap').append('<span class="mini mPoints" onclick="centerFromMinimap('+tile.id+')"></span>');
        } else {
            if (tile.id === selectedBat.tileId && (miniDots === 'units' || miniDots === 'eggs')) {
                $('#themmap').append('<span class="mini mSelect" onclick="centerFromMinimap('+tile.id+')"></span>');
            } else {
                if (visibleEggs.includes(tile.id) && miniDots === 'eggs' && alienView) {
                    $('#themmap').append('<span class="mini mEgg" onclick="centerFromMinimap('+tile.id+')"></span>');
                } else {
                    if (visibleHunts.includes(tile.id) && miniDots === 'units' && alienView) {
                        $('#themmap').append('<span class="mini mHunt" onclick="centerFromMinimap('+tile.id+')"></span>');
                    } else if (visibleAliens.includes(tile.id) && miniDots === 'units' && alienView) {
                        if (visibleEggs.includes(tile.id) && alienView) {
                            $('#themmap').append('<span class="mini mEgg" onclick="centerFromMinimap('+tile.id+')"></span>');
                        } else {
                            $('#themmap').append('<span class="mini mAlien" onclick="centerFromMinimap('+tile.id+')"></span>');
                        }
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
                                    if (viewBorders.includes(tile.id)) {
                                        $('#themmap').append('<span class="mini mBord" onclick="centerFromMinimap('+tile.id+')"></span>');
                                    } else {
                                        if (zone[0].dark) {
                                            let distance = calcDistance(tile.id,1830);
                                            if (distance <= sondeViewDistance) {
                                                $('#themmap').append('<span class="mini m'+tile.terrain+'" onclick="centerFromMinimap('+tile.id+')"></span>');
                                            } else {
                                                if (undarkNow.includes(tile.id)) {
                                                    $('#themmap').append('<span class="mini m'+tile.terrain+'" onclick="centerFromMinimap('+tile.id+')"></span>');
                                                } else if (zone[0].undarkOnce.includes(tile.id) || zone[0].undarkAll) {
                                                    if (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain === 'L') {
                                                        $('#themmap').append('<span class="mini mDarkWater" onclick="centerFromMinimap('+tile.id+')"></span>');
                                                    } else {
                                                        if (tile.terrain === 'M') {
                                                            $('#themmap').append('<span class="mini mDarkMount" onclick="centerFromMinimap('+tile.id+')"></span>');
                                                        } else {
                                                            $('#themmap').append('<span class="mini mDark" onclick="centerFromMinimap('+tile.id+')"></span>');
                                                        }
                                                    }
                                                } else {
                                                    if (ccom) {
                                                        if (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain === 'L') {
                                                            $('#themmap').append('<span class="mini mDarkWater" onclick="centerFromMinimap('+tile.id+')"></span>');
                                                        } else {
                                                            if (playerInfos.comp.det >= 3 && tile.terrain === 'M') {
                                                                $('#themmap').append('<span class="mini mDarkMount" onclick="centerFromMinimap('+tile.id+')"></span>');
                                                            } else {
                                                                $('#themmap').append('<span class="mini mDark" onclick="centerFromMinimap('+tile.id+')"></span>');
                                                            }
                                                        }
                                                    } else {
                                                        $('#themmap').append('<span class="mini mDark" onclick="centerFromMinimap('+tile.id+')"></span>');
                                                    }
                                                }
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
            }
        }
        if (tile.rq >= 0 && checkRes) {
            addZoneRes(tile.rs);
            if (playerInfos.showedTiles.includes(tile.id)) {
                addCheckedZoneRes(tile.rs);
            }
        }
    });
    $('#themmap').append('<br>');
    if (checkRes) {
        // console.log('Ressources présentes');
        // console.log(allZoneRes);
    }
};

function updateAliensNum() {
    checkVisibleAliens();
    commandes();
}

function checkVisibleAliens() {
    visibleAliens = [];
    visibleEggs = [];
    visibleHunts = [];
    aliensNum = 0;
    let alienType;
    aliens.forEach(function(alien) {
        if (alien.loc === "zone") {
            alienType = getBatType(alien);
            if ((!alien.tags.includes('invisible') && !alienType.skills.includes('invisible')) || playerInfos.vue >= 5) {
                if (alienType.kind === 'game') {
                    visibleHunts.push(alien.tileId);
                } else {
                    visibleAliens.push(alien.tileId);
                    aliensNum++;
                    if (alienType.skills.includes('isegg') && !alien.tags.includes('invisible') && !alienType.skills.includes('invisible')) {
                        visibleEggs.push(alien.tileId);
                    }
                }
            }
        }
    });
};

function dotsView() {
    miniDots = 'points';
    minimap();
};

function coffresView() {
    miniDots = 'coffres';
    minimap();
};

function ruinsView() {
    miniDots = 'ruins';
    minimap();
};

function oneResView() {
    miniDots = 'oneres';
    minimap();
    voirRessources();
};

function resView() {
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
    $('#radar_effect').empty();
    showMini = false;
};

function centerFromMinimap(tileId) {
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
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
