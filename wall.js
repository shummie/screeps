const REPAIR_TO = 1000000 // 1 million for now

StructureWall.prototype.work = function() {
	// Walls do nothing	
}

StructureWall.prototype.needsRepaired = function () {
	return this.hits < REPAIR_TO && this.hits / this.hitsMax < 0.9;
}

