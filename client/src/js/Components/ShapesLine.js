const React = require("react");
const Shape = require("./Shape");

const shapes = {
	rock: "rock",
	paper: "paper",
	scissors: "scissors",
	lizard: "lizard",
	spock: "spock"
};

module.exports = class ShapesLine extends React.Component {
	constructor(props) {
		super(props);

		this.onShapeSelected = function () {};

		this.state = {};
	}

	_onShapeClick(shape) {
		if (!this.props.userCanSelect
			|| this.state.success
			|| this.state.fail)
			return;

		this.setState(() => {
			this.onShapeSelected();
			return {selectedShape: shape};
		});
	}

	_setSuccess(shape) {
		this.setState({selectedShape: shape, success: true});
	}

	_setFail(shape) {
		this.setState({selectedShape: shape, fail: true});
	}

	render() {
		return (
			<div className="d-flex justify-content-center">
				{Object.keys(shapes).map((item, index) => {
					return <Shape key={index} type={item} selected={this.state.selectedShape === item} onClick={this.props.onShapeClick.bind(this, item)}/>;
				})}
			</div>
		);
	}
};
