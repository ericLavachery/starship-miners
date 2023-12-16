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
function showMap(wmap,justMoved,isPrev) {
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
    if (!justMoved) {
        allZoneRes = [];
        allCheckedZoneRes = [];
    }
    viewBorders = [];
    let sondeViewDistance = Math.ceil((playerInfos.comp.vsp+3)*(playerInfos.comp.det+8)/8);
    if (modeSonde || modeLanding) {
        playerInfos.showedTiles = [1830];
        showLanderLandingTiles();
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
        resHere = showRes(tile.id);
        if (tile.seed >= 10) {
            tPic = tile.terrain+'_0'+tile.seed;
        } else {
            // tPic = tile.terrain+'_00'+tile.seed;
            // if (zone[0].planet === 'Gehenna' && tile.terrain === 'F') {
            //     tPic = tile.terrain+'b_00'+tile.seed;
            // } else {
            //     tPic = tile.terrain+'_00'+tile.seed;
            // }
            if (tile.terrain === 'F') {
                tPic = tile.terrain+'c_00'+tile.seed;
            } else {
                tPic = tile.terrain+'_00'+tile.seed;
            }
        }
        if (zone[0].dark) {
            let distance = 0;
            if (modeSonde || zone[0].isPrev || modeLanding) {
                distance = calcDistance(tile.id,1830);
            }
            if ((modeSonde || zone[0].isPrev || modeLanding) && distance <= sondeViewDistance) {
                terclass = 'ter'+tile.terrain+tile.seed;
            } else if (zone[0].undarkOnce.includes(tile.id) || zone[0].undarkAll) {
                terclass = 'ter'+tile.terrain+tile.seed;
            } else {
                terclass = 'terFog';
                tPic = 'D_001';
            }
        } else {
            if (zone[0].planet === 'Gehenna' && tile.terrain === 'F') {
                terclass = 'ter'+tile.terrain+'b'+tile.seed;
            } else {
                terclass = 'ter'+tile.terrain+tile.seed;
            }
        }
        $('#zone_map').append('<div id="'+tile.id+'" class="grid-item '+terclass+'" onclick="clickTile('+tile.id+')" title="#'+tile.id+' ('+tile.y+'&lrhar;'+tile.x+')"><span class="'+terClass+'"><img src="/static/img/sntiles/'+tPic+'.png"></span><span class="bigIcon" id="b'+tile.id+'">'+resHere+'</span><br></div>');
        if (!modeSonde && !zone[0].isPrev) {
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
        selectMode(); // ?????????????? XXXXXXXXXXXXXXXXXXXXXXXXXX
        alienOccupiedTileList();
        playerOccupiedTileList();
    }
    mapEffect();
    // if (showMini && activeTurn == 'player') {
    //     unitsView();
    // }
    // console.log(zone);
};

function toggleMapEffect() {
    if (playerInfos.clouds) {
        playerInfos.clouds = false;
        // mapEffectOut();
    } else {
        playerInfos.clouds = true;
        // mapEffectIn();
    }
    showMap(zone,false);
};

function mapEffect() {
    $('#zone_effect').empty();
    let hpix = (numHTiles*72)+10;
    let vpix = (numVTiles*72)+10;
    let hmon = hpix-6;
    let vmon = vpix-8;
    if (!inSoute) {
        if (!playerInfos.clouds) {
            $('#zone_effect').append('<span class="cloudz" id="dirty"><img src="/static/img/scratchGrid7.png"></span>');
        } else {
            if (playerInfos.bldVM.includes('Centre de com')) {
                $('#zone_effect').append('<span class="cloudz" id="dirty"><img src="/static/img/scratchGrid7.png"></span>');
            } else {
                $('#zone_effect').append('<span class="cloudz" id="dirty"><img src="/static/img/dirtyGrid8.png"></span>');
            }
        }
        $("#dirty").css('clip', 'rect(0px, '+hpix+'px, '+vpix+'px, 0px)');
        $('#zone_monitor').empty();
        $('#zone_monitor').append('<img src="/static/img/empty.png" width="'+hmon+'" height="'+vmon+'">');
        $("#zone_monitor").css("display","block");
    } else {
        $("#zone_monitor").css("display","none");
    }
};

function mapEffectOut() {
    $("#zone_effect").css("display","none");
};

function mapEffectIn() {
    $("#zone_effect").css("display","block");
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

function getRuinsPic(ruinType) {
    let ruinPic = 'ruins1';
    let ruinSize = ruinType.checks.length;
    let theRuin = getEquipByName(ruinType.name);
    if (Object.keys(theRuin).length >= 1) {
        ruinPic = theRuin.pic;
    } else {
        ruinPic = 'ruins12';
    }
    if (ruinType.name === 'Habitations' && ruinSize >= 2) {
        ruinPic = 'ruins2';
    }
    return ruinPic;
};

function showRes(tileId) {
    let tile = zone[tileId];
    let mapIndicators = '';
    let res = '';
    let view = true;
    if (zone[0].dark) {
        if (!zone[0].undarkOnce.includes(tile.id) && !zone[0].undarkAll) {
            view = false;
        }
    }
    let tileText = '';
    if (tile.tileName != undefined) {
        if (tile.tileName != '') {
            let showTileName = tile.tileName.toUpperCase();
            tileText = tileText+showTileName+'&nbsp;&nbsp;&nbsp; ';
        }
    }
    if (tile.ruins) {
        let ruinType = {};
        ruinType.name = '?';
        ruinType.checks = ['any','any'];
        ruinType.scrap = 250;
        if (tile.rt != undefined) {
            ruinType = tile.rt;
        }
        let fullIndicator = '';
        if (ruinType.full && playerInfos.pseudo === 'Mapedit') {
            fullIndicator = '&#9872;';
        }
        let ruinPic = getRuinsPic(ruinType);
        if (tile.sh === -1) {
            mapIndicators = mapIndicators+'<div class="ruins" title="'+ruinType.name+'"><img style="opacity:0.9;" src="/static/img/units/ruins/'+ruinPic+'f.png"></div>';
        } else {
            mapIndicators = mapIndicators+'<div class="ruins" title="'+ruinType.name+'"><img style="opacity:0.9;" src="/static/img/units/ruins/'+ruinPic+'.png"></div>';
        }
        tileText = tileText+'&#127962; Ruines ('+ruinType.name+fullIndicator+')&nbsp;&nbsp;&nbsp; ';
    }
    if (tile.ap != undefined) {
        if (tile.ap.includes('grenade') || tile.ap.includes('dynamite') || tile.ap.includes('molotov')) {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/apgren.png"></div>';
            tileText = tileText+'&#127890; (Munitions:&nbsp; '+tile.ap+')';
        } else if (tile.ap.includes('lame-')) {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/aplame.png"></div>';
            tileText = tileText+'&#127890; (Lames:&nbsp; '+tile.ap+')';
        } else if (tile.ap === 'drg_sudu' || tile.ap === 'drg_nitro') {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/apnitro.png"></div>';
            tileText = tileText+'&#127890; (Tuning:&nbsp; '+tile.ap.replace('drg_','')+')';
        } else if (tile.ap === 'drg_meca') {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/apmeca.png"></div>';
            tileText = tileText+'&#127890; (Tuning:&nbsp; '+tile.ap.replace('drg_','')+')';
        } else if (tile.ap === 'drg_starka' || tile.ap === 'drg_kirin' || tile.ap === 'drg_octiron') {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/apmed.png"></div>';
            tileText = tileText+'&#127890; (Drogues:&nbsp; '+tile.ap.replace('drg_','')+')';
        } else if (tile.ap.includes('drg_')) {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/apdrug.png"></div>';
            tileText = tileText+'&#127890; (Drogues:&nbsp; '+tile.ap.replace('drg_','')+')';
        } else if (tile.ap.includes('eq_')) {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/apequip.png""></div>';
            tileText = tileText+'&#127890; (Equipements:&nbsp; '+tile.ap.replace('eq_','')+')';
        } else if (tile.ap.includes('prt_')) {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/aparmor.png""></div>';
            tileText = tileText+'&#127890; (Armures:&nbsp; '+tile.ap.replace('prt_','')+')';
        } else {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/apslugs.png"></div>';
            tileText = tileText+'&#127890; (Munitions:&nbsp; '+tile.ap+')';
        }
        tileText = tileText+'&nbsp;&nbsp;&nbsp; ';
    }
    if (mode === 'select' || mode === 'edit') {
        if (tile.rq != undefined) {
            if (playerInfos.comp.det >= 1 || !modeSonde) {
                res = JSON.stringify(tile.rs);
                res = res.replace(/"/g,"");
                res = res.replace(/{/g,"");
                res = res.replace(/}/g,"");
                res = res.replace(/,/g," &nbsp;&#128313;&nbsp; ");
                res = res.replace(/:/g," ");
                if (playerInfos.comp.det >= 3 || !modeSonde) {
                    // tout voir
                } else {
                    res = res.replace(/&nbsp;&#128313;&nbsp;/g,"");
                    res = res.replace(/\d+/g,"");
                }
                if (playerInfos.resFlags.length >= 1) {
                    playerInfos.resFlags.forEach(function(resName) {
                        res = res.replace(resName,resName+'&#10071;');
                    });
                }
            }
        }
    }
    let hasMapInfos = false;
    let hasTileName = false;
    if (tile.rd || tile.qs || tile.rq != undefined) {
        hasMapInfos = true;
    }
    if (tile.tileName != undefined) {
        if (tile.tileName != '') {
            hasMapInfos = true;
            hasTileName = true;
        }
    }
    if (hasMapInfos) {
        mapIndicators = mapIndicators+'<div class="mapInfos">';
        if (tile.rq != undefined) {
            tileText = tileText+'&#9935;&nbsp; ('+res+') ';
        }
    }
    if (tile.rd) {
        mapIndicators = mapIndicators+'<i class="fas fa-shoe-prints fa-rotate-270 road"></i>';
    } else if (tile.qs) {
        mapIndicators = mapIndicators+'<i class="fas fa-water road"></i>';
    }
    if (hasTileName) {
        mapIndicators = mapIndicators+'<i class="fas fa-map-marker-alt inficon"></i>';
    }
    if (tile.rq != undefined) {
        mapIndicators = mapIndicators+'<i class="fas fa-atom inficon rq'+tile.rq+'"></i>';
    }
    if (hasMapInfos) {
        mapIndicators = mapIndicators+'</div>';
    }
    if (tile.infra === 'Miradors' && view) {
        mapIndicators = mapIndicators+'<div class="infraz"><img src="/static/img/units/mirador.png"></div>';
    }
    if (tile.infra === 'Palissades' && view) {
        mapIndicators = mapIndicators+'<div class="infraz"><img src="/static/img/units/palissade.png"></div>';
    }
    if (tile.infra === 'Remparts' && view) {
        mapIndicators = mapIndicators+'<div class="infraz"><img src="/static/img/units/rempart.png"></div>';
    }
    if (tile.infra === 'Murailles' && view) {
        mapIndicators = mapIndicators+'<div class="infraz"><img src="/static/img/units/muraille.png"></div>';
    }
    if (tile.infra === 'Terriers' && view) {
        mapIndicators = mapIndicators+'<div class="infraz"><img src="/static/img/units/terrier.png"></div>';
    }
    if (tile.infra === 'Débris' && view) {
        mapIndicators = mapIndicators+'<div class="ruins"><img style="opacity:0.8;" src="/static/img/units/debris.png"></div>';
    }
    if (tile.infra === 'Crystal') {
        mapIndicators = mapIndicators+'<div class="infraz"><img src="/static/img/units/crystal.png"></div>';
    }
    if (view) {
        if (tile.web) {
            let webNum = tile.seed;
            if (webNum > 6) {
                webNum = webNum-6;
            }
            mapIndicators = mapIndicators+'<div class="webz"><img src="/static/img/units/web'+webNum+'.png"></div>';
        } else if (tile.ecto) {
            let webNum = tile.seed;
            if (webNum > 6) {
                webNum = webNum-6;
            }
            mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/ecto'+webNum+'.png"></div>';
        } else if (tile.crat) {
            mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/crater.png"></div>';
        } else if (tile.moist) {
            let webNum = tile.seed;
            if (webNum > 6) {
                webNum = webNum-6;
            }
            mapIndicators = mapIndicators+'<div class="ruins"><img src="/static/img/units/moss'+webNum+'.png"></div>';
        }
    }
    if (playerInfos.mapTurn < 2 || playerInfos.pseudo === 'Mapedit') {
        if (tile.land != undefined) {
            if (tile.land) {
                if (isStartZone) {
                    mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/abri.png"></div>';
                } else {
                    mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/landSpot.png"></div>';
                }
            }
        }
        if (tile.nav != undefined) {
            if (tile.nav) {
                mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/navSpot.png"></div>';
            }
        }
    }
    if (playerInfos.pseudo === 'Mapedit') {
        if (tile.cocon != undefined) {
            if (tile.cocon) {
                mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/units/coconSpot.png"></div>';
            }
        }
    }
    if (playerInfos.showedTiles.includes(tileId)) {
        if (tileId === 1830) {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/showCenterTile.png"></div>';
        } else if (zone[0].planet === 'Horst') {
            mapIndicators = mapIndicators+'<div class="mark"><img src="/static/img/showTileHorst.png"></div>';
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
        let tseed = tile.seed;
        if (tseed > 6) {
            tseed = tseed-6;
        }
        if (playerInfos.stList.includes(tileId)) {
            mapIndicators = mapIndicators+'<div class="stormz"><img src="/static/img/storm'+tseed+'.png"></div>';
        } else if (playerInfos.sqList.includes(tileId)) {
            if (playerInfos.bldVM.includes('Station météo')) {
                mapIndicators = mapIndicators+'<div class="squallz"><img src="/static/img/storm'+tseed+'.png"></div>';
            }
        }
    }
    if (mode === 'select' || mode === 'edit') {
        if (tileText != '') {
            mapIndicators = mapIndicators+'<div class="markover" title="'+tileText+'"></div>';
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
    if (batType.name === 'Minitanks') {
        if (batType.weapon2.name.includes('plasma')) {
            batPic = 'minitank-p';
        }
    }
    if (batType.name === 'Mongrels' || batType.name === 'Klogs') {
        if (hasSnif(bat,batType)) {
            batPic = 'dogzmutant';
        } else {
            batPic = 'dogzclone';
        }
    }
    if (batType.pic.includes('-v1')) {
        if (playerInfos.pseudo === 'Mapedit') {
            // reste v1;
        } else {
            if (bat.pv === undefined) {
                let picNum1 = rand.rand(1,4);
                let picNum2 = rand.rand(1,4);
                if (picNum1 < picNum2) {
                    bat.pv = picNum1;
                } else {
                    bat.pv = picNum2;
                }
            }
            if (bat.type === 'Tacots' && bat.eq === 'g2motor') {
                bat.pv = 4;
            }
            batPic = batPic.replace('-v1','-v'+bat.pv);
            if (batPic === 'bus-v4') {
                bat.chief = 'Priscilla';
                bat.ok = 'ok4';
            }
            if (batPic === 'tacot-v4') {
                if (bat.eq === 'aucun') {
                    bat.eq = 'g2motor';
                    bat.ap = bat.ap+4;
                }
            }
        }
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
    if (batType.name === 'Coque' || batType.name === 'Oeuf') {
        if (bat.tags.includes('permashield')) {
            batPic = batPic+'-hard';
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
    let batShowedNum = unitsLeft;
    if (batType.squads === 6 && batType.squadSize === 1) {
        batShowedNum = 1;
        tagz = tagz+'('+bat.squadsLeft+'/'+batType.squads+') ';
    }
    if (batType.class === 'X') {
        tagz = tagz+myKind;
    }
    if (mode === 'edit' || playerInfos.pseudo === 'Mapedit') {
        if (bat.tags.includes('fastmorph')) {
            tagz = tagz+' (fastmorph)';
        }
        if (bat.tags.includes('permashield')) {
            tagz = tagz+' (permashield)';
        }
    }
    if (playerInfos.comp.det >= 3 && playerInfos.comp.ca >= 2) {
        tagz = tagz+' ('+bat.apLeft+' PA)';
    }
    if (playerInfos.comp.det >= 3 && playerInfos.comp.ca >= 3) {
        let ripNum = getRipNum(bat,batType);
        if (!batType.skills.includes('infrip')) {
            tagz = tagz+' ('+ripNum+' rip)';
        } else {
            tagz = tagz+' (rip inf)';
        }
    }
    if (bat.tags.includes('poison')) {
        let allTags = _.countBy(bat.tags);
        tagz = tagz+' (poison: '+allTags.poison+')';
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
    if (bat.tags.includes('shinda')) {
        tagz = tagz+' (shinda)';
    }
    if (bat.tags.includes('bio')) {
        tagz = tagz+' (bio)';
    }
    if (bat.tags.includes('necro')) {
        tagz = tagz+' (necro)';
    }
    if (bat.tags.includes('stun')) {
        tagz = tagz+' (stun)';
    }
    if (bat.tags.includes('jelly')) {
        tagz = tagz+' (jelly)';
    } else if (bat.tags.includes('jello')) {
        tagz = tagz+' (jello)';
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
    if (bat.pdm != undefined && mode === 'edit') {
        tagz = tagz+' (GARDE)';
    }
    if (((zone[0].dark && !undarkNow.includes(bat.tileId) && !bat.tags.includes('fluo')) || batType.skills.includes('invisible')) && playerInfos.pseudo != 'Mapedit') {
        if (doggedTiles.includes(bat.tileId)) {
            $('#b'+bat.tileId).append('<div class="iUnits"><img src="/static/img/units/'+batCat+'/invisible.png" width="64"></div><div class="aliInfos"></div><div class="degInfos"></div>'+resHere);
        } else {
            $('#b'+bat.tileId).append('<div class="iUnits"></div><div class="aliInfos"></div><div class="degInfos"></div>'+resHere);
        }
    } else if (bat.tags.includes('invisible') && !bat.tags.includes('fluo') && playerInfos.pseudo != 'Mapedit') {
        if (playerInfos.vue >= 6 || doggedTiles.includes(bat.tileId)) {
            if (degNum >= 7) {
                $('#b'+bat.tileId).append('<div class="iUnits"><img src="/static/img/units/'+batCat+'/invisible.png" width="64"></div><div class="aliInfos"></div><div class="degInfos"></div>'+resHere);
            } else {
                $('#b'+bat.tileId).append('<div class="iUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" width="64"></div><div class="aliInfos"><img src="/static/img/avet2.png" width="15"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="9"></div>'+resHere);
            }
        } else {
            $('#b'+bat.tileId).append('<div class="iUnits"></div><div class="aliInfos"></div><div class="degInfos"></div>'+resHere);
        }
    } else if (batType.kind === 'game') {
        $('#b'+bat.tileId).append('<div class="gUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" width="64" title="'+batShowedNum+' '+batShowedName+tagz+'"></div><div class="aliInfos"><img src="/static/img/gvet2.png" width="15"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="9"></div>'+resHere);
    } else {
        $('#b'+bat.tileId).append('<div class="aUnits"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" width="64" title="'+batShowedNum+' '+batShowedName+tagz+'"></div><div class="aliInfos"><img src="/static/img/avet2.png" width="15"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="9"></div>'+resHere);
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
    if (bat.army != undefined) {
        if (bat.army >= 1) {
            nomComplet = nomComplet+' (a'+bat.army+')';
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
        unitsLeft = bat.citoyens;
    }
    $('#b'+bat.tileId).empty();
    let resHere = showRes(bat.tileId);
    let degNum = getDamageBar(bat);
    let activityBar = getActivityBar(bat,batType);
    let transBar = getTransBar(bat,batType);
    let uClass = 'pUnits';
    if (batType.cat === 'buildings' || batType.skills.includes('transorbital')) {
        if (batType.name === 'Soute') {
            uClass = 'pUnitsNoPrefab';
        } else if (playerInfos.onShip && !batType.skills.includes('prefab') && !batType.skills.includes('transorbital')) {
            uClass = 'pUnitsNoPrefab';
        } else {
            if (bat.fuzz <= -2 && bat.type != 'Fosses') {
                uClass = 'pUnitsCamoFortif';
            } else {
                uClass = 'pUnitsFortif';
            }
        }
    } else {
        if (bat.fuzz <= -2 && bat.type != 'Fosses') {
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
    let tagz = ' ';
    if (mode === 'edit' || playerInfos.pseudo === 'Mapedit') {
        if (bat.tags.includes('outsider')) {
            tagz = tagz+' (outsider)';
        }
        if (bat.tags.includes('nomove')) {
            tagz = tagz+' (nomove)';
        }
        if (bat.tags.includes('noprefab')) {
            tagz = tagz+' (noprefab)';
        }
        if (bat.tags.includes('nopilots')) {
            tagz = tagz+' (nopilots)';
        }
    }
    if (bat.tags.includes('nomove')) {
        uClass = uClass+' nmUnits';
    }
    if (mode === 'move') {
        $('#b'+bat.tileId).append('<div class="'+uClass+'" id="xk'+bat.id+'"><img src="/static/img/units/'+batCat+'/'+batPic+'.png"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="9"><img src="/static/img/'+activityBar+'.png" width="9"><img src="/static/img/'+transBar+'.png" width="9"></div><div class="batInfos"><img src="/static/img/vet'+bat.vet+'.png" width="15"></div>'+resHere);
    } else {
        if (!modeSonde) {
            $('#b'+bat.tileId).append('<div class="'+uClass+'" id="xk'+bat.id+'"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+nomComplet+tagz+'"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="9"><img src="/static/img/'+activityBar+'.png" width="9"><img src="/static/img/'+transBar+'.png" width="9"></div><div class="batInfos"><img src="/static/img/vet'+bat.vet+'.png" width="15"></div>'+resHere);
        } else {
            $('#b'+bat.tileId).append('<div class="'+uClass+'"></div><div class="degInfos"></div><div class="batInfos"></div>'+resHere);
        }
    }
};

function getTransBar(bat,batType) {
    let transBar = 'abar-empty';
    let isCharged = checkCharged(bat,'trans');
    let hasFret = false;
    if (batType.transRes >= 1) {
        if (Object.keys(bat.transRes).length >= 1) {
            hasFret = true;
        }
    }
    if (isCharged) {
        if (hasFret) {
            transBar = 'abar-both';
        } else {
            transBar = 'abar-trans';
        }
    } else {
        if (hasFret) {
            transBar = 'abar-fret';
        }
    }
    return transBar;
};

function getActivityBar(bat,batType) {
    let activityBar = 'abar-nope';
    if (batType.mining != undefined) {
        if (bat.tags.includes('mining')) {
            activityBar = 'abar-prod';
        } else if (!playerInfos.onShip && batType.kind === 'zero-extraction') {
            activityBar = 'abar-warn';
        }
    }
    if (activityBar === 'abar-nope') {
        if (batType.skills.includes('prodres') || batType.skills.includes('geo') || batType.skills.includes('solar') || batType.skills.includes('cram') || batType.skills.includes('dogprod') || batType.skills.includes('transcrap') || batType.skills.includes('cryogen') || batType.skills.includes('cryocit')) {
            if (bat.tags.includes('prodres')) {
                activityBar = 'abar-prod';
            } else {
                activityBar = 'abar-warn';
            }
        }
    }
    if (activityBar === 'abar-nope') {
        if (!playerInfos.onShip) {
            if (bat.tags.includes('guet') || batType.skills.includes('sentinelle') || hasEquip(bat,['detector','g2ai']) || batType.skills.includes('initiative')) {
                activityBar = 'abar-guet';
            }
        }
    }
    return activityBar;
};

function updateDogTiles(tileId) {
    let newTileId = tileId-1;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+1;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-1-mapSize;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+1-mapSize;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-mapSize;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-1+mapSize;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+1+mapSize;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+mapSize;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-mapSize-mapSize-2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-mapSize-mapSize-1;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-mapSize-mapSize;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-mapSize-mapSize+1;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-mapSize-mapSize+2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+mapSize+mapSize-2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+mapSize+mapSize-1;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+mapSize+mapSize;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+mapSize+mapSize+1;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+mapSize+mapSize+2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-mapSize+2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+mapSize+2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId-mapSize-2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
    }
    newTileId = tileId+mapSize-2;
    if (!doggedTiles.includes(newTileId)) {
        doggedTiles.push(newTileId);
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
    let activityBar = getActivityBar(bat,batType);
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
        $('#b'+bat.vmt).append('<div class="'+uClass+'"><img src="/static/img/units/'+batCat+'/'+batPic+'.png" title="'+unitsLeft+' '+nomComplet+'"></div><div class="degInfos"><img src="/static/img/damage'+degNum+'b.png" width="9"><img src="/static/img/'+activityBar+'.png" width="9"></div><div class="batInfos"><img src="/static/img/vet'+bat.vet+'.png" width="15"></div>'+resHere);
    } else {
        $('#b'+bat.vmt).append('<div class="'+uClass+'"></div><div class="degInfos"></div><div class="batInfos"></div>'+resHere);
    }
};

function getDamageBar(bat) {
    let batType = getBatType(bat);
    let degNum = 7;
    if (playerInfos.onShip) {
        if (bat.soins != undefined) {
            if (bat.soins >= 1) {
                degNum = Math.ceil((50-bat.soins)/8);
                if (degNum < 1) {degNum = 1;}
                if (degNum > 7) {degNum = 7;}
            }
        }
    } else {
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
        if (mapInf.snd === 'thunderfull' || mapInf.snd === 'thunderstart' || mapInf.snd === 'bogs') {
            terClass = 'terPicRain';
        }
        if (mapInf.snd === 'rainforest' || mapInf.snd === 'cricketsloop' || mapInf.snd === 'jungle') {
            terClass = 'terPicSun';
        }
        if (mapInf.snd === 'birds' || mapInf.snd === 'crickets' || mapInf.snd === 'howlwind') {
            terClass = 'terPic';
        }
        if (mapInf.pid != undefined) {
            if (mapInf.pid === 2) {
                terClass = 'terPicFog';
            }
            if (mapInf.pid === 3) {
                terClass = 'terPicTox';
            }
            if (mapInf.pid === 4) {
                terClass = 'terPicGrav';
            }
            if (mapInf.pid === 5) {
                terClass = 'terPicHot';
            }
        } else {
            if (mapInf.snd === 'fogfrogs' || mapInf.snd === 'strange') {
                terClass = 'terPicFog';
            }
            if (mapInf.snd === 'uhuwind' || mapInf.snd === 'swamp' || mapInf.snd === 'monsoon') {
                terClass = 'terPicTox';
            }
            if (mapInf.snd === 'sywind' || mapInf.snd === 'bwind') {
                terClass = 'terPicGrav';
            }
            if (mapInf.snd === 'bwindred' || mapInf.snd === 'thunderred' || mapInf.snd === 'redwind') {
                terClass = 'terPicHot';
            }
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
