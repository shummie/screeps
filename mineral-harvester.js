/* Mineral Harvester
*  There is only 1 mineral deposit per room
*/

var Base = require('base');

class MineralHarvester extends Base {
    constructor(creep) {
        super(creep);
    }
}

MineralHarvester.prototype.performRole = function() {
	
	if (this._.sum(creep.carry) < this.carryCapacity || this._.sum(creep.carry) === 0) {
		const deposit = this.room.getMineralSites();
		this.moveToAndHarvest(deposit);
	} else {
		// We have full capacity.
		// We assume couriers exist.
		// But, if the storage is located nearby, let's just deliver it ourselves

		// For now, just deliver. we'll need to code up a mineralcourier.
		this.deliverMineralsTo(this.pos.getStorage());
		/*
		if (!this._storageRange) {
			this._storageRange = this.pos.getRangeTo(this.room.getStorage());
		}
		if (this._storageRange <= 4) {
			this.deliverMineralsTo(this.pos.getStorage());
		} else { // Drop everything off here, let a courier pick it up.
			for (var resourceType in this.carry) {
				this.drop(resourceType);
			}
		}
		*/
	}	
}

module.exports = MineralHarvester;