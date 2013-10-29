/* Load the application on window onload */
window.onload = function() {
    initGL(); // basic WebGL setup for the scene 

    // load and compile our shaders into a program object
    var shaders = initShaders( gl, "vertex-shader", "fragment-shader" );
	
	// Create the Rubiks Cube
	var rubiksCube = new Rubiks(shaders);
	
	// Create the Rubiks IO and give it the Rubiks Cube
	var rubiks = new RubiksIO(rubiksCube);
	
	// TODO Remove commented out code
	//var stateString = "GGWRRGRRGOWWGGOYYROGOYYYRBRYYYRBGRWWBOYBOBBOBOGOWWBWWB";
	//rubiksCube.state(stateString);
	//rubiksCube.solve("O1W1R1Y3");
	
	// Set up an event handlers for all the buttons
	var a = document.getElementById("Btn_Ortho");
    a.addEventListener("click",
        function(){
			projection = ortho(-4, 4, -3.0, 3.0, -100, 100);
			projection = mult(projection, lookAt([.33, -.2, 0.5], [.2, -.15, .25], [0.1, 0.1, 0.1]));
        },
        false
    );
	
	var b = document.getElementById("Btn_Pers");
    b.addEventListener("click",
        function(){
			projection = perspective(30, 1.33, .1, 100);
			projection = mult(projection, lookAt([-5, 5, -9], [.3, 0, 0], [1.5, 10, 1]));
		},
        false
    );
	
		var f = document.getElementById("Btn_TR");
    f.addEventListener("click",
        function(){
			rubiksCube.rotate(X_AXIS,2);
        },
        false
    );
	
	var g = document.getElementById("Btn_TL");
    g.addEventListener("click",
        function(){
			rubiksCube.rotate(X_AXIS, 0);
        },
        false
    );
	
	var h = document.getElementById("Btn_TB");
    h.addEventListener("click",
        function(){
			rubiksCube.rotate(Y_AXIS, 2);
        },
        false
    );
	
	var i = document.getElementById("Btn_TT");
    i.addEventListener("click",
        function(){
			rubiksCube.rotate(Y_AXIS, 0);
        },
        false
    );
	
	var j = document.getElementById("Btn_TF");
    j.addEventListener("click",
        function(){
			rubiksCube.rotate(Z_AXIS,0);
        },
        false
    );
	
	var k = document.getElementById("Btn_TBB");
    k.addEventListener("click",
        function(){
			rubiksCube.rotate(Z_AXIS,2);
        },
        false
    );
	
	
	var c = document.getElementById("Btn_State");
    c.addEventListener("click",
        function(){
			var state = prompt("Enter Cube State.");
			rubiks.state(state);
        },
        false
    );
	
	var d = document.getElementById("Btn_Solve");
    d.addEventListener("click",
        function(){
			var solution = prompt("Enter the Cube Solution.");
			rubiks.solve(solution);
        },
        false
    );
	
	var e = document.getElementById("Btn_Replay");
    e.addEventListener("click",
        function(){
			rubiks.replay();
        },
        false
    );
	
	drawables.push(rubiksCube);

    renderScene(); // begin render loop
}
