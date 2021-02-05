function calcAmmos(bat,startAmmo) {
    let ammoLeft = startAmmo;
    // console.log('startAmmo='+startAmmo);
    if (startAmmo < 99) {
        if (bat.tags.includes('aU')) {
            let allTags = _.countBy(bat.tags);
            ammoLeft = startAmmo-allTags.aU;
        } else {
            ammoLeft = startAmmo;
        }
    }
    // console.log('ammoLeft='+ammoLeft);
    return ammoLeft;
};

function calcAmmoNeed(bat) {
    let ammoNeed = 0;
    if (bat.tags.includes('aU')) {
        let allTags = _.countBy(bat.tags);
        ammoNeed = allTags.aU;
    }
    return ammoNeed;
};

function goRavit() {
    if (selectedBat.tags.includes('aU')) {
        // console.log('RAVIT');
        // console.log(selectedBat);
        let batType;
        let ravitBat = {};
        let ravitLeft = 0;
        let biggestRavit = 0;
        let ravitVolume = calcRavitVolume(selectedBat);
        let ammoNeed = calcAmmoNeed(selectedBat);
        let singleAmmoVolume = ravitVolume[1]/ammoNeed;
        // console.log('singleAmmoVolume'+singleAmmoVolume);
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
                batType = getBatType(bat);
                if (batType.skills.includes('ravitaillement') && bat.eq != 'remorque') {
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
            let maxRavit = calcRavit(ravitBat);
            // xp
            if (biggestRavit < 999) {
                if (ravitBat.id != selectedBat.id) {
                    ravitBat.xp = ravitBat.xp+0.3;
                }
            }
            let numAmmo = 0;
            let numberRavit = 0;
            let i = 1;
            while (i <= 120) {
                if (numberRavit+singleAmmoVolume > maxRavit) {
                    break;
                } else {
                    if (selectedBat.tags.includes('aU')) {
                        tagIndex = selectedBat.tags.indexOf('aU');
                        selectedBat.tags.splice(tagIndex,1);
                        numAmmo++;
                        numberRavit = numberRavit+singleAmmoVolume;
                    } else {
                        break;
                    }
                }
                if (i > 120) {break;}
                i++;
            }
            let numRav = Math.round(numAmmo*singleAmmoVolume);
            let ravitFactor = 3;
            if (selectedBatType.skills.includes('fly') && !selectedBatType.skills.includes('jetpack')) {
                ravitFactor = 1;
            }
            if (selectedBat.eq.includes('carrousel')) {
                ravitFactor = ravitFactor*1.5;
            }
            if (playerInfos.comp.log >= 3) {
                ravitFactor = ravitFactor*1.5;
            }
            let apCost = Math.round(Math.sqrt(numRav)*selectedBat.ap/ravitFactor);
            selectedBat.apLeft = selectedBat.apLeft-apCost;
            selectedBat.salvoLeft = 0;
            selectedBat.tags.push('ravit');
            if (biggestRavit < 999) {
                i = 1;
                while (i <= numRav) {
                    if (ravitBat.id == selectedBat.id) {
                        selectedBat.tags.push('sU');
                    } else {
                        ravitBat.tags.push('sU');
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
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('ravitaillement') && bat.eq != 'remorque') {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                    ravitLeft = calcRavit(bat);
                    if (ravitLeft >= 2 || batType.skills.includes('stock')) {
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
    let ravitLeft = 0;
    ravitLeft = batType.maxSkill;
    // console.log('startRavit='+ravitLeft);
    if (ravitLeft < 999) {
        if (bat.tags.includes('sU')) {
            let allTags = _.countBy(bat.tags);
            ravitLeft = ravitLeft-allTags.sU;
        }
    }
    // console.log('ravitLeft='+ravitLeft);
    return ravitLeft;
};

function calcRavitDrug(bat) {
    let batType = getBatType(bat);
    let ravitLeft = 0;
    if (batType.skills.includes('dealer')) {
        ravitLeft = batType.maxDrug;
        // console.log('startRavit='+ravitLeft);
        if (ravitLeft < 999) {
            if (bat.tags.includes('dU')) {
                let allTags = _.countBy(bat.tags);
                ravitLeft = ravitLeft-allTags.dU;
            }
        }
    }
    // console.log('ravitLeft='+ravitLeft);
    return ravitLeft;
};

function calcRavitVolume(bat) {
    let batType = getBatType(bat);
    let ravitVolume = [0,0,'ammo'];
    let ammoVolume;
    let ammoLeft;
    let w1maxAmmo = batType.weapon.maxAmmo;
    let w2maxAmmo = batType.weapon2.maxAmmo;
    if (batType.weapon.maxAmmo < 99) {
        if (bat.eq === 'gilet') {
            w1maxAmmo = Math.floor(w1maxAmmo*1.5);
            if (w1maxAmmo < 16) {
                w1maxAmmo = 16;
            }
        }
        if (bat.ammo.includes('obus') || bat.ammo.includes('boulet') || bat.ammo.includes('lf-')) {
            ammoVolume = 2*batType.weapon.power;
        } else if (bat.ammo.includes('missile')) {
            ammoVolume = 8*batType.weapon.power;
            ravitVolume[2] = 'missile';
        } else if (batType.weapon.ammo.includes('standard')) {
            ammoVolume = 0.05*batType.weapon.power;
        } else {
            ammoVolume = 0.4*batType.weapon.power;
        }
        ravitVolume[0] = Math.ceil(batType.squads*batType.weapon.rof*ammoVolume*w1maxAmmo/2000);
        ammoLeft = calcAmmos(bat,w1maxAmmo);
        ravitVolume[1] = ravitVolume[0]-Math.floor(ravitVolume[0]*ammoLeft/w1maxAmmo);
    } else if (batType.weapon2.maxAmmo < 99) {
        if (bat.eq === 'gilet') {
            w2maxAmmo = Math.floor(w2maxAmmo*1.5);
            if (w2maxAmmo < 16) {
                w2maxAmmo = 16;
            }
        }
        if (bat.ammo2.includes('obus') || bat.ammo2.includes('boulet') || bat.ammo2.includes('lf-')) {
            ammoVolume = 2*batType.weapon2.power;
        } else if (bat.ammo2.includes('missile')) {
            ammoVolume = 8*batType.weapon2.power;
            ravitVolume[2] = 'missile';
        } else if (batType.weapon2.ammo.includes('standard')) {
            ammoVolume = 0.05*batType.weapon2.power;
        } else {
            ammoVolume = 0.4*batType.weapon2.power;
        }
        ravitVolume[0] = Math.ceil(batType.squads*batType.weapon2.rof*ammoVolume*w2maxAmmo/2000);
        ammoLeft = calcAmmos(bat,w2maxAmmo);
        ravitVolume[1] = ravitVolume[0]-Math.floor(ravitVolume[0]*ammoLeft/w2maxAmmo);
    }
    return ravitVolume;
};

function goStock(apCost) {
    if (selectedBat.tags.includes('sU')) {
        let batType;
        let stocktBat = {};
        let stockOK = false;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
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
                if (selectedBat.tags.includes('sU')) {
                    tagIndex = selectedBat.tags.indexOf('sU');
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
        if (bat.loc === "zone" || bat.loc === "trans") {
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
    let anyRavit = false;
    let myBatType = getBatType(myBat);
    let bldReq = '';
    if (myBatType.weapon.ravitBld != undefined) {
        bldReq = myBatType.weapon.ravitBld;
    }
    if (myBatType.weapon2.ravitBld != undefined) {
        bldReq = myBatType.weapon2.ravitBld;
    }
    if (playerInfos.bldList.includes(bldReq) || bldReq === '') {
        let batType;
        let ravitLeft;
        let ravitVolume = calcRavitVolume(myBat);
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
                batType = getBatType(bat);
                if (batType.skills.includes('ravitaillement') && bat.eq != 'remorque' && !batType.skills.includes('stockmed')) {
                    if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                        ravitLeft = calcRavit(bat);
                        if (ravitLeft >= 1 && (ravitVolume[0] <= batType.maxSkill || ravitVolume[0] <= 12) && (ravitVolume[2] != 'missile' || batType.skills.includes('stock'))) {
                            anyRavit = true;
                        }
                    }
                }
            }
        });
    }
    return anyRavit;
};

function goRavitDrug(apCost) {
    if (selectedBat.tags.includes('dU')) {
        let batType;
        let ravitBat = {};
        let ravitBatType;
        let ravitLeft = 0;
        let biggestRavit = 0;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
                batType = getBatType(bat);
                if (batType.skills.includes('ravitaillement') && bat.eq != 'remorque') {
                    ravitLeft = calcRavit(bat);
                    if (calcDistance(selectedBat.tileId,bat.tileId) <= 1 && ravitLeft >= 2) {
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
                if (selectedBat.tags.includes('dU')) {
                    tagIndex = selectedBat.tags.indexOf('dU');
                    selectedBat.tags.splice(tagIndex,1);
                } else {
                    break;
                }
                if (i > 120) {break;}
                i++;
            }
            if (true) {

            }
            ravitBatType = getBatType(ravitBat);
            if (ravitBatType.maxSkill < 999 && !ravitBatType.skills.includes('stockmed')) {
                ravitBat.tags.push('sU');
                ravitBat.tags.push('sU');
            }
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
        }
    }
};
