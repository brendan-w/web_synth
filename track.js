/*
 * Track.js
 *
 * Class file for an audio track. Each track has its own note grid (this.pattern), and oscillator nodes for each note.
 * This class handles its own UI, so generate your UI HMTL here. Only has one "public" function (beat()) which updates the sound/UI.
 *
 */

"use strict";

var Track = function()
{
	var _this = this; //needed because "this" in event handlers refers to the DOM element

	//sound stuff
	this.oscillator_nodes = []; //one oscillator for each pitch
	this.gain_nodes = []; //unfortunately, you can only call .start(0) ONCE, so gains are used to turn notes on & off
	this.master_gain_node;
	this.compressor_node;

	//running vars
	this.enabled = false;
	this.pattern; // = [][]  (booleans) the actual melody matrix
	this.bakedPattern //the points at which the notes turn on and off  -1 = off, 1 = on, 0 = no change

	//display stuff
	this.root;
	this.table;
	this.patternButtons; // = [][]  (table cells) needed for playback color changes
	this.keySelect;
	this.octaveSelect;
	this.scaleSelect;
	this.toneSelect;

	//colors
	//TODO: use util -> colorForIndex() to give each track a unique color
	//is there a way to do it without adding 3 eventlisteners to every freakin' button?
	/*
	this.on;
	this.off;
	this.hoverOn;
	this.hoverOff;
	this.playOn;
	this.playOff;
	*/


	/*
	 * Public functions
	 */

	//plays the specified beat in the measure
	this.beat = function()
	{

		if(_this.enabled)
		{
			for(var y = 0; y < notes; y++)
			{
				var oldBeat = mod((currentBeat - 1), beatsPerMeasure); //used mod() because of possible negative values
				var newState = _this.pattern[y][currentBeat];
				var oldState = _this.pattern[y][oldBeat];

				//turn the oscillators on/off
				if(_this.bakedPattern[y][currentBeat] === 1)
				{
					_this.gain_nodes[y].gain.value = 1;
				}
				else if(_this.bakedPattern[y][currentBeat] === -1)
				{
					_this.gain_nodes[y].gain.value = 0;
				}

				//give UI feedback
				if(newState)
				{
					_this.patternButtons[y][currentBeat].className = "playOn";
				}
				else
				{
					_this.patternButtons[y][currentBeat].className = "playOff";
				}

				if(oldState)
				{
					_this.patternButtons[y][oldBeat].className = "on";
				}
				else
				{
					_this.patternButtons[y][oldBeat].className = "off";
				}
			}
		}
		else
		{
			//turn off sound
			for(var y = 0; y < notes; y++)
			{
				_this.gain_nodes[y].gain.value = 0;
			}
			//turn off UI feedback
		}
	};

	//general update function, called when an external setting was changed by the user
	this.update = function() {
		var oldEnable = _this.enabled;
		_this.setEnabled(false);
		
		_this.updatePattern();
		_this.updateMatrix();
		_this.updateFrequencies();

		_this.setEnabled(oldEnable);
	};


	/*
	 * Private functions
	 */


	//builds the HTML for the button matrix (with values as given by pattern[y][x])
	this.updateMatrix = function() {
		
		//ditch anything that was there before
		while(_this.table.firstChild)
		{
			_this.table.removeChild(_this.table.firstChild);
		}

		_this.patternButtons = new Array();

		//build the new table
		for(var y = 0; y < _this.pattern.length; y++)
		{
			//create the table row
			var tr = document.createElement("tr");
			_this.table.appendChild(tr);
			_this.patternButtons[y] = new Array();

			for(var x = 0; x < _this.pattern[y].length; x++)
			{
				//create the table cell
				var td = document.createElement("td");
				tr.appendChild(td);
				
				//create the button graphic
				var button = document.createElement("div");
				button.setAttribute("x", x);
				button.setAttribute("y", y);
				_this.patternButtons[y][x] = button;

				//make the HTML match the data
				if(_this.pattern[y][x])
				{
					button.className = "on";
				}
				else
				{
					button.className = "off";
				}

				button.addEventListener("click", _this.matrixButtonClicked);
				td.appendChild(button);
			}
		}
	};


	//creates and dimensions the pattern buffers according to notes and beatsPerMeasure
	this.updatePattern = function() {

		//check if there's already a pattern there
		if(_this.pattern === undefined)
		{
			//create an empty pattern
			_this.pattern = make2D(notes, beatsPerMeasure, false);
			_this.bakedPattern = make2D(notes, beatsPerMeasure, 0);
		}
		else if((_this.pattern.length !== beatsPerMeasure) ||
				(_this.pattern[0].length !== notes))
		{
			//its MAAAGICAL!
			_this.pattern = resize2D(_this.pattern,
									notes,
									beatsPerMeasure,
									false,
									true,
									false);
			_this.bakedPattern = resize2D(_this.bakedPattern,
										  notes,
										  beatsPerMeasure,
										  false,
										  true,
										  0);
		}

		_this.bakePattern();
	};


	//bake the pattern into a change based array
	this.bakePattern = function() {
		//get the current dimensions
		var cy = _this.bakedPattern.length;
		var cx = _this.bakedPattern[0].length;

		for(var y = 0; y < cy; y++)
		{
			for(var x = 0; x < cx; x++)
			{
				var oldBeat = mod((x - 1), beatsPerMeasure); //used mod() because of possible negative values
				var newState = _this.pattern[y][x];
				var oldState = _this.pattern[y][oldBeat];

				if(oldState != newState)
				{
					if(newState)
					{
						_this.bakedPattern[y][x] = 1;
					}
					else
					{
						_this.bakedPattern[y][x] = -1;
					}
				}
				else
				{
					_this.bakedPattern[y][x] = 0;
				}
			}
		}
	};


	/*
	 * Event Handlers for UI elements
	 */

	//enables/disables playback of this track
	this.setEnabled = function(value) {
		if(value === true)
		{
			_this.enabled = true;
		}
		else
		{
			_this.enabled = false;

			//turn off all the notes
			for(var i = 0; i < _this.gain_nodes.length; i++)
			{
				_this.gain_nodes[i].gain.value = 0;	
			}
		}
	};

	//click handler for matrix buttons
	this.matrixButtonClicked = function(e) {
		var element = e.target;
		var x = element.getAttribute("x");
		var y = element.getAttribute("y");

		_this.pattern[y][x] = !_this.pattern[y][x];

		if(_this.pattern[y][x])
		{
			element.className = "on";
		}
		else
		{
			element.className = "off";
		}

		_this.bakePattern(); //bake the changes
	};

	//get values from the key, octave and scale <select>, and update the oscillators
	this.updateFrequencies = function(e) {
		//get new information from the select dropdowns
		var key = _this.keySelect.selectedIndex;
		var octave = octaves[_this.octaveSelect.selectedIndex].octave;
		var scale = _this.scaleSelect.selectedIndex;

		//update the oscillators with their new frequencies
		for(var y = 0; y < notes; y++)
		{							//bottom = note 0
			_this.oscillator_nodes[invert(y, notes)].frequency.value = getFrequency(y, key, octave, scale);
		}
	};

	//reads the UI, and sets the oscillators with the correct periodicWave
	this.updateTone = function(e) {
		var tone = tones[_this.toneSelect.selectedIndex];

		var type;
		var periodicWave;

		if(!tone.custom)
		{
			type = tone.name.toLowerCase();
		}
		else
		{
			type = "custom";
		}

		for(var y = 0; y < notes; y++)
		{							//bottom = note 0
			_this.oscillator_nodes[invert(y, notes)].type = type;
			if(tone.custom)
			{
				
			}
		}
	};

	this.updateVolume = function(e) {

	};

	//self destruct in five, four, three, tw**BOOM**
	this.destruct = function(e) {
		//delete display objects
		document.querySelector("#tracks").removeChild(_this.root);

		//delete/disconnect audio objects
		for(var y = 0; y < notes; y++)
		{
			_this.oscillator_nodes[y].stop(0); //shut-up
			_this.oscillator_nodes[y] = undefined; //destroy all the evidence
			_this.gain_nodes[y] = undefined;
		}

		_this.master_gain_node = undefined;
		_this.compressor_node = undefined;
		//etc... for all audio nodes we use

		//delete from tracks list
		deleteTrack();
	};



	//constructor--------------------------------------------------------------
		
		//SOUND-------------------------------------------
		this.master_gain_node = audioCtx.createGain();

		for(var y = 0; y < notes; y++)
		{
			this.oscillator_nodes[y] = audioCtx.createOscillator();
			this.gain_nodes[y] = audioCtx.createGain();
			this.oscillator_nodes[y].connect(this.gain_nodes[y]);
			this.gain_nodes[y].connect(this.master_gain_node);

			//turn things off BEFORE the oscillators are started
			this.gain_nodes[y].gain.value = 0;
			this.oscillator_nodes[y].start(0);
		}

		this.master_gain_node.connect(destination_node);


		//HTML--------------------------------------------

		//grab the template HMTL for a track object
		this.root = document.querySelector("#hidden .track").cloneNode(true);

		this.table = this.root.querySelector("table");
		this.keySelect = this.root.querySelector(".key");
		this.octaveSelect = this.root.querySelector(".octave");
		this.scaleSelect = this.root.querySelector(".scale");
		this.toneSelect = this.root.querySelector(".tone");

		fillSelect(this.keySelect, keys, 0);
		fillSelect(this.octaveSelect, octaves, 2);
		fillSelect(this.scaleSelect, scales, 1);
		fillSelect(this.toneSelect, tones, 0);

		this.keySelect.addEventListener("change", this.updateFrequencies);
		this.octaveSelect.addEventListener("change", this.updateFrequencies);
		this.scaleSelect.addEventListener("change", this.updateFrequencies);
		this.toneSelect.addEventListener("change", this.updateTone);
		
		//make the sequencer matrix & setup the oscillators with their frequencies
		this.update();

		//add the finished track to the page
		document.querySelector("#tracks").appendChild(this.root);
		this.setEnabled(true);

	//end constructor----------------------------------------------------------

	//return only public functions
	return {
		beat: this.beat,
		update: this.update
	};
};
