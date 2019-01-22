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
const map = maps[0];

// Game process
io.on('connection', socket => {
	console.log(`User ${ socket.id } is connecting to the game server.`);

	players.push({
		isPlaying: false,
		id: socket.id,
		socket
	});

	socket.on("READY_TO_PLAY_STATUS", data => {
		if(!data) return; // value is false

		socket.emit("RESPONSE_GAME_DATA", {
			map,
			arrHeight: map.length
			// players
		});


	})
});