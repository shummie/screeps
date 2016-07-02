
function getFlagsOfType(type) {
  return Game.flagArray().filter(flag => {
    return flag.name.toLowerCase().indexOf(type) !== -1;
  });
}


var scoutFlags = undefined;

const EnhancedGame = {};

EnhancedGame.flagArray = function () {
    return Object.keys(Game.flags).map(flagName => {
    	return Game.flags[flagName];
    });
}

EnhancedGame.myRooms = function() {
	return Game.roomArray().filter(room => room.getControllerOwned());
}

EnhancedGame.roomArray = function() {
	return Object.keys(Game.rooms).map(roomName => Game.rooms[roomName]);
}

EnhancedGame.clearScoutFlags = function() {
    Game.getScoutFlags().forEach(flag => {
    	flag.remove();
    });
}

EnhancedGame.clearAllFlags = function () {
    Game.flagArray().forEach(flag => {
      	flag.remove();
    });
}

EnhancedGame.getScoutFlags = function() {
    if (scoutFlags === undefined) {
    	scoutFlags = getFlagsOfType('scout');
    }
    return scoutFlags;
}

EnhancedGame.dismantleFlags = function() {
    return getFlagsOfType('dismantle');
}

EnhancedGame.claimFlags = function() {
    return getFlagsOfType('claim');
}

EnhancedGame.getClosestOwnedRoomTo = function(targetRoomName) {
    if (!roomDistanceMap[targetRoomName]) {
      	roomDistanceMap[targetRoomName] = Object.keys(Game.rooms).sort((roomNameA, roomNameB) => {
        	const roomA = Game.rooms[roomNameA];
        	const roomB = Game.rooms[roomNameB];
        	return roomA.distanceToRoom(targetRoomName) - roomB.distanceToRoom(targetRoomName);
      	})[0];
    }
    return roomDistanceMap[targetRoomName];
}

EnhancedGame.needSpawnBuilders = function() {
    if (Game.roomArray().filter(hasSpawn => {return hasSpawn.energyAvailable === 0})) {
        return true;
    }
    return false;
}

EnhancedGame.getSpawnBuilders = function() {
    if (!this._spawnBuilders) {
        this._spawnBuilders = Object.keys(Game.creeps).map(creepName => Game.creeps[creepName]).filter((creep) => {
            return creep.memory.role === 'spawnBuilder';
        });
    }
    return this._spawnBuilders;
}

EnhancedGame.spawnBuilderCount = function() {
    return this.getSpawnBuilders().length;
}

module.exports = EnhancedGame;