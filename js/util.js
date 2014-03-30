/*
 * Util.js
 *
 * File for settings and handy stuff. Core music theory settings/functions are found here.
 * 
 */

"use strict";


/*
 * Data & Settings
 */

var scales = [
	//intervals = number of half steps away from the root
	{name: "Chromatic", intervals:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
	{name: "Major",     intervals:[0, 2, 4, 5, 7, 9, 11]},
	{name: "Minor",     intervals:[0, 2, 3, 5, 7, 8, 10]},
	{name: "Blues",     intervals:[0, 3, 5, 6, 7, 10]}
];
var keys = [
	//frequencies at octave 4
	{name: "C",  frequency: 261.63},
	{name: "C#", frequency: 277.18},
	{name: "D",  frequency: 293.66},
	{name: "D#", frequency: 311.13},
	{name: "E",  frequency: 329.63},
	{name: "F",  frequency: 349.23},
	{name: "F#", frequency: 369.99},
	{name: "G",  frequency: 392.00},
	{name: "G#", frequency: 415.30},
	{name: "A",  frequency: 440.00},
	{name: "A#", frequency: 466.16},
	{name: "B",  frequency: 493.88}
];
var octaves = [
	{name: "1", octave:1},
	{name: "2", octave:2},
	{name: "3", octave:3},
	{name: "4", octave:4},
	{name: "5", octave:5},
	{name: "6", octave:6},
	{name: "7", octave:7}
];
var tones = [
	//stores harmonic content for the various tones     <-- lies, but later it might
	{name: "Sine"},
	{name: "Triangle"},
	{name: "Sawtooth"},
	{name: "Square"}
];

var notes = 12; //matrix height
var beatsPerMeasure = 12; //matrix width
var beatsPerMinute = 480; //120; //speed

var minBeats = 2;
var maxBeats = 24;



/*
 * Utilities
 */

function getWaitTime() { return 60000 / beatsPerMinute; } //converts BPM to milliseconds

function invert(n, max) { return (max - 1) - n; } //inverts a 0-x value to x-0

//takes a note on a given scale, and returns the frequency at that key and octave
function getFrequency(note, key, octave, scale)
{
	//see if the note goes off the end of the scale, and add octave to accomodate
	octave += Math.floor(note/scales[scale].intervals.length);

	//loop back around if needed
	note = note % scales[scale].intervals.length;

	//get the number of half steps from the root
	var halfSteps = scales[scale].intervals[note];

	//how far is it from C4?
	var steps = key + halfSteps

	//shift up one octave if the key offset pushes it off the end of the list
	octave += Math.floor(steps/keys.length);

	//loop back around if needed
	steps = steps % keys.length;

	//base frequencies are at octave 4 (more likely to be precise)
	octave -= 4;

	//get the base frequency at this note
	var freq = keys[steps].frequency;

	//apply octave shift
	freq = freq * Math.pow(2, octave);
	
	return freq;
}


function removeChildren(element) {
  //supposedly faster than .innerHTML = "";
	while(element.firstChild)
	{
		element.removeChild(element.firstChild);
	}
}


//fills a <select> element with the supplied options
//looks at the .name property of array elements
function fillSelect(select, array, defaultIndex)
{
	for(var i = 0; i < array.length; i++)
	{
		var option = document.createElement("option");
		select.appendChild(option);
		option.innerHTML = array[i].name;
		if(i === defaultIndex)
		{
			option.setAttribute("selected", "selected");
		}
	}
};

//returns css for a different color (for as long as it can)
//n = 0, 1, 2, 3...
function colorForIndex(n, s, l)
{
	var val = n * 282;
	val = mod(val, 360);
	return {'color':'hsl(' + val.toString() + ', 100%, 65%)'};
}

//see if this page has been referred to by another page
function referredFrom(page)
{
	var result = false
	if(document.referrer.search(page) != -1){result = true;}
	return result;
}

//fix Javascript modulo bug for negative numbers... jeese...
Math.mod = function(x,n) { return(((x%n)+n)%n); };

//maps a value from one range to another (useful during animation)
Math.map = function(x, in_min, in_max, out_min, out_max) { return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min; };

//clamps a number between two values (inclusive)
Math.clamp = function(number, min, max) { return Math.min(Math.max(number, min), max); };

function floatToBool(float)
{
	if (float >= 0.5) { return true; }
	return false;
}


//Waveshaper Distortion
//https://github.com/janesconference/MorningStar/blob/master/audio/ADNonDescript.js
//http://blog.chrislowis.co.uk/2013/06/17/synthesis-web-audio-api-envelopes.html

function setDistortion(curve, amount) {
    
    if (amount <= -1) { amount = -0.985; }
    if (amount >= 1) { amount = 0.985; }

    var n_samples = curve.length;
    var k = 2 * amount / (1 - amount);

    for (var i = 0; i < n_samples; i+=1) {
        // LINEAR INTERPOLATION: x := (c - a) * (z - y) / (b - a) + y
        // a = 0, b = 2048, z = 1, y = -1, c = i
        var x = Math.map(i, 0, n_samples, -1, 1);
        //var x = (i - 0) * (1 - (-1)) / (n_samples - 0) + (-1);
        curve[i] = (1 + k) * x / (1+ k * Math.abs(x));
    }
}






//Reverb
//https://github.com/web-audio-components/simple-reverb

/**
* Simple Reverb constructor.
*
* @param {AudioContext} context
* @param {object} opts
* @param {number} opts.seconds
* @param {number} opts.decay
* @param {boolean} opts.reverse
*/

function SimpleReverb (context, opts) {
  this.input = this.output = context.createConvolver();
  this._context = context;

  var p = this.meta.params;
  opts = opts || {};
  this._seconds = opts.seconds || p.seconds.defaultValue;
  this._decay = opts.decay || p.decay.defaultValue;
  this._reverse = opts.reverse || p.reverse.defaultValue;
  this._buildImpulse();
}

SimpleReverb.prototype = Object.create(null, {

  /**
* AudioNode prototype `connect` method.
*
* @param {AudioNode} dest
*/

  connect: {
    value: function (dest) {
      this.output.connect( dest.input ? dest.input : dest );
    }
  },

  /**
* AudioNode prototype `disconnect` method.
*/

  disconnect: {
    value: function () {
      this.output.disconnect();
    }
  },

  /**
* Utility function for building an impulse response
* from the module parameters.
*/

  _buildImpulse: {
    value: function () {
      var rate = this._context.sampleRate
        , length = rate * this.seconds
        , decay = this.decay
        , impulse = this._context.createBuffer(2, length, rate)
        , impulseL = impulse.getChannelData(0)
        , impulseR = impulse.getChannelData(1)
        , n, i;

      for (i = 0; i < length; i++) {
        n = this.reverse ? length - i : i;
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      }

      this.input.buffer = impulse;
    }
  },

  /**
* Module parameter metadata.
*/

  meta: {
    value: {
      name: "SimpleReverb",
      params: {
        seconds: {
          min: 1,
          max: 50,
          defaultValue: 3,
          type: "float"
        },
        decay: {
          min: 0,
          max: 100,
          defaultValue: 2,
          type: "float"
        },
        reverse: {
          min: 0,
          max: 1,
          defaultValue: 0,
          type: "bool"
        }
      }
    }
  },

  /**
* Public parameters.
*/

  seconds: {
    enumerable: true,
    get: function () { return this._seconds; },
    set: function (value) {
      this._seconds = value;
      this._buildImpulse();
    }
  },

  decay: {
    enumerable: true,
    get: function () { return this._decay; },
    set: function (value) {
      this._decay = value;
      this._buildImpulse();
    }
  },

  reverse: {
    enumerable: true,
    get: function () { return this._reverse; },
    set: function (value) {
      this._reverse = value;
      this._buildImpulse();
    }
  }

});
