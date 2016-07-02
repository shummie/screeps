// This file contains stats information that can be called from the console

var findRoles = function(rolename) {
	return Game.creeps.filter((creep) => {return creep.memory.role === rolename;});
}
