
var tracks = [];
var audioCtx;
var destination_node;
var waitTime = getWaitTime();
var currentBeat = 0;
var addButton;


function getAudioContext() {
	if (typeof AudioContext !== "undefined")
	{
   		audioCtx = new AudioContext();
	}
	else if (typeof webkitAudioContext !== "undefined")
	{
   		audioCtx = new webkitAudioContext();
	}
	else
	{
   		return false;
	}

	destination_node = audioCtx.destination;
	return true;
}

function listen()
{
	addButton = document.querySelector("#addTrack");
	addButton.addEventListener("click", addTrack);
}


function addTrack() {
	tracks.push(new Track());
}

function deleteTrack(num) {
	tracks.splice(num, 1);
}

function beat()
{
	for(var i = 0; i < tracks.length; i++)
	{
		tracks[i].beat();
	}

	//advance the beat number, and loop off the end
	currentBeat++;
	currentBeat = currentBeat % beatsPerMeasure;

	setTimeout(beat, waitTime);
}

function init() {
	if(getAudioContext())
	{
		addTrack();
		listen();
		//beat();

	}
	else
	{
		console.log("couldn't get audio context");
	}
}

window.onload = init;