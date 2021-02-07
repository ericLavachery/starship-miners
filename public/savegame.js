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
    // showedTilesReset();
    socket.emit('save-map',zone);
    commandes();
};
function saveAllBats() {
    saveBataillons();
    saveAliens();
    savePlayerInfos();
    commandes();
};
function saveGame() {
    saveBataillons();
    saveAliens();
    savePlayerInfos();
    saveMap();
    commandes();
};
function mapReset() {
    bataillons = [];
    saveBataillons();
    aliens = [];
    saveAliens();
    let downDiff = Math.floor(playerInfos.mapTurn/50);
    playerInfos.mapDiff = playerInfos.mapDiff-downDiff;
    playerInfos.mapAdjDiff = playerInfos.mapDiff;
    playerInfos.mapTurn = 0;
    playerInfos.mapDrop = 0;
    playerInfos.cocons = 0;
    playerInfos.eggPause = false;
    playerInfos.aliensKilled = 0;
    playerInfos.eggsKilled = 0;
    playerInfos.unitsLost = 0;
    playerInfos.fuzzTotal = 0;
    playerInfos.pauseSeed = rand.rand(1,8);
    playerInfos.res = {};
    playerInfos.alienRes = {};
    playerInfos.showedTiles = [1830];
    playerInfos.myCenter = 1830;
    playerInfos.undarkOnce = [];
    playerInfos.bldList = [];
    playerInfos.drugs = ["Starka","Kirin","Sila","Skupiac","Bliss","Nitro"];
    playerInfos.comp = resetComp();
    resetReserve();
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
