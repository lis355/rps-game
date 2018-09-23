const React = require("react");
const Call = require("../Call/Call");

const {Button} = require("reactstrap");

module.exports = class VideoChat extends React.Component {
	constructor(props) {
		super(props);

		// this._call = new Call(this.props._player);
		// this._call.onLocalStream = stream => this.setState({localStream: stream});
		// this._call.onRemoteStream = stream => this.setState({remoteStream: stream});

		this.state = {};
	}

	call(options) {
		this._call.start(options)
		//.then(stream => this.setState({localStream: stream}))
			.catch(this._onCallError.bind(this));
	}

	_onCallError(error) {
		console.error(error);
	}

	abort() {
		this._call.finish();

		this.setState({localStream: null, remoteStream: null});
	}

	_renderScreens() {
		if (!this.state.localStream)
			return;

		let isVideo = this.state.localStream.getVideoTracks().length > 0;
		if (isVideo) {
			return (
				<div>
					<div>
						<video playsInline autoPlay ref={e => e && (e.srcObject = this.state.remoteStream)}/>
					</div>
					<div>
						<video playsInline autoPlay ref={e => e && (e.srcObject = this.state.localStream)} muted/>
					</div>
				</div>
			);
		}
		else {
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
			<div className="absolute-fill d-flex justify-content-center">
				<div className="col-sm"/>
				<div className="col-sm d-flex flex-column justify-content-end">
					<div className="card mb-3">
						<div className="card-body p-3 d-flex flex-column">
							<div className="d-flex">
								<div className="bg-primary m-1 video-test"/>
								<div className="bg-secondary m-1 video-test"/>
							</div>
							<div className="d-flex justify-content-center">
								<button type="button" className="btn btn-circle btn-outline-success shadow-none m-2 icon-button d-flex justify-content-center align-items-center" onClick={this.call.bind(this, {audio: true})}><i className="fas fa-phone"/></button>
								<button type="button" className="btn btn-circle btn-outline-danger shadow-none m-2 icon-button d-flex justify-content-center align-items-center" onClick={this.abort.bind(this)}><i className="fas fa-phone-slash"/></button>
								<button type="button" className="btn btn-circle btn-outline-primary shadow-none m-2 icon-button d-flex justify-content-center align-items-center" onClick={this.call.bind(this, {video: true, audio: true})}><i className="fas fa-video"/></button>
								<button type="button" className="btn btn-circle btn-outline-danger shadow-none m-2 icon-button d-flex justify-content-center align-items-center" onClick={this.abort.bind(this)}><i className="fas fa-video-slash"/></button>
							</div>
						</div>
					</div>
				</div>
				<div className="col-sm"/>
			</div>
		);
	}
};
