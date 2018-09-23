const React = require("react");

module.exports = class ChatMessage extends React.Component {
	constructor(props) {
		super(props);
		console.log("create msg ", props);
	}

	render() {
		return (
			<div className={this.props.self ? "message-out" : "message-in"}><span>{this.props.message.text + (this.props.self ? "message-out" : "message-in")}</span></div>
		);
	}
};
