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
			color: '#5f5f5f',
			lineHeight: '2.5rem',
			marginBottom: '1rem',
			'@media screen and (min-width:0px)': {
				fontSize: '1.6rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '1.7rem'
			}
		},
		h5: {
			fontWeight: 600,
			lineHeight: '1.2rem',
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
			color: '#000',
			'@media screen and (min-width:0px)': {
				fontSize: '1.065rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '1.08rem'
			}
		},
		subtitle1: {
			fontWeight: 600,
			lineHeight: '1.15rem',
			'@media screen and (min-width:0px)': {
				fontSize: '.92rem'
			},
			'@media screen and (min-width:600px)': {
				fontSize: '.94rem'
			}
		},
		subtitle2: {
			fontWeight: 500,
			lineHeight: '1.15rem',
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
