/* RemoteHarvesters
*/

var Base = require('base');

class RemoteHarvester extends Base{
	constructor(creep) {
		super(creep);
	}
}

RemoteHarvester.prototype.performRole = function () {
	// The source we are trying to harvest is stored as a flag on the map and then in this creep's memory.
	const flag = Game.flags[this.memory.flag];
	const targetRoomName = flag.pos.roomName;
	
	if (this.room.name !== targetRoomName) {
		// Let's move to the right room
		this.moveTo(flag);
	} else {
		// We're in the room, let's go to the source.
		if (!this.memory.source) {
			// We don't have a source yet, so let's get one.
			this.acquireTarget();
		}
		if (!this.isFull()) {
			this.moveToAndHarvest(this.targetSource());
		} else {
			this.handleFull();
		}
	}
}

RemoteHarvester.prototype.handleFull = function() {
	const inRange = thing => this.pos.getRangeTo(thing) < 4;
	const constructionSites = this.room.getConstructionSites().filter(inRange);
	const container = this.room.getContainers().find(inRange);

	if (constructionSites.length) {
		this.moveToAndBuild(constructionSites[0]);
	} else if (container) {
		if (container.needsRepaired()) {
			this.moveToAndRepair(container); // repair if needed
		} else {
			this.deliverEnergy(container);
		}
	} else {
		// no container in range, let's build one
		const buildPosition = this.pos.buildablePositionsAtRange(1)[0];
		this.room.placeContainerFlag(buildPosition);
	}
}

RemoteHarvester.prototype.isFull = function() {
	return !(this.carry.energy < this.carryCapacity || this.carry.energy === 0)
}

RemoteHarvester.prototype.acquireTarget = function() {
	// As a reminder, the room searches through the memory of all the creeps in the room.
	// only harvesters have memory.source stored so it cycles through all of them.
	this.memory.source = this.room.getSourcesNeedingHarvesters()[0].id;
}

module.exports = RemoteHarvester;