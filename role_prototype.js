var proto = {
	
	/** The creep for this role
	*
	* @type creep
	*
	*/
	creep: null;

	/** Set the creep for this role
	* 
	* @param {Creep} creep
	*
	*/
	setCreep: function(creep) {
		this.creep = creep;
		return this;
	},

	run: function() {
		if (this.creep.memory.onSpawned == undefined) {
			this.onSpawn();
			this.creep.memory.onSpawned = true;
		}	
		this.action(this.creep);

		if (this.creep.ticksToLive == 1) {
			this.beforeAge();
		}
	},

	action: function() {},

	onSpawn: function() {},

	onSpawnStart: function() {},

	beforeAge(): function() {},


}