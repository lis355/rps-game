const React = require("react");
const Call = require("../Call/Call");
const Sound = require("react-sound").default;

module.exports = class VideoChat extends React.Component {
	constructor(props) {
		super(props);

		this._call = new Call(this.props.player);
		this._call.onLocalStream = stream => this.setState({localStream: stream});
		this._call.onRemoteStream = stream => this.setState({remoteStream: stream});

		this.state = {};
	}

	_callOpponent(options) {
		this._call.start(options)
		//.then(stream => this.setState({localStream: stream}))
			.catch(this._onCallError.bind(this));
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

	_renderScreens() {
		if (this._isVideoCall()) {
			return (
				<div className="d-flex justify-content-center">
					<video className="m-1" playsInline autoPlay ref={e => e && (e.srcObject = this.state.remoteStream)}/>
					<video className="m-1" playsInline autoPlay ref={e => e && (e.srcObject = this.state.localStream)} muted/>
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
						<div className="d-flex justify-content-center">
							{!this._isAudioCall() && !this._isVideoCall() && <button type="button" className="btn btn-circle btn-outline-success shadow-none m-2 icon-button d-flex justify-content-center align-items-center calling" onClick={this._callOpponent.bind(this, {audio: true})}><i className="fas fa-phone"/></button>}
							{this._isAudioCall() && <button type="button" className="btn btn-circle btn-outline-danger shadow-none m-2 icon-button d-flex justify-content-center align-items-center" onClick={this._abortCall.bind(this)}><i className="fas fa-phone-slash"/></button>}
							{!this._isAudioCall() && !this._isVideoCall() && <button type="button" className="btn btn-circle btn-outline-primary shadow-none m-2 icon-button d-flex justify-content-center align-items-center" onClick={this._callOpponent.bind(this, {video: true, audio: true})}><i className="fas fa-video"/></button>}
							{this._isVideoCall() && <button type="button" className="btn btn-circle btn-outline-danger shadow-none m-2 icon-button d-flex justify-content-center align-items-center" onClick={this._abortCall.bind(this)}><i className="fas fa-video-slash"/></button>}
						</div>
					</div>
				</div>
				<Sound
					url={require("./../../sound/telephone-ring-03a.mp3")}
					playStatus={Sound.status.PLAYING}
					playFromPosition={0}
					loop={true}
				/>
			</div>
		);
	}
};
