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
    armorTypes.forEach(function(infra) {
        if (infra.cat === 'infra') {
            mbClass = 'mapedBut';
            if (mped.sinf === infra.name) {mbClass = 'mapedButSel';}
            $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/'+infra.pic+'.png" title="'+infra.name+'" onclick="selectInfra(`'+infra.name+'`)">');
        }
    });
    mbClass = 'mapedBut';
    if (mped.sinf === 'Ruines') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/ruins.png" title="Ruines" onclick="selectInfra(`Ruines`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'Ruines vides') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/ruinsf.png" title="Ruines vides" onclick="selectInfra(`Ruines vides`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'Route') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/roads.png" title="Route (ou Pont)" onclick="selectInfra(`Route`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'Res') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/res.png" title="Ajouter des ressources" onclick="selectInfra(`Res`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'RareRes') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/rareres.png" title="Ajouter des ressources rares" onclick="selectInfra(`RareRes`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'NoRes') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/nores.png" title="Supprimer les ressources" onclick="selectInfra(`NoRes`)">');
    // Tags
    mbClass = 'mapedBut';
    if (mped.sinf === 'Garde') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/alienPDM.png" title="Garde alien" onclick="selectInfra(`Garde`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'NoMove') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/batNoMove.png" title="Bataillon immobilisé" onclick="selectInfra(`NoMove`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'Outsider') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/batOutsider.png" title="Bataillon outsider" onclick="selectInfra(`Outsider`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'Bleed') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/bleed.png" title="Blesser le bataillon" onclick="selectInfra(`Bleed`)">');
    // Landing
    mbClass = 'mapedBut';
    if (mped.sinf === 'Lander') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/lander.png" title="Point d\'aterrissage lander" onclick="selectInfra(`Lander`)">');
    mbClass = 'mapedBut';
    if (mped.sinf === 'Navette') {mbClass = 'mapedButSel';}
    $('#conUnitList').append('<img class="'+mbClass+'" src="/static/img/units/navette.png" title="Point d\'aterrissage navette" onclick="selectInfra(`Navette`)">');
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
