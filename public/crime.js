function setPenitLevel() {
    let penitNum = 0;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('penitbat')) {
            penitNum = penitNum+1;
        }
    });
    playerInfos.penit = Math.ceil((playerInfos.crime+4)*penitNum/4);
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('penitbat')) {
            bat.tdc = getCamionEquips(batType);
        } else if (bat.tdc === undefined) {
            bat.tdc = [];
        }
    });
};

function getCamionEquips(batType) {
    let camion = [];
    // tous sauf tôlards
    if (batType.equip.includes('e-camo') && playerInfos.penit >= 2) {
        let equip = getEquipByName('e-camo');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-camo');
        }
    }
    // tous
    if (batType.equip.includes('e-ranger') && playerInfos.penit >= 3) {
        let equip = getEquipByName('e-ranger');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-ranger');
        }
    }
    // Tôlards (revolver)
    if (batType.equip.includes('chargeur2') && playerInfos.penit >= 4) {
        let equip = getEquipByName('chargeur2');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('chargeur2');
        }
    }
    // Desperados (uzi), Krimulos (pompe), Gangsters (magnum)
    if (batType.equip.includes('chargeur1') && batType.name != 'Détenus' && playerInfos.penit >= 4) {
        let equip = getEquipByName('chargeur1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('chargeur1');
        }
    }
    // Détenus (calibre)
    if (batType.equip.includes('lunette1') && playerInfos.penit >= 4) {
        let equip = getEquipByName('lunette1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('lunette1');
        }
    }
    // Raiders (javelots), Sinyaki (dynamite)
    if (batType.equip.includes('gilet') && playerInfos.penit >= 4) {
        let equip = getEquipByName('gilet');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('gilet');
        }
    }
    // tous
    if (batType.equip.includes('e-flash') && playerInfos.penit >= 5) {
        let equip = getEquipByName('e-flash');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-flash');
        }
    }
    // Sinyaki (dynamite)
    if (batType.equip.includes('lanceur2') && playerInfos.penit >= 5) {
        let equip = getEquipByName('lanceur2');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('lanceur2');
        }
    }
    // tôlards (revolver)
    if (batType.equip.includes('silencieux2') && playerInfos.penit >= 5) {
        let equip = getEquipByName('silencieux2');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('silencieux2');
        }
    }
    // détenus (calibre)
    if (batType.equip.includes('silencieux1') && playerInfos.penit >= 5) {
        let equip = getEquipByName('silencieux1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('silencieux1');
        }
    }
    // Détenus (calibre)
    if (batType.equip.includes('chargeur1') && batType.name === 'Détenus' && playerInfos.penit >= 6) {
        let equip = getEquipByName('chargeur1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('chargeur1');
        }
    }
    // tous
    if (batType.equip.includes('e-medic') && playerInfos.penit >= 7) {
        let equip = getEquipByName('e-medic');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-medic');
        }
    }
    // tous sauf tôlards
    if (batType.equip.includes('waterproof') && playerInfos.penit >= 8) {
        let equip = getEquipByName('waterproof');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('waterproof');
        }
    }
    // Tôlards (torche), Sinyaki (batte)
    if (batType.weapon.isMelee && playerInfos.penit >= 9) {
        camion.push('fineclub');
    }
    // Gangsters (toothbrush)
    if (batType.weapon2.isMelee && playerInfos.penit >= 9) {
        camion.push('fineclub');
    }
    // tous
    if (batType.equip.includes('theeye') && playerInfos.penit >= 10) {
        let equip = getEquipByName('theeye');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('theeye');
        }
    }
    // Tôlards (torche), Sinyaki (batte), Raiders (javelots)
    if (batType.equip.includes('helper') && playerInfos.penit >= 12) {
        let equip = getEquipByName('helper');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('helper');
        }
    }
    // Tôlards, Sinyaki, Gangsters, Détenus
    if (batType.equip.includes('repel') && playerInfos.penit >= 14) {
        let equip = getEquipByName('repel');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('repel');
        }
    }
    return camion;
};

// CRIMEKITS
// crimekitch
// ranger, camo, chargeur1
// crimekitgi
// ranger, camo, lanceur2, gilet, bonus melee
// crimekitlu
// ranger, camo, lunette1
// crimekitto
// ranger, resistfeu, chargeur2, bonus melee
