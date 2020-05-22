function saveBataillons() {
    socket.emit('save-bataillons',bataillons);
};
function saveAliens() {
    socket.emit('save-aliens',aliens);
};
function savePlayerInfos() {
    playerInfos.numHTiles = numHTiles;
    playerInfos.numVTiles = numVTiles;
    socket.emit('save-playerInfos', playerInfos);
};
function saveMap() {
    socket.emit('save-map',zone);
    commandes();
};
function saveAllBats() {
    saveBataillons();
    saveAliens();
    savePlayerInfos();
    commandes();
};
function mapReset() {
    bataillons = [];
    saveBataillons();
    aliens = [];
    saveAliens();
    playerInfos.mapTurn = 0;
    playerInfos.mapDrop = 0;
    playerInfos.eggPause = false;
    playerInfos.aliensKilled = 0;
    playerInfos.eggsKilled = 0;
    playerInfos.unitsLost = 0;
    playerInfos.mapAdjDiff = playerInfos.mapDiff;
    playerInfos.fuzzTotal = 0;
    playerInfos.pauseSeed = rand.rand(1,8);
    savePlayerInfos();
    commandes();
    $("#reset2").css("display","none");
    $("#reset1").css("display","inline-block");
};
function showMapReset() {
    commandes();
    $("#reset1").css("display","none");
    $("#reset2").css("display","inline-block");
};
