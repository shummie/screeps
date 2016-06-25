var roleRefiller = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
		if(creep.carry.energy == 0) {
            creep.memory.refilling = false;
	    }
	    if(!creep.memory.refilling && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.refilling = true;
	    }
		
		if(creep.memory.refilling) {
	        var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    }
		
        else {
			var sources = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0);
				}
			});
			
			if (sources.length == 0) {
				var sources = creep.room.find(FIND_SOURCES);
				
				if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
				}
			}
			else {
				if (sources[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0]);
				}
			}
	    }
	}
};

module.exports = roleRefiller;