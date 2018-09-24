const React = require("react");
const Chat = require("./Chat");
const VideoChat = require("./VideoChat");
const GameField = require("./GameField");

module.exports = class Game extends React.Component {
	render() {
		return (
			<div className="absolute-fill d-flex flex-column">
				<div className="f-3 d-flex flex-column">
					<GameField player={this.props.player}/>
				</div>
				<div className="f-9 d-flex">
					<div className="f-3"/>
					<div className="flex-grow-1 d-flex flex-column justify-content-end">
						<VideoChat player={this.props.player}/>
					</div>
					<div className="f-3 d-flex flex-column justify-content-end">
						<Chat player={this.props.player}/>
					</div>
				</div>
			</div>
		);
	}
};
