/*
 * Settings
 */

var scales = [];
var tones = [];
var beatsPerMeasure = 8; //matrix width
var beatsPerMinute = 120; //speed




/*
 * Utilities
 */

function getWaitTime() { return 60000 / beatsPerMinute; } //converts BPM to milliseconds

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