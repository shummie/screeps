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
    } else if (this.room.haulerCount() === 0 && this.getSpawn().availableEnergy() < 300) {
        this.deliverEnergyTo(this.getSpawn());
    } else {
        const storage = this.room.getStorage();
        const towers = this.room.getTowers().filter (tower => !tower.isFull());
        const closestTower = this.pos.findClosestByRange(towers);
        const links = this.room.getLinks();
        const closestLink = this.pos.findClosestByRange(links);
        const rangeToStorage = storage ? this.pos.getRangeTo(storage) : 100;
        const containers = this.room.getContainers().filter (container => !container.isFull());
        const closestContainer = this.pos.findClosestByRange(containers);

        // For now, just deliver to the closest container
        if (closestContainer) {
            this.deliverEnergyTo(closestContainer);
        } else if (storage) {
            this.deliverEnergyTo(storage);
        } else {
            this.drop(RESOURCE_ENERGY);
        }
    }
}

module.exports = Harvester;