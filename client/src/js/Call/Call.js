const VideoEmitter = require("../Call/VideoEmitter");
const MediaConnection = require("../Call/MediaConnection");

module.exports = class Call {
	constructor(player) {
		const emptyFunction = function () {};

		this._player = player;

		this._player.onCall = this._onCall.bind(this);

		this.onLocalStream = emptyFunction;
		this.onRemoteStream = emptyFunction;
		this.onCalling = emptyFunction;
		this.onCallFinish = emptyFunction;
	}

	start(options) {
		return new Promise((resolve, reject) => {
			return this._prepapreToCall(options)
				.then(() => {
					console.log("video captured");

					this._callOffer = true;

					this._player.call({type: "start", options: options});
				})
				.then(() => this.onLocalStream(this._localVideoEmitter.stream) /*resolve(this._localVideoEmitter.stream)*/)
				.catch(reject);
		});
	}

	answer() {
		if (this._callOffer) {
			this._callOffer = false;

			this._prepapreToCall(this._callOptions)
				.then(() => {
					console.log("video captured");

					this.onLocalStream(this._localVideoEmitter.stream);
				})
				.then(() => {
					this._mediaConnection = new MediaConnection(this._localVideoEmitter.stream, this._player.call.bind(this._player));
					this._mediaConnection.onRemoteStream = this.onRemoteStream.bind(this);

					this._player.call({type: "ready"});
				})
				.catch(error => {
					this.finish();

					this._player.call({type: "error", error: error});
				});
		}
	}

	_prepapreToCall(options) {
		return new Promise((resolve, reject) => {
			this._localVideoEmitter = new VideoEmitter(options);
			this._toOpponentVideoEmitter = new VideoEmitter(options);

			return this._localVideoEmitter.start()
				.then(() => this._toOpponentVideoEmitter.start())
				.then(resolve)
				.catch(reject);
		});
	}

	_onCall(message) {
		if (message.type === "start") {
			this._callOffer = true;
			this._callOptions = message.options;

			this.onCalling(message.options);
		}
		else if (message.type === "finish") {
			this._abort();

			this.onCallFinish();
		}
		else if (message.type === "ready") {
			this._mediaConnection = new MediaConnection(this._localVideoEmitter.stream, this._player.call.bind(this._player));
			this._mediaConnection.onRemoteStream = this.onRemoteStream.bind(this);
			this._mediaConnection.connect();
		}
		else if (message.type === "error") {
			this.finish();
			console.error(message.error);
		}
		else if (this._mediaConnection) {
			this._mediaConnection.onRecieveMessage(message);
		}
	}

	_abort() {
		if (this._localVideoEmitter) {
			this._localVideoEmitter.stop();
			delete this._localVideoEmitter;
		}

		if (this._toOpponentVideoEmitter) {
			this._toOpponentVideoEmitter.stop();
			delete this._toOpponentVideoEmitter;
		}

		if (this._callOffer) {
			this._callOffer = false;
		}
	}

	finish() {
		this._abort();

		this._player.call({type: "finish"});
	}
};
