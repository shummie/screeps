var Base = require('base');

// Harvester = {}; // Empty instance

class Harvester extends Base {
    constructor(creep) {
        super(creep);
    }
}

Harvester.prototype.performRole = function() {

    if (this.carry.energy < this.carryCapacity || this.carry.energy === 0) {
        const source = this.targetSource();
        this.moveToAndHarvest(source);
    }



    var sources = this.room.find(FIND_SOURCES);
      if (this.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sources[0], {reusePath: 10});
      }
}

module.exports = Harvester;