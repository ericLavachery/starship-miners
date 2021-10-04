function alienTurn() {
    $('#report').empty('');
    alienBonus();
    createAlienList();
    // show the alien NEXT button
    // -> nextAlien
};

function createAlienList() {
    let allAlienList = aliens.slice();
    let zoneAlienList = _.filter(allAlienList, function(bat) {
        return (bat.loc == 'zone' && bat.apLeft >= 1);
    });
    alienList = _.sortBy(zoneAlienList,'id');
    commandes();
    // console.log(alienList);
};

function nextAlien() {
    // activated by click
    washReports(false);
    if (Object.keys(selectedBat).length >= 1) {
        let batIndex = alienList.findIndex((obj => obj.id == selectedBat.id));
        alienList.splice(batIndex,1);
    }
    if (alienList.length >= 1) {
        batSelect(alienList[0]);
        showEnemyBatInfos(selectedBat);
        showTileInfos(selectedBat.tileId);
        tileUntarget();
        alienWeaponSelect();
        // selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
        // selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
        console.log('----------------------');
        console.log(alienList);
        console.log('selectedBat :');
        console.log(selectedBat);
        closeTargetRange = rand.rand(1,closeTargetRangeDice);
        alienMoveLoop();
    } else {
        batUnselect();
        // terminer le tour alien (et enregistrement)
        nextTurnEnd();
    }
};

function ffw() {
    console.log('$$$$$$$ START FFW');
    let outOfList = [];
    isFFW = true;
    for(let bat of alienList){
        stopForFight = false;
        $('#report').empty('');
        tileUnselect();
        tileUntarget();
        selectedBat = JSON.parse(JSON.stringify(bat));
        console.log(selectedBat);
        // draw new selected unit
        tileSelect(bat);
        checkSelectedBatType();
        // let's go
        tileUntarget();
        alienWeaponSelect();
        // selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
        // selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
        console.log('LOOP ----------------------------------------------------------------------------------------------');
        console.log(alienList);
        console.log('selectedBat= '+selectedBat.type+' **********');
        console.log(selectedBat);
        closeTargetRange = rand.rand(1,closeTargetRangeDice);
        alienMoveLoop();
        if (Object.keys(selectedBat).length >= 1) {
            outOfList.push(selectedBat.id);
        }
        if (stopForFight) {
            console.log('$$$$$$$ STOP AFTER COMBAT');
            commandes();
            break;
        }
    }
    // Remove outOfList units from alienList
    alienList.slice().reverse().forEach(function(bat,index,object) {
        if (outOfList.includes(bat.id)) {
            alienList.splice(object.length-1-index,1);
        }
    });
    outOfList = [];
    // End Alien Turn
    commandes();
    isFFW = false;
};

function alienWeaponSelect() {
    let weapUsed = 1;
    let lifeTurn = playerInfos.mapTurn-selectedBat.creaTurn;
    if (selectedBatType.w2chance >= 1) {
        if (lifeTurn % selectedBatType.w2chance === 0 && lifeTurn >= 1) {
            weapUsed = 2;
        }
    }
    if (selectedBatType.name === 'Torches' && selectedBat.tags.includes('invisible')) {
        weapUsed = 1;
    }
    if (weapUsed === 2) {
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon2));
        selectedWeap = weaponAdj(selectedWeap,selectedBat,'w2');
    } else {
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
        selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
    }
};

function alienSelectBaseWeapon() {
    selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
    selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
};
