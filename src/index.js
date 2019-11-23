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
			main: '#FEB300',
			contrastDefaultColor: 'light'
		}
	},
	typography: {
		h5: {
			fontWeight: 600,
			lineHeight: '1.45rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.85rem'
			},
			'@media screen and (min-width:400px)': {
				fontSize: '.9rem'
			},
			'@media screen and (min-width:900px)': {
				fontSize: '.95rem'
			}
		},
		h6: {
			fontWeight: 500,
			lineHeight: '1.35rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.85rem'
			},
			'@media screen and (min-width:400px)': {
				fontSize: '.9rem'
			},
			'@media screen and (min-width:900px)': {
				fontSize: '.95rem'
			}
		},
		subtitle1: {
			fontWeight: 600,
			lineHeight: '1.35rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.78rem'
			},
			'@media screen and (min-width:400px)': {
				fontSize: '.8rem'
			},
			'@media screen and (min-width:900px)': {
				fontSize: '.85rem'
			}
		},
		subtitle2: {
			fontWeight: 600,
			lineHeight: '1.2rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.70rem'
			},
			'@media screen and (min-width:400px)': {
				fontSize: '.75rem'
			},
			'@media screen and (min-width:900px)': {
				fontSize: '.8rem'
			}
		},
		body1: {
			fontWeight: 400,
			lineHeight: '1.15rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.75rem'
			},
			'@media screen and (min-width:400px)': {
				fontSize: '.8rem'
			},
			'@media screen and (min-width:900px)': {
				fontSize: '.83rem'
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
