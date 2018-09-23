const React = require("react");
const classNames = require("classnames");

module.exports = class ChatMessage extends React.Component {
	render() {
		let classes = this.props.isOwn ? "alert-primary text-right align-self-end" : "alert-secondary align-self-start";

		return (
			<div className={classNames("rounded p-2 m-1 mw-75", classes)}>{this.props.text}</div>
		);
	}
};
