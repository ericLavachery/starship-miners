function commandes() {
    $('#commandz').empty();
    $('#batloop').empty();
    if (activeTurn == 'player') {
        if (batList.length >= 1) {
            if (Object.keys(selectedBat).length >= 1) {
                $('#batloop').append('<button type="button" title="Passer au bataillon suivant (et ne plus s\'occuper de celui-ci)" class="boutonGris iconButtons" onclick="nextBat(true)"><i class="fas fa-trash-alt"></i> <i class="fas fa-chevron-circle-right"></i></button>');
                $('#batloop').append('<button type="button" title="Passer au bataillon suivant (et s\'occuper de celui-ci plus tard)" class="boutonGris iconButtons" onclick="nextBat(false)"><i class="fas fa-share"></i> <i class="fas fa-chevron-circle-right"></i></button>');
            } else {
                $('#batloop').append('<button type="button" title="Passer au bataillon suivant" class="boutonGris iconButtons" onclick="nextBat(true)"><i class="fas fa-chevron-circle-right"></i></button>');
            }
        } else {
            $('#batloop').append('<button type="button" title="Liste de bataillons vide : Cliquer pour re-créer" class="boutonVert iconButtons" onclick="createBatList()"><i class="fas fa-undo-alt"></i> <i class="fas fa-chevron-circle-right"></i></button>');
        }

        $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonMauve iconButtons" onclick="nextTurn()"><i class="fas fa-spider"></i></button>');
        $('#commandz').append('<button type="button" title="" class="boutonGris iconButtons" onclick="findEgg()">'+aliens.length+'</button>');

        $('#commandz').append('<hr>');
        $('#commandz').append('<button type="button" title="Générer une nouvelle carte" class="boutonVert iconButtons"><i class="fas fa-map" onclick="generateNewMap()"></i></button>');
        $('#commandz').append('<button type="button" title="Sauvegarder la carte" class="boutonVert iconButtons" onclick="saveMap()"><i class="fas fa-save"></i></button>');
        $('#commandz').append('<button type="button" title="Revenir au tour 0 (supprime tous les aliens)" class="boutonRouge iconButtons" onclick="showMapReset()" id="reset1"><i class="fas fa-power-off"></i></button>');
        $('#commandz').append('<button type="button" title="Revenir au tour 0 (supprime tous les aliens)" class="boutonRouge iconButtons" onclick="mapReset()" id="reset2"><i class="fas fa-skull-crossbones"></i></button>');

        $('#commandz').append('<br>');
        $('#commandz').append('<button type="button" title="Constriche" class="boutonGris iconButtons" onclick="bfconst()"><i class="fa fa-hammer"></i></button>');
        $('#commandz').append('<button type="button" title="Sauvegarder les bataillons" class="boutonGris iconButtons" onclick="saveAllBats()"><i class="far fa-save"></i></button>');
        $('#commandz').append('<br>');
    } else if (activeTurn == 'aliens') {
        $('#commandz').append('<button type="button" title="Passer au bataillon suivant" class="boutonMauve iconButtons" onclick="nextAlien()"><i class="fas fa-chevron-circle-right"></i></button>');
        if (alienList.length >= 2) {
            $('#commandz').append('<button type="button" title="" class="boutonMauve iconButtons" onclick="ffw()"><i class="fas fa-fast-forward"></i></button>');
        }
        $('#commandz').append('<button type="button" title="" class="boutonGris iconButtons" onclick="findEgg()">'+aliens.length+'</button>');
        $('#commandz').append('<br>');
    }
    $('#commandz').append('<button type="button" title="Stopper/Redémarrer la musique" class="boutonGris iconButtons" onclick="soundVolume(`mute`,`music`)"><i class="fas fa-volume-mute"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`down`,`music`)"><i class="fas fa-volume-down"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`up`,`music`)"><i class="fas fa-volume-up"></i></button><br>');
    $('#commandz').append('<button type="button" title="Stopper/Redémarrer les effets" class="boutonGris iconButtons" onclick="soundVolume(`mute`,`fx`)"><i class="fas fa-volume-mute"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume des effets" class="boutonGris iconButtons" onclick="soundVolume(`down`,`fx`)"><i class="fas fa-volume-down"></i></button>');
    $('#commandz').append('<button type="button" title="Augmenter le volume des effets" class="boutonGris iconButtons" onclick="soundVolume(`up`,`fx`)"><i class="fas fa-volume-up"></i></button><br>');
};
