// modifies source

Source.prototype.needsHarvesters = function() {
    const harvesters = this.room.myCreeps();
    let myHarvesters = 0;
    let workParts = 0;
    harvesters.forEach(harvester => {
    	if (harvester.memory.source === this.id) {
        	myHarvesters++;
        	workParts = workParts + harvester.body.filter(bodyPart => {
          		return bodyPart.type === 'work';
        	}).length;
      	}
    });

    return workParts < 5 && myHarvesters < this.freeEdges();
}

Source.prototype.freeEdges = function() {
    return this.pos.freeEdges();
}