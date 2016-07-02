//var Base = {};  // Creating an empty object

//function Base (creep) { 
	//Creep.apply (this, arguments); }
	
//Base.prototype = Object.create(Creep.prototype);



class Base extends Creep {
    constructor(creep) {
        super(creep.id);
    }
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

Base.prototype.performRole = function() {
    console.log(`WHOA! ${this.role()} does not have a performRole implementation!!!`); // eslint-disable-line
}

Base.prototype.role = function() {
	return this.memory.role;
}


Base.prototype.moveToAndHarvest = function(target) {
	if (this.pos.getRangeTo(target) > 1) {
		this.moveTo(target);
	} else {
		this.harvest(target);
	}
}

Base.prototype.targetSource = function() {
    return this.room.getSources().filter(source => {
    	return this.memory.source === source.id;
	})[0];
}

Base.prototype.deliverEnergyTo = function(target) {
	const targetIsFlag = target instanceof Flag;
	if (targetIsFlag) {
		this.deliverEnergyToFlag(target);
	} else {
		const range = this.pos.getRangeTo(target);
		if (range <= 1) {
			this.transfer(target, RESOURCE_ENERGY);
		} else {
			this.moveTo(target, {reusePath: 5});
		}
	}
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

    if (!target.transfer || target.structureType && target.structureType === STRUCTURE_TOWER) { // eslint-disable-line
      return target.transferEnergy(this);
    }

    return target.transfer(this, RESOURCE_ENERGY);
}


Base.prototype.deliverEnergyToFlag = function(flag) {
	const range = this.pos.getRangeTo(flag);
	if (range === 0) {
		this.drop(RESOURCE_ENERGY);
	} else {
		const blockingCreep = flag.pos.creep();
		if (range === 1 && blockingCreep) {
			blockingCreep.unblockFlag();
		}
		this.moveTo(flag);
	}
}

Base.prototype.unblockFlag = function() {
	this.moveInRandomDirection();
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

Base.prototype.attemptToUpgrade = function() {
    if (this.pos.getRangeTo(this.room.controller) <= 2) {
    	this.upgradeController(this.room.controller);
    }
}

Base.prototype.getSpawn = function() {
    const spawns = Object.keys(Game.spawns).map(spawnName => Game.spawns[spawnName]);
    const validSpawn = spawns.find(spawn => {
        return spawn.room === this.room;
    });
    return validSpawn || Game.spawns[this.memory.spawn];
}

Base.prototype.needsOffloaded = function() {
    return this.carry.energy / this.carryCapacity > 0.6;
}

Base.prototype.needsEnergyDelivered = function() {
    const blacklist = ['harvester', 'courier', 'mailman'];
    if (blacklist.indexOf(this.memory.role) !== -1) {
        return false;
    }

    return this.carry.energy / this.carryCapacity < 0.3; 
}

module.exports = Base;