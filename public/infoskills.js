function skillsInfos(bat,batUnitType) {
    let skillMessage;
    let numTargets = 0;
    let apCost;
    let apReq;
    let tile = getTile(bat);
    let terrain = getTerrain(bat);
    let inMelee = batInMelee(bat);
    let freeConsTile = false;
    console.log('inMelee='+inMelee);
    // RAVITAILLEMENT DROGUES
    let anyRavit = checkRavitDrug(bat);
    if (anyRavit && bat.tags.includes('skillUsed') && batUnitType.skills.includes('dealer')) {
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
    if (anyRavit && bat.tags.includes('ammoUsed')) {
        let apCost = Math.round(bat.ap*1.5);
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le plein de munitions" class="boutonGris skillButtons" onclick="goRavit('+apCost+')"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ravitaillement</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ravitaillement</h4></span>');
        }
    }
    // STOCKS
    let anyStock = checkStock(bat);
    if (anyStock && bat.tags.includes('skillUsed') && !batUnitType.skills.includes('dealer')) {
        let apCost = Math.round(bat.ap*1.5);
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le plein de ravitaillements" class="boutonGris skillButtons" onclick="goStock('+apCost+')"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réapprovisionnement</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réapprovisionnement</h4></span>');
        }
    }
    // GUET
    if (batUnitType.weapon.rof >= 1 && bat.ap >= 1) {
        balise = 'h4';
        if (bat.tags.includes('guet') || batUnitType.skills.includes('sentinelle') || batUnitType.skills.includes('initiative') || batUnitType.skills.includes('after')) {
            balise = 'h3';
        }
        apCost = 3;
        apReq = bat.ap-3;
        if (bat.apLeft >= apReq && !bat.tags.includes('guet') && !batUnitType.skills.includes('sentinelle') && !batUnitType.skills.includes('initiative') && !batUnitType.skills.includes('after')) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Faire le guet (pas de malus à la riposte)" class="boutonGris skillButtons" onclick="guet()"><i class="fas fa-binoculars"></i> <span class="small">'+apReq+'</span></button>&nbsp; Guet</'+balise+'></span>');
        } else {
            if (batUnitType.skills.includes('sentinelle') || batUnitType.skills.includes('initiative') || batUnitType.skills.includes('after')) {
                skillMessage = "Sentinelle";
            } else {
                skillMessage = "Pas assez de PA";
            }
            // pas assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-binoculars"></i> <span class="small">'+apReq+'</span></button>&nbsp; Guet</'+balise+'></span>');
        }
    }
    // FORTIFICATION
    if (batUnitType.skills.includes('fortif')) {
        balise = 'h4';
        if (bat.tags.includes('fortif')) {
            balise = 'h3';
        }
        apCost = bat.ap;
        if (bat.apLeft >= apCost-2 && !bat.tags.includes('fortif') && !inMelee && bat.salvoLeft >= batUnitType.maxSalvo) {
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
    if (batUnitType.skills.includes('camo') || (tile.ruins && batUnitType.size < 20) || bat.fuzz <= -2) {
        if (batUnitType.cat == 'buildings') {
            if (batUnitType.skills.includes('maycamo') && !tile.ruins) {
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
        } else if (batUnitType.cat == 'vehicles' || batUnitType.skills.includes('machine') || batUnitType.cat == 'devices') {
            if (batUnitType.skills.includes('maycamo') && !tile.ruins) {
                apCost = Math.floor(bat.ap*Math.sqrt(batUnitType.size)/1.8);
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
            if (batUnitType.skills.includes('maycamo') && !tile.ruins) {
                apCost = Math.floor(bat.ap*Math.sqrt(batUnitType.size)/1.15);
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
        if (bat.tags.includes('camo') || (bat.fuzz <= -2 && (batUnitType.skills.includes('camo') || batUnitType.skills.includes('maycamo')))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Sortir du mode furtif" class="boutonGris skillButtons" onclick="camoOut()"><i class="ra ra-footprint rpg"></i> <span class="small">0</span></button>&nbsp; Mode non furtif</h4></span>');
        }
    }
    // EMBUSCADE
    if (batUnitType.skills.includes('embuscade')) {
        apCost = 2;
        if (batUnitType.weapon2.rof >= 1 && batUnitType.weapon.cost > batUnitType.weapon2.rof) {
            apReq = 2+batUnitType.weapon2.cost;
        } else {
            apReq = 2+batUnitType.weapon.cost;
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
    if (batUnitType.skills.includes('cible')) {
        apCost = 3;
        if (batUnitType.weapon2.rof >= 1 && batUnitType.weapon.cost > batUnitType.weapon2.rof) {
            apReq = 3+batUnitType.weapon2.cost;
        } else {
            apReq = 3+batUnitType.weapon.cost;
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
    if (batUnitType.skills.includes('luckyshot')) {
        if (batUnitType.weapon2.rof >= 1 && batUnitType.weapon.cost > batUnitType.weapon2.rof) {
            apReq = batUnitType.weapon2.cost;
        } else {
            apReq = batUnitType.weapon.cost;
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
    if (batUnitType.skills.includes('prayer')) {
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
    if (batUnitType.skills.includes('fog')) {
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
    if (batUnitType.skills.includes('medic')) {
        numTargets = numMedicTargets(bat,'infantry',true,true);
        baseskillCost = batUnitType.mediCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('badmedic')) {
        numTargets = numMedicTargets(bat,'infantry',true,false);
        baseskillCost = batUnitType.mediCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('selfmedic')) {
        numTargets = numMedicTargets(bat,'infantry',false,true);
        baseskillCost = batUnitType.mediCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('selfbadmedic')) {
        numTargets = numMedicTargets(bat,'infantry',false,false);
        baseskillCost = batUnitType.mediCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('mecano')) {
        numTargets = numMedicTargets(bat,'vehicles',true,true);
        baseskillCost = batUnitType.mecanoCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('badmecano')) {
        numTargets = numMedicTargets(bat,'vehicles',true,false);
        baseskillCost = batUnitType.mecanoCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('selfbadmecano')) {
        numTargets = numMedicTargets(bat,'vehicles',false,false);
        baseskillCost = batUnitType.mecanoCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('selfmecano')) {
        numTargets = numMedicTargets(bat,'vehicles',false,true);
        baseskillCost = batUnitType.mecanoCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('repair') && !inMelee) {
        numTargets = numMedicTargets(bat,'buildings',true,true);
        baseskillCost = batUnitType.mecanoCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('selfbadrepair')) {
        numTargets = numMedicTargets(bat,'buildings',false,false);
        baseskillCost = batUnitType.mecanoCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if (batUnitType.skills.includes('selfrepair')) {
        numTargets = numMedicTargets(bat,'buildings',false,true);
        baseskillCost = batUnitType.mecanoCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
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
    if ((batUnitType.cat === 'buildings' || batUnitType.cat === 'devices') && !batUnitType.skills.includes('nobld') && !batUnitType.skills.includes('norepair') && (bat.damage >= 1 || bat.squadsLeft < batUnitType.squads)) {
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
    if (batUnitType.cat === 'infantry') {
        let allDrugs = checkDrugs(bat);
        // KIRIN
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
        // OCTIRON
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
        // BLISS
        if ((allDrugs.includes('bliss') && !batUnitType.skills.includes('cyber')) || bat.tags.includes('bliss')) {
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
        // BLAZE
        if ((allDrugs.includes('blaze') && !batUnitType.skills.includes('cyber')) || bat.tags.includes('blaze')) {
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
        // SKUPIAC
        if ((allDrugs.includes('skupiac') && !batUnitType.skills.includes('cyber')) || bat.tags.includes('skupiac')) {
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
        // SILA
        if ((allDrugs.includes('sila') && !batUnitType.skills.includes('cyber')) || bat.tags.includes('sila')) {
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
        // STARKA
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
    // EXTRACTION
    if (batUnitType.skills.includes('extraction')) {
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
    // CHARGER RESSOURCES
    if (batUnitType.skills.includes('fret')) {
        let resToLoad = isResToLoad(bat);
        if (resToLoad) {
            balise = 'h4';
            apReq = 1;
            if (bat.apLeft >= apReq && !inMelee) {
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
    // POSE PIEGES
    if (batUnitType.skills.includes('pieges')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let minesLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            apCost = Math.round(bat.ap*1.5);
            if (minesLeft >= 1 && bat.apLeft >= bat.ap-2 && !inMelee) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des pièges" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`piege`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Pièges</'+balise+'></span>');
            } else {
                if (minesLeft <= 0) {
                    skillMessage = "Plus de pièges";
                } else if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Pièges</h4></span>');
            }
        }
    }
    // POSE CHAMP DE MINES
    if (batUnitType.skills.includes('landmine')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let minesLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            apCost = Math.round(bat.ap*1.5);
            if (minesLeft >= 1 && bat.apLeft >= bat.ap-2 && !inMelee) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer un champ de mines" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`champ`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Champ de mines</'+balise+'></span>');
            } else {
                if (minesLeft <= 0) {
                    skillMessage = "Plus de mines";
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
    if (batUnitType.skills.includes('dynamite')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let minesLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            apCost = Math.round(bat.ap);
            if (minesLeft >= 1 && bat.apLeft >= bat.ap-2 && !inMelee) {
                $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des explosifs" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`dynamite`)"><i class="ra ra-bomb-explosion rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Explosifs</'+balise+'></span>');
            } else {
                if (minesLeft <= 0) {
                    skillMessage = "Plus de mines";
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
    if (batUnitType.skills.includes('constructeur')) {
        freeConsTile = checkFreeConsTile(bat);
        if (freeConsTile) {
            let barbLeft = calcRavit(bat);
            balise = 'h4';
            if (Object.keys(conselUnit).length >= 1) {
                balise = 'h3';
            }
            apCost = Math.ceil(batUnitType.mecanoCost/4);
            let apCost2 = Math.ceil(batUnitType.mecanoCost/1.5);
            apReq = Math.ceil(batUnitType.mecanoCost/4);
            if (barbLeft >= 1 && bat.apLeft >= apReq && !inMelee) {
                if (playerInfos.bldList.includes('Générateur')) {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des barbelés (scrap)" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`barb-scrap`)"><i class="ra ra-crown-of-thorns rpg"></i></button><button type="button" title="Déposer des barbelés (acier)" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`barb-fer`)"><i class="ra ra-crown-of-thorns rpg"></i></button><button type="button" title="Déposer des barbelés (taser)" class="boutonGris skillButtons" onclick="dropStuff('+apCost2+',`barb-taser`)"><i class="ra ra-crown-of-thorns rpg"></i></button>&nbsp; Barbelés</'+balise+'></span>');
                } else {
                    $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des barbelés (scrap)" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`barb-scrap`)"><i class="ra ra-crown-of-thorns rpg"></i></button><button type="button" title="Déposer des barbelés (acier)" class="boutonGris skillButtons" onclick="dropStuff('+apCost+',`barb-fer`)"><i class="ra ra-crown-of-thorns rpg"></i></button>&nbsp; Barbelés</'+balise+'></span>');
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
    // ROUTES / PONTS
    if (batUnitType.skills.includes('routes')) {
        if (!tile.rd) {
            apCost = Math.round(batUnitType.mecanoCost*terrain.roadBuild*roadAPCost/30);
            apReq = Math.ceil(apCost/10);
            if (bat.apLeft >= apReq && !inMelee) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction (routes et ponts)" class="boutonGris skillButtons" onclick="putRoad()"><i class="fas fa-road"></i> <span class="small">'+apCost+'</span></button>&nbsp; Route / Pont</h4></span>');
            } else {
                if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-road"></i> <span class="small">'+apReq+'</span></button>&nbsp; Route / Pont</h4></span>');
            }
        }
    }
    // TALUS
    if (batUnitType.skills.includes('constructeur')) {
        if (!tile.talus && !tile.ruins && (tile.terrain === 'P' || tile.terrain === 'G')) {
            apCost = Math.round(Math.sqrt(batUnitType.mecanoCost)*10);
            apReq = batUnitType.mecanoCost;
            if (bat.apLeft >= apReq && !inMelee) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction (talus)" class="boutonGris skillButtons" onclick="putTalus()"><i class="fas fa-mountain"></i> <span class="small">'+apCost+'</span></button>&nbsp; Talus</h4></span>');
            } else {
                if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-mountain"></i> <span class="small">'+apReq+'</span></button>&nbsp; Talus</h4></span>');
            }
        }
    }
    // CONSTRUCTION
    if (batUnitType.skills.includes('constructeur')) {
        apReq = 5;
        if (bat.apLeft >= apReq && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction (bâtiments)" class="boutonGris skillButtons" onclick="bfconst(`buildings`,false)"><i class="fas fa-drafting-compass"></i> <span class="small">'+apReq+'</span></button>&nbsp; Construction</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris skillButtons gf"><i class="fas fa-drafting-compass"></i> <span class="small">'+apReq+'</span></button>&nbsp; Construction</h4></span>');
        }
    }
    // FOUILLE DE RUINES
    if (batUnitType.skills.includes('fouille') && tile.ruins && tile.sh >= 1) {
        apReq = 5;
        apCost = Math.round(1250/bat.squadsLeft/batUnitType.squadSize/batUnitType.crew);
        if (batUnitType.cat === 'infantry' && !batUnitType.skills.includes('moto') && !batUnitType.skills.includes('fly')) {
            apCost = Math.floor(apCost/bat.ap*11);
        }
        if (apCost > bat.ap*1.5 || batUnitType.skills.includes('moto') || batUnitType.skills.includes('fly')) {
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
    unloadInfos(bat,batUnitType);
    // RECONSTRUIRE
    refabInfos(bat,batUnitType);
    // CONSTRUCTION TRICHE
    if (batUnitType.skills.includes('triche')) {
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction (Triche)" class="boutonGris skillButtons" onclick="bfconst(`all`,true)"><i class="fas fa-drafting-compass"></i></button>&nbsp; Construction</h4></span>');
    }
};
