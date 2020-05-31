$(document).keypress(function(e) {
    if (e.which == 122) {
        areaMove('n');
    }
    if (e.which == 115) {
        areaMove('s');
    }
    if (e.which == 100) {
        areaMove('e');
    }
    if (e.which == 113) {
        areaMove('w');
    }
    if (e.which == 99) {
        centerMap();
    }
    // fuck (poubelle)
    // if (e.which == 102) {
    //     nextBat(true);
    // }
    // alert('You pressed '+e.which);
});
