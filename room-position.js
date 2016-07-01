// modifies room-position


RoomPosition.prototype.identifier = function() {
    return `${this.roomName}x${this.x}y${this.y}`;
}

RoomPosition.prototype.freeEdges = function () {
    if (!(Memory.freeEdges && Memory.freeEdges[this.identifier()])) {
    	Memory.freeEdges = Memory.freeEdges || {};
    	Memory.freeEdges[this.identifier()] = this.openPositionsAtRange().length;
    }
    return Memory.freeEdges[this.identifier()];
}

RoomPosition.prototype.openPositionsAtRange = function (range = 1) {
    return this.buildablePositionsAtRange(range).filter(position => {
    	return position.isOpen();
    });
}

RoomPosition.prototype.buildablePositionsAtRange = function (range = 1) {
    const room = Game.rooms[this.roomName];
    const openPositions = [];
    const top = Math.max(this.y - range, 0);
    const bottom = Math.min(this.y + range, 49);
    const left = Math.max(this.x - range, 0);
    const right = Math.min(this.x + range, 49);
    const surroundings = room.lookAtArea(left, top, right, bottom);
    Object.keys(surroundings).forEach(x => {
      Object.keys(surroundings[x]).forEach(y => {
        const pos = new RoomPosition(+x, +y, this.roomName); // The + is for string -> number
        if (pos.getRangeTo(this) === range && pos.isBuildable()) {
          openPositions.push(pos);
        }
      });
    });
    return openPositions;
}

RoomPosition.prototype.isOpen = function () {
    return this.isBuildable() && !this.hasStructure() && !this.hasConstructionSite();
}

RoomPosition.prototype.isBuildable = function () {
    const terrain = this.lookFor('terrain');
    return terrain === 'swamp' || terrain === 'plain';
}

RoomPosition.prototype.hasConstructionSite = function() {
    if (this._hasConstructionSiteCalced === undefined) {
      this._hasConstructionSiteCalced = true;
      this._hasConstructionSite = this.lookFor('constructionSite').length > 0;
    }
    return this._hasConstructionSite;
}

RoomPosition.prototype.hasStructure = function() {
    if (this._hasStructureCalced === undefined) {
      this._hasStructureCalced = true;
      this._hasStructure = this.lookFor('structure').filter(structure => {
        return structure.structureType !== STRUCTURE_ROAD;
      }).length > 0;
    }
    return this._hasStructure;
}