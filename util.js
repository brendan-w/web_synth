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
	{name: "2", octave:2},
	{name: "3", octave:3},
	{name: "4", octave:4},
	{name: "5", octave:5},
	{name: "6", octave:6},
	{name: "7", octave:7}
];
var tones = [
	//stores harmonic content for the various tones
	{name: "Sine"},
	{name: "Triangle"},
	{name: "Sawtooth"},
	{name: "Square"}
];

var notes = 12; //matrix height
var beatsPerMeasure = 12; //matrix width
var beatsPerMinute = 120; //speed



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


//function that makes a 2D array, and fills it with default values
function make2D(ny, nx, defaultValue)
{
	var array = new Array();
	for(var y = 0; y < ny; y++)
	{
		array[y] = new Array();
		for(var x = 0; x < nx; x++)
		{
			array[y][x] = defaultValue;
		}
	}

	return array;
}


//debug only
function print2D(array)
{
	var cy = array.length;
	var cx = array[0].length;

	for(var y = 0; y < cy; y++)
	{
		var line = "";
		for(var x = 0; x < cx; x++)
		{
			if(array[y][x])
			{
				line += "1_";
			}
			else
			{
				line += "0_";
			}
		}
		console.log(line);
	}
}

/*
 * function for resizing a row-major 2D array, while maintaining the existing data
 *
 * array = row-major 2D array
 * ny, nx = new array dimensions
 * yEnd = adds and deletes new elements at END of y-axis (set false to operate at the beginning)
 * XEnd = adds and deletes new elements at END of x-axis (set false to operate at the beginning)
 * defaultValue = default value for new elements
 */
function resize2D(array, ny, nx, yEnd, xEnd, defaultValue) {
	if(array)
	{
		//pre-flight checks
		if(yEnd === undefined) { yEnd = true; }
		if(xEnd === undefined) { xEnd = true; }
		if(defaultValue === undefined) { defaultValue = 0; }

		//get the current dimensions of the array
		var cy = array.length;
		var cx = array[0].length;

		//create the new array with the new dimensions
		var newArray = make2D(ny, nx, defaultValue);

		//fill the new array with the old values from the source array
		for(var y = 0; y < cy; y++)
		{
			for(var x = 0; x < cx; x++)
			{
				var destY = y;
				var destX = x;
				if(!yEnd) { destY = ny - cy + y; }
				if(!xEnd) { destX = nx - cx + x; }
				if((destY >= 0) && (destX >= 0)) //if it doesn't fall off the lower bounds
				{
					if((destY < ny) && (destX < nx)) //if it doesn't fall off the upper bounds
					{
						newArray[destY][destX] = array[y][x];
					}
				}
			}
		}

		return newArray;
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
function mod(x,n) {return(((x%n)+n)%n);}

//maps a value from one range to another (useful during animation)
function map(x, in_min, in_max, out_min, out_max) {return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;}



//EXPERIMENTAL BEYOND THIS POINT
var nSamples = 2048;
var dist = 0;
var wsCurve = new Float32Array(nSamples);

function createWSCurve(amount, n_samples) {
    
    if ((amount >= 0) && (amount < 1)) {
        
        dist = amount;

        var k = 2 * dist / (1 - dist);

        for (var i = 0; i < n_samples; i+=1) {
            // LINEAR INTERPOLATION: x := (c - a) * (z - y) / (b - a) + y
            // a = 0, b = 2048, z = 1, y = -1, c = i
            var x = (i - 0) * (1 - (-1)) / (n_samples - 0) + (-1);
            wsCurve[i] = (1 + k) * x / (1+ k * Math.abs(x));
        }
   
    }
}

function setDistortion(distValue) {
    var distCorrect = distValue;
    if (distValue < -1) {
        distCorrect = -1;
    }
    if (distValue >= 1) {
        distCorrect = 0.985;
    }
    //dist = distCorrect;
    createWSCurve (distCorrect, nSamples);
    console.log ("dist is ", dist);
}

