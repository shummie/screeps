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
    while (cost < availableEnergy && cost < 600) {
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

StructureSpawn.prototype.buildMineralHarvester = function(availableEnergy) {
	const sources = this.room.getMineralSites();
    
	if (sources) {
		const sourceId = sources.id;
		// TODO: Automate the building process. For now, let's keep it simple:
		//const body = [WORK,WORK,CARRY,MOVE,MOVE,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,WORK,CARRY,MOVE,CARRY,WORK,MOVE];
        // Base 300 energy gives [WORK,CARRY,CARRY,MOVE,MOVE], allowing for basic energy.
        // Afterwards, we give 1 move for every 2 work so that we can move at half speed to our target.
        // Then later, we add carry modules to prevent despawning of energy.
        const body = [WORK,CARRY,MOVE,CARRY,MOVE,WORK,WORK,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
		//const body = [WORK,WORK,CARRY,MOVE];

		// Each miner can empty a whole source by themselves.
		// H & O have twice the available minerals as the others.
		// Minerals Available = 70-140k & 140k-280k
		// Sources regenerate every 50,000 game ticks
		// Mining at a constant rate of 3-6 / tick will fully drain 1 source.
		// This can be accomplished with 1 miner with 3 work modules (assuming no travel time)

		var cost = calculateCosts(body);
		while (cost > availableEnergy) {
        	body.pop();
        cost = calculateCosts(body);
      	}

		console.log("Spawning a mineral harvester in Room " + this.room.name);
		this.createCreep(body, undefined, { role: 'mineralHarvester', source: sourceId });	
	}
}

StructureSpawn.prototype.buildRoadWorker = function(availableEnergy) {
	const body = [MOVE, WORK, WORK, CARRY];
	console.log("Spawning a road worker in Room " + this.room.name);
	this.createCreep(body, undefined, {role: 'roadWorker'});
}

StructureSpawn.prototype.buildRemoteHarvester = function(availableEnergy) {
	const target = this.room.getReserveFlagsNeedingRemoteHarvesters()[0];
	const body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                  WORK,WORK,WORK,WORK,WORK,CARRY,CARRY];
	console.log("Spawning a remote harvester in Room " + this.room.name);
	this.createCreep(body, undefined, {role: 'remoteHarvester', spawn: this.name, flag: target.name});	
}

StructureSpawn.prototype.buildRemoteCourier = function(availableEnergy) {
    const target = this.room.getReserveFlagsNeedingRemoteCouriers()[0];
    const body = []
    while (body.length < 20) {
        body.push(MOVE);
        body.push(CARRY);
    }   
    
    var cost = calculateCosts(body);
    while (cost > availableEnergy) {
        body.pop();
        body.pop();
        cost = calculateCosts(body);
    }

    console.log ("Spawning a remote courier in Room " + this.room.name);
    this.createCreep(body, undefined, {role: 'remoteCourier', spawn: this.name, flag: target.name});
}

StructureSpawn.prototype.buildWanderer = function(availableEnergy) {
    const body = [MOVE]
    console.log("Spawning a wanderer in Room " + this.room.name);
    this.createCreep(body, undefined, {role: 'wanderer'});
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
	const mailmanCount = this.room.mailmanCount();
	//const spawnBuilderCount = this.room.spawnBuilderCount();
    const availableEnergy = this.availableEnergy();

	if (availableEnergy >= 300 && availableEnergy < Math.max(this.maxEnergy()/2, 400)) {
		if (harvesterCount < 1) {
			this.buildHarvester(availableEnergy);
		//} else if (this.room.needsCouriers()) {
		} else if (courierCount < 1) {
        	this.buildCourier(availableEnergy)
        } else if (this.room.needsUpgraders()) {
			this.buildUpgrader(availableEnergy);
        } else if (this.room.needsRoadWorkers()) {
        	this.buildRoadWorker(availableEnergy);
        }
    } else if (availableEnergy >= Math.max(300, this.maxEnergy() / 2)) {
        if (this.room.needsHarvesters()) {
            this.buildHarvester(availableEnergy);
        } else if (courierCount < harvesterCount) {
            this.buildCourier(availableEnergy);
        } else if (this.room.needsUpgraders()) {
            this.buildUpgrader(availableEnergy);
        // } else if (this.room.mailmanCount() < 2 && this.maxEnergy() < 600) {
        } else if (this.room.mailmanCount() < 2) {
			this.buildMailman(availableEnergy);
		} else if (this.room.needsBuilders()) {
			this.buildBuilder(availableEnergy);
		} else if (this.room.hasExtractor() && this.room.mineralHarvesterCount() < 1) {
			this.buildMineralHarvester(availableEnergy);
		} else if (this.room.controller.ticksToDowngrade <= 3000) {
			// Something has gone wrong, make sure we upgrade this controller
			this.buildUpgrader(availableEnergy);
        } else if (this.room.needsRemoteHarvesters()) {
            this.buildRemoteHarvester(availableEnergy);
        } else if (this.room.needsRemoteCouriers()) {
            this.buildRemoteCourier(availableEnergy);
        }
        //} else if (this.room.needsWanderers()) {
        //    this.buildWanderer(availableEnergy);

	}
}

StructureSpawn.prototype.maxEnergy = function() {
	return this.room.energyCapacityAvailable;
}

StructureSpawn.prototype.availableEnergy = function() {
	return this.room.energyAvailable;
}