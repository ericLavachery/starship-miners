function mapEditWindow() {
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    alienReplaceBase();
    putMissionTitle();
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<h1>MAP EDITOR</h1><br>');
    // map number
    if (playerInfos.pseudo === 'Mapedit') {
        $('#conUnitList').append('<select class="boutonGris" id="mapNumber" onchange="mapNumAssign(`mapNumber`)"></select>');
        $('#mapNumber').append('<option value="100" selected>Zone n°??</option>');
        let mapNum = 50;
        while (mapNum <= 99) {
            let mType = getMissionType(mapNum);
            if (zone[0].number === mapNum) {
                $('#mapNumber').append('<option value="'+mapNum+'" selected>Zone n°'+mapNum+' ('+mType.name+' '+Math.floor(mType.pa)+')</option>');
            } else if (!playerInfos.misDB.includes(mapNum)) {
                $('#mapNumber').append('<option value="'+mapNum+'">Zone n°'+mapNum+' ('+mType.name+' '+Math.floor(mType.pa)+')</option>');
            } else {
                $('#mapNumber').append('<option value="'+mapNum+'">Zone n°'+mapNum+' ('+mType.name+' '+Math.floor(mType.pa)+') &nbsp;&#9940;&nbsp; Ecraser ??</option>');
            }
            if (mapNum >= 99) {break;}
            mapNum++
        }
        $('#conUnitList').append('<br>');
        $('#conUnitList').append('<br>');
    }
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
    selectStuff('Ruines','ruinCheck','Ruines (au hasard)');
    selectStuff('RuinesNext','ruinNext','Ruines (au choix)');
    // <br>
    selectStuff('Route','roads','Route (ou Pont)');
    selectStuff('AmmoPack','ammoPacks','Packs de munitions/armures/drogues');
    selectStuff('RuinesVides','ruinEmpty2','Ruines fouillées / Non fouillées (sans changer le type de ruine)');
    selectStuff('RuinesPleines','ruinNotEmpty','Ruines pleines (100% ressources, 5x% citoyens) / Non fouillées (% normaux)');
    $('#conUnitList').append('<br>');
    // Ressources
    selectStuff('Res','res','Mettre des ressources sur le terrain');
    selectStuff('RareRes','rareres','Mettre des ressources rares sur le terrain');
    selectStuff('NoRes','nores','Supprimer les ressources du terrain');
    selectStuff('BatRes','batres','Mettre des ressources dans le bataillon');
    // <br>
    // Tags
    selectStuff('Garde','alienPDM2','Garde alien (va rester dans le périmètre)');
    selectStuff('FullShield','alienShield','Cet alien a un bouclier permanent');
    selectStuff('FastMorph','alienFastMorph','Cet alien se transforme plus rapidement (Veilleurs se transforment en Ruche vers le tour 12 / Oeufs, Coques et Vomissures se transforment 2x plus vite)');
    selectStuff('Toile','webIcon','Toile (Canon Web)');
    // <br>
    selectStuff('NoMove','batNoMove2','Bataillon immobilisé (non contrôlé par le joueur)');
    selectStuff('Outsider','batOutsider2','Bataillon outsider (si démantelé, pourrait donner des criminels)');
    selectStuff('NoPrefab','bldNoPrefab2','Ne peut pas être déconstruit (démantèlement seulement / personnel réduit)');
    selectStuff('NoPilot','noDriver','Pas de conducteurs (Véhicule sans équipage)');
    // <br>
    selectStuff('LevelChange','levelUp','Changer le niveau d\'expérience');
    selectStuff('MakeChief','chef','Sous-chef (si niveau 3+)');
    selectStuff('MakeHero','hero','Héro (si niveau 4)');
    // <br>
    selectStuff('Bleed','bleed','Blesser le bataillon');
    selectStuff('CitChange','lessCit2','Changer le nombre de citoyens ou criminels');
    // Landing
    selectStuff('Lander','lander','Point d\'atterrissage lander (ou navette)');
    selectStuff('Navette','navette','Point d\'atterrissage navette seulemment');
    // End
    $('#conUnitList').append('<br><span id="melists"></span><br>');
    if (mped.sinf === 'RareRes' || mped.sinf === 'Res') {
        mapResAddList();
        if (Object.keys(theTileRes).length < 1) {
            window.location.hash = '#melists';
        }
        $('#conUnitList').append('<br><br>');
    } else {
        theTileRes = {};
    }
    if (mped.sinf === 'BatRes') {
        batResAddList();
        if (Object.keys(theBatRes).length < 1) {
            window.location.hash = '#melists';
        }
        $('#conUnitList').append('<br><br>');
    } else {
        theBatRes = {};
    }
    if (mped.sinf === 'AmmoPack') {
        mapPackAddList();
        if (theTilePacks === 'tungsten') {
            window.location.hash = '#melists';
        }
        $('#conUnitList').append('<br><br>');
    } else {
        theTilePacks = 'tungsten';
    }
    if (mped.sinf === 'RuinesNext') {
        mapRuinsAddList();
        if (theTileRuins === 'Habitations') {
            window.location.hash = '#melists';
        }
        $('#conUnitList').append('<br><br>');
    } else {
        theTileRuins = 'Habitations';
    }
    $('#conUnitList').append('<span class="constName"><span class="gf blk">Planête!</span> : <span class="cy klik" onclick="planetToggle(`'+zone[0].planet+'`,true)" title="Changer de planête (CHANGE les RESSOURCES et RUINES!)">'+zone[0].planet+'</span></span><br>');
    // $('#conUnitList').append('<span class="constName"><span class="gf">Planête?</span> : <span class="cy klik" onclick="planetToggle(`'+zone[0].planet+'`,false)" title="Changer de planête (SANS CHANGER les ressources et ruines)">'+zone[0].planet+'</span></span><br>');
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
    mpedOption('neverMove','Les bataillons avec un tag nomove ne se rallient au joueur que si ils sont rejoints','Never move','Les bataillons avec un tag nomove se rallient au joueur dès qu\'un bâtiment (avec un tag nomove) est détruit. / Le bastion de résistants permet de rallier tous les bataillons non contrôlés.','Tag nomove normal');
    mpedOption('flw','Les aliens se dirigent vers le bataillon le plus proche','Follow','Les aliens se comportent normalement','No follow');
    mpedOption('noEggs','Aucun oeuf ne tombe','Sans Oeufs','Des oeufs tombent','Avec Oeufs');
    let meip = 0;
    if (zone[0].meip != undefined) {
        meip = zone[0].meip;
    }
    $('#conUnitList').append('<span class="constName"><span class="gf" title="Maximum d\'oeufs en jeu (en plus de la normale)">Max Eggs</span> : <span class="cy klik" onclick="addMaxEggs(false)" title="Diminuer">&ddarr;</span> <span class="bleu">+'+meip+'</span> <span class="cy klik" onclick="addMaxEggs(true)" title="Augmenter">&uuarr;</span></span><br>');
    mpedOption('coverEggs','Les oeufs tombent toujours à couvert (près d\'une ruche, volcan ou colonie)','Oeufs à couvert','Les oeufs tombent normalement','Oeufs partout');
    $('#conUnitList').append('<span class="constName"><span class="gf">Zone spéciale?</span> : <span class="cy klik" onclick="zoneTypeToggle(`'+zoneInfos.type+'`)" title="Changer le type de zone">'+zoneInfos.type+'</span></span><br>');
    if (zoneInfos.type === 'normal') {
        eggsByTerrain('plaines',zone[0].pKind);
        eggsByTerrain('prairies',zone[0].gKind);
        eggsByTerrain('marécages',zone[0].sKind);
        alienReplace('C',zone[0].rc[0],zone[0].rc[1]);
        alienReplace('B',zone[0].rb[0],zone[0].rb[1]);
        alienReplace('A',zone[0].ra[0],zone[0].ra[1]);
    }
    $('#conUnitList').append('<br>');
    if (zone[0].title === undefined) {
        zone[0].title = 'Super Méga Zone';
    }
    if (zone[0].body === undefined) {
        zone[0].body = 'Allez chercher ce Trolley et cassez-vous, bordel!';
    }
    $('#conUnitList').append('<span class="constName"><form id="descFrm" onkeydown="return event.key != `Enter`;">Nom:<br><input type="text" id="descTitle" name="descTitle" class="txtInputs" value="'+zone[0].title+'"><br>Objectif/Description:<br><textarea id="descBody" name="descBody" rows="8" cols="32" class="txtInputs">'+zone[0].body+'</textarea><br><input type="button" onclick="nameTheZoneBaby()" value="Envoyer" class="boutonGris skillButtons"></form></span>');
    $('#conUnitList').append('<br><br>');
};

function nameTheZoneBaby() {
    let theTitle = document.getElementById("descTitle").value;
    let theBody = document.getElementById("descBody").value;
    if (theTitle != '') {
        zone[0].title = theTitle;
    }
    if (theBody != '') {
        zone[0].body = theBody;
    }
    mapEditWindow();
};

function mapNumAssign(dropMenuId) {
    let mapNum = document.getElementById(dropMenuId).value;
    if (mapNum != 100) {
        zone[0].number = +mapNum;
    }
    mapEditWindow();
    commandes();
};

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

function planetToggle(plaName,resCheck) {
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
    if (resCheck) {
        resRecheck();
    }
    planetFixAlienKind();
    checkGibier();
    playRoom(zone[0].snd,true,true);
    showMap(zone,true);
    planetThumb();
    mapEditWindow();
};

function addMaxEggs(up) {
    let meip = 0;
    if (zone[0].meip != undefined) {
        meip = zone[0].meip;
    }
    if (up) {
        meip++;
    } else {
        meip--
    }
    zone[0].meip = meip;
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
        zone[0].type = 'leech';
        zone[3].seed = 1;
        zone[9].seed = 2;
        zone[0].rc = ["Vers","Larves"];
        zone[0].rb = ["Lucioles","Wurms"];
        zone[0].ra = ["Libellules","Megagrubz"];
    } else if (theZoneType === 'leech') {
        // flies
        zone[0].type = 'flies';
        zone[3].seed = 2;
        zone[9].seed = 1;
        zone[0].rc = ["Larves","Lombrics"];
        zone[0].rb = ["Wurms","Moucherons"];
        zone[0].ra = ["Megagrubz","Libellules"];
    } else if (theZoneType === 'flies') {
        // ants
        zone[0].type = 'ants';
        zone[3].seed = 3;
        zone[9].seed = 2;
        zone[0].rc = ["Cafards","Fourmis"];
        zone[0].rb = ["Ojos","Skolos"];
        zone[0].ra = ["Galéodes","Mantes"];
    } else if (theZoneType === 'ants') {
        // roaches
        zone[0].type = 'roaches';
        zone[3].seed = 4;
        zone[9].seed = 3;
        zone[0].rc = ["Scorpions","Blattes"];
        zone[0].rb = ["Bourdons","Ojos"];
        zone[0].ra = ["Androks","Homards"];
    } else if (theZoneType === 'roaches') {
        // spinne
        zone[0].type = 'spinne';
        zone[3].seed = 5;
        zone[9].seed = 1;
        zone[0].rc = ["Cracheuses","Torches"];
        zone[0].rb = ["Faucheux","Discoballs"];
        delete zone[0].ra;
    } else if (theZoneType === 'spinne') {
        // bigbugs
        zone[0].type = 'bigbugs';
        zone[3].seed = 6;
        zone[9].seed = 2;
        zone[0].rc = ["Grabbers","Escarbots"];
        zone[0].rb = ["Spitbugs","Broyeurs"];
        zone[0].ra = ["Scarabs","Bigheads"];
    } else if (theZoneType === 'bigbugs') {
        // normal
        zone[0].type = 'normal';
        zone[9].seed = 6;
        delete zone[0].rc;
        delete zone[0].rb;
        delete zone[0].ra;
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
    planetFixAlienKind();
    mapEditWindow();
};

function planetFixAlienKind() {
    if (zone[0].planet === 'Gehenna') {
        zone[0].pKind = 'swarm';
        zone[0].gKind = 'swarm';
        zone[0].sKind = 'spider';
    } else if (zone[0].planet === 'Kzin') {
        zone[0].pKind = 'bug';
        zone[0].gKind = 'spider';
        zone[0].sKind = 'larve';
    } else if (zone[0].planet === 'Horst') {
        zone[0].pKind = 'bug';
        zone[0].gKind = 'swarm';
        zone[0].sKind = 'swarm';
    }
}

function mapRuinsAddList() {
    let sortedRuins = _.sortBy(armorTypes,'name');
    sortedRuins.forEach(function(thisRuin) {
        if (thisRuin.cat === 'ruins') {
            let col = 'klik';
            if (theTileRuins === thisRuin.name) {
                col = 'cy klik';
            }
            $('#conUnitList').append('<span class="paramName '+col+'" onclick="mapRuinsAdd(`'+thisRuin.name+'`)">'+thisRuin.name+'</span><img src="/static/img/units/ruins/'+thisRuin.pic+'.png" width="32" style="background-color:#89874c;"><br>');
        }
    });
};

function mapResAddList() {
    let planet = zone[0].planet;
    let sortedResTypes = _.sortBy(resTypes,'name');
    sortedResTypes.forEach(function(res) {
        if (res.cat === 'white' || ((res.cat.includes('sky') || res.cat.includes('blue')) && mped.sinf === 'RareRes')) {
            let planetOK = true;
            if (res.planets != undefined) {
                if (res.planets[planet] === 0) {
                    planetOK = false;
                }
            }
            if (planetOK) {
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
        }
    });
    console.log(theTileRes);
};

function batResAddList() {
    let planet = zone[0].planet;
    let sortedResTypes = _.sortBy(resTypes,'name');
    sortedResTypes.forEach(function(res) {
        if (res.cat === 'white' || res.cat === 'zero' || res.cat === 'transfo' || res.cat.includes('sky') || res.cat.includes('blue')) {
            if (res.name != 'Magma') {
                let planetOK = true;
                if (res.planets != undefined) {
                    if (res.planets[planet] === 0) {
                        planetOK = false;
                    }
                }
                let resIcon = getResIcon(res);
                let dispoRes = theBatRes[res.name];
                if (dispoRes === undefined) {
                    dispoRes = 0;
                }
                if (dispoRes < 0) {
                    dispoRes = 0;
                }
                if (planetOK) {
                    $('#conUnitList').append('<span class="paramResName klik" onclick="batResAdd(`'+res.name+'`)">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="cy">'+dispoRes+'</span></span><br>');
                } else {
                    $('#conUnitList').append('<span class="paramResName gff klik" title="Attention: Ressource normalement non présente sur cette planête!" onclick="batResAdd(`'+res.name+'`)">'+res.name+'</span><span class="paramIcon blanc">'+resIcon+'</span><span class="paramResValue"><span class="cy">'+dispoRes+'</span></span><br>');
                }
            }
        }
    });
    console.log(theBatRes);
};

function mapPackAddList() {
    $('#conUnitList').append('<span class="paramName or">Munitions</span><br>');
    ammoTypes.forEach(function(ammo) {
        let ammoIcon = getRarityIcon(ammo);
        if (ammoIcon != '') {
            let ammoDesc = '';
            if (ammo.name.includes('ac-')) {
                ammoDesc = '20 mm';
            }
            if (ammo.name.includes('sm-')) {
                ammoDesc = '6 mm';
            }
            let ammoInfo = showAmmoInfo(ammo.name);
            let col = 'klik';
            if (theTilePacks === ammo.name) {
                col = 'cy klik';
            }
            if (ammoDesc === '') {
                $('#conUnitList').append('<span class="paramName '+col+'" onclick="mapPackAdd(`'+ammo.name+'`,`ammo`)" title="'+ammoInfo+'">'+ammo.name+'</span><span class="paramIcon blanc">'+ammoIcon+'</span><br>');
            }
        }
    });
    $('#conUnitList').append('<span class="paramName or">Armures</span><br>');
    armorTypes.forEach(function(armor) {
        if (armor.cat === 'armor') {
            let armorIcon = getRarityIcon(armor);
            if (armorIcon != '') {
                let armorInfo = showArmorInfo(armor);
                let col = 'klik';
                if (theTilePacks === 'prt_'+armor.name) {
                    col = 'cy klik';
                }
                $('#conUnitList').append('<span class="paramName '+col+'" onclick="mapPackAdd(`'+armor.name+'`,`armor`)" title="'+armorInfo+'">'+armor.name+'</span><span class="paramIcon blanc">'+armorIcon+'</span><br>');
            }
        }
    });
    $('#conUnitList').append('<span class="paramName or">Equipements</span><br>');
    armorTypes.forEach(function(equip) {
        if (equip.cat === 'equip') {
            let equipIcon = getRarityIcon(equip);
            if (equipIcon != '') {
                let col = 'klik';
                if (theTilePacks === 'eq_'+equip.name) {
                    col = 'cy klik';
                }
                $('#conUnitList').append('<span class="paramName '+col+'" onclick="mapPackAdd(`'+equip.name+'`,`equip`)" title="'+equip.info+'">'+equip.name+'</span><span class="paramIcon blanc">'+equipIcon+'</span><br>');
            }
        }
    });
    $('#conUnitList').append('<span class="paramName or">Drogues</span><br>');
    armorTypes.forEach(function(drug) {
        if (drug.cat === 'drogue') {
            let col = 'klik';
            if (theTilePacks === 'drg_'+drug.name) {
                col = 'cy klik';
            }
            $('#conUnitList').append('<span class="paramName '+col+'" onclick="mapPackAdd(`'+drug.name+'`,`drug`)" title="'+drug.info+'">'+drug.name+'</span><span class="paramIcon blanc"><i class="'+drug.icon+'"></i></span><br>');
        }
    });
}

function getRarityIcon(stuff) {
    let theIcon;
    if (stuff.icon === undefined) {
        theIcon = '';
    } else {
        if (stuff.icon === 3) {
            theIcon = '&starf;';
        } else if (stuff.icon === 2) {
            theIcon = '&star;';
        } else if (stuff.icon === 1) {
            theIcon = '&dtri;';
        } else {
            theIcon = '';
        }
    }
    return theIcon;
};

function clickEdit(tileId) {
    let tile = zone[tileId];
    let bord = false;
    if (tile.x >= 4 && tile.y >= 4 && tile.x <= 57 && tile.y <= 57) {
        // OK
    } else {
        bord = true;
    }
    if (mped.sinf != '') {
        if (mped.sinf === 'RuinesPleines') {
            if (tile.ruins) {
                if (tile.rt != undefined) {
                    tile.sh = 10;
                    if (tile.rt.full != undefined) {
                        if (tile.rt.full) {
                            // delete tile.rt.full;
                            tile.rt.full = false;
                        } else {
                            tile.rt.full = true;
                        }
                    } else {
                        tile.rt.full = true;
                    }
                }
            }
        } else if (mped.sinf === 'RuinesVides') {
            if (tile.ruins) {
                if (tile.sh >= 0) {
                    tile.sh = -1;
                } else {
                    tile.sh = 10;
                }
            }
        } else if (mped.sinf === 'RuinesNext') {
            addRuinsToTile(tile);
        } else if (mped.sinf === 'Ruines') {
            if (!tile.ruins) {
                tile.ruins = true;
                tile.sh = 20;
                tile.rd = true;
                delete tile.infra;
                addScrapToRuins(tile);
                washReports(true);
                // checkNextRuinType(tile);
                checkRuinType(tile,false);
            } else {
                delete tile.ruins;
                delete tile.sh;
                delete tile.rd;
                delete tile.rt;
                removeScrapFromRuins(tile);
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
        } else if (mped.sinf === 'AmmoPack') {
            addAmmoToTile(tile);
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
        } else if (mped.sinf === 'FastMorph') {
            addTagToAlienOnTile(tile,'fastmorph');
        } else if (mped.sinf === 'FullShield') {
            addTagToAlienOnTile(tile,'permashield');
        } else if (mped.sinf === 'NoMove') {
            addTagToBatOnTile(tile,'nomove');
        } else if (mped.sinf === 'Outsider') {
            addTagToBatOnTile(tile,'outsider');
        } else if (mped.sinf === 'NoPrefab') {
            addTagToBatOnTile(tile,'noprefab');
        } else if (mped.sinf === 'NoPilot') {
            addTagToBatOnTile(tile,'nopilots');
        } else if (mped.sinf === 'Bleed') {
            bleedBat(tile);
        } else if (mped.sinf === 'CitChange') {
            changeBatCits(tile);
        } else if (mped.sinf === 'LevelChange') {
            changeBatLevel(tile);
        } else if (mped.sinf === 'MakeChief') {
            changeVetTags(tile,'schef');
        } else if (mped.sinf === 'MakeHero') {
            changeVetTags(tile,'hero');
        } else if (mped.sinf === 'Lander') {
            if (!bord) {
                if (tile.land === undefined) {
                    tile.land = true;
                    if (tile.nav != undefined) {
                        delete tile.nav;
                    }
                } else {
                    delete tile.land;
                }
            } else {
                warning('Achtung!','Trop près du bord de la carte.');
            }
        } else if (mped.sinf === 'Navette') {
            if (!bord) {
                if (tile.nav === undefined) {
                    tile.nav = true;
                    if (tile.land != undefined) {
                        delete tile.land;
                    }
                } else {
                    delete tile.nav;
                }
            } else {
                warning('Achtung!','Trop près du bord de la carte.');
            }
        } else {
            if (tile.infra != mped.sinf) {
                tile.infra = mped.sinf;
                delete tile.ruins;
                delete tile.sh;
                delete tile.rt;
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
    if (Object.keys(bat).length <= 0) {
        bat = getAlienByTileId(tile.id);
    }
    let batType = getBatType(bat);
    if (bat.squadsLeft > 1) {
        bat.squadsLeft = bat.squadsLeft-1;
    } else if (bat.squadsLeft < batType.squads) {
        bat.squadsLeft = batType.squads;
    }
};

function changeBatCits(tile) {
    let bat = getBatByTileId(tile.id);
    let batType = getBatType(bat);
    if (batType.skills.includes('iscit')) {
        if (bat.citoyens < 6) {
            bat.citoyens = 72;
        } else {
            bat.citoyens = bat.citoyens-6;
        }
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

function addTagToAlienOnTile(tile,tag) {
    let bat = getAlienByTileId(tile.id);
    let batType = getBatType(bat);
    let tagOK = true;
    if (tag === 'fastmorph') {
        tagOK = false;
        if (batType.name === 'Veilleurs' || batType.name === 'Vomissure' || batType.name === 'Oeuf' || batType.name === 'Oeuf voilé' || batType.name === 'Coque') {
            tagOK = true;
        }
    }
    if (tagOK) {
        if (!bat.tags.includes(tag)) {
            bat.tags.push(tag);
        } else {
            tagDelete(bat,tag);
        }
    }
};

function changeBatLevel(tile) {
    let bat = getBatByTileId(tile.id);
    bat.vet = bat.vet+1;
    if (bat.vet === 5) {
        bat.vet = 0;
    }
    bat.xp = levelXP[bat.vet]+rand.rand(0,30);
    if (bat.vet < 4) {
        tagDelete(bat,'hero');
        tagDelete(bat,'vet');
    }
    if (bat.vet < 3) {
        tagDelete(bat,'schef');
    }
};

function changeVetTags(tile,tag) {
    let bat = getBatByTileId(tile.id);
    if (bat.team === 'player') {
        let batType = getBatType(bat);
        if (tag === 'schef') {
            if (bat.tags.includes('schef') || batType.skills.includes('leader') || batType.skills.includes('nochef')) {
                tagDelete(bat,'hero');
                tagDelete(bat,'schef');
                tagDelete(bat,'vet');
            } else {
                if (bat.vet >= 3) {
                    bat.tags.push('schef');
                    tagDelete(bat,'hero');
                    tagDelete(bat,'vet');
                }
            }
        }
        if (tag === 'hero') {
            if (bat.tags.includes('hero') || batType.skills.includes('nochef')) {
                tagDelete(bat,'hero');
                tagDelete(bat,'schef');
                tagDelete(bat,'vet');
            } else {
                if (bat.vet >= 4) {
                    bat.tags.push('hero');
                    tagDelete(bat,'schef');
                    tagDelete(bat,'vet');
                }
            }
        }
        if (bat.tags.includes('hero')) {
            tagDelete(bat,'schef');
            tagDelete(bat,'vet');
        }
        if (bat.tags.includes('schef')) {
            tagDelete(bat,'hero');
            tagDelete(bat,'vet');
        }
        if (bat.tags.includes('vet')) {
            tagDelete(bat,'schef');
            tagDelete(bat,'hero');
        }
    }
};

function addTagToBatOnTile(tile,tag) {
    let bat = getBatByTileId(tile.id);
    let batType = getBatType(bat);
    let tagOK = true;
    if (tag === 'noprefab') {
        tagOK = false;
        if (batType.skills.includes('prefab')) {
            tagOK = true;
        }
        if (batType.cat === 'buildings' || batType.cat === 'devices') {
            tagOK = true;
        }
    }
    if (tag === 'nopilots') {
        tagOK = false;
        if (batType.cat === 'vehicles') {
            if (batType.crew >= 1) {
                if (batType.kind === 'zero-transports' || batType.kind === 'zero-trans-fret') {
                    if (batType.transUnits >= 300) {
                        tagOK = true;
                    }
                }
            }
        }
        if (batType.skills.includes('transorbital')) {
            tagOK = true;
        }
    }
    if (tagOK) {
        if (!bat.tags.includes(tag)) {
            bat.tags.push(tag);
        } else {
            tagDelete(bat,tag);
        }
    }
    if (batType.skills.includes('noselfmove') || bat.tags.includes('nopilots')) {
        tagDelete(bat,'outsider');
        tagDelete(bat,'nomove');
    }
    if (!batType.skills.includes('iscit')) {
        if (bat.tags.includes('nomove')) {
            if (!bat.tags.includes('outsider')) {
                bat.tags.push('outsider');
            }
        }
    }
};

function mapRuinsAdd(ruinsName) {
    theTileRuins = ruinsName;
    // mapResAddList();
    mapEditWindow();
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

function mapPackAdd(packName,type) {
    if (type === 'drug') {
        theTilePacks = 'drg_'+packName;
    } else if (type === 'armor') {
        theTilePacks = 'prt_'+packName;
    } else if (type === 'equip') {
        theTilePacks = 'eq_'+packName;
    } else {
        theTilePacks = packName;
    }
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

function removeScrapFromRuins(tile) {
    if (tile.rq != undefined) {
        if (tile.rs['Scrap'] != undefined) {
            delete tile.rs['Scrap'];
            if (Object.keys(tile.rs).length < 1) {
                delete tile.rs;
                delete tile.rq;
            }
        }
    }
};

function addRuinsToTile(tile) {
    if (!tile.ruins) {
        tile.ruins = true;
        tile.sh = 10;
        tile.rd = true;
        delete tile.infra;
        addScrapToRuins(tile);
        washReports(true);
        let ruinType = {};
        let theRuin = getEquipByName(theTileRuins);
        if (Object.keys(theRuin).length >= 1) {
            ruinType.name = theRuin.name;
            ruinType.checks = theRuin.checks;
            ruinType.scrap = theRuin.scrap;
        } else {
            ruinType.name = 'Habitations';
            ruinType.checks = ['food'];
            ruinType.scrap = 200;
        }
        tile.rt = ruinType;
        checkNextRuinType(tile);
    } else {
        delete tile.ruins;
        delete tile.sh;
        delete tile.rd;
        delete tile.rt;
        removeScrapFromRuins(tile);
    }
};

function addAmmoToTile(tile) {
    if (tile.ap != undefined) {
        delete tile.ap;
    } else {
        tile.ap = theTilePacks;
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

function mapGlobalEdits(oldTer,newTer) {
    if (oldTer === undefined) {
        oldTer = 'P';
    }
    if (newTer === undefined) {
        newTer = 'P';
    }
    let oldTerrain = getTerrainByName(oldTer);
    let newTerrain = getTerrainByName(newTer);
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or">EDITER A LA LOUCHE</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="constName"><span class="cy klik" onclick="resRecheck()" title="Nouvelles ressources, ruines et routes">Nouvelles Ressources et Ruines!</span></span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="constName"><span class="cy klik" onclick="roadsKill()">Enlever Ruines et Routes</span></span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="constName">Terrains à remplacer:</span><br>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`P`,`'+newTer+'`)">Plaines</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`G`,`'+newTer+'`)">Prairies</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`B`,`'+newTer+'`)">Maquis</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`F`,`'+newTer+'`)">Forêts</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`H`,`'+newTer+'`)">Collines</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`M`,`'+newTer+'`)">Montagnes</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`S`,`'+newTer+'`)">Marécages</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`W`,`'+newTer+'`)">Etangs</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`L`,`'+newTer+'`)">Lacs</span></span>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="constName">Remplacer par:</span><br>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`'+oldTer+'`,`P`)">Plaines</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`'+oldTer+'`,`G`)">Prairies</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`'+oldTer+'`,`B`)">Maquis</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`'+oldTer+'`,`F`)">Forêts</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`'+oldTer+'`,`H`)">Collines</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`'+oldTer+'`,`M`)">Montagnes</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`'+oldTer+'`,`S`)">Marécages</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`'+oldTer+'`,`W`)">Etangs</span>&nbsp;</span>');
    $('#conUnitList').append('<span class="constName"><span class="vert klik" onclick="mapGlobalEdits(`'+oldTer+'`,`L`)">Lacs</span></span>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="constName">Remplacer: <span class="cy klik" onclick="replaceTerrain(`'+oldTer+'`,`'+newTer+'`,100)">'+oldTerrain.fullName+' >> '+newTerrain.fullName+'</span> 100%</span><br>');
    $('#conUnitList').append('<span class="constName">Remplacer: <span class="cy klik" onclick="replaceTerrain(`'+oldTer+'`,`'+newTer+'`,90)">'+oldTerrain.fullName+' >> '+newTerrain.fullName+'</span> 90%</span><br>');
    $('#conUnitList').append('<span class="constName">Remplacer: <span class="cy klik" onclick="replaceTerrain(`'+oldTer+'`,`'+newTer+'`,75)">'+oldTerrain.fullName+' >> '+newTerrain.fullName+'</span> 75%</span><br>');
    $('#conUnitList').append('<span class="constName">Remplacer: <span class="cy klik" onclick="replaceTerrain(`'+oldTer+'`,`'+newTer+'`,50)">'+oldTerrain.fullName+' >> '+newTerrain.fullName+'</span> 50%</span><br>');
    $('#conUnitList').append('<span class="constName">Remplacer: <span class="cy klik" onclick="replaceTerrain(`'+oldTer+'`,`'+newTer+'`,25)">'+oldTerrain.fullName+' >> '+newTerrain.fullName+'</span> 25%</span><br>');
    $('#conUnitList').append('<span class="constName">Remplacer: <span class="cy klik" onclick="replaceTerrain(`'+oldTer+'`,`'+newTer+'`,10)">'+oldTerrain.fullName+' >> '+newTerrain.fullName+'</span> 10%</span><br>');
    $('#conUnitList').append('<span class="constName">Remplacer: <span class="cy klik" onclick="replaceTerrain(`'+oldTer+'`,`'+newTer+'`,5)">'+oldTerrain.fullName+' >> '+newTerrain.fullName+'</span> 5%</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="butSpace"></span>');
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function replaceTerrain(oldTer,newTer,pc) {
    console.log('GLOBAL REPLACE TERRAIN');
    console.log(oldTer);
    console.log(newTer);
    let seedReduce = false;
    if (oldTer == 'M' || oldTer == 'H') {
        if (newTer != 'M' && newTer != 'H') {
            seedReduce = true;
            console.log('seedReduce');
        }
    }
    let seedExpand = false;
    if (newTer == 'M' || newTer == 'H') {
        if (oldTer != 'M' && oldTer != 'H') {
            seedExpand = true;
            console.log('seedExpand');
        }
    }
    let removeHF = false;
    if (oldTer == 'F' || oldTer == 'B' || oldTer == 'S') {
        if (newTer != 'F' && newTer != 'B' && newTer != 'S') {
            removeHF = true;
        }
    }
    zone.forEach(function(tile) {
        if (tile.terrain === oldTer) {
            if (rand.rand(1,100) <= pc) {
                if (seedReduce) {
                    if (tile.seed > 6) {
                        tile.seed = tile.seed-6;
                    }
                }
                if (seedExpand) {
                    if (tile.id % 2 == 0) {
                        tile.seed = tile.seed+6;
                    }
                }
                if (removeHF) {
                    if (tile.rq != undefined) {
                        if (tile.rs['Fruits'] != undefined) {
                            delete tile.rs['Fruits'];
                        }
                        if (tile.rs['Huile'] != undefined) {
                            delete tile.rs['Huile'];
                        }
                        if (Object.keys(tile.rs).length < 1) {
                            delete tile.rs;
                            delete tile.rq;
                        }
                    }
                }
                tile.terrain = newTer;
            }
        }
    });
    showMap(zone,false);
    minimap();
};

function roadsKill() {
    zone.forEach(function(tile) {
        if (tile.rd != undefined) {
            delete tile.rd;
        }
        if (tile.ruins != undefined) {
            delete tile.ruins;
            delete tile.sh;
            delete tile.rd;
            delete tile.rt;
            removeScrapFromRuins(tile);
        }
    });
    showMap(zone,false);
    minimap();
};

function resRecheck() {
    zone.forEach(function(tile) {
        if (tile.ruins != undefined) {
            delete tile.ruins;
            delete tile.sh;
            delete tile.rd;
            delete tile.rt;
            removeScrapFromRuins(tile);
        }
        if (tile.rd != undefined) {
            delete tile.rd;
        }
        if (tile.rq != undefined) {
            delete tile.rq;
            delete tile.rs;
        }
    });
    addRes(zone);
    showMap(zone,false);
    minimap();
};

function loadEditorMission() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or" id="gentils">EDITER UNE MISSION</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<select class="boutonGris" id="theStartZone" onchange="editTheMissionBaby()"></select>');
    $('#theStartZone').empty().append('<option value="0" selected>Mission</option>');
    let misNum = 50;
    while (misNum <= 99) {
        if (playerInfos.misDB.includes(misNum)) {
            let mType = getMissionType(misNum);
            let mission = getMissionByNum(misNum);
            $('#theStartZone').append('<option value="'+misNum+'">'+misNum+' - '+mType.name+' '+Math.floor(mType.pa)+' - '+mission.name+'</option>');
        }
        if (misNum > 99) {break;}
        misNum++
    }
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="butSpace"></span>');
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function editTheMissionBaby() {
    let selectorNum = document.getElementById("theStartZone").value;
    let missionNum = +selectorNum;
    socket.emit('change-edited-mission',missionNum);
};

function alienReplace(classe,r1,r2) {
    let r1view = r1;
    if (r1view === 'Yapa') {
        r1view = 'RIEN';
    }
    $('#conUnitList').append('<span class="constName"><span class="gf">Remplacer:</span> <span class="cy klik" onclick="alienToggle(0,`'+classe+'`)" title="Changer">'+r1view+'</span> <span class="gf">Par:</span> <span class="cy klik" onclick="alienToggle(1,`'+classe+'`)" title="Changer">'+r2+'</span></span><br>');
};

function alienToggle(rnum,classe) {
    let className = 'r'+classe.toLowerCase();
    let arList = [];
    if (rnum === 0) {
        arList.push('Yapa');
    }
    let theKind = 'none';
    if (rnum === 1) {
        let curAlienZero = zone[0][className][0];
        console.log('ALIEN ZERO');
        console.log(curAlienZero);
        if (curAlienZero != 'Yapa') {
            let curAlienZeroType = getAlienTypeByName(curAlienZero);
            theKind = curAlienZeroType.kind;
        }
    }
    let sortedAliensList = _.sortBy(_.sortBy(_.sortBy(alienUnits,'name'),'class'),'kind');
    sortedAliensList.forEach(function(alienType) {
        if (alienType.class === classe) {
            if (theKind === 'none') {
                arList.push(alienType.name);
            } else {
                if (theKind === alienType.kind) {
                    arList.push(alienType.name);
                }
            }
        }
    });
    console.log('ARLIST');
    console.log(arList);
    let curAlien = zone[0][className][rnum];
    let curAlienKind = 'none';
    if (curAlien != 'Yapa') {
        let curAlienType = getAlienTypeByName(curAlien);
        curAlienKind = curAlienType.kind;
    }
    console.log(curAlien);
    let index = arList.indexOf(curAlien);
    console.log(index);
    if (index >= 0 && index < arList.length-1) {
        zone[0][className][rnum] = arList[index+1];
    } else {
        zone[0][className][rnum] = arList[0];
    }
    if (rnum === 0) {
        if (zone[0][className][rnum] != 'Yapa') {
            let newAlienType = getAlienTypeByName(zone[0][className][rnum]);
            if (curAlienKind != newAlienType.kind) {
                zone[0][className][1] = zone[0][className][0];
            }
        }
    }
    mapEditWindow();
};

function alienReplaceBase() {
    if (zone[0].rc === undefined) {
        zone[0].rc = [];
        zone[0].rc.push('Yapa');
        zone[0].rc.push('Bugs');
    }
    if (zone[0].rb === undefined) {
        zone[0].rb = [];
        zone[0].rb.push('Yapa');
        zone[0].rb.push('Chancres');
    }
    if (zone[0].ra === undefined) {
        zone[0].ra = [];
        zone[0].ra.push('Yapa');
        zone[0].ra.push('Scarabs');
    }
};

function getMissionType(misNum) {
    let mType = {};
    mType.name = 'Spécial';
    mType.pa = 4;
    if (misNum >= 90) {
        mType.name = 'Exil';
        mType.pa = 1;
    } else if (misNum >= 85) {
        mType.name = 'Spécial';
        mType.pa = 4;
    } else if (misNum >= 80) {
        mType.name = 'Boss Spider';
        mType.pa = 6;
        zone[0].pKind = 'spider';
        zone[0].gKind = 'spider';
        zone[0].sKind = 'spider';
    } else if (misNum >= 75) {
        mType.name = 'Boss Bug';
        mType.pa = 7;
        zone[0].pKind = 'bug';
        zone[0].gKind = 'bug';
        zone[0].sKind = 'bug';
    } else if (misNum >= 70) {
        mType.name = 'Boss Larve';
        mType.pa = 7;
        zone[0].pKind = 'larve';
        zone[0].gKind = 'larve';
        zone[0].sKind = 'larve';
    } else if (misNum >= 65) {
        mType.name = 'Boss Swarm';
        mType.pa = 5;
        zone[0].pKind = 'swarm';
        zone[0].gKind = 'swarm';
        zone[0].sKind = 'swarm';
    } else if (misNum >= 60) {
        mType.name = 'Résistance';
        mType.pa = 4;
    } else if (misNum >= 55) {
        mType.name = 'Base Scientifique';
        mType.pa = 6.5;
    } else if (misNum >= 50) {
        mType.name = 'Trolley';
        mType.pa = 5.5;
    }
    return mType;
};
