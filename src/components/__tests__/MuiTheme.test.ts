import MuiTheme from '../MuiTheme'

// public/index.html only downloads these Open Sans weights, and font-synthesis is off, so any other weight renders as a neighbour
const LOADED_WEIGHTS = [400, 600, 800]
const TEXT_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'button'] as const

test('verify every text variant falls back past open sans', () => {
	TEXT_VARIANTS.forEach((variant) => {
		expect(MuiTheme.typography[variant].fontFamily).toContain('sans-serif')
	})
})

test('verify text variants use unitless line heights so they scale with font size', () => {
	TEXT_VARIANTS.forEach((variant) => {
		expect(typeof MuiTheme.typography[variant].lineHeight).toBe('number')
	})
})

test('verify body text is sized from the root rather than its parent', () => {
	expect(MuiTheme.typography.body1.fontSize).toMatch(/rem$/)
	expect(MuiTheme.typography.body2.fontSize).toMatch(/rem$/)
})

test('verify theme font weights are ones the page downloads', () => {
	const { fontWeightLight, fontWeightRegular, fontWeightMedium, fontWeightBold } = MuiTheme.typography
	;[fontWeightLight, fontWeightRegular, fontWeightMedium, fontWeightBold].forEach((weight) => {
		expect(LOADED_WEIGHTS).toContain(Number(weight))
	})
})

