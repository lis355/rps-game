const config = require("./../common/config");
const io = require("socket.io")();
const randomstring = require("randomstring").generate;
const Enumerable = require("linq");

function getRandomId() {
	return randomstring(5);
}

function getGameRoom(socket) {
	return Enumerable.from(socket.adapter.rooms)
		.firstOrDefault(x => x.value.length === 2);
}

function getMyRoom(socket) {
	return Enumerable.from(socket.adapter.rooms)
		.first(x =>	x.value.length === 1 && x.value.sockets[socket.id]);
}

function getOpponent(socket) {
	return Enumerable.from(getGameRoom(socket).sockets)
		.first(x =>
			x.value.id !== socket.id);
}

io.listen(config.port);

console.log(`Server start listening port ${config.port}`);

io.on("connect", socket => {
	console.log("connect", socket.id);

	let handlers = {
		"disconnect": () => {
			console.log("Disconnect", socket.id);
		},
		"join": opponentId => {
			if (opponentId === socket.id)
				throw "sameId";

			let gameRoom = getGameRoom(socket);
			if (gameRoom)
				throw "alreadyInGame";

			let opponentSocket = io.sockets.connected[opponentId];
			if (!opponentSocket)
				throw "badOpponentId";

			let room = getMyRoom(socket);

			opponentSocket.join(room);
			opponentSocket.emit("joined");

			socket.emit("joined");
		},
		"leave": () => {
			console.log("leave " + socket.id);
			let room = getGameRoom(socket);
			if (!room)
				throw "mustBeInGame";

			Enumerable.from(room.sockets)
				.forEach(x => {
					let roomSocket = x.value;
					roomSocket.leave(room);

					room.emit("leaved");
				});
		},
		"message": messageText => {
			console.log("message", messageText);
			let opponent = getOpponent(socket);
			if (!opponent)
				throw "noOpponent";

			opponent.emit("message", {id: socket.id, text: messageText});
		},
		"call": data => {
			console.log("call " + socket.id + data);
			let opponent = getOpponent(socket);
			if (!opponent)
				throw "noOpponent";

			opponent.emit("call", data);
		}
	};

	for (let handler in handlers) {
		socket.on(handler, data => {
			try {
				console.log(handler, socket.id, data);
				handlers[handler](data);
			}
			catch (error) {
				try {
					socket.emit("serverError", error);
				}
				catch (error) {
				}
				finally {
					try {
						socket.disconnect();
					}
					catch (error) {
					}
					finally {
						console.error(error);
					}
				}
			}
		});
	}

	socket.emit("setId", socket.id);
});
