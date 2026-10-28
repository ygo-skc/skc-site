import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import ProductBrowse from '../ProductBrowse'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	ProductImage: ({ productID, size }: { productID: string; size: string }) => <img alt='' data-testid={`cover-${productID}`} data-size={size} />,
}))

const product = (productId: string, productType: string, productSubType: string, productReleaseDate: string) =>
	({ productId, productType, productSubType, productReleaseDate, productName: `${productId} name`, productTotal: 100, productLocale: 'en' } as YGOProduct.Info)

const products = [
	product('CORI', 'Pack', 'Core Set', '2026-07-03'),
	product('UP01', 'Pack', 'Tournament', '2026-07-08'),
	product('MAMO', 'Set', 'Collector', '2026-09-04'),
	product('SDWD', 'Deck', 'Structure', '2025-02-14'),
	product('LOB', 'Pack', 'Core Set', '2002-03-08'),
]

const renderPage = () =>
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<ProductBrowse />
			</MemoryRouter>
		</ThemeProvider>
	)

const answerWith = (answer: YGOProduct.Info[]) =>
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(((_: string, onFetch: (json: YGOData.ProductBrowseResult) => void) => {
		onFetch({ products: answer } as YGOData.ProductBrowseResult)
		return Promise.resolve()
	}) as unknown as typeof FetchHandler.handleFetch)

const yearHeadings = () => screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
// the products under the filters - the latest release callout links to a product too
const productLinks = () => Array.from(document.querySelectorAll('.product-browse__results a')).map((link) => link.getAttribute('href'))

beforeEach(() => {
	jest.useFakeTimers({ now: new Date(2026, 9, 23) })
})

afterEach(() => {
	jest.useRealTimers()
	jest.restoreAllMocks()
})

test('holds the product list with row skeletons while products load', () => {
	// the products request never answers, so the page stays in its loading state
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(() => new Promise(() => {}))
	renderPage()

	const skeleton = screen.getByTestId('product-browse-skeleton')
	expect(skeleton).toHaveAttribute('aria-hidden', 'true')
	expect(skeleton.querySelectorAll('.product-list-row')).toHaveLength(6)
})

// filters matching fewer than 100 products show every year, so the window needs a long list
const manyOlderPacks = Array.from({ length: 100 }, (_, i) => product(`OLD${i}`, 'Pack', 'Booster', '2010-01-01'))

test('groups the last few years newest first, with the rest behind Show earlier', () => {
	answerWith([...products, ...manyOlderPacks])
	renderPage()

	expect(yearHeadings()).toEqual(['2026', '2025'])
	const thisYear = screen.getByRole('region', { name: '2026' })
	expect(
		within(thisYear)
			.getAllByRole('link')
			.map((link) => link.getAttribute('href'))
	).toEqual(['/product/MAMO', '/product/UP01', '/product/CORI'])

	fireEvent.click(screen.getByRole('button', { name: 'Show 101 earlier' }))
	expect(yearHeadings()).toEqual(['2026', '2025', '2010', '2002'])
})

test('shows every year straight away when the filters leave fewer than 100 products', () => {
	answerWith([...products, ...manyOlderPacks])
	renderPage()

	fireEvent.click(screen.getByRole('button', { name: 'Decks 1' }))
	expect(productLinks()).toEqual(['/product/SDWD'])

	fireEvent.click(screen.getByRole('button', { name: 'All products 105' }))
	fireEvent.click(screen.getByRole('checkbox', { name: 'Core Set 2' }))
	expect(yearHeadings()).toEqual(['2026', '2002'])
	expect(screen.queryByRole('button', { name: /earlier/ })).not.toBeInTheDocument()
})

test('filters by type and sub-type, starting sub-types over when the type changes', () => {
	answerWith(products)
	renderPage()

	fireEvent.click(screen.getByRole('button', { name: 'Packs 3' }))
	expect(screen.getByRole('heading', { level: 2, name: 'Packs' })).toBeInTheDocument()
	expect(productLinks()).toEqual(['/product/UP01', '/product/CORI', '/product/LOB'])

	fireEvent.click(screen.getByRole('checkbox', { name: 'Tournament 1' }))
	expect(productLinks()).toEqual(['/product/UP01'])

	fireEvent.click(screen.getByRole('button', { name: 'All products 5' }))
	expect(screen.getByRole('checkbox', { name: 'Tournament 1' })).not.toBeChecked()
	expect(productLinks()).toHaveLength(5)
})

test('searches names and set codes across every year', () => {
	answerWith(products)
	renderPage()

	fireEvent.change(screen.getByRole('searchbox', { name: 'Search products' }), { target: { value: 'lob' } })
	expect(productLinks()).toEqual(['/product/LOB'])

	fireEvent.change(screen.getByRole('searchbox', { name: 'Search products' }), { target: { value: 'nothing like this' } })
	expect(screen.getByText('No products match these filters.')).toBeInTheDocument()
})

test('switches between the list and cards views', () => {
	answerWith(products)
	renderPage()

	expect(document.querySelectorAll('.product-list-row')).toHaveLength(5)
	fireEvent.click(screen.getByRole('button', { name: 'Cards' }))
	expect(screen.getByRole('button', { name: 'Cards' })).toHaveAttribute('aria-pressed', 'true')
	expect(document.querySelectorAll('.product-list-row')).toHaveLength(0)
	expect(document.querySelectorAll('.product-tile')).toHaveLength(5)
})

test('coming back to the page keeps the products, filters, earlier years and view without fetching again', () => {
	// enough sub-types that some sit behind Show more
	const olderPacks = Array.from({ length: 100 }, (_, i) => product(`OLD${i}`, 'Pack', `Booster ${i % 10}`, '2010-01-01'))
	const handleFetch = answerWith([...products, ...olderPacks])
	const first = renderPage()

	fireEvent.click(screen.getByRole('button', { name: 'Packs 103' }))
	fireEvent.click(screen.getByRole('button', { name: 'Show 101 earlier' }))
	fireEvent.click(screen.getByRole('button', { name: 'Show 5 more' }))
	fireEvent.click(screen.getByRole('button', { name: 'Cards' }))
	first.unmount()

	// same history entry, so everything is as it was left
	const second = renderPage()
	expect(screen.getByRole('heading', { level: 2, name: 'Packs' })).toBeInTheDocument()
	expect(yearHeadings()).toEqual(['2026', '2010', '2002'])
	expect(screen.getByRole('button', { name: 'Show fewer' })).toBeInTheDocument()
	expect(screen.getByRole('button', { name: 'Cards' })).toHaveAttribute('aria-pressed', 'true')

	fireEvent.change(screen.getByRole('searchbox', { name: 'Search products' }), { target: { value: 'lob' } })
	second.unmount()

	renderPage()
	expect(screen.getByRole('searchbox', { name: 'Search products' })).toHaveValue('lob')
	expect(productLinks()).toEqual(['/product/LOB'])
	expect(handleFetch).toHaveBeenCalledTimes(1)
})

test('list rows use the small tn covers, tiles the md ones', () => {
	answerWith(products)
	renderPage()

	const row = document.querySelector('.product-list-row') as HTMLElement
	expect(within(row).getByTestId(/^cover-/)).toHaveAttribute('data-size', 'tn')
	fireEvent.click(screen.getByRole('button', { name: 'Cards' }))
	const tile = document.querySelector('.product-tile') as HTMLElement
	expect(within(tile).getByTestId(/^cover-/)).toHaveAttribute('data-size', 'md')
})

test('a year picked on the graph that the filters leave empty clears them and jumps to it', () => {
	// jsdom has no scrollIntoView
	const scrollIntoView = jest.fn()
	Element.prototype.scrollIntoView = scrollIntoView
	answerWith([...products, ...manyOlderPacks])
	renderPage()

	// Decks match one 2025 product, so 2010 has nothing to show under them
	fireEvent.click(screen.getByRole('button', { name: 'Decks 1' }))
	fireEvent.click(screen.getByRole('button', { name: '2010, 100 releases' }))

	expect(screen.getByRole('heading', { level: 2, name: 'All products' })).toBeInTheDocument()
	expect(scrollIntoView).toHaveBeenCalledTimes(1)
	expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByRole('region', { name: '2010' }))
	delete (Element.prototype as Partial<Element>).scrollIntoView
})

test('lists sub-types as toggle chips on phones', () => {
	const matchMedia = window.matchMedia
	window.matchMedia = jest.fn().mockImplementation((query: string) => ({
		matches: query.includes('max-width'),
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
	}))
	answerWith(products)
	renderPage()

	expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
	const tournament = screen.getByRole('button', { name: 'Tournament 1' })
	fireEvent.click(tournament)
	expect(tournament).toHaveAttribute('aria-pressed', 'true')
	expect(productLinks()).toEqual(['/product/UP01'])
	window.matchMedia = matchMedia
})
