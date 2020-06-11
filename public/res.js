function addAlienRes(bat) {
    let batType = getBatType(bat);
    if (Object.keys(batType.killRes).length >= 1) {
        for (var prop in batType.killRes) {
            if (Object.prototype.hasOwnProperty.call(batType.killRes,prop)) {
                // console.log(prop);
                // console.log(batType.killRes[prop]);
                if (playerInfos.alienRes[prop] >=1) {
                    playerInfos.alienRes[prop] = playerInfos.alienRes[prop]+batType.killRes[prop];
                } else {
                    playerInfos.alienRes[prop] = batType.killRes[prop];
                }
            }
        }
    }
};
