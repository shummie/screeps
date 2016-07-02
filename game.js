
function getFlagsOfType(type) {
  return Game.flagArray().filter(flag => {
    return flag.name.toLowerCase().indexOf(type) !== -1;
  });
}


var scoutFlags;

const EnhancedGame = {};

EnhancedGame.myRooms = function() {
	return Game.roomArray().filter(room => room.getControllerOwned());
}

EnhancedGame.roomArray = function() {
	return Object.keys(Game.rooms).map(roomName => Game.rooms[roomName]);
}



module.exports = EnhancedGame;