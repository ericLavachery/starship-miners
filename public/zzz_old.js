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
    let wKOmessage = 'Salves épuisées';
    if (batType.weapon.rof >= 1) {
        if (batType.weapon.name.includes('Bélier') || batType.weapon.name.includes('Boutoir') || batType.weapon.name.includes('Moissonneuse')) {
            if (!batType.skills.includes('fly') && terrain.name === 'M') {
                hasW1 = false;
            }
        }
    }
    if (batType.weapon.rof >= 1 && showW1 && hasW1) {
        thisWeapon = weaponAdj(batType.weapon,bat,'w1');
        if (true) {
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
            wKOmessage = 'Salves épuisées';
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
            if (bat.salvoLeft >= 1 && apOK && ammoLeft >= 1 && anyTarget && noBisOK && !noFireMelee && hasControl && !thisWeapon.noAtt) {
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
                $('#'+bodyPlace).append('<div id="w1div"></div>');
                $('#w1div').empty();
                $("#w1div").css("display","block");
            } else {
                // tir impossible
                tirOK = false;
                if (thisWeapon.noAtt) {
                    wKOmessage = 'Pas d\'attaque avec cette arme';
                } else if (!hasControl) {
                    wKOmessage = 'Bataillon non contrôlé';
                } else if (noFireMelee) {
                    wKOmessage = 'Tir impossible en mêlée';
                } else {
                    if (ammoLeft < 1) {
                        wKOmessage = 'Munitions épuisées';
                    } else {
                        if (!anyTarget) {
                            wKOmessage = 'Pas de cible';
                        } else if (!apOK) {
                            wKOmessage = 'PA épuisés';
                        }
                    }
                }
                if (playerInfos.showWeaps) {
                    wKOmessage = wKOmessage+' / Cliquer pour cacher le détail';
                } else {
                    wKOmessage = wKOmessage+' / Cliquer pour voir le détail';
                }
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                if (pop) {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="'+wKOmessage+'" class="boutonGrey iconButtons gf" onclick="showWeapsToggle()"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span><br>');
                }
                $('#'+bodyPlace).append('<div id="w1div"></div>');
                $('#w1div').empty();
                if (!pop && !playerInfos.showWeaps) {
                    $("#w1div").css("display","none");
                    $('#'+bodyPlace).append('<span class="report gf klik" onclick="showWeapsToggle()">&nbsp;&nbsp;'+wKOmessage+'</span><br>');
                } else {
                    $("#w1div").css("display","block");
                }
            }
            doubleAttaque(bat,batType,thisWeapon,'w1div',tirOK);
            bullseyeShot(bat,batType,thisWeapon,'w1div',inMelee,tirOK);
            let maxSalves = batType.maxSalvo;
            if (thisWeapon.ammo === 'marquage-kill') {
                if (maxSalves >= 5) {
                    maxSalves = maxSalves-2;
                } else if (maxSalves >= 3) {
                    maxSalves = maxSalves-1;
                }
            }
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
            } else if (thisWeapon.ammo === 'marquage-kill') {
                if (resteSalves >= 5) {
                    resteSalves = resteSalves-2;
                } else if (resteSalves >= 3) {
                    resteSalves = resteSalves-1;
                }
            }
            if (!thisWeapon.noAtt) {
                if (resteSalves >= 1) {
                    $('#w1div').append('<span class="paramName">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+resteSalves+'/'+maxSalves+'</span><br>');
                } else {
                    $('#w1div').append('<span class="paramName or">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue or">'+resteSalves+'/'+maxSalves+'</span><br>');
                }
            }
            if (pop) {
                $('#w1div').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
            }
            let riposte = 'Oui';
            if (thisWeapon.noDef) {
                riposte = 'Non';
                $('#w1div').append('<span class="paramName">Riposte</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+riposte+'</span><br>');
            }
            let elev = '';
            if (thisWeapon.elevation >= 1) {
                elev = ' <span class="gff">('+batType.weapon.range+'e'+thisWeapon.elevation+')</span>';
            }
            $('#w1div').append('<span class="paramName" title="Elevation: '+thisWeapon.elevation+'">Portée</span><span class="paramIcon '+colIcon+'"><i class="fas fa-rss"></i></span><span class="paramValue">'+thisWeapon.range+elev+'</span><br>');
            attaques = thisWeapon.rof*bat.squadsLeft;
            // chargeur
            attaques = chargeurAdj(bat,attaques,thisWeapon);
            if (pop) {
                $('#w1div').append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
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
                $('#w1div').append('<span class="paramName">Défense en mêlée</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
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
                $('#w1div').append('<span class="paramName">Défense à distance</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
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
            $('#w1div').append('<span class="paramName">Précision</span><span class="paramIcon '+colIcon+'"><i class="fas fa-bullseye"></i></span><span class="paramValue">'+accGround+' &Map; '+accFly+'</span><br>');
            if (pop) {
                $('#w1div').append('<span class="paramName">Puissance</span><span class="paramIcon"><i class="ra ra-bullets rpg"></i></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
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
                $('#w1div').append('<span class="paramName">Puissance</span><span class="paramIcon '+colIcon+'"><i class="ra ra-bullets rpg"></i></span><span class="paramValue">'+attaques+' &times '+thisWeapon.power+' '+aoe+'</span><br>');
            }
            $('#w1div').append('<span class="paramName">Armures</span><span class="paramIcon '+colIcon+'"><i class="fas fa-shield-alt"></i></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
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
                $('#w1div').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+aoe+'</span><br>');
            }
            let noman = 'Type de munitions';
            if (bat.ammo.includes('lame')) {
                noman = 'Type de lame';
            }
            $('#w1div').append('<span class="paramName">'+noman+'</span><span class="paramIcon"></span><span class="paramValue lcy klik" onclick="equipDetails(`'+bat.ammo+'`,true)">'+showAmmo(bat.ammo)+'</span><br>');
            if (baseAmmo < 99) {
                if (ammoLeft <= batType.maxSalvo) {
                    $('#w1div').append('<span class="paramName or">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue or">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                } else {
                    $('#w1div').append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                }
                ravitVolume = calcRavitVolume(bat);
                $('#w1div').append('<span class="paramName" title="Volume du ravitaillement">Volume</span><span class="paramIcon"></span><span class="paramValue">'+ravitVolume[1]+'/'+ravitVolume[0]+'</span><br>');
                if (batType.weapon.ravitBld != undefined) {
                    let ravitBlds = batType.weapon.ravitBld;
                    if (!ravitBlds.includes('Poudrière')) {
                        ravitBlds = ravitBlds+', Poudrière';
                    }
                    $('#w1div').append('<span class="paramName" title="Bâtiment(s) requis pour le ravitaillement">Bâtiment(s)</span><span class="paramIcon"></span><span class="paramValue">'+ravitBlds+'</span><br>');
                }
            }
            if (thisWeapon.noise < 2) {
                let tirFurtif = calcTirFurtif(thisWeapon,bat,1);
                $('#w1div').append('<span class="paramName" title="Chance de rester furtif après avoir attaqué">Tir furtif</span><span class="paramIcon"></span><span class="paramValue">'+tirFurtif+'%</span><br>');
                if (thisWeapon.hide) {
                    $('#w1div').append('<span class="paramName jaune" title="Pas de riposte si tir furtif réussi">Tir gratuit</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
                }
            }
            if (batType.skills.includes('cible') || (batType.skills.includes('aicible') && hasEquip(bat,['g2ai'])) || (batType.skills.includes('w2cible') && (bat.eq === 'w2-pgun' || bat.eq === 'w2-flaser' || bat.eq === 'w2-laser'))) {
                if (bat.tags.includes('vise')) {
                    if (thisWeapon.isPrec) {
                        $('#w1div').append('<span class="paramName cy">Bullseye</span><span class="paramIcon cy"><i class="fas fa-crosshairs"></i></span><span class="paramValue cy">Oui</span><br>');
                    } else {
                        $('#w1div').append('<span class="paramName or">Bullseye</span><span class="paramIcon or"><i class="fas fa-crosshairs"></i></span><span class="paramValue or">Non</span><br>');
                    }
                } else {
                    if (thisWeapon.isPrec) {
                        $('#w1div').append('<span class="paramName">Bullseye</span><span class="paramIcon gf"><i class="fas fa-crosshairs"></i></span><span class="paramValue">Oui</span><br>');
                    }
                }
            }
            if (batType.skills.includes('datt')) {
                if (bat.tags.includes('datt')) {
                    if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                        $('#w1div').append('<span class="paramName cy">Double attaque</span><span class="paramIcon cy"><i class="ra ra-fire rpg"></i></span><span class="paramValue cy">Oui</span><br>');
                    } else {
                        $('#w1div').append('<span class="paramName or">Double attaque</span><span class="paramIcon or"><i class="ra ra-fire rpg"></i></span><span class="paramValue or">Non</span><br>');
                    }
                } else {
                    if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                        $('#w1div').append('<span class="paramName">Double attaque</span><span class="paramIcon gf"><i class="ra ra-fire rpg"></i></span><span class="paramValue">Oui</span><br>');
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
        if (true) {
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
            wKOmessage = 'Salves épuisées';
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
            if (bat.salvoLeft >= 1 && apOK && anyTarget && ammoLeft >= 1 && !noFireMelee && noBisOK && hasControl && !thisWeapon.noAtt) {
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
                $('#'+bodyPlace).append('<div id="w2div"></div>');
                $('#w2div').empty();
                $("#w2div").css("display","block");
            } else {
                // tir impossible
                tirOK = false;
                if (thisWeapon.noAtt) {
                    wKOmessage = 'Pas d\'attaque avec cette arme';
                } else if (!hasControl) {
                    wKOmessage = 'Bataillon non contrôlé';
                } else if (noFireMelee) {
                    wKOmessage = 'Tir impossible en mêlée';
                } else {
                    if (ammoLeft < 1) {
                        wKOmessage = 'Munitions épuisées';
                    } else {
                        if (!anyTarget) {
                            wKOmessage = 'Pas de cible';
                        } else if (!apOK) {
                            wKOmessage = 'PA épuisés';
                        }
                    }
                }
                if (playerInfos.showWeaps) {
                    wKOmessage = wKOmessage+' / Cliquer pour cacher le détail';
                } else {
                    wKOmessage = wKOmessage+' / Cliquer pour voir le détail';
                }
                $('#'+bodyPlace).append('<div class="shSpace"></div>');
                if (pop) {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span><br>');
                } else {
                    $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="'+wKOmessage+'" class="boutonGrey iconButtons gf" onclick="showWeapsToggle()"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+hasLG+'</'+balise+'></span><br>');
                }
                $('#'+bodyPlace).append('<div id="w2div"></div>');
                $('#w2div').empty();
                if (!pop && !playerInfos.showWeaps) {
                    $("#w2div").css("display","none");
                    $('#'+bodyPlace).append('<span class="report gf klik" onclick="showWeapsToggle()">&nbsp;&nbsp;'+wKOmessage+'</span><br>');
                } else {
                    $("#w2div").css("display","block");
                }
            }
            doubleAttaque(bat,batType,thisWeapon,'w2div',tirOK);
            bullseyeShot(bat,batType,thisWeapon,'w2div',inMelee,tirOK);
            let maxSalves = batType.maxSalvo;
            if (thisWeapon.ammo === 'marquage-kill') {
                if (maxSalves >= 5) {
                    maxSalves = maxSalves-2;
                } else if (maxSalves >= 3) {
                    maxSalves = maxSalves-1;
                }
            }
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
            } else if (thisWeapon.ammo === 'marquage-kill') {
                if (resteSalves >= 5) {
                    resteSalves = resteSalves-2;
                } else if (resteSalves >= 3) {
                    resteSalves = resteSalves-1;
                }
            }
            if (!thisWeapon.noAtt) {
                if (resteSalves >= 1) {
                    $('#w2div').append('<span class="paramName">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+resteSalves+'/'+maxSalves+'</span><br>');
                } else {
                    $('#w2div').append('<span class="paramName or">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue or">'+resteSalves+'/'+maxSalves+'</span><br>');
                }
            }
            if (pop) {
                $('#w2div').append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
            }
            riposte = 'Oui';
            if (thisWeapon.noDef) {
                riposte = 'Non';
                $('#w2div').append('<span class="paramName">Riposte</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+riposte+'</span><br>');
            }
            let elev = '';
            if (thisWeapon.elevation >= 1) {
                elev = ' <span class="gff">('+batType.weapon2.range+'e'+thisWeapon.elevation+')</span>';
            }
            $('#w2div').append('<span class="paramName" title="Elevation: '+thisWeapon.elevation+'">Portée</span><span class="paramIcon '+colIcon+'"><i class="fas fa-rss"></i></span><span class="paramValue">'+thisWeapon.range+elev+'</span><br>');
            attaques = thisWeapon.rof*bat.squadsLeft;
            // chargeur
            attaques = chargeurAdj(bat,attaques,thisWeapon);
            if (pop) {
                $('#w2div').append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
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
                $('#w2div').append('<span class="paramName">Défense en mêlée</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
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
                $('#w2div').append('<span class="paramName">Défense à distance</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
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
            $('#w2div').append('<span class="paramName">Précision</span><span class="paramIcon '+colIcon+'"><i class="fas fa-bullseye"></i></span><span class="paramValue">'+accGround+' &Map; '+accFly+'</span><br>');
            if (pop) {
                $('#w2div').append('<span class="paramName">Puissance</span><span class="paramIcon"><i class="ra ra-bullets rpg"></i></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
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
                $('#w2div').append('<span class="paramName">Puissance</span><span class="paramIcon '+colIcon+'"><i class="ra ra-bullets rpg"></i></span><span class="paramValue">'+attaques+' &times '+thisWeapon.power+' '+aoe+'</span><br>');
            }
            $('#w2div').append('<span class="paramName">Armures</span><span class="paramIcon '+colIcon+'"><i class="fas fa-shield-alt"></i></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
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
                $('#w2div').append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+aoe+'</span><br>');
            }
            let noman = 'Type de munitions';
            if (bat.ammo2.includes('lame')) {
                noman = 'Type de lame';
            }
            $('#w2div').append('<span class="paramName">'+noman+'</span><span class="paramIcon"></span><span class="paramValue lcy klik" onclick="equipDetails(`'+bat.ammo2+'`,true)">'+showAmmo(bat.ammo2)+'</span><br>');
            if (baseAmmo < 99) {
                if (ammoLeft <= batType.maxSalvo) {
                    $('#w2div').append('<span class="paramName or">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue or">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                } else {
                    $('#w2div').append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
                }
                ravitVolume = calcRavitVolume(bat);
                $('#w2div').append('<span class="paramName" title="Volume du ravitaillement">Volume</span><span class="paramIcon"></span><span class="paramValue">'+ravitVolume[1]+'/'+ravitVolume[0]+'</span><br>');
                if (batType.weapon2.ravitBld != undefined) {
                    let ravitBlds = batType.weapon2.ravitBld;
                    if (!ravitBlds.includes('Poudrière')) {
                        ravitBlds = ravitBlds+', Poudrière';
                    }
                    $('#w2div').append('<span class="paramName" title="Bâtiment(s) requis pour le ravitaillement">Bâtiment(s)</span><span class="paramIcon"></span><span class="paramValue">'+ravitBlds+'</span><br>');
                }
            }
            if (thisWeapon.noise < 2) {
                let tirFurtif = calcTirFurtif(thisWeapon,bat,1);
                $('#w2div').append('<span class="paramName" title="Chance de rester furtif après avoir attaqué">Tir furtif</span><span class="paramIcon"></span><span class="paramValue">'+tirFurtif+'%</span><br>');
                if (thisWeapon.hide) {
                    $('#w2div').append('<span class="paramName jaune" title="Pas de riposte si tir furtif réussi">Tir gratuit</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
                }
            }
            if (batType.skills.includes('cible') || (batType.skills.includes('aicible') && hasEquip(bat,['g2ai'])) || (batType.skills.includes('w2cible') && (bat.eq === 'w2-pgun' || bat.eq === 'w2-flaser' || bat.eq === 'w2-laser'))) {
                if (bat.tags.includes('vise')) {
                    if (thisWeapon.isPrec) {
                        $('#w2div').append('<span class="paramName cy">Bullseye</span><span class="paramIcon cy"><i class="fas fa-crosshairs"></i></span><span class="paramValue cy">Oui</span><br>');
                    } else {
                        $('#w2div').append('<span class="paramName or">Bullseye</span><span class="paramIcon or"><i class="fas fa-crosshairs"></i></span><span class="paramValue or">Non</span><br>');
                    }
                } else {
                    if (thisWeapon.isPrec) {
                        $('#w2div').append('<span class="paramName">Bullseye</span><span class="paramIcon gf"><i class="fas fa-crosshairs"></i></span><span class="paramValue">Oui</span><br>');
                    }
                }
            }
            if (batType.skills.includes('datt')) {
                if (bat.tags.includes('datt')) {
                    if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                        $('#w2div').append('<span class="paramName cy">Double attaque</span><span class="paramIcon cy"><i class="ra ra-fire rpg"></i></span><span class="paramValue cy">Oui</span><br>');
                    } else {
                        $('#w2div').append('<span class="paramName or">Double attaque</span><span class="paramIcon or"><i class="ra ra-fire rpg"></i></span><span class="paramValue or">Non</span><br>');
                    }
                } else {
                    if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                        $('#w2div').append('<span class="paramName">Double attaque</span><span class="paramIcon gf"><i class="ra ra-fire rpg"></i></span><span class="paramValue">Oui</span><br>');
                    }
                }
            }
        }
    }
};

function landerFill() {
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
    $('#conUnitList').append('<span class="constName or">REMPLIR LE LANDER</span><br>');
    findLanders();
    let lastKind = '';
    let showkind = '';
    let showPrep = '';
    let bldNeed = [];
    let prodOK = true;
    let colour = '';
    // BATIMENTS
    let allUnitsList = unitTypes.slice();
    let sortedUnitsList = _.sortBy(_.sortBy(_.sortBy(allUnitsList,'name'),'cat'),'kind');
    sortedUnitsList.forEach(function(unit) {
        if (unit.moveCost === 99 && unit.kind != 'zero-vaisseaux' && unit.kind != 'zero-vm' && unit.name != 'Coffres' && !unit.skills.includes('prefab')) {
            prodOK = true;
            if (unit.levels[playerInfos.gang] > playerInfos.gLevel) {
                prodOK = false;
            }
            if (prodOK) {
                if (lastKind != unit.kind) {
                    showkind = unit.kind.replace(/zero-/g,"");
                    $('#conUnitList').append('<br><span class="constName vert" id="kind-'+unit.kind+'">'+showkind.toUpperCase()+'</span><br>');
                }
                if (playerInfos.prepaLand[unit.name] === undefined) {
                    showPrep = '';
                } else {
                    showPrep = '('+playerInfos.prepaLand[unit.name]+')';
                }
                bldNeed = [];
                if (unit.bldCost != 'none') {
                    bldNeed[0] = unit.bldCost;
                    colour = 'jaune'
                } else {
                    bldNeed = unit.bldReq;
                    if (unit.bldReq.length >= 1) {
                        colour = 'jaune'
                    } else {
                        colour = 'gris';
                    }
                }
                $('#conUnitList').append('<span class="constName klik '+colour+'" title="'+toNiceString(bldNeed)+'" onclick="fillLanderWithUnit('+unit.id+')">'+unit.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                if (unit.equip.length >= 2) {
                    unit.equip.forEach(function(equipName) {
                        if (equipName.includes('w1-') || equipName.includes('w2-')) {
                            let equip = getEquipByName(equipName);
                            let compReqOK = checkCompReq(equip);
                            if (compReqOK) {
                                let equipCountName = unit.id+'-'+equipName;
                                if (playerInfos.prepaLand[equipCountName] === undefined) {
                                    showPrep = '';
                                } else {
                                    showPrep = '('+playerInfos.prepaLand[equipCountName]+')';
                                }
                                $('#conUnitList').append('<span class="constName klik gff" onclick="fillLanderWithEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;'+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                            }
                        }
                    });
                }
                if (unit.protection.length >= 2) {
                    unit.protection.forEach(function(equipName) {
                        if (!equipName.includes('aucun')) {
                            let equip = getEquipByName(equipName);
                            let compReqOK = checkCompReq(equip);
                            if (compReqOK) {
                                let equipCountName = unit.id+'-'+equipName;
                                if (playerInfos.prepaLand[equipCountName] === undefined) {
                                    showPrep = '';
                                } else {
                                    showPrep = '('+playerInfos.prepaLand[equipCountName]+')';
                                }
                                $('#conUnitList').append('<span class="constName klik gff" onclick="fillLanderWithEquip(`'+equipName+'`,'+unit.id+')">&nbsp;&nbsp;blindage '+equipName+' <span class="ciel">'+showPrep+'</span></span><br>');
                            }
                        }
                    });
                }
                lastKind = unit.kind;
            }
        }
    });
    // INFRASTRUCTURES
    $('#conUnitList').append('<br><span class="constName vert">INFRASTRUCTURES</span><br>');
    armorTypes.forEach(function(infra) {
        if (infra.fabTime != undefined) {
            prodOK = true;
            if (infra.levels[playerInfos.gang] > playerInfos.gLevel) {
                prodOK = false;
            }
            if (prodOK) {
                if (playerInfos.prepaLand[infra.name] === undefined) {
                    showPrep = '';
                } else {
                    showPrep = '('+playerInfos.prepaLand[infra.name]+')';
                }
                $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`'+infra.name+'`,false)">'+infra.name+' <span class="ciel">'+showPrep+'</span></span><br>');
            }
        }
    });
    if (playerInfos.prepaLand['Route'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+playerInfos.prepaLand['Route']+')';
    }
    $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`Route`,true)">Route <span class="ciel">'+showPrep+'</span></span><br>');
    if (playerInfos.prepaLand['Pont'] === undefined) {
        showPrep = '';
    } else {
        showPrep = '('+playerInfos.prepaLand['Pont']+')';
    }
    $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`Pont`,true)">Pont <span class="ciel">'+showPrep+'</span></span><br>');
    // DROGUES
    $('#conUnitList').append('<br><span class="constName vert">DROGUES</span><br>');
    armorTypes.forEach(function(drug) {
        if (drug.cat != undefined) {
            if (drug.cat === 'drogue') {
                let drugCompOK = checkCompReq(drug);
                if (drugCompOK) {
                    if (playerInfos.prepaLand[drug.name] === undefined) {
                        showPrep = '';
                    } else {
                        showPrep = '('+playerInfos.prepaLand[drug.name]+')';
                    }
                    $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`'+drug.name+'`,false)">10 '+drug.name+' <span class="ciel">'+showPrep+'</span></span><br>');
                }
            }
        }
    });
    // PACKS DE RESSOURCES
    $('#conUnitList').append('<br><span class="constName vert">PACKS DE RESSOURCES</span><br>');
    armorTypes.forEach(function(pack) {
        if (pack.name.includes('respack-')) {
            if (playerInfos.prepaLand[pack.name] === undefined) {
                showPrep = '';
            } else {
                showPrep = '('+playerInfos.prepaLand[pack.name]+')';
            }
            $('#conUnitList').append('<span class="constName klik gris" onclick="fillLanderWithInfra(`'+pack.name+'`,false)">'+pack.info+' <span class="ciel">'+showPrep+'</span></span><br>');
        }
    });
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function fillLanderWithInfra(fillInfraName,road) {
    let fillInfra = {};
    if (road) {
        fillInfra = {};
        fillInfra.name = fillInfraName;
        fillInfra.costs = {};
        if (fillInfra.name === 'Pont') {
            fillInfra.costs['Scrap'] = 50;
            fillInfra.costs['Compo1'] = 150;
            if (playerInfos.comp.const >= 1) {
                fillInfra.costs['Compo1'] = 100;
            }
            fillInfra.costs['Compo2'] = 50;
            if (playerInfos.comp.const >= 2) {
                fillInfra.costs['Compo2'] = 33;
            }
        } else {
            fillInfra.costs['Compo1'] = 20;
            if (playerInfos.comp.const >= 1) {
                fillInfra.costs['Compo1'] = 14;
            }
        }
    } else {
        fillInfra = getInfraByName(fillInfraName);
    }
    console.log(fillInfra);
    let number = 1;
    if (fillInfra.cat === 'drogue') {
        number = 10;
    }
    addCost(fillInfra.costs,number);
    if (playerInfos.prepaLand[fillInfra.name] === undefined) {
        playerInfos.prepaLand[fillInfra.name] = number;
    }  else {
        playerInfos.prepaLand[fillInfra.name] = playerInfos.prepaLand[fillInfra.name]+number;
    }
    landerFill();
    console.log(playerInfos.prepaLand);
};

function fillLanderWithEquip(equipName,unitId) {
    let equip = getEquipByName(equipName);
    let unit = getBatTypeById(unitId);
    let flatCosts = getCosts(unit,equip,0,'equip');
    let deployCosts = getDeployCosts(unit,equip,0,'equip');
    addCost(flatCosts,1);
    addCost(deployCosts,1);
    let equipCountName = unitId+'-'+equip.name;
    if (playerInfos.prepaLand[equipCountName] === undefined) {
        playerInfos.prepaLand[equipCountName] = 1;
    }  else {
        playerInfos.prepaLand[equipCountName] = playerInfos.prepaLand[equipCountName]+1;
    }
    landerFill();
};

function fillLanderWithUnit(fillUnitId) {
    let fillUnit = getBatTypeById(fillUnitId);
    addCost(fillUnit.costs,1);
    addCost(fillUnit.deploy,1);
    let reqCit = fillUnit.squads*fillUnit.squadSize*fillUnit.crew;
    if (fillUnit.skills.includes('clone') || fillUnit.skills.includes('dog')) {
        reqCit = 0;
    }
    let citId = 126;
    if (fillUnit.skills.includes('brigands')) {
        citId = 225;
    }
    if (reqCit >= 1) {
        let lander = landers[0];
        let citBat = {};
        let citBatId = -1;
        bataillons.forEach(function(bat) {
            if (bat.loc === 'trans' && bat.locId === lander.id && bat.typeId === citId) {
                citBatId = bat.id;
                citBat = bat;
            }
        });
        if (citBatId >= 0) {
            citBat.citoyens = citBat.citoyens+reqCit;
        } else {
            let unitIndex = unitTypes.findIndex((obj => obj.id == citId));
            conselUnit = unitTypes[unitIndex];
            conselAmmos = ['xxx','xxx','xxx','xxx'];
            conselTriche = true;
            putBat(lander.tileId,reqCit,0,'',false);
            let citBat = getBatByTypeIdAndTileId(citId,lander.tileId);
            citBat.loc = 'trans';
            citBat.locId = lander.id;
            lander.transIds.push(citBat.id);
        }
    }
    if (playerInfos.prepaLand[fillUnit.name] === undefined) {
        playerInfos.prepaLand[fillUnit.name] = 1;
    }  else {
        playerInfos.prepaLand[fillUnit.name] = playerInfos.prepaLand[fillUnit.name]+1;
    }
    landerFill();
    // console.log(playerInfos.prepaLand);
};

function getBonusEqOld(unit) {
    // console.log("CHECK BONUS EQ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    let bonusEqName = '';
    if (unit.autoEq != undefined) {
        // console.log(unit.autoEq);
        if (unit.autoEq.length >= 1) {
            unit.autoEq.forEach(function(equipName) {
                if (bonusEqName === '') {
                    let equip = getEquipByName(equipName);
                    // console.log(equip);
                    let compReqOK = checkCompReq(equip);
                    if (checkSpecialEquip(equip,unit)) {
                        compReqOK = false;
                    }
                    // console.log('compReqOK='+compReqOK);
                    if (compReqOK) {
                        if (equip.autoComp.length === 2) {
                            let autoCompName = equip.autoComp[0];
                            let autoCompLevel = equip.autoComp[1];
                            if (playerInfos.comp[autoCompName] >= autoCompLevel) {
                                bonusEqName = equipName;
                            }
                        }
                    }
                }
            });
        }
    }
    if (bonusEqName === '') {
        if (unit.log3eq != undefined) {
            // console.log(unit.log3eq);
            if (unit.log3eq.length >= 1) {
                unit.log3eq.forEach(function(equipName) {
                    if (bonusEqName === '') {
                        let equip = getEquipByName(equipName);
                        // console.log(equip);
                        let compReqOK = checkCompReq(equip);
                        if (checkSpecialEquip(equip,unit)) {
                            compReqOK = false;
                        }
                        // console.log('compReqOK='+compReqOK);
                        if (compReqOK) {
                            if (playerInfos.comp.log === 3 && equipName != 'garage') {
                                // console.log('log3');
                                bonusEqName = equipName;
                            } else if (equip.autoComp.length === 2) {
                                let autoCompName = equip.autoComp[0];
                                let autoCompLevel = equip.autoComp[1];
                                if (playerInfos.comp[autoCompName] >= autoCompLevel) {
                                    bonusEqName = equipName;
                                }
                            }
                        }
                    }
                });
            }
        }
    }
    console.log('bonusEqName='+bonusEqName);
    return bonusEqName;
};

function checkFlyTarget(weapon,batType) {
    if (weapon.noFly && batType.skills.includes('fly')) {
        return false;
    } else {
        if (weapon.noGround && !batType.skills.includes('fly') && !batType.skills.includes('sauteur')) {
            return false;
        } else {
            return true;
        }
    }
};

function anyAlienInRange(myBat,weapon) {
    let tileId = myBat.tileId;
    let distance;
    let inRange = false;
    let batIndex;
    let batType;
    aliens.forEach(function(bat) {
        if (bat.loc === "zone") {
            let guidageOK = checkGuidage(weapon,bat);
            if (isInRange(myBat,bat.tileId,weapon) || guidageOK) {
                batType = getBatType(bat);
                if (weapon.ammo.includes('marquage') && weapon.name != 'Fragger' && bat.tags.includes('fluo')) {
                    // Déjà marqué
                } else {
                    if (weapon.noFly && batType.skills.includes('fly')) {
                        // Fly hors portée
                    } else {
                        if (weapon.noGround && !batType.skills.includes('fly') && !batType.skills.includes('sauteur')) {
                            // Ground hors portée
                        } else {
                            if (batType.skills.includes('invisible') || bat.tags.includes('invisible')) {
                                // Alien invisible
                                distance = calcDistance(myBat.tileId,bat.tileId)
                                if (distance === 0 || guidageOK || bat.tags.includes('fluo')) {
                                    inRange = true;
                                }
                            } else {
                                if (zone[0].dark && !undarkNow.includes(bat.tileId)) {
                                    // Alien dans l'ombre
                                } else {
                                    inRange = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return inRange;
};

start of showMap()
if (!playerInfos.onShip && playerInfos.clouds) {
    if (zone[0].dark) {
        $('#zone_map').css("filter","url(#dark) contrast(110%)");
    } else {
        $('#zone_map').css("filter","url(#fluffy) saturate(85%) contrast(140%)");
    }
} else {
    $('#zone_map').css("filter","");
}
