/*
    cube.js - Drawable WebGL cube object definition

    IMPORTANT NOTE:
    This scripts assumes that the initGL.js script has already been loaded,
    and that consequently a variety of global variables are already defined,
    such as: gl, drawables, X_AXIS, Y_AXIS, Z_AXIS
*/

/*
    Constructor for ColorCube objects
	Takes in specified colors
 */
var Cube = function (program, fcolors) { this.init(program, fcolors); }

/* Initialize properties of this color cube object. */
Cube.prototype.init = function(program, fcolors)
{
    this.points = []; // this array will hold raw vertex positions
    this.colors = []; // this array will hold per-vertex color data
    this.transform = mat4(); // initialize object transform as identity matrix
	this.animate = false; // knows whether the cube is rotating
	this.rot = 0; // knows the angle left to rotate
	this.rotAxis = X_AXIS; // knows the rotation axis

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

/* Draws the cube */
Cube.prototype.draw = function(){
    gl.useProgram( this.program ); // set the current shader programs

    var projId = gl.getUniformLocation(this.program, "projection"); 
    gl.uniformMatrix4fv(projId, false, flatten(projection));

    var xformId = gl.getUniformLocation(this.program, "modeltransform");
    gl.uniformMatrix4fv(xformId, false, flatten(this.transform));
	
	
	
	/*
		if the cube is orbiting turn it another degree
	*/
	if(this.animate) {
		
		if(this.rot < 0) {
			this.orbit(-3, this.rotAxis);
			this.rot += 3;
		}
		else if(this.rot > 0) {
			this.orbit(3, this.rotAxis);
			this.rot -= 3;
		}
		else {
			this.animate = false;
		}
	}

    
	
	var lightPosition = vec4(10.0, 4.0, 10.0, -1.0 );
    var lightAmbient = vec4(-0.0, -0.1, -0.1, -1.0 );
    var lightDiffuse = vec4( -1.0, -1.0, -1.0, -1.0 );
    var lightSpecular = vec4( -.4, -.35, -.45, -0.0 );
	

    var materialAmbient = vec4( 3.0, 2.0, 4.0,1.0 );
    var materialDiffuse = vec4( 0.5, 0.55, 0.5, 1.0 );
    var materialSpecular = vec4( 0.5, 1, 2, 0 );
	
	var lightPosition2 = vec4(-30.0, -20.0, -20.0, -2.0 );
	var lightAmbient2 = vec4(1, 1, 0.5, -0.0 );
	var lightDiffuse2 = vec4( 1, 1, 1.0, -1.0 );
	var lightSpecular2 = vec4( 1, 1.0, 1.0, 1.0 );

	var materialAmbient2 = vec4( 1.0, 0.0, 0.0, -1.0 );
	var materialDiffuse2 = vec4( .2, .2, .2, 0.0);
	var materialSpecular2 = vec4( 1, 2, 1, 1.0 );
    var materialShininess = 200.0;
    
        
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
	 var ambientProduct2 = mult(lightAmbient2, materialAmbient2);
    var diffuseProduct2 = mult(lightDiffuse2, materialDiffuse2);
    var specularProduct2 = mult(lightSpecular2, materialSpecular2);

   gl.uniform4fv( gl.getUniformLocation(this.program, "ambientProduct"),flatten(ambientProduct ));
    gl.uniform4fv( gl.getUniformLocation(this.program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(this.program, "specularProduct"),flatten(specularProduct));	
    gl.uniform4fv( gl.getUniformLocation(this.program, "lightPosition"), flatten(lightPosition));
    gl.uniform4fv( gl.getUniformLocation(this.program, "ambientProduct2"),flatten(ambientProduct2));
    gl.uniform4fv( gl.getUniformLocation(this.program, "diffuseProduct2"), flatten(diffuseProduct2) );
    gl.uniform4fv( gl.getUniformLocation(this.program, "specularProduct2"),flatten(specularProduct2));		
	gl.uniform4fv( gl.getUniformLocation(this.program, "lightPosition2"), flatten(lightPosition2 ));
	gl.uniform1f( gl.getUniformLocation(this.program, "shininess"),materialShininess );

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
	
	
	
	
	var vNormal = gl.getAttribLocation( this.program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
	

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

/*
    Build one of the faces for this cube object.
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

/*
	Sets a cube up to be animated
*/
Cube.prototype.rotCube = function(axis, rotAngle) {
	if(this.animate == false) {
		this.rot = rotAngle;
		this.animate = true;
		this.rotAxis = axis;
	}
}

/*
    Build all faces of this cube object
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

/* Orbit this cube around the specified canonical axis. */
Cube.prototype.orbit = function(angle, axis){
    var avec = [0, 0, 0];

    if (axis === undefined) axis = Y_AXIS;
    avec[axis] = 1;

    this.transform = mult(rotate(angle, avec), this.transform);
}

/* Checks if this cube is currently rotating */
Cube.prototype.isRotating = function() {
	return this.animate;
}
