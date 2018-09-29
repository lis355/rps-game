const config = require("./../common/config");
const http = require("http");
const express = require("express");
const io = require("socket.io")();
const randomstring = require("randomstring").generate;

function getRandomId() {
	return randomstring(5);
}

// словари для хранения id сокетов.
// оригинальный socket.id слишком длинный и не красивый, будем использовать 5 буквенные хеши

let shortIdBySocketId = {};
let socketIdByShortId = {};
let opponents = {}; // словарь оппонентов по id игрока
let engagedSockets = {}; // занятые сокеты, которые сейчай в игре

function socketJoin(socket, opponentId) {
	if (opponentId === getId(socket))
		throw {text: "sameId", soft: true};

	let opponentSocket = io.sockets.connected[socketIdByShortId[opponentId]];
	if (!opponentSocket)
		throw {text: "badOpponentId", soft: true};

	let opponent = engagedSockets[opponentId];
	if (opponent)
		throw {text: "opponentAlreadyInGame", soft: true};

	// игроки могут играть только в парах, т.е. у каждого сокета либо есть оппонент (играет) либо нет (ждет)

	opponents[getId(socket)] = opponentSocket;
	opponents[opponentId] = socket;
	engagedSockets[getId(socket)] = true;
	engagedSockets[opponentId] = true;

	// отправляем обоим - начинаем игру
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
		delete opponents[getId(opponent)];
		engagedSockets[getId(socket)] = false;
		engagedSockets[getId(opponent)] = false;
	}
}

function getId(socket) {
	return shortIdBySocketId[socket.id];
}

// посылает произвольные сообшения нужными данными с пометкой типа messageType
// нужно для сигнального сервера для видеозвонков и для чата
function sendDataToOpponent(sender, messageType, data) {
	let opponent = opponents[getId(sender)];
	if (!opponent)
		throw {text: "noOpponent"};

	opponent.emit(messageType, data);
}

function sendChatMessageToOpponent(socket, messageText) {
	let opponent = opponents[getId(socket)];
	if (!opponent)
		throw {text: "noOpponent"};

	let message = {id: getId(socket), text: messageText};
	opponent.emit("message", message);
	socket.emit("message", message);
}

function socketConnect(socket) {
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

	// если в обработчике события от клиента что-то произошло - это может быть либо soft либо hard error, в первом случае
	// дисконнект не нужен (например, пользователь неправильно набрал id)

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

	// DEBUG
	// if (Object.keys(socketIdByShortId).length === 2) {
	// 	let s = io.sockets.connected[Object.values(socketIdByShortId)[0]];
	//
	// 	socketJoin(s, shortIdBySocketId[io.sockets.connected[Object.values(socketIdByShortId)[1]].id]);
	// }
}

let application = express();
application.use("/", express.static(`${process.cwd()}/../client/dist/`));

let port = process.env.PORT || config.port;
const server = http.createServer(application);
server.listen(port);

io.listen(server, {log: true})
	.on("connect", socketConnect);

console.log(`Server start listening port ${port}`);
