/* SpawnBuilder
*  Spawns when a room is detected with a spawn construction site
*  Will spawn 2 builders to help build
*/

// Spawns take 5,000 units of energy to create

var Base = require('base');

class SpawnBuilder extends Base {
	constructor(creep) {
		super(creep);	
	}
}

SpawnBuilder.prototype.performRole = function() {

	// First thing to do is collect energy
	if (this.carry.energy === 0) {
		this.memory.task = "refill";
	} else if (this.carry.energy == this.carryCapacity) {
		this.memory.task = "build";
	}

	if (this.memory.task === "refill") {
		// Go to the nearest STORAGE and refill. If we're lucky, we'll find some mailmen along the way to help
		if (this.memory.storage) {
			var target = Game.getObjectById(this.memory.storage)
		} else {
			storage = this.room.getStorage();
			this.memory.storage = storage.id;
		}
		this.takeEnergyFrom(target);
	} else if (this.memory.task === "build") {
		if (this.memory.target) {
			this.moveToAndBuild(Game.getObjectById(this.memory.target));
		} else {
			// acquire the construction site
			// First, get a list of all rooms that don't have a STRUCTURE_SPAWN in it
			var roomList = Game.roomArray().filter(hasSpawn => {return hasSpawn.energyAvailable === 0});
			// Get the construction site
			var spawnSite = roomList[0].getConstructionSites()[0];
			this.memory.target = spawnSite.id;
			this.moveToAndBuild(spawnSite);
		}
	}
}

module.exports = SpawnBuilder;