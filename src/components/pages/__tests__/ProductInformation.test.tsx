import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, RouterProvider, Routes, createMemoryRouter } from 'react-router-dom'

import ProductInformation from '../ProductInformation'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'
import { readRecentlyViewed } from '../../../helper/RecentlyViewed'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	ProductImage: () => null,
	CardImageRounded: () => null,
	YGOCardColorIndicator: () => null,
	YGOCardWithImage: ({ card }: { card: YGOCard.Deets }) => <span data-testid='grid-card'>{card.cardName}</span>,
	YGOCardPreview: ({ card }: { card: YGOCard.Deets }) => <div data-testid='preview'>{card.cardName}</div>,
}))

const content: YGOProduct.Content[] = [
	{
		productPosition: '001',
		rarities: ['Super Rare'],
		card: { cardID: '1', cardName: 'Spirit of Yubel', cardColor: 'effect', cardAttribute: 'Dark', cardEffect: 'Fiend effect', monsterType: 'Fiend/Effect' },
	},
	{
		productPosition: '002',
		rarities: ['Secret Rare'],
		card: {
			cardID: '2',
			cardName: 'Yubel - The Loving Defender Forever',
			cardColor: 'fusion',
			cardAttribute: 'Dark',
			cardEffect: 'Fusion effect',
			monsterType: 'Fiend/Fusion/Effect',
		},
	},
	{ productPosition: '060', rarities: ['Common'], card: { cardID: '3', cardName: 'Nightmare Pain', cardColor: 'spell', cardAttribute: 'Spell', cardEffect: 'Add 1' } },
]

const product = {
	productId: 'PHNI',
	productLocale: 'EN',
	productName: 'Phantom Nightmare',
	productType: 'Pack',
	productSubType: 'Core Set',
	productReleaseDate: '2024-02-09',
	productTotal: 3,
	productRarityStats: { Common: 1, 'Super Rare': 1, 'Secret Rare': 1 },
	productContent: content,
}

const coreSet = (productId: string, productName: string, productReleaseDate: string) => ({ ...product, productId, productName, productReleaseDate, productContent: [] })

const yubel = { cardID: '78371393', cardName: 'Yubel', cardColor: 'effect', cardEffect: '' }

// more than a column shows, so the rest open in a popup
const references = Array.from({ length: 10 }, (_, index) => ({
	occurrences: 1,
	card: { cardID: `ref${index}`, cardName: `Referenced card ${index + 1}`, cardColor: 'spell', cardEffect: '' },
}))

const suggestions = {
	suggestions: { namedMaterials: [{ occurrences: 2, card: yubel }], namedReferences: references, materialArchetypes: ['Yubel'], referencedArchetypes: ['Mimighoul'] },
	support: { referencedBy: [], materialFor: [] },
}

function renderPage() {
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={['/product/PHNI']}>
				<Routes>
					<Route path='/product/:productId' element={<ProductInformation />} />
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	)
}

beforeEach(() => {
	localStorage.clear()
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation((url, onSuccess) => {
		if (url.includes('suggestions')) onSuccess(suggestions)
		else if (url.endsWith('/products/en'))
			onSuccess({ locale: 'en', products: [coreSet('LEDE', 'Legacy of Destruction', '2024-04-26'), product, coreSet('AGOV', 'Age of Overlord', '2023-10-27')] })
		else onSuccess(product)
		return Promise.resolve()
	})
})

afterEach(() => jest.restoreAllMocks())

test('going back shows the page as it was left - same view and neighbours, nothing fetched again', async () => {
	const router = createMemoryRouter(
		[
			{ path: '/product/:productId', element: <ProductInformation /> },
			{ path: '/card/:cardId', element: <p>Card</p> },
		],
		{ initialEntries: ['/product/PHNI'] }
	)
	render(
		<ThemeProvider theme={MuiTheme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	)
	await screen.findByRole('link', { name: 'Next: Legacy of Destruction' })
	fireEvent.click(screen.getByRole('button', { name: 'Grid' }))

	await act(() => router.navigate('/card/1'))
	const fetches = jest.mocked(FetchHandler.handleFetch).mock.calls.length
	await act(() => router.navigate(-1))

	expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true')
	expect(screen.getByRole('link', { name: 'Next: Legacy of Destruction' })).toBeInTheDocument()
	expect(FetchHandler.handleFetch).toHaveBeenCalledTimes(fetches)
})

test('remembers the product as recently viewed once it loads', async () => {
	renderPage()

	await waitFor(() =>
		expect(readRecentlyViewed()).toEqual([expect.objectContaining({ kind: 'product', id: 'PHNI', name: 'Phantom Nightmare', productType: 'Pack', productSubType: 'Core Set' })])
	)
})

test('holds the loaded layout with placeholders while the product and suggestions load', () => {
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(() => new Promise(() => {}))
	renderPage()

	expect(screen.getByTestId('product-info-header-skeleton')).toBeInTheDocument()
	// a placeholder per filter pill, each hiding the pill it stands in for
	const pills = screen.getByTestId('product-contents-pills-skeleton')
	expect(pills.querySelectorAll('.MuiSkeleton-root')).toHaveLength(6)
	expect(pills).toHaveAttribute('aria-hidden', 'true')
	// full suggestion columns: a head and 8 rows each
	const columns = screen.getByTestId('product-suggestions-skeleton').querySelectorAll('.ban-list-changes__column')
	expect(columns).toHaveLength(4)
	columns.forEach((column) => expect(column.querySelectorAll('.ban-list-changes__row')).toHaveLength(8))
})

test('heads the page with the totals and the core sets either side', async () => {
	renderPage()

	expect(await screen.findByRole('heading', { level: 1, name: 'Phantom Nightmare' })).toBeInTheDocument()
	const totals = screen.getByRole('list', { name: 'Totals' })
	expect(
		within(totals)
			.getAllByRole('listitem')
			.map((total) => total.textContent)
	).toEqual(['3cards', '2monsters', '1spells', '0traps', '2archetypes'])

	expect(screen.getByRole('link', { name: 'Previous: Age of Overlord' })).toHaveAttribute('href', '/product/AGOV')
	expect(screen.getByRole('link', { name: 'Next: Legacy of Destruction' })).toHaveAttribute('href', '/product/LEDE')
	expect(screen.getByText('Mimighoul')).toBeInTheDocument()
})

test('lists the set in pack order with set numbers and narrows it by search and rarity', async () => {
	renderPage()

	const cards = await screen.findByRole('list', { name: 'Cards' })
	expect(
		within(cards)
			.getAllByRole('button')
			.map((row) => row.querySelector('.card-browse-row__name')?.textContent)
	).toEqual(['Spirit of Yubel', 'Yubel - The Loving Defender Forever', 'Nightmare Pain'])
	expect(within(cards).getByText('PHNI-EN001 · Super Rare · Fiend/Effect')).toBeInTheDocument()

	fireEvent.change(screen.getByRole('searchbox', { name: 'Search this set' }), { target: { value: 'en060' } })
	expect(within(screen.getByRole('list', { name: 'Cards' })).getAllByRole('button')).toHaveLength(1)
	expect(screen.getByText('1 of 3 cards')).toBeInTheDocument()

	fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
	fireEvent.click(screen.getByRole('button', { name: 'Rarity' }))
	fireEvent.click(within(screen.getByRole('dialog', { name: 'Rarity' })).getByRole('button', { name: 'Secret Rare' }))
	fireEvent.click(screen.getByRole('button', { name: 'Done' }))
	expect(
		within(screen.getByRole('list', { name: 'Cards' }))
			.getAllByRole('button')
			.map((row) => row.querySelector('.card-browse-row__name')?.textContent)
	).toEqual(['Yubel - The Loving Defender Forever'])
})

test('shows the suggestions that have cards, each with how often the set links to it', async () => {
	renderPage()

	const column = await screen.findByRole('region', { name: 'Named Materials' })
	expect(within(column).getByRole('link', { name: /Yubel/ })).toHaveAttribute('href', '/card/78371393')
	expect(within(column).getByText('2 links')).toBeInTheDocument()
	// the card's frame colour rings its art (rcl's frame class) rather than closing the row as a dot
	expect(column.querySelector('.card-frame-ring')).toHaveClass('effect-ygo-card-style')
	// the kinds of link with no cards are left out
	expect(screen.queryByRole('region', { name: 'Referenced By' })).not.toBeInTheDocument()
})

test('opens a whole suggestion column in a popup', async () => {
	renderPage()

	const column = await screen.findByRole('region', { name: 'References' })
	expect(within(column).getAllByRole('link')).toHaveLength(8)

	fireEvent.click(within(column).getByRole('button', { name: 'Show all 10' }))
	const popup = screen.getByRole('dialog', { name: 'References' })
	expect(within(popup).getAllByRole('link')).toHaveLength(10)

	fireEvent.click(within(popup).getByRole('button', { name: 'Close' }))
	await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
})
