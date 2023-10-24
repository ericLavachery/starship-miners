function checkCrimes(crimeRate,time,afterMission) {
    // % en fonction de time!!!!!
    // severity 1-10 (max 10)
    console.log('KRYMEZ --------------------------------------------------------------------------------------------------------------');
    console.log('playerInfos.crime='+playerInfos.crime);
    if (playerInfos.pseudo === 'Xxxxxx') {
        // let testSev = 1;
        // crimeVol(testSev,afterMission); // 6
        // crimeHoldUp(testSev,afterMission); // 3
        // crimeVandalisme(testSev,afterMission); // 3
        // crimeBagarre(testSev,afterMission); // 4
        // crimeMeurtre(testSev,afterMission); // 2
        // crimeIncendie(testSev,afterMission); // 2
        // crimeEmeute(testSev,afterMission); // 1
    } else if (playerInfos.crime >= 5) {
        let adjTime = time;
        if (afterMission) {
            adjTime = Math.ceil(adjTime/2);
        }
        let crimeChance = Math.round((playerInfos.crime-3)*adjTime/7);
        console.log('crimeChance='+crimeChance);
        if (rand.rand(1,100) <= crimeChance) {
            whichCrime(crimeRate,afterMission);
        }
    }
    warning('','',true);
};

function whichCrime(crimeRate,afterMission) {
    // playerInfos.vitals : plus de vols
    // playerInfos.penit : plus de vols et holdups
    // playerInfos.crime : plus grave
    let myCrime = playerInfos.crime-3;
    let severity = rand.rand(1,3)+Math.floor((playerInfos.crime-5)/1.35)-2;
    if (severity > 10) {severity = 10;}
    if (severity < 1) {severity = 1;}
    let slot = {};
    slot.vol = 4+Math.round((playerInfos.vitals+playerInfos.penit+myCrime)/2);
    slot.hup = 1+Math.round((playerInfos.penit+myCrime)/2);
    slot.vand = 0+myCrime-playerInfos.vitals;
    if (slot.vand < 1) {slot.vand = 1;}
    slot.bag = 4+myCrime-Math.round(playerInfos.vitals/2);
    if (slot.bag < 4) {slot.bag = 4;}
    slot.fire = -2+myCrime-Math.round(playerInfos.vitals/2);
    if (slot.fire < 0) {slot.fire = 0;}
    slot.kill = -3+myCrime;
    if (slot.kill < 0) {slot.kill = 0;}
    slot.riot = -6+myCrime;
    if (slot.riot < 0) {slot.riot = 0;}
    let crimeDiceMax = slot.vol+slot.hup+slot.vand+slot.bag+slot.fire+slot.kill+slot.riot;
    console.log('vol='+slot.vol+'/'+crimeDiceMax);
    console.log('hup='+slot.hup+'/'+crimeDiceMax);
    console.log('vand='+slot.vand+'/'+crimeDiceMax);
    console.log('bag='+slot.bag+'/'+crimeDiceMax);
    console.log('fire='+slot.fire+'/'+crimeDiceMax);
    console.log('kill='+slot.kill+'/'+crimeDiceMax);
    console.log('riot='+slot.riot+'/'+crimeDiceMax);
    let crimeDice = rand.rand(1,crimeDiceMax);
    if (crimeDice <= slot.vol) {
        severity = rand.rand(1,3)+Math.floor((playerInfos.vitals+playerInfos.penit-5+playerInfos.crime-5)/1.35)-2;
        if (severity > 10) {severity = 10;}
        if (severity < 1) {severity = 1;}
        crimeVol(severity,afterMission);
        if (playerInfos.vitals >= 2) {
            crimeVol(severity,afterMission);
        }
    } else if (crimeDice <= slot.vol+slot.hup) {
        severity = rand.rand(1,3)+Math.floor((playerInfos.penit-5+playerInfos.crime-5)/1.35)-2;
        if (severity > 10) {severity = 10;}
        if (severity < 1) {severity = 1;}
        crimeHoldUp(severity,afterMission);
        if (playerInfos.penit >= 10) {
            crimeVol(severity,afterMission);
        }
    } else if (crimeDice <= slot.vol+slot.hup+slot.vand) {
        crimeVandalisme(severity,afterMission);
    } else if (crimeDice <= slot.vol+slot.hup+slot.vand+slot.bag) {
        crimeBagarre(severity,afterMission);
    } else if (crimeDice <= slot.vol+slot.hup+slot.vand+slot.bag+slot.fire) {
        crimeIncendie(severity,afterMission);
    } else if (crimeDice <= slot.vol+slot.hup+slot.vand+slot.bag+slot.fire+slot.kill) {
        crimeMeurtre(severity,afterMission);
    } else if (crimeDice <= slot.vol+slot.hup+slot.vand+slot.bag+slot.fire+slot.kill+slot.riot) {
        crimeEmeute(severity,afterMission);
    }
};

function crimeVol(severity,afterMission) {
    let mildness = 11-severity;
    warning('<span class="hblanc"><br>&blacktriangleright; Vols</span>','Sévérité '+severity,true);
    let theTheft = resTheft(severity);
    warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    if (rand.rand(1,mildness) === 1) {
        theTheft = resTheft(severity);
        warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    }
};

function crimeHoldUp(severity,afterMission) {
    let mildness = 11-severity;
    warning('<span class="hblanc"><br>&blacktriangleright; Cambriolage</span>','Sévérité '+severity,true);
    let theTheft = resTheft(severity);
    warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    theTheft = resTheft(severity);
    warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    theTheft = resTheft(severity);
    warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    if (rand.rand(1,3) === 1) {
        theTheft = resTheft(severity);
        warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    }
    if (rand.rand(1,3) === 1) {
        theTheft = resTheft(severity);
        warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    }
    if (rand.rand(1,mildness) === 1) {
        theTheft = resTheft(severity);
        warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    }
    if (rand.rand(1,mildness) === 1) {
        theTheft = resTheft(severity);
        warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    }
    // bat.soins ++
    if (rand.rand(1,mildness) === 1) {
        let theTrash = infWound(severity,afterMission,true);
        if (theTrash != '') {
            warning('Unités blessées','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    // perte de citoyens
    if (severity >= 6) {
        if (rand.rand(1,mildness+2) === 1) {
            let deadCits = citMurder(Math.ceil(severity/3));
            if (deadCits.num >= 1) {
                warning('Fatalités','<span class="hrouge">'+deadCits.num+' '+deadCits.type+' morts</span>',true);
            }
        }
    }
};

function crimeVandalisme(severity,afterMission) {
    let mildness = 11-severity;
    warning('<span class="hblanc"><br>&blacktriangleright; Vandalisme</span>','Sévérité '+severity,true);
    // bâtiments endommagés
    let theTrash = bldTrash(severity,afterMission);
    if (theTrash != '') {
        warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
    }
    if (rand.rand(1,mildness) === 1) {
        theTrash = bldTrash(3,afterMission);
        if (theTrash != '') {
            warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    // véhicules endommagés
    if (rand.rand(1,6) === 1) {
        theTrash = vehiTrash(5,afterMission);
        if (theTrash != '') {
            warning('Véhicules endommagé','<span class="rose">'+theTrash+'</span>',true);
        }
    }
};

function crimeIncendie(severity,afterMission) {
    let mildness = 11-severity;
    warning('<span class="hblanc"><br>&blacktriangleright; Incendie</span>','Sévérité '+severity,true);
    // bâtiments endommagés
    let theTrash = bldTrash(severity*2,afterMission);
    if (theTrash != '') {
        warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
    }
    if (rand.rand(1,3) === 1) {
        theTrash = bldTrash(severity-1,afterMission);
        if (theTrash != '') {
            warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    if (rand.rand(1,3) === 1) {
        theTrash = bldTrash(severity-1,afterMission);
        if (theTrash != '') {
            warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    // véhicules endommagés
    if (rand.rand(1,3) === 1) {
        theTrash = vehiTrash(10,afterMission);
        if (theTrash != '') {
            warning('Véhicules endommagé','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    // bat.soins ++
    if (rand.rand(1,mildness) === 1) {
        theTrash = infWound(severity,afterMission,false);
        if (theTrash != '') {
            warning('Unités blessées','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    // perte de citoyens
    if (rand.rand(1,mildness) === 1) {
        let deadCits = citMurder(Math.ceil(severity/2));
        if (deadCits.num >= 1) {
            warning('Fatalités','<span class="hrouge">'+deadCits.num+' '+deadCits.type+' morts</span>',true);
        }
    }
};

function crimeBagarre(severity,afterMission) {
    let mildness = 11-severity;
    warning('<span class="hblanc"><br>&blacktriangleright; Bagarres</span>','Sévérité '+severity,true);
    // bâtiments endommagés
    let theTrash = bldTrash(severity,afterMission);
    if (theTrash != '') {
        warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
    }
    // bat.soins ++
    theTrash = infWound(severity,afterMission,false);
    if (theTrash != '') {
        warning('Unités blessées','<span class="rose">'+theTrash+'</span>',true);
    }
    theTrash = infWound(severity,afterMission,false);
    if (theTrash != '') {
        warning('Unités blessées','<span class="rose">'+theTrash+'</span>',true);
    }
    // perte de citoyens
    if (rand.rand(1,mildness) === 1) {
        let deadCits = citMurder(Math.ceil(severity/3));
        if (deadCits.num >= 1) {
            warning('Fatalités','<span class="hrouge">'+deadCits.num+' '+deadCits.type+' morts</span>',true);
        }
    }
    // perte de gardes
    if (severity >= 10) {
        if (rand.rand(1,5) === 1) {
            let killName = fuckThePolice();
            if (killName != '') {
                warning('Fatalités','<span class="hrouge">'+killName+' tués</span>',true);
            }
        }
    }
};

function crimeMeurtre(severity,afterMission) {
    let mildness = 11-severity;
    warning('<span class="hblanc"><br>&blacktriangleright; Meutres</span>','Sévérité '+severity,true);
    // perte de citoyens
    let deadCits = citMurder(Math.ceil(severity/2));
    if (deadCits.num >= 1) {
        warning('Fatalités','<span class="hrouge">'+deadCits.num+' '+deadCits.type+' morts</span>',true);
    }
    // perte de gardes
    if (severity >= 10) {
        if (rand.rand(1,3) === 1) {
            let killName = fuckThePolice();
            if (killName != '') {
                warning('Fatalités','<span class="hrouge">'+killName+' tués</span>',true);
            }
        }
    }
};

function crimeEmeute(severity,afterMission) {
    let mildness = 11-severity;
    warning('<span class="hblanc"><br>&blacktriangleright; Emeute</span>','Sévérité '+severity,true);
    // bâtiments endommagés
    let theTrash = bldTrash(severity+2,afterMission);
    if (theTrash != '') {
        warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
    }
    theTrash = bldTrash(severity,afterMission);
    if (theTrash != '') {
        warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
    }
    if (rand.rand(1,mildness) === 1) {
        theTrash = bldTrash(severity,afterMission);
        if (theTrash != '') {
            warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    if (rand.rand(1,mildness) === 1) {
        theTrash = bldTrash(severity*2,afterMission);
        if (theTrash != '') {
            warning('Bâtiment endommagé','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    // véhicules endommagés
    theTrash = vehiTrash(severity+2,afterMission);
    if (theTrash != '') {
        warning('Véhicules endommagé','<span class="rose">'+theTrash+'</span>',true);
    }
    if (rand.rand(1,2) === 1) {
        theTrash = vehiTrash(severity+2,afterMission);
        if (theTrash != '') {
            warning('Véhicules endommagé','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    // bat.soins ++
    theTrash = infWound(severity,afterMission,true);
    if (theTrash != '') {
        warning('Unités blessées','<span class="rose">'+theTrash+'</span>',true);
    }
    if (rand.rand(1,mildness+1) === 1) {
        theTrash = infWound(severity,afterMission,true);
        if (theTrash != '') {
            warning('Unités blessées','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    if (rand.rand(1,mildness+1) === 1) {
        theTrash = infWound(severity,afterMission,true);
        if (theTrash != '') {
            warning('Unités blessées','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    if (rand.rand(1,mildness+2) === 1) {
        theTrash = infWound(severity,afterMission,true);
        if (theTrash != '') {
            warning('Unités blessées','<span class="rose">'+theTrash+'</span>',true);
        }
    }
    // perte de citoyens
    let deadCits = citMurder(severity);
    if (deadCits.num >= 1) {
        warning('Fatalités','<span class="hrouge">'+deadCits.num+' '+deadCits.type+' morts</span>',true);
    }
    // perte de gardes
    if (severity >= 6) {
        if (rand.rand(1,mildness+2) === 1) {
            let killName = fuckThePolice();
            if (killName != '') {
                warning('Fatalités','<span class="hrouge">'+killName+' tués</span>',true);
            }
        }
    }
    // perte de ressources
    let theTheft = resTheft(severity);
    warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    theTheft = resTheft(severity);
    warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    theTheft = resTheft(severity);
    warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    theTheft = resTheft(severity);
    warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    theTheft = resTheft(severity);
    warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    if (rand.rand(1,2) === 1) {
        theTheft = resTheft(severity);
        warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    }
    if (rand.rand(1,3) === 1) {
        theTheft = resTheft(severity);
        warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    }
    if (rand.rand(1,mildness) === 1) {
        theTheft = resTheft(severity);
        warning('Vol de ressources',theTheft.name+':<span class="rose">-'+theTheft.num+'</span>',true);
    }
};

function fuckThePolice() {
    let killId = -1;
    let killName = '';
    deadBatsList = [];
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (killId < 0) {
            let batType = getBatType(bat);
            if (batType.skills.includes('garde')) {
                killId = bat.id;
                killName = batType.name;
                deadBatsList.push(bat.id);
            }
        }
    });
    if (killId >= 0) {
        killBatList();
    }
    return killName;
};

function citMurder(severity) {
    let deadCits = {};
    deadCits.num = rand.rand(Math.ceil(severity/4),severity);
    if (rand.rand(1,ruinsCrimChance) === 1) {
        deadCits.type = 'Criminels';
    } else {
        deadCits.type = 'Citoyens';
    }
    deadCits = getCitDeath(deadCits.type,deadCits.num,false);
    return deadCits;
};

function infWound(severity,afterMission,isCrime) {
    // severity average = 5
    let trashedBldId = -1;
    let theLoop = 0;
    let bldName = '';
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (trashedBldId < 0) {
            let batType = getBatType(bat);
            if (batType.cat === 'infantry' && batType.name != 'Citoyens' && batType.name != 'Criminels') {
                if (!batType.skills.includes('notrash')) {
                    let trashChance = 10;
                    if (batType.skills.includes('brigands')) {
                        if (batType.skills.includes('gcrim')) {
                            trashChance = 75;
                        } else {
                            trashChance = 50;
                        }
                    }
                    if (batType.skills.includes('garde') && isCrime) {
                        trashChance = 100;
                    }
                    trashChance = trashChance+theLoop;
                    if (rand.rand(1,100) <= trashChance) {
                        trashedBldId = bat.id;
                    }
                    theLoop = theLoop+10;
                }
            }
        }
    });
    if (trashedBldId >= 0) {
        let trashedBld = getBatById(trashedBldId);
        let trashedBldType = getBatType(trashedBld);
        bldName = trashedBldType.name;
        let trashLevel = Math.ceil(playerInfos.crime*2*rand.rand(severity,(severity*5))/15/5);
        let maxTrash = Math.ceil(severity*5*rand.rand(10,30)/20);
        if (trashLevel >= maxTrash) {
            trashLevel = maxTrash;
        }
        if (trashedBld.soins != undefined) {
            trashedBld.soins = trashedBld.soins+trashLevel;
        } else {
            trashedBld.soins = trashLevel;
        }
        if (trashedBld.loc === 'trans' && trashedBld.locId != souteId && !afterMission) {
            batUndeployFrom(trashedBld.id,trashedBld.locId);
        }
    }
    return bldName;
};

function vehiTrash(severity,afterMission) {
    // severity average = 5
    let trashedBldId = -1;
    let theLoop = 0;
    let bldName = '';
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (trashedBldId < 0) {
            let batType = getBatType(bat);
            if (batType.cat === 'vehicles' && !batType.skills.includes('robot') && !batType.skills.includes('cyber') && !batType.skills.includes('transorbital')) {
                if (!batType.skills.includes('notrash')) {
                    let trashChance = 100;
                    trashChance = trashChance+theLoop;
                    if (rand.rand(1,100) <= trashChance) {
                        trashedBldId = bat.id;
                    }
                    theLoop = theLoop+10;
                }
            }
        }
    });
    if (trashedBldId >= 0) {
        let trashedBld = getBatById(trashedBldId);
        let trashedBldType = getBatType(trashedBld);
        bldName = trashedBldType.name;
        let trashLevel = Math.ceil(playerInfos.crime*2*rand.rand(severity,(severity*5))/15);
        let maxTrash = Math.ceil(severity*5*rand.rand(10,30)/20);
        if (trashLevel >= maxTrash) {
            trashLevel = maxTrash;
        }
        if (trashedBld.soins != undefined) {
            trashedBld.soins = trashedBld.soins+trashLevel;
        } else {
            trashedBld.soins = trashLevel;
        }
        if (trashedBld.loc === 'trans' && trashedBld.locId != souteId && !afterMission) {
            batUndeployFrom(trashedBld.id,trashedBld.locId);
        }
    }
    return bldName;
};

function bldTrash(severity,afterMission) {
    // severity average = 5
    let trashedBldId = -1;
    let theLoop = 0;
    let bldName = '';
    let shufBats = _.shuffle(bataillons);
    shufBats.forEach(function(bat) {
        if (trashedBldId < 0) {
            let batType = getBatType(bat);
            if (batType.cat === 'buildings') {
                if (!batType.skills.includes('notrash')) {
                    let trashChance = 0;
                    if (batType.skills.includes('trash')) {
                        trashChance = 100;
                    } else if (!batType.skills.includes('prefab') || !batType.skills.includes('noshow')) {
                        trashChance = 30;
                    }
                    trashChance = trashChance+theLoop;
                    if (rand.rand(1,100) <= trashChance) {
                        trashedBldId = bat.id;
                    }
                    theLoop = theLoop+10;
                }
            }
        }
    });
    if (trashedBldId >= 0) {
        let trashedBld = getBatById(trashedBldId);
        let trashedBldType = getBatType(trashedBld);
        bldName = trashedBldType.name;
        let trashLevel = Math.ceil(playerInfos.crime*2*rand.rand(severity,(severity*5))/15);
        let maxTrash = Math.ceil(severity*5*rand.rand(10,30)/20);
        if (trashLevel >= maxTrash) {
            trashLevel = maxTrash;
        }
        if (trashedBld.soins != undefined) {
            trashedBld.soins = trashedBld.soins+trashLevel;
        } else {
            trashedBld.soins = trashLevel;
        }
        if (trashedBld.loc === 'trans' && trashedBld.locId != souteId && !afterMission) {
            batUndeployFrom(trashedBld.id,trashedBld.locId);
        }
    }
    return bldName;
};

function resTheft(severity) {
    let resName = '';
    let resNum = 0;
    let dispoRes = 0;
    let adjSeverity = severity;
    let theLoop = 0;
    let shufRes = _.shuffle(resTypes);
    shufRes.forEach(function(res) {
        if (resName === '') {
            let resOK = false;
            adjSeverity = severity;
            if (res.name === 'Gibier' || res.name === 'Corps') {
                resOK = true;
                adjSeverity = adjSeverity*2;
            }
            if (res.cat.includes('sky') || res.name === 'Morphite') {
                resOK = true;
            }
            if (res.kinds != undefined) {
                if (res.kinds.includes('food')) {
                    resOK = true;
                    adjSeverity = adjSeverity*2;
                }
                if (res.cat.includes('medecine') && res.rarity < 40) {
                    resOK = true;
                    adjSeverity = adjSeverity*2;
                }
                if (res.kinds.includes('military')) {
                    if (res.cat === 'transfo' && res.rarity <= 100) {
                        resOK = true;
                    }
                    if (res.cat != 'transfo' && res.rarity <= 35) {
                        resOK = true;
                    }
                }
            }
            if (resOK) {
                theLoop = theLoop+10;
                if (rand.rand(1,200) <= res.rarity+theLoop) {
                    dispoRes = getDispoRes(res.name);
                    if (dispoRes >= 10) {
                        resName = res.name;
                        resNum = Math.ceil((playerInfos.crime+adjSeverity)*Math.sqrt(res.rarity)*res.batch/8*rand.rand(10,30)/20);
                    }
                }
            }
        }
    });
    if (dispoRes < resNum) {
        resNum = dispoRes;
    }
    let theTheft = {};
    theTheft.name = resName;
    theTheft.num = resNum;
    if (resNum >= 1 && resName != '') {
        resSub(resName,resNum);
        modWeekRes(resName,0-resNum);
    }
    return theTheft;
}

function getCitDeath(citType,number,eaten) {
    // ne fonctionne que dans la station!!
    let dispoCit = 0;
    let citLost = {};
    citLost.num = 0;
    citLost.type = citType;
    if (citType === 'Citoyens') {
        dispoCit = getDispoCit();
        if (dispoCit < 1) {
            dispoCit = getDispoCrim();
            citType = 'Criminels';
            citLost.type = citType;
        }
    } else {
        dispoCit = getDispoCrim();
        if (dispoCit < 1) {
            dispoCit = getDispoCit();
            citType = 'Citoyens';
            citLost.type = citType;
        }
    }
    if (dispoCit >= 1) {
        let restCit = dispoCit-number;
        deadBatsList = [];
        bataillons.forEach(function(bat) {
            if (bat.type === citType) {
                if (restCit <= 0) {
                    bat.citoyens = 0;
                    deadBatsList.push(bat.id);
                    citLost.num = dispoCit;
                } else {
                    bat.citoyens = restCit;
                    bat.squadsLeft = Math.ceil(bat.citoyens/6);
                    citLost.num = dispoCit-restCit;
                }
            }
        });
        if (restCit <= 0) {
            killBatList();
        }
    }
    if (citLost.num >= 1 && !eaten) {
        resAdd('Corps',citLost.num);
    }
    return citLost;
};

function getCommodList() {
    let commodList = {};
    unitTypes.forEach(function(unit) {
        if (unit.cat === 'buildings') {
            if (unit.crime != undefined) {
                if (unit.crime < 0) {
                    if (unit.skills.includes('poprel')) {
                        commodList[unit.name] = 0;
                    }
                }
            }
        }
    });
    return commodList;
};

function calcCrimeRate(mesCitoyens) {
    let crimeRate = {};
    // facteur: +criminels%
    let population = mesCitoyens.crim+mesCitoyens.cit;
    crimeRate.crim = Math.ceil(mesCitoyens.crim*100/population);
    crimeRate.penib = 17;
    crimeRate.lits = 0;
    crimeRate.fo = 0;
    crimeRate.total = 0;
    // facteur: +population
    let overPop = population-3000;
    let surPop = 0;
    if (population > 7500) {
        surPop = population-7500;
    }
    crimeRate.penib = crimeRate.penib+Math.round(overPop/250)+Math.round(surPop/500);
    // +1 par point playerInfos.vitals (25 pts)
    crimeRate.penib = crimeRate.penib+playerInfos.vitals;
    let bldIds = [];
    let commodList = getCommodList();
    let commodNeed = Math.round(population/3000);
    // Unités: (electroguards-2 gurus-2 dealers-1 marshalls-1)
    let maxCamGuards = Math.floor(Math.sqrt(population)/16);
    let camGuards = 0;
    let hopitBonus = 0;
    let bigCrims = 0;
    // Bâtiments: (prisons-5 salleSport-2 jardin-4 bar-2 cantine-3 dortoirs+1 cabines-1 appartements+3)
    let sortedBatList = bataillons.slice();
    sortedBatList = _.sortBy(sortedBatList,'sort');
    sortedBatList.reverse();
    sortedBatList.forEach(function(bat) {
        let batType = getBatType(bat);
        let outOfOrder = false;
        if (batType.cat === 'buildings') {
            if (bat.soins != undefined) {
                if (bat.soins >= 15) {
                    outOfOrder = true;
                }
            }
        }
        if (batType.skills.includes('gcrim')) {
            bigCrims = bigCrims+(batType.squads*batType.crew*batType.squadSize);
        }
        if (batType.name === 'Dortoirs') {
            crimeRate.lits = crimeRate.lits+500;
            if (bat.eq === 'mezzanine') {
                crimeRate.lits = crimeRate.lits+350;
                crimeRate.penib = crimeRate.penib+1;
            }
            if (bat.eq === 'confort' && !outOfOrder) {
                crimeRate.penib = crimeRate.penib-0.5;
            }
            if (outOfOrder) {
                crimeRate.lits = crimeRate.lits-100;
            }
        }
        if (batType.name === 'Cabines') {
            crimeRate.lits = crimeRate.lits+350;
            if (outOfOrder) {
                crimeRate.lits = crimeRate.lits-50;
            }
        }
        if (batType.name === 'Appartements') {
            crimeRate.lits = crimeRate.lits+75;
            if (outOfOrder) {
                crimeRate.lits = crimeRate.lits-15;
            }
        }
        if (batType.crime != undefined || bat.eq === 'camkit' || bat.eq === 'taserkit') {
            let countMe = false;
            if (batType.cat === 'buildings' || batType.name === 'Technobass') {
                if (batType.crime >= 1) {
                    countMe = true;
                } else if (batType.name === 'Prisons' || batType.name === 'Cabines' || batType.name === 'Technobass' || batType.name === 'Ascenseur') {
                    if (!outOfOrder) {
                        countMe = true;
                    }
                } else if (batType.name === 'Infirmerie' || batType.name === 'Hôpital') {
                    if (!outOfOrder) {
                        if (hopitBonus > -9) {
                            countMe = true;
                        }
                        hopitBonus = hopitBonus+batType.crime;
                    }
                } else if (batType.skills.includes('poprel')) {
                    if (commodList[batType.name] < commodNeed) {
                        countMe = true;
                        console.log('COUNT: '+batType.name);
                        console.log(commodList);
                    }
                    commodList[batType.name] = commodList[batType.name]+1;
                } else {
                    if (!bldIds.includes(batType.id)) {
                        if (!outOfOrder) {
                            countMe = true;
                            bldIds.push(batType.id);
                        }
                    }
                }
            } else if (batType.name === 'Electroguards') {
                countMe = true;
            } else {
                if (bat.eq === 'camkit' || bat.eq === 'taserkit') {
                    camGuards++;
                }
                countMe = true;
            }
            if (countMe) {
                if (bat.eq === 'taserkit' && camGuards <= maxCamGuards) {
                    crimeRate.fo = crimeRate.fo-0.5;
                } else if (bat.eq === 'camkit' && playerInfos.bldVM.includes('Salle de contrôle') && camGuards <= maxCamGuards) {
                    crimeRate.fo = crimeRate.fo-1;
                } else if (batType.skills.includes('fo')) {
                    crimeRate.fo = crimeRate.fo+batType.crime;
                } else {
                    if (batType.skills.includes('poprel')) {
                        crimeRate.penib = crimeRate.penib+(batType.crime/commodNeed);
                    } else {
                        crimeRate.penib = crimeRate.penib+batType.crime;
                    }
                }
            }
        }
    });
    // centre de com
    if (playerInfos.bldList.includes('Salle de contrôle')) {
        crimeRate.fo = crimeRate.fo-1;
    }
    // structure
    let numStructures = checkNumUnits('Structure');
    // console.log('Structure='+numStructures);
    crimeRate.penib = crimeRate.penib-(numStructures/10);
    // +5 par dortoir manquant
    if (population > crimeRate.lits) {
        crimeRate.penib = crimeRate.penib+((population-crimeRate.lits)/100);
    }
    crimeRate.penib = Math.round(crimeRate.penib);
    console.log('PENIBBBBBBBBBBBBBBBBBBBBBBBBB');
    console.log(crimeRate.penib);
    if (crimeRate.penib < 0) {
        crimeRate.penib = 0;
    }
    // Grande criminalité
    let bigAdj = bigCrims*2/(playerInfos.comp.ordre+4);
    let adjCrims = crimeRate.crim;
    adjCrims = Math.ceil((mesCitoyens.crim+bigAdj)*100/population);
    console.log('crimeRate.crim='+crimeRate.crim);
    console.log('bigAdj='+bigAdj);
    console.log('adjCrims='+adjCrims);
    // Treshold
    let horror = crimeRate.penib;
    if (horror > 15) {
        horror = Math.ceil((horror-15)/5)+15;
    }
    if (horror < 10) {
        crimeRate.total = adjCrims+Math.round(horror/1.9);
    } else if (adjCrims >= 15) {
        crimeRate.total = adjCrims+Math.round(horror*1.2);
    } else {
        crimeRate.total = adjCrims+horror;
    }
    // compétence maintien de l'ordre
    let mOrdre = 8;
    if (playerInfos.comp.ordre === 1) {
        mOrdre = 10;
    } else if (playerInfos.comp.ordre === 2) {
        mOrdre = 13;
    } else if (playerInfos.comp.ordre === 3) {
        mOrdre = 16;
    }
    crimeRate.fo = crimeRate.fo/10*mOrdre;
    crimeRate.total = crimeRate.total+crimeRate.fo;
    crimeRate.total = Math.round(crimeRate.total);
    if (crimeRate.total < 0) {
        crimeRate.total = 0;
    }
    console.log('crimeRate.fo='+crimeRate.fo);
    crimeRate.fo = Math.round(crimeRate.fo);
    console.log('crimeRate.total='+crimeRate.total);
    return crimeRate;
};

function setPenitLevel() {
    let penitNum = 0;
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('penitbat')) {
            penitNum = penitNum+1;
        }
    });
    playerInfos.penit = Math.ceil((playerInfos.crime+4)*penitNum/4);
    console.log('TOMBE DU CAMION');
    console.log(playerInfos.penit);
    bataillons.forEach(function(bat) {
        let batType = getBatType(bat);
        if (batType.skills.includes('penitbat')) {
            let camionEquips = getCamionEquips(bat,batType);
            let changeIt = false;
            if (bat.tdc === undefined) {
                changeIt = true;
            } else {
                if (bat.tdc.length <= camionEquips.length) {
                    changeIt = true;
                }
            }
            if (changeIt) {
                bat.tdc = camionEquips;
            }
        } else if (bat.tdc === undefined) {
            bat.tdc = [];
        }
    });
};

function getCamionEquips(bat,batType) {
    let camion = [];
    let vetLevel = (bat.vet*2)-5;
    if (vetLevel < 0) {
        vetLevel = Math.ceil(vetLevel/2);
    }
    let mafiaLevel = playerInfos.penit+vetLevel;
    // tous sauf tôlards
    if (batType.equip.includes('e-camo') && mafiaLevel >= 2) {
        camion.push('e-camo');
    }
    // Tôlards (revolver)
    if (batType.equip.includes('chargeur2') && mafiaLevel >= 2) {
        let equip = getEquipByName('chargeur2');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('chargeur2');
        }
    }
    // tous
    if (batType.equip.includes('e-ranger') && mafiaLevel >= 3) {
        camion.push('e-ranger');
    }
    // Desperados (uzi), Krimulos (pompe), Gangsters (magnum)
    if (batType.equip.includes('chargeur1') && batType.name != 'Détenus' && mafiaLevel >= 4) {
        let equip = getEquipByName('chargeur1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('chargeur1');
        }
    }
    // Détenus (calibre)
    if (batType.equip.includes('lunette1') && mafiaLevel >= 4) {
        let equip = getEquipByName('lunette1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('lunette1');
        }
    }
    // Raiders (javelots), Sinyaki (dynamite)
    if (batType.equip.includes('gilet') && mafiaLevel >= 4) {
        camion.push('gilet');
    }
    // Tôlards
    if (batType.equip.includes('e-mecano') && mafiaLevel >= 4) {
        let equip = getEquipByName('e-mecano');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-mecano');
        }
    }
    // tous
    if (batType.equip.includes('e-flash') && mafiaLevel >= 5) {
        let equip = getEquipByName('e-flash');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-flash');
        }
    }
    // Sinyaki (dynamite)
    if (batType.equip.includes('lancegren') && mafiaLevel >= 5) {
        let equip = getEquipByName('lancegren');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('lancegren');
        }
    }
    // détenus (calibre)
    if (batType.equip.includes('silencieux1') && mafiaLevel >= 5) {
        let equip = getEquipByName('silencieux1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('silencieux1');
        }
    }
    // Détenus (calibre)
    if (batType.equip.includes('chargeur1') && batType.name === 'Détenus' && mafiaLevel >= 6) {
        let equip = getEquipByName('chargeur1');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('chargeur1');
        }
    }
    // tous
    if (playerInfos.penit >= 6) {
        // armor +1
    }
    // tous
    if (batType.equip.includes('e-medic') && mafiaLevel >= 7) {
        let equip = getEquipByName('e-medic');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('e-medic');
        }
    }
    // Tôlards (torche), Sinyaki (batte)
    if (batType.weapon.isMelee && mafiaLevel >= 8) {
        camion.push('fineclub');
    }
    // Gangsters (toothbrush)
    if (batType.weapon2.isMelee && mafiaLevel >= 8) {
        camion.push('fineclub');
    }
    // tous sauf tôlards
    if (batType.equip.includes('waterproof') && mafiaLevel >= 8) {
        let equip = getEquipByName('waterproof');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('waterproof');
        }
    }
    // Détenus (calibre), Gangsters (magnum)
    if (!batType.weapon.isMelee && batType.name != 'Krimulos' && batType.name != 'Desperados' && mafiaLevel >= 10) {
        camion.push('finegun');
    }
    // Tôlards (revolver)
    if (!batType.weapon2.isMelee && !batType.weapon2.noBis && batType.name != 'Raiders' && mafiaLevel >= 10) {
        camion.push('finegun');
    }
    // tous
    if (playerInfos.penit >= 11) {
        // armor +2
    }
    // tous
    if (batType.equip.includes('theeye') && mafiaLevel >= 14) {
        let equip = getEquipByName('theeye');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('theeye');
        }
    }
    // Tôlards (torche), Sinyaki (batte), Raiders (javelots)
    if (batType.equip.includes('helper') && mafiaLevel >= 15) {
        let equip = getEquipByName('helper');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('helper');
        }
    }
    // Tôlards, Sinyaki, Gangsters, Détenus
    if (batType.equip.includes('repel') && mafiaLevel >= 17) {
        let equip = getEquipByName('repel');
        let compReqOK = checkCompReq(equip);
        if (compReqOK) {
            camion.push('repel');
        }
    }
    console.log(camion);
    return camion;
};
