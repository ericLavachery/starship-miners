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
