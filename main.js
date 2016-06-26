var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleFixer = require('role.fixer');
var roleRefiller = require('role.refiller');

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

    if ()
    
	if (Game.spawns.Spawn1.room.energyAvailable >= 550) {
		if(miners.length < 3) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], undefined, {role: 'miner'});
			console.log('Spawning new miner: ' + newName);
		}
		else if(refillers.length < 3) {
			var newName = Game.spawns.Spawn1.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'refiller'});
			console.log('Spawning new refiller: ' + newName);
		}
		else if(upgraders.length < 5) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
			console.log('Spawning new upgrader: ' + newName);
		}
		else if(builders.length < 3) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
			console.log('Spawning new builder: ' + newName);
		}
		else if(fixers.length < 2) {
			var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'fixer'});
			console.log('Spawning new fixer: ' + newName);
		}
	}

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'refiller') {
            roleRefiller.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
		if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'fixer') {
            roleFixer.run(creep);
        }
    }

    
});

}
