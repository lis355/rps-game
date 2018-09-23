const config = require("./../common/config");
const io = require("socket.io")();
const randomstring = require("randomstring").generate;

function getRandomId() {
	return randomstring(5);
}
/*
class Player {
	constructor(socket, manager) {
		this.id = getRandomId();
		this.socket = socket;
		this.manager = manager;

		this.socket.on("message", message => this.onMessage(message))
			;//.on("connectToPlayer", data => this.onConnectToPlayer(data));

		this.socket.emit("setId", this.id);
	}

	isInRoom() {
		return this.socket.adapter.rooms.length === 2;
	}

	getRoom() {
		return this.socket.adapter.rooms
	}

	onMessage(data) {
		console.log(`Message from ${this.socket.id}: ${data}`);

		if (!data
			|| !data.text)
			return;

		this.socket.emit("message", {id: this.id, text: data.text});
		console.log(`emit msg`);
	}

	onConnectToPlayer(data) {
		console.log(`ConnectToPlayer from ${this.socket.id}: ${data}`);

		if (!data
			|| !data.id)
			return;



	}
}

class PlayersManager {
	constructor(io) {
		this.io = io;
		this.players = {};
	}

	palyerConnected(socket) {
		console.log("connect " + socket.id);

		let palyer = new Player(socket, this);

		this.io.sockets.

		socket.on("disconnect", () => this.playerDisconnected(socket));

		socket.on("join", opponentId => {
			io.sockets.connected[socketId]
		})



		//test
		//socket.emit("message", {id: this.players[socket].id, msg: socket.id});


		// socket.on("connectToPlayer", data => this.onConnectToPlayer(data));
		//
		// socket.join("qqq");
		// let q = socket.adapter.rooms;
		// let qq = this.io.sockets;
		// let qqq = this.io.sockets.adapter.rooms;
		// let y=6;
	}

	playerDisconnected(socket) {
		console.log("disconnect " + socket.id);
		delete this.players[socket];
	}
}

let playersManager = new PlayersManager(io);
*/
//io.on("connect", playersManager.palyerConnected.bind(playersManager));
io.listen(config.port);

console.log(`Server start listening port ${config.port}`);

io.on("connect", socket => {
	console.log("connect " + socket.id);
	for (let i = 0; i < 10; i++)
		io.emit("message", {id: socket.id, text: getRandomId()});

	socket.on("disconnect", () => {
		console.log("disconnect " + socket.id);
	}).on("join", opponentId => {
		console.log("join " + opponentId);// socket.id);
		let opponentSocket = io.sockets.connected[opponentId];
		if (opponentSocket) {
			io.emit("joined");
		}
		else {
			socket.emit("badOpponentId");
		}
	}).on("leave", () => {
		console.log("leave " + socket.id);
		io.emit("leaved");
	}).on("message", messageText => {
		console.log("message", messageText);
		io.emit("message", {id: socket.id, text: messageText});
	}).on("call", data => {
		console.log("call " + socket.id + data);
		socket.broadcast.emit("call", data);
	}).emit("setId", socket.id);
});
