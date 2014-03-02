var Track = function()
{
	var _parent = this;

	//sound stuff
	this.running = true;
	this.pattern; // = [][]
	this.oscillator_nodes = [];
	this.gain_node;
	this.compressor_node;

	//display stuff
	this.root;
	this.patternButtons = [];
	this.keySelect;
	this.octaveSelect;
	this.scaleSelect;


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


	this.destruct = function() {
		document.querySelector("#tracks").removeChild(this.root);
	}

	/*
	 * Private functions
	 */


	this.updateScale = function() {
		var key = this.keySelect.selectedIndex;
		var octave = octaves[this.octaveSelect.selectedIndex].octave;
		var scale = this.scaleSelect.selectedIndex;

		for(var y = 0; y < notes; y++)
		{
			this.oscillator_nodes[y].frequency.value = getFrequency(y, key, octave, scale);
		}
	};

	this.updateTone = function() {

	};

	this.updateVolume = function() {

	};


	/*
	 * Event Handlers for UI elements
	 */

	this.matrixButtonClicked = function(e) {
		var element = e.target;
		var x = element.getAttribute("x");
		var y = element.getAttribute("y");

		_parrent.pattern[y][x] = !_parrent.pattern[y][x];

		if(_parrent.pattern[y][x])
		{
			element.className = "on";
		}
		else
		{
			element.className = "off";
		}

	};

	this.scaleChanged = function(e) {

	};

	this.toneChanged = function(e) {

	};

	this.volumeChanged = function(e) {

	};


	//constructor----------------------------------------------------
		//build the sound nodes
		this.gain_node = audioCtx.createGain();

		for(var y = 0; y < notes; y++)
		{
			this.oscillator_nodes[y] = audioCtx.createOscillator();
			this.oscillator_nodes[y].connect(this.gain_node);
		}

		this.gain_node.connect(destination_node);

		//turn on a pleasent chord
		/*
		this.oscillator_nodes[0].start(0);
		this.oscillator_nodes[3].start(0);
		this.oscillator_nodes[5].start(0);
		this.oscillator_nodes[7].start(0);
		this.oscillator_nodes[10].start(0);
		*/
		

		//build the html
		this.root = document.createElement("section");

		//make lefthand option pane
		var options = document.createElement("div");
		this.root.appendChild(options);
		options.className = "options";

		this.keySelect = makeSelect(keys, 0);
		options.appendChild(this.keySelect);

		this.octaveSelect = makeSelect(octaves, 2);
		options.appendChild(this.octaveSelect);

		this.scaleSelect = makeSelect(scales, 1)
		options.appendChild(this.scaleSelect);


		//make the sequencer matrix
		var table = document.createElement("table");
		this.root.appendChild(table);

		this.pattern = new Array();

		for(var y = 0; y < notes; y++)
		{
			var tr = document.createElement("tr");
			table.appendChild(tr);

			this.pattern[y] = new Array();

			for(var x = 0; x < beatsPerMeasure; x++)
			{
				var td = document.createElement("td");
				tr.appendChild(td);

				this.pattern[y][x] = false;

				var button = document.createElement("div");
				button.className = "off";
				button.setAttribute("x", x);
				button.setAttribute("y", y);
				button.addEventListener("click", this.matrixButtonClicked);
				td.appendChild(button);
			}
		}

		document.querySelector("#tracks").appendChild(this.root);

		this.updateScale();

	//end constructor------------------------------------------------

	//return only private functions, let the closures handle the rest
	return {
		beat: this.beat,
		setEnabled: this.setEnabled
	};
};