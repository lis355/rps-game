const React = require("react");
const classNames = require("classnames");

const shapeImages = {
	rock: require("./../../images/rock.png"),
	paper: require("./../../images/paper.png"),
	scissors: require("./../../images/scissors.png"),
	lizard: require("./../../images/lizard.png"),
	spock: require("./../../images/spock.png")
};

module.exports = class Shape extends React.Component {
	constructor(props) {
		super(props);

		this.shapes = {
			rock: "rock",
			paper: "paper",
			scissors: "scissors",
			lizard: "lizard",
			spock: "spock"
		};
	}

	render() {
		return (
			<div className="position-relative d-flex justify-content-center align-items-center m-2">

				<div className={classNames("shape-background m-auto bg-primary",
					this.props.selected && "shape-background-selected",
					this.props.success && "bg-success",
					this.props.fail && "bg-danger")}/>

				<img className={classNames("shape absolute-fill m-auto",
					this.props.selected && "shape-selected")} src={shapeImages[this.props.type]} onClick={this.props.onClick} ref={e => {e && (e.draggable = false);}}/>

			</div>
		);
	}
};
