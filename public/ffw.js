function ffw() {
    // if (playerInfos.pseudo === 'Test') {
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
            console.log('----------------------');
            console.log(alienList);
            console.log('selectedBat :');
            console.log(selectedBat);
            closeTargetRange = rand.rand(1,closeTargetRangeDice);
            alienMoveLoop();
            if (stopForFight) {
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
    // }
};
