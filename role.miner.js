var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
		if(creep.carry.energy == 0) {
			creep.memory.mining = true;
		}
		if (creep.memory.mining && creep.carry.energy == creep.carryCapacity) {
			creep.memory.mining = false;
		}
			
		if(creep.memory.mining) {
			var sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {reusePath: 10});
			}
		}
		else {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity);
				}
			});
			
			if (targets.length > 0) {
				target = creep.pos.findClosestByPath(targets)
				if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {reusePath: 10});
				}
			}
		}
	}
};

module.exports = roleMiner;