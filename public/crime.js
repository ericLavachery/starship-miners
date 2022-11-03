function setPenitLevel() {
    let penitNum = -1;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('penitbat')) {
            penitNum = penitNum+1;
        }
    });
    if (penitNum < 0) {
        penitNum = 0;
    }
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
    if (batType.equip.includes('e-flash') && playerInfos.penit >= 4) {
        let equip = getEquipByName('e-flash');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-flash');
        }
    }
    if (batType.equip.includes('e-ranger') && playerInfos.penit >= 3) {
        let equip = getEquipByName('e-ranger');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-ranger');
        }
    }
    if (batType.equip.includes('e-camo') && playerInfos.penit >= 2) {
        let equip = getEquipByName('e-camo');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-camo');
        }
    }
    if (batType.equip.includes('lunette1') && playerInfos.penit >= 5) {
        let equip = getEquipByName('lunette1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('lunette1');
        }
    }
    if (batType.equip.includes('chargeur1') && playerInfos.penit >= 4) {
        let equip = getEquipByName('chargeur1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('chargeur1');
        }
    }
    if (batType.equip.includes('chargeur2') && playerInfos.penit >= 3) {
        let equip = getEquipByName('chargeur2');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('chargeur2');
        }
    }
    if (batType.equip.includes('lanceur2') && playerInfos.penit >= 5) {
        let equip = getEquipByName('lanceur2');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('lanceur2');
        }
    }
    if (batType.equip.includes('silencieux1') && playerInfos.penit >= 6) {
        let equip = getEquipByName('silencieux1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('silencieux1');
        }
    }
    if (batType.equip.includes('silencieux2') && playerInfos.penit >= 5) {
        let equip = getEquipByName('silencieux2');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('silencieux2');
        }
    }
    if (batType.equip.includes('gilet') && playerInfos.penit >= 3) {
        let equip = getEquipByName('gilet');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('gilet');
        }
    }
    if (batType.equip.includes('e-medic') && playerInfos.penit >= 7) {
        let equip = getEquipByName('e-medic');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-medic');
        }
    }
    if (batType.equip.includes('helper') && playerInfos.penit >= 8) {
        let equip = getEquipByName('helper');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('helper');
        }
    }
    if (batType.equip.includes('theeye') && playerInfos.penit >= 9) {
        let equip = getEquipByName('theeye');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('theeye');
        }
    }
    if (batType.equip.includes('waterproof') && playerInfos.penit >= 10) {
        let equip = getEquipByName('waterproof');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('waterproof');
        }
    }
    if (batType.equip.includes('repel') && playerInfos.penit >= 11) {
        let equip = getEquipByName('repel');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('repel');
        }
    }
    return camion;
};
