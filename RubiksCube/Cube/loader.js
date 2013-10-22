/* Set up event callback to start the application */
window.onload = function() {
    initGL(); // basic WebGL setup for the scene 

    // load and compile our shaders into a program object
    var shaders = initShaders( gl, "vertex-shader", "fragment-shader" );
	
	
	var rubiksCube = new Rubiks(shaders);
	
	var f = document.getElementById("Btn_TR");
    f.addEventListener("click",
        function(){
			rubiksCube.rotate();
        },
        false
    );

    // set up an event handler for this button
    /*var b = document.getElementById("Btn_TL");
    b.addEventListener("click",
        function(){
				cubeMid.rotCube(-90);
        },
        false
    );*/
	
	drawables.push(rubiksCube);
	

    renderScene(); // begin render loop
}
