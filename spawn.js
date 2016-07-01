
var calculateCosts = function(bodyParts) {
    let cost = 0;
    bodyParts.forEach((bodyPart) => {
        const part = typeof bodyPart === 'string' ? bodyPart : bodyPart.type;
        cost += BODYPART_COST[part];
    });

    return cost;
}

StructureSpawn.prototype.buildHarvester = function(availableEnergy) {
	const sources = this.room.getSourcesNeedingHarvesters();
    const closestSource = this.pos.findClosestByRange(sources);

	if (closestSource) {
		const sourceId = closestSource.id;
		// TODO: Automate the building process. For now, let's keep it simple:
		const body = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE];
		
		this.createCreep(body, undefined, { role: 'harvester', source: sourceId });		
	}
}

StructureSpawn.prototype.buildHauler = function(availableEnergy) {
	const body = [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE];
	this.createCreep(body, undefined, { role: 'hauler' });
}

StructureSpawn.prototype.buildBuilder = function(availableEnergy) {
	const body = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
	this.createCreep(body, undefined, {role: 'builder'});
}

StructureSpawn.prototype.buildUpgrader = function(availableEnergy) {
	const body = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
	this.createCreep(body, undefined, {role: 'upgrader'});
}

StructureSpawn.prototype.work = function() {
	if (this.spawning) {
		// We're busy, don't do anything else.
		return;
	}
	// Else. we're idle, should we spawn something?
	const harvesterCount = this.room.harvesterCount();
	const haulerCount = this.room.haulerCount();
	const upgraderCount = this.room.upgraderCount();
	const builderCount = this.room.builderCount();
	const fixerCount = this.room.fixerCount();
    const availableEnergy = this.availableEnergy();
	
	if (availableEnergy >= 550) {
		if (harvesterCount < 1) {
			this.buildHarvester(availableEnergy);
		} else if (haulerCount < 1) {
			this.buildHauler(availableEnergy);
		} else if (harvesterCount < 2) {
			this.buildHarvester(availableEnergy);
		} else if (haulerCount < 3) {
			this.buildHauler(availableEnergy);
		} else if (upgraderCount < 4) {
			this.buildUpgrader(availableEnergy);
		} else if (buildersCount < 1 && this.room.getConstructionSites().length > 0) {
			this.buildBuilder(availableEnergy);
		} else if (fixers.length < 1) {
			this.buildFixer(availableEnergy);
		} else if (upgraderCount < 8) {
			this.buildUpgrader(availableEnergy);
		}
	}
}

StructureSpawn.prototype.maxEnergy = function() {
	return this.room.energyCapacityAvailable;
}

StructureSpawn.prototype.availableEnergy = function() {
	return this.room.energyAvailable;
}
