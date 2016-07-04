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
        // We're out of energy, let's stock up (or we already know that)
		this.memory.target = null;
		this.memory.task = "stockup";

        // Look for energy that's dropped on the floor first (excluding the controller drop flag)
		if (this.room.droppedControllerEnergy()) {
        	this.takeEnergyFrom(this.room.droppedControllerEnergy());
		} else if (this.room.getStructuresWithEnergyPickup()) {
            // Otherwise, look for structures that we can pick up energy from.
            // This would be storages, containers, or links.
            // Go to the closest one.
			const closestStruct = this.pos.findClosestByRange(this.room.getStructuresWithEnergyPickup());
			if (closestStruct != null) {
				this.takeEnergyFrom(closestStruct);
			}
		}
	}

	if (this.memory.task === "work") {
		const constructionSites = this.room.getConstructionSites();
		if (constructionSites.length) {
            // There is at least one construction site, let's get to work on the closest one.
			const closestConstructionSite = this.pos.findClosestByRange(constructionSites);
			this.moveToAndBuild(closestConstructionSite);
		} else if (this.memory.target !== null) {
            // We have no construction sites available, but we have a repair target.
			const target = Game.getObjectById(this.memory.target);
			if (target === null) {
                // If for some reason the target is no longer valid, then reset the target
				this.memory.target = null;
			} else if (target.hits < target.hitsMax) {
                // If they need to be repaired, let's go
				this.moveToAndRepair(target);
			} else {
                // Target is at full forget the repair target
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
