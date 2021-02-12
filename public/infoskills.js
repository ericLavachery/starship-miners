function skillsInfos(bat,batType) {
    let skillMessage;
    let numTargets = 0;
    let apCost;
    let apReq;
    let prodOK = true;
    findLanders();
    let tile = getTile(bat);
    let terrain = getTerrain(bat);
    let inMelee = batInMelee(bat);
    let freeConsTile = false;
    console.log('inMelee='+inMelee);
    // RAVITAILLEMENT DROGUES
    let anyRavit = checkRavitDrug(bat);
    if (anyRavit && bat.tags.includes('dU') && batType.skills.includes('dealer')) {
        let apCost = Math.round(bat.ap/3);
        if (bat.apLeft >= 2) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le plein de drogues" class="boutonGris skillButtons" onclick="goRavitDrug('+apCost+')"><i class="fas fa-prescription-bottle"></i> <span class="small">'+apCost+'</span></button>&nbsp;  Approvisionnement</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-prescription-bottle"></i> <span class="small">'+apCost+'</span></button>&nbsp; Approvisionnement</h4></span>');
        }
    }
    // RAVITAILLEMENT
    anyRavit = checkRavit(bat);
    if (anyRavit && bat.tags.includes('aU')) {
        let ravitVolume = calcRavitVolume(bat);
        let ravitFactor = 3;
        if (batType.skills.includes('fly') && !batType.skills.includes('jetpack')) {
            ravitFactor = 1;
        }
        if (bat.eq.includes('carrousel')) {
            ravitFactor = ravitFactor*1.5;
        }
        let apCost = Math.round(Math.sqrt(ravitVolume[1])*bat.ap/ravitFactor);
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le plein de munitions" class="boutonGris skillButtons" onclick="goRavit()"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ravitaillement</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ravitaillement</h4></span>');
        }
    }
    // STOCKS
    let anyStock = checkStock(bat);
    if (anyStock && bat.tags.includes('sU')) {
        let apCost = Math.round(bat.ap*1.5);
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le plein de ravitaillements" class="boutonGris skillButtons" onclick="goStock('+apCost+')"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réapprovisionnement</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réapprovisionnement</h4></span>');
        }
    }
    // GUET
    if (batType.weapon.rof >= 1 && bat.ap >= 1 && !batType.skills.includes('noguet')) {
        balise = 'h4';
        if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || batType.skills.includes('initiative') || batType.skills.includes('after')) {
            balise = 'h3';
        }
        apCost = 3;
        if (batType.skills.includes('fastguet')) {
            apReq = 3;
        } else if (batType.skills.includes('baddef')) {
            apReq = bat.ap-5;
        } else {
            apReq = bat.ap-3;
        }
        if (bat.apLeft >= apReq && !bat.tags.includes('guet') && !batType.skills.includes('sentinelle') && !batType.skills.includes('initiative') && !batType.skills.includes('after')) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Faire le guet (pas de malus à la riposte)" class="boutonGris skillButtons" onclick="guet()"><i class="fas fa-binoculars"></i> <span class="small">'+apReq+'</span></button>&nbsp; Guet</'+balise+'></span>');
        } else {
            if (batType.skills.includes('sentinelle') || batType.skills.includes('initiative') || batType.skills.includes('after')) {
                skillMessage = "Sentinelle";
            } else {
                skillMessage = "Pas assez de PA";
            }
            // pas assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-binoculars"></i> <span class="small">'+apReq+'</span></button>&nbsp; Guet</'+balise+'></span>');
        }
    }
    // FORTIFICATION
    if (batType.skills.includes('fortif')) {
        balise = 'h4';
        if (bat.tags.includes('fortif')) {
            balise = 'h3';
        }
        apCost = bat.ap;
        if (bat.apLeft >= apCost-2 && !bat.tags.includes('fortif') && !inMelee && bat.salvoLeft >= batType.maxSalvo) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Se fortifier (bonus couverture)" class="boutonGris skillButtons" onclick="fortification()"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>&nbsp; Fortification</'+balise+'></span>');
        } else {
            if (inMelee) {
                skillMessage = "Vous ne pouvez pas vous fortifier en mêlée";
            } else {
                skillMessage = "Pas assez de PA ou de salve";
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>&nbsp; Fortification</'+balise+'></span>');
        }
    }
    // CAMOUFLAGE
    let camoufOK = true;
    if (batType.skills.includes('camo') || (tile.ruins && batType.size < 20) || (tile.infra === 'Terriers' && batType.size < 9) || bat.fuzz <= -2 || bat.eq === 'camo' || bat.eq === 'kit-sentinelle') {
        if (batType.cat == 'buildings') {
            if (batType.skills.includes('maycamo') && !tile.ruins && tile.infra != 'Terriers') {
                apCost = Math.floor(bat.ap*3.5);
                apReq = Math.floor(bat.ap/1.5);
                if (inMelee) {
                    camoufOK = false;
                }
            } else {
                apCost = Math.floor(bat.ap*2);
                apReq = Math.floor(bat.ap/1.5);
                if (inMelee) {
                    camoufOK = false;
                }
            }
        } else if (batType.cat == 'vehicles' || batType.skills.includes('machine') || batType.cat == 'devices') {
            if (batType.skills.includes('maycamo') && !tile.ruins && tile.infra != 'Terriers') {
                apCost = Math.floor(bat.ap*Math.sqrt(batType.size)/1.8);
                apReq = Math.floor(bat.ap/1.5);
                if (inMelee) {
                    camoufOK = false;
                }
            } else {
                apCost = Math.floor(bat.ap/2);
                apReq = 3;
                if (inMelee) {
                    camoufOK = false;
                }
            }
        } else {
            if (batType.skills.includes('maycamo') && !tile.ruins && tile.infra != 'Terriers') {
                apCost = Math.floor(bat.ap*Math.sqrt(batType.size)/1.8);
                apReq = Math.floor(bat.ap/1.5);
                if (inMelee) {
                    camoufOK = false;
                }
            } else {
                apCost = Math.floor(bat.ap/3);
                apReq = 1;
            }
        }
        balise = 'h4';
        if (bat.fuzz <= -2) {
            balise = 'h3';
        }
        if (bat.apLeft >= apReq && bat.fuzz >= -1 && camoufOK) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Mode furtif" class="boutonGris skillButtons" onclick="camouflage('+apCost+')"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Mode furtif</'+balise+'></span>');
        } else {
            if (bat.fuzz <= -2) {
                skillMessage = "Déjà en mode furtif";
            } else if (!camoufOK) {
                skillMessage = "Impossible en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Mode furtif</'+balise+'></span>');
        }
        if (bat.tags.includes('camo') || (bat.fuzz <= -2 && (batType.skills.includes('camo') || batType.skills.includes('maycamo')))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Sortir du mode furtif" class="boutonGris skillButtons" onclick="camoOut()"><i class="ra ra-footprint rpg"></i> <span class="small">0</span></button>&nbsp; Mode non furtif</h4></span>');
        }
    }
    // EMBUSCADE
    if (batType.skills.includes('embuscade')) {
        apCost = 2;
        if (batType.weapon2.rof >= 1 && batType.weapon.cost > batType.weapon2.rof) {
            apReq = 2+batType.weapon2.cost;
        } else {
            apReq = 2+batType.weapon.cost;
        }
        balise = 'h4';
        if (bat.tags.includes('embuscade')) {
            balise = 'h3';
        }
        if (bat.apLeft >= apReq && bat.fuzz <= -2 && bat.apLeft >= apCost+cheapWeapCost && !bat.tags.includes('noemb') && !bat.tags.includes('embuscade')) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Embuscade (Initiative + Cadence de tir x2)" class="boutonGris skillButtons" onclick="ambush()"><i class="ra ra-hood rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embuscade</'+balise+'></span>');
        } else {
            skillMessage = "Pas assez de PA";
            if (bat.tags.includes('noemb')) {
                skillMessage = "Vous devez bouger ou attendre avant de pouvoir refaire une embuscade";
            } else if (bat.fuzz > -2) {
                skillMessage = "Vous n'êtes pas en mode furtif";
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-hood rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embuscade</'+balise+'></span>');
        }
    }
    // TIR CIBLE
    // intéressant si précision en dessous de 10
    if (batType.skills.includes('cible')) {
        apCost = 3;
        if (batType.weapon2.rof >= 1 && batType.weapon.cost > batType.weapon2.rof) {
            apReq = 3+batType.weapon2.cost;
        } else {
            apReq = 3+batType.weapon.cost;
        }
        balise = 'h4';
        if (bat.tags.includes('vise')) {
            balise = 'h3';
        }
        if (bat.apLeft >= apReq && !bat.tags.includes('vise') && bat.apLeft >= apCost+cheapWeapCost) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+5 précision, 2/3 cadence de tir (3 PA + coût de l\'arme)" class="boutonGris skillButtons" onclick="tirCible()"><i class="fas fa-crosshairs"></i> <span class="small">'+apCost+'</span></button>&nbsp; Tir ciblé</'+balise+'></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Pas assez de PA" class="boutonGris skillButtons gf"><i class="fas fa-crosshairs"></i> <span class="small">'+apCost+'</span></button>&nbsp; Tir ciblé</'+balise+'></span>');
        }
    }
    // LUCKY SHOT
    if (batType.skills.includes('luckyshot')) {
        if (batType.weapon2.rof >= 1 && batType.weapon.cost > batType.weapon2.rof) {
            apReq = batType.weapon2.cost;
        } else {
            apReq = batType.weapon.cost;
        }
        balise = 'h4';
        if (bat.tags.includes('luckyshot')) {
            balise = 'h3';
        }
        if (bat.apLeft >= apReq && !bat.tags.includes('luckyshot') && !bat.tags.includes('lucky') && bat.apLeft >= cheapWeapCost) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Lucky shot automatique sur cette attaque" class="boutonGris skillButtons" onclick="luckyShot()"><i class="fas fa-dice-six"></i> <span class="small">0</span></button>&nbsp; Lucky shot</'+balise+'></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Pas assez de bol ou de PA" class="boutonGris skillButtons gf"><i class="fas fa-dice-six"></i> <span class="small">'+apCost+'</span></button>&nbsp; Lucky shot</'+balise+'></span>');
        }
    }
    // PRIERE
    if (batType.skills.includes('prayer')) {
        balise = 'h4';
        if (bat.tags.includes('prayer')) {
            balise = 'h3';
        }
        apCost = 7;
        if (bat.apLeft >= apCost && !bat.tags.includes('prayer') && !bat.tags.includes('spirit') && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Prier" class="boutonGris skillButtons" onclick="gloireASatan()"><i class="fas fa-hamsa"></i> <span class="small">'+apCost+'</span></button>&nbsp; Prière</'+balise+'></span>');
        } else {
            if (inMelee) {
                skillMessage = "Vous ne pouvez pas prier en mêlée";
            } else if (bat.tags.includes('prayer')) {
                skillMessage = "Encore sous l'effet de la prière";
            } else if (bat.tags.includes('spirit')) {
                skillMessage = "Aucun signe des Dieux";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-hamsa"></i> <span class="small">'+apCost+'</span></button>&nbsp; Prière</'+balise+'></span>');
        }
    }
    // FOG
    if (batType.skills.includes('fog')) {
        balise = 'h4';
        if (bat.tags.includes('fog')) {
            balise = 'h1';
        }
        if (!bat.tags.includes('fog')) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Envoyer le fog" class="boutonGris skillButtons" onclick="fogStart()"><i class="fas fa-cloud"></i> <span class="small">0</span></button>&nbsp; Fog</'+balise+'></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Arrêter le fog" class="boutonGris skillButtons" onclick="fogStop()"><i class="fas fa-cloud"></i> <span class="small">0</span></button>&nbsp; Fog</'+balise+'></span>');
        }
    }
    // MEDIC
    let baseskillCost;
    if ((batType.skills.includes('medic') && bat.eq != 'megafret') || (bat.eq === 'medic' && playerInfos.comp.med >= 3)) {
        numTargets = numMedicTargets(bat,'infantry',true,true);
        baseskillCost = batType.mediCost;
        if (batType.skills.includes('medic') && playerInfos.comp.med >= 3) {
            if (bat.eq === 'medic') {
                baseskillCost = baseskillCost-2;
            }
        } else {
            if (bat.eq === 'medic') {
                baseskillCost = baseskillCost-1;
            }
        }
        if (baseskillCost < 2) {
            baseskillCost = 2;
        }
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Soigner les infanteries adjacentes" class="boutonGris skillButtons" onclick="medic(`infantry`,'+baseskillCost+',true,true)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Pas de soins en mêlée";
            } else {
                if (numTargets < 1) {
                    skillMessage = "Aucune infanterie adjacente n'a pas subit de dégâts";
                } else {
                    skillMessage = "Pas assez de PA";
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
        }
    }
    // BAD MEDIC
    if (batType.skills.includes('badmedic') && (bat.eq != 'medic' || playerInfos.comp.med < 3)) {
        numTargets = numMedicTargets(bat,'infantry',true,false);
        baseskillCost = batType.mediCost;
        if (bat.eq === 'medic' && baseskillCost >= 3) {
            baseskillCost = baseskillCost-1;
        }
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Soigner les infanteries adjacentes" class="boutonGris skillButtons" onclick="medic(`infantry`,'+baseskillCost+',true,false)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Pas de soins en mêlée";
            } else {
                if (numTargets < 1) {
                    skillMessage = "Aucune infanterie adjacente n'a pas subit de dégâts";
                } else {
                    skillMessage = "Pas assez de PA";
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
        }
    }
    // SELF MEDIC
    if (batType.skills.includes('selfmedic') && (bat.eq != 'medic' || playerInfos.comp.med < 3)) {
        numTargets = numMedicTargets(bat,'infantry',false,true);
        baseskillCost = batType.mediCost;
        if (bat.eq === 'medic' && baseskillCost >= 3) {
            baseskillCost = baseskillCost-1;
        }
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Se soigner" class="boutonGris skillButtons" onclick="medic(`infantry`,'+baseskillCost+',false,true)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Pas de soins en mêlée";
            } else {
                if (numTargets <= 0) {
                    skillMessage = "Aucun dégâts soignable";
                } else {
                    skillMessage = "Pas assez de PA";
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
        }
    }
    // FIRST AID (SELF BAD MEDIC)
    if (batType.skills.includes('selfbadmedic') && (bat.eq != 'medic' || playerInfos.comp.med < 3)) {
        numTargets = numMedicTargets(bat,'infantry',false,false);
        baseskillCost = batType.mediCost;
        if (bat.eq === 'medic' && baseskillCost >= 3) {
            baseskillCost = baseskillCost-1;
        }
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Premiers soins" class="boutonGris skillButtons" onclick="medic(`infantry`,'+baseskillCost+',false,false)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Premiers soins</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Pas de soins en mêlée";
            } else {
                if (numTargets <= 0) {
                    skillMessage = "Aucun dégâts soignable";
                } else {
                    skillMessage = "Pas assez de PA";
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Premiers soins</h4></span>');
        }
    }
    // MECANO
    if (batType.skills.includes('mecano') || bat.eq === 'mecano') {
        numTargets = numMedicTargets(bat,'vehicles',true,true);
        baseskillCost = batType.mecanoCost;
        if (bat.eq === 'mecano' && baseskillCost >= 3) {
            baseskillCost = baseskillCost-1;
        }
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les véhicules adjacents" class="boutonGris skillButtons" onclick="medic(`vehicles`,'+baseskillCost+',true,true)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                if (numTargets < 1) {
                    skillMessage = "Aucun véhicule adjacent n'a pas subit de dégâts";
                } else {
                    skillMessage = "Pas assez de PA";
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        }
    }
    // BAD MECANO
    if (batType.skills.includes('badmecano') && bat.eq != 'mecano') {
        numTargets = numMedicTargets(bat,'vehicles',true,false);
        baseskillCost = batType.mecanoCost;
        if (bat.eq === 'mecano' && baseskillCost >= 3) {
            baseskillCost = baseskillCost-1;
        }
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les véhicules adjacents" class="boutonGris skillButtons" onclick="medic(`vehicles`,'+baseskillCost+',true,false)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                if (numTargets < 1) {
                    skillMessage = "Aucun véhicule adjacent n'a pas subit de dégâts";
                } else {
                    skillMessage = "Pas assez de PA";
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        }
    }
    // SELF BAD MECANO
    if (batType.skills.includes('selfbadmecano') && bat.eq != 'mecano') {
        numTargets = numMedicTargets(bat,'vehicles',false,false);
        baseskillCost = batType.mecanoCost;
        if (bat.eq === 'mecano' && baseskillCost >= 3) {
            baseskillCost = baseskillCost-1;
        }
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Retaper le véhicule" class="boutonGris skillButtons" onclick="medic(`vehicles`,'+baseskillCost+',false,false)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        } else {
            if (numTargets <= 0) {
                skillMessage = "Ce véhicule n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        }
    }
    // SELF MECANO
    if (batType.skills.includes('selfmecano') && bat.eq != 'mecano') {
        numTargets = numMedicTargets(bat,'vehicles',false,true);
        baseskillCost = batType.mecanoCost;
        if (bat.eq === 'mecano' && baseskillCost >= 3) {
            baseskillCost = baseskillCost-1;
        }
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Retaper le véhicule" class="boutonGris skillButtons" onclick="medic(`vehicles`,'+baseskillCost+',false,true)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        } else {
            if (numTargets <= 0) {
                skillMessage = "Ce véhicule n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        }
    }
    // REPAIR
    if (batType.skills.includes('repair')) {
        numTargets = numMedicTargets(bat,'buildings',true,true);
        baseskillCost = batType.mecanoCost;
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les bâtiments adjacents" class="boutonGris skillButtons" onclick="medic(`buildings`,'+baseskillCost+',true,true)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                if (numTargets < 1) {
                    skillMessage = "Aucun bâtiment adjacent n'a pas subit de dégâts";
                } else {
                    skillMessage = "Pas assez de PA";
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        }
    }
    // SELF BAD REPAIR
    if (batType.skills.includes('selfbadrepair')) {
        numTargets = numMedicTargets(bat,'buildings',false,false);
        baseskillCost = batType.mecanoCost;
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer le bâtiment" class="boutonGris skillButtons" onclick="medic(`all`,'+baseskillCost+',false,false)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        } else {
            if (numTargets <= 0) {
                skillMessage = "Ce bâtiment n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        }
    }
    // SELF REPAIR
    if (batType.skills.includes('selfrepair')) {
        numTargets = numMedicTargets(bat,'buildings',false,true);
        baseskillCost = batType.mecanoCost;
        apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
        if (apCost === 0) {apCost = baseskillCost;}
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer le bâtiment" class="boutonGris skillButtons" onclick="medic(`all`,'+baseskillCost+',false,true)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        } else {
            if (numTargets <= 0) {
                skillMessage = "Ce bâtiment n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        }
    }
    // REPAIR DIAG
    if ((batType.cat === 'buildings' || batType.cat === 'devices') && !batType.skills.includes('nobld') && !batType.skills.includes('norepair') && (bat.damage >= 1 || bat.squadsLeft < batType.squads)) {
        let repairBat = checkRepairBat(bat.tileId);
        if (Object.keys(repairBat).length >= 1) {
            let repairBatType = getBatType(repairBat);
            apCost = 3;
            if (repairBat.apLeft >= 1) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer le bâtiment avec '+repairBat.type+' ('+repairBatType.mecanoCost+' AP)" class="boutonGris skillButtons" onclick="diagRepair('+repairBat.id+')"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
            }
        }
    }
    // DROGUES
    let allDrugs = checkDrugs(bat);
    if (batType.cat === 'infantry') {
        // KIRIN
        if (playerInfos.comp.med >= 1 && playerInfos.comp.ca >= 2 && playerInfos.bldList.includes('Infirmerie')) {
            if (allDrugs.includes('kirin') || bat.tags.includes('kirin')) {
                balise = 'h4';
                if (bat.tags.includes('kirin')) {
                    balise = 'h3';
                }
                apCost = 3;
                if (bat.apLeft >= apCost && !bat.tags.includes('kirin')) {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Régénération rapide" class="boutonVert skillButtons" onclick="goDrug('+apCost+',`kirin`)"><i class="ra ra-heart-bottle rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Kirin</'+balise+'></span>');
                } else {
                    skillMessage = "Pas assez de PA";
                    if (bat.tags.includes('kirin')) {
                        skillMessage = "Déjà sous l'effet de cette drogue";
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-heart-bottle rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Kirin</'+balise+'></span>');
                }
            }
        }
        // OCTIRON
        if (playerInfos.comp.med >= 1) {
            if (allDrugs.includes('octiron') || bat.tags.includes('octiron')) {
                balise = 'h4';
                if (bat.tags.includes('octiron')) {
                    balise = 'h3';
                }
                apCost = 0;
                if (!bat.tags.includes('octiron')) {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+2 PA, protection poisons et maladies" class="boutonVert skillButtons" onclick="goDrug('+apCost+',`octiron`)"><i class="fas fa-cannabis"></i> <span class="small">'+apCost+'</span></button>&nbsp; Octiron</'+balise+'></span>');
                } else {
                    skillMessage = "Pas assez de PA";
                    if (bat.tags.includes('octiron')) {
                        skillMessage = "Déjà sous l'effet de cette drogue";
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-cannabis"></i> <span class="small">'+apCost+'</span></button>&nbsp; Octiron</'+balise+'></span>');
                }
            }
        }
        // BLISS
        if (playerInfos.comp.exo >= 1 && playerInfos.comp.ca >= 2) {
            if ((allDrugs.includes('bliss') && !batType.skills.includes('cyber')) || bat.tags.includes('bliss')) {
                balise = 'h4';
                if (bat.tags.includes('bliss')) {
                    balise = 'h3';
                }
                apCost = 1;
                if (bat.apLeft >= apCost && !bat.tags.includes('bliss')) {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Dégâts reçus réduits / immunisé à la peur" class="boutonVert skillButtons" onclick="goDrug('+apCost+',`bliss`)"><i class="ra ra-pills rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Bliss</'+balise+'></span>');
                } else {
                    skillMessage = "Pas assez de PA";
                    if (bat.tags.includes('bliss')) {
                        skillMessage = "Déjà sous l'effet de cette drogue";
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-pills rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Bliss</'+balise+'></span>');
                }
            }
        }
        // BLAZE
        if (playerInfos.comp.exo >= 3 && playerInfos.comp.ca >= 3 && playerInfos.bldList.includes('Bar')) {
            if ((allDrugs.includes('blaze') && !batType.skills.includes('cyber')) || bat.tags.includes('blaze')) {
                balise = 'h4';
                if (bat.tags.includes('blaze')) {
                    balise = 'h3';
                }
                apCost = 3;
                if (bat.apLeft >= apCost && !bat.tags.includes('blaze')) {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+6 PA & +1 salve" class="boutonVert skillButtons" onclick="goDrug('+apCost+',`blaze`)"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Blaze</'+balise+'></span>');
                } else {
                    skillMessage = "Pas assez de PA";
                    if (bat.tags.includes('blaze')) {
                        skillMessage = "Déjà sous l'effet de cette drogue";
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Blaze</'+balise+'></span>');
                }
            }
        }
        // SKUPIAC
        if (playerInfos.comp.exo >= 2 && playerInfos.comp.ca >= 2 && playerInfos.bldList.includes('Bar')) {
            if ((allDrugs.includes('skupiac') && !batType.skills.includes('cyber')) || bat.tags.includes('skupiac')) {
                balise = 'h4';
                if (bat.tags.includes('skupiac')) {
                    balise = 'h3';
                }
                apCost = 3;
                if (bat.apLeft >= apCost && !bat.tags.includes('skupiac')) {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Concentration: +6 précision / +3 défense / guérit les maladies" class="boutonVert skillButtons" onclick="goDrug('+apCost+',`skupiac`)"><i class="far fa-eye"></i> <span class="small">'+apCost+'</span></button>&nbsp; Skupiac</'+balise+'></span>');
                } else {
                    skillMessage = "Pas assez de PA";
                    if (bat.tags.includes('skupiac')) {
                        skillMessage = "Déjà sous l'effet de cette drogue";
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="far fa-eye"></i> <span class="small">'+apCost+'</span></button>&nbsp; Skupiac</'+balise+'></span>');
                }
            }
        }
        // SILA
        if (playerInfos.comp.exo >= 1 && playerInfos.comp.ca >= 1) {
            if ((allDrugs.includes('sila') && !batType.skills.includes('cyber')) || bat.tags.includes('sila')) {
                balise = 'h4';
                if (bat.tags.includes('sila')) {
                    balise = 'h3';
                }
                apCost = 3;
                if (bat.apLeft >= apCost && !bat.tags.includes('sila')) {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+5 puissance aux armes de mêlée" class="boutonVert skillButtons" onclick="goDrug('+apCost+',`sila`)"><i class="fas fa-fist-raised"></i> <span class="small">'+apCost+'</span></button>&nbsp; Sila</'+balise+'></span>');
                } else {
                    skillMessage = "Pas assez de PA";
                    if (bat.tags.includes('sila')) {
                        skillMessage = "Déjà sous l'effet de cette drogue";
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-fist-raised"></i> <span class="small">'+apCost+'</span></button>&nbsp; Sila</'+balise+'></span>');
                }
            }
        }
        // STARKA
        if (playerInfos.comp.ca >= 1) {
            if (allDrugs.includes('starka') || bat.tags.includes('starka')) {
                balise = 'h4';
                if (bat.tags.includes('starka')) {
                    balise = 'h3';
                }
                apCost = 0;
                let maxStarkaPA = bat.ap+1;
                if (bat.oldTileId === bat.tileId && bat.apLeft < maxStarkaPA && !bat.tags.includes('starka')) {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+'+bat.ap+' PA, maximum '+maxStarkaPA+' au total" class="boutonVert skillButtons" onclick="goDrug('+apCost+',`starka`)"><i class="fas fa-syringe"></i> <span class="small">'+apCost+'</span></button>&nbsp; Starka</'+balise+'></span>');
                } else {
                    skillMessage = "Conditions non requises";
                    if (bat.tags.includes('starka')) {
                        skillMessage = "Déjà sous l'effet de cette drogue";
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-syringe"></i> <span class="small">'+apCost+'</span></button>&nbsp; Starka</'+balise+'></span>');
                }
            }
        }
    }
    if ((batType.cat === 'vehicles' && !batType.skills.includes('emoteur')) || batType.skills.includes('oknitro')) {
        // NITRO
        if (playerInfos.comp.energ >= 1 && playerInfos.bldList.includes('Garage')) {
            if (allDrugs.includes('nitro') || bat.tags.includes('nitro')) {
                balise = 'h4';
                if (bat.tags.includes('nitro')) {
                    balise = 'h3';
                }
                apCost = 0;
                let maxNitroPA = bat.ap+1;
                let nitroPA = Math.round(bat.ap/3);
                if (bat.apLeft < maxNitroPA && !bat.tags.includes('nitro')) {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+'+nitroPA+' PA, maximum '+maxNitroPA+' et minimum 1" class="boutonVert skillButtons" onclick="goDrug('+apCost+',`nitro`)"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Nitro</'+balise+'></span>');
                } else {
                    skillMessage = "Conditions non requises";
                    if (bat.tags.includes('nitro')) {
                        skillMessage = "Déjà sous l'effet de cette drogue";
                    }
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Nitro</'+balise+'></span>');
                }
            }
        }
    }
    // EXTRACTION
    if (batType.skills.includes('extraction')) {
        let extractOK = false;
        if (bat.extracted !== undefined) {
            if (bat.extracted.length >= 1) {
                extractOK = true;
            }
        }
        balise = 'h4';
        if (bat.tags.includes('mining')) {
            balise = 'h3';
        }
        apCost = 5;
        apReq = 7;
        if (bat.apLeft >= apReq && !bat.tags.includes('mining') && !inMelee && extractOK) {
            $('#unitInfos').append('<span class="blockTitle"><h5><button type="button" title="Extraire les ressources" class="boutonGris skillButtons" onclick="extraction('+apCost+')"><i class="ra ra-mining-diamonds rpg"></i> <span class="small">'+apReq+'</span></button><button type="button" title="Choisir les ressources" class="boutonGris skillButtons" onclick="chooseRes(false)"><i class="fas fa-list"></i></button>&nbsp; Extraction</h5></span>');
        } else {
            if (inMelee) {
                skillMessage = "Impossible en mêlée";
            } else if (!extractOK) {
                skillMessage = "Aucune ressource choisie";
            } else if (bat.tags.includes('mining')) {
                skillMessage = "Déjà en train d'extraire";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-mining-diamonds rpg"></i> <span class="small">'+apReq+'</span></button><button type="button" title="Choisir les ressources" class="boutonGris skillButtons" onclick="chooseRes(false)"><i class="fas fa-list"></i></button>&nbsp; Extraction</'+balise+'></span>');
        }
    }
    // ACTIVATION
    if (batType.skills.includes('prodres') || batType.skills.includes('geo') || batType.skills.includes('solar')) {
        balise = 'h1';
        if (bat.tags.includes('prodres')) {
            balise = 'h3';
        }
        apCost = 0;
        if (!bat.tags.includes('prodres')) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Lancer la production de ressources" class="boutonGris skillButtons" onclick="prodToggle()"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>&nbsp; Désactivé</'+balise+'></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Arrêter la production de ressources" class="boutonGris skillButtons" onclick="prodToggle()"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>&nbsp; Activé</'+balise+'></span>');
        }
    }
    // CHARGER RESSOURCES
    if (batType.skills.includes('fret')) {
        let resToLoad = isResToLoad(bat);
        if (resToLoad) {
            balise = 'h4';
            apReq = 0;
            if (!inMelee) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Charger des ressources" class="boutonGris skillButtons" onclick="loadRes()"><i class="fas fa-truck-loading"></i> <span class="small">'+apReq+'</span></button>&nbsp; Chargement</'+balise+'></span>');
            } else {
                if (inMelee) {
                    skillMessage = "Impossible en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-truck-loading"></i> <span class="small">'+apReq+'</span></button>&nbsp; Chargement</'+balise+'></span>');
            }
        }
    }
    let trapType;
    let trapCostOK;
    // POSE PIEGES
    if (batType.skills.includes('trapfosse')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let minesLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            trapType = getBatTypeByName('Fosses');
            trapCostOK = checkCost(trapType.costs);
            apCost = Math.round(bat.ap*1.5);
            if (minesLeft >= 1 && bat.apLeft >= bat.ap-2 && !inMelee && trapCostOK) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des pièges '+displayCosts(trapType.costs)+'" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`trap-fosse`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Fosses</'+balise+'></span>');
            } else {
                if (minesLeft <= 0) {
                    skillMessage = "Plus de pièges";
                } else if (!trapCostOK) {
                    skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                } else if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Fosses</h4></span>');
            }
        }
    }
    if (batType.skills.includes('trapap')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let minesLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            trapType = getBatTypeByName('Pièges');
            trapCostOK = checkCost(trapType.costs);
            apCost = Math.round(bat.ap*1.25);
            if (minesLeft >= 1 && bat.apLeft >= bat.ap-2 && !inMelee && trapCostOK) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des pièges '+displayCosts(trapType.costs)+'" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`trap-ap`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Pièges</'+balise+'></span>');
            } else {
                if (minesLeft <= 0) {
                    skillMessage = "Plus de pièges";
                } else if (!trapCostOK) {
                    skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                } else if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Pièges</h4></span>');
            }
        }
    }
    if (batType.skills.includes('trapdard')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let minesLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            trapType = getBatTypeByName('Dardières');
            trapCostOK = checkCost(trapType.costs);
            apCost = Math.round(bat.ap*1.25);
            if (minesLeft >= 1 && bat.apLeft >= bat.ap-2 && !inMelee && trapCostOK) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des pièges '+displayCosts(trapType.costs)+'" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`trap-dard`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dardières</'+balise+'></span>');
            } else {
                if (minesLeft <= 0) {
                    skillMessage = "Plus de pièges";
                } else if (!trapCostOK) {
                    skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                } else if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dardières</h4></span>');
            }
        }
    }
    // POSE CHAMP DE MINES
    if (batType.skills.includes('landmine')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let minesLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            trapType = getBatTypeByName('Champ de mines');
            trapCostOK = checkCost(trapType.costs);
            apCost = Math.round(bat.ap*1.5);
            if (minesLeft >= 1 && bat.apLeft >= bat.ap-2 && !inMelee && trapCostOK) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer un champ de mines '+displayCosts(trapType.costs)+'" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`champ`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Champ de mines</'+balise+'></span>');
            } else {
                if (minesLeft <= 0) {
                    skillMessage = "Plus de mines";
                } else if (!trapCostOK) {
                    skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                } else if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Champ de mines</h4></span>');
            }
        }
    }
    // POSE DYNAMITE
    if (batType.skills.includes('dynamite')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let minesLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            trapType = getBatTypeByName('Explosifs');
            trapCostOK = checkCost(trapType.costs);
            apCost = Math.round(bat.ap);
            if (minesLeft >= 1 && bat.apLeft >= bat.ap-2 && !inMelee && trapCostOK) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des explosifs '+displayCosts(trapType.costs)+'" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`dynamite`)"><i class="ra ra-bomb-explosion rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Explosifs</'+balise+'></span>');
            } else {
                if (minesLeft <= 0) {
                    skillMessage = "Plus de mines";
                } else if (!trapCostOK) {
                    skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                } else if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-bomb-explosion rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Explosifs</h4></span>');
            }
        }
    }
    // POSE BARBELES
    if (batType.skills.includes('constructeur')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let barbLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            apCost = Math.ceil(batType.mecanoCost/4);
            let apCost2 = Math.ceil(batType.mecanoCost/1.5);
            apReq = Math.ceil(batType.mecanoCost/4);
            if (barbLeft >= 1 && bat.apLeft >= apReq && !inMelee) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><span id="barbButtons"></span>&nbsp; Barbelés</'+balise+'></span>');
                $('#barbButtons').empty();
                let barbType = getBatTypeByName('Barbelés (scrap)');
                let barbCostOK = checkCost(barbType.costs);
                if (barbCostOK) {
                    $('#barbButtons').append('<button type="button" title="Déposer des barbelés (scrap) '+displayCosts(barbType.costs)+'" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`barb-scrap`)"><i class="ra ra-crown-of-thorns rpg"></i></button>');
                } else {
                    skillMessage = "Pas assez de ressources "+displayCosts(barbType.costs);
                    $('#barbButtons').append('<button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-crown-of-thorns rpg"></i></button>');
                }
                barbType = getBatTypeByName('Barbelés');
                barbCostOK = checkCost(barbType.costs);
                if (barbCostOK) {
                    $('#barbButtons').append('<button type="button" title="Déposer des barbelés (acier) '+displayCosts(barbType.costs)+'" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`barb-fer`)"><i class="ra ra-crown-of-thorns rpg"></i></button>');
                } else {
                    skillMessage = "Pas assez de ressources "+displayCosts(barbType.costs);
                    $('#barbButtons').append('<button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-crown-of-thorns rpg"></i></button>');
                }
                barbType = getBatTypeByName('Barbelés (taser)');
                barbCostOK = checkCost(barbType.costs);
                if (barbCostOK && playerInfos.bldList.includes('Générateur')) {
                    $('#barbButtons').append('<button type="button" title="Déposer des barbelés (taser) '+displayCosts(barbType.costs)+'" class="boutonGris skillButtons" onclick="dropStuff('+apCost2+',`barb-taser`)"><i class="ra ra-crown-of-thorns rpg"></i></button>');
                } else {
                    if (!playerInfos.bldList.includes('Générateur')) {
                        skillMessage = "Vous avez besoin de Générateurs";
                    } else {
                        skillMessage = "Pas assez de ressources "+displayCosts(barbType.costs);
                    }
                    $('#barbButtons').append('<button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-crown-of-thorns rpg"></i></button>');
                }
            } else {
                if (barbLeft <= 0) {
                    skillMessage = "Plus de barbelés";
                } else if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Barbelés</h4></span>');
            }
        }
    }
    // INFRASTRUCTURE
    if (batType.skills.includes('constructeur')) {
        if (tile.terrain != 'W' && tile.terrain != 'R') {
            apReq = batType.mecanoCost;
            let infra;
            let infraCostOK;
            if (bat.apLeft >= apReq && !inMelee) {
                $('#unitInfos').append('<span class="blockTitle"><h4><span id="infraButtons"></span>&nbsp; Infra</h4></span>');
                $('#infraButtons').empty();
                if (tile.infra != 'Miradors') {
                    infra = getInfraByName('Miradors');
                    infraCostOK = checkCost(infra.costs);
                    if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def) {
                        prodOK = false;
                    } else {
                        prodOK = true;
                    }
                    if (infraCostOK && prodOK) {
                        $('#infraButtons').append('<button type="button" title="Construction (Miradors) '+displayCosts(infra.costs)+'" class="boutonGris skillButtons" onclick="putInfra(`Miradors`)"><span class="small">Mi</span></button>');
                    } else {
                        if (!prodOK) {
                            skillMessage = "Niveau insuffisant";
                        } else {
                            skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                        }
                        $('#infraButtons').append('<button type="button" title="Miradors: '+skillMessage+'" class="boutonGris skillButtons gf"><span class="small">Mi</span></button>');
                    }
                }
                if (tile.infra != 'Palissades') {
                    infra = getInfraByName('Palissades');
                    infraCostOK = checkCost(infra.costs);
                    if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def) {
                        prodOK = false;
                    } else {
                        prodOK = true;
                    }
                    if (infraCostOK && prodOK) {
                        $('#infraButtons').append('<button type="button" title="Construction (Palissades) '+displayCosts(infra.costs)+'" class="boutonGris skillButtons" onclick="putInfra(`Palissades`)"><span class="small">Pa</span></button>');
                    } else {
                        if (!prodOK) {
                            skillMessage = "Niveau insuffisant";
                        } else {
                            skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                        }
                        $('#infraButtons').append('<button type="button" title="Palissades: '+skillMessage+'" class="boutonGris skillButtons gf"><span class="small">Pa</span></button>');
                    }
                }
                if (tile.infra != 'Remparts') {
                    infra = getInfraByName('Remparts');
                    infraCostOK = checkCost(infra.costs);
                    if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def) {
                        prodOK = false;
                    } else {
                        prodOK = true;
                    }
                    if (infraCostOK && prodOK) {
                        $('#infraButtons').append('<button type="button" title="Construction (Remparts) '+displayCosts(infra.costs)+'" class="boutonGris skillButtons" onclick="putInfra(`Remparts`)"><span class="small">Re</span></button>');
                    } else {
                        if (!prodOK) {
                            skillMessage = "Niveau insuffisant";
                        } else {
                            skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                        }
                        $('#infraButtons').append('<button type="button" title="Remparts: '+skillMessage+'" class="boutonGris skillButtons gf"><span class="small">Re</span></button>');
                    }
                }
                if (tile.infra != 'Murailles') {
                    infra = getInfraByName('Murailles');
                    infraCostOK = checkCost(infra.costs);
                    if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def+playerInfos.comp.def) {
                        prodOK = false;
                    } else {
                        prodOK = true;
                    }
                    if (infraCostOK && prodOK) {
                        $('#infraButtons').append('<button type="button" title="Construction (Murailles) '+displayCosts(infra.costs)+'" class="boutonGris skillButtons" onclick="putInfra(`Murailles`)"><span class="small">Mu</span></button>');
                    } else {
                        if (!prodOK) {
                            skillMessage = "Niveau insuffisant";
                        } else {
                            skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                        }
                        $('#infraButtons').append('<button type="button" title="Murailles: '+skillMessage+'" class="boutonGris skillButtons gf"><span class="small">Mu</span></button>');
                    }
                }
                if (tile.infra != 'Terriers') {
                    infra = getInfraByName('Terriers');
                    if (infra.levels[playerInfos.gang] < 90) {
                        infraCostOK = checkCost(infra.costs);
                        if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def) {
                            prodOK = false;
                        } else {
                            prodOK = true;
                        }
                        if (infraCostOK && prodOK) {
                            $('#infraButtons').append('<button type="button" title="Construction (Terriers) '+displayCosts(infra.costs)+'" class="boutonGris skillButtons" onclick="putInfra(`Terriers`)"><span class="small">Te</span></button>');
                        } else {
                            if (!prodOK) {
                                skillMessage = "Niveau insuffisant";
                            } else {
                                skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                            }
                            $('#infraButtons').append('<button type="button" title="Terriers: '+skillMessage+'" class="boutonGris skillButtons gf"><span class="small">Te</span></button>');
                        }
                    }
                }
            }
        }
    }
    // ROUTES / PONTS
    if (batType.skills.includes('routes')) {
        if (!tile.rd) {
            apCost = Math.round(batType.mecanoCost*terrain.roadBuild*roadAPCost/30);
            apReq = Math.ceil(apCost/10);
            let roadCosts = getRoadCosts(tile);
            let roadCostsOK = checkCost(roadCosts);
            let roadName = 'Route';
            if (tile.terrain === 'W' || tile.terrain === 'R') {
                roadName = 'Pont';
            }
            if (bat.apLeft >= apReq && !inMelee && roadCostsOK) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction ('+roadName+') '+displayCosts(roadCosts)+'" class="boutonGris skillButtons" onclick="putRoad()"><i class="fas fa-road"></i> <span class="small">'+apCost+'</span></button>&nbsp; '+roadName+'</h4></span>');
            } else {
                if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else if (!roadCostsOK) {
                    skillMessage = "Pas assez de ressources "+displayCosts(roadCosts);
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-road"></i> <span class="small">'+apReq+'</span></button>&nbsp; '+roadName+'</h4></span>');
            }
        }
    }
    // POSE COFFRES
    if (batType.skills.includes('conscont')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            trapType = getBatTypeByName('Coffres');
            trapCostOK = checkCost(trapType.costs);
            apCost = 8;
            if (bat.apLeft >= bat.ap-2 && !inMelee && trapCostOK) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Construire des coffres '+displayCosts(trapType.costs)+'" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`coffre`)"><i class="fas fa-box-open"></i> <span class="small">'+apCost+'</span></button>&nbsp; Coffres</'+balise+'></span>');
            } else {
                if (!trapCostOK) {
                    skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                } else if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-box-open"></i> <span class="small">'+apCost+'</span></button>&nbsp; Coffres</h4></span>');
            }
        }
    }
    // UPGRADE BUILDING
    if (batType.skills.includes('upgrade')) {
        let isCharged = checkCharged(bat,'trans');
        apReq = 5;
        if (bat.apLeft >= apReq && !inMelee && !isCharged) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Transformer en '+batType.bldUp+'" class="boutonGris skillButtons" onclick="bfconst(`buildings`,false,`bld`)"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>&nbsp; Transformation</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else if (isCharged) {
                skillMessage = "Vous devez vider votre bataillon avant de le transformer";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>&nbsp; Transformation</h4></span>');
        }
    }
    // UPGRADE INFANTRY
    if (batType.skills.includes('uprank')) {
        let isInPlace = checkUprankPlace(bat,batType);
        let isXPok = checkUprankXP(bat,batType);
        let upBatType = getBatTypeByName(batType.unitUp);
        apReq = 5;
        if (bat.apLeft >= apReq && !inMelee && isInPlace && isXPok) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Transformer en '+batType.unitUp+'" class="boutonGris skillButtons" onclick="bfconst(`buildings`,false,`inf`)"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>&nbsp; Transformation</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else if (!isXPok) {
                skillMessage = "Ce bataillon n'a pas assez d'expérience pour être monté en grade";
            } else if (!isInPlace) {
                skillMessage = 'Vous devez être à côté d\'un '+upBatType.bldReq[0]+' pour monter ce bataillon en grade';
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>&nbsp; Transformation</h4></span>');
        }
    }
    // CONSTRUCTION BATIMENTS
    if (batType.skills.includes('constructeur')) {
        apReq = 5;
        if (bat.apLeft >= apReq && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction (bâtiments)" class="boutonGris skillButtons" onclick="bfconst(`buildings`,false,false)"><i class="fas fa-drafting-compass"></i> <span class="small">'+apReq+'</span></button>&nbsp; Construction</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-drafting-compass"></i> <span class="small">'+apReq+'</span></button>&nbsp; Construction</h4></span>');
        }
    }
    // CONSTRUCTION UNITES
    if (batType.skills.includes('producteur')) {
        apReq = 5;
        if (bat.apLeft >= apReq && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Production (unités)" class="boutonGris skillButtons" onclick="bfconst(`units`,false,false)"><i class="fas fa-id-card"></i> <span class="small">'+apReq+'</span></button>&nbsp; Production</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-drafting-compass"></i> <span class="small">'+apReq+'</span></button>&nbsp; Production</h4></span>');
        }
    }
    // FOUILLE DE RUINES
    if (batType.skills.includes('fouille') && tile.ruins && tile.sh >= 1) {
        apReq = 5;
        apCost = Math.round(1250/bat.squadsLeft/batType.squadSize/batType.crew);
        if (batType.cat === 'infantry' && !batType.skills.includes('moto') && !batType.skills.includes('fly')) {
            apCost = Math.floor(apCost/bat.ap*11);
        }
        if (apCost > bat.ap*1.5 || batType.skills.includes('moto') || batType.skills.includes('fly')) {
            apCost = Math.round(bat.ap*1.5);
        }
        if (bat.apLeft >= apReq && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Fouiller les ruines" class="boutonGris skillButtons" onclick="searchRuins('+apCost+')"><i class="fas fa-search"></i> <span class="small">'+apCost+'</span></button>&nbsp; Fouille</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-search"></i> <span class="small">'+apReq+'</span></button>&nbsp; Fouille</h4></span>');
        }
    }
    // DEBARQUER
    unloadInfos(bat,batType);
    // RECONSTRUIRE
    refabInfos(bat,batType);
    // CONSTRUCTION TRICHE
    if (batType.skills.includes('triche')) {
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction (Triche)" class="boutonGris skillButtons" onclick="bfconst(`all`,true,false)"><i class="fas fa-drafting-compass"></i></button>&nbsp; Construction</h4></span>');
    }
};
