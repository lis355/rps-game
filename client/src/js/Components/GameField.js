const React = require("react");
const ShapesLine = require("./ShapesLine");
const Shape = require("./Shape");

module.exports = class GameField extends React.Component {
	constructor(props) {
		super(props);

		this.gameStates = {
			choosing: "choosing",
			waitingOpponent: "waitingOpponent",
			showResults: "showResults",
			waitNextRound: "waitNextRound"
		};

		this.state = {};
	}

	componentDidMount() {
		this.props.player.onGameMessage = this._onGameMessage.bind(this);

		this._startNewRound();
	}

	componentWillUnmount() {
		this.props.player.onGameMessage = null;
	}

	_startNewRound() {
		this.setState({
			game: this.gameStates.choosing,
			selectedOpponentShape: "",
			selectedPlayerShape: "",
			playerSuccess: false,
			playerFail: false,
			opponentSuccess: false,
			opponentFail: false
		});
	}

	_onGameMessage(message) {
		if (message.selectedShape) {
			let newState = {selectedOpponentShape: message.selectedShape};

			if (this.state.game === this.gameStates.waitingOpponent) {
				newState.game = this.gameStates.showResults;
			}

			this.setStateAnimated(newState);

			// DEBUG
			// if (this.state.game === this.gameStates.choosing) {
			// 	let y = Object.keys(Shape.type)[Math.floor(Math.random() * Object.keys(Shape.type).length)];
			// 	setTimeout(() => {this._onShapeClick(y)}, 300);
			// }
		}
	}

	_onShapeClick(shape) {
		if (this.state.game !== this.gameStates.choosing)
			return;

		let newState = {selectedPlayerShape: shape};

		newState.game = this.state.selectedOpponentShape ? this.gameStates.showResults : this.gameStates.waitingOpponent;
		newState.selectedOpponentShape = this.state.selectedOpponentShape;

		this.setStateAnimated(newState);

		this.props.player.sendGameMessage({selectedShape: shape});
	}

	setStateAnimated(newState) {
		let timeout = 0;

		if (newState.game === this.gameStates.showResults) {
			timeout = 1000;

			let compareResult = Shape.compareShape(this.state.selectedPlayerShape || newState.selectedPlayerShape, this.state.selectedOpponentShape ||  newState.selectedOpponentShape);
			console.log("compare", newState.selectedPlayerShape, newState.selectedOpponentShape, compareResult);

			if (compareResult === -1) {
				newState.playerSuccess = true;
				newState.playerFail = false;
				newState.opponentSuccess = false;
				newState.opponentFail = true;
			}
			else if (compareResult === 1) {
				newState.playerSuccess = false;
				newState.playerFail = true;
				newState.opponentSuccess = true;
				newState.opponentFail = false;
			}
			else if (compareResult === 0) {
				newState.playerSuccess = false;
				newState.playerFail = false;
				newState.opponentSuccess = false;
				newState.opponentFail = false;
			}
			else {
				newState.playerSuccess = false;
				newState.playerFail = true;
				newState.opponentSuccess = false;
				newState.opponentFail = true;
			}
		}

		setTimeout(() => {
			this.setState(newState);

			if (newState.game === this.gameStates.showResults) {
				setTimeout(() => {
					this._startNewRound();
				}, timeout * 2);
			}
		}, timeout);
	}

	_getResultLabel() {
		switch (this.state.game) {
			case this.gameStates.choosing:
				return "Choose shape!";
			case this.gameStates.waitingOpponent:
				return "Wait for opponent chose...";
			case this.gameStates.showResults:
			case this.gameStates.waitNextRound:
				if (this.state.playerSuccess) {
					return "You WIN!"
				}
				else if (this.state.opponentSuccess) {
					return "You LOSE(";
				}
				else if (this.state.selectedPlayerShape === this.state.selectedOpponentShape) {
					return "Standoff! One more time?";
				}
				else {
					return "Oops! Confusion)";
				}
		}
	}

	render() {
		return [
			<div key={0} className="f-10 d-flex justify-content-center align-items-center">
				<div className="f-6 d-flex flex-column justify-content-center align-items-center">
					<p className="lead">Your shape's</p>
					<ShapesLine userCanSelect={true} selected={this.state.selectedPlayerShape} success={this.state.playerSuccess} fail={this.state.playerFail} onShapeClick={this._onShapeClick.bind(this)}/>
				</div>
				<div className="f-6 d-flex flex-column justify-content-center align-items-center">
					<p className="lead">Opponents shape's</p>
					<ShapesLine selected={(this.state.game === this.gameStates.showResults) && this.state.selectedOpponentShape} success={this.state.opponentSuccess} fail={this.state.opponentFail}/>
				</div>
			</div>,
			<div key={1} className="f-2 d-flex justify-content-center align-items-center">
				<p className="lead">{this._getResultLabel()}</p>
			</div>
		];
	}
};
