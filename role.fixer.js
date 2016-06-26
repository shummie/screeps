var roleFixer = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
		if (creep.carry.energy == 0) {
			creep.memory.repairing = false;
		}
		if (creep.carry.energy == creep.carryCapacity && !creep.memory.repairing) {
			creep.memory.repairing = true;
		}
		
		if (creep.memory.repairing) {
			
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
		else {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0);
				}
			});
			
			if (targets.length > 0) {
				if(targets[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {reusePath: 10});
				}
			}
		}
	}
};

module.exports = roleFixer;