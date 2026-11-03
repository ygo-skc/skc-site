import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

import TierListSearch from '../TierListSearch'
import { emptyTierList, TierListState } from '../tierListState'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

const card = (id: string, name: string): YGOCard.Deets => ({ cardID: id, cardName: name, cardColor: 'effect', cardEffect: '' })
const ash = card('14558127', 'Ash Blossom & Joyous Spring')
const veiler = card('97268402', 'Effect Veiler')
const imperm = card('10045474', 'Infinite Impermanence')

type Call = { url: string; respond: (json: unknown) => void; reject: (err: unknown) => void }
let calls: Call[]
const onAdded = jest.fn()

beforeEach(() => {
	jest.useFakeTimers()
	calls = []
	onAdded.mockClear()
	jest.spyOn(FetchHandler, 'handleFetch').mockImplementation((url, onJsonReceived) => {
		return new Promise<void>((resolve, reject) => {
			calls.push({
				url,
				respond: (json) => {
					;(onJsonReceived as (json: unknown) => void)(json)
					resolve()
				},
				reject,
			})
		})
	})
})

// only the fetch spy - jest-location-mock's spies on window.location have to stay
afterEach(() => {
	jest.useRealTimers()
	jest.mocked(FetchHandler.handleFetch).mockRestore()
})

function renderSearch(list: TierListState = emptyTierList()) {
	const dispatch = jest.fn()
	render(
		<ThemeProvider theme={MuiTheme}>
			<MemoryRouter>
				<TierListSearch list={list} dispatch={dispatch} onAdded={onAdded} />
			</MemoryRouter>
		</ThemeProvider>
	)
	return dispatch
}

function type(text: string) {
	fireEvent.change(screen.getByRole('combobox', { name: 'Search cards by name or passcode' }), { target: { value: text } })
	act(() => jest.advanceTimersByTime(150))
}

test('searches by name', () => {
	renderSearch()
	type('ash blossom')

	expect(calls).toHaveLength(1)
	expect(calls[0].url).toMatch(/\/api\/v1\/card\/search\?limit=10&cName=ash%20blossom$/)
})

test('searches a passcode by name and id', () => {
	renderSearch()
	type('14558127')

	expect(calls[0].url).toMatch(/\?limit=10&cName=14558127&cId=14558127$/)
})

test('shows Add, In tray, or Ranked <tier> per result', async () => {
	const list = emptyTierList()
	list.tray = [veiler]
	list.tiers.S = [imperm]
	renderSearch(list)
	type('a')
	await act(async () => calls[0].respond([ash, veiler, imperm]))

	expect(screen.getByRole('option', { name: 'Ash Blossom & Joyous Spring, Add' })).toBeInTheDocument()
	expect(screen.getByRole('option', { name: 'Effect Veiler, In tray' })).toBeInTheDocument()
	expect(screen.getByRole('option', { name: 'Infinite Impermanence, Ranked S' })).toBeInTheDocument()
})

test('Add puts the card in the tray', async () => {
	const dispatch = renderSearch()
	type('a')
	await act(async () => calls[0].respond([ash, veiler]))

	fireEvent.click(screen.getByRole('option', { name: 'Effect Veiler, Add' }))
	expect(dispatch).toHaveBeenLastCalledWith({ type: 'add', card: veiler })
})

test('up / down move the highlight and Enter adds it', async () => {
	const dispatch = renderSearch()
	type('a')
	await act(async () => calls[0].respond([ash, veiler]))
	const field = screen.getByRole('combobox')

	expect(screen.getByRole('option', { name: /^Ash Blossom/ })).toHaveAttribute('aria-selected', 'true')
	fireEvent.keyDown(field, { key: 'ArrowDown' })
	expect(screen.getByRole('option', { name: /^Effect Veiler/ })).toHaveAttribute('aria-selected', 'true')
	expect(field).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: /^Effect Veiler/ }).id)

	fireEvent.keyDown(field, { key: 'Enter' })
	expect(dispatch).toHaveBeenLastCalledWith({ type: 'add', card: veiler })
})

test('up / down scroll the highlighted result into the popup', async () => {
	renderSearch()
	type('a')
	await act(async () => calls[0].respond([ash, veiler]))
	const popup = screen.getByRole('listbox', { name: 'Search results' }).closest('.tier-list-search__popup') as HTMLElement
	const rect = (top: number, bottom: number) => () => ({ top, bottom } as DOMRect)
	popup.getBoundingClientRect = rect(100, 200)

	screen.getByRole('option', { name: /^Effect Veiler/ }).getBoundingClientRect = rect(180, 250)
	fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
	expect(popup.scrollTop).toBe(50)

	screen.getByRole('option', { name: /^Ash Blossom/ }).getBoundingClientRect = rect(50, 120)
	fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
	expect(popup.scrollTop).toBe(0)
})

test('tells the page when a card is added, and only then', async () => {
	renderSearch({ ...emptyTierList(), tray: [veiler] })
	type('a')
	await act(async () => calls[0].respond([ash, veiler]))

	fireEvent.click(screen.getByRole('option', { name: 'Effect Veiler, In tray' }))
	expect(onAdded).not.toHaveBeenCalled()

	fireEvent.click(screen.getByRole('option', { name: 'Ash Blossom & Joyous Spring, Add' }))
	expect(onAdded).toHaveBeenCalledWith(ash)
})

test('Enter on a card already on the page adds nothing', async () => {
	const list = emptyTierList()
	list.tray = [ash]
	const dispatch = renderSearch(list)
	type('a')
	await act(async () => calls[0].respond([ash]))

	fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
	expect(dispatch).not.toHaveBeenCalled()
})

test('ignores a stale answer', async () => {
	renderSearch()
	type('ash')
	type('veiler')
	await act(async () => calls[1].respond([veiler]))
	await act(async () => calls[0].respond([ash]))

	expect(screen.getByRole('option', { name: /^Effect Veiler/ })).toBeInTheDocument()
	expect(screen.queryByRole('option', { name: /^Ash Blossom/ })).not.toBeInTheDocument()
})

test('says when search fails', async () => {
	renderSearch()
	type('ash')
	await act(async () => calls[0].reject(new Error('Network Error')))

	expect(screen.getByText("Couldn't search cards")).toBeInTheDocument()
	expect(window.location.replace).not.toHaveBeenCalled()
})

test('the failure note hides like results do', async () => {
	renderSearch()
	type('ash')
	await act(async () => calls[0].reject(new Error('Network Error')))
	const field = screen.getByRole('combobox')

	fireEvent.keyDown(field, { key: 'Escape' })
	expect(screen.getByText("Couldn't search cards")).not.toBeVisible()

	fireEvent.focus(field)
	expect(screen.getByText("Couldn't search cards")).toBeVisible()
})

test('Enter while the next answer loads adds nothing', async () => {
	const dispatch = renderSearch()
	type('dark')
	await act(async () => calls[0].respond([ash]))
	type('dark magician girl')

	const field = screen.getByRole('combobox')
	fireEvent.keyDown(field, { key: 'ArrowDown' })
	fireEvent.keyDown(field, { key: 'Enter' })
	expect(dispatch).not.toHaveBeenCalled()
})

test('each addable result has an Add button, and others show their place instead', async () => {
	const list = emptyTierList()
	list.tray = [veiler]
	const dispatch = renderSearch(list)
	type('a')
	await act(async () => calls[0].respond([ash, veiler]))

	expect(screen.getAllByRole('button', { name: 'Add' })).toHaveLength(1)
	fireEvent.click(screen.getByRole('button', { name: 'Add' }))
	expect(dispatch).toHaveBeenCalledTimes(1)
	expect(dispatch).toHaveBeenCalledWith({ type: 'add', card: ash })
	expect(screen.getByText('In tray')).toBeInTheDocument()
})

test('results show the name without the card type', async () => {
	renderSearch()
	type('a')
	await act(async () => calls[0].respond([{ ...ash, monsterType: 'Zombie/Tuner/Effect' }]))

	expect(screen.getByRole('option', { name: /^Ash Blossom/ })).not.toHaveTextContent('Zombie/Tuner/Effect')
})

test('results float over the page instead of pushing it down', async () => {
	renderSearch()
	type('a')
	await act(async () => calls[0].respond([ash, veiler]))

	const popup = screen.getByRole('listbox', { name: 'Search results' }).closest('.tier-list-search__popup') as HTMLElement
	expect(popup).not.toBeNull()
	expect(popup.style.position).toBe('fixed')
})

describe('dismissing', () => {
	async function openResults() {
		renderSearch()
		type('a')
		await act(async () => calls[0].respond([ash, veiler]))
		expect(screen.getByRole('listbox', { name: 'Search results' })).toBeVisible()
	}

	test('Esc hides the results, a second Esc clears the search', async () => {
		await openResults()
		const field = screen.getByRole('combobox')

		fireEvent.keyDown(field, { key: 'Escape' })
		expect(screen.queryByRole('option')).not.toBeInTheDocument()
		expect(field).toHaveValue('a')
		expect(field).toHaveAttribute('aria-expanded', 'false')

		fireEvent.keyDown(field, { key: 'Escape' })
		expect(field).toHaveValue('')
	})

	test('results hidden with Esc stay hidden going back', async () => {
		await openResults()
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
		cleanup()

		renderSearch()
		expect(screen.getByRole('combobox')).toHaveValue('a')
		expect(screen.queryByRole('option')).not.toBeInTheDocument()
		expect(calls).toHaveLength(1)
	})

	test('a click outside hides the results, focusing the field brings them back', async () => {
		await openResults()
		act(() => jest.advanceTimersByTime(0))

		fireEvent.click(document.body)
		expect(screen.queryByRole('option')).not.toBeInTheDocument()

		fireEvent.focus(screen.getByRole('combobox'))
		expect(screen.getByRole('option', { name: 'Ash Blossom & Joyous Spring, Add' })).toBeInTheDocument()
	})

	test('a click inside the results keeps them open', async () => {
		await openResults()
		act(() => jest.advanceTimersByTime(0))

		fireEvent.click(screen.getByRole('option', { name: 'Effect Veiler, Add' }))
		expect(screen.getByRole('option', { name: 'Ash Blossom & Joyous Spring, Add' })).toBeInTheDocument()
	})

	test('the clear button empties the search and returns focus to the field', async () => {
		await openResults()

		fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
		expect(screen.getByRole('combobox')).toHaveValue('')
		expect(screen.getByRole('combobox')).toHaveFocus()
		expect(screen.queryByRole('option')).not.toBeInTheDocument()
	})
})
