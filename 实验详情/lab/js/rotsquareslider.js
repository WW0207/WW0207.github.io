"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var speed = 50;

function changeDir(){
	direction *= -1;
}

function initRotSquare(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var verties =
	[
	    -0.3,0.4,0.0,1.0,0.0,
	    0.3,0.4,1.0,0.0,0.0,
	    0.0,0.7,0.0,0.0,1.0,
	
	    -0.5,0.0,0.0,0.0,1.0,
	    0.5,0.0,0.0,1.0,0.0,
	    0.0,0.4,1.0,0.0,0.0,
	
	    -0.7,-0.4,1.0,0.0,0.0,
	    0.7,-0.4,0.0,0.0,1.0,
	    0.0,0.0,0.0,1.0,0.0,
	
	    -0.15,-1.0,0.73,0.56,0.56,
	    0.15,-1.0,0.73,0.56,0.56,
	    0.15,-0.4,0.73,0.56,0.56,
	    -0.15,-0.4,0.73,0.56,0.56,
		  
		//0.0, 0.8, 1.0, 0.94, 0.0
	]; 
	/* var N = 100;
	var r = 0.1;
	for(var i=0; i<= N; i++){
	  var theta = i * 2 * Math.PI / N;
	  var x = r * Math.sin(theta);
	  var y = r * Math.cos(theta)+0.8;
	  verties.push(x, y, 1.0, 0.94, 0);
	} */
	var data = new Float32Array(verties);
	var FSIZE=data.BYTES_PER_ELEMENT;
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );
	var a_Position=gl.getAttribLocation(program,"a_Position");
	var a_Color=gl.getAttribLocation(program,"a_Color");
	
	gl.vertexAttribPointer( a_Position, 2, gl.FLOAT, false, FSIZE*5, 0 );
	gl.vertexAttribPointer( a_Color, 3, gl.FLOAT, false, FSIZE*5, FSIZE*2 );
	gl.enableVertexAttribArray( a_Position );
	gl.enableVertexAttribArray( a_Color );
	

	thetaLoc = gl.getUniformLocation( program, "theta" );

	document.getElementById( "speedcon" ).onchange = function( event ){
		speed = 100 - event.target.value;
	}

	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	theta += direction * 0.1;
	
	gl.uniform1f( thetaLoc, theta );
	
	gl.drawArrays( gl.TRIANGLES, 0, 3 );
	gl.drawArrays( gl.TRIANGLES, 3, 5);
	gl.drawArrays( gl.TRIANGLES, 6, 8);
	gl.drawArrays( gl.TRIANGLE_FAN, 9, 4); 
	//gl.drawArrays(gl.TRIANGLE_FAN,13,N+15);

	// update and render
	setTimeout( function(){ requestAnimFrame( renderSquare ); }, speed );
}