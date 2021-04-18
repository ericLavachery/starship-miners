function commandes() {
    $('#commandz').empty();
    $('#batloop').empty();
    if (activeTurn == 'player') {
        if (!modeSonde) {
            if (batList.length >= 1) {
                if (Object.keys(selectedBat).length >= 1) {
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant (et ne plus s\'occuper de celui-ci ce tour-ci)" class="boutonGris iconButtons" onclick="nextBat(true,false)"><i class="fas fa-thumbs-up"></i></button>');
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant (et s\'occuper de celui-ci plus tard)" class="boutonGris iconButtons" onclick="nextBat(false,false)"><i class="fas fa-share"></i></button>');
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant (et ne plus s\'occuper de celui-ci du tout)" class="boutonGris iconButtons" onclick="nextBat(true,true)"><i class="fas fa-trash-alt"></i></button>');
                } else {
                    $('#batloop').append('<button type="button" title="Passer au bataillon suivant" class="boutonGris iconButtons" onclick="nextBat(true)"><i class="fas fa-chevron-circle-right"></i></button>');
                }
            } else {
                $('#batloop').append('<button type="button" title="Liste de bataillons vide : Cliquer pour re-créer" class="boutonVert iconButtons" onclick="createBatList()"><i class="fas fa-undo-alt"></i> <i class="fas fa-chevron-circle-right"></i></button>');
            }
            if (nextTurnOK) {
                if (batList.length >= 1) {
                    $('#commandz').append('<button type="button" title="Passer au tour suivant (attention: vous ne vous êtes pas occupé de tout vos bataillons!)" class="boutonRouge iconButtons" onclick="emptyBatList()"><i class="fas fa-exclamation-triangle"></i></button>');
                } else {
                    $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonMauve iconButtons" onclick="nextTurn()"><i class="fas fa-spider"></i></button>');
                }
            } else {
                $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonGris iconButtons gf"><i class="fas fa-spider"></i></button>');
            }
            $('#commandz').append('<button type="button" title="Nombres d\'aliens en vue" class="boutonGris iconButtons" onclick="updateAliensNum()">'+aliensNum+'</button>');
            $('#commandz').append('<button type="button" title="Nombres d\'oeufs en vue" class="boutonGris iconButtons" onclick="findEgg()">'+eggsNum+'</button>');
            $('#commandz').append('<br>');
        }
        $('#commandz').append('<button type="button" title="Ressources présentes dans la zone" class="boutonGris iconButtons" onclick="voirRessources()"><i class="far fa-gem"></i></button>');
        if (!modeSonde) {
            $('#commandz').append('<button type="button" title="Crafting" class="boutonGris iconButtons" onclick="craftWindow()"><i class="fas fa-toolbox"></i></button>');
            $('#commandz').append('<button type="button" title="Réserve" class="boutonGris iconButtons" onclick="voirReserve()"><i class="fas fa-piggy-bank"></i></button>');
            $('#commandz').append('<br>');
        }
        $('#commandz').append('<button type="button" title="Minimap" class="boutonGris iconButtons" onclick="minimap()"><i class="far fa-map"></i></button>');
        if (modeSonde) {
            $('#commandz').append('<br>');
        }
        $('#commandz').append('<button type="button" title="Sauvegarder le jeu" class="boutonVert iconButtons" onclick="saveGame()"><i class="far fa-save"></i> &nbsp;<span class="notsosmall">Save</span></button>');
        $('#commandz').append('<br>');
    } else if (activeTurn == 'aliens') {
        if (alienList.length >= 2) {
            $('#commandz').append('<button type="button" title="" class="boutonMauve iconButtons" onclick="ffw()"><i class="fas fa-fast-forward"></i></button>');
        } else {
            $('#commandz').append('<button type="button" title="Passer au bataillon suivant" class="boutonMauve iconButtons" onclick="nextAlien()"><i class="fas fa-chevron-circle-right"></i></button>');
        }
        $('#commandz').append('<button type="button" title="Nombres d\'aliens en vue" class="boutonGris iconButtons">'+aliensNum+'</button>');
        $('#commandz').append('<button type="button" title="Nombres d\'oeufs en vue" class="boutonGris iconButtons" onclick="findEgg()">'+eggsNum+'</button>');
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
    $('#commandz').append('<br>');
    if (activeTurn == 'player') {
        $('#commandz').append('<hr>');
        if (!modeSonde) {
            $('#commandz').append('<button type="button" title="Passer en mode sonde" class="boutonBrun iconButtons" onclick="goSonde()"><i class="fas fa-rocket"></i></button>');
            $('#commandz').append('<button type="button" title="Charger une zone sauvegardée" class="boutonBrun iconButtons" onclick="voirZones()"><i class="fas fa-folder-open"></i></button>');
            $('#commandz').append('<button type="button" title="Sauvegarder la carte pour un retour (supprime la plupart des aliens et bataillons!)" class="boutonBrun iconButtons" onclick="saveMapForReturn()"><i class="fas fa-file-archive"></i></button>');
        } else {
            $('#commandz').append('<button type="button" title="Quitter le mode sonde" class="boutonRouge iconButtons" onclick="stopSonde()"><i class="fas fa-rocket"></i></button>');
            let maxMaps = (playerInfos.comp.vsp+2)*maxMapsParDet;
            let nextMapNumber = playerInfos.sondeMaps+1;
            if (playerInfos.sondeMaps < maxMaps) {
                $('#commandz').append('<button type="button" title="Générer une nouvelle carte ('+nextMapNumber+'/'+maxMaps+')" class="boutonBrun iconButtons"><i class="fas fa-map" onclick="generateNewMap()"></i></button>');
            } else {
                $('#commandz').append('<button type="button" title="Maximum de cartes atteint" class="boutonGris iconButtons"><i class="fas fa-map"></i></button>');
            }
            $('#commandz').append('<button type="button" title="Sauvegarder la nouvelle carte" class="boutonBrun iconButtons" onclick="saveMapAs()"><i class="fas fa-save"></i></button>');
        }
        $('#commandz').append('<br>');
        if (!modeSonde) {
            $('#commandz').append('<hr>');
            $('#commandz').append('<button type="button" title="Supprime TOUT sauf la carte et les compétences" class="boutonRouge iconButtons" onclick="showMapReset()" id="reset1"><i class="fas fa-power-off"></i></button>');
            $('#commandz').append('<button type="button" title="Supprime TOUT sauf la carte et les compétences" class="boutonRouge iconButtons" onclick="mapReset()" id="reset2"><i class="fas fa-skull-crossbones"></i></button>');
            $('#commandz').append('<button type="button" title="Remettre les compétences à zéro" class="boutonRouge iconButtons" onclick="compReset()"><i class="fas fa-award"></i></button>');
            $('#commandz').append('<button type="button" title="Supprimer tous les aliens" class="boutonRouge iconButtons" onclick="alienReset()"><i class="fas fa-bug"></i></button>');
            $('#commandz').append('<br>');
            $('#commandz').append('<button type="button" title="Rapport de mission (estimation)" class="boutonRouge iconButtons" onclick="missionResults(false)"><i class="fas fa-balance-scale"></i></button>');
            $('#commandz').append('<button type="button" title="Rentrer au vaisseau mère + Rapport de mission" class="boutonRouge iconButtons" onclick="missionResults(true)"><i class="fas fa-space-shuttle"></i></button>');
            $('#commandz').append('<hr>');
            $('#commandz').append('<button type="button" title="Nouvelle campagne" class="boutonRose iconButtons" onclick="newGame()"><i class="fas fa-chess-queen"></i></button>');
            $('#commandz').append('<button type="button" title="Ajouter le pack de ressources ('+playerInfos.gang+')" class="boutonRose iconButtons" onclick="addStartPack()"><i class="fas fa-coins"></i></button>');
        }
    }
    gangNavig();
};

function gangNavig() {
    $('#gangInfos').empty();
    $('#gangInfos').append('<button type="button" title="Construire gratuitement" class="boutonCiel iconButtons" onclick="bfconst(`all`,true,false)"><i class="fa fa-hammer"></i></button>');
    $('#gangInfos').append('<button type="button" title="Remplir le lander" class="boutonCiel iconButtons" onclick="landerFill()"><i class="fas fa-dolly"></i></button>');
    $('#gangInfos').append('<button type="button" title="Editer le Gang" class="boutonCiel iconButtons" onclick="gangEdit()"><i class="fas fa-users-cog"></i></button>');
    if (playerInfos.pseudo === 'Test') {
        $('#gangInfos').append('<br>');
        $('#gangInfos').append('<button type="button" title="Ajouter un peu de chaque ressource" class="boutonCiel iconButtons" onclick="allResAdd(10)"><i class="fas fa-cart-plus"></i></button>');
    }
    $('#gangInfos').append('<div class="shSpace"></div>');
    $('#gangInfos').append('<span class="butSpace"></span>');
    $('#gangInfos').append(capitalizeFirstLetter(playerInfos.gang));
    $('#gangInfos').append(' '+playerInfos.gLevel+'<br>');
};
