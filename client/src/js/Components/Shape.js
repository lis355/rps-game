const React = require("react");
const classNames = require("classnames");

const shapeImages = {
	rock: require("./../../images/rock.png"),
	paper: require("./../../images/paper.png"),
	scissors: require("./../../images/scissors.png"),
	lizard: require("./../../images/lizard.png"),
	spock: require("./../../images/spock.png")
};

class Shape extends React.Component {
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
}

Shape.type = {
	rock: "rock",
	paper: "paper",
	scissors: "scissors",
	lizard: "lizard",
	spock: "spock"
};

Shape.shapeWins = {
	rock: [Shape.type.scissors, Shape.type.lizard],
	paper: [Shape.type.rock, Shape.type.spock],
	scissors: [Shape.type.paper, Shape.type.lizard],
	lizard: [Shape.type.paper, Shape.type.spock],
	spock: [Shape.type.rock, Shape.type.scissors]
};

Shape.compareShape = function(a, b) {
	if (Shape.shapeWins[a] && Shape.shapeWins[a].includes(b)) return -1;
	if (Shape.shapeWins[b] && Shape.shapeWins[b].includes(a)) return 1;
	if (a === b) return 0;
	return undefined;
};

module.exports = Shape;
