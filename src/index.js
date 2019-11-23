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
				fontSize: '.90rem'
			},
			'@media screen and (min-width:400px)': {
				fontSize: '1rem'
			},
			'@media screen and (min-width:550px)': {
				fontSize: '1.1rem'
			},
			'@media screen and (min-width:700px)': {
				fontSize: '1.18rem'
			}
		},
		h6: {
			fontWeight: 500,
			lineHeight: '1.35rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.90rem'
			},
			'@media screen and (min-width:400px)': {
				fontSize: '1rem'
			},
			'@media screen and (min-width:550px)': {
				fontSize: '1.1rem'
			},
			'@media screen and (min-width:700px)': {
				fontSize: '1.18rem'
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
			'@media screen and (min-width:550px)': {
				fontSize: '.85rem'
			},
			'@media screen and (min-width:700px)': {
				fontSize: '.9rem'
			}
		},
		subtitle2: {
			fontWeight: 600,
			lineHeight: '1.2rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.75rem'
			},
			'@media screen and (min-width:400px)': {
				fontSize: '.78rem'
			},
			'@media screen and (min-width:550px)': {
				fontSize: '.8rem'
			},
			'@media screen and (min-width:700px)': {
				fontSize: '.85rem'
			}
		},
		body1: {
			fontWeight: 400,
			lineHeight: '1.15rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.78rem'
			},
			'@media screen and (min-width:400px)': {
				fontSize: '.8rem'
			},
			'@media screen and (min-width:550px)': {
				fontSize: '.85rem'
			},
			'@media screen and (min-width:800px)': {
				fontSize: '.9rem',
				lineHeight: '1.2rem',
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
