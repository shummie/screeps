var creepManager = require('creep-manager');

const neutralStructures = [
	STRUCTURE_ROAD,
	STRUCTURE_CONTAINER,
];

Flag.prototype.work = function() {
	// Stuff here later.
	if (this.isReserveFlag()) {
		this.performReserveFlagRole();
	}
}

Flag.prototype.isReserveFlag = function() {
	return this.name.indexOf('reserve') === 0;
}

Flag.prototype.needsRemoteHarvesters = function() {
	const remoteHarvesters = creepManager.creepsWithRole('remoteHarvester').filter(creep => {
		return creep.memory.flag === this.name;
	});

	return remoteHarvesters.length < this.memory.sources.length;
}

Flag.prototype.performReserveFlagRole = function() {
	const rate = 5; // How many ticks in between updates
	if (Game.time % rate === 0) {
		const room = Game.roomArray().find(potentialRoom => potentialRoom.name === this.pos.roomName);

		if (room) {
			const reservation = room.controller.reservation;
			const reservationTime = reservation && reservation.ticksToEnd || 0;
			this.memory.reservationTime = reservationTime;
			this.memory.sources = room.getSources().map(source => source.id);
		}
	} else {
		this.memory.reservationTime = Math.max(this.memory.reservationTime - rate, 0);
	}

	if (this.reservationTime() >= 4999) {
		this.memory.needsReserver = false;
	} else if (this.reservationTime() < 500) {
		this.memory.needsReserver = true;
	}
}

Flag.prototype.reservationTime = function() {
	if (this.memory.resrvationTime === undefined) {
		this.memory.reservationTime = 0;
	}
	return this.memory.reservationTime;
}

Flag.prototype.needsReserver = function() {
	return this.isReserveFlag() && this.memory.needsReserver;
}