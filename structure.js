// structure enhancements

Structure.prototype.work = function() {
	if (this.performRole) {
		this.performRole();
	}
	if (Game.time % 100 === 0) {
		// Build roads to/from this structure. For now, let's ignore this and come back to it.
		//this.buildAccessRoads();
	}
}

Structure.prototype.isControllerLink = function() {
	return this.structureType === STRUCTURE_LINK && this.pos.getRangeTo(this.room.controller) < 5;
}

Structure.prototype.isFull = function() {
	if (this.energyCapacity) {
		return this.energy === this.energyCapacity;
	} else if (this.storeCapacity) {
		return _.sum(this.store) === this.storeCapacity;
	}
	return true;
}

Structure.prototype.needsRepair = function() {
	return this.hits < this.hitsMax;
}

Structure.prototype.isEmpty = function() {
	if (this.energyCapacity) {
		return this.energy === 0;
	} else if (this.storeCapacity) {
		return _.sum(this.store) === 0;
	}
	return true;
}