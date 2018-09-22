const React = require("react");
const {render} = require("react-dom");

require("normalize.css");
require("bootstrap/dist/css/bootstrap.css");

require("./../css/style.scss");

const Application = require("./Components/Application");

render(<Application/>, document.getElementById("root"));
