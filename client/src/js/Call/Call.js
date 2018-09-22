const VideoEmitter = require("../Call/VideoEmitter");
const MediaConnection = require("../Call/MediaConnection");

module.exports = class Call {
	constructor(player) {
		this._player = player;

		this._player.onCall = this._onCall.bind(this);

		// DIRTY HACK
		this.onLocalStream;
		this.onRemoteStream;
	}

	start(options) {
		return new Promise((resolve, reject) => {
			return this._prepapreToCall(options)
				.then(() => {
					console.log("video captured");

					this._player.call({type: "start", options: options});
				})
				.then(() => this.onLocalStream(this._localVideoEmitter.stream) /*resolve(this._localVideoEmitter.stream)*/)
				.catch(reject);
		});
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
			this._prepapreToCall(message.options)
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
		else if (message.type === "finish") {
			this.finish();
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

	finish() {

	}
};
