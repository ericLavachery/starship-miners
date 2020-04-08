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
    if (bat.tags.includes('camo')) {
        $('#unitInfos').append('<span class="paramName cy">Mode furtif</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (bat.tags.includes('embuscade')) {
        $('#unitInfos').append('<span class="paramName cy">Embuscade</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    if (bat.tags.includes('guet')) {
        $('#unitInfos').append('<span class="paramName cy">Guet</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    let fortifCover = getCover(bat,true);
    if (bat.tags.includes('fortif')) {
        $('#unitInfos').append('<span class="paramName cy">Fortification</span><span class="paramIcon"></span><span class="paramValue cy">'+fortifCover+'</span><br>');
    }
    if (batUnitType.skills.includes('berserk') && bat.damage >= 1) {
        $('#unitInfos').append('<span class="paramName cy">Berserk</span><span class="paramIcon"></span><span class="paramValue cy">Oui</span><br>');
    }
    // BAD TAGS
    if (bat.tags.includes('venin') || bat.tags.includes('poison')) {
        $('#unitInfos').append('<span class="paramName or">Empoisonnement</span><span class="paramIcon"></span><span class="paramValue or">Oui</span><br>');
    }
    // XP
    $('#unitInfos').append('<span class="paramName">Expérience</span><span class="paramIcon"></span><span class="paramValue">'+bat.xp+' (niv '+bat.vet+')</span><br>');
    // WEAPONS & SKILLS
    if (!isStacked()) {
        weaponsInfos(bat,batUnitType);
        skillsInfos(bat,batUnitType);
    }
    // ARMIES
    $('#unitInfos').append('<span class="blockTitle"><h3>Armée</h3></span><br>');
    let army = 1;
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

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
    // "skills": []
};

function weaponsInfos(bat,batUnitType) {
    let balise;
    let attaques;
    let thisWeapon = {};
    let showW1 = true;
    let anyTarget = false;
    if (batUnitType.weapon.rof >= 1 && batUnitType.weapon2.rof >= 1 && batUnitType.weapon.name == batUnitType.weapon2.name) {
        showW1 = false;
    }
    if (batUnitType.weapon.rof >= 1 && showW1) {
        thisWeapon = weaponAdj(batUnitType.weapon,bat,'w1');
        anyTarget = anyAlienInRange(bat.tileId,thisWeapon.range);
        balise = 'h4';
        if (thisWeapon.name === selectedWeap.name) {
            balise = 'h1';
        }
        let w1message = 'Salves épuisées';
        if (bat.salvoLeft >= 1 && bat.apLeft >= thisWeapon.cost && anyTarget) {
            // assez d'ap et de salve
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonGris iconButtons" onclick="fireMode(`w1`)"><i class="ra ra-bullets rpg"></i></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        } else {
            // tir impossible
            if (!anyTarget) {
                w1message = 'Pas de cible';
            }else if (bat.apLeft < thisWeapon.cost) {
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
        attaques = thisWeapon.rof*bat.squadsLeft;
        $('#unitInfos').append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
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
        anyTarget = anyAlienInRange(bat.tileId,thisWeapon.range);
        let baseAmmo = 999;
        if (thisWeapon.ammo == 'x1') {
            baseAmmo = 1;
        } else if (thisWeapon.ammo == 'x4') {
            baseAmmo = 4;
        }
        let ammoLeft = calcAmmos(bat,baseAmmo);
        balise = 'h4';
        if (thisWeapon.name === selectedWeap.name) {
            balise = 'h1';
        }
        let w2message = 'Salves épuisées';
        if (bat.salvoLeft >= 1 && bat.apLeft >= thisWeapon.cost && anyTarget && ammoLeft >= 1) {
            // assez d'ap et de salve
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonGris iconButtons" onclick="fireMode(`w2`)"><i class="ra ra-bullets rpg"></i></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        } else {
            // tir impossible
            if (ammoLeft < 1) {
                w2message = 'Munitions épuisées';
            } else {
                if (!anyTarget) {
                    w2message = 'Pas de cible';
                } else if (bat.apLeft < thisWeapon.cost) {
                    w2message = 'PA épuisés';
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w2message+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        }
        $('#unitInfos').append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+bat.salvoLeft+'/'+batUnitType.maxSalvo+'</span><br>');
        $('#unitInfos').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+'</span><br>');
        attaques = thisWeapon.rof*bat.squadsLeft;
        $('#unitInfos').append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
        if (thisWeapon.armors != 1) {
            $('#unitInfos').append('<span class="paramName">Armures</span><span class="paramIcon"></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
        }
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
        if (bat.ammo2 != 'x4' && bat.ammo2 != 'x1') {
            $('#unitInfos').append('<span class="paramName">Type de munitions</span><span class="paramIcon"></span><span class="paramValue">'+bat.ammo2+'</span><br>');
        }
        if (baseAmmo < 900) {
            $('#unitInfos').append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'</span><br>');
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
        let attaques = thisWeapon.rof*bat.squadsLeft;
        $('#unitInfos').append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
    }
    // DISMANTLE
    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Supprimer (Tu triches!)" class="boutonGris iconButtons" onclick="deleteAlien('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Supprimer</h4></span>');

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
    // "skills": []
};
