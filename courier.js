/* Courier role:
* A courier takes energy located on the ground or from harvesters and delivers them to
* Spawns, extensions, towers, or to the designated dump flags.
* TODO: Should this also deliver to storages/containers instead of the dump flag?
* TODO: Should this also look for other creeps to deliver to?
*/

var Base = require('base');

class Courier extends Base {
	constructor(creep) {
		super(creep);
	}
}

Courier.prototype.performRole = function() {
	// Look for structures that need energy delivered to it
	// This includes Spawns, Extensions, and Towers.
	const potentialTargets = this.room.getStructuresNeedingEnergyDelivery();
	var dumpTarget = this.pos.findClosestByRange(potentialTargets);

    if (this.carry.energy === this.carryCapacity) {
		// If we're at full energy, we should deliver to a target
      	this.memory.task = 'deliver';
    } else if (!dumpTarget || this.carry.energy === 0) {
		// If we don't have a target or we're out of energy, let's get some.
     	this.memory.task = 'pickup';
    }

	if (!dumpTarget) {
		// There are no spawns, Extensions or towers that need energy, so let's drop it off at the controller drop point
        // console.log(this.name + " acquiring controller flag");
        // If no target, drop it off at storage.
        const storage = this.room.getStorage();
        if (storage) {
            dumpTarget = storage;
        } else {
            dumpTarget = this.room.getControllerEnergyDropFlag();
        }
    }

	if (this.memory.task === 'pickup') {
      	if (!this.memory.target) {
			// Pick up energy from the ground or harvesters
        	const target = this.room.getEnergySourcesThatNeedsStocked()[0];
			this.memory.target = target ? target.id : '';
        	/* TODO: Figure out why the below doesn't work. Is it because an array isn't always returned?
			if (target) {
				// Let's find the closest target.

				const tar = this.pos.findClosestByRange(target);
            	this.memory.target = tar.id;
          	}
			*/
      	}
      	if (this.memory.target) {
			// We have a target, let's move to it.
        	const target = Game.getObjectById(this.memory.target);
        	var result;
        	if (target) {
          		result = this.takeEnergyFrom(target);
        	}
        	if (!target || result === 0) {
				// We no longer have a target, OR we successfully transferred energy.
          		this.memory.target = null;
        	}
      	} else {
			// We didn't have a target to begin with and we can't find any targets to get energy from.
			// Let's just deliver what we have then.
        	this.deliverEnergyTo(dumpTarget);
      	}
    } else {
        // console.log(this.name + " delivering to " + dumpTarget);
		// this.memory.task === 'deliver'
      	this.deliverEnergyTo(dumpTarget);
    }
}

module.exports = Courier;
