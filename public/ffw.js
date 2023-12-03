function alienTurn() {
    $('#report').empty('');
    ectoControl();
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
    alienTheme(false);
    washReports(false);
    if (Object.keys(selectedBat).length >= 1) {
        let batIndex = alienList.findIndex((obj => obj.id == selectedBat.id));
        alienList.splice(batIndex,1);
    }
    if (alienList.length >= 1) {
        batSelect(alienList[0]);
        showTileInfos(selectedBat.tileId);
        showEnemyBatInfos(selectedBat);
        alienWeaponSelect();
        console.log('----------------------');
        console.log(alienList);
        console.log('selectedBat :');
        console.log(selectedBat);
        closeTargetRange = rand.rand(1,closeTargetRangeDice);
        if (selectedBat.pdm != undefined && !selectedBat.tags.includes('heard')) {
            closeTargetRange = rand.rand(closeTargetRangeDice-1,closeTargetRangeDice+2);
        }
        alienMoveLoop();
    } else {
        batUnselect();
        // terminer le tour alien (et enregistrement)
        nextTurnEnd();
    }
};

function ffw() {
    console.log('$$$$$$$ START FFW');
    alienTheme(false);
    let outOfList = [];
    isFFW = true;
    for(let bat of alienList){
        stopForFight = false;
        $('#report').empty('');
        tileUnselect();
        selectedBat = JSON.parse(JSON.stringify(bat));
        console.log(selectedBat);
        // draw new selected unit
        tileSelect(bat);
        checkSelectedBatType();
        // let's go
        alienWeaponSelect();
        console.log('LOOP ----------------------------------------------------------------------------------------------');
        console.log(alienList);
        console.log('selectedBat= '+selectedBat.type+' **********');
        console.log(selectedBat);
        closeTargetRange = rand.rand(1,closeTargetRangeDice);
        if (selectedBat.pdm != undefined && !selectedBat.tags.includes('heard')) {
            closeTargetRange = rand.rand(closeTargetRangeDice-1,closeTargetRangeDice+2);
        }
        alienMoveLoop();
        if (Object.keys(selectedBat).length >= 1) {
            if (stopForFight && selectedBat.salvoLeft >= 1 && selectedBat.apLeft >= 1 && selectedBat.squadsLeft >= 1) {
                // reste sur l'unité
            } else {
                outOfList.push(selectedBat.id);
            }
        }
        if (stopForFight) {
            blockThem(true);
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
    if (selectedBatType.name === 'Surfeuses') {
        let tile = getTile(selectedBat);
        if (tile.terrain === 'S' || tile.terrain === 'W' || tile.terrain === 'L' || tile.terrain === 'R') {
            weapUsed = 2;
        }
    }
    if (selectedBatType.skills.includes('byebye')) {
        let byeChance = 100-(100/(selectedBatType.squads-1)*(selectedBat.squadsLeft-1));
        if (rand.rand(1,100) <= byeChance) {
            weapUsed = 2;
        } else {
            weapUsed = 1;
        }
    }
    if (selectedBatType.name === 'Torches' && selectedBat.tags.includes('invisible')) {
        weapUsed = 1;
    }
    if (selectedBatType.skills.includes('wselect')) {
        let blobRange = selectedBatType.weapon.range;
        let blobTerrain = getTerrain(selectedBat);
        if (blobTerrain === 'H') {
            if (selectedBatType.weapon.elevation >= 3) {
                blobRange = blobRange+2;
            } else if (selectedBatType.weapon.elevation >= 1) {
                blobRange = blobRange+1;
            }
        } else if (blobTerrain === 'M') {
            if (selectedBatType.weapon.elevation >= 3) {
                blobRange = blobRange+3;
            } else if (selectedBatType.weapon.elevation >= 2) {
                blobRange = blobRange+2;
            } else if (selectedBatType.weapon.elevation >= 1) {
                blobRange = blobRange+1;
            }
        }
        let infInRange = false;
        let mecInRange = false;
        bataillons.forEach(function(bat) {
            if (!infInRange || !mecInRange) {
                if (bat.loc === "zone" && bat.fuzz > -2) {
                    let distance = calcDistance(selectedBat.tileId,bat.tileId);
                    if (distance <= blobRange) {
                        let batType = getBatType(bat);
                        if (batType.cat === 'infantry' && !bat.tags.includes('necro')) {
                            infInRange = true;
                        } else {
                            mecInRange = true;
                        }
                    }
                }
            }
        });
        if (!infInRange && mecInRange) {
            weapUsed = 2;
        } else if (infInRange && !mecInRange) {
            weapUsed = 1;
        }
    }
    if (weapUsed === 2) {
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon2));
        selectedWeap = weaponAdj(selectedWeap,selectedBat,'w2');
    } else {
        selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
        selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
    }
    sWipe = false;
};

function alienSelectBaseWeapon() {
    selectedWeap = JSON.parse(JSON.stringify(selectedBatType.weapon));
    selectedWeap = weaponAdj(selectedWeap,selectedBat,'w1');
    sWipe = false;
};
