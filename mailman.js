var Base = require('base');

class Mailman extends Base {
  constructor(creep) {
    super(creep); 
  }
}

Mailman.prototype.performRole = function() {
    if (this.carry.energy === 0) {
        this.memory.task = 'stock';
    } else if (this.carry.energy === this.carryCapacity) {
        this.memory.task = 'deliver';
    }

    if (this.memory.task === 'deliver') {
        const target = this.pos.findClosestByRange(this.room.myCreeps().filter(creep => {
            return creep.needsEnergyDelivered();
        }));
        if (target) {
            this.deliverEnergyTo(target);
        }
    } else {
        const closestEnergySource = this.pos.findClosestByRange(this.room.getStructuresWithEnergyPickup());
        if (closestEnergySource) {
            this.takeEnergyFrom(closestEnergySource);
        }
    }
}

module.exports = Mailman;