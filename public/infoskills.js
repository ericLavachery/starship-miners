function skillsInfos(bat,batUnitType) {
    let skillMessage;
    let numTargets = 0;
    let apCost;
    // GUET
    if (batUnitType.weapon.rof >= 1) {
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
        if (bat.apLeft >= batUnitType.ap && !bat.tags.includes('fortif') && !batInMelee(bat.tileId) && bat.salvoLeft >= batUnitType.maxSalvo) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Se fortifier (bonus couverture) ('+batUnitType.ap+' PA)" class="boutonGris iconButtons" onclick="fortification()"><i class="fas fa-shield-alt"></i></button>&nbsp; Fortification</h4></span>');
        } else {
            // pas assez d'ap
            if (batInMelee(bat.tileId)) {
                skillMessage = "Vous ne pouvez pas vous fortifier en mêlée"
            } else {
                skillMessage = "Pas assez de PA ou de salve"
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Fortification</h4></span>');
        }
    }
    // CAMOUFLAGE
    if (batUnitType.skills.includes('camo')) {
        apCost = Math.floor(batUnitType.ap/2);
        if (bat.apLeft >= apCost) {
            // assez d'ap
            skillMessage = "Mode furtif"
            if (bat.tags.includes('camo')) {
                skillMessage = "Améliorer le mode furtif"
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+' ('+apCost+' PA)" class="boutonGris iconButtons" onclick="camouflage(false)"><i class="ra ra-grass rpg"></i></button>&nbsp; Mode furtif</h4></span>');
        } else {
            // pas assez d'ap
            skillMessage = "Pas assez de PA"
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
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Embuscade (Initiative + Cadence de tir 150%) ('+apCost+' PA)" class="boutonGris iconButtons" onclick="ambush()"><i class="ra ra-hood rpg"></i></button>&nbsp; Embuscade</h4></span>');
        } else {
            // pas assez d'ap
            skillMessage = "Pas assez de PA"
            if (!bat.tags.includes('camo')) {
                skillMessage = "Vous n'êtes pas en mode furtif"
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
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="+5 précision, 2/3 cadence de tir (3 PA + coût de l\'arme)" class="boutonGris iconButtons" onclick="tirCible()"><i class="fas fa-crosshairs"></i></button>&nbsp; Tir ciblé</'+balise+'></span>');
        } else {
            // pas assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><'+balise+'><button type="button" title="Pas assez de PA" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Tir ciblé</'+balise+'></span>');
        }
    }
    // MEDIC
    if (batUnitType.skills.includes('medic')) {
        numTargets = numMedicTargets(bat,'infantry');
        apCost = numTargets*(4+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= 4 && numTargets >= 1) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Soigner les infanteries adjacentes ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`infantry`,4,true)"><i class="far fa-heart"></i></button>&nbsp; Soins</h4></span>');
        } else {
            // pas assez d'ap
            if (numTargets < 1) {
                skillMessage = "Aucune infanterie adjacente n'a pas subit de dégâts"
            } else {
                skillMessage = "Pas assez de PA"
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Soins</h4></span>');
        }
    }
    // MECANO
    if (batUnitType.skills.includes('mecano')) {
        numTargets = numMedicTargets(bat,'vehicles');
        apCost = numTargets*(4+batUnitType.squads-bat.squadsLeft);
        if (bat.apLeft >= 4 && numTargets >= 1) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer les véhicules adjacents ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`vehicles`,4,true)"><i class="fa fa-wrench"></i></button>&nbsp; Réparations</h4></span>');
        } else {
            // pas assez d'ap
            if (numTargets < 1) {
                skillMessage = "Aucun véhicule adjacent n'a pas subit de dégâts"
            } else {
                skillMessage = "Pas assez de PA"
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Réparations</h4></span>');
        }
    }
    // SELF REPAIR
    if (batUnitType.skills.includes('bldmecano')) {
        let damaged = false;
        if (batUnitType.squads > bat.squadsLeft || bat.damage >=1) {
            damaged = true;
        }
        let apCost = batUnitType.ap;
        if (bat.apLeft >= batUnitType.ap && damaged) {
            // assez d'ap
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Réparer le bâtiment ('+apCost+' PA)" class="boutonGris iconButtons" onclick="medic(`buildings`,'+apCost+',false)"><i class="fa fa-hammer"></i></button>&nbsp; Réparations</h4></span>');
        } else {
            // pas assez d'ap
            if (!damaged) {
                skillMessage = "Ce bâtiment n'a pas subit de dégâts"
            } else {
                skillMessage = "Pas assez de PA"
            }
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGris iconButtons">&nbsp;</button>&nbsp; Réparations</h4></span>');
        }
    }
    // CONSTRUCTION TRICHE
    if (batUnitType.skills.includes('bfc')) {
        $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Construction (Triche)" class="boutonGris iconButtons" onclick="bfg()"><i class="fa fa-hammer"></i></button>&nbsp; Construction</h4></span>');
    }
};
