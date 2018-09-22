module.exports = class VideoEmitter {
	constructor(options) {
		this._options = {};

		if (options.audio)
			this._options.audio = true;

		if (options.video)
			this._options.video = true;/*{
				width: options.video.width || 320,
				height: options.video.height || 240
			};*/

		this.stream = null;
	}

	start() {
		return new Promise((resolve, reject) => {
			if (this.stream) {
				resolve(this.stream);
			}
			else {
				navigator.mediaDevices
					.getUserMedia(this._options)
					.then(stream => {
						console.log(`VideoEmitter stream got`);
						//console.log(`VideoEmitter stream got with ${stream.getVideoTracks().length} video tracks (${JSON.stringify(this._getVideoSizeFromStream(stream))}) and ${stream.getAudioTracks().length} audio tracks`);

						this.stream = stream;
						resolve(this.stream);
					})
					.catch(reject);
			}
		});
	}

	stop() {
		return new Promise(resolve => {
			if (this.stream) {
				this.stream.getTracks().forEach(track => track.stop());
				delete this.stream;

				console.log("VideoEmitter stream stopped");
			}

			resolve();
		});
	}

	// _getVideoSizeFromStream(stream) {
	// 	let videoTracks = stream.getVideoTracks();
	// 	if (videoTracks.length)
	// 	{
	// 		let {width, height} = videoTracks[0].getSettings();
	// 		return {width: width, height:height};
	// 	}
	// }
};
