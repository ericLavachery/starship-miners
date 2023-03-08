$(document).keypress(function(e) {
    if (e.which == 122) {
        areaMove('n',3);
    }
    if (e.which == 115) {
        areaMove('s',3);
    }
    if (e.which == 100) {
        areaMove('e',3);
    }
    if (e.which == 113) {
        areaMove('w',3);
    }
    if (e.which == 99) {
        centerMap();
    }
    // embarq
    if (e.which == 101) {
        jumpInTrans();
    }
    // alert('You pressed '+e.which);
});
