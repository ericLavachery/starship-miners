function showTileInfos(tileId) {
    $("#tileInfos").css("display","block");
    $('#tileInfos').empty();
    justReloaded = false;
    selectedTile = tileId;
    let tileIndex = zone.findIndex((obj => obj.id == tileId));
    let tile = zone[tileIndex];
    let ruinType = checkRuinType(tile,false);
    let terrainIndex = terrainTypes.findIndex((obj => obj.name == tile.terrain));
    let terrain = terrainTypes[terrainIndex];
    let potable = checkPotable(zone,tile.id);
    let view = true;
    if (zone[0].dark && !zone[0].undarkOnce.includes(selectedTile) && !zone[0].undarkAll) {
        view = false;
    }
    let terName = getTerFullName(tile,terrain);
    $('#tileInfos').append('<span class="blockTitle"><h3>'+terName+'</h3></span>');
    $('#tileInfos').append('<div class="shSpace"></div>');
    // NOM
    if (tile.tileName != undefined) {
        if (tile.tileName != '') {
            $('#tileInfos').append('<span class="paramIcon"><i class="fas fa-map-signs"></i></span><span class="fullLine or"><b>'+tile.tileName+'</b></span><br>');
        }
    }
    if (view) {
    }
    // Type d'oeufs
    if (playerInfos.comp.ca >= 3) {
        let eggType = 'Bug';
        let eggKind = checkEggKindByZoneType();
        if (eggKind === '') {
            eggKind = getAKindByTer(tile.terrain,zone[0].pKind,zone[0].gKind,zone[0].sKind);
            eggType = capitalizeFirstLetter(eggKind);
        } else {
            eggType = capitalizeFirstLetter(eggKind);
        }
        $('#tileInfos').append('<span class="paramName mauve">Type d\'oeuf</span><span class="paramIcon"><i class="fas fa-bug"></i></span><span class="paramValue mauve">'+eggType+'</span><br>');
    }
    if (view) {
        if (zone[0].planet === 'Horst') {
            if (playerInfos.stList.includes(tileId)) {
                $('#tileInfos').append('<span class="paramName mauve">Intempéries</span><span class="paramIcon"><i class="fas fa-bug"></i></span><span class="paramValue mauve">Tempête</span><br>');
            } else if (playerInfos.sqList.includes(tileId)) {
                $('#tileInfos').append('<span class="paramName mauve">Intempéries</span><span class="paramIcon"></span><span class="paramValue mauve">Bourasque</span><br>');
            }
        }
        // Aménagements
        if (tile.ruins) {
            let fullIndicator = '';
            if (ruinType.full && playerInfos.pseudo === 'Mapedit') {
                fullIndicator = ' &#9872;';
            }
            if (allowCheat) {
                $('#tileInfos').append('<span class="paramName cy klik" onclick="searchRuins(0,'+tile.id+')">Ruines'+fullIndicator+'</span><span class="paramIcon"><i class="fas fa-city"></i></span><span class="paramValue cy">'+ruinType.name+'</span><br>');
            } else {
                $('#tileInfos').append('<span class="paramName cy">Ruines'+fullIndicator+'</span><span class="paramIcon"><i class="fas fa-city"></i></span><span class="paramValue cy">'+ruinType.name+'</span><br>');
            }
        }
        if (tile.infra != undefined) {
            let infraInfo = showInfraInfo(tile.infra,true,false);
            $('#tileInfos').append('<span class="paramName cy">Infrastructure</span><span class="paramIcon"><i class="ra ra-tower rpg"></i></span><span class="paramValue cy" title="'+infraInfo+'">'+tile.infra+'</span><br>');
        }
        if (tile.rd != undefined) {
            if (tile.rd) {
                if (tile.terrain === 'W' || tile.terrain === 'R' || tile.terrain == 'L') {
                    $('#tileInfos').append('<span class="paramName cy">Pont</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue cy">Oui</span><br>');
                } else {
                    $('#tileInfos').append('<span class="paramName cy">Route</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue cy">Oui</span><br>');
                }
            }
        }
        if (tile.crat != undefined) {
            if (tile.crat) {
                if (playerInfos.comp.ca >= 4) {
                    $('#tileInfos').append('<span class="paramName cy" title="Le canon Dragonblob ne refrappe jamais là où il y a un cratère">Cratère</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue cy">Oui</span><br>');
                } else {
                    $('#tileInfos').append('<span class="paramName cy">Cratère</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue cy">Oui</span><br>');
                }
            }
        }
        // Ammo packs
        if (tile.ap != undefined) {
            if (tile.ap.includes('drg_')) {
                let drugName = tile.ap.replace('drg_','');
                let drug = getEquipByName(drugName);
                if (drug.units === 'veh') {
                    $('#tileInfos').append('<span class="paramName cy">Tuning</span><span class="paramIcon"><i class="'+drug.icon+'"></i></span><span class="paramValue cy" title="'+drug.info+'">'+drugName+'</span><br>');
                } else {
                    $('#tileInfos').append('<span class="paramName cy">Drogues</span><span class="paramIcon"><i class="'+drug.icon+'"></i></span><span class="paramValue cy" title="'+drug.info+'">'+drugName+'</span><br>');
                }
            } else if (tile.ap.includes('prt_')) {
                let armorName = tile.ap.replace('prt_','');
                let armor = getEquipByName(armorName);
                let armorInfo = showFullArmorInfo(armor,false,false,false,false);
                $('#tileInfos').append('<span class="paramName cy">Armures</span><span class="paramIcon"><i class="ra ra-vest rpg"></i></span><span class="paramValue cy" title="'+armorInfo+'">'+armorName+'</span><br>');
            } else if (tile.ap.includes('eq_')) {
                let equipName = tile.ap.replace('eq_','');
                let equip = getEquipByName(equipName);
                $('#tileInfos').append('<span class="paramName cy">Equipements</span><span class="paramIcon"><i class="fas fa-compass"></i></span><span class="paramValue cy" title="'+equip.info+'">'+equipName+'</span><br>');
            } else {
                let ammo = getAmmoByName(tile.ap);
                let ammoInfo = showAmmoInfo(ammo.name,false,false);
                if (tile.ap.includes('grenade') || tile.ap.includes('dynamite') || tile.ap.includes('molotov')) {
                    $('#tileInfos').append('<span class="paramName cy">Munitions</span><span class="paramIcon"><i class="ra ra-grenade rpg"></i></span><span class="paramValue cy" title="'+ammoInfo+'">'+tile.ap+'</span><br>');
                } else if (tile.ap.includes('lame-')) {
                    $('#tileInfos').append('<span class="paramName cy">Lames</span><span class="paramIcon"><i class="ra ra-plain-dagger rpg"></i></span><span class="paramValue cy" title="'+ammoInfo+'">'+tile.ap+'</span><br>');
                } else {
                    $('#tileInfos').append('<span class="paramName cy">Munitions</span><span class="paramIcon"><i class="ra ra-rifle rpg"></i></span><span class="paramValue cy" title="'+ammoInfo+'">'+tile.ap+'</span><br>');
                }
            }
        }
        // Move Cost
        $('#tileInfos').append('<span class="paramName">Coûts de déplacement</span><span class="paramIcon"><i class="fas fa-shoe-prints"></i></span><span class="paramValue">+'+terrain.mc+'</span><br>');
        // Cover
        let coverIcon = '';
        if (terrain.cover >= 2) {
            coverIcon = '<i class="fas fa-shield-alt"></i>'
        }
        $('#tileInfos').append('<span class="paramName">Couverture</span><span class="paramIcon">'+coverIcon+'</span><span class="paramValue">'+terrain.cover+'</span><br>');
    }
    // scarp, flood, veg
    let sIcon = '';
    let vIcon = '';
    let fIcon = '';
    if (terrain.veg >= 2) {
        vIcon = '<i class="fab fa-pagelines"></i>'
    }
    if (terrain.scarp >= 2) {
        sIcon = '<i class="fas fa-mountain"></i>'
    }
    if (terrain.flood >= 1) {
        fIcon = '<i class="fas fa-water"></i>'
    }
    $('#tileInfos').append('<span class="paramName">Végétation</span><span class="paramIcon">'+vIcon+'</span><span class="paramValue">'+terrain.veg+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Escarpement</span><span class="paramIcon">'+sIcon+'</span><span class="paramValue">'+terrain.scarp+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Innondation</span><span class="paramIcon">'+fIcon+'</span><span class="paramValue">'+terrain.flood+'</span><br>');
    // Coordonnées
    $('#tileInfos').append('<span class="paramName">Coordonnées</span><span class="paramIcon"><i class="fas fa-map-marker-alt"></i></span><span class="paramValue" title="y'+tile.y+' x'+tile.x+'">'+tile.y+'&lrhar;'+tile.x+'</span><br>');
    $('#tileInfos').append('<span class="paramName">Id</span><span class="paramIcon"></span><span class="paramValue">#'+tile.id+' ('+tile.seed+')</span><br>');
    // Heat
    let tileEnergy = getTileEnergy(tile);
    $('#tileInfos').append('<span class="paramName sky" title="Chaleur du sous-sol (pour les sondes géothermiques)">Energie</span><span class="paramIcon"></span><span class="paramValue sky">'+tileEnergy+'</span><br>');
    // RESSOURCES
    if (playerInfos.comp.ext >= 1 && !modeSonde) {
        let hereBat = getBatByTileId(tileId);
        if (Object.keys(hereBat).length >= 1) {
            let allRes = getAllRes(tileId);
        }
    }
    if (playerInfos.comp.det >= 1 || !modeSonde) {
        if (tile.rs != undefined) {
            let tileIndex;
            let res;
            let bldReq;
            Object.entries(tile.rs).map(entry => {
                let key = entry[0];
                let value = entry[1];
                resIndex = resTypes.findIndex((obj => obj.name == key));
                res = resTypes[resIndex];
                bldReq = onlyFirstLetter(res.bld);
                let resKol = 'cy';
                if (playerInfos.resFlags.includes(res.name)) {
                    resKol = 'jaune';
                }
                if (playerInfos.comp.det < 3 && modeSonde) {
                    $('#tileInfos').append('<span class="paramName '+resKol+'">'+key+'</span><span class="paramIcon"></span><span class="paramValue '+resKol+'"><span class="gf">('+bldReq+'-'+res.rarity+')</span></span><br>');
                } else {
                    $('#tileInfos').append('<span class="paramName '+resKol+'">'+key+'</span><span class="paramIcon"></span><span class="paramValue '+resKol+'">'+value+' <span class="gf">('+bldReq+'-'+res.rarity+')</span></span><br>');
                }
                // console.log(key,value);
            });
        }
        // console.log(terrain);
        // console.log(tile);
        let srs = getTerrainRes(terrain,tile);
        // console.log('terrain res');
        // console.log(srs);
        if (Object.keys(srs).length >= 1) {
            let tileIndex;
            let res;
            let bldReq;
            Object.entries(srs).map(entry => {
                let key = entry[0];
                let value = entry[1];
                resIndex = resTypes.findIndex((obj => obj.name == key));
                res = resTypes[resIndex];
                bldReq = onlyFirstLetter(res.bld);
                if (bldReq != '') {
                    bldReq = ' ('+bldReq+')';
                }
                $('#tileInfos').append('<span class="paramName sky">'+key+'</span><span class="paramIcon"></span><span class="paramValue sky">'+value+'<span class="gf">'+bldReq+'</span></span><br>');
                // console.log(key,value);
            });
        }
        if (zone[0].planet === 'Gehenna') {
            if (terrain.name === 'W' || terrain.name === 'S' || terrain.name === 'R' || terrain.name == 'L') {
                $('#tileInfos').append('<span class="paramName sky">Eau</span><span class="paramIcon"></span><span class="paramValue sky">0<span class="gf"> (poison)</span></span><br>');
            }
        } else if (!potable) {
            if (playerInfos.comp.ca >= 2 || !modeSonde) {
                $('#tileInfos').append('<span class="paramName sky">Eau</span><span class="paramIcon"></span><span class="paramValue sky">0<span class="gf"> (poison)</span></span><br>');
            }
        }
    }
    // RENOMMER
    if (playerInfos.showedTiles.includes(tile.id)) {
        $('#tileInfos').append('<button type="button" title="Effacer le marqueur" class="boutonGris skillButtons" onclick="toggleMark('+tileId+')"><i class="fas fa-eraser"></i></button>');
    } else {
        $('#tileInfos').append('<button type="button" title="Mettre un marqueur" class="boutonGris skillButtons" onclick="toggleMark('+tileId+')"><i class="fas fa-map-pin"></i></button>');
    }
    $('#tileInfos').append('<button type="button" title="Nommer cet emplacement" class="boutonGrisBis skillButtons" onclick="renameTile('+tileId+')"><i class="fas fa-map-signs"></i></button>');
    $('#tileInfos').append('<button type="button" title="Faire de cet emplacement mon centre" class="boutonGris skillButtons" onclick="defCenter('+tileId+')"><i class="fas fa-space-shuttle"></i></button>');
};

function getTerFullName(tile,terrain) {
    let terName = terrain.fullName;
    if (terrain.name === 'R' && tile.seed >= 4) {
        terName = terName+' (Gué)';
    }
    return terName;
}

function renameTile(tileId) {
    let newName = prompt('Donnez un nom à cet emplacement :');
    if (newName != null) {
        if (newName.length <= 24) {
            let tileIndex = zone.findIndex((obj => obj.id == tileId));
            zone[tileIndex].tileName = newName;
            showMap(zone,false);
            showTileInfos(tileId);
        } else {
            // message d'erreur
        }
    }
};

function renameChief(batId) {
    let bat = getBatById(batId);
    playOK(bat);
    setTimeout(function (){
        let newName = prompt('Donnez un nom au commandant de ce bataillon :');
        if (newName != null) {
            if (newName.length <= 24) {
                bat.chief = newName;
                showBataillon(bat);
                if (inSoute) {
                    goSoute();
                }
                showBatInfos(bat);
            } else {
                // message d'erreur
            }
        }
    }, 1000); // How long do you want the delay to be (in milliseconds)?
};

function defCenter(tileId) {
    playerInfos.myCenter = tileId;
    $('html,body').scrollTop(0);
    centerMapCenter();
};
