/* 
* A Wanderer randomly wanders from room to room to get it into the Game.rooms Array.
*/

var Base = require('base');

class Wanderer extends Base {
	constructor(creep) {
		super(creep);
	}
}

Wanderer.prototype.performRole = function () {
	const target = this.acquireTarget();
	const result = this.moveTo(target);
	if (result !== 0) {
		this.memory.targetExit = undefined;
	}
}

Wanderer.prototype.acquireTarget = function() {
	if (!this.memory.targetExit || this.memory.targetExit !== this.room.name) {
		// We're in a new room, attempt to reserve it
		// Code not implemented, for now, this is purposefully a manual process. Do we really want to reserve all neighboring rooms?
		//this.room.attemptReserve(); 
		const targetExit = [...this.room.getUniqueExitPoints()].sort(() => { // return a random exit.
        	return Math.floor(Math.random() * 3) - 1;
      	})[0];
      	this.memory.targetExit = {
        	room: this.room.name,
        	x: targetExit.x,
        	y: targetExit.y,
      	};
	}
	const targetExit = this.memory.targetExit;
	return new RoomPosition(targetExit.x, targetExit.y, targetExit.room);
}

module.exports = Wanderer;