const path = require("path");
const appConfig = require("./../common/config");
const webpack = require("webpack");
const htmlWebpackPlugin = new require("html-webpack-plugin");

module.exports = (env, argv) => {
	function isProduction() {
		return argv.mode === "production";
	}

	let config = {
		mode: isProduction() ? "production" : "development",
		entry: path.join(__dirname, "src/js/app.js"),
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['react', 'env']
						}

					}
				},
				{
					test: require.resolve("webrtc-adapter"),
					use: "expose-loader"
				},
				{
					test: /\.(scss|css)$/,
					use: ["style-loader", "css-loader", "sass-loader"]
				},
				{
					test: /\.(png|woff|woff2|eot|ttf|svg|mp3)$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "[name].[ext]",
								outputPath: "assets"
							}
						}
					]
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({PORT: isProduction() ? "" : appConfig.port}),
			new webpack.HotModuleReplacementPlugin(),
			new htmlWebpackPlugin({
				template: path.join(__dirname, "src/html/index.html"),
				filename: "./index.html"
			})
		],
		resolve: {
			extensions: [".js", ".jsx"]
		},
		devServer: {
			compress: true,
			port: 9000,
			watchOptions: {
				aggregateTimeout: 300,
				poll: 1000
			}
		}
	};

	if (!isProduction()) {
		config.devtool = "source-map";
	}

	return config;
};
