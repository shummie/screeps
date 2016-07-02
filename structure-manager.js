/*
import Extension from '../structures/Extension';
import Link from '../structures/Link';
import Spawn from '../structures/Spawn';
import Tower from '../structures/Tower';
import Wall from '../structures/Wall';
import Rampart from '../structures/Rampart';
*/
var Spawn = require('spawn');
var Tower = require('tower');

/*
const structureMap = {
  [STRUCTURE_EXTENSION]: Extension,
  [STRUCTURE_LINK]: Link,
  [STRUCTURE_RAMPART]: Rampart,
  [STRUCTURE_SPAWN]: Spawn,
  [STRUCTURE_TOWER]: Tower,
  [STRUCTURE_WALL]: Wall,
};
*/

function convertStructures() {
  const normalStructures = [];
  Object.keys(Game.rooms).forEach(roomName => {
    const room = Game.rooms[roomName];
    Array.prototype.push.apply(normalStructures, room.find(FIND_STRUCTURES));
  });

  return normalStructures.map(structure => {
    // Not sure if this will work, so need to TEST it.
    switch(structure.structureType) {
        //case STRUCTURE_SPAWN:
        //    return new Spawn(structure.id);
        default: 
            return structure;
    }    
  });
}

class StructureManager {
  structures() {
    return convertStructures();
  }
}

const structureManager = new StructureManager();
module.exports = structureManager;