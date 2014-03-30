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
var animated;


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
   		audioCtx = new AudioContext(); //firefox
	}
	else if (typeof webkitAudioContext !== "undefined")
	{
   		audioCtx = new webkitAudioContext(); //chrome and safari
	}
	else
	{
   		console.log("couldn't get audio context");
	}

	destination_node = audioCtx.destination;

	init();
}

//called by addButton clicks
function addTrack() {
	tracks.push(new Track());
}

//called by tracks themselves
function deleteTrack(obj) {
	var i = tracks.indexOf(obj);
	tracks.splice(i, 1);
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

	//start
	currentTimer = setInterval(beat, getWaitTime());
	window.requestAnimationFrame(frame);
}

//main loop for the site, fires on every beat (rate is set by BPM)
function beat() {
	//advance the beat number, and loop off the end
	currentBeat++;
	currentBeat = currentBeat % beatsPerMeasure;

	tempoLights[currentBeat].className = "true";
	tempoLights[Math.mod((currentBeat - 1), beatsPerMeasure)].className = "";

	tracks.forEach(function(track) {
		track.beat();
	});
}

function frame() {

	if(animated.checked)
	{
		tracks.forEach(function(track) {
			track.frame();
		});
	}

	window.requestAnimationFrame(frame);
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

	animated = document.querySelector("#animate");

	//make the first track
	addTrack();

	//start it running
	start();
}

window.onload = getAudioContext;
