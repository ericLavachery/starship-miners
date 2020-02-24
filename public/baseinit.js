// Connexion à socket.io
var socket = io.connect('http://localhost:8080', {'sync disconnect on unload': true});
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
}
