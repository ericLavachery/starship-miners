function skillsInfos(bat,batUnitType) {
    let skillMessage;
    let numTargets = 0;
    let apCost;
    let inMelee = batInMelee(bat);
    console.log('inMelee='+inMelee);
    // RAVITAILLEMENT
    let anyRavit = checkRavit(bat);
    if (anyRavit && bat.tags.includes('ammoUsed')) {
        let apCost = batUnitType.ap;
        if (bat.apLeft >= apCost) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le plein de munitions ('+apCost+' PA)" class="boutonGris iconButtons" onclick="goRavit('+apCost+')"><i class="ra ra-ammo-bag rpg"></i></button>&nbsp; Ravitaillement</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Ravitaillement</h4></span>');
        }
    }
    // STOCKS
    let anyStock = checkStock(bat);
    if (anyStock && bat.tags.includes('skillUsed')) {
        let apCost = batUnitType.ap;
        if (bat.apLeft >= apCost) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le plein de ravitaillements ('+apCost+' PA)" class="boutonGris iconButtons" onclick="goStock('+apCost+')"><i class="fas fa-cubes"></i></button>&nbsp; Réapprovisionnement</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Réapprovisionnement</h4></span>');
        }
    }
    // GUET
    if (batUnitType.weapon.rof >= 1 && !batUnitType.skills.includes('sentinelle') && batUnitType.ap >= 1) {
        if (bat.apLeft >= batUnitType.ap-3 && !bat.tags.includes('guet')) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Faire le guet (pas de malus à la riposte) (3 PA)" class="boutonGris iconButtons" onclick="guet()"><i class="fas fa-binoculars"></i></button>&nbsp; Guet</h4></span>');
        } else {
            // pas assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Pas assez de PA" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Guet</h4></span>');
        }
    }
    // FORTIFICATION
    if (batUnitType.skills.includes('fortif')) {
        if (bat.apLeft >= batUnitType.ap && !bat.tags.includes('fortif') && !inMelee && bat.salvoLeft >= batUnitType.maxSalvo) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Se fortifier (bonus couverture) ('+batUnitType.ap+' PA)" class="boutonGris iconButtons" onclick="fortification()"><i class="fas fa-shield-alt"></i></button>&nbsp; Fortification</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Vous ne pouvez pas vous fortifier en mêlée";
            } else {
                skillMessage = "Pas assez de PA ou de salve";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Fortification</h4></span>');
        }
    }
    // CAMOUFLAGE
    if (batUnitType.skills.includes('camo')) {
        apCost = Math.floor(batUnitType.ap/3);
        if (bat.apLeft >= 1 && bat.fuzz >= -1) {
            skillMessage = "Mode furtif";
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+' ('+apCost+' PA)" class="boutonGris iconButtons" onclick="camouflage(false)"><i class="ra ra-grass rpg"></i></button>&nbsp; Mode furtif</h4></span>');
        } else {
            if (bat.fuzz <= -2) {
                skillMessage = "Déjà en mode furtif";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Mode furtif</h4></span>');
        }
        if (bat.tags.includes('camo')) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Sortir du mode furtif" class="boutonGris iconButtons" onclick="camoOut()"><i class="ra ra-footprint rpg"></i></button>&nbsp; Mode non furtif</h4></span>');
        }
    }
    // EMBUSCADE
    if (batUnitType.skills.includes('embuscade')) {
        apCost = Math.ceil(batUnitType.ap/2);
        if (bat.apLeft >= apCost && bat.tags.includes('camo')) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embuscade (Initiative + Cadence de tir 150%) ('+apCost+' PA)" class="boutonGris iconButtons" onclick="ambush()"><i class="ra ra-hood rpg"></i></button>&nbsp; Embuscade</h4></span>');
        } else {
            skillMessage = "Pas assez de PA";
            if (!bat.tags.includes('camo')) {
                skillMessage = "Vous n'êtes pas en mode furtif";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Embuscade</h4></span>');
        }
    }
    // TIR CIBLE
    // intéressant si précision en dessous de 10
    if (batUnitType.skills.includes('cible')) {
        balise = 'h4';
        if (bat.tags.includes('vise')) {
            balise = 'h1';
        }
        if (bat.apLeft >= 3 && !bat.tags.includes('vise')) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+5 précision, 2/3 cadence de tir (3 PA + coût de l\'arme)" class="boutonGris iconButtons" onclick="tirCible()"><i class="fas fa-crosshairs"></i></button>&nbsp; Tir ciblé</'+balise+'></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Pas assez de PA" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Tir ciblé</'+balise+'></span>');
        }
    }
    // LUCKY SHOT
    if (batUnitType.skills.includes('luckyshot')) {
        balise = 'h4';
        if (bat.tags.includes('luckyshot')) {
            balise = 'h1';
        }
        if (!bat.tags.includes('luckyshot') && !bat.tags.includes('lucky')) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Lucky shot automatique sur cette attaque" class="boutonGris iconButtons" onclick="luckyShot()"><i class="fas fa-dice-six"></i></button>&nbsp; Lucky shot</'+balise+'></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Pas assez de bol" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Lucky shot</'+balise+'></span>');
        }
    }
    // MEDIC
    if (batUnitType.skills.includes('medic')) {
        numTargets = numMedicTargets(bat,'infantry');
        let baseMedicCost = batUnitType.medicCost;
        apCost = numTargets*(baseMedicCost+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= 4 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Soigner les infanteries adjacentes ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`infantry`,'+baseMedicCost+',true,true)"><i class="far fa-heart"></i></button>&nbsp; Soins</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Soins</h4></span>');
        }
    }
    // SELF MEDIC
    if (batUnitType.skills.includes('selfmedic')) {
        let damaged = false;
        if (bat.damage >=1) {
            damaged = true;
        }
        apCost = batUnitType.ap;
        if (bat.apLeft >= apCost && damaged && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Se soigner ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`infantry`,'+apCost+',false,true)"><i class="far fa-heart"></i></button>&nbsp; Soins</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Pas de soins en mêlée";
            } else {
                if (!damaged) {
                    skillMessage = "Aucun dégâts soignable";
                } else {
                    skillMessage = "Pas assez de PA";
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Soins</h4></span>');
        }
    }
    // FIRST AID
    if (batUnitType.skills.includes('firstaid')) {
        let damaged = false;
        if (bat.damage >=1) {
            damaged = true;
        }
        apCost = Math.round(batUnitType.ap*1.4);
        if (bat.apLeft >= batUnitType.ap && damaged && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Premiers soins ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`infantry`,'+apCost+',false,false)"><i class="far fa-heart"></i></button>&nbsp; Premiers soins</h4></span>');
        } else {
            if (inMelee) {
                skillMessage = "Pas de soins en mêlée";
            } else {
                if (!damaged) {
                    skillMessage = "Aucun dégâts soignable";
                } else {
                    skillMessage = "Pas assez de PA";
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Premiers soins</h4></span>');
        }
    }
    // MECANO
    if (batUnitType.skills.includes('mecano')) {
        numTargets = numMedicTargets(bat,'vehicles');
        apCost = numTargets*(10+(batUnitType.squads*2)-(bat.squadsLeft*2));
        if (bat.apLeft >= 8 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les véhicules adjacents ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`vehicles`,10,true,true)"><i class="fa fa-wrench"></i></button>&nbsp; Dépannage</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Dépannage</h4></span>');
        }
    }
    // SELF MECANO
    if (batUnitType.skills.includes('selfmecano')) {
        let damaged = false;
        if (batUnitType.squads > bat.squadsLeft || bat.damage >=1) {
            damaged = true;
        }
        apCost = Math.round(batUnitType.ap*2);
        if (bat.apLeft >= batUnitType.ap && damaged && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Retaper le véhicule ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`vehicles`,'+apCost+',false,false)"><i class="fa fa-hammer"></i></button>&nbsp; Dépannage</h4></span>');
        } else {
            if (!damaged) {
                skillMessage = "Ce véhicule n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Dépannage</h4></span>');
        }
    }
    // REPAIR
    if (batUnitType.skills.includes('repair') && !inMelee) {
        numTargets = numMedicTargets(bat,'buildings');
        apCost = numTargets*(15+(batUnitType.squads*3)-(bat.squadsLeft*3));
        if (bat.apLeft >= 8 && numTargets >= 1 && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les bâtiments adjacents ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`buildings`,15,true,true)"><i class="fa fa-hammer"></i></button>&nbsp; Réparations</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Réparations</h4></span>');
        }
    }
    // SELF REPAIR
    if (batUnitType.skills.includes('selfrepair')) {
        let damaged = false;
        if (batUnitType.squads > bat.squadsLeft || bat.damage >=1) {
            damaged = true;
        }
        apCost = Math.round(batUnitType.ap*2);
        if (bat.apLeft >= batUnitType.ap && damaged && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer le bâtiment ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`all`,'+apCost+',false,false)"><i class="fa fa-hammer"></i></button>&nbsp; Réparations</h4></span>');
        } else {
            if (!damaged) {
                skillMessage = "Ce bâtiment n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Réparations</h4></span>');
        }
    }
    // SELF REPAIR DEEP
    if (batUnitType.skills.includes('deepselfrepair')) {
        let damaged = false;
        if (batUnitType.squads > bat.squadsLeft || bat.damage >=1) {
            damaged = true;
        }
        apCost = Math.round(batUnitType.ap*2);
        if (bat.apLeft >= batUnitType.ap && damaged && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer le bâtiment ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`all`,'+apCost+',false,true)"><i class="fa fa-hammer"></i></button>&nbsp; Réparations</h4></span>');
        } else {
            if (!damaged) {
                skillMessage = "Ce bâtiment n'a pas subit de dégâts";
            } else if (inMelee) {
                skillMessage = "Pas de réparations en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Réparations</h4></span>');
        }
    }
    // POSE CHAMP DE MINES
    if (batUnitType.skills.includes('landmine')) {
        let minesLeft = calcRavit(bat);
        balise = 'h4';
        if (Object.keys(conselUnit).length >= 1) {
            balise = 'h1';
        }
        apCost = Math.round(batUnitType.ap*1.8);
        if (minesLeft >= 1 && bat.apLeft >= batUnitType.ap && !inMelee) {
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer un champ de mines ('+apCost+' PA)" class="boutonGris iconButtons" onclick="dropMine('+apCost+',`champ`)"><i class="fas fa-coins"></i></button>&nbsp; Champ de mines</'+balise+'></span>');
        } else {
            if (minesLeft <= 0) {
                skillMessage = "Plus de mines";
            } else if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Champ de mines</h4></span>');
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
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Déposer des explosifs ('+apCost+' PA)" class="boutonGris iconButtons" onclick="dropMine('+apCost+',`dynamite`)"><i class="ra ra-bomb-explosion rpg"></i></button>&nbsp; Explosifs</'+balise+'></span>');
        } else {
            if (minesLeft <= 0) {
                skillMessage = "Plus de mines";
            } else if (inMelee) {
                skillMessage = "Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Pas assez de PA";
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Explosifs</h4></span>');
        }
    }
    // DROGUES
    if (!batUnitType.skills.includes('mutant') && batUnitType.cat === 'infantry') {
        let allDrugs = checkDrugs(bat);
        // KIRIN
        if (allDrugs.includes('kirin') && !bat.tags.includes('kirin')) {
            let apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Régénération ('+apCost+' PA)" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`kirin`)"><i class="ra ra-heart-bottle rpg"></i></button>&nbsp; Kirin</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Kirin</h4></span>');
            }
        }
        // BLISS
        if (allDrugs.includes('bliss') && !bat.tags.includes('bliss')) {
            let apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Dégâts reçus réduits mais -2 PA, immunisé à la peur ('+apCost+' PA)" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`bliss`)"><i class="ra ra-pills rpg"></i></button>&nbsp; Bliss</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Bliss</h4></span>');
            }
        }
        // BLAZE
        if (allDrugs.includes('blaze') && !bat.tags.includes('blaze')) {
            let apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="+8 PA & +1 salve ('+apCost+' PA)" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`blaze`)"><i class="ra ra-bottled-bolt rpg"></i></button>&nbsp; Blaze</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Blaze</h4></span>');
            }
        }
        // SKUPIAC
        if (allDrugs.includes('skupiac') && !bat.tags.includes('skupiac')) {
            let apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Concentration: +6 précision ('+apCost+' PA)" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`skupiac`)"><i class="far fa-eye"></i></button>&nbsp; Skupiac</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Skupiac</h4></span>');
            }
        }
        // SILA
        if (allDrugs.includes('sila') && !bat.tags.includes('sila')) {
            let apCost = 3;
            if (bat.apLeft >= apCost) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="+4 puissance aux armes de mêlée ('+apCost+' PA)" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`sila`)"><i class="fas fa-fist-raised"></i></button>&nbsp; Sila</h4></span>');
            } else {
                skillMessage = "Pas assez de PA";
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Sila</h4></span>');
            }
        }
    }
    // DISMANTLE
    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Démanteler" class="boutonRouge iconButtons" onclick="dismantle('+bat.id+')"><i class="far fa-trash-alt"></i></button>&nbsp; Démanteler</h4></span>');
    // CONSTRUCTION TRICHE
    if (batUnitType.skills.includes('bfc')) {
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction (Triche)" class="boutonGris iconButtons" onclick="bfconst()"><i class="fa fa-hammer"></i></button>&nbsp; Construction</h4></span>');
    }
};
