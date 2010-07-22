/*global jQuery:false */

//Constructor for a graph object
function Graph(options){
	
	//Graph object we are creating
	var graph = {};

	//Merge default settings with settings that have been passed in
	var settings = jQuery.extend({
		context: null,  //Canvas context
		height : 200,   //Height of the context
		width  : 200,   //Width of the context
		xRatio : 1,     //Scale for x axis eg 1 = 1 pixel per unit
		yRatio : 1      //Scale for y axis
	},
	options);

	var lines = {};

	//find the middle parts of the graph to set up the axes.
	var middleX = settings.height / 2;
	var middleY = settings.width / 2;

	//variabe to make referring to context quicker
	var context = settings.context;


	//Function to get a Y position on the canvas, from the cartesian Y, takes
	var translateY = function(Y) {
		return Math.round(settings.height - middleY - Y);
	};

	
	//Function to get a X position on the canvas, from the cartesian X, takes
	var translateX = function(X) {
		return Math.round(middleX + (X));
	};

	//Add a line to the graph
	graph.addLine = function(name, line) {
		lines[name] = line;
		graph.redraw();
	};

	//Remove a line from the graph
	graph.removeLine = function(name) {
		delete(lines[name]);
		graph.redraw();
	};

	//Function to draw the border, axes and gridlines on the canvas
	graph.drawAxes = function(){
		

		context.strokeStyle = '#000';
		
		//Draw border
		context.beginPath();
		context.rect(0,0, settings.width, settings.height);
		context.closePath();
		context.stroke();

		context.strokeStyle = '#333';

		//Draw horizontal axis
		context.beginPath();
		context.moveTo(0, middleY);
		context.lineTo(settings.width, middleY);
		context.closePath();
		context.stroke();

		//Draw vertical axis
		context.beginPath();
		context.moveTo(middleX, 0);
		context.lineTo(middleX, settings.height);
		context.closePath();
		context.stroke();


		//Draw vertical grid lines
		context.strokeStyle = '#DDDDDD';
		for (var x = 0; x <= middleX; x++) {
			if (x % settings.xRatio === 0) {
				context.beginPath();
				context.moveTo(translateX(x), 0);
				context.lineTo(translateX(x), settings.height);
				context.stroke();
				context.closePath();

				context.beginPath();
				context.moveTo(translateX(-x), 0);
				context.lineTo(translateX(-x), settings.height);
				context.stroke();
				context.closePath();
				
			}
		}

		//Draw horizontal grid lines
		for (var y = 0; y <= middleY; y++) {
			if (y % settings.yRatio === 0) {
				context.beginPath();
				context.moveTo(0, translateY(y));
				context.lineTo(settings.width, translateY(y));
				context.stroke();
				context.closePath();
				
				context.beginPath();
				context.moveTo(0, translateY(-y));
				context.lineTo(settings.width, translateY(-y));
				context.stroke();
				context.closePath();

			}
		}

	};

	//Function to clear the graph
	graph.clear = function() {
		context.fillStyle = '#FFF';
		//Draw border
		context.beginPath();
		context.rect(0,0, settings.width, settings.height);
		context.closePath();
		context.fill();

		graph.drawAxes();
	};

	//Function to draw the lines on the graph	
	graph.drawLines = function() {
		var x;
		var y;
		for (var lineName in lines) {
			if (lines.hasOwnProperty(lineName)) {
				context.strokeStyle = lines[lineName].color;
				settings.context.beginPath();

				for (x = -(middleX); x <= settings.width; x++) {

					//Calculate Y using the formula object for the line
					y = settings.yRatio * lines[lineName].formula.calculateY(x/settings.xRatio);
					//If this is the first point then moveTo it to start the path
					if (x == -(middleX) || translateY(y) > settings.height || translateY(y) < 0) {
						settings.context.moveTo(translateX(x)-1, translateY(y)-1);
					}

					settings.context.lineTo(translateX(x), translateY(y));
				}

				settings.context.stroke();
				settings.context.closePath();
			}
		}
	

	};

	//Function to zoom in the graph. Basically changes the ratio of 1 unit of measurement to pixels
	graph.zoom = function(change) {
		settings.xRatio += change;
		settings.yRatio += change;
		graph.redraw();
	};

	//function to clear and draw the graph
	graph.redraw = function() {
		graph.clear();
		graph.drawLines();
	};

	//Set the zoom level and redraw the graph
	graph.setZoom = function(x, y) {
		settings.xRatio = x;
		settings.yRatio = y;
		graph.redraw();
	};


	return graph;

}


//Constructor for a formula object to draw a straight line eg y= mx +c
function StraightLine(options) {

	var formula = {};
	
	var settings = jQuery.extend({
		m : 1,
		c : 0
	},
	options);

	formula.calculateY = function(value) {
		return (settings.m * value) + settings.c;
	};

	return formula;

}

//Constructor for a formula object to draw a quadratic curve eg y= ax^2 + bx +c
function QuadraticLine(options) {

	var formula = {};

	var settings = jQuery.extend({
		a : 1,
		b : 0,
		c : 0
	},
	options);

	formula.calculateY = function(value) {
		var result = settings.a * value * value + settings.b * value + settings.c;
		return result;
	};
	return formula;

}

//Constructor for a formula object to draw a cubic curve eg y= ax^3 + bx^2 + cx + d
function CubicLine(options) {

	var formula = {};

	var settings = jQuery.extend({
		a : 1,
		b : 0,
		c : 0,
		d : 0
	},
	options);

	formula.calculateY = function(value) {
		var result = settings.a * Math.pow(value, 3) + settings.b * Math.pow(value, 2) + settings.c * value + settings.d;
		return result;
	};
	return formula;

}

//Constructor for a formula object to draw a sine graph eg y= a(sin(b(x+c))) + d
function SinLine(options) {

	var formula = {};

	var settings = jQuery.extend({
		a : 1,
		b : 1,
		c : 0,
		d : 0
	},
	options);

	formula.calculateY = function(value) {
		return settings.a * Math.sin(settings.b * (value + settings.c)) + settings.d;
	};
	return formula;

}

//Constructor for a formula object to draw a tan graph eg y= a(tan(b(x+c))) + d
function TanLine(options) {

	var formula = {};

	var settings = jQuery.extend({
		a : 1,
		b : 1,
		c : 0,
		d : 0
	},
	options);

	formula.calculateY = function(value) {
		return settings.a * Math.tan(settings.b * (value + settings.c)) + settings.d;
	};
	return formula;

}

//Constructor for a formula object to draw a half circle graph eg y= sqrt(r^2 - x^2)
function CircleLine(options) {

	var formula = {};

	var settings = jQuery.extend({
		r : 1
	},
	options);

	formula.calculateY = function(value) {
		return Math.sqrt(Math.pow(settings.r, 2) - Math.pow(value, 2));
	};
	return formula;

}



