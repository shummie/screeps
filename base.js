class Base extends Creep {
    constructor(creep) {
        super(creep.id);
    }
}

Base.prototype.attemptToUpgrade = function() {
    if (this.pos.getRangeTo(this.room.controller) <= 2) {
    	this.upgradeController(this.room.controller);
    }
}

Base.prototype.deliverEnergyTo = function(target) {
	const targetIsFlag = target instanceof Flag;
	if (targetIsFlag) {
		this.deliverEnergyToFlag(target);
	} else {
		const range = this.pos.getRangeTo(target);
		if (range <= 1) {
            // We're next to the target, let's transfer energy.
			this.transfer(target, RESOURCE_ENERGY);
		} else {
            // Target might be moving, so don't {reusePath} here.
			this.moveTo(target);
		}
	}
}

Base.prototype.deliverEnergyToFlag = function(flag) {
	const range = this.pos.getRangeTo(flag);
	if (range === 0) {
		this.drop(RESOURCE_ENERGY);
	} else {
		const blockingCreep = flag.pos.creep();
		if (range === 1 && blockingCreep) {
            // Someone's in our way, tell them to move out.
			blockingCreep.unblockFlag();
		}
		this.moveTo(flag);
	}
}

Base.prototype.dismantleFlag = function(flag) {
    const structure = this.room.getStructureAt(flag.pos);
    if (structure) {
        this.moveToAndDismantle(structure);
    } else {
        flag.remove();
    }
}

/*  Game.getScoutFlags isn't implemented yet.
Base.prototype.findUnvisitedScoutFlags() {
    if (!this._unvisitedFlags) {
        const flags = Game.getScoutFlags();
        this._unvisitedFlags = flags.filter((flag) => {
            return !this.hasVisitedFlag(flag);
        });
    }
    return this._unvisitedFlags;
}
*/

Base.prototype.getSpawn = function() {
    // Get a list of all spawns in the game
    const spawns = Object.keys(Game.spawns).map(spawnName => Game.spawns[spawnName]);
    const validSpawn = spawns.find(spawn => {
        return spawn.room === this.room;
    });
    return validSpawn || Game.spawns[this.memory.spawn];
}

Base.prototype.hasVisitedFlag = function(flag) {
    const visitedFlags = this.memory.visitedFlags || [];
    return visitedFlags.indexOf(flag.name) !== -1;
}

Base.prototype.moveInRandomDirection = function() {
	const directions = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
    this.move(Math.floor(Math.random(directions.length) * directions.length));
}

Base.prototype.moveToAndBuild = function(target) {
    const range = this.pos.getRangeTo(target);
    if (range > 1) {
      this.moveTo(target);
    }
    if (range <= 3) {
      this.build(target);
    }
}

Base.prototype.moveToAndDismantle = function(target) {
    if (this.pos.getRangeTo(target) === 1) {
        this.dismantle(target);
    } else {
        this.moveTo(target);
    }
}

Base.prototype.moveToAndHarvest = function(target) {
	if (this.pos.getRangeTo(target) > 1) {
		this.moveTo(target);
	} else {
		this.harvest(target);
	}
}

Base.prototype.moveToAndRepair = function(target) {
    const range = this.pos.getRangeTo(target);
    if (range > 1) {
      this.moveTo(target);
    }
    if (range <= 3) {
      this.repair(target);
    }
}

Base.prototype.moveToAndUpgrade = function(target) {
    var controllerRange = this.pos.getRangeTo(target);
    if (controllerRange > 1) {
    	this.moveTo(this.room.controller);
    }
    if (controllerRange <= 3) {
     	this.upgradeController(this.room.controller);
    }
}

Base.prototype.moveToThenDrop = function() {
    if (this.pos.getRangeTo(target) > 1) {
        this.moveTo(target);
    } else {
        this.drop(RESOURCE_ENERGY);
    }
}

Base.prototype.needsEnergyDelivered = function() {
    // If this creep has less than 60% of its carry capcity available, then we want someone to deliver energy to this creep.
    // Harvesters never need energy delivered since they harvest energy
    // Couriers and Mailmans don't need energy delivered, they take energy and deliver to other people.
    const blacklist = ['harvester', 'courier', 'mailman'];
    if (blacklist.indexOf(this.memory.role) !== -1) {
        return false;
    }
    return this.carry.energy / this.carryCapacity < 0.6;
}

Base.prototype.needsOffloaded = function() {
    // If this creep has 60% of its carry capacity full, then we should have someone pick up its energy
    return this.carry.energy / this.carryCapacity > 0.6;
}

Base.prototype.performRole = function() {
    console.log(`WHOA! ${this.role()} does not have a performRole implementation!!!`);
}

Base.prototype.role = function() {
	return this.memory.role;
}

Base.prototype.takeEnergyFrom = function(target) {
    const range = this.pos.getRangeTo(target);
    if (target instanceof Energy) {
        if (range > 1) {
            this.moveTo(target);
        }
        return this.pickup(target);
    }
    if (range > 1) {
        this.moveTo(target);
    }

    // Don't use towers as a structure to take energy from:
    //if (!target.transfer || target.structureType && target.structureType === STRUCTURE_TOWER) {
    if (!target.transfer) {
        return target.transferEnergy(this);
    }
    return target.transfer(this, RESOURCE_ENERGY);
}

Base.prototype.targetSource = function() {
    return this.room.getSources().filter(source => {
        // Wouldn't Game.getObjectById(target.memory.source) be easier?...
    	return this.memory.source === source.id;
	})[0];
}

Base.prototype.unblockFlag = function() {
	this.moveInRandomDirection();
}

Base.prototype.work = function() {
    /*
    if (this.needsRenewed()) {
    	this.attemptRenew();
    }
    */
    const creepFlag = Game.flags[this.name];
    // move to creep flag if it is defined.
    if (creepFlag !== undefined) {
    	if (this.pos.getRangeTo(creepFlag) === 0) {
        	creepFlag.remove();
      	} else {
        	this.moveTo(creepFlag);
      	}
    /*} else if (this.shouldBeRecycled()) {
      	this.recycle();
    */
    } else {
      	this.performRole();
    }
}

module.exports = Base;
