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
    if (Object.keys(selectedBat).length >= 1) {
        let batIndex = alienList.findIndex((obj => obj.id == selectedBat.id));
        alienList.splice(batIndex,1);
    }
    if (alienList.length >= 1) {
        batSelect(alienList[0]);
        showEnemyBatInfos(selectedBat);
        showTileInfos(selectedBat.tileId);
        tileUntarget();
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
        selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
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
    let batIndex;
    isFFW = true;
    for(let bat of alienList){
        stopForFight = false;
        // batSelect()
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
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
        selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
        console.log('LOOP ----------------------------------------------------------------------------------------------');
        console.log(alienList);
        console.log('selectedBat= '+selectedBat.type+' **********');
        console.log(selectedBat);
        closeTargetRange = rand.rand(1,closeTargetRangeDice);
        alienMoveLoop();
        if (Object.keys(selectedBat).length >= 1) {
            batIndex = alienList.findIndex((obj => obj.id == selectedBat.id));
            alienList.splice(batIndex,1);
        }
        if (stopForFight) {
            console.log('$$$$$$$ STOP AFTER COMBAT');
            commandes();
            break;
        }
    }
    // alienList.forEach(function(bat) {
    //     // batSelect()
    //     $('#report').empty('');
    //     tileUnselect();
    //     tileUntarget();
    //     selectedBat = JSON.parse(JSON.stringify(bat));
    //     console.log(selectedBat);
    //     // draw new selected unit
    //     tileSelect(bat);
    //     checkSelectedBatType();
    //     // let's go
    //     tileUntarget();
    //     selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
    //     selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
    //     console.log('----------------------');
    //     console.log(alienList);
    //     console.log('selectedBat :');
    //     console.log(selectedBat);
    //     closeTargetRange = rand.rand(1,closeTargetRangeDice);
    //     alienMoveLoop();
    // });
    if (alienList.length < 1) {
        batUnselect();
        nextTurnEnd();
        isFFW = false;
    }
};
