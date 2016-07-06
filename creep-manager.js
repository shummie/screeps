var Builder = require('builder');
var Claimer = require('claimer');
var Courier = require('courier');
var Harvester = require('harvester');
var Mailman = require('mailman');
var MineralHarvester = require('mineral-harvester');
//import RemoteHarvester from '../roles/RemoteHarvester';
//import Reserver from '../roles/Reserver';
var RoadWorker = require('road-worker');
//import Scout from '../roles/Scout';
//import ScoutHarvester from '../roles/ScoutHarvester';
var SpawnBuilder = require('spawnbuilder');
var Upgrader = require('upgrader');
//import Wanderer from '../roles/Wanderer';

function enhanceCreep(creep) {
  switch(creep.memory.role) {
    case 'harvester':
        creep.memory.role = "harvester";
		return new Harvester(creep);
	case 'builder':
        creep.memory.role = 'builder';
		return new Builder(creep);
	case 'upgrader':
		return new Upgrader(creep);
    case 'courier':
        return new Courier(creep);
    case 'mailman':
        return new Mailman(creep);
    case 'claimer':
        return new Claimer(creep);
    case 'spawnBuilder':
        return new SpawnBuilder(creep);
    case 'mineralHarvester':
        return new MineralHarvester(creep);
    case 'roadWorker':
        return new RoadWorker(creep);
    }
}

function convertCreeps() {
    return Object.keys(Game.creeps).map(creepName => {
        const creep = Game.creeps[creepName];
        return enhanceCreep(creep);
    });
}

class CreepManager {
    creeps() {
        return convertCreeps();
    }

    creepsWithRole(role) {
        return this.creeps().filter(creep => creep.memory.role === role);
    }

    // Occasionally we find a creep that is not enhanced... so we enhance it.
    enhanceCreep(creep) {
        return enhanceCreep(creep);
    }
}

const creepManager = new CreepManager();
module.exports = creepManager;
