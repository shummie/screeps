require('room');
require('structure');
require('structure-manager');
require('creep-manager');

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
var profiler = require('screeps-profiler');

// This line monkey patches the global prototypes.
profiler.enable();

module.exports.loop = function () {

profiler.wrap(function() {

	Object.keys(Game.rooms).forEach(roomName => {
        Game.rooms[roomName].work();
      });
	
    var tower = Game.getObjectById('576f0e7aed1407e029423934');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        
        var target = tower.pos.findClosestByRange(Game.creeps, {
			filter: function(t)
			{
				return t.hits < t.hitsMax
			}
		});
		
		if(target)
		{
			tower.heal(target);
		}
        
    }


});

}
