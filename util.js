/*
 * Data & Settings
 */

var scales = [
	//intervals = number of half steps
	{name: "major", intervals:[2, 2, 1, 2, 2, 2, 1]},
	{name: "minor", intervals:[2, 1, 2, 2, 1, 2, 2]},
	{name: "blues", intervals:[3, 2, 1, 1, 3, 2]}
];
var keys = [
	//frequencies at octave 4
	{name: "C", frequency: 261.63},
	{name: "C#", frequency: 277.18},
	{name: "D", frequency: 293.66},
	{name: "D#", frequency: 311.13},
	{name: "E", frequency: 329.63},
	{name: "F", frequency: 349.23},
	{name: "F#", frequency: 369.99},
	{name: "G", frequency: 392.00},
	{name: "G#", frequency: 415.30},
	{name: "A", frequency: 440.00},
	{name: "A#", frequency: 466.16},
	{name: "B", frequency: 493.88}
];
var tones = [];
var beatsPerMeasure = 8; //matrix width
var beatsPerMinute = 120; //speed




/*
 * Utilities
 */

function getWaitTime() { return 60000 / beatsPerMinute; } //converts BPM to milliseconds

//takes a note on a given scale, and returns the frequency at that key and octave
function getFrequency(note, scale, key, octave)
{
	var halfSteps = 0;
	for(var i = 0; i < note; i++)
	{
		halfSteps += scales[scale].intervals[i];
	}

	key = (key + halfSteps) % keys.length;

	

	return ;
}

//returns css for a different color (for as long as it can)
function colorForIndex(n)
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