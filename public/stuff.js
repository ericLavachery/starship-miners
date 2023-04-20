function canIHit(bat,weap,alien,batInMelee) {
    let iCanHit = false;
    let alienType = getBatType(alien);
    let guideTarget = checkGuidage(weap,alien);
    let inRange = isInRange(bat,alien.tileId,weap,alien);
    let realmOK = checkFlyTarget(weap,alien,alienType);
    let hiddenOK = checkInvisibleTarget(bat,weap,alien,alienType,guideTarget);

    return iCanHit;
};

function calcBatFuzz(bat) {
    let batFuzz = bat.fuzz+2;
    if (bat.fuzz === undefined) {
        batFuzz = 4;
        bat.fuzz = 1.5;
    }
    if (bat.eq === 'w2-lcomet') {
        batFuzz = batFuzz+3.5;
    }
    if (bat.eq === 'e-jetpack' || bat.eq === 'w2-arti') {
        batFuzz = batFuzz+2.5;
    }
    if (bat.eq === 'w2-dyna' || bat.eq === 'w2-explo' || bat.eq === 'w2-autogun' || bat.eq === 'w2-canon' || bat.eq === 'kit-artilleur') {
        batFuzz = batFuzz+2;
    }
    if (bat.eq === 'w2-lmit' || bat.eq === 'w1-ggun' || bat.eq === 'w2-ggun' || bat.eq === 'w2-rain' || bat.eq === 'w2-autopistol' || bat.eq === 'w3-autopistol' || bat.eq === 'kit-garde' || bat.eq === 'kit-lightning' || bat.eq === 'w2-acanon' || bat.eq === 'w2-mortier') {
        batFuzz = batFuzz+1.5;
    }
    if (bat.eq === 'w1-gun' || bat.eq === 'w1-plasma' || bat.eq === 'w2-brol' || bat.eq === 'w2-fire' || bat.eq === 'w2-molo' || bat.eq === 'w2-laser' || bat.eq === 'kit-guetteur') {
        batFuzz = batFuzz+1;
    }
    if (playerInfos.comp.cam >= 1) {
        batFuzz = batFuzz-0.5-(playerInfos.comp.cam*0.5);
    }
    if (batFuzz >= 6) {
        batFuzz = batFuzz+batFuzz-3;
    }
    if (hasEquip(bat,['isophon'])) {
        batFuzz = batFuzz-4;
    }
    if (batFuzz < 0) {
        batFuzz = 0;
    }
    return batFuzz;
};

function scrollToBottom() {
    $("#unitInfos").animate({ scrollTop: $('#unitInfos').prop("scrollHeight")},250);
};

function scrollToAnchor(anch) {
    document.location.hash = "#"+anch;
    $('html,body').scrollTop(0);
};

const mergeObjects = (obj1,obj2) => {
   for(key in obj1){
      if(obj2[key]){
         obj1[key] += obj2[key];
      };
   };
   for(key in obj2){
      if(!obj1[key]){
         obj1[key] = obj2[key];
      };
   };
   return;
};

function freeIds(side,db) {
    let idz = [];
    let i = 1;
    while (i <= 500) {
        idz.push(i);
        if (i > 500) {break;}
        i++
    }
    db.forEach(function(unit) {
        if (idz.includes(unit.id)) {
            idzIndex = idz.indexOf(unit.id);
            idz.splice(idzIndex,1);
        } else {
            console.log('2x id '+unit.id);
        }
    });
    console.log(side+' idz');
    console.log(idz);
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function toNiceString(myArray) {
    let newString = '';
    if (myArray instanceof Array) {
        newString = myArray.toString();
        newString = newString.replace(/,/g,', ');
    }
    return newString;
};

function toCoolString(myObject,nocro) {
    let newString = '';
    if (myObject != undefined) {
        newString = JSON.stringify(myObject);
        newString = newString.replace(/"/g,'');
        newString = newString.replace(/:/g,'=');
        newString = newString.replace(/,/g,', ');
    }
    if (newString === '{}') {
        newString = '{Rien}';
    }
    if (nocro) {
        newString = newString.replace(/{/g,'');
        newString = newString.replace(/}/g,'');
    }
    return newString;
};

function orderObjectByKey(unordered) {
    const ordered = Object.keys(unordered).sort().reduce(
        (obj,key) => {
            obj[key] = unordered[key];
            return obj;
        },
        {}
    );
    return ordered;
}

function onlyFirstLetter(string) {
    return string.charAt(0).toLowerCase();
};

function isDiv(n,d) {
   return n % d == 0;
};

function noParString(string) {
    if (string.includes('(') && string.includes(')')) {
        let regex = /\((.*?)\)/;
        let parString = ' '+regex.exec(string)[0];
        return string.replace(parString, "");
    } else {
        return string;
    }
};

function onlyParString(string) {
    if (string.includes('(') && string.includes(')')) {
        let regex = /\((.*?)\)/;
        return regex.exec(string)[1];
    } else {
        return '';
    }
};

function about(number,aleat) {
    let numAleat = Math.round(number*aleat/100);
    let aboutNum = Math.floor((Math.random() * (numAleat*2)) + 1)+number-numAleat;
    return Math.round(aboutNum);
};

function selectedBatArrayUpdate() {
    if (selectedBat.team === 'player') {
        let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
        bataillons[batIndex] = selectedBat;
        batIndex = batList.findIndex((obj => obj.id == selectedBat.id));
        batList[batIndex] = selectedBat;
    } else if (selectedBat.team === 'aliens') {
        let batIndex = aliens.findIndex((obj => obj.id == selectedBat.id));
        aliens[batIndex] = selectedBat;
        batIndex = alienList.findIndex((obj => obj.id == selectedBat.id));
        alienList[batIndex] = selectedBat;
    } else if (selectedBat.team === 'locals') {
        let batIndex = locals.findIndex((obj => obj.id == selectedBat.id));
        locals[batIndex] = selectedBat;
    }
};

function targetBatArrayUpdate() {
    if (targetBat.team === 'player') {
        let batIndex = bataillons.findIndex((obj => obj.id == targetBat.id));
        bataillons[batIndex] = targetBat;
    } else if (targetBat.team === 'aliens') {
        let batIndex = aliens.findIndex((obj => obj.id == targetBat.id));
        aliens[batIndex] = targetBat;
    } else if (targetBat.team === 'locals') {
        let batIndex = locals.findIndex((obj => obj.id == targetBat.id));
        locals[batIndex] = targetBat;
    }
};

function getDoom(floor) {
    let doom = ((playerInfos.allTurns)/(apoCount+(apoModeVar*2.5)-(playerInfos.gMode*apoModeVar)))+1;
    if (doom < 1) {
        doom = 1;
    }
    doom = doom.toFixedNumber(2);
    if (floor) {
        doom = Math.floor(doom);
    }
    return doom;
};

function getGangFactors() {
    let gangFacts = {};
    gangFacts.cit = 1;
    gangFacts.bod = 1;
    gangFacts.taupe = false;
    if (playerInfos.gang != undefined) {
        if (playerInfos.gang === 'rednecks') {
            gangFacts.cit = 1.1;
        }
        if (playerInfos.gang === 'brasier') {
            gangFacts.bod = 1.2;
        }
        if (playerInfos.gang === 'blades' || playerInfos.gang === 'brasier' || playerInfos.gang === 'drogmulojs' || playerInfos.gang === 'rednecks') {
            gangFacts.taupe = true;
        }
    }
    return gangFacts;
};

function levelUp(bat,batType) {
    if (playerInfos.pseudo != 'Mapedit') {
        if (batType.skills.includes('autohero')) {
            if (bat.tags.includes('schef')) {
                tagDelete(bat,'schef');
                bat.tags.push('hero');
            }
            if (bat.tags.includes('vet')) {
                tagDelete(bat,'vet');
                bat.tags.push('hero');
            }
        }
        let oldGrade = getGrade(bat,batType);
        bat.xp = bat.xp.toFixedNumber(2);
        if (bat.xp >= levelXP[4]) {
            bat.vet = 4;
        } else if (bat.xp >= levelXP[3]) {
            bat.vet = 3;
        } else if (bat.xp >= levelXP[2]) {
            bat.vet = 2;
        } else if (bat.xp >= levelXP[1]) {
            bat.vet = 1;
        } else {
            bat.vet = 0;
        }
        if (!bat.tags.includes('vet') && !bat.tags.includes('schef') && !bat.tags.includes('hero')) {
            let grade = getGrade(bat,batType);
            if (playerInfos.comp.ordre === 3) {
                if (grade === 'Lieutenant') {
                    if ((batType.cat === 'infantry' && !batType.skills.includes('clone') && !batType.skills.includes('robot') && !batType.skills.includes('nochef') && batType.crew >= 1) || batType.skills.includes('souschef')) {
                        heroUp(bat,batType,grade);
                    }
                }
                if (grade === 'Général') {
                    heroUp(bat,batType,grade);
                }
            }
            if (grade != oldGrade) {
                if (grade === 'Lieutenant') {
                    if ((batType.cat === 'infantry' && !batType.skills.includes('clone') && !batType.skills.includes('robot') && !batType.skills.includes('nochef') && batType.crew >= 1) || batType.skills.includes('souschef')) {
                        heroUp(bat,batType,grade);
                    }
                }
                if (grade === 'Sergent' && rand.rand(1,3) === 1) {
                    if ((batType.cat === 'infantry' && !batType.skills.includes('clone') && !batType.skills.includes('robot') && !batType.skills.includes('nochef') && batType.crew >= 1) || batType.skills.includes('souschef')) {
                        heroUp(bat,batType,grade);
                    }
                }
                if (grade === 'Général') {
                    heroUp(bat,batType,grade);
                }
            }
        }
    }
};

function heroUp(bat,batType,grade) {
    if (playerInfos.pseudo != 'Mapedit') {
        let mayChef = false;
        if ((batType.cat === 'infantry' && !batType.skills.includes('clone') && !batType.skills.includes('robot') && !batType.skills.includes('nochef') && !batType.skills.includes('penitbat') && !batType.skills.includes('brigands') && !batType.skills.includes('garde') && batType.crew >= 1 && !bat.tags.includes('outsider')) || batType.skills.includes('souschef')) {
            mayChef = true;
        }
        let mayHero = false;
        if ((batType.cat === 'infantry' && !batType.skills.includes('clone') && !batType.skills.includes('robot') && !batType.skills.includes('nochef') && !batType.skills.includes('garde') && batType.crew >= 1) || batType.skills.includes('souschef')) {
            mayHero = true;
        }
        let chefNum = getChefNum();
        if (grade === 'Sergent') {
            if (chefNum === 0 && mayChef) {
                bat.tags.push('schef');
            } else {
                if (rand.rand(1,chefNum*2) === 1 && mayChef) {
                    bat.tags.push('schef');
                }
            }
        } else if (grade === 'Lieutenant') {
            if (chefNum === 0 && mayChef) {
                bat.tags.push('schef');
            } else if (chefNum === 1 && mayHero) {
                bat.tags.push('hero');
            } else {
                if (rand.rand(1,chefNum+1) === 1 && mayChef) {
                    bat.tags.push('schef');
                } else if (rand.rand(1,5) <= 2 && mayHero) {
                    bat.tags.push('hero');
                } else if (rand.rand(1,2) === 1 && mayChef && playerInfos.comp.ordre >= 2) {
                    bat.tags.push('schef');
                } else {
                    bat.tags.push('vet');
                }
            }
            if (batType.skills.includes('autohero')) {
                if (bat.tags.includes('schef')) {
                    tagDelete(bat,'schef');
                    bat.tags.push('hero');
                }
                if (bat.tags.includes('vet')) {
                    tagDelete(bat,'vet');
                    bat.tags.push('hero');
                }
            }
        } else if (grade === 'Général') {
            if (rand.rand(1,5) <= 2) {
                bat.tags.push('hero');
            } else {
                bat.tags.push('vet');
            }
        }
    }
};

function getChefNum() {
    let chefNum = 0;
    bataillons.forEach(function(bat) {
        if (bat.tags.includes('schef')) {
            chefNum++;
        }
    });
    return chefNum;
};

function getGrade(bat,batType) {
    let grade = 'Caporal';
    let bonusLead = 0;
    if (playerInfos.comp.ordre === 3) {
        bonusLead = 1;
    }
    if (batType.skills.includes('leader')) {
        if (bat.vet >= 4-bonusLead) {
            grade = 'Général';
        } else {
            grade = 'Colonel';
        }
    } else if (batType.skills.includes('souschef')) {
        if (bat.vet >= 3-bonusLead) {
            grade = 'Lieutenant';
        } else if (bat.vet >= 2-bonusLead) {
            grade = 'Sergent';
        } else {
            grade = 'Caporal';
        }
    } else {
        if (batType.name === 'Adeptes') {
            if (bat.vet >= 2) {
                grade = 'Disciple';
            } else {
                grade = 'Adepte';
            }
        } else if (batType.name === 'Gurus') {
            grade = 'Guide';
        } else {
            if (bat.vet >= 4-bonusLead) {
                grade = 'Lieutenant';
            } else if (bat.vet >= 3-bonusLead) {
                grade = 'Sergent';
            } else {
                grade = 'Caporal';
            }
        }
    }
    return grade;
};

function isOccupiedByFriend(tileId) {
    //  tile occupé par une autre unité que le selectedBat?
    let occu = false;
    let bat = {};
    let index = bataillons.findIndex((obj => obj.tileId == tileId && obj.loc == 'zone' && obj.id != selectedBat.id));
    if (index > -1) {
        bat = bataillons[index];
    }
    if (Object.keys(bat).length >= 1) {
        occu = true;
    }
    return occu;
};

function isOccupied(tileId) {
    //  tile occupé par alien ou un bataillon?
    let occu = false;
    let bat = {};
    let index = bataillons.findIndex((obj => obj.tileId == tileId && obj.loc == 'zone'));
    if (index > -1) {
        bat = bataillons[index];
    }
    if (Object.keys(bat).length >= 1) {
        occu = true;
    }
    if (!occu) {
        index = aliens.findIndex((obj => obj.tileId == tileId));
        if (index > -1) {
            bat = aliens[index];
        }
        if (Object.keys(bat).length >= 1) {
            occu = true;
        }
    }
    return occu;
};

function nearbyAliens(myBat) {
    let nearby = {};
    nearby.oneTile = false;
    nearby.twoTiles = false;
    if (!playerInfos.onShip) {
        let oneTileAway = [];
        let twoTilesAway = [];
        oneTileAway.push(myBat.tileId+1);
        oneTileAway.push(myBat.tileId-1);
        oneTileAway.push(myBat.tileId+mapSize);
        oneTileAway.push(myBat.tileId-mapSize);
        twoTilesAway.push(myBat.tileId+1);
        twoTilesAway.push(myBat.tileId-1);
        twoTilesAway.push(myBat.tileId+mapSize);
        twoTilesAway.push(myBat.tileId-mapSize);
        twoTilesAway.push(myBat.tileId+mapSize+1);
        twoTilesAway.push(myBat.tileId+mapSize-1);
        twoTilesAway.push(myBat.tileId-mapSize+1);
        twoTilesAway.push(myBat.tileId-mapSize-1);
        twoTilesAway.push(myBat.tileId-2);
        twoTilesAway.push(myBat.tileId+2);
        twoTilesAway.push(myBat.tileId+mapSize+mapSize);
        twoTilesAway.push(myBat.tileId+mapSize+mapSize);
        twoTilesAway.push(myBat.tileId+mapSize-2);
        twoTilesAway.push(myBat.tileId+mapSize+2);
        twoTilesAway.push(myBat.tileId-mapSize-2);
        twoTilesAway.push(myBat.tileId-mapSize+2);
        twoTilesAway.push(myBat.tileId+mapSize+mapSize-2);
        twoTilesAway.push(myBat.tileId+mapSize+mapSize+2);
        twoTilesAway.push(myBat.tileId-mapSize-mapSize-2);
        twoTilesAway.push(myBat.tileId-mapSize-mapSize+2);
        twoTilesAway.push(myBat.tileId+mapSize+mapSize-1);
        twoTilesAway.push(myBat.tileId+mapSize+mapSize+1);
        twoTilesAway.push(myBat.tileId-mapSize-mapSize-1);
        twoTilesAway.push(myBat.tileId-mapSize-mapSize+1);
        const foundOne = oneTileAway.some(r=> alienOccupiedTiles.indexOf(r) >= 0);
        if (foundOne) {
            nearby.oneTile = true;
        }
        const foundTwo = twoTilesAway.some(r=> alienOccupiedTiles.indexOf(r) >= 0);
        if (foundTwo) {
            nearby.twoTiles = true;
        }
    }
    console.log('NEARBY');
    console.log(nearby);
    return nearby;
};

function nearWhat(myBat,myBatType) {
    let myCrew = myBatType.squads*myBatType.squadSize*myBatType.crew;
    let myCat = myBatType.cat;
    if (myBatType.equip.includes('g2ai')) {
        myCrew = myBatType.squads*myBatType.squadSize*1;
        myCat = 'infantry';
    }
    let near = {};
    near.caserne = false;
    near.control = false;
    near.friends = false;
    near.schef = false;
    near.doxey = false;
    near.loader = false;
    near.lander = false;
    near.cleric = false;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (bat.loc === "zone") {
            if (batType.skills.includes('infrahelp') || hasEquip(bat,['e-infra'])) {
                if (myCrew >= 12 && myCat === 'infantry' && !myBatType.skills.includes('dog')) {
                    if (myBat.tileId === bat.tileId+1 || myBat.tileId === bat.tileId-1 || myBat.tileId === bat.tileId-mapSize || myBat.tileId === bat.tileId-mapSize+1 || myBat.tileId === bat.tileId-mapSize-1 || myBat.tileId === bat.tileId+mapSize || myBat.tileId === bat.tileId+mapSize+1 || myBat.tileId === bat.tileId+mapSize-1) {
                        near.caserne = true;
                    }
                }
            }
        }
        if (bat.loc === "zone" && bat.id != myBat.id) {
            if (isOpLander(bat,batType)) {
                if (myBat.tileId === bat.tileId+1 || myBat.tileId === bat.tileId-1 || myBat.tileId === bat.tileId-mapSize || myBat.tileId === bat.tileId-mapSize+1 || myBat.tileId === bat.tileId-mapSize-1 || myBat.tileId === bat.tileId+mapSize || myBat.tileId === bat.tileId+mapSize+1 || myBat.tileId === bat.tileId+mapSize-1) {
                    near.lander = true;
                }
            }
        }
        if (myBat.tileId === bat.tileId+1 || myBat.tileId === bat.tileId-1 || myBat.tileId === bat.tileId-mapSize || myBat.tileId === bat.tileId-mapSize+1 || myBat.tileId === bat.tileId-mapSize-1 || myBat.tileId === bat.tileId+mapSize || myBat.tileId === bat.tileId+mapSize+1 || myBat.tileId === bat.tileId+mapSize-1 || myBat.tileId === bat.tileId) {
            let inDanger = checkNoAuthority(bat,batType);
            if (!bat.tags.includes('nomove') && !inDanger) {
                near.control = true;
            }
            if (bat.tags.includes('nomove') && !batType.skills.includes('nolist') && !batType.skills.includes('nomove')) {
                near.friends = true;
            }
            if (bat.tags.includes('hero') && batType.skills.includes('heropotion') && !bat.tags.includes('potion')) {
                near.doxey = true;
            }
            if (batType.skills.includes('cleric')) {
                near.cleric = true;
            }
            if (bat.autoLoad != undefined) {
                if (Array.isArray(bat.autoLoad)) {
                    if (bat.autoLoad.includes(myBat.id)) {
                        near.loader = true;
                    }
                }
            }
        }
        if (!bat.tags.includes('command')) {
            if (bat.tags.includes('schef') || batType.skills.includes('leader')) {
                let distance = calcDistance(bat.tileId,myBat.tileId);
                if (distance <= 3) {
                    near.schef = true;
                }
            }
        }
        if (batType.skills.includes('leader') && !bat.tags.includes('command')) {
            if (playerInfos.bldList.includes('Poste radio')) {
                near.schef = true;
            }
        }
        if (playerInfos.comp.tele >= 1 && !near.loader) {
            if (bat.autoLoad != undefined) {
                if (Array.isArray(bat.autoLoad)) {
                    if (bat.autoLoad.includes(myBat.id)) {
                        let teleOK = checkResTeleport(bat,myBat);
                        if (teleOK) {
                            near.loader = true;
                        }
                    }
                }
            }
        }
    });
    return near;
};

function isLander(bat,batType) {
    let batIsLander = false;
    if (batType.skills.includes('transorbital')) {
        batIsLander = true;
    }
    return batIsLander;
};

function isOpLander(bat,batType) {
    let batIsLander = false;
    if (batType.skills.includes('transorbital')) {
        if (!bat.tags.includes('nomove')) {
            if (!bat.tags.includes('nopilots')) {
                batIsLander = true;
            }
        }
    }
    return batIsLander;
};

function blockMe(stop) {
    if (stop) {
        stopMe = true;
        // $('body').css('background-image', 'url("/static/img/rayures-m.jpg")');
        $('#unitInfos').css('background-image', 'url("/static/img/plate-mdork-small.jpg")');
    } else {
        stopMe = false;
        // $('body').css('background-image', 'url("/static/img/rayures.jpg")');
        $('#unitInfos').css('background-image', 'url("/static/img/plate-vdork-small.jpg")');
    }
};

function blockThem(stop) {
    if (stop) {
        stopThem = true;
        // $('#affw').removeClass('boutonMauve');
        // $('#ana').removeClass('boutonMauve');
        // $('#affw').addClass('boutonGrey');
        // $('#ana').addClass('boutonGrey');
    } else {
        stopThem = false;
        // $('#affw').removeClass('boutonGrey');
        // $('#ana').removeClass('boutonGrey');
        // $('#affw').addClass('boutonMauve');
        // $('#ana').addClass('boutonMauve');
    }
    commandes();
};

function washReports(warningsAlso) {
    if (warningsAlso) {
        $('#warnings').empty();
        friendsAlert = false;
    }
    $('#report').empty();
};

function washThisWarning(warnNumber) {
    $('#warn'+warnNumber).empty();
    friendsAlert = false;
    $('#report').empty();
};

function warning(title,body,noHand,tileId,closeAll) {
    let warnNumber = nextWarn;
    nextWarn++;
    $('#warnings').append('<span class="warnings" id="warn'+warnNumber+'"><span class="or">'+title+'<br></span> '+body+'<br></span>');
    if (tileId != undefined) {
        if (tileId > -1) {
            $('#warn'+warnNumber).append('<span class="warnings"><i class="fas fa-eye cy klik" onclick="warnLink('+tileId+')"></i></span>');
        }
    }
    if (!noHand) {
        if (closeAll != undefined) {
            if (closeAll) {
                $('#warn'+warnNumber).append('<i class="far fa-hand-paper washAll" onclick="washReports(true)" title="Supprimer toutes les alertes"></i>');
            } else {
                $('#warn'+warnNumber).append('<i class="far fa-hand-paper wash" onclick="washThisWarning('+warnNumber+')" title="Supprimer cette alerte"></i>');
            }
        } else {
            $('#warn'+warnNumber).append('<i class="far fa-hand-paper wash" onclick="washThisWarning('+warnNumber+')" title="Supprimer cette alerte"></i>');
        }
    }
};

function warnLink(tileId) {
    let linkBatId = -1;
    let linkBat = {};
    if (activeTurn === 'player') {
        bataillons.forEach(function(bat) {
            if (linkBatId < 0) {
                if (bat.loc === 'zone') {
                    if (bat.tileId === tileId) {
                        linkBatId = bat.id;
                        linkBat = bat;
                    }
                }
            }
        });
    }
    if (linkBatId >= 0) {
        batSelect(linkBat);
        showBatInfos(linkBat);
    } else {
        centerMapTo(tileId);
    }
};

function getStartPack(gang) {
    let packName = 'startpack';
    let pack = {};
    let index = armorTypes.findIndex((obj => obj.name == packName));
    if (index > -1) {
        pack = armorTypes[index];
    }
    return pack;
};

function getResPack(packName) {
    let pack = {};
    let index = armorTypes.findIndex((obj => obj.name == packName));
    if (index > -1) {
        pack = armorTypes[index];
    }
    return pack;
};

function hasUnit(unitName,active) {
    let youHaveIt = false;
    if (active) {
        if (bataillons.some(e => e.type === unitName && !e.tags.includes('construction'))) {
            youHaveIt = true;
        }
    } else {
        if (bataillons.some(e => e.type === unitName)) {
            youHaveIt = true;
        }
    }
    // ages.some(checkAdult);
    // function checkAdult(age) {
    //     return age > 18;
    // }
    // bataillons.forEach(function(bat) {
    //     if (bat.type === unitName) {
    //         youHaveIt = true;
    //     }
    // });
    return youHaveIt;
}

function checkNumUnits(unitName) {
    let numUnits = 0;
    bataillons.forEach(function(bat) {
        if (bat.type === unitName) {
            numUnits++;
        }
    });
    return numUnits;
}

function maxUnits(unit) {
    let maxOf = {};
    maxOf.tank = 0;
    maxOf.hbot = 0;
    maxOf.lbot = 0;
    maxOf.hveh = 0;
    maxOf.lveh = 4;
    maxOf.elite = 0;
    maxOf.saucer = 0;
    maxOf.dog = 0;
    maxOf.mdev = 0;
    let numOf = {};
    numOf[unit.name] = 0;
    let total = {};
    total.leader = 0;
    total.saucer = 0;
    total.dog = 0;
    total.lveh = 0;
    let maxInfo = {};
    maxInfo.ko = false;
    maxInfo.num = 0;
    maxInfo.max = 99;
    maxInfo.maxText = '';
    maxInfo.text = 'Maximum non atteint';
    let maxLeaderAtteint = false;
    if (unit.name === 'Chercheurs') {
        if (playerInfos.onShip) {
            let maxSci = 1;
            if (playerInfos.bldVM.includes('Centre de recherches')) {
                if (playerInfos.gang === 'bulbos') {
                    maxSci = maxSci+Math.floor(playerInfos.comp.det/2.5);
                } else {
                    maxSci = maxSci+Math.floor(playerInfos.comp.det/5);
                }
                maxSci = maxSci+2;
                maxInfo.text = 'Maximum de chercheurs atteint';
            } else if (playerInfos.bldVM.includes('Laboratoire')) {
                maxSci = maxSci+1;
                maxInfo.text = 'Pour pouvoir avoir plus de chercheurs vous devez construire un centre de recherches';
            } else {
                maxInfo.text = 'Pour pouvoir avoir plus de chercheurs vous devez construire un laboraoire';
            }
            if (playerInfos.sci >= maxSci) {
                maxInfo.ko = true;
                maxInfo.max = maxSci;
            }
        } else {
            maxInfo.ko = true;
            maxInfo.max = 0;
            maxInfo.text = 'Vous ne pouvez pas faire des chercheurs hors de la station';
        }
    }
    if (unit.skills.includes('leader') || unit.skills.includes('tank') || unit.skills.includes('elite') || unit.skills.includes('wbld') || unit.skills.includes('wdev') || unit.skills.includes('mdev') || unit.skills.includes('hveh') || unit.skills.includes('lveh') || unit.skills.includes('lbot') || unit.skills.includes('hbot') || unit.skills.includes('saucer') || unit.skills.includes('dog') || unit.skills.includes('max1') || unit.skills.includes('max2') || unit.skills.includes('max3') || unit.skills.includes('maxordre') || unit.skills.includes('maxaero') || unit.skills.includes('maxexo') || unit.skills.includes('maxdet') || unit.skills.includes('maxind') || unit.skills.includes('maxgang') || unit.skills.includes('maxlevel')) {
        if (playerInfos.bldList.includes('Camp d\'entraînement')) {
            maxOf.elite = maxOf.elite+playerInfos.comp.train;
            if (maxOf.elite < 1) {
                maxOf.elite = 1;
            }
        }
        bataillons.forEach(function(bat) {
            let batType = getBatType(bat);
            if (batType.name === 'Aérodocks') {
                maxOf.saucer = maxOf.saucer+5;
            }
            if (batType.name === 'Usine d\'armement') {
                maxOf.tank = maxOf.tank+3;
            }
            if (batType.name === 'Chaîne de montage' || batType.name === 'Usine') {
                maxOf.hveh = maxOf.hveh+4;
            }
            if (batType.name === 'Centre de com' || batType.name === 'QG') {
                maxOf.hbot = maxOf.hbot+3;
                maxOf.lbot = maxOf.lbot+3;
            }
            if (batType.name === 'Poste radio') {
                maxOf.lbot = maxOf.lbot+3;
            }
            if (batType.name === 'Garage') {
                maxOf.lveh = maxOf.lveh+8;
            }
            if (batType.name === 'Chenil') {
                maxOf.dog = maxOf.dog+6;
            }
            if (batType.name.includes('Caserne')) {
                maxOf.elite = maxOf.elite+2;
            }
            if (bat.type === unit.name) {
                numOf[unit.name]++;
            }
            if (batType.skills.includes('leader')) {
                total.leader++;
            }
            if (batType.skills.includes('saucer')) {
                total.saucer++;
            }
            if (batType.skills.includes('dog')) {
                total.dog++;
            }
            if (batType.skills.includes('lveh')) {
                total.lveh++;
            }
        });
        if (!playerInfos.bldList.includes('Camp d\'entraînement')) {
            maxOf.elite = 1;
        }
    }
    if (unit.skills.includes('leader')) {
        maxInfo.max = Math.floor((playerInfos.gLevel-6)/3);
        if (total.leader >= maxInfo.max) {
            maxInfo.ko = true;
            maxLeaderAtteint = true;
            if (total.leader >= 4) {
                maxInfo.text = 'Maximum de leaders atteint';
            } else {
                maxInfo.text = 'Pour pouvoir avoir plus de leaders vous devez monter de niveau';
            }
        }
    }
    if (unit.skills.includes('elite') || (unit.skills.includes('leader') && !maxLeaderAtteint)) {
        maxInfo.max = maxOf.elite;
        if (numOf[unit.name] >= maxInfo.max && numOf[unit.name] >= 1) {
            maxInfo.ko = true;
            if (playerInfos.bldList.includes('Camp d\'entraînement')) {
                maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez construire une caserne supplémentaire';
            } else {
                maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez construire un camp d\'entraînement';
            }
        }
    }
    if (unit.skills.includes('dog')) {
        maxInfo.max = maxOf.dog;
        maxInfo.maxText = 'chiens';
        maxInfo.num = total.dog;
        if (total.dog >= maxInfo.max && numOf[unit.name] >= 1) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir avoir plus de chiens vous devez construire un chenil supplémentaire';
        }
    }
    if (unit.skills.includes('lveh')) {
        if (unit.skills.includes('2slots')) {
            maxOf.lveh = Math.ceil(maxOf.lveh/2);
        }
        maxInfo.max = maxOf.lveh;
        maxInfo.maxText = 'véhicules';
        maxInfo.num = total.lveh;
        if (total.lveh >= maxInfo.max && numOf[unit.name] >= 1) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir avoir plus de véhicules vous devez construire un garage supplémentaire';
        }
    }
    if (unit.skills.includes('saucer')) {
        maxInfo.max = maxOf.saucer;
        maxInfo.maxText = 'aéronefs';
        maxInfo.num = total.saucer;
        if (total.saucer >= maxInfo.max && numOf[unit.name] >= 3) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus d\'avions vous devez construire un aérodock supplémentaire';
        }
    }
    if (unit.skills.includes('mdev')) {
        maxInfo.max = (playerInfos.comp.def*15)+(playerInfos.comp.explo*5);
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter votre compétence de désense';
        }
    }
    if (unit.skills.includes('hbot')) {
        if (unit.skills.includes('2slots')) {
            maxOf.hbot = Math.ceil(maxOf.hbot/2);
        }
        let maxThis = maxOf.hbot;
        if (unit.skills.includes('fog')) {
            maxThis++;
        }
        maxInfo.max = maxThis;
        if (numOf[unit.name] >= maxInfo.max && numOf[unit.name] >= 2) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez construire un centre de com supplémentaire';
        }
    }
    if (unit.skills.includes('lbot')) {
        maxInfo.max = maxOf.lbot;
        if (numOf[unit.name] >= maxInfo.max && numOf[unit.name] >= 3) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez construire un poste radio supplémentaire';
        }
    }
    if (unit.skills.includes('tank')) {
        if (unit.skills.includes('2slots')) {
            maxOf.tank = Math.ceil(maxOf.tank/2);
        }
        maxInfo.max = maxOf.tank;
        if (numOf[unit.name] >= maxInfo.max && numOf[unit.name] >= 2) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez construire une usine d\'armements supplémentaire';
        }
    }
    if (unit.skills.includes('hveh')) {
        if (unit.skills.includes('2slots')) {
            maxOf.hveh = Math.ceil(maxOf.hveh/2);
        }
        maxInfo.max = maxOf.hveh;
        if (numOf[unit.name] >= maxInfo.max && numOf[unit.name] >= 2) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez construire une chaîne de montage supplémentaire';
        }
    }
    if (unit.skills.includes('wbld')) {
        maxInfo.max = playerInfos.comp.def+2;
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter votre compétence de désense';
        }
    }
    if (unit.skills.includes('wdev')) {
        maxInfo.max = playerInfos.comp.def+(playerInfos.comp.arti*2);
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter votre compétence de désense ou d\'artillerie';
        }
    }
    if (unit.skills.includes('max1')) {
        maxInfo.max = 1;
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = unit.name+': Maximum atteint';
        }
    }
    if (unit.skills.includes('max2')) {
        maxInfo.max = 2;
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = unit.name+': Maximum atteint';
        }
    }
    if (unit.skills.includes('max3')) {
        maxInfo.max = 3;
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = unit.name+': Maximum atteint';
        }
    }
    if (unit.skills.includes('maxordre')) {
        maxInfo.max = playerInfos.comp.ordre+1;
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter votre compétence de leadership';
        }
    }
    if (unit.skills.includes('maxaero')) {
        maxInfo.max = playerInfos.comp.aero+1;
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter votre compétence d\'aéronautique';
        }
    }
    if (unit.skills.includes('maxind')) {
        maxInfo.max = playerInfos.comp.ind;
        if (numOf[unit.name] >= maxInfo.max && numOf[unit.name] >= 1) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter votre compétence d\'industrie';
        }
    }
    if (unit.skills.includes('maxexo')) {
        maxInfo.max = 2;
        if (playerInfos.comp.exo >= 1) {
            maxInfo.max = 3;
        }
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter votre compétence d\'exochimie';
        }
    }
    if (unit.skills.includes('maxdet')) {
        let maxThis = 1;
        if (playerInfos.comp.det > 3) {
            maxThis = maxThis+playerInfos.comp.det-3;
        }
        maxInfo.max = maxThis;
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter votre compétence de détection';
        }
    }
    if (unit.skills.includes('maxlevel')) {
        maxInfo.max = Math.floor((playerInfos.comp.log/2)+(playerInfos.gLevel/8)+0.5);
        if (numOf[unit.name] >= maxInfo.max) {
            maxInfo.ko = true;
            maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez monter de niveau et/ou augmenter votre compétence de logistique';
        }
    }
    if (unit.skills.includes('maxgang')) {
        let levelBlock = false;
        if (playerInfos.gang === 'rednecks') {
            maxInfo.max = playerInfos.comp.log+1;
            let levelMax = Math.floor(playerInfos.gLevel/3.5);
            if (maxInfo.max > levelMax) {
                maxInfo.max = levelMax;
                levelBlock = true;
            }
            if (numOf[unit.name] >= maxInfo.max) {
                maxInfo.ko = true;
                if (levelBlock) {
                    maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez monter de niveau';
                } else {
                    maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter votre compétence de logistique';
                }
            }
        } else {
            maxInfo.max = Math.floor((playerInfos.comp.log/2)+(playerInfos.comp.gen/1.5)+1);
            let levelMax = Math.floor(playerInfos.gLevel/5);
            if (maxInfo.max > levelMax) {
                maxInfo.max = levelMax;
                levelBlock = true;
            }
            if (numOf[unit.name] >= maxInfo.max) {
                maxInfo.ko = true;
                if (levelBlock) {
                    maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez monter de niveau';
                } else {
                    maxInfo.text = 'Pour pouvoir construire plus de '+unit.name+' vous devez augmenter vos compétences de logistique et de génétique';
                }
            }
        }
    }
    // console.log(unit.name);
    // console.log(maxInfo);
    return maxInfo;
};

function getSoute() {
    let soute = {};
    let index = bataillons.findIndex((obj => obj.type == 'Soute'));
    if (index > -1) {
        soute = bataillons[index];
    }
    return soute;
};

function getCitBat(batName) {
    let citBat = {};
    let index = bataillons.findIndex((obj => obj.type == batName));
    if (index > -1) {
        citBat = bataillons[index];
    }
    return citBat;
};

function getInfraByName(infraName) {
    let infra = {};
    let index = armorTypes.findIndex((obj => obj.name == infraName));
    if (index > -1) {
        infra = armorTypes[index];
    }
    return infra;
};

function getDrugByName(drugName) {
    let drug = {};
    let index = armorTypes.findIndex((obj => obj.name == drugName));
    if (index > -1) {
        drug = armorTypes[index];
    }
    return drug;
};

function getEquipByName(equipName) {
    let equip = {};
    let index = armorTypes.findIndex((obj => obj.name == equipName));
    if (index > -1) {
        equip = armorTypes[index];
    }
    return equip;
};

function getAmmoByName(ammoName) {
    let ammo = {};
    let index = ammoTypes.findIndex((obj => obj.name == ammoName));
    if (index > -1) {
        ammo = ammoTypes[index];
    }
    return ammo;
};

function getBatType(bat) {
    let batType = {};
    let index;
    if (bat.team === 'player') {
        index = unitTypes.findIndex((obj => obj.id == bat.typeId));
        if (index > -1) {
            batType = unitTypes[index];
        }
    } else if (bat.team === 'aliens') {
        index = alienUnits.findIndex((obj => obj.id == bat.typeId));
        if (index > -1) {
            batType = alienUnits[index];
        }
    }
    return batType;
};

function getBatTypeById(id) {
    let batType = {};
    let index = unitTypes.findIndex((obj => obj.id == id));
    if (index > -1) {
        batType = unitTypes[index];
    }
    return batType;
};

function getBatTypeByName(batName) {
    let batType = {};
    let index = unitTypes.findIndex((obj => obj.name == batName));
    if (index > -1) {
        batType = unitTypes[index];
    }
    return batType;
};

function getResByName(resName) {
    let res = {};
    let index = resTypes.findIndex((obj => obj.name == resName));
    if (index > -1) {
        res = resTypes[index];
    }
    return res;
};

function getResById(resId) {
    let res = {};
    let index = resTypes.findIndex((obj => obj.id == resId));
    if (index > -1) {
        res = resTypes[index];
    }
    return res;
};

function getBatById(batId) {
    let bat = {};
    let index = bataillons.findIndex((obj => obj.id == batId));
    if (index > -1) {
        bat = bataillons[index];
    }
    return bat;
};

function doesBatExists(batId) {
    let exists = false;
    let bat = {};
    let index = bataillons.findIndex((obj => obj.id == batId));
    if (index > -1) {
        bat = bataillons[index];
    }
    if (Object.keys(bat).length >= 1) {
        exists = true;
    }
    return exists;
};

function getBatByOldId(batOldId) {
    let bat = {};
    let index = bataillons.findIndex((obj => obj.oldId == batOldId));
    if (index > -1) {
        bat = bataillons[index];
    }
    return bat;
};

function getBatByTileId(tileId) {
    let bat = {};
    let index = bataillons.findIndex((obj => obj.tileId == tileId));
    if (index > -1) {
        bat = bataillons[index];
    }
    return bat;
};

function getZoneBatByTileId(tileId) {
    let bat = {};
    let index = bataillons.findIndex((obj => obj.tileId == tileId && obj.loc == 'zone'));
    if (index > -1) {
        bat = bataillons[index];
    }
    return bat;
};

function getBatByName(name) {
    let bat = {};
    let index = bataillons.findIndex((obj => obj.type == name));
    if (index > -1) {
        bat = bataillons[index];
    }
    return bat;
};

function getBatByTypeIdAndTileId(typeId,tileId) {
    let bat = {};
    let index = bataillons.findIndex((obj => (obj.tileId == tileId && obj.typeId == typeId && obj.loc == 'zone')));
    if (index > -1) {
        bat = bataillons[index];
    }
    return bat;
};

function getLastBatCreated() {
    let myBat = {};
    let highestId = -1;
    bataillons.slice().reverse().forEach(function(bat) {
        if (bat.id > highestId) {
            highestId = bat.id;
            myBat = bat;
        }
    });
    return myBat;
};

function getLastAlienCreated() {
    let myBat = {};
    let highestId = -1;
    aliens.slice().reverse().forEach(function(bat) {
        if (bat.id > highestId) {
            highestId = bat.id;
            myBat = bat;
        }
    });
    return myBat;
};

function getAlienByName(name) {
    let bat = {};
    let index = aliens.findIndex((obj => obj.type == name));
    if (index > -1) {
        bat = aliens[index];
    }
    return bat;
};

function getAlienTypeByName(batName) {
    let batType = {};
    let index = alienUnits.findIndex((obj => obj.name == batName));
    if (index > -1) {
        batType = alienUnits[index];
    }
    return batType;
};

function getAlienById(batId) {
    let bat = {};
    let index = aliens.findIndex((obj => obj.id == batId));
    if (index > -1) {
        bat = aliens[index];
    }
    return bat;
};

function getAlienByTileId(tileId) {
    let bat = {};
    let index = aliens.findIndex((obj => obj.tileId == tileId));
    if (index > -1) {
        bat = aliens[index];
    }
    return bat;
};

function getTerrain(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    return terrain;
};

function getTerrainById(tileId) {
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    return terrain;
};

function getTerrainByName(terrainName) {
    let index = terrainTypes.findIndex((obj => obj.name == terrainName));
    let terrain = terrainTypes[index];
    return terrain;
};

function getTileTerrain(tileId) {
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    return terrain;
};

function getTileTerrainName(tileId) {
    let tername = 'P';
    if (tileId < 3600 && tileId >= 0) {
        let tileIndex = zone.findIndex((obj => obj.id == tileId));
        let tile = zone[tileIndex];
        let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
        let terrain = terrainTypes[terrainIndex];
        tername = terrain.name;
    }
    return tername;
};

function getTileTerrainFullName(tileId) {
    let tername = 'Plaines';
    if (tileId < 3600 && tileId >= 0) {
        let tileIndex = zone.findIndex((obj => obj.id == tileId));
        let tile = zone[tileIndex];
        let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
        let terrain = terrainTypes[terrainIndex];
        tername = terrain.fullName;
    }
    return tername;
};

function getTile(bat) {
    let tileIndex = zone.findIndex((obj => obj.id == bat.tileId));
    let tile = zone[tileIndex];
    return tile;
};

function getTileById(tileId) {
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    return tile;
};

function getCompByName(name) {
    let index = gangComps.findIndex((obj => obj.name == name));
    let gComp = gangComps[index];
    return gComp;
};

function getCompById(id) {
    let index = gangComps.findIndex((obj => obj.id == id));
    let gComp = gangComps[index];
    return gComp;
};

function getBatEquip(bat) {
    let index = armorTypes.findIndex((obj => obj.name == bat.eq));
    let batEquip = armorTypes[index];
    return batEquip;
};

function getBatArmor(bat) {
    let index = armorTypes.findIndex((obj => obj.name == bat.prt));
    let batArmor = armorTypes[index];
    return batArmor;
};

function getZoneInfoById(zoneNumber) {
    let index = playerInfos.zoneDB.findIndex((obj => obj.id == zoneNumber));
    let zoneInfo = playerInfos.zoneDB[index];
    return zoneInfo;
};

function getMissionByNum(missionNumber) {
    let index = playerInfos.misInfo.findIndex((obj => obj.num == missionNumber));
    let mission = playerInfos.misInfo[index];
    return mission;
};

function getTrapName(bat,batType) {
    let trapName = 'Mines';
    if (batType.skills.includes('dynamite')) {
        trapName = 'Explosifs';
    }
    if (batType.skills.includes('trapap') || bat.eq === 'kit-sentinelle') {
        trapName = 'Pièges';
    }
    if (batType.skills.includes('trapdard')) {
        trapName = 'Dardières';
    }
    if (batType.skills.includes('trapfosse')) {
        trapName = 'Fosses';
    }
    return trapName;
};

function getUnitTrapName(batType) {
    let trapName = 'Mines';
    if (batType.skills.includes('dynamite')) {
        trapName = 'Explosifs';
    }
    if (batType.skills.includes('trapap')) {
        trapName = 'Pièges';
    }
    if (batType.skills.includes('trapdard')) {
        trapName = 'Dardières';
    }
    if (batType.skills.includes('trapfosse')) {
        trapName = 'Fosses';
    }
    return trapName;
};

function getPlanetNameById(pid) {
    if (pid === 1) {
        return 'Dom';
    } else if (pid === 2) {
        return 'Sarak';
    } else if (pid === 3) {
        return 'Gehenna';
    } else if (pid === 4) {
        return 'Kzin';
    } else if (pid === 5) {
        return 'Horst';
    } else {
        return 'Dom';
    }
};

function tileNaming(tile,withUnit,fromTileId) {
    let tileName = '';
    if (withUnit) {
        let bat = getZoneBatByTileId(tile.id);
        tileName = bat.type+' &middot; ';
    }
    let terName = getTileTerrainFullName(tile.id);
    tileName = tileName+'('+terName+')';
    if (tile.tileName != undefined && tile.tileName != '') {
        tileName = '<span class="blanc">'+tile.tileName+'</span> '+tileName;
    }
    if (tile.ruins) {
        tileName = tileName+' <i class="fas fa-city inficon gf"></i>';
    }
    if (tile.rq != undefined) {
        tileName = tileName+' <i class="fas fa-atom inficon rq'+tile.rq+'"></i>';
    }
    if (fromTileId > -1) {
        tileName = tileName+'<span class="cy">';
        if (tile.id === fromTileId+1) {
            tileName = tileName+' &rarr;';
        }
        if (tile.id === fromTileId-1) {
            tileName = tileName+' &larr;';
        }
        if (tile.id === fromTileId+1+mapSize) {
            tileName = tileName+' &searr;';
        }
        if (tile.id === fromTileId-1+mapSize) {
            tileName = tileName+' &swarr;';
        }
        if (tile.id === fromTileId+1-mapSize) {
            tileName = tileName+' &nearr;';
        }
        if (tile.id === fromTileId-1-mapSize) {
            tileName = tileName+' &nwarr;';
        }
        if (tile.id === fromTileId+mapSize) {
            tileName = tileName+' &darr;';
        }
        if (tile.id === fromTileId-mapSize) {
            tileName = tileName+' &uarr;';
        }
        tileName = tileName+'</span>';
    }
    return tileName;
};

function getSpaceBatById(batId) {
    let bat = {};
    let index = batsInSpace.findIndex((obj => obj.id == batId));
    if (index > -1) {
        bat = batsInSpace[index];
    }
    return bat;
};

function doRegroup(transBat,transBatType) {
    let numBats = 0;
    let numSquads = 0;
    let mostSquads = 0;
    let masterBatId = -1;
    bataillons.forEach(function(bat) {
        if (bat.loc === "trans" && bat.locId === transBat.id) {
            let batType = getBatType(bat);
            if (batType.skills.includes('regroup') && bat.squadsLeft < batType.squads) {
                numBats++;
                numSquads = numSquads+bat.squadsLeft;
                if (mostSquads < bat.squadsLeft) {
                    mostSquads = bat.squadsLeft;
                    masterBatId = bat.id;
                }
            }
        }
    });
    if (numBats >= 2) {
        let masterBat = getBatById(masterBatId);
        let masterBatType = getBatType(masterBat);
        let squadsKill = 0;
        masterBat.damage = 0;
        if (numSquads <= masterBatType.squads) {
            squadsKill = numSquads-masterBat.squadsLeft;
            masterBat.squadsLeft = numSquads;
        } else {
            squadsKill = masterBatType.squads-masterBat.squadsLeft;
            masterBat.squadsLeft = masterBatType.squads;
        }
        if (squadsKill >= 1) {
            deadBatsList = [];
            bataillons.forEach(function(bat) {
                if (bat.loc === "trans" && bat.locId === transBat.id) {
                    if (squadsKill >= 1) {
                        let batType = getBatType(bat);
                        if (batType.skills.includes('regroup') && bat.squadsLeft < batType.squads) {
                            if (bat.squadsLeft <= squadsKill) {
                                squadsKill = squadsKill-bat.squadsLeft;
                                deadBatsList.push(bat.id);
                            } else {
                                squadsKill = 0;
                                bat.squadsLeft = bat.squadsLeft-squadsKill;
                            }
                        }
                    }
                }
            });
            killBatList();
        }
    }
};

function killBatList() {
    bataillons.slice().reverse().forEach(function(bat,index,object) {
        if (deadBatsList.includes(bat.id)) {
            bataillons.splice(object.length-1-index,1);
        }
    });
};

function killAlienList() {
    aliens.slice().reverse().forEach(function(bat,index,object) {
        if (deadAliensList.includes(bat.id)) {
            aliens.splice(object.length-1-index,1);
        }
    });
    deadAliensList = [];
    alienBonus();
};

function killSpaceBatList() {
    batsInSpace.slice().reverse().forEach(function(bat,index,object) {
        if (deadBatsList.includes(bat.id)) {
            batsInSpace.splice(object.length-1-index,1);
        }
    });
};

function coolManCool() {
    // triche: supprime le stress des bataillons
    bataillons.forEach(function(bat) {
        bat.emo = 0;
    });
};

function noAlienRip() {
    // triche: pas de riposte alien
    aliens.forEach(function(bat) {
        bat.apLeft = -10;
    });
};

function calcScore() {
    let hs = {};
    hs.turns = playerInfos.allTurns+playerInfos.mapTurn;
    hs.days = Math.round(hs.turns/3);
    hs.cits = playerInfos.endRes.Citoyens;
    hs.score = Math.round(100*hs.cits/hs.turns*playerInfos.gMode/3);
    return hs;
};

function entre(num,min,max) {
    let number = num;
    if (min >= 0) {
        if (number < min) {number = min;}
    }
    if (max >= 0) {
        if (number > max) {number = max;}
    }
    return number;
};

function hasHowMany(arr,prop,value) {
    const numX = arr.filter((obj) => obj[prop] == value).length;
    return numX;
};
