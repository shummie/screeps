module.exports = function(type, queued) {
	if (queued == undefined) {
		queued = false;
	}

	// Get the current room, then find all creeps in that room by their role

	// How do we actually get the room??? should that be a function call?
	var room = Game.getRoom('1-1');

	var count = room.find(FIND_MY_CREEPS, {
		filter: function(creep) {
			if (creep.memory.role == type) {
				return true;
			}
			return false;
		}
	}).length;

	if (queued) {
		var spawns = Game.spawns;

		for (var i in spawns) {
			var spawn = spawns[i];
			if (spawn.spawning !== null
				&& spawn.spawning !== undefined
				&& Memory.creeps[spawn.spawning.name].role == type) {
				count ++;
			}
		}

		count += Memory.spawnQueue.filter(function(queued) {
			return queued == type;
		}).length;
	}

	return count;

};