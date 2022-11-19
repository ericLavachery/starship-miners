function skillsInfos(bat,batType,near) {
    let skillMessage;
    let numTargets = 0;
    let apCost;
    let apReq;
    let balise;
    let boutonNope;
    let colorNope = 'gf';
    let prodOK = true;
    let craftsOK = true;
    let maxCrafts = getMaxCrafts();
    if (playerInfos.crafts >= maxCrafts && playerInfos.onShip) {
        craftsOK = false;
    }
    findLanders();
    let tile = getTile(bat);
    let terrain = getTerrain(bat);
    let inMelee = batInMelee(bat,batType);
    let apReqGuet = 0;
    if (near.control && bat.tags.includes('nomove')) {
        nomoveOut(bat);
    }
    let freeConsTile = false;
    let hasW1 = checkHasWeapon(1,batType,bat.eq);
    let hasW2 = checkHasWeapon(2,batType,bat.eq);
    if (playerInfos.onShip) {
        tagDelete(bat,'construction');
        tagDelete(bat,'construction');
    }
    console.log('inMelee='+inMelee);
    // SOUTE
    if (batType.skills.includes('soute') && playerInfos.onShip) {
        if (!inSoute) {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Déployer vos bataillons pour une nouvelle mission" class="boutonMarine bigButtons" onclick="goSoute()"><i class="fas fa-warehouse"></i></button>&nbsp;  Soute</h4></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Revenir sur la carte de la station" class="boutonMarine bigButtons" onclick="goStation()"><i class="fas fa-chess-board"></i></button>&nbsp;  Station</h4></span>');
        }
    }
    // DEPLOIEMENT
    if (playerInfos.onShip && inSoute && batType.name != 'Soute' && !batType.skills.includes('transorbital')) {
        if (bat.locId === souteId) {
            let deployCosts = getAllDeployCosts(batType,[bat.ammo,bat.ammo2,bat.prt,bat.eq,bat.logeq]);
            let enoughRes = checkCost(deployCosts);
            let deployInfo = checkPlaceLander(bat,batType,slId);
            if (enoughRes && deployInfo[0] && deployInfo[1] && deployInfo[2] && bat.eq != 'camkit' && bat.type != 'Chercheurs') {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Charger le bataillon dans le lander" class="boutonMarine bigButtons" onclick="batDeploy('+bat.id+')"><i class="fas fa-sign-in-alt"></i></button>&nbsp; Déployer</h4></span>');
            } else {
                if (bat.eq === 'camkit') {
                    skillMessage = "Les unités ayant le CamKit deviennent des policiers et restent donc dans la station";
                } else if (bat.type === 'Chercheurs') {
                    skillMessage = "Les Chercheurs ne peuvent pas être déployés";
                } else if (!enoughRes) {
                    skillMessage = "Ressources insuffisantes";
                } else if (!deployInfo[0]) {
                    skillMessage = "Lander non déployé";
                } else if (!deployInfo[1]) {
                    skillMessage = "Bataillon trop grand pour ce lander";
                } else if (!deployInfo[2]) {
                    skillMessage = "Plus assez de place dans ce lander";
                }
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="'+skillMessage+'" class="boutonGrey bigButtons gf"><i class="fas fa-sign-in-alt"></i></button>&nbsp; Déployer</h4></span>');
            }
        } else {
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Renvoyer le bataillon dans la soute" class="boutonMarine bigButtons" onclick="batUndeploy('+bat.id+')"><i class="fas fa-sign-out-alt fa-flip-horizontal"></i></button>&nbsp; Renvoyer</h4></span>');
        }
    }
    if (playerInfos.onShip && batType.skills.includes('transorbital') && batType.name != 'Soute' && inSoute) {
        let deployCosts = calcLanderDeploy(batType);
        let enoughRes = checkCost(deployCosts);
        let costString = '';
        if (deployCosts != undefined) {
            costString = displayCosts(deployCosts);
        }
        let batSoins = bat.soins;
        if (bat.soins === undefined) {
            batSoins = 0;
        }
        if (!bat.tags.includes('deploy')) {
            if (enoughRes && batSoins < 30) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Inclure ce lander dans la prochaine mission '+costString+'" class="boutonRouge bigButtons" onclick="landerDeploy('+bat.id+')"><i class="fas fa-plane-departure"></i></button>&nbsp; Déployer</h4></span>');
            } else {
                if (batSoins >= 30) {
                    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Lander trop endommagé, ne peut pas partir" class="boutonGrey bigButtons gf"><i class="fas fa-plane-departure"></i></button>&nbsp; Déployer</h4></span>');
                } else {
                    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ressources insuffisantes pour inclure ce lander dans la prochaine mission '+costString+'" class="boutonGrey bigButtons gf"><i class="fas fa-plane-departure"></i></button>&nbsp; Déployer</h4></span>');
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h3><button type="button" title="Ne pas inclure ce lander dans la prochaine mission" class="boutonOK bigButtons gf"><i class="fas fa-bed"></i></button>&nbsp; Rester</h3></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><h3><button type="button" title="Ce lander sera inclu dans la prochaine mission" class="boutonOK bigButtons gf"><i class="fas fa-plane-departure"></i></button>&nbsp; Déployé</h3></span>');
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ne pas inclure ce lander dans la prochaine mission" class="boutonRouge bigButtons" onclick="landerUnDeploy('+bat.id+')"><i class="fas fa-bed"></i></button>&nbsp; Rester</h4></span>');
        }
    }
    // GUET
    if (batType.weapon.rof >= 1 && bat.ap >= 1 && !batType.skills.includes('noguet') && (hasW1 || hasW2) && !playerInfos.onShip) {
        balise = 'h4';
        boutonNope = 'boutonGrey';
        colorNope = 'gf';
        if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || bat.eq === 'detector' || bat.logeq === 'detector' || bat.eq === 'g2ai' || bat.logeq === 'g2ai' || batType.skills.includes('initiative') || batType.skills.includes('after')) {
            balise = 'h3';
            boutonNope = 'boutonOK';
            colorNope = 'cy';
        }
        let okTrain = true;
        let defComp = playerInfos.comp.def;
        if (batType.skills.includes('robot') && bat.eq != 'g2ai' && bat.logeq != 'g2ai') {
            okTrain = false;
            defComp = 0;
        }
        apCost = 5-defComp;
        apReq = batType.ap-2-defComp;
        if (playerInfos.bldVM.includes('Camp d\'entraînement') && okTrain) {
            apCost = apCost-1;
            apReq = apReq-1;
        }
        if (batType.skills.includes('fastguet')) {
            apReq = apCost;
        } else if (batType.skills.includes('baddef')) {
            apCost = apCost+2;
        }
        if (bat.salvoLeft >= batType.maxSalvo && bat.tileId === bat.oldTileId) {
            apReq = apReq-2;
        }
        if (apReq < 1) {
            apReq = 1;
        }
        apReqGuet = apReq;
        let bouton = 'boutonBrun';
        if (bat.tags.includes('mining')) {
            bouton = 'boutonGris';
        }
        if ((bat.apLeft >= apReq || bat.apLeft >= bat.ap-2) && !bat.tags.includes('guet') && !batType.skills.includes('sentinelle') && bat.eq != 'detector' && bat.logeq != 'detector' && bat.eq != 'g2ai' && bat.logeq != 'g2ai' && !batType.skills.includes('initiative') && !batType.skills.includes('after')) {
            // assez d'ap
            $('#unitInfos').append('<button type="button" title="Faire le guet ('+apReq+' PA requis)" class="'+bouton+' iconButtons" onclick="guet()"><i class="fas fa-binoculars"></i> <span class="small">'+apCost+'</span></button>');
        } else {
            if (batType.skills.includes('sentinelle') || bat.eq === 'detector' || bat.logeq === 'detector' || bat.eq === 'g2ai' || bat.logeq === 'g2ai' || batType.skills.includes('initiative') || batType.skills.includes('after')) {
                skillMessage = "Sentinelle";
            } else {
                skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
            }
            // pas assez d'ap
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-binoculars"></i> <span class="small">'+apCost+'</span></button>');
        }
    }
    // FORTIFICATION
    if (batType.skills.includes('fortif') && !playerInfos.onShip) {
        balise = 'h4';
        boutonNope = 'boutonGrey';
        colorNope = 'gf';
        if (bat.tags.includes('fortif')) {
            balise = 'h3';
            boutonNope = 'boutonOK';
            colorNope = 'cy';
        }
        let okTrain = true;
        let defComp = playerInfos.comp.def;
        if (batType.skills.includes('robot') && bat.eq != 'g2ai' && bat.logeq != 'g2ai') {
            okTrain = false;
            defComp = 0;
        }
        apCost = batType.ap-defComp+3;
        apReq = batType.ap-(defComp*2)-4;
        if (defComp === 3) {
            apCost = apCost-1;
            apReq = apReq-2;
        }
        if (playerInfos.bldVM.includes('Camp d\'entraînement') && okTrain) {
            apCost = apCost-1;
            apReq = apReq-2;
        }
        if (batType.skills.includes('baddef') || batType.skills.includes('tirailleur')) {
            apCost = apCost+3;
        }
        if (apReq < Math.round(bat.ap/2)) {
            apReq = Math.round(bat.ap/2);
        }
        if (apReq < apReqGuet) {
            apReq = apReqGuet;
        }
        let bouton = 'boutonBrun';
        if (bat.tags.includes('mining')) {
            bouton = 'boutonGris';
        }
        if ((bat.apLeft >= apReq || bat.apLeft >= bat.ap-2) && !bat.tags.includes('fortif') && !inMelee) {
            $('#unitInfos').append('<button type="button" title="Se fortifier ('+apReq+' PA requis)" class="'+bouton+' iconButtons" onclick="fortification('+apCost+')"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>');
        } else {
            if (inMelee) {
                skillMessage = "Vous ne pouvez pas vous fortifier en mêlée";
            } else {
                skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>');
        }
    }
    // CAMOUFLAGE
    let camoufOK = true;
    if (!playerInfos.onShip) {
        if (canCamo(bat,batType,tile)) {
            let ruinHide = false;
            if ((tile.ruins && batType.size < 20) || (tile.terrain === 'F' && batType.size < 20 && !inMelee) || (tile.infra === 'Terriers' && batType.size < 9)) {
                ruinHide = true;
            }
            if (batType.cat == 'buildings') {
                if (batType.skills.includes('maycamo') && !ruinHide) {
                    apCost = Math.floor(batType.ap*3.5);
                    apReq = Math.floor(batType.ap/1.5);
                    if (inMelee) {
                        camoufOK = false;
                    }
                } else {
                    apCost = Math.floor(batType.ap*2);
                    apReq = Math.floor(batType.ap/1.5);
                    if (inMelee) {
                        camoufOK = false;
                    }
                }
            } else if (batType.cat == 'vehicles' || batType.skills.includes('machine') || batType.skills.includes('moto') || batType.cat == 'devices') {
                if (batType.skills.includes('maycamo') && !ruinHide) {
                    apCost = Math.floor(batType.ap*Math.sqrt(batType.size-3)/4);
                    apReq = Math.floor(batType.ap/1.5);
                    if (inMelee) {
                        camoufOK = false;
                    }
                } else {
                    apCost = Math.floor(batType.ap/2);
                    apReq = 3;
                    if (inMelee) {
                        camoufOK = false;
                    }
                }
            } else {
                if ((batType.skills.includes('maycamo') || !batType.skills.includes('camo')) && !ruinHide) {
                    if (bat.eq === 'kit-chouf' || bat.eq === 'trainkitgi' || bat.eq === 'trainkitch' || bat.eq === 'trainkitlu') {
                        apCost = Math.floor(batType.ap/2.5);
                        apReq = 2;
                    } else if (bat.eq === 'e-camo' || bat.logeq === 'e-camo' || bat.tdc.includes('e-camo') || bat.eq === 'kit-sentinelle' || bat.eq === 'kit-milice' || bat.eq === 'kit-guetteur') {
                        apCost = Math.floor(batType.ap/2);
                        apReq = 3;
                    } else {
                        apCost = Math.floor(batType.ap*Math.sqrt(batType.size)/4);
                        apReq = Math.floor(batType.ap/2);
                        if (inMelee) {
                            camoufOK = false;
                        }
                    }
                } else {
                    apCost = Math.round(batType.ap/3);
                    if (batType.skills.includes('camo')) {
                        apReq = 1;
                    } else {
                        apReq = 2;
                    }
                }
                if (playerInfos.comp.cam >= 1) {
                    apCost = Math.floor(apCost*3/(playerInfos.comp.cam+3));
                    apReq = apReq-1;
                }
            }
            balise = 'h4';
            boutonNope = 'boutonGrey';
            colorNope = 'gf';
            if (bat.fuzz <= -2) {
                balise = 'h3';
                boutonNope = 'boutonOK';
                colorNope = 'cy';
            }
            let bouton = 'boutonRose';
            if (bat.tags.includes('mining')) {
                bouton = 'boutonGris';
            }
            if (bat.apLeft >= apReq && bat.fuzz >= -1 && camoufOK) {
                $('#unitInfos').append('<button type="button" title="Mode furtif ('+apReq+' PA requis)" class="'+bouton+' iconButtons" onclick="camouflage('+apCost+')"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>');
            } else if (bat.fuzz <= -2) {
                $('#unitInfos').append('<button type="button" title="Sortir du mode furtif" class="'+boutonNope+' iconButtons '+colorNope+'" onclick="camoOut()"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (!camoufOK) {
                    skillMessage = "Mode furtif: Impossible en mêlée";
                } else {
                    skillMessage = "Mode furtif: Pas assez de PA (réserve de "+apReq+" requise)";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGris iconButtons '+colorNope+'"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>');
            }
            if (bat.tags.includes('camo') && bat.fuzz >= -1) {
                $('#unitInfos').append('<button type="button" title="Sortir du mode furtif" class="boutonGris iconButtons" onclick="camoOut()"><i class="fas fa-shoe-prints"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
    }
    // PASSAGE SECRET
    if (batType.size <= 9 && batType.cat === 'infantry') {
        if (tile.infra === 'Terriers') {
            let secretPass = checkSecretPass(bat);
            if (secretPass.ok) {
                apReq = 2;
                if (playerInfos.comp.cam >= 1) {
                    apReq = apReq-1-Math.floor(playerInfos.comp.cam/2);
                }
                apCost = secretPass.ap;
                if (bat.apLeft >= apReq) {
                    $('#unitInfos').append('<button type="button" title="Passage secret (aller au terrier indiqué)" class="boutonJaune iconButtons" onclick="goSecretPass()"><i class="fas fa-door-open"></i> <span class="small">'+apCost+'</span></button>');
                } else {
                    skillMessage = "Passage secret: Pas assez de PA";
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-door-open"></i> <span class="small">'+apCost+'</span></button>');
                }
            }
        }
    }
    // EMBUSCADE
    if (batType.skills.includes('embuscade') && !playerInfos.onShip && !bat.tags.includes('datt')) {
        apCost = 4-(playerInfos.comp.train/3.1)-(playerInfos.comp.cam/1.9);
        if (playerInfos.bldVM.includes('Camp d\'entraînement')) {
            apCost = apCost-0.6;
        }
        apCost = Math.round(apCost);
        if (hasW2 && batType.weapon.cost > batType.weapon2.cost) {
            apReq = apCost+batType.weapon2.cost;
        } else {
            apReq = apCost+batType.weapon.cost;
        }
        balise = 'h4';
        boutonNope = 'boutonGrey';
        colorNope = 'gf';
        if (bat.tags.includes('embuscade')) {
            balise = 'h3';
            boutonNope = 'boutonOK';
            colorNope = 'cy';
        }
        if (bat.apLeft >= apReq && bat.fuzz <= -2 && bat.apLeft >= apCost+cheapWeapCost && !bat.tags.includes('noemb') && !bat.tags.includes('embuscade') && batHasTarget) {
            $('#unitInfos').append('<button type="button" title="Embuscade (Initiative + Cadence de tir x2)" class="boutonJaune iconButtons" onclick="ambush('+apCost+')"><i class="ra ra-hood rpg"></i> <span class="small">'+apCost+'</span>');
        } else {
            skillMessage = "Embuscade: Pas assez de PA";
            if (bat.tags.includes('noemb')) {
                skillMessage = "Vous devez bouger ou attendre avant de pouvoir refaire une embuscade";
            } else if (bat.fuzz > -2) {
                skillMessage = "Embuscade: Vous n'êtes pas en mode furtif";
            } else if (bat.tags.includes('embuscade')) {
                skillMessage = "Embuscade: Vous êtes déjà en mode embuscade";
            } else if (!batHasTarget) {
                skillMessage = "Embuscade: Pas de cible";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="ra ra-hood rpg"></i> <span class="small">'+apCost+'</span></button>');
        }
    }
    // DOUBLE ATTAQUE
    if (!playerInfos.onShip && !bat.tags.includes('embuscade')) {
        if (batType.skills.includes('datt')) {
            let isTir = false;
            if (batType.skills.includes('tirailleur') && bat.oldTileId != bat.tileId) {
                isTir = true;
            }
            let weapOK = true;
            let trainComp = playerInfos.comp.train;
            if (batType.skills.includes('robot') && bat.eq != 'g2ai' && bat.logeq != 'g2ai') {
                trainComp = 0;
            } else {
                if (playerInfos.bldVM.includes('Camp d\'entraînement')) {
                    trainComp = trainComp+1;
                }
            }
            apCost = 7-trainComp;
            if (!batType.weapon.isPrec && !batType.weapon.isBow && !batType.weapon.noDatt) {
                if (hasW2) {
                    if (!batType.weapon2.isPrec && !batType.weapon2.isBow && !batType.weapon.noDatt) {
                        if (batType.weapon.cost > batType.weapon2.cost) {
                            apReq = apCost+batType.weapon2.cost;
                        } else {
                            apReq = apCost+batType.weapon.cost;
                        }
                    } else {
                        apReq = apCost+batType.weapon.cost;
                    }
                } else {
                    apReq = apCost+batType.weapon.cost;
                }
            } else {
                if (hasW2) {
                    if (!batType.weapon2.isPrec && !batType.weapon2.isBow && !batType.weapon2.noDatt) {
                        apReq = apCost+batType.weapon2.cost;
                    } else {
                        weapOK = false;
                    }
                } else {
                    weapOK = false;
                }
            }
            if (weapOK && bat.apLeft >= apCost+cheapWeapCost && !isTir) {
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (bat.tags.includes('datt')) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                if (bat.apLeft >= apReq && !bat.tags.includes('datt') && batHasTarget) {
                    $('#unitInfos').append('<button type="button" title="Double attaque: Cadence 165% / Précision 50%" class="boutonJaune iconButtons" onclick="fury('+apCost+')"><i class="ra ra-fire rpg"></i> <span class="small">'+apCost+'</span></button>');
                } else {
                    if (bat.tags.includes('datt')) {
                        skillMessage = "Double attaque: Déjà activé";
                    } else if (!batHasTarget) {
                        skillMessage = "Double attaque: Pas de cible";
                    } else {
                        skillMessage = "Double attaque: Pas assez de PA";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="ra ra-fire rpg"></i> <span class="small">'+apCost+'</span></button>');
                }
            }
        }
    }
    // TIR CIBLE
    if (!playerInfos.onShip) {
        if (batType.skills.includes('cible') || (batType.skills.includes('aicible') && (bat.eq === 'g2ai' || bat.logeq === 'g2ai')) || (batType.skills.includes('w2cible') && (bat.eq.includes('w2') || playerInfos.comp.def === 3))) {
            let tcBonus = calcCibleBonus(batType);
            apCost = tcBonus.ap;
            let weapOK = true;
            if (batType.weapon.isPrec) {
                if (hasW2) {
                    if (batType.weapon2.isPrec) {
                        if (batType.weapon.cost > batType.weapon2.cost) {
                            apReq = apCost+batType.weapon2.cost;
                        } else {
                            apReq = apCost+batType.weapon.cost;
                        }
                    } else {
                        apReq = apCost+batType.weapon.cost;
                    }
                } else {
                    apReq = apCost+batType.weapon.cost;
                }
            } else {
                if (hasW2) {
                    if (batType.weapon2.isPrec) {
                        apReq = apCost+batType.weapon2.cost;
                    } else {
                        weapOK = false;
                    }
                } else {
                    weapOK = false;
                }
            }
            if (weapOK && bat.apLeft >= apCost+cheapWeapCost) {
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
                if (bat.apLeft >= apReq && !bat.tags.includes('vise') && !inMelee && batHasTarget) {
                    $('#unitInfos').append('<button type="button" title="Bullseye: '+tcInfo+'" class="boutonJaune iconButtons" onclick="tirCible('+apCost+')"><i class="fas fa-crosshairs"></i> <span class="small">'+apCost+'</span></button>');
                } else {
                    if (bat.tags.includes('vise')) {
                        skillMessage = "Bullseye: Déjà activé";
                    } else if (inMelee) {
                        skillMessage = "Bullseye: Impossible en mêlée";
                    } else if (!batHasTarget) {
                        skillMessage = "Bullseye: Pas de cible";
                    } else {
                        skillMessage = "Bullseye: Pas assez de PA";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-crosshairs"></i> <span class="small">'+apCost+'</span></button>');
                }
            }
        }
    }
    // LUCKY SHOT
    if (batType.skills.includes('luckyshot') && !playerInfos.onShip) {
        if (hasW2 && batType.weapon.cost > batType.weapon2.rof) {
            apReq = batType.weapon2.cost;
        } else {
            apReq = batType.weapon.cost;
        }
        balise = 'h4';
        boutonNope = 'boutonGrey';
        colorNope = 'gf';
        if (bat.tags.includes('luckyshot')) {
            balise = 'h3';
            boutonNope = 'boutonOK';
            colorNope = 'cy';
        }
        if (bat.apLeft >= apReq && !bat.tags.includes('luckyshot') && !bat.tags.includes('lucky') && bat.apLeft >= cheapWeapCost && batHasTarget) {
            $('#unitInfos').append('<button type="button" title="Lucky shot automatique sur cette attaque" class="boutonJaune iconButtons" onclick="luckyShot()"><i class="fas fa-dice-six"></i> <span class="small">0</span></button>');
        } else {
            if (bat.tags.includes('luckyshot')) {
                skillMessage = "Lucky shot: Déjà activé";
            } else if (bat.tags.includes('lucky')) {
                skillMessage = "Lucky shot: Pas assez de bol";
            } else if (!batHasTarget) {
                skillMessage = "Lucky shot: Pas de cible";
            } else {
                skillMessage = "Lucky shot: Pas assez de PA";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-dice-six"></i> <span class="small">0</span></button>');
        }
    }
    // INSTAKILL
    if (bat.tags.includes('hero') && (batType.skills.includes('herokill') || batType.skills.includes('herominik')) && !bat.tags.includes('nokill') && batHasTarget && !playerInfos.onShip) {
        $('#unitInfos').append('<button type="button" title="Instakill: Uniquement avec une arme de précision!" class="boutonJaune iconButtons" onclick="instaKill()"><i class="fas fa-skull-crossbones"></i> <span class="small">0</span></button>');
    }
    // BRAVOURE
    if (bat.tags.includes('hero') && batType.skills.includes('herosalvo') && !bat.tags.includes('nofougue') && batHasTarget && !playerInfos.onShip) {
        $('#unitInfos').append('<button type="button" title="Bravoure: Une salve supplémentaire" class="boutonVert iconButtons" onclick="fougue()"><i class="ra ra-player-teleport rpg"></i> <span class="small">0</span></button>');
    }
    // TORNADE
    if (bat.tags.includes('hero') && batType.skills.includes('herotornade') && !bat.tags.includes('notorn') && batHasTarget && !playerInfos.onShip) {
        $('#unitInfos').append('<button type="button" title="Tornade: Salves infinies" class="boutonJaune iconButtons" onclick="tornade()"><i class="ra ra-player-teleport rpg"></i> <span class="small">0</span></button>');
    }
    // DIVERSION
    if (bat.tags.includes('hero') && batType.skills.includes('herolasso') && !bat.tags.includes('lasso') && !playerInfos.onShip) {
        $('#unitInfos').append('<button type="button" title="Diversion: Attire tous aliens dans un rayon de 5 cases" class="boutonJaune iconButtons" onclick="diversion()"><i class="ra ra-aware rpg"></i> <span class="small">2</span></button>');
    }
    // TAMING
    if (!playerInfos.onShip && !bat.tags.includes('tame')) {
        if ((bat.tags.includes('hero') && batType.skills.includes('herotame')) || batType.skills.includes('taming')) {
            let tamingId = getTamingId(bat,batType);
            if (tamingId >= 0) {
                $('#unitInfos').append('<button type="button" title="Apprivoiser les Meatballs" class="boutonJaune iconButtons" onclick="taming('+tamingId+')"><i class="fas fa-dog"></i> <span class="small">20</span></button>');
            }
        }
    }
    // FOG
    if (batType.skills.includes('fog') && !playerInfos.onShip) {
        balise = 'h4';
        boutonNope = 'boutonGrey';
        colorNope = 'gf';
        if (bat.tags.includes('fog')) {
            balise = 'h1';
            boutonNope = 'boutonOK';
            colorNope = 'cy';
        }
        if (!bat.tags.includes('fog')) {
            $('#unitInfos').append('<button type="button" title="Envoyer le fog" class="boutonRose iconButtons" onclick="fogStart()"><i class="fas fa-cloud"></i> <span class="small">0</span></button>');
        } else {
            $('#unitInfos').append('<button type="button" title="Arrêter le fog" class="'+boutonNope+' iconButtons '+colorNope+'" onclick="fogStop()"><i class="fas fa-cloud"></i> <span class="small">0</span></button>');
        }
    }
    if (!playerInfos.onShip) {
        let baseskillCost;
        // MEDIC IN BLD
        let canBeMedBld = checkMedBld(bat,batType);
        if (canBeMedBld) {
            let medicBat = bestMedicInBld(bat);
            let medicBatType = getBatType(medicBat);
            // console.log(medicBat);
            if (Object.keys(medicBat).length >= 1) {
                numTargets = numMedicTargets(medicBat,'infantry',true,true,bat);
                baseskillCost = calcBaseSkillCost(medicBat,medicBatType,true,true,bat);
                apCost = numTargets*(baseskillCost+medicBatType.squads-medicBat.squadsLeft);
                if (apCost === 0) {apCost = baseskillCost;}
                if (numTargets >= 1) {
                    $('#unitInfos').append('<button type="button" title="Soigner les infanteries adjacentes avec '+medicBat.type+'" class="boutonBleu iconButtons" onclick="medic(`infantry`,'+baseskillCost+',true,true,true,'+medicBat.id+')"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
                } else {
                    skillMessage = "Aucune infanterie adjacente n'a pas subit de dégâts";
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
                }
            }
        }
        // MEDIC
        let myMedicSkill = checkMedicSkill(bat,batType);
        let fullStarka = getStarkaIntox(bat);
        if (myMedicSkill === 'medic') {
            numTargets = numMedicTargets(bat,'infantry',true,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,true,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !fullStarka && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Soigner les infanteries adjacentes" class="boutonBleu iconButtons" onclick="medic(`infantry`,'+baseskillCost+',true,true)"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (inMelee) {
                    skillMessage = "Pas de soins en mêlée";
                } else {
                    if (numTargets < 1) {
                        skillMessage = "Aucune infanterie adjacente n'a pas subit de dégâts";
                    } else if (fullStarka) {
                        skillMessage = "Pas de soins avec la drogue Starka";
                    } else {
                        skillMessage = "Pas assez de PA";
                    }
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // BAD MEDIC
        if (myMedicSkill === 'badmedic') {
            numTargets = numMedicTargets(bat,'infantry',true,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,true,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !fullStarka && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Donner les premiers soins aux infanteries adjacentes" class="boutonBleu iconButtons" onclick="medic(`infantry`,'+baseskillCost+',true,false)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (inMelee) {
                    skillMessage = "Pas de soins en mêlée";
                } else {
                    if (numTargets < 1) {
                        skillMessage = "Aucune infanterie adjacente n'a pas subit de dégâts";
                    } else if (fullStarka) {
                        skillMessage = "Pas de soins avec la drogue Starka";
                    } else {
                        skillMessage = "Pas assez de PA";
                    }
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // SELF MEDIC
        if (myMedicSkill === 'selfmedic') {
            numTargets = numMedicTargets(bat,'infantry',false,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,true,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !fullStarka && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Se soigner" class="boutonBleu iconButtons" onclick="medic(`infantry`,'+baseskillCost+',false,true)"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (inMelee) {
                    skillMessage = "Pas de soins en mêlée";
                } else {
                    if (numTargets <= 0) {
                        skillMessage = "Aucun dégâts soignable";
                    } else if (fullStarka) {
                        skillMessage = "Pas de soins avec la drogue Starka";
                    } else {
                        skillMessage = "Pas assez de PA";
                    }
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // FIRST AID (SELF BAD MEDIC)
        if (myMedicSkill === 'selfbadmedic') {
            numTargets = numMedicTargets(bat,'infantry',false,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,true,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !fullStarka && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Premiers soins" class="boutonBleu iconButtons" onclick="medic(`infantry`,'+baseskillCost+',false,false)"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (inMelee) {
                    skillMessage = "Pas de soins en mêlée";
                } else {
                    if (numTargets <= 0) {
                        skillMessage = "Aucun dégâts soignable";
                    } else if (fullStarka) {
                        skillMessage = "Pas de soins avec la drogue Starka";
                    } else {
                        skillMessage = "Pas assez de PA";
                    }
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="far fa-heart"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // MECANO IN BLD
        if (batType.cat === 'buildings' || batType.skills.includes('transorbital')) {
            let medicBat = bestMecanoInBld(bat);
            let medicBatType = getBatType(medicBat);
            // console.log(medicBat);
            if (Object.keys(medicBat).length >= 1) {
                numTargets = numMedicTargets(medicBat,'vehicles',true,true,bat);
                baseskillCost = calcBaseSkillCost(medicBat,medicBatType,false,true,bat);
                apCost = numTargets*(baseskillCost+medicBatType.squads-medicBat.squadsLeft);
                if (apCost === 0) {apCost = baseskillCost;}
                if (numTargets >= 1) {
                    $('#unitInfos').append('<button type="button" title="Réparer les véhicules adjacents avec '+medicBat.type+'" class="boutonBleu iconButtons" onclick="medic(`vehicles`,'+baseskillCost+',true,true,true,'+medicBat.id+')"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                } else {
                    skillMessage = "Aucun véhicule adjacent n'a pas subit de dégâts";
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                }
            }
        }
        // MECANO
        let myMecanoSkill = checkMecanoSkill(bat,batType);
        if (myMecanoSkill === 'mecano') {
            numTargets = numMedicTargets(bat,'vehicles',true,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,false,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Réparer les véhicules adjacents" class="boutonBleu iconButtons" onclick="medic(`vehicles`,'+baseskillCost+',true,true)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
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
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // BAD MECANO
        if (myMecanoSkill === 'badmecano') {
            numTargets = numMedicTargets(bat,'vehicles',true,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,false,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Rafistoler les véhicules adjacents" class="boutonBleu iconButtons" onclick="medic(`vehicles`,'+baseskillCost+',true,false)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
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
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // SELF BAD MECANO
        if (myMecanoSkill === 'selfbadmecano') {
            numTargets = numMedicTargets(bat,'vehicles',false,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,false,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Retaper le véhicule" class="boutonBleu iconButtons" onclick="medic(`vehicles`,'+baseskillCost+',false,false)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (numTargets <= 0) {
                    skillMessage = "Ce véhicule n'a pas subit de dégâts";
                } else if (inMelee) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // SELF MECANO
        if (myMecanoSkill === 'selfmecano') {
            numTargets = numMedicTargets(bat,'vehicles',false,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,false,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Retaper le véhicule" class="boutonBleu iconButtons" onclick="medic(`vehicles`,'+baseskillCost+',false,true)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (numTargets <= 0) {
                    skillMessage = "Ce véhicule n'a pas subit de dégâts";
                } else if (inMelee) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // REPAIR
        if (batType.skills.includes('repair')) {
            numTargets = numMedicTargets(bat,'buildings',true,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,false,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Réparer les bâtiments adjacents" class="boutonBleu iconButtons" onclick="medic(`buildings`,'+baseskillCost+',true,true)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
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
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // SELF BAD REPAIR
        if (batType.skills.includes('selfbadrepair')) {
            numTargets = numMedicTargets(bat,'buildings',false,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,false,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Réparer le bâtiment" class="boutonBleu iconButtons" onclick="medic(`buildings`,'+baseskillCost+',false,false)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (numTargets <= 0) {
                    skillMessage = "Ce bâtiment n'a pas subit de dégâts";
                } else if (inMelee) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // SELF REPAIR
        if (batType.skills.includes('selfrepair')) {
            numTargets = numMedicTargets(bat,'buildings',false,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,false,false);
            apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Réparer le bâtiment" class="boutonBleu iconButtons" onclick="medic(`buildings`,'+baseskillCost+',false,true)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (numTargets <= 0) {
                    skillMessage = "Ce bâtiment n'a pas subit de dégâts";
                } else if (inMelee) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
        // REPAIR DIAG
        if ((batType.cat === 'buildings' || batType.cat === 'devices') && !batType.skills.includes('nobld') && !batType.skills.includes('norepair') && (bat.damage >= 1 || bat.squadsLeft < batType.squads)) {
            let repairBat = checkRepairBat(bat.tileId);
            if (Object.keys(repairBat).length >= 1) {
                let repairBatType = getBatType(repairBat);
                apCost = 0;
                if (repairBat.apLeft >= 1) {
                    $('#unitInfos').append('<button type="button" title="Réparer le bâtiment avec '+repairBat.type+' ('+repairBatType.mecanoCost+' AP)" class="boutonBleu iconButtons" onclick="diagRepair('+repairBat.id+')"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
                } else {
                    skillMessage = "Pas assez de PA";
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
                }
            }
        }
    }
    // ENTRETIEN
    if (playerInfos.onShip) {
        if (bat.soins >= 11 && batType.cat === 'vehicles') {
            let apLoss = checkVehiclesAPSoins(bat,batType);
            let maintCosts = getMaintenanceCosts(bat,batType);
            let maintOK = checkCost(maintCosts);
            if (maintOK) {
                $('#unitInfos').append('<button type="button" title="Entretien '+displayCosts(maintCosts)+'" class="boutonBleu iconButtons" onclick="maintenance()"><i class="fa fa-wrench"></i> <span class="small">0</span></button>');
            } else {
                $('#unitInfos').append('<button type="button" title="Entretien: Ressources insuffisantes '+displayCosts(maintCosts)+'" class="boutonGrey iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">0</span></button>');
            }
        }
    }
    if (!playerInfos.onShip) {
        if (bat.soins >= 11 && batType.cat === 'vehicles') {
            if (checkNearConstructor(bat)) {
                let apLoss = checkVehiclesAPSoins(bat,batType);
                let maintCosts = getMaintenanceCosts(bat,batType);
                let maintOK = checkCost(maintCosts);
                apCost = bat.ap*2;
                if (maintOK) {
                    $('#unitInfos').append('<button type="button" title="Entretien '+displayCosts(maintCosts)+'" class="boutonBleu iconButtons" onclick="maintenanceInZone()"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                } else {
                    $('#unitInfos').append('<button type="button" title="Entretien: Ressources insuffisantes '+displayCosts(maintCosts)+'" class="boutonGrey iconButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                }
            }
        }
    }
    // COMMANDE
    if (!batType.skills.includes('dome') && !batType.skills.includes('pilone') && !batType.skills.includes('cfo')) {
        let commandOK = false;
        // console.log('COMMAND');
        // console.log(near);
        if (!playerInfos.onShip && near.schef) {
            if (!batType.skills.includes('brigands') && !bat.tags.includes('outsider') && !bat.tags.includes('schef') && !batType.skills.includes('leader') && !batType.skills.includes('prayer')) {
                if (batType.skills.includes('robot') || batType.crew >= 1) {
                    commandOK = true;
                }
            }
            if (batType.name === 'Résistants') {
                commandOK = true;
            }
        }
        // console.log('commandOK: '+commandOK);
        if (commandOK && !bat.tags.includes('gogogo')) {
            let leSousChef = checkCommand(bat);
            console.log(leSousChef);
            if (leSousChef.ok) {
                $('#unitInfos').append('<button type="button" title="Commande: +'+leSousChef.pa+' PA (-1 PA pour le bataillon de '+leSousChef.bat.type+')" class="boutonVert iconButtons" onclick="goCommand('+leSousChef.bat.id+','+leSousChef.pa+')"><i class="far fa-hand-point-right"></i> <span class="small">0</span></button>');
            }
        }
    }
    // PRIERE
    if (batType.skills.includes('prayer') && !playerInfos.onShip) {
        balise = 'h4';
        boutonNope = 'boutonGrey';
        colorNope = 'gf';
        if (bat.tags.includes('prayer')) {
            balise = 'h3';
            boutonNope = 'boutonOK';
            colorNope = 'cy';
        }
        apCost = 7;
        if (bat.apLeft >= apCost && !bat.tags.includes('prayer') && !bat.tags.includes('spirit') && !inMelee) {
            $('#unitInfos').append('<button type="button" title="Prière: +3 PA à tous les bataillons du Brasier (et +1 PA chaque tour pendant x tours)" class="boutonVert iconButtons" onclick="gloireASatan()"><i class="fas fa-hamsa"></i> <span class="small">'+apCost+'</span></button>');
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
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-hamsa"></i> <span class="small">'+apCost+'</span></button>');
        }
    }
    // TREUIL
    if (!playerInfos.onShip && bat.apLeft < 5 && !bat.tags.includes('construction')) {
        if (batType.cat === 'vehicles' && batType.moveCost < 90 && !batType.skills.includes('cyber') && !batType.skills.includes('robot') && !batType.skills.includes('fly')) {
            let leTreuil = checkTreuil(bat);
            if (leTreuil.ok) {
                $('#unitInfos').append('<button type="button" title="Treuil: +'+leTreuil.pa+' PA (-4 PA pour le bataillon de '+leTreuil.bat.type+')" class="boutonVert iconButtons" onclick="goTreuil('+leTreuil.bat.id+','+leTreuil.pa+')"><i class="fas fa-anchor"></i> <span class="small">0</span></button>');
            }
        }
    }
    // RUSH
    if (bat.tags.includes('hero') && batType.skills.includes('herorush') && !bat.tags.includes('rush') && !playerInfos.onShip) {
        let rushAP = bat.ap;
        if (bat.apLeft < 0) {
            rushAP = bat.ap-Math.round(bat.apLeft/2);
        }
        $('#unitInfos').append('<button type="button" title="Rush: +'+rushAP+' PA" class="boutonVert iconButtons" onclick="rush('+rushAP+')"><i class="fas fa-running"></i> <span class="small">0</span></button>');
    }
    // RAGE
    let rageOK = false;
    if (bat.tags.includes('hero') && batType.skills.includes('herorage')) {
        rageOK = true;
    }
    if (batType.skills.includes('rage')) {
        rageOK = true;
    }
    if (rageOK && !bat.tags.includes('norage') && !playerInfos.onShip) {
        $('#unitInfos').append('<button type="button" title="Rage: Bonus de puissance aux armes de mêlée" class="boutonVert iconButtons" onclick="rage()"><i class="ra ra-muscle-up rpg"></i> <span class="small">0</span></button>');
    }
    // DOXEY
    if (!playerInfos.onShip && near.doxey && batType.cat === 'infantry' && !batType.skills.includes('clone')) {
        $('#unitInfos').append('<button type="button" title="Elixir du docteur Doxey" class="boutonVert iconButtons" onclick="goDoxey()"><i class="ra ra-flask rpg"></i> <span class="small">0</span></button>');
    }
    // DROGUES
    if (!playerInfos.onShip) {
        let allDrugs = checkDrugs(bat);
        let drug = {};
        let drugCompOK = false;
        let drugBldOK = false;
        let drugBldVMOK = false;
        let drugCostsOK = false;
        if (batType.cat === 'infantry') {
            // STARKA
            if (!bat.tags.includes('construction')) {
                if (allDrugs.includes('starka') || bat.tags.includes('starka')) {
                    drug = getDrugByName('starka');
                    drugCompOK = checkCompReq(drug);
                    drugBldOK = true;
                    if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldOK = false;
                    }
                    drugBldVMOK = true;
                    if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldVMOK = false;
                    }
                    drugCostsOK = checkCost(drug.costs);
                    balise = 'h4';
                    boutonNope = 'boutonGrey';
                    colorNope = 'gf';
                    if (bat.tags.includes('starka')) {
                        balise = 'h3';
                        boutonNope = 'boutonOK';
                        colorNope = 'cy';
                    }
                    apCost = drug.apCost;
                    let starkaPA = getStarkaBonus(bat);
                    // let moveDistance = calcDistance(bat.tileId,bat.oldTileId);
                    // console.log('moveDistance='+moveDistance);
                    if (drugCompOK) {
                        if (!bat.tags.includes('starka') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK && starkaPA >= 1) {
                            $('#unitInfos').append('<button type="button" title="Starka: +'+starkaPA+' PA '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`starka`)"><i class="fas fa-syringe"></i> <span class="small">'+apCost+'</span></button>');
                        } else {
                            if (bat.tags.includes('starka')) {
                                skillMessage = "Starka: Déjà sous l'effet de cette drogue";
                            } else if (!drugCompOK) {
                                skillMessage = "Starka: Vous n'avez pas les compétences requises";
                            } else if (!drugBldVMOK) {
                                skillMessage = "Starka: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                            } else if (!drugBldOK) {
                                skillMessage = "Starka: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                            } else if (!drugCostsOK) {
                                skillMessage = "Starka: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                            } else if (starkaPA < 1) {
                                skillMessage = "Starka: Vous vous êtes déjà au maximum de PA";
                            } else {
                                skillMessage = "Starka: Vous vous êtes déjà trop déplacé ce tour-ci";
                            }
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-syringe"></i> <span class="small">'+apCost+'</span></button>');
                        }
                    }
                }
            }
            // KIRIN
            if (!batType.skills.includes('clone')) {
                if (allDrugs.includes('kirin') || bat.tags.includes('kirin')) {
                    drug = getDrugByName('kirin');
                    drugCompOK = checkCompReq(drug);
                    drugBldOK = true;
                    if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldOK = false;
                    }
                    drugBldVMOK = true;
                    if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldVMOK = false;
                    }
                    drugCostsOK = checkCost(drug.costs);
                    balise = 'h4';
                    boutonNope = 'boutonGrey';
                    colorNope = 'gf';
                    if (bat.tags.includes('kirin')) {
                        balise = 'h3';
                        boutonNope = 'boutonOK';
                        colorNope = 'cy';
                    }
                    apCost = drug.apCost;
                    if (drugCompOK) {
                        if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('kirin') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                            $('#unitInfos').append('<button type="button" title="Kirin: Régénération rapide '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`kirin`)"><i class="ra ra-heart-bottle rpg"></i> <span class="small">'+apCost+'</span></button>');
                        } else {
                            if (bat.tags.includes('kirin')) {
                                skillMessage = "Kirin: Déjà sous l'effet de cette drogue";
                            } else if (!drugCompOK) {
                                skillMessage = "Kirin: Vous n'avez pas les compétences requises";
                            } else if (!drugBldVMOK) {
                                skillMessage = "Kirin: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                            } else if (!drugBldOK) {
                                skillMessage = "Kirin: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                            } else if (!drugCostsOK) {
                                skillMessage = "Kirin: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                            } else {
                                skillMessage = "Kirin: Pas assez de PA";
                            }
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="ra ra-heart-bottle rpg"></i> <span class="small">'+apCost+'</span></button>');
                        }
                    }
                }
            }
            // OCTIRON
            if (allDrugs.includes('octiron') || bat.tags.includes('octiron')) {
                drug = getDrugByName('octiron');
                drugCompOK = checkCompReq(drug);
                drugBldOK = true;
                if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldOK = false;
                }
                drugBldVMOK = true;
                if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldVMOK = false;
                }
                drugCostsOK = checkCost(drug.costs);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (bat.tags.includes('octiron')) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                apCost = drug.apCost;
                if (drugCompOK) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('octiron') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Octiron: +4 PA / protection poisons et maladies / réduit le stress '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`octiron`)"><i class="fas fa-cannabis"></i> <span class="small">'+apCost+'</span></button>');
                    } else {
                        if (bat.tags.includes('octiron')) {
                            skillMessage = "Octiron: Déjà sous l'effet de cette drogue";
                        } else if (!drugCompOK) {
                            skillMessage = "Octiron: Vous n'avez pas les compétences requises";
                        } else if (!drugBldVMOK) {
                            skillMessage = "Octiron: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                        } else if (!drugBldOK) {
                            skillMessage = "Octiron: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                        } else if (!drugCostsOK) {
                            skillMessage = "Octiron: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                        } else {
                            skillMessage = "Octiron: Pas assez de PA";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-cannabis"></i> <span class="small">'+apCost+'</span></button>');
                    }
                }
            }
            // MOLOKO
            if (allDrugs.includes('moloko') || bat.tags.includes('moloko')) {
                drug = getDrugByName('moloko');
                drugCompOK = checkCompReq(drug);
                drugBldOK = true;
                if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldOK = false;
                }
                drugBldVMOK = true;
                if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldVMOK = false;
                }
                drugCostsOK = checkCost(drug.costs);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (bat.tags.includes('moloko')) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                apCost = drug.apCost;
                if (drugCompOK) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('moloko') && !bat.tags.includes('bliss') && !batType.skills.includes('nofear') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Moloko: Immunisé à la peur / -2 PA '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`moloko`)"><i class="fas fa-wine-bottle"></i> <span class="small">'+apCost+'</span></button>');
                    } else {
                        if (bat.tags.includes('moloko')) {
                            skillMessage = "Moloko: Déjà bourré";
                        } else if (bat.tags.includes('bliss') || batType.skills.includes('nofear')) {
                            skillMessage = "Moloko: Déjà immunisé à la peur";
                        } else if (!drugCompOK) {
                            skillMessage = "Moloko: Vous n'avez pas les compétences requises";
                        } else if (!drugBldVMOK) {
                            skillMessage = "Moloko: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                        } else if (!drugBldOK) {
                            skillMessage = "Moloko: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                        } else if (!drugCostsOK) {
                            skillMessage = "Moloko: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                        } else {
                            skillMessage = "Moloko: Pas assez de PA";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-wine-bottle"></i> <span class="small">'+apCost+'</span></button>');
                    }
                }
            }
            // BLISS
            if (allDrugs.includes('bliss') || bat.tags.includes('bliss')) {
                drug = getDrugByName('bliss');
                drugCompOK = checkCompReq(drug);
                drugBldOK = true;
                if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldOK = false;
                }
                drugBldVMOK = true;
                if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldVMOK = false;
                }
                drugCostsOK = checkCost(drug.costs);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (bat.tags.includes('bliss')) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                apCost = drug.apCost;
                if (drugCompOK) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('bliss') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Bliss: Dégâts reçus réduits / immunisé à la peur / réduit le stress / -1 PA '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`bliss`)"><i class="ra ra-pills rpg"></i> <span class="small">'+apCost+'</span></button>');
                    } else {
                        if (bat.tags.includes('bliss')) {
                            skillMessage = "Bliss: Déjà sous l'effet de cette drogue";
                        } else if (!drugCompOK) {
                            skillMessage = "Bliss: Vous n'avez pas les compétences requises";
                        } else if (!drugBldVMOK) {
                            skillMessage = "Bliss: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                        } else if (!drugBldOK) {
                            skillMessage = "Bliss: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                        } else if (!drugCostsOK) {
                            skillMessage = "Bliss: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                        } else {
                            skillMessage = "Bliss: Pas assez de PA";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="ra ra-pills rpg"></i> <span class="small">'+apCost+'</span></button>');
                    }
                }
            }
            // SILA
            if (allDrugs.includes('sila') || bat.tags.includes('sila')) {
                drug = getDrugByName('sila');
                drugCompOK = checkCompReq(drug);
                drugBldOK = true;
                if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldOK = false;
                }
                drugBldVMOK = true;
                if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldVMOK = false;
                }
                drugCostsOK = checkCost(drug.costs);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (bat.tags.includes('sila')) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                apCost = drug.apCost;
                if (drugCompOK) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('sila') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Sila: +3 puissance aux armes de mêlée '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`sila`)"><i class="fas fa-fist-raised"></i> <span class="small">'+apCost+'</span></button>');
                    } else {
                        if (bat.tags.includes('sila')) {
                            skillMessage = "Sila: Déjà sous l'effet de cette drogue";
                        } else if (!drugCompOK) {
                            skillMessage = "Sila: Vous n'avez pas les compétences requises";
                        } else if (!drugBldVMOK) {
                            skillMessage = "Sila: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                        } else if (!drugBldOK) {
                            skillMessage = "Sila: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                        } else if (!drugCostsOK) {
                            skillMessage = "Sila: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                        } else {
                            skillMessage = "Sila: Pas assez de PA";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-fist-raised"></i> <span class="small">'+apCost+'</span></button>');
                    }
                }
            }
            // SKUPIAC
            if (allDrugs.includes('skupiac') || bat.tags.includes('skupiac')) {
                drug = getDrugByName('skupiac');
                drugCompOK = checkCompReq(drug);
                drugBldOK = true;
                if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldOK = false;
                }
                drugBldVMOK = true;
                if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldVMOK = false;
                }
                drugCostsOK = checkCost(drug.costs);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (bat.tags.includes('skupiac')) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                apCost = drug.apCost;
                if (drugCompOK) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('skupiac') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Skupiac: +6 précision / +3 défense / guérit les maladies '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`skupiac`)"><i class="far fa-eye"></i> <span class="small">'+apCost+'</span></button>');
                    } else {
                        if (bat.tags.includes('skupiac')) {
                            skillMessage = "Skupiac: Déjà sous l'effet de cette drogue";
                        } else if (!drugCompOK) {
                            skillMessage = "Skupiac: Vous n'avez pas les compétences requises";
                        } else if (!drugBldVMOK) {
                            skillMessage = "Skupiac: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                        } else if (!drugBldOK) {
                            skillMessage = "Skupiac: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                        } else if (!drugCostsOK) {
                            skillMessage = "Skupiac: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                        } else {
                            skillMessage = "Skupiac: Pas assez de PA";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="far fa-eye"></i> <span class="small">'+apCost+'</span></button>');
                    }
                }
            }
            // BLAZE
            if (allDrugs.includes('blaze') || bat.tags.includes('blaze')) {
                drug = getDrugByName('blaze');
                drugCompOK = checkCompReq(drug);
                drugBldOK = true;
                if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldOK = false;
                }
                drugBldVMOK = true;
                if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                    drugBldVMOK = false;
                }
                drugCostsOK = checkCost(drug.costs);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (bat.tags.includes('blaze')) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                apCost = drug.apCost;
                if (drugCompOK) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('blaze') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Blaze: +3 PA & +1 salve '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`blaze`)"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>');
                    } else {
                        if (bat.tags.includes('blaze')) {
                            skillMessage = "Blaze: Déjà sous l'effet de cette drogue";
                        } else if (!drugCompOK) {
                            skillMessage = "Blaze: Vous n'avez pas les compétences requises";
                        } else if (!drugBldVMOK) {
                            skillMessage = "Blaze: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                        } else if (!drugBldOK) {
                            skillMessage = "Blaze: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                        } else if (!drugCostsOK) {
                            skillMessage = "Blaze: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                        } else {
                            skillMessage = "Blaze: Pas assez de PA";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>');
                    }
                }
            }
        }
        if (batType.cat != 'infantry' || batType.skills.includes('oknitro')) {
            // NITRO
            if (!bat.tags.includes('construction')) {
                if (batType.cat === 'vehicles' || batType.skills.includes('oknitro')) {
                    if (allDrugs.includes('nitro') || bat.tags.includes('nitro')) {
                        drug = getDrugByName('nitro');
                        drugCompOK = checkCompReq(drug);
                        drugBldOK = true;
                        if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                            drugBldOK = false;
                        }
                        drugBldVMOK = true;
                        if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                            drugBldVMOK = false;
                        }
                        drugCostsOK = checkCost(drug.costs);
                        balise = 'h4';
                        boutonNope = 'boutonGrey';
                        colorNope = 'gf';
                        if (bat.tags.includes('nitro')) {
                            balise = 'h3';
                            boutonNope = 'boutonOK';
                            colorNope = 'cy';
                        }
                        apCost = drug.apCost;
                        if (drugCompOK) {
                            let nitroPA = getNitroBonus(bat);
                            if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('nitro') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                                $('#unitInfos').append('<button type="button" title="Nitro: +'+nitroPA+' PA '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`nitro`)"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>');
                            } else {
                                if (bat.tags.includes('nitro')) {
                                    skillMessage = "Nitro: Déjà administré";
                                } else if (!drugCompOK) {
                                    skillMessage = "Nitro: Vous n'avez pas les compétences requises";
                                } else if (!drugBldVMOK) {
                                    skillMessage = "Nitro: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                                } else if (!drugBldOK) {
                                    skillMessage = "Nitro: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                                } else if (!drugCostsOK) {
                                    skillMessage = "Nitro: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                                } else {
                                    skillMessage = "Nitro: Pas assez de PA";
                                }
                                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="ra ra-bottled-bolt rpg"></i> <span class="small">'+apCost+'</span></button>');
                            }
                        }
                    }
                }
            }
            // SUDU
            if (batType.cat === 'vehicles' && !batType.skills.includes('cyber') && !batType.skills.includes('robot') && !batType.skills.includes('emoteur') && batType.moveCost < 90) {
                if (allDrugs.includes('sudu') || bat.tags.includes('sudu')) {
                    drug = getDrugByName('sudu');
                    drugCompOK = checkCompReq(drug);
                    drugBldOK = true;
                    if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldOK = false;
                    }
                    drugBldVMOK = true;
                    if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldVMOK = false;
                    }
                    drugCostsOK = checkCost(drug.costs);
                    balise = 'h4';
                    boutonNope = 'boutonGrey';
                    colorNope = 'gf';
                    if (bat.tags.includes('sudu')) {
                        balise = 'h3';
                        boutonNope = 'boutonOK';
                        colorNope = 'cy';
                    }
                    apCost = drug.apCost;
                    if (drugCompOK) {
                        if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('sudu') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                            $('#unitInfos').append('<button type="button" title="Sudu: Vitesse 115% '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`sudu`)"><i class="fas fa-tachometer-alt"></i> <span class="small">'+apCost+'</span></button>');
                        } else {
                            if (bat.tags.includes('sudu')) {
                                skillMessage = "Sudu: Déjà administré";
                            } else if (!drugCompOK) {
                                skillMessage = "Sudu: Vous n'avez pas les compétences requises";
                            } else if (!drugBldVMOK) {
                                skillMessage = "Sudu: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                            } else if (!drugBldOK) {
                                skillMessage = "Sudu: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                            } else if (!drugCostsOK) {
                                skillMessage = "Sudu: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                            } else {
                                skillMessage = "Sudu: Pas assez de PA";
                            }
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-tachometer-alt"></i> <span class="small">'+apCost+'</span></button>');
                        }
                    }
                }
            }
            if (batType.crew >= 1 && !batType.skills.includes('clone') && batType.cat != 'infantry' && !batType.skills.includes('dome') && !batType.skills.includes('pilone') && !batType.skills.includes('cfo')) {
                // OCTIRON (véhicules)
                if (allDrugs.includes('octiron') || bat.tags.includes('octiron')) {
                    drug = getDrugByName('octiron');
                    drugCompOK = checkCompReq(drug);
                    drugBldOK = true;
                    if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldOK = false;
                    }
                    drugBldVMOK = true;
                    if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldVMOK = false;
                    }
                    drugCostsOK = checkCost(drug.costs);
                    balise = 'h4';
                    boutonNope = 'boutonGrey';
                    colorNope = 'gf';
                    if (bat.tags.includes('octiron')) {
                        balise = 'h3';
                        boutonNope = 'boutonOK';
                        colorNope = 'cy';
                    }
                    apCost = drug.apCost;
                    if (drugCompOK) {
                        if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('octiron') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                            $('#unitInfos').append('<button type="button" title="Octiron: +4 PA / réduit le stress '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`octiron`)"><i class="fas fa-cannabis"></i> <span class="small">'+apCost+'</span></button>');
                        } else {
                            if (bat.tags.includes('octiron')) {
                                skillMessage = "Octiron: Déjà sous l'effet de cette drogue";
                            } else if (!drugCompOK) {
                                skillMessage = "Octiron: Vous n'avez pas les compétences requises";
                            } else if (!drugBldVMOK) {
                                skillMessage = "Octiron: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                            } else if (!drugBldOK) {
                                skillMessage = "Octiron: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                            } else if (!drugCostsOK) {
                                skillMessage = "Octiron: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                            } else {
                                skillMessage = "Octiron: Pas assez de PA";
                            }
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-cannabis"></i> <span class="small">'+apCost+'</span></button>');
                        }
                    }
                }
                // MOLOKO (véhicules)
                if (batType.cat === 'vehicles') {
                    if (allDrugs.includes('moloko') || bat.tags.includes('moloko')) {
                        drug = getDrugByName('moloko');
                        drugCompOK = checkCompReq(drug);
                        drugBldOK = true;
                        if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                            drugBldOK = false;
                        }
                        drugBldVMOK = true;
                        if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                            drugBldVMOK = false;
                        }
                        drugCostsOK = checkCost(drug.costs);
                        balise = 'h4';
                        boutonNope = 'boutonGrey';
                        colorNope = 'gf';
                        if (bat.tags.includes('moloko')) {
                            balise = 'h3';
                            boutonNope = 'boutonOK';
                            colorNope = 'cy';
                        }
                        apCost = drug.apCost;
                        if (drugCompOK) {
                            if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('moloko') && !bat.tags.includes('bliss') && !batType.skills.includes('nofear') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                                $('#unitInfos').append('<button type="button" title="Moloko: Immunisé à la peur / -2 PA '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`moloko`)"><i class="fas fa-wine-bottle"></i> <span class="small">'+apCost+'</span></button>');
                            } else {
                                if (bat.tags.includes('moloko')) {
                                    skillMessage = "Moloko: Déjà bourré";
                                } else if (bat.tags.includes('bliss') || batType.skills.includes('nofear')) {
                                    skillMessage = "Moloko: Déjà immunisé à la peur";
                                } else if (!drugCompOK) {
                                    skillMessage = "Moloko: Vous n'avez pas les compétences requises";
                                } else if (!drugBldVMOK) {
                                    skillMessage = "Moloko: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                                } else if (!drugBldOK) {
                                    skillMessage = "Moloko: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                                } else if (!drugCostsOK) {
                                    skillMessage = "Moloko: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                                } else {
                                    skillMessage = "Moloko: Pas assez de PA";
                                }
                                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-wine-bottle"></i> <span class="small">'+apCost+'</span></button>');
                            }
                        }
                    }
                }
                // BLISS (véhicules)
                if (allDrugs.includes('bliss') || bat.tags.includes('bliss')) {
                    drug = getDrugByName('bliss');
                    drugCompOK = checkCompReq(drug);
                    drugBldOK = true;
                    if (drug.bldReq.length >= 1 && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldOK = false;
                    }
                    drugBldVMOK = true;
                    if (drug.bldVMReq.length >= 1 && !playerInfos.bldVM.includes(drug.bldVMReq[0]) && !playerInfos.bldList.includes(drug.bldReq[0])) {
                        drugBldVMOK = false;
                    }
                    drugCostsOK = checkCost(drug.costs);
                    balise = 'h4';
                    boutonNope = 'boutonGrey';
                    colorNope = 'gf';
                    if (bat.tags.includes('bliss')) {
                        balise = 'h3';
                        boutonNope = 'boutonOK';
                        colorNope = 'cy';
                    }
                    apCost = drug.apCost;
                    if (drugCompOK) {
                        if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('bliss') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                            $('#unitInfos').append('<button type="button" title="Bliss: Immunisé à la peur / réduit le stress / -1 PA '+displayCosts(drug.costs)+'" class="boutonVert iconButtons" onclick="goDrug('+apCost+',`bliss`)"><i class="ra ra-pills rpg"></i> <span class="small">'+apCost+'</span></button>');
                        } else {
                            if (bat.tags.includes('bliss')) {
                                skillMessage = "Bliss: Déjà sous l'effet de cette drogue";
                            } else if (!drugCompOK) {
                                skillMessage = "Bliss: Vous n'avez pas les compétences requises";
                            } else if (!drugBldVMOK) {
                                skillMessage = "Bliss: Vous n'avez pas le bâtiment requis (sur la station ou dans la  zone): "+drug.bldVMReq[0];
                            } else if (!drugBldOK) {
                                skillMessage = "Bliss: Vous n'avez pas le bâtiment requis (dans la  zone): "+drug.bldReq[0];
                            } else if (!drugCostsOK) {
                                skillMessage = "Bliss: Vous n'avez pas les ressources: "+displayCosts(drug.costs);
                            } else {
                                skillMessage = "Bliss: Pas assez de PA";
                            }
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="ra ra-pills rpg"></i> <span class="small">'+apCost+'</span></button>');
                        }
                    }
                }
            }
        }
    }
    // EXTRACTION
    if (batType.skills.includes('extraction') && !playerInfos.onShip) {
        let extractOK = false;
        if (bat.extracted !== undefined) {
            if (bat.extracted.length >= 1) {
                extractOK = true;
            }
        }
        balise = 'h4';
        boutonNope = 'boutonGrey';
        colorNope = 'gf';
        if (bat.tags.includes('mining')) {
            balise = 'h3';
            boutonNope = 'boutonOK';
            colorNope = 'cy';
        }
        if (batType.kind === 'zero-extraction' && !extractOK && !bat.tags.includes('guet')) {
            balise = 'h5';
        }
        apCost = 2;
        apReq = 0;
        // <i class="ra ra-mining-diamonds rpg"></i>
        if (!bat.tags.includes('mining') && !inMelee && extractOK) {
            $('#unitInfos').append('<br><button type="button" title="Extraction: Extraire les ressources" class="boutonCaca iconButtons" onclick="extraction('+apCost+')"><i class="far fa-gem"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Extraction: Choisir les ressources" class="boutonCaca iconButtons" onclick="chooseRes(false)"><i class="fas fa-list"></i></button>');
        } else {
            if (inMelee) {
                skillMessage = "Extraction: Impossible en mêlée";
            } else if (!extractOK) {
                skillMessage = "Extraction: Aucune ressource choisie";
            } else if (bat.tags.includes('mining')) {
                skillMessage = "Extraction: Déjà en train d'extraire";
            } else {
                skillMessage = "Extraction: Pas assez de PA";
            }
            $('#unitInfos').append('<br><button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="far fa-gem"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Extraction: Choisir les ressources" class="boutonCaca iconButtons" onclick="chooseRes(false)"><i class="fas fa-list"></i></button>');
        }
    }
    // CRISTAUX
    if (batType.skills.includes('extraction') && batType.cat != 'buildings' && !inMelee && !playerInfos.onShip) {
        if (batType.mining.rate >= 10) {
            if (tile.infra != undefined) {
                if (tile.infra === 'Crystal') {
                    apCost = Math.ceil(bat.ap*300/(playerInfos.comp.ext+3)/batType.mining.rate/batType.mining.level);
                    if (apCost > Math.round(bat.ap*2.5)) {
                        apCost = Math.round(bat.ap*2.5);
                    }
                    let morphMining = getMorphiteRate(bat,batType);
                    let morphRate = Math.round(morphMining/1.87);
                    if (bat.apLeft >= 7) {
                        $('#unitInfos').append('<button type="button" title="Récupérer la Morphite (Efficacité '+morphRate+'%)" class="boutonCaca iconButtons" onclick="getMorphite('+apCost+')"><i class="far fa-gem"></i> <span class="small">'+apCost+'</span></button>');
                    } else {
                        $('#unitInfos').append('<button type="button" title="Récupérer la Morphite: Pas assez de PA (7 requis)" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="far fa-gem"></i> <span class="small">'+apCost+'</span></button>');
                    }
                }
            }
        }
    }
    // ACTIVATION
    if (batType.skills.includes('upnodis')) {
        balise = 'h3';
        boutonNope = 'boutonOK';
        colorNope = 'cy';
        let upkeepCosts = '{aucun}';
        if (batType.upkeep != undefined) {
            upkeepCosts = toCoolString(batType.upkeep);
        }
        apCost = 0;
        $('#unitInfos').append('<button type="button" title="Production activée: Coûts: '+upkeepCosts+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-industry"></i> <span class="small">'+apCost+'</span></button>');
    } else {
        if (batType.skills.includes('prodres') || batType.skills.includes('geo') || batType.skills.includes('solar') || batType.skills.includes('cram') || batType.skills.includes('dogprod') || batType.skills.includes('transcrap') || batType.skills.includes('cryogen') || batType.skills.includes('cryocit')) {
            balise = 'h1';
            boutonNope = 'boutonGrey';
            colorNope = 'gf';
            if (bat.tags.includes('prodres')) {
                balise = 'h3';
                boutonNope = 'boutonOK';
                colorNope = 'cy';
            }
            let upkeepCosts = '{aucun}';
            if (batType.upkeep != undefined) {
                upkeepCosts = toCoolString(batType.upkeep);
            }
            let theProd = '{aucune}';
            if (batType.prod != undefined) {
                theProd = toCoolString(batType.prod);
            } else {
                if (batType.skills.includes('cryogen')) {
                    let g2 = false;
                    if (bat.eq === 'g2cryo' || bat.logeq === 'g2cryo') {
                        g2 = true;
                    }
                    let atmo = getAtmo(g2);
                    theProd = toCoolString(atmo);
                } else if (batType.skills.includes('solar')) {
                    let solarProd = getSolarProd(tile);
                    theProd = '{Energie='+solarProd+'}';
                } else if (batType.skills.includes('geo')) {
                    let geoProd = getGeoProd(tile);
                    theProd = '{Energie='+geoProd+'}';
                }
            }
            apCost = 0;
            if (!bat.tags.includes('prodres')) {
                $('#unitInfos').append('<button type="button" title="Lancer la production '+theProd+' / Coûts: '+upkeepCosts+'" class="boutonGris iconButtons" onclick="prodToggle()"><i class="fas fa-industry"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                $('#unitInfos').append('<button type="button" title="Arrêter la production '+theProd+' / Coûts: '+upkeepCosts+'" class="'+boutonNope+' iconButtons '+colorNope+'" onclick="prodToggle()"><i class="fas fa-industry"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
    }
    let trapType;
    let trapCostOK;
    if (!playerInfos.onShip) {
        // POSE PIEGES
        if (batType.skills.includes('trapfosse')) {
            freeConsTile = checkFreeConsTile(bat,batType);
            if (freeConsTile) {
                let minesLeft = calcRavit(bat);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                trapType = getBatTypeByName('Fosses');
                trapCostOK = checkCost(trapType.costs);
                apCost = Math.round(batType.ap*1.5*5/(playerInfos.comp.def+4));
                apReq = Math.round(batType.ap/1.5*5/(playerInfos.comp.def+4));
                if (minesLeft >= 1 && bat.apLeft >= apReq && !inMelee && trapCostOK) {
                    $('#unitInfos').append('<button type="button" title="Déposer des pièges '+displayCosts(trapType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost+',`trap-fosse`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Fosses</span></button>');
                } else {
                    if (minesLeft <= 0) {
                        skillMessage = "Plus de pièges";
                    } else if (!trapCostOK) {
                        skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                    } else if (inMelee) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Fosses</span></button>');
                }
            }
        }
        if (batType.skills.includes('trapap') || bat.eq === 'kit-sentinelle') {
            freeConsTile = checkFreeConsTile(bat,batType);
            if (freeConsTile) {
                let minesLeft = calcRavit(bat);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                trapType = getBatTypeByName('Pièges');
                trapCostOK = checkCost(trapType.costs);
                apCost = Math.round(batType.ap*1.25*5/(playerInfos.comp.def+4));
                apReq = Math.round(batType.ap/1.5*5/(playerInfos.comp.def+4));
                if (minesLeft >= 1 && bat.apLeft >= apReq && !inMelee && trapCostOK) {
                    $('#unitInfos').append('<button type="button" title="Déposer des pièges '+displayCosts(trapType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost+',`trap-ap`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Pièges</span></button>');
                } else {
                    if (minesLeft <= 0) {
                        skillMessage = "Plus de pièges";
                    } else if (!trapCostOK) {
                        skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                    } else if (inMelee) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Pièges</span></button>');
                }
            }
        }
        if (batType.skills.includes('trapdard')) {
            freeConsTile = checkFreeConsTile(bat,batType);
            if (freeConsTile) {
                let minesLeft = calcRavit(bat);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                trapType = getBatTypeByName('Dardières');
                trapCostOK = checkCost(trapType.costs);
                apCost = Math.round(batType.ap*1.25*5/(playerInfos.comp.def+4));
                apReq = Math.round(batType.ap/1.5*5/(playerInfos.comp.def+4));
                if (minesLeft >= 1 && bat.apLeft >= apReq && !inMelee && trapCostOK) {
                    $('#unitInfos').append('<button type="button" title="Déposer des pièges '+displayCosts(trapType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost+',`trap-dard`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Dardières</span></button>');
                } else {
                    if (minesLeft <= 0) {
                        skillMessage = "Plus de pièges";
                    } else if (!trapCostOK) {
                        skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                    } else if (inMelee) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Dardières</span></button>');
                }
            }
        }
        // POSE CHAMP DE MINES
        if (batType.skills.includes('landmine') && playerInfos.comp.explo >= 1) {
            freeConsTile = checkFreeConsTile(bat,batType);
            if (freeConsTile) {
                let minesLeft = calcRavit(bat);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                trapType = getBatTypeByName('Champ de mines');
                if (trapType.levels[playerInfos.gang] <= playerInfos.gLevel) {
                    trapCostOK = checkCost(trapType.costs);
                    apCost = Math.round(batType.ap/1.1*5/(playerInfos.comp.explo+4));
                    apReq = Math.round(batType.ap/1.5*5/(playerInfos.comp.explo+4));
                    if (minesLeft >= 1 && bat.apLeft >= apReq && !inMelee && trapCostOK) {
                        $('#unitInfos').append('<button type="button" title="Déposer un champ de mines '+displayCosts(trapType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost+',`champ`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Mines</span></button>');
                    } else {
                        if (minesLeft <= 0) {
                            skillMessage = "Plus de mines";
                        } else if (!trapCostOK) {
                            skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                        } else if (inMelee) {
                            skillMessage = "Ne peut pas se faire en mêlée";
                        } else {
                            skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Mines</span></button>');
                    }
                }
            }
        }
        // POSE MINES WIPEOUT
        if (batType.skills.includes('landmine') && playerInfos.comp.explo >= 2) {
            freeConsTile = checkFreeConsTile(bat,batType);
            if (freeConsTile) {
                let minesLeft = calcRavit(bat);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                trapType = getBatTypeByName('Mines wipeout');
                if (trapType.levels[playerInfos.gang] <= playerInfos.gLevel) {
                    trapCostOK = checkCost(trapType.costs);
                    apCost = Math.round(batType.ap/1.1*5/(playerInfos.comp.explo+4));
                    apReq = Math.round(batType.ap/1.5*5/(playerInfos.comp.explo+4));
                    if (minesLeft >= 1 && bat.apLeft >= apReq && !inMelee && trapCostOK) {
                        $('#unitInfos').append('<button type="button" title="Déposer un champ de mines Wipeout '+displayCosts(trapType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost+',`wipe`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Wipeout</span></button>');
                    } else {
                        if (minesLeft <= 0) {
                            skillMessage = "Plus de mines";
                        } else if (!trapCostOK) {
                            skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                        } else if (inMelee) {
                            skillMessage = "Ne peut pas se faire en mêlée";
                        } else {
                            skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Wipeout</span></button>');
                    }
                }
            }
        }
        // POSE DYNAMITE
        if (batType.skills.includes('dynamite')) {
            freeConsTile = checkFreeConsTile(bat,batType);
            if (freeConsTile) {
                let minesLeft = calcRavit(bat);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                trapType = getBatTypeByName('Explosifs');
                trapCostOK = checkCost(trapType.costs);
                apCost = Math.round(batType.ap*5/(playerInfos.comp.explo+4));
                apReq = Math.round(batType.ap/1.5*5/(playerInfos.comp.explo+4));
                if (minesLeft >= 1 && bat.apLeft >= apReq && !inMelee && trapCostOK) {
                    $('#unitInfos').append('<button type="button" title="Déposer des explosifs '+displayCosts(trapType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost+',`dynamite`)"><i class="ra ra-bomb-explosion rpg"></i> <span class="small">'+apCost+'&nbsp; Explosifs</span></button>');
                } else {
                    if (minesLeft <= 0) {
                        skillMessage = "Plus de mines";
                    } else if (!trapCostOK) {
                        skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                    } else if (inMelee) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="ra ra-bomb-explosion rpg"></i> <span class="small">'+apCost+'&nbsp; Explosifs</span></button>');
                }
            }
        }
        // POSE COFFRES
        if (batType.skills.includes('conscont')) {
            freeConsTile = checkFreeConsTile(bat,batType);
            if (freeConsTile) {
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                trapType = getBatTypeByName('Coffres');
                trapCostOK = checkCost(trapType.costs);
                apCost = 8;
                apReq = Math.ceil(batType.ap/2);
                if (bat.apLeft >= apReq && !inMelee && trapCostOK) {
                    $('#unitInfos').append('<button type="button" title="Construire des coffres '+displayCosts(trapType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost+',`coffre`)"><i class="fas fa-box-open"></i> <span class="small">'+apCost+'&nbsp; Coffres</span></button>');
                } else {
                    if (!trapCostOK) {
                        skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                    } else if (inMelee) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' iconButtons '+colorNope+'"><i class="fas fa-box-open"></i> <span class="small">'+apCost+'&nbsp; Coffres</span></button>');
                }
            }
        }
        // POSE BARBELES
        if (batType.skills.includes('barbs')) {
            freeConsTile = checkFreeConsTile(bat,batType);
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
                    $('#unitInfos').append('<br><span id="barbButtons"></span>');
                    $('#barbButtons').empty();
                    let barbType = getBatTypeByName('Barbelés (scrap)');
                    let barbCostOK = checkCost(barbType.costs);
                    if (barbCostOK) {
                        $('#barbButtons').append('<button type="button" title="Déposer des barbelés (scrap) '+displayCosts(barbType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost+',`barb-scrap`)"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Scrap</span></button>');
                    } else {
                        skillMessage = "Pas assez de ressources "+displayCosts(barbType.costs);
                        $('#barbButtons').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Scrap</span></button>');
                    }
                    barbType = getBatTypeByName('Barbelés');
                    barbCostOK = checkCost(barbType.costs);
                    if (barbCostOK) {
                        $('#barbButtons').append('<button type="button" title="Déposer des barbelés (acier) '+displayCosts(barbType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost+',`barb-fer`)"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Acier</span></button>');
                    } else {
                        skillMessage = "Pas assez de ressources "+displayCosts(barbType.costs);
                        $('#barbButtons').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Acier</span></button>');
                    }
                    barbType = getBatTypeByName('Barbelés (taser)');
                    barbCostOK = checkCost(barbType.costs);
                    if (barbCostOK && playerInfos.bldList.includes('Générateur')) {
                        $('#barbButtons').append('<button type="button" title="Déposer des barbelés (taser) '+displayCosts(barbType.costs)+'" class="boutonGris iconButtons" onclick="dropStuff('+apCost2+',`barb-taser`)"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Taser</span></button>');
                    } else {
                        if (!playerInfos.bldList.includes('Générateur')) {
                            skillMessage = "Vous avez besoin de Générateurs";
                        } else {
                            skillMessage = "Pas assez de ressources "+displayCosts(barbType.costs);
                        }
                        $('#barbButtons').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Taser</span></button>');
                    }
                } else {
                    if (barbLeft <= 0) {
                        skillMessage = "Plus de barbelés";
                    } else if (inMelee) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">'+apCost+'</span></button>');
                }
            }
        }
    }
    // ROUTES / PONTS
    if ((batType.skills.includes('routes') || bat.eq === 'e-road' || bat.logeq === 'e-road') && !playerInfos.onShip) {
        let roadsOK = true;
        if (batType.skills.includes('infrahelp') || bat.eq === 'e-infra' || bat.logeq === 'e-infra') {
            roadsOK = checkRoadsAround(bat);
        }
        if (!tile.rd || !roadsOK || bat.tags.includes('autoroad')) {
            apCost = batType.mecanoCost*terrain.roadBuild*roadAPCost/40/(playerInfos.comp.const+3)*3;
            if (bat.eq === 'e-road' || bat.logeq === 'e-road') {
                if (batType.skills.includes('routes')) {
                    apCost = apCost/1.5;
                } else if (batType.mecanoCost < 12) {
                    apCost = 12*terrain.roadBuild*roadAPCost/40/(playerInfos.comp.const+3)*3;
                }
            }
            apReq = Math.ceil(apCost/10);
            apCost = Math.round(apCost);
            let roadCosts = getRoadCosts(tile);
            let roadCostsOK = checkCost(roadCosts);
            let roadName = 'Route';
            if (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain == 'L') {
                roadName = 'Pont';
            }
            let workForceOK = true;
            if (batType.crew === 0) {
                let workForceId = checkNearWorkforce(bat);
                if (workForceId < 0) {
                    workForceOK = false;
                }
            }
            if (bat.apLeft >= apReq && !inMelee && roadCostsOK && workForceOK) {
                if (batType.moveCost < 90) {
                    if (bat.tags.includes('autoroad')) {
                        $('#unitInfos').append('<br><button type="button" title="Stopper la construction automatique de routes" class="boutonOK iconButtons cy" onclick="toggleAutoRoad('+apCost+',true)"><i class="fas fa-road"></i> <span class="small">Stop</span></button>');
                    } else {
                        $('#unitInfos').append('<br><button type="button" title="Construction ('+roadName+') '+displayCosts(roadCosts)+'" class="boutonGris iconButtons" onclick="putRoad('+apCost+')"><i class="fas fa-road"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Construction automatique de routes" class="boutonNoir iconButtons" onclick="toggleAutoRoad('+apCost+',false)"><i class="fas fa-road"></i> <span class="small">Auto</span></button>');
                    }
                } else {
                    $('#unitInfos').append('<br><button type="button" title="Construction ('+roadName+') '+displayCosts(roadCosts)+'" class="boutonGris iconButtons" onclick="putRoad('+apCost+')"><i class="fas fa-road"></i> <span class="small">'+apCost+'</span></button>');
                }
            } else {
                if (inMelee) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else if (!roadCostsOK) {
                    skillMessage = "Pas assez de ressources "+displayCosts(roadCosts);
                } else if (!workForceOK) {
                    skillMessage = "Pas de citoyens pour faire la route (vous devez amener un bataillon à côté)";
                } else {
                    skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                }
                $('#unitInfos').append('<br><button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-road"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
    }
    // INFRASTRUCTURE
    if ((batType.skills.includes('infraz') || near.caserne) && !playerInfos.onShip) {
        if ((tile.terrain != 'W' || playerInfos.comp.const >= 2 || playerInfos.comp.const+playerInfos.comp.def >= 3) && tile.terrain != 'R' && tile.terrain != 'L') {
            apReq = getConstAPReq(bat,batType);
            let infra;
            let infraCostOK;
            let defaultMessage;
            if (bat.apLeft < apReq) {
                defaultMessage = 'Pas assez de PA (réserve de '+apReq+' requise)';
            }
            if (inMelee) {
                defaultMessage = 'Impossible en mêlée';
            }
            $('#unitInfos').append('<br><span id="infraButtons"></span>');
            $('#infraButtons').empty();
            if (tile.infra != 'Miradors') {
                infra = getInfraByName('Miradors');
                infraCostOK = checkCost(infra.costs);
                if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def+playerInfos.comp.const) {
                    prodOK = false;
                } else {
                    prodOK = true;
                }
                if (infraCostOK && prodOK && bat.apLeft >= apReq && !inMelee) {
                    $('#infraButtons').append('<button type="button" title="Construction (Miradors) '+displayCosts(infra.costs)+'" class="boutonGris iconButtons" onclick="putInfra(`Miradors`)"><span class="small">Mi</span></button>');
                } else {
                    if (!prodOK) {
                        skillMessage = "Niveau insuffisant";
                    } else if (!infraCostOK) {
                        skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                    } else {
                        skillMessage = defaultMessage;
                    }
                    $('#infraButtons').append('<button type="button" title="Miradors: '+skillMessage+'" class="boutonGrey iconButtons gf"><span class="small">Mi</span></button>');
                }
            }
            if (tile.infra != 'Palissades') {
                infra = getInfraByName('Palissades');
                infraCostOK = checkCost(infra.costs);
                if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def+playerInfos.comp.const) {
                    prodOK = false;
                } else {
                    prodOK = true;
                }
                if (infraCostOK && prodOK && bat.apLeft >= apReq && !inMelee) {
                    $('#infraButtons').append('<button type="button" title="Construction (Palissades) '+displayCosts(infra.costs)+'" class="boutonGris iconButtons" onclick="putInfra(`Palissades`)"><span class="small">Pa</span></button>');
                } else {
                    if (!prodOK) {
                        skillMessage = "Niveau insuffisant";
                    } else if (!infraCostOK) {
                        skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                    } else {
                        skillMessage = defaultMessage;
                    }
                    $('#infraButtons').append('<button type="button" title="Palissades: '+skillMessage+'" class="boutonGrey iconButtons gf"><span class="small">Pa</span></button>');
                }
            }
            if (tile.infra != 'Remparts' && playerInfos.comp.def >= 1) {
                infra = getInfraByName('Remparts');
                infraCostOK = checkCost(infra.costs);
                if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.const) {
                    prodOK = false;
                } else {
                    prodOK = true;
                }
                if (infraCostOK && prodOK && bat.apLeft >= apReq && !inMelee) {
                    $('#infraButtons').append('<button type="button" title="Construction (Remparts) '+displayCosts(infra.costs)+'" class="boutonGris iconButtons" onclick="putInfra(`Remparts`)"><span class="small">Re</span></button>');
                } else {
                    if (!prodOK) {
                        skillMessage = "Niveau insuffisant";
                    } else if (!infraCostOK) {
                        skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                    } else {
                        skillMessage = defaultMessage;
                    }
                    $('#infraButtons').append('<button type="button" title="Remparts: '+skillMessage+'" class="boutonGrey iconButtons gf"><span class="small">Re</span></button>');
                }
            }
            if (tile.infra != 'Murailles' && playerInfos.comp.def >= 3 && playerInfos.comp.const >= 1) {
                infra = getInfraByName('Murailles');
                infraCostOK = checkCost(infra.costs);
                if (infra.levels[playerInfos.gang] > playerInfos.gLevel) {
                    prodOK = false;
                } else {
                    prodOK = true;
                }
                if (infraCostOK && prodOK && bat.apLeft >= apReq && !inMelee) {
                    $('#infraButtons').append('<button type="button" title="Construction (Murailles) '+displayCosts(infra.costs)+'" class="boutonGris iconButtons" onclick="putInfra(`Murailles`)"><span class="small">Mu</span></button>');
                } else {
                    if (!prodOK) {
                        skillMessage = "Niveau insuffisant";
                    } else if (!infraCostOK) {
                        skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                    } else {
                        skillMessage = defaultMessage;
                    }
                    $('#infraButtons').append('<button type="button" title="Murailles: '+skillMessage+'" class="boutonGrey iconButtons gf"><span class="small">Mu</span></button>');
                }
            }
            if (tile.infra != 'Terriers' && playerInfos.comp.const >= 1) {
                infra = getInfraByName('Terriers');
                if (infra.levels[playerInfos.gang] < 90) {
                    infraCostOK = checkCost(infra.costs);
                    if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def+playerInfos.comp.const) {
                        prodOK = false;
                    } else {
                        prodOK = true;
                    }
                    if (infraCostOK && prodOK && bat.apLeft >= apReq && !inMelee) {
                        $('#infraButtons').append('<button type="button" title="Construction (Terriers) '+displayCosts(infra.costs)+'" class="boutonGris iconButtons" onclick="putInfra(`Terriers`)"><span class="small">Te</span></button>');
                    } else {
                        if (!prodOK) {
                            skillMessage = "Niveau insuffisant";
                        } else if (!infraCostOK) {
                            skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                        } else {
                            skillMessage = defaultMessage;
                        }
                        $('#infraButtons').append('<button type="button" title="Terriers: '+skillMessage+'" class="boutonGrey iconButtons gf"><span class="small">Te</span></button>');
                    }
                }
            }
        }
    }
    // DEMENTELEMENT INFRA
    if (batType.skills.includes('constructeur') && !playerInfos.onShip) {
        if (tile.infra != undefined) {
            if (tile.infra === 'Miradors' || tile.infra === 'Palissades' || tile.infra === 'Remparts' || tile.infra === 'Murailles' || tile.infra === 'Terriers') {
                let infra = getInfraByName(tile.infra);
                apCost = Math.round(Math.sqrt(batType.mecanoCost)*infra.fabTime/5.1);
                apReq = getConstAPReq(bat,batType);
                if (bat.apLeft >= apReq && !inMelee) {
                    $('#unitInfos').append('<button type="button" title="Démanteler '+tile.infra+'" class="boutonGris iconButtons" onclick="demolition('+apCost+')"><i class="far fa-trash-alt"></i> <span class="small">'+apCost+'</span></button>');
                } else {
                    if (inMelee) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="far fa-trash-alt"></i> <span class="small">'+apCost+'</span></button>');
                }
            }
        }
    }
    // NETTOYAGE
    if ((batType.skills.includes('cleaning') || (batType.cat === 'buildings' && batType.crew >= 1)) && !playerInfos.onShip) {
        let numWeb = checkWeb(bat.tileId);
        if (numWeb >= 1) {
            apCost = Math.ceil((batType.mecanoCost+1)/1.75*numWeb);
            apReq = Math.ceil(apCost/5);
            if (batType.cat === 'infantry' && tile.web) {
                apCost = batType.mecanoCost+1;
                apReq = 1;
            }
            if (bat.apLeft >= apReq && !inMelee) {
                $('#unitInfos').append('<button type="button" title="Détruire les toiles" class="boutonGris iconButtons" onclick="removeWeb('+apCost+')"><i class="fas fa-broom"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (inMelee) {
                    skillMessage = "Détruire les toiles: Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Détruire les toiles: Pas assez de PA (réserve de "+apReq+" requise)";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-broom"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
    }
    // FOUILLE DE RUINES
    if (!playerInfos.onShip) {
        if ((batType.skills.includes('fouille') || (batType.skills.includes('aifouille') && (bat.eq === 'g2ai' || bat.logeq === 'g2ai' || playerInfos.bldList.includes('Centre de com')))) && tile.ruins && tile.sh >= 1) {
            apReq = Math.round(5*7/(playerInfos.comp.tri+6));
            apCost = Math.round(1250/bat.squadsLeft/batType.squadSize/batType.crew);
            if (batType.skills.includes('scav')) {
                apCost = Math.round(apCost/1.75);
            }
            if (batType.cat === 'infantry' && !batType.skills.includes('moto') && !batType.skills.includes('fly')) {
                apCost = Math.floor(apCost/batType.ap*11);
            }
            if (apCost > batType.ap*1.5 || batType.skills.includes('moto') || batType.skills.includes('fly')) {
                apCost = Math.round(batType.ap*1.5);
            }
            if (bat.apLeft >= apReq && !inMelee) {
                $('#unitInfos').append('<button type="button" title="Fouiller les ruines" class="boutonCaca iconButtons" onclick="searchRuins('+apCost+')"><i class="fas fa-search"></i> <span class="small">'+apCost+'</span></button>');
            } else {
                if (inMelee) {
                    skillMessage = "Fouiller: Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Fouiller: Pas assez de PA (réserve de "+apReq+" requise)";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-search"></i> <span class="small">'+apCost+'</span></button>');
            }
        }
    }
    // CHARGER RESSOURCES
    if (batType.skills.includes('fret')) {
        let resToLoad = isResToLoad(bat);
        balise = 'h4';
        if (resToLoad) {
            balise = 'h2';
        }
        apReq = 0;
        apCost = 3-playerInfos.comp.trans;
        if (!inMelee && !inSoute) {
            $('#unitInfos').append('<button type="button" title="Charger des ressources" class="boutonCaca iconButtons" onclick="loadRes(false)"><i class="fas fa-truck-loading"></i> <span class="small">'+apCost+'</span></button>');
        } else {
            if (inMelee) {
                skillMessage = "Chargement: Impossible en mêlée";
            } else {
                skillMessage = "Chargement: Pas assez de PA";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-truck-loading"></i> <span class="small">'+apCost+'</span></button>');
        }
    }
    // RAVITAILLEMENT DROGUES
    let anyRavit = checkRavitDrug(bat);
    if (anyRavit && bat.tags.includes('dU') && batType.skills.includes('dealer') && !playerInfos.onShip) {
        let apCost = Math.round(batType.ap/3*7/(playerInfos.comp.log+5));
        if (bat.apLeft >= 2) {
            $('#unitInfos').append('<button type="button" title="Faire le plein de drogues" class="boutonVert iconButtons" onclick="goRavitDrug('+apCost+')"><i class="fas fa-prescription-bottle"></i> <span class="small">'+apCost+'</span></button>');
        } else {
            skillMessage = "Faire le plein de drogues: Pas assez de PA";
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-prescription-bottle"></i> <span class="small">'+apCost+'</span></button>');
        }
    }
    // RAVITAILLEMENT
    anyRavit = checkRavit(bat);
    console.log('RAVIT: '+anyRavit);
    if (anyRavit && bat.tags.includes('aU') && !playerInfos.onShip) {
        let ravitVolume = calcRavitVolume(bat);
        let ravitFactor = 3;
        if (batType.skills.includes('fly') && !batType.skills.includes('jetpack')) {
            ravitFactor = 1;
        }
        if (bat.eq.includes('carrousel') || bat.logeq.includes('carrousel')) {
            ravitFactor = ravitFactor*1.5;
        }
        if (playerInfos.comp.log >= 3) {
            ravitFactor = ravitFactor*2;
        }
        let apCost = Math.round(Math.sqrt(ravitVolume[1])*batType.ap/ravitFactor*7/(playerInfos.comp.log+5));
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<button type="button" title="Faire le plein de munitions" class="boutonCaca iconButtons" onclick="goRavit('+apCost+')"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>');
        } else {
            skillMessage = "Ravitaillement: Pas assez de PA";
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>');
        }
    }
    // STOCKS
    let anyStock = checkStock(bat);
    if (anyStock && bat.tags.includes('sU') && !playerInfos.onShip) {
        let apCost = Math.round(batType.ap*1.5*5/(playerInfos.comp.log+5));
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<button type="button" title="Faire le plein de ravitaillements" class="boutonCaca iconButtons" onclick="goStock('+apCost+')"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>');
        } else {
            skillMessage = "Réapprovisionnement: Pas assez de PA";
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>');
        }
    }
    // UPGRADE INFANTRY
    if (batType.skills.includes('uprank')) {
        let isInPlace = checkUprankPlace(bat,batType);
        let isXPok = checkUprankXP(bat,batType);
        let upBatType = getBatTypeByName(batType.unitUp);
        apReq = 5;
        if (bat.apLeft >= apReq && !inMelee && (isInPlace || inSoute) && isXPok && craftsOK) {
            $('#unitInfos').append('<button type="button" title="Transformer en '+batType.unitUp+'" class="boutonGris iconButtons" onclick="bfconst(`buildings`,false,`inf`,false)"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
        } else {
            if (inMelee) {
                skillMessage = "Transformation: Ne peut pas se faire en mêlée";
            } else if (!craftsOK) {
                skillMessage = "Transformation: Vous avez atteint votre maximum de crafts";
            } else if (!isXPok) {
                skillMessage = "Transformation: Ce bataillon n'a pas assez d'expérience pour être monté en grade";
            } else if (!isInPlace) {
                skillMessage = 'Transformation: Vous devez être à côté d\'un '+upBatType.bldReq[0]+' pour monter ce bataillon en grade';
            } else {
                skillMessage = "Transformation: Pas assez de PA (réserve de "+apReq+" requise)";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
        }
    }
    // UPGRADE BUILDING
    if (batType.skills.includes('upgrade')) {
        let isCharged = checkCharged(bat,'trans');
        apReq = 5;
        if (bat.apLeft >= apReq && !inMelee && !isCharged && craftsOK) {
            if (batType.bldUp.length === 1) {
                $('#unitInfos').append('<button type="button" title="Transformer en '+batType.bldUp[0]+'" class="boutonGris iconButtons" onclick="bfconst(`buildings`,false,`bld`,false)"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
            } else {
                $('#unitInfos').append('<button type="button" title="Transformer en '+batType.bldUp[0]+' ou '+batType.bldUp[1]+'" class="boutonGris iconButtons" onclick="bfconst(`buildings`,false,`bld`,false)"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
            }
        } else {
            if (inMelee) {
                skillMessage = "Transformation: Ne peut pas se faire en mêlée";
            } else if (!craftsOK) {
                skillMessage = "Transformation: Vous avez atteint votre maximum de crafts";
            } else if (isCharged) {
                skillMessage = "Transformation: Vous devez vider votre bataillon avant de le transformer";
            } else {
                skillMessage = "Transformation: Pas assez de PA (réserve de "+apReq+" requise)";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
        }
    }
    if (!inSoute && !bat.tags.includes('nomove')) {
        if (isReloaded || playerInfos.mapTurn != 0 || playerInfos.onShip) {
            // CONSTRUCTION BATIMENTS
            if (batType.skills.includes('constructeur')) {
                apReq = getConstAPReq(bat,batType);
                if (bat.apLeft >= apReq && !inMelee && craftsOK) {
                    $('#unitInfos').append('<br><button type="button" title="Construction (bâtiments)" class="boutonOrange iconButtons" onclick="bfconst(`buildings`,false,false,false)"><i class="fas fa-cogs"></i> <span class="small">'+apReq+'</span></button>');
                } else {
                    if (inMelee) {
                        skillMessage = "Construction: Ne peut pas se faire en mêlée";
                    } else if (!craftsOK) {
                        skillMessage = "Construction: Vous avez atteint votre maximum de crafts";
                    } else {
                        skillMessage = "Construction: Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<br><button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-cogs"></i> <span class="small">'+apReq+'</span></button>');
                }
            }
            // CONSTRUCTION UNITES
            if (batType.skills.includes('producteur')) {
                apReq = getConstAPReq(bat,batType);
                if (bat.apLeft >= apReq && !inMelee && craftsOK) {
                    $('#unitInfos').append('<br><button type="button" title="Production (unités)" class="boutonOrange iconButtons" onclick="bfconst(`units`,false,false,false)"><i class="fas fa-cogs"></i> <span class="small">'+apReq+'</span></button>');
                } else {
                    if (inMelee) {
                        skillMessage = "Production: Ne peut pas se faire en mêlée";
                    } else if (!craftsOK) {
                        skillMessage = "Production: Vous avez atteint votre maximum de crafts";
                    } else {
                        skillMessage = "Production: Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<br><button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-cogs"></i> <span class="small">'+apReq+'</span></button>');
                }
            }
        }
    }
    // CHANGER AMMOS-ARMURE-EQUIPEMENT
    let equipOK = false;
    if (playerInfos.onShip) {
        if (bat.loc === 'zone' || bat.locId === souteId) {
            equipOK = true;
        }
        if (batType.skills.includes('transorbital') && bat.tags.includes('deploy')) {
            equipOK = false;
        }
    } else {
        if (checkNearConstructor(bat)) {
            equipOK = true;
        }
    }
    if (equipOK) {
        apCost = Math.round(batType.ap*1.5);
        apReq = getConstAPReq(bat,batType);
        if ((bat.apLeft >= apReq || playerInfos.onShip) && !inMelee) {
            $('#unitInfos').append('<button type="button" title="Changer de munitions, équipement ou armure ('+apCost+' PA)" class="boutonOrange iconButtons" onclick="reEquip('+bat.id+',false,false)"><i class="ra ra-rifle rpg"></i> <span class="small">'+apReq+'</span></button>');
        } else {
            if (inMelee) {
                skillMessage = "Rééquiper: Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Rééquiper: Pas assez de PA (réserve de "+apReq+" requise)";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey iconButtons gf"><i class="fas fa-user-shield"></i> <span class="small">'+apReq+'</span></button>');
        }
    }
    let unloadOK = false;
    if (!inSoute && batType.name != 'Soute') {
        if (playerInfos.onShip || playerInfos.mapTurn >= 1) {
            unloadOK = true;
        }
    }
    if (unloadOK) {
        // DEBARQUER
        $('#unitInfos').append('<a name="letransport"></a>');
        unloadInfos(bat,batType);
        // DECONSTRUIRE VERS LANDER (si à côté)
        if (!playerInfos.onShip) {
            if (batType.skills.includes('prefab') && bat.apLeft >= 5) {
                let isLoaded = checkCharged(bat,'load');
                let isCharged = checkCharged(bat,'trans');
                if (!isLoaded && !isCharged) {
                    if (near.lander) {
                        decButHere = true;
                        let apCost = Math.round(6*batType.fabTime/30);
                        $('#unitInfos').append('<hr>');
                        $('#unitInfos').append('<button type="button" title="Déconstruire (mettre dans le lander)" class="boutonMarine iconButtons" onclick="autoDeconstruction('+bat.id+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'&nbsp; Déconstruction</span></button>');
                    }
                }
            }
        }
        // RECONSTRUIRE
        refabInfos(bat,batType);
    }
    // CONSTRUCTION TRICHE
    if (batType.skills.includes('triche')) {
        $('#unitInfos').append('<button type="button" title="Construction (Triche)" class="boutonGris iconButtons" onclick="bfconst(`all`,true,false,false)"><i class="fas fa-drafting-compass"></i>&nbsp; Construction</button>');
    }
};
