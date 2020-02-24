if (!window.location.href.includes('/fight') && !window.location.href.includes('/edit') && !window.location.href.includes('/units')) {
    $(document).keypress(function(e) {
        if (e.which == 178) {
            toggleMode();
        }
        // alert('You pressed '+e.which);
    });
}

// Tracks
socket.on('tracksload', function(tracks) {
    myTracks = tracks;
    myTracks.forEach(function(track) {
        trackedTiles = trackedTiles+track.tiles;
    });
});
// Quand on reçoit la carte, on l'insère dans la page
socket.on('mapload', function(wmap) {
    world = wmap;
    if (!window.location.href.includes('/edit') && !window.location.href.includes('/units')) {
        defineUnhiddenTiles();
        hideHidden();
    }
    if (!window.location.href.includes('/fight') && !window.location.href.includes('/units')) {
        writeMapStyles();
        showMap(wmap);
    }
});
// Dessine la carte
function showMap(wmap) {
    // reset
    $('#zone_map').empty();
    // fill
    let minX = xOffset+1;
    let maxX = xOffset+numVTiles;
    let minY = yOffset+1;
    let maxY = yOffset+numHTiles;
    let visMap = _.filter(wmap, function(tile) {
        return (tile.x >= minX && tile.x <= maxX && tile.y >= minY && tile.y <= maxY);
    });
    let sortedVisMap = _.sortBy(_.sortBy(visMap,'y'),'x');
    let terclass = '';
    let tertitle = '';
    sortedVisMap.forEach(function(tile) {
        if (perso.mapView.includes(tile.id) || mode == 'mapedit') {
            terclass = 'ter'+tile.terrainId+tile.seed;
            if (mode == 'mapedit') {
                let terIndex = ter.findIndex((obj => obj.id == tile.terrainId));
                tertitle = ter[terIndex].name+' ('+tile.seed+') #'+tile.id;
            } else {
                tertitle = '#'+tile.id;
            }
            $('#zone_map').append('<div id="'+tile.id+'" class="grid-item '+terclass+'" onclick="selectOrMove('+tile.id+')" title="'+tertitle+'"><span class="mapCity" id="c'+tile.id+'"></span><span class="mapNoteL" id="l'+tile.id+'"></span><span class="bigIcon" id="b'+tile.id+'"></span><span class="mapNoteR" id="r'+tile.id+'"></span><br><span class="smallIcons" id="s'+tile.id+'"></span><br></div>');
            showTileTags(tile.id);
        } else {
            $('#zone_map').append('<div id="'+tile.id+'" class="grid-item fog" onclick="selectOrMove('+tile.id+')" title="#'+tile.id+'"><span class="bigIcon" id="b'+tile.id+'"></span><br><span class="smallIcons" id="s'+tile.id+'"></span><br></div>');
        }
    });
};
function showTile(tileId,tileTerrainId,tileSeed) {
    if ( $('#'+tileId).hasClass('fog') ) {
        $('#'+tileId).removeClass('fog').addClass('ter'+tileTerrainId+tileSeed);
    }
    $('#'+tileId).empty().append('<span class="mapCity" id="c'+tileId+'"></span><span class="mapNoteL" id="l'+tileId+'"></span><span class="bigIcon" id="b'+tileId+'"></span><span class="mapNoteR" id="r'+tileId+'"></span><br><span class="smallIcons" id="s'+tileId+'"></span><br>');
    showTileTags(tileId);
};
function showTileTags(tileId) {
    $('#r'+tileId).empty();
    $('#l'+tileId).empty();
    $('#c'+tileId).empty();
    let tileIndex = world.findIndex((obj => obj.id == tileId));
    let tileFlags = world[tileIndex].flags;
    let tileTerrainId = world[tileIndex].terrainId;
    let terrainIndex = ter.findIndex((obj => obj.id == tileTerrainId));
    let tempMax = ter[terrainIndex].tempMax;
    if (perso.mapCarto.includes(tileId)) {
        $('#r'+tileId).append('<i class="far fa-map karto"></i>');
    }
    if (selectedTrack.id >= 1) {
        if (selectedTrack.tiles.includes('_'+tileId+'_')) {
            $('#r'+tileId).append('<i class="fas fa-arrows-alt-v karto"></i>');
        }
    } else {
        if (showTracks && trackedTiles.includes('_'+tileId+'_')) {
            $('#r'+tileId).append('<i class="fas fa-arrows-alt-v karto"></i>');
        }
    }

    if (tileFlags.includes('road_')) {
        $('#l'+tileId).append('<i class="fas fa-grip-vertical road"></i>');
    }
    if (tileFlags.includes('river_') && tileFlags.includes('road_')) {
        $('#l'+tileId).append('<br>');
    }
    if (tileFlags.includes('river_')) {
        $('#l'+tileId).append('<i class="fas fa-water river"></i>');
    }
    if (tileFlags.includes('city_')) {
        townImg = cityImg(tileFlags,'c',tempMax);
        $('#c'+tileId).append('<img src="/static/img/cities/'+townImg+'.png" width="54">');
    } else if (tileFlags.includes('village_')) {
        townImg = cityImg(tileFlags,'v',tempMax);
        $('#c'+tileId).append('<img src="/static/img/cities/'+townImg+'.png" width="54">');
    }
    let shad = ter[terrainIndex].shad;
    if (shad != '') {
        $('#r'+tileId).addClass(shad);
        $('#l'+tileId).addClass(shad);
    }
};
function cityImg(tileFlags,townType,tempMax) {
    let townImg = '';
    if (tileFlags.includes('orc_')) {
        townImg = 'orc-'+townType;
        if (tempMax < 18) {townImg = townImg+'s';}
    } else if (tileFlags.includes('trog_')) {
        townImg = 'trog-'+townType;
    } else if (tileFlags.includes('barb_')) {
        townImg = 'barb-'+townType;
        if (tempMax < 18) {townImg = townImg+'s';}
    } else if (tileFlags.includes('cult_')) {
        townImg = 'cult-'+townType;
    } else if (tileFlags.includes('desert_')) {
        townImg = 'desert-'+townType;
    } else if (tileFlags.includes('nomad_')) {
        townImg = 'nomad-'+townType;
    } else if (tileFlags.includes('dwarf_')) {
        townImg = 'dwarf-'+townType;
    } else if (tileFlags.includes('gond_')) {
        townImg = 'gond-'+townType;
        if (tempMax < 18) {townImg = townImg+'s';}
    } else if (tileFlags.includes('mahoud_')) {
        townImg = 'mahoud-'+townType;
    } else if (tileFlags.includes('roh_')) {
        townImg = 'roh-'+townType;
        if (tempMax < 18) {townImg = townImg+'s';}
    } else {
        townImg = 'roh-'+townType;
        if (tempMax < 18) {townImg = townImg+'s';}
    }
    return townImg;
};
// infos terrains
socket.on('terload', function(wter) {
    ter = wter;
    if (!window.location.href.includes('/fight') && !window.location.href.includes('/units')) {
        writeTerStyles(wter);
    }
});
// infos villes
socket.on('cityload', function(wtown) {
    towns = wtown;
});
// write 3!! classes per terrain type to CSS
function writeTerStyles(wter) {
    let bg = '';
    let bg2 = '';
    let bg3 = '';
    $('#terStyles').empty();
    wter.forEach(function(terrain) {
        if (terrain.icon != '') {
            bg = ' background-image: url(/static/img/wtiles/'+terrain.icon+'.png);';
            bg2 = ' background-image: url(/static/img/wtiles/'+terrain.icon+'2.png);';
            bg3 = ' background-image: url(/static/img/wtiles/'+terrain.icon+'3.png);';
        } else {
            bg = '';
            bg2 = '';
            bg3 = '';
        }
        $('#terStyles').append('.ter'+terrain.id+'a {background-color: #FFFF00;'+bg+'}');
        $('#terStyles').append('.ter'+terrain.id+'b {background-color: #FFFF00;'+bg2+'}');
        $('#terStyles').append('.ter'+terrain.id+'c {background-color: #FFFF00;'+bg3+'}');
    });
};
function yourMapSize() {
    numHTiles = Number(prompt('Nombre de terrains vus horizontalement (x)',15));
    numVTiles = Number(prompt('Nombre de terrains vus horizontalement (y)',9));
    // change la position des images en hover
    // let unitML = (numHTiles*72)-330;
    // let biomeML = (numHTiles*72)-650;
    // $(".infoUnit span").css({marginLeft : unitML+'px'});
    // $(".infoBiome span").css({marginLeft : biomeML+'px'});
    // sauvegarde les prefs
    let numTiles = {h:numHTiles,v:numVTiles};
    perso.prefs.numTiles = numTiles;
    emitPlayersChange(perso);
    // redessine la carte
    writeMapStyles();
    showMap(world);
    showVisiblePop(world);
};
function writeMapStyles() {
    $('#mapStyles').empty();
    $('#mapStyles').append('.grid-container {grid-template-columns:');
    let i = 0;
    while (i < numHTiles) {
        $('#mapStyles').append(' 72px');
        i++;
    }
    $('#mapStyles').append(';grid-template-rows:');
    i = 0;
    while (i < numVTiles) {
        $('#mapStyles').append(' 72px');
        i++;
    }
    $('#mapStyles').append(';}');
};
// infos persos
socket.on('persoload', function(wperso) {
    perso = wperso;
    if (typeof perso.prefs.detail != 'undefined') {
        expSquadDetail = perso.prefs.detail.squad;
        expTileDetail = perso.prefs.detail.tile;
    }
    if (typeof perso.prefs.numTiles != 'undefined') {
        numHTiles = perso.prefs.numTiles.h;
        numVTiles = perso.prefs.numTiles.v;
    }
    if (xOffsetForced == 0 && yOffsetForced == 0) {
        if (typeof perso.prefs.offset != 'undefined') {
            xOffset = perso.prefs.offset.x;
            yOffset = perso.prefs.offset.y;
        }
    }
    if (perso.bldIdent === null) {
        perso.bldIdent = [];
    }
    if (perso.bldView === null) {
        perso.bldView = [];
    }
    if (perso.unitView === null) {
        perso.unitView = [];
    }
    if (perso.unitIdent === null) {
        perso.unitIdent = [];
    }
    if (perso.mapView === null) {
        perso.mapView = [];
    }
    if (perso.mapCarto === null) {
        perso.mapCarto = [];
    }
    if (perso.exploredTiles === null) {
        perso.exploredTiles = [];
    }
    if (perso.enemies === null) {
        perso.enemies = [];
    }
    if (perso.allies === null) {
        perso.allies = [];
    }
    if (perso.prefs === null) {
        perso.prefs = {};
    }
});

// Affichage des unités
socket.on('popload', function(wpop) {
    pop = wpop;
    if (!window.location.href.includes('/fight') && !window.location.href.includes('/units')) {
        showVisiblePop(world);
        loadGroups(wpop);
        if (window.location.href.includes('/edit')) {
            mapeditMode();
        } else {
            inspectMode();
        }
        areaSelector();
        showOccupiedTiles();
    }
});
function showVisiblePop(wmap) {
    wmap.forEach(function(tile) {
        drawTileDefaultUnit(tile.id)
    });
    if (selectedUnit.id >= 1) {
        selectUnit(selectedUnit.id);
    }
};
// infos groupes
function loadGroups(wpop) {
    let lastTileId = 0;
    let lastGroupNum = 0;
    let lastGroupCreated = 0;
    let newGroup = {};
    let sortedPop = _.sortBy(_.sortBy(wpop,'tileId'),'follow');
    sortedPop.forEach(function(unit) {
        if (unit.follow >= 1 && unit.player === pseudo) {
            if (lastTileId == unit.tileId && lastGroupNum == unit.follow && lastGroupCreated != unit.follow) {
                newGroup = {number: unit.follow, type: 'group'};
                mygroups.push(newGroup);
                lastGroupCreated = unit.follow;
            }
            lastGroupNum = unit.follow;
            lastTileId = unit.tileId;
        }
    });
};

// Ressources
socket.on('ressload', function(ressources) {
    ress = ressources;
});

// FIGHT START
socket.on('fightload', function(fight) {
    if (window.location.href.includes('/fight')) {
        fightInit();
    }
});

// UNITS TABLES START
socket.on('unitsCRUDload', function(uTypes) {
    if (window.location.href.includes('/units')) {
        unitTypes = uTypes;
        baseFields();
        tableShowById('id',100);
        // unitsCRUD();
    }
});
socket.on('skillsload', function(skillz) {
    if (window.location.href.includes('/units')) {
        skills = skillz;
    }
});
socket.on('categsload', function(categz) {
    if (window.location.href.includes('/units')) {
        categs = categz;
    }
});
// socket.on('unitsimgload', function(files) {
//     if (window.location.href.includes('/units')) {
//         unitsImg = files;
//     }
// });
