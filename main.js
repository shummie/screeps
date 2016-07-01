require('structure');
require('room');
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
	
});

}
