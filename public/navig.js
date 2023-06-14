function commandes() {
    $('#commandz').empty();
    if (playerInfos.onShip) {
        $("#tour").css("display","none");
        $("#mode").css("display","none");
        if (playerInfos.onStart) {
            // $("#cadreMap").css("display","none");
            $("#zone_map").css("display","none");
            $("#zone_soute").css("display","none");
            $("#zone_metro").css("display","block");
        } else {
            // $("#cadreMap").css("display","block");
            if (inSoute) {
                $("#zone_map").css("display","none");
                $("#zone_soute").css("display","block");
                $("#zone_metro").css("display","none");
            } else {
                $("#zone_map").css("display","grid");
                $("#zone_soute").css("display","none");
                $("#zone_metro").css("display","none");
            }
        }
    } else {
        $("#tour").css("display","block");
        $("#mode").css("display","block");
        $("#cadreMap").css("display","block");
    }
    if (activeTurn == 'player') {
        if (!modeSonde && !playerInfos.onShip) {
            $('#batloop').empty();
            if (batList.length >= 1) {
                if (Object.keys(selectedBat).length >= 1) {
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant (et ne plus s\'occuper de celui-ci ce tour-ci)" class="boutonGris iconButtons" onclick="nextBat(true,false)" onmousedown="clicSound(3)"><i class="fas fa-thumbs-up"></i></button>');
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant (et s\'occuper de celui-ci à la fin du tour)" class="boutonGris iconButtons" onclick="nextBat(false,false)" onmousedown="clicSound(1)"><i class="fas fa-share"></i></button>');
                    $('#batloop').append('<button type="button" title="Mettre ce bataillon hors alerte (le sortir de la liste)" class="boutonGris iconButtons" onclick="nextBat(true,true)" onmousedown="clicSound(6)"><i class="far fa-bell-slash"></i></button>');
                } else {
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant" class="boutonGris iconButtons" onclick="nextBat(true)" onmousedown="clicSound(3)"><i class="fas fa-chevron-circle-right"></i></button>');
                    $('#batloop').append('<button type="button" title="Mettre tous les bataillons en alerte et re-créer la liste" class="boutonVert iconButtons" onclick="alertAllBats(5)" onmousedown="clicSound()"><i class="fas fa-undo-alt"></i> <i class="far fa-bell"></i></button>');
                }
            } else {
                $('#batloop').append('<button type="button" title="Liste de bataillons vide : Cliquer pour re-créer" class="boutonVert iconButtons" onclick="createBatList()" onmousedown="clicSound(5)"><i class="fas fa-undo-alt"></i> <i class="fas fa-chevron-circle-right"></i></button>');
                $('#batloop').append('<button type="button" title="Mettre tous les bataillons en alerte et re-créer la liste" class="boutonVert iconButtons" onclick="alertAllBats()" onmousedown="clicSound(5)"><i class="fas fa-undo-alt"></i> <i class="far fa-bell"></i></button>');
            }
            if (nextTurnOK) {
                if (batList.length >= 1) {
                    $('#commandz').append('<button type="button" title="Passer au tour suivant (attention: vous ne vous êtes pas occupé de tous vos bataillons!)" class="boutonNoir iconButtons pipi" onclick="emptyBatList()" onmousedown="warnSound(`error`)"><i class="fas fa-spider"></i></button>');
                } else {
                    $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonMauve iconButtons" onclick="nextTurn()" onmousedown="clicSound(2)"><i class="fas fa-spider"></i></button>');
                }
            } else {
                $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonGrey iconButtons gf"><i class="fas fa-spider"></i></button>');
            }
            $('#commandz').append('<button type="button" title="Nombre d\'aliens en vue" class="boutonGris iconButtons" onclick="updateAliensNum()">'+aliensNum+'</button>');
            $('#commandz').append('<button type="button" title="Nombre d\'oeufs en vue" class="boutonGris iconButtons" onclick="findEgg()" onmousedown="clicSound(5)">'+eggsNum+'</button>');
            $('#commandz').append('<hr>');
        }
        if (!playerInfos.onShip || modeSonde) {
            $('#commandz').append('<button type="button" title="Ressources présentes dans la zone" class="boutonGris iconButtons" onclick="resView()" onmousedown="clicSound(7)"><i class="far fa-gem"></i></button>');
        }
        if (!playerInfos.onStart) {
            if (!modeSonde) {
                if (playerInfos.onShip) {
                    if (!inSoute) {
                        $('#commandz').append('<button type="button" title="Aller dans la soute" class="boutonGris iconButtons" onclick="goSoute()" onmousedown="clicSound(6)"><i class="fas fa-warehouse"></i></button>');
                    } else {
                        $('#commandz').append('<button type="button" title="Revenir sur la carte de la station" class="boutonGris iconButtons" onclick="goStation()" onmousedown="clicSound(7)"><i class="fas fa-chess-board"></i></button>');
                    }
                }
                if (!isStartZone) {
                    if (!inSoute) {
                        $('#commandz').append('<button type="button" title="Crafting" class="boutonGris iconButtons" onclick="craftWindow(false)" onmousedown="clicSound(5)"><i class="fas fa-toolbox"></i></button>');
                    } else {
                        $('#commandz').append('<button type="button" title="Crafting: Revenir sur la carte de la station" class="boutonGrey iconButtons gf" onclick="goStation(7)" onmousedown="clicSound()"><i class="fas fa-toolbox"></i></button>');
                    }
                } else {
                    $('#commandz').append('<button type="button" title="Crafting: Impossible ici" class="boutonGrey iconButtons gf"><i class="fas fa-toolbox"></i></button>');
                }
                $('#commandz').append('<button type="button" title="Réserve" class="boutonGris iconButtons" onclick="voirReserve()" onmousedown="clicSound()"><i class="fas fa-piggy-bank"></i></button>');
                $('#commandz').append('<br>');
            }
            if (!inSoute) {
                $('#commandz').append('<button type="button" title="Minimap" class="boutonGris iconButtons" onclick="minimap()" onmousedown="clicSound(5)"><i class="far fa-map"></i></button>');
            } else {
                $('#commandz').append('<button type="button" title="Minimap: Revenir sur la carte de la station" class="boutonGrey iconButtons gf" onclick="goStation()" onmousedown="clicSound(7)"><i class="far fa-map"></i></button>');
            }
            if (modeSonde) {
                $('#commandz').append('<br>');
            }
        }
        if (!modeSonde) {
            let saveOK = true;
            if (playerInfos.pseudo === 'Mapedit') {
                if (zone != undefined) {
                    if (zone[0] != undefined) {
                        if (zone[0].number < 50) {
                            saveOK = false;
                        }
                    }
                }
            }
            if (saveOK) {
                if (justReloaded) {
                    $('#commandz').append('<button type="button" title="Backup de cette partie (écrase le précédent)" class="boutonRose iconButtons" onclick="saveBackup()" onmousedown="clicSound(17)"><i class="fas fa-hdd"></i> &nbsp;<span class="notsosmall">Bckp</span></button>');
                } else {
                    $('#commandz').append('<button type="button" title="Sauvegarder le jeu" class="boutonVert iconButtons" onclick="saveGame()" onmousedown="clicSound(8)"><i class="far fa-save"></i> &nbsp;<span class="notsosmall">Save</span></button>');
                }
            }

        }
        $('#commandz').append('<br>');
    } else if (activeTurn == 'aliens') {
        if (alienList.length >= 2) {
            if (stopThem) {
                $('#commandz').append('<button type="button" title="Alien suivant" class="boutonGrey iconButtons" id="affw"><i class="fas fa-fast-forward"></i></button>');
            } else {
                $('#commandz').append('<button type="button" title="Alien suivant" class="boutonMauve iconButtons" id="affw" onclick="ffw()"><i class="fas fa-fast-forward"></i></button>');
            }
        } else {
            if (stopThem) {
                $('#commandz').append('<button type="button" title="Alien suivant" class="boutonGrey iconButtons" id="ana"><i class="fas fa-chevron-circle-right"></i></button>');
            } else {
                $('#commandz').append('<button type="button" title="Alien suivant" class="boutonMauve iconButtons" id="ana" onclick="nextAlien()"><i class="fas fa-chevron-circle-right"></i></button>');
            }
        }
        $('#commandz').append('<button type="button" title="Nombre d\'aliens en vue" class="boutonGris iconButtons">'+aliensNum+'</button>');
        $('#commandz').append('<button type="button" title="Nombre d\'oeufs en vue" class="boutonGris iconButtons" onclick="findEgg()" onmousedown="clicSound(5)">'+eggsNum+'</button>');
        $('#commandz').append('<br>');
    }
    $('#commandz').append('<hr>');
    if (playerInfos.volMu > 0) {
        $('#commandz').append('<button type="button" title="Stopper la musique" class="boutonGris iconButtons" onclick="soundVolume(`mute`,`music`)"><i class="fas fa-volume-mute"></i></button>');
    } else {
        $('#commandz').append('<button type="button" title="Redémarrer la musique" class="boutonGris iconButtons" onclick="soundVolume(`mute`,`music`)"><i class="fas fa-volume-off"></i></button>');
    }
    $('#commandz').append('<button type="button" title="Diminuer le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`down`,`music`)"><i class="fas fa-volume-down"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`up`,`music`)"><i class="fas fa-volume-up"></i></button><br>');
    if (playerInfos.volFx > 0) {
        $('#commandz').append('<button type="button" title="Stopper les effets" class="boutonGris iconButtons" onclick="soundVolume(`mute`,`fx`)"><i class="fas fa-volume-mute"></i></button>');
    } else {
        $('#commandz').append('<button type="button" title="Redémarrer les effets" class="boutonGris iconButtons" onclick="soundVolume(`mute`,`fx`)"><i class="fas fa-volume-off"></i></button>');
    }
    $('#commandz').append('<button type="button" title="Diminuer le volume des effets" class="boutonGris iconButtons" onclick="soundVolume(`down`,`fx`)"><i class="fas fa-volume-down"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume des effets" class="boutonGris iconButtons" onclick="soundVolume(`up`,`fx`)"><i class="fas fa-volume-up"></i></button><br>');
    $('#commandz').append('&nbsp;&nbsp;Musique '+playerInfos.volMu);
    $('#commandz').append('&nbsp;&nbsp;Fx '+playerInfos.volFx);
    // $('#commandz').append('<br>');
    if (activeTurn == 'player') {
        if (!modeSonde) {
            if (!playerInfos.onStart) {
                if (!inSoute) {
                    let hasSonde = hasUnit('Sonde',false);
                    let hasImpacteur = hasUnit('Impacteur',false);
                    if (hasSonde || hasImpacteur) {
                        $('#commandz').append('<hr>');
                        $('#commandz').append('<button type="button" title="Régler une sonde (destination)" class="boutonBrun iconButtons" onclick="editSonde()" onmousedown="clicSound(6)"><i class="fas fa-keyboard"></i></button>');
                        if (playerInfos.sondePlanet > 0 && playerInfos.sondeDanger > 0) {
                            let planetName = getPlanetNameById(playerInfos.sondePlanet);
                            if (hasSonde) {
                                let maxMaps = getMaxMaps(false);
                                $('#commandz').append('<button type="button" title="Envoyer une sonde (Planète '+planetName+' / présence alien '+playerInfos.sondeDanger+') ('+maxMaps+' zones)" class="boutonBrun iconButtons" onclick="goSonde(false)" onmousedown="clicSound(9)"><i class="fas fa-rocket"></i></button>');
                            }
                            if (hasImpacteur && planetName != 'Horst' && planetName != 'Kzin') {
                                let maxMaps = getMaxMaps(true);
                                $('#commandz').append('<button type="button" title="Envoyer un impacteur (Planète '+planetName+' / présence alien '+playerInfos.sondeDanger+') ('+maxMaps+' zones)" class="boutonNoir iconButtons" onclick="goSonde(true)" onmousedown="clicSound(9)"><i class="fas fa-rocket"></i></button>');
                            }
                        }
                    }
                }
            }
        } else {
            $('#commandz').append('<hr>');
            $('#commandz').append('<button type="button" title="Poser la sonde" class="boutonRouge iconButtons" onclick="stopSonde()" onmousedown="clicSound(10)"><i class="fas fa-rocket"></i></button>');
            let maxMaps = getMaxMaps(impact);
            let nextMapNumber = playerInfos.sondeMaps+1;
            if (playerInfos.sondeMaps < maxMaps) {
                $('#commandz').append('<button type="button" title="Voir une autre zone ('+nextMapNumber+'/'+maxMaps+')" class="boutonBrun iconButtons"><i class="fas fa-map" onclick="generateNewMap(false)" onmousedown="clicSound(5)"></i></button>');
                if (playerInfos.comp.vsp >= 4 && playerInfos.sondeMaps+3 < maxMaps && !impact) {
                    let mapNumberAfterChange = nextMapNumber+3;
                    $('#commandz').append('<button type="button" title="Changer de région ('+mapNumberAfterChange+'/'+maxMaps+')" class="boutonBrun iconButtons"><i class="fas fa-globe" onclick="regionChange()" onmousedown="clicSound(9)"></i></button>');
                }
            } else {
                // $('#commandz').append('<button type="button" title="Maximum de cartes atteint" class="boutonGris iconButtons"><i class="fas fa-map"></i></button>');
                $('#commandz').append('<button type="button" title="Voir une autre zone (au risque de crasher la sonde!)" class="boutonRouge iconButtons"><i class="fas fa-map" onclick="pushSonde('+nextMapNumber+','+maxMaps+')" onmousedown="clicSound(5)"></i></button>');
            }
        }
        $('#commandz').append('<br>');
        if (!modeSonde && !inSoute) {
            if (playerInfos.onShip) {
                if (playerInfos.onStart) {
                    $('#commandz').append('<hr>');
                    $('#commandz').append('<button type="button" title="Sortir de l\'abri" class="boutonRouge iconButtons" onclick="startMission(false)"><i class="fas fa-dungeon"></i></button>');
                } else {
                    if (zoneFiles.length >= 2) {
                        $('#commandz').append('<hr>');
                        $('#commandz').append('<button type="button" title="Choisir une zone pour la prochaine mission" class="boutonRouge iconButtons" onclick="pickZone()" onmousedown="clicSound(5)"><i class="fas fa-map"></i></button>');
                        if (playerInfos.missionZone >= 1) {
                            if (isLanderDeployed()) {
                                if (playerInfos.okFill) {
                                    $('#commandz').append('<button type="button" title="Partir en mission sur la zone '+playerInfos.missionZone+'" class="boutonNoir iconButtons" onclick="showStartLander()" onmousedown="warnSound(`ignition`)" id="takeof1"><i class="fas fa-space-shuttle"></i></button>');
                                    $('#commandz').append('<button type="button" title="Partir en mission sur la zone '+playerInfos.missionZone+'" class="boutonRouge iconButtons" onclick="startMission(false)" onmousedown="warnSound(`takeoff`)" id="takeof2"><i class="fas fa-space-shuttle"></i></button>');
                                } else {
                                    $('#commandz').append('<button type="button" title="Partir en mission: Vous n\'avez pas chargé de ressources!" class="boutonNoir iconButtons" onmousedown="warnSound(`error2`)" id="takeof1"><i class="fas fa-space-shuttle"></i></button>');
                                }
                            } else {
                                $('#commandz').append('<button type="button" title="Partir en mission: Vous devez d\'abord déployer un lander et y mettre des bataillons!" class="boutonNoir iconButtons" onmousedown="warnSound(`error2`)" id="takeof1"><i class="fas fa-space-shuttle"></i></button>');
                            }
                        } else {
                            $('#commandz').append('<button type="button" title="Partir en mission: Vous devez d\'abord choisir une zone!" class="boutonNoir iconButtons" onmousedown="warnSound(`error2`)" id="takeof1"><i class="fas fa-space-shuttle"></i></button>');
                        }
                    }
                }
            } else {
                $('#commandz').append('<hr>');
                if (!isStartZone) {
                    $('#commandz').append('<button type="button" title="Rapport de mission (estimation)" class="boutonRose iconButtons" onclick="missionResults(false)" onmousedown="clicSound(1)"><i class="fas fa-balance-scale"></i></button>');
                }
                if (hasOwnLander) {
                    let returnText = 'Rentrer à la station';
                    if (isStartZone) {
                        returnText = 'Rejoindre la station spatiale';
                    }
                    $('#commandz').append('<button type="button" title="'+returnText+'" class="boutonNoir iconButtons pipi" onclick="showStartLander()" onmousedown="warnSound(`ignition`)" id="takeof1"><i class="fas fa-space-shuttle"></i></button>');
                    $('#commandz').append('<button type="button" title="'+returnText+'" class="boutonRouge iconButtons" onclick="stopMission()" onmousedown="warnSound(`takeoff`)" id="takeof2"><i class="fas fa-space-shuttle"></i></button>');
                }
            }
        }
        if (!modeSonde) {
            if (playerInfos.onShip) {
                if (!inSoute) {
                    $('#commandz').append('<hr>');
                    $('#commandz').append('<button type="button" title="Nouvelle campagne?" class="boutonRose iconButtons" onclick="showMapReset()" onmousedown="warnSound(`nope`)" id="reset1"><i class="fas fa-power-off"></i></button>');
                    $('#commandz').append('<button type="button" title="Nouvelle campagne!" class="boutonRouge iconButtons" onclick="newGame()" onmousedown="clicSound(8)" id="reset2"><i class="fas fa-recycle"></i></button>');
                    if (bataillons.length === 0) {
                        $('#commandz').append('<button type="button" title="Ajouter le pack de ressources" class="boutonRose iconButtons blynk" onclick="addStartPack()" onmousedown="clicSound()"><i class="fas fa-coins"></i></button>');
                    } else {
                        if (playerInfos.gangDef) {
                            let nextGangLevel = checkGangLevel();
                            if (nextGangLevel > -1) {
                                $('#commandz').append('<button type="button" title="Monter au niveau de gang '+nextGangLevel+'" class="boutonRose iconButtons blynk" onclick="gangLevelUp()" onmousedown="clicSound(2)"><i class="fas fa-graduation-cap"></i></button>');
                            } else {
                                $('#commandz').append('<button type="button" title="Voir vos compétences" class="boutonRose iconButtons" onclick="gangLevelView()" onmousedown="clicSound(2)"><i class="fas fa-award"></i></button>');
                            }
                            $('#commandz').append('<button type="button" title="Voir toutes les unités du gang" class="boutonRose iconButtons" onclick="gangUnitsList()" onmousedown="clicSound(2)"><i class="fas fa-user-astronaut"></i></button>');
                        } else {
                            $('#commandz').append('<button type="button" title="Choisir un gang" class="boutonRose iconButtons blynk" onclick="gangChoice()" onmousedown="clicSound(2)"><i class="fas fa-mask"></i></button>');
                        }
                    }
                }
            } else {
                if (!isReloaded && playerInfos.mapTurn === 0) {
                    $('#commandz').append('<hr>');
                    $('#commandz').append('<button type="button" title="Sauvegarder et actualiser (pour le bug du rapport de mission)" class="boutonRose iconButtons blynk" onclick="saveAndReload()" onmousedown="clicSound(8)"><i class="fas fa-exclamation-triangle"></i></button>');
                }
            }
            if (!playerInfos.onShip) {
                // $('#commandz').append('<hr>');
                // $('#commandz').append('<button type="button" title="Normal" class="boutonCaca iconButtons" onclick="mapTilesFiltering(true)"><i class="far fa-image"></i></button>');
                // $('#commandz').append('<button type="button" title="Sun" class="boutonJaune iconButtons" onclick="mapTilesFiltering(false,`hue-rotate`,5,`saturate`,100,`brightness`,108,`contrast`,125)"><i class="far fa-image"></i></button>');
                // $('#commandz').append('<button type="button" title="Rain" class="boutonGris iconButtons" onclick="mapTilesFiltering(false,`grayscale`,35,`brightness`,80,`contrast`,120)"><i class="far fa-image"></i></button>');
                // $('#commandz').append('<br>');
                // $('#commandz').append('<button type="button" title="Gravity" class="boutonMauve iconButtons" onclick="mapTilesFiltering(false,`hue-rotate`,205,`saturate`,70,`brightness`,85,`contrast`,135)"><i class="far fa-image"></i></button>');
                // $('#commandz').append('<button type="button" title="Burning" class="boutonRouge iconButtons" onclick="mapTilesFiltering(false,`hue-rotate`,325,`brightness`,75,`contrast`,125,`saturate`,130)"><i class="far fa-image"></i></button>');
                // $('#commandz').append('<button type="button" title="Toxic" class="boutonVert iconButtons" onclick="mapTilesFiltering(false,`hue-rotate`,45,`brightness`,90,`contrast`,130,`saturate`,90)"><i class="far fa-image"></i></button>');
                // $('#commandz').append('<br>');
                // $('#commandz').append('<button type="button" title="Test" class="boutonRose iconButtons" onclick="testRuinsComp()" onmousedown="clicSound()"><i class="fas fa-award"></i></button>');
            }
        }
    }
    // $('#commandz').append('<button type="button" title="Tout soigner (comme au retour de mission)" class="boutonCiel iconButtons" onclick="healEverything()"><i class="fas fa-briefcase-medical"></i></button>');
    if (playerInfos.pseudo === 'Test' || playerInfos.pseudo === 'Payall' || playerInfos.pseudo === 'Woklup' || playerInfos.pseudo === 'Bob' || playerInfos.pseudo === 'Mapedit') {
        gangNavig();
    }
};

function getMaxMaps(impact) {
    let maxMaps = ((playerInfos.comp.vsp+1)*maxMapsParDet)+2;
    if (impact) {
        maxMaps = Math.ceil((playerInfos.comp.vsp)*(maxMapsParDet+0.5))+1;
        if (maxMaps < 3) {
            maxMaps = 3;
        }
    }
    return maxMaps;
};

function viewPop() {
    if (playerInfos.onShip && !modeSonde) {
        if (bataillons.length >= 1) {
            let doomsday = getDoom(false);
            let mesCitoyens = calcTotalCitoyens(false);
            let population = mesCitoyens.crim+mesCitoyens.cit;
            let crimeRate = calcCrimeRate(mesCitoyens);
            let popColour = 'cy';
            let crimColour = 'neutre';
            if (crimeRate.total >= 15) {
                crimColour = 'or';
            }
            let penibColour = 'neutre';
            if (crimeRate.penib >= 10) {
                penibColour = 'or';
            }
            let bedColour = 'neutre';
            if (population >= crimeRate.lits+100) {
                bedColour = 'or';
            }
            $("#batloop").css("display","block");
            $('#batloop').empty();
            $('#batloop').append('Population: <span class="'+popColour+'">'+population+'</span><br>');
            $('#batloop').append('(<span class="" title="Citoyens">'+mesCitoyens.cit+'</span> &middot; <span class="" title="Criminels">'+mesCitoyens.crim+'</span>)<br>');
            $('#batloop').append('Lits: <span class="'+bedColour+'">'+crimeRate.lits+'</span><br>');
            $('#batloop').append('Criminels: <span class="neutre">'+crimeRate.crim+'</span>%<br>');
            $('#batloop').append('Pénibilité: <span class="'+penibColour+'">'+crimeRate.penib+'</span>%<br>');
            $('#batloop').append('Forces de l\'ordre: <span class="neutre">'+crimeRate.fo+'</span><br>');
            $('#batloop').append('Criminalité: <span class="'+crimColour+'">'+crimeRate.total+'</span>%<br>');
            if (playerInfos.deadBats.length >= 2) {
                $('#batloop').append('Morts <span class="or" title="'+toNiceString(playerInfos.deadBats)+'">'+playerInfos.unitsLost+'</span> <span class="neutre" title="Morts en mission: &dagger; '+toNiceString(playerInfos.deadBats)+'">('+playerInfos.deadBats[0]+'...)</span><br>');
            } else if (playerInfos.deadBats.length === 1) {
                $('#batloop').append('Morts <span class="or" title="'+toNiceString(playerInfos.deadBats)+'">'+playerInfos.unitsLost+'</span> <span class="neutre"Morts en mission: &dagger; '+toNiceString(playerInfos.deadBats)+'">('+playerInfos.deadBats[0]+')</span><br>');
            }
            $('#batloop').append('<span class="jaune">Doomclock: '+doomsday+'</span><br>');
            if (!inSoute) {
                $('#batloop').append('<button type="button" title="Simuler 3 semaines (1 mission)" class="boutonVert iconButtons" onclick="events(false,65,true,false)"><i class="far fa-clock"></i></button>');
                $('#batloop').append('<button type="button" title="Attendre 3 jours" class="boutonRouge iconButtons" onclick="events(false,9,false,false)"><i class="far fa-clock"></i></button>');
                $('#batloop').append('<button type="button" title="Attendre 1 semaine" class="boutonRouge iconButtons" onclick="events(false,21,false,false)"><i class="far fa-clock"></i></button>');
            }
        }
    }
};

function gangNavig() {
    $('#gangInfos').empty();
    if (allowCheat || playerInfos.pseudo === 'Mapedit' || playerInfos.pseudo === 'Payall') {
        allowCheat = true;
        if (playerInfos.pseudo != 'Mapedit') {
            $('#gangInfos').append('<button type="button" title="Désactiver le mode triche" class="boutonCiel iconButtons" onclick="toggleCheat()"><i class="fas fa-poo"></i></button>');
            $('#gangInfos').append('<br>');
        }
        $('#gangInfos').append('<button type="button" title="Construire gratuitement" class="boutonCiel iconButtons" onclick="bfconst(`all`,true,``,false)"><i class="fa fa-hammer"></i></button>');
        $('#gangInfos').append('<button type="button" title="Liste des aliens" class="boutonCiel iconButtons" onclick="voirAliens()"><i class="fab fa-reddit-alien"></i></button>');
        $('#gangInfos').append('<button type="button" title="Editer le Gang" class="boutonCiel iconButtons" onclick="gangEdit()"><i class="fas fa-users-cog"></i></button>');
        $('#gangInfos').append('<br>');
        $('#gangInfos').append('<button type="button" title="Ajouter un peu de chaque ressource" class="boutonCiel iconButtons" onclick="allResAdd(10)"><i class="fas fa-cart-plus"></i></button>');
        $('#gangInfos').append('<button type="button" title="Ajouter tous les bâtiments requis dans la station" class="boutonCiel iconButtons" onclick="putFullBldVM()"><i class="fas fa-landmark"></i></button>');
        $('#gangInfos').append('<button type="button" title="Charger une zone sauvegardée" class="boutonCiel iconButtons" onclick="voirZones()"><i class="fas fa-folder-open"></i></button>');
        // $('#gangInfos').append('<button type="button" title="Remettre les compétences à zéro" class="boutonCiel iconButtons" onclick="compReset()"><i class="fas fa-award"></i></button>');
        if (!modeSonde && !playerInfos.onShip) {
            $('#gangInfos').append('<button type="button" title="Test de tir (15 salves, pas de riposte)" class="boutonCiel iconButtons" onclick="noAlienRip()"><i class="fas fa-bullseye"></i></button>');
            $('#gangInfos').append('<button type="button" title="Supprime TOUT sauf la carte et les compétences" class="boutonCiel iconButtons" onclick="mapReset()"><i class="fas fa-skull-crossbones"></i></button>');
            $('#gangInfos').append('<button type="button" title="Supprimer tous les aliens" class="boutonCiel iconButtons" onclick="alienReset()"><i class="fas fa-bug"></i></button>');
            $('#gangInfos').append('<br>');
            $('#gangInfos').append('<button type="button" title="Nouvelle zone" class="boutonCiel iconButtons" onclick="generateNewMap(true)"><i class="far fa-map"></i></button>');
            // $('#gangInfos').append('<button type="button" title="Check rencontres" class="boutonCiel iconButtons" onclick="encounterCheck()"><i class="fas fa-city"></i></button>');
            // $('#gangInfos').append('<button type="button" title="Check voisins" class="boutonCiel iconButtons" onclick="lesVoisins()"><i class="fas fa-shuttle-van"></i></button>');
            if (playerInfos.pseudo === 'Mapedit') {
                $('#gangInfos').append('<button type="button" title="Editer une autre mission" class="boutonCiel iconButtons" onclick="loadEditorMission()"><i class="ra ra-scroll-unfurled rpg"></i></button>');
            } else {
                $('#gangInfos').append('<button type="button" title="Charger une mission" class="boutonCiel iconButtons" onclick="loadMission()"><i class="ra ra-scroll-unfurled rpg"></i></button>');
                $('#gangInfos').append('<button type="button" title="Ajouter les unités de base pour une mission" class="boutonCiel iconButtons" onclick="missionTest()"><i class="ra ra-double-team rpg"></i></button>');
            }
            $('#gangInfos').append('<br>');
            if (playerInfos.pseudo === 'Mapedit') {
                $('#gangInfos').append('<button type="button" title="Retour station forcé" class="boutonGrey iconButtons"><i class="fas fa-space-shuttle"></i></button>');
            } else {
                $('#gangInfos').append('<button type="button" title="Retour station forcé" class="boutonRouge iconButtons" onclick="stopMission()"><i class="fas fa-space-shuttle"></i></button>');
            }
            if (playerInfos.pseudo === 'Mapedit') {
                $('#gangInfos').append('<button type="button" title="Editer à la louche" class="boutonVert iconButtons" onclick="mapGlobalEdits()"><i class="ra ra-grass-patch rpg"></i></button>');
            } else {
                $('#gangInfos').append('<button type="button" title="Tourelles?" class="boutonRouge iconButtons" onclick="workingTurrets()"><i class="fas fa-toilet-paper"></i></button>');
            }
            $('#gangInfos').append('<button type="button" title="Map Editor" class="boutonVert iconButtons" onclick="editMode()"><i class="fas fa-tree"></i></button>');
        } else {
            $('#gangInfos').append('<button type="button" title="Charger une mission" class="boutonCiel iconButtons" onclick="loadMission()"><i class="ra ra-scroll-unfurled rpg"></i></button>');
        }
    } else {
        if (playerInfos.pseudo != 'Mapedit') {
            $('#gangInfos').append('<button type="button" title="Activer le mode triche" class="boutonCiel iconButtons" onclick="toggleCheat()"><i class="fas fa-poo"></i></button>');
        }
    }
    $('#gangInfos').append('<div class="shSpace"></div>');
    $('#gangInfos').append('<span class="butSpace"></span>');
    $('#gangInfos').append(capitalizeFirstLetter(playerInfos.gang));
    $('#gangInfos').append(' '+playerInfos.gLevel+'<br>');
};

function toggleCheat() {
    if (allowCheat) {
        allowCheat = false;
    } else {
        allowCheat = true;
    }
    commandes();
};
