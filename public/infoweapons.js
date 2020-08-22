function weaponsInfos(bat,batUnitType) {
    let balise;
    let attaques;
    let thisWeapon = {};
    let showW1 = true;
    let anyTarget = false;
    let inMelee = batInMelee(bat);
    let noFireMelee = false;
    let noBisOK = true;
    let baseAmmo = 99;
    let ammoLeft = 99;
    let ravitVolume = 0;
    cheapWeapCost = 99;
    let accFly;
    if (batUnitType.weapon.rof >= 1 && batUnitType.weapon2.rof >= 1 && batUnitType.weapon.name === batUnitType.weapon2.name) {
        showW1 = false;
    }
    // console.log('rofs');
    // console.log(batUnitType.weapon.rof);
    // console.log(batUnitType.weapon2.rof);
    if (batUnitType.weapon.rof >= 1 && showW1) {
        thisWeapon = weaponAdj(batUnitType.weapon,bat,'w1');
        if (!thisWeapon.noAtt) {
            noFireMelee = false;
            if (inMelee && thisWeapon.noMelee) {
                noFireMelee = true;
            }
            // console.log('tileId='+bat.tileId);
            anyTarget = anyAlienInRange(bat,thisWeapon);
            baseAmmo = thisWeapon.maxAmmo;
            ammoLeft = calcAmmos(bat,baseAmmo);
            balise = 'h4';
            if (thisWeapon.name === selectedWeap.name) {
                balise = 'h3';
            }
            noBisOK = true;
            if (thisWeapon.noBis && bat.tags.includes('noBis1')) {
                noBisOK = false;
            }
            let w1message = 'Salves épuisées';
            if (bat.salvoLeft >= 1 && bat.apLeft >= thisWeapon.cost && ammoLeft >= 1 && anyTarget && noBisOK && !noFireMelee) {
                // assez d'ap et de salve
                if (cheapWeapCost > thisWeapon.cost) {
                    cheapWeapCost = thisWeapon.cost;
                }
                $('#unitInfos').append('<div class="shSpace"></div>');
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonGris skillButtons" onclick="fireMode(`w1`)"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
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
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w1message+'" class="boutonGris skillButtons gf"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
            }
            let maxSalves = batUnitType.maxSalvo;
            let resteSalves = bat.salvoLeft;
            if (thisWeapon.noBis) {
                maxSalves = 1;
                if (resteSalves >= 1) {
                    if (bat.tags.includes('noBis1')) {
                        resteSalves = 0;
                    } else {
                        resteSalves = 1;
                    }
                }
            }
            if (bat.salvoLeft >= 1) {
                $('#unitInfos').append('<span class="paramName cy">Salves</span><span class="paramIcon"></span><span class="paramValue cy">'+resteSalves+'/'+maxSalves+'</span><br>');
            } else {
                $('#unitInfos').append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+resteSalves+'/'+maxSalves+'</span><br>');
            }
            // $('#unitInfos').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
            let riposte = 'Oui';
            if (thisWeapon.noDef) {
                riposte = 'Non';
                $('#unitInfos').append('<span class="paramName">Riposte</span><span class="paramIcon"></span><span class="paramValue">'+riposte+'</span><br>');
            }
            let elev = '';
            if (thisWeapon.elevation >= 1) {
                elev = ' (e'+thisWeapon.elevation+')';
            }
            $('#unitInfos').append('<span class="paramName" title="Elevation: '+thisWeapon.elevation+'">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+elev+'</span><br>');
            attaques = thisWeapon.rof*bat.squadsLeft;
            $('#unitInfos').append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
            if (thisWeapon.noFly) {
                accFly = 0;
            } else {
                accFly = Math.round(thisWeapon.accuracy*thisWeapon.dca);
            }
            $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'/'+accFly+'</span><br>');
            $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
            if (thisWeapon.armors != 1) {
                $('#unitInfos').append('<span class="paramName">Armures</span><span class="paramIcon"></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
            }
            $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
            $('#unitInfos').append('<span class="paramName">Type de munitions</span><span class="paramIcon"></span><span class="paramValue">'+showAmmo(bat.ammo)+'</span><br>');
            if (baseAmmo < 99) {
                $('#unitInfos').append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                ravitVolume = calcRavitVolume(bat);
                $('#unitInfos').append('<span class="paramName" title="Volume du ravitaillement">Volume</span><span class="paramIcon"></span><span class="paramValue">'+ravitVolume[1]+'/'+ravitVolume[0]+'</span><br>');
            }
        }
    }
    if (batUnitType.weapon2.rof >= 1) {
        thisWeapon = weaponAdj(batUnitType.weapon2,bat,'w2');
        if (!thisWeapon.noAtt) {
            noFireMelee = false;
            if (inMelee && thisWeapon.noMelee) {
                noFireMelee = true;
            }
            anyTarget = anyAlienInRange(bat,thisWeapon);
            baseAmmo = thisWeapon.maxAmmo;
            ammoLeft = calcAmmos(bat,baseAmmo);
            balise = 'h4';
            if (thisWeapon.name === selectedWeap.name) {
                balise = 'h3';
            }
            noBisOK = true;
            if (thisWeapon.noBis && bat.tags.includes('noBis2')) {
                noBisOK = false;
            }
            let w2message = 'Salves épuisées';
            if (bat.salvoLeft >= 1 && bat.apLeft >= thisWeapon.cost && anyTarget && ammoLeft >= 1 && !noFireMelee && noBisOK) {
                // assez d'ap et de salve
                if (cheapWeapCost > thisWeapon.cost) {
                    cheapWeapCost = thisWeapon.cost;
                }
                $('#unitInfos').append('<div class="shSpace"></div>');
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonGris skillButtons" onclick="fireMode(`w2`)"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
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
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w2message+'" class="boutonGris skillButtons gf"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span>');
            }
            let maxSalves = batUnitType.maxSalvo;
            let resteSalves = bat.salvoLeft;
            if (thisWeapon.noBis) {
                maxSalves = 1;
                if (resteSalves >= 1) {
                    if (bat.tags.includes('noBis2')) {
                        resteSalves = 0;
                    } else {
                        resteSalves = 1;
                    }
                }
            }
            if (bat.salvoLeft >= 1) {
                $('#unitInfos').append('<span class="paramName cy">Salves</span><span class="paramIcon"></span><span class="paramValue cy">'+resteSalves+'/'+maxSalves+'</span><br>');
            } else {
                $('#unitInfos').append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+resteSalves+'/'+maxSalves+'</span><br>');
            }
            // $('#unitInfos').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
            riposte = 'Oui';
            if (thisWeapon.noDef) {
                riposte = 'Non';
                $('#unitInfos').append('<span class="paramName">Riposte</span><span class="paramIcon"></span><span class="paramValue">'+riposte+'</span><br>');
            }
            let elev = '';
            if (thisWeapon.elevation >= 1) {
                elev = ' (e'+thisWeapon.elevation+')';
            }
            $('#unitInfos').append('<span class="paramName" title="Elevation: '+thisWeapon.elevation+'">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+elev+'</span><br>');
            attaques = thisWeapon.rof*bat.squadsLeft;
            $('#unitInfos').append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
            if (thisWeapon.noFly) {
                accFly = 0;
            } else {
                accFly = Math.round(thisWeapon.accuracy*thisWeapon.dca);
            }
            $('#unitInfos').append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.accuracy+'/'+accFly+'</span><br>');
            $('#unitInfos').append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
            if (thisWeapon.armors != 1) {
                $('#unitInfos').append('<span class="paramName">Armures</span><span class="paramIcon"></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
            }
            $('#unitInfos').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.aoe+'</span><br>');
            $('#unitInfos').append('<span class="paramName">Type de munitions</span><span class="paramIcon"></span><span class="paramValue">'+showAmmo(bat.ammo2)+'</span><br>');
            if (baseAmmo < 99) {
                $('#unitInfos').append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                ravitVolume = calcRavitVolume(bat);
                $('#unitInfos').append('<span class="paramName" title="Volume du ravitaillement">Volume</span><span class="paramIcon"></span><span class="paramValue">'+ravitVolume[1]+'/'+ravitVolume[0]+'</span><br>');
            }
        }
    }
};

function showAmmo(ammo) {
    let ammoView = ammo;
    ammoView = ammoView.replace('dynamite-','');
    ammoView = ammoView.replace('bombe-','');
    ammoView = ammoView.replace('obus-','');
    ammoView = ammoView.replace('boulet-','');
    ammoView = ammoView.replace('ac-','');
    ammoView = ammoView.replace('sm-','');
    ammoView = ammoView.replace('cn-','');
    ammoView = ammoView.replace('fleche-','');
    ammoView = ammoView.replace('lame-','');
    ammoView = ammoView.replace('grenade-','');
    ammoView = ammoView.replace('missile-','');
    ammoView = ammoView.replace('lf-','');
    ammoView = ammoView.replace('lt-','');
    ammoView = ammoView.replace('laser-','');
    ammoView = ammoView.replace('molotov-','');
    ammoView = ammoView.replace('fireshells-','');
    ammoView = ammoView.replace('autodestruction','bombe');
    ammoView = ammoView.replace('monomolecular','mono');
    return ammoView;
};
