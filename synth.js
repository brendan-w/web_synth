var synth = function()
{
	//private variables
	this.tracks = [];
	this.audioCtx;
	this.destination_Node;


	//functions
	this.getAudioContext = function() {
		if (typeof AudioContext !== "undefined")
		{
    		this.audioCtx = new AudioContext();
		}
		else if (typeof webkitAudioContext !== "undefined")
		{
    		this.audioCtx = new webkitAudioContext();
		}
		else
		{
    		return false;
		}
		return true;
	};

	this.addTrack = function() {
		this.tracks.push(new Track);
	};

	this.deleteTrack = function(num) {

	};


	//constructor
		if(getAudioContext())
		{
			this.addTrack();
		}
		else
		{
			console.log("couldn't get audio context");
		}
	//end constructor

	return {
		tracks : this.tracks,
		addTrack : this.addTrack,
		deleteTrack : this.deleteTrack
	};
};