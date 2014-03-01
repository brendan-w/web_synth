
var tracks = [];
var audioCtx;
var destination_Node;


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


function init() {
	if(getAudioContext())
	{
		addTrack();
	}
	else
	{
		console.log("couldn't get audio context");
	}
}

window.onload = init;