const React = require("react");
const {findDOMNode} = require("react-dom");
const ChatMessage = require("./ChatMessage");

module.exports = class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.kMaxMessages = 10;

		this.state = {messages: []};
	}

	// componentDidMount() {
	// 	this.props.player.onMessage = message => this.addMessage(message);
	// }
	//
	// sendMessage() {
	// 	let messageText = findDOMNode(this.refs.messageInput).value;
	// 	this.props.sendMessage(messageText);
	// }
	//
	// addMessage(message) {
	// 	let newMessges = this.state.messages.concat(message);
	// 	while (newMessges.length > this.kMaxMessages)
	// 		newMessges.shift();
	//
	// 	this.setState({messages: newMessges})
	// }

	render() {
		return (
			<div className="card chat-box position-absolute m-3">
				<div className="card-body p-1 d-flex flex-column justify-content-end">
					<div className="flex-grow-1 d-flex flex-column justify-content-end chat-messages">
						<div className="d-inline-block alert-primary rounded rounded p-2 m-1 mw-75">A simple primary alert—check it out!</div>
						<div className="d-inline-block alert-secondary rounded rounded p-2 m-1 mw-75 text-right align-self-end">A simple primary alert—checkfdsf s fs fsf ds fdsf dsf ds it out!</div>
						<div className="d-inline-block alert-primary rounded rounded p-2 m-1 mw-75">A simple primarfdsf s dsfds sd dsy alert—check it out!</div>
						<div className="d-inline-block alert-primary rounded rounded p-2 m-1 mw-75">A simple primary alert—check it out!</div>
						<div className="d-inline-block alert-secondary rounded rounded p-2 m-1 mw-75 text-right align-self-end">A simple primary alert—checkfdsf s fs fsf ds fdsf dsf ds it out!</div>
						<div className="d-inline-block alert-primary rounded rounded p-2 m-1 mw-75">A simple primarfdsf s dsfds sd dsy alert—check it out!</div>
						<div className="d-inline-block alert-primary rounded rounded p-2 m-1 mw-75">A simple primary alert—check it out!</div>
						<div className="d-inline-block alert-secondary rounded rounded p-2 m-1 mw-75 text-right align-self-end">A simple primary alert—checkfdsf s fs fsf ds fdsf dsf ds it out!</div>
						<div className="d-inline-block alert-primary rounded rounded p-2 m-1 mw-75">A simple primarfdsf s dsfds sd dsy alert—check it out!</div>
					</div>
					<hr className="m-1"/>
					<div className="flex-grow-0 d-flex align-items-center chat-input-wrapper">
						<input className="form-control form-control-sm border-0 shadow-none chat-input" type="text" placeholder="Message"/>
						<button type="button" className="btn btn-outline-primary shadow-none">Send</button>
					</div>
				</div>
			</div>
		);
	}
};
