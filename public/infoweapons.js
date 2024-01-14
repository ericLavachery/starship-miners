function weaponsInfos(bat,batType,tile,pop) {
    let bodyPlace = 'unitInfos';
    if (pop) {
        bodyPlace = 'popbody';
    }
    batHasTarget = false;
    let inMelee = batInMelee(bat,batType);
    let onInfra = false;
    if (tile.infra != undefined) {
        if (tile.infra != 'Terriers' && tile.infra != 'Débris') {
            onInfra = true;
        }
    }
    let defCol;
    let guetCol;
    if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || hasEquip(bat,['detector','g2ai']) || batType.skills.includes('initiative')) {
        defCol = 'gff';
        guetCol = 'neutre';
    } else {
        defCol = 'neutre';
        guetCol = 'gff';
    }
    cheapWeapCost = 99;
    weapDisplay(bat,batType,1,inMelee,onInfra,defCol,guetCol,pop,bodyPlace);
    weapDisplay(bat,batType,2,inMelee,onInfra,defCol,guetCol,pop,bodyPlace);
    if (hasEquip(bat,['w2-autogun','w2-autopistol','w3-autopistol']) || batType.skills.includes('w3melee') || batType.skills.includes('w3range')) {
        if (batType.weapon3 != undefined) {
            console.log(batType.weapon3);
            weapDisplay(bat,batType,3,inMelee,onInfra,defCol,guetCol,pop,bodyPlace);
        }
    }
};

function weapDisplay(bat,batType,weapNum,inMelee,onInfra,defCol,guetCol,pop,bodyPlace) {
    let thisWeapon = {};
    let wDivName = 'w'+weapNum+'div';
    let wNumName = 'w'+weapNum;
    let hasWeap = checkHasWeapon(weapNum,batType,bat.eq);
    let unitWeapon = batType.weapon;
    if (weapNum === 2) {
        unitWeapon = batType.weapon2;
    } else if (weapNum === 3) {
        unitWeapon = batType.weapon3;
        hasWeap = true;
    }
    if (unitWeapon.rof >= 1) {
        if (unitWeapon.name.includes('Bélier') || unitWeapon.name.includes('Boutoir') || unitWeapon.name.includes('Moissonneuse')) {
            let terrain = getTerrain(bat);
            if (!batType.skills.includes('fly') && terrain.name === 'M') {
                hasWeap = false;
            }
        }
    }
    if (unitWeapon.rof >= 1 && hasWeap) {
        // console.log('WEAPON ADJ ========================================================================');
        // console.log(unitWeapon);
        // console.log(bat);
        // console.log(wNumName);
        thisWeapon = weaponAdj(unitWeapon,bat,wNumName);
        // console.log(thisWeapon);
        let noFireMelee = false;
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
        let anyTarget = anyAlienInRange(bat,thisWeapon);
        let inDanger = checkInDanger(bat,batType);
        if (bat.tags.includes('nomove') && inDanger && bat.fuzz <= -2) {
            anyTarget = false;
        }
        if (anyTarget) {
            batHasTarget = true;
        }
        let baseAmmo = thisWeapon.maxAmmo;
        let ammoLeft = calcAmmos(bat,baseAmmo);
        let balise = 'h4';
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
        let noBisOK = true;
        if (thisWeapon.noBis && bat.tags.includes('noBis1')) {
            noBisOK = false;
        }
        let wKOmessage = 'Salves épuisées';
        let apOK = false;
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
        if (bat.salvoLeft >= 1 && apOK && ammoLeft >= 1 && anyTarget && noBisOK && !noFireMelee && hasControl && !thisWeapon.noAtt && weapNum != 3) {
            // assez d'ap et de salve
            if (cheapWeapCost > thisWeapon.cost) {
                cheapWeapCost = thisWeapon.cost;
            }
            $('#'+bodyPlace).append('<div class="shSpace"></div>');
            if (pop) {
                $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'>'+thisWeapon.name+'</'+balise+'></span><br>');
            } else {
                $('#'+bodyPlace).append('<span class="blockTitle"><'+balise+'><button type="button" title="Attaquer" class="'+leBouton+' iconButtons '+colBouton+'" onclick="fireMode(`'+wNumName+'`,false)"><i class="ra ra-bullets rpg"></i> <span class="small">'+thisWeapon.cost+'</span></button>&nbsp; '+thisWeapon.name+'</'+balise+'></span><br>');
            }
            $('#'+bodyPlace).append('<div id="'+wDivName+'"></div>');
            $('#'+wDivName).empty();
            $('#'+wDivName).css("display","block");
        } else {
            // tir impossible
            tirOK = false;
            if (thisWeapon.noAtt || weapNum === 3) {
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
            $('#'+bodyPlace).append('<div id="'+wDivName+'"></div>');
            $('#'+wDivName).empty();
            if (!pop && !playerInfos.showWeaps) {
                $('#'+wDivName).css("display","none");
                $('#'+bodyPlace).append('<span class="report gf klik" onclick="showWeapsToggle()">&nbsp;&nbsp;'+wKOmessage+'</span><br>');
            } else {
                $('#'+wDivName).css("display","block");
            }
        }
        if (!pop) {
            doubleAttaque(bat,batType,thisWeapon,wDivName,tirOK);
            bullseyeShot(bat,batType,thisWeapon,wDivName,inMelee,tirOK);
        }
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
        if (!thisWeapon.noAtt && weapNum != 3) {
            if (resteSalves >= 1) {
                $('#'+wDivName).append('<span class="paramName">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+resteSalves+'/'+maxSalves+'</span><br>');
            } else {
                $('#'+wDivName).append('<span class="paramName or">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue or">'+resteSalves+'/'+maxSalves+'</span><br>');
            }
        } else {
            $('#'+wDivName).append('<span class="paramName or">Salves</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue or">Riposte seulement</span><br>');
        }
        if (pop) {
            $('#'+wDivName).append('<span class="paramName">PA/Salve</span><span class="paramIcon"></span><span class="paramValue">'+thisWeapon.cost+'</span><br>');
        }
        let riposte = 'Oui';
        if (thisWeapon.noDef) {
            riposte = 'Non';
            $('#'+wDivName).append('<span class="paramName">Riposte</span><span class="paramIcon '+colIcon+'"></span><span class="paramValue">'+riposte+'</span><br>');
        }
        let elev = '';
        if (thisWeapon.elevation >= 1) {
            elev = ' <span class="gff">('+unitWeapon.range+'e'+thisWeapon.elevation+')</span>';
        }
        $('#'+wDivName).append('<span class="paramName" title="Elevation: '+thisWeapon.elevation+'">Portée</span><span class="paramIcon '+colIcon+'"><i class="fas fa-rss"></i></span><span class="paramValue">'+thisWeapon.range+elev+'</span><br>');
        let attaques = thisWeapon.rof*bat.squadsLeft;
        // chargeur
        attaques = chargeurAdj(bat,attaques,thisWeapon);
        if (pop) {
            $('#'+wDivName).append('<span class="paramName">Attaques</span><span class="paramIcon"></span><span class="paramValue">'+attaques+'</span><br>');
        }
        // DEFENSE
        let defDef;
        let guetDef;
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
            $('#'+wDivName).append('<span class="paramName">Défense en mêlée</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
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
            $('#'+wDivName).append('<span class="paramName">Défense à distance</span><span class="paramIcon"></span><span class="paramValue"><span class="'+defCol+'">'+defDef+'%</span> <span class="gff">/</span> <span class="'+guetCol+'">'+guetDef+'%</span></span><br>');
        }
        // ACCURACY
        let accFly;
        let accGround;
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
        $('#'+wDivName).append('<span class="paramName">Précision</span><span class="paramIcon '+colIcon+'"><i class="fas fa-bullseye"></i></span><span class="paramValue">'+accGround+' &Map; '+accFly+'</span><br>');
        let aoeSign = 'u';
        let aoeDesc = 'unité';
        if (thisWeapon.aoe === 'unit') {
            aoeSign = 'u';
            aoeDesc = 'unité';
        }
        if (thisWeapon.aoe === 'brochette') {
            aoeSign = 'u+';
            aoeDesc = 'brochette';
        }
        if (thisWeapon.aoe === 'squad') {
            aoeSign = 's';
            aoeDesc = 'escouade';
        }
        if (thisWeapon.aoe === 'bat') {
            aoeSign = 'b';
            aoeDesc = 'bataillon';
        }
        if (pop) {
            $('#'+wDivName).append('<span class="paramName">Puissance</span><span class="paramIcon"><i class="ra ra-bullets rpg"></i></span><span class="paramValue">'+thisWeapon.power+'</span><br>');
        } else {
            $('#'+wDivName).append('<span class="paramName">Puissance</span><span class="paramIcon '+colIcon+'"><i class="ra ra-bullets rpg"></i></span><span class="paramValue" title="Cadence: '+attaques+' / Puissance: '+thisWeapon.power+' / Aire d\'effet: '+aoeDesc+'">'+attaques+' &times '+thisWeapon.power+' '+aoeSign+'</span><br>');
        }
        $('#'+wDivName).append('<span class="paramName">Armures</span><span class="paramIcon '+colIcon+'"><i class="fas fa-shield-alt"></i></span><span class="paramValue">&times;'+thisWeapon.armors+'</span><br>');
        if (pop) {
            $('#'+wDivName).append('<span class="paramName">Aire d\'effet</span><span class="paramIcon"></span><span class="paramValue">'+aoeDesc+'</span><br>');
        }
        let batAmmo = bat.ammo;
        if (weapNum === 2) {
            batAmmo = bat.ammo2;
        } else if (weapNum === 3) {
            batAmmo = unitWeapon.ammo[0];
        }
        let noman = 'Type de munitions';
        if (batAmmo.includes('lame')) {
            noman = 'Type de lame';
        }
        if (weapNum != 3) {
            $('#'+wDivName).append('<span class="paramName">'+noman+'</span><span class="paramIcon"></span><span class="paramValue lcy klik" onclick="equipDetails(`'+batAmmo+'`,true)">'+showAmmo(batAmmo)+'</span><br>');
        }
        if (baseAmmo < 99) {
            if (ammoLeft <= batType.maxSalvo) {
                $('#'+wDivName).append('<span class="paramName or">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue or">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
            } else {
                $('#'+wDivName).append('<span class="paramName">Munitions restantes</span><span class="paramIcon"></span><span class="paramValue">'+ammoLeft+'/'+thisWeapon.maxAmmo+'</span><br>');
            }
            let ravitVolume = calcRavitVolume(bat);
            $('#'+wDivName).append('<span class="paramName" title="Volume du ravitaillement">Volume</span><span class="paramIcon"></span><span class="paramValue">'+ravitVolume[1]+'/'+ravitVolume[0]+'</span><br>');
            if (unitWeapon.ravitBld != undefined) {
                let ravitBlds = unitWeapon.ravitBld;
                if (!ravitBlds.includes('Poudrière')) {
                    ravitBlds = ravitBlds+', Poudrière';
                }
                $('#'+wDivName).append('<span class="paramName" title="Bâtiment(s) requis pour le ravitaillement">Bâtiment(s)</span><span class="paramIcon"></span><span class="paramValue">'+ravitBlds+'</span><br>');
            }
        }
        if (thisWeapon.noise < 2) {
            let tirFurtif = calcTirFurtif(thisWeapon,bat,1);
            $('#'+wDivName).append('<span class="paramName" title="Chance de rester furtif après avoir attaqué">Tir furtif</span><span class="paramIcon"></span><span class="paramValue">'+tirFurtif+'%</span><br>');
            if (thisWeapon.hide) {
                $('#'+wDivName).append('<span class="paramName jaune" title="Pas de riposte si tir furtif réussi">Tir gratuit</span><span class="paramIcon"></span><span class="paramValue jaune">Oui</span><br>');
            }
        }
        if (batType.skills.includes('cible') || (batType.skills.includes('aicible') && hasEquip(bat,['g2ai'])) || (batType.skills.includes('w2cible') && (bat.eq === 'w2-pgun' || bat.eq === 'w2-flaser' || bat.eq === 'w2-laser'))) {
            if (bat.tags.includes('vise')) {
                if (thisWeapon.isPrec) {
                    $('#'+wDivName).append('<span class="paramName cy">Bullseye</span><span class="paramIcon cy"><i class="fas fa-crosshairs"></i></span><span class="paramValue cy">Oui</span><br>');
                } else {
                    $('#'+wDivName).append('<span class="paramName or">Bullseye</span><span class="paramIcon or"><i class="fas fa-crosshairs"></i></span><span class="paramValue or">Non</span><br>');
                }
            } else {
                if (thisWeapon.isPrec) {
                    $('#'+wDivName).append('<span class="paramName">Bullseye</span><span class="paramIcon gf"><i class="fas fa-crosshairs"></i></span><span class="paramValue">Oui</span><br>');
                }
            }
        }
        if (batType.skills.includes('datt')) {
            if (bat.tags.includes('datt')) {
                if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                    $('#'+wDivName).append('<span class="paramName cy">Double attaque</span><span class="paramIcon cy"><i class="ra ra-fire rpg"></i></span><span class="paramValue cy">Oui</span><br>');
                } else {
                    $('#'+wDivName).append('<span class="paramName or">Double attaque</span><span class="paramIcon or"><i class="ra ra-fire rpg"></i></span><span class="paramValue or">Non</span><br>');
                }
            } else {
                if (!thisWeapon.isPrec && !thisWeapon.isBow && !thisWeapon.noDatt) {
                    $('#'+wDivName).append('<span class="paramName">Double attaque</span><span class="paramIcon gf"><i class="ra ra-fire rpg"></i></span><span class="paramValue">Oui</span><br>');
                }
            }
        }
    }
}

function showWeapsToggle() {
    if (playerInfos.showWeaps) {
        playerInfos.showWeaps = false;
    } else {
        playerInfos.showWeaps = true;
    }
    showBatInfos(selectedBat);
}

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
                        $('#'+bodyPlace).append('<br>');
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
                            $('#'+bodyPlace).append('<br>');
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
