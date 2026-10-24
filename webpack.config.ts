import path from 'path'
import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

import * as environment from './.env-cmdrc.json'
import * as packageInfo from './package.json'
import webpack from 'webpack'
import webpackDashboard from 'webpack-dashboard/plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration
}

type environment = 'dev' | 'remote-dev' | 'prod'

function config(env: any, argv: { mode?: string }) {
	let e: environment

	if (env && env.prod) {
		e = 'prod'
	} else if (env && env['remote-dev']) {
		e = 'remote-dev'
	} else {
		e = 'dev'
	}

	console.log(`Using environment ${e}`)

	return {
		entry: './src/index.tsx',
		// Where files should be sent once they are bundled
		output: {
			path: path.resolve(__dirname, 'build'),
			// production names carry a hash of their content, so browsers can keep them for a year and a deploy only changes the files that changed
			filename: argv.mode === 'production' ? '[name].[contenthash:8].js' : 'bundle.js',
			publicPath: '/',
			clean: true,
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
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.jsx'],
		},
		plugins: [
			new HtmlWebpackPlugin({ template: './public/index.html', filename: 'index.html', inject: 'body' }),
			new CopyWebpackPlugin({
				patterns: [{ from: 'public/Img', to: 'assets' }],
			}),
			new webpack.DefinePlugin({
				'process.env.REACT_APP_API_HOST': JSON.stringify(environment[e].REACT_APP_API_HOST),
				'process.env.REACT_APP_SKC_SUGGESTION_HOST': JSON.stringify(environment[e].REACT_APP_SKC_SUGGESTION_HOST),
				'process.env.REACT_APP_HEART_API_HOST': JSON.stringify(environment[e].REACT_APP_HEART_API_HOST),
				'process.env.REACT_APP_CLIENT_ID': JSON.stringify(environment[e].REACT_APP_CLIENT_ID),
				'process.env.REACT_APP_VERSION': JSON.stringify(packageInfo.version),
			}),
			// babel only strips types, so type errors come from tsc in a separate process - they still fail a production build
			new ForkTsCheckerWebpackPlugin(),
			// only start:dashboard runs the dashboard that this plugin reports to
			...(env?.dashboard ? [new webpackDashboard()] : []),
		],
	} as Configuration
}

export default config
