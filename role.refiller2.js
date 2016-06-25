var roleRefiller = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
		if(creep.carry.energy == 0) {
            creep.memory.refilling = false;
			creep.memory.path = null;
			creep.memory.target = null;
	    }
	    if(!creep.memory.refilling && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.refilling = true;
			creep.memory.path = null;
			creep.memory.target = null;
	    }
				
		if(creep.memory.refilling) {
			
			// We have a path, let's move.
			if (creep.memory.path) {
				if(creep.transfer(creep.memory.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveByPath(creep.memory.path);
				}
			}
			
			// Else, let's find a spawn/extension to move to.
			else {
				
				var targets = creep.room.find(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
						}
				});
				if(targets.length > 0) {
					
					// Store the path in memory
					creep.memory.path = creep.pos.findPathTo(targets[0]);
					creep.memory.target = targets[0];				
				}
			}
	    }
		
        else {
			
			// We have a path, let's move
			if (creep.memory.path) {
				if (creep.memory.target.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveByPath(creep.memory.path);
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
					creep.memory.path = creep.pos.findPathTo(sources[0]);
					creep.memory.target = sources[0];
				}
				else {
					// Change the below emergency flag to true if we need the refiller to harvest as well.
					var emergency = false;
					if (emergency) {
						var sources = creep.room.find(FIND_SOURCES);
						creep.memory.target = sources[0];
						creep.memory.path = creep.pos.findPathTo(sources[0]);
					}
				}
			}
	    }
	}
};

module.exports = roleRefiller;