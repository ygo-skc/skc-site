import React from 'react'
import { render } from 'react-dom'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import Footer from './components/header-footer/Footer'
import NavigationBar from './components/header-footer/NavigationBar'
import Routes from './Routes.tsx'


const theme = createTheme({
	palette: {
		primary: {
			main: '#53539e',
			contrastDefaultColor: 'light'
		},
		secondary: {
			main: '#ff8f44',
			contrastDefaultColor: 'light'
		},
		error: {
			main: '#f50057',
		}
	},
	overrides: {
		'MuiDivider': {
			root: {
				marginBottom: '.5rem',
			}
		},
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
				, fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			}
		},
		'MuiPopover': {
			paper: {
				background: 'rgba(255, 255, 255, .6)'
				, backdropFilter: 'blur(60px)'
			}
		},
		'MuiAutocomplete': {
			paper: {
				padding: '.5rem',
				borderRadius: '1.5rem',
				border: '3px solid rgba(135, 120, 229, .7)',
				boxShadow: 'rgba(0,0,0,0.12) 0px 1px 6px'
			},
			option: {
				paddingLeft: '0rem',
				paddingReft: '0rem'
			}
		},
		'MuiTooltip': {
			tooltip: {
				fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
				fontWeight: 500,
				lineHeight: '1.3rem',
				fontSize: '.88rem',
				backgroundColor: 'black',
				padding: '.75rem'
			},
			arrow: {
				backgroundColor: 'black',
				color: '#ddd'
			}
		}
		, 'MuiTableCell': {
			stickyHeader: {
				fontWeight: 800,
				fontSize: '.94rem'
			},
			head: {
				fontWeight: 800,
				fontSize: '.94rem'
			},
			body: {
				fontWeight: 600,
				fontSize: '.94rem'
			},
			root: {
				fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
				padding: '.4rem',
				'border-bottom': '0rem'
			}
		},
		'MuiPaper': {
			'elevation1': {
				boxShadow: 'rgba(0,0,0,0.12) 0px 1px 6px'
				, border: '1px solid rgb(221, 221, 221)'
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
			color: '#626262',
			lineHeight: '2.45rem',
			fontSize: '2.15rem',
		},
		h2: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			color: '#626262',
			lineHeight: '2rem',
			fontSize: '1.85rem',
		},
		h3: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 700,
			color: '#626262',
			lineHeight: '2rem',
			fontSize: '1.65rem',
		},
		h4: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 400,
			color: '#626262',
			lineHeight: '1.75rem',
			marginBottom: '1rem',
			fontSize: '1.5rem',
		},
		h5: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 800,
			lineHeight: '1.45rem',
			marginBottom: '1rem',
			color: '#626262',
			fontSize: '1.3rem'
		},
		h6: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			lineHeight: '1.35rem',
			marginBottom: '.8rem',
			color: '#484848',
			fontSize: '1.2rem',
		},
		subtitle1: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 800,
			lineHeight: '1.35rem',
			marginBottom: '.25rem',
			color: '#484848',
			fontSize: '1.1rem',
		},
		subtitle2: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 600,
			lineHeight: '1.3rem',
			marginBottom: '.25rem',
			color: '#444',
			fontSize: '1.05rem',
		},
		body1: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			lineHeight: '1.2rem',
			color: '#444',
			fontSize: '.94rem',
		},
		body2: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			lineHeight: '1.2rem',
			color: '#444',
			fontSize: '.9rem',
		},
	}
})

render(
	<ThemeProvider
		theme={ theme } >
		<div className='content' >
			<NavigationBar />
			<div className='routes' >
				<div className='routes-wrapper' >
					<Routes />
				</div>
			</div>
		</div>
		<Footer />
	</ThemeProvider>
	,
	document.getElementById('root')
)