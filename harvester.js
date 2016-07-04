var Base = require('base');

class Harvester extends Base {
    constructor(creep) {
        super(creep);
    }
}

Harvester.prototype.performRole = function() {
    if (this.carry.energy < this.carryCapacity || this.carry.energy === 0) {
        // If we are not at capacity, or we don't have any energy carried right now.
        // We were assigned a source when spawned, let's go there.
        const source = this.targetSource();
        this.moveToAndHarvest(source);
    } else if (this.room.courierCount() === 0 && this.getSpawn().availableEnergy() < 300) {
        // If we do not have any couriers to deliver energy for us, AND the spawn has room for more energy, let's deliver the energy ourselves.
        this.deliverEnergyTo(this.getSpawn());
    } else {
        // Otherwise, we either have couriers that can take energy from us, or the spawn already has 300 energy.
        //const storage = this.room.getStorage();
        const towers = this.room.getTowers().filter (tower => !tower.isFull());
        const closestTower = this.pos.findClosestByRange(towers);
        //const links = this.room.getLinks();
        //const closestLink = this.pos.findClosestByRange(links);
        const energyStorage = this.room.getStructuresWithEnergyStorageSpace();
        // energyStorage will find the closest Storage, Link, or Container.

        if (energyStorage) {
            // If we have somewhere to store the energy AND we are next to the storage, then drop it off.
            const energyStorageTarget = this.pos.findClosestByRange(energyStorage);
            const rangeToTarget = this.pos.getRangeTo(energyStorageTarget);
            if (rangeToTarget <= 2) {
                this.deliverEnergyTo(energyStorageTarget);
            }
            else {
                this.drop(RESOURCE_ENERGY);
            }
        } else {
            // We aren't next to any close energy storage locations, so just drop off the energy and let a courier pick it up.
            this.drop(RESOURCE_ENERGY);
        }
    }
}

module.exports = Harvester;
