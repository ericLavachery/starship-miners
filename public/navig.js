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

        $('#commandz').append('<br>');
        $('#commandz').append('<button type="button" title="Générer une nouvelle carte" class="boutonGris iconButtons"><i class="fas fa-map" onclick="generateNewMap()"></i></button>');
        $('#commandz').append('<button type="button" title="Sauvegarder la carte" class="boutonGris iconButtons" onclick="saveMap()"><i class="fas fa-save"></i></button>');
        $('#commandz').append('<button type="button" title="Revenir au tour 0 (supprime tous les aliens)" class="boutonGris iconButtons" onclick="mapReset()"><i class="fas fa-power-off"></i></button>');

        $('#commandz').append('<br>');
        $('#commandz').append('<button type="button" title="Constriche" class="boutonGris iconButtons" onclick="bfconst()"><i class="fa fa-hammer"></i></button>');
        $('#commandz').append('<button type="button" title="Sauvegarder les bataillons" class="boutonGris iconButtons" onclick="saveAllBats()"><i class="far fa-save"></i></button>');
    } else if (activeTurn == 'aliens') {
        if (alienList.length >= 1) {
            $('#commandz').append('<button type="button" title="Passer au bataillon suivant" class="boutonMauve iconButtons" onclick="nextAlien()"><i class="fas fa-chevron-circle-right"></i></button>');
        }
    }
};
