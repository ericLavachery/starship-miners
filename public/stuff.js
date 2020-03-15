// STUFF
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
        bataillons[batIndex] = selectedBat;
    } else if (selectedBat.team == 'aliens') {
        aliens[batIndex] = selectedBat;
    } else if (selectedBat.team == 'locals') {
        locals[batIndex] = selectedBat;
    }
};

function targetBatArrayUpdate() {
    if (targetBat.team == 'player') {
        bataillons[batIndex] = targetBat;
    } else if (targetBat.team == 'aliens') {
        aliens[batIndex] = targetBat;
    } else if (targetBat.team == 'locals') {
        locals[batIndex] = targetBat;
    }
};
