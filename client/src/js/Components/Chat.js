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

	_sendMessageKey(key) {
		if (key.charCode === 13)
			this._sendMessage();
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

	componentDidUpdate() {
		this._chatMessages.scrollTop = this._chatMessages.scrollHeight;
	}

	render() {
		return (
			<div className="absolute-fill d-flex flex-column">
				<div className="f-3"/>
				<div className="f-9 d-flex">
					<div className="f-9"/>
					<div className="f-3 d-flex justify-content-end">
						<div className="card chat-box m-3 flex-grow-1">
							<div className="card-body p-1 d-flex flex-column justify-content-end">
								<div className="flex-grow-1 d-flex flex-column chat-messages" ref={e => e && (this._chatMessages = e)}>
									{this.state.messages.map((message, index) => {
										return (
											<ChatMessage key={index} isOwn={message.id === this.props.player.id} text={message.text}/>
										);
									})}
								</div>
								<hr className="m-1"/>
								<div className="flex-grow-0 d-flex align-items-center chat-input-wrapper">
									<input className="form-control form-control-sm border-0 shadow-none chat-input" type="text" placeholder="Message" onKeyPress={this._sendMessageKey.bind(this)} ref={e => e && (this._messageInput = e)}/>
									<button type="button" className="btn btn-outline-primary shadow-none" onClick={this._sendMessage.bind(this)}>Send</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};
