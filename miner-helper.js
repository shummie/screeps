// Miner Helpers
// These guys try to find Harvesters, and collect energy from them, then transfers the energy to the nearest storage facility.

var Base = require('base');

class MinerHelper extends Base {
	constructor(creep) {
		super(creep);	
	}
}

MinerHelper.prototype.performRole = function() {
	// If we're full, let's dump our energy off at a storage or container. Whatever is closer.
		
	if (this.carry.energy == this.carryCapacity) {
		this.memory.task = "deliver";
	} else if (this.carry.energy === 0) {
		this.memory.task = "pickup";
	}
	
	if (this.memory.task === "deliver") {
		// We need to deliver the energy to a structure, but we don't have a target yet.
		const storagePlaces = this.room.getStructuresWithEnergyStorageSpace();
		const target = this.pos.findClosestByRange(storagePlaces);
		// Probably doing a bit of excess calculations here. Could store the target and not have to recalculate every time we move.
		this.deliverEnergyTo(target);
	} else if (this.memory.task === "pickup") {
		// We need energy, find harvesters with energy and pick it up from them.
		if (!this.memory.target) {
			const energyTargets = this.room.getEnergySourcesThatNeedsStocked();
			const target = this.pos.findClosestByRange(energyTargets);
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
	}
}
	
	
module.exports = MinerHelper;