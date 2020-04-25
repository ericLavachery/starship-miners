function weaponsInfos(bat,batUnitType) {
    let balise;
    let attaques;
    let thisWeapon = {};
    let showW1 = true;
    let anyTarget = false;
    let inMelee = batInMelee(bat);
    let noFireMelee = false;
    let baseAmmo = 99;
    let ammoLeft = 99;
    if (batUnitType.weapon.rof >= 1 && batUnitType.weapon2.rof >= 1 && batUnitType.weapon.name == batUnitType.weapon2.name) {
        showW1 = false;
    }
    if (batUnitType.weapon.rof >= 1 && showW1) {
        thisWeapon = weaponAdj(batUnitType.weapon,bat,'w1');
        if (inMelee && thisWeapon.noMelee) {
            noFireMelee = true;
        }
        anyTarget = anyAlienInRange(bat.tileId,thisWeapon);
        baseAmmo = thisWeapon.maxAmmo;
        ammoLeft = calcAmmos(bat,baseAmmo);
        balise = 'h4';
        if (thisWeapon.name === selectedWeap.name) {
            balise = 'h1';
        }
        let w1message = 'Salves épuisées';
        if (bat.salvoLeft >= 1 && bat.apLeft >= thisWeapon.cost && ammoLeft >= 1 && anyTarget) {
            // assez d'ap et de salve
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonGris iconButtons" onclick="fireMode(`w1`)"><i class="ra ra-bullets rpg"></i></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        } else {
            // tir impossible
            if (noFireMelee) {
                w1message = 'Tir impossible en mêlée';
            } else {
                if (ammoLeft < 1) {
                    w1message = 'Munitions épuisées';
                } else {
                    if (!anyTarget) {
                        w1message = 'Pas de cible';
                    } else if (bat.apLeft < thisWeapon.cost) {
                        w1message = 'PA épuisés';
                    }
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w1message+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        }
        $('#unitInfos').append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+bat.salvoLeft+'/'+batUnitType.maxSalvo+'</span><br>');
        $('#unitInfos').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
        let riposte = 'Oui';
        if (thisWeapon.noDef) {
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
        if (thisWeapon.noFly) {
            $('#unitInfos').append('<span class="paramName">Tir aérien</span><span class="paramIcon"></span><span class="paramValue">Non</span><br>');
        }
        $('#unitInfos').append('<span class="paramName">Type de munitions</span><span class="paramIcon"></span><span class="paramValue">'+showAmmo(bat.ammo)+'</span><br>');
        if (baseAmmo < 99) {
            $('#unitInfos').append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'</span><br>');
        }
    }
    if (batUnitType.weapon2.rof >= 1) {
        thisWeapon = weaponAdj(batUnitType.weapon2,bat,'w2');
        if (inMelee && thisWeapon.noMelee) {
            noFireMelee = true;
        }
        anyTarget = anyAlienInRange(bat.tileId,thisWeapon);
        baseAmmo = thisWeapon.maxAmmo;
        ammoLeft = calcAmmos(bat,baseAmmo);
        balise = 'h4';
        if (thisWeapon.name === selectedWeap.name) {
            balise = 'h1';
        }
        let w2message = 'Salves épuisées';
        if (bat.salvoLeft >= 1 && bat.apLeft >= thisWeapon.cost && anyTarget && ammoLeft >= 1 && !noFireMelee) {
            // assez d'ap et de salve
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonGris iconButtons" onclick="fireMode(`w2`)"><i class="ra ra-bullets rpg"></i></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        } else {
            // tir impossible
            if (noFireMelee) {
                w2message = 'Tir impossible en mêlée';
            } else {
                if (ammoLeft < 1) {
                    w2message = 'Munitions épuisées';
                } else {
                    if (!anyTarget) {
                        w2message = 'Pas de cible';
                    } else if (bat.apLeft < thisWeapon.cost) {
                        w2message = 'PA épuisés';
                    }
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w2message+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
        }
        $('#unitInfos').append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+bat.salvoLeft+'/'+batUnitType.maxSalvo+'</span><br>');
        $('#unitInfos').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
        riposte = 'Oui';
        if (thisWeapon.noDef) {
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
        if (thisWeapon.noFly) {
            $('#unitInfos').append('<span class="paramName">Tir aérien</span><span class="paramIcon"></span><span class="paramValue">Non</span><br>');
        }
        $('#unitInfos').append('<span class="paramName">Type de munitions</span><span class="paramIcon"></span><span class="paramValue">'+showAmmo(bat.ammo2)+'</span><br>');
        if (baseAmmo < 99) {
            $('#unitInfos').append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'</span><br>');
        }
    }
};

function showAmmo(ammo) {
    let ammoView = ammo;
    ammoView = ammoView.replace('dynamite-','');
    ammoView = ammoView.replace('bombe-','');
    ammoView = ammoView.replace('obus-','');
    ammoView = ammoView.replace('ac-','');
    ammoView = ammoView.replace('sm-','');
    ammoView = ammoView.replace('grenade-','');
    ammoView = ammoView.replace('missile-','');
    ammoView = ammoView.replace('autodestruction','bombe');
    ammoView = ammoView.replace('monomolecular','mono');
    return ammoView;
};
