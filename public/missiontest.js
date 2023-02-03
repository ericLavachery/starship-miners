function putMissionUnits() {
    let startTileId = -1;
    let theBest = 0;
    zone.forEach(function(tile) {
        if (tile.nav != undefined) {
            if (tile.nav) {
                thisOne = 1;
                if (playerInfos.showedTiles.includes(tile.id)) {
                    thisOne = 10;
                }
                if (thisOne > theBest) {
                    startTileId = tile.id;
                    theBest = thisOne;
                }
            }
        }
    });
    if (startTileId < 0) {
        startTileId = 1830;
    }
    playerInfos.myCenter = startTileId;
    let tileId = startTileId;
    let unitNum = 0;
    let missionBatList = getMissionBatList();
    missionBatList.forEach(function(slot) {
        unitNum++;
        let maxXP = 900;
        let minXP = Math.floor(maxXP*zone[0].mapDiff*zone[0].mapDiff*zone[0].mapDiff/2000);
        let unitXP = rand.rand(minXP,maxXP);
        addMissionBat(tileId,slot,unitXP);
    });
    // playerInfos.mapTurn = 1;
    showMap(zone,false);
};

function addMissionBat(tileId,slot,xp) {
    // ajouter bataillon
    console.log('ADD BAT');
    console.log(slot);
    let unitIndex = unitTypes.findIndex((obj => obj.name === slot.name));
    if (unitIndex === -1) {
        if (slot.name === 'Infirmiers') {
            slot.name = 'Médecins';
            console.log(slot);
            unitIndex = unitTypes.findIndex((obj => obj.name === slot.name));
        }
    }
    conselUnit = unitTypes[unitIndex];
    conselPut = false;
    conselAmmos = slot.gear;
    conselTriche = true;
    console.log(conselUnit);
    let isNav = false;
    if (conselUnit.skills.includes('transorbital')) {
        isNav = true;
    }
    putBat(tileId,0,xp,'deploy',false,true,true);
    if (isNav) {
        let navBat = getLastBatCreated();
        console.log('NAVBAT');
        console.log(navBat);
        navId = navBat.id;
    } else if (navId >= 0) {
        // embarquer dans la navette
        let newBat = getLastBatCreated();
        console.log('lastBat');
        console.log(newBat);
        loadBat(newBat.id,navId);
    }
};

function getMissionBatList() {
    let missionBatList = [];
    // determiner unité, munitions, armure, équipement
    let newSlot = new SlotConstructor('Navette de secours',['titanium','xxx','aucun','e-mecano']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Rednecks',['uranium','uranium','wendium','chargeur']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Rednecks',['snake','snake','duneg','chargeur']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Rednecks',['uranium','uranium','wendium','theeye']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Rednecks',['uranium','uranium','duneg','e-camo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Rednecks',['timonium','snake','swarwing','e-camo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Barmen',['gliding','molotov-slime','wendium','lunette1']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Barmen',['titanium','molotov-slime','duneg','chargeur1']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Marshalls',['explosive','salite','wendium','theeye']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Marshalls',['explosive','uranium','wendium','e-camo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Lucky bastards',['gliding','grenade','wendium','lancegren']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Lucky bastards',['timonium','grenade-gaz','wendium','lancegren']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Lucky bastards',['gliding','grenade-gaz','duneg','e-camo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Stalkers',['salite','lame-carbone','duneg','lunette1']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Stalkers',['titanium','lame-carbone','wendium','lunette1']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Runners',['ac-flechette','grenade-gaz','duneg','detector']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Runners',['ac-uranium','grenade','duneg','detector']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Infirmiers',['tungsten','xxx','swarwing','e-camo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Infirmiers',['tungsten','xxx','swarwing','e-medic']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Infirmiers',['tungsten','xxx','kevlar','e-medic']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Infirmiers',['tungsten','xxx','kevlar','e-camo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Infirmiers',['tungsten','xxx','kevlar','e-camo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Riggers',['lame-carbone','gaz','duneg','w2-gaz']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Sapeurs',['tungsten','lame-carbone','duneg','e-road']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Buggies',['uranium','lame-carbone','chobham','w2-moisso']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Buggies',['uranium','lame-carbone','swag','w2-moisso']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Buggies',['timonium','lame-carbone','swag','w2-moisso']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Pickups',['explosive','molotov-feu','swag','snorkel']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Jeeps',['explosive','belier-spike','swag','e-road']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Jeeps',['explosive','belier-spike','chobham','e-road']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Obusiers',['obus-heatseeker','uranium','bulk','longtom1']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Bunkers',['snake','uranium','bulk','chargeur']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Poudrière',['pn-explosive','grenade','bulk','w2-explo']);
    missionBatList.push(newSlot);
    newSlot = new SlotConstructor('Tour de guet',['marquage','xxx','bulk','lunette']);
    missionBatList.push(newSlot);
    console.log('MISSION BATS');
    console.log(missionBatList);
    return missionBatList;
};

function SlotConstructor(theName,theGear) {
    this.name = theName;
    this.gear = theGear;
};

function loadMission() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","800px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<span class="constName or" id="gentils">CHARGER UNE MISSION</span><br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<select class="boutonGris" id="theStartZone" onchange="loadTheMissionBaby()"></select>');
    $('#theStartZone').empty().append('<option value="0" selected>Zone</option>');
    $('#theStartZone').append('<option value="80" disabled>Zone 80 - Boss Spider</option>');
    $('#theStartZone').append('<option value="75" disabled>Zone 75 - Boss Bug</option>');
    $('#theStartZone').append('<option value="70" disabled>Zone 70 - Boss Larve</option>');
    $('#theStartZone').append('<option value="65" disabled>Zone 65 - Boss Swarm</option>');
    $('#theStartZone').append('<option value="60">Zone 60 - Résistance</option>');
    $('#theStartZone').append('<option value="55" disabled>Zone 55 - Science</option>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<span class="butSpace"></span>');
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function loadTheMissionBaby() {
    let selectorNum = document.getElementById("theStartZone").value;
    let missionNum = +selectorNum;
    playerInfos.missionZone = missionNum;
    moveMissionZone(missionNum);
    conOut(true);
    playerInfos.okFill = true;
    startMission();
};
