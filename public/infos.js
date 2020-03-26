function showTileInfos(tileId) {
    $('#tileInfos').empty();
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    $('#tileInfos').append('<span class="blockTitle"><h3>'+terrain.fullName+'</h3></span>');
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
    if (terrain.scarp >= 1) {
        sIcon = '<i class="fas fa-mountain"></i>'
    }
    if (terrain.flood >= 1) {
        fIcon = '<i class="fas fa-water"></i>'
    }
    $('#tileInfos').append('<span class="paramName">Végétation</span><span class="paramIcon">'+vIcon+'</span><span class="paramValue">'+terrain.veg+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Escarpement</span><span class="paramIcon">'+sIcon+'</span><span class="paramValue">'+terrain.scarp+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Innondation</span><span class="paramIcon">'+fIcon+'</span><span class="paramValue">'+terrain.flood+'</span><br>');
    // Coordonnées
    $('#tileInfos').append('<span class="paramName">Coordonnées</span><span class="paramIcon"><i class="fas fa-map-marker-alt"></i></span><span class="paramValue">'+tile.x+'&lrhar;'+tile.y+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Id</span><span class="paramIcon"></span><span class="paramValue">#'+tile.id+'</span><br>');
};

function showBatInfos(bat) {
    $('#unitInfos').empty();
    let unitTypesIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
    let batUnitType = unitTypes[unitTypesIndex];
    let unitsLeft = bat.squadsLeft*batUnitType.squadSize;
    $('#unitInfos').append('<span class="blockTitle"><h3>'+unitsLeft+' '+batUnitType.name+'</h3></span>');
    // AP
    let hourglass = 'start';
    if (bat.apLeft <= 0) {
        hourglass = 'end';
    } else if (bat.apLeft < batUnitType.ap) {
        hourglass = 'half';
    }
    $('#unitInfos').append('<span class="paramName">Points d\'action</span><span class="paramIcon"><i class="fas fa-hourglass-'+hourglass+'"></i></span><span id="infosMovesLeft" class="paramValue">'+bat.apLeft+'/'+batUnitType.ap+'</span><br>');
    // SQUADS
    $('#unitInfos').append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span id="infosMovesLeft" class="paramValue">'+bat.squadsLeft+'/'+batUnitType.squads+'</span><br>');
    let squadHP = batUnitType.squadSize*batUnitType.hp;
    $('#unitInfos').append('<span class="paramName">Dégâts</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span id="infosMovesLeft" class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Unités par escouade</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.squadSize+'</span><br>');
    let totalCrew = batUnitType.crew*batUnitType.squadSize*batUnitType.squads;
    $('#unitInfos').append('<span class="paramName">Personnel</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+totalCrew+'</span><br>');
    // PROTECTION
    $('#unitInfos').append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.hp+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Armure</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.armor+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Taille</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.size+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Discrétion</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.stealth+'</span><br>');
    // WEAPONS
    let balise;
    let thisWeapon = {};
    if (batUnitType.weapon.rof >= 1) {
        thisWeapon = weaponAdj(batUnitType.weapon,bat,'w1');
        balise = 'h4';
        if (thisWeapon.name === selectedWeap.name) {
            balise = 'h1';
        }
        let w1message = 'Salves épuisées';
        if (bat.salvoLeft >= 1 && bat.apLeft >= thisWeapon.cost) {
            // assez d'ap et de salve
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonGris iconButtons" onclick="fireMode(`w1`)"><i class="ra ra-bullets"></i></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        } else {
            // tir impossible
            if (bat.apLeft < thisWeapon.cost) {
                w1message = 'PA épuisés';
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w1message+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        }
        $('#unitInfos').append('<span class="paramName">Salves</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+bat.salvoLeft+'/'+batUnitType.maxSalvo+'</span><br>');
        $('#unitInfos').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.cost+'</span><br>');
        let riposte = 'Oui';
        if (thisWeapon.cost > 6) {
            riposte = 'Non';
        }
        $('#unitInfos').append('<span class="paramName">Riposte</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+riposte+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.range+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Attaques (par escouade)</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.rof+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.power+'</span><br>');
        if (thisWeapon.armors != 1) {
            $('#unitInfos').append('<span class="paramName">Armures</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
        }
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.aoe+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Munitions</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+bat.ammo+'</span><br>');
    }
    if (batUnitType.weapon2.rof >= 1) {
        thisWeapon = weaponAdj(batUnitType.weapon2,bat,'w2');
        balise = 'h4';
        if (thisWeapon.name === selectedWeap.name) {
            balise = 'h1';
        }
        let w2message = 'Salves épuisées';
        if (bat.salvoLeft >= 1 && bat.apLeft >= thisWeapon.cost) {
            // assez d'ap et de salve
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonGris iconButtons" onclick="fireMode(`w2`)"><i class="ra ra-bullets"></i></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        } else {
            // tir impossible
            if (bat.apLeft < thisWeapon.cost) {
                w2message = 'PA épuisés';
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w2message+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        }
        $('#unitInfos').append('<span class="paramName">Salves</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+bat.salvoLeft+'/'+batUnitType.maxSalvo+'</span><br>');
        $('#unitInfos').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.cost+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.range+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Attaques (par escouade)</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.rof+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.power+'</span><br>');
        if (thisWeapon.armors != 1) {
            $('#unitInfos').append('<span class="paramName">Armures</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
        }
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.aoe+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Munitions</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+bat.ammo2+'</span><br>');
    }

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
    // "skills": []
};

function showEnemyBatInfos(bat) {
    $('#unitInfos').empty();
    let alienUnitIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
    let batUnitType = alienUnits[alienUnitIndex];
    let unitsLeft = bat.squadsLeft*batUnitType.squadSize;
    $('#unitInfos').append('<span class="blockTitle"><h3>'+unitsLeft+' '+batUnitType.name+'</h3></span>');
    // SQUADS
    $('#unitInfos').append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span id="infosMovesLeft" class="paramValue">'+bat.squadsLeft+'/'+batUnitType.squads+'</span><br>');
    let squadHP = batUnitType.squadSize*batUnitType.hp;
    $('#unitInfos').append('<span class="paramName">Dégâts</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span id="infosMovesLeft" class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Unités par escouade</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.squadSize+'</span><br>');
    // PROTECTION
    $('#unitInfos').append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.hp+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Armure</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.armor+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Taille</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.size+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Discrétion</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+batUnitType.stealth+'</span><br>');
    // WEAPONS
    let balise;
    let thisWeapon = {};
    if (batUnitType.weapon.rof >= 1) {
        thisWeapon = weaponAdj(batUnitType.weapon,bat,'w1');
        balise = 'h4';
        $('#unitInfos').append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span>');
        $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.range+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Attaques (par escouade)</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.rof+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.power+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span id="infosMovesLeft" class="paramValue">'+thisWeapon.aoe+'</span><br>');
    }

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
    // "skills": []
};
