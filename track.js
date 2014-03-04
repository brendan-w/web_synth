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
	this.running = false;
	this.pattern; // = [][]  (booleans) the actual melody matrix

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
		if(_this.running)
		{
			//turn the oscillators on/off
			for(var y = 0; y < notes; y++)
			{
				var noteGain = _this.gain_nodes[y];
				var newState = _this.pattern[y][currentBeat];
				var oldState = _this.pattern[y][mod((currentBeat - 1), beatsPerMeasure)]; //used mod() because of possible negative values

				if(newState !== oldState) //only switch nodes if their state changes
				{
					if(_this.pattern[y][currentBeat])
					{
						noteGain.gain.value = 1;
					}
					else
					{
						noteGain.gain.value = 0;
					}
				}
			}

			//give UI feedback
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
		_this.updateMatrix();
	};


	/*
	 * Private functions
	 */


	//creates and dimensions the pattern buffer according to notes and beatsPerMeasure
	//builds the HTML for the button matrix (with values as given by pattern[y][x])
	this.updateMatrix = function() {
		
		//DATA------------------------------------------

		//check if there's already a pattern there
		if(_this.pattern === undefined)
		{
			//create an empty pattern
			_this.pattern = make2D(notes, beatsPerMeasure, false);
		}
		else
		{
			//its MAAAGICAL!
			_this.pattern = resize2D(_this.pattern,
									notes,
									beatsPerMeasure,
									false,
									true,
									false);
		}


		//HTML------------------------------------------

		//ditch anything that was there before
		if(_this.table === undefined)
		{
			_this.table = document.createElement("table");
			_this.root.appendChild(_this.table);
		}
		else
		{
			//empty its contents
			while(_this.table.firstChild)
			{
				_this.table.removeChild(_this.table.firstChild);
			}
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
				_this.patternButtons[y][x] = td;

				//create the button graphic
				var button = document.createElement("div");
				button.setAttribute("x", x);
				button.setAttribute("y", y);

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



	/*
	 * Event Handlers for UI elements
	 */

	//enables/disables playback of this track
	this.setEnabled = function(value) {
		if(value === true)
		{
			_this.running = true;
		}
		else
		{
			_this.running = false;
		}
	};

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

	};

	this.updateFrequencies = function(e) {
		//get new information from the select dropdowns
		var key = _this.keySelect.selectedIndex;
		var octave = octaves[_this.octaveSelect.selectedIndex].octave;
		var scale = _this.scaleSelect.selectedIndex;

		//update the oscillators with their new frequencies
		for(var y = 0; y < notes; y++)
		{
			                      //bottom = note 0
			_this.oscillator_nodes[invert(y, notes)].frequency.value = getFrequency(y, key, octave, scale);
		}
	};

	this.updateTone = function(e) {

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

			this.gain_nodes[y].gain.value = 0;
			this.oscillator_nodes[y].start(0);

		}

		this.master_gain_node.connect(destination_node);


		//HTML--------------------------------------------
		this.root = document.createElement("section");

		//make lefthand option pane
		var options = document.createElement("div");
		this.root.appendChild(options);
		options.className = "options";
		options.innerHMTL = "Key - OCtave - Scale";

		this.keySelect = makeSelect(keys, 0);
		this.keySelect.addEventListener("change", this.updateFrequencies);
		options.appendChild(this.keySelect);

		this.octaveSelect = makeSelect(octaves, 2);
		this.octaveSelect.addEventListener("change", this.updateFrequencies);
		options.appendChild(this.octaveSelect);

		this.scaleSelect = makeSelect(scales, 1);
		this.scaleSelect.addEventListener("change", this.updateFrequencies);
		options.appendChild(this.scaleSelect);

		this.toneSelect = makeSelect(tones, 0);
		this.toneSelect.addEventListener("change", this.updateTone);
		options.appendChild(this.toneSelect);

		//make the sequencer matrix
		this.updateMatrix();

		//setup the oscillators with their frequencies
		this.updateFrequencies();

		//add the finished track to the page
		document.querySelector("#tracks").appendChild(this.root);
		this.running = true;

	//end constructor----------------------------------------------------------

	//return only public functions
	return {
		beat: this.beat,
		update: this.update
	};
};
