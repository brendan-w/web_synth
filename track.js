var Track = function()
{
	//sound stuff
	this.pattern = [][];
	this.oscillator_nodes = [];
	this.gain_node;

	this.running = true;
	this.noteSize = 1; //number of beats (note width)

	//display stuff
	this.root;
	this.patternButtons = [][];


	this.setScale = function(scale) {

	};

	this.setTone = function(tone) {

	};

	this.setVolume = function(volume) {

	};

	this.step = function(currentBeat)
	{
		if(running)
		{

		}
		else
		{

		}
	};

	this.enabled = function(value)
	{
		if(value === true)
		{
			this.running = true;
		}
		else
		{
			this.running = false;
		}
	};


	//constructor----------------------------------------------------
		//build the html
		this.root = document.createElement("section");

		document.querySelector("#tracks").appendChild(this.root);

		//build the sound nodes

	//end constructor------------------------------------------------

	return {
		next : this.step,
		enabled : this.enabled
	};
};