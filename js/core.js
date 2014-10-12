/******************************************************
 * Javascript implementation of Conway's Game of Life *
 * See LICENSE.txt for licensing information          *
 *                                                    *
 * core.js: Main game logic                           *
 *                                                    *
 * Developed by Bryan Gordley                         *
 ******************************************************/

var Display = {
	canvas: null,
	container: null,
	context: null,
	width: 800,
	height: 400,
	aspectRatio: null,
	backColor: "#3D2354",

	// Dynamically creates a Canvas element inside of an element with the id "container"
	create: function(){
		var canvas = document.createElement("canvas");
		var container = document.getElementById("container");
		this.canvas = canvas;
		this.container = container;

		this.aspectRatio = (Display.width / Display.height) * 10;

		// Set canvas settings
		canvas.id = "display";
		canvas.width = this.width;
		canvas.height = this.height;
		canvas.style.zIndex = 1;

		// Fill with background color
		var context = canvas.getContext("2d");
		this.context = context;
		context.fillStyle = this.backColor;
		context.fillRect(0,0,this.width,this.height);
		canvas.style.border = "1px solid";
		container.appendChild(canvas);
	}
};

var Tile = {
	isAlive: null,
	width: Display.width / (Display.width / ((Display.width / Display.height) * 5)),
	height: Display.height / (Display.height / ((Display.width / Display.height) * 5)),

	draw: function(x, y, isAlive){
		this.isAlive = isAlive;

		var context = Display.context;

		if(isAlive == true){
			context.fillStyle = "#D6780D";
		}
		else{
			context.fillStyle = Display.backColor;
		}

		context.fillRect(x , y, this.width, this.height);
	}
}

var Map = {
	tileArray: null,
	sizeX: Display.width / ((Display.width / Display.height) * 5),
	sizeY: Display.height / ((Display.width / Display.height) * 5),

	init: function(){
		var tileArray = [];

		for(x = 0; x < this.sizeX; x++){
			tileArray[x] = [];
			for(y = 0; y < this.sizeY; y++){

				if(Math.random() < 0.5){
					tileArray[x][y] = true;
				}
				else{
					tileArray[x][y] = false;
				}
			}
		}

		this.tileArray = tileArray;
	},

	evolve: function(){
		var neighbors = 0;
		for(x = 0; x < this.sizeX; x++){
			for(y = 0; y < this.sizeY; y++){
				neighbors = this.checkNeighbors(x, y);
				if(this.tileArray[x][y] == true){
					if(neighbors < 2 || neighbors > 3){
						this.tileArray[x][y] = false;
					}
				}
				if(this.tileArray[x][y] == false){
					if(neighbors == 3){
						this.tileArray[x][y] = true;
					}
				}
			}
		}

	},

	checkNeighbors: function(x, y){
		var ta = this.tileArray;
		var count = 0;

		if(x > 0){
			if(ta[x - 1][y + 0] == true)
				count += 1;
		}
		if(x > 0 && y < this.sizeY - 1){
			if(ta[x - 1][y + 1] == true)
				count += 1;
		}
		if(y > 0){
			if(ta[x + 0][y - 1] == true)
				count += 1;
		}
		if(y > 0 && x < this.sizeX - 1){
			if(ta[x + 1][y - 1] == true)
				count += 1;
		}
		if(x > 0 && y > 0){
			if(ta[x - 1][y - 1] == true)
				count += 1;
		}
		if(x < this.sizeX - 1){
			if(ta[x + 1][y + 0] == true)
				count += 1;
		}
		if(y < this.sizeY - 1){
			if(ta[x + 0][y + 1] == true)
				count += 1;
		}
		if(x < this.sizeX - 1 && y < this.sizeY - 1){
			if(ta[x + 1][y + 1] == true)
				count += 1;
		}

		return count;
	},

	draw: function(){
		for(x = 0; x < this.sizeX; x++){
			for(y = 0; y < this.sizeY; y++){
				Tile.draw(x * Tile.width, y * Tile.height, this.tileArray[x][y]);
			}
		}
	}
};

var Game = {
	runInterval: null,
	fps: 10,

	init: function(){
		display = Display;
		display.create();

		map = Map;
		map.init();

		this.runInterval = setInterval(this.run, 1000 / this.fps);
	},

	run: function(){
		map.evolve();
		map.draw();
	}
};