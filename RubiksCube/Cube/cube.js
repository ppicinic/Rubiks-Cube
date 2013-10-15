/*
    cube.js - Drawable WebGL cube object definition

    IMPORTANT NOTE:
    This scripts assumes that the initGL.js script has already been loaded,
    and that consequently a variety of global variables are already defined,
    such as: gl, drawables, X_AXIS, Y_AXIS, Z_AXIS
*/

/*
    Constructor for ColorCube objects
    TODO add additional parameter(s) so we can specify colors for each face
        and we probably should pass these through to init()
 */
var Cube = function (program, fcolors) { this.init(program, fcolors); }

/* Initialize properties of this color cube object. */
Cube.prototype.init = function(program, fcolors)
{
    this.points = []; // this array will hold raw vertex positions
    this.colors = []; // this array will hold per-vertex color data
    this.transform = mat4(); // initialize object transform as identity matrix
	this.animate = false;
	this.rot = 0;

    // TODO make sure we pass the face colors into this call
    this.mkcube(fcolors); // delegate to auxiliary function

    this.program = program; // Load shaders and initialize attribute buffers

    this.cBufferId = gl.createBuffer(); // reserve a buffer object
    gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferId ); // set active array buffer
    /* send vert colors to the buffer, must repeat this
       wherever we change the vert colors for this cube */
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );

    this.vBufferId = gl.createBuffer(); // reserve a buffer object
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set active array buffer
    /* send vert positions to the buffer, must repeat this
       wherever we change the vert positions for this cube */
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );
}

Cube.prototype.draw = function(){
    gl.useProgram( this.program ); // set the current shader programs

    var projId = gl.getUniformLocation(this.program, "projection"); 
    gl.uniformMatrix4fv(projId, false, flatten(projection));

    var xformId = gl.getUniformLocation(this.program, "modeltransform");
    gl.uniformMatrix4fv(xformId, false, flatten(this.transform));
	
	if(this.animate) {
		
		if(this.rot < 0) {
			this.turn(-1, 1);
			this.rot += 1;
		}
		else if(this.rot > 0) {
			this.turn(1, 1);
			this.rot -= 1;
		}
		else {
			this.animate = false;
		}
	}

    gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferId ); // set active array buffer
    // map buffer data to the vertex shader attribute
    var vColorId = gl.getAttribLocation( this.program, "vColor" );
    gl.vertexAttribPointer( vColorId, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorId );

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set active array buffer
    // map buffer data to the vertex shader attribute
    var vPosId = gl.getAttribLocation( this.program, "vPosition" );
    gl.vertexAttribPointer( vPosId, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosId );

    // now push buffer data through the pipeline to render this object
    gl.drawArrays( gl.TRIANGLES, 0, this.numverts() );
}

/* Returns the total count of vertices to be sent into the pipeline. */
Cube.prototype.numverts = function() {return this.points.length;};

/* Default vertex positions for unit cube centered at the origin. */
Cube.prototype.vertices = [
    [ -0.5, -0.5,  0.5, 1.0 ],
    [ -0.5,  0.5,  0.5, 1.0 ],
    [  0.5,  0.5,  0.5, 1.0 ],
    [  0.5, -0.5,  0.5, 1.0 ],
    [ -0.5, -0.5, -0.5, 1.0 ],
    [ -0.5,  0.5, -0.5, 1.0 ],
    [  0.5,  0.5, -0.5, 1.0 ],
    [  0.5, -0.5, -0.5, 1.0 ]
];



/* Default vertex colors for the color cube. */
Cube.prototype.vcolors = [
    [ 0.0, 0.0, 0.0, 1.0 ], // black
    [ 1.0, 0.0, 0.0, 1.0 ], // red
    [ 1.0, 1.0, 0.0, 1.0 ], // yellow
    [ 0.0, 1.0, 0.0, 1.0 ], // green
    [ 0.0, 0.0, 1.0, 1.0 ], // blue
    [ 1.0, 0.0, 1.0, 1.0 ], // magenta
    [ 1.0, 1.0, 1.0, 1.0 ], // white
    [ 0.0, 1.0, 1.0, 1.0 ]  // cyan
];

/*
    Build one of the faces for this cube object.

    TODO change this so that we specify a single color (via a
        parameter) for the quad face instead of using vcolors
*/
Cube.prototype.mkquad = function(a, b, c, d, color)
{
    this.points.push( vec4(this.vertices[a]) );
    this.colors.push( vec4( color ));

    this.points.push( vec4(this.vertices[b]) );
    this.colors.push( vec4( color ));

    this.points.push( vec4(this.vertices[c]) );
    this.colors.push( vec4( color ));

    this.points.push( vec4(this.vertices[a]) );
    this.colors.push( vec4( color ));

    this.points.push( vec4(this.vertices[c]) );
    this.colors.push( vec4( color ));

    this.points.push( vec4(this.vertices[d]) );
    this.colors.push( vec4( color ));
}

Cube.prototype.rotCube = function(rotAngle) {
	if(this.animate == false) {
		this.rot = rotAngle;
		this.animate = true;
	}
}

/*
    Build all faces of this cube object.
    TODO change this so that we specify the colors (via parameter)
        for the different faces and pass them into mkquad 
*/
Cube.prototype.mkcube = function(color)
{
    this.mkquad( 1, 0, 3, 2, color[0] );
    this.mkquad( 2, 3, 7, 6, color[1] );
    this.mkquad( 3, 0, 4, 7, color[2] );
    this.mkquad( 6, 5, 1, 2, color[3] );
    this.mkquad( 4, 5, 6, 7, color[4] );
    this.mkquad( 5, 4, 0, 1, color[5] );
}

/* Translate this cube along the specified canonical axis. */
Cube.prototype.move = function(dist, axis){
    var delta = [0, 0, 0];

    if (axis === undefined) axis = Y_AXIS;
    delta[axis] = dist;

    this.transform = mult(translate(delta), this.transform);
}

/* Rotate this cube around the specified canonical axis. */
Cube.prototype.turn = function(angle, axis){
    var avec = [0, 0, 0];

    if (axis === undefined) axis = Y_AXIS;
    avec[axis] = .5;

    this.transform = mult(rotate(angle, avec), this.transform);
	//this.transform = mult(this.transform, [ [.999, -.0174, 1, 1], [.0174, .999, 1, 1], [0,0,1,1], [0,0,0,1],  ])
	//this.transform = mult(translate([1.0 / 90, 0, -1.0 / 90]), this.transform);
}

/* Set up event callback to start the application */
window.onload = function() {
    initGL(); // basic WebGL setup for the scene 

    // load and compile our shaders into a program object
    var shaders = initShaders( gl, "vertex-shader", "fragment-shader" );
	
	var BLACK = [0.0, 0.0, 0.0, 1.0];
	var WHITE = [1.0, 1.0, 1.0, 1.0];
	var RED = [1.0, 0.0, 0.0, 1.0];
	var GREEN = [0.1, .75, 0.1, 1.0];
	var BLUE = [0.0, 0.0, 1.0, 1.0];
	var YELLOW = [1.0, 1.0, 0.0, 1.0];
	var RED = [1.0, 0.0, 0.0, 1.0];
	var ORANGE = [1.0, .75, 0.0, 1.0];
	
	var colorsmid = [
    [ 1.0, 1.0, 1.0, 1.0 ], // black
    [ 1.0, 0.0, 0.0, 1.0 ], // red
    [ 1.0, 1.0, 0.0, 1.0 ], // yellow
    [ 0.0, 1.0, 0.0, 1.0 ], // green
    [ 0.0, 0.0, 1.0, 1.0 ], // blue
    [ 1.0, 0.0, 1.0, 1.0 ] // magenta
	];
	
	var colorstop = [
    [ 1.0, 0.0, 0.0, 1.0 ],
    [ 0.0, 0.0, 1.0, 1.0 ],
    [ 0.0, 0.8, 1.0, 1.0 ],
    [ 0.0, 0.9, 1.0, 1.0 ],
    [ 0.0, 0.0, 1.0, 1.0 ],
    [ 0.0, 0.9, 1.0, 1.0 ] 
	];
	
	var colorsbot = [
    [ 1.0, 0.0, 1.0, 1.0 ], 
    [ 1.0, 0.0, 0.0, 1.0 ], 
    [ 0.8, 0.0, 0.0, 1.0 ], 
    [ 0.7, 1.0, 0.0, 1.0 ], 
    [ 0.0, 0.0, .866, 1.0 ], 
    [ 1.0, 0.0, 0.5, 1.0 ] 
	];
	
	
	var cubeArray = new Array(3);
	for(var x = 0; x < 3; x++) {
		cubeArray[x] = new Array(3);
		for(var y = 0; y < 3; y++) {
			cubeArray[x][y] = new Array(3);
		}
	}
	for(var x = 0; x < 3; x++) {
		for(var y = 0; y < 3; y++) {
			for(var z = 0; z < 3; z++) {
			var top = BLACK;
			var bot = BLACK;
			var left = BLACK;
			var right = BLACK;
			var front = BLACK;
			var back = BLACK;
			if(y == 0) {
				top = WHITE;
			}
			if(y == 2) {
				bot = YELLOW;
			}
			if(x == 0) {
				left = GREEN;
			}
			if(x == 2) {
				right = BLUE;
			}
			if(z == 0) {
				front = RED;
			}
			if(z == 2) {
				back = ORANGE;
			}
			var temp = new Cube(shaders, [front,right,bot,top,back,left], false);
			if(x == 0) {
				temp.move(-1.01, 0);
			}
			if(x == 2) {
				temp.move(1.01, 0);
			}
			if(y == 0) {
				temp.move(1.01);
			}
			if(y == 2) {
				temp.move(-1.01);
			}
			if(z == 0) {
				temp.move(1.01, 2);
			}
			if(z == 2) {
				temp.move(-1.01, 2)
			}
			
			cubeArray[x][y][z] = temp;
			}
		}
	}
    // create a cube centered at the origin
    /*var cmid = new Cube(shaders, colorsmid, false);
	
	var cftm = new Cube(shaders, [RED,BLACK,BLACK,WHITE,BLACK,BLACK], false);
	cftm.move(1.0);
	cftm.move(1.0, 2);
	var cftr = new Cube(shaders, [RED,BLUE,BLACK,WHITE,BLACK,BLACK], false);
	cftr.move(1.0);
	cftr.move(1.0, 0);
	cftr.move(1.0, 2);
	var cftl = new Cube(shaders, [RED,BLACK,BLACK,WHITE,BLACK,GREEN], true);
	cftl.move(1.0);
	cftl.move(-1.0, 0);
	cftl.move(1.0, 2);
	var cfml = new Cube(shaders, [RED,BLACK,BLACK,BLACK,BLACK,GREEN], true);
	cfml.move(-1.0, 0);
	cfml.move(1.0, 2);
	var cfmm = new Cube(shaders, [RED,BLACK,BLACK,BLACK,BLACK,BLACK], true);
	cfmm.move(1.0, 2);
	var cfmr = new Cube(shaders, [RED,BLUE,BLACK,BLACK,BLACK,BLACK], true);
	cfmr.move(1.0, 0);
	cfmr.move(1.0, 2);
	var cfbl = new Cube(shaders, [RED,BLACK,YELLOW,BLACK,BLACK,GREEN], true);
	cfbl.move(-1.0);
	cfbl.move(-1.0, 0);
	cfbl.move(1.0, 2);
	var cfbm = new Cube(shaders, [RED,BLACK,YELLOW,BLACK,BLACK,BLACK], true);
	cfbm.move(-1.0);
	cfbm.move(1.0, 2);
	var cfbr = new Cube(shaders, [RED,BLUE,YELLOW,BLACK,BLACK,BLACK], true);
	cfbr.move(-1.0);
	cfbr.move(1.0, 0);
	cfbr.move(1.0, 2);*/
	
	
	//var cfmr = new Cube(shaders, [RED,BLUE,BLACK,BLACK,BLACK,BLACK], false);
	/*crtop.move(1.0);
	crtop.move(1.0, 0);
	crmid.move(1.0, 0);
	ctop.move(1.0);
	cbot.move(-1.0);
	crbot.move(-1.0);
	crbot.move(1.0, 0);
	crbot.move(1.0, 2);
	ctop.move(1.0, 2);
	cfrtop.move(1.0);
	cfrtop.move(1.0, 0);
	cfrtop.move(1.0, 2);
	cfltop.move(1.0);
	cfltop.move(-1.0, 0);
	cfltop.move(1.0, 2);
	cfrmid.move(1.0, 2);
	cfrmid.move(1.0, 0);*/
	

    // TODO create two additional cubes above and below the middle one
    // ...

    // TODO include the two new cubes here as well
    //drawables.push(cmid); // add all cubes to our list of drawables
	for(var x = 0; x < 3; x++) {
		for(var y = 0; y < 3; y++) {
			for(var z = 0; z < 3; z++) {
			drawables.push(cubeArray[x][y][z]);
			}
		}
	}
	
	var f = document.getElementById("Btn_TR");
    f.addEventListener("click",
        function(){
			for(var x = 0; x < 3; x++){
				for(var z = 0; z < 3; z++) {
					cubeArray[x][0][z].rotCube(90);
				}
			}
        },
        false
    );

    // set up an event handler for this button
    var b = document.getElementById("Btn_TL");
    b.addEventListener("click",
        function(){
			for(var x = 0; x < 3; x++){
				for(var z = 0; z < 3; z++) {
					cubeArray[x][0][z].rotCube(-90);
				}
			}
        },
        false
    );
	//drawables.push(cbot);
	//drawables.push(crtop);
	//drawables.push(crmid);
	//drawables.push(crbot);
	//drawables.push(cfrtop);
	//drawables.push(cfltop);
	//drawables.push(cfrmid);
	

    renderScene(); // begin render loop
}
