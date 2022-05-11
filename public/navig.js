function commandes() {
    $('#commandz').empty();
    if (playerInfos.onShip) {
        $("#tour").css("display","none");
        $("#mode").css("display","none");
    } else {
        $("#tour").css("display","block");
        $("#mode").css("display","block");
    }
    if (activeTurn == 'player') {
        if (!modeSonde && !playerInfos.onShip) {
            $('#batloop').empty();
            if (batList.length >= 1) {
                if (Object.keys(selectedBat).length >= 1) {
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant (et ne plus s\'occuper de celui-ci ce tour-ci)" class="boutonGris iconButtons" onclick="nextBat(true,false)" onmousedown="clicSound()"><i class="fas fa-thumbs-up"></i></button>');
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant (et s\'occuper de celui-ci à la fin du tour)" class="boutonGris iconButtons" onclick="nextBat(false,false)" onmousedown="clicSound()"><i class="fas fa-share"></i></button>');
                    $('#batloop').append('<button type="button" title="Mettre ce bataillon hors alerte (le sortir de la liste)" class="boutonGris iconButtons" onclick="nextBat(true,true)" onmousedown="clicSound()"><i class="far fa-bell-slash"></i></button>');
                } else {
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant" class="boutonGris iconButtons" onclick="nextBat(true)" onmousedown="clicSound()"><i class="fas fa-chevron-circle-right"></i></button>');
                    $('#batloop').append('<button type="button" title="Mettre tous les bataillons en alerte et re-créer la liste" class="boutonVert iconButtons" onclick="alertAllBats()" onmousedown="clicSound()"><i class="fas fa-undo-alt"></i> <i class="far fa-bell"></i></button>');
                }
            } else {
                $('#batloop').append('<button type="button" title="Liste de bataillons vide : Cliquer pour re-créer" class="boutonVert iconButtons" onclick="createBatList()" onmousedown="clicSound()"><i class="fas fa-undo-alt"></i> <i class="fas fa-chevron-circle-right"></i></button>');
                $('#batloop').append('<button type="button" title="Mettre tous les bataillons en alerte et re-créer la liste" class="boutonVert iconButtons" onclick="alertAllBats()" onmousedown="clicSound()"><i class="fas fa-undo-alt"></i> <i class="far fa-bell"></i></button>');
            }
            if (nextTurnOK) {
                if (batList.length >= 1) {
                    $('#commandz').append('<button type="button" title="Passer au tour suivant (attention: vous ne vous êtes pas occupé de tout vos bataillons!)" class="boutonNoir iconButtons pipi" onclick="emptyBatList()" onmousedown="warnSound(`error`)"><i class="fas fa-spider"></i></button>');
                } else {
                    $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonMauve iconButtons" onclick="nextTurn()" onmousedown="clicSound()"><i class="fas fa-spider"></i></button>');
                }
            } else {
                $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonGris iconButtons gf"><i class="fas fa-spider"></i></button>');
            }
            $('#commandz').append('<button type="button" title="Nombre d\'aliens en vue" class="boutonGris iconButtons" onclick="updateAliensNum()">'+aliensNum+'</button>');
            $('#commandz').append('<button type="button" title="Nombre d\'oeufs en vue" class="boutonGris iconButtons" onclick="findEgg()">'+eggsNum+'</button>');
            $('#commandz').append('<hr>');
        }
        if (!playerInfos.onShip || modeSonde) {
            $('#commandz').append('<button type="button" title="Ressources présentes dans la zone" class="boutonGris iconButtons" onclick="resView()" onmousedown="clicSound()"><i class="far fa-gem"></i></button>');
        }
        if (!modeSonde) {
            if (playerInfos.onShip) {
                if (!inSoute) {
                    $('#commandz').append('<button type="button" title="Aller dans la soute" class="boutonGris iconButtons" onclick="goSoute()" onmousedown="clicSound()"><i class="fas fa-warehouse"></i></button>');
                } else {
                    $('#commandz').append('<button type="button" title="Revenir sur la carte de la station" class="boutonGris iconButtons" onclick="goStation()" onmousedown="clicSound()"><i class="fas fa-chess-board"></i></button>');
                }
            }
            $('#commandz').append('<button type="button" title="Crafting" class="boutonGris iconButtons" onclick="craftWindow(false)" onmousedown="clicSound()"><i class="fas fa-toolbox"></i></button>');
            $('#commandz').append('<button type="button" title="Réserve" class="boutonGris iconButtons" onclick="voirReserve()" onmousedown="clicSound()"><i class="fas fa-piggy-bank"></i></button>');
            $('#commandz').append('<br>');
        }
        $('#commandz').append('<button type="button" title="Minimap" class="boutonGris iconButtons" onclick="minimap()" onmousedown="clicSound()"><i class="far fa-map"></i></button>');
        if (modeSonde) {
            $('#commandz').append('<br>');
        }
        if (!modeSonde) {
            $('#commandz').append('<button type="button" title="Sauvegarder le jeu" class="boutonVert iconButtons" onclick="saveGame()" onmousedown="clicSound()"><i class="far fa-save"></i> &nbsp;<span class="notsosmall">Save</span></button>');
        }
        $('#commandz').append('<br>');
    } else if (activeTurn == 'aliens') {
        if (alienList.length >= 2) {
            $('#commandz').append('<button type="button" title="" class="boutonMauve iconButtons" onclick="ffw()" onmousedown="clicSound()"><i class="fas fa-fast-forward"></i></button>');
        } else {
            $('#commandz').append('<button type="button" title="Passer au bataillon suivant" class="boutonMauve iconButtons" onclick="nextAlien()" onmousedown="clicSound()"><i class="fas fa-chevron-circle-right"></i></button>');
        }
        $('#commandz').append('<button type="button" title="Nombre d\'aliens en vue" class="boutonGris iconButtons">'+aliensNum+'</button>');
        $('#commandz').append('<button type="button" title="Nombre d\'oeufs en vue" class="boutonGris iconButtons" onclick="findEgg()">'+eggsNum+'</button>');
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
            if (!inSoute) {
                let hasSonde = hasUnit('Sonde');
                let hasImpacteur = hasUnit('Impacteur');
                if (hasSonde || hasImpacteur) {
                    $('#commandz').append('<hr>');
                    $('#commandz').append('<button type="button" title="Régler une sonde (destination)" class="boutonBrun iconButtons" onclick="editSonde()" onmousedown="clicSound()"><i class="fas fa-keyboard"></i></button>');
                    if (playerInfos.sondePlanet > 0 && playerInfos.sondeDanger > 0) {
                        let planetName = getPlanetNameById(playerInfos.sondePlanet);
                        if (hasSonde) {
                            let maxMaps = getMaxMaps(false);
                            $('#commandz').append('<button type="button" title="Envoyer une sonde (Planète '+planetName+' / présence alien '+playerInfos.sondeDanger+') ('+maxMaps+' zones)" class="boutonBrun iconButtons" onclick="goSonde(false)" onmousedown="clicSound()"><i class="fas fa-rocket"></i></button>');
                        }
                        if (hasImpacteur && planetName != 'Horst' && planetName != 'Kzin') {
                            let maxMaps = getMaxMaps(true);
                            $('#commandz').append('<button type="button" title="Envoyer un impacteur (Planète '+planetName+' / présence alien '+playerInfos.sondeDanger+') ('+maxMaps+' zones)" class="boutonNoir iconButtons" onclick="goSonde(true)" onmousedown="clicSound()"><i class="fas fa-rocket"></i></button>');
                        }
                    }
                }
            }
        } else {
            $('#commandz').append('<hr>');
            $('#commandz').append('<button type="button" title="Poser la sonde" class="boutonRouge iconButtons" onclick="stopSonde()" onmousedown="clicSound()"><i class="fas fa-rocket"></i></button>');
            let maxMaps = getMaxMaps(impact);
            let nextMapNumber = playerInfos.sondeMaps+1;
            if (playerInfos.sondeMaps < maxMaps) {
                $('#commandz').append('<button type="button" title="Voir une autre zone ('+nextMapNumber+'/'+maxMaps+')" class="boutonBrun iconButtons"><i class="fas fa-map" onclick="generateNewMap(false)" onmousedown="clicSound()"></i></button>');
                if (playerInfos.comp.vsp >= 4 && playerInfos.sondeMaps+3 < maxMaps && !impact) {
                    let mapNumberAfterChange = nextMapNumber+3;
                    $('#commandz').append('<button type="button" title="Changer de région ('+mapNumberAfterChange+'/'+maxMaps+')" class="boutonBrun iconButtons"><i class="fas fa-globe" onclick="regionChange()" onmousedown="clicSound()"></i></button>');
                }
            } else {
                $('#commandz').append('<button type="button" title="Maximum de cartes atteint" class="boutonGris iconButtons"><i class="fas fa-map"></i></button>');
            }
        }
        $('#commandz').append('<br>');
        if (!modeSonde && !inSoute) {
            if (playerInfos.onShip) {
                if (zoneFiles.length >= 2) {
                    $('#commandz').append('<hr>');
                    $('#commandz').append('<button type="button" title="Choisir une zone pour la prochaine mission" class="boutonRouge iconButtons" onclick="pickZone()" onmousedown="clicSound()"><i class="fas fa-map"></i></button>');
                    if (playerInfos.missionZone >= 1 && isLanderDeployed()) {
                        $('#commandz').append('<button type="button" title="Partir en mission sur la zone '+playerInfos.missionZone+'" class="boutonNoir iconButtons" onclick="showStartLander()" onmousedown="warnSound(`nope`)" id="takeof1"><i class="fas fa-space-shuttle"></i></button>');
                        $('#commandz').append('<button type="button" title="Partir en mission sur la zone '+playerInfos.missionZone+'" class="boutonRouge iconButtons" onclick="startMission()" onmousedown="warnSound(`takeoff`)" id="takeof2"><i class="fas fa-space-shuttle"></i></button>');
                    }
                }
            } else {
                $('#commandz').append('<hr>');
                $('#commandz').append('<button type="button" title="Rapport de mission (estimation)" class="boutonRose iconButtons" onclick="missionResults(false)" onmousedown="clicSound()"><i class="fas fa-balance-scale"></i></button>');
                $('#commandz').append('<button type="button" title="Rentrer à la station" class="boutonNoir iconButtons pipi" onclick="showStartLander()" onmousedown="warnSound(`nope`)" id="takeof1"><i class="fas fa-space-shuttle"></i></button>');
                $('#commandz').append('<button type="button" title="Rentrer à la station" class="boutonRouge iconButtons" onclick="stopMission()" onmousedown="warnSound(`takeoff`)" id="takeof2"><i class="fas fa-space-shuttle"></i></button>');
            }
        }
        if (!modeSonde) {
            if (playerInfos.onShip) {
                $('#commandz').append('<hr>');
                $('#commandz').append('<button type="button" title="Nouvelle campagne?" class="boutonRose iconButtons" onclick="showMapReset()" onmousedown="clicSound()" id="reset1"><i class="fas fa-power-off"></i></button>');
                $('#commandz').append('<button type="button" title="Nouvelle campagne!" class="boutonRouge iconButtons" onclick="newGame()" onmousedown="clicSound()" id="reset2"><i class="fas fa-recycle"></i></button>');
                if (bataillons.length === 0) {
                    $('#commandz').append('<button type="button" title="Ajouter le pack de ressources" class="boutonRose iconButtons blynk" onclick="addStartPack()" onmousedown="clicSound()"><i class="fas fa-coins"></i></button>');
                } else {
                    if (playerInfos.gangDef) {
                        let nextGangLevel = checkGangLevel();
                        if (nextGangLevel > -1) {
                            $('#commandz').append('<button type="button" title="Monter au niveau de gang '+nextGangLevel+'" class="boutonRose iconButtons blynk" onclick="gangLevelUp()" onmousedown="clicSound()"><i class="fas fa-graduation-cap"></i></button>');
                        } else {
                            $('#commandz').append('<button type="button" title="Voir vos compétences" class="boutonRose iconButtons" onclick="gangLevelView()" onmousedown="clicSound()"><i class="fas fa-award"></i></button>');
                        }
                        $('#commandz').append('<button type="button" title="Voir toutes les unités du gang" class="boutonRose iconButtons" onclick="gangUnitsList()" onmousedown="clicSound()"><i class="fas fa-user-astronaut"></i></button>');
                    } else {
                        $('#commandz').append('<button type="button" title="Choisir un gang" class="boutonRose iconButtons blynk" onclick="gangChoice()" onmousedown="clicSound()"><i class="fas fa-mask"></i></button>');
                    }
                }
                // if (!playerInfos.adjok) {
                //     $('#commandz').append('<button type="button" title="Ajuster le pack de ressources" class="boutonRouge iconButtons" onclick="adjStartPack()"><i class="fas fa-coins"></i></button>');
                // }
            } else {
                if (!isReloaded && playerInfos.mapTurn === 0) {
                    $('#commandz').append('<hr>');
                    $('#commandz').append('<button type="button" title="Sauvegarder et actualiser (pour le bug du rapport de mission)" class="boutonRose iconButtons blynk" onclick="saveAndReload()" onmousedown="clicSound()"><i class="fas fa-balance-scale"></i></button>');
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
    if (playerInfos.pseudo === 'Test' || playerInfos.pseudo === 'Payall' || playerInfos.pseudo === 'Woklup' || playerInfos.pseudo === 'Bob') {
        gangNavig();
    }
};

function getMaxMaps(impact) {
    let maxMaps = (playerInfos.comp.vsp+2)*maxMapsParDet;
    if (impact) {
        maxMaps = Math.ceil((playerInfos.comp.vsp+0.75)*maxMapsParDet/1.1);
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
    if (!allowCheat) {
        $('#gangInfos').append('<button type="button" title="Activer le mode triche" class="boutonCiel iconButtons" onclick="toggleCheat()"><i class="fas fa-poo"></i></button>');
    } else {
        $('#gangInfos').append('<button type="button" title="Désactiver le mode triche" class="boutonCiel iconButtons" onclick="toggleCheat()"><i class="fas fa-poo"></i></button>');
        $('#gangInfos').append('<br>');
        $('#gangInfos').append('<button type="button" title="Construire gratuitement" class="boutonCiel iconButtons" onclick="bfconst(`all`,true,false,false)"><i class="fa fa-hammer"></i></button>');
        $('#gangInfos').append('<button type="button" title="Remplir le lander" class="boutonCiel iconButtons" onclick="landerFill()"><i class="fas fa-dolly"></i></button>');
        $('#gangInfos').append('<button type="button" title="Editer le Gang" class="boutonCiel iconButtons" onclick="gangEdit()"><i class="fas fa-users-cog"></i></button>');
        $('#gangInfos').append('<br>');
        $('#gangInfos').append('<button type="button" title="Ajouter un peu de chaque ressource" class="boutonCiel iconButtons" onclick="allResAdd(10)"><i class="fas fa-cart-plus"></i></button>');
        $('#gangInfos').append('<button type="button" title="Charger une zone sauvegardée" class="boutonCiel iconButtons" onclick="voirZones()"><i class="fas fa-folder-open"></i></button>');
        $('#gangInfos').append('<button type="button" title="Remettre les compétences à zéro" class="boutonCiel iconButtons" onclick="compReset()"><i class="fas fa-award"></i></button>');
        if (!modeSonde && !playerInfos.onShip) {
            $('#gangInfos').append('<button type="button" title="Nouvelle zone" class="boutonCiel iconButtons" onclick="generateNewMap(true)"><i class="far fa-map"></i></button>');
            $('#gangInfos').append('<button type="button" title="Supprime TOUT sauf la carte et les compétences" class="boutonCiel iconButtons" onclick="mapReset()"><i class="fas fa-skull-crossbones"></i></button>');
            $('#gangInfos').append('<button type="button" title="Supprimer tous les aliens" class="boutonCiel iconButtons" onclick="alienReset()"><i class="fas fa-bug"></i></button>');
            $('#gangInfos').append('<br>');
            $('#gangInfos').append('<button type="button" title="Check rencontres" class="boutonCiel iconButtons" onclick="encounterCheck()"><i class="fas fa-city"></i></button>');
            $('#gangInfos').append('<button type="button" title="Check voisins" class="boutonCiel iconButtons" onclick="lesVoisins()"><i class="fas fa-shuttle-van"></i></button>');
            $('#gangInfos').append('<button type="button" title="Supprime le stress de tous les bataillons" class="boutonCiel iconButtons" onclick="coolManCool()"><i class="fas fa-heart"></i></button>');
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
