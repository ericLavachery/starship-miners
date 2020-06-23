function calcAmmos(bat,startAmmo) {
    let ammoLeft = startAmmo;
    console.log('startAmmo='+startAmmo);
    if (startAmmo < 99) {
        if (bat.tags.includes('ammoUsed')) {
            let allTags = _.countBy(bat.tags);
            ammoLeft = startAmmo-allTags.ammoUsed;
        } else {
            ammoLeft = startAmmo;
        }
    }
    console.log('ammoLeft='+ammoLeft);
    return ammoLeft;
};

function calcAmmoNeed(bat) {
    let ammoNeed = 0;
    if (bat.tags.includes('ammoUsed')) {
        let allTags = _.countBy(bat.tags);
        ammoNeed = allTags.ammoUsed;
    }
    return ammoNeed;
};

function goRavit(apCost) {
    if (selectedBat.tags.includes('ammoUsed')) {
        // console.log('RAVIT');
        // console.log(selectedBat);
        let batType;
        let ravitBat = {};
        let ravitLeft = 0;
        let biggestRavit = 0;
        let ravitVolume = calcRavitVolume(selectedBat);
        let ammoNeed = calcAmmoNeed(selectedBat);
        let singleAmmoVolume = ravitVolume[1]/ammoNeed;
        console.log('singleAmmoVolume'+singleAmmoVolume);
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                batType = getBatType(bat);
                if (batType.skills.includes('ravitaillement')) {
                    ravitLeft = calcRavit(bat);
                    if (calcDistance(selectedBat.tileId,bat.tileId) <= 1 && ravitLeft >= 1) {
                        if (biggestRavit < ravitLeft) {
                            biggestRavit = ravitLeft;
                            ravitBat = bat;
                            // console.log('ravit bat: '+ravitBat.type);
                        }
                    }
                }
            }
        });
        if (Object.keys(ravitBat).length >= 1) {
            // xp
            if (biggestRavit < 999) {
                if (ravitBat.id != selectedBat.id) {
                    ravitBat.xp = ravitBat.xp+0.3;
                }
            }
            selectedBat.apLeft = selectedBat.apLeft-apCost;
            selectedBat.salvoLeft = 0;
            let numAmmo = 0;
            let i = 1;
            while (i <= 120) {
                if (selectedBat.tags.includes('ammoUsed')) {
                    tagIndex = selectedBat.tags.indexOf('ammoUsed');
                    selectedBat.tags.splice(tagIndex,1);
                    numAmmo++;
                } else {
                    break;
                }
                if (i > 120) {break;}
                i++;
            }
            let numRav = Math.round(numAmmo*singleAmmoVolume);
            if (biggestRavit < 999) {
                i = 1;
                while (i <= numRav) {
                    if (ravitBat.id == selectedBat.id) {
                        selectedBat.tags.push('skillUsed');
                    } else {
                        ravitBat.tags.push('skillUsed');
                    }
                    if (i > 120) {break;}
                    i++;
                }
            }
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
        }
    }
};

function checkRavitDrug(myBat) {
    // vérifie si il y a un ravitaillement possible EN DROGUE à côté de l'unité
    let batType;
    let anyRavit = false;
    let ravitLeft;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.skills.includes('ravitaillement')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                    ravitLeft = calcRavit(bat);
                    if (ravitLeft >= 1 || batType.skills.includes('stock')) {
                        anyRavit = true;
                    }
                }
            }
        }
    });
    return anyRavit;
};

function calcRavit(bat) {
    let batType = getBatType(bat);
    let ravitLeft = batType.maxSKill;
    console.log('startRavit='+ravitLeft);
    if (ravitLeft < 999) {
        if (bat.tags.includes('skillUsed')) {
            let allTags = _.countBy(bat.tags);
            ravitLeft = ravitLeft-allTags.skillUsed;
        }
    }
    console.log('ravitLeft='+ravitLeft);
    return ravitLeft;
};

function calcRavitVolume(bat) {
    let batType = getBatType(bat);
    let ravitVolume = [0,0,'ammo'];
    let ammoVolume;
    let ammoLeft;
    if (batType.weapon.maxAmmo < 99) {
        if (bat.ammo.includes('obus') || bat.ammo.includes('boulet') || bat.ammo.includes('lf-')) {
            ammoVolume = 2*batType.weapon.power;
        } else if (bat.ammo.includes('missile')) {
            ammoVolume = 8*batType.weapon.power;
            ravitVolume[2] = 'missile';
        } else {
            ammoVolume = 0.4*batType.weapon.power;
        }
        ravitVolume[0] = Math.ceil(batType.squads*batType.weapon.rof*ammoVolume*batType.weapon.maxAmmo/2000);
        ammoLeft = calcAmmos(bat,batType.weapon.maxAmmo);
        ravitVolume[1] = ravitVolume[0]-Math.floor(ravitVolume[0]*ammoLeft/batType.weapon.maxAmmo);
    } else if (batType.weapon2.maxAmmo < 99) {
        if (bat.ammo2.includes('obus') || bat.ammo2.includes('boulet') || bat.ammo2.includes('lf-')) {
            ammoVolume = 2*batType.weapon2.power;
        } else if (bat.ammo2.includes('missile')) {
            ammoVolume = 8*batType.weapon2.power;
            ravitVolume[2] = 'missile';
        } else {
            ammoVolume = 0.4*batType.weapon2.power;
        }
        ravitVolume[0] = Math.ceil(batType.squads*batType.weapon2.rof*ammoVolume*batType.weapon2.maxAmmo/2000);
        ammoLeft = calcAmmos(bat,batType.weapon2.maxAmmo);
        ravitVolume[1] = ravitVolume[0]-Math.floor(ravitVolume[0]*ammoLeft/batType.weapon2.maxAmmo);
    }
    return ravitVolume;
};

function goStock(apCost) {
    if (selectedBat.tags.includes('skillUsed')) {
        let batType;
        let stocktBat = {};
        let stockOK = false;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                batType = getBatType(bat);
                if (batType.skills.includes('stock')) {
                    if (calcDistance(selectedBat.tileId,bat.tileId) <= 1) {
                        stockOK = true;
                        stocktBat = bat;
                    }
                }
            }
        });
        if (stockOK) {
            selectedBat.apLeft = selectedBat.apLeft-apCost;
            selectedBat.salvoLeft = 0;
            let i = 1;
            while (i <= 50) {
                if (selectedBat.tags.includes('skillUsed')) {
                    tagIndex = selectedBat.tags.indexOf('skillUsed');
                    selectedBat.tags.splice(tagIndex,1);
                } else {
                    break;
                }
                if (i > 50) {break;}
                i++
            }
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
        }
    }
};

function checkStock(myBat) {
    let batType;
    let anyStock = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.skills.includes('stock')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                    anyStock = true;
                }
            }
        }
    });
    return anyStock;
};

function checkRavit(myBat) {
    // vérifie si il y a un ravitaillement possible à côté de l'unité
    let batType;
    let anyRavit = false;
    let ravitLeft;
    let ravitVolume = calcRavitVolume(myBat);
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone") {
            batType = getBatType(bat);
            if (batType.skills.includes('ravitaillement')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                    ravitLeft = calcRavit(bat);
                    if (ravitLeft >= 1 && ravitVolume[0] <= batType.maxSKill && (ravitVolume[2] != 'missile') || batType.skills.includes('stock')) {
                        anyRavit = true;
                    }
                }
            }
        }
    });
    return anyRavit;
};

function goRavitDrug(apCost) {
    if (selectedBat.tags.includes('skillUsed')) {
        let batType;
        let ravitBat = {};
        let ravitLeft = 0;
        let biggestRavit = 0;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone") {
                batType = getBatType(bat);
                if (batType.skills.includes('ravitaillement')) {
                    ravitLeft = calcRavit(bat);
                    if (calcDistance(selectedBat.tileId,bat.tileId) <= 1 && ravitLeft >= 1) {
                        if (biggestRavit < ravitLeft) {
                            biggestRavit = ravitLeft;
                            ravitBat = bat;
                        }
                    }
                }
            }
        });
        if (Object.keys(ravitBat).length >= 1) {
            selectedBat.apLeft = selectedBat.apLeft-apCost;
            selectedBat.salvoLeft = 0;
            let i = 1;
            while (i <= 120) {
                if (selectedBat.tags.includes('skillUsed')) {
                    tagIndex = selectedBat.tags.indexOf('skillUsed');
                    selectedBat.tags.splice(tagIndex,1);
                } else {
                    break;
                }
                if (i > 120) {break;}
                i++;
            }
            ravitBat.tags.push('skillUsed');
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
        }
    }
};
