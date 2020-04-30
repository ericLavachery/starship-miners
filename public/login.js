// Connexion à socket.io
var socket = io.connect('http://localhost:8080', {'sync disconnect on unload': true});

// LOGIN ---------------------------------------------------------------
// fonction pour Connexion

let pseudo = new URLSearchParams(document.location.search).get("pseudo");
if (pseudo != '' && pseudo != null && pseudo != undefined) {
    connectMe(pseudo);
} else {
    pseudo = 'anonymous';
}

function promptMe() {
    // On demande le pseudo, on l'envoie au serveur
    pseudo = prompt('Quel est votre pseudo ?');
    if (pseudo == '' || pseudo == null || pseudo == undefined) {
        pseudo = 'anonymous';
        socket.disconnect();
    }
    connectMe(pseudo);
}
function connectMe(pseudo) {
    socket.emit('newcli', pseudo);
    // montre tout sauf le bouton connexion
    document.getElementById('con').style.display = 'block';
    document.getElementById('pascon').style.display = 'none';
    // change le titre du doc
    document.title = 'Starship Miners - ' + pseudo;
    document.getElementById("pseu").innerHTML = pseudo;
}
function testConnect(pseudo) {
    socket.emit('testcon', pseudo);
}

$('#hello').click(promptMe);

// $('#medit').click(function() {
//     window.location = "/edit/?pseudo=" + pseudo;
// });
//
// $('#home').click(function() {
//     window.location = "/?pseudo=" + pseudo;
// });
