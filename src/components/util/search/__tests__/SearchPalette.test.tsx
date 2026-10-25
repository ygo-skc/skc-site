import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import SearchPalette from '../SearchPalette'
import MuiTheme from '../../../MuiTheme'
import FetchHandler from '../../../../helper/FetchHandler'
import { readRecentlyViewed, recordCardView, recordProductView } from '../../../../helper/RecentlyViewed'

// skc-rcl pulls in esm only chart libraries - its card preview is tested in skc-rcl, here it just needs to show which card it's given
jest.mock('skc-rcl', () => ({
	YGOCardPreview: ({ card }: { card: YGOCard.Deets }) => (
		<div>
			<p>{card.cardName}</p>
			<p>{card.monsterAttack}</p>
			<p>{card.cardEffect}</p>
		</div>
	),
	ProductImage: () => null,
}))

// jest maps entities to a pass-through stub (it's esm only) - decode the one entity the tests use
jest.mock('entities', () => ({ decodeHTML: (text: string) => text.replace(/&bull;/g, '•') }))

const results = [
	{
		cardID: '46986414',
		cardName: 'Dark Magician',
		cardColor: 'Normal',
		cardAttribute: 'Dark',
		cardEffect: 'The ultimate wizard in terms of attack and defense.',
		monsterType: 'Spellcaster/Normal',
		monsterAttack: 2500,
		monsterDefense: 2100,
	},
	{
		cardID: '38033121',
		cardName: 'Dark Magician Girl',
		cardColor: 'Effect',
		cardAttribute: 'Dark',
		cardEffect: 'Gains 300 ATK for every "Dark Magician" or "Magician of Black Chaos" in the GY.',
		monsterType: 'Spellcaster/Effect',
		monsterAttack: 2000,
		monsterDefense: 1700,
	},
]

function CurrentPath() {
	return <p data-testid='path'>{useLocation().pathname}</p>
}

function renderPalette(onClose = jest.fn()) {
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter initialEntries={['/about']}>
				<Routes>
					<Route path='*' element={<CurrentPath />} />
				</Routes>
				<SearchPalette open onClose={onClose} />
			</MemoryRouter>
		</ThemeProvider>
	)
	return { onClose, input: screen.getByRole('combobox', { name: 'Search cards' }) }
}

function mockSearch(cards = results) {
	return jest.spyOn(FetchHandler, 'handleFetch').mockImplementation((_endpoint, onJsonReceived) => {
		;(onJsonReceived as (json: unknown) => void)(cards)
		return Promise.resolve()
	})
}

// a window whose width can change mid test - media queries re-evaluate and notify their listeners like a real resize
let isPhoneWidth = false
const mediaListeners = new Set<() => void>()

function mockPhone(isPhone: boolean) {
	isPhoneWidth = isPhone
	window.matchMedia = jest.fn().mockImplementation((query: string) => ({
		get matches() {
			return isPhoneWidth && query.includes('max-width')
		},
		media: query,
		addEventListener: (_type: string, listener: () => void) => mediaListeners.add(listener),
		removeEventListener: (_type: string, listener: () => void) => mediaListeners.delete(listener),
		addListener: (listener: () => void) => mediaListeners.add(listener),
		removeListener: (listener: () => void) => mediaListeners.delete(listener),
	}))
}

function resizeTo(isPhone: boolean) {
	isPhoneWidth = isPhone
	act(() => mediaListeners.forEach((listener) => listener()))
}

beforeEach(() => {
	mockPhone(false)
	localStorage.clear()
})

// today a card and a product, and a card the day before
function recordHistory() {
	const now = new Date()
	const at = (daysAgo: number, hour: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, hour, 0)
	recordCardView(results[1] as never, at(1, 9))
	recordProductView({ productId: 'PHNI', productName: 'Phantom Nightmare', productType: 'Pack', productSubType: 'Core Set' } as YGOProduct.Deets, at(0, 0))
	recordCardView(results[0] as never, at(0, 0))
}

afterEach(() => {
	jest.restoreAllMocks()
})

test('verify jump to destinations show before anything is typed', () => {
	const search = mockSearch()
	renderPalette()

	const jumpTo = screen.getByRole('listbox', { name: 'Jump to' })
	;['Home', 'Ban List', 'Card Browse', 'Product Browse', 'About'].forEach((page) => {
		expect(within(jumpTo).getByRole('option', { name: page })).toBeInTheDocument()
	})
	expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
	expect(screen.queryByRole('button', { name: 'Clear history' })).not.toBeInTheDocument()
	expect(search).not.toHaveBeenCalled()
})

test('verify the arrow keys reach the jump to shortcuts, starting on the first recent', () => {
	recordHistory()
	mockSearch()
	const { input } = renderPalette()
	const active = () => document.getElementById(input.getAttribute('aria-activedescendant') ?? '')?.textContent

	expect(input).toHaveAttribute('aria-controls', expect.stringContaining(screen.getByRole('listbox', { name: 'Jump to' }).id))
	expect(active()).toMatch(/^Dark Magician/)

	fireEvent.keyDown(input, { key: 'ArrowUp' })
	expect(active()).toBe('Home')
	// page shortcuts have no preview
	expect(screen.queryByRole('complementary')).not.toBeInTheDocument()

	fireEvent.keyDown(input, { key: 'ArrowRight' })
	fireEvent.keyDown(input, { key: 'ArrowRight' })
	expect(active()).toBe('Card Browse')
	fireEvent.keyDown(input, { key: 'ArrowLeft' })
	expect(screen.getByRole('option', { name: 'Ban List' })).toHaveAttribute('aria-selected', 'true')

	// down drops back into the list, up from the shortcuts wraps to its bottom
	fireEvent.keyDown(input, { key: 'ArrowDown' })
	expect(active()).toMatch(/^Dark Magician/)
	fireEvent.keyDown(input, { key: 'ArrowUp' })
	fireEvent.keyDown(input, { key: 'ArrowUp' })
	expect(active()).toMatch(/^Dark Magician Girl/)

	fireEvent.keyDown(input, { key: 'ArrowDown' })
	expect(active()).toBe('Home')
	fireEvent.keyDown(input, { key: 'Enter' })
	expect(screen.getByTestId('path')).toHaveTextContent(/^\/$/)
})

test('verify the first shortcut is highlighted when there is no history', () => {
	mockSearch()
	const { input } = renderPalette()

	expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Home' }).id)
	fireEvent.keyDown(input, { key: 'ArrowDown' })
	expect(screen.getByRole('option', { name: 'Ban List' })).toHaveAttribute('aria-selected', 'true')
})

test('verify recently viewed cards and products show under day headings before anything is typed', () => {
	recordHistory()
	mockSearch()
	renderPalette()

	const today = screen.getByRole('group', { name: 'Today' })
	expect(
		within(today)
			.getAllByRole('option')
			.map((option) => option.getAttribute('aria-label'))
	).toEqual(['Dark Magician', 'Phantom Nightmare'])
	expect(within(today).getByRole('option', { name: 'Phantom Nightmare' })).toHaveAccessibleDescription(/Pack · Core Set 12:00/)
	expect(within(screen.getByRole('group', { name: 'Yesterday' })).getByRole('option', { name: 'Dark Magician Girl' })).toBeInTheDocument()
	expect(screen.getByText('Today')).toHaveClass('MuiTypography-subtitle1')
})

test('verify a recent card previews like a search result and a recent product opens its page', () => {
	recordHistory()
	mockSearch()
	const { input, onClose } = renderPalette()

	const preview = screen.getByRole('complementary', { name: 'Card preview' })
	expect(within(preview).getByText('Dark Magician')).toBeInTheDocument()
	expect(within(preview).getByText('The ultimate wizard in terms of attack and defense.')).toBeInTheDocument()

	fireEvent.keyDown(input, { key: 'ArrowDown' })
	expect(screen.getByRole('complementary', { name: 'Product preview' })).toHaveTextContent('Phantom Nightmare')

	fireEvent.keyDown(input, { key: 'Enter' })
	expect(screen.getByTestId('path')).toHaveTextContent('/product/PHNI')
	expect(onClose).toHaveBeenCalled()
})

test('verify card effects are previewed with their html entities decoded', async () => {
	mockSearch([{ ...results[0], cardEffect: '&bull; Add a card from the Deck to the hand.' }] as never)
	const { input } = renderPalette()

	fireEvent.change(input, { target: { value: 'dark magi' } })
	await screen.findByRole('group', { name: 'Cards' })

	expect(within(screen.getByRole('complementary', { name: 'Card preview' })).getByText('• Add a card from the Deck to the hand.')).toBeInTheDocument()
})

test('verify a recent card peeks on phones like a search result', () => {
	recordHistory()
	mockPhone(true)
	mockSearch()
	renderPalette()

	expect(screen.queryByRole('button', { name: 'Preview Phantom Nightmare' })).not.toBeInTheDocument()
	fireEvent.click(screen.getByRole('button', { name: 'Preview Dark Magician Girl' }))

	expect(screen.getByText(/Gains 300 ATK/)).toBeInTheDocument()
})

test('verify clearing the history empties the recents', () => {
	recordHistory()
	mockSearch()
	renderPalette()

	fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))

	expect(screen.getByRole('combobox', { name: 'Search cards' })).toHaveFocus()

	expect(screen.queryByRole('group', { name: 'Today' })).not.toBeInTheDocument()
	expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
	expect(readRecentlyViewed()).toEqual([])
})

test('verify the history is read again each time search opens', () => {
	mockSearch()
	const view = (open: boolean) => (
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<SearchPalette open={open} onClose={jest.fn()} />
			</MemoryRouter>
		</ThemeProvider>
	)
	const { rerender } = render(view(true))
	expect(screen.queryByRole('group', { name: 'Today' })).not.toBeInTheDocument()

	rerender(view(false))
	recordHistory()
	rerender(view(true))

	expect(screen.getByRole('group', { name: 'Today' })).toBeInTheDocument()
})

test('verify typing searches cards by name', async () => {
	const search = mockSearch()
	const { input } = renderPalette()

	fireEvent.change(input, { target: { value: 'dark magi' } })

	const cards = await screen.findByRole('group', { name: 'Cards' })
	expect(within(cards).getAllByRole('option')).toHaveLength(2)
	expect(search).toHaveBeenCalledTimes(1)
	expect(search.mock.calls[0][0]).toContain('cName=dark%20magi')
})

test('verify result text takes its look from theme typography variants', async () => {
	mockSearch()
	const { input } = renderPalette()

	fireEvent.change(input, { target: { value: 'dark magi' } })
	const option = await screen.findByRole('option', { name: 'Dark Magician' })

	expect(screen.getByText('Cards')).toHaveClass('MuiTypography-subtitle2')
	expect(option.querySelector('.search-palette__name')).toHaveClass('MuiTypography-subtitle2')
	expect(option.querySelector('.search-palette__sub')).toHaveClass('MuiTypography-body2')
})

test('verify the highlighted card is previewed', async () => {
	mockSearch()
	const { input } = renderPalette()

	fireEvent.change(input, { target: { value: 'dark magi' } })
	await screen.findByRole('group', { name: 'Cards' })

	const preview = screen.getByRole('complementary', { name: 'Card preview' })
	expect(within(preview).getByText('Dark Magician')).toBeInTheDocument()
	expect(within(preview).getByText('2500')).toBeInTheDocument()

	fireEvent.keyDown(input, { key: 'ArrowDown' })

	expect(within(preview).getByText('Dark Magician Girl')).toBeInTheDocument()
	expect(within(preview).getByText(/Gains 300 ATK/)).toBeInTheDocument()
	expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Dark Magician Girl' }).id)
})

test('verify a spell result does not repeat spell as its attribute', async () => {
	mockSearch([
		{ cardID: '83764718', cardName: 'Monster Reborn', cardColor: 'Spell', cardAttribute: 'Spell', cardEffect: 'Target 1 monster in either GY; Special Summon it.' },
	] as never)
	const { input } = renderPalette()

	fireEvent.change(input, { target: { value: 'monster reborn' } })

	expect(await screen.findByRole('option', { name: 'Monster Reborn' })).toHaveAccessibleDescription('Spell')
})

test('verify enter opens the highlighted card and closes search', async () => {
	mockSearch()
	const { input, onClose } = renderPalette()

	fireEvent.change(input, { target: { value: 'dark magi' } })
	await screen.findByRole('group', { name: 'Cards' })
	fireEvent.keyDown(input, { key: 'ArrowDown' })
	fireEvent.keyDown(input, { key: 'Enter' })

	expect(screen.getByTestId('path')).toHaveTextContent('/card/38033121')
	expect(onClose).toHaveBeenCalled()
})

test('verify jump to destinations hide once something is typed', async () => {
	mockSearch([])
	const { input } = renderPalette()

	fireEvent.change(input, { target: { value: 'ban' } })

	expect(screen.queryByRole('listbox', { name: 'Jump to' })).not.toBeInTheDocument()
	expect(await screen.findByText(/No cards match/)).toBeInTheDocument()

	fireEvent.change(input, { target: { value: '' } })
	fireEvent.click(within(screen.getByRole('listbox', { name: 'Jump to' })).getByRole('option', { name: 'Ban List' }))

	expect(screen.getByTestId('path')).toHaveTextContent('/ban_list')
})

test('verify a skeleton holds the cards place while results load', async () => {
	let respond: (json: unknown) => void = () => undefined
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation((_endpoint, onJsonReceived) => {
		respond = onJsonReceived as (json: unknown) => void
		return Promise.resolve()
	})
	const { input } = renderPalette()
	const listbox = screen.getByRole('listbox', { name: 'Search results' })

	fireEvent.change(input, { target: { value: 'card' } })

	expect(listbox).toHaveAttribute('aria-busy', 'true')
	expect(listbox.querySelectorAll('.search-palette__skeleton')).toHaveLength(5)
	expect(screen.queryByRole('group', { name: 'Cards' })).not.toBeInTheDocument()
	expect(screen.queryByRole('listbox', { name: 'Jump to' })).not.toBeInTheDocument()
	expect(screen.queryByText(/No cards match/)).not.toBeInTheDocument()

	await waitFor(() => expect(FetchHandler.handleFetch).toHaveBeenCalled())
	act(() => respond(results))

	expect(listbox).toHaveAttribute('aria-busy', 'false')
	expect(listbox.querySelector('.search-palette__skeleton')).toBeNull()
	expect(within(screen.getByRole('group', { name: 'Cards' })).getAllByRole('option')).toHaveLength(2)
})

test('verify phones get the list only, with an inline peek instead of the preview column', async () => {
	mockPhone(true)
	mockSearch()
	const { input } = renderPalette()

	fireEvent.change(input, { target: { value: 'dark magi' } })
	await screen.findByRole('group', { name: 'Cards' })

	expect(screen.queryByRole('complementary', { name: 'Card preview' })).not.toBeInTheDocument()

	const peek = screen.getByRole('button', { name: 'Preview Dark Magician Girl' })
	expect(peek).toHaveAttribute('aria-expanded', 'false')
	fireEvent.click(peek)

	expect(peek).toHaveAttribute('aria-expanded', 'true')
	expect(screen.getByText(/Gains 300 ATK/)).toBeInTheDocument()
	expect(screen.getByRole('button', { name: 'Close search' })).toBeInTheDocument()
})

test('verify an open peek closes when the window widens to the desktop layout', async () => {
	mockPhone(true)
	mockSearch()
	const { input } = renderPalette()

	fireEvent.change(input, { target: { value: 'dark magi' } })
	await screen.findByRole('group', { name: 'Cards' })
	fireEvent.click(screen.getByRole('button', { name: 'Preview Dark Magician Girl' }))
	expect(screen.getByText(/Gains 300 ATK/)).toBeInTheDocument()

	resizeTo(false)

	// only the desktop preview column remains, showing the highlighted card
	expect(screen.queryByRole('button', { name: /^Preview/ })).not.toBeInTheDocument()
	expect(screen.queryByText(/Gains 300 ATK/)).not.toBeInTheDocument()
	expect(screen.getByRole('complementary', { name: 'Card preview' })).toBeInTheDocument()
})

test('verify the phone popup pads its list clear of the keyboard and toolbar', () => {
	mockPhone(true)
	jest.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800)
	const viewport = Object.assign(new EventTarget(), { height: 800, offsetTop: 0 })
	Object.defineProperty(window, 'visualViewport', { value: viewport, configurable: true })
	mockSearch()
	renderPalette()

	const popup = screen.getByRole('dialog', { name: 'Search' })
	expect(popup.style.getPropertyValue('--search-palette-covered')).toBe('0px')

	// keyboard and toolbar take the bottom 380px, and the browser nudges the visible area down
	viewport.height = 360
	viewport.offsetTop = 60
	act(() => {
		viewport.dispatchEvent(new Event('resize'))
	})

	expect(popup.style.getPropertyValue('--search-palette-covered')).toBe('380px')
	expect(popup.style.getPropertyValue('--search-palette-top')).toBe('60px')

	// desktop keeps its centred dialog
	resizeTo(false)
	expect(popup.style.getPropertyValue('--search-palette-covered')).toBe('')

	Object.defineProperty(window, 'visualViewport', { value: undefined, configurable: true })
})

test('verify drags on the phone popup only go to the results list when it can scroll', () => {
	mockPhone(true)
	mockSearch()
	const { input } = renderPalette()
	const list = screen.getByRole('listbox', { name: 'Search results' })
	const drag = (target: Element, fromY: number, toY: number) => {
		fireEvent.touchStart(target, { touches: [{ clientY: fromY }] })
		// fireEvent returns false when the drag was cancelled
		return fireEvent.touchMove(target, { touches: [{ clientY: toY }] })
	}

	// the search bar and a list too short to scroll can't pan the page
	expect(drag(input, 300, 200)).toBe(false)
	expect(drag(list, 300, 200)).toBe(false)

	// a list with more to show scrolls, until it reaches an end
	Object.defineProperties(list, { scrollHeight: { value: 1000 }, clientHeight: { value: 300 }, scrollTop: { value: 100, writable: true } })
	expect(drag(list, 300, 200)).toBe(true)
	expect(drag(list, 200, 300)).toBe(true)
	list.scrollTop = 0
	expect(drag(list, 200, 300)).toBe(false)
	list.scrollTop = 700
	expect(drag(list, 300, 200)).toBe(false)
})

test('verify drags on the desktop popup are left alone', () => {
	mockSearch()
	const { input } = renderPalette()

	fireEvent.touchStart(input, { touches: [{ clientY: 300 }] })
	expect(fireEvent.touchMove(input, { touches: [{ clientY: 200 }] })).toBe(true)
})
