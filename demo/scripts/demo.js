$(document).ready(function(){
	// DEFINE CUSTOM SETTINGS OR LET AN EMPTY
	// OBJECT FOR DEFAULTS
	var neutrinoSettings = {
		hasArrows: true
	};

	// CREATE A NEW NEUTRINO OBJECT
	var neutrino = Neutrino();

	// INITIALIZE NEUTRINO
	neutrino.init(neutrinoSettings);
});