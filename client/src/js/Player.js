let io = require("socket.io-client");

class Player {
	constructor() {
		const emptyFunction = function () {};

		this.id = undefined;

		this.onConnect = emptyFunction;
		this.onDisconnect = emptyFunction;
		this.onSetId = emptyFunction;
		this.onJoined = emptyFunction;
		this.onError = emptyFunction;
		this.onLeaved = emptyFunction;
		this.onMessage = emptyFunction;
		this.onCall = emptyFunction;
		this.onGameMessage = emptyFunction;
	}

	start() {
		if (this._socket)
			return;

		// eslint-disable-next-line no-undef
		this._socket = io("http://localhost:" + PORT)
			.on("connect", () => {
				console.log("Connect");
				this.onConnect();
			}).on("disconnect", (reason) => {
				console.log("Disconnect");
				this.onDisconnect(reason);
			}).on("serverError", error => {
				console.error("serverError", error);
				this.onError(error);
			}).on("setId", id => {
				console.log(`Server get id ${id}`);
				this.id = id;
				this.onSetId(this.id);
			}).on("joined", () => {
				console.log("joined");
				this.onJoined();
			}).on("leaved", () => {
				console.log("leaved");
				this.onLeaved();
			}).on("message", message => {
				console.log("message");
				this.onMessage(message);
			}).on("call", data => {
				console.log("remote call ", data);
				this.onCall(data);
			}).on("game", data => {
				console.log("game data recieve", data);
				this.onGameMessage(data);
			});
	}

	stop() {
		this._socket.close();
		this._socket = null;
	}

	reConnect() {
		this._socket.connect();
	}

	connectToPlayer(opponentId) {
		this._socket.emit("join", opponentId);
	}

	leave() {
		this._socket.emit("leave");
	}

	sendMessage(messageText) {
		this._socket.emit("message", messageText)
	}

	call(data) {
		console.log("call ", data);
		this._socket.emit("call", data);
	}

	sendGameMessage(data) {
		console.log("game data send", data);
		this._socket.emit("game", data)
	}
}

module.exports = Player;
