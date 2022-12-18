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
    selectStuff('Res','res','Mettre des ressources sur le terrain');
    selectStuff('RareRes','rareres','Mettre des ressources rares sur le terrain');
    selectStuff('NoRes','nores','Supprimer les ressources du terrain');
    // Tags
    selectStuff('Garde','alienPDM','Garde alien (va rester dans le périmètre)');
    selectStuff('NoMove','batNoMove','Bataillon immobilisé');
    selectStuff('Outsider','batOutsider','Bataillon outsider');
    selectStuff('Bleed','bleed','Blesser le bataillon');
    selectStuff('BatRes','batres','Mettre des ressources dans le bataillon');
    selectStuff('Toile','web1','Toile (Canon Web)');
    // Landing
    selectStuff('Lander','lander','Point d\'atterrissage lander (ou navette)');
    selectStuff('Navette','navette','Point d\'atterrissage navette seulemment');
    // End
    $('#conUnitList').append('<br><br>');
    if (mped.sinf === 'RareRes' || mped.sinf === 'Res') {
        mapResAddList();
        $('#conUnitList').append('<br><br>');
    } else {
        theTileRes = {};
    }
    if (mped.sinf === 'BatRes') {
        batResAddList();
        $('#conUnitList').append('<br><br>');
    } else {
        theBatRes = {};
    }
    $('#conUnitList').append('<span class="constName"><span class="gf">Planête</span> : <span class="cy klik" onclick="planetToggle(`'+zone[0].planet+'`)" title="Changer de planête">'+zone[0].planet+'</span></span><br>');
    $('#conUnitList').append('<span class="constName"><span class="gf">Présense alien</span> : <span class="cy klik" onclick="diffToggle()" title="Changer la présence alien">pa'+zone[0].mapDiff+'</span></span><br>');
    $('#conUnitList').append('<span class="constName"><span class="gf">Ambiance</span> : <span class="cy klik" onclick="roomToggle(`'+zone[0].snd+'`)" title="Changer le type de zone">'+zone[0].snd+'</span> <span class="bleu">(Soleil: '+zone[0].ensol+')</span></span><br>');
    let theGame = {};
    theGame.game = 'Indéfini';
    theGame.chance = 0;
    theGame.max = 0;
    if (zone[0].hunt != undefined) {
        theGame = zone[0].hunt;
    }
    $('#conUnitList').append('<span class="constName"><span class="gf">Gibier</span> : <span class="cy klik" onclick="checkGibier()" title="Checker le type de gibier">'+theGame.game+'</span> <span class="bleu" title="Chance/Max">('+theGame.chance+'/'+theGame.max+')</span></span><br>');
    mpedOption('cLand','Atterrissage au centre possible également','Landing centre','Atterrissage uniquement aux points marqués','Landing points');
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

// {"number":3,"visit":true}

function diffToggle() {
    zone[0].mapDiff = zone[0].mapDiff+1;
    if (zone[0].mapDiff > 12) {
        zone[0].mapDiff = 0;
    }
    playerInfos.sondeDanger = zone[0].mapDiff;
    playerInfos.mapDiff = zone[0].mapDiff;
    mapEditWindow();
};

function checkGibier() {
    zonePercCheck();
    let huntType = getHuntType();
    zone[0].hunt = huntType;
    mapEditWindow();
};

function roomToggle(zound) {
    let sndEnsolBonus = 100;
    if (zone[0].planet === 'Dom') {
        if (zound === 'thunderfull') {
            zone[0].snd = 'thunderstart';
            sndEnsolBonus = 35;
        } else if (zound === 'thunderstart') {
            zone[0].snd = 'cricketsloop';
            sndEnsolBonus = 250;
        } else if (zound === 'cricketsloop') {
            zone[0].snd = 'jungle';
            sndEnsolBonus = 230;
        } else if (zound === 'jungle') {
            zone[0].snd = 'rainforest';
            sndEnsolBonus = 150;
        } else if (zound === 'rainforest') {
            zone[0].snd = 'birds';
            sndEnsolBonus = 125;
        } else if (zound === 'birds') {
            zone[0].snd = 'crickets';
            sndEnsolBonus = 150;
        } else if (zound === 'crickets') {
            zone[0].snd = 'howlwind';
            sndEnsolBonus = 75;
        } else if (zound === 'howlwind') {
            zone[0].snd = 'bogs';
            sndEnsolBonus = 30;
        } else {
            zone[0].snd = 'thunderfull';
            sndEnsolBonus = 20;
        }
    } else if (zone[0].planet === 'Sarak') {
        if (zound === 'fogfrogs') {
            zone[0].snd = 'strange';
            sndEnsolBonus = 0;
        } else {
            zone[0].snd = 'fogfrogs';
            sndEnsolBonus = 0;
        }
    } else if (zone[0].planet === 'Gehenna') {
        if (zound === 'swamp') {
            zone[0].snd = 'uhuwind';
            sndEnsolBonus = 100;
        } else if (zound === 'uhuwind') {
            zone[0].snd = 'monsoon';
            sndEnsolBonus = 25;
        } else {
            zone[0].snd = 'swamp';
            sndEnsolBonus = 50;
        }
    } else if (zone[0].planet === 'Kzin') {
        if (zound === 'sywind') {
            zone[0].snd = 'bwind';
            sndEnsolBonus = 100;
        } else {
            zone[0].snd = 'sywind';
            sndEnsolBonus = 50;
        }
    } else if (zone[0].planet === 'Horst') {
        if (zound === 'thunderred') {
            zone[0].snd = 'bwindred';
            sndEnsolBonus = 75;
        } else if (zound === 'bwindred') {
            zone[0].snd = 'redwind';
            sndEnsolBonus = 125;
        } else {
            zone[0].snd = 'thunderred';
            sndEnsolBonus = 25;
        }
    }
    let ensolFactor = rand.rand(25,35);
    let ensolBonus = rand.rand(0,80);
    zone[0].ensol = Math.round((Math.round(100*ensolFactor/10)+ensolBonus)*sndEnsolBonus/125);
    if (zone[0].ensol < 50 && zone[0].planet != 'Sarak') {
        zone[0].ensol = 40+rand.rand(0,10);
    }
    playerInfos.sondeDanger = zone[0].mapDiff;
    playerInfos.mapDiff = zone[0].mapDiff;
    checkGibier();
    playRoom(zone[0].snd,true,true);
    showMap(zone,true);
    mapEditWindow();
};

function planetToggle(plaName) {
    if (plaName === 'Dom') {
        zone[0].planet = 'Sarak';
        zone[0].pid = 2;
        zone[0].snd = 'fogfrogs';
        zone[0].dark = true;
        zone[0].undarkAll = true;
        zone[0].undarkOnce = [];
        playerInfos.sondePlanet = 2;
    } else if (plaName === 'Sarak') {
        zone[0].planet = 'Gehenna';
        zone[0].pid = 3;
        zone[0].snd = 'swamp';
        zone[0].dark = false;
        zone[0].undarkAll = true;
        zone[0].undarkOnce = [];
        playerInfos.sondePlanet = 3;
    } else if (plaName === 'Gehenna') {
        zone[0].planet = 'Kzin';
        zone[0].pid = 4;
        zone[0].snd = 'sywind';
        zone[0].dark = false;
        zone[0].undarkAll = true;
        zone[0].undarkOnce = [];
        playerInfos.sondePlanet = 4;
    } else if (plaName === 'Kzin') {
        zone[0].planet = 'Horst';
        zone[0].pid = 5;
        zone[0].snd = 'thunderred';
        zone[0].dark = false;
        zone[0].undarkAll = true;
        zone[0].undarkOnce = [];
        playerInfos.sondePlanet = 5;
    } else if (plaName === 'Horst') {
        zone[0].planet = 'Dom';
        zone[0].pid = 1;
        zone[0].snd = 'howlwind';
        zone[0].dark = false;
        zone[0].undarkAll = true;
        zone[0].undarkOnce = [];
        playerInfos.sondePlanet = 1;
    }
    playerInfos.sondeDanger = zone[0].mapDiff;
    playerInfos.mapDiff = zone[0].mapDiff;
    checkGibier();
    playRoom(zone[0].snd,true,true);
    showMap(zone,true);
    planetThumb();
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
            $('#conUnitList').append('<span class="paramResName klik" onclick="mapResAdd(`'+res.name+'`)">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="cy">'+dispoRes+'</span></span><br>');
        }
    });
    console.log(theTileRes);
};

function batResAddList() {
    let sortedResTypes = _.sortBy(resTypes,'name');
    sortedResTypes.forEach(function(res) {
        if (res.cat === 'white' || res.cat === 'zero' || res.cat === 'transfo' || res.cat.includes('sky') || res.cat.includes('blue')) {
            if (res.name != 'Magma') {
                let resIcon = getResIcon(res);
                let dispoRes = theBatRes[res.name];
                if (dispoRes === undefined) {
                    dispoRes = 0;
                }
                if (dispoRes < 0) {
                    dispoRes = 0;
                }
                $('#conUnitList').append('<span class="paramResName klik" onclick="batResAdd(`'+res.name+'`)">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="cy">'+dispoRes+'</span></span><br>');
            }
        }
    });
    console.log(theBatRes);
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
        } else if (mped.sinf === 'Toile') {
            if (tile.web === undefined) {
                tile.web = true;
            } else {
                delete tile.web;
            }
        } else if (mped.sinf === 'BatRes') {
            addResToBat(tile);
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
            if (tile.ruins) {
                addScrapToRuins(tile);
            }
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

function batResAdd(resName) {
    let letsAdd = rand.rand(35,65);
    if (theBatRes[resName] === undefined) {
        theBatRes[resName] = letsAdd;
    } else {
        theBatRes[resName] = theBatRes[resName]+letsAdd;
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
    let sq = rand.rand(150,500);
    if (tile.rq === undefined) {
        tile.rq = 0;
        tile.rs = {};
        tile.rs['Scrap'] = sq;
    } else {
        if (tile.rs['Scrap'] === undefined) {
            tile.rs['Scrap'] = sq;
        }
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

function addResToBat(tile) {
    let bat = getBatByTileId(tile.id);
    let batType = getBatType(bat);
    if (batType.transRes >= 100) {
        bat.transRes = theBatRes;
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

function zonePercCheck() {
    let percM = 0;
    let percH = 0;
    let percP = 0;
    let percG = 0;
    let percB = 0;
    let percF = 0;
    let percS = 0;
    let percW = 0;
    let percR = 0;
    let terName;
    zone.forEach(function(tile) {
        terName = getTileTerrainName(tile.id);
        if (terName === 'M') {
            percM++;
        }
        if (terName === 'H') {
            percH++;
        }
        if (terName === 'P') {
            percP++;
        }
        if (terName === 'G') {
            percG++;
        }
        if (terName === 'B') {
            percB++;
        }
        if (terName === 'F') {
            percF++;
        }
        if (terName === 'S') {
            percS++;
        }
        if (terName === 'W' || terName === 'L') {
            percW++;
        }
        if (terName === 'R') {
            percR++;
        }
    });
    percM = Math.round(percM/36);
    zone[0].pm = percM;
    percH = Math.round(percH/36);
    zone[0].ph = percH;
    percP = Math.round(percP/36);
    zone[0].pp = percP;
    percG = Math.round(percG/36);
    zone[0].pg = percG;
    percB = Math.round(percB/36);
    zone[0].pb = percB;
    percF = Math.round(percF/36);
    zone[0].pf = percF;
    percS = Math.round(percS/36);
    zone[0].ps = percS;
    percW = Math.round(percW/36);
    zone[0].pw = percW;
    percR = Math.round(percR/36);
    zone[0].pr = percR;
};
