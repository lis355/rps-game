const React = require("react");
const classNames = require("classnames");
const Call = require("../Call/Call");
const Sound = require("react-sound").default;

module.exports = class VideoChat extends React.Component {
	constructor(props) {
		super(props);

		this._call = new Call(this.props.player);
		this._call.onLocalStream = stream => this.setState({localStream: stream});
		this._call.onRemoteStream = stream => this.setState({remoteStream: stream, incomingCall: null});
		this._call.onCalling = options => this.setState({incomingCall: options});
		this._call.onCallFinish = options => this.setState({localStream: null, incomingCall: null});

		this.state = {};
	}

	componentWillUnmount() {
		if (this._isAudioOffer()
			|| this._isVideoOffer()
			|| this._isAudioCall()
			|| this._isVideoCall()) {
			this._call.finish();
		}
	}

	_callOpponent(options) {
		this._call.start(options)
			.catch(this._onCallError.bind(this));
	}

	_onAudioCallButton() {
		if (this.state.incomingCall) {
			this._call.answer();
		}
		else {
			this._callOpponent({audio: true});
		}
	}

	_onVideoCallButton() {
		if (this.state.incomingCall) {
			this._call.answer();
		}
		else {
			this._callOpponent({audio: true, video: true});
		}
	}

	_onCallError(error) {
		console.error(error);
	}

	_abortCall() {
		this._call.finish();

		this.setState({localStream: null, remoteStream: null});
	}

	_isAudioCall() {
		return this.state.localStream && this.state.localStream.getVideoTracks().length === 0;
	}

	_isVideoCall() {
		return this.state.localStream && this.state.localStream.getVideoTracks().length > 0;
	}

	_isAudioOffer() {
		return this.state.incomingCall && this.state.incomingCall.audio && !this.state.incomingCall.video;
	}

	_isVideoOffer() {
		return this.state.incomingCall && this.state.incomingCall.video;
	}

	_renderScreens() {
		if (this._isVideoCall()) {
			return (
				<div className="d-flex justify-content-center">
					{this.state.remoteStream && <video className="m-1 rounded" playsInline autoPlay ref={e => e && (e.srcObject = this.state.remoteStream)}/>}
					{this.state.localStream && <video className="m-1 rounded" playsInline autoPlay ref={e => e && (e.srcObject = this.state.localStream)} muted/>}
				</div>
			);
		}
		else if (this._isAudioCall()) {
			return (
				<div>
					<audio autoPlay ref={e => e && (e.srcObject = this.state.remoteStream)}/>
				</div>
			);
		}
	}

	_renderCallButtons() {
		let isCall = this._isAudioCall() || this._isVideoCall();

		let audioCallButtonClasses = "btn btn-circle btn-outline-success shadow-none m-2 icon-button d-flex justify-content-center align-items-center";
		if (this._isAudioOffer())
			audioCallButtonClasses = classNames(audioCallButtonClasses, "calling");

		let videoCallButtonClasses = "btn btn-circle btn-outline-primary shadow-none m-2 icon-button d-flex justify-content-center align-items-center";
		if (this._isVideoOffer())
			videoCallButtonClasses = classNames(videoCallButtonClasses, "calling");

		return (
			<div className="d-flex justify-content-center">
				{!isCall && !this._isVideoOffer() && <button type="button" className={audioCallButtonClasses} onClick={this._onAudioCallButton.bind(this)}><i className="fas fa-phone"/></button>}
				{this._isAudioCall() && <button type="button" className="btn btn-circle btn-outline-danger shadow-none m-2 icon-button d-flex justify-content-center align-items-center" onClick={this._abortCall.bind(this)}><i className="fas fa-phone-slash"/></button>}
				{!isCall && !this._isAudioOffer() && <button type="button" className={videoCallButtonClasses} onClick={this._onVideoCallButton.bind(this)}><i className="fas fa-video"/></button>}
				{this._isVideoCall() && <button type="button" className="btn btn-circle btn-outline-danger shadow-none m-2 icon-button d-flex justify-content-center align-items-center" onClick={this._abortCall.bind(this)}><i className="fas fa-video-slash"/></button>}
			</div>
		);
	}

	render() {
		console.log("VideoChat render");

		return (
			<div className="d-flex justify-content-center">
				<div className="card mt-3 mb-3">
					<div className="card-body p-3 d-flex flex-column">
						<div className="d-flex justify-content-center">
							{this._renderScreens()}
							{/*{!this._isVideoCall() && <div className="bg-primary m-1 video-test"/>}*/}
							{/*{!this._isVideoCall() && <div className="bg-secondary m-1 video-test"/>}*/}
						</div>
						{this._renderCallButtons()}
					</div>
				</div>
				<Sound
					url={require("./../../sound/telephone-ring-03a.mp3")}
					playStatus={this.state.incomingCall ? Sound.status.PLAYING : Sound.status.STOPPED}
					playFromPosition={0}
					loop={true}
				/>
			</div>
		);
	}
};
