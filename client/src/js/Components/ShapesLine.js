const React = require("react");
const Shape = require("./Shape");

module.exports = class ShapesLine extends React.Component {
	render() {
		return (
			<div className="d-flex justify-content-center">
				{Object.keys(Shape.type).map((item, index) => {
					return <Shape key={index} type={item} selected={this.props.selected === item} success={this.props.success} fail={this.props.fail}
					              onClick={this.props.userCanSelect && this.props.onShapeClick.bind(null, item)}/>;
				})}
			</div>
		);
	}
};
