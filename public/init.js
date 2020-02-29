// UnitTypes
socket.on('unitDV_Load', function(dv) {
    unitDV = dv;
    // console.log(unitDV);
});
socket.on('unitTypes_Load', function(ut) {
    bareUnitTypes = ut;
    // $('#con').append('<br><span class="jaune">Second Weapon : ' + unitTypes[1].weapon2.name + '</span>');

    let newObj = {};
    let unitTypes = [];
    bareUnitTypes.forEach(function(type) {
        newObj = Object.assign({}, unitDV, type);
        unitTypes.push(newObj)
    });
    console.log(unitTypes);

});
