import { createTheme } from '@mui/material/styles'
import LinkBehavior from './LinkBehavior'

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
		MuiLink: {
			defaultProps: {
				component: LinkBehavior,  // handles external links as usual but internal links will now route through React Router and not refresh page
			},
		},
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
					color: 'var(--basalt)',
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
					fontWeight: 600,
					lineHeight: 1.4,
					color: 'var(--gate-shade)',
					fontSize: '1.3rem',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				// soft tags - pale lavender with indigo text, using the site palette from index.css
				root: {
					marginRight: '.55rem',
					marginTop: '.5rem',
					borderRadius: '6px',
					backgroundColor: 'var(--stone)',
					color: 'var(--stone-text)',
					fontSize: '1.05rem',
					fontWeight: 600,
				},
				clickable: {
					'&:hover': {
						backgroundColor: 'var(--stone-hover)',
					},
					'&:focus-visible': {
						backgroundColor: 'var(--stone-hover)',
						outline: '2px solid var(--stone-text)',
						outlineOffset: '2px',
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
				},
				root: {
					minHeight: '0rem',
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					backgroundColor: '#fff',
					color: 'var(--basalt)',
					borderRadius: '12px',
					border: '1px solid var(--stone)',
					boxShadow: '0 8px 28px color-mix(in srgb, var(--basalt) 22%, transparent)',
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
					paddingRight: '0rem',
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
					fontWeight: 400,
					lineHeight: 1.45,
					fontSize: '1.05rem',
					padding: '.75rem',
					backgroundColor: 'var(--basalt)',
					borderRadius: '1rem',
				},
				arrow: {
					color: 'var(--basalt)',
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
					fontSize: '1.1rem',
				},
				body: {
					fontWeight: 400,
					fontSize: '1.05rem',
				},
				root: {
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
		fontFamily: 'open sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
		// index.html only downloads 400, 600 and 800 and font-synthesis is off, so other weights would render as a neighbour
		fontWeightLight: 400,
		fontWeightRegular: 400,
		fontWeightMedium: 600,
		fontWeightBold: 800,
		// line heights are unitless so they keep their ratio when css resizes the text - roomy for reading text, tighter as headings grow
		button: {
			lineHeight: 1.13,
			fontSize: '1.15rem',
			textTransform: 'none',
		},
		// sizes step up by roughly 1.15-1.2x per level from ~15px body text, so each heading level reads as distinct
		// margins are in em so the space under a heading grows with the heading
		h1: {
			fontWeight: 800,
			color: 'var(--basalt)',
			lineHeight: 1.15,
			fontSize: '2.8rem',
		},
		h2: {
			fontWeight: 800,
			color: 'var(--basalt)',
			lineHeight: 1.2,
			marginBottom: '0.5em',
			fontSize: '2.4rem',
		},
		h3: {
			fontWeight: 800,
			color: 'var(--basalt)',
			lineHeight: 1.25,
			marginBottom: '0.55em',
			fontSize: '2rem',
		},
		h4: {
			fontWeight: 600,
			color: 'var(--rock)',
			lineHeight: 1.3,
			marginBottom: '0.5em',
			fontSize: '1.75rem',
		},
		h5: {
			fontWeight: 600,
			lineHeight: 1.3,
			marginBottom: '0.5em',
			color: 'var(--gate-shade)',
			fontSize: '1.5rem',
		},
		h6: {
			fontWeight: 600,
			lineHeight: 1.35,
			marginBottom: '0.5em',
			color: 'var(--gate-shade)',
			fontSize: '1.3rem',
		},
		subtitle1: {
			fontWeight: 600,
			lineHeight: 1.4,
			marginBottom: '0.6em',
			color: 'var(--basalt)',
			fontSize: '1.25rem',
		},
		subtitle2: {
			fontWeight: 600,
			lineHeight: 1.4,
			marginBottom: '0.65em',
			color: 'var(--basalt)',
			fontSize: '1.1rem',
		},
		body1: {
			fontWeight: 400,
			color: 'var(--basalt)',
			lineHeight: 1.55,
			fontSize: '1.15rem',
		},
		body2: {
			fontWeight: 400,
			color: 'var(--basalt)',
			lineHeight: 1.5,
			fontSize: '1.05rem',
		},
	},
})

export default MuiTheme
