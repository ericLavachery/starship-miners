function weaponsInfos(bat,batType,pop) {
    let bodyPlace = 'unitInfos';
    if (pop) {
        bodyPlace = 'popbody';
    }
    let balise;
    let attaques;
    let thisWeapon = {};
    let showW1 = true;
    let anyTarget = false;
    let inMelee = batInMelee(bat,batType);
    let noFireMelee = false;
    let noBisOK = true;
    let baseAmmo = 99;
    let ammoLeft = 99;
    let defDef;
    let guetDef;
    let defCol;
    let guetCol;
    if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || batType.skills.includes('initiative')) {
        defCol = 'gff';
        guetCol = 'neutre';
    } else {
        defCol = 'neutre';
        guetCol = 'gff';
    }
    let aoe;
    let ravitVolume = 0;
    cheapWeapCost = 99;
    let accFly;
    let accGround;
    let apOK = false;
    let terrain = getTerrain(bat);
    // if (batType.weapon.rof >= 1 && batType.weapon2.rof >= 1 && batType.weapon.name === batType.weapon2.name) {
    //     showW1 = false;
    // }
    // console.log('rofs');
    // console.log(batType.weapon.rof);
    // console.log(batType.weapon2.rof);
    let hasW1 = false;
    if (!batType.weapon.kit || bat.eq.includes('w2-') || bat.eq.includes('w1-')) {
        hasW1 = true;
    }
    if (batType.weapon.rof >= 1) {
        if (batType.weapon.name.includes('Bélier') || batType.weapon.name.includes('Boutoir') || batType.weapon.name.includes('Moissonneuse')) {
            if (!batType.skills.includes('fly') && terrain.name === 'M') {
                hasW1 = false;
            }
        }
    }
    if (batType.weapon.rof >= 1 && showW1 && hasW1) {
        thisWeapon = weaponAdj(batType.weapon,bat,'w1');
        if (!thisWeapon.noAtt) {
            noFireMelee = false;
            apOK = false;
            if (inMelee && thisWeapon.noMelee) {
                noFireMelee = true;
            }
            // console.log('tileId='+bat.tileId);
            anyTarget = anyAlienInRange(bat,thisWeapon);
            baseAmmo = thisWeapon.maxAmmo;
            ammoLeft = calcAmmos(bat,baseAmmo);
            balise = 'h4';
            if (thisWeapon.num === selectedWeap.num) {
                balise = 'h1';
            }
            noBisOK = true;
            if (thisWeapon.noBis && bat.tags.includes('noBis1')) {
                noBisOK = false;
            }
            let w1message = 'Salves épuisées';
            if (bat.apLeft >= thisWeapon.cost) {
                apOK = true;
            } else {
                if (batType.skills.includes('guerrilla') && bat.tileId != bat.oldTileId && bat.apLeft >= -4+thisWeapon.cost) {
                    apOK = true;
                }
            }
            if (bat.salvoLeft >= 1 && apOK && ammoLeft >= 1 && anyTarget && noBisOK && !noFireMelee) {
                // assez d'ap et de salve
                if (cheapWeapCost > thisWeapon.cost) {
                    cheapWeapCost = thisWeapon.cost;
                }
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                if (pop) {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonJaune skillButtons" onclick="fireMode(`w1`)"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span><br>');
                }
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
                        } else if (!apOK) {
                            w1message = 'PA épuisés';
                        }
                    }
                }
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                if (pop) {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w1message+'" class="boutonGris skillButtons gf"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span><br>');
                }
            }
            let maxSalves = batType.maxSalvo;
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
                $('#'+bodyPlace).append('<span class="paramName cy">Salves</span><span class="paramIcon"></span><span class="paramValue cy">'+resteSalves+'/'+maxSalves+'</span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+resteSalves+'/'+maxSalves+'</span><br>');
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
            }
            let riposte = 'Oui';
            if (thisWeapon.noDef) {
                riposte = 'Non';
                $('#'+bodyPlace).append('<span class="paramName">Riposte</span><span class="paramIcon"></span><span class="paramValue">'+riposte+'</span><br>');
            }
            let elev = '';
            if (thisWeapon.elevation >= 1) {
                elev = ' (e'+thisWeapon.elevation+')';
            }
            $('#'+bodyPlace).append('<span class="paramName" title="Elevation: '+thisWeapon.elevation+'">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+elev+'</span><br>');
            attaques = thisWeapon.rof*bat.squadsLeft;
            // chargeur
            if (bat.eq.includes('chargeur') || bat.eq.includes('carrousel') || bat.eq.includes('kit-chouf') || bat.eq === 'crimekitch' || bat.eq === 'crimekitto' || bat.eq.includes('landerwkit') || bat.eq.includes('w2-l')) {
                attaques = chargeurAdj(bat,attaques,thisWeapon);
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
            }
            // DEFENSE
            if (thisWeapon.noMelee || thisWeapon.noDef) {
                defDef = 0;
                guetDef = 0;
            } else {
                defDef = calcBrideDef(bat,batType,thisWeapon,0,false);
                defDef = Math.round(defDef*100);
                guetDef = calcBrideDef(bat,batType,thisWeapon,0,true);
                guetDef = Math.round(guetDef*100);
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Défense en mêlée</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
            }
            if (thisWeapon.noDef) {
                defDef = 0;
                guetDef = 0;
            } else {
                defDef = calcBrideDef(bat,batType,thisWeapon,1,false);
                defDef = Math.round(defDef*100);
                guetDef = calcBrideDef(bat,batType,thisWeapon,1,true);
                guetDef = Math.round(guetDef*100);
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Défense à distance</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
            }
            // ACCURACY
            if (thisWeapon.noFly) {
                accFly = 0;
            } else {
                accFly = Math.round(thisWeapon.accuracy*thisWeapon.dca);
            }
            if (thisWeapon.noGround) {
                accGround = 0;
            } else {
                accGround = thisWeapon.accuracy;
            }
            $('#'+bodyPlace).append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+accGround+' &Map; '+accFly+'</span><br>');
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
            } else {
                if (thisWeapon.aoe === 'unit') {
                    aoe = 'u';
                }
                if (thisWeapon.aoe === 'brochette') {
                    aoe = 'u+';
                }
                if (thisWeapon.aoe === 'squad') {
                    aoe = 's';
                }
                if (thisWeapon.aoe === 'bat') {
                    aoe = 'b';
                }
                $('#'+bodyPlace).append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+attaques+' &times '+thisWeapon.power+' '+aoe+'</span><br>');
            }
            if (thisWeapon.armors != 1) {
                $('#'+bodyPlace).append('<span class="paramName">Armures</span><span class="paramIcon"></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
            }
            if (pop) {
                aoe = thisWeapon.aoe;
                if (thisWeapon.aoe === 'unit') {
                    aoe = 'unité';
                }
                if (thisWeapon.aoe === 'squad') {
                    aoe = 'escouade';
                }
                if (thisWeapon.aoe === 'bat') {
                    aoe = 'bataillon';
                }
                $('#'+bodyPlace).append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+aoe+'</span><br>');
            }
            $('#'+bodyPlace).append('<span class="paramName">Type de munitions</span><span class="paramIcon"></span><span class="paramValue lcy">'+showAmmo(bat.ammo)+'</span><br>');
            if (baseAmmo < 99) {
                if (ammoLeft <= batType.maxSalvo) {
                    $('#'+bodyPlace).append('<span class="paramName or">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue or">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                }
                ravitVolume = calcRavitVolume(bat);
                $('#'+bodyPlace).append('<span class="paramName" title="Volume du ravitaillement">Volume</span><span class="paramIcon"></span><span class="paramValue">'+ravitVolume[1]+'/'+ravitVolume[0]+'</span><br>');
            }
        }
    }
    let hasW2 = false;
    if (!batType.weapon2.kit || bat.eq.includes('kit-') || bat.eq.includes('w2-')) {
        hasW2 = true;
    }
    if (batType.weapon2.rof >= 1) {
        if (batType.weapon2.name.includes('Bélier') || batType.weapon2.name.includes('Boutoir') || batType.weapon2.name.includes('Moissonneuse')) {
            if (!batType.skills.includes('fly') && terrain.name === 'M') {
                hasW2 = false;
            }
        }
    }
    if (batType.weapon2.rof >= 1 && hasW2) {
        thisWeapon = weaponAdj(batType.weapon2,bat,'w2');
        if (!thisWeapon.noAtt) {
            noFireMelee = false;
            apOK = false;
            if (inMelee && thisWeapon.noMelee) {
                noFireMelee = true;
            }
            anyTarget = anyAlienInRange(bat,thisWeapon);
            baseAmmo = thisWeapon.maxAmmo;
            ammoLeft = calcAmmos(bat,baseAmmo);
            balise = 'h4';
            if (thisWeapon.num === selectedWeap.num) {
                balise = 'h1';
            }
            noBisOK = true;
            if (thisWeapon.noBis && bat.tags.includes('noBis2')) {
                noBisOK = false;
            }
            let w2message = 'Salves épuisées';
            if (bat.apLeft >= thisWeapon.cost) {
                apOK = true;
            } else {
                if (batType.skills.includes('guerrilla') && bat.tileId != bat.oldTileId && bat.apLeft >= -4+thisWeapon.cost) {
                    apOK = true;
                }
            }
            if (bat.salvoLeft >= 1 && apOK && anyTarget && ammoLeft >= 1 && !noFireMelee && noBisOK) {
                // assez d'ap et de salve
                if (cheapWeapCost > thisWeapon.cost) {
                    cheapWeapCost = thisWeapon.cost;
                }
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                if (pop) {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="boutonJaune skillButtons" onclick="fireMode(`w2`)"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span><br>');
                }
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
                        } else if (!apOK) {
                            w2message = 'PA épuisés';
                        }
                    }
                }
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                if (pop) {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w2message+'" class="boutonGris skillButtons gf"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span><br>');
                }
            }
            let maxSalves = batType.maxSalvo;
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
                $('#'+bodyPlace).append('<span class="paramName cy">Salves</span><span class="paramIcon"></span><span class="paramValue cy">'+resteSalves+'/'+maxSalves+'</span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="paramName">Salves</span><span class="paramIcon"></span><span class="paramValue">'+resteSalves+'/'+maxSalves+'</span><br>');
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
            }
            riposte = 'Oui';
            if (thisWeapon.noDef) {
                riposte = 'Non';
                $('#'+bodyPlace).append('<span class="paramName">Riposte</span><span class="paramIcon"></span><span class="paramValue">'+riposte+'</span><br>');
            }
            let elev = '';
            if (thisWeapon.elevation >= 1) {
                elev = ' (e'+thisWeapon.elevation+')';
            }
            $('#'+bodyPlace).append('<span class="paramName" title="Elevation: '+thisWeapon.elevation+'">Portée</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.range+elev+'</span><br>');
            attaques = thisWeapon.rof*bat.squadsLeft;
            // chargeur
            if (bat.eq.includes('chargeur') || bat.eq.includes('carrousel') || bat.eq.includes('kit-chouf') || bat.eq === 'crimekitch' || bat.eq === 'crimekitto' || bat.eq.includes('landerwkit') || bat.eq.includes('w2-l')) {
                attaques = chargeurAdj(bat,attaques,thisWeapon);
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
            }
            // DEFENSE
            if (thisWeapon.noMelee || thisWeapon.noDef) {
                defDef = 0;
                guetDef = 0;
            } else {
                defDef = calcBrideDef(bat,batType,thisWeapon,0,false);
                defDef = Math.round(defDef*100);
                guetDef = calcBrideDef(bat,batType,thisWeapon,0,true);
                guetDef = Math.round(guetDef*100);
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Défense en mêlée</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
            }
            if (thisWeapon.noDef) {
                defDef = 0;
                guetDef = 0;
            } else {
                defDef = calcBrideDef(bat,batType,thisWeapon,1,false);
                defDef = Math.round(defDef*100);
                guetDef = calcBrideDef(bat,batType,thisWeapon,1,true);
                guetDef = Math.round(guetDef*100);
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Défense à distance</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
            }
            // ACCURACY
            if (thisWeapon.noFly) {
                accFly = 0;
            } else {
                accFly = Math.round(thisWeapon.accuracy*thisWeapon.dca);
            }
            if (thisWeapon.noGround) {
                accGround = 0;
            } else {
                accGround = thisWeapon.accuracy;
            }
            $('#'+bodyPlace).append('<span class="paramName">Précision</span><span class="paramIcon"></span><span class="paramValue">'+accGround+' &Map; '+accFly+'</span><br>');
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
            } else {
                if (thisWeapon.aoe === 'unit') {
                    aoe = 'u';
                }
                if (thisWeapon.aoe === 'brochette') {
                    aoe = 'u+';
                }
                if (thisWeapon.aoe === 'squad') {
                    aoe = 's';
                }
                if (thisWeapon.aoe === 'bat') {
                    aoe = 'b';
                }
                $('#'+bodyPlace).append('<span class="paramName">Puisance</span><span class="paramIcon"></span><span class="paramValue">'+attaques+' &times '+thisWeapon.power+' '+aoe+'</span><br>');
            }
            if (thisWeapon.armors != 1) {
                $('#'+bodyPlace).append('<span class="paramName">Armures</span><span class="paramIcon"></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
            }
            if (pop) {
                aoe = thisWeapon.aoe;
                if (thisWeapon.aoe === 'unit') {
                    aoe = 'unité';
                }
                if (thisWeapon.aoe === 'squad') {
                    aoe = 'escouade';
                }
                if (thisWeapon.aoe === 'bat') {
                    aoe = 'bataillon';
                }
                $('#'+bodyPlace).append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+aoe+'</span><br>');
            }
            $('#'+bodyPlace).append('<span class="paramName">Type de munitions</span><span class="paramIcon"></span><span class="paramValue lcy">'+showAmmo(bat.ammo2)+'</span><br>');
            if (baseAmmo < 99) {
                if (ammoLeft <= batType.maxSalvo) {
                    $('#'+bodyPlace).append('<span class="paramName or">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue or">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                }
                ravitVolume = calcRavitVolume(bat);
                $('#'+bodyPlace).append('<span class="paramName" title="Volume du ravitaillement">Volume</span><span class="paramIcon"></span><span class="paramValue">'+ravitVolume[1]+'/'+ravitVolume[0]+'</span><br>');
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
    ammoView = ammoView.replace('gaz--','');
    ammoView = ammoView.replace('autodestruction','bombe');
    ammoView = ammoView.replace('monomolecular','mono');
    return ammoView;
};

function showAmmoInfo(ammoName) {
    let ammoIndex = ammoTypes.findIndex((obj => obj.name == ammoName));
    let ammo = ammoTypes[ammoIndex];
    let ammoInfo = '';
    if (ammo.range > 1.2) {
        ammoInfo = ammoInfo+'Portée++ ';
    } else if (ammo.range > 1) {
        ammoInfo = ammoInfo+'Portée+ ';
    }
    if (ammo.rof >= 1.3) {
        ammoInfo = ammoInfo+'Cadence++ ';
    } else if (ammo.rof > 1) {
        ammoInfo = ammoInfo+'Cadence+ ';
    }
    if (ammo.rof < 1) {
        ammoInfo = ammoInfo+'Cadence- ';
    }
    if (ammo.power >= 9) {
        ammoInfo = ammoInfo+'Puissance+++ ';
    } else if (ammo.power >= 3 || ammo.powermult >= 1.4) {
        ammoInfo = ammoInfo+'Puissance++ ';
    } else if (ammo.power > 0 || ammo.powermult > 1) {
        ammoInfo = ammoInfo+'Puissance+ ';
    }
    if (ammo.power < 0 || ammo.powermult < 1) {
        ammoInfo = ammoInfo+'Puissance- ';
    }
    if (ammo.armors < 0.2) {
        ammoInfo = ammoInfo+'Pénétration+++ ';
    } else if (ammo.armors < 0.5) {
        ammoInfo = ammoInfo+'Pénétration++ ';
    } else if (ammo.armors < 1) {
        ammoInfo = ammoInfo+'Pénétration+ ';
    }
    if (ammo.armors >= 1.4) {
        ammoInfo = ammoInfo+'Pénétration-- ';
    } else if (ammo.armors > 1) {
        ammoInfo = ammoInfo+'Pénétration- ';
    }
    if (ammo.accuracy > 1.3) {
        ammoInfo = ammoInfo+'Précision++ ';
    } else if (ammo.accuracy > 1) {
        ammoInfo = ammoInfo+'Précision+ ';
    }
    if (ammo.accuracy < 1) {
        ammoInfo = ammoInfo+'Précision- ';
    }
    if (ammo.apdamage > 0) {
        ammoInfo = ammoInfo+'Entrave ';
    }
    if (ammo.aoe != '') {
        if (ammo.aoe == 'unit') {
            ammoInfo = ammoInfo+'Unité ';
        }
        if (ammo.aoe == 'brochette') {
            ammoInfo = ammoInfo+'Unités ';
        }
        if (ammo.aoe == 'squad') {
            ammoInfo = ammoInfo+'Escouade ';
        }
        if (ammo.aoe == 'bat') {
            ammoInfo = ammoInfo+'Bataillon ';
        }
    }
    if (ammo.info != undefined) {
        ammoInfo = ammoInfo+ammo.info+' ';
    }
    return ammoInfo;
};

function showEquipInfo(equipName) {
    let equipIndex = armorTypes.findIndex((obj => obj.name == equipName));
    let equip = armorTypes[equipIndex];
    let equipInfo = '';
    if (equip.info != undefined) {
        equipInfo = equipInfo+equip.info+' ';
    }
    return equipInfo;
};
