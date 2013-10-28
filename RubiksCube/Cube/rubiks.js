/*
	Rubiks Cube Structure
	Takes care of creating all cubes.
	Reduces Complexity of loader file.
	Calls proper rotations and tracks cube positions
*/
/* Color Constants
*  TODO - Possibly move these to the Constants file?
*/

var BLACK = [0.0, 0.0, 0.0, 1.0];
var WHITE = [1.0, 1.0, 1.0, 1.0];
var RED = [1.0, 0.0, 0.0, 1.0];
var GREEN = [0.1, .75, 0.1, 1.0];
var BLUE = [0.0, 0.0, 1.0, 1.0];
var YELLOW = [1.0, 1.0, 0.0, 1.0];
var RED = [1.0, 0.0, 0.0, 1.0];
var ORANGE = [1.0, .75, 0.0, 1.0];

var Rubiks = function (program) { this.init(program); }

Rubiks.prototype.init = function(program) 
{
	this.shaders = program;
	// Create an 3 dimensional array to store the cubes
	this.cubeArray = new Array(3);
	for(var x = 0; x < 3; x++) {
		this.cubeArray[x] = new Array(3);
		for(var y = 0; y < 3; y++) {
			this.cubeArray[x][y] = new Array(3);
		}
	}
	
	this.isSolving = false;
	this.solveStack = new Array();
	
	
	this.frontface = "R";
	this.backface = "O";
	this.leftface = "G";
	this.rightface = "B";
	this.topface = "W";
	this.botface = "Y";
	
	// Populate array with all the cubes
	// 0 left, top, front 
	for(var x = 0; x < 3; x++) {
		for(var y = 0; y < 3; y++) {
			for(var z = 0; z < 3; z++) {
				var TOP = BLACK;
				var BOT = BLACK;
				var LEFT = BLACK;
				var RIGHT = BLACK;
				var FRONT = BLACK;
				var BACK = BLACK;
				if( x == 0){
					LEFT = GREEN;
				}
				if( x == 2){
					RIGHT = BLUE;
				}
				if( y == 0){
					TOP = WHITE;
				}
				if( y == 2){
					BOT = YELLOW;
				}
				if( z == 0){
					FRONT = RED;
				}
				if( z == 2){
					BACK = ORANGE;
				}
				
				var cube = new Cube(program, [FRONT, RIGHT, BOT, TOP, BACK, LEFT]);
				
				if( x == 0){
					cube.move(-1.01, 0);
				}
				if( x == 2){
					cube.move(1.01, 0);
				}
				if( y == 0){
					cube.move(1.01, 1);
				}
				if( y == 2){
					cube.move(-1.01, 1);
				}
				if( z == 0){
					cube.move(1.01, 2);
				}
				if( z == 2){
					cube.move(-1.01, 2);
				}
				this.cubeArray[x][y][z] = cube;
			}
		}
	}
	
}

/*
*  Rubiks draw function calls the draw function of all the cubes
*  This reduces loader complexity to a few calls
*/
Rubiks.prototype.draw = function()
{
	if(this.isSolving){
		this.solveDraw();
	}
	for(var x = 0; x < 3; x++) {
		for(var y = 0; y < 3; y++) {
			for(var z = 0; z < 3; z++) {
				this.cubeArray[x][y][z].draw();
			}
		}
	}
}

/* Recreates all the cubes setting the rubiks cube to the initial position */
Rubiks.prototype.reset = function()
{
	this.frontface = "R";
	this.backface = "O";
	this.leftface = "G";
	this.rightface = "B";
	this.topface = "W";
	this.botface = "Y";
	
	// Re-populate array with all the cubes 
	for(var x = 0; x < 3; x++) {
		for(var y = 0; y < 3; y++) {
			for(var z = 0; z < 3; z++) {
				var TOP = BLACK;
				var BOT = BLACK;
				var LEFT = BLACK;
				var RIGHT = BLACK;
				var FRONT = BLACK;
				var BACK = BLACK;
				if( x == 0){
					LEFT = GREEN;
				}
				if( x == 2){
					RIGHT = BLUE;
				}
				if( y == 0){
					TOP = WHITE;
				}
				if( y == 2){
					BOT = YELLOW;
				}
				if( z == 0){
					FRONT = RED;
				}
				if( z == 2){
					BACK = ORANGE;
				}
				
				var cube = new Cube(this.shaders, [FRONT, RIGHT, BOT, TOP, BACK, LEFT]);
				
				if( x == 0){
					cube.move(-1.01, 0);
				}
				if( x == 2){
					cube.move(1.01, 0);
				}
				if( y == 0){
					cube.move(1.01, 1);
				}
				if( y == 2){
					cube.move(-1.01, 1);
				}
				if( z == 0){
					cube.move(1.01, 2);
				}
				if( z == 2){
					cube.move(-1.01, 2);
				}
				this.cubeArray[x][y][z] = cube;
			}
		}
	}
}

Rubiks.prototype.convertColor = function(str) {
	if(str == 'G'){
		return GREEN;
	}
	if(str == 'O'){
		return ORANGE;
	}
	if(str == 'R'){
		return RED;
	}
	if(str == 'B'){
		return BLUE;
	}
	if(str == 'Y'){
		return YELLOW;
	}
	if(str == 'W'){
		return WHITE;
	}
	
}

Rubiks.prototype.getColor = function(pr, x, y, z, string) {
	if(pr == 0){
		if(x == 0){
			if(y == 0){
				if(z == 0){
					return this.convertColor(string[11]);
				}
				if(z == 1){
					return this.convertColor(string[10]);
				}
				if(z == 2){
					return this.convertColor(string[9]);
				}
			}
			if(y == 1){
				if(z == 0){
					return this.convertColor(string[20]);
				}
				if(z == 1){
					return this.convertColor(string[19]);
				}
				if(z == 2){
					return this.convertColor(string[18]);
				}
			}
			if(y == 2){
				if(z == 0){
					return this.convertColor(string[29]);
				}
				if(z == 1){
					return this.convertColor(string[28]);
				}
				if(z == 2){
					return this.convertColor(string[27]);
				}
			}
		}
		if(x == 2){
			if(y == 0){
				if(z == 0){
					return this.convertColor(string[15]);
				}
				if(z == 1){
					return this.convertColor(string[16]);
				}
				if(z == 2){
					return this.convertColor(string[17]);
				}
			}
			if(y == 1){
				if(z == 0){
					return this.convertColor(string[24]);
				}
				if(z == 1){
					return this.convertColor(string[25]);
				}
				if(z == 2){
					return this.convertColor(string[26]);
				}
			}
			if(y == 2){
				if(z == 0){
					return this.convertColor(string[33]);
				}
				if(z == 1){
					return this.convertColor(string[34]);
				}
				if(z == 2){
					return this.convertColor(string[35]);
				}
			}
		}
	}
	// Y color grab
	if(pr == 1){
		if(y == 0){
			if(x == 0){
				if(z == 0){
					return this.convertColor(string[6]);
				}
				if(z == 1){
					return this.convertColor(string[3]);
				}
				if(z == 2){
					return this.convertColor(string[0]);
				}
			}
			if(x == 1){
				if(z == 0){
					return this.convertColor(string[7]);
				}
				if(z == 1){
					return this.convertColor(string[4]);
				}
				if(z == 2){
					return this.convertColor(string[1]);
				}
			}
			if(x == 2){
				if(z == 0){
					return this.convertColor(string[8]);
				}
				if(z == 1){
					return this.convertColor(string[5]);
				}
				if(z == 2){
					return this.convertColor(string[2]);
				}
			}
		}
		if(y == 2){
			if(x == 0){
				if(z == 0){
					return this.convertColor(string[36]);
				}
				if(z == 1){
					return this.convertColor(string[39]);
				}
				if(z == 2){
					return this.convertColor(string[42]);
				}
			}
			if(x == 1){
				if(z == 0){
					return this.convertColor(string[37]);
				}
				if(z == 1){
					return this.convertColor(string[40]);
				}
				if(z == 2){
					return this.convertColor(string[43]);
				}
			}
			if(x == 2){
				if(z == 0){
					return this.convertColor(string[38]);
				}
				if(z == 1){
					return this.convertColor(string[41]);
				}
				if(z == 2){
					return this.convertColor(string[44]);
				}
			}
		}
	}
	// Z Color Grab
	if(pr == 2){
		if(z == 0){
			if(x == 0){
				if(y == 0){
					return this.convertColor(string[12]);
				}
				if(y == 1){
					return this.convertColor(string[21]);
				}
				if(y == 2){
					return this.convertColor(string[30]);
				}
			}
			if(x == 1){
				if(y == 0){
					return this.convertColor(string[13]);
				}
				if(y == 1){
					return this.convertColor(string[22]);
				}
				if(y == 2){
					return this.convertColor(string[31]);
				}
			}
			if(x == 2){
				if(y == 0){
					return this.convertColor(string[14]);
				}
				if(y == 1){
					return this.convertColor(string[23]);
				}
				if(y == 2){
					return this.convertColor(string[32]);
				}
			}
		}
		if(z == 2){
			if(x == 0){
				if(y == 0){
					return this.convertColor(string[51]);
				}
				if(y == 1){
					return this.convertColor(string[48]);
				}
				if(y == 2){
					return this.convertColor(string[45]);
				}
			}
			if(x == 1){
				if(y == 0){
					return this.convertColor(string[52]);
				}
				if(y == 1){
					return this.convertColor(string[49]);
				}
				if(y == 2){
					return this.convertColor(string[46]);
				}
			}
			if(x == 2){
				if(y == 0){
					return this.convertColor(string[53]);
				}
				if(y == 1){
					return this.convertColor(string[50]);
				}
				if(y == 2){
					return this.convertColor(string[47]);
				}
			}
		}
	}
}

Rubiks.prototype.state = function(string) {
	this.frontface = string[22];
	this.backface = string[49];
	this.leftface = string[19];
	this.rightface = string[25];
	this.topface = string[4];
	this.botface = string[40];
	// Re-populate array with all the cubes 
	for(var x = 0; x < 3; x++) {
		for(var y = 0; y < 3; y++) {
			for(var z = 0; z < 3; z++) {
				var TOP = BLACK;
				var BOT = BLACK;
				var LEFT = BLACK;
				var RIGHT = BLACK;
				var FRONT = BLACK;
				var BACK = BLACK;
				var temp = BLACK;
				if( x == 0){
					LEFT = this.getColor(0, x, y, z, string);
					//LEFT = GREEN;
				}
				if( x == 2){
					RIGHT = this.getColor(0, x, y, z, string);
				}
				if( y == 0){
					TOP = this.getColor(1, x, y, z, string);
				}
				if( y == 2){
					BOT = this.getColor(1, x, y, z, string);
				}
				if( z == 0){
					FRONT = this.getColor(2, x, y, z, string);
				}
				if( z == 2){
					BACK = this.getColor(2, x, y, z, string);
				}
				
				var cube = new Cube(this.shaders, [FRONT, RIGHT, BOT, TOP, BACK, LEFT]);
				
				if( x == 0){
					cube.move(-1.01, 0);
				}
				if( x == 2){
					cube.move(1.01, 0);
				}
				if( y == 0){
					cube.move(1.01, 1);
				}
				if( y == 2){
					cube.move(-1.01, 1);
				}
				if( z == 0){
					cube.move(1.01, 2);
				}
				if( z == 2){
					cube.move(-1.01, 2);
				}
				this.cubeArray[x][y][z] = cube;
			}
		}
	}
}
Rubiks.prototype.isAnimating = function() {
	var isAnimate = false;
	for(var x = 0; x < 3; x++) {
		for(var y = 0; y < 3; y++) {
			for(var z = 0; z < 3; z++) {
				if(this.cubeArray[x][y][z].isRotating()){
					isAnimate = true;
				}
			}
		}
	}
	return isAnimate;
}
Rubiks.prototype.rotate = function(axis, face) {
	var isAnimate = false;
	for(var x = 0; x < 3; x++) {
		for(var y = 0; y < 3; y++) {
			for(var z = 0; z < 3; z++) {
				if(this.cubeArray[x][y][z].isRotating()){
					isAnimate = true;
				}
			}
		}
	}
	if(!isAnimate) {
		// visual rotation of cubes
		for(var x = 0; x < 3; x++) {
			for(var y = 0; y < 3; y++) {
				for(var z = 0; z < 3; z++) {
					if(axis == 0 && x == face){
						if(face == 0){
							this.cubeArray[x][y][z].rotCube(axis, 90);
						}
						else if(face == 2){
							this.cubeArray[x][y][z].rotCube(axis, -90);
						}
					}
					else if(axis == 1 && y == face){
						if(face == 0){
							this.cubeArray[x][y][z].rotCube(axis, -90);
						}
						else if(face == 2){
							this.cubeArray[x][y][z].rotCube(axis, 90);
						}
					}
					else if(axis == 2 && z == face){
						if(face == 0){
							this.cubeArray[x][y][z].rotCube(axis, -90);
						}
						else if(face == 2){
							this.cubeArray[x][y][z].rotCube(axis, 90);
						}
					}
					else {}
				}
			}
		}
		var faceArray = new Array(3);
		for(x = 0; x < 3; x++){
			faceArray[x] = new Array(3);
		}
		if(axis == 0){
			for(var y = 0; y < 3; y++){
				for(var z = 0; z < 3; z++) {
					if(face == 0){
						if(y == 0 && z == 0){ faceArray[2][0] = this.cubeArray[face][y][z];}
						if(y == 0 && z == 1){ faceArray[1][0] = this.cubeArray[face][y][z];}
						if(y == 0 && z == 2){ faceArray[0][0] = this.cubeArray[face][y][z];}
						if(y == 1 && z == 0){ faceArray[2][1] = this.cubeArray[face][y][z];}
						if(y == 1 && z == 1){ faceArray[1][1] = this.cubeArray[face][y][z];}
						if(y == 1 && z == 2){ faceArray[0][1] = this.cubeArray[face][y][z];}
						if(y == 2 && z == 0){ faceArray[2][2] = this.cubeArray[face][y][z];}
						if(y == 2 && z == 1){ faceArray[1][2] = this.cubeArray[face][y][z];}
						if(y == 2 && z == 2){ faceArray[0][2] = this.cubeArray[face][y][z];}
					}
					else if(face == 2){
						if(y == 0 && z == 0){ faceArray[0][2] = this.cubeArray[face][y][z];}
						if(y == 0 && z == 1){ faceArray[1][2] = this.cubeArray[face][y][z];}
						if(y == 0 && z == 2){ faceArray[2][2] = this.cubeArray[face][y][z];}
						if(y == 1 && z == 0){ faceArray[0][1] = this.cubeArray[face][y][z];}
						if(y == 1 && z == 1){ faceArray[1][1] = this.cubeArray[face][y][z];}
						if(y == 1 && z == 2){ faceArray[2][1] = this.cubeArray[face][y][z];}
						if(y == 2 && z == 0){ faceArray[0][0] = this.cubeArray[face][y][z];}
						if(y == 2 && z == 1){ faceArray[1][0] = this.cubeArray[face][y][z];}
						if(y == 2 && z == 2){ faceArray[2][0] = this.cubeArray[face][y][z];}
					}
				}
			}
			
			for(var y = 0; y < 3; y++){
				for(var z = 0; z < 3; z++) {
					this.cubeArray[face][y][z] = faceArray[y][z];
				}
			}
		}
		else if(axis == 1) {
			for(var x = 0; x < 3; x++){
				for(var z = 0; z < 3; z++) {
					if(face == 0){
						if(x == 0 && z == 0){ faceArray[0][2] = this.cubeArray[x][face][z];}
						if(x == 0 && z == 1){ faceArray[1][2] = this.cubeArray[x][face][z];}
						if(x == 0 && z == 2){ faceArray[2][2] = this.cubeArray[x][face][z];}
						if(x == 1 && z == 0){ faceArray[0][1] = this.cubeArray[x][face][z];}
						if(x == 1 && z == 1){ faceArray[1][1] = this.cubeArray[x][face][z];}
						if(x == 1 && z == 2){ faceArray[2][1] = this.cubeArray[x][face][z];}
						if(x == 2 && z == 0){ faceArray[0][0] = this.cubeArray[x][face][z];}
						if(x == 2 && z == 1){ faceArray[1][0] = this.cubeArray[x][face][z];}
						if(x == 2 && z == 2){ faceArray[2][0] = this.cubeArray[x][face][z];}
					}
					else if(face == 2){
						if(x == 0 && z == 0){ faceArray[2][0] = this.cubeArray[x][face][z];}
						if(x == 0 && z == 1){ faceArray[1][0] = this.cubeArray[x][face][z];}
						if(x == 0 && z == 2){ faceArray[0][0] = this.cubeArray[x][face][z];}
						if(x == 1 && z == 0){ faceArray[2][1] = this.cubeArray[x][face][z];}
						if(x == 1 && z == 1){ faceArray[1][1] = this.cubeArray[x][face][z];}
						if(x == 1 && z == 2){ faceArray[0][1] = this.cubeArray[x][face][z];}
						if(x == 2 && z == 0){ faceArray[2][2] = this.cubeArray[x][face][z];}
						if(x == 2 && z == 1){ faceArray[1][2] = this.cubeArray[x][face][z];}
						if(x == 2 && z == 2){ faceArray[0][2] = this.cubeArray[x][face][z];}
					} 
				}
			}
			
			for(var x = 0; x < 3; x++){
				for(var z = 0; z < 3; z++) {
					this.cubeArray[x][face][z] = faceArray[x][z];
				}
			}
		}
		else if(axis == 2) {
			for(var x = 0; x < 3; x++){
				for(var y = 0; y < 3; y++) {
					if(face == 0){
						if(x == 0 && y == 0){ faceArray[2][0] = this.cubeArray[x][y][face];}
						if(x == 0 && y == 1){ faceArray[1][0] = this.cubeArray[x][y][face];}
						if(x == 0 && y == 2){ faceArray[0][0] = this.cubeArray[x][y][face];}
						if(x == 1 && y == 0){ faceArray[2][1] = this.cubeArray[x][y][face];}
						if(x == 1 && y == 1){ faceArray[1][1] = this.cubeArray[x][y][face];}
						if(x == 1 && y == 2){ faceArray[0][1] = this.cubeArray[x][y][face];}
						if(x == 2 && y == 0){ faceArray[2][2] = this.cubeArray[x][y][face];}
						if(x == 2 && y == 1){ faceArray[1][2] = this.cubeArray[x][y][face];}
						if(x == 2 && y == 2){ faceArray[0][2] = this.cubeArray[x][y][face];}
					}
					else if(face == 2){
						if(x == 0 && y == 0){ faceArray[0][2] = this.cubeArray[x][y][face];}
						if(x == 0 && y == 1){ faceArray[1][2] = this.cubeArray[x][y][face];}
						if(x == 0 && y == 2){ faceArray[2][2] = this.cubeArray[x][y][face];}
						if(x == 1 && y == 0){ faceArray[0][1] = this.cubeArray[x][y][face];}
						if(x == 1 && y == 1){ faceArray[1][1] = this.cubeArray[x][y][face];}
						if(x == 1 && y == 2){ faceArray[2][1] = this.cubeArray[x][y][face];}
						if(x == 2 && y == 0){ faceArray[0][0] = this.cubeArray[x][y][face];}
						if(x == 2 && y == 1){ faceArray[1][0] = this.cubeArray[x][y][face];}
						if(x == 2 && y == 2){ faceArray[2][0] = this.cubeArray[x][y][face];}
					}
				}
			}
			
			for(var x = 0; x < 3; x++){
				for(var y = 0; y < 3; y++) {
					this.cubeArray[x][y][face] = faceArray[x][y];
				}
			}
		}
	}
}

Rubiks.prototype.solveDraw = function() {
	if(!this.isAnimating()){
		var solveMove = this.solveStack.shift();
		this.rotate(solveMove[0], solveMove[1]);
		if(this.solveStack.length == 0){
			this.isSolving = false;
		}
	}
}

Rubiks.prototype.solve = function(solveString) {
	this.isSolving = true;
	for(var i = 0; i < solveString.length; i = i + 2){
		var faceString = solveString[i];
		var faceAxis = 0;
		var faceNum = 0;
		if(this.topface == faceString){
			faceAxis = 1;
			faceNum = 0;
		}
		if(this.botface == faceString){
			faceAxis = 1;
			faceNum = 2;
		}
		if(this.leftface == faceString){
			faceAxis = 0;
			faceNum = 0;
		}
		if(this.rightface == faceString){
			faceAxis = 0;
			faceNum = 2;
		}
		if(this.frontface == faceString){
			faceAxis = 2;
			faceNum = 0;
		}
		if(this.backface == faceString){
			faceAxis = 2;
			faceNum = 2;
		}
		var turnNum = parseInt(solveString[i + 1]);

		for(var j = 0; j < turnNum; j++){
			this.solveStack.push([faceAxis, faceNum]);
		}
		
	}
}