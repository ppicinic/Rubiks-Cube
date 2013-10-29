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
	var rubiks = new RubiksIO(rubiksCube);
	//rubiksCube.state(stateString);
	//rubiksCube.solve("O1W1R1Y3");
	
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
	
	var h = document.getElementById("Btn_State");
    h.addEventListener("click",
        function(){
			var state = prompt("Enter Cube State.");
			rubiks.state(state);
        },
        false
    );
	
	var i = document.getElementById("Btn_Solve");
    i.addEventListener("click",
        function(){
			var solution = prompt("Enter the Cube Solution.");
			rubiks.solve(solution);
        },
        false
    );
	
	var j = document.getElementById("Btn_Replay");
    j.addEventListener("click",
        function(){
			rubiks.replay();
        },
        false
    );
	
	drawables.push(rubiksCube);

	
	

    renderScene(); // begin render loop
}
