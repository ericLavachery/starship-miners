function ffw() {
    // if (playerInfos.pseudo === 'Test') {
        isFFW = true;
        alienList.forEach(function(bat) {

            // batSelect()
            $('#report').empty('');
            tileUnselect();
            tileUntarget();
            selectedBat = JSON.parse(JSON.stringify(bat));
            console.log(selectedBat);
            // draw new selected unit
            tileSelect(bat);
            checkSelectedBatType();

            tileUntarget();
            selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
            selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
            console.log('----------------------');
            console.log(alienList);
            console.log('selectedBat :');
            console.log(selectedBat);
            closeTargetRange = rand.rand(1,closeTargetRangeDice);

            alienMoveLoop();

        });

        batUnselect();
        // terminer le tour alien (et enregistrement)
        nextTurnEnd();
        isFFW = false;
    // }
};
