var Base = require('base');

class Hauler extends Base {
    constructor(creep) {
        super(creep);
    }
}


Hauler.prototype.performRole = function() {
	
	if (this.carry.energy === this.carryCapacity) {
		// If we're full, let's deliver the energy to the closest target.
		this.memory.task = "deliver";
	} else if (this.carry.energy === 0){
		// If we have no energy left, let's get some.
		this.memory.task = "pickup";
	}



	if (this.memory.task === "pickup") {
		if (!this.memory.target) {
			//const target = this.room.getEnergySourcesThatNeedsStocked()[0];
			const availEnergyStructs = this.room.getStructuresWithEnergyPickup();
			const target = this.pos.findClosestByRange(availEnergyStructs);
			this.memory.target = target ? target.id : '';
		}

		if (this.memory.target) {
			const target = Game.getObjectById(this.memory.target);
			var result;
			if (target) {
				result = this.takeEnergyFrom(target);
			}
			if (!target || result === 0) {
				// If we don't have a target or we successfully transferred energy...
				this.memory.target = '';
			}

		}
	} else {
		// this.memory.task === "deliver"
		const potentialTargets = this.room.getStructuresNeedingEnergyDelivery();
		var dumpTarget = this.pos.findClosestByRange(potentialTargets);		
		this.deliverEnergyTo(dumpTarget);
	}

}

module.exports = Hauler;