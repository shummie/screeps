StructureLink.prototype.isControllerLink = function() {
	// A link is designated as a controller link if it's within 4 tiles of a controller.
	return this.structureType === STRUCTURE_LINK && this.pos.getRangeTo(this.room.controller) < 5;
}

StructureLink.prototype.performRole = function() {
	// We want to transfer energy to the controller link
	const shouldTransfer = !this.isControllerLink() && !this.cooldown;
	const controllerLink = this.room.getControllerLink();
	const controllerLinkNeedsEnergy = controllerLink && controllerLink.energy < 100;

	if (shouldTransfer && controllerLinkNeedsEnergy) {
		this.transferEnergy(this.room.getControllerLink());
	}
}