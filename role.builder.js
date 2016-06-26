var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {reusePath: 10});
                }
            }
			else {
				var damagedStructures = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => structure.hits < structure.hitsMax
				});
				
				damagedStructures.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
				
				if (damagedStructures) {
					if (creep.repair(damagedStructures[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(damagedStructures[0], {reusePath: 10});
					}
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
				/*
				var sources = creep.room.find(FIND_SOURCES);
				
				if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
				}
				*/
			}
			else {
				if (sources[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], {reusePath: 10});
				}
			}
	    }
	}
};

module.exports = roleBuilder;