import { getContrastRatio } from '@mui/material/styles'
import MuiTheme from '../MuiTheme'

// public/index.html only downloads these Open Sans weights, and font-synthesis is off, so any other weight renders as a neighbour
const LOADED_WEIGHTS = [400, 600, 800]
const TEXT_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'overline', 'button'] as const

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

const remOf = (size: string | number | undefined) => parseFloat(String(size))

test('verify each heading level is larger than the one below it, down to body text', () => {
	const { h1, h2, h3, h4, h5, h6, body1, body2 } = MuiTheme.typography
	const scale = [h1, h2, h3, h4, h5, h6, body1, body2].map(({ fontSize }) => remOf(fontSize))

	scale.slice(1).forEach((size, index) => expect(size).toBeLessThan(scale[index]))
})

// index.css leaves the root at the browser's 16px (100%) so text follows the reader's text-size setting
const ROOT_PX = 16

test("verify body text renders at apple's 17px for comfortable reading", () => {
	expect(remOf(MuiTheme.typography.body1.fontSize) * ROOT_PX).toBe(17)
})

test('verify heading margins scale with the heading size', () => {
	;(['h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2'] as const).forEach((variant) => {
		expect(String(MuiTheme.typography[variant].marginBottom)).toMatch(/em$/)
		expect(String(MuiTheme.typography[variant].marginBottom)).not.toMatch(/rem$/)
	})
})

test("verify small text stays at apple's 12px floor or more and below body text", () => {
	const { body2, caption, overline } = MuiTheme.typography
	;[caption, overline].forEach(({ fontSize }) => {
		expect(String(fontSize)).toMatch(/rem$/)
		expect(remOf(fontSize) * ROOT_PX).toBeGreaterThanOrEqual(12)
		expect(remOf(fontSize)).toBeLessThan(remOf(body2.fontSize))
	})
})

test('verify body text has room between lines for comfortable reading', () => {
	expect(MuiTheme.typography.body1.lineHeight).toBeGreaterThanOrEqual(1.5)
	expect(MuiTheme.typography.body2.lineHeight).toBeGreaterThanOrEqual(1.5)
})

test('verify larger headings set tighter lines than smaller ones', () => {
	const { h1, h2, h3, h4, h5, h6 } = MuiTheme.typography
	const lineHeights = [h1, h2, h3, h4, h5, h6].map(({ lineHeight }) => Number(lineHeight))

	lineHeights.forEach((lineHeight) => expect(lineHeight).toBeLessThan(1.4))
	lineHeights.slice(1).forEach((lineHeight, index) => expect(lineHeight).toBeGreaterThanOrEqual(lineHeights[index]))
})

// collects every text property set in the component style overrides, however deeply nested
const overrideValues = (property: string) => {
	const found: unknown[] = []
	const walk = (node: unknown) => {
		if (node === null || typeof node !== 'object') return
		Object.entries(node).forEach(([key, value]) => {
			if (key === property) found.push(value)
			else walk(value)
		})
	}
	Object.values(MuiTheme.components ?? {}).forEach((component) => walk(component?.styleOverrides))
	return found
}

test('verify component overrides inherit the theme font rather than redeclaring it', () => {
	expect(overrideValues('fontFamily')).toEqual([])
})

test('verify component overrides use unitless line heights so they scale with font size', () => {
	overrideValues('lineHeight').forEach((lineHeight) => expect(typeof lineHeight).toBe('number'))
})

test('verify component text is sized from the root rather than its parent', () => {
	overrideValues('fontSize').forEach((fontSize) => expect(String(fontSize)).toMatch(/rem$/))
})

test('verify chip text is sized on the chip so local css on the chip can resize it', () => {
	const chip = MuiTheme.components?.MuiChip?.styleOverrides as Record<string, Record<string, unknown>>
	expect(chip.root.fontSize).toBe(MuiTheme.typography.body2.fontSize)
	expect(chip.label?.fontSize).toBeUndefined()
})

const usesPalette = (colour: unknown) => expect(String(colour)).toMatch(/^var\(--[a-z-]+\)$/)

test('verify text colours come from the site palette in index.css', () => {
	TEXT_VARIANTS.filter((variant) => variant !== 'button').forEach((variant) => usesPalette(MuiTheme.typography[variant].color))
	overrideValues('color').forEach(usesPalette)
})

test('verify tooltips are filled with a site palette colour', () => {
	const tooltip = MuiTheme.components?.MuiTooltip?.styleOverrides as Record<string, Record<string, unknown>>
	usesPalette(tooltip.tooltip.backgroundColor)
})

test('verify table body text is regular weight so headers stand out', () => {
	const tableCell = MuiTheme.components?.MuiTableCell?.styleOverrides as Record<string, Record<string, unknown>>
	expect(tableCell.body.fontWeight).toBe(MuiTheme.typography.fontWeightRegular)
})

test('verify autocomplete overrides only use real css properties', () => {
	const autocomplete = MuiTheme.components?.MuiAutocomplete?.styleOverrides as Record<string, Record<string, unknown>>
	expect(Object.keys(autocomplete.option)).not.toContain('paddingReft')
})

test('verify white text on primary fills (contained buttons, tabs) meets 4.5:1', () => {
	expect(MuiTheme.palette.primary.contrastText).toBe('#fff')
	expect(getContrastRatio(MuiTheme.palette.primary.main, '#fff')).toBeGreaterThanOrEqual(4.5)
})

test('verify popovers are solid so menu text stays readable over any page content', () => {
	const popover = MuiTheme.components?.MuiPopover?.styleOverrides as Record<string, Record<string, unknown>>
	expect(popover.paper.backgroundColor).toBe('#fff')
	expect(popover.paper.backdropFilter).toBeUndefined()
})
