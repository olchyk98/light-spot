// Imports
const express = require('express');
const socketIO = require('socket.io');

// Server
const app = express();

app.use('/', express.static('./public'));

const server = app.listen(4000, () => console.log("Server is running on port 4000!"));
const io = socketIO(server);

// Maps

// o - space
// a - left top round pipe
// b - right top round pipe
// c - fork bottom pipe
// d - dark block
// e - gold block
// f - line pipe (left - right)
// g - line pipe (up - down)
// h - fork top pipe
// i - multi pipe
// j - left fork pipe
// k - right bottom round pipe
// l - fork right pipe
// m - small dark block
// n - small gold block
// p - pyramid dark block
// q - pyramid gold block
// r - left bottom round pipe
// s - ! dark
// t - ! gold
// u - ? dark
// v - ? gold

const maps = [
	[
		"ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
		"dOOOOOOOOOOOOOOOOOdOOOddOOOdOOOOOOOdOOOOOOpOgggOpOOOOOOdOOOOOOOdOOOddOOOdOOOOOOOOOOOOOOOOOd",
		"dOOOOOOdddddddOOOOdOOOOpOOOddOOOOOOdOOOOOOpOgggOpOOOOOOdOOOOOOddOOOpOOOOdOOOOdddddddOOOOOOd",
		"dOOOOOOdOOOOOdOOOOdOOOpOOOOOdOOafdOdOOOOOOOOgggOOOOOOOOdOdfbOOdOOOOOpOOOdOOOOdOOOOOdOOOOOOd",
		"dOOOOOOdvdddOdOOOOdOOpOOddOOdOOdOOOdOOOOOOOOgggOOOOOOOOdOOOdOOdOOddOOpOOdOOOOdOdddvdOOOOOOd",
		"dOOOOOOdOOOOOOOOOOdddOdOddOOddOdOOOdOOOOOOOOgggOOOOOOOOdOOOdOddOOddOdOdddOOOOOOOOOOdOOOOOOd",
		"dOOOOOeddddddddddddOdOOOdddOOdOdOOOdOOOOOOOOgggOOOOOOOOdOOOdOdOOdddOOOdOddddddddddddeOOOOOd",
		"dOOOOOOOOOOOOOOOOOOOdOOOdOdOOdOdddddOOOOOOOOgggOOOOOOOOdddddOdOOdOdOOOdOOOOOOOOOOOOOOOOOOOd",
		"dOOOdddOOOOOdOOOOOOOdOOOdOddddOOOOOOOOOOOOOOgggOOOOOOOOOOOOOOddddOdOOOdOOOOOOOdOOOOOdddOOOd",
		"dOOOgggOOOOOdOOOOOOOdOOOddOOOOOOOOOOOOOOOOOOgggOOOOOOOOOOOOOOOOOOddOOOdOOOOOOOdOOOOOgggOOOd",
		"dOOOOggOOOOOdOOafbOOdOOOOdOOOOOOOOOOOOOOOOOOgggOOOOOOOOOOOOOOOOOOdOOOOdOOafbOOdOOOOOggOOOOd",
		"dOOOOggOOOOOdOOgtgOOdOOOOdOOOOOOOOOOOOOOOOOOgggOOOOOOOOOOOOOOOOOOdOOOOdOOgtgOOdOOOOOggOOOOd",
		"dOOOgggOOOOOdOOrfkOOOOOOegOOOOOaffdOOOOOOOOOgggOOOOOOOOOdffbOOOOOgeOOOOOOrfkOOdOOOOOgggOOOd",
		"dOddddddOmOOgOOOOOdOOOOOOdOOOOOgOOdOOOOOOOOOgggOOOOOOOOOdOOgOOOOOdOOOOOOdOOOOOgOOmOddddddOd",
		"dOdOOOOOOmOfcfffffdOOOOOOOOOOOOgOOdOOOOOOOpOgggOpOOOOOOOdOOgOOOOOOOOOOOOdfffffcfOmOOOOOOdOd",
		"dOdOOOOOOmOOOOOOOOdOOOOOOOOOOOOpppdOOOOOOOpOgggOpOOOOOOOdpppOOOOOOOOOOOOdOOOOOOOOmOOOOOOdOd",
		"ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
	],
	[ // empty
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
		"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
	],
]

// Game data
const players = [];
const map = Array.from(maps[0]);

// Easy methods
function _getGamers(currentID) {
	return players.filter(io => io.isPlaying && io.id !== currentID).map( ({ id, pos }) => ({ id, pos }) )
}

// Generate player position
// function _getNextPos() {
// 	if(players.length % 2) {
// 		console.log("B");
// 	}
// }

// Game process
io.on('connection', socket => {
	console.log(`User ${ socket.id } is connecting to the game server.`);

	let playObject = {
		isPlaying: false,
		id: socket.id,
		socket,
		pos: _getNextPos() // DEBUG
	}

	players.push(playObject);

	// Send game data
	socket.on("READY_TO_PLAY_STATUS", data => {
		if(!data) return; // value is false

		playObject.isPlaying = true;
		socket.emit("RESPONSE_GAME_DATA", {
			map,
			arrHeight: map.length,
			players: _getGamers(playObject.id),
			playerID: playObject.id,
			// startPosition: 
		});
	});

	// Receive player position
	socket.on("UPDATE_PLAYER_STATS", data => {
		playObject.pos = data.pos;
		playObject.health = data.health;

		socket.broadcast.emit("MANUAL_PLAYER_UPDATE", {
			player: (({ id, pos, health }) => ({ id, pos, health }))(playObject)
		});
	});

	// Someone added a new active bullet
	socket.on("GAME_BULLET_ADDED", data => {
		socket.broadcast.emit("MANUAL_GAME_BULLET_ADDED", {
			bullet: data.bullet,
			casterID: data.casterID
		});
	});

	// Someone destroyed block
	socket.on("GAME_DESTROY_BLOCK", ({ x, y }) => {
		// XXX: Shit way to do that.

		let a = map[y].split("");
		a[x] = 'o';
		map[y] = a.join("");
	})

	// Pull user on disconnect
	socket.on('disconnect', () => {
		socket.broadcast.emit("MANUAL_PLAYER_DISCONNECT", {
			id: playObject.id
		});

		players.splice( players.findIndex(io => io.id === playObject.id) , 1)
	});
});