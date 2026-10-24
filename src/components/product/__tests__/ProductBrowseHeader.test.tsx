import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import ProductBrowseHeader from '../ProductBrowseHeader'
import MuiTheme from '../../MuiTheme'

const product = (productId: string, productType: string, productReleaseDate: string) =>
	({ productId, productType, productReleaseDate, productName: productId, productSubType: 'Core Set', productTotal: 100, productLocale: 'en' } as YGOProduct.Info)

const products = [
	product('AAA', 'Pack', '2022-02-04'),
	product('BBB', 'Pack', '2024-05-10'),
	product('CCC', 'Deck', '2024-08-01'),
	product('DDD', 'Pack', '2024-11-15'),
	product('EEE', 'Set', '2024-12-01'),
]

const renderHeader = (onPickYear = jest.fn(), isLoading = false) =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<ProductBrowseHeader products={products} isLoading={isLoading} onPickYear={onPickYear} />
		</ThemeProvider>
	)

test('shows the product count since the first release and a total per type, largest first', () => {
	renderHeader()

	expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('5 releases since 2022')
	const totals = within(screen.getByRole('list', { name: 'Totals' })).getAllByRole('listitem')
	expect(totals.map((total) => total.textContent)).toEqual(['3Packs', '1Decks', '1Sets'])
})

test('draws a bar per year, keeping empty years in place and marking the latest', () => {
	renderHeader()

	const graph = screen.getByRole('group', { name: 'Releases per year' })
	const bars = within(graph).getAllByRole('button')
	expect(bars.map((bar) => bar.getAttribute('aria-label'))).toEqual(['2022, 1 release', '2023, 0 releases', '2024, 4 releases'])
	expect(bars[1]).toBeDisabled()
	expect(bars[2]).toHaveAttribute('aria-current', 'true')
})

test('picking a bar reports its year', () => {
	const onPickYear = jest.fn()
	renderHeader(onPickYear)

	fireEvent.click(screen.getByRole('button', { name: '2022, 1 release' }))
	expect(onPickYear).toHaveBeenCalledWith(2022)
})

test('holds the count, totals and graph with skeletons while loading', () => {
	renderHeader(jest.fn(), true)

	expect(screen.queryByRole('button')).not.toBeInTheDocument()
	expect(screen.getByRole('heading', { level: 1 })).not.toHaveTextContent('releases')
})
