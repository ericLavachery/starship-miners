function saveBataillons() {
    socket.emit('save-bataillons', bataillons);
};
function saveAliens() {
    socket.emit('save-aliens', aliens);
};
function savePlayerInfos() {
    socket.emit('save-playerInfos', playerInfos);
};
function saveMap() {
    socket.emit('save-map', zone);
};
function saveAllBats() {
    saveBataillons();
    saveAliens();
};
