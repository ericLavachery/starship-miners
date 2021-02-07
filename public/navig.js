function commandes() {
    $('#commandz').empty();
    $('#batloop').empty();
    if (activeTurn == 'player') {
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
            $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonMauve iconButtons" onclick="nextTurn()"><i class="fas fa-spider"></i></button>');
        } else {
            $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonGris iconButtons gf"><i class="fas fa-spider"></i></button>');
        }
        $('#commandz').append('<button type="button" title="Nombres d\'aliens en vue" class="boutonGris iconButtons" onclick="updateAliensNum()">'+aliensNum+'</button>');
        $('#commandz').append('<button type="button" title="Nombres d\'oeufs en vue" class="boutonGris iconButtons" onclick="findEgg()">'+eggsNum+'</button>');

        $('#commandz').append('<br>');
        $('#commandz').append('<button type="button" title="Ressources présentes dans la zone" class="boutonGris iconButtons" onclick="voirRessources()"><i class="far fa-gem"></i></button>');
        $('#commandz').append('<button type="button" title="Crafting" class="boutonGris iconButtons" onclick="craftWindow()"><i class="fas fa-toolbox"></i></button>');
        $('#commandz').append('<button type="button" title="Réserve" class="boutonGris iconButtons" onclick="voirReserve()"><i class="fas fa-piggy-bank"></i></button>');
        $('#commandz').append('<br>');
        $('#commandz').append('<button type="button" title="Minimap" class="boutonGris iconButtons" onclick="minimap()"><i class="far fa-map"></i></button>');
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
    $('#commandz').append('<button type="button" title="Stopper/Redémarrer la musique" class="boutonGris iconButtons" onclick="soundVolume(`mute`,`music`)"><i class="fas fa-volume-mute"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`down`,`music`)"><i class="fas fa-volume-down"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`up`,`music`)"><i class="fas fa-volume-up"></i></button><br>');
    $('#commandz').append('<button type="button" title="Stopper/Redémarrer les effets" class="boutonGris iconButtons" onclick="soundVolume(`mute`,`fx`)"><i class="fas fa-volume-mute"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume des effets" class="boutonGris iconButtons" onclick="soundVolume(`down`,`fx`)"><i class="fas fa-volume-down"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume des effets" class="boutonGris iconButtons" onclick="soundVolume(`up`,`fx`)"><i class="fas fa-volume-up"></i></button><br>');
    if (activeTurn == 'player') {
        $('#commandz').append('<hr>');
        $('#commandz').append('<button type="button" title="Générer une nouvelle carte" class="boutonRouge iconButtons"><i class="fas fa-map" onclick="generateNewMap()"></i></button>');
        $('#commandz').append('<button type="button" title="Sauvegarder la carte" class="boutonRouge iconButtons" onclick="saveMap()"><i class="fas fa-save"></i></button>');
        $('#commandz').append('<button type="button" title="Revenir au tour 0 (supprime tous les bataillons)" class="boutonRouge iconButtons" onclick="showMapReset()" id="reset1"><i class="fas fa-power-off"></i></button>');
        $('#commandz').append('<button type="button" title="Revenir au tour 0 (supprime tous les bataillons)" class="boutonRouge iconButtons" onclick="mapReset()" id="reset2"><i class="fas fa-skull-crossbones"></i></button>');
    }
    gangNavig();
};
