// Get the modal
var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var closespan = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
closespan.onclick = function() {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        $('#pophead').empty();
    }
}

function unitDetail(batId) {
    modal.style.display = "block";
    let bat = getBatById(batId);
    batInfos(bat,true);
};
