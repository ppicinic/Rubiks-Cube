/* Set up event callback to start the application */
window.onload = function() {
    initGL(); // basic WebGL setup for the scene 

    // load and compile our shaders into a program object
    var shaders = initShaders( gl, "vertex-shader", "fragment-shader" );
	
	// COLOR Constants - possible move later to a Constants file
	var BLACK = [0.0, 0.0, 0.0, 1.0];
	var WHITE = [1.0, 1.0, 1.0, 1.0];
	var RED = [1.0, 0.0, 0.0, 1.0];
	var GREEN = [0.1, .75, 0.1, 1.0];
	var BLUE = [0.0, 0.0, 1.0, 1.0];
	var YELLOW = [1.0, 1.0, 0.0, 1.0];
	var RED = [1.0, 0.0, 0.0, 1.0];
	var ORANGE = [1.0, .75, 0.0, 1.0];	
	
	var cubeMid = new Cube(shaders, [RED, RED, BLUE, BLUE, GREEN, GREEN]);
	
	var f = document.getElementById("Btn_TR");
    f.addEventListener("click",
        function(){
			cubeMid.rotCube(90);W
        },
        false
    );

    // set up an event handler for this button
    var b = document.getElementById("Btn_TL");
    b.addEventListener("click",
        function(){
				cubeMid.rotCube(-90);
        },
        false
    );
	
	drawables.push(cubeMid);
	

    renderScene(); // begin render loop
}
