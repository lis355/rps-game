const React = require("react");
const Chat = require("./Chat");
const VideoChat = require("./VideoChat");

module.exports = class Game extends React.Component {
	render() {
		return (
			<div>
				<VideoChat player={this.props.player}/>
				<Chat player={this.props.player}/>
			</div>
		);
	}
};
