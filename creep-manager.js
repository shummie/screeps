//import Builder from '../roles/Builder';
//import Claimer from '../roles/Claimer';
//import Courier from '../roles/Courier';
var Harvester = require('harvester');
//import Harvester from 'harvester';
//import Mailman from '../roles/Mailman';
//import RemoteHarvester from '../roles/RemoteHarvester';
//import Reserver from '../roles/Reserver';
//import RoadWorker from '../roles/RoadWorker';
//import Scout from '../roles/Scout';
//import ScoutHarvester from '../roles/ScoutHarvester';
//import Upgrader from '../roles/Upgrader';
//import Wanderer from '../roles/Wanderer';

/*
const roleMap = {
//  builder: Builder,
//  claimer: Claimer,
//  courier: Courier,
    harvester: Harvester,
//  mailman: Mailman,
//  remoteharvester: RemoteHarvester,
//  reserver: Reserver,
//  roadworker: RoadWorker,
//  scout: Scout,
//  scoutharvester: ScoutHarvester,
//  upgrader: Upgrader,
//  wanderer: Wanderer,
};
*/


function enhanceCreep(creep) {
  switch(creep.memory.role) {
    case 'harvester':
      return new Harvester(creep);
  }
  //return new roleMap[creep.memory.role](creep);
  //  return new Harvester(creep);
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
