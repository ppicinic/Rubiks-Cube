/* 
*
* Rubiks IO Class
* This class wraps the Rubiks Cube Class
* and handles all IO and makes the correct calls
*
*/

var RubiksIO = function (rubiksCube) { this.init(rubiksCube); }

RubiksIO.prototype.init = function(rubiksCube) 
{
	this.rubiks = rubiksCube;
	this.stateString = "WWWWWWWWWGGGRRRBBBGGGRRRBBBGGGRRRBBBYYYYYYYYYOOOOOOOOO";
	this.solveString = "";
}

RubiksIO.prototype.state = function(stateString)
{
	stateString = stateString.split(' ').join('')
	stateString = stateString.toUpperCase();
	this.stateString = stateString;
	this.rubiks.state(this.stateString);
}

RubiksIO.prototype.solve = function(solveString)
{
	solveString = solveString.split(' ').join('');
	solveString = solveString.toUpperCase();
	this.solveString = solveString;
	this.rubiks.solve(this.solveString);
}

RubiksIO.prototype.replay = function()
{
	if(this.stateString.length > 0){
		this.rubiks.state(this.stateString);
		if(this.solveString.length > 0){
			this.rubiks.solve(this.solveString);
		}
	}
}