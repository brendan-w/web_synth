
var tracks = [];
var audioCtx;
var destination_node;
var waitTime = getWaitTime();
var currentBeat = 0;


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


function addTrack() {
	tracks.push(new Track());
}

function deleteTrack(num) {
	tracks[num].destruct();
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
		addTrack();
		//beat();

	}
	else
	{
		console.log("couldn't get audio context");
	}
}

window.onload = init;