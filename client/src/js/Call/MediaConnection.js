module.exports = class MediaConnection {
	constructor(stream, sendMessage) {
		const emptyFunction = function () {};

		this._stream = stream;
		this._sendMessage = sendMessage;

		this.onRemoteStream = emptyFunction;
		this.onConnected = emptyFunction;
		this.onDisconnected = emptyFunction;

		this._onCallError = this._onCallError.bind(this);
	}

	_getPeerConnection() {
		if (!this._peerConnection) {
			this._iceCandidates = [];
			this._descriptorsExchanged = false;

			const servers = null;
			this._peerConnection = new RTCPeerConnection(servers);

			this._peerConnection.onicecandidate = event => {
				console.log("onicecandidate");

				// если event.candidate === null то все кандидаты были отосланы, отправлять не надо
				let candidate = event.candidate;
				if (candidate) {
					if (this._descriptorsExchanged) {
						this._sendCandidate(candidate);
					}
					else {
						this._iceCandidates.push(candidate);
					}
				}
			};

			this._peerConnection.ontrack = event => {
				console.log("onaddstream");

				this.onRemoteStream(event.streams[0]);
			};

			this._iceCandidates = [];

			// добавляем в соединение поток нашего видео
			this._peerConnection.addStream(this._stream);
		}

		return this._peerConnection;
	}

	_peersDescriptorsExchanged() {
		this._descriptorsExchanged = true;

		this._iceCandidates.forEach(this._sendCandidate.bind(this));
	}

	_sendCandidate(candidate) {
		this._sendMessage({type: "candidate", candidate: candidate});
	}

	connect() {
		let offerSessionDescription;
		this._getPeerConnection().createOffer() // создаем оффер на подключение, полученный offerSessionDescription нужно применить локально и отправить на сервер
			.then(description => {
				console.log("createOffer ok");
				offerSessionDescription = description;
				return this._getPeerConnection().setLocalDescription(offerSessionDescription);
			})
			.then(() => {
				console.log("createOffer setLocalDescription ok");
				// отправляем на сервер оффер
				this._sendDescription(offerSessionDescription);
			})
			.catch(this._onCallError);
	}

	onRecieveMessage(message) {
		switch (message.type) {
			case "abort": {
				this._abortConnection();

				break;
			}
			case "candidate": {
				console.log("remote addIceCandidate");

				this._getPeerConnection().addIceCandidate(new RTCIceCandidate(message.candidate))
					.then(() => {
						console.log("_onCall remote addIceCandidate ok");
					})
					.catch(this._onCallError);

				break;
			}
			case "description": {
				console.log("_onCall setRemoteDescription");
				let sessionDescription = new RTCSessionDescription(message.sessionDescription);
				let answerSessionDescription;
				this._getPeerConnection().setRemoteDescription(sessionDescription)
					.then(() => {
						console.log("_onCall setRemoteDescription ok");

						if (sessionDescription.type === "answer") {
							console.log("done sender");
							this._descriptorsExchanged = true;
						}
						else if (sessionDescription.type === "offer") {
							return this._getPeerConnection().createAnswer()
								.then(description => {
									console.log("_onCall createAnswer ok");
									answerSessionDescription = description;
									return this._getPeerConnection().setLocalDescription(answerSessionDescription);
								})
								.then(() => {
									console.log("_onCall createAnswer setLocalDescription ok");

									this._sendDescription(answerSessionDescription);

									console.log("done reciever");

									this._descriptorsExchanged = true;
								});
						}
					})
					.catch(this._onCallError);

				break;
			}
		}
	}

	_sendDescription (description) {
		this._sendMessage({type: "description", sessionDescription: description});
	}

	_onCallError(error) {
		console.error(error);
	}

	_abortConnection() {
		if (this._peerConnection) {
			this._peerConnection.close();
			delete this._peerConnection;
		}
	}

	disconnect() {
		this._abortConnection();

		this._sendMessage({type: "abort"});
	}
};
