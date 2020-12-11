function bfconst(cat,triche) {
    conselCat = cat;
    conselTriche = triche;
    let catz = [cat];
    if (cat === 'buildings') {
        catz.push('devices');
    }
    if (cat === 'units') {
        catz.push('infantry');
        catz.push('vehicles');
    }
    selectMode();
    findLanders();
    updateBldList();
    $("#conUnitList").css("display","block");
    $("#conAmmoList").css("display","block");
    $('#conUnitList').css("height","300px");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    let color = '';
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer</span><br>');
    let lastKind = '';
    let showkind = '';
    let allUnitsList = unitTypes.slice();
    sortedUnitsList = _.sortBy(_.sortBy(_.sortBy(allUnitsList,'name'),'cat'),'kind');
    // MENU
    if (triche) {
        $('#conUnitList').append('<br><span class="constName or" id="gentils">LES GENTILS</span><br>');
        sortedUnitsList.forEach(function(unit) {
            if (lastKind != unit.kind) {
                showkind = unit.kind.replace(/zero-/g,"");
                $('#conUnitList').append('<a href="#kind-'+unit.kind+'"><span class="constMenu mlow klik">'+showkind+'</span></a>&nbsp;&middot;&nbsp;');
            }
            lastKind = unit.kind;
        });
        $('#conUnitList').append('<a href="#mechants"><span class="constMenu mlow klik">aliens</span></a>');
        $('#conUnitList').append('<br>');
    }
    // LIST
    let prodOK = false;
    let bldOK = false;
    let costOK = false;
    let costString = '';
    sortedUnitsList.forEach(function(unit) {
        prodOK = false;
        if (triche) {
            prodOK = true;
        } else {
            if (catz.includes(unit.cat) && unit.refabTime >= 1) {
                prodOK = true;
            }
            if (!unit.bldReq.includes(selectedBatType.name) && unit.cat != 'buildings' && unit.cat != 'devices') {
                if (!selectedBatType.skills.includes('transorbital') || unit.bldReq[0] != undefined) {
                    prodOK = false;
                }
            }
            if (unit.levels[playerInfos.gang] > playerInfos.gLevel) {
                prodOK = false;
            }
        }
        if (prodOK) {
            if (lastKind != unit.kind) {
                showkind = unit.kind.replace(/zero-/g,"");
                $('#conUnitList').append('<br><a href="#gentils"><span class="constName or" id="kind-'+unit.kind+'">'+showkind+'</span></a><br>');
            }
            if (conselUnit.id === unit.id && conselUnit.cat != 'aliens') {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
            } else {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
            }
            bldOK = false;
            if ((playerInfos.bldList.includes(unit.bldReq[0]) || unit.bldReq[0] === undefined) && (playerInfos.bldList.includes(unit.bldReq[1]) || unit.bldReq[1] === undefined) && (playerInfos.bldList.includes(unit.bldReq[2]) || unit.bldReq[2] === undefined)) {
                bldOK = true;
            }
            if (triche) {
                bldOK = true;
            }
            costOK = checkUnitCost(unit);
            costString = '';
            if (unit.costs != undefined) {
                costString = toCoolString(unit.costs);
            }
            if (triche) {
                costOK = true;
            }
            if (bldOK && costOK) {
                color = catColor(unit.cat,unit.kind);
                $('#conUnitList').append('<span class="constName klik '+color+'" title="'+toNiceString(unit.bldReq)+' '+costString+'" onclick="conSelect('+unit.id+',`player`,false)">'+unit.name+'</span><br>');
            } else {
                color = 'gff';
                $('#conUnitList').append('<span class="constName klik '+color+'" title="'+toNiceString(unit.bldReq)+' '+costString+'">'+unit.name+'</span><br>');
            }
            lastKind = unit.kind;
        }
    });
    if (triche) {
        $('#conUnitList').append('<br><span class="constName or" id="mechants">LES MECHANTS</span><br><br>');
        let allALiensList = alienUnits.slice();
        sortedAliensList = _.sortBy(_.sortBy(_.sortBy(allALiensList,'name'),'name'),'kind');
        sortedAliensList.forEach(function(unit) {
            if (conselUnit.id === unit.id && conselUnit.cat === 'aliens') {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
            } else {
                $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
            }
            color = catColor(unit.cat,unit.kind);
            $('#conUnitList').append('<span class="constName klik '+color+'" onclick="conSelect('+unit.id+',`aliens`,false)">'+unit.name+'</span><br>');
        });
    }
    $('#conUnitList').append('<br>');
    commandes();
};

function catColor(cat,kind) {
    if (cat === 'aliens') {
        if (kind === 'bug') {
            return 'rose';
        }
        if (kind === 'spider') {
            return 'vert';
        }
        if (kind === 'larve') {
            return 'brun';
        }
        if (kind === 'swarm') {
            return 'jaune';
        }
    }
    if (cat === 'infantry') {
        return 'jaune';
    }
    if (cat === 'vehicles') {
        return 'vert';
    }
    if (cat === 'buildings') {
        return 'rose';
    }
    if (cat === 'devices') {
        return 'vio';
    }
};

function conSelect(unitId,player,noRefresh) {
    if (!noRefresh) {
        conselAmmos = ['xxx','xxx','xxx','xxx'];
    }
    if (player === 'player') {
        let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
        conselUnit = unitTypes[unitIndex];
    } else {
        let unitIndex = alienUnits.findIndex((obj => obj.id == unitId));
        conselUnit = alienUnits[unitIndex];
    }
    // console.log(conselUnit);
    $('#conAmmoList').empty();
    $('#conAmmoList').append('<br>');
    let armorIndex;
    let batArmor;
    let armorSkills = '';
    let listNum = 1;
    let bldReqOK = false;
    let compReqOK = false;
    if (conselUnit.protection != undefined) {
        if (conselUnit.protection.length >= 1) {
            console.log(conselUnit.protection);
            if (conselUnit.cat === 'infantry') {
                $('#conAmmoList').append('<span class="constName or">Armure</span><br>');
            } else {
                $('#conAmmoList').append('<span class="constName or">Blindage (renforcement)</span><br>');
            }
            conselUnit.protection.forEach(function(armor) {
                armorIndex = armorTypes.findIndex((obj => obj.name == armor));
                batArmor = armorTypes[armorIndex];
                compReqOK = checkCompReq(batArmor);
                if (compReqOK) {
                    if (conselAmmos[2] == armor || (conselAmmos[2] === 'xxx' && listNum === 1)) {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                    } else {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                    }
                    armorSkills = '';
                    if (batArmor.skills.includes('slowreg')) {
                        armorSkills = armorSkills+' slowreg';
                    }
                    if (batArmor.skills.includes('resistacide')) {
                        armorSkills = armorSkills+' resistacide';
                    }
                    if (batArmor.skills.includes('resistfeu')) {
                        armorSkills = armorSkills+' resistfeu';
                    }
                    bldReqOK = false;
                    if (playerInfos.bldList.includes(batArmor.bldReq[0]) || batArmor.bldReq[0] === undefined || conselUnit.name === batArmor.bldReq[0]) {
                        bldReqOK = true;
                    }
                    if (bldReqOK) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+toNiceString(batArmor.bldReq)+'" onclick="selectArmor(`'+armor+'`,`'+unitId+'`)">'+armor+' <span class="gff">('+batArmor.armor+'/'+batArmor.ap+')'+armorSkills+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batArmor.bldReq)+'">'+armor+' <span class="gff">('+batArmor.armor+'/'+batArmor.ap+')'+armorSkills+'</span></span><br>');
                    }
                }
                listNum++;
            });
        }
    }
    let equipIndex;
    let batEquip;
    let weapName;
    let equipNotes;
    listNum = 1;
    if (conselUnit.equip != undefined) {
        if (conselUnit.equip.length >= 1) {
            console.log(conselUnit.equip);
            $('#conAmmoList').append('<span class="constName or">Equipement</span><br>');
            conselUnit.equip.forEach(function(equip) {
                equipIndex = armorTypes.findIndex((obj => obj.name == equip));
                batEquip = armorTypes[equipIndex];
                compReqOK = checkCompReq(batEquip);
                if (compReqOK) {
                    if (conselAmmos[3] == equip || (conselAmmos[3] === 'xxx' && listNum === 1)) {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                    } else {
                        $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                    }
                    weapName = '';
                    equipNotes = '';
                    if (batEquip.skills != undefined) {
                        equipNotes = batEquip.skills;
                    }
                    if (equip.endsWith('1')) {
                        weapName = ' ('+conselUnit.weapon.name+')';
                    } else if (equip.endsWith('2')) {
                        weapName = ' ('+conselUnit.weapon2.name+')';
                    }
                    if (equip.startsWith('w2-') || equip.startsWith('kit-')) {
                        weapName = ' ('+conselUnit.weapon2.name+')';
                    }
                    if (equip.startsWith('w1-')) {
                        weapName = ' ('+conselUnit.weapon.name+')';
                    }
                    bldReqOK = false;
                    if ((playerInfos.bldList.includes(batEquip.bldReq[0]) || batEquip.bldReq[0] === undefined || conselUnit.name === batEquip.bldReq[0]) && (playerInfos.bldList.includes(batEquip.bldReq[1]) || batEquip.bldReq[1] === undefined || conselUnit.name === batEquip.bldReq[1])) {
                        bldReqOK = true;
                    }
                    if (bldReqOK) {
                        $('#conAmmoList').append('<span class="constName klik" title="'+showEquipInfo(equip)+'" onclick="selectEquip(`'+equip+'`,`'+unitId+'`)">'+equip+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    } else {
                        $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batEquip.bldReq)+'">'+equip+' <span class="gff">'+weapName+' '+equipNotes+'</span></span><br>');
                    }
                }
                listNum++;
            });
        }
    }
    let ammoIndex;
    let batAmmo;
    let hasW1 = false;
    if (!conselUnit.weapon.kit || conselAmmos[3].includes('w1-') || conselAmmos[3].includes('w2-')) {
        hasW1 = true;
    }
    listNum = 1;
    if (hasW1) {
        if (Object.keys(conselUnit.weapon).length >= 1) {
            if (conselUnit.weapon.ammo.length >= 1) {
                $('#conAmmoList').append('<span class="constName or">'+conselUnit.weapon.name+'</span><br>');
                conselUnit.weapon.ammo.forEach(function(ammo) {
                    ammoIndex = ammoTypes.findIndex((obj => obj.name == ammo));
                    batAmmo = ammoTypes[ammoIndex];
                    compReqOK = checkCompReq(batAmmo);
                    if (compReqOK) {
                        if (conselAmmos[0] == ammo || (conselAmmos[0] === 'xxx' && listNum === 1)) {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        } else {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        }
                        bldReqOK = false;
                        if (batAmmo.bldReq instanceof Array) {
                            if ((playerInfos.bldList.includes(batAmmo.bldReq[0]) || batAmmo.bldReq[0] === undefined || conselUnit.name === batAmmo.bldReq[0]) && (playerInfos.bldList.includes(batAmmo.bldReq[1]) || batAmmo.bldReq[1] === undefined || conselUnit.name === batAmmo.bldReq[1])) {
                                bldReqOK = true;
                            }
                        } else {
                            bldReqOK = true;
                        }
                        if (bldReqOK) {
                            $('#conAmmoList').append('<span class="constName klik" title="'+showAmmoInfo(ammo)+'" onclick="selectAmmo(`'+ammo+'`,`w1`,`'+unitId+'`)">'+showAmmo(ammo)+'</span><br>');
                        } else {
                            $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batAmmo.bldReq)+'">'+showAmmo(ammo)+'</span><br>');
                        }
                    }
                    listNum++;
                });
            }
        }
    }
    let hasW2 = false;
    if (!conselUnit.weapon2.kit || conselAmmos[3].includes('kit-') || conselAmmos[3].includes('w2-')) {
        hasW2 = true;
    }
    listNum = 1;
    if (hasW2) {
        if (Object.keys(conselUnit.weapon2).length >= 1 && !conselUnit.skills.includes('unemun')) {
            if (conselUnit.weapon2.ammo.length >= 1) {
                $('#conAmmoList').append('<span class="constName or">'+conselUnit.weapon2.name+'</span><br>');
                conselUnit.weapon2.ammo.forEach(function(ammo) {
                    ammoIndex = ammoTypes.findIndex((obj => obj.name == ammo));
                    batAmmo = ammoTypes[ammoIndex];
                    compReqOK = checkCompReq(batAmmo);
                    if (compReqOK) {
                        if (conselAmmos[1] == ammo || (conselAmmos[1] === 'xxx' && listNum === 1)) {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                        } else {
                            $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                        }
                        bldReqOK = false;
                        if (batAmmo.bldReq instanceof Array) {
                            if ((playerInfos.bldList.includes(batAmmo.bldReq[0]) || batAmmo.bldReq[0] === undefined || conselUnit.name === batAmmo.bldReq[0]) && (playerInfos.bldList.includes(batAmmo.bldReq[1]) || batAmmo.bldReq[1] === undefined || conselUnit.name === batAmmo.bldReq[1])) {
                                bldReqOK = true;
                            }
                        } else {
                            bldReqOK = true;
                        }
                        if (bldReqOK) {
                            $('#conAmmoList').append('<span class="constName klik" title="'+showAmmoInfo(ammo)+'" onclick="selectAmmo(`'+ammo+'`,`w2`,`'+unitId+'`)">'+showAmmo(ammo)+'</span><br>');
                        } else {
                            $('#conAmmoList').append('<span class="constName klik gff" title="'+toNiceString(batAmmo.bldReq)+'">'+showAmmo(ammo)+'</span><br>');
                        }
                    }
                    listNum++;
                });
            }
        }
    }
    bfconst(conselCat,conselTriche);
};

function selectAmmo(ammo,weapon,unitId) {
    if (conselUnit.skills.includes('unemun')) {
        conselAmmos[0] = ammo;
        conselAmmos[1] = ammo;
    } else {
        if (weapon === 'w1') {
            conselAmmos[0] = ammo;
        } else {
            conselAmmos[1] = ammo;
        }
    }
    // console.log(conselAmmos);
    conSelect(unitId,'player',true);
};

function selectArmor(armor,unitId) {
    conselAmmos[2] = armor;
    console.log(conselAmmos);
    conSelect(unitId,'player',true);
};

function selectEquip(equip,unitId) {
    conselAmmos[3] = equip;
    console.log(conselAmmos);
    conSelect(unitId,'player',true);
};

function checkCompReq(batEquip) {
    let compReqOK = true;
    if (batEquip.compReq != undefined) {
        if (Object.keys(batEquip.compReq).length >= 1) {
            Object.entries(batEquip.compReq).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (playerInfos.comp[key] < value) {
                    compReqOK = false;
                }
            });
        }
    }
    return compReqOK;
};

function clickConstruct(tileId,free) {
    let batHere = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            batHere = true;
        }
    });
    aliens.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            batHere = true;
        }
    });
    if (conselUnit.cat === 'buildings' || conselUnit.cat === 'devices') {
        let tile = getTileById(tileId);
        if (tile.infra != undefined && tile.infra != 'Débris') {
            batHere = true;
        }
    }
    if (!batHere) {
        if (!free) {
            let distance = calcDistance(selectedBat.tileId,tileId);
            selectedBat.apLeft = selectedBat.apLeft-Math.round(selectedBatType.mecanoCost*conselUnit.refabTime/10)-(distance*3);
            if (!selectedBat.tags.includes('construction')) {
                selectedBat.tags.push('construction');
            }
            tagDelete(selectedBat,'guet');
            camoOut();
            selectedBatArrayUpdate();
        }
        putBat(tileId,0,0);
        if (conselTriche) {
            bfconst(conselCat,conselTriche);
            $('#conAmmoList').empty();
        } else {
            conOut();
        }
    } else {
        conselUnit = {};
        conselAmmos = ['xxx','xxx','xxx','xxx'];
        $('#unitInfos').empty();
        selectMode();
        batUnstack();
        batUnselect();
    }
};

function putBat(tileId,citoyens,xp,startTag) {
    console.log('PUTBAT');
    if (Object.keys(conselUnit).length >= 1) {
        // PAY COSTS !!!
        if (!conselTriche) {
            payUnitCost(conselUnit);
        }
        let tile = getTileById(tileId);
        console.log(conselUnit);
        let nextId;
        let team;
        if (conselUnit.cat != 'aliens') {
            if (bataillons.length >= 1) {
                nextId = bataillons[bataillons.length-1].id+1;
            } else {
                nextId = 1;
            }
            team = 'player';
        } else {
            if (aliens.length >= 1) {
                nextId = aliens[aliens.length-1].id+1;
            } else {
                nextId = 1;
            }
            team = 'aliens';
        }
        // console.log('next ID '+nextId);
        let newBat = {};
        newBat.id = nextId;
        newBat.type = conselUnit.name;
        newBat.typeId = conselUnit.id;
        newBat.team = team;
        newBat.creaTurn = playerInfos.mapTurn;
        newBat.loc = 'zone';
        newBat.locId = 0;
        newBat.tileId = tileId;
        newBat.oldTileId = tileId;
        if (citoyens >= 1) {
            newBat.citoyens = citoyens;
            newBat.squadsLeft = Math.ceil(citoyens/conselUnit.squadSize);
        } else {
            newBat.citoyens = conselUnit.citoyens;
            newBat.squadsLeft = conselUnit.squads;
        }
        newBat.damage = 0;
        newBat.camoAP = -1;
        // Equip
        let equipName = conselAmmos[3];
        if (equipName === 'xxx') {
            equipName = 'aucun';
        }
        let equipIndex = armorTypes.findIndex((obj => obj.name == equipName));
        let batEquip = armorTypes[equipIndex];
        newBat.eq = equipName;
        let baseAP = conselUnit.ap;
        if (newBat.eq === 'jetpack') {
            baseAP = 17;
        }
        // Armor
        let armorName = conselAmmos[2];
        if (armorName === 'xxx') {
            armorName = 'aucune';
        }
        let armorIndex = armorTypes.findIndex((obj => obj.name == armorName));
        let batArmor = armorTypes[armorIndex];
        newBat.prt = armorName;
        newBat.armor = conselUnit.armor+batArmor.armor;
        if ((conselUnit.skills.includes('fly') || newBat.eq === 'jetpack') && batArmor.ap < 0) {
            newBat.ap = baseAP+batArmor.ap+batArmor.ap;
        } else if (conselUnit.skills.includes('strong') && batArmor.ap < -1) {
            newBat.ap = baseAP+batArmor.ap+1;
        } else if (conselUnit.moveCost === 99) {
            newBat.ap = baseAP;
        } else {
            newBat.ap = baseAP+batArmor.ap;
        }
        if (conselTriche) {
            newBat.apLeft = baseAP;
            newBat.oldapLeft = baseAP;
            newBat.salvoLeft = conselUnit.maxSalvo;
        } else {
            if (conselUnit.refabTime >= 1) {
                if (conselUnit.name == 'Champ de mines' || conselUnit.name == 'Explosifs' || conselUnit.name == 'Pièges') {
                    newBat.apLeft = 0;
                    newBat.oldapLeft = 0;
                    newBat.salvoLeft = 0;
                } else {
                    let constFactor = 25;
                    if (playerInfos.comp.const >= 1 && (conselUnit.cat === 'buildings' || conselUnit.cat === 'devices')) {
                        constFactor = Math.round(constFactor*(playerInfos.comp.const+12)/12);
                    }
                    if (playerInfos.comp.ind >= 1 && conselUnit.cat === 'vehicles') {
                        constFactor = Math.round(constFactor*(playerInfos.comp.const+5)/5);
                    }
                    if (conselUnit.skills.includes('domeconst')) {
                        newBat.apLeft = conselUnit.ap-(Math.round(conselUnit.refabTime*conselUnit.ap/constFactor)*10);
                        newBat.oldapLeft = conselUnit.ap-(Math.round(conselUnit.refabTime*conselUnit.ap/constFactor)*10);
                    } else if (conselUnit.skills.includes('longconst')) {
                        newBat.apLeft = conselUnit.ap-(Math.round(conselUnit.refabTime*conselUnit.ap/constFactor)*3);
                        newBat.oldapLeft = conselUnit.ap-(Math.round(conselUnit.refabTime*conselUnit.ap/constFactor)*3);
                    } else {
                        newBat.apLeft = conselUnit.ap-Math.round(conselUnit.refabTime*conselUnit.ap/constFactor);
                        newBat.oldapLeft = conselUnit.ap-Math.round(conselUnit.refabTime*conselUnit.ap/constFactor);
                    }
                    newBat.salvoLeft = conselUnit.maxSalvo;
                }
            } else {
                newBat.apLeft = baseAP;
                newBat.oldapLeft = baseAP;
                newBat.salvoLeft = conselUnit.maxSalvo;
            }
        }
        // Munitions
        if (conselAmmos[0] != 'xxx') {
            newBat.ammo = conselAmmos[0];
        } else {
            if (Object.keys(conselUnit.weapon).length >= 1) {
                newBat.ammo = conselUnit.weapon.ammo[0];
            } else {
                newBat.ammo = 'none';
            }
        }
        newBat.ammoLeft = conselUnit.weapon.maxAmmo;
        if (conselAmmos[1] != 'xxx') {
            newBat.ammo2 = conselAmmos[1];
        } else {
            if (Object.keys(conselUnit.weapon2).length >= 1) {
                newBat.ammo2 = conselUnit.weapon2.ammo[0];
            } else {
                newBat.ammo2 = 'none';
            }
        }
        newBat.ammo2Left = conselUnit.weapon2.maxAmmo;
        newBat.vet = 0;
        newBat.xp = xp;
        if (playerInfos.comp.train >= 1) {
            newBat.xp = newBat.xp+Math.round(playerInfos.comp.train*levelXP[1]/2);
        }
        if (Object.keys(conselUnit.weapon).length >= 1) {
            newBat.range = conselUnit.weapon.range;
            if (Object.keys(conselUnit.weapon2).length >= 1) {
                if (conselUnit.weapon2.range > conselUnit.weapon.range) {
                    newBat.range = conselUnit.weapon2.range;
                }
            }
        } else {
            newBat.range = 0;
        }
        if (conselUnit.sort != undefined) {
            newBat.sort = conselUnit.sort;
        } else {
            newBat.sort = newBat.range*10;
        }
        newBat.army = 0;
        newBat.fuzz = conselUnit.fuzz;
        if (conselUnit.transUnits >= 1) {
            newBat.transIds = [];
        }
        if (conselUnit.transRes >= 1) {
            newBat.transRes = {};
        }
        if (startTag != undefined) {
            newBat.tags = [startTag];
        } else {
            newBat.tags = [];
        }
        if (!conselTriche && conselUnit.cat != 'aliens') {
            newBat.tags.push('construction');
        }
        if (conselUnit.skills.includes('hide') || (conselUnit.kind === 'larve' && larveHIDE)) {
            newBat.tags.push('invisible');
        }
        if (batArmor.skills.includes('slowreg')) {
            newBat.tags.push('slowreg');
        }
        if (batArmor.skills.includes('resistfeu') && !newBat.tags.includes('resistfeu')) {
            newBat.tags.push('resistfeu');
        }
        if (newBat.eq === 'kit-pompiste' && !newBat.tags.includes('resistfeu')) {
            newBat.tags.push('resistfeu');
        }
        if (batArmor.skills.includes('resistacide') && !newBat.tags.includes('resistacide')) {
            newBat.tags.push('resistacide');
        }
        if (newBat.team === 'player') {
            bataillons.push(newBat);
            // console.log(bataillons);
            showBataillon(newBat);
        } else {
            aliens.push(newBat);
            // console.log(aliens);
            showAlien(newBat);
        }
        if (tile.infra === 'Débris') {
            if (conselUnit.cat === 'buildings' || conselUnit.cat === 'devices') {
                delete tile.infra;
                saveMap();
            }
        }
    } else {
        console.log('no conselUnit !');
    }
    conselUnit = {};
    conselAmmos = ['xxx','xxx','xxx','xxx'];
};

function conOut() {
    $('#conUnitList').empty();
    $('#conAmmoList').empty();
    $('#conUnitList').css("height","300px");
    conselUnit = {};
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    conselTriche = false;
    showResOpen = false;
    $("#conUnitList").css("display","none");
    $("#conAmmoList").css("display","none");
    if (Object.keys(selectedBat).length >= 1) {
        showBatInfos(selectedBat);
    }
};

$("#minimap").css("display","block");

function conWindowOut() {
    $('#conUnitList').empty();
    $('#conAmmoList').empty();
    $("#conUnitList").css("display","none");
    $("#conAmmoList").css("display","none");
};

function dismantle(batId) {
    selectMode();
    // récup de ressources
    // création du bataillon de citoyens
    let index = bataillons.findIndex((obj => obj.id == batId));
    let bat = bataillons[index];
    let isCharged = checkCharged(bat,'trans');
    let isLoaded = checkCharged(bat,'load');
    if (!isCharged && !isLoaded) {
        let batType = getBatType(bat);
        let tileId = bat.tileId;
        let crew = batType.squads*batType.squadSize*batType.crew;
        // console.log('CITOYENS:'+citoyens);
        let xp = getXp(bat);
        batUnselect();
        batDeath(bat,false);
        let batIndex = batList.findIndex((obj => obj.id == batId));
        batList.splice(batIndex,1);
        $('#b'+bat.tileId).empty();
        let resHere = showRes(bat.tileId);
        $('#b'+bat.tileId).append(resHere);
        if (batType.skills.includes('recupcit')) {
            recupCitoyens(126,tileId,crew,xp);
        }
    } else {
        alert("Vous devez vider le bataillon avant de le démanteler.");
    }
};

function recupCitoyens(unitId,tileId,citoyens,xp) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselAmmos = ['xxx','xxx','xxx','xxx'];
    putBat(tileId,citoyens,xp);
};

function getXp(bat) {
    let xp;
    if (bat.xp >= levelXP[4]) {
        xp = levelXP[4];
    } else if (bat.xp >= levelXP[3]) {
        xp = levelXP[3];
    } else if (bat.xp >= levelXP[2]) {
        xp = levelXP[2];
    } else if (bat.xp >= levelXP[1]) {
        xp = levelXP[1];
    } else {
        xp = 0;
    }
    return xp;
};

function deleteAlien(batId) {
    let index = aliens.findIndex((obj => obj.id == batId));
    let bat = aliens[index];
    batDeath(bat,false);
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    $('#b'+bat.tileId).append(resHere);
};

function putRoad() {
    console.log('PUTROAD');
    let tile = getTile(selectedBat);
    let terrain = getTileTerrain(selectedBat.tileId);
    let apCost = Math.round(selectedBatType.mecanoCost*terrain.roadBuild*roadAPCost/30);
    if (tile.infra != undefined && tile.infra != 'Débris') {
        apCost = Math.round(apCost/2);
    }
    console.log('apCost:'+apCost);
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    if (!selectedBat.tags.includes('construction')) {
        selectedBat.tags.push('construction');
    }
    tagDelete(selectedBat,'guet');
    camoOut();
    selectedBatArrayUpdate();
    tile.rd = true;
    saveMap();
    showMap(zone,false);
    showBatInfos(selectedBat);
};

function putInfra(infra) {
    console.log('INFRASTRUCTURE');
    let tile = getTile(selectedBat);
    let terrain = getTileTerrain(selectedBat.tileId);
    let infraCost;
    if (infra === 'Miradors') {
        infraCost = 9;
    } else if (infra === 'Palissades') {
        infraCost = 12;
    } else if (infra === 'Remparts') {
        infraCost = 18;
    } else if (infra === 'Murailles') {
        infraCost = 26;
    }
    // infraCost = AP for Workships
    let apCost = Math.round(Math.sqrt(selectedBatType.mecanoCost)*infraCost/1.7);
    console.log('apCost:'+apCost);
    selectedBat.apLeft = selectedBat.apLeft-apCost;
    if (!selectedBat.tags.includes('construction')) {
        selectedBat.tags.push('construction');
    }
    tagDelete(selectedBat,'guet');
    camoOut();
    selectedBatArrayUpdate();
    tile.infra = infra;
    tile.ruins = false;
    saveMap();
    showMap(zone,false);
    showBatInfos(selectedBat);
};

function updateBldList() {
    playerInfos.bldList = [];
    bataillons.forEach(function(bat) {
        if (bat.loc === "zone" || bat.loc === "trans") {
            batType = getBatType(bat);
            if (batType.cat === 'buildings' && !batType.skills.includes('nolist') && !bat.tags.includes('construction')) {
                if (!playerInfos.bldList.includes(batType.name)) {
                    playerInfos.bldList.push(batType.name);
                }
                if (batType.bldEquiv.length >= 1) {
                    batType.bldEquiv.forEach(function(bldName) {
                        if (!playerInfos.bldList.includes(bldName)) {
                            playerInfos.bldList.push(bldName);
                        }
                    });
                }
            }
        }
    });
};
