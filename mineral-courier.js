/* MineralCourier role:
* A minerao courier takes minerals located on the ground or from harvesters and delivers them to storages
*/

var Base = require('base');

class MineralCourier extends Base {
	constructor(creep) {
		super(creep);
	}
}

Courier.prototype.performRole = function() {
	// Look for structures that need energy delivered to it
	// This includes Spawns, Extensions, and Towers.
	const storageTarget = this.room.getStorage();
	
    if (_.sum(this.carry) === this.carryCapacity) {
		// If we're at full capacity, we should deliver to the storage
      	this.memory.task = 'deliver';
    } else if (_.sum(this.carry) === 0) {
		// we've delivered everything, let's pickup minerals.
     	this.memory.task = 'pickup';
    }

    // TODO: Code below hasn't been converted yet.

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
