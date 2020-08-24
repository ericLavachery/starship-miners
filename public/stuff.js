// STUFF
function calcBatFuzz(bat) {
    let batFuzz = bat.fuzz+2;
    if (bat.fuzz >= 2) {
        batFuzz = batFuzz+bat.fuzz-1;
    }
    return batFuzz;
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

function playerSkills() {
    // Con. ALiens
    let caLevel = 0;
    if (playerInfos.skills.includes('ca1')) {
        caLevel = 1;
    }
    if (playerInfos.skills.includes('ca2')) {
        caLevel = 2;
    }
    if (playerInfos.skills.includes('ca3')) {
        caLevel = 3;
    }
    if (playerInfos.skills.includes('ca4')) {
        caLevel = 4;
    }
    if (playerInfos.skills.includes('ca5')) {
        caLevel = 5;
    }
    playerInfos.caLevel = caLevel;
    // Médecine
    let medLevel = 0;
    if (playerInfos.skills.includes('med1')) {
        medLevel = 1;
    }
    if (playerInfos.skills.includes('med2')) {
        medLevel = 2;
    }
    if (playerInfos.skills.includes('med3')) {
        medLevel = 3;
    }
    playerInfos.medLevel = medLevel;
};

function playerSkillsUTChanges() {
    unitTypes.forEach(function(unit) {
        if (playerInfos.skills.includes('cam1') && unit.skills.includes('maycamo') && unit.cat === 'infantry') {
            unit.skills.push('camo');
        }
        if (playerInfos.skills.includes('cam2') && unit.skills.includes('maycamo') && unit.cat === 'vehicles') {
            unit.skills.push('camo');
        }
        if (playerInfos.skills.includes('cam3') && unit.skills.includes('maycamo') && unit.cat === 'buildings') {
            unit.skills.push('camo');
        }
        if (unit.skills.includes('medic')) {
            if (playerInfos.medLevel >= 3 && unit.mediCost >= 3) {
                unit.mediCost = unit.mediCost-1;
            }
        }
    });
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

function warning(title,body) {
    $('#warnings').append('<span class="warnings"><span class="or">'+title+'<br></span> '+body+'<br></span><i class="far fa-hand-paper wash" onclick="washReports()" title="Cacher l\'alerte"></i>');
};
