var Track = function()
{
	//sound stuff
	this.pattern = [];
	this.oscillator_nodes = [];
	this.gain_node;
	this.running = true;
	this.scale = 0;
	this.key = 0;
	this.octave = 4;

	//display stuff
	this.root;
	this.patternButtons = [];


	/*
	 * Public functions
	 */

	//plays the specified beat in the measure
	this.beat = function(beat)
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

	this.matrixButtonClicked = function(e) {

	};

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

		//make the sequencer matrix
		var table = document.createElement("table");
		this.root.appendChild(table);

		for(var y = 0; y < notes; y++)
		{
			var tr = document.createElement("tr");
			table.appendChild(tr);

			for(var x = 0; x < beatsPerMeasure; x++)
			{
				var td = document.createElement("td");
				tr.appendChild(td);

				var button = document.createElement("div");
				button.setAttribute("class", "matrixButton");
				button.setAttribute("x", x);
				button.setAttribute("y", y);
				button.addEventListener("click", this.matrixButtonClicked);
				td.appendChild(button);
			}
		}


		document.querySelector("#tracks").appendChild(this.root);

		//addEventListeners
		/*
		.addEventListener("change", scaleChanged);
		.addEventListener("change", toneChanged);
		.addEventListener("change", volumeChanged);
		*/

	//end constructor------------------------------------------------

	return {
		beat: this.beat,
		setEnabled: this.setEnabled
	};
};