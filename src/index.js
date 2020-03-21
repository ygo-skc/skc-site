import React from 'react'
import { render } from 'react-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import NavigationBar from './components/NavigationBar'
import Routes from './Routes'
import './index.css'


const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#241776',
			contrastDefaultColor: 'light'
		},
		secondary: {
			main: '#f27d0c',
			contrastDefaultColor: 'light'
		}
	},
	overrides: {
		'MuiChip': {
			label:
			{
				fontWeight: 500,
				'@media screen and (min-width:0px)': {
					fontSize: '.81rem'
				},
				'@media screen and (min-width:600px)': {
					fontSize: '.825rem',
				}
			}
		}
	},
	typography: {
		button: {
			fontFamily: 'Nunito',
			lineHeight: '1.1rem',
			fontSize: '.85rem',
		},
		h4: {
			fontFamily: 'Nunito',
			fontWeight: 600,
			color: '#543fda',
			lineHeight: '1.5rem',
			marginBottom: '.75rem',
			fontSize: '1.23rem',
		},
		h5: {
			fontFamily: 'Nunito',
			fontWeight: 800,
			lineHeight: '1.45rem',
			marginBottom: '.5rem',
			color: '#404040',
			fontSize: '1.05rem'
		},
		h6: {
			fontFamily: 'OpenSans',
			fontWeight: 500,
			lineHeight: '1.4rem',
			color: '#383838',
			fontSize: '.95rem',
		},
		subtitle1: {
			fontFamily: 'OpenSans',
			fontWeight: 600,
			lineHeight: '1.15rem',
			color: '#2b2a2a',
			fontSize: '.91rem',
		},
		subtitle2: {
			fontFamily: 'OpenSans',
			fontWeight: 500,
			lineHeight: '1.15rem',
			color: '#2b2a2a',
			fontSize: '.88rem',
		},
		body1: {
			fontFamily: 'OpenSans',
			fontWeight: 500,
			lineHeight: '1.15rem',
			color: '#2b2a2a',
			fontSize: '.83rem',
		},
		body2: {
			fontFamily: 'OpenSans',
			fontWeight: 500,
			lineHeight: '1.1rem',
			color: '#2b2a2a',
			fontSize: '.77rem',
		},
	}
})

render(
	<div>
		<ThemeProvider
			theme={ theme } >
			<NavigationBar />
			<Routes />
		</ThemeProvider>
	</div>,
	document.getElementById('root')
)
