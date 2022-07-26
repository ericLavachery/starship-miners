function mapEditWindow() {
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<h1>MAP EDITOR</h1><br>');
    $('#conUnitList').append('<br>');
    // Terrains
    let mbClass = 'mapedBut';
    if (mped.ster === undefined && mped.sinf === '') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/sntiles/V_005.png" width="64" title="Changer l\'image sans changer le terrain" onclick="selectTerrain()">');
    terrainTypes.forEach(function(terrain) {
        if (terrain.name != 'V' && terrain.name != 'X') {
            mbClass = 'mapedBut';
            if (mped.ster === terrain.name && mped.sinf === '') {mbClass = 'mapedButSel';}
            let tPic = terrain.name+'_004';
            if (terrain.name === 'R') {
                tPic = terrain.name+'_002';
            }
            $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/sntiles/'+tPic+'.png" width="64" title="'+terrain.fullName+'" onclick="selectTerrain(`'+terrain.name+'`)">');
        }
    });
    mbClass = 'mapedBut';
    if (mped.ster === 'Z' && mped.sinf === '') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/sntiles/R_004.png" width="64" title="Gué" onclick="selectTerrain(`Z`)">');
    $('#conUnitList').append('<br>');
    // Infra
    armorTypes.forEach(function(infra) {
        if (infra.cat === 'infra') {
            selectStuff(infra.name,infra.pic,infra.name);
        }
    });
    selectStuff('Ruines','ruins','Ruines');
    selectStuff('Ruines vides','ruinsf','Ruines vides');
    selectStuff('Route','roads','Route (ou Pont)');
    // Ressources 
    selectStuff('Res','res','Mettre des ressources');
    selectStuff('RareRes','rareres','Mettre des ressources rares');
    selectStuff('NoRes','nores','Supprimer les ressources');
    // Tags
    selectStuff('Garde','alienPDM','Garde alien (va rester dans le périmètre)');
    selectStuff('NoMove','batNoMove','Bataillon immobilisé');
    selectStuff('Outsider','batOutsider','Bataillon outsider');
    selectStuff('Bleed','bleed','Blesser le bataillon');
    // Landing
    selectStuff('Lander','lander','Point d\'aterrissage lander (ou navette)');
    selectStuff('Navette','navette','Point d\'aterrissage navette seulemment');
    // End
    $('#conUnitList').append('<br><br>');
    if (mped.sinf === 'RareRes' || mped.sinf === 'Res') {
        mapResAddList();
        $('#conUnitList').append('<br><br>');
    } else {
        theTileRes = {};
    }
    mpedOption('cLand','Aterrissage au centre possible également','Landing centre','Aterrissage uniquement aux points marqués','Landing points');
    mpedOption('neverMove','Les bataillons avec un tag nomove peuvent également bouger dès qu\'un bâtiment (avec un tag nomove) est détruit','Tag nomove normal','Les bataillons avec un tag nomove ne peuvent bouger que si ils sont rejoints','Never move');
    mpedOption('noEggs','Aucun oeuf ne tombe','Sans Oeufs','Des oeufs tombent','Avec Oeufs');
    mpedOption('coverEggs','Les oeufs tombent normalement','Oeufs partout','Les oeufs tombent toujours à couvert (près d\'une ruche, volcan ou colonie)','Oeufs à couvert');
    $('#conUnitList').append('<span class="constName"><span class="gf">Zone spéciale?</span> : <span class="cy klik" onclick="zoneTypeToggle(`'+zoneInfos.type+'`)" title="Changer le type de zone">'+zoneInfos.type+'</span></span><br>');
    if (zoneInfos.type === 'normal') {
        eggsByTerrain('plaines',zone[0].pKind);
        eggsByTerrain('prairies',zone[0].gKind);
        eggsByTerrain('marécages',zone[0].sKind);
    }
    $('#conUnitList').append('<br><br>');
};

function selectStuff(stuff,stuffImg,stuffDef) {
    let mbClass = 'mapedBut';
    if (mped.sinf === stuff) {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/'+stuffImg+'.png" title="'+stuffDef+'" onclick="selectInfra(`'+stuff+'`)">');
};

function zoneTypeToggle(theZoneType) {
    if (theZoneType === 'normal') {
        // leech
        zone[3].seed = 1;
        zone[4].seed = 2;
    } else if (theZoneType === 'leech') {
        // flies
        zone[3].seed = 2;
        zone[4].seed = 1;
    } else if (theZoneType === 'flies') {
        // ants
        zone[3].seed = 3;
        zone[4].seed = 2;
    } else if (theZoneType === 'ants') {
        // roaches
        zone[3].seed = 4
        zone[4].seed = 3;
    } else if (theZoneType === 'roaches') {
        // spinne
        zone[3].seed = 5;
        zone[4].seed = 1;
    } else if (theZoneType === 'spinne') {
        // bigbugs
        zone[3].seed = 6;
        zone[4].seed = 2;
    } else if (theZoneType === 'bigbugs') {
        // normal
        zone[4].seed = 6;
    }
    checkZoneType();
    mapEditWindow();
};

function eggsByTerrain(myTer,eggType) {
    $('#conUnitList').append('<span class="constName"><span class="gf">Oeufs dans les '+myTer+'</span> : <span class="cy klik" onclick="xKindToggle(`'+myTer+'`,`'+eggType+'`)" title="Changer le type d\'oeuf sur ce terrain">'+eggType+'</span></span><br>');
};

function xKindToggle(myTer,eggType) {
    let newEggType;
    let xKind;
    if (myTer === 'plaines') {
        xKind = 'pKind';
    } else if (myTer === 'prairies') {
        xKind = 'gKind';
    } else if (myTer === 'marécages') {
        xKind = 'sKind';
    }
    if (eggType === 'bug') {
        newEggType = 'spider';
    } else if (eggType === 'spider') {
        newEggType = 'swarm';
    } else if (eggType === 'swarm') {
        newEggType = 'larve';
    } else if (eggType === 'larve') {
        newEggType = 'bug';
    }
    zone[0][xKind] = newEggType;
    mapEditWindow();
};

function mpedOption(champ,defFalse,linkFalse,defTrue,linkTrue) {
    if (zone[0][champ] === undefined) {
        $('#conUnitList').append('<span class="constName"><span class="gf klik" onclick="zoneChange(`'+champ+'`,false)" title="'+defTrue+'">'+linkTrue+'</span> &nbsp;|&nbsp; <span class="gf klik" onclick="zoneChange(`'+champ+'`,true)" title="'+defFalse+'">'+linkFalse+'</span></span><br>');
    } else if (zone[0][champ]) {
        $('#conUnitList').append('<span class="constName"><span class="gf klik" onclick="zoneChange(`'+champ+'`,false)" title="'+defTrue+'">'+linkTrue+'</span> &nbsp;|&nbsp; <span class="cy klik" onclick="zoneChange(`'+champ+'`,true)" title="'+defFalse+'">'+linkFalse+'</span></span><br>');
    } else if (!zone[0][champ]) {
        $('#conUnitList').append('<span class="constName"><span class="cy klik" onclick="zoneChange(`'+champ+'`,false)" title="'+defTrue+'">'+linkTrue+'</span> &nbsp;|&nbsp; <span class="gf klik" onclick="zoneChange(`'+champ+'`,true)" title="'+defFalse+'">'+linkFalse+'</span></span><br>');
    }
};

function zoneChange(champ,valeur) {
    zone[0][champ] = valeur;
    mapEditWindow();
};

function mapResAddList() {
    let sortedResTypes = _.sortBy(resTypes,'name');
    sortedResTypes.forEach(function(res) {
        if (res.cat === 'white' || (res.cat.includes('sky') && mped.sinf === 'RareRes')) {
            let resIcon = getResIcon(res);
            let dispoRes = theTileRes[res.name];
            if (dispoRes === undefined) {
                dispoRes = 0;
            }
            if (dispoRes < 0) {
                dispoRes = 0;
            }
            $('#conUnitList').append('<span class="paramResName klik" onclick="mapResAdd(`'+res.name+'`)">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="cy">'+dispoRes+'</span></span>');
        }
    });
    console.log(theTileRes);
};

function clickEdit(tileId) {
    let tile = zone[tileId];
    if (mped.sinf != '') {
        if (mped.sinf === 'Ruines vides') {
            if (!tile.ruins) {
                tile.ruins = true;
                tile.sh = -1;
                tile.rd = true;
                delete tile.infra;
                addScrapToRuins(tile);
            } else {
                delete tile.ruins;
                delete tile.sh;
                delete tile.rd;
            }
        } else if (mped.sinf === 'Ruines') {
            if (!tile.ruins) {
                tile.ruins = true;
                tile.sh = 20;
                tile.rd = true;
                delete tile.infra;
                addScrapToRuins(tile);
            } else {
                delete tile.ruins;
                delete tile.sh;
                delete tile.rd;
            }
        } else if (mped.sinf === 'Route') {
            if (!tile.rd) {
                tile.rd = true;
            } else {
                delete tile.rd;
            }
        } else if (mped.sinf === 'Res') {
            addResToTile(tile);
            atomColour(tile,true);
            // tile.rq = 3;
        } else if (mped.sinf === 'RareRes') {
            addResToTile(tile);
            atomColour(tile,true);
            // tile.rq = 5;
        } else if (mped.sinf === 'NoRes') {
            delete tile.rq;
            delete tile.rs;
        } else if (mped.sinf === 'Garde') {
            fixAlienPDM(tile);
        } else if (mped.sinf === 'NoMove') {
            addTagToBatOnTile(tile,'nomove');
        } else if (mped.sinf === 'Outsider') {
            addTagToBatOnTile(tile,'outsider');
        } else if (mped.sinf === 'Bleed') {
            bleedBat(tile);
        } else if (mped.sinf === 'Lander') {
            if (tile.land === undefined) {
                tile.land = true;
                if (tile.nav != undefined) {
                    delete tile.nav;
                }
            } else {
                delete tile.land;
            }
        } else if (mped.sinf === 'Navette') {
            if (tile.nav === undefined) {
                tile.nav = true;
                if (tile.land != undefined) {
                    delete tile.land;
                }
            } else {
                delete tile.nav;
            }
        } else {
            if (tile.infra != mped.sinf) {
                tile.infra = mped.sinf;
                delete tile.ruins;
                delete tile.sh;
            } else {
                delete tile.infra;
            }
        }
    } else {
        if (mped.ster != undefined) {
            if (mped.ster === 'R') {
                tile.terrain = mped.ster;
                if (tile.seed > 3) {
                    tile.seed = tile.seed-3;
                }
            } else if (mped.ster === 'Z') {
                tile.terrain = 'R';
                if (tile.seed < 4) {
                    tile.seed = tile.seed+3;
                }
            } else {
                tile.terrain = mped.ster;
            }
        }
        if (!mped.as) {
            let nextSeed = getNextSeed(tile);
            tile.seed = nextSeed;
        }
    }
    zone[0].edited = true;
    mapEditWindow();
    showMap(zone,true);
    cursorSwitch('.','grid-item','copy');
};

function bleedBat(tile) {
    let bat = getBatByTileId(tile.id);
    let batType = getBatType(bat);
    if (bat.squadsLeft > 1) {
        bat.squadsLeft = bat.squadsLeft-1;
    } else if (bat.squadsLeft < batType.squads) {
        bat.squadsLeft = batType.squads;
    }
};

function fixAlienPDM(tile) {
    let alien = getAlienByTileId(tile.id);
    if (alien.pdm === undefined) {
        alien.pdm = tile.id;
    } else {
        delete alien.pdm;
    }
};

function addTagToBatOnTile(tile,tag) {
    let bat = getBatByTileId(tile.id);
    if (!bat.tags.includes(tag)) {
        bat.tags.push(tag);
    } else {
        tagDelete(bat,tag);
    }
};

function mapResAdd(resName) {
    let letsAdd = rand.rand(35,65);
    if (theTileRes[resName] === undefined) {
        theTileRes[resName] = letsAdd;
    } else {
        theTileRes[resName] = theTileRes[resName]+letsAdd;
    }
    // mapResAddList();
    mapEditWindow();
};

function selectTerrain(terName) {
    mped.ster = terName;
    mped.sinf = '';
    cursorSwitch('.','grid-item','copy');
    mapEditWindow();
};

function selectInfra(infraName) {
    mped.sinf = infraName;
    delete mped.ster;
    cursorSwitch('.','grid-item','copy');
    mapEditWindow();
};

function addScrapToRuins(tile) {
    if (tile.rq === undefined) {
        tile.rq = 0;
        let sq = rand.rand(250,500);
        tile.rs = {};
        tile.rs['Scrap'] = sq;
    }
};

function addResToTile(tile) {
    if (tile.rs === undefined) {
        if (Object.keys(theTileRes).length === 0) {
            tile.rs = {};
            let resName = checkSimpleRes();
            tile.rs[resName] = rand.rand(75,400);
        } else {
            tile.rs = theTileRes;
        }
    } else if (tile.rq === 0) {
        if (Object.keys(theTileRes).length === 0) {
            tile.rs = {};
            let resName = checkSimpleRes();
            tile.rs[resName] = rand.rand(75,400);
        } else {
            tile.rs = theTileRes;
        }
        tile.rs['Scrap'] = rand.rand(250,500);
    }
    mped.sinf = '';
    theTileRes = {};
};

function checkSimpleRes() {
    let myResName = 'Fer';
    let shufRes = _.shuffle(resTypes);
    shufRes.forEach(function(res) {
        if (res.cat === 'white') {
            if (res.rarity >= 51) {
                myResName = res.name;
            }
        }
    });
    return myResName;
};

function getNextSeed(tile) {
    let nextSeed = tile.seed+1;
    let numSeeds = 6;
    if (tile.terrain === 'M' || tile.terrain === 'H') {
        numSeeds = 12;
    }
    if (tile.terrain === 'R') {
        if (tile.seed < 4) {
            numSeeds = 3;
            if (nextSeed > numSeeds) {
                nextSeed = 1;
            }
        } else {
            numSeeds = 6;
            if (nextSeed > numSeeds) {
                nextSeed = 4;
            }
        }
    } else {
        if (nextSeed > numSeeds) {
            nextSeed = 1;
        }
    }
    return nextSeed;
};

function seedAuto() {
    mped.as = true;
    mapEditWindow();
};

function seedManu() {
    mped.as = false;
    mapEditWindow();
};
