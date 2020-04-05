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
			label: {
				fontWeight: 500,
				fontSize: '.81rem'
			}
		},
		'MuiTableCell': {
			head: {
				fontFamily: 'Nunito',
				fontWeight: 600,
				fontSize: '.93rem'
			},
			body: {
				fontFamily: 'Nunito',
				fontWeight: 500,
				fontSize: '.85rem'
			},
			root: {
				padding: '.4rem',
				'border-bottom': '0rem'
			}
		},
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
			lineHeight: '1.35rem',
			marginBottom: '.75rem',
			fontSize: '1.3rem',
		},
		h5: {
			fontFamily: 'Nunito',
			fontWeight: 800,
			lineHeight: '1.3rem',
			marginBottom: '.5rem',
			color: '#404040',
			fontSize: '1.05rem'
		},
		h6: {
			fontFamily: 'OpenSans',
			fontWeight: 500,
			lineHeight: '1.3rem',
			marginBottom: '.45rem',
			color: '#383838',
			fontSize: '.98rem',
		},
		subtitle1: {
			fontFamily: 'OpenSans',
			fontWeight: 600,
			lineHeight: '1.15rem',
			marginBottom: '.25rem',
			color: '#2b2a2a',
			fontSize: '.88rem',
		},
		subtitle2: {
			fontFamily: 'OpenSans',
			fontWeight: 500,
			lineHeight: '1.15rem',
			marginBottom: '.25rem',
			color: '#2b2a2a',
			fontSize: '.85rem',
		},
		body1: {
			fontFamily: 'OpenSans',
			fontWeight: 500,
			lineHeight: '1.15rem',
			color: 'black',
			fontSize: '.82rem',
		},
		body2: {
			fontFamily: 'OpenSans',
			fontWeight: 500,
			lineHeight: '1rem',
			color: 'black',
			fontSize: '.75rem',
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
