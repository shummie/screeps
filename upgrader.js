var Base = require('base');

class Upgrader extends Base {
    constructor(creep) {
        super(creep);
    }
}

Upgrader.prototype.performRole = function() {
	const empty = this.carry.energy === 0;
	if (!empty) {
		this.moveToAndUpgrade(this.room.controller);
	} else if (empty && this.room.getStructuresWithEnergyPickup().length) {
		const closestStruct = this.pos.findClosestByRange(this.room.getStructuresWithEnergyPickup());
		this.takeEnergyFrom(closestStruct);
	}	
}



module.exports = Upgrader;