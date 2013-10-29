/*
    initGL.js - Essential setup for our WebGL application
*/

var canvas; // global to hold reference to an HTML5 canvas
var gl; // global to hold reference to our WebGL context+
var animated;
var rot;

// a few simple constants
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;


var drawables = []; // used to store any objects that need to be drawn

/* Initialize global WebGL stuff - not object specific */
function initGL()
{
    // look up our canvas element
    canvas = document.getElementById( "gl-canvas" );

    // obtain a WebGL context bound to our canvas
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height ); // use the whole canvas
    gl.clearColor( 0.7, 0.7,0.7, 1.0 ); // background color
    gl.enable(gl.DEPTH_TEST); // required for 3D hidden-surface elimination

    // set the projection matrix
    // note: added rotation just to better see the shapes of our cubes
    projection = ortho(-4, 4, -3.0, 3.0, -100, 100);
	projection = mult(projection, lookAt([.33, -.2, 0.5], [.2, -.15, .25], [0.1, 0.1, 0.1]));
	//projection = perspective(30, 1.33, 100, .100);
	//projection = mult(projection, lookAt([1, 5, 9], [.3, 0, 0], [1.5, 10, 1]));
	//+projection = perspective(50, 1.33, .1, 10);
    //projection = mult(projection, rotate(30, [0.5, 1, 0.12]));
	//projection = mult(projection, lookAt([-100, 100, -100], [0,0,0 ], [0,0,0]) );
	//modelview = lookAt([0, 0, 100], [1, 1,0 ], [0,0,0]);
	animated = false;
	rot = 0;
	
		

    // set up an event handler for this button
	
	var c = document.getElementById("Btn_Ortho");
    c.addEventListener("click",
        function(){
			projection = ortho(-4, 4, -3.0, 3.0, -100, 100);
			projection = mult(projection, lookAt([.33, -.2, 0.5], [.2, -.15, .25], [0.1, 0.1, 0.1]));
        },
        false
    );
	
	var d = document.getElementById("Btn_Pers");
    d.addEventListener("click",
        function(){
			projection = perspective(30, 1.33, .1, 100);
			projection = mult(projection, lookAt([-5, 5, -9], [.3, 0, 0], [1.5, 10, 1]));
		},
        false
    );
}

/* Global render callback - would draw multiple objects if there were more than one */
var renderScene = function(){
    // start from a clean frame buffer for this frame
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // loop over all objects and draw each
    var i;
    for (i in drawables) {
        drawables[i].draw();
    }

    // queue up this same callback for the next frame
    requestAnimFrame(renderScene);
}
