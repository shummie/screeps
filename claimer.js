var Base = require('base');

class Claimer extends Base {
	constructor(creep) {
		super(creep);	
	}
}

Claimer.prototype.performRole = function() {
	if (!this.room.getControllerOwned()) {
		this.moveToAndClaimController(this.room.controller);
	}
}

Claimer.prototype.moveToAndClaimController = function(controller) {
	if (this.pos.getRangeTo(controller) > 1) {
		// move until next to the controller
		this.moveTo(controller, {reusePath: 10});
	} else {
		if (this.claimController(controller) === 0) {
			const claimFlag = Game.claimFlags().filter(flag => {
				return flag.pos.getRangeTo(controller) === 0;
			})[0];
		}
	}
}



module.exports = Claimer;