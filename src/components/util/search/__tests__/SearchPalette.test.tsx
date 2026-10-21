import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import SearchPalette from '../SearchPalette'
import MuiTheme from '../../../MuiTheme'
import FetchHandler from '../../../../helper/FetchHandler'

// skc-rcl pulls in esm only chart libraries - its card preview is tested in skc-rcl, here it just needs to show which card it's given
jest.mock('skc-rcl', () => ({
	YGOCardPreview: ({ card }: { card: YGOCard.Deets }) => (
		<div>
			<p>{card.cardName}</p>
			<p>{card.monsterAttack}</p>
			<p>{card.cardEffect}</p>
		</div>
	),
}))

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

beforeEach(() => mockPhone(false))

afterEach(() => {
	jest.restoreAllMocks()
})

test('verify jump to destinations show before anything is typed', () => {
	const search = mockSearch()
	renderPalette()

	const jumpTo = screen.getByRole('group', { name: 'Jump to' })
	;['Home', 'Ban List', 'Card Browse', 'Product Browse', 'About'].forEach((page) => {
		expect(within(jumpTo).getByRole('option', { name: new RegExp(page) })).toBeInTheDocument()
	})
	expect(search).not.toHaveBeenCalled()
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

	expect(screen.queryByRole('group', { name: 'Jump to' })).not.toBeInTheDocument()
	expect(await screen.findByText(/No cards match/)).toBeInTheDocument()

	fireEvent.change(input, { target: { value: '' } })
	fireEvent.click(within(screen.getByRole('group', { name: 'Jump to' })).getByRole('option', { name: /Ban List/ }))

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
	expect(screen.queryByRole('group', { name: 'Jump to' })).not.toBeInTheDocument()
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
