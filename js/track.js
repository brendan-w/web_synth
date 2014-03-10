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
	this.waveShaper_nodes = []; //distortion and such
	this.gain_nodes = []; //used to turn notes on & off
	this.master_gain_node; //only update the note range that you have to
	this.compressor_node;

	//running vars
	this.enabled = false;
	this.pattern; // = [][]  (booleans) the actual melody matrix
	this.upperBound = notes;
	this.lowerBound = 0; 

	//display stuff
	this.root;
	this.table;
	this.patternButtons; // = [][]  (table cells) needed for playback color changes
	this.playButton;
	this.keySelect;
	this.octaveSelect;
	this.scaleSelect;
	this.toneSelect;
	this.shiftLeft;
	this.shiftRight;



	/*
	 * Public functions
	 */

	//plays the specified beat in the measure
	this.beat = function()
	{
		if(_this.enabled)
		{
			//only loop through the section of notes that turn on and off
			for(var y = _this.lowerBound; y < _this.upperBound; y++)
			{
				var oldBeat = Math.mod((currentBeat - 1), beatsPerMeasure); //used Math.mod() because of possible negative values
				var newState = _this.pattern[y][currentBeat];
				var oldState = _this.pattern[y][oldBeat];
				var currentState = floatToBool(_this.gain_nodes[y].gain.value);

				//turn the oscillators on/off
				if(newState && !currentState)
				{
					_this.gain_nodes[y].gain.value = 1;
				}
				else if(!newState && currentState)
				{
					_this.gain_nodes[y].gain.value = 0;
				}

				//give UI feedback
				if(newState)
				{
					_this.patternButtons[y][currentBeat].className = "play";
				}

				_this.patternButtons[y][oldBeat].className = oldState.toString();
			}
		}
	};

	//general update function, called when an external setting was changed by the user
	this.update = function() {
		var oldEnable = _this.enabled;
		_this.setEnabled(false);
		
		_this.updatePattern();
		_this.updateBounds();
		_this.updateMatrix();
		_this.updateFrequencies();

		_this.setEnabled(oldEnable);
	};


	/*
	 * Private functions
	 */


	//creates and dimensions the pattern buffers according to notes and beatsPerMeasure
	this.updatePattern = function() {

		//check if there's already a pattern there
		if(_this.pattern === undefined)
		{
			//create an empty pattern
			_this.pattern = make2D(notes, beatsPerMeasure, false);
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
		}
	};

	//scans the pattern array and updates the top and bottom bounds (makes the beat() function faster)
	this.updateBounds = function()
	{
		//update the vertical bounds
		var haveNotes = new Array();

		for(var y = 0; y < _this.pattern.length; y++)
		{
			for(var x = 0; x < _this.pattern[y].length; x++)
			{
				if(_this.pattern[y][x])
				{
					haveNotes[y] = true;
				}
				else if(haveNotes[y] == undefined)
				{
					haveNotes[y] = false;
				}
			}
		}

		var i = 0;
		while(!haveNotes[i] && (i < notes)) { i++; }
		_this.lowerBound = i;

		i = notes;
		while(!haveNotes[i] && (i >= 0)) { i--; }
		_this.upperBound = i + 1;

		//turn off the oscillators that are out of bounds
		for(var y = 0; y < _this.lowerBound; y++)
		{
			_this.gain_nodes[y].gain.value = 0;
		}
		for(var y = _this.upperBound; y < notes; y++)
		{
			_this.gain_nodes[y].gain.value = 0;
		}
	};


	//builds the HTML for the button matrix (with values as given by pattern[y][x])
	this.updateMatrix = function() {
		//recreate the table if the size changes
		if((_this.patternButtons === undefined) ||
		   (_this.patternButtons.length !== beatsPerMeasure) ||
		   (_this.patternButtons[0].length !== notes))
		{
			//ditch anything that was there before
			removeChildren(_this.table);

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
					_this.patternButtons[y][x] = button;
					button.setAttribute("x", x);
					button.setAttribute("y", y);
					button.addEventListener("mousedown", _this.matrixClicked);
					button.addEventListener("mouseenter", _this.matrixRollOver);

					/*
					//trying to make chrome happy with the click-drag drawing method
					button.addEventListener("dragstart", function(e){ console.log(e); });
					button.addEventListener("drag",      function(e){ console.log(e); });
					button.addEventListener("dragenter", function(e){ console.log(e); });
					button.addEventListener("dragleave", function(e){ console.log(e); });
					button.addEventListener("dragover",  function(e){ console.log(e); });
					button.addEventListener("drop",      function(e){ console.log(e); });
					button.addEventListener("dragend",   function(e){ console.log(e); });
					*/

					td.appendChild(button);
				}
			}
		}

		//make the table match the pattern
		for(var y = 0; y < _this.patternButtons.length; y++)
		{
			for(var x = 0; x < _this.pattern[y].length; x++)
			{
				if(_this.pattern[y][x])
				{
					_this.patternButtons[y][x].className = "true";
				}
				else
				{
					_this.patternButtons[y][x].className = "false";
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
			
			//in case this is called before things are set up
			if(_this.patternButtons)
			{
				//turn off all the notes, reset the css to look like pattern
				for(var y = 0; y < _this.patternButtons.length; y++)
				{
					_this.gain_nodes[y].gain.value = 0;	
				}

				//update the HMTL to get rid of any playing note lights
				_this.updateMatrix();
			}
			
		}
	};

	//click handler for matrix buttons
	this.matrixClicked = function(e) {
		//prevents chrome text cursor when dragging
		e.preventDefault();
		e.stopPropagation();

		var element = e.target;
		var x = element.getAttribute("x");
		var y = element.getAttribute("y");

		_this.pattern[y][x] = !_this.pattern[y][x];

		if(_this.pattern[y][x])
		{
			element.className = "true";
		}
		else
		{
			element.className = "false";
		}

		_this.updateBounds();
	};

	this.matrixRollOver = function(e) {
		//console.log("rolled");
		//if the mouse is held
		if((e.button === 0) &&(e.buttons >= 1))
		{
			_this.matrixClicked(e);
		}
	}

	this.matrixDrag = function(e) {
		_this.matrixClicked(e);
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
		var type = tones[_this.toneSelect.selectedIndex].name.toLowerCase();
		for(var y = 0; y < notes; y++)
		{						   //bottom = note 0
			_this.oscillator_nodes[invert(y, notes)].type = type;
		}
	};

	this.shiftMatrix = function(e) {

	};

	this.updateVolume = function(e) {

	};

	this.toggleEnabled = function(e) {
		_this.setEnabled(!_this.enabled);
		e.target.classList.toggle("true");
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
			this.waveShaper_nodes[y] = audioCtx.createWaveShaper();
			this.gain_nodes[y] = audioCtx.createGain();

			this.oscillator_nodes[y].connect(this.waveShaper_nodes[y]);
			this.waveShaper_nodes[y].connect(this.gain_nodes[y]);
			this.gain_nodes[y].connect(this.master_gain_node);

			//turn things off BEFORE the oscillators are started
			this.gain_nodes[y].gain.value = 0;
			
			//setDistortion(1);
			setDistortion(0);

			this.waveShaper_nodes[y].curve = wsCurve;
			this.oscillator_nodes[y].start(0);
		}

		this.master_gain_node.connect(destination_node);


		//HTML--------------------------------------------

		//grab the template HMTL for a track object
		this.root = document.querySelector("#templates .track").cloneNode(true);

		this.table = this.root.querySelector("table");
		this.playButton = this.root.querySelector(".options .playButton");
		this.keySelect = this.root.querySelector(".options .key");
		this.octaveSelect = this.root.querySelector(".options .octave");
		this.scaleSelect = this.root.querySelector(".options .scale");
		this.toneSelect = this.root.querySelector(".options .tone");
		this.shiftLeft = this.root.querySelector(".shiftLeft");
		this.shiftRight = this.root.querySelector(".shiftRight");

		fillSelect(this.keySelect, keys, 0);
		fillSelect(this.octaveSelect, octaves, 3);
		fillSelect(this.scaleSelect, scales, 1);
		fillSelect(this.toneSelect, tones, 0);

		this.table.addEventListener("mousemove", this.matrixMove);
		this.playButton.addEventListener("click", this.toggleEnabled);
		this.keySelect.addEventListener("change", this.updateFrequencies);
		this.octaveSelect.addEventListener("change", this.updateFrequencies);
		this.scaleSelect.addEventListener("change", this.updateFrequencies);
		this.toneSelect.addEventListener("change", this.updateTone);
		this.shiftLeft.addEventListener("click", this.shiftMatrix);
		this.shiftRight.addEventListener("click", this.shiftMatrix);
		
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
