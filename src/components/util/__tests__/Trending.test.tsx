import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import Trends from '../Trending'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

jest.mock('skc-rcl', () => ({
	CardImageRounded: () => null,
	ProductImage: () => null,
}))

afterEach(() => {
	jest.restoreAllMocks()
})

const cardTrends = {
	metrics: [
		{ resource: { cardID: '14558127', cardName: 'Ash Blossom & Joyous Spring', cardColor: 'Effect', cardEffect: 'Negate the effect.' }, change: 4, occurrences: 2418 },
		{ resource: { cardID: '23434538', cardName: 'Maxx "C"', cardColor: 'Pendulum-Effect' }, change: -1, occurrences: 1973 },
		{ resource: { cardID: '27204311', cardName: 'Nibiru, the Primal Being' }, change: 0, occurrences: 1288 },
	],
}

const productTrends = {
	metrics: [{ resource: { productId: 'RA03', productName: 'Rage of the Abyss', productType: 'Pack', productReleaseDate: '2024-11-07' }, change: 3, occurrences: 980 }],
}

function renderTrends() {
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(<T,>(endPoint: string, onJsonReceived: (res: T) => void) => {
		onJsonReceived((endPoint.endsWith('/CARD') ? cardTrends : productTrends) as T)
		return Promise.resolve()
	})

	return render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<Trends />
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('verify the top card is spotlighted and also listed as rank 1 for narrow layouts', async () => {
	renderTrends()

	const spotlight = (await screen.findByText('#1 trending')).closest('a')
	expect(spotlight).toHaveAttribute('href', '/card/14558127')
	expect(within(spotlight as HTMLElement).getByText('Ash Blossom & Joyous Spring')).toBeInTheDocument()
	expect(within(spotlight as HTMLElement).getByText('Negate the effect.')).toBeInTheDocument()

	const rows = within(screen.getByRole('list')).getAllByRole('listitem')
	expect(rows).toHaveLength(3)
	expect(rows[0]).toHaveClass('trending__row--first')
	expect(within(rows[0]).getByRole('link')).toHaveAttribute('href', '/card/14558127')
	expect(within(rows[1]).getByText('Pendulum Effect · 1973 hits')).toBeInTheDocument()
	// the rows ring their art in the card's frame colour
	expect(rows[1].querySelector('.card-frame-ring')).toHaveClass('pendulum-effect-ygo-card-style')
})

test('verify coming back to the page shows the trends and the picked tab without fetching them again', async () => {
	const { unmount } = renderTrends()
	fireEvent.click(await screen.findByRole('button', { name: 'Products' }))
	unmount()

	// same history entry, so both lists and the tab are still there
	renderTrends()
	expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute('aria-pressed', 'true')
	expect(screen.getByText('Rage of the Abyss', { selector: '.trending__name' })).toBeInTheDocument()
	expect(FetchHandler.handleFetch).toHaveBeenCalledTimes(2)
})

test('verify all 10 trends are listed', async () => {
	const metrics = Array.from({ length: 12 }, (_, i) => ({ resource: { cardID: `${i}`, cardName: `Card ${i}` }, change: 0, occurrences: 12 - i }))
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation(<T,>(endPoint: string, onJsonReceived: (res: T) => void) => {
		onJsonReceived((endPoint.endsWith('/CARD') ? { metrics } : productTrends) as T)
		return Promise.resolve()
	})
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<Trends />
			</MemoryRouter>
		</ThemeProvider>
	)

	expect(await screen.findAllByRole('listitem')).toHaveLength(10)
	expect(screen.getByText('Card 9')).toBeInTheDocument()
	expect(screen.queryByText('Card 10')).not.toBeInTheDocument()
})

test('verify each trend reads its movement out', async () => {
	renderTrends()

	// the spotlight and its row both read "Up 4"
	expect(await screen.findAllByText('Up 4')).toHaveLength(2)
	expect(screen.getByText('Down 1')).toHaveClass('trending__sr-only')
	expect(screen.getByText('No change')).toBeInTheDocument()
	// the arrows are hidden from screen readers so the movement isn't read twice
	expect(screen.getByText('▼ 1')).toHaveAttribute('aria-hidden', 'true')
})

test('verify the toggle switches to trending products', async () => {
	renderTrends()

	fireEvent.click(await screen.findByRole('button', { name: 'Products' }))

	expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute('aria-pressed', 'true')
	const spotlight = screen.getByText('#1 trending').closest('a') as HTMLElement
	expect(spotlight).toHaveAttribute('href', '/product/RA03')
	expect(within(spotlight).getByText('Pack · Released Nov 7, 2024')).toBeInTheDocument()
	expect(screen.queryByText('Maxx "C"')).not.toBeInTheDocument()
})
