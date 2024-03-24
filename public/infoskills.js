function skillsInfos(bat,batType,near,nearby,selfMove) {
    let skillMessage;
    let numTargets = 0;
    let apCost;
    let apReq;
    let balise;
    let boutonNope;
    let colorNope = 'gf';
    let prodOK = true;
    let craftsOK = true;
    if (playerInfos.crafts >= playerInfos.stCrafts && playerInfos.onShip) {
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
    let zeroCrew = true;
    if (selfMove || playerInfos.pseudo === 'Mapedit') {
        zeroCrew = false;
    }
    // console.log('inMelee='+inMelee);
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
            let deployOK = true;
            if (batType.cat === 'buildings' || batType.cat === 'devices') {
                if (bat.soins != undefined) {
                    if (bat.soins >= 20) {
                        deployOK = false;
                    }
                }
            }
            if (batType.cat === 'vehicles') {
                if (bat.soins != undefined) {
                    if (bat.soins >= 30) {
                        deployOK = false;
                    }
                }
            }
            if (enoughRes && deployInfo[0] && deployInfo[1] && deployInfo[2] && bat.eq != 'camkit' && bat.eq != 'taserkit' && bat.type != 'Chercheurs' && !bat.tags.includes('dying') && deployOK) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Charger le bataillon dans le lander" class="boutonMarine bigButtons" onclick="batDeploy('+bat.id+')"><i class="fas fa-sign-in-alt"></i></button>&nbsp; Déployer</h4></span>');
            } else {
                if (bat.eq === 'camkit' || bat.eq === 'taserkit') {
                    skillMessage = "Les unités ayant le CamKit ou le TaserKit deviennent des policiers et restent donc dans la station";
                } else if (bat.type === 'Chercheurs') {
                    skillMessage = "Les Chercheurs ne peuvent pas être déployés";
                } else if (bat.tags.includes('dying')) {
                    skillMessage = "Ce bataillon est trop faible pour être déployé";
                } else if (!deployOK) {
                    skillMessage = "Ce bataillon est trop endommagé pour être déployé";
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
    if (playerInfos.onShip && batType.skills.includes('transorbital') && batType.name != 'Soute' && inSoute && playerInfos.missionZone >= 1) {
        let deployCosts = calcLanderDeploy(batType,false);
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
            let landerTypeOK = true;
            if (playerInfos.missionZone >= 50) {
                if (!batType.skills.includes('rescue')) {
                    landerTypeOK = false;
                }
            }
            if (enoughRes && batSoins < 30 && landerTypeOK) {
                $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Inclure ce lander dans la prochaine mission '+costString+'" class="boutonRouge bigButtons" onclick="landerDeploy('+bat.id+')"><i class="fas fa-plane-departure"></i></button>&nbsp; Déployer</h4></span>');
            } else {
                if (!landerTypeOK) {
                    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="La zone de destination choisie ne peut être atteinte qu\'avec une navette de secours" class="boutonGrey bigButtons gf"><i class="fas fa-plane-departure"></i></button>&nbsp; Déployer</h4></span>');
                } else if (batSoins >= 30) {
                    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Lander trop endommagé, ne peut pas partir" class="boutonGrey bigButtons gf"><i class="fas fa-plane-departure"></i></button>&nbsp; Déployer</h4></span>');
                } else {
                    $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ressources insuffisantes pour inclure ce lander dans la prochaine mission '+costString+'" class="boutonGrey bigButtons gf"><i class="fas fa-plane-departure"></i></button>&nbsp; Déployer</h4></span>');
                }
            }
            $('#unitInfos').append('<span class="blockTitle"><h3><button type="button" title="Ce lander ne sera pas inclu dans la prochaine mission" class="boutonOK bigButtons gf"><i class="fas fa-bed"></i></button>&nbsp; Rester</h3></span>');
        } else {
            $('#unitInfos').append('<span class="blockTitle"><h3><button type="button" title="Ce lander sera inclu dans la prochaine mission" class="boutonOK bigButtons gf"><i class="fas fa-plane-departure"></i></button>&nbsp; Déployé</h3></span>');
            $('#unitInfos').append('<span class="blockTitle"><h4><button type="button" title="Ne pas inclure ce lander dans la prochaine mission" class="boutonRouge bigButtons" onclick="landerUnDeploy('+bat.id+')"><i class="fas fa-bed"></i></button>&nbsp; Rester</h4></span>');
        }
    }
    let lineBreak = false;
    // LIGNE 1 -----------------------------------------------------------------------------------------------------------------------------------
    $('#unitInfos').append('<span id="line-defense"></span>');
    lineBreak = false;
    // GUET
    if (batType.weapon.rof >= 1 && bat.ap >= 1 && !batType.skills.includes('noguet') && (hasW1 || hasW2) && !playerInfos.onShip && !zeroCrew) {
        balise = 'h4';
        boutonNope = 'boutonGrey';
        colorNope = 'gf';
        if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || hasEquip(bat,['detector','g2ai']) || batType.skills.includes('initiative') || batType.skills.includes('after')) {
            balise = 'h3';
            boutonNope = 'boutonOK';
            colorNope = 'cy';
        }
        let okTrain = true;
        let defComp = playerInfos.comp.def;
        if (batType.skills.includes('robot') && noEquip(bat,['g2ai'])) {
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
        if (tile.infra != undefined) {
            if (tile.infra === 'Palissades' || tile.infra === 'Remparts' || tile.infra === 'Murailles' || tile.infra === 'Miradors') {
                apReq = Math.ceil(apReq/2);
                apCost = Math.ceil(apCost/2);
            }
        }
        if (apReq < 1) {
            apReq = 1;
        }
        apReqGuet = apReq;
        let bouton = 'boutonBrun';
        let colorBof = 'colBut';
        if (bat.tags.includes('mining')) {
            bouton = 'boutonGrey';
            colorBof = 'gf';
        }
        if ((bat.apLeft >= apReq || bat.apLeft >= bat.ap-2) && !bat.tags.includes('guet') && !batType.skills.includes('sentinelle') && noEquip(bat,['detector','g2ai']) && !batType.skills.includes('initiative') && !batType.skills.includes('after')) {
            // assez d'ap
            $('#unitInfos').append('<button type="button" title="Faire le guet ('+apReq+' PA requis)" class="'+bouton+' unitButtons '+colorBof+'" onclick="guet()"><i class="fas fa-binoculars"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        } else {
            if (batType.skills.includes('sentinelle') || hasEquip(bat,['detector','g2ai']) || batType.skills.includes('initiative') || batType.skills.includes('after')) {
                skillMessage = "Sentinelle";
            } else {
                skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
            }
            // pas assez d'ap
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-binoculars"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        }
    }
    let camChance = calcCamo(bat);
    // FORTIFICATION
    if (batType.skills.includes('fortif') && !playerInfos.onShip && !zeroCrew && ((tile.terrain != 'W' && tile.terrain != 'L' && tile.terrain != 'R') || tile.rd)) {
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
        if (batType.skills.includes('robot') && noEquip(bat,['g2ai'])) {
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
        if (tile.infra != undefined) {
            if (tile.infra === 'Palissades' || tile.infra === 'Remparts' || tile.infra === 'Murailles' || tile.infra === 'Miradors') {
                apReq = Math.ceil(apReq/2);
                apCost = Math.ceil(apCost/2);
            }
        }
        if (apReq < Math.round(bat.ap/2)) {
            apReq = Math.round(bat.ap/2);
        }
        if (apReq < apReqGuet) {
            apReq = apReqGuet;
        }
        if (playerInfos.pseudo === 'Mapedit') {
            apCost = 0;
            apReq = 0;
        }
        let bouton = 'boutonBrun';
        let colorBof = 'colBut';
        if (bat.tags.includes('mining')) {
            bouton = 'boutonGrey';
            colorBof = 'gf';
        }
        let camInfo = '';
        if (bat.fuzz <= -2 && bat.tags.includes('camo')) {
            let camoStay = camChance+5;
            if (tile.infra === undefined) {
                let camoMove = checkCamoMove(bat,batType,5);
                if (camoStay > 100) {camoStay = 100;}
                if (!camoMove) {
                    camoStay = 0;
                }
            } else {
                camoStay = 100;
            }
            if (camoStay >= 100) {
                camInfo = ' &#127807; '+camoStay+'% de rester furtif';
            } else if (camoStay >= 1) {
                camInfo = ' &#127807; '+camoStay+'% de rester furtif';
            } else {
                camInfo = ' &#128683; '+camoStay+'% de rester furtif';
            }
        }
        if ((bat.apLeft >= apReq || bat.apLeft >= bat.ap-2) && !bat.tags.includes('fortif') && (!nearby.oneTile || playerInfos.pseudo === 'Mapedit')) {
            $('#unitInfos').append('<button type="button" title="Se fortifier ('+apReq+' PA requis)'+camInfo+'" class="'+bouton+' unitButtons '+colorBof+'" onclick="fortification('+apCost+')"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        } else {
            if (nearby.oneTile) {
                skillMessage = "Vous ne pouvez pas vous fortifier en mêlée";
            } else {
                skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-shield-alt"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        }
    }
    // CAMOUFLAGE
    let camoufOK = true;
    if (!playerInfos.onShip && !zeroCrew) {
        if (canCamo(bat,batType,tile,near)) {
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
            } else if (batType.cat == 'vehicles' || batType.skills.includes('machine') || batType.cat == 'devices') {
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
                    if (hasEquip(bat,['kit-chouf'])) {
                        apCost = Math.floor(batType.ap/2.5);
                        apReq = 2;
                    } else if (hasEquip(bat,['kit-guetteur','kit-milice','kit-sentinelle','e-camo'])) {
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
                    if (playerInfos.comp.cam >= 2) {
                        apReq = apReq-1;
                    }
                }
            }
            if (batType.skills.includes('fastcam') && apReq > 1) {
                apReq = 1;
            }
            if (batType.skills.includes('fastcam') && apCost > 2) {
                apCost = Math.ceil(apCost/1.5);
            }
            let inFog = false;
            if (foggedTiles.includes(tile.id)) {
                if (bat.tags.includes('fogged')) {
                    inFog = true;
                }
            }
            if (inFog || near.fog) {
                apReq = 0;
                apCost = Math.ceil(apCost/2);
                if (apCost > 3) {
                    apCost = 3;
                }
                camoufOK = true;
            }
            // let camChance = calcCamo(bat);
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
            if (bat.apLeft >= apReq && bat.fuzz >= -1 && camoufOK && camChance >= 1) {
                $('#unitInfos').append('<button type="button" title="Mode furtif ('+apReq+' PA requis) '+camChance+'%" class="'+bouton+' unitButtons" onclick="camouflage('+apCost+')"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else if (bat.fuzz <= -2) {
                if (bat.tags.includes('nomove')) {
                    $('#unitInfos').append('<button type="button" title="" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>');
                } else {
                    $('#unitInfos').append('<button type="button" title="Sortir du mode furtif" class="'+boutonNope+' unitButtons '+colorNope+'" onclick="camoOut()"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>');
                }
                lineBreak = true;
            } else {
                if (!camoufOK) {
                    skillMessage = "Mode furtif: Impossible en mêlée";
                } else if (camChance < 1) {
                    skillMessage = "Mode furtif: Impossible ici (chance "+camChance+"%)";
                } else {
                    skillMessage = "Mode furtif: Pas assez de PA (réserve de "+apReq+" requise)";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGris unitButtons '+colorNope+'"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
            if (bat.tags.includes('camo') && bat.fuzz >= -1 && !bat.tags.includes('nomove')) {
                $('#unitInfos').append('<button type="button" title="Sortir du mode furtif" class="boutonGrisBis unitButtons" onclick="camoOut()"><i class="fas fa-shoe-prints"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        } else if (bat.fuzz <= -2 && batType.fuzz > -2) {
            $('#unitInfos').append('<button type="button" title="Sortir du mode furtif" class="boutonOK unitButtons cy" onclick="camoOut()"><i class="ra ra-grass rpg"></i> <span class="small">'+apCost+'</span></button>');
        }
    }
    // PASSAGE SECRET
    if (batType.size <= 9 && batType.cat === 'infantry' && !batType.skills.includes('moto') && !zeroCrew) {
        if (tile.infra === 'Terriers') {
            let secretPass = checkSecretPass(bat);
            if (secretPass.ok) {
                apReq = 2;
                if (playerInfos.comp.cam >= 1) {
                    apReq = apReq-1-Math.floor(playerInfos.comp.cam/2);
                }
                apCost = secretPass.ap;
                if (bat.apLeft >= apReq) {
                    $('#unitInfos').append('<button type="button" title="Passage secret (aller au terrier marqué)" class="boutonRose unitButtons" onclick="goSecretPass()"><i class="fas fa-door-open"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                } else {
                    skillMessage = "Passage secret: Pas assez de PA";
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-door-open"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                }
            } else {
                $('#unitInfos').append('<button type="button" title="Passage secret (marquez un autre Terrier proche pour y accéder)" class="boutonGris unitButtons"><i class="fas fa-door-open"></i></button>');
                lineBreak = true;
            }
        }
    }
    // EMBARQUER
    if (!playerInfos.onShip) {
        let jumpTransId = checkHopTransId(bat,batType);
        if (jumpTransId >= 0) {
            let jumpTransBat = getBatById(jumpTransId);
            let jumpTransBatType = getBatType(jumpTransBat);
            let jtbPrint = getUnitPrintName(jumpTransBatType,true);
            let jumpIcon = 'fas fa-warehouse';
            if (jumpTransBatType.cat === 'vehicles') {
                jumpIcon = 'fas fa-truck';
            }
            if (jumpTransBatType.skills.includes('transorbital')) {
                jumpIcon = 'fas fa-space-shuttle';
            }
            let anybody = anybodyHere(jumpTransBat);
            if (anybody || !zeroCrew) {
                $('#unitInfos').append('<button type="button" title="Embarquer dans: '+jumpTransBat.type+'" class="boutonMarine unitButtons" onclick="jumpInTrans()"><i class="'+jumpIcon+'"></i> <span class="small">'+jtbPrint+'</span></button>');
                lineBreak = true;
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
            $('#unitInfos').append('<button type="button" title="Envoyer le fog" class="boutonRose unitButtons" onclick="fogStart()"><i class="fas fa-cloud"></i> <span class="small">0</span></button>');
            lineBreak = true;
        } else {
            $('#unitInfos').append('<button type="button" title="Arrêter le fog" class="'+boutonNope+' unitButtons '+colorNope+'" onclick="fogStop()"><i class="fas fa-cloud"></i> <span class="small">0</span></button>');
            lineBreak = true;
        }
    }
    // MARQUEUR
    if (!playerInfos.onShip) {
        if (playerInfos.showedTiles.includes(tile.id)) {
            $('#unitInfos').append('<button type="button" title="Effacer le marqueur de la carte" class="boutonGrisBis unitButtonsSmall" onclick="toggleMark('+tile.id+',true,'+bat.id+')"><i class="fas fa-eraser"></i></button>');
            lineBreak = true;
        } else {
            $('#unitInfos').append('<button type="button" title="Mettre un marqueur sur la carte" class="boutonGrisBis unitButtonsSmall" onclick="toggleMark('+tile.id+',true,'+bat.id+')"><i class="fas fa-map-pin"></i></button>');
            lineBreak = true;
        }
    }
    // SHOWCASE
    if (!playerInfos.onShip) {
        if (bat.type != playerInfos.showcaseBT) {
            $('#unitInfos').append('<button type="button" title="Mettre en valeur tous les bataillons de ce type ('+bat.type+')" class="boutonGrisBis unitButtonsSmall ncy" onclick="showcaseThis('+batType.id+')"><i class="fas fa-lightbulb"></i></button>');
            lineBreak = true;
        }
        if (batType.skills.includes('worker') && playerInfos.showcaseBT != 'PRFB') {
            $('#unitInfos').append('<button type="button" title="Mettre en valeur tous les bâtiments préfabriqués" class="boutonGrisBis unitButtonsSmall ncy" onclick="showcasePrefab()"><i class="fas fa-building"></i></button>');
            lineBreak = true;
        }
    }
    // LIGNE 2 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-defense').append('<br>');
    }
    $('#unitInfos').append('<span id="line-fight"></span>');
    lineBreak = false;
    // EMBUSCADE
    if (batType.skills.includes('embuscade') && !playerInfos.onShip && !bat.tags.includes('datt') && !zeroCrew) {
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
            $('#unitInfos').append('<button type="button" title="Embuscade (Initiative + Cadence de tir x2)" class="boutonJaune unitButtons" onclick="ambush('+apCost+')"><i class="ra ra-hood rpg"></i> <span class="small">'+apCost+'</span>');
            lineBreak = true;
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
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="ra ra-hood rpg"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        }
    }
    // LUCKY SHOT
    if (batType.skills.includes('luckyshot') && !playerInfos.onShip && !zeroCrew) {
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
            $('#unitInfos').append('<button type="button" title="Lucky shot automatique sur cette attaque" class="boutonJaune unitButtons" onclick="luckyShot()"><i class="fas fa-dice-six"></i> <span class="small">0</span></button>');
            lineBreak = true;
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
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-dice-six"></i> <span class="small">0</span></button>');
            lineBreak = true;
        }
    }
    // // INSTAKILL
    // if (bat.tags.includes('hero') && (batType.skills.includes('herokill') || batType.skills.includes('herominik')) && !bat.tags.includes('nokill') && batHasTarget && !playerInfos.onShip && !zeroCrew) {
    //     $('#unitInfos').append('<button type="button" title="Instakill: Uniquement avec une arme de précision!" class="boutonJaune unitButtons" onclick="instaKill()"><i class="fas fa-skull-crossbones"></i> <span class="small">0</span></button>');
    //     lineBreak = true;
    // }
    // BRAVOURE
    if (bat.tags.includes('hero') && batType.skills.includes('herosalvo') && !bat.tags.includes('nofougue') && batHasTarget && !playerInfos.onShip && !zeroCrew) {
        $('#unitInfos').append('<button type="button" title="Bravoure: Une salve supplémentaire" class="boutonVert unitButtons" onclick="fougue()"><i class="ra ra-player-teleport rpg"></i> <span class="small">0</span></button>');
        lineBreak = true;
    }
    // TORNADE
    if (bat.tags.includes('hero') && batType.skills.includes('herotornade') && !bat.tags.includes('notorn') && batHasTarget && !playerInfos.onShip && !zeroCrew) {
        $('#unitInfos').append('<button type="button" title="Tornade: Salves infinies" class="boutonJaune unitButtons" onclick="tornade()"><i class="ra ra-player-teleport rpg"></i> <span class="small">0</span></button>');
        lineBreak = true;
    }
    // RAGE
    let rageOK = false;
    if (bat.tags.includes('hero') && batType.skills.includes('herorage')) {
        rageOK = true;
    }
    if (batType.skills.includes('rage')) {
        rageOK = true;
    }
    if (rageOK && !bat.tags.includes('norage') && !playerInfos.onShip && !zeroCrew) {
        $('#unitInfos').append('<button type="button" title="Rage: Bonus de puissance aux armes de mêlée" class="boutonJaune unitButtons" onclick="rage()"><i class="ra ra-muscle-up rpg"></i> <span class="small">0</span></button>');
        lineBreak = true;
    }
    // DIVERSION
    if (bat.tags.includes('hero') && batType.skills.includes('herolasso') && !bat.tags.includes('lasso') && !playerInfos.onShip && !zeroCrew) {
        $('#unitInfos').append('<button type="button" title="Diversion: Attire tous aliens dans un rayon de 5 cases" class="boutonJaune unitButtons" onclick="diversion()"><i class="ra ra-aware rpg"></i> <span class="small">2</span></button>');
        lineBreak = true;
    }
    // TAMING
    if (!playerInfos.onShip && !bat.tags.includes('tame') && !zeroCrew) {
        if (((bat.tags.includes('hero') || bat.tags.includes('schef')) && batType.skills.includes('herotame')) || batType.skills.includes('taming')) {
            let tamingId = getTamingId(bat,batType);
            if (tamingId >= 0) {
                $('#unitInfos').append('<button type="button" title="Apprivoiser les Meatballs" class="boutonJaune unitButtons" onclick="taming('+tamingId+')"><i class="fas fa-dog"></i> <span class="small">20</span></button>');
                lineBreak = true;
            }
        }
    }
    // LIGNE 3 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-fight').append('<br>');
    }
    $('#unitInfos').append('<span id="line-medic"></span>');
    lineBreak = false;
    if (!playerInfos.onShip && !zeroCrew) {
        let baseskillCost;
        // MEDIC IN BLD
        let canBeMedBld = checkMedBld(bat,batType);
        if (canBeMedBld) {
            let medicBat = bestMedicInBld(bat);
            let medicBatType = getBatType(medicBat);
            // console.log(medicBat);
            if (Object.keys(medicBat).length >= 1) {
                numTargets = numMedicTargets(medicBat,'infantry',true,true,bat);
                baseskillCost = calcBaseSkillCost(medicBat,medicBatType,'medic',true,bat);
                apCost = numTargets*(baseskillCost+medicBatType.squads-medicBat.squadsLeft);
                if (apCost === 0) {apCost = baseskillCost;}
                if (numTargets >= 1) {
                    let skillText = 'Soigner les infanteries adjacentes';
                    if (batType.skills.includes('inmed')) {
                        skillText = 'Soigner les infanteries dans le véhicule';
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillText+' avec '+medicBat.type+'" class="boutonBleu unitButtons" onclick="medic(`infantry`,'+baseskillCost+',true,true,true,'+medicBat.id+')"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                } else {
                    skillMessage = "Aucune infanterie adjacente n'a pas subit de dégâts";
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                }
            }
        }
        // MEDIC
        let myMedicSkill = checkMedicSkill(bat,batType);
        let fullStarka = getStarkaIntox(bat);
        if (myMedicSkill === 'medic') {
            numTargets = numMedicTargets(bat,'infantry',true,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'medic',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,true);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !fullStarka && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Soigner les infanteries adjacentes" class="boutonBleu unitButtons" onclick="medic(`infantry`,'+baseskillCost+',true,true)"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
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
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // BAD MEDIC
        if (myMedicSkill === 'badmedic') {
            numTargets = numMedicTargets(bat,'infantry',true,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'medic',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,true);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !fullStarka && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Donner les premiers soins aux infanteries adjacentes" class="boutonBleu unitButtons" onclick="medic(`infantry`,'+baseskillCost+',true,false)"><i class="fas fa-band-aid"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
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
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-band-aid"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // SELF MEDIC
        if (myMedicSkill === 'selfmedic') {
            numTargets = numMedicTargets(bat,'infantry',false,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'medic',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,true);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !fullStarka && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Se soigner" class="boutonBleu unitButtons" onclick="medic(`infantry`,'+baseskillCost+',false,true)"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
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
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-heart"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // FIRST AID (SELF BAD MEDIC)
        if (myMedicSkill === 'selfbadmedic') {
            numTargets = numMedicTargets(bat,'infantry',false,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'medic',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,true);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !fullStarka && (!inMelee || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Premiers soins" class="boutonBleu unitButtons" onclick="medic(`infantry`,'+baseskillCost+',false,false)"><i class="fas fa-band-aid"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
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
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-band-aid"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // MECANO IN BLD
        if (batType.cat === 'buildings' || batType.skills.includes('transorbital')) {
            let medicBat = bestMecanoInBld(bat);
            let medicBatType = getBatType(medicBat);
            // console.log(medicBat);
            if (Object.keys(medicBat).length >= 1) {
                numTargets = numMedicTargets(medicBat,'vehicles',true,true,bat);
                baseskillCost = calcBaseSkillCost(medicBat,medicBatType,'mecano',true,bat);
                apCost = numTargets*(baseskillCost+medicBatType.squads-medicBat.squadsLeft);
                if (apCost === 0) {apCost = baseskillCost;}
                if (numTargets >= 1) {
                    $('#unitInfos').append('<button type="button" title="Réparer les véhicules adjacents avec '+medicBat.type+'" class="boutonBleu unitButtons" onclick="medic(`vehicles`,'+baseskillCost+',true,true,true,'+medicBat.id+')"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                } else {
                    skillMessage = "Aucun véhicule adjacent n'a pas subit de dégâts";
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                }
            }
        }
        // MECANO
        let myMecanoSkill = checkMecanoSkill(bat,batType);
        if (myMecanoSkill === 'mecano') {
            numTargets = numMedicTargets(bat,'vehicles',true,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'mecano',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,false);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!nearby.oneTile || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Réparer les véhicules adjacents" class="boutonBleu unitButtons" onclick="medic(`vehicles`,'+baseskillCost+',true,true)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else {
                if (nearby.oneTile) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    if (numTargets < 1) {
                        skillMessage = "Aucun véhicule adjacent n'a pas subit de dégâts";
                    } else {
                        skillMessage = "Pas assez de PA";
                    }
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // BAD MECANO
        if (myMecanoSkill === 'badmecano') {
            numTargets = numMedicTargets(bat,'vehicles',true,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'mecano',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,false);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!nearby.oneTile || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Rafistoler les véhicules adjacents" class="boutonBleu unitButtons" onclick="medic(`vehicles`,'+baseskillCost+',true,false)"><i class="fas fa-oil-can"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else {
                if (nearby.oneTile) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    if (numTargets < 1) {
                        skillMessage = "Aucun véhicule adjacent n'a pas subit de dégâts";
                    } else {
                        skillMessage = "Pas assez de PA";
                    }
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-oil-can"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // SELF BAD MECANO
        if (myMecanoSkill === 'selfbadmecano') {
            numTargets = numMedicTargets(bat,'vehicles',false,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'mecano',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,false);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!nearby.oneTile || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Retaper le véhicule" class="boutonBleu unitButtons" onclick="medic(`vehicles`,'+baseskillCost+',false,false)"><i class="fas fa-oil-can"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else {
                if (batType.squads > bat.squadsLeft) {
                    skillMessage = "Ce véhicule a subit trop de dégâts";
                } else if (numTargets <= 0) {
                    skillMessage = "Ce véhicule n'a pas subit de dégâts";
                } else if (nearby.oneTile) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-oil-can"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // SELF MECANO
        if (myMecanoSkill === 'selfmecano') {
            numTargets = numMedicTargets(bat,'vehicles',false,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'mecano',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,false);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && (!nearby.oneTile || batType.skills.includes('meleehelp'))) {
                $('#unitInfos').append('<button type="button" title="Retaper le véhicule" class="boutonBleu unitButtons" onclick="medic(`vehicles`,'+baseskillCost+',false,true)"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else {
                if (numTargets <= 0) {
                    skillMessage = "Ce véhicule n'a pas subit de dégâts";
                } else if (nearby.oneTile) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // REPAIR
        if (batType.skills.includes('repair')) {
            numTargets = numMedicTargets(bat,'buildings',true,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'repair',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,false);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !nearby.oneTile) {
                $('#unitInfos').append('<button type="button" title="Réparer les bâtiments adjacents" class="boutonBleu unitButtons" onclick="medic(`buildings`,'+baseskillCost+',true,true)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else {
                if (nearby.oneTile) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    if (numTargets < 1) {
                        skillMessage = "Aucun bâtiment adjacent n'a pas subit de dégâts";
                    } else {
                        skillMessage = "Pas assez de PA";
                    }
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // SELF BAD REPAIR
        if (batType.skills.includes('selfbadrepair')) {
            numTargets = numMedicTargets(bat,'buildings',false,false,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'repair',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,false);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !nearby.oneTile) {
                $('#unitInfos').append('<button type="button" title="Rafistoler le bâtiment" class="boutonBleu unitButtons" onclick="medic(`buildings`,'+baseskillCost+',false,false)"><i class="fas fa-paint-roller"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else {
                if (batType.squads > bat.squadsLeft) {
                    skillMessage = "Ce bâtiment a subit trop de dégâts";
                } else if (numTargets <= 0) {
                    skillMessage = "Ce bâtiment n'a pas subit de dégâts";
                } else if (nearby.oneTile) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-paint-roller"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // SELF REPAIR
        if (batType.skills.includes('selfrepair')) {
            numTargets = numMedicTargets(bat,'buildings',false,true,bat);
            baseskillCost = calcBaseSkillCost(bat,batType,'repair',false);
            // apCost = numTargets*(baseskillCost+batType.squads-bat.squadsLeft);
            apCost = calcAdjSkillCost(numTargets,baseskillCost,batType,bat,false);
            if (apCost === 0) {apCost = baseskillCost;}
            if (bat.apLeft >= baseskillCost/2 && numTargets >= 1 && !nearby.oneTile) {
                $('#unitInfos').append('<button type="button" title="Réparer le bâtiment" class="boutonBleu unitButtons" onclick="medic(`buildings`,'+baseskillCost+',false,true)"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else {
                if (numTargets <= 0) {
                    skillMessage = "Ce bâtiment n'a pas subit de dégâts";
                } else if (nearby.oneTile) {
                    skillMessage = "Pas de réparations en mêlée";
                } else {
                    skillMessage = "Pas assez de PA";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // REPAIR DIAG
        if ((batType.cat === 'buildings' || batType.cat === 'devices' || batType.skills.includes('transorbital')) && !batType.skills.includes('nobld') && !batType.skills.includes('norepair') && (bat.damage >= 1 || bat.squadsLeft < batType.squads) && !nearby.oneTile) {
            let repairBat = checkRepairBat(bat.tileId);
            if (Object.keys(repairBat).length >= 1) {
                let repairBatType = getBatType(repairBat);
                batRepairCost = calcBaseSkillCost(repairBat,repairBatType,'repair',false);
                if (batRepairCost < 2) {batRepairCost = 2;}
                apCost = 0;
                if (repairBat.apLeft >= 1) {
                    $('#unitInfos').append('<button type="button" title="Réparer le bâtiment avec '+repairBat.type+' ('+batRepairCost+' AP)" class="boutonBleu unitButtons" onclick="diagRepair('+repairBat.id+')"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                } else {
                    skillMessage = "Pas assez de PA";
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fa fa-hammer"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                }
            }
        }
    }
    // NETTOYAGE
    if ((batType.skills.includes('cleaning') || (hasEquip(bat,['e-mecano']) && !batType.skills.includes('fly')) || (batType.cat === 'buildings' && batType.crew >= 1)) && !playerInfos.onShip && !zeroCrew) {
        let numWeb = checkWeb(bat,batType);
        if (numWeb >= 1) {
            apCost = checkCleaningCost(bat,batType);
            if (tile.web && !batType.skills.includes('fly')) {
                numWeb++;
            }
            apFullCost = apCost*numWeb;
            apReq = Math.ceil(apFullCost/6);
            apReq = entre(apReq,2,10);
            if (bat.apLeft >= apReq && !inMelee) {
                $('#unitInfos').append('<button type="button" title="Nettoyer: Détruire les toiles, moisissures et ectoplasmes" class="boutonGris unitButtons" onclick="removeWeb('+apCost+')"><i class="fas fa-broom"></i> <span class="small">'+apFullCost+'</span></button>');
                lineBreak = true;
            } else {
                if (inMelee) {
                    skillMessage = "Nettoyer: Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Nettoyer: Pas assez de PA (réserve de "+apReq+" requise)";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-broom"></i> <span class="small">'+apFullCost+'</span></button>');
                lineBreak = true;
            }
        }
    }
    // DEPRESSION
    if (playerInfos.onShip && !zeroCrew) {
        if (souteTab === 'hop') {
            if (bat.emo >= 5) {
                let drug = getDrugByName('pills');
                let pillsCosts = getPillsCosts(bat,batType);
                let pillsOK = checkCost(pillsCosts);
                if (pillsOK && !bat.tags.includes('pills')) {
                    $('#unitInfos').append('<button type="button" title="'+drug.info+' '+displayCosts(pillsCosts)+'" class="boutonVert unitButtons" onclick="pills()"><i class="'+drug.icon+'"></i></button>');
                    if (souteTab === 'hop') {
                        $('#unitInfos').append('<button type="button" title="Anti-dépressifs: Traiter tous les bataillons qui ont au moins '+bat.emo+' en stress. &#10071;Attention à vos ressources." class="boutonVert unitButtons" onclick="pillsGalore('+bat.emo+')"><i class="'+drug.icon+'"></i>&nbsp;<span class="small">Stress '+bat.emo+'+</span></button>');
                    }
                    lineBreak = true;
                } else {
                    if (bat.tags.includes('pills')) {
                        skillMessage = 'Déjà sous anti-dépresseurs';
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonOK unitButtons cy"><i class="'+drug.icon+'"></i> <span class="small">0</span></button>');
                        lineBreak = true;
                    } else {
                        skillMessage = 'Traitement: Ressources insuffisantes '+displayCosts(pillsCosts);
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="'+drug.icon+'"></i> <span class="small">0</span></button>');
                        lineBreak = true;
                    }
                }
            }
        }
    }
    // ENTRETIEN
    if (playerInfos.onShip && !zeroCrew) {
        if (bat.soins >= 11) {
            if (batType.cat === 'vehicles' || batType.cat === 'buildings' || batType.cat === 'devices') {
                let apLoss = checkVehiclesAPSoins(bat,batType);
                let maintCosts = getMaintenanceCosts(bat,batType);
                let maintOK = checkCost(maintCosts);
                if (maintOK && craftsOK) {
                    $('#unitInfos').append('<button type="button" title="Entretien '+displayCosts(maintCosts)+'" class="boutonOrange unitButtons" onclick="maintenance()"><i class="fa fa-wrench"></i> <span class="small">0</span></button>');
                    lineBreak = true;
                } else {
                    if (!craftsOK) {
                        skillMessage = "Entretien: Vous avez atteint votre maximum de crafts";
                    } else {
                        skillMessage = 'Entretien: Ressources insuffisantes '+displayCosts(maintCosts);
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fa fa-wrench"></i> <span class="small">0</span></button>');
                    lineBreak = true;
                }
            }
        }
    }
    if (!playerInfos.onShip && !zeroCrew) {
        if (bat.soins >= 11 && bat.damage === 0 && bat.squadsLeft >= batType.squads && bat.apLeft > 0) {
            if (batType.cat === 'vehicles' || batType.cat === 'buildings' || batType.cat === 'devices') {
                if (checkNearConstructor(bat)) {
                    let apLoss = checkVehiclesAPSoins(bat,batType);
                    let maintCosts = getMaintenanceCosts(bat,batType);
                    let maintOK = checkCost(maintCosts);
                    apCost = bat.ap*2;
                    if (maintOK) {
                        $('#unitInfos').append('<button type="button" title="Entretien '+displayCosts(maintCosts)+'" class="boutonOrange unitButtons" onclick="maintenanceInZone()"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
                    } else {
                        $('#unitInfos').append('<button type="button" title="Entretien: Ressources insuffisantes '+displayCosts(maintCosts)+'" class="boutonGrey unitButtons gf"><i class="fa fa-wrench"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
                    }
                }
            }
        }
    }
    // LIGNE 4 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-medic').append('<br>');
    }
    $('#unitInfos').append('<span id="line-moves"></span>');
    lineBreak = false;
    // TAKE CONTROL OF OUTSIDERS
    if (batType.skills.includes('takeout')) {
        let nevMove = false;
        if (zone[0].neverMove != undefined) {
            if (zone[0].neverMove) {
                nevMove = true;
            }
        }
        if (!nevMove && !bat.tags.includes('takeout') && !bat.tags.includes('nomove')) {
            $('#unitInfos').append('<button type="button" title="Prendre le contrôle des résistants" class="boutonRouge unitButtons" onclick="goTakeOut()"><i class="ra ra-ringing-bell rpg"></i> <span class="small">5</span></button>');
            lineBreak = true;
        }
    }
    // COMMANDE
    if (!batType.skills.includes('dome') && !batType.skills.includes('pilone') && !batType.skills.includes('cfo') && !zeroCrew) {
        let commandOK = false;
        // console.log('COMMAND');
        // console.log(near);
        if (!playerInfos.onShip && near.schef) {
            if (!batType.skills.includes('brigands') && (!bat.tags.includes('outsider') || batType.kind === 'zero-resistance') && (!bat.tags.includes('schef') || batType.skills.includes('superberserk')) && !batType.skills.includes('leader') && !batType.skills.includes('prayer')) {
                if (batType.skills.includes('robot') || batType.crew >= 1) {
                    commandOK = true;
                }
            }
        }
        // console.log('commandOK: '+commandOK);
        if (commandOK && !bat.tags.includes('gogogo')) {
            let leSousChef = checkCommand(bat);
            // console.log(leSousChef);
            if (leSousChef.ok) {
                $('#unitInfos').append('<button type="button" title="Commande: +'+leSousChef.pa+' PA (-1 PA pour le bataillon de '+leSousChef.bat.type+')" class="boutonVert unitButtons" onclick="goCommand('+leSousChef.bat.id+','+leSousChef.pa+')"><i class="far fa-hand-point-right"></i> <span class="small">0</span></button>');
                lineBreak = true;
            }
        }
    }
    // PRIERE
    if (batType.skills.includes('prayer') && !playerInfos.onShip && !zeroCrew) {
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
            $('#unitInfos').append('<button type="button" title="Prière: +3 PA à tous les bataillons du Brasier (et +1 PA chaque tour pendant x tours)" class="boutonVert unitButtons" onclick="gloireASatan()"><i class="fas fa-hamsa"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
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
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-hamsa"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        }
    }
    // TREUIL
    if (!playerInfos.onShip && bat.apLeft < 5 && !bat.tags.includes('construction') && !zeroCrew) {
        if (batType.cat === 'vehicles' && batType.moveCost < 90 && !batType.skills.includes('cyber') && !batType.skills.includes('robot') && !batType.skills.includes('fly')) {
            let leTreuil = checkTreuil(bat);
            if (leTreuil.ok) {
                $('#unitInfos').append('<button type="button" title="Treuil: +'+leTreuil.pa+' PA (-4 PA pour le bataillon de '+leTreuil.bat.type+')" class="boutonVert unitButtons" onclick="goTreuil('+leTreuil.bat.id+','+leTreuil.pa+')"><i class="fas fa-anchor"></i> <span class="small">0</span></button>');
                lineBreak = true;
            }
        }
    }
    // RUSH
    if (bat.tags.includes('hero') && batType.skills.includes('herorush') && !bat.tags.includes('rush') && !playerInfos.onShip && !zeroCrew) {
        let rushAP = bat.ap;
        if (bat.apLeft < 0) {
            rushAP = bat.ap-Math.round(bat.apLeft/2);
        }
        $('#unitInfos').append('<button type="button" title="Rush: +'+rushAP+' PA" class="boutonVert unitButtons" onclick="rush('+rushAP+')"><i class="fas fa-running"></i> <span class="small">0</span></button>');
        lineBreak = true;
    }
    // LIGNE 5 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-moves').append('<br>');
    }
    $('#unitInfos').append('<span id="line-drugs"></span>');
    lineBreak = false;
    // DROGUES
    if (!playerInfos.onShip && !zeroCrew) {
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
                    if (drugCompOK || bat.tags.includes(drug.name)) {
                        if (!bat.tags.includes('starka') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK && starkaPA >= 1) {
                            $('#unitInfos').append('<button type="button" title="Starka: +'+starkaPA+' PA '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`starka`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
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
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
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
                    if (drugCompOK || bat.tags.includes(drug.name)) {
                        if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('kirin') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                            $('#unitInfos').append('<button type="button" title="Kirin: Régénération rapide '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`kirin`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
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
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
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
                if (drugCompOK || bat.tags.includes(drug.name)) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('octiron') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Octiron: +4 PA / protection poisons et maladies / réduit le stress '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`octiron`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                if (drugCompOK || bat.tags.includes(drug.name)) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('moloko') && !bat.tags.includes('bliss') && !batType.skills.includes('nofear') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Moloko: Immunisé à la peur / -2 PA '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`moloko`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                if (drugCompOK || bat.tags.includes(drug.name)) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('bliss') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Bliss: Dégâts reçus réduits / immunisé à la peur / réduit le stress / -1 PA '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`bliss`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                if (drugCompOK || bat.tags.includes(drug.name)) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('sila') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Sila: +3 puissance aux armes de mêlée '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`sila`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                if (drugCompOK || bat.tags.includes(drug.name)) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('skupiac') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Skupiac: +6 précision / +3 défense / guérit les maladies '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`skupiac`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                if (drugCompOK || bat.tags.includes(drug.name)) {
                    if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('blaze') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                        $('#unitInfos').append('<button type="button" title="Blaze: +3 PA & +1 salve '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`blaze`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
                    }
                }
            }
        }
        if (batType.cat != 'infantry' || batType.skills.includes('oknitro')) {
            // NITRO
            if (!bat.tags.includes('construction') && batType.moveCost < 90 && !batType.skills.includes('nonitro')) {
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
                        if (drugCompOK || bat.tags.includes(drug.name)) {
                            let nitroPA = getNitroBonus(bat);
                            if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('nitro') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                                $('#unitInfos').append('<button type="button" title="Nitro: +'+nitroPA+' PA '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`nitro`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                                lineBreak = true;
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
                                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                                lineBreak = true;
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
                    if (drugCompOK || bat.tags.includes(drug.name)) {
                        if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('sudu') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                            $('#unitInfos').append('<button type="button" title="Sudu: Vitesse 115% '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`sudu`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
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
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
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
                    if (drugCompOK || bat.tags.includes(drug.name)) {
                        if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('octiron') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                            $('#unitInfos').append('<button type="button" title="Octiron: +4 PA / réduit le stress '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`octiron`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
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
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
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
                        if (drugCompOK || bat.tags.includes(drug.name)) {
                            if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('moloko') && !bat.tags.includes('bliss') && !batType.skills.includes('nofear') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                                $('#unitInfos').append('<button type="button" title="Moloko: Immunisé à la peur / -2 PA '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`moloko`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                                lineBreak = true;
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
                                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                                lineBreak = true;
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
                    if (drugCompOK || bat.tags.includes(drug.name)) {
                        if ((bat.apLeft >= apCost || apCost <= 0) && !bat.tags.includes('bliss') && drugCompOK && drugBldOK && drugBldVMOK && drugCostsOK) {
                            $('#unitInfos').append('<button type="button" title="Bliss: Immunisé à la peur / réduit le stress / -1 PA '+displayCosts(drug.costs)+'" class="boutonVert unitButtons" onclick="goDrug('+apCost+',`bliss`)"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
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
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="'+drug.icon+'"></i> <span class="small">'+apCost+'</span></button>');
                            lineBreak = true;
                        }
                    }
                }
            }
        }
    }
    // DOXEY
    if (!playerInfos.onShip && near.doxey && batType.cat === 'infantry' && !batType.skills.includes('clone') && !zeroCrew) {
        $('#unitInfos').append('<button type="button" title="Elixir du docteur Doxey" class="boutonVert unitButtons" onclick="goDoxey()"><i class="ra ra-flask rpg"></i> <span class="small">0</span></button>');
        lineBreak = true;
    }
    // GENMOD
    if (playerInfos.onShip && inSoute && playerInfos.comp.gen >= 1 && playerInfos.bldList.includes('Laboratoire')) {
        let modDone = true;
        if (!bat.tags.includes('genwater') && !bat.tags.includes('genblind') && !bat.tags.includes('genslow') && !bat.tags.includes('genreg') && !bat.tags.includes('genred') && !bat.tags.includes('genstrong') && !bat.tags.includes('genfast') && !bat.tags.includes('genko') && !bat.tags.includes('genimmune') && !bat.tags.includes('genweak')) {
            modDone = false;
        }
        let typeOK = false;
        if (batType.cat === 'infantry' && !batType.skills.includes('clone') && !batType.skills.includes('cyber') && !batType.skills.includes('mutant') && !batType.skills.includes('dog')) {
            typeOK = true;
        }
        let riskOK = false;
        if (!batType.skills.includes('nogen') && !batType.skills.includes('recupcit')) {
            if (bat.vet <= 2 || batType.skills.includes('penitbat')) {
                if (bat.id % 3 === 0) {
                    riskOK = true;
                }
            }
            if (batType.kind === 'drogmulojs') {
                riskOK = true;
            }
            if (playerInfos.gang === 'brasier') {
                if (batType.name === 'Tôlards') {
                    riskOK = true;
                } else {
                    riskOK = false;
                }
            }
        }
        let genModCosts = getGenModCost(batType);
        let genCostOK = checkCost(genModCosts);
        let goodChance = getGenModChance();
        if (!modDone && typeOK && riskOK && genCostOK) {
            $('#unitInfos').append('<button type="button" title="Essayer une modification génétique avec de l\'ADN alien: '+goodChance+'% de réussite (irréversible!) '+displayCosts(genModCosts)+'" class="boutonRouge unitButtons" onclick="doGenMod()"><i class="ra ra-burst-blob rpg"></i> <span class="small">'+goodChance+'%</span></button>');
            lineBreak = true;
        } else {
            boutonNope = 'boutonGrey';
            colorNope = 'gf';
            if (modDone || batType.skills.includes('mutant') || batType.name === 'Klogs' || batType.name === 'Mongrels') {
                skillMessage = 'Modification génétique: Déjà effectuée';
                boutonNope = 'boutonOK';
                colorNope = 'cy';
            } else if (!typeOK) {
                skillMessage = 'Modification génétique: Impossible sur ce bataillon';
            } else if (!riskOK) {
                skillMessage = 'Modification génétique: Ils ne sont pas très chauds...';
            } else if (!genCostOK) {
                skillMessage = 'Modification génétique: Ressources insuffisantes '+displayCosts(genModCosts);
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="ra ra-burst-blob rpg"></i> <span class="small">'+goodChance+'%</span></button>');
            lineBreak = true;
        }
    }
    // LIGNE 6 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-drugs').append('<br>');
    }
    $('#unitInfos').append('<span id="line-mine"></span>');
    lineBreak = false;
    // EXTRACTION
    if (batType.skills.includes('extraction') && !playerInfos.onShip && !zeroCrew) {
        let extractOK = false;
        if (bat.extracted != undefined) {
            if (bat.extracted.length >= 1) {
                extractOK = true;
            }
        }
        if (!extractOK) {
            if (bat.tags.includes('mining')) {
                tagDelete(bat,'mining');
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
        if (!bat.tags.includes('mining') && !inMelee && extractOK) {
            $('#unitInfos').append('<button type="button" title="Extraction: Extraire les ressources" class="boutonCaca unitButtons" onclick="extraction('+apCost+')"><i class="far fa-gem"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Extraction: Choisir les ressources" class="boutonCaca unitButtons" onclick="chooseRes(false)"><i class="fas fa-list"></i></button>');
            lineBreak = true;
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
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="far fa-gem"></i> <span class="small">'+apCost+'</span></button><button type="button" title="Extraction: Choisir les ressources" class="boutonCaca unitButtons" onclick="chooseRes(false)"><i class="fas fa-list"></i></button>');
            lineBreak = true;
        }
    }
    // CRISTAUX
    if (batType.skills.includes('extraction') && batType.cat != 'buildings' && !inMelee && !playerInfos.onShip && !zeroCrew) {
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
                        $('#unitInfos').append('<button type="button" title="Récupérer la Morphite (Efficacité '+morphRate+'%)" class="boutonCaca unitButtons" onclick="getMorphite('+apCost+')"><i class="ra ra-gem rpg"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
                    } else {
                        $('#unitInfos').append('<button type="button" title="Récupérer la Morphite: Pas assez de PA (7 requis)" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="ra ra-gem rpg"></i> <span class="small">'+apCost+'</span></button>');
                        lineBreak = true;
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
        $('#unitInfos').append('<button type="button" title="Production activée: Coûts: '+upkeepCosts+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-industry"></i> <span class="small">'+apCost+'</span></button>');
        lineBreak = true;
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
                    if (hasEquip(bat,['g2cryo'])) {
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
                $('#unitInfos').append('<button type="button" title="Lancer la production '+theProd+' / Coûts: '+upkeepCosts+'" class="boutonGrisBis unitButtons" onclick="prodToggle()"><i class="fas fa-industry"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else {
                $('#unitInfos').append('<button type="button" title="Arrêter la production '+theProd+' / Coûts: '+upkeepCosts+'" class="'+boutonNope+' unitButtons '+colorNope+'" onclick="prodToggle()"><i class="fas fa-industry"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
    }
    // LIGNE 7 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-mine').append('<br>');
    }
    $('#unitInfos').append('<span id="line-drops"></span>');
    lineBreak = false;
    let trapType;
    let trapCostOK;
    if (!playerInfos.onShip && !zeroCrew) {
        // POSE PIEGES
        if (batType.skills.includes('trapfosse')) {
            trapType = getBatTypeByName('Fosses');
            freeConsTile = checkFreeConsTile(bat,trapType);
            if (freeConsTile) {
                let compReqOK = checkUnitCompReq(trapType);
                if (compReqOK) {
                    let minesLeft = calcPutLeft(bat);
                    balise = 'h4';
                    boutonNope = 'boutonGrey';
                    colorNope = 'gf';
                    if (Object.keys(conselUnit).length >= 1) {
                        balise = 'h3';
                        boutonNope = 'boutonOK';
                        colorNope = 'cy';
                    }
                    trapCostOK = checkCost(trapType.costs);
                    apCost = clicPutCost(batType,trapType,false,false);
                    apReq = Math.round(apCost/1.5);
                    if (apReq > bat.ap/1.25) {apReq = Math.round(bat.ap/1.25);}
                    if (minesLeft >= 1 && bat.apLeft >= apReq && !nearby.oneTile && trapCostOK) {
                        $('#unitInfos').append('<button type="button" title="Déposer des pièges '+displayCosts(trapType.costs)+'" class="boutonGris unitButtons" onclick="dropStuff('+apCost+',`trap-fosse`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Fosses</span></button>');
                        lineBreak = true;
                    } else {
                        if (minesLeft <= 0) {
                            skillMessage = "Plus de pièges";
                        } else if (!trapCostOK) {
                            skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                        } else if (nearby.oneTile) {
                            skillMessage = "Ne peut pas se faire en mêlée";
                        } else {
                            skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Fosses</span></button>');
                        lineBreak = true;
                    }
                }
            }
        }
        if (batType.skills.includes('trapap') || bat.eq === 'kit-sentinelle') {
            trapType = getBatTypeByName('Pièges');
            freeConsTile = checkFreeConsTile(bat,trapType);
            if (freeConsTile) {
                let compReqOK = checkUnitCompReq(trapType);
                if (compReqOK) {
                    let minesLeft = calcPutLeft(bat);
                    balise = 'h4';
                    boutonNope = 'boutonGrey';
                    colorNope = 'gf';
                    if (Object.keys(conselUnit).length >= 1) {
                        balise = 'h3';
                        boutonNope = 'boutonOK';
                        colorNope = 'cy';
                    }
                    trapCostOK = checkCost(trapType.costs);
                    apCost = clicPutCost(batType,trapType,false,false);
                    apReq = Math.round(apCost/1.5);
                    if (apReq > bat.ap/1.25) {apReq = Math.round(bat.ap/1.25);}
                    if (minesLeft >= 1 && bat.apLeft >= apReq && !inMelee && trapCostOK) {
                        $('#unitInfos').append('<button type="button" title="Déposer des pièges '+displayCosts(trapType.costs)+'" class="boutonGrisBis unitButtons" onclick="dropStuff('+apCost+',`trap-ap`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Pièges</span></button>');
                        lineBreak = true;
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
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Pièges</span></button>');
                        lineBreak = true;
                    }
                }
            }
        }
        if (batType.skills.includes('trapdard') && playerInfos.comp.exo >= 3 && playerInfos.comp.ca >= 3) {
            trapType = getBatTypeByName('Dardières');
            freeConsTile = checkFreeConsTile(bat,trapType);
            if (freeConsTile) {
                let compReqOK = checkUnitCompReq(trapType);
                if (compReqOK) {
                    let minesLeft = calcPutLeft(bat);
                    balise = 'h4';
                    boutonNope = 'boutonGrey';
                    colorNope = 'gf';
                    if (Object.keys(conselUnit).length >= 1) {
                        balise = 'h3';
                        boutonNope = 'boutonOK';
                        colorNope = 'cy';
                    }
                    trapCostOK = checkCost(trapType.costs);
                    apCost = clicPutCost(batType,trapType,false,false);
                    apReq = Math.round(apCost/1.5);
                    if (apReq > bat.ap/1.25) {apReq = Math.round(bat.ap/1.25);}
                    if (minesLeft >= 1 && bat.apLeft >= apReq && !inMelee && trapCostOK) {
                        $('#unitInfos').append('<button type="button" title="Déposer des pièges '+displayCosts(trapType.costs)+'" class="boutonGris unitButtons" onclick="dropStuff('+apCost+',`trap-dard`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Dardières</span></button>');
                        lineBreak = true;
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
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Dardières</span></button>');
                        lineBreak = true;
                    }
                }
            }
        }
        // POSE CHAMP DE MINES
        if (batType.skills.includes('landmine') && playerInfos.comp.explo >= 1) {
            trapType = getBatTypeByName('Mines claymore');
            freeConsTile = checkFreeConsTile(bat,trapType);
            if (freeConsTile) {
                let minesLeft = calcPutLeft(bat);
                console.log('MINES LEFT = '+minesLeft);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                if (trapType.levels[playerInfos.gang] <= playerInfos.gLevel) {
                    trapCostOK = checkCost(trapType.costs);
                    apCost = clicPutCost(batType,trapType,true,false);
                    apReq = Math.round(apCost/1.5);
                    if (apReq > bat.ap/1.25) {apReq = Math.round(bat.ap/1.25);}
                    let uMaxOK = true;
                    let maxInfo = maxUnits(trapType);
                    if (maxInfo.ko) {
                        uMaxOK = false;
                    }
                    if (minesLeft >= 1 && bat.apLeft >= apReq && !nearby.oneTile && trapCostOK && uMaxOK) {
                        $('#unitInfos').append('<button type="button" title="Déposer des Mines Claymore '+displayCosts(trapType.costs)+'" class="boutonGris unitButtons" onclick="dropStuff('+apCost+',`champ`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Mines</span></button>');
                        lineBreak = true;
                    } else {
                        if (!uMaxOK) {
                            skillMessage = "Maximum atteint";
                        } else if (minesLeft <= 0) {
                            skillMessage = "Plus de mines";
                        } else if (!trapCostOK) {
                            skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                        } else if (nearby.oneTile) {
                            skillMessage = "Ne peut pas se faire en mêlée";
                        } else {
                            skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Mines</span></button>');
                        lineBreak = true;
                    }
                }
            }
        }
        // POSE MINES WIPEOUT
        if (batType.skills.includes('landmine') && playerInfos.comp.explo >= 2) {
            trapType = getBatTypeByName('Mines wipeout');
            freeConsTile = checkFreeConsTile(bat,trapType);
            if (freeConsTile) {
                let minesLeft = calcPutLeft(bat);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                if (trapType.levels[playerInfos.gang] <= playerInfos.gLevel) {
                    trapCostOK = checkCost(trapType.costs);
                    apCost = clicPutCost(batType,trapType,true,false);
                    apReq = Math.round(apCost/1.5);
                    if (apReq > bat.ap/1.25) {apReq = Math.round(bat.ap/1.25);}
                    let uMaxOK = true;
                    let maxInfo = maxUnits(trapType);
                    if (maxInfo.ko) {
                        uMaxOK = false;
                    }
                    if (minesLeft >= 1 && bat.apLeft >= apReq && !nearby.oneTile && trapCostOK && uMaxOK) {
                        $('#unitInfos').append('<button type="button" title="Déposer des Mines Wipeout '+displayCosts(trapType.costs)+'" class="boutonGrisBis unitButtons" onclick="dropStuff('+apCost+',`wipe`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Wipeout</span></button>');
                        lineBreak = true;
                    } else {
                        if (!uMaxOK) {
                            skillMessage = "Maximum atteint";
                        } else if (minesLeft <= 0) {
                            skillMessage = "Plus de mines";
                        } else if (!trapCostOK) {
                            skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                        } else if (nearby.oneTile) {
                            skillMessage = "Ne peut pas se faire en mêlée";
                        } else {
                            skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                        }
                        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Wipeout</span></button>');
                        lineBreak = true;
                    }
                }
            }
        }
        // POSE MINES BAYGON
        if ((batType.skills.includes('gasmine') || bat.eq === 'e-gmine') && playerInfos.comp.explo >= 1 && playerInfos.comp.exo >= 2 && playerInfos.comp.ca >= 3) {
            trapType = getBatTypeByName('Mines baygon');
            freeConsTile = checkFreeConsTile(bat,trapType);
            if (freeConsTile) {
                let compReqOK = checkUnitCompReq(trapType);
                if (compReqOK) {
                    let minesLeft = calcPutLeft(bat);
                    balise = 'h4';
                    boutonNope = 'boutonGrey';
                    colorNope = 'gf';
                    if (Object.keys(conselUnit).length >= 1) {
                        balise = 'h3';
                        boutonNope = 'boutonOK';
                        colorNope = 'cy';
                    }
                    if (trapType.levels[playerInfos.gang] <= playerInfos.gLevel) {
                        trapCostOK = checkCost(trapType.costs);
                        apCost = clicPutCost(batType,trapType,false,true);
                        apReq = Math.round(apCost/1.5);
                        if (apReq > bat.ap/1.25) {apReq = Math.round(bat.ap/1.25);}
                        let uMaxOK = true;
                        let maxInfo = maxUnits(trapType);
                        if (maxInfo.ko) {
                            uMaxOK = false;
                        }
                        if (minesLeft >= 1 && bat.apLeft >= apReq && !nearby.oneTile && trapCostOK && uMaxOK) {
                            $('#unitInfos').append('<button type="button" title="Déposer des Mines Baygon '+displayCosts(trapType.costs)+'" class="boutonGris unitButtons" onclick="dropStuff('+apCost+',`bay`)"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Baygon</span></button>');
                            lineBreak = true;
                        } else {
                            if (!uMaxOK) {
                                skillMessage = "Maximum atteint";
                            } else if (minesLeft <= 0) {
                                skillMessage = "Plus de mines";
                            } else if (!trapCostOK) {
                                skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                            } else if (nearby.oneTile) {
                                skillMessage = "Ne peut pas se faire en mêlée";
                            } else {
                                skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                            }
                            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-coins"></i> <span class="small">'+apCost+'&nbsp; Baygon</span></button>');
                            lineBreak = true;
                        }
                    }
                }
            }
        }
        // POSE DYNAMITE
        if (batType.skills.includes('dynamite')) {
            trapType = getBatTypeByName('Explosifs');
            freeConsTile = checkFreeConsTile(bat,trapType);
            if (freeConsTile) {
                let minesLeft = calcPutLeft(bat);
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                trapCostOK = checkCost(trapType.costs);
                apCost = clicPutCost(batType,trapType,true);
                apReq = Math.round(apCost/1.5);
                if (apReq > bat.ap/1.25) {apReq = Math.round(bat.ap/1.25);}
                if (minesLeft >= 1 && bat.apLeft >= apReq && !nearby.oneTile && trapCostOK) {
                    $('#unitInfos').append('<button type="button" title="Déposer des explosifs '+displayCosts(trapType.costs)+'" class="boutonGrisBis unitButtons" onclick="dropStuff('+apCost+',`dynamite`)"><i class="ra ra-bomb-explosion rpg"></i> <span class="small">'+apCost+'&nbsp; Explosifs</span></button>');
                    lineBreak = true;
                } else {
                    if (minesLeft <= 0) {
                        skillMessage = "Plus de mines";
                    } else if (!trapCostOK) {
                        skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                    } else if (nearby.oneTile) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="ra ra-bomb-explosion rpg"></i> <span class="small">'+apCost+'&nbsp; Explosifs</span></button>');
                    lineBreak = true;
                }
            }
        }
        // POSE COFFRES
        if (batType.skills.includes('conscont')) {
            trapType = getBatTypeByName('Coffres');
            freeConsTile = checkFreeConsTile(bat,trapType);
            if (freeConsTile) {
                balise = 'h4';
                boutonNope = 'boutonGrey';
                colorNope = 'gf';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                    boutonNope = 'boutonOK';
                    colorNope = 'cy';
                }
                trapCostOK = checkCost(trapType.costs);
                apCost = 8;
                apReq = Math.ceil(batType.ap/2);
                if (bat.apLeft >= apReq && !nearby.oneTile && trapCostOK) {
                    $('#unitInfos').append('<button type="button" title="Construire des coffres '+displayCosts(trapType.costs)+'" class="boutonGrisBis unitButtons" onclick="dropStuff('+apCost+',`coffre`)"><i class="fas fa-box-open"></i> <span class="small">'+apCost+'&nbsp; Coffres</span></button>');
                    lineBreak = true;
                } else {
                    if (!trapCostOK) {
                        skillMessage = 'Vous n\'avez pas les ressources '+displayCosts(trapType.costs);
                    } else if (nearby.oneTile) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="'+boutonNope+' unitButtons '+colorNope+'"><i class="fas fa-box-open"></i> <span class="small">'+apCost+'&nbsp; Coffres</span></button>');
                    lineBreak = true;
                }
            }
        }
        // POSE BARBELES
        if (batType.skills.includes('barbs')) {
            freeConsTile = checkFreeConsTile(bat,trapType,true);
            if (freeConsTile) {
                let barbLeft = calcPutLeft(bat);
                balise = 'h4';
                if (Object.keys(conselUnit).length >= 1) {
                    balise = 'h3';
                }
                apCost = Math.ceil(batType.mecanoCost/4);
                let apCost2 = Math.ceil(batType.mecanoCost/1.5);
                apReq = Math.ceil(batType.mecanoCost/4);
                if (barbLeft >= 1 && bat.apLeft >= apReq && !inMelee) {
                    $('#unitInfos').append('<span id="barbButtons"></span>');
                    $('#barbButtons').empty();
                    let barbType = getBatTypeByName('Barbelés (scrap)');
                    let barbCostOK = checkCost(barbType.costs);
                    if (barbCostOK) {
                        $('#barbButtons').append('<button type="button" title="Déposer des barbelés (scrap) '+displayCosts(barbType.costs)+'" class="boutonGrisBis unitButtons" onclick="dropStuff('+apCost+',`barb-scrap`)"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Scrap</span></button>');
                        lineBreak = true;
                    } else {
                        skillMessage = "Pas assez de ressources "+displayCosts(barbType.costs);
                        $('#barbButtons').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Scrap</span></button>');
                        lineBreak = true;
                    }
                    barbType = getBatTypeByName('Barbelés');
                    barbCostOK = checkCost(barbType.costs);
                    if (barbCostOK) {
                        $('#barbButtons').append('<button type="button" title="Déposer des barbelés (acier) '+displayCosts(barbType.costs)+'" class="boutonGris unitButtons" onclick="dropStuff('+apCost+',`barb-fer`)"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Acier</span></button>');
                        lineBreak = true;
                    } else {
                        skillMessage = "Pas assez de ressources "+displayCosts(barbType.costs);
                        $('#barbButtons').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Acier</span></button>');
                        lineBreak = true;
                    }
                    barbType = getBatTypeByName('Barbelés (taser)');
                    barbCostOK = checkCost(barbType.costs);
                    if (barbCostOK && playerInfos.bldList.includes('Générateur')) {
                        $('#barbButtons').append('<button type="button" title="Déposer des barbelés (taser) '+displayCosts(barbType.costs)+'" class="boutonGrisBis unitButtons" onclick="dropStuff('+apCost2+',`barb-taser`)"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Taser</span></button>');
                        lineBreak = true;
                    } else {
                        if (!playerInfos.bldList.includes('Générateur')) {
                            skillMessage = "Vous avez besoin de Générateurs";
                        } else {
                            skillMessage = "Pas assez de ressources "+displayCosts(barbType.costs);
                        }
                        $('#barbButtons').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">Taser</span></button>');
                        lineBreak = true;
                    }
                } else {
                    if (barbLeft <= 0) {
                        skillMessage = "Plus de barbelés";
                    } else if (inMelee) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="ra ra-crown-of-thorns rpg"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                }
            }
        }
    }
    // LIGNE 8 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-drops').append('<br>');
    }
    $('#unitInfos').append('<span id="line-roads"></span>');
    lineBreak = false;
    // ROUTES / PONTS
    if ((batType.skills.includes('routes') || hasEquip(bat,['e-road'])) && !playerInfos.onShip && !zeroCrew) {
        let roadsOK = true;
        if (batType.skills.includes('infrahelp') || batType.skills.includes('roadhelp') || hasEquip(bat,['e-infra'])) {
            roadsOK = checkRoadsAround(bat);
        }
        if (!tile.rd || !roadsOK) {
            apCost = getRoadAPCost(bat,batType,tile,false);
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
            if (bat.apLeft >= apReq && !nearby.oneTile && roadCostsOK && workForceOK) {
                if (batType.moveCost < 90) {
                    $('#unitInfos').append('<button type="button" title="Construction ('+roadName+') '+displayCosts(roadCosts)+'" class="boutonGris unitButtons" onclick="putRoad('+apCost+')"><i class="fas fa-road"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                } else {
                    $('#unitInfos').append('<button type="button" title="Construction ('+roadName+') '+displayCosts(roadCosts)+'" class="boutonGris unitButtons" onclick="putRoad('+apCost+')"><i class="fas fa-road"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                }
            } else {
                if (nearby.oneTile) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                } else if (!roadCostsOK) {
                    skillMessage = "Pas assez de ressources "+displayCosts(roadCosts);
                } else if (!workForceOK) {
                    skillMessage = "Pas de citoyens pour faire la route (vous devez amener un bataillon à côté)";
                } else {
                    skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-road"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            }
        }
        // AUTOROAD
        if (batType.moveCost < 90) {
            let roadCosts = getRoadCosts(tile);
            let roadCostsOK = checkCost(roadCosts);
            if (bat.tags.includes('autoroad')) {
                if (nearby.oneTile) {
                    tagDelete(bat,'autoroad');
                }
            }
            if (roadCostsOK && !nearby.oneTile) {
                if (bat.tags.includes('autoroad')) {
                    $('#unitInfos').append('<button type="button" title="Stopper la construction automatique de routes" class="boutonOK unitButtons cy" onclick="toggleAutoRoad('+apCost+',true)"><i class="fas fa-road"></i> <span class="small">Stop</span></button>');
                    lineBreak = true;
                } else {
                    $('#unitInfos').append('<button type="button" title="Construction automatique de routes" class="boutonNoir unitButtons" onclick="toggleAutoRoad('+apCost+',false)"><i class="fas fa-road"></i> <span class="small">Auto</span></button>');
                    lineBreak = true;
                }
            } else {
                skillMessage = "Pas assez de ressources "+displayCosts(roadCosts);
                if (nearby.oneTile) {
                    skillMessage = "Ne peut pas se faire en mêlée";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-road"></i> <span class="small">Auto</span></button>');
                lineBreak = true;
            }
        }
    }
    // LIGNE 9 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-roads').append('<br>');
    }
    $('#unitInfos').append('<span id="line-infra"></span>');
    lineBreak = false;
    // INFRASTRUCTURE
    if ((batType.skills.includes('infraz') || (batType.skills.includes('infbld') && near.bld) || (batType.skills.includes('mir') && (near.bld || tile.terrain === 'F')) || (batType.skills.includes('pal') && near.bld) || batType.skills.includes('trou') || near.caserne) && !playerInfos.onShip && !zeroCrew) {
        if ((tile.terrain != 'W' || playerInfos.comp.const >= 2 || playerInfos.comp.const+playerInfos.comp.def >= 3) && tile.terrain != 'R' && tile.terrain != 'L') {
            let oneOnly = 'all';
            if (batType.skills.includes('mir') && !near.caserne) {
                oneOnly = 'mir';
            }
            if (batType.skills.includes('pal') && !near.caserne) {
                oneOnly = 'pal';
            }
            if (batType.skills.includes('trou') && !near.caserne) {
                oneOnly = 'trou';
            }
            apReq = getConstAPReq(bat,batType);
            apReq = Math.ceil(apReq/2);
            let infra;
            let infraCostOK;
            let compReqOK;
            let defaultMessage;
            if (bat.apLeft < apReq) {
                defaultMessage = 'Pas assez de PA (réserve de '+apReq+' requise)';
            }
            if (nearby.oneTile) {
                defaultMessage = 'Impossible en mêlée';
            }
            $('#unitInfos').append('<span id="infraButtons"></span>');
            $('#infraButtons').empty();
            if (tile.infra != 'Miradors' && (oneOnly === 'all' || oneOnly === 'mir')) {
                infra = getInfraByName('Miradors');
                let infraInfo = showInfraInfo(infra.name,true,false);
                compReqOK = checkCompReq(infra);
                infraCostOK = checkCost(infra.costs);
                if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def+playerInfos.comp.const) {
                    prodOK = false;
                } else {
                    prodOK = true;
                }
                if (infraCostOK && prodOK && compReqOK && bat.apLeft >= apReq && !nearby.oneTile) {
                    $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+displayCosts(infra.costs)+'" class="boutonGrisBis unitButtonsSmall" onclick="putInfra(`Miradors`)"><span class="small">Mi</span></button>');
                    lineBreak = true;
                } else {
                    if (!compReqOK) {
                        skillMessage = "Compétences insuffisantes";
                    } else if (!prodOK) {
                        skillMessage = "Niveau insuffisant";
                    } else if (!infraCostOK) {
                        skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                    } else {
                        skillMessage = defaultMessage;
                    }
                    $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+skillMessage+'" class="boutonGrey unitButtonsSmall gf"><span class="small">Mi</span></button>');
                    lineBreak = true;
                }
            }
            if (tile.infra != 'Palissades' && (oneOnly === 'all' || oneOnly === 'pal')) {
                infra = getInfraByName('Palissades');
                let infraInfo = showInfraInfo(infra.name,true,false);
                compReqOK = checkCompReq(infra);
                infraCostOK = checkCost(infra.costs);
                if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def+playerInfos.comp.const) {
                    prodOK = false;
                } else {
                    prodOK = true;
                }
                if (infraCostOK && prodOK && compReqOK && bat.apLeft >= apReq && !nearby.oneTile) {
                    $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+displayCosts(infra.costs)+'" class="boutonGris unitButtonsSmall" onclick="putInfra(`Palissades`)"><span class="small">Pa</span></button>');
                    lineBreak = true;
                } else {
                    if (!compReqOK) {
                        skillMessage = "Compétences insuffisantes";
                    } else if (!prodOK) {
                        skillMessage = "Niveau insuffisant";
                    } else if (!infraCostOK) {
                        skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                    } else {
                        skillMessage = defaultMessage;
                    }
                    $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+skillMessage+'" class="boutonGrey unitButtonsSmall gf"><span class="small">Pa</span></button>');
                    lineBreak = true;
                }
            }
            if (tile.infra != 'Remparts' && oneOnly === 'all') {
                infra = getInfraByName('Remparts');
                let infraInfo = showInfraInfo(infra.name,true,false);
                compReqOK = checkCompReq(infra);
                infraCostOK = checkCost(infra.costs);
                if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.const) {
                    prodOK = false;
                } else {
                    prodOK = true;
                }
                if (infraCostOK && prodOK && compReqOK && bat.apLeft >= apReq && !nearby.oneTile) {
                    $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+displayCosts(infra.costs)+'" class="boutonGrisBis unitButtonsSmall" onclick="putInfra(`Remparts`)"><span class="small">Re</span></button>');
                    lineBreak = true;
                } else {
                    if (!compReqOK) {
                        skillMessage = "Compétences insuffisantes";
                    } else if (!prodOK) {
                        skillMessage = "Niveau insuffisant";
                    } else if (!infraCostOK) {
                        skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                    } else {
                        skillMessage = defaultMessage;
                    }
                    $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+skillMessage+'" class="boutonGrey unitButtonsSmall gf"><span class="small">Re</span></button>');
                    lineBreak = true;
                }
            }
            if (tile.infra != 'Murailles' && oneOnly === 'all') {
                infra = getInfraByName('Murailles');
                let infraInfo = showInfraInfo(infra.name,true,false);
                compReqOK = checkCompReq(infra);
                infraCostOK = checkCost(infra.costs);
                if (infra.levels[playerInfos.gang] > playerInfos.gLevel) {
                    prodOK = false;
                } else {
                    prodOK = true;
                }
                if (infraCostOK && prodOK && compReqOK && bat.apLeft >= apReq && !nearby.oneTile) {
                    $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+displayCosts(infra.costs)+'" class="boutonGris unitButtonsSmall" onclick="putInfra(`Murailles`)"><span class="small">Mu</span></button>');
                    lineBreak = true;
                } else {
                    if (!compReqOK) {
                        skillMessage = "Compétences insuffisantes";
                    } else if (!prodOK) {
                        skillMessage = "Niveau insuffisant";
                    } else if (!infraCostOK) {
                        skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                    } else {
                        skillMessage = defaultMessage;
                    }
                    $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+skillMessage+'" class="boutonGrey unitButtonsSmall gf"><span class="small">Mu</span></button>');
                    lineBreak = true;
                }
            }
            if (tile.infra != 'Terriers' && (oneOnly === 'all' || oneOnly === 'trou')) {
                infra = getInfraByName('Terriers');
                let infraInfo = showInfraInfo(infra.name,true,false);
                if (infra.levels[playerInfos.gang] < 90) {
                    infraCostOK = checkCost(infra.costs);
                    compReqOK = checkCompReq(infra);
                    if (infra.levels[playerInfos.gang] > playerInfos.gLevel+playerInfos.comp.def+playerInfos.comp.const) {
                        prodOK = false;
                    } else {
                        prodOK = true;
                    }
                    if (infraCostOK && prodOK && compReqOK && bat.apLeft >= apReq && !nearby.oneTile) {
                        $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+displayCosts(infra.costs)+'" class="boutonGrisBis unitButtonsSmall" onclick="putInfra(`Terriers`)"><span class="small">Te</span></button>');
                        lineBreak = true;
                    } else {
                        if (!compReqOK) {
                            skillMessage = "Compétences insuffisantes";
                        } else if (!prodOK) {
                            skillMessage = "Niveau insuffisant";
                        } else if (!infraCostOK) {
                            skillMessage = "Pas assez de ressources "+displayCosts(infra.costs);
                        } else {
                            skillMessage = defaultMessage;
                        }
                        $('#infraButtons').append('<button type="button" title="'+infraInfo+'\n'+skillMessage+'" class="boutonGrey unitButtonsSmall gf"><span class="small">Te</span></button>');
                        lineBreak = true;
                    }
                }
            }
        }
    }
    // DEMENTELEMENT INFRA
    if (batType.skills.includes('constructeur') && !playerInfos.onShip && !zeroCrew) {
        if (tile.infra != undefined) {
            if (tile.infra === 'Miradors' || tile.infra === 'Palissades' || tile.infra === 'Remparts' || tile.infra === 'Murailles' || tile.infra === 'Terriers') {
                let infra = getInfraByName(tile.infra);
                apCost = Math.round(Math.sqrt(batType.mecanoCost)*infra.fabTime/5.1);
                apReq = getConstAPReq(bat,batType);
                apReq = Math.ceil(apReq/2);
                if (bat.apLeft >= apReq && !nearby.oneTile) {
                    $('#unitInfos').append('<button type="button" title="Démanteler '+tile.infra+'" class="boutonGrisBis unitButtons" onclick="demolition('+apCost+')"><i class="far fa-trash-alt"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                } else {
                    if (nearby.oneTile) {
                        skillMessage = "Ne peut pas se faire en mêlée";
                    } else {
                        skillMessage = "Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="far fa-trash-alt"></i> <span class="small">'+apCost+'</span></button>');
                    lineBreak = true;
                }
            }
        }
    }
    // LIGNE 10 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-infra').append('<br>');
    }
    $('#unitInfos').append('<span id="line-res"></span>');
    lineBreak = false;
    // FOUILLE DE RUINES
    if (!playerInfos.onShip && !zeroCrew) {
        if ((batType.skills.includes('fouille') || (batType.skills.includes('aifouille') && (hasEquip(bat,['g2ai']) || playerInfos.bldList.includes('Centre de com')))) && tile.ruins && tile.sh >= 1 && !bat.tags.includes('nomove')) {
            apReq = Math.round(5*7/(playerInfos.comp.tri+6));
            apCost = Math.round(1250/bat.squadsLeft/batType.squadSize/batType.crew);
            if (batType.skills.includes('scav')) {
                apReq = Math.ceil(apReq/1.75);
                apCost = Math.round(apCost/1.75);
            }
            if (batType.cat === 'infantry') {
                apCost = Math.floor(apCost*batType.ap/bat.ap/1.6);
            }
            if (apCost > batType.ap*1.5) {
                apCost = Math.round(batType.ap*1.5);
            }
            if (bat.apLeft >= apReq && !inMelee) {
                $('#unitInfos').append('<button type="button" title="Fouiller les ruines" class="boutonCaca unitButtons" onclick="searchRuins('+apCost+',-1)"><i class="fas fa-search"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
            } else {
                if (inMelee) {
                    skillMessage = "Fouiller: Ne peut pas se faire en mêlée";
                } else {
                    skillMessage = "Fouiller: Pas assez de PA (réserve de "+apReq+" requise)";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-search"></i> <span class="small">'+apCost+'</span></button>');
                lineBreak = true;
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
            $('#unitInfos').append('<button type="button" title="Charger des ressources" class="boutonCaca unitButtons" onclick="loadRes(false,false)"><i class="fas fa-truck-loading"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        } else {
            if (inMelee) {
                skillMessage = "Chargement: Impossible en mêlée";
            } else {
                skillMessage = "Chargement: Pas assez de PA";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-truck-loading"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        }
    }
    if (!inMelee && !inSoute) {
        if (batType.skills.includes('transport') && !batType.skills.includes('transorbital')) {
            if (bat.transIds.length >= 1) {
                bat.transIds.forEach(function(inBatId) {
                    let inBat = getBatById(inBatId);
                    if (inBat.type === 'Remorques') {
                        $('#unitInfos').append('<button type="button" title="Charger des ressources dans les remorques" class="boutonCaca unitButtons" onclick="loadRes(false,true,'+inBatId+')"><i class="fas fa-dolly-flatbed"></i>&nbsp;</button>');
                        lineBreak = true;
                    }
                });
            }
        }
    }
    // RAVITAILLEMENT DROGUES
    let anyRavit = checkRavitDrug(bat);
    if (anyRavit && bat.tags.includes('dU') && batType.skills.includes('dealer') && !playerInfos.onShip && !zeroCrew) {
        apCost = Math.round(batType.ap/3*7/(playerInfos.comp.log+5));
        if (bat.apLeft >= 2) {
            $('#unitInfos').append('<button type="button" title="Faire le plein de drogues" class="boutonVert unitButtons" onclick="goRavitDrug('+apCost+')"><i class="fas fa-prescription-bottle"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        } else {
            skillMessage = "Faire le plein de drogues: Pas assez de PA";
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-prescription-bottle"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        }
    }
    // RAVITAILLEMENT
    anyRavit = checkRavit(bat);
    let lastRavit = checkLastRavit(bat);
    let ravitInfo = '';
    if (lastRavit.exists) {
        ravitInfo = ' '+bat.rvt+'/'+lastRavit.max;
    }
    // console.log('RAVIT: '+anyRavit);
    if (!lastRavit.ok) {
        skillMessage = "Maximum de ravitaillements atteint";
        $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="ra ra-ammo-bag rpg"></i> <span class="small">0</span></button>');
        lineBreak = true;
    } else if (anyRavit && bat.tags.includes('aU') && !playerInfos.onShip && !zeroCrew) {
        let ravitVolume = calcRavitVolume(bat);
        let ravitFactor = 3;
        if (batType.skills.includes('fly') && !batType.skills.includes('jetpack')) {
            ravitFactor = 1;
        }
        if (hasEquip(bat,['carrousel','carrousel1','carrousel2'])) {
            ravitFactor = ravitFactor*1.5;
        }
        if (playerInfos.comp.log >= 3) {
            ravitFactor = ravitFactor*2;
        }
        apCost = Math.round(Math.sqrt(ravitVolume[1])*batType.ap/ravitFactor*7/(playerInfos.comp.log+5));
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<button type="button" title="Faire le plein de munitions'+ravitInfo+'" class="boutonCaca unitButtons" onclick="goRavit('+apCost+')"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        } else {
            skillMessage = "Ravitaillement: Pas assez de PA";
            $('#unitInfos').append('<button type="button" title="'+skillMessage+ravitInfo+'" class="boutonGrey unitButtons gf"><i class="ra ra-ammo-bag rpg"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        }
    } else if (lastRavit.exists) {
        if (!bat.tags.includes('aU')) {
            skillMessage = "Pas besoin de ravitaillement";
        } else if (!anyRavit) {
            skillMessage = "Pas de ravitaillement disponible";
        } else {
            skillMessage = "Ravitaillement impossible";
        }
        $('#unitInfos').append('<button type="button" title="'+skillMessage+ravitInfo+'" class="boutonGrey unitButtons gf"><i class="ra ra-ammo-bag rpg"></i> <span class="small">0</span></button>');
        lineBreak = true;
    }
    // STOCKS: RAVIT
    let anyStock = checkStock(bat);
    if (anyStock && (bat.tags.includes('sU') || bat.tags.includes('pU')) && !playerInfos.onShip && !zeroCrew) {
        apCost = Math.round(batType.ap*1.5*5/(playerInfos.comp.log+5));
        if (bat.apLeft >= 4) {
            $('#unitInfos').append('<button type="button" title="Faire le plein de ravitaillements" class="boutonCaca unitButtons" onclick="goStock('+apCost+')"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        } else {
            skillMessage = "Réapprovisionnement: Pas assez de PA";
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-cubes"></i> <span class="small">'+apCost+'</span></button>');
            lineBreak = true;
        }
    }
    // LIGNE 11 -----------------------------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-res').append('<br>');
    }
    $('#unitInfos').append('<span id="line-const"></span>');
    lineBreak = false;
    let buttonSize = 'unitButtons';
    let okBuild = true;
    if (batType.name === 'Soute') {
        buttonSize = 'bigButtons';
    } else {
        if (playerInfos.onShip) {
            okBuild = false;
        }
    }
    if (!inSoute && !bat.tags.includes('nomove') && !zeroCrew && okBuild) {
        if (isReloaded || playerInfos.mapTurn != 0 || playerInfos.onShip) {
            // CONSTRUCTION BATIMENTS
            if (batType.skills.includes('constructeur') || batType.skills.includes('producteur')) {
                apReq = getConstAPReq(bat,batType);
                if (bat.apLeft >= apReq && !nearby.oneTile && craftsOK) {
                    if ((batType.skills.includes('constructeur') && batType.skills.includes('producteur')) || batType.skills.includes('transorbital')) {
                        $('#unitInfos').append('<button type="button" title="Production (bâtiments & unités)" class="boutonOrange '+buttonSize+'" onclick="bfconst(`all`,false,``,false)"><i class="fas fa-cogs"></i> <span class="small">'+apReq+'</span></button>');
                    } else if (batType.skills.includes('constructeur')) {
                        $('#unitInfos').append('<button type="button" title="Construction (bâtiments)" class="boutonOrange unitButtons" onclick="bfconst(`buildings`,false,``,false)"><i class="fas fa-cogs"></i> <span class="small">'+apReq+'</span></button>');
                    } else if (batType.skills.includes('producteur')) {
                        $('#unitInfos').append('<button type="button" title="Production (unités)" class="boutonOrange unitButtons" onclick="bfconst(`units`,false,``,false)"><i class="fas fa-cogs"></i> <span class="small">'+apReq+'</span></button>');
                    }
                    lineBreak = true;
                } else {
                    if (nearby.oneTile) {
                        skillMessage = "Construction: Ne peut pas se faire en mêlée";
                    } else if (!craftsOK) {
                        skillMessage = "Construction: Vous avez atteint votre maximum de crafts";
                    } else {
                        skillMessage = "Construction: Pas assez de PA (réserve de "+apReq+" requise)";
                    }
                    $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-cogs"></i> <span class="small">'+apReq+'</span></button>');
                    lineBreak = true;
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
    if (batType.name === 'Soute') {
        equipOK = false;
    }
    if (equipOK && !zeroCrew) {
        apCost = Math.round(batType.ap);
        apReq = getConstAPReq(bat,batType);
        if (batType.skills.includes('clicput')) {
            apCost = 0;
            apReq = 0;
        }
        if ((bat.apLeft >= apReq || playerInfos.onShip) && !inMelee) {
            $('#unitInfos').append('<button type="button" title="Changer de munitions, équipement ou armure ('+apCost+' PA)" class="boutonOrange unitButtons" onclick="reEquip('+bat.id+',false,false)"><i class="fas fa-user-shield"></i> <span class="small">'+apReq+'</span></button>');
            lineBreak = true;
        } else {
            if (inMelee) {
                skillMessage = "Rééquiper: Ne peut pas se faire en mêlée";
            } else {
                skillMessage = "Rééquiper: Pas assez de PA (réserve de "+apReq+" requise)";
            }
            $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-user-shield"></i> <span class="small">'+apReq+'</span></button>');
            lineBreak = true;
        }
    }
    // RESERVE DEPLOY
    if (batType.name === 'Soute' && playerInfos.onShip && inSoute) {
        if (Object.keys(playerInfos.deployRes).length >= 1) {
            $('#unitInfos').append('<button type="button" title="Utiliser la réserve de ressources pour le déploiement" class="boutonMarine bigButtons" onclick="useDeployRes()"><i class="fas fa-piggy-bank"></i> <i class="fas fa-sign-out-alt"></i></button>');
        } else {
            $('#unitInfos').append('<button type="button" title="Sauvegarder une réserve de ressources pour le déploiement" class="boutonCaca bigButtons" onclick="saveDeployRes()"><i class="fas fa-piggy-bank"></i> <i class="fas fa-sign-in-alt"></i></button>');
        }
        lineBreak = true;
    }
    // EQUIPAGE
    if (bat.tags.includes('nopilots')) {
        let neededCits = batType.squads*batType.squadSize*batType.crew;
        if (playerInfos.onShip) {
            if (inSoute) {
                let dispoCit = getDispoCit();
                if (dispoCit >= neededCits) {
                    $('#unitInfos').append('<button type="button" title="Assigner un équipage ('+neededCits+' citoyens)" class="boutonOrange unitButtons" onclick="putCrew()"><i class="fas fa-users"></i> <span class="small">5</span></button>');
                    lineBreak = true;
                }
            }
        } else if (near.lander && !batType.skills.includes('transorbital')) {
            let dispoCit = getDispoCit();
            if (dispoCit >= neededCits) {
                $('#unitInfos').append('<button type="button" title="Assigner un équipage ('+neededCits+' citoyens)" class="boutonOrange unitButtons" onclick="putCrew()"><i class="fas fa-users"></i> <span class="small">5</span></button>');
                lineBreak = true;
            }
        } else if (!batType.skills.includes('transorbital')) {
            let enoughCits = checkTransToCrew(bat,batType);
            if (enoughCits) {
                $('#unitInfos').append('<button type="button" title="Assigner comme équipage '+neededCits+' citoyens transportés" class="boutonOrange unitButtons" onclick="putTransToCrew()"><i class="fas fa-users"></i> <span class="small">5</span></button>');
                lineBreak = true;
            }
        }
    }
    // TILE AMMO PACKS
    if (!zeroCrew) {
        if (tile.ap != undefined) {
            if (!bat.tags.includes('nomove')) {
                if (!playerInfos.packs.includes(tile.id)) {
                    playerInfos.packs.push(tile.id);
                }
            }
        }
    }
    allPacks(bat,batType);
    if (playerInfos.onShip) {
        // UPGRADE INFANTRY
        if (batType.skills.includes('uprank') && !zeroCrew && inSoute) {
            let isInPlace = checkUprankPlace(bat,batType);
            let isXPok = checkUprankXP(bat,batType);
            let upBatType = getBatTypeByName(batType.unitUp);
            apReq = 5;
            if (bat.apLeft >= apReq && !nearby.oneTile && (isInPlace || inSoute) && isXPok && craftsOK) {
                $('#unitInfos').append('<button type="button" title="Transformer en '+batType.unitUp+'" class="boutonGris unitButtons" onclick="bfconst(`buildings`,false,`inf`,false)"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
                lineBreak = true;
            } else {
                if (nearby.oneTile) {
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
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
                lineBreak = true;
            }
        }
        // UPGRADE BUILDING
        if (batType.skills.includes('upgrade') && !zeroCrew) {
            let isCharged = checkCharged(bat,'trans');
            apReq = 5;
            if (bat.apLeft >= apReq && !nearby.oneTile && !isCharged && craftsOK && inSoute) {
                if (batType.bldUp.length === 1) {
                    $('#unitInfos').append('<button type="button" title="Transformer en '+batType.bldUp[0]+'" class="boutonGris unitButtons" onclick="bfconst(`buildings`,false,`bld`,false)"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
                    lineBreak = true;
                } else {
                    $('#unitInfos').append('<button type="button" title="Transformer en '+batType.bldUp[0]+' ou '+batType.bldUp[1]+'" class="boutonGris unitButtons" onclick="bfconst(`buildings`,false,`bld`,false)"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
                    lineBreak = true;
                }
            } else if (!inSoute) {
                $('#unitInfos').append('<button type="button" title="Transformer en '+batType.bldUp[0]+': Aller dans la soute" class="boutonGris unitButtons" onclick="goSoute()"><i class="fas fa-recycle"></i></button>');
                lineBreak = true;
            } else {
                if (nearby.oneTile) {
                    skillMessage = "Transformation: Ne peut pas se faire en mêlée";
                } else if (!craftsOK) {
                    skillMessage = "Transformation: Vous avez atteint votre maximum de crafts";
                } else if (isCharged) {
                    skillMessage = "Transformation: Vous devez vider votre bataillon avant de le transformer";
                } else {
                    skillMessage = "Transformation: Pas assez de PA (réserve de "+apReq+" requise)";
                }
                $('#unitInfos').append('<button type="button" title="'+skillMessage+'" class="boutonGrey unitButtons gf"><i class="fas fa-recycle"></i> <span class="small">'+apReq+'</span></button>');
                lineBreak = true;
            }
        }
    }
    // RE-SORT
    if (!playerInfos.onShip) {
        if (bat.sort >= 1000) {
            let placeInSuperList = 2001-bat.sort;
            $('#unitInfos').append('<button type="button" title="Ce bataillon est le bataillon n°'+placeInSuperList+' dans la liste (ceci prévaut sur le numéro d\'armée)" class="boutonGrey unitButtons cy"><i class="far fa-list-alt"></i> <span class="small">'+placeInSuperList+'</span></button>');
            $('#unitInfos').append('<button type="button" title="Retourner ce bataillon à sa place de départ dans la liste (en fonction du numéro d\'armée)" class="boutonGris unitButtons" onclick="outSuperList()"><i class="fas fa-step-backward"></i></button>');
            $('#unitInfos').append('<button type="button" title="Retourner TOUS les bataillons à leurs places de départ dans la liste (en fonction du numéro d\'armée)" class="boutonGrisBis unitButtons" onclick="killSuperList()"><i class="fas fa-fast-backward"></i></button>');
        } else {
            $('#unitInfos').append('<button type="button" title="Ce bataillon devient le bataillon suivant de la liste (ceci prévaut sur le numéro d\'armée)" class="boutonGris unitButtons" onclick="inSuperList()"><i class="far fa-list-alt"></i></button>');
        }
    }
    lineBreak = true;
    // LIGNE FINALE ---------------------------------------------------------------------------------------------------------------
    if (lineBreak) {
        $('#line-const').append('<br>');
    }
    let unloadOK = false;
    if (!inSoute && batType.name != 'Soute') {
        unloadOK = true;
        // if (playerInfos.onShip || playerInfos.mapTurn >= 1) {
        // }
    }
    // DEBARQUER
    if (unloadOK) {
        $('#unitInfos').append('<a name="letransport"></a>');
        unloadInfos(bat,batType);
        if (playerInfos.onShip || playerInfos.mapTurn >= 1) {
            // DECONSTRUIRE VERS LANDER (si à côté)
            if (!playerInfos.onShip) {
                if (batType.skills.includes('prefab') && bat.apLeft >= 1 && !bat.tags.includes('noprefab')) {
                    let isLoaded = checkCharged(bat,'load');
                    let isCharged = checkCharged(bat,'trans');
                    if (!isLoaded && !isCharged) {
                        if (near.lander) {
                            let landerBat = findTheLander(true);
                            let prefabSizeOK = checkPrefabSize(bat,batType,landerBat);
                            if (prefabSizeOK) {
                                decButHere = true;
                                apCost = Math.round(6*batType.fabTime/30);
                                $('#unitInfos').append('<hr>');
                                $('#unitInfos').append('<button type="button" title="Déconstruire (mettre dans le lander)" class="boutonRouge unitButtons" onclick="autoDeconstruction('+bat.id+')"><i class="fas fa-shapes"></i> <span class="small">'+apCost+'&nbsp; Déconstruction</span></button>');
                            }
                        }
                    }
                }
            }
        }
        // RECONSTRUIRE
        if (!playerInfos.onShip) {
            refabInfos(bat,batType);
        }
    }
    // CONSTRUCTION TRICHE
    if (batType.skills.includes('triche')) {
        $('#unitInfos').append('<button type="button" title="Construction (Triche)" class="boutonGris unitButtons" onclick="bfconst(`all`,true,``,false)"><i class="fas fa-drafting-compass"></i>&nbsp; Construction</button>');
    }
};
