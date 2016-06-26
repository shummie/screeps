var roleRefiller = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	// Creep.memory.state can have the following options for a refiller:
    	// gettingEnergy -- triggers when energy = 0
    	// refillingStructure -- triggers when energy is full

    	if (!creep.memory.state) {
    		// Set the initial state if it doesn't exist
    		creep.memory.state = "gettingEnergy";
    		creep.memory.target = null;
    	}
		
		if(creep.carry.energy == 0 && creep.memory.state != "gettingEnergy") {
            creep.memory.state = "gettingEnergy" // Set the new state
			creep.memory.target = null;
	    }
	    else if(creep.memory.state != "refillingStructure" && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.state = "refillingStructure";
			creep.memory.target = null;
	    }
				
		if(creep.memory.state == "refillingStructure") {
			
			// We have a path, let's move.
			if (creep.memory.target) {
				if(creep.transfer(creep.memory.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.getObjectById(creep.memory.target.id), {reusePath: 10});
				}
			}
			// Else, let's find a spawn/extension to move to.
			else {
				
				var targets = creep.room.find(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
						}
				});
				if(targets.length > 0) {
					// Store the target in memory
					creep.memory.target = targets[0];				
				}
			}
	    }
		
        else if (creep.memory.state == "gettingEnergy") {
			
			// We have a path, let's move
			if (creep.memory.target) {
				if (Game.getObjectById(creep.memory.target.id).transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.getObjectById(creep.memory.target.id), {reusePath: 10});
				}
			}
			
			// Let's find a path to a container with energy
			else {
				var sources = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0);
					}
				});	
				if (sources.length > 0) {
					creep.memory.target = sources[0];
				}
				else {
					// Change the below emergency flag to true if we need the refiller to harvest as well.
					var emergency = false;
					if (emergency) {
						var sources = creep.room.find(FIND_SOURCES);
						creep.memory.target = sources[0];
					}
				}
			}
	    }
	}
};

module.exports = roleRefiller;