var Track = function()
{
	//sound stuff
	this.pattern = [];
	this.oscillator_nodes = [];
	this.gain_node;

	this.running = true;

	//display stuff
	this.root;
	this.patternButtons = [];


	/*
	 * Public functions
	 */

	//plays the specified beat in the measure
	this.step = function(currentBeat)
	{
		if(this.running)
		{

		}
		else
		{

		}
	};

	//enables/disables playback of this track
	this.setEnabled = function(value) {
		if(value === true)
		{
			this.running = true;
		}
		else
		{
			this.running = false;
		}
	};


	/*
	 * Private functions
	 */


	this.setScale = function(scale) {

	};

	this.setTone = function(tone) {

	};

	this.setVolume = function(volume) {

	};


	/*
	 * Event Handlers for UI elements
	 */

	 
	this.scaleChanged = function(e) {

	};

	this.toneChanged = function(e) {

	};

	this.volumeChanged = function(e) {

	};


	//constructor----------------------------------------------------
		//build the sound nodes



		//build the html
		this.root = document.createElement("section");

		//document.querySelector("#tracks").appendChild(this.root);

		//addEventListers
		/*
		.addEventLister("change", setScale);
		.addEventLister("change", setTone);
		.addEventLister("change", setVolume);
		*/

	//end constructor------------------------------------------------

	return {
		step: this.step,
		setEnabled: this.setEnabled
	};
};