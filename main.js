
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

/*
function test() {
	var oscil = audioCtx.createOscillator();
	oscil.connect(audioCtx.destination);
	
	//oscil.setWaveTable(waveTable);
	oscil.type = "triangle";
	

	var scale = 2;
	var key = 0;
	var octave = 4;


	//runs it for 1 second
	oscil.start(0);

	setTimeout(function(){
		oscil.frequency.value = getFrequency(0,scale,key,octave);
	}, 0);
	setTimeout(function(){
		oscil.frequency.value = getFrequency(1,scale,key,octave);
	}, 200);
	setTimeout(function(){
		oscil.frequency.value = getFrequency(2,scale,key,octave);
	}, 400);
	setTimeout(function(){
		oscil.frequency.value = getFrequency(3,scale,key,octave);
	}, 600);
	setTimeout(function(){
		oscil.frequency.value = getFrequency(4,scale,key,octave);
	}, 800);
	setTimeout(function(){
		oscil.frequency.value = getFrequency(5,scale,key,octave);
	}, 1000);
	setTimeout(function(){
		oscil.frequency.value = getFrequency(6,scale,key,octave);
	}, 1200);
	setTimeout(function(){
		oscil.frequency.value = getFrequency(7,scale,key,octave);
	}, 1400);


	setTimeout(function(){
		oscil.stop(0);
	}, 1600);
}
*/

function init() {
	if(getAudioContext())
	{
		addTrack();
		addTrack();
		//beat();
		//test();

	}
	else
	{
		console.log("couldn't get audio context");
	}
}

window.onload = init;