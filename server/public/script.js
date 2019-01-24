// ----- /*
/*
/*	Iceball > detectObstacles > touch tester -> It should send a new packet to the game server.
/*	Receive and re-render the new map on "GAME_DESTROY_BLOCK" server event
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
/*
// ----- */

// NEXT: Items

// Game server
const game_server = io('http://localhost:4000');
// const game_server = io('http://192.168.43.45:4000');

// Models
const models = {
	"MAIN_BACKGROUND": {
		model: null
	},
	"MAIN_PLAYER_MODEL": {
		model: null
	},
	"TOP_RIGHT_PIPE_BLOCK": {
		markup: "b",
		style: "PIPE_STYLE",
		model: null,
		secret: null
	},
	"TOP_FORK_PIPE_BLOCK": {
		markup: "h",
		style: "PIPE_STYLE",
		model: null,
		secret: null
	},
	"LEFT_FORK_PIPE_BLOCK": {
		markup: "j",
		style: "PIPE_STYLE",
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
		secret: null
	},
	"PIPE_BLOCK_VERT": {
		markup: "g",
		style: "PIPE_STYLE",
		model: null,
		secret: null
	},
	"PIPE_BLOCK_HORIZ": {
		markup: "f",
		style: "PIPE_STYLE",
		model: null,
		secret: null
	},
	"BOTTOM_FORK_PIPE_BLOCK": {
		markup: "c",
		style: "PIPE_STYLE",
		model: null,
		secret: null
	},
	"FORK_PIPE_BLOCK": {
		markup: "i",
		style: "PIPE_STYLE",
		model: null,
		secret: null
	},
	"BOTTOM_LEFT_PIPE_BLOCK": {
		markup: "r",
		style: "PIPE_STYLE",
		model: null,
		secret: null
	},
	"BOTTOM_RIGHT_PIPE_BLOCK": {
		markup: "k",
		style: "PIPE_STYLE",
		model: null,
		secret: null
	},
	"RIGHT_FORK_PIPE_BLOCK": {
		markup: "l",
		style: "PIPE_STYLE",
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
		style: "PIPE_STYLE",
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
		secret: "HIDDEN_WALK"
	},
	"ICEBALL_BULLET": {
		model: null
	}
}

// Game data
const game = {
	canvasSizes: {
		height: innerHeight,
		width: innerWidth
	},
	g_sizes: {
		height: null,
		width: null
	},
	playerID: null,
	initialized: false,
	defaultSize: 0,
	statsDockHeight: 100,
	player: {
		speed: 5,
		object: null
	},
	cameraPos: {
		x: 0,
		y: null
	}
}

let blocks = [];
let players = [];
let bullets = [];

// Game Server global reqs/res
game_server.emit("READY_TO_PLAY_STATUS", true);
game_server.on("RESPONSE_GAME_DATA", data => {
	game.map = data.map;
	game.initialized = true;
	game.g_sizes.height = game.canvasSizes.height - game.statsDockHeight;
	game.g_sizes.width = game.canvasSizes.width;
	game.defaultSize = game.g_sizes.height / data.arrHeight;
	players = data.players;
	game.playerID = data.playerID;
});

// Player updated
game_server.on("MANUAL_PLAYER_UPDATE", ({ player: { id, pos, health } }) => {
	if(!game.map) return;

	pos = { // CHECK
		x: game.map[0].length * game.defaultSize / 100 * pos.x,
		y: game.g_sizes.height / 100 * pos.y
	}

	let a = players.find(io => io.id === id);
	if(a) {
		a.pos = pos;
		a.health = health;
	} else {
		players.push({ id, pos, health });
	}
});

// New bullet
game_server.on("MANUAL_GAME_BULLET_ADDED", ({ bullet, casterID }) => {
	// bullet -> [{x:0,y:0}, prop2, prop3] // WARNING: x, y in %
	// TODO: Convert to class and push it to the bullets array

	bullet[0].x = game.map[0].length * game.defaultSize / 100 * bullet[0].x;
	bullet[0].y = game.g_sizes.height / 100 * bullet[0].y;

	bullets.push(
		new Iceball(
			...bullet,
			casterID
		)
	);
});

// Player disconnected
game_server.on("MANUAL_PLAYER_DISCONNECT", ({ id }) => {
	let a = players.findIndex(io => io.id === id);
	if(a !== -1) players.splice(a, 1);
});

// ...
function _generateTrash(len = 32) {
	let a = "abcdefghijklmnopqrstuvwxyz1234567890",
		b = "";

	for(let ma = 0; ma < len; ma++) {
		b += a[floor(random(a.length))];
	}

	return b;
}

// Classes
class Element {
	constructor(size, pos) {
		this.size = size;
		this.pos = pos || {
			x: 0,
			y: 0
		}
	}

	predictTouch(x, y, size) { // FIXME
		if(this.visible === false) return null;

		if(
			(x + this.size - 5 >= this.pos.x) && (x <= this.pos.x + this.size - 5) &&
			(y + this.size >= this.pos.y) && (y <= this.pos.y + this.size - 5)
		) {
			return this;
		}
	}
}

class Block extends Element {
	constructor(model, posX, posY, indexX, indexY) {
		super(game.defaultSize, { x: posX, y: posY });

		this.blockStyle = models[model].style;
		this.model = models[model].model;
		this.secret = models[model].secret;
		this.modelName = model;

		this.indexX = indexX;
		this.indexY = indexY;

		this.visible = true;
	}

	render() {
		if(!this.visible) return this;

		image(
			this.model,
			this.pos.x,
			this.pos.y,
			this.size,
			this.size
		);

		return this;
	}

	update() {
		// Update block position when the camera moves
		this.pos.x = this.indexX * game.defaultSize - game.cameraPos.x;
	}

	hideSelf() {
		this.visible = false;
	}
}

class Bullet {
	constructor(pos, model, speed, id, dir) {
		this.id = id;

		this.pos = pos;
		this.model = model;

		this.speed = speed;
		this.dir = dir;
	}

	render() {
		image(
			this.model,
			this.pos.x,
			this.pos.y
		);

		return this;
	}

	update() {
		this.pos.x += this.dir * this.speed;

		if(
			(this.dir === 1 && this.pos.x > game.g_sizes.width) ||
			(this.dir === -1 && this.pos.x + this.model.width < 0)
		) this.spliceSelf();

		return this;
	}

	spliceSelf() {
		let a = bullets.findIndex(io => io.id === this.id);
		if(!a) {
			bullets.splice(a, 1);
		}
	}
}

class Iceball extends Bullet {
	constructor(pos, id, dir, casterID) {
		super(
			pos,
			models["ICEBALL_BULLET"].model,
			10,
			id,
			dir
		);

		this.casterID = casterID;
		this.damage = 20;
	}

	detectObstacles() {
		let a = [ // touchable elements
			...blocks,
			...players,
			game.player.object
		];

		for(io of a) {
			let b = io.predictTouch(
				this.pos.x,
				this.pos.y,
				this.model.width
			);

			if(b) {
				// I have no idea how to use switch-statement here... io.constructor.name is a bad idea, because it doesn't show e-classes.
				let done = false;

				if(io instanceof Block) {
					done = true;
					if(io.blockStyle === "PIPE_STYLE") {
						io.hideSelf();

						game_server.emit("GAME_DESTROY_BLOCK", {
							y: io.indexY,
							x: io.indexX
						});
					}

				} else if(io instanceof Hero) {
					if(this.casterID !== io.id) {
						done = true;
						io.declareDamage(this.damage);
					}
				}

				if(done) {
					this.spliceSelf();
					break;
				}
			}
		}
	}
} 

class Creature extends Element {
	constructor(health, pos, model, size) {
		super(size, pos);

		this.maxHealth = this.health = health;
		this.model = model;

		this.gravity = .5;
		this.velocity = 0;

		this.jumpHeight = 10;
		this.jumpMaxQ = 3;
		this.jumpQ = 0;
	}

	jump() {
		// if(this.jumpQ <= 0) return; // DEBUG

		this.velocity = -this.jumpHeight;
		this.jumpQ--;
	}

	fall() {
		// Next position
		let nv = this.velocity + this.gravity,
			ny = this.pos.y + nv,
			acn = false;

		// Test each block for y axis
		blocks.forEach(io => {
			let a = io.predictTouch(
				this.pos.x, 
				ny,
				this.size
			);

			if(a) {
				if(!acn) {
					acn = true;
					this.velocity = 0;
					this.jumpQ = this.jumpMaxQ;
				}
			}
		});

		// IF doesn't touch THEN apply new y position
		if(!acn) {
			this.velocity = nv;
			this.pos.y = ny;
		}

		// if(this.type === "hero") // send request

		return this;
	}

	declareDamage(a) {
		this.health -= a;
	}
	// Health, and other stuff for heros, monsters
}

class Hero extends Creature {
	constructor(id, model, pos, isClient) {
		super(120, pos, model, game.defaultSize);

		this.id = id;
		this.isClient = isClient;
		this.speed = game.player.speed;
	}

	render() {
		let camera = (!this.cameraStrictPosX) ? game.player.object.cameraStrictPosX : 0;

		image(
			this.model,
			this.pos.x - camera,
			this.pos.y,
			this.size,
			this.size
		);

		{
			let a = this.size * 1.25;

			fill('red');
			rect(
				this.pos.x + this.size / 2 - a / 2 - camera,
				this.pos.y - 15,
				a / 100 * (100 / (this.maxHealth / this.health)),
				10
			);
		}

		return this;
	}
	// Hero skills, stats
}

class MainPlayer extends Hero {
	constructor() {
		super(
			game.playerID,
			models["MAIN_PLAYER_MODEL"].model,
			{ x: 50, y: 50 }, // DEBUG
			true
		);

		this.movementX = 0;
		this.directionX = 1;

		this.cameraStrictPosX = 0;

		this.shootDeltaC = 10;
		this.shootDelta = 0;

		this.isFlying = false;
		this.jetPackQuotaC = this.jetPackQuota = 300;
	}

	update() {
		if(this.shootDelta > 0) this.shootDelta--;

		let nx = this.pos.x + this.movementX * this.speed,
			acn = false;

		blocks.forEach(io => {
			let a = io.predictTouch(
				nx,
				this.pos.y,
				nx // WARNING: was nx variable here
			);

			if(a) {
				acn = true;
			}
		});

		if(!acn) {
			// WARNING: This function is a peace of shit. I'd kill this function in the night x_x
			// According to https://www.linux.org.ru/forum/talks/3588892

			let a = game.map[0].length * game.defaultSize - game.g_sizes.width / 2,
				b = this.pos.x + this.cameraStrictPosX >= a - this.speed,
				cameraChanged = false; // XXX

			// Update camera position
			if(
				(
					this.pos.x >= game.g_sizes.width / 2 ||
					this.cameraStrictPosX
				) &&
				!b && (this.cameraStrictPosX + game.g_sizes.width / 2 <= a || this.movementX === -1)
			) {
				this.cameraStrictPosX += this.movementX * this.speed;
				if(this.cameraStrictPosX < 0) this.cameraStrictPosX = 0;
				cameraChanged = true;
			}

			if(!cameraChanged || this.cameraStrictPosX <= 0) { // Update hero position
				this.pos.x = nx;
			}
		}

		if(this.isFlying) this.fly();

		return this;
	}

	fly() {
		if(!this.jetPackQuota) return;

		this.velocity = -this.speed * 2;
	}

	shoot() {
		if(this.shootDelta > 0) return;

		// 1. Add bullet to the bullets array
		// 2. Send info about the bullet to the game server

		let a = [
			{
				x: this.pos.x,
				y: this.pos.y
			},
			_generateTrash(),
			this.directionX
		]

		this.shootDelta = this.shootDeltaC;

		bullets.push(
			new Iceball(...a, game.playerID)
		);

		a[0] = {
			x: 100 / ( (game.map[0].length * game.defaultSize) / (a[0].x + this.cameraStrictPosX) ),
			y: 100 / (game.g_sizes.height / a[0].y)
		}

		game_server.emit("GAME_BULLET_ADDED", {
			bullet: a,
			casterID: game.playerID
		});
	}

	control(a, pressed) {
		switch(parseInt(a)) {
			case 32:
				// if(pressed) this.isFlying = true;
				// else this.isFlying = false;
				if(pressed) this.jump();
			break;
			case 68:
				if(pressed) {
					this.movementX = this.directionX = 1;
				} else {
					this.movementX = 0;
					this.directionX = 1;	
				}
			break;
			case 65:
				if(pressed) {
					this.movementX = this.directionX = -1;
				} else {
					this.movementX = 0;
					this.directionX = -1;	
				}
			break;
			case 13:
				if(pressed) this.shoot();
			break;
			default:break;
		}
	}

	moveCamera() {
		// if(this.pos.x >= ceil(game.g_sizes.width / 2)) { // if client player x position bigger than half of the screen
		// 	game.cameraPos.x = this.cameraStrictPosX; // how many px from this pos?
		// }

		game.cameraPos.x = this.cameraStrictPosX;

		return this;
	}

	updateServerStatus() { // OUT THE LOOP
		// IDEA: Send position x-y in %

		// Convert current client position to % to fix the different resolutions problem.
		// XXX: [1] I don't think that it can happen, but different row lengths in the game.map array can cause(spruchunutu) some kind of errors.
		const { x, y } = this.pos;
		game_server.emit("UPDATE_PLAYER_STATS", {
			pos: {
				x: 100 / ( (game.map[0].length * game.defaultSize) / (x + this.cameraStrictPosX) ), // XXX [1]
				y: 100 / (game.g_sizes.height / y)
			},
			health: this.health
		});
	}
}

class GameDock {
	constructor() {
		this.height = game.statsDockHeight;
	}

	render() {
		{ // Render radar
			let a = this.height * .85, // height
				b = (width > 500) ? 300 : width * .5, // width
				radX = width / 2 - b / 2,
				radY = height - this.height + (this.height - a) / 2;

			// NOTE: I could also render all blocks in the order, but it will be too heavy for computer
			// Render display
			fill('rgba(255, 255, 255, .15)');
			rect(
				radX,
				radY,
				b,
				a
			);

			// Render dots
				let c = 7.5, // size
					e = e => radX + b / 100 * 100 / ((game.map[0].length * game.defaultSize) / e) + c / 2, // x
					f = f => radY + a / 100 * 100 / (game.g_sizes.height / f); // y

				{ // Render mainPlayer
					const { pos, cameraStrictPosX } = game.player.object;

					fill('red');
					ellipse(
						e(pos.x + cameraStrictPosX),
						f(pos.y),
						c, c
					);
				}

				// Render players
				players.forEach(io => {
					if(!io.pos) return;

					const { pos } = io;

					fill('blue');
					ellipse(
						e(pos.x),
						f(pos.y),
						c, c
					);
				});
		}

		// ...
		return this;
	}

	update() {

	}
}

// INIT
function preload() {
	models["MAIN_BACKGROUND"].model         = loadImage('./models/background.png');

	models["MAIN_PLAYER_MODEL"].model       = loadImage('./models/players/main.png');

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

	models["ICEBALL_BULLET"].model          = loadImage('./models/bullets/iceball.gif');
}

function setup() {
	createCanvas(game.canvasSizes.width - .5, game.canvasSizes.height - .5);

	// Initialize player
	game.player.object = new MainPlayer();
	// Initialize game dock
	game.gameDock = new GameDock();
}

function draw() {
	background(0);
	if(!game.initialized) return;
	// image(
	// 	models["MAIN_BACKGROUND"].model,
	// 	0, 0,
	// 	game.g_sizes.width,
	// 	game.g_sizes.height
	// );

	// Generate map
	if(!blocks.length) {
		game.map.forEach((io, ik) => { // XXX
			io = io.split("");

			io.forEach((ia, il) => {
				ia = ia.toLowerCase();

				if(ia === "o") return;

				let aa = Object.keys(models).find(io => models[io].markup === ia);
				if(!aa) return;

				blocks.push(new Block(
					aa,
					il * game.defaultSize - game.cameraPos.x,
					ik * game.defaultSize,
					il,
					ik
				));
			});
		});
	}

	// Render blocks
	blocks.forEach(io => {
		io.render().update();
	});

	// Render bullets
	bullets.forEach(io => {
		io.render().update().detectObstacles();
	});

	// Render other players
	// IF players.length !== players.length with own class THEN generate classes for the new players
	if(players.length !== players.filter(io => io instanceof Hero)) {
		players.forEach((io, ia, arr) => {
			if(!(io instanceof Hero)) {
				arr[ia] = new Hero(
					io.id,
					models["MAIN_PLAYER_MODEL"].model,
					io.pos,
					false
				);
			}
		});
	}

	players.forEach(io => {
		io.render();
	});

	// Client player
	game.player.object.render().update().fall().moveCamera().updateServerStatus();

	// Game dock
	game.gameDock.render();
}

function keyPressed() {
	if(!game.initialized || !game.player.object) return;

	game.player.object.control(keyCode, true);
}

function keyReleased() {
	if(!game.initialized || !game.player.object) return;

	game.player.object.control(keyCode, false);
}