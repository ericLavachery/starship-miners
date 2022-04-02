function getMapInfos() {
    if (zone[0].pKind === undefined) {
        zone[0].pKind = checkMapKind('P');
    }
    if (zone[0].gKind === undefined) {
        zone[0].gKind = checkMapKind('G');
    }
    if (zone[0].sKind === undefined) {
        zone[0].sKind = checkMapKind('S');
    }
    zoneInfos.pKind = zone[0].pKind;
    zoneInfos.gKind = zone[0].gKind;
    zoneInfos.sKind = zone[0].sKind;
    console.log('pKind='+zoneInfos.pKind+' gKind='+zoneInfos.gKind+' sKind='+zoneInfos.sKind);
};

// Dessine la carte
function showMap(wmap,justMoved) {
    // reset
    $('#zone_map').empty();
    // fill
    let terClass = getTerrainFilter(wmap[0]);
    let minX = xOffset+1;
    let maxX = xOffset+numVTiles;
    let minY = yOffset+1;
    let maxY = yOffset+numHTiles;
    let terclass = '';
    let tertitle = '';
    let resHere = '';
    let tPic = 'P_001';
    allZoneRes = [];
    allCheckedZoneRes = [];
    viewBorders = [];
    if (modeSonde) {
        playerInfos.showedTiles = [1830];
    }
    let visMap = _.filter(wmap, function(tile) {
        return (tile.x >= minX && tile.x <= maxX && tile.y >= minY && tile.y <= maxY);
    });
    let sortedVisMap = _.sortBy(_.sortBy(visMap,'y'),'x');
    sortedVisMap.forEach(function(tile) {
        if (tile.id === 0) {
            if (tile.pid === undefined) {
                tile.pid = 1;
            }
            if (tile.planet === undefined) {
                let planetName = getPlanetNameById(tile.pid);
                tile.planet = planetName;
            }
        }
        if (tile.x === minX || tile.x === maxX || tile.y === minY || tile.y === maxY) {
            viewBorders.push(tile.id);
        }
        if ((modeSonde || modeLanding) && landerLandingOK(tile) && !playerInfos.showedTiles.includes(tile.id)) {
            playerInfos.showedTiles.push(tile.id);
        }
        resHere = showRes(tile.id);
        if (tile.seed >= 10) {
            tPic = tile.terrain+'_0'+tile.seed;
        } else {
            tPic = tile.terrain+'_00'+tile.seed;
        }
        if (zone[0].dark) {
            if (zone[0].undarkOnce.includes(tile.id) || zone[0].undarkAll) {
                terclass = 'ter'+tile.terrain+tile.seed;
            } else {
                terclass = 'terFog';
                tPic = 'D_001';
            }
        } else {
            terclass = 'ter'+tile.terrain+tile.seed;
        }
        $('#zone_map').append('<div id="'+tile.id+'" class="grid-item '+terclass+'" onclick="clickTile('+tile.id+')" title="#'+tile.id+' ('+tile.y+'&lrhar;'+tile.x+')"><span class="'+terClass+'"><img src="/static/img/sntiles/'+tPic+'.png"></span><span class="bigIcon" id="b'+tile.id+'">'+resHere+'</span><br></div>');
        if (!modeSonde) {
            bataillons.forEach(function(bat) {
                if (bat.tileId === tile.id && bat.loc === "zone") {
                    if (bat.tileId === selectedBat.tileId) {
                        tileSelect(bat);
                    }
                    showBataillon(bat);
                }
                if (playerInfos.onShip) {
                    if (bat.vmt != undefined) {
                        if (bat.vmt === tile.id && bat.loc != "zone") {
                            let batType = getBatType(bat);
                            if (batType.skills.includes('prefab') && !batType.skills.includes('noshow')) {
                                showPrefab(bat);
                            }
                        }
                    }
                }
            });
            aliens.forEach(function(alien) {
                if (alien.tileId === tile.id && alien.loc === "zone") {
                    showAlien(alien);
                }
            });
        }
    });
    if (!justMoved) {
        selectMode();
        alienOccupiedTileList();
        playerOccupiedTileList();
    }
    mapEffect();
    // console.log(zone);
};

function toggleMapEffect() {
    if (playerInfos.clouds) {
        playerInfos.clouds = false;
    } else {
        playerInfos.clouds = true;
    }
    showMap(zone,false);
};

function mapEffect() {
    $('#zone_effect').empty();
    if (!playerInfos.onShip && playerInfos.clouds) {
        $('#zone_effect').append('<span onmouseover="mapEffectOut()"><img src="/static/img/cloudz1.png"></span>');
    }
};

function mapEffectOut() {
    $("#zone_effect").css("display","none");
};

function mapEffectIn() {
    $("#zone_effect").css("display","block");
};

function showLanderLandingTiles() {
    zone.forEach(function(tile) {
        if (landerLandingOK(tile) && !playerInfos.showedTiles.includes(tile.id)) {
            playerInfos.showedTiles.push(tile.id);
        }
    });
}

function landerLandingOK(tile) {
    let tileOK = false;
    let landerRange = getLanderRange();
    let distance = calcDistanceSquare(tile.id,1830);
    if (distance <= landerRange) {
        tileOK = true;
        if (tile.terrain === 'R' || tile.terrain === 'L') {
            tileOK = false;
        }
        if (playerInfos.comp.vsp < 4) {
            if (tile.terrain === 'W') {
                tileOK = false;
            }
        }
        if (playerInfos.comp.vsp < 3) {
            if (tile.terrain === 'M') {
                tileOK = false;
            }
        }
        if (playerInfos.comp.vsp < 2) {
            if (tile.terrain === 'F') {
                tileOK = false;
            }
        }
        if (playerInfos.comp.vsp < 1) {
            if (tile.terrain === 'S' || tile.terrain === 'H') {
                tileOK = false;
            }
        }
    }
    return tileOK;
};

function redrawTile(tileId,drawSelectedBat) {
    $('#b'+tileId).empty();
    let batHere = false;
    bataillons.forEach(function(bat) {
        if (bat.tileId === tileId && bat.loc === "zone") {
            if (drawSelectedBat || bat.id != selectedBat.id) {
                showBataillon(bat);
                batHere = true;
            }
        }
        if (playerInfos.onShip) {
            if (bat.vmt != undefined) {
                if (bat.vmt === tileId && bat.loc != "zone") {
                    let batType = getBatType(bat);
                    if (batType.skills.includes('prefab') && !batType.skills.includes('noshow')) {
                        if (drawSelectedBat || bat.id != selectedBat.id) {
                            showPrefab(bat);
                            batHere = true;
                        }
                    }
                }
            }
        }
    });
    if (!batHere) {
        let resHere = showRes(tileId);
        $('#b'+tileId).append(resHere);
    }
};

function showRes(tileId) {
    let tile = zone[tileId];
    let mapIndicators = '';
    let res = '';
    let view = true;
    // if (zone[0].dark && !zone[0].undarkOnce.includes(tile.id) && !zone[0].undarkAll) {
    //     view = false;
    // }
    if (modeSonde && playerInfos.comp.det < 0) {
        view = false;
    }
    if (tile.rq != undefined && view) {
        if (playerInfos.comp.det >= 1 || !modeSonde) {
            res = JSON.stringify(tile.rs);
            res = res.replace(/"/g,"");
            res = res.replace(/{/g,"");
            res = res.replace(/}/g,"");
            res = res.replace(/,/g," &nbsp;&horbar;&nbsp; ");
            res = res.replace(/:/g," ");
            if (playerInfos.comp.det >= 3 || !modeSonde) {
                // tout voir
            } else {
                res = res.replace(/\d+/g,"");
            }
        }
        if (tile.tileName !== undefined && tile.tileName != '') {
            res = res+' ('+tile.tileName+')'
        }
    }
    if (view) {
        if (tile.rd || tile.rq != undefined || (tile.tileName !== undefined && tile.tileName != '')) {
            mapIndicators = mapIndicators+'<div class="mapInfos" title="'+res+'">';
        }
        if (tile.rd) {
            mapIndicators = mapIndicators+'<i class="fas fa-shoe-prints fa-rotate-270 road"></i>';
        }
        if (tile.tileName !== undefined && tile.tileName != '') {
            mapIndicators = mapIndicators+'<i class="fas fa-map-marker-alt inficon"></i>';
        }
        if (tile.rq != undefined) {
            mapIndicators = mapIndicators+'<i class="fas fa-atom inficon rq'+tile.rq+'"></i>';
        }
        if (tile.rd || tile.rq != undefined || (tile.tileName !== undefined && tile.tileName != '')) {
            mapIndicators = mapIndicators+'</div>';
        }
    }
    if (tile.ruins && view) {
        if (tile.sh === -1) {
            mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/ruinsf.png"></div>';
        } else {
            mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/ruins.png"></div>';
        }
    }
    if (tile.infra === 'Miradors' && view) {
        mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/mirador.png"></div>';
    }
    if (tile.infra === 'Palissades' && view) {
        mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/palissade.png"></div>';
    }
    if (tile.infra === 'Remparts' && view) {
        mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/rempart.png"></div>';
    }
    if (tile.infra === 'Murailles' && view) {
        mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/muraille.png"></div>';
    }
    if (tile.infra === 'Terriers' && view) {
        mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/terrier.png"></div>';
    }
    if (tile.infra === 'Débris' && view) {
        mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/debris.png"></div>';
    }
    if (playerInfos.showedTiles.includes(tileId)) {
        if (tileId === 1830) {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/showCenterTile.png"></div>';
        } else {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/showTile.png"></div>';
        }
    }
    if (zone[0].dark) {
        if (undarkNow.includes(tile.id)) {
            // mapIndicators = mapIndicators+'<div class="dark"><img src="/static/img/dark.png"></div>';
        } else {
            mapIndicators = mapIndicators+'<div class="dark"><img src="/static/img/dark.png"></div>';
        }
    } else {
        if (foggedTiles.includes(tile.id)) {
            mapIndicators = mapIndicators+'<div class="dark"><img src="/static/img/darkf.png"></div>';
        }
    }
    if (zone[0].planet === 'Horst') {
        if (playerInfos.stList.includes(tileId)) {
            mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/storm75.png"></div>';
        } else if (playerInfos.sqList.includes(tileId)) {
            mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/squall50.png"></div>';
        }
    }
    return mapIndicators;
};

function getBatPic(bat,batType) {
    let batPic = batType.pic;
    if (batType.skills.includes('kitimage') && (bat.eq.includes('kit-') || bat.eq.includes('w2-'))) {
        batPic = batPic+'2'
    }
    if (batType.skills.includes('garde') && bat.eq === 'e-phare') {
        batPic = 'phare';
    }
    return batPic;
};

function showAlien(bat) {
    let batType = getBatType(bat);
    let batShowedName = nomVisible(bat);
    let batPic = batType.pic;
    bat.apLeft = bat.apLeft.toFixedNumber(1);
    if (playerInfos.comp.ca >= 1) {
        if (batType.name === 'Coque' || batType.name === 'Oeuf voilé' || batType.name === 'Oeuf' || batType.name === 'Vomissure') {
            if (bat.tags.includes('morph')) {
                batPic = batPic+'trans';
            }
        }
    }
    let batCat = batType.cat;
    let unitsLeft = bat.squadsLeft*batType.squadSize;
    $('#b'+bat.tileId).empty();
    let alienClass = 'aUnits';
    if (batType.kind === 'game') {
        alienClass = 'gUnits';
    }
    if (batType.skills.includes('invisible') || bat.tags.includes('invisible')) {
        alienClass = 'iUnits';
    }
    let resHere = showRes(bat.tileId);
    let degNum = getDamageBar(bat);
    let myKind = getEggKind(bat);
    // console.log('myKind='+myKind);
    let tagz = ' ';
    if (batType.class === 'X') {
        tagz = tagz+myKind;
    }
    if (playerInfos.comp.det >= 3 && playerInfos.comp.ca >= 2) {
        tagz = tagz+' ('+bat.apLeft+' PA)';
    }
    if (playerInfos.comp.det >= 3 && playerInfos.comp.ca >= 3) {
        let ripNum = getRipNum(bat,batType);
        tagz = tagz+' ('+ripNum+' rip)';
    }
    if (bat.tags.includes('shield')) {
        tagz = tagz+' (bouclier)';
    }
    if (bat.tags.includes('guide')) {
        tagz = tagz+' (guidage)';
    }
    if (bat.tags.includes('fluo')) {
        tagz = tagz+' (marqué)';
    }
    if (bat.tags.includes('inflammable')) {
        tagz = tagz+' (arrosé)';
    }
    if (bat.tags.includes('poison')) {
        let allTags = _.countBy(bat.tags);
        tagz = tagz+' (poison: '+allTags.poison+')';
    }
    if (bat.tags.includes('shinda')) {
        tagz = tagz+' (shinda)';
    }
    if (bat.tags.includes('stun')) {
        tagz = tagz+' (stun)';
    }
    if (bat.tags.includes('jelly')) {
        tagz = tagz+' (jelly)';
    }
    if (bat.tags.includes('freeze')) {
        tagz = tagz+' (freeze)';
    }
    if (bat.tags.includes('fogged')) {
        tagz = tagz+' (fog)';
    }
    if (bat.tags.includes('scion') && playerInfos.comp.ca >= 3) {
        tagz = tagz+' (prégnant)';
    }
    if ((zone[0].dark && !undarkNow.includes(bat.tileId)) || batType.skills.includes('invisible')) {
        $('#b'+bat.tileId).append('<div class="iUnits"></div><div class="aliInfos"></div><div class="degInfos"></div>'+resHere);
    } else if (bat.tags.includes('invisible')) {
        if (playerInfos.comp.det >= 5) {
            if (degNum >= 7) {
                $('#b'+bat.tileId).append('<div class="iUnits"><img src="/static/img/units/'+batCat+'/invisible.png"></div><div class="aliInfos"></div><div class="degInfos"></div>'+resHere);
            } else {
                $('#b'+bat.tileId).append('<div class="iUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png"></div><div class="aliInfos"><img src="/static/img/avet2.png" width="15"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="7"></div>'+resHere);
            }
        } else {
            $('#b'+bat.tileId).append('<div class="iUnits"></div><div class="aliInfos"></div><div class="degInfos"></div>'+resHere);
        }
    } else if (batType.kind === 'game') {
        $('#b'+bat.tileId).append('<div class="gUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+batShowedName+tagz+'"></div><div class="aliInfos"><img src="/static/img/gvet2.png" width="15"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="7"></div>'+resHere);
    } else {
        $('#b'+bat.tileId).append('<div class="aUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+batShowedName+tagz+'"></div><div class="aliInfos"><img src="/static/img/avet2.png" width="15"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="7"></div>'+resHere);
    }
};

function showBataillon(bat) {
    let batType = getBatType(bat);
    let nomComplet = bat.type;
    if (bat.chief != undefined) {
        if (bat.chief != '') {
            let grade = getGrade(bat,batType);
            nomComplet = nomComplet+' ('+grade+' '+bat.chief+')';
        }
    }
    let batPic = getBatPic(bat,batType);
    let batCat = batType.cat;
    let unitsLeft = bat.squadsLeft*batType.squadSize;
    if (batType.squads === 6 && batType.squadSize === 1 && (batType.cat === 'buildings' || batType.cat === 'devices' || batType.skills.includes('transorbital'))) {
        unitsLeft = '';
    } else if (batType.skills.includes('nonumname')) {
        unitsLeft = '';
    } else if (bat.citoyens >= 1) {
        unitsLeft = '';
    }
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    let degNum = getDamageBar(bat);
    let activityBar = 'nope';
    if (bat.tags.includes('mining')) {
        activityBar = 'mining';
    } else {
        if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || bat.eq === 'detector' || bat.logeq === 'detector' || bat.eq === 'g2ai' || bat.logeq === 'g2ai' || batType.skills.includes('initiative') || batType.skills.includes('noguet') || Object.keys(batType.weapon).length <= 0) {
            activityBar = 'guet';
        }
    }
    let uClass = 'pUnits';
    if (batType.cat === 'buildings') {
        if (bat.fuzz <= -2) {
            uClass = 'pUnitsCamoFortif';
        } else {
            uClass = 'pUnitsFortif';
        }
    } else {
        if (bat.fuzz <= -2) {
            if (bat.tags.includes('fortif')) {
                uClass = 'pUnitsCamoFortif';
            } else {
                uClass = 'pUnitsCamo';
            }
        } else {
            if (bat.tags.includes('fortif')) {
                uClass = 'pUnitsFortif';
            }
        }
    }
    if (!modeSonde) {
        $('#b'+bat.tileId).append('<div class="'+uClass+'"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+nomComplet+'"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="7"><img src="/static/img/'+activityBar+'.png" width="7"></div><div class="batInfos"><img src="/static/img/vet'+bat.vet+'.png" width="15"></div>'+resHere);
    } else {
        $('#b'+bat.tileId).append('<div class="'+uClass+'"></div><div class="degInfos"></div><div class="batInfos"></div>'+resHere);
    }
};

function showPrefab(bat) {
    let batType = getBatType(bat);
    let nomComplet = bat.type;
    if (bat.chief != undefined) {
        if (bat.chief != '') {
            let grade = getGrade(bat,batType);
            nomComplet = nomComplet+' ('+grade+' '+bat.chief+')';
        }
    }
    let batPic = getBatPic(bat,batType);
    let batCat = batType.cat;
    let unitsLeft = bat.squadsLeft*batType.squadSize;
    if (batType.squads === 6 && batType.squadSize === 1 && (batType.cat === 'buildings' || batType.cat === 'devices' || batType.skills.includes('transorbital'))) {
        unitsLeft = '';
    } else if (batType.skills.includes('nonumname')) {
        unitsLeft = '';
    } else if (bat.citoyens >= 1) {
        unitsLeft = '';
    }
    $('#b'+bat.vmt).empty();
    let resHere = showRes(bat.vmt);
    let degNum = getDamageBar(bat);
    let activityBar = 'nope';
    if (bat.tags.includes('mining')) {
        activityBar = 'mining';
    } else {
        if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || bat.eq === 'detector' || bat.logeq === 'detector' || bat.eq === 'g2ai' || bat.logeq === 'g2ai' || batType.skills.includes('initiative') || batType.skills.includes('noguet') || Object.keys(batType.weapon).length <= 0) {
            activityBar = 'guet';
        }
    }
    let uClass = 'pUnits';
    if (batType.cat === 'buildings') {
        if (bat.fuzz <= -2) {
            uClass = 'pUnitsCamoFortif';
        } else {
            uClass = 'pUnitsFortif';
        }
    } else {
        if (bat.fuzz <= -2) {
            if (bat.tags.includes('fortif')) {
                uClass = 'pUnitsCamoFortif';
            } else {
                uClass = 'pUnitsCamo';
            }
        } else {
            if (bat.tags.includes('fortif')) {
                uClass = 'pUnitsFortif';
            }
        }
    }
    if (!modeSonde) {
        $('#b'+bat.vmt).append('<div class="'+uClass+'"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+nomComplet+'"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="7"><img src="/static/img/'+activityBar+'.png" width="7"></div><div class="batInfos"><img src="/static/img/vet'+bat.vet+'.png" width="15"></div>'+resHere);
    } else {
        $('#b'+bat.vmt).append('<div class="'+uClass+'"></div><div class="degInfos"></div><div class="batInfos"></div>'+resHere);
    }
};

function getDamageBar(bat) {
    let batType = getBatType(bat);
    let degNum = 7;
    let hurt = isHurt(bat);
    if (hurt) {
        let degPerc = Math.round(100*bat.squadsLeft/batType.squads);
        if (bat.squadsLeft === 1) {
            degNum = 1;
        } else if (degPerc < 35) {
            degNum = 2;
        } else if (degPerc < 55) {
            degNum = 3;
        } else if (degPerc < 70) {
            degNum = 4;
        } else if (degPerc < 86 || bat.squadsLeft < batType.squads) {
            degNum = 5;
        } else if (degPerc < 100 || (degPerc == 100 && bat.damage > 1)) {
            degNum = 6;
        }
    }
    return degNum;
};

function hideBataillon(bat) {
    $('#b'+bat.tileId).empty();
};

function writeMapStyles() {
    $('#mapStyles').empty();
    $('#mapStyles').append('.grid-container {grid-template-columns:');
    let i = 0;
    while (i < numHTiles) {
        $('#mapStyles').append(' 72px');
        i++;
    }
    $('#mapStyles').append(';grid-template-rows:');
    i = 0;
    while (i < numVTiles) {
        $('#mapStyles').append(' 72px');
        i++;
    }
    $('#mapStyles').append(';}');
};

function getTerrainFilter(mapInf) {
    let terClass = 'terPic';
    if (!playerInfos.onShip || modeSonde) {
        if (mapInf.snd === undefined) {
            zoneReport(zone,true);
        }
        if (mapInf.snd === 'thunderfull' || mapInf.snd === 'thunderstart') {
            terClass = 'terPicRain';
        }
        if (mapInf.snd === 'cricketsloop' || mapInf.snd === 'jungle') {
            terClass = 'terPicSun';
        }
        if (mapInf.snd === 'rainforest' || mapInf.snd === 'birds' || mapInf.snd === 'crickets' || mapInf.snd === 'howlwind' || mapInf.snd === 'bogs') {
            terClass = 'terPic';
        }
        if (mapInf.snd === 'fogfrogs' || mapInf.snd === 'strange') {
            terClass = 'terPicFog';
        }
        if (mapInf.snd === 'sywind' || mapInf.snd === 'bwind') {
            terClass = 'terPicGrav';
        }
        if (mapInf.snd === 'bwindred' || mapInf.snd === 'thunderred' || mapInf.snd === 'redwind') {
            terClass = 'terPicHot';
        }
        if (mapInf.snd === 'uhuwind' || mapInf.snd === 'swamp' || mapInf.snd === 'monsoon') {
            terClass = 'terPicTox';
        }
    }
    return terClass;
}

function mapTilesFiltering(reset,f1,f1p,f2,f2p,f3,f3p,f4,f4p,f5,f5p) {
    let filters = '';
    let terClass = 'terPic';
    if (f3 === undefined) {
        f3 = 'opacity';
        f3p = 100;
    }
    if (f4 === undefined) {
        f4 = 'opacity';
        f4p = 100;
    }
    if (f5 === undefined) {
        f5 = 'opacity';
        f5p = 100;
    }
    if (!reset) {
        if (f1 === 'hue-rotate') {
            filters = f1+'('+f1p+'deg)'+' '+f2+'('+f2p+'%)'+' '+f3+'('+f3p+'%)'+' '+f4+'('+f4p+'%)'+' '+f5+'('+f5p+'%)';
        } else if (f2 === 'hue-rotate') {
            filters = f1+'('+f1p+'%)'+' '+f2+'('+f2p+'deg)'+' '+f3+'('+f3p+'%)'+' '+f4+'('+f4p+'%)'+' '+f5+'('+f5p+'%)';
        } else {
            filters = f1+'('+f1p+'%)'+' '+f2+'('+f2p+'%)'+' '+f3+'('+f3p+'%)'+' '+f4+'('+f4p+'%)'+' '+f5+'('+f5p+'%)';
        }
    } else {
        filters = 'grayscale(0%) brightness(100%) contrast(100%)';
    }
    terClass = getTerrainFilter(zone[0]);
    $("."+terClass).css("filter",filters);
};
