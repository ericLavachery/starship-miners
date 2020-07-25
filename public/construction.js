function bfconst() {
    $("#conUnitList").css("display","block");
    $("#conAmmoList").css("display","block");
    $('#unitInfos').empty();
    $('#tileInfos').empty();
    $('#conUnitList').empty();
    let color = '';
    $('#conUnitList').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName klik cy" onclick="conOut()">Fermer Constriche</span><br>');
    $('#conUnitList').append('<span class="constName or">LES GENTILS</span><br>');
    let lastKind = '';
    let allUnitsList = unitTypes.slice();
    sortedUnitsList = _.sortBy(_.sortBy(_.sortBy(allUnitsList,'name'),'cat'),'kind');
    sortedUnitsList.forEach(function(unit) {
        if (lastKind != unit.kind) {
            $('#conUnitList').append('<span class="constName or">'+unit.kind+'</span><br>');
        }
        if (conselUnit.id === unit.id && conselUnit.cat != 'aliens') {
            $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
        } else {
            $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
        }
        color = catColor(unit.cat,unit.kind);
        $('#conUnitList').append('<span class="constName klik '+color+'" onclick="conSelect('+unit.id+',`player`)">'+unit.name+'</span><br>');
        lastKind = unit.kind;
    });
    $('#conUnitList').append('<span class="constName or">LES MECHANTS</span><br>');
    let allALiensList = alienUnits.slice();
    sortedAliensList = _.sortBy(_.sortBy(_.sortBy(allALiensList,'name'),'name'),'kind');
    sortedAliensList.forEach(function(unit) {
        if (conselUnit.id === unit.id && conselUnit.cat === 'aliens') {
            $('#conUnitList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
        } else {
            $('#conUnitList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
        }
        color = catColor(unit.cat,unit.kind);
        $('#conUnitList').append('<span class="constName klik '+color+'" onclick="conSelect('+unit.id+',`aliens`)">'+unit.name+'</span><br>');
    });
    commandes();
}

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
};

function conSelect(unitId,player,noRefresh) {
    if (!noRefresh) {
        conselAmmos = ['xxx','xxx'];
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
    let listNum = 1;
    if (Object.keys(conselUnit.weapon).length >= 1) {
        if (conselUnit.weapon.ammo.length >= 1) {
            $('#conAmmoList').append('<span class="constName or">'+conselUnit.weapon.name+'</span><br>');
            conselUnit.weapon.ammo.forEach(function(ammo) {
                if (conselAmmos[0] == ammo || (conselAmmos[0] === 'xxx' && listNum === 1)) {
                    $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                } else {
                    $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                }
                $('#conAmmoList').append('<span class="constName klik" onclick="selectAmmo(`'+ammo+'`,`w1`,`'+unitId+'`)">'+showAmmo(ammo)+'</span><br>');
                listNum++;
            });
        }
    }
    listNum = 1;
    if (Object.keys(conselUnit.weapon2).length >= 1) {
        if (conselUnit.weapon2.ammo.length >= 1) {
            $('#conAmmoList').append('<span class="constName or">'+conselUnit.weapon2.name+'</span><br>');
            conselUnit.weapon2.ammo.forEach(function(ammo) {
                if (conselAmmos[1] == ammo || (conselAmmos[1] === 'xxx' && listNum === 1)) {
                    $('#conAmmoList').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
                } else {
                    $('#conAmmoList').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
                }
                $('#conAmmoList').append('<span class="constName klik" onclick="selectAmmo(`'+ammo+'`,`w2`,`'+unitId+'`)">'+showAmmo(ammo)+'</span><br>');
                listNum++;
            });
        }
    }
    bfconst();
};

function selectAmmo(ammo,weapon,unitId) {
    if (weapon === 'w1') {
        conselAmmos[0] = ammo;
    } else {
        conselAmmos[1] = ammo;
    }
    // console.log(conselAmmos);
    conSelect(unitId,'player',true);
};

function clickConstruct(tileId) {
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
    if (!batHere) {
        putBat(tileId,0,0);
        bfconst();
        $('#conAmmoList').empty();
    } else {
        conselUnit = {};
        conselAmmos = ['xxx','xxx'];
        $('#unitInfos').empty();
        selectMode();
        batUnstack();
        batUnselect();
    }
};

function putBat(tileId,citoyens,xp,startTag) {
    console.log('PUTBAT');
    if (Object.keys(conselUnit).length >= 1) {
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
        if (conselUnit.name == 'Champ de mines' || conselUnit.name == 'Explosifs') {
            newBat.apLeft = 0;
            newBat.oldapLeft = 0;
            newBat.salvoLeft = 0;
        } else {
            newBat.apLeft = conselUnit.ap;
            newBat.oldapLeft = conselUnit.ap;
            newBat.salvoLeft = conselUnit.maxSalvo;
        }
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
        if (conselUnit.skills.includes('hide')) {
            newBat.tags.push('invisible');
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
    } else {
        console.log('no conselUnit !');
    }
    conselUnit = {};
    conselAmmos = ['xxx','xxx'];
};

function conOut() {
    $('#conUnitList').empty();
    $('#conAmmoList').empty();
    conselUnit = {};
    conselAmmos = ['xxx','xxx'];
    $("#conUnitList").css("display","none");
    $("#conAmmoList").css("display","none");
};

function dismantle(batId) {
    // récup de ressources
    // création du bataillon de citoyens
    let index = bataillons.findIndex((obj => obj.id == batId));
    let bat = bataillons[index];
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
};

function recupCitoyens(unitId,tileId,citoyens,xp) {
    let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
    conselUnit = unitTypes[unitIndex];
    conselAmmos = ['xxx','xxx'];
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
