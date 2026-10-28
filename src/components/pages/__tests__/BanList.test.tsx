import { CancelTokenSource } from 'axios'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import BanList from '../BanList'
import MuiTheme from '../../MuiTheme'
import FetchHandler from '../../../helper/FetchHandler'

// skc-rcl pulls in esm only chart libraries
jest.mock('skc-rcl', () => ({
	YGOCardColorIndicator: () => null,
	CardImageRounded: () => null,
	DateBadge: () => null,
	YGOCardWithImage: () => null,
}))

type Request = { url: string; onJsonReceived: (res: unknown) => void; token?: CancelTokenSource }

// requests stay open until a test answers them, so it can choose the order they come back in
let requests: Request[]
const handleFetch = jest.spyOn(FetchHandler, 'handleFetch')
beforeEach(() => {
	requests = []
	handleFetch.mockImplementation((url, onJsonReceived, _useDefaultErrorHandler, token) => {
		requests.push({ url, onJsonReceived: onJsonReceived as (res: unknown) => void, token })
	})
	window.scrollTo = jest.fn()
})

// a data router like the app's - its navigate keeps one identity, which the format effect depends on
function renderBanList() {
	render(
		<ThemeProvider theme={MuiTheme}>
			<RouterProvider router={createMemoryRouter([{ path: '/ban_list/:specifiedFormat', element: <BanList /> }], { initialEntries: ['/ban_list/TCG'] })} />
		</ThemeProvider>
	)
}

const datesRequest = (format: string) => requests.find(({ url }) => url.endsWith(`/ban_list/dates?format=${format}`)) as Request
const answerDates = (format: string, dates: string[]) =>
	act(() => datesRequest(format).onJsonReceived({ banListDates: dates.map((effectiveDate) => ({ effectiveDate })) }))

test('ignores dates for a format the reader has already switched away from', async () => {
	renderBanList()

	// switch to Master Duel while the TCG dates are still loading
	fireEvent.click(await screen.findByRole('button', { name: 'Master Duel' }))
	expect(datesRequest('TCG').token?.token.reason).toBeDefined()

	answerDates('MD', ['2026-09-01'])
	// the slower TCG answer arrives last
	answerDates('TCG', ['2026-10-19'])

	const listRequests = requests.filter(({ url }) => !url.includes('/dates'))
	expect(listRequests.map(({ url }) => url.replace(/^.*\/ban_list\//, ''))).toEqual([
		'2026-09-01/new?format=MD',
		'2026-09-01/removed?format=MD',
		'2026-09-01/cards?format=MD',
	])
})

test('ignores a list the reader has already moved on from', async () => {
	renderBanList()

	answerDates('TCG', ['2026-10-19'])
	const tcgCards = requests.find(({ url }) => url.includes('2026-10-19/cards')) as Request

	fireEvent.click(await screen.findByRole('button', { name: 'Master Duel' }))
	expect(tcgCards.token?.token.reason).toBeDefined()

	// the TCG list arriving after the switch doesn't fill the page
	act(() =>
		tcgCards.onJsonReceived({
			forbidden: [{ cardID: '1', cardName: 'Pot of Greed', cardColor: 'Spell', cardEffect: '' }],
			limited: [],
			semiLimited: [],
			numForbidden: 1,
			numLimited: 0,
			numSemiLimited: 0,
		})
	)
	expect(screen.queryByText('Pot of Greed')).not.toBeInTheDocument()
})

test('going back from a card shows the list as it was left, without loading it again', async () => {
	const router = createMemoryRouter(
		[
			{ path: '/ban_list/:specifiedFormat', element: <BanList /> },
			{ path: '/card/:cardId', element: <p>Card page</p> },
		],
		{ initialEntries: ['/ban_list/TCG'] }
	)
	render(
		<ThemeProvider theme={MuiTheme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	)

	answerDates('TCG', ['2026-10-19', '2026-09-21'])
	// the reader picks the older list
	fireEvent.mouseDown(await screen.findByRole('combobox', { name: 'Ban list date' }))
	fireEvent.click(screen.getByRole('option', { name: /Sep 21, 2026/ }))

	const answer = (path: string, json: unknown) =>
		act(() => (requests.find(({ url }) => url.includes(`2026-09-21/${path}`)) as Request).onJsonReceived(json))
	answer('new', { newForbidden: [], newLimited: [], newSemiLimited: [], numNewForbidden: 0, numNewLimited: 0, numNewSemiLimited: 0 })
	answer('removed', { removedCards: [], numRemoved: 0 })
	answer('cards', {
		forbidden: [{ cardID: '1', cardName: 'Pot of Greed', cardColor: 'Spell', cardEffect: '' }],
		limited: [],
		semiLimited: [],
		numForbidden: 1,
		numLimited: 0,
		numSemiLimited: 0,
	})
	expect(await screen.findByText('Pot of Greed')).toBeInTheDocument()

	await act(() => router.navigate('/card/1'))
	const numRequests = requests.length
	await act(() => router.navigate(-1))

	// back on the same history entry, so ScrollRestoration can find its position
	expect(router.state.location.key).toBe('default')
	expect(screen.getByText('Pot of Greed')).toBeInTheDocument()
	expect(screen.getByRole('combobox', { name: 'Ban list date' })).toHaveTextContent('Sep 21, 2026')
	expect(requests).toHaveLength(numRequests)
})
