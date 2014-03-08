/*
 * Main.js
 *
 * Entry point. File handles globals like the track list, the audio context, and timing events.
 *
 */

"use strict";

//audio objects
var tracks = [];
var audioCtx;
var destination_node;

//running vars
var currentBeat = 0;

//UI
var addButton;



//tries to get an audio context
function getAudioContext() {
	if (typeof AudioContext !== "undefined")
	{
		//firefox
   		audioCtx = new AudioContext();
	}
	else if (typeof webkitAudioContext !== "undefined")
	{
		//chrome and safari
   		audioCtx = new webkitAudioContext();
	}
	else
	{
   		return false;
	}

	destination_node = audioCtx.destination;
	return true;
}

//called by addButton clicks
function addTrack() {
	tracks.push(new Track());
}

//called by tracks themselves
function deleteTrack(num) {
	tracks.splice(num, 1);
}


function updateTracks(e) {
	
	//beatsPerMeasure++;

	for(var i = 0; i < tracks.length; i++)
	{
		tracks[i].update();
	}
}


//main loop for the site, fires on every beat (rate is set by BPM)
function beat()
{
	//setTimeout(beat, getWaitTime()); //do this first because the code below takes time to run

	for(var i = 0; i < tracks.length; i++)
	{
		tracks[i].beat();
	}

	//advance the beat number, and loop off the end
	currentBeat++;
	currentBeat = currentBeat % beatsPerMeasure;
}


function init() {
	if(getAudioContext())
	{
		//make the first track
		addTrack();

		//make the button to add more tracks
		addButton = document.querySelector("#addTrack");
		addButton.addEventListener("click", addTrack);
		
		//start it running
		//beat();
		setInterval(beat, getWaitTime());
	}
	else
	{
		console.log("couldn't get audio context");
	}
}

window.onload = init;
