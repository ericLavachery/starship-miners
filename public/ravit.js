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

function calcRavitVolume(bat) {
    let batType = getBatType(bat);
    let ravitVolume = [0,0,'ammo'];
    let ammoVolume;
    let ammoLeft;
    let w1maxAmmo = batType.weapon.maxAmmo;
    let w2maxAmmo = batType.weapon2.maxAmmo;
    if (batType.weapon.maxAmmo < 99) {
        if (bat.eq === 'gilet' || bat.logeq === 'gilet' || bat.eq.includes('carrousel') || bat.logeq.includes('carrousel') || bat.eq === 'crimekitgi') {
            w1maxAmmo = Math.floor(w1maxAmmo*1.5);
            if (w1maxAmmo < 16) {
                w1maxAmmo = 16;
            }
        }
        if (playerInfos.bldList.includes('Usine d\'armement')) {
            w1maxAmmo = Math.round(w1maxAmmo*1.5);
        } else if (playerInfos.bldList.includes('Arsenal')) {
            w1maxAmmo = Math.round(w1maxAmmo*1.25);
        }
        if (bat.ammo.includes('obus') || bat.ammo.includes('boulet')) {
            ammoVolume = 2*batType.weapon.power;
        } else if (bat.ammo.includes('lf-')) {
            ammoVolume = 0.67*batType.weapon.power;
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
        if (bat.eq === 'gilet' || bat.logeq === 'gilet' || bat.eq.includes('carrousel') || bat.logeq.includes('carrousel') || bat.eq === 'crimekitgi') {
            w2maxAmmo = Math.floor(w2maxAmmo*1.5);
            if (w2maxAmmo < 16) {
                w2maxAmmo = 16;
            }
        }
        if (playerInfos.bldList.includes('Usine d\'armement')) {
            w2maxAmmo = Math.round(w2maxAmmo*1.5);
        } else if (playerInfos.bldList.includes('Arsenal')) {
            w2maxAmmo = Math.round(w2maxAmmo*1.25);
        }
        if (bat.ammo2.includes('obus') || bat.ammo2.includes('boulet')) {
            ammoVolume = 2*batType.weapon2.power;
        } else if (bat.ammo2.includes('lf-')) {
            ammoVolume = 0.67*batType.weapon2.power;
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

// AMMOS

function calcRavit(bat) {
    let batType = getBatType(bat);
    let ravitLeft = 0;
    ravitLeft = batType.maxSkill;
    if (ravitLeft < 999) {
        if (bat.tags.includes('sU')) {
            let allTags = _.countBy(bat.tags);
            ravitLeft = ravitLeft-allTags.sU;
        }
    }
    return ravitLeft;
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
    let bldRav = bldReq;
    if (bldReq === 'Poudrière') {
        bldRav = 'Armurerie';
    }
    if (playerInfos.bldList.includes(bldReq) || bldReq === '') {
        let batType;
        let ravitLeft;
        let ravitVolume = calcRavitVolume(myBat);
        let ravitTypeOK = false;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
                batType = getBatType(bat);
                ravitTypeOK = false;
                if (bldRav === batType.name || batType.bldEquiv.includes(bldRav) || !batType.skills.includes('ravitprod')) {
                    ravitTypeOK = true;
                }
                if (batType.skills.includes('ravitaillement') && bat.eq != 'megafret' && bat.eq != 'megatrans' && !batType.skills.includes('stockmed') && ravitTypeOK) {
                    if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                        ravitLeft = calcRavit(bat);
                        if (ravitLeft >= 1 && (ravitVolume[0] <= batType.maxSkill || ravitVolume[0] <= 12 || batType.maxSkill >= 18 || (ravitVolume[0] <= 18 && (myBat.eq === 'gilet' || myBat.logeq === 'gilet' || myBat.eq === 'crimekitgi'))) && (ravitVolume[2] != 'missile' || batType.skills.includes('stock'))) {
                            anyRavit = true;
                        }
                    }
                }
            }
        });
    }
    return anyRavit;
};

function goRavit() {
    if (selectedBat.tags.includes('aU')) {
        // console.log('RAVIT');
        // console.log(selectedBat);
        let batType;
        let ravitBat = {};
        let ravitLeft = 0;
        let biggestRavit = 0;
        let bldReq = '';
        if (selectedBatType.weapon.ravitBld != undefined) {
            bldReq = selectedBatType.weapon.ravitBld;
        }
        if (selectedBatType.weapon2.ravitBld != undefined) {
            bldReq = selectedBatType.weapon2.ravitBld;
        }
        if (bldReq === 'Poudrière') {
            bldReq = 'Armurerie';
        }
        let ravitTypeOK;
        let ravitVolume = calcRavitVolume(selectedBat);
        let ammoNeed = calcAmmoNeed(selectedBat);
        let singleAmmoVolume = ravitVolume[1]/ammoNeed;
        // console.log('singleAmmoVolume'+singleAmmoVolume);
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
                batType = getBatType(bat);
                ravitTypeOK = false;
                if (bldReq === batType.name || batType.bldEquiv.includes(bldReq) || !batType.skills.includes('ravitprod')) {
                    ravitTypeOK = true;
                }
                if (batType.skills.includes('ravitaillement') && bat.eq != 'megafret' && bat.eq != 'megatrans' && ravitTypeOK) {
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
        let ravitBatType = getBatType(ravitBat);
        if (Object.keys(ravitBat).length >= 1) {
            let maxRavit = calcRavit(ravitBat);
            // xp
            if (biggestRavit < 999) {
                if (ravitBat.id != selectedBat.id) {
                    if (!ravitBatType.skills.includes('robot') || ravitBat.eq === 'g2ai' || ravitBat.logeq === 'g2ai') {
                        ravitBat.xp = ravitBat.xp+1;
                    }
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
            if (selectedBat.eq.includes('carrousel') || selectedBat.logeq.includes('carrousel')) {
                ravitFactor = ravitFactor*1.5;
            }
            if (playerInfos.comp.log >= 3) {
                ravitFactor = ravitFactor*2;
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
            tagDelete(selectedBat,'guet');
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
        }
    }
};

// DRUGS

function calcRavitDrug(bat) {
    let batType = getBatType(bat);
    let ravitLeft = 0;
    if (batType.skills.includes('dealer')) {
        ravitLeft = batType.maxDrug;
        if (playerInfos.bldList.includes('Centre de recherches')) {
            ravitLeft = Math.round(ravitLeft*2);
        } else if (playerInfos.bldList.includes('Laboratoire')) {
            ravitLeft = Math.round(ravitLeft*1.5);
        }
        if (ravitLeft < 999) {
            if (bat.tags.includes('dU')) {
                let allTags = _.countBy(bat.tags);
                ravitLeft = ravitLeft-allTags.dU;
            }
        }
    }
    return ravitLeft;
};

function checkRavitDrug(myBat) {
    // vérifie si il y a un ravitaillement possible EN DROGUE à côté de l'unité
    let batType;
    let anyRavit = false;
    let ravitLeft;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.skills.includes('ravitaillement') && bat.eq != 'megafret' && bat.eq != 'megatrans') {
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
                if (batType.skills.includes('ravitaillement') && bat.eq != 'megafret' && bat.eq != 'megatrans') {
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
            tagDelete(selectedBat,'guet');
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
        }
    }
};

// STOCK

function checkStock(myBat) {
    let anyStock = false;
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            let batType = getBatType(bat);
            if (batType.skills.includes('stock')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= 1) {
                    anyStock = true;
                }
            }
        }
    });
    return anyStock;
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
