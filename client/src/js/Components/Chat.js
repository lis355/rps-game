const React = require("react");
const ChatMessage = require("./ChatMessage");

module.exports = class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.kMaxMessages = 10;

		this.state = {messages: []};
	}

	componentDidMount() {
		this.props.player.onMessage = this._addMessage.bind(this);
	}

	componentWillUnmount() {
		this.props.player.onMessage = null;
	}

	_sendMessage() {
		let messageText = this._messageInput.value;
		if (messageText) {
			this.props.player.sendMessage(messageText);
			this._messageInput.value = "";
		}
	}

	_addMessage(message) {
		let newMessges = [...this.state.messages, message];
		while (newMessges.length > this.kMaxMessages)
			newMessges.shift();

		this.setState({messages: newMessges});
	}

	render() {
		return (
			<div className="card chat-box position-absolute m-3">
				<div className="card-body p-1 d-flex flex-column justify-content-end">
					<div className="flex-grow-1 d-flex flex-column justify-content-end chat-messages">
						{this.state.messages.map((message, index) => {
							return (
								<ChatMessage key={index} isOwn={message.id === this.props.player.id} text={message.text}/>
							);
						})}
					</div>
					<hr className="m-1"/>
					<div className="flex-grow-0 d-flex align-items-center chat-input-wrapper">
						<input className="form-control form-control-sm border-0 shadow-none chat-input" type="text" placeholder="Message" ref={e => e && (this._messageInput = e)}/>
						<button type="button" className="btn btn-outline-primary shadow-none" onClick={this._sendMessage.bind(this)}>Send</button>
					</div>
				</div>
			</div>
		);
	}
};
