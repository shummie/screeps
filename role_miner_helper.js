/** 
* A miner helper does the other half of the mining operation. The miner mines energy from the source and then drops it to the ground.
* The helper then picks it up and transports it to the nearest available thing.
**/

var helper = {
	parts: [
			[MOVE, CARRY, MOVE, CARRY],
			[MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
	],

	assignMiner: function() {
		var creep = this.creep;

		var miner = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
			filter: function(miner) {
				if (miner.memory.role == "miner" && miner.memory.helpers.length < miner.memory.helpersNeeded) {
					return true;
				}
				return false;
			}
		});

		if (miner == undefined) {
			// no free miners 
			return;
		}

		creep.memory.miner = miner.id;
		miner.memory.helpers.push(creep.id);

	},

	/** 
	* TODO: Make helpers smarter about avoiding miners, instead of just waiting until they're 5 tiles away 
	* TODO: When spawns are at 0.25, and extensions have >= 200, help builders before filling stuff up
	**/

	action: function() {
		var creep = this.creep;

		if (creep.memory.courier !== undefined && creep.memory.courier == true) {
			creep.memory.courier = false;
			return;
		}

		// If this helper isn't assigned to a miner, find one and assign him to it. If it is assigned to one, find that miner
		if (creep.memory.miner == undefined) {
			this.assignMiner();
		}

		var miner = Game.getObjectById(creep.memory.miner);

		if (miner == null) {
			creep.suicide();	// Seems a bit extreme...
			return;
		}

		if (creep.energy < creep.energyCapacity) {
			if (creep.pos.isNearTo(miner)) {
				var energy = creep.pos.findInRange(Game.DROPPED_ENERGY, 1)[0];
				creep.pickup(energy);
			}
			else {
				if (miner.memory.isNearSource) {
					// only start moving towards the miner when they're near the source.
					creep.moveTo(miner);
				}
			}
		}

		var target = null;

		// The below code is to drop off the energy after picking it up

		if (!target) {
			var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);

			// If we found the spawn, set it as target
			if (spawn) {
				target = spawn;
			}
		}

		// Let's get the direction we want to go in
		var targetDirection = creep.pos.findPathTo(target, {ignoreCreeps: true})[0].direction;

		// Look for a courier in that direction. We'll check to make sure they're the right role, if they can hold energy, and if in range & in the same direction
		var leftDir = targetDirection - 1;
		var rightDir = targetDirection + 1;

		if (leftDir < 1) {
			leftDir += 8;
		}
		if (leftDir > 8) {
			leftDir -= 8 ;
		}
		if (rightDir < 1) {
			rightDir += 8;
		}
		if (rightDir > 8) {
			rightDir -= 8;
		}


		var courier = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
			filter: function (possibleTarget) {
				return (
						possibleTarget.memory.role == creep.memory.role
						&& possibleTarget.energy < possibleTarget.energyCapacity
						&& creep.pos.inRangeTo(possibleTarget, 1)
						&& (
						creep.pos.getDirectionTo(possibleTarget) == targetDirection
						|| creep.pos.getDirectionTo(possibleTarget) == leftDir
						|| creep.pos.getDirectionTo(possibleTarget) == rightDir
						)
					);
			}
		});

		// If we found a courier, let's make that our new target
		if (courier !== null && !creep.pos.isNearTo(target)) {
			target = courier;
			target.memory.courier = true;
		}

		// If we're near the target, give it the energy or drop it.
		if (creep.pos.isNearTo(target)) {
			if (target.energy < target.energyCapacity) {
				creep.transferEnergy(target);
			} else {
				creep.dropEnergy();
			}
		}
		else {	// Let's move finally
			creep.moveTo(target);
		}
	}
}

module.exports = helper;