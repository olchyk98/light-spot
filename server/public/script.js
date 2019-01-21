// Game server
const game_server = io('http://localhost:4000');

// Models
const models = {
	"MAIN_BACKGROUND": {
		model: null
	},
	"TOP_RIGHT_PIPE_BLOCK": {
		markup: "b",
		model: null,
		secret: null
	},
	"TOP_FORK_PIPE_BLOCK": {
		markup: "h",
		model: null,
		secret: null
	},
	"LEFT_FORK_PIPE_BLOCK": {
		markup: "j",
		model: null,
		secret: null
	},
	"DARK_BLOCK": {
		markup: "d",
		model: null,
		secret: null
	},
	"GOLD_BLOCK": {
		markup: "e",
		model: null,
		secret: "HIDDEN_WALK", // secret label
		secretDown: "DARK_BLOCK" // after the secret switch block to...
	},
	"PIPE_BLOCK_VERT": {
		markup: "g",
		model: null,
		secret: null
	},
	"PIPE_BLOCK_HORIZ": {
		markup: "f",
		model: null,
		secret: null
	},
	"BOTTOM_FORK_PIPE_BLOCK": {
		markup: "c",
		model: null,
		secret: null
	},
	"FORK_PIPE_BLOCK": {
		markup: "i",
		model: null,
		secret: null
	},
	"BOTTOM_LEFT_PIPE_BLOCK": {
		markup: "r",
		model: null,
		secret: null
	},
	"BOTTOM_RIGHT_PIPE_BLOCK": {
		markup: "k",
		model: null,
		secret: null
	},
	"RIGHT_FORK_PIPE_BLOCK": {
		markup: "l",
		model: null,
		secret: null
	},
	"SMALL_DARK_BLOCK": {
		markup: "m",
		model: null,
		secret: null
	},
	"SMALL_GOLD_BLOCK": {
		markup: "n",
		model: null,
		secret: null
	},
	"PYRAMID_DARK_BLOCK": {
		markup: "p",
		model: null,
		secret: null
	},
	"PYRAMID_GOLD_BLOCK": {
		markup: "q",
		model: null,
		secret: null
	},
	"LEFT_TOP_PIPE_BLOCK": {
		markup: "a",
		model: null,
		secret: null
	},
	"EXCLAMATION_DARK_BLOCK": {
		markup: "s",
		model: null,
		secret: null
	},
	"EXCLAMATION_GOLD_BLOCK": {
		markup: "t",
		model: null,
		secret: null
	},
	"QUESTION_DARK_BLOCK": {
		markup: "u",
		model: null,
		secret: null
	},
	"QUESTION_LIGHT_BLOCK": {
		markup: "v",
		model: null,
		secret: null
	},
}

// Game data
const game = {
	initialized: false,
	defaultSize: 0, // FIXME
	player: {
		speed: 15,
		pos: {
			x: 0,
			y: 0
		},
		controls: {}
	}
}

let blocks = [];

// Request game data
game_server.emit("READY_TO_PLAY_STATUS", true);
game_server.on("RESPONSE_GAME_DATA", data => {
	game.map = data.map;
	game.initialized = true;
	game.defaultSize = innerHeight / data.arrHeight;
});

// Classes
class Element {
	constructor(size, pos) {
		this.size = size;
		this.pos = pos || {
			x: 0,
			y: 0
		}
	}

	predictTouch(x, y) {
		alert();
	}
}

class Block extends Element {
	constructor(model, posX, posY) {
		super(game.defaultSize, { x: posX, y: posY });

		this.model = models[model].model;
		this.secret = null;
		this.modelName = model;
	}

	render() {
		noStroke();
		image(
			this.model,
			this.pos.x,
			this.pos.y,
			this.size,
			this.size
		);
	}
}

// INIT
function preload() {
	models["MAIN_BACKGROUND"].model         = loadImage('./models/background.png');

	models["TOP_RIGHT_PIPE_BLOCK"].model    = loadImage('./models/blocks/1.png');
	models["TOP_FORK_PIPE_BLOCK"].model     = loadImage('./models/blocks/2.png');
	models["LEFT_FORK_PIPE_BLOCK"].model    = loadImage('./models/blocks/3.png');
	models["DARK_BLOCK"].model              = loadImage('./models/blocks/4.png');
	models["GOLD_BLOCK"].model              = loadImage('./models/blocks/5.png');
	models["PIPE_BLOCK_VERT"].model         = loadImage('./models/blocks/6.png');
	models["PIPE_BLOCK_HORIZ"].model        = loadImage('./models/blocks/7.png');
	models["BOTTOM_FORK_PIPE_BLOCK"].model  = loadImage('./models/blocks/8.png');
	models["FORK_PIPE_BLOCK"].model         = loadImage('./models/blocks/9.png');
	models["BOTTOM_LEFT_PIPE_BLOCK"].model  = loadImage('./models/blocks/10.png');
	models["BOTTOM_RIGHT_PIPE_BLOCK"].model = loadImage('./models/blocks/11.png');
	models["RIGHT_FORK_PIPE_BLOCK"].model   = loadImage('./models/blocks/12.png');
	models["SMALL_DARK_BLOCK"].model        = loadImage('./models/blocks/13.png');
	models["SMALL_GOLD_BLOCK"].model        = loadImage('./models/blocks/14.png');
	models["PYRAMID_DARK_BLOCK"].model      = loadImage('./models/blocks/15.png');
	models["PYRAMID_GOLD_BLOCK"].model      = loadImage('./models/blocks/16.png');
	models["LEFT_TOP_PIPE_BLOCK"].model     = loadImage('./models/blocks/17.png');
	models["EXCLAMATION_DARK_BLOCK"].model  = loadImage('./models/blocks/18.png');
	models["EXCLAMATION_GOLD_BLOCK"].model  = loadImage('./models/blocks/19.png');
	models["QUESTION_DARK_BLOCK"].model     = loadImage('./models/blocks/20.png');
	models["QUESTION_LIGHT_BLOCK"].model    = loadImage('./models/blocks/21.png');
}

let _x = 0;

function setup() {
	createCanvas(innerWidth - .5, innerHeight - .5);
}

function draw() {
	background(0);
	if(!game.initialized) return;
	image(
		models["MAIN_BACKGROUND"].model,
		0, 0,
		width,
		height
	);

	// Clear arrays
	blocks = [];

	// Fill arrays
	game.map.forEach((io, ik) => {
		io = io.split("")

		io.forEach((ia, il) => {
			if(ia === "o") return;

			blocks.push(new Block(
				Object.keys(models).find(io => models[io].markup === ia),
				il * game.defaultSize - _x,
				ik * game.defaultSize
			));
		});
	});

	// Render
	blocks.forEach(io => {
		io.render();
	});
}

function keyPressed() {
	game.player.controls[keyCode] = true;
	if(key === 'd') _x += 75;
	else if(key === 'a') _x -= 75;
}

function keyReleased() {
	game.player.controls[keyCode] = false;
}