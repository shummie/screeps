var Base = require('base');

class Builder extends Base {
    constructor(creep) {
        super(creep);
    }
}

Builder.prototype.performRole = function() {
	if (this.carry.energy === this.carryCapacity) {
		this.memory.task = "work";
	} else if (this.carry.energy === 0 || this.memory.task === "stockup") {
		this.memory.target = null;
		this.memory.task = "stockup";
		
		if (this.room.getStructuresWithEnergyPickup()) {
			const closestStruct = this.pos.findClosestByRange(this.room.getStructuresWithEnergyPickup());
			this.takeEnergyFrom(closestStruct);
		}
	}
	
	if (this.memory.task === "work") {
		const constructionSites = this.room.getConstructionSites();
		if (constructionSites.length) {
			const closestConstructionSite = this.pos.findClosestByRange(constructionSites);
			this.moveToAndBuild(closestConstructionSite);
		} else if (this.memory.target !== null) {
			const target = Game.getObjectById(this.memory.target);
			if (target === null) {
				this.memory.target = null;
			} else if (target.hits < target.hitsMax) {
				this.moveToAndRepair(target);
			} else {
				this.memory.target = null;
			}
		} else {
			// Nothing to build & our target if we had one, is at full health
			// Find something to repair so we aren't idling around.
			const damagedStructures = this.room.getStructures().sort((structureA, structureB) => {
				return (structureA.hits / structureA.hitsMax) - (structureB.hits / structureB.hitsMax);
			});

			if (damagedStructures.length) {
				this.memory.target = damagedStructures[0].id;
			}
		}
	}
}

module.exports = Builder;