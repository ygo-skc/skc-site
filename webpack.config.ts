import path from 'path'
import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'

// import * as environment from './.env-cmdrc.json'
// import webpack from 'webpack'

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration
}

const config: Configuration = {
	entry: './src/index.tsx',
	// Where files should be sent once they are bundled
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	// webpack 5 comes with devServer which loads in development mode
	devServer: {
		port: 3000,
		static: path.resolve(__dirname, './src'),
		open: true,
		hot: true,
		historyApiFallback: true,
	},
	// Rules of how webpack will take our files, compile & bundle them for the browser
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.tsx$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							compilerOptions: { noEmit: false },
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', 'jsx'],
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './public/index.html', filename: 'index.html', inject: 'body' }),
		new Dotenv({
			path: './.env',
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: 'public/Img', to: 'assets' }],
		}),
		// new webpack.DefinePlugin(environment['dev']),
	],
}

export default config
