var creepManager = require('creep-manager');
var structureManager = require('structure-manager');

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


Room.prototype.getLinks = function() {
    if (!this._links) {
      this._links = this.getMyStructures().filter(structure => {
        return structure.structureType === STRUCTURE_LINK;
      });
    }

    return this._links;
}

Room.prototype.getSources = function() {
    if (!this._sources) {
      this._sources = this.find(FIND_SOURCES);
    }

    return this._sources;
}

Room.prototype.getSourcesNeedingHarvesters = function() {
    return this.getSources().filter(source => {
	    return source.needsHarvesters();
    });
}

Room.prototype.myCreeps = function() {
    if (!this._myCreeps) {
    	this._myCreeps = creepManager.creeps().filter(creep => creep.room === this);
    }

    return this._myCreeps;
    
}

Room.prototype.work = function() {

	this.getMyStructures().forEach((structure) => {
      	structure.work();
    });

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


Room.prototype.getMyStructures = function() {
    if (!this._myStructures) {
      	const structures = this.getStructures();
      	this._myStructures = structures.filter(structure => structure.my);
    }

    return this._myStructures;
}

Room.prototype.harvesterCount = function() {
    return this.getHarvesters().length;
}

Room.prototype.getHarvesters = function() {
    if (!this._harvesters) {
    	this._harvesters = this.myCreeps().filter((creep) => {
        	return creep.memory.role === 'harvester';
      	});
    }
    return this._harvesters;
}

Room.prototype.haulerCount = function() {
    return this.getHaulers().length;
}

Room.prototype.getHaulers = function() {
    if (!this._haulers) {
    	this._haulers = this.myCreeps().filter((creep) => {
        	return creep.memory.role === 'hauler';
      	});
    }
    return this._haulers;
}

Room.prototype.builderCount = function() {
    return this.getBuilders().length;
}

Room.prototype.getBuilders = function() {
    if (!this._builders) {
    	this._builders = this.myCreeps().filter((creep) => {
        	return creep.memory.role === 'builder';
      	});
    }
    return this._builders;
}

Room.prototype.upgraderCount = function() {
    return this.getUpgraders().length;
}

Room.prototype.getUpgraders = function() {
    if (!this._upgraders) {
    	this._upgraders = this.myCreeps().filter((creep) => {
        	return creep.memory.role === 'upgrader';
      	});
    }
    return this._upgraders;
}

Room.prototype.fixerCount = function() {
    return this.getFixers().length;
}

Room.prototype.getFixers = function() {
    if (!this._fixers) {
    	this._fixers = this.myCreeps().filter((creep) => {
        	return creep.memory.role === 'fixer';
      	});
    }
    return this._fixers;
}

Room.prototype.minerHelperCount = function() {
    return this.getMinerHelpers().length;
}

Room.prototype.getMinerHelpers = function() {
    if (!this._minerHelpers) {
    	this._minerHelpers = this.myCreeps().filter((creep) => {
        	return creep.memory.role === 'minerHelper';
      	});
    }
    return this._minerHelpers;
}

Room.prototype.getStructuresNeedingEnergyDelivery = function() {
    if (!this._structuresNeedingEnergyDelivery) {
        this._structuresNeedingEnergyDelivery = this.getMyStructures().filter(structure => {
            const notALink = structure.structureType !== STRUCTURE_LINK;
            //const isTower = structure.structureType === STRUCTURE_TOWER;
            //const notASourceTower = isTower ? !structure.isSourceTower() : true;
            const notFull = structure.energyCapacity && structure.energy < structure.energyCapacity;
            //return notFull && notALink && notASourceTower; 
			return notFull && notALink; 
        });
    }
    return this._structuresNeedingEnergyDelivery;
}

Room.prototype.getEnergySourcesThatNeedsStocked = function() {
    if (this.getEnergyThatNeedsPickedUp().length) {
        return this.getEnergyThatNeedsPickedUp();
    } else if (this.getCreepsThatNeedOffloading().length) {
        return this.getCreepsThatNeedOffloading();
	}
	/*
    } else if (this.getStorage() && !this.getStorage().isEmpty()) {
        return [this.getStorage()];
    } 
	*/
    /*
    else if (this.getTowers().length) {
        // All towers that aren't empty are a source of energy
        return this.getTowers().filter(tower => {
            return !tower.isEmpty();
        });
    }
    */

    return [];
}


Room.prototype.getStructuresWithEnergyPickup = function() {
	if (!this._structuresWithEnergyPickup) {
		this._structuresWithEnergyPickup = this.getStructures().filter (structure => {return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE || structure.structureType === STRUCTURE_LINK) && structure.store[RESOURCE_ENERGY] > 0});
	}
	return this._structuresWithEnergyPickup;
}

Room.prototype.getStructuresWithEnergyStorageSpace = function() {
	if (!this._structuresWithEnergyStorageSpace) {
		this._structuresWithEnergyStorageSpace = this.getStructures().filter (structure => {return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE || structure.structureType === STRUCTURE_LINK) && _.sum(structure.store) < structure.storeCapacity});
	}
	return this._structuresWithEnergyStorageSpace;
}

Room.prototype.getEnergyThatNeedsPickedUp = function() {
    //const targets = this.courierTargets();
    //const dumpFlag = this.getControllerEnergyDropFlag();

    return this.getDroppedEnergy().filter(energy => {
        //const targeted = targets.indexOf(energy.id) !== -1;
        const inRange = energy.pos.getRangeTo(this.getCenterPosition()) < 23;
        //return !targeted && inRange && energy.pos.getRangeTo(dumpFlag) !== 0;
        return inRange !== 0;
    });
}

Room.prototype.getCenterPosition = function() {
    return new RoomPosition(25, 25, this.name);
}

Room.prototype.getDroppedEnergy = function() {
    return this.find(FIND_DROPPED_ENERGY).sort((energyA, energyB) => {
        return energyB.energy - energyA.energy;
    });
}

Room.prototype.getCreepsThatNeedOffloading = function() {
	// This will return a list of harvesters that have energy to offload.
    const targets = this.haulerTargets();
    return this.getHarvesters().filter(harvester => {
      const targeted = targets.indexOf(harvester.id) !== -1;
      return harvester.needsOffloaded() && !targeted;
    });
}

Room.prototype.haulerTargets = function() {
    return this.getHaulers().filter(creep => {
      return creep.memory.role === 'hauler' && !!creep.memory.target;
    }).map(hauler => {
      return hauler.memory.target;
    });
}