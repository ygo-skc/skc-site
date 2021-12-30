import { createTheme } from '@mui/material/styles'

const MuiTheme = createTheme({
	palette: {
		primary: {
			main: '#53539e',
			// contrastDefaultColor: 'light',
		},
		secondary: {
			main: '#ff8f44',
			// contrastDefaultColor: 'light',
		},
		error: {
			main: '#f50057',
		},
	},
	components: {
		MuiDivider: {
			styleOverrides: {
				root: {
					marginBottom: '.5rem',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
					marginRight: '.55rem',
					marginTop: '.5rem',
					backgroundColor: 'rgba(0, 0, 0, .23)',
					color: 'white',
				},
				label: {
					fontWeight: 600,
					fontSize: '.98rem',
				},
				clickable: {
					'&:hover': {
						backgroundColor: 'rgba(0, 0, 0, .5)',
					},
					'&:focus': {
						backgroundColor: 'rgba(0, 0, 0, .6)',
					},
				},
			},
		},
		MuiBadge: {
			styleOverrides: {
				badge: {
					fontSize: '1.05rem',
					paddingLeft: '.8rem',
					paddingRight: '.8rem',
					paddingTop: '.4rem',
					paddingBottom: '.4rem',
					fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					background: 'rgba(255, 255, 255, .6)',
					backdropFilter: 'blur(60px)',
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				paper: {
					padding: '.5rem',
					borderRadius: '1.5rem',
					border: '3px rgba(135, 120, 229, .7)',
					borderStyle: 'solid',
					boxShadow: 'rgba(0,0,0,0.12) 0px 1px 6px',
				},
				option: {
					paddingLeft: '0rem',
					paddingReft: '0rem',
					paddingBottom: '.4rem',
				},
			},
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
					fontWeight: 500,
					lineHeight: '1.3rem',
					fontSize: '.88rem',
					backgroundColor: 'black',
					padding: '.75rem',
				},
				arrow: {
					backgroundColor: 'black',
					color: '#ddd',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				stickyHeader: {
					fontWeight: 800,
					fontSize: '.94rem',
				},
				head: {
					fontWeight: 800,
					fontSize: '.94rem',
				},
				body: {
					fontWeight: 600,
					fontSize: '.94rem',
				},
				root: {
					fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
					padding: '.4rem',
					'border-bottom': '0rem',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				elevation1: {
					boxShadow: 'rgba(0,0,0,0.12) 0px 1px 6px',
					border: '1px solid rgb(221, 221, 221)',
				},
			},
		},
	},
	typography: {
		button: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			lineHeight: '1.3rem',
			fontSize: '1.1rem',
		},
		h1: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			color: 'black',
			lineHeight: '2.45rem',
			fontSize: '2.15rem',
		},
		h2: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			color: 'black',
			lineHeight: '2rem',
			fontSize: '1.85rem',
		},
		h3: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 800,
			color: 'black',
			lineHeight: '2rem',
			fontSize: '1.7rem',
		},
		h4: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			color: 'black',
			lineHeight: '1.8rem',
			marginBottom: '1rem',
			fontSize: '1.6rem',
		},
		h5: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 600,
			lineHeight: '1.7rem',
			marginBottom: '1rem',
			color: 'black',
			fontSize: '1.45rem',
		},
		h6: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 600,
			lineHeight: '1.5rem',
			marginBottom: '.8rem',
			color: 'black',
			fontSize: '1.35rem',
		},
		subtitle1: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			lineHeight: '1.4rem',
			marginBottom: '.8rem',
			color: 'black',
			fontSize: '1.2rem',
		},
		subtitle2: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			lineHeight: '1.4rem',
			marginBottom: '.75rem',
			color: 'black',
			fontSize: '1.1rem',
		},
		body1: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 400,
			lineHeight: '1.35rem',
			color: 'black',
			fontSize: '.98rem',
		},
		body2: {
			fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 500,
			lineHeight: '1.25rem',
			color: 'black',
			fontSize: '.9rem',
		},
	},
})

export default MuiTheme
