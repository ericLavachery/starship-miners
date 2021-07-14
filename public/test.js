if (wetness >= 1) {
    if (targetWeap.ammo.includes('feu') || targetWeap.ammo.includes('incendiaire') || targetWeap.ammo.includes('napalm') || targetWeap.ammo.includes('fire') || targetWeap.ammo.includes('lf-') || targetWeap.ammo.includes('lt-') || targetWeap.ammo.includes('molotov')) {
        if (!targetWeap.ammo.includes('pyratol')) {
            targetWeap.power = Math.round(targetWeap.power*0.75);
            if (wetness >= 2) {
                targetWeap.aoe = 'unit';
            }
        }
    }
    if (targetWeap.ammo.includes('laser') || targetWeap.ammo.includes('gaz')) {
        if (wetness >= 3) {
            targetWeap.power = Math.round(targetWeap.power*0.75);
        }
    }
    if (!selectedBatType.skills.includes('resistelec') && !selectedBat.tags.includes('resistelec') && (!selectedBatType.skills.includes('hover') || selectedBatType.cat === 'aliens')) {
        if (targetWeap.ammo.includes('taser') || targetWeap.ammo.includes('electric')) {
            if (wetness >= 2) {
                targetWeap.power = Math.round(targetWeap.power*1.5);
                if (targetWeap.aoe == 'unit') {
                    targetWeap.aoe = 'brochette';
                } else if (targetWeap.aoe == 'brochette') {
                    targetWeap.aoe = 'squad';
                } else {
                    targetWeap.aoe = 'bat';
                }
            } else if (wetness === 1 && selectedBatType.cat === 'aliens') {
                targetWeap.power = Math.round(targetWeap.power*1.3);
            }
        }
    }
}
