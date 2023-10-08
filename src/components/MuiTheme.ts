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
		MuiButtonGroup: {
			styleOverrides: {
				grouped: {
					'&:not(:last-of-type)': {
						borderRight: '3px solid rgba(255, 255, 255, .8)',
						borderColor: 'white',
					},
					borderRadius: '5rem',
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					background: '#eee',
					color: 'black',
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					marginBottom: '.5rem',
				},
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
					fontWeight: 600,
					lineHeight: '1.8rem',
					color: '#555',
					fontSize: '1.45rem',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
					marginRight: '.55rem',
					marginTop: '.5rem',
					backgroundColor: 'rgba(0, 0, 0, .23)',
					color: 'white',
				},
				label: {
					fontWeight: 600,
					fontSize: '1rem',
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
					fontSize: '1.0rem',
					marginTop: '.4rem',
					marginRight: '.5rem',
					fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
				},
				root: {
					minHeight: '0rem',
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					backgroundColor: 'rgba(255, 255, 255, .05)',
					backdropFilter: 'blur(20px)',
					borderRadius: '2rem',
					boxShadow: '0 0 10px rgba(0, 0, 0, .25)',
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
				listbox: {
					overflowX: 'hidden',
				},
			},
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
					fontWeight: 400,
					lineHeight: '1.3rem',
					fontSize: '1em',
					padding: '.75rem',
					backgroundColor: '#4d4a59',
					borderRadius: '1rem',
				},
				arrow: {
					color: '#4d4a59',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				stickyHeader: {
					fontWeight: 800,
					fontSize: '1.1rem',
				},
				head: {
					fontWeight: 800,
					fontSize: '1.1em',
				},
				body: {
					fontWeight: 600,
					fontSize: '1.05rem',
				},
				root: {
					fontFamily: 'open sans',
					padding: '.4rem',
					borderBottom: '0rem',
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
			fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			lineHeight: '1.3rem',
			fontSize: '1.15rem',
			textTransform: 'none',
		},
		h1: {
			fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 800,
			color: 'black',
			lineHeight: '2.8rem',
			fontSize: '2rem',
		},
		h2: {
			fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 800,
			color: 'black',
			lineHeight: '2.4rem',
			fontSize: '1.85rem',
		},
		h3: {
			fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 800,
			color: 'black',
			lineHeight: '2.3rem',
			fontSize: '1.7rem',
		},
		h4: {
			fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 600,
			color: '#444',
			lineHeight: '2rem',
			marginBottom: '1rem',
			fontSize: '1.55rem',
		},
		h5: {
			fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 600,
			lineHeight: '1.8rem',
			marginBottom: '1rem',
			color: '#555',
			fontSize: '1.4rem',
		},
		h6: {
			fontFamily: 'open sans',
			fontWeight: 600,
			lineHeight: '1.7rem',
			marginBottom: '.8rem',
			color: '#555',
			fontSize: '1.25rem',
		},
		subtitle1: {
			fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 600,
			lineHeight: '1.4rem',
			marginBottom: '.8rem',
			color: 'black',
			fontSize: '1.2rem',
		},
		subtitle2: {
			fontFamily: 'open sans',
			fontWeight: 600,
			lineHeight: '1.4rem',
			marginBottom: '.75rem',
			color: 'black',
			fontSize: '1.15rem',
		},
		body1: {
			fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 400,
			lineHeight: '1.35rem',
			color: 'black',
			fontSize: '1.05em',
		},
		body2: {
			fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
			fontWeight: 400,
			lineHeight: '1.25rem',
			color: 'black',
			fontSize: '.98rem',
		},
	},
})

export default MuiTheme
