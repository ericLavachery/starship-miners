function showBatInfos(bat) {
    $('#unitInfos').empty();
    conWindowOut();
    let tagColor = 'cy';
    let unitTypesIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
    let batUnitType = unitTypes[unitTypesIndex];
    let unitsLeft = bat.squadsLeft*batUnitType.squadSize;
    if (bat.citoyens >= 1) {
        unitsLeft = bat.citoyens;
    }
    let resMax = batUnitType.transRes;
    if (bat.citoyens >= 1) {
        resMax = bat.citoyens;
    }
    if (batUnitType.skills.includes('nonumname')) {
        $('#unitInfos').append('<span class="blockTitle"><h3>'+batUnitType.name+'</h3> &nbsp;(a<span class="cy">'+bat.army+'</span>)</span>');
    } else {
        $('#unitInfos').append('<span class="blockTitle"><h3>'+unitsLeft+' '+batUnitType.name+'</h3> &nbsp;(a<span class="cy">'+bat.army+'</span>)</span>');
    }
    $('#unitInfos').append('<div class="shSpace"></div>');

    let allTags = _.countBy(bat.tags);
    // AP
    let ap = getAP(bat);
    let hourglass = 'start';
    if (bat.apLeft <= 0) {
        hourglass = 'end';
    } else if (bat.apLeft < ap) {
        hourglass = 'half';
    }
    let roundApLeft = Math.floor(bat.apLeft);
    $('#unitInfos').append('<span class="paramName">Points d\'action</span><span class="paramIcon"><i class="fas fa-hourglass-'+hourglass+'"></i></span><span class="paramValue">'+roundApLeft+'/'+ap+'</span><br>');
    // SQUADS
    $('#unitInfos').append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.squadsLeft+'/'+batUnitType.squads+'</span><br>');
    let squadHP = batUnitType.squadSize*batUnitType.hp;
    $('#unitInfos').append('<span class="paramName">Dégâts</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    // $('#unitInfos').append('<span class="paramName">Unités/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.squadSize+'</span><br>');
    let totalCrew = batUnitType.crew*batUnitType.squadSize*batUnitType.squads;
    $('#unitInfos').append('<span class="paramName">Personnel</span><span class="paramIcon"><i class="fas fa-user-friends"></i></span><span class="paramValue">'+totalCrew+'</span><br>');
    // let terrainNoGo = noGoList(batUnitType);
    // $('#unitInfos').append('<span class="paramName">'+terrainNoGo+'</span><span class="paramIcon"></span><span class="paramValue"></span><br>');
    // PROTECTION
    // $('#unitInfos').append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.hp+'</span><br>');
    let armure = bat.armor;
    if (bat.tags.includes('fortif') && batUnitType.skills.includes('bigfortif')) {
        armure = armure+2;
    }
    $('#unitInfos').append('<span class="paramName">Armure</span><span class="paramIcon"><i class="fas fa-shield-alt"></i></span><span class="paramValue">'+armure+'</span><br>');
    // $('#unitInfos').append('<span class="paramName">Taille</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.size+'</span><br>');
    let volume = calcVolume(bat,batUnitType);
    $('#unitInfos').append('<span class="paramName">Volume</span><span class="paramIcon"><i class="fas fa-weight-hanging"></i></span><span class="paramValue">'+volume+'</span><br>');
    let stealth = getStealth(bat);
    let camChance = calcCamo(bat);
    if (batUnitType.skills.includes('camo') || batUnitType.skills.includes('maycamo')) {
        $('#unitInfos').append('<span class="paramName">Furtivité</span><span class="paramIcon"></span><span class="paramValue">'+stealth+' ('+camChance+'%)</span><br>');
    } else {
        $('#unitInfos').append('<span class="paramName">Furtivité</span><span class="paramIcon"></span><span class="paramValue">'+stealth+'</span><br>');
    }
    let camoEnCours = false;
    if (bat.camoAP >= 1) {
        camoEnCours = true;
    }
    if (camoEnCours) {
        $('#unitInfos').append('<span class="paramName cy">Mode furtif</span><span class="paramIcon"></span><span class="paramValue cy">En cours... ('+bat.camoAP+')</span><br>');
    } else {
        if (bat.tags.includes('camo')) {
            if (bat.fuzz <= -2) {
                $('#unitInfos').append('<span class="paramName cy">Mode furtif</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
            } else {
                $('#unitInfos').append('<span class="paramName or">Mode furtif</span><span class="paramIcon"></span><span class="paramValue or">Loupé</span><br>');
            }
        }
    }
    let batFuzz = calcBatFuzz(bat);
    $('#unitInfos').append('<span class="paramName">Attraction</span><span class="paramIcon"></span><span class="paramValue">'+batFuzz+'</span><br>');
    // TAGS
    // if (bat.tags.includes('embuscade')) {
    //     $('#unitInfos').append('<span class="paramName cy">Embuscade</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    // }
    // if (bat.tags.includes('guet') || batUnitType.skills.includes('sentinelle') || batUnitType.skills.includes('initiative')) {
    //     $('#unitInfos').append('<span class="paramName cy">Guet</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    // }
    let fortifCover = getCover(bat,true);
    if (bat.tags.includes('fortif')) {
        $('#unitInfos').append('<span class="paramName cy">Fortification</span><span class="paramIcon"></span><span class="paramValue cy">'+fortifCover+'</span><br>');
    } else {
        $('#unitInfos').append('<span class="paramName">Couverture</span><span class="paramIcon"></span><span class="paramValue">'+fortifCover+'</span><br>');
    }
    if (batUnitType.skills.includes('berserk') && bat.damage >= 1) {
        $('#unitInfos').append('<span class="paramName cy">Berserk</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    // if (bat.tags.includes('kirin') || bat.tags.includes('sila') || bat.tags.includes('bliss') || bat.tags.includes('blaze') || bat.tags.includes('skupiac') || bat.tags.includes('starka') || bat.tags.includes('octiron')) {
    //     let myDrugs = checkBatDrugs(bat);
    //     $('#unitInfos').append('<span class="paramName cy">Drogue</span><span class="paramIcon"></span><span class="paramValue cy">'+myDrugs.toString()+'</span><br>');
    // }
    if (bat.tags.includes('kirin') || bat.tags.includes('slowreg') || batUnitType.skills.includes('regeneration') || batUnitType.skills.includes('slowreg')) {
        let regenType = 'lente';
        if (bat.tags.includes('kirin') || batUnitType.skills.includes('regeneration')) {
            regenType = 'rapide';
        }
        $('#unitInfos').append('<span class="paramName cy">Régénération</span><span class="paramIcon"></span><span class="paramValue cy">'+regenType+'</span><br>');
    }
    // BAD TAGS
    let hurt = isHurt(bat);
    if (hurt) {
        $('#unitInfos').append('<span class="paramName or">Blessé</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('blub')) {
        $('#unitInfos').append('<span class="paramName or">Noyade</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('poison')) {
        $('#unitInfos').append('<span class="paramName or">Poison</span><span class="paramIcon"></span><span class="paramValue or">'+allTags.poison+'</span><br>');
    }
    if (bat.tags.includes('venin')) {
        $('#unitInfos').append('<span class="paramName or">Venin</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('parasite')) {
        $('#unitInfos').append('<span class="paramName or">Parasite</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('maladie')) {
        $('#unitInfos').append('<span class="paramName or">Malade</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('trou')) {
        $('#unitInfos').append('<span class="paramName or">Blindage troué</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    // XP
    $('#unitInfos').append('<span class="paramName">Expérience</span><span class="paramIcon"></span><span class="paramValue">'+Math.floor(bat.xp)+' (niveau '+bat.vet+')</span><br>');
    // AUTOSKILLS
    if (batUnitType.skills.includes('ravitaillement')) {
        let ravitNum = calcRavit(bat);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#unitInfos').append('<span class="paramName '+tagColor+'">Ravitaillements</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batUnitType.maxSkill+'</span><br>');
    }
    if (batUnitType.transUnits >= 1) {
        let transLeft = calcTransUnitsLeft(bat,batUnitType);
        $('#unitInfos').append('<span class="paramName cy">Transport</span><span class="paramIcon"></span><span class="paramValue cy">'+transLeft+'/'+batUnitType.transUnits+'</span><br>');
    }
    if (batUnitType.transRes >= 1) {
        let restSpace = checkResSpace(bat);
        if (restSpace < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#unitInfos').append('<span class="paramName '+tagColor+'">Fret</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+restSpace+'/'+resMax+'</span><br>');
    }
    if (batUnitType.skills.includes('reserve') || batUnitType.skills.includes('transorbital')) {
        if (bat.tags.includes('reserve') || batUnitType.skills.includes('transorbital')) {
            $('#unitInfos').append('<span class="paramName cy">Réserve</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
        } else {
            $('#unitInfos').append('<span class="paramName or">Réserve</span><span class="paramIcon"></span><span class="paramValue or">Non</span><br>');
        }
    }
    if (batUnitType.skills.includes('dealer')) {
        let ravitNum = calcRavit(bat);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#unitInfos').append('<span class="paramName '+tagColor+'">Drogues</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batUnitType.maxSkill+'</span><br>');
    }
    if (batUnitType.skills.includes('landmine') || batUnitType.skills.includes('dynamite')) {
        let ravitNum = calcRavit(bat);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#unitInfos').append('<span class="paramName '+tagColor+'">Mines</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batUnitType.maxSkill+'</span><br>');
    }
    if (batUnitType.skills.includes('constructeur')) {
        let ravitNum = calcRavit(bat);
        if (ravitNum < 1) {tagColor = 'or';} else {tagColor = 'cy';}
        $('#unitInfos').append('<span class="paramName '+tagColor+'">Barbelés</span><span class="paramIcon"></span><span class="paramValue '+tagColor+'">'+ravitNum+'/'+batUnitType.maxSkill+'</span><br>');
    }
    // WEAPONS & SKILLS
    if (!isStacked()) {
        weaponsInfos(bat,batUnitType);
        $('#unitInfos').append('<div class="shSpace"></div>');
        skillsInfos(bat,batUnitType);
    } else {
        transInfos(bat,batUnitType);
        defabInfos(bat,batUnitType);
    }
    // ARMIES
    $('#unitInfos').append('<div class="shSpace"></div>');
    $('#unitInfos').append('<span class="blockTitle"><h3>Armée</h3></span><br>');
    let army = 0;
    let armycol = "";
    if (army === bat.army) {
        armycol = " cy";
    }
    $('#unitInfos').append('<span class="army klik'+armycol+'" onclick="armyAssign('+bat.id+','+army+')">'+army+'</span>');
    while (army <= 9) {
        army++
        if (army === bat.army) {
            armycol = " cy";
        } else {
            armycol = "";
        }
        $('#unitInfos').append('<span class="army"> &Star; <span class="klik'+armycol+'" onclick="armyAssign('+bat.id+','+army+')">'+army+'</span></span>');
        if (army > 9) {break;}
    }
    // RESSOURCES transportées
    console.log('HERE');
    if (batUnitType.transRes >= 1) {
        console.log('btres');
        if (Object.keys(bat.transRes).length >= 1) {
            console.log('bres');
            $('#unitInfos').append('<div class="shSpace"></div>');
            $('#unitInfos').append('<span class="blockTitle"><h3>Ressources</h3></span><br>');
            let transportedRes = JSON.stringify(bat.transRes);
            transportedRes = transportedRes.replace(/"/g,"");
            transportedRes = transportedRes.replace(/{/g,"");
            transportedRes = transportedRes.replace(/}/g,"");
            transportedRes = transportedRes.replace(/,/g," &nbsp;&horbar;&nbsp; ");
            transportedRes = transportedRes.replace(/:/g," ");
            let resLoaded = checkResLoad(bat);
            let showTotal = '<span class="cy">'+resLoaded+'</span>/'+resMax;
            $('#unitInfos').append('<span class="paramValue">'+transportedRes+' &nbsp;('+showTotal+')</span><br>');
        }
    }

    // DISMANTLE
    $('#unitInfos').append('<hr>');
    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Démanteler" class="boutonRouge skillButtons" onclick="dismantle('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Démanteler</h4></span>');

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
};

function showEnemyBatInfos(bat) {
    $("#unitInfos").css("display","block");
    $('#unitInfos').empty();
    let alienUnitIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
    let batUnitType = alienUnits[alienUnitIndex];
    let unitsLeft = bat.squadsLeft*batUnitType.squadSize;
    $('#unitInfos').append('<span class="blockTitle"><h3>'+unitsLeft+' '+batUnitType.name+'</h3></span>');
    // SQUADS
    $('#unitInfos').append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.squadsLeft+'/'+batUnitType.squads+'</span><br>');
    let squadHP = batUnitType.squadSize*batUnitType.hp;
    $('#unitInfos').append('<span class="paramName">Dégâts</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Unités/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.squadSize+'</span><br>');
    // PROTECTION
    $('#unitInfos').append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.hp+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Armure</span><span class="paramIcon"></span><span class="paramValue">'+bat.armor+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Taille</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.size+'</span><br>');
    let stealth = getStealth(bat);
    $('#unitInfos').append('<span class="paramName">Discrétion</span><span class="paramIcon"></span><span class="paramValue">'+stealth+'</span><br>');
    if (bat.tags.includes('fluo')) {
        $('#unitInfos').append('<span class="paramName or">Marqué</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    if (bat.tags.includes('shield')) {
        $('#unitInfos').append('<span class="paramName cy">Bouclier</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    // WEAPONS
    let balise;
    let thisWeapon = {};
    if (batUnitType.weapon.rof >= 1) {
        thisWeapon = weaponAdj(batUnitType.weapon,bat,'w1');
        balise = 'h4';
        $('#unitInfos').append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span>');
        $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+'</span><br>');
        let attaques = thisWeapon.rof*bat.squadsLeft;
        $('#unitInfos').append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
    }
    // DISMANTLE
    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Supprimer (Tu triches!)" class="boutonGris skillButtons" onclick="deleteAlien('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Supprimer</h4></span>');

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
    // "skills": []
};

function showTileInfos(tileId) {
    $("#tileInfos").css("display","block");
    $('#tileInfos').empty();
    selectedTile = tileId;
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    $('#tileInfos').append('<span class="blockTitle"><h3>'+terrain.fullName+'</h3></span>');
    $('#tileInfos').append('<div class="shSpace"></div>');
    // NOM
    if (tile.tileName !== undefined && tile.tileName !== null && tile.tileName != '') {
        $('#tileInfos').append('<span class="paramIcon"><i class="fas fa-map-signs"></i></span><span class="fullLine or"><b>'+tile.tileName+'</b></span><br>');
    }
    // Move Cost
    $('#tileInfos').append('<span class="paramName">Coûts de déplacement</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue">+'+terrain.mc+'</span><br>');
    // Cover
    let coverIcon = '';
    if (terrain.cover >= 2) {
        coverIcon = '<i class="fas fa-shield-alt"></i>'
    }
    $('#tileInfos').append('<span class="paramName">Couverture</span><span class="paramIcon">'+coverIcon+'</span><span class="paramValue">'+terrain.cover+'</span><br>');
    // scarp, flood, veg
    let sIcon = '';
    let vIcon = '';
    let fIcon = '';
    if (terrain.veg >= 2) {
        vIcon = '<i class="fab fa-pagelines"></i>'
    }
    if (terrain.scarp >= 2) {
        sIcon = '<i class="fas fa-mountain"></i>'
    }
    if (terrain.flood >= 1) {
        fIcon = '<i class="fas fa-water"></i>'
    }
    $('#tileInfos').append('<span class="paramName">Végétation</span><span class="paramIcon">'+vIcon+'</span><span class="paramValue">'+terrain.veg+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Escarpement</span><span class="paramIcon">'+sIcon+'</span><span class="paramValue">'+terrain.scarp+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Innondation</span><span class="paramIcon">'+fIcon+'</span><span class="paramValue">'+terrain.flood+'</span><br>');
    // Coordonnées
    $('#tileInfos').append('<span class="paramName">Coordonnées</span><span class="paramIcon"><i class="fas fa-map-marker-alt"></i></span><span class="paramValue">'+tile.y+'&lrhar;'+tile.x+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Id</span><span class="paramIcon"></span><span class="paramValue">#'+tile.id+'</span><br>');
    // RESSOURCES
    if (tile.rs !== undefined) {
        let tileIndex;
        let res;
        let bldReq;
        Object.entries(tile.rs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            resIndex = resTypes.findIndex((obj => obj.name == key));
            res = resTypes[resIndex];
            bldReq = onlyFirstLetter(res.bld);
            $('#tileInfos').append('<span class="paramName cy">'+key+'</span><span class="paramIcon"></span><span class="paramValue cy">'+value+' <span class="gf">('+bldReq+'-'+res.rarity+')</span></span><br>');
            // console.log(key,value);
        });
    }
    let srs = getTerrainRes(terrain,tile);
    if (Object.keys(srs).length >= 1) {
        let tileIndex;
        let res;
        let bldReq;
        Object.entries(srs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            resIndex = resTypes.findIndex((obj => obj.name == key));
            res = resTypes[resIndex];
            if (res.bld === 'Comptoir') {
                value = value*3;
            }
            bldReq = onlyFirstLetter(res.bld);
            if (bldReq != '') {
                bldReq = ' ('+bldReq+')'
            }
            $('#tileInfos').append('<span class="paramName sky">'+key+'</span><span class="paramIcon"></span><span class="paramValue sky">'+value+'<span class="gf">'+bldReq+'</span></span><br>');
            // console.log(key,value);
        });
    }
    // RENOMMER
    $('#tileInfos').append('<span class="blockTitle"><h4><button type="button" title="Nommer cet emplacement" class="boutonGris skillButtons" onclick="renameTile('+tileId+')"><i class="fas fa-map-signs"></i></button>&nbsp; Mettre une pancarte</h4></span>');
};

function renameTile(tileId) {
    let newName = prompt('Donnez un nom à cet emplacement :');
    if (newName != null) {
        if (newName.length <= 24) {
            let tileIndex = zone.findIndex((obj => obj.id == tileId));
            zone[tileIndex].tileName = newName;
            saveMap();
            showMap(zone,false);
            showTileInfos(tileId);
        } else {
            // message d'erreur
        }
    }
};
