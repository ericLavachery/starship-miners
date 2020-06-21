function skillsInfos(bat,batUnitType) {
    let skillMessage;
    let numTargets = 0;
    let apCost;
    let apReq;
    let inMelee = batInMelee(bat);
    console.log('inMelee='+inMelee);
    // RAVITAILLEMENT
    let anyRavit = checkRavit(bat);
    if (anyRavit && bat.tags.includes('ammoUsed')) {
        let apCost = batUnitType.ap;
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le plein de munitions" class="boutonGris iconButtons" onclick="goRavit('+apCost+')"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ravitaillement</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Ravitaillement</h4></span>');
        }
    }
    // STOCKS
    let anyStock = checkStock(bat);
    if (anyStock && bat.tags.includes('skillUsed')) {
        let apCost = batUnitType.ap;
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le plein de ravitaillements" class="boutonGris iconButtons" onclick="goStock('+apCost+')"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réapprovisionnement</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réapprovisionnement</h4></span>');
        }
    }
    // DEBARQUER
    unloadInfos(bat,batUnitType);
    // GUET
    if (batUnitType.weapon.rof >= 1 && !batUnitType.skills.includes('sentinelle') && batUnitType.ap >= 1) {
        apCost = 3;
        apReq = batUnitType.ap-3;
        if (bat.apLeft >= apReq && !bat.tags.includes('guet')) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le guet (pas de malus à la riposte)" class="boutonGris iconButtons" onclick="guet()"><i class="fas fa-binoculars"></i> <span class="small">'+apReq+'</span></button>&nbsp; Guet</h4></span>');
        } else {
            // pas assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Pas assez de PA" class="boutonGris iconButtons gf"><i class="fas fa-binoculars"></i> <span class="small">'+apReq+'</span></button>&nbsp; Guet</h4></span>');
        }
    }
    // FORTIFICATION
    if (batUnitType.skills.includes('fortif')) {
        apCost = batUnitType.ap;
        if (bat.apLeft >= apCost-2 && !bat.tags.includes('fortif') && !inMelee && bat.salvoLeft >= batUnitType.maxSalvo) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Se fortifier (bonus couverture)" class="boutonGris iconButtons" onclick="fortification()"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>&nbsp; Fortification</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Vous ne pouvez pas vous fortifier en mêlée";
            } else {
                skillMessage = "Pas assez de PA ou de salve";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>&nbsp; Fortification</h4></span>');
        }
    }
    // CAMOUFLAGE
    let camoufOK = true;
    if (batUnitType.skills.includes('camo')) {
        if (batUnitType.cat == 'buildings') {
            if (batUnitType.skills.includes('maycamo')) {
                apCost = Math.floor(batUnitType.ap*3.5);
                apReq = batUnitType.ap;
                if (inMelee) {
                    camoufOK = false;
                }
            } else {
                apCost = Math.floor(batUnitType.ap*2);
                apReq = batUnitType.ap;
                if (inMelee) {
                    camoufOK = false;
                }
            }
        } else if (batUnitType.cat == 'vehicles' || batUnitType.skills.includes('machine')) {
            if (batUnitType.skills.includes('maycamo')) {
                apCost = Math.floor(batUnitType.ap*Math.sqrt(batUnitType.size)/1.8);
                apReq = batUnitType.ap;
                if (inMelee) {
                    camoufOK = false;
                }
            } else {
                apCost = Math.floor(batUnitType.ap/2);
                apReq = 3;
                if (inMelee) {
                    camoufOK = false;
                }
            }
        } else {
            if (batUnitType.skills.includes('maycamo')) {
                apCost = Math.floor(batUnitType.ap*Math.sqrt(batUnitType.size)/1.15);
                apReq = batUnitType.ap;
                if (inMelee) {
                    camoufOK = false;
                }
            } else {
                apCost = Math.floor(batUnitType.ap/3);
                apReq = 1;
            }
        }
        if (bat.apLeft >= apReq && bat.fuzz >= -1 && camoufOK) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Mode furtif" class="boutonGris iconButtons" onclick="camouflage('+apCost+')"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Mode furtif</h4></span>');
        } else {
            if (bat.fuzz <= -2) {
                skillMessage = "Déjà en mode furtif";
            } else if (!camoufOK) {
                skillMessage = "Impossible en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Mode furtif</h4></span>');
        }
        if (bat.tags.includes('camo') || (bat.fuzz <= -2 && (batUnitType.skills.includes('camo') || batUnitType.skills.includes('maycamo')))) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Sortir du mode furtif" class="boutonGris iconButtons" onclick="camoOut()"><i class="ra ra-footprint rpg"></i> <span class="small">0</span></button>&nbsp; Mode non furtif</h4></span>');
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
        if (bat.apLeft >= apReq && bat.tags.includes('camo') && bat.apLeft >= apCost+cheapWeapCost) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embuscade (Initiative + Cadence de tir 150%)" class="boutonGris iconButtons" onclick="ambush()"><i class="ra ra-hood rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embuscade</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            if (!bat.tags.includes('camo')) {
                skillMessage = "Vous n'êtes pas en mode furtif";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="ra ra-hood rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Embuscade</h4></span>');
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
            balise = 'h1';
        }
        if (bat.apLeft >= apReq && !bat.tags.includes('vise') && bat.apLeft >= apCost+cheapWeapCost) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+5 précision, 2/3 cadence de tir (3 PA + coût de l\'arme)" class="boutonGris iconButtons" onclick="tirCible()"><i class="fas fa-crosshairs"></i> <span class="small">'+apCost+'</span></button>&nbsp; Tir ciblé</'+balise+'></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Pas assez de PA" class="boutonGris iconButtons gf"><i class="fas fa-crosshairs"></i> <span class="small">'+apCost+'</span></button>&nbsp; Tir ciblé</'+balise+'></span>');
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
            balise = 'h1';
        }
        if (bat.apLeft >= apReq && !bat.tags.includes('luckyshot') && !bat.tags.includes('lucky') && bat.apLeft >= cheapWeapCost) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Lucky shot automatique sur cette attaque" class="boutonGris iconButtons" onclick="luckyShot()"><i class="fas fa-dice-six"></i> <span class="small">0</span></button>&nbsp; Lucky shot</'+balise+'></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Pas assez de bol ou de PA" class="boutonGris iconButtons gf"><i class="fas fa-dice-six"></i> <span class="small">'+apCost+'</span></button>&nbsp; Lucky shot</'+balise+'></span>');
        }
    }
    // MEDIC
    let baseskillCost;
    if (batUnitType.skills.includes('medic')) {
        numTargets = numMedicTargets(bat,'infantry',true,true);
        baseskillCost = batUnitType.skillCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Soigner les infanteries adjacentes" class="boutonGris iconButtons" onclick="medic(`infantry`,'+baseskillCost+',true,true)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
        }
    }
    // BASE MEDIC
    if (batUnitType.skills.includes('badmedic')) {
        numTargets = numMedicTargets(bat,'infantry',true,false);
        baseskillCost = batUnitType.skillCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Soigner les infanteries adjacentes" class="boutonGris iconButtons" onclick="medic(`infantry`,'+baseskillCost+',true,false)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
        }
    }
    // SELF MEDIC
    if (batUnitType.skills.includes('selfmedic')) {
        numTargets = numMedicTargets(bat,'infantry',false,true);
        apCost = Math.round(batUnitType.ap/1.5);
        if (bat.apLeft >= apCost && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Se soigner" class="boutonGris iconButtons" onclick="medic(`infantry`,'+apCost+',false,true)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Soins</h4></span>');
        }
    }
    // FIRST AID (SELF BAD MEDIC)
    if (batUnitType.skills.includes('firstaid')) {
        numTargets = numMedicTargets(bat,'infantry',false,false);
        apCost = Math.round(batUnitType.ap/1.5);
        if (bat.apLeft >= apCost && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Premiers soins" class="boutonGris iconButtons" onclick="medic(`infantry`,'+apCost+',false,false)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Premiers soins</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>&nbsp; Premiers soins</h4></span>');
        }
    }
    // MECANO
    if (batUnitType.skills.includes('mecano')) {
        numTargets = numMedicTargets(bat,'vehicles',true,true);
        baseskillCost = batUnitType.skillCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les véhicules adjacents" class="boutonGris iconButtons" onclick="medic(`vehicles`,'+baseskillCost+',true,true)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        }
    }
    // BASE MECANO
    if (batUnitType.skills.includes('badmecano')) {
        numTargets = numMedicTargets(bat,'vehicles',true,false);
        apCost = numTargets*(8+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= 4 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les véhicules adjacents" class="boutonGris iconButtons" onclick="medic(`vehicles`,8,true,false)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        }
    }
    // SELF MECANO
    if (batUnitType.skills.includes('selfmecano')) {
        numTargets = numMedicTargets(bat,'vehicles',false,false);
        apCost = Math.round(batUnitType.ap*1.4);
        if (bat.apLeft >= batUnitType.ap && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Retaper le véhicule" class="boutonGris iconButtons" onclick="medic(`vehicles`,'+apCost+',false,false)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        } else {
            if (numTargets <= 0) {
                skillMessage = "Ce véhicule n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        }
    }
    // DEEP SELF MECANO
    if (batUnitType.skills.includes('deepselfmecano')) {
        numTargets = numMedicTargets(bat,'vehicles',false,true);
        apCost = batUnitType.ap;
        if (bat.apLeft >= batUnitType.ap/2 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Retaper le véhicule" class="boutonGris iconButtons" onclick="medic(`vehicles`,'+apCost+',false,true)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        } else {
            if (numTargets <= 0) {
                skillMessage = "Ce véhicule n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>&nbsp; Dépannage</h4></span>');
        }
    }
    // REPAIR
    if (batUnitType.skills.includes('repair') && !inMelee) {
        numTargets = numMedicTargets(bat,'buildings',true,true);
        baseskillCost = batUnitType.skillCost;
        apCost = numTargets*(baseskillCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les bâtiments adjacents" class="boutonGris iconButtons" onclick="medic(`buildings`,'+baseskillCost+',true,true)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        }
    }
    // SELF REPAIR
    if (batUnitType.skills.includes('selfrepair')) {
        numTargets = numMedicTargets(bat,'buildings',false,false);
        apCost = Math.round(batUnitType.ap*2);
        if (bat.apLeft >= batUnitType.ap/2 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer le bâtiment" class="boutonGris iconButtons" onclick="medic(`all`,'+apCost+',false,false)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        } else {
            if (numTargets <= 0) {
                skillMessage = "Ce bâtiment n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        }
    }
    // SELF REPAIR DEEP
    if (batUnitType.skills.includes('deepselfrepair')) {
        numTargets = numMedicTargets(bat,'buildings',false,true);
        apCost = batUnitType.ap;
        if (bat.apLeft >= batUnitType.ap/2 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer le bâtiment" class="boutonGris iconButtons" onclick="medic(`all`,'+apCost+',false,true)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        } else {
            if (numTargets <= 0) {
                skillMessage = "Ce bâtiment n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>&nbsp; Réparations</h4></span>');
        }
    }
    // POSE CHAMP DE MINES
    if (batUnitType.skills.includes('landmine')) {
        let minesLeft = calcRavit(bat);
        balise = 'h4';
        if (Object.keys(conselUnit).length >= 1) {
            balise = 'h1';
        }
        apCost = Math.round(batUnitType.ap*1.5);
        if (minesLeft >= 1 && bat.apLeft >= batUnitType.ap && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer un champ de mines" class="boutonGris iconButtons" onclick="dropMine('+apCost+',`champ`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Champ de mines</'+balise+'></span>');
        } else {
            if (minesLeft <= 0) {
                skillMessage = "Plus de mines";
            } else if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fas fa-coins"></i> <span class="small">'+apCost+'</span></button>&nbsp; Champ de mines</h4></span>');
        }
    }
    // POSE DYNAMITE
    if (batUnitType.skills.includes('dynamite')) {
        let minesLeft = calcRavit(bat);
        balise = 'h4';
        if (Object.keys(conselUnit).length >= 1) {
            balise = 'h1';
        }
        apCost = Math.round(batUnitType.ap);
        if (minesLeft >= 1 && bat.apLeft >= batUnitType.ap && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des explosifs" class="boutonGris iconButtons" onclick="dropMine('+apCost+',`dynamite`)"><i class="ra ra-bomb-explosion rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Explosifs</'+balise+'></span>');
        } else {
            if (minesLeft <= 0) {
                skillMessage = "Plus de mines";
            } else if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="ra ra-bomb-explosion rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Explosifs</h4></span>');
        }
    }
    // DROGUES
    if (!batUnitType.skills.includes('mutant') && !batUnitType.skills.includes('cyber') && batUnitType.cat === 'infantry') {
        let allDrugs = checkDrugs(bat);
        // KIRIN
        if (allDrugs.includes('kirin') && !bat.tags.includes('kirin')) {
            apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Régénération" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`kirin`)"><i class="ra ra-heart-bottle rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Kirin</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="ra ra-heart-bottle rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Kirin</h4></span>');
            }
        }
        // BLISS
        if (allDrugs.includes('bliss') && !bat.tags.includes('bliss')) {
            apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Dégâts reçus réduits mais -2 PA, immunisé à la peur" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`bliss`)"><i class="ra ra-pills rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Bliss</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="ra ra-pills rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Bliss</h4></span>');
            }
        }
        // BLAZE
        if (allDrugs.includes('blaze') && !bat.tags.includes('blaze')) {
            apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="+8 PA & +1 salve" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`blaze`)"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Blaze</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>&nbsp; Blaze</h4></span>');
            }
        }
        // SKUPIAC
        if (allDrugs.includes('skupiac') && !bat.tags.includes('skupiac')) {
            apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Concentration: +6 précision" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`skupiac`)"><i class="far fa-eye"></i> <span class="small">'+apCost+'</span></button>&nbsp; Skupiac</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="far fa-eye"></i> <span class="small">'+apCost+'</span></button>&nbsp; Skupiac</h4></span>');
            }
        }
        // SILA
        if (allDrugs.includes('sila') && !bat.tags.includes('sila')) {
            apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="+4 puissance aux armes de mêlée" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`sila`)"><i class="fas fa-fist-raised"></i> <span class="small">'+apCost+'</span></button>&nbsp; Sila</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fas fa-fist-raised"></i> <span class="small">'+apCost+'</span></button>&nbsp; Sila</h4></span>');
            }
        }
        // STARKA
        if (allDrugs.includes('starka') && !bat.tags.includes('starka')) {
            apCost = 0;
            let maxStarkaPA = batUnitType.ap+1;
            if (bat.oldTileId === bat.tileId && bat.apLeft < maxStarkaPA) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="+'+batUnitType.ap+' PA, maximum '+maxStarkaPA+' au total" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`starka`)"><i class="fas fa-syringe"></i> <span class="small">'+apCost+'</span></button>&nbsp; Starka</h4></span>');
            } else {
                skillMessage = "Conditions non requises";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="fas fa-syringe"></i> <span class="small">'+apCost+'</span></button>&nbsp; Starka</h4></span>');
            }
        }
    }
    // EXTRACTION
    if (batUnitType.skills.includes('extraction')) {
        balise = 'h4';
        if (bat.tags.includes('mining')) {
            balise = 'h1';
        }
        apCost = 5;
        apReq = 7;
        if (bat.apLeft >= apReq && !bat.tags.includes('mining') && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Extraire des ressources" class="boutonGris iconButtons" onclick="extraction('+apCost+')"><i class="ra ra-mining-diamonds rpg"></i> <span class="small">'+apReq+'</span></button>&nbsp; Extraction</'+balise+'></span>');
        } else {
            if (inMelee) {
                skillMessage = "Impossible en mêlée";
            } else if (bat.tags.includes('mining')) {
                skillMessage = "Déjà en train d'extraire";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons gf"><i class="ra ra-mining-diamonds rpg"></i> <span class="small">'+apReq+'</span></button>&nbsp; Extraction</'+balise+'></span>');
        }
    }
    // CONSTRUCTION TRICHE
    if (batUnitType.skills.includes('constructeur')) {
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction (Triche)" class="boutonGris iconButtons" onclick="bfconst()"><i class="fa fa-hammer"></i></button>&nbsp; Construction</h4></span>');
    }
    // DISMANTLE
    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Démanteler" class="boutonRouge iconButtons" onclick="dismantle('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Démanteler</h4></span>');
};
