/* 
*
* Rubiks IO Class
* This class wraps the Rubiks Cube Class
* and handles all IO and makes the correct calls
*
*/

/* Creates a RubiksIO class that wraps a rubiksCube and makes IO calls */
var RubiksIO = function (rubiksCube) { this.init(rubiksCube); }

RubiksIO.prototype.init = function(rubiksCube) 
{
	// The IO class has a reference to the Rubiks Cube
	this.rubiks = rubiksCube;
	
	// Holds the state and solution for replay
	this.stateString = "WWWWWWWWWGGGRRRBBBGGGRRRBBBGGGRRRBBBYYYYYYYYYOOOOOOOOO";
	this.solveString = "";
}

/* Sets the State of the Rubiks Cube that is wrapped */
RubiksIO.prototype.state = function(stateString)
{
	stateString = stateString.split(' ').join('')
	stateString = stateString.toUpperCase();
	this.stateString = stateString;
	this.rubiks.state(this.stateString);
}

/* Calls the Solution for the Rubiks Cube that is wrapped */
RubiksIO.prototype.solve = function(solveString)
{
	solveString = solveString.split(' ').join('');
	solveString = solveString.toUpperCase();
	this.solveString = solveString;
	this.rubiks.solve(this.solveString);
}

/* Replays the State and Solution of the Rubiks Cube that is wrapped */
RubiksIO.prototype.replay = function()
{
	if(this.stateString.length > 0){
		this.rubiks.state(this.stateString);
		if(this.solveString.length > 0){
			this.rubiks.solve(this.solveString);
		}
	}
}