const fs = require("fs");

const configPath = "./../config.json";

let config = {};

if (fs.existsSync(configPath)) {
	config = require(configPath);
	console.log(`${configPath} loaded`);
}

config.port = config.port || 5000;

module.exports = config;