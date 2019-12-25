import React from 'react'
import { render } from 'react-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import NavigationBar from './components/NavigationBar'
import Routes from './Routes'


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
			fontWeight: 500,
			lineHeight: '1.1rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.867rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '.877rem',
			}
		},
		h4: {
			fontWeight: 500,
			color: '#353535',
			lineHeight: '1.6rem',
			marginBottom: '.4rem',
			'@media screen and (min-width:0px)': {
				fontSize: '1.4rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '1.45rem'
			}
		},
		h5: {
			fontWeight: 600,
			lineHeight: '1.2rem',
			marginBottom: '.25rem',
			color: '#383838',
			'@media screen and (min-width:0px)': {
				fontSize: '1.05rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '1.07rem'
			}
		},
		h6: {
			fontWeight: 500,
			lineHeight: '1.2rem',
			color: '#383838',
			'@media screen and (min-width:0px)': {
				fontSize: '.95rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '.96rem'
			}
		},
		subtitle1: {
			fontWeight: 600,
			lineHeight: '1.15rem',
			color: '#2b2a2a',
			'@media screen and (min-width:0px)': {
				fontSize: '.91rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '.93rem'
			}
		},
		subtitle2: {
			fontWeight: 500,
			lineHeight: '1.15rem',
			color: '#2b2a2a',
			'@media screen and (min-width:0px)': {
				fontSize: '.88rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '.9rem'
			}
		},
		body1: {
			fontWeight: 500,
			lineHeight: '1.1rem',
			color: '#2b2a2a',
			'@media screen and (min-width:0px)': {
				fontSize: '.85rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '.86rem',
			}
		},
		body2: {
			fontWeight: 500,
			lineHeight: '1.05rem',
			color: '#2b2a2a',
			'@media screen and (min-width:0px)': {
				fontSize: '.77rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '.8rem'
			}
		},
	}
})

render(
	<div>
		<ThemeProvider theme={theme} >
			<NavigationBar />
			<Routes />
		</ThemeProvider>
	</div>,
	document.getElementById('root')
)
