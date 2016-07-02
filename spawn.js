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
		const body = [WORK,WORK,CARRY,MOVE,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,WORK,CARRY,MOVE,CARRY,WORK,MOVE];
		//const body = [WORK,WORK,CARRY,MOVE];

		// Each miner can empty a whole source by themselves.
		// Energy Available = 4500 in center rooms, 3000 in owned/reserved room, 1500 in unreserved rooms
		// Sources regenerate every 300 game ticks
		// Mining at a constant rate of 10 / tick will fully drain 1 source.
		// This can be accomplished with 1 miner with 5 work modules (assuming no travel time)

		cost = calculateCosts(body);
		while (cost > availableEnergy) {
        	body.pop();
        cost = calculateCosts(body);
      	}
		
		this.createCreep(body, undefined, { role: 'harvester', source: sourceId });		
	}
}

StructureSpawn.prototype.buildHauler = function(availableEnergy) {
	const body = [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE];
	//const body = [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE];
	this.createCreep(body, undefined, { role: 'hauler' });
}

StructureSpawn.prototype.buildBuilder = function(availableEnergy) {
	const body = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
	//const body = [WORK,CARRY,CARRY,MOVE,MOVE];
	this.createCreep(body, undefined, {role: 'builder'});
}

StructureSpawn.prototype.buildUpgrader = function(availableEnergy) {
	const body = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
	//const body = [WORK,CARRY,CARRY,MOVE,MOVE];
	this.createCreep(body, undefined, {role: 'upgrader'});
}

StructureSpawn.prototype.buildMinerHelper = function(availableEnergy) {
	const body = [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE];
	this.createCreep(body, undefined, {role: 'minerHelper'});
}

StructureSpawn.prototype.buildCourier = function(availableEnergy) {
    const body = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
    var cost = calculateCosts(body);
    
    while (cost > availableEnergy) {
      body.pop();
      cost = calculateCosts(body);
    }

    this.createCreep(body, undefined, { role: 'courier' });
  }


StructureSpawn.prototype.work = function() {
	if (this.spawning) {
		// We're busy, don't do anything else.
		return;
	}
	// Else. we're idle, should we spawn something?
	const harvesterCount = this.room.harvesterCount();
	const courierCount = this.room.courierCount();
	const haulerCount = this.room.haulerCount();
	const upgraderCount = this.room.upgraderCount();
	const builderCount = this.room.builderCount();
	const minerHelperCount = this.room.minerHelperCount();
	//const fixerCount = this.room.fixerCount();
    const availableEnergy = this.availableEnergy();
	
	if (availableEnergy >= 550) {
		if (harvesterCount < 1) {
			this.buildHarvester(availableEnergy);
		} else if (this.room.needsCouriers()) {
        	this.buildCourier(availableEnergy)
        } else if (haulerCount < 1) {
			this.buildHauler(availableEnergy);
		} else if (minerHelperCount < harvesterCount) {
			this.buildMinerHelper(availableEnergy);		
		} else if (this.room.needsHarvesters()) {
			this.buildHarvester(availableEnergy);
		} else if (haulerCount < 3) {
			this.buildHauler(availableEnergy);
		} else if (upgraderCount < 4) {
			this.buildUpgrader(availableEnergy);
		} else if (builderCount < 1 && this.room.getConstructionSites().length > 0) {
			this.buildBuilder(availableEnergy);
		/*} else if (fixers.length < 1) {
			this.buildFixer(availableEnergy);*/
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