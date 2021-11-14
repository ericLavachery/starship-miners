// STUFF
function calcBatFuzz(bat) {
    let batFuzz = bat.fuzz+2;
    if (bat.eq === 'w2-lcomet') {
        batFuzz = batFuzz+3.5;
    }
    if (bat.eq === 'e-jetpack' || bat.eq === 'w2-arti') {
        batFuzz = batFuzz+2.5;
    }
    if (bat.eq === 'w2-dyna' || bat.eq === 'w2-explo' || bat.eq === 'w2-autogun' || bat.eq === 'w2-canon' || bat.eq === 'kit-artilleur') {
        batFuzz = batFuzz+2;
    }
    if (bat.eq === 'w2-lmit' || bat.eq === 'w1-ggun' || bat.eq === 'w2-ggun' || bat.eq === 'w2-rain' || bat.eq === 'w2-autopistol' || bat.eq === 'kit-garde' || bat.eq === 'kit-lightning' || bat.eq === 'w2-acanon' || bat.eq === 'w2-mortier') {
        batFuzz = batFuzz+1.5;
    }
    if (bat.eq === 'autoextract' || bat.eq === 'w1-gun' || bat.eq === 'w1-plasma' || bat.eq === 'w2-brol' || bat.eq === 'w2-fire' || bat.eq === 'w2-molo' || bat.eq === 'w2-laser' || bat.eq === 'kit-guetteur') {
        batFuzz = batFuzz+1;
    }
    if (playerInfos.comp.cam >= 1) {
        batFuzz = batFuzz-0.5-(playerInfos.comp.cam*0.5);
    }
    if (batFuzz >= 6) {
        batFuzz = batFuzz+batFuzz-3;
    }
    if (bat.eq === 'isophon' || bat.logeq === 'isophon') {
        batFuzz = batFuzz-3;
    }
    if (batFuzz < 0) {
        batFuzz = 0;
    }
    return batFuzz;
};

function scrollToBottom() {
    $("#unitInfos").animate({ scrollTop: $('#unitInfos').prop("scrollHeight")},250);
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
    while (i <= 300) {
        idz.push(i);
        if (i > 300) {break;}
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
    if (selectedBat.team == 'player') {
        let batIndex = bataillons.findIndex((obj => obj.id == selectedBat.id));
        bataillons[batIndex] = selectedBat;
        batIndex = batList.findIndex((obj => obj.id == selectedBat.id));
        batList[batIndex] = selectedBat;
    } else if (selectedBat.team == 'aliens') {
        let batIndex = aliens.findIndex((obj => obj.id == selectedBat.id));
        aliens[batIndex] = selectedBat;
        batIndex = alienList.findIndex((obj => obj.id == selectedBat.id));
        alienList[batIndex] = selectedBat;
    } else if (selectedBat.team == 'locals') {
        let batIndex = locals.findIndex((obj => obj.id == selectedBat.id));
        locals[batIndex] = selectedBat;
    }
};

function targetBatArrayUpdate() {
    if (targetBat.team == 'player') {
        let batIndex = bataillons.findIndex((obj => obj.id == targetBat.id));
        bataillons[batIndex] = targetBat;
    } else if (targetBat.team == 'aliens') {
        let batIndex = aliens.findIndex((obj => obj.id == targetBat.id));
        aliens[batIndex] = targetBat;
    } else if (targetBat.team == 'locals') {
        let batIndex = locals.findIndex((obj => obj.id == targetBat.id));
        locals[batIndex] = targetBat;
    }
};

function levelUp(bat,batType) {
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
};

function heroUp(bat,batType,grade) {
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
            } else if (rand.rand(1,2) === 1 && mayHero) {
                bat.tags.push('hero');
            } else {
                bat.tags.push('vet');
            }
        }
    } else if (grade === 'Général') {
        if (rand.rand(1,2) === 1) {
            bat.tags.push('hero');
        } else {
            bat.tags.push('vet');
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
    if (batType.skills.includes('leader')) {
        if (bat.vet >= 4) {
            grade = 'Général';
        } else {
            grade = 'Colonel';
        }
    } else if (batType.skills.includes('souschef')) {
        if (bat.vet >= 3) {
            grade = 'Lieutenant';
        } else if (bat.vet >= 2) {
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
            if (bat.vet >= 4) {
                grade = 'Lieutenant';
            } else if (bat.vet >= 3) {
                grade = 'Sergent';
            } else {
                grade = 'Caporal';
            }
        }
    }
    return grade;
};

function nearbyAliens(myBat) {
    let nearby = {};
    nearby.one = false;
    nearby.two = false;
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
        nearby.one = true;
    }
    const foundTwo = twoTilesAway.some(r=> alienOccupiedTiles.indexOf(r) >= 0);
    if (foundTwo) {
        nearby.two = true;
    }
    return nearby;
};

function nearWhat(myBat,myBatType) {
    let myCrew = myBatType.squads*myBatType.squadSize*myBatType.crew;
    let near = {};
    near.caserne = false;
    near.control = false;
    near.schef = false;
    near.doxey = false;
    near.loader = false;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (bat.loc === "zone") {
            if (batType.skills.includes('infrahelp')) {
                if (myCrew >= 12 && myBatType.cat === 'infantry') {
                    if (myBat.tileId === bat.tileId+1 || myBat.tileId === bat.tileId-1 || myBat.tileId === bat.tileId-mapSize || myBat.tileId === bat.tileId-mapSize+1 || myBat.tileId === bat.tileId-mapSize-1 || myBat.tileId === bat.tileId+mapSize || myBat.tileId === bat.tileId+mapSize+1 || myBat.tileId === bat.tileId+mapSize-1) {
                        near.caserne = true;
                    }
                }
            }
        }
        if (myBat.tileId === bat.tileId+1 || myBat.tileId === bat.tileId-1 || myBat.tileId === bat.tileId-mapSize || myBat.tileId === bat.tileId-mapSize+1 || myBat.tileId === bat.tileId-mapSize-1 || myBat.tileId === bat.tileId+mapSize || myBat.tileId === bat.tileId+mapSize+1 || myBat.tileId === bat.tileId+mapSize-1 || myBat.tileId === bat.tileId) {
            if (!bat.tags.includes('nomove')) {
                near.control = true;
            }
            if (bat.tags.includes('hero') && batType.skills.includes('heropotion') && !bat.tags.includes('potion')) {
                near.doxey = true;
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
    });
    return near;
};

function nomoveOut(myBat) {
    tagDelete(myBat,'nomove');
    if (myBat.transIds != undefined) {
        bataillons.forEach(function(bat) {
            if (myBat.transIds.includes(bat.id)) {
                tagDelete(bat,'nomove');
            }
        });
    }
}

function blockMe(stop) {
    if (stop) {
        stopMe = true;
        $('body').css('background-image', 'url("/static/img/rayures-m.jpg")');
    } else {
        stopMe = false;
        $('body').css('background-image', 'url("/static/img/rayures.jpg")');
    }
};

function washReports(warningsAlso) {
    if (warningsAlso) {
        $('#warnings').empty();
    }
    $('#report').empty();
};

function warning(title,body,noHand,tileId) {
    $('#warnings').append('<span class="warnings"><span class="or">'+title+'<br></span> '+body+'<br></span>');
    if (tileId != undefined) {
        if (tileId >= -1) {
            $('#warnings').append('<span class="warnings"><i class="fas fa-eye cy klik" onclick="warnLink('+tileId+')"></i></span>');
        }
    }
    if (!noHand) {
        $('#warnings').append('<i class="far fa-hand-paper wash" onclick="washReports(true)" title="Cacher l\'alerte"></i>');
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

function hasUnit(unitName) {
    let youHaveIt = false;
    bataillons.forEach(function(bat) {
        if (bat.type === unitName) {
            youHaveIt = true;
        }
    });
    return youHaveIt;
}

function maxUnits(unit) {
    let isMax;
    let numOf = {};
    if (unit.name === 'Chercheurs') {
        if (playerInfos.onShip) {
            let maxSci = 1;
            if (playerInfos.bldVM.includes('Centre de recherches')) {
                maxSci = 3;
            } else if (playerInfos.bldVM.includes('Laboratoire')) {
                maxSci = 2;
            }
            if (playerInfos.sci >= maxSci) {
                isMax = true;
            }
        } else {
            isMax = true;
        }
    }
    if (unit.skills.includes('leader') || unit.skills.includes('max1') || unit.skills.includes('max2') || unit.skills.includes('max3')) {
        numOf.leader = 0;
        numOf[unit.name] = 0;
        bataillons.forEach(function(bat) {
            let batType = getBatType(bat);
            if (batType.skills.includes('leader')) {
                numOf.leader++;
            }
            if (bat.type === unit.name) {
                numOf[unit.name]++;
            }
        });
    }
    if (unit.skills.includes('leader')) {
        if (numOf.leader >= Math.round(playerInfos.gLevel/4.1)) {
            isMax = true;
        }
    }
    if (unit.skills.includes('max1')) {
        if (numOf[unit.name] >= 1) {
            isMax = true;
        }
    }
    if (unit.skills.includes('max2')) {
        if (numOf[unit.name] >= 2) {
            isMax = true;
        }
    }
    if (unit.skills.includes('max3')) {
        if (numOf[unit.name] >= 3) {
            isMax = true;
        }
    }
    return isMax;
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
    if (bat.team == 'player') {
        index = unitTypes.findIndex((obj => obj.id == bat.typeId));
        if (index > -1) {
            batType = unitTypes[index];
        }
    } else if (bat.team == 'aliens') {
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

function getBatByTileId(tileId) {
    let bat = {};
    let index = bataillons.findIndex((obj => obj.tileId == tileId));
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
    let index = bataillons.findIndex((obj => (obj.tileId === tileId && obj.typeId === typeId && obj.loc === 'zone')));
    if (index > -1) {
        bat = bataillons[index];
    }
    return bat;
};

function getAlienByName(name) {
    let bat = {};
    let index = aliens.findIndex((obj => obj.type == name));
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
    let index = playerInfos.zoneDB.findIndex((obj => obj.id === zoneNumber));
    let zoneInfo = playerInfos.zoneDB[index];
    return zoneInfo;
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
        let bat = getBatByTileId(tile.id);
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
};

function killSpaceBatList() {
    batsInSpace.slice().reverse().forEach(function(bat,index,object) {
      if (deadBatsList.includes(bat.id)) {
        batsInSpace.splice(object.length-1-index,1);
      }
    });
};
