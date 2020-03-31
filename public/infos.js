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
    let ap = getAP(bat);
    let hourglass = 'start';
    if (bat.apLeft <= 0) {
        hourglass = 'end';
    } else if (bat.apLeft < ap) {
        hourglass = 'half';
    }
    $('#unitInfos').append('<span class="paramName">Points d\'action</span><span class="paramIcon"><i class="fas fa-hourglass-'+hourglass+'"></i></span><span class="paramValue">'+bat.apLeft+'/'+ap+'</span><br>');
    // SQUADS
    $('#unitInfos').append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.squadsLeft+'/'+batUnitType.squads+'</span><br>');
    let squadHP = batUnitType.squadSize*batUnitType.hp;
    $('#unitInfos').append('<span class="paramName">Dégâts</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Unités par escouade</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.squadSize+'</span><br>');
    let totalCrew = batUnitType.crew*batUnitType.squadSize*batUnitType.squads;
    $('#unitInfos').append('<span class="paramName">Personnel</span><span class="paramIcon"></span><span class="paramValue">'+totalCrew+'</span><br>');
    // PROTECTION
    $('#unitInfos').append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.hp+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Armure</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.armor+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Taille</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.size+'</span><br>');
    let stealth = getStealth(bat);
    $('#unitInfos').append('<span class="paramName">Discrétion</span><span class="paramIcon"></span><span class="paramValue">'+stealth+'</span><br>');
    if (bat.tags.includes('guet')) {
        $('#unitInfos').append('<span class="paramName cy">Guet</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    let fortifCover = getCover(bat,true);
    if (bat.tags.includes('fortif')) {
        $('#unitInfos').append('<span class="paramName cy">Fortification</span><span class="paramIcon"></span><span class="paramValue cy">'+fortifCover+'</span><br>');
    }
    // XP
    $('#unitInfos').append('<span class="paramName">Expérience</span><span class="paramIcon"></span><span class="paramValue">'+bat.xp+' (lvl '+bat.vet+')</span><br>');
    // WEAPONS
    if (!isStacked()) {
        weaponsInfos(bat,batUnitType);
        skillsInfos(bat,batUnitType);
    }

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
    // "skills": []
};

function weaponsInfos(bat,batUnitType) {
    let balise;
    let thisWeapon = {};
    let showW1 = true;
    if (batUnitType.weapon.rof >= 1 && batUnitType.weapon2.rof >= 1 && batUnitType.weapon.name == batUnitType.weapon2.name) {
        showW1 = false;
    }
    if (batUnitType.weapon.rof >= 1 && showW1) {
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
        $('#unitInfos').append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+bat.salvoLeft+'/'+batUnitType.maxSalvo+'</span><br>');
        $('#unitInfos').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
        let riposte = 'Oui';
        if (thisWeapon.cost > 6) {
            riposte = 'Non';
        }
        $('#unitInfos').append('<span class="paramName">Riposte</span><span class="paramIcon"></span><span class="paramValue">'+riposte+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Attaques/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.rof+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
        if (thisWeapon.armors != 1) {
            $('#unitInfos').append('<span class="paramName">Armures</span><span class="paramIcon"></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
        }
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Munitions</span><span class="paramIcon"></span><span class="paramValue">'+bat.ammo+'</span><br>');
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
        $('#unitInfos').append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+bat.salvoLeft+'/'+batUnitType.maxSalvo+'</span><br>');
        $('#unitInfos').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Attaques/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.rof+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
        if (thisWeapon.armors != 1) {
            $('#unitInfos').append('<span class="paramName">Armures</span><span class="paramIcon"></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
        }
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Munitions</span><span class="paramIcon"></span><span class="paramValue">'+bat.ammo2+'</span><br>');
    }
};

function skillsInfos(bat,batUnitType) {
    let skillMessage;
    // GUET
    if (batUnitType.weapon.rof >= 1) {
        if (bat.apLeft >= batUnitType.ap-3 && !bat.tags.includes('guet')) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le guet (pas de malus à la riposte) (3 PA)" class="boutonGris iconButtons" onclick="guet()"><i class="fas fa-binoculars"></i></button>&nbsp; Guet</h4></span>');
        } else {
            // pas assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Pas assez de PA" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Guet</h4></span>');
        }
    }
    // FORTIFICATION
    if (batUnitType.skills.includes('fortif')) {
        if (bat.apLeft >= batUnitType.ap-10 && !bat.tags.includes('fortif') && !batInMelee(bat.tileId) && bat.salvoLeft >= batUnitType.maxSalvo) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Se fortifier (bonus couverture) ('+batUnitType.ap+' PA)" class="boutonGris iconButtons" onclick="fortification()"><i class="fas fa-shield-alt"></i></button>&nbsp; Fortification</h4></span>');
        } else {
            // pas assez d'ap
            if (batInMelee(bat.tileId)) {
                skillMessage = "Vous ne pouvez pas vous fortifier en mêlée"
            } else {
                skillMessage = "Pas assez de PA ou de salve"
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Fortification</h4></span>');
        }
    }
    // TIR CIBLE
    // intéressant si précision en dessous de 10
    if (batUnitType.skills.includes('cible')) {
        balise = 'h4';
        if (bat.tags.includes('vise')) {
            balise = 'h1';
        }
        if (bat.apLeft >= 3 && !bat.tags.includes('vise')) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+5 précision, 2/3 cadence de tir (3 PA + coût de l\'arme)" class="boutonGris iconButtons" onclick="tirCible()"><i class="fas fa-crosshairs"></i></button>&nbsp; Tir ciblé</'+balise+'></span>');
        } else {
            // pas assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Pas assez de PA" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Tir ciblé</'+balise+'></span>');
        }
    }
    // MEDIC
    if (batUnitType.skills.includes('medic')) {
        let apCost = 4+batUnitType.squads-bat.squadsLeft;
        if (bat.apLeft >= 4) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Soigner les infanteries adjacentes ('+apCost+' PA par bataillon)" class="boutonGris iconButtons" onclick="medic(`infantry`)"><i class="far fa-heart"></i></button>&nbsp; Soins</h4></span>');
        } else {
            // pas assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="PA épuisés" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Soins</h4></span>');
        }
    }
    // MECANO
    if (batUnitType.skills.includes('mecano')) {
        let apCost = 4+batUnitType.squads-bat.squadsLeft;
        if (bat.apLeft >= 4) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les véhicules adjacents ('+apCost+' PA par bataillon)" class="boutonGris iconButtons" onclick="medic(`vehicles`)"><i class="fa fa-hammer"></i></button>&nbsp; Réparations</h4></span>');
        } else {
            // pas assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="PA épuisés" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Réparations</h4></span>');
        }
    }
};

function showEnemyBatInfos(bat) {
    $('#unitInfos').empty();
    let alienUnitIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
    let batUnitType = alienUnits[alienUnitIndex];
    let unitsLeft = bat.squadsLeft*batUnitType.squadSize;
    $('#unitInfos').append('<span class="blockTitle"><h3>'+unitsLeft+' '+batUnitType.name+'</h3></span>');
    // SQUADS
    $('#unitInfos').append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.squadsLeft+'/'+batUnitType.squads+'</span><br>');
    let squadHP = batUnitType.squadSize*batUnitType.hp;
    $('#unitInfos').append('<span class="paramName">Dégâts</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Unités par escouade</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.squadSize+'</span><br>');
    // PROTECTION
    $('#unitInfos').append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.hp+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Armure</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.armor+'</span><br>');
    $('#unitInfos').append('<span class="paramName">Taille</span><span class="paramIcon"></span><span class="paramValue">'+batUnitType.size+'</span><br>');
    let stealth = getStealth(bat);
    $('#unitInfos').append('<span class="paramName">Discrétion</span><span class="paramIcon"></span><span class="paramValue">'+stealth+'</span><br>');
    // WEAPONS
    let balise;
    let thisWeapon = {};
    if (batUnitType.weapon.rof >= 1) {
        thisWeapon = weaponAdj(batUnitType.weapon,bat,'w1');
        balise = 'h4';
        $('#unitInfos').append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span>');
        $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Attaques/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.rof+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
    }

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
    // "skills": []
};
