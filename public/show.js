function equipDetails(stuffName,isAmmo) {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","400px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    let stuff = {};
    if (isAmmo) {
        stuff = getAmmoByName(stuffName);
    } else {
        stuff = getEquipByName(stuffName);
    }
    let baseInfo = '';
    let pageTitle = 'EQUIPEMENT';
    if (isAmmo) {
        pageTitle = 'MUNITION';
        baseInfo = showAmmoInfo(stuffName,true,true);
    } else if (stuff.cat === 'armor') {
        pageTitle = 'ARMURE';
        baseInfo = showFullArmorInfo(stuff,false,true,true,false);
    } else if (stuff.cat === 'drogue') {
        pageTitle = 'DROGUE';
        if (stuff.info != undefined) {
            baseInfo = stuff.info;
            baseInfo = baseInfo.replace(/ \/ /g,' &#9889; ');
        }
    } else if (stuff.cat === 'infra') {
        pageTitle = 'INFRASTRUCTURE';
        if (stuff.info != undefined) {
            baseInfo = showInfraInfo(stuff.name,true,true);
        }
    } else if (stuff.cat === 'equip') {
        if (stuff.info != undefined) {
            baseInfo = showEquipFullInfo(stuff.name,true,true);
        }
    }
    baseInfo = baseInfo.replace(/\n/g,'<br><br>');
    $('#conUnitList').append('<span class="constName vert">'+pageTitle+': <span class="or">&ldquo;'+stuff.name+'&rdquo;</span></span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="basicText">'+baseInfo+'</span><br>');
    $('#conUnitList').append('<br><br>');
};

function showFullArmorInfo(batArmor,forBld,withReqs,withCosts,forUnit,unit) {
    let apAdj = batArmor.ap;
    if (apAdj >= 1) {
        apAdj = '+'+apAdj;
    }
    if (forUnit) {
        if (batArmor.ap < -1) {
            if (unit.skills.includes('weak')) {
                apAdj = apAdj+batArmor.ap+1;
            }
            if (unit.skills.includes('strong') && (unit.skills.includes('mutant') || playerInfos.bldVM.includes('Salle de sport'))) {
                apAdj = apAdj+1;
            }
        }
    }
    let armorSkills = '(+'+batArmor.armor+' Armure / '+apAdj+' PA) ';
    if (forBld) {
        armorSkills = '(+'+batArmor.armor+' Armure) ';
    }
    if (batArmor.skills.includes('resistacide')) {
        armorSkills = armorSkills+'&#9889; résistance acide ';
    }
    if (batArmor.skills.includes('resistfeu')) {
        armorSkills = armorSkills+'&#9889; résistance feu ';
    }
    if (batArmor.skills.includes('resistall')) {
        armorSkills = armorSkills+'&#9889; résistance globale ';
    }
    if (batArmor.skills.includes('protectall')) {
        armorSkills = armorSkills+'&#9889; protection globale ';
    }
    if (batArmor.skills.includes('dreduct')) {
        armorSkills = armorSkills+'&#9889; réduction de dégâts ';
    }
    if (batArmor.skills.includes('resistelec')) {
        armorSkills = armorSkills+'&#9889; résistance électricité ';
    }
    if (batArmor.skills.includes('soap')) {
        armorSkills = armorSkills+'&#9889; résistance entrave ';
    }
    if (batArmor.skills.includes('spikes')) {
        armorSkills = armorSkills+'&#9889; protection mêlée ';
    }
    if (batArmor.skills.includes('poison')) {
        armorSkills = armorSkills+'&#9889; poison ';
    }
    if (batArmor.skills.includes('autorepair')) {
        armorSkills = armorSkills+'&#9889; réparation automatique ';
    }
    if (batArmor.skills.includes('slowreg')) {
        armorSkills = armorSkills+'&#9889; régénération lente ';
    }
    if (batArmor.skills.includes('regeneration')) {
        armorSkills = armorSkills+'&#9889; régénération ';
    }
    if (batArmor.skills.includes('rof')) {
        armorSkills = armorSkills+'&#9889; cadence de tir +15% ';
    }
    if (batArmor.skills.includes('camoloss')) {
        armorSkills = armorSkills+'&#9889; déplacement non furtif ';
    }
    armorSkills = armorSkills+'&nbsp;';
    if (withReqs) {
        let reqString = showReqs(batArmor);
        armorSkills = armorSkills+reqString;
    }
    if (withCosts) {
        let costString = displayCosts(batArmor.costs,true,true);
        armorSkills = armorSkills+'\n'+costString;
    }
    return armorSkills;
};

function showEquipFullInfo(equipName,withReqs,withCosts) {
    let stuff = getEquipByName(equipName);
    let equipInfo = '';
    if (stuff.info != undefined) {
        equipInfo = stuff.info;
        equipInfo = equipInfo.replace(/ \/ /g,' &#9889; ');
        if (withReqs) {
            let reqString = showReqs(stuff);
            equipInfo = equipInfo+reqString;
        }
        if (withCosts) {
            let costString = displayCosts(stuff.costs,true,true);
            equipInfo = equipInfo+'\n'+costString;
        }
    }
    return equipInfo;
};

function showInfraInfo(infraName,withReqs,withCosts) {
    // console.log('SHOWINFRAINFO ??????????????????????????????????????????????');
    let stuff = getInfraByName(infraName);
    let infraInfo = stuff.name;
    if (stuff.info != undefined) {
        infraInfo = infraInfo+' &#9889; '+stuff.info;
        infraInfo = infraInfo.replace(/ \/ /g,' &#9889; ');
        infraInfo = infraInfo+' &#9889;';
        if (withReqs) {
            let reqString = showReqs(stuff);
            infraInfo = infraInfo+reqString;
        }
        if (withCosts) {
            let costString = displayCosts(stuff.costs,false,true);
            infraInfo = infraInfo+'\n'+costString;
        }
    }
    return infraInfo;
};

function showDrugInfo(stuff,withReqs,withCosts) {

};

function showAmmoInfo(ammoName,withReqs,withCosts) {
    let ammoIndex = ammoTypes.findIndex((obj => obj.name == ammoName));
    let ammo = ammoTypes[ammoIndex];
    let ammoInfo = '';
    if (ammo.range != 1) {
        let perc = Math.round(ammo.range*100);
        ammoInfo = ammoInfo+'&#9889; Portée '+perc+'% ';
    }
    if (ammo.maxrange != undefined) {
        ammoInfo = ammoInfo+'&#9889; PortéeMax '+ammo.maxrange+' ';
    }
    if (ammo.elevation != undefined) {
        ammoInfo = ammoInfo+'&#9889; Elevation+ ';
    }
    if (ammo.rof != 1) {
        let perc = Math.round(ammo.rof*100);
        ammoInfo = ammoInfo+'&#9889; Cadence '+perc+'% ';
    }
    if (ammo.powermult != 1) {
        let perc = Math.round(ammo.powermult*100);
        ammoInfo = ammoInfo+'&#9889; Puissance '+perc+'% ';
    }
    if (ammo.power > 0) {
        ammoInfo = ammoInfo+'&#9889; Puissance +'+ammo.power+' ';
    } else if (ammo.power < 0) {
        ammoInfo = ammoInfo+'&#9889; Puissance '+ammo.power+' ';
    }
    if (ammo.armors != 1 || ammo.avar != undefined) {
        let armur = ammo.armors*10;
        if (ammo.avar != undefined) {
            let avarComp = playerInfos.comp[ammo.avar];
            if (avarComp >= 2) {
                armur = armur*2.75/(avarComp+2);
            }
        }
        armur = entre(armur,1,999);
        let penet = Math.round(1000/armur);
        ammoInfo = ammoInfo+'&#9889; Pénétration '+penet+' ';
    }
    if (ammo.avar != undefined) {
        ammoInfo = ammoInfo+'('+ammo.avar+'&#9872;) ';
    }
    if (ammo.aignore != undefined) {
        ammoInfo = ammoInfo+'&#9889; IgnoreArmure '+ammo.aignore+'- ';
    }
    if (ammo.accuracy != 1) {
        let perc = Math.round(ammo.accuracy*100);
        ammoInfo = ammoInfo+'&#9889; Précision '+perc+'% ';
    }
    if (ammo.apdamage > 0) {
        let apd = Math.round(ammo.apdamage*100);
        if (ammo.apweb) {
            ammoInfo = ammoInfo+'&#9889; Entrave '+apd+'+ ';
        } else {
            ammoInfo = ammoInfo+'&#9889; Entrave '+apd+' ';
        }
    } else if (ammo.apweb) {
        ammoInfo = ammoInfo+'&#9889; Entrave ';
    }
    if (ammo.name.includes('plastanium')) {
        ammoInfo = ammoInfo+'&#9889; Dégâts x2 dans l\'eau ';
    }
    if (ammo.name.includes('jello')) {
        ammoInfo = ammoInfo+'&#9889; Ramollissement (des armures alien) ';
    }
    if (ammo.name.includes('marq')) {
        ammoInfo = ammoInfo+'&#9889; Marquage ';
    }
    if (ammo.name.includes('-cluster')) {
        ammoInfo = ammoInfo+'&#9889; Sous-munitions ';
        ammoInfo = ammoInfo+'&#9889; Max 1 salve ';
    }
    if (ammo.name.includes('-bio')) {
        ammoInfo = ammoInfo+'&#9889; Génocide ';
    }
    if (ammo.name.includes('-necro')) {
        ammoInfo = ammoInfo+'&#9889; Anti-régénération (nécrotoxine) ';
    }
    if (ammo.aoe != '') {
        if (ammo.aoe == 'unit') {
            ammoInfo = ammoInfo+'&#9889; AOE Unité ';
        }
        if (ammo.aoe == 'brochette') {
            ammoInfo = ammoInfo+'&#9889; AOE Unité(s) ';
        }
        if (ammo.aoe == 'squad') {
            ammoInfo = ammoInfo+'&#9889; AOE Escouade ';
        }
        if (ammo.aoe == 'bat') {
            if (ammo.name.includes('deluge') || (ammo.name.includes('-gaz') && ammo.name != 'grenade-gaz')) {
                ammoInfo = ammoInfo+'&#9889; AOE 9 cases ';
            } else {
                ammoInfo = ammoInfo+'&#9889; AOE Bataillon ';
            }
        }
    }
    if (ammo.fly != undefined) {
        if (ammo.fly <= 0) {
            ammoInfo = ammoInfo+'&#9889; Tir au sol uniquement ';
        }
    }
    if (ammo.info != undefined) {
        ammoInfo = ammoInfo+'&#9889; '+ammo.info+' ';
    }
    if (withReqs) {
        let reqString = showReqs(ammo);
        ammoInfo = ammoInfo+reqString;
    }
    if (withCosts) {
        let deployCosts = {};
        let flatCosts = {};
        if (ammo.deploy != undefined) {
            deployCosts = JSON.parse(JSON.stringify(ammo.deploy));
        }
        if (ammo.costs != undefined) {
            flatCosts = JSON.parse(JSON.stringify(ammo.costs));
        }
        mergeObjects(flatCosts,deployCosts);
        let costString = displayCosts(flatCosts,true,true);
        ammoInfo = ammoInfo+'\n'+costString;
    }
    return ammoInfo;
};

function showResInfo(resName,full) {
    let res = getResByName(resName);
    let resInfo = getResIcon(res);
    resInfo = resInfo+getResCat(res,full);
    if (full) {
        if (res.bld.length >= 1) {
            if (res.name === 'Scrap') {
                resInfo = resInfo+'\n&#9935; Collecteur approprié: COMPTOIR';
            } else if (res.name != 'Magma') {
                resInfo = resInfo+'\n&#9935; Collecteur approprié: '+res.bld.toUpperCase();
            }
        }
        let showPlanets = true;
        if (res.cat === 'alien') {
            showPlanets = false;
        }
        if (res.cat === 'transfo' && res.name != 'Morphite') {
            showPlanets = false;
        }
        if (showPlanets) {
            // let resPlanets = '\n&#127759; Dom=1, Sarak=1, Gehenna=1, Kzin=1, Horst=1';
            let resPlanets = '';
            if (res.planets != undefined) {
                resPlanets = '\n&#127759; '+toCoolString(res.planets,true,false);
            }
            resInfo = resInfo+resPlanets;
        }
    }
    return resInfo;
};

function getResCat(res,full) {
    let resCat = '';
    if (res.cat === 'alien') {
        resCat = resCat+' ressource ALIEN';
        if (full) {
            resCat = resCat+' (se collecte automatiquement en tuant des aliens)';
        }
    } else if (res.cat === 'transfo' && res.name != 'Morphite') {
        resCat = resCat+' ressource TRANSFORMEE';
        if (full) {
            resCat = resCat+' (s\'obtient par crafting ou démantèlement d\'unités)';
        }
    } else if (res.cat === 'zero' || res.name === 'Morphite' || res.name === 'Scrap' || res.bld === 'Comptoir') {
        resCat = resCat+' ressource de SURFACE';
        if (full) {
            if (res.name === 'Morphite') {
                resCat = resCat+' (se collecte en surface, d\'un seul coup)';
            } else if (res.name === 'Corps') {
                resCat = resCat+' (se collecte automatiquement quand vous perdez des bataillons)';
            } else {
                resCat = resCat+' (se collecte à la surface)';
            }
        }
    } else if (res.name === 'Magma') {
        resCat = resCat+' ressource du SOUS-SOL';
        if (full) {
            resCat = resCat+' (ne se collecte jamais, augmente l\'efficacité des Sondes Géothermiques sur place)';
        }
    } else {
        resCat = resCat+' ressource du SOUS-SOL';
        if (full) {
            resCat = resCat+' (se mine)';
        }
    }
    return resCat;
};

function displayCosts(costs,noNum,noCro) {
    let costString = '&#9935; '
    if (!noCro) {
        costString = costString+'{';
    }
    if (costs != undefined) {
        Object.entries(costs).map(entry => {
            let key = entry[0];
            let value = entry[1];
            if (value > playerInfos.reserve[key] && !noNum) {
                costString = costString+'&#128683;'+key;
            } else {
                costString = costString+key;
            }
            if (!noNum) {
                costString = costString+':'+value+'/'+playerInfos.reserve[key];
            }
            if (value > playerInfos.reserve[key] && !noNum) {
                costString = costString+'!';
            }
            costString = costString+' &#128313; ';
        });
    }
    costString = costString.slice(0,-10);
    if (!noCro) {
        costString = costString+'}';
    }
    return costString;
};

function showReqs(stuff) {
    let reqString = '';
    if (stuff.bldReq != undefined) {
        if (stuff.bldReq.length >= 1) {
            reqString = reqString+'\n&#127963; '+toNiceString(stuff.bldReq)+' &nbsp;';
        }
    }
    let compReqs = getCompReqs(stuff,false);
    if (Object.keys(compReqs.base).length >= 1) {
        let stringReq1 = toCoolString(compReqs.base,true,false);
        stringReq1 = replaceCompNamesByFullNames(stringReq1);
        if (stringReq1.includes('ConnaissanceAlien=10')) {
            stringReq1 = 'Spécial';
        }
        reqString = reqString+'\n&#128161; '+stringReq1;
    }
    if (Object.keys(compReqs.alt).length >= 1) {
        let stringReq2 = toCoolString(compReqs.alt,true,false);
        stringReq2 = replaceCompNamesByFullNames(stringReq2);
        reqString = reqString+'\n&#128161; '+stringReq2;
    }
    return reqString;
};

function getCompReqs(stuff,isUnit) {
    let compReqs = {};
    compReqs.base = {};
    compReqs.alt = {};
    let pass = false;
    if (isUnit) {
        if (stuff.compPass.includes(playerInfos.gang)) {
            pass = true;
        }
    }
    if (!pass) {
        if (stuff.compReq != undefined) {
            if (Object.keys(stuff.compReq).length >= 1) {
                Object.entries(stuff.compReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    compReqs.base[key] = value;
                });
            }
        }
        // altCompReq
        if (stuff.altCompReq != undefined) {
            if (Object.keys(stuff.altCompReq).length >= 1) {
                compReqOK = true;
                Object.entries(stuff.altCompReq).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    compReqs.alt[key] = value;
                });
            }
        }
    }
    if (stuff.compHardReq != undefined) {
        if (Object.keys(stuff.compHardReq).length >= 1) {
            Object.entries(stuff.compHardReq).map(entry => {
                let key = entry[0];
                let value = entry[1];
                if (compReqs.base[key] != undefined) {
                    if (compReqs.base[key] < value) {
                        compReqs.base[key] = value;
                    }
                } else {
                    compReqs.base[key] = value;
                }
                if (Object.keys(compReqs.alt).length >= 1) {
                    if (compReqs.alt[key] != undefined) {
                        if (compReqs.alt[key] < value) {
                            compReqs.alt[key] = value;
                        }
                    } else {
                        compReqs.alt[key] = value;
                    }
                }
            });
        }
    }
    // console.log('compReqs.base');
    // console.log(compReqs.base);
    // console.log('compReqs.alt');
    // console.log(compReqs.alt);
    return compReqs;
};

function replaceCompNamesByFullNames(string) {
    let newString = string;
    newString = newString.replace(/arti=/g,'Artillerie=');
    newString = newString.replace(/aero=/g,'Aéronautique=');
    newString = newString.replace(/gen=/g,'Génétique=');
    newString = newString.replace(/cyber=/g,'Cybernétique=');
    newString = newString.replace(/robo=/g,'Robotique=');
    newString = newString.replace(/tele=/g,'Téléportation=');
    newString = newString.replace(/vsp=/g,'VolsSpaciaux=');
    newString = newString.replace(/scaph=/g,'Scaphandres=');
    newString = newString.replace(/det=/g,'Détection=');
    newString = newString.replace(/med=/g,'Médecine=');
    newString = newString.replace(/ordre=/g,'Leadership=');
    newString = newString.replace(/train=/g,'Entraînement=');
    newString = newString.replace(/cam=/g,'Camouflage=');
    newString = newString.replace(/tri=/g,'Recyclage=');
    newString = newString.replace(/ind=/g,'Industrie=');
    newString = newString.replace(/const=/g,'Construction=');
    newString = newString.replace(/energ=/g,'Energie=');
    newString = newString.replace(/ext=/g,'Extraction=');
    newString = newString.replace(/trans=/g,'Transports=');
    newString = newString.replace(/log=/g,'Logistique=');
    newString = newString.replace(/bal=/g,'Balistique=');
    newString = newString.replace(/explo=/g,'Explosifs=');
    newString = newString.replace(/pyro=/g,'Pyrotechnie=');
    newString = newString.replace(/exo=/g,'Exochimie=');
    newString = newString.replace(/mat=/g,'Matériaux=');
    newString = newString.replace(/def=/g,'Défenses=');
    newString = newString.replace(/tank=/g,'Blindés=');
    newString = newString.replace(/ca=/g,'ConnaissanceAlien=');
    return newString;
};
