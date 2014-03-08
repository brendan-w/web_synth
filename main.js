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
var currentTimer;

//UI
var tempoSlider;
var tempoLights = [];
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
   		console.log("couldn't get audio context");
   		//print html error message
	}

	destination_node = audioCtx.destination;

	init();
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

function tempoChanged() {
	beatsPerMinute = tempoSlider.value;
	console.log(beatsPerMinute);
	start(); //restart, with the new tempo
}


function start() {
	if(currentTimer !== undefined)
	{
		clearInterval(currentTimer);
	}
	currentTimer = setInterval(beat, getWaitTime());
}

//main loop for the site, fires on every beat (rate is set by BPM)
function beat() {
	tempoLights[currentBeat].className = "true";
	tempoLights[mod((currentBeat - 1), beatsPerMeasure)].className = "";

	for(var i = 0; i < tracks.length; i++)
	{
		tracks[i].beat();
	}

	//advance the beat number, and loop off the end
	currentBeat++;
	currentBeat = currentBeat % beatsPerMeasure;
}


function init() {
	//initialize the #main setcion
	var tr = document.querySelector("#main table tr");

	for(var x = 0; x < beatsPerMeasure; x++)
	{
		//create the table cell
		var td = document.createElement("td");
		tr.appendChild(td);
		
		//create the light graphic
		var light = document.createElement("div");
		light.setAttribute("x", x);
		td.appendChild(light);
		tempoLights[x] = light;
	}

	//make the button to add more tracks
	addButton = document.querySelector("#addTrack");
	addButton.addEventListener("click", addTrack);
	
	tempoSlider = document.querySelector("#tempo");
	tempoSlider.addEventListener("change", tempoChanged);

	//make the first track
	addTrack();

	//start it running
	start();
}

window.onload = getAudioContext;
