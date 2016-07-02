var Base = require('base');

class Upgrader extends Base {
    constructor(creep) {
        super(creep);
    }
}

Upgrader.prototype.performRole = function() {
	const empty = this.carry.energy === 0;
	if (!empty && this.memory.task != "selfharvest") {
		this.moveToAndUpgrade(this.room.controller);
	} else if (this.carry.energy === this.carryCapacity && this.memory.task === "selfharvest") {
		this.memory.task = undefined;
		this.moveToAndUpgrade(this.room.controller);
	} else if (empty && this.room.droppedControllerEnergy()) {
    	this.takeEnergyFrom(this.room.droppedControllerEnergy());
	} else if (empty && this.room.getStructuresWithEnergyPickup().length) {
		const closestStruct = this.pos.findClosestByRange(this.room.getStructuresWithEnergyPickup());
		this.takeEnergyFrom(closestStruct);
	} else {
		this.memory.task = "selfharvest";
		this.moveToAndHarvest(this.room.getSources()[0]);
	}
}



module.exports = Upgrader;