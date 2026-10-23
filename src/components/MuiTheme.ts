import { createTheme } from '@mui/material/styles'
import LinkBehavior from './LinkBehavior'

const MuiTheme = createTheme({
	palette: {
		primary: {
			main: '#8944ab', // apple's increased-contrast system purple (= --accent-text) - mui fills buttons with it under white text, which #af52de holds only ~4.1:1
			// contrastDefaultColor: 'light',
		},
		secondary: {
			main: '#ff9500', // apple system orange, the same as --secondary in index.css
			// contrastDefaultColor: 'light',
		},
		error: {
			main: '#ff3b30', // apple system red
		},
	},
	components: {
		// spacing below is in px (the sizes it was designed at) - only text is in rem, so it follows the reader's text-size setting
		MuiLink: {
			defaultProps: {
				component: LinkBehavior,  // handles external links as usual but internal links will now route through React Router and not refresh page
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					background: 'var(--capsule-track)',
					color: 'var(--capsule-text)',
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					marginBottom: '6px',
				},
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					fontWeight: 600,
					lineHeight: 1.4,
					color: 'var(--capsule-muted)',
					fontSize: '1.0625rem', // 17px
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				// apple-style tags - grey capsules with near-black text, using the neutrals from index.css
				root: {
					marginRight: '7px',
					marginTop: '6px',
					borderRadius: '999px',
					backgroundColor: 'var(--capsule-track)',
					color: 'var(--capsule-text)',
					fontSize: '0.9375rem', // 15px, body2
					fontWeight: 600,
				},
				clickable: {
					'&:hover': {
						backgroundColor: 'var(--capsule-hover)',
					},
					'&:focus-visible': {
						backgroundColor: 'var(--capsule-hover)',
						outline: '2px solid var(--accent)',
						outlineOffset: '2px',
					},
				},
			},
		},
		MuiBadge: {
			styleOverrides: {
				badge: {
					fontSize: '0.75rem', // 12px
					marginTop: '5px',
					marginRight: '6px',
				},
				root: {
					minHeight: '0',
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					backgroundColor: '#fff',
					color: 'var(--capsule-text)',
					borderRadius: '12px',
					border: '1px solid var(--capsule-edge)',
					boxShadow: '0 8px 28px color-mix(in srgb, var(--capsule-text) 18%, transparent)',
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				paper: {
					padding: '6px',
					borderRadius: '20px',
					border: '1px solid var(--capsule-edge)',
					boxShadow: '0 8px 28px color-mix(in srgb, var(--capsule-text) 18%, transparent)', // same lift as the popovers
				},
				option: {
					paddingLeft: '0',
					paddingRight: '0',
					paddingBottom: '5px',
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
					fontSize: '0.875rem', // 14px
					padding: '10px',
					backgroundColor: 'var(--capsule-text)',
					borderRadius: '13px',
				},
				arrow: {
					color: 'var(--capsule-text)',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				stickyHeader: {
					fontWeight: 800,
					fontSize: '0.9375rem', // 15px
				},
				head: {
					fontWeight: 800,
					fontSize: '0.9375rem', // 15px
				},
				body: {
					fontWeight: 400,
					fontSize: '0.9375rem', // 15px
				},
				root: {
					padding: '5px',
					borderBottom: '0',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				elevation1: {
					boxShadow: 'none',
					border: '1px solid var(--capsule-edge)',
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
			fontSize: '0.9375rem', // 15px
			textTransform: 'none',
		},
		// apple's web type scale, in rem off the browser's 16px root (index.css sets 100%, so text follows the reader's text-size setting):
		// 17px body, 15px secondary text, 12px captions, headings stepping 19 -> 40px. like apple.com, only headings shrink on phones.
		// margins are in em so the space under a heading grows with the heading
		h1: {
			fontWeight: 800,
			color: 'var(--capsule-text)',
			lineHeight: 1.15,
			fontSize: '2.5rem', // 40px, 32px on phones
			'@media (max-width: 599.95px)': {
				fontSize: '2rem',
			},
		},
		h2: {
			fontWeight: 800,
			color: 'var(--capsule-text)',
			lineHeight: 1.2,
			marginBottom: '0.5em',
			fontSize: '2rem', // 32px, 28px on phones
			'@media (max-width: 599.95px)': {
				fontSize: '1.75rem',
			},
		},
		h3: {
			fontWeight: 800,
			color: 'var(--capsule-text)',
			lineHeight: 1.25,
			marginBottom: '0.55em',
			fontSize: '1.75rem', // 28px, 24px on phones
			'@media (max-width: 599.95px)': {
				fontSize: '1.5rem',
			},
		},
		h4: {
			fontWeight: 600,
			color: 'var(--capsule-text)',
			lineHeight: 1.3,
			marginBottom: '0.5em',
			fontSize: '1.5rem', // 24px, 21px on phones
			'@media (max-width: 599.95px)': {
				fontSize: '1.3125rem',
			},
		},
		h5: {
			fontWeight: 600,
			lineHeight: 1.3,
			marginBottom: '0.5em',
			color: 'var(--capsule-muted)',
			fontSize: '1.3125rem', // 21px, 19px on phones
			'@media (max-width: 599.95px)': {
				fontSize: '1.1875rem',
			},
		},
		h6: {
			fontWeight: 600,
			lineHeight: 1.35,
			marginBottom: '0.5em',
			color: 'var(--capsule-muted)',
			fontSize: '1.1875rem', // 19px
		},
		subtitle1: {
			fontWeight: 600,
			lineHeight: 1.4,
			marginBottom: '0.6em',
			color: 'var(--capsule-text)',
			fontSize: '1.0625rem', // 17px
		},
		subtitle2: {
			fontWeight: 600,
			lineHeight: 1.4,
			marginBottom: '0.65em',
			color: 'var(--capsule-text)',
			fontSize: '0.9375rem', // 15px
		},
		body1: {
			fontWeight: 400,
			color: 'var(--capsule-text)',
			lineHeight: 1.55,
			fontSize: '1.0625rem', // 17px
		},
		body2: {
			fontWeight: 400,
			color: 'var(--capsule-text)',
			lineHeight: 1.5,
			fontSize: '0.9375rem', // 15px
		},
		// small labels, counts and dates - apple's 12px floor for text
		caption: {
			fontWeight: 400,
			color: 'var(--capsule-muted)',
			lineHeight: 1.4,
			fontSize: '0.75rem', // 12px
		},
		overline: {
			fontWeight: 600,
			color: 'var(--capsule-muted)',
			lineHeight: 1.4,
			letterSpacing: '0.06em',
			textTransform: 'uppercase',
			fontSize: '0.75rem', // 12px
		},
	},
})

export default MuiTheme
