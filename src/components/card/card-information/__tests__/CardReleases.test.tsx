import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import CardReleases from '../CardReleases'
import MuiTheme from '../../../MuiTheme'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({ ProductImage: () => null }))

const product = (productId: string, productName: string, productReleaseDate: string, productPosition: string, rarities: string[]) =>
	({
		productId,
		productName,
		productLocale: 'en',
		productType: 'Pack',
		productSubType: 'Booster',
		productReleaseDate,
		productContent: [{ productPosition, rarities }],
	} as unknown as YGOProduct.Info)

const uria = [
	product('MZMU', 'Maze of Muertos', '2026-02-20', '000', ['Starlight Rare']),
	product('MZMU', 'Maze of Muertos', '2026-02-20', '074', ['Rare']),
	product('SOI', 'Shadow of Infinity', '2006-02-18', '001', ['Ultra Rare']),
]

const renderReleases = (productInfo: YGOProduct.Info[], isFetchingCardData = false) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<CardReleases productInfo={productInfo} isFetchingCardData={isFetchingCardData} />
			</MemoryRouter>
		</ThemeProvider>
	)

beforeAll(() => {
	Element.prototype.scrollIntoView = jest.fn()
})

test('holds three skeleton rows while the card loads', () => {
	renderReleases([], true)
	expect(screen.getByTestId('card-releases-skeleton')).toHaveAttribute('aria-hidden', 'true')
	expect(screen.queryByText('Not in any product yet')).not.toBeInTheDocument()
})

test('says when the card is in no product', () => {
	renderReleases([])
	expect(screen.getByText('Not in any product yet')).toBeInTheDocument()
	expect(screen.queryByRole('group', { name: 'Releases by date' })).not.toBeInTheDocument()
})

test('lists one row per product, newest first, linking to the product', () => {
	renderReleases(uria)

	expect(screen.getByText(/3 printings in 2 products/)).toBeInTheDocument()
	const rows = within(screen.getByRole('list')).getAllByRole('link')
	expect(rows.map((row) => row.getAttribute('href'))).toEqual(['/product/MZMU', '/product/SOI'])
	expect(rows[0]).toHaveTextContent('MZMU-EN000, MZMU-EN074 · Pack · Booster')
	expect(rows[0]).toHaveTextContent('Starlight RareRare')
	expect(rows[0]).toHaveTextContent('Feb 20, 2026')
})

test('puts a dot on the rail per product, the newest picked, and picking another marks it', () => {
	renderReleases(uria)

	const newest = screen.getByRole('button', { name: 'Maze of Muertos, Feb 20, 2026' })
	const oldest = screen.getByRole('button', { name: 'Shadow of Infinity, Feb 18, 2006' })
	expect(newest).toHaveAttribute('aria-pressed', 'true')
	expect(oldest).toHaveAttribute('aria-pressed', 'false')

	fireEvent.click(oldest)

	expect(oldest).toHaveAttribute('aria-pressed', 'true')
	expect(newest).toHaveAttribute('aria-pressed', 'false')
})

test('shows eight rows, then all of them - and picking a hidden one shows them all', () => {
	const many = Array.from({ length: 10 }, (_, index) => product(`P${index}`, `Product ${index}`, `20${10 + index}-01-01`, '001', ['Common']))
	renderReleases(many)

	expect(within(screen.getByRole('list')).getAllByRole('link')).toHaveLength(8)

	// the two oldest are hidden - picking one of them brings every row back
	fireEvent.click(screen.getByRole('button', { name: 'Product 0, Jan 1, 2010' }))

	expect(within(screen.getByRole('list')).getAllByRole('link')).toHaveLength(10)
	expect(screen.queryByRole('button', { name: /Show all/ })).not.toBeInTheDocument()
})

test('the rail is one tab stop, and the arrows and Home / End move the pick along it', () => {
	const three = [...uria, product('SDSA', 'Sacred Beasts', '2020-07-10', '042', ['Ultra Rare'])]
	renderReleases(three)
	const dot = (name: RegExp) => screen.getByRole('button', { name })

	expect(dot(/Maze of Muertos/)).toHaveAttribute('tabindex', '0')
	expect(dot(/Sacred Beasts/)).toHaveAttribute('tabindex', '-1')
	expect(dot(/Shadow of Infinity/)).toHaveAttribute('tabindex', '-1')

	// left is older
	fireEvent.keyDown(dot(/Maze of Muertos/), { key: 'ArrowLeft' })
	expect(dot(/Sacred Beasts/)).toHaveAttribute('aria-pressed', 'true')
	expect(dot(/Sacred Beasts/)).toHaveAttribute('tabindex', '0')
	expect(dot(/Sacred Beasts/)).toHaveFocus()

	fireEvent.keyDown(dot(/Sacred Beasts/), { key: 'Home' })
	expect(dot(/Shadow of Infinity/)).toHaveAttribute('aria-pressed', 'true')

	// past the oldest stays on it
	fireEvent.keyDown(dot(/Shadow of Infinity/), { key: 'ArrowLeft' })
	expect(dot(/Shadow of Infinity/)).toHaveAttribute('aria-pressed', 'true')

	fireEvent.keyDown(dot(/Shadow of Infinity/), { key: 'End' })
	expect(dot(/Maze of Muertos/)).toHaveAttribute('aria-pressed', 'true')
	expect(dot(/Maze of Muertos/)).toHaveFocus()
})
