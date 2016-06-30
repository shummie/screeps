/** 
* A miner finds a source then stays near it. The miner's job is to mine and let the energy fall to the ground.
* A miner_helper is assigned to the miner to pick up dropped energy. Energy does decay, so this might not be an optimal solution
**/

var miner = {
	parts: [
			[MOVE, WORK, WORK, WORK, WORK, WORK],
			[MOVE, WORK, WORK, WORK, WORK, WORK, WORK]
	],


	getOpenSource: function() {
		var creep = this.creep;

		// Tries to find the nearest source by linear distance. Use findClosestByPath if CPU isn't a concern.
		var source = creep.pos.findClosestByRange(Game.SOURCES, {
			filter: function(source) {
				// Filters available sources to those that are unassigned to the current miner, OR the one assigned to the current miner
				if (Memory.sources[source.id] == undefined || Memory.sources[source.id].miner == undefined || Memory.sources[source.id].miner == creep.id) {
					return true;
				}
				if (Game.getObjectById(Memory.sources[source.id].miner) == null) {
					return true;
				}
				return false;
			}
		});
	},

	setSourceToMine: function(source) {
		var creep = this.creep;

		if (!source) {
			return;
		}

		if (Memory.sources[source.id] == undefined) {
			Memory.sources[source.id] = {id: source.id};	// Store the id of the source
		}

		Memory.sources[source.id].miner = creep.id;	// store the creep.id assigned to this source
		creep.memory.source = source.id;	// store the source.id assigned to this miner

		var helperSpawn = source.pos.findClosestByRange(FIND_MY_SPAWNS);	// Finds the closest spawn to this miner
		var steps = helperSpawn.pos.findPathTo(source).length * 2;	// Calculates the distance to the spawn point and multiplies by 2 to get distance back and forth
		var creepsNeeded = Math.round(steps*8/100);	// Not sure why it's multiplying steps by 8 and dividing by 100 yet...

		var maxHelpers = 5;
		if (creepsNeeded > maxHelpers) {
			creepsNeeded = maxHelpers;	// Caps the # of helpers for each miner.
		}

		for (var i = 0; i < creepsNeeded; i++) {
			Memory.spawnQueue.unshift({type: 'miner_helper', memory: {
				miner: creep.id
			}});
		}

		creep.memory.helpersNeeded = creepsNeeded;

	},

	onSpawn: function() {
		var creep = this.creep;

		creep.memory.isNearSource = false;
		creep.memory.helpers = [];

		var source = this.getOpenSource();
		this.setSourceToMine(source);

		creep.memory.onCreated = true;
	},

	action: function () {
		var creep = this.creep;

		// Each miner can empty a whole source by themselves.
		// Energy Available = 4500 in center rooms, 3000 in owned/reserved room, 1500 in unreserved rooms
		// Sources regenerate every 300 game ticks
		// Mining at a constant rate of 10 / tick will fully drain 1 source.
		// This can be accomplished with 1 miner with 5 work modules (assuming no travel time)
		// Since they're slow, we assign 1 miner to 1 source and they stay there

		var source = Game.getObjectById(creep.memory.source);

		if (source == null) {
			var source = this.getOpenSource();

			if (!source) {
				return;
			}
			this.setSourceToMine(source);
		}

		// When the miner is near the source, then the helpers will start moving towards it.
		if (creep.pos.inRangeTo(source, 5)) {
			creep.memory.isNearSource = true;
		} else {
			creep.memory.isNearSource = false;
		}

		if (Memory.sources[source.id] == undefined) {
			Memory.sources[source.id] = { id: source.id };
		}

		Memory.sources[source.id].miner = creep.id;

		// Attempts to harvest the source. If not in range, then move towards it
		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source, {reusePath: 5});
		}
	}
};

module.exports = miner;