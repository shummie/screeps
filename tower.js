StructureTower.prototype.performRole = function() {
	if (this.room.hasHostileCreeps() && !this.isEmpty()) {
      this.attack(this.pos.findClosestByRange(this.room.getHostileCreeps()));
    }
}