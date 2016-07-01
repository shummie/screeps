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

Room.prototype.getStorage = function() {
	if (!this._storageCalc) {
		this._storageCalc = true;
		this._storage = this.getMyStructures().filter(structure => {
			return structure.structureType === STRUCTURE_STORAGE;
		})[0];
	}
	return this._storage;
}

Room.prototype.getTowers = function() {
	if (!this._towers) {
      	this._towers = this.getMyStructures().filter(structure => {
        	return structure.structureType === STRUCTURE_TOWER;
    	});
    }
    return this._towers;
}

Room.prototype.getContainers = function () {
	if (!this._containers) {
     	this._containers = this.getStructures().filter(structure => {
        	return structure.structureType === STRUCTURE_CONTAINER;
      	});
    }
    return this._containers;
}

Room.prototype.getMineralSites = function() {
    if (!this._minerals) {
    	this._minerals = this.find(FIND_MINERALS);
    }
    return this._minerals;
}

Room.prototype.getStructures = function() {
    if (!this._structures) {
    	const structures = structureManager.structures();
      	this._structures = structures.filter(structure => structure.room === this);
    }
    return this._structures;
}