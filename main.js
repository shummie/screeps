
require('creep-manager');
require('source');
require('room');
require('structure');
require('room-position');
require('structure-manager');
var enhancedGame = require('game');


// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
var profiler = require('screeps-profiler');

// This line monkey patches the global prototypes.
profiler.enable();

module.exports.loop = function () {

	profiler.wrap(function() {

	    for(var name in Memory.creeps) {
	        if(!Game.creeps[name]) {
	            delete Memory.creeps[name];
	        }
	    }

	    Object.assign(Game, enhancedGame);

		Object.keys(Game.rooms).forEach(roomName => {
	        Game.rooms[roomName].work();
	      });
		
	});

}
