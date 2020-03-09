function saveBataillons() {
    socket.emit('save-bataillons', bataillons);
};
function savePlayerInfos() {
    socket.emit('save-playerInfos', playerInfos);
};
function saveMap() {
    socket.emit('save-map', zone);
};
