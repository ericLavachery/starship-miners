// STUFF
function calcBatFuzz(bat) {
    let batFuzz = bat.fuzz+2;
    if (bat.eq === 'jetpack') {
        batFuzz = batFuzz+2.5;
    }
    if (batFuzz >= 4) {
        batFuzz = batFuzz+bat.fuzz-1;
    }
    return batFuzz;
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
    while (i <= 250) {
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

function toCoolString(myObject) {
    let newString = '';
    if (myObject != undefined) {
        newString = JSON.stringify(myObject);
        newString = newString.replace(/"/g,'');
        newString = newString.replace(/:/g,'=');
    }
    if (newString === '{}') {
        newString = '{Rien}';
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

function blockMe(stop) {
    if (stop) {
        stopMe = true;
        $('body').css('background-image', 'url("/static/img/rayures-m.jpg")');
    } else {
        stopMe = false;
        $('body').css('background-image', 'url("/static/img/rayures.jpg")');
    }
};

function washReports() {
    $('#warnings').empty();
    $('#report').empty();
};

function warning(title,body,noHand) {
    $('#warnings').append('<span class="warnings"><span class="or">'+title+'<br></span> '+body+'<br></span>');
    if (!noHand) {
        $('#warnings').append('<i class="far fa-hand-paper wash" onclick="washReports()" title="Cacher l\'alerte"></i>');
    }
};

function getBatType(bat) {
    let unitIndex;
    let batType;
    if (bat.team == 'player') {
        unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
        batType = unitTypes[unitIndex];
    } else if (bat.team == 'aliens') {
        unitIndex = alienUnits.findIndex((obj => obj.id == bat.typeId));
        batType = alienUnits[unitIndex];
    }
    return batType;
};

function getBatTypeById(id) {
    let unitIndex;
    let batType;
    unitIndex = unitTypes.findIndex((obj => obj.id == id));
    batType = unitTypes[unitIndex];
    return batType;
};

function getInfraByName(infraName) {
    let index = armorTypes.findIndex((obj => obj.name == infraName));
    let infra = armorTypes[index];
    return infra;
};

function getBatTypeByName(batName) {
    let index = unitTypes.findIndex((obj => obj.name == batName));
    let batType = unitTypes[index];
    return batType;
};

function getResByName(resName) {
    let resIndex = resTypes.findIndex((obj => obj.name == resName));
    let res = resTypes[resIndex];
    return res;
};

function getResById(resId) {
    let resIndex = resTypes.findIndex((obj => obj.id == resId));
    let res = resTypes[resIndex];
    return res;
};

function getBatById(batId) {
    let index = bataillons.findIndex((obj => obj.id == batId));
    let bat = bataillons[index];
    return bat;
};

function getBatByTileId(tileId) {
    let index = bataillons.findIndex((obj => obj.tileId == tileId));
    let bat = bataillons[index];
    return bat;
};

function getBatByName(name) {
    let index = bataillons.findIndex((obj => obj.type == name));
    let bat = bataillons[index];
    return bat;
};

function getBatByTypeIdAndTileId(typeId,tileId) {
    let index = bataillons.findIndex((obj => (obj.tileId == tileId && obj.typeId == typeId)));
    let bat = bataillons[index];
    return bat;
};

function getAlienByName(name) {
    let bat = {};
    let index = aliens.findIndex((obj => obj.type == name));
    if (index >= 0) {
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
