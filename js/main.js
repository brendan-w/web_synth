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
var tempoRow;
var tempoLights = [];
var addBeat;
var subBeat;
var numBeats
var addButton;


/*
 * Event Handlers for UI elements
 */

function tempoChanged(e) {
	beatsPerMinute = e.target.value;
	start(); //restart, with the new tempo
}

function beatsChanged(e) {
	var increment = e.target.getAttribute("value");
	increment = parseInt(increment);
	beatsPerMeasure += increment;
	beatsPerMeasure = Math.clamp(beatsPerMeasure, minBeats, maxBeats);
	numBeats.innerHTML = beatsPerMeasure;
	update();
}




/*
 * public functions
 */

//tries to get an audio context, calls init() if successful
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


function update(e) {
	for(var i = 0; i < tracks.length; i++)
	{
		tracks[i].update();
	}

	updateTempoLights();
}

function updateTempoLights() {
	removeChildren(tempoRow);
	tempoLights = new Array();

	for(var x = 0; x < beatsPerMeasure; x++)
	{
		//create the table cell
		var td = document.createElement("td");
		tempoRow.appendChild(td);
		
		//create the light graphic
		var light = document.createElement("div");
		light.setAttribute("x", x);
		td.appendChild(light);
		tempoLights[x] = light;
	}
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
	//advance the beat number, and loop off the end
	currentBeat++;
	currentBeat = currentBeat % beatsPerMeasure;

	tempoLights[currentBeat].className = "true";
	tempoLights[Math.mod((currentBeat - 1), beatsPerMeasure)].className = "";

	for(var i = 0; i < tracks.length; i++)
	{
		tracks[i].beat();
	}
}


function init() {

	tempoRow = document.querySelector("#main table tr");
	updateTempoLights();

	//make the button to add more tracks
	addButton = document.querySelector("#addTrack");
	addButton.addEventListener("click", addTrack);
	
	tempoSlider = document.querySelector("#tempo");
	tempoSlider.addEventListener("change", tempoChanged);

	addBeat = document.querySelector("#addBeat");
	addBeat.addEventListener("click", beatsChanged);

	subBeat = document.querySelector("#subBeat");
	subBeat.addEventListener("click", beatsChanged);

	numBeats = document.querySelector("#numBeats");

	//make the first track
	addTrack();

	//start it running
	start();
}

window.onload = getAudioContext;
