var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleFixer = require('role.fixer');
var roleRefiller = require('role.refiller');
var roleFarMiner = require('role.farMiner');

require('room');
require('base');

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
var profiler = require('screeps-profiler');

// This line monkey patches the global prototypes.
profiler.enable();

module.exports.loop = function () {

profiler.wrap(function() {

	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
	var fixers = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer');
	var refillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'refiller');

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var constructionSites = Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES);
    
    /*
	if (Game.spawns.Spawn1.room.energyAvailable >= 550) {
		if(miners.length < 1) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], undefined, {role: 'miner'});
			console.log('Spawning new miner: ' + newName);
		}
		else if(refillers.length < 2) {
			var newName = Game.spawns.Spawn1.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'refiller'});
			console.log('Spawning new refiller: ' + newName);
		}
		else if(miners.length < 3) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], undefined, {role: 'miner'});
			console.log('Spawning new miner: ' + newName);
		}
		else if(refillers.length < 4) {
			var newName = Game.spawns.Spawn1.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'refiller'});
			console.log('Spawning new refiller: ' + newName);
		}
		else if(upgraders.length < 5) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
			console.log('Spawning new upgrader: ' + newName);
		}
		else if(builders.length < 1 && constructionSites.length > 0) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
			console.log('Spawning new builder: ' + newName);
		}
		else if(fixers.length < 1) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'fixer'});
			console.log('Spawning new fixer: ' + newName);
		}
		else if(upgraders.length < 9) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
			console.log('Spawning new upgrader: ' + newName);
		}
	}*/

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'refiller' || creep.memory.role == "hauler") {
            roleRefiller.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
		if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'miner' || creep.memory.role == "harvester") {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'fixer') {
            roleFixer.run(creep);
        }
        if(creep.name == "FarMinerAlpha") {
        	roleFarMiner.run(creep);
        }
    }
    
    
    
    var tower = Game.getObjectById('576f0e7aed1407e029423934');
    if(tower) {
     
        

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        
        var target = tower.pos.findClosestByRange(Game.creeps, {
			filter: function(t)
			{
				return t.hits < t.hitsMax
			}
		});
		
		if(target)
		{
			tower.heal(target);
		}
        
    }
    
    var tower = Game.getObjectById('57749ad8c71a98f02faca782');
    if(tower) {
     
        

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        
        var target = tower.pos.findClosestByRange(Game.creeps, {
			filter: function(t)
			{
				return t.hits < t.hitsMax
			}
		});
		
		if(target)
		{
			tower.heal(target);
		}
        
    }


});

}
