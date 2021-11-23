function showEnemyBatInfos(bat) {
    $("#unitInfos").css("display","block");
    $('#unitInfos').empty();
    let alienUnitIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
    let batType = alienUnits[alienUnitIndex];
    let unitsLeft = bat.squadsLeft*batType.squadSize;
    let batShowedName = nomVisible(batType.name);
    let compCA = playerInfos.comp.ca;
    if (playerInfos.knownAliens.includes(batType.name)) {
        if (batType.name != 'Vers' && batType.name != 'Blattes') {
            compCA = compCA+2;
        }
    }
    if (batType.class === 'X') {
        compCA = compCA-1;
    }
    if (batType.class === 'B') {
        compCA = compCA-1;
    }
    if (batType.class === 'A') {
        compCA = compCA-2;
    }
    if (batType.class === 'S') {
        compCA = compCA-3;
    }
    if (batType.name === 'Colonie') {
        compCA = compCA-2;
    }
    $('#unitInfos').append('<span class="blockTitle"><h3>'+unitsLeft+' '+batShowedName+'</h3></span>');
    // SQUADS
    $('#unitInfos').append('<span class="paramName">Escouades</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.squadsLeft+'/'+batType.squads+'</span><br>');
    let squadHP = batType.squadSize*batType.hp;
    if (compCA >= 1) {
        $('#unitInfos').append('<span class="paramName">Dégâts</span><span class="paramIcon"><i class="fas fa-heart"></i></span><span class="paramValue">'+bat.damage+'/'+squadHP+'</span><br>');
    }
    $('#unitInfos').append('<span class="paramName">Unités/Escouade</span><span class="paramIcon"></span><span class="paramValue">'+batType.squadSize+'</span><br>');
    // PROTECTION
    if (compCA >= 1) {
        $('#unitInfos').append('<span class="paramName">Points de vie</span><span class="paramIcon"></span><span class="paramValue">'+batType.hp+'</span><br>');
        $('#unitInfos').append('<span class="paramName">Total</span><span class="paramIcon"></span><span class="paramValue">'+squadHP*batType.squads+'</span><br>');
    }
    if (compCA >= 2) {
        let restHP = (squadHP*bat.squadsLeft)-bat.damage;
        $('#unitInfos').append('<span class="paramName">Reste</span><span class="paramIcon"></span><span class="paramValue">'+restHP+'</span><br>');
    }
    if (compCA >= 2) {
        $('#unitInfos').append('<span class="paramName">Armure</span><span class="paramIcon"></span><span class="paramValue">'+bat.armor+'</span><br>');
    } else if (compCA >= 1) {
        let armorEval = getArmorEval(bat.armor);
        $('#unitInfos').append('<span class="paramName">Armure</span><span class="paramIcon"></span><span class="paramValue">'+armorEval+'</span><br>');
    }
    $('#unitInfos').append('<span class="paramName">Taille</span><span class="paramIcon"></span><span class="paramValue">'+batType.size+'</span><br>');
    let stealth = getStealth(bat);
    if (compCA >= 3) {
        $('#unitInfos').append('<span class="paramName">Discrétion</span><span class="paramIcon"></span><span class="paramValue">'+stealth+'</span><br>');
    }
    // SKILLS
    let btweap2ammo = '';
    if (batType.weapon2.ammo != undefined) {
        btweap2ammo = batType.weapon2.ammo;
    }
    if (compCA >= 1) {
        if (Object.keys(batType.weapon).length >= 1) {
            if (batType.skills.includes('venin') || batType.weapon.ammo.includes('venom') || batType.weapon.ammo.includes('poison') || btweap2ammo.includes('poison') || batType.weapon.ammo.includes('toxine') || btweap2ammo.includes('toxine')) {
                $('#unitInfos').append('<span class="paramName">Venimeux</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
            }
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('chancre') || batType.skills.includes('maladie')) {
            $('#unitInfos').append('<span class="paramName">Contagieux</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (Object.keys(batType.weapon).length >= 1) {
            if (batType.weapon.ammo.includes('necro') || btweap2ammo.includes('necro')) {
                $('#unitInfos').append('<span class="paramName">Nécrotoxine</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
            }
        }
    }
    if (compCA >= 3) {
        if (Object.keys(batType.weapon).length >= 1) {
            if (batType.weapon.ammo.includes('parasite') || btweap2ammo.includes('parasite')) {
                $('#unitInfos').append('<span class="paramName">Parasite</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
            }
        }
    }
    if (compCA >= 2) {
        if (Object.keys(batType.weapon).length >= 1) {
            if (batType.skills.includes('grip') || batType.weapon.ammo.includes('web') || btweap2ammo.includes('web') || batType.weapon.ammo.includes('glue') || btweap2ammo.includes('glue') || batType.weapon.ammo.includes('glair') || btweap2ammo.includes('glair') || batType.weapon.ammo.includes('spit') || btweap2ammo.includes('spit') || batType.weapon.ammo.includes('electric') || btweap2ammo.includes('electric')) {
                $('#unitInfos').append('<span class="paramName">Entrave</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
            }
        }
    }
    if (compCA >= 2) {
        if (Object.keys(batType.weapon).length >= 1) {
            if (batType.weapon.ammo.includes('ruche') || btweap2ammo.includes('ruche') || batType.weapon.name.includes('acide')) {
                $('#unitInfos').append('<span class="paramName">Type d\'attaque</span><span class="paramIcon"></span><span class="paramValue">Acide</span><br>');
            }
        }
    }
    if (compCA >= 2) {
        if (Object.keys(batType.weapon).length >= 1) {
            if (batType.weapon.ammo.includes('napalm') || btweap2ammo.includes('napalm') || batType.weapon.ammo.includes('feu') || btweap2ammo.includes('feu')) {
                $('#unitInfos').append('<span class="paramName">Type d\'attaque</span><span class="paramIcon"></span><span class="paramValue">Feu</span><br>');
            }
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('fear') || batType.skills.includes('terror') || batType.skills.includes('dread')) {
            $('#unitInfos').append('<span class="paramName">Répulsion</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 2) {
        if (Object.keys(batType.weapon).length >= 1) {
            if (batType.weapon.ammo.includes('troueur') || btweap2ammo.includes('troueur')) {
                $('#unitInfos').append('<span class="paramName">Troueur</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
            }
        }
    }
    if (compCA >= 2) {
        if (Object.keys(batType.weapon).length >= 1) {
            if (batType.weapon.ammo.includes('creuseur') || btweap2ammo.includes('creuseur')) {
                $('#unitInfos').append('<span class="paramName">Creuseur</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
            }
        }
    }
    if (compCA >= 3) {
        if (Object.keys(batType.weapon).length >= 1) {
            if (batType.weapon.ammo.includes('destructeur') || btweap2ammo.includes('creuseur')) {
                $('#unitInfos').append('<span class="paramName">Destructeur</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
            }
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('baddef')) {
            $('#unitInfos').append('<span class="paramName">Riposte</span><span class="paramIcon"></span><span class="paramValue">Faible</span><br>');
        } else {
            $('#unitInfos').append('<span class="paramName">Riposte</span><span class="paramIcon"></span><span class="paramValue">Normale</span><br>');
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('sentinelle')) {
            $('#unitInfos').append('<span class="paramName">Initiative</span><span class="paramIcon"></span><span class="paramValue">Rapide</span><br>');
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('initmelee')) {
            $('#unitInfos').append('<span class="paramName">Initiative</span><span class="paramIcon"></span><span class="paramValue">Rapide en mêlée</span><br>');
        }
    }
    if (compCA >= 3) {
        if (batType.skills.includes('escape')) {
            $('#unitInfos').append('<span class="paramName">Esquive</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (batType.skills.includes('slowreg')) {
            $('#unitInfos').append('<span class="paramName">Régénération</span><span class="paramIcon"></span><span class="paramValue">Lente</span><br>');
        } else if (batType.skills.includes('regeneration')) {
            $('#unitInfos').append('<span class="paramName">Régénération</span><span class="paramIcon"></span><span class="paramValue">Rapide</span><br>');
        } else if (batType.skills.includes('fastreg') || batType.skills.includes('heal')) {
            $('#unitInfos').append('<span class="paramName">Régénération</span><span class="paramIcon"></span><span class="paramValue">Très rapide</span><br>');
        }
    } else if (compCA >= 2) {
        if (batType.skills.includes('slowreg')) {
            $('#unitInfos').append('<span class="paramName">Régénération</span><span class="paramIcon"></span><span class="paramValue">Lente</span><br>');
        } else if (batType.skills.includes('regeneration') || batType.skills.includes('fastreg') || batType.skills.includes('heal')) {
            $('#unitInfos').append('<span class="paramName">Régénération</span><span class="paramIcon"></span><span class="paramValue">Rapide</span><br>');
        }
    } else if (compCA >= 1) {
        if (batType.skills.includes('regeneration') || batType.skills.includes('slowreg') || batType.skills.includes('fastreg') || batType.skills.includes('heal')) {
            $('#unitInfos').append('<span class="paramName">Régénération</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (batType.skills.includes('ricochet')) {
            $('#unitInfos').append('<span class="paramName">Ricochet</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (batType.skills.includes('shield')) {
            $('#unitInfos').append('<span class="paramName">Bouclier</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (batType.skills.includes('fly')) {
        $('#unitInfos').append('<span class="paramName">Volant</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
    }
    if (batType.skills.includes('sauteur')) {
        $('#unitInfos').append('<span class="paramName">Volant</span><span class="paramIcon"></span><span class="paramValue">Parfois</span><br>');
    }
    if (compCA >= 2) {
        if (batType.skills.includes('fouisseur')) {
            $('#unitInfos').append('<span class="paramName">Fouisseur</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (batType.skills.includes('nez')) {
            $('#unitInfos').append('<span class="paramName">Nez</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('okwater')) {
            $('#unitInfos').append('<span class="paramName">Amphibie</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('hover')) {
            $('#unitInfos').append('<span class="paramName">Aquatique</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (batType.skills.includes('tirailleur')) {
            $('#unitInfos').append('<span class="paramName">Tirailleur</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (batType.skills.includes('bugboost') || batType.skills.includes('larvehide') || batType.skills.includes('spiderboost') || batType.skills.includes('spiderrange') || batType.skills.includes('bugshield') || batType.skills.includes('eggshield')) {
            $('#unitInfos').append('<span class="paramName">Leadership</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('hide')) {
            $('#unitInfos').append('<span class="paramName">Furtif</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (batType.skills.includes('invisible')) {
            $('#unitInfos').append('<span class="paramName">Invisible</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('ponte')) {
            $('#unitInfos').append('<span class="paramName">Ponte</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('morph')) {
            $('#unitInfos').append('<span class="paramName">Métamorphose</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (bat.tags.includes('resistfeu') || batType.skills.includes('resistfeu')) {
            $('#unitInfos').append('<span class="paramName">Résistance feu</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (bat.tags.includes('resistacide') || batType.skills.includes('resistacide')) {
            $('#unitInfos').append('<span class="paramName">Résistance acide</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (bat.tags.includes('resistblast') || batType.skills.includes('resistblast')) {
            $('#unitInfos').append('<span class="paramName">Résistance secousses</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (bat.tags.includes('resistelec') || batType.skills.includes('resistelec')) {
            $('#unitInfos').append('<span class="paramName">Résistance électricité</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (bat.tags.includes('resistpoison') || batType.skills.includes('resistpoison')) {
            $('#unitInfos').append('<span class="paramName">Résistance poison</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 4) {
        if (bat.tags.includes('eatpoison') || batType.skills.includes('eatpoison')) {
            $('#unitInfos').append('<span class="paramName">Imunisé poison</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (batType.skills.includes('noaploss')) {
            $('#unitInfos').append('<span class="paramName">Résistance entrave</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (bat.tags.includes('resistall') || batType.skills.includes('resistall')) {
            $('#unitInfos').append('<span class="paramName">Résistance globale</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (bat.tags.includes('eggprotect') || batType.skills.includes('eggprotect')) {
            $('#unitInfos').append('<span class="paramName">Résistance variable</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 2) {
        if (batType.skills.includes('inflammable')) {
            $('#unitInfos').append('<span class="paramName">Inflammable</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 4) {
        if (bat.tags.includes('reactblast') || batType.skills.includes('reactblast')) {
            $('#unitInfos').append('<span class="paramName">Sensibilité secousses</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    if (compCA >= 3) {
        if (bat.tags.includes('reactpoison') || batType.skills.includes('reactpoison')) {
            $('#unitInfos').append('<span class="paramName">Sensibilité poison</span><span class="paramIcon"></span><span class="paramValue">Oui</span><br>');
        }
    }
    // WEAPONS
    let balise;
    let thisWeapon = {};
    if (compCA >= 1) {
        if (batType.weapon.rof >= 1) {
            $('#unitInfos').append('<div class="shSpace"></div>');
            thisWeapon = weaponAdj(batType.weapon,bat,'w1');
            $('#unitInfos').append('<span class="blockTitle"><h4>'+thisWeapon.name+'</h4></span>');
            if (compCA >= 3) {
                $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+'</span><br>');
            } else if (compCA >= 2) {
                if (thisWeapon.range >= 3) {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Longue distance</span><br>');
                } else if (thisWeapon.range >= 1) {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Distance</span><br>');
                } else {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Mêlée</span><br>');
                }
            } else if (compCA >= 1) {
                if (thisWeapon.range >= 1) {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Distance</span><br>');
                } else {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Mêlée</span><br>');
                }
            }
            if (compCA >= 3) {
                if (thisWeapon.elevation != undefined) {
                    $('#unitInfos').append('<span class="paramName">Elévation</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.elevation+'</span><br>');
                }
            }
            let attaques = thisWeapon.rof*bat.squadsLeft;
            if (compCA >= 3) {
                $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'</span><br>');
            }
            if (compCA >= 2) {
                $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+attaques+' &times '+thisWeapon.power+'</span><br>');
            }
            if (compCA >= 2) {
                $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
            }
        }
    }
    if (compCA >= 3) {
        if (batType.weapon2.rof >= 1) {
            $('#unitInfos').append('<div class="shSpace"></div>');
            thisWeapon = weaponAdj(batType.weapon2,bat,'w2');
            $('#unitInfos').append('<span class="blockTitle"><h4>'+thisWeapon.name+'</h4></span>');
            if (compCA >= 3) {
                $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+'</span><br>');
            } else if (compCA >= 2) {
                if (thisWeapon.range >= 3) {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Longue distance</span><br>');
                } else if (thisWeapon.range >= 1) {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Distance</span><br>');
                } else {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Mêlée</span><br>');
                }
            } else if (compCA >= 1) {
                if (thisWeapon.range >= 1) {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Distance</span><br>');
                } else {
                    $('#unitInfos').append('<span class="paramName">Portée</span><span class="paramIcon"></span><span class="paramValue">Mêlée</span><br>');
                }
            }
            if (compCA >= 3) {
                if (thisWeapon.elevation != undefined) {
                    $('#unitInfos').append('<span class="paramName">Elévation</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.elevation+'</span><br>');
                }
            }
            let attaques = thisWeapon.rof*bat.squadsLeft;
            if (compCA >= 3) {
                $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'</span><br>');
            }
            if (compCA >= 2) {
                $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+attaques+' &times '+thisWeapon.power+'</span><br>');
            }
            if (compCA >= 2) {
                $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
            }
        }
    }
    $('#unitInfos').append('<div class="shSpace"></div>');
    if (compCA >= 5) {
        if (batType.flavText != undefined) {
            $('#unitInfos').append('<span class="paramValue">'+batType.flavText+'</span><br>');
            $('#unitInfos').append('<div class="shSpace"></div>');
        }
    }
    // DISMANTLE
    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Supprimer (Tu triches!)" class="boutonCiel skillButtons" onclick="deleteAlien('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Supprimer</h4></span>');

    // "moveCost": 3,
    // "maxFlood": 3,
    // "maxScarp": 3,
    // "maxVeg": 3,
    // "skills": []
};

function getArmorEval(armor) {
    let armorEval;
    if (armor >= 30) {
        armorEval = 'Impénétrable';
    } else if (armor >= 15) {
        armorEval = 'Excellente';
    } else if (armor >= 8) {
        armorEval = 'Bonne';
    } else if (armor >= 3) {
        armorEval = 'Moyenne';
    } else if (armor >= 1) {
        armorEval = 'Mauvaise';
    } else {
        armorEval = 'Aucune';
    }
    return armorEval;
};
