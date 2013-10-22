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
	// Create an 3 dimensional array to store the cubes
	this.cubeArray = new Array(3);
	for(var x = 0; x < 3; x++) {
		this.cubeArray[x] = new Array(3);
		for(var y = 0; y < 3; y++) {
			this.cubeArray[x][y] = new Array(3);
		}
	}
	
	this.isShuffle = false;
	
	
	
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
	if(this.isShuffle){
		sAxis = Math.floor(Math.random() * 3);
		sFace = Math.floor(Math.random() * 3);
		this.rotate(sAxis, sFace);
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
				
				var cube = new Cube(shaders, [TOP, BOT, LEFT, RIGHT, BACK, FRONT]);
				
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
						this.cubeArray[x][y][z].rotCube(axis, 90);
					}
					else if(axis == 1 && y == face){
						this.cubeArray[x][y][z].rotCube(axis, 90);
					}
					else if(axis == 2 && z == face){
						this.cubeArray[x][y][z].rotCube(axis, -90);
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
					if(y == 0 && z == 0){
						faceArray[2][0] = this.cubeArray[face][y][z];
					}
					if(y == 0 && z == 1){ faceArray[1][0] = this.cubeArray[face][y][z];}
					if(y == 0 && z == 2){ faceArray[0][0] = this.cubeArray[face][y][z];}
					if(y == 1 && z == 0){ faceArray[2][1] = this.cubeArray[face][y][z];}
					if(y == 1 && z == 1){ faceArray[1][1] = this.cubeArray[face][y][z];}
					if(y == 1 && z == 2){ faceArray[0][1] = this.cubeArray[face][y][z];}
					if(y == 2 && z == 0){ faceArray[2][2] = this.cubeArray[face][y][z];}
					if(y == 2 && z == 1){ faceArray[1][2] = this.cubeArray[face][y][z];}
					if(y == 2 && z == 2){ faceArray[0][2] = this.cubeArray[face][y][z];}
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
					if(x == 0 && z == 0){
						faceArray[2][0] = this.cubeArray[x][face][z];
					}
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
			
			for(var x = 0; x < 3; x++){
				for(var z = 0; z < 3; z++) {
					this.cubeArray[x][face][z] = faceArray[x][z];
				}
			}
		}
		else if(axis == 2) {
			for(var x = 0; x < 3; x++){
				for(var y = 0; y < 3; y++) {
					if(x == 0 && y == 0){
						faceArray[2][0] = this.cubeArray[x][y][face];
					}
					if(x == 0 && y == 1){ faceArray[1][0] = this.cubeArray[x][y][face];}
					if(x == 0 && y == 2){ faceArray[0][0] = this.cubeArray[x][y][face];}
					if(x == 1 && y == 0){ faceArray[2][1] = this.cubeArray[x][y][face];}
					if(x == 1 && y == 1){ faceArray[1][1] = this.cubeArray[x][y][face];}
					if(x == 1 && y == 2){ faceArray[0][1] = this.cubeArray[x][y][face];}
					if(x == 2 && y == 0){ faceArray[2][2] = this.cubeArray[x][y][face];}
					if(x == 2 && y == 1){ faceArray[1][2] = this.cubeArray[x][y][face];}
					if(x == 2 && y == 2){ faceArray[0][2] = this.cubeArray[x][y][face];}
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

Rubiks.prototype.shuffle = function() {
	this.isShuffle = true;
}