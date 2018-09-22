const React = require("react");
const Call = require("../Call/Call");

const {Button} = require("reactstrap");

module.exports = class VideoChat extends React.Component {
	constructor(props) {
		super(props);

		this._call = new Call(this.props.player);
		this._call.onLocalStream = stream => this.setState({localStream: stream});
		this._call.onRemoteStream = stream => this.setState({remoteStream: stream});

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
			<div>
				{this._renderScreens()}
				<div>
					<Button outline color="primary" onClick={this.call.bind(this, {video: true, audio: true})}>Позвонить видео</Button>
					<Button outline color="primary" onClick={this.call.bind(this, {audio: true})}>Позвонить аудио</Button>
					<Button outline color="primary" onClick={this.abort.bind(this)}>Сбросить</Button>
				</div>
			</div>
		);
	}
};
