function weaponsInfos(bat,batType,tile,pop) {
    let bodyPlace = 'unitInfos';
    if (pop) {
        bodyPlace = 'popbody';
    }
    let balise;
    let attaques;
    let thisWeapon = {};
    let showW1 = true;
    let anyTarget = false;
    batHasTarget = false;
    let inMelee = batInMelee(bat,batType);
    let onInfra = false;
    if (tile.infra != undefined) {
        if (tile.infra != 'Terriers' && tile.infra != 'Débris') {
            onInfra = true;
        }
    }
    let noFireMelee = false;
    let noBisOK = true;
    let baseAmmo = 99;
    let ammoLeft = 99;
    let defDef;
    let guetDef;
    let defCol;
    let guetCol;
    if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || hasEquip(bat,['detector','g2ai']) || batType.skills.includes('initiative')) {
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
    let hasW1 = checkHasWeapon(1,batType,bat.eq);
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
            if (inMelee && thisWeapon.noMelee && !onInfra) {
                noFireMelee = true;
            }
            let grisee = false;
            if (bat.tags.includes('datt')) {
                if (thisWeapon.isPrec || thisWeapon.isBow || thisWeapon.noDatt) {
                    grisee = true;
                }
            }
            if (bat.tags.includes('vise')) {
                if (!thisWeapon.isPrec) {
                    grisee = true;
                }
            }
            anyTarget = anyAlienInRange(bat,thisWeapon);
            let inDanger = checkInDanger(bat,batType);
            if (bat.tags.includes('nomove') && inDanger && bat.fuzz <= -2) {
                anyTarget = false;
            }
            if (anyTarget) {
                batHasTarget = true;
            }
            baseAmmo = thisWeapon.maxAmmo;
            ammoLeft = calcAmmos(bat,baseAmmo);
            balise = 'h4';
            let leBouton = 'boutonJaune';
            let colBouton = 'blanc';
            let colIcon = 'gf';
            if (thisWeapon.num === selectedWeap.num) {
                balise = 'h3';
                leBouton = 'boutonOK';
                colBouton = 'cy';
                colIcon = 'cy';
            } else if (selectedWeap.num != undefined) {
                balise = 'h4';
                leBouton = 'boutonGrey';
                colBouton = 'gf';
                colIcon = 'gff';
            } else if (grisee) {
                leBouton = 'boutonJauneG';
                colBouton = 'blanc';
                colIcon = 'gf';
            }
            noBisOK = true;
            if (thisWeapon.noBis && bat.tags.includes('noBis1')) {
                noBisOK = false;
            }
            let w1message = 'Salves épuisées';
            if (bat.apLeft >= thisWeapon.cost) {
                apOK = true;
            } else {
                if (batType.skills.includes('guerrilla') || batType.skills.includes('freeshot') || batType.cat === 'buildings') {
                    if (bat.apLeft >= -4+thisWeapon.cost) {
                        apOK = true;
                    }
                }
            }
            let hasControl = true;
            if (batType.skills.includes('mustcontrol') && bat.tags.includes('nomove')) {
                hasControl = false;
            }
            if (batType.skills.includes('camocontrol') && bat.tags.includes('nomove') && bat.fuzz <= -2) {
                hasControl = false;
            }
            let tirOK = true;
            if (bat.salvoLeft >= 1 && apOK && ammoLeft >= 1 && anyTarget && noBisOK && !noFireMelee && hasControl) {
                // assez d'ap et de salve
                if (cheapWeapCost > thisWeapon.cost) {
                    cheapWeapCost = thisWeapon.cost;
                }
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                if (pop) {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="'+leBouton+' iconButtons '+colBouton+'" onclick="fireMode(`w1`,false)"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span><br>');
                }
            } else {
                // tir impossible
                tirOK = false;
                if (!hasControl) {
                    w1message = 'Pas de tir si vous ne contrôlez pas le bataillon';
                } else if (noFireMelee) {
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
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w1message+'" class="boutonGrey iconButtons gf"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span><br>');
                }
            }
            doubleAttaque(bat,batType,thisWeapon,bodyPlace,tirOK);
            bullseyeShot(bat,batType,thisWeapon,bodyPlace,inMelee,tirOK);
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
            if (resteSalves >= 1) {
                $('#'+bodyPlace).append('<span class="paramName">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+resteSalves+'/'+maxSalves+'</span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="paramName or">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue or">'+resteSalves+'/'+maxSalves+'</span><br>');
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
            }
            let riposte = 'Oui';
            if (thisWeapon.noDef) {
                riposte = 'Non';
                $('#'+bodyPlace).append('<span class="paramName">Riposte</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+riposte+'</span><br>');
            }
            let elev = '';
            if (thisWeapon.elevation >= 1) {
                elev = ' <span class="gff">('+batType.weapon.range+'e'+thisWeapon.elevation+')</span>';
            }
            $('#'+bodyPlace).append('<span class="paramName" title="Elevation: '+thisWeapon.elevation+'">Portée</span><span class="paramIcon '+colIcon+'"><i class="fas fa-rss"></i></span><span class="paramValue">'+thisWeapon.range+elev+'</span><br>');
            attaques = thisWeapon.rof*bat.squadsLeft;
            // chargeur
            attaques = chargeurAdj(bat,attaques,thisWeapon);
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
            $('#'+bodyPlace).append('<span class="paramName">Précision</span><span class="paramIcon '+colIcon+'"><i class="fas fa-bullseye"></i></span><span class="paramValue">'+accGround+' &Map; '+accFly+'</span><br>');
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Puissance</span><span class="paramIcon"><i class="ra ra-bullets rpg"></i></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
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
                $('#'+bodyPlace).append('<span class="paramName">Puissance</span><span class="paramIcon '+colIcon+'"><i class="ra ra-bullets rpg"></i></span><span class="paramValue">'+attaques+' &times '+thisWeapon.power+' '+aoe+'</span><br>');
            }
            $('#'+bodyPlace).append('<span class="paramName">Armures</span><span class="paramIcon '+colIcon+'"><i class="fas fa-shield-alt"></i></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
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
            let noman = 'Type de munitions';
            if (bat.ammo.includes('lame')) {
                noman = 'Type de lame';
            }
            $('#'+bodyPlace).append('<span class="paramName">'+noman+'</span><span class="paramIcon"></span><span class="paramValue lcy klik" onclick="equipDetails(`'+bat.ammo+'`,true)">'+showAmmo(bat.ammo)+'</span><br>');
            if (baseAmmo < 99) {
                if (ammoLeft <= batType.maxSalvo) {
                    $('#'+bodyPlace).append('<span class="paramName or">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue or">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                }
                ravitVolume = calcRavitVolume(bat);
                $('#'+bodyPlace).append('<span class="paramName" title="Volume du ravitaillement">Volume</span><span class="paramIcon"></span><span class="paramValue">'+ravitVolume[1]+'/'+ravitVolume[0]+'</span><br>');
                if (batType.weapon.ravitBld != undefined) {
                    let ravitBlds = batType.weapon.ravitBld;
                    if (!ravitBlds.includes('Poudrière')) {
                        ravitBlds = ravitBlds+', Poudrière';
                    }
                    $('#'+bodyPlace).append('<span class="paramName" title="Bâtiment(s) requis pour le ravitaillement">Bâtiment(s)</span><span class="paramIcon"></span><span class="paramValue">'+ravitBlds+'</span><br>');
                }
            }
            if (thisWeapon.noise < 2) {
                let tirFurtif = calcTirFurtif(thisWeapon,bat,1);
                $('#'+bodyPlace).append('<span class="paramName" title="Chance de rester furtif après avoir attaqué">Tir furtif</span><span class="paramIcon"></span><span class="paramValue">'+tirFurtif+'%</span><br>');
                if (thisWeapon.hide) {
                    $('#'+bodyPlace).append('<span class="paramName jaune" title="Pas de riposte si tir furtif réussi">Tir gratuit</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
                }
            }
            if (batType.skills.includes('cible') || (batType.skills.includes('aicible') && hasEquip(bat,['g2ai'])) || (batType.skills.includes('w2cible') && (bat.eq === 'w2-pgun' || bat.eq === 'w2-flaser' || bat.eq === 'w2-laser'))) {
                if (bat.tags.includes('vise')) {
                    if (thisWeapon.isPrec) {
                        $('#'+bodyPlace).append('<span class="paramName cy">Bullseye</span><span class="paramIcon cy"><i class="fas fa-crosshairs"></i></span><span class="paramValue cy">Oui</span><br>');
                    } else {
                        $('#'+bodyPlace).append('<span class="paramName or">Bullseye</span><span class="paramIcon or"><i class="fas fa-crosshairs"></i></span><span class="paramValue or">Non</span><br>');
                    }
                } else {
                    if (thisWeapon.isPrec) {
                        $('#'+bodyPlace).append('<span class="paramName">Bullseye</span><span class="paramIcon gf"><i class="fas fa-crosshairs"></i></span><span class="paramValue">Oui</span><br>');
                    }
                }
            }
            if (batType.skills.includes('datt')) {
                if (bat.tags.includes('datt')) {
                    if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                        $('#'+bodyPlace).append('<span class="paramName cy">Double attaque</span><span class="paramIcon cy"><i class="ra ra-fire rpg"></i></span><span class="paramValue cy">Oui</span><br>');
                    } else {
                        $('#'+bodyPlace).append('<span class="paramName or">Double attaque</span><span class="paramIcon or"><i class="ra ra-fire rpg"></i></span><span class="paramValue or">Non</span><br>');
                    }
                } else {
                    if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                        $('#'+bodyPlace).append('<span class="paramName">Double attaque</span><span class="paramIcon gf"><i class="ra ra-fire rpg"></i></span><span class="paramValue">Oui</span><br>');
                    }
                }
            }
        }
    }
    let hasW2 = checkHasWeapon(2,batType,bat.eq);
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
            if (inMelee && thisWeapon.noMelee && !onInfra) {
                noFireMelee = true;
            }
            let grisee = false;
            if (bat.tags.includes('datt')) {
                if (thisWeapon.isPrec || thisWeapon.isBow || thisWeapon.noDatt) {
                    grisee = true;
                }
            }
            if (bat.tags.includes('vise')) {
                if (!thisWeapon.isPrec) {
                    grisee = true;
                }
            }
            anyTarget = anyAlienInRange(bat,thisWeapon);
            let inDanger = checkInDanger(bat,batType);
            if (bat.tags.includes('nomove') && inDanger && bat.fuzz <= -2) {
                anyTarget = false;
            }
            if (anyTarget) {
                batHasTarget = true;
            }
            baseAmmo = thisWeapon.maxAmmo;
            ammoLeft = calcAmmos(bat,baseAmmo);
            balise = 'h4';
            let leBouton = 'boutonJaune';
            let colBouton = 'blanc';
            let colIcon = 'gf';
            if (thisWeapon.num === selectedWeap.num) {
                balise = 'h3';
                leBouton = 'boutonOK';
                colBouton = 'cy';
                colIcon = 'cy';
            } else if (selectedWeap.num != undefined) {
                balise = 'h4';
                leBouton = 'boutonGrey';
                colBouton = 'gf';
                colIcon = 'gff';
            } else if (grisee) {
                leBouton = 'boutonJauneG';
                colBouton = 'blanc';
                colIcon = 'gf';
            }
            noBisOK = true;
            if (thisWeapon.noBis && bat.tags.includes('noBis2')) {
                noBisOK = false;
            }
            let w2message = 'Salves épuisées';
            if (bat.apLeft >= thisWeapon.cost) {
                apOK = true;
            } else {
                if (batType.skills.includes('guerrilla')) {
                    if (bat.apLeft >= -4+thisWeapon.cost) {
                        apOK = true;
                    }
                }
                if (batType.skills.includes('freeshot') || batType.cat === 'buildings') {
                    if (bat.apLeft >= -7+thisWeapon.cost) {
                        apOK = true;
                    }
                }
            }
            let hasControl = true;
            if (batType.skills.includes('mustcontrol') && bat.tags.includes('nomove')) {
                hasControl = false;
            }
            let hasLG = '';
            if (hasEquip(bat,['lanceur','lancegren'])) {
                hasLG = ' (lanceur)';
            }
            tirOK = true;
            if (bat.salvoLeft >= 1 && apOK && anyTarget && ammoLeft >= 1 && !noFireMelee && noBisOK && hasControl) {
                // assez d'ap et de salve
                if (cheapWeapCost > thisWeapon.cost) {
                    cheapWeapCost = thisWeapon.cost;
                }
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                if (pop) {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="'+leBouton+' iconButtons '+colBouton+'" onclick="fireMode(`w2`,false)"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+hasLG+'</'+balise+'></span><br>');
                }
            } else {
                // tir impossible
                tirOK = false;
                if (!hasControl) {
                    w1message = 'Pas de tir si vous ne contrôlez pas le bataillon';
                } else if (noFireMelee) {
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
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="'+w2message+'" class="boutonGrey iconButtons gf"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+hasLG+'</'+balise+'></span><br>');
                }
            }
            doubleAttaque(bat,batType,thisWeapon,bodyPlace,tirOK);
            bullseyeShot(bat,batType,thisWeapon,bodyPlace,inMelee,tirOK);
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
            if (resteSalves >= 1) {
                $('#'+bodyPlace).append('<span class="paramName">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+resteSalves+'/'+maxSalves+'</span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="paramName or">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue or">'+resteSalves+'/'+maxSalves+'</span><br>');
            }
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
            }
            riposte = 'Oui';
            if (thisWeapon.noDef) {
                riposte = 'Non';
                $('#'+bodyPlace).append('<span class="paramName">Riposte</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+riposte+'</span><br>');
            }
            let elev = '';
            if (thisWeapon.elevation >= 1) {
                elev = ' <span class="gff">('+batType.weapon2.range+'e'+thisWeapon.elevation+')</span>';
            }
            $('#'+bodyPlace).append('<span class="paramName" title="Elevation: '+thisWeapon.elevation+'">Portée</span><span class="paramIcon '+colIcon+'"><i class="fas fa-rss"></i></span><span class="paramValue">'+thisWeapon.range+elev+'</span><br>');
            attaques = thisWeapon.rof*bat.squadsLeft;
            // chargeur
            attaques = chargeurAdj(bat,attaques,thisWeapon);
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
            $('#'+bodyPlace).append('<span class="paramName">Précision</span><span class="paramIcon '+colIcon+'"><i class="fas fa-bullseye"></i></span><span class="paramValue">'+accGround+' &Map; '+accFly+'</span><br>');
            if (pop) {
                $('#'+bodyPlace).append('<span class="paramName">Puissance</span><span class="paramIcon"><i class="ra ra-bullets rpg"></i></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
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
                $('#'+bodyPlace).append('<span class="paramName">Puissance</span><span class="paramIcon '+colIcon+'"><i class="ra ra-bullets rpg"></i></span><span class="paramValue">'+attaques+' &times '+thisWeapon.power+' '+aoe+'</span><br>');
            }
            $('#'+bodyPlace).append('<span class="paramName">Armures</span><span class="paramIcon '+colIcon+'"><i class="fas fa-shield-alt"></i></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
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
            let noman = 'Type de munitions';
            if (bat.ammo2.includes('lame')) {
                noman = 'Type de lame';
            }
            $('#'+bodyPlace).append('<span class="paramName">'+noman+'</span><span class="paramIcon"></span><span class="paramValue lcy klik" onclick="equipDetails(`'+bat.ammo2+'`,true)">'+showAmmo(bat.ammo2)+'</span><br>');
            if (baseAmmo < 99) {
                if (ammoLeft <= batType.maxSalvo) {
                    $('#'+bodyPlace).append('<span class="paramName or">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue or">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                }
                ravitVolume = calcRavitVolume(bat);
                $('#'+bodyPlace).append('<span class="paramName" title="Volume du ravitaillement">Volume</span><span class="paramIcon"></span><span class="paramValue">'+ravitVolume[1]+'/'+ravitVolume[0]+'</span><br>');
                if (batType.weapon2.ravitBld != undefined) {
                    let ravitBlds = batType.weapon2.ravitBld;
                    if (!ravitBlds.includes('Poudrière')) {
                        ravitBlds = ravitBlds+', Poudrière';
                    }
                    $('#'+bodyPlace).append('<span class="paramName" title="Bâtiment(s) requis pour le ravitaillement">Bâtiment(s)</span><span class="paramIcon"></span><span class="paramValue">'+ravitBlds+'</span><br>');
                }
            }
            if (thisWeapon.noise < 2) {
                let tirFurtif = calcTirFurtif(thisWeapon,bat,1);
                $('#'+bodyPlace).append('<span class="paramName" title="Chance de rester furtif après avoir attaqué">Tir furtif</span><span class="paramIcon"></span><span class="paramValue">'+tirFurtif+'%</span><br>');
                if (thisWeapon.hide) {
                    $('#'+bodyPlace).append('<span class="paramName jaune" title="Pas de riposte si tir furtif réussi">Tir gratuit</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
                }
            }
            if (batType.skills.includes('cible') || (batType.skills.includes('aicible') && hasEquip(bat,['g2ai'])) || (batType.skills.includes('w2cible') && (bat.eq === 'w2-pgun' || bat.eq === 'w2-flaser' || bat.eq === 'w2-laser'))) {
                if (bat.tags.includes('vise')) {
                    if (thisWeapon.isPrec) {
                        $('#'+bodyPlace).append('<span class="paramName cy">Bullseye</span><span class="paramIcon cy"><i class="fas fa-crosshairs"></i></span><span class="paramValue cy">Oui</span><br>');
                    } else {
                        $('#'+bodyPlace).append('<span class="paramName or">Bullseye</span><span class="paramIcon or"><i class="fas fa-crosshairs"></i></span><span class="paramValue or">Non</span><br>');
                    }
                } else {
                    if (thisWeapon.isPrec) {
                        $('#'+bodyPlace).append('<span class="paramName">Bullseye</span><span class="paramIcon gf"><i class="fas fa-crosshairs"></i></span><span class="paramValue">Oui</span><br>');
                    }
                }
            }
            if (batType.skills.includes('datt')) {
                if (bat.tags.includes('datt')) {
                    if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                        $('#'+bodyPlace).append('<span class="paramName cy">Double attaque</span><span class="paramIcon cy"><i class="ra ra-fire rpg"></i></span><span class="paramValue cy">Oui</span><br>');
                    } else {
                        $('#'+bodyPlace).append('<span class="paramName or">Double attaque</span><span class="paramIcon or"><i class="ra ra-fire rpg"></i></span><span class="paramValue or">Non</span><br>');
                    }
                } else {
                    if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                        $('#'+bodyPlace).append('<span class="paramName">Double attaque</span><span class="paramIcon gf"><i class="ra ra-fire rpg"></i></span><span class="paramValue">Oui</span><br>');
                    }
                }
            }
        }
    }
};

function doubleAttaque(bat,batType,weap,bodyPlace,tirOK) {
    // DOUBLE ATTAQUE
    if (!playerInfos.onShip && !bat.tags.includes('embuscade')) {
        if (batType.skills.includes('datt')) {
            let isTir = false;
            if (batType.skills.includes('tirailleur') && bat.oldTileId != bat.tileId) {
                isTir = true;
            }
            let trainComp = playerInfos.comp.train;
            if (batType.skills.includes('robot') && noEquip(bat,['g2ai'])) {
                trainComp = 0;
            } else {
                if (playerInfos.bldVM.includes('Camp d\'entraînement')) {
                    trainComp = trainComp+1;
                }
            }
            let apCost = 7-trainComp;
            let apReq = 1;
            let weapOK = true;
            if (!weap.isPrec && !weap.isBow && !weap.noDatt) {
                apReq = apCost+weap.cost;
            } else {
                weapOK = false;
            }
            if (weapOK && !isTir) {
                let skillMessage = "";
                let balise = 'h4';
                let boutonNope = 'boutonGrey';
                let colorNope = 'gf';
                if (bat.tags.includes('datt')) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                if (bat.apLeft >= apReq && !bat.tags.includes('datt') && batHasTarget && tirOK) {
                    let dattDesc = "Cadence 165% / Précision 50%";
                    if (weap.powerDatt) {
                        dattDesc = "Cadence 133% / Puissance 133% / Précision 50%";
                    }
                    $('#'+bodyPlace).append('<span class="bigHSpace"></span><button type="button" title="Double attaque: '+dattDesc+'" class="boutonBrun skillButtons" onclick="fury('+apCost+')"><i class="ra ra-fire rpg"></i> <span class="sosmall">'+apCost+'</span></button><br>');
                } else {
                    if (bat.tags.includes('datt')) {
                        skillMessage = "Double attaque: Déjà activé";
                    } else if (!batHasTarget) {
                        skillMessage = "Double attaque: Pas de cible";
                    } else if (!tirOK) {
                        skillMessage = "Double attaque: Pas d'attaque possible";
                    } else {
                        skillMessage = "Double attaque: Pas assez de PA";
                    }
                    $('#'+bodyPlace).append('<span class="bigHSpace"></span><button type="button" title="'+skillMessage+'" class="'+boutonNope+' skillButtons '+colorNope+'"><i class="ra ra-fire rpg"></i> <span class="sosmall">'+apCost+'</span></button><br>');
                }
            }
        }
    }
};

function bullseyeShot(bat,batType,weap,bodyPlace,inMelee,tirOK) {
    // BULLSEYE
    if (!playerInfos.onShip) {
        if (batType.skills.includes('cible') || (batType.skills.includes('aicible') && hasEquip(bat,['g2ai'])) || (batType.skills.includes('w2cible') && (bat.eq.includes('w2') || playerInfos.comp.def === 3))) {
            let tcBonus = calcCibleBonus(batType);
            let apCost = tcBonus.ap;
            let apReq = 1;
            let weapOK = true;
            if (weap.isPrec) {
                apReq = apCost+weap.cost;
            } else {
                weapOK = false;
            }
            if (weapOK) {
                let skillMessage = "";
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (bat.tags.includes('vise')) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                let tcPrec = Math.round(100*tcBonus.prec);
                let tcRof = Math.round(100*tcBonus.rof);
                let tcPow = Math.round(100*tcBonus.pow);
                let tcInfo = '+'+tcPrec+'% précision, '+tcRof+'% cadence, '+tcPow+'% puissance ('+apCost+' PA + coût de l\'arme)';
                if (bat.apLeft >= apReq && !bat.tags.includes('vise') && !inMelee && batHasTarget && tirOK) {
                    $('#'+bodyPlace).append('<span class="bigHSpace"></span><button type="button" title="Bullseye: '+tcInfo+'" class="boutonBrun skillButtons" onclick="tirCible('+apCost+')"><i class="fas fa-crosshairs"></i> <span class="sosmall">'+apCost+'</span></button>');
                    // INSTAKILL
                    if (bat.tags.includes('hero') && (batType.skills.includes('herokill') || batType.skills.includes('herominik')) && !bat.tags.includes('nokill')) {
                        $('#'+bodyPlace).append('<button type="button" title="Instakill: Seulement en combinaison avec Bullseye" class="boutonGrey skillButtons gf"><i class="fas fa-skull-crossbones"></i> <span class="sosmall">0</span></button>');
                    } else {
                        $('#unitInfos').append('<br>');
                    }
                } else {
                    if (bat.tags.includes('vise')) {
                        skillMessage = "Bullseye: Déjà activé";
                    } else if (inMelee) {
                        skillMessage = "Bullseye: Impossible en mêlée";
                    } else if (!batHasTarget) {
                        skillMessage = "Bullseye: Pas de cible";
                    } else if (!tirOK) {
                        skillMessage = "Bullseye: Pas d'attaque possible";
                    } else {
                        skillMessage = "Bullseye: Pas assez de PA";
                    }
                    if (bat.tags.includes('vise')) {
                        $('#'+bodyPlace).append('<span class="bigHSpace"></span><button type="button" title="'+skillMessage+'" class="'+boutonNope+' skillButtons '+colorNope+'"><i class="fas fa-crosshairs"></i> <span class="sosmall">'+apCost+'</span></button>');
                        // INSTAKILL
                        if (bat.tags.includes('hero') && (batType.skills.includes('herokill') || batType.skills.includes('herominik')) && !bat.tags.includes('nokill')) {
                            $('#'+bodyPlace).append('<button type="button" title="Instakill" class="boutonJaune skillButtons" onclick="instaKill()"><i class="fas fa-skull-crossbones"></i> <span class="sosmall">0</span></button>');
                        } else if (bat.tags.includes('kill')) {
                            $('#'+bodyPlace).append('<button type="button" title="Instakill: Activé" class="boutonOK skillButtons cy"><i class="fas fa-skull-crossbones"></i> <span class="sosmall">0</span></button>');
                        } else {
                            $('#unitInfos').append('<br>');
                        }
                    } else {
                        $('#'+bodyPlace).append('<span class="bigHSpace"></span><button type="button" title="'+skillMessage+'" class="'+boutonNope+' skillButtons '+colorNope+'"><i class="fas fa-crosshairs"></i> <span class="sosmall">'+apCost+'</span></button><br>');
                    }
                }
            }
        }
    }
};

function showAmmo(ammo,redux) {
    let ammoView = ammo;
    ammoView = ammoView.replace('dynamite-','');
    ammoView = ammoView.replace('bombe-','');
    ammoView = ammoView.replace('obus-','');
    ammoView = ammoView.replace('hypo-','');
    ammoView = ammoView.replace('boulet-','');
    ammoView = ammoView.replace('belier-','');
    ammoView = ammoView.replace('ram-','');
    ammoView = ammoView.replace('ac-','');
    ammoView = ammoView.replace('pn-','');
    ammoView = ammoView.replace('sm-','');
    ammoView = ammoView.replace('cn-','');
    ammoView = ammoView.replace('fleche-','');
    ammoView = ammoView.replace('lame-','');
    ammoView = ammoView.replace('club-','');
    ammoView = ammoView.replace('dents-','');
    ammoView = ammoView.replace('moisso-','');
    ammoView = ammoView.replace('foreuse-','');
    ammoView = ammoView.replace('grenade-','');
    ammoView = ammoView.replace('missile-','');
    ammoView = ammoView.replace('lf-','');
    ammoView = ammoView.replace('lt-','');
    ammoView = ammoView.replace('laser-','');
    ammoView = ammoView.replace('molotov-','');
    ammoView = ammoView.replace('fireshells-','');
    ammoView = ammoView.replace('gaz-','');
    ammoView = ammoView.replace('web-','');
    ammoView = ammoView.replace('mine-','');
    ammoView = ammoView.replace('autodes-','');
    ammoView = ammoView.replace('autodes','bombe');
    ammoView = ammoView.replace('monomolecular','mono');
    if (redux) {
        ammoView = ammoView.replace('standard','stnd');
        ammoView = ammoView.replace('none','stnd');
    }
    return ammoView;
};
