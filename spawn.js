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
		//const body = [WORK,WORK,CARRY,MOVE,MOVE,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,WORK,CARRY,MOVE,CARRY,WORK,MOVE];
        // Base 300 energy gives [WORK,CARRY,CARRY,MOVE,MOVE], allowing for basic energy.
        // Afterwards, we give 1 move for every 2 work so that we can move at half speed to our target.
        // Then later, we add carry modules to prevent despawning of energy.
        const body = [WORK,CARRY,MOVE,CARRY,MOVE,WORK,WORK,WORK,MOVE,WORK,WORK,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
		//const body = [WORK,WORK,CARRY,MOVE];

		// Each miner can empty a whole source by themselves.
		// Energy Available = 4500 in center rooms, 3000 in owned/reserved room, 1500 in unreserved rooms
		// Sources regenerate every 300 game ticks
		// Mining at a constant rate of 10 / tick will fully drain 1 source.
		// This can be accomplished with 1 miner with 5 work modules (assuming no travel time)

		var cost = calculateCosts(body);
		while (cost > availableEnergy) {
        	body.pop();
        cost = calculateCosts(body);
      	}

		console.log("Spawning a harvester in Room " + this.room.name);
		this.createCreep(body, undefined, { role: 'harvester', source: sourceId });
	}
}

StructureSpawn.prototype.buildBuilder = function(availableEnergy) {
    const body = [MOVE,MOVE,WORK,CARRY];
	//const body = [WORK,WORK,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,MOVE,MOVE];
    let cost = calculateCosts(body);

    while (cost < availableEnergy) {
        body.push(MOVE);
        body.push(CARRY);
        body.push(WORK);
        cost += 200;
    }
	while (cost > availableEnergy || body.length > 50) {
    	body.pop();
        cost = calculateCosts(body);     // We're only popping off move or carries.
  	}
	console.log("Spawning a builder in Room " + this.room.name);
	this.createCreep(body, undefined, {role: 'builder'});
}

StructureSpawn.prototype.buildUpgrader = function(availableEnergy) {

    const body = [MOVE, WORK, WORK, CARRY];
    let workParts = 2;
    let cost = calculateCosts(body);
    let workPartsNeeded = this.room.maxEnergyProducedPerTick() - this.room.upgraderWorkParts();
    if (this.room.controller.level === 8) {
        workPartsNeeded = Math.min(15, workPartsNeeded);
    }
    if (this.room.controller.pos.freeEdges() > 1) {
        workPartsNeeded = Math.min(workPartsNeeded, this.room.maxEnergyProducedPerTick() / 2);
    }
    while (cost < availableEnergy && workParts < workPartsNeeded) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
        workParts++;
        cost = calculateCosts(body);
    }
    while (cost > availableEnergy) {
        body.pop();
        cost = calculateCosts(body);
    }

    console.log("Spawning an upgrader in Room " + this.room.name);
    this.createCreep(body, undefined, { role: 'upgrader' });
}

StructureSpawn.prototype.buildMinerHelper = function(availableEnergy) {
	const body = [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE];
	console.log("Spawning a minerHelper in Room " + this.room.name);
	this.createCreep(body, undefined, {role: 'minerHelper'});
}

StructureSpawn.prototype.buildCourier = function(availableEnergy) {
    const body = [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY];
	const maxCarryParts = this.room.getStorage() && this.room.getLinks().length > 1 ? 10 : 100;
    // if we have a storage, and we have a link, then we want 10 max carry parts, otherwise, cap at 100
    let carryParts = 3;
    let cost = calculateCosts(body);
    while (cost < availableEnergy && carryParts < maxCarryParts) {
        body.push(MOVE);
        body.push(CARRY);
        carryParts++;
        cost += 100;
    }
	while (cost > availableEnergy) {
    	body.pop();
        cost -= 50;     // We're only popping off move or carries.
  	}
    console.log("Spawning a courier in Room " + this.room.name);
    this.createCreep(body, undefined, { role: 'courier' });
}

StructureSpawn.prototype.buildMailman = function(availableEnergy) {
    const body = [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY];
    //const body = [MOVE, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
    let cost = calculateCosts(body);
    while (cost < availableEnergy) {
        body.push(MOVE);
        body.push(CARRY);
        cost += 100;
    }

    while (cost > availableEnergy) {
      body.pop();
      cost = calculateCosts(body);
    }

    console.log("Spawning a mailman in Room " + this.room.name);
    this.createCreep(body, undefined, { role: 'mailman' });
}

StructureSpawn.prototype.buildClaimer = function(availableEnergy) {
  	const body = [MOVE,CLAIM];
  	console.log("Spawning a claimer in Room " + this.room.name)
  	this.createCreep(body, "Claimer", {role:'claimer'});
}

StructureSpawn.prototype.buildSpawnBuilder = function(availableEnergy) {
	const body = [WORK,WORK,MOVE,MOVE,MOVE,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE];
	var cost = calculateCosts(body);
	while (cost > availableEnergy) {
      body.pop();
      cost = calculateCosts(body);
    }

    console.log("Spawning a spawnBuilder in Room " + this.room.name);
    this.createCreep(body, undefined, { role: 'spawnBuilder' });
}

StructureSpawn.prototype.work = function() {
	if (this.spawning) {
		// We're busy, don't do anything else.
		return;
	}
	// Else. we're idle, should we spawn something?
	const harvesterCount = this.room.harvesterCount();
	const claimerCount = this.room.claimerCount();
	const courierCount = this.room.courierCount();
	const upgraderCount = this.room.upgraderCount();
	const builderCount = this.room.builderCount();
	//const minerHelperCount = this.room.minerHelperCount();
	const mailmanCount = this.room.mailmanCount();
	//const spawnBuilderCount = this.room.spawnBuilderCount();
	//const fixerCount = this.room.fixerCount();
    const availableEnergy = this.availableEnergy();

	if (availableEnergy >= 300 && availableEnergy < this.maxEnergy()) {
		if (harvesterCount < 1) {
			this.buildHarvester(availableEnergy);
		//} else if (this.room.needsCouriers()) {
		} else if (courierCount < 1) {
        	this.buildCourier(availableEnergy)
        } else if (this.room.needsUpgraders()) {
			this.buildUpgrader(availableEnergy);
        }
    } else if (availableEnergy >= Math.max(300, this.maxEnergy() / 2)) {
        if (this.room.needsHarvesters()) {
            this.buildHarvester(availableEnergy);
        } else if (courierCount < 2*harvesterCount) {
            this.buildCourier(availableEnergy);
        } else if (this.room.needsUpgraders()) {
            this.buildUpgrader(availableEnergy);
        // } else if (this.room.mailmanCount() < 2 && this.maxEnergy() < 600) {
        } else if (this.room.mailmanCount() < 2) {
			this.buildMailman(availableEnergy);
		//} else if (builderCount < 2 && this.room.getConstructionSites().length > 0) {
		} else if (builderCount < 2) {
			this.buildBuilder(availableEnergy);
		} else if (this.room.controller.ticksToDowngrade <= 3000) {
			// Something has gone wrong, make sure we upgrade this controller
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
