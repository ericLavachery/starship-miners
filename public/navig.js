function commandes() {
    $('#commandz').empty();
    if (activeTurn == 'player') {
        if (batList.length >= 1) {
            if (Object.keys(selectedBat).length >= 1) {
                $('#commandz').append('<button type="button" title="Passer au bataillon suivant (et ne plus s\'occuper de celui-ci)" class="boutonGris iconButtons" onclick="nextBat(true)"><i class="fas fa-trash-alt"></i> <i class="fas fa-chevron-circle-right"></i></button>');
                $('#commandz').append('<button type="button" title="Passer au bataillon suivant (et s\'occuper de celui-ci plus tard)" class="boutonGris iconButtons" onclick="nextBat(false)"><i class="fas fa-share"></i> <i class="fas fa-chevron-circle-right"></i></button>');
            } else {
                $('#commandz').append('<button type="button" title="Passer au bataillon suivant" class="boutonGris iconButtons" onclick="nextBat(true)"><i class="fas fa-chevron-circle-right"></i></button>');
            }
        } else {
            $('#commandz').append('<button type="button" title="Liste de bataillons vide : Cliquer pour re-créer" class="boutonGris iconButtons" onclick="createBatList()"><i class="fas fa-undo-alt"></i> <i class="fas fa-chevron-circle-right"></i></button>');
        }
        $('#commandz').append('<br>');
        $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonGris iconButtons" onclick="nextTurn()"><i class="fas fa-spider"></i></button>');
        $('#commandz').append('<br>');
        $('#commandz').append('<button type="button" title="Générer une nouvelle carte" class="boutonGris iconButtons"><i class="fas fa-map" onclick="generateNewMap()"></i></button>');
        $('#commandz').append('<button type="button" title="Sauvegarder la carte" class="boutonGris iconButtons" onclick="saveMap()"><i class="fas fa-save"></i></button>');
    } else if (activeTurn == 'aliens') {
        if (alienList.length >= 1) {
            $('#commandz').append('<button type="button" title="Passer au bataillon suivant" class="boutonMauve iconButtons" onclick="nextAlien()"><i class="fas fa-chevron-circle-right"></i></button>');
        }
    }
};
