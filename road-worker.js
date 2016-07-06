/* RoadWorker
* Fixes roads
*/

var Base = require('base');

class RoadWorker extends Base {
	constructor(creep) {
		super(creep);
	}
}


RoadWorker.prototype.performRole = function() {

	if (this.carry.energy === 0) {
		const closestEnergySource = this.pos.findClosestByRange(this.room.getEnergyStockSources());
		if (closestEnergySource) {
			this.takeEnergyFrom(closestEnergySource);
		}
	} else {
		const roads = this.room.getRoads().filter(road => {
			return road.hits < road.hitsMax;
		});
		this.moveToAndRepair(road);
	}
}

module.exports = RoadWorker;