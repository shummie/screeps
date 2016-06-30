var creepManager = require('creep-manager');

const cardinality = {
	N: -1,
	S: 1,
	W: -1,
	E: 1,
};

function coordValue(roomName, regex) {
	const xString = regex.exec(roomName)[1];
	const modifier = cardinality[xString.substr(0, 1)];
	const value = xString.substr(1);
	return modifier * value;
}

function xValueFromRoomName(roomName) {
	return coordValue(roomName, /([WE]\d+)/);
}

function yValueFromRoomName(roomName) {
	return coordValue(roomName, /([NS]\d+)/);
}

Room.prototype.getUniqueExitPoints = function() {
	if (!this._uniqueExitPoints) {
		const exitCoords = this.getExits();
		this._uniqueExitPoints = exitCoords.filter((coord, index) => {
			if (index === 0) {
				return true;
			}

			const prevCoord = exitCoords[index - 1];
			return !(Math.abs(coord.x - prevCoord.x) < 2) || !(Math.abs(coord.y - prevCoord.y) < 2);
		});
	}

	return this._uniqueExitPoints;
}

Room.prototype.getExits = function() {
    if (!this._exits) {
      this._exits = this.find(FIND_EXIT);
    }

    return this._exits;
}

Room.prototype.getSources = function() {
    if (!this._sources) {
      this._sources = this.find(FIND_SOURCES);
    }

    return this._sources;
}

Room.prototype.myCreeps = function() {
    if (!this._myCreeps) {
    	this._myCreeps = creepManager.creeps().filter(creep => creep.room === this);
    }

    return this._myCreeps;
    
}

Room.prototype.work = function() {
    this.myCreeps().forEach((creep) => {
      creep.work();
    });
}


Room.prototype.hasHostileCreep = function() {
	return this.getHostileCreeps().length > 0;
}

Room.prototype.getHostileCreeps = function() {
	return this.find(FIND_HOSTILE_CREEPS);
}