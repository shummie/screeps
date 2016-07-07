/*
import Extension from '../structures/Extension';
import Rampart from '../structures/Rampart';
*/
var Spawn = require('spawn');
var Tower = require('tower');
var Link = require('link');
var Wall = require('wall');

function convertStructures() {
    const normalStructures = [];
    Object.keys(Game.rooms).forEach(roomName => {
        const room = Game.rooms[roomName];
        Array.prototype.push.apply(normalStructures, room.find(FIND_STRUCTURES));
    });

    return normalStructures.map(structure => {
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