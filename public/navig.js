function commandes() {
    $('#commandz').empty();
    if (batList.length >= 1) {
        if (Object.keys(selectedBat).length >= 1) {
            $('#commandz').append('<button type="button" title="Passer au bataillon suivant (et ne plus s\'occuper de celui-ci)" class="boutonMauve iconButtons" onclick="nextBat(true)"><i class="fas fa-trash-alt"></i> <i class="fas fa-chevron-circle-right"></i></button>');
            $('#commandz').append('<button type="button" title="Passer au bataillon suivant (et s\'occuper de celui-ci plus tard)" class="boutonMauve iconButtons" onclick="nextBat(false)"><i class="fas fa-share"></i> <i class="fas fa-chevron-circle-right"></i></button>');
        } else {
            $('#commandz').append('<button type="button" title="Passer au bataillon suivant" class="boutonMauve iconButtons" onclick="nextBat(true)"><i class="fas fa-chevron-circle-right"></i></button>');
        }
    } else {
        $('#commandz').append('<button type="button" title="Liste de bataillons vide : Cliquer pour re-créer" class="boutonMauve iconButtons" onclick="createBatList()"><i class="fas fa-undo-alt"></i> <i class="fas fa-chevron-circle-right"></i></button>');
    }
    $('#commandz').append('<br>');
    $('#commandz').append('<button type="button" title="Passer au tour suivant" class="boutonMauve iconButtons" onclick="nextTurn()"><i class="fas fa-spider"></i></button>');
    $('#commandz').append('<br>');
    $('#commandz').append('<button type="button" title="Générer une nouvelle carte" class="boutonMauve iconButtons"><i class="fas fa-map" onclick="generateNewMap()"></i></button>');
    $('#commandz').append('<button type="button" title="Sauvegarder la carte" class="boutonMauve iconButtons" onclick="saveMap()"><i class="fas fa-save"></i></button>');
};
