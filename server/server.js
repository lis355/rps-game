const config = require("./../common/config");
const io = require("socket.io")();
// const randomstring = require("randomstring").generate;
const Enumerable = require("linq");
//
// function getRandomId() {
// 	return randomstring(5);
//}

let opponents = {};
let engagedSockets = {};

function socketJoin(socket, opponentId) {
	if (opponentId === socket.id)
		throw {text:"sameId", soft: true};

	let opponentSocket = io.sockets.connected[opponentId];
	if (!opponentSocket)
		throw {text:"badOpponentId", soft: true};

	let opponent = engagedSockets[opponentId];
	if (opponent)
		throw {text:"opponentAlreadyInGame", soft: true};

	opponents[socket.id] = opponentSocket;
	opponents[opponentId] = socket;
	engagedSockets[socket.id] = true;
	engagedSockets[opponentId] = true;

	opponentSocket.emit("joined");
	socket.emit("joined");
}

function socketLeave(socket) {
	freeOpponent(socket);

	socket.emit("leaved");
}

function freeOpponent(socket) {
	let opponent = opponents[socket.id];
	if (opponent) {
		opponent.emit("leaved");

		delete opponents[socket.id];
		delete opponents[opponent.id];
		engagedSockets[socket.id] = false;
		engagedSockets[opponent.id] = false;
	}
}

io.listen(config.port);

console.log(`Server start listening port ${config.port}`);

io.on("connect", socket => {
	console.log("connect", socket.id);

	let handlers = {
		"disconnect": () => {
			freeOpponent(socket);
		},
		"join": opponentId => {
			console.log("join " + socket.id);
			socketJoin(socket, opponentId);
		},
		"leave": () => {
			console.log("leave " + socket.id);
			socketLeave(socket);
		},
		"message": messageText => {
			console.log("message", messageText);
			let opponent = opponents[socket.id];
			if (!opponent)
				throw {text:"noOpponent"};

			let message = {id: socket.id, text: messageText}
			opponent.emit("message", message);
			socket.emit("message", message);
		},
		"call": data => {
			console.log("call " + socket.id + data);
			let opponent = opponents[socket.id];
			if (!opponent)
				throw {text:"noOpponent"};

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
						if (!error.soft)
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
