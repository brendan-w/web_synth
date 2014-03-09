/*
 * array2D.js
 *
 * Functions for handling 2D arrays in javascript.
 * 
 */

//function that makes a 2D array, and fills it with default values
function make2D(ny, nx, defaultValue)
{
	var array = new Array();
	for(var y = 0; y < ny; y++)
	{
		array[y] = new Array();
		for(var x = 0; x < nx; x++)
		{
			array[y][x] = defaultValue;
		}
	}

	return array;
}


//debug only
function print2D(array)
{
	var cy = array.length;
	var cx = array[0].length;

	for(var y = 0; y < cy; y++)
	{
		var line = "";
		for(var x = 0; x < cx; x++)
		{
			if(array[y][x])
			{
				line += "1_";
			}
			else
			{
				line += "0_";
			}
		}
		console.log(line);
	}
}

/*
 * function for resizing a row-major 2D array, while maintaining the existing data
 *
 * array = row-major 2D array
 * ny, nx = new array dimensions
 * yEnd = adds and deletes new elements at END of y-axis (set false to operate at the beginning)
 * XEnd = adds and deletes new elements at END of x-axis (set false to operate at the beginning)
 * defaultValue = default value for new elements
 */
function resize2D(array, ny, nx, yEnd, xEnd, defaultValue) {
	if(array)
	{
		//pre-flight checks
		if(yEnd === undefined) { yEnd = true; }
		if(xEnd === undefined) { xEnd = true; }
		if(defaultValue === undefined) { defaultValue = 0; }

		//get the current dimensions of the array
		var cy = array.length;
		var cx = array[0].length;

		//create the new array with the new dimensions
		var newArray = make2D(ny, nx, defaultValue);

		//fill the new array with the old values from the source array
		for(var y = 0; y < cy; y++)
		{
			for(var x = 0; x < cx; x++)
			{
				var destY = y;
				var destX = x;
				if(!yEnd) { destY = ny - cy + y; }
				if(!xEnd) { destX = nx - cx + x; }
				if((destY >= 0) && (destX >= 0)) //if it doesn't fall off the lower bounds
				{
					if((destY < ny) && (destX < nx)) //if it doesn't fall off the upper bounds
					{
						newArray[destY][destX] = array[y][x];
					}
				}
			}
		}

		return newArray;
	}
}


//function for shifting an array up/down/left/right. Values loop
function shift2D(array, yShift, xShift) {
	if(array)
	{
		//get the current dimensions of the array
		var cy = array.length;
		var cx = array[0].length;

		//var temp = make2D(Math.abs(yShift), Math.abs(xShift), false);

		for(var y = 0; y < cy; y++)
		{
			for(var x = 0; x < cx; x++)
			{
				
			}
		}
	}
}
