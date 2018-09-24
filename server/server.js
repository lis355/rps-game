const config = require("./../common/config");
const io = require("socket.io")();
 const randomstring = require("randomstring").generate;
const Enumerable = require("linq");

function getRandomId() {
	return randomstring(5);
}

let shortIdBySocketId = {};
let socketIdByShortId = {};
let opponents = {};
let engagedSockets = {};

function socketJoin(socket, opponentId) {
	if (opponentId === getId(socket))
		throw {text:"sameId", soft: true};

	let opponentSocket = io.sockets.connected[socketIdByShortId[opponentId]];
	if (!opponentSocket)
		throw {text:"badOpponentId", soft: true};

	let opponent = engagedSockets[opponentId];
	if (opponent)
		throw {text:"opponentAlreadyInGame", soft: true};

	opponents[getId(socket)] = opponentSocket;
	opponents[opponentId] = socket;
	engagedSockets[getId(socket)] = true;
	engagedSockets[opponentId] = true;

	opponentSocket.emit("joined");
	socket.emit("joined");
}

function socketLeave(socket) {
	freeOpponent(socket);

	socket.emit("leaved");
}

function freeOpponent(socket) {
	let opponent = opponents[getId(socket)];
	if (opponent) {
		opponent.emit("leaved");

		delete opponents[getId(socket)];
		delete opponents[opponent.id];
		engagedSockets[getId(socket)] = false;
		engagedSockets[opponent.id] = false;
	}
}

function getId(socket) {
	return shortIdBySocketId[socket.id];
}

function sendDataToOpponent(sender, messageType, data) {
	let opponent = opponents[getId(sender)];
	if (!opponent)
		throw {text:"noOpponent"};

	opponent.emit(messageType, data);
}

function sendChatMessageToOpponent(socket, messageText) {
	let opponent = opponents[getId(socket)];
	if (!opponent)
		throw {text:"noOpponent"};

	let message = {id: getId(socket), text: messageText};
	opponent.emit("message", message);
	socket.emit("message", message);
}

io.listen(config.port);

console.log(`Server start listening port ${config.port}`);

io.on("connect", socket => {
	shortIdBySocketId[socket.id] = getRandomId();
	socketIdByShortId[getId(socket)] = socket.id;

	console.log("connect", getId(socket));

	let handlers = {
		"disconnect": () => {
			freeOpponent(socket);

			let shortId = getId(socket);
			delete shortIdBySocketId[socket.id];
			delete socketIdByShortId[shortId];
		},
		"join": opponentId => {
			socketJoin(socket, opponentId);
		},
		"leave": () => {
			socketLeave(socket);
		},
		"message": messageText => {
			sendChatMessageToOpponent(socket, messageText);
		},
		"call": data => {
			sendDataToOpponent(socket, "call", data);
		},
		"game": data => {
			sendDataToOpponent(socket, "game", data);
		}
	};

	for (let handler in handlers) {
		socket.on(handler, data => {
			try {
				console.log(handler, getId(socket), data);
				handlers[handler](data);
			}
			catch (error) {
				try {
					socket.emit("serverError", error);
				}
				// eslint-disable-next-line no-empty
				catch (error) {
				}
				finally {
					try {
						if (!error.soft)
							socket.disconnect();
					}
					// eslint-disable-next-line no-empty
					catch (error) {
					}
					finally {
						console.error(error);
					}
				}
			}
		});
	}

	socket.emit("setId", getId(socket));

	if (Object.keys(socketIdByShortId).length === 2) {
		let s = io.sockets.connected[Object.values(socketIdByShortId)[0]];

		socketJoin(s, shortIdBySocketId[io.sockets.connected[Object.values(socketIdByShortId)[1]].id]);
	}
});
