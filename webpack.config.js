const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');

module.exports = {
	watch: false,
	context: srcDir,
	entry: {
		app: './index.jsx'
	},
	output: {
		path: distDir,
		filename: '[name].[chunkhash].js',
		publicPath: '/'
	},
	devServer: {
		historyApiFallback: true,
		contentBase: srcDir,
		publicPath: '/'
	},
	resolve: {
		modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')],
		extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.html']
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.(js|jsx)$/,
				loader: 'eslint-loader',
				options: {
					fix: true,
					emitWarning: true
				},
				exclude: /node_modules/
			},
			{
				test: /\.(js|jsx)$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										modules: false,
										useBuiltIns: 'usage',
										loose: true
									}
								],
								'@babel/preset-react',
								'@babel/preset-stage-0'
							]
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.(scss|css)$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1
							}
						}
					]
				}),
				exclude: /node_modules/
			},
			{
				test: /\.(jpg|jpeg|svg|png|woff2|woff)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]'
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'raw-loader'
					}
				],
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('assets/css/styles.css'),
		new HtmlWebpackPlugin({
			template: path.join(srcDir, 'index.html'),
			path: distDir,
			filename: 'index.html',
			minify: {
				collapseWhitespace: true,
				collapseInlineTagWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true
			}
		}),
		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: 'defer',
			preload: /\.js$/
		})
	]
};
