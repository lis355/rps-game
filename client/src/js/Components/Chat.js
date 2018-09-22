const React = require("react");
const {findDOMNode} = require("react-dom");
const ChatMessage = require("./ChatMessage");

class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.kMaxMessages = 10;

		this.state = {messages: []};
	}

	componentDidMount() {
		this.props.player.onMessage = message => this.addMessage(message);
	}

	sendMessage() {
		let messageText = findDOMNode(this.refs.messageInput).value;
		this.props.sendMessage(messageText);
	}

	addMessage(message) {
		let newMessges = this.state.messages.concat(message);
		while (newMessges.length > this.kMaxMessages)
			newMessges.shift();

		this.setState({messages: newMessges})
	}

	render() {
		return (
			<div className="chat-box">
				<div className="chat-messages">
					{this.state.messages.map((message, index) => <ChatMessage key={index} message={message} self={message.id === this.props.player.id}/>)}
				</div>
				<div className="chat-input">
					<input placeholder="Сообщение" ref={"messageInput"}/>
					<button type="button" onClick={this.sendMessage.bind(this)}>Отправить</button>
				</div>
			</div>
		);
	}
}

module.exports = Chat;