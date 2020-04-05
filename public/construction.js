function bfconst() {
    $('#tileInfos').empty();
    $('#construction').empty();
    $('#construction').append('<span class="constIcon"><i class="fas fa-times-circle"></i></span>');
    $('#construction').append('<span class="constName klik cy" onclick="conOut()">Fermer Constriche</span><br>');
    $('#construction').append('<span class="constName or">LES GARS</span><br>');
    let allUnitsList = unitTypes.slice();
    sortedUnitsList = _.sortBy(_.sortBy(_.sortBy(allUnitsList,'name'),'name'),'cat');
    sortedUnitsList.forEach(function(unit) {
        if (conselUnit.id === unit.id && conselUnit.cat != 'aliens') {
            $('#construction').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
        } else {
            $('#construction').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
        }
        $('#construction').append('<span class="constName klik" onclick="conSelect('+unit.id+',`player`)">'+unit.name+'</span><br>');
    });
    $('#construction').append('<span class="constName or">LES ALIENS</span><br>');
    let allALiensList = alienUnits.slice();
    sortedAliensList = _.sortBy(_.sortBy(_.sortBy(allALiensList,'name'),'name'),'name');
    sortedAliensList.forEach(function(unit) {
        if (conselUnit.id === unit.id && conselUnit.cat === 'aliens') {
            $('#construction').append('<span class="constIcon"><i class="far fa-check-circle cy"></i></span>');
        } else {
            $('#construction').append('<span class="constIcon"><i class="far fa-circle"></i></span>');
        }
        $('#construction').append('<span class="constName klik" onclick="conSelect('+unit.id+',`aliens`)">'+unit.name+'</span><br>');
    });
}

function conSelect(unitId,player) {
    if (player === 'player') {
        let unitIndex = unitTypes.findIndex((obj => obj.id == unitId));
        conselUnit = unitTypes[unitIndex];
    } else {
        let unitIndex = alienUnits.findIndex((obj => obj.id == unitId));
        conselUnit = alienUnits[unitIndex];
    }
    console.log(conselUnit);
    bfconst();
};

function clickConstruct(tileId) {
    let nextId;
    let team;
    if (conselUnit.cat != 'aliens') {
        nextId = bataillons[bataillons.length-1].id+1;
        team = 'player';
    } else {
        nextId = aliens[aliens.length-1].id+1;
        team = 'aliens';
    }
    console.log('next ID '+nextId);
    let newBat = {};
    newBat.id = nextId;
    newBat.type = conselUnit.name;
    newBat.typeId = conselUnit.id;
    newBat.team = team;
    newBat.loc = 'zone';
    newBat.locId = 0;
    newBat.tileId = tileId;
    newBat.oldTileId = tileId;
    newBat.squadsLeft = conselUnit.squads;
    newBat.damage = 0;
    newBat.apLeft = conselUnit.ap;
    newBat.oldapLeft = conselUnit.ap;
    newBat.salvoLeft = conselUnit.maxSalvo;
    if (Object.keys(conselUnit.weapon).length >= 1) {
        newBat.ammo = conselUnit.weapon.ammo[0];
    } else {
        newBat.ammo = 'none';
    }
    if (Object.keys(conselUnit.weapon2).length >= 1) {
        newBat.ammo2 = conselUnit.weapon2.ammo[0];
    } else {
        newBat.ammo2 = 'none';
    }
    newBat.vet = 0;
    newBat.xp = 0;
    newBat.range = conselUnit.weapon.range;
    newBat.fuzz = conselUnit.fuzz;
    newBat.tags = [];
    if (newBat.team === 'player') {
        bataillons.push(newBat);
        console.log(bataillons);
        showBataillon(newBat);
    } else {
        aliens.push(newBat);
        console.log(aliens);
        showAlien(newBat);
    }
    conselUnit = {};
    bfconst();
};

function conOut() {
    $('#construction').empty();
    conselUnit = {};
};
