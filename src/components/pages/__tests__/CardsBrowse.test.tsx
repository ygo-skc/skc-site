import { CancelTokenSource } from 'axios'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import CardsBrowse from '../CardsBrowse'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	Section: ({ sectionName, children }: { sectionName: string; children: React.ReactNode }) => <section aria-label={sectionName}>{children}</section>,
	YGOCardColorIndicator: () => null,
	YGOCardWithImage: ({ card }: { card: YGOCard.Deets }) => <span data-testid='grid-card'>{card.cardName}</span>,
	YGOCardPreview: ({ card }: { card: YGOCard.Deets }) => (
		<div data-testid='preview'>
			{card.cardName}: {card.cardEffect}
		</div>
	),
}))

const criteria = { cardColors: ['Synchro'], attributes: ['Dark', 'Light'], monsterTypes: ['Dragon'], monsterSubTypes: [], levels: [8], ranks: [], linkRatings: [] }

const cards = [
	{ cardID: '04179255', cardName: 'Ancient Pixie Dragon', cardColor: 'Synchro', cardEffect: '1 Tuner...', monsterType: 'Dragon/Synchro/Effect', monsterAssociation: { level: 7 } },
	{ cardID: '88643579', cardName: 'Dark End Dragon', cardColor: 'Synchro', cardEffect: '1 Tuner...', monsterType: 'Dragon/Synchro/Effect', monsterAssociation: { level: 8 } },
]

const answerFetch = (url: string, onJsonReceived: (res: unknown) => void) => {
	if (url.includes('criteria')) onJsonReceived(criteria)
	else if (url.includes('browse')) onJsonReceived({ results: cards, numResults: cards.length })
	// a single card's details - the full effect the browse results cut short
	else {
		onJsonReceived({ ...cards.find((card) => url.endsWith(card.cardID)), cardEffect: 'full effect' })
		return Promise.resolve()
	}
}

const handleFetch = jest.spyOn(FetchHandler, 'handleFetch')
beforeEach(() => handleFetch.mockImplementation(answerFetch))

const expectCount = (text: string) => expect(document.querySelector('.card-browse__count')?.textContent).toBe(text)

function renderPage() {
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<CardsBrowse />
			</MemoryRouter>
		</ThemeProvider>
	)
}

test('shows picked criteria as tokens inside the field and removes them', async () => {
	renderPage()

	// the results grid is lazy loaded, so the page suspends until it arrives
	expect(await screen.findByRole('heading', { level: 1, name: 'Find cards by what they are' })).toBeInTheDocument()
	expectCount('All 2 cards · sorted by name')

	const field = screen.getByRole('combobox', { name: 'Filter cards' })
	fireEvent.change(field, { target: { value: 'dar' } })
	fireEvent.click(screen.getByRole('option', { name: 'Dark Attribute' }))
	// a picked suggestion clears what was typed
	expect(field).toHaveValue('')

	const header = field.closest('.card-browse-header') as HTMLElement
	const token = within(header).getByRole('button', { name: 'Dark' })
	expect(token).toHaveClass('card-browse-token')
	expect(handleFetch).toHaveBeenLastCalledWith(expect.stringContaining('attributes=Dark&'), expect.any(Function), false, expect.anything(), 10000)
	expectCount('2 cards · sorted by name')

	fireEvent.click(within(token).getByTestId('CancelIcon'))
	expect(within(header).queryByRole('button', { name: 'Dark' })).not.toBeInTheDocument()
	expectCount('All 2 cards · sorted by name')
})

test('adds every filter a typed phrase names at once', async () => {
	renderPage()
	await screen.findByRole('heading', { level: 1 })

	const field = screen.getByRole('combobox', { name: 'Filter cards' })
	// an empty field explains what it understands
	fireEvent.focus(field)
	expect(screen.getByText('Type filters in words - try “xyz rank 4” or “fire warrior”')).toBeInTheDocument()

	fireEvent.change(field, { target: { value: 'dark dragons lv8 blorp' } })

	expect(screen.getByRole('option', { name: /No filter matches “blorp”/ })).toHaveAttribute('aria-disabled', 'true')
	expect(screen.getByRole('option', { name: 'Dragon Monster type' })).toBeInTheDocument()
	const addAll = screen.getByRole('option', { name: /Add all 3 filters/ })
	expect(addAll).toHaveTextContent('Dark AttributeDragon Monster typeLevel 8')
	fireEvent.click(addAll)

	const header = field.closest('.card-browse-header') as HTMLElement
	expect(within(header).getAllByRole('button', { name: /^(Dark|Dragon|Level 8)$/ })).toHaveLength(3)
	expect(handleFetch).toHaveBeenLastCalledWith(
		expect.stringContaining('attributes=Dark&monsterTypes=Dragon&monsterSubTypes=&levels=8&'),
		expect.any(Function),
		false,
		expect.anything(),
		10000
	)
})

test('edits the same criteria from the dropdown pills', async () => {
	renderPage()
	await screen.findByRole('heading', { level: 1 })

	fireEvent.click(screen.getByRole('button', { name: 'Level / Rank / Link' }))
	const levels = screen.getByRole('dialog', { name: 'Level / Rank / Link' })
	fireEvent.click(within(levels).getByRole('button', { name: 'Level 8' }))
	expect(within(levels).getByRole('button', { name: 'Level 8' })).toHaveAttribute('aria-pressed', 'true')
	expect(handleFetch).toHaveBeenLastCalledWith(expect.stringContaining('levels=8&'), expect.any(Function), false, expect.anything(), 10000)

	fireEvent.click(within(levels).getByRole('button', { name: 'Done' }))
	const header = document.querySelector('.card-browse-header') as HTMLElement
	expect(within(header).getByRole('button', { name: 'Level 8' })).toHaveClass('card-browse-token')
	expect(screen.getByRole('button', { name: 'Level / Rank / Link Level 8' })).toHaveClass('card-browse-pill--active')

	fireEvent.click(screen.getByRole('button', { name: 'Level / Rank / Link Level 8' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Clear' }))
	expectCount('All 2 cards · sorted by name')
})

test('lists results with a preview of the picked card, fetching its full details', async () => {
	jest.useFakeTimers()
	renderPage()
	await screen.findByRole('heading', { level: 1 })

	fireEvent.click(screen.getByRole('button', { name: 'Attribute' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Dark' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Done' }))

	const list = screen.getByRole('list', { name: 'Cards' })
	expect(within(list).getAllByRole('button')).toHaveLength(2)
	expect(within(list).getByRole('button', { name: /Ancient Pixie Dragon/ })).toHaveAttribute('aria-pressed', 'true')

	const darkEnd = within(list).getByRole('button', { name: /Dark End Dragon/ })
	fireEvent.click(darkEnd)
	expect(darkEnd).toHaveAttribute('aria-pressed', 'true')
	const preview = screen.getByRole('complementary', { name: 'Preview' })
	expect(within(preview).getByText('2 of 2')).toBeInTheDocument()
	expect(within(preview).getByTestId('preview')).toHaveTextContent('Dark End Dragon: 1 Tuner...')

	act(() => jest.advanceTimersByTime(150))
	expect(handleFetch).toHaveBeenLastCalledWith(expect.stringMatching(/card\/88643579$/), expect.any(Function), false)
	expect(within(preview).getByTestId('preview')).toHaveTextContent('Dark End Dragon: full effect')
	expect(within(preview).getByRole('link', { name: 'Open card page' })).toHaveAttribute('href', '/card/88643579')

	// arrow keys move the pick through the list
	fireEvent.keyDown(darkEnd, { key: 'ArrowUp' })
	expect(within(list).getByRole('button', { name: /Ancient Pixie Dragon/ })).toHaveAttribute('aria-pressed', 'true')
	// only the picked row is a tab stop, so tab goes on to the preview
	expect(within(list).getByRole('button', { name: /Ancient Pixie Dragon/ })).toHaveAttribute('tabindex', '0')
	expect(darkEnd).toHaveAttribute('tabindex', '-1')
	jest.useRealTimers()
})

test('opens the preview inline under the tapped row on phones', async () => {
	const matchMedia = window.matchMedia
	window.matchMedia = jest.fn().mockImplementation((query: string) => ({
		matches: query.includes('max-width'),
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
	}))
	renderPage()
	await screen.findByRole('heading', { level: 1 })
	// a shorter hint, so the example isn't cut off
	const field = screen.getByRole('combobox', { name: 'Filter cards' })
	expect(field).toHaveAttribute('placeholder', 'Try “light dragon lv 4”')

	fireEvent.click(screen.getByRole('button', { name: 'Attribute' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Dark' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Done' }))
	expect(field).toHaveAttribute('placeholder', 'Add more')

	expect(screen.queryByRole('complementary', { name: 'Preview' })).not.toBeInTheDocument()
	const darkEnd = screen.getByRole('button', { name: /Dark End Dragon/ })
	expect(darkEnd).toHaveAttribute('aria-expanded', 'false')

	fireEvent.click(darkEnd)
	expect(darkEnd).toHaveAttribute('aria-expanded', 'true')
	const row = darkEnd.closest('li') as HTMLElement
	expect(within(row).getByTestId('preview')).toHaveTextContent('Dark End Dragon')
	expect(within(row).getByRole('link', { name: 'Open card page' })).toHaveAttribute('href', '/card/88643579')

	fireEvent.click(darkEnd)
	expect(within(row).queryByTestId('preview')).not.toBeInTheDocument()
	window.matchMedia = matchMedia
})

test('keeps the tapped row in place on phones when a peek above it closes', async () => {
	const matchMedia = window.matchMedia
	window.matchMedia = jest.fn().mockImplementation((query: string) => ({
		matches: query.includes('max-width'),
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
	}))
	const scrollBy = jest.fn()
	window.scrollBy = scrollBy
	renderPage()
	await screen.findByRole('heading', { level: 1 })

	fireEvent.click(screen.getByRole('button', { name: /Ancient Pixie Dragon/ }))
	const darkEnd = screen.getByRole('button', { name: /Dark End Dragon/ })
	// tapped at 392px, then pulled up by the closing peek's 533px
	jest
		.spyOn(darkEnd, 'getBoundingClientRect')
		.mockReturnValueOnce({ top: 392 } as DOMRect)
		.mockReturnValueOnce({ top: -141 } as DOMRect)
	fireEvent.click(darkEnd)

	expect(darkEnd).toHaveAttribute('aria-expanded', 'true')
	expect(scrollBy).toHaveBeenCalledWith(0, -533)
	window.matchMedia = matchMedia
})

test('switches the results to a grid of rcl cards linking to each card page', async () => {
	renderPage()
	await screen.findByRole('heading', { level: 1 })

	fireEvent.click(screen.getByRole('button', { name: 'Attribute' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Dark' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Done' }))

	const grid = screen.getByRole('button', { name: 'Grid' })
	expect(grid).toHaveAttribute('aria-pressed', 'false')
	fireEvent.click(grid)
	expect(grid).toHaveAttribute('aria-pressed', 'true')

	const list = screen.getByRole('list', { name: 'Cards' })
	expect(list).toHaveClass('card-browse-grid')
	expect(within(list).getByRole('link', { name: /Dark End Dragon/ })).toHaveAttribute('href', '/card/88643579')
	// rcl's grid card, as on the ban list
	expect(within(list).getAllByTestId('grid-card')).toHaveLength(2)
	expect(screen.queryByRole('complementary', { name: 'Preview' })).not.toBeInTheDocument()
})

test('shows every card before any filter is picked', async () => {
	renderPage()
	await screen.findByRole('heading', { level: 1 })

	expect(handleFetch).toHaveBeenCalledWith(
		expect.stringContaining('browse?cardColors=&attributes=&monsterTypes=&monsterSubTypes=&levels=&ranks=&linkRatings='),
		expect.any(Function),
		false,
		expect.anything(),
		10000
	)
	expectCount('All 2 cards · sorted by name')
	expect(within(screen.getByRole('list', { name: 'Cards' })).getAllByRole('button')).toHaveLength(2)
	// list rows use the host's tn thumbnails
	expect(screen.getByRole('list', { name: 'Cards' }).querySelector('img')).toHaveAttribute('src', 'https://images.thesupremekingscastle.com/cards/tn/04179255.jpg')
})

test('ignores the unfiltered list if it answers after a filter is picked', async () => {
	// hold the unfiltered request, answer filtered ones straight away
	let answerUnfiltered: () => void = () => {}
	handleFetch.mockImplementation((url, onJsonReceived) => {
		if (url.includes('criteria')) onJsonReceived(criteria)
		else if (url.includes('attributes=&')) answerUnfiltered = () => onJsonReceived({ results: cards, numResults: 13456 })
		else onJsonReceived({ results: [cards[1]], numResults: 1 })
	})
	renderPage()
	await screen.findByRole('heading', { level: 1 })

	fireEvent.click(screen.getByRole('button', { name: 'Attribute' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Dark' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Done' }))
	expectCount('1 card · sorted by name')

	act(() => answerUnfiltered())
	expectCount('1 card · sorted by name')
})

test('cancels a request whose criteria changed', async () => {
	const tokens: CancelTokenSource[] = []
	handleFetch.mockImplementation((url, onJsonReceived, _useDefaultErrorHandler, fetchToken) => {
		if (url.includes('criteria')) onJsonReceived(criteria)
		else if (fetchToken) tokens.push(fetchToken)
	})
	renderPage()
	await screen.findByRole('heading', { level: 1 })
	const unfiltered = tokens[tokens.length - 1]
	const cancel = jest.spyOn(unfiltered, 'cancel')

	fireEvent.click(screen.getByRole('button', { name: 'Attribute' }))
	fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Dark' }))
	expect(cancel).toHaveBeenCalled()
})

test('says so in place when the cards fail to load, without leaving the page', async () => {
	handleFetch.mockImplementation((url, onJsonReceived) => {
		if (url.includes('criteria')) onJsonReceived(criteria)
		else return Promise.reject(Object.assign(new Error('timeout of 10000ms exceeded'), { code: 'ECONNABORTED' }))
	})
	renderPage()
	await screen.findByRole('heading', { level: 1 })

	expect(await screen.findByText('Couldn’t load cards - check your connection and try again')).toBeInTheDocument()
	expect(window.location.assign).not.toHaveBeenCalled()
	expect(screen.getByRole('button', { name: 'Attribute' })).toBeEnabled()
})
