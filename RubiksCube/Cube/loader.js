/* Set up event callback to start the application */
function sleep(milliSeconds){
	var startTime = new Date().getTime(); // get the current time
	while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}
window.onload = function() {
    initGL(); // basic WebGL setup for the scene 

    // load and compile our shaders into a program object
    var shaders = initShaders( gl, "vertex-shader", "fragment-shader" );
	
	
	var rubiksCube = new Rubiks(shaders);
	var stateString = "GGWRRGRRGOWWGGOYYROGOYYYRBRYYYRBGRWWBOYBOBBOBOGOWWBWWB";
	
	rubiksCube.state(stateString);
	rubiksCube.solve("O1W1R1Y3");
	
	var f = document.getElementById("Btn_TR");
    f.addEventListener("click",
        function(){
			rubiksCube.rotate(0, 0);
        },
        false
    );
	
	var g = document.getElementById("Btn_TL");
    g.addEventListener("click",
        function(){
			rubiksCube.rotate(1, 0);
        },
        false
    );
	
	var h = document.getElementById("Btn_Z");
    h.addEventListener("click",
        function(){
			rubiksCube.shuffle();
        },
        false
    );
	
	drawables.push(rubiksCube);

    renderScene(); // begin render loop
}
