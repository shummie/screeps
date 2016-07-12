/* Remote Couriers
* Picks up energy from containers or remote harvesters in adjacent rooms and delivers to spawn.
*/

var Base = require('base');

class RemoteCourier extends Base {
	constructor(creep) {
		super(creep);
	}
}


RemoteCourier.prototype.performRole = function() {
	
	if (this.isFull()) {
		this.memory.task = "dropoff";
	} else if (this.isEmpty()) {
		this.memory.task = "pickup";
	}

	if (this.memory.task === "pickup") {
		this.performPickup();
	} else {
		this.performDropoff();
	}
}


RemoteCourier.prototype.isFull = function () {
	return _.sum(this.carry) === this.carryCapacity;
}

RemoteCourier.prototype.isEmpty = function () {
	return _.sum(this.carry) === 0;
}

RemoteCourier.prototype.flag = function() {
	return Game.flags[this.memory.flag];
}

RemoteCourier.prototype.performPickup = function() {
	if (this.room.name !== this.flag().pos.roomName) {
		this.moveTo(this.flag());
	} else {
		const target = this.room.getEnergySourcesThatNeedsStocked()[0];
		this.takeEnergyFrom(target);
	}
}

RemoteCourier.prototype.performDropoff = function() {
	if (this.room !== this.getSpawn().room) {
      	this.moveTo(this.getSpawn());
    } else { // We're in our spawn room.
		const energyStorage = this.room.getStructuresWithEnergyStorageSpace();
		const closestEnergyStorage = this.pos.findClosestByRange(energyStorage);

      	this.deliverEnergyTo(closestEnergyStorage);
    }
}

module.exports = RemoteCourier;