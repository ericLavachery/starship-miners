// UnitTypes
socket.on('unitTypes_Load', function(ut) {
    unitTypes = ut;
    $('#con').append('<br><span class="jaune">Second Weapon : ' + unitTypes[1].weapon2.name + '</span>');
    console.log(unitTypes[1].name);
});
