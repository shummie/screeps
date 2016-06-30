module.exports = {
	roleExists: function(role) {
		try {
			require("roles_" + role);
			return true;
		} catch (e) {
			return false;
		}
	},

	getRole: function(role) {
		
	}


}