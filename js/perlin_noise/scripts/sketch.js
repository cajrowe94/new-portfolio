var circles = []; //holds all circle start locations for points
var particles = []; //holds all points that are made on circle start points

var inc = 0.1;
var scl = 80;
var cols, rows;

var zoff = 0;

var flowField = [];

var spd = 5;
let zVal = .001;

var rand;

function setup() {
  	createCanvas(windowWidth-17, windowHeight); //create a canvas for screen
	background(255); //white background
	
	//separate page into columsn and rows to assign vectors
	cols = floor(windowWidth/scl); 
	rows = floor(windowHeight/scl);
	
	flowField = new Array(cols * rows);
	
	//populate particle array with circle
	makeCircle(width/2, height/2, 200);
}

function draw() {
	background(255,.5);
	
	//create a new circle when particle arr is empty
	if (particles.length === 0){
		//makeCircle(width/2, height/2, getRandomInt(20, 400));
	}
	var yoff = 0;
	for (var x = 0; x < cols; x++){
		var xoff = 0;
		for (var y = 0; y < rows; y++){
			var index = x + y * cols;
			var angle = noise(xoff, yoff, zoff) * TWO_PI*4;
			var v = p5.Vector.fromAngle(angle);
			v.setMag(.9);
			flowField[index] = v;
			xoff += inc;

		}
		yoff += inc;
		zoff += zVal; //how aggressive the perlin noise is
	}
	for (var i = 0; i < particles.length; i++){
		if (particles[i].edges() === 1){
			particles.splice(i, 1);
		} else {
			particles[i].maxSpeed = spd;
			particles[i].follow(flowField);
			//particles[i].show();
			(particles[i].counter > 300) ? particles.splice(i,1) : particles[i].update();
		}
	}
	
	for (var i = 0; i < particles.length; i++){
		for (var j = 0; j < particles.length; j++){
			var dist = calcDist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
			if (dist > 15 && dist < 16){
				stroke('#000000');
				strokeWeight(.05);
				line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
			}
		}
	}
}

//Circle class, holds start locations for points
function Circle(xIn, yIn, rad){
	this.x = xIn; //x location of arc
	this.y = yIn; //y location of arc
	this.radius = rad; //size of circle
	this.outsidePoints = []; //holds all points of circle
	
	this.makeOutsidePoints = function(){ //calculates the circles outside coordinates
		for (var degree = 0; degree < 360; degree++){ //credit: https://stackoverflow.com/questions/18342216/how-to-get-an-array-of-coordinates-that-make-up-a-circle-in-canvas
			var radians = degree * Math.PI/180;
			var x = this.x + this.radius * Math.cos(radians);
			var y = this.y + this.radius * Math.sin(radians);
			this.outsidePoints.push({x:x,y:y});
		}
	}
}


function makeCircle(xStart, yStart, radiusSize){ //simple function to add a new circle
	var circ = new Circle(xStart, yStart, radiusSize); //make new circle
	circ.makeOutsidePoints(); //calculate outside x and y points before adding to array
	
	for (var i = 0; i < circ.outsidePoints.length; i++){
		var particle = new Particle(circ.outsidePoints[i].x, circ.outsidePoints[i].y); //make a point for each coordinate
		particles.push(particle); //add to array
	}
	
	circles.push(circ); //add to array
}

//calculate distance between two objects
function calcDist(xin, yin, x2in, y2in){
    var a = xin - x2in;
    var b = yin - y2in;

    var c = Math.sqrt(a*a + b*b);
    
    return c;
}

//random functions
function getRandomInt(min, max){ //returns random integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
            
function getRandomFloat(min, max){ //returns random float
    return Math.random() * (max - min) + min;
}