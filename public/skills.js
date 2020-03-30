function guet() {
    console.log('GUET');
    if (!selectedBat.tags.includes('guet')) {
        selectedBat.tags.push('guet');
    }
    selectedBat.salvoLeft = 0;
    selectedBat.apLeft = selectedBat.apLeft-5;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function tirCible() {
    console.log('TIR CIBLE');
    if (!selectedBat.tags.includes('vise')) {
        selectedBat.tags.push('vise');
    }
    selectedBat.apLeft = selectedBat.apLeft-3;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};

function medic() {
    console.log('MEDIC SKILL');
    console.log(selectedBatType);
    $('#report').empty();
    $('#report').append('<span class="report or">'+selectedBat.type+' (Soins)</span><br>');
    let unitIndex;
    let batType;
    let totalAPCost = 0;
    let xpGain = 0.1;
    let apCost = 4+selectedBatType.squads-selectedBat.squadsLeft;
    let batUnits;
    let newBatUnits;
    console.log('apCost: '+apCost);
    let maxAPCost = Math.round(selectedBatType.ap*1.5);
    bataillons.forEach(function(bat) {
        if (apCost < maxAPCost) {
            if (bat.loc === "zone" && bat.fuzz >= 0) {
                distance = calcDistance(selectedBat.tileId,bat.tileId);
                if (distance === 0) {
                    unitIndex = unitTypes.findIndex((obj => obj.id == bat.typeId));
                    batType = unitTypes[unitIndex];
                    if (batType.cat === 'infantry') {
                        if (bat.damage > 0) {
                            if (bat.id === selectedBat.id) {
                                selectedBat.damage = 0
                            } else {
                                bat.damage = 0;
                            }
                            totalAPCost = totalAPCost+apCost;
                            xpGain = xpGain+0.45;
                            $('#report').append('<span class="report cy">'+bat.type+'<br></span><span class="report">dégâts soignés<br>');
                            showBataillon(bat);
                        } else if (bat.squadsLeft < batType.squads) {
                            batUnits = bat.squadsLeft*batType.squadSize;
                            if (bat.id === selectedBat.id) {
                                selectedBat.squadsLeft = selectedBat.squadsLeft+1;
                            } else {
                                bat.squadsLeft = bat.squadsLeft+1;
                            }
                            totalAPCost = totalAPCost+apCost;
                            xpGain = xpGain+1;
                            newBatUnits = batUnits+batType.squadSize;
                            $('#report').append('<span class="report cy">'+batUnits+' '+bat.type+'<br></span><span class="report">escouade rétablie (<span class="cy">'+newBatUnits+'</span>)</span><br>');
                            showBataillon(bat);
                        }
                        console.log(bat);
                    }
                }
            }
        }
    });
    console.log('totalAPCost: '+totalAPCost);
    selectedBat.xp = selectedBat.xp+Math.round(xpGain);
    selectedBat.apLeft = selectedBat.apLeft-totalAPCost;
    selectedBatArrayUpdate();
    showBatInfos(selectedBat);
};
