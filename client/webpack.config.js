const path = require("path");
const appConfig = require("./../common/config");
const webpack = require("webpack");
const htmlWebpackPlugin = new require("html-webpack-plugin");

let config = {
	entry: path.join(__dirname, "src/js/app.js"),
	devtool: "source-map",
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
		new webpack.DefinePlugin({PORT: appConfig.port}),
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

module.exports = config;