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
    if (batType.weapon2.maxAmmo < 99) {
        if (batType.weapon2.maxAmmo > 1) {
            if (hasEquip(bat,['gilet'])) {
                w2maxAmmo = Math.floor(w2maxAmmo*1.33);
                if (w2maxAmmo < 12) {
                    w2maxAmmo = 12;
                }
            }
            if (hasEquip(bat,['hangard'])) {
                w2maxAmmo = Math.floor(w2maxAmmo*2);
            }
            if (hasEquip(bat,['carrousel','carrousel1','carrousel2'])) {
                w2maxAmmo = Math.floor(w2maxAmmo*1.25);
                if (w2maxAmmo < 12) {
                    w2maxAmmo = 12;
                }
            }
        }
        if (batType.weapon2.name === 'Bombes') {
            ammoVolume = 1.5*batType.weapon2.power;
        } else if (bat.ammo2.includes('obus') || bat.ammo2.includes('boulet')) {
            ammoVolume = 2*batType.weapon2.power;
        } else if (bat.ammo2.includes('lf-') || bat.ammo2.includes('bfg') || bat.ammo2.includes('laser') || batType.weapon2.ammo.includes('plasma') || batType.weapon2.ammo.includes('cn-plasma')) {
            ammoVolume = 1*batType.weapon2.power;
        } else if (bat.ammo2.includes('missile')) {
            ammoVolume = 6*batType.weapon2.power;
            ravitVolume[2] = 'missile';
        } else if (bat.ammo2 === 'marquage-scr') {
            ammoVolume = 4*batType.weapon2.power;
            ravitVolume[2] = 'missile';
        } else if (batType.weapon2.ammo.includes('standard')) {
            ammoVolume = 0.05*batType.weapon2.power;
        } else {
            ammoVolume = 0.4*batType.weapon2.power;
        }
        ravitVolume[0] = Math.ceil(batType.squads*batType.weapon2.rof*ammoVolume*w2maxAmmo/2000);
        ammoLeft = calcAmmos(bat,w2maxAmmo);
        ravitVolume[1] = ravitVolume[0]-Math.floor(ravitVolume[0]*ammoLeft/w2maxAmmo);
    } else if (batType.weapon.maxAmmo < 99) {
        if (batType.weapon.maxAmmo > 1) {
            if (hasEquip(bat,['gilet'])) {
                w1maxAmmo = Math.floor(w1maxAmmo*1.33);
                if (w1maxAmmo < 12) {
                    w1maxAmmo = 12;
                }
            }
            if (hasEquip(bat,['hangard'])) {
                w1maxAmmo = Math.floor(w1maxAmmo*2);
            }
            if (hasEquip(bat,['carrousel','carrousel1','carrousel2'])) {
                w1maxAmmo = Math.floor(w1maxAmmo*1.25);
                if (w1maxAmmo < 12) {
                    w1maxAmmo = 12;
                }
            }
        }
        if (batType.weapon.name === 'Bombes') {
            ammoVolume = 1.5*batType.weapon2.power;
        } else if (bat.ammo.includes('obus') || bat.ammo.includes('boulet')) {
            ammoVolume = 2*batType.weapon.power;
        } else if (bat.ammo.includes('lf-') || bat.ammo.includes('bfg') || bat.ammo.includes('laser') || batType.weapon.ammo.includes('plasma') || batType.weapon.ammo.includes('cn-plasma')) {
            ammoVolume = 1*batType.weapon.power;
        } else if (bat.ammo.includes('missile')) {
            ammoVolume = 6*batType.weapon.power;
            ravitVolume[2] = 'missile';
        } else if (bat.ammo === 'marquage-scr') {
            ammoVolume = 4*batType.weapon.power;
            ravitVolume[2] = 'missile';
        } else if (batType.weapon.ammo.includes('standard')) {
            ammoVolume = 0.05*batType.weapon.power;
        } else {
            ammoVolume = 0.4*batType.weapon.power;
        }
        ravitVolume[0] = Math.ceil(batType.squads*batType.weapon.rof*ammoVolume*w1maxAmmo/2000);
        ammoLeft = calcAmmos(bat,w1maxAmmo);
        ravitVolume[1] = ravitVolume[0]-Math.floor(ravitVolume[0]*ammoLeft/w1maxAmmo);
    }
    return ravitVolume;
};

// AMMOS

function calcRavit(bat) {
    let batType = getBatType(bat);
    let ravitLeft = 0;
    ravitLeft = batType.maxSkill;
    if (bat.tags.includes('genstrong')) {
        ravitLeft = Math.round(ravitLeft*1.5);
    }
    if (batType.skills.includes('stock')) {
        ravitLeft = 999;
    }
    if (ravitLeft < 999) {
        if (bat.tags.includes('sU')) {
            let allTags = _.countBy(bat.tags);
            ravitLeft = ravitLeft-allTags.sU;
        }
    }
    return ravitLeft;
};

function calcPutLeft(bat) {
    let batType = getBatType(bat);
    let putLeft = 0;
    putLeft = batType.maxPut;
    if (bat.tags.includes('genstrong')) {
        putLeft = Math.round(putLeft*1.5);
    }
    if (bat.tags.includes('pU')) {
        let allTags = _.countBy(bat.tags);
        putLeft = putLeft-allTags.pU;
    }
    return putLeft;
};

function checkLastRavit(myBat) {
    let lastRavit = {};
    lastRavit.ok = true;
    lastRavit.exists = false;
    let isDeluge = false;
    let maxRavit = 30;
    let myBatType = getBatType(myBat);
    let bldReq = '';
    if (myBatType.weapon.ravitBld != undefined) {
        bldReq = myBatType.weapon.ravitBld;
        maxRavit = myBatType.weapon.maxAmmo;
        if (myBat.ammo.includes('-deluge') || myBat.ammo.includes('-cluster')) {
            lastRavit.exists = true;
            isDeluge = true;
        }
    }
    if (myBatType.weapon2.ravitBld != undefined) {
        bldReq = myBatType.weapon2.ravitBld;
        maxRavit = myBatType.weapon2.maxAmmo;
        if (myBat.ammo2.includes('-deluge') || myBat.ammo2.includes('-cluster')) {
            lastRavit.exists = true;
            isDeluge = true;
        }
    }
    let gangBonus = 0;
    if (playerInfos.gang === 'detruas') {
        gangBonus = 1;
    }
    if (myBatType.cat === 'buildings') {
        maxRavit = maxRavit*(4+gangBonus);
    } else if (myBatType.cat === 'devices') {
        maxRavit = maxRavit*(4+gangBonus);
    } else {
        maxRavit = maxRavit*(2+gangBonus);
    }
    maxRavit = Math.ceil(Math.sqrt(maxRavit))*4;
    if (maxRavit > 30) {
        maxRavit = 30;
    }
    let bldRav = bldReq;
    if (bldReq === 'Poudrière') {
        bldRav = 'Armurerie';
    }
    if (isStartZone) {
        bldReq = '';
    }
    if (bldReq === 'Arsenal' || isDeluge) {
        if (myBat.rvt === undefined) {
            myBat.rvt = 0;
        }
        if (myBat.rvt >= maxRavit) {
            lastRavit.ok = false;
        }
        lastRavit.exists = true;
    } else {
        maxRavit = 36;
        lastRavit.ok = true;
        lastRavit.exists = false;
    }
    lastRavit.max = maxRavit;
    return lastRavit;
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
    if (isStartZone) {
        bldReq = '';
    }
    if (playerInfos.bldList.includes(bldReq) || bldReq === '') {
        let ravitVolume = calcRavitVolume(myBat);
        let ravitTypeOK = false;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
                let batType = getBatType(bat);
                let ravitDistance = 1;
                if (batType.skills.includes('autoapprov') && bat.apLeft >= Math.round(batType.ap/3*2)) {
                    ravitDistance = 2;
                }
                ravitTypeOK = false;
                if (bldRav === batType.name || bldRav === '' || batType.bldEquiv.includes(bldRav) || !batType.skills.includes('ravitprod') || batType.skills.includes('ravitall')) {
                    ravitTypeOK = true;
                }
                if (batType.skills.includes('ravitaillement') && !batType.skills.includes('stockmed') && ravitTypeOK) {
                    if (calcDistance(myBat.tileId,bat.tileId) <= ravitDistance) {
                        let ravitLeft = calcRavit(bat);
                        let ravitVolOK = true;
                        if (ravitLeft >= 1) {
                            if (ravitVolOK) {
                                if (ravitVolume[2] != 'missile' || batType.skills.includes('stock') || batType.name === 'Usine d\'armement') {
                                    anyRavit = true;
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    return anyRavit;
};

function goRavit(apCost) {
    if (selectedBat.tags.includes('aU')) {
        // console.log('RAVIT');
        // console.log(selectedBat);
        let batType;
        let ravitBat = {};
        let ravitLeft = 0;
        let biggestRavit = 0;
        let isDeluge = false;
        let bldReq = '';
        if (selectedBatType.weapon.ravitBld != undefined) {
            bldReq = selectedBatType.weapon.ravitBld;
            if (selectedBat.ammo.includes('-deluge') || selectedBat.ammo.includes('-cluster')) {
                isDeluge = true;
            }
        }
        if (selectedBatType.weapon2.ravitBld != undefined) {
            bldReq = selectedBatType.weapon2.ravitBld;
            if (selectedBat.ammo2.includes('-deluge') || selectedBat.ammo2.includes('-cluster')) {
                isDeluge = true;
            }
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
                let ravitDistance = 1;
                if (batType.skills.includes('autoapprov') && bat.apLeft >= Math.round(batType.ap/3*2)) {
                    ravitDistance = 2;
                }
                ravitTypeOK = false;
                if (bldReq === batType.name || batType.bldEquiv.includes(bldReq) || !batType.skills.includes('ravitprod') || batType.skills.includes('ravitall')) {
                    ravitTypeOK = true;
                }
                if (batType.skills.includes('ravitaillement') && ravitTypeOK) {
                    ravitLeft = calcRavit(bat);
                    if (calcDistance(selectedBat.tileId,bat.tileId) <= ravitDistance && ravitLeft >= 1) {
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
                    if (!ravitBatType.skills.includes('robot') || hasEquip(ravitBat,['g2ai'])) {
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
            // console.log(bldReq);
            if (bldReq === 'Arsenal' || isDeluge) {
                selectedBat.apLeft = selectedBat.apLeft-apCost;
                if (selectedBat.rvt === undefined) {
                    selectedBat.rvt = 0;
                }
                selectedBat.rvt = selectedBat.rvt+numAmmo;
            }
            if (playerInfos.comp.log < 3) {
                selectedBat.salvoLeft = 0;
            }
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
            doneAction(ravitBat);
            tagDelete(selectedBat,'guet');
            doneAction(selectedBat);
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
            let ravitDistance = 1;
            if (batType.skills.includes('autoapprov') && bat.apLeft >= Math.round(batType.ap/3*2)) {
                ravitDistance = 2;
            }
            if (batType.skills.includes('ravitaillement')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= ravitDistance) {
                    anyRavit = true;
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
                let ravitDistance = 1;
                if (batType.skills.includes('autoapprov') && bat.apLeft >= Math.round(batType.ap/3*2)) {
                    ravitDistance = 2;
                }
                if (batType.skills.includes('ravitaillement')) {
                    ravitLeft = calcRavit(bat);
                    if (calcDistance(selectedBat.tileId,bat.tileId) <= ravitDistance) {
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
            if (playerInfos.comp.log < 3) {
                selectedBat.salvoLeft = 0;
            }
            selectedBat.tags = selectedBat.tags.filter(a => a !== 'dU');
            doneAction(ravitBat);
            tagDelete(selectedBat,'guet');
            doneAction(selectedBat);
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
            let ravitDistance = 1;
            if (batType.skills.includes('autoapprov') && bat.apLeft >= Math.round(batType.ap/3*2)) {
                ravitDistance = 2;
            }
            if (batType.skills.includes('stock')) {
                if (calcDistance(myBat.tileId,bat.tileId) <= ravitDistance) {
                    anyStock = true;
                }
            }
        }
    });
    return anyStock;
};

function goStock(apCost) {
    if (selectedBat.tags.includes('sU') || selectedBat.tags.includes('pU')) {
        let batType;
        let stockBat = {};
        let stockOK = false;
        bataillons.forEach(function(bat) {
            if (bat.loc === "zone" || bat.loc === "trans") {
                batType = getBatType(bat);
                let ravitDistance = 1;
                if (batType.skills.includes('autoapprov') && bat.apLeft >= Math.round(batType.ap/3*2)) {
                    ravitDistance = 2;
                }
                if (batType.skills.includes('stock')) {
                    if (calcDistance(selectedBat.tileId,bat.tileId) <= ravitDistance) {
                        stockOK = true;
                        stockBat = bat;
                    }
                }
            }
        });
        if (stockOK) {
            selectedBat.apLeft = selectedBat.apLeft-apCost;
            if (playerInfos.comp.log < 3) {
                selectedBat.salvoLeft = 0;
            }
            let i = 1;
            while (i <= 50) {
                if (selectedBat.tags.includes('pU')) {
                    tagIndex = selectedBat.tags.indexOf('pU');
                    selectedBat.tags.splice(tagIndex,1);
                }
                if (selectedBat.tags.includes('sU')) {
                    tagIndex = selectedBat.tags.indexOf('sU');
                    selectedBat.tags.splice(tagIndex,1);
                }
                if (!selectedBat.tags.includes('sU') && !selectedBat.tags.includes('pU')) {
                    break;
                }
                if (i > 50) {break;}
                i++
            }
            doneAction(stockBat);
            tagDelete(selectedBat,'guet');
            doneAction(selectedBat);
            selectedBatArrayUpdate();
            showBatInfos(selectedBat);
        }
    }
};
