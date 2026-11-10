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

const links = () => screen.getAllByRole('listitem').map((item) => within(item).getByRole('link'))

test('holds skeleton rows while the card loads', () => {
	renderReleases([], true)
	expect(screen.getByTestId('card-releases-skeleton')).toHaveAttribute('aria-hidden', 'true')
	expect(screen.queryByText('Not in any product yet')).not.toBeInTheDocument()
})

test('says when the card is in no product', () => {
	renderReleases([])
	expect(screen.getByText('Not in any product yet')).toBeInTheDocument()
	expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
})

test('lists one row per product, newest first, under its year, linking to the product', () => {
	renderReleases(uria)

	expect(screen.getByText(/3 printings in 2 products/)).toBeInTheDocument()
	expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual(['2026', '2006'])
	expect(links().map((row) => row.getAttribute('href'))).toEqual(['/product/MZMU', '/product/SOI'])
	expect(links()[0]).toHaveTextContent('MZMU-EN000, MZMU-EN074 · Feb 20 · Pack · Booster')
	expect(links()[0]).toHaveTextContent('Starlight RareRare')
	expect(within(links()[0]).getByText('Feb 20')).toHaveAttribute('datetime', '2026-02-20')
})

test('marks a wait of three years or more between printings', () => {
	renderReleases([...uria, product('SDSA', 'Sacred Beasts', '2024-07-10', '042', ['Ultra Rare'])])

	// 2024 to 2026 is too short to mark - 2006 to 2024 isn't
	const gaps = screen.getAllByText((_, element) => element?.tagName === 'P' && /without a printing$/.test(element.textContent ?? ''))
	expect(gaps.map((gap) => gap.textContent)).toEqual(['18 years without a printing'])
})

test('shows eight rows, then all of them', () => {
	const many = Array.from({ length: 10 }, (_, index) => product(`P${index}`, `Product ${index}`, `20${10 + index}-01-01`, '001', ['Common']))
	renderReleases(many)

	expect(links()).toHaveLength(8)

	fireEvent.click(screen.getByRole('button', { name: 'Show all 10' }))

	expect(links()).toHaveLength(10)
	expect(screen.queryByRole('button', { name: /Show all/ })).not.toBeInTheDocument()
})
