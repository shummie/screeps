var roleFarMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	sourceID = "576a9c4e57110ab231d88d73";
    	source = Game.GetObjectById(sourceID);
		
		if(creep.carry.energy == 0) {
			creep.memory.mining = true;
		}
		if (creep.memory.mining && creep.carry.energy == creep.carryCapacity) {
			creep.memory.mining = false;
		}
			
		if(creep.memory.mining) {
			if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {reusePath: 10});
			}
		}

		else {
			containerID = "576df13646d6c2cf7ff0e1fe";
			container = Game.GetObjectById(containerID);

			if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(container, {reusePath: 10});
			}
		}
	}
};

module.exports = roleFarMiner;