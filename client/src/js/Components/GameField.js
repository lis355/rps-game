const React = require("react");
const ShapesLine = require("./ShapesLine");

module.exports = class GameField extends React.Component {
	constructor(props) {
		super(props);

		this.state = {playerChose:false, opponentChose:false};
	}

	componentDidMount() {
		this.props.player.onGameMessage = this._addMessage.bind(this);
	}

	componentWillUnmount() {
		this.props.player.onGameMessage = null;
	}

	_onGameMessage(message) {

	}

	render() {
		return [
			<div key={0} className="f-10 d-flex justify-content-center align-items-center">
				<div className="f-6 d-flex flex-column justify-content-center align-items-center">
					<p className="lead">Your shape's</p>
					<ShapesLine userCanSelect={true}/>
				</div>
				<div className="f-6 d-flex flex-column justify-content-center align-items-center">
					<p className="lead">Opponents shape's</p>
					<ShapesLine/>
				</div>
			</div>,
			<div key={1} className="f-2 d-flex justify-content-center align-items-center">
				<p className="lead">Select shape...</p>
			</div>
		];
	}
};
