import React from 'react'
import { render } from 'react-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import NavigationBar from './components/NavigationBar'
import Routes from './Routes.tsx'


const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#53539e',
			contrastDefaultColor: 'light'
		},
		secondary: {
			main: '#DC5010',
			contrastDefaultColor: 'light'
		}
	},
	overrides: {
		'MuiChip': {
			root: {
				fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
				marginRight: '.55rem',
				marginTop: '.5rem',
				backgroundColor: 'rgba(0, 0, 0, .23)',
				color: 'white'
			}
			, label: {
				fontWeight: 600,
				fontSize: '.98rem'
			}
			, clickable: {
				'&:hover': {
					backgroundColor: 'rgba(0, 0, 0, .5)'
				}
				, '&:focus': {
					backgroundColor: 'rgba(0, 0, 0, .6)'
				}
			}
		},
		'MuiBadge': {
			badge: {
				fontSize: '1.05rem'
				, paddingLeft: '.8rem'
				, paddingRight: '.8rem'
				, paddingTop: '.4rem'
				, paddingBottom: '.4rem'
			}
		}
		, 'MuiTableCell': {
			stickyHeader: {
				fontWeight: 800,
				fontSize: '1.05rem'
			},
			head: {
				fontWeight: 800,
				fontSize: '1.05rem'
			},
			body: {
				fontWeight: 600,
				fontSize: '1.05rem'
			},
			root: {
				fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
				padding: '.4rem',
				'border-bottom': '0rem'
			}
		}
	},
	typography: {
		button: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			lineHeight: '1.3rem',
			fontSize: '1.1rem',
		},
		h1: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 300,
			color: '#8778e5',
			lineHeight: '3.5rem',
			fontSize: '2.75rem',
		},
		h2: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			color: '#8778e5',
			lineHeight: '3rem',
			fontSize: '2.25rem',
		},
		h4: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 600,
			color: '#8778e5',
			lineHeight: '2rem',
			marginBottom: '1rem',
			fontSize: '2rem',
		},
		h5: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 800,
			lineHeight: '1.52rem',
			marginBottom: '.8rem',
			color: '#626262',
			fontSize: '1.4rem'
		},
		h6: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			lineHeight: '1.52rem',
			marginBottom: '.8rem',
			color: '#484848',
			fontSize: '1.3rem',
		},
		subtitle1: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 800,
			lineHeight: '1.52rem',
			marginBottom: '.25rem',
			color: '#484848',
			fontSize: '1.15rem',
		},
		subtitle2: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 600,
			lineHeight: '1.52rem',
			marginBottom: '.25rem',
			color: '#444',
			fontSize: '1.1rem',
		},
		body1: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			lineHeight: '1.35rem',
			color: '#444',
			fontSize: '1rem',
		},
		body2: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			lineHeight: '1.35rem',
			color: '#444',
			fontSize: '1rem',
		},
	}
})

render(
	<div style={{ display: 'flex', flexFlow: 'column', height: '100%' }} >
		<ThemeProvider
			theme={ theme } >
			<NavigationBar />
			<Routes />
		</ThemeProvider>
	</div>,
	document.getElementById('root')
)
