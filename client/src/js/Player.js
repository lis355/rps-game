let io = require("socket.io-client");

class Player {
	constructor() {
		const emptyFunction = function () {};

		this.id = undefined;

		this.onConnect = emptyFunction;
		this.onDisconnect = emptyFunction;
		this.onSetId = emptyFunction;
		this.onJoined = emptyFunction;
		this.onBadOpponentId = emptyFunction;
		this.onLeaved = emptyFunction;
		this.onMessage = emptyFunction;
		this.onCall = emptyFunction;
	}

	start() {
		if (this.socket)
			return;

		// eslint-disable-next-line no-undef
		this.socket = io("http://localhost:" + PORT)
			.on("connect", () => {
				console.log("Connect");
				this.onConnect();
			}).on("disconnect", (reason) => {
				console.log("Disconnect");
				this.onDisconnect();
			}).on("setId", id => {
				console.log(`Server get id ${id}`);
				this.id = id;
				this.onSetId(this.id);
			}).on("joined", () => {
				console.log("joined");
				this.onJoined();
			}).on("badOpponentId", () => {
				console.error("badOpponentId");
				this.onBadOpponentId();
			}).on("leaved", () => {
				console.log("leaved");
				this.onLeaved();
			}).on("message", message => {
				console.log("message");
				this.onMessage(message);
			}).on("call", data => {
				console.log("remote call ", data);
				this.onCall(data);
			});
	}

	stop() {
		this.socket.close();
		this.socket = null;
	}

	connectToPlayer(opponentId) {
		this.socket.emit("join", opponentId);
	}

	leave() {
		this.socket.emit("leave");
	}

	sendMessage(messageText) {
		this.socket.emit("message", messageText)
	}

	call(data) {
		console.log("call ", data);
		this.socket.emit("call", data);
	}
}

module.exports = Player;