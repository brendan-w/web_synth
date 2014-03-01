
var tracks = [];
var audioCtx;
var destination_Node;
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
	return true;
}


function addTrack() {
	tracks.push(new Track());
}

function deleteTrack(num) {

}

function step()
{
	for(var i = 0; i < tracks.length; i++)
	{
		tracks[i].step(currentBeat);
	}

	//advance the beat number, and loop off the end
	currentBeat++;
	currentBeat = currentBeat % beatsPerMeasure;

	setTimeout(step, waitTime);
}


function init() {
	if(getAudioContext())
	{
		addTrack();
		//step();
	}
	else
	{
		console.log("couldn't get audio context");
	}
}

window.onload = init;